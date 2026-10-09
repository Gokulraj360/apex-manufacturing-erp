import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateFuelExpenseDto,
  QueryFuelExpensesDto,
} from '../dto/fuel-expense.dto';
import {
  AuditAction,
  AuditSeverity,
  FuelType,
} from '@prisma/client';

@Injectable()
export class FuelExpenseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Helper to format Prisma Fuel Expense Log with numeric decimals
   */
  private formatExpenseLog(log: any) {
    if (!log) return null;
    return {
      ...log,
      litersOrKwh: log.litersOrKwh != null ? Number(log.litersOrKwh) : 0,
      costPerUnit: log.costPerUnit != null ? Number(log.costPerUnit) : 0,
      totalFuelCost: log.totalFuelCost != null ? Number(log.totalFuelCost) : 0,
      tollCharges: log.tollCharges != null ? Number(log.tollCharges) : 0,
      otherTravelExpenses: log.otherTravelExpenses != null ? Number(log.otherTravelExpenses) : 0,
      totalExpense: log.totalExpense != null ? Number(log.totalExpense) : 0,
      odometerAtFueling: log.odometerAtFueling != null ? Number(log.odometerAtFueling) : 0,
      fuelEfficiencyKmPerLiter: log.fuelEfficiencyKmPerLiter != null ? Number(log.fuelEfficiencyKmPerLiter) : null,
      vehicle: log.vehicle
        ? {
            ...log.vehicle,
            payloadCapacityKg: log.vehicle.payloadCapacityKg != null ? Number(log.vehicle.payloadCapacityKg) : 0,
            totalOdometerKm: log.vehicle.totalOdometerKm != null ? Number(log.vehicle.totalOdometerKm) : 0,
          }
        : undefined,
    };
  }

  /**
   * Get all fuel expense logs with filtering
   */
  async getFuelExpenses(query?: QueryFuelExpensesDto) {
    const where: any = {};

    if (query?.vehicleId) {
      where.vehicleId = query.vehicleId;
    }
    if (query?.fuelType) {
      where.fuelType = query.fuelType as FuelType;
    }
    if (query?.paymentMethod) {
      where.paymentMethod = { equals: query.paymentMethod, mode: 'insensitive' };
    }
    if (query?.startDate || query?.endDate) {
      where.fueledAt = {};
      if (query.startDate) where.fueledAt.gte = new Date(query.startDate);
      if (query.endDate) where.fueledAt.lte = new Date(query.endDate);
    }
    if (query?.search) {
      where.OR = [
        { expenseCode: { contains: query.search, mode: 'insensitive' } },
        { fuelStationName: { contains: query.search, mode: 'insensitive' } },
        { fuelCardTransactionRef: { contains: query.search, mode: 'insensitive' } },
        { recordedBy: { contains: query.search, mode: 'insensitive' } },
        { vehicle: { vehicleNumber: { contains: query.search, mode: 'insensitive' } } },
        { vehicle: { fleetCode: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const expenses = await this.prisma.fuelExpenseLog.findMany({
      where,
      orderBy: { fueledAt: 'desc' },
      include: {
        vehicle: true,
      },
    });

    return expenses.map((e) => this.formatExpenseLog(e));
  }

  /**
   * Get fuel expense log by ID
   */
  async getFuelExpenseById(id: string) {
    const expense = await this.prisma.fuelExpenseLog.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!expense) {
      throw new NotFoundException(`Fuel expense log with ID '${id}' not found`);
    }

    return this.formatExpenseLog(expense);
  }

  /**
   * Log new fuel transaction and calculate efficiency
   */
  async createFuelExpense(dto: CreateFuelExpenseDto) {
    const vehicle = await this.prisma.fleetVehicle.findUnique({
      where: { id: dto.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Fleet vehicle with ID '${dto.vehicleId}' not found`);
    }

    // Generate expenseCode
    const count = await this.prisma.fuelExpenseLog.count();
    const expenseCode = `FUEL-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const totalFuelCost = Number((dto.litersOrKwh * dto.costPerUnit).toFixed(2));
    const tollCharges = dto.tollCharges || 0;
    const otherTravelExpenses = dto.otherTravelExpenses || 0;
    const totalExpense = Number((totalFuelCost + tollCharges + otherTravelExpenses).toFixed(2));

    // Calculate fuel efficiency from previous log
    let fuelEfficiencyKmPerLiter: number | null = null;
    const previousLog = await this.prisma.fuelExpenseLog.findFirst({
      where: { vehicleId: dto.vehicleId },
      orderBy: { fueledAt: 'desc' },
    });

    if (previousLog && dto.odometerAtFueling > Number(previousLog.odometerAtFueling)) {
      const distanceTravelled = dto.odometerAtFueling - Number(previousLog.odometerAtFueling);
      if (dto.litersOrKwh > 0) {
        fuelEfficiencyKmPerLiter = Number((distanceTravelled / dto.litersOrKwh).toFixed(2));
      }
    }

    const created = await this.prisma.fuelExpenseLog.create({
      data: {
        expenseCode,
        vehicleId: dto.vehicleId,
        fuelType: dto.fuelType || vehicle.fuelType,
        litersOrKwh: dto.litersOrKwh,
        costPerUnit: dto.costPerUnit,
        totalFuelCost,
        tollCharges,
        otherTravelExpenses,
        totalExpense,
        odometerAtFueling: dto.odometerAtFueling,
        fuelStationName: dto.fuelStationName,
        fuelCardTransactionRef: dto.fuelCardTransactionRef || null,
        paymentMethod: dto.paymentMethod || 'FLEET_CARD',
        fueledAt: dto.fueledAt ? new Date(dto.fueledAt) : new Date(),
        fuelEfficiencyKmPerLiter,
        recordedBy: dto.recordedBy,
      },
      include: {
        vehicle: true,
      },
    });

    // Update vehicle odometer if higher
    if (dto.odometerAtFueling > Number(vehicle.totalOdometerKm)) {
      await this.prisma.fleetVehicle.update({
        where: { id: vehicle.id },
        data: { totalOdometerKm: dto.odometerAtFueling },
      });
    }

    await this.auditLogService.logAction({
      action: AuditAction.FUEL_EXPENSE_LOGGED,
      severity: AuditSeverity.LOW,
      entityType: 'FuelExpenseLog',
      entityId: created.id,
      description: `Logged fuel receipt [${expenseCode}] for ${vehicle.vehicleNumber} (${dto.litersOrKwh}L @ ₹${dto.costPerUnit}/L = ₹${totalExpense})`,
      userId: dto.recordedBy,
    });

    return this.formatExpenseLog(created);
  }

  /**
   * Delete fuel expense log
   */
  async deleteFuelExpense(id: string) {
    const existing = await this.prisma.fuelExpenseLog.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Fuel expense log with ID '${id}' not found`);
    }

    return this.prisma.fuelExpenseLog.delete({ where: { id } });
  }

  /**
   * Get fuel & expense analytics
   */
  async getExpenseAnalytics() {
    const logs = await this.prisma.fuelExpenseLog.findMany();

    const totalSpend = logs.reduce((acc, l) => acc + Number(l.totalExpense || 0), 0);
    const totalFuelCost = logs.reduce((acc, l) => acc + Number(l.totalFuelCost || 0), 0);
    const totalTolls = logs.reduce((acc, l) => acc + Number(l.tollCharges || 0), 0);
    const totalLiters = logs.reduce((acc, l) => acc + Number(l.litersOrKwh || 0), 0);

    const logsWithEfficiency = logs.filter((l) => l.fuelEfficiencyKmPerLiter != null);
    const avgEfficiency = logsWithEfficiency.length > 0
      ? Number((logsWithEfficiency.reduce((acc, l) => acc + Number(l.fuelEfficiencyKmPerLiter), 0) / logsWithEfficiency.length).toFixed(2))
      : 0;

    const paymentMethodBreakdown: Record<string, number> = {};
    logs.forEach((l) => {
      const method = l.paymentMethod || 'OTHER';
      paymentMethodBreakdown[method] = (paymentMethodBreakdown[method] || 0) + Number(l.totalExpense || 0);
    });

    return {
      totalTransactions: logs.length,
      totalSpend,
      totalFuelCost,
      totalTolls,
      totalLiters,
      avgEfficiency,
      paymentMethodBreakdown,
    };
  }
}

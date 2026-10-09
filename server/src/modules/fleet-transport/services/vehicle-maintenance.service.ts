import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateServiceLogDto,
  UpdateServiceLogDto,
  QueryServiceLogsDto,
} from '../dto/vehicle-maintenance.dto';
import {
  AuditAction,
  AuditSeverity,
  ServiceType,
  ServiceStatus,
  VehicleStatus,
} from '@prisma/client';

@Injectable()
export class VehicleMaintenanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Helper to format Prisma Service Log with numeric decimals
   */
  private formatServiceLog(log: any) {
    if (!log) return null;
    return {
      ...log,
      odometerAtService: log.odometerAtService != null ? Number(log.odometerAtService) : 0,
      laborCost: log.laborCost != null ? Number(log.laborCost) : 0,
      partsCost: log.partsCost != null ? Number(log.partsCost) : 0,
      totalCost: log.totalCost != null ? Number(log.totalCost) : 0,
      nextServiceDueKm: log.nextServiceDueKm != null ? Number(log.nextServiceDueKm) : null,
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
   * Get all vehicle maintenance logs with filtering
   */
  async getServiceLogs(query?: QueryServiceLogsDto) {
    const where: any = {};

    if (query?.vehicleId) {
      where.vehicleId = query.vehicleId;
    }
    if (query?.serviceType) {
      where.serviceType = query.serviceType as ServiceType;
    }
    if (query?.status) {
      where.status = query.status as ServiceStatus;
    }
    if (query?.search) {
      where.OR = [
        { serviceNumber: { contains: query.search, mode: 'insensitive' } },
        { serviceCenter: { contains: query.search, mode: 'insensitive' } },
        { invoiceNumber: { contains: query.search, mode: 'insensitive' } },
        { recordedBy: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
        { vehicle: { vehicleNumber: { contains: query.search, mode: 'insensitive' } } },
        { vehicle: { fleetCode: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const logs = await this.prisma.vehicleServiceLog.findMany({
      where,
      orderBy: { serviceDate: 'desc' },
      include: {
        vehicle: true,
      },
    });

    return logs.map((l) => this.formatServiceLog(l));
  }

  /**
   * Get maintenance log by ID
   */
  async getServiceLogById(id: string) {
    const log = await this.prisma.vehicleServiceLog.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!log) {
      throw new NotFoundException(`Maintenance log with ID '${id}' not found`);
    }

    return this.formatServiceLog(log);
  }

  /**
   * Log a new maintenance service or repair
   */
  async createServiceLog(dto: CreateServiceLogDto) {
    const vehicle = await this.prisma.fleetVehicle.findUnique({
      where: { id: dto.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID '${dto.vehicleId}' not found`);
    }

    // Auto-generate serviceNumber
    const count = await this.prisma.vehicleServiceLog.count();
    const serviceNumber = `SRV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const status = dto.status || ServiceStatus.COMPLETED;
    const laborCost = dto.laborCost || 0;
    const partsCost = dto.partsCost || 0;
    const totalCost = dto.totalCost || laborCost + partsCost;

    const created = await this.prisma.vehicleServiceLog.create({
      data: {
        serviceNumber,
        vehicleId: dto.vehicleId,
        serviceType: dto.serviceType || ServiceType.ROUTINE_PREVENTIVE,
        status,
        odometerAtService: dto.odometerAtService,
        serviceCenter: dto.serviceCenter,
        partsReplaced: dto.partsReplaced || null,
        laborCost,
        partsCost,
        totalCost,
        serviceDate: dto.serviceDate ? new Date(dto.serviceDate) : new Date(),
        nextServiceDueKm: dto.nextServiceDueKm || null,
        nextServiceDueDate: dto.nextServiceDueDate ? new Date(dto.nextServiceDueDate) : null,
        invoiceNumber: dto.invoiceNumber || null,
        notes: dto.notes || null,
        recordedBy: dto.recordedBy,
      },
      include: {
        vehicle: true,
      },
    });

    // Update vehicle odometer and status
    const updateVehicleData: any = {};
    if (dto.odometerAtService > Number(vehicle.totalOdometerKm)) {
      updateVehicleData.totalOdometerKm = dto.odometerAtService;
    }

    if (status === ServiceStatus.IN_PROGRESS && vehicle.status !== VehicleStatus.IN_MAINTENANCE) {
      updateVehicleData.status = VehicleStatus.IN_MAINTENANCE;
    } else if (status === ServiceStatus.COMPLETED && vehicle.status === VehicleStatus.IN_MAINTENANCE) {
      updateVehicleData.status = VehicleStatus.AVAILABLE;
    }

    if (Object.keys(updateVehicleData).length > 0) {
      await this.prisma.fleetVehicle.update({
        where: { id: vehicle.id },
        data: updateVehicleData,
      });
    }

    await this.auditLogService.logAction({
      action: status === ServiceStatus.COMPLETED ? AuditAction.VEHICLE_SERVICE_COMPLETED : AuditAction.VEHICLE_SERVICE_LOGGED,
      severity: AuditSeverity.MEDIUM,
      entityType: 'VehicleServiceLog',
      entityId: created.id,
      description: `Logged maintenance [${serviceNumber}] for vehicle ${vehicle.vehicleNumber} (${created.serviceType}, Total: ₹${totalCost})`,
      userId: dto.recordedBy,
    });

    return this.formatServiceLog(created);
  }

  /**
   * Update service log
   */
  async updateServiceLog(id: string, dto: UpdateServiceLogDto) {
    const existing = await this.prisma.vehicleServiceLog.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!existing) {
      throw new NotFoundException(`Maintenance service log with ID '${id}' not found`);
    }

    const data: any = {};
    if (dto.serviceType) data.serviceType = dto.serviceType as ServiceType;
    if (dto.status) data.status = dto.status as ServiceStatus;
    if (dto.odometerAtService != null) data.odometerAtService = dto.odometerAtService;
    if (dto.serviceCenter) data.serviceCenter = dto.serviceCenter;
    if (dto.partsReplaced !== undefined) data.partsReplaced = dto.partsReplaced;
    if (dto.laborCost != null) data.laborCost = dto.laborCost;
    if (dto.partsCost != null) data.partsCost = dto.partsCost;
    if (dto.totalCost != null) data.totalCost = dto.totalCost;
    if (dto.serviceDate) data.serviceDate = new Date(dto.serviceDate);
    if (dto.nextServiceDueKm != null) data.nextServiceDueKm = dto.nextServiceDueKm;
    if (dto.nextServiceDueDate) data.nextServiceDueDate = new Date(dto.nextServiceDueDate);
    if (dto.invoiceNumber !== undefined) data.invoiceNumber = dto.invoiceNumber;
    if (dto.notes !== undefined) data.notes = dto.notes;

    const updated = await this.prisma.vehicleServiceLog.update({
      where: { id },
      data,
      include: { vehicle: true },
    });

    // If status transitioned to COMPLETED, release vehicle back to AVAILABLE
    if (
      dto.status === ServiceStatus.COMPLETED &&
      existing.status !== ServiceStatus.COMPLETED &&
      existing.vehicle.status === VehicleStatus.IN_MAINTENANCE
    ) {
      await this.prisma.fleetVehicle.update({
        where: { id: existing.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      });

      await this.auditLogService.logAction({
        action: AuditAction.VEHICLE_SERVICE_COMPLETED,
        severity: AuditSeverity.LOW,
        entityType: 'VehicleServiceLog',
        entityId: updated.id,
        description: `Service [${updated.serviceNumber}] marked COMPLETED. Vehicle ${existing.vehicle.vehicleNumber} restored to AVAILABLE.`,
        userId: 'MAINTENANCE_SUPERVISOR',
      });
    }

    return this.formatServiceLog(updated);
  }

  /**
   * Delete service log
   */
  async deleteServiceLog(id: string) {
    const existing = await this.prisma.vehicleServiceLog.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Maintenance service log with ID '${id}' not found`);
    }

    return this.prisma.vehicleServiceLog.delete({ where: { id } });
  }

  /**
   * Get maintenance analytics
   */
  async getMaintenanceStatistics() {
    const logs = await this.prisma.vehicleServiceLog.findMany();

    const totalMaintenanceCost = logs.reduce((acc, l) => acc + Number(l.totalCost || 0), 0);
    const totalPartsCost = logs.reduce((acc, l) => acc + Number(l.partsCost || 0), 0);
    const totalLaborCost = logs.reduce((acc, l) => acc + Number(l.laborCost || 0), 0);

    const typeBreakdown = {
      preventive: logs.filter((l) => l.serviceType === ServiceType.ROUTINE_PREVENTIVE).length,
      breakdown: logs.filter((l) => l.serviceType === ServiceType.BREAKDOWN_REPAIR).length,
      tire: logs.filter((l) => l.serviceType === ServiceType.TIRE_REPLACEMENT).length,
      oilChange: logs.filter((l) => l.serviceType === ServiceType.OIL_CHANGE).length,
      annualOverhaul: logs.filter((l) => l.serviceType === ServiceType.ANNUAL_OVERHAUL).length,
    };

    const statusBreakdown = {
      scheduled: logs.filter((l) => l.status === ServiceStatus.SCHEDULED).length,
      inProgress: logs.filter((l) => l.status === ServiceStatus.IN_PROGRESS).length,
      completed: logs.filter((l) => l.status === ServiceStatus.COMPLETED).length,
      cancelled: logs.filter((l) => l.status === ServiceStatus.CANCELLED).length,
    };

    return {
      totalLogs: logs.length,
      totalMaintenanceCost,
      totalPartsCost,
      totalLaborCost,
      typeBreakdown,
      statusBreakdown,
    };
  }
}

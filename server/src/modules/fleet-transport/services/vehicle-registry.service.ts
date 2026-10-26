import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  QueryVehiclesDto,
} from '../dto/vehicle-registry.dto';
import {
  AuditAction,
  AuditSeverity,
  VehicleType,
  VehicleStatus,
  FuelType,
} from '@prisma/client';

@Injectable()
export class VehicleRegistryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Helper to format Prisma vehicle with numeric decimals
   */
  private formatVehicle(vehicle: any) {
    if (!vehicle) return null;
    return {
      ...vehicle,
      payloadCapacityKg: vehicle.payloadCapacityKg != null ? Number(vehicle.payloadCapacityKg) : 0,
      totalOdometerKm: vehicle.totalOdometerKm != null ? Number(vehicle.totalOdometerKm) : 0,
    };
  }

  /**
   * Get all fleet vehicles with filtering
   */
  async getVehicles(query?: QueryVehiclesDto) {
    const where: any = {};

    if (query?.vehicleType) {
      where.vehicleType = query.vehicleType as VehicleType;
    }
    if (query?.status) {
      where.status = query.status as VehicleStatus;
    }
    if (query?.fuelType) {
      where.fuelType = query.fuelType as FuelType;
    }
    if (query?.assignedDriver) {
      where.assignedDriver = { contains: query.assignedDriver, mode: 'insensitive' };
    }
    if (query?.search) {
      where.OR = [
        { vehicleNumber: { contains: query.search, mode: 'insensitive' } },
        { fleetCode: { contains: query.search, mode: 'insensitive' } },
        { modelName: { contains: query.search, mode: 'insensitive' } },
        { make: { contains: query.search, mode: 'insensitive' } },
        { assignedDriver: { contains: query.search, mode: 'insensitive' } },
        { fastagTagId: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const vehicles = await this.prisma.fleetVehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            serviceLogs: true,
            tripAssignments: true,
            fuelExpenses: true,
            complianceDocuments: true,
          },
        },
      },
    });

    return vehicles.map((v) => this.formatVehicle(v));
  }

  /**
   * Get vehicle by ID with full lifecycle relations
   */
  async getVehicleById(id: string) {
    const vehicle = await this.prisma.fleetVehicle.findUnique({
      where: { id },
      include: {
        serviceLogs: {
          orderBy: { serviceDate: 'desc' },
          take: 10,
        },
        tripAssignments: {
          orderBy: { scheduledStart: 'desc' },
          take: 10,
        },
        fuelExpenses: {
          orderBy: { fueledAt: 'desc' },
          take: 10,
        },
        complianceDocuments: {
          orderBy: { expiryDate: 'asc' },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Fleet vehicle with ID '${id}' not found`);
    }

    return this.formatVehicle(vehicle);
  }

  /**
   * Register a new vehicle in the fleet
   */
  async createVehicle(dto: CreateVehicleDto) {
    // Check if vehicleNumber already exists
    const existing = await this.prisma.fleetVehicle.findUnique({
      where: { vehicleNumber: dto.vehicleNumber },
    });
    if (existing) {
      throw new BadRequestException(`Vehicle with registration number '${dto.vehicleNumber}' already exists`);
    }

    // Auto-generate fleetCode if not provided
    let fleetCode = dto.fleetCode;
    if (!fleetCode) {
      const count = await this.prisma.fleetVehicle.count();
      const typePrefix = dto.vehicleType
        ? dto.vehicleType.substring(0, 3).toUpperCase()
        : 'VEH';
      fleetCode = `FLT-${typePrefix}-${String(count + 1).padStart(4, '0')}`;
    }

    const created = await this.prisma.fleetVehicle.create({
      data: {
        vehicleNumber: dto.vehicleNumber.trim().toUpperCase(),
        fleetCode,
        modelName: dto.modelName,
        make: dto.make,
        year: dto.year || new Date().getFullYear(),
        vehicleType: dto.vehicleType || VehicleType.HEAVY_TRUCK,
        status: dto.status || VehicleStatus.AVAILABLE,
        fuelType: dto.fuelType || FuelType.DIESEL,
        payloadCapacityKg: dto.payloadCapacityKg,
        totalOdometerKm: dto.totalOdometerKm || 0,
        assignedDriver: dto.assignedDriver || null,
        fastagTagId: dto.fastagTagId || null,
        fuelCardNumber: dto.fuelCardNumber || null,
        gpsTelematicsId: dto.gpsTelematicsId || null,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : null,
        insurancePolicyExpiry: dto.insurancePolicyExpiry ? new Date(dto.insurancePolicyExpiry) : null,
        pucExpiry: dto.pucExpiry ? new Date(dto.pucExpiry) : null,
        fitnessExpiry: dto.fitnessExpiry ? new Date(dto.fitnessExpiry) : null,
        roadTaxExpiry: dto.roadTaxExpiry ? new Date(dto.roadTaxExpiry) : null,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.VEHICLE_REGISTERED,
      severity: AuditSeverity.MEDIUM,
      entityType: 'FleetVehicle',
      entityId: created.id,
      description: `Registered new fleet vehicle [${created.fleetCode}] ${created.vehicleNumber} (${created.make} ${created.modelName})`,
      userId: dto.assignedDriver || 'FLEET_ADMIN',
    });

    return this.formatVehicle(created);
  }

  /**
   * Update vehicle specs and operational status
   */
  async updateVehicle(id: string, dto: UpdateVehicleDto) {
    const existing = await this.prisma.fleetVehicle.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Fleet vehicle with ID '${id}' not found`);
    }

    const data: any = {};
    if (dto.vehicleNumber) data.vehicleNumber = dto.vehicleNumber.trim().toUpperCase();
    if (dto.fleetCode) data.fleetCode = dto.fleetCode;
    if (dto.modelName) data.modelName = dto.modelName;
    if (dto.make) data.make = dto.make;
    if (dto.year != null) data.year = dto.year;
    if (dto.vehicleType) data.vehicleType = dto.vehicleType as VehicleType;
    if (dto.status) data.status = dto.status as VehicleStatus;
    if (dto.fuelType) data.fuelType = dto.fuelType as FuelType;
    if (dto.payloadCapacityKg != null) data.payloadCapacityKg = dto.payloadCapacityKg;
    if (dto.totalOdometerKm != null) data.totalOdometerKm = dto.totalOdometerKm;
    if (dto.assignedDriver !== undefined) data.assignedDriver = dto.assignedDriver || null;
    if (dto.fastagTagId !== undefined) data.fastagTagId = dto.fastagTagId || null;
    if (dto.fuelCardNumber !== undefined) data.fuelCardNumber = dto.fuelCardNumber || null;
    if (dto.gpsTelematicsId !== undefined) data.gpsTelematicsId = dto.gpsTelematicsId || null;
    if (dto.purchaseDate) data.purchaseDate = new Date(dto.purchaseDate);
    if (dto.insurancePolicyExpiry) data.insurancePolicyExpiry = new Date(dto.insurancePolicyExpiry);
    if (dto.pucExpiry) data.pucExpiry = new Date(dto.pucExpiry);
    if (dto.fitnessExpiry) data.fitnessExpiry = new Date(dto.fitnessExpiry);
    if (dto.roadTaxExpiry) data.roadTaxExpiry = new Date(dto.roadTaxExpiry);

    const updated = await this.prisma.fleetVehicle.update({
      where: { id },
      data,
    });

    if (dto.status && dto.status !== existing.status) {
      await this.auditLogService.logAction({
        action: AuditAction.VEHICLE_STATUS_UPDATED,
        severity: AuditSeverity.LOW,
        entityType: 'FleetVehicle',
        entityId: updated.id,
        description: `Updated status for vehicle [${updated.fleetCode}] from ${existing.status} to ${dto.status}`,
        userId: 'FLEET_ADMIN',
      });
    }

    return this.formatVehicle(updated);
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(id: string) {
    const existing = await this.prisma.fleetVehicle.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Fleet vehicle with ID '${id}' not found`);
    }

    return this.prisma.fleetVehicle.delete({
      where: { id },
    });
  }

  /**
   * Fleet Overview Metrics
   */
  async getFleetOverviewMetrics() {
    const [
      totalVehicles,
      availableVehicles,
      onTripVehicles,
      inMaintenanceVehicles,
      outOfServiceVehicles,
      activeAssignments,
      recentExpenses,
      expiringCompliance,
    ] = await Promise.all([
      this.prisma.fleetVehicle.count(),
      this.prisma.fleetVehicle.count({ where: { status: VehicleStatus.AVAILABLE } }),
      this.prisma.fleetVehicle.count({ where: { status: VehicleStatus.ON_TRIP } }),
      this.prisma.fleetVehicle.count({ where: { status: VehicleStatus.IN_MAINTENANCE } }),
      this.prisma.fleetVehicle.count({ where: { status: VehicleStatus.OUT_OF_SERVICE } }),
      this.prisma.vehicleAssignment.count({
        where: {
          status: { in: ['DISPATCHED', 'IN_TRANSIT'] },
        },
      }),
      this.prisma.fuelExpenseLog.findMany({
        take: 30,
        orderBy: { fueledAt: 'desc' },
        select: {
          totalExpense: true,
          totalFuelCost: true,
          litersOrKwh: true,
          tollCharges: true,
        },
      }),
      this.prisma.vehicleComplianceDocument.count({
        where: {
          expiryDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
          },
        },
      }),
    ]);

    // Aggregate mileage
    const vehiclesWithMileage = await this.prisma.fleetVehicle.findMany({
      select: { totalOdometerKm: true },
    });
    const totalMileageKm = vehiclesWithMileage.reduce(
      (acc, v) => acc + Number(v.totalOdometerKm || 0),
      0,
    );

    // Aggregate recent expenses
    const totalRecentSpend = recentExpenses.reduce(
      (acc, e) => acc + Number(e.totalExpense || 0),
      0,
    );
    const totalFuelLiters = recentExpenses.reduce(
      (acc, e) => acc + Number(e.litersOrKwh || 0),
      0,
    );
    const totalTolls = recentExpenses.reduce(
      (acc, e) => acc + Number(e.tollCharges || 0),
      0,
    );

    return {
      fleetSize: totalVehicles,
      statusBreakdown: {
        available: availableVehicles,
        onTrip: onTripVehicles,
        inMaintenance: inMaintenanceVehicles,
        outOfService: outOfServiceVehicles,
        decommissioned: totalVehicles - (availableVehicles + onTripVehicles + inMaintenanceVehicles + outOfServiceVehicles),
      },
      activeTrips: activeAssignments,
      totalMileageKm,
      expiringComplianceAlerts: expiringCompliance,
      recentFuelAnalytics: {
        totalSpend: totalRecentSpend,
        litersConsumed: totalFuelLiters,
        tollExpenditure: totalTolls,
      },
    };
  }
}

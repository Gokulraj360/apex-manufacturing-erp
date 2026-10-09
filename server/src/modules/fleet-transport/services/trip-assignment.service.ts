import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateTripAssignmentDto,
  UpdateTripAssignmentDto,
  QueryAssignmentsDto,
} from '../dto/trip-assignment.dto';
import {
  AuditAction,
  AuditSeverity,
  AssignmentStatus,
  VehicleStatus,
} from '@prisma/client';

@Injectable()
export class TripAssignmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Helper to format Prisma trip assignment with numeric decimals
   */
  private formatAssignment(assignment: any) {
    if (!assignment) return null;
    return {
      ...assignment,
      startOdometerKm: assignment.startOdometerKm != null ? Number(assignment.startOdometerKm) : null,
      endOdometerKm: assignment.endOdometerKm != null ? Number(assignment.endOdometerKm) : null,
      cargoWeightKg: assignment.cargoWeightKg != null ? Number(assignment.cargoWeightKg) : null,
      vehicle: assignment.vehicle
        ? {
            ...assignment.vehicle,
            payloadCapacityKg: assignment.vehicle.payloadCapacityKg != null ? Number(assignment.vehicle.payloadCapacityKg) : 0,
            totalOdometerKm: assignment.vehicle.totalOdometerKm != null ? Number(assignment.vehicle.totalOdometerKm) : 0,
          }
        : undefined,
    };
  }

  /**
   * Get all trip assignments with filtering
   */
  async getAssignments(query?: QueryAssignmentsDto) {
    const where: any = {};

    if (query?.vehicleId) {
      where.vehicleId = query.vehicleId;
    }
    if (query?.driverName) {
      where.driverName = { contains: query.driverName, mode: 'insensitive' };
    }
    if (query?.status) {
      where.status = query.status as AssignmentStatus;
    }
    if (query?.search) {
      where.OR = [
        { assignmentNumber: { contains: query.search, mode: 'insensitive' } },
        { driverName: { contains: query.search, mode: 'insensitive' } },
        { routeTitle: { contains: query.search, mode: 'insensitive' } },
        { originLocation: { contains: query.search, mode: 'insensitive' } },
        { destinationLocation: { contains: query.search, mode: 'insensitive' } },
        { purpose: { contains: query.search, mode: 'insensitive' } },
        { linkedDispatchOrderRef: { contains: query.search, mode: 'insensitive' } },
        { vehicle: { vehicleNumber: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const assignments = await this.prisma.vehicleAssignment.findMany({
      where,
      orderBy: { scheduledStart: 'desc' },
      include: {
        vehicle: true,
      },
    });

    return assignments.map((a) => this.formatAssignment(a));
  }

  /**
   * Get trip assignment by ID
   */
  async getAssignmentById(id: string) {
    const assignment = await this.prisma.vehicleAssignment.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Trip assignment with ID '${id}' not found`);
    }

    return this.formatAssignment(assignment);
  }

  /**
   * Create and schedule a new trip dispatch assignment
   */
  async createAssignment(dto: CreateTripAssignmentDto) {
    const vehicle = await this.prisma.fleetVehicle.findUnique({
      where: { id: dto.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Fleet vehicle with ID '${dto.vehicleId}' not found`);
    }

    // Generate assignment number
    const count = await this.prisma.vehicleAssignment.count();
    const assignmentNumber = `TRP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const status = dto.status || AssignmentStatus.SCHEDULED;
    const startOdometerKm = dto.startOdometerKm ?? Number(vehicle.totalOdometerKm);

    const created = await this.prisma.vehicleAssignment.create({
      data: {
        assignmentNumber,
        vehicleId: dto.vehicleId,
        driverName: dto.driverName,
        driverContact: dto.driverContact,
        routeTitle: dto.routeTitle,
        originLocation: dto.originLocation,
        destinationLocation: dto.destinationLocation,
        purpose: dto.purpose,
        status,
        startOdometerKm,
        endOdometerKm: dto.endOdometerKm ?? null,
        scheduledStart: new Date(dto.scheduledStart),
        actualStart: dto.actualStart ? new Date(dto.actualStart) : (status === AssignmentStatus.DISPATCHED ? new Date() : null),
        scheduledEnd: dto.scheduledEnd ? new Date(dto.scheduledEnd) : null,
        actualEnd: dto.actualEnd ? new Date(dto.actualEnd) : null,
        cargoWeightKg: dto.cargoWeightKg ?? null,
        linkedDispatchOrderRef: dto.linkedDispatchOrderRef || null,
        notes: dto.notes || null,
        dispatchedBy: dto.dispatchedBy,
      },
      include: {
        vehicle: true,
      },
    });

    // Update vehicle status if dispatched immediately
    if (status === AssignmentStatus.DISPATCHED || status === AssignmentStatus.IN_TRANSIT) {
      await this.prisma.fleetVehicle.update({
        where: { id: vehicle.id },
        data: {
          status: VehicleStatus.ON_TRIP,
          assignedDriver: dto.driverName,
        },
      });
    }

    await this.auditLogService.logAction({
      action: AuditAction.TRIP_ASSIGNMENT_CREATED,
      severity: AuditSeverity.MEDIUM,
      entityType: 'VehicleAssignment',
      entityId: created.id,
      description: `Created trip dispatch [${assignmentNumber}] for vehicle ${vehicle.vehicleNumber} to ${created.destinationLocation} (${created.driverName})`,
      userId: dto.dispatchedBy,
    });

    return this.formatAssignment(created);
  }

  /**
   * Update trip assignment status (e.g. Dispatched, In-Transit, Completed)
   */
  async updateAssignment(id: string, dto: UpdateTripAssignmentDto) {
    const existing = await this.prisma.vehicleAssignment.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!existing) {
      throw new NotFoundException(`Trip assignment with ID '${id}' not found`);
    }

    const data: any = {};
    if (dto.driverName) data.driverName = dto.driverName;
    if (dto.driverContact) data.driverContact = dto.driverContact;
    if (dto.routeTitle) data.routeTitle = dto.routeTitle;
    if (dto.originLocation) data.originLocation = dto.originLocation;
    if (dto.destinationLocation) data.destinationLocation = dto.destinationLocation;
    if (dto.purpose) data.purpose = dto.purpose;
    if (dto.status) data.status = dto.status as AssignmentStatus;
    if (dto.startOdometerKm != null) data.startOdometerKm = dto.startOdometerKm;
    if (dto.endOdometerKm != null) data.endOdometerKm = dto.endOdometerKm;
    if (dto.scheduledStart) data.scheduledStart = new Date(dto.scheduledStart);
    if (dto.actualStart) data.actualStart = new Date(dto.actualStart);
    if (dto.scheduledEnd) data.scheduledEnd = new Date(dto.scheduledEnd);
    if (dto.actualEnd) data.actualEnd = new Date(dto.actualEnd);
    if (dto.cargoWeightKg != null) data.cargoWeightKg = dto.cargoWeightKg;
    if (dto.linkedDispatchOrderRef !== undefined) data.linkedDispatchOrderRef = dto.linkedDispatchOrderRef;
    if (dto.notes !== undefined) data.notes = dto.notes;

    // Handle status transitions
    if (dto.status && dto.status !== existing.status) {
      if (dto.status === AssignmentStatus.DISPATCHED || dto.status === AssignmentStatus.IN_TRANSIT) {
        if (!data.actualStart && !existing.actualStart) {
          data.actualStart = new Date();
        }
        await this.prisma.fleetVehicle.update({
          where: { id: existing.vehicleId },
          data: { status: VehicleStatus.ON_TRIP },
        });
      } else if (dto.status === AssignmentStatus.COMPLETED) {
        if (!data.actualEnd && !existing.actualEnd) {
          data.actualEnd = new Date();
        }
        const finalOdometer = dto.endOdometerKm ?? existing.endOdometerKm;
        const vehicleUpdates: any = { status: VehicleStatus.AVAILABLE };
        if (finalOdometer && Number(finalOdometer) > Number(existing.vehicle.totalOdometerKm)) {
          vehicleUpdates.totalOdometerKm = finalOdometer;
        }
        await this.prisma.fleetVehicle.update({
          where: { id: existing.vehicleId },
          data: vehicleUpdates,
        });

        await this.auditLogService.logAction({
          action: AuditAction.TRIP_ASSIGNMENT_COMPLETED,
          severity: AuditSeverity.LOW,
          entityType: 'VehicleAssignment',
          entityId: existing.id,
          description: `Completed trip [${existing.assignmentNumber}] for vehicle ${existing.vehicle.vehicleNumber}. Restored to AVAILABLE.`,
          userId: existing.driverName,
        });
      } else if (dto.status === AssignmentStatus.CANCELLED) {
        if (existing.vehicle.status === VehicleStatus.ON_TRIP) {
          await this.prisma.fleetVehicle.update({
            where: { id: existing.vehicleId },
            data: { status: VehicleStatus.AVAILABLE },
          });
        }
      }
    }

    const updated = await this.prisma.vehicleAssignment.update({
      where: { id },
      data,
      include: { vehicle: true },
    });

    return this.formatAssignment(updated);
  }

  /**
   * Delete trip assignment
   */
  async deleteAssignment(id: string) {
    const existing = await this.prisma.vehicleAssignment.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Trip assignment with ID '${id}' not found`);
    }

    return this.prisma.vehicleAssignment.delete({ where: { id } });
  }

  /**
   * Get assignment dispatch metrics
   */
  async getAssignmentStatistics() {
    const assignments = await this.prisma.vehicleAssignment.findMany();

    const scheduled = assignments.filter((a) => a.status === AssignmentStatus.SCHEDULED).length;
    const dispatched = assignments.filter((a) => a.status === AssignmentStatus.DISPATCHED).length;
    const inTransit = assignments.filter((a) => a.status === AssignmentStatus.IN_TRANSIT).length;
    const completed = assignments.filter((a) => a.status === AssignmentStatus.COMPLETED).length;
    const cancelled = assignments.filter((a) => a.status === AssignmentStatus.CANCELLED).length;

    let totalCargoTransportedKg = 0;
    assignments.forEach((a) => {
      if (a.cargoWeightKg) totalCargoTransportedKg += Number(a.cargoWeightKg);
    });

    return {
      totalAssignments: assignments.length,
      activeTrips: dispatched + inTransit,
      statusCounts: {
        scheduled,
        dispatched,
        inTransit,
        completed,
        cancelled,
      },
      totalCargoTransportedKg,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  RecordMachineTelemetryDto,
  ReportBreakdownDto,
  UpdateMaintenanceStatusDto,
} from '../dto/machine-downtime.dto';
import {
  AuditAction,
  AuditSeverity,
  MaintenancePriority,
  MaintenanceStatus,
  ProductionLineHealth,
} from '@prisma/client';

@Injectable()
export class MachineDowntimeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Get all machine operating statuses and sensors
   */
  async getMachineFleet() {
    return this.prisma.machineLog.findMany({
      orderBy: { machineCode: 'asc' },
      include: {
        maintenanceRequests: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    });
  }

  /**
   * Record periodic telemetric sensor pings (simulated IoT gateway)
   */
  async recordTelemetry(dto: RecordMachineTelemetryDto) {
    const machine = await this.prisma.machineLog.findUnique({
      where: { machineCode: dto.machineCode },
    });

    if (!machine) {
      return this.prisma.machineLog.create({
        data: {
          machineCode: dto.machineCode,
          machineName: `Industrial Station ${dto.machineCode}`,
          operatingHours: dto.operatingHoursDelta || 0,
          totalCycles: dto.cyclesDelta || 0,
          temperatureCelsius: dto.temperatureCelsius || 45.0,
          vibrationMmSec: dto.vibrationMmSec || 1.2,
          isOnline: dto.isOnline !== undefined ? dto.isOnline : true,
        },
      });
    }

    return this.prisma.machineLog.update({
      where: { machineCode: dto.machineCode },
      data: {
        operatingHours: dto.operatingHoursDelta
          ? { increment: dto.operatingHoursDelta }
          : undefined,
        totalCycles: dto.cyclesDelta
          ? { increment: dto.cyclesDelta }
          : undefined,
        temperatureCelsius: dto.temperatureCelsius,
        vibrationMmSec: dto.vibrationMmSec,
        isOnline: dto.isOnline !== undefined ? dto.isOnline : machine.isOnline,
        lastTelemetricPing: new Date(),
      },
    });
  }

  /**
   * Report Machine Breakdown and Create Maintenance Request Ticket
   */
  async reportBreakdown(dto: ReportBreakdownDto, operatorUserId?: string) {
    let machine = await this.prisma.machineLog.findUnique({
      where: { machineCode: dto.machineCode },
    });

    if (!machine) {
      machine = await this.prisma.machineLog.create({
        data: {
          machineCode: dto.machineCode,
          machineName: `Machine ${dto.machineCode}`,
          operatingHours: 120,
          isOnline: false,
        },
      });
    } else {
      await this.prisma.machineLog.update({
        where: { id: machine.id },
        data: { isOnline: false },
      });
    }

    const count = await this.prisma.maintenanceRequest.count();
    const ticketNumber = `MNT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const priority = dto.priority || MaintenancePriority.HIGH;

    const ticket = await this.prisma.maintenanceRequest.create({
      data: {
        ticketNumber,
        machineLogId: machine.id,
        issueDescription: dto.issueDescription,
        priority,
        status: MaintenanceStatus.REPORTED,
        breakdownTime: new Date(),
      },
      include: { machine: true },
    });

    await this.auditLogService.log({
      userId: operatorUserId,
      action: AuditAction.MAINTENANCE_TICKET_RAISED,
      entity: 'MAINTENANCE_REQUEST',
      entityId: ticket.id,
      details: `Generated ${priority} priority maintenance ticket ${ticketNumber} for ${machine.machineCode}: "${dto.issueDescription}"`,
      severity: priority === MaintenancePriority.EMERGENCY ? AuditSeverity.CRITICAL : AuditSeverity.WARNING,
    });

    return ticket;
  }

  /**
   * Update Maintenance Ticket status (assign technician, resolve, provide RCA)
   */
  async updateMaintenanceStatus(dto: UpdateMaintenanceStatusDto, techUserId?: string) {
    const ticket = await this.prisma.maintenanceRequest.findUnique({
      where: { ticketNumber: dto.ticketNumber },
      include: { machine: true },
    });
    if (!ticket) throw new NotFoundException('Maintenance ticket not found.');

    const isResolved = dto.status === MaintenanceStatus.RESOLVED || dto.status === MaintenanceStatus.CLOSED;

    const updated = await this.prisma.maintenanceRequest.update({
      where: { ticketNumber: dto.ticketNumber },
      data: {
        status: dto.status,
        assignedTechnician: dto.assignedTechnician || ticket.assignedTechnician,
        resolvedTime: isResolved ? new Date() : undefined,
        rootCauseAnalysis: dto.rootCauseAnalysis || ticket.rootCauseAnalysis,
        preventativeAction: dto.preventativeAction || ticket.preventativeAction,
      },
    });

    // Bring machine back online if resolved
    if (isResolved) {
      await this.prisma.machineLog.update({
        where: { id: ticket.machineLogId },
        data: { isOnline: true },
      });
    }

    return updated;
  }

  /**
   * List all open and historical maintenance tickets
   */
  async getMaintenanceTickets() {
    return this.prisma.maintenanceRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { machine: true },
    });
  }
}

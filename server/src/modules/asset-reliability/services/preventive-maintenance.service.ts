import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateMaintenanceScheduleDto,
  UpdateMaintenanceScheduleDto,
  CompleteMaintenanceScheduleDto,
} from '../dto/preventive-maintenance.dto';
import {
  AuditAction,
  AuditSeverity,
  MaintenanceScheduleStatus,
  MaintenanceInterval,
} from '@prisma/client';

@Injectable()
export class PreventiveMaintenanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List preventive maintenance schedules with asset context
   */
  async getMaintenanceSchedules(query: {
    assetId?: string;
    status?: MaintenanceScheduleStatus;
    scheduleType?: any;
    interval?: MaintenanceInterval;
    isOverdue?: boolean;
  }) {
    const where: any = {};
    if (query.assetId) where.assetId = query.assetId;
    if (query.status) where.status = query.status;
    if (query.scheduleType) where.scheduleType = query.scheduleType;
    if (query.interval) where.interval = query.interval;

    if (query.isOverdue) {
      where.nextDueDate = { lt: new Date() };
      where.status = { notIn: [MaintenanceScheduleStatus.COMPLETED, MaintenanceScheduleStatus.CANCELLED] };
    }

    return this.prisma.maintenanceSchedule.findMany({
      where,
      include: {
        asset: {
          select: {
            id: true,
            assetTag: true,
            assetName: true,
            category: true,
            facilityLocation: true,
            status: true,
          },
        },
        toolCribRequisitions: {
          include: {
            sparePart: true,
          },
        },
      },
      orderBy: { nextDueDate: 'asc' },
    });
  }

  /**
   * Create a new preventive maintenance routine / calendar entry
   */
  async createMaintenanceSchedule(dto: CreateMaintenanceScheduleDto, userId?: string) {
    const asset = await this.prisma.machineAsset.findUnique({
      where: { id: dto.assetId },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${dto.assetId} not found.`);
    }

    const schedule = await this.prisma.maintenanceSchedule.create({
      data: {
        scheduleCode: dto.scheduleCode,
        assetId: dto.assetId,
        title: dto.title,
        scheduleType: dto.scheduleType,
        interval: dto.interval,
        intervalHours: dto.intervalHours,
        status: MaintenanceScheduleStatus.SCHEDULED,
        nextDueDate: new Date(dto.nextDueDate),
        estimatedDurationHours: dto.estimatedDurationHours || 2.0,
        assignedTechnician: dto.assignedTechnician,
        checklistItems: dto.checklistItems || [],
        notes: dto.notes,
      },
      include: {
        asset: true,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.MAINTENANCE_SCHEDULED,
      severity: AuditSeverity.INFO,
      resource: 'ASSET_RELIABILITY',
      details: {
        scheduleId: schedule.id,
        scheduleCode: schedule.scheduleCode,
        assetTag: asset.assetTag,
        nextDueDate: schedule.nextDueDate,
      },
    });

    return schedule;
  }

  /**
   * Complete a maintenance schedule, deduct spare parts, calculate next interval, and log lifecycle
   */
  async completeMaintenanceSchedule(dto: CompleteMaintenanceScheduleDto, userId?: string) {
    const schedule = await this.prisma.maintenanceSchedule.findUnique({
      where: { id: dto.scheduleId },
      include: { asset: true },
    });

    if (!schedule) {
      throw new NotFoundException(`Maintenance Schedule with ID ${dto.scheduleId} not found.`);
    }

    const now = new Date();
    // Compute next due date based on interval
    const nextDue = new Date(now);
    switch (schedule.interval) {
      case 'DAILY':
        nextDue.setDate(nextDue.getDate() + 1);
        break;
      case 'WEEKLY':
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case 'BIWEEKLY':
        nextDue.setDate(nextDue.getDate() + 14);
        break;
      case 'MONTHLY':
        nextDue.setMonth(nextDue.getMonth() + 1);
        break;
      case 'QUARTERLY':
        nextDue.setMonth(nextDue.getMonth() + 3);
        break;
      case 'BIANNUAL':
        nextDue.setMonth(nextDue.getMonth() + 6);
        break;
      case 'ANNUAL':
        nextDue.setFullYear(nextDue.getFullYear() + 1);
        break;
    }

    // Process spare parts if used
    let totalPartsCost = 0;
    if (dto.sparePartsUsed && dto.sparePartsUsed.length > 0) {
      for (const item of dto.sparePartsUsed) {
        const part = await this.prisma.sparePart.findUnique({ where: { id: item.sparePartId } });
        if (part) {
          totalPartsCost += Number(part.unitCost) * item.quantity;
          await this.prisma.sparePart.update({
            where: { id: part.id },
            data: { currentStock: Math.max(0, part.currentStock - item.quantity) },
          });

          await this.prisma.toolCribRequisition.create({
            data: {
              requisitionNumber: `REQ-PMS-${Date.now().toString().slice(-6)}`,
              sparePartId: part.id,
              maintenanceScheduleId: schedule.id,
              quantity: item.quantity,
              status: 'ISSUED',
              requestedBy: dto.performedBy,
              approvedBy: 'SYSTEM_AUTO_APPROVED',
              issuedAt: now,
              purposeNotes: `Utilized for preventive routine ${schedule.scheduleCode}`,
            },
          });
        }
      }
    }

    // Update maintenance schedule
    const updated = await this.prisma.maintenanceSchedule.update({
      where: { id: schedule.id },
      data: {
        status: MaintenanceScheduleStatus.COMPLETED,
        lastPerformedAt: now,
        nextDueDate: nextDue,
        notes: dto.notes ? `${schedule.notes || ''}\n[Completed on ${now.toISOString()}]: ${dto.notes}` : schedule.notes,
      },
    });

    // Create lifecycle log
    await this.prisma.assetLifecycleLog.create({
      data: {
        assetId: schedule.assetId,
        eventType: 'PREVENTIVE_MAINTENANCE',
        eventTitle: `Preventive Maintenance: ${schedule.title}`,
        eventDescription: `Completed by ${dto.performedBy}. Duration: ${dto.actualDurationHours || schedule.estimatedDurationHours} hrs. Next routine due: ${nextDue.toISOString().slice(0, 10)}.`,
        costIncurred: totalPartsCost,
        downtimeIncurredMinutes: Math.round(Number(dto.actualDurationHours || schedule.estimatedDurationHours) * 60),
        performedBy: dto.performedBy,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || dto.performedBy,
      action: AuditAction.MAINTENANCE_COMPLETED,
      severity: AuditSeverity.INFO,
      resource: 'ASSET_RELIABILITY',
      details: {
        scheduleId: schedule.id,
        assetTag: schedule.asset.assetTag,
        performedBy: dto.performedBy,
        nextDueDate: nextDue,
      },
    });

    return updated;
  }

  /**
   * Update existing schedule configuration
   */
  async updateMaintenanceSchedule(id: string, dto: UpdateMaintenanceScheduleDto) {
    const existing = await this.prisma.maintenanceSchedule.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Maintenance Schedule with ID ${id} not found.`);
    }

    return this.prisma.maintenanceSchedule.update({
      where: { id },
      data: {
        title: dto.title,
        scheduleType: dto.scheduleType,
        interval: dto.interval,
        intervalHours: dto.intervalHours,
        status: dto.status,
        nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
        lastPerformedAt: dto.lastPerformedAt ? new Date(dto.lastPerformedAt) : undefined,
        estimatedDurationHours: dto.estimatedDurationHours,
        assignedTechnician: dto.assignedTechnician,
        checklistItems: dto.checklistItems,
        notes: dto.notes,
      },
    });
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateBreakdownTicketDto,
  AssignTechnicianDto,
  UpdateBreakdownProgressDto,
  ResolveBreakdownTicketDto,
} from '../dto/breakdown-repair.dto';
import {
  AuditAction,
  AuditSeverity,
  BreakdownTicketStatus,
  AssetStatus,
} from '@prisma/client';

@Injectable()
export class BreakdownRepairService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List breakdown tickets with filters
   */
  async getBreakdownTickets(query: {
    assetId?: string;
    status?: BreakdownTicketStatus;
    severity?: any;
    technician?: string;
  }) {
    const where: any = {};
    if (query.assetId) where.assetId = query.assetId;
    if (query.status) where.status = query.status;
    if (query.severity) where.severity = query.severity;
    if (query.technician) where.assignedTechnician = query.technician;

    return this.prisma.breakdownTicket.findMany({
      where,
      include: {
        asset: {
          select: {
            id: true,
            assetTag: true,
            assetName: true,
            category: true,
            facilityLocation: true,
            criticality: true,
            status: true,
          },
        },
        partsRequisitions: {
          include: {
            sparePart: true,
          },
        },
      },
      orderBy: { breakdownStartedAt: 'desc' },
    });
  }

  /**
   * Log an unexpected machine breakdown ticket
   */
  async reportBreakdownTicket(dto: CreateBreakdownTicketDto, userId?: string) {
    const asset = await this.prisma.machineAsset.findUnique({
      where: { id: dto.assetId },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${dto.assetId} not found.`);
    }

    const ticketNumber = `BDK-${Date.now().toString().slice(-6)}`;
    const breakdownStarted = dto.breakdownStartedAt ? new Date(dto.breakdownStartedAt) : new Date();

    // Create ticket
    const ticket = await this.prisma.breakdownTicket.create({
      data: {
        ticketNumber,
        assetId: dto.assetId,
        reportedBy: dto.reportedBy,
        severity: dto.severity,
        status: BreakdownTicketStatus.REPORTED,
        failureCategory: dto.failureCategory,
        symptomDescription: dto.symptomDescription,
        breakdownStartedAt: breakdownStarted,
      },
      include: {
        asset: true,
      },
    });

    // Update asset status to BREAKDOWN_STOPPAGE
    await this.prisma.machineAsset.update({
      where: { id: asset.id },
      data: {
        status: dto.severity === 'CRITICAL' || dto.severity === 'CATASTROPHIC'
          ? AssetStatus.BREAKDOWN_STOPPAGE
          : AssetStatus.DEGRADED,
      },
    });

    // Log lifecycle event
    await this.prisma.assetLifecycleLog.create({
      data: {
        assetId: asset.id,
        eventType: 'BREAKDOWN_REPAIR',
        eventTitle: `Breakdown Reported: ${ticket.ticketNumber}`,
        eventDescription: `Severity: ${dto.severity}. Category: ${dto.failureCategory}. Symptoms: ${dto.symptomDescription}`,
        performedBy: dto.reportedBy,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || dto.reportedBy,
      action: AuditAction.BREAKDOWN_REPORTED,
      severity: dto.severity === 'CRITICAL' || dto.severity === 'CATASTROPHIC' ? AuditSeverity.CRITICAL : AuditSeverity.WARNING,
      resource: 'ASSET_RELIABILITY',
      details: {
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        assetTag: asset.assetTag,
        severity: dto.severity,
      },
    });

    return ticket;
  }

  /**
   * Assign maintenance engineer to breakdown ticket
   */
  async assignTechnician(id: string, dto: AssignTechnicianDto) {
    const ticket = await this.prisma.breakdownTicket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Breakdown Ticket with ID ${id} not found.`);
    }

    return this.prisma.breakdownTicket.update({
      where: { id },
      data: {
        assignedTechnician: dto.assignedTechnician,
        status: ticket.status === BreakdownTicketStatus.REPORTED ? BreakdownTicketStatus.IN_DIAGNOSIS : ticket.status,
      },
    });
  }

  /**
   * Update breakdown diagnosis / repair progress
   */
  async updateProgress(id: string, dto: UpdateBreakdownProgressDto) {
    const ticket = await this.prisma.breakdownTicket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Breakdown Ticket with ID ${id} not found.`);
    }

    return this.prisma.breakdownTicket.update({
      where: { id },
      data: {
        status: dto.status,
        assignedTechnician: dto.assignedTechnician,
        failureCategory: dto.failureCategory,
        rootCause: dto.rootCause,
        correctiveActionTaken: dto.correctiveActionTaken,
        downtimeHours: dto.downtimeHours,
        repairCostEstimate: dto.repairCostEstimate,
      },
    });
  }

  /**
   * Resolve and close breakdown ticket, restore asset operational state, and calculate MTTR
   */
  async resolveBreakdownTicket(id: string, dto: ResolveBreakdownTicketDto, userId?: string) {
    const ticket = await this.prisma.breakdownTicket.findUnique({
      where: { id },
      include: { asset: true },
    });

    if (!ticket) {
      throw new NotFoundException(`Breakdown Ticket with ID ${id} not found.`);
    }

    const completionTime = dto.repairCompletedAt ? new Date(dto.repairCompletedAt) : new Date();
    const downtimeHours = dto.downtimeHours > 0
      ? dto.downtimeHours
      : Math.max(0.2, (completionTime.getTime() - ticket.breakdownStartedAt.getTime()) / (1000 * 60 * 60));

    // Process parts used
    let partsCost = 0;
    if (dto.replacementPartsUsed && dto.replacementPartsUsed.length > 0) {
      for (const item of dto.replacementPartsUsed) {
        const part = await this.prisma.sparePart.findUnique({ where: { id: item.sparePartId } });
        if (part) {
          partsCost += Number(part.unitCost) * item.quantity;
          await this.prisma.sparePart.update({
            where: { id: part.id },
            data: { currentStock: Math.max(0, part.currentStock - item.quantity) },
          });

          await this.prisma.toolCribRequisition.create({
            data: {
              requisitionNumber: `REQ-BDK-${Date.now().toString().slice(-6)}`,
              sparePartId: part.id,
              breakdownTicketId: ticket.id,
              quantity: item.quantity,
              status: 'ISSUED',
              requestedBy: dto.resolvedBy,
              approvedBy: 'AUTO_BREAKDOWN_OVERRIDE',
              issuedAt: completionTime,
              purposeNotes: `Emergency replacement part for breakdown ${ticket.ticketNumber}`,
            },
          });
        }
      }
    }

    const totalRepairCost = Number(dto.repairCostEstimate || 0) + partsCost;

    // Update ticket
    const updatedTicket = await this.prisma.breakdownTicket.update({
      where: { id },
      data: {
        status: BreakdownTicketStatus.RESOLVED,
        rootCause: dto.rootCause,
        correctiveActionTaken: dto.correctiveActionTaken,
        repairCompletedAt: completionTime,
        downtimeHours: downtimeHours,
        repairCostEstimate: totalRepairCost,
      },
    });

    // Restore machine status to OPERATIONAL and update MTTR
    const pastResolvedTickets = await this.prisma.breakdownTicket.findMany({
      where: {
        assetId: ticket.assetId,
        status: BreakdownTicketStatus.RESOLVED,
      },
      select: { downtimeHours: true },
    });

    const totalDowntime = pastResolvedTickets.reduce((acc, t) => acc + Number(t.downtimeHours || 0), 0) + downtimeHours;
    const countFailures = pastResolvedTickets.length + 1;
    const newMttr = totalDowntime / countFailures;

    await this.prisma.machineAsset.update({
      where: { id: ticket.assetId },
      data: {
        status: AssetStatus.OPERATIONAL,
        mttrHours: newMttr,
      },
    });

    // Record Lifecycle Log
    await this.prisma.assetLifecycleLog.create({
      data: {
        assetId: ticket.assetId,
        eventType: 'BREAKDOWN_REPAIR',
        eventTitle: `Breakdown Resolved: ${ticket.ticketNumber}`,
        eventDescription: `Root Cause: ${dto.rootCause}. Action: ${dto.correctiveActionTaken}. Downtime: ${downtimeHours.toFixed(1)} hrs.`,
        costIncurred: totalRepairCost,
        downtimeIncurredMinutes: Math.round(downtimeHours * 60),
        performedBy: dto.resolvedBy,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || dto.resolvedBy,
      action: AuditAction.BREAKDOWN_RESOLVED,
      severity: AuditSeverity.INFO,
      resource: 'ASSET_RELIABILITY',
      details: {
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        assetTag: ticket.asset.assetTag,
        downtimeHours,
        cost: totalRepairCost,
      },
    });

    return updatedTicket;
  }
}

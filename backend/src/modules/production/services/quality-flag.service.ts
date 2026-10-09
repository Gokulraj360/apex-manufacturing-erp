import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { LogScrapDto, FlagQualityHoldDto } from '../dto/quality-flag.dto';
import { AuditAction, AuditSeverity, WorkOrderStatus } from '@prisma/client';

@Injectable()
export class QualityFlagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Log scrap, rejected parts, and defect reason codes
   */
  async logScrap(dto: LogScrapDto, inspectorUserId?: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: dto.workOrderId },
    });
    if (!workOrder) throw new NotFoundException('Work Order not found.');

    const scrapLog = await this.prisma.scrapLog.create({
      data: {
        workOrderId: dto.workOrderId,
        batchId: dto.batchId,
        partNumber: dto.partNumber,
        quantity: dto.quantity,
        reasonCode: dto.reasonCode,
        severity: dto.severity || 'MINOR',
        inspectorNotes: dto.inspectorNotes,
        financialScrapValue: dto.financialScrapValue || 0,
      },
    });

    // Increment scrap quantity on work order
    await this.prisma.workOrder.update({
      where: { id: dto.workOrderId },
      data: { scrapQuantity: { increment: dto.quantity } },
    });

    // If critical defect, automatically set Work Order to QUALITY_HOLD
    if (dto.severity === 'CRITICAL') {
      await this.prisma.workOrder.update({
        where: { id: dto.workOrderId },
        data: { status: WorkOrderStatus.QUALITY_HOLD },
      });
    }

    await this.auditLogService.log({
      userId: inspectorUserId,
      action: AuditAction.SCRAP_LOGGED,
      entity: 'SCRAP_LOG',
      entityId: scrapLog.id,
      details: `Logged ${dto.quantity} scrapped units of ${dto.partNumber} on WO ${workOrder.orderNumber}. Reason: ${dto.reasonCode} (${dto.severity})`,
      severity: dto.severity === 'CRITICAL' ? AuditSeverity.CRITICAL : AuditSeverity.WARNING,
    });

    return scrapLog;
  }

  /**
   * Place or release Quality Hold on WIP Stage Stock
   */
  async flagQualityHold(dto: FlagQualityHoldDto, inspectorUserId?: string) {
    const wip = await this.prisma.workInProgressStock.findUnique({
      where: { id: dto.wipStockId },
      include: { workOrder: true },
    });
    if (!wip) throw new NotFoundException('WIP stock record not found.');

    const updated = await this.prisma.workInProgressStock.update({
      where: { id: dto.wipStockId },
      data: {
        hasQualityHold: dto.hasQualityHold,
        qualityNotes: dto.qualityNotes,
        lastInspectedAt: new Date(),
      },
    });

    if (dto.hasQualityHold) {
      await this.prisma.workOrder.update({
        where: { id: wip.workOrderId },
        data: { status: WorkOrderStatus.QUALITY_HOLD },
      });
    }

    return updated;
  }

  /**
   * List recent scrap logs and quality incidents
   */
  async getScrapLogs() {
    return this.prisma.scrapLog.findMany({
      orderBy: { loggedAt: 'desc' },
      include: {
        workOrder: {
          include: { bom: true },
        },
        batch: true,
      },
    });
  }
}

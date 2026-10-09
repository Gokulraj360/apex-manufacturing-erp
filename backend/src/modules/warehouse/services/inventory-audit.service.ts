import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { SubmitCycleCountDto, LogDamagedItemDto } from '../dto/inventory-audit.dto';
import { AuditAction, AuditSeverity, CycleCountStatus } from '@prisma/client';

@Injectable()
export class InventoryAuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List cycle count audits
   */
  async getCycleCounts() {
    return this.prisma.cycleCount.findMany({
      orderBy: { countDate: 'desc' },
    });
  }

  /**
   * Submit physical cycle count and calculate variances
   */
  async submitCycleCount(dto: SubmitCycleCountDto, user?: string) {
    const count = await this.prisma.cycleCount.count();
    const countNumber = `CC-${new Date().getFullYear()}-W${String(count + 1).padStart(3, '0')}`;

    let totalDiscrepancies = 0;
    const evaluatedItems = dto.itemsCounted.map((item) => {
      const variance = item.physicalCount - item.systemQuantity;
      if (variance !== 0) totalDiscrepancies++;
      return {
        ...item,
        variance,
        isReconciled: variance === 0,
      };
    });

    const cycleCount = await this.prisma.cycleCount.create({
      data: {
        countNumber,
        zone: dto.zone,
        countedBy: user || 'Auditor Martinez',
        status: totalDiscrepancies === 0 ? CycleCountStatus.COMPLETED : CycleCountStatus.IN_PROGRESS,
        itemsCounted: evaluatedItems as any,
        totalDiscrepancies,
        notes: dto.notes,
      },
    });

    await this.auditLogService.log({
      userId: user,
      action: AuditAction.CYCLE_COUNT_COMPLETED,
      entity: 'CYCLE_COUNT',
      entityId: cycleCount.id,
      details: `Completed physical cycle count in ${dto.zone}. Total items counted: ${dto.itemsCounted.length}, Discrepancies found: ${totalDiscrepancies}`,
      severity: totalDiscrepancies > 5 ? AuditSeverity.WARNING : AuditSeverity.INFO,
    });

    return cycleCount;
  }

  /**
   * Reconcile cycle count discrepancies and update stock
   */
  async reconcileCycleCount(countNumber: string, user?: string) {
    const cycleCount = await this.prisma.cycleCount.findUnique({
      where: { countNumber },
    });
    if (!cycleCount) throw new NotFoundException('Cycle count not found.');

    const items = (cycleCount.itemsCounted as any[]) || [];

    await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        if (item.variance !== 0) {
          const stock = await tx.warehouseStock.findUnique({
            where: { itemCode: item.itemCode },
          });

          if (stock) {
            await tx.warehouseStock.update({
              where: { itemCode: item.itemCode },
              data: { currentQuantity: item.physicalCount },
            });

            const adjCount = await tx.stockAdjustment.count();
            await tx.stockAdjustment.create({
              data: {
                adjustmentNumber: `ADJ-${new Date().getFullYear()}-${String(adjCount + 1).padStart(4, '0')}`,
                stockId: stock.id,
                reason: 'CYCLE_COUNT_VARIANCE',
                previousQuantity: item.systemQuantity,
                adjustedQuantity: item.physicalCount,
                variance: item.variance,
                financialImpact: item.variance * Number(stock.unitValuation),
                approvedBy: user || 'Auditor Martinez',
                notes: `Reconciled per Cycle Count ${countNumber}`,
              },
            });
          }
        }
      }

      await tx.cycleCount.update({
        where: { countNumber },
        data: {
          status: CycleCountStatus.RECONCILED,
          reconciledAt: new Date(),
        },
      });
    });

    return { countNumber, status: 'RECONCILED' };
  }

  /**
   * Log damaged, expired, or scrapped warehouse items
   */
  async logDamagedItem(dto: LogDamagedItemDto, user?: string) {
    const stock = await this.prisma.warehouseStock.findUnique({
      where: { itemCode: dto.itemCode },
    });
    if (!stock) throw new NotFoundException('Stock item not found.');

    const financialLoss = dto.financialLoss || (dto.damagedQuantity * Number(stock.unitValuation));

    const damagedLog = await this.prisma.damagedItemLog.create({
      data: {
        stockId: stock.id,
        damagedQuantity: dto.damagedQuantity,
        damageReason: dto.damageReason,
        financialLoss,
        reportedBy: user || 'Material Handler Smith',
        binLocation: dto.binLocation || stock.binLocationId || 'ZONE-C-QUARANTINE',
        isWrittenOff: true,
      },
    });

    // Write-off: decrement stock
    await this.prisma.warehouseStock.update({
      where: { itemCode: dto.itemCode },
      data: {
        currentQuantity: { decrement: dto.damagedQuantity },
      },
    });

    return damagedLog;
  }

  /**
   * List damaged stock logs
   */
  async getDamagedLogs() {
    return this.prisma.damagedItemLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { stock: true },
    });
  }
}

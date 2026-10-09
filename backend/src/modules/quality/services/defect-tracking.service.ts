import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CreateDefectLogDto, UpdateDefectResolutionDto } from '../dto/defect-tracking.dto';
import { AuditAction, AuditSeverity, DefectCategory, DefectSeverity, DefectAction } from '@prisma/client';

@Injectable()
export class DefectTrackingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List defect logs with multi-dimensional filtering
   */
  async getDefectLogs(stage?: string, category?: DefectCategory, severity?: DefectSeverity) {
    const where: any = {};
    if (stage) where.sourceStage = stage;
    if (category) where.defectCategory = category;
    if (severity) where.severity = severity;

    return this.prisma.defectLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single defect record by ID
   */
  async getDefectById(id: string) {
    const defect = await this.prisma.defectLog.findUnique({
      where: { id },
    });
    if (!defect) {
      throw new NotFoundException(`Defect log ${id} not found`);
    }
    return defect;
  }

  /**
   * Log a new defect ticket with scrap quantities and financial impact
   */
  async createDefectLog(dto: CreateDefectLogDto, userId?: string) {
    const count = await this.prisma.defectLog.count();
    const defectCode = `DEF-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const defect = await this.prisma.defectLog.create({
      data: {
        defectCode,
        sourceStage: dto.sourceStage,
        itemCode: dto.itemCode,
        itemName: dto.itemName,
        lotBatchNumber: dto.lotBatchNumber,
        defectCategory: dto.defectCategory as DefectCategory,
        severity: dto.severity as DefectSeverity,
        defectReason: dto.defectReason,
        rootCause: dto.rootCause,
        scrapQuantity: dto.scrapQuantity,
        financialLoss: dto.financialLoss,
        actionTaken: dto.actionTaken as DefectAction,
        containmentMeasures: dto.containmentMeasures,
        reportedBy: dto.reportedBy,
      },
    });

    const isCritical = dto.severity === 'CRITICAL' || dto.scrapQuantity > 20;

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.DEFECT_LOGGED,
      entityName: 'DefectLog',
      entityId: defect.id,
      details: {
        defectCode,
        itemCode: dto.itemCode,
        sourceStage: dto.sourceStage,
        defectCategory: dto.defectCategory,
        severity: dto.severity,
        scrapQuantity: dto.scrapQuantity,
        financialLoss: dto.financialLoss,
      },
      severity: isCritical ? AuditSeverity.CRITICAL : AuditSeverity.WARNING,
    });

    return defect;
  }

  /**
   * Update root cause analysis (RCA) and Corrective and Preventive Action (CAPA)
   */
  async updateDefectResolution(id: string, dto: UpdateDefectResolutionDto, userId?: string) {
    await this.getDefectById(id);

    const updated = await this.prisma.defectLog.update({
      where: { id },
      data: {
        rootCause: dto.rootCause,
        actionTaken: dto.actionTaken as DefectAction,
        containmentMeasures: dto.containmentMeasures,
      },
    });

    return updated;
  }

  /**
   * High-level statistical defect KPIs
   */
  async getDefectMetrics() {
    const defects = await this.prisma.defectLog.findMany();

    const totalDefects = defects.length;
    const totalScrapUnits = defects.reduce((acc, d) => acc + d.scrapQuantity, 0);
    const totalFinancialLoss = defects.reduce((acc, d) => acc + Number(d.financialLoss), 0);
    const criticalDefects = defects.filter((d) => d.severity === DefectSeverity.CRITICAL).length;

    // Breakdown by Category
    const categoryCounts: Record<string, number> = {};
    for (const d of defects) {
      categoryCounts[d.defectCategory] = (categoryCounts[d.defectCategory] || 0) + 1;
    }

    return {
      totalDefects,
      totalScrapUnits,
      totalFinancialLoss,
      criticalDefects,
      categoryCounts,
    };
  }
}

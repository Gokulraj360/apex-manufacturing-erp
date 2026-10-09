import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CreateInProcessInspectionDto, UpdateInProcessInspectionDto } from '../dto/in-process-inspection.dto';
import { AuditAction, AuditSeverity, QCStatus } from '@prisma/client';

@Injectable()
export class InProcessInspectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all in-process inspections with optional filters
   */
  async getInspections(productionLineId?: string, status?: QCStatus) {
    const where: any = {};
    if (productionLineId) where.productionLineId = productionLineId;
    if (status) where.status = status;

    return this.prisma.inProcessInspection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single inspection by ID
   */
  async getInspectionById(id: string) {
    const inspection = await this.prisma.inProcessInspection.findUnique({
      where: { id },
    });
    if (!inspection) {
      throw new NotFoundException(`In-process inspection ${id} not found`);
    }
    return inspection;
  }

  /**
   * Log an in-process shop floor spot-check or critical stage quality verification
   */
  async createInspection(dto: CreateInProcessInspectionDto, userId?: string) {
    const count = await this.prisma.inProcessInspection.count();
    const inspectionNumber = `QC-IP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const inspection = await this.prisma.inProcessInspection.create({
      data: {
        inspectionNumber,
        workOrderNumber: dto.workOrderNumber,
        batchNumber: dto.batchNumber,
        productionLineId: dto.productionLineId,
        stationName: dto.stationName,
        stage: dto.stage,
        parameters: dto.parameters as any,
        toleranceDeviation: dto.toleranceDeviation ?? 0.0,
        status: (dto.status as QCStatus) || QCStatus.IN_PROGRESS,
        inspectorName: dto.inspectorName,
        notes: dto.notes,
      },
    });

    const isFailure = inspection.status === QCStatus.FAILED;

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.QC_INPROCESS_LOGGED,
      entityName: 'InProcessInspection',
      entityId: inspection.id,
      details: {
        inspectionNumber,
        workOrderNumber: dto.workOrderNumber,
        productionLineId: dto.productionLineId,
        stationName: dto.stationName,
        toleranceDeviation: dto.toleranceDeviation,
        status: inspection.status,
      },
      severity: isFailure ? AuditSeverity.CRITICAL : AuditSeverity.INFO,
    });

    return inspection;
  }

  /**
   * Update an in-process inspection record
   */
  async updateInspection(id: string, dto: UpdateInProcessInspectionDto, userId?: string) {
    const existing = await this.getInspectionById(id);

    const updated = await this.prisma.inProcessInspection.update({
      where: { id },
      data: {
        status: dto.status,
        toleranceDeviation: dto.toleranceDeviation !== undefined ? dto.toleranceDeviation : existing.toleranceDeviation,
        notes: dto.notes ? `${existing.notes || ''}\n${dto.notes}` : existing.notes,
      },
    });

    return updated;
  }

  /**
   * Aggregate quality telemetry across production lines
   */
  async getLineQualityMetrics() {
    const inspections = await this.prisma.inProcessInspection.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
    });

    const total = inspections.length;
    const passed = inspections.filter((i) => i.status === QCStatus.PASSED).length;
    const failed = inspections.filter((i) => i.status === QCStatus.FAILED).length;
    const fpy = total > 0 ? (passed / total) * 100 : 100.0;

    return {
      totalChecks: total,
      passedChecks: passed,
      failedChecks: failed,
      firstPassYield: parseFloat(fpy.toFixed(1)),
      recentInspections: inspections.slice(0, 10),
    };
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CreateIncomingInspectionDto, UpdateIncomingInspectionStatusDto } from '../dto/incoming-inspection.dto';
import { AuditAction, AuditSeverity, QCStatus } from '@prisma/client';

@Injectable()
export class IncomingInspectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all incoming raw material quality inspections
   */
  async getInspections(status?: QCStatus) {
    const where = status ? { status } : {};
    return this.prisma.incomingInspection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single inspection by ID
   */
  async getInspectionById(id: string) {
    const inspection = await this.prisma.incomingInspection.findUnique({
      where: { id },
    });
    if (!inspection) {
      throw new NotFoundException(`Incoming inspection with ID ${id} not found`);
    }
    return inspection;
  }

  /**
   * Create an incoming raw material inspection ticket
   */
  async createInspection(dto: CreateIncomingInspectionDto, userId?: string) {
    const count = await this.prisma.incomingInspection.count();
    const inspectionNumber = `QC-IN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const inspection = await this.prisma.incomingInspection.create({
      data: {
        inspectionNumber,
        poNumber: dto.poNumber,
        grnNumber: dto.grnNumber,
        supplierName: dto.supplierName,
        itemCode: dto.itemCode,
        itemName: dto.itemName,
        lotBatchNumber: dto.lotBatchNumber,
        sampleSize: dto.sampleSize,
        quantityInspected: dto.quantityInspected,
        quantityAccepted: dto.quantityAccepted,
        quantityRejected: dto.quantityRejected,
        parameters: dto.parameters as any,
        certificateOfAnalysisAttached: dto.certificateOfAnalysisAttached ?? false,
        status: (dto.status as QCStatus) || QCStatus.IN_PROGRESS,
        inspectorName: dto.inspectorName,
        remarks: dto.remarks,
        clearedAt: dto.status === 'PASSED' ? new Date() : null,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: dto.status === 'PASSED' ? AuditAction.QC_INCOMING_CLEARED : AuditAction.CREATE,
      entityName: 'IncomingInspection',
      entityId: inspection.id,
      details: {
        inspectionNumber,
        itemCode: dto.itemCode,
        supplierName: dto.supplierName,
        status: inspection.status,
      },
      severity: dto.quantityRejected > 0 ? AuditSeverity.WARNING : AuditSeverity.INFO,
    });

    return inspection;
  }

  /**
   * Update QC status and issue pre-GRN clearance sign-off
   */
  async updateInspectionStatus(id: string, dto: UpdateIncomingInspectionStatusDto, userId?: string) {
    const existing = await this.getInspectionById(id);

    const isPassed = dto.status === 'PASSED' || dto.status === 'CONDITIONALLY_ACCEPTED';
    const updated = await this.prisma.incomingInspection.update({
      where: { id },
      data: {
        status: dto.status,
        quantityAccepted: dto.quantityAccepted !== undefined ? dto.quantityAccepted : existing.quantityAccepted,
        quantityRejected: dto.quantityRejected !== undefined ? dto.quantityRejected : existing.quantityRejected,
        remarks: dto.remarks ? `${existing.remarks || ''}\n[Update]: ${dto.remarks}` : existing.remarks,
        clearedAt: isPassed ? new Date() : null,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: isPassed ? AuditAction.QC_INCOMING_CLEARED : AuditAction.QC_INCOMING_REJECTED,
      entityName: 'IncomingInspection',
      entityId: updated.id,
      details: {
        inspectionNumber: updated.inspectionNumber,
        previousStatus: existing.status,
        newStatus: updated.status,
        quantityAccepted: updated.quantityAccepted,
        quantityRejected: updated.quantityRejected,
      },
      severity: isPassed ? AuditSeverity.INFO : AuditSeverity.WARNING,
    });

    return updated;
  }

  /**
   * Retrieve list of inspections awaiting sign-off clearance
   */
  async getPendingClearances() {
    return this.prisma.incomingInspection.findMany({
      where: {
        status: { in: [QCStatus.PENDING, QCStatus.IN_PROGRESS] },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}

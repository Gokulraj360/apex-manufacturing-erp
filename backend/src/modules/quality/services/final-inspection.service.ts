import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CreateFinalInspectionDto, ApproveDispatchDto } from '../dto/final-inspection.dto';
import { AuditAction, AuditSeverity, QCStatus } from '@prisma/client';

@Injectable()
export class FinalInspectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all final inspections with optional dispatch filtering
   */
  async getInspections(isApproved?: boolean, status?: QCStatus) {
    const where: any = {};
    if (isApproved !== undefined) where.isApprovedForDispatch = isApproved;
    if (status) where.status = status;

    return this.prisma.finalInspection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single final inspection by ID
   */
  async getInspectionById(id: string) {
    const inspection = await this.prisma.finalInspection.findUnique({
      where: { id },
    });
    if (!inspection) {
      throw new NotFoundException(`Final inspection ${id} not found`);
    }
    return inspection;
  }

  /**
   * Log finished goods final testing & visual compliance verification
   */
  async createInspection(dto: CreateFinalInspectionDto, userId?: string) {
    const count = await this.prisma.finalInspection.count();
    const inspectionNumber = `QC-FIN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const isPassed = dto.quantityFailed === 0 && dto.quantityPassed > 0;
    const status = isPassed ? QCStatus.PASSED : QCStatus.FAILED;

    const inspection = await this.prisma.finalInspection.create({
      data: {
        inspectionNumber,
        workOrderNumber: dto.workOrderNumber,
        batchNumber: dto.batchNumber,
        productCode: dto.productCode,
        productName: dto.productName,
        quantityChecked: dto.quantityChecked,
        quantityPassed: dto.quantityPassed,
        quantityFailed: dto.quantityFailed,
        status,
        isApprovedForDispatch: dto.isApprovedForDispatch ?? false,
        testingProtocols: dto.testingProtocols as any,
        inspectorName: dto.inspectorName,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: isPassed ? AuditAction.CREATE : AuditAction.QC_FINAL_REJECTED,
      entityName: 'FinalInspection',
      entityId: inspection.id,
      details: {
        inspectionNumber,
        productCode: dto.productCode,
        quantityChecked: dto.quantityChecked,
        quantityPassed: dto.quantityPassed,
        quantityFailed: dto.quantityFailed,
        status,
      },
      severity: dto.quantityFailed > 0 ? AuditSeverity.WARNING : AuditSeverity.INFO,
    });

    return inspection;
  }

  /**
   * Authorize finished goods batch as ready for outbound customer dispatch
   */
  async approveForDispatch(id: string, dto: ApproveDispatchDto, userId?: string) {
    const inspection = await this.getInspectionById(id);

    if (inspection.status === QCStatus.FAILED) {
      throw new BadRequestException('Cannot approve dispatch for a failed quality inspection');
    }

    const approvalRef = dto.dispatchApprovalRef || `DSP-QC-OK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = await this.prisma.finalInspection.update({
      where: { id },
      data: {
        isApprovedForDispatch: true,
        signedOffBy: dto.signedOffBy,
        dispatchApprovalRef: approvalRef,
        signedOffAt: new Date(),
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.QC_FINAL_APPROVED,
      entityName: 'FinalInspection',
      entityId: updated.id,
      details: {
        inspectionNumber: updated.inspectionNumber,
        productCode: updated.productCode,
        dispatchApprovalRef: approvalRef,
        signedOffBy: dto.signedOffBy,
      },
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Reject finished goods batch from outbound dispatch and flag for rework/scrap
   */
  async rejectFromDispatch(id: string, reason: string, userId?: string) {
    const inspection = await this.getInspectionById(id);

    const updated = await this.prisma.finalInspection.update({
      where: { id },
      data: {
        status: QCStatus.FAILED,
        isApprovedForDispatch: false,
        signedOffBy: userId || 'QA Lead',
        signedOffAt: new Date(),
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.QC_FINAL_REJECTED,
      entityName: 'FinalInspection',
      entityId: updated.id,
      details: {
        inspectionNumber: updated.inspectionNumber,
        productCode: updated.productCode,
        reason,
      },
      severity: AuditSeverity.CRITICAL,
    });

    return updated;
  }
}

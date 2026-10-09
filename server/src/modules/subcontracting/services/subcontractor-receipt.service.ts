import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateSubcontractorReceiptDto,
  InspectReceiptDto,
  ReconcileMaterialDto,
} from '../dto/subcontractor-receipt.dto';
import {
  AuditAction,
  AuditSeverity,
  SubcontractQualityStatus,
  SubcontractChallanStatus,
  JobWorkStatus,
} from '@prisma/client';

@Injectable()
export class SubcontractorReceiptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List subcontractor processed receipts with quality status and reconciliation
   */
  async getReceipts(query: {
    jobWorkOrderId?: string;
    challanId?: string;
    vendorId?: string;
    qualityStatus?: SubcontractQualityStatus;
  }) {
    const where: any = {};
    if (query.jobWorkOrderId) where.jobWorkOrderId = query.jobWorkOrderId;
    if (query.challanId) where.challanId = query.challanId;
    if (query.vendorId) where.vendorId = query.vendorId;
    if (query.qualityStatus) where.qualityStatus = query.qualityStatus;

    return this.prisma.subcontractorReceipt.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            vendorCode: true,
            companyName: true,
            qualityRating: true,
          },
        },
        jobWorkOrder: {
          select: {
            id: true,
            orderNumber: true,
            processDescription: true,
            targetProductPart: true,
            targetQuantity: true,
            receivedQuantity: true,
            scrapAllowancePercent: true,
          },
        },
        challan: {
          select: {
            id: true,
            challanNumber: true,
            totalQuantitySent: true,
            status: true,
          },
        },
        bill: {
          select: {
            id: true,
            billNumber: true,
            status: true,
            totalAmount: true,
          },
        },
      },
      orderBy: { receiptDate: 'desc' },
    });
  }

  /**
   * Process inbound receipt for processed items from subcontractor
   */
  async createReceipt(dto: CreateSubcontractorReceiptDto, userId?: string) {
    const challan = await this.prisma.subcontractorChallan.findUnique({
      where: { id: dto.challanId },
      include: { jobWorkOrder: true, vendor: true },
    });

    if (!challan) {
      throw new NotFoundException(`Challan with ID ${dto.challanId} not found.`);
    }

    const receiptNumber = dto.receiptNumber || `SR-${Date.now().toString().slice(-6)}`;
    const rejectedQty = dto.rejectedQuantity || 0;
    const scrapQty = dto.scrapReported || 0;
    const acceptedQty = dto.acceptedQuantity || (dto.receivedQuantity - rejectedQty);

    // Calculate material balance reconciliation variance
    // Input Quantity Sent - (Accepted + Rejected + Scrap)
    const variance = challan.totalQuantitySent - (acceptedQty + rejectedQty + scrapQty);
    const maxAllowedScrap = Math.ceil(
      (challan.totalQuantitySent * Number(challan.jobWorkOrder.scrapAllowancePercent)) / 100
    );
    const isBalanced = Math.abs(variance) <= maxAllowedScrap;

    const receipt = await this.prisma.subcontractorReceipt.create({
      data: {
        receiptNumber,
        jobWorkOrderId: dto.jobWorkOrderId || challan.jobWorkOrderId,
        challanId: dto.challanId,
        vendorId: dto.vendorId || challan.vendorId,
        receiptDate: dto.receiptDate ? new Date(dto.receiptDate) : new Date(),
        receivedQuantity: dto.receivedQuantity,
        acceptedQuantity: acceptedQty,
        rejectedQuantity: rejectedQty,
        scrapReported: scrapQty,
        qualityStatus: SubcontractQualityStatus.PENDING_INSPECTION,
        inspectorName: dto.inspectorName,
        inspectionRemarks: dto.inspectionRemarks,
        reconciliationVariance: variance,
        isReconciliationBalanced: isBalanced,
      },
      include: {
        vendor: true,
        jobWorkOrder: true,
        challan: true,
      },
    });

    // Update challan status
    await this.prisma.subcontractorChallan.update({
      where: { id: challan.id },
      data: {
        status: acceptedQty >= challan.totalQuantitySent
          ? SubcontractChallanStatus.FULLY_RETURNED
          : SubcontractChallanStatus.PARTIALLY_RETURNED,
      },
    });

    // Update job work order received quantity
    const newTotalReceived = challan.jobWorkOrder.receivedQuantity + acceptedQty;
    const isCompleted = newTotalReceived >= challan.jobWorkOrder.targetQuantity;

    await this.prisma.jobWorkOrder.update({
      where: { id: challan.jobWorkOrderId },
      data: {
        receivedQuantity: newTotalReceived,
        rejectedQuantity: challan.jobWorkOrder.rejectedQuantity + rejectedQty,
        status: isCompleted ? JobWorkStatus.COMPLETED : JobWorkStatus.PARTIALLY_RECEIVED,
        completedDate: isCompleted ? new Date() : undefined,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.SUBCONTRACT_RECEIPT_PROCESSED,
      severity: AuditSeverity.INFO,
      resource: 'PRODUCTION',
      details: {
        receiptNumber: receipt.receiptNumber,
        challanNumber: challan.challanNumber,
        receivedQuantity: dto.receivedQuantity,
        acceptedQuantity: acceptedQty,
        variance,
        isBalanced,
      },
    });

    return receipt;
  }

  /**
   * Conduct QC Inspection and sign-off on inbound subcontracted batch
   */
  async inspectReceipt(id: string, dto: InspectReceiptDto, userId?: string) {
    const receipt = await this.prisma.subcontractorReceipt.findUnique({
      where: { id },
      include: { challan: true, jobWorkOrder: true },
    });

    if (!receipt) {
      throw new NotFoundException(`Receipt with ID ${id} not found.`);
    }

    const scrapQty = dto.scrapReported !== undefined ? dto.scrapReported : receipt.scrapReported;
    const variance = receipt.challan.totalQuantitySent - (dto.acceptedQuantity + dto.rejectedQuantity + scrapQty);
    const maxAllowedScrap = Math.ceil(
      (receipt.challan.totalQuantitySent * Number(receipt.jobWorkOrder.scrapAllowancePercent)) / 100
    );
    const isBalanced = Math.abs(variance) <= maxAllowedScrap;

    const updated = await this.prisma.subcontractorReceipt.update({
      where: { id },
      data: {
        acceptedQuantity: dto.acceptedQuantity,
        rejectedQuantity: dto.rejectedQuantity,
        scrapReported: scrapQty,
        qualityStatus: dto.qualityStatus,
        inspectorName: dto.inspectorName,
        inspectionRemarks: dto.inspectionRemarks,
        reconciliationVariance: variance,
        isReconciliationBalanced: isBalanced,
      },
      include: { vendor: true, jobWorkOrder: true },
    });

    await this.auditLogService.logAction({
      userId: userId || dto.inspectorName,
      action: AuditAction.SUBCONTRACT_QC_VERIFIED,
      severity: dto.qualityStatus === 'QC_REJECTED' ? AuditSeverity.WARNING : AuditSeverity.INFO,
      resource: 'PRODUCTION',
      details: {
        receiptNumber: receipt.receiptNumber,
        qualityStatus: dto.qualityStatus,
        accepted: dto.acceptedQuantity,
        rejected: dto.rejectedQuantity,
      },
    });

    return updated;
  }

  /**
   * Finalize material reconciliation variance
   */
  async reconcileMaterial(dto: ReconcileMaterialDto, userId?: string) {
    const receipt = await this.prisma.subcontractorReceipt.findUnique({
      where: { id: dto.receiptId },
    });

    if (!receipt) {
      throw new NotFoundException(`Receipt with ID ${dto.receiptId} not found.`);
    }

    const updated = await this.prisma.subcontractorReceipt.update({
      where: { id: dto.receiptId },
      data: {
        isReconciliationBalanced: true,
        inspectionRemarks: dto.reconciliationNotes
          ? `${receipt.inspectionRemarks || ''} [Reconciliation Note: ${dto.reconciliationNotes}]`
          : receipt.inspectionRemarks,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.SUBCONTRACT_RECONCILIATION_BALANCED,
      severity: AuditSeverity.INFO,
      resource: 'PRODUCTION',
      details: {
        receiptNumber: receipt.receiptNumber,
        variance: receipt.reconciliationVariance,
      },
    });

    return updated;
  }
}

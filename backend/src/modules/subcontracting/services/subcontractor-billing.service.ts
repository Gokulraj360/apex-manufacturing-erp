import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateSubcontractorBillDto,
  ApproveSubcontractorBillDto,
  SyncToFinanceDto,
} from '../dto/subcontractor-billing.dto';
import {
  AuditAction,
  AuditSeverity,
  SubcontractBillStatus,
} from '@prisma/client';

@Injectable()
export class SubcontractorBillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List subcontractor processing charge bills
   */
  async getBills(query: {
    vendorId?: string;
    status?: SubcontractBillStatus;
    syncedToFinance?: boolean;
  }) {
    const where: any = {};
    if (query.vendorId) where.vendorId = query.vendorId;
    if (query.status) where.status = query.status;
    if (query.syncedToFinance !== undefined) where.syncedToFinance = query.syncedToFinance;

    return this.prisma.subcontractorBill.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            vendorCode: true,
            companyName: true,
            city: true,
            gstinTaxId: true,
          },
        },
        jobWorkOrder: {
          select: {
            id: true,
            orderNumber: true,
            processDescription: true,
            targetProductPart: true,
          },
        },
        receipts: {
          select: {
            id: true,
            receiptNumber: true,
            acceptedQuantity: true,
            qualityStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create vendor bill for processing charges
   */
  async createBill(dto: CreateSubcontractorBillDto, userId?: string) {
    const order = await this.prisma.jobWorkOrder.findUnique({
      where: { id: dto.jobWorkOrderId },
      include: { vendor: true },
    });

    if (!order) {
      throw new NotFoundException(`Job Work Order with ID ${dto.jobWorkOrderId} not found.`);
    }

    const billNumber = dto.billNumber || `SCB-${Date.now().toString().slice(-6)}`;
    const subtotal = Number(dto.billedQuantity) * Number(dto.processingRate);
    const tax = Number(dto.taxAmount || 0);
    const totalAmount = subtotal + tax;

    const bill = await this.prisma.subcontractorBill.create({
      data: {
        billNumber,
        vendorInvoiceRef: dto.vendorInvoiceRef,
        vendorId: dto.vendorId || order.vendorId,
        jobWorkOrderId: dto.jobWorkOrderId,
        billedQuantity: dto.billedQuantity,
        processingRate: dto.processingRate,
        subtotalAmount: subtotal,
        taxAmount: tax,
        totalAmount,
        status: SubcontractBillStatus.PENDING_APPROVAL,
        paymentDueDate: dto.paymentDueDate ? new Date(dto.paymentDueDate) : undefined,
      },
      include: {
        vendor: true,
        jobWorkOrder: true,
      },
    });

    // Link receipts if provided
    if (dto.receiptIds && dto.receiptIds.length > 0) {
      await this.prisma.subcontractorReceipt.updateMany({
        where: { id: { in: dto.receiptIds } },
        data: { billId: bill.id },
      });
    }

    return bill;
  }

  /**
   * Approve or dispute vendor bill
   */
  async approveBill(dto: ApproveSubcontractorBillDto, userId?: string) {
    const bill = await this.prisma.subcontractorBill.findUnique({
      where: { id: dto.billId },
      include: { vendor: true },
    });

    if (!bill) {
      throw new NotFoundException(`Subcontractor Bill with ID ${dto.billId} not found.`);
    }

    const newStatus = dto.decision === 'APPROVE' ? SubcontractBillStatus.APPROVED : SubcontractBillStatus.DISPUTED;

    const updated = await this.prisma.subcontractorBill.update({
      where: { id: dto.billId },
      data: {
        status: newStatus,
        approvedBy: dto.approvedBy,
        approvedAt: new Date(),
      },
      include: { vendor: true, jobWorkOrder: true },
    });

    await this.auditLogService.logAction({
      userId: userId || dto.approvedBy,
      action: AuditAction.SUBCONTRACT_BILL_APPROVED,
      severity: dto.decision === 'APPROVE' ? AuditSeverity.INFO : AuditSeverity.WARNING,
      resource: 'FINANCE',
      details: {
        billNumber: bill.billNumber,
        decision: dto.decision,
        amount: Number(bill.totalAmount),
        vendor: bill.vendor.companyName,
      },
    });

    return updated;
  }

  /**
   * Sync verified subcontracting bill to General Ledger in Finance Module
   */
  async syncToFinance(dto: SyncToFinanceDto, userId?: string) {
    const bill = await this.prisma.subcontractorBill.findUnique({
      where: { id: dto.billId },
      include: { vendor: true, jobWorkOrder: true },
    });

    if (!bill) {
      throw new NotFoundException(`Bill with ID ${dto.billId} not found.`);
    }

    if (bill.status !== SubcontractBillStatus.APPROVED) {
      throw new BadRequestException('Only approved bills can be synchronized to the financial ledger.');
    }

    const updated = await this.prisma.subcontractorBill.update({
      where: { id: dto.billId },
      data: { syncedToFinance: true },
      include: { vendor: true, jobWorkOrder: true },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.PERIOD_CLOSE,
      severity: AuditSeverity.INFO,
      resource: 'FINANCE',
      details: {
        billNumber: bill.billNumber,
        action: 'SUBCONTRACT_EXPENSE_LEDGER_SYNC',
        amount: Number(bill.totalAmount),
        vendor: bill.vendor.companyName,
      },
    });

    return updated;
  }
}

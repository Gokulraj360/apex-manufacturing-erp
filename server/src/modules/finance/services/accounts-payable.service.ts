import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateVendorBillDto,
  VerifyThreeWayMatchDto,
  ScheduleVendorPaymentDto,
  RecordVendorPaymentDisbursementDto,
} from '../dto/accounts-payable.dto';
import {
  AuditAction,
  AuditSeverity,
  VendorBillStatus,
  ThreeWayMatchStatus,
} from '@prisma/client';

@Injectable()
export class AccountsPayableService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all vendor bills with matching status
   */
  async getVendorBills() {
    return this.prisma.vendorBill.findMany({
      orderBy: { invoiceDate: 'desc' },
      include: {
        purchaseOrder: true,
        ledgerEntries: true,
      },
    });
  }

  /**
   * Create new Vendor Bill
   */
  async createVendorBill(dto: CreateVendorBillDto, adminUserId?: string) {
    const taxAmount = dto.taxAmount || 0;
    const totalAmount = dto.totalAmount || (dto.subtotal + taxAmount);

    let poAmountExpected = null;
    if (dto.poId) {
      const po = await this.prisma.purchaseOrder.findUnique({ where: { id: dto.poId } });
      if (po) {
        poAmountExpected = Number(po.totalAmount);
      }
    }

    const bill = await this.prisma.vendorBill.create({
      data: {
        billNumber: dto.billNumber,
        vendorName: dto.vendorName,
        vendorInvoiceNo: dto.vendorInvoiceNo,
        poId: dto.poId,
        grnNumber: dto.grnNumber,
        invoiceDate: new Date(dto.invoiceDate),
        dueDate: new Date(dto.dueDate),
        subtotal: dto.subtotal,
        taxAmount,
        totalAmount,
        billedQuantity: dto.billedQuantity,
        poAmountExpected,
        status: dto.poId ? VendorBillStatus.PENDING_MATCHING : VendorBillStatus.APPROVED,
        matchStatus: dto.poId ? ThreeWayMatchStatus.PENDING : ThreeWayMatchStatus.EXACT_MATCH,
      },
    });

    // Automatically record liability in Vendor Ledger
    const lastLedger = await this.prisma.vendorLedger.findFirst({
      where: { vendorName: dto.vendorName },
      orderBy: { transactionDate: 'desc' },
    });

    const previousBalance = lastLedger ? Number(lastLedger.runningBalance) : 0;
    const newBalance = previousBalance + totalAmount;

    await this.prisma.vendorLedger.create({
      data: {
        vendorName: dto.vendorName,
        transactionDate: new Date(),
        transactionType: 'BILL_INCURRED',
        referenceNo: bill.billNumber,
        credit: totalAmount, // Increases payable liability
        debit: 0,
        runningBalance: newBalance,
        vendorBillId: bill.id,
        notes: `Incurred payable from Vendor Bill ${bill.vendorInvoiceNo}`,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.CREATE,
      entity: 'VENDOR_BILL',
      entityId: bill.id,
      details: `Created vendor bill ${bill.billNumber} from ${bill.vendorName} for $${totalAmount}`,
      severity: AuditSeverity.INFO,
    });

    return bill;
  }

  /**
   * Perform 3-Way Matching Verification (PO vs GRN vs Vendor Invoice)
   */
  async verifyThreeWayMatch(dto: VerifyThreeWayMatchDto, adminUserId?: string) {
    const bill = await this.prisma.vendorBill.findUnique({
      where: { id: dto.vendorBillId },
      include: { purchaseOrder: true },
    });

    if (!bill) throw new NotFoundException('Vendor bill not found.');

    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: dto.poId },
    });

    if (!po) throw new NotFoundException('Purchase order not found for 3-way match.');

    const billedTotal = Number(bill.totalAmount);
    const poExpectedTotal = Number(po.totalAmount);
    const amountDifference = Math.abs(billedTotal - poExpectedTotal);

    let matchStatus: ThreeWayMatchStatus = ThreeWayMatchStatus.EXACT_MATCH;
    let billStatus: VendorBillStatus = VendorBillStatus.MATCHED;
    let discrepancyNotes: string | null = null;

    // Price tolerance check (allow within $1.00 for rounding)
    if (amountDifference > 1.0) {
      matchStatus = ThreeWayMatchStatus.PRICE_DISCREPANCY;
      billStatus = VendorBillStatus.DISCREPANCY;
      discrepancyNotes = `Price variance detected! Billed: $${billedTotal.toFixed(2)} vs PO Contract: $${poExpectedTotal.toFixed(2)} (Variance: $${(billedTotal - poExpectedTotal).toFixed(2)})`;
    }

    // Simulated Goods Received Note (GRN) verification
    if (dto.grnNumber && dto.grnNumber.toLowerCase().includes('shortage')) {
      matchStatus = ThreeWayMatchStatus.QTY_DISCREPANCY;
      billStatus = VendorBillStatus.DISCREPANCY;
      discrepancyNotes = `Quantity variance on GRN ${dto.grnNumber}! Received items do not match invoiced quantities.`;
    }

    const updatedBill = await this.prisma.vendorBill.update({
      where: { id: bill.id },
      data: {
        poId: po.id,
        grnNumber: dto.grnNumber || bill.grnNumber,
        poAmountExpected: poExpectedTotal,
        matchStatus,
        status: billStatus,
        discrepancyNotes,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.VENDOR_BILL_MATCH,
      entity: 'VENDOR_BILL',
      entityId: bill.id,
      details: `Executed 3-Way Match for Bill ${bill.billNumber}: Result=${matchStatus}`,
      changes: { matchStatus, discrepancyNotes },
      severity: matchStatus === ThreeWayMatchStatus.EXACT_MATCH ? AuditSeverity.INFO : AuditSeverity.WARNING,
    });

    return updatedBill;
  }

  /**
   * Schedule Vendor Bill for Payment
   */
  async schedulePayment(dto: ScheduleVendorPaymentDto, adminUserId?: string) {
    const bill = await this.prisma.vendorBill.findUnique({ where: { id: dto.vendorBillId } });
    if (!bill) throw new NotFoundException('Vendor bill not found.');

    if (bill.status === VendorBillStatus.DISCREPANCY) {
      throw new BadRequestException('Cannot schedule payment for a bill with unresolved 3-way matching discrepancies.');
    }

    return this.prisma.vendorBill.update({
      where: { id: bill.id },
      data: {
        scheduledPaymentDate: new Date(dto.scheduledDate),
        status: VendorBillStatus.SCHEDULED_FOR_PAYMENT,
      },
    });
  }

  /**
   * Disburse Payment to Vendor (Reduces Accounts Payable)
   */
  async disbursePayment(dto: RecordVendorPaymentDisbursementDto, adminUserId?: string) {
    const bill = await this.prisma.vendorBill.findUnique({ where: { id: dto.vendorBillId } });
    if (!bill) throw new NotFoundException('Vendor bill not found.');

    const newPaidAmount = Number(bill.paidAmount) + Number(dto.amountPaid);
    const isFullyPaid = newPaidAmount >= Number(bill.totalAmount) - 0.01;

    // Update Vendor Bill
    const updatedBill = await this.prisma.vendorBill.update({
      where: { id: bill.id },
      data: {
        paidAmount: newPaidAmount,
        status: isFullyPaid ? VendorBillStatus.PAID : VendorBillStatus.APPROVED,
      },
    });

    // Record reduction in Vendor Ledger
    const lastLedger = await this.prisma.vendorLedger.findFirst({
      where: { vendorName: bill.vendorName },
      orderBy: { transactionDate: 'desc' },
    });

    const previousBalance = lastLedger ? Number(lastLedger.runningBalance) : 0;
    const newBalance = previousBalance - Number(dto.amountPaid);

    await this.prisma.vendorLedger.create({
      data: {
        vendorName: bill.vendorName,
        transactionDate: new Date(),
        transactionType: 'PAYMENT_DISBURSED',
        referenceNo: dto.referenceNo,
        debit: dto.amountPaid, // Debit AP reduces liability
        credit: 0,
        runningBalance: newBalance,
        vendorBillId: bill.id,
        notes: dto.notes || `Disbursement for bill ${bill.billNumber}`,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.PAYMENT_DISBURSED,
      entity: 'VENDOR_BILL',
      entityId: bill.id,
      details: `Disbursed $${dto.amountPaid} payment to ${bill.vendorName} (Ref: ${dto.referenceNo})`,
      severity: AuditSeverity.WARNING,
    });

    return updatedBill;
  }

  /**
   * Get Vendor Ledger Statement
   */
  async getVendorLedger(vendorName?: string) {
    const where: any = {};
    if (vendorName) where.vendorName = vendorName;

    return this.prisma.vendorLedger.findMany({
      where,
      orderBy: { transactionDate: 'desc' },
      include: { vendorBill: true },
    });
  }
}

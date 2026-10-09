import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateClientInvoiceDto,
  RecordIncomingPaymentDto,
  CreateCreditNoteDto,
} from '../dto/accounts-receivable.dto';
import {
  AuditAction,
  AuditSeverity,
  ClientInvoiceStatus,
  CreditNoteStatus,
} from '@prisma/client';

@Injectable()
export class AccountsReceivableService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all client invoices with credit notes
   */
  async getInvoices() {
    return this.prisma.clientInvoice.findMany({
      orderBy: { issueDate: 'desc' },
      include: {
        creditNotes: true,
      },
    });
  }

  /**
   * Create Client Invoice
   */
  async createInvoice(dto: CreateClientInvoiceDto, adminUserId?: string) {
    const existing = await this.prisma.clientInvoice.findUnique({
      where: { invoiceNumber: dto.invoiceNumber },
    });
    if (existing) {
      throw new BadRequestException(`Invoice number ${dto.invoiceNumber} already exists.`);
    }

    const taxRate = dto.taxRatePercentage !== undefined ? dto.taxRatePercentage : 18.0;
    const taxAmount = Number(((dto.subtotal * taxRate) / 100).toFixed(2));
    const totalAmount = Number((dto.subtotal + taxAmount).toFixed(2));

    const invoice = await this.prisma.clientInvoice.create({
      data: {
        invoiceNumber: dto.invoiceNumber,
        clientName: dto.clientName,
        issueDate: new Date(),
        dueDate: new Date(dto.dueDate),
        subtotal: dto.subtotal,
        taxRatePercentage: taxRate,
        taxAmount,
        totalAmount,
        paidAmount: 0,
        status: ClientInvoiceStatus.ISSUED,
        paymentTerms: dto.paymentTerms || 'NET_30',
        lineItems: dto.lineItems as any,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.INVOICE_GENERATED,
      entity: 'CLIENT_INVOICE',
      entityId: invoice.id,
      details: `Generated client invoice ${invoice.invoiceNumber} for ${invoice.clientName} ($${totalAmount})`,
      severity: AuditSeverity.INFO,
    });

    return invoice;
  }

  /**
   * Record Incoming Payment from Client
   */
  async recordPayment(dto: RecordIncomingPaymentDto, adminUserId?: string) {
    const invoice = await this.prisma.clientInvoice.findUnique({
      where: { id: dto.invoiceId },
    });
    if (!invoice) throw new NotFoundException('Client invoice not found.');

    const newPaidAmount = Number(invoice.paidAmount) + Number(dto.amountReceived);
    const totalAmount = Number(invoice.totalAmount);

    let status: ClientInvoiceStatus = ClientInvoiceStatus.PARTIALLY_PAID;
    if (newPaidAmount >= totalAmount - 0.01) {
      status = ClientInvoiceStatus.PAID;
    }

    const updated = await this.prisma.clientInvoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: newPaidAmount,
        status,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.UPDATE,
      entity: 'CLIENT_INVOICE',
      entityId: invoice.id,
      details: `Received payment of $${dto.amountReceived} for Invoice ${invoice.invoiceNumber}. New Status: ${status}`,
      changes: { paymentRef: dto.referenceNo, paidAmount: newPaidAmount },
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Issue Credit Note against an Invoice
   */
  async createCreditNote(dto: CreateCreditNoteDto, adminUserId?: string) {
    const invoice = await this.prisma.clientInvoice.findUnique({
      where: { id: dto.clientInvoiceId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found.');

    const creditNote = await this.prisma.creditNote.create({
      data: {
        creditNoteNumber: dto.creditNoteNumber,
        clientInvoiceId: dto.clientInvoiceId,
        amount: dto.amount,
        reason: dto.reason,
        status: CreditNoteStatus.APPLIED,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.CREATE,
      entity: 'CREDIT_NOTE',
      entityId: creditNote.id,
      details: `Issued credit note ${creditNote.creditNoteNumber} ($${dto.amount}) against invoice ${invoice.invoiceNumber}. Reason: ${dto.reason}`,
      severity: AuditSeverity.WARNING,
    });

    return creditNote;
  }

  /**
   * Compute AR Aging Analysis (0-30, 31-60, 61-90, 90+ days)
   */
  async getAgingAnalysis() {
    const invoices = await this.prisma.clientInvoice.findMany({
      where: {
        status: { in: [ClientInvoiceStatus.ISSUED, ClientInvoiceStatus.PARTIALLY_PAID, ClientInvoiceStatus.OVERDUE] },
      },
    });

    const now = new Date();
    const buckets = {
      current0to30: 0,
      days31to60: 0,
      days61to90: 0,
      over90days: 0,
      totalOutstanding: 0,
    };

    for (const inv of invoices) {
      const outstanding = Number(inv.totalAmount) - Number(inv.paidAmount);
      const diffTime = Math.abs(now.getTime() - new Date(inv.dueDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      buckets.totalOutstanding += outstanding;
      if (new Date(inv.dueDate) > now || diffDays <= 30) {
        buckets.current0to30 += outstanding;
      } else if (diffDays <= 60) {
        buckets.days31to60 += outstanding;
      } else if (diffDays <= 90) {
        buckets.days61to90 += outstanding;
      } else {
        buckets.over90days += outstanding;
      }
    }

    return buckets;
  }
}

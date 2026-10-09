import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateQuotationDto,
  ReviseQuotationDto,
  UpdateQuotationStatusDto,
} from '../dto/quotation.dto';
import {
  AuditAction,
  AuditSeverity,
  QuotationStatus,
} from '@prisma/client';

@Injectable()
export class QuotationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all quotations
   */
  async getQuotations(query?: {
    status?: QuotationStatus;
    clientId?: string;
    search?: string;
  }) {
    const where: any = {};

    if (query?.status) {
      where.status = query.status;
    }
    if (query?.clientId) {
      where.clientId = query.clientId;
    }
    if (query?.search) {
      where.OR = [
        { quotationNumber: { contains: query.search, mode: 'insensitive' } },
        { clientName: { contains: query.search, mode: 'insensitive' } },
        { preparedBy: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.quotation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: true,
        client: true,
      },
    });
  }

  /**
   * Get single quotation by ID
   */
  async getQuotationById(id: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
      include: {
        lead: true,
        client: true,
        salesOrders: true,
      },
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${id} not found`);
    }

    return quotation;
  }

  /**
   * Create official product price quotation from manufacturing cost sheet
   */
  async createQuotation(dto: CreateQuotationDto) {
    const count = await this.prisma.quotation.count();
    const quotationNumber = `QT-2026-0${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.quotation.create({
      data: {
        quotationNumber,
        revisionNumber: 1,
        leadId: dto.leadId || null,
        clientId: dto.clientId || null,
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        status: QuotationStatus.DRAFT,
        validUntilDate: new Date(dto.validUntilDate),
        paymentTerms: dto.paymentTerms || 'NET_30',
        incoterms: dto.incoterms || 'FOB MIDC Chakan',
        currency: dto.currency || 'USD',
        subtotal: dto.subtotal,
        discountAmount: dto.discountAmount || 0,
        taxAmount: dto.taxAmount || 0,
        totalAmount: dto.totalAmount,
        manufacturingCostBasis: dto.manufacturingCostBasis,
        lineItems: dto.lineItems,
        preparedBy: dto.preparedBy,
        revisionsHistory: [],
      },
    });

    await this.auditLogService.logAction(
      AuditAction.QUOTATION_GENERATED,
      AuditSeverity.INFO,
      `Quotation ${quotationNumber} prepared for ${dto.clientName} totaling $${dto.totalAmount}`,
      dto.preparedBy,
      'QuotationService',
      { quotationId: created.id, quotationNumber, totalAmount: dto.totalAmount },
    );

    return created;
  }

  /**
   * Revise quotation with snapshot revision history
   */
  async reviseQuotation(id: string, dto: ReviseQuotationDto) {
    const quotation = await this.getQuotationById(id);

    const history = (quotation.revisionsHistory as any[]) || [];
    const snapshot = {
      revisionNumber: quotation.revisionNumber,
      revisedAt: new Date().toISOString(),
      revisedBy: dto.revisedBy,
      reason: dto.revisionReason,
      previousSubtotal: quotation.subtotal,
      previousTotal: quotation.totalAmount,
      previousLineItems: quotation.lineItems,
    };

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: {
        revisionNumber: quotation.revisionNumber + 1,
        status: QuotationStatus.REVISED,
        subtotal: dto.subtotal,
        discountAmount: dto.discountAmount || 0,
        taxAmount: dto.taxAmount || 0,
        totalAmount: dto.totalAmount,
        manufacturingCostBasis: dto.manufacturingCostBasis,
        lineItems: dto.lineItems,
        revisionsHistory: [...history, snapshot],
      },
    });

    await this.auditLogService.logAction(
      AuditAction.QUOTATION_REVISED,
      AuditSeverity.INFO,
      `Quotation ${quotation.quotationNumber} updated to Rev ${updated.revisionNumber} by ${dto.revisedBy} (${dto.revisionReason})`,
      dto.revisedBy,
      'QuotationService',
      { quotationId: id, newRevision: updated.revisionNumber, newTotal: dto.totalAmount },
    );

    return updated;
  }

  /**
   * Update quotation status
   */
  async updateQuotationStatus(id: string, dto: UpdateQuotationStatusDto) {
    const quotation = await this.getQuotationById(id);

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: {
        status: dto.status as any,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.UPDATE,
      AuditSeverity.INFO,
      `Quotation ${quotation.quotationNumber} status set to ${dto.status} by ${dto.updatedBy}`,
      dto.updatedBy,
      'QuotationService',
      { quotationId: id, status: dto.status, remarks: dto.remarks },
    );

    return updated;
  }
}

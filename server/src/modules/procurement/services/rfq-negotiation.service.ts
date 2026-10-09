import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateRFQDto,
  SubmitSupplierBidDto,
  EvaluateBidDto,
  AwardRFQDto,
} from '../dto/rfq-negotiation.dto';
import {
  AuditAction,
  AuditSeverity,
  RFQStatus,
  BidStatus,
  ProcurementPOStatus,
} from '@prisma/client';

@Injectable()
export class RFQNegotiationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all Requests for Quotation (RFQs)
   */
  async getRFQs(query?: { status?: RFQStatus; search?: string }) {
    const where: any = {};

    if (query?.status) {
      where.status = query.status;
    }
    if (query?.search) {
      where.OR = [
        { rfqNumber: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.requestForQuotation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        requisition: true,
        bids: {
          orderBy: { bidAmountTotal: 'asc' },
        },
        _count: {
          select: { bids: true },
        },
      },
    });
  }

  /**
   * Get single RFQ with all bids
   */
  async getRFQById(id: string) {
    const rfq = await this.prisma.requestForQuotation.findUnique({
      where: { id },
      include: {
        requisition: true,
        bids: {
          orderBy: { evaluationScore: 'desc' },
        },
        procurementOrders: true,
      },
    });

    if (!rfq) {
      throw new NotFoundException(`RFQ with ID ${id} not found`);
    }

    return rfq;
  }

  /**
   * Create a new Request for Quotation
   */
  async createRFQ(dto: CreateRFQDto) {
    const count = await this.prisma.requestForQuotation.count();
    const rfqNumber = `RFQ-2026-0${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.requestForQuotation.create({
      data: {
        rfqNumber,
        title: dto.title,
        description: dto.description || null,
        requisitionId: dto.requisitionId || null,
        status: RFQStatus.PUBLISHED,
        deadlineDate: new Date(dto.deadlineDate),
        targetDeliveryDate: new Date(dto.targetDeliveryDate),
        paymentTerms: dto.paymentTerms || 'NET_30',
        deliveryTerms: dto.deliveryTerms || 'FOB Plant MIDC Chakan',
        items: dto.items,
        invitedVendorsJson: dto.invitedVendors || null,
        createdBy: dto.createdBy,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.RFQ_CREATED,
      AuditSeverity.INFO,
      `Request for Quotation ${rfqNumber} ("${dto.title}") published to suppliers`,
      dto.createdBy,
      'RFQNegotiationService',
      { rfqId: created.id, deadline: dto.deadlineDate },
    );

    return created;
  }

  /**
   * Submit or log a supplier bid for an RFQ
   */
  async submitSupplierBid(dto: SubmitSupplierBidDto) {
    const rfq = await this.getRFQById(dto.rfqId);

    if (rfq.status === RFQStatus.AWARDED || rfq.status === RFQStatus.CANCELLED) {
      throw new BadRequestException(
        `Cannot submit bid for RFQ with status ${rfq.status}`,
      );
    }

    const bid = await this.prisma.supplierBid.create({
      data: {
        rfqId: dto.rfqId,
        vendorId: dto.vendorId || null,
        vendorName: dto.vendorName,
        vendorEmail: dto.vendorEmail,
        vendorPhone: dto.vendorPhone,
        bidAmountTotal: dto.bidAmountTotal,
        quotedItems: dto.quotedItems,
        paymentTermsOffered: dto.paymentTermsOffered || 'NET_30',
        validUntilDate: new Date(dto.validUntilDate),
        status: BidStatus.SUBMITTED,
        negotiationNotes: dto.negotiationNotes || null,
      },
    });

    // Update RFQ status to EVALUATION if in PUBLISHED
    if (rfq.status === RFQStatus.PUBLISHED) {
      await this.prisma.requestForQuotation.update({
        where: { id: rfq.id },
        data: { status: RFQStatus.EVALUATION },
      });
    }

    return bid;
  }

  /**
   * Evaluate and score a supplier bid
   */
  async evaluateBid(bidId: string, dto: EvaluateBidDto) {
    const bid = await this.prisma.supplierBid.findUnique({
      where: { id: bidId },
      include: { rfq: true },
    });

    if (!bid) {
      throw new NotFoundException(`Supplier bid with ID ${bidId} not found`);
    }

    const updated = await this.prisma.supplierBid.update({
      where: { id: bidId },
      data: {
        evaluationScore: dto.evaluationScore,
        status: dto.status as any,
        negotiationNotes: dto.negotiationNotes || bid.negotiationNotes,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.RFQ_BID_EVALUATED,
      AuditSeverity.INFO,
      `Supplier bid from ${bid.vendorName} on RFQ ${bid.rfq.rfqNumber} scored at ${dto.evaluationScore}% (Status: ${dto.status})`,
      'ProcurementSpecialist',
      'RFQNegotiationService',
      { bidId, score: dto.evaluationScore, status: dto.status },
    );

    return updated;
  }

  /**
   * Award RFQ to winning supplier and generate official PO
   */
  async awardRFQ(rfqId: string, dto: AwardRFQDto) {
    const rfq = await this.getRFQById(rfqId);
    const winningBid = await this.prisma.supplierBid.findUnique({
      where: { id: dto.selectedBidId },
    });

    if (!winningBid || winningBid.rfqId !== rfqId) {
      throw new BadRequestException('Selected winning bid is invalid for this RFQ');
    }

    // Accept winning bid
    await this.prisma.supplierBid.update({
      where: { id: winningBid.id },
      data: { status: BidStatus.ACCEPTED },
    });

    // Reject other bids
    await this.prisma.supplierBid.updateMany({
      where: {
        rfqId,
        id: { not: winningBid.id },
      },
      data: { status: BidStatus.REJECTED },
    });

    // Update RFQ status to AWARDED
    await this.prisma.requestForQuotation.update({
      where: { id: rfqId },
      data: { status: RFQStatus.AWARDED },
    });

    // Generate Official Purchase Order for winning vendor
    const poCount = await this.prisma.purchaseOrderProcurement.count();
    const poNumber = `PO-PROC-2026-0${String(poCount + 1).padStart(3, '0')}`;

    const quotedItems = (winningBid.quotedItems as any[]) || [];
    let subtotal = 0;
    const poItems = quotedItems.map((item) => {
      const lineTotal = Number(item.offeredQty || 1) * Number(item.unitPrice || 0);
      subtotal += lineTotal;
      return {
        itemSku: item.itemSku,
        itemName: item.itemName,
        orderedQty: Number(item.offeredQty || 1),
        receivedQty: 0,
        unitPrice: Number(item.unitPrice || 0),
        discountPct: 0,
        lineTotal,
        targetDate: rfq.targetDeliveryDate.toISOString().split('T')[0],
      };
    });

    const taxAmount = subtotal * 0.18;
    const totalAmount = subtotal + taxAmount;

    const po = await this.prisma.purchaseOrderProcurement.create({
      data: {
        poNumber,
        requisitionId: rfq.requisitionId || null,
        rfqId: rfq.id,
        supplierBidId: winningBid.id,
        vendorId: winningBid.vendorId || null,
        vendorName: winningBid.vendorName,
        vendorEmail: winningBid.vendorEmail,
        vendorPhone: winningBid.vendorPhone,
        vendorAddress: 'Registered Vendor Facility',
        orderDate: new Date(),
        promisedDeliveryDate: rfq.targetDeliveryDate,
        status: ProcurementPOStatus.ISSUED,
        currency: 'USD',
        subtotal,
        taxAmount,
        discountAmount: 0,
        totalAmount,
        paymentTerms: winningBid.paymentTermsOffered,
        deliveryAddress: rfq.deliveryTerms,
        items: poItems,
        issuedBy: dto.awardedBy,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.PROCUREMENT_PO_ISSUED,
      AuditSeverity.INFO,
      `RFQ ${rfq.rfqNumber} awarded to ${winningBid.vendorName}. Generated PO ${poNumber}`,
      dto.awardedBy,
      'RFQNegotiationService',
      { rfqId, bidId: winningBid.id, poId: po.id, poNumber },
    );

    return {
      awardedRFQ: rfq,
      winningBid,
      generatedPO: po,
    };
  }
}

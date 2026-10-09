import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateInquiryDto,
  ResolveInquiryDto,
  CreateFeedbackDto,
} from '../dto/customer-support.dto';
import {
  AuditAction,
  AuditSeverity,
  InquiryStatus,
  FeedbackSentiment,
} from '@prisma/client';

@Injectable()
export class CustomerSupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List customer inquiries
   */
  async getInquiries(query?: {
    status?: InquiryStatus;
    clientId?: string;
    category?: string;
    search?: string;
  }) {
    const where: any = {};

    if (query?.status) {
      where.status = query.status;
    }
    if (query?.clientId) {
      where.clientId = query.clientId;
    }
    if (query?.category) {
      where.category = query.category as any;
    }
    if (query?.search) {
      where.OR = [
        { ticketNumber: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.customerInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        salesOrder: true,
      },
    });
  }

  /**
   * Create customer inquiry ticket
   */
  async createInquiry(dto: CreateInquiryDto) {
    const count = await this.prisma.customerInquiry.count();
    const ticketNumber = `INQ-2026-0${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.customerInquiry.create({
      data: {
        ticketNumber,
        clientId: dto.clientId,
        salesOrderId: dto.salesOrderId || null,
        category: dto.category as any,
        subject: dto.subject,
        description: dto.description,
        priority: (dto.priority as any) || 'MEDIUM',
        status: InquiryStatus.OPEN,
        assignedAgent: dto.assignedAgent,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.CUSTOMER_INQUIRY_LOGGED,
      AuditSeverity.INFO,
      `Customer Inquiry ${ticketNumber} ("${dto.subject}") logged for agent ${dto.assignedAgent}`,
      dto.assignedAgent,
      'CustomerSupportService',
      { inquiryId: created.id, ticketNumber, category: dto.category },
    );

    return created;
  }

  /**
   * Resolve customer inquiry
   */
  async resolveInquiry(id: string, dto: ResolveInquiryDto) {
    const inq = await this.prisma.customerInquiry.findUnique({
      where: { id },
    });

    if (!inq) {
      throw new NotFoundException(`Inquiry with ID ${id} not found`);
    }

    const updated = await this.prisma.customerInquiry.update({
      where: { id },
      data: {
        status: InquiryStatus.RESOLVED,
        resolutionNotes: dto.resolutionNotes,
        resolvedAt: new Date(),
      },
    });

    await this.auditLogService.logAction(
      AuditAction.UPDATE,
      AuditSeverity.INFO,
      `Customer Inquiry ${inq.ticketNumber} resolved by ${dto.resolvedBy}`,
      dto.resolvedBy,
      'CustomerSupportService',
      { inquiryId: id, resolution: dto.resolutionNotes },
    );

    return updated;
  }

  /**
   * List customer feedbacks
   */
  async getFeedbacks(query?: { sentiment?: FeedbackSentiment; clientId?: string }) {
    const where: any = {};

    if (query?.sentiment) {
      where.sentiment = query.sentiment;
    }
    if (query?.clientId) {
      where.clientId = query.clientId;
    }

    return this.prisma.customerFeedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
      },
    });
  }

  /**
   * Record customer feedback
   */
  async createFeedback(dto: CreateFeedbackDto) {
    const count = await this.prisma.customerFeedback.count();
    const feedbackNumber = `FB-2026-0${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.customerFeedback.create({
      data: {
        feedbackNumber,
        clientId: dto.clientId,
        sentiment: dto.sentiment as any,
        npsScore: dto.npsScore,
        deliveryRating: dto.deliveryRating,
        qualityRating: dto.qualityRating,
        communicationRating: dto.communicationRating,
        feedbackComments: dto.feedbackComments,
        orderReference: dto.orderReference || null,
        actionTaken: dto.actionTaken || null,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.CUSTOMER_FEEDBACK_RECORDED,
      dto.sentiment === 'ESCALATED' ? AuditSeverity.WARNING : AuditSeverity.INFO,
      `Customer feedback ${feedbackNumber} received with NPS ${dto.npsScore}/10 (${dto.sentiment})`,
      'CustomerSupport',
      'CustomerSupportService',
      { feedbackId: created.id, feedbackNumber, sentiment: dto.sentiment },
    );

    return created;
  }

  /**
   * Order Tracking Viewer for Client
   */
  async getOrderTrackingByOrderNumber(orderNumber: string) {
    const order = await this.prisma.salesOrderCRM.findUnique({
      where: { orderNumber },
      include: {
        client: true,
        inquiries: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderNumber} not found`);
    }

    return {
      orderNumber: order.orderNumber,
      clientName: order.client.companyName,
      status: order.status,
      targetDeliveryDate: order.targetDeliveryDate,
      productionWorkOrderRef: order.productionWorkOrderRef,
      shippingAddress: order.shippingAddress,
      totalAmount: order.totalAmount,
      lineItems: order.lineItems,
      inquiriesCount: order.inquiries.length,
    };
  }
}

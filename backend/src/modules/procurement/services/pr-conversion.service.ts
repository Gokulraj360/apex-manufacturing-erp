import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateRequisitionDto,
  ReviewRequisitionDto,
  ConvertPRToPODto,
} from '../dto/pr-conversion.dto';
import {
  AuditAction,
  AuditSeverity,
  RequisitionStatus,
  ProcurementPOStatus,
} from '@prisma/client';

@Injectable()
export class PRConversionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all purchase requisitions from Production / Warehouse
   */
  async getRequisitions(query?: {
    status?: RequisitionStatus;
    department?: string;
    priority?: string;
    search?: string;
  }) {
    const where: any = {};

    if (query?.status) {
      where.status = query.status;
    }
    if (query?.department) {
      where.department = { contains: query.department, mode: 'insensitive' };
    }
    if (query?.priority) {
      where.priority = query.priority;
    }
    if (query?.search) {
      where.OR = [
        { requisitionNumber: { contains: query.search, mode: 'insensitive' } },
        { requestedBy: { contains: query.search, mode: 'insensitive' } },
        { justification: { contains: query.search, mode: 'insensitive' } },
        { department: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.purchaseRequisition.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        rfqs: true,
        procurementOrders: true,
      },
    });
  }

  /**
   * Get single requisition by ID
   */
  async getRequisitionById(id: string) {
    const pr = await this.prisma.purchaseRequisition.findUnique({
      where: { id },
      include: {
        rfqs: true,
        procurementOrders: true,
      },
    });

    if (!pr) {
      throw new NotFoundException(`Purchase requisition with ID ${id} not found`);
    }

    return pr;
  }

  /**
   * Create material request requisition
   */
  async createRequisition(dto: CreateRequisitionDto) {
    const count = await this.prisma.purchaseRequisition.count();
    const requisitionNumber = `PR-2026-0${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.purchaseRequisition.create({
      data: {
        requisitionNumber,
        requestedBy: dto.requestedBy,
        department: dto.department,
        requiredByDate: new Date(dto.requiredByDate),
        priority: (dto.priority as any) || 'MEDIUM',
        status: RequisitionStatus.PENDING_APPROVAL,
        totalEstimatedCost: dto.totalEstimatedCost,
        justification: dto.justification,
        items: dto.items,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.PURCHASE_REQUISITION_CREATED,
      AuditSeverity.INFO,
      `Material purchase requisition ${requisitionNumber} raised by ${dto.requestedBy} (${dto.department})`,
      dto.requestedBy,
      'PRConversionService',
      { requisitionId: created.id, totalCost: dto.totalEstimatedCost },
    );

    return created;
  }

  /**
   * Review requisition (Approve or Reject)
   */
  async reviewRequisition(id: string, dto: ReviewRequisitionDto) {
    const pr = await this.getRequisitionById(id);

    const updated = await this.prisma.purchaseRequisition.update({
      where: { id },
      data: {
        status: dto.status === 'APPROVED' ? RequisitionStatus.APPROVED : RequisitionStatus.REJECTED,
        approvedBy: dto.reviewedBy,
        approvedAt: new Date(),
        rejectionReason: dto.rejectionReason || null,
      },
    });

    await this.auditLogService.logAction(
      dto.status === 'APPROVED'
        ? AuditAction.PURCHASE_REQUISITION_APPROVED
        : AuditAction.UPDATE,
      dto.status === 'APPROVED' ? AuditSeverity.INFO : AuditSeverity.WARNING,
      `Purchase requisition ${pr.requisitionNumber} was ${dto.status} by ${dto.reviewedBy}`,
      dto.reviewedBy,
      'PRConversionService',
      { requisitionId: id, status: dto.status, reason: dto.rejectionReason },
    );

    return updated;
  }

  /**
   * Convert an approved PR directly into an official Purchase Order
   */
  async convertApprovedPRToPO(id: string, dto: ConvertPRToPODto) {
    const pr = await this.getRequisitionById(id);

    if (pr.status !== RequisitionStatus.APPROVED) {
      throw new BadRequestException(
        `Only APPROVED purchase requisitions can be converted to Purchase Orders. Current status: ${pr.status}`,
      );
    }

    const poCount = await this.prisma.purchaseOrderProcurement.count();
    const poNumber = `PO-PROC-2026-0${String(poCount + 1).padStart(3, '0')}`;

    // Extract items from PR
    const prItems = (pr.items as any[]) || [];
    let subtotal = 0;
    const poItems = prItems.map((item) => {
      const lineTotal = Number(item.quantity || 1) * Number(item.estimatedUnitPrice || 0);
      subtotal += lineTotal;
      return {
        itemSku: item.itemSku,
        itemName: item.itemName,
        orderedQty: Number(item.quantity || 1),
        receivedQty: 0,
        unitPrice: Number(item.estimatedUnitPrice || 0),
        discountPct: 0,
        lineTotal,
        targetDate: dto.promisedDeliveryDate,
      };
    });

    const taxAmount = subtotal * 0.18; // 18% standard GST / VAT
    const totalAmount = subtotal + taxAmount;

    // Create PurchaseOrderProcurement
    const po = await this.prisma.purchaseOrderProcurement.create({
      data: {
        poNumber,
        requisitionId: pr.id,
        vendorId: dto.vendorId,
        vendorName: dto.vendorName,
        vendorEmail: dto.vendorEmail,
        vendorPhone: dto.vendorPhone,
        vendorAddress: dto.vendorAddress,
        orderDate: new Date(),
        promisedDeliveryDate: new Date(dto.promisedDeliveryDate),
        status: ProcurementPOStatus.ISSUED,
        currency: 'USD',
        subtotal,
        taxAmount,
        discountAmount: 0,
        totalAmount,
        paymentTerms: dto.paymentTerms || 'NET_30',
        deliveryAddress: dto.deliveryAddress || 'Central Raw Material Stores, Plant #1, MIDC Chakan, Pune',
        items: poItems,
        issuedBy: dto.issuedBy,
      },
    });

    // Update PR status
    await this.prisma.purchaseRequisition.update({
      where: { id: pr.id },
      data: {
        status: RequisitionStatus.ORDERED,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.PR_CONVERTED_TO_PO,
      AuditSeverity.INFO,
      `Requisition ${pr.requisitionNumber} automatically converted into PO ${poNumber} for vendor ${dto.vendorName}`,
      dto.issuedBy,
      'PRConversionService',
      { requisitionId: pr.id, poId: po.id, poNumber, totalAmount },
    );

    return po;
  }
}

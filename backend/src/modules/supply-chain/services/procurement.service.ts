import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreatePurchaseRequisitionDto,
  ApproveRejectRequisitionDto,
  CreatePurchaseOrderSupplyDto,
  UpdateSupplyPOStatusDto,
  QueryProcurementDto,
} from '../dto/procurement.dto';
import {
  AuditAction,
  AuditSeverity,
  RequisitionStatus,
  SupplyPOStatus,
} from '@prisma/client';

@Injectable()
export class ProcurementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // ==================== PURCHASE REQUISITIONS ====================

  /**
   * List purchase requisitions
   */
  async getRequisitions(query: QueryProcurementDto) {
    const { status, search, limit = 50, offset = 0 } = query;
    const where: any = {};

    if (status) {
      where.status = status as RequisitionStatus;
    }

    if (search) {
      where.OR = [
        { requisitionNumber: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { requestedBy: { contains: search, mode: 'insensitive' } },
        { justification: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.purchaseRequisition.count({ where }),
      this.prisma.purchaseRequisition.findMany({
        where,
        include: {
          purchaseOrders: {
            select: { id: true, poNumber: true, status: true, totalAmount: true },
          },
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  /**
   * Get purchase requisition by ID
   */
  async getRequisitionById(id: string) {
    const pr = await this.prisma.purchaseRequisition.findUnique({
      where: { id },
      include: {
        purchaseOrders: true,
      },
    });

    if (!pr) {
      throw new NotFoundException(`Requisition with ID ${id} not found.`);
    }

    return pr;
  }

  /**
   * Create a new purchase requisition
   */
  async createRequisition(dto: CreatePurchaseRequisitionDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.purchaseRequisition.findUnique({
      where: { requisitionNumber: dto.requisitionNumber },
    });

    if (existing) {
      throw new BadRequestException(`Requisition number ${dto.requisitionNumber} already exists.`);
    }

    const items = dto.items || [];
    const totalEstimatedCost = items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.estimatedUnitPrice || 0),
      0,
    );

    const pr = await this.prisma.purchaseRequisition.create({
      data: {
        requisitionNumber: dto.requisitionNumber,
        requestedBy: userId,
        department: dto.department,
        requiredByDate: new Date(dto.requiredByDate),
        priority: dto.priority,
        status: RequisitionStatus.SUBMITTED,
        totalEstimatedCost,
        justification: dto.justification,
        items: items as any,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.PURCHASE_REQUISITION_CREATED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        requisitionId: pr.id,
        requisitionNumber: pr.requisitionNumber,
        department: pr.department,
        totalCost: Number(pr.totalEstimatedCost),
      },
    });

    return pr;
  }

  /**
   * Approve or reject a purchase requisition
   */
  async approveRejectRequisition(
    id: string,
    dto: ApproveRejectRequisitionDto,
    userId: string = 'SYSTEM',
  ) {
    const pr = await this.getRequisitionById(id);

    if (pr.status !== RequisitionStatus.SUBMITTED && pr.status !== RequisitionStatus.DRAFT) {
      throw new BadRequestException(`Cannot change status of requisition already in ${pr.status} state.`);
    }

    const updated = await this.prisma.purchaseRequisition.update({
      where: { id: pr.id },
      data: {
        status: dto.status,
        approvedBy: dto.status === RequisitionStatus.APPROVED ? userId : null,
        approvedAt: dto.status === RequisitionStatus.APPROVED ? new Date() : null,
        rejectionReason: dto.rejectionReason,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.PURCHASE_REQUISITION_APPROVED,
      severity: dto.status === RequisitionStatus.APPROVED ? AuditSeverity.INFO : AuditSeverity.WARN,
      userId,
      details: {
        requisitionId: updated.id,
        status: updated.status,
        reason: dto.rejectionReason,
      },
    });

    return updated;
  }

  // ==================== PURCHASE ORDERS ====================

  /**
   * List purchase orders
   */
  async getPurchaseOrders(query: QueryProcurementDto) {
    const { status, vendorId, search, limit = 50, offset = 0 } = query;
    const where: any = {};

    if (status) {
      where.status = status as SupplyPOStatus;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (search) {
      where.OR = [
        { poNumber: { contains: search, mode: 'insensitive' } },
        { vendor: { companyName: { contains: search, mode: 'insensitive' } } },
        { vendor: { vendorCode: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.purchaseOrderSupply.count({ where }),
      this.prisma.purchaseOrderSupply.findMany({
        where,
        include: {
          vendor: true,
          requisition: true,
          shipments: true,
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  /**
   * Get purchase order by ID
   */
  async getPurchaseOrderById(id: string) {
    const po = await this.prisma.purchaseOrderSupply.findUnique({
      where: { id },
      include: {
        vendor: true,
        requisition: true,
        shipments: true,
      },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found.`);
    }

    return po;
  }

  /**
   * Create and issue a purchase order
   */
  async createPurchaseOrder(dto: CreatePurchaseOrderSupplyDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.purchaseOrderSupply.findUnique({
      where: { poNumber: dto.poNumber },
    });

    if (existing) {
      throw new BadRequestException(`PO number ${dto.poNumber} already exists.`);
    }

    // Verify vendor
    const vendor = await this.prisma.vendorDirectory.findUnique({
      where: { id: dto.vendorId },
    });

    if (!vendor) {
      throw new BadRequestException(`Vendor with ID ${dto.vendorId} not found.`);
    }

    const items = dto.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
    const taxAmount = subtotal * 0.18; // Default 18% GST / VAT
    const totalAmount = subtotal + taxAmount;

    const po = await this.prisma.purchaseOrderSupply.create({
      data: {
        poNumber: dto.poNumber,
        vendorId: dto.vendorId,
        requisitionId: dto.requisitionId,
        expectedDeliveryDate: new Date(dto.expectedDeliveryDate),
        paymentTerms: dto.paymentTerms || 'NET_30',
        incoterms: dto.incoterms || 'FOB',
        currency: dto.currency || 'USD',
        status: SupplyPOStatus.ISSUED,
        subtotal,
        taxAmount,
        totalAmount,
        shippingAddress: dto.shippingAddress,
        items: items as any,
        issuedBy: userId,
        notes: dto.notes,
      },
      include: {
        vendor: true,
      },
    });

    // If linked to a requisition, update requisition status
    if (dto.requisitionId) {
      await this.prisma.purchaseRequisition.update({
        where: { id: dto.requisitionId },
        data: { status: RequisitionStatus.CONVERTED_TO_PO },
      });
    }

    await this.auditLogService.logAction({
      action: AuditAction.PURCHASE_ORDER_ISSUED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        poId: po.id,
        poNumber: po.poNumber,
        vendorName: vendor.companyName,
        totalAmount: Number(po.totalAmount),
      },
    });

    return po;
  }

  /**
   * Update Purchase Order status (ACKNOWLEDGED, IN_TRANSIT, PARTIALLY_DELIVERED, FULFILLED)
   */
  async updatePurchaseOrderStatus(
    id: string,
    dto: UpdateSupplyPOStatusDto,
    userId: string = 'SYSTEM',
  ) {
    const po = await this.getPurchaseOrderById(id);

    const updateData: any = {
      status: dto.status,
    };

    if (dto.acknowledgedBy) {
      updateData.acknowledgedBy = dto.acknowledgedBy;
    }

    if (dto.actualDeliveryDate) {
      updateData.actualDeliveryDate = new Date(dto.actualDeliveryDate);
    }

    if (dto.notes) {
      updateData.notes = po.notes ? `${po.notes}\n[${new Date().toISOString()}] ${dto.notes}` : dto.notes;
    }

    const updated = await this.prisma.purchaseOrderSupply.update({
      where: { id: po.id },
      data: updateData,
      include: {
        vendor: true,
        requisition: true,
      },
    });

    if (dto.status === SupplyPOStatus.FULFILLED) {
      await this.auditLogService.logAction({
        action: AuditAction.PURCHASE_ORDER_FULFILLED,
        severity: AuditSeverity.INFO,
        userId,
        details: {
          poId: updated.id,
          poNumber: updated.poNumber,
          deliveredAt: updated.actualDeliveryDate,
        },
      });
    }

    return updated;
  }
}

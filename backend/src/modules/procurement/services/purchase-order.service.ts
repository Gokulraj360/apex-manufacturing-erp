import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateProcurementPODto,
  ApprovePODto,
  IssuePODto,
} from '../dto/purchase-order.dto';
import {
  AuditAction,
  AuditSeverity,
  ProcurementPOStatus,
} from '@prisma/client';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all procurement purchase orders
   */
  async getPurchaseOrders(query?: {
    status?: ProcurementPOStatus;
    vendorName?: string;
    search?: string;
  }) {
    const where: any = {};

    if (query?.status) {
      where.status = query.status;
    }
    if (query?.vendorName) {
      where.vendorName = { contains: query.vendorName, mode: 'insensitive' };
    }
    if (query?.search) {
      where.OR = [
        { poNumber: { contains: query.search, mode: 'insensitive' } },
        { vendorName: { contains: query.search, mode: 'insensitive' } },
        { vendorEmail: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.purchaseOrderProcurement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        requisition: true,
        rfq: true,
        supplierBid: true,
      },
    });
  }

  /**
   * Get single PO by ID
   */
  async getPurchaseOrderById(id: string) {
    const po = await this.prisma.purchaseOrderProcurement.findUnique({
      where: { id },
      include: {
        requisition: true,
        rfq: true,
        supplierBid: true,
      },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    return po;
  }

  /**
   * Draft official Purchase Order
   */
  async createPurchaseOrder(dto: CreateProcurementPODto) {
    const count = await this.prisma.purchaseOrderProcurement.count();
    const poNumber = `PO-PROC-2026-0${String(count + 1).padStart(3, '0')}`;

    const po = await this.prisma.purchaseOrderProcurement.create({
      data: {
        poNumber,
        requisitionId: dto.requisitionId || null,
        rfqId: dto.rfqId || null,
        supplierBidId: dto.supplierBidId || null,
        vendorId: dto.vendorId || null,
        vendorName: dto.vendorName,
        vendorEmail: dto.vendorEmail,
        vendorPhone: dto.vendorPhone,
        vendorAddress: dto.vendorAddress,
        orderDate: new Date(),
        promisedDeliveryDate: new Date(dto.promisedDeliveryDate),
        status: ProcurementPOStatus.PENDING_APPROVAL,
        currency: dto.currency || 'USD',
        subtotal: dto.subtotal,
        taxAmount: dto.taxAmount || 0,
        discountAmount: dto.discountAmount || 0,
        totalAmount: dto.totalAmount,
        paymentTerms: dto.paymentTerms || 'NET_30',
        deliveryAddress: dto.deliveryAddress || 'Central Raw Material Stores, Plant #1, MIDC Chakan, Pune',
        items: dto.items,
        issuedBy: dto.issuedBy,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.CREATE,
      AuditSeverity.INFO,
      `Drafted Purchase Order ${poNumber} for vendor ${dto.vendorName} totaling $${dto.totalAmount}`,
      dto.issuedBy,
      'PurchaseOrderService',
      { poId: po.id, poNumber, totalAmount: dto.totalAmount },
    );

    return po;
  }

  /**
   * Executive Approval for Purchase Order
   */
  async approvePurchaseOrder(id: string, dto: ApprovePODto) {
    const po = await this.getPurchaseOrderById(id);

    const updated = await this.prisma.purchaseOrderProcurement.update({
      where: { id },
      data: {
        status: ProcurementPOStatus.ISSUED,
        approvedBy: dto.approvedBy,
        approvedAt: new Date(),
      },
    });

    await this.auditLogService.logAction(
      AuditAction.PO_APPROVAL,
      AuditSeverity.INFO,
      `Purchase Order ${po.poNumber} approved by ${dto.approvedBy}`,
      dto.approvedBy,
      'PurchaseOrderService',
      { poId: id, remarks: dto.approvalRemarks },
    );

    return updated;
  }

  /**
   * Formally issue PO to vendor
   */
  async issuePurchaseOrder(id: string, dto: IssuePODto) {
    const po = await this.getPurchaseOrderById(id);

    const updated = await this.prisma.purchaseOrderProcurement.update({
      where: { id },
      data: {
        status: ProcurementPOStatus.ISSUED,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.PROCUREMENT_PO_ISSUED,
      AuditSeverity.INFO,
      `Purchase Order ${po.poNumber} issued to vendor ${po.vendorName}`,
      dto.issuedBy,
      'PurchaseOrderService',
      { poId: id, notice: dto.dispatchNotice },
    );

    return updated;
  }
}

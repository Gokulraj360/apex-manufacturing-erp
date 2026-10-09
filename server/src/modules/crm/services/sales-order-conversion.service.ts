import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  ConvertDealToSalesOrderDto,
  UpdateSalesOrderStatusDto,
  CreateClientContractDto,
} from '../dto/sales-order.dto';
import {
  AuditAction,
  AuditSeverity,
  SalesOrderCRMStatus,
  PipelineStage,
  QuotationStatus,
  ClientContractCRMStatus,
} from '@prisma/client';

@Injectable()
export class SalesOrderConversionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all official Sales Orders
   */
  async getSalesOrders(query?: {
    status?: SalesOrderCRMStatus;
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
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { clientPoNumber: { contains: query.search, mode: 'insensitive' } },
        { productionWorkOrderRef: { contains: query.search, mode: 'insensitive' } },
        { salesRep: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.salesOrderCRM.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        quotation: true,
        lead: true,
      },
    });
  }

  /**
   * Get single Sales Order by ID
   */
  async getSalesOrderById(id: string) {
    const order = await this.prisma.salesOrderCRM.findUnique({
      where: { id },
      include: {
        client: true,
        quotation: true,
        lead: true,
        inquiries: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Sales Order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Convert Won Deal / Quotation into official Sales Order linked to production
   */
  async convertDealToSalesOrder(dto: ConvertDealToSalesOrderDto) {
    const count = await this.prisma.salesOrderCRM.count();
    const orderNumber = `SO-CRM-2026-0${String(count + 1).padStart(3, '0')}`;
    const workOrderRef = dto.productionWorkOrderRef || `WO-2026-0${String(count + 100).padStart(3, '0')}`;

    const salesOrder = await this.prisma.salesOrderCRM.create({
      data: {
        orderNumber,
        leadId: dto.leadId || null,
        quotationId: dto.quotationId || null,
        clientId: dto.clientId,
        clientPoNumber: dto.clientPoNumber,
        targetDeliveryDate: new Date(dto.targetDeliveryDate),
        status: SalesOrderCRMStatus.SCHEDULED_FOR_PRODUCTION,
        currency: dto.currency || 'USD',
        totalAmount: dto.totalAmount,
        lineItems: dto.lineItems,
        productionScheduleLinked: dto.productionScheduleLinked ?? true,
        productionWorkOrderRef: workOrderRef,
        shippingAddress: dto.shippingAddress,
        salesRep: dto.salesRep,
      },
    });

    // Update Client Lifetime Spend
    await this.prisma.clientDirectory.update({
      where: { id: dto.clientId },
      data: {
        totalLifetimeSpend: { increment: dto.totalAmount },
      },
    });

    // If linked to a Quotation, mark as ACCEPTED
    if (dto.quotationId) {
      await this.prisma.quotation.update({
        where: { id: dto.quotationId },
        data: { status: QuotationStatus.ACCEPTED },
      });
    }

    // If linked to a Lead, mark as CLOSED_WON
    if (dto.leadId) {
      await this.prisma.lead.update({
        where: { id: dto.leadId },
        data: { stage: PipelineStage.CLOSED_WON },
      });
    }

    await this.auditLogService.logAction(
      AuditAction.DEAL_WON_CONVERTED_TO_SO,
      AuditSeverity.INFO,
      `Deal won! Created Sales Order ${orderNumber} ($${dto.totalAmount}) linked to Work Order ${workOrderRef}`,
      dto.salesRep,
      'SalesOrderConversionService',
      { orderId: salesOrder.id, orderNumber, workOrderRef, totalAmount: dto.totalAmount },
    );

    return salesOrder;
  }

  /**
   * Update Sales Order status along production timeline
   */
  async updateSalesOrderStatus(id: string, dto: UpdateSalesOrderStatusDto) {
    const order = await this.getSalesOrderById(id);

    const updateData: any = {
      status: dto.status as any,
    };
    if (dto.productionWorkOrderRef) {
      updateData.productionWorkOrderRef = dto.productionWorkOrderRef;
    }

    const updated = await this.prisma.salesOrderCRM.update({
      where: { id },
      data: updateData,
    });

    await this.auditLogService.logAction(
      AuditAction.UPDATE,
      AuditSeverity.INFO,
      `Sales Order ${order.orderNumber} status progressed to ${dto.status} by ${dto.updatedBy}`,
      dto.updatedBy,
      'SalesOrderConversionService',
      { orderId: id, status: dto.status },
    );

    return updated;
  }

  /**
   * List client long-term contracts
   */
  async getClientContracts(query?: { clientId?: string; search?: string }) {
    const where: any = {};

    if (query?.clientId) {
      where.clientId = query.clientId;
    }
    if (query?.search) {
      where.OR = [
        { contractRefNumber: { contains: query.search, mode: 'insensitive' } },
        { contractTitle: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.clientContractCRM.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
      },
    });
  }

  /**
   * Register Client Master Manufacturing Supply Agreement
   */
  async createClientContract(dto: CreateClientContractDto) {
    const count = await this.prisma.clientContractCRM.count();
    const contractRefNumber = `CCON-2026-0${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.clientContractCRM.create({
      data: {
        contractRefNumber,
        clientId: dto.clientId,
        contractTitle: dto.contractTitle,
        contractType: dto.contractType || 'Master Manufacturing Supply Agreement',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        committedAnnualRevenue: dto.committedAnnualRevenue,
        rateCardJson: dto.rateCard,
        penaltyTerms: dto.penaltyTerms || null,
        status: ClientContractCRMStatus.ACTIVE,
        signedByClient: true,
        accountManager: dto.accountManager,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.CLIENT_CONTRACT_EXECUTED,
      AuditSeverity.INFO,
      `Client Contract ${contractRefNumber} ("${dto.contractTitle}") executed with committed revenue $${dto.committedAnnualRevenue}`,
      dto.accountManager,
      'SalesOrderConversionService',
      { contractId: created.id, contractRefNumber, revenue: dto.committedAnnualRevenue },
    );

    return created;
  }
}

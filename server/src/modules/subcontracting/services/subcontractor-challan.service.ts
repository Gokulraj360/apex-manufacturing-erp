import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateSubcontractorChallanDto,
  UpdateChallanStatusDto,
  QueryChallanDto,
} from '../dto/subcontractor-challan.dto';
import {
  AuditAction,
  AuditSeverity,
  SubcontractChallanStatus,
  JobWorkStatus,
} from '@prisma/client';

@Injectable()
export class SubcontractorChallanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List delivery challans with vendor and work order references
   */
  async getChallans(query: QueryChallanDto) {
    const where: any = {};
    if (query.jobWorkOrderId) where.jobWorkOrderId = query.jobWorkOrderId;
    if (query.vendorId) where.vendorId = query.vendorId;
    if (query.status) where.status = query.status;
    if (query.challanType) where.challanType = query.challanType;
    if (query.search) {
      where.OR = [
        { challanNumber: { contains: query.search, mode: 'insensitive' } },
        { vehicleNumber: { contains: query.search, mode: 'insensitive' } },
        { transporterName: { contains: query.search, mode: 'insensitive' } },
        { eWayBillNumber: { contains: query.search, mode: 'insensitive' } },
        { vendor: { companyName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.subcontractorChallan.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            vendorCode: true,
            companyName: true,
            city: true,
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
            receivedQuantity: true,
            acceptedQuantity: true,
            qualityStatus: true,
          },
        },
      },
      orderBy: { dispatchDate: 'desc' },
    });
  }

  /**
   * Generate Returnable or Non-Returnable delivery challan for materials dispatched
   */
  async createChallan(dto: CreateSubcontractorChallanDto, userId?: string) {
    const order = await this.prisma.jobWorkOrder.findUnique({
      where: { id: dto.jobWorkOrderId },
      include: { vendor: true },
    });

    if (!order) {
      throw new NotFoundException(`Job Work Order with ID ${dto.jobWorkOrderId} not found.`);
    }

    const challanNumber = dto.challanNumber || `DC-SC-${Date.now().toString().slice(-6)}`;
    const totalQty = dto.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalValuation = dto.items.reduce((sum, item) => sum + (item.totalValue || 0), 0);

    const challan = await this.prisma.subcontractorChallan.create({
      data: {
        challanNumber,
        challanType: dto.challanType,
        jobWorkOrderId: dto.jobWorkOrderId,
        vendorId: dto.vendorId || order.vendorId,
        dispatchDate: dto.dispatchDate ? new Date(dto.dispatchDate) : new Date(),
        expectedReturnDate: dto.expectedReturnDate ? new Date(dto.expectedReturnDate) : order.expectedDeliveryDate,
        vehicleNumber: dto.vehicleNumber,
        transporterName: dto.transporterName,
        driverContact: dto.driverContact,
        eWayBillNumber: dto.eWayBillNumber,
        status: SubcontractChallanStatus.DISPATCHED,
        items: dto.items as any,
        totalQuantitySent: totalQty,
        totalValuation,
        notes: dto.notes,
      },
      include: {
        vendor: true,
        jobWorkOrder: true,
      },
    });

    // Update work order status to IN_PROGRESS
    if (order.status === JobWorkStatus.ISSUED || order.status === JobWorkStatus.DRAFT) {
      await this.prisma.jobWorkOrder.update({
        where: { id: order.id },
        data: { status: JobWorkStatus.IN_PROGRESS },
      });
    }

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.SUBCONTRACT_CHALLAN_DISPATCHED,
      severity: AuditSeverity.INFO,
      resource: 'PRODUCTION',
      details: {
        challanNumber: challan.challanNumber,
        challanType: challan.challanType,
        vendor: order.vendor.companyName,
        totalQuantitySent: totalQty,
        valuation: totalValuation,
      },
    });

    return challan;
  }

  /**
   * Update challan status (e.g. IN_TRANSIT, DELIVERED_TO_VENDOR, FULLY_RETURNED)
   */
  async updateChallanStatus(id: string, dto: UpdateChallanStatusDto) {
    const existing = await this.prisma.subcontractorChallan.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Challan with ID ${id} not found.`);
    }

    return this.prisma.subcontractorChallan.update({
      where: { id },
      data: {
        status: dto.status,
        notes: dto.notes ? `${existing.notes || ''} [Status Update]: ${dto.notes}` : existing.notes,
      },
    });
  }
}

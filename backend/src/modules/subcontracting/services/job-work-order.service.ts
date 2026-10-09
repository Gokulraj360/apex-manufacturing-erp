import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateJobWorkOrderDto,
  UpdateJobWorkOrderDto,
  QueryJobWorkOrderDto,
  CreateSubcontractorVendorDto,
} from '../dto/job-work-order.dto';
import { AuditAction, AuditSeverity, JobWorkStatus } from '@prisma/client';

@Injectable()
export class JobWorkOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all subcontractor vendors
   */
  async getVendors(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { vendorCode: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.subcontractorVendor.findMany({
      where,
      include: {
        _count: {
          select: {
            jobWorkOrders: true,
            challans: true,
            receipts: true,
            bills: true,
          },
        },
      },
      orderBy: { companyName: 'asc' },
    });
  }

  /**
   * Enroll a new specialized subcontractor vendor
   */
  async createVendor(dto: CreateSubcontractorVendorDto, userId?: string) {
    const existing = await this.prisma.subcontractorVendor.findUnique({
      where: { vendorCode: dto.vendorCode },
    });

    if (existing) {
      throw new BadRequestException(`Vendor code ${dto.vendorCode} already exists.`);
    }

    const vendor = await this.prisma.subcontractorVendor.create({
      data: {
        vendorCode: dto.vendorCode,
        companyName: dto.companyName,
        contactPerson: dto.contactPerson,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        gstinTaxId: dto.gstinTaxId,
        specializedProcesses: dto.specializedProcesses,
      },
    });

    return vendor;
  }

  /**
   * List Job Work Orders with vendor details and receipt progress
   */
  async getWorkOrders(query: QueryJobWorkOrderDto) {
    const where: any = {};
    if (query.vendorId) where.vendorId = query.vendorId;
    if (query.status) where.status = query.status;
    if (query.processType) where.processType = query.processType;
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { targetProductPart: { contains: query.search, mode: 'insensitive' } },
        { processDescription: { contains: query.search, mode: 'insensitive' } },
        { vendor: { companyName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.jobWorkOrder.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            vendorCode: true,
            companyName: true,
            city: true,
            qualityRating: true,
          },
        },
        challans: {
          select: {
            id: true,
            challanNumber: true,
            totalQuantitySent: true,
            status: true,
          },
        },
        receipts: {
          select: {
            id: true,
            receiptNumber: true,
            receivedQuantity: true,
            acceptedQuantity: true,
            rejectedQuantity: true,
            qualityStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single Job Work Order with details
   */
  async getWorkOrderById(id: string) {
    const order = await this.prisma.jobWorkOrder.findUnique({
      where: { id },
      include: {
        vendor: true,
        challans: true,
        receipts: true,
        bills: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Job Work Order with ID ${id} not found.`);
    }

    return order;
  }

  /**
   * Create a Job Work Order for specialized outside processing
   */
  async createWorkOrder(dto: CreateJobWorkOrderDto, userId?: string) {
    const vendor = await this.prisma.subcontractorVendor.findUnique({
      where: { id: dto.vendorId },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${dto.vendorId} not found.`);
    }

    const orderNumber = dto.orderNumber || `JWO-${Date.now().toString().slice(-6)}`;
    const totalOrderValue = Number(dto.unitProcessingRate) * Number(dto.targetQuantity);

    const order = await this.prisma.jobWorkOrder.create({
      data: {
        orderNumber,
        vendorId: dto.vendorId,
        processType: dto.processType,
        processDescription: dto.processDescription,
        targetProductPart: dto.targetProductPart,
        inputItemSku: dto.inputItemSku,
        outputItemSku: dto.outputItemSku,
        targetQuantity: dto.targetQuantity,
        scrapAllowancePercent: dto.scrapAllowancePercent || 2.0,
        unitProcessingRate: dto.unitProcessingRate,
        totalOrderValue,
        status: JobWorkStatus.ISSUED,
        expectedDeliveryDate: new Date(dto.expectedDeliveryDate),
        notes: dto.notes,
      },
      include: {
        vendor: true,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.JOB_WORK_ORDER_CREATED,
      severity: AuditSeverity.INFO,
      resource: 'PRODUCTION',
      details: {
        orderNumber: order.orderNumber,
        vendor: vendor.companyName,
        targetQuantity: order.targetQuantity,
        value: totalOrderValue,
      },
    });

    return order;
  }

  /**
   * Update Job Work Order details or status
   */
  async updateWorkOrder(id: string, dto: UpdateJobWorkOrderDto, userId?: string) {
    const current = await this.prisma.jobWorkOrder.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException(`Job Work Order with ID ${id} not found.`);
    }

    const targetQty = dto.targetQuantity || current.targetQuantity;
    const rate = dto.unitProcessingRate || Number(current.unitProcessingRate);
    const totalOrderValue = targetQty * rate;

    return this.prisma.jobWorkOrder.update({
      where: { id },
      data: {
        processDescription: dto.processDescription,
        targetQuantity: dto.targetQuantity,
        unitProcessingRate: dto.unitProcessingRate,
        totalOrderValue,
        status: dto.status,
        expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : undefined,
        notes: dto.notes,
      },
      include: { vendor: true },
    });
  }
}

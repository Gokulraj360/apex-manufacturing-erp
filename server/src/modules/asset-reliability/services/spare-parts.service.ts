import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateSparePartDto,
  UpdateSparePartDto,
  AdjustStockDto,
  CreateToolCribRequisitionDto,
  ApproveRequisitionDto,
  IssueRequisitionDto,
} from '../dto/spare-parts.dto';
import {
  AuditAction,
  AuditSeverity,
  ToolCribRequisitionStatus,
} from '@prisma/client';

@Injectable()
export class SparePartsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List spare parts with inventory levels and threshold alerts
   */
  async getSpareParts(query: {
    category?: string;
    search?: string;
    isLowStock?: boolean;
  }) {
    const where: any = {};
    if (query.category) where.category = query.category;
    if (query.search) {
      where.OR = [
        { partCode: { contains: query.search, mode: 'insensitive' } },
        { partName: { contains: query.search, mode: 'insensitive' } },
        { compatibleMachineModels: { contains: query.search, mode: 'insensitive' } },
        { cribBinLocation: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const parts = await this.prisma.sparePart.findMany({
      where,
      orderBy: { partCode: 'asc' },
    });

    if (query.isLowStock) {
      return parts.filter((p) => p.currentStock <= p.minimumThreshold);
    }

    return parts;
  }

  /**
   * Register a new spare part in the tool crib catalog
   */
  async createSparePart(dto: CreateSparePartDto, userId?: string) {
    const existing = await this.prisma.sparePart.findUnique({
      where: { partCode: dto.partCode },
    });

    if (existing) {
      throw new BadRequestException(`Spare Part with code ${dto.partCode} already exists.`);
    }

    const part = await this.prisma.sparePart.create({
      data: {
        partCode: dto.partCode,
        partName: dto.partName,
        category: dto.category,
        compatibleMachineModels: dto.compatibleMachineModels,
        currentStock: dto.currentStock,
        minimumThreshold: dto.minimumThreshold || 5,
        unitOfMeasure: dto.unitOfMeasure || 'PCS',
        unitCost: dto.unitCost,
        cribBinLocation: dto.cribBinLocation,
        supplierName: dto.supplierName,
        leadTimeDays: dto.leadTimeDays || 7,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.SPARE_PART_STOCK_ADJUSTED,
      severity: AuditSeverity.INFO,
      resource: 'ASSET_RELIABILITY',
      details: {
        partCode: part.partCode,
        initialStock: part.currentStock,
        bin: part.cribBinLocation,
      },
    });

    return part;
  }

  /**
   * Update spare part master data
   */
  async updateSparePart(id: string, dto: UpdateSparePartDto) {
    const existing = await this.prisma.sparePart.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Spare Part with ID ${id} not found.`);
    }

    return this.prisma.sparePart.update({
      where: { id },
      data: {
        partName: dto.partName,
        category: dto.category,
        compatibleMachineModels: dto.compatibleMachineModels,
        minimumThreshold: dto.minimumThreshold,
        unitCost: dto.unitCost,
        cribBinLocation: dto.cribBinLocation,
        supplierName: dto.supplierName,
        leadTimeDays: dto.leadTimeDays,
      },
    });
  }

  /**
   * Adjust spare part stock level (replenishment or cycle count adjustment)
   */
  async adjustStock(id: string, dto: AdjustStockDto) {
    const part = await this.prisma.sparePart.findUnique({ where: { id } });
    if (!part) {
      throw new NotFoundException(`Spare Part with ID ${id} not found.`);
    }

    const newStock = Math.max(0, part.currentStock + dto.adjustmentQuantity);

    const updated = await this.prisma.sparePart.update({
      where: { id },
      data: { currentStock: newStock },
    });

    await this.auditLogService.logAction({
      userId: dto.adjustedBy,
      action: AuditAction.SPARE_PART_STOCK_ADJUSTED,
      severity: AuditSeverity.INFO,
      resource: 'ASSET_RELIABILITY',
      details: {
        partCode: part.partCode,
        previousStock: part.currentStock,
        newStock,
        adjustmentQuantity: dto.adjustmentQuantity,
        reason: dto.reason,
      },
    });

    return updated;
  }

  /**
   * List tool crib requisitions
   */
  async getRequisitions(query: { status?: ToolCribRequisitionStatus }) {
    const where: any = {};
    if (query.status) where.status = query.status;

    return this.prisma.toolCribRequisition.findMany({
      where,
      include: {
        sparePart: true,
        breakdownTicket: {
          select: {
            ticketNumber: true,
            asset: { select: { assetTag: true, assetName: true } },
          },
        },
        maintenanceSchedule: {
          select: {
            scheduleCode: true,
            title: true,
            asset: { select: { assetTag: true, assetName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a tool crib component requisition
   */
  async createRequisition(dto: CreateToolCribRequisitionDto) {
    const part = await this.prisma.sparePart.findUnique({
      where: { id: dto.sparePartId },
    });

    if (!part) {
      throw new NotFoundException(`Spare Part with ID ${dto.sparePartId} not found.`);
    }

    const requisitionNumber = `REQ-SP-${Date.now().toString().slice(-6)}`;

    const requisition = await this.prisma.toolCribRequisition.create({
      data: {
        requisitionNumber,
        sparePartId: dto.sparePartId,
        breakdownTicketId: dto.breakdownTicketId,
        maintenanceScheduleId: dto.maintenanceScheduleId,
        quantity: dto.quantity,
        status: ToolCribRequisitionStatus.REQUESTED,
        requestedBy: dto.requestedBy,
        purposeNotes: dto.purposeNotes,
      },
      include: {
        sparePart: true,
      },
    });

    await this.auditLogService.logAction({
      userId: dto.requestedBy,
      action: AuditAction.SPARE_PART_REQUISITIONED,
      severity: AuditSeverity.INFO,
      resource: 'ASSET_RELIABILITY',
      details: {
        requisitionNumber: requisition.requisitionNumber,
        partCode: part.partCode,
        quantity: dto.quantity,
      },
    });

    return requisition;
  }

  /**
   * Approve or reject tool crib requisition
   */
  async approveRequisition(id: string, dto: ApproveRequisitionDto) {
    const req = await this.prisma.toolCribRequisition.findUnique({ where: { id } });
    if (!req) {
      throw new NotFoundException(`Requisition with ID ${id} not found.`);
    }

    return this.prisma.toolCribRequisition.update({
      where: { id },
      data: {
        status: dto.decision === 'APPROVE' ? ToolCribRequisitionStatus.APPROVED : ToolCribRequisitionStatus.REJECTED,
        approvedBy: dto.approvedBy,
        purposeNotes: dto.notes ? `${req.purposeNotes || ''} [Decision Note: ${dto.notes}]` : req.purposeNotes,
      },
    });
  }

  /**
   * Issue spare part from tool crib, reducing physical stock
   */
  async issueRequisition(id: string, dto: IssueRequisitionDto) {
    const req = await this.prisma.toolCribRequisition.findUnique({
      where: { id },
      include: { sparePart: true },
    });

    if (!req) {
      throw new NotFoundException(`Requisition with ID ${id} not found.`);
    }

    if (req.sparePart.currentStock < req.quantity) {
      throw new BadRequestException(
        `Insufficient stock for ${req.sparePart.partName}. Available: ${req.sparePart.currentStock}, Requested: ${req.quantity}`
      );
    }

    // Decrement stock
    await this.prisma.sparePart.update({
      where: { id: req.sparePartId },
      data: { currentStock: req.sparePart.currentStock - req.quantity },
    });

    return this.prisma.toolCribRequisition.update({
      where: { id },
      data: {
        status: ToolCribRequisitionStatus.ISSUED,
        issuedAt: new Date(),
        purposeNotes: dto.notes ? `${req.purposeNotes || ''} [Issued by ${dto.issuedBy}]` : req.purposeNotes,
      },
      include: { sparePart: true },
    });
  }
}

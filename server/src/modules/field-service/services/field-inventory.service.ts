import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateVanStockDto,
  UpdateVanStockQuantityDto,
  CreateFieldPartRequisitionDto,
  UpdatePartRequisitionStatusDto,
  QueryVanStockDto,
} from '../dto/field-inventory.dto';
import {
  AuditAction,
  AuditSeverity,
  FieldPartRequisitionStatus,
} from '@prisma/client';

@Injectable()
export class FieldInventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // ==================== VAN STOCK ====================

  /**
   * List van stocks by engineer or search
   */
  async getVanStocks(query: QueryVanStockDto) {
    const { engineerId, search, limit = 50, offset = 0 } = query;
    const where: any = {};

    if (engineerId) {
      where.engineerId = engineerId;
    }

    if (search) {
      where.OR = [
        { itemSku: { contains: search, mode: 'insensitive' } },
        { itemName: { contains: search, mode: 'insensitive' } },
        { engineer: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.vanStock.count({ where }),
      this.prisma.vanStock.findMany({
        where,
        include: {
          engineer: {
            select: { id: true, employeeCode: true, fullName: true, operatingTerritoryCity: true },
          },
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { itemSku: 'asc' },
      }),
    ]);

    return { total, items };
  }

  /**
   * Add a new stock SKU to an engineer's service van
   */
  async createVanStock(dto: CreateVanStockDto) {
    const existing = await this.prisma.vanStock.findUnique({
      where: {
        engineerId_itemSku: {
          engineerId: dto.engineerId,
          itemSku: dto.itemSku,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Item SKU ${dto.itemSku} already exists in technician's van stock.`,
      );
    }

    const stock = await this.prisma.vanStock.create({
      data: {
        engineerId: dto.engineerId,
        itemSku: dto.itemSku,
        itemName: dto.itemName,
        quantityOnHand: dto.quantityOnHand,
        minimumThreshold: dto.minimumThreshold || 2,
        unitValue: dto.unitValue,
        binOrCrateLocation: dto.binOrCrateLocation,
        lastReplenishedAt: new Date(),
      },
      include: {
        engineer: true,
      },
    });

    return stock;
  }

  /**
   * Update van stock quantity (consumption or replenishment)
   */
  async updateStockQuantity(dto: UpdateVanStockQuantityDto, userId: string = 'SYSTEM') {
    const stock = await this.prisma.vanStock.findUnique({
      where: {
        engineerId_itemSku: {
          engineerId: dto.engineerId,
          itemSku: dto.itemSku,
        },
      },
    });

    if (!stock) {
      throw new NotFoundException(`Van stock record for SKU ${dto.itemSku} not found.`);
    }

    const newQty = stock.quantityOnHand + dto.quantityDelta;
    if (newQty < 0) {
      throw new BadRequestException(
        `Insufficient van stock. Current on-hand is ${stock.quantityOnHand}.`,
      );
    }

    const updated = await this.prisma.vanStock.update({
      where: { id: stock.id },
      data: {
        quantityOnHand: newQty,
        lastReplenishedAt: dto.quantityDelta > 0 ? new Date() : stock.lastReplenishedAt,
      },
      include: {
        engineer: true,
      },
    });

    if (dto.quantityDelta > 0) {
      await this.auditLogService.logAction({
        action: AuditAction.VAN_STOCK_REPLENISHED,
        severity: AuditSeverity.INFO,
        userId,
        details: {
          itemSku: updated.itemSku,
          engineer: updated.engineer.fullName,
          added: dto.quantityDelta,
          newBalance: newQty,
        },
      });
    }

    return updated;
  }

  // ==================== PART REQUISITIONS ====================

  /**
   * List field part requisitions
   */
  async getPartRequisitions(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { requisitionNumber: { contains: search, mode: 'insensitive' } },
        { itemSku: { contains: search, mode: 'insensitive' } },
        { itemName: { contains: search, mode: 'insensitive' } },
        { engineer: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.fieldPartRequisition.findMany({
      where,
      include: {
        engineer: {
          select: { id: true, employeeCode: true, fullName: true },
        },
        request: {
          select: { id: true, ticketNumber: true, customerName: true, machineModel: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Request a replacement part for on-site repair
   */
  async createPartRequisition(dto: CreateFieldPartRequisitionDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.fieldPartRequisition.findUnique({
      where: { requisitionNumber: dto.requisitionNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Requisition number ${dto.requisitionNumber} already exists.`,
      );
    }

    const req = await this.prisma.fieldPartRequisition.create({
      data: {
        requisitionNumber: dto.requisitionNumber,
        requestId: dto.requestId,
        engineerId: dto.engineerId,
        itemSku: dto.itemSku,
        itemName: dto.itemName,
        quantityRequested: dto.quantityRequested,
        defectivePartSerialNumber: dto.defectivePartSerialNumber,
        status: FieldPartRequisitionStatus.PENDING_APPROVAL,
      },
      include: {
        engineer: true,
        request: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.FIELD_PART_REQUISITIONED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        reqNumber: req.requisitionNumber,
        itemSku: req.itemSku,
        ticket: req.request.ticketNumber,
      },
    });

    return req;
  }

  /**
   * Update status of part requisition (approve, dispatch, install, return defective)
   */
  async updateRequisitionStatus(id: string, dto: UpdatePartRequisitionStatusDto) {
    const req = await this.prisma.fieldPartRequisition.findUnique({
      where: { id },
    });

    if (!req) {
      throw new NotFoundException(`Part requisition with ID ${id} not found.`);
    }

    const updateData: any = {
      status: dto.status,
    };

    if (dto.isDefectiveReturned !== undefined) {
      updateData.isDefectiveReturned = dto.isDefectiveReturned;
    }

    if (dto.defectivePartSerialNumber) {
      updateData.defectivePartSerialNumber = dto.defectivePartSerialNumber;
    }

    return this.prisma.fieldPartRequisition.update({
      where: { id },
      data: updateData,
      include: {
        engineer: true,
        request: true,
      },
    });
  }
}

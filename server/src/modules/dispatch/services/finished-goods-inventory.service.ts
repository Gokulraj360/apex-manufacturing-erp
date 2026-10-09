import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateFinishedGoodsBayDto,
  PutawayFinishedGoodsDto,
  AdjustFinishedGoodsStockDto,
} from '../dto/finished-goods-inventory.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class FinishedGoodsInventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all finished goods racks, shelves, and storage bays
   */
  async getBays(zone?: string) {
    const where = zone ? { zone } : {};
    return this.prisma.finishedGoodsLocation.findMany({
      where,
      orderBy: { bayCode: 'asc' },
    });
  }

  /**
   * Register a new storage bay in the finished goods staging warehouse
   */
  async createBay(dto: CreateFinishedGoodsBayDto, userId?: string) {
    const existing = await this.prisma.finishedGoodsLocation.findUnique({
      where: { bayCode: dto.bayCode },
    });
    if (existing) {
      throw new BadRequestException(`Bay code ${dto.bayCode} already exists`);
    }

    const bay = await this.prisma.finishedGoodsLocation.create({
      data: {
        bayCode: dto.bayCode,
        zone: dto.zone,
        aisle: dto.aisle,
        rack: dto.rack,
        shelf: dto.shelf,
        capacityUnits: dto.capacityUnits,
        occupiedUnits: 0,
      },
    });

    return bay;
  }

  /**
   * Put away verified finished goods batch into a designated storage bay
   */
  async putawayStock(dto: PutawayFinishedGoodsDto, userId?: string) {
    const bay = await this.prisma.finishedGoodsLocation.findUnique({
      where: { bayCode: dto.bayCode },
    });
    if (!bay) {
      throw new NotFoundException(`Storage bay ${dto.bayCode} not found`);
    }

    if (bay.occupiedUnits + dto.quantityUnits > bay.capacityUnits) {
      throw new BadRequestException(
        `Insufficient capacity in bay ${dto.bayCode}. Max: ${bay.capacityUnits}, Current: ${bay.occupiedUnits}, Attempted: ${dto.quantityUnits}`,
      );
    }

    const updated = await this.prisma.finishedGoodsLocation.update({
      where: { bayCode: dto.bayCode },
      data: {
        itemCode: dto.itemCode,
        itemName: dto.itemName,
        lotBatchNumber: dto.lotBatchNumber,
        occupiedUnits: bay.occupiedUnits + dto.quantityUnits,
        unitValuation: dto.unitValuation,
        isReserved: dto.isReserved ?? false,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.FINISHED_GOODS_PUTAWAY,
      entityName: 'FinishedGoodsLocation',
      entityId: updated.id,
      details: {
        bayCode: dto.bayCode,
        itemCode: dto.itemCode,
        lotBatchNumber: dto.lotBatchNumber,
        quantityPutaway: dto.quantityUnits,
        newOccupancy: updated.occupiedUnits,
      },
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Adjust storage bay inventory count
   */
  async adjustBayStock(dto: AdjustFinishedGoodsStockDto, userId?: string) {
    const bay = await this.prisma.finishedGoodsLocation.findUnique({
      where: { bayCode: dto.bayCode },
    });
    if (!bay) {
      throw new NotFoundException(`Storage bay ${dto.bayCode} not found`);
    }

    const updated = await this.prisma.finishedGoodsLocation.update({
      where: { bayCode: dto.bayCode },
      data: {
        occupiedUnits: dto.newOccupiedUnits,
      },
    });

    return updated;
  }

  /**
   * High-level storage optimization & valuation telemetry
   */
  async getStorageOptimizationMetrics() {
    const bays = await this.prisma.finishedGoodsLocation.findMany();

    const totalCapacity = bays.reduce((acc, b) => acc + b.capacityUnits, 0);
    const totalOccupied = bays.reduce((acc, b) => acc + b.occupiedUnits, 0);
    const occupancyRate = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;

    const totalValuation = bays.reduce(
      (acc, b) => acc + b.occupiedUnits * Number(b.unitValuation),
      0,
    );

    return {
      totalBays: bays.length,
      totalCapacity,
      totalOccupied,
      occupancyRate: parseFloat(occupancyRate.toFixed(1)),
      totalValuation: parseFloat(totalValuation.toFixed(2)),
    };
  }
}

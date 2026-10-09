import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateInventoryItemDto,
  CreateStockMovementDto,
  AllocatePutawayDto,
  WarehouseZone,
} from './dto/inventory.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  ResourceNotFoundException,
  InsufficientInventoryException,
} from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto, category?: string) {
    const { skip, limit } = pagination;
    const where = category ? { category: category as any } : {};

    const [items, total] = await Promise.all([
      this.prisma.itemMaster.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.itemMaster.count({ where }),
    ]);

    const page = pagination.page ?? 1;
    const takeLimit = limit ?? 20;

    return {
      items,
      pagination: {
        page,
        limit: takeLimit,
        totalItems: total,
        totalPages: Math.ceil(total / takeLimit),
        hasNextPage: page * takeLimit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.itemMaster.findUnique({
      where: { id },
      include: {
        warehouseBins: true,
        inspectionReports: {
          take: 5,
          orderBy: { inspectedAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new ResourceNotFoundException('ItemMaster', id);
    }

    return item;
  }

  async getWarehouseMatrix(zone?: WarehouseZone) {
    const where: any = {};
    if (zone) where.zone = zone;

    const [bins, lowStockItems] = await Promise.all([
      this.prisma.warehouseBin.findMany({
        where,
        orderBy: [{ zone: 'asc' }, { binCode: 'asc' }],
        include: {
          item: {
            select: {
              id: true,
              code: true,
              name: true,
              category: true,
              uom: true,
              currentStock: true,
              minStockQty: true,
            },
          },
        },
      }),
      this.prisma.itemMaster.findMany({
        where: {
          currentStock: { lte: this.prisma.itemMaster.fields.minStockQty },
          isActive: true,
        },
        select: {
          id: true,
          code: true,
          name: true,
          currentStock: true,
          minStockQty: true,
          uom: true,
        },
      }),
    ]);

    const totalBins = bins.length;
    const occupiedBins = bins.filter((b) => b.isOccupied).length;
    const quarantineBins = bins.filter((b) => b.isQuarantine).length;
    const occupancyRate =
      totalBins > 0 ? Number(((occupiedBins / totalBins) * 100).toFixed(1)) : 0;

    return {
      metrics: {
        totalBins,
        occupiedBins,
        emptyBins: totalBins - occupiedBins,
        quarantineBins,
        occupancyRate,
        lowStockAlertCount: lowStockItems.length,
      },
      bins: bins.map((bin) => {
        const current = Number(bin.currentQty);
        const max = Number(bin.maxCapacity) || 1000;
        const fillPercent = Math.min(100, Math.round((current / max) * 100));
        const isReorderAlert =
          bin.item && Number(bin.item.currentStock) <= Number(bin.item.minStockQty);

        return {
          ...bin,
          fillPercent,
          isReorderAlert,
        };
      }),
      reorderAlerts: lowStockItems,
    };
  }

  async allocatePutaway(dto: AllocatePutawayDto) {
    const item = await this.prisma.itemMaster.findUnique({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new NotFoundException({
        message: `Item with ID '${dto.itemId}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Find or create target bin
      let bin = await tx.warehouseBin.findUnique({
        where: { binCode: dto.binCode },
      });

      if (!bin) {
        // Auto parse zone, aisle, rack from code (e.g. A-01-B1)
        const parts = dto.binCode.split('-');
        const zoneChar = parts[0]?.toUpperCase() || 'A';
        const aisle = parts[1] || '01';
        const rack = parts[2] || 'R1';
        let zoneEnum = WarehouseZone.ZONE_A_RAW_METALS;
        if (zoneChar === 'B') zoneEnum = WarehouseZone.ZONE_B_TOOLING;
        if (zoneChar === 'C') zoneEnum = WarehouseZone.ZONE_C_CLEANROOM;
        if (zoneChar === 'D') zoneEnum = WarehouseZone.ZONE_D_FASTENERS;
        if (zoneChar === 'Q') zoneEnum = WarehouseZone.ZONE_Q_QUARANTINE;

        bin = await tx.warehouseBin.create({
          data: {
            binCode: dto.binCode,
            zone: zoneEnum,
            aisle,
            rack,
            shelf: 'S1',
            binNumber: 'B1',
            itemId: dto.itemId,
            batchNumber: dto.batchNumber,
            currentQty: dto.quantity,
            maxCapacity: 5000,
            uom: dto.uom || item.uom,
            isOccupied: true,
            isQuarantine: zoneChar === 'Q',
            lastPutawayAt: new Date(),
          },
        });
      } else {
        bin = await tx.warehouseBin.update({
          where: { id: bin.id },
          data: {
            itemId: dto.itemId,
            batchNumber: dto.batchNumber,
            currentQty: {
              increment: dto.quantity,
            },
            isOccupied: true,
            lastPutawayAt: new Date(),
          },
        });
      }

      // 2. Increment item inventory
      await tx.itemMaster.update({
        where: { id: dto.itemId },
        data: {
          currentStock: {
            increment: dto.quantity,
          },
        },
      });

      return bin;
    });
  }

  async getReorderAlerts() {
    return this.prisma.itemMaster.findMany({
      where: {
        isActive: true,
      },
      orderBy: { currentStock: 'asc' },
    });
  }

  async create(dto: CreateInventoryItemDto) {
    const existing = await this.prisma.itemMaster.findUnique({
      where: { code: dto.itemCode.toUpperCase() },
    });

    if (existing) {
      throw new ConflictException({
        message: `Item with code '${dto.itemCode}' already exists.`,
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    return this.prisma.itemMaster.create({
      data: {
        code: dto.itemCode.toUpperCase(),
        name: dto.name,
        category: (dto.category as any) || 'RAW_MATERIAL',
        uom: dto.uom || 'PCS',
        standardCost: dto.standardCost,
        sellingPrice: dto.sellingPrice || 0,
        currentStock: dto.initialStock || 0,
        minStockQty: dto.reorderPoint || 10,
        customAttrs: dto.customAttrs || {},
      },
    });
  }

  async recordStockMovement(dto: CreateStockMovementDto, userId?: string) {
    const item = await this.prisma.itemMaster.findUnique({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new ResourceNotFoundException('ItemMaster', dto.itemId);
    }

    const currentStock = Number(item.currentStock);
    let newStock = currentStock + dto.quantity;

    await this.prisma.itemMaster.update({
      where: { id: dto.itemId },
      data: { currentStock: newStock },
    });

    return {
      itemId: item.id,
      code: item.code,
      newStock,
      movementType: dto.movementType,
    };
  }
}

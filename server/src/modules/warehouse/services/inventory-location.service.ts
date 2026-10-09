import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateBinLocationDto,
  CreateWarehouseStockDto,
  AdjustStockLevelDto,
} from '../dto/inventory-location.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class InventoryLocationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Get all storage bin locations with occupancy rates
   */
  async getBinLocations() {
    return this.prisma.binLocation.findMany({
      orderBy: [{ zone: 'asc' }, { binCode: 'asc' }],
      include: {
        stocks: true,
      },
    });
  }

  /**
   * Register a new Bin / Rack Location
   */
  async createBinLocation(dto: CreateBinLocationDto, adminUserId?: string) {
    const existing = await this.prisma.binLocation.findUnique({
      where: { binCode: dto.binCode },
    });
    if (existing) {
      throw new BadRequestException(`Bin location ${dto.binCode} already exists.`);
    }

    return this.prisma.binLocation.create({
      data: {
        binCode: dto.binCode,
        zone: dto.zone,
        aisle: dto.aisle,
        rack: dto.rack,
        shelf: dto.shelf,
        capacityMaxUnits: dto.capacityMaxUnits || 1000,
        isQuarantine: dto.isQuarantine || false,
      },
    });
  }

  /**
   * Get current stock inventory with low-stock alerts
   */
  async getInventory(category?: string) {
    const where: any = {};
    if (category) where.category = category;

    const stocks = await this.prisma.warehouseStock.findMany({
      where,
      orderBy: { itemCode: 'asc' },
      include: { binLocation: true },
    });

    const lowStockAlerts = stocks.filter(
      (s) => s.currentQuantity <= s.reorderThreshold,
    );

    const totalValuation = stocks.reduce(
      (acc, s) => acc + s.currentQuantity * Number(s.unitValuation),
      0,
    );

    return {
      stocks: stocks.map((s) => ({
        ...s,
        isBelowReorderThreshold: s.currentQuantity <= s.reorderThreshold,
      })),
      lowStockAlerts,
      totalValuation,
    };
  }

  /**
   * Create or catalog a new Stock Item
   */
  async createStockItem(dto: CreateWarehouseStockDto, adminUserId?: string) {
    const existing = await this.prisma.warehouseStock.findUnique({
      where: { itemCode: dto.itemCode },
    });
    if (existing) {
      throw new BadRequestException(`Item code ${dto.itemCode} already exists.`);
    }

    const stock = await this.prisma.warehouseStock.create({
      data: {
        itemCode: dto.itemCode,
        itemName: dto.itemName,
        category: dto.category,
        currentQuantity: dto.currentQuantity,
        reorderThreshold: dto.reorderThreshold,
        reorderQuantity: dto.reorderQuantity || 500,
        unitOfMeasure: dto.unitOfMeasure,
        unitValuation: dto.unitValuation,
        binLocationId: dto.binLocationId,
        lotBatchNumber: dto.lotBatchNumber,
      },
      include: { binLocation: true },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.CREATE,
      entity: 'WAREHOUSE_STOCK',
      entityId: stock.id,
      details: `Cataloged new inventory item ${stock.itemCode} (${stock.itemName}) in Bin ${stock.binLocation?.binCode || 'Unassigned'}`,
      severity: AuditSeverity.INFO,
    });

    return stock;
  }

  /**
   * Adjust stock level with audit trail
   */
  async adjustStock(dto: AdjustStockLevelDto, adminUserId?: string) {
    const stock = await this.prisma.warehouseStock.findUnique({
      where: { itemCode: dto.itemCode },
    });
    if (!stock) throw new NotFoundException('Inventory stock item not found.');

    const previousQuantity = stock.currentQuantity;
    const adjustedQuantity = Math.max(0, previousQuantity + dto.quantityDelta);
    const variance = adjustedQuantity - previousQuantity;
    const financialImpact = Number((variance * Number(stock.unitValuation)).toFixed(2));

    const count = await this.prisma.stockAdjustment.count();
    const adjustmentNumber = `ADJ-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const [updatedStock, adjustment] = await this.prisma.$transaction([
      this.prisma.warehouseStock.update({
        where: { itemCode: dto.itemCode },
        data: { currentQuantity: adjustedQuantity },
      }),
      this.prisma.stockAdjustment.create({
        data: {
          adjustmentNumber,
          stockId: stock.id,
          reason: dto.reason as any,
          previousQuantity,
          adjustedQuantity,
          variance,
          financialImpact,
          approvedBy: adminUserId || 'Warehouse Manager Rodriguez',
          notes: dto.notes,
        },
      }),
    ]);

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.STOCK_ADJUSTMENT,
      entity: 'WAREHOUSE_STOCK',
      entityId: stock.id,
      details: `Adjusted stock for ${stock.itemCode}: ${previousQuantity} -> ${adjustedQuantity} (Variance: ${variance}, Impact: $${financialImpact})`,
      severity: Math.abs(financialImpact) > 5000 ? AuditSeverity.WARNING : AuditSeverity.INFO,
    });

    return { updatedStock, adjustment };
  }
}

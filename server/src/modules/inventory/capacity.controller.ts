import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FeedPriceStockDto, ReleaseBatchDto } from './dto/capacity.dto';
import { ItemType } from '@prisma/client';

export interface CapacityComponent {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPerPiece: number;
  requiredPerUnit: number;
  costContribution: number;
  stockQty: number;
  phoneCapacity: number;
  isBottleneck: boolean;
}

@Controller(['inventory', 'api/inventory'])
export class CapacityController {
  constructor(private readonly prisma: PrismaService) {}

  // Active in-memory component buffer with baseline defaults for rapid live adjustments
  private activeComponents: CapacityComponent[] = [
    {
      id: 'comp-01',
      sku: 'IC-SNAP-8G3-01',
      name: 'Apex Core Embedded Microprocessor SoC (4nm FinFET)',
      category: 'IC',
      unit: 'PCS',
      costPerPiece: 5850.0,
      requiredPerUnit: 1,
      costContribution: 5850.0,
      stockQty: 42000,
      phoneCapacity: 42000,
      isBottleneck: false,
    },
    {
      id: 'comp-02',
      sku: 'DISP-Precision Optics-67-120',
      name: 'Industrial Optical Display & Sensor Panel 120Hz',
      category: 'DISPLAY',
      unit: 'PCS',
      costPerPiece: 3400.0,
      requiredPerUnit: 1,
      costContribution: 3400.0,
      stockQty: 31500,
      phoneCapacity: 31500,
      isBottleneck: false,
    },
    {
      id: 'comp-03',
      sku: 'OPT-SONY-50M-OIS',
      name: '50MP Sony IMX989 1-Inch Sensor Optics',
      category: 'OPTICS',
      unit: 'PCS',
      costPerPiece: 2650.0,
      requiredPerUnit: 1,
      costContribution: 2650.0,
      stockQty: 18200,
      phoneCapacity: 18200,
      isBottleneck: true,
    },
    {
      id: 'comp-04',
      sku: 'BAT-LIPO-5000-65W',
      name: '5000mAh High-Density Dual-Cell Li-Po Pack',
      category: 'BATTERY',
      unit: 'PCS',
      costPerPiece: 980.0,
      requiredPerUnit: 1,
      costContribution: 980.0,
      stockQty: 65000,
      phoneCapacity: 65000,
      isBottleneck: false,
    },
    {
      id: 'comp-05',
      sku: 'SHL-ALUM-UNI-BLK',
      name: 'CNC Aviation Aluminum Uni-Body Shell',
      category: 'SHELL',
      unit: 'PCS',
      costPerPiece: 1450.0,
      requiredPerUnit: 1,
      costContribution: 1450.0,
      stockQty: 24000,
      phoneCapacity: 24000,
      isBottleneck: false,
    },
    {
      id: 'comp-06',
      sku: 'CON-RFCAB-USBC-FLX',
      name: 'Gold-Plated RF Antenna & USB-C Flex Harness',
      category: 'CONNECTORS',
      unit: 'PCS',
      costPerPiece: 420.0,
      requiredPerUnit: 2,
      costContribution: 840.0,
      stockQty: 88000,
      phoneCapacity: 44000,
      isBottleneck: false,
    },
    {
      id: 'comp-07',
      sku: 'CSM-GRAPH-PASTE-01',
      name: 'Phase-Change Graphite Sheet & ESD Fasteners',
      category: 'CONSUMABLE',
      unit: 'SET',
      costPerPiece: 150.0,
      requiredPerUnit: 1,
      costContribution: 150.0,
      stockQty: 150000,
      phoneCapacity: 150000,
      isBottleneck: false,
    },
  ];

  /**
   * GET /api/inventory/capacity-summary
   * Returns bottleneck details, max assembleable finished units, and aggregated BOM component metrics.
   */
  @Get('capacity-summary')
  async getCapacitySummary() {
    return this.recalculateMetrics();
  }

  /**
   * PATCH /api/inventory/items/:id/feed-price-stock
   * Simultaneously updates costPerPiece and stockQty, automatically re-triggering cost and bottleneck recalibration.
   */
  @Patch('items/:id/feed-price-stock')
  async feedPriceStock(
    @Param('id') id: string,
    @Body() dto: FeedPriceStockDto,
  ) {
    // 1. Locate item in buffer
    let target = this.activeComponents.find((c) => c.id === id || c.sku === id);

    // If not found in buffer, check database
    if (!target) {
      try {
        const dbItem = await this.prisma.itemMaster.findFirst({
          where: { OR: [{ id }, { code: id }, { sku: id }] },
        });
        if (dbItem) {
          target = {
            id: dbItem.id,
            sku: dbItem.sku || dbItem.code,
            name: dbItem.name,
            category: dbItem.category,
            unit: dbItem.unit || dbItem.uom || 'PCS',
            costPerPiece: Number(dbItem.costPerPiece || dbItem.unitCost || 100),
            requiredPerUnit: 1,
            costContribution: Number(dbItem.costPerPiece || dbItem.unitCost || 100),
            stockQty: Number(dbItem.stockQty || dbItem.currentStock || 0),
            phoneCapacity: Number(dbItem.stockQty || dbItem.currentStock || 0),
            isBottleneck: false,
          };
          this.activeComponents.push(target);
        }
      } catch {
        // Fallback
      }
    }

    if (!target) {
      throw new NotFoundException(`Component item with ID or SKU "${id}" not found.`);
    }

    // 2. Apply modifications
    if (dto.costPerPiece !== undefined) {
      target.costPerPiece = Number(dto.costPerPiece);
      target.costContribution = Number((target.costPerPiece * target.requiredPerUnit).toFixed(2));
    }

    if (dto.stockQty !== undefined) {
      target.stockQty = Math.max(0, Number(dto.stockQty));
    }

    if (dto.quickAdjustDelta !== undefined) {
      target.stockQty = Math.max(0, target.stockQty + Number(dto.quickAdjustDelta));
    }

    target.phoneCapacity = target.requiredPerUnit > 0
      ? Math.floor(target.stockQty / target.requiredPerUnit)
      : 0;

    // 3. Persist to database if record exists
    try {
      await this.prisma.itemMaster.update({
        where: { id: target.id },
        data: {
          costPerPiece: target.costPerPiece,
          unitCost: target.costPerPiece,
          stockQty: target.stockQty,
          currentStock: target.stockQty,
        },
      });
    } catch {
      // In-memory update is preserved
    }

    // 4. Return full recalibrated summary
    const summary = this.recalculateMetrics();
    return {
      message: `Component ${target.name} price/stock updated successfully.`,
      updatedItem: target,
      recalibratedSummary: summary,
    };
  }

  /**
   * POST /api/inventory/capacity/release-batch
   * Dispatches cleanroom job cards for the maximum assembleable volume
   */
  @Post('capacity/release-batch')
  async releaseBatch(@Body() dto: ReleaseBatchDto) {
    const summary = this.recalculateMetrics();
    const releaseQty = dto.batchQuantity ?? summary.maxAssembleableUnits;

    // Deduct consumed components
    this.activeComponents = this.activeComponents.map((comp) => {
      const consumed = releaseQty * comp.requiredPerUnit;
      const newStock = Math.max(0, comp.stockQty - consumed);
      return {
        ...comp,
        stockQty: newStock,
        phoneCapacity: comp.requiredPerUnit > 0 ? Math.floor(newStock / comp.requiredPerUnit) : 0,
      };
    });

    const recalibrated = this.recalculateMetrics();

    return {
      success: true,
      batchJobCardNumber: `JC-CLEAN-${Date.now().toString().slice(-6)}`,
      releasedUnits: releaseQty,
      dispatchedAt: new Date().toISOString(),
      cleanroomStation: 'SMT Line 01 -> Optical AOI',
      recalibratedCapacity: recalibrated,
    };
  }

  private recalculateMetrics() {
    let minUnits = Number.MAX_SAFE_INTEGER;
    let bottleneckItem = this.activeComponents[0];

    // Evaluate stock / requiredPerUnit across all components
    this.activeComponents.forEach((item) => {
      const cap = item.requiredPerUnit > 0 ? Math.floor(item.stockQty / item.requiredPerUnit) : 0;
      item.phoneCapacity = cap;
      item.costContribution = Number((item.costPerPiece * item.requiredPerUnit).toFixed(2));

      if (cap < minUnits) {
        minUnits = cap;
        bottleneckItem = item;
      }
    });

    const maxAssembleableUnits = minUnits === Number.MAX_SAFE_INTEGER ? 0 : minUnits;

    // Flag the bottleneck row
    this.activeComponents = this.activeComponents.map((item) => ({
      ...item,
      isBottleneck: bottleneckItem ? item.id === bottleneckItem.id : false,
    }));

    const totalRawBOMCost = Number(
      this.activeComponents.reduce((sum, item) => sum + item.costContribution, 0).toFixed(2),
    );

    return {
      maxAssembleableUnits,
      bottleneckComponent: {
        id: bottleneckItem.id,
        sku: bottleneckItem.sku,
        name: bottleneckItem.name,
        category: bottleneckItem.category,
        stockQty: bottleneckItem.stockQty,
        requiredPerUnit: bottleneckItem.requiredPerUnit,
        phoneCapacity: bottleneckItem.phoneCapacity,
        unit: bottleneckItem.unit,
      },
      totalRawBOMCost,
      totalComponentCount: this.activeComponents.length,
      components: this.activeComponents,
    };
  }
}

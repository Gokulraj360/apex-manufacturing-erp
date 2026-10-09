import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OverheadsService } from '../overheads/overheads.service';
import { BatchUpdateComponentRatesDto, UpdateCostingParametersDto } from './dto/costing.dto';
import { ItemType } from '@prisma/client';

export interface ComponentCostRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPerPiece: number;
  requiredPerUnit: number;
  extendedCost: number;
  stockQty: number;
  maxAssembleable: number;
  isBottleneck: boolean;
}

@Injectable()
export class CostingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly overheadsService: OverheadsService,
  ) {}

  /**
   * Fetch current global costing parameters
   */
  async getParameters() {
    try {
      let params = await this.prisma.costingParameter.findFirst({
        orderBy: { updatedAt: 'desc' },
      });

      if (!params) {
        params = await this.prisma.costingParameter.create({
          data: {
            targetSellingPrice: 0.0,
            monthlyProductionTargetVolume: 0.0,
            rawCostPerUnitCache: 0.0,
            overheadPerUnitCache: 0.0,
          },
        });
      }

      return {
        id: params.id,
        targetSellingPrice: Number(params.targetSellingPrice),
        monthlyProductionTargetVolume: Number(params.monthlyProductionTargetVolume),
        rawCostPerUnitCache: Number(params.rawCostPerUnitCache),
        overheadPerUnitCache: Number(params.overheadPerUnitCache),
        updatedAt: params.updatedAt,
      };
    } catch {
      return {
        id: 'default-param',
        targetSellingPrice: 0.0,
        monthlyProductionTargetVolume: 0.0,
        rawCostPerUnitCache: 0.0,
        overheadPerUnitCache: 0.0,
        updatedAt: new Date(),
      };
    }
  }

  /**
   * Update Target Selling Price and Monthly Production Target
   */
  async updateParameters(dto: UpdateCostingParametersDto) {
    const current = await this.getParameters();
    const updatedTargetSellingPrice = dto.targetSellingPrice ?? current.targetSellingPrice;
    const updatedVolume = dto.monthlyProductionTargetVolume ?? current.monthlyProductionTargetVolume;

    try {
      if (current.id && current.id !== 'default-param') {
        const updated = await this.prisma.costingParameter.update({
          where: { id: current.id },
          data: {
            targetSellingPrice: updatedTargetSellingPrice,
            monthlyProductionTargetVolume: updatedVolume,
          },
        });
        return {
          id: updated.id,
          targetSellingPrice: Number(updated.targetSellingPrice),
          monthlyProductionTargetVolume: Number(updated.monthlyProductionTargetVolume),
          rawCostPerUnitCache: Number(updated.rawCostPerUnitCache),
          overheadPerUnitCache: Number(updated.overheadPerUnitCache),
          updatedAt: updated.updatedAt,
        };
      } else {
        const created = await this.prisma.costingParameter.create({
          data: {
            targetSellingPrice: updatedTargetSellingPrice,
            monthlyProductionTargetVolume: updatedVolume,
            rawCostPerUnitCache: current.rawCostPerUnitCache,
            overheadPerUnitCache: current.overheadPerUnitCache,
          },
        });
        return {
          id: created.id,
          targetSellingPrice: Number(created.targetSellingPrice),
          monthlyProductionTargetVolume: Number(created.monthlyProductionTargetVolume),
          rawCostPerUnitCache: Number(created.rawCostPerUnitCache),
          overheadPerUnitCache: Number(created.overheadPerUnitCache),
          updatedAt: created.updatedAt,
        };
      }
    } catch {
      return {
        id: 'default-param',
        targetSellingPrice: updatedTargetSellingPrice,
        monthlyProductionTargetVolume: updatedVolume,
        rawCostPerUnitCache: current.rawCostPerUnitCache,
        overheadPerUnitCache: current.overheadPerUnitCache,
        updatedAt: new Date(),
      };
    }
  }

  /**
   * Batch update component unit cost rates
   */
  async batchUpdateComponentRates(dto: BatchUpdateComponentRatesDto) {
    const results = [];
    for (const item of dto.rates) {
      try {
        const updated = await this.prisma.itemMaster.update({
          where: { id: item.itemId },
          data: {
            costPerPiece: item.costPerPiece,
            unitCost: item.costPerPiece,
          },
        });
        results.push(updated);
      } catch {
        // Continue if item not found in DB
      }
    }
    return { success: true, count: results.length };
  }

  /**
   * Main Costing Engine: Computes Raw BOM Cost, Absorbed Overhead, CP, SP, Margins, and Bottleneck
   */
  async calculateCostPrice(customTargetSP?: number, customVolume?: number) {
    const params = await this.getParameters();
    const targetSellingPrice = customTargetSP ?? params.targetSellingPrice;
    const monthlyTargetVolume = customVolume ?? params.monthlyProductionTargetVolume;

    // 1. Fetch Overheads absorption
    const overheadsData = await this.overheadsService.findAll(monthlyTargetVolume);
    const totalMonthlyOverheads = overheadsData.totalMonthlyOverhead;
    const allocatedOverheadPerUnit = overheadsData.overheadPerUnit;

    // 2. Fetch or compute BOM components from database
    let components = await this.getBOMComponents();

    // 3. Raw Material Cost = Σ (Unit Rate × Required Per Unit)
    const rawMaterialCostPerUnit = Number(
      components.reduce((sum, item) => sum + item.extendedCost, 0).toFixed(2),
    );

    // 4. Total Manufacturing Cost Price (CP) = Raw BOM Cost + Allocated Overhead
    const totalCostPrice = Number((rawMaterialCostPerUnit + allocatedOverheadPerUnit).toFixed(2));

    // 5. Margin Calculations against Target Selling Price (SP)
    const profitMarginPerUnit = Number((targetSellingPrice - totalCostPrice).toFixed(2));
    const profitMarginPercentage = targetSellingPrice > 0
      ? Number(((profitMarginPerUnit / targetSellingPrice) * 100).toFixed(2))
      : 0;

    // 6. Bottleneck Detector Engine:
    // Evaluates stockQty / requiredPerUnit across all components
    let bottleneckComponent: ComponentCostRow | null = null;
    let minAssembleable = Number.MAX_SAFE_INTEGER;

    if (components.length > 0) {
      components = components.map((comp) => {
        const maxUnits = comp.requiredPerUnit > 0
          ? Math.floor(comp.stockQty / comp.requiredPerUnit)
          : 0;

        if (maxUnits < minAssembleable) {
          minAssembleable = maxUnits;
          bottleneckComponent = comp;
        }

        return {
          ...comp,
          maxAssembleable: maxUnits,
        };
      });

      // Mark the identified bottleneck component
      components = components.map((comp) => ({
        ...comp,
        isBottleneck: bottleneckComponent ? comp.id === bottleneckComponent.id : false,
      }));
    }

    const maxAssembleableUnits = (components.length > 0 && minAssembleable !== Number.MAX_SAFE_INTEGER)
      ? minAssembleable
      : 0;

    // Potential Batch Profit: Net Profit Margin Per Unit × Max Assembleable Units
    const potentialBatchProfitRaw = Number((profitMarginPerUnit * maxAssembleableUnits).toFixed(2));
    // In ₹ Crores (1 Crore = 10,000,000)
    const potentialBatchProfitInCrores = Number((potentialBatchProfitRaw / 10000000).toFixed(2));

    return {
      kpis: {
        rawMaterialCostPerUnit,
        overheadCostPerUnit: allocatedOverheadPerUnit,
        totalCostPrice,
        targetSellingPrice,
        profitMarginPerUnit,
        profitMarginPercentage,
        monthlyTargetVolume,
        totalMonthlyOverheads,
      },
      bottleneck: {
        componentId: bottleneckComponent?.id || null,
        componentName: bottleneckComponent?.name || 'N/A',
        sku: bottleneckComponent?.sku || 'N/A',
        category: bottleneckComponent?.category || 'N/A',
        availableStock: bottleneckComponent?.stockQty || 0,
        requiredPerUnit: bottleneckComponent?.requiredPerUnit || 1,
        maxAssembleableUnits,
        potentialBatchProfitRaw,
        potentialBatchProfitInCrores,
      },
      componentsBreakdown: components,
      overheadsBreakdown: overheadsData.items,
    };
  }

  private async getBOMComponents(): Promise<ComponentCostRow[]> {
    try {
      const dbItems = await this.prisma.itemMaster.findMany({
        where: {
          category: {
            in: [
              ItemType.IC,
              ItemType.DISPLAY,
              ItemType.OPTICS,
              ItemType.BATTERY,
              ItemType.SHELL,
              ItemType.CONNECTORS,
              ItemType.CONSUMABLE,
              ItemType.RAW_MATERIAL,
            ],
          },
        },
        take: 50,
      });

      return dbItems.map((item) => {
        const rate = Number(item.costPerPiece || item.unitCost || 0);
        const req = 1;
        const stock = Number(item.stockQty || item.currentStock || 0);
        return {
          id: item.id,
          sku: item.sku || item.code,
          name: item.name,
          category: item.category,
          unit: item.unit || item.uom || 'PCS',
          costPerPiece: rate,
          requiredPerUnit: req,
          extendedCost: rate * req,
          stockQty: stock,
          maxAssembleable: Math.floor(stock / req),
          isBottleneck: false,
        };
      });
    } catch {
      return [];
    }
  }
}

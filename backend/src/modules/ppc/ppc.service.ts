import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateMPSDto,
  QueryMPSDto,
  MPSStatus,
  PRStatus,
} from './dto/ppc.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';

export interface MRPRow {
  itemId: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  level: number;
  netRequiredQty: number;
  scrapRate: number;
  grossRequiredQty: number;
  currentStock: number;
  minStockQty: number;
  shortageQty: number;
  availabilityStatus: 'IN_STOCK' | 'SHORTAGE';
  autoPRTriggered: boolean;
  prNumber?: string | null;
  prStatus?: string | null;
  unitCost: number;
  totalEstimatedCost: number;
}

@Injectable()
export class PPCService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllMPS(query: QueryMPSDto) {
    const { skip, limit = 20, page = 1, search, status } = query;

    const where: any = {};
    if (status) where.status = status;
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { planNumber: { contains: term, mode: 'insensitive' } },
        { finishedItem: { code: { contains: term, mode: 'insensitive' } } },
        { finishedItem: { name: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.masterProductionSchedule.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'asc' }, { startDate: 'asc' }],
        include: {
          finishedItem: {
            select: { id: true, code: true, name: true, category: true, uom: true, currentStock: true },
          },
          bom: {
            select: { id: true, bomNumber: true, name: true, version: true },
          },
          salesOrder: {
            select: { id: true, orderNumber: true, customerName: true, deliveryDate: true },
          },
          _count: {
            select: { requisitions: true },
          },
        },
      }),
      this.prisma.masterProductionSchedule.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOneMPS(id: string) {
    const mps = await this.prisma.masterProductionSchedule.findUnique({
      where: { id },
      include: {
        finishedItem: true,
        bom: {
          include: {
            components: {
              include: { componentItem: true },
            },
          },
        },
        salesOrder: {
          include: { items: true },
        },
        requisitions: {
          include: { item: true },
        },
      },
    });

    if (!mps) {
      throw new NotFoundException({
        message: `Master Production Schedule '${id}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return mps;
  }

  async createMPS(dto: CreateMPSDto) {
    const normalizedPlanNumber = dto.planNumber.trim().toUpperCase();

    const existing = await this.prisma.masterProductionSchedule.findUnique({
      where: { planNumber: normalizedPlanNumber },
    });

    if (existing) {
      throw new ConflictException({
        message: `MPS Plan '${normalizedPlanNumber}' already exists.`,
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    const finishedItem = await this.prisma.itemMaster.findUnique({
      where: { id: dto.finishedItemId },
      include: {
        bomsAsFinished: {
          where: { isActive: true },
          take: 1,
        },
      },
    });

    if (!finishedItem) {
      throw new NotFoundException({
        message: `Finished Item with ID '${dto.finishedItemId}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    let bomId = dto.bomId;
    if (!bomId && finishedItem.bomsAsFinished.length > 0) {
      bomId = finishedItem.bomsAsFinished[0].id;
    }

    return this.prisma.masterProductionSchedule.create({
      data: {
        planNumber: normalizedPlanNumber,
        salesOrderId: dto.salesOrderId || null,
        finishedItemId: dto.finishedItemId,
        bomId: bomId || null,
        plannedQty: dto.plannedQty,
        startDate: new Date(dto.startDate),
        dueDate: new Date(dto.dueDate),
        status: MPSStatus.PLANNED,
        priority: dto.priority || 'MEDIUM',
        notes: dto.notes?.trim() || null,
      },
      include: {
        finishedItem: true,
        bom: true,
        salesOrder: true,
      },
    });
  }

  async updateMPSStatus(id: string, status: MPSStatus) {
    await this.findOneMPS(id);

    return this.prisma.masterProductionSchedule.update({
      where: { id },
      data: { status },
      include: {
        finishedItem: true,
        bom: true,
      },
    });
  }

  async getBOMExplosionMatrix(mpsId: string): Promise<{
    mps: any;
    summary: {
      totalComponentsRequired: number;
      inStockCount: number;
      shortageCount: number;
      totalEstimatedProcurementCost: number;
    };
    matrix: MRPRow[];
  }> {
    const mps = await this.findOneMPS(mpsId);

    if (!mps.bomId) {
      throw new BadRequestException({
        message: `Cannot run BOM Explosion: No active BOM assigned to MPS plan '${mps.planNumber}'.`,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const plannedQty = Number(mps.plannedQty);
    const existingRequisitions = await this.prisma.purchaseRequisition.findMany({
      where: { mpsPlanId: mpsId },
    });
    const prMap = new Map(existingRequisitions.map((pr) => [pr.itemId, pr]));

    const componentDemands = new Map<
      string,
      {
        itemId: string;
        code: string;
        name: string;
        category: string;
        uom: string;
        level: number;
        netPerUnit: number;
        scrapRate: number;
        unitCost: number;
        totalGrossRequired: number;
      }
    >();

    const explode = async (currentBomId: string, currentLevel: number, scaleFactor: number) => {
      const items = await this.prisma.bOMItem.findMany({
        where: { bomId: currentBomId },
        include: { componentItem: true },
      });

      for (const item of items) {
        const netPerUnit = Number(item.quantity) * scaleFactor;
        const scrap = Number(item.scrapRate);
        const grossDemand = Number((netPerUnit * plannedQty * (1 + scrap / 100)).toFixed(4));

        const existing = componentDemands.get(item.componentItemId);
        if (existing) {
          existing.totalGrossRequired += grossDemand;
        } else {
          componentDemands.set(item.componentItemId, {
            itemId: item.componentItemId,
            code: item.componentItem.code,
            name: item.componentItem.name,
            category: item.componentItem.category,
            uom: item.uom || item.componentItem.uom,
            level: currentLevel,
            netPerUnit,
            scrapRate: scrap,
            unitCost: Number(item.componentItem.unitCost || 0),
            totalGrossRequired: grossDemand,
          });
        }

        if (item.subBomId) {
          await explode(item.subBomId, currentLevel + 1, netPerUnit);
        }
      }
    };

    await explode(mps.bomId, 1, 1);

    const itemIds = Array.from(componentDemands.keys());
    const stockItems = await this.prisma.itemMaster.findMany({
      where: { id: { in: itemIds } },
    });
    const stockMap = new Map(stockItems.map((i) => [i.id, i]));

    const matrix: MRPRow[] = [];
    let inStockCount = 0;
    let shortageCount = 0;
    let totalEstimatedProcurementCost = 0;

    for (const [itemId, demand] of componentDemands.entries()) {
      const stockItem = stockMap.get(itemId);
      const currentStock = Number(stockItem?.currentStock || 0);
      const minStockQty = Number(stockItem?.minStockQty || 0);
      const grossRequired = Number(demand.totalGrossRequired.toFixed(3));
      const shortage = grossRequired > currentStock ? Number((grossRequired - currentStock).toFixed(3)) : 0;
      const isShortage = shortage > 0;

      if (isShortage) {
        shortageCount++;
        totalEstimatedProcurementCost += shortage * demand.unitCost;
      } else {
        inStockCount++;
      }

      const existingPR = prMap.get(itemId);

      matrix.push({
        itemId,
        code: demand.code,
        name: demand.name,
        category: demand.category,
        uom: demand.uom,
        level: demand.level,
        netRequiredQty: Number((demand.netPerUnit * plannedQty).toFixed(3)),
        scrapRate: demand.scrapRate,
        grossRequiredQty: grossRequired,
        currentStock,
        minStockQty,
        shortageQty: shortage,
        availabilityStatus: isShortage ? 'SHORTAGE' : 'IN_STOCK',
        autoPRTriggered: Boolean(existingPR),
        prNumber: existingPR?.prNumber || null,
        prStatus: existingPR?.status || null,
        unitCost: demand.unitCost,
        totalEstimatedCost: Number((grossRequired * demand.unitCost).toFixed(2)),
      });
    }

    matrix.sort((a, b) => {
      if (a.availabilityStatus !== b.availabilityStatus) {
        return a.availabilityStatus === 'SHORTAGE' ? -1 : 1;
      }
      return a.level - b.level;
    });

    return {
      mps,
      summary: {
        totalComponentsRequired: matrix.length,
        inStockCount,
        shortageCount,
        totalEstimatedProcurementCost: Number(totalEstimatedProcurementCost.toFixed(2)),
      },
      matrix,
    };
  }

  async triggerAutoPR(mpsId: string) {
    const explosion = await this.getBOMExplosionMatrix(mpsId);
    const shortages = explosion.matrix.filter((row) => row.availabilityStatus === 'SHORTAGE');

    const createdPRs = [];

    for (const row of shortages) {
      if (row.autoPRTriggered) continue;

      const prNumber = `PR-${Date.now().toString(36).toUpperCase()}-${row.code.substring(0, 6)}`;

      const pr = await this.prisma.purchaseRequisition.create({
        data: {
          prNumber,
          itemId: row.itemId,
          mpsPlanId: mpsId,
          quantity: row.shortageQty,
          status: PRStatus.AUTO_GENERATED,
          reason: `MRP Shortage Trigger for MPS Plan ${explosion.mps.planNumber}`,
          requiredBy: explosion.mps.startDate,
          notes: `Auto-generated by PPC MRP engine. Gross Demand: ${row.grossRequiredQty} ${row.uom}, On-Hand: ${row.currentStock} ${row.uom}.`,
        },
        include: { item: true },
      });

      createdPRs.push(pr);
    }

    return {
      mpsId,
      triggeredCount: createdPRs.length,
      requisitions: createdPRs,
    };
  }

  async findAllRequisitions() {
    return this.prisma.purchaseRequisition.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        item: { select: { code: true, name: true, category: true, uom: true, unitCost: true } },
        mpsPlan: { select: { planNumber: true, startDate: true, dueDate: true } },
      },
    });
  }
}

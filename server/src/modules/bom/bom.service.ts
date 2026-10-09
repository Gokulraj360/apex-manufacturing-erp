import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateBOMDto,
  UpdateBOMDto,
  AddBOMItemDto,
  UpdateBOMItemDto,
} from './dto/bom.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';

export interface BOMTreeNode {
  id: string;
  bomId: string;
  componentItemId: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  quantity: number;
  scrapRate: number;
  grossRequiredQty: number; // quantity * (1 + scrapRate/100)
  level: number;
  subBomId?: string | null;
  subBom?: {
    id: string;
    bomNumber: string;
    name: string;
    version: string;
  } | null;
  children?: BOMTreeNode[];
}

@Injectable()
export class BOMService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve paginated BOMs with finished product info and component counts
   */
  async findAll(pagination: PaginationDto, search?: string) {
    const { skip, limit = 20, page = 1 } = pagination;

    const where: any = {};
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { bomNumber: { contains: term, mode: 'insensitive' } },
        { name: { contains: term, mode: 'insensitive' } },
        {
          finishedItem: {
            OR: [
              { code: { contains: term, mode: 'insensitive' } },
              { name: { contains: term, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.billOfMaterials.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ level: 'asc' }, { bomNumber: 'asc' }],
        include: {
          finishedItem: {
            select: {
              id: true,
              code: true,
              name: true,
              category: true,
              uom: true,
              currentStock: true,
            },
          },
          _count: {
            select: {
              components: true,
              subAssemblies: true,
            },
          },
        },
      }),
      this.prisma.billOfMaterials.count({ where }),
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

  /**
   * Find a single BOM with full immediate component details
   */
  async findOne(id: string) {
    const bom = await this.prisma.billOfMaterials.findUnique({
      where: { id },
      include: {
        finishedItem: true,
        components: {
          orderBy: { createdAt: 'asc' },
          include: {
            componentItem: true,
            subBom: {
              select: {
                id: true,
                bomNumber: true,
                name: true,
                version: true,
                level: true,
              },
            },
          },
        },
      },
    });

    if (!bom) {
      throw new NotFoundException({
        message: `Bill of Materials with ID '${id}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return bom;
  }

  /**
   * Explodes the multi-level BOM hierarchy recursively into a full tree
   */
  async getBOMTree(bomId: string): Promise<{
    bom: any;
    tree: BOMTreeNode[];
    totalComponentCount: number;
    maxDepth: number;
  }> {
    const visitedBoms = new Set<string>();

    const rootBom = await this.prisma.billOfMaterials.findUnique({
      where: { id: bomId },
      include: {
        finishedItem: true,
      },
    });

    if (!rootBom) {
      throw new NotFoundException({
        message: `BOM with ID '${bomId}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    let totalComponentCount = 0;
    let maxDepth = 1;

    const buildTree = async (
      currentBomId: string,
      currentLevel: number,
      multiplier: number = 1,
    ): Promise<BOMTreeNode[]> => {
      if (visitedBoms.has(currentBomId)) {
        throw new BadRequestException({
          message: `Circular BOM dependency detected involving BOM ID '${currentBomId}'.`,
          errorCode: ErrorCode.VALIDATION_ERROR,
        });
      }

      visitedBoms.add(currentBomId);
      if (currentLevel > maxDepth) {
        maxDepth = currentLevel;
      }

      const items = await this.prisma.bOMItem.findMany({
        where: { bomId: currentBomId },
        include: {
          componentItem: true,
          subBom: {
            select: {
              id: true,
              bomNumber: true,
              name: true,
              version: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      const nodes: BOMTreeNode[] = [];

      for (const item of items) {
        totalComponentCount++;
        const netQty = Number(item.quantity) * multiplier;
        const scrap = Number(item.scrapRate);
        const grossQty = Number((netQty * (1 + scrap / 100)).toFixed(4));

        let children: BOMTreeNode[] | undefined = undefined;

        if (item.subBomId) {
          // Clone visited set for branch-level recursion
          children = await buildTree(item.subBomId, currentLevel + 1, netQty);
        }

        nodes.push({
          id: item.id,
          bomId: item.bomId,
          componentItemId: item.componentItemId,
          code: item.componentItem.code,
          name: item.componentItem.name,
          category: item.componentItem.category,
          uom: item.uom || item.componentItem.uom,
          quantity: netQty,
          scrapRate: scrap,
          grossRequiredQty: grossQty,
          level: currentLevel,
          subBomId: item.subBomId,
          subBom: item.subBom,
          children,
        });
      }

      visitedBoms.delete(currentBomId);
      return nodes;
    };

    const tree = await buildTree(bomId, 1, 1);

    return {
      bom: rootBom,
      tree,
      totalComponentCount,
      maxDepth,
    };
  }

  /**
   * Create a new Bill of Materials recipe
   */
  async create(dto: CreateBOMDto) {
    const normalizedBomNumber = dto.bomNumber.trim().toUpperCase();

    // Check unique BOM number
    const existing = await this.prisma.billOfMaterials.findUnique({
      where: { bomNumber: normalizedBomNumber },
    });

    if (existing) {
      throw new ConflictException({
        message: `BOM with number '${normalizedBomNumber}' already exists.`,
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    // Verify finished product exists
    const finishedItem = await this.prisma.itemMaster.findUnique({
      where: { id: dto.finishedItemId },
    });

    if (!finishedItem) {
      throw new NotFoundException({
        message: `Finished item with ID '${dto.finishedItemId}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    // Verify components do not reference the finished item itself
    for (const comp of dto.components) {
      if (comp.componentItemId === dto.finishedItemId) {
        throw new BadRequestException({
          message: `Finished item '${finishedItem.code}' cannot be used as its own component.`,
          errorCode: ErrorCode.VALIDATION_ERROR,
        });
      }
    }

    return this.prisma.billOfMaterials.create({
      data: {
        bomNumber: normalizedBomNumber,
        name: dto.name.trim(),
        version: dto.version?.trim() || '1.0',
        finishedItemId: dto.finishedItemId,
        level: dto.level ?? 1,
        description: dto.description?.trim(),
        isActive: dto.isActive ?? true,
        components: {
          create: dto.components.map((c) => ({
            componentItemId: c.componentItemId,
            subBomId: c.subBomId || null,
            quantity: c.quantity,
            scrapRate: c.scrapRate ?? 0,
            uom: c.uom?.trim() || 'PCS',
            notes: c.notes?.trim(),
          })),
        },
      },
      include: {
        finishedItem: true,
        components: {
          include: {
            componentItem: true,
            subBom: true,
          },
        },
      },
    });
  }

  /**
   * Update an existing BOM
   */
  async update(id: string, dto: UpdateBOMDto) {
    await this.findOne(id);

    if (dto.bomNumber) {
      const normalizedBomNumber = dto.bomNumber.trim().toUpperCase();
      const existing = await this.prisma.billOfMaterials.findUnique({
        where: { bomNumber: normalizedBomNumber },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException({
          message: `Another BOM with number '${normalizedBomNumber}' already exists.`,
          errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
        });
      }
    }

    const data: any = {};
    if (dto.bomNumber !== undefined) data.bomNumber = dto.bomNumber.trim().toUpperCase();
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.version !== undefined) data.version = dto.version.trim();
    if (dto.finishedItemId !== undefined) data.finishedItemId = dto.finishedItemId;
    if (dto.level !== undefined) data.level = dto.level;
    if (dto.description !== undefined) data.description = dto.description.trim();
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.billOfMaterials.update({
      where: { id },
      data,
      include: {
        finishedItem: true,
        components: {
          include: {
            componentItem: true,
            subBom: true,
          },
        },
      },
    });
  }

  /**
   * Add a component to an existing BOM
   */
  async addComponent(bomId: string, dto: AddBOMItemDto) {
    const bom = await this.findOne(bomId);

    if (dto.componentItemId === bom.finishedItemId) {
      throw new BadRequestException({
        message: 'Cannot add the finished item itself as a component.',
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const existingComponent = await this.prisma.bOMItem.findUnique({
      where: {
        bomId_componentItemId: {
          bomId,
          componentItemId: dto.componentItemId,
        },
      },
    });

    if (existingComponent) {
      throw new ConflictException({
        message: 'This component already exists in the BOM. Update its quantity instead.',
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    return this.prisma.bOMItem.create({
      data: {
        bomId,
        componentItemId: dto.componentItemId,
        subBomId: dto.subBomId || null,
        quantity: dto.quantity,
        scrapRate: dto.scrapRate ?? 0,
        uom: dto.uom?.trim() || 'PCS',
        notes: dto.notes?.trim(),
      },
      include: {
        componentItem: true,
        subBom: true,
      },
    });
  }

  /**
   * Update component item details (quantity, scrap rate, notes)
   */
  async updateComponent(bomId: string, itemId: string, dto: UpdateBOMItemDto) {
    const item = await this.prisma.bOMItem.findFirst({
      where: { id: itemId, bomId },
    });

    if (!item) {
      throw new NotFoundException({
        message: `Component item '${itemId}' not found in BOM '${bomId}'.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    const data: any = {};
    if (dto.quantity !== undefined) data.quantity = dto.quantity;
    if (dto.scrapRate !== undefined) data.scrapRate = dto.scrapRate;
    if (dto.uom !== undefined) data.uom = dto.uom.trim();
    if (dto.notes !== undefined) data.notes = dto.notes?.trim();
    if (dto.subBomId !== undefined) data.subBomId = dto.subBomId;

    return this.prisma.bOMItem.update({
      where: { id: itemId },
      data,
      include: {
        componentItem: true,
        subBom: true,
      },
    });
  }

  /**
   * Remove a component from a BOM
   */
  async removeComponent(bomId: string, itemId: string) {
    const item = await this.prisma.bOMItem.findFirst({
      where: { id: itemId, bomId },
    });

    if (!item) {
      throw new NotFoundException({
        message: `Component item '${itemId}' not found in BOM '${bomId}'.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return this.prisma.bOMItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Delete a BOM recipe
   */
  async delete(id: string) {
    const bom = await this.findOne(id);

    // Verify it is not used as a sub-assembly in another BOM
    const usedAsSubAssembly = await this.prisma.bOMItem.findFirst({
      where: { subBomId: id },
      include: { bom: true },
    });

    if (usedAsSubAssembly) {
      throw new ConflictException({
        message: `Cannot delete BOM '${bom.bomNumber}': It is referenced as a sub-assembly in parent BOM '${usedAsSubAssembly.bom.bomNumber}'.`,
        errorCode: ErrorCode.DB_FOREIGN_KEY_VIOLATION,
      });
    }

    return this.prisma.billOfMaterials.delete({
      where: { id },
    });
  }
}

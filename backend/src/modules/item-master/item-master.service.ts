import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateItemMasterDto } from './dto/create-item-master.dto';
import { UpdateItemMasterDto } from './dto/update-item-master.dto';
import { QueryItemMasterDto } from './dto/query-item-master.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class ItemMasterService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve paginated items with dynamic search, category, and stock filters
   */
  async findAll(query: QueryItemMasterDto) {
    const { skip, limit = 20, page = 1, search, category, isActive, lowStock } = query;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (category) {
      where.category = category;
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { code: { contains: term, mode: 'insensitive' } },
        { name: { contains: term, mode: 'insensitive' } },
      ];
    }

    // Filter by low stock if requested
    if (lowStock) {
      // In Prisma/PostgreSQL, we compare currentStock <= minStockQty
      where.minStockQty = { gt: 0 };
    }

    const [rawItems, total] = await Promise.all([
      this.prisma.itemMaster.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ category: 'asc' }, { code: 'asc' }],
        include: {
          _count: {
            select: {
              bomsAsFinished: true,
              bomComponents: true,
            },
          },
        },
      }),
      this.prisma.itemMaster.count({ where }),
    ]);

    // If lowStock is true, filter in-memory or let rawItems pass if minStock check applies
    let items = rawItems;
    if (lowStock) {
      items = rawItems.filter(
        (item) => Number(item.currentStock) <= Number(item.minStockQty),
      );
    }

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
   * Find a single item by UUID with BOM references
   */
  async findOne(id: string) {
    const item = await this.prisma.itemMaster.findUnique({
      where: { id },
      include: {
        bomsAsFinished: {
          select: {
            id: true,
            bomNumber: true,
            name: true,
            version: true,
            isActive: true,
          },
        },
        bomComponents: {
          include: {
            bom: {
              select: {
                id: true,
                bomNumber: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException({
        message: `Item with ID '${id}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return item;
  }

  /**
   * Find item by unique item code (SKU)
   */
  async findByCode(code: string) {
    const item = await this.prisma.itemMaster.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!item) {
      throw new NotFoundException({
        message: `Item with code '${code}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return item;
  }

  /**
   * Create a new ItemMaster record with dynamic JSONB customAttrs
   */
  async create(dto: CreateItemMasterDto) {
    const normalizedCode = dto.code.trim().toUpperCase();

    const existing = await this.prisma.itemMaster.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      throw new ConflictException({
        message: `An item with code '${normalizedCode}' already exists.`,
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    return this.prisma.itemMaster.create({
      data: {
        code: normalizedCode,
        name: dto.name.trim(),
        category: dto.category,
        uom: dto.uom.trim().toUpperCase(),
        customAttrs: dto.customAttrs || {},
        currentStock: dto.currentStock ?? 0,
        minStockQty: dto.minStockQty ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Update an existing ItemMaster record
   */
  async update(id: string, dto: UpdateItemMasterDto) {
    await this.findOne(id);

    if (dto.code) {
      const normalizedCode = dto.code.trim().toUpperCase();
      const existing = await this.prisma.itemMaster.findUnique({
        where: { code: normalizedCode },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException({
          message: `Another item with code '${normalizedCode}' already exists.`,
          errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
        });
      }
    }

    const data: any = {};
    if (dto.code !== undefined) data.code = dto.code.trim().toUpperCase();
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.uom !== undefined) data.uom = dto.uom.trim().toUpperCase();
    if (dto.customAttrs !== undefined) data.customAttrs = dto.customAttrs;
    if (dto.currentStock !== undefined) data.currentStock = dto.currentStock;
    if (dto.minStockQty !== undefined) data.minStockQty = dto.minStockQty;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.itemMaster.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an ItemMaster record if not referenced in any BOM recipes
   */
  async delete(id: string) {
    const item = await this.prisma.itemMaster.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bomsAsFinished: true,
            bomComponents: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException({
        message: `Item with ID '${id}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    if (item._count.bomsAsFinished > 0) {
      throw new ConflictException({
        message: `Cannot delete item '${item.code}': It is referenced as the parent finished product in ${item._count.bomsAsFinished} BOM recipe(s).`,
        errorCode: ErrorCode.DB_FOREIGN_KEY_VIOLATION,
      });
    }

    if (item._count.bomComponents > 0) {
      throw new ConflictException({
        message: `Cannot delete item '${item.code}': It is used as a component in ${item._count.bomComponents} BOM recipe(s).`,
        errorCode: ErrorCode.DB_FOREIGN_KEY_VIOLATION,
      });
    }

    return this.prisma.itemMaster.delete({
      where: { id },
    });
  }

  /**
   * Retrieve all items currently below their defined minimum safety stock
   */
  async getLowStockItems() {
    const items = await this.prisma.itemMaster.findMany({
      where: {
        isActive: true,
        minStockQty: { gt: 0 },
      },
      orderBy: { code: 'asc' },
    });

    return items.filter((item) => Number(item.currentStock) <= Number(item.minStockQty));
  }
}

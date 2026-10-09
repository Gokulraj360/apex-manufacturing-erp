import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreatePurchaseOrderDto,
  QueryPODto,
  PurchaseOrderStatus,
} from './dto/procurement.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService) {}

  async getKPISummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allPOs, mtdPOs, vendors] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        select: {
          id: true,
          status: true,
          totalAmount: true,
          orderDate: true,
        },
      }),
      this.prisma.purchaseOrder.findMany({
        where: {
          orderDate: { gte: startOfMonth },
          status: { notIn: [PurchaseOrderStatus.CANCELLED] },
        },
        select: { totalAmount: true },
      }),
      this.prisma.vendor.findMany({
        where: { isActive: true },
        select: { onTimeDeliveryRate: true },
      }),
    ]);

    const activePOs = allPOs.filter(
      (po) =>
        po.status === PurchaseOrderStatus.PENDING ||
        po.status === PurchaseOrderStatus.APPROVED ||
        po.status === PurchaseOrderStatus.ISSUED ||
        po.status === PurchaseOrderStatus.PARTIALLY_RECEIVED,
    ).length;

    const pendingDeliveries = allPOs.filter(
      (po) =>
        po.status !== PurchaseOrderStatus.RECEIVED &&
        po.status !== PurchaseOrderStatus.CANCELLED,
    ).length;

    const totalSpendMTD = mtdPOs.reduce(
      (sum, po) => sum + Number(po.totalAmount),
      0,
    );

    const vendorRateSum = vendors.reduce(
      (sum, v) => sum + Number(v.onTimeDeliveryRate),
      0,
    );
    const vendorOnTimeRate =
      vendors.length > 0
        ? Number((vendorRateSum / vendors.length).toFixed(1))
        : 96.5;

    return {
      activePOs,
      pendingDeliveries,
      totalSpendMTD: Number(totalSpendMTD.toFixed(2)),
      vendorOnTimeRate,
    };
  }

  async findAllPOs(query: QueryPODto) {
    const { skip, limit = 20, page = 1, search, status, vendorId } = query;

    const where: any = {};
    if (status) where.status = status;
    if (vendorId) where.vendorId = vendorId;

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { poNumber: { contains: term, mode: 'insensitive' } },
        { vendor: { name: { contains: term, mode: 'insensitive' } } },
        { vendor: { code: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orderDate: 'desc' },
        include: {
          vendor: {
            select: { id: true, code: true, name: true, gstin: true, rating: true },
          },
          items: {
            include: {
              item: {
                select: { id: true, code: true, name: true, category: true, uom: true },
              },
            },
          },
          requisition: {
            select: { id: true, prNumber: true, reason: true },
          },
          _count: {
            select: { items: true },
          },
        },
      }),
      this.prisma.purchaseOrder.count({ where }),
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

  async findOnePO(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        vendor: true,
        requisition: {
          include: { mpsPlan: true },
        },
        items: {
          include: {
            item: {
              select: {
                id: true,
                code: true,
                name: true,
                category: true,
                uom: true,
                currentStock: true,
              },
            },
          },
        },
      },
    });

    if (!po) {
      throw new NotFoundException({
        message: `Purchase Order with ID '${id}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return po;
  }

  async createPO(dto: CreatePurchaseOrderDto) {
    const normalizedPONumber = dto.poNumber.trim().toUpperCase();

    const existing = await this.prisma.purchaseOrder.findUnique({
      where: { poNumber: normalizedPONumber },
    });

    if (existing) {
      throw new ConflictException({
        message: `Purchase Order '${normalizedPONumber}' already exists.`,
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    const vendor = await this.prisma.vendor.findUnique({
      where: { id: dto.vendorId },
    });

    if (!vendor) {
      throw new NotFoundException({
        message: `Vendor with ID '${dto.vendorId}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException({
        message: 'Purchase Order must contain at least one item row.',
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    let subtotal = 0;
    let totalGst = 0;

    const itemsData = dto.items.map((item) => {
      const lineNet = Number(item.quantity) * Number(item.unitRate);
      const gstRate = item.gstRate !== undefined ? item.gstRate : (dto.gstRate || 18.0);
      const lineGst = (lineNet * gstRate) / 100;
      const lineTotal = lineNet + lineGst;

      subtotal += lineNet;
      totalGst += lineGst;

      return {
        itemId: item.itemId,
        quantity: item.quantity,
        receivedQty: 0,
        unitRate: item.unitRate,
        gstRate,
        gstAmount: lineGst,
        totalAmount: lineTotal,
        notes: item.notes?.trim() || null,
      };
    });

    const totalAmount = subtotal + totalGst;

    return this.prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          poNumber: normalizedPONumber,
          vendorId: dto.vendorId,
          requisitionId: dto.requisitionId || null,
          expectedDeliveryDate: new Date(dto.expectedDeliveryDate),
          status: PurchaseOrderStatus.PENDING,
          subtotal,
          gstRate: dto.gstRate || 18.0,
          gstAmount: totalGst,
          totalAmount,
          paymentTerms: dto.paymentTerms || vendor.paymentTerms,
          notes: dto.notes?.trim() || null,
          items: {
            create: itemsData,
          },
        },
        include: {
          vendor: true,
          items: {
            include: { item: true },
          },
        },
      });

      if (dto.requisitionId) {
        await tx.purchaseRequisition.update({
          where: { id: dto.requisitionId },
          data: { status: 'PO_CREATED' as any },
        });
      }

      return po;
    });
  }

  async updatePOStatus(id: string, status: PurchaseOrderStatus) {
    const po = await this.findOnePO(id);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.purchaseOrder.update({
        where: { id },
        data: { status },
        include: {
          vendor: true,
          items: {
            include: { item: true },
          },
        },
      });

      if (status === PurchaseOrderStatus.RECEIVED && po.status !== PurchaseOrderStatus.RECEIVED) {
        for (const item of po.items) {
          await tx.itemMaster.update({
            where: { id: item.itemId },
            data: {
              currentStock: {
                increment: Number(item.quantity),
              },
            },
          });
        }
      }

      return updated;
    });
  }

  async findAllVendors() {
    return this.prisma.vendor.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getPendingRequisitions() {
    return this.prisma.purchaseRequisition.findMany({
      where: {
        status: { in: ['AUTO_GENERATED', 'APPROVED'] as any },
      },
      include: {
        item: {
          select: {
            id: true,
            code: true,
            name: true,
            category: true,
            uom: true,
            unitCost: true,
            currentStock: true,
          },
        },
        mpsPlan: {
          select: {
            id: true,
            planNumber: true,
            startDate: true,
            dueDate: true,
          },
        },
      },
      orderBy: { requiredBy: 'asc' },
    });
  }
}

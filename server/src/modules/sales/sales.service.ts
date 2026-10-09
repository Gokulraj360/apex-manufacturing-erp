import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateSalesOrderDto,
  QuerySalesOrderDto,
  SalesOrderStatus,
} from './dto/sales-order.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerCredits() {
    try {
      const dbCredits = await (this.prisma as any).customerCredit.findMany();
      if (dbCredits && dbCredits.length > 0) {
        return dbCredits.map((c: any) => {
          const limit = Number(c.creditLimit);
          const outstanding = Number(c.outstandingAmount);
          const isLocked = c.isLocked || outstanding > limit;
          return {
            id: c.id,
            customerName: c.customerName,
            creditLimit: limit,
            outstandingAmount: outstanding,
            availableCredit: Math.max(0, limit - outstanding),
            utilizationPercent: limit > 0 ? Number(((outstanding / limit) * 100).toFixed(1)) : 0,
            isLocked,
          };
        });
      }
    } catch {
      // Return empty if not created yet
    }

    return [];
  }

  async getCustomerCreditByName(customerName: string) {
    const all = await this.getCustomerCredits();
    const found = all.find(
      (c) => c.customerName.toLowerCase() === customerName.toLowerCase()
    );
    if (found) return found;

    return {
      id: `cred-custom-${Date.now()}`,
      customerName,
      creditLimit: 0,
      outstandingAmount: 0,
      availableCredit: 0,
      utilizationPercent: 0,
      isLocked: false,
    };
  }

  async getKPISummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allOrders, mtdOrders, itemsWithCost] = await Promise.all([
      this.prisma.salesOrder.findMany({
        select: {
          id: true,
          status: true,
          totalAmount: true,
          orderDate: true,
        },
      }),
      this.prisma.salesOrder.findMany({
        where: {
          orderDate: { gte: startOfMonth },
          status: { notIn: [SalesOrderStatus.CANCELLED, SalesOrderStatus.DRAFT] },
        },
        select: { totalAmount: true },
      }),
      this.prisma.salesOrderItem.findMany({
        include: {
          item: {
            select: { unitCost: true },
          },
        },
      }),
    ]);

    const totalOrders = allOrders.length;
    const backlogOrders = allOrders.filter(
      (o) => o.status === SalesOrderStatus.CONFIRMED || o.status === SalesOrderStatus.IN_PRODUCTION,
    );
    const orderBacklogCount = backlogOrders.length;
    const orderBacklogValue = backlogOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0,
    );
    const revenueMTD = mtdOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0,
    );

    let totalRevenue = 0;
    let totalCost = 0;
    for (const item of itemsWithCost) {
      const lineRev = Number(item.totalPrice);
      const lineCost = Number(item.quantity) * Number(item.item.unitCost || 0);
      totalRevenue += lineRev;
      totalCost += lineCost;
    }
    const grossProfit = totalRevenue > 0 ? totalRevenue - totalCost : 0;
    const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      totalOrders,
      orderBacklogCount,
      orderBacklogValue: Number(orderBacklogValue.toFixed(2)),
      revenueMTD: Number(revenueMTD.toFixed(2)),
      grossProfit: Number(grossProfit.toFixed(2)),
      grossMarginPercent: Number(grossMarginPercent.toFixed(1)),
    };
  }

  async findAll(query: QuerySalesOrderDto) {
    const { skip, limit = 20, page = 1, search, status, customerName } = query;

    const where: any = {};
    if (status) where.status = status;
    if (customerName) {
      where.customerName = { contains: customerName.trim(), mode: 'insensitive' };
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { orderNumber: { contains: term, mode: 'insensitive' } },
        { customerName: { contains: term, mode: 'insensitive' } },
        { customerPo: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.salesOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orderDate: 'desc' },
        include: {
          items: {
            include: {
              item: {
                select: { id: true, code: true, name: true, category: true, uom: true },
              },
            },
          },
          _count: {
            select: { items: true, mpsPlans: true },
          },
        },
      }),
      this.prisma.salesOrder.count({ where }),
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

  async findOne(id: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: {
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
                unitCost: true,
              },
            },
          },
        },
        mpsPlans: {
          include: {
            finishedItem: { select: { code: true, name: true } },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException({
        message: `Sales order with ID '${id}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return order;
  }

  async create(dto: CreateSalesOrderDto) {
    const normalizedOrderNumber = dto.orderNumber.trim().toUpperCase();

    const existing = await this.prisma.salesOrder.findUnique({
      where: { orderNumber: normalizedOrderNumber },
    });

    if (existing) {
      throw new ConflictException({
        message: `Sales Order '${normalizedOrderNumber}' already exists.`,
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException({
        message: 'Sales Order must contain at least one line item.',
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    // Real-time Customer Credit Assessment
    const customerCredit = await this.getCustomerCreditByName(dto.customerName.trim());
    if (customerCredit.isLocked || (customerCredit.creditLimit > 0 && customerCredit.outstandingAmount > customerCredit.creditLimit)) {
      const outstandingCr = (customerCredit.outstandingAmount / 10000000).toFixed(2);
      const limitCr = (customerCredit.creditLimit / 10000000).toFixed(2);
      throw new BadRequestException(
        `Order Blocked! Outstanding ₹${outstandingCr} Cr exceeds limit of ₹${limitCr} Cr. Dispatch locked until payment clearance.`
      );
    }

    let totalAmount = 0;
    const itemsData = dto.items.map((item) => {
      const lineTotal = Number(item.quantity) * Number(item.unitPrice);
      totalAmount += lineTotal;
      return {
        itemId: item.itemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: lineTotal,
        notes: item.notes?.trim(),
      };
    });

    return this.prisma.salesOrder.create({
      data: {
        orderNumber: normalizedOrderNumber,
        customerName: dto.customerName.trim(),
        customerPo: dto.customerPo?.trim() || null,
        deliveryDate: new Date(dto.deliveryDate),
        status: SalesOrderStatus.CONFIRMED,
        totalAmount,
        notes: dto.notes?.trim() || null,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: SalesOrderStatus) {
    await this.findOne(id);

    return this.prisma.salesOrder.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: { item: true },
        },
      },
    });
  }
}

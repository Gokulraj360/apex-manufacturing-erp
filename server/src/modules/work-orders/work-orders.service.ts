import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWorkOrderDto, UpdateWorkOrderStatusDto } from './dto/create-work-order.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResourceNotFoundException, InvalidWorkOrderStatusTransitionException } from '../../common/exceptions/app.exception';
import { WorkOrderStatus } from '@prisma/client';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class WorkOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto, status?: WorkOrderStatus) {
    const { skip, limit } = pagination;
    const where = status ? { status } : {};

    const [items, total] = await Promise.all([
      this.prisma.workOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: { id: true, itemCode: true, name: true, uom: true },
          },
          bom: {
            select: { id: true, bomNumber: true, name: true, version: true },
          },
          supervisor: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          operations: {
            orderBy: { sequence: 'asc' },
            include: { machine: true },
          },
        },
      }),
      this.prisma.workOrder.count({ where }),
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
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        product: true,
        bom: {
          include: {
            components: {
              include: { component: true },
            },
          },
        },
        supervisor: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
        operations: {
          orderBy: { sequence: 'asc' },
          include: { machine: true },
        },
        qualityInspections: true,
      },
    });

    if (!workOrder) {
      throw new ResourceNotFoundException('WorkOrder', id);
    }

    return workOrder;
  }

  async create(dto: CreateWorkOrderDto) {
    const existing = await this.prisma.workOrder.findUnique({
      where: { orderNumber: dto.orderNumber },
    });

    if (existing) {
      throw new ConflictException({
        message: `Work Order with number '${dto.orderNumber}' already exists.`,
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    // Verify product exists
    const product = await this.prisma.itemMaster.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new ResourceNotFoundException('ItemMaster (Product)', dto.productId);
    }

    return this.prisma.workOrder.create({
      data: {
        orderNumber: dto.orderNumber,
        description: dto.description,
        productId: dto.productId,
        bomId: dto.bomId,
        quantityToProduce: dto.quantityToProduce,
        priority: dto.priority,
        plannedStartDate: new Date(dto.plannedStartDate),
        plannedEndDate: new Date(dto.plannedEndDate),
        supervisorId: dto.supervisorId,
        status: WorkOrderStatus.PLANNED,
      },
      include: {
        product: true,
        bom: true,
        supervisor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  async updateStatus(id: string, dto: UpdateWorkOrderStatusDto) {
    const currentOrder = await this.findOne(id);
    const validTransitions = this.getValidTransitions(currentOrder.status);

    if (!validTransitions.includes(dto.status)) {
      throw new InvalidWorkOrderStatusTransitionException(
        currentOrder.status,
        dto.status,
      );
    }

    const updateData: any = { status: dto.status };

    if (dto.status === WorkOrderStatus.IN_PROGRESS && !currentOrder.actualStartDate) {
      updateData.actualStartDate = new Date();
    } else if (dto.status === WorkOrderStatus.COMPLETED) {
      updateData.actualEndDate = new Date();
      if (dto.quantityProduced !== undefined) {
        updateData.quantityProduced = dto.quantityProduced;
      }
      if (dto.quantityScrapped !== undefined) {
        updateData.quantityScrapped = dto.quantityScrapped;
      }
    }

    return this.prisma.workOrder.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
        operations: true,
      },
    });
  }

  private getValidTransitions(currentStatus: WorkOrderStatus): WorkOrderStatus[] {
    const map: Record<WorkOrderStatus, WorkOrderStatus[]> = {
      [WorkOrderStatus.DRAFT]: [WorkOrderStatus.PLANNED, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.PLANNED]: [WorkOrderStatus.RELEASED, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.RELEASED]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.ON_HOLD, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.IN_PROGRESS]: [WorkOrderStatus.ON_HOLD, WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.ON_HOLD]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.COMPLETED]: [],
      [WorkOrderStatus.CANCELLED]: [],
    };

    return map[currentStatus] || [];
  }
}

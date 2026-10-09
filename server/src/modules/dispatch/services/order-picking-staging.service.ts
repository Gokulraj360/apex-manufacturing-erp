import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateSalesOrderFulfillmentDto,
  UpdatePickingProgressDto,
} from '../dto/order-picking-staging.dto';
import { AuditAction, AuditSeverity, PickingStatus } from '@prisma/client';

@Injectable()
export class OrderPickingStagingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List sales order fulfillment pick lists with optional status filter
   */
  async getPickLists(status?: PickingStatus) {
    const where = status ? { status } : {};
    return this.prisma.salesOrderFulfillment.findMany({
      where,
      orderBy: { targetDeliveryDate: 'asc' },
    });
  }

  /**
   * Get single fulfillment pick list by ID
   */
  async getPickListById(id: string) {
    const pickList = await this.prisma.salesOrderFulfillment.findUnique({
      where: { id },
    });
    if (!pickList) {
      throw new NotFoundException(`Pick list ${id} not found`);
    }
    return pickList;
  }

  /**
   * Enqueue approved sales order into warehouse picking wave
   */
  async createPickList(dto: CreateSalesOrderFulfillmentDto, userId?: string) {
    const count = await this.prisma.salesOrderFulfillment.count();
    const pickListNumber = `PICK-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const pickList = await this.prisma.salesOrderFulfillment.create({
      data: {
        pickListNumber,
        salesOrderNumber: dto.salesOrderNumber,
        customerName: dto.customerName,
        assignedPicker: dto.assignedPicker,
        status: PickingStatus.QUEUED,
        stagingBay: dto.stagingBay,
        targetDeliveryDate: new Date(dto.targetDeliveryDate),
        itemsToPick: dto.itemsToPick as any,
      },
    });

    return pickList;
  }

  /**
   * Update picking status (e.g. QUEUED -> PICKING -> STAGED)
   */
  async updatePickingProgress(id: string, dto: UpdatePickingProgressDto, userId?: string) {
    const existing = await this.getPickListById(id);

    const isStaged = dto.status === PickingStatus.STAGED;

    const updated = await this.prisma.salesOrderFulfillment.update({
      where: { id },
      data: {
        status: dto.status,
        stagingBay: dto.stagingBay || existing.stagingBay,
        verifiedBy: dto.verifiedBy || existing.verifiedBy,
        itemsToPick: dto.itemsPicked ? (dto.itemsPicked as any) : existing.itemsToPick,
        pickedAt: isStaged ? new Date() : existing.pickedAt,
      },
    });

    if (isStaged) {
      await this.auditLogService.logAction({
        userId: userId || 'SYSTEM',
        action: AuditAction.ORDER_PICKED,
        entityName: 'SalesOrderFulfillment',
        entityId: updated.id,
        details: {
          pickListNumber: updated.pickListNumber,
          salesOrderNumber: updated.salesOrderNumber,
          stagingBay: updated.stagingBay,
          verifiedBy: updated.verifiedBy,
        },
        severity: AuditSeverity.INFO,
      });
    }

    return updated;
  }

  /**
   * Staging bays queue and capacity summary
   */
  async getStagingSummary() {
    const orders = await this.prisma.salesOrderFulfillment.findMany();

    const queued = orders.filter((o) => o.status === PickingStatus.QUEUED).length;
    const picking = orders.filter((o) => o.status === PickingStatus.PICKING).length;
    const staged = orders.filter((o) => o.status === PickingStatus.STAGED).length;
    const loaded = orders.filter((o) => o.status === PickingStatus.LOADED).length;

    return {
      totalOrders: orders.length,
      queued,
      picking,
      staged,
      loaded,
    };
  }
}

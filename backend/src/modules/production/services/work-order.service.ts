import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateWorkOrderDto,
  UpdateWorkOrderStatusDto,
  CreateBatchDto,
  ControlBatchDto,
  UpdateMilestoneDto,
} from '../dto/work-order.dto';
import {
  AuditAction,
  AuditSeverity,
  WorkOrderStatus,
  ProductionBatchStatus,
} from '@prisma/client';

@Injectable()
export class WorkOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all work orders with BOM details and active batches
   */
  async getWorkOrders(status?: WorkOrderStatus) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.workOrder.findMany({
      where,
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        bom: {
          include: { routings: { orderBy: { stepNumber: 'asc' } } },
        },
        batches: {
          orderBy: { createdAt: 'desc' },
        },
        wipStocks: true,
        scrapLogs: true,
      },
    });
  }

  /**
   * Create new Work Order
   */
  async createWorkOrder(dto: CreateWorkOrderDto, adminUserId?: string) {
    const bom = await this.prisma.billOfMaterials.findUnique({
      where: { id: dto.bomId },
    });
    if (!bom) throw new NotFoundException('Bill of Materials (BOM) not found.');

    const count = await this.prisma.workOrder.count();
    const orderNumber = dto.orderNumber || `WO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Default milestones if not provided
    const milestones = dto.milestones || [
      { milestoneName: '1. Raw Material Kitting & Staging', targetDate: new Date().toISOString(), isCompleted: false, completionPercentage: 0 },
      { milestoneName: '2. Primary CNC Precision Machining', targetDate: new Date().toISOString(), isCompleted: false, completionPercentage: 0 },
      { milestoneName: '3. Robotic Sub-Assembly & Welding', targetDate: new Date().toISOString(), isCompleted: false, completionPercentage: 0 },
      { milestoneName: '4. Final Inspection & CMM Verification', targetDate: dto.dueDate, isCompleted: false, completionPercentage: 0 },
    ];

    const workOrder = await this.prisma.workOrder.create({
      data: {
        orderNumber,
        bomId: dto.bomId,
        targetQuantity: dto.targetQuantity,
        dueDate: new Date(dto.dueDate),
        assignedLineNumber: dto.assignedLineNumber || 1,
        assignedSupervisor: dto.assignedSupervisor || 'Shift Lead Vance',
        status: WorkOrderStatus.PLANNED,
        milestones: milestones as any,
      },
      include: {
        bom: true,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.CREATE,
      entity: 'WORK_ORDER',
      entityId: workOrder.id,
      details: `Created Work Order ${workOrder.orderNumber} for ${workOrder.targetQuantity} units of SKU ${bom.sku}`,
      severity: AuditSeverity.INFO,
    });

    return workOrder;
  }

  /**
   * Update Work Order Execution Status
   */
  async updateWorkOrderStatus(dto: UpdateWorkOrderStatusDto, adminUserId?: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: dto.workOrderId },
    });
    if (!workOrder) throw new NotFoundException('Work Order not found.');

    const updated = await this.prisma.workOrder.update({
      where: { id: dto.workOrderId },
      data: {
        status: dto.status,
        completedDate: dto.status === WorkOrderStatus.COMPLETED ? new Date() : undefined,
        startDate: dto.status === WorkOrderStatus.IN_PROGRESS && !workOrder.startDate ? new Date() : undefined,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: dto.status === WorkOrderStatus.IN_PROGRESS ? AuditAction.WORK_ORDER_START : AuditAction.UPDATE,
      entity: 'WORK_ORDER',
      entityId: workOrder.id,
      details: `Work Order ${workOrder.orderNumber} status changed from ${workOrder.status} to ${dto.status}. Notes: ${dto.notes || 'None'}`,
      severity: dto.status === WorkOrderStatus.QUALITY_HOLD ? AuditSeverity.WARNING : AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Launch new Production Batch under a Work Order
   */
  async createBatch(dto: CreateBatchDto, adminUserId?: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: dto.workOrderId },
    });
    if (!workOrder) throw new NotFoundException('Work Order not found.');

    const batchCount = await this.prisma.productionBatch.count({
      where: { workOrderId: dto.workOrderId },
    });
    const batchNumber = dto.batchNumber || `BATCH-${workOrder.orderNumber}-${String.fromCharCode(65 + batchCount)}1`;

    const batch = await this.prisma.productionBatch.create({
      data: {
        batchNumber,
        workOrderId: dto.workOrderId,
        plannedUnits: dto.plannedUnits,
        currentStation: dto.currentStation || 'Station 01 - Material Ingest',
        operatorId: dto.operatorId || 'OP-TECH-01',
        status: ProductionBatchStatus.QUEUED,
      },
    });

    return batch;
  }

  /**
   * Start, Pause, Complete, or Reject Production Batch
   */
  async controlBatch(dto: ControlBatchDto, adminUserId?: string) {
    const batch = await this.prisma.productionBatch.findUnique({
      where: { id: dto.batchId },
      include: { workOrder: true },
    });
    if (!batch) throw new NotFoundException('Production batch not found.');

    let newStatus: ProductionBatchStatus = batch.status;
    let startTime = batch.startTime;
    let endTime = batch.endTime;

    if (dto.action === 'START') {
      newStatus = ProductionBatchStatus.ACTIVE;
      if (!startTime) startTime = new Date();

      // Ensure work order status moves to IN_PROGRESS
      if (batch.workOrder.status === WorkOrderStatus.PLANNED) {
        await this.prisma.workOrder.update({
          where: { id: batch.workOrderId },
          data: { status: WorkOrderStatus.IN_PROGRESS, startDate: new Date() },
        });
      }
    } else if (dto.action === 'PAUSE') {
      newStatus = ProductionBatchStatus.INTERRUPTED;
    } else if (dto.action === 'COMPLETE') {
      newStatus = ProductionBatchStatus.COMPLETED;
      endTime = new Date();

      const produced = dto.producedUnits || batch.plannedUnits;
      // Increment completed units on work order
      const updatedWO = await this.prisma.workOrder.update({
        where: { id: batch.workOrderId },
        data: {
          completedQuantity: { increment: produced },
        },
      });

      if (updatedWO.completedQuantity >= updatedWO.targetQuantity) {
        await this.prisma.workOrder.update({
          where: { id: batch.workOrderId },
          data: { status: WorkOrderStatus.COMPLETED, completedDate: new Date() },
        });
      }
    } else if (dto.action === 'REJECT') {
      newStatus = ProductionBatchStatus.REJECTED;
      const defective = dto.defectiveUnits || batch.plannedUnits;
      await this.prisma.workOrder.update({
        where: { id: batch.workOrderId },
        data: { scrapQuantity: { increment: defective } },
      });
    }

    const updatedBatch = await this.prisma.productionBatch.update({
      where: { id: batch.id },
      data: {
        status: newStatus,
        startTime,
        endTime,
        producedUnits: dto.producedUnits !== undefined ? dto.producedUnits : batch.producedUnits,
        defectiveUnits: dto.defectiveUnits !== undefined ? dto.defectiveUnits : batch.defectiveUnits,
        notes: dto.notes ? `${batch.notes || ''} | ${dto.notes}` : batch.notes,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.BATCH_STATUS_UPDATE,
      entity: 'PRODUCTION_BATCH',
      entityId: batch.id,
      details: `Batch ${batch.batchNumber} transitioned to ${newStatus} (Action: ${dto.action})`,
      severity: dto.action === 'REJECT' ? AuditSeverity.WARNING : AuditSeverity.INFO,
    });

    return updatedBatch;
  }

  /**
   * Update manufacturing milestone on a Work Order
   */
  async updateMilestone(dto: UpdateMilestoneDto, adminUserId?: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: dto.workOrderId },
    });
    if (!workOrder) throw new NotFoundException('Work Order not found.');

    const milestones = (workOrder.milestones as any[]) || [];
    if (dto.milestoneIndex >= 0 && dto.milestoneIndex < milestones.length) {
      milestones[dto.milestoneIndex].isCompleted = dto.isCompleted;
      milestones[dto.milestoneIndex].completionPercentage = dto.completionPercentage;
    }

    return this.prisma.workOrder.update({
      where: { id: dto.workOrderId },
      data: { milestones: milestones as any },
    });
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateRequisitionDto,
  IssueRequisitionDto,
  UpdateWipStageDto,
} from '../dto/material-requisition.dto';
import {
  AuditAction,
  AuditSeverity,
  RequisitionStatus,
} from '@prisma/client';

@Injectable()
export class MaterialRequisitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all material requisitions
   */
  async getRequisitions() {
    return this.prisma.materialRequisition.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        workOrder: {
          include: { bom: true },
        },
      },
    });
  }

  /**
   * Request raw components from warehouse for a Work Order
   */
  async createRequisition(dto: CreateRequisitionDto, requesterUserId?: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: dto.workOrderId },
    });
    if (!workOrder) throw new NotFoundException('Work Order not found.');

    const count = await this.prisma.materialRequisition.count();
    const requisitionNumber = `REQ-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const requisition = await this.prisma.materialRequisition.create({
      data: {
        requisitionNumber,
        workOrderId: dto.workOrderId,
        requestedItems: dto.requestedItems as any,
        status: RequisitionStatus.REQUESTED,
        requestedBy: requesterUserId || 'Floor Supervisor Vance',
      },
    });

    return requisition;
  }

  /**
   * Warehouse issues raw components to floor
   */
  async issueRequisition(dto: IssueRequisitionDto, warehouseUserId?: string) {
    const req = await this.prisma.materialRequisition.findUnique({
      where: { id: dto.requisitionId },
      include: { workOrder: true },
    });
    if (!req) throw new NotFoundException('Requisition not found.');
    if (req.status === RequisitionStatus.ISSUED) {
      throw new BadRequestException('Requisition has already been issued.');
    }

    const updated = await this.prisma.materialRequisition.update({
      where: { id: dto.requisitionId },
      data: {
        issuedItems: dto.issuedItems as any,
        status: RequisitionStatus.ISSUED,
        issuedBy: warehouseUserId || 'Inventory Lead Rodriguez',
        issuedAt: new Date(),
      },
    });

    // Automatically create or increment WIP stage inventory
    await this.prisma.workInProgressStock.upsert({
      where: {
        id: `${req.workOrderId}-Station-01`,
      },
      create: {
        id: `${req.workOrderId}-Station-01`,
        workOrderId: req.workOrderId,
        stationName: 'Station 01 - Material Ingest & Staging',
        stageUnits: req.workOrder.targetQuantity,
        holdingLocation: 'Floor Buffer A',
      },
      update: {
        stageUnits: { increment: req.workOrder.targetQuantity },
      },
    });

    await this.auditLogService.log({
      userId: warehouseUserId,
      action: AuditAction.REQUISITION_ISSUED,
      entity: 'MATERIAL_REQUISITION',
      entityId: req.id,
      details: `Issued material requisition ${req.requisitionNumber} for WO ${req.workOrder.orderNumber}`,
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Track Work-In-Progress (WIP) stock between manufacturing stages
   */
  async updateWipStage(dto: UpdateWipStageDto) {
    const existing = await this.prisma.workInProgressStock.findFirst({
      where: {
        workOrderId: dto.workOrderId,
        stationName: dto.stationName,
      },
    });

    if (existing) {
      return this.prisma.workInProgressStock.update({
        where: { id: existing.id },
        data: {
          stageUnits: { increment: dto.stageUnitsDelta },
          holdingLocation: dto.holdingLocation,
          hasQualityHold: dto.hasQualityHold !== undefined ? dto.hasQualityHold : existing.hasQualityHold,
          qualityNotes: dto.qualityNotes !== undefined ? dto.qualityNotes : existing.qualityNotes,
        },
      });
    }

    return this.prisma.workInProgressStock.create({
      data: {
        workOrderId: dto.workOrderId,
        stationName: dto.stationName,
        stageUnits: Math.max(0, dto.stageUnitsDelta),
        holdingLocation: dto.holdingLocation,
        hasQualityHold: dto.hasQualityHold || false,
        qualityNotes: dto.qualityNotes,
      },
    });
  }

  /**
   * List all current WIP stocks across factory floor
   */
  async getWipInventory() {
    return this.prisma.workInProgressStock.findMany({
      include: {
        workOrder: {
          include: { bom: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}

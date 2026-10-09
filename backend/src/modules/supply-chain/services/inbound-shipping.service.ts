import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateInboundShipmentDto,
  UpdateShipmentMilestoneDto,
  QueryInboundShipmentDto,
} from '../dto/inbound-shipping.dto';
import {
  AuditAction,
  AuditSeverity,
  ShipmentMilestone,
} from '@prisma/client';

@Injectable()
export class InboundShippingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List inbound shipments
   */
  async getShipments(query: QueryInboundShipmentDto) {
    const { milestone, transportMode, vendorId, search, limit = 50, offset = 0 } = query;
    const where: any = {};

    if (milestone) {
      where.currentMilestone = milestone;
    }

    if (transportMode) {
      where.transportMode = transportMode;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (search) {
      where.OR = [
        { shipmentTrackingNumber: { contains: search, mode: 'insensitive' } },
        { carrierName: { contains: search, mode: 'insensitive' } },
        { freightForwarder: { contains: search, mode: 'insensitive' } },
        { originPortCity: { contains: search, mode: 'insensitive' } },
        { containerOrWaybillNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.inboundShipmentCoordination.count({ where }),
      this.prisma.inboundShipmentCoordination.findMany({
        where,
        include: {
          vendor: {
            select: { id: true, vendorCode: true, companyName: true, city: true },
          },
          po: {
            select: { id: true, poNumber: true, totalAmount: true },
          },
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { estimatedArrivalDate: 'asc' },
      }),
    ]);

    return { total, items };
  }

  /**
   * Get shipment by ID
   */
  async getShipmentById(id: string) {
    const shipment = await this.prisma.inboundShipmentCoordination.findUnique({
      where: { id },
      include: {
        vendor: true,
        po: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found.`);
    }

    return shipment;
  }

  /**
   * Register a new inbound supplier shipment
   */
  async createShipment(dto: CreateInboundShipmentDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.inboundShipmentCoordination.findUnique({
      where: { shipmentTrackingNumber: dto.shipmentTrackingNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Shipment tracking ${dto.shipmentTrackingNumber} already exists.`,
      );
    }

    const initialMilestones = [
      {
        milestone: ShipmentMilestone.BOOKED,
        timestamp: new Date().toISOString(),
        location: dto.originPortCity,
        remarks: 'Shipment booking confirmed with carrier.',
      },
    ];

    const shipment = await this.prisma.inboundShipmentCoordination.create({
      data: {
        shipmentTrackingNumber: dto.shipmentTrackingNumber,
        poId: dto.poId,
        vendorId: dto.vendorId,
        carrierName: dto.carrierName,
        freightForwarder: dto.freightForwarder,
        transportMode: dto.transportMode,
        originPortCity: dto.originPortCity,
        destinationPlantCity: dto.destinationPlantCity,
        dispatchDate: new Date(dto.dispatchDate),
        estimatedArrivalDate: new Date(dto.estimatedArrivalDate),
        currentMilestone: ShipmentMilestone.BOOKED,
        trackingMilestonesJson: initialMilestones as any,
        containerOrWaybillNumber: dto.containerOrWaybillNumber,
        driverOrVesselInfo: dto.driverOrVesselInfo,
        totalWeightKg: dto.totalWeightKg,
        estimatedFreightCost: dto.estimatedFreightCost,
        delayRisk: dto.delayRisk,
        routeNotes: dto.routeNotes,
      },
      include: {
        vendor: true,
        po: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.INBOUND_SHIPMENT_DISPATCHED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        shipmentId: shipment.id,
        trackingNumber: shipment.shipmentTrackingNumber,
        carrier: shipment.carrierName,
        origin: shipment.originPortCity,
      },
    });

    return shipment;
  }

  /**
   * Update shipment transit milestone
   */
  async updateMilestone(
    id: string,
    dto: UpdateShipmentMilestoneDto,
    userId: string = 'SYSTEM',
  ) {
    const shipment = await this.getShipmentById(id);

    const existingMilestones = (shipment.trackingMilestonesJson as any[]) || [];
    const newMilestoneEntry = {
      milestone: dto.milestone,
      timestamp: new Date().toISOString(),
      location: dto.location,
      remarks: dto.remarks || '',
    };

    const updatedMilestones = [...existingMilestones, newMilestoneEntry];

    const updateData: any = {
      currentMilestone: dto.milestone,
      trackingMilestonesJson: updatedMilestones as any,
    };

    if (dto.delayRisk) {
      updateData.delayRisk = dto.delayRisk;
    }

    if (dto.delayReason) {
      updateData.delayReason = dto.delayReason;
    }

    if (dto.actualArrivalDate || dto.milestone === ShipmentMilestone.DELIVERED_AT_DOCK) {
      updateData.actualArrivalDate = dto.actualArrivalDate
        ? new Date(dto.actualArrivalDate)
        : new Date();
    }

    const updated = await this.prisma.inboundShipmentCoordination.update({
      where: { id: shipment.id },
      data: updateData,
      include: {
        vendor: true,
        po: true,
      },
    });

    if (dto.milestone === ShipmentMilestone.DELIVERED_AT_DOCK) {
      await this.auditLogService.logAction({
        action: AuditAction.INBOUND_SHIPMENT_DELIVERED,
        severity: AuditSeverity.INFO,
        userId,
        details: {
          shipmentId: updated.id,
          trackingNumber: updated.shipmentTrackingNumber,
          deliveredAt: updated.actualArrivalDate,
        },
      });
    }

    return updated;
  }
}

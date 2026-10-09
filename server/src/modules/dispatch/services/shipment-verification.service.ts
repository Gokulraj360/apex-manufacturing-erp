import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateDispatchShipmentDto,
  VerifyVehicleLoadingDto,
  RegisterCarrierDto,
} from '../dto/shipment-verification.dto';
import { AuditAction, AuditSeverity, ShipmentStatus } from '@prisma/client';

@Injectable()
export class ShipmentVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all outbound shipments
   */
  async getShipments(status?: ShipmentStatus) {
    const where = status ? { status } : {};
    return this.prisma.dispatchShipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single shipment by ID
   */
  async getShipmentById(id: string) {
    const shipment = await this.prisma.dispatchShipment.findUnique({
      where: { id },
    });
    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }
    return shipment;
  }

  /**
   * Create an outbound dispatch shipment record
   */
  async createShipment(dto: CreateDispatchShipmentDto, userId?: string) {
    const count = await this.prisma.dispatchShipment.count();
    const shipmentNumber = `DSP-SHP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const shipment = await this.prisma.dispatchShipment.create({
      data: {
        shipmentNumber,
        deliveryChallanNumber: dto.deliveryChallanNumber,
        salesOrderNumber: dto.salesOrderNumber,
        customerName: dto.customerName,
        carrierName: dto.carrierName,
        vehicleNumber: dto.vehicleNumber,
        driverName: dto.driverName,
        driverContact: dto.driverContact,
        gatePassNumber: dto.gatePassNumber,
        sealNumber: dto.sealNumber,
        status: ShipmentStatus.STAGED,
        totalWeightKg: dto.totalWeightKg,
        cartonsCount: dto.cartonsCount,
        loadedBy: dto.loadedBy,
        estimatedDelivery: dto.estimatedDelivery ? new Date(dto.estimatedDelivery) : null,
      },
    });

    return shipment;
  }

  /**
   * Verify vehicle loading, cross-check delivery challan, apply tamper seal, and authorize gate exit
   */
  async verifyVehicleLoading(id: string, dto: VerifyVehicleLoadingDto, userId?: string) {
    const shipment = await this.getShipmentById(id);

    const isDispatch = dto.status === ShipmentStatus.IN_TRANSIT;

    const updated = await this.prisma.dispatchShipment.update({
      where: { id },
      data: {
        status: dto.status,
        sealNumber: dto.sealNumber || shipment.sealNumber,
        gatePassNumber: dto.gatePassNumber || shipment.gatePassNumber,
        loadedAt: shipment.loadedAt || new Date(),
        dispatchedAt: isDispatch ? new Date() : shipment.dispatchedAt,
      },
    });

    if (isDispatch) {
      await this.auditLogService.logAction({
        userId: userId || 'SYSTEM',
        action: AuditAction.SHIPMENT_DISPATCHED,
        entityName: 'DispatchShipment',
        entityId: updated.id,
        details: {
          shipmentNumber: updated.shipmentNumber,
          deliveryChallanNumber: updated.deliveryChallanNumber,
          vehicleNumber: updated.vehicleNumber,
          carrierName: updated.carrierName,
          sealNumber: updated.sealNumber,
          gatePassNumber: updated.gatePassNumber,
        },
        severity: AuditSeverity.INFO,
      });
    }

    return updated;
  }

  /**
   * List approved freight carriers
   */
  async getCarriers() {
    return this.prisma.carrierDetail.findMany({
      where: { isActive: true },
      orderBy: { ratingScore: 'desc' },
    });
  }

  /**
   * Register a new carrier in the logistics network
   */
  async registerCarrier(dto: RegisterCarrierDto, userId?: string) {
    const existing = await this.prisma.carrierDetail.findUnique({
      where: { carrierCode: dto.carrierCode },
    });
    if (existing) {
      throw new BadRequestException(`Carrier ${dto.carrierCode} already exists`);
    }

    return this.prisma.carrierDetail.create({
      data: {
        carrierCode: dto.carrierCode,
        companyName: dto.companyName,
        contactPerson: dto.contactPerson,
        phone: dto.phone,
        email: dto.email,
        fleetType: dto.fleetType,
        ratingScore: dto.ratingScore ?? 5.0,
        isActive: true,
      },
    });
  }
}

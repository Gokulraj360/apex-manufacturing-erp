import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateDeliveryChallanDto,
  UpdateChallanStatusDto,
} from '../dto/dispatch.dto';
import { AuditAction, AuditSeverity, ChallanStatus } from '@prisma/client';

@Injectable()
export class DispatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all delivery challans
   */
  async getDeliveryChallans() {
    return this.prisma.deliveryChallan.findMany({
      orderBy: { dispatchDate: 'desc' },
    });
  }

  /**
   * Create an Outbound Delivery Challan
   */
  async createDeliveryChallan(dto: CreateDeliveryChallanDto, user?: string) {
    const count = await this.prisma.deliveryChallan.count();
    const challanNumber = `DC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const challan = await this.prisma.deliveryChallan.create({
      data: {
        challanNumber,
        clientName: dto.clientName,
        salesOrderRef: dto.salesOrderRef,
        carrierName: dto.carrierName,
        vehicleNumber: dto.vehicleNumber,
        trackingNumber: dto.trackingNumber || `TRK-FEDEX-${Math.floor(100000 + Math.random() * 900000)}`,
        driverContact: dto.driverContact,
        dispatchedItems: dto.dispatchedItems as any,
        totalWeightKg: dto.totalWeightKg,
        preparedBy: user || 'Dispatch Lead Harris',
        status: ChallanStatus.PICKING,
      },
    });

    return challan;
  }

  /**
   * Transition Challan Status (PICKING -> PACKED -> DISPATCHED)
   */
  async updateChallanStatus(dto: UpdateChallanStatusDto, user?: string) {
    const challan = await this.prisma.deliveryChallan.findUnique({
      where: { challanNumber: dto.challanNumber },
    });
    if (!challan) throw new NotFoundException('Delivery challan not found.');

    // If dispatching, decrement finished goods inventory
    if (dto.status === ChallanStatus.DISPATCHED && challan.status !== ChallanStatus.DISPATCHED) {
      const items = (challan.dispatchedItems as any[]) || [];
      for (const item of items) {
        const stock = await this.prisma.warehouseStock.findUnique({
          where: { itemCode: item.itemCode },
        });

        if (stock) {
          await this.prisma.warehouseStock.update({
            where: { itemCode: item.itemCode },
            data: {
              currentQuantity: { decrement: item.quantityDispatched },
            },
          });
        }
      }
    }

    const updated = await this.prisma.deliveryChallan.update({
      where: { challanNumber: dto.challanNumber },
      data: {
        status: dto.status,
        verifiedBy: user || challan.verifiedBy,
      },
    });

    if (dto.status === ChallanStatus.DISPATCHED) {
      await this.auditLogService.log({
        userId: user,
        action: AuditAction.DELIVERY_CHALLAN_DISPATCHED,
        entity: 'DELIVERY_CHALLAN',
        entityId: challan.id,
        details: `Dispatched Delivery Challan ${challan.challanNumber} for ${challan.clientName} (Carrier: ${challan.carrierName}, Tracking: ${challan.trackingNumber})`,
        severity: AuditSeverity.INFO,
      });
    }

    return updated;
  }
}

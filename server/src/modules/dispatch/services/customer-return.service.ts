import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateCustomerReturnDto,
  UpdateReturnDispositionDto,
  LogTransitDamageDto,
} from '../dto/customer-return.dto';
import { AuditAction, AuditSeverity, ReturnDisposition } from '@prisma/client';

@Injectable()
export class CustomerReturnService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all RMA customer return tickets
   */
  async getReturns() {
    return this.prisma.customerReturn.findMany({
      orderBy: { receivedAt: 'desc' },
    });
  }

  /**
   * Create an incoming customer return (RMA)
   */
  async createReturn(dto: CreateCustomerReturnDto, userId?: string) {
    const count = await this.prisma.customerReturn.count();
    const rmaNumber = `RMA-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const returnRecord = await this.prisma.customerReturn.create({
      data: {
        rmaNumber,
        salesOrderRef: dto.salesOrderRef,
        deliveryChallanRef: dto.deliveryChallanRef,
        customerName: dto.customerName,
        itemCode: dto.itemCode,
        itemName: dto.itemName,
        returnedQuantity: dto.returnedQuantity,
        returnReason: dto.returnReason,
        disposition: (dto.disposition as ReturnDisposition) || ReturnDisposition.UNDER_INSPECTION,
        replacementOrderRef: dto.replacementOrderRef,
        inspectedBy: dto.inspectedBy,
        resolutionNotes: dto.resolutionNotes,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.CUSTOMER_RETURN_PROCESSED,
      entityName: 'CustomerReturn',
      entityId: returnRecord.id,
      details: {
        rmaNumber,
        customerName: dto.customerName,
        itemCode: dto.itemCode,
        returnedQuantity: dto.returnedQuantity,
        disposition: returnRecord.disposition,
      },
      severity: AuditSeverity.WARNING,
    });

    return returnRecord;
  }

  /**
   * Update RMA disposition after receiving inspection
   */
  async updateDisposition(id: string, dto: UpdateReturnDispositionDto, userId?: string) {
    const existing = await this.prisma.customerReturn.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`RMA ${id} not found`);
    }

    const updated = await this.prisma.customerReturn.update({
      where: { id },
      data: {
        disposition: dto.disposition as ReturnDisposition,
        resolutionNotes: dto.resolutionNotes,
        replacementOrderRef: dto.replacementOrderRef || existing.replacementOrderRef,
      },
    });

    return updated;
  }

  /**
   * List transit damage logs
   */
  async getTransitDamages() {
    return this.prisma.transitDamageLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Log an in-transit damage incident for carrier liability & insurance claim
   */
  async logTransitDamage(dto: LogTransitDamageDto, userId?: string) {
    const count = await this.prisma.transitDamageLog.count();
    const damageClaimNumber = `TDMG-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const log = await this.prisma.transitDamageLog.create({
      data: {
        damageClaimNumber,
        shipmentNumber: dto.shipmentNumber,
        carrierName: dto.carrierName,
        itemCode: dto.itemCode,
        damagedQuantity: dto.damagedQuantity,
        lossAmount: dto.lossAmount,
        carrierLiabilityAccepted: dto.carrierLiabilityAccepted,
        insuranceClaimNumber: dto.insuranceClaimNumber,
        damageDescription: dto.damageDescription,
        loggedBy: dto.loggedBy,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.TRANSIT_DAMAGE_LOGGED,
      entityName: 'TransitDamageLog',
      entityId: log.id,
      details: {
        damageClaimNumber,
        shipmentNumber: dto.shipmentNumber,
        carrierName: dto.carrierName,
        damagedQuantity: dto.damagedQuantity,
        lossAmount: dto.lossAmount,
      },
      severity: AuditSeverity.CRITICAL,
    });

    return log;
  }
}

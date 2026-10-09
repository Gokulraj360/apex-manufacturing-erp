import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateInboundTransportCheckDto,
  CompleteWeighbridgeTareDto,
} from '../dto/inbound-transport.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class InboundLogisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all inbound transport verification checks
   */
  async getChecks(verified?: boolean) {
    const where: any = {};
    if (verified !== undefined) where.isDocumentVerified = verified;

    return this.prisma.inboundTransportCheck.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single inbound transport check by ID
   */
  async getCheckById(id: string) {
    const check = await this.prisma.inboundTransportCheck.findUnique({
      where: { id },
    });
    if (!check) {
      throw new NotFoundException(`Inbound check ${id} not found`);
    }
    return check;
  }

  /**
   * Cross-check inbound transport documents against PO & record gross weighbridge reading
   */
  async createInboundCheck(dto: CreateInboundTransportCheckDto, userId?: string) {
    const count = await this.prisma.inboundTransportCheck.count();
    const checkNumber = `INB-CHK-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    // Verify PO reference exists
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { poNumber: dto.poNumber },
    });

    const isDocumentVerified = !!po;

    const check = await this.prisma.inboundTransportCheck.create({
      data: {
        checkNumber,
        vehicleNumber: dto.vehicleNumber,
        poNumber: dto.poNumber,
        supplierName: dto.supplierName,
        transporterName: dto.transporterName,
        eWayBillNumber: dto.eWayBillNumber,
        supplierChallanNumber: dto.supplierChallanNumber,
        declaredWeightKg: dto.declaredWeightKg,
        weighbridgeGrossKg: dto.weighbridgeGrossKg,
        isDocumentVerified,
        dockAssigned: dto.dockAssigned || 'Dock 01 - Bulk Raw Materials',
        verifiedBy: dto.verifiedBy,
        verifiedAt: new Date(),
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.INBOUND_TRANSPORT_VERIFIED,
      entityName: 'InboundTransportCheck',
      entityId: check.id,
      details: {
        checkNumber,
        poNumber: dto.poNumber,
        vehicleNumber: dto.vehicleNumber,
        weighbridgeGrossKg: dto.weighbridgeGrossKg,
        isDocumentVerified,
      },
      severity: isDocumentVerified ? AuditSeverity.INFO : AuditSeverity.WARNING,
    });

    return check;
  }

  /**
   * Record empty tare weight on outbound gate exit to compute certified net payload
   */
  async completeWeighbridgeTare(id: string, dto: CompleteWeighbridgeTareDto, userId?: string) {
    const check = await this.getCheckById(id);

    const netWeight = check.weighbridgeGrossKg - dto.weighbridgeTareKg;

    const updated = await this.prisma.inboundTransportCheck.update({
      where: { id },
      data: {
        weighbridgeTareKg: dto.weighbridgeTareKg,
        netWeightKg: netWeight,
        isWeighbridgeCleared: true,
      },
    });

    return updated;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CreateOutboundGateClearanceDto } from '../dto/outbound-gate.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class OutboundGateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all outbound gate exit clearances
   */
  async getClearances() {
    return this.prisma.outboundGateClearance.findMany({
      orderBy: { clearedAt: 'desc' },
    });
  }

  /**
   * Get clearance record by ID
   */
  async getClearanceById(id: string) {
    const clearance = await this.prisma.outboundGateClearance.findUnique({
      where: { id },
    });
    if (!clearance) {
      throw new NotFoundException(`Outbound clearance ${id} not found`);
    }
    return clearance;
  }

  /**
   * Authorize outbound vehicle departure after verifying Delivery Challan and physical load
   */
  async createClearance(dto: CreateOutboundGateClearanceDto, userId?: string) {
    const count = await this.prisma.outboundGateClearance.count();
    const clearanceNumber = `OUT-CLR-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const clearance = await this.prisma.outboundGateClearance.create({
      data: {
        clearanceNumber,
        deliveryChallanNumber: dto.deliveryChallanNumber,
        vehicleNumber: dto.vehicleNumber,
        driverName: dto.driverName,
        transporterName: dto.transporterName,
        destinationCity: dto.destinationCity,
        securitySealNumber: dto.securitySealNumber,
        gatePassNumber: dto.gatePassNumber,
        isChallanMatched: dto.isChallanMatched ?? true,
        isPhysicalLoadVerified: dto.isPhysicalLoadVerified ?? true,
        clearedAt: new Date(),
        clearedByOfficer: dto.clearedByOfficer,
        remarks: dto.remarks,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.OUTBOUND_GATE_CLEARED,
      entityName: 'OutboundGateClearance',
      entityId: clearance.id,
      details: {
        clearanceNumber,
        deliveryChallanNumber: dto.deliveryChallanNumber,
        vehicleNumber: dto.vehicleNumber,
        securitySealNumber: dto.securitySealNumber,
        clearedByOfficer: dto.clearedByOfficer,
      },
      severity: AuditSeverity.INFO,
    });

    return clearance;
  }
}

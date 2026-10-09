import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateSpecialGatePassDto,
  VerifySpecialGatePassReturnDto,
} from '../dto/special-gate-pass.dto';
import { AuditAction, AuditSeverity, GatePassType } from '@prisma/client';

@Injectable()
export class SpecialGatePassService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all special material gate passes
   */
  async getPasses(passType?: GatePassType, isReturned?: boolean) {
    const where: any = {};
    if (passType) where.passType = passType;
    if (isReturned !== undefined) where.isReturned = isReturned;

    return this.prisma.specialGatePass.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single pass by ID
   */
  async getPassById(id: string) {
    const pass = await this.prisma.specialGatePass.findUnique({
      where: { id },
    });
    if (!pass) {
      throw new NotFoundException(`Special gate pass ${id} not found`);
    }
    return pass;
  }

  /**
   * Issue special gate pass for repairs, scrap disposal, or returnable packaging
   */
  async createPass(dto: CreateSpecialGatePassDto, userId?: string) {
    const count = await this.prisma.specialGatePass.count();
    const passNumber = `SGP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const pass = await this.prisma.specialGatePass.create({
      data: {
        passNumber,
        passType: dto.passType as GatePassType,
        itemDescription: dto.itemDescription,
        serialPartNumbers: dto.serialPartNumbers,
        quantity: dto.quantity,
        vendorRecipient: dto.vendorRecipient,
        purposeReason: dto.purposeReason,
        isReturnable: dto.isReturnable,
        expectedReturnDate: dto.expectedReturnDate ? new Date(dto.expectedReturnDate) : null,
        authorizedBy: dto.authorizedBy,
        gateExitTime: new Date(),
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.SPECIAL_GATE_PASS_ISSUED,
      entityName: 'SpecialGatePass',
      entityId: pass.id,
      details: {
        passNumber,
        passType: dto.passType,
        itemDescription: dto.itemDescription,
        quantity: dto.quantity,
        isReturnable: dto.isReturnable,
        authorizedBy: dto.authorizedBy,
      },
      severity: dto.isReturnable ? AuditSeverity.INFO : AuditSeverity.WARNING,
    });

    return pass;
  }

  /**
   * Security verification of returned tools/equipment/packaging
   */
  async verifyReturn(id: string, dto: VerifySpecialGatePassReturnDto, userId?: string) {
    const existing = await this.getPassById(id);

    const updated = await this.prisma.specialGatePass.update({
      where: { id },
      data: {
        isReturned: true,
        actualReturnedDate: dto.actualReturnedDate ? new Date(dto.actualReturnedDate) : new Date(),
        gateReturnTime: new Date(),
        verifiedBySecurity: dto.verifiedBySecurity,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.SPECIAL_GATE_PASS_RETURNED,
      entityName: 'SpecialGatePass',
      entityId: updated.id,
      details: {
        passNumber: updated.passNumber,
        verifiedBySecurity: dto.verifiedBySecurity,
        actualReturnedDate: updated.actualReturnedDate,
      },
      severity: AuditSeverity.INFO,
    });

    return updated;
  }
}

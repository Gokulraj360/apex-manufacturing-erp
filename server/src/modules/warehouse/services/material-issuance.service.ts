import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { IssueMaterialsToProductionDto } from '../dto/material-issuance.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class MaterialIssuanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all material issuances to shop floor
   */
  async getIssuances() {
    return this.prisma.materialIssuance.findMany({
      orderBy: { issuedAt: 'desc' },
    });
  }

  /**
   * Issue raw materials to production floor and decrement warehouse stock
   */
  async issueMaterials(dto: IssueMaterialsToProductionDto, user?: string) {
    const count = await this.prisma.materialIssuance.count();
    const issuanceNumber = `ISS-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Atomically decrement stock from each bin
    await this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        const stock = await tx.warehouseStock.findUnique({
          where: { itemCode: item.itemCode },
        });

        if (!stock) {
          throw new NotFoundException(`Stock item ${item.itemCode} not found in warehouse.`);
        }

        if (stock.currentQuantity < item.quantityIssued) {
          throw new BadRequestException(
            `Insufficient warehouse stock for ${item.itemCode}. Available: ${stock.currentQuantity}, Requested: ${item.quantityIssued}`,
          );
        }

        await tx.warehouseStock.update({
          where: { itemCode: item.itemCode },
          data: {
            currentQuantity: { decrement: item.quantityIssued },
          },
        });
      }

      await tx.materialIssuance.create({
        data: {
          issuanceNumber,
          requisitionNumber: dto.requisitionNumber,
          workOrderNumber: dto.workOrderNumber,
          issuedTo: dto.issuedTo,
          issuedBy: user || 'Warehouse Officer Chen',
          items: dto.items as any,
        },
      });
    });

    await this.auditLogService.log({
      userId: user,
      action: AuditAction.MATERIAL_ISSUED,
      entity: 'MATERIAL_ISSUANCE',
      entityId: issuanceNumber,
      details: `Issued raw materials for Work Order ${dto.workOrderNumber} (Req: ${dto.requisitionNumber}) to ${dto.issuedTo}`,
      severity: AuditSeverity.INFO,
    });

    return {
      issuanceNumber,
      status: 'ISSUED_SUCCESSFULLY',
    };
  }
}

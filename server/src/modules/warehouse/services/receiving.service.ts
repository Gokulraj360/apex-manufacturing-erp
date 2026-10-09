import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CreateGrnDto } from '../dto/receiving.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class ReceivingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all Goods Received Notes (GRN)
   */
  async getGrns() {
    return this.prisma.goodsReceivedNote.findMany({
      orderBy: { receivedDate: 'desc' },
    });
  }

  /**
   * Process incoming dock shipment and generate Goods Received Note
   */
  async createGrn(dto: CreateGrnDto, inspectorUserId?: string) {
    const count = await this.prisma.goodsReceivedNote.count();
    const grnNumber = `GRN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const po = await this.prisma.purchaseOrder.findUnique({
      where: { poNumber: dto.poNumber },
    });

    const grn = await this.prisma.goodsReceivedNote.create({
      data: {
        grnNumber,
        poId: po ? po.id : undefined,
        poNumber: dto.poNumber,
        supplierName: dto.supplierName,
        inspectedBy: inspectorUserId || 'QA Inspector Jenkins',
        inspectionPassed: dto.inspectionPassed,
        itemsReceived: dto.itemsReceived as any,
        storageBinCode: dto.storageBinCode || 'ZONE-A-RACK-01',
        vendorDeliveryChallan: dto.vendorDeliveryChallan,
        remarks: dto.remarks,
      },
    });

    // Execute automated inventory putaway increment for accepted quantities
    if (dto.inspectionPassed) {
      for (const item of dto.itemsReceived) {
        if (item.quantityAccepted > 0) {
          const stock = await this.prisma.warehouseStock.findUnique({
            where: { itemCode: item.itemCode },
          });

          if (stock) {
            await this.prisma.warehouseStock.update({
              where: { itemCode: item.itemCode },
              data: {
                currentQuantity: { increment: item.quantityAccepted },
              },
            });
          }
        }
      }
    }

    await this.auditLogService.log({
      userId: inspectorUserId,
      action: AuditAction.GRN_GENERATED,
      entity: 'GOODS_RECEIVED_NOTE',
      entityId: grn.id,
      details: `Generated GRN ${grn.grnNumber} for PO ${dto.poNumber} (${dto.supplierName}). Status: ${dto.inspectionPassed ? 'PASSED & INGESTED' : 'INSPECTION_HOLD'}`,
      severity: dto.inspectionPassed ? AuditSeverity.INFO : AuditSeverity.WARNING,
    });

    return grn;
  }
}

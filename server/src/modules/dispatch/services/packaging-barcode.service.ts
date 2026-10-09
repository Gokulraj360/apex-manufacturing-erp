import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CreatePackedCartonDto, GenerateBarcodeDto } from '../dto/packaging-barcode.dto';
import { AuditAction, AuditSeverity, BarcodeType } from '@prisma/client';

@Injectable()
export class PackagingBarcodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all packed cartons with barcode details
   */
  async getCartons(salesOrderRef?: string) {
    const where = salesOrderRef ? { salesOrderRef } : {};
    return this.prisma.packedCarton.findMany({
      where,
      include: { barcodeLabel: true },
      orderBy: { packedAt: 'desc' },
    });
  }

  /**
   * Create packed carton record and automatically generate GS1-128/Code-128 barcode
   */
  async createCarton(dto: CreatePackedCartonDto, userId?: string) {
    const cartonCount = await this.prisma.packedCarton.count();
    const cartonNumber = `CTN-${new Date().getFullYear()}-${String(cartonCount + 1).padStart(4, '0')}`;

    // Generate unique serial number and GS1 formatted string
    const serialNumber = `SN${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`;
    const barcodeString = `(01)00890123456789(21)${serialNumber}(10)${dto.lotBatchNumber}`;

    // Create Barcode record
    const barcode = await this.prisma.barcodeLabel.create({
      data: {
        barcodeString,
        symbology: (dto.barcodeSymbology as BarcodeType) || BarcodeType.GS1_128,
        serialNumber,
        skuCode: dto.itemCode,
        batchNumber: dto.lotBatchNumber,
        isApplied: true,
        qrPayload: {
          cartonNumber,
          itemCode: dto.itemCode,
          qty: dto.quantityUnits,
          weightKg: dto.grossWeightKg,
          lot: dto.lotBatchNumber,
        },
      },
    });

    // Create Packed Carton
    const carton = await this.prisma.packedCarton.create({
      data: {
        cartonNumber,
        salesOrderRef: dto.salesOrderRef,
        itemCode: dto.itemCode,
        itemName: dto.itemName,
        lotBatchNumber: dto.lotBatchNumber,
        quantityUnits: dto.quantityUnits,
        grossWeightKg: dto.grossWeightKg,
        dimensions: dto.dimensions,
        isSealed: true,
        sealedBy: dto.sealedBy,
        stagingBay: dto.stagingBay || 'STAGING-BAY-01',
        barcodeLabelId: barcode.id,
      },
      include: { barcodeLabel: true },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.CARTON_PACKED,
      entityName: 'PackedCarton',
      entityId: carton.id,
      details: {
        cartonNumber,
        barcodeString,
        itemCode: dto.itemCode,
        quantityUnits: dto.quantityUnits,
        grossWeightKg: dto.grossWeightKg,
      },
      severity: AuditSeverity.INFO,
    });

    return carton;
  }

  /**
   * Standalone barcode label generation
   */
  async generateBarcode(dto: GenerateBarcodeDto, userId?: string) {
    const barcodeString = `(01)00890123456789(21)${dto.serialNumber}(10)${dto.batchNumber}`;

    const barcode = await this.prisma.barcodeLabel.create({
      data: {
        barcodeString,
        symbology: dto.symbology,
        serialNumber: dto.serialNumber,
        skuCode: dto.skuCode,
        batchNumber: dto.batchNumber,
        isApplied: false,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.BARCODE_GENERATED,
      entityName: 'BarcodeLabel',
      entityId: barcode.id,
      details: {
        barcodeString,
        skuCode: dto.skuCode,
        symbology: dto.symbology,
      },
      severity: AuditSeverity.INFO,
    });

    return barcode;
  }

  /**
   * List all printed / active barcode labels
   */
  async getBarcodes() {
    return this.prisma.barcodeLabel.findMany({
      orderBy: { printedAt: 'desc' },
      take: 100,
    });
  }
}

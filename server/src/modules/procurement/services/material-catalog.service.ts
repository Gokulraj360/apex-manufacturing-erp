import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateMaterialCatalogItemDto,
  UpdateMaterialCatalogItemDto,
  CreateVendorContractTermsDto,
} from '../dto/material-catalog.dto';
import {
  AuditAction,
  AuditSeverity,
  ContractTermStatus,
} from '@prisma/client';

@Injectable()
export class MaterialCatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all material catalog items
   */
  async getCatalogItems(query?: {
    category?: string;
    isActive?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (query?.category) {
      where.category = { contains: query.category, mode: 'insensitive' };
    }
    if (query?.isActive !== undefined) {
      where.isActive = query.isActive;
    }
    if (query?.search) {
      where.OR = [
        { itemSku: { contains: query.search, mode: 'insensitive' } },
        { itemName: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.materialCatalog.findMany({
      where,
      orderBy: { itemSku: 'asc' },
      include: {
        contractTerms: true,
      },
    });
  }

  /**
   * Get single material catalog item by SKU
   */
  async getCatalogItemBySku(sku: string) {
    const item = await this.prisma.materialCatalog.findUnique({
      where: { itemSku: sku },
      include: {
        contractTerms: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Material SKU ${sku} not found`);
    }

    return item;
  }

  /**
   * Create material catalog entry with volume discounts and approved vendors
   */
  async createCatalogItem(dto: CreateMaterialCatalogItemDto) {
    const existing = await this.prisma.materialCatalog.findUnique({
      where: { itemSku: dto.itemSku },
    });

    if (existing) {
      throw new BadRequestException(`Material with SKU ${dto.itemSku} already exists`);
    }

    const created = await this.prisma.materialCatalog.create({
      data: {
        itemSku: dto.itemSku,
        itemName: dto.itemName,
        category: dto.category,
        description: dto.description || null,
        uom: dto.uom || 'PCS',
        basePrice: dto.basePrice,
        currency: dto.currency || 'USD',
        standardLeadTimeDays: dto.standardLeadTimeDays,
        minimumOrderQty: dto.minimumOrderQty,
        volumeDiscountTiers: dto.volumeDiscountTiers,
        approvedVendorsJson: dto.approvedVendors,
        specificationsJson: dto.specificationsJson || null,
        isActive: true,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.MATERIAL_CATALOG_UPDATED,
      AuditSeverity.INFO,
      `Material catalog item ${dto.itemSku} ("${dto.itemName}") added with base price $${dto.basePrice}`,
      'ProcurementSpecialist',
      'MaterialCatalogService',
      { itemSku: dto.itemSku, basePrice: dto.basePrice },
    );

    return created;
  }

  /**
   * Update material price, discount tiers, or lead time
   */
  async updateCatalogItem(sku: string, dto: UpdateMaterialCatalogItemDto) {
    const item = await this.getCatalogItemBySku(sku);

    const updateData: any = {};
    if (dto.basePrice !== undefined) updateData.basePrice = dto.basePrice;
    if (dto.standardLeadTimeDays !== undefined)
      updateData.standardLeadTimeDays = dto.standardLeadTimeDays;
    if (dto.minimumOrderQty !== undefined)
      updateData.minimumOrderQty = dto.minimumOrderQty;
    if (dto.volumeDiscountTiers !== undefined)
      updateData.volumeDiscountTiers = dto.volumeDiscountTiers;
    if (dto.approvedVendors !== undefined)
      updateData.approvedVendorsJson = dto.approvedVendors;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const updated = await this.prisma.materialCatalog.update({
      where: { itemSku: sku },
      data: updateData,
    });

    await this.auditLogService.logAction(
      AuditAction.MATERIAL_CATALOG_UPDATED,
      AuditSeverity.INFO,
      `Material catalog item ${sku} parameters updated`,
      'ProcurementSpecialist',
      'MaterialCatalogService',
      { itemSku: sku, updates: updateData },
    );

    return updated;
  }

  /**
   * List vendor contract terms and price lock agreements
   */
  async getContractTerms(query?: { vendorName?: string; status?: ContractTermStatus }) {
    const where: any = {};

    if (query?.vendorName) {
      where.vendorName = { contains: query.vendorName, mode: 'insensitive' };
    }
    if (query?.status) {
      where.status = query.status;
    }

    return this.prisma.vendorContractTerms.findMany({
      where,
      orderBy: { priceLockValidUntil: 'asc' },
      include: {
        materialCatalog: true,
      },
    });
  }

  /**
   * Register vendor contract terms and fixed-price lock agreements
   */
  async createContractTerms(dto: CreateVendorContractTermsDto) {
    const count = await this.prisma.vendorContractTerms.count();
    const contractRefNumber = `VCON-2026-0${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.vendorContractTerms.create({
      data: {
        contractRefNumber,
        vendorId: dto.vendorId,
        vendorName: dto.vendorName,
        materialCatalogId: dto.materialCatalogId || null,
        contractTitle: dto.contractTitle,
        fixedPeriodStart: new Date(dto.fixedPeriodStart),
        fixedPeriodEnd: new Date(dto.fixedPeriodEnd),
        agreedUnitPrice: dto.agreedUnitPrice,
        priceLockValidUntil: new Date(dto.priceLockValidUntil),
        rebateTerms: dto.rebateTerms || null,
        minimumAnnualCommitment: dto.minimumAnnualCommitment || null,
        paymentTerms: dto.paymentTerms || 'NET_30',
        penaltyClauses: dto.penaltyClauses || null,
        status: ContractTermStatus.ACTIVE,
        signedByVendor: true,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.VENDOR_CONTRACT_SIGNED,
      AuditSeverity.INFO,
      `Vendor Contract ${contractRefNumber} executed with ${dto.vendorName} at unit rate $${dto.agreedUnitPrice}`,
      'ProcurementSpecialist',
      'MaterialCatalogService',
      { contractRef: contractRefNumber, vendorName: dto.vendorName },
    );

    return created;
  }
}

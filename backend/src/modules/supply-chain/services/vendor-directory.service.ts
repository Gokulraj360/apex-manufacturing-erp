import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateVendorDirectoryDto,
  UpdateVendorDirectoryDto,
  EvaluateVendorPerformanceDto,
  QueryVendorDirectoryDto,
} from '../dto/vendor-directory.dto';
import { AuditAction, AuditSeverity, VendorTierRating } from '@prisma/client';

@Injectable()
export class VendorDirectoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all vendors with filtering
   */
  async getVendors(query: QueryVendorDirectoryDto) {
    const { tierRating, category, isActive, search, limit = 50, offset = 0 } = query;
    const where: any = {};

    if (tierRating) {
      where.tierRating = tierRating;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (category) {
      where.categories = { has: category };
    }

    if (search) {
      where.OR = [
        { vendorCode: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { taxIdGstin: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.vendorDirectory.count({ where }),
      this.prisma.vendorDirectory.findMany({
        where,
        include: {
          _count: {
            select: {
              purchaseOrders: true,
              shipments: true,
              riskLogs: true,
            },
          },
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { overallScore: 'desc' },
      }),
    ]);

    return { total, items };
  }

  /**
   * Get vendor by ID
   */
  async getVendorById(id: string) {
    const vendor = await this.prisma.vendorDirectory.findUnique({
      where: { id },
      include: {
        purchaseOrders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        shipments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        riskLogs: {
          where: { status: { not: 'RESOLVED' } },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found.`);
    }

    return vendor;
  }

  /**
   * Enroll a new supplier into directory
   */
  async createVendor(dto: CreateVendorDirectoryDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.vendorDirectory.findUnique({
      where: { vendorCode: dto.vendorCode },
    });

    if (existing) {
      throw new BadRequestException(`Vendor code ${dto.vendorCode} already exists.`);
    }

    const vendor = await this.prisma.vendorDirectory.create({
      data: {
        vendorCode: dto.vendorCode,
        companyName: dto.companyName,
        contactPerson: dto.contactPerson,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        country: dto.country || 'India',
        taxIdGstin: dto.taxIdGstin,
        tierRating: dto.tierRating || VendorTierRating.TIER_2_PREFERRED,
        categories: dto.categories,
        leadTimeDaysAvg: dto.leadTimeDaysAvg || 7,
        paymentTerms: dto.paymentTerms || 'NET_30',
        isActive: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.VENDOR_DIRECTORY_UPDATED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        vendorId: vendor.id,
        vendorCode: vendor.vendorCode,
        companyName: vendor.companyName,
      },
    });

    return vendor;
  }

  /**
   * Update vendor details
   */
  async updateVendor(id: string, dto: UpdateVendorDirectoryDto, userId: string = 'SYSTEM') {
    const vendor = await this.getVendorById(id);

    const updated = await this.prisma.vendorDirectory.update({
      where: { id: vendor.id },
      data: dto as any,
    });

    return updated;
  }

  /**
   * Evaluate vendor scorecard and update composite SLA metrics
   */
  async evaluateVendor(
    id: string,
    dto: EvaluateVendorPerformanceDto,
    userId: string = 'SYSTEM',
  ) {
    const vendor = await this.getVendorById(id);

    // Composite Score Formula: 40% On-Time, 35% Quality, 25% Cost Competitiveness
    const compositeScore = parseFloat(
      (
        dto.onTimeDeliveryRate * 0.4 +
        dto.qualityScore * 0.35 +
        dto.costCompetitiveness * 0.25
      ).toFixed(2),
    );

    let tierRating: VendorTierRating = VendorTierRating.TIER_2_PREFERRED;
    if (compositeScore >= 95) {
      tierRating = VendorTierRating.TIER_1_STRATEGIC;
    } else if (compositeScore >= 80) {
      tierRating = VendorTierRating.TIER_2_PREFERRED;
    } else if (compositeScore >= 65) {
      tierRating = VendorTierRating.TIER_3_TRANSACTIONAL;
    } else {
      tierRating = VendorTierRating.PROBATION;
    }

    const updated = await this.prisma.vendorDirectory.update({
      where: { id: vendor.id },
      data: {
        onTimeDeliveryRate: dto.onTimeDeliveryRate,
        qualityScore: dto.qualityScore,
        costCompetitiveness: dto.costCompetitiveness,
        overallScore: compositeScore,
        tierRating,
        leadTimeDaysAvg: dto.leadTimeDaysAvg !== undefined ? dto.leadTimeDaysAvg : vendor.leadTimeDaysAvg,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.VENDOR_EVALUATED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        vendorId: updated.id,
        vendorCode: updated.vendorCode,
        compositeScore,
        assignedTier: tierRating,
      },
    });

    return updated;
  }
}

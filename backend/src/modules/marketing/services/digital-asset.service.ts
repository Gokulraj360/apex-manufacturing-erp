import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateDigitalAssetDto,
  UpdateDigitalAssetDto,
  QueryDigitalAssetsDto,
} from '../dto/digital-asset.dto';
import { AuditAction, AuditSeverity, DigitalAssetType } from '@prisma/client';

@Injectable()
export class DigitalAssetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Helper to serialize BigInt fields
   */
  private serializeAsset(asset: any) {
    if (!asset) return null;
    return {
      ...asset,
      fileSizeBytes: asset.fileSizeBytes != null ? Number(asset.fileSizeBytes) : 0,
    };
  }

  /**
   * List digital assets with optional filtering
   */
  async getAssets(query?: QueryDigitalAssetsDto) {
    const where: any = {};

    if (query?.type) {
      where.type = query.type as DigitalAssetType;
    }
    if (query?.campaignId) {
      where.campaignId = query.campaignId;
    }
    if (query?.isPublic !== undefined && query?.isPublic !== '') {
      where.isPublic = query.isPublic === 'true';
    }
    if (query?.search) {
      where.OR = [
        { assetCode: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { tags: { has: query.search } },
      ];
    }

    const assets = await this.prisma.digitalAsset.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            campaignCode: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return assets.map((a) => this.serializeAsset(a));
  }

  /**
   * Retrieve single digital asset by ID
   */
  async getAssetById(id: string) {
    const asset = await this.prisma.digitalAsset.findUnique({
      where: { id },
      include: {
        campaign: true,
      },
    });

    if (!asset) {
      throw new NotFoundException(`Digital asset with ID '${id}' not found`);
    }

    return this.serializeAsset(asset);
  }

  /**
   * Register a new marketing digital asset
   */
  async createAsset(dto: CreateDigitalAssetDto) {
    const count = await this.prisma.digitalAsset.count();
    const pad = String(count + 1).padStart(4, '0');
    const assetCode = `MKT-AST-${new Date().getFullYear().toString().slice(-2)}${pad}`;

    const created = await this.prisma.digitalAsset.create({
      data: {
        assetCode,
        title: dto.title,
        description: dto.description || null,
        type: (dto.type as DigitalAssetType) || DigitalAssetType.PRODUCT_BROCHURE,
        fileUrl: dto.fileUrl,
        fileSizeBytes: BigInt(2500000), // Default 2.5MB simulation if not specified
        mimeType: dto.mimeType || 'application/pdf',
        version: dto.version || 'v1.0',
        isPublic: dto.isPublic !== undefined ? dto.isPublic : true,
        partnerAccessAllowed:
          dto.partnerAccessAllowed !== undefined ? dto.partnerAccessAllowed : true,
        campaignId: dto.campaignId || null,
        tags: dto.tags || [],
        uploadedBy: dto.uploadedBy,
      },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            campaignCode: true,
          },
        },
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.DIGITAL_ASSET_UPLOADED,
      severity: AuditSeverity.LOW,
      entityType: 'DigitalAsset',
      entityId: created.id,
      description: `Uploaded digital asset [${assetCode}] '${created.title}' (${created.type})`,
      userId: dto.uploadedBy,
    });

    return this.serializeAsset(created);
  }

  /**
   * Update asset metadata
   */
  async updateAsset(id: string, dto: UpdateDigitalAssetDto, updatedBy = 'system') {
    const existing = await this.prisma.digitalAsset.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Digital asset with ID '${id}' not found`);
    }

    const updated = await this.prisma.digitalAsset.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        description: dto.description !== undefined ? dto.description : existing.description,
        version: dto.version ?? existing.version,
        isPublic: dto.isPublic !== undefined ? dto.isPublic : existing.isPublic,
        partnerAccessAllowed:
          dto.partnerAccessAllowed !== undefined
            ? dto.partnerAccessAllowed
            : existing.partnerAccessAllowed,
        tags: dto.tags ?? existing.tags,
      },
      include: {
        campaign: true,
      },
    });

    return this.serializeAsset(updated);
  }

  /**
   * Track asset download / distribution event
   */
  async incrementDownload(id: string) {
    const existing = await this.prisma.digitalAsset.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Digital asset with ID '${id}' not found`);
    }

    const updated = await this.prisma.digitalAsset.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 },
      },
    });

    return {
      id: updated.id,
      downloadCount: updated.downloadCount,
    };
  }

  /**
   * Delete asset
   */
  async deleteAsset(id: string, deletedBy = 'system') {
    const existing = await this.prisma.digitalAsset.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Digital asset with ID '${id}' not found`);
    }

    await this.prisma.digitalAsset.delete({ where: { id } });

    return { success: true, message: `Digital asset ${existing.assetCode} deleted.` };
  }

  /**
   * Asset statistics overview
   */
  async getAssetStatistics() {
    const totalAssets = await this.prisma.digitalAsset.count();
    const assets = await this.prisma.digitalAsset.findMany({
      select: {
        type: true,
        downloadCount: true,
        isPublic: true,
        partnerAccessAllowed: true,
      },
    });

    const totalDownloads = assets.reduce((sum, a) => sum + a.downloadCount, 0);
    const publicAssets = assets.filter((a) => a.isPublic).length;
    const partnerExclusive = assets.filter((a) => !a.isPublic && a.partnerAccessAllowed).length;

    const byType: Record<string, number> = {};
    for (const a of assets) {
      byType[a.type] = (byType[a.type] || 0) + 1;
    }

    return {
      totalAssets,
      totalDownloads,
      publicAssets,
      partnerExclusive,
      byType,
    };
  }
}

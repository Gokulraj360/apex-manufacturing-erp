import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateMachineAssetDto,
  UpdateMachineAssetDto,
  QueryMachineAssetDto,
} from '../dto/asset-registry.dto';
import { AuditAction, AuditSeverity, AssetStatus } from '@prisma/client';

@Injectable()
export class AssetRegistryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all machine assets with operational telemetry & schedule counts
   */
  async getMachineAssets(query: QueryMachineAssetDto) {
    const where: any = {};
    if (query.category) where.category = query.category;
    if (query.status) where.status = query.status;
    if (query.criticality) where.criticality = query.criticality;
    if (query.facilityLocation) where.facilityLocation = { contains: query.facilityLocation, mode: 'insensitive' };
    if (query.search) {
      where.OR = [
        { assetTag: { contains: query.search, mode: 'insensitive' } },
        { assetName: { contains: query.search, mode: 'insensitive' } },
        { manufacturer: { contains: query.search, mode: 'insensitive' } },
        { modelNumber: { contains: query.search, mode: 'insensitive' } },
        { serialNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.machineAsset.findMany({
      where,
      include: {
        _count: {
          select: {
            maintenanceSchedules: true,
            breakdownTickets: true,
            lifecycleLogs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single machine asset with maintenance schedules, recent breakdowns, and lifecycle logs
   */
  async getMachineAssetById(id: string) {
    const asset = await this.prisma.machineAsset.findUnique({
      where: { id },
      include: {
        maintenanceSchedules: {
          orderBy: { nextDueDate: 'asc' },
          take: 10,
        },
        breakdownTickets: {
          orderBy: { breakdownStartedAt: 'desc' },
          take: 10,
        },
        lifecycleLogs: {
          orderBy: { recordedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!asset) {
      throw new NotFoundException(`Machine Asset with ID ${id} not found.`);
    }

    return asset;
  }

  /**
   * Register a new industrial machinery asset
   */
  async createMachineAsset(dto: CreateMachineAssetDto, userId?: string) {
    const existing = await this.prisma.machineAsset.findUnique({
      where: { assetTag: dto.assetTag },
    });

    if (existing) {
      throw new BadRequestException(`Machine Asset with tag ${dto.assetTag} already exists.`);
    }

    const asset = await this.prisma.machineAsset.create({
      data: {
        assetTag: dto.assetTag,
        assetName: dto.assetName,
        category: dto.category,
        serialNumber: dto.serialNumber,
        modelNumber: dto.modelNumber,
        manufacturer: dto.manufacturer,
        facilityLocation: dto.facilityLocation,
        powerRatingKw: dto.powerRatingKw ? dto.powerRatingKw : undefined,
        operatingVoltage: dto.operatingVoltage,
        installationDate: new Date(dto.installationDate),
        warrantyExpiryDate: dto.warrantyExpiryDate ? new Date(dto.warrantyExpiryDate) : undefined,
        criticality: dto.criticality || 'HIGH',
        status: AssetStatus.OPERATIONAL,
        manualDocumentUrl: dto.manualDocumentUrl,
        specifications: dto.specifications || {},
      },
    });

    // Create initial commissioning lifecycle log
    await this.prisma.assetLifecycleLog.create({
      data: {
        assetId: asset.id,
        eventType: 'COMMISSIONING',
        eventTitle: 'Initial Machine Commissioning & Enrollment',
        eventDescription: `Enrolled ${asset.assetName} (${asset.assetTag}) at location ${asset.facilityLocation}.`,
        performedBy: userId || 'SYSTEM_ADMIN',
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.ASSET_CREATED,
      severity: AuditSeverity.INFO,
      resource: 'ASSET_RELIABILITY',
      details: {
        assetId: asset.id,
        assetTag: asset.assetTag,
        category: asset.category,
        location: asset.facilityLocation,
      },
    });

    return asset;
  }

  /**
   * Update machine asset details, technical specifications or operational status
   */
  async updateMachineAsset(id: string, dto: UpdateMachineAssetDto, userId?: string) {
    const current = await this.prisma.machineAsset.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException(`Machine Asset with ID ${id} not found.`);
    }

    const updated = await this.prisma.machineAsset.update({
      where: { id },
      data: {
        assetName: dto.assetName,
        category: dto.category,
        serialNumber: dto.serialNumber,
        modelNumber: dto.modelNumber,
        manufacturer: dto.manufacturer,
        facilityLocation: dto.facilityLocation,
        powerRatingKw: dto.powerRatingKw ? dto.powerRatingKw : undefined,
        operatingVoltage: dto.operatingVoltage,
        warrantyExpiryDate: dto.warrantyExpiryDate ? new Date(dto.warrantyExpiryDate) : undefined,
        status: dto.status,
        criticality: dto.criticality,
        totalOperatingHours: dto.totalOperatingHours ? dto.totalOperatingHours : undefined,
        mtbfHours: dto.mtbfHours ? dto.mtbfHours : undefined,
        mttrHours: dto.mttrHours ? dto.mttrHours : undefined,
        manualDocumentUrl: dto.manualDocumentUrl,
        specifications: dto.specifications,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.ASSET_UPDATED,
      severity: AuditSeverity.INFO,
      resource: 'ASSET_RELIABILITY',
      details: {
        assetId: id,
        changes: dto,
      },
    });

    return updated;
  }

  /**
   * Decommission machine asset
   */
  async decommissionMachineAsset(id: string, reason: string, userId?: string) {
    const asset = await this.prisma.machineAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Machine Asset with ID ${id} not found.`);
    }

    const updated = await this.prisma.machineAsset.update({
      where: { id },
      data: { status: AssetStatus.DECOMMISSIONED },
    });

    await this.prisma.assetLifecycleLog.create({
      data: {
        assetId: id,
        eventType: 'DECOMMISSION',
        eventTitle: 'Asset Decommissioned from Active Production',
        eventDescription: reason || 'Scheduled decommissioning and removal from production floor.',
        performedBy: userId || 'SYSTEM_ADMIN',
      },
    });

    return updated;
  }
}

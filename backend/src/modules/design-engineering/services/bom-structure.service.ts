import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateBOMMasterDto,
  UpdateBOMStructureDto,
  QueryBOMDto,
} from '../dto/bom-structure.dto';
import { AuditAction, AuditSeverity, BOMStatus } from '@prisma/client';

@Injectable()
export class BOMStructureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Helper to count parts and compute roll-up cost recursively
   */
  private calculateBOMTotals(items: any[]): { count: number; totalCost: number } {
    let count = 0;
    let totalCost = 0;

    const traverse = (nodes: any[]) => {
      if (!Array.isArray(nodes)) return;
      for (const node of nodes) {
        count += Number(node.qty || 1);
        const unitCost = Number(node.unitCost || 0);
        const qty = Number(node.qty || 1);
        totalCost += unitCost * qty;

        if (node.children && Array.isArray(node.children)) {
          traverse(node.children);
        }
      }
    };

    traverse(items);
    return { count, totalCost: Number(totalCost.toFixed(2)) };
  }

  /**
   * List Multi-Level BOM Masters
   */
  async getBOMs(query?: QueryBOMDto) {
    const where: any = {};

    if (query?.cadModelId) {
      where.cadModelId = query.cadModelId;
    }
    if (query?.status) {
      where.status = query.status as BOMStatus;
    }
    if (query?.search) {
      where.OR = [
        { bomNumber: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { revision: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.billOfMaterialsMaster.findMany({
      where,
      include: {
        cadModel: {
          select: {
            id: true,
            modelCode: true,
            name: true,
            version: true,
          },
        },
        ecns: {
          select: {
            id: true,
            ecnNumber: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single BOM by ID
   */
  async getBOMById(id: string) {
    const bom = await this.prisma.billOfMaterialsMaster.findUnique({
      where: { id },
      include: {
        cadModel: true,
        ecns: true,
      },
    });

    if (!bom) {
      throw new NotFoundException(`BOM master '${id}' not found`);
    }

    return bom;
  }

  /**
   * Create a new Multi-Level BOM Structure
   */
  async createBOM(dto: CreateBOMMasterDto) {
    const totals = this.calculateBOMTotals(dto.structureJson);

    const created = await this.prisma.billOfMaterialsMaster.create({
      data: {
        bomNumber: dto.bomNumber,
        title: dto.title,
        cadModelId: dto.cadModelId || null,
        revision: dto.revision || 'Rev A',
        status: BOMStatus.DRAFT,
        totalPartsCount: totals.count,
        estimatedTotalCost: totals.totalCost,
        currency: dto.currency || 'USD',
        structureJson: dto.structureJson,
        releasedBy: dto.releasedBy || null,
      },
      include: {
        cadModel: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.BOM_REVISED,
      severity: AuditSeverity.LOW,
      entityType: 'BillOfMaterialsMaster',
      entityId: created.id,
      description: `Drafted BOM [${created.bomNumber}] '${created.title}' (${created.totalPartsCount} components, $${created.estimatedTotalCost})`,
      userId: dto.releasedBy || 'Design Engineer',
    });

    return created;
  }

  /**
   * Update BOM tree, revise part quantities, or release to production
   */
  async updateBOM(id: string, dto: UpdateBOMStructureDto) {
    const existing = await this.prisma.billOfMaterialsMaster.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`BOM master '${id}' not found`);
    }

    let totalPartsCount = existing.totalPartsCount;
    let estimatedTotalCost = Number(existing.estimatedTotalCost);

    if (dto.structureJson) {
      const totals = this.calculateBOMTotals(dto.structureJson);
      totalPartsCount = totals.count;
      estimatedTotalCost = totals.totalCost;
    } else if (dto.estimatedTotalCost !== undefined) {
      estimatedTotalCost = dto.estimatedTotalCost;
    }

    const updated = await this.prisma.billOfMaterialsMaster.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        revision: dto.revision ?? existing.revision,
        status: dto.status ? (dto.status as BOMStatus) : existing.status,
        structureJson: dto.structureJson ?? existing.structureJson,
        totalPartsCount,
        estimatedTotalCost,
        releasedBy: dto.releasedBy ?? existing.releasedBy,
        releasedAt:
          dto.status === BOMStatus.RELEASED && existing.status !== BOMStatus.RELEASED
            ? new Date()
            : existing.releasedAt,
      },
      include: {
        cadModel: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.BOM_REVISED,
      severity:
        dto.status === BOMStatus.RELEASED ? AuditSeverity.HIGH : AuditSeverity.MEDIUM,
      entityType: 'BillOfMaterialsMaster',
      entityId: updated.id,
      description: `Updated BOM [${updated.bomNumber}] ${updated.revision} status to ${updated.status}`,
      userId: dto.releasedBy || 'Design Lead',
    });

    return updated;
  }

  /**
   * BOM Summary and Rollup Analytics
   */
  async getBOMSummary() {
    const boms = await this.prisma.billOfMaterialsMaster.findMany();

    const totalBOMs = boms.length;
    const releasedBOMs = boms.filter((b) => b.status === BOMStatus.RELEASED).length;
    const draftBOMs = boms.filter((b) => b.status === BOMStatus.DRAFT).length;
    const totalAssemblyCost = boms.reduce(
      (sum, b) => sum + Number(b.estimatedTotalCost),
      0,
    );

    return {
      totalBOMs,
      releasedBOMs,
      draftBOMs,
      totalAssemblyCost,
    };
  }
}

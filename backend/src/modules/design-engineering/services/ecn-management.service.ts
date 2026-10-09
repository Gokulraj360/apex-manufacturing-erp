import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateECNDto,
  ReviewECNDto,
  QueryECNDto,
} from '../dto/ecn-management.dto';
import {
  AuditAction,
  AuditSeverity,
  ECNStatus,
  ECNPriority,
  ECNChangeReason,
} from '@prisma/client';

@Injectable()
export class ECNManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List Engineering Change Notices (ECNs)
   */
  async getECNs(query?: QueryECNDto) {
    const where: any = {};

    if (query?.cadModelId) {
      where.cadModelId = query.cadModelId;
    }
    if (query?.status) {
      where.status = query.status as ECNStatus;
    }
    if (query?.priority) {
      where.priority = query.priority as ECNPriority;
    }
    if (query?.reasonForChange) {
      where.reasonForChange = query.reasonForChange as ECNChangeReason;
    }
    if (query?.search) {
      where.OR = [
        { ecnNumber: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { changeScope: { contains: query.search, mode: 'insensitive' } },
        { requestedBy: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.engineeringChangeNotice.findMany({
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
        drawing: {
          select: {
            id: true,
            drawingNumber: true,
            title: true,
            revision: true,
          },
        },
        bomMaster: {
          select: {
            id: true,
            bomNumber: true,
            title: true,
            revision: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single ECN by ID
   */
  async getECNById(id: string) {
    const ecn = await this.prisma.engineeringChangeNotice.findUnique({
      where: { id },
      include: {
        cadModel: true,
        drawing: true,
        bomMaster: true,
      },
    });

    if (!ecn) {
      throw new NotFoundException(`ECN record '${id}' not found`);
    }

    return ecn;
  }

  /**
   * Create an Engineering Change Notice
   */
  async createECN(dto: CreateECNDto) {
    const count = await this.prisma.engineeringChangeNotice.count();
    const pad = String(count + 1).padStart(4, '0');
    const ecnNumber = `ECN-${new Date().getFullYear().toString().slice(-2)}${pad}`;

    const created = await this.prisma.engineeringChangeNotice.create({
      data: {
        ecnNumber,
        title: dto.title,
        cadModelId: dto.cadModelId || null,
        drawingId: dto.drawingId || null,
        bomMasterId: dto.bomMasterId || null,
        reasonForChange:
          (dto.reasonForChange as ECNChangeReason) || ECNChangeReason.DESIGN_OPTIMIZATION,
        priority: (dto.priority as ECNPriority) || ECNPriority.MEDIUM,
        description: dto.description,
        changeScope: dto.changeScope,
        status: ECNStatus.SUBMITTED,
        requestedBy: dto.requestedBy,
        implementationTargetDate: dto.implementationTargetDate
          ? new Date(dto.implementationTargetDate)
          : null,
        inventoryDisposition: dto.inventoryDisposition || 'USE_EXISTING_STOCK_FIRST',
        costImpactEstimate: dto.costImpactEstimate ?? null,
      },
      include: {
        cadModel: true,
        drawing: true,
        bomMaster: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.ECN_SUBMITTED,
      severity:
        dto.priority === 'CRITICAL' ? AuditSeverity.HIGH : AuditSeverity.MEDIUM,
      entityType: 'EngineeringChangeNotice',
      entityId: created.id,
      description: `Submitted ECN [${ecnNumber}] '${created.title}' (${created.priority} priority, reason: ${created.reasonForChange})`,
      userId: dto.requestedBy,
    });

    return created;
  }

  /**
   * Review, approve, or reject an ECN
   */
  async reviewECN(id: string, dto: ReviewECNDto) {
    const existing = await this.prisma.engineeringChangeNotice.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`ECN record '${id}' not found`);
    }

    const updated = await this.prisma.engineeringChangeNotice.update({
      where: { id },
      data: {
        status: dto.status as ECNStatus,
        reviewedBy: dto.reviewedBy ?? existing.reviewedBy,
        approvedBy: dto.approvedBy ?? existing.approvedBy,
        approvedAt:
          dto.status === ECNStatus.APPROVED || dto.status === ECNStatus.IMPLEMENTED
            ? new Date()
            : existing.approvedAt,
        inventoryDisposition:
          dto.inventoryDisposition ?? existing.inventoryDisposition,
        implementationTargetDate: dto.implementationTargetDate
          ? new Date(dto.implementationTargetDate)
          : existing.implementationTargetDate,
      },
      include: {
        cadModel: true,
        drawing: true,
        bomMaster: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.ECN_APPROVED,
      severity:
        dto.status === 'APPROVED' ? AuditSeverity.HIGH : AuditSeverity.MEDIUM,
      entityType: 'EngineeringChangeNotice',
      entityId: updated.id,
      description: `ECN [${updated.ecnNumber}] updated to status: ${updated.status} by ${dto.approvedBy || dto.reviewedBy || 'Reviewer'}`,
      userId: dto.approvedBy || dto.reviewedBy || 'System',
    });

    return updated;
  }

  /**
   * ECN Summary metrics
   */
  async getECNSummary() {
    const ecns = await this.prisma.engineeringChangeNotice.findMany();

    const totalECNs = ecns.length;
    const pendingReview = ecns.filter(
      (e) => e.status === ECNStatus.SUBMITTED || e.status === ECNStatus.UNDER_REVIEW,
    ).length;
    const approvedECNs = ecns.filter((e) => e.status === ECNStatus.APPROVED).length;
    const implementedECNs = ecns.filter((e) => e.status === ECNStatus.IMPLEMENTED).length;
    const criticalECNs = ecns.filter((e) => e.priority === ECNPriority.CRITICAL).length;
    const totalCostImpact = ecns.reduce(
      (sum, e) => sum + Number(e.costImpactEstimate || 0),
      0,
    );

    return {
      totalECNs,
      pendingReview,
      approvedECNs,
      implementedECNs,
      criticalECNs,
      totalCostImpact,
    };
  }
}

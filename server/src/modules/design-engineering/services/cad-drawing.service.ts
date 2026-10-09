import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateCadModelDto,
  UpdateCadModelDto,
  CreateTechnicalDrawingDto,
  QueryCadModelsDto,
  QueryDrawingsDto,
} from '../dto/cad-drawing.dto';
import {
  AuditAction,
  AuditSeverity,
  CadStatus,
  CadFileFormat,
  DrawingSheetSize,
  BlueprintApprovalStatus,
} from '@prisma/client';

@Injectable()
export class CadDrawingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Safe serialization of BigInt fields
   */
  private serializeCadModel(model: any) {
    if (!model) return null;
    return {
      ...model,
      fileSizeBytes: model.fileSizeBytes != null ? Number(model.fileSizeBytes) : 0,
    };
  }

  /**
   * List 3D CAD models
   */
  async getCadModels(query?: QueryCadModelsDto) {
    const where: any = {};

    if (query?.category) {
      where.category = query.category;
    }
    if (query?.status) {
      where.status = query.status as CadStatus;
    }
    if (query?.fileFormat) {
      where.fileFormat = query.fileFormat as CadFileFormat;
    }
    if (query?.search) {
      where.OR = [
        { modelCode: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { materialSpec: { contains: query.search, mode: 'insensitive' } },
        { author: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const models = await this.prisma.cadModel.findMany({
      where,
      include: {
        drawings: {
          select: {
            id: true,
            drawingNumber: true,
            title: true,
            revision: true,
            isApprovedForProduction: true,
          },
        },
        bomMasters: {
          select: {
            id: true,
            bomNumber: true,
            title: true,
            revision: true,
            status: true,
          },
        },
        ecns: {
          select: {
            id: true,
            ecnNumber: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return models.map((m) => this.serializeCadModel(m));
  }

  /**
   * Get single CAD model by ID
   */
  async getCadModelById(id: string) {
    const model = await this.prisma.cadModel.findUnique({
      where: { id },
      include: {
        drawings: true,
        bomMasters: true,
        ecns: true,
        prototypeTests: true,
        designSpecifications: true,
      },
    });

    if (!model) {
      throw new NotFoundException(`CAD model with ID '${id}' not found`);
    }

    return this.serializeCadModel(model);
  }

  /**
   * Register a new 3D CAD Model
   */
  async createCadModel(dto: CreateCadModelDto) {
    const count = await this.prisma.cadModel.count();
    const pad = String(count + 1).padStart(4, '0');
    const modelCode = `CAD-${new Date().getFullYear().toString().slice(-2)}${pad}`;

    const created = await this.prisma.cadModel.create({
      data: {
        modelCode,
        name: dto.name,
        description: dto.description || null,
        fileFormat: (dto.fileFormat as CadFileFormat) || CadFileFormat.STEP,
        fileUrl: dto.fileUrl,
        fileSizeBytes: BigInt(12500000), // Default 12.5MB simulation
        version: dto.version || 'v1.0',
        category: dto.category,
        materialSpec: dto.materialSpec || null,
        massKg: dto.massKg ?? null,
        volumeMm3: dto.volumeMm3 ?? null,
        status: CadStatus.IN_REVIEW,
        author: dto.author,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.CAD_MODEL_CREATED,
      severity: AuditSeverity.LOW,
      entityType: 'CadModel',
      entityId: created.id,
      description: `Registered 3D CAD model [${modelCode}] '${created.name}' (${created.fileFormat}, ${created.version})`,
      userId: dto.author,
    });

    return this.serializeCadModel(created);
  }

  /**
   * Update CAD Model metadata or approval status
   */
  async updateCadModel(id: string, dto: UpdateCadModelDto) {
    const existing = await this.prisma.cadModel.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`CAD model '${id}' not found`);
    }

    const updated = await this.prisma.cadModel.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        description: dto.description !== undefined ? dto.description : existing.description,
        status: dto.status ? (dto.status as CadStatus) : existing.status,
        version: dto.version ?? existing.version,
        materialSpec: dto.materialSpec ?? existing.materialSpec,
        massKg: dto.massKg ?? existing.massKg,
        volumeMm3: dto.volumeMm3 ?? existing.volumeMm3,
        approvedBy: dto.approvedBy ?? existing.approvedBy,
        approvedAt: dto.approvedBy ? new Date() : existing.approvedAt,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.CAD_MODEL_UPDATED,
      severity: AuditSeverity.LOW,
      entityType: 'CadModel',
      entityId: updated.id,
      description: `Updated CAD model [${updated.modelCode}] status: ${updated.status}`,
      userId: dto.approvedBy || 'Engineer',
    });

    return this.serializeCadModel(updated);
  }

  /**
   * List technical drawings
   */
  async getDrawings(query?: QueryDrawingsDto) {
    const where: any = {};

    if (query?.cadModelId) {
      where.cadModelId = query.cadModelId;
    }
    if (query?.status) {
      where.status = query.status as BlueprintApprovalStatus;
    }
    if (query?.isApprovedForProduction !== undefined && query?.isApprovedForProduction !== '') {
      where.isApprovedForProduction = query.isApprovedForProduction === 'true';
    }
    if (query?.search) {
      where.OR = [
        { drawingNumber: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { geometricTolerances: { contains: query.search, mode: 'insensitive' } },
        { drawnBy: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.technicalDrawing.findMany({
      where,
      include: {
        cadModel: {
          select: {
            id: true,
            modelCode: true,
            name: true,
            version: true,
            fileFormat: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single technical drawing by ID
   */
  async getDrawingById(id: string) {
    const drawing = await this.prisma.technicalDrawing.findUnique({
      where: { id },
      include: {
        cadModel: true,
        ecns: true,
      },
    });

    if (!drawing) {
      throw new NotFoundException(`Technical drawing '${id}' not found`);
    }

    return drawing;
  }

  /**
   * Create a new Technical Drawing linked to CAD Model
   */
  async createDrawing(dto: CreateTechnicalDrawingDto) {
    const created = await this.prisma.technicalDrawing.create({
      data: {
        drawingNumber: dto.drawingNumber,
        title: dto.title,
        cadModelId: dto.cadModelId || null,
        sheetSize: (dto.sheetSize as DrawingSheetSize) || DrawingSheetSize.A1,
        revision: dto.revision || 'Rev 01',
        fileUrl: dto.fileUrl,
        isApprovedForProduction: false,
        criticalDimensions: dto.criticalDimensions || [],
        geometricTolerances: dto.geometricTolerances || null,
        surfaceFinishRa: dto.surfaceFinishRa ?? null,
        status: BlueprintApprovalStatus.DRAFT,
        drawnBy: dto.drawnBy,
        checkedBy: dto.checkedBy || null,
      },
      include: {
        cadModel: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.TECHNICAL_DRAWING_RELEASED,
      severity: AuditSeverity.LOW,
      entityType: 'TechnicalDrawing',
      entityId: created.id,
      description: `Drafted technical drawing [${created.drawingNumber}] '${created.title}' (${created.revision})`,
      userId: dto.drawnBy,
    });

    return created;
  }

  /**
   * CAD & Drawing Repository Statistics
   */
  async getCadStatistics() {
    const totalCadModels = await this.prisma.cadModel.count();
    const approvedCadModels = await this.prisma.cadModel.count({
      where: { status: CadStatus.APPROVED },
    });
    const totalDrawings = await this.prisma.technicalDrawing.count();
    const approvedDrawings = await this.prisma.technicalDrawing.count({
      where: { isApprovedForProduction: true },
    });

    return {
      totalCadModels,
      approvedCadModels,
      totalDrawings,
      approvedDrawings,
    };
  }
}

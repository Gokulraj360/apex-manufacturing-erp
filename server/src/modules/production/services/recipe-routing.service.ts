import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CreateBomDto, AssemblyRoutingStepDto } from '../dto/recipe-routing.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class RecipeRoutingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all approved recipes / BOMs with routings
   */
  async getAllRecipes() {
    return this.prisma.billOfMaterials.findMany({
      orderBy: { sku: 'asc' },
      include: {
        routings: {
          orderBy: { stepNumber: 'asc' },
        },
        _count: {
          select: { workOrders: true },
        },
      },
    });
  }

  /**
   * Get single recipe by SKU or ID with engineering blueprints
   */
  async getRecipeBySku(sku: string) {
    const bom = await this.prisma.billOfMaterials.findUnique({
      where: { sku },
      include: {
        routings: { orderBy: { stepNumber: 'asc' } },
        workOrders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!bom) throw new NotFoundException(`Recipe with SKU ${sku} not found.`);
    return bom;
  }

  /**
   * Register or update an engineering recipe (BOM)
   */
  async createRecipe(dto: CreateBomDto, adminUserId?: string) {
    const existing = await this.prisma.billOfMaterials.findUnique({
      where: { sku: dto.sku },
    });
    if (existing) {
      throw new BadRequestException(`Bill of Materials with SKU ${dto.sku} already exists.`);
    }

    const bom = await this.prisma.billOfMaterials.create({
      data: {
        sku: dto.sku,
        name: dto.name,
        version: dto.version || '1.0',
        description: dto.description,
        components: dto.components as any,
        blueprintUrl: dto.blueprintUrl || `https://cad.apexerp.internal/blueprints/${dto.sku}.pdf`,
        blueprintSpecifications: dto.blueprintSpecifications || {
          alloyGrade: 'Titanium Ti-6Al-4V Grade 5',
          toleranceMm: '±0.005mm',
          tensileStrengthMpa: 950,
          surfaceFinishRa: '0.4 μm',
          cadRevision: 'REV-C4',
        },
        routings: dto.routings && dto.routings.length > 0 ? {
          create: dto.routings.map((r) => ({
            stepNumber: r.stepNumber,
            stationName: r.stationName,
            instruction: r.instruction,
            cycleTimeMinutes: r.cycleTimeMinutes,
            toolingRequired: r.toolingRequired,
            qualityCheckpoints: r.qualityCheckpoints as any,
          })),
        } : undefined,
      },
      include: {
        routings: true,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.CREATE,
      entity: 'BILL_OF_MATERIALS',
      entityId: bom.id,
      details: `Created approved engineering recipe & routing for SKU ${bom.sku} - ${bom.name}`,
      severity: AuditSeverity.INFO,
    });

    return bom;
  }

  /**
   * Add assembly routing step
   */
  async addRoutingStep(bomId: string, step: AssemblyRoutingStepDto, adminUserId?: string) {
    const bom = await this.prisma.billOfMaterials.findUnique({ where: { id: bomId } });
    if (!bom) throw new NotFoundException('BOM not found.');

    const routing = await this.prisma.assemblyRouting.create({
      data: {
        bomId,
        stepNumber: step.stepNumber,
        stationName: step.stationName,
        instruction: step.instruction,
        cycleTimeMinutes: step.cycleTimeMinutes,
        toolingRequired: step.toolingRequired,
        qualityCheckpoints: step.qualityCheckpoints as any,
      },
    });

    return routing;
  }
}

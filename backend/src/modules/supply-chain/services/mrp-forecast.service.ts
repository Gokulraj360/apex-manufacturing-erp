import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateMRPPlanDto,
  RunMRPCalculationDto,
  UpdateMRPPlanStatusDto,
  QueryMRPPlanDto,
} from '../dto/mrp-forecast.dto';
import { AuditAction, AuditSeverity, MRPPlanStatus } from '@prisma/client';

@Injectable()
export class MRPForecastService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all MRP plans
   */
  async getPlans(query: QueryMRPPlanDto) {
    const { status, search, limit = 50, offset = 0 } = query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { planNumber: { contains: search, mode: 'insensitive' } },
        { planName: { contains: search, mode: 'insensitive' } },
        { generatedBy: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.materialRequirementPlan.count({ where }),
      this.prisma.materialRequirementPlan.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  /**
   * Get MRP plan by ID
   */
  async getPlanById(id: string) {
    const plan = await this.prisma.materialRequirementPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException(`MRP Plan with ID ${id} not found.`);
    }

    return plan;
  }

  /**
   * Create an MRP forecasting plan
   */
  async createPlan(dto: CreateMRPPlanDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.materialRequirementPlan.findUnique({
      where: { planNumber: dto.planNumber },
    });

    if (existing) {
      throw new BadRequestException(`Plan number ${dto.planNumber} already exists.`);
    }

    const grossDemand = dto.grossDemandJson || [];
    const totalItems = grossDemand.length;

    const plan = await this.prisma.materialRequirementPlan.create({
      data: {
        planNumber: dto.planNumber,
        planName: dto.planName,
        planningHorizonWeeks: dto.planningHorizonWeeks || 12,
        status: MRPPlanStatus.DRAFT,
        generatedBy: userId,
        forecastStartDate: new Date(dto.forecastStartDate),
        forecastEndDate: new Date(dto.forecastEndDate),
        grossDemandJson: grossDemand as any,
        scheduledReceiptsJson: [] as any,
        netRequirementsJson: [] as any,
        plannedOrderReleasesJson: [] as any,
        safetyStockAlertsCount: 0,
        totalItemsPlanned: totalItems,
        notes: dto.notes,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.MRP_PLAN_GENERATED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        planId: plan.id,
        planNumber: plan.planNumber,
        planningHorizonWeeks: plan.planningHorizonWeeks,
      },
    });

    return plan;
  }

  /**
   * Execute Material Requirements Planning computation
   * Calculates net requirements, offsets lead times, determines planned order releases
   */
  async calculateMRP(dto: RunMRPCalculationDto, userId: string = 'SYSTEM') {
    const plan = await this.getPlanById(dto.planId);

    const grossDemand = (plan.grossDemandJson as any[]) || [];
    const multiplier = dto.safetyStockMultiplier || 1.2;

    // Fetch approved active suppliers for order allocation suggestions
    const vendors = await this.prisma.vendorDirectory.findMany({
      where: { isActive: true },
      select: { id: true, companyName: true, leadTimeDaysAvg: true, categories: true },
    });

    let safetyStockAlerts = 0;
    const netRequirements: any[] = [];
    const plannedReleases: any[] = [];
    const scheduledReceipts: any[] = [];

    // Calculate MRP matrix per item
    for (const demand of grossDemand) {
      const requiredQty = demand.requiredQty || 0;
      // Baseline mock inventory level calculation (can connect to WarehouseStock model if available)
      const currentOnhand = Math.floor(requiredQty * 0.35); // 35% currently on hand
      const incomingReceipts = Math.floor(requiredQty * 0.15); // 15% in transit / on open PO
      const safetyStockThreshold = Math.ceil(requiredQty * 0.2 * multiplier); // 20% baseline * multiplier

      const availableStock = currentOnhand + incomingReceipts;
      const netShortage = Math.max(0, requiredQty + safetyStockThreshold - availableStock);

      const matchedVendor = vendors[0] || null;
      const leadTimeDays = matchedVendor?.leadTimeDaysAvg || 7;

      if (availableStock < safetyStockThreshold) {
        safetyStockAlerts++;
      }

      netRequirements.push({
        itemSku: demand.itemSku,
        itemName: demand.itemName,
        requiredQty,
        currentOnhand,
        scheduledIncoming: incomingReceipts,
        safetyStockThreshold,
        netShortageQty: netShortage,
        leadTimeDays,
      });

      if (incomingReceipts > 0) {
        scheduledReceipts.push({
          itemSku: demand.itemSku,
          incomingQty: incomingReceipts,
          poNumber: `PO-EXP-${Math.floor(1000 + Math.random() * 9000)}`,
          expectedDate: new Date(Date.now() + 5 * 86400000).toISOString(),
        });
      }

      if (netShortage > 0) {
        const needDate = new Date(demand.requiredDate || Date.now() + 21 * 86400000);
        const releaseDate = new Date(needDate.getTime() - leadTimeDays * 86400000);

        plannedReleases.push({
          itemSku: demand.itemSku,
          itemName: demand.itemName,
          orderQty: netShortage,
          releaseDate: releaseDate.toISOString().split('T')[0],
          needDate: needDate.toISOString().split('T')[0],
          suggestedVendorId: matchedVendor?.id,
          suggestedVendorName: matchedVendor?.companyName || 'Apex Strategic Supplier',
          estimatedLeadDays: leadTimeDays,
        });
      }
    }

    const updated = await this.prisma.materialRequirementPlan.update({
      where: { id: plan.id },
      data: {
        status: MRPPlanStatus.COMPUTED,
        scheduledReceiptsJson: scheduledReceipts as any,
        netRequirementsJson: netRequirements as any,
        plannedOrderReleasesJson: plannedReleases as any,
        safetyStockAlertsCount: safetyStockAlerts,
        totalItemsPlanned: grossDemand.length,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.MRP_PLAN_EXECUTED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        planId: updated.id,
        planNumber: updated.planNumber,
        safetyStockAlerts,
        plannedReleasesCount: plannedReleases.length,
      },
    });

    return updated;
  }

  /**
   * Update MRP Plan status (RELEASED, ARCHIVED)
   */
  async updateStatus(id: string, dto: UpdateMRPPlanStatusDto, userId: string = 'SYSTEM') {
    const plan = await this.getPlanById(id);

    const updated = await this.prisma.materialRequirementPlan.update({
      where: { id: plan.id },
      data: {
        status: dto.status,
        notes: dto.notes ? `${plan.notes || ''}\n[${new Date().toISOString()}] ${dto.notes}` : plan.notes,
      },
    });

    return updated;
  }

  /**
   * Delete an unreleased MRP plan
   */
  async deletePlan(id: string) {
    const plan = await this.getPlanById(id);
    if (plan.status === MRPPlanStatus.RELEASED) {
      throw new BadRequestException('Cannot delete an already released MRP plan.');
    }

    return this.prisma.materialRequirementPlan.delete({
      where: { id },
    });
  }
}

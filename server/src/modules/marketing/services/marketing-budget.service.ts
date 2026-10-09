import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateAdvertisingBudgetDto,
  ApproveBudgetByFinanceDto,
  QueryBudgetsDto,
} from '../dto/marketing-budget.dto';
import { AuditAction, AuditSeverity, BudgetApprovalStatus } from '@prisma/client';

@Injectable()
export class MarketingBudgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Retrieve list of marketing budgets with filters
   */
  async getBudgets(query?: QueryBudgetsDto) {
    const where: any = {};

    if (query?.campaignId) {
      where.campaignId = query.campaignId;
    }
    if (query?.category) {
      where.category = query.category;
    }
    if (query?.approvalStatus) {
      where.approvalStatus = query.approvalStatus as BudgetApprovalStatus;
    }
    if (query?.search) {
      where.OR = [
        { budgetId: { contains: query.search, mode: 'insensitive' } },
        { eventName: { contains: query.search, mode: 'insensitive' } },
        { vendorOrPlatform: { contains: query.search, mode: 'insensitive' } },
        { requestedBy: { contains: query.search, mode: 'insensitive' } },
        { journalEntryRef: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.advertisingBudget.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            campaignCode: true,
            name: true,
            type: true,
            allocatedBudget: true,
            actualSpent: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single budget line item by ID
   */
  async getBudgetById(id: string) {
    const budget = await this.prisma.advertisingBudget.findUnique({
      where: { id },
      include: {
        campaign: true,
      },
    });

    if (!budget) {
      throw new NotFoundException(`Advertising budget proposal '${id}' not found`);
    }

    return budget;
  }

  /**
   * Create an event or media ad expenditure proposal
   */
  async createBudget(dto: CreateAdvertisingBudgetDto) {
    const count = await this.prisma.advertisingBudget.count();
    const pad = String(count + 1).padStart(3, '0');
    const budgetId = `ADV-BGT-${new Date().getFullYear().toString().slice(-2)}${pad}`;

    const created = await this.prisma.advertisingBudget.create({
      data: {
        budgetId,
        campaignId: dto.campaignId || null,
        eventName: dto.eventName,
        category: dto.category,
        proposedAmount: dto.proposedAmount,
        approvedAmount: null,
        vendorOrPlatform: dto.vendorOrPlatform,
        approvalStatus: BudgetApprovalStatus.DRAFT,
        requestedBy: dto.requestedBy,
        justification: dto.justification || null,
      },
      include: {
        campaign: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.MARKETING_BUDGET_SUBMITTED,
      severity: AuditSeverity.LOW,
      entityType: 'AdvertisingBudget',
      entityId: created.id,
      description: `Drafted marketing budget line [${budgetId}] for '${created.eventName}' ($${created.proposedAmount})`,
      userId: dto.requestedBy,
    });

    return created;
  }

  /**
   * Forward budget request to Accounts / Finance
   */
  async submitToFinance(id: string, requestedBy = 'system') {
    const existing = await this.prisma.advertisingBudget.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Budget item '${id}' not found`);
    }

    if (existing.approvalStatus !== BudgetApprovalStatus.DRAFT) {
      throw new BadRequestException(
        `Only DRAFT budgets can be submitted to accounts (Current: ${existing.approvalStatus})`,
      );
    }

    const updated = await this.prisma.advertisingBudget.update({
      where: { id },
      data: {
        approvalStatus: BudgetApprovalStatus.SUBMITTED_TO_ACCOUNTS,
        submittedToFinanceAt: new Date(),
      },
      include: {
        campaign: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.MARKETING_BUDGET_SUBMITTED,
      severity: AuditSeverity.MEDIUM,
      entityType: 'AdvertisingBudget',
      entityId: updated.id,
      description: `Submitted budget [${updated.budgetId}] to Accounts & Finance ($${updated.proposedAmount})`,
      userId: requestedBy,
    });

    return updated;
  }

  /**
   * Approve, reject, or disburse marketing budget by Finance
   */
  async approveBudgetByFinance(id: string, dto: ApproveBudgetByFinanceDto) {
    const existing = await this.prisma.advertisingBudget.findUnique({
      where: { id },
      include: { campaign: true },
    });

    if (!existing) {
      throw new NotFoundException(`Budget item '${id}' not found`);
    }

    const approvedAmount =
      dto.approvedAmount !== undefined
        ? dto.approvedAmount
        : dto.approvalStatus === BudgetApprovalStatus.ACCOUNTS_APPROVED ||
          dto.approvalStatus === BudgetApprovalStatus.DISBURSED
        ? Number(existing.proposedAmount)
        : null;

    const updated = await this.prisma.advertisingBudget.update({
      where: { id },
      data: {
        approvalStatus: dto.approvalStatus as BudgetApprovalStatus,
        approvedAmount: approvedAmount !== null ? approvedAmount : existing.approvedAmount,
        approvedByFinance: dto.approvedByFinance,
        approvedAt: new Date(),
        journalEntryRef: dto.journalEntryRef ?? existing.journalEntryRef,
      },
      include: {
        campaign: true,
      },
    });

    // If budget approved/disbursed and linked to campaign, add to campaign's actualSpent
    if (
      existing.campaignId &&
      (dto.approvalStatus === BudgetApprovalStatus.ACCOUNTS_APPROVED ||
        dto.approvalStatus === BudgetApprovalStatus.DISBURSED) &&
      approvedAmount
    ) {
      await this.prisma.marketingCampaign.update({
        where: { id: existing.campaignId },
        data: {
          actualSpent: { increment: approvedAmount },
        },
      });
    }

    await this.auditLogService.logAction({
      action: AuditAction.MARKETING_BUDGET_APPROVED,
      severity:
        dto.approvalStatus === BudgetApprovalStatus.REJECTED
          ? AuditSeverity.MEDIUM
          : AuditSeverity.HIGH,
      entityType: 'AdvertisingBudget',
      entityId: updated.id,
      description: `Finance updated budget [${updated.budgetId}] status to ${dto.approvalStatus} (Approved: $${approvedAmount || 0}, Journal: ${dto.journalEntryRef || 'N/A'})`,
      userId: dto.approvedByFinance,
    });

    return updated;
  }

  /**
   * Delete draft budget line
   */
  async deleteBudget(id: string) {
    const existing = await this.prisma.advertisingBudget.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Budget item '${id}' not found`);
    }

    if (existing.approvalStatus === BudgetApprovalStatus.DISBURSED) {
      throw new BadRequestException('Cannot delete a disbursed budget item');
    }

    await this.prisma.advertisingBudget.delete({ where: { id } });
    return { success: true, message: `Budget ${existing.budgetId} deleted.` };
  }

  /**
   * Overview metrics for marketing budgets
   */
  async getBudgetSummary() {
    const budgets = await this.prisma.advertisingBudget.findMany();

    const totalProposed = budgets.reduce((acc, b) => acc + Number(b.proposedAmount), 0);
    const totalApproved = budgets.reduce((acc, b) => acc + Number(b.approvedAmount || 0), 0);
    const pendingFinanceApproval = budgets.filter(
      (b) => b.approvalStatus === BudgetApprovalStatus.SUBMITTED_TO_ACCOUNTS,
    ).length;
    const disbursedCount = budgets.filter(
      (b) => b.approvalStatus === BudgetApprovalStatus.DISBURSED,
    ).length;

    const categoryBreakdown: Record<string, number> = {};
    for (const b of budgets) {
      categoryBreakdown[b.category] =
        (categoryBreakdown[b.category] || 0) + Number(b.approvedAmount || b.proposedAmount);
    }

    return {
      totalProposed,
      totalApproved,
      pendingFinanceApproval,
      disbursedCount,
      categoryBreakdown,
    };
  }
}

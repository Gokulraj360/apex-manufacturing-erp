import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateCampaignDto,
  UpdateCampaignMetricsDto,
  FeedLeadToCrmDto,
  QueryCampaignsDto,
} from '../dto/campaign-management.dto';
import {
  AuditAction,
  AuditSeverity,
  CampaignType,
  CampaignStatus,
  PipelineStage,
  LeadSource,
} from '@prisma/client';

@Injectable()
export class CampaignManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all campaigns with filters
   */
  async getCampaigns(query?: QueryCampaignsDto) {
    const where: any = {};

    if (query?.type) {
      where.type = query.type as CampaignType;
    }
    if (query?.status) {
      where.status = query.status as CampaignStatus;
    }
    if (query?.search) {
      where.OR = [
        { campaignCode: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
        { channel: { contains: query.search, mode: 'insensitive' } },
        { targetAudience: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.marketingCampaign.findMany({
      where,
      include: {
        leads: {
          select: {
            id: true,
            leadNumber: true,
            title: true,
            companyName: true,
            estimatedValue: true,
            stage: true,
          },
        },
        digitalAssets: {
          select: {
            id: true,
            assetCode: true,
            title: true,
            type: true,
          },
        },
        budgets: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  /**
   * Get single campaign by ID
   */
  async getCampaignById(id: string) {
    const campaign = await this.prisma.marketingCampaign.findUnique({
      where: { id },
      include: {
        leads: true,
        digitalAssets: true,
        budgets: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Marketing campaign with ID ${id} not found`);
    }

    return campaign;
  }

  /**
   * Create new marketing campaign
   */
  async createCampaign(dto: CreateCampaignDto) {
    const count = await this.prisma.marketingCampaign.count();
    const campaignCode = `MC-2026-0${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.marketingCampaign.create({
      data: {
        campaignCode,
        name: dto.name,
        description: dto.description || null,
        type: (dto.type as CampaignType) || CampaignType.DIGITAL_ADS,
        status: CampaignStatus.PLANNING,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        targetAudience: dto.targetAudience,
        allocatedBudget: dto.allocatedBudget,
        actualSpent: 0,
        channel: dto.channel,
        leadManager: dto.leadManager,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.MARKETING_CAMPAIGN_CREATED,
      AuditSeverity.INFO,
      `Marketing campaign ${campaignCode} ("${dto.name}") launched on ${dto.channel} with budget $${dto.allocatedBudget}`,
      dto.leadManager,
      'CampaignManagementService',
      { campaignId: created.id, budget: dto.allocatedBudget, channel: dto.channel },
    );

    return created;
  }

  /**
   * Update campaign performance metrics and status
   */
  async updateCampaignMetrics(id: string, dto: UpdateCampaignMetricsDto) {
    const existing = await this.getCampaignById(id);

    const updateData: any = {};
    if (dto.status) updateData.status = dto.status as CampaignStatus;
    if (dto.actualSpent !== undefined) updateData.actualSpent = dto.actualSpent;
    if (dto.impressions !== undefined) updateData.impressions = dto.impressions;
    if (dto.clicks !== undefined) updateData.clicks = dto.clicks;
    if (dto.leadsGenerated !== undefined) updateData.leadsGenerated = dto.leadsGenerated;
    if (dto.pipelineValueGenerated !== undefined) updateData.pipelineValueGenerated = dto.pipelineValueGenerated;
    if (dto.roiPercentage !== undefined) updateData.roiPercentage = dto.roiPercentage;

    const updated = await this.prisma.marketingCampaign.update({
      where: { id },
      data: updateData,
    });

    await this.auditLogService.logAction(
      AuditAction.MARKETING_CAMPAIGN_UPDATED,
      AuditSeverity.INFO,
      `Campaign ${existing.campaignCode} metrics updated. Actual spend: $${updated.actualSpent}, Leads: ${updated.leadsGenerated}, Pipeline value: $${updated.pipelineValueGenerated}`,
      dto.updatedBy || 'Marketing Automation',
      'CampaignManagementService',
      { campaignId: id, status: updated.status, spent: updated.actualSpent },
    );

    return updated;
  }

  /**
   * Feed marketing lead directly into CRM Pipeline
   */
  async feedLeadToCrm(campaignId: string, dto: FeedLeadToCrmDto) {
    const campaign = await this.getCampaignById(campaignId);

    const leadCount = await this.prisma.lead.count();
    const leadNumber = `LEAD-2026-0${String(leadCount + 1).padStart(3, '0')}`;

    const initialNote = {
      timestamp: new Date().toISOString(),
      author: 'Marketing Automation',
      noteText: `Lead generated via campaign ${campaign.campaignCode} ("${campaign.name}") via channel ${campaign.channel}.`,
    };

    const newLead = await this.prisma.lead.create({
      data: {
        leadNumber,
        title: dto.title,
        campaignId,
        companyName: dto.companyName,
        contactPerson: dto.contactPerson,
        email: dto.email,
        phone: dto.phone,
        source: LeadSource.INBOUND_WEB,
        stage: PipelineStage.DISCOVERY,
        estimatedValue: dto.estimatedValue,
        expectedCloseDate: new Date(dto.expectedCloseDate),
        assignedSalesRep: dto.assignedSalesRep,
        technicalRequirementSummary: dto.technicalRequirementSummary,
        notes: [initialNote],
      },
    });

    // Increment leads count on campaign
    await this.prisma.marketingCampaign.update({
      where: { id: campaignId },
      data: {
        leadsGenerated: { increment: 1 },
        pipelineValueGenerated: { increment: dto.estimatedValue },
      },
    });

    await this.auditLogService.logAction(
      AuditAction.LEAD_CREATED,
      AuditSeverity.INFO,
      `Marketing campaign ${campaign.campaignCode} generated CRM Lead ${leadNumber} for ${dto.companyName} ($${dto.estimatedValue})`,
      dto.assignedSalesRep,
      'CampaignManagementService',
      { leadId: newLead.id, campaignId, value: dto.estimatedValue },
    );

    return newLead;
  }

  /**
   * High level overview metrics
   */
  async getMarketingOverview() {
    const [campaigns, assetsCount, trendsCount, budgets] = await Promise.all([
      this.prisma.marketingCampaign.findMany(),
      this.prisma.digitalAsset.count(),
      this.prisma.competitorMarketTrend.count(),
      this.prisma.advertisingBudget.findMany(),
    ]);

    const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
    const totalAllocatedBudget = campaigns.reduce((sum, c) => sum + Number(c.allocatedBudget), 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.actualSpent), 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0);
    const totalPipeline = campaigns.reduce((sum, c) => sum + Number(c.pipelineValueGenerated), 0);

    const approvedSpend = budgets
      .filter((b) => b.approvalStatus === 'ACCOUNTS_APPROVED' || b.approvalStatus === 'DISBURSED')
      .reduce((sum, b) => sum + Number(b.approvedAmount || b.proposedAmount), 0);

    return {
      activeCampaigns,
      totalCampaigns: campaigns.length,
      totalAllocatedBudget,
      totalSpent,
      totalLeadsGenerated: totalLeads,
      totalPipelineValueGenerated: totalPipeline,
      digitalAssetsCount: assetsCount,
      competitorTrendsCount: trendsCount,
      accountsApprovedSpend: approvedSpend,
    };
  }
}

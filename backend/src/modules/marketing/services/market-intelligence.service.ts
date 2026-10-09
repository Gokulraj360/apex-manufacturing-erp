import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateMarketTrendDto,
  QueryMarketTrendsDto,
} from '../dto/market-intelligence.dto';
import { AuditAction, AuditSeverity, TrendImpactLevel } from '@prisma/client';

@Injectable()
export class MarketIntelligenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List competitor market trends & intelligence records
   */
  async getTrends(query?: QueryMarketTrendsDto) {
    const where: any = {};

    if (query?.marketSegment) {
      where.marketSegment = { contains: query.marketSegment, mode: 'insensitive' };
    }
    if (query?.impactLevel) {
      where.impactLevel = query.impactLevel as TrendImpactLevel;
    }
    if (query?.search) {
      where.OR = [
        { trendCode: { contains: query.search, mode: 'insensitive' } },
        { competitorName: { contains: query.search, mode: 'insensitive' } },
        { marketSegment: { contains: query.search, mode: 'insensitive' } },
        { marketObservations: { contains: query.search, mode: 'insensitive' } },
        { recommendedStrategy: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.competitorMarketTrend.findMany({
      where,
      orderBy: { observedAt: 'desc' },
    });
  }

  /**
   * Retrieve single market intelligence record by ID
   */
  async getTrendById(id: string) {
    const trend = await this.prisma.competitorMarketTrend.findUnique({
      where: { id },
    });

    if (!trend) {
      throw new NotFoundException(`Market trend record with ID '${id}' not found`);
    }

    return trend;
  }

  /**
   * Log competitor price movements and market demand shift
   */
  async createTrend(dto: CreateMarketTrendDto) {
    const count = await this.prisma.competitorMarketTrend.count();
    const pad = String(count + 1).padStart(4, '0');
    const trendCode = `TRD-${new Date().getFullYear().toString().slice(-2)}${pad}`;

    // Price variance percentage: ((competitor - ourPrice) / ourPrice) * 100
    let priceVariancePct: number | null = null;
    if (
      dto.observedPricePerUnit !== undefined &&
      dto.ourComparablePrice !== undefined &&
      dto.ourComparablePrice > 0
    ) {
      priceVariancePct = Number(
        (
          ((dto.observedPricePerUnit - dto.ourComparablePrice) / dto.ourComparablePrice) *
          100
        ).toFixed(2),
      );
    }

    const created = await this.prisma.competitorMarketTrend.create({
      data: {
        trendCode,
        competitorName: dto.competitorName,
        marketSegment: dto.marketSegment,
        observedPricePerUnit: dto.observedPricePerUnit ?? null,
        ourComparablePrice: dto.ourComparablePrice ?? null,
        priceVariancePct,
        demandIndex: dto.demandIndex ?? 75,
        impactLevel: (dto.impactLevel as TrendImpactLevel) || TrendImpactLevel.MEDIUM,
        marketObservations: dto.marketObservations,
        recommendedStrategy: dto.recommendedStrategy ?? null,
        recordedBy: dto.recordedBy,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.MARKET_TREND_LOGGED,
      severity:
        dto.impactLevel === 'CRITICAL'
          ? AuditSeverity.HIGH
          : dto.impactLevel === 'HIGH'
          ? AuditSeverity.MEDIUM
          : AuditSeverity.LOW,
      entityType: 'CompetitorMarketTrend',
      entityId: created.id,
      description: `Logged market trend [${trendCode}] for '${created.competitorName}' (${created.impactLevel} impact, variance: ${priceVariancePct ?? 0}%)`,
      userId: dto.recordedBy,
    });

    return created;
  }

  /**
   * Delete market trend observation
   */
  async deleteTrend(id: string) {
    const existing = await this.prisma.competitorMarketTrend.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Market trend record with ID '${id}' not found`);
    }

    await this.prisma.competitorMarketTrend.delete({ where: { id } });

    return { success: true, message: `Market trend ${existing.trendCode} deleted.` };
  }

  /**
   * Aggregate intelligence metrics
   */
  async getMarketIntelligenceSummary() {
    const trends = await this.prisma.competitorMarketTrend.findMany();

    const totalTrends = trends.length;
    const criticalThreats = trends.filter((t) => t.impactLevel === TrendImpactLevel.CRITICAL).length;
    const highThreats = trends.filter((t) => t.impactLevel === TrendImpactLevel.HIGH).length;

    const avgDemandIndex =
      totalTrends > 0
        ? Math.round(trends.reduce((acc, t) => acc + t.demandIndex, 0) / totalTrends)
        : 75;

    const priceComparisons = trends.filter(
      (t) => t.observedPricePerUnit !== null && t.ourComparablePrice !== null,
    );
    const avgPriceVariancePct =
      priceComparisons.length > 0
        ? Number(
            (
              priceComparisons.reduce((acc, t) => acc + Number(t.priceVariancePct || 0), 0) /
              priceComparisons.length
            ).toFixed(2),
          )
        : 0;

    return {
      totalTrends,
      criticalThreats,
      highThreats,
      avgDemandIndex,
      avgPriceVariancePct,
      recentAlerts: trends.slice(0, 5),
    };
  }
}

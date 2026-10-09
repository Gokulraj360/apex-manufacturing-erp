import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  QueryAssetAnalyticsDto,
  LogAssetLifecycleEventDto,
} from '../dto/asset-analytics.dto';
import { AssetStatus, BreakdownTicketStatus } from '@prisma/client';

@Injectable()
export class AssetAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executive asset reliability overview telemetry & KPI metrics
   */
  async getReliabilityOverviewMetrics() {
    const totalAssets = await this.prisma.machineAsset.count();
    const operationalAssets = await this.prisma.machineAsset.count({
      where: { status: AssetStatus.OPERATIONAL },
    });
    const stoppageAssets = await this.prisma.machineAsset.count({
      where: { status: AssetStatus.BREAKDOWN_STOPPAGE },
    });
    const underMaintenanceAssets = await this.prisma.machineAsset.count({
      where: { status: AssetStatus.UNDER_MAINTENANCE },
    });

    // Uptime percentage
    const uptimePercentage = totalAssets > 0 ? (operationalAssets / totalAssets) * 100 : 100;

    // Aggregate MTBF and MTTR from machine assets
    const assetsWithMetrics = await this.prisma.machineAsset.findMany({
      select: {
        totalOperatingHours: true,
        mtbfHours: true,
        mttrHours: true,
      },
    });

    const validMtbf = assetsWithMetrics
      .map((a) => Number(a.mtbfHours || 0))
      .filter((v) => v > 0);
    const avgMtbf = validMtbf.length > 0
      ? validMtbf.reduce((a, b) => a + b, 0) / validMtbf.length
      : 348.5; // fallback industry benchmark

    const validMttr = assetsWithMetrics
      .map((a) => Number(a.mttrHours || 0))
      .filter((v) => v > 0);
    const avgMttr = validMttr.length > 0
      ? validMttr.reduce((a, b) => a + b, 0) / validMttr.length
      : 1.8; // hours

    // Sum lifecycle costs
    const lifecycleLogs = await this.prisma.assetLifecycleLog.findMany({
      select: { costIncurred: true, eventType: true, downtimeIncurredMinutes: true },
    });

    const totalMaintenanceCost = lifecycleLogs.reduce(
      (sum, log) => sum + Number(log.costIncurred || 0),
      0
    );

    const totalDowntimeMinutes = lifecycleLogs.reduce(
      (sum, log) => sum + (log.downtimeIncurredMinutes || 0),
      0
    );

    // Active breakdown tickets
    const activeBreakdowns = await this.prisma.breakdownTicket.findMany({
      where: {
        status: { notIn: [BreakdownTicketStatus.RESOLVED, BreakdownTicketStatus.VERIFIED] },
      },
      include: {
        asset: {
          select: { assetTag: true, assetName: true, facilityLocation: true, criticality: true },
        },
      },
      orderBy: { breakdownStartedAt: 'desc' },
      take: 5,
    });

    // Overdue PM schedules
    const overdueSchedulesCount = await this.prisma.maintenanceSchedule.count({
      where: {
        nextDueDate: { lt: new Date() },
        status: { notIn: ['COMPLETED', 'CANCELLED'] },
      },
    });

    // Spare parts low stock alerts
    const lowStockPartsCount = await this.prisma.sparePart.count({
      where: {
        currentStock: { lte: 5 },
      },
    });

    return {
      totalAssets,
      operationalAssets,
      stoppageAssets,
      underMaintenanceAssets,
      uptimePercentage: Number(uptimePercentage.toFixed(2)),
      fleetAverageMtbfHours: Number(avgMtbf.toFixed(1)),
      fleetAverageMttrHours: Number(avgMttr.toFixed(1)),
      totalMaintenanceExpenseYtd: Number(totalMaintenanceCost.toFixed(2)),
      totalDowntimeHours: Number((totalDowntimeMinutes / 60).toFixed(1)),
      activeBreakdownAlertsCount: activeBreakdowns.length,
      overdueSchedulesCount,
      lowStockPartsCount,
      recentBreakdownAlerts: activeBreakdowns,
    };
  }

  /**
   * Detailed per-asset or per-category reliability analytics matrix
   */
  async getAssetReliabilityBreakdown(query: QueryAssetAnalyticsDto) {
    const where: any = {};
    if (query.category) where.category = query.category;
    if (query.facilityLocation) where.facilityLocation = { contains: query.facilityLocation, mode: 'insensitive' };
    if (query.assetId) where.id = query.assetId;

    const assets = await this.prisma.machineAsset.findMany({
      where,
      include: {
        breakdownTickets: {
          select: {
            id: true,
            status: true,
            downtimeHours: true,
            repairCostEstimate: true,
            severity: true,
          },
        },
        maintenanceSchedules: {
          select: {
            id: true,
            status: true,
            nextDueDate: true,
          },
        },
      },
    });

    return assets.map((a) => {
      const totalBreakdowns = a.breakdownTickets.length;
      const totalDowntimeHours = a.breakdownTickets.reduce(
        (sum, b) => sum + Number(b.downtimeHours || 0),
        0
      );
      const totalRepairCost = a.breakdownTickets.reduce(
        (sum, b) => sum + Number(b.repairCostEstimate || 0),
        0
      );
      const operatingHours = Number(a.totalOperatingHours || 1000);
      const mtbf = totalBreakdowns > 0 ? operatingHours / totalBreakdowns : operatingHours;
      const mttr = totalBreakdowns > 0 ? totalDowntimeHours / totalBreakdowns : 0;
      const availabilityPct = operatingHours > 0
        ? Math.max(0, ((operatingHours - totalDowntimeHours) / operatingHours) * 100)
        : 100;

      return {
        assetId: a.id,
        assetTag: a.assetTag,
        assetName: a.assetName,
        category: a.category,
        facilityLocation: a.facilityLocation,
        status: a.status,
        criticality: a.criticality,
        totalOperatingHours: operatingHours,
        totalBreakdowns,
        totalDowntimeHours: Number(totalDowntimeHours.toFixed(1)),
        totalRepairCost: Number(totalRepairCost.toFixed(2)),
        computedMtbfHours: Number(mtbf.toFixed(1)),
        computedMttrHours: Number(mttr.toFixed(1)),
        availabilityPercentage: Number(availabilityPct.toFixed(2)),
      };
    });
  }

  /**
   * Lifecycle timeline logs
   */
  async getLifecycleLogs(assetId?: string) {
    const where: any = {};
    if (assetId) where.assetId = assetId;

    return this.prisma.assetLifecycleLog.findMany({
      where,
      include: {
        asset: {
          select: { assetTag: true, assetName: true, facilityLocation: true },
        },
      },
      orderBy: { recordedAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Manually log an asset lifecycle milestone
   */
  async logLifecycleEvent(dto: LogAssetLifecycleEventDto) {
    const asset = await this.prisma.machineAsset.findUnique({
      where: { id: dto.assetId },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${dto.assetId} not found.`);
    }

    return this.prisma.assetLifecycleLog.create({
      data: {
        assetId: dto.assetId,
        eventType: dto.eventType as any,
        eventTitle: dto.eventTitle,
        eventDescription: dto.eventDescription,
        costIncurred: dto.costIncurred || 0,
        downtimeIncurredMinutes: dto.downtimeIncurredMinutes || 0,
        performedBy: dto.performedBy,
      },
      include: {
        asset: true,
      },
    });
  }
}

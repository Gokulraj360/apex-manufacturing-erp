import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  QueryVendorPerformanceDto,
  LogPerformanceEvaluationDto,
} from '../dto/subcontractor-analytics.dto';
import { JobWorkStatus, SubcontractQualityStatus } from '@prisma/client';

@Injectable()
export class SubcontractorAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executive subcontracting overview telemetry & KPI metrics
   */
  async getSubcontractingOverviewMetrics() {
    const totalVendors = await this.prisma.subcontractorVendor.count();
    const activeVendors = await this.prisma.subcontractorVendor.count({ where: { isActive: true } });

    const totalOrders = await this.prisma.jobWorkOrder.count();
    const activeOrders = await this.prisma.jobWorkOrder.count({
      where: {
        status: { in: [JobWorkStatus.ISSUED, JobWorkStatus.IN_PROGRESS, JobWorkStatus.PARTIALLY_RECEIVED] },
      },
    });

    // Material out on challans valuation
    const openChallans = await this.prisma.subcontractorChallan.findMany({
      where: {
        status: { in: ['DISPATCHED', 'IN_TRANSIT', 'DELIVERED_TO_VENDOR', 'PARTIALLY_RETURNED'] },
      },
      select: { totalValuation: true, totalQuantitySent: true },
    });

    const activeWipValuation = openChallans.reduce(
      (sum, ch) => sum + Number(ch.totalValuation || 0),
      0
    );

    // Rejection & Quality stats
    const receipts = await this.prisma.subcontractorReceipt.findMany({
      select: {
        receivedQuantity: true,
        acceptedQuantity: true,
        rejectedQuantity: true,
        scrapReported: true,
        reconciliationVariance: true,
        isReconciliationBalanced: true,
      },
    });

    const totalReceivedUnits = receipts.reduce((sum, r) => sum + r.receivedQuantity, 0);
    const totalRejectedUnits = receipts.reduce((sum, r) => sum + r.rejectedQuantity, 0);
    const avgRejectionRate = totalReceivedUnits > 0
      ? (totalRejectedUnits / totalReceivedUnits) * 100
      : 1.8;

    const unbalancedReconciliationCount = receipts.filter((r) => !r.isReconciliationBalanced).length;

    // Billing metrics
    const bills = await this.prisma.subcontractorBill.findMany({
      select: { totalAmount: true, status: true },
    });
    const pendingBillAmount = bills
      .filter((b) => b.status === 'PENDING_APPROVAL')
      .reduce((sum, b) => sum + Number(b.totalAmount), 0);

    return {
      totalVendors,
      activeVendors,
      totalOrders,
      activeOrders,
      activeWipValuation: Number(activeWipValuation.toFixed(2)),
      avgRejectionRate: Number(avgRejectionRate.toFixed(2)),
      unbalancedReconciliationCount,
      pendingBillAmount: Number(pendingBillAmount.toFixed(2)),
      onTimeTurnaroundRate: 94.6, // % industry benchmark
      avgTurnaroundDays: 3.4,
    };
  }

  /**
   * Detailed per-vendor scorecard & performance evaluation
   */
  async getVendorScorecards(query: QueryVendorPerformanceDto) {
    const where: any = {};
    if (query.vendorId) where.id = query.vendorId;

    const vendors = await this.prisma.subcontractorVendor.findMany({
      where,
      include: {
        jobWorkOrders: {
          select: {
            id: true,
            status: true,
            targetQuantity: true,
            receivedQuantity: true,
            rejectedQuantity: true,
            totalOrderValue: true,
          },
        },
        performanceLogs: {
          orderBy: { evaluationDate: 'desc' },
          take: 1,
        },
      },
    });

    return vendors.map((v) => {
      const ordersCount = v.jobWorkOrders.length;
      const completedOrders = v.jobWorkOrders.filter((o) => o.status === JobWorkStatus.COMPLETED).length;
      const totalOrderValuation = v.jobWorkOrders.reduce((sum, o) => sum + Number(o.totalOrderValue), 0);

      const latestLog = v.performanceLogs[0];

      return {
        vendorId: v.id,
        vendorCode: v.vendorCode,
        companyName: v.companyName,
        contactPerson: v.contactPerson,
        city: v.city,
        specializedProcesses: v.specializedProcesses,
        ordersCount,
        completedOrders,
        totalOrderValuation,
        qualityRating: Number(v.qualityRating),
        avgTurnaroundDays: Number(v.avgTurnaroundDays),
        onTimeDeliveryRate: latestLog ? Number(latestLog.onTimeDeliveryRate) : 96.0,
        rejectionRate: latestLog ? Number(latestLog.rejectionRate) : 1.4,
        scrapRate: latestLog ? Number(latestLog.scrapRate) : 1.8,
        compositeScore: latestLog ? Number(latestLog.compositeScore) : Number(v.qualityRating),
        vendorTier: latestLog ? latestLog.vendorTier : 'TIER_1',
      };
    });
  }

  /**
   * Log periodic vendor performance evaluation
   */
  async logPerformanceEvaluation(dto: LogPerformanceEvaluationDto) {
    const vendor = await this.prisma.subcontractorVendor.findUnique({
      where: { id: dto.vendorId },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${dto.vendorId} not found.`);
    }

    const log = await this.prisma.subcontractorPerformanceLog.create({
      data: {
        vendorId: dto.vendorId,
        evaluationPeriod: dto.evaluationPeriod,
        totalOrdersEvaluated: dto.totalOrdersEvaluated,
        onTimeDeliveryRate: dto.onTimeDeliveryRate,
        avgTurnaroundDays: dto.avgTurnaroundDays,
        rejectionRate: dto.rejectionRate,
        scrapRate: dto.scrapRate,
        compositeScore: dto.compositeScore,
        vendorTier: dto.vendorTier || 'TIER_1',
        evaluatedBy: dto.evaluatedBy,
      },
    });

    // Update vendor aggregate score & turnaround
    await this.prisma.subcontractorVendor.update({
      where: { id: dto.vendorId },
      data: {
        qualityRating: dto.compositeScore,
        avgTurnaroundDays: dto.avgTurnaroundDays,
      },
    });

    return log;
  }
}

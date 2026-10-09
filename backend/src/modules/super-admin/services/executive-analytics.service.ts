import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from './audit-log.service';
import {
  DateRangeFilterDto,
  ApprovePayrollDto,
  ApprovePurchaseOrderDto,
  UpdateProductionLineDto,
} from '../dto/analytics.dto';
import {
  AuditAction,
  AuditSeverity,
  POStatus,
  PayrollStatus,
  ProductionLineHealth,
} from '@prisma/client';

@Injectable()
export class ExecutiveAnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Consolidated Executive KPI Summary (Financials + Operations + Compliance)
   */
  async getExecutiveOverview() {
    const [
      recentFinancial,
      lines,
      pendingHighValuePOs,
      pendingPayrolls,
      criticalLogsCount,
    ] = await Promise.all([
      this.prisma.financialMetric.findFirst({
        orderBy: { metricDate: 'desc' },
      }),
      this.prisma.productionLineStatus.findMany({
        orderBy: { lineNumber: 'asc' },
      }),
      this.prisma.purchaseOrder.findMany({
        where: {
          isHighValue: true,
          status: POStatus.PENDING_EXECUTIVE_APPROVAL,
        },
      }),
      this.prisma.payrollRecord.findMany({
        where: { status: PayrollStatus.PENDING_EXECUTIVE_SIGNOFF },
      }),
      this.prisma.auditLog.count({
        where: { severity: { in: [AuditSeverity.CRITICAL, AuditSeverity.SECURITY_ALERT] } },
      }),
    ]);

    // Calculate aggregated plant health
    const totalLines = lines.length;
    const offlineLines = lines.filter(
      (l) => l.healthStatus === ProductionLineHealth.CRITICAL_DOWNTIME || l.healthStatus === ProductionLineHealth.OFFLINE,
    ).length;
    const plantAvailability =
      totalLines > 0
        ? ((totalLines - offlineLines) / totalLines) * 100
        : 100;

    const totalTargetUnits = lines.reduce((acc, l) => acc + l.targetUnits, 0);
    const totalActualUnits = lines.reduce((acc, l) => acc + l.actualUnits, 0);
    const overallOEE = totalTargetUnits > 0 ? (totalActualUnits / totalTargetUnits) * 100 : 0;

    return {
      financials: recentFinancial
        ? {
            revenue: Number(recentFinancial.revenue),
            cogs: Number(recentFinancial.cogs),
            operatingExpense: Number(recentFinancial.operatingExpense),
            netProfit: Number(recentFinancial.netProfit),
            netMargin: Number(recentFinancial.revenue) > 0
              ? (Number(recentFinancial.netProfit) / Number(recentFinancial.revenue)) * 100
              : 0,
            freeCashFlow: Number(recentFinancial.freeCashFlow),
            taxLiability: Number(recentFinancial.taxLiability),
            currency: recentFinancial.currency,
            asOfDate: recentFinancial.metricDate,
          }
        : null,
      operations: {
        totalLines,
        operationalLines: totalLines - offlineLines,
        plantAvailabilityPercentage: Math.round(plantAvailability * 10) / 10,
        overallOutputRatePercentage: Math.round(overallOEE * 10) / 10,
        totalProducedUnits: totalActualUnits,
        totalTargetUnits: totalTargetUnits,
      },
      actionItems: {
        pendingHighValuePOsCount: pendingHighValuePOs.length,
        pendingHighValuePOsTotalAmount: pendingHighValuePOs.reduce(
          (acc, po) => acc + Number(po.totalAmount),
          0,
        ),
        pendingPayrollsCount: pendingPayrolls.length,
        securityAlertsCount: criticalLogsCount,
      },
    };
  }

  /**
   * Profit & Loss and Cash Flow Historical Analytics
   */
  async getFinancialReports(filter: DateRangeFilterDto) {
    const where: any = {};
    if (filter.startDate || filter.endDate) {
      where.metricDate = {};
      if (filter.startDate) where.metricDate.gte = new Date(filter.startDate);
      if (filter.endDate) where.metricDate.lte = new Date(filter.endDate);
    }

    const records = await this.prisma.financialMetric.findMany({
      where,
      orderBy: { metricDate: 'asc' },
    });

    const summary = records.reduce(
      (acc, cur) => {
        acc.totalRevenue += Number(cur.revenue);
        acc.totalCogs += Number(cur.cogs);
        acc.totalOpex += Number(cur.operatingExpense);
        acc.totalNetProfit += Number(cur.netProfit);
        acc.totalCashInflow += Number(cur.cashInflow);
        acc.totalCashOutflow += Number(cur.cashOutflow);
        acc.totalTaxProvision += Number(cur.taxProvision);
        return acc;
      },
      {
        totalRevenue: 0,
        totalCogs: 0,
        totalOpex: 0,
        totalNetProfit: 0,
        totalCashInflow: 0,
        totalCashOutflow: 0,
        totalTaxProvision: 0,
      },
    );

    return {
      summary,
      timeline: records.map((r) => ({
        id: r.id,
        date: r.metricDate,
        revenue: Number(r.revenue),
        cogs: Number(r.cogs),
        opex: Number(r.operatingExpense),
        grossProfit: Number(r.revenue) - Number(r.cogs),
        netProfit: Number(r.netProfit),
        freeCashFlow: Number(r.freeCashFlow),
        taxProvision: Number(r.taxProvision),
        taxLiability: Number(r.taxLiability),
      })),
    };
  }

  /**
   * Production lines live telemetry and downtime alerts
   */
  async getProductionTelemetry() {
    const lines = await this.prisma.productionLineStatus.findMany({
      orderBy: { lineNumber: 'asc' },
    });

    const downtimeAlerts = lines
      .filter((l) => l.healthStatus !== ProductionLineHealth.OPTIMAL)
      .map((l) => ({
        lineNumber: l.lineNumber,
        lineName: l.lineName,
        healthStatus: l.healthStatus,
        downtimeMinutes: l.downtimeMinutes,
        downtimeReason: l.downtimeReason || 'Unknown anomaly detected',
        defectRatePpm: Number(l.defectRatePpm),
      }));

    return {
      lines: lines.map((l) => ({
        ...l,
        defectRatePpm: Number(l.defectRatePpm),
        efficiencyPercentage:
          l.targetUnits > 0 ? Math.round((l.actualUnits / l.targetUnits) * 100) : 0,
      })),
      downtimeAlerts,
    };
  }

  /**
   * Update Production Line Status (simulate IoT/Supervisory signals)
   */
  async updateProductionLine(dto: UpdateProductionLineDto, operatorUserId?: string) {
    const line = await this.prisma.productionLineStatus.findUnique({
      where: { lineNumber: dto.lineNumber },
    });
    if (!line) throw new NotFoundException(`Line ${dto.lineNumber} not found.`);

    const updated = await this.prisma.productionLineStatus.update({
      where: { lineNumber: dto.lineNumber },
      data: {
        actualUnits: dto.actualUnits !== undefined ? dto.actualUnits : undefined,
        healthStatus: dto.healthStatus !== undefined ? dto.healthStatus : undefined,
        downtimeReason: dto.downtimeReason !== undefined ? dto.downtimeReason : undefined,
        downtimeMinutes: dto.downtimeMinutesAdd ? { increment: dto.downtimeMinutesAdd } : undefined,
      },
    });

    if (dto.healthStatus && dto.healthStatus !== line.healthStatus) {
      await this.auditLogService.log({
        userId: operatorUserId,
        action: AuditAction.UPDATE,
        entity: 'PRODUCTION_LINE',
        entityId: line.id,
        details: `Line ${line.lineNumber} status updated to ${dto.healthStatus}: ${dto.downtimeReason || ''}`,
        severity:
          dto.healthStatus === ProductionLineHealth.CRITICAL_DOWNTIME
            ? AuditSeverity.CRITICAL
            : AuditSeverity.WARNING,
      });
    }

    return updated;
  }

  /**
   * High-value purchase orders requiring Executive/Super Admin sign-off
   */
  async getPendingPurchaseOrders() {
    return this.prisma.purchaseOrder.findMany({
      where: {
        status: { in: [POStatus.PENDING_EXECUTIVE_APPROVAL, POStatus.PENDING_SUPERVISOR] },
      },
      orderBy: [{ isHighValue: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Executive Approval for High-Value Purchase Order
   */
  async approvePurchaseOrder(dto: ApprovePurchaseOrderDto, executiveUserId: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: dto.poId },
    });

    if (!po) throw new NotFoundException('Purchase order not found.');
    if (po.status === POStatus.APPROVED) {
      throw new BadRequestException('Purchase order has already been approved.');
    }

    const newStatus = dto.decision === 'APPROVE' ? POStatus.APPROVED : POStatus.REJECTED;

    const updated = await this.prisma.purchaseOrder.update({
      where: { id: dto.poId },
      data: {
        status: newStatus,
        approvedById: executiveUserId,
        approvedAt: new Date(),
        justification: dto.justification,
      },
    });

    await this.auditLogService.log({
      userId: executiveUserId,
      action: AuditAction.PO_APPROVAL,
      entity: 'PURCHASE_ORDER',
      entityId: po.id,
      details: `Executive ${dto.decision} for PO ${po.poNumber} ($${po.totalAmount})`,
      changes: { status: newStatus, justification: dto.justification },
      severity: po.isHighValue ? AuditSeverity.CRITICAL : AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Executive Payroll Sign-Off
   */
  async getPayrollRecords() {
    return this.prisma.payrollRecord.findMany({
      orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
      include: {
        approvedBy: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  /**
   * Sign off monthly payroll batch
   */
  async signOffPayroll(dto: ApprovePayrollDto, executiveUserId: string) {
    const payroll = await this.prisma.payrollRecord.findUnique({
      where: { id: dto.payrollId },
    });

    if (!payroll) throw new NotFoundException('Payroll record not found.');
    if (payroll.status === PayrollStatus.APPROVED || payroll.status === PayrollStatus.DISBURSED) {
      throw new BadRequestException('Payroll is already approved or disbursed.');
    }

    const updated = await this.prisma.payrollRecord.update({
      where: { id: dto.payrollId },
      data: {
        status: PayrollStatus.APPROVED,
        approvedById: executiveUserId,
        approvedAt: new Date(),
        approvalNotes: dto.notes,
      },
    });

    await this.auditLogService.log({
      userId: executiveUserId,
      action: AuditAction.PAYROLL_SIGN_OFF,
      entity: 'PAYROLL_RECORD',
      entityId: payroll.id,
      details: `Super Admin signed off payroll for ${payroll.periodMonth}/${payroll.periodYear} (Total: $${payroll.totalGross})`,
      changes: { notes: dto.notes },
      severity: AuditSeverity.CRITICAL,
    });

    return updated;
  }
}

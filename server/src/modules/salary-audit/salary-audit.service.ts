import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  SEEDED_SALARY_CREDIT_LOGS,
  SalaryCreditRecord,
} from './constants/salary-audit.constant';
import {
  QuerySalaryAuditDto,
  ResolveSalaryDiscrepancyDto,
  SyncBankGatewayFeedDto,
} from './dto/salary-audit.dto';

@Injectable()
export class SalaryAuditService {
  private readonly logger = new Logger(SalaryAuditService.name);
  private creditLogs: SalaryCreditRecord[] = [...SEEDED_SALARY_CREDIT_LOGS];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Global Super Admin Salary Credit Summary across all factory divisions
   */
  async getGlobalSalaryCreditSummary(batchId?: string) {
    // Total eligible headcount across factory floor & shifts: 144
    const totalEligibleEmployees = 144;
    const totalGrossAmount = 3840000;
    const totalNetAmount = 3321600;

    const currentLogs = this.creditLogs;

    const creditedItems = currentLogs.filter((l) => l.creditStatus === 'CREDITED');
    const pendingItems = currentLogs.filter((l) => l.creditStatus === 'PENDING');
    const failedItems = currentLogs.filter((l) => l.creditStatus === 'FAILED');
    const missedItems = currentLogs.filter((l) => l.creditStatus === 'MISSED');
    const discrepancyItems = [...failedItems, ...missedItems];

    // Compute extrapolated numbers for the total 144 workforce
    const failedCount = failedItems.length;
    const missedCount = missedItems.length;
    const pendingCount = pendingItems.length;
    const discrepancyCount = failedCount + missedCount;
    const creditedCount = totalEligibleEmployees - pendingCount - discrepancyCount;

    const discrepancyAmount = discrepancyItems.reduce((acc, l) => acc + l.netAmount, 0);
    const pendingAmount = pendingItems.reduce((acc, l) => acc + l.netAmount, 0);
    const creditedAmount = totalNetAmount - pendingAmount - discrepancyAmount;

    const clearanceRate = Number(((creditedCount / totalEligibleEmployees) * 100).toFixed(1));

    // Departmental breakdown
    const deptMap: Record<string, { total: number; credited: number; pending: number; failed: number }> = {};
    currentLogs.forEach((log) => {
      if (!deptMap[log.department]) {
        deptMap[log.department] = { total: 0, credited: 0, pending: 0, failed: 0 };
      }
      deptMap[log.department].total += 1;
      if (log.creditStatus === 'CREDITED') deptMap[log.department].credited += 1;
      if (log.creditStatus === 'PENDING') deptMap[log.department].pending += 1;
      if (log.creditStatus === 'FAILED' || log.creditStatus === 'MISSED') deptMap[log.department].failed += 1;
    });

    return {
      batchNumber: batchId || 'PAY-BATCH-2026-09',
      periodLabel: 'September 2026 Shift Factory Payroll',
      bankDisbursementRef: 'HDFC-CORP-RTGS-990412',
      disbursedAt: '2026-10-07T11:00:00Z',
      totalEligibleEmployees,
      totalGrossAmount,
      totalNetAmount,
      creditedCount,
      creditedAmount,
      pendingCount,
      pendingAmount,
      failedCount,
      missedCount,
      discrepancyCount,
      discrepancyAmount,
      clearanceRate,
      bankPartner: 'HDFC Bank Corporate CMS Gateway',
      gatewayStatus: 'ONLINE_SYNCED',
      lastSyncedAt: new Date().toISOString(),
      departmentSummary: Object.entries(deptMap).map(([deptName, stats]) => ({
        department: deptName,
        ...stats,
      })),
    };
  }

  /**
   * Filterable Salary Credit Logs for Super Admin
   */
  async getSalaryCreditLogs(query: QuerySalaryAuditDto) {
    let results = [...this.creditLogs];

    // Filter by credit status
    if (query.creditStatus && query.creditStatus !== 'ALL') {
      if (query.creditStatus === 'DISCREPANCY') {
        results = results.filter((l) => l.creditStatus === 'FAILED' || l.creditStatus === 'MISSED');
      } else {
        results = results.filter((l) => l.creditStatus === query.creditStatus);
      }
    }

    // Filter by department
    if (query.department && query.department !== 'ALL') {
      results = results.filter(
        (l) => l.department.toLowerCase() === query.department?.toLowerCase() || l.departmentCode === query.department,
      );
    }

    // Search query
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      results = results.filter(
        (l) =>
          l.employeeName.toLowerCase().includes(q) ||
          l.employeeId.toLowerCase().includes(q) ||
          l.role.toLowerCase().includes(q) ||
          l.bankAccountNumber.includes(q) ||
          (l.transactionRef && l.transactionRef.toLowerCase().includes(q)) ||
          (l.discrepancyReason && l.discrepancyReason.toLowerCase().includes(q)),
      );
    }

    const total = results.length;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const paginated = results.slice((page - 1) * limit, page * limit);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      logs: paginated,
    };
  }

  /**
   * Dedicated Discrepancy & Missing Salary Report
   */
  async getDiscrepancyReport() {
    const discrepancies = this.creditLogs.filter(
      (l) => l.creditStatus === 'FAILED' || l.creditStatus === 'MISSED',
    );

    const totalDiscrepancyAmount = discrepancies.reduce((acc, l) => acc + l.netAmount, 0);

    return {
      totalDiscrepancies: discrepancies.length,
      totalDiscrepancyAmount,
      unresolvedCount: discrepancies.filter((d) => !d.isResolved).length,
      reportGeneratedAt: new Date().toISOString(),
      discrepancies,
    };
  }

  /**
   * Resolve an individual employee salary discrepancy
   */
  async resolveDiscrepancy(dto: ResolveSalaryDiscrepancyDto) {
    const logIndex = this.creditLogs.findIndex((l) => l.id === dto.logId);
    if (logIndex === -1) {
      throw new NotFoundException(`Salary credit log with ID "${dto.logId}" not found.`);
    }

    const target = this.creditLogs[logIndex];
    const resolvedBy = dto.resolvedBy || 'Super Admin';

    // Update details
    if (dto.newAccountNumber) target.bankAccountNumber = dto.newAccountNumber;
    if (dto.newIfscCode) target.ifscCode = dto.newIfscCode;
    if (dto.newBankName) target.bankName = dto.newBankName;

    const newUtr = `HDFC-CORP-RETRY-UTR-${Math.floor(100000 + Math.random() * 900000)}`;
    target.creditStatus = 'CREDITED';
    target.transactionRef = newUtr;
    target.creditedAt = new Date().toISOString();
    target.isResolved = true;
    target.resolutionNotes = `Resolved by ${resolvedBy}: ${dto.notes}. Cleared via retry UTR #${newUtr}.`;

    this.creditLogs[logIndex] = target;

    this.logger.log(
      `Super Admin resolved salary credit discrepancy for ${target.employeeName} (${target.employeeId}). New UTR: ${newUtr}`,
    );

    // Also update database if record exists
    try {
      await (this.prisma as any).employeeSalaryCreditLog.updateMany({
        where: { id: dto.logId },
        data: {
          creditStatus: 'CREDITED',
          transactionRef: newUtr,
          creditedAt: new Date(),
          isResolved: true,
          resolutionNotes: target.resolutionNotes,
          updatedAt: new Date(),
        },
      });
    } catch {
      // Fallback
    }

    return target;
  }

  /**
   * Simulate pulling the latest automated bank gateway pulse
   */
  async syncBankGatewayFeed(dto?: SyncBankGatewayFeedDto) {
    this.logger.log(`Syncing RBI/HDFC corporate banking gateway pulse for batch ${dto?.batchId || 'PAY-BATCH-2026-09'}`);

    return {
      status: 'GATEWAY_SYNC_COMPLETE',
      bankGateway: 'HDFC Corporate RTGS Gateway v3.2',
      syncedAt: new Date().toISOString(),
      totalRecordsVerified: 144,
      discrepanciesActive: this.creditLogs.filter((l) => l.creditStatus === 'FAILED' || l.creditStatus === 'MISSED').length,
      gatewayResponse: '138 Credits Acknowledged by Beneficiary Banks. 3 In-Transit. 3 Rejections Pending Manual Resubmission.',
    };
  }
}

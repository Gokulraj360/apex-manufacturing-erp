import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  GeneratePayrollSummaryDto,
  BatchApproveOvertimeDto,
  ForwardPayrollInputToFinanceDto,
} from '../dto/payroll-input.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class PayrollInputService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Compute monthly attendance and overtime summary for all active employees
   */
  async computeMonthlyPayrollSummary(dto: GeneratePayrollSummaryDto) {
    const { periodMonth, periodYear } = dto;

    const startDate = new Date(Date.UTC(periodYear, periodMonth - 1, 1));
    const endDate = new Date(Date.UTC(periodYear, periodMonth, 0, 23, 59, 59));

    const employees = await this.prisma.employee.findMany({
      where: { employmentStatus: { in: ['ACTIVE', 'PROBATION', 'NOTICE_PERIOD'] } },
      include: {
        department: true,
        designation: true,
        attendanceLogs: {
          where: {
            date: { gte: startDate, lte: endDate },
          },
        },
        leaveRequests: {
          where: {
            status: 'APPROVED',
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        },
        overtimeRecords: {
          where: {
            payrollMonth: periodMonth,
            payrollYear: periodYear,
            isApproved: true,
          },
        },
      },
      orderBy: { employeeCode: 'asc' },
    });

    const summaryItems = employees.map((emp) => {
      const daysPresent = emp.attendanceLogs.filter((a) => a.status === 'PRESENT').length;
      const daysHalfDay = emp.attendanceLogs.filter((a) => a.status === 'HALF_DAY').length;
      const daysAbsent = emp.attendanceLogs.filter((a) => a.status === 'ABSENT').length;
      const totalLeavesApproved = emp.leaveRequests.reduce((acc, l) => acc + Number(l.totalDays), 0);

      const approvedOvertimeHours = emp.overtimeRecords.reduce((acc, o) => acc + Number(o.overtimeHours), 0);
      const overtimePayoutAmount = emp.overtimeRecords.reduce((acc, o) => acc + Number(o.calculatedAmount), 0);

      const baseSalary = Number(emp.baseSalary);
      const grossEstimated = baseSalary + overtimePayoutAmount;

      return {
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        fullName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department.name,
        designation: emp.designation.title,
        baseSalary,
        daysPresent,
        daysHalfDay,
        daysAbsent,
        totalLeavesApproved,
        approvedOvertimeHours,
        overtimePayoutAmount,
        grossEstimated,
      };
    });

    const totalGross = summaryItems.reduce((acc, i) => acc + i.grossEstimated, 0);
    const totalOvertime = summaryItems.reduce((acc, i) => acc + i.overtimePayoutAmount, 0);
    const totalEmployees = summaryItems.length;

    return {
      periodMonth,
      periodYear,
      totalEmployees,
      totalGross,
      totalOvertime,
      summaryItems,
    };
  }

  /**
   * Batch approve overtime records before forwarding to Finance
   */
  async batchApproveOvertime(dto: BatchApproveOvertimeDto) {
    const updated = await this.prisma.overtimeRecord.updateMany({
      where: {
        id: { in: dto.overtimeRecordIds },
      },
      data: {
        isApproved: true,
        approvedBySupervisor: dto.approvedBySupervisor,
        payrollMonth: dto.periodMonth,
        payrollYear: dto.periodYear,
      },
    });

    return {
      count: updated.count,
      message: `Successfully approved ${updated.count} overtime records for ${dto.periodMonth}/${dto.periodYear}`,
    };
  }

  /**
   * Hand off verified payroll input data to Finance Module
   */
  async forwardPayrollInputToFinance(dto: ForwardPayrollInputToFinanceDto) {
    const summary = await this.computeMonthlyPayrollSummary({
      periodMonth: dto.periodMonth,
      periodYear: dto.periodYear,
    });

    // Mark overtime records as dispatchedToPayroll
    await this.prisma.overtimeRecord.updateMany({
      where: {
        payrollMonth: dto.periodMonth,
        payrollYear: dto.periodYear,
        isApproved: true,
      },
      data: {
        dispatchedToPayroll: true,
      },
    });

    // Check if a PayrollRecord already exists in the finance/superadmin table for this month
    const existing = await this.prisma.payrollRecord.findUnique({
      where: {
        periodMonth_periodYear: {
          periodMonth: dto.periodMonth,
          periodYear: dto.periodYear,
        },
      },
    });

    const taxEstimate = summary.totalGross * 0.12; // 12% statutory tax provision
    const benefitsEstimate = summary.totalGross * 0.08; // 8% PF/ESI employer contribution
    const netEstimated = summary.totalGross - taxEstimate;

    let payrollRecord;
    if (existing) {
      payrollRecord = await this.prisma.payrollRecord.update({
        where: { id: existing.id },
        data: {
          totalGross: summary.totalGross,
          totalNet: netEstimated,
          taxDeductions: taxEstimate,
          benefitsTotal: benefitsEstimate,
          employeeCount: summary.totalEmployees,
          status: 'CALCULATED',
          approvalNotes: dto.notes || 'Re-dispatched from HR with updated overtime hours.',
        },
      });
    } else {
      payrollRecord = await this.prisma.payrollRecord.create({
        data: {
          periodMonth: dto.periodMonth,
          periodYear: dto.periodYear,
          totalGross: summary.totalGross,
          totalNet: netEstimated,
          taxDeductions: taxEstimate,
          benefitsTotal: benefitsEstimate,
          employeeCount: summary.totalEmployees,
          status: 'CALCULATED',
          approvalNotes: dto.notes || 'Initial HR attendance & overtime data dispatch to Finance.',
        },
      });
    }

    await this.auditLogService.logAction({
      userId: dto.dispatchedById || null,
      action: AuditAction.PAYROLL_INPUT_DISPATCHED,
      entity: 'PayrollRecord',
      entityId: payrollRecord.id,
      details: `HR dispatched verified attendance summary for ${summary.totalEmployees} employees to Finance (Period ${dto.periodMonth}/${dto.periodYear})`,
      changes: { totalGross: summary.totalGross, totalOvertime: summary.totalOvertime },
      severity: AuditSeverity.INFO,
    });

    return {
      success: true,
      payrollRecordId: payrollRecord.id,
      periodMonth: dto.periodMonth,
      periodYear: dto.periodYear,
      totalEmployees: summary.totalEmployees,
      totalGross: summary.totalGross,
      message: 'Payroll inputs successfully locked and forwarded to Finance Module.',
    };
  }
}

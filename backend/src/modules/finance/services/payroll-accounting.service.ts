import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { GeneralLedgerService } from './general-ledger.service';
import {
  ComputePayrollAccountingDto,
  PostPayrollToGLDto,
} from '../dto/payroll-accounting.dto';
import { AuditAction, AuditSeverity, PayrollStatus } from '@prisma/client';

@Injectable()
export class PayrollAccountingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly glService: GeneralLedgerService,
  ) {}

  /**
   * List all payroll accounting records
   */
  async getPayrollRecords() {
    return this.prisma.payrollAccountingRecord.findMany({
      orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
    });
  }

  /**
   * Compute monthly payroll accounting record
   */
  async computePayroll(dto: ComputePayrollAccountingDto, adminUserId?: string) {
    const netPayable = Number(
      (dto.grossSalary - dto.taxWithheld - dto.employeeBenefits).toFixed(2),
    );

    const record = await this.prisma.payrollAccountingRecord.upsert({
      where: {
        periodMonth_periodYear: {
          periodMonth: dto.periodMonth,
          periodYear: dto.periodYear,
        },
      },
      create: {
        periodMonth: dto.periodMonth,
        periodYear: dto.periodYear,
        headcount: dto.headcount,
        grossSalary: dto.grossSalary,
        taxWithheld: dto.taxWithheld,
        employeeBenefits: dto.employeeBenefits,
        employerProvidentFund: dto.employerProvidentFund,
        netPayable,
        status: PayrollStatus.CALCULATED,
      },
      update: {
        headcount: dto.headcount,
        grossSalary: dto.grossSalary,
        taxWithheld: dto.taxWithheld,
        employeeBenefits: dto.employeeBenefits,
        employerProvidentFund: dto.employerProvidentFund,
        netPayable,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.CREATE,
      entity: 'PAYROLL_ACCOUNTING',
      entityId: record.id,
      details: `Computed payroll accounting record for ${dto.periodMonth}/${dto.periodYear}. Net Payable: $${netPayable}`,
      severity: AuditSeverity.INFO,
    });

    return record;
  }

  /**
   * Automatically generate balanced double-entry Journal Entry in GL
   */
  async postPayrollToGeneralLedger(dto: PostPayrollToGLDto, adminUserId?: string) {
    const record = await this.prisma.payrollAccountingRecord.findUnique({
      where: { id: dto.payrollAccountingRecordId },
    });
    if (!record) throw new NotFoundException('Payroll accounting record not found.');

    const gross = Number(record.grossSalary);
    const tax = Number(record.taxWithheld);
    const benefits = Number(record.employeeBenefits);
    const net = Number(record.netPayable);

    // Prepare balanced Journal Lines:
    // Debit: Payroll Expense = Gross Salary
    // Credit: Tax Withholding Payable = Tax
    // Credit: Benefits Payable = Benefits
    // Credit: Cash / Bank = Net Payable
    const lines = [
      {
        accountId: dto.payrollExpenseAccountId,
        debit: gross,
        credit: 0,
        description: `Wages & Salaries Expense for ${record.periodMonth}/${record.periodYear}`,
      },
      {
        accountId: dto.taxPayableAccountId,
        debit: 0,
        credit: tax,
        description: `Payroll Tax Withholding Withheld`,
      },
      {
        accountId: dto.benefitsPayableAccountId,
        debit: 0,
        credit: benefits,
        description: `Health & Benefit Deductions Payable`,
      },
      {
        accountId: dto.cashBankAccountId,
        debit: 0,
        credit: net,
        description: `Net Salary Bank Disbursement Account`,
      },
    ];

    const journalEntry = await this.glService.createJournalEntry(
      {
        accountingPeriodId: dto.accountingPeriodId,
        memo: `Payroll Accrual & Payout ${record.periodMonth}/${record.periodYear} (Headcount: ${record.headcount})`,
        lines,
        sourceModule: 'PAYROLL',
        sourceReferenceId: record.id,
      },
      adminUserId,
    );

    // Auto-post to General Ledger
    await this.glService.postJournalEntry({ journalEntryId: journalEntry.id }, adminUserId);

    // Update payroll status
    const updatedRecord = await this.prisma.payrollAccountingRecord.update({
      where: { id: record.id },
      data: {
        status: PayrollStatus.APPROVED,
        glJournalEntryId: journalEntry.id,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.PAYROLL_SIGN_OFF,
      entity: 'PAYROLL_ACCOUNTING',
      entityId: record.id,
      details: `Posted payroll ${record.periodMonth}/${record.periodYear} to General Ledger via JE ${journalEntry.entryNumber}`,
      severity: AuditSeverity.WARNING,
    });

    return {
      payrollRecord: updatedRecord,
      journalEntry,
    };
  }
}

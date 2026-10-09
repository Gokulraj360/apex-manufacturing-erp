import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateAccountDto,
  CreateJournalEntryDto,
  PostJournalEntryDto,
  CreateAccountingPeriodDto,
  CloseAccountingPeriodDto,
} from '../dto/general-ledger.dto';
import { AuditAction, AuditSeverity, JournalEntryStatus, AccountType } from '@prisma/client';

@Injectable()
export class GeneralLedgerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Retrieve complete Chart of Accounts
   */
  async getChartOfAccounts() {
    return this.prisma.chartOfAccount.findMany({
      orderBy: [{ accountType: 'asc' }, { accountCode: 'asc' }],
      include: {
        subAccounts: true,
      },
    });
  }

  /**
   * Create account in Chart of Accounts
   */
  async createAccount(dto: CreateAccountDto, adminUserId?: string) {
    const existing = await this.prisma.chartOfAccount.findUnique({
      where: { accountCode: dto.accountCode },
    });
    if (existing) {
      throw new BadRequestException(`Account code ${dto.accountCode} already exists.`);
    }

    const account = await this.prisma.chartOfAccount.create({
      data: {
        accountCode: dto.accountCode,
        accountName: dto.accountName,
        accountType: dto.accountType,
        description: dto.description,
        currency: dto.currency || 'USD',
        isHeader: dto.isHeader || false,
        parentAccountId: dto.parentAccountId,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.CREATE,
      entity: 'CHART_OF_ACCOUNT',
      entityId: account.id,
      details: `Created GL account ${account.accountCode} - ${account.accountName} (${account.accountType})`,
      severity: AuditSeverity.INFO,
    });

    return account;
  }

  /**
   * Create Accounting Period
   */
  async createPeriod(dto: CreateAccountingPeriodDto, adminUserId?: string) {
    const existing = await this.prisma.accountingPeriod.findUnique({
      where: { periodName: dto.periodName },
    });
    if (existing) {
      throw new BadRequestException(`Accounting period ${dto.periodName} already exists.`);
    }

    return this.prisma.accountingPeriod.create({
      data: {
        periodName: dto.periodName,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  /**
   * List all accounting periods
   */
  async getAccountingPeriods() {
    return this.prisma.accountingPeriod.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: { select: { journalEntries: true } },
      },
    });
  }

  /**
   * Close Accounting Period (Prevents further postings)
   */
  async closeAccountingPeriod(dto: CloseAccountingPeriodDto, adminUserId?: string) {
    const period = await this.prisma.accountingPeriod.findUnique({
      where: { id: dto.periodId },
    });
    if (!period) throw new NotFoundException('Accounting period not found.');
    if (period.isClosed) throw new BadRequestException('Period is already locked and closed.');

    // Ensure all draft journal entries within the period are either posted or voided
    const pendingDrafts = await this.prisma.journalEntry.count({
      where: {
        accountingPeriodId: dto.periodId,
        status: JournalEntryStatus.DRAFT,
      },
    });

    if (pendingDrafts > 0) {
      throw new BadRequestException(
        `Cannot close period: ${pendingDrafts} journal entries remain in DRAFT status. Post or void them first.`,
      );
    }

    const updated = await this.prisma.accountingPeriod.update({
      where: { id: dto.periodId },
      data: {
        isClosed: true,
        closedAt: new Date(),
        closedById: adminUserId,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.PERIOD_CLOSE,
      entity: 'ACCOUNTING_PERIOD',
      entityId: period.id,
      details: `Locked and finalized accounting period: ${period.periodName}`,
      severity: AuditSeverity.CRITICAL,
    });

    return updated;
  }

  /**
   * Create balanced double-entry Journal Entry
   */
  async createJournalEntry(dto: CreateJournalEntryDto, adminUserId?: string) {
    // 1. Verify period is open
    const period = await this.prisma.accountingPeriod.findUnique({
      where: { id: dto.accountingPeriodId },
    });
    if (!period) throw new NotFoundException('Accounting period not found.');
    if (period.isClosed) {
      throw new BadRequestException(`Cannot record entries in closed period: ${period.periodName}`);
    }

    // 2. Validate double-entry balancing (sum(debit) == sum(credit))
    if (!dto.lines || dto.lines.length < 2) {
      throw new BadRequestException('Journal entry requires at least two lines for double-entry balancing.');
    }

    let totalDebit = 0;
    let totalCredit = 0;

    for (const line of dto.lines) {
      totalDebit += Number(line.debit || 0);
      totalCredit += Number(line.credit || 0);
    }

    // Check with precision threshold
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new BadRequestException(
        `Double-entry imbalance! Total Debit ($${totalDebit.toFixed(2)}) must equal Total Credit ($${totalCredit.toFixed(2)}).`,
      );
    }

    // 3. Auto-generate entry number
    const count = await this.prisma.journalEntry.count();
    const entryNumber = `JE-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        entryNumber,
        entryDate: dto.entryDate ? new Date(dto.entryDate) : new Date(),
        memo: dto.memo,
        accountingPeriodId: dto.accountingPeriodId,
        createdById: adminUserId,
        totalDebit,
        totalCredit,
        sourceModule: dto.sourceModule || 'MANUAL',
        sourceReferenceId: dto.sourceReferenceId,
        status: JournalEntryStatus.DRAFT,
        lines: {
          create: dto.lines.map((line) => ({
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
            description: line.description,
            entityRef: line.entityRef,
          })),
        },
      },
      include: {
        lines: {
          include: { account: true },
        },
      },
    });

    return journalEntry;
  }

  /**
   * Post Journal Entry to General Ledger balances
   */
  async postJournalEntry(dto: PostJournalEntryDto, adminUserId?: string) {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id: dto.journalEntryId },
      include: {
        accountingPeriod: true,
        lines: { include: { account: true } },
      },
    });

    if (!entry) throw new NotFoundException('Journal entry not found.');
    if (entry.status === JournalEntryStatus.POSTED) {
      throw new BadRequestException('Journal entry is already posted to the ledger.');
    }
    if (entry.accountingPeriod.isClosed) {
      throw new BadRequestException('Cannot post to a closed accounting period.');
    }

    // Execute atomic balance updates for each line
    await this.prisma.$transaction(async (tx) => {
      for (const line of entry.lines) {
        const debit = Number(line.debit);
        const credit = Number(line.credit);
        const accountType = line.account.accountType;

        // Normal balance calculation:
        // Asset & Expense: Debit increases (+), Credit decreases (-)
        // Liability, Equity & Revenue: Credit increases (+), Debit decreases (-)
        let balanceChange = 0;
        if (accountType === AccountType.ASSET || accountType === AccountType.EXPENSE) {
          balanceChange = debit - credit;
        } else {
          balanceChange = credit - debit;
        }

        await tx.chartOfAccount.update({
          where: { id: line.accountId },
          data: {
            currentBalance: { increment: balanceChange },
          },
        });
      }

      await tx.journalEntry.update({
        where: { id: entry.id },
        data: {
          status: JournalEntryStatus.POSTED,
          postedById: adminUserId,
          postedAt: new Date(),
        },
      });
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.JOURNAL_ENTRY_POST,
      entity: 'JOURNAL_ENTRY',
      entityId: entry.id,
      details: `Posted Journal Entry ${entry.entryNumber} ($${entry.totalDebit.toString()}) to General Ledger.`,
      severity: AuditSeverity.WARNING,
    });

    return this.prisma.journalEntry.findUnique({
      where: { id: entry.id },
      include: {
        lines: { include: { account: true } },
        accountingPeriod: true,
      },
    });
  }

  /**
   * List all journal entries with filter
   */
  async getJournalEntries(periodId?: string) {
    const where: any = {};
    if (periodId) where.accountingPeriodId = periodId;

    return this.prisma.journalEntry.findMany({
      where,
      orderBy: { entryDate: 'desc' },
      include: {
        accountingPeriod: true,
        lines: {
          include: { account: true },
        },
      },
    });
  }
}

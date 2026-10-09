import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';
import { GeneralLedgerService } from './services/general-ledger.service';
import { AccountsPayableService } from './services/accounts-payable.service';
import { AccountsReceivableService } from './services/accounts-receivable.service';
import { PayrollAccountingService } from './services/payroll-accounting.service';
import { FinancialReportingService } from './services/financial-reporting.service';
import { GeneralLedgerController } from './controllers/general-ledger.controller';
import { AccountsPayableController } from './controllers/accounts-payable.controller';
import { AccountsReceivableController } from './controllers/accounts-receivable.controller';
import { FinancialReportingController } from './controllers/financial-reporting.controller';
import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    GeneralLedgerController,
    AccountsPayableController,
    AccountsReceivableController,
    FinancialReportingController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    GeneralLedgerService,
    AccountsPayableService,
    AccountsReceivableService,
    PayrollAccountingService,
    FinancialReportingService,
    RBACGuard,
  ],
  exports: [
    GeneralLedgerService,
    AccountsPayableService,
    AccountsReceivableService,
    PayrollAccountingService,
    FinancialReportingService,
  ],
})
export class FinanceModule {}

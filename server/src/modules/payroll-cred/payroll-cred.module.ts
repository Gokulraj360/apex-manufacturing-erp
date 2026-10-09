import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { PayrollSubmissionService } from './payroll-submission.service';
import { PayrollSubmissionController } from './payroll-submission.controller';
import { FinancePayoutService } from './finance-payout.service';
import { FinancePayoutController } from './finance-payout.controller';

@Module({
  controllers: [
    CredentialController,
    PayrollSubmissionController,
    FinancePayoutController,
  ],
  providers: [
    PrismaService,
    CredentialService,
    PayrollSubmissionService,
    FinancePayoutService,
  ],
  exports: [
    CredentialService,
    PayrollSubmissionService,
    FinancePayoutService,
  ],
})
export class PayrollCredModule {}

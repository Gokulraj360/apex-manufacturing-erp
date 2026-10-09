import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';
import { PricingPolicyService } from './services/pricing-policy.service';
import { PricingGuard } from './guards/pricing.guard';
import { PricingControlController } from './controllers/pricing-control.controller';

@Module({
  controllers: [PricingControlController],
  providers: [
    PrismaService,
    AuditLogService,
    PricingPolicyService,
    PricingGuard,
  ],
  exports: [
    PricingPolicyService,
    PricingGuard,
  ],
})
export class PricingControlModule {}

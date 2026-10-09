import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { JobWorkOrderService } from './services/job-work-order.service';
import { SubcontractorChallanService } from './services/subcontractor-challan.service';
import { SubcontractorReceiptService } from './services/subcontractor-receipt.service';
import { SubcontractorBillingService } from './services/subcontractor-billing.service';
import { SubcontractorAnalyticsService } from './services/subcontractor-analytics.service';

// Controllers
import { JobWorkOrderController } from './controllers/job-work-order.controller';
import { SubcontractorChallanController } from './controllers/subcontractor-challan.controller';
import { SubcontractorReceiptController } from './controllers/subcontractor-receipt.controller';
import { SubcontractorBillingController } from './controllers/subcontractor-billing.controller';
import { SubcontractorAnalyticsController } from './controllers/subcontractor-analytics.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    JobWorkOrderController,
    SubcontractorChallanController,
    SubcontractorReceiptController,
    SubcontractorBillingController,
    SubcontractorAnalyticsController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    JobWorkOrderService,
    SubcontractorChallanService,
    SubcontractorReceiptService,
    SubcontractorBillingService,
    SubcontractorAnalyticsService,
    RBACGuard,
  ],
  exports: [
    JobWorkOrderService,
    SubcontractorChallanService,
    SubcontractorReceiptService,
    SubcontractorBillingService,
    SubcontractorAnalyticsService,
  ],
})
export class SubcontractingModule {}

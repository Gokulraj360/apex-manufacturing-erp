import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { LeadPipelineService } from './services/lead-pipeline.service';
import { QuotationService } from './services/quotation.service';
import { SalesOrderConversionService } from './services/sales-order-conversion.service';
import { CustomerSupportService } from './services/customer-support.service';
import { CRMAnalyticsService } from './services/crm-analytics.service';

// Controllers
import { LeadPipelineController } from './controllers/lead-pipeline.controller';
import { QuotationController } from './controllers/quotation.controller';
import { SalesOrderConversionController } from './controllers/sales-order-conversion.controller';
import { CustomerSupportController } from './controllers/customer-support.controller';
import { CRMAnalyticsController } from './controllers/crm-analytics.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    LeadPipelineController,
    QuotationController,
    SalesOrderConversionController,
    CustomerSupportController,
    CRMAnalyticsController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    LeadPipelineService,
    QuotationService,
    SalesOrderConversionService,
    CustomerSupportService,
    CRMAnalyticsService,
    RBACGuard,
  ],
  exports: [
    LeadPipelineService,
    QuotationService,
    SalesOrderConversionService,
    CustomerSupportService,
    CRMAnalyticsService,
  ],
})
export class CrmModule {}

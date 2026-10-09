import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { CampaignManagementService } from './services/campaign-management.service';
import { DigitalAssetService } from './services/digital-asset.service';
import { MarketIntelligenceService } from './services/market-intelligence.service';
import { MarketingBudgetService } from './services/marketing-budget.service';
import { BrandFeedbackService } from './services/brand-feedback.service';

// Controllers
import { CampaignManagementController } from './controllers/campaign-management.controller';
import { DigitalAssetController } from './controllers/digital-asset.controller';
import { MarketIntelligenceController } from './controllers/market-intelligence.controller';
import { MarketingBudgetController } from './controllers/marketing-budget.controller';
import { BrandFeedbackController } from './controllers/brand-feedback.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    CampaignManagementController,
    DigitalAssetController,
    MarketIntelligenceController,
    MarketingBudgetController,
    BrandFeedbackController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    CampaignManagementService,
    DigitalAssetService,
    MarketIntelligenceService,
    MarketingBudgetService,
    BrandFeedbackService,
    RBACGuard,
  ],
  exports: [
    CampaignManagementService,
    DigitalAssetService,
    MarketIntelligenceService,
    MarketingBudgetService,
    BrandFeedbackService,
  ],
})
export class MarketingModule {}

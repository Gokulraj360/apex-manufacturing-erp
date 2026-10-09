import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { AssetRegistryService } from './services/asset-registry.service';
import { PreventiveMaintenanceService } from './services/preventive-maintenance.service';
import { BreakdownRepairService } from './services/breakdown-repair.service';
import { SparePartsService } from './services/spare-parts.service';
import { AssetAnalyticsService } from './services/asset-analytics.service';

// Controllers
import { AssetRegistryController } from './controllers/asset-registry.controller';
import { PreventiveMaintenanceController } from './controllers/preventive-maintenance.controller';
import { BreakdownRepairController } from './controllers/breakdown-repair.controller';
import { SparePartsController } from './controllers/spare-parts.controller';
import { AssetAnalyticsController } from './controllers/asset-analytics.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    AssetRegistryController,
    PreventiveMaintenanceController,
    BreakdownRepairController,
    SparePartsController,
    AssetAnalyticsController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    AssetRegistryService,
    PreventiveMaintenanceService,
    BreakdownRepairService,
    SparePartsService,
    AssetAnalyticsService,
    RBACGuard,
  ],
  exports: [
    AssetRegistryService,
    PreventiveMaintenanceService,
    BreakdownRepairService,
    SparePartsService,
    AssetAnalyticsService,
  ],
})
export class AssetReliabilityModule {}

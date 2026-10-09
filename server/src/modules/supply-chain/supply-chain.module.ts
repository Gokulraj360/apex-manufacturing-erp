import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { MRPForecastService } from './services/mrp-forecast.service';
import { ProcurementService } from './services/procurement.service';
import { VendorDirectoryService } from './services/vendor-directory.service';
import { InboundShippingService } from './services/inbound-shipping.service';
import { SupplyChainAnalyticsService } from './services/supply-chain-analytics.service';

// Controllers
import { MRPForecastController } from './controllers/mrp-forecast.controller';
import { ProcurementController } from './controllers/procurement.controller';
import { VendorDirectoryController } from './controllers/vendor-directory.controller';
import { InboundShippingController } from './controllers/inbound-shipping.controller';
import { SupplyChainAnalyticsController } from './controllers/supply-chain-analytics.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    MRPForecastController,
    ProcurementController,
    VendorDirectoryController,
    InboundShippingController,
    SupplyChainAnalyticsController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    MRPForecastService,
    ProcurementService,
    VendorDirectoryService,
    InboundShippingService,
    SupplyChainAnalyticsService,
    RBACGuard,
  ],
  exports: [
    MRPForecastService,
    ProcurementService,
    VendorDirectoryService,
    InboundShippingService,
    SupplyChainAnalyticsService,
  ],
})
export class SupplyChainModule {}

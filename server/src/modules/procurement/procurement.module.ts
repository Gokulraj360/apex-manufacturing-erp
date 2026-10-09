import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { PRConversionService } from './services/pr-conversion.service';
import { RFQNegotiationService } from './services/rfq-negotiation.service';
import { PurchaseOrderService } from './services/purchase-order.service';
import { POTrackingService } from './services/po-tracking.service';
import { MaterialCatalogService } from './services/material-catalog.service';

// Controllers
import { PRConversionController } from './controllers/pr-conversion.controller';
import { RFQNegotiationController } from './controllers/rfq-negotiation.controller';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { POTrackingController } from './controllers/po-tracking.controller';
import { MaterialCatalogController } from './controllers/material-catalog.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    PRConversionController,
    RFQNegotiationController,
    PurchaseOrderController,
    POTrackingController,
    MaterialCatalogController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    PRConversionService,
    RFQNegotiationService,
    PurchaseOrderService,
    POTrackingService,
    MaterialCatalogService,
    RBACGuard,
  ],
  exports: [
    PRConversionService,
    RFQNegotiationService,
    PurchaseOrderService,
    POTrackingService,
    MaterialCatalogService,
  ],
})
export class ProcurementModule {}

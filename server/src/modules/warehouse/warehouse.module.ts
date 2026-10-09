import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';
import { InventoryLocationService } from './services/inventory-location.service';
import { ReceivingService } from './services/receiving.service';
import { DispatchService } from './services/dispatch.service';
import { MaterialIssuanceService } from './services/material-issuance.service';
import { InventoryAuditService } from './services/inventory-audit.service';
import { InventoryLocationController } from './controllers/inventory-location.controller';
import { ReceivingController } from './controllers/receiving.controller';
import { DispatchController } from './controllers/dispatch.controller';
import { MaterialIssuanceController } from './controllers/material-issuance.controller';
import { InventoryAuditController } from './controllers/inventory-audit.controller';
import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    InventoryLocationController,
    ReceivingController,
    DispatchController,
    MaterialIssuanceController,
    InventoryAuditController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    InventoryLocationService,
    ReceivingService,
    DispatchService,
    MaterialIssuanceService,
    InventoryAuditService,
    RBACGuard,
  ],
  exports: [
    InventoryLocationService,
    ReceivingService,
    DispatchService,
    MaterialIssuanceService,
    InventoryAuditService,
  ],
})
export class WarehouseModule {}

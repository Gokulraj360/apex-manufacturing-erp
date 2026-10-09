import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';
import { FinishedGoodsInventoryService } from './services/finished-goods-inventory.service';
import { PackagingBarcodeService } from './services/packaging-barcode.service';
import { OrderPickingStagingService } from './services/order-picking-staging.service';
import { ShipmentVerificationService } from './services/shipment-verification.service';
import { CustomerReturnService } from './services/customer-return.service';
import { FinishedGoodsInventoryController } from './controllers/finished-goods-inventory.controller';
import { PackagingBarcodeController } from './controllers/packaging-barcode.controller';
import { OrderPickingStagingController } from './controllers/order-picking-staging.controller';
import { ShipmentVerificationController } from './controllers/shipment-verification.controller';
import { CustomerReturnController } from './controllers/customer-return.controller';
import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    FinishedGoodsInventoryController,
    PackagingBarcodeController,
    OrderPickingStagingController,
    ShipmentVerificationController,
    CustomerReturnController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    FinishedGoodsInventoryService,
    PackagingBarcodeService,
    OrderPickingStagingService,
    ShipmentVerificationService,
    CustomerReturnService,
    RBACGuard,
  ],
  exports: [
    FinishedGoodsInventoryService,
    PackagingBarcodeService,
    OrderPickingStagingService,
    ShipmentVerificationService,
    CustomerReturnService,
  ],
})
export class DispatchModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';
import { VehicleGateService } from './services/vehicle-gate.service';
import { InboundLogisticsService } from './services/inbound-transport.service';
import { OutboundGateService } from './services/outbound-gate.service';
import { DeliveryTripService } from './services/delivery-trip.service';
import { SpecialGatePassService } from './services/special-gate-pass.service';
import { VehicleGateController } from './controllers/vehicle-gate.controller';
import { InboundLogisticsController } from './controllers/inbound-transport.controller';
import { OutboundGateController } from './controllers/outbound-gate.controller';
import { DeliveryTripController } from './controllers/delivery-trip.controller';
import { SpecialGatePassController } from './controllers/special-gate-pass.controller';
import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    VehicleGateController,
    InboundLogisticsController,
    OutboundGateController,
    DeliveryTripController,
    SpecialGatePassController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    VehicleGateService,
    InboundLogisticsService,
    OutboundGateService,
    DeliveryTripService,
    SpecialGatePassService,
    RBACGuard,
  ],
  exports: [
    VehicleGateService,
    InboundLogisticsService,
    OutboundGateService,
    DeliveryTripService,
    SpecialGatePassService,
  ],
})
export class LogisticsGateModule {}

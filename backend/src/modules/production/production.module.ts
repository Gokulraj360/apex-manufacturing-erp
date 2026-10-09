import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';
import { WorkOrderService } from './services/work-order.service';
import { RecipeRoutingService } from './services/recipe-routing.service';
import { MaterialRequisitionService } from './services/material-requisition.service';
import { QualityFlagService } from './services/quality-flag.service';
import { MachineDowntimeService } from './services/machine-downtime.service';
import { WorkOrderController } from './controllers/work-order.controller';
import { RecipeRoutingController } from './controllers/recipe-routing.controller';
import { MaterialRequisitionController } from './controllers/material-requisition.controller';
import { QualityFlagController } from './controllers/quality-flag.controller';
import { MachineDowntimeController } from './controllers/machine-downtime.controller';
import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    WorkOrderController,
    RecipeRoutingController,
    MaterialRequisitionController,
    QualityFlagController,
    MachineDowntimeController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    WorkOrderService,
    RecipeRoutingService,
    MaterialRequisitionService,
    QualityFlagService,
    MachineDowntimeService,
    RBACGuard,
  ],
  exports: [
    WorkOrderService,
    RecipeRoutingService,
    MaterialRequisitionService,
    QualityFlagService,
    MachineDowntimeService,
  ],
})
export class ProductionModule {}

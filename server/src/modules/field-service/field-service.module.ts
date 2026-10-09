import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { ServiceRequestService } from './services/service-request.service';
import { EngineerAssignmentService } from './services/engineer-assignment.service';
import { AMCContractService } from './services/amc-contract.service';
import { FieldInventoryService } from './services/field-inventory.service';
import { FieldAnalyticsService } from './services/field-analytics.service';

// Controllers
import { ServiceRequestController } from './controllers/service-request.controller';
import { EngineerAssignmentController } from './controllers/engineer-assignment.controller';
import { AMCContractController } from './controllers/amc-contract.controller';
import { FieldInventoryController } from './controllers/field-inventory.controller';
import { FieldAnalyticsController } from './controllers/field-analytics.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    ServiceRequestController,
    EngineerAssignmentController,
    AMCContractController,
    FieldInventoryController,
    FieldAnalyticsController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    ServiceRequestService,
    EngineerAssignmentService,
    AMCContractService,
    FieldInventoryService,
    FieldAnalyticsService,
    RBACGuard,
  ],
  exports: [
    ServiceRequestService,
    EngineerAssignmentService,
    AMCContractService,
    FieldInventoryService,
    FieldAnalyticsService,
  ],
})
export class FieldServiceModule {}

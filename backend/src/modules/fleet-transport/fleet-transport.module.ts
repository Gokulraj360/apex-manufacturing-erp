import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { VehicleRegistryService } from './services/vehicle-registry.service';
import { VehicleMaintenanceService } from './services/vehicle-maintenance.service';
import { TripAssignmentService } from './services/trip-assignment.service';
import { FuelExpenseService } from './services/fuel-expense.service';
import { VehicleComplianceService } from './services/vehicle-compliance.service';

// Controllers
import { VehicleRegistryController } from './controllers/vehicle-registry.controller';
import { VehicleMaintenanceController } from './controllers/vehicle-maintenance.controller';
import { TripAssignmentController } from './controllers/trip-assignment.controller';
import { FuelExpenseController } from './controllers/fuel-expense.controller';
import { VehicleComplianceController } from './controllers/vehicle-compliance.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    VehicleRegistryController,
    VehicleMaintenanceController,
    TripAssignmentController,
    FuelExpenseController,
    VehicleComplianceController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    VehicleRegistryService,
    VehicleMaintenanceService,
    TripAssignmentService,
    FuelExpenseService,
    VehicleComplianceService,
    RBACGuard,
  ],
  exports: [
    VehicleRegistryService,
    VehicleMaintenanceService,
    TripAssignmentService,
    FuelExpenseService,
    VehicleComplianceService,
  ],
})
export class FleetTransportModule {}

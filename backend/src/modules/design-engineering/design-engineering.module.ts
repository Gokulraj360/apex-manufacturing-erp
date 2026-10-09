import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { CadDrawingService } from './services/cad-drawing.service';
import { BOMStructureService } from './services/bom-structure.service';
import { ECNManagementService } from './services/ecn-management.service';
import { PrototypeTestingService } from './services/prototype-testing.service';
import { BlueprintSharingService } from './services/blueprint-sharing.service';

// Controllers
import { CadDrawingController } from './controllers/cad-drawing.controller';
import { BOMStructureController } from './controllers/bom-structure.controller';
import { ECNManagementController } from './controllers/ecn-management.controller';
import { PrototypeTestingController } from './controllers/prototype-testing.controller';
import { BlueprintSharingController } from './controllers/blueprint-sharing.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    CadDrawingController,
    BOMStructureController,
    ECNManagementController,
    PrototypeTestingController,
    BlueprintSharingController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    CadDrawingService,
    BOMStructureService,
    ECNManagementService,
    PrototypeTestingService,
    BlueprintSharingService,
    RBACGuard,
  ],
  exports: [
    CadDrawingService,
    BOMStructureService,
    ECNManagementService,
    PrototypeTestingService,
    BlueprintSharingService,
  ],
})
export class DesignEngineeringModule {}

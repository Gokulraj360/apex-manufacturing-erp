import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { UserAccessService } from './services/user-access.service';
import { IoTIntegrationService } from './services/iot-integration.service';
import { InfrastructureBackupService } from './services/infrastructure-backup.service';
import { CybersecurityService } from './services/cybersecurity.service';
import { HelpdeskHardwareService } from './services/helpdesk-hardware.service';

// Controllers
import { UserAccessController } from './controllers/user-access.controller';
import { IoTIntegrationController } from './controllers/iot-integration.controller';
import { InfrastructureBackupController } from './controllers/infrastructure-backup.controller';
import { CybersecurityController } from './controllers/cybersecurity.controller';
import { HelpdeskHardwareController } from './controllers/helpdesk-hardware.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    UserAccessController,
    IoTIntegrationController,
    InfrastructureBackupController,
    CybersecurityController,
    HelpdeskHardwareController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    UserAccessService,
    IoTIntegrationService,
    InfrastructureBackupService,
    CybersecurityService,
    HelpdeskHardwareService,
    RBACGuard,
  ],
  exports: [
    UserAccessService,
    IoTIntegrationService,
    InfrastructureBackupService,
    CybersecurityService,
    HelpdeskHardwareService,
  ],
})
export class SystemAdminModule {}

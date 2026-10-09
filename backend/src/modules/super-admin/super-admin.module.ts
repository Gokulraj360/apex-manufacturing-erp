import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RBACService } from './services/rbac.service';
import { AuditLogService } from './services/audit-log.service';
import { ExecutiveAnalyticsService } from './services/executive-analytics.service';
import { RBACController } from './controllers/rbac.controller';
import { AuditLogController } from './controllers/audit-log.controller';
import { ExecutiveAnalyticsController } from './controllers/executive-analytics.controller';
import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    RBACController,
    AuditLogController,
    ExecutiveAnalyticsController,
  ],
  providers: [
    PrismaService,
    RBACService,
    AuditLogService,
    ExecutiveAnalyticsService,
    RBACGuard,
  ],
  exports: [
    PrismaService,
    RBACService,
    AuditLogService,
    ExecutiveAnalyticsService,
    RBACGuard,
  ],
})
export class SuperAdminModule {}

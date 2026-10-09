import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { DepartmentDeploymentService } from './services/department-deployment.service';
import { DepartmentAttendanceService } from './services/department-attendance.service';
import { DepartmentOutputService } from './services/department-output.service';
import { CertificationValidationService } from './services/certification-validation.service';
import { DepartmentLaborAnalyticsService } from './services/department-labor-analytics.service';

// Controllers
import { DepartmentDeploymentController } from './controllers/department-deployment.controller';
import { DepartmentAttendanceController } from './controllers/department-attendance.controller';
import { DepartmentOutputController } from './controllers/department-output.controller';
import { CertificationValidationController } from './controllers/certification-validation.controller';
import { DepartmentLaborAnalyticsController } from './controllers/department-labor-analytics.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    DepartmentDeploymentController,
    DepartmentAttendanceController,
    DepartmentOutputController,
    CertificationValidationController,
    DepartmentLaborAnalyticsController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    DepartmentDeploymentService,
    DepartmentAttendanceService,
    DepartmentOutputService,
    CertificationValidationService,
    DepartmentLaborAnalyticsService,
    RBACGuard,
  ],
  exports: [
    DepartmentDeploymentService,
    DepartmentAttendanceService,
    DepartmentOutputService,
    CertificationValidationService,
    DepartmentLaborAnalyticsService,
  ],
})
export class DepartmentWorkforceModule {}

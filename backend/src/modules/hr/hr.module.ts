import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';

// Services
import { EmployeeManagementService } from './services/employee-management.service';
import { AttendanceShiftService } from './services/attendance-shift.service';
import { PayrollInputService } from './services/payroll-input.service';
import { RecruitmentOnboardingService } from './services/recruitment-onboarding.service';
import { ComplianceTrainingService } from './services/compliance-training.service';

// Controllers
import { EmployeeManagementController } from './controllers/employee-management.controller';
import { AttendanceShiftController } from './controllers/attendance-shift.controller';
import { PayrollInputController } from './controllers/payroll-input.controller';
import { RecruitmentOnboardingController } from './controllers/recruitment-onboarding.controller';
import { ComplianceTrainingController } from './controllers/compliance-training.controller';

import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    EmployeeManagementController,
    AttendanceShiftController,
    PayrollInputController,
    RecruitmentOnboardingController,
    ComplianceTrainingController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    EmployeeManagementService,
    AttendanceShiftService,
    PayrollInputService,
    RecruitmentOnboardingService,
    ComplianceTrainingService,
    RBACGuard,
  ],
  exports: [
    EmployeeManagementService,
    AttendanceShiftService,
    PayrollInputService,
    RecruitmentOnboardingService,
    ComplianceTrainingService,
  ],
})
export class HrModule {}

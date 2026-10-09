import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../super-admin/services/audit-log.service';
import { IncomingInspectionService } from './services/incoming-inspection.service';
import { InProcessInspectionService } from './services/in-process-inspection.service';
import { FinalInspectionService } from './services/final-inspection.service';
import { DefectTrackingService } from './services/defect-tracking.service';
import { QualityAnalyticsService } from './services/quality-analytics.service';
import { IncomingInspectionController } from './controllers/incoming-inspection.controller';
import { InProcessInspectionController } from './controllers/in-process-inspection.controller';
import { FinalInspectionController } from './controllers/final-inspection.controller';
import { DefectTrackingController } from './controllers/defect-tracking.controller';
import { QualityAnalyticsController } from './controllers/quality-analytics.controller';
import { RBACGuard } from '../../common/guards/rbac.guard';

@Module({
  controllers: [
    IncomingInspectionController,
    InProcessInspectionController,
    FinalInspectionController,
    DefectTrackingController,
    QualityAnalyticsController,
  ],
  providers: [
    PrismaService,
    AuditLogService,
    IncomingInspectionService,
    InProcessInspectionService,
    FinalInspectionService,
    DefectTrackingService,
    QualityAnalyticsService,
    RBACGuard,
  ],
  exports: [
    IncomingInspectionService,
    InProcessInspectionService,
    FinalInspectionService,
    DefectTrackingService,
    QualityAnalyticsService,
  ],
})
export class QualityModule {}

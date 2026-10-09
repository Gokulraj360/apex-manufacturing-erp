import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QualityAnalyticsService } from '../services/quality-analytics.service';
import {
  RecordSupplierQualityScoreDto,
  CreateQualityAuditDto,
} from '../dto/quality-analytics.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/quality/analytics')
@UseGuards(RBACGuard)
export class QualityAnalyticsController {
  constructor(private readonly analyticsService: QualityAnalyticsService) {}

  @Get('dashboard')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getDashboardAnalytics() {
    return this.analyticsService.getDashboardAnalytics();
  }

  @Get('suppliers')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getSupplierScorecards() {
    return this.analyticsService.getSupplierScorecards();
  }

  @Post('suppliers/score')
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async recordSupplierScore(
    @Body() dto: RecordSupplierQualityScoreDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.analyticsService.recordSupplierQualityScore(dto, userId);
  }

  @Get('audits')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getQualityAudits() {
    return this.analyticsService.getQualityAudits();
  }

  @Post('audits')
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async createQualityAudit(
    @Body() dto: CreateQualityAuditDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.analyticsService.createQualityAudit(dto, userId);
  }
}

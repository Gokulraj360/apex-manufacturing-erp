import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubcontractorAnalyticsService } from '../services/subcontractor-analytics.service';
import {
  QueryVendorPerformanceDto,
  LogPerformanceEvaluationDto,
} from '../dto/subcontractor-analytics.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/subcontracting/analytics')
@UseGuards(RBACGuard)
export class SubcontractorAnalyticsController {
  constructor(private readonly analyticsService: SubcontractorAnalyticsService) {}

  @Get('overview')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getOverviewMetrics() {
    return this.analyticsService.getSubcontractingOverviewMetrics();
  }

  @Get('scorecards')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getVendorScorecards(@Query() query: QueryVendorPerformanceDto) {
    return this.analyticsService.getVendorScorecards(query);
  }

  @Post('evaluations')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async logPerformanceEvaluation(@Body() dto: LogPerformanceEvaluationDto) {
    return this.analyticsService.logPerformanceEvaluation(dto);
  }
}

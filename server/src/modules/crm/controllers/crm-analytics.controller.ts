import { Controller, Get, Query } from '@nestjs/common';
import { CRMAnalyticsService } from '../services/crm-analytics.service';
import { CRMAnalyticsFilterDto } from '../dto/crm-analytics.dto';

@Controller('api/v1/crm/analytics')
export class CRMAnalyticsController {
  constructor(private readonly analyticsService: CRMAnalyticsService) {}

  @Get('overview')
  async getOverviewMetrics(@Query() filter: CRMAnalyticsFilterDto) {
    return this.analyticsService.getOverviewMetrics(filter);
  }

  @Get('stages')
  async getPipelineStageDistribution() {
    return this.analyticsService.getPipelineStageDistribution();
  }

  @Get('sales-reps')
  async getSalesRepPerformance() {
    return this.analyticsService.getSalesRepPerformance();
  }
}

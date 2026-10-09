import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FieldAnalyticsService } from '../services/field-analytics.service';
import { QueryFieldAnalyticsDto } from '../dto/field-analytics.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/field-service/analytics')
@UseGuards(RBACGuard)
export class FieldAnalyticsController {
  constructor(private readonly analyticsService: FieldAnalyticsService) {}

  @Get('overview')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getOverviewMetrics(@Query() query: QueryFieldAnalyticsDto) {
    return this.analyticsService.getOverviewMetrics(query);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssetAnalyticsService } from '../services/asset-analytics.service';
import {
  QueryAssetAnalyticsDto,
  LogAssetLifecycleEventDto,
} from '../dto/asset-analytics.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/asset-reliability/analytics')
@UseGuards(RBACGuard)
export class AssetAnalyticsController {
  constructor(private readonly analyticsService: AssetAnalyticsService) {}

  @Get('overview')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getReliabilityOverviewMetrics() {
    return this.analyticsService.getReliabilityOverviewMetrics();
  }

  @Get('breakdown')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getAssetReliabilityBreakdown(@Query() query: QueryAssetAnalyticsDto) {
    return this.analyticsService.getAssetReliabilityBreakdown(query);
  }

  @Get('lifecycle-logs')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getLifecycleLogs(@Query('assetId') assetId?: string) {
    return this.analyticsService.getLifecycleLogs(assetId);
  }

  @Post('lifecycle-logs')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async logLifecycleEvent(@Body() dto: LogAssetLifecycleEventDto) {
    return this.analyticsService.logLifecycleEvent(dto);
  }
}

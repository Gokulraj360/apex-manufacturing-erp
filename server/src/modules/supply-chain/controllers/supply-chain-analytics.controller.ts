import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SupplyChainAnalyticsService } from '../services/supply-chain-analytics.service';
import {
  CreateSupplyRiskLogDto,
  UpdateSupplyRiskStatusDto,
  QuerySupplyRiskDto,
} from '../dto/supply-chain-analytics.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/supply-chain/analytics')
@UseGuards(RBACGuard)
export class SupplyChainAnalyticsController {
  constructor(private readonly analyticsService: SupplyChainAnalyticsService) {}

  @Get('overview')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getOverviewMetrics() {
    return this.analyticsService.getOverviewMetrics();
  }

  @Get('risks')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getRiskLogs(@Query() query: QuerySupplyRiskDto) {
    return this.analyticsService.getRiskLogs(query);
  }

  @Post('risks')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createRiskLog(@Body() dto: CreateSupplyRiskLogDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.analyticsService.createRiskLog(dto, userId);
  }

  @Put('risks/:id/status')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateRiskStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSupplyRiskStatusDto,
  ) {
    return this.analyticsService.updateRiskStatus(id, dto);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DepartmentLaborAnalyticsService } from '../services/department-labor-analytics.service';
import {
  GenerateLaborMetricDto,
  AuditPayrollHandoffDto,
  QueryLaborAnalyticsDto,
} from '../dto/department-labor-analytics.dto';

@Controller('api/v1/department-workforce/analytics')
export class DepartmentLaborAnalyticsController {
  constructor(
    private readonly analyticsService: DepartmentLaborAnalyticsService,
  ) {}

  @Get('overview')
  async getOverview() {
    return this.analyticsService.getDepartmentWorkforceOverview();
  }

  @Get('metrics')
  async getLaborMetrics(@Query() query: QueryLaborAnalyticsDto) {
    return this.analyticsService.getLaborMetrics(query);
  }

  @Get('metrics/:id')
  async getLaborMetricById(@Param('id') id: string) {
    return this.analyticsService.getLaborMetricById(id);
  }

  @Post('metrics')
  async generateLaborMetric(@Body() dto: GenerateLaborMetricDto) {
    return this.analyticsService.generateLaborMetric(dto);
  }

  @Patch('metrics/:id/audit')
  async auditPayrollHandoff(
    @Param('id') id: string,
    @Body() dto: AuditPayrollHandoffDto,
  ) {
    return this.analyticsService.auditPayrollHandoff(id, dto);
  }
}

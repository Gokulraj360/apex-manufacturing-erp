import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExecutiveAnalyticsService } from '../services/executive-analytics.service';
import {
  DateRangeFilterDto,
  ApprovePayrollDto,
  ApprovePurchaseOrderDto,
  UpdateProductionLineDto,
} from '../dto/analytics.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/super-admin/analytics')
@UseGuards(RBACGuard)
export class ExecutiveAnalyticsController {
  constructor(private readonly analyticsService: ExecutiveAnalyticsService) {}

  @Get('overview')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getExecutiveOverview() {
    return this.analyticsService.getExecutiveOverview();
  }

  @Get('financials')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getFinancialReports(@Query() filter: DateRangeFilterDto) {
    return this.analyticsService.getFinancialReports(filter);
  }

  @Get('production-telemetry')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getProductionTelemetry() {
    return this.analyticsService.getProductionTelemetry();
  }

  @Put('production-line')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateProductionLine(
    @Body() dto: UpdateProductionLineDto,
    @Req() req: any,
  ) {
    const operatorUserId = req.user?.id;
    return this.analyticsService.updateProductionLine(dto, operatorUserId);
  }

  @Get('pending-purchase-orders')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getPendingPurchaseOrders() {
    return this.analyticsService.getPendingPurchaseOrders();
  }

  @Post('approve-purchase-order')
  @RequirePermissions({ action: 'SIGNOFF_HIGH_VALUE_PO', resource: 'FINANCIALS' })
  async approvePurchaseOrder(
    @Body() dto: ApprovePurchaseOrderDto,
    @Req() req: any,
  ) {
    const executiveUserId = req.user?.id || 'super-admin-root';
    return this.analyticsService.approvePurchaseOrder(dto, executiveUserId);
  }

  @Get('payrolls')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getPayrollRecords() {
    return this.analyticsService.getPayrollRecords();
  }

  @Post('approve-payroll')
  @RequirePermissions({ action: 'APPROVE_PAYROLL', resource: 'FINANCIALS' })
  async signOffPayroll(@Body() dto: ApprovePayrollDto, @Req() req: any) {
    const executiveUserId = req.user?.id || 'super-admin-root';
    return this.analyticsService.signOffPayroll(dto, executiveUserId);
  }
}

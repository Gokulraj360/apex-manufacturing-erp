import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FinancialReportingService } from '../services/financial-reporting.service';
import { PayrollAccountingService } from '../services/payroll-accounting.service';
import {
  DateFilterReportDto,
  GenerateTaxReportDto,
  FileTaxReportDto,
} from '../dto/financial-reporting.dto';
import {
  ComputePayrollAccountingDto,
  PostPayrollToGLDto,
} from '../dto/payroll-accounting.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/finance/reports')
@UseGuards(RBACGuard)
export class FinancialReportingController {
  constructor(
    private readonly reportingService: FinancialReportingService,
    private readonly payrollAccountingService: PayrollAccountingService,
  ) {}

  @Get('cash-flow-working-capital')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getCashFlowAndWorkingCapital() {
    return this.reportingService.getCashFlowAndWorkingCapital();
  }

  @Get('profit-and-loss')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getProfitAndLoss(@Query() filter: DateFilterReportDto) {
    return this.reportingService.getProfitAndLoss(filter);
  }

  @Get('balance-sheet')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getBalanceSheet() {
    return this.reportingService.getBalanceSheet();
  }

  @Get('tax-reports')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getTaxReports() {
    return this.reportingService.getTaxReports();
  }

  @Post('tax-reports')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async generateTaxReport(
    @Body() dto: GenerateTaxReportDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.reportingService.generateTaxReport(dto, adminUserId);
  }

  @Post('tax-reports/file')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async fileTaxReport(@Body() dto: FileTaxReportDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.reportingService.fileTaxReport(dto, adminUserId);
  }

  @Get('payroll-records')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getPayrollRecords() {
    return this.payrollAccountingService.getPayrollRecords();
  }

  @Post('payroll/compute')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async computePayroll(
    @Body() dto: ComputePayrollAccountingDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.payrollAccountingService.computePayroll(dto, adminUserId);
  }

  @Post('payroll/post-to-gl')
  @RequirePermissions({ action: 'APPROVE_PAYROLL', resource: 'FINANCIALS' })
  async postPayrollToGL(@Body() dto: PostPayrollToGLDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.payrollAccountingService.postPayrollToGeneralLedger(dto, adminUserId);
  }
}

import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { ValidateThreeWayMatchDto, ApproveInvoiceDto, CostVarianceQueryDto } from './dto/finance.dto';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('reconciliation/kpis')
  async getKPIs() {
    return this.financeService.getFinancialKPIs();
  }

  @Get('reconciliation/3-way-matches')
  async getThreeWayMatches() {
    return this.financeService.getThreeWayMatches();
  }

  @Get('reconciliation/3-way-matches/:id')
  async getThreeWayMatchById(@Param('id') id: string) {
    return this.financeService.getThreeWayMatchById(id);
  }

  @Post('reconciliation/validate')
  async validateThreeWayMatch(@Body() dto: ValidateThreeWayMatchDto) {
    return this.financeService.validateThreeWayMatch(dto);
  }

  @Post('reconciliation/approve/:id')
  async approveInvoice(@Param('id') id: string, @Body() dto: ApproveInvoiceDto) {
    return this.financeService.approveInvoice(id, dto);
  }

  @Get('cost-variance')
  async getCostVariance(@Query() query: CostVarianceQueryDto) {
    return this.financeService.getCostVarianceAnalysis(query);
  }
}

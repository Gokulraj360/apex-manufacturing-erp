import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import { SalaryAuditService } from './salary-audit.service';
import {
  QuerySalaryAuditDto,
  ResolveSalaryDiscrepancyDto,
  SyncBankGatewayFeedDto,
} from './dto/salary-audit.dto';

@Controller('api/v1/salary-audit')
export class SalaryAuditController {
  constructor(private readonly salaryAuditService: SalaryAuditService) {}

  @Get('summary')
  async getGlobalSalaryCreditSummary(@Query('batchId') batchId?: string) {
    return this.salaryAuditService.getGlobalSalaryCreditSummary(batchId);
  }

  @Get('logs')
  async getSalaryCreditLogs(@Query() query: QuerySalaryAuditDto) {
    return this.salaryAuditService.getSalaryCreditLogs(query);
  }

  @Get('discrepancies')
  async getDiscrepancyReport() {
    return this.salaryAuditService.getDiscrepancyReport();
  }

  @Post('resolve')
  async resolveDiscrepancy(
    @Body() dto: ResolveSalaryDiscrepancyDto,
    @Headers('x-admin-user') adminUserHeader?: string,
  ) {
    if (!dto.resolvedBy && adminUserHeader) {
      dto.resolvedBy = adminUserHeader;
    }
    return this.salaryAuditService.resolveDiscrepancy(dto);
  }

  @Post('sync-bank-feed')
  async syncBankGatewayFeed(
    @Body() dto: SyncBankGatewayFeedDto,
    @Headers('x-admin-user') adminUserHeader?: string,
  ) {
    if (!dto.initiatedBy && adminUserHeader) {
      dto.initiatedBy = adminUserHeader;
    }
    return this.salaryAuditService.syncBankGatewayFeed(dto);
  }
}

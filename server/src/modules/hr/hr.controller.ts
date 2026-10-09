import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { HRService } from './hr.service';
import { ClockInOutDto, QueryAttendanceDto, ApprovePayrollDto } from './dto/hr.dto';

@Controller(['hr', 'api/hr'])
export class HRController {
  constructor(private readonly hrService: HRService) {}

  @Get('master-register')
  async getMasterBiometricRegister() {
    return this.hrService.getMasterBiometricRegister();
  }

  @Post('payroll/execute-disbursal')
  async executePayrollDisbursal() {
    return this.hrService.executePayrollDisbursal();
  }

  @Get('kpis')
  async getKPIs() {
    return this.hrService.getHRKPIs();
  }

  @Get('shifts')
  async getShiftRosters() {
    return this.hrService.getShiftRosters();
  }

  @Get('attendance')
  async getAttendanceRoster(@Query() query: QueryAttendanceDto) {
    return this.hrService.getAttendanceRoster(query);
  }

  @Get('payroll')
  async getPayrollBreakdown(@Query('monthYear') monthYear?: string) {
    return this.hrService.getPayrollBreakdown(monthYear);
  }

  @Post('payroll/approve-batch')
  async approvePayrollBatch(@Body() dto: ApprovePayrollDto) {
    return this.hrService.approvePayrollBatch(dto);
  }
}

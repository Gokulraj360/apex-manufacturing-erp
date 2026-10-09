import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { DepartmentPayrollService } from './department-payroll.service';
import {
  CreateDepartmentPayrollSheetDto,
  CalculateSalaryPreviewDto,
  ReviewDepartmentPayrollDto,
  FinalApproveAndClearDto,
} from './dto/department-payroll.dto';

@Controller('api/v1/department-payroll')
export class DepartmentPayrollController {
  constructor(private readonly payrollService: DepartmentPayrollService) {}

  @Get('sheets')
  getAllSheets(
    @Query('department') department?: string,
    @Query('status') status?: string,
    @Query('monthYear') monthYear?: string
  ) {
    return {
      success: true,
      data: this.payrollService.getAllSheets({ department, status, monthYear }),
    };
  }

  @Get('summary')
  getSummaryMetrics() {
    return {
      success: true,
      data: this.payrollService.getSummaryMetrics(),
    };
  }

  @Get('templates')
  getDepartmentTemplates() {
    return {
      success: true,
      data: this.payrollService.getDepartmentTemplates(),
    };
  }

  @Post('calculate-preview')
  calculatePreview(@Body() dto: CalculateSalaryPreviewDto) {
    return {
      success: true,
      data: this.payrollService.calculateSalaryPreview(dto),
    };
  }

  @Get('sheets/:id')
  getSheetById(@Param('id') id: string) {
    return {
      success: true,
      data: this.payrollService.getSheetById(id),
    };
  }

  @Post('sheets')
  createSheet(@Body() dto: CreateDepartmentPayrollSheetDto) {
    return {
      success: true,
      message: 'Department payroll sheet created successfully.',
      data: this.payrollService.createSheet(dto),
    };
  }

  @Put('sheets/:id')
  updateSheet(@Param('id') id: string, @Body() dto: Partial<CreateDepartmentPayrollSheetDto>) {
    return {
      success: true,
      message: 'Department payroll sheet updated successfully.',
      data: this.payrollService.updateSheet(id, dto),
    };
  }

  @Post('sheets/:id/submit')
  submitToReview(
    @Param('id') id: string,
    @Body('managerNotes') managerNotes?: string
  ) {
    return {
      success: true,
      message: 'Department payroll sheet routed simultaneously to HR, Finance, and Super Admin inboxes.',
      data: this.payrollService.submitSheetToReview(id, managerNotes),
    };
  }

  @Post('sheets/:id/review')
  reviewSheet(
    @Param('id') id: string,
    @Body() dto: Omit<ReviewDepartmentPayrollDto, 'sheetId'>
  ) {
    return {
      success: true,
      message: `Audit decision recorded by ${dto.reviewerRole}.`,
      data: this.payrollService.reviewSheet({
        sheetId: id,
        ...dto,
      }),
    };
  }

  @Post('sheets/:id/approve-finance')
  approveByFinance(
    @Param('id') id: string,
    @Body() dto: Omit<FinalApproveAndClearDto, 'sheetId'>
  ) {
    return {
      success: true,
      message: 'Department payroll sheet cleared for financial settlement.',
      data: this.payrollService.approveByFinance({
        sheetId: id,
        ...dto,
      }),
    };
  }

  @Post('sheets/:id/reject')
  rejectSheet(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('reviewerName') reviewerName: string
  ) {
    return {
      success: true,
      message: 'Department payroll sheet returned to manager for revisions.',
      data: this.payrollService.rejectSheet(id, reason, reviewerName || 'Reviewer'),
    };
  }
}

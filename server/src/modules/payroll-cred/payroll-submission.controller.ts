import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PayrollSubmissionService } from './payroll-submission.service';
import { SubmitPayrollBatchDto } from './dto/payroll-cred.dto';

@Controller('api/v1/payroll-cred/batches')
export class PayrollSubmissionController {
  constructor(private readonly payrollSubmissionService: PayrollSubmissionService) {}

  @Get('draft-summary')
  getCurrentDraftSummary(
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.payrollSubmissionService.getCurrentPayrollDraft(
      month || 'October',
      year ? parseInt(year, 10) : 2026,
    );
  }

  @Post('submit-to-finance')
  @HttpCode(HttpStatus.CREATED)
  submitPayrollToFinance(@Body() dto: SubmitPayrollBatchDto) {
    return this.payrollSubmissionService.submitPayrollToFinance(dto);
  }

  @Get()
  findAllBatches(@Query('status') status?: string) {
    return this.payrollSubmissionService.findAllBatches(status);
  }

  @Get(':id')
  findBatchById(@Param('id') id: string) {
    return this.payrollSubmissionService.findBatchById(id);
  }
}

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PayrollInputService } from '../services/payroll-input.service';
import {
  GeneratePayrollSummaryDto,
  BatchApproveOvertimeDto,
  ForwardPayrollInputToFinanceDto,
} from '../dto/payroll-input.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/hr/payroll-inputs')
@UseGuards(RBACGuard)
export class PayrollInputController {
  constructor(private readonly payrollInputService: PayrollInputService) {}

  @Post('summary')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getMonthlyPayrollSummary(@Body() dto: GeneratePayrollSummaryDto) {
    return this.payrollInputService.computeMonthlyPayrollSummary(dto);
  }

  @Post('approve-overtime-batch')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async batchApproveOvertime(@Body() dto: BatchApproveOvertimeDto) {
    return this.payrollInputService.batchApproveOvertime(dto);
  }

  @Post('forward-to-finance')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async forwardPayrollInputToFinance(
    @Body() dto: ForwardPayrollInputToFinanceDto,
    @Req() req: any,
  ) {
    dto.dispatchedById = dto.dispatchedById || req.user?.id || 'HR-LEAD';
    return this.payrollInputService.forwardPayrollInputToFinance(dto);
  }
}

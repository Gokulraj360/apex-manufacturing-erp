import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FinancePayoutService } from './finance-payout.service';
import {
  FinanceVerifyBatchDto,
  FinanceReleasePayoutDto,
  FinanceRejectBatchDto,
} from './dto/payroll-cred.dto';

@Controller('api/v1/payroll-cred/finance')
export class FinancePayoutController {
  constructor(private readonly financePayoutService: FinancePayoutService) {}

  @Get('pending')
  getPendingBatches() {
    return this.financePayoutService.getPendingVerificationBatches();
  }

  @Post('verify/:id')
  @HttpCode(HttpStatus.OK)
  verifyBatch(
    @Param('id') id: string,
    @Body() dto: FinanceVerifyBatchDto,
  ) {
    return this.financePayoutService.verifyBatch(id, dto);
  }

  @Post('release/:id')
  @HttpCode(HttpStatus.OK)
  releaseAndSettlePayout(
    @Param('id') id: string,
    @Body() dto: FinanceReleasePayoutDto,
  ) {
    return this.financePayoutService.releaseAndSettlePayout(id, dto);
  }

  @Post('reject/:id')
  @HttpCode(HttpStatus.OK)
  rejectBatch(
    @Param('id') id: string,
    @Body() dto: FinanceRejectBatchDto,
  ) {
    return this.financePayoutService.rejectBatch(id, dto);
  }
}

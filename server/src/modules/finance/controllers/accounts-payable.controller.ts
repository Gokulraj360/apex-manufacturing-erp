import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountsPayableService } from '../services/accounts-payable.service';
import {
  CreateVendorBillDto,
  VerifyThreeWayMatchDto,
  ScheduleVendorPaymentDto,
  RecordVendorPaymentDisbursementDto,
} from '../dto/accounts-payable.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/finance/payables')
@UseGuards(RBACGuard)
export class AccountsPayableController {
  constructor(private readonly apService: AccountsPayableService) {}

  @Get('bills')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getVendorBills() {
    return this.apService.getVendorBills();
  }

  @Post('bills')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async createVendorBill(@Body() dto: CreateVendorBillDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.apService.createVendorBill(dto, adminUserId);
  }

  @Post('verify-3way-match')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async verifyThreeWayMatch(@Body() dto: VerifyThreeWayMatchDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.apService.verifyThreeWayMatch(dto, adminUserId);
  }

  @Post('schedule-payment')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async schedulePayment(@Body() dto: ScheduleVendorPaymentDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.apService.schedulePayment(dto, adminUserId);
  }

  @Post('disburse-payment')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async disbursePayment(
    @Body() dto: RecordVendorPaymentDisbursementDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.apService.disbursePayment(dto, adminUserId);
  }

  @Get('vendor-ledger')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getVendorLedger(@Query('vendorName') vendorName?: string) {
    return this.apService.getVendorLedger(vendorName);
  }
}

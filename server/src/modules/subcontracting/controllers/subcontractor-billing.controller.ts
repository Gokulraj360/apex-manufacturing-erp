import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubcontractorBillingService } from '../services/subcontractor-billing.service';
import {
  CreateSubcontractorBillDto,
  ApproveSubcontractorBillDto,
  SyncToFinanceDto,
} from '../dto/subcontractor-billing.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { SubcontractBillStatus } from '@prisma/client';

@Controller('api/v1/subcontracting/billing')
@UseGuards(RBACGuard)
export class SubcontractorBillingController {
  constructor(private readonly billingService: SubcontractorBillingService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'FINANCE' })
  async getBills(
    @Query('vendorId') vendorId?: string,
    @Query('status') status?: SubcontractBillStatus,
    @Query('syncedToFinance') syncedToFinance?: string,
  ) {
    const syncedBool = syncedToFinance !== undefined ? syncedToFinance === 'true' : undefined;
    return this.billingService.getBills({ vendorId, status, syncedToFinance: syncedBool });
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCE' })
  async createBill(@Body() dto: CreateSubcontractorBillDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.billingService.createBill(dto, userId);
  }

  @Post('approve')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCE' })
  async approveBill(@Body() dto: ApproveSubcontractorBillDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.billingService.approveBill(dto, userId);
  }

  @Post('sync-finance')
  @RequirePermissions({ action: 'ADMIN', resource: 'FINANCE' })
  async syncToFinance(@Body() dto: SyncToFinanceDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.billingService.syncToFinance(dto, userId);
  }
}

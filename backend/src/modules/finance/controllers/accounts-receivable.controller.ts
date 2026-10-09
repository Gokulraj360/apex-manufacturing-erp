import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountsReceivableService } from '../services/accounts-receivable.service';
import {
  CreateClientInvoiceDto,
  RecordIncomingPaymentDto,
  CreateCreditNoteDto,
} from '../dto/accounts-receivable.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/finance/receivables')
@UseGuards(RBACGuard)
export class AccountsReceivableController {
  constructor(private readonly arService: AccountsReceivableService) {}

  @Get('invoices')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getInvoices() {
    return this.arService.getInvoices();
  }

  @Post('invoices')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async createInvoice(@Body() dto: CreateClientInvoiceDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.arService.createInvoice(dto, adminUserId);
  }

  @Post('payments')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async recordPayment(@Body() dto: RecordIncomingPaymentDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.arService.recordPayment(dto, adminUserId);
  }

  @Post('credit-notes')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async createCreditNote(@Body() dto: CreateCreditNoteDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.arService.createCreditNote(dto, adminUserId);
  }

  @Get('aging-analysis')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getAgingAnalysis() {
    return this.arService.getAgingAnalysis();
  }
}

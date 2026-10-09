import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GeneralLedgerService } from '../services/general-ledger.service';
import {
  CreateAccountDto,
  CreateJournalEntryDto,
  PostJournalEntryDto,
  CreateAccountingPeriodDto,
  CloseAccountingPeriodDto,
} from '../dto/general-ledger.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/finance/general-ledger')
@UseGuards(RBACGuard)
export class GeneralLedgerController {
  constructor(private readonly glService: GeneralLedgerService) {}

  @Get('accounts')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getAccounts() {
    return this.glService.getChartOfAccounts();
  }

  @Post('accounts')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async createAccount(@Body() dto: CreateAccountDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.glService.createAccount(dto, adminUserId);
  }

  @Get('periods')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getPeriods() {
    return this.glService.getAccountingPeriods();
  }

  @Post('periods')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async createPeriod(@Body() dto: CreateAccountingPeriodDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.glService.createPeriod(dto, adminUserId);
  }

  @Post('periods/close')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async closePeriod(@Body() dto: CloseAccountingPeriodDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.glService.closeAccountingPeriod(dto, adminUserId);
  }

  @Get('journal-entries')
  @RequirePermissions({ action: 'READ', resource: 'FINANCIALS' })
  async getJournalEntries(@Query('periodId') periodId?: string) {
    return this.glService.getJournalEntries(periodId);
  }

  @Post('journal-entries')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async createJournalEntry(@Body() dto: CreateJournalEntryDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.glService.createJournalEntry(dto, adminUserId);
  }

  @Post('journal-entries/post')
  @RequirePermissions({ action: 'WRITE', resource: 'FINANCIALS' })
  async postJournalEntry(@Body() dto: PostJournalEntryDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.glService.postJournalEntry(dto, adminUserId);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MarketingBudgetService } from '../services/marketing-budget.service';
import {
  CreateAdvertisingBudgetDto,
  ApproveBudgetByFinanceDto,
  QueryBudgetsDto,
} from '../dto/marketing-budget.dto';

@Controller('api/v1/marketing/budgets')
export class MarketingBudgetController {
  constructor(private readonly budgetService: MarketingBudgetService) {}

  @Get()
  async getBudgets(@Query() query: QueryBudgetsDto) {
    return this.budgetService.getBudgets(query);
  }

  @Get('summary')
  async getBudgetSummary() {
    return this.budgetService.getBudgetSummary();
  }

  @Get(':id')
  async getBudgetById(@Param('id') id: string) {
    return this.budgetService.getBudgetById(id);
  }

  @Post()
  async createBudget(@Body() dto: CreateAdvertisingBudgetDto) {
    return this.budgetService.createBudget(dto);
  }

  @Patch(':id/submit-to-finance')
  async submitToFinance(
    @Param('id') id: string,
    @Body('requestedBy') requestedBy?: string,
  ) {
    return this.budgetService.submitToFinance(id, requestedBy);
  }

  @Patch(':id/approve')
  async approveBudgetByFinance(
    @Param('id') id: string,
    @Body() dto: ApproveBudgetByFinanceDto,
  ) {
    return this.budgetService.approveBudgetByFinance(id, dto);
  }

  @Delete(':id')
  async deleteBudget(@Param('id') id: string) {
    return this.budgetService.deleteBudget(id);
  }
}

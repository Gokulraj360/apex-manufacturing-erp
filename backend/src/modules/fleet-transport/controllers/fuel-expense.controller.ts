import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { FuelExpenseService } from '../services/fuel-expense.service';
import {
  CreateFuelExpenseDto,
  QueryFuelExpensesDto,
} from '../dto/fuel-expense.dto';

@Controller('api/v1/fleet/expenses')
export class FuelExpenseController {
  constructor(private readonly expenseService: FuelExpenseService) {}

  @Get()
  async getFuelExpenses(@Query() query: QueryFuelExpensesDto) {
    return this.expenseService.getFuelExpenses(query);
  }

  @Get('analytics/summary')
  async getExpenseAnalytics() {
    return this.expenseService.getExpenseAnalytics();
  }

  @Get(':id')
  async getFuelExpenseById(@Param('id') id: string) {
    return this.expenseService.getFuelExpenseById(id);
  }

  @Post()
  async createFuelExpense(@Body() dto: CreateFuelExpenseDto) {
    return this.expenseService.createFuelExpense(dto);
  }

  @Delete(':id')
  async deleteFuelExpense(@Param('id') id: string) {
    return this.expenseService.deleteFuelExpense(id);
  }
}

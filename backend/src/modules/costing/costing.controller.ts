import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
} from '@nestjs/common';
import { CostingService } from './costing.service';
import { BatchUpdateComponentRatesDto, UpdateCostingParametersDto } from './dto/costing.dto';

@Controller('costing')
export class CostingController {
  constructor(private readonly costingService: CostingService) {}

  /**
   * Main calculation endpoint for CP, SP, Margins, and Bottleneck
   */
  @Get('calculate')
  async calculateCostPrice(
    @Query('targetSellingPrice') targetSP?: string,
    @Query('monthlyVolume') monthlyVolume?: string,
  ) {
    const sp = targetSP ? Number(targetSP) : undefined;
    const vol = monthlyVolume ? Number(monthlyVolume) : undefined;
    return this.costingService.calculateCostPrice(sp, vol);
  }

  /**
   * Fetch current global costing parameters (Target SP & Target Monthly Production)
   */
  @Get('parameters')
  async getParameters() {
    return this.costingService.getParameters();
  }

  /**
   * Update Target Selling Price and/or Monthly Production Volume
   */
  @Patch('parameters')
  async updateParameters(@Body() dto: UpdateCostingParametersDto) {
    return this.costingService.updateParameters(dto);
  }

  /**
   * Batch update component unit cost rates
   */
  @Post('components/batch-rates')
  async batchUpdateRates(@Body() dto: BatchUpdateComponentRatesDto) {
    return this.costingService.batchUpdateComponentRates(dto);
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MarketIntelligenceService } from '../services/market-intelligence.service';
import {
  CreateMarketTrendDto,
  QueryMarketTrendsDto,
} from '../dto/market-intelligence.dto';

@Controller('api/v1/marketing/intelligence')
export class MarketIntelligenceController {
  constructor(private readonly intelligenceService: MarketIntelligenceService) {}

  @Get()
  async getTrends(@Query() query: QueryMarketTrendsDto) {
    return this.intelligenceService.getTrends(query);
  }

  @Get('summary')
  async getMarketIntelligenceSummary() {
    return this.intelligenceService.getMarketIntelligenceSummary();
  }

  @Get(':id')
  async getTrendById(@Param('id') id: string) {
    return this.intelligenceService.getTrendById(id);
  }

  @Post()
  async createTrend(@Body() dto: CreateMarketTrendDto) {
    return this.intelligenceService.createTrend(dto);
  }

  @Delete(':id')
  async deleteTrend(@Param('id') id: string) {
    return this.intelligenceService.deleteTrend(id);
  }
}

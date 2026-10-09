import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { RFQNegotiationService } from '../services/rfq-negotiation.service';
import {
  CreateRFQDto,
  SubmitSupplierBidDto,
  EvaluateBidDto,
  AwardRFQDto,
} from '../dto/rfq-negotiation.dto';

@Controller('api/v1/procurement/rfqs')
export class RFQNegotiationController {
  constructor(private readonly rfqNegotiationService: RFQNegotiationService) {}

  @Get()
  async getRFQs(@Query() query: any) {
    return this.rfqNegotiationService.getRFQs(query);
  }

  @Get(':id')
  async getRFQById(@Param('id') id: string) {
    return this.rfqNegotiationService.getRFQById(id);
  }

  @Post()
  async createRFQ(@Body() dto: CreateRFQDto) {
    return this.rfqNegotiationService.createRFQ(dto);
  }

  @Post('bids')
  async submitSupplierBid(@Body() dto: SubmitSupplierBidDto) {
    return this.rfqNegotiationService.submitSupplierBid(dto);
  }

  @Patch('bids/:bidId/evaluate')
  async evaluateBid(
    @Param('bidId') bidId: string,
    @Body() dto: EvaluateBidDto,
  ) {
    return this.rfqNegotiationService.evaluateBid(bidId, dto);
  }

  @Post(':id/award')
  async awardRFQ(
    @Param('id') id: string,
    @Body() dto: AwardRFQDto,
  ) {
    return this.rfqNegotiationService.awardRFQ(id, dto);
  }
}

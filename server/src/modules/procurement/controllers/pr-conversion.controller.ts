import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { PRConversionService } from '../services/pr-conversion.service';
import {
  CreateRequisitionDto,
  ReviewRequisitionDto,
  ConvertPRToPODto,
} from '../dto/pr-conversion.dto';

@Controller('api/v1/procurement/requisitions')
export class PRConversionController {
  constructor(private readonly prConversionService: PRConversionService) {}

  @Get()
  async getRequisitions(@Query() query: any) {
    return this.prConversionService.getRequisitions(query);
  }

  @Get(':id')
  async getRequisitionById(@Param('id') id: string) {
    return this.prConversionService.getRequisitionById(id);
  }

  @Post()
  async createRequisition(@Body() dto: CreateRequisitionDto) {
    return this.prConversionService.createRequisition(dto);
  }

  @Patch(':id/review')
  async reviewRequisition(
    @Param('id') id: string,
    @Body() dto: ReviewRequisitionDto,
  ) {
    return this.prConversionService.reviewRequisition(id, dto);
  }

  @Post(':id/convert-to-po')
  async convertApprovedPRToPO(
    @Param('id') id: string,
    @Body() dto: ConvertPRToPODto,
  ) {
    return this.prConversionService.convertApprovedPRToPO(id, dto);
  }
}

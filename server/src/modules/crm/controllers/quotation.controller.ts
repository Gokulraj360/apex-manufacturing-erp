import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { QuotationService } from '../services/quotation.service';
import {
  CreateQuotationDto,
  ReviseQuotationDto,
  UpdateQuotationStatusDto,
} from '../dto/quotation.dto';

@Controller('api/v1/crm/quotations')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Get()
  async getQuotations(@Query() query: any) {
    return this.quotationService.getQuotations(query);
  }

  @Get(':id')
  async getQuotationById(@Param('id') id: string) {
    return this.quotationService.getQuotationById(id);
  }

  @Post()
  async createQuotation(@Body() dto: CreateQuotationDto) {
    return this.quotationService.createQuotation(dto);
  }

  @Patch(':id/revise')
  async reviseQuotation(
    @Param('id') id: string,
    @Body() dto: ReviseQuotationDto,
  ) {
    return this.quotationService.reviseQuotation(id, dto);
  }

  @Patch(':id/status')
  async updateQuotationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateQuotationStatusDto,
  ) {
    return this.quotationService.updateQuotationStatus(id, dto);
  }
}

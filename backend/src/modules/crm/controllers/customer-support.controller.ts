import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { CustomerSupportService } from '../services/customer-support.service';
import {
  CreateInquiryDto,
  ResolveInquiryDto,
  CreateFeedbackDto,
} from '../dto/customer-support.dto';

@Controller('api/v1/crm/support')
export class CustomerSupportController {
  constructor(private readonly supportService: CustomerSupportService) {}

  @Get('inquiries')
  async getInquiries(@Query() query: any) {
    return this.supportService.getInquiries(query);
  }

  @Post('inquiries')
  async createInquiry(@Body() dto: CreateInquiryDto) {
    return this.supportService.createInquiry(dto);
  }

  @Patch('inquiries/:id/resolve')
  async resolveInquiry(
    @Param('id') id: string,
    @Body() dto: ResolveInquiryDto,
  ) {
    return this.supportService.resolveInquiry(id, dto);
  }

  @Get('feedbacks')
  async getFeedbacks(@Query() query: any) {
    return this.supportService.getFeedbacks(query);
  }

  @Post('feedbacks')
  async createFeedback(@Body() dto: CreateFeedbackDto) {
    return this.supportService.createFeedback(dto);
  }

  @Get('tracking/:orderNumber')
  async getOrderTrackingByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.supportService.getOrderTrackingByOrderNumber(orderNumber);
  }
}

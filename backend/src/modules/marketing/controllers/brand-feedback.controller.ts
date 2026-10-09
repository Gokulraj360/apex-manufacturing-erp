import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BrandFeedbackService } from '../services/brand-feedback.service';
import {
  CreateCustomerSurveyDto,
  RecordSurveyResponseDto,
  QuerySurveysDto,
} from '../dto/brand-feedback.dto';

@Controller('api/v1/marketing/feedback')
export class BrandFeedbackController {
  constructor(private readonly feedbackService: BrandFeedbackService) {}

  @Get()
  async getSurveys(@Query() query: QuerySurveysDto) {
    return this.feedbackService.getSurveys(query);
  }

  @Get('summary')
  async getFeedbackSummary() {
    return this.feedbackService.getFeedbackSummary();
  }

  @Get(':id')
  async getSurveyById(@Param('id') id: string) {
    return this.feedbackService.getSurveyById(id);
  }

  @Post()
  async createSurvey(@Body() dto: CreateCustomerSurveyDto) {
    return this.feedbackService.createSurvey(dto);
  }

  @Post('record-response')
  async recordResponse(@Body() dto: RecordSurveyResponseDto) {
    return this.feedbackService.recordResponse(dto);
  }

  @Patch(':id/close')
  async closeSurvey(
    @Param('id') id: string,
    @Body('closedBy') closedBy?: string,
  ) {
    return this.feedbackService.closeSurvey(id, closedBy);
  }
}

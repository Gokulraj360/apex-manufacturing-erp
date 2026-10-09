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
import { CampaignManagementService } from '../services/campaign-management.service';
import {
  CreateCampaignDto,
  UpdateCampaignMetricsDto,
  FeedLeadToCrmDto,
  QueryCampaignsDto,
} from '../dto/campaign-management.dto';

@Controller('api/v1/marketing/campaigns')
export class CampaignManagementController {
  constructor(private readonly campaignService: CampaignManagementService) {}

  @Get()
  async getCampaigns(@Query() query: QueryCampaignsDto) {
    return this.campaignService.getCampaigns(query);
  }

  @Get('metrics/overview')
  async getCampaignMetrics() {
    return this.campaignService.getCampaignMetrics();
  }

  @Get(':id')
  async getCampaignById(@Param('id') id: string) {
    return this.campaignService.getCampaignById(id);
  }

  @Post()
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return this.campaignService.createCampaign(dto);
  }

  @Patch(':id/metrics')
  async updateCampaignMetrics(
    @Param('id') id: string,
    @Body() dto: UpdateCampaignMetricsDto,
  ) {
    return this.campaignService.updateCampaignMetrics(id, dto);
  }

  @Post(':id/feed-lead')
  async feedLeadToCrm(
    @Param('id') id: string,
    @Body() dto: FeedLeadToCrmDto,
  ) {
    return this.campaignService.feedLeadToCrm(id, dto);
  }

  @Delete(':id')
  async deleteCampaign(@Param('id') id: string) {
    return this.campaignService.deleteCampaign(id);
  }
}

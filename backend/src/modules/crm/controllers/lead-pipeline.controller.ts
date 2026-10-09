import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { LeadPipelineService } from '../services/lead-pipeline.service';
import {
  CreateLeadDto,
  UpdateLeadStageDto,
  AddLeadNoteDto,
  CreateClientDto,
} from '../dto/lead-pipeline.dto';

@Controller('api/v1/crm')
export class LeadPipelineController {
  constructor(private readonly leadPipelineService: LeadPipelineService) {}

  @Get('leads')
  async getLeads(@Query() query: any) {
    return this.leadPipelineService.getLeads(query);
  }

  @Get('leads/:id')
  async getLeadById(@Param('id') id: string) {
    return this.leadPipelineService.getLeadById(id);
  }

  @Post('leads')
  async createLead(@Body() dto: CreateLeadDto) {
    return this.leadPipelineService.createLead(dto);
  }

  @Patch('leads/:id/stage')
  async updateLeadStage(
    @Param('id') id: string,
    @Body() dto: UpdateLeadStageDto,
  ) {
    return this.leadPipelineService.updateLeadStage(id, dto);
  }

  @Post('leads/:id/notes')
  async addLeadNote(
    @Param('id') id: string,
    @Body() dto: AddLeadNoteDto,
  ) {
    return this.leadPipelineService.addLeadNote(id, dto);
  }

  @Get('clients')
  async getClients(@Query() query: any) {
    return this.leadPipelineService.getClients(query);
  }

  @Post('clients')
  async createClient(@Body() dto: CreateClientDto) {
    return this.leadPipelineService.createClient(dto);
  }
}

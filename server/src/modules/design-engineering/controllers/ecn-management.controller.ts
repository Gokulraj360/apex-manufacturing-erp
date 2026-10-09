import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ECNManagementService } from '../services/ecn-management.service';
import {
  CreateECNDto,
  ReviewECNDto,
  QueryECNDto,
} from '../dto/ecn-management.dto';

@Controller('api/v1/design/ecn')
export class ECNManagementController {
  constructor(private readonly ecnService: ECNManagementService) {}

  @Get()
  async getECNs(@Query() query: QueryECNDto) {
    return this.ecnService.getECNs(query);
  }

  @Get('summary')
  async getECNSummary() {
    return this.ecnService.getECNSummary();
  }

  @Get(':id')
  async getECNById(@Param('id') id: string) {
    return this.ecnService.getECNById(id);
  }

  @Post()
  async createECN(@Body() dto: CreateECNDto) {
    return this.ecnService.createECN(dto);
  }

  @Patch(':id/review')
  async reviewECN(
    @Param('id') id: string,
    @Body() dto: ReviewECNDto,
  ) {
    return this.ecnService.reviewECN(id, dto);
  }
}

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
import { VehicleComplianceService } from '../services/vehicle-compliance.service';
import {
  CreateComplianceDocDto,
  UpdateComplianceDocDto,
  QueryComplianceDocsDto,
} from '../dto/vehicle-compliance.dto';

@Controller('api/v1/fleet/compliance')
export class VehicleComplianceController {
  constructor(private readonly complianceService: VehicleComplianceService) {}

  @Get()
  async getComplianceDocs(@Query() query: QueryComplianceDocsDto) {
    return this.complianceService.getComplianceDocs(query);
  }

  @Get('analytics/summary')
  async getComplianceStatistics() {
    return this.complianceService.getComplianceStatistics();
  }

  @Get(':id')
  async getComplianceDocById(@Param('id') id: string) {
    return this.complianceService.getComplianceDocById(id);
  }

  @Post()
  async createComplianceDoc(@Body() dto: CreateComplianceDocDto) {
    return this.complianceService.createComplianceDoc(dto);
  }

  @Patch(':id')
  async updateComplianceDoc(
    @Param('id') id: string,
    @Body() dto: UpdateComplianceDocDto,
  ) {
    return this.complianceService.updateComplianceDoc(id, dto);
  }

  @Delete(':id')
  async deleteComplianceDoc(@Param('id') id: string) {
    return this.complianceService.deleteComplianceDoc(id);
  }
}

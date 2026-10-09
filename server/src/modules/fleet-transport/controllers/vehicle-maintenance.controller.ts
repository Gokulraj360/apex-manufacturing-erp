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
import { VehicleMaintenanceService } from '../services/vehicle-maintenance.service';
import {
  CreateServiceLogDto,
  UpdateServiceLogDto,
  QueryServiceLogsDto,
} from '../dto/vehicle-maintenance.dto';

@Controller('api/v1/fleet/maintenance')
export class VehicleMaintenanceController {
  constructor(private readonly maintenanceService: VehicleMaintenanceService) {}

  @Get()
  async getServiceLogs(@Query() query: QueryServiceLogsDto) {
    return this.maintenanceService.getServiceLogs(query);
  }

  @Get('analytics/summary')
  async getMaintenanceStatistics() {
    return this.maintenanceService.getMaintenanceStatistics();
  }

  @Get(':id')
  async getServiceLogById(@Param('id') id: string) {
    return this.maintenanceService.getServiceLogById(id);
  }

  @Post()
  async createServiceLog(@Body() dto: CreateServiceLogDto) {
    return this.maintenanceService.createServiceLog(dto);
  }

  @Patch(':id')
  async updateServiceLog(
    @Param('id') id: string,
    @Body() dto: UpdateServiceLogDto,
  ) {
    return this.maintenanceService.updateServiceLog(id, dto);
  }

  @Delete(':id')
  async deleteServiceLog(@Param('id') id: string) {
    return this.maintenanceService.deleteServiceLog(id);
  }
}

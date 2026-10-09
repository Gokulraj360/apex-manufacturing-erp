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
import { VehicleRegistryService } from '../services/vehicle-registry.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  QueryVehiclesDto,
} from '../dto/vehicle-registry.dto';

@Controller('api/v1/fleet/vehicles')
export class VehicleRegistryController {
  constructor(private readonly registryService: VehicleRegistryService) {}

  @Get()
  async getVehicles(@Query() query: QueryVehiclesDto) {
    return this.registryService.getVehicles(query);
  }

  @Get('overview/metrics')
  async getFleetOverviewMetrics() {
    return this.registryService.getFleetOverviewMetrics();
  }

  @Get(':id')
  async getVehicleById(@Param('id') id: string) {
    return this.registryService.getVehicleById(id);
  }

  @Post()
  async createVehicle(@Body() dto: CreateVehicleDto) {
    return this.registryService.createVehicle(dto);
  }

  @Patch(':id')
  async updateVehicle(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.registryService.updateVehicle(id, dto);
  }

  @Delete(':id')
  async deleteVehicle(@Param('id') id: string) {
    return this.registryService.deleteVehicle(id);
  }
}

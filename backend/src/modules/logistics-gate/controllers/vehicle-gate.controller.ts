import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VehicleGateService } from '../services/vehicle-gate.service';
import { CheckInVehicleDto, CheckOutVehicleDto } from '../dto/vehicle-gate.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { GateMovementStatus } from '@prisma/client';

@Controller('api/v1/logistics-gate/vehicles')
@UseGuards(RBACGuard)
export class VehicleGateController {
  constructor(private readonly vehicleService: VehicleGateService) {}

  @Get('logs')
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getLogs(@Query('status') status?: GateMovementStatus) {
    return this.vehicleService.getVehicleLogs(status);
  }

  @Get('metrics')
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getPerimeterMetrics() {
    return this.vehicleService.getPerimeterMetrics();
  }

  @Get('logs/:id')
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getLogById(@Param('id') id: string) {
    return this.vehicleService.getVehicleLogById(id);
  }

  @Post('check-in')
  @RequirePermissions({ action: 'WRITE', resource: 'LOGISTICS' })
  async checkIn(@Body() dto: CheckInVehicleDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.vehicleService.checkInVehicle(dto, userId);
  }

  @Put('logs/:id/check-out')
  @RequirePermissions({ action: 'WRITE', resource: 'LOGISTICS' })
  async checkOut(
    @Param('id') id: string,
    @Body() dto: CheckOutVehicleDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.vehicleService.checkOutVehicle(id, dto, userId);
  }
}

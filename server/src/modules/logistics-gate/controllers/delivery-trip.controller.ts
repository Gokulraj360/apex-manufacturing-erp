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
import { DeliveryTripService } from '../services/delivery-trip.service';
import {
  CreateDeliveryTripDto,
  UpdateDeliveryTripStatusDto,
} from '../dto/delivery-trip.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { TripStatus } from '@prisma/client';

@Controller('api/v1/logistics-gate/trips')
@UseGuards(RBACGuard)
export class DeliveryTripController {
  constructor(private readonly tripService: DeliveryTripService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getTrips(@Query('status') status?: TripStatus) {
    return this.tripService.getTrips(status);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getTripById(@Param('id') id: string) {
    return this.tripService.getTripById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'LOGISTICS' })
  async createTrip(@Body() dto: CreateDeliveryTripDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.tripService.createTrip(dto, userId);
  }

  @Put(':id/status')
  @RequirePermissions({ action: 'WRITE', resource: 'LOGISTICS' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryTripStatusDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.tripService.updateTripStatus(id, dto, userId);
  }
}

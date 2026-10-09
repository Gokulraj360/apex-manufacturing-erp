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
import { ShipmentVerificationService } from '../services/shipment-verification.service';
import {
  CreateDispatchShipmentDto,
  VerifyVehicleLoadingDto,
  RegisterCarrierDto,
} from '../dto/shipment-verification.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ShipmentStatus } from '@prisma/client';

@Controller('api/v1/dispatch/shipping')
@UseGuards(RBACGuard)
export class ShipmentVerificationController {
  constructor(private readonly shipmentService: ShipmentVerificationService) {}

  @Get('shipments')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getShipments(@Query('status') status?: ShipmentStatus) {
    return this.shipmentService.getShipments(status);
  }

  @Get('shipments/:id')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getShipmentById(@Param('id') id: string) {
    return this.shipmentService.getShipmentById(id);
  }

  @Post('shipments')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async createShipment(@Body() dto: CreateDispatchShipmentDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.shipmentService.createShipment(dto, userId);
  }

  @Put('shipments/:id/verify-loading')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async verifyLoading(
    @Param('id') id: string,
    @Body() dto: VerifyVehicleLoadingDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.shipmentService.verifyVehicleLoading(id, dto, userId);
  }

  @Get('carriers')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getCarriers() {
    return this.shipmentService.getCarriers();
  }

  @Post('carriers')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async registerCarrier(@Body() dto: RegisterCarrierDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.shipmentService.registerCarrier(dto, userId);
  }
}

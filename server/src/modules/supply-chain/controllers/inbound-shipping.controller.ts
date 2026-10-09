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
import { InboundShippingService } from '../services/inbound-shipping.service';
import {
  CreateInboundShipmentDto,
  UpdateShipmentMilestoneDto,
  QueryInboundShipmentDto,
} from '../dto/inbound-shipping.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/supply-chain/inbound')
@UseGuards(RBACGuard)
export class InboundShippingController {
  constructor(private readonly inboundService: InboundShippingService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getShipments(@Query() query: QueryInboundShipmentDto) {
    return this.inboundService.getShipments(query);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getShipmentById(@Param('id') id: string) {
    return this.inboundService.getShipmentById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createShipment(@Body() dto: CreateInboundShipmentDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.inboundService.createShipment(dto, userId);
  }

  @Put(':id/milestone')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateMilestone(
    @Param('id') id: string,
    @Body() dto: UpdateShipmentMilestoneDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.inboundService.updateMilestone(id, dto, userId);
  }
}

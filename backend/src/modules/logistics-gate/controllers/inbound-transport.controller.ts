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
import { InboundLogisticsService } from '../services/inbound-transport.service';
import {
  CreateInboundTransportCheckDto,
  CompleteWeighbridgeTareDto,
} from '../dto/inbound-transport.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/logistics-gate/inbound')
@UseGuards(RBACGuard)
export class InboundLogisticsController {
  constructor(private readonly inboundService: InboundLogisticsService) {}

  @Get('checks')
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getChecks(@Query('verified') verified?: string) {
    const isVerified = verified !== undefined ? verified === 'true' : undefined;
    return this.inboundService.getChecks(isVerified);
  }

  @Get('checks/:id')
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getCheckById(@Param('id') id: string) {
    return this.inboundService.getCheckById(id);
  }

  @Post('checks')
  @RequirePermissions({ action: 'WRITE', resource: 'LOGISTICS' })
  async createCheck(@Body() dto: CreateInboundTransportCheckDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.inboundService.createInboundCheck(dto, userId);
  }

  @Put('checks/:id/weighbridge-tare')
  @RequirePermissions({ action: 'WRITE', resource: 'LOGISTICS' })
  async completeTare(
    @Param('id') id: string,
    @Body() dto: CompleteWeighbridgeTareDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.inboundService.completeWeighbridgeTare(id, dto, userId);
  }
}

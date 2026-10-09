import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OutboundGateService } from '../services/outbound-gate.service';
import { CreateOutboundGateClearanceDto } from '../dto/outbound-gate.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/logistics-gate/outbound')
@UseGuards(RBACGuard)
export class OutboundGateController {
  constructor(private readonly outboundService: OutboundGateService) {}

  @Get('clearances')
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getClearances() {
    return this.outboundService.getClearances();
  }

  @Get('clearances/:id')
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getClearanceById(@Param('id') id: string) {
    return this.outboundService.getClearanceById(id);
  }

  @Post('clearances')
  @RequirePermissions({ action: 'WRITE', resource: 'LOGISTICS' })
  async createClearance(@Body() dto: CreateOutboundGateClearanceDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.outboundService.createClearance(dto, userId);
  }
}

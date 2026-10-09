import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DispatchService } from '../services/dispatch.service';
import {
  CreateDeliveryChallanDto,
  UpdateChallanStatusDto,
} from '../dto/dispatch.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/warehouse/dispatch')
@UseGuards(RBACGuard)
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get('challans')
  @RequirePermissions({ action: 'READ', resource: 'INVENTORY' })
  async getDeliveryChallans() {
    return this.dispatchService.getDeliveryChallans();
  }

  @Post('challans')
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async createDeliveryChallan(@Body() dto: CreateDeliveryChallanDto, @Req() req: any) {
    const user = req.user?.id;
    return this.dispatchService.createDeliveryChallan(dto, user);
  }

  @Put('challans/status')
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async updateChallanStatus(@Body() dto: UpdateChallanStatusDto, @Req() req: any) {
    const user = req.user?.id;
    return this.dispatchService.updateChallanStatus(dto, user);
  }
}

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
import { OrderPickingStagingService } from '../services/order-picking-staging.service';
import {
  CreateSalesOrderFulfillmentDto,
  UpdatePickingProgressDto,
} from '../dto/order-picking-staging.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { PickingStatus } from '@prisma/client';

@Controller('api/v1/dispatch/picking')
@UseGuards(RBACGuard)
export class OrderPickingStagingController {
  constructor(private readonly pickingService: OrderPickingStagingService) {}

  @Get('orders')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getPickLists(@Query('status') status?: PickingStatus) {
    return this.pickingService.getPickLists(status);
  }

  @Get('staging/summary')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getStagingSummary() {
    return this.pickingService.getStagingSummary();
  }

  @Get('orders/:id')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getPickListById(@Param('id') id: string) {
    return this.pickingService.getPickListById(id);
  }

  @Post('orders')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async createPickList(@Body() dto: CreateSalesOrderFulfillmentDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.pickingService.createPickList(dto, userId);
  }

  @Put('orders/:id/progress')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdatePickingProgressDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.pickingService.updatePickingProgress(id, dto, userId);
  }
}

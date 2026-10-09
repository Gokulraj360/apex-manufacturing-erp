import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FinishedGoodsInventoryService } from '../services/finished-goods-inventory.service';
import {
  CreateFinishedGoodsBayDto,
  PutawayFinishedGoodsDto,
  AdjustFinishedGoodsStockDto,
} from '../dto/finished-goods-inventory.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/dispatch/inventory')
@UseGuards(RBACGuard)
export class FinishedGoodsInventoryController {
  constructor(private readonly inventoryService: FinishedGoodsInventoryService) {}

  @Get('bays')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getBays(@Query('zone') zone?: string) {
    return this.inventoryService.getBays(zone);
  }

  @Post('bays')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async createBay(@Body() dto: CreateFinishedGoodsBayDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.inventoryService.createBay(dto, userId);
  }

  @Post('putaway')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async putawayStock(@Body() dto: PutawayFinishedGoodsDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.inventoryService.putawayStock(dto, userId);
  }

  @Put('adjust')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async adjustStock(@Body() dto: AdjustFinishedGoodsStockDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.inventoryService.adjustBayStock(dto, userId);
  }

  @Get('metrics')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getStorageMetrics() {
    return this.inventoryService.getStorageOptimizationMetrics();
  }
}

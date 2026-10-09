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
import { InventoryLocationService } from '../services/inventory-location.service';
import {
  CreateBinLocationDto,
  CreateWarehouseStockDto,
  AdjustStockLevelDto,
} from '../dto/inventory-location.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/warehouse/inventory')
@UseGuards(RBACGuard)
export class InventoryLocationController {
  constructor(private readonly inventoryService: InventoryLocationService) {}

  @Get('locations')
  @RequirePermissions({ action: 'READ', resource: 'INVENTORY' })
  async getLocations() {
    return this.inventoryService.getBinLocations();
  }

  @Post('locations')
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async createLocation(@Body() dto: CreateBinLocationDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.inventoryService.createBinLocation(dto, adminUserId);
  }

  @Get('stocks')
  @RequirePermissions({ action: 'READ', resource: 'INVENTORY' })
  async getStocks(@Query('category') category?: string) {
    return this.inventoryService.getInventory(category);
  }

  @Post('stocks')
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async createStock(@Body() dto: CreateWarehouseStockDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.inventoryService.createStockItem(dto, adminUserId);
  }

  @Put('stocks/adjust')
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async adjustStock(@Body() dto: AdjustStockLevelDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.inventoryService.adjustStock(dto, adminUserId);
  }
}

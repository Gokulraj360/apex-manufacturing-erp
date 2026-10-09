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
import { FieldInventoryService } from '../services/field-inventory.service';
import {
  CreateVanStockDto,
  UpdateVanStockQuantityDto,
  CreateFieldPartRequisitionDto,
  UpdatePartRequisitionStatusDto,
  QueryVanStockDto,
} from '../dto/field-inventory.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/field-service/inventory')
@UseGuards(RBACGuard)
export class FieldInventoryController {
  constructor(private readonly inventoryService: FieldInventoryService) {}

  @Get('van-stocks')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getVanStocks(@Query() query: QueryVanStockDto) {
    return this.inventoryService.getVanStocks(query);
  }

  @Post('van-stocks')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createVanStock(@Body() dto: CreateVanStockDto) {
    return this.inventoryService.createVanStock(dto);
  }

  @Post('van-stocks/quantity')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateStockQuantity(@Body() dto: UpdateVanStockQuantityDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.inventoryService.updateStockQuantity(dto, userId);
  }

  @Get('requisitions')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getPartRequisitions(@Query('search') search?: string) {
    return this.inventoryService.getPartRequisitions(search);
  }

  @Post('requisitions')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createPartRequisition(@Body() dto: CreateFieldPartRequisitionDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.inventoryService.createPartRequisition(dto, userId);
  }

  @Put('requisitions/:id/status')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateRequisitionStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePartRequisitionStatusDto,
  ) {
    return this.inventoryService.updateRequisitionStatus(id, dto);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { PurchaseOrderService } from '../services/purchase-order.service';
import {
  CreateProcurementPODto,
  ApprovePODto,
  IssuePODto,
} from '../dto/purchase-order.dto';

@Controller('api/v1/procurement/purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly poService: PurchaseOrderService) {}

  @Get()
  async getPurchaseOrders(@Query() query: any) {
    return this.poService.getPurchaseOrders(query);
  }

  @Get(':id')
  async getPurchaseOrderById(@Param('id') id: string) {
    return this.poService.getPurchaseOrderById(id);
  }

  @Post()
  async createPurchaseOrder(@Body() dto: CreateProcurementPODto) {
    return this.poService.createPurchaseOrder(dto);
  }

  @Patch(':id/approve')
  async approvePurchaseOrder(
    @Param('id') id: string,
    @Body() dto: ApprovePODto,
  ) {
    return this.poService.approvePurchaseOrder(id, dto);
  }

  @Patch(':id/issue')
  async issuePurchaseOrder(
    @Param('id') id: string,
    @Body() dto: IssuePODto,
  ) {
    return this.poService.issuePurchaseOrder(id, dto);
  }
}

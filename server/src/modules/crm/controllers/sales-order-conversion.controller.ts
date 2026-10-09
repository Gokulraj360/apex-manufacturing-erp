import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { SalesOrderConversionService } from '../services/sales-order-conversion.service';
import {
  ConvertDealToSalesOrderDto,
  UpdateSalesOrderStatusDto,
  CreateClientContractDto,
} from '../dto/sales-order.dto';

@Controller('api/v1/crm/orders')
export class SalesOrderConversionController {
  constructor(
    private readonly salesOrderService: SalesOrderConversionService,
  ) {}

  @Get()
  async getSalesOrders(@Query() query: any) {
    return this.salesOrderService.getSalesOrders(query);
  }

  @Get(':id')
  async getSalesOrderById(@Param('id') id: string) {
    return this.salesOrderService.getSalesOrderById(id);
  }

  @Post('convert')
  async convertDealToSalesOrder(@Body() dto: ConvertDealToSalesOrderDto) {
    return this.salesOrderService.convertDealToSalesOrder(dto);
  }

  @Patch(':id/status')
  async updateSalesOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSalesOrderStatusDto,
  ) {
    return this.salesOrderService.updateSalesOrderStatus(id, dto);
  }

  @Get('contracts/list')
  async getClientContracts(@Query() query: any) {
    return this.salesOrderService.getClientContracts(query);
  }

  @Post('contracts')
  async createClientContract(@Body() dto: CreateClientContractDto) {
    return this.salesOrderService.createClientContract(dto);
  }
}

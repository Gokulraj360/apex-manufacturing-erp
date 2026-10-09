import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import {
  CreateSalesOrderDto,
  QuerySalesOrderDto,
  UpdateSalesOrderStatusDto,
} from './dto/sales-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller(['sales', 'api/sales'])
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('customer-credits')
  @ResponseMessage('Customer credit assessments retrieved successfully')
  async getCustomerCredits() {
    return this.salesService.getCustomerCredits();
  }

  @Get('customer-credits/:customerName')
  @ResponseMessage('Customer credit detail retrieved successfully')
  async getCustomerCreditByName(@Param('customerName') customerName: string) {
    return this.salesService.getCustomerCreditByName(customerName);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.FINANCE,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.DISPATCH,
  )
  @Get('kpis')
  @ResponseMessage('Sales KPI metrics retrieved successfully')
  async getKPISummary() {
    return this.salesService.getKPISummary();
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.FINANCE,
    Role.PRODUCTION_SUPERVISOR,
    Role.DISPATCH,
  )
  @Get()
  @ResponseMessage('Sales Orders retrieved successfully')
  async findAll(@Query() query: QuerySalesOrderDto) {
    return this.salesService.findAll(query);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.FINANCE,
    Role.PRODUCTION_SUPERVISOR,
    Role.DISPATCH,
  )
  @Get(':id')
  @ResponseMessage('Sales Order details retrieved successfully')
  async findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Sales Order created successfully')
  async create(@Body() dto: CreateSalesOrderDto) {
    return this.salesService.create(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.FINANCE, Role.DISPATCH)
  @Patch(':id/status')
  @ResponseMessage('Sales Order status updated successfully')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSalesOrderStatusDto,
  ) {
    return this.salesService.updateStatus(id, dto.status);
  }
}

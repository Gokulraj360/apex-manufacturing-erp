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
import { ProcurementService } from './procurement.service';
import {
  CreatePurchaseOrderDto,
  QueryPODto,
  UpdatePOStatusDto,
} from './dto/procurement.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PURCHASE,
    Role.INVENTORY,
    Role.FINANCE,
    Role.PPC,
  )
  @Get('kpis')
  @ResponseMessage('Procurement KPI metrics retrieved successfully')
  async getKPISummary() {
    return this.procurementService.getKPISummary();
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PURCHASE,
    Role.INVENTORY,
    Role.FINANCE,
    Role.PPC,
  )
  @Get('orders')
  @ResponseMessage('Purchase Orders retrieved successfully')
  async findAllPOs(@Query() query: QueryPODto) {
    return this.procurementService.findAllPOs(query);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PURCHASE,
    Role.INVENTORY,
    Role.FINANCE,
    Role.PPC,
  )
  @Get('orders/:id')
  @ResponseMessage('Purchase Order details retrieved successfully')
  async findOnePO(@Param('id') id: string) {
    return this.procurementService.findOnePO(id);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PURCHASE)
  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Purchase Order generated successfully')
  async createPO(@Body() dto: CreatePurchaseOrderDto) {
    return this.procurementService.createPO(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PURCHASE, Role.INVENTORY, Role.FINANCE)
  @Patch('orders/:id/status')
  @ResponseMessage('Purchase Order status updated successfully')
  async updatePOStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePOStatusDto,
  ) {
    return this.procurementService.updatePOStatus(id, dto.status);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PURCHASE,
    Role.INVENTORY,
    Role.FINANCE,
  )
  @Get('vendors')
  @ResponseMessage('Registered vendors retrieved successfully')
  async findAllVendors() {
    return this.procurementService.findAllVendors();
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PURCHASE, Role.PPC)
  @Get('pending-requisitions')
  @ResponseMessage('PPC shortage purchase requisitions retrieved successfully')
  async getPendingRequisitions() {
    return this.procurementService.getPendingRequisitions();
  }
}

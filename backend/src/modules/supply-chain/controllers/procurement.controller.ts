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
import { ProcurementService } from '../services/procurement.service';
import {
  CreatePurchaseRequisitionDto,
  ApproveRejectRequisitionDto,
  CreatePurchaseOrderSupplyDto,
  UpdateSupplyPOStatusDto,
  QueryProcurementDto,
} from '../dto/procurement.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/supply-chain/procurement')
@UseGuards(RBACGuard)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  // ==================== REQUISITIONS ====================

  @Get('requisitions')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getRequisitions(@Query() query: QueryProcurementDto) {
    return this.procurementService.getRequisitions(query);
  }

  @Get('requisitions/:id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getRequisitionById(@Param('id') id: string) {
    return this.procurementService.getRequisitionById(id);
  }

  @Post('requisitions')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createRequisition(@Body() dto: CreatePurchaseRequisitionDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.procurementService.createRequisition(dto, userId);
  }

  @Put('requisitions/:id/review')
  @RequirePermissions({ action: 'ADMIN', resource: 'PRODUCTION' })
  async approveRejectRequisition(
    @Param('id') id: string,
    @Body() dto: ApproveRejectRequisitionDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.procurementService.approveRejectRequisition(id, dto, userId);
  }

  // ==================== PURCHASE ORDERS ====================

  @Get('orders')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getPurchaseOrders(@Query() query: QueryProcurementDto) {
    return this.procurementService.getPurchaseOrders(query);
  }

  @Get('orders/:id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getPurchaseOrderById(@Param('id') id: string) {
    return this.procurementService.getPurchaseOrderById(id);
  }

  @Post('orders')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createPurchaseOrder(@Body() dto: CreatePurchaseOrderSupplyDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.procurementService.createPurchaseOrder(dto, userId);
  }

  @Put('orders/:id/status')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updatePurchaseOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSupplyPOStatusDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.procurementService.updatePurchaseOrderStatus(id, dto, userId);
  }
}

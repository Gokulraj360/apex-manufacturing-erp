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
import { WorkOrderService } from '../services/work-order.service';
import {
  CreateWorkOrderDto,
  UpdateWorkOrderStatusDto,
  CreateBatchDto,
  ControlBatchDto,
  UpdateMilestoneDto,
} from '../dto/work-order.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { WorkOrderStatus } from '@prisma/client';

@Controller('api/v1/production/work-orders')
@UseGuards(RBACGuard)
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getWorkOrders(@Query('status') status?: WorkOrderStatus) {
    return this.workOrderService.getWorkOrders(status);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createWorkOrder(@Body() dto: CreateWorkOrderDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.workOrderService.createWorkOrder(dto, adminUserId);
  }

  @Put('status')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateStatus(@Body() dto: UpdateWorkOrderStatusDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.workOrderService.updateWorkOrderStatus(dto, adminUserId);
  }

  @Post('batches')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createBatch(@Body() dto: CreateBatchDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.workOrderService.createBatch(dto, adminUserId);
  }

  @Post('batches/control')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async controlBatch(@Body() dto: ControlBatchDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.workOrderService.controlBatch(dto, adminUserId);
  }

  @Put('milestones')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateMilestone(@Body() dto: UpdateMilestoneDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.workOrderService.updateMilestone(dto, adminUserId);
  }
}

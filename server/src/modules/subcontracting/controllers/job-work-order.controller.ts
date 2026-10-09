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
import { JobWorkOrderService } from '../services/job-work-order.service';
import {
  CreateJobWorkOrderDto,
  UpdateJobWorkOrderDto,
  QueryJobWorkOrderDto,
  CreateSubcontractorVendorDto,
} from '../dto/job-work-order.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/subcontracting/work-orders')
@UseGuards(RBACGuard)
export class JobWorkOrderController {
  constructor(private readonly jwoService: JobWorkOrderService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getWorkOrders(@Query() query: QueryJobWorkOrderDto) {
    return this.jwoService.getWorkOrders(query);
  }

  @Get('vendors/all')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getVendors(@Query('search') search?: string) {
    return this.jwoService.getVendors(search);
  }

  @Post('vendors')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createVendor(@Body() dto: CreateSubcontractorVendorDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.jwoService.createVendor(dto, userId);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getWorkOrderById(@Param('id') id: string) {
    return this.jwoService.getWorkOrderById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createWorkOrder(@Body() dto: CreateJobWorkOrderDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.jwoService.createWorkOrder(dto, userId);
  }

  @Put(':id')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateWorkOrder(
    @Param('id') id: string,
    @Body() dto: UpdateJobWorkOrderDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.jwoService.updateWorkOrder(id, dto, userId);
  }
}

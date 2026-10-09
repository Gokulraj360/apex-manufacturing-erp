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
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto, UpdateWorkOrderStatusDto } from './dto/create-work-order.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { WorkOrderStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.QC_MANAGER,
    Role.DISPATCH,
  )
  @Get()
  @ResponseMessage('Work orders retrieved successfully')
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: WorkOrderStatus,
  ) {
    return this.workOrdersService.findAll(pagination, status);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.QC_MANAGER,
    Role.DISPATCH,
  )
  @Get(':id')
  @ResponseMessage('Work order details retrieved successfully')
  async findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.PRODUCTION_SUPERVISOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Work order scheduled successfully')
  async create(@Body() dto: CreateWorkOrderDto) {
    return this.workOrdersService.create(dto);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
  )
  @Patch(':id/status')
  @ResponseMessage('Work order status updated successfully')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateWorkOrderStatusDto,
  ) {
    return this.workOrdersService.updateStatus(id, dto);
  }
}

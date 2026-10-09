import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import {
  CreateDispatchOrderDto,
  SignOffDispatchDto,
  QueryDispatchDto,
} from './dto/dispatch.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@Controller('dispatch')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get('kpis')
  @Roles(Role.ADMIN, Role.OWNER, Role.DISPATCH, Role.GATE_SECURITY, Role.SALES)
  @ResponseMessage('Dispatch logistics KPIs retrieved successfully')
  async getDispatchKPIs() {
    return this.dispatchService.getDispatchKPIs();
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.DISPATCH, Role.GATE_SECURITY, Role.SALES)
  @ResponseMessage('Dispatch orders retrieved successfully')
  async findAll(@Query() query: QueryDispatchDto) {
    return this.dispatchService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.DISPATCH, Role.GATE_SECURITY, Role.SALES)
  @ResponseMessage('Dispatch order details retrieved successfully')
  async findOne(@Param('id') id: string) {
    return this.dispatchService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.DISPATCH)
  @ResponseMessage('Packing list and dispatch order created successfully')
  async createDispatchOrder(@Body() dto: CreateDispatchOrderDto) {
    return this.dispatchService.createDispatchOrder(dto);
  }

  @Post(':id/sign-off')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.OWNER, Role.DISPATCH)
  @ResponseMessage('Dispatch signed off and Gate Security notified for outward clearance')
  async signOffAndNotifyGate(
    @Param('id') id: string,
    @Body() dto: SignOffDispatchDto,
  ) {
    return this.dispatchService.signOffAndNotifyGate(id, dto);
  }
}

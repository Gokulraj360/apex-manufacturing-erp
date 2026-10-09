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
import { PPCService } from './ppc.service';
import {
  CreateMPSDto,
  QueryMPSDto,
  UpdateMPSStatusDto,
} from './dto/ppc.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ppc')
export class PPCController {
  constructor(private readonly ppcService: PPCService) {}

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.INVENTORY,
    Role.PURCHASE,
  )
  @Get('mps')
  @ResponseMessage('Master Production Schedules retrieved successfully')
  async findAllMPS(@Query() query: QueryMPSDto) {
    return this.ppcService.findAllMPS(query);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.INVENTORY,
    Role.PURCHASE,
  )
  @Get('mps/:id')
  @ResponseMessage('Master Production Schedule details retrieved successfully')
  async findOneMPS(@Param('id') id: string) {
    return this.ppcService.findOneMPS(id);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC)
  @Post('mps')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Master Production Schedule created successfully')
  async createMPS(@Body() dto: CreateMPSDto) {
    return this.ppcService.createMPS(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.PRODUCTION_SUPERVISOR)
  @Patch('mps/:id/status')
  @ResponseMessage('Master Production Schedule status updated successfully')
  async updateMPSStatus(
    @Param('id') id: string,
    @Body() dto: UpdateMPSStatusDto,
  ) {
    return this.ppcService.updateMPSStatus(id, dto.status);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PURCHASE,
    Role.INVENTORY,
    Role.PRODUCTION_SUPERVISOR,
  )
  @Get('mrp/explosion/:mpsId')
  @ResponseMessage('BOM Explosion & Stock Availability matrix calculated successfully')
  async getBOMExplosionMatrix(@Param('mpsId') mpsId: string) {
    return this.ppcService.getBOMExplosionMatrix(mpsId);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.PURCHASE)
  @Post('mrp/auto-pr/:mpsId')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Auto Purchase Requisitions triggered successfully')
  async triggerAutoPR(@Param('mpsId') mpsId: string) {
    return this.ppcService.triggerAutoPR(mpsId);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PURCHASE,
    Role.INVENTORY,
    Role.FINANCE,
  )
  @Get('requisitions')
  @ResponseMessage('Purchase requisitions retrieved successfully')
  async findAllRequisitions() {
    return this.ppcService.findAllRequisitions();
  }
}

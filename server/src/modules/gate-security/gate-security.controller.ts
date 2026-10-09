import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GateSecurityService } from './gate-security.service';
import {
  CreateInwardGatePassDto,
  CaptureOutwardTareDto,
  QueryGatePassDto,
} from './dto/gate-security.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller(['gate-security', 'api/gate-security'])
export class GateSecurityController {
  constructor(private readonly gateService: GateSecurityService) {}

  @Get('ocr-simulate')
  async simulateOcr() {
    return this.gateService.simulateCameraOCR();
  }

  @Get('yard-register')
  async getYardRegister() {
    return this.gateService.getYardRegister();
  }

  @Get('kpi')
  @Roles(Role.ADMIN, Role.OWNER, Role.GATE_SECURITY, Role.INVENTORY, Role.DISPATCH)
  async getKPI() {
    return this.gateService.getLogisticsKPI();
  }

  @Get('active-trucks')
  @Roles(Role.ADMIN, Role.OWNER, Role.GATE_SECURITY, Role.INVENTORY, Role.DISPATCH)
  async getActiveInsideTrucks() {
    return this.gateService.getActiveInsideTrucks();
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.GATE_SECURITY, Role.INVENTORY, Role.DISPATCH)
  async findAll(@Query() query: QueryGatePassDto) {
    return this.gateService.findAllPasses(query);
  }

  @Get('verify/:code')
  @Roles(Role.ADMIN, Role.OWNER, Role.GATE_SECURITY, Role.INVENTORY, Role.DISPATCH)
  async verifyByCode(@Param('code') code: string) {
    return this.gateService.verifyPass(code);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.GATE_SECURITY, Role.INVENTORY, Role.DISPATCH)
  async findOne(@Param('id') id: string) {
    return this.gateService.findOnePass(id);
  }

  @Post('inward')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.GATE_SECURITY)
  async createInward(@Body() dto: CreateInwardGatePassDto) {
    return this.gateService.createInwardPass(dto);
  }

  @Patch(':id/outward')
  @Roles(Role.ADMIN, Role.OWNER, Role.GATE_SECURITY)
  async captureOutward(
    @Param('id') id: string,
    @Body() dto: CaptureOutwardTareDto,
  ) {
    return this.gateService.captureOutwardTare(id, dto);
  }
}

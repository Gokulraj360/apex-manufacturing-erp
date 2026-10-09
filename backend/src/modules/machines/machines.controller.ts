import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/machine.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PRODUCTION_SUPERVISOR,
    Role.PPC,
    Role.QC_MANAGER,
  )
  @Get()
  @ResponseMessage('Machines catalog retrieved successfully')
  async findAll(@Query() pagination: PaginationDto) {
    return this.machinesService.findAll(pagination);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PRODUCTION_SUPERVISOR,
    Role.PPC,
  )
  @Get(':id')
  @ResponseMessage('Machine details retrieved successfully')
  async findOne(@Param('id') id: string) {
    return this.machinesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PRODUCTION_SUPERVISOR, Role.PPC)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Machine workstation registered successfully')
  async create(@Body() dto: CreateMachineDto) {
    return this.machinesService.create(dto);
  }
}

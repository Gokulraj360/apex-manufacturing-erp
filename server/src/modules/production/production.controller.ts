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
import { ProductionService } from './production.service';
import {
  IncrementOutputDto,
  LogScrapDto,
  LogMachineDowntimeDto,
  ResolveDowntimeDto,
  QueryJobCardDto,
} from './dto/production.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@Controller('production')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Get('kpis')
  @Roles(Role.ADMIN, Role.OWNER, Role.PRODUCTION_SUPERVISOR, Role.PPC, Role.QC_MANAGER)
  @ResponseMessage('Production floor KPIs retrieved successfully')
  async getFloorKPIs() {
    return this.productionService.getFloorKPIs();
  }

  @Get('job-cards')
  @Roles(Role.ADMIN, Role.OWNER, Role.PRODUCTION_SUPERVISOR, Role.PPC, Role.QC_MANAGER)
  @ResponseMessage('Job cards retrieved successfully')
  async findAllJobCards(@Query() query: QueryJobCardDto) {
    return this.productionService.findAllJobCards(query);
  }

  @Get('job-cards/:id')
  @Roles(Role.ADMIN, Role.OWNER, Role.PRODUCTION_SUPERVISOR, Role.PPC, Role.QC_MANAGER)
  @ResponseMessage('Job card details retrieved successfully')
  async findJobCardById(@Param('id') id: string) {
    return this.productionService.findJobCardById(id);
  }

  @Post('job-cards/:id/increment-output')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.OWNER, Role.PRODUCTION_SUPERVISOR)
  @ResponseMessage('Production output counter updated successfully')
  async incrementOutput(
    @Param('id') id: string,
    @Body() dto: IncrementOutputDto,
  ) {
    return this.productionService.incrementOutput(id, dto);
  }

  @Post('scrap')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.PRODUCTION_SUPERVISOR, Role.QC_MANAGER)
  @ResponseMessage('Production defect scrap recorded successfully')
  async logScrap(@Body() dto: LogScrapDto) {
    return this.productionService.logScrap(dto);
  }

  @Get('downtimes/active')
  @Roles(Role.ADMIN, Role.OWNER, Role.PRODUCTION_SUPERVISOR, Role.PPC)
  @ResponseMessage('Active machine stoppages retrieved successfully')
  async getActiveDowntimes() {
    return this.productionService.getActiveDowntimes();
  }

  @Post('downtimes')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.PRODUCTION_SUPERVISOR)
  @ResponseMessage('Machine breakdown logged and maintenance dispatch dispatched')
  async logMachineDowntime(@Body() dto: LogMachineDowntimeDto) {
    return this.productionService.logMachineDowntime(dto);
  }

  @Post('downtimes/:id/resolve')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.OWNER, Role.PRODUCTION_SUPERVISOR)
  @ResponseMessage('Machine downtime resolved successfully')
  async resolveDowntime(
    @Param('id') id: string,
    @Body() dto: ResolveDowntimeDto,
  ) {
    return this.productionService.resolveDowntime(id, dto);
  }
}

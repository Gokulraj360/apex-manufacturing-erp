import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MachineDowntimeService } from '../services/machine-downtime.service';
import {
  RecordMachineTelemetryDto,
  ReportBreakdownDto,
  UpdateMaintenanceStatusDto,
} from '../dto/machine-downtime.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/production/machines')
@UseGuards(RBACGuard)
export class MachineDowntimeController {
  constructor(private readonly machineService: MachineDowntimeService) {}

  @Get('fleet')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getMachineFleet() {
    return this.machineService.getMachineFleet();
  }

  @Post('telemetry')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async recordTelemetry(@Body() dto: RecordMachineTelemetryDto) {
    return this.machineService.recordTelemetry(dto);
  }

  @Post('report-breakdown')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async reportBreakdown(@Body() dto: ReportBreakdownDto, @Req() req: any) {
    const operatorUserId = req.user?.id;
    return this.machineService.reportBreakdown(dto, operatorUserId);
  }

  @Get('maintenance-tickets')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getMaintenanceTickets() {
    return this.machineService.getMaintenanceTickets();
  }

  @Put('maintenance-tickets')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateMaintenanceStatus(
    @Body() dto: UpdateMaintenanceStatusDto,
    @Req() req: any,
  ) {
    const techUserId = req.user?.id;
    return this.machineService.updateMaintenanceStatus(dto, techUserId);
  }
}

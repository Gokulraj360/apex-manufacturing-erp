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
import { PreventiveMaintenanceService } from '../services/preventive-maintenance.service';
import {
  CreateMaintenanceScheduleDto,
  UpdateMaintenanceScheduleDto,
  CompleteMaintenanceScheduleDto,
} from '../dto/preventive-maintenance.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { MaintenanceScheduleStatus, MaintenanceInterval } from '@prisma/client';

@Controller('api/v1/asset-reliability/preventive-schedules')
@UseGuards(RBACGuard)
export class PreventiveMaintenanceController {
  constructor(private readonly pmService: PreventiveMaintenanceService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getMaintenanceSchedules(
    @Query('assetId') assetId?: string,
    @Query('status') status?: MaintenanceScheduleStatus,
    @Query('scheduleType') scheduleType?: any,
    @Query('interval') interval?: MaintenanceInterval,
    @Query('isOverdue') isOverdue?: string,
  ) {
    const overdueBool = isOverdue === 'true';
    return this.pmService.getMaintenanceSchedules({
      assetId,
      status,
      scheduleType,
      interval,
      isOverdue: overdueBool,
    });
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createMaintenanceSchedule(
    @Body() dto: CreateMaintenanceScheduleDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.pmService.createMaintenanceSchedule(dto, userId);
  }

  @Put(':id')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateMaintenanceSchedule(
    @Param('id') id: string,
    @Body() dto: UpdateMaintenanceScheduleDto,
  ) {
    return this.pmService.updateMaintenanceSchedule(id, dto);
  }

  @Post('complete')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async completeMaintenanceSchedule(
    @Body() dto: CompleteMaintenanceScheduleDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.pmService.completeMaintenanceSchedule(dto, userId);
  }
}

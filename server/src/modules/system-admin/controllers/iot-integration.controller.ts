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
import { IoTIntegrationService } from '../services/iot-integration.service';
import {
  RegisterHardwareDto,
  UpdateHardwareDto,
  LogDeviceHeartbeatDto,
  SendHardwareCommandDto,
} from '../dto/iot-integration.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { HardwareDeviceStatus, HardwareDeviceType } from '@prisma/client';

@Controller('api/v1/system-admin/hardware')
@UseGuards(RBACGuard)
export class IoTIntegrationController {
  constructor(private readonly iotService: IoTIntegrationService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getDevices(
    @Query('deviceType') deviceType?: HardwareDeviceType,
    @Query('status') status?: HardwareDeviceStatus,
    @Query('location') location?: string,
  ) {
    return this.iotService.getHardwareDevices({ deviceType, status, location });
  }

  @Get('metrics')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getMetrics() {
    return this.iotService.getHardwareMetrics();
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getDeviceById(@Param('id') id: string) {
    return this.iotService.getHardwareDeviceById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async registerHardware(@Body() dto: RegisterHardwareDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.iotService.registerHardware(dto, adminUserId);
  }

  @Put(':id')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async updateHardware(
    @Param('id') id: string,
    @Body() dto: UpdateHardwareDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.iotService.updateHardware(id, dto, adminUserId);
  }

  @Post('heartbeat')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async logHeartbeat(@Body() dto: LogDeviceHeartbeatDto) {
    return this.iotService.logHeartbeat(dto);
  }

  @Post('command')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async sendCommand(@Body() dto: SendHardwareCommandDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.iotService.sendHardwareCommand(dto, adminUserId);
  }
}

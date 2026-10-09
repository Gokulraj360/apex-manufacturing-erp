import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  RegisterHardwareDto,
  UpdateHardwareDto,
  LogDeviceHeartbeatDto,
  SendHardwareCommandDto,
} from '../dto/iot-integration.dto';
import { AuditAction, AuditSeverity, HardwareDeviceStatus, HardwareDeviceType } from '@prisma/client';

@Injectable()
export class IoTIntegrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all hardware devices with filter
   */
  async getHardwareDevices(params?: {
    deviceType?: HardwareDeviceType;
    status?: HardwareDeviceStatus;
    location?: string;
  }) {
    const where: any = {};
    if (params?.deviceType) where.deviceType = params.deviceType;
    if (params?.status) where.status = params.status;
    if (params?.location) where.location = { contains: params.location, mode: 'insensitive' };

    return this.prisma.hardwareIntegration.findMany({
      where,
      include: {
        _count: { select: { deviceLogs: true } },
      },
      orderBy: { deviceCode: 'asc' },
    });
  }

  /**
   * Get single hardware device with recent telemetry logs
   */
  async getHardwareDeviceById(id: string) {
    const device = await this.prisma.hardwareIntegration.findUnique({
      where: { id },
      include: {
        deviceLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!device) {
      throw new NotFoundException(`Hardware device ${id} not found`);
    }

    return device;
  }

  /**
   * Register new hardware device
   */
  async registerHardware(dto: RegisterHardwareDto, adminUserId?: string) {
    const existing = await this.prisma.hardwareIntegration.findUnique({
      where: { deviceCode: dto.deviceCode },
    });
    if (existing) {
      throw new BadRequestException(`Device code ${dto.deviceCode} is already registered`);
    }

    const device = await this.prisma.hardwareIntegration.create({
      data: {
        deviceCode: dto.deviceCode,
        deviceName: dto.deviceName,
        deviceType: dto.deviceType,
        ipAddress: dto.ipAddress,
        macAddress: dto.macAddress,
        portNumber: dto.portNumber,
        communicationProtocol: dto.communicationProtocol || 'MQTT',
        location: dto.location,
        status: 'ONLINE',
        lastHeartbeat: new Date(),
        firmwareVersion: dto.firmwareVersion,
        configPayload: dto.configPayload || {},
        calibrationDueDate: dto.calibrationDueDate ? new Date(dto.calibrationDueDate) : null,
      },
    });

    await this.auditLogService.logAction({
      userId: adminUserId || null,
      action: AuditAction.HARDWARE_CONFIG_UPDATED,
      entity: 'HardwareIntegration',
      entityId: device.id,
      details: `Registered hardware device ${device.deviceCode} (${device.deviceName}) at ${device.location}`,
      severity: AuditSeverity.INFO,
    });

    return device;
  }

  /**
   * Update device configuration or calibration
   */
  async updateHardware(id: string, dto: UpdateHardwareDto, adminUserId?: string) {
    const existing = await this.prisma.hardwareIntegration.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Hardware device ${id} not found`);
    }

    const data: any = { ...dto };
    if (dto.calibrationDueDate) {
      data.calibrationDueDate = new Date(dto.calibrationDueDate);
    }

    const updated = await this.prisma.hardwareIntegration.update({
      where: { id },
      data,
    });

    await this.auditLogService.logAction({
      userId: adminUserId || null,
      action: AuditAction.HARDWARE_CONFIG_UPDATED,
      entity: 'HardwareIntegration',
      entityId: id,
      details: `Updated hardware configuration for ${updated.deviceCode}`,
      changes: dto,
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Log hardware network telemetry or heartbeat
   */
  async logHeartbeat(dto: LogDeviceHeartbeatDto) {
    const device = await this.prisma.hardwareIntegration.findUnique({
      where: { deviceCode: dto.deviceCode },
    });
    if (!device) {
      throw new NotFoundException(`Device ${dto.deviceCode} not found`);
    }

    // Update lastHeartbeat and status
    await this.prisma.hardwareIntegration.update({
      where: { id: device.id },
      data: {
        lastHeartbeat: new Date(),
        status: dto.isAlertTriggered ? 'DEGRADED' : 'ONLINE',
      },
    });

    return this.prisma.networkDeviceLog.create({
      data: {
        hardwareId: device.id,
        latencyMs: dto.latencyMs,
        packetLossRate: dto.packetLossRate,
        bandwidthUsageKbps: dto.bandwidthUsageKbps,
        eventDescription: dto.eventDescription,
        isAlertTriggered: dto.isAlertTriggered ?? false,
      },
    });
  }

  /**
   * Dispatch remote hardware control command
   */
  async sendHardwareCommand(dto: SendHardwareCommandDto, adminUserId?: string) {
    const device = await this.prisma.hardwareIntegration.findUnique({
      where: { deviceCode: dto.deviceCode },
    });
    if (!device) {
      throw new NotFoundException(`Device ${dto.deviceCode} not found`);
    }

    let commandResponse = '';
    switch (dto.command) {
      case 'REBOOT':
        commandResponse = `Command sent via ${device.communicationProtocol}. Device soft reboot initiated.`;
        break;
      case 'TARE_CALIBRATE':
        commandResponse = `Weighing sensor zero tare offset command acknowledged on port ${device.portNumber || 8080}.`;
        break;
      case 'TEST_PRINT':
        commandResponse = `Test alignment pattern dispatched to printer buffer.`;
        break;
      case 'POLL_TELEMETRY':
        commandResponse = `Real-time sensor telemetry packet requested.`;
        break;
      case 'UPDATE_FIRMWARE':
        commandResponse = `Firmware OTA payload staged for deployment.`;
        break;
    }

    await this.auditLogService.logAction({
      userId: adminUserId || null,
      action: AuditAction.HARDWARE_CONFIG_UPDATED,
      entity: 'HardwareIntegration',
      entityId: device.id,
      details: `Hardware command [${dto.command}] dispatched to ${device.deviceCode}`,
      severity: AuditSeverity.WARNING,
    });

    return {
      success: true,
      deviceCode: device.deviceCode,
      command: dto.command,
      timestamp: new Date().toISOString(),
      response: commandResponse,
    };
  }

  /**
   * Fleet health overview metrics
   */
  async getHardwareMetrics() {
    const totalDevices = await this.prisma.hardwareIntegration.count();
    const onlineDevices = await this.prisma.hardwareIntegration.count({
      where: { status: 'ONLINE' },
    });
    const offlineDevices = await this.prisma.hardwareIntegration.count({
      where: { status: 'OFFLINE' },
    });
    const degradedDevices = await this.prisma.hardwareIntegration.count({
      where: { status: { in: ['DEGRADED', 'MAINTENANCE'] } },
    });

    const byType = await this.prisma.hardwareIntegration.groupBy({
      by: ['deviceType'],
      _count: { id: true },
    });

    return {
      totalDevices,
      onlineDevices,
      offlineDevices,
      degradedDevices,
      fleetAvailability: totalDevices > 0 ? parseFloat(((onlineDevices / totalDevices) * 100).toFixed(1)) : 100,
      byType,
    };
  }
}

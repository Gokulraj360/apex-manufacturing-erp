import { HardwareDeviceStatus, HardwareDeviceType } from '@prisma/client';

export class RegisterHardwareDto {
  deviceCode!: string;
  deviceName!: string;
  deviceType!: HardwareDeviceType;
  ipAddress?: string;
  macAddress?: string;
  portNumber?: number;
  communicationProtocol?: string;
  location!: string;
  firmwareVersion?: string;
  calibrationDueDate?: string;
  configPayload?: Record<string, any>;
}

export class UpdateHardwareDto {
  deviceName?: string;
  deviceType?: HardwareDeviceType;
  ipAddress?: string;
  macAddress?: string;
  portNumber?: number;
  communicationProtocol?: string;
  location?: string;
  status?: HardwareDeviceStatus;
  firmwareVersion?: string;
  calibrationDueDate?: string;
  configPayload?: Record<string, any>;
}

export class LogDeviceHeartbeatDto {
  deviceCode!: string;
  latencyMs?: number;
  packetLossRate?: number;
  bandwidthUsageKbps?: number;
  eventDescription!: string;
  isAlertTriggered?: boolean;
}

export class SendHardwareCommandDto {
  deviceCode!: string;
  command!: 'REBOOT' | 'TARE_CALIBRATE' | 'TEST_PRINT' | 'POLL_TELEMETRY' | 'UPDATE_FIRMWARE';
  parameters?: Record<string, any>;
}

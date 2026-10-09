export type HardwareDeviceType =
  | 'BARCODE_SCANNER'
  | 'WEIGHING_SCALE'
  | 'IOT_SENSOR'
  | 'LABEL_PRINTER'
  | 'TOUCH_TERMINAL'
  | 'PLC_CONTROLLER'
  | 'NETWORK_GATEWAY';

export type HardwareDeviceStatus =
  | 'ONLINE'
  | 'OFFLINE'
  | 'DEGRADED'
  | 'MAINTENANCE'
  | 'CALIBRATION_DUE';

export type BackupType =
  | 'FULL_DATABASE'
  | 'INCREMENTAL'
  | 'SCHEMA_ONLY'
  | 'TRANSACTION_LOGS'
  | 'DISASTER_RECOVERY_SNAPSHOT';

export type BackupStatus =
  | 'SUCCESSFUL'
  | 'IN_PROGRESS'
  | 'FAILED'
  | 'VERIFIED'
  | 'RESTORING';

export type SecurityIncidentSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type SupportTicketPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type SupportTicketStatus =
  | 'OPEN'
  | 'IN_INVESTIGATION'
  | 'RESOLVED'
  | 'CLOSED';

export interface UserAccountItem {
  id: string;
  userId: string;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  failedLoginAttempts: number;
  isLocked: boolean;
  lockedUntil?: string;
  forcePasswordChange: boolean;
  passwordLastChangedAt?: string;
  allowedIpRanges?: string;
  sessionTimeoutMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemUserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roleId: string;
  role?: {
    id: string;
    name: string;
    description?: string;
    hierarchyLevel: number;
  };
  userAccount?: UserAccountItem;
  employeeProfile?: {
    employeeCode: string;
    department?: { name: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface SystemRolePermissionItem {
  id: string;
  roleName: string;
  resource: string;
  action: string;
  isAllowed: boolean;
  scope: string;
  grantedBy?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HardwareIntegrationItem {
  id: string;
  deviceCode: string;
  deviceName: string;
  deviceType: HardwareDeviceType;
  ipAddress?: string;
  macAddress?: string;
  portNumber?: number;
  communicationProtocol: string;
  location: string;
  status: HardwareDeviceStatus;
  lastHeartbeat?: string;
  firmwareVersion?: string;
  calibrationDueDate?: string;
  configPayload?: Record<string, any>;
  _count?: {
    deviceLogs?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NetworkDeviceLogItem {
  id: string;
  hardwareId: string;
  latencyMs?: number;
  packetLossRate?: number;
  bandwidthUsageKbps?: number;
  eventDescription: string;
  isAlertTriggered: boolean;
  createdAt: string;
}

export interface BackupLogItem {
  id: string;
  backupId: string;
  backupType: BackupType;
  storageDestination: string;
  fileSizeBytes: number;
  fileSizeMb?: string;
  durationSeconds: number;
  checksumSha256?: string;
  status: BackupStatus;
  initiatedBy: string;
  restorationVerifiedAt?: string;
  createdAt: string;
}

export interface SecurityAuditLogItem {
  id: string;
  eventType: string;
  sourceIp: string;
  userAgent?: string;
  severity: SecurityIncidentSeverity;
  details: string;
  isResolved: boolean;
  resolvedBy?: string;
  mitigationActionTaken?: string;
  createdAt: string;
}

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  reportedByName: string;
  assignedToEngineer?: string;
  affectedLocation?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InfrastructureHealthMetrics {
  uptimePercentage: number;
  cpuUtilization: number;
  ramUsagePercent: number;
  activeDatabaseConnections: number;
  activeSensorsCount: number;
  networkLatencyMs: number;
}

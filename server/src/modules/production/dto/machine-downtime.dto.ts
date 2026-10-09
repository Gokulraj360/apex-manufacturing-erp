import { MaintenancePriority, MaintenanceStatus } from '@prisma/client';

export interface RecordMachineTelemetryDto {
  machineCode: string;
  operatingHoursDelta?: number;
  cyclesDelta?: number;
  temperatureCelsius?: number;
  vibrationMmSec?: number;
  isOnline?: boolean;
}

export interface ReportBreakdownDto {
  machineCode: string;
  issueDescription: string;
  priority?: MaintenancePriority;
}

export interface UpdateMaintenanceStatusDto {
  ticketNumber: string;
  status: MaintenanceStatus;
  assignedTechnician?: string;
  rootCauseAnalysis?: string;
  preventativeAction?: string;
}

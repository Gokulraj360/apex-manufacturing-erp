import {
  MaintenanceScheduleType,
  MaintenanceInterval,
  MaintenanceScheduleStatus,
} from '@prisma/client';

export class CreateMaintenanceScheduleDto {
  scheduleCode: string;
  assetId: string;
  title: string;
  scheduleType: MaintenanceScheduleType;
  interval: MaintenanceInterval;
  intervalHours?: number;
  nextDueDate: string | Date;
  estimatedDurationHours?: number;
  assignedTechnician?: string;
  checklistItems?: Array<{ step: string; required: boolean }>;
  notes?: string;
}

export class UpdateMaintenanceScheduleDto {
  title?: string;
  scheduleType?: MaintenanceScheduleType;
  interval?: MaintenanceInterval;
  intervalHours?: number;
  status?: MaintenanceScheduleStatus;
  nextDueDate?: string | Date;
  lastPerformedAt?: string | Date;
  estimatedDurationHours?: number;
  assignedTechnician?: string;
  checklistItems?: Array<any>;
  notes?: string;
}

export class CompleteMaintenanceScheduleDto {
  scheduleId: string;
  performedBy: string;
  actualDurationHours?: number;
  checklistCompleted?: Array<{ step: string; verified: boolean; notes?: string }>;
  notes?: string;
  sparePartsUsed?: Array<{ sparePartId: string; quantity: number }>;
}

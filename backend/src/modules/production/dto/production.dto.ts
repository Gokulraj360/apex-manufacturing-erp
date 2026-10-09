import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum JobCardStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ScrapRootCause {
  TOOL_WEAR = 'TOOL_WEAR',
  MATERIAL_FLAW = 'MATERIAL_FLAW',
  OPERATOR_ERROR = 'OPERATOR_ERROR',
  CALIBRATION_DRIFT = 'CALIBRATION_DRIFT',
  POWER_FLUCTUATION = 'POWER_FLUCTUATION',
  THERMAL_DISTORTION = 'THERMAL_DISTORTION',
  OTHER = 'OTHER',
}

export enum DowntimeReason {
  MECHANICAL_BREAKDOWN = 'MECHANICAL_BREAKDOWN',
  ELECTRICAL_FAULT = 'ELECTRICAL_FAULT',
  TOOL_JAM_BREAKAGE = 'TOOL_JAM_BREAKAGE',
  HYDRAULIC_FAILURE = 'HYDRAULIC_FAILURE',
  SENSOR_FAILURE = 'SENSOR_FAILURE',
  PLANNED_CHANGEOVER = 'PLANNED_CHANGEOVER',
  RAW_MATERIAL_WAIT = 'RAW_MATERIAL_WAIT',
  OTHER = 'OTHER',
}

export enum MaintenancePriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum MaintenanceStatus {
  DISPATCHED = 'DISPATCHED',
  TECHNICIAN_ACKNOWLEDGED = 'TECHNICIAN_ACKNOWLEDGED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

// ----------------------------------------------------------------------------
// Output Increment DTO
// ----------------------------------------------------------------------------

export class IncrementOutputDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  incrementQty: number = 1;

  @IsOptional()
  @IsString()
  operationId?: string;

  @IsOptional()
  @IsString()
  operatorNotes?: string;
}

// ----------------------------------------------------------------------------
// Scrap Logging DTO
// ----------------------------------------------------------------------------

export class LogScrapDto {
  @IsNotEmpty()
  @IsString()
  jobCardId: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  defectQty: number;

  @IsEnum(ScrapRootCause)
  rootCause: ScrapRootCause;

  @IsOptional()
  @IsNumber()
  operationSequence?: number;

  @IsOptional()
  @IsString()
  defectDetails?: string;

  @IsOptional()
  @IsString()
  loggedBy?: string;
}

// ----------------------------------------------------------------------------
// Machine Downtime DTO
// ----------------------------------------------------------------------------

export class LogMachineDowntimeDto {
  @IsNotEmpty()
  @IsString()
  machineCode: string;

  @IsOptional()
  @IsString()
  machineName?: string;

  @IsNotEmpty()
  @IsString()
  productionLine: string;

  @IsEnum(DowntimeReason)
  reason: DowntimeReason;

  @IsOptional()
  @IsString()
  rootCauseDetails?: string;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  endedAt?: string;

  @IsOptional()
  @IsBoolean()
  triggerMaintenanceDispatch?: boolean = true;

  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority = MaintenancePriority.CRITICAL;

  @IsOptional()
  @IsString()
  assignedTechnician?: string;

  @IsOptional()
  @IsString()
  loggedBy?: string;
}

export class ResolveDowntimeDto {
  @IsOptional()
  @IsDateString()
  endedAt?: string;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}

// ----------------------------------------------------------------------------
// Query DTO
// ----------------------------------------------------------------------------

export class QueryJobCardDto {
  @IsOptional()
  @IsEnum(JobCardStatus)
  status?: JobCardStatus;

  @IsOptional()
  @IsString()
  productionLine?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
} from 'class-validator';

export enum DeptPayrollHandoffStatusEnum {
  PENDING_AUDIT = 'PENDING_AUDIT',
  VERIFIED = 'VERIFIED',
  EXPORTED_TO_PAYROLL = 'EXPORTED_TO_PAYROLL',
  RECONCILED = 'RECONCILED',
}

export class GenerateLaborMetricDto {
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @IsDateString()
  @IsNotEmpty()
  metricDate: string;

  @IsString()
  @IsOptional()
  shiftCode?: string;

  @IsNumber()
  @Min(0)
  totalScheduledWorkers: number;

  @IsNumber()
  @Min(0)
  totalPresentWorkers: number;

  @IsNumber()
  @Min(0)
  totalTargetOutput: number;

  @IsNumber()
  @Min(0)
  totalActualOutput: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalOvertimeHours?: number;

  @IsString()
  @IsOptional()
  auditedBy?: string;
}

export class AuditPayrollHandoffDto {
  @IsEnum(DeptPayrollHandoffStatusEnum)
  @IsNotEmpty()
  payrollStatus: DeptPayrollHandoffStatusEnum;

  @IsString()
  @IsNotEmpty()
  auditedBy: string;

  @IsString()
  @IsOptional()
  auditNotes?: string;
}

export class QueryLaborAnalyticsDto {
  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  payrollStatus?: string;
}

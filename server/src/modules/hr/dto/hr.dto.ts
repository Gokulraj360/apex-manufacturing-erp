import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';

export enum ShiftTypeEnum {
  SHIFT_A_MORNING = 'SHIFT_A_MORNING',
  SHIFT_B_EVENING = 'SHIFT_B_EVENING',
  SHIFT_C_NIGHT = 'SHIFT_C_NIGHT',
  GENERAL_SHIFT = 'GENERAL_SHIFT',
}

export enum AttendanceStatusEnum {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  OVERTIME_ONLY = 'OVERTIME_ONLY',
  ABSENT = 'ABSENT',
  ON_LEAVE = 'ON_LEAVE',
}

export class ClockInOutDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsEnum(ShiftTypeEnum)
  @IsOptional()
  shiftType?: ShiftTypeEnum;

  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @IsString()
  @IsOptional()
  biometricDeviceId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class QueryAttendanceDto {
  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  shiftType?: string;

  @IsString()
  @IsOptional()
  department?: string;
}

export class ApprovePayrollDto {
  @IsString()
  @IsNotEmpty()
  monthYear: string; // e.g. "2026-10"

  @IsString()
  @IsNotEmpty()
  approvedBy: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

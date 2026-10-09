import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';

export enum DeptAttendanceStatusEnum {
  PRESENT = 'PRESENT',
  LATE_ARRIVAL = 'LATE_ARRIVAL',
  HALF_DAY = 'HALF_DAY',
  ON_LEAVE = 'ON_LEAVE',
  ABSENT = 'ABSENT',
  ON_DUTY = 'ON_DUTY',
}

export enum DeptLeaveTypeEnum {
  CASUAL = 'CASUAL',
  SICK = 'SICK',
  EARNED = 'EARNED',
  COMPENSATORY_OFF = 'COMPENSATORY_OFF',
  UNPAID_LEAVE = 'UNPAID_LEAVE',
  NONE = 'NONE',
}

export class LogDepartmentAttendanceDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @IsDateString()
  @IsNotEmpty()
  attendanceDate: string;

  @IsDateString()
  @IsOptional()
  checkInTime?: string;

  @IsDateString()
  @IsOptional()
  checkOutTime?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  plannedHours?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  actualHours?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  overtimeHours?: number;

  @IsEnum(DeptAttendanceStatusEnum)
  @IsOptional()
  status?: DeptAttendanceStatusEnum;

  @IsBoolean()
  @IsOptional()
  biometricVerification?: boolean;

  @IsString()
  @IsOptional()
  supervisorNotes?: string;

  @IsString()
  @IsOptional()
  loggedBy?: string;
}

export class ApproveOvertimeDto {
  @IsNumber()
  @Min(0.5)
  approvedHours: number;

  @IsString()
  @IsNotEmpty()
  overtimeReason: string;

  @IsString()
  @IsNotEmpty()
  approvedBy: string;
}

export class ApproveDeptLeaveDto {
  @IsEnum(DeptLeaveTypeEnum)
  @IsNotEmpty()
  leaveType: DeptLeaveTypeEnum;

  @IsString()
  @IsNotEmpty()
  leaveApprovedBy: string;

  @IsString()
  @IsOptional()
  approvalRemarks?: string;
}

export class QueryAttendanceDto {
  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  overtimeOnly?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

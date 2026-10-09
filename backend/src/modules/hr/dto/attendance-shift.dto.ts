import { AttendanceStatus, LeaveStatus, LeaveType } from '@prisma/client';

export class ClockInOutDto {
  employeeId!: string;
  type!: 'CLOCK_IN' | 'CLOCK_OUT';
  timestamp?: string; // ISO string, defaults to now
  biometricDeviceId?: string;
  locationCoordinates?: string;
}

export class RegularizeAttendanceDto {
  attendanceId!: string;
  clockIn?: string;
  clockOut?: string;
  status!: AttendanceStatus;
  regularizationNotes!: string;
}

export class AssignShiftRosterDto {
  employeeId!: string;
  shiftName!: string;
  shiftCode!: string;
  startTime!: string; // e.g. '06:00'
  endTime!: string; // e.g. '14:30'
  effectiveStartDate!: string; // ISO date string
  effectiveEndDate?: string;
  weekOffDay?: string;
  isRotational?: boolean;
  notes?: string;
}

export class ApplyLeaveDto {
  employeeId!: string;
  leaveType!: LeaveType;
  startDate!: string;
  endDate!: string;
  totalDays!: number;
  reason!: string;
}

export class ReviewLeaveDto {
  leaveId!: string;
  status!: LeaveStatus;
  reviewerRemarks?: string;
}

export class LogOvertimeDto {
  employeeId!: string;
  date!: string;
  overtimeHours!: number;
  reason!: string;
}

export class ApproveOvertimeDto {
  overtimeRecordId!: string;
  isApproved!: boolean;
  remarks?: string;
}

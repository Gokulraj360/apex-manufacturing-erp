import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  ClockInOutDto,
  RegularizeAttendanceDto,
  AssignShiftRosterDto,
  ApplyLeaveDto,
  ReviewLeaveDto,
  LogOvertimeDto,
  ApproveOvertimeDto,
} from '../dto/attendance-shift.dto';
import { AttendanceStatus, AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class AttendanceShiftService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Record biometric or app clock-in/out
   */
  async recordClockInOut(dto: ClockInOutDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee ${dto.employeeId} not found`);
    }

    const timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();
    // Normalize date to start of day UTC
    const dateOnly = new Date(timestamp.toISOString().split('T')[0]);

    let attendance = await this.prisma.attendanceLog.findUnique({
      where: {
        employeeId_date: {
          employeeId: dto.employeeId,
          date: dateOnly,
        },
      },
    });

    if (dto.type === 'CLOCK_IN') {
      if (attendance) {
        // Update clockIn if not already set
        attendance = await this.prisma.attendanceLog.update({
          where: { id: attendance.id },
          data: {
            clockIn: timestamp,
            status: 'PRESENT',
            biometricDeviceId: dto.biometricDeviceId || attendance.biometricDeviceId,
            locationCoordinates: dto.locationCoordinates || attendance.locationCoordinates,
          },
        });
      } else {
        attendance = await this.prisma.attendanceLog.create({
          data: {
            employeeId: dto.employeeId,
            date: dateOnly,
            clockIn: timestamp,
            status: 'PRESENT',
            biometricDeviceId: dto.biometricDeviceId,
            locationCoordinates: dto.locationCoordinates,
          },
        });
      }
    } else {
      // CLOCK_OUT
      if (!attendance) {
        attendance = await this.prisma.attendanceLog.create({
          data: {
            employeeId: dto.employeeId,
            date: dateOnly,
            clockOut: timestamp,
            status: 'PRESENT',
            biometricDeviceId: dto.biometricDeviceId,
            locationCoordinates: dto.locationCoordinates,
          },
        });
      } else {
        let totalHours: number | undefined;
        if (attendance.clockIn) {
          const diffMs = timestamp.getTime() - attendance.clockIn.getTime();
          totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
        }

        attendance = await this.prisma.attendanceLog.update({
          where: { id: attendance.id },
          data: {
            clockOut: timestamp,
            totalHours: totalHours !== undefined ? totalHours : attendance.totalHours,
          },
        });
      }
    }

    await this.auditLogService.logAction({
      userId: employee.userId || null,
      action: AuditAction.ATTENDANCE_LOGGED,
      entity: 'AttendanceLog',
      entityId: attendance.id,
      details: `${dto.type} recorded for employee ${employee.employeeCode} at ${timestamp.toISOString()}`,
      severity: AuditSeverity.INFO,
    });

    return attendance;
  }

  /**
   * Get attendance logs with date filtering
   */
  async getAttendanceLogs(params: {
    startDate?: string;
    endDate?: string;
    departmentId?: string;
    employeeId?: string;
    status?: AttendanceStatus;
  }) {
    const where: any = {};

    if (params.startDate || params.endDate) {
      where.date = {};
      if (params.startDate) where.date.gte = new Date(params.startDate);
      if (params.endDate) where.date.lte = new Date(params.endDate);
    }
    if (params.employeeId) {
      where.employeeId = params.employeeId;
    }
    if (params.status) {
      where.status = params.status;
    }
    if (params.departmentId) {
      where.employee = { departmentId: params.departmentId };
    }

    return this.prisma.attendanceLog.findMany({
      where,
      include: {
        employee: {
          include: {
            department: true,
            designation: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Regularize attendance
   */
  async regularizeAttendance(dto: RegularizeAttendanceDto, supervisorId?: string) {
    const log = await this.prisma.attendanceLog.findUnique({
      where: { id: dto.attendanceId },
      include: { employee: true },
    });
    if (!log) {
      throw new NotFoundException(`Attendance record ${dto.attendanceId} not found`);
    }

    const data: any = {
      status: dto.status,
      isRegularized: true,
      regularizationNotes: dto.regularizationNotes,
    };

    if (dto.clockIn) data.clockIn = new Date(dto.clockIn);
    if (dto.clockOut) data.clockOut = new Date(dto.clockOut);

    if (data.clockIn && data.clockOut) {
      const diffMs = data.clockOut.getTime() - data.clockIn.getTime();
      data.totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    }

    return this.prisma.attendanceLog.update({
      where: { id: dto.attendanceId },
      data,
      include: {
        employee: true,
      },
    });
  }

  /**
   * Assign or rotate shift roster
   */
  async assignShiftRoster(dto: AssignShiftRosterDto) {
    return this.prisma.shiftRoster.create({
      data: {
        employeeId: dto.employeeId,
        shiftName: dto.shiftName,
        shiftCode: dto.shiftCode,
        startTime: dto.startTime,
        endTime: dto.endTime,
        effectiveStartDate: new Date(dto.effectiveStartDate),
        effectiveEndDate: dto.effectiveEndDate ? new Date(dto.effectiveEndDate) : null,
        weekOffDay: dto.weekOffDay || 'SUNDAY',
        isRotational: dto.isRotational ?? true,
        notes: dto.notes,
      },
      include: {
        employee: {
          include: { department: true },
        },
      },
    });
  }

  /**
   * List shift rosters
   */
  async getShiftRosters(departmentId?: string) {
    const where: any = {};
    if (departmentId) {
      where.employee = { departmentId };
    }

    return this.prisma.shiftRoster.findMany({
      where,
      include: {
        employee: {
          include: { department: true, designation: true },
        },
      },
      orderBy: { effectiveStartDate: 'desc' },
    });
  }

  /**
   * Apply for leave
   */
  async applyLeave(dto: ApplyLeaveDto) {
    return this.prisma.leaveRequest.create({
      data: {
        employeeId: dto.employeeId,
        leaveType: dto.leaveType,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        totalDays: dto.totalDays,
        reason: dto.reason,
        status: 'PENDING',
      },
      include: {
        employee: {
          include: { department: true },
        },
      },
    });
  }

  /**
   * Supervisor review leave request
   */
  async reviewLeave(dto: ReviewLeaveDto, reviewerId?: string) {
    const leave = await this.prisma.leaveRequest.findUnique({
      where: { id: dto.leaveId },
      include: { employee: true },
    });
    if (!leave) {
      throw new NotFoundException(`Leave request ${dto.leaveId} not found`);
    }

    const updated = await this.prisma.leaveRequest.update({
      where: { id: dto.leaveId },
      data: {
        status: dto.status,
        reviewedBy: reviewerId || 'HR Supervisor',
        reviewedAt: new Date(),
        reviewerRemarks: dto.reviewerRemarks,
      },
      include: {
        employee: true,
      },
    });

    await this.auditLogService.logAction({
      userId: reviewerId || null,
      action: AuditAction.LEAVE_STATUS_CHANGED,
      entity: 'LeaveRequest',
      entityId: dto.leaveId,
      details: `Leave request for ${leave.employee.employeeCode} changed to ${dto.status}`,
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * List leave requests
   */
  async getLeaveRequests(status?: string, departmentId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (departmentId) where.employee = { departmentId };

    return this.prisma.leaveRequest.findMany({
      where,
      include: {
        employee: {
          include: { department: true, designation: true },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  /**
   * Log overtime hours
   */
  async logOvertime(dto: LogOvertimeDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee ${dto.employeeId} not found`);
    }

    const hourlyRate = Number(employee.hourlyOvertimeRate) || 0;
    const calculatedAmount = hourlyRate * dto.overtimeHours;
    const logDate = new Date(dto.date);

    return this.prisma.overtimeRecord.create({
      data: {
        employeeId: dto.employeeId,
        date: logDate,
        overtimeHours: dto.overtimeHours,
        hourlyRate: hourlyRate,
        calculatedAmount: calculatedAmount,
        reason: dto.reason,
        isApproved: false,
        payrollMonth: logDate.getMonth() + 1,
        payrollYear: logDate.getFullYear(),
      },
      include: {
        employee: {
          include: { department: true },
        },
      },
    });
  }

  /**
   * Approve/reject single overtime record
   */
  async approveOvertime(dto: ApproveOvertimeDto, supervisorId?: string) {
    const record = await this.prisma.overtimeRecord.findUnique({
      where: { id: dto.overtimeRecordId },
      include: { employee: true },
    });
    if (!record) {
      throw new NotFoundException(`Overtime record ${dto.overtimeRecordId} not found`);
    }

    const updated = await this.prisma.overtimeRecord.update({
      where: { id: dto.overtimeRecordId },
      data: {
        isApproved: dto.isApproved,
        approvedBySupervisor: supervisorId || 'Shop Floor Supervisor',
      },
      include: {
        employee: true,
      },
    });

    await this.auditLogService.logAction({
      userId: supervisorId || null,
      action: AuditAction.OVERTIME_APPROVED,
      entity: 'OvertimeRecord',
      entityId: dto.overtimeRecordId,
      details: `Overtime record (${record.overtimeHours} hrs) for ${record.employee.employeeCode} approved: ${dto.isApproved}`,
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * List overtime records
   */
  async getOvertimeRecords(month?: number, year?: number, isApproved?: boolean) {
    const where: any = {};
    if (month) where.payrollMonth = month;
    if (year) where.payrollYear = year;
    if (isApproved !== undefined) where.isApproved = isApproved;

    return this.prisma.overtimeRecord.findMany({
      where,
      include: {
        employee: {
          include: { department: true, designation: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }
}

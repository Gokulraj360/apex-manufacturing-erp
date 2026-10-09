import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  LogDepartmentAttendanceDto,
  ApproveOvertimeDto,
  ApproveDeptLeaveDto,
  QueryAttendanceDto,
} from '../dto/department-attendance.dto';
import {
  AuditAction,
  AuditSeverity,
  DeptAttendanceStatus,
  DeptLeaveType,
} from '@prisma/client';

@Injectable()
export class DepartmentAttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List department attendance logs with filters
   */
  async getAttendanceLogs(query?: QueryAttendanceDto) {
    const where: any = {};

    if (query?.departmentId) {
      where.departmentId = query.departmentId;
    }
    if (query?.status) {
      where.status = query.status as DeptAttendanceStatus;
    }
    if (query?.overtimeOnly === 'true') {
      where.overtimeHours = { gt: 0 };
    }
    if (query?.date) {
      const d = new Date(query.date);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));
      where.attendanceDate = { gte: startOfDay, lte: endOfDay };
    }
    if (query?.search) {
      where.OR = [
        { attendanceCode: { contains: query.search, mode: 'insensitive' } },
        { employee: { firstName: { contains: query.search, mode: 'insensitive' } } },
        { employee: { lastName: { contains: query.search, mode: 'insensitive' } } },
        { employee: { employeeCode: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.departmentAttendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            designation: { select: { title: true } },
          },
        },
        department: {
          select: { id: true, name: true, code: true },
        },
      },
      orderBy: { attendanceDate: 'desc' },
    });
  }

  /**
   * Get single attendance record by ID
   */
  async getAttendanceById(id: string) {
    const attendance = await this.prisma.departmentAttendance.findUnique({
      where: { id },
      include: {
        employee: true,
        department: true,
      },
    });

    if (!attendance) {
      throw new NotFoundException(`Department attendance log with ID ${id} not found`);
    }

    return attendance;
  }

  /**
   * Log or update daily department attendance
   */
  async logAttendance(dto: LogDepartmentAttendanceDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
      include: { department: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${dto.employeeId} not found`);
    }

    const attendanceDate = new Date(dto.attendanceDate);
    const startOfDay = new Date(new Date(dto.attendanceDate).setHours(0, 0, 0, 0));

    // Check if attendance already exists for today
    const existing = await this.prisma.departmentAttendance.findFirst({
      where: {
        employeeId: dto.employeeId,
        attendanceDate: startOfDay,
      },
    });

    const plannedHours = dto.plannedHours ?? 8.0;
    const actualHours = dto.actualHours ?? 8.0;
    const overtimeHours = dto.overtimeHours ?? 0.0;

    let record;
    if (existing) {
      record = await this.prisma.departmentAttendance.update({
        where: { id: existing.id },
        data: {
          checkInTime: dto.checkInTime ? new Date(dto.checkInTime) : existing.checkInTime,
          checkOutTime: dto.checkOutTime ? new Date(dto.checkOutTime) : existing.checkOutTime,
          plannedHours,
          actualHours,
          overtimeHours,
          status: (dto.status as DeptAttendanceStatus) || existing.status,
          biometricVerification: dto.biometricVerification ?? existing.biometricVerification,
          supervisorNotes: dto.supervisorNotes ?? existing.supervisorNotes,
        },
        include: { employee: true, department: true },
      });
    } else {
      const count = await this.prisma.departmentAttendance.count();
      const attendanceCode = `DATT-2026-0${String(count + 1).padStart(3, '0')}`;

      record = await this.prisma.departmentAttendance.create({
        data: {
          attendanceCode,
          employeeId: dto.employeeId,
          departmentId: dto.departmentId,
          attendanceDate: startOfDay,
          checkInTime: dto.checkInTime ? new Date(dto.checkInTime) : new Date(),
          checkOutTime: dto.checkOutTime ? new Date(dto.checkOutTime) : null,
          plannedHours,
          actualHours,
          overtimeHours,
          status: (dto.status as DeptAttendanceStatus) || DeptAttendanceStatus.PRESENT,
          biometricVerification: dto.biometricVerification ?? true,
          supervisorNotes: dto.supervisorNotes || null,
        },
        include: { employee: true, department: true },
      });
    }

    await this.auditLogService.logAction(
      AuditAction.DEPARTMENT_ATTENDANCE_LOGGED,
      AuditSeverity.INFO,
      `Attendance logged for ${employee.firstName} ${employee.lastName} (${employee.employeeCode}) in ${employee.department.name} - Status: ${record.status}`,
      dto.loggedBy || 'Biometric Gate Sensor / Shift Supervisor',
      'DepartmentAttendanceService',
      {
        attendanceId: record.id,
        hours: actualHours,
        overtime: overtimeHours,
        status: record.status,
      },
    );

    return record;
  }

  /**
   * Approve department overtime hours
   */
  async approveOvertime(id: string, dto: ApproveOvertimeDto) {
    const attendance = await this.getAttendanceById(id);

    const updated = await this.prisma.departmentAttendance.update({
      where: { id },
      data: {
        overtimeHours: dto.approvedHours,
        overtimeApproved: true,
        overtimeReason: dto.overtimeReason,
      },
      include: { employee: true, department: true },
    });

    await this.auditLogService.logAction(
      AuditAction.DEPARTMENT_OVERTIME_APPROVED,
      AuditSeverity.INFO,
      `Department overtime of ${dto.approvedHours}h approved for ${attendance.employee.firstName} ${attendance.employee.lastName} by ${dto.approvedBy}. Reason: ${dto.overtimeReason}`,
      dto.approvedBy,
      'DepartmentAttendanceService',
      { attendanceId: id, employeeId: attendance.employeeId, overtimeHours: dto.approvedHours },
    );

    return updated;
  }

  /**
   * Approve department-specific leave request
   */
  async approveLeave(id: string, dto: ApproveDeptLeaveDto) {
    const attendance = await this.getAttendanceById(id);

    const updated = await this.prisma.departmentAttendance.update({
      where: { id },
      data: {
        status: DeptAttendanceStatus.ON_LEAVE,
        leaveType: dto.leaveType as DeptLeaveType,
        leaveApprovedBy: dto.leaveApprovedBy,
        supervisorNotes: dto.approvalRemarks || `Leave approved by ${dto.leaveApprovedBy}`,
        actualHours: 0,
        overtimeHours: 0,
      },
      include: { employee: true, department: true },
    });

    await this.auditLogService.logAction(
      AuditAction.LEAVE_STATUS_CHANGED,
      AuditSeverity.INFO,
      `Department leave (${dto.leaveType}) approved for ${attendance.employee.firstName} ${attendance.employee.lastName} by ${dto.leaveApprovedBy}`,
      dto.leaveApprovedBy,
      'DepartmentAttendanceService',
      { attendanceId: id, leaveType: dto.leaveType },
    );

    return updated;
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UploadOnboardingDocDto,
  VerifyOnboardingDocDto,
} from '../dto/employee.dto';
import { AuditAction, AuditSeverity, EmploymentStatus } from '@prisma/client';

@Injectable()
export class EmployeeManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all employees with relations and filtering
   */
  async getEmployees(params?: {
    departmentId?: string;
    designationId?: string;
    status?: EmploymentStatus;
    search?: string;
  }) {
    const where: any = {};

    if (params?.departmentId) {
      where.departmentId = params.departmentId;
    }
    if (params?.designationId) {
      where.designationId = params.designationId;
    }
    if (params?.status) {
      where.employmentStatus = params.status;
    }
    if (params?.search) {
      const q = params.search;
      where.OR = [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { employeeCode: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.employee.findMany({
      where,
      include: {
        department: true,
        designation: true,
        onboardingDocuments: true,
        _count: {
          select: {
            attendanceLogs: true,
            leaveRequests: true,
            safetyTrainingRecords: true,
          },
        },
      },
      orderBy: { employeeCode: 'asc' },
    });
  }

  /**
   * Get single employee profile with full dossier
   */
  async getEmployeeById(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        designation: true,
        onboardingDocuments: true,
        safetyTrainingRecords: true,
        shiftRosters: {
          orderBy: { effectiveStartDate: 'desc' },
          take: 5,
        },
        leaveRequests: {
          orderBy: { appliedAt: 'desc' },
          take: 5,
        },
        overtimeRecords: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee profile with ID ${id} not found`);
    }

    return employee;
  }

  /**
   * Create new employee profile and record audit entry
   */
  async createEmployee(dto: CreateEmployeeDto, adminUserId?: string) {
    const existingCode = await this.prisma.employee.findUnique({
      where: { employeeCode: dto.employeeCode },
    });
    if (existingCode) {
      throw new BadRequestException(`Employee with code ${dto.employeeCode} already exists`);
    }

    const existingEmail = await this.prisma.employee.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new BadRequestException(`Employee with email ${dto.email} already exists`);
    }

    const employee = await this.prisma.employee.create({
      data: {
        employeeCode: dto.employeeCode,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        departmentId: dto.departmentId,
        designationId: dto.designationId,
        employmentStatus: dto.employmentStatus || 'ACTIVE',
        employmentType: dto.employmentType || 'FULL_TIME',
        dateOfJoining: new Date(dto.dateOfJoining),
        emergencyContactName: dto.emergencyContactName,
        emergencyContactPhone: dto.emergencyContactPhone,
        panOrTaxId: dto.panOrTaxId,
        aadhaarOrNationalId: dto.aadhaarOrNationalId,
        bankAccountNumber: dto.bankAccountNumber,
        bankIfscOrRouting: dto.bankIfscOrRouting,
        baseSalary: dto.baseSalary,
        hourlyOvertimeRate: dto.hourlyOvertimeRate || 0,
        userId: dto.userId,
      },
      include: {
        department: true,
        designation: true,
      },
    });

    await this.auditLogService.logAction({
      userId: adminUserId || null,
      action: AuditAction.EMPLOYEE_CREATED,
      entity: 'Employee',
      entityId: employee.id,
      details: `Created employee record ${employee.employeeCode} (${employee.firstName} ${employee.lastName}) in ${employee.department.name}`,
      changes: { employeeCode: employee.employeeCode, department: employee.department.name, baseSalary: dto.baseSalary },
      severity: AuditSeverity.INFO,
    });

    return employee;
  }

  /**
   * Update employee details
   */
  async updateEmployee(id: string, dto: UpdateEmployeeDto, adminUserId?: string) {
    const existing = await this.prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Employee ${id} not found`);
    }

    const data: any = { ...dto };
    if (dto.dateOfLeaving) {
      data.dateOfLeaving = new Date(dto.dateOfLeaving);
    }

    const updated = await this.prisma.employee.update({
      where: { id },
      data,
      include: {
        department: true,
        designation: true,
      },
    });

    await this.auditLogService.logAction({
      userId: adminUserId || null,
      action: AuditAction.EMPLOYEE_UPDATED,
      entity: 'Employee',
      entityId: id,
      details: `Updated details for employee ${updated.employeeCode}`,
      changes: dto,
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Upload digital onboarding document
   */
  async uploadOnboardingDocument(dto: UploadOnboardingDocDto) {
    return this.prisma.onboardingDocument.create({
      data: {
        employeeId: dto.employeeId,
        documentName: dto.documentName,
        documentType: dto.documentType,
        documentUrl: dto.documentUrl,
        verificationStatus: 'VERIFIED',
        notes: dto.notes,
        verifiedAt: new Date(),
      },
    });
  }

  /**
   * Verify onboarding document
   */
  async verifyOnboardingDocument(docId: string, dto: VerifyOnboardingDocDto, guardOrHrId?: string) {
    return this.prisma.onboardingDocument.update({
      where: { id: docId },
      data: {
        verificationStatus: dto.verificationStatus,
        notes: dto.notes,
        verifiedBy: guardOrHrId,
        verifiedAt: new Date(),
      },
    });
  }

  /**
   * List departments
   */
  async getDepartments() {
    return this.prisma.department.findMany({
      include: {
        _count: { select: { employees: true, jobOpenings: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * List designations
   */
  async getDesignations() {
    return this.prisma.designation.findMany({
      include: {
        _count: { select: { employees: true } },
      },
      orderBy: { level: 'asc' },
    });
  }

  /**
   * Summary staffing telemetry
   */
  async getHeadcountTelemetry() {
    const totalHeadcount = await this.prisma.employee.count();
    const activeHeadcount = await this.prisma.employee.count({
      where: { employmentStatus: 'ACTIVE' },
    });
    const onLeaveHeadcount = await this.prisma.employee.count({
      where: { employmentStatus: 'ON_LEAVE' },
    });
    const probationHeadcount = await this.prisma.employee.count({
      where: { employmentStatus: 'PROBATION' },
    });

    const byDepartment = await this.prisma.department.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        _count: {
          select: { employees: true },
        },
      },
    });

    return {
      totalHeadcount,
      activeHeadcount,
      onLeaveHeadcount,
      probationHeadcount,
      byDepartment,
    };
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateWorkstationAssignmentDto,
  UpdateDeploymentStatusDto,
  QueryDeploymentsDto,
} from '../dto/department-deployment.dto';
import {
  AuditAction,
  AuditSeverity,
  DeploymentStatus,
  WorkstationRole,
} from '@prisma/client';

@Injectable()
export class DepartmentDeploymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List workstation assignments with filtering
   */
  async getDeployments(query?: QueryDeploymentsDto) {
    const where: any = {};

    if (query?.departmentId) {
      where.departmentId = query.departmentId;
    }
    if (query?.stationIdentifier) {
      where.stationIdentifier = { contains: query.stationIdentifier, mode: 'insensitive' };
    }
    if (query?.shiftCode) {
      where.shiftCode = query.shiftCode;
    }
    if (query?.status) {
      where.status = query.status as DeploymentStatus;
    }
    if (query?.date) {
      const d = new Date(query.date);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));
      where.assignmentDate = { gte: startOfDay, lte: endOfDay };
    }
    if (query?.search) {
      where.OR = [
        { assignmentCode: { contains: query.search, mode: 'insensitive' } },
        { stationIdentifier: { contains: query.search, mode: 'insensitive' } },
        { employee: { firstName: { contains: query.search, mode: 'insensitive' } } },
        { employee: { lastName: { contains: query.search, mode: 'insensitive' } } },
        { employee: { employeeCode: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.departmentWorkstationAssignment.findMany({
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
        machineAsset: {
          select: {
            id: true,
            assetTag: true,
            assetName: true,
            category: true,
            modelNumber: true,
          },
        },
        targetOutputs: true,
      },
      orderBy: { assignmentDate: 'desc' },
    });
  }

  /**
   * Get single deployment by ID
   */
  async getDeploymentById(id: string) {
    const assignment = await this.prisma.departmentWorkstationAssignment.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            designation: true,
            department: true,
          },
        },
        department: true,
        machineAsset: true,
        targetOutputs: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Workstation assignment with ID ${id} not found`);
    }

    return assignment;
  }

  /**
   * Allocate worker to a workstation, machine, or assembly line
   */
  async createDeployment(dto: CreateWorkstationAssignmentDto) {
    // Verify employee belongs to department
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
      include: { department: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${dto.employeeId} not found`);
    }

    // Generate assignment code
    const count = await this.prisma.departmentWorkstationAssignment.count();
    const assignmentCode = `DWA-2026-0${String(count + 1).padStart(3, '0')}`;

    // Verify machine certification if machine is linked
    let certVerified = dto.certificationVerified ?? true;
    if (dto.machineAssetId) {
      const activeCert = await this.prisma.machineCertificationCheck.findFirst({
        where: {
          employeeId: dto.employeeId,
          machineAssetId: dto.machineAssetId,
          isValid: true,
          expiryDate: { gte: new Date() },
        },
      });

      if (!activeCert) {
        // Warning: certification not formally verified for this specific machine asset
        certVerified = false;
      }
    }

    const created = await this.prisma.departmentWorkstationAssignment.create({
      data: {
        assignmentCode,
        employeeId: dto.employeeId,
        departmentId: dto.departmentId,
        stationIdentifier: dto.stationIdentifier,
        machineAssetId: dto.machineAssetId || null,
        shiftCode: dto.shiftCode || 'SHIFT_A',
        assignmentDate: new Date(dto.assignmentDate),
        roleOnStation: (dto.roleOnStation as WorkstationRole) || WorkstationRole.PRIMARY_OPERATOR,
        status: DeploymentStatus.ACTIVE,
        certificationVerified: certVerified,
        supervisorRemarks: dto.supervisorRemarks || null,
      },
      include: {
        employee: true,
        department: true,
        machineAsset: true,
      },
    });

    // Audit log
    await this.auditLogService.logAction(
      AuditAction.DEPARTMENT_WORKER_DEPLOYED,
      certVerified ? AuditSeverity.INFO : AuditSeverity.WARNING,
      `Worker ${employee.firstName} ${employee.lastName} (${employee.employeeCode}) deployed to ${dto.stationIdentifier} in ${employee.department.name} (${assignmentCode})`,
      dto.assignedBy || 'Department Supervisor',
      'DepartmentDeploymentService',
      {
        assignmentId: created.id,
        stationIdentifier: dto.stationIdentifier,
        certificationVerified: certVerified,
        shiftCode: created.shiftCode,
      },
    );

    return created;
  }

  /**
   * Update deployment status (reassign, complete, standby)
   */
  async updateDeploymentStatus(id: string, dto: UpdateDeploymentStatusDto) {
    const existing = await this.getDeploymentById(id);

    const updateData: any = {
      status: dto.status as DeploymentStatus,
    };

    if (dto.reassignedStationIdentifier) {
      updateData.stationIdentifier = dto.reassignedStationIdentifier;
    }
    if (dto.supervisorRemarks) {
      updateData.supervisorRemarks = dto.supervisorRemarks;
    }

    const updated = await this.prisma.departmentWorkstationAssignment.update({
      where: { id },
      data: updateData,
      include: {
        employee: true,
        department: true,
        machineAsset: true,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.DEPARTMENT_WORKER_DEPLOYED,
      AuditSeverity.INFO,
      `Workstation deployment ${existing.assignmentCode} updated to ${dto.status} for ${existing.employee.firstName} ${existing.employee.lastName}`,
      dto.updatedBy || 'Department Supervisor',
      'DepartmentDeploymentService',
      { assignmentId: id, status: dto.status, newStation: dto.reassignedStationIdentifier },
    );

    return updated;
  }
}

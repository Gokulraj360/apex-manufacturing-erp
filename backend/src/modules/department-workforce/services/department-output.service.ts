import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  RecordTargetOutputDto,
  SignoffOutputDto,
  QueryOutputsDto,
} from '../dto/department-output.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class DepartmentOutputService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List output performance records with filters
   */
  async getOutputs(query?: QueryOutputsDto) {
    const where: any = {};

    if (query?.departmentId) {
      where.departmentId = query.departmentId;
    }
    if (query?.employeeId) {
      where.employeeId = query.employeeId;
    }
    if (query?.workstationOrLine) {
      where.workstationOrLine = { contains: query.workstationOrLine, mode: 'insensitive' };
    }
    if (query?.shiftCode) {
      where.shiftCode = query.shiftCode;
    }
    if (query?.shiftDate) {
      const d = new Date(query.shiftDate);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));
      where.shiftDate = { gte: startOfDay, lte: endOfDay };
    }
    if (query?.search) {
      where.OR = [
        { targetCode: { contains: query.search, mode: 'insensitive' } },
        { workstationOrLine: { contains: query.search, mode: 'insensitive' } },
        { productSku: { contains: query.search, mode: 'insensitive' } },
        { productName: { contains: query.search, mode: 'insensitive' } },
        { employee: { firstName: { contains: query.search, mode: 'insensitive' } } },
        { employee: { lastName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.departmentTargetOutput.findMany({
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
        workstationAssignment: {
          select: {
            id: true,
            assignmentCode: true,
            stationIdentifier: true,
            roleOnStation: true,
          },
        },
      },
      orderBy: { shiftDate: 'desc' },
    });
  }

  /**
   * Get single target output record by ID
   */
  async getOutputById(id: string) {
    const output = await this.prisma.departmentTargetOutput.findUnique({
      where: { id },
      include: {
        employee: true,
        department: true,
        workstationAssignment: true,
      },
    });

    if (!output) {
      throw new NotFoundException(`Target output record with ID ${id} not found`);
    }

    return output;
  }

  /**
   * Record daily target vs actual production output
   */
  async recordOutput(dto: RecordTargetOutputDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
      include: { department: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${dto.employeeId} not found`);
    }

    const count = await this.prisma.departmentTargetOutput.count();
    const targetCode = `DTO-2026-0${String(count + 1).padStart(3, '0')}`;

    const rejected = dto.rejectedQuantity ?? 0;
    const rework = dto.reworkQuantity ?? 0;
    const netGood = Math.max(0, dto.actualQuantity - rejected);
    const efficiencyRatePct = dto.targetQuantity > 0
      ? Number(((netGood / dto.targetQuantity) * 100).toFixed(2))
      : 0;

    const created = await this.prisma.departmentTargetOutput.create({
      data: {
        targetCode,
        departmentId: dto.departmentId,
        employeeId: dto.employeeId,
        workstationAssignmentId: dto.workstationAssignmentId || null,
        workstationOrLine: dto.workstationOrLine,
        productSku: dto.productSku,
        productName: dto.productName,
        shiftDate: new Date(dto.shiftDate),
        shiftCode: dto.shiftCode || 'SHIFT_A',
        targetQuantity: dto.targetQuantity,
        actualQuantity: dto.actualQuantity,
        rejectedQuantity: rejected,
        reworkQuantity: rework,
        efficiencyRatePct,
        downtimeMinutes: dto.downtimeMinutes ?? 0,
        downtimeReason: dto.downtimeReason || null,
        supervisorSignoff: dto.supervisorSignoff || null,
      },
      include: {
        employee: true,
        department: true,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.DEPARTMENT_OUTPUT_RECORDED,
      efficiencyRatePct >= 90 ? AuditSeverity.INFO : AuditSeverity.WARNING,
      `Production output ${targetCode} logged for ${employee.firstName} ${employee.lastName} at ${dto.workstationOrLine}: Target ${dto.targetQuantity}, Actual ${dto.actualQuantity}, Net Good ${netGood} (${efficiencyRatePct}% efficiency)`,
      dto.recordedBy || dto.supervisorSignoff || 'Shift Supervisor',
      'DepartmentOutputService',
      {
        targetCode,
        efficiencyRatePct,
        productSku: dto.productSku,
        downtimeMinutes: dto.downtimeMinutes,
      },
    );

    return created;
  }

  /**
   * Supervisor signoff on production output
   */
  async signoffOutput(id: string, dto: SignoffOutputDto) {
    const existing = await this.getOutputById(id);

    const updated = await this.prisma.departmentTargetOutput.update({
      where: { id },
      data: {
        supervisorSignoff: dto.supervisorSignoff,
      },
      include: {
        employee: true,
        department: true,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.DEPARTMENT_OUTPUT_RECORDED,
      AuditSeverity.INFO,
      `Output log ${existing.targetCode} verified and signed off by supervisor ${dto.supervisorSignoff}`,
      dto.supervisorSignoff,
      'DepartmentOutputService',
      { outputId: id, supervisorSignoff: dto.supervisorSignoff },
    );

    return updated;
  }
}

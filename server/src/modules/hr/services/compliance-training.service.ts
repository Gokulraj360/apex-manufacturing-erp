import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateSafetyTrainingDto,
  CreateLaborComplianceDocDto,
  UpdateComplianceStatusDto,
} from '../dto/compliance.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class ComplianceTrainingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Log safety training session for an employee
   */
  async logSafetyTraining(dto: CreateSafetyTrainingDto) {
    const training = await this.prisma.safetyTrainingRecord.create({
      data: {
        employeeId: dto.employeeId,
        trainingProgramName: dto.trainingProgramName,
        trainerAgency: dto.trainerAgency,
        trainingDate: new Date(dto.trainingDate),
        validityExpiryDate: dto.validityExpiryDate ? new Date(dto.validityExpiryDate) : null,
        certificateNumber: dto.certificateNumber,
        passedAssessment: dto.passedAssessment ?? true,
        assessmentScore: dto.assessmentScore,
        notes: dto.notes,
      },
      include: {
        employee: {
          include: { department: true },
        },
      },
    });

    return training;
  }

  /**
   * List safety training logs
   */
  async getSafetyTrainingLogs(employeeId?: string) {
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;

    return this.prisma.safetyTrainingRecord.findMany({
      where,
      include: {
        employee: {
          include: { department: true, designation: true },
        },
      },
      orderBy: { trainingDate: 'desc' },
    });
  }

  /**
   * Log statutory labor compliance document filing
   */
  async createLaborComplianceDoc(dto: CreateLaborComplianceDocDto, auditorId?: string) {
    const doc = await this.prisma.laborComplianceDocument.create({
      data: {
        complianceTitle: dto.complianceTitle,
        documentCategory: dto.documentCategory,
        statutoryAuthority: dto.statutoryAuthority,
        filingPeriod: dto.filingPeriod,
        filingDate: new Date(dto.filingDate),
        nextRenewalDate: dto.nextRenewalDate ? new Date(dto.nextRenewalDate) : null,
        acknowledgementNumber: dto.acknowledgementNumber,
        documentUrl: dto.documentUrl,
        complianceStatus: dto.complianceStatus || 'COMPLIANT',
        auditedBy: dto.auditedBy || 'Internal Compliance Officer',
      },
    });

    await this.auditLogService.logAction({
      userId: auditorId || null,
      action: AuditAction.COMPLIANCE_RECORD_UPDATED,
      entity: 'LaborComplianceDocument',
      entityId: doc.id,
      details: `Filed statutory compliance record: ${doc.complianceTitle} (${doc.filingPeriod}) with ${doc.statutoryAuthority}`,
      severity: AuditSeverity.INFO,
    });

    return doc;
  }

  /**
   * Update statutory compliance filing status
   */
  async updateComplianceStatus(id: string, dto: UpdateComplianceStatusDto, auditorId?: string) {
    const existing = await this.prisma.laborComplianceDocument.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Compliance record ${id} not found`);
    }

    const data: any = {
      complianceStatus: dto.complianceStatus,
      auditedBy: dto.auditedBy || existing.auditedBy,
    };
    if (dto.nextRenewalDate) {
      data.nextRenewalDate = new Date(dto.nextRenewalDate);
    }

    const updated = await this.prisma.laborComplianceDocument.update({
      where: { id },
      data,
    });

    await this.auditLogService.logAction({
      userId: auditorId || null,
      action: AuditAction.COMPLIANCE_RECORD_UPDATED,
      entity: 'LaborComplianceDocument',
      entityId: id,
      details: `Updated compliance status for ${existing.complianceTitle} to ${dto.complianceStatus}`,
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * List labor compliance records
   */
  async getLaborComplianceDocuments(category?: string) {
    const where: any = {};
    if (category) where.documentCategory = category;

    return this.prisma.laborComplianceDocument.findMany({
      where,
      orderBy: { filingDate: 'desc' },
    });
  }

  /**
   * Compute compliance telemetry index
   */
  async getComplianceIndex() {
    const totalComplianceDocs = await this.prisma.laborComplianceDocument.count();
    const compliantCount = await this.prisma.laborComplianceDocument.count({
      where: { complianceStatus: 'COMPLIANT' },
    });
    const totalTrainings = await this.prisma.safetyTrainingRecord.count();
    const passedTrainings = await this.prisma.safetyTrainingRecord.count({
      where: { passedAssessment: true },
    });

    const statutoryComplianceRate = totalComplianceDocs > 0 ? (compliantCount / totalComplianceDocs) * 100 : 100;
    const safetyPassRate = totalTrainings > 0 ? (passedTrainings / totalTrainings) * 100 : 100;

    return {
      totalComplianceDocs,
      compliantCount,
      totalTrainings,
      statutoryComplianceRate: parseFloat(statutoryComplianceRate.toFixed(1)),
      safetyPassRate: parseFloat(safetyPassRate.toFixed(1)),
    };
  }
}

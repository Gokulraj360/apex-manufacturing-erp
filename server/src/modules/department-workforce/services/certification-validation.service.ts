import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateMachineCertificationDto,
  ValidateOperatorCertificationDto,
  QueryCertificationsDto,
} from '../dto/certification-validation.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class CertificationValidationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List certifications with filters
   */
  async getCertifications(query?: QueryCertificationsDto) {
    const where: any = {};

    if (query?.employeeId) {
      where.employeeId = query.employeeId;
    }
    if (query?.machineModel) {
      where.machineModel = { contains: query.machineModel, mode: 'insensitive' };
    }
    if (query?.isValid === 'true') {
      where.isValid = true;
      where.expiryDate = { gte: new Date() };
    } else if (query?.isValid === 'false') {
      where.OR = [
        { isValid: false },
        { expiryDate: { lt: new Date() } },
      ];
    }
    if (query?.expiringSoon === 'true') {
      const now = new Date();
      const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      where.expiryDate = { gte: now, lte: in30Days };
      where.isValid = true;
    }
    if (query?.search) {
      where.OR = [
        { checkCode: { contains: query.search, mode: 'insensitive' } },
        { certificationNumber: { contains: query.search, mode: 'insensitive' } },
        { certificationType: { contains: query.search, mode: 'insensitive' } },
        { certifyingBody: { contains: query.search, mode: 'insensitive' } },
        { machineModel: { contains: query.search, mode: 'insensitive' } },
        { employee: { firstName: { contains: query.search, mode: 'insensitive' } } },
        { employee: { lastName: { contains: query.search, mode: 'insensitive' } } },
        { employee: { employeeCode: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.machineCertificationCheck.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            department: { select: { name: true, code: true } },
            designation: { select: { title: true } },
          },
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
      },
      orderBy: { expiryDate: 'asc' },
    });
  }

  /**
   * Get certification by ID
   */
  async getCertificationById(id: string) {
    const cert = await this.prisma.machineCertificationCheck.findUnique({
      where: { id },
      include: {
        employee: true,
        machineAsset: true,
      },
    });

    if (!cert) {
      throw new NotFoundException(`Machine certification record with ID ${id} not found`);
    }

    return cert;
  }

  /**
   * Validate operator compliance before workstation deployment
   */
  async validateOperatorCertification(dto: ValidateOperatorCertificationDto) {
    const now = new Date();

    const cert = await this.prisma.machineCertificationCheck.findFirst({
      where: {
        employeeId: dto.employeeId,
        machineModel: { contains: dto.machineModel, mode: 'insensitive' },
        isValid: true,
        expiryDate: { gte: now },
      },
      include: { employee: true, machineAsset: true },
    });

    if (!cert) {
      return {
        compliant: false,
        reason: `Operator does not possess an active, non-expired certification for machine model "${dto.machineModel}". Deployment blocked for safety compliance.`,
      };
    }

    const daysUntilExpiry = Math.ceil(
      (cert.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      compliant: true,
      certification: cert,
      daysUntilExpiry,
      warning: daysUntilExpiry <= 30 ? `Certification expires in ${daysUntilExpiry} days.` : null,
    };
  }

  /**
   * Register new machine safety and operational certification
   */
  async createCertification(dto: CreateMachineCertificationDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
      include: { department: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${dto.employeeId} not found`);
    }

    const count = await this.prisma.machineCertificationCheck.count();
    const checkCode = `MCC-2026-0${String(count + 1).padStart(3, '0')}`;

    const expiryDate = new Date(dto.expiryDate);
    const now = new Date();
    const isValid = dto.isValid ?? (expiryDate > now);

    const created = await this.prisma.machineCertificationCheck.create({
      data: {
        checkCode,
        employeeId: dto.employeeId,
        machineAssetId: dto.machineAssetId || null,
        machineModel: dto.machineModel,
        certificationType: dto.certificationType,
        certifyingBody: dto.certifyingBody,
        certificationNumber: dto.certificationNumber,
        issueDate: new Date(dto.issueDate),
        expiryDate,
        isValid,
        safetyScore: dto.safetyScore ?? 95.0,
        lastIncidentDate: dto.lastIncidentDate ? new Date(dto.lastIncidentDate) : null,
        verifiedBy: dto.verifiedBy,
        verifiedAt: new Date(),
      },
      include: {
        employee: true,
        machineAsset: true,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.MACHINE_CERTIFICATION_VERIFIED,
      isValid ? AuditSeverity.INFO : AuditSeverity.WARNING,
      `Machine safety certification ${created.checkCode} (${dto.certificationType}) recorded for ${employee.firstName} ${employee.lastName} on ${dto.machineModel}. Verified by ${dto.verifiedBy}`,
      dto.verifiedBy,
      'CertificationValidationService',
      {
        checkCode: created.checkCode,
        employeeId: dto.employeeId,
        machineModel: dto.machineModel,
        expiryDate: dto.expiryDate,
        isValid,
      },
    );

    return created;
  }
}

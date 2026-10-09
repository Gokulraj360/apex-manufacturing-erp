import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateComplianceDocDto,
  UpdateComplianceDocDto,
  QueryComplianceDocsDto,
} from '../dto/vehicle-compliance.dto';
import {
  AuditAction,
  AuditSeverity,
  ComplianceDocType,
  ComplianceDocStatus,
} from '@prisma/client';

@Injectable()
export class VehicleComplianceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Helper to format Prisma Compliance Document with numeric decimals
   */
  private formatComplianceDoc(doc: any) {
    if (!doc) return null;
    return {
      ...doc,
      premiumOrFeeAmount: doc.premiumOrFeeAmount != null ? Number(doc.premiumOrFeeAmount) : 0,
      vehicle: doc.vehicle
        ? {
            ...doc.vehicle,
            payloadCapacityKg: doc.vehicle.payloadCapacityKg != null ? Number(doc.vehicle.payloadCapacityKg) : 0,
            totalOdometerKm: doc.vehicle.totalOdometerKm != null ? Number(doc.vehicle.totalOdometerKm) : 0,
          }
        : undefined,
    };
  }

  /**
   * Determine compliance doc status based on expiry date
   */
  private computeStatus(expiryDate: Date, alertDays = 30): ComplianceDocStatus {
    const now = new Date();
    if (expiryDate < now) {
      return ComplianceDocStatus.EXPIRED;
    }
    const alertThreshold = new Date(now.getTime() + alertDays * 24 * 60 * 60 * 1000);
    if (expiryDate <= alertThreshold) {
      return ComplianceDocStatus.EXPIRING_SOON;
    }
    return ComplianceDocStatus.ACTIVE;
  }

  /**
   * Get all compliance documents with filtering
   */
  async getComplianceDocs(query?: QueryComplianceDocsDto) {
    const where: any = {};

    if (query?.vehicleId) {
      where.vehicleId = query.vehicleId;
    }
    if (query?.docType) {
      where.docType = query.docType as ComplianceDocType;
    }
    if (query?.status) {
      where.status = query.status as ComplianceDocStatus;
    }
    if (query?.search) {
      where.OR = [
        { documentNumber: { contains: query.search, mode: 'insensitive' } },
        { policyOrCertificateNumber: { contains: query.search, mode: 'insensitive' } },
        { issuingAuthority: { contains: query.search, mode: 'insensitive' } },
        { managedBy: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
        { vehicle: { vehicleNumber: { contains: query.search, mode: 'insensitive' } } },
        { vehicle: { fleetCode: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const docs = await this.prisma.vehicleComplianceDocument.findMany({
      where,
      orderBy: { expiryDate: 'asc' },
      include: {
        vehicle: true,
      },
    });

    return docs.map((d) => this.formatComplianceDoc(d));
  }

  /**
   * Get compliance doc by ID
   */
  async getComplianceDocById(id: string) {
    const doc = await this.prisma.vehicleComplianceDocument.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!doc) {
      throw new NotFoundException(`Compliance document with ID '${id}' not found`);
    }

    return this.formatComplianceDoc(doc);
  }

  /**
   * Register a new statutory document
   */
  async createComplianceDoc(dto: CreateComplianceDocDto) {
    const vehicle = await this.prisma.fleetVehicle.findUnique({
      where: { id: dto.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Fleet vehicle with ID '${dto.vehicleId}' not found`);
    }

    // Auto-generate documentNumber
    const count = await this.prisma.vehicleComplianceDocument.count();
    const typePrefix = dto.docType ? dto.docType.split('_')[0] : 'DOC';
    const documentNumber = `DOC-${typePrefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const expiry = new Date(dto.expiryDate);
    const alertDays = dto.renewalAlertDays || 30;
    const computedStatus = dto.status || this.computeStatus(expiry, alertDays);

    const created = await this.prisma.vehicleComplianceDocument.create({
      data: {
        documentNumber,
        vehicleId: dto.vehicleId,
        docType: dto.docType || ComplianceDocType.INSURANCE_POLICY,
        policyOrCertificateNumber: dto.policyOrCertificateNumber,
        issuingAuthority: dto.issuingAuthority,
        issueDate: new Date(dto.issueDate),
        expiryDate: expiry,
        premiumOrFeeAmount: dto.premiumOrFeeAmount || 0,
        status: computedStatus,
        documentUrl: dto.documentUrl || null,
        renewalAlertDays: alertDays,
        notes: dto.notes || null,
        managedBy: dto.managedBy,
      },
      include: {
        vehicle: true,
      },
    });

    // Update vehicle's statutory expiry date
    const vehicleUpdate: any = {};
    if (created.docType === ComplianceDocType.INSURANCE_POLICY) {
      vehicleUpdate.insurancePolicyExpiry = expiry;
    } else if (created.docType === ComplianceDocType.PUC_CERTIFICATE) {
      vehicleUpdate.pucExpiry = expiry;
    } else if (created.docType === ComplianceDocType.FITNESS_CERTIFICATE) {
      vehicleUpdate.fitnessExpiry = expiry;
    } else if (created.docType === ComplianceDocType.ROAD_TAX) {
      vehicleUpdate.roadTaxExpiry = expiry;
    }

    if (Object.keys(vehicleUpdate).length > 0) {
      await this.prisma.fleetVehicle.update({
        where: { id: vehicle.id },
        data: vehicleUpdate,
      });
    }

    await this.auditLogService.logAction({
      action: AuditAction.VEHICLE_COMPLIANCE_UPDATED,
      severity: AuditSeverity.LOW,
      entityType: 'VehicleComplianceDocument',
      entityId: created.id,
      description: `Registered statutory compliance doc [${documentNumber}] (${created.docType}) for vehicle ${vehicle.vehicleNumber}`,
      userId: dto.managedBy,
    });

    return this.formatComplianceDoc(created);
  }

  /**
   * Update compliance document
   */
  async updateComplianceDoc(id: string, dto: UpdateComplianceDocDto) {
    const existing = await this.prisma.vehicleComplianceDocument.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!existing) {
      throw new NotFoundException(`Compliance document with ID '${id}' not found`);
    }

    const data: any = {};
    if (dto.docType) data.docType = dto.docType as ComplianceDocType;
    if (dto.policyOrCertificateNumber) data.policyOrCertificateNumber = dto.policyOrCertificateNumber;
    if (dto.issuingAuthority) data.issuingAuthority = dto.issuingAuthority;
    if (dto.issueDate) data.issueDate = new Date(dto.issueDate);
    if (dto.expiryDate) {
      data.expiryDate = new Date(dto.expiryDate);
      if (!dto.status) {
        data.status = this.computeStatus(data.expiryDate, dto.renewalAlertDays || existing.renewalAlertDays);
      }
    }
    if (dto.premiumOrFeeAmount != null) data.premiumOrFeeAmount = dto.premiumOrFeeAmount;
    if (dto.status) data.status = dto.status as ComplianceDocStatus;
    if (dto.documentUrl !== undefined) data.documentUrl = dto.documentUrl;
    if (dto.renewalAlertDays != null) data.renewalAlertDays = dto.renewalAlertDays;
    if (dto.notes !== undefined) data.notes = dto.notes;

    const updated = await this.prisma.vehicleComplianceDocument.update({
      where: { id },
      data,
      include: { vehicle: true },
    });

    // Update vehicle's statutory expiry date if expiryDate changed
    if (dto.expiryDate) {
      const vehicleUpdate: any = {};
      const docType = updated.docType;
      const newExpiry = new Date(dto.expiryDate);
      if (docType === ComplianceDocType.INSURANCE_POLICY) vehicleUpdate.insurancePolicyExpiry = newExpiry;
      else if (docType === ComplianceDocType.PUC_CERTIFICATE) vehicleUpdate.pucExpiry = newExpiry;
      else if (docType === ComplianceDocType.FITNESS_CERTIFICATE) vehicleUpdate.fitnessExpiry = newExpiry;
      else if (docType === ComplianceDocType.ROAD_TAX) vehicleUpdate.roadTaxExpiry = newExpiry;

      if (Object.keys(vehicleUpdate).length > 0) {
        await this.prisma.fleetVehicle.update({
          where: { id: existing.vehicleId },
          data: vehicleUpdate,
        });
      }
    }

    await this.auditLogService.logAction({
      action: AuditAction.VEHICLE_COMPLIANCE_UPDATED,
      severity: AuditSeverity.LOW,
      entityType: 'VehicleComplianceDocument',
      entityId: updated.id,
      description: `Updated compliance document [${updated.documentNumber}] (${updated.docType})`,
      userId: 'FLEET_COMPLIANCE_OFFICER',
    });

    return this.formatComplianceDoc(updated);
  }

  /**
   * Delete compliance document
   */
  async deleteComplianceDoc(id: string) {
    const existing = await this.prisma.vehicleComplianceDocument.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Compliance document with ID '${id}' not found`);
    }

    return this.prisma.vehicleComplianceDocument.delete({ where: { id } });
  }

  /**
   * Compliance overview statistics
   */
  async getComplianceStatistics() {
    const docs = await this.prisma.vehicleComplianceDocument.findMany();

    const active = docs.filter((d) => d.status === ComplianceDocStatus.ACTIVE).length;
    const expiringSoon = docs.filter((d) => d.status === ComplianceDocStatus.EXPIRING_SOON).length;
    const expired = docs.filter((d) => d.status === ComplianceDocStatus.EXPIRED).length;
    const pendingRenewal = docs.filter((d) => d.status === ComplianceDocStatus.PENDING_RENEWAL).length;

    const totalFeesPaid = docs.reduce((acc, d) => acc + Number(d.premiumOrFeeAmount || 0), 0);

    const docTypeBreakdown = {
      insurance: docs.filter((d) => d.docType === ComplianceDocType.INSURANCE_POLICY).length,
      puc: docs.filter((d) => d.docType === ComplianceDocType.PUC_CERTIFICATE).length,
      fitness: docs.filter((d) => d.docType === ComplianceDocType.FITNESS_CERTIFICATE).length,
      roadTax: docs.filter((d) => d.docType === ComplianceDocType.ROAD_TAX).length,
      permit: docs.filter((d) => d.docType === ComplianceDocType.NATIONAL_PERMIT).length,
      rc: docs.filter((d) => d.docType === ComplianceDocType.REGISTRATION_RC).length,
    };

    return {
      totalDocuments: docs.length,
      active,
      expiringSoon,
      expired,
      pendingRenewal,
      totalFeesPaid,
      docTypeBreakdown,
    };
  }
}

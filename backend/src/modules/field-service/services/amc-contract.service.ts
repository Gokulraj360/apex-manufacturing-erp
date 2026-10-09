import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateAMCContractDto,
  UpdateAMCContractDto,
  CreateWarrantyRecordDto,
  QueryAMCDto,
} from '../dto/amc-contract.dto';
import { AuditAction, AuditSeverity, AMCContractStatus, WarrantyStatus } from '@prisma/client';

@Injectable()
export class AMCContractService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // ==================== AMC CONTRACTS ====================

  /**
   * List all AMC contracts
   */
  async getContracts(query: QueryAMCDto) {
    const { status, customerName, search, limit = 50, offset = 0 } = query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (customerName) {
      where.customerName = { contains: customerName, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { contractNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { machineSerialNumber: { contains: search, mode: 'insensitive' } },
        { machineModel: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.aMCContract.count({ where }),
      this.prisma.aMCContract.findMany({
        where,
        include: {
          _count: {
            select: { serviceRequests: true },
          },
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { endDate: 'asc' },
      }),
    ]);

    return { total, items };
  }

  /**
   * Get AMC contract by ID
   */
  async getContractById(id: string) {
    const contract = await this.prisma.aMCContract.findUnique({
      where: { id },
      include: {
        serviceRequests: {
          take: 10,
          orderBy: { scheduledDate: 'desc' },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException(`AMC Contract with ID ${id} not found.`);
    }

    return contract;
  }

  /**
   * Create a new Annual Maintenance Contract (AMC)
   */
  async createContract(dto: CreateAMCContractDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.aMCContract.findUnique({
      where: { contractNumber: dto.contractNumber },
    });

    if (existing) {
      throw new BadRequestException(`Contract number ${dto.contractNumber} already exists.`);
    }

    const contract = await this.prisma.aMCContract.create({
      data: {
        contractNumber: dto.contractNumber,
        customerName: dto.customerName,
        customerContact: dto.customerContact,
        machineModel: dto.machineModel,
        machineSerialNumber: dto.machineSerialNumber,
        contractType: dto.contractType,
        status: AMCContractStatus.ACTIVE,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        contractValue: dto.contractValue,
        visitsAllowedTotal: dto.visitsAllowedTotal || 4,
        visitsConsumed: 0,
        termsAndConditions: dto.termsAndConditions,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.AMC_CONTRACT_CREATED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        customer: contract.customerName,
        value: Number(contract.contractValue),
      },
    });

    return contract;
  }

  /**
   * Update AMC Contract
   */
  async updateContract(id: string, dto: UpdateAMCContractDto) {
    const contract = await this.getContractById(id);

    const updated = await this.prisma.aMCContract.update({
      where: { id: contract.id },
      data: dto as any,
    });

    return updated;
  }

  // ==================== WARRANTIES ====================

  /**
   * List warranty records
   */
  async getWarranties(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { warrantyCardNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { machineSerialNumber: { contains: search, mode: 'insensitive' } },
        { machineModel: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.warrantyRecord.findMany({
      where,
      orderBy: { warrantyEndDate: 'asc' },
    });
  }

  /**
   * Register machine warranty card
   */
  async createWarranty(dto: CreateWarrantyRecordDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.warrantyRecord.findUnique({
      where: { machineSerialNumber: dto.machineSerialNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Machine serial ${dto.machineSerialNumber} already has a warranty registration.`,
      );
    }

    const warranty = await this.prisma.warrantyRecord.create({
      data: {
        warrantyCardNumber: dto.warrantyCardNumber,
        customerName: dto.customerName,
        machineModel: dto.machineModel,
        machineSerialNumber: dto.machineSerialNumber,
        dispatchDate: new Date(dto.dispatchDate),
        installationDate: new Date(dto.installationDate),
        warrantyEndDate: new Date(dto.warrantyEndDate),
        status: WarrantyStatus.ACTIVE,
        coverageScope: dto.coverageScope || 'Standard 24-Month Comprehensive OEM Warranty',
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.WARRANTY_RECORD_REGISTERED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        card: warranty.warrantyCardNumber,
        serial: warranty.machineSerialNumber,
      },
    });

    return warranty;
  }
}

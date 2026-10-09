import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateFieldEngineerDto,
  UpdateEngineerLocationDto,
  AddServiceLogDto,
  QueryFieldEngineerDto,
} from '../dto/engineer-assignment.dto';
import { AuditAction, AuditSeverity, EngineerStatus } from '@prisma/client';

@Injectable()
export class EngineerAssignmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all field service engineers
   */
  async getEngineers(query: QueryFieldEngineerDto) {
    const { status, territoryCity, specialization, search, limit = 50, offset = 0 } = query;
    const where: any = {};

    if (status) {
      where.currentStatus = status;
    }

    if (territoryCity) {
      where.operatingTerritoryCity = { contains: territoryCity, mode: 'insensitive' };
    }

    if (specialization) {
      where.technicalSpecializations = { has: specialization };
    }

    if (search) {
      where.OR = [
        { employeeCode: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { operatingTerritoryCity: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.fieldEngineer.count({ where }),
      this.prisma.fieldEngineer.findMany({
        where,
        include: {
          _count: {
            select: {
              assignedRequests: true,
              vanStocks: true,
              partRequisitions: true,
            },
          },
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { fullName: 'asc' },
      }),
    ]);

    return { total, items };
  }

  /**
   * Get engineer by ID with active jobs & van stock
   */
  async getEngineerById(id: string) {
    const engineer = await this.prisma.fieldEngineer.findUnique({
      where: { id },
      include: {
        assignedRequests: {
          where: {
            status: { notIn: ['RESOLVED', 'CLOSED', 'CANCELLED'] },
          },
          orderBy: { scheduledDate: 'asc' },
        },
        vanStocks: true,
        partRequisitions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!engineer) {
      throw new NotFoundException(`Field engineer with ID ${id} not found.`);
    }

    return engineer;
  }

  /**
   * Enroll a new certified field engineer
   */
  async createEngineer(dto: CreateFieldEngineerDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.fieldEngineer.findUnique({
      where: { employeeCode: dto.employeeCode },
    });

    if (existing) {
      throw new BadRequestException(`Employee code ${dto.employeeCode} already exists.`);
    }

    const engineer = await this.prisma.fieldEngineer.create({
      data: {
        employeeCode: dto.employeeCode,
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        operatingTerritoryCity: dto.operatingTerritoryCity,
        technicalSpecializations: dto.technicalSpecializations,
        currentStatus: EngineerStatus.AVAILABLE,
        isActive: true,
      },
    });

    return engineer;
  }

  /**
   * Update live telemetry location coordinates & technician status
   */
  async updateLocation(id: string, dto: UpdateEngineerLocationDto) {
    const engineer = await this.getEngineerById(id);

    const updateData: any = {
      currentStatus: dto.currentStatus,
      lastLocationUpdate: new Date(),
    };

    if (dto.currentLatitude !== undefined) {
      updateData.currentLatitude = dto.currentLatitude;
    }

    if (dto.currentLongitude !== undefined) {
      updateData.currentLongitude = dto.currentLongitude;
    }

    const updated = await this.prisma.fieldEngineer.update({
      where: { id: engineer.id },
      data: updateData,
    });

    return updated;
  }

  /**
   * Add service log / audit event during on-site visit
   */
  async addServiceLog(dto: AddServiceLogDto, userId: string = 'SYSTEM') {
    const log = await this.prisma.serviceLog.create({
      data: {
        requestId: dto.requestId,
        engineerId: dto.engineerId,
        logType: dto.logType,
        locationCoordinates: dto.locationCoordinates,
        notes: dto.notes,
        partsReplacedJson: dto.partsReplacedJson as any,
      },
    });

    // If log is ARRIVAL_CHECKIN, update engineer status to ON_SITE
    if (dto.logType === 'ARRIVAL_CHECKIN') {
      await this.prisma.fieldEngineer.update({
        where: { id: dto.engineerId },
        data: { currentStatus: EngineerStatus.ON_SITE },
      });

      await this.prisma.serviceRequest.update({
        where: { id: dto.requestId },
        data: { status: 'ON_SITE_DIAGNOSIS' },
      });
    }

    await this.auditLogService.logAction({
      action: AuditAction.FIELD_ENGINEER_DISPATCHED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        logId: log.id,
        requestId: dto.requestId,
        logType: dto.logType,
      },
    });

    return log;
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateServiceRequestDto,
  AssignEngineerDto,
  UpdateServiceRequestStatusDto,
  QueryServiceRequestDto,
} from '../dto/service-request.dto';
import {
  AuditAction,
  AuditSeverity,
  ServiceRequestStatus,
  EngineerStatus,
} from '@prisma/client';

@Injectable()
export class ServiceRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all service requests with filters
   */
  async getRequests(query: QueryServiceRequestDto) {
    const { status, priority, requestType, assignedEngineerId, city, search, limit = 50, offset = 0 } = query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (requestType) {
      where.requestType = requestType;
    }

    if (assignedEngineerId) {
      where.assignedEngineerId = assignedEngineerId;
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { machineModel: { contains: search, mode: 'insensitive' } },
        { reportedFault: { contains: search, mode: 'insensitive' } },
        { machineSerialNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.serviceRequest.count({ where }),
      this.prisma.serviceRequest.findMany({
        where,
        include: {
          assignedEngineer: {
            select: { id: true, employeeCode: true, fullName: true, phone: true, currentStatus: true },
          },
          amcContract: {
            select: { id: true, contractNumber: true, status: true },
          },
          warrantyRecord: {
            select: { id: true, warrantyCardNumber: true, status: true },
          },
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { scheduledDate: 'desc' },
      }),
    ]);

    return { total, items };
  }

  /**
   * Get single service request by ID
   */
  async getRequestById(id: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        assignedEngineer: true,
        amcContract: true,
        warrantyRecord: true,
        logs: {
          orderBy: { timestamp: 'asc' },
        },
        partRequisitions: true,
      },
    });

    if (!request) {
      throw new NotFoundException(`Service request with ID ${id} not found.`);
    }

    return request;
  }

  /**
   * Log a new customer service request or breakdown complaint
   */
  async createRequest(dto: CreateServiceRequestDto, userId: string = 'SYSTEM') {
    const existing = await this.prisma.serviceRequest.findUnique({
      where: { ticketNumber: dto.ticketNumber },
    });

    if (existing) {
      throw new BadRequestException(`Ticket number ${dto.ticketNumber} already exists.`);
    }

    const request = await this.prisma.serviceRequest.create({
      data: {
        ticketNumber: dto.ticketNumber,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        serviceLocation: dto.serviceLocation,
        city: dto.city,
        requestType: dto.requestType,
        priority: dto.priority,
        status: ServiceRequestStatus.LOGGED,
        machineSerialNumber: dto.machineSerialNumber,
        machineModel: dto.machineModel,
        reportedFault: dto.reportedFault,
        amcContractId: dto.amcContractId,
        warrantyRecordId: dto.warrantyRecordId,
        scheduledDate: new Date(dto.scheduledDate),
      },
      include: {
        amcContract: true,
        warrantyRecord: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.SERVICE_REQUEST_CREATED,
      severity: dto.priority === 'CRITICAL_DOWN' ? AuditSeverity.CRITICAL : AuditSeverity.INFO,
      userId,
      details: {
        requestId: request.id,
        ticketNumber: request.ticketNumber,
        customer: request.customerName,
        machineModel: request.machineModel,
        priority: request.priority,
      },
    });

    return request;
  }

  /**
   * Assign or dispatch a field service engineer to a ticket
   */
  async assignEngineer(id: string, dto: AssignEngineerDto, userId: string = 'SYSTEM') {
    const request = await this.getRequestById(id);

    const engineer = await this.prisma.fieldEngineer.findUnique({
      where: { id: dto.assignedEngineerId },
    });

    if (!engineer) {
      throw new NotFoundException(`Field engineer with ID ${dto.assignedEngineerId} not found.`);
    }

    const updateData: any = {
      assignedEngineerId: engineer.id,
      status: ServiceRequestStatus.ASSIGNED,
    };

    if (dto.scheduledDate) {
      updateData.scheduledDate = new Date(dto.scheduledDate);
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id: request.id },
      data: updateData,
      include: {
        assignedEngineer: true,
      },
    });

    // Update engineer status to in transit / scheduled
    await this.prisma.fieldEngineer.update({
      where: { id: engineer.id },
      data: { currentStatus: EngineerStatus.IN_TRANSIT },
    });

    await this.auditLogService.logAction({
      action: AuditAction.SERVICE_REQUEST_ASSIGNED,
      severity: AuditSeverity.INFO,
      userId,
      details: {
        ticketNumber: updated.ticketNumber,
        engineerCode: engineer.employeeCode,
        engineerName: engineer.fullName,
      },
    });

    return updated;
  }

  /**
   * Progress status and sign off on completion
   */
  async updateStatus(id: string, dto: UpdateServiceRequestStatusDto, userId: string = 'SYSTEM') {
    const request = await this.getRequestById(id);

    const updateData: any = {
      status: dto.status,
    };

    if (dto.resolutionSummary) {
      updateData.resolutionSummary = dto.resolutionSummary;
    }

    if (dto.firstTimeFix !== undefined) {
      updateData.firstTimeFix = dto.firstTimeFix;
    }

    if (dto.customerSatisfactionScore !== undefined) {
      updateData.customerSatisfactionScore = dto.customerSatisfactionScore;
    }

    if (dto.customerFeedback) {
      updateData.customerFeedback = dto.customerFeedback;
    }

    if (dto.totalServiceCost !== undefined) {
      updateData.totalServiceCost = dto.totalServiceCost;
    }

    if (dto.status === ServiceRequestStatus.RESOLVED || dto.status === ServiceRequestStatus.CLOSED) {
      updateData.completedAt = dto.completedAt ? new Date(dto.completedAt) : new Date();

      // Free up assigned engineer
      if (request.assignedEngineerId) {
        await this.prisma.fieldEngineer.update({
          where: { id: request.assignedEngineerId },
          data: {
            currentStatus: EngineerStatus.AVAILABLE,
            totalCompletedJobs: { increment: 1 },
          },
        });
      }

      // If tied to AMC Contract, increment consumed visit
      if (request.amcContractId) {
        await this.prisma.aMCContract.update({
          where: { id: request.amcContractId },
          data: { visitsConsumed: { increment: 1 } },
        });
      }
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id: request.id },
      data: updateData,
      include: {
        assignedEngineer: true,
      },
    });

    if (dto.status === ServiceRequestStatus.RESOLVED) {
      await this.auditLogService.logAction({
        action: AuditAction.SERVICE_REQUEST_RESOLVED,
        severity: AuditSeverity.INFO,
        userId,
        details: {
          ticketNumber: updated.ticketNumber,
          firstTimeFix: updated.firstTimeFix,
          csat: updated.customerSatisfactionScore,
        },
      });
    }

    return updated;
  }
}

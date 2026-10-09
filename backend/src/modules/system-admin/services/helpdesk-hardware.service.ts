import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateSupportTicketDto,
  UpdateSupportTicketDto,
  ResolveSupportTicketDto,
} from '../dto/helpdesk-hardware.dto';
import { AuditAction, AuditSeverity, SupportTicketPriority, SupportTicketStatus } from '@prisma/client';

@Injectable()
export class HelpdeskHardwareService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List support tickets with filter
   */
  async getSupportTickets(params?: {
    status?: SupportTicketStatus;
    priority?: SupportTicketPriority;
    category?: string;
  }) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.priority) where.priority = params.priority;
    if (params?.category) where.category = params.category;

    return this.prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!ticket) {
      throw new NotFoundException(`Support ticket ${id} not found`);
    }
    return ticket;
  }

  /**
   * Create a new support ticket
   */
  async createSupportTicket(dto: CreateSupportTicketDto) {
    const ticketCount = await this.prisma.supportTicket.count();
    const ticketNumber = `TCK-2026-0${101 + ticketCount}`;

    return this.prisma.supportTicket.create({
      data: {
        ticketNumber,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        priority: dto.priority || 'MEDIUM',
        status: 'OPEN',
        reportedByName: dto.reportedByName,
        affectedLocation: dto.affectedLocation,
      },
    });
  }

  /**
   * Update support ticket
   */
  async updateSupportTicket(id: string, dto: UpdateSupportTicketDto) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: {
        status: dto.status,
        priority: dto.priority,
        assignedToEngineer: dto.assignedToEngineer,
        resolutionNotes: dto.resolutionNotes,
      },
    });
  }

  /**
   * Resolve support ticket with audit log
   */
  async resolveSupportTicket(dto: ResolveSupportTicketDto, engineerId?: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: dto.ticketId },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${dto.ticketId} not found`);
    }

    const updated = await this.prisma.supportTicket.update({
      where: { id: dto.ticketId },
      data: {
        status: 'RESOLVED',
        resolutionNotes: dto.resolutionNotes,
        assignedToEngineer: dto.resolvedByEngineer,
        resolvedAt: new Date(),
      },
    });

    await this.auditLogService.logAction({
      userId: engineerId || null,
      action: AuditAction.SUPPORT_TICKET_RESOLVED,
      entity: 'SupportTicket',
      entityId: dto.ticketId,
      details: `Resolved ticket ${ticket.ticketNumber} (${ticket.title}) by ${dto.resolvedByEngineer}`,
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Technical helpdesk telemetry
   */
  async getHelpdeskMetrics() {
    const totalTickets = await this.prisma.supportTicket.count();
    const openTickets = await this.prisma.supportTicket.count({
      where: { status: { in: ['OPEN', 'IN_INVESTIGATION'] } },
    });
    const criticalTickets = await this.prisma.supportTicket.count({
      where: { status: { in: ['OPEN', 'IN_INVESTIGATION'] }, priority: 'CRITICAL' },
    });
    const resolvedTickets = await this.prisma.supportTicket.count({
      where: { status: { in: ['RESOLVED', 'CLOSED'] } },
    });

    return {
      totalTickets,
      openTickets,
      criticalTickets,
      resolvedTickets,
      resolutionRate: totalTickets > 0 ? parseFloat(((resolvedTickets / totalTickets) * 100).toFixed(1)) : 100,
      meanTimeToResolutionMinutes: 42,
    };
  }
}

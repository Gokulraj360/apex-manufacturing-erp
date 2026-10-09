import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateLeadDto,
  UpdateLeadStageDto,
  AddLeadNoteDto,
  CreateClientDto,
} from '../dto/lead-pipeline.dto';
import {
  AuditAction,
  AuditSeverity,
  PipelineStage,
  LeadPriority,
} from '@prisma/client';

@Injectable()
export class LeadPipelineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all leads with filters
   */
  async getLeads(query?: {
    stage?: PipelineStage;
    priority?: LeadPriority;
    assignedSalesRep?: string;
    search?: string;
  }) {
    const where: any = {};

    if (query?.stage) {
      where.stage = query.stage;
    }
    if (query?.priority) {
      where.priority = query.priority;
    }
    if (query?.assignedSalesRep) {
      where.assignedSalesRep = { contains: query.assignedSalesRep, mode: 'insensitive' };
    }
    if (query?.search) {
      where.OR = [
        { leadNumber: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { contactPerson: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        quotations: true,
        salesOrders: true,
      },
    });
  }

  /**
   * Get single lead by ID
   */
  async getLeadById(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        client: true,
        quotations: true,
        salesOrders: true,
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  /**
   * Inbound Lead Capture
   */
  async createLead(dto: CreateLeadDto) {
    const count = await this.prisma.lead.count();
    const leadNumber = `LEAD-2026-0${String(count + 1).padStart(3, '0')}`;

    const initialNote = {
      timestamp: new Date().toISOString(),
      author: dto.assignedSalesRep,
      noteText: `Lead created via ${dto.source || 'INBOUND_WEB'}: "${dto.title}"`,
    };

    const created = await this.prisma.lead.create({
      data: {
        leadNumber,
        title: dto.title,
        clientId: dto.clientId || null,
        companyName: dto.companyName,
        contactPerson: dto.contactPerson,
        email: dto.email,
        phone: dto.phone,
        source: (dto.source as any) || 'INBOUND_WEB',
        priority: (dto.priority as any) || 'MEDIUM',
        stage: (dto.stage as any) || 'DISCOVERY',
        estimatedValue: dto.estimatedValue,
        expectedCloseDate: new Date(dto.expectedCloseDate),
        assignedSalesRep: dto.assignedSalesRep,
        technicalRequirementSummary: dto.technicalRequirementSummary,
        notes: [initialNote],
      },
    });

    await this.auditLogService.logAction(
      AuditAction.LEAD_CREATED,
      AuditSeverity.INFO,
      `Inbound lead ${leadNumber} ("${dto.title}") captured for ${dto.companyName} by ${dto.assignedSalesRep}`,
      dto.assignedSalesRep,
      'LeadPipelineService',
      { leadId: created.id, value: dto.estimatedValue, stage: created.stage },
    );

    return created;
  }

  /**
   * Update Sales Pipeline Stage
   */
  async updateLeadStage(id: string, dto: UpdateLeadStageDto) {
    const lead = await this.getLeadById(id);

    const notesHistory = (lead.notes as any[]) || [];
    const stageNote = {
      timestamp: new Date().toISOString(),
      author: dto.updatedBy,
      noteText: `Stage updated from ${lead.stage} to ${dto.stage}. ${dto.stageChangeNote || ''}`.trim(),
    };

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        stage: dto.stage as any,
        notes: [...notesHistory, stageNote],
      },
    });

    await this.auditLogService.logAction(
      AuditAction.LEAD_STAGE_UPDATED,
      AuditSeverity.INFO,
      `Lead ${lead.leadNumber} transitioned to ${dto.stage} by ${dto.updatedBy}`,
      dto.updatedBy,
      'LeadPipelineService',
      { leadId: id, previousStage: lead.stage, newStage: dto.stage },
    );

    return updated;
  }

  /**
   * Add Follow-up Note to Lead History
   */
  async addLeadNote(id: string, dto: AddLeadNoteDto) {
    const lead = await this.getLeadById(id);

    const notesHistory = (lead.notes as any[]) || [];
    const newNote = {
      timestamp: new Date().toISOString(),
      author: dto.author,
      noteText: dto.noteText,
    };

    return this.prisma.lead.update({
      where: { id },
      data: {
        notes: [...notesHistory, newNote],
      },
    });
  }

  /**
   * List Clients Directory
   */
  async getClients(query?: { industry?: string; search?: string }) {
    const where: any = {};

    if (query?.industry) {
      where.industry = { contains: query.industry, mode: 'insensitive' };
    }
    if (query?.search) {
      where.OR = [
        { clientCode: { contains: query.search, mode: 'insensitive' } },
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { primaryContactName: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.clientDirectory.findMany({
      where,
      orderBy: { companyName: 'asc' },
      include: {
        _count: {
          select: {
            salesOrders: true,
            quotations: true,
            inquiries: true,
          },
        },
      },
    });
  }

  /**
   * Create Client Account in Directory
   */
  async createClient(dto: CreateClientDto) {
    const count = await this.prisma.clientDirectory.count();
    const clientCode = `CLI-IND-0${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.clientDirectory.create({
      data: {
        clientCode,
        companyName: dto.companyName,
        industry: dto.industry,
        primaryContactName: dto.primaryContactName,
        email: dto.email,
        phone: dto.phone,
        billingAddress: dto.billingAddress,
        city: dto.city,
        state: dto.state,
        country: dto.country || 'India',
        taxGstin: dto.taxGstin || null,
        creditLimit: dto.creditLimit || 50000,
        paymentTerms: dto.paymentTerms || 'NET_30',
        accountManager: dto.accountManager,
      },
    });

    await this.auditLogService.logAction(
      AuditAction.CLIENT_ACCOUNT_CREATED,
      AuditSeverity.INFO,
      `Client Directory account ${clientCode} established for ${dto.companyName}`,
      dto.accountManager,
      'LeadPipelineService',
      { clientId: created.id, clientCode },
    );

    return created;
  }
}

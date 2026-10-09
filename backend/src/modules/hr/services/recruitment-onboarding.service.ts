import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateJobOpeningDto,
  UpdateJobOpeningDto,
  CreateCandidateDto,
  UpdateCandidateStageDto,
} from '../dto/recruitment.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class RecruitmentOnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all job openings
   */
  async getJobOpenings(departmentId?: string, status?: string) {
    const where: any = {};
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;

    return this.prisma.jobOpening.findMany({
      where,
      include: {
        department: true,
        designation: true,
        _count: {
          select: { candidates: true },
        },
      },
      orderBy: { postedDate: 'desc' },
    });
  }

  /**
   * Get single job opening with candidate pipeline
   */
  async getJobOpeningById(id: string) {
    const job = await this.prisma.jobOpening.findUnique({
      where: { id },
      include: {
        department: true,
        designation: true,
        candidates: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job opening ${id} not found`);
    }

    return job;
  }

  /**
   * Create new job requisition / opening
   */
  async createJobOpening(dto: CreateJobOpeningDto, hrUserId?: string) {
    const existing = await this.prisma.jobOpening.findUnique({
      where: { requisitionNumber: dto.requisitionNumber },
    });
    if (existing) {
      throw new BadRequestException(`Requisition ${dto.requisitionNumber} already exists`);
    }

    return this.prisma.jobOpening.create({
      data: {
        requisitionNumber: dto.requisitionNumber,
        title: dto.title,
        departmentId: dto.departmentId,
        designationId: dto.designationId,
        openingsCount: dto.openingsCount || 1,
        jobDescription: dto.jobDescription,
        requiredExperienceYears: dto.requiredExperienceYears || 2,
        targetClosingDate: dto.targetClosingDate ? new Date(dto.targetClosingDate) : null,
        status: 'OPEN',
      },
      include: {
        department: true,
        designation: true,
      },
    });
  }

  /**
   * Update job opening
   */
  async updateJobOpening(id: string, dto: UpdateJobOpeningDto) {
    const data: any = { ...dto };
    if (dto.targetClosingDate) {
      data.targetClosingDate = new Date(dto.targetClosingDate);
    }

    return this.prisma.jobOpening.update({
      where: { id },
      data,
      include: {
        department: true,
        designation: true,
      },
    });
  }

  /**
   * Register candidate application
   */
  async createCandidate(dto: CreateCandidateDto) {
    return this.prisma.candidateInterview.create({
      data: {
        jobOpeningId: dto.jobOpeningId,
        candidateName: dto.candidateName,
        candidateEmail: dto.candidateEmail,
        candidatePhone: dto.candidatePhone,
        currentEmployer: dto.currentEmployer,
        experienceYears: dto.experienceYears,
        resumeUrl: dto.resumeUrl,
        interviewScheduledAt: dto.interviewScheduledAt ? new Date(dto.interviewScheduledAt) : null,
        currentStage: 'APPLIED',
      },
      include: {
        jobOpening: true,
      },
    });
  }

  /**
   * Update candidate interview stage & score
   */
  async updateCandidateStage(id: string, dto: UpdateCandidateStageDto) {
    const candidate = await this.prisma.candidateInterview.findUnique({
      where: { id },
      include: { jobOpening: true },
    });
    if (!candidate) {
      throw new NotFoundException(`Candidate ${id} not found`);
    }

    const data: any = {
      currentStage: dto.currentStage,
      interviewScore: dto.interviewScore,
      interviewerNotes: dto.interviewerNotes,
      offeredCtc: dto.offeredCtc,
      offerAccepted: dto.offerAccepted,
    };

    if (dto.interviewScheduledAt) {
      data.interviewScheduledAt = new Date(dto.interviewScheduledAt);
    }

    // If stage is HIRED, increment hiredCount on the jobOpening
    if (dto.currentStage === 'HIRED' && candidate.currentStage !== 'HIRED') {
      await this.prisma.jobOpening.update({
        where: { id: candidate.jobOpeningId },
        data: { hiredCount: { increment: 1 } },
      });
    }

    return this.prisma.candidateInterview.update({
      where: { id },
      data,
      include: {
        jobOpening: true,
      },
    });
  }

  /**
   * Get recruitment pipeline metrics
   */
  async getRecruitmentMetrics() {
    const totalOpenings = await this.prisma.jobOpening.count({
      where: { status: 'OPEN' },
    });
    const totalCandidates = await this.prisma.candidateInterview.count();
    const interviewingCount = await this.prisma.candidateInterview.count({
      where: { currentStage: { in: ['SCREENING', 'TECHNICAL', 'HR_INTERVIEW'] } },
    });
    const hiredCount = await this.prisma.candidateInterview.count({
      where: { currentStage: 'HIRED' },
    });

    return {
      totalOpenings,
      totalCandidates,
      interviewingCount,
      hiredCount,
    };
  }
}

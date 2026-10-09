import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateCustomerSurveyDto,
  RecordSurveyResponseDto,
  QuerySurveysDto,
} from '../dto/brand-feedback.dto';
import {
  AuditAction,
  AuditSeverity,
  SurveyTargetAudience,
  SurveyStatus,
} from '@prisma/client';

@Injectable()
export class BrandFeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Retrieve list of customer feedback surveys
   */
  async getSurveys(query?: QuerySurveysDto) {
    const where: any = {};

    if (query?.targetAudience) {
      where.targetAudience = query.targetAudience as SurveyTargetAudience;
    }
    if (query?.status) {
      where.status = query.status as SurveyStatus;
    }
    if (query?.search) {
      where.OR = [
        { surveyCode: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { channel: { contains: query.search, mode: 'insensitive' } },
        { publishedBy: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.customerFeedbackSurvey.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single survey by ID
   */
  async getSurveyById(id: string) {
    const survey = await this.prisma.customerFeedbackSurvey.findUnique({
      where: { id },
    });

    if (!survey) {
      throw new NotFoundException(`Feedback survey '${id}' not found`);
    }

    return survey;
  }

  /**
   * Publish a new feedback survey
   */
  async createSurvey(dto: CreateCustomerSurveyDto) {
    const count = await this.prisma.customerFeedbackSurvey.count();
    const pad = String(count + 1).padStart(4, '0');
    const surveyCode = `SURV-${new Date().getFullYear().toString().slice(-2)}${pad}`;

    const created = await this.prisma.customerFeedbackSurvey.create({
      data: {
        surveyCode,
        title: dto.title,
        targetAudience:
          (dto.targetAudience as SurveyTargetAudience) || SurveyTargetAudience.OEM_CLIENTS,
        channel: dto.channel,
        status: SurveyStatus.PUBLISHED,
        totalResponses: 0,
        averageCSATScore: 5.0, // Initial default baseline
        brandPerceptionScore: 90.0,
        keyStrengths: [],
        improvementAreas: [],
        questionsJson: dto.questions,
        feedbackResponses: [],
        publishedBy: dto.publishedBy,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.BRAND_SURVEY_PUBLISHED,
      severity: AuditSeverity.LOW,
      entityType: 'CustomerFeedbackSurvey',
      entityId: created.id,
      description: `Published feedback survey [${surveyCode}] '${created.title}' for ${created.targetAudience}`,
      userId: dto.publishedBy,
    });

    return created;
  }

  /**
   * Record a respondent's feedback and recalculate CSAT / brand perception scores
   */
  async recordResponse(dto: RecordSurveyResponseDto) {
    const survey = await this.prisma.customerFeedbackSurvey.findUnique({
      where: { id: dto.surveyId },
    });

    if (!survey) {
      throw new NotFoundException(`Feedback survey '${dto.surveyId}' not found`);
    }

    if (survey.status === SurveyStatus.CLOSED) {
      throw new BadRequestException('Cannot submit responses to a closed survey');
    }

    const currentTotal = survey.totalResponses;
    const newTotal = currentTotal + 1;

    // Moving average CSAT
    const currentCsat = Number(survey.averageCSATScore);
    const newCsat = Number(
      (((currentCsat * currentTotal) + dto.csatRating) / newTotal).toFixed(2),
    );

    // Moving average Brand Perception (0 - 100)
    const currentBrand = Number(survey.brandPerceptionScore);
    const newBrand = Number(
      (((currentBrand * currentTotal) + dto.brandPerceptionRating) / newTotal).toFixed(2),
    );

    // Append to feedbackResponses
    const existingResponses = Array.isArray(survey.feedbackResponses)
      ? (survey.feedbackResponses as any[])
      : [];

    const newResponseRecord = {
      responseId: `RESP-${Date.now()}`,
      respondentCompany: dto.respondentCompany || 'Confidential OEM Partner',
      csatRating: dto.csatRating,
      brandPerceptionRating: dto.brandPerceptionRating,
      feedbackText: dto.feedbackText || '',
      submittedAt: new Date().toISOString(),
    };

    const updatedResponses = [newResponseRecord, ...existingResponses];

    // Merge key strengths and improvements
    const updatedStrengths = Array.from(
      new Set([...survey.keyStrengths, ...(dto.keyStrengths || [])]),
    );
    const updatedImprovements = Array.from(
      new Set([...survey.improvementAreas, ...(dto.improvementAreas || [])]),
    );

    const updatedSurvey = await this.prisma.customerFeedbackSurvey.update({
      where: { id: dto.surveyId },
      data: {
        totalResponses: newTotal,
        averageCSATScore: newCsat,
        brandPerceptionScore: newBrand,
        keyStrengths: updatedStrengths,
        improvementAreas: updatedImprovements,
        feedbackResponses: updatedResponses,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.SURVEY_RESPONSE_RECORDED,
      severity: AuditSeverity.LOW,
      entityType: 'CustomerFeedbackSurvey',
      entityId: survey.id,
      description: `Recorded respondent feedback for [${survey.surveyCode}]: CSAT ${dto.csatRating}/5, Brand ${dto.brandPerceptionRating}%`,
      userId: dto.respondentCompany || 'Respondent',
    });

    return updatedSurvey;
  }

  /**
   * Close feedback survey
   */
  async closeSurvey(id: string, closedBy = 'system') {
    const existing = await this.prisma.customerFeedbackSurvey.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Survey '${id}' not found`);
    }

    return this.prisma.customerFeedbackSurvey.update({
      where: { id },
      data: { status: SurveyStatus.CLOSED },
    });
  }

  /**
   * Aggregate brand perception insights
   */
  async getFeedbackSummary() {
    const surveys = await this.prisma.customerFeedbackSurvey.findMany();

    const totalSurveys = surveys.length;
    const totalResponses = surveys.reduce((acc, s) => acc + s.totalResponses, 0);

    const overallCsat =
      totalSurveys > 0
        ? Number(
            (
              surveys.reduce((acc, s) => acc + Number(s.averageCSATScore), 0) / totalSurveys
            ).toFixed(2),
          )
        : 4.8;

    const overallBrandPerception =
      totalSurveys > 0
        ? Number(
            (
              surveys.reduce((acc, s) => acc + Number(s.brandPerceptionScore), 0) /
              totalSurveys
            ).toFixed(1),
          )
        : 88.5;

    // Collect all strengths
    const allStrengths: Record<string, number> = {};
    const allImprovements: Record<string, number> = {};

    for (const s of surveys) {
      s.keyStrengths.forEach((item) => {
        allStrengths[item] = (allStrengths[item] || 0) + 1;
      });
      s.improvementAreas.forEach((item) => {
        allImprovements[item] = (allImprovements[item] || 0) + 1;
      });
    }

    return {
      totalSurveys,
      totalResponses,
      overallCsat,
      overallBrandPerception,
      topStrengths: Object.keys(allStrengths),
      topImprovementAreas: Object.keys(allImprovements),
      recentSurveys: surveys.slice(0, 5),
    };
  }
}

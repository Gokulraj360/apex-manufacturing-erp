import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreatePrototypeTestLogDto,
  QueryPrototypeTestsDto,
} from '../dto/prototype-testing.dto';
import {
  AuditAction,
  AuditSeverity,
  PrototypeTestType,
  PrototypeTestResult,
} from '@prisma/client';

@Injectable()
export class PrototypeTestingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List prototype test logs
   */
  async getTests(query?: QueryPrototypeTestsDto) {
    const where: any = {};

    if (query?.cadModelId) {
      where.cadModelId = query.cadModelId;
    }
    if (query?.testType) {
      where.testType = query.testType as PrototypeTestType;
    }
    if (query?.result) {
      where.result = query.result as PrototypeTestResult;
    }
    if (query?.search) {
      where.OR = [
        { testLogNumber: { contains: query.search, mode: 'insensitive' } },
        { prototypeSerial: { contains: query.search, mode: 'insensitive' } },
        { observedOutcome: { contains: query.search, mode: 'insensitive' } },
        { engineerInCharge: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.prototypeTestLog.findMany({
      where,
      include: {
        cadModel: {
          select: {
            id: true,
            modelCode: true,
            name: true,
            materialSpec: true,
            version: true,
          },
        },
      },
      orderBy: { testedAt: 'desc' },
    });
  }

  /**
   * Get single prototype test by ID
   */
  async getTestById(id: string) {
    const test = await this.prisma.prototypeTestLog.findUnique({
      where: { id },
      include: {
        cadModel: true,
      },
    });

    if (!test) {
      throw new NotFoundException(`Prototype test log '${id}' not found`);
    }

    return test;
  }

  /**
   * Log new Prototype Physical Test or FEA Validation Run
   */
  async createTest(dto: CreatePrototypeTestLogDto) {
    const count = await this.prisma.prototypeTestLog.count();
    const pad = String(count + 1).padStart(4, '0');
    const testLogNumber = `PTL-${new Date().getFullYear().toString().slice(-2)}${pad}`;

    const created = await this.prisma.prototypeTestLog.create({
      data: {
        testLogNumber,
        cadModelId: dto.cadModelId,
        prototypeSerial: dto.prototypeSerial,
        testType: (dto.testType as PrototypeTestType) || PrototypeTestType.STRESS_TEST,
        testParameters: dto.testParameters,
        observedOutcome: dto.observedOutcome,
        result: (dto.result as PrototypeTestResult) || PrototypeTestResult.PASSED,
        maxDeformationMm: dto.maxDeformationMm ?? null,
        yieldSafetyFactor: dto.yieldSafetyFactor ?? null,
        engineerInCharge: dto.engineerInCharge,
        nextIterationRequired: dto.nextIterationRequired ?? false,
      },
      include: {
        cadModel: true,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.PROTOTYPE_TEST_LOGGED,
      severity:
        dto.result === 'FAILED' ? AuditSeverity.HIGH : AuditSeverity.LOW,
      entityType: 'PrototypeTestLog',
      entityId: created.id,
      description: `Logged prototype test [${testLogNumber}] for '${created.cadModel.name}' (${created.testType}: ${created.result})`,
      userId: dto.engineerInCharge,
    });

    return created;
  }

  /**
   * Aggregate prototype testing analytics
   */
  async getTestingSummary() {
    const tests = await this.prisma.prototypeTestLog.findMany();

    const totalTests = tests.length;
    const passedTests = tests.filter((t) => t.result === PrototypeTestResult.PASSED).length;
    const failedTests = tests.filter((t) => t.result === PrototypeTestResult.FAILED).length;
    const conditionalPass = tests.filter(
      (t) => t.result === PrototypeTestResult.CONDITIONAL_PASS,
    ).length;

    const safetyFactors = tests
      .map((t) => Number(t.yieldSafetyFactor || 0))
      .filter((s) => s > 0);
    const avgSafetyFactor =
      safetyFactors.length > 0
        ? Number((safetyFactors.reduce((a, b) => a + b, 0) / safetyFactors.length).toFixed(2))
        : 2.45;

    return {
      totalTests,
      passedTests,
      failedTests,
      conditionalPass,
      avgSafetyFactor,
      passRatePct: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100,
    };
  }
}

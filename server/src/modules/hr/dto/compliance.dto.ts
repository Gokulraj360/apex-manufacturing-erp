import { ComplianceDocumentType } from '@prisma/client';

export class CreateSafetyTrainingDto {
  employeeId!: string;
  trainingProgramName!: string;
  trainerAgency!: string;
  trainingDate!: string;
  validityExpiryDate?: string;
  certificateNumber?: string;
  passedAssessment?: boolean;
  assessmentScore?: number;
  notes?: string;
}

export class CreateLaborComplianceDocDto {
  complianceTitle!: string;
  documentCategory!: ComplianceDocumentType;
  statutoryAuthority!: string;
  filingPeriod!: string;
  filingDate!: string;
  nextRenewalDate?: string;
  acknowledgementNumber?: string;
  documentUrl?: string;
  complianceStatus?: string;
  auditedBy?: string;
}

export class UpdateComplianceStatusDto {
  complianceStatus!: string; // 'COMPLIANT' | 'ACTION_REQUIRED' | 'EXPIRED'
  auditedBy?: string;
  nextRenewalDate?: string;
}

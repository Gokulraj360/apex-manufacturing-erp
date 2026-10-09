import { CandidateInterviewStage, JobOpeningStatus } from '@prisma/client';

export class CreateJobOpeningDto {
  requisitionNumber!: string;
  title!: string;
  departmentId!: string;
  designationId!: string;
  openingsCount?: number;
  jobDescription!: string;
  requiredExperienceYears?: number;
  targetClosingDate?: string;
}

export class UpdateJobOpeningDto {
  title?: string;
  departmentId?: string;
  designationId?: string;
  openingsCount?: number;
  hiredCount?: number;
  jobDescription?: string;
  requiredExperienceYears?: number;
  status?: JobOpeningStatus;
  targetClosingDate?: string;
}

export class CreateCandidateDto {
  jobOpeningId!: string;
  candidateName!: string;
  candidateEmail!: string;
  candidatePhone!: string;
  currentEmployer?: string;
  experienceYears?: number;
  resumeUrl?: string;
  interviewScheduledAt?: string;
}

export class UpdateCandidateStageDto {
  currentStage!: CandidateInterviewStage;
  interviewScore?: number;
  interviewerNotes?: string;
  interviewScheduledAt?: string;
  offeredCtc?: number;
  offerAccepted?: boolean;
}

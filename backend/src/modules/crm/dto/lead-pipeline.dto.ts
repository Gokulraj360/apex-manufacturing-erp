import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min, IsArray } from 'class-validator';

export enum LeadSourceEnum {
  INBOUND_WEB = 'INBOUND_WEB',
  TRADE_SHOW = 'TRADE_SHOW',
  REFERRAL = 'REFERRAL',
  COLD_OUTREACH = 'COLD_OUTREACH',
  PARTNER = 'PARTNER',
  EXISTING_CLIENT = 'EXISTING_CLIENT',
}

export enum LeadPriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum PipelineStageEnum {
  DISCOVERY = 'DISCOVERY',
  TECHNICAL_EVALUATION = 'TECHNICAL_EVALUATION',
  QUOTATION_SUBMITTED = 'QUOTATION_SUBMITTED',
  COMMERCIAL_NEGOTIATION = 'COMMERCIAL_NEGOTIATION',
  CONTRACT_REVIEW = 'CONTRACT_REVIEW',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(LeadSourceEnum)
  @IsOptional()
  source?: LeadSourceEnum;

  @IsEnum(LeadPriorityEnum)
  @IsOptional()
  priority?: LeadPriorityEnum;

  @IsEnum(PipelineStageEnum)
  @IsOptional()
  stage?: PipelineStageEnum;

  @IsNumber()
  @Min(0)
  estimatedValue: number;

  @IsString()
  @IsNotEmpty()
  expectedCloseDate: string;

  @IsString()
  @IsNotEmpty()
  assignedSalesRep: string;

  @IsString()
  @IsNotEmpty()
  technicalRequirementSummary: string;
}

export class UpdateLeadStageDto {
  @IsEnum(PipelineStageEnum)
  stage: PipelineStageEnum;

  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsString()
  @IsOptional()
  stageChangeNote?: string;
}

export class AddLeadNoteDto {
  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  noteText: string;
}

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  primaryContactName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  billingAddress: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  taxGstin?: string;

  @IsNumber()
  @IsOptional()
  creditLimit?: number;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsNotEmpty()
  accountManager: string;
}

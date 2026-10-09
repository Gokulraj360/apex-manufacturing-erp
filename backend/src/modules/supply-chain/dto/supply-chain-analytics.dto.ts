import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import {
  RiskCategory,
  RiskSeverity,
  RiskStatus,
} from '@prisma/client';

export class CreateSupplyRiskLogDto {
  @IsString()
  @IsNotEmpty()
  riskRefNumber: string;

  @IsString()
  @IsOptional()
  vendorId?: string;

  @IsString()
  @IsOptional()
  itemSku?: string;

  @IsEnum(RiskCategory)
  riskCategory: RiskCategory;

  @IsEnum(RiskSeverity)
  severityLevel: RiskSeverity;

  @IsString()
  @IsOptional()
  likelihood?: string = 'POSSIBLE';

  @IsString()
  @IsNotEmpty()
  impactDescription: string;

  @IsString()
  @IsNotEmpty()
  mitigationPlan: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedFinancialExposure?: number = 0;
}

export class UpdateSupplyRiskStatusDto {
  @IsEnum(RiskStatus)
  status: RiskStatus;

  @IsString()
  @IsOptional()
  mitigationUpdate?: string;

  @IsString()
  @IsOptional()
  resolutionNotes?: string;
}

export class QuerySupplyRiskDto {
  @IsOptional()
  @IsEnum(RiskCategory)
  riskCategory?: RiskCategory;

  @IsOptional()
  @IsEnum(RiskSeverity)
  severityLevel?: RiskSeverity;

  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

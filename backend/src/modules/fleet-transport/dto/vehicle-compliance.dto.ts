import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ComplianceDocType, ComplianceDocStatus } from '@prisma/client';

export class CreateComplianceDocDto {
  @IsString()
  vehicleId: string;

  @IsOptional()
  @IsEnum(ComplianceDocType)
  docType?: ComplianceDocType;

  @IsString()
  policyOrCertificateNumber: string;

  @IsString()
  issuingAuthority: string;

  @IsDateString()
  issueDate: string;

  @IsDateString()
  expiryDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  premiumOrFeeAmount?: number;

  @IsOptional()
  @IsEnum(ComplianceDocStatus)
  status?: ComplianceDocStatus;

  @IsOptional()
  @IsString()
  documentUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  renewalAlertDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  managedBy: string;
}

export class UpdateComplianceDocDto {
  @IsOptional()
  @IsEnum(ComplianceDocType)
  docType?: ComplianceDocType;

  @IsOptional()
  @IsString()
  policyOrCertificateNumber?: string;

  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  premiumOrFeeAmount?: number;

  @IsOptional()
  @IsEnum(ComplianceDocStatus)
  status?: ComplianceDocStatus;

  @IsOptional()
  @IsString()
  documentUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  renewalAlertDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryComplianceDocsDto {
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsEnum(ComplianceDocType)
  docType?: ComplianceDocType;

  @IsOptional()
  @IsEnum(ComplianceDocStatus)
  status?: ComplianceDocStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

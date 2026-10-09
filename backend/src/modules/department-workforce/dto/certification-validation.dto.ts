import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class CreateMachineCertificationDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsOptional()
  machineAssetId?: string;

  @IsString()
  @IsNotEmpty()
  machineModel: string; // e.g. "DMG MORI 5-Axis CNC Mill DMU 50"

  @IsString()
  @IsNotEmpty()
  certificationType: string; // e.g. "5-Axis CNC High-Precision Machining"

  @IsString()
  @IsNotEmpty()
  certifyingBody: string; // e.g. "DMG MORI Academy / ISO 45001 Safety Cell"

  @IsString()
  @IsNotEmpty()
  certificationNumber: string;

  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @IsDateString()
  @IsNotEmpty()
  expiryDate: string;

  @IsBoolean()
  @IsOptional()
  isValid?: boolean;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  safetyScore?: number;

  @IsDateString()
  @IsOptional()
  lastIncidentDate?: string;

  @IsString()
  @IsNotEmpty()
  verifiedBy: string;
}

export class ValidateOperatorCertificationDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  machineModel: string;

  @IsString()
  @IsOptional()
  machineAssetId?: string;
}

export class QueryCertificationsDto {
  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  machineModel?: string;

  @IsString()
  @IsOptional()
  isValid?: string;

  @IsString()
  @IsOptional()
  expiringSoon?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

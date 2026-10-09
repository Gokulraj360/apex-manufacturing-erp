import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import {
  AMCContractType,
  AMCContractStatus,
  WarrantyStatus,
} from '@prisma/client';

export class CreateAMCContractDto {
  @IsString()
  @IsNotEmpty()
  contractNumber: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerContact: string;

  @IsString()
  @IsNotEmpty()
  machineModel: string;

  @IsString()
  @IsNotEmpty()
  machineSerialNumber: string;

  @IsEnum(AMCContractType)
  @IsOptional()
  contractType?: AMCContractType = AMCContractType.COMPREHENSIVE;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(0)
  contractValue: number;

  @IsNumber()
  @IsOptional()
  visitsAllowedTotal?: number = 4;

  @IsString()
  @IsOptional()
  termsAndConditions?: string;
}

export class UpdateAMCContractDto {
  @IsEnum(AMCContractStatus)
  @IsOptional()
  status?: AMCContractStatus;

  @IsNumber()
  @IsOptional()
  visitsConsumed?: number;

  @IsString()
  @IsOptional()
  termsAndConditions?: string;
}

export class CreateWarrantyRecordDto {
  @IsString()
  @IsNotEmpty()
  warrantyCardNumber: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  machineModel: string;

  @IsString()
  @IsNotEmpty()
  machineSerialNumber: string;

  @IsDateString()
  dispatchDate: string;

  @IsDateString()
  installationDate: string;

  @IsDateString()
  warrantyEndDate: string;

  @IsString()
  @IsOptional()
  coverageScope?: string = 'Standard 24-Month Comprehensive OEM Warranty';
}

export class QueryAMCDto {
  @IsOptional()
  @IsEnum(AMCContractStatus)
  status?: AMCContractStatus;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

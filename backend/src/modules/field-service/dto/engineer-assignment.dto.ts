import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
} from 'class-validator';
import { EngineerStatus, ServiceLogType } from '@prisma/client';

export class CreateFieldEngineerDto {
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  operatingTerritoryCity: string;

  @IsArray()
  technicalSpecializations: string[];
}

export class UpdateEngineerLocationDto {
  @IsEnum(EngineerStatus)
  currentStatus: EngineerStatus;

  @IsNumber()
  @IsOptional()
  currentLatitude?: number;

  @IsNumber()
  @IsOptional()
  currentLongitude?: number;
}

export class AddServiceLogDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  engineerId: string;

  @IsEnum(ServiceLogType)
  logType: ServiceLogType;

  @IsString()
  @IsOptional()
  locationCoordinates?: string;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsOptional()
  partsReplacedJson?: any;
}

export class QueryFieldEngineerDto {
  @IsOptional()
  @IsEnum(EngineerStatus)
  status?: EngineerStatus;

  @IsOptional()
  @IsString()
  territoryCity?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

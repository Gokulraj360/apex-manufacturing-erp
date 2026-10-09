import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ServiceType, ServiceStatus } from '@prisma/client';

export class CreateServiceLogDto {
  @IsString()
  vehicleId: string;

  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @IsNumber()
  @Min(0)
  odometerAtService: number;

  @IsString()
  serviceCenter: string;

  @IsOptional()
  partsReplaced?: any; // Array of { partName, partCode, qty, unitCost }

  @IsOptional()
  @IsNumber()
  @Min(0)
  laborCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  partsCost?: number;

  @IsNumber()
  @Min(0)
  totalCost: number;

  @IsOptional()
  @IsDateString()
  serviceDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  nextServiceDueKm?: number;

  @IsOptional()
  @IsDateString()
  nextServiceDueDate?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  recordedBy: string;
}

export class UpdateServiceLogDto {
  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  odometerAtService?: number;

  @IsOptional()
  @IsString()
  serviceCenter?: string;

  @IsOptional()
  partsReplaced?: any;

  @IsOptional()
  @IsNumber()
  @Min(0)
  laborCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  partsCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCost?: number;

  @IsOptional()
  @IsDateString()
  serviceDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  nextServiceDueKm?: number;

  @IsOptional()
  @IsDateString()
  nextServiceDueDate?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryServiceLogsDto {
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { AssignmentStatus } from '@prisma/client';

export class CreateTripAssignmentDto {
  @IsString()
  vehicleId: string;

  @IsString()
  driverName: string;

  @IsString()
  driverContact: string;

  @IsString()
  routeTitle: string;

  @IsString()
  originLocation: string;

  @IsString()
  destinationLocation: string;

  @IsString()
  purpose: string; // e.g., 'RAW_MATERIAL_PICKUP', 'FINISHED_GOODS_DELIVERY', 'CLIENT_DISPATCH'

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  startOdometerKm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  endOdometerKm?: number;

  @IsDateString()
  scheduledStart: string;

  @IsOptional()
  @IsDateString()
  actualStart?: string;

  @IsOptional()
  @IsDateString()
  scheduledEnd?: string;

  @IsOptional()
  @IsDateString()
  actualEnd?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cargoWeightKg?: number;

  @IsOptional()
  @IsString()
  linkedDispatchOrderRef?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  dispatchedBy: string;
}

export class UpdateTripAssignmentDto {
  @IsOptional()
  @IsString()
  driverName?: string;

  @IsOptional()
  @IsString()
  driverContact?: string;

  @IsOptional()
  @IsString()
  routeTitle?: string;

  @IsOptional()
  @IsString()
  originLocation?: string;

  @IsOptional()
  @IsString()
  destinationLocation?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  startOdometerKm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  endOdometerKm?: number;

  @IsOptional()
  @IsDateString()
  scheduledStart?: string;

  @IsOptional()
  @IsDateString()
  actualStart?: string;

  @IsOptional()
  @IsDateString()
  scheduledEnd?: string;

  @IsOptional()
  @IsDateString()
  actualEnd?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cargoWeightKg?: number;

  @IsOptional()
  @IsString()
  linkedDispatchOrderRef?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryAssignmentsDto {
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsString()
  driverName?: string;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

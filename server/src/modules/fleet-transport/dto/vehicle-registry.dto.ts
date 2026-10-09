import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { VehicleType, VehicleStatus, FuelType } from '@prisma/client';

export class CreateVehicleDto {
  @IsString()
  vehicleNumber: string;

  @IsOptional()
  @IsString()
  fleetCode?: string;

  @IsString()
  modelName: string;

  @IsString()
  make: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsNumber()
  @Min(0)
  payloadCapacityKg: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalOdometerKm?: number;

  @IsOptional()
  @IsString()
  assignedDriver?: string;

  @IsOptional()
  @IsString()
  fastagTagId?: string;

  @IsOptional()
  @IsString()
  fuelCardNumber?: string;

  @IsOptional()
  @IsString()
  gpsImei?: string;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsDateString()
  insurancePolicyExpiry?: string;

  @IsOptional()
  @IsDateString()
  pucExpiry?: string;

  @IsOptional()
  @IsDateString()
  fitnessExpiry?: string;

  @IsOptional()
  @IsDateString()
  roadTaxExpiry?: string;
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @IsOptional()
  @IsString()
  fleetCode?: string;

  @IsOptional()
  @IsString()
  modelName?: string;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  payloadCapacityKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalOdometerKm?: number;

  @IsOptional()
  @IsString()
  assignedDriver?: string;

  @IsOptional()
  @IsString()
  fastagTagId?: string;

  @IsOptional()
  @IsString()
  fuelCardNumber?: string;

  @IsOptional()
  @IsString()
  gpsImei?: string;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsDateString()
  insurancePolicyExpiry?: string;

  @IsOptional()
  @IsDateString()
  pucExpiry?: string;

  @IsOptional()
  @IsDateString()
  fitnessExpiry?: string;

  @IsOptional()
  @IsDateString()
  roadTaxExpiry?: string;
}

export class QueryVehiclesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsString()
  assignedDriver?: string;
}

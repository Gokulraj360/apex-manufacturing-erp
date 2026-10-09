import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { FuelType } from '@prisma/client';

export class CreateFuelExpenseDto {
  @IsString()
  vehicleId: string;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsNumber()
  @Min(0.01)
  litersOrKwh: number;

  @IsNumber()
  @Min(0.01)
  costPerUnit: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tollCharges?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  otherTravelExpenses?: number;

  @IsNumber()
  @Min(0)
  odometerAtFueling: number;

  @IsString()
  fuelStationName: string;

  @IsOptional()
  @IsString()
  fuelCardTransactionRef?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsDateString()
  fueledAt?: string;

  @IsString()
  recordedBy: string;
}

export class QueryFuelExpensesDto {
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

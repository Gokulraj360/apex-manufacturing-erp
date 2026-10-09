import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
} from 'class-validator';
import { MRPPlanStatus } from '@prisma/client';

export class GrossDemandItemDto {
  @IsString()
  @IsNotEmpty()
  itemSku: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @Min(1)
  requiredQty: number;

  @IsString()
  @IsOptional()
  sourceWorkOrderId?: string;

  @IsDateString()
  requiredDate: string;
}

export class CreateMRPPlanDto {
  @IsString()
  @IsNotEmpty()
  planNumber: string;

  @IsString()
  @IsNotEmpty()
  planName: string;

  @IsNumber()
  @IsOptional()
  planningHorizonWeeks?: number = 12;

  @IsDateString()
  forecastStartDate: string;

  @IsDateString()
  forecastEndDate: string;

  @IsArray()
  @IsOptional()
  grossDemandJson?: GrossDemandItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class RunMRPCalculationDto {
  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsNumber()
  @IsOptional()
  safetyStockMultiplier?: number = 1.2;
}

export class UpdateMRPPlanStatusDto {
  @IsEnum(MRPPlanStatus)
  status: MRPPlanStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class QueryMRPPlanDto {
  @IsOptional()
  @IsEnum(MRPPlanStatus)
  status?: MRPPlanStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

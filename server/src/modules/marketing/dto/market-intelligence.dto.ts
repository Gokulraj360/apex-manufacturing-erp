import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export enum TrendImpactLevelEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class CreateMarketTrendDto {
  @IsString()
  @IsNotEmpty()
  competitorName: string;

  @IsString()
  @IsNotEmpty()
  marketSegment: string;

  @IsNumber()
  @IsOptional()
  observedPricePerUnit?: number;

  @IsNumber()
  @IsOptional()
  ourComparablePrice?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  demandIndex?: number;

  @IsEnum(TrendImpactLevelEnum)
  @IsOptional()
  impactLevel?: TrendImpactLevelEnum;

  @IsString()
  @IsNotEmpty()
  marketObservations: string;

  @IsString()
  @IsOptional()
  recommendedStrategy?: string;

  @IsString()
  @IsNotEmpty()
  recordedBy: string;
}

export class QueryMarketTrendsDto {
  @IsString()
  @IsOptional()
  marketSegment?: string;

  @IsString()
  @IsOptional()
  impactLevel?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

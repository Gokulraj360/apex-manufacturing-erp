import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class ReleaseBlueprintDto {
  @IsString()
  @IsNotEmpty()
  drawingId: string;

  @IsString()
  @IsNotEmpty()
  releasedTo: string; // 'PRODUCTION', 'QC', 'BOTH'

  @IsString()
  @IsNotEmpty()
  approvedBy: string;

  @IsArray()
  @IsOptional()
  criticalDimensions?: any[];

  @IsNumber()
  @IsOptional()
  surfaceFinishRa?: number;
}

export class CreateDesignSpecificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  cadModelId?: string;

  @IsString()
  @IsNotEmpty()
  standardCompliance: string;

  @IsNumber()
  @IsOptional()
  operatingTempMinC?: number;

  @IsNumber()
  @IsOptional()
  operatingTempMaxC?: number;

  @IsNumber()
  @IsOptional()
  tensileStrengthMpa?: number;

  @IsString()
  @IsOptional()
  hardnessRating?: string;

  @IsString()
  @IsOptional()
  coatingRequirements?: string;

  @IsString()
  @IsOptional()
  qualityBenchmarkingNotes?: string;

  @IsString()
  @IsNotEmpty()
  publishedBy: string;
}

export class QuerySpecificationsDto {
  @IsString()
  @IsOptional()
  cadModelId?: string;

  @IsString()
  @IsOptional()
  standardCompliance?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

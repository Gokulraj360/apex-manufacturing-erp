import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
} from 'class-validator';

export enum BOMStatusEnum {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  RELEASED = 'RELEASED',
  OBSOLETE = 'OBSOLETE',
}

export class CreateBOMMasterDto {
  @IsString()
  @IsNotEmpty()
  bomNumber: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  cadModelId?: string;

  @IsString()
  @IsOptional()
  revision?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsArray()
  @IsNotEmpty()
  structureJson: any[];

  @IsString()
  @IsOptional()
  releasedBy?: string;
}

export class UpdateBOMStructureDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  revision?: string;

  @IsEnum(BOMStatusEnum)
  @IsOptional()
  status?: BOMStatusEnum;

  @IsArray()
  @IsOptional()
  structureJson?: any[];

  @IsNumber()
  @IsOptional()
  estimatedTotalCost?: number;

  @IsString()
  @IsOptional()
  releasedBy?: string;
}

export class QueryBOMDto {
  @IsString()
  @IsOptional()
  cadModelId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

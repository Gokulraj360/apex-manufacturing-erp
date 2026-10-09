import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
} from 'class-validator';

export enum DigitalAssetTypeEnum {
  PRODUCT_BROCHURE = 'PRODUCT_BROCHURE',
  TECH_SPEC_SHEET = 'TECH_SPEC_SHEET',
  CAD_CATALOG = 'CAD_CATALOG',
  PROMOTIONAL_VIDEO = 'PROMOTIONAL_VIDEO',
  CASE_STUDY = 'CASE_STUDY',
  BRAND_ASSET = 'BRAND_ASSET',
}

export class CreateDigitalAssetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DigitalAssetTypeEnum)
  @IsOptional()
  type?: DigitalAssetTypeEnum;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  partnerAccessAllowed?: boolean;

  @IsString()
  @IsOptional()
  campaignId?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  uploadedBy: string;
}

export class UpdateDigitalAssetDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  partnerAccessAllowed?: boolean;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class QueryDigitalAssetsDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  campaignId?: string;

  @IsString()
  @IsOptional()
  isPublic?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

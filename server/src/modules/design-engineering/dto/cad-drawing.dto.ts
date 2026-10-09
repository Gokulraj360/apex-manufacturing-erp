import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';

export enum CadFileFormatEnum {
  STEP = 'STEP',
  IGES = 'IGES',
  SLDPRT = 'SLDPRT',
  DWG = 'DWG',
  DXF = 'DXF',
  PARASOLID = 'PARASOLID',
}

export enum CadStatusEnum {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REVISED = 'REVISED',
  OBSOLETE = 'OBSOLETE',
}

export enum DrawingSheetSizeEnum {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4',
}

export enum BlueprintApprovalStatusEnum {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED_FOR_PRODUCTION = 'APPROVED_FOR_PRODUCTION',
  SUPERSEDED = 'SUPERSEDED',
}

export class CreateCadModelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CadFileFormatEnum)
  @IsOptional()
  fileFormat?: CadFileFormatEnum;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsNotEmpty()
  category: string; // 'PART', 'SUB_ASSEMBLY', 'MAIN_ASSEMBLY', 'FIXTURE'

  @IsString()
  @IsOptional()
  materialSpec?: string;

  @IsNumber()
  @IsOptional()
  massKg?: number;

  @IsNumber()
  @IsOptional()
  volumeMm3?: number;

  @IsString()
  @IsNotEmpty()
  author: string;
}

export class UpdateCadModelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CadStatusEnum)
  @IsOptional()
  status?: CadStatusEnum;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  materialSpec?: string;

  @IsNumber()
  @IsOptional()
  massKg?: number;

  @IsNumber()
  @IsOptional()
  volumeMm3?: number;

  @IsString()
  @IsOptional()
  approvedBy?: string;
}

export class CreateTechnicalDrawingDto {
  @IsString()
  @IsNotEmpty()
  drawingNumber: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  cadModelId?: string;

  @IsEnum(DrawingSheetSizeEnum)
  @IsOptional()
  sheetSize?: DrawingSheetSizeEnum;

  @IsString()
  @IsOptional()
  revision?: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsOptional()
  criticalDimensions?: any[];

  @IsString()
  @IsOptional()
  geometricTolerances?: string;

  @IsNumber()
  @IsOptional()
  surfaceFinishRa?: number;

  @IsString()
  @IsNotEmpty()
  drawnBy: string;

  @IsString()
  @IsOptional()
  checkedBy?: string;
}

export class QueryCadModelsDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  fileFormat?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

export class QueryDrawingsDto {
  @IsString()
  @IsOptional()
  cadModelId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  isApprovedForProduction?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

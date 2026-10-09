import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';

export enum ECNChangeReasonEnum {
  DESIGN_OPTIMIZATION = 'DESIGN_OPTIMIZATION',
  DEFECT_FIX = 'DEFECT_FIX',
  MATERIAL_SUBSTITUTION = 'MATERIAL_SUBSTITUTION',
  COST_REDUCTION = 'COST_REDUCTION',
  SUPPLIER_DISCONTINUATION = 'SUPPLIER_DISCONTINUATION',
  CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
}

export enum ECNPriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ECNStatusEnum {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IMPLEMENTED = 'IMPLEMENTED',
}

export class CreateECNDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  cadModelId?: string;

  @IsString()
  @IsOptional()
  drawingId?: string;

  @IsString()
  @IsOptional()
  bomMasterId?: string;

  @IsEnum(ECNChangeReasonEnum)
  @IsOptional()
  reasonForChange?: ECNChangeReasonEnum;

  @IsEnum(ECNPriorityEnum)
  @IsOptional()
  priority?: ECNPriorityEnum;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  changeScope: string;

  @IsString()
  @IsNotEmpty()
  requestedBy: string;

  @IsString()
  @IsOptional()
  implementationTargetDate?: string;

  @IsString()
  @IsOptional()
  inventoryDisposition?: string;

  @IsNumber()
  @IsOptional()
  costImpactEstimate?: number;
}

export class ReviewECNDto {
  @IsEnum(ECNStatusEnum)
  @IsNotEmpty()
  status: ECNStatusEnum;

  @IsString()
  @IsOptional()
  reviewedBy?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsString()
  @IsOptional()
  inventoryDisposition?: string;

  @IsString()
  @IsOptional()
  implementationTargetDate?: string;
}

export class QueryECNDto {
  @IsString()
  @IsOptional()
  cadModelId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  reasonForChange?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

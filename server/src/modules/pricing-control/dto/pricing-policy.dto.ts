import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { PriceType, PriceOverrideStatus, PriceFieldTarget } from '@prisma/client';

export class CheckPricePermissionDto {
  @IsString()
  roleName: string;

  @IsEnum(PriceType)
  priceType: PriceType;

  @IsString()
  action: 'VIEW' | 'EDIT';

  @IsOptional()
  @IsEnum(PriceFieldTarget)
  targetField?: PriceFieldTarget;

  @IsOptional()
  @IsNumber()
  proposedPrice?: number;

  @IsOptional()
  @IsNumber()
  currentPrice?: number;
}

export class CreatePricingPolicyDto {
  @IsString()
  roleName: string;

  @IsEnum(PriceType)
  priceType: PriceType;

  @IsOptional()
  @IsEnum(PriceFieldTarget)
  targetField?: PriceFieldTarget;

  @IsBoolean()
  canView: boolean;

  @IsBoolean()
  canEdit: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxDiscountPct?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minMarginPct?: number;

  @IsOptional()
  @IsBoolean()
  requiresSupervisorOverride?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePriceOverrideRequestDto {
  @IsString()
  targetEntity: string;

  @IsString()
  entityId: string;

  @IsString()
  itemSku: string;

  @IsOptional()
  @IsString()
  itemName?: string;

  @IsEnum(PriceType)
  priceType: PriceType;

  @IsNumber()
  @Min(0)
  currentPrice: number;

  @IsNumber()
  @Min(0)
  requestedPrice: number;

  @IsString()
  justification: string;

  @IsString()
  requestedBy: string;

  @IsString()
  requesterRole: string;
}

export class ReviewOverrideRequestDto {
  @IsEnum(PriceOverrideStatus)
  status: PriceOverrideStatus; // APPROVED or REJECTED

  @IsString()
  reviewedBy: string; // Super Admin or Owner

  @IsOptional()
  @IsString()
  reviewRemarks?: string;
}

export class LogPriceModificationDto {
  @IsString()
  targetEntity: string;

  @IsString()
  entityId: string;

  @IsString()
  itemSku: string;

  @IsEnum(PriceType)
  priceType: PriceType;

  @IsOptional()
  @IsEnum(PriceFieldTarget)
  targetField?: PriceFieldTarget;

  @IsNumber()
  oldPrice: number;

  @IsNumber()
  newPrice: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  modifiedBy: string;

  @IsString()
  userRole: string;

  @IsString()
  justification: string;

  @IsOptional()
  @IsBoolean()
  isOverrideApproved?: boolean;

  @IsOptional()
  @IsString()
  overrideRequestId?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;
}

export class QueryPriceAuditsDto {
  @IsOptional()
  @IsString()
  targetEntity?: string;

  @IsOptional()
  @IsString()
  itemSku?: string;

  @IsOptional()
  @IsEnum(PriceType)
  priceType?: PriceType;

  @IsOptional()
  @IsString()
  userRole?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

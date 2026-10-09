import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { VendorTierRating } from '@prisma/client';

export class CreateVendorDirectoryDto {
  @IsString()
  @IsNotEmpty()
  vendorCode: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  country?: string = 'India';

  @IsString()
  @IsOptional()
  taxIdGstin?: string;

  @IsEnum(VendorTierRating)
  @IsOptional()
  tierRating?: VendorTierRating = VendorTierRating.TIER_2_PREFERRED;

  @IsArray()
  categories: string[];

  @IsNumber()
  @IsOptional()
  leadTimeDaysAvg?: number = 7;

  @IsString()
  @IsOptional()
  paymentTerms?: string = 'NET_30';
}

export class UpdateVendorDirectoryDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsEnum(VendorTierRating)
  @IsOptional()
  tierRating?: VendorTierRating;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsNumber()
  @IsOptional()
  leadTimeDaysAvg?: number;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class EvaluateVendorPerformanceDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  onTimeDeliveryRate: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  qualityScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  costCompetitiveness: number;

  @IsNumber()
  @IsOptional()
  leadTimeDaysAvg?: number;
}

export class QueryVendorDirectoryDto {
  @IsOptional()
  @IsEnum(VendorTierRating)
  tierRating?: VendorTierRating;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

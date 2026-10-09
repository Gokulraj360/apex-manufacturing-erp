import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, Min, IsBoolean } from 'class-validator';

export class CreateMaterialCatalogItemDto {
  @IsString()
  @IsNotEmpty()
  itemSku: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  uom?: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(1)
  standardLeadTimeDays: number;

  @IsNumber()
  @Min(1)
  minimumOrderQty: number;

  @IsArray()
  volumeDiscountTiers: {
    minQty: number;
    maxQty?: number;
    discountPct: number;
    effectiveUnitPrice: number;
  }[];

  @IsArray()
  approvedVendors: {
    vendorId: string;
    vendorName: string;
    vendorSku?: string;
    rank: number;
    preferredTier: string;
  }[];

  @IsOptional()
  specificationsJson?: Record<string, any>;
}

export class UpdateMaterialCatalogItemDto {
  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  standardLeadTimeDays?: number;

  @IsNumber()
  @IsOptional()
  minimumOrderQty?: number;

  @IsArray()
  @IsOptional()
  volumeDiscountTiers?: {
    minQty: number;
    maxQty?: number;
    discountPct: number;
    effectiveUnitPrice: number;
  }[];

  @IsArray()
  @IsOptional()
  approvedVendors?: {
    vendorId: string;
    vendorName: string;
    vendorSku?: string;
    rank: number;
    preferredTier: string;
  }[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateVendorContractTermsDto {
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @IsString()
  @IsOptional()
  materialCatalogId?: string;

  @IsString()
  @IsNotEmpty()
  contractTitle: string;

  @IsString()
  @IsNotEmpty()
  fixedPeriodStart: string;

  @IsString()
  @IsNotEmpty()
  fixedPeriodEnd: string;

  @IsNumber()
  @Min(0)
  agreedUnitPrice: number;

  @IsString()
  @IsNotEmpty()
  priceLockValidUntil: string;

  @IsString()
  @IsOptional()
  rebateTerms?: string;

  @IsNumber()
  @IsOptional()
  minimumAnnualCommitment?: number;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  penaltyClauses?: string;
}

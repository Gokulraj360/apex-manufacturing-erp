import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsNumber, Min } from 'class-validator';

export enum QuotationStatusEnum {
  DRAFT = 'DRAFT',
  PENDING_INTERNAL_REVIEW = 'PENDING_INTERNAL_REVIEW',
  TRANSMITTED_TO_CLIENT = 'TRANSMITTED_TO_CLIENT',
  REVISED = 'REVISED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export class ManufacturingCostBasisItemDto {
  @IsString()
  @IsNotEmpty()
  itemSku: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  rawMaterialCost: number;

  @IsNumber()
  machineHours: number;

  @IsNumber()
  laborCost: number;

  @IsNumber()
  overheadCost: number;

  @IsNumber()
  marginPct: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  qty: number;

  @IsNumber()
  lineTotal: number;
}

export class CreateQuotationDto {
  @IsString()
  @IsOptional()
  leadId?: string;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  clientEmail: string;

  @IsString()
  @IsNotEmpty()
  validUntilDate: string;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  incoterms?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsArray()
  manufacturingCostBasis: ManufacturingCostBasisItemDto[];

  @IsArray()
  lineItems: {
    itemSku: string;
    itemName: string;
    quantity: number;
    uom: string;
    unitPrice: number;
    lineTotal: number;
    technicalDrawingRef?: string;
  }[];

  @IsString()
  @IsNotEmpty()
  preparedBy: string;
}

export class ReviseQuotationDto {
  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsArray()
  manufacturingCostBasis: ManufacturingCostBasisItemDto[];

  @IsArray()
  lineItems: {
    itemSku: string;
    itemName: string;
    quantity: number;
    uom: string;
    unitPrice: number;
    lineTotal: number;
    technicalDrawingRef?: string;
  }[];

  @IsString()
  @IsNotEmpty()
  revisedBy: string;

  @IsString()
  @IsNotEmpty()
  revisionReason: string;
}

export class UpdateQuotationStatusDto {
  @IsEnum(QuotationStatusEnum)
  status: QuotationStatusEnum;

  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

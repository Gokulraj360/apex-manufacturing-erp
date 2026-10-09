import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceLineItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @IsNumber()
  @Min(0.0001)
  billedQuantity: number;

  @IsNumber()
  @Min(0)
  billedUnitRate: number;

  @IsNumber()
  @IsOptional()
  billedGstRate?: number;
}

export class ValidateThreeWayMatchDto {
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsNotEmpty()
  purchaseOrderId: string;

  @IsString()
  @IsOptional()
  grnNumber?: string;

  @IsString()
  @IsOptional()
  invoiceDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineItemDto)
  items: InvoiceLineItemDto[];
}

export class ApproveInvoiceDto {
  @IsString()
  @IsNotEmpty()
  approvedBy: string;

  @IsBoolean()
  @IsOptional()
  generateDebitNoteIfVariance?: boolean;

  @IsBoolean()
  @IsOptional()
  overrideVariance?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CostVarianceQueryDto {
  @IsString()
  @IsOptional()
  finishedItemCode?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

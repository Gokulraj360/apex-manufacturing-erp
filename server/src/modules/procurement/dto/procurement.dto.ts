import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ISSUED = 'ISSUED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export class CreatePurchaseOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitRate: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  gstRate?: number = 18.0;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreatePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  poNumber: string;

  @IsUUID()
  @IsNotEmpty()
  vendorId: string;

  @IsOptional()
  @IsUUID()
  requisitionId?: string;

  @IsDateString()
  expectedDeliveryDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  gstRate?: number = 18.0;

  @IsOptional()
  @IsString()
  paymentTerms?: string = 'NET 30';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemDto)
  items: CreatePurchaseOrderItemDto[];
}

export class UpdatePOStatusDto {
  @IsEnum(PurchaseOrderStatus, {
    message: 'status must be one of: PENDING, APPROVED, ISSUED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED',
  })
  status: PurchaseOrderStatus;
}

export class QueryPODto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;

  @IsOptional()
  @IsUUID()
  vendorId?: string;
}

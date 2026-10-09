import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsNumber, Min, IsBoolean } from 'class-validator';

export enum SalesOrderCRMStatusEnum {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  SCHEDULED_FOR_PRODUCTION = 'SCHEDULED_FOR_PRODUCTION',
  IN_PRODUCTION = 'IN_PRODUCTION',
  DISPATCH_READY = 'DISPATCH_READY',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
}

export class ConvertDealToSalesOrderDto {
  @IsString()
  @IsOptional()
  leadId?: string;

  @IsString()
  @IsOptional()
  quotationId?: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  clientPoNumber: string;

  @IsString()
  @IsNotEmpty()
  targetDeliveryDate: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsArray()
  lineItems: {
    itemSku: string;
    itemName: string;
    orderedQty: number;
    unitPrice: number;
    lineTotal: number;
    productionBatchScheduleId?: string;
  }[];

  @IsBoolean()
  @IsOptional()
  productionScheduleLinked?: boolean;

  @IsString()
  @IsOptional()
  productionWorkOrderRef?: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  salesRep: string;
}

export class UpdateSalesOrderStatusDto {
  @IsEnum(SalesOrderCRMStatusEnum)
  status: SalesOrderCRMStatusEnum;

  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsString()
  @IsOptional()
  productionWorkOrderRef?: string;
}

export class CreateClientContractDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  contractTitle: string;

  @IsString()
  @IsOptional()
  contractType?: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @Min(0)
  committedAnnualRevenue: number;

  @IsArray()
  rateCard: {
    itemSku: string;
    lockedUnitPrice: number;
    minAnnualQty: number;
  }[];

  @IsString()
  @IsOptional()
  penaltyTerms?: string;

  @IsString()
  @IsNotEmpty()
  accountManager: string;
}

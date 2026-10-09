import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsNumber, Min } from 'class-validator';

export enum ProcurementPOStatusEnum {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ISSUED = 'ISSUED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IN_TRANSIT = 'IN_TRANSIT',
  PARTIALLY_DELIVERED = 'PARTIALLY_DELIVERED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
}

export class CreateProcurementPODto {
  @IsString()
  @IsOptional()
  requisitionId?: string;

  @IsString()
  @IsOptional()
  rfqId?: string;

  @IsString()
  @IsOptional()
  supplierBidId?: string;

  @IsString()
  @IsOptional()
  vendorId?: string;

  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @IsString()
  @IsNotEmpty()
  vendorEmail: string;

  @IsString()
  @IsNotEmpty()
  vendorPhone: string;

  @IsString()
  @IsNotEmpty()
  vendorAddress: string;

  @IsString()
  @IsNotEmpty()
  promisedDeliveryDate: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @IsArray()
  items: {
    itemSku: string;
    itemName: string;
    orderedQty: number;
    receivedQty?: number;
    unitPrice: number;
    discountPct?: number;
    lineTotal: number;
    targetDate?: string;
  }[];

  @IsString()
  @IsNotEmpty()
  issuedBy: string;
}

export class ApprovePODto {
  @IsString()
  @IsNotEmpty()
  approvedBy: string;

  @IsString()
  @IsOptional()
  approvalRemarks?: string;
}

export class IssuePODto {
  @IsString()
  @IsNotEmpty()
  issuedBy: string;

  @IsString()
  @IsOptional()
  dispatchNotice?: string;
}

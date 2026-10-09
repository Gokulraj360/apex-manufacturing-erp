import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsNumber, Min } from 'class-validator';

export enum RFQStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  EVALUATION = 'EVALUATION',
  AWARDED = 'AWARDED',
  CANCELLED = 'CANCELLED',
}

export enum BidStatusEnum {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COUNTER_OFFERED = 'COUNTER_OFFERED',
}

export class CreateRFQDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  requisitionId?: string;

  @IsString()
  @IsNotEmpty()
  deadlineDate: string;

  @IsString()
  @IsNotEmpty()
  targetDeliveryDate: string;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  deliveryTerms?: string;

  @IsArray()
  items: {
    itemSku: string;
    itemName: string;
    requiredQty: number;
    uom: string;
    targetPrice?: number;
    technicalSpecs?: string;
  }[];

  @IsArray()
  @IsOptional()
  invitedVendors?: {
    vendorId: string;
    vendorName: string;
    email: string;
  }[];

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class SubmitSupplierBidDto {
  @IsString()
  @IsNotEmpty()
  rfqId: string;

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

  @IsNumber()
  @Min(0)
  bidAmountTotal: number;

  @IsArray()
  quotedItems: {
    itemSku: string;
    itemName: string;
    offeredQty: number;
    unitPrice: number;
    lineTotal: number;
    leadTimeDays: number;
    complianceNotes?: string;
  }[];

  @IsString()
  @IsOptional()
  paymentTermsOffered?: string;

  @IsString()
  @IsNotEmpty()
  validUntilDate: string;

  @IsString()
  @IsOptional()
  negotiationNotes?: string;
}

export class EvaluateBidDto {
  @IsNumber()
  @Min(0)
  evaluationScore: number; // e.g. 95.5

  @IsEnum(BidStatusEnum)
  status: BidStatusEnum;

  @IsString()
  @IsOptional()
  negotiationNotes?: string;
}

export class AwardRFQDto {
  @IsString()
  @IsNotEmpty()
  selectedBidId: string;

  @IsString()
  @IsNotEmpty()
  awardedBy: string;

  @IsString()
  @IsOptional()
  awardRemarks?: string;
}

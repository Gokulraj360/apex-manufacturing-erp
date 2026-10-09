import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsNumber, Min } from 'class-validator';

export enum RequisitionPriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum RequisitionStatusEnum {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PO_CONVERTED = 'PO_CONVERTED',
}

export class CreateRequisitionDto {
  @IsString()
  @IsNotEmpty()
  requestedBy: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  requiredByDate: string;

  @IsEnum(RequisitionPriorityEnum)
  @IsOptional()
  priority?: RequisitionPriorityEnum;

  @IsNumber()
  @Min(0)
  totalEstimatedCost: number;

  @IsString()
  @IsNotEmpty()
  justification: string;

  @IsArray()
  items: {
    itemSku: string;
    itemName: string;
    quantity: number;
    uom: string;
    estimatedUnitPrice: number;
    preferredVendorId?: string;
  }[];
}

export class ReviewRequisitionDto {
  @IsString()
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED';

  @IsString()
  @IsNotEmpty()
  reviewedBy: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class ConvertPRToPODto {
  @IsString()
  @IsNotEmpty()
  vendorId: string;

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
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @IsString()
  @IsNotEmpty()
  issuedBy: string;
}

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
} from 'class-validator';
import {
  RequisitionPriority,
  RequisitionStatus,
  SupplyPOStatus,
} from '@prisma/client';

export class RequisitionLineItemDto {
  @IsString()
  @IsNotEmpty()
  itemSku: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  uom: string;

  @IsNumber()
  @Min(0)
  estimatedUnitPrice: number;

  @IsString()
  @IsOptional()
  preferredVendorId?: string;
}

export class CreatePurchaseRequisitionDto {
  @IsString()
  @IsNotEmpty()
  requisitionNumber: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsDateString()
  requiredByDate: string;

  @IsEnum(RequisitionPriority)
  @IsOptional()
  priority?: RequisitionPriority = RequisitionPriority.MEDIUM;

  @IsString()
  @IsNotEmpty()
  justification: string;

  @IsArray()
  items: RequisitionLineItemDto[];
}

export class ApproveRejectRequisitionDto {
  @IsEnum(RequisitionStatus)
  status: RequisitionStatus; // APPROVED or REJECTED

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class POLineItemDto {
  @IsString()
  @IsNotEmpty()
  itemSku: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @Min(1)
  orderedQty: number;

  @IsNumber()
  @IsOptional()
  receivedQty?: number = 0;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  lineTotal: number;
}

export class CreatePurchaseOrderSupplyDto {
  @IsString()
  @IsNotEmpty()
  poNumber: string;

  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsOptional()
  requisitionId?: string;

  @IsDateString()
  expectedDeliveryDate: string;

  @IsString()
  @IsOptional()
  paymentTerms?: string = 'NET_30';

  @IsString()
  @IsOptional()
  incoterms?: string = 'FOB';

  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsArray()
  items: POLineItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSupplyPOStatusDto {
  @IsEnum(SupplyPOStatus)
  status: SupplyPOStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  acknowledgedBy?: string;

  @IsDateString()
  @IsOptional()
  actualDeliveryDate?: string;
}

export class QueryProcurementDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

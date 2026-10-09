import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum InspectionDisposition {
  ACCEPTED = 'ACCEPTED',
  PARTIALLY_ACCEPTED = 'PARTIALLY_ACCEPTED',
  REJECTED = 'REJECTED',
  QUARANTINED = 'QUARANTINED',
}

export enum RejectionReason {
  DIMENSIONAL_OUT_OF_TOLERANCE = 'DIMENSIONAL_OUT_OF_TOLERANCE',
  SURFACE_DEFECT = 'SURFACE_DEFECT',
  WRONG_GRADE_CHEMISTRY = 'WRONG_GRADE_CHEMISTRY',
  CRACK_BURR = 'CRACK_BURR',
  CONTAMINATION = 'CONTAMINATION',
  DOCUMENTATION_MISSING = 'DOCUMENTATION_MISSING',
  TRANSIT_DAMAGE = 'TRANSIT_DAMAGE',
  OTHER = 'OTHER',
}

export class CreateInwardInspectionDto {
  @IsString()
  @IsOptional()
  mirNumber?: string;

  @IsUUID('4')
  @IsOptional()
  purchaseOrderId?: string;

  @IsUUID('4')
  @IsNotEmpty({ message: 'Item ID is required' })
  itemId: string;

  @IsString()
  @IsNotEmpty({ message: 'Batch/Lot number is required' })
  batchNumber: string;

  @IsString()
  @IsOptional()
  heatNumber?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'Inspected quantity must be positive' })
  inspectedQty: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Passed quantity cannot be negative' })
  passedQty: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Rejected quantity cannot be negative' })
  rejectedQty: number;

  @IsString()
  @IsOptional()
  uom?: string;

  @IsEnum(InspectionDisposition)
  @IsOptional()
  disposition?: InspectionDisposition;

  @IsEnum(RejectionReason)
  @IsOptional()
  rejectionReason?: RejectionReason;

  @IsString()
  @IsOptional()
  defectDetails?: string;

  @IsOptional()
  specsComparison?: Record<string, any>;

  @IsString()
  @IsOptional()
  inspectorName?: string;

  @IsString()
  @IsOptional()
  quarantineLocation?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class QueryInspectionDto {
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(InspectionDisposition)
  @IsOptional()
  disposition?: InspectionDisposition;

  get skip(): number {
    return ((this.page || 1) - 1) * (this.limit || 20);
  }
}

export enum FinalQCStatus {
  PASSED = 'PASSED',
  REJECTED = 'REJECTED',
  CONDITIONAL = 'CONDITIONAL',
}

export class CreateFinalQCInspectionDto {
  @IsUUID('4')
  @IsNotEmpty({ message: 'Item ID is required' })
  itemId: string;

  @IsString()
  @IsOptional()
  jobCardId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Batch number is required' })
  batchNumber: string;

  @IsString()
  @IsOptional()
  heatNumber?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  inspectedQty: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  passedQty: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rejectedQty: number;

  @IsString()
  @IsOptional()
  uom?: string = 'PCS';

  @IsEnum(FinalQCStatus)
  @IsOptional()
  status?: FinalQCStatus = FinalQCStatus.PASSED;

  @IsOptional()
  checklist?: Record<string, any>;

  @IsString()
  @IsOptional()
  targetWarehouseBin?: string = 'C-01-B1';

  @IsOptional()
  stockUpdatedToFG?: boolean = true;

  @IsString()
  @IsOptional()
  inspectorName?: string = 'QC Lead V. Sharma';

  @IsString()
  @IsOptional()
  notes?: string;
}


export enum FinalQCStatus {
  PASSED = 'PASSED',
  REJECTED = 'REJECTED',
  CONDITIONAL = 'CONDITIONAL',
}

export class CreateFinalQCInspectionDto {
  @IsUUID('4')
  @IsNotEmpty({ message: 'Item ID is required' })
  itemId: string;

  @IsString()
  @IsOptional()
  jobCardId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Batch number is required' })
  batchNumber: string;

  @IsString()
  @IsOptional()
  heatNumber?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  inspectedQty: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  passedQty: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rejectedQty: number;

  @IsString()
  @IsOptional()
  uom?: string = 'PCS';

  @IsEnum(FinalQCStatus)
  @IsOptional()
  status?: FinalQCStatus = FinalQCStatus.PASSED;

  @IsOptional()
  checklist?: Record<string, any>;

  @IsString()
  @IsOptional()
  targetWarehouseBin?: string = 'C-01-B1';

  @IsOptional()
  stockUpdatedToFG?: boolean = true;

  @IsString()
  @IsOptional()
  inspectorName?: string = 'QC Lead V. Sharma';

  @IsString()
  @IsOptional()
  notes?: string;
}


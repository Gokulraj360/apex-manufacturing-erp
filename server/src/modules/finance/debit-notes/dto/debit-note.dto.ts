import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateDebitNoteDto {
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsOptional()
  vendorName?: string;

  @IsString()
  @IsNotEmpty()
  lotRef: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  rtvChallanNo?: string;

  @IsString()
  @IsOptional()
  poNumber?: string;

  @IsString()
  @IsOptional()
  itemId?: string;

  @IsString()
  @IsOptional()
  itemName?: string;

  @IsNumber()
  @IsOptional()
  rejectedQty?: number;

  @IsString()
  @IsOptional()
  uom?: string;

  @IsString()
  @IsOptional()
  quarantineLocation?: string;

  @IsString()
  @IsOptional()
  apDeductionStatus?: string;
}

export class RejectLotTriggerDto {
  @IsString()
  @IsNotEmpty()
  lotRef: string;

  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @IsString()
  @IsOptional()
  itemId?: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsOptional()
  poNumber?: string;

  @IsNumber()
  @Min(0.01)
  rejectedQty: number;

  @IsNumber()
  @Min(0.01)
  unitRate: number;

  @IsString()
  @IsOptional()
  uom?: string;

  @IsString()
  @IsNotEmpty()
  rejectionReason: string;

  @IsString()
  @IsOptional()
  defectDetails?: string;

  @IsString()
  @IsOptional()
  quarantineLocation?: string;

  @IsString()
  @IsOptional()
  inspectorName?: string;
}

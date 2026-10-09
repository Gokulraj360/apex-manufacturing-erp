import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum DispatchStatus {
  DRAFT = 'DRAFT',
  PACKING = 'PACKING',
  READY_FOR_DISPATCH = 'READY_FOR_DISPATCH',
  GATE_NOTIFIED = 'GATE_NOTIFIED',
  TARE_PENDING = 'TARE_PENDING',
  DISPATCHED = 'DISPATCHED',
  CANCELLED = 'CANCELLED',
}

export class CreateDispatchCartonDto {
  @IsNotEmpty()
  @IsString()
  cartonNumber: string;

  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  batchNumber: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsString()
  uom: string = 'PCS';

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  grossWeightKg: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  netWeightKg: number;

  @IsOptional()
  @IsString()
  barcode?: string;
}

export class CreateDispatchOrderDto {
  @IsOptional()
  @IsString()
  salesOrderId?: string;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerPo?: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsOptional()
  @IsString()
  transporterName?: string;

  @IsNotEmpty()
  @IsString()
  vehicleNumber: string;

  @IsNotEmpty()
  @IsString()
  driverName: string;

  @IsOptional()
  @IsString()
  driverPhone?: string;

  @IsOptional()
  @IsString()
  ewayBillNumber?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDispatchCartonDto)
  cartons: CreateDispatchCartonDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SignOffDispatchDto {
  @IsOptional()
  @IsString()
  signedOffBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  gateNumber?: string = 'Gate 2 (South Logistics)';
}

export class QueryDispatchDto {
  @IsOptional()
  @IsEnum(DispatchStatus)
  status?: DispatchStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

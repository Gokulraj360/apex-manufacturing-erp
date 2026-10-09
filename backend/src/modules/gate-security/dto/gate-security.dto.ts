import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum GatePassType {
  INWARD_PURCHASE = 'INWARD_PURCHASE',
  OUTWARD_DISPATCH = 'OUTWARD_DISPATCH',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
  MAINTENANCE_RETURNABLE = 'MAINTENANCE_RETURNABLE',
}

export enum GatePassStatus {
  INSIDE_PLANT = 'INSIDE_PLANT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateInwardGatePassDto {
  @IsString()
  @IsOptional()
  passNumber?: string;

  @IsEnum(GatePassType)
  @IsOptional()
  passType?: GatePassType;

  @IsString()
  @IsNotEmpty({ message: 'Vehicle registration number is required' })
  vehicleNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Driver name is required' })
  driverName: string;

  @IsString()
  @IsOptional()
  driverPhone?: string;

  @IsString()
  @IsOptional()
  driverLicense?: string;

  @IsString()
  @IsOptional()
  transporterName?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Gross weight must be a valid number' })
  @Min(1, { message: 'Gross weight must be greater than 0 kg' })
  grossWeightKg: number;

  @IsUUID('4', { message: 'Invalid Purchase Order ID' })
  @IsOptional()
  purchaseOrderId?: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsString()
  @IsOptional()
  ewayBillNumber?: string;

  @IsString()
  @IsOptional()
  gateNumber?: string;

  @IsString()
  @IsOptional()
  securityOfficer?: string;

  @IsString()
  @IsOptional()
  securityRemarks?: string;
}

export class CaptureOutwardTareDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Tare weight must be a valid number' })
  @Min(0, { message: 'Tare weight must be greater than or equal to 0 kg' })
  tareWeightKg: number;

  @IsString()
  @IsOptional()
  securityOfficer?: string;

  @IsString()
  @IsOptional()
  securityRemarks?: string;
}

export class QueryGatePassDto {
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(GatePassStatus)
  @IsOptional()
  status?: GatePassStatus;

  @IsEnum(GatePassType)
  @IsOptional()
  passType?: GatePassType;

  get skip(): number {
    return ((this.page || 1) - 1) * (this.limit || 20);
  }
}

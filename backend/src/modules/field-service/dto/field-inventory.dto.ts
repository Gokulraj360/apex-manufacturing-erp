import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { FieldPartRequisitionStatus } from '@prisma/client';

export class CreateVanStockDto {
  @IsString()
  @IsNotEmpty()
  engineerId: string;

  @IsString()
  @IsNotEmpty()
  itemSku: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @Min(0)
  quantityOnHand: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  minimumThreshold?: number = 2;

  @IsNumber()
  @Min(0)
  unitValue: number;

  @IsString()
  @IsOptional()
  binOrCrateLocation?: string;
}

export class UpdateVanStockQuantityDto {
  @IsString()
  @IsNotEmpty()
  engineerId: string;

  @IsString()
  @IsNotEmpty()
  itemSku: string;

  @IsNumber()
  quantityDelta: number; // positive for replenish, negative for consumed

  @IsString()
  @IsOptional()
  reason?: string;
}

export class CreateFieldPartRequisitionDto {
  @IsString()
  @IsNotEmpty()
  requisitionNumber: string;

  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  engineerId: string;

  @IsString()
  @IsNotEmpty()
  itemSku: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @Min(1)
  quantityRequested: number;

  @IsString()
  @IsOptional()
  defectivePartSerialNumber?: string;
}

export class UpdatePartRequisitionStatusDto {
  @IsEnum(FieldPartRequisitionStatus)
  status: FieldPartRequisitionStatus;

  @IsBoolean()
  @IsOptional()
  isDefectiveReturned?: boolean;

  @IsString()
  @IsOptional()
  defectivePartSerialNumber?: string;
}

export class QueryVanStockDto {
  @IsOptional()
  @IsString()
  engineerId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

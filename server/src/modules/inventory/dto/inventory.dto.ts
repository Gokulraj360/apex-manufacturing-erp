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

export enum WarehouseZone {
  ZONE_A_RAW_METALS = 'ZONE_A_RAW_METALS',
  ZONE_B_TOOLING = 'ZONE_B_TOOLING',
  ZONE_C_CLEANROOM = 'ZONE_C_CLEANROOM',
  ZONE_D_FASTENERS = 'ZONE_D_FASTENERS',
  ZONE_Q_QUARANTINE = 'ZONE_Q_QUARANTINE',
}

export class AllocatePutawayDto {
  @IsString()
  @IsNotEmpty({ message: 'Target Bin Code is required' })
  binCode: string;

  @IsUUID('4', { message: 'Item ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Item ID is required' })
  itemId: string;

  @IsString()
  @IsNotEmpty({ message: 'Batch / Lot Number is required' })
  batchNumber: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'Allocated putaway quantity must be positive' })
  quantity: number;

  @IsString()
  @IsOptional()
  uom?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class QueryWarehouseBinDto {
  @IsEnum(WarehouseZone)
  @IsOptional()
  zone?: WarehouseZone;

  @IsString()
  @IsOptional()
  search?: string;
}

export class CreateInventoryItemDto {
  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  uom?: string = 'PCS';

  @IsNumber()
  @IsPositive()
  standardCost: number;

  @IsOptional()
  @IsNumber()
  sellingPrice?: number;

  @IsOptional()
  @IsString()
  hsnCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  initialStock?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  safetyStock?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderPoint?: number = 0;

  @IsOptional()
  @IsString()
  warehouseLocation?: string;

  @IsOptional()
  customAttrs?: Record<string, any>;
}

export class CreateStockMovementDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  movementType: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  sourceLocation?: string;

  @IsOptional()
  @IsString()
  targetLocation?: string;

  @IsOptional()
  @IsString()
  workOrderId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

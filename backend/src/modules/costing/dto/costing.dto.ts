import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCostingParametersDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  targetSellingPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  monthlyProductionTargetVolume?: number;
}

export class ComponentRateItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @Min(0)
  costPerPiece: number;
}

export class BatchUpdateComponentRatesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentRateItemDto)
  rates: ComponentRateItemDto[];
}

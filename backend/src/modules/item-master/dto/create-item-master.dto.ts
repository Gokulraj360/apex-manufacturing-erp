import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ItemType } from '../../../common/enums/item-type.enum';

export class CreateItemMasterDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ItemType, {
    message: 'category must be one of: RAW_MATERIAL, WIP, FINISHED_GOOD, CONSUMABLE, SCRAP',
  })
  category: ItemType;

  @IsString()
  @IsNotEmpty()
  uom: string;

  @IsOptional()
  @IsObject()
  customAttrs?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  currentStock?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minStockQty?: number = 0;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

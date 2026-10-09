import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateBOMItemDto {
  @IsUUID()
  @IsNotEmpty()
  componentItemId: string;

  @IsOptional()
  @IsUUID()
  subBomId?: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  scrapRate?: number = 0;

  @IsOptional()
  @IsString()
  uom?: string = 'PCS';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateBOMDto {
  @IsString()
  @IsNotEmpty()
  bomNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  version?: string = '1.0';

  @IsUUID()
  @IsNotEmpty()
  finishedItemId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  level?: number = 1;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBOMItemDto)
  components: CreateBOMItemDto[];
}

export class UpdateBOMDto extends PartialType(CreateBOMDto) {}

export class AddBOMItemDto {
  @IsUUID()
  @IsNotEmpty()
  componentItemId: string;

  @IsOptional()
  @IsUUID()
  subBomId?: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  scrapRate?: number = 0;

  @IsOptional()
  @IsString()
  uom?: string = 'PCS';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBOMItemDto extends PartialType(AddBOMItemDto) {}

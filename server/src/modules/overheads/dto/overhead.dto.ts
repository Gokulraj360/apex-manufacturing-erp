import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ExpenseCategory } from '@prisma/client';

export class CreateOverheadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsNumber()
  @Min(0)
  monthlyAmount: number;

  @IsOptional()
  @IsString()
  iconKey?: string;
}

export class UpdateOverheadDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyAmount?: number;

  @IsOptional()
  @IsString()
  iconKey?: string;
}

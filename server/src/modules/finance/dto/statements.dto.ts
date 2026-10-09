import {
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum StatementCategoryEnum {
  ALL = 'ALL',
  INFLOW_CREDIT = 'INFLOW_CREDIT',
  OUTFLOW_DEBIT = 'OUTFLOW_DEBIT',
}

export class QueryStatementsDto {
  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsEnum(StatementCategoryEnum)
  @IsOptional()
  category?: StatementCategoryEnum = StatementCategoryEnum.ALL;

  @IsString()
  @IsOptional()
  search?: string;
}

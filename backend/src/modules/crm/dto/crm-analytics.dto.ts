import { IsString, IsOptional } from 'class-validator';

export class CRMAnalyticsFilterDto {
  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  salesRep?: string;

  @IsString()
  @IsOptional()
  industry?: string;
}

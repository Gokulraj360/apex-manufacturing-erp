import { IsOptional, IsString } from 'class-validator';

export class QueryFieldAnalyticsDto {
  @IsOptional()
  @IsString()
  territoryCity?: string;

  @IsOptional()
  @IsString()
  timeRange?: string; // e.g. 'THIS_MONTH', 'LAST_30_DAYS', 'Q3_2026'
}

import { IsNumber, IsOptional, Min } from 'class-validator';

export class FeedPriceStockDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerPiece?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQty?: number;

  @IsOptional()
  @IsNumber()
  quickAdjustDelta?: number;
}

export class ReleaseBatchDto {
  @IsOptional()
  @IsNumber()
  batchQuantity?: number;

  @IsOptional()
  notes?: string;
}

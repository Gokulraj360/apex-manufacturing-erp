export interface CycleCountLineDto {
  itemCode: string;
  itemName: string;
  systemQuantity: number;
  physicalCount: number;
}

export interface SubmitCycleCountDto {
  zone: string;
  itemsCounted: CycleCountLineDto[];
  notes?: string;
}

export interface LogDamagedItemDto {
  itemCode: string;
  damagedQuantity: number;
  damageReason: string;
  financialLoss?: number;
  binLocation?: string;
}

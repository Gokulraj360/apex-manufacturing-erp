export interface CreateFinishedGoodsBayDto {
  bayCode: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  capacityUnits: number;
}

export interface PutawayFinishedGoodsDto {
  itemCode: string;
  itemName: string;
  lotBatchNumber: string;
  quantityUnits: number;
  unitValuation: number;
  bayCode: string;
  isReserved?: boolean;
}

export interface AdjustFinishedGoodsStockDto {
  bayCode: string;
  newOccupiedUnits: number;
  reason: string;
}

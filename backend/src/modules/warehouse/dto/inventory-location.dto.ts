import { StockCategory } from '@prisma/client';

export interface CreateBinLocationDto {
  binCode: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  capacityMaxUnits?: number;
  isQuarantine?: boolean;
}

export interface CreateWarehouseStockDto {
  itemCode: string;
  itemName: string;
  category: StockCategory;
  currentQuantity: number;
  reorderThreshold: number;
  reorderQuantity?: number;
  unitOfMeasure: string;
  unitValuation: number;
  binLocationId?: string;
  lotBatchNumber?: string;
}

export interface AdjustStockLevelDto {
  itemCode: string;
  quantityDelta: number; // positive = increment, negative = decrement
  reason: 'CYCLE_COUNT_VARIANCE' | 'SCRAP_WRITE_OFF' | 'DAMAGED_TRANSIT' | 'SUPPLIER_SHORTAGE_CORRECTION' | 'INTERNAL_RECLASSIFICATION';
  notes?: string;
}

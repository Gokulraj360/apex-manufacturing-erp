export interface PickListItemDto {
  itemCode: string;
  itemName: string;
  requestedQty: number;
  pickedQty: number;
  sourceBay: string;
  lotNumber: string;
}

export interface CreateSalesOrderFulfillmentDto {
  salesOrderNumber: string;
  customerName: string;
  assignedPicker: string;
  stagingBay: string;
  targetDeliveryDate: Date | string;
  itemsToPick: PickListItemDto[];
}

export interface UpdatePickingProgressDto {
  status: 'QUEUED' | 'PICKING' | 'STAGED' | 'LOADED' | 'CANCELLED';
  stagingBay?: string;
  verifiedBy?: string;
  itemsPicked?: PickListItemDto[];
}

import { ChallanStatus } from '@prisma/client';

export interface DispatchedItemDto {
  itemCode: string;
  itemName: string;
  quantityDispatched: number;
  uom: string;
  serialLots?: string;
}

export interface CreateDeliveryChallanDto {
  clientName: string;
  salesOrderRef: string;
  carrierName: string;
  vehicleNumber?: string;
  trackingNumber?: string;
  driverContact?: string;
  dispatchedItems: DispatchedItemDto[];
  totalWeightKg?: number;
}

export interface UpdateChallanStatusDto {
  challanNumber: string;
  status: ChallanStatus;
}

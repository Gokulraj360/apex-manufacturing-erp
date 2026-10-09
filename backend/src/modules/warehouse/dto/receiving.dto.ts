export interface ReceivedItemDto {
  itemCode: string;
  itemName: string;
  quantityOrdered: number;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  uom: string;
  rejectionReason?: string;
  targetBinCode?: string;
}

export interface CreateGrnDto {
  poNumber: string;
  supplierName: string;
  itemsReceived: ReceivedItemDto[];
  storageBinCode?: string;
  vendorDeliveryChallan?: string;
  inspectionPassed: boolean;
  remarks?: string;
}

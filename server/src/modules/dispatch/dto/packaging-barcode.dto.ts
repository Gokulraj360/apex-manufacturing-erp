export interface CreatePackedCartonDto {
  salesOrderRef?: string;
  itemCode: string;
  itemName: string;
  lotBatchNumber: string;
  quantityUnits: number;
  grossWeightKg: number;
  dimensions: string;
  sealedBy: string;
  stagingBay?: string;
  barcodeSymbology?: 'GS1_128' | 'CODE_128' | 'QR_CODE' | 'DATA_MATRIX';
}

export interface GenerateBarcodeDto {
  skuCode: string;
  batchNumber: string;
  serialNumber: string;
  symbology: 'GS1_128' | 'CODE_128' | 'QR_CODE' | 'DATA_MATRIX';
}

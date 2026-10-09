export interface MaterialIssuanceLineDto {
  itemCode: string;
  quantityIssued: number;
  sourceBinCode?: string;
  lotNumber?: string;
}

export interface IssueMaterialsToProductionDto {
  requisitionNumber: string;
  workOrderNumber: string;
  issuedTo: string;
  items: MaterialIssuanceLineDto[];
}

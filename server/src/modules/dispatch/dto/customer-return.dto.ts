export interface CreateCustomerReturnDto {
  salesOrderRef: string;
  deliveryChallanRef?: string;
  customerName: string;
  itemCode: string;
  itemName: string;
  returnedQuantity: number;
  returnReason: string;
  disposition?: 'RESTOCK' | 'REWORK' | 'SCRAP' | 'UNDER_INSPECTION';
  replacementOrderRef?: string;
  inspectedBy: string;
  resolutionNotes?: string;
}

export interface UpdateReturnDispositionDto {
  disposition: 'RESTOCK' | 'REWORK' | 'SCRAP' | 'UNDER_INSPECTION';
  resolutionNotes: string;
  replacementOrderRef?: string;
}

export interface LogTransitDamageDto {
  shipmentNumber: string;
  carrierName: string;
  itemCode: string;
  damagedQuantity: number;
  lossAmount: number;
  carrierLiabilityAccepted: boolean;
  insuranceClaimNumber?: string;
  damageDescription: string;
  loggedBy: string;
}

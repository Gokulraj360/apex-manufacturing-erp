export interface RequisitionItemDto {
  partNumber: string;
  quantityRequested: number;
  uom: string;
}

export interface IssuedItemDto {
  partNumber: string;
  quantityIssued: number;
  batchLotNo: string;
}

export interface CreateRequisitionDto {
  workOrderId: string;
  requestedItems: RequisitionItemDto[];
}

export interface IssueRequisitionDto {
  requisitionId: string;
  issuedItems: IssuedItemDto[];
}

export interface UpdateWipStageDto {
  workOrderId: string;
  stationName: string;
  stageUnitsDelta: number;
  holdingLocation: string;
  hasQualityHold?: boolean;
  qualityNotes?: string;
}

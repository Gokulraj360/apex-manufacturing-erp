export interface QCInspectionParameterDto {
  parameter: string;
  specification: string;
  measuredValue: string;
  tolerance: string;
  isPass: boolean;
}

export interface CreateIncomingInspectionDto {
  poNumber: string;
  grnNumber?: string;
  supplierName: string;
  itemCode: string;
  itemName: string;
  lotBatchNumber?: string;
  sampleSize: number;
  quantityInspected: number;
  quantityAccepted: number;
  quantityRejected: number;
  parameters: QCInspectionParameterDto[];
  certificateOfAnalysisAttached?: boolean;
  status?: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'CONDITIONALLY_ACCEPTED';
  inspectorName: string;
  remarks?: string;
}

export interface UpdateIncomingInspectionStatusDto {
  status: 'PASSED' | 'FAILED' | 'CONDITIONALLY_ACCEPTED';
  quantityAccepted?: number;
  quantityRejected?: number;
  remarks?: string;
}

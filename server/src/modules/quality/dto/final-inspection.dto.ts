export interface TestingProtocolDto {
  testName: string;
  specMin?: number | string;
  specMax?: number | string;
  actualValue: string | number;
  passed: boolean;
}

export interface CreateFinalInspectionDto {
  workOrderNumber: string;
  batchNumber: string;
  productCode: string;
  productName: string;
  quantityChecked: number;
  quantityPassed: number;
  quantityFailed: number;
  testingProtocols: TestingProtocolDto[];
  inspectorName: string;
  isApprovedForDispatch?: boolean;
}

export interface ApproveDispatchDto {
  isApprovedForDispatch: boolean;
  signedOffBy: string;
  dispatchApprovalRef?: string;
  remarks?: string;
}

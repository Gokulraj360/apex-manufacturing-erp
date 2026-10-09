export type QCStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'PASSED'
  | 'FAILED'
  | 'CONDITIONALLY_ACCEPTED';

export type DefectSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'COSMETIC';

export type DefectCategory =
  | 'DIMENSIONAL'
  | 'VISUAL'
  | 'ELECTRICAL'
  | 'METALLURGICAL'
  | 'CHEMICAL'
  | 'CONTAMINATION'
  | 'PACKAGING';

export type DefectAction =
  | 'SCRAP'
  | 'REWORK'
  | 'RETURN_TO_VENDOR'
  | 'USE_AS_IS'
  | 'QUARANTINE';

export type AuditStandard =
  | 'ISO_9001'
  | 'IATF_16949'
  | 'AS_9100'
  | 'INTERNAL_GMP'
  | 'SIX_SIGMA';

export interface QCParameterItem {
  parameter: string;
  specification: string;
  measuredValue: string;
  tolerance: string;
  isPass: boolean;
}

export interface IncomingInspectionItem {
  id: string;
  inspectionNumber: string;
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
  parameters: QCParameterItem[];
  certificateOfAnalysisAttached: boolean;
  status: QCStatus;
  inspectorName: string;
  clearedAt?: string;
  remarks?: string;
  createdAt: string;
}

export interface InProcessParameterItem {
  parameter: string;
  standard: string;
  observed: string;
  toleranceDeviation?: number;
  isPass: boolean;
}

export interface InProcessInspectionItem {
  id: string;
  inspectionNumber: string;
  workOrderNumber: string;
  batchNumber: string;
  productionLineId: string;
  stationName: string;
  stage: string;
  parameters: InProcessParameterItem[];
  toleranceDeviation: number;
  status: QCStatus;
  inspectorName: string;
  notes?: string;
  createdAt: string;
}

export interface TestingProtocolItem {
  testName: string;
  specMin?: number | string;
  specMax?: number | string;
  actualValue: string | number;
  passed: boolean;
}

export interface FinalInspectionItem {
  id: string;
  inspectionNumber: string;
  workOrderNumber: string;
  batchNumber: string;
  productCode: string;
  productName: string;
  quantityChecked: number;
  quantityPassed: number;
  quantityFailed: number;
  status: QCStatus;
  isApprovedForDispatch: boolean;
  dispatchApprovalRef?: string;
  testingProtocols: TestingProtocolItem[];
  inspectorName: string;
  signedOffBy?: string;
  signedOffAt?: string;
  createdAt: string;
}

export interface DefectLogItem {
  id: string;
  defectCode: string;
  sourceStage: string;
  itemCode: string;
  itemName: string;
  lotBatchNumber?: string;
  defectCategory: DefectCategory;
  severity: DefectSeverity;
  defectReason: string;
  rootCause?: string;
  scrapQuantity: number;
  financialLoss: number;
  actionTaken: DefectAction;
  containmentMeasures?: string;
  reportedBy: string;
  createdAt: string;
}

export interface SupplierQualityScoreItem {
  id: string;
  supplierName: string;
  periodMonth: string;
  totalLotsReceived: number;
  lotsAccepted: number;
  lotsRejected: number;
  acceptanceRate: number;
  defectPPM: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  certificationStatus: string;
  evaluatedBy: string;
  createdAt: string;
}

export interface QualityAuditLogItem {
  id: string;
  auditNumber: string;
  standard: AuditStandard;
  auditType: string;
  department: string;
  auditorName: string;
  scorePercentage: number;
  findingsCount: number;
  criticalNonConformances: number;
  correctiveActionStatus: string;
  auditDate: string;
  nextAuditDate?: string;
  summary?: string;
}

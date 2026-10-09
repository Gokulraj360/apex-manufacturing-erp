export type CadFileFormat =
  | 'STEP'
  | 'IGES'
  | 'SLDPRT'
  | 'DWG'
  | 'DXF'
  | 'PARASOLID';

export type CadStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REVISED'
  | 'OBSOLETE';

export type DrawingSheetSize = 'A0' | 'A1' | 'A2' | 'A3' | 'A4';

export type BlueprintApprovalStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED_FOR_PRODUCTION'
  | 'SUPERSEDED';

export type BOMStatus = 'DRAFT' | 'IN_REVIEW' | 'RELEASED' | 'OBSOLETE';

export type ECNChangeReason =
  | 'DESIGN_OPTIMIZATION'
  | 'DEFECT_FIX'
  | 'MATERIAL_SUBSTITUTION'
  | 'COST_REDUCTION'
  | 'SUPPLIER_DISCONTINUATION'
  | 'CUSTOMER_REQUEST';

export type ECNPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ECNStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'IMPLEMENTED';

export type PrototypeTestType =
  | 'STRESS_TEST'
  | 'THERMAL_CYCLING'
  | 'DIMENSIONAL_VERIFICATION'
  | 'FATIGUE_TEST'
  | 'VIBRATION_ANALYSIS'
  | 'TORQUE_LOAD_TEST';

export type PrototypeTestResult = 'PASSED' | 'CONDITIONAL_PASS' | 'FAILED';

export interface CadModelItem {
  id: string;
  modelCode: string;
  name: string;
  description?: string | null;
  fileFormat: CadFileFormat;
  fileUrl: string;
  fileSizeBytes: number;
  version: string;
  category: string;
  materialSpec?: string | null;
  massKg?: number | null;
  volumeMm3?: number | null;
  status: CadStatus;
  author: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  drawings?: Array<{
    id: string;
    drawingNumber: string;
    title: string;
    revision: string;
    isApprovedForProduction: boolean;
  }>;
  bomMasters?: Array<{
    id: string;
    bomNumber: string;
    title: string;
    revision: string;
    status: string;
  }>;
  ecns?: Array<{
    id: string;
    ecnNumber: string;
    title: string;
    status: string;
    priority: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalDrawingItem {
  id: string;
  drawingNumber: string;
  title: string;
  cadModelId?: string | null;
  cadModel?: {
    id: string;
    modelCode: string;
    name: string;
    version: string;
    fileFormat: string;
    materialSpec?: string | null;
  } | null;
  sheetSize: DrawingSheetSize;
  revision: string;
  fileUrl: string;
  isApprovedForProduction: boolean;
  releasedToProductionAt?: string | null;
  releasedToQcAt?: string | null;
  criticalDimensions?: Array<{
    dimensionName: string;
    nominalMm: number;
    upperTolMm: number;
    lowerTolMm: number;
    isCpkMonitored: boolean;
  }> | null;
  geometricTolerances?: string | null;
  surfaceFinishRa?: number | null;
  status: BlueprintApprovalStatus;
  drawnBy: string;
  checkedBy?: string | null;
  approvedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BOMNodeItem {
  level: number;
  partNumber: string;
  partName: string;
  category: 'RAW_MATERIAL' | 'HARDWARE_FASTENER' | 'FABRICATED_PART' | 'SUB_ASSEMBLY';
  qty: number;
  uom: string;
  unitCost: number;
  material?: string;
  supplier?: string;
  drawingRef?: string;
  children?: BOMNodeItem[];
}

export interface BillOfMaterialsMasterItem {
  id: string;
  bomNumber: string;
  title: string;
  cadModelId?: string | null;
  cadModel?: {
    id: string;
    modelCode: string;
    name: string;
    version: string;
  } | null;
  revision: string;
  status: BOMStatus;
  totalPartsCount: number;
  estimatedTotalCost: number;
  currency: string;
  structureJson: BOMNodeItem[];
  releasedBy?: string | null;
  releasedAt?: string | null;
  ecns?: Array<{
    id: string;
    ecnNumber: string;
    title: string;
    status: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface EngineeringChangeNoticeItem {
  id: string;
  ecnNumber: string;
  title: string;
  cadModelId?: string | null;
  cadModel?: {
    id: string;
    modelCode: string;
    name: string;
    version: string;
  } | null;
  drawingId?: string | null;
  drawing?: {
    id: string;
    drawingNumber: string;
    title: string;
    revision: string;
  } | null;
  bomMasterId?: string | null;
  bomMaster?: {
    id: string;
    bomNumber: string;
    title: string;
    revision: string;
  } | null;
  reasonForChange: ECNChangeReason;
  priority: ECNPriority;
  description: string;
  changeScope: string;
  status: ECNStatus;
  requestedBy: string;
  reviewedBy?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  implementationTargetDate?: string | null;
  inventoryDisposition?: string | null;
  costImpactEstimate?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrototypeTestLogItem {
  id: string;
  testLogNumber: string;
  cadModelId: string;
  cadModel?: {
    id: string;
    modelCode: string;
    name: string;
    materialSpec?: string | null;
    version: string;
  } | null;
  prototypeSerial: string;
  testType: PrototypeTestType;
  testParameters: {
    appliedLoadKn?: number;
    maxStressMpa?: number;
    testDurationHours?: number;
    minTempC?: number;
    maxTempC?: number;
    cycleCount?: number;
  };
  observedOutcome: string;
  result: PrototypeTestResult;
  maxDeformationMm?: number | null;
  yieldSafetyFactor?: number | null;
  engineerInCharge: string;
  testedAt: string;
  nextIterationRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DesignSpecificationItem {
  id: string;
  specCode: string;
  title: string;
  cadModelId?: string | null;
  cadModel?: {
    id: string;
    modelCode: string;
    name: string;
    version: string;
  } | null;
  standardCompliance: string;
  operatingTempMinC?: number | null;
  operatingTempMaxC?: number | null;
  tensileStrengthMpa?: number | null;
  hardnessRating?: string | null;
  coatingRequirements?: string | null;
  qualityBenchmarkingNotes?: string | null;
  publishedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DesignEngineeringOverviewMetrics {
  totalCadModels: number;
  totalDrawings: number;
  approvedDrawings: number;
  blueprintAccuracyPct: number;
  totalBOMs: number;
  releasedBOMs: number;
  totalECNs: number;
  pendingECNs: number;
  totalTests: number;
  prototypePassRatePct: number;
}

export type WorkOrderStatus =
  | 'DRAFT'
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'QUALITY_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProductionBatchStatus =
  | 'QUEUED'
  | 'ACTIVE'
  | 'INTERRUPTED'
  | 'COMPLETED'
  | 'REJECTED';

export type RequisitionStatus =
  | 'REQUESTED'
  | 'ISSUED'
  | 'CONSUMED'
  | 'REJECTED';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export type MaintenanceStatus =
  | 'REPORTED'
  | 'IN_TRIAGE'
  | 'TECHNICIAN_ASSIGNED'
  | 'RESOLVED'
  | 'CLOSED';

export interface MilestoneItem {
  milestoneName: string;
  targetDate: string;
  isCompleted: boolean;
  completionPercentage: number;
}

export interface ProductionBatchItem {
  id: string;
  batchNumber: string;
  workOrderId: string;
  plannedUnits: number;
  producedUnits: number;
  defectiveUnits: number;
  status: ProductionBatchStatus;
  currentStation: string;
  startTime?: string;
  endTime?: string;
  operatorId: string;
  notes?: string;
}

export interface WorkOrderItem {
  id: string;
  orderNumber: string;
  bomId: string;
  sku: string;
  productName: string;
  targetQuantity: number;
  completedQuantity: number;
  scrapQuantity: number;
  status: WorkOrderStatus;
  startDate?: string;
  dueDate: string;
  completedDate?: string;
  assignedLineNumber: number;
  assignedSupervisor: string;
  milestones: MilestoneItem[];
  batches?: ProductionBatchItem[];
}

export interface BomComponentItem {
  partNumber: string;
  description: string;
  quantityRequired: number;
  uom: string;
  unitCost: number;
}

export interface AssemblyRoutingItem {
  id: string;
  stepNumber: number;
  stationName: string;
  instruction: string;
  cycleTimeMinutes: number;
  toolingRequired?: string;
  qualityCheckpoints?: Array<{ checkpoint: string; specTolerance: string; isMandatory: boolean }>;
}

export interface RecipeItem {
  id: string;
  sku: string;
  name: string;
  version: string;
  description?: string;
  components: BomComponentItem[];
  blueprintUrl?: string;
  blueprintSpecifications: {
    alloyGrade: string;
    toleranceMm: string;
    tensileStrengthMpa: number;
    surfaceFinishRa: string;
    cadRevision: string;
  };
  routings: AssemblyRoutingItem[];
}

export interface MaterialRequisitionItem {
  id: string;
  requisitionNumber: string;
  workOrderId: string;
  orderNumber: string;
  sku: string;
  requestedItems: Array<{ partNumber: string; quantityRequested: number; uom: string }>;
  issuedItems?: Array<{ partNumber: string; quantityIssued: number; batchLotNo: string }>;
  status: RequisitionStatus;
  requestedBy: string;
  issuedBy?: string;
  issuedAt?: string;
  createdAt: string;
}

export interface WipStockItem {
  id: string;
  workOrderId: string;
  orderNumber: string;
  sku: string;
  stationName: string;
  stageUnits: number;
  holdingLocation: string;
  lastInspectedAt?: string;
  hasQualityHold: boolean;
  qualityNotes?: string;
}

export interface ScrapLogItem {
  id: string;
  orderNumber: string;
  partNumber: string;
  quantity: number;
  reasonCode: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  inspectorNotes?: string;
  financialScrapValue: number;
  loggedAt: string;
}

export interface MachineItem {
  id: string;
  machineCode: string;
  machineName: string;
  operatingHours: number;
  totalCycles: number;
  temperatureCelsius: number;
  vibrationMmSec: number;
  isOnline: boolean;
  lastTelemetricPing: string;
}

export interface MaintenanceTicketItem {
  id: string;
  ticketNumber: string;
  machineCode: string;
  machineName: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  issueDescription: string;
  breakdownTime: string;
  assignedTechnician?: string;
  rootCauseAnalysis?: string;
}

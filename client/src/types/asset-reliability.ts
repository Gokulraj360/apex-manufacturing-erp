export type AssetCategory =
  | 'CNC_MACHINING'
  | 'INJECTION_MOLDING'
  | 'ASSEMBLY_ROBOT'
  | 'CONVEYOR_SYSTEM'
  | 'HYDRAULIC_PRESS'
  | 'FURNACE_HEATER'
  | 'PACKAGING_LINE'
  | 'UTILITY_COMPRESSOR';

export type AssetStatus =
  | 'OPERATIONAL'
  | 'DEGRADED'
  | 'UNDER_MAINTENANCE'
  | 'BREAKDOWN_STOPPAGE'
  | 'DECOMMISSIONED';

export type AssetCriticality =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL_BOTTLENECK';

export type MaintenanceInterval =
  | 'DAILY'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'BIANNUAL'
  | 'ANNUAL';

export type MaintenanceScheduleType =
  | 'ROUTINE_INSPECTION'
  | 'LUBRICATION'
  | 'CALIBRATION'
  | 'ELECTRICAL_INSPECTION'
  | 'MECHANICAL_OVERHAUL'
  | 'FILTER_REPLACEMENT'
  | 'SAFETY_AUDIT';

export type MaintenanceScheduleStatus =
  | 'SCHEDULED'
  | 'DUE'
  | 'OVERDUE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type BreakdownSeverity =
  | 'MINOR'
  | 'MODERATE'
  | 'CRITICAL'
  | 'CATASTROPHIC';

export type BreakdownTicketStatus =
  | 'REPORTED'
  | 'IN_DIAGNOSIS'
  | 'WAITING_FOR_PARTS'
  | 'UNDER_REPAIR'
  | 'RESOLVED'
  | 'VERIFIED';

export type ToolCribRequisitionStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'ISSUED'
  | 'REJECTED'
  | 'RETURNED';

export type AssetLifecycleEventType =
  | 'COMMISSIONING'
  | 'PREVENTIVE_MAINTENANCE'
  | 'BREAKDOWN_REPAIR'
  | 'CALIBRATION'
  | 'RELOCATION'
  | 'DECOMMISSION';

export interface MachineAssetItem {
  id: string;
  assetTag: string;
  assetName: string;
  category: AssetCategory;
  serialNumber: string;
  modelNumber: string;
  manufacturer: string;
  facilityLocation: string;
  powerRatingKw?: number;
  operatingVoltage?: string;
  installationDate: string;
  warrantyExpiryDate?: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  totalOperatingHours: number;
  mtbfHours?: number;
  mttrHours?: number;
  manualDocumentUrl?: string;
  specifications?: Record<string, any>;
  _count?: {
    maintenanceSchedules?: number;
    breakdownTickets?: number;
    lifecycleLogs?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceScheduleItem {
  id: string;
  scheduleCode: string;
  assetId: string;
  asset?: {
    id: string;
    assetTag: string;
    assetName: string;
    category: AssetCategory;
    facilityLocation: string;
    status: AssetStatus;
  };
  title: string;
  scheduleType: MaintenanceScheduleType;
  interval: MaintenanceInterval;
  intervalHours?: number;
  status: MaintenanceScheduleStatus;
  lastPerformedAt?: string;
  nextDueDate: string;
  estimatedDurationHours: number;
  assignedTechnician?: string;
  checklistItems?: Array<{ step: string; required: boolean; verified?: boolean }>;
  notes?: string;
  createdAt?: string;
}

export interface BreakdownTicketItem {
  id: string;
  ticketNumber: string;
  assetId: string;
  asset?: {
    id: string;
    assetTag: string;
    assetName: string;
    category: AssetCategory;
    facilityLocation: string;
    criticality: AssetCriticality;
    status: AssetStatus;
  };
  reportedBy: string;
  assignedTechnician?: string;
  severity: BreakdownSeverity;
  status: BreakdownTicketStatus;
  failureCategory: string;
  symptomDescription: string;
  rootCause?: string;
  correctiveActionTaken?: string;
  breakdownStartedAt: string;
  repairCompletedAt?: string;
  downtimeHours?: number;
  repairCostEstimate?: number;
  createdAt?: string;
}

export interface SparePartItem {
  id: string;
  partCode: string;
  partName: string;
  category: string;
  compatibleMachineModels?: string;
  currentStock: number;
  minimumThreshold: number;
  unitOfMeasure: string;
  unitCost: number;
  cribBinLocation: string;
  supplierName?: string;
  leadTimeDays: number;
  createdAt?: string;
}

export interface ToolCribRequisitionItem {
  id: string;
  requisitionNumber: string;
  sparePartId: string;
  sparePart?: SparePartItem;
  breakdownTicketId?: string;
  breakdownTicket?: {
    ticketNumber: string;
    asset?: { assetTag: string; assetName: string };
  };
  maintenanceScheduleId?: string;
  maintenanceSchedule?: {
    scheduleCode: string;
    title: string;
    asset?: { assetTag: string; assetName: string };
  };
  quantity: number;
  status: ToolCribRequisitionStatus;
  requestedBy: string;
  approvedBy?: string;
  issuedAt?: string;
  purposeNotes?: string;
  createdAt?: string;
}

export interface AssetLifecycleLogItem {
  id: string;
  assetId: string;
  asset?: {
    assetTag: string;
    assetName: string;
    facilityLocation: string;
  };
  eventType: AssetLifecycleEventType;
  eventTitle: string;
  eventDescription: string;
  costIncurred: number;
  downtimeIncurredMinutes: number;
  performedBy: string;
  recordedAt: string;
}

export interface ReliabilityOverviewMetrics {
  totalAssets: number;
  operationalAssets: number;
  stoppageAssets: number;
  underMaintenanceAssets: number;
  uptimePercentage: number;
  fleetAverageMtbfHours: number;
  fleetAverageMttrHours: number;
  totalMaintenanceExpenseYtd: number;
  totalDowntimeHours: number;
  activeBreakdownAlertsCount: number;
  overdueSchedulesCount: number;
  lowStockPartsCount: number;
  recentBreakdownAlerts: BreakdownTicketItem[];
}

export interface AssetReliabilityBreakdownItem {
  assetId: string;
  assetTag: string;
  assetName: string;
  category: AssetCategory;
  facilityLocation: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  totalOperatingHours: number;
  totalBreakdowns: number;
  totalDowntimeHours: number;
  totalRepairCost: number;
  computedMtbfHours: number;
  computedMttrHours: number;
  availabilityPercentage: number;
}

export type ServiceRequestType =
  | 'BREAKDOWN_REPAIR'
  | 'PREVENTIVE_MAINTENANCE'
  | 'INSTALLATION_COMMISSIONING'
  | 'WARRANTY_INSPECTION'
  | 'AMC_VISIT';

export type ServicePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_DOWN';

export type ServiceRequestStatus =
  | 'LOGGED'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'ON_SITE_DIAGNOSIS'
  | 'PARTS_AWAITING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type EngineerStatus =
  | 'AVAILABLE'
  | 'ON_SITE'
  | 'IN_TRANSIT'
  | 'ON_LEAVE'
  | 'OFF_DUTY';

export type AMCContractType =
  | 'COMPREHENSIVE'
  | 'NON_COMPREHENSIVE'
  | 'LABOR_ONLY';

export type AMCContractStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'PENDING_RENEWAL'
  | 'SUSPENDED';

export type WarrantyStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'VOID_MISUSE'
  | 'EXTENDED';

export type ServiceLogType =
  | 'ARRIVAL_CHECKIN'
  | 'DIAGNOSTIC_NOTE'
  | 'PARTS_REPLACED'
  | 'TESTING_COMPLETED'
  | 'CUSTOMER_SIGNOFF'
  | 'DEPARTURE_CHECKOUT';

export type FieldPartRequisitionStatus =
  | 'PENDING_APPROVAL'
  | 'DISPATCHED_TO_VAN'
  | 'INSTALLED_ON_MACHINE'
  | 'RETURNED_TO_CENTRAL_STORE';

export interface ServiceRequestItem {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceLocation: string;
  city: string;
  requestType: ServiceRequestType;
  priority: ServicePriority;
  status: ServiceRequestStatus;
  machineSerialNumber?: string;
  machineModel: string;
  reportedFault: string;
  resolutionSummary?: string;
  assignedEngineerId?: string;
  assignedEngineer?: FieldEngineerItem;
  amcContractId?: string;
  amcContract?: AMCContractItem;
  warrantyRecordId?: string;
  warrantyRecord?: WarrantyRecordItem;
  scheduledDate: string;
  completedAt?: string;
  firstTimeFix: boolean;
  customerSatisfactionScore?: number;
  customerFeedback?: string;
  totalServiceCost: number;
  logs?: ServiceLogItem[];
  partRequisitions?: FieldPartRequisitionItem[];
  createdAt?: string;
}

export interface FieldEngineerItem {
  id: string;
  employeeCode: string;
  fullName: string;
  phone: string;
  email: string;
  operatingTerritoryCity: string;
  technicalSpecializations: string[];
  currentStatus: EngineerStatus;
  currentLatitude?: number;
  currentLongitude?: number;
  lastLocationUpdate?: string;
  totalCompletedJobs: number;
  avgResolutionHours: number;
  ftfrRate: number;
  customerRatingAvg: number;
  isActive: boolean;
  assignedRequests?: ServiceRequestItem[];
  vanStocks?: VanStockItem[];
  _count?: {
    assignedRequests?: number;
    vanStocks?: number;
    partRequisitions?: number;
  };
  createdAt?: string;
}

export interface AMCContractItem {
  id: string;
  contractNumber: string;
  customerName: string;
  customerContact: string;
  machineModel: string;
  machineSerialNumber: string;
  contractType: AMCContractType;
  status: AMCContractStatus;
  startDate: string;
  endDate: string;
  contractValue: number;
  visitsAllowedTotal: number;
  visitsConsumed: number;
  termsAndConditions?: string;
  serviceRequests?: ServiceRequestItem[];
  _count?: {
    serviceRequests?: number;
  };
  createdAt?: string;
}

export interface WarrantyRecordItem {
  id: string;
  warrantyCardNumber: string;
  customerName: string;
  machineModel: string;
  machineSerialNumber: string;
  dispatchDate: string;
  installationDate: string;
  warrantyEndDate: string;
  status: WarrantyStatus;
  coverageScope: string;
  serviceRequests?: ServiceRequestItem[];
  createdAt?: string;
}

export interface VanStockItem {
  id: string;
  engineerId: string;
  engineer?: {
    id: string;
    employeeCode: string;
    fullName: string;
    operatingTerritoryCity: string;
  };
  itemSku: string;
  itemName: string;
  quantityOnHand: number;
  minimumThreshold: number;
  unitValue: number;
  binOrCrateLocation?: string;
  lastReplenishedAt?: string;
  createdAt?: string;
}

export interface ServiceLogItem {
  id: string;
  requestId: string;
  engineerId: string;
  engineer?: {
    fullName: string;
    employeeCode: string;
  };
  timestamp: string;
  logType: ServiceLogType;
  locationCoordinates?: string;
  notes: string;
  partsReplacedJson?: {
    itemSku: string;
    itemName: string;
    quantity: number;
    serialNumber?: string;
  }[];
  createdAt?: string;
}

export interface FieldPartRequisitionItem {
  id: string;
  requisitionNumber: string;
  requestId: string;
  request?: {
    ticketNumber: string;
    customerName: string;
    machineModel: string;
  };
  engineerId: string;
  engineer?: {
    employeeCode: string;
    fullName: string;
  };
  itemSku: string;
  itemName: string;
  quantityRequested: number;
  isDefectiveReturned: boolean;
  defectivePartSerialNumber?: string;
  status: FieldPartRequisitionStatus;
  approvedBy?: string;
  createdAt?: string;
}

export interface FieldServiceOverviewMetrics {
  totalTicketsCount: number;
  openTicketsCount: number;
  criticalDownCount: number;
  activeEngineersCount: number;
  activeAMCContractsCount: number;
  activeWarrantiesCount: number;
  pendingPartsRequisitionCount: number;
  firstTimeFixRate: number;
  averageResolutionHours: number;
  customerSatisfactionRating: number;
  totalServiceCost: number;
  vanStockReplenishmentHealth: number;
}

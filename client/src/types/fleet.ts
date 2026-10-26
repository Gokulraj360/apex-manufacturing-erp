export type VehicleType =
  | 'HEAVY_TRUCK'
  | 'MEDIUM_TRUCK'
  | 'DELIVERY_VAN'
  | 'PICKUP_UTILITY'
  | 'PASSENGER_CAR'
  | 'ELECTRIC_FORKLIFT';

export type VehicleStatus =
  | 'AVAILABLE'
  | 'ON_TRIP'
  | 'IN_MAINTENANCE'
  | 'OUT_OF_SERVICE'
  | 'DECOMMISSIONED';

export type FuelType =
  | 'DIESEL'
  | 'PETROL'
  | 'CNG'
  | 'ELECTRIC'
  | 'HYBRID';

export type ServiceType =
  | 'ROUTINE_PREVENTIVE'
  | 'BREAKDOWN_REPAIR'
  | 'TIRE_REPLACEMENT'
  | 'OIL_CHANGE'
  | 'ANNUAL_OVERHAUL';

export type ServiceStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type AssignmentStatus =
  | 'SCHEDULED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'CANCELLED';

export type ComplianceDocType =
  | 'INSURANCE_POLICY'
  | 'PUC_CERTIFICATE'
  | 'FITNESS_CERTIFICATE'
  | 'ROAD_TAX'
  | 'NATIONAL_PERMIT'
  | 'REGISTRATION_RC';

export type ComplianceDocStatus =
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'PENDING_RENEWAL';

export interface FleetVehicleItem {
  id: string;
  vehicleNumber: string;
  fleetCode: string;
  modelName: string;
  make: string;
  year: number;
  vehicleType: VehicleType;
  status: VehicleStatus;
  fuelType: FuelType;
  payloadCapacityKg: number;
  totalOdometerKm: number;
  assignedDriver?: string | null;
  fastagTagId?: string | null;
  fuelCardNumber?: string | null;
  gpsTelematicsId?: string | null;
  purchaseDate?: string | null;
  insurancePolicyExpiry?: string | null;
  pucExpiry?: string | null;
  fitnessExpiry?: string | null;
  roadTaxExpiry?: string | null;
  createdAt: string;
  updatedAt: string;
  serviceLogs?: VehicleServiceLogItem[];
  tripAssignments?: VehicleAssignmentItem[];
  fuelExpenses?: FuelExpenseLogItem[];
  complianceDocuments?: VehicleComplianceDocumentItem[];
  _count?: {
    serviceLogs: number;
    tripAssignments: number;
    fuelExpenses: number;
    complianceDocuments: number;
  };
}

export interface ReplacedPart {
  partName: string;
  partCode: string;
  qty: number;
  unitCost: number;
}

export interface VehicleServiceLogItem {
  id: string;
  serviceNumber: string;
  vehicleId: string;
  vehicle?: FleetVehicleItem;
  serviceType: ServiceType;
  status: ServiceStatus;
  odometerAtService: number;
  serviceCenter: string;
  partsReplaced?: ReplacedPart[] | null;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  serviceDate: string;
  nextServiceDueKm?: number | null;
  nextServiceDueDate?: string | null;
  invoiceNumber?: string | null;
  notes?: string | null;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleAssignmentItem {
  id: string;
  assignmentNumber: string;
  vehicleId: string;
  vehicle?: FleetVehicleItem;
  driverName: string;
  driverContact: string;
  routeTitle: string;
  originLocation: string;
  destinationLocation: string;
  purpose: string;
  status: AssignmentStatus;
  startOdometerKm?: number | null;
  endOdometerKm?: number | null;
  scheduledStart: string;
  actualStart?: string | null;
  scheduledEnd?: string | null;
  actualEnd?: string | null;
  cargoWeightKg?: number | null;
  linkedDispatchOrderRef?: string | null;
  notes?: string | null;
  dispatchedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FuelExpenseLogItem {
  id: string;
  expenseCode: string;
  vehicleId: string;
  vehicle?: FleetVehicleItem;
  fuelType: FuelType;
  litersOrKwh: number;
  costPerUnit: number;
  totalFuelCost: number;
  tollCharges: number;
  otherTravelExpenses: number;
  totalExpense: number;
  odometerAtFueling: number;
  fuelStationName: string;
  fuelCardTransactionRef?: string | null;
  paymentMethod: string;
  fueledAt: string;
  fuelEfficiencyKmPerLiter?: number | null;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleComplianceDocumentItem {
  id: string;
  documentNumber: string;
  vehicleId: string;
  vehicle?: FleetVehicleItem;
  docType: ComplianceDocType;
  policyOrCertificateNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  premiumOrFeeAmount: number;
  status: ComplianceDocStatus;
  documentUrl?: string | null;
  renewalAlertDays: number;
  notes?: string | null;
  managedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetOverviewMetrics {
  fleetSize: number;
  statusBreakdown: {
    available: number;
    onTrip: number;
    inMaintenance: number;
    outOfService: number;
    decommissioned: number;
  };
  activeTrips: number;
  totalMileageKm: number;
  expiringComplianceAlerts: number;
  recentFuelAnalytics: {
    totalSpend: number;
    litersConsumed: number;
    tollExpenditure: number;
  };
}

export interface MaintenanceStatistics {
  totalLogs: number;
  totalMaintenanceCost: number;
  totalPartsCost: number;
  totalLaborCost: number;
  typeBreakdown: {
    preventive: number;
    breakdown: number;
    tire: number;
    oilChange: number;
    annualOverhaul: number;
  };
  statusBreakdown: {
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

export interface AssignmentStatistics {
  totalAssignments: number;
  activeTrips: number;
  statusCounts: {
    scheduled: number;
    dispatched: number;
    inTransit: number;
    completed: number;
    cancelled: number;
  };
  totalCargoTransportedKg: number;
}

export interface FuelExpenseAnalytics {
  totalTransactions: number;
  totalSpend: number;
  totalFuelCost: number;
  totalTolls: number;
  totalLiters: number;
  avgEfficiency: number;
  paymentMethodBreakdown: Record<string, number>;
}

export interface ComplianceStatistics {
  totalDocuments: number;
  active: number;
  expiringSoon: number;
  expired: number;
  pendingRenewal: number;
  totalFeesPaid: number;
  docTypeBreakdown: {
    insurance: number;
    puc: number;
    fitness: number;
    roadTax: number;
    permit: number;
    rc: number;
  };
}

export type VehicleType =
  | 'HEAVY_TRUCK'
  | 'MEDIUM_TRUCK'
  | 'LIGHT_COMMERCIAL'
  | 'CONTAINER_CARRIER'
  | 'VISITOR_CAR'
  | 'EMPLOYEE_VEHICLE'
  | 'SERVICE_VEHICLE';

export type GateMovementStatus =
  | 'INSIDE_PREMISES'
  | 'CHECKED_OUT'
  | 'SECURITY_HOLD'
  | 'REFUSED_ENTRY';

export type GatePassType =
  | 'EQUIPMENT_REPAIR'
  | 'SCRAP_REMOVAL'
  | 'RETURNABLE_PACKAGING'
  | 'CUSTOMER_DEMO'
  | 'SUBCONTRACTOR_PROCESSING'
  | 'HAZARDOUS_DISPOSAL';

export type TripStatus =
  | 'SCHEDULED'
  | 'DISPATCHED'
  | 'AT_CHECKPOINT'
  | 'DELIVERED'
  | 'DELAYED'
  | 'CANCELLED';

export interface VehicleLogItem {
  id: string;
  passNumber: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  driverName: string;
  driverPhone: string;
  driverLicenseNumber?: string;
  purpose: string;
  transporterName?: string;
  entryTimestamp: string;
  exitTimestamp?: string;
  gateNumber: string;
  visitorPassBadge?: string;
  accompanyingPersons: number;
  status: GateMovementStatus;
  securityGuardNotes?: string;
  recordedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InboundTransportCheckItem {
  id: string;
  vehicleNumber: string;
  driverName: string;
  transporterName: string;
  purchaseOrderId?: string;
  lrNumber: string;
  invoiceOrDcNumber: string;
  sealIntact: boolean;
  sealNumber?: string;
  physicalDamageObserved: boolean;
  damageNotes?: string;
  grossWeightKg?: number;
  tareWeightKg?: number;
  netWeightKg?: number;
  entryTimestamp: string;
  exitTimestamp?: string;
  verifiedByGuardId?: string;
  weighbridgeOperatorId?: string;
  createdAt: string;
  updatedAt: string;
  purchaseOrder?: {
    id: string;
    poNumber: string;
    vendorName?: string;
    totalAmount?: number;
  };
}

export interface OutboundGateClearanceItem {
  id: string;
  clearanceNumber: string;
  vehicleNumber: string;
  driverName: string;
  deliveryChallanId?: string;
  dispatchShipmentId?: string;
  physicalCheckPassed: boolean;
  tamperEvidentSealNumber: string;
  loadVerificationNotes?: string;
  clearanceTimestamp: string;
  clearedByGuardId?: string;
  createdAt: string;
  updatedAt: string;
  deliveryChallan?: {
    id: string;
    challanNumber: string;
    receiverName?: string;
  };
  dispatchShipment?: {
    id: string;
    shipmentNumber: string;
    destinationCity?: string;
    carrierName?: string;
  };
}

export interface DeliveryTripItem {
  id: string;
  tripTrackingNumber: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  carrierName: string;
  routePlan: string;
  plannedDeparture: string;
  actualDeparture?: string;
  estimatedArrival: string;
  actualArrival?: string;
  currentLocationGps?: string;
  currentCheckpoint?: string;
  proofOfDeliveryUrl?: string;
  podSignedBy?: string;
  podTimestamp?: string;
  status: TripStatus;
  transitRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialGatePassItem {
  id: string;
  passNumber: string;
  passType: GatePassType;
  departmentOrigin: string;
  destinationParty: string;
  authorizedPerson: string;
  authorizedPhone?: string;
  reason: string;
  itemListJson: Array<{
    itemCode?: string;
    description: string;
    quantity: number;
    serialNumbers?: string;
  }>;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  isReturnable: boolean;
  isReturned: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';
  securityVerifiedOutAt?: string;
  securityVerifiedInAt?: string;
  verifiedOutByGuardId?: string;
  verifiedInByGuardId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogisticsDashboardStats {
  vehiclesOnPremises: number;
  inboundAwaitingWeighbridge: number;
  outboundClearedToday: number;
  activeTripsInTransit: number;
  openSpecialPasses: number;
  tamperIncidentsReported: number;
}

export type MRPPlanStatus = 'DRAFT' | 'COMPUTED' | 'RELEASED' | 'ARCHIVED';

export type RequisitionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RequisitionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CONVERTED_TO_PO';

export type SupplyPOStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'ACKNOWLEDGED'
  | 'IN_TRANSIT'
  | 'PARTIALLY_DELIVERED'
  | 'FULFILLED'
  | 'CANCELLED';

export type VendorTierRating =
  | 'TIER_1_STRATEGIC'
  | 'TIER_2_PREFERRED'
  | 'TIER_3_TRANSACTIONAL'
  | 'PROBATION';

export type TransportMode = 'AIR' | 'OCEAN' | 'ROAD' | 'RAIL';

export type ShipmentMilestone =
  | 'BOOKED'
  | 'DEPARTED_ORIGIN'
  | 'IN_CUSTOMS'
  | 'PORT_CLEARANCE'
  | 'IN_FINAL_TRANSIT'
  | 'DELIVERED_AT_DOCK'
  | 'EXCEPTION_DELAY';

export type RiskCategory =
  | 'SUPPLIER_SOLVENCY'
  | 'GEOPOLITICAL'
  | 'LOGISTICS_DISRUPTION'
  | 'PRICE_VOLATILITY'
  | 'SINGLE_SOURCE_DEPENDENCY'
  | 'LEAD_TIME_SPIKE';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskStatus =
  | 'IDENTIFIED'
  | 'MITIGATION_IN_PROGRESS'
  | 'RESOLVED'
  | 'ACCEPTED';

export interface GrossDemandItem {
  itemSku: string;
  itemName: string;
  requiredQty: number;
  sourceWorkOrderId?: string;
  requiredDate: string;
}

export interface ScheduledReceiptItem {
  itemSku: string;
  incomingQty: number;
  poNumber: string;
  expectedDate: string;
}

export interface NetRequirementItem {
  itemSku: string;
  itemName: string;
  requiredQty: number;
  currentOnhand: number;
  scheduledIncoming: number;
  safetyStockThreshold: number;
  netShortageQty: number;
  leadTimeDays: number;
}

export interface PlannedOrderReleaseItem {
  itemSku: string;
  itemName: string;
  orderQty: number;
  releaseDate: string;
  needDate: string;
  suggestedVendorId?: string;
  suggestedVendorName?: string;
  estimatedLeadDays: number;
}

export interface MaterialRequirementPlanItem {
  id: string;
  planNumber: string;
  planName: string;
  planningHorizonWeeks: number;
  status: MRPPlanStatus;
  generatedBy: string;
  forecastStartDate: string;
  forecastEndDate: string;
  grossDemandJson: GrossDemandItem[];
  scheduledReceiptsJson: ScheduledReceiptItem[];
  netRequirementsJson: NetRequirementItem[];
  plannedOrderReleasesJson: PlannedOrderReleaseItem[];
  safetyStockAlertsCount: number;
  totalItemsPlanned: number;
  notes?: string;
  createdAt?: string;
}

export interface RequisitionLineItem {
  itemSku: string;
  itemName: string;
  quantity: number;
  uom: string;
  estimatedUnitPrice: number;
  preferredVendorId?: string;
}

export interface PurchaseRequisitionItem {
  id: string;
  requisitionNumber: string;
  requestedBy: string;
  department: string;
  requiredByDate: string;
  priority: RequisitionPriority;
  status: RequisitionStatus;
  totalEstimatedCost: number;
  justification: string;
  items: RequisitionLineItem[];
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
}

export interface POLineItem {
  itemSku: string;
  itemName: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseOrderSupplyItem {
  id: string;
  poNumber: string;
  vendorId: string;
  vendor?: VendorDirectoryItem;
  requisitionId?: string;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  paymentTerms: string;
  incoterms: string;
  status: SupplyPOStatus;
  currency: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress: string;
  items: POLineItem[];
  issuedBy: string;
  acknowledgedBy?: string;
  notes?: string;
  createdAt?: string;
}

export interface VendorDirectoryItem {
  id: string;
  vendorCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxIdGstin?: string;
  tierRating: VendorTierRating;
  categories: string[];
  leadTimeDaysAvg: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  costCompetitiveness: number;
  overallScore: number;
  paymentTerms: string;
  isActive: boolean;
  _count?: {
    purchaseOrders?: number;
    shipments?: number;
    riskLogs?: number;
  };
  createdAt?: string;
}

export interface TrackingMilestone {
  milestone: ShipmentMilestone;
  timestamp: string;
  location: string;
  remarks?: string;
}

export interface InboundShipmentItem {
  id: string;
  shipmentTrackingNumber: string;
  poId?: string;
  po?: {
    id: string;
    poNumber: string;
    totalAmount: number;
  };
  vendorId: string;
  vendor?: {
    id: string;
    vendorCode: string;
    companyName: string;
    city: string;
  };
  carrierName: string;
  freightForwarder?: string;
  transportMode: TransportMode;
  originPortCity: string;
  destinationPlantCity: string;
  dispatchDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate?: string;
  currentMilestone: ShipmentMilestone;
  trackingMilestonesJson: TrackingMilestone[];
  containerOrWaybillNumber?: string;
  driverOrVesselInfo?: string;
  totalWeightKg?: number;
  estimatedFreightCost?: number;
  delayRisk: RiskSeverity;
  delayReason?: string;
  routeNotes?: string;
  createdAt?: string;
}

export interface SupplyRiskLogItem {
  id: string;
  riskRefNumber: string;
  vendorId?: string;
  vendor?: {
    id: string;
    vendorCode: string;
    companyName: string;
    tierRating: VendorTierRating;
  };
  itemSku?: string;
  riskCategory: RiskCategory;
  severityLevel: RiskSeverity;
  likelihood: string;
  impactDescription: string;
  mitigationPlan: string;
  status: RiskStatus;
  owner: string;
  estimatedFinancialExposure: number;
  reportedAt: string;
  resolvedAt?: string;
  createdAt?: string;
}

export interface SupplyChainOverviewMetrics {
  activeVendorsCount: number;
  openPOsCount: number;
  inTransitShipmentsCount: number;
  activeRisksCount: number;
  highSeverityRisksCount: number;
  mrpPlansCount: number;
  fleetOnTimeDeliveryRate: number;
  fleetQualityCompliance: number;
  inventoryTurnoverRatio: number;
  averageLeadTimeDays: number;
  costSavingsAchieved: number;
  uninterruptedFlowIndex: number;
}

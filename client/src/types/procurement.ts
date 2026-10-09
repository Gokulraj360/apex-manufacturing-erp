export type RequisitionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RequisitionStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'ORDERED';

export type RFQStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'EVALUATION'
  | 'AWARDED'
  | 'CANCELLED';

export type BidStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COUNTER_OFFERED';

export type ProcurementPOStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'ISSUED'
  | 'ACKNOWLEDGED'
  | 'IN_TRANSIT'
  | 'PARTIALLY_DELIVERED'
  | 'FULFILLED'
  | 'CANCELLED';

export type ContractTermStatus =
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'TERMINATED';

export interface RequisitionItemDetail {
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
  items: RequisitionItemDetail[];
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  rfqs?: RequestForQuotationItem[];
  procurementOrders?: PurchaseOrderProcurementItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RFQItemDetail {
  itemSku: string;
  itemName: string;
  requiredQty: number;
  uom: string;
  targetPrice?: number;
  technicalSpecs?: string;
}

export interface SupplierBidQuotedItem {
  itemSku: string;
  itemName: string;
  offeredQty: number;
  unitPrice: number;
  lineTotal: number;
  leadTimeDays: number;
  complianceNotes?: string;
}

export interface SupplierBidItem {
  id: string;
  rfqId: string;
  rfq?: RequestForQuotationItem;
  vendorId?: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  bidAmountTotal: number;
  quotedItems: SupplierBidQuotedItem[];
  paymentTermsOffered: string;
  validUntilDate: string;
  status: BidStatus;
  evaluationScore?: number;
  negotiationNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RequestForQuotationItem {
  id: string;
  rfqNumber: string;
  title: string;
  description?: string;
  requisitionId?: string;
  requisition?: PurchaseRequisitionItem;
  status: RFQStatus;
  deadlineDate: string;
  targetDeliveryDate: string;
  paymentTerms: string;
  deliveryTerms: string;
  items: RFQItemDetail[];
  invitedVendorsJson?: {
    vendorId: string;
    vendorName: string;
    email: string;
  }[];
  createdBy: string;
  bids?: SupplierBidItem[];
  procurementOrders?: PurchaseOrderProcurementItem[];
  _count?: {
    bids?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface POLineItem {
  itemSku: string;
  itemName: string;
  orderedQty: number;
  receivedQty?: number;
  unitPrice: number;
  discountPct?: number;
  lineTotal: number;
  targetDate?: string;
}

export interface POModificationEntry {
  modifiedAt: string;
  modifiedBy: string;
  type: string;
  reason: string;
  previousDeliveryDate?: string;
  newDeliveryDate?: string;
  previousItems?: any[];
  previousTotal?: number;
}

export interface PurchaseOrderProcurementItem {
  id: string;
  poNumber: string;
  requisitionId?: string;
  requisition?: PurchaseRequisitionItem;
  rfqId?: string;
  rfq?: RequestForQuotationItem;
  supplierBidId?: string;
  supplierBid?: SupplierBidItem;
  vendorId?: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorAddress: string;
  orderDate: string;
  promisedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: ProcurementPOStatus;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentTerms: string;
  deliveryAddress: string;
  items: POLineItem[];
  approvedBy?: string;
  approvedAt?: string;
  issuedBy: string;
  remindersSentCount: number;
  lastReminderSentAt?: string;
  modificationsHistory?: POModificationEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VolumeDiscountTier {
  minQty: number;
  maxQty?: number;
  discountPct: number;
  effectiveUnitPrice: number;
}

export interface ApprovedVendorInfo {
  vendorId: string;
  vendorName: string;
  vendorSku?: string;
  rank: number;
  preferredTier: string;
}

export interface MaterialCatalogItem {
  id: string;
  itemSku: string;
  itemName: string;
  category: string;
  description?: string;
  uom: string;
  basePrice: number;
  currency: string;
  standardLeadTimeDays: number;
  minimumOrderQty: number;
  volumeDiscountTiers: VolumeDiscountTier[];
  approvedVendorsJson: ApprovedVendorInfo[];
  specificationsJson?: Record<string, any>;
  isActive: boolean;
  contractTerms?: VendorContractTermsItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorContractTermsItem {
  id: string;
  contractRefNumber: string;
  vendorId: string;
  vendorName: string;
  materialCatalogId?: string;
  materialCatalog?: MaterialCatalogItem;
  contractTitle: string;
  fixedPeriodStart: string;
  fixedPeriodEnd: string;
  agreedUnitPrice: number;
  priceLockValidUntil: string;
  rebateTerms?: string;
  minimumAnnualCommitment?: number;
  paymentTerms: string;
  penaltyClauses?: string;
  status: ContractTermStatus;
  signedByVendor: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcurementOverviewMetrics {
  openRequisitionsCount: number;
  pendingApprovalCost: number;
  activeRFQsCount: number;
  openPOsCount: number;
  totalCommittedSpend: number;
  averageNegotiatedSavingsPct: number;
  onTimeDeliveryComplianceRate: number;
  activePriceLockContractsCount: number;
  catalogSkusCount: number;
}

export type LeadSource =
  | 'INBOUND_WEB'
  | 'TRADE_SHOW'
  | 'REFERRAL'
  | 'COLD_OUTREACH'
  | 'PARTNER'
  | 'EXISTING_CLIENT';

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type PipelineStage =
  | 'DISCOVERY'
  | 'TECHNICAL_EVALUATION'
  | 'QUOTATION_SUBMITTED'
  | 'COMMERCIAL_NEGOTIATION'
  | 'CONTRACT_REVIEW'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export type QuotationStatus =
  | 'DRAFT'
  | 'PENDING_INTERNAL_REVIEW'
  | 'TRANSMITTED_TO_CLIENT'
  | 'REVISED'
  | 'ACCEPTED'
  | 'DECLINED';

export type SalesOrderCRMStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'SCHEDULED_FOR_PRODUCTION'
  | 'IN_PRODUCTION'
  | 'DISPATCH_READY'
  | 'FULFILLED'
  | 'CANCELLED';

export type ClientContractCRMStatus =
  | 'ACTIVE'
  | 'PENDING_RENEWAL'
  | 'EXPIRED'
  | 'TERMINATED';

export type InquiryCategory =
  | 'ORDER_STATUS'
  | 'TECHNICAL_SPECIFICATION'
  | 'DRAWING_REVISION'
  | 'EXPEDITED_DELIVERY'
  | 'BILLING_QUERY'
  | 'QUALITY_CONCERN';

export type InquiryStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'CLOSED';

export type FeedbackSentiment =
  | 'EXCELLENT'
  | 'SATISFIED'
  | 'NEUTRAL'
  | 'DISSATISFIED'
  | 'ESCALATED';

export interface ClientDirectoryItem {
  id: string;
  clientCode: string;
  companyName: string;
  industry: string;
  primaryContactName: string;
  email: string;
  phone: string;
  billingAddress: string;
  city: string;
  state: string;
  country: string;
  taxGstin?: string;
  creditLimit: number;
  paymentTerms: string;
  totalLifetimeSpend: number;
  accountManager: string;
  isActive: boolean;
  _count?: {
    salesOrders?: number;
    quotations?: number;
    inquiries?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadNote {
  timestamp: string;
  author: string;
  noteText: string;
}

export interface LeadItem {
  id: string;
  leadNumber: string;
  title: string;
  clientId?: string;
  client?: ClientDirectoryItem;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  source: LeadSource;
  priority: LeadPriority;
  stage: PipelineStage;
  estimatedValue: number;
  expectedCloseDate: string;
  assignedSalesRep: string;
  technicalRequirementSummary: string;
  notes?: LeadNote[];
  quotations?: QuotationItem[];
  salesOrders?: SalesOrderCRMItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ManufacturingCostBasisItem {
  itemSku: string;
  itemName: string;
  rawMaterialCost: number;
  machineHours: number;
  laborCost: number;
  overheadCost: number;
  marginPct: number;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface QuotationLineItem {
  itemSku: string;
  itemName: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  lineTotal: number;
  technicalDrawingRef?: string;
}

export interface QuotationRevisionSnapshot {
  revisionNumber: number;
  revisedAt: string;
  revisedBy: string;
  reason: string;
  previousSubtotal: number;
  previousTotal: number;
  previousLineItems: any[];
}

export interface QuotationItem {
  id: string;
  quotationNumber: string;
  revisionNumber: number;
  leadId?: string;
  lead?: LeadItem;
  clientId?: string;
  client?: ClientDirectoryItem;
  clientName: string;
  clientEmail: string;
  status: QuotationStatus;
  validUntilDate: string;
  paymentTerms: string;
  incoterms: string;
  currency: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  manufacturingCostBasis: ManufacturingCostBasisItem[];
  lineItems: QuotationLineItem[];
  preparedBy: string;
  approvedBy?: string;
  revisionsHistory?: QuotationRevisionSnapshot[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesOrderCRMLineItem {
  itemSku: string;
  itemName: string;
  orderedQty: number;
  unitPrice: number;
  lineTotal: number;
  productionBatchScheduleId?: string;
}

export interface SalesOrderCRMItem {
  id: string;
  orderNumber: string;
  leadId?: string;
  lead?: LeadItem;
  quotationId?: string;
  quotation?: QuotationItem;
  clientId: string;
  client: ClientDirectoryItem;
  clientPoNumber: string;
  orderDate: string;
  targetDeliveryDate: string;
  status: SalesOrderCRMStatus;
  currency: string;
  totalAmount: number;
  lineItems: SalesOrderCRMLineItem[];
  productionScheduleLinked: boolean;
  productionWorkOrderRef?: string;
  shippingAddress: string;
  salesRep: string;
  inquiries?: CustomerInquiryItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RateCardEntry {
  itemSku: string;
  lockedUnitPrice: number;
  minAnnualQty: number;
}

export interface ClientContractCRMItem {
  id: string;
  contractRefNumber: string;
  clientId: string;
  client: ClientDirectoryItem;
  contractTitle: string;
  contractType: string;
  startDate: string;
  endDate: string;
  committedAnnualRevenue: number;
  rateCardJson: RateCardEntry[];
  penaltyTerms?: string;
  status: ClientContractCRMStatus;
  signedByClient: boolean;
  accountManager: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerInquiryItem {
  id: string;
  ticketNumber: string;
  clientId: string;
  client: ClientDirectoryItem;
  salesOrderId?: string;
  salesOrder?: SalesOrderCRMItem;
  category: InquiryCategory;
  subject: string;
  description: string;
  priority: LeadPriority;
  status: InquiryStatus;
  assignedAgent: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerFeedbackItem {
  id: string;
  feedbackNumber: string;
  clientId: string;
  client: ClientDirectoryItem;
  sentiment: FeedbackSentiment;
  npsScore: number;
  deliveryRating: number;
  qualityRating: number;
  communicationRating: number;
  feedbackComments: string;
  orderReference?: string;
  actionTaken?: string;
  createdAt?: string;
}

export interface CRMOverviewMetrics {
  activeLeadsCount: number;
  totalPipelineValue: number;
  wonDealsCount: number;
  totalWonRevenue: number;
  conversionRatePct: number;
  averageDealSize: number;
  clientRetentionRatePct: number;
  averageNPS: number;
  totalClientsCount: number;
}

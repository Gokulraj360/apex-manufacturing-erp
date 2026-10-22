export type SubcontractProcessType =
  | 'ELECTROPLATING'
  | 'HEAT_TREATMENT'
  | 'POWDER_COATING'
  | 'ANODIZING'
  | 'CNC_JOB_WORK'
  | 'DIE_CASTING'
  | 'LASER_CUTTING'
  | 'GALVANIZING';

export type JobWorkStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'IN_PROGRESS'
  | 'PARTIALLY_RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type SubcontractChallanType =
  | 'RETURNABLE'
  | 'NON_RETURNABLE';

export type SubcontractChallanStatus =
  | 'DRAFT'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED_TO_VENDOR'
  | 'PARTIALLY_RETURNED'
  | 'FULLY_RETURNED';

export type SubcontractQualityStatus =
  | 'PENDING_INSPECTION'
  | 'QC_PASSED'
  | 'QC_REJECTED'
  | 'CONDITIONALLY_ACCEPTED';

export type SubcontractBillStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PAID'
  | 'DISPUTED';

export interface SubcontractorVendorItem {
  id: string;
  vendorCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  gstinTaxId?: string;
  specializedProcesses: string[];
  qualityRating: number;
  avgTurnaroundDays: number;
  isActive: boolean;
  _count?: {
    jobWorkOrders?: number;
    challans?: number;
    receipts?: number;
    bills?: number;
  };
  createdAt?: string;
}

export interface JobWorkOrderItem {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendor?: SubcontractorVendorItem;
  processType: SubcontractProcessType;
  processDescription: string;
  targetProductPart: string;
  inputItemSku: string;
  outputItemSku: string;
  targetQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  scrapAllowancePercent: number;
  unitProcessingRate: number;
  totalOrderValue: number;
  status: JobWorkStatus;
  issuedDate: string;
  expectedDeliveryDate: string;
  completedDate?: string;
  notes?: string;
  challans?: SubcontractorChallanItem[];
  receipts?: SubcontractorReceiptItem[];
  createdAt?: string;
}

export interface ChallanItemData {
  itemSku: string;
  description: string;
  quantity: number;
  uom: string;
  unitRate: number;
  totalValue: number;
}

export interface SubcontractorChallanItem {
  id: string;
  challanNumber: string;
  challanType: SubcontractChallanType;
  jobWorkOrderId: string;
  jobWorkOrder?: {
    id?: string;
    orderNumber: string;
    processDescription: string;
    targetProductPart: string;
  };
  vendorId: string;
  vendor?: {
    id: string;
    vendorCode: string;
    companyName: string;
    city: string;
  };
  dispatchDate: string;
  expectedReturnDate?: string;
  vehicleNumber?: string;
  transporterName?: string;
  driverContact?: string;
  eWayBillNumber?: string;
  status: SubcontractChallanStatus;
  items: ChallanItemData[];
  totalQuantitySent: number;
  totalValuation: number;
  notes?: string;
  createdAt?: string;
}

export interface SubcontractorReceiptItem {
  id: string;
  receiptNumber: string;
  jobWorkOrderId: string;
  jobWorkOrder?: {
    id?: string;
    orderNumber: string;
    processDescription: string;
    targetProductPart: string;
    targetQuantity: number;
    receivedQuantity: number;
    scrapAllowancePercent: number;
  };
  challanId: string;
  challan?: {
    id: string;
    challanNumber: string;
    totalQuantitySent: number;
    status: SubcontractChallanStatus;
  };
  vendorId: string;
  vendor?: {
    id: string;
    vendorCode: string;
    companyName: string;
  };
  receiptDate: string;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  scrapReported: number;
  qualityStatus: SubcontractQualityStatus;
  inspectorName?: string;
  inspectionRemarks?: string;
  reconciliationVariance: number;
  isReconciliationBalanced: boolean;
  billId?: string;
  createdAt?: string;
}

export interface SubcontractorBillItem {
  id: string;
  billNumber: string;
  vendorInvoiceRef: string;
  vendorId: string;
  vendor?: {
    id: string;
    vendorCode: string;
    companyName: string;
    gstinTaxId?: string;
  };
  jobWorkOrderId: string;
  jobWorkOrder?: {
    id?: string;
    orderNumber: string;
    processDescription: string;
    targetProductPart: string;
  };
  billedQuantity: number;
  processingRate: number;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: SubcontractBillStatus;
  approvedBy?: string;
  approvedAt?: string;
  syncedToFinance: boolean;
  paymentDueDate?: string;
  createdAt?: string;
}

export interface SubcontractorPerformanceLogItem {
  id: string;
  vendorId: string;
  vendor?: SubcontractorVendorItem;
  evaluationPeriod: string;
  totalOrdersEvaluated: number;
  onTimeDeliveryRate: number;
  avgTurnaroundDays: number;
  rejectionRate: number;
  scrapRate: number;
  compositeScore: number;
  vendorTier: string;
  evaluatedBy: string;
  evaluationDate: string;
}

export interface SubcontractingOverviewMetrics {
  totalVendors: number;
  activeVendors: number;
  totalOrders: number;
  activeOrders: number;
  activeWipValuation: number;
  avgRejectionRate: number;
  unbalancedReconciliationCount: number;
  pendingBillAmount: number;
  onTimeTurnaroundRate: number;
  avgTurnaroundDays: number;
}

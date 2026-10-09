export interface CreateVendorBillDto {
  billNumber: string;
  vendorName: string;
  vendorInvoiceNo: string;
  poId?: string;
  grnNumber?: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount?: number;
  totalAmount: number;
  billedQuantity?: number;
}

export interface VerifyThreeWayMatchDto {
  vendorBillId: string;
  poId: string;
  grnNumber?: string;
}

export interface ScheduleVendorPaymentDto {
  vendorBillId: string;
  scheduledDate: string;
  amount: number;
  paymentMethod?: string;
}

export interface RecordVendorPaymentDisbursementDto {
  vendorBillId: string;
  amountPaid: number;
  referenceNo: string;
  bankAccountId: string;
  notes?: string;
}

import { SubcontractBillStatus } from '@prisma/client';

export class CreateSubcontractorBillDto {
  billNumber?: string;
  vendorInvoiceRef: string;
  vendorId: string;
  jobWorkOrderId: string;
  receiptIds: string[];
  billedQuantity: number;
  processingRate: number;
  taxAmount?: number;
  paymentDueDate?: string | Date;
}

export class ApproveSubcontractorBillDto {
  billId: string;
  approvedBy: string;
  decision: 'APPROVE' | 'REJECT';
  notes?: string;
}

export class SyncToFinanceDto {
  billId: string;
  financeLedgerAccountId?: string;
}

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface ChartOfAccountItem {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  description?: string;
  currency: string;
  currentBalance: number;
  isActive: boolean;
  isHeader: boolean;
}

export interface JournalEntryLineItem {
  accountId: string;
  accountCode?: string;
  accountName?: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntryItem {
  id: string;
  entryNumber: string;
  entryDate: string;
  memo: string;
  status: 'DRAFT' | 'POSTED' | 'VOID';
  totalDebit: number;
  totalCredit: number;
  sourceModule: string;
  lines: JournalEntryLineItem[];
  postedAt?: string;
}

export interface AccountingPeriodItem {
  id: string;
  periodName: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  closedAt?: string;
}

export interface VendorBillItem {
  id: string;
  billNumber: string;
  vendorName: string;
  vendorInvoiceNo: string;
  poNumber?: string;
  grnNumber?: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'DRAFT' | 'PENDING_MATCHING' | 'MATCHED' | 'DISCREPANCY' | 'APPROVED' | 'SCHEDULED_FOR_PAYMENT' | 'PAID';
  matchStatus: 'PENDING' | 'EXACT_MATCH' | 'PRICE_DISCREPANCY' | 'QTY_DISCREPANCY' | 'TOTAL_DISCREPANCY';
  discrepancyNotes?: string;
  scheduledPaymentDate?: string;
}

export interface ClientInvoiceItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRatePercentage: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentTerms: string;
  lineItems: Array<{ description: string; quantity: number; unitPrice: number; amount: number }>;
}

export interface CreditNoteItem {
  id: string;
  creditNoteNumber: string;
  clientInvoiceId: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  amount: number;
  reason: string;
  status: 'ISSUED' | 'APPLIED' | 'REFUNDED';
}

export interface TaxReportItem {
  id: string;
  taxPeriod: string;
  reportType: 'GST_RETURN' | 'CORPORATE_TAX' | 'WITHHOLDING_TAX';
  taxableSales: number;
  outputTax: number;
  taxablePurchases: number;
  inputTaxCredit: number;
  netTaxPayable: number;
  status: 'DRAFT' | 'FILED' | 'AUDITED';
  filedAt?: string;
  notes?: string;
}

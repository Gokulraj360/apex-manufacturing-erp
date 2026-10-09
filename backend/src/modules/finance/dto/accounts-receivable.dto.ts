export interface LineItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CreateClientInvoiceDto {
  invoiceNumber: string;
  clientName: string;
  dueDate: string;
  subtotal: number;
  taxRatePercentage?: number;
  lineItems: LineItemDto[];
  paymentTerms?: string;
}

export interface RecordIncomingPaymentDto {
  invoiceId: string;
  amountReceived: number;
  paymentDate?: string;
  referenceNo: string;
  bankAccountId: string;
}

export interface CreateCreditNoteDto {
  clientInvoiceId: string;
  creditNoteNumber: string;
  amount: number;
  reason: string;
}

export class QuerySalaryAuditDto {
  department?: string;
  creditStatus?: 'CREDITED' | 'PENDING' | 'FAILED' | 'MISSED' | 'DISCREPANCY' | 'ALL';
  search?: string;
  batchId?: string;
  page?: number;
  limit?: number;
}

export class ResolveSalaryDiscrepancyDto {
  logId: string;
  resolutionAction: 'RETRY_RTGS' | 'UPDATE_BANK_AND_RETRY' | 'MARK_MANUAL_SETTLED';
  newAccountNumber?: string;
  newIfscCode?: string;
  newBankName?: string;
  notes: string;
  resolvedBy?: string;
}

export class SyncBankGatewayFeedDto {
  batchId?: string;
  initiatedBy?: string;
}

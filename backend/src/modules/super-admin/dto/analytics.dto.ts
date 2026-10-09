export interface DateRangeFilterDto {
  startDate?: string;
  endDate?: string;
}

export interface ApprovePayrollDto {
  payrollId: string;
  notes?: string;
}

export interface ApprovePurchaseOrderDto {
  poId: string;
  decision: 'APPROVE' | 'REJECT';
  justification?: string;
}

export interface UpdateProductionLineDto {
  lineNumber: number;
  actualUnits?: number;
  healthStatus?: 'OPTIMAL' | 'OPERATIONAL_WITH_WARNINGS' | 'MAINTENANCE_REQUIRED' | 'CRITICAL_DOWNTIME' | 'OFFLINE';
  downtimeReason?: string;
  downtimeMinutesAdd?: number;
}

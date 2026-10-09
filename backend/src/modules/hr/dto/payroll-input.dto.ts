export class GeneratePayrollSummaryDto {
  periodMonth!: number; // 1 - 12
  periodYear!: number; // e.g. 2026
}

export class BatchApproveOvertimeDto {
  overtimeRecordIds!: string[];
  approvedBySupervisor!: string;
  periodMonth!: number;
  periodYear!: number;
}

export class ForwardPayrollInputToFinanceDto {
  periodMonth!: number;
  periodYear!: number;
  dispatchedById!: string;
  notes?: string;
}

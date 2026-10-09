export class QueryVendorPerformanceDto {
  vendorId?: string;
  evaluationPeriod?: string;
  vendorTier?: string;
}

export class LogPerformanceEvaluationDto {
  vendorId: string;
  evaluationPeriod: string;
  totalOrdersEvaluated: number;
  onTimeDeliveryRate: number;
  avgTurnaroundDays: number;
  rejectionRate: number;
  scrapRate: number;
  compositeScore: number;
  vendorTier?: string;
  evaluatedBy: string;
}

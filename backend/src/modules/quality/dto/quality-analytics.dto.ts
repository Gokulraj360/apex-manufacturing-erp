export interface RecordSupplierQualityScoreDto {
  supplierName: string;
  periodMonth: string;
  totalLotsReceived: number;
  lotsAccepted: number;
  lotsRejected: number;
  acceptanceRate: number;
  defectPPM: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  certificationStatus?: string;
  evaluatedBy: string;
}

export interface CreateQualityAuditDto {
  standard: 'ISO_9001' | 'IATF_16949' | 'AS_9100' | 'INTERNAL_GMP' | 'SIX_SIGMA';
  auditType: string;
  department: string;
  auditorName: string;
  scorePercentage: number;
  findingsCount: number;
  criticalNonConformances: number;
  correctiveActionStatus: string;
  auditDate?: Date | string;
  nextAuditDate?: Date | string;
  summary?: string;
}

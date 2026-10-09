export interface CreateDefectLogDto {
  sourceStage: 'INCOMING' | 'IN_PROCESS' | 'FINAL';
  itemCode: string;
  itemName: string;
  lotBatchNumber?: string;
  defectCategory: 'DIMENSIONAL' | 'VISUAL' | 'ELECTRICAL' | 'METALLURGICAL' | 'CHEMICAL' | 'CONTAMINATION' | 'PACKAGING';
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'COSMETIC';
  defectReason: string;
  rootCause?: string;
  scrapQuantity: number;
  financialLoss: number;
  actionTaken: 'SCRAP' | 'REWORK' | 'RETURN_TO_VENDOR' | 'USE_AS_IS' | 'QUARANTINE';
  containmentMeasures?: string;
  reportedBy: string;
}

export interface UpdateDefectResolutionDto {
  rootCause?: string;
  actionTaken: 'SCRAP' | 'REWORK' | 'RETURN_TO_VENDOR' | 'USE_AS_IS' | 'QUARANTINE';
  containmentMeasures?: string;
}

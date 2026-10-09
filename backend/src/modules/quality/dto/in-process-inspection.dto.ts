export interface InProcessParameterDto {
  parameter: string;
  standard: string;
  observed: string;
  toleranceDeviation?: number;
  isPass: boolean;
}

export interface CreateInProcessInspectionDto {
  workOrderNumber: string;
  batchNumber: string;
  productionLineId: string;
  stationName: string;
  stage: string;
  parameters: InProcessParameterDto[];
  toleranceDeviation?: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'CONDITIONALLY_ACCEPTED';
  inspectorName: string;
  notes?: string;
}

export interface UpdateInProcessInspectionDto {
  status: 'PASSED' | 'FAILED' | 'CONDITIONALLY_ACCEPTED';
  toleranceDeviation?: number;
  notes?: string;
}

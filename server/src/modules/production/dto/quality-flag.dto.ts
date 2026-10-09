import { DefectSeverity } from '@prisma/client';

export interface LogScrapDto {
  workOrderId: string;
  batchId?: string;
  partNumber: string;
  quantity: number;
  reasonCode: string;
  severity?: DefectSeverity;
  inspectorNotes?: string;
  financialScrapValue?: number;
}

export interface FlagQualityHoldDto {
  wipStockId: string;
  hasQualityHold: boolean;
  qualityNotes: string;
}

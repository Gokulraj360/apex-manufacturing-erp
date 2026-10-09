import { SubcontractQualityStatus } from '@prisma/client';

export class CreateSubcontractorReceiptDto {
  receiptNumber?: string;
  jobWorkOrderId: string;
  challanId: string;
  vendorId: string;
  receiptDate?: string | Date;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity?: number;
  scrapReported?: number;
  inspectorName?: string;
  inspectionRemarks?: string;
}

export class InspectReceiptDto {
  acceptedQuantity: number;
  rejectedQuantity: number;
  scrapReported?: number;
  qualityStatus: SubcontractQualityStatus;
  inspectorName: string;
  inspectionRemarks?: string;
}

export class ReconcileMaterialDto {
  receiptId: string;
  reconciliationNotes?: string;
}

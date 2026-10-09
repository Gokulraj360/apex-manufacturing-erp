import { ToolCribRequisitionStatus } from '@prisma/client';

export class CreateSparePartDto {
  partCode: string;
  partName: string;
  category: string;
  compatibleMachineModels?: string;
  currentStock: number;
  minimumThreshold?: number;
  unitOfMeasure?: string;
  unitCost: number;
  cribBinLocation: string;
  supplierName?: string;
  leadTimeDays?: number;
}

export class UpdateSparePartDto {
  partName?: string;
  category?: string;
  compatibleMachineModels?: string;
  minimumThreshold?: number;
  unitCost?: number;
  cribBinLocation?: string;
  supplierName?: string;
  leadTimeDays?: number;
}

export class AdjustStockDto {
  adjustmentQuantity: number;
  reason: string;
  adjustedBy: string;
}

export class CreateToolCribRequisitionDto {
  sparePartId: string;
  breakdownTicketId?: string;
  maintenanceScheduleId?: string;
  quantity: number;
  requestedBy: string;
  purposeNotes?: string;
}

export class ApproveRequisitionDto {
  approvedBy: string;
  decision: 'APPROVE' | 'REJECT';
  notes?: string;
}

export class IssueRequisitionDto {
  issuedBy: string;
  notes?: string;
}

import {
  BreakdownSeverity,
  BreakdownTicketStatus,
} from '@prisma/client';

export class CreateBreakdownTicketDto {
  assetId: string;
  reportedBy: string;
  severity: BreakdownSeverity;
  failureCategory: string;
  symptomDescription: string;
  breakdownStartedAt?: string | Date;
}

export class AssignTechnicianDto {
  assignedTechnician: string;
}

export class UpdateBreakdownProgressDto {
  status: BreakdownTicketStatus;
  assignedTechnician?: string;
  failureCategory?: string;
  rootCause?: string;
  correctiveActionTaken?: string;
  downtimeHours?: number;
  repairCostEstimate?: number;
}

export class ResolveBreakdownTicketDto {
  rootCause: string;
  correctiveActionTaken: string;
  downtimeHours: number;
  repairCostEstimate?: number;
  repairCompletedAt?: string | Date;
  resolvedBy: string;
  replacementPartsUsed?: Array<{ sparePartId: string; quantity: number }>;
}

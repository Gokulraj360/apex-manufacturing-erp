import { WorkOrderStatus, ProductionBatchStatus } from '@prisma/client';

export interface MilestoneItemDto {
  milestoneName: string;
  targetDate: string;
  isCompleted: boolean;
  completionPercentage: number;
}

export interface CreateWorkOrderDto {
  orderNumber?: string;
  bomId: string;
  targetQuantity: number;
  dueDate: string;
  assignedLineNumber?: number;
  assignedSupervisor?: string;
  milestones?: MilestoneItemDto[];
}

export interface UpdateWorkOrderStatusDto {
  workOrderId: string;
  status: WorkOrderStatus;
  notes?: string;
}

export interface CreateBatchDto {
  workOrderId: string;
  batchNumber?: string;
  plannedUnits: number;
  currentStation?: string;
  operatorId?: string;
}

export interface ControlBatchDto {
  batchId: string;
  action: 'START' | 'PAUSE' | 'COMPLETE' | 'REJECT';
  producedUnits?: number;
  defectiveUnits?: number;
  notes?: string;
}

export interface UpdateMilestoneDto {
  workOrderId: string;
  milestoneIndex: number;
  isCompleted: boolean;
  completionPercentage: number;
}

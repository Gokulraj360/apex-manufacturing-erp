export class CreateTaskDelegationDto {
  department: string;
  departmentLabel: string;
  managerId: string;
  managerName: string;
  managerRole: string;
  assistantId: string;
  assistantName: string;
  assistantRole: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: string; // ISO date string
}

export class UpdateTaskProgressDto {
  status?: 'PENDING' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'REJECTED';
  progressPercentage?: number; // 0 to 100
  notes?: string;
  updatedBy: string;
  userRole: string;
  completionNotes?: string;
  reviewRemarks?: string;
}

export class TaskFilterDto {
  department?: string;
  status?: string;
  priority?: string;
  assistantId?: string;
  managerId?: string;
}

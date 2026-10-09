export type LeaveTypeEnum =
  | 'CASUAL'
  | 'MEDICAL'
  | 'SICK'
  | 'EARNED'
  | 'MATERNITY_PATERNITY';

export type LeaveRecipientTypeEnum = 'DEPARTMENT_MANAGER' | 'HR';

export type LeaveStatusEnum = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export class CreateLeaveRequestDto {
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  departmentLabel?: string;
  leaveType: LeaveTypeEnum;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  durationDays?: number;
  reason: string;
  recipientType?: LeaveRecipientTypeEnum;
  targetApproverId?: string;
  targetApproverName?: string;
}

export class ReviewLeaveRequestDto {
  status: 'APPROVED' | 'REJECTED';
  approverComments?: string;
  reviewedBy: string;
  reviewedRole: string;
}

export class LeaveFilterDto {
  employeeId?: string;
  department?: string;
  recipientType?: LeaveRecipientTypeEnum;
  targetApproverId?: string;
  status?: LeaveStatusEnum;
  leaveType?: LeaveTypeEnum;
}

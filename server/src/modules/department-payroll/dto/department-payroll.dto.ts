export class WorkerAttendanceInputDto {
  workerId: string; // e.g. 'EMP-2026-0101'
  workerName: string; // e.g. 'Rameshwar Patil'
  role: string; // e.g. 'Circuit Board Pick-and-Place Operator'
  department?: string; // e.g. 'Phone Assembly Line 1'
  totalWorkingDays?: number; // default 26
  daysPresent: number; // e.g. 26
  overtimeHours: number; // e.g. 12
  baseSalaryRate: number; // full monthly basic pay e.g. 18000
  allowances?: number; // e.g. 2000
  remarks?: string;
  isTurnstileVerified?: boolean;
}

export class CalculateSalaryPreviewDto {
  baseSalaryRate: number;
  daysPresent: number;
  totalWorkingDays?: number;
  overtimeHours?: number;
  allowances?: number;
}

export class CreateDepartmentPayrollSheetDto {
  department: string;
  departmentCode?: string;
  managerId: string;
  managerName: string;
  monthYear: string; // e.g. 'October 2026'
  month: string;
  year: number;
  workingDaysInMonth?: number;
  managerNotes?: string;
  records: WorkerAttendanceInputDto[];
}

export class SubmitDepartmentPayrollSheetDto {
  sheetId: string;
  managerNotes?: string;
}

export class ReviewDepartmentPayrollDto {
  sheetId: string;
  reviewerRole: 'HR' | 'FINANCE' | 'SUPER_ADMIN';
  reviewerId: string;
  reviewerName: string;
  decision: 'APPROVE' | 'FLAG' | 'REVISE';
  notes?: string;
}

export class FinalApproveAndClearDto {
  sheetId: string;
  financeOfficerId: string;
  financeOfficerName: string;
  notes?: string;
}

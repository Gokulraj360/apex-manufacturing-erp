export interface WorkerAttendanceSalaryRecord {
  id: string;
  sheetId: string;
  workerId: string;
  workerName: string;
  role: string;
  department: string;
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  overtimeHours: number;
  baseSalaryRate: number;
  basicPay: number;
  overtimePay: number;
  allowances: number;
  grossPay: number;
  esiDeduction: number;
  pfDeduction: number;
  professionalTax: number;
  totalDeductions: number;
  netPayable: number;
  remarks?: string;
  isTurnstileVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type DepartmentPayrollStatus = 'DRAFT' | 'SUBMITTED_TO_REVIEW' | 'APPROVED_BY_FINANCE' | 'REJECTED';
export type ReviewDecisionStatus = 'PENDING' | 'APPROVED' | 'FLAGGED';

export interface DepartmentPayrollSheet {
  id: string;
  department: string;
  departmentCode: string;
  managerId: string;
  managerName: string;
  monthYear: string;
  month: string;
  year: number;
  workingDaysInMonth: number;
  totalWorkers: number;
  totalGrossAmount: number;
  totalEsiAmount: number;
  totalPfAmount: number;
  totalAmount: number; // Net total
  status: DepartmentPayrollStatus;
  managerNotes?: string;
  submittedAt?: string | null;

  // Review & audit tracking
  hrReviewerId?: string | null;
  hrReviewerName?: string | null;
  hrNotes?: string | null;
  hrStatus: ReviewDecisionStatus;
  hrReviewedAt?: string | null;

  financeReviewerId?: string | null;
  financeReviewerName?: string | null;
  financeNotes?: string | null;
  financeStatus: ReviewDecisionStatus;
  financeReviewedAt?: string | null;

  superAdminReviewerId?: string | null;
  superAdminReviewerName?: string | null;
  superAdminNotes?: string | null;
  superAdminStatus: ReviewDecisionStatus;
  superAdminReviewedAt?: string | null;

  clearanceReference?: string | null;
  records: WorkerAttendanceSalaryRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentTemplate {
  department: string;
  departmentCode: string;
  managerName: string;
  managerId: string;
  workers: Array<{
    workerId: string;
    workerName: string;
    role: string;
    baseSalaryRate: number;
    daysPresent: number;
    overtimeHours: number;
    allowances: number;
  }>;
}

export interface DepartmentSummaryMetrics {
  totalSheets: number;
  submittedSheets: number;
  approvedSheets: number;
  draftSheets: number;
  totalDisbursementApproved: number;
  totalDisbursementUnderReview: number;
  totalWorkersManaged: number;
}

export interface EmployeeSalaryStructure {
  basicSalary: number;
  hraAllowance: number;
  conveyanceAllowance: number;
  specialAllowance: number;
  grossSalary: number;
  esiDeduction: number;
  pfDeduction: number;
  professionalTax: number;
  totalDeductions: number;
  netSalary: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber?: string | null;
  uanNumber?: string | null;
  esiNumber?: string | null;
  paymentMode: string;
}

export interface EmployeeCredentialItem {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  nationalId?: string | null;
  address?: string | null;
  role: string;
  roleTitle: string;
  department: string;
  accessPermissions: string[];
  username: string;
  isActive: boolean;
  status?: 'ACTIVE' | 'TERMINATED';
  password?: string;
  terminationDetails?: {
    date: string;
    reason: string;
    notes?: string;
    terminatedBy?: string;
  };
  employmentType: string;
  dateOfJoining: string;
  salaryStructure: EmployeeSalaryStructure;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollLineItem {
  id: string;
  payrollBatchId: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  payableDays: number;
  presentDays: number;
  leaveDays: number;
  overtimeHours: number;
  basicSalary: number;
  allowances: number;
  grossEarnings: number;
  esiDeduction: number;
  pfDeduction: number;
  totalDeductions: number;
  netPayout: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  paymentStatus: 'PENDING' | 'VERIFIED' | 'PROCESSED';
}

export interface PayrollBatchItem {
  id: string;
  batchNumber: string;
  month: string;
  year: number;
  periodLabel: string;
  totalHeadcount: number;
  grossTotal: number;
  totalEsi: number;
  totalPf: number;
  totalNetPayout: number;
  submittedBy: string;
  submittedById?: string | null;
  status: 'PENDING_FINANCE_VERIFICATION' | 'VERIFIED' | 'RELEASED' | 'REJECTED';
  financeApproverId?: string | null;
  financeApproverName?: string | null;
  financeNotes?: string | null;
  bankDisbursementRef?: string | null;
  submittedAt: string;
  verifiedAt?: string | null;
  releasedAt?: string | null;
  lineItems: PayrollLineItem[];
  createdAt: string;
  updatedAt: string;
}

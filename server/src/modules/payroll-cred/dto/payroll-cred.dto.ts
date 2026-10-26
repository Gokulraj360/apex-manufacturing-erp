export class CreateCredentialDto {
  employeeId: string; // e.g. 'EMP-2026-0101'
  name: string; // e.g. 'Rameshwar Patil'
  email: string;
  phone: string;
  nationalId?: string; // Aadhaar / National ID
  address?: string;
  role: string; // e.g. 'production', 'quality', 'finance'
  roleTitle: string; // e.g. 'SMT Machine Operator'
  department: string; // e.g. 'Precision Subassembly Lines'
  accessPermissions?: string[];
  username: string;
  password?: string;
  employmentType?: 'FULL_TIME' | 'CONTRACT' | 'SHIFT_WORKER' | 'TRAINEE';
  
  // Salary Component Breakdown
  basicSalary: number; // ₹
  hraAllowance?: number; // House Rent Allowance
  conveyanceAllowance?: number; // Conveyance
  specialAllowance?: number; // Special Allowance
  
  // Bank Details
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber?: string;
  uanNumber?: string; // Universal Account Number (PF)
  esiNumber?: string; // ESI Insurance IP Number
  paymentMode?: 'DIRECT_BANK_TRANSFER' | 'NEFT' | 'RTGS' | 'CHEQUE';
}

export class UpdateCredentialDto {
  name?: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  address?: string;
  role?: string;
  roleTitle?: string;
  department?: string;
  accessPermissions?: string[];
  isActive?: boolean;
  
  // Salary Updates
  basicSalary?: number;
  hraAllowance?: number;
  conveyanceAllowance?: number;
  specialAllowance?: number;
  
  // Bank Updates
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  panNumber?: string;
  uanNumber?: string;
  esiNumber?: string;
  paymentMode?: 'DIRECT_BANK_TRANSFER' | 'NEFT' | 'RTGS' | 'CHEQUE';
}

export class CalculateSalaryPreviewDto {
  basicSalary: number;
  hraAllowance?: number;
  conveyanceAllowance?: number;
  specialAllowance?: number;
}

export class SubmitPayrollBatchDto {
  month: string; // e.g. 'October'
  year: number; // e.g. 2026
  submittedBy: string; // e.g. 'Deepak Chawla (HR Lead)'
  submittedById?: string;
  notes?: string;
  filterDepartment?: string;
}

export class FinanceVerifyBatchDto {
  financeApproverId: string;
  financeApproverName: string;
  notes?: string;
}

export class FinanceReleasePayoutDto {
  financeApproverId: string;
  financeApproverName: string;
  bankDisbursementRef?: string; // e.g. 'HDFC-RTGS-992014'
  notes?: string;
}

export class FinanceRejectBatchDto {
  financeApproverId: string;
  financeApproverName: string;
  reason: string;
}

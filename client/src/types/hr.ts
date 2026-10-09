export type EmploymentStatus =
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'TERMINATED'
  | 'PROBATION'
  | 'NOTICE_PERIOD';

export type EmploymentType =
  | 'FULL_TIME'
  | 'CONTRACT'
  | 'TEMPORARY'
  | 'APPRENTICE'
  | 'SHIFT_WORKER';

export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'HALF_DAY'
  | 'LATE'
  | 'ON_DUTY'
  | 'LEAVE';

export type LeaveType =
  | 'CASUAL'
  | 'SICK'
  | 'EARNED'
  | 'MATERNITY'
  | 'PATERNITY'
  | 'COMPENSATORY_OFF';

export type LeaveStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type JobOpeningStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'INTERVIEWING'
  | 'OFFERED'
  | 'CLOSED'
  | 'ON_HOLD';

export type CandidateInterviewStage =
  | 'APPLIED'
  | 'SCREENING'
  | 'TECHNICAL'
  | 'HR_INTERVIEW'
  | 'OFFER_EXTENDED'
  | 'HIRED'
  | 'REJECTED';

export type ComplianceDocumentType =
  | 'FACTORIES_ACT'
  | 'PF_ESI_COMPLIANCE'
  | 'OSHA_SAFETY'
  | 'MINIMUM_WAGES'
  | 'GRATUITY'
  | 'INDUSTRIAL_DISPUTES';

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headOfDepartment?: string;
  budget?: number;
  _count?: {
    employees?: number;
    jobOpenings?: number;
  };
}

export interface DesignationItem {
  id: string;
  title: string;
  code: string;
  level: number;
  minSalary?: number;
  maxSalary?: number;
  _count?: {
    employees?: number;
  };
}

export interface EmployeeItem {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  department?: DepartmentItem;
  designationId: string;
  designation?: DesignationItem;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
  dateOfJoining: string;
  dateOfLeaving?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  panOrTaxId?: string;
  aadhaarOrNationalId?: string;
  bankAccountNumber?: string;
  bankIfscOrRouting?: string;
  baseSalary: number;
  hourlyOvertimeRate: number;
  userId?: string;
  onboardingDocuments?: OnboardingDocumentItem[];
  safetyTrainingRecords?: SafetyTrainingRecordItem[];
  _count?: {
    attendanceLogs?: number;
    leaveRequests?: number;
    safetyTrainingRecords?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceLogItem {
  id: string;
  employeeId: string;
  employee?: EmployeeItem;
  date: string;
  clockIn?: string;
  clockOut?: string;
  totalHours?: number;
  status: AttendanceStatus;
  biometricDeviceId?: string;
  locationCoordinates?: string;
  isRegularized: boolean;
  regularizationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftRosterItem {
  id: string;
  employeeId: string;
  employee?: EmployeeItem;
  shiftName: string;
  shiftCode: string;
  startTime: string;
  endTime: string;
  effectiveStartDate: string;
  effectiveEndDate?: string;
  weekOffDay: string;
  isRotational: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequestItem {
  id: string;
  employeeId: string;
  employee?: EmployeeItem;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OvertimeRecordItem {
  id: string;
  employeeId: string;
  employee?: EmployeeItem;
  date: string;
  overtimeHours: number;
  hourlyRate: number;
  calculatedAmount: number;
  reason: string;
  isApproved: boolean;
  approvedBySupervisor?: string;
  dispatchedToPayroll: boolean;
  payrollMonth?: number;
  payrollYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobOpeningItem {
  id: string;
  requisitionNumber: string;
  title: string;
  departmentId: string;
  department?: DepartmentItem;
  designationId: string;
  designation?: DesignationItem;
  openingsCount: number;
  hiredCount: number;
  jobDescription: string;
  requiredExperienceYears: number;
  status: JobOpeningStatus;
  postedDate: string;
  targetClosingDate?: string;
  candidates?: CandidateInterviewItem[];
  _count?: {
    candidates?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CandidateInterviewItem {
  id: string;
  jobOpeningId: string;
  jobOpening?: JobOpeningItem;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  currentEmployer?: string;
  experienceYears?: number;
  resumeUrl?: string;
  currentStage: CandidateInterviewStage;
  interviewScore?: number;
  interviewerNotes?: string;
  interviewScheduledAt?: string;
  offeredCtc?: number;
  offerAccepted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingDocumentItem {
  id: string;
  employeeId: string;
  documentName: string;
  documentType: string;
  documentUrl: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyTrainingRecordItem {
  id: string;
  employeeId: string;
  employee?: EmployeeItem;
  trainingProgramName: string;
  trainerAgency: string;
  trainingDate: string;
  validityExpiryDate?: string;
  certificateNumber?: string;
  passedAssessment: boolean;
  assessmentScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LaborComplianceDocumentItem {
  id: string;
  complianceTitle: string;
  documentCategory: ComplianceDocumentType;
  statutoryAuthority: string;
  filingPeriod: string;
  filingDate: string;
  nextRenewalDate?: string;
  acknowledgementNumber?: string;
  documentUrl?: string;
  complianceStatus: 'COMPLIANT' | 'ACTION_REQUIRED' | 'EXPIRED';
  auditedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyPayrollSummaryItem {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  department: string;
  designation: string;
  baseSalary: number;
  daysPresent: number;
  daysHalfDay: number;
  daysAbsent: number;
  totalLeavesApproved: number;
  approvedOvertimeHours: number;
  overtimePayoutAmount: number;
  grossEstimated: number;
}

export interface MonthlyPayrollOverview {
  periodMonth: number;
  periodYear: number;
  totalEmployees: number;
  totalGross: number;
  totalOvertime: number;
  summaryItems: MonthlyPayrollSummaryItem[];
}

export interface HeadcountTelemetry {
  totalHeadcount: number;
  activeHeadcount: number;
  onLeaveHeadcount: number;
  probationHeadcount: number;
  byDepartment: Array<{
    id: string;
    name: string;
    code: string;
    _count: { employees: number };
  }>;
}

export interface ComplianceIndex {
  totalComplianceDocs: number;
  compliantCount: number;
  totalTrainings: number;
  statutoryComplianceRate: number;
  safetyPassRate: number;
}

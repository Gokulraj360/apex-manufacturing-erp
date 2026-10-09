export type WorkstationRole =
  | 'PRIMARY_OPERATOR'
  | 'ASSISTANT_OPERATOR'
  | 'LINE_LEAD'
  | 'QUALITY_CHECKER'
  | 'MAINTENANCE_TECH'
  | 'TRAINEE';

export type DeploymentStatus =
  | 'ACTIVE'
  | 'COMPLETED'
  | 'REASSIGNED'
  | 'STANDBY'
  | 'CANCELLED';

export type DeptAttendanceStatus =
  | 'PRESENT'
  | 'LATE_ARRIVAL'
  | 'HALF_DAY'
  | 'ON_LEAVE'
  | 'ABSENT'
  | 'ON_DUTY';

export type DeptLeaveType =
  | 'CASUAL'
  | 'SICK'
  | 'EARNED'
  | 'COMPENSATORY_OFF'
  | 'UNPAID_LEAVE'
  | 'NONE';

export type DeptPayrollHandoffStatus =
  | 'PENDING_AUDIT'
  | 'VERIFIED'
  | 'EXPORTED_TO_PAYROLL'
  | 'RECONCILED';

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headOfDepartment?: string;
  budget?: number;
}

export interface EmployeeBrief {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  department?: DepartmentItem;
  designation?: {
    id?: string;
    title: string;
    code?: string;
  };
}

export interface MachineAssetBrief {
  id: string;
  assetTag: string;
  assetName: string;
  category: string;
  modelNumber: string;
  facilityLocation?: string;
  status?: string;
}

export interface DepartmentWorkstationAssignmentItem {
  id: string;
  assignmentCode: string;
  employeeId: string;
  employee: EmployeeBrief;
  departmentId: string;
  department: DepartmentItem;
  stationIdentifier: string;
  machineAssetId?: string;
  machineAsset?: MachineAssetBrief;
  shiftCode: string; // e.g. SHIFT_A, SHIFT_B, SHIFT_C
  assignmentDate: string;
  roleOnStation: WorkstationRole;
  status: DeploymentStatus;
  certificationVerified: boolean;
  supervisorRemarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentAttendanceItem {
  id: string;
  attendanceCode: string;
  employeeId: string;
  employee: EmployeeBrief;
  departmentId: string;
  department: DepartmentItem;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  plannedHours: number;
  actualHours: number;
  overtimeHours: number;
  overtimeApproved: boolean;
  overtimeReason?: string;
  status: DeptAttendanceStatus;
  leaveType?: DeptLeaveType;
  leaveApprovedBy?: string;
  biometricVerification: boolean;
  supervisorNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentTargetOutputItem {
  id: string;
  targetCode: string;
  departmentId: string;
  department: DepartmentItem;
  employeeId: string;
  employee: EmployeeBrief;
  workstationAssignmentId?: string;
  workstationAssignment?: {
    id: string;
    assignmentCode: string;
    stationIdentifier: string;
    roleOnStation: WorkstationRole;
  };
  workstationOrLine: string;
  productSku: string;
  productName: string;
  shiftDate: string;
  shiftCode: string;
  targetQuantity: number;
  actualQuantity: number;
  rejectedQuantity: number;
  reworkQuantity: number;
  efficiencyRatePct: number;
  downtimeMinutes: number;
  downtimeReason?: string;
  supervisorSignoff?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MachineCertificationCheckItem {
  id: string;
  checkCode: string;
  employeeId: string;
  employee: EmployeeBrief;
  machineAssetId?: string;
  machineAsset?: MachineAssetBrief;
  machineModel: string;
  certificationType: string;
  certifyingBody: string;
  certificationNumber: string;
  issueDate: string;
  expiryDate: string;
  isValid: boolean;
  safetyScore?: number;
  lastIncidentDate?: string;
  verifiedBy: string;
  verifiedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentLaborMetricItem {
  id: string;
  metricCode: string;
  departmentId: string;
  department: DepartmentItem;
  metricDate: string;
  shiftCode: string;
  totalScheduledWorkers: number;
  totalPresentWorkers: number;
  attendanceRatePct: number;
  totalTargetOutput: number;
  totalActualOutput: number;
  productionEfficiencyPct: number;
  totalOvertimeHours: number;
  laborUtilizationRatePct: number;
  payrollStatus: DeptPayrollHandoffStatus;
  auditedBy?: string;
  auditedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentWorkforceOverviewMetrics {
  activeDeployments: number;
  totalActiveWorkers: number;
  todayPresentWorkers: number;
  todayAttendanceRate: number;
  todayTotalOvertimeHours: number;
  averageProductionEfficiencyPct: number;
  payrollHandoffReady: boolean;
}

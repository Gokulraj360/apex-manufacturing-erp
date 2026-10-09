export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'SECURITY_ALERT';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'PERMISSION_GRANT'
  | 'PERMISSION_REVOKE'
  | 'PAYROLL_SIGN_OFF'
  | 'PO_APPROVAL'
  | 'CONTRACT_APPROVAL'
  | 'SYSTEM_CONFIG_CHANGE'
  | 'SECURITY_BREACH_DETECTED';

export type ProductionLineHealth =
  | 'OPTIMAL'
  | 'OPERATIONAL_WITH_WARNINGS'
  | 'MAINTENANCE_REQUIRED'
  | 'CRITICAL_DOWNTIME'
  | 'OFFLINE';

export type POStatus =
  | 'DRAFT'
  | 'PENDING_SUPERVISOR'
  | 'PENDING_EXECUTIVE_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'FULFILLED';

export type PayrollStatus =
  | 'CALCULATED'
  | 'PENDING_EXECUTIVE_SIGNOFF'
  | 'APPROVED'
  | 'DISBURSED'
  | 'AUDITED';

export interface Permission {
  id: string;
  action: string;
  resource: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  hierarchyLevel: number;
  permissions: {
    permissionId: string;
    permission: Permission;
  }[];
  _count?: {
    users: number;
  };
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  details: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity: AuditSeverity;
  tamperChecksum: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: { name: string };
  };
}

export interface FinancialSummary {
  revenue: number;
  cogs: number;
  operatingExpense: number;
  netProfit: number;
  netMargin: number;
  freeCashFlow: number;
  taxLiability: number;
  currency: string;
  asOfDate: string;
}

export interface ProductionTelemetryItem {
  id: string;
  lineNumber: number;
  lineName: string;
  currentSKU?: string;
  targetUnits: number;
  actualUnits: number;
  uptimeMinutes: number;
  downtimeMinutes: number;
  healthStatus: ProductionLineHealth;
  defectRatePpm: number;
  activeOperators: number;
  efficiencyPercentage: number;
  downtimeReason?: string;
  lastMaintenance?: string;
}

export interface PurchaseOrderItem {
  id: string;
  poNumber: string;
  supplierName: string;
  totalAmount: number;
  currency: string;
  isHighValue: boolean;
  status: POStatus;
  items: Array<{ partId: string; partName: string; quantity: number; unitPrice: number }>;
  justification?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface PayrollRecordItem {
  id: string;
  periodMonth: number;
  periodYear: number;
  totalGross: number;
  totalNet: number;
  taxDeductions: number;
  benefitsTotal: number;
  employeeCount: number;
  status: PayrollStatus;
  approvedAt?: string;
  approvalNotes?: string;
  approvedBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

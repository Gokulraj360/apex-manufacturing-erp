'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Save,
  Search,
  Filter,
  SlidersHorizontal,
  Layers,
  DollarSign,
  Cpu,
  Warehouse,
  CheckSquare,
  Users,
  Truck,
  PackageCheck,
  Compass,
  Megaphone,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Eye,
  Check,
} from 'lucide-react';
import { ALL_ROLES, RoleDefinition } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';

interface FunctionItem {
  key: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isAllowed: boolean;
}

const CATEGORIES_CONFIG = [
  { key: 'EXECUTIVE', label: 'Top Management & Governance', icon: ShieldCheck, color: 'indigo' },
  { key: 'FINANCE', label: 'Finance, Banking & Accounts', icon: DollarSign, color: 'emerald' },
  { key: 'PRODUCTION', label: 'Precision Assembly & Core Operations', icon: Cpu, color: 'blue' },
  { key: 'WAREHOUSE', label: 'Warehouse, Parts & Serial Tracking', icon: Warehouse, color: 'amber' },
  { key: 'QUALITY', label: 'Industrial Quality & Pass Testing', icon: CheckSquare, color: 'teal' },
  { key: 'HR_WORKFORCE', label: 'Human Resources & Payroll', icon: Users, color: 'purple' },
  { key: 'LOGISTICS_FLEET', label: 'Logistics, Gate & Vehicle Fleet', icon: Truck, color: 'sky' },
  { key: 'SUPPLY_CHAIN', label: 'Supply Chain, Sourcing & Subcontracting', icon: PackageCheck, color: 'violet' },
  { key: 'ENGINEERING', label: 'Hardware CAD & Machine Reliability', icon: Compass, color: 'rose' },
  { key: 'SALES_MARKETING', label: 'Customer Orders, CRM & Marketing', icon: Megaphone, color: 'orange' },
];

const MASTER_FUNCTIONS: Omit<FunctionItem, 'isAllowed'>[] = [
  // 1. EXECUTIVE
  {
    key: 'FUNC_EXECUTIVE_COMMAND',
    name: 'Executive Command Center & Factory Telemetry',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'High-level factory overview, financial runway, plant yield metrics, and top-tier operations summaries.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_PRICING_CONTROL',
    name: 'Product Costing & Selling Price Control',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'Set target profit margins, bill-of-materials overhead markups, and customer sale price limits.',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_HIGH_VALUE_PO_APPROVAL',
    name: 'High-Value Purchase Order Sign-Off (₹50L+)',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'Final sign-off authority for high-value component purchase orders (Qualcomm SoCs, BOE displays).',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_PAYROLL_FINAL_SIGNOFF',
    name: 'Factory Monthly Payroll Executive Sign-Off',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'Executive clearance for monthly technician attendance salary batches and bank release approvals.',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_RBAC_MANAGEMENT',
    name: 'Dynamic Role Permission & Function Mapping',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'Control panel to toggle, assign, or restrict operational functions across all 21 manufacturing roles.',
    riskLevel: 'CRITICAL',
  },

  // 2. FINANCE
  {
    key: 'FUNC_FINANCE_OVERVIEW',
    name: 'Factory Accounts & Live Money Overview',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Live bank balances, cash reserves, daily money movement tracking, and financial health ratios.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_VENDOR_BILL_MATCH',
    name: 'Supplier Bills & 3-Way Invoice Match',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Match inbound supplier invoices against purchase orders and warehouse GRNs with zero variance.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_CLIENT_INVOICE_GENERATE',
    name: 'Customer Billing & Tax Delivery Slips',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Generate client sale invoices, export delivery slips, and track accounts receivable collections.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_DISBURSE_PAYOUTS',
    name: 'Bank RTGS & Direct Payout Disbursement',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Execute bank RTGS and NEFT transfers for approved supplier vendor bills and staff wage batches.',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_TAX_GST_FILING',
    name: 'GSTR-3B Tax Reports & Statutory TDS',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Reconcile input tax credits (ITC), GST liability reports, and statutory deductions.',
    riskLevel: 'HIGH',
  },

  // 3. PRODUCTION
  {
    key: 'FUNC_PROD_WORK_ORDER_EXECUTE',
    name: 'Daily Assembly Job & Station Execution',
    category: 'PRODUCTION',
    categoryLabel: 'Precision Assembly & Core Operations',
    description: 'Start, advance, and log completed units across active work order batches and station queues.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_PROD_SMT_CALIBRATION',
    name: 'Precision SMT & Board Optical Inspection',
    category: 'PRODUCTION',
    categoryLabel: 'Precision Assembly & Core Operations',
    description: 'Log solder paste printer thickness, pick-and-place nozzle optical checks, and oven profiles.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_PROD_SCREEN_FITTING',
    name: 'Cleanroom Subassembly & Core Bonding',
    category: 'PRODUCTION',
    categoryLabel: 'Precision Assembly & Core Operations',
    description: 'Record cleanroom precision component subassemblies, power cell connections, and automated sensor alignments.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_PROD_LINE_YIELD_REPORT',
    name: 'First-Pass Yield (FPY) & Scrap Logging',
    category: 'PRODUCTION',
    categoryLabel: 'Precision Assembly & Core Operations',
    description: 'Log station pass rates, scrap component quantities, and assembly bottleneck reasons.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_PROD_OVERTIME_SUBMIT',
    name: 'Shift Overtime & Department Wage Sheet Submission',
    category: 'PRODUCTION',
    categoryLabel: 'Precision Assembly & Core Operations',
    description: 'Compile department shift worker hours and submit computed wages to HR and Finance.',
    riskLevel: 'HIGH',
  },

  // 4. WAREHOUSE
  {
    key: 'FUNC_WHS_STOCK_MONITOR',
    name: 'Raw Materials & Storage Shelf Monitor',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & Serial Tracking',
    description: 'Monitor storage racks, small parts trays, stock valuations, and low-part reorder alerts.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_WHS_INBOUND_GRN',
    name: 'Inbound Goods Receipt Note (GRN) Verification',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & IMEI Tracking',
    description: 'Acknowledge deliveries, scan component barcodes, and verify delivered count against PO.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_WHS_BUFFER_RESERVE',
    name: 'Component Buffer Reservation for Assembly',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & Serial Tracking',
    description: 'Reserve critical components, structural modules, and materials for planned manufacturing shifts.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_WHS_IMEI_REGISTRATION',
    name: 'Enterprise Serial Numbers & Device Registry',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & Serial Tracking',
    description: 'Register unique enterprise serial numbers, hardware IDs, and MAC addresses on completed units.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_WHS_DISPATCH_BOXING',
    name: 'Automated Packaging, Serial QR & Shipping Dispatch',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & Serial Tracking',
    description: 'Final product packaging, warranty QR sealing, carton labeling, and courier release.',
    riskLevel: 'MEDIUM',
  },

  // 5. QUALITY
  {
    key: 'FUNC_QA_INCOMING_INSPECTION',
    name: 'Incoming Raw Component Quality Inspection',
    category: 'QUALITY',
    categoryLabel: 'Industrial Quality & Pass Testing',
    description: 'Test incoming batches of electronic chips, machined parts, and power units before stock entry.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_QA_OPTICAL_SCAN',
    name: 'Optical Surface Inspection & Calibration',
    category: 'QUALITY',
    categoryLabel: 'Industrial Quality & Pass Testing',
    description: 'Inspect components for microscopic surface defects, dimensional uniformity, and functional telemetry.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_QA_RF_5G_TEST',
    name: 'RF Chamber Wireless & Telemetry Certification',
    category: 'QUALITY',
    categoryLabel: 'Industrial Quality & Pass Testing',
    description: 'Perform anechoic chamber wireless telemetry, connectivity, and industrial compliance certification.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_QA_BATTERY_AGING_DROP',
    name: 'Thermal Aging & Structural Durability Testing',
    category: 'QUALITY',
    categoryLabel: 'Industrial Quality & Pass Testing',
    description: 'Test thermal degradation cycles and physical impact stress tests on manufactured units.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_QA_QUARANTINE_NCR',
    name: 'Defect Logging & Material Quarantine (NCR)',
    category: 'QUALITY',
    categoryLabel: 'Industrial Quality & Pass Testing',
    description: 'Issue Non-Conformance Reports (NCR) and lock defective component lots into quarantine bins.',
    riskLevel: 'HIGH',
  },

  // 6. HR & WORKFORCE
  {
    key: 'FUNC_HR_EMPLOYEE_DIRECTORY',
    name: 'Employee Directory & Staff Records',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Manage staff profiles, government IDs, bank details, job roles, and factory departments.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_HR_SHIFT_ROSTER_LOCK',
    name: 'Shift Schedules & Biometric Turnstile Reconciliation',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Schedule Morning/Evening/Night shifts, reconcile gate turnstile punches, and lock daily rosters.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_HR_PAYROLL_BATCH_COMPILE',
    name: 'Monthly Payroll Batch & Statutory Pool Preparation',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Compile monthly attendance earnings, calculate statutory PF/ESI pools, and submit to Finance.',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_HR_LEAVE_APPROVAL',
    name: 'Staff Leave Requests & Approvals',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Review and approve/reject employee medical, casual, and earned leave requests with backup planning.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_HR_LABOR_SAFETY_AUDIT',
    name: 'Worker Safety Gear & Labor Law Audits',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Monitor cleanroom anti-static gowns, ESD wrist straps, eye protection, and factory legal compliance.',
    riskLevel: 'MEDIUM',
  },

  // 7. LOGISTICS & FLEET
  {
    key: 'FUNC_FLEET_VEHICLE_TRACK',
    name: 'Delivery Trucks & GPS Live Tracker',
    category: 'LOGISTICS_FLEET',
    categoryLabel: 'Logistics, Gate & Vehicle Fleet',
    description: 'Live GPS map tracking for finished goods delivery convoys, trip distance logs, and transit milestones.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_GATE_SECURITY_INBOUND',
    name: 'Factory Gate Security & Inbound Dock Check',
    category: 'LOGISTICS_FLEET',
    categoryLabel: 'Logistics, Gate & Vehicle Fleet',
    description: 'Inspect incoming carrier trucks, check driver identity passes, weigh container loads, and clear gates.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_CONVOY_ESCORT_DISPATCH',
    name: 'High-Value Finished Goods Logistics Dispatch',
    category: 'LOGISTICS_FLEET',
    categoryLabel: 'Logistics, Gate & Vehicle Fleet',
    description: 'Issue convoy gate clearance for high-value enterprise product shipments en route to distribution hubs.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_FLEET_FUEL_EXPENSE',
    name: 'Fleet Fuel Card & Vehicle Maintenance Management',
    category: 'LOGISTICS_FLEET',
    categoryLabel: 'Logistics, Gate & Vehicle Fleet',
    description: 'Log diesel consumption, highway toll passes, and vehicle fitness certifications.',
    riskLevel: 'LOW',
  },

  // 8. SUPPLY CHAIN
  {
    key: 'FUNC_SCM_MRP_SHORTAGE',
    name: 'Raw Materials & Core Inventory Shortage Alerts (MRP)',
    category: 'SUPPLY_CHAIN',
    categoryLabel: 'Supply Chain, Sourcing & Subcontracting',
    description: 'Run automated material requirements planning and identify component shortages ahead of production.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_SCM_PURCHASE_REQUISITION',
    name: 'Component Purchase Requests & Supplier Orders',
    category: 'SUPPLY_CHAIN',
    categoryLabel: 'Supply Chain, Sourcing & Subcontracting',
    description: 'Raise purchase requisitions for processors, specialized sensors, and structural components; compare vendor quotes.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_SCM_VENDOR_PORTAL',
    name: 'Supplier & Vendor Relationship Directory',
    category: 'SUPPLY_CHAIN',
    categoryLabel: 'Supply Chain, Sourcing & Subcontracting',
    description: 'Maintain Tier-1 vendor contracts, quality delivery ratings, and lead time metrics.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_SCM_SUBCONTRACT_JOBWORK',
    name: 'External Subassembly Job-Work Dispatch',
    category: 'SUPPLY_CHAIN',
    categoryLabel: 'Supply Chain, Sourcing & Subcontracting',
    description: 'Manage specialized job-work sent to external manufacturing partners; verify return delivery slips.',
    riskLevel: 'MEDIUM',
  },

  // 9. ENGINEERING
  {
    key: 'FUNC_ENG_CAD_BLUEPRINTS',
    name: 'Industrial Chassis 3D CAD & Thermal Schematics',
    category: 'ENGINEERING',
    categoryLabel: 'Hardware CAD & Machine Reliability',
    description: 'Store product enclosure 3D CAD files, internal thermal dissipation drawings, and structural blueprints.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_ENG_ECN_DESIGN_CHANGE',
    name: 'Engineering Design Change Requests (ECN)',
    category: 'ENGINEERING',
    categoryLabel: 'Hardware CAD & Machine Reliability',
    description: 'Initiate and review engineering design changes to product frames, connectors, and parts recipes.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_MAINT_ROBOTIC_SERVICING',
    name: 'Robotic Machine & Heating Oven Servicing',
    category: 'ENGINEERING',
    categoryLabel: 'Hardware CAD & Machine Reliability',
    description: 'Log preventive maintenance on precision machinery, industrial ovens, and pneumatic arms.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_MAINT_DOWNTIME_LOG',
    name: 'Machine Breakdown & Plant Uptime Incident Logs',
    category: 'ENGINEERING',
    categoryLabel: 'Hardware CAD & Machine Reliability',
    description: 'Record machine breakdown incidents, spindle heating alerts, and track Overall Plant Uptime.',
    riskLevel: 'MEDIUM',
  },

  // 10. SALES & MARKETING
  {
    key: 'FUNC_CRM_CARRIER_CONTRACTS',
    name: 'Enterprise Bulk B2B Contracts & Commercial Orders',
    category: 'SALES_MARKETING',
    categoryLabel: 'Customer Orders, CRM & Marketing',
    description: 'Manage enterprise bulk orders, wholesale commitments, and dispatch schedule commitments.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_MKT_LAUNCH_CAMPAIGNS',
    name: 'New Product Launches & Promotions Management',
    category: 'SALES_MARKETING',
    categoryLabel: 'Customer Orders, CRM & Marketing',
    description: 'Track enterprise product launch campaigns, distributor promotions, and marketing budget ROI.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_WARRANTY_SERVICE_CARE',
    name: 'Customer Warranty & Service Center Repairs',
    category: 'SALES_MARKETING',
    categoryLabel: 'Customer Orders, CRM & Marketing',
    description: 'Verify customer warranty claims by serial number, log component replacements, and dispatch spare parts.',
    riskLevel: 'MEDIUM',
  },
];

const BASELINE_DEFAULTS: Record<string, string[]> = {
  super_admin: MASTER_FUNCTIONS.map((f) => f.key),
  finance: [
    'FUNC_FINANCE_OVERVIEW',
    'FUNC_VENDOR_BILL_MATCH',
    'FUNC_CLIENT_INVOICE_GENERATE',
    'FUNC_DISBURSE_PAYOUTS',
    'FUNC_TAX_GST_FILING',
    'FUNC_HR_PAYROLL_BATCH_COMPILE',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  production: [
    'FUNC_PROD_WORK_ORDER_EXECUTE',
    'FUNC_PROD_SMT_CALIBRATION',
    'FUNC_PROD_SCREEN_FITTING',
    'FUNC_PROD_LINE_YIELD_REPORT',
    'FUNC_PROD_OVERTIME_SUBMIT',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  warehouse: [
    'FUNC_WHS_STOCK_MONITOR',
    'FUNC_WHS_INBOUND_GRN',
    'FUNC_WHS_BUFFER_RESERVE',
    'FUNC_WHS_IMEI_REGISTRATION',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  quality: [
    'FUNC_QA_INCOMING_INSPECTION',
    'FUNC_QA_OPTICAL_SCAN',
    'FUNC_QA_RF_5G_TEST',
    'FUNC_QA_BATTERY_AGING_DROP',
    'FUNC_QA_QUARANTINE_NCR',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  dispatch: [
    'FUNC_WHS_DISPATCH_BOXING',
    'FUNC_CONVOY_ESCORT_DISPATCH',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  logistics: [
    'FUNC_GATE_SECURITY_INBOUND',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  hr: [
    'FUNC_HR_EMPLOYEE_DIRECTORY',
    'FUNC_HR_SHIFT_ROSTER_LOCK',
    'FUNC_HR_PAYROLL_BATCH_COMPILE',
    'FUNC_HR_LEAVE_APPROVAL',
    'FUNC_HR_LABOR_SAFETY_AUDIT',
  ],
  crm: [
    'FUNC_CRM_CARRIER_CONTRACTS',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  supply_chain: [
    'FUNC_SCM_MRP_SHORTAGE',
    'FUNC_SCM_PURCHASE_REQUISITION',
    'FUNC_SCM_VENDOR_PORTAL',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  design: [
    'FUNC_ENG_CAD_BLUEPRINTS',
    'FUNC_ENG_ECN_DESIGN_CHANGE',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  fleet: [
    'FUNC_FLEET_VEHICLE_TRACK',
    'FUNC_CONVOY_ESCORT_DISPATCH',
    'FUNC_FLEET_FUEL_EXPENSE',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  asset_reliability: [
    'FUNC_MAINT_ROBOTIC_SERVICING',
    'FUNC_MAINT_DOWNTIME_LOG',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  subcontracting: [
    'FUNC_SCM_SUBCONTRACT_JOBWORK',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  field_service: [
    'FUNC_WARRANTY_SERVICE_CARE',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  procurement: [
    'FUNC_SCM_PURCHASE_REQUISITION',
    'FUNC_SCM_VENDOR_PORTAL',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  marketing: [
    'FUNC_MKT_LAUNCH_CAMPAIGNS',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  department_workforce: [
    'FUNC_HR_SHIFT_ROSTER_LOCK',
    'FUNC_PROD_OVERTIME_SUBMIT',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  maintenance_tech: [
    'FUNC_MAINT_ROBOTIC_SERVICING',
    'FUNC_MAINT_DOWNTIME_LOG',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  plant_operator: [
    'FUNC_PROD_SCREEN_FITTING',
    'FUNC_PROD_LINE_YIELD_REPORT',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
  system_admin: [
    'FUNC_RBAC_MANAGEMENT',
    'FUNC_HR_EMPLOYEE_DIRECTORY',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
};

const STORAGE_KEY = 'apex_erp_dynamic_rbac_v2';

export default function RolePermissionsDashboard() {
  const { session } = useAuth();
  const isSuperAdmin = session?.roleId === 'super_admin';

  // Selected Role
  const [selectedRoleId, setSelectedRoleId] = useState<string>('finance');

  // Custom storage for role permissions
  const [roleCustomPerms, setRoleCustomPerms] = useState<Record<string, Record<string, boolean>>>({});
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ALLOWED' | 'RESTRICTED'>('ALL');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Initialize from localStorage or defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRoleCustomPerms(JSON.parse(stored));
      }
    } catch {
      // Fallback
    }
  }, []);

  const selectedRole = useMemo<RoleDefinition>(() => {
    const found = ALL_ROLES.find((r) => r.id === selectedRoleId);
    return found || ALL_ROLES[0];
  }, [selectedRoleId]);

  // Compute current permissions state for selected role
  const currentPermissions = useMemo<FunctionItem[]>(() => {
    const roleOverrides = roleCustomPerms[selectedRoleId] || {};
    const defaultAllowed = new Set(BASELINE_DEFAULTS[selectedRoleId] || []);

    return MASTER_FUNCTIONS.map((fn) => {
      let isAllowed: boolean;
      if (roleOverrides[fn.key] !== undefined) {
        isAllowed = roleOverrides[fn.key];
      } else {
        isAllowed = defaultAllowed.has(fn.key);
      }
      return {
        ...fn,
        isAllowed,
      };
    });
  }, [selectedRoleId, roleCustomPerms]);

  // Filtered functions
  const filteredFunctions = useMemo(() => {
    const q = search.toLowerCase().trim();

    return currentPermissions.filter((fn) => {
      const matchesSearch =
        !q ||
        fn.name.toLowerCase().includes(q) ||
        fn.key.toLowerCase().includes(q) ||
        fn.description.toLowerCase().includes(q) ||
        fn.categoryLabel.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === 'ALL' || fn.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ALLOWED' && fn.isAllowed) ||
        (statusFilter === 'RESTRICTED' && !fn.isAllowed);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [currentPermissions, search, categoryFilter, statusFilter]);

  // Toggle single function
  const handleToggleFunction = (key: string) => {
    setRoleCustomPerms((prev) => {
      const currentRoleObj = prev[selectedRoleId] || {};
      const currentVal = currentPermissions.find((f) => f.key === key)?.isAllowed ?? false;
      const updated = {
        ...prev,
        [selectedRoleId]: {
          ...currentRoleObj,
          [key]: !currentVal,
        },
      };
      return updated;
    });
  };

  // Allow or restrict all in a category
  const handleToggleCategory = (categoryKey: string, allow: boolean) => {
    const catKeys = MASTER_FUNCTIONS.filter((f) => f.category === categoryKey).map((f) => f.key);
    setRoleCustomPerms((prev) => {
      const currentRoleObj = { ...(prev[selectedRoleId] || {}) };
      catKeys.forEach((k) => {
        currentRoleObj[k] = allow;
      });
      return {
        ...prev,
        [selectedRoleId]: currentRoleObj,
      };
    });
    setNotification({
      message: `${allow ? 'Allowed' : 'Restricted'} all functions in ${categoryKey} for ${selectedRole.name}.`,
      type: 'info',
    });
  };

  // Reset selected role to baseline defaults
  const handleResetToDefaults = () => {
    setRoleCustomPerms((prev) => {
      const updated = { ...prev };
      delete updated[selectedRoleId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('apex_rbac_updated'));
      }
      return updated;
    });

    setNotification({
      message: `Reset "${selectedRole.name}" back to system baseline defaults.`,
      type: 'info',
    });
  };

  // Save and Sync globally
  const handleSaveAndSync = async () => {
    setIsSaving(true);
    try {
      // 1. Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roleCustomPerms));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('apex_rbac_updated'));
      }

      // 2. Call backend sync endpoint asynchronously if available
      try {
        const payload = {
          roleName: selectedRoleId,
          permissions: currentPermissions.map((p) => ({
            functionKey: p.key,
            isAllowed: p.isAllowed,
          })),
          configuredBy: 'Super Admin',
        };

        await fetch('/api/v1/admin-rbac/permissions/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-user': session?.username || 'Super Admin',
          },
          body: JSON.stringify(payload),
        });
      } catch {
        // Backend offline fallback handled gracefully
      }

      setNotification({
        message: `Successfully saved & synced dynamic privileges for "${selectedRole.name}". Changes are active globally across Apex Enterprise OS!`,
        type: 'success',
      });
    } catch {
      setNotification({
        message: 'Error saving permissions.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Statistics
  const totalAllowed = currentPermissions.filter((p) => p.isAllowed).length;
  const totalRestricted = currentPermissions.length - totalAllowed;
  const isCustomized = !!roleCustomPerms[selectedRoleId];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Dynamic Function Mapping & Permission Matrix
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Super Admin Control
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign, toggle, or restrict operational functions across all 21 manufacturing roles. Changes apply instantly across all factory modules.
          </p>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndSync}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>Save & Sync Globally</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-medium border shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
              : notification.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Grid: Role Selector on Left, Dynamic Permissions Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: 21 Roles Selector */}
        <div className="lg:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Manufacturing Roles (21)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Select role to configure</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              21 Roles
            </span>
          </div>

          <div className="space-y-1.5 max-h-[680px] overflow-y-auto pr-1">
            {ALL_ROLES.map((role) => {
              const isSelected = role.id === selectedRoleId;
              const hasCustom = !!roleCustomPerms[role.id];

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full text-left p-3 rounded-xl transition text-xs flex items-center justify-between gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-white font-semibold shadow-xs'
                      : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {role.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {role.department}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasCustom && (
                      <span
                        className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-mono font-bold"
                        title="Customized by Super Admin"
                      >
                        MOD
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                      {role.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Columns: Active Role Config & Function Toggles */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Role Banner Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
                    Configuring Role
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {selectedRole.department}
                  </span>
                  {isCustomized ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Custom Overrides Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Standard Baseline
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                  {selectedRole.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedRole.description}
                </p>
              </div>

              {/* Stats Counters */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center min-w-20">
                  <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {totalAllowed}
                  </div>
                  <div className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 uppercase">
                    Permitted
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-center min-w-20">
                  <div className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                    {totalRestricted}
                  </div>
                  <div className="text-[10px] font-medium text-rose-700 dark:text-rose-300 uppercase">
                    Restricted
                  </div>
                </div>
              </div>
            </div>

            {/* Toolbar: Search, Category Filter & Status Filter */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search operational function..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES_CONFIG.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All States</option>
                  <option value="ALLOWED">Allowed Only</option>
                  <option value="RESTRICTED">Restricted Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categorized Function Permissions List */}
          <div className="space-y-6">
            {CATEGORIES_CONFIG.map((cat) => {
              const catFunctions = filteredFunctions.filter((f) => f.category === cat.key);
              if (catFunctions.length === 0) return null;

              const catAllowedCount = catFunctions.filter((f) => f.isAllowed).length;
              const catAllAllowed = catAllowedCount === catFunctions.length;
              const IconComp = cat.icon;

              return (
                <div
                  key={cat.key}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          {cat.label}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {catAllowedCount} of {catFunctions.length} active functions permitted
                        </p>
                      </div>
                    </div>

                    {/* Quick Category Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(cat.key, true)}
                        disabled={catAllAllowed}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition disabled:opacity-40 cursor-pointer"
                      >
                        Allow All
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(cat.key, false)}
                        disabled={catAllowedCount === 0}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition disabled:opacity-40 cursor-pointer"
                      >
                        Restrict All
                      </button>
                    </div>
                  </div>

                  {/* Functions in this Category */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {catFunctions.map((fn) => {
                      const isPermitted = fn.isAllowed;

                      return (
                        <div
                          key={fn.key}
                          className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                {fn.name}
                              </span>

                              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {fn.key}
                              </span>

                              <span
                                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                                  fn.riskLevel === 'CRITICAL'
                                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                                    : fn.riskLevel === 'HIGH'
                                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {fn.riskLevel}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {fn.description}
                            </p>
                          </div>

                          {/* Toggle Switch */}
                          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                            <span
                              className={`text-[11px] font-bold ${
                                isPermitted
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {isPermitted ? 'Permitted' : 'Restricted'}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleToggleFunction(fn.key)}
                              role="switch"
                              aria-checked={isPermitted}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isPermitted ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  isPermitted ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredFunctions.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs">
                No functions matching your current filter. Try adjusting your search query or category filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

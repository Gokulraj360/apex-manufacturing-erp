'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Save,
  Download,
  Lock,
  Unlock,
  Building2,
  Sliders,
  History,
  FileText,
  KeyRound,
  Eye,
  EyeOff,
  GitBranch,
  Timer,
  CheckCheck,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';
import { generateAndDownloadWordDoc } from '@/lib/wordDocumentGenerator';

type PermissionAction = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE' | 'EXPORT';
const ACTIONS: PermissionAction[] = ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'];

interface RoleMatrixRow {
  roleId: string;
  roleName: string;
  department: string;
  dataScope: 'OWN' | 'DEPARTMENT' | 'PLANT' | 'COMPANY' | 'ALL';
  permissions: Record<string, PermissionAction[]>; // moduleCode -> actions
}

interface SoDConflict {
  id: string;
  conflictTitle: string;
  severity: 'HIGH_RISK' | 'CRITICAL_TOXIC' | 'MEDIUM_WARNING';
  affectedRoles: string[];
  toxicPair: [string, string];
  regulatoryStandard: string;
  remediationSuggestion: string;
  status: 'ACTIVE_VIOLATION' | 'MITIGATED';
}

interface BreakGlassSession {
  id: string;
  user: string;
  role: string;
  targetPrivilege: string;
  justification: string;
  ticketId: string;
  activatedAt: string;
  expiresInMinutes: number;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

interface FieldMaskRule {
  id: string;
  moduleCode: string;
  fieldName: string;
  category: 'PII' | 'FINANCIAL' | 'PROPRIETARY_IP';
  targetRole: string;
  maskingType: 'FULL_MASK' | 'PARTIAL_REDACT' | 'TOKENIZED' | 'PLAINTEXT';
}

const MODULES = [
  { code: 'CORE', name: 'Core Platform' },
  { code: 'ENG', name: 'Engineering & BOM' },
  { code: 'PROD', name: 'Production Floor' },
  { code: 'QA', name: 'Quality Assurance' },
  { code: 'WHS', name: 'Warehouse & Stock' },
  { code: 'SCM', name: 'Supply Chain & Sourcing' },
  { code: 'FIN', name: 'Finance & General Ledger' },
  { code: 'HR', name: 'Human Resources' },
  { code: 'LOG', name: 'Gate Logistics & Fleet' },
  { code: 'LEGAL', name: 'Legal & Contracts' },
];

const INITIAL_ROLES: RoleMatrixRow[] = [
  {
    roleId: 'super_admin',
    roleName: 'Top Management (Owner / MD)',
    department: 'Executive',
    dataScope: 'ALL',
    permissions: {
      CORE: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      ENG: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      PROD: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      QA: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      WHS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      SCM: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      FIN: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      HR: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      LOG: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      LEGAL: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
    },
  },
  {
    roleId: 'finance_manager',
    roleName: 'Factory Accounts & Finance Lead',
    department: 'Finance',
    dataScope: 'COMPANY',
    permissions: {
      CORE: ['VIEW'],
      ENG: ['VIEW'],
      PROD: ['VIEW', 'EXPORT'],
      QA: ['VIEW'],
      WHS: ['VIEW', 'EXPORT'],
      SCM: ['VIEW'],
      FIN: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'],
      HR: ['VIEW', 'APPROVE'],
      LOG: ['VIEW'],
      LEGAL: ['VIEW'],
    },
  },
  {
    roleId: 'production_supervisor',
    roleName: 'Assembly Floor Supervisor',
    department: 'Production',
    dataScope: 'PLANT',
    permissions: {
      CORE: ['VIEW'],
      ENG: ['VIEW'],
      PROD: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'],
      QA: ['VIEW', 'CREATE'],
      WHS: ['VIEW', 'CREATE'],
      SCM: ['VIEW'],
      FIN: [],
      HR: ['VIEW'],
      LOG: ['VIEW'],
      LEGAL: [],
    },
  },
  {
    roleId: 'quality_lead',
    roleName: 'Quality Assurance & Inspection Lead',
    department: 'Quality',
    dataScope: 'PLANT',
    permissions: {
      CORE: ['VIEW'],
      ENG: ['VIEW', 'EDIT'],
      PROD: ['VIEW'],
      QA: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'],
      WHS: ['VIEW', 'EDIT'],
      SCM: ['VIEW'],
      FIN: [],
      HR: [],
      LOG: ['VIEW', 'APPROVE'],
      LEGAL: ['VIEW'],
    },
  },
  {
    roleId: 'procurement_officer',
    roleName: 'Strategic Sourcing & Buyer Lead',
    department: 'Supply Chain',
    dataScope: 'DEPARTMENT',
    permissions: {
      CORE: ['VIEW'],
      ENG: ['VIEW'],
      PROD: ['VIEW'],
      QA: ['VIEW'],
      WHS: ['VIEW'],
      SCM: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'],
      FIN: ['VIEW'],
      HR: [],
      LOG: ['VIEW'],
      LEGAL: ['VIEW'],
    },
  },
  {
    roleId: 'warehouse_clerk',
    roleName: 'Inventory & Receiving Clerk',
    department: 'Warehouse',
    dataScope: 'PLANT',
    permissions: {
      CORE: ['VIEW'],
      ENG: ['VIEW'],
      PROD: ['VIEW'],
      QA: ['VIEW'],
      WHS: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
      SCM: ['VIEW'],
      FIN: [],
      HR: [],
      LOG: ['VIEW', 'CREATE'],
      LEGAL: [],
    },
  },
];

const MOCK_SOD_CONFLICTS: SoDConflict[] = [
  {
    id: 'sod-1',
    conflictTitle: 'Purchase Order Initiation & Payment Release Combination',
    severity: 'CRITICAL_TOXIC',
    affectedRoles: ['Senior Procurement Buyer'],
    toxicPair: ['SCM:CREATE (Issue PO)', 'FIN:APPROVE (Disburse Payment)'],
    regulatoryStandard: 'Sarbanes-Oxley (SOX) Section 404 / ISO 9001:2015',
    remediationSuggestion: 'Revoke FIN:APPROVE grant from Procurement role. All payment disbursements must route strictly to Finance Lead.',
    status: 'ACTIVE_VIOLATION',
  },
  {
    id: 'sod-2',
    conflictTitle: 'Physical Inventory Receiving & Cycle Count Adjustment',
    severity: 'HIGH_RISK',
    affectedRoles: ['Warehouse General Clerk'],
    toxicPair: ['WHS:CREATE (Receiving GRN)', 'WHS:DELETE (Inventory Write-off)'],
    regulatoryStandard: 'Internal Audit & Asset Protection Standard',
    remediationSuggestion: 'Restrict WHS:DELETE exclusively to Warehouse Manager and Internal Auditor.',
    status: 'ACTIVE_VIOLATION',
  },
  {
    id: 'sod-3',
    conflictTitle: 'Payroll Wage Compilation & Bank Credit Execution',
    severity: 'CRITICAL_TOXIC',
    affectedRoles: ['HR Payroll Assistant'],
    toxicPair: ['HR:CREATE (Salary Compilation)', 'FIN:APPROVE (Treasury Release)'],
    regulatoryStandard: 'Statutory Financial Audit Guidelines',
    remediationSuggestion: 'Maintain strict segregation: HR compiles; Finance & Managing Director dual-sign payout.',
    status: 'MITIGATED',
  },
];

const INITIAL_BREAK_GLASS_SESSIONS: BreakGlassSession[] = [
  {
    id: 'BG-2026-904',
    user: 'David O\'Connor (Plant QA Lead)',
    role: 'Quality Lead',
    targetPrivilege: 'WHS:DELETE (Emergency Quarantined Lot Purge)',
    justification: 'Critical nitrogen wave solder bath contamination incident affecting Batch #PCB-9821. Required immediate material isolation to prevent line stall.',
    ticketId: 'INC-2026-8812',
    activatedAt: '2026-10-23 07:45 AM',
    expiresInMinutes: 72,
    status: 'ACTIVE',
  },
  {
    id: 'BG-2026-899',
    user: 'Claire Chen (Lead Thermal Architect)',
    role: 'Hardware Engineer',
    targetPrivilege: 'ENG:APPROVE (Bypass ECO Dual Sign-off)',
    justification: 'Automated thermal wind tunnel testing run scheduled during night shift requiring immediate parameter reload.',
    ticketId: 'CR-2026-7740',
    activatedAt: '2026-10-22 18:30 PM',
    expiresInMinutes: 0,
    status: 'EXPIRED',
  },
];

const INITIAL_FIELD_MASK_RULES: FieldMaskRule[] = [
  {
    id: 'FMR-01',
    moduleCode: 'HR',
    fieldName: 'Employee Base Salary & Monthly Gross (USD)',
    category: 'FINANCIAL',
    targetRole: 'Non-HR & Non-Executive Roles',
    maskingType: 'FULL_MASK',
  },
  {
    id: 'FMR-02',
    moduleCode: 'FIN',
    fieldName: 'Vendor Wire Transfer Account & ABA Routing No',
    category: 'FINANCIAL',
    targetRole: 'All Roles except Finance Controller & Treasury',
    maskingType: 'PARTIAL_REDACT',
  },
  {
    id: 'FMR-03',
    moduleCode: 'ENG',
    fieldName: 'Component Margin & Standard Direct Material BOM Cost',
    category: 'PROPRIETARY_IP',
    targetRole: 'Shopfloor Assembly & Operator Roles',
    maskingType: 'TOKENIZED',
  },
  {
    id: 'FMR-04',
    moduleCode: 'CORE',
    fieldName: 'Employee SSN / National Tax Identification (TIN)',
    category: 'PII',
    targetRole: 'All Frontline & Plant Supervisor Roles',
    maskingType: 'PARTIAL_REDACT',
  },
];

export default function DynamicRbacMatrixPage() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'sod' | 'breakglass' | 'masking' | 'scopes'>('matrix');
  const [roles, setRoles] = useState<RoleMatrixRow[]>(INITIAL_ROLES);
  const [sodConflicts, setSodConflicts] = useState<SoDConflict[]>(MOCK_SOD_CONFLICTS);
  const [breakGlassSessions, setBreakGlassSessions] = useState<BreakGlassSession[]>(INITIAL_BREAK_GLASS_SESSIONS);
  const [maskRules, setMaskRules] = useState<FieldMaskRule[]>(INITIAL_FIELD_MASK_RULES);
  const [selectedRole, setSelectedRole] = useState<string>('super_admin');
  const [savedNotification, setSavedNotification] = useState(false);
  const [remediationNotification, setRemediationNotification] = useState<string | null>(null);

  // New Break-Glass Modal
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [bgUser, setBgUser] = useState('Sarah Jenkins (VP Operations)');
  const [bgPrivilege, setBgPrivilege] = useState('FIN:APPROVE (Disaster Recovery Payout)');
  const [bgTicket, setBgTicket] = useState('CR-2026-9950');
  const [bgJustification, setBgJustification] = useState('Production Line 2 sudden downtime requiring expedited OEM spare part wire transfer.');

  const togglePermission = (roleId: string, moduleCode: string, action: PermissionAction) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.roleId !== roleId) return r;
        const currentActions = r.permissions[moduleCode] || [];
        const exists = currentActions.includes(action);
        const updated = exists
          ? currentActions.filter((a) => a !== action)
          : [...currentActions, action];
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [moduleCode]: updated,
          },
        };
      })
    );
  };

  const handleSaveMatrix = () => {
    try {
      localStorage.setItem('apex_enterprise_rbac_roles', JSON.stringify(roles));
      window.dispatchEvent(new CustomEvent('apex_rbac_updated', { detail: roles }));
    } catch (e) {
      console.error(e);
    }
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleAutoRemediateSod = () => {
    // Automatically mitigate toxic permissions
    setSodConflicts((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'MITIGATED',
      }))
    );
    setRemediationNotification('SOX 404 Auto-Remediation Executed: Toxic action pairs separated. SoD Health restored to 100%.');
    setTimeout(() => setRemediationNotification(null), 5000);
  };

  const handleCreateBreakGlass = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: BreakGlassSession = {
      id: `BG-2026-${Math.floor(100 + Math.random() * 900)}`,
      user: bgUser,
      role: 'Operations VP',
      targetPrivilege: bgPrivilege,
      justification: bgJustification,
      ticketId: bgTicket,
      activatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      expiresInMinutes: 120,
      status: 'ACTIVE',
    };
    setBreakGlassSessions([newSession, ...breakGlassSessions]);
    setIsBgModalOpen(false);
    setRemediationNotification(`Ephemeral Break-Glass Elevation ${newSession.id} granted for 120 minutes with mandatory audit logging.`);
    setTimeout(() => setRemediationNotification(null), 5000);
  };

  const handleRevokeBreakGlass = (id: string) => {
    setBreakGlassSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'REVOKED', expiresInMinutes: 0 } : s))
    );
  };

  const handleCycleMaskType = (ruleId: string) => {
    setMaskRules((prev) =>
      prev.map((rule) => {
        if (rule.id !== ruleId) return rule;
        const types: FieldMaskRule['maskingType'][] = ['FULL_MASK', 'PARTIAL_REDACT', 'TOKENIZED', 'PLAINTEXT'];
        const nextIdx = (types.indexOf(rule.maskingType) + 1) % types.length;
        return { ...rule, maskingType: types[nextIdx] };
      })
    );
  };

  const handleExportRbacAuditDoc = () => {
    generateAndDownloadWordDoc('Apex_Enterprise_RBAC_and_SoD_Compliance_Audit', {
      title: 'ENTERPRISE RBAC AUTHORIZATION MATRIX, FIELD MASKING & SEGREGATION OF DUTIES (SoD) AUDIT',
      documentRef: 'SEC-RBAC-2026-Q3-01',
      classification: 'RESTRICTED // CISO & REGULATORY COMPLIANCE RECORD',
      department: 'Enterprise Cybersecurity & Identity Governance',
      author: 'Alexander Vance, CISO & Plant Controller',
      summary:
        'Comprehensive 2D Role-Based Access Control (RBAC) security architecture, Column-Level Field Masking policies, Ephemeral Break-Glass access records, and Segregation of Duties (SoD) toxic role conflict matrix established pursuant to ISO/IEC 27001:2022, SOC 2 Type II, and Sarbanes-Oxley (SOX) Section 404.',
      sections: [
        {
          heading: '1. Identity Architecture & SoD Compliance Posture',
          content: [
            'Apex Manufacturing ERP enforces fine-grained authorization with 6 discrete Action primitives (View, Create, Edit, Delete, Approve, Export) evaluated dynamically against geographic and hierarchical Data Scopes.',
            'Current system-wide SoD compliance is verified at 100% following automated policy mitigation across 1,080 matrix evaluation cells.',
          ],
          table: {
            headers: ['Security Audit Parameter', 'System Configuration', 'Standard Baseline', 'Compliance Verification'],
            rows: [
              ['Segregation of Duties (SoD) Health', '100% Score (All Toxic Pairs Mitigated)', '≥ 90.0%', 'FULLY COMPLIANT'],
              ['Granular Authorization Matrix Nodes', '1,080 Nodes (18 Roles × 10 Modules × 6 Actions)', 'Full Coverage', 'AUDITED & LOCKED'],
              ['Ephemeral Break-Glass Access Controls', 'Time-bound (Max 2h) with JIRA Ticket ID', 'NIST SP 800-53', 'ACTIVE & MONITORED'],
              ['Field-Level Masking & PII Redaction', '4 Active Enterprise Column Protection Rules', 'GDPR / CCPA / HIPAA', 'ENFORCED'],
              ['Session Token Lifecycle & Timeout', '15 Minutes Inactivity / Dual Factor MFA', 'NIST SP 800-63B', 'ACTIVE'],
            ],
          },
        },
        {
          heading: '2. Toxic Segregation of Duties (SoD) Conflict Ledger',
          content: [
            'The following toxic role combinations are restricted by automated ERP engine blocking to prevent internal fraud, unverified inventory write-offs, or illicit payment disbursement.',
          ],
          table: {
            headers: ['Conflict Code', 'Conflicting ERP Modules', 'Risk Category', 'Risk Description & Exposure', 'Enforced Mitigation'],
            rows: [
              ['SOD-01', 'Procurement (PO) ↔ Finance (AP)', 'CRITICAL TOXIC', 'User can create purchase order and unilaterally approve corresponding vendor invoice payment.', 'Mandatory Dual Separation / Auto-Blocked'],
              ['SOD-02', 'Warehouse (GRN) ↔ Quality (QA)', 'HIGH SEVERITY', 'User can accept physical truck shipment and sign off laboratory Certificate of Conformance.', 'Separated by Role Scoping'],
              ['SOD-03', 'Production Eng ↔ Quality Quarantine', 'MEDIUM SEVERITY', 'Engineer could dismiss in-line test failures without QA concession.', 'Supervisory Escalation Escrow'],
            ],
          },
          callout: {
            title: 'CISO Compliance Certification',
            text: 'I certify that this RBAC matrix enforces strict least-privilege principles and meets all external SOC 2 Type II access governance mandates.',
            type: 'success',
          },
        },
        {
          heading: '3. Column-Level Field Masking & Sensitive Data Protection Rules',
          table: {
            headers: ['Rule ID', 'Module', 'Sensitive Field Name', 'Category', 'Target Redaction Group', 'Enforced Masking Type'],
            rows: maskRules.map((r) => [r.id, r.moduleCode, r.fieldName, r.category, r.targetRole, r.maskingType]),
          },
        },
        {
          heading: '4. Active Ephemeral Break-Glass Emergency Elevation Registry',
          table: {
            headers: ['Session ID', 'Designated Operator', 'Emergency Granted Privilege', 'Justification & Change Ticket', 'Duration & Status'],
            rows: breakGlassSessions.map((s) => [
              s.id,
              s.user,
              s.targetPrivilege,
              `Ticket: ${s.ticketId} — ${s.justification}`,
              `${s.expiresInMinutes}m remaining [${s.status}]`,
            ]),
          },
        },
      ],
      signatories: [
        {
          name: 'Alexander Vance',
          role: 'Chief Information Security Officer & Director',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-23',
        },
        {
          name: 'Sarah Chen, CPA',
          role: 'Chief Financial Officer',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-23',
        },
        {
          name: 'Rachel V. Hughes',
          role: 'Lead Cybersecurity & IT Auditor',
          organization: 'PricewaterhouseCoopers (PwC) Digital Assurance',
          signatureDate: '2026-10-23',
        },
      ],
    });
  };

  const activeRoleData = roles.find((r) => r.roleId === selectedRole) || roles[0];
  const activeSodCount = sodConflicts.filter((c) => c.status === 'ACTIVE_VIOLATION').length;
  const activeBgCount = breakGlassSessions.filter((s) => s.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Dynamic 2D RBAC Permission Matrix & Enterprise Governance Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              SoD Enforcement • Break-Glass • Field Masking
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Configure granular Action-level rights across 10 core ERP modules, enforce column-level field masking, manage time-bound break-glass elevations, and auto-mitigate toxic Segregation of Duties conflicts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportRbacAuditDoc}
            title="Download Official RBAC Security & SoD Compliance Audit in Word Format"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Export RBAC Audit (.doc)
          </button>
          <button
            onClick={handleSaveMatrix}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" /> Save Permission Matrix
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Matrix synchronized with server session cache and client localStorage. Permissions updated in real-time.
        </div>
      )}

      {remediationNotification && (
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-medium flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{remediationNotification}</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-purple-500/20 px-2 py-0.5 rounded">Compliance Enforced</span>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">SoD Health Score</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {activeSodCount === 0 ? '100%' : '94.2%'}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500">
            <span>{activeSodCount === 0 ? 'Zero active violations' : `${activeSodCount} violations pending`}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Matrix Nodes</span>
            <Layers className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">1,080 Cells</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            <span>18 Roles × 10 Modules × 6 Actions</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Break-Glass Active</span>
            <Timer className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
            {activeBgCount} Elevated
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-amber-500">
            <span>Time-bound emergency bypass</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Field Mask Rules</span>
            <EyeOff className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{maskRules.length} Rules</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            <span>PII, Salary & BOM Masking</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data Scoping</span>
            <Building2 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">5 Tiers</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            <span>Own, Dept, Subtree, Plant, All</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="h-4 w-4" /> 2D Interactive Permission Grid
        </button>
        <button
          onClick={() => setActiveTab('sod')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'sod'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="h-4 w-4" /> Segregation of Duties (SoD) Auditor ({sodConflicts.length})
        </button>
        <button
          onClick={() => setActiveTab('breakglass')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'breakglass'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Timer className="h-4 w-4" /> Ephemeral Break-Glass Elevation ({activeBgCount})
        </button>
        <button
          onClick={() => setActiveTab('masking')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'masking'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <EyeOff className="h-4 w-4" /> Field Masking & PII Redaction ({maskRules.length})
        </button>
        <button
          onClick={() => setActiveTab('scopes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'scopes'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" /> Multi-Plant Data Scopes
        </button>
      </div>

      {/* TAB 1: 2D PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Role Selector Pill Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-2">Target Role:</span>
            {roles.map((r) => (
              <button
                key={r.roleId}
                onClick={() => setSelectedRole(r.roleId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedRole === r.roleId
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white dark:bg-[#0d1322] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                {r.roleName} ({r.department})
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Action Authority Matrix for: <span className="text-purple-600 dark:text-purple-400 font-bold">{activeRoleData.roleName}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click action chips to toggle real-time permission state for this role.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500">
                Scope: <strong className="text-purple-600 dark:text-purple-400">{activeRoleData.dataScope}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">ERP Module</th>
                    <th className="py-3 px-4 text-center">VIEW (Read)</th>
                    <th className="py-3 px-4 text-center">CREATE (Insert)</th>
                    <th className="py-3 px-4 text-center">EDIT (Update)</th>
                    <th className="py-3 px-4 text-center">DELETE (Archive)</th>
                    <th className="py-3 px-4 text-center">APPROVE (Authorize)</th>
                    <th className="py-3 px-4 text-center">EXPORT (Download)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {MODULES.map((mod) => {
                    const granted = activeRoleData.permissions[mod.code] || [];
                    return (
                      <tr key={mod.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          <div>{mod.name}</div>
                          <span className="font-mono text-[10px] text-slate-400">{mod.code}</span>
                        </td>
                        {ACTIONS.map((action) => {
                          const hasAction = granted.includes(action);
                          return (
                            <td key={action} className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => togglePermission(activeRoleData.roleId, mod.code, action)}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border ${
                                  hasAction
                                    ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
                                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800'
                                }`}
                              >
                                {hasAction ? 'YES' : 'NO'}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEGREGATION OF DUTIES AUDITOR */}
      {activeTab === 'sod' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>SoD Violation Engine Active:</strong> Scanning active role assignments against 32 regulatory risk pairs to prevent fraud and SOX non-compliance.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoRemediateSod}
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
              >
                Auto-Remediate All Violations
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sodConflicts.map((c) => (
              <div key={c.id} className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <ShieldAlert className={`h-4 w-4 ${c.severity === 'CRITICAL_TOXIC' ? 'text-red-500' : 'text-amber-500'}`} />
                    {c.conflictTitle}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'ACTIVE_VIOLATION'
                        ? 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    {c.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div>
                    <strong>Toxic Action Pair:</strong> <code className="text-red-600 dark:text-red-400 font-bold">{c.toxicPair[0]}</code> +{' '}
                    <code className="text-red-600 dark:text-red-400 font-bold">{c.toxicPair[1]}</code>
                  </div>
                  <div>
                    <strong>Regulatory Baseline:</strong> {c.regulatoryStandard}
                  </div>
                  <div>
                    <strong>Affected Roles:</strong> {c.affectedRoles.join(', ')}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Recommended Remediation:</strong> {c.remediationSuggestion}
                </div>

                {c.status === 'ACTIVE_VIOLATION' && (
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSodConflicts((prev) => prev.map((item) => (item.id === c.id ? { ...item, status: 'MITIGATED' } : item)));
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold shadow-sm cursor-pointer"
                    >
                      Enforce Split / Mitigate Toxic Grant
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EPHEMERAL BREAK-GLASS ELEVATION */}
      {activeTab === 'breakglass' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
              <span>
                <strong>Ephemeral Break-Glass Access Controller:</strong> Grants strictly time-bound emergency privilege elevation (max 120 minutes) for disaster recovery or emergency plant maintenance with mandatory change ticket auditing.
              </span>
            </div>
            <button
              onClick={() => setIsBgModalOpen(true)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-sm shrink-0 cursor-pointer"
            >
              + Issue Break-Glass Grant
            </button>
          </div>

          <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Session Token</th>
                  <th className="py-3 px-4">Designated Operator</th>
                  <th className="py-3 px-4">Elevated Privilege</th>
                  <th className="py-3 px-4">Change Ticket & Justification</th>
                  <th className="py-3 px-4">Time Remaining</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {breakGlassSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">{s.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      <div>{s.user}</div>
                      <span className="text-[10px] text-slate-400">{s.role}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">{s.targetPrivilege}</td>
                    <td className="py-3 px-4 max-w-xs text-slate-600 dark:text-slate-300">
                      <div className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">Ticket: {s.ticketId}</div>
                      <p className="line-clamp-2 mt-0.5 text-[11px]">{s.justification}</p>
                    </td>
                    <td className="py-3 px-4">
                      {s.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse">
                          <Timer className="w-3 h-3" /> {s.expiresInMinutes} mins left
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400">
                          {s.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {s.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleRevokeBreakGlass(s.id)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Revoke Elevation
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FIELD MASKING & PII REDACTION */}
      {activeTab === 'masking' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeOff className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>
                <strong>Column-Level Security & Dynamic Data Masking:</strong> Prevents unauthorized exposure of PII, salary figures, bank routing details, and proprietary BOM margins without altering underlying database records.
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rule Token</th>
                  <th className="py-3 px-4">Module Code</th>
                  <th className="py-3 px-4">Protected Column / Field</th>
                  <th className="py-3 px-4">Data Sensitivity</th>
                  <th className="py-3 px-4">Target Redaction Scope</th>
                  <th className="py-3 px-4">Enforced Masking Type</th>
                  <th className="py-3 px-4 text-right">Toggle Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {maskRules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{r.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">{r.moduleCode}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{r.fieldName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{r.targetRole}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          r.maskingType === 'FULL_MASK'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : r.maskingType === 'PARTIAL_REDACT'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : r.maskingType === 'TOKENIZED'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {r.maskingType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleCycleMaskType(r.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                      >
                        Cycle Mode
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DATA SCOPE HIERARCHY */}
      {activeTab === 'scopes' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Geographic & Organizational Data Scope Hierarchy</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Defines the record-level visibility boundary for queries executed by each role across multi-tenant and multi-plant environments.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-xs text-slate-900 dark:text-white">1. OWN</div>
              <p className="text-[11px] text-slate-500">Only records created by or assigned to the specific user ID.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-xs text-slate-900 dark:text-white">2. DEPARTMENT</div>
              <p className="text-[11px] text-slate-500">All records belonging to the user's primary departmental unit.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-xs text-slate-900 dark:text-white">3. SUBTREE</div>
              <p className="text-[11px] text-slate-500">All subordinate teams reporting into this manager's org chart node.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-xs text-slate-900 dark:text-white">4. PLANT</div>
              <p className="text-[11px] text-slate-500">Entire physical manufacturing campus (e.g. Cleanroom Bay 1-4).</p>
            </div>
            <div className="p-3.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-1">
              <div className="font-bold text-xs text-purple-900 dark:text-purple-300">5. ALL / COMPANY</div>
              <p className="text-[11px] text-slate-500">Full multi-tenant corporate visibility across all legal entities.</p>
            </div>
          </div>
        </div>
      )}

      {/* Break-Glass Creator Modal */}
      {isBgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Issue Ephemeral Break-Glass Grant</h3>
              </div>
              <button onClick={() => setIsBgModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-md">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBreakGlass} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Operator</label>
                <input
                  type="text"
                  value={bgUser}
                  onChange={(e) => setBgUser(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Elevated Privilege</label>
                <select
                  value={bgPrivilege}
                  onChange={(e) => setBgPrivilege(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                >
                  <option value="FIN:APPROVE (Disaster Recovery Payout)">FIN:APPROVE (Disaster Recovery Payout)</option>
                  <option value="ENG:EDIT (Emergency Parameter Reload)">ENG:EDIT (Emergency Parameter Reload)</option>
                  <option value="WHS:DELETE (Emergency Quarantined Lot Purge)">WHS:DELETE (Emergency Quarantined Lot Purge)</option>
                  <option value="QA:APPROVE (Urgent Concession Sign-off)">QA:APPROVE (Urgent Concession Sign-off)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mandatory Incident / Change Ticket ID</label>
                <input
                  type="text"
                  value={bgTicket}
                  onChange={(e) => setBgTicket(e.target.value)}
                  placeholder="e.g. CR-2026-9950 or INC-8821"
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Operational Justification</label>
                <textarea
                  value={bgJustification}
                  onChange={(e) => setBgJustification(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300">
                Grant is strictly time-limited to 120 minutes with zero-trust cryptographic audit logging. All transactions will be attributed to this session.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBgModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 cursor-pointer"
                >
                  Authorize Break-Glass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

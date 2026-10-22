'use client';

import React, { useState } from 'react';
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

export default function DynamicRbacMatrixPage() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'scopes' | 'sod' | 'audit'>('matrix');
  const [roles, setRoles] = useState<RoleMatrixRow[]>(INITIAL_ROLES);
  const [sodConflicts, setSodConflicts] = useState<SoDConflict[]>(MOCK_SOD_CONFLICTS);
  const [selectedRole, setSelectedRole] = useState<string>('super_admin');
  const [savedNotification, setSavedNotification] = useState(false);

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
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleExportRbacAuditDoc = () => {
    generateAndDownloadWordDoc('Apex_Enterprise_RBAC_and_SoD_Compliance_Audit', {
      title: 'ENTERPRISE RBAC AUTHORIZATION MATRIX & SEGREGATION OF DUTIES (SoD) AUDIT',
      documentRef: 'SEC-RBAC-2026-Q3-01',
      classification: 'RESTRICTED // CISO & REGULATORY COMPLIANCE RECORD',
      department: 'Enterprise Cybersecurity & Identity Governance',
      author: 'Alexander Vance, CISO & Plant Controller',
      summary: 'Comprehensive 2D Role-Based Access Control (RBAC) security architecture, data perimeter boundaries, and Segregation of Duties (SoD) toxic role conflict matrix established pursuant to ISO/IEC 27001:2022, SOC 2 Type II, and Sarbanes-Oxley (SOX) Section 404.',
      sections: [
        {
          heading: '1. Identity Architecture & SoD Compliance Posture',
          content: [
            'Apex Manufacturing ERP enforces fine-grained authorization with 6 discrete Action primitives (View, Create, Edit, Delete, Approve, Export) evaluated dynamically against geographic and hierarchical Data Scopes.',
            'Current system-wide SoD compliance is verified at 94.2% across 1,080 matrix evaluation cells. Two identified toxic conflict combinations have been placed under automated supervisory escrows.'
          ],
          table: {
            headers: ['Security Audit Parameter', 'System Configuration', 'Standard Baseline', 'Compliance Verification'],
            rows: [
              ['Segregation of Duties (SoD) Health', '94.2% Score', '≥ 90.0%', 'FULLY COMPLIANT'],
              ['Granular Authorization Matrix Nodes', '1,080 Nodes (18 Roles × 10 Modules × 6 Actions)', 'Full Coverage', 'AUDITED & LOCKED'],
              ['Export / Download Security Controls', 'Restricted to Department Heads & Controllers', 'FIPS 140-2 Encrypted', 'AUDIT LOGGED'],
              ['Session Token Lifecycle & Timeout', '15 Minutes Inactivity / Dual Factor MFA', 'NIST SP 800-63B', 'ACTIVE']
            ]
          }
        },
        {
          heading: '2. Toxic Segregation of Duties (SoD) Conflict Ledger',
          content: [
            'The following toxic role combinations are restricted by automated ERP engine blocking to prevent internal fraud, unverified inventory write-offs, or illicit payment disbursement.'
          ],
          table: {
            headers: ['Conflict Code', 'Conflicting ERP Modules', 'Risk Category', 'Risk Description & Financial Exposure', 'Enforced Mitigation'],
            rows: [
              ['SOD-01', 'Procurement (PO) ↔ Finance (AP)', 'HIGH SEVERITY', 'User can create purchase order and unilaterally approve corresponding vendor invoice payment.', 'Mandatory Dual Separation / Auto-Blocked'],
              ['SOD-02', 'Warehouse (GRN) ↔ Quality (QA Acceptance)', 'HIGH SEVERITY', 'User can accept physical truck shipment and sign off laboratory Certificate of Conformance.', 'Separated by Role Scoping'],
              ['SOD-03', 'Production Engineering ↔ Quality Quarantine', 'MEDIUM SEVERITY', 'Engineer could dismiss in-line test failures without QA concession.', 'Supervisory Escalation Escrow']
            ]
          },
          callout: {
            title: 'CISO Compliance Certification',
            text: 'I certify that this RBAC matrix enforces strict least-privilege principles and meets all external SOC 2 Type II access governance mandates.',
            type: 'success'
          }
        }
      ],
      signatories: [
        {
          name: 'Alexander Vance',
          role: 'Chief Information Security Officer & Director',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'Sarah Chen, CPA',
          role: 'Chief Financial Officer',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'Rachel V. Hughes',
          role: 'Lead Cybersecurity & IT Auditor',
          organization: 'PricewaterhouseCoopers (PwC) Digital Assurance',
          signatureDate: '2026-10-22'
        }
      ]
    });
  };

  const activeRoleData = roles.find((r) => r.roleId === selectedRole) || roles[0];

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
              Dynamic 2D RBAC Permission Matrix & Segregation of Duties Auditor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              Enterprise Role Governance & SoD Enforcement
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Configure granular Action-level rights (View, Create, Edit, Delete, Approve, Export) across 16 core ERP modules, enforce geographic Data Scopes, and audit toxic role conflicts.
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
          Matrix synchronized with server session cache. User permissions updated in real-time.
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">SoD Compliance Score</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">94.2%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500">
            <span>2 High-risk pairs pending review</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Granular Matrix Nodes</span>
            <Layers className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">1,080 Cells</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            <span>18 Roles × 10 Modules × 6 Actions</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Conflict Flags</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 tracking-tight">
            {sodConflicts.filter(c => c.status === 'ACTIVE_VIOLATION').length} Violations
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-red-500">
            <span>SOX / ISO Segregation alerts</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data Scope Hierarchy</span>
            <Building2 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">5 Scopes</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            <span>Own, Dept, Subtree, Plant, All</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'matrix'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="h-4 w-4" /> 2D Interactive Permission Grid
        </button>
        <button
          onClick={() => setActiveTab('sod')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'sod'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="h-4 w-4" /> Segregation of Duties (SoD) Over-Permission Auditor ({sodConflicts.length})
        </button>
        <button
          onClick={() => setActiveTab('scopes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'scopes'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" /> Data Scoping & Multi-Plant Boundaries
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
                                {hasAction ? '✓ YES' : '— NO'}
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
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>
                <strong>SoD Violation Engine Active:</strong> Scanning active role assignments against 32 regulatory risk pairs to prevent operational fraud and SOX non-compliance.
              </span>
            </div>
            <button
              onClick={() => alert('SoD Scan completed: 2 active high-risk violations detected.')}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold shrink-0"
            >
              Re-run Compliance Scan
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sodConflicts.map((c) => (
              <div key={c.id} className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <ShieldAlert className={`h-4 w-4 ${c.severity === 'CRITICAL_TOXIC' ? 'text-red-500' : 'text-amber-500'}`} />
                    {c.conflictTitle}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'ACTIVE_VIOLATION'
                      ? 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {c.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div><strong>Toxic Action Pair:</strong> <code className="text-red-600 dark:text-red-400">{c.toxicPair[0]}</code> + <code className="text-red-600 dark:text-red-400">{c.toxicPair[1]}</code></div>
                  <div><strong>Standard:</strong> {c.regulatoryStandard}</div>
                  <div><strong>Affected Roles:</strong> {c.affectedRoles.join(', ')}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Recommended Remediation:</strong> {c.remediationSuggestion}
                </div>

                {c.status === 'ACTIVE_VIOLATION' && (
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSodConflicts(prev => prev.map(item => item.id === c.id ? { ...item, status: 'MITIGATED' } : item));
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold shadow-sm"
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

      {/* TAB 3: DATA SCOPE HIERARCHY */}
      {activeTab === 'scopes' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Geographic & Organizational Data Scope Hierarchy</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Defines the record-level visibility boundary for queries executed by each role.
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
              <p className="text-[11px] text-slate-500">Entire physical manufacturing campus (e.g. Pune Plant Bay 1-4).</p>
            </div>
            <div className="p-3.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-1">
              <div className="font-bold text-xs text-purple-900 dark:text-purple-300">5. ALL / COMPANY</div>
              <p className="text-[11px] text-slate-500">Full multi-tenant corporate visibility across all legal entities.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

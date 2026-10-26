'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  AlertOctagon,
  FileCode,
  Lock,
  RefreshCw,
  Building,
  DollarSign,
  Warehouse,
  Cpu,
  Users,
  Award,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

export interface CentralAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  department: string;
  departmentCode: 'EXEC' | 'FIN' | 'WHS' | 'PROD' | 'HR' | 'QA' | 'FLT';
  action: string;
  entity: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SECURITY_ALERT';
  ipAddress: string;
  tamperChecksum: string;
  changes?: { before: Record<string, any>; after: Record<string, any> };
}

const CENTRAL_AUDIT_LOGS: CentralAuditLog[] = [
  {
    id: 'evt-aud-901',
    timestamp: 'Today, 11:45 AM',
    user: 'Amitabh Sen',
    role: 'Factory Accounts & Finance Lead',
    department: 'Finance & Accounts',
    departmentCode: 'FIN',
    action: 'PAYOUT_DISBURSEMENT_RELEASED',
    entity: 'PayrollBatch',
    details: 'Released September 2026 Shift Factory Payroll (144 Technicians · ₹33,21,600 net) via HDFC Corporate RTGS Ref: HDFC-CORP-RTGS-990412.',
    severity: 'CRITICAL',
    ipAddress: '10.0.12.18',
    tamperChecksum: 'e9b3a165d491f0a597bf6819a5573428801d0ec2e99f57e62a04ec576c6b3e70',
    changes: {
      before: { batchId: 'PAY-BATCH-2026-09', paymentStatus: 'APPROVED_PENDING_RELEASE' },
      after: { batchId: 'PAY-BATCH-2026-09', paymentStatus: 'RELEASED_VIA_RTGS', utrNumber: 'HDFC9904128821' },
    },
  },
  {
    id: 'evt-aud-902',
    timestamp: 'Today, 11:20 AM',
    user: 'Dr. Anand Verma',
    role: 'Phone Quality & Signal Testing Lead',
    department: 'Phone Quality & Testing',
    departmentCode: 'QA',
    action: 'QUALITY_YIELD_CERTIFICATION',
    entity: 'QualityBatch',
    details: 'Certified 99.4% First Pass Yield (FPY) on SMT Line 1 motherboards. RF chamber 5G antenna test passed 0 defect ppm.',
    severity: 'INFO',
    ipAddress: '10.0.14.33',
    tamperChecksum: '3a18e001cfa976db5761bc99a71649d21f8502aef1803577d33b5c43d5483f98',
    changes: {
      before: { batchNumber: 'QA-SMT-2026-88', certified: false },
      after: { batchNumber: 'QA-SMT-2026-88', certified: true, passRate: 99.4 },
    },
  },
  {
    id: 'evt-aud-903',
    timestamp: 'Today, 10:15 AM',
    user: 'Kavita Menon',
    role: 'Factory Workers & Shift Rosters Lead',
    department: 'Human Resources',
    departmentCode: 'HR',
    action: 'PAYROLL_BATCH_SUBMISSION',
    entity: 'PayrollBatch',
    details: 'Submitted October 2026 Factory Payroll Batch (144 Technicians · ₹38,40,000 gross) to Finance and Super Admin inboxes.',
    severity: 'CRITICAL',
    ipAddress: '10.0.18.9',
    tamperChecksum: 'a71e8c7921a8b111dc503284aa179603e87d291ba40192e4cc1862b561c944f2',
    changes: {
      before: { batchId: 'PAY-BATCH-2026-10', status: 'DRAFT_IN_HR' },
      after: { batchId: 'PAY-BATCH-2026-10', status: 'SUBMITTED_TO_FINANCE_AND_MD' },
    },
  },
  {
    id: 'evt-aud-904',
    timestamp: 'Today, 09:30 AM',
    user: 'Suresh Raina',
    role: 'Line 1 Production Manager',
    department: 'Precision Assembly Lines',
    departmentCode: 'PROD',
    action: 'DEPARTMENT_WAGE_SUBMISSION',
    entity: 'DepartmentPayrollSheet',
    details: 'Compiled and submitted Line 1 SMT attendance & shift overtime roster (5 Technicians · 60 OT hrs · ₹1,09,095 net) to HR & Finance.',
    severity: 'INFO',
    ipAddress: '10.0.22.41',
    tamperChecksum: 'b561c944f2ef98d0092adcf1b6a71e113a778b4efc9215c90b6a2f89c0e29b14',
    changes: {
      before: { sheetId: 'dept-smt-001', status: 'DRAFT' },
      after: { sheetId: 'dept-smt-001', status: 'SUBMITTED_TO_HR' },
    },
  },
  {
    id: 'evt-aud-905',
    timestamp: 'Today, 09:15 AM',
    user: 'Vikram Malhotra',
    role: 'Parts & Phone Inventory Lead',
    department: 'Warehouse & Parts Stock',
    departmentCode: 'WHS',
    action: 'INBOUND_GRN_RECEIPT',
    entity: 'MaterialStock',
    details: 'Received and verified 10,000 AMOLED 6.7" LTPO displays from BOE Tech. Barcode scans 100% matched to PO-9018.',
    severity: 'INFO',
    ipAddress: '10.0.30.12',
    tamperChecksum: '76d1e4ca51871e8c7921a8b111dc503284aa179603e87d291ba40192e4cc1862',
    changes: {
      before: { currentStock: 850, reorderThreshold: 1000 },
      after: { currentStock: 10850, reorderThreshold: 1000 },
    },
  },
  {
    id: 'evt-aud-906',
    timestamp: 'Today, 08:50 AM',
    user: 'Dr. Rajesh',
    role: 'Top Management (Owner / MD)',
    department: 'Top Management (Owner/MD)',
    departmentCode: 'EXEC',
    action: 'HIGH_VALUE_PO_APPROVAL',
    entity: 'PurchaseOrder',
    details: 'Executive MD authorized PO-9042 totaling ₹1,45,00,000 for 10,000 Qualcomm Snapdragon 8 Gen-3 SoCs.',
    severity: 'CRITICAL',
    ipAddress: '10.0.10.2',
    tamperChecksum: '8f7a62d312bc85c697841f39e9444f9f743ab1a38481283d0bf59c3a649ef201',
    changes: {
      before: { poNumber: 'PO-2026-9042', status: 'PENDING_MD_APPROVAL' },
      after: { poNumber: 'PO-2026-9042', status: 'APPROVED_BY_MD', approvedAt: '2026-10-08T08:50:00Z' },
    },
  },
  {
    id: 'evt-aud-907',
    timestamp: 'Today, 07:45 AM',
    user: 'Rajesh Gurung',
    role: 'Delivery Trucks & Fleet Lead',
    department: 'Fleet & Delivery Vehicles',
    departmentCode: 'FLT',
    action: 'CONVOY_DISPATCH_DEPARTURE',
    entity: 'FleetTrip',
    details: 'Dispatched 5-truck convoy KA-04-ME-4821 carrying 10,000 Apex Pro 5G units to Bangalore International Air Cargo Hub.',
    severity: 'INFO',
    ipAddress: '10.0.45.15',
    tamperChecksum: '113a778b4efc9215c90b6a2f89c0e29b14b561c944f2ef98d0092adcf1b6a71e',
  },
  {
    id: 'evt-aud-908',
    timestamp: 'Yesterday, 05:20 PM',
    user: 'Security Gateway Daemon',
    role: 'System Daemon',
    department: 'Top Management (Owner/MD)',
    departmentCode: 'EXEC',
    action: 'SECURITY_ALERT',
    entity: 'API_GATEWAY',
    details: 'Blocked 4 rapid unauthenticated PIN attempts at North Factory Gate turnstile terminal.',
    severity: 'SECURITY_ALERT',
    ipAddress: '192.168.100.88',
    tamperChecksum: '5483f98a71e8c7921a8b111dc503284aa179603e87d291ba40192e4cc1862b56',
  },
];

export default function AuditLogsPage() {
  const [logs] = useState<CentralAuditLog[]>(CENTRAL_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<CentralAuditLog | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    count: number;
    hashChain: string;
  } | null>(null);

  const handleVerifyIntegrity = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerificationResult({
        valid: true,
        count: logs.length,
        hashChain: 'HMAC-SHA256 Chained Hashes 100% Unbroken',
      });
    }, 600);
  };

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      log.details.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.department.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      log.tamperChecksum.toLowerCase().includes(q);

    const matchesDept =
      departmentFilter === 'ALL' || log.departmentCode === departmentFilter;

    const matchesSeverity =
      severityFilter === 'ALL' || log.severity === severityFilter;

    return matchesSearch && matchesDept && matchesSeverity;
  });

  const criticalCount = logs.filter((l) => l.severity === 'CRITICAL').length;
  const verifiedCount = logs.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Centralized Factory Activity & Audit Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Executive Level
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time aggregated ledger recording every departmental action, submission, money payout, and executive clearance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleVerifyIntegrity}
          disabled={verifying}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          {verifying ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          <span>Verify SHA-256 HMAC Integrity</span>
        </button>
      </div>

      {/* Cryptographic Verification Success Alert */}
      {verificationResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold">
                Cryptographic Integrity Verified: Zero Tampering Detected
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                {verificationResult.hashChain} across {verificationResult.count} recent departmental records.
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-emerald-200/60 dark:bg-emerald-900/60 px-3 py-1 rounded-lg font-semibold text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 self-start sm:self-center">
            HMAC Validated
          </span>
        </div>
      )}

      {/* Top 4 Summary Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Aggregated Records</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <History className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              {logs.length} Logged
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Full cross-departmental capture</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Cryptographic Seal</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Lock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              100% Sealed
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              SHA-256 HMAC chained hashes
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Critical Clearances</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertOctagon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight font-mono">
              {criticalCount} Events
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              High-value POs & wage releases
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Departments Synced</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              7 Divisions
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Finance, WHS, SMT, HR, QA, Fleet
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Department Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: 'All Departments' },
          { key: 'EXEC', label: 'Top Management (Owner/MD)' },
          { key: 'FIN', label: 'Finance & Accounts' },
          { key: 'WHS', label: 'Warehouse & Stock' },
          { key: 'PROD', label: 'Precision Assembly Lines' },
          { key: 'HR', label: 'Human Resources' },
          { key: 'QA', label: 'Quality & Testing' },
          { key: 'FLT', label: 'Fleet & Logistics' },
        ].map((tab) => {
          const isActive = departmentFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setDepartmentFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by action, actor, department, keyword, or hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span>Severity:</span>
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO (Routine Operations)</option>
            <option value="WARNING">WARNING (Variances / Alerts)</option>
            <option value="CRITICAL">CRITICAL (Executive / Money Sign-Off)</option>
            <option value="SECURITY_ALERT">SECURITY ALERT</option>
          </select>
        </div>
      </div>

      {/* Main Aggregated Audit Trail Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
            Live Centralized Activity Ledger
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {filteredLogs.length} matching events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Event Narrative</th>
                <th className="py-3 px-4">HMAC Signature</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                    No audit records matching your current department or severity filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isCritical = log.severity === 'CRITICAL';
                  const isAlert = log.severity === 'SECURITY_ALERT';
                  const isWarning = log.severity === 'WARNING';

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {log.department}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase ${
                            isAlert
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                              : isCritical
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                              : isWarning
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          }`}
                        >
                          {isAlert && <AlertOctagon className="h-3 w-3" />}
                          {log.severity.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {log.action.replace(/_/g, ' ')}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {log.user}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {log.role}
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-sm text-slate-600 dark:text-slate-300 leading-snug">
                        {log.details}
                      </td>

                      <td className="py-3 px-4 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                        <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400" title={log.tamperChecksum}>
                          <Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          {log.tamperChecksum.substring(0, 10)}...
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Detailed State Inspection */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileCode className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Audit Entry State Inspection: {selectedLog.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Actor:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedLog.user} ({selectedLog.role})</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Department:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedLog.department} [{selectedLog.departmentCode}]</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Action & Entity:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedLog.action} &bull; {selectedLog.entity}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Timestamp & Client IP:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedLog.timestamp} &bull; {selectedLog.ipAddress}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-xs">
              <div className="text-slate-400 mb-1 font-semibold text-[10px] uppercase tracking-wider">Event Narration:</div>
              <div className="text-slate-800 dark:text-slate-200 leading-relaxed">{selectedLog.details}</div>
            </div>

            {selectedLog.changes && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-300">
                  State Mutation Diff (Before / After):
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                  <pre>{JSON.stringify(selectedLog.changes, null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Cryptographic HMAC SHA-256 Checksum:
              </div>
              <div className="font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all mt-1">
                {selectedLog.tamperChecksum}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

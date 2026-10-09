'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Building,
  ShieldCheck,
  ArrowUpRight,
  ExternalLink,
  ChevronDown,
  Info,
  DollarSign,
  UserCheck,
  Send,
  Eye,
  Check,
  FileText,
  Lock,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { SupervisoryBanner } from '@/components/SupervisoryBanner';

interface SalaryAuditRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  departmentCode: string;
  payrollBatchId: string;
  batchNumber: string;
  monthYear: string;
  grossAmount: number;
  pfDeduction: number;
  esiDeduction: number;
  netAmount: number;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  creditStatus: 'CREDITED' | 'PENDING' | 'FAILED' | 'MISSED';
  transactionRef?: string;
  discrepancyReason?: string;
  creditedAt?: string;
  verifiedBy: string;
  isResolved: boolean;
  resolutionNotes?: string;
}

const INITIAL_AUDIT_LOGS: SalaryAuditRecord[] = [
  // Flagged Discrepancies (FAILED / MISSED)
  {
    id: 'scl-disc-01',
    employeeId: 'EMP-2026-0112',
    employeeName: 'Ganesh Shinde',
    role: 'Dust-Free Screen Assembly & Bonding Operator',
    department: 'Phone Assembly Lines',
    departmentCode: 'PROD',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 24500,
    pfDeduction: 2940,
    esiDeduction: 184,
    netAmount: 21176,
    bankName: 'Canara Bank (e-Syndicate)',
    bankAccountNumber: '04121010088921',
    ifscCode: 'SYNB0000412',
    creditStatus: 'FAILED',
    transactionRef: 'RTGS-REJ-CANARA-401',
    discrepancyReason: 'Beneficiary IFSC Code Inactive (Branch Merged with Canara Bank CNRB0000412). Bank rejected RTGS.',
    verifiedBy: 'Super Admin Bank Gateway Audit',
    isResolved: false,
  },
  {
    id: 'scl-disc-02',
    employeeId: 'EMP-2026-0044',
    employeeName: 'Kavita Deshmukh',
    role: 'Cleanroom Optical Quality Inspector',
    department: 'Phone Quality Checks',
    departmentCode: 'QA',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 26000,
    pfDeduction: 3120,
    esiDeduction: 0,
    netAmount: 22680,
    bankName: 'State Bank of India',
    bankAccountNumber: '20491829011',
    ifscCode: 'SBIN0001092',
    creditStatus: 'MISSED',
    discrepancyReason: 'Beneficiary Account Dormant / Inactive for > 6 months. Bank gateway dropped credit pulse without return ack.',
    verifiedBy: 'Super Admin Discrepancy Monitor',
    isResolved: false,
  },
  {
    id: 'scl-disc-03',
    employeeId: 'EMP-2026-0189',
    employeeName: 'Deepak Joshi',
    role: 'Robotic Machine & Heating Oven Technician',
    department: 'Machine Maintenance',
    departmentCode: 'ENG',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 27500,
    pfDeduction: 3300,
    esiDeduction: 0,
    netAmount: 24000,
    bankName: 'Axis Bank',
    bankAccountNumber: '918020048192041',
    ifscCode: 'UTIB0000184',
    creditStatus: 'FAILED',
    transactionRef: 'AXIS-RTGS-ERR-NAME-99',
    discrepancyReason: 'Name Mismatch: Beneficiary bank title "Deepak R Joshi" differs from factory Aadhaar payroll name "Deepak Joshi".',
    verifiedBy: 'HDFC Corporate Banking Gateway',
    isResolved: false,
  },

  // Pending Clearance
  {
    id: 'scl-pend-01',
    employeeId: 'EMP-2026-0210',
    employeeName: 'Arun Kumar',
    role: 'Chipset Storage Bin Handler',
    department: 'Warehouse & Inventory',
    departmentCode: 'WHS',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 22000,
    pfDeduction: 2640,
    esiDeduction: 165,
    netAmount: 18995,
    bankName: 'HDFC Bank',
    bankAccountNumber: '50100492810944',
    ifscCode: 'HDFC0001092',
    creditStatus: 'PENDING',
    transactionRef: 'HDFC-RTGS-INTRANSIT-01',
    discrepancyReason: 'New Employee Mandate: Micro-penny drop authentication in progress by corporate clearing house.',
    verifiedBy: 'Super Admin Supervisory Desk',
    isResolved: false,
  },
  {
    id: 'scl-pend-02',
    employeeId: 'EMP-2026-0215',
    employeeName: 'Pooja Hegde',
    role: 'Assembly Floor Staff Allocation Specialist',
    department: 'Assembly Operations',
    departmentCode: 'PROD',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 32000,
    pfDeduction: 3840,
    esiDeduction: 0,
    netAmount: 27960,
    bankName: 'ICICI Bank',
    bankAccountNumber: '001205019284',
    ifscCode: 'ICIC0000012',
    creditStatus: 'PENDING',
    transactionRef: 'HDFC-RTGS-INTRANSIT-02',
    discrepancyReason: 'Corporate RTGS settlement batch queued for afternoon inter-bank clearing cycle.',
    verifiedBy: 'Super Admin Supervisory Desk',
    isResolved: false,
  },
  {
    id: 'scl-pend-03',
    employeeId: 'EMP-2026-0220',
    employeeName: 'Vijay Nair',
    role: 'Factory Gate Security & Receiving Officer',
    department: 'Logistics & Security',
    departmentCode: 'LOG',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 21000,
    pfDeduction: 2520,
    esiDeduction: 158,
    netAmount: 18122,
    bankName: 'Kotak Mahindra Bank',
    bankAccountNumber: '4912019482',
    ifscCode: 'KKBK0008192',
    creditStatus: 'PENDING',
    transactionRef: 'HDFC-RTGS-INTRANSIT-03',
    discrepancyReason: 'Corporate RTGS settlement batch queued for afternoon inter-bank clearing cycle.',
    verifiedBy: 'Super Admin Supervisory Desk',
    isResolved: false,
  },

  // Successfully Credited Samples
  {
    id: 'scl-cred-01',
    employeeId: 'EMP-2026-0001',
    employeeName: 'Dr. Rajesh',
    role: 'Top Management (Owner / MD)',
    department: 'Top Management (Owner / MD)',
    departmentCode: 'EXEC',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 185000,
    pfDeduction: 22200,
    esiDeduction: 0,
    netAmount: 162600,
    bankName: 'HDFC Bank',
    bankAccountNumber: '50100492810001',
    ifscCode: 'HDFC0001092',
    creditStatus: 'CREDITED',
    transactionRef: 'HDFC-RTGS-990412-001',
    creditedAt: 'Oct 07, 2026 · 11:00 AM',
    verifiedBy: 'RBI NEFT/RTGS Gateway Clearance',
    isResolved: true,
  },
  {
    id: 'scl-cred-02',
    employeeId: 'EMP-2026-0002',
    employeeName: 'Amitabh Sen',
    role: 'Factory Accounts & Finance Lead',
    department: 'Finance & Accounts',
    departmentCode: 'FIN',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 78000,
    pfDeduction: 9360,
    esiDeduction: 0,
    netAmount: 68440,
    bankName: 'HDFC Bank',
    bankAccountNumber: '50100492810002',
    ifscCode: 'HDFC0001092',
    creditStatus: 'CREDITED',
    transactionRef: 'HDFC-RTGS-990412-002',
    creditedAt: 'Oct 07, 2026 · 11:00 AM',
    verifiedBy: 'RBI NEFT/RTGS Gateway Clearance',
    isResolved: true,
  },
  {
    id: 'scl-cred-03',
    employeeId: 'EMP-2026-0003',
    employeeName: 'Suresh Raina',
    role: 'Phone Assembly & Screen Fitting Lead',
    department: 'Phone Assembly Lines',
    departmentCode: 'PROD',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 65000,
    pfDeduction: 7800,
    esiDeduction: 0,
    netAmount: 57000,
    bankName: 'State Bank of India',
    bankAccountNumber: '20491829003',
    ifscCode: 'SBIN0001092',
    creditStatus: 'CREDITED',
    transactionRef: 'HDFC-RTGS-990412-003',
    creditedAt: 'Oct 07, 2026 · 11:00 AM',
    verifiedBy: 'RBI NEFT/RTGS Gateway Clearance',
    isResolved: true,
  },
  {
    id: 'scl-cred-04',
    employeeId: 'EMP-2026-0004',
    employeeName: 'Vikram Malhotra',
    role: 'Parts & Phone Inventory Lead',
    department: 'Warehouse & Inventory',
    departmentCode: 'WHS',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 62000,
    pfDeduction: 7440,
    esiDeduction: 0,
    netAmount: 54360,
    bankName: 'Axis Bank',
    bankAccountNumber: '91802004819004',
    ifscCode: 'UTIB0000184',
    creditStatus: 'CREDITED',
    transactionRef: 'HDFC-RTGS-990412-004',
    creditedAt: 'Oct 07, 2026 · 11:00 AM',
    verifiedBy: 'RBI NEFT/RTGS Gateway Clearance',
    isResolved: true,
  },
  {
    id: 'scl-cred-05',
    employeeId: 'EMP-2026-0005',
    employeeName: 'Dr. Anand Verma',
    role: 'Phone Quality & Signal Testing Lead',
    department: 'Quality Checks',
    departmentCode: 'QA',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 68000,
    pfDeduction: 8160,
    esiDeduction: 0,
    netAmount: 59640,
    bankName: 'ICICI Bank',
    bankAccountNumber: '001205019005',
    ifscCode: 'ICIC0000012',
    creditStatus: 'CREDITED',
    transactionRef: 'HDFC-RTGS-990412-005',
    creditedAt: 'Oct 07, 2026 · 11:00 AM',
    verifiedBy: 'RBI NEFT/RTGS Gateway Clearance',
    isResolved: true,
  },
  {
    id: 'scl-cred-06',
    employeeId: 'EMP-2026-0101',
    employeeName: 'Rameshwar Patil',
    role: 'Circuit Board Pick-and-Place Operator',
    department: 'Phone Assembly Lines',
    departmentCode: 'PROD',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 25500,
    pfDeduction: 3060,
    esiDeduction: 0,
    netAmount: 22240,
    bankName: 'HDFC Bank',
    bankAccountNumber: '50100492810101',
    ifscCode: 'HDFC0001092',
    creditStatus: 'CREDITED',
    transactionRef: 'HDFC-RTGS-990412-101',
    creditedAt: 'Oct 07, 2026 · 11:00 AM',
    verifiedBy: 'RBI NEFT/RTGS Gateway Clearance',
    isResolved: true,
  },
  {
    id: 'scl-cred-07',
    employeeId: 'EMP-2026-0102',
    employeeName: 'Sunil Jagtap',
    role: 'SMT Stencil Printer Specialist',
    department: 'Phone Assembly Lines',
    departmentCode: 'PROD',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 24000,
    pfDeduction: 2880,
    esiDeduction: 0,
    netAmount: 20920,
    bankName: 'Bank of Baroda',
    bankAccountNumber: '1820019280102',
    ifscCode: 'BARB0MAHAPU',
    creditStatus: 'CREDITED',
    transactionRef: 'HDFC-RTGS-990412-102',
    creditedAt: 'Oct 07, 2026 · 11:00 AM',
    verifiedBy: 'RBI NEFT/RTGS Gateway Clearance',
    isResolved: true,
  },
  {
    id: 'scl-cred-08',
    employeeId: 'EMP-2026-0103',
    employeeName: 'Santosh Gowda',
    role: 'Barcode & QR Scanner Staff',
    department: 'Warehouse & Inventory',
    departmentCode: 'WHS',
    payrollBatchId: 'PAY-BATCH-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    monthYear: 'September 2026',
    grossAmount: 21500,
    pfDeduction: 2580,
    esiDeduction: 161,
    netAmount: 18559,
    bankName: 'State Bank of India',
    bankAccountNumber: '20491829103',
    ifscCode: 'SBIN0001092',
    creditStatus: 'CREDITED',
    transactionRef: 'HDFC-RTGS-990412-103',
    creditedAt: 'Oct 07, 2026 · 11:01 AM',
    verifiedBy: 'RBI NEFT/RTGS Gateway Clearance',
    isResolved: true,
  },
];

export default function SalaryCreditAuditPage() {
  const { session } = useAuth();
  const isSuperAdmin = session?.roleId === 'super_admin';

  const [records, setRecords] = useState<SalaryAuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CREDITED' | 'PENDING' | 'DISCREPANCY'>('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncBanner, setSyncBanner] = useState<string | null>(null);

  // Resolution modal state
  const [selectedRecord, setSelectedRecord] = useState<SalaryAuditRecord | null>(null);
  const [resolutionAction, setResolutionAction] = useState<'RETRY_RTGS' | 'UPDATE_BANK_AND_RETRY' | 'MARK_MANUAL_SETTLED'>('UPDATE_BANK_AND_RETRY');
  const [updatedAccount, setUpdatedAccount] = useState('');
  const [updatedIfsc, setUpdatedIfsc] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Total workforce constants
  const totalEligible = 144;
  const totalNetPayroll = 3321600;

  // Counts & Statistics
  const failedList = records.filter((r) => r.creditStatus === 'FAILED' || r.creditStatus === 'MISSED');
  const pendingList = records.filter((r) => r.creditStatus === 'PENDING');
  const creditedList = records.filter((r) => r.creditStatus === 'CREDITED');

  const discrepancyCount = failedList.length;
  const pendingCount = pendingList.length;
  const creditedCount = totalEligible - discrepancyCount - pendingCount; // 138

  const discrepancyAmount = failedList.reduce((acc, r) => acc + r.netAmount, 0);
  const pendingAmount = pendingList.reduce((acc, r) => acc + r.netAmount, 0);
  const creditedAmount = totalNetPayroll - discrepancyAmount - pendingAmount;
  const clearanceRate = Number(((creditedCount / totalEligible) * 100).toFixed(1));

  // Filtered records for table display
  const filteredRecords = useMemo(() => {
    const q = search.toLowerCase().trim();

    return records.filter((r) => {
      const matchesSearch =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.bankAccountNumber.includes(q) ||
        r.ifscCode.toLowerCase().includes(q) ||
        (r.transactionRef && r.transactionRef.toLowerCase().includes(q)) ||
        (r.discrepancyReason && r.discrepancyReason.toLowerCase().includes(q));

      const matchesDept = departmentFilter === 'ALL' || r.department === departmentFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'CREDITED' && r.creditStatus === 'CREDITED') ||
        (statusFilter === 'PENDING' && r.creditStatus === 'PENDING') ||
        (statusFilter === 'DISCREPANCY' && (r.creditStatus === 'FAILED' || r.creditStatus === 'MISSED'));

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [records, search, departmentFilter, statusFilter]);

  // Sync Bank RTGS Gateway pulse
  const handleSyncBankFeed = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncBanner(
        `Bank RTGS Gateway feed synchronized with HDFC Corporate CMS: 138 credits confirmed, 3 in transit, 3 rejections requiring Super Admin resolution.`,
      );
    }, 700);
  };

  // Open inspector/resolution modal
  const handleOpenResolve = (record: SalaryAuditRecord) => {
    setSelectedRecord(record);
    setUpdatedAccount(record.bankAccountNumber);
    setUpdatedIfsc(
      record.creditStatus === 'FAILED' && record.bankName.includes('Canara')
        ? 'CNRB0000412'
        : record.ifscCode,
    );
    setResolutionNotes(
      record.creditStatus === 'FAILED'
        ? 'Updated active IFSC code per beneficiary bank merger advisory; re-dispatched payment.'
        : 'Reactivated dormant account with beneficiary bank; re-queued corporate NEFT.',
    );
  };

  // Execute resolution
  const handleExecuteResolution = () => {
    if (!selectedRecord) return;

    const newUtr = `HDFC-CORP-RETRY-${Math.floor(100000 + Math.random() * 900000)}`;

    setRecords((prev) =>
      prev.map((item) => {
        if (item.id === selectedRecord.id) {
          return {
            ...item,
            creditStatus: 'CREDITED',
            bankAccountNumber: updatedAccount || item.bankAccountNumber,
            ifscCode: updatedIfsc || item.ifscCode,
            transactionRef: newUtr,
            creditedAt: 'Just now (Cleared via Retry)',
            isResolved: true,
            resolutionNotes: `Resolved by Super Admin: ${resolutionNotes} (UTR #${newUtr})`,
          };
        }
        return item;
      }),
    );

    setSelectedRecord(null);
    setSyncBanner(`Discrepancy for ${selectedRecord.employeeName} (${selectedRecord.employeeId}) resolved successfully via UTR #${newUtr}!`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Super Admin Supervisory Mode Banner */}
      <SupervisoryBanner
        departmentName="Factory Payroll & Salary Credit Audit"
        departmentCode="AUDIT-SALARY"
        staffRoleTitle="Factory Accounts & Finance Lead"
        onViewAuditFeed={() => {
          const el = document.getElementById('audit-table-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Salary Credit Status & Discrepancy Audit
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Live Bank Gateway
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time bank clearance verification across all 21 manufacturing roles. Detect missing, delayed, or failed technician salary credits.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSyncBankFeed}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Bank RTGS Feed</span>
          </button>
        </div>
      </div>

      {/* Sync Confirmation Banner */}
      {syncBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{syncBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncBanner(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Eligible */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Eligible Staff</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              {totalEligible} Technicians
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Net Payroll: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(totalNetPayroll)}</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Successfully Credited */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Successfully Credited</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              {creditedCount} Cleared
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>{clearanceRate}% Clearance Rate ({formatCurrency(creditedAmount)})</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending In-Transit */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Pending In-Transit</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
              {pendingCount} Employees
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Queued: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(pendingAmount)}</strong>
            </div>
          </div>
        </div>

        {/* Card 4: Discrepancies / Missing */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Missing / Failed</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertOctagon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight font-mono">
              {discrepancyCount} Flagged
            </div>
            <div className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
              Requires Super Admin Action ({formatCurrency(discrepancyAmount)})
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy Highlight Banner */}
      {discrepancyCount > 0 && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5 text-rose-800 dark:text-rose-300 font-bold text-sm">
              <AlertOctagon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <span>Urgent Attention: {discrepancyCount} Salaries Failed or Were Missed by Bank Gateway</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusFilter('DISCREPANCY')}
              className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 hover:bg-rose-200 px-3 py-1 rounded-lg transition cursor-pointer"
            >
              Filter Only Flagged ({discrepancyCount})
            </button>
          </div>

          <p className="text-xs text-rose-700 dark:text-rose-300/80 leading-relaxed">
            The banking gateway returned errors during automated RTGS release for the following workers: Branch Merger IFSC Inactive (Ganesh Shinde), Dormant Bank Account (Kavita Deshmukh), and Aadhaar Name Mismatch (Deepak Joshi). Inspect below to correct and trigger immediate re-credit.
          </p>
        </div>
      )}

      {/* Filter Toolbar */}
      <div id="audit-table-section" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search employee, ID, account, UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Records ({records.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('CREDITED')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === 'CREDITED'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              Credited ({records.filter((r) => r.creditStatus === 'CREDITED').length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
              }`}
            >
              Pending ({records.filter((r) => r.creditStatus === 'PENDING').length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('DISCREPANCY')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === 'DISCREPANCY'
                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              Discrepancies ({records.filter((r) => r.creditStatus === 'FAILED' || r.creditStatus === 'MISSED').length})
            </button>
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="Phone Assembly Lines">Phone Assembly Lines</option>
            <option value="Warehouse & Inventory">Warehouse & Inventory</option>
            <option value="Quality Checks">Quality Checks</option>
            <option value="Finance & Accounts">Finance & Accounts</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Machine Maintenance">Machine Maintenance</option>
            <option value="Logistics & Security">Logistics & Security</option>
          </select>
        </div>
      </div>

      {/* Detailed Audit Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
            Employee Salary Credit Ledger & Bank Gateway Status
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Batch: PAY-BATCH-2026-09 &bull; {filteredRecords.length} workers listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Role & Department</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4">Bank & Account</th>
                <th className="py-3 px-4">Credit Status</th>
                <th className="py-3 px-4">Bank Reference / Reason</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No salary records matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const isCredited = item.creditStatus === 'CREDITED';
                  const isPending = item.creditStatus === 'PENDING';
                  const isFailed = item.creditStatus === 'FAILED';
                  const isMissed = item.creditStatus === 'MISSED';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors ${
                        isFailed || isMissed ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''
                      }`}
                    >
                      {/* Employee Info */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {item.employeeName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {item.employeeId}
                        </div>
                      </td>

                      {/* Role & Department */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
                          {item.role}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.department}
                        </div>
                      </td>

                      {/* Net Salary Amount */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(item.netAmount)}
                        <div className="text-[10px] text-slate-400 font-normal">
                          Gross: {formatCurrency(item.grossAmount)}
                        </div>
                      </td>

                      {/* Bank Details */}
                      <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                        <div className="text-slate-800 dark:text-slate-200 font-semibold">
                          {item.bankName}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          A/C: {item.bankAccountNumber} &bull; {item.ifscCode}
                        </div>
                      </td>

                      {/* Credit Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isCredited && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Credited
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                            <AlertOctagon className="h-3 w-3" />
                            Failed Rejection
                          </span>
                        )}
                        {isMissed && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            <AlertTriangle className="h-3 w-3" />
                            Missed Pulse
                          </span>
                        )}
                      </td>

                      {/* Transaction Reference / Discrepancy Reason */}
                      <td className="py-3 px-4 max-w-sm">
                        {isCredited && (
                          <div>
                            <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                              UTR: {item.transactionRef}
                            </span>
                            <div className="text-[10px] text-slate-400">{item.creditedAt}</div>
                          </div>
                        )}
                        {isPending && (
                          <div>
                            <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
                              Ref: {item.transactionRef}
                            </span>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                              {item.discrepancyReason}
                            </div>
                          </div>
                        )}
                        {(isFailed || isMissed) && (
                          <div>
                            <div className="text-xs font-medium text-rose-700 dark:text-rose-300 leading-snug">
                              {item.discrepancyReason}
                            </div>
                            {item.transactionRef && (
                              <div className="text-[10px] font-mono text-rose-500 mt-0.5">
                                Rejection Ref: {item.transactionRef}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {(isFailed || isMissed) ? (
                          <button
                            type="button"
                            onClick={() => handleOpenResolve(item)}
                            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
                          >
                            Resolve Discrepancy
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenResolve(item)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition cursor-pointer"
                          >
                            Inspect Log
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discrepancy Inspector & Resolution Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Salary Credit Audit & Resolution: {selectedRecord.employeeName}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Employee Quick Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Worker ID & Name:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedRecord.employeeName}</strong>
                <div className="text-[10px] font-mono text-slate-500">{selectedRecord.employeeId}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Net Payout Amount:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                  {formatCurrency(selectedRecord.netAmount)}
                </strong>
                <div className="text-[10px] text-slate-500">{selectedRecord.department}</div>
              </div>
            </div>

            {/* Banking Discrepancy Alert */}
            {selectedRecord.discrepancyReason && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-1">
                <div className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertOctagon className="h-3.5 w-3.5" />
                  Bank Gateway Rejection Reason:
                </div>
                <div className="text-xs text-rose-900 dark:text-rose-200 font-medium">
                  {selectedRecord.discrepancyReason}
                </div>
              </div>
            )}

            {/* Correction Form */}
            <div className="space-y-3 pt-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Bank Account & IFSC Correction
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                    Beneficiary Account Number:
                  </label>
                  <input
                    type="text"
                    value={updatedAccount}
                    onChange={(e) => setUpdatedAccount(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                    Active IFSC Code:
                  </label>
                  <input
                    type="text"
                    value={updatedIfsc}
                    onChange={(e) => setUpdatedIfsc(e.target.value)}
                    className="w-full text-xs font-mono uppercase px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                  Resolution Audit Remarks:
                </label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleExecuteResolution}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Re-Disburse via Corporate RTGS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

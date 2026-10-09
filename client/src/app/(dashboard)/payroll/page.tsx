'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
  Send,
  FileCheck2,
  Check,
  X,
  FileText,
  Search,
  Filter,
  DollarSign,
  UserCheck,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Printer,
  Calendar,
  Lock,
} from 'lucide-react';
import { PayrollBatchItem, PayrollLineItem } from '@/types/payroll-cred';
import { useAuth } from '@/context/AuthContext';
import { BarChart, DonutChart } from '@/components/charts';

const INITIAL_BATCHES: PayrollBatchItem[] = [
  {
    id: 'batch-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    month: 'September',
    year: 2026,
    periodLabel: 'September 2026 Shift Factory Payroll',
    totalHeadcount: 144,
    grossTotal: 3840000,
    totalEsi: 28800,
    totalPf: 460800,
    totalNetPayout: 3321600,
    submittedBy: 'Kavita Menon (HR Lead)',
    submittedById: 'hr-lead',
    status: 'RELEASED',
    financeApproverId: 'finance-lead',
    financeApproverName: 'Amitabh Sen (Finance Lead)',
    financeNotes: 'All attendance punches verified against biometric turnstile logs. Statutory PF & ESI matched.',
    bankDisbursementRef: 'HDFC-CORP-RTGS-990412',
    submittedAt: '2026-09-28T14:30:00.000Z',
    verifiedAt: '2026-09-29T10:15:00.000Z',
    releasedAt: '2026-09-30T11:00:00.000Z',
    lineItems: [],
    createdAt: '2026-09-28T14:30:00.000Z',
    updatedAt: '2026-09-30T11:00:00.000Z',
  },
  {
    id: 'batch-2026-10',
    batchNumber: 'PAY-BATCH-2026-10',
    month: 'October',
    year: 2026,
    periodLabel: 'October 2026 Shift Factory Payroll',
    totalHeadcount: 144,
    grossTotal: 3920000,
    totalEsi: 29400,
    totalPf: 470400,
    totalNetPayout: 3391400,
    submittedBy: 'Kavita Menon (HR Lead)',
    submittedById: 'hr-lead',
    status: 'PENDING_FINANCE_VERIFICATION',
    financeApproverId: null,
    financeApproverName: null,
    financeNotes: null,
    bankDisbursementRef: null,
    submittedAt: '2026-10-06T16:00:00.000Z',
    verifiedAt: null,
    releasedAt: null,
    lineItems: [
      {
        id: 'item-1',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0101',
        employeeName: 'Rameshwar Patil',
        role: 'Phone Assembly Technician',
        department: 'Phone Assembly Lines',
        payableDays: 30,
        presentDays: 29,
        leaveDays: 1,
        overtimeHours: 12,
        basicSalary: 18000,
        allowances: 11000,
        grossEarnings: 29000,
        esiDeduction: 0,
        pfDeduction: 2160,
        totalDeductions: 2360,
        netPayout: 26640,
        bankName: 'State Bank of India',
        accountNumber: '381920194821',
        ifscCode: 'SBIN0004120',
        paymentStatus: 'PENDING',
      },
      {
        id: 'item-2',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0102',
        employeeName: 'Priya Sharma',
        role: 'AMOLED Screen QC Inspector',
        department: 'Phone Quality Checks',
        payableDays: 30,
        presentDays: 30,
        leaveDays: 0,
        overtimeHours: 6,
        basicSalary: 22000,
        allowances: 14000,
        grossEarnings: 36000,
        esiDeduction: 0,
        pfDeduction: 2640,
        totalDeductions: 2840,
        netPayout: 33160,
        bankName: 'HDFC Bank',
        accountNumber: '50100293847162',
        ifscCode: 'HDFC0001824',
        paymentStatus: 'PENDING',
      },
      {
        id: 'item-3',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0103',
        employeeName: 'Dilip Sawant',
        role: 'Commercial Fleet Delivery Driver',
        department: 'Fleet & Logistics',
        payableDays: 30,
        presentDays: 28,
        leaveDays: 2,
        overtimeHours: 18,
        basicSalary: 14000,
        allowances: 6500,
        grossEarnings: 20500,
        esiDeduction: 154,
        pfDeduction: 1680,
        totalDeductions: 2034,
        netPayout: 18466,
        bankName: 'ICICI Bank',
        accountNumber: '001901582910',
        ifscCode: 'ICIC0000019',
        paymentStatus: 'PENDING',
      },
      {
        id: 'item-4',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0104',
        employeeName: 'Kavita Menon',
        role: 'HR & Labor Compliance Officer',
        department: 'Human Resources',
        payableDays: 30,
        presentDays: 30,
        leaveDays: 0,
        overtimeHours: 0,
        basicSalary: 35000,
        allowances: 25000,
        grossEarnings: 60000,
        esiDeduction: 0,
        pfDeduction: 4200,
        totalDeductions: 4400,
        netPayout: 55600,
        bankName: 'Axis Bank',
        accountNumber: '91802019482716',
        ifscCode: 'UTIB0000214',
        paymentStatus: 'PENDING',
      },
      {
        id: 'item-5',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0105',
        employeeName: 'Amitabh Sen',
        role: 'Commercial Finance Lead',
        department: 'Finance & Accounts',
        payableDays: 30,
        presentDays: 30,
        leaveDays: 0,
        overtimeHours: 0,
        basicSalary: 50000,
        allowances: 40000,
        grossEarnings: 90000,
        esiDeduction: 0,
        pfDeduction: 6000,
        totalDeductions: 6200,
        netPayout: 83800,
        bankName: 'HDFC Bank',
        accountNumber: '50100492817291',
        ifscCode: 'HDFC0000120',
        paymentStatus: 'PENDING',
      },
    ],
    createdAt: '2026-10-06T16:00:00.000Z',
    updatedAt: '2026-10-06T16:00:00.000Z',
  },
];

export default function PayrollManagementPage() {
  const { session } = useAuth();
  const [batches, setBatches] = useState<PayrollBatchItem[]>(INITIAL_BATCHES);
  const [activeTab, setActiveTab] = useState<'submission' | 'finance_review' | 'history'>('submission');
  const [selectedBatch, setSelectedBatch] = useState<PayrollBatchItem>(INITIAL_BATCHES[1]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Submission notes
  const [hrNotes, setHrNotes] = useState('All 144 factory technician shifts verified with biometrics and overtime approved.');
  const [financeNotes, setFinanceNotes] = useState('Statutory PF (12%) and ESI contribution matching verified against attendance records.');

  // Check if current user is finance or super admin
  const isFinanceUser = session?.roleId === 'finance' || session?.roleId === 'super_admin';

  // Handle HR submitting new draft to Finance
  const handleHrSubmitToFinance = (e: React.FormEvent) => {
    e.preventDefault();
    const batchId = `batch-${Date.now()}`;
    const newBatch: PayrollBatchItem = {
      id: batchId,
      batchNumber: `PAY-BATCH-2026-1${batches.length}`,
      month: 'October',
      year: 2026,
      periodLabel: 'October 2026 Shift Factory Payroll (Revised)',
      totalHeadcount: 144,
      grossTotal: 3950000,
      totalEsi: 29625,
      totalPf: 474000,
      totalNetPayout: 3417575,
      submittedBy: session?.username || 'Kavita Menon (HR Lead)',
      submittedById: session?.roleId || 'hr-lead',
      status: 'PENDING_FINANCE_VERIFICATION',
      financeApproverId: null,
      financeApproverName: null,
      financeNotes: hrNotes,
      bankDisbursementRef: null,
      submittedAt: new Date().toISOString(),
      verifiedAt: null,
      releasedAt: null,
      lineItems: selectedBatch.lineItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBatches([newBatch, ...batches]);
    setSelectedBatch(newBatch);
    setShowSubmitModal(false);
    setToastMsg(`Payroll Batch [${newBatch.batchNumber}] submitted to Finance for verification.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Handle Finance Verification
  const handleFinanceVerify = () => {
    const updated = {
      ...selectedBatch,
      status: 'VERIFIED' as const,
      financeApproverId: session?.roleId || 'finance',
      financeApproverName: session?.username || 'Amitabh Sen (Finance Lead)',
      financeNotes: financeNotes,
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBatches(batches.map((b) => (b.id === updated.id ? updated : b)));
    setSelectedBatch(updated);
    setShowVerifyModal(false);
    setToastMsg(`Payroll Batch [${updated.batchNumber}] verified! Ready for bank disbursement.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Handle Finance Release Payout
  const handleFinanceRelease = () => {
    const bankRef = `HDFC-CORP-RTGS-${Math.floor(100000 + Math.random() * 900000)}`;
    const updated = {
      ...selectedBatch,
      status: 'RELEASED' as const,
      bankDisbursementRef: bankRef,
      releasedAt: new Date().toISOString(),
      verifiedAt: selectedBatch.verifiedAt || new Date().toISOString(),
      financeApproverName: session?.username || 'Amitabh Sen (Finance Lead)',
      updatedAt: new Date().toISOString(),
    };

    setBatches(batches.map((b) => (b.id === updated.id ? updated : b)));
    setSelectedBatch(updated);
    setShowReleaseModal(false);
    setToastMsg(`Payout Officially Released! Bank Reference: ${bankRef}`);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const pendingBatches = useMemo(() => {
    return batches.filter((b) => b.status === 'PENDING_FINANCE_VERIFICATION' || b.status === 'VERIFIED');
  }, [batches]);

  // Visual Analytics Datasets
  const batchComparisonData = useMemo(() => {
    return batches.slice(0, 4).reverse().map((b) => ({
      label: `${b.month} ${b.year}`,
      gross: b.grossTotal,
      net: b.totalNetPayout,
      deductions: b.totalPf + b.totalEsi,
    }));
  }, [batches]);

  const selectedBatchDonutData = useMemo(() => [
    {
      name: 'Net Payout (Bank RTGS)',
      value: selectedBatch.totalNetPayout,
      color: '#10b981',
      description: 'Employee take-home wages',
    },
    {
      name: 'Provident Fund (PF 12%)',
      value: selectedBatch.totalPf,
      color: '#6366f1',
      description: 'Statutory EPFO contribution',
    },
    {
      name: 'Employees State Insurance (ESI)',
      value: selectedBatch.totalEsi,
      color: '#3b82f6',
      description: 'Medical healthcare pool',
    },
  ], [selectedBatch]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
              <CreditCard className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              Factory Payout Settlement Engine
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Staff Salaries & Payout Settlement Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multi-tier workflow between HR (submission), Finance (verification & release), and Super Admin for monthly phone factory wages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/credentials"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-xs"
          >
            <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Manage Staff Credentials
          </Link>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            Send Payout to Finance
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics (Current Batch Highlight) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Shift Headcount</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              {selectedBatch.totalHeadcount} Staff
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active assembly & shift operators
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Gross Earnings Total</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              ₹ {(selectedBatch.grossTotal / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Basic wages + shift allowances
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Statutory PF & ESI</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
              ₹ {((selectedBatch.totalPf + selectedBatch.totalEsi) / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              PF: ₹{(selectedBatch.totalPf / 1000).toFixed(0)}k &bull; ESI: ₹{(selectedBatch.totalEsi / 1000).toFixed(1)}k
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Net Bank Payout</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              ₹ {(selectedBatch.totalNetPayout / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              <span>Direct Bank NEFT / RTGS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics: Monthly Payout Trends & Statutory Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BarChart
            data={batchComparisonData}
            series={[
              { key: 'gross', name: 'Gross Wage Earnings', color: '#6366f1' },
              { key: 'net', name: 'Net Take-Home Payout', color: '#10b981' },
              { key: 'deductions', name: 'Statutory Deductions (PF+ESI)', color: '#f59e0b' },
            ]}
            xAxisKey="label"
            mode="grouped"
            title="Monthly Factory Payroll Comparison"
            subtitle="Comparing Gross Total, Net Payout, and Statutory Pool over recent shift batches"
            yAxisFormatter={(v) => `₹ ${(v / 100000).toFixed(1)}L`}
            tooltipFormatter={(v) => `₹ ${(v / 100000).toFixed(2)} Lakhs`}
            height={260}
          />
        </div>

        <div className="lg:col-span-5">
          <DonutChart
            data={selectedBatchDonutData}
            title={`${selectedBatch.month} ${selectedBatch.year} Deduction Distribution`}
            subtitle={`${selectedBatch.batchNumber} (${selectedBatch.totalHeadcount} staff)`}
            centerLabel="Net Payout"
            centerValue={`${((selectedBatch.totalNetPayout / selectedBatch.grossTotal) * 100).toFixed(1)}%`}
            centerSubtext={`₹ ${(selectedBatch.totalNetPayout / 100000).toFixed(2)}L`}
            valueFormatter={(v) => `₹ ${(v / 100000).toFixed(2)}L`}
            height={260}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('submission')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'submission'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          1. Current Month Payout Statement (HR / IT)
        </button>

        <button
          onClick={() => setActiveTab('finance_review')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'finance_review'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <span>2. Finance Review & Settlement Desk</span>
          {pendingBatches.length > 0 && (
            <span className="h-4 w-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingBatches.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          3. Payout History & Bank References
        </button>
      </div>

      {/* TAB 1: HR Payout Submission Dashboard */}
      {activeTab === 'submission' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {selectedBatch.periodLabel}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Batch Code: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{selectedBatch.batchNumber}</span> &bull; Submitted by: {selectedBatch.submittedBy}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    selectedBatch.status === 'RELEASED'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : selectedBatch.status === 'VERIFIED'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {selectedBatch.status === 'RELEASED'
                    ? 'Payout Released & Settled'
                    : selectedBatch.status === 'VERIFIED'
                    ? 'Finance Verified - Awaiting Release'
                    : 'Pending Finance Verification'}
                </span>

                {selectedBatch.status === 'PENDING_FINANCE_VERIFICATION' && (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                  >
                    Resubmit / Update
                  </button>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-950/70">
                    <th className="py-3 px-3.5">Staff Member</th>
                    <th className="py-3 px-3.5">Role & Department</th>
                    <th className="py-3 px-3.5">Days (Pres/Leave)</th>
                    <th className="py-3 px-3.5">Gross Earnings</th>
                    <th className="py-3 px-3.5">PF (12%)</th>
                    <th className="py-3 px-3.5">ESI (0.75%)</th>
                    <th className="py-3 px-3.5">Net Payout</th>
                    <th className="py-3 px-3.5">Bank Account</th>
                    <th className="py-3 px-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {selectedBatch.lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">{item.employeeName}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{item.employeeId}</div>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{item.role}</div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400">{item.department}</div>
                      </td>

                      <td className="py-3 px-3.5 font-mono text-[11px]">
                        <div>{item.presentDays} Days present</div>
                        <div className="text-[10px] text-slate-400">{item.overtimeHours}h Overtime</div>
                      </td>

                      <td className="py-3 px-3.5 font-mono">
                        <div className="font-semibold text-slate-900 dark:text-white">₹{item.grossEarnings.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">Basic: ₹{item.basicSalary.toLocaleString()}</div>
                      </td>

                      <td className="py-3 px-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        ₹{item.pfDeduction.toLocaleString()}
                      </td>

                      <td className="py-3 px-3.5 font-mono text-amber-600 dark:text-amber-400">
                        {item.esiDeduction > 0 ? `₹${item.esiDeduction}` : 'Exempt'}
                      </td>

                      <td className="py-3 px-3.5 font-mono">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₹{item.netPayout.toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-[11px] font-mono">
                        <div className="text-slate-800 dark:text-slate-200">{item.bankName}</div>
                        <div className="text-[10px] text-slate-400">{item.accountNumber}</div>
                      </td>

                      <td className="py-3 px-3.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {selectedBatch.status === 'RELEASED' ? 'Settled' : 'Ready'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Finance Review & Settlement Desk */}
      {activeTab === 'finance_review' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Finance Payout Cross-Verification Desk
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cross-verify biometric attendance, statutory PF and ESI registers, and authorize bank release.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedBatch.status === 'PENDING_FINANCE_VERIFICATION' && (
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Verify ESI & PF Records
                  </button>
                )}

                {(selectedBatch.status === 'VERIFIED' || selectedBatch.status === 'PENDING_FINANCE_VERIFICATION') && (
                  <button
                    onClick={() => setShowReleaseModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="h-4 w-4" />
                    Verify & Release Payout
                  </button>
                )}
              </div>
            </div>

            {/* Verification Checklist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">1. Attendance Check</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Turnstile fingerprint punches reconciled for all 144 shift operators.
                </p>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  100% Shift Attendance Matched
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">2. Statutory PF & ESI</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  EPFO 12% calculation and wage-ceiling ESIC 0.75% contributions verified.
                </p>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  ₹ {(selectedBatch.totalPf + selectedBatch.totalEsi).toLocaleString()} Statutory Fund
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">3. Bank Disbursement</span>
                  <CreditCard className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedBatch.bankDisbursementRef
                    ? `Disbursed under ${selectedBatch.bankDisbursementRef}`
                    : 'Ready for HDFC / SBI Corporate RTGS upload.'}
                </p>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold font-mono">
                  ₹ {(selectedBatch.totalNetPayout / 100000).toFixed(2)} Lakhs Total Net
                </div>
              </div>
            </div>

            {/* Batch Status and Details */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Batch Code:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedBatch.batchNumber}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">HR Submitter:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedBatch.submittedBy}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Finance Approver:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedBatch.financeApproverName || 'Pending Finance Sign-Off'}</span>
              </div>
              {selectedBatch.bankDisbursementRef && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Bank RTGS Reference:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedBatch.bankDisbursementRef}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Payout History & Bank References */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Settled & Past Payroll Batches
            </h2>

            <div className="space-y-3">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedBatch.id === batch.id
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {batch.batchNumber}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {batch.periodLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Headcount: <strong className="text-slate-800 dark:text-slate-200">{batch.totalHeadcount}</strong> &bull; Submitted by: {batch.submittedBy}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        ₹ {(batch.totalNetPayout / 100000).toFixed(2)} Lakhs
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {batch.bankDisbursementRef || 'Pending Settlement'}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                        batch.status === 'RELEASED'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : batch.status === 'VERIFIED'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {batch.status === 'RELEASED'
                        ? 'Released'
                        : batch.status === 'VERIFIED'
                        ? 'Verified'
                        : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT PAYROLL TO FINANCE */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Submit October 2026 Payout to Finance
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleHrSubmitToFinance} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Factory Headcount:</span>
                  <span className="font-bold text-slate-900 dark:text-white">144 Operators</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Wage Total:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹ 39,20,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total PF (12%) Deduction:</span>
                  <span className="font-bold text-emerald-600">₹ 4,70,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total ESI (0.75%) Deduction:</span>
                  <span className="font-bold text-amber-600">₹ 29,400</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">Net Payout to Bank:</span>
                  <span className="font-bold text-emerald-600">₹ 33,91,400</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  HR / IT Attendance Remarks for Finance
                </label>
                <textarea
                  rows={3}
                  value={hrNotes}
                  onChange={(e) => setHrNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  Confirm & Send to Finance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FINANCE VERIFY */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Finance Verification & Sign-Off
              </h3>
              <button onClick={() => setShowVerifyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                You are verifying batch <strong>{selectedBatch.batchNumber}</strong> for 144 factory staff.
              </p>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Finance Audit Notes & Approval Remarks
                </label>
                <textarea
                  rows={3}
                  value={financeNotes}
                  onChange={(e) => setFinanceNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinanceVerify}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Sign & Mark Verified
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FINANCE RELEASE & SETTLE */}
      {showReleaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Release & Disburse Monthly Salaries
              </h3>
              <button onClick={() => setShowReleaseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                  Disbursing ₹ {(selectedBatch.totalNetPayout / 100000).toFixed(2)} Lakhs
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Bank Corporate Portal: <strong>HDFC Corporate Banking RTGS/NEFT</strong>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Clicking confirm will officially finalize the payroll batch, record the corporate bank settlement reference, and notify all 144 technicians.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReleaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinanceRelease}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="h-4 w-4" />
                  Confirm & Release Payout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

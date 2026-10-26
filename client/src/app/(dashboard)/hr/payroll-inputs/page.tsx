'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Send,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ArrowLeft,
  Clock,
  DollarSign,
  Building,
  Check,
  ShieldCheck,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { MonthlyPayrollSummaryItem } from '@/types/hr';

const MOCK_SUMMARY_ITEMS: MonthlyPayrollSummaryItem[] = [
  {
    employeeId: 'emp-1',
    employeeCode: 'EMP-2026-001',
    fullName: 'Sunil Rao',
    department: 'Production & Shop Floor',
    designation: 'Plant Operations Manager',
    baseSalary: 125000,
    daysPresent: 26,
    daysHalfDay: 0,
    daysAbsent: 0,
    totalLeavesApproved: 0,
    approvedOvertimeHours: 0,
    overtimePayoutAmount: 0,
    grossEstimated: 125000,
  },
  {
    employeeId: 'emp-2',
    employeeCode: 'EMP-2026-002',
    fullName: 'Rajesh Mehra',
    department: 'Warehouse & Logistics',
    designation: 'Warehouse Logistics Supervisor',
    baseSalary: 72000,
    daysPresent: 25,
    daysHalfDay: 0,
    daysAbsent: 1,
    totalLeavesApproved: 1,
    approvedOvertimeHours: 12.0,
    overtimePayoutAmount: 4800,
    grossEstimated: 76800,
  },
  {
    employeeId: 'emp-3',
    employeeCode: 'EMP-2026-015',
    fullName: 'Amit Kalyan',
    department: 'Production & Shop Floor',
    designation: 'CNC Machine Lead Operator',
    baseSalary: 48000,
    daysPresent: 24,
    daysHalfDay: 1,
    daysAbsent: 0,
    totalLeavesApproved: 2,
    approvedOvertimeHours: 18.5,
    overtimePayoutAmount: 5550,
    grossEstimated: 53550,
  },
  {
    employeeId: 'emp-4',
    employeeCode: 'EMP-2026-042',
    fullName: 'Pooja Sharma',
    department: 'Quality Assurance (QA/QC)',
    designation: 'Quality Control Inspector',
    baseSalary: 52000,
    daysPresent: 26,
    daysHalfDay: 0,
    daysAbsent: 0,
    totalLeavesApproved: 0,
    approvedOvertimeHours: 6.0,
    overtimePayoutAmount: 1920,
    grossEstimated: 53920,
  },
];

export default function PayrollInputsPage() {
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [summaryList, setSummaryList] = useState<MonthlyPayrollSummaryItem[]>(MOCK_SUMMARY_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDispatched, setIsDispatched] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  const totalEmployees = summaryList.length;
  const totalGross = summaryList.reduce((acc, i) => acc + i.grossEstimated, 0);
  const totalOvertimePayout = summaryList.reduce((acc, i) => acc + i.overtimePayoutAmount, 0);
  const totalOvertimeHours = summaryList.reduce((acc, i) => acc + i.approvedOvertimeHours, 0);

  const handleForwardToFinance = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setIsDispatched(true);
    }, 800);
  };

  const filtered = summaryList.filter(
    (item) =>
      item.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/hr" className="hover:text-indigo-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Workforce Hub
            </Link>
            <span>/</span>
            <span className="text-slate-200">Payroll Inputs</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-400" />
            Monthly Attendance & Overtime Payroll Gateway
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reconcile monthly employee working days, leave deductions, and approved overtime payouts before dispatching to Finance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Exporting payroll attendance audit sheet (.CSV)...')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-700 text-xs font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            Export Audit CSV
          </button>

          <button
            onClick={handleForwardToFinance}
            disabled={isDispatched || isDispatching}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-lg transition-all ${
              isDispatched
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            {isDispatched ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Locked & Dispatched to Finance
              </>
            ) : isDispatching ? (
              'Dispatching...'
            ) : (
              <>
                <Send className="h-4 w-4" />
                Forward Packet to Finance Module
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dispatched Notification Banner */}
      {isDispatched && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-emerald-300 block">
                Payroll Cycle Data Transferred to Finance Module
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">
                Attendance days and approved overtime amounts for {selectedMonth}/{selectedYear} are now staged in General Ledger AP for executive approval.
              </p>
            </div>
          </div>
          <Link
            href="/finance/payables"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline flex items-center gap-1"
          >
            View in Finance Module &rarr;
          </Link>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a]/80 border border-emerald-500/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Gross Payout Est.</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">₹{totalGross.toLocaleString()}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            For {totalEmployees} active personnel
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overtime Payout (OT)</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-mono">₹{totalOvertimePayout.toLocaleString()}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {totalOvertimeHours} approved overtime hours
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statutory Deductions (12%)</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Calculator className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-300 font-mono">
              ₹{(totalGross * 0.12).toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            PF, ESI, and TDS estimated
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Cycle</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Building className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">Oct 2026</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">
            Cutoff date: 26th of month
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1322] border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1 sm:w-80">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search employee code, name, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Cycle: October 2026 (Month 10)</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Payroll Input Breakdown Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-3 font-semibold">Employee</th>
                <th className="py-3 px-3 font-semibold">Department & Role</th>
                <th className="py-3 px-3 font-semibold">Base Monthly (₹)</th>
                <th className="py-3 px-3 font-semibold">Days Present</th>
                <th className="py-3 px-3 font-semibold">Leaves / Half</th>
                <th className="py-3 px-3 font-semibold">Approved OT Hours</th>
                <th className="py-3 px-3 font-semibold">OT Payout (₹)</th>
                <th className="py-3 px-3 font-semibold text-right">Gross Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.employeeId} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{item.fullName}</div>
                    <span className="font-mono text-[10px] text-indigo-300">{item.employeeCode}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200">{item.designation}</div>
                    <div className="text-[10px] text-slate-500">{item.department}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300 font-medium">
                    ₹{item.baseSalary.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {item.daysPresent} days
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-400">
                    {item.totalLeavesApproved} leave, {item.daysHalfDay} half
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-400 font-medium">
                    {item.approvedOvertimeHours > 0 ? `${item.approvedOvertimeHours} hrs` : '--'}
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-300">
                    {item.overtimePayoutAmount > 0 ? `₹${item.overtimePayoutAmount.toLocaleString()}` : '--'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white text-sm">
                    ₹{item.grossEstimated.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  FileCheck2,
  Building2,
  CheckCircle,
  Clock,
  Download,
  Percent,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PayrollBatch {
  id: string;
  month: string;
  year: number;
  grossAmount: number;
  netDisbursement: number;
  taxesWithheld: number;
  benefits: number;
  employeeCount: number;
  status: 'PENDING_SIGNOFF' | 'APPROVED' | 'DISBURSED';
  approvedBy?: string;
  approvedAt?: string;
}

export default function FinancialsPage() {
  const [financials] = useState({
    revenue: 4850000,
    cogs: 2620000,
    opex: 890000,
    netProfit: 1340000,
    freeCashFlow: 1120000,
    cashInflow: 5100000,
    cashOutflow: 3980000,
    taxProvision: 380000,
    taxLiability: 335000,
  });

  const [monthlyHistory] = useState([
    { period: 'Sep 2026', revenue: 4720000, cogs: 2540000, opex: 880000, net: 1300000, fcf: 1080000 },
    { period: 'Aug 2026', revenue: 4590000, cogs: 2490000, opex: 865000, net: 1235000, fcf: 990000 },
    { period: 'Jul 2026', revenue: 4410000, cogs: 2400000, opex: 850000, net: 1160000, fcf: 940000 },
    { period: 'Jun 2026', revenue: 4300000, cogs: 2360000, opex: 840000, net: 1100000, fcf: 910000 },
  ]);

  const [payrolls, setPayrolls] = useState<PayrollBatch[]>([
    {
      id: 'pr-101',
      month: 'October',
      year: 2026,
      grossAmount: 780000,
      netDisbursement: 595000,
      taxesWithheld: 135000,
      benefits: 50000,
      employeeCount: 420,
      status: 'PENDING_SIGNOFF',
    },
    {
      id: 'pr-100',
      month: 'September',
      year: 2026,
      grossAmount: 765000,
      netDisbursement: 584000,
      taxesWithheld: 132000,
      benefits: 49000,
      employeeCount: 418,
      status: 'APPROVED',
      approvedBy: 'Super Admin Root',
      approvedAt: '2026-09-30 17:30:00',
    },
    {
      id: 'pr-099',
      month: 'August',
      year: 2026,
      grossAmount: 752000,
      netDisbursement: 574000,
      taxesWithheld: 130000,
      benefits: 48000,
      employeeCount: 412,
      status: 'DISBURSED',
      approvedBy: 'Super Admin Root',
      approvedAt: '2026-08-31 16:15:00',
    },
  ]);

  const [approvalModalBatch, setApprovalModalBatch] = useState<PayrollBatch | null>(null);
  const [approvalNote, setApprovalNote] = useState('');

  const handleAuthorizePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalModalBatch) return;

    setPayrolls((prev) =>
      prev.map((item) =>
        item.id === approvalModalBatch.id
          ? {
              ...item,
              status: 'APPROVED',
              approvedBy: 'Super Admin Root',
              approvedAt: new Date().toISOString(),
            }
          : item,
      ),
    );

    setApprovalModalBatch(null);
    setApprovalNote('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-400" />
            Executive Financials & Executive Sign-Offs
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time manufacturing P&L statements, cash reserves, corporate tax liabilities, and payroll disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Export P&L Ledger (CSV)
          </button>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Gross Revenue (MTD)
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {formatCurrency(financials.revenue)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            COGS: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(financials.cogs)}</strong>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Net Profit & Margin
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            {formatCurrency(financials.netProfit)}
          </div>
          <div className="text-xs text-emerald-400/80 mt-1 flex items-center gap-1 font-medium">
            <Percent className="h-3 w-3" />
            <span>27.6% Operational Margin</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Free Cash Flow (FCF)
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">
            {formatCurrency(financials.freeCashFlow)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Operating Expenses: {formatCurrency(financials.opex)}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Corporate Tax Provision
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">
            {formatCurrency(financials.taxLiability)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Estimated Provision: {formatCurrency(financials.taxProvision)}
          </div>
        </div>
      </div>

      {/* Executive Payroll Sign-Off Section */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-amber-400" />
              Workforce Payroll Authorization Batches
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Super Admin authorization is required prior to automated treasury disbursement.
            </p>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md font-medium">
            Dual-Key Security Enabled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Headcount</th>
                <th className="py-3 px-4">Gross Total</th>
                <th className="py-3 px-4">Net Disbursement</th>
                <th className="py-3 px-4">Tax Deductions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {payrolls.map((batch) => {
                const isPending = batch.status === 'PENDING_SIGNOFF';
                return (
                  <tr key={batch.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {batch.month} {batch.year}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {batch.employeeCount} Workers
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-white">
                      {formatCurrency(batch.grossAmount)}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                      {formatCurrency(batch.netDisbursement)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {formatCurrency(batch.taxesWithheld)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isPending ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        {batch.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => setApprovalModalBatch(batch)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors"
                        >
                          Sign-Off & Approve
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Signed by {batch.approvedBy}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Monthly Financial Performance */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          Multi-Month P&L History & Free Cash Flow
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Gross Revenue</th>
                <th className="py-3 px-4">COGS (Manufacturing)</th>
                <th className="py-3 px-4">Operating Expenses</th>
                <th className="py-3 px-4">Net Profit</th>
                <th className="py-3 px-4">Free Cash Flow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {monthlyHistory.map((m) => (
                <tr key={m.period} className="hover:bg-slate-800/20">
                  <td className="py-3 px-4 font-semibold text-white">{m.period}</td>
                  <td className="py-3 px-4 font-mono text-white">{formatCurrency(m.revenue)}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{formatCurrency(m.cogs)}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{formatCurrency(m.opex)}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">{formatCurrency(m.net)}</td>
                  <td className="py-3 px-4 font-mono text-blue-400">{formatCurrency(m.fcf)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Super Admin Payroll Authorization */}
      {approvalModalBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-amber-400" />
                Executive Payroll Sign-Off
              </h3>
              <button
                type="button"
                onClick={() => setApprovalModalBatch(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
              <div className="text-slate-700 dark:text-slate-300">
                Batch: <strong className="text-white">{approvalModalBatch.month} {approvalModalBatch.year}</strong>
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                Total Headcount: <strong className="text-white">{approvalModalBatch.employeeCount} Employees</strong>
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                Gross Sum: <strong className="text-slate-900 dark:text-white font-mono">{formatCurrency(approvalModalBatch.grossAmount)}</strong>
              </div>
              <div className="text-emerald-400 font-semibold">
                Net Disbursement: <span className="font-mono">{formatCurrency(approvalModalBatch.netDisbursement)}</span>
              </div>
            </div>

            <form onSubmit={handleAuthorizePayroll} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Executive Approval Notes & Justification
                </label>
                <textarea
                  required
                  placeholder="e.g. Audit verified against shift punch clocks and supervisor sign-offs"
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setApprovalModalBatch(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Sign & Authorize Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

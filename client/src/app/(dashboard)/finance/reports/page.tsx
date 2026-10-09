'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  FileCheck,
  Percent,
  TrendingUp,
  ShieldCheck,
  Send,
  Building2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { TaxReportItem } from '@/types/finance';

const initialTaxReports: TaxReportItem[] = [
  {
    id: 'tr-1',
    taxPeriod: '2026-Q3',
    reportType: 'GST_RETURN',
    taxableSales: 4850000,
    outputTax: 873000,
    taxablePurchases: 2620000,
    inputTaxCredit: 471600,
    netTaxPayable: 401400,
    status: 'FILED',
    filedAt: '2026-10-02 11:20:00',
    notes: 'Filed with Federal Tax Authority | Ref: GST-2026-TX-9011',
  },
  {
    id: 'tr-2',
    taxPeriod: '2026-09',
    reportType: 'WITHHOLDING_TAX',
    taxableSales: 780000,
    outputTax: 135000,
    taxablePurchases: 0,
    inputTaxCredit: 0,
    netTaxPayable: 135000,
    status: 'FILED',
    filedAt: '2026-10-05 14:10:00',
    notes: 'Monthly workforce payroll tax remittance',
  },
  {
    id: 'tr-3',
    taxPeriod: '2026-Q4',
    reportType: 'GST_RETURN',
    taxableSales: 1650000,
    outputTax: 297000,
    taxablePurchases: 890000,
    inputTaxCredit: 160200,
    netTaxPayable: 136800,
    status: 'DRAFT',
    notes: 'Q4 interim calculation in progress',
  },
];

export default function FinancialReportsPage() {
  const [activeReportTab, setActiveReportTab] = useState<'PL' | 'BS' | 'TAX'>('PL');
  const [taxReports, setTaxReports] = useState<TaxReportItem[]>(initialTaxReports);

  // Income Statement (P&L) Data
  const pl = {
    grossRevenue: 4850000,
    cogs: [
      { name: 'Raw Material Alloys & Ingots', amount: 1640000 },
      { name: 'CNC Machine Tooling & Consumables', amount: 530000 },
      { name: 'Plant Direct Electrical Utility', amount: 450000 },
    ],
    totalCogs: 2620000,
    grossProfit: 2230000,
    grossMargin: 46.0,
    opex: [
      { name: 'Plant Shift Salaries & Wages', amount: 580000 },
      { name: 'Engineering & Quality Assurance', amount: 140000 },
      { name: 'Depreciation & Factory Maintenance', amount: 95000 },
      { name: 'Logistics & Freight Services', amount: 75000 },
    ],
    totalOpex: 890000,
    operatingIncome: 1340000,
    taxProvision: 335000,
    netIncome: 1005000,
    netMargin: 20.7,
  };

  // Balance Sheet Data
  const bs = {
    assets: {
      current: [
        { name: 'Operating Cash & JPMorgan Treasury', amount: 3250000 },
        { name: 'Accounts Receivable (Trade)', amount: 1480000 },
        { name: 'Raw Inventory Stock & WIP', amount: 2150000 },
      ],
      nonCurrent: [
        { name: 'Robotic Welding & Assembly Equipment', amount: 6200000 },
        { name: 'Facility Infrastructure & Land Leasehold', amount: 3800000 },
        { name: 'Accumulated Depreciation', amount: -1250000 },
      ],
      totalAssets: 15630000,
    },
    liabilities: {
      current: [
        { name: 'Accounts Payable - Trade Vendors', amount: 980000 },
        { name: 'GST & Corporate Tax Withholdings', amount: 270000 },
        { name: 'Accrued Wages & Payroll Payable', amount: 190000 },
      ],
      nonCurrent: [
        { name: 'Industrial Equipment Term Loan (5.2%)', amount: 4200000 },
      ],
      totalLiabilities: 5640000,
    },
    equity: {
      items: [
        { name: 'Contributed Share Capital', amount: 5700000 },
        { name: 'Retained Earnings & Current Period Net', amount: 4290000 },
      ],
      totalEquity: 9990000,
    },
  };

  const handleFileReport = (id: string) => {
    setTaxReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'FILED',
              filedAt: new Date().toISOString(),
              notes: `${r.notes || ''} | Regulatory filing executed by Finance Manager`,
            }
          : r,
      ),
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
            Financial Statements & Regulatory Tax Filing
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Automated GAAP P&L statement, balance sheet verification, and GST / Corporate tax return filings.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <Download className="h-4 w-4" /> Export Complete Audit Packet (PDF/XLSX)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveReportTab('PL')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeReportTab === 'PL'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Profit & Loss Statement (P&L)
        </button>
        <button
          type="button"
          onClick={() => setActiveReportTab('BS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeReportTab === 'BS'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Balance Sheet
        </button>
        <button
          type="button"
          onClick={() => setActiveReportTab('TAX')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeReportTab === 'TAX'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          GST & Tax Filing Returns ({taxReports.length})
        </button>
      </div>

      {/* Tab: P&L Statement */}
      {activeReportTab === 'PL' && (
        <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Income Statement (P&L) - Period MTD
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Report formatted in accordance with GAAP standards
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Net Operating Margin</span>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {pl.netMargin}%
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {/* Revenue */}
            <div className="py-3 flex justify-between items-center text-sm font-semibold text-white">
              <span>Gross Manufacturing Revenue</span>
              <span className="font-mono">{formatCurrency(pl.grossRevenue)}</span>
            </div>

            {/* COGS */}
            <div className="py-3 space-y-1.5">
              <div className="font-semibold text-slate-300">Cost of Goods Sold (COGS):</div>
              {pl.cogs.map((item, i) => (
                <div key={i} className="flex justify-between pl-4 text-slate-400">
                  <span>{item.name}</span>
                  <span className="font-mono">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-slate-200 pt-1 border-t border-slate-800/80">
                <span>Total COGS</span>
                <span className="font-mono text-red-400">({formatCurrency(pl.totalCogs)})</span>
              </div>
            </div>

            {/* Gross Profit */}
            <div className="py-3 flex justify-between items-center font-bold text-slate-100 bg-slate-900/40 px-3 rounded">
              <span>Gross Profit (Margin: {pl.grossMargin}%)</span>
              <span className="font-mono text-emerald-400">{formatCurrency(pl.grossProfit)}</span>
            </div>

            {/* OPEX */}
            <div className="py-3 space-y-1.5">
              <div className="font-semibold text-slate-300">Operating Expenses (OPEX):</div>
              {pl.opex.map((item, i) => (
                <div key={i} className="flex justify-between pl-4 text-slate-400">
                  <span>{item.name}</span>
                  <span className="font-mono">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-slate-200 pt-1 border-t border-slate-800/80">
                <span>Total OPEX</span>
                <span className="font-mono text-red-400">({formatCurrency(pl.totalOpex)})</span>
              </div>
            </div>

            {/* Operating Income */}
            <div className="py-3 flex justify-between items-center font-bold text-white">
              <span>Operating Income (EBIT)</span>
              <span className="font-mono text-emerald-400">{formatCurrency(pl.operatingIncome)}</span>
            </div>

            {/* Tax */}
            <div className="py-3 flex justify-between items-center text-slate-400">
              <span>Income Tax Provision (Estimated 25%)</span>
              <span className="font-mono text-amber-400">({formatCurrency(pl.taxProvision)})</span>
            </div>

            {/* Net Income */}
            <div className="py-4 flex justify-between items-center text-base font-bold text-white bg-emerald-950/20 px-3 rounded border border-emerald-500/20">
              <span>Net Profit (Bottom Line)</span>
              <span className="font-mono text-emerald-400">{formatCurrency(pl.netIncome)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Balance Sheet */}
      {activeReportTab === 'BS' && (
        <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Balance Sheet Statement
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Assets = Liabilities + Shareholder Equity
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
              <CheckCircle2 className="h-4 w-4" /> Exactly Balanced (Variance: $0.00)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* Left: Assets */}
            <div className="space-y-4">
              <div className="font-bold text-sm text-blue-400 border-b border-slate-800 pb-2">
                ASSETS
              </div>

              <div>
                <div className="font-semibold text-slate-300 mb-1.5">Current Assets:</div>
                <div className="space-y-1 pl-3 text-slate-400">
                  {bs.assets.current.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-mono text-slate-200">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-300 mb-1.5">Non-Current & Fixed Assets:</div>
                <div className="space-y-1 pl-3 text-slate-400">
                  {bs.assets.nonCurrent.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-mono text-slate-200">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between font-bold text-white text-sm bg-slate-900/60 p-2.5 rounded">
                <span>TOTAL ASSETS</span>
                <span className="font-mono text-blue-400">{formatCurrency(bs.assets.totalAssets)}</span>
              </div>
            </div>

            {/* Right: Liabilities & Equity */}
            <div className="space-y-4">
              <div className="font-bold text-sm text-amber-400 border-b border-slate-800 pb-2">
                LIABILITIES & EQUITY
              </div>

              <div>
                <div className="font-semibold text-slate-300 mb-1.5">Current Liabilities:</div>
                <div className="space-y-1 pl-3 text-slate-400">
                  {bs.liabilities.current.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-mono text-slate-200">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-300 mb-1.5">Long-Term Liabilities:</div>
                <div className="space-y-1 pl-3 text-slate-400">
                  {bs.liabilities.nonCurrent.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-mono text-slate-200">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold text-purple-300 mb-1.5">Shareholders Equity:</div>
                <div className="space-y-1 pl-3 text-slate-400">
                  {bs.equity.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-mono text-slate-200">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between font-bold text-white text-sm bg-slate-900/60 p-2.5 rounded">
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span className="font-mono text-amber-400">
                  {formatCurrency(bs.liabilities.totalLiabilities + bs.equity.totalEquity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: GST & Tax Reports */}
      {activeReportTab === 'TAX' && (
        <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-400" />
                GST & Corporate Tax Returns (Input Tax Credit Reconciliation)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically offsets Output Tax on sales with verified Input Tax Credit (ITC) on vendor purchases.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tax Period</th>
                  <th className="py-3 px-4">Report Type</th>
                  <th className="py-3 px-4">Taxable Sales</th>
                  <th className="py-3 px-4">Output Tax</th>
                  <th className="py-3 px-4">Input Tax Credit (ITC)</th>
                  <th className="py-3 px-4">Net Remittance Due</th>
                  <th className="py-3 px-4">Filing Status</th>
                  <th className="py-3 px-4 text-right">Regulatory Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {taxReports.map((report) => {
                  const isFiled = report.status === 'FILED';

                  return (
                    <tr key={report.id} className="hover:bg-slate-800/20">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {report.taxPeriod}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {report.reportType.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {formatCurrency(report.taxableSales)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-200">
                        {formatCurrency(report.outputTax)}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400">
                        {formatCurrency(report.inputTaxCredit)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {formatCurrency(report.netTaxPayable)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            isFiled
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isFiled ? (
                          <span className="text-[11px] text-slate-400 font-mono">
                            Filed: {report.filedAt?.split('T')[0] || 'Confirmed'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleFileReport(report.id)}
                            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                          >
                            File & Remit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

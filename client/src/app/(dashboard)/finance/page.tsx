'use client';

import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { useActiveFranchise } from '@/lib/franchiseStore';
import { exportToCsv } from '@/lib/exportUtils';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
  Building,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { RoleActionAlerts } from '@/components/RoleActionAlerts';
import { useAuth } from '@/context/AuthContext';
import { SupervisoryBanner } from '@/components/SupervisoryBanner';
import { DepartmentAuditFeed } from '@/components/DepartmentAuditFeed';
import { BarChart, DonutChart } from '@/components/charts';

export default function CashFlowOverviewPage() {
  const { session } = useAuth();
  const isSuperAdmin = session?.roleId === 'super_admin';
  const activeFranchise = useActiveFranchise();

  const curr = activeFranchise.currencySymbol || "$";
  const isINR = activeFranchise.currency === 'INR';

  const fmtCrOrM = (v: number) => isINR ? `${curr} ${(v / 10000000).toFixed(2)} Cr` : `${curr} ${(v / 1000000).toFixed(2)}M`;
  const fmtLakhOrK = (v: number) => isINR ? `${curr} ${(v / 100000).toFixed(2)} Lakhs` : `${curr} ${(v / 1000).toFixed(0)}k`;
  const fmtShortLOrK = (v: number) => isINR ? `${curr} ${(v / 100000).toFixed(2)}L` : `${curr} ${(v / 1000).toFixed(0)}k`;

  const [metrics] = useState({
    cashAndEquivalents: 32500000, // ₹3.25 Cr
    accountsReceivable: 14800000,
    inventoryAsset: 21500000,
    accountsPayable: 9800000,
    currentAssets: 68800000,
    currentLiabilities: 12500000,
    workingCapital: 56300000,
    currentRatio: 5.5,
    quickRatio: 3.78,
    monthlyBurnRate: 8900000,
    runwayMonths: 7.7,
  });

  const [dailyMovement] = useState([
    { time: '09:15 AM', type: 'INFLOW', party: 'Reliance Enterprise Retail Stores', category: 'Bulk Commercial Order (5,000 units)', amount: 25000000, method: 'Direct Bank Transfer' },
    { time: '11:30 AM', type: 'OUTFLOW', party: 'Apex Core Semiconductor Partner', category: 'Computing Modules PO-9042', amount: 14500000, method: 'NEFT Transfer' },
    { time: '01:45 PM', type: 'INFLOW', party: 'Croma Megastores Distribution', category: 'Apex Enterprise Series Batch Payment', amount: 8200000, method: 'RTGS Transfer' },
    { time: '03:10 PM', type: 'OUTFLOW', party: 'State Electricity Board', category: 'Factory Power & Cleanroom Air Conditioning', amount: 3420000, method: 'Direct Debit' },
  ]);

  const [forecasts] = useState([
    { week: 'Week 1 (Oct 08 - Oct 14)', expectedInflows: 64000000, expectedOutflows: 38000000, netProjected: 26000000 },
    { week: 'Week 2 (Oct 15 - Oct 21)', expectedInflows: 89000000, expectedOutflows: 95000000, netProjected: -6000000 },
    { week: 'Week 3 (Oct 22 - Oct 28)', expectedInflows: 51000000, expectedOutflows: 24000000, netProjected: 27000000 },
    { week: 'Week 4 (Oct 29 - Nov 04)', expectedInflows: 125000000, expectedOutflows: 82000000, netProjected: 43000000 },
  ]);

  // Statutory Deductions & Monthly Payout Breakdown
  const payoutDistribution = [
    {
      name: 'Net Salary Payout (Bank RTGS)',
      value: 3391400,
      color: '#10b981',
      description: 'Direct employee take-home transfers',
    },
    {
      name: 'Provident Fund (PF 12%) Pool',
      value: 470400,
      color: '#6366f1',
      description: 'Statutory EPFO deposit pool',
    },
    {
      name: 'Employees State Insurance (ESI)',
      value: 29400,
      color: '#3b82f6',
      description: 'Medical health insurance coverage',
    },
    {
      name: 'Professional Tax & TDS',
      value: 28800,
      color: '#f59e0b',
      description: 'Statutory municipal & income tax',
    },
  ];

  // Weekly Cash Flow Forecast Data for Grouped Bar Chart
  const weeklyForecastChartData = forecasts.map((f, i) => ({
    label: `Week ${i + 1}`,
    inflows: f.expectedInflows,
    outflows: f.expectedOutflows,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Super Admin Supervisory Mode Banner */}
      {isSuperAdmin && (
        <SupervisoryBanner
          departmentName="Finance & Accounts"
          departmentCode="FIN-001"
          staffRoleTitle="Factory Accounts & Finance Lead"
          onViewAuditFeed={() => {
            const el = document.getElementById('dept-audit-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40 mb-1.5">
            <span>{activeFranchise.flag}</span>
            <span>{activeFranchise.plantName}</span>
            <span className="text-slate-400">·</span>
            <span>Treasury ({activeFranchise.currency})</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Factory Accounts & Money Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live bank balance, operating burn rates, and treasury reserves in <strong>{activeFranchise.currency}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm">
          <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Live Bank Link: <strong className="text-slate-800 dark:text-slate-200">Connected & Synced</strong></span>
        </div>
      </div>

      {/* Action Alerts & Interconnected Workflow Notifications Inbox */}
      <RoleActionAlerts roleId="finance" />

      {/* Top 4 Liquidity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Available Bank Balance</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              {fmtCrOrM(metrics.cashAndEquivalents)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Ready for payments and expenses</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Working Capital (Current Funds)</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight font-mono">
              {fmtCrOrM(metrics.workingCapital)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Total Assets: <strong className="text-slate-800 dark:text-slate-200">{fmtCrOrM(metrics.currentAssets)}</strong>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Financial Health Ratios</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              {metrics.quickRatio}x <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Quick Ratio</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Current Ratio: <strong className="text-emerald-600 dark:text-emerald-400">{metrics.currentRatio}x</strong> (Healthy financial reserve)
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Cash Reserve Buffer</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
              {metrics.runwayMonths} Months
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Running Cost: <strong className="text-slate-800 dark:text-slate-200">{fmtLakhOrK(metrics.monthlyBurnRate)}/mo</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts: Cash Flow Forecast & Monthly Payout Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BarChart
            data={weeklyForecastChartData}
            series={[
              { key: 'inflows', name: 'Expected Customer Inflows', color: '#10b981' },
              { key: 'outflows', name: 'Scheduled Supplier Outflows', color: '#f43f5e' },
            ]}
            xAxisKey="label"
            mode="grouped"
            title="4-Week Rolling Cash Flow Forecast"
            subtitle="Projected incoming customer settlements vs scheduled supplier payments"
            yAxisFormatter={(v) => fmtCrOrM(v)}
            tooltipFormatter={(v) => fmtLakhOrK(v)}
            height={270}
          />
        </div>

        <div className="lg:col-span-5">
          <DonutChart
            data={payoutDistribution}
            title="Monthly Payout & Statutory Deductions"
            subtitle={"Payroll gross batch distribution (144 Technicians)"}
            centerLabel="Net Take-Home"
            centerValue="86.5%"
            centerSubtext={curr + " Net Payout"}
            valueFormatter={(v) => fmtShortLOrK(v)}
            height={270}
          />
        </div>
      </div>

      {/* Main Grid: Live Movement vs Cash Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Cash Movement */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Money In & Money Out (Today)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live incoming customer payments and outgoing supplier bills
              </p>
            </div>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg font-semibold">
              {'Net: +' + fmtCrOrM(15200000)}
            </span>
          </div>

          <div className="space-y-3">
            {dailyMovement.map((item, idx) => {
              const isInflow = item.type === 'INFLOW';

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        isInflow
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {isInflow ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {item.party}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{item.category}</span>
                        <span>&bull;</span>
                        <span className="text-slate-700 dark:text-slate-300">{item.method}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs sm:text-sm font-mono font-bold ${
                        isInflow ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isInflow ? '+' : '-'} {fmtLakhOrK(item.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4-Week Rolling Cash Flow Forecast */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Next 4 Weeks Cash Forecast
              </h3>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono">
                Q4 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Expected incoming customer payments vs scheduled supplier bills.
            </p>

            <div className="space-y-3">
              {forecasts.map((f, i) => {
                const isPositive = f.netProjected >= 0;

                return (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{f.week}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Inflows: {fmtCrOrM(f.expectedInflows)}</span>
                      <span>Outflows: {fmtCrOrM(f.expectedOutflows)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Net Balance:</span>
                      <span className={`text-xs font-mono font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isPositive ? '+' : ''}{fmtCrOrM(f.netProjected)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Estimated 30-Day Cash Surplus: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{'+' + fmtCrOrM(90000000)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Super Admin Read-Only Supervisory Audit Stream */}
      {isSuperAdmin && (
        <div id="dept-audit-feed" className="pt-2">
          <DepartmentAuditFeed
            department="finance"
            title="Finance & Accounts Activity Stream & Money Audit Trail"
          />
        </div>
      )}
    </div>
  );
}

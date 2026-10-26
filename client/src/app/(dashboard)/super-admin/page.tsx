'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  FileCheck2,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Cpu,
  Radio,
  Box,
  CheckCircle2,
  Barcode,
  Database,
  Flame,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { RoleActionAlerts } from '@/components/RoleActionAlerts';
import { useActiveFranchise } from '@/lib/franchiseStore';
import { LineChart, DonutChart } from '@/components/charts';

export default function ExecutiveOverviewPage() {
  const [financialMetrics] = useState({
    revenue: 485000000, // ₹48.5 Crores
    cogs: 262000000,
    operatingExpense: 89000000,
    netProfit: 134000000, // ₹13.4 Crores
    netMargin: 27.6,
    freeCashFlow: 112000000,
    currency: 'INR',
  });

  // Production Output Hourly Progression for Line Chart
  const hourlyOutputTrend = [
    { label: '06:00', actual: 420, target: 500 },
    { label: '08:00', actual: 1280, target: 1300 },
    { label: '10:00', actual: 2850, target: 2800 },
    { label: '12:00', actual: 4620, target: 4500 },
    { label: '14:00', actual: 5940, target: 6000 },
    { label: '16:00', actual: 7080, target: 7600 },
  ];

  // Financial Breakdown for Donut Chart
  const revenueBreakdown = [
    {
      name: 'Component Parts (COGS)',
      value: 262000000,
      color: '#6366f1',
      description: 'Precision microprocessors, optical sensors & telemetry modules',
    },
    {
      name: 'Net Factory Profit',
      value: 134000000,
      color: '#10b981',
      description: '27.6% executive margin before taxation',
    },
    {
      name: 'Factory Running Costs',
      value: 89000000,
      color: '#f59e0b',
      description: 'Power, cleanroom air-filtration & payroll',
    },
  ];

  const [plantOperations] = useState({
    totalLines: 6,
    operationalLines: 6,
    overallFpyPercentage: 99.4,
    totalAssembledUnits: 7080,
    shiftTargetUnits: 7600,
    imeiDatabaseSync: '100% Synced',
    chipsetCoverDays: 4.2,
  });

  const activeFranchise = useActiveFranchise();

  const [pendingActions, setPendingActions] = useState([
    {
      id: 'po-1',
      type: 'SILICON_PO',
      title: 'PO-2026-9042: 50,000x High-Performance Computing & Controller Modules',
      supplier: 'Tier-1 Micro-Systems Direct',
      amount: 410000000, // ₹41 Crores
      urgent: true,
    },
    {
      id: 'pr-1',
      type: 'PAYROLL',
      title: 'October 2026 Shift Labor & Operations Salary Batch',
      supplier: 'Plant #01 Workforce (420 Technicians & Operators)',
      amount: 7800000, // ₹78 Lakhs
      urgent: true,
    },
    {
      id: 'po-2',
      type: 'DISPLAY_PO',
      title: 'PO-2026-9045: 25,000x High-Precision Electronic Display & Sensor Modules',
      supplier: 'Precision Display & Sensor Technologies',
      amount: 120000000, // ₹12 Crores
      urgent: false,
    },
  ]);

  // Dynamic Industrial Assembly Lines adapt to the active franchise plant
  const productionLines = activeFranchise.productionLines;

  const handleQuickApprove = (id: string) => {
    setPendingActions(pendingActions.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Factory Production & Machine Overview
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {activeFranchise.flag} {activeFranchise.plantName}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Live status across all {activeFranchise.operatingLines} {activeFranchise.primaryIndustry} assembly lines, pass rates, and serial registries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm">
            <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Shift A: 06:00 - 14:00</span>
          </div>
        </div>
      </div>

      {/* Action Alerts & Interconnected Workflow Notifications Inbox */}
      <RoleActionAlerts roleId="super_admin" />

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Units Assembled */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Shift Units Assembled</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              {plantOperations.totalAssembledUnits.toLocaleString()} / {plantOperations.shiftTargetUnits.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>93.15% shift pace target</span>
            </div>
          </div>
        </div>

        {/* Metric 2: First-Time Quality Pass Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>First-Time Quality Pass Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              {plantOperations.overallFpyPercentage}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Defective parts: <strong className="text-slate-800 dark:text-slate-200">24 per million</strong>
            </div>
          </div>
        </div>

        {/* Metric 3: Serial Numbers Database Registry */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Hardware Serial Numbers & Registry</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Barcode className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              100% Synced
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              7,210 unit serial numbers verified
            </div>
          </div>
        </div>

        {/* Metric 4: Chipset Stock Days */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Core Component Stock Remaining</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
              {plantOperations.chipsetCoverDays} Days
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tier-1 component shipment arriving by air cargo
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Output Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <LineChart
            data={hourlyOutputTrend}
            series={[
              { key: 'actual', name: 'Actual Units Assembled', color: '#3b82f6', strokeWidth: 3 },
              { key: 'target', name: 'Shift Target Pace', color: '#10b981', strokeWidth: 2, isDashed: true },
            ]}
            xAxisKey="label"
            title="Live Industrial Assembly Line Throughput Trend"
            subtitle="Hourly cumulative assembled units across 6 lines vs target shift pace"
            tooltipFormatter={(v, k) => `${v.toLocaleString()} Units`}
            yAxisFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            height={270}
          />
        </div>

        <div className="lg:col-span-5">
          <DonutChart
            data={revenueBreakdown}
            title="Factory Revenue & Profitability Breakdown"
            subtitle="₹48.5 Cr total commercial revenue breakdown"
            centerLabel="Net Margin"
            centerValue="27.6%"
            centerSubtext="₹13.4 Cr Net Profit"
            valueFormatter={(v) => formatCurrency(v)}
            height={270}
          />
        </div>
      </div>

      {/* Main Grid: 6 Industrial Production Lines & Urgent Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Industrial Assembly Stages (6 Lines) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Industrial Assembly Stages (Lines 1 to 6)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Assembly speed, visual inspection results, and current station status
              </p>
            </div>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg font-semibold">
              6 of 6 Active
            </span>
          </div>

          <div className="space-y-3.5">
            {productionLines.map((line) => {
              const percentage = Math.round((line.actual / line.target) * 100);
              const isWarning = line.health === 'OPERATIONAL_WITH_WARNINGS';

              return (
                <div
                  key={line.number}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shadow-xs">
                        #{line.number}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {line.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {line.stageDesc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                          {line.actual.toLocaleString()} / {line.target.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Pass Rate: <strong className="text-emerald-600 dark:text-emerald-400">{line.fpy}%</strong> • Defect: {line.defectPpm} PPM
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isWarning
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {isWarning ? 'Needs Attention' : 'Optimal Running'}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isWarning ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgent Approvals Needed */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-amber-500" />
                Urgent Approvals Needed
              </h3>
              <span className="text-xs bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md font-medium border border-amber-200 dark:border-amber-800">
                Action Required
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Large parts purchase orders (&gt;₹1 Crore) and worker monthly salaries needing owner approval.
            </p>

            <div className="space-y-3">
              {pendingActions.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.supplier}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      ₹ {(item.amount / 10000000).toFixed(2)} Cr
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickApprove(item.id)}
                      className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-xs"
                    >
                      Approve & Sign
                    </button>
                  </div>
                </div>
              ))}

              {pendingActions.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Sparkles className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  All urgent approvals and purchase orders are up to date!
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Activity Logged & Verified
            </span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
              View Activity Logs &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

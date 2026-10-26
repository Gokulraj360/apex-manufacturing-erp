'use client';

import React, { useState } from 'react';
import {
  Activity,
  Boxes,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { RoleActionAlerts } from '@/components/RoleActionAlerts';
import { useAuth } from '@/context/AuthContext';
import { SupervisoryBanner } from '@/components/SupervisoryBanner';
import { DepartmentAuditFeed } from '@/components/DepartmentAuditFeed';
import { BarChart } from '@/components/charts';

interface ActiveOrderProgress {
  orderNumber: string;
  sku: string;
  productName: string;
  targetUnits: number;
  completedUnits: number;
  scrapUnits: number;
  dueDate: string;
  daysRemaining: number;
  lineNumber: number;
  supervisor: string;
  status: 'IN_PROGRESS' | 'QUALITY_HOLD' | 'PLANNED' | 'COMPLETED';
  currentStage: string;
  otdRisk: 'ON_TRACK' | 'AT_RISK' | 'DELAYED';
}

const mockOrders: ActiveOrderProgress[] = [
  {
    orderNumber: 'WO-2026-049',
    sku: 'APEX-PREC-CTRL-01',
    productName: 'Apex Precision Embedded Controller (Rev 3)',
    targetUnits: 3000,
    completedUnits: 2450,
    scrapUnits: 12,
    dueDate: '2026-10-18',
    daysRemaining: 10,
    lineNumber: 1,
    supervisor: 'M. Vance',
    status: 'IN_PROGRESS',
    currentStage: 'Line 1: Precision SMT & Circuit Assembly',
    otdRisk: 'ON_TRACK',
  },
  {
    orderNumber: 'WO-2026-050',
    sku: 'APEX-EV-BATTPACK-02',
    productName: 'Apex EV High-Density Battery Pack Subassembly',
    targetUnits: 2500,
    completedUnits: 1800,
    scrapUnits: 18,
    dueDate: '2026-10-15',
    daysRemaining: 7,
    lineNumber: 2,
    supervisor: 'K. Patel',
    status: 'IN_PROGRESS',
    currentStage: 'Line 2: Subassembly & Component Bonding',
    otdRisk: 'ON_TRACK',
  },
  {
    orderNumber: 'WO-2026-051',
    sku: 'APEX-ROBOT-JOINT-03',
    productName: 'Apex 6-Axis Robotic Actuator Joint Module',
    targetUnits: 1500,
    completedUnits: 420,
    scrapUnits: 28,
    dueDate: '2026-10-12',
    daysRemaining: 4,
    lineNumber: 3,
    supervisor: 'J. Chen',
    status: 'QUALITY_HOLD',
    currentStage: 'Line 3: Sensor Calibration & Optical Tuning',
    otdRisk: 'AT_RISK',
  },
  {
    orderNumber: 'WO-2026-052',
    sku: 'APEX-MED-DIAG-04',
    productName: 'Apex Class III Bio-Sensor Micro-Assembly Kit',
    targetUnits: 2000,
    completedUnits: 1980,
    scrapUnits: 6,
    dueDate: '2026-10-10',
    daysRemaining: 2,
    lineNumber: 6,
    supervisor: 'D. Miller',
    status: 'IN_PROGRESS',
    currentStage: 'Line 6: Box Packing, Serial QR & Palletizing',
    otdRisk: 'ON_TRACK',
  },
];

export default function ProductionOverviewPage() {
  const { session } = useAuth();
  const isSuperAdmin = session?.roleId === 'super_admin';

  const [orders] = useState<ActiveOrderProgress[]>(mockOrders);

  // Grouped Bar Chart Data: Target vs Actual Output across SMT & Assembly Lines
  const lineOutputComparisonData = [
    { label: 'Line 1: SMT Assembly', target: 3000, actual: 2450 },
    { label: 'Line 2: Bonding & Subassembly', target: 2500, actual: 1800 },
    { label: 'Line 3: Sensor Tuning', target: 1500, actual: 420 },
    { label: 'Line 4: Signal Diagnostics', target: 2000, actual: 1650 },
    { label: 'Line 5: Aging & Reliability', target: 2200, actual: 2050 },
    { label: 'Line 6: Packing & Dispatch', target: 2000, actual: 1980 },
  ];

  const totalTarget = orders.reduce((acc, o) => acc + o.targetUnits, 0);
  const totalCompleted = orders.reduce((acc, o) => acc + o.completedUnits, 0);
  const overallProgress = Math.round((totalCompleted / totalTarget) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Super Admin Supervisory Mode Banner */}
      {isSuperAdmin && (
        <SupervisoryBanner
          departmentName="Precision Assembly & Production"
          departmentCode="PROD-001"
          staffRoleTitle="Precision Assembly & Production Lead"
          onViewAuditFeed={() => {
            const el = document.getElementById('dept-audit-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Factory Floor Assembly & Orders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live daily multi-plant assembly tracking, batch deadlines, and on-time completion telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm">
          <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Assembly Lines Status: <strong className="text-slate-800 dark:text-slate-200">Shift A (Morning)</strong></span>
        </div>
      </div>

      {/* Action Alerts & Interconnected Workflow Notifications Inbox */}
      <RoleActionAlerts roleId="production" />

      {/* Top 4 Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Today&apos;s Assembly Jobs</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Boxes className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {orders.length} Batches
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {orders.filter((o) => o.status === 'IN_PROGRESS').length} Active &bull; 1 Quality Check Hold
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Ongoing Factory Work Stock</span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 tracking-tight font-mono">
              {totalCompleted.toLocaleString()} / {totalTarget.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Overall Factory Output: <strong className="text-slate-800 dark:text-slate-200">{overallProgress}%</strong>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>On-Time Order Completion</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              96.4%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+2.1% above factory target</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Machine Performance & Uptime</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              88.2%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Running 92% &bull; Speed 96% &bull; Quality 99.8%
            </div>
          </div>
        </div>
      </div>

      {/* Target vs Actual Output Grouped Bar Chart */}
      <BarChart
        data={lineOutputComparisonData}
        series={[
          { key: 'target', name: 'Planned Shift Target', color: '#6366f1' },
          { key: 'actual', name: 'Completed Good Units', color: '#10b981' },
        ]}
        xAxisKey="label"
        mode="grouped"
        title="SMT & Assembly Lines: Target vs Actual Output Comparison"
        subtitle="Completed good units compared against planned work order targets across all 6 industrial assembly lines"
        yAxisFormatter={(v) => `${v.toLocaleString()}`}
        tooltipFormatter={(v) => `${v.toLocaleString()} Units`}
        height={280}
      />

      {/* Main Delivery Timelines & Execution Status Board */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 dark:text-blue-400" />
              Active Assembly Batches & Deadline Schedule
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track completion progress, customer deadlines, and assembly slowdowns.
            </p>
          </div>
          <span className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg font-medium">
            Automatic Schedule
          </span>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const progress = Math.round((order.completedUnits / order.targetUnits) * 100);
            const isQualityHold = order.status === 'QUALITY_HOLD';
            const isAtRisk = order.otdRisk === 'AT_RISK';

            return (
              <div
                key={order.orderNumber}
                className={`p-4 rounded-xl border transition-all ${
                  isQualityHold
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                    : isAtRisk
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                    : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400">&bull;</span>
                      <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                        {order.sku}
                      </span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {order.productName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span>Line #{order.lineNumber}</span>
                      <span>&bull;</span>
                      <span>Supervisor: <strong className="text-slate-700 dark:text-slate-300">{order.supervisor}</strong></span>
                      <span>&bull;</span>
                      <span>Station: <strong className="text-slate-800 dark:text-slate-200">{order.currentStage}</strong></span>
                    </div>
                  </div>

                  {/* Status Badges & Due Date */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Target Due Date:</div>
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {order.dueDate} ({order.daysRemaining} days left)
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isQualityHold
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse'
                          : isAtRisk
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {order.status === 'QUALITY_HOLD'
                        ? 'Quality Check Hold'
                        : order.status === 'IN_PROGRESS'
                        ? 'In Progress'
                        : order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress bar and metrics */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      Units Assembled: <strong className="text-slate-900 dark:text-white font-mono">{order.completedUnits.toLocaleString()}</strong> of <span className="font-mono">{order.targetUnits.toLocaleString()}</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Wasted / Defective: <strong className="text-rose-600 dark:text-rose-400 font-mono">{order.scrapUnits} units</strong> &bull; <strong className="text-blue-600 dark:text-blue-400 font-mono">{progress}% Complete</strong>
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isQualityHold
                          ? 'bg-rose-500'
                          : isAtRisk
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Super Admin Read-Only Supervisory Audit Stream */}
      {isSuperAdmin && (
        <div id="dept-audit-feed" className="pt-2">
          <DepartmentAuditFeed
            department="production"
            title="Assembly Line Yield, SMT Calibration & Shift Wage Audit Trail"
          />
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gauge,
  Cog,
  CalendarClock,
  AlertOctagon,
  Boxes,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Wrench,
  ShieldCheck,
  Plus,
  RefreshCw,
  Zap,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ReliabilityOverviewMetrics,
  BreakdownTicketItem,
  MaintenanceScheduleItem,
} from '@/types/asset-reliability';
import { PlainEnglishBanner } from '@/components/PlainEnglishBanner';

const MOCK_ACTIVE_BREAKDOWNS: BreakdownTicketItem[] = [
  {
    id: 'bdk-1',
    ticketNumber: 'BDK-2026-0104',
    assetId: 'ast-1',
    asset: {
      id: 'ast-1',
      assetTag: 'AST-CNC-001',
      assetName: '5-Axis High Precision CNC Milling Center',
      category: 'CNC_MACHINING',
      facilityLocation: 'Bay 3 - Machining Shop',
      criticality: 'CRITICAL_BOTTLENECK',
      status: 'BREAKDOWN_STOPPAGE',
    },
    reportedBy: 'Karthik Raja (CNC Operator Lead)',
    assignedTechnician: 'Anand Kumar (Sr. Mechatronics Eng)',
    severity: 'CRITICAL',
    status: 'UNDER_REPAIR',
    failureCategory: 'SPINDLE_BEARING_OVERHEAT',
    symptomDescription: 'Spindle vibration exceeded 8.2 mm/s with bearing temperature spike to 88°C. Thermal sensor triggered emergency interlock.',
    breakdownStartedAt: '2026-10-07 14:15',
    downtimeHours: 3.8,
    repairCostEstimate: 2400,
  },
  {
    id: 'bdk-2',
    ticketNumber: 'BDK-2026-0103',
    assetId: 'ast-4',
    asset: {
      id: 'ast-4',
      assetTag: 'AST-INJ-002',
      assetName: 'Engel 300-Ton Hydraulic Injection Molding Press',
      category: 'INJECTION_MOLDING',
      facilityLocation: 'Molding Bay 2',
      criticality: 'HIGH',
      status: 'DEGRADED',
    },
    reportedBy: 'Devendra Joshi (Shift In-charge)',
    assignedTechnician: 'Vikram Singh (Hydraulics Tech)',
    severity: 'MODERATE',
    status: 'WAITING_FOR_PARTS',
    failureCategory: 'HYDRAULIC_SEAL_LEAK',
    symptomDescription: 'Minor hydraulic oil seepage on clamping cylinder piston seal. Pressure drop from 180 bar to 162 bar.',
    breakdownStartedAt: '2026-10-07 11:30',
    downtimeHours: 6.5,
    repairCostEstimate: 650,
  },
];

const MOCK_UPCOMING_PM: MaintenanceScheduleItem[] = [
  {
    id: 'pm-1',
    scheduleCode: 'PMS-ROB-W01',
    assetId: 'ast-3',
    asset: {
      id: 'ast-3',
      assetTag: 'AST-ROB-001',
      assetName: 'KUKA 6-Axis Spot Welding Articulated Arm',
      category: 'ASSEMBLY_ROBOT',
      facilityLocation: 'Robotic Cell Alpha',
      status: 'OPERATIONAL',
    },
    title: 'Axis 1-6 Gearbox Grease Flushing & Harmonic Drive Backlash Check',
    scheduleType: 'LUBRICATION',
    interval: 'MONTHLY',
    status: 'DUE',
    nextDueDate: '2026-10-08',
    estimatedDurationHours: 2.5,
    assignedTechnician: 'Sunil Rao (Robotics Specialist)',
  },
  {
    id: 'pm-2',
    scheduleCode: 'PMS-PRESS-M03',
    assetId: 'ast-5',
    asset: {
      id: 'ast-5',
      assetTag: 'AST-PRS-001',
      assetName: 'Schuler 500-Ton Heavy Stamping Press',
      category: 'HYDRAULIC_PRESS',
      facilityLocation: 'Stamping Hall A',
      status: 'OPERATIONAL',
    },
    title: 'Hydraulic Proportional Valve Calibration & Filter Micron Check',
    scheduleType: 'CALIBRATION',
    interval: 'MONTHLY',
    status: 'SCHEDULED',
    nextDueDate: '2026-10-10',
    estimatedDurationHours: 3.0,
    assignedTechnician: 'Vikram Singh (Hydraulics Tech)',
  },
  {
    id: 'pm-3',
    scheduleCode: 'PMS-COMP-W02',
    assetId: 'ast-8',
    asset: {
      id: 'ast-8',
      assetTag: 'AST-UTL-001',
      assetName: 'Atlas Copco Variable Speed Rotary Screw Compressor',
      category: 'UTILITY_COMPRESSOR',
      facilityLocation: 'Utility Plant Room',
      status: 'OPERATIONAL',
    },
    title: 'Oil-Air Separator Cartridge Differential Pressure Inspection',
    scheduleType: 'FILTER_REPLACEMENT',
    interval: 'BIWEEKLY',
    status: 'SCHEDULED',
    nextDueDate: '2026-10-11',
    estimatedDurationHours: 1.5,
    assignedTechnician: 'Praveen Nair (Utility Tech)',
  },
];

export default function AssetReliabilityDashboard() {
  const [activeBreakdowns] = useState<BreakdownTicketItem[]>(MOCK_ACTIVE_BREAKDOWNS);
  const [upcomingPm] = useState<MaintenanceScheduleItem[]>(MOCK_UPCOMING_PM);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Gauge className="h-6 w-6 text-amber-500 dark:text-amber-400" />
              Equipment Reliability &amp; Asset Health Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              Plant OEE: 88.6%
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Autonomous machinery telemetry, Mean Time Between Failures (MTBF), preventive lubrication schedules, tool crib replenishment, and rapid breakdown dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/asset-reliability/breakdowns"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-colors"
          >
            <AlertOctagon className="h-4 w-4" />
            Report Breakdown
          </Link>
          <Link
            href="/asset-reliability/preventive-schedules"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/20 transition-colors"
          >
            <CalendarClock className="h-4 w-4" />
            Schedule Routine
          </Link>
          <Link
            href="/asset-reliability/spare-parts"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-xs shadow-sm transition-colors"
          >
            <Boxes className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            Tool Crib
          </Link>
        </div>
      </div>

      {/* Unified Asset Reliability & Maintenance Hub Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Link
          href="/asset-reliability"
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white shadow-xs"
        >
          Equipment Health & OEE Hub
        </Link>
        <Link
          href="/asset-reliability/breakdowns"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Breakdown Repair Tickets
        </Link>
        <Link
          href="/asset-reliability/preventive-schedules"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Preventive Maintenance (PM) Calendar
        </Link>
        <Link
          href="/asset-reliability/spare-parts"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Tool Crib & Spare Parts
        </Link>
        <Link
          href="/production/downtime"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Shop Floor Line Stoppages
        </Link>
      </div>

      {/* Plain-English Explainer Guide for Asset Reliability */}
      <PlainEnglishBanner
        moduleName="Equipment Reliability & Asset Health"
        whatItDoes="Monitors machine operating health, tracks unexpected equipment breakdowns, schedules routine preventive maintenance (e.g. oil changes, sensor calibration), and manages spare parts in the tool crib."
        whyItMatters="Stops sudden factory line shutdowns before they occur, extends machine lifespan, and ensures emergency repair technicians have spare parts ready."
        metrics={[
          {
            acronym: 'MTBF (Mean Time Between Failures)',
            plainName: 'Average Running Uptime Before Failure',
            explanation: 'The average number of operational hours a machine runs smoothly before needing repair; higher is better.',
          },
          {
            acronym: 'MTTR (Mean Time to Repair)',
            plainName: 'Average Fix Duration',
            explanation: 'How quickly technicians diagnose and fix a broken machine to get it running again; lower is better.',
          },
          {
            acronym: 'OEE (Overall Equipment Effectiveness)',
            plainName: 'Machine Productive Performance',
            explanation: 'Score combining machine Availability (not broken), Speed (running at rated pace), and Quality (zero defect parts produced).',
          },
        ]}
        quickSteps={[
          '1. Inspect live telemetry for temperature, vibration, and spindle health',
          '2. File rapid breakdown tickets when an assembly line machine stops',
          '3. Check off routine preventive maintenance tasks before scheduled due dates',
        ]}
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Machine Fleet Uptime */}
        <div className="bg-white dark:bg-[#0f172a]/80 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Fleet Operational Uptime</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center">
              <Gauge className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">99.4%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">(48 / 50 Machines)</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>+0.3% vs Monthly Target (99.1%)</span>
          </div>
        </div>

        {/* MTBF Metric */}
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mean Time Between Failures</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">348.5h</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">MTBF</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>+14.2% longer operating intervals</span>
          </div>
        </div>

        {/* MTTR Metric */}
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mean Time to Repair</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">1.8h</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">MTTR (Target &lt; 2.5h)</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Fast technician dispatch on shop floor</span>
          </div>
        </div>

        {/* Maintenance Expenses YTD */}
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Maintenance YTD</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">$42,850</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">68% Preventive</span>
            <span className="text-rose-600 dark:text-rose-400">32% Breakdown</span>
          </div>
        </div>
      </div>

      {/* Real-Time Active Downtime Alerts Banner */}
      {activeBreakdowns.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping"></span>
              <h2 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertOctagon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                Active Machine Stoppage &amp; Breakdown Incidents ({activeBreakdowns.length})
              </h2>
            </div>
            <Link
              href="/asset-reliability/breakdowns"
              className="text-xs text-rose-700 hover:text-rose-900 dark:text-rose-300 dark:hover:text-white flex items-center gap-1 transition-colors font-medium"
            >
              Open Breakdown Dispatch Board <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeBreakdowns.map((bdk) => (
              <div
                key={bdk.id}
                className="bg-white dark:bg-[#0f172a] border border-rose-200 dark:border-rose-500/30 rounded-lg p-3.5 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">{bdk.ticketNumber}</span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{bdk.asset?.assetTag}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 uppercase">
                      {bdk.severity}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1">{bdk.asset?.assetName}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{bdk.symptomDescription}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <div className="text-slate-500 dark:text-slate-400">
                    Tech: <strong className="text-slate-700 dark:text-slate-200">{bdk.assignedTechnician || 'Unassigned'}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-amber-600 dark:text-amber-400">
                    <Clock className="h-3 w-3" />
                    <span>Downtime: {bdk.downtimeHours}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Preventive Routine Forecast & Machinery Category Reliability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Preventive Maintenance Schedule Forecast */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Preventive Maintenance Schedule (Next 72 Hours)</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated lubrication, sensor recalibrations, and routine inspections</p>
              </div>
            </div>
            <Link
              href="/asset-reliability/preventive-schedules"
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
            >
              Full Calendar <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingPm.map((pm) => (
              <div
                key={pm.id}
                className="p-3 bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">{pm.scheduleCode}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">[{pm.asset?.assetTag}]</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{pm.asset?.assetName}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{pm.title}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Routine: <strong className="text-slate-700 dark:text-slate-300">{pm.scheduleType}</strong></span>
                    <span>Interval: <strong className="text-slate-700 dark:text-slate-300">{pm.interval}</strong></span>
                    <span>Assigned: <strong className="text-slate-700 dark:text-slate-300">{pm.assignedTechnician}</strong></span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      pm.status === 'DUE'
                        ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 animate-pulse'
                        : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                    }`}
                  >
                    {pm.status === 'DUE' ? 'Action Due Today' : `Due: ${pm.nextDueDate}`}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Est: {pm.estimatedDurationHours} hrs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Machinery Category Reliability Breakdown */}
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cog className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Asset Fleet Distribution</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Availability across machine classes</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span className="font-medium">CNC Machining Centers (12 units)</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">91.6% (1 Down)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '91.6%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span className="font-medium">Injection Molding Presses (8 units)</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">87.5% (1 Degraded)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '87.5%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span className="font-medium">Articulated Assembly Robots (14 units)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">100% Optimal</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span className="font-medium">Hydraulic Presses &amp; Stampers (6 units)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">100% Optimal</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span className="font-medium">Utility Air Compressors &amp; Chillers (10 units)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">100% Optimal</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> Tool Crib Quick Alert
            </div>
            <div>
              4 spare parts reached low-stock threshold (SKF Ball Bearings &amp; Hydraulic O-Rings).
            </div>
            <Link
              href="/asset-reliability/spare-parts"
              className="text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-white underline inline-block mt-1 font-medium"
            >
              Order Tool Crib Replenishments &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

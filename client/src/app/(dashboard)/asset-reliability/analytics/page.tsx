'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Clock,
  Wrench,
  DollarSign,
  TrendingUp,
  History,
  FileCheck2,
  Calendar,
  Layers,
  ChevronRight,
  Gauge,
} from 'lucide-react';
import {
  AssetReliabilityBreakdownItem,
  AssetLifecycleLogItem,
  AssetLifecycleEventType,
} from '@/types/asset-reliability';

const INITIAL_BREAKDOWN_DATA: AssetReliabilityBreakdownItem[] = [
  {
    assetId: 'ast-1',
    assetTag: 'AST-CNC-001',
    assetName: 'DMG Mori 5-Axis Machining Center DMU 50',
    category: 'CNC_MACHINING',
    facilityLocation: 'Bay 3 - Machining Shop',
    status: 'BREAKDOWN_STOPPAGE',
    criticality: 'CRITICAL_BOTTLENECK',
    totalOperatingHours: 7420,
    totalBreakdowns: 2,
    totalDowntimeHours: 5.2,
    totalRepairCost: 2950,
    computedMtbfHours: 410.2,
    computedMttrHours: 2.6,
    availabilityPercentage: 99.3,
  },
  {
    assetId: 'ast-2',
    assetTag: 'AST-CNC-002',
    assetName: 'Haas VF-4SS Super-Speed Vertical Center',
    category: 'CNC_MACHINING',
    facilityLocation: 'Bay 3 - Machining Shop',
    status: 'OPERATIONAL',
    criticality: 'HIGH',
    totalOperatingHours: 11250,
    totalBreakdowns: 1,
    totalDowntimeHours: 1.4,
    totalRepairCost: 420,
    computedMtbfHours: 520.0,
    computedMttrHours: 1.4,
    availabilityPercentage: 99.8,
  },
  {
    assetId: 'ast-3',
    assetTag: 'AST-ROB-001',
    assetName: 'KUKA KR 210 R2700 Prime Robot',
    category: 'ASSEMBLY_ROBOT',
    facilityLocation: 'Robotic Cell Alpha',
    status: 'OPERATIONAL',
    criticality: 'HIGH',
    totalOperatingHours: 4180,
    totalBreakdowns: 0,
    totalDowntimeHours: 0.0,
    totalRepairCost: 150,
    computedMtbfHours: 850.5,
    computedMttrHours: 1.0,
    availabilityPercentage: 100.0,
  },
  {
    assetId: 'ast-4',
    assetTag: 'AST-INJ-002',
    assetName: 'Engel Victory 300T Hydraulic Press',
    category: 'INJECTION_MOLDING',
    facilityLocation: 'Molding Bay 2',
    status: 'DEGRADED',
    criticality: 'HIGH',
    totalOperatingHours: 18450,
    totalBreakdowns: 4,
    totalDowntimeHours: 14.2,
    totalRepairCost: 4800,
    computedMtbfHours: 290.4,
    computedMttrHours: 3.5,
    availabilityPercentage: 97.9,
  },
  {
    assetId: 'ast-5',
    assetTag: 'AST-PRS-001',
    assetName: 'Schuler 500-Ton Heavy Stamping Press',
    category: 'HYDRAULIC_PRESS',
    facilityLocation: 'Stamping Hall A',
    status: 'OPERATIONAL',
    criticality: 'CRITICAL_BOTTLENECK',
    totalOperatingHours: 22800,
    totalBreakdowns: 3,
    totalDowntimeHours: 8.6,
    totalRepairCost: 3200,
    computedMtbfHours: 310.8,
    computedMttrHours: 2.8,
    availabilityPercentage: 99.6,
  },
  {
    assetId: 'ast-6',
    assetTag: 'AST-UTL-001',
    assetName: 'Atlas Copco GA 75 VSD+ Compressor',
    category: 'UTILITY_COMPRESSOR',
    facilityLocation: 'Utility Plant Room',
    status: 'OPERATIONAL',
    criticality: 'MEDIUM',
    totalOperatingHours: 9800,
    totalBreakdowns: 0,
    totalDowntimeHours: 0.0,
    totalRepairCost: 310,
    computedMtbfHours: 1200.0,
    computedMttrHours: 1.1,
    availabilityPercentage: 100.0,
  },
];

const INITIAL_LIFECYCLE_LOGS: AssetLifecycleLogItem[] = [
  {
    id: 'log-1',
    assetId: 'ast-1',
    asset: {
      assetTag: 'AST-CNC-001',
      assetName: 'DMG Mori 5-Axis Center',
      facilityLocation: 'Bay 3 - Machining Shop',
    },
    eventType: 'BREAKDOWN_REPAIR',
    eventTitle: 'Spindle Bearing Thermal Interlock Shutdown',
    eventDescription: 'Spindle bearing vibration threshold tripped thermal cutoff. Replaced 2x SKF high precision bearings and dynamic runout retested.',
    costIncurred: 2400,
    downtimeIncurredMinutes: 228,
    performedBy: 'Anand Kumar (Sr. Mechatronics Eng)',
    recordedAt: '2026-10-07 16:30',
  },
  {
    id: 'log-2',
    assetId: 'ast-2',
    asset: {
      assetTag: 'AST-CNC-002',
      assetName: 'Haas VF-4SS Center',
      facilityLocation: 'Bay 3 - Machining Shop',
    },
    eventType: 'BREAKDOWN_REPAIR',
    eventTitle: 'Tool Changer Carousel Pocket Jam Rectified',
    eventDescription: 'De-swarfed proximity sensor array and adjusted tool unclamp piston travel.',
    costIncurred: 120,
    downtimeIncurredMinutes: 85,
    performedBy: 'Anand Kumar',
    recordedAt: '2026-10-06 10:45',
  },
  {
    id: 'log-3',
    assetId: 'ast-5',
    asset: {
      assetTag: 'AST-PRS-001',
      assetName: 'Schuler 500T Stamping Press',
      facilityLocation: 'Stamping Hall A',
    },
    eventType: 'PREVENTIVE_MAINTENANCE',
    eventTitle: 'Monthly 5-Micron Suction Filter Replacement & Valve Recalibration',
    eventDescription: 'Hydraulic proportional valve pressure linearity verified to 0.5% tolerance. Replaced 5-micron element.',
    costIncurred: 85,
    downtimeIncurredMinutes: 120,
    performedBy: 'Vikram Singh (Hydraulics Tech)',
    recordedAt: '2026-10-06 10:15',
  },
  {
    id: 'log-4',
    assetId: 'ast-3',
    asset: {
      assetTag: 'AST-ROB-001',
      assetName: 'KUKA KR 210 Robot',
      facilityLocation: 'Robotic Cell Alpha',
    },
    eventType: 'CALIBRATION',
    eventTitle: 'Semi-Annual ISO 9283 Robot Pose Repeatability Laser Tracker Audit',
    eventDescription: 'Laser tracker measured 0.042mm repeatability across 30 cycle passes. Exceeds OEM spec of 0.06mm.',
    costIncurred: 350,
    downtimeIncurredMinutes: 90,
    performedBy: 'External Metrology Auditor',
    recordedAt: '2026-09-28 14:00',
  },
  {
    id: 'log-5',
    assetId: 'ast-6',
    asset: {
      assetTag: 'AST-UTL-001',
      assetName: 'Atlas Copco GA 75 Compressor',
      facilityLocation: 'Utility Plant Room',
    },
    eventType: 'COMMISSIONING',
    eventTitle: 'Factory Acceptance & Permanent Utility Integration',
    eventDescription: 'Commissioned on plant primary 415V feeder and connected to plant air ring main.',
    costIncurred: 1800,
    downtimeIncurredMinutes: 0,
    performedBy: 'Atlas Copco Field Services',
    recordedAt: '2023-08-12 11:00',
  },
];

export default function AssetReliabilityAnalyticsPage() {
  const [breakdownData] = useState<AssetReliabilityBreakdownItem[]>(INITIAL_BREAKDOWN_DATA);
  const [lifecycleLogs, setLifecycleLogs] = useState<AssetLifecycleLogItem[]>(INITIAL_LIFECYCLE_LOGS);

  const [activeTab, setActiveTab] = useState<'METRICS' | 'LIFECYCLE'>('METRICS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogMilestoneOpen, setIsLogMilestoneOpen] = useState(false);

  // Milestone Form
  const [milestoneAssetTag, setMilestoneAssetTag] = useState('AST-CNC-001');
  const [milestoneType, setMilestoneType] = useState<AssetLifecycleEventType>('CALIBRATION');
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneCost, setMilestoneCost] = useState('250');
  const [milestoneDowntime, setMilestoneDowntime] = useState('60');
  const [milestoneBy, setMilestoneBy] = useState('Anand Kumar');

  const filteredMetrics = breakdownData.filter(
    (item) =>
      item.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.facilityLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = lifecycleLogs.filter(
    (log) =>
      log.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.asset?.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AssetLifecycleLogItem = {
      id: `log-${Date.now()}`,
      assetId: 'ast-selected',
      asset: {
        assetTag: milestoneAssetTag,
        assetName: 'Plant Machine Asset',
        facilityLocation: 'Factory Floor',
      },
      eventType: milestoneType,
      eventTitle: milestoneTitle,
      eventDescription: milestoneDesc,
      costIncurred: parseFloat(milestoneCost) || 0,
      downtimeIncurredMinutes: parseInt(milestoneDowntime) || 0,
      performedBy: milestoneBy,
      recordedAt: 'Just now',
    };

    setLifecycleLogs([created, ...lifecycleLogs]);
    setIsLogMilestoneOpen(false);
    setMilestoneTitle('');
    setMilestoneDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/asset-reliability"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Reliability Command Center
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <Activity className="h-6 w-6 text-amber-400" />
            Equipment Reliability Analytics &amp; Asset Lifecycle Logs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Mean Time Between Failures (MTBF), Mean Time to Repair (MTTR), machine availability benchmarks, and chronological lifecycle audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLogMilestoneOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Log Lifecycle Milestone
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fleet MTBF Benchmark</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">348.5h</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+14.2% longer intervals</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fleet MTTR Benchmark</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Wrench className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">1.8h</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400">Target &lt; 2.5h maintained</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fleet Operational Availability</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Gauge className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">98.7%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Excludes scheduled shift pauses</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Maintenance YTD</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">$42,850</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400">Includes replacement parts &amp; labor</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'METRICS'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-300'
          }`}
        >
          <Activity className="h-4 w-4" />
          Reliability &amp; Availability Matrix
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-700 dark:text-slate-300">
            {breakdownData.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('LIFECYCLE')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'LIFECYCLE'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-300'
          }`}
        >
          <History className="h-4 w-4" />
          Asset Lifecycle Milestone History
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-700 dark:text-slate-300">
            {lifecycleLogs.length}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder={
              activeTab === 'METRICS'
                ? 'Search matrix by asset tag, machine name, or bay...'
                : 'Search lifecycle logs by event title, asset tag, or engineer...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* TAB 1: RELIABILITY MATRIX */}
      {activeTab === 'METRICS' && (
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Machine Reliability, MTBF &amp; MTTR Scorecard</h2>
            </div>
            <div className="text-xs text-slate-400">Statistical rolling 90-day window</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Asset Tag &amp; Machine</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Operating Hours</th>
                  <th className="py-3 px-4">Breakdowns &amp; Downtime</th>
                  <th className="py-3 px-4">MTBF (Hours)</th>
                  <th className="py-3 px-4">MTTR (Hours)</th>
                  <th className="py-3 px-4">Maintenance Cost</th>
                  <th className="py-3 px-4 text-right">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredMetrics.map((item) => (
                  <tr key={item.assetId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        {item.assetTag}
                      </div>
                      <div className="text-slate-200 font-medium text-[11px] mt-0.5">{item.assetName}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {item.facilityLocation}
                    </td>

                    <td className="py-3 px-4 font-mono text-white">
                      {item.totalOperatingHours.toLocaleString()} hrs
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-medium">{item.totalBreakdowns} failures</div>
                      <div className="text-[11px] text-rose-400 font-mono mt-0.5">{item.totalDowntimeHours} hrs downtime</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-indigo-300 font-semibold">
                      {item.computedMtbfHours.toFixed(1)} hrs
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                      {item.computedMttrHours.toFixed(1)} hrs
                    </td>

                    <td className="py-3 px-4 font-mono text-white">
                      ${item.totalRepairCost.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-bold text-white">{item.availabilityPercentage}%</div>
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden ml-auto mt-1">
                        <div
                          className={`h-full rounded-full ${
                            item.availabilityPercentage >= 99
                              ? 'bg-emerald-500'
                              : item.availabilityPercentage >= 98
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.availabilityPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LIFECYCLE LOGS */}
      {activeTab === 'LIFECYCLE' && (
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Audited Asset Lifecycle Milestones</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Event Type &amp; Date</th>
                  <th className="py-3 px-4">Target Machine Asset</th>
                  <th className="py-3 px-4">Milestone Title &amp; Details</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4">Downtime Impact</th>
                  <th className="py-3 px-4 text-right">Cost Incurred</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          log.eventType === 'COMMISSIONING'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                            : log.eventType === 'PREVENTIVE_MAINTENANCE'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                            : log.eventType === 'BREAKDOWN_REPAIR'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                            : 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {log.eventType.replace('_', ' ')}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">{log.recordedAt}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{log.asset?.assetTag}</div>
                      <div className="text-[11px] text-slate-400">{log.asset?.facilityLocation}</div>
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-semibold text-slate-200">{log.eventTitle}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{log.eventDescription}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-200">
                      {log.performedBy}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {log.downtimeIncurredMinutes > 0 ? `${(log.downtimeIncurredMinutes / 60).toFixed(1)} hrs` : '0 hrs (Online)'}
                    </td>

                    <td className="py-3 px-4 font-mono text-white font-medium text-right">
                      ${log.costIncurred.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Milestone Modal */}
      {isLogMilestoneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsLogMilestoneOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <History className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Log Asset Lifecycle Milestone</h3>
                <p className="text-xs text-slate-400">Record calibration, relocation, overhaul, or audit milestone</p>
              </div>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target Asset Tag</label>
                  <input
                    type="text"
                    required
                    value={milestoneAssetTag}
                    onChange={(e) => setMilestoneAssetTag(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Event Type</label>
                  <select
                    value={milestoneType}
                    onChange={(e) => setMilestoneType(e.target.value as AssetLifecycleEventType)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CALIBRATION">CALIBRATION</option>
                    <option value="PREVENTIVE_MAINTENANCE">PREVENTIVE_MAINTENANCE</option>
                    <option value="BREAKDOWN_REPAIR">BREAKDOWN_REPAIR</option>
                    <option value="RELOCATION">RELOCATION</option>
                    <option value="COMMISSIONING">COMMISSIONING</option>
                    <option value="DECOMMISSION">DECOMMISSION</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Milestone Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Laser Interferometer Calibration"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Detailed Description &amp; Verification</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe metrology results, certifications, or work performed..."
                  value={milestoneDesc}
                  onChange={(e) => setMilestoneDesc(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Cost Incurred ($)</label>
                  <input
                    type="number"
                    value={milestoneCost}
                    onChange={(e) => setMilestoneCost(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Downtime (Mins)</label>
                  <input
                    type="number"
                    value={milestoneDowntime}
                    onChange={(e) => setMilestoneDowntime(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Performed By</label>
                  <input
                    type="text"
                    value={milestoneBy}
                    onChange={(e) => setMilestoneBy(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogMilestoneOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

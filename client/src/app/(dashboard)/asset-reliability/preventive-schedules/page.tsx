'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Clock,
  Wrench,
  CheckSquare,
  AlertOctagon,
  RefreshCw,
  Zap,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  MaintenanceScheduleItem,
  MaintenanceScheduleType,
  MaintenanceInterval,
  MaintenanceScheduleStatus,
} from '@/types/asset-reliability';

const INITIAL_SCHEDULES: MaintenanceScheduleItem[] = [
  {
    id: 'pm-1',
    scheduleCode: 'PMS-ROB-W01',
    assetId: 'ast-3',
    asset: {
      id: 'ast-3',
      assetTag: 'AST-ROB-001',
      assetName: 'KUKA KR 210 R2700 Prime Articulated Robot',
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
    checklistItems: [
      { step: 'Check J1 to J6 harmonic drive backlash', required: true, verified: false },
      { step: 'Flush synthetic polyurea grease EP-00', required: true, verified: false },
      { step: 'Inspect cable harness umbilical track for wear', required: true, verified: false },
    ],
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
    checklistItems: [
      { step: 'Verify 0-10V analog input linear pressure response', required: true, verified: false },
      { step: 'Replace 5-micron suction return filter cartridge', required: true, verified: false },
      { step: 'Measure oil cleanliness ISO 4406 count (target 16/14/11)', required: true, verified: false },
    ],
  },
  {
    id: 'pm-3',
    scheduleCode: 'PMS-COMP-W02',
    assetId: 'ast-6',
    asset: {
      id: 'ast-6',
      assetTag: 'AST-UTL-001',
      assetName: 'Atlas Copco GA 75 VSD+ Variable Speed Compressor',
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
  {
    id: 'pm-4',
    scheduleCode: 'PMS-CNC-Q01',
    assetId: 'ast-2',
    asset: {
      id: 'ast-2',
      assetTag: 'AST-CNC-002',
      assetName: 'Haas VF-4SS Super-Speed Vertical Machining Center',
      category: 'CNC_MACHINING',
      facilityLocation: 'Bay 3 - Machining Shop',
      status: 'OPERATIONAL',
    },
    title: 'Spindle Taper Runout Dial Test Indicator & Tool Release Piston O-Ring',
    scheduleType: 'ROUTINE_INSPECTION',
    interval: 'QUARTERLY',
    status: 'SCHEDULED',
    nextDueDate: '2026-10-15',
    estimatedDurationHours: 2.0,
    assignedTechnician: 'Anand Kumar (Sr. Mechatronics Eng)',
  },
  {
    id: 'pm-5',
    scheduleCode: 'PMS-INJ-M01',
    assetId: 'ast-4',
    asset: {
      id: 'ast-4',
      assetTag: 'AST-INJ-002',
      assetName: 'Engel Victory 300-Ton Hydraulic Injection Press',
      category: 'INJECTION_MOLDING',
      facilityLocation: 'Molding Bay 2',
      status: 'DEGRADED',
    },
    title: 'Barrel Heater Ceramic Band Resistance & Thermocouple Verification',
    scheduleType: 'ELECTRICAL_INSPECTION',
    interval: 'MONTHLY',
    status: 'OVERDUE',
    nextDueDate: '2026-10-05',
    estimatedDurationHours: 2.0,
    assignedTechnician: 'Sunil Rao (Robotics Specialist)',
  },
];

export default function PreventiveMaintenancePage() {
  const [schedules, setSchedules] = useState<MaintenanceScheduleItem[]>(INITIAL_SCHEDULES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [completingSchedule, setCompletingSchedule] = useState<MaintenanceScheduleItem | null>(null);

  // Create form state
  const [newCode, setNewCode] = useState('');
  const [newAssetTag, setNewAssetTag] = useState('AST-CNC-001');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<MaintenanceScheduleType>('LUBRICATION');
  const [newInterval, setNewInterval] = useState<MaintenanceInterval>('MONTHLY');
  const [newDueDate, setNewDueDate] = useState('2026-10-15');
  const [newDuration, setNewDuration] = useState('2.0');
  const [newTechnician, setNewTechnician] = useState('');

  // Complete form state
  const [actualDuration, setActualDuration] = useState('2.0');
  const [completionNotes, setCompletionNotes] = useState('');
  const [completedBy, setCompletedBy] = useState('Anand Kumar (Sr. Mechatronics Eng)');
  const [partsUsedDesc, setPartsUsedDesc] = useState('1x Filter Cartridge 5-Micron');

  const filteredSchedules = schedules.filter((s) => {
    const matchesSearch =
      s.scheduleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.asset?.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.asset?.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignedTechnician?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || s.scheduleType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: MaintenanceScheduleItem = {
      id: `pm-${Date.now()}`,
      scheduleCode: newCode || `PMS-${Date.now().toString().slice(-6)}`,
      assetId: 'ast-custom',
      asset: {
        id: 'ast-custom',
        assetTag: newAssetTag,
        assetName: 'Target Machine Unit',
        category: 'CNC_MACHINING',
        facilityLocation: 'Production Plant Floor',
        status: 'OPERATIONAL',
      },
      title: newTitle,
      scheduleType: newType,
      interval: newInterval,
      status: 'SCHEDULED',
      nextDueDate: newDueDate,
      estimatedDurationHours: parseFloat(newDuration) || 2.0,
      assignedTechnician: newTechnician || 'On-Call Maintenance Tech',
    };

    setSchedules([newRecord, ...schedules]);
    setIsCreateModalOpen(false);
    setNewCode('');
    setNewTitle('');
    setNewTechnician('');
  };

  const handleCompleteSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingSchedule) return;

    // Calculate next due date (e.g. +30 days)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    const nextDueDateStr = nextDate.toISOString().slice(0, 10);

    setSchedules(
      schedules.map((s) =>
        s.id === completingSchedule.id
          ? {
              ...s,
              status: 'COMPLETED',
              lastPerformedAt: '2026-10-07 16:30',
              nextDueDate: nextDueDateStr,
              notes: `Completed by ${completedBy}. Duration: ${actualDuration}h. Notes: ${completionNotes}. Parts: ${partsUsedDesc}`,
            }
          : s
      )
    );

    setCompletingSchedule(null);
    setCompletionNotes('');
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
            <CalendarClock className="h-6 w-6 text-amber-400" />
            Preventive Maintenance Schedules &amp; Lubrication Routines
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Interval-driven maintenance scheduling, automated periodic lubrication tasks, sensor recalibration dates, and technician work sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Preventive Routine
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active PM Routines</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <CalendarClock className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{schedules.length} Routines</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Continuous interval coverage</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action Due Today</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-400 font-mono">
              {schedules.filter((s) => s.status === 'DUE' || s.status === 'OVERDUE').length} Tasks
            </span>
          </div>
          <div className="mt-2 text-[11px] text-rose-300">Requires technician shop floor signoff</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">PM Compliance Rate</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">96.4%</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400">On-time servicing SLA achieved</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Routine Duration</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Wrench className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">2.2 hrs</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-300">Scheduled during shift turnover</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by schedule code, routine title, asset tag, or technician..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Routine Types</option>
            <option value="LUBRICATION">Lubrication</option>
            <option value="CALIBRATION">Calibration</option>
            <option value="ROUTINE_INSPECTION">Inspection</option>
            <option value="ELECTRICAL_INSPECTION">Electrical</option>
            <option value="FILTER_REPLACEMENT">Filter Replacement</option>
            <option value="MECHANICAL_OVERHAUL">Mechanical Overhaul</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="DUE">Due Today</option>
            <option value="OVERDUE">Overdue</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Preventive Maintenance Calendar &amp; Queue</h2>
            <span className="text-xs text-slate-500 font-mono">({filteredSchedules.length} routines)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Routine Code &amp; Title</th>
                <th className="py-3 px-4">Target Machine &amp; Bay</th>
                <th className="py-3 px-4">Type &amp; Interval</th>
                <th className="py-3 px-4">Next Due Date</th>
                <th className="py-3 px-4">Duration &amp; Technician</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredSchedules.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      {s.scheduleCode}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 font-medium text-[11px] mt-0.5 max-w-xs">{s.title}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{s.asset?.assetTag}</div>
                    <div className="text-[11px] text-slate-400">{s.asset?.facilityLocation}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700">
                      {s.scheduleType}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">{s.interval}</div>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="font-semibold text-white">{s.nextDueDate}</div>
                    {s.lastPerformedAt && (
                      <div className="text-[10px] text-slate-500">Last: {s.lastPerformedAt}</div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200">{s.assignedTechnician || 'Unassigned'}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{s.estimatedDurationHours} hrs est.</div>
                  </td>

                  <td className="py-3 px-4">
                    {s.status === 'DUE' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit animate-pulse">
                        <AlertTriangle className="h-3 w-3" /> Due Today
                      </span>
                    )}
                    {s.status === 'OVERDUE' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/40 flex items-center gap-1 w-fit">
                        <AlertOctagon className="h-3 w-3" /> Overdue
                      </span>
                    )}
                    {s.status === 'SCHEDULED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <Clock className="h-3 w-3" /> Scheduled
                      </span>
                    )}
                    {s.status === 'COMPLETED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" /> Completed
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {s.status !== 'COMPLETED' && (
                      <button
                        onClick={() => setCompletingSchedule(s)}
                        className="px-2.5 py-1 rounded bg-amber-950/50 hover:bg-amber-900/60 text-amber-400 border border-amber-600/30 text-[11px] font-medium transition-colors"
                      >
                        Sign-off Routine
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Routine Modal */}
      {completingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setCompletingSchedule(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Sign-off Preventive Maintenance Routine</h3>
                <p className="text-xs text-amber-400 font-mono">{completingSchedule.scheduleCode} - {completingSchedule.asset?.assetTag}</p>
              </div>
            </div>

            <form onSubmit={handleCompleteSchedule} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                <div className="font-semibold text-white">{completingSchedule.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">Location: {completingSchedule.asset?.facilityLocation}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Technician Performing</label>
                  <input
                    type="text"
                    required
                    value={completedBy}
                    onChange={(e) => setCompletedBy(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Actual Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={actualDuration}
                    onChange={(e) => setActualDuration(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Spare Parts Consumed</label>
                <input
                  type="text"
                  placeholder="e.g. 1x SKF 6208 Bearing, 2L Shell Tellus ISO 46 Oil"
                  value={partsUsedDesc}
                  onChange={(e) => setPartsUsedDesc(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Observations &amp; Condition Remarks</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Note backlash measurements, grease cleanliness, or upcoming wear items..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCompletingSchedule(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                >
                  Confirm Completion &amp; Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Routine Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Plus className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Create Preventive Maintenance Routine</h3>
                <p className="text-xs text-slate-400">Establish periodic servicing schedule for an asset</p>
              </div>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target Asset Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AST-CNC-001"
                    value={newAssetTag}
                    onChange={(e) => setNewAssetTag(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Schedule Code</label>
                  <input
                    type="text"
                    placeholder="e.g. PMS-CNC-M01"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Routine Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spindle Chiller Coolant Refill & Filter Swap"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Routine Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MaintenanceScheduleType)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="LUBRICATION">LUBRICATION</option>
                    <option value="CALIBRATION">CALIBRATION</option>
                    <option value="ROUTINE_INSPECTION">ROUTINE_INSPECTION</option>
                    <option value="ELECTRICAL_INSPECTION">ELECTRICAL_INSPECTION</option>
                    <option value="FILTER_REPLACEMENT">FILTER_REPLACEMENT</option>
                    <option value="MECHANICAL_OVERHAUL">MECHANICAL_OVERHAUL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Interval</label>
                  <select
                    value={newInterval}
                    onChange={(e) => setNewInterval(e.target.value as MaintenanceInterval)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="DAILY">DAILY</option>
                    <option value="WEEKLY">WEEKLY</option>
                    <option value="BIWEEKLY">BIWEEKLY</option>
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="QUARTERLY">QUARTERLY</option>
                    <option value="BIANNUAL">BIANNUAL</option>
                    <option value="ANNUAL">ANNUAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Next Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Est. Duration (Hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Assigned Tech</label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Kumar"
                    value={newTechnician}
                    onChange={(e) => setNewTechnician(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
                >
                  Schedule Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

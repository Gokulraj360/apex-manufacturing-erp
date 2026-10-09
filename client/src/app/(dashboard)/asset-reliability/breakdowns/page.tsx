'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Clock,
  Wrench,
  UserCheck,
  Zap,
  Activity,
  Layers,
  RotateCcw,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import {
  BreakdownTicketItem,
  BreakdownSeverity,
  BreakdownTicketStatus,
} from '@/types/asset-reliability';

const INITIAL_BREAKDOWNS: BreakdownTicketItem[] = [
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
  {
    id: 'bdk-3',
    ticketNumber: 'BDK-2026-0101',
    assetId: 'ast-2',
    asset: {
      id: 'ast-2',
      assetTag: 'AST-CNC-002',
      assetName: 'Haas VF-4SS Super-Speed Vertical Machining Center',
      category: 'CNC_MACHINING',
      facilityLocation: 'Bay 3 - Machining Shop',
      criticality: 'HIGH',
      status: 'OPERATIONAL',
    },
    reportedBy: 'Manish Verma (Day Supervisor)',
    assignedTechnician: 'Anand Kumar (Sr. Mechatronics Eng)',
    severity: 'MODERATE',
    status: 'RESOLVED',
    failureCategory: 'TOOL_CHANGER_CAROUSEL_JAM',
    symptomDescription: 'Geneva mechanism tool pocket #14 jammed due to swarf buildup in proximity sensor bracket.',
    rootCause: 'Accumulated metal chip chips bypassed air-blast scraper blade.',
    correctiveActionTaken: 'Flushed swarf, recalibrated inductive sensor air gap to 2.0mm, and tightened gripper finger bolt.',
    breakdownStartedAt: '2026-10-06 09:20',
    repairCompletedAt: '2026-10-06 10:45',
    downtimeHours: 1.4,
    repairCostEstimate: 120,
  },
  {
    id: 'bdk-4',
    ticketNumber: 'BDK-2026-0098',
    assetId: 'ast-5',
    asset: {
      id: 'ast-5',
      assetTag: 'AST-PRS-001',
      assetName: 'Schuler 500-Ton Heavy Stamping Press',
      category: 'HYDRAULIC_PRESS',
      facilityLocation: 'Stamping Hall A',
      criticality: 'CRITICAL_BOTTLENECK',
      status: 'OPERATIONAL',
    },
    reportedBy: 'Kailash S (Operator)',
    assignedTechnician: 'Vikram Singh (Hydraulics Tech)',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    failureCategory: 'SAFETY_LIGHT_CURTAIN_FAULT',
    symptomDescription: 'Keyence safety light curtain muted during stroke descent, tripping emergency clutch stop.',
    rootCause: 'Optical lens blinded by oil mist film.',
    correctiveActionTaken: 'Cleaned optical lens with isopropyl alcohol and replaced pneumatic enclosure positive pressure filter.',
    breakdownStartedAt: '2026-10-05 15:10',
    repairCompletedAt: '2026-10-05 16:30',
    downtimeHours: 1.3,
    repairCostEstimate: 95,
  },
];

export default function BreakdownTicketsPage() {
  const [tickets, setTickets] = useState<BreakdownTicketItem[]>(INITIAL_BREAKDOWNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [assigningTicket, setAssigningTicket] = useState<BreakdownTicketItem | null>(null);
  const [resolvingTicket, setResolvingTicket] = useState<BreakdownTicketItem | null>(null);

  // Report form state
  const [newAssetTag, setNewAssetTag] = useState('AST-CNC-001');
  const [newReporter, setNewReporter] = useState('');
  const [newSeverity, setNewSeverity] = useState<BreakdownSeverity>('CRITICAL');
  const [newCategory, setNewCategory] = useState('SPINDLE_BEARING');
  const [newSymptoms, setNewSymptoms] = useState('');

  // Assign form state
  const [selectedTech, setSelectedTech] = useState('Anand Kumar (Sr. Mechatronics Eng)');

  // Resolve form state
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [confirmedDowntime, setConfirmedDowntime] = useState('2.5');
  const [repairCost, setRepairCost] = useState('350');
  const [resolvedByName, setResolvedByName] = useState('Anand Kumar');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.asset?.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.asset?.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.failureCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || t.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleReportBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BreakdownTicketItem = {
      id: `bdk-${Date.now()}`,
      ticketNumber: `BDK-${Date.now().toString().slice(-6)}`,
      assetId: 'ast-selected',
      asset: {
        id: 'ast-selected',
        assetTag: newAssetTag,
        assetName: 'Target Production Machine',
        category: 'CNC_MACHINING',
        facilityLocation: 'Production Plant Bay',
        criticality: 'CRITICAL_BOTTLENECK',
        status: newSeverity === 'CRITICAL' ? 'BREAKDOWN_STOPPAGE' : 'DEGRADED',
      },
      reportedBy: newReporter || 'Floor Operator',
      severity: newSeverity,
      status: 'REPORTED',
      failureCategory: newCategory,
      symptomDescription: newSymptoms,
      breakdownStartedAt: 'Just now',
      downtimeHours: 0.1,
      repairCostEstimate: 0,
    };

    setTickets([created, ...tickets]);
    setIsReportModalOpen(false);
    setNewReporter('');
    setNewSymptoms('');
  };

  const handleAssignTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningTicket) return;

    setTickets(
      tickets.map((t) =>
        t.id === assigningTicket.id
          ? {
              ...t,
              assignedTechnician: selectedTech,
              status: 'UNDER_REPAIR',
            }
          : t
      )
    );
    setAssigningTicket(null);
  };

  const handleResolveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicket) return;

    setTickets(
      tickets.map((t) =>
        t.id === resolvingTicket.id
          ? {
              ...t,
              status: 'RESOLVED',
              rootCause,
              correctiveActionTaken: correctiveAction,
              downtimeHours: parseFloat(confirmedDowntime) || t.downtimeHours,
              repairCostEstimate: parseFloat(repairCost) || t.repairCostEstimate,
              repairCompletedAt: 'Just now',
            }
          : t
      )
    );

    setResolvingTicket(null);
    setRootCause('');
    setCorrectiveAction('');
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
            <AlertOctagon className="h-6 w-6 text-rose-400" />
            Machine Breakdown Ticket Desk &amp; Dispatch Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Emergency machinery stoppage logging, technician task dispatch board, real-time downtime accumulation, and root cause resolution.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Report Unexpected Breakdown
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Breakdowns</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertOctagon className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-400 font-mono">
              {tickets.filter((t) => t.status !== 'RESOLVED' && t.status !== 'VERIFIED').length} Stoppages
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">1 Critical, 1 Moderate</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Downtime Elapsed</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">10.3 hrs</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-300">Across 2 ongoing repair incidents</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Field Tech Response Time</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">4.2 min</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400">Avg alert-to-floor arrival</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Resolved This Week</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              {tickets.filter((t) => t.status === 'RESOLVED').length} Tickets
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400">Restored to full production</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ticket #, asset tag, reporter, or failure symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0b0f19] border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="UNDER_REPAIR">Under Repair</option>
            <option value="WAITING_FOR_PARTS">Waiting For Parts</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="MODERATE">Moderate</option>
            <option value="MINOR">Minor</option>
          </select>
        </div>
      </div>

      {/* Breakdown Tickets Table */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white">Breakdown Ticket Desk &amp; Field Dispatch</h2>
            <span className="text-xs text-slate-500 font-mono">({filteredTickets.length} tickets)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0f19] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket # &amp; Asset</th>
                <th className="py-3 px-4">Failure Symptoms &amp; Root Cause</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Downtime &amp; Start Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Tech</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white flex items-center gap-1.5">
                      <AlertOctagon className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                      {t.ticketNumber}
                    </div>
                    <div className="font-medium text-slate-200 text-[11px] mt-0.5">{t.asset?.assetTag} - {t.asset?.assetName}</div>
                    <div className="text-[10px] text-slate-400">{t.asset?.facilityLocation}</div>
                  </td>

                  <td className="py-3 px-4 max-w-sm">
                    <div className="font-medium text-slate-200">{t.failureCategory}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{t.symptomDescription}</div>
                    {t.rootCause && (
                      <div className="text-[10px] text-emerald-400 font-mono mt-1 p-1 bg-emerald-950/40 rounded border border-emerald-500/20">
                        Root Cause: {t.rootCause}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        t.severity === 'CRITICAL'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          : t.severity === 'MODERATE'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {t.severity}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="font-semibold text-white">{t.downtimeHours} hrs downtime</div>
                    <div className="text-[10px] text-slate-500">Started: {t.breakdownStartedAt}</div>
                  </td>

                  <td className="py-3 px-4">
                    {t.status === 'UNDER_REPAIR' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit animate-pulse">
                        <Wrench className="h-3 w-3" /> Under Repair
                      </span>
                    )}
                    {t.status === 'WAITING_FOR_PARTS' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <Clock className="h-3 w-3" /> Awaiting Parts
                      </span>
                    )}
                    {t.status === 'REPORTED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-500/30 flex items-center gap-1 w-fit">
                        <AlertTriangle className="h-3 w-3" /> Reported
                      </span>
                    )}
                    {t.status === 'RESOLVED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" /> Resolved
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200">{t.assignedTechnician || 'Unassigned'}</div>
                    <div className="text-[10px] text-slate-500">By: {t.reportedBy}</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!t.assignedTechnician && t.status !== 'RESOLVED' && (
                        <button
                          onClick={() => setAssigningTicket(t)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                        >
                          Assign Tech
                        </button>
                      )}
                      {t.status !== 'RESOLVED' && (
                        <button
                          onClick={() => setResolvingTicket(t)}
                          className="px-2.5 py-1 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 border border-rose-600/30 text-[11px] font-medium transition-colors"
                        >
                          Resolve Breakdown
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Breakdown Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-rose-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <AlertOctagon className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Report Unexpected Machinery Breakdown</h3>
                <p className="text-xs text-rose-400">Trigger immediate shop floor dispatch alert</p>
              </div>
            </div>

            <form onSubmit={handleReportBreakdown} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Asset Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AST-CNC-001"
                    value={newAssetTag}
                    onChange={(e) => setNewAssetTag(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as BreakdownSeverity)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="CRITICAL">CRITICAL (Line Stoppage)</option>
                    <option value="MODERATE">MODERATE (Degraded / Leak)</option>
                    <option value="MINOR">MINOR (Alarm / Jitter)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Failure Subsystem / Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="SPINDLE_BEARING">SPINDLE_BEARING</option>
                    <option value="HYDRAULIC_SEAL_LEAK">HYDRAULIC_SEAL_LEAK</option>
                    <option value="SERVO_MOTOR_DRIVE">SERVO_MOTOR_DRIVE</option>
                    <option value="TOOL_CHANGER_MECHANISM">TOOL_CHANGER_MECHANISM</option>
                    <option value="SAFETY_INTERLOCK">SAFETY_INTERLOCK</option>
                    <option value="COOLANT_PUMP">COOLANT_PUMP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Reported By</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karthik Raja (Line Lead)"
                    value={newReporter}
                    onChange={(e) => setNewReporter(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Observed Symptoms &amp; Fault Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe abnormal sounds, smoke, vibration, pressure drop, or PLC alarms..."
                  value={newSymptoms}
                  onChange={(e) => setNewSymptoms(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
                >
                  Dispatch Incident Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Tech Modal */}
      {assigningTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setAssigningTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Assign Maintenance Engineer</h3>
                <p className="text-xs text-slate-400 font-mono">{assigningTicket.ticketNumber}</p>
              </div>
            </div>

            <form onSubmit={handleAssignTechnician} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select On-Duty Technician</label>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Anand Kumar (Sr. Mechatronics Eng)">Anand Kumar (Sr. Mechatronics Eng - Bay 3)</option>
                  <option value="Vikram Singh (Hydraulics Tech)">Vikram Singh (Hydraulics Tech - Stamping)</option>
                  <option value="Sunil Rao (Robotics Specialist)">Sunil Rao (Robotics Specialist - Alpha)</option>
                  <option value="Praveen Nair (Utility Tech)">Praveen Nair (Utility Tech - Plant)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssigningTicket(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Breakdown Modal */}
      {resolvingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-emerald-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setResolvingTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Resolve Breakdown &amp; Restore Machine</h3>
                <p className="text-xs text-emerald-400 font-mono">{resolvingTicket.ticketNumber} - {resolvingTicket.asset?.assetTag}</p>
              </div>
            </div>

            <form onSubmit={handleResolveTicket} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                <div className="font-semibold text-white">{resolvingTicket.asset?.assetName}</div>
                <div className="text-[11px] text-slate-400 mt-1">Issue: {resolvingTicket.symptomDescription}</div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Identified Root Cause (5-Why Analysis)</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Root cause identified during teardown..."
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Corrective Action Taken</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe component replaced, adjustment made, or settings updated..."
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Downtime (Hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={confirmedDowntime}
                    onChange={(e) => setConfirmedDowntime(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={repairCost}
                    onChange={(e) => setRepairCost(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                >
                  Mark Restored &amp; Return to Production
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

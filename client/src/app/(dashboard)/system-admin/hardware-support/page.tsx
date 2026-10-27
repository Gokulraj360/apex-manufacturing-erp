'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Headphones,
  Printer,
  Terminal,
  Scale,
  Wifi,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Clock,
  UserCheck,
  Wrench,
  Activity,
  Layers,
  Radio,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  SupportTicketItem,
  SupportTicketPriority,
  SupportTicketStatus,
} from '@/types/system-admin';

const INITIAL_TICKETS: SupportTicketItem[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-2026-0891',
    title: 'Dispatch Thermal Printer Head Overheating & Ribbon Jam',
    description: 'TSC TTP-244 Pro printer at Dispatch Station 01 giving flashing red indicator. Packing slip barcode lines are misaligned.',
    category: 'BARCODE_PRINTER',
    priority: 'HIGH',
    status: 'IN_INVESTIGATION',
    reportedByName: 'Suresh Kumar (Dispatch Lead)',
    assignedToEngineer: 'David Chen (Hardware L2)',
    affectedLocation: 'Dispatch Packing Bay 01',
    createdAt: '2026-10-07 15:30',
    updatedAt: '2026-10-07 16:00',
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TKT-2026-0892',
    title: 'Shop Floor Operator Touch Terminal #4 Screen Unresponsive',
    description: 'Ruggedized industrial panel PC at Assembly Cell B-2 touchscreen digitizer unresponsive after coolant splash. Keyboard entry works.',
    category: 'HARDWARE_TERMINAL',
    priority: 'CRITICAL',
    status: 'OPEN',
    reportedByName: 'Ramesh Patel (Line Supervisor)',
    affectedLocation: 'Assembly Cell B-2',
    createdAt: '2026-10-07 16:15',
    updatedAt: '2026-10-07 16:15',
  },
  {
    id: 'tkt-3',
    ticketNumber: 'TKT-2026-0890',
    title: 'Weighbridge Digital Indicator RS-232 Jitter',
    description: 'Modbus serial adapter experiencing intermittent CRC checksum drops during raw material lorry tare weight acquisition.',
    category: 'WEIGHING_SCALE',
    priority: 'MEDIUM',
    status: 'IN_INVESTIGATION',
    reportedByName: 'Vikram Singh (Gate Officer)',
    assignedToEngineer: 'Priya Sharma (IoT Specialist)',
    affectedLocation: 'North Gate 01 Weighbridge Pit',
    createdAt: '2026-10-07 13:45',
    updatedAt: '2026-10-07 14:10',
  },
  {
    id: 'tkt-4',
    ticketNumber: 'TKT-2026-0888',
    title: 'Warehouse Aisle 4 Handheld GS1 Scanner Pairing Loss',
    description: 'Zebra TC26 RF terminal unpairing from dock access point every 15 minutes during shift turnover.',
    category: 'BARCODE_SCANNER',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    reportedByName: 'Anil Gupta (Warehouse Supervisor)',
    assignedToEngineer: 'David Chen (Hardware L2)',
    affectedLocation: 'Warehouse Aisle 4',
    resolutionNotes: 'Updated Wi-Fi 802.11r fast-roaming profile on the terminal and re-enrolled with ERP MDM.',
    resolvedAt: '2026-10-07 12:20',
    createdAt: '2026-10-07 10:10',
    updatedAt: '2026-10-07 12:20',
  },
  {
    id: 'tkt-5',
    ticketNumber: 'TKT-2026-0885',
    title: 'CNC Line 01 Industrial Ethernet Switch Port Flapping',
    description: 'Port 7 on Moxa industrial switch cycling link speed from 100Mbps down to 10Mbps due to loose Cat6 patch cord.',
    category: 'NETWORK_CONNECTIVITY',
    priority: 'HIGH',
    status: 'RESOLVED',
    reportedByName: 'Automated Network Daemon',
    assignedToEngineer: 'Arun Varma (Infrastructure Admin)',
    affectedLocation: 'CNC Milling Line 01 Sub-Panel',
    resolutionNotes: 'Replaced crimped RJ45 patch cable with shielded Cat6A industrial cable.',
    resolvedAt: '2026-10-06 18:40',
    createdAt: '2026-10-06 17:30',
    updatedAt: '2026-10-06 18:40',
  },
];

export default function HardwareSupportPage() {
  const [tickets, setTickets] = useState<SupportTicketItem[]>(INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resolvingTicket, setResolvingTicket] = useState<SupportTicketItem | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('HARDWARE_TERMINAL');
  const [newPriority, setNewPriority] = useState<SupportTicketPriority>('MEDIUM');
  const [newLocation, setNewLocation] = useState('');
  const [newReportedBy, setNewReportedBy] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Resolution modal state
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [engineerName, setEngineerName] = useState('David Chen (Hardware L2)');

  // Filtered
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.affectedLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reportedByName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: SupportTicketItem = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-0${Math.floor(893 + Math.random() * 50)}`,
      title: newTitle,
      description: newDescription,
      category: newCategory,
      priority: newPriority,
      status: 'OPEN',
      reportedByName: newReportedBy || 'Floor Operator',
      affectedLocation: newLocation || 'Plant Main Floor',
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };

    setTickets([newRecord, ...tickets]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setNewReportedBy('');
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
              assignedToEngineer: engineerName,
              resolutionNotes: resolutionNotes,
              resolvedAt: 'Just now',
              updatedAt: 'Just now',
            }
          : t
      )
    );

    setResolvingTicket(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/system-admin"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Infrastructure Hub
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <Headphones className="h-6 w-6 text-rose-400" />
            Shop Floor Hardware Helpdesk &amp; Technical Support
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Rapid MTTR incident ticketing, touch terminal diagnostics, thermal printer dispatch calibration, and telemetry network health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Raise Support Ticket
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Open Hardware Tickets</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">
              {tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_INVESTIGATION').length}
            </span>
            <span className="text-xs text-rose-400 font-medium">1 Critical</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Average response time: 6.2 mins</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mean Time to Resolve</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">24.5 min</span>
            <span className="text-xs text-emerald-400 font-medium">SLA Compliant</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Target SLA threshold: &lt; 45 mins</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hardware Availability</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">99.8%</span>
            <span className="text-xs text-slate-400">60 Terminals</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400">59 / 60 devices functioning</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resolved This Month</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Wrench className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">42</span>
            <span className="text-xs text-slate-400">Total closed</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-300">Zero recurring hardware faults</div>
        </div>
      </div>

      {/* Hardware Subsystem Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-slate-800 flex items-center justify-center">
              <Terminal className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Touch Terminals</div>
              <div className="text-[11px] text-slate-400">11 Online / 1 Fault</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/30">
            Warning
          </span>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-slate-800 flex items-center justify-center">
              <Printer className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Barcode Printers</div>
              <div className="text-[11px] text-slate-400">5 Ready / 1 Jammed</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/30">
            Action Req.
          </span>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-slate-800 flex items-center justify-center">
              <Scale className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Weighbridge Scales</div>
              <div className="text-[11px] text-slate-400">6 Calibrated / 1 Jitter</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            Calibrated
          </span>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-slate-800 flex items-center justify-center">
              <Wifi className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Industrial Wi-Fi APs</div>
              <div className="text-[11px] text-slate-400">8 / 8 Mesh Mesh Online</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            Optimal
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tickets by number, hardware issue, reporter, or shop floor bay..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
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
            <option value="OPEN">Open (Unresolved)</option>
            <option value="IN_INVESTIGATION">In Investigation</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Categories</option>
            <option value="HARDWARE_TERMINAL">Touch Terminals</option>
            <option value="BARCODE_PRINTER">Barcode Printers</option>
            <option value="WEIGHING_SCALE">Weighing Scales</option>
            <option value="BARCODE_SCANNER">Handheld Scanners</option>
            <option value="NETWORK_CONNECTIVITY">Network Connectivity</option>
          </select>
        </div>
      </div>

      {/* Ticket Queue Table */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white">Technical Support Queue &amp; Dispatch</h2>
            <span className="text-xs text-slate-500 font-mono">({filteredTickets.length} tickets)</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            On-Call Engineer: David Chen (Ext. #402)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket # &amp; Subsystem</th>
                <th className="py-3 px-4">Issue Description &amp; Resolution</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reported By / Engineer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <div className="font-semibold text-white">{t.ticketNumber}</div>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700">
                      {t.category.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-sm">
                    <div className="font-medium text-slate-200">{t.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{t.description}</div>
                    {t.resolutionNotes && (
                      <div className="text-[10px] text-emerald-400 font-mono mt-1.5 p-1 bg-emerald-950/40 rounded border border-emerald-500/20">
                        Resolved: {t.resolutionNotes}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {t.affectedLocation}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        t.priority === 'CRITICAL'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          : t.priority === 'HIGH'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : t.priority === 'MEDIUM'
                          ? 'bg-yellow-950/80 text-yellow-300 border border-yellow-500/30'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {t.status === 'RESOLVED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" /> Resolved
                      </span>
                    )}
                    {t.status === 'IN_INVESTIGATION' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950/80 text-indigo-400 border border-indigo-500/30 flex items-center gap-1 w-fit">
                        <Activity className="h-3 w-3" /> Assigned L2
                      </span>
                    )}
                    {t.status === 'OPEN' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <Clock className="h-3 w-3" /> Open
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-700 dark:text-slate-300 font-medium">{t.reportedByName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <UserCheck className="h-3 w-3 text-rose-400" />
                      {t.assignedToEngineer || 'Unassigned'}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {t.status !== 'RESOLVED' && (
                      <button
                        onClick={() => setResolvingTicket(t)}
                        className="px-2.5 py-1 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 border border-rose-600/30 text-[11px] font-medium transition-colors"
                      >
                        Resolve Ticket
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raise Support Ticket Modal */}
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
              <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <Headphones className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Raise Hardware Support Ticket</h3>
                <p className="text-xs text-slate-400">Dispatch field technician to resolve plant terminal fault</p>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Issue Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weighbridge RS-232 Port Dropout"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Hardware Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="HARDWARE_TERMINAL">Shop Floor Touch Terminal</option>
                    <option value="BARCODE_PRINTER">Barcode / Packing Printer</option>
                    <option value="WEIGHING_SCALE">Weighbridge / Bench Scale</option>
                    <option value="BARCODE_SCANNER">Handheld Wireless Scanner</option>
                    <option value="NETWORK_CONNECTIVITY">Industrial Switch / Wi-Fi AP</option>
                    <option value="IOT_SENSOR">IoT Vibration / Temp Sensor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as SupportTicketPriority)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="CRITICAL">CRITICAL (Line Stoppage)</option>
                    <option value="HIGH">HIGH (Degraded Output)</option>
                    <option value="MEDIUM">MEDIUM (Minor Glitch)</option>
                    <option value="LOW">LOW (Routine Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Affected Bay / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Assembly Line 02, Station 4"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Reported By</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel (Line Lead)"
                    value={newReportedBy}
                    onChange={(e) => setNewReportedBy(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Detailed Symptoms &amp; Error Messages</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide error codes, LED indicators, or physical conditions observed..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                ></textarea>
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
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
                >
                  Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Support Ticket Modal */}
      {resolvingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
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
                <h3 className="text-base font-semibold text-white">Resolve Support Ticket</h3>
                <p className="text-xs text-slate-400 font-mono">{resolvingTicket.ticketNumber}</p>
              </div>
            </div>

            <form onSubmit={handleResolveTicket} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                <div className="font-semibold text-white">{resolvingTicket.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">{resolvingTicket.description}</div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Attending Engineer</label>
                <input
                  type="text"
                  required
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Resolution &amp; Corrective Action Taken</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail repairs made (e.g., replaced ribbon, recabled sensor, updated firmware)..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

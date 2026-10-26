'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  FileText,
  Clock,
  ArrowUpRight,
  Database,
  Sliders,
  Sparkles,
  TrendingUp,
  X,
  ChevronRight,
  Send,
  Building2,
  Boxes,
  Cpu,
  BadgeCheck,
} from 'lucide-react';
import { ALL_ROLES, RoleDefinition } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// Human-friendly title mapper for common industrial multi-franchise manufacturing ERP slugs
const SLUG_TITLE_MAP: Record<string, { title: string; desc: string; badge: string }> = {
  inventory: {
    title: 'Small Parts Storage Bins & Safety Stock',
    desc: 'Clean storage tracking for critical microcontrollers, precision components, and subassemblies.',
    badge: 'Parts Bins',
  },
  'vendor-bills': {
    title: 'Supplier Bills & Invoice Match',
    desc: 'Check supplier bills against Material Purchase Requests, Received Goods Slips, and invoices.',
    badge: 'Bill Checking',
  },
  invoices: {
    title: 'Customer Bills & Delivery Slips',
    desc: 'Customer tax invoices, delivery slips, and payment records.',
    badge: 'Customer Bills',
  },
  'tax-reports': {
    title: 'Tax & GST Filing Reports',
    desc: 'Tax credit reconciliation, tax rate records, and stored warehouse documents.',
    badge: 'Tax Reports',
  },
  employees: {
    title: 'Assembly Line Workers & Staff Records',
    desc: 'Safety training records, cleanroom clothes log, shift rosters, and work safety checks.',
    badge: 'Factory Staff',
  },
  attendance: {
    title: 'Shift Attendance & Gate Check-In',
    desc: 'Worker fingerprint check-ins, safety wristband checks, extra hours calculation, and leaves.',
    badge: 'Shift Attendance',
  },
  payroll: {
    title: 'Staff Monthly Salaries & Wage Processing',
    desc: 'Take-home salary calculation, shift allowances, provident fund, and bank payouts.',
    badge: 'Salaries',
  },
  'work-orders': {
    title: 'Line 2: Core Subassembly & Component Bonding',
    desc: 'High-precision subassembly, mechanical housing alignment, and automated bonding.',
    badge: 'Subassembly',
  },
  batches: {
    title: 'Line 3: Sensor Calibration & Optical Alignment',
    desc: 'Adjusting optical sensors, precision telemetry calibration, and response accuracy tests.',
    badge: 'Sensor Calibration',
  },
  'in-process': {
    title: 'In-Line Tolerance & Quality Diagnostics Check',
    desc: 'Environmental cleanroom checks, surface finish inspection, and automated quality diagnostics.',
    badge: 'Quality Station',
  },
  final: {
    title: 'Pre-Dispatch Quality Stamp & Outbound Seals',
    desc: 'Matching finished product serial numbers, tamper-evident seals, and final packing sign-off.',
    badge: 'Pre-Dispatch Check',
  },
  ncr: {
    title: 'Quality Issue & Defect Damage Reports',
    desc: 'Fixing circuit board soldering errors, structural deviations, and drop test stress fractures.',
    badge: 'Defect Reports',
  },
  deployments: {
    title: 'Line 1-6 Worker Station Placement',
    desc: 'Worker allocation across Board Assembly, Subassembly, Sensor Calibration, and Packaging.',
    badge: 'Worker Stations',
  },
  outputs: {
    title: 'Shift Daily Target Output (7,600 Units)',
    desc: 'Hourly assembly speed, machine stop times, and First-Time Quality Pass Rate.',
    badge: 'Shift Target',
  },
  orders: {
    title: 'External Subassembly Job-Work',
    desc: 'Outside contractor circuit cable assembly, sent material slips, and parts loss checks.',
    badge: 'Outside Work',
  },
  challans: {
    title: 'Sent Material Delivery Slips & Transit',
    desc: 'Material delivery slips, sent goods tracking, and return parts check.',
    badge: 'Delivery Slips',
  },
  operations: {
    title: 'Robotic Circuit Board Machine Work',
    desc: 'Robotic part placing speed, soldering oven heating checks, and clean nitrogen monitoring.',
    badge: 'Board Assembly',
  },
  'audit-logs': {
    title: 'Activity Logs & System Audit Trails',
    desc: 'Safe serial number records, system logins, and price change activity logs.',
    badge: 'Activity Logs',
  },
};

interface RecordItem {
  id: string;
  refCode: string;
  title: string;
  category: string;
  assignedTo: string;
  status: 'COMPLETED' | 'IN_TRANSIT' | 'PENDING_REVIEW' | 'FLAGGED';
  timestamp: string;
  metricValue: string;
}

interface GenericModuleWorkspaceProps {
  role?: string;
  slug?: string | string[];
}

export function GenericModuleWorkspace({ role, slug }: GenericModuleWorkspaceProps) {
  const { session, activeRole: contextRole } = useAuth();

  // Normalize slug segments
  const slugSegments = useMemo(() => {
    if (!slug) return [];
    if (Array.isArray(slug)) return slug;
    return slug.split('/').filter(Boolean);
  }, [slug]);

  // Determine current active role definition
  const roleDef: RoleDefinition = useMemo(() => {
    if (role) {
      const match = ALL_ROLES.find((r) => r.id === role);
      if (match) return match;
    }
    return contextRole || ALL_ROLES[0];
  }, [role, contextRole]);

  // Determine primary key name for module title
  const lastSlug = slugSegments[slugSegments.length - 1] || 'workspace';
  const customInfo = SLUG_TITLE_MAP[lastSlug];

  const moduleTitle = customInfo
    ? customInfo.title
    : `${lastSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')} Module Workspace`;

  const moduleDescription = customInfo
    ? customInfo.desc
    : `Connected industrial workspace module for ${roleDef.name}. Real-time operational data stream with automated audit logging.`;

  const moduleBadge = customInfo ? customInfo.badge : `${roleDef.badge} Subsystem`;

  // UI state
  const [activeTab, setActiveTab] = useState<'records' | 'telemetry' | 'audit'>('records');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // New record form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newStatus, setNewStatus] = useState<'COMPLETED' | 'IN_TRANSIT' | 'PENDING_REVIEW'>('PENDING_REVIEW');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Mock initial dataset
  const [records, setRecords] = useState<RecordItem[]>([
    {
      id: 'REC-901',
      refCode: `${lastSlug.toUpperCase().slice(0, 4)}-2026-001`,
      title: `Batch Process Routing #${lastSlug.slice(0, 3)}-884`,
      category: 'Primary Stream',
      assignedTo: session?.username || roleDef.defaultUsername,
      status: 'COMPLETED',
      timestamp: '10 mins ago',
      metricValue: '99.4% Spec',
    },
    {
      id: 'REC-902',
      refCode: `${lastSlug.toUpperCase().slice(0, 4)}-2026-002`,
      title: `Shift Operation Sign-off & Audit Tier`,
      category: 'Workstation 02',
      assignedTo: 'operator_lead',
      status: 'PENDING_REVIEW',
      timestamp: '28 mins ago',
      metricValue: 'Awaiting Sign',
    },
    {
      id: 'REC-903',
      refCode: `${lastSlug.toUpperCase().slice(0, 4)}-2026-003`,
      title: `Automated Gateway Reconciliation Batch`,
      category: 'Line Assembly B',
      assignedTo: 'system_daemon',
      status: 'IN_TRANSIT',
      timestamp: '1 hour ago',
      metricValue: 'In Transit',
    },
    {
      id: 'REC-904',
      refCode: `${lastSlug.toUpperCase().slice(0, 4)}-2026-004`,
      title: `Parameter Variance Tolerancing Check`,
      category: 'Quality Station 01',
      assignedTo: 'quality_lead',
      status: 'FLAGGED',
      timestamp: '2 hours ago',
      metricValue: 'Delta +0.42%',
    },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSuccessBanner('Data refreshed from Central Database Node #01.');
      setTimeout(() => setSuccessBanner(null), 3000);
    }, 600);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRecord: RecordItem = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      refCode: `${lastSlug.toUpperCase().slice(0, 4)}-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      category: newCategory.trim() || 'General Operations',
      assignedTo: session?.username || roleDef.defaultUsername,
      status: newStatus,
      timestamp: 'Just now',
      metricValue: 'Active Record',
    };

    setRecords([newRecord, ...records]);
    setNewTitle('');
    setNewCategory('');
    setShowNewModal(false);
    setSuccessBanner(`Record ${newRecord.refCode} successfully created and broadcast to node.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, filterStatus]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Breadcrumbs Trail */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href={`/dashboard/${roleDef.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span>{roleDef.department}</span>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href={`/dashboard/${roleDef.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {roleDef.name}
        </Link>
        {slugSegments.map((seg, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className={idx === slugSegments.length - 1 ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
              {seg.replace(/-/g, ' ')}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* 2. Success Banner Notification */}
      {successBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 3. Hero Header Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl relative overflow-hidden shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                {moduleBadge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                AREA: HUB-01
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 ml-2 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live System Connected
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              {moduleTitle}
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              {moduleDescription}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh Workspace"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin text-blue-600 dark:text-blue-400')} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Entry</span>
            </button>
          </div>
        </div>

        {/* Operational Context Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Signed in as:</span>
            <strong className="text-slate-800 dark:text-slate-200 font-mono">
              {session?.username || roleDef.defaultUsername}
            </strong>
            <span className="text-slate-400">({roleDef.name})</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Server Hub: <strong className="text-slate-700 dark:text-slate-300">Cluster APEX-PRD-01</strong></span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Speed: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">12ms</strong></span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Security Check: <strong className="text-slate-600 dark:text-slate-400">Verified Safe</strong></span>
          </div>
        </div>
      </div>

      {/* 4. Operational KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Total Active Entries</span>
            <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-2">{records.length + 18}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+12% volume this shift</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>On-Time Completion Rate</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-2">99.7%</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Within factory targets</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Urgent Approvals Needed</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-2">
            {records.filter((r) => r.status === 'PENDING_REVIEW').length + 2}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Needs manager sign-off</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Staff on Shift</span>
            <Activity className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-2">24 Workers</div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Shift attendance verified</div>
        </div>
      </div>

      {/* 5. Navigation Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('records')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2',
            activeTab === 'records'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60',
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Records & Task List ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2',
            activeTab === 'telemetry'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60',
          )}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Factory Rules & Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2',
            activeTab === 'audit'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60',
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Activity Logs & History</span>
        </button>
      </div>

      {/* 6. Tab Content: Records & Data Grid */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by code, title, or operator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="FLAGGED">Flagged</option>
              </select>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('ALL');
                }}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Interactive Table Grid */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950/40 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Tracking Code</th>
                    <th className="px-5 py-3.5">Work Item / Description</th>
                    <th className="px-5 py-3.5">Factory Section</th>
                    <th className="px-5 py-3.5">Assigned Staff</th>
                    <th className="px-5 py-3.5">Status Reading</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                        No records match the current filter or query.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-medium text-blue-600 dark:text-blue-400">
                          {item.refCode}
                        </td>
                        <td className="px-5 py-3.5 text-slate-900 dark:text-white font-medium">
                          {item.title}
                          <div className="text-[10px] text-slate-400 font-normal">{item.timestamp}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                          {item.category}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-500 dark:text-slate-400">
                          {item.assignedTo}
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-mono">
                          {item.metricValue}
                        </td>
                        <td className="px-5 py-3.5">
                          {item.status === 'COMPLETED' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              Completed
                            </span>
                          )}
                          {item.status === 'PENDING_REVIEW' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              Pending Review
                            </span>
                          )}
                          {item.status === 'IN_TRANSIT' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                              In Transit
                            </span>
                          )}
                          {item.status === 'FLAGGED' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                              Flagged
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setSuccessBanner(`Verified record ${item.refCode} sign-off.`);
                              setTimeout(() => setSuccessBanner(null), 3000);
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors text-[11px]"
                          >
                            Sign Off
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab Content: Automation & Rules Engine */}
      {activeTab === 'telemetry' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Sliders className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Factory Automatic Rules</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Automatic factory rules running continuously for {moduleTitle}.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">Automatic Part Quality & Error Check</div>
                <div className="text-[11px] text-slate-500">Warn workers automatically if defects or size differences exceed 0.5%</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">Barcode & Box Sticker Check</div>
                <div className="text-[11px] text-slate-500">Check part storage bin before moving materials into the warehouse</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">Hide Parts Purchase Cost from Non-Purchasing Staff</div>
                <div className="text-[11px] text-slate-500">Only Purchasing, Finance, and Top Management can see part purchase costs</div>
              </div>
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                ENFORCED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8. Tab Content: Audit Log Trail */}
      {activeTab === 'audit' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Activity Logs & System Checks</span>
          </div>

          <div className="space-y-2 pt-2">
            {[
              { event: 'User Signed In Successfully', user: session?.username || 'super_admin', time: '5 mins ago', status: 'OK' },
              { event: 'Factory Floor Terminal Synced with Main Server', user: 'system_daemon', time: '14 mins ago', status: 'OK' },
              { event: 'Assembly Line Machine Signal Checked', user: 'edge_sensor_01', time: '22 mins ago', status: 'OK' },
              { event: 'User Role & Price Access Checked', user: session?.username || 'super_admin', time: '40 mins ago', status: 'PASSED' },
            ].map((entry, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-900 dark:text-slate-200 font-semibold">{entry.event}</div>
                  <div className="text-[10px] text-slate-400">Staff: {entry.user} • {entry.time}</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Create Record Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Add New Entry</span>
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Title & Work Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Batch Inspection Routing #904"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Department or Assembly Station</label>
                <input
                  type="text"
                  placeholder="e.g. Zone A Rack 01 / Line Assembly"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

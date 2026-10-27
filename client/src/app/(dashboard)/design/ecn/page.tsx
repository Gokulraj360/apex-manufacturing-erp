'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Scroll,
  Layers,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  EngineeringChangeNoticeItem,
  ECNChangeReason,
  ECNPriority,
  ECNStatus,
} from '@/types/design';

const INITIAL_ECNS: EngineeringChangeNoticeItem[] = [
  {
    id: 'ecn-1',
    ecnNumber: 'ECN-2026-0081',
    title: 'Spindle Housing Bearing Pocket Tolerance Tightening',
    reasonForChange: 'DEFECT_FIX',
    priority: 'CRITICAL',
    description: 'Tightened bearing seat diameter bore tolerance from H7 (+0.030mm) to H6 (+0.016mm) to mitigate thermal runout under 12,000 RPM operation.',
    changeScope: 'Machine Bed Casting (DWG-SPN-0104) and Assembly BOM (BOM-2026-0042)',
    status: 'UNDER_REVIEW',
    requestedBy: 'Quality Assurance Lead',
    implementationTargetDate: '2026-03-15T00:00:00Z',
    inventoryDisposition: 'REWORK_IN_SHOP',
    costImpactEstimate: 2400,
    createdAt: '2026-03-02T11:00:00Z',
    updatedAt: '2026-03-04T10:00:00Z',
  },
  {
    id: 'ecn-2',
    ecnNumber: 'ECN-2026-0084',
    title: 'Planetary Gear Pinion Material Substitution to 18CrNiMo7-6',
    reasonForChange: 'MATERIAL_SUBSTITUTION',
    priority: 'HIGH',
    description: 'Substituted core case-hardened alloy to enhance fatigue life beyond 50,000 continuous hours in mining gearboxes.',
    changeScope: 'Sub-Assembly Pinion Gears and Procurement Raw Stock Specs',
    status: 'APPROVED',
    requestedBy: 'Praveen Nair',
    reviewedBy: 'Chief Metallurgist (Dr. Roy)',
    approvedBy: 'VP Engineering (H. Mehta)',
    approvedAt: '2026-03-05T14:00:00Z',
    implementationTargetDate: '2026-03-20T00:00:00Z',
    inventoryDisposition: 'USE_EXISTING_STOCK_FIRST',
    costImpactEstimate: 1200,
    createdAt: '2026-02-26T16:00:00Z',
    updatedAt: '2026-03-05T14:00:00Z',
  },
  {
    id: 'ecn-3',
    ecnNumber: 'ECN-2026-0087',
    title: 'Hydraulic Manifold O-Ring Groove Chamfer Modification',
    reasonForChange: 'DESIGN_OPTIMIZATION',
    priority: 'MEDIUM',
    description: 'Added 0.5mm x 45° lead-in chamfer to port bores to prevent seal pinch damage during shop floor assembly insertion.',
    changeScope: 'Drawing DWG-AERO-0192 and CNC milling toolpath recipe',
    status: 'IMPLEMENTED',
    requestedBy: 'Shop Floor Assembly Lead',
    reviewedBy: 'D. Sen',
    approvedBy: 'H. Mehta',
    approvedAt: '2026-02-25T10:00:00Z',
    implementationTargetDate: '2026-02-28T00:00:00Z',
    inventoryDisposition: 'USE_EXISTING_STOCK_FIRST',
    costImpactEstimate: 450,
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-02-28T16:00:00Z',
  },
  {
    id: 'ecn-4',
    ecnNumber: 'ECN-2026-0091',
    title: 'Tooling Clamping Pull-Stud Supplier Discontinuation',
    reasonForChange: 'SUPPLIER_DISCONTINUATION',
    priority: 'LOW',
    description: 'Previous DIN 69872 pull-stud supplier discontinued batch. Qualified ISO 7388 alternative with identical thread engagement.',
    changeScope: 'BOM Hardware Requisition Item & Supplier Master Directory',
    status: 'SUBMITTED',
    requestedBy: 'Procurement Specialist',
    implementationTargetDate: '2026-03-30T00:00:00Z',
    inventoryDisposition: 'USE_EXISTING_STOCK_FIRST',
    costImpactEstimate: 0,
    createdAt: '2026-03-05T14:30:00Z',
    updatedAt: '2026-03-05T14:30:00Z',
  },
];

export default function EcnWorkflowPage() {
  const [ecns, setEcns] = useState<EngineeringChangeNoticeItem[]>(INITIAL_ECNS);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedEcnForReview, setSelectedEcnForReview] = useState<EngineeringChangeNoticeItem | null>(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    title: '',
    reasonForChange: 'DESIGN_OPTIMIZATION' as ECNChangeReason,
    priority: 'MEDIUM' as ECNPriority,
    description: '',
    changeScope: '',
    requestedBy: 'Design Engineer',
    implementationTargetDate: '2026-03-25',
    inventoryDisposition: 'USE_EXISTING_STOCK_FIRST',
    costImpactEstimate: 1000,
  });

  const [reviewForm, setReviewForm] = useState({
    status: 'APPROVED' as ECNStatus,
    reviewedBy: 'Lead Reviewer',
    approvedBy: 'VP Engineering (H. Mehta)',
    inventoryDisposition: 'USE_EXISTING_STOCK_FIRST',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchEcns = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/design/ecn');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setEcns(data);
        }
      }
    } catch (err) {
      console.warn('API fallback', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEcns();
  }, []);

  const handleCreateECN = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEcn: EngineeringChangeNoticeItem = {
      id: `ecn-${Date.now()}`,
      ecnNumber: `ECN-2026-0${ecns.length + 95}`,
      title: createForm.title,
      reasonForChange: createForm.reasonForChange,
      priority: createForm.priority,
      description: createForm.description,
      changeScope: createForm.changeScope,
      status: 'SUBMITTED',
      requestedBy: createForm.requestedBy,
      implementationTargetDate: new Date(createForm.implementationTargetDate).toISOString(),
      inventoryDisposition: createForm.inventoryDisposition,
      costImpactEstimate: Number(createForm.costImpactEstimate),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/v1/design/ecn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createForm,
          costImpactEstimate: Number(createForm.costImpactEstimate),
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setEcns([newEcn, ...ecns]);
    setShowCreateModal(false);
    setNotification(`Engineering Change Notice [${newEcn.ecnNumber}] submitted for review!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReviewECN = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEcnForReview) return;

    try {
      await fetch(`/api/v1/design/ecn/${selectedEcnForReview.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setEcns((prev) =>
      prev.map((e) =>
        e.id === selectedEcnForReview.id
          ? {
              ...e,
              status: reviewForm.status,
              reviewedBy: reviewForm.reviewedBy,
              approvedBy: reviewForm.approvedBy,
              approvedAt: new Date().toISOString(),
              inventoryDisposition: reviewForm.inventoryDisposition,
            }
          : e,
      ),
    );

    setShowReviewModal(false);
    setNotification(
      `ECN [${selectedEcnForReview.ecnNumber}] status updated to ${reviewForm.status}!`,
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredEcns = ecns.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.ecnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.changeScope.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || e.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const totalCost = ecns.reduce((sum, e) => sum + Number(e.costImpactEstimate || 0), 0);
  const pendingCount = ecns.filter(
    (e) => e.status === 'SUBMITTED' || e.status === 'UNDER_REVIEW',
  ).length;
  const criticalCount = ecns.filter((e) => e.priority === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/design" className="hover:text-violet-600 dark:hover:text-violet-400">
              Design Engineering
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 dark:text-slate-200">Engineering Change Notice (ECN)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-500/10">
              <GitCompare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Engineering Change Notice (ECN) Workflow
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                  {pendingCount} Pending Review
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formal design modifications, alloy substitutions, drawing tolerance updates & existing inventory disposition
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEcns}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-violet-500 dark:text-violet-400' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-xs font-semibold shadow-lg shadow-violet-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Submit New ECN
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Registered ECNs</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{ecns.length} Notices</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Design change audit trail</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-amber-600 dark:text-amber-400 block font-medium">Pending Review Gate</span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-300 mt-1 block">{pendingCount} Active</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Awaiting engineering sign-off</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-rose-600 dark:text-rose-400 block font-medium">Critical Priority</span>
          <span className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1 block">{criticalCount} Urgent</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Defect fixes & tight tolerances</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-medium">Total Cost Impact</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            ${(totalCost / 1000).toFixed(1)}k Est.
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Tooling & rework expenditure</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search ECN code, scope, reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-violet-500/50"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-violet-500/50"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="IMPLEMENTED">Implemented</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* ECNs List */}
      <div className="space-y-4">
        {filteredEcns.map((ecn) => (
          <div
            key={ecn.id}
            className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 hover:border-violet-400 dark:hover:border-violet-500/30 shadow-sm transition space-y-3"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/20 px-2 py-0.5 rounded">
                  {ecn.ecnNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ecn.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {ecn.reasonForChange.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    ecn.priority === 'CRITICAL'
                      ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40'
                      : ecn.priority === 'HIGH'
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {ecn.priority}
                </span>

                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    ecn.status === 'APPROVED' || ecn.status === 'IMPLEMENTED'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                      : ecn.status === 'UNDER_REVIEW'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
                  }`}
                >
                  {ecn.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ecn.description}</p>

            {/* Scope & Disposition */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium block">Scope of Change</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{ecn.changeScope}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium block">
                  Existing Stock Disposition
                </span>
                <span className="text-violet-700 dark:text-violet-300 font-bold font-mono">
                  {ecn.inventoryDisposition?.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium block">Cost Impact Estimate</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  ${ecn.costImpactEstimate?.toLocaleString() || 0}
                </span>
              </div>
            </div>

            {/* Actions & Dates */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span>
                  Requested by: <strong className="text-slate-700 dark:text-slate-400">{ecn.requestedBy}</strong>
                </span>
                {ecn.approvedBy && (
                  <span>
                    Approved by: <strong className="text-emerald-600 dark:text-emerald-400">{ecn.approvedBy}</strong>
                  </span>
                )}
                {ecn.implementationTargetDate && (
                  <span>
                    Target: <strong className="text-slate-700 dark:text-slate-300">{new Date(ecn.implementationTargetDate).toLocaleDateString()}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedEcnForReview(ecn);
                    setReviewForm({
                      status: 'APPROVED',
                      reviewedBy: 'Lead Design Reviewer',
                      approvedBy: 'VP Engineering (H. Mehta)',
                      inventoryDisposition: ecn.inventoryDisposition || 'USE_EXISTING_STOCK_FIRST',
                    });
                    setShowReviewModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 dark:bg-violet-500/10 dark:hover:bg-violet-500/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Review & Sign-Off
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Submit New ECN */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Submit Engineering Change Notice (ECN)
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateECN} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">ECN Title / Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spindle Housing Bearing Pocket Tolerance Tightening"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Reason for Change *</label>
                  <select
                    value={createForm.reasonForChange}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        reasonForChange: e.target.value as ECNChangeReason,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="DESIGN_OPTIMIZATION">Design Optimization</option>
                    <option value="DEFECT_FIX">Defect Fix (Runout/Thermal)</option>
                    <option value="MATERIAL_SUBSTITUTION">Material Substitution</option>
                    <option value="COST_REDUCTION">Cost Reduction</option>
                    <option value="SUPPLIER_DISCONTINUATION">Supplier Discontinuation</option>
                    <option value="CUSTOMER_REQUEST">Customer Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Priority *</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        priority: e.target.value as ECNPriority,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="CRITICAL">Critical (Stop Production)</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Scope of Impacted Components *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Machine Bed Casting (DWG-SPN-0104) and Assembly BOM"
                  value={createForm.changeScope}
                  onChange={(e) => setCreateForm({ ...createForm, changeScope: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Detailed Change Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Technical details of dimensional adjustments or alloy substitutions..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Existing Inventory Disposition</label>
                  <select
                    value={createForm.inventoryDisposition}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, inventoryDisposition: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="USE_EXISTING_STOCK_FIRST">Use Existing Stock First</option>
                    <option value="REWORK_IN_SHOP">Rework in Shop Bay</option>
                    <option value="SCRAP_IMMEDIATELY">Scrap Immediately</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Estimated Cost Impact ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={createForm.costImpactEstimate}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        costImpactEstimate: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  Submit ECN for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Review & Sign-Off ECN */}
      {showReviewModal && selectedEcnForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Engineering Change Review & Authorization
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  {selectedEcnForReview.ecnNumber} • {selectedEcnForReview.title}
                </p>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReviewECN} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Sign-Off Decision *</label>
                  <select
                    value={reviewForm.status}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, status: e.target.value as ECNStatus })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="APPROVED">Approved for Implementation</option>
                    <option value="IMPLEMENTED">Mark as Implemented</option>
                    <option value="UNDER_REVIEW">Hold Under Technical Review</option>
                    <option value="REJECTED">Reject Change Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Inventory Disposition</label>
                  <select
                    value={reviewForm.inventoryDisposition}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, inventoryDisposition: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="USE_EXISTING_STOCK_FIRST">Use Existing Stock First</option>
                    <option value="REWORK_IN_SHOP">Rework in Shop Bay</option>
                    <option value="SCRAP_IMMEDIATELY">Scrap Immediately</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Reviewed By</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.reviewedBy}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, reviewedBy: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Approved By (Authority)</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.approvedBy}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, approvedBy: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Execute Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

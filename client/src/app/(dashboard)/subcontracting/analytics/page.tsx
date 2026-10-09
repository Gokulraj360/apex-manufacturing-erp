'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  FileSpreadsheet,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  ExternalLink,
  Award,
  Clock,
  TrendingUp,
  Percent,
  Sliders,
  Sparkles,
  AlertOctagon,
} from 'lucide-react';
import {
  SubcontractorPerformanceLogItem,
  SubcontractorVendorItem,
} from '@/types/subcontracting';

const MOCK_PERFORMANCE_LOGS: SubcontractorPerformanceLogItem[] = [
  {
    id: 'perf-1',
    vendorId: 'ven-1',
    vendor: {
      id: 'ven-1',
      vendorCode: 'VEN-SC-001',
      companyName: 'Apex Electroplating & Surface Coatings Ltd',
      contactPerson: 'Ramesh Sundaram',
      email: 'ramesh@apexcoatings.internal',
      phone: '+91 98201 12345',
      address: 'Plot 42, Industrial Area Phase II',
      city: 'Pune',
      specializedProcesses: ['ELECTROPLATING', 'ANODIZING'],
      qualityRating: 98.2,
      avgTurnaroundDays: 2.8,
      isActive: true,
    },
    evaluationPeriod: 'Q3 2026 Comprehensive SLA Review',
    totalOrdersEvaluated: 24,
    onTimeDeliveryRate: 97.5,
    avgTurnaroundDays: 2.8,
    rejectionRate: 0.8,
    scrapRate: 1.4,
    compositeScore: 96.2,
    vendorTier: 'Tier 1 (Preferred)',
    evaluatedBy: 'Quality & SCM Governance Panel',
    evaluationDate: '2026-10-01',
  },
  {
    id: 'perf-2',
    vendorId: 'ven-2',
    vendor: {
      id: 'ven-2',
      vendorCode: 'VEN-SC-002',
      companyName: 'Bharat Thermal & Vacuum Heat Treaters',
      contactPerson: 'Sanjay Deshmukh',
      email: 'sanjay@bharatheat.internal',
      phone: '+91 98450 67890',
      address: 'Sector 8, Auto Cluster',
      city: 'Aurangabad',
      specializedProcesses: ['HEAT_TREATMENT'],
      qualityRating: 96.5,
      avgTurnaroundDays: 3.5,
      isActive: true,
    },
    evaluationPeriod: 'Q3 2026 Comprehensive SLA Review',
    totalOrdersEvaluated: 18,
    onTimeDeliveryRate: 94.4,
    avgTurnaroundDays: 3.5,
    rejectionRate: 1.2,
    scrapRate: 1.5,
    compositeScore: 92.1,
    vendorTier: 'Tier 1 (Preferred)',
    evaluatedBy: 'Quality & SCM Governance Panel',
    evaluationDate: '2026-10-01',
  },
  {
    id: 'perf-3',
    vendorId: 'ven-3',
    vendor: {
      id: 'ven-3',
      vendorCode: 'VEN-SC-003',
      companyName: 'Precision Die Castings & Alloys Corp',
      contactPerson: 'Arun Kulkarni',
      email: 'arun@precisiondie.internal',
      phone: '+91 94220 54321',
      address: 'MIDC Chakan Block C',
      city: 'Chakan',
      specializedProcesses: ['DIE_CASTING'],
      qualityRating: 94.8,
      avgTurnaroundDays: 4.2,
      isActive: true,
    },
    evaluationPeriod: 'Q3 2026 Comprehensive SLA Review',
    totalOrdersEvaluated: 12,
    onTimeDeliveryRate: 88.5,
    avgTurnaroundDays: 4.2,
    rejectionRate: 2.1,
    scrapRate: 2.4,
    compositeScore: 84.6,
    vendorTier: 'Tier 2 (Qualified)',
    evaluatedBy: 'Quality & SCM Governance Panel',
    evaluationDate: '2026-10-01',
  },
  {
    id: 'perf-4',
    vendorId: 'ven-4',
    vendor: {
      id: 'ven-4',
      vendorCode: 'VEN-SC-004',
      companyName: 'TechnoCoat Powder Finishers',
      contactPerson: 'Manish Verma',
      email: 'manish@technocoat.internal',
      phone: '+91 97110 33445',
      address: 'Bhosari Industrial Estate',
      city: 'Bhosari',
      specializedProcesses: ['POWDER_COATING'],
      qualityRating: 88.0,
      avgTurnaroundDays: 5.6,
      isActive: true,
    },
    evaluationPeriod: 'September 2026 Monthly Audit',
    totalOrdersEvaluated: 8,
    onTimeDeliveryRate: 75.0,
    avgTurnaroundDays: 5.6,
    rejectionRate: 4.2,
    scrapRate: 3.8,
    compositeScore: 71.4,
    vendorTier: 'Probation / Review',
    evaluatedBy: 'Plant Operations Audit',
    evaluationDate: '2026-10-02',
  },
];

export default function SubcontractorAnalyticsPage() {
  const [logs, setLogs] = useState<SubcontractorPerformanceLogItem[]>(MOCK_PERFORMANCE_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  // Modals
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);

  // New Audit State
  const [newVendorName, setNewVendorName] = useState('Apex Electroplating & Surface Coatings Ltd');
  const [newVendorCode, setNewVendorCode] = useState('VEN-SC-001');
  const [newPeriod, setNewPeriod] = useState('October 2026 Monthly Audit');
  const [newOrdersEvaluated, setNewOrdersEvaluated] = useState('15');
  const [newOnTimeRate, setNewOnTimeRate] = useState('98.0');
  const [newTurnaroundDays, setNewTurnaroundDays] = useState('2.6');
  const [newRejectionRate, setNewRejectionRate] = useState('0.5');
  const [newScrapRate, setNewScrapRate] = useState('1.2');
  const [newAuditor, setNewAuditor] = useState('SCM Governance Lead');

  // Filtering
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.vendor?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.vendor?.vendorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.evaluationPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.vendorTier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = tierFilter === 'ALL' || log.vendorTier.includes(tierFilter);

    return matchesSearch && matchesTier;
  });

  // KPI Calculations
  const avgTurnaround = (logs.reduce((acc, l) => acc + l.avgTurnaroundDays, 0) / (logs.length || 1)).toFixed(1);
  const avgOnTime = (logs.reduce((acc, l) => acc + l.onTimeDeliveryRate, 0) / (logs.length || 1)).toFixed(1);
  const avgRejection = (logs.reduce((acc, l) => acc + l.rejectionRate, 0) / (logs.length || 1)).toFixed(2);
  const avgScrap = (logs.reduce((acc, l) => acc + l.scrapRate, 0) / (logs.length || 1)).toFixed(2);

  const calculateComposite = (onTime: number, rej: number, scrap: number, days: number) => {
    const onTimeScore = onTime * 0.4;
    const qualityScore = Math.max(0, 100 - rej * 12) * 0.3;
    const scrapScore = Math.max(0, 100 - scrap * 10) * 0.2;
    const turnaroundScore = Math.max(0, 100 - days * 10) * 0.1;
    return parseFloat((onTimeScore + qualityScore + scrapScore + turnaroundScore).toFixed(1));
  };

  const getTierFromScore = (score: number) => {
    if (score >= 90) return 'Tier 1 (Preferred)';
    if (score >= 75) return 'Tier 2 (Qualified)';
    return 'Probation / Review';
  };

  const handleCreateEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const ordersCount = parseInt(newOrdersEvaluated, 10) || 1;
    const onTime = parseFloat(newOnTimeRate) || 0;
    const days = parseFloat(newTurnaroundDays) || 0;
    const rej = parseFloat(newRejectionRate) || 0;
    const scrap = parseFloat(newScrapRate) || 0;

    const score = calculateComposite(onTime, rej, scrap, days);
    const tier = getTierFromScore(score);

    const newLogItem: SubcontractorPerformanceLogItem = {
      id: `perf-${Date.now()}`,
      vendorId: `ven-${Date.now()}`,
      vendor: {
        id: `ven-${Date.now()}`,
        vendorCode: newVendorCode,
        companyName: newVendorName,
        contactPerson: 'Lead Account Mgr',
        email: 'contact@vendor.internal',
        phone: '+91 98000 00000',
        address: 'Industrial Zone',
        city: 'Pune',
        specializedProcesses: ['ELECTROPLATING'],
        qualityRating: score,
        avgTurnaroundDays: days,
        isActive: true,
      },
      evaluationPeriod: newPeriod,
      totalOrdersEvaluated: ordersCount,
      onTimeDeliveryRate: onTime,
      avgTurnaroundDays: days,
      rejectionRate: rej,
      scrapRate: scrap,
      compositeScore: score,
      vendorTier: tier,
      evaluatedBy: newAuditor,
      evaluationDate: new Date().toISOString().split('T')[0],
    };

    setLogs([newLogItem, ...logs]);
    setIsEvaluationModalOpen(false);
  };

  const getTierBadge = (tier: string) => {
    if (tier.includes('Tier 1')) {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5" />
          {tier}
        </span>
      );
    }
    if (tier.includes('Tier 2')) {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          {tier}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
        <AlertOctagon className="h-3.5 w-3.5" />
        {tier}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/subcontracting"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Subcontracting Operations Hub
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-teal-400" />
              Subcontractor Vendor Scorecards &amp; SLA Performance Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Multi-dimensional SLA evaluation tracking Turnaround Time (TAT), Quality Rejection Rates, and Material Burning/Scrap Ratios.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEvaluationModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-lg shadow-teal-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Log Performance Audit
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Processing TAT</span>
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-teal-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{avgTurnaround}</span>
            <span className="text-xs text-slate-400">calendar days</span>
          </div>
          <div className="mt-2 text-[11px] text-teal-400">Target SLA threshold: &lt; 4.0 days</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">On-Time Delivery SLA</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{avgOnTime}%</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400">95% contractual minimum target</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Quality Rejections</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Percent className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{avgRejection}%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Allowable defect tolerance: &lt; 2.0%</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Scrap Generation</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Sliders className="h-4 w-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{avgScrap}%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Within statutory GST burning allowance</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a]/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Subcontractor, Code, Period, Tier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Vendor Tier:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="Tier 1">Tier 1 (Preferred &gt;= 90)</option>
            <option value="Tier 2">Tier 2 (Qualified 75-89)</option>
            <option value="Probation">Probation (&lt; 75)</option>
          </select>
        </div>
      </div>

      {/* Vendor Scorecard Grid / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {log.vendor?.companyName}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    ({log.vendor?.vendorCode})
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{log.vendor?.city}</span>
                  <span>•</span>
                  <span>{log.evaluationPeriod}</span>
                </div>
              </div>

              {getTierBadge(log.vendorTier)}
            </div>

            {/* Specialized Processes Tags */}
            <div className="flex flex-wrap gap-1.5">
              {log.vendor?.specializedProcesses.map((proc, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-950/60 text-teal-300 border border-teal-500/20 font-mono"
                >
                  {proc}
                </span>
              ))}
            </div>

            {/* Performance Metric Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Turnaround</span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">
                  {log.avgTurnaroundDays}d
                </span>
                <span className="text-[10px] text-teal-400">Promised: 3.0d</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">On-Time SLA</span>
                <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
                  {log.onTimeDeliveryRate}%
                </span>
                <span className="text-[10px] text-slate-400">{log.totalOrdersEvaluated} orders</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rejection Rate</span>
                <span className="text-base font-bold font-mono text-amber-400 mt-0.5 block">
                  {log.rejectionRate}%
                </span>
                <span className="text-[10px] text-slate-400">QC Defect</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Scrap Rate</span>
                <span className="text-base font-bold font-mono text-purple-400 mt-0.5 block">
                  {log.scrapRate}%
                </span>
                <span className="text-[10px] text-slate-400">Loss %</span>
              </div>
            </div>

            {/* Scorecard Bar & Composite Score */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Composite SLA Compliance Index:</span>
                  <span className="font-mono font-bold text-teal-400">{log.compositeScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      log.compositeScore >= 90
                        ? 'bg-emerald-500'
                        : log.compositeScore >= 75
                        ? 'bg-blue-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, log.compositeScore)}%` }}
                  />
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <span>Auditor: {log.evaluatedBy}</span>
                <div className="text-[10px] text-slate-500">{log.evaluationDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="py-12 text-center text-slate-500 text-sm bg-[#0f172a]/60 border border-slate-800 rounded-xl">
          No vendor scorecards found matching your filters.
        </div>
      )}

      {/* MODAL: Log Performance Audit Evaluation */}
      {isEvaluationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-teal-400" />
                <h3 className="text-base font-semibold text-white">Log Subcontractor SLA Performance Audit</h3>
              </div>
              <button
                onClick={() => setIsEvaluationModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvaluation} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Subcontractor Company <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Vendor Code <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorCode}
                    onChange={(e) => setNewVendorCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Audit Review Period <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    JWOs Evaluated <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={newOrdersEvaluated}
                    onChange={(e) => setNewOrdersEvaluated(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* SLA Metric Inputs */}
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5" />
                  SLA Parameter Inputs
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      On-Time Delivery Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newOnTimeRate}
                      onChange={(e) => setNewOnTimeRate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Avg Turnaround (Days)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newTurnaroundDays}
                      onChange={(e) => setNewTurnaroundDays(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Quality Rejection Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newRejectionRate}
                      onChange={(e) => setNewRejectionRate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Scrap / Burning Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newScrapRate}
                      onChange={(e) => setNewScrapRate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Live Composite Calculation Preview */}
                {(() => {
                  const onTime = parseFloat(newOnTimeRate) || 0;
                  const days = parseFloat(newTurnaroundDays) || 0;
                  const rej = parseFloat(newRejectionRate) || 0;
                  const scrap = parseFloat(newScrapRate) || 0;
                  const score = calculateComposite(onTime, rej, scrap, days);
                  const tier = getTierFromScore(score);

                  return (
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Calculated Composite Score:</span>
                        <span className="font-mono text-teal-400 font-bold text-sm">{score} / 100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Assigned Vendor Tier:</span>
                        <span className="font-semibold text-white">{tier}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Evaluated By (Lead Auditor)
                </label>
                <input
                  type="text"
                  value={newAuditor}
                  onChange={(e) => setNewAuditor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Save Performance Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

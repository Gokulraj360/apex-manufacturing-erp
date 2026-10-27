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
  TrendingUp,
  Percent,
  Sliders,
  DollarSign,
  AlertOctagon,
  ShieldAlert,
  Clock,
  Layers,
  Send,
  ExternalLink,
  Flame,
  Check,
  ChevronRight,
} from 'lucide-react';
import {
  SupplyRiskLogItem,
  RiskCategory,
  RiskSeverity,
  RiskStatus,
} from '@/types/supply-chain';

const INITIAL_RISKS: SupplyRiskLogItem[] = [
  {
    id: 'risk-1',
    riskRefNumber: 'RISK-2026-018',
    itemSku: 'RAW-STL-TUBE-80',
    vendor: {
      id: 'vnd-1',
      vendorCode: 'VND-SUP-001',
      companyName: 'Tata Steel Tubes & Pipes Division',
      tierRating: 'TIER_1_STRATEGIC',
    },
    riskCategory: 'PRICE_VOLATILITY',
    severityLevel: 'HIGH',
    likelihood: 'LIKELY',
    impactDescription: 'Global hot-rolled coil index surged 8.2% impacting Q4 tubing contracts.',
    mitigationPlan: 'Executed 3-month forward volume locking contract with Tata Steel at capped index.',
    status: 'MITIGATION_IN_PROGRESS',
    owner: 'Pooja Kulkarni (Procurement Lead)',
    estimatedFinancialExposure: 42000,
    reportedAt: '2026-10-03',
  },
  {
    id: 'risk-2',
    riskRefNumber: 'RISK-2026-019',
    vendorId: 'vnd-3',
    vendor: {
      id: 'vnd-3',
      vendorCode: 'VND-SUP-003',
      companyName: 'Wacker Silicones & Polymers',
      tierRating: 'TIER_2_PREFERRED',
    },
    itemSku: 'RAW-POL-SEAL-R4',
    riskCategory: 'SINGLE_SOURCE_DEPENDENCY',
    severityLevel: 'MEDIUM',
    likelihood: 'POSSIBLE',
    impactDescription: 'Sole certified vendor for specialized fluorosilicone raw polymer cordage.',
    mitigationPlan: 'Audit second-source validation with Dow Corning underway; sample batch in lab testing.',
    status: 'IDENTIFIED',
    owner: 'Arjun Deshmukh (SCM Specialist)',
    estimatedFinancialExposure: 18500,
    reportedAt: '2026-10-05',
  },
  {
    id: 'risk-3',
    riskRefNumber: 'RISK-2026-015',
    itemSku: 'ELEC-SENS-IO4',
    riskCategory: 'LEAD_TIME_SPIKE',
    severityLevel: 'CRITICAL',
    likelihood: 'ALMOST_CERTAIN',
    impactDescription: 'Microcontroller fab foundry allocation delay extending sensor lead time from 14 to 45 days.',
    mitigationPlan: 'Spot-market component buy for 2,000 ICs and redesigned circuit board revision.',
    status: 'MITIGATION_IN_PROGRESS',
    owner: 'Anil Deshmukh (Production Planning)',
    estimatedFinancialExposure: 55000,
    reportedAt: '2026-09-28',
  },
  {
    id: 'risk-4',
    riskRefNumber: 'RISK-2026-012',
    vendorId: 'vnd-5',
    vendor: {
      id: 'vnd-5',
      vendorCode: 'VND-SUP-005',
      companyName: 'FastenTech Precision Hardware Ltd',
      tierRating: 'TIER_3_TRANSACTIONAL',
    },
    riskCategory: 'LOGISTICS_DISRUPTION',
    severityLevel: 'LOW',
    likelihood: 'REMOTE',
    impactDescription: 'Localized highway maintenance near Bhosari depot causing 24h delivery delay.',
    mitigationPlan: 'Re-routed delivery via alternate state highway feeder.',
    status: 'RESOLVED',
    owner: 'Arjun Deshmukh (SCM Specialist)',
    estimatedFinancialExposure: 3200,
    reportedAt: '2026-09-20',
    resolvedAt: '2026-09-22',
  },
];

export default function SupplyChainAnalyticsPage() {
  const [risks, setRisks] = useState<SupplyRiskLogItem[]>(INITIAL_RISKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<SupplyRiskLogItem | null>(null);

  // New Risk Form State
  const [newRiskNumber, setNewRiskNumber] = useState('');
  const [newSku, setNewSku] = useState('RAW-STL-TUBE-80');
  const [newCategory, setNewCategory] = useState<RiskCategory>('PRICE_VOLATILITY');
  const [newSeverity, setNewSeverity] = useState<RiskSeverity>('MEDIUM');
  const [newLikelihood, setNewLikelihood] = useState('POSSIBLE');
  const [newImpact, setNewImpact] = useState('');
  const [newMitigation, setNewMitigation] = useState('');
  const [newOwner, setNewOwner] = useState('Pooja Kulkarni (Procurement Lead)');
  const [newExposure, setNewExposure] = useState('25000');

  // Update Status Form State
  const [updateStatusVal, setUpdateStatusVal] = useState<RiskStatus>('MITIGATION_IN_PROGRESS');
  const [updateMitigationNotes, setUpdateMitigationNotes] = useState('');

  // Filtering
  const filteredRisks = risks.filter((r) => {
    const matchesSearch =
      r.riskRefNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.impactDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.itemSku && r.itemSku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.vendor?.companyName && r.vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || r.riskCategory === categoryFilter;
    const matchesSeverity = severityFilter === 'ALL' || r.severityLevel === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  // KPI Calculations
  const activeRisks = risks.filter((r) => r.status !== 'RESOLVED');
  const criticalCount = activeRisks.filter((r) => r.severityLevel === 'CRITICAL' || r.severityLevel === 'HIGH').length;
  const totalExposure = activeRisks.reduce((sum, r) => sum + r.estimatedFinancialExposure, 0);

  const handleOpenRiskModal = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setNewRiskNumber(`RISK-2026-${randomSuffix}`);
    setIsRiskModalOpen(true);
  };

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    const newRisk: SupplyRiskLogItem = {
      id: `risk-${Date.now()}`,
      riskRefNumber: newRiskNumber,
      itemSku: newSku,
      riskCategory: newCategory,
      severityLevel: newSeverity,
      likelihood: newLikelihood,
      impactDescription: newImpact,
      mitigationPlan: newMitigation,
      status: 'IDENTIFIED',
      owner: newOwner,
      estimatedFinancialExposure: parseFloat(newExposure) || 0,
      reportedAt: new Date().toISOString().split('T')[0],
    };

    setRisks([newRisk, ...risks]);
    setIsRiskModalOpen(false);
  };

  const handleOpenUpdateModal = (risk: SupplyRiskLogItem) => {
    setSelectedRisk(risk);
    setUpdateStatusVal(risk.status);
    setUpdateMitigationNotes('');
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRisk) return;

    setRisks((prev) =>
      prev.map((r) =>
        r.id === selectedRisk.id
          ? {
              ...r,
              status: updateStatusVal,
              mitigationPlan: updateMitigationNotes
                ? `${r.mitigationPlan} [Update: ${updateMitigationNotes}]`
                : r.mitigationPlan,
              resolvedAt:
                updateStatusVal === 'RESOLVED'
                  ? new Date().toISOString().split('T')[0]
                  : r.resolvedAt,
            }
          : r
      )
    );

    setIsUpdateModalOpen(false);
  };

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">LOW</span>;
      default:
        return <span className="text-xs text-slate-400">{sev}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/supply-chain"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Supply Chain Flow Command
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="h-6 w-6 text-cyan-400" />
              Supply Risk Assessment, Turnover &amp; Cost Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Inventory turnover velocity, lead-time variance tracking, supplier solvency risk radar, and proactive mitigation registry.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenRiskModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Log Supply Risk
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inventory Turnover</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">7.8x</span>
            <span className="text-xs text-emerald-400 font-semibold">Turns/yr</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Industry benchmark: 6.5x</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lead Time Variance</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">&plusmn;1.2d</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-400">Within contractual SLA tolerance</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-rose-500/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-400 uppercase tracking-wider">High &amp; Critical Risks</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <Flame className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{criticalCount}</span>
            <span className="text-xs text-rose-400 font-semibold">Under Active Mitigation</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-300">Total exposure: ${totalExposure.toLocaleString()}</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">YTD Savings Realized</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">$142,500</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Negotiated volume contracts</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Risk #, Impact, SKU, Supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Categories</option>
              <option value="PRICE_VOLATILITY">Price Volatility</option>
              <option value="SINGLE_SOURCE_DEPENDENCY">Single Source</option>
              <option value="LEAD_TIME_SPIKE">Lead Time Spike</option>
              <option value="LOGISTICS_DISRUPTION">Logistics Disruption</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="IDENTIFIED">Identified</option>
              <option value="MITIGATION_IN_PROGRESS">Mitigating</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risks Registry Table */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white">Supply Risk Registry &amp; Mitigation Action Desk</h2>
            <span className="text-xs text-slate-400">({filteredRisks.length} logged events)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Automated Supplier Financial &amp; Geo-Tracking Sentinel
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-medium border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Risk Ref &amp; Date</th>
                <th className="py-3 px-4">Affected SKU / Supplier</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity &amp; Likelihood</th>
                <th className="py-3 px-4">Financial Exposure</th>
                <th className="py-3 px-4">Impact &amp; Mitigation Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-normal">
              {filteredRisks.map((risk) => (
                <tr key={risk.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white font-mono">{risk.riskRefNumber}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{risk.reportedAt}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Owner: {risk.owner}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-cyan-400 font-bold">{risk.itemSku || 'General Supply'}</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {risk.vendor?.companyName || 'Multi-Vendor'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 border border-slate-700">
                      {risk.riskCategory.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {getSeverityBadge(risk.severityLevel)}
                      <div className="text-[10px] text-slate-400">Likelihood: {risk.likelihood}</div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                    ${risk.estimatedFinancialExposure.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="text-slate-200 line-clamp-1 font-medium">{risk.impactDescription}</div>
                    <div className="text-[11px] text-cyan-300 line-clamp-1 mt-0.5">
                      Action: {risk.mitigationPlan}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {risk.status === 'IDENTIFIED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        IDENTIFIED
                      </span>
                    )}
                    {risk.status === 'MITIGATION_IN_PROGRESS' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                        MITIGATING
                      </span>
                    )}
                    {risk.status === 'RESOLVED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        RESOLVED
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenUpdateModal(risk)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors ml-auto"
                    >
                      <Sliders className="h-3 w-3 text-cyan-400" />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Log Supply Risk Assessment */}
      {isRiskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-rose-400" />
                <h3 className="text-base font-semibold text-white">Log Supply Risk Assessment</h3>
              </div>
              <button
                onClick={() => setIsRiskModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRisk} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Risk Reference # <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newRiskNumber}
                    onChange={(e) => setNewRiskNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Affected Item SKU
                  </label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Risk Category <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as RiskCategory)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="PRICE_VOLATILITY">PRICE VOLATILITY</option>
                    <option value="SINGLE_SOURCE_DEPENDENCY">SINGLE SOURCE</option>
                    <option value="LEAD_TIME_SPIKE">LEAD TIME SPIKE</option>
                    <option value="LOGISTICS_DISRUPTION">LOGISTICS DISRUPTION</option>
                    <option value="GEOPOLITICAL">GEOPOLITICAL</option>
                    <option value="SUPPLIER_SOLVENCY">SUPPLIER SOLVENCY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Severity Level <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as RiskSeverity)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Likelihood
                  </label>
                  <select
                    value={newLikelihood}
                    onChange={(e) => setNewLikelihood(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="REMOTE">REMOTE</option>
                    <option value="POSSIBLE">POSSIBLE</option>
                    <option value="LIKELY">LIKELY</option>
                    <option value="ALMOST_CERTAIN">ALMOST CERTAIN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Impact Description <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  placeholder="e.g. Price increase of 12% on cold rolled steel tubes..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Mitigation Plan <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={newMitigation}
                  onChange={(e) => setNewMitigation(e.target.value)}
                  placeholder="e.g. Execute forward hedge contract, evaluate dual sourcing..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Financial Exposure ($)
                  </label>
                  <input
                    type="number"
                    value={newExposure}
                    onChange={(e) => setNewExposure(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Assigned Owner
                  </label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRiskModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Log Risk Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Update Mitigation Progress */}
      {isUpdateModalOpen && selectedRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">
                  Update Risk Status — {selectedRisk.riskRefNumber}
                </h3>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Resolution Status
                </label>
                <select
                  value={updateStatusVal}
                  onChange={(e) => setUpdateStatusVal(e.target.value as RiskStatus)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="IDENTIFIED">IDENTIFIED</option>
                  <option value="MITIGATION_IN_PROGRESS">MITIGATION IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED (Risk Averted)</option>
                  <option value="ACCEPTED">ACCEPTED (Tolerable)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Mitigation Update / Milestone Progress
                </label>
                <textarea
                  rows={3}
                  value={updateMitigationNotes}
                  onChange={(e) => setUpdateMitigationNotes(e.target.value)}
                  placeholder="e.g. Secured forward contract, lab validation passed..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

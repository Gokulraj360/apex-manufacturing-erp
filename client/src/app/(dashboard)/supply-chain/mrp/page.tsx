'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Network,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  ExternalLink,
  Play,
  Clock,
  Sparkles,
  Sliders,
  Boxes,
  FileSpreadsheet,
  AlertOctagon,
  ArrowRight,
  Truck,
} from 'lucide-react';
import {
  MaterialRequirementPlanItem,
  MRPPlanStatus,
  GrossDemandItem,
  NetRequirementItem,
  PlannedOrderReleaseItem,
} from '@/types/supply-chain';

const INITIAL_MRP_PLANS: MaterialRequirementPlanItem[] = [
  {
    id: 'mrp-1',
    planNumber: 'MRP-2026-0041',
    planName: 'Q4 2026 Master Production Schedule & Demand Plan',
    planningHorizonWeeks: 12,
    status: 'COMPUTED',
    generatedBy: 'Anil Deshmukh (Production Planning)',
    forecastStartDate: '2026-10-01',
    forecastEndDate: '2026-12-31',
    safetyStockAlertsCount: 3,
    totalItemsPlanned: 4,
    notes: 'Incorporates revised sales orders for Hydraulic Cylinders and Marine Drive Units.',
    grossDemandJson: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        itemName: 'Seamless Cold Drawn Hydraulic Steel Tubes 80mm',
        requiredQty: 500,
        sourceWorkOrderId: 'WO-2026-0881',
        requiredDate: '2026-10-25',
      },
      {
        itemSku: 'CMP-BRG-6208',
        itemName: 'Deep Groove Radial Ball Bearings 6208-2RS',
        requiredQty: 1200,
        sourceWorkOrderId: 'WO-2026-0882',
        requiredDate: '2026-11-05',
      },
      {
        itemSku: 'RAW-POL-SEAL-R4',
        itemName: 'High Temp Fluorosilicone O-Ring Cordage',
        requiredQty: 600,
        sourceWorkOrderId: 'WO-2026-0883',
        requiredDate: '2026-11-12',
      },
      {
        itemSku: 'INGOT-AL-ADC12',
        itemName: 'Aluminium Die Casting Ingot ADC12 Grade',
        requiredQty: 1500,
        sourceWorkOrderId: 'WO-2026-0884',
        requiredDate: '2026-10-30',
      },
    ],
    scheduledReceiptsJson: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        incomingQty: 75,
        poNumber: 'POS-2026-0112',
        expectedDate: '2026-10-11',
      },
      {
        itemSku: 'CMP-BRG-6208',
        incomingQty: 180,
        poNumber: 'POS-2026-0114',
        expectedDate: '2026-10-10',
      },
    ],
    netRequirementsJson: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        itemName: 'Seamless Cold Drawn Hydraulic Steel Tubes 80mm',
        requiredQty: 500,
        currentOnhand: 175,
        scheduledIncoming: 75,
        safetyStockThreshold: 120,
        netShortageQty: 370,
        leadTimeDays: 7,
      },
      {
        itemSku: 'CMP-BRG-6208',
        itemName: 'Deep Groove Radial Ball Bearings 6208-2RS',
        requiredQty: 1200,
        currentOnhand: 420,
        scheduledIncoming: 180,
        safetyStockThreshold: 288,
        netShortageQty: 888,
        leadTimeDays: 5,
      },
      {
        itemSku: 'RAW-POL-SEAL-R4',
        itemName: 'High Temp Fluorosilicone O-Ring Cordage',
        requiredQty: 600,
        currentOnhand: 150,
        scheduledIncoming: 0,
        safetyStockThreshold: 144,
        netShortageQty: 594,
        leadTimeDays: 10,
      },
      {
        itemSku: 'INGOT-AL-ADC12',
        itemName: 'Aluminium Die Casting Ingot ADC12 Grade',
        requiredQty: 1500,
        currentOnhand: 800,
        scheduledIncoming: 200,
        safetyStockThreshold: 300,
        netShortageQty: 800,
        leadTimeDays: 4,
      },
    ],
    plannedOrderReleasesJson: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        itemName: 'Seamless Cold Drawn Hydraulic Steel Tubes 80mm',
        orderQty: 370,
        releaseDate: '2026-10-18',
        needDate: '2026-10-25',
        suggestedVendorName: 'Tata Steel Tubes & Pipes Division',
        estimatedLeadDays: 7,
      },
      {
        itemSku: 'CMP-BRG-6208',
        itemName: 'Deep Groove Radial Ball Bearings 6208-2RS',
        orderQty: 888,
        releaseDate: '2026-10-31',
        needDate: '2026-11-05',
        suggestedVendorName: 'SKF Bearings Industrial Fleet',
        estimatedLeadDays: 5,
      },
      {
        itemSku: 'RAW-POL-SEAL-R4',
        itemName: 'High Temp Fluorosilicone O-Ring Cordage',
        orderQty: 594,
        releaseDate: '2026-11-02',
        needDate: '2026-11-12',
        suggestedVendorName: 'Wacker Silicones & Polymers',
        estimatedLeadDays: 10,
      },
      {
        itemSku: 'INGOT-AL-ADC12',
        itemName: 'Aluminium Die Casting Ingot ADC12 Grade',
        orderQty: 800,
        releaseDate: '2026-10-26',
        needDate: '2026-10-30',
        suggestedVendorName: 'Hindalco Metal Alloys Corp',
        estimatedLeadDays: 4,
      },
    ],
    createdAt: '2026-10-06',
  },
  {
    id: 'mrp-2',
    planNumber: 'MRP-2026-0040',
    planName: 'September 2026 Rolling Mid-Term Production Plan',
    planningHorizonWeeks: 8,
    status: 'RELEASED',
    generatedBy: 'Anil Deshmukh (Production Planning)',
    forecastStartDate: '2026-09-01',
    forecastEndDate: '2026-10-31',
    safetyStockAlertsCount: 1,
    totalItemsPlanned: 3,
    notes: 'All planned orders successfully released to Procurement PO desk.',
    grossDemandJson: [],
    scheduledReceiptsJson: [],
    netRequirementsJson: [],
    plannedOrderReleasesJson: [],
    createdAt: '2026-09-01',
  },
];

export default function MRPDemandPlanningPage() {
  const [plans, setPlans] = useState<MaterialRequirementPlanItem[]>(INITIAL_MRP_PLANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MaterialRequirementPlanItem | null>(null);

  // New Plan State
  const [newPlanNumber, setNewPlanNumber] = useState('');
  const [newPlanName, setNewPlanName] = useState('');
  const [newHorizonWeeks, setNewHorizonWeeks] = useState('12');
  const [newStartDate, setNewStartDate] = useState('2026-10-15');
  const [newEndDate, setNewEndDate] = useState('2027-01-15');
  const [newNotes, setNewNotes] = useState('');
  const [sku1, setSku1] = useState('RAW-STL-TUBE-80');
  const [sku1Name, setSku1Name] = useState('Seamless Cold Drawn Steel Tubes');
  const [sku1Qty, setSku1Qty] = useState('650');
  const [sku1Date, setSku1Date] = useState('2026-11-20');

  // Filtered Plans
  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      p.planNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenGenerateModal = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setNewPlanNumber(`MRP-2026-${randomSuffix}`);
    setNewPlanName(`Rolling Demand & Schedule Forecast Horizon`);
    setIsGenerateModalOpen(true);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(sku1Qty) || 100;

    const newPlan: MaterialRequirementPlanItem = {
      id: `mrp-${Date.now()}`,
      planNumber: newPlanNumber,
      planName: newPlanName,
      planningHorizonWeeks: parseInt(newHorizonWeeks, 10) || 12,
      status: 'DRAFT',
      generatedBy: 'Operations Planning Lead',
      forecastStartDate: newStartDate,
      forecastEndDate: newEndDate,
      grossDemandJson: [
        {
          itemSku: sku1,
          itemName: sku1Name,
          requiredQty: qty,
          sourceWorkOrderId: 'WO-2026-0914',
          requiredDate: sku1Date,
        },
      ],
      scheduledReceiptsJson: [],
      netRequirementsJson: [],
      plannedOrderReleasesJson: [],
      safetyStockAlertsCount: 1,
      totalItemsPlanned: 1,
      notes: newNotes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPlans([newPlan, ...plans]);
    setIsGenerateModalOpen(false);
  };

  const handleRunComputation = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;

        const grossDemand = p.grossDemandJson || [];
        const netRequirements: NetRequirementItem[] = grossDemand.map((d) => {
          const onhand = Math.floor(d.requiredQty * 0.3);
          const incoming = Math.floor(d.requiredQty * 0.1);
          const safetyStock = Math.ceil(d.requiredQty * 0.25);
          const shortage = Math.max(0, d.requiredQty + safetyStock - (onhand + incoming));
          return {
            itemSku: d.itemSku,
            itemName: d.itemName,
            requiredQty: d.requiredQty,
            currentOnhand: onhand,
            scheduledIncoming: incoming,
            safetyStockThreshold: safetyStock,
            netShortageQty: shortage,
            leadTimeDays: 7,
          };
        });

        const plannedReleases: PlannedOrderReleaseItem[] = netRequirements.map((nr) => {
          const needDate = new Date();
          needDate.setDate(needDate.getDate() + 20);
          const releaseDate = new Date(needDate.getTime() - 7 * 86400000);
          return {
            itemSku: nr.itemSku,
            itemName: nr.itemName,
            orderQty: nr.netShortageQty,
            releaseDate: releaseDate.toISOString().split('T')[0],
            needDate: needDate.toISOString().split('T')[0],
            suggestedVendorName: 'Tata Steel Tubes & Pipes Division',
            estimatedLeadDays: 7,
          };
        });

        return {
          ...p,
          status: 'COMPUTED',
          netRequirementsJson: netRequirements,
          plannedOrderReleasesJson: plannedReleases,
          safetyStockAlertsCount: netRequirements.filter((nr) => nr.netShortageQty > 0).length,
        };
      })
    );
  };

  const handleReleasePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: 'RELEASED' } : p))
    );
    if (selectedPlan && selectedPlan.id === planId) {
      setSelectedPlan({ ...selectedPlan, status: 'RELEASED' });
    }
  };

  const handleOpenMatrixModal = (plan: MaterialRequirementPlanItem) => {
    setSelectedPlan(plan);
    setIsMatrixModalOpen(true);
  };

  const getStatusBadge = (status: MRPPlanStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">DRAFT</span>;
      case 'COMPUTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">COMPUTED</span>;
      case 'RELEASED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">RELEASED</span>;
      case 'ARCHIVED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">ARCHIVED</span>;
      default:
        return <span className="text-xs text-slate-500 dark:text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/supply-chain"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Supply Chain Flow Command
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Network className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              Material Requirements Planning (MRP) &amp; Demand Forecasting
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Multi-echelon demand breakdown, net inventory shortage calculation, safety stock threshold alerts, and lead-time offset order release generation.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenGenerateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Generate MRP Plan
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active MRP Plans</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Network className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{plans.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">master plans</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-600 dark:text-cyan-400">Synchronized with work orders</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Planning Horizon</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">12 Weeks</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Rolling forecast through Dec 2026</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-amber-500/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Safety Stock Alerts</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">3 SKUs</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Below buffer</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-300">Requires purchase release trigger</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Planned Order Releases</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Boxes className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">4 Orders</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">Ready for procurement batching</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Plan #, Plan Name, Planner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="COMPUTED">Computed</option>
            <option value="RELEASED">Released</option>
          </select>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Production Schedule MRP Plans</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">({filteredPlans.length} plans)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Automated Gross-to-Net Multi-Echelon Explosion
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Plan # &amp; Name</th>
                <th className="py-3 px-4">Horizon</th>
                <th className="py-3 px-4">Forecast Range</th>
                <th className="py-3 px-4">Items &amp; Demands</th>
                <th className="py-3 px-4">Safety Buffer Alerts</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-normal">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white font-mono">{plan.planNumber}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">{plan.planName}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">By: {plan.generatedBy}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 font-semibold">
                      {plan.planningHorizonWeeks} Weeks
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                    <div>{plan.forecastStartDate}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[10px]">to {plan.forecastEndDate}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-slate-900 dark:text-white font-medium">{plan.totalItemsPlanned} SKUs</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {plan.plannedOrderReleasesJson.length} releases computed
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {plan.safetyStockAlertsCount > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {plan.safetyStockAlertsCount} Buffers Low
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Adequate
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(plan.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {plan.status === 'DRAFT' && (
                        <button
                          onClick={() => handleRunComputation(plan.id)}
                          className="px-2.5 py-1 rounded bg-cyan-600/10 dark:bg-cyan-600/20 hover:bg-cyan-600/20 dark:hover:bg-cyan-600/30 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <Play className="h-3 w-3" />
                          Compute MRP
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenMatrixModal(plan)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Sliders className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        Matrix View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Generate MRP Plan */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Generate Material Requirements Plan</h3>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Plan Number <span className="text-cyan-600 dark:text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlanNumber}
                    onChange={(e) => setNewPlanNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Plan Name <span className="text-cyan-600 dark:text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Planning Horizon (Weeks)
                  </label>
                  <select
                    value={newHorizonWeeks}
                    onChange={(e) => setNewHorizonWeeks(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="4">4 Weeks (Tactical)</option>
                    <option value="8">8 Weeks (Mid-Term)</option>
                    <option value="12">12 Weeks (Quarterly Master)</option>
                    <option value="26">26 Weeks (Semi-Annual)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Forecast Start Date
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Forecast End Date
                  </label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sample Demand SKU input */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Boxes className="h-3.5 w-3.5" />
                  Primary Demand Line Item
                </span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Item SKU</label>
                    <input
                      type="text"
                      value={sku1}
                      onChange={(e) => setSku1(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-950 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Item Name</label>
                    <input
                      type="text"
                      value={sku1Name}
                      onChange={(e) => setSku1Name(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-950 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Required Qty</label>
                    <input
                      type="number"
                      value={sku1Qty}
                      onChange={(e) => setSku1Qty(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-950 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Need Date</label>
                    <input
                      type="date"
                      value={sku1Date}
                      onChange={(e) => setSku1Date(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-950 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Planning Notes &amp; Production Assumptions
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Surge capacity expected on CNC line 2 in November..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Create MRP Forecast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Net Requirements & Planned Order Releases Matrix */}
      {isMatrixModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  MRP Matrix &amp; Order Releases — {selectedPlan.planNumber}
                </h3>
              </div>
              <button
                onClick={() => setIsMatrixModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Header Info */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedPlan.planName}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Horizon: {selectedPlan.planningHorizonWeeks} Weeks ({selectedPlan.forecastStartDate} to {selectedPlan.forecastEndDate})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedPlan.status)}
                  {selectedPlan.status === 'COMPUTED' && (
                    <button
                      onClick={() => handleReleasePlan(selectedPlan.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Release Plan to Procurement
                    </button>
                  )}
                </div>
              </div>

              {/* Net Requirements Explosion */}
              <div>
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-2">
                  Net Requirements Calculation Matrix (Gross to Net)
                </span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase font-medium border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Item SKU</th>
                        <th className="py-2.5 px-3">Gross Demand</th>
                        <th className="py-2.5 px-3">Current On-Hand</th>
                        <th className="py-2.5 px-3">Inbound POs</th>
                        <th className="py-2.5 px-3">Safety Buffer</th>
                        <th className="py-2.5 px-3 text-right">Net Shortage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono text-slate-700 dark:text-slate-200">
                      {selectedPlan.netRequirementsJson.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-cyan-600 dark:text-cyan-400 font-bold">{item.itemSku}</td>
                          <td className="py-2.5 px-3">{item.requiredQty}</td>
                          <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{item.currentOnhand}</td>
                          <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400">{item.scheduledIncoming}</td>
                          <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">{item.safetyStockThreshold}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-rose-600 dark:text-rose-400">
                            {item.netShortageQty > 0 ? `-${item.netShortageQty} Units` : 'Balanced'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Planned Order Releases */}
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                  Recommended Planned Order Releases (Lead-Time Offset)
                </span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase font-medium border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Release Date</th>
                        <th className="py-2.5 px-3">Need Date</th>
                        <th className="py-2.5 px-3">Item SKU</th>
                        <th className="py-2.5 px-3">Suggested Supplier</th>
                        <th className="py-2.5 px-3 text-right">Order Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono text-slate-700 dark:text-slate-200">
                      {selectedPlan.plannedOrderReleasesJson.map((rel, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-bold">{rel.releaseDate}</td>
                          <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{rel.needDate}</td>
                          <td className="py-2.5 px-3 text-cyan-600 dark:text-cyan-400">{rel.itemSku}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">{rel.suggestedVendorName}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            {rel.orderQty} Units
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setIsMatrixModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Close Matrix
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

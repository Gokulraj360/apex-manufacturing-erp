'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Zap,
  Building,
  Cpu,
  Layers,
  Sliders,
  Settings,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  PieChart,
  RefreshCw,
  Plus,
  Coins,
  PackageCheck,
  ChevronRight,
  ShieldAlert,
  Flame,
  Scale,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface ComponentRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPerPiece: number;
  requiredPerUnit: number;
  extendedCost: number;
  stockQty: number;
  maxAssembleable: number;
  isBottleneck: boolean;
}

interface OverheadItem {
  id: string;
  title: string;
  category: string;
  monthlyAmount: number;
  perUnitAbsorption: number;
}

export default function CostingDashboardPage() {
  // State for adjustable parameters (clean slate starting values)
  const [targetSellingPrice, setTargetSellingPrice] = useState<number>(0);
  const [monthlyProductionVolume, setMonthlyProductionVolume] = useState<number>(0);
  const [isSpModalOpen, setIsSpModalOpen] = useState(false);
  const [isVolModalOpen, setIsVolModalOpen] = useState(false);
  const [tempSp, setTempSp] = useState<number>(0);
  const [tempVol, setTempVol] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Active Overheads State - clean slate empty
  const [overheads, setOverheads] = useState<OverheadItem[]>([]);

  // BOM Components State - clean slate empty
  const [components, setComponents] = useState<ComponentRow[]>([]);

  // Fetch live costing and overheads data
  useEffect(() => {
    async function loadCostingData() {
      try {
        const res = await fetch('/api/costing/calculate');
        if (res.ok) {
          const data = await res.json();
          if (data?.kpis) {
            const sp = Number(data.kpis.targetSellingPrice || 0);
            const vol = Number(data.kpis.monthlyTargetVolume || 0);
            setTargetSellingPrice(sp);
            setTempSp(sp);
            setMonthlyProductionVolume(vol);
            setTempVol(vol);
          }
          if (Array.isArray(data?.componentsBreakdown)) {
            setComponents(data.componentsBreakdown);
          }
          if (Array.isArray(data?.overheadsBreakdown)) {
            setOverheads(data.overheadsBreakdown);
          }
        }
      } catch {
        // Clean slate fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadCostingData();
  }, []);

  // Calculations
  const rawMaterialCostPerUnit = useMemo(() => {
    return components.reduce((sum, item) => sum + item.costPerPiece * item.requiredPerUnit, 0);
  }, [components]);

  const totalMonthlyOverheads = useMemo(() => {
    return overheads.reduce((sum, o) => sum + o.monthlyAmount, 0);
  }, [overheads]);

  const overheadPerUnit = useMemo(() => {
    if (monthlyProductionVolume <= 0) return 0;
    return Number((totalMonthlyOverheads / monthlyProductionVolume).toFixed(2));
  }, [totalMonthlyOverheads, monthlyProductionVolume]);

  const totalCostPrice = useMemo(() => {
    return rawMaterialCostPerUnit + overheadPerUnit;
  }, [rawMaterialCostPerUnit, overheadPerUnit]);

  const profitMarginPerUnit = useMemo(() => {
    return targetSellingPrice - totalCostPrice;
  }, [targetSellingPrice, totalCostPrice]);

  const profitMarginPercentage = useMemo(() => {
    if (targetSellingPrice <= 0) return 0;
    return Number(((profitMarginPerUnit / targetSellingPrice) * 100).toFixed(2));
  }, [profitMarginPerUnit, targetSellingPrice]);

  // Bottleneck Detection
  const bottleneckData = useMemo(() => {
    if (!components || components.length === 0) {
      return {
        component: null as ComponentRow | null,
        maxAssembleableUnits: 0,
        potentialBatchProfitRaw: 0,
        potentialBatchProfitInCrores: 0,
      };
    }

    let minUnits = Number.MAX_SAFE_INTEGER;
    let bComp = components[0];

    components.forEach((c) => {
      const maxUnits = c.requiredPerUnit > 0 ? Math.floor(c.stockQty / c.requiredPerUnit) : 0;
      if (maxUnits < minUnits) {
        minUnits = maxUnits;
        bComp = c;
      }
    });

    const maxAssembleableUnits = minUnits === Number.MAX_SAFE_INTEGER ? 0 : minUnits;
    const potentialBatchProfitRaw = profitMarginPerUnit * maxAssembleableUnits;
    const potentialBatchProfitInCrores = Number((potentialBatchProfitRaw / 10000000).toFixed(2));

    return {
      component: bComp,
      maxAssembleableUnits,
      potentialBatchProfitRaw,
      potentialBatchProfitInCrores,
    };
  }, [components, profitMarginPerUnit]);

  // Formatters
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-IN').format(val);
  };

  const handleSaveSp = async () => {
    setTargetSellingPrice(tempSp);
    setIsSpModalOpen(false);
    try {
      await fetch('/api/costing/parameters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetSellingPrice: tempSp }),
      });
    } catch {
      // Optimistic state
    }
  };

  const handleSaveVol = async () => {
    setMonthlyProductionVolume(tempVol);
    setIsVolModalOpen(false);
    try {
      await fetch('/api/costing/parameters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyProductionTargetVolume: tempVol }),
      });
    } catch {
      // Optimistic state
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              Commercial & Engineering Economics
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Cleanroom Production Economics
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Unit Cost Price (CP) & Commercial Margin Engine
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Live multi-layer BOM roll-up, fixed plant overhead absorption, and active inventory bottleneck detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/costing/overheads"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Manage Plant Overheads
          </Link>
          <button
            onClick={() => {
              setTempSp(targetSellingPrice);
              setIsSpModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <Sliders className="w-4 h-4" />
            Adjust Commercial SP
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: BOM Raw Materials */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              BOM Raw Materials
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatINR(rawMaterialCostPerUnit)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Direct components cost</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {totalCostPrice > 0 ? ((rawMaterialCostPerUnit / totalCostPrice) * 100).toFixed(1) : '0.0'}% of CP
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${totalCostPrice > 0 ? (rawMaterialCostPerUnit / totalCostPrice) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Overheads & Power */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Overheads & Power (Absorbed)
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatINR(overheadPerUnit)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Base: {formatNumber(monthlyProductionVolume)} units/mo</span>
            <button
              onClick={() => {
                setTempVol(monthlyProductionVolume);
                setIsVolModalOpen(true);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Change Target
            </button>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${totalCostPrice > 0 ? (overheadPerUnit / totalCostPrice) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Total Cost Price */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Manufacturing CP
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatINR(totalCostPrice)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Raw BOM + Plant Absorption</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {totalCostPrice > 0 ? 'Fully Absorbed' : 'Empty Slate'}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${targetSellingPrice > 0 ? Math.min((totalCostPrice / targetSellingPrice) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Target Selling Price (SP) & Margin */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Commercial SP & Margin
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatINR(targetSellingPrice)}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              {profitMarginPercentage >= 0 ? `+${profitMarginPercentage}%` : `${profitMarginPercentage}%`}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Net Unit Margin:</span>
            <span className={cn('font-bold', profitMarginPerUnit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
              {formatINR(profitMarginPerUnit)} / unit
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(profitMarginPercentage, 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Potential Batch Profit & Bottleneck Highlight Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Potential Batch Profit Card */}
        <div className="lg:col-span-1 rounded-xl p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-md border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Coins className="w-36 h-36" />
          </div>
          <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            Active Lot Profitability
          </div>
          <h2 className="text-lg font-semibold text-slate-100">
            Potential Batch Gross Profit
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Evaluates Net Margin per unit × Capped assembleable volume.
          </p>

          <div className="mt-6 mb-4">
            <div className="text-4xl font-extrabold text-emerald-400 tracking-tight">
              ₹ {bottleneckData.potentialBatchProfitInCrores} Crores
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Exact value: {formatINR(bottleneckData.potentialBatchProfitRaw)}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Unit Profit Margin:</span>
              <span className="font-bold text-white">{formatINR(profitMarginPerUnit)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Max Assembleable Units:</span>
              <span className="font-bold text-amber-300">
                {formatNumber(bottleneckData.maxAssembleableUnits)} units
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Monthly Volume Target:</span>
              <span className="font-medium text-slate-400">
                {formatNumber(monthlyProductionVolume)} units
              </span>
            </div>
          </div>
        </div>

        {/* Bottleneck Component Warning Card */}
        <div className="lg:col-span-2 rounded-xl p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          {bottleneckData.component ? (
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Bottleneck Production Capper Detected
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                  Capping Production at {formatNumber(bottleneckData.maxAssembleableUnits)} Units
                </span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {bottleneckData.component.sku} • {bottleneckData.component.category}
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {bottleneckData.component.name}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Required per unit: <strong className="text-slate-900 dark:text-slate-200">{bottleneckData.component.requiredPerUnit} {bottleneckData.component.unit}</strong> | Available Warehouse Stock: <strong className="text-amber-700 dark:text-amber-400">{formatNumber(bottleneckData.component.stockQty)} {bottleneckData.component.unit}</strong>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-amber-200 dark:sm:border-amber-800 sm:pl-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    Max Batch Output
                  </div>
                  <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                    {formatNumber(bottleneckData.maxAssembleableUnits)}
                  </div>
                  <div className="text-[11px] text-slate-500">Finished Devices</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">
                Production cannot exceed {formatNumber(bottleneckData.maxAssembleableUnits)} finished phones without replenishing this component.
                {monthlyProductionVolume > bottleneckData.maxAssembleableUnits && (
                  <span>
                    {' '}To achieve full monthly target of {formatNumber(monthlyProductionVolume)} units, purchase an additional{' '}
                    <strong className="text-rose-600 dark:text-rose-400">
                      {formatNumber(monthlyProductionVolume - bottleneckData.maxAssembleableUnits)} units
                    </strong>{' '}
                    via Procurement.
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 mb-3">
                <PackageCheck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Bottleneck Active
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Register BOM components and inventory quantities in Inventory & Capacity to calculate assembleable capacity constraints.
              </p>
              <Link
                href="/inventory/capacity"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Feed Components & Stock <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              PPC MRP Trigger: <strong className="text-emerald-600 dark:text-emerald-400">{bottleneckData.component ? 'Auto-PR Ready' : 'Standby'}</strong>
            </span>
            <Link
              href="/procurement"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              Procurement Center <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Multi-Level BOM Unit Cost Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Dynamic Component BOM & Stock Availability Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live unit purchase rates, component multiples, and assembly capacity constraints.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {components.length} Primary Components
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Component & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Unit Rate (₹)</th>
                <th className="py-3 px-4 text-center">Req / Phone</th>
                <th className="py-3 px-4 text-right">Extended Cost</th>
                <th className="py-3 px-4 text-right">Stock In Hand</th>
                <th className="py-3 px-4 text-right">Assembleable Cap</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {components.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No BOM components registered in database. Use Inventory & Capacity to add and feed components.
                  </td>
                </tr>
              ) : (
                components.map((item) => (
                  <tr
                    key={item.id}
                    className={cn(
                      'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
                      item.isBottleneck && 'bg-amber-50/40 dark:bg-amber-950/20'
                    )}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </div>
                      <div className="text-xs font-mono text-slate-500">{item.sku}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-900 dark:text-slate-100">
                      {formatINR(item.costPerPiece)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                      {item.requiredPerUnit} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-blue-600 dark:text-blue-400">
                      {formatINR(item.extendedCost)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                      {formatNumber(item.stockQty)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={cn(
                          'font-bold font-mono',
                          item.isBottleneck
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-700 dark:text-slate-300'
                        )}
                      >
                        {formatNumber(item.maxAssembleable)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.isBottleneck ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Bottleneck
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Sufficient
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-50/70 dark:bg-slate-950/50 font-bold border-t-2 border-slate-300 dark:border-slate-700">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-slate-900 dark:text-white">
                  Total Direct BOM Raw Material Cost (per Unit)
                </td>
                <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 text-base">
                  {formatINR(rawMaterialCostPerUnit)}
                </td>
                <td colSpan={3} className="py-3 px-4 text-right text-xs text-slate-500 font-normal">
                  Excludes plant overhead allocation
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Cost Absorption Summary vs Overheads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Overall Unit Cost Price Formula Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-500" />
              Unit Cost Absorption Waterfall
            </h3>
            <span className="text-xs text-slate-500">GAAP / Cost Accounting</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                1. Direct Material BOM
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatINR(rawMaterialCostPerUnit)}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalCostPrice > 0 ? (rawMaterialCostPerUnit / totalCostPrice) * 100 : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-slate-600 dark:text-slate-400">
                2. Plant Fixed Overheads Absorption
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatINR(overheadPerUnit)}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalCostPrice > 0 ? (overheadPerUnit / totalCostPrice) * 100 : 0}%` }}
              />
            </div>

            <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-base font-bold">
              <span className="text-slate-900 dark:text-white">
                = Total Manufacturing Cost Price (CP)
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {formatINR(totalCostPrice)}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between text-base font-bold">
              <span className="text-slate-900 dark:text-white">
                Target Commercial Selling Price (SP)
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatINR(targetSellingPrice)}
              </span>
            </div>

            <div className="pt-2 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-sm">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                Net Contribution Margin per Phone:
              </span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-base">
                {formatINR(profitMarginPerUnit)} ({profitMarginPercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Plant Overheads Contribution Breakdown */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Monthly Plant Overheads Absorbed
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total Monthly Overhead: <strong className="text-slate-800 dark:text-slate-200">₹ {(totalMonthlyOverheads / 100000).toFixed(2)} Lakhs</strong>
                </p>
              </div>
              <Link
                href="/costing/overheads"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Configure <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {overheads.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No plant overheads configured yet. Click "Manage Plant Overheads" to add fixed expenses.
                </div>
              ) : (
                overheads.slice(0, 4).map((oh) => (
                  <div key={oh.id} className="text-xs">
                    <div className="flex justify-between font-medium mb-1">
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[260px]">
                        {oh.title}
                      </span>
                      <span className="text-slate-900 dark:text-slate-100 font-mono font-semibold">
                        {formatINR(oh.perUnitAbsorption)} / unit
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${totalMonthlyOverheads > 0 ? (oh.monthlyAmount / totalMonthlyOverheads) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Overhead Rate: <strong className="text-slate-800 dark:text-slate-200">{formatINR(overheadPerUnit)}</strong> per phone
            </span>
            <Link
              href="/costing/overheads"
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
            >
              View All {overheads.length} Overheads
            </Link>
          </div>
        </div>
      </div>

      {/* Modal 1: Adjust Commercial Selling Price (SP) */}
      {isSpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                Adjust Target Selling Price (SP)
              </h3>
              <button
                onClick={() => setIsSpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Target Commercial Selling Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={tempSp}
                    onChange={(e) => setTempSp(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-base font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Manufacturing CP baseline is {formatINR(totalCostPrice)}. Price above this threshold ensures positive net profit margin.
                </p>
              </div>

              {/* Preview Margin Calculation */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Projected Unit Margin:</span>
                  <strong className={tempSp >= totalCostPrice ? 'text-emerald-600' : 'text-rose-600'}>
                    {formatINR(tempSp - totalCostPrice)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Projected Margin %:</span>
                  <strong className={tempSp >= totalCostPrice ? 'text-emerald-600' : 'text-rose-600'}>
                    {tempSp > 0 ? (((tempSp - totalCostPrice) / tempSp) * 100).toFixed(2) : 0}%
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsSpModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSp}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
              >
                Apply Selling Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Adjust Monthly Production Target Volume */}
      {isVolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" />
                Adjust Monthly Production Target
              </h3>
              <button
                onClick={() => setIsVolModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Monthly Production Volume (Units)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={tempVol}
                  onChange={(e) => setTempVol(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-base font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Increasing production target amortizes fixed plant overheads across more units, lowering per-unit manufacturing cost.
                </p>
              </div>

              {/* Preview Overhead Recalculation */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Fixed Overheads:</span>
                  <strong>{formatINR(totalMonthlyOverheads)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">New Absorbed Rate:</span>
                  <strong className="text-amber-600 dark:text-amber-400">
                    {tempVol > 0 ? formatINR(totalMonthlyOverheads / tempVol) : '0'} / phone
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsVolModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVol}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
              >
                Apply Production Target
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

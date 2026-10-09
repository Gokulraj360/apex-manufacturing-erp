'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Layers,
  AlertTriangle,
  Play,
  Plus,
  Minus,
  Sliders,
  DollarSign,
  TrendingUp,
  Boxes,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Edit3,
  X,
  ShieldCheck,
  Check,
  Scale,
  Factory,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CapacityItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPerPiece: number;
  requiredPerUnit: number;
  stockQty: number;
}

export default function AssembleableCapacityPage() {
  // Component State (starts empty in clean slate)
  const [items, setItems] = useState<CapacityItem[]>([]);

  React.useEffect(() => {
    async function loadCapacity() {
      try {
        const res = await fetch('/api/inventory/capacity');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.components)) {
            setItems(data.components);
          } else if (Array.isArray(data)) {
            setItems(data);
          }
        }
      } catch {
        // Clean slate
      }
    }
    loadCapacity();
  }, []);

  // Feed Drawer / Modal State
  const [activeDrawerItem, setActiveDrawerItem] = useState<CapacityItem | null>(null);
  const [feedRate, setFeedRate] = useState<number>(0);
  const [feedStock, setFeedStock] = useState<number>(0);

  // Batch Release Modal State
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState<boolean>(false);
  const [releaseSuccessMessage, setReleaseSuccessMessage] = useState<string | null>(null);

  // Dynamic Calculations
  const calculatedItems = useMemo(() => {
    if (!items || items.length === 0) {
      return {
        rows: [],
        bottleneck: null,
        maxAssembleableUnits: 0,
        totalRawBOMCost: 0,
      };
    }

    let minCapacity = Number.MAX_SAFE_INTEGER;
    let bItem = items[0];

    // Compute assembleable capacity per component
    const evaluated = items.map((item) => {
      const phoneCapacity = item.requiredPerUnit > 0
        ? Math.floor(item.stockQty / item.requiredPerUnit)
        : 0;

      if (phoneCapacity < minCapacity) {
        minCapacity = phoneCapacity;
        bItem = item;
      }

      return {
        ...item,
        phoneCapacity,
        costContribution: Number((item.costPerPiece * item.requiredPerUnit).toFixed(2)),
      };
    });

    const maxAssembleableUnits = minCapacity === Number.MAX_SAFE_INTEGER ? 0 : minCapacity;

    return {
      rows: evaluated.map((row) => ({
        ...row,
        isBottleneck: bItem ? row.id === bItem.id : false,
      })),
      bottleneck: bItem,
      maxAssembleableUnits,
      totalRawBOMCost: evaluated.reduce((sum, r) => sum + r.costContribution, 0),
    };
  }, [items]);

  // Quick Stock Adjustment (+500 / -500)
  const handleQuickAdjust = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stockQty + delta);
          return { ...item, stockQty: newStock };
        }
        return item;
      })
    );
  };

  // Open Slide-over Feed Drawer
  const handleOpenFeedDrawer = (item: CapacityItem) => {
    setActiveDrawerItem(item);
    setFeedRate(item.costPerPiece);
    setFeedStock(item.stockQty);
  };

  // Save Feeder Inputs
  const handleSaveFeed = () => {
    if (!activeDrawerItem) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === activeDrawerItem.id
          ? {
              ...item,
              costPerPiece: Math.max(0, Number(feedRate)),
              stockQty: Math.max(0, Number(feedStock)),
            }
          : item
      )
    );

    setActiveDrawerItem(null);
  };

  // Release Full Assembly Batch
  const handleConfirmBatchRelease = () => {
    const batchUnits = calculatedItems.maxAssembleableUnits;

    // Deduct consumed components
    setItems((prev) =>
      prev.map((item) => {
        const consumed = batchUnits * item.requiredPerUnit;
        return {
          ...item,
          stockQty: Math.max(0, item.stockQty - consumed),
        };
      })
    );

    const jobCardNum = `JC-CLEAN-${Date.now().toString().slice(-6)}`;
    setReleaseSuccessMessage(
      `Job Card ${jobCardNum} successfully dispatched to Cleanroom SMT Line 1 for ${new Intl.NumberFormat('en-IN').format(batchUnits)} units.`
    );
    setIsReleaseModalOpen(false);
  };

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

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
              Live Shop Floor Feeder
            </span>
            <span className="text-xs text-slate-500">Cleanroom Line 1 Integration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Component Price/Stock Feeding & Assembly Capacity Matrix
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time shop floor feeding of component purchase rates and warehouse stock to dynamically calculate assembleable device capacity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/costing"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition"
          >
            View Cost Price Engine
          </Link>
          <Link
            href="/procurement/new"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            Create PO for Shortage
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      {releaseSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              {releaseSuccessMessage}
            </p>
          </div>
          <button
            onClick={() => setReleaseSuccessMessage(null)}
            className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Capacity Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 p-8 opacity-10 pointer-events-none">
          <Factory className="w-48 h-48" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Cpu className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Real-Time Batch Assembly Constraint
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">
                Maximum Assembleable Finished Units
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 flex items-baseline gap-3">
                <span>{formatNumber(calculatedItems.maxAssembleableUnits)}</span>
                <span className="text-lg font-medium text-indigo-300">Finished Phones</span>
              </div>
            </div>

            {/* Highlighted Bottleneck Component Callout */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 animate-pulse" />
              <span>
                Limiting Component:{' '}
                <strong className="text-white font-bold">
                  {calculatedItems.bottleneck.name} ({calculatedItems.bottleneck.sku})
                </strong>{' '}
                — Stock ({formatNumber(calculatedItems.bottleneck.stockQty)} {calculatedItems.bottleneck.unit}) caps batch to{' '}
                <strong className="text-rose-400 font-extrabold">
                  {formatNumber(calculatedItems.maxAssembleableUnits)} units
                </strong>.
              </span>
            </div>
          </div>

          {/* Action Button: Release Full Assembly Batch */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3">
            <button
              onClick={() => setIsReleaseModalOpen(true)}
              disabled={calculatedItems.maxAssembleableUnits <= 0}
              className={cn(
                'inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5',
                calculatedItems.maxAssembleableUnits > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              )}
            >
              <Play className="w-4 h-4 fill-current" />
              Release Full Assembly Batch ({formatNumber(calculatedItems.maxAssembleableUnits)} Units)
            </button>
            <span className="text-[11px] text-slate-400">
              Dispatches automated digital job cards to cleanroom workstations
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Component Rate & Stock Feeding Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-blue-600" />
              Component Price & Warehouse Stock Feeding Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live updates automatically recalibrate BOM contribution cost and batch assembly limits.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Total BOM Cost:</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
              {formatINR(calculatedItems.totalRawBOMCost)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">SKU & Component</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Unit Rate (₹)</th>
                <th className="py-3 px-4 text-center">BOM Req/Unit</th>
                <th className="py-3 px-4 text-right">Cost Contribution</th>
                <th className="py-3 px-4 text-right">Stock In Hand</th>
                <th className="py-3 px-4 text-right">Assembleable Cap</th>
                <th className="py-3 px-4 text-center">Quick Adjust</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {calculatedItems.rows.map((item) => (
                <tr
                  key={item.id}
                  className={cn(
                    'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
                    item.isBottleneck && 'bg-rose-50/60 dark:bg-rose-950/30'
                  )}
                >
                  {/* SKU & Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {item.name}
                      {item.isBottleneck && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse border border-rose-300 dark:border-rose-800">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Bottleneck
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {item.sku}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>

                  {/* Unit Rate */}
                  <td className="py-3.5 px-4 text-right font-medium text-slate-900 dark:text-slate-100">
                    {formatINR(item.costPerPiece)}
                  </td>

                  {/* BOM Req */}
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                    {item.requiredPerUnit} {item.unit}
                  </td>

                  {/* Total Cost Contribution */}
                  <td className="py-3.5 px-4 text-right font-bold text-blue-600 dark:text-blue-400">
                    {formatINR(item.costContribution)}
                  </td>

                  {/* Available Stock */}
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {formatNumber(item.stockQty)}
                  </td>

                  {/* Assembleable Phone Capacity */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    <span
                      className={cn(
                        item.isBottleneck
                          ? 'text-rose-600 dark:text-rose-400 text-base'
                          : 'text-slate-700 dark:text-slate-300'
                      )}
                    >
                      {formatNumber(item.phoneCapacity)}
                    </span>
                  </td>

                  {/* Quick Adjust (+500 / -500) */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
                      <button
                        onClick={() => handleQuickAdjust(item.id, -500)}
                        title="Reduce stock by 500"
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono font-semibold text-slate-500 px-1">
                        500
                      </span>
                      <button
                        onClick={() => handleQuickAdjust(item.id, 500)}
                        title="Increase stock by 500"
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Feed Price/Stock Action Drawer */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleOpenFeedDrawer(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition border border-blue-200 dark:border-blue-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Feed Price / Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/70 dark:bg-slate-950/50 font-bold border-t-2 border-slate-300 dark:border-slate-700">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-slate-900 dark:text-white">
                  Total Direct BOM Raw Material Contribution per Phone
                </td>
                <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 text-base">
                  {formatINR(calculatedItems.totalRawBOMCost)}
                </td>
                <td colSpan={4} className="py-3 px-4 text-right text-xs text-slate-500 font-normal">
                  Capped by: <strong className="text-rose-600">{calculatedItems.bottleneck.name}</strong> ({formatNumber(calculatedItems.maxAssembleableUnits)} units)
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Slide-over Action Drawer for Precise Feeding */}
      {activeDrawerItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-left p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Shop Floor Feed Calibration
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Feed Price & Stock Level
                </h3>
              </div>
              <button
                onClick={() => setActiveDrawerItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-5">
              {/* Component Info Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="text-xs font-mono text-slate-500">
                  {activeDrawerItem.sku} • {activeDrawerItem.category}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeDrawerItem.name}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Required per Finished Device:{' '}
                  <strong className="text-slate-900 dark:text-slate-200">
                    {activeDrawerItem.requiredPerUnit} {activeDrawerItem.unit}
                  </strong>
                </div>
              </div>

              {/* Feed 1: Unit Purchase Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Live Unit Purchase Rate (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={feedRate}
                    onChange={(e) => setFeedRate(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-base font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Adjusting unit rate immediately updates line cost contribution to total device BOM.
                </p>
              </div>

              {/* Feed 2: Warehouse Stock In Hand */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Warehouse Available Stock ({activeDrawerItem.unit})
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={feedStock}
                  onChange={(e) => setFeedStock(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-base font-bold focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Verified stock level available for shop floor cleanroom kitting.
                </p>
              </div>

              {/* Real-Time Recalibrated Projection */}
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs">
                <div className="font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide text-[10px]">
                  Recalibrated Assembly Impact
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>New Phone Capacity for this SKU:</span>
                  <strong className="text-blue-700 dark:text-blue-300 font-mono text-sm">
                    {formatNumber(
                      activeDrawerItem.requiredPerUnit > 0
                        ? Math.floor(feedStock / activeDrawerItem.requiredPerUnit)
                        : 0
                    )}{' '}
                    phones
                  </strong>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>New Unit Cost Contribution:</span>
                  <strong className="text-blue-700 dark:text-blue-300 font-mono text-sm">
                    {formatINR(feedRate * activeDrawerItem.requiredPerUnit)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveDrawerItem(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFeed}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
              >
                Commit Price & Stock Feed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Release Assembly Batch */}
      {isReleaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Dispatch Cleanroom Assembly Batch?
                </h3>
                <p className="text-xs text-slate-500">
                  Release full assembleable volume to shop floor execution
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Quantity to Dispatch:</span>
                <strong className="text-slate-900 dark:text-white text-sm">
                  {formatNumber(calculatedItems.maxAssembleableUnits)} Finished Phones
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Line Cell:</span>
                <strong className="text-slate-900 dark:text-white">
                  SMT Line 01 (Cleanroom Class-1000)
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Raw BOM Value to Consume:</span>
                <strong className="text-blue-600 dark:text-blue-400 font-bold">
                  {formatINR(calculatedItems.totalRawBOMCost * calculatedItems.maxAssembleableUnits)}
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-rose-600 dark:text-rose-400">
                <span>Limiting Component Stock after run:</span>
                <strong>
                  0 units of {calculatedItems.bottleneck.name} (Fully Depleted)
                </strong>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Confirming this release will automatically allocate component warehouse putaway bins and generate the active Job Card with digital signed checklist.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsReleaseModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBatchRelease}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
              >
                Confirm & Dispatch Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

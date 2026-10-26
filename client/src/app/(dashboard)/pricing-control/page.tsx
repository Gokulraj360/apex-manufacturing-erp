'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Zap,
  Coins,
  Tag,
  Sliders,
  PenLine,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Layers,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  EyeOff,
  UserCheck,
  FileCheck,
  History,
  X,
  Plus,
  ArrowUpRight,
  Calculator,
} from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useActiveFranchise } from '@/lib/franchiseStore';
import { LineChart, DonutChart } from '@/components/charts';

interface BomItem {
  id: string;
  name: string;
  category: string;
  supplier: string;
  unitCost: number;
  quantity: number;
  scrapRate: number;
  isRestricted: boolean;
}

interface OverheadItem {
  id: string;
  category: string;
  allocatedCostPerUnit: number;
  monthlyTotal: number;
  description: string;
}

export default function PricingControlDashboardPage() {
  const { session } = useAuth();

  // Dynamic Commercial Parameters matching the reference screenshot
  const [productionTarget, setProductionTarget] = useState<number>(7600); // 7,600 units
  const [sellingPrice, setSellingPrice] = useState<number>(28999); // ₹28,999 / Unit
  const [overheadPerUnit, setOverheadPerUnit] = useState<number>(450); // ₹450 / Unit

  // UI States
  const [activeTab, setActiveTab] = useState<'commercial' | 'rbac' | 'overrides' | 'audit'>('commercial');
  const [showAdjustTargetModal, setShowAdjustTargetModal] = useState<boolean>(false);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState<boolean>(false);
  const [tempTargetInput, setTempTargetInput] = useState<number>(7600);
  const [tempPriceInput, setTempPriceInput] = useState<number>(28999);
  const [notification, setNotification] = useState<string | null>(null);

  // BOM Component List (Aggregated to ₹19,750 / Unit)
  const [bomItems, setBomItems] = useState<BomItem[]>([
    {
      id: 'BOM-001',
      name: 'Industrial High-Performance Embedded Processor SoC',
      category: 'Semiconductor / Main Controller',
      supplier: 'Enterprise Semiconductor Solutions',
      unitCost: 8200,
      quantity: 1,
      scrapRate: 0.2,
      isRestricted: true,
    },
    {
      id: 'BOM-002',
      name: 'High-Resolution Low-Latency Optical Interface & Display Panel',
      category: 'Display / Optoelectronics',
      supplier: 'Apex Precision Opto-Electronics',
      unitCost: 4800,
      quantity: 1,
      scrapRate: 0.5,
      isRestricted: true,
    },
    {
      id: 'BOM-003',
      name: 'Precision Optical Telemetry & Imaging Sensor Module',
      category: 'Optics & Sensors',
      supplier: 'Precision Sensor Solutions',
      unitCost: 3400,
      quantity: 1,
      scrapRate: 0.4,
      isRestricted: true,
    },
    {
      id: 'BOM-004',
      name: 'High-Density Dual-Cell Power Storage & Thermal Battery Unit',
      category: 'Power & Storage',
      supplier: 'Amperex Energy Systems Corp.',
      unitCost: 1350,
      quantity: 1,
      scrapRate: 0.1,
      isRestricted: true,
    },
    {
      id: 'BOM-005',
      name: 'Aerospace Grade 7-Series CNC Aluminum Structural Enclosure',
      category: 'Mechanical / Housing',
      supplier: 'Foxconn Precision Tooling',
      unitCost: 1250,
      quantity: 1,
      scrapRate: 0.8,
      isRestricted: false,
    },
    {
      id: 'BOM-006',
      name: 'Integrated Vapor Chamber 4500mm² Heat Dissipation Sheet',
      category: 'Thermal Sub-assembly',
      supplier: 'Auras Technology Corp.',
      unitCost: 750,
      quantity: 1,
      scrapRate: 0.3,
      isRestricted: false,
    },
  ]);

  // Allocated Plant Overheads
  const overheadItems: OverheadItem[] = [
    {
      id: 'OVH-1',
      category: 'Cleanroom HVAC & Environmental Control',
      allocatedCostPerUnit: 180,
      monthlyTotal: 1368000,
      description: '24/7 Class-100 Cleanroom HEPA filtration and constant temperature regulation.',
    },
    {
      id: 'OVH-2',
      category: 'SMT High-Speed Line Power & Nitrogen Draw',
      allocatedCostPerUnit: 120,
      monthlyTotal: 912000,
      description: 'High-voltage industrial electricity and liquid nitrogen atmosphere reflow soldering.',
    },
    {
      id: 'OVH-3',
      category: 'Direct Machine Operator & Assembly Labor',
      allocatedCostPerUnit: 100,
      monthlyTotal: 760000,
      description: 'Precision robotic cell oversight and manual flex-cable docking labor.',
    },
    {
      id: 'OVH-4',
      category: 'Automated Optical Inspection (AOI) Depreciation',
      allocatedCostPerUnit: 50,
      monthlyTotal: 380000,
      description: 'Capital asset depreciation allocation for high-speed laser inspection scanners.',
    },
  ];

  // Calculations
  const aggregatedComponentCost = useMemo(() => {
    return bomItems.reduce((acc, item) => acc + item.unitCost * item.quantity, 0);
  }, [bomItems]);

  const costPrice = useMemo(() => {
    return aggregatedComponentCost + overheadPerUnit;
  }, [aggregatedComponentCost, overheadPerUnit]);

  const netProfitPerUnit = useMemo(() => {
    return sellingPrice - costPrice;
  }, [sellingPrice, costPrice]);

  const grossProfitMarginPercent = useMemo(() => {
    if (sellingPrice === 0) return 0;
    return (netProfitPerUnit / sellingPrice) * 100;
  }, [netProfitPerUnit, sellingPrice]);

  const potentialBatchProfitCrores = useMemo(() => {
    const totalProfitRupees = netProfitPerUnit * productionTarget;
    // 1 Crore = 10,000,000 Rupees
    return (totalProfitRupees / 10000000).toFixed(2);
  }, [netProfitPerUnit, productionTarget]);

  // Visual Chart Datasets
  const unitPriceBreakdown = useMemo(() => [
    {
      name: 'Component Parts (BOM)',
      value: aggregatedComponentCost,
      color: '#6366f1',
      description: 'Microprocessor SoC, Telemetry Sensors & Optical Modules',
    },
    {
      name: 'Net Profit Margin',
      value: netProfitPerUnit,
      color: '#10b981',
      description: 'Factory margin generated per manufactured unit',
    },
    {
      name: 'Factory Running Costs',
      value: overheadPerUnit,
      color: '#f59e0b',
      description: 'Cleanroom electricity, robotics & staff costs',
    },
  ], [aggregatedComponentCost, netProfitPerUnit, overheadPerUnit]);

  const batchSensitivityData = useMemo(() => {
    const batchSizes = [2000, 4000, 6000, 7600, 10000, 12000];
    return batchSizes.map((size) => ({
      label: `${(size / 1000).toFixed(1)}k`,
      revenue: Number(((size * sellingPrice) / 10000000).toFixed(2)),
      profit: Number(((size * netProfitPerUnit) / 10000000).toFixed(2)),
    }));
  }, [sellingPrice, netProfitPerUnit]);

  const handleUpdateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    setProductionTarget(tempTargetInput);
    setShowAdjustTargetModal(false);
    setNotification(`Production target updated to ${tempTargetInput.toLocaleString()} units.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    setSellingPrice(tempPriceInput);
    setShowUpdatePriceModal(false);
    setNotification(`Selling Price (SP) adjusted to ₹${tempPriceInput.toLocaleString()} / Unit.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 1. TOP 4 METRIC CARDS (Strictly matching reference screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Aggregated Component Cost */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Raw Material Cost
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              ₹ {aggregatedComponentCost.toLocaleString()}{' '}
              <span className="text-base font-normal text-slate-500 dark:text-slate-400">/ Unit</span>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Product Parts List & Recipe
            </div>
          </div>
        </div>

        {/* Card 2: Allocated Plant Overhead */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Factory Electricity & Running Costs
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              ₹ {overheadPerUnit.toLocaleString()}{' '}
              <span className="text-base font-normal text-slate-500 dark:text-slate-400">/ Unit</span>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Factory Power & Running Costs
            </div>
          </div>
        </div>

        {/* Card 3: BOM + Overheads (Cost Price) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-500 dark:text-rose-400 shadow-sm">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Cost to Make 1 Unit
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              ₹ {costPrice.toLocaleString()}{' '}
              <span className="text-base font-normal text-slate-500 dark:text-slate-400">/ Unit</span>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Cost Price (CP) - Parts + Overheads
            </div>
          </div>
        </div>

        {/* Card 4: Selling Price (SP) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-sm">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Profit Margin: {grossProfitMarginPercent.toFixed(1)}%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              ₹ {sellingPrice.toLocaleString()}{' '}
              <span className="text-base font-normal text-slate-500 dark:text-slate-400">/ Unit</span>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Selling Price (SP) to Market
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN SECTION: Commercial Profitability & Cost Engine */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-all space-y-6">
        {/* Main Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Profit Calculator & Unit Manufacturing Costs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live calculation connecting part prices, factory electricity costs, and your selling price
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => {
                setTempTargetInput(productionTarget);
                setShowAdjustTargetModal(true);
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Change Target Batch Size</span>
            </button>

            <button
              onClick={() => {
                setTempPriceInput(sellingPrice);
                setShowUpdatePriceModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#1e293b] dark:bg-blue-600 hover:bg-[#0f172a] dark:hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Set Selling Price</span>
            </button>
          </div>
        </div>

        {/* Highlight Profitability Banner (Exact green banner in screenshot) */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-6 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Net Profit Margin / Unit */}
            <div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Net Profit Margin / Manufactured Unit
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                ₹ {netProfitPerUnit.toLocaleString()} / Unit
              </div>
            </div>

            {/* Column 2: Gross Profit Margin % */}
            <div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Gross Profit Margin %
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                {grossProfitMarginPercent.toFixed(2)} %
              </div>
            </div>

            {/* Column 3: Potential Batch Profit */}
            <div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Potential Batch Profit
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1e293b] dark:text-blue-300 font-mono tracking-tight">
                ₹ {potentialBatchProfitCrores} Crores
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Against {productionTarget.toLocaleString()} assembled units
              </div>
            </div>
          </div>
        </div>

        {/* Visual Charts: Unit Cost Breakdown & Batch Size Sensitivity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <DonutChart
              data={unitPriceBreakdown}
              title="Unit Commercial Cost & Margin Breakdown"
              subtitle={`₹${sellingPrice.toLocaleString()} selling price allocation per manufactured unit`}
              centerLabel="Selling Price"
              centerValue={`₹${(sellingPrice / 1000).toFixed(1)}k`}
              centerSubtext={`${grossProfitMarginPercent.toFixed(1)}% Margin`}
              valueFormatter={(v) => `₹${v.toLocaleString()}`}
              height={260}
            />
          </div>

          <div className="lg:col-span-7">
            <LineChart
              data={batchSensitivityData}
              series={[
                { key: 'revenue', name: 'Commercial Revenue (₹ Cr)', color: '#3b82f6', strokeWidth: 3 },
                { key: 'profit', name: 'Net Executive Profit (₹ Cr)', color: '#10b981', strokeWidth: 2.5 },
              ]}
              xAxisKey="label"
              title="Batch Volume Sensitivity Curve"
              subtitle="Projected Gross Revenue vs Net Profit as assembly volume scales"
              yAxisFormatter={(v) => `₹${v} Cr`}
              tooltipFormatter={(v) => `₹${v} Crores`}
              height={260}
            />
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('commercial')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'commercial'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            BOM Parts & Manufacturing Cost List
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'rbac'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            Price Permissions by Role
          </button>
          <button
            onClick={() => setActiveTab('overrides')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'overrides'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            Price Changes & Approvals
          </button>
        </div>

        {/* TAB 1: Unit Cost Structure Breakdown */}
        {activeTab === 'commercial' && (
          <div className="space-y-6 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Manufacturing Parts & Recipe Cost Structure:
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Total Cost to Manufacture 1 Unit: <strong className="text-slate-900 dark:text-white">₹ {costPrice.toLocaleString()}</strong>
              </span>
            </div>

            {/* BOM Individual Component Costs Table */}
            <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Part Name (Product Recipe)</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Supplier Source</th>
                      <th className="px-4 py-3 text-right">Cost Price per Piece</th>
                      <th className="px-4 py-3 text-right">Wasted Parts Rate</th>
                      <th className="px-4 py-3 text-center">Who Can View Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {bomItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                          {item.name}
                          <div className="text-[10px] text-slate-400 font-mono">{item.id}</div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                          {item.category}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                          {item.supplier}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-900 dark:text-white">
                          ₹ {item.unitCost.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-slate-500 dark:text-slate-400">
                          +{item.scrapRate}%
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Executive / MD</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Plant Overheads & Utilities Grid */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Factory Running, Electricity & Power Costs
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {overheadItems.map((ovh) => (
                  <div
                    key={ovh.id}
                    className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {ovh.category}
                    </div>
                    <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
                      ₹ {ovh.allocatedCostPerUnit} <span className="text-xs font-normal text-slate-500">/ Unit</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                      {ovh.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RBAC Price Access Matrix */}
        {activeTab === 'rbac' && (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              <ShieldCheck className="w-4 h-4 inline-block mr-1 text-blue-600" />
              <strong>Role-Based Price Protection Active:</strong> Raw material cost prices are hidden from non-purchasing staff. Selling prices can only be changed by Top Management and Sales.
            </div>

            <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950/40">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Staff Role</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Cost Price (What We Pay)</th>
                    <th className="px-4 py-3">Selling Price (What We Sell For)</th>
                    <th className="px-4 py-3 text-right">Access Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Top Management (Owner / MD)</td>
                    <td className="px-4 py-3 text-slate-500">Executive Governance</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">Full View & Edit</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">Full View & Edit</td>
                    <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">SUPER_ADMIN</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Procurement Specialist</td>
                    <td className="px-4 py-3 text-slate-500">Supply Chain</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">Full View & Edit</td>
                    <td className="px-4 py-3 text-slate-400">Hidden</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">PROCUREMENT_WRITE</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Sales & CRM Manager</td>
                    <td className="px-4 py-3 text-slate-500">Client Operations</td>
                    <td className="px-4 py-3 text-slate-400">Hidden</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">Full View & Edit</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">SALES_WRITE</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Shop Floor & Production</td>
                    <td className="px-4 py-3 text-slate-500">Manufacturing</td>
                    <td className="px-4 py-3 text-slate-400">Hidden</td>
                    <td className="px-4 py-3 text-slate-400">Hidden</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">PRODUCTION_VIEW</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Overrides */}
        {activeTab === 'overrides' && (
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Special Price Changes Requested</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All parts purchases and customer quotes are following standard approved prices.
            </p>
          </div>
        )}
      </div>

      {/* MODAL 1: Adjust Production Target */}
      {showAdjustTargetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Change Target Batch Size</span>
              </h3>
              <button onClick={() => setShowAdjustTargetModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTarget} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Batch Size (Number of Units)
                </label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={tempTargetInput}
                  onChange={(e) => setTempTargetInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Current: {productionTarget.toLocaleString()} units</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdjustTargetModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm"
                >
                  Save Batch Size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Update Selling Price (SP) */}
      {showUpdatePriceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PenLine className="w-4 h-4 text-blue-600" />
                <span>Set Selling Price</span>
              </h3>
              <button onClick={() => setShowUpdatePriceModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePrice} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Target Selling Price (₹ per Unit)
                </label>
                <input
                  type="number"
                  min="20200"
                  step="500"
                  value={tempPriceInput}
                  onChange={(e) => setTempPriceInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Minimum Cost to Make: ₹{costPrice.toLocaleString()}</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUpdatePriceModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm"
                >
                  Save New Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

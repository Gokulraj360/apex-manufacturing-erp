'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  DollarSign,
  Percent,
  Factory,
  Cpu,
  Truck,
  Warehouse,
  TrendingUp,
  Scale,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  RefreshCw,
  Download,
  Building2,
  Boxes,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Search,
  Sparkles,
  Layers,
  BarChart3,
  ExternalLink,
  ChevronRight,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface KPICardData {
  id: string;
  title: string;
  value: string;
  unit?: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  trendFavorable: boolean; // Is 'up' favorable or 'down' favorable (e.g. cost reduction is favorable down)
  subtitle: string;
  target?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export interface MonthlySalesData {
  month: string;
  actual: number; // in thousands ($k)
  budget: number; // in thousands ($k)
  units: number;
}

export interface ProductSalesData {
  id: string;
  product: string;
  code: string;
  revenue: number;
  units: number;
  percentage: number;
  growth: string;
  color: string;
}

export interface RegionalSalesData {
  region: string;
  revenue: number;
  percentage: number;
  growth: string;
  clients: number;
  color: string;
}

// ============================================================================
// Mock Datasets (Real-world Manufacturing ERP Benchmarks)
// ============================================================================

const monthlySalesHistory: MonthlySalesData[] = [
  { month: 'Jan', actual: 3420, budget: 3200, units: 36200 },
  { month: 'Feb', actual: 3650, budget: 3300, units: 38400 },
  { month: 'Mar', actual: 3890, budget: 3600, units: 41100 },
  { month: 'Apr', actual: 4120, budget: 3800, units: 43500 },
  { month: 'May', actual: 3980, budget: 4000, units: 42100 },
  { month: 'Jun', actual: 4450, budget: 4100, units: 46800 },
  { month: 'Jul', actual: 4320, budget: 4200, units: 45200 },
  { month: 'Aug', actual: 4780, budget: 4400, units: 49400 },
  { month: 'Sep', actual: 5120, budget: 4500, units: 53100 },
  { month: 'Oct', actual: 4829, budget: 4500, units: 48250 }, // Current MTD
];

const productSalesDistribution: ProductSalesData[] = [
  {
    id: 'prod-1',
    product: 'Precision Hydraulic Pumps',
    code: 'FG-PMP-100',
    revenue: 1840000,
    units: 14200,
    percentage: 38.1,
    growth: '+14.2%',
    color: '#2563EB', // Blue
  },
  {
    id: 'prod-2',
    product: 'Heavy Transmission Housings',
    code: 'FG-TRN-200',
    revenue: 1290000,
    units: 9800,
    percentage: 26.7,
    growth: '+8.6%',
    color: '#0D9488', // Teal
  },
  {
    id: 'prod-3',
    product: 'High-Torque Drive Shaft Rotors',
    code: 'FG-RTR-350',
    revenue: 820000,
    units: 11400,
    percentage: 17.0,
    growth: '+21.4%',
    color: '#7C3AED', // Purple
  },
  {
    id: 'prod-4',
    product: 'Modular High-Pressure Valves',
    code: 'FG-VLV-410',
    revenue: 540000,
    units: 7600,
    percentage: 11.2,
    growth: '+6.1%',
    color: '#D97706', // Amber
  },
  {
    id: 'prod-5',
    product: 'Custom Castings & Flanges',
    code: 'FG-CST-088',
    revenue: 339450,
    units: 5250,
    percentage: 7.0,
    growth: '+11.8%',
    color: '#E11D48', // Rose
  },
];

const regionalSalesDistribution: RegionalSalesData[] = [
  {
    region: 'North America (Automotive & Aerospace)',
    revenue: 1835000,
    percentage: 38.0,
    growth: '+16.4% YoY',
    clients: 412,
    color: '#2563EB',
  },
  {
    region: 'Western Europe (DACH & UK Machinery)',
    revenue: 1352000,
    percentage: 28.0,
    growth: '+12.1% YoY',
    clients: 284,
    color: '#0D9488',
  },
  {
    region: 'Asia-Pacific (Domestic & SEA Manufacturing)',
    revenue: 966000,
    percentage: 20.0,
    growth: '+24.8% YoY',
    clients: 340,
    color: '#7C3AED',
  },
  {
    region: 'Middle East & Gulf (Energy & Pumps)',
    revenue: 434000,
    percentage: 9.0,
    growth: '+8.2% YoY',
    clients: 115,
    color: '#D97706',
  },
  {
    region: 'Latin America (Mining & Heavy Industry)',
    revenue: 242450,
    percentage: 5.0,
    growth: '+19.5% YoY',
    clients: 68,
    color: '#E11D48',
  },
];

export default function OwnerAnalyticsDashboardPage() {
  // --------------------------------------------------------------------------
  // Filter States
  // --------------------------------------------------------------------------
  const [selectedPlant, setSelectedPlant] = useState('ALL');
  const [selectedLine, setSelectedLine] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState('ALL');
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('MTD');
  const [activeHoverMonth, setActiveHoverMonth] = useState<MonthlySalesData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --------------------------------------------------------------------------
  // Filter Options
  // --------------------------------------------------------------------------
  const plantOptions = [
    { value: 'ALL', label: 'All Plants (3)' },
    { value: 'PLANT-01', label: 'Plant 1 - Pune (Machining)' },
    { value: 'PLANT-02', label: 'Plant 2 - Chennai (Assembly)' },
    { value: 'PLANT-03', label: 'Plant 3 - Sanand (Stamping)' },
  ];

  const lineOptions = [
    { value: 'ALL', label: 'All Production Lines (8)' },
    { value: 'LINE-1', label: 'Line 1 - 5-Axis CNC Bay' },
    { value: 'LINE-2', label: 'Line 2 - Precision Grinding' },
    { value: 'LINE-3', label: 'Line 3 - Hydraulic Cell' },
    { value: 'LINE-4', label: 'Line 4 - Robotic Welding' },
    { value: 'LINE-5', label: 'Line 5 - Cleanroom Assembly' },
  ];

  const productOptions = [
    { value: 'ALL', label: 'All Products (42 SKUs)' },
    { value: 'FG-PMP-100', label: 'Hydraulic Pump (FG-PMP-100)' },
    { value: 'FG-TRN-200', label: 'Transmission Housing (FG-TRN-200)' },
    { value: 'FG-RTR-350', label: 'Drive Shaft Rotor (FG-RTR-350)' },
    { value: 'FG-VLV-410', label: 'Pressure Valve (FG-VLV-410)' },
  ];

  const warehouseOptions = [
    { value: 'ALL', label: 'All Warehouses (4)' },
    { value: 'WH-01', label: 'Central Raw Material Store' },
    { value: 'WH-02', label: 'WIP Staging Buffer' },
    { value: 'WH-03', label: 'Finished Goods Logistics Depot' },
    { value: 'WH-Q', label: 'Quarantine Bay Q' },
  ];

  const dateRangeOptions = [
    { value: 'TODAY', label: 'Today (Live)' },
    { value: '7D', label: 'Last 7 Days' },
    { value: 'MTD', label: 'Month-to-Date (Oct 2026)' },
    { value: 'QTD', label: 'Quarter-to-Date (Q3)' },
    { value: 'YTD', label: 'Year-to-Date (2026)' },
  ];

  const isFilterActive =
    selectedPlant !== 'ALL' ||
    selectedLine !== 'ALL' ||
    selectedProduct !== 'ALL' ||
    selectedWarehouse !== 'ALL' ||
    selectedDateRange !== 'MTD';

  const handleResetFilters = () => {
    setSelectedPlant('ALL');
    setSelectedLine('ALL');
    setSelectedProduct('ALL');
    setSelectedWarehouse('ALL');
    setSelectedDateRange('MTD');
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // --------------------------------------------------------------------------
  // Top 10 Executive KPI Cards Data
  // --------------------------------------------------------------------------
  const kpiCards: KPICardData[] = [
    {
      id: 'kpi-1',
      title: 'Total Orders',
      value: '1,284',
      change: '+12.4% vs last mo',
      trend: 'up',
      trendFavorable: true,
      subtitle: '948 Fulfilled · 336 Active',
      target: '98.1% Target Pace',
      icon: ShoppingBag,
      accentColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      id: 'kpi-2',
      title: 'Order Backlog',
      value: '336 Orders',
      change: '-4.1% clearance pace',
      trend: 'down',
      trendFavorable: true, // Down is good for backlog clearance
      subtitle: 'Valued at $1.84M in-hand',
      target: '14.2 Days Work-in-Hand',
      icon: Clock,
      accentColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      id: 'kpi-3',
      title: 'Revenue (MTD)',
      value: '$4,829,450',
      change: '+18.2% vs target',
      trend: 'up',
      trendFavorable: true,
      subtitle: 'Quota: $4.50M (107.3%)',
      target: 'Forecast: $5.20M',
      icon: DollarSign,
      accentColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      id: 'kpi-4',
      title: 'Gross Profit',
      value: '$1,593,718',
      change: '33.0% margin (+2.1%)',
      trend: 'up',
      trendFavorable: true,
      subtitle: 'COGS: $3.23M (Material: 62%)',
      target: 'EBITDA: $980k (20.3%)',
      icon: Percent,
      accentColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      id: 'kpi-5',
      title: 'Production Output',
      value: '48,250 Units',
      change: '+5.8% throughput',
      trend: 'up',
      trendFavorable: true,
      subtitle: 'First Pass Yield (FPY): 98.4%',
      target: 'Target: 50,000 Units',
      icon: Factory,
      accentColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60',
    },
    {
      id: 'kpi-6',
      title: 'Capacity Utilization',
      value: '86.4%',
      change: '+3.1% vs last month',
      trend: 'up',
      trendFavorable: true,
      subtitle: 'Benchmark: 85.0% (Optimal)',
      target: 'OEE Floor Index: 84.6%',
      icon: Cpu,
      accentColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
    },
    {
      id: 'kpi-7',
      title: 'On-Time Delivery',
      value: '96.8%',
      change: '+1.4% improvement',
      trend: 'up',
      trendFavorable: true,
      subtitle: '1,243 On-Time / 41 Delayed',
      target: 'SLA Threshold: >95.0%',
      icon: Truck,
      accentColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      id: 'kpi-8',
      title: 'Inventory Value',
      value: '$2,140,890',
      change: '6.2x Annual Turns',
      trend: 'neutral',
      trendFavorable: true,
      subtitle: 'RM: $1.1M · WIP: $620k · FG: $420k',
      target: 'Safety Stock Buffer: 18 Days',
      icon: Warehouse,
      accentColor: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60',
    },
    {
      id: 'kpi-9',
      title: 'Cash Flow',
      value: '+$924,300',
      change: 'Net Operating Cash Flow',
      trend: 'up',
      trendFavorable: true,
      subtitle: 'DSO: 38 Days · DPO: 44 Days',
      target: 'Liquidity Ratio: 2.4x',
      icon: TrendingUp,
      accentColor: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60',
    },
    {
      id: 'kpi-10',
      title: 'Cost of Production',
      value: '$67.12 / unit',
      change: '-3.4% unit variance',
      trend: 'down',
      trendFavorable: true, // Down in unit production cost is favorable!
      subtitle: 'Std BOM Estimate: $69.50',
      target: 'Target: <$68.00',
      icon: Scale,
      accentColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50',
    },
  ];

  // --------------------------------------------------------------------------
  // SVG Chart Geometry Calculations for Line Chart
  // --------------------------------------------------------------------------
  const chartWidth = 720;
  const chartHeight = 240;
  const paddingX = 45;
  const paddingY = 30;

  const maxRevenueVal = 6000; // $6,000k = $6.0M max scale
  const minRevenueVal = 2500; // $2,500k = $2.5M min scale

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index * (chartWidth - 2 * paddingX)) / (monthlySalesHistory.length - 1);
    const normalizedY = (val - minRevenueVal) / (maxRevenueVal - minRevenueVal);
    const y = chartHeight - paddingY - normalizedY * (chartHeight - 2 * paddingY);
    return { x, y };
  };

  const actualPoints = useMemo(() => {
    return monthlySalesHistory.map((d, i) => getCoordinates(i, d.actual));
  }, []);

  const budgetPoints = useMemo(() => {
    return monthlySalesHistory.map((d, i) => getCoordinates(i, d.budget));
  }, []);

  // Generate SVG Path String
  const actualPathD = useMemo(() => {
    if (actualPoints.length === 0) return '';
    return actualPoints.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');
  }, [actualPoints]);

  const budgetPathD = useMemo(() => {
    if (budgetPoints.length === 0) return '';
    return budgetPoints.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');
  }, [budgetPoints]);

  // Generate Closed Gradient Area Path String
  const actualAreaPathD = useMemo(() => {
    if (actualPoints.length === 0) return '';
    const firstPt = actualPoints[0];
    const lastPt = actualPoints[actualPoints.length - 1];
    const baseY = chartHeight - paddingY;
    return `${actualPathD} L ${lastPt.x},${baseY} L ${firstPt.x},${baseY} Z`;
  }, [actualPoints, actualPathD]);

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. Header Banner & Executive Controls */}
      {/* ===================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Executive Analytics & Operations
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
              <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              Owner Executive View
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time financial telemetry, production throughput, capacity utilization, and supply-chain KPIs.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Telemetry Status Pill */}
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              Live IoT Feed Connected
            </span>
          </div>

          {/* Audit Trail Quick Link */}
          <Link
            href="/settings/audit"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs"
          >
            <History className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            Audit Trail
          </Link>

          {/* Refresh Action */}
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs"
            title="Refresh analytics data"
          >
            <RefreshCw className={cn('h-3.5 w-3.5 text-slate-500', isRefreshing && 'animate-spin')} />
            Refresh
          </button>

          {/* Export Report Action */}
          <button
            onClick={() => alert('Executive Monthly Performance Report (PDF/Excel) downloaded successfully.')}
            className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm shadow-blue-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            Export Briefing
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. Top Filter Pills Bar (Interactive Filter Controls) */}
      {/* ===================================================================== */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            <Filter className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>Executive Filters:</span>
          </div>

          {/* Filter Pills Grid */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* 1. All Plants */}
            <div className="relative">
              <select
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                aria-label="Filter by Plant"
                className="appearance-none h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-2.5 pr-7 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-colors cursor-pointer"
              >
                {plantOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* 2. All Production Lines */}
            <div className="relative">
              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(e.target.value)}
                aria-label="Filter by Production Line"
                className="appearance-none h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-2.5 pr-7 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-colors cursor-pointer"
              >
                {lineOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* 3. All Products */}
            <div className="relative">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                aria-label="Filter by Product SKU"
                className="appearance-none h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-2.5 pr-7 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-colors cursor-pointer"
              >
                {productOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* 4. All Warehouses */}
            <div className="relative">
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                aria-label="Filter by Warehouse Hub"
                className="appearance-none h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-2.5 pr-7 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-colors cursor-pointer"
              >
                {warehouseOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* 5. Date Range */}
            <div className="relative">
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                aria-label="Filter by Fiscal Period / Date Range"
                className="appearance-none h-8 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/50 pl-2.5 pr-7 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:border-blue-300 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-colors cursor-pointer"
              >
                {dateRangeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Calendar className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>

            {/* Reset Button (Conditional) */}
            {isFilterActive && (
              <button
                onClick={handleResetFilters}
                className="h-8 rounded-lg px-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Quick Filter Tag Summary */}
          <div className="text-[11px] text-slate-400 font-mono text-right hidden xl:block">
            Scope: {selectedPlant === 'ALL' ? 'Enterprise' : selectedPlant} ·{' '}
            {selectedDateRange}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. Top 10 KPI Cards Matching System Reference */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const isUp = kpi.trend === 'up';
          const isDown = kpi.trend === 'down';

          // Color calculation based on favorable flag
          const trendColor = kpi.trendFavorable
            ? isUp
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
              : isDown
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
              : 'text-slate-500 bg-slate-100 dark:bg-slate-800'
            : isUp
            ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'
            : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50';

          return (
            <div
              key={kpi.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
                    {kpi.title}
                  </span>
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', kpi.accentColor)}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono">
                    {kpi.value}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide',
                      trendColor,
                    )}
                  >
                    {isUp ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : isDown ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : null}
                    {kpi.change}
                  </span>
                  {kpi.target && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {kpi.target}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {kpi.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* 4. Chart Section: Line, Bar & Horizontal Bar Visualizations */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ------------------------------------------------------------------- */}
        {/* Chart 1: Monthly Sales Trend (Line Chart with Gradient Fill)       */}
        {/* ------------------------------------------------------------------- */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Monthly Sales & Revenue Trend
                  </h3>
                  <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-300">
                    FY 2026
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Actual realized billing vs budget plan target across all manufacturing lines
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#2563EB]" />
                  <span className="text-slate-700 dark:text-slate-300">Actual Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-3.5 border-t-2 border-dashed border-slate-400" />
                  <span className="text-slate-500 dark:text-slate-400">Budget Target</span>
                </div>
              </div>
            </div>

            {/* Interactive Trend Metrics Banner */}
            <div className="grid grid-cols-3 gap-2 my-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 p-2.5 border border-slate-200/70 dark:border-slate-800/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Peak Month
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                  September ($5.12M)
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  YTD Invoiced
                </span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  $42.63M (+10.8%)
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Average Run-Rate
                </span>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                  $4.26M / month
                </p>
              </div>
            </div>

            {/* Responsive SVG Line Chart */}
            <div className="relative w-full overflow-x-auto pt-2">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-56 select-none"
              >
                <defs>
                  {/* Area Gradient */}
                  <linearGradient id="salesTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
                    <stop offset="85%" stopColor="#2563EB" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>

                  {/* Horizontal Grid lines */}
                  <pattern id="gridLines" width={chartWidth} height="36" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Grid Background */}
                <rect x="0" y="0" width={chartWidth} height={chartHeight} fill="url(#gridLines)" opacity="0.7" />

                {/* Y-Axis Value Labels */}
                <text x="5" y="40" className="text-[10px] fill-slate-400 font-mono">$5.5M</text>
                <text x="5" y="85" className="text-[10px] fill-slate-400 font-mono">$4.5M</text>
                <text x="5" y="130" className="text-[10px] fill-slate-400 font-mono">$3.5M</text>
                <text x="5" y="175" className="text-[10px] fill-slate-400 font-mono">$2.5M</text>

                {/* Budget Path (Dashed) */}
                <path
                  d={budgetPathD}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="5,4"
                />

                {/* Actual Area Fill Under Curve */}
                <path
                  d={actualAreaPathD}
                  fill="url(#salesTrendGradient)"
                />

                {/* Actual Line Path */}
                <path
                  d={actualPathD}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points on Line with Hover Effects */}
                {actualPoints.map((pt, i) => {
                  const dataItem = monthlySalesHistory[i];
                  const isHovered = activeHoverMonth?.month === dataItem.month;

                  return (
                    <g key={dataItem.month} className="cursor-pointer">
                      {/* Active vertical hover guideline */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1="15"
                          x2={pt.x}
                          y2={chartHeight - paddingY}
                          stroke="#2563EB"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                        />
                      )}

                      {/* Outer Ring */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill="#ffffff"
                        stroke="#2563EB"
                        strokeWidth={isHovered ? 3 : 2}
                        onMouseEnter={() => setActiveHoverMonth(dataItem)}
                        className="transition-all duration-150"
                      />

                      {/* Month Label on X-Axis */}
                      <text
                        x={pt.x}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        className={cn(
                          'text-[10px] font-semibold transition-colors',
                          isHovered ? 'fill-[#2563EB] font-bold text-xs' : 'fill-slate-500 dark:fill-slate-400',
                        )}
                        onMouseEnter={() => setActiveHoverMonth(dataItem)}
                      >
                        {dataItem.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Active Hover Month Tooltip Pill */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {activeHoverMonth ? (
                <>
                  Inspecting <strong className="text-slate-900 dark:text-slate-100">{activeHoverMonth.month} 2026</strong>: Actual: <strong className="text-blue-600 font-mono">${(activeHoverMonth.actual / 1000).toFixed(2)}M</strong> vs Budget: <span className="font-mono">${(activeHoverMonth.budget / 1000).toFixed(2)}M</span> ({(((activeHoverMonth.actual - activeHoverMonth.budget) / activeHoverMonth.budget) * 100).toFixed(1)}% delta) · Volume: <span className="font-mono">{activeHoverMonth.units.toLocaleString()} units</span>
                </>
              ) : (
                'Hover over any month on the curve to inspect detailed budget variances and physical unit counts.'
              )}
            </span>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
              MTD Actual: $4.83M
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Chart 2: Sales by Product (Vertical Bar Chart)                     */}
        {/* ------------------------------------------------------------------- */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Sales by Product Family
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Revenue contribution and volume by primary SKU
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                5 Families
              </span>
            </div>

            {/* Vertical Bar Chart Graphic */}
            <div className="mt-4 pt-2">
              <div className="flex items-end justify-between gap-3 h-48 border-b border-slate-200 dark:border-slate-800 px-2 pb-1">
                {productSalesDistribution.map((prod) => {
                  const maxRevenue = 1840000;
                  const heightPercent = Math.max(12, Math.round((prod.revenue / maxRevenue) * 100));

                  return (
                    <div
                      key={prod.id}
                      className="group flex-1 flex flex-col items-center justify-end h-full relative"
                    >
                      {/* Floating Tooltip on Hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-2 py-1 rounded text-[10px] font-mono pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        ${(prod.revenue / 1000).toFixed(0)}k ({prod.percentage}%)
                      </div>

                      {/* Percentage Tag */}
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 font-mono mb-1.5">
                        {prod.percentage}%
                      </span>

                      {/* Bar Fill */}
                      <div
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: prod.color,
                        }}
                        className="w-full rounded-t-lg transition-all duration-300 hover:brightness-110 shadow-xs"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Product Code Labels */}
              <div className="flex items-center justify-between gap-3 px-2 pt-2 text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 text-center">
                {productSalesDistribution.map((prod) => (
                  <span key={prod.id} className="flex-1 truncate" title={prod.product}>
                    {prod.code.replace('FG-', '')}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Breakdown List */}
            <div className="mt-4 space-y-2 divide-y divide-slate-100 dark:divide-slate-800/80">
              {productSalesDistribution.slice(0, 3).map((prod) => (
                <div key={prod.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: prod.color }} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {prod.product}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      ${(prod.revenue / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold ml-1.5">
                      {prod.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Total Catalog Portfolio</span>
            <Link
              href="/inventory/items"
              className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              Item Master <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. Chart 3: Sales by Region (Horizontal Bar Chart) & Telemetry Feed   */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ------------------------------------------------------------------- */}
        {/* Chart 3: Horizontal Bar Chart - Sales by Region                    */}
        {/* ------------------------------------------------------------------- */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Sales by Geographic Region & Distribution Hubs
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Export vs domestic revenue distribution and client accounts (Horizontal Bar Analytics)
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-bold">
                Global Coverage
              </span>
            </div>

            {/* Horizontal Bar Chart Rows */}
            <div className="mt-5 space-y-4">
              {regionalSalesDistribution.map((region) => {
                const maxRegionRevenue = 1835000;
                const widthPercent = Math.max(8, Math.round((region.revenue / maxRegionRevenue) * 100));

                return (
                  <div key={region.region} className="space-y-1.5">
                    {/* Region Header Label & Values */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: region.color }}
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {region.region}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({region.clients} active accounts)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                          {region.growth}
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                          ${(region.revenue / 1000).toLocaleString()}k
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 w-12 text-right">
                          {region.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Bar Progress Fill */}
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: region.color,
                        }}
                        className="h-full rounded-full transition-all duration-500 ease-out shadow-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Total Regional Billed: <strong className="text-slate-900 dark:text-slate-100 font-mono">$4,829,450</strong> across 1,219 corporate customers
            </span>
            <Link
              href="/sales"
              className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              View All Sales Orders <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Plant Floor Telemetry & Machine OEE Quick Feed                      */}
        {/* ------------------------------------------------------------------- */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Shop-Floor Telemetry
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Line utilization & live machine stations
                </p>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="mt-4 space-y-3">
              {/* Line 1 */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950/70 p-3 border border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Line 1: CNC Machining Bay
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                    92% OEE
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Haas ST-20 Lathe</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">JC-2026-0881</span>
                </div>
              </div>

              {/* Line 2 */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950/70 p-3 border border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Line 2: Fiber Laser Profiling
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5">
                    MAINTENANCE
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Trumpf TruLaser 3030</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">MNT-2026-0042</span>
                </div>
              </div>

              {/* Line 3 */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950/70 p-3 border border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Line 3: Hydraulic Assembly Cell
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                    88% OEE
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Hydro-Press HP-400</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">JC-2026-0883</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Shop Floor MES</span>
            <Link
              href="/production/floor"
              className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              Floor Job Cards <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

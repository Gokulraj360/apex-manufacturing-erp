'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Link2,
  Network,
  ShoppingCart,
  Building2,
  Ship,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Plus,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
  Flame,
  Boxes,
  Truck,
  FileSpreadsheet,
} from 'lucide-react';
import {
  SupplyChainOverviewMetrics,
  PurchaseOrderSupplyItem,
  InboundShipmentItem,
  SupplyRiskLogItem,
} from '@/types/supply-chain';

const MOCK_METRICS: SupplyChainOverviewMetrics = {
  activeVendorsCount: 48,
  openPOsCount: 19,
  inTransitShipmentsCount: 12,
  activeRisksCount: 5,
  highSeverityRisksCount: 2,
  mrpPlansCount: 6,
  fleetOnTimeDeliveryRate: 96.8,
  fleetQualityCompliance: 98.2,
  inventoryTurnoverRatio: 7.8,
  averageLeadTimeDays: 8.4,
  costSavingsAchieved: 142500,
  uninterruptedFlowIndex: 99.1,
};

const MOCK_ACTIVE_POS: PurchaseOrderSupplyItem[] = [
  {
    id: 'po-1',
    poNumber: 'POS-2026-0112',
    vendorId: 'vnd-1',
    vendor: {
      id: 'vnd-1',
      vendorCode: 'VND-SUP-001',
      companyName: 'Tata Steel Tubes & Pipes Division',
      contactPerson: 'Anand Mehta',
      email: 'anand.m@tatasteel.internal',
      phone: '+91 98200 44551',
      address: 'Plot 18, Steel Complex',
      city: 'Jamshedpur',
      country: 'India',
      tierRating: 'TIER_1_STRATEGIC',
      categories: ['RAW_METALS', 'TUBES'],
      leadTimeDaysAvg: 7,
      onTimeDeliveryRate: 98.4,
      qualityScore: 99.1,
      costCompetitiveness: 94.0,
      overallScore: 97.4,
      paymentTerms: 'NET_30',
      isActive: true,
    },
    orderDate: '2026-10-04',
    expectedDeliveryDate: '2026-10-11',
    paymentTerms: 'NET_30',
    incoterms: 'FOB',
    status: 'IN_TRANSIT',
    currency: 'USD',
    subtotal: 58000,
    taxAmount: 10440,
    totalAmount: 68440,
    shippingAddress: 'Plant 1 Main Stores, MIDC Chakan, Pune',
    items: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        itemName: 'Seamless Cold Drawn Hydraulic Steel Tubes 80mm',
        orderedQty: 500,
        receivedQty: 0,
        unitPrice: 116,
        lineTotal: 58000,
      },
    ],
    issuedBy: 'Pooja Kulkarni (Procurement Lead)',
    createdAt: '2026-10-04',
  },
  {
    id: 'po-2',
    poNumber: 'POS-2026-0114',
    vendorId: 'vnd-2',
    vendor: {
      id: 'vnd-2',
      vendorCode: 'VND-SUP-002',
      companyName: 'SKF Bearings Industrial Fleet',
      contactPerson: 'David Ross',
      email: 'david.ross@skf.internal',
      phone: '+91 97110 99882',
      address: 'Industrial Corridor Zone 4',
      city: 'Bengaluru',
      country: 'India',
      tierRating: 'TIER_1_STRATEGIC',
      categories: ['BEARINGS', 'ROTARY_COMPONENTS'],
      leadTimeDaysAvg: 5,
      onTimeDeliveryRate: 97.8,
      qualityScore: 99.5,
      costCompetitiveness: 91.2,
      overallScore: 96.6,
      paymentTerms: 'NET_45',
      isActive: true,
    },
    orderDate: '2026-10-05',
    expectedDeliveryDate: '2026-10-10',
    paymentTerms: 'NET_45',
    incoterms: 'CIF',
    status: 'ACKNOWLEDGED',
    currency: 'USD',
    subtotal: 32400,
    taxAmount: 5832,
    totalAmount: 38232,
    shippingAddress: 'Plant 1 Main Stores, MIDC Chakan, Pune',
    items: [
      {
        itemSku: 'CMP-BRG-6208',
        itemName: 'Deep Groove Radial Ball Bearings 6208-2RS',
        orderedQty: 1200,
        receivedQty: 0,
        unitPrice: 27,
        lineTotal: 32400,
      },
    ],
    issuedBy: 'Pooja Kulkarni (Procurement Lead)',
    createdAt: '2026-10-05',
  },
  {
    id: 'po-3',
    poNumber: 'POS-2026-0109',
    vendorId: 'vnd-3',
    vendor: {
      id: 'vnd-3',
      vendorCode: 'VND-SUP-003',
      companyName: 'Wacker Silicones & Polymers',
      contactPerson: 'Kavita Nair',
      email: 'kavita@wacker.internal',
      phone: '+91 94220 33119',
      address: 'Chemical Hub Sector 12',
      city: 'Dahej',
      country: 'India',
      tierRating: 'TIER_2_PREFERRED',
      categories: ['SEALS', 'POLYMERS'],
      leadTimeDaysAvg: 10,
      onTimeDeliveryRate: 93.5,
      qualityScore: 96.0,
      costCompetitiveness: 93.0,
      overallScore: 94.2,
      paymentTerms: 'NET_30',
      isActive: true,
    },
    orderDate: '2026-10-01',
    expectedDeliveryDate: '2026-10-09',
    paymentTerms: 'NET_30',
    incoterms: 'FOB',
    status: 'PARTIALLY_DELIVERED',
    currency: 'USD',
    subtotal: 19800,
    taxAmount: 3564,
    totalAmount: 23364,
    shippingAddress: 'Plant 1 Chemical Stores, MIDC Chakan, Pune',
    items: [
      {
        itemSku: 'RAW-POL-SEAL-R4',
        itemName: 'High Temp Fluorosilicone O-Ring Cordage',
        orderedQty: 600,
        receivedQty: 300,
        unitPrice: 33,
        lineTotal: 19800,
      },
    ],
    issuedBy: 'Arjun Deshmukh (SCM Specialist)',
    createdAt: '2026-10-01',
  },
];

const MOCK_CRITICAL_RISKS: SupplyRiskLogItem[] = [
  {
    id: 'risk-1',
    riskRefNumber: 'RISK-2026-018',
    itemSku: 'RAW-STL-TUBE-80',
    riskCategory: 'PRICE_VOLATILITY',
    severityLevel: 'HIGH',
    likelihood: 'LIKELY',
    impactDescription: 'Global hot-rolled coil index surged 8.2% impacting Q4 tubing contracts.',
    mitigationPlan: 'Executed 3-month forward volume locking contract with Tata Steel at capped index.',
    status: 'MITIGATION_IN_PROGRESS',
    owner: 'Pooja Kulkarni',
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
    riskCategory: 'SINGLE_SOURCE_DEPENDENCY',
    severityLevel: 'MEDIUM',
    likelihood: 'POSSIBLE',
    impactDescription: 'Sole certified vendor for specialized fluorosilicone raw polymer cordage.',
    mitigationPlan: 'Audit second-source validation with Dow Corning underway; sample batch in lab testing.',
    status: 'IDENTIFIED',
    owner: 'Arjun Deshmukh',
    estimatedFinancialExposure: 18500,
    reportedAt: '2026-10-05',
  },
];

export default function SupplyChainOverviewPage() {
  const [metrics] = useState<SupplyChainOverviewMetrics>(MOCK_METRICS);
  const [activePOs] = useState<PurchaseOrderSupplyItem[]>(MOCK_ACTIVE_POS);
  const [criticalRisks] = useState<SupplyRiskLogItem[]>(MOCK_CRITICAL_RISKS);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Link2 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              Supply Chain Management &amp; Material Flow Command
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              Flow Index: {metrics.uninterruptedFlowIndex}%
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            End-to-end Material Requirements Planning (MRP), autonomous procurement, supplier tier scorecards, and multi-modal inbound transit.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/supply-chain/mrp"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-colors"
          >
            <Network className="h-4 w-4" />
            MRP Forecast Console
          </Link>
          <Link
            href="/supply-chain/procurement"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-xs transition-colors"
          >
            <ShoppingCart className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            Procurement &amp; POs
          </Link>
          <Link
            href="/supply-chain/inbound"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-xs transition-colors"
          >
            <Ship className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            Inbound Fleet
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-cyan-500/30 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Uninterrupted Material Flow</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{metrics.uninterruptedFlowIndex}%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">zero stockouts</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-600 dark:text-cyan-300">
            Across 24 active production lines
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Open PO Pipeline</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{metrics.openPOsCount} POs</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">issued</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Total pipeline: $428,000 committed</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inbound Transit Fleet</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Ship className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{metrics.inTransitShipmentsCount} Shipments</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400/90 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Avg delivery lead time: {metrics.averageLeadTimeDays} days</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inventory Turnover Ratio</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{metrics.inventoryTurnoverRatio}x</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Turns/yr</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">
            YTD Cost Savings: ${metrics.costSavingsAchieved.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Cross-Department Synchronization Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Network className="h-3.5 w-3.5" />
              Production &amp; MRP Alignment
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">SYNCHRONIZED</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Current 12-week MRP plan accounts for 32 active work orders. Safety stock buffers automated for critical alloy bar stocks.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80">
            <span>Forecasted SKU Requirements: 84 items</span>
            <Link href="/supply-chain/mrp" className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5">
              Review Plan <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Tier 1 Strategic Suppliers
            </span>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">48 ENROLLED</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Average supplier on-time delivery rate is <strong>96.8%</strong> with zero critical material defects on inbound dock inspections.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80">
            <span>Overall Score: 94.6/100</span>
            <Link href="/supply-chain/vendors" className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5">
              Vendor Scorecards <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Supply Risk Watchlist
            </span>
            <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">2 HIGH PRIORITY</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Active monitoring on steel index volatility and raw fluorosilicone dependency. Active mitigations in progress.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80">
            <span>Exposure: $60,500</span>
            <Link href="/supply-chain/analytics" className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5">
              Mitigation Radar <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Section: Active Purchase Orders & Live Transit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Purchase Orders Pipeline (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Purchase Orders Pipeline</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">({activePOs.length} high-value orders)</span>
            </div>
            <Link
              href="/supply-chain/procurement"
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              View All Orders <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">PO Number &amp; Date</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Primary SKU &amp; Qty</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Expected Delivery</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {activePOs.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white font-mono">{po.poNumber}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{po.orderDate}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 dark:text-slate-200">{po.vendor?.companyName}</div>
                      <div className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 mt-0.5">
                        {po.vendor?.vendorCode} • {po.vendor?.tierRating?.replace('_', ' ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-900 dark:text-slate-200 font-medium">{po.items[0]?.itemSku}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                        {po.items[0]?.itemName} ({po.items[0]?.orderedQty} units)
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      ${po.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Clock className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span>{po.expectedDeliveryDate}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {po.status === 'IN_TRANSIT' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          IN TRANSIT
                        </span>
                      )}
                      {po.status === 'ACKNOWLEDGED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          ACKNOWLEDGED
                        </span>
                      )}
                      {po.status === 'PARTIALLY_DELIVERED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          PARTIAL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Supply Risk Feed (1 Col) */}
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Supply Risk Feed</h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-semibold">
                RISK RADAR
              </span>
            </div>

            <div className="p-4 space-y-3.5">
              {criticalRisks.map((risk) => (
                <div
                  key={risk.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{risk.riskRefNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        risk.severityLevel === 'HIGH'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {risk.severityLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{risk.impactDescription}</p>

                  <div className="p-2 rounded bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-[11px] text-cyan-700 dark:text-cyan-300">
                    <span className="font-semibold block text-slate-500 dark:text-slate-400 mb-0.5">Mitigation Action:</span>
                    {risk.mitigationPlan}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>Exposure: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">${risk.estimatedFinancialExposure.toLocaleString()}</strong></span>
                    <span>Owner: {risk.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
            <Link
              href="/supply-chain/analytics"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Open Full Risk Matrix &amp; Turnover Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

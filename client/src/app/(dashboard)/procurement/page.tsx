'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  FileSpreadsheet,
  Scale,
  PackageCheck,
  BookOpen,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Building2,
  Truck,
  ArrowUpRight,
  Layers,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import {
  ProcurementOverviewMetrics,
  PurchaseRequisitionItem,
  RequestForQuotationItem,
  PurchaseOrderProcurementItem,
} from '@/types/procurement';
import { PlainEnglishBanner } from '@/components/PlainEnglishBanner';

const MOCK_METRICS: ProcurementOverviewMetrics = {
  openRequisitionsCount: 14,
  pendingApprovalCost: 184200,
  activeRFQsCount: 6,
  openPOsCount: 22,
  totalCommittedSpend: 462000,
  averageNegotiatedSavingsPct: 8.6,
  onTimeDeliveryComplianceRate: 96.8,
  activePriceLockContractsCount: 28,
  catalogSkusCount: 184,
};

const MOCK_URGENT_PRS: PurchaseRequisitionItem[] = [
  {
    id: 'pr-1',
    requisitionNumber: 'PR-2026-0091',
    requestedBy: 'Amit Joshi (Plant 1 Machine Shop)',
    department: 'CNC Machining Division',
    requiredByDate: '2026-10-14',
    priority: 'CRITICAL',
    status: 'PENDING_APPROVAL',
    totalEstimatedCost: 28400,
    justification: 'Automotive cylinder head batch run starting next week. Low on SS316 billets.',
    items: [
      {
        itemSku: 'RAW-STL-316-BILLET',
        itemName: 'Stainless Steel 316 Square Billets 100mm',
        quantity: 250,
        uom: 'PCS',
        estimatedUnitPrice: 113.6,
      },
    ],
    createdAt: '2026-10-06T09:30:00Z',
  },
  {
    id: 'pr-2',
    requisitionNumber: 'PR-2026-0092',
    requestedBy: 'Sunil Rao (Toolroom Lead)',
    department: 'Tool & Die Maintenance',
    requiredByDate: '2026-10-18',
    priority: 'HIGH',
    status: 'APPROVED',
    totalEstimatedCost: 14200,
    justification: 'Replacement carbide end mills and coolant concentrates for quarterly overhaul.',
    items: [
      {
        itemSku: 'TOOL-EM-CARB-12MM',
        itemName: 'Solid Carbide 4-Flute End Mill 12mm TiAlN',
        quantity: 80,
        uom: 'PCS',
        estimatedUnitPrice: 177.5,
      },
    ],
    createdAt: '2026-10-06T14:15:00Z',
  },
];

const MOCK_ACTIVE_RFQS: RequestForQuotationItem[] = [
  {
    id: 'rfq-1',
    rfqNumber: 'RFQ-2026-0041',
    title: 'High-Tensile Fasteners & Grade 8.8 Hex Bolts',
    status: 'EVALUATION',
    deadlineDate: '2026-10-10',
    targetDeliveryDate: '2026-10-25',
    paymentTerms: 'NET_30',
    deliveryTerms: 'FOB MIDC Chakan',
    items: [
      {
        itemSku: 'FAST-HEX-M16-88',
        itemName: 'High-Tensile Zinc Flake Hex Bolt M16x60mm Gr 8.8',
        requiredQty: 10000,
        uom: 'PCS',
        targetPrice: 0.42,
      },
    ],
    createdBy: 'Pooja Kulkarni (Procurement)',
    _count: { bids: 4 },
  },
  {
    id: 'rfq-2',
    rfqNumber: 'RFQ-2026-0044',
    title: 'Precision Seamless Hydraulic Tubes 60mm & 80mm',
    status: 'PUBLISHED',
    deadlineDate: '2026-10-12',
    targetDeliveryDate: '2026-10-28',
    paymentTerms: 'NET_30',
    deliveryTerms: 'FOB Plant Dock',
    items: [
      {
        itemSku: 'TUBE-HYD-SEAM-60',
        itemName: 'Seamless Cold Drawn Hydraulic Steel Tubes 60mm OD',
        requiredQty: 600,
        uom: 'MTRS',
        targetPrice: 28.5,
      },
    ],
    createdBy: 'Nitin Pawar (Senior Sourcing)',
    _count: { bids: 2 },
  },
];

const MOCK_UPCOMING_DELIVERIES: PurchaseOrderProcurementItem[] = [
  {
    id: 'po-1',
    poNumber: 'PO-PROC-2026-0151',
    vendorName: 'Tata Steel Tubes & Pipes Division',
    vendorEmail: 'sales@tatasteel.com',
    vendorPhone: '+91 98200 44551',
    vendorAddress: 'Jamshedpur Works',
    orderDate: '2026-10-01',
    promisedDeliveryDate: '2026-10-09',
    status: 'IN_TRANSIT',
    currency: 'USD',
    subtotal: 58000,
    taxAmount: 10440,
    discountAmount: 2000,
    totalAmount: 66440,
    paymentTerms: 'NET_30',
    deliveryAddress: 'Central Raw Material Stores, Plant #1, Pune',
    items: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        itemName: 'Hydraulic Seamless Tubes 80mm',
        orderedQty: 500,
        unitPrice: 116,
        lineTotal: 58000,
      },
    ],
    issuedBy: 'Pooja Kulkarni',
    remindersSentCount: 1,
  },
  {
    id: 'po-2',
    poNumber: 'PO-PROC-2026-0154',
    vendorName: 'Sandvik Coromant Cutting Tools',
    vendorEmail: 'orders@sandvik.com',
    vendorPhone: '+91 98112 33445',
    vendorAddress: 'Pune Tech Center',
    orderDate: '2026-10-03',
    promisedDeliveryDate: '2026-10-11',
    status: 'ACKNOWLEDGED',
    currency: 'USD',
    subtotal: 24500,
    taxAmount: 4410,
    discountAmount: 1200,
    totalAmount: 27710,
    paymentTerms: 'NET_45',
    deliveryAddress: 'Tool Crib Central Stores',
    items: [
      {
        itemSku: 'TOOL-INSRT-CNMG-432',
        itemName: 'CNMG 432 Carbide Turning Inserts',
        orderedQty: 400,
        unitPrice: 61.25,
        lineTotal: 24500,
      },
    ],
    issuedBy: 'Nitin Pawar',
    remindersSentCount: 0,
  },
];

export default function ProcurementOverviewPage() {
  const [metrics] = useState<ProcurementOverviewMetrics>(MOCK_METRICS);
  const [urgentPRs] = useState<PurchaseRequisitionItem[]>(MOCK_URGENT_PRS);
  const [activeRFQs] = useState<RequestForQuotationItem[]>(MOCK_ACTIVE_RFQS);
  const [upcomingDeliveries] = useState<PurchaseOrderProcurementItem[]>(MOCK_UPCOMING_DELIVERIES);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <ShoppingCart className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Purchasing & Material Sourcing Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            End-to-end procurement orchestration: Requisition reviews, RFQ bid evaluations, automated PO conversions, volume discount contracts, and delivery schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/procurement/requisitions"
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Review Requisitions ({metrics.openRequisitionsCount})
          </Link>
          <Link
            href="/procurement/rfqs"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            <Scale className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> RFQ Workspace
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
            title="Refresh Procurement Telemetry"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Unified Procurement Hub Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Link
          href="/procurement"
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-xs"
        >
          Procurement Command Center
        </Link>
        <Link
          href="/procurement/requisitions"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Purchase Requests (PR)
        </Link>
        <Link
          href="/procurement/rfqs"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Vendor Quotes (RFQ) & Bidding
        </Link>
        <Link
          href="/procurement/purchase-orders"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Purchase Orders (PO)
        </Link>
        <Link
          href="/procurement/contracts"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Price-Lock Contracts & SLAs
        </Link>
      </div>

      {/* Plain-English Explainer Guide for Procurement */}
      <PlainEnglishBanner
        moduleName="Sourcing & Supplier Procurement Hub"
        whatItDoes="Coordinates purchase requests from factory teams, collects competitive price quotes from vendors (RFQs), issues binding Purchase Orders (POs), and locks in negotiated supplier prices."
        whyItMatters="Stops unauthorized company spending, secures volume price discounts, and guarantees raw materials arrive before factory assembly lines run dry."
        metrics={[
          {
            acronym: 'PR (Purchase Requisition)',
            plainName: 'Internal Department Purchase Request',
            explanation: 'An internal request created by a plant team asking purchasing to buy needed parts or tools.',
          },
          {
            acronym: 'RFQ (Request for Quotation)',
            plainName: 'Vendor Competitive Price Tender',
            explanation: 'Sending identical part specifications to multiple suppliers to get their best price and delivery time before choosing.',
          },
          {
            acronym: 'PO (Purchase Order)',
            plainName: 'Official Legal Purchase Contract',
            explanation: 'The legally binding order sent to the chosen vendor authorizing shipment and guaranteeing payment terms (e.g. Net 30).',
          },
        ]}
        quickSteps={[
          '1. Approve pending internal departmental purchase requests (PRs)',
          '2. Issue competitive RFQ bids to multiple suppliers and compare pricing matrices',
          '3. Sign off and transmit formal Purchase Orders (POs) directly to suppliers',
        ]}
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Open PRs</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{metrics.openRequisitionsCount}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">${(metrics.pendingApprovalCost / 1000).toFixed(0)}k</span>
            <span>Pending Value</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/40 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active RFQs</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{metrics.activeRFQsCount}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">19 Bids</span>
            <span>under evaluation</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Committed POs</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <PackageCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{metrics.openPOsCount}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">${(metrics.totalCommittedSpend / 1000).toFixed(0)}k</span>
            <span>Committed Value</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Negotiated Savings</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{metrics.averageNegotiatedSavingsPct}%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">-$38.4k</span>
            <span>vs Baseline Price</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vendor On-Time</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">{metrics.onTimeDeliveryComplianceRate}%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">98.2%</span>
            <span>Target Standard</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price Lock Deals</span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 tracking-tight">{metrics.activePriceLockContractsCount}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-teal-600 dark:text-teal-400 font-semibold">{metrics.catalogSkusCount}</span>
            <span>Catalog Materials</span>
          </div>
        </div>
      </div>

      {/* Grid: Urgent Requisitions & Active RFQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Urgent Material Requisitions */}
        <div className="rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <FileSpreadsheet className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Urgent Material Requests (Production & Warehouse)</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Approved PRs awaiting automated PO generation</p>
              </div>
            </div>
            <Link
              href="/procurement/requisitions"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              PR Queue <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {urgentPRs.map((pr) => (
              <div
                key={pr.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 dark:text-white font-mono text-xs">{pr.requisitionNumber}</div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        pr.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {pr.priority}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        pr.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      {pr.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">{pr.department}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{pr.justification}</div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    Est. Total: <strong className="text-slate-900 dark:text-white">${pr.totalEstimatedCost.toLocaleString()}</strong>
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Need Date: {pr.requiredByDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active RFQs & Bids in Evaluation */}
        <div className="rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Scale className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Requests for Quotation (RFQ) in Progress</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Competitive bid evaluations and pricing negotiation</p>
              </div>
            </div>
            <Link
              href="/procurement/rfqs"
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-medium flex items-center gap-1"
            >
              Bid Matrix <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeRFQs.map((rfq) => (
              <div
                key={rfq.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 dark:text-white font-mono text-xs">{rfq.rfqNumber}</div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    {rfq.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{rfq.title}</div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    Bids Received: <strong className="text-emerald-600 dark:text-emerald-400">{rfq._count?.bids || 0} Suppliers</strong>
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium">Closes: {rfq.deadlineDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deliveries Schedule Monitor */}
      <div className="rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Truck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Upcoming Material Inbound Deliveries</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Active purchase orders scheduled for factory dock arrival</p>
            </div>
          </div>
          <Link
            href="/procurement/purchase-orders"
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium flex items-center gap-1"
          >
            All Purchase Orders <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier & Facility</th>
                <th className="py-3 px-4">Material Lines</th>
                <th className="py-3 px-4">Promised Delivery</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300 font-normal">
              {upcomingDeliveries.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                    {po.poNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 dark:text-white">{po.vendorName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{po.vendorEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 dark:text-slate-200">{po.items[0]?.itemName}</div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {po.items[0]?.orderedQty} units @ ${po.items[0]?.unitPrice}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{po.promisedDeliveryDate}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">Ordered: {po.orderDate}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    ${po.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        po.status === 'IN_TRANSIT'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {po.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/procurement/purchase-orders?po=${po.poNumber}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-[11px] font-medium transition-all"
                    >
                      Track Order
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

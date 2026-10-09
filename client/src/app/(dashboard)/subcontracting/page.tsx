'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Share2,
  FileSpreadsheet,
  Truck,
  PackageCheck,
  Receipt,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Plus,
  RefreshCw,
  Zap,
  Layers,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  SubcontractingOverviewMetrics,
  JobWorkOrderItem,
  SubcontractorReceiptItem,
} from '@/types/subcontracting';

const MOCK_ACTIVE_ORDERS: JobWorkOrderItem[] = [
  {
    id: 'jwo-1',
    orderNumber: 'JWO-2026-0042',
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
    processType: 'ELECTROPLATING',
    processDescription: 'Hard Chrome Electroplating 25 Micron on Piston Rods',
    targetProductPart: 'Hydraulic Piston Rod PR-90',
    inputItemSku: 'RAW-ROD-90',
    outputItemSku: 'FIN-ROD-90-PLATED',
    targetQuantity: 500,
    receivedQuantity: 320,
    rejectedQuantity: 4,
    scrapAllowancePercent: 2.0,
    unitProcessingRate: 18.5,
    totalOrderValue: 9250,
    status: 'IN_PROGRESS',
    issuedDate: '2026-10-04',
    expectedDeliveryDate: '2026-10-10',
  },
  {
    id: 'jwo-2',
    orderNumber: 'JWO-2026-0043',
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
    processType: 'HEAT_TREATMENT',
    processDescription: 'Vacuum Gas Quenching & Case Hardening 58-62 HRC',
    targetProductPart: 'Helical Drive Pinion Gear PG-44',
    inputItemSku: 'RAW-GEAR-44',
    outputItemSku: 'HT-GEAR-44-HARDENED',
    targetQuantity: 250,
    receivedQuantity: 0,
    rejectedQuantity: 0,
    scrapAllowancePercent: 1.5,
    unitProcessingRate: 34.0,
    totalOrderValue: 8500,
    status: 'ISSUED',
    issuedDate: '2026-10-06',
    expectedDeliveryDate: '2026-10-12',
  },
  {
    id: 'jwo-3',
    orderNumber: 'JWO-2026-0040',
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
    processType: 'DIE_CASTING',
    processDescription: 'High Pressure Aluminium Die Casting ADC12',
    targetProductPart: 'Motor End Shield Flange MS-112',
    inputItemSku: 'INGOT-AL-ADC12',
    outputItemSku: 'CAST-FLANGE-112',
    targetQuantity: 800,
    receivedQuantity: 800,
    rejectedQuantity: 12,
    scrapAllowancePercent: 2.5,
    unitProcessingRate: 42.0,
    totalOrderValue: 33600,
    status: 'COMPLETED',
    issuedDate: '2026-09-28',
    expectedDeliveryDate: '2026-10-05',
    completedDate: '2026-10-05',
  },
];

const MOCK_PENDING_RECEIPTS: SubcontractorReceiptItem[] = [
  {
    id: 'rcp-1',
    receiptNumber: 'SR-2026-0081',
    jobWorkOrderId: 'jwo-1',
    jobWorkOrder: {
      orderNumber: 'JWO-2026-0042',
      processDescription: 'Hard Chrome Electroplating 25 Micron',
      targetProductPart: 'Hydraulic Piston Rod PR-90',
      targetQuantity: 500,
      receivedQuantity: 320,
      scrapAllowancePercent: 2.0,
    },
    challanId: 'ch-1',
    challan: {
      id: 'ch-1',
      challanNumber: 'DC-SC-2026-0091',
      totalQuantitySent: 350,
      status: 'PARTIALLY_RETURNED',
    },
    vendorId: 'ven-1',
    vendor: {
      id: 'ven-1',
      vendorCode: 'VEN-SC-001',
      companyName: 'Apex Electroplating & Surface Coatings Ltd',
    },
    receiptDate: '2026-10-07 14:30',
    receivedQuantity: 320,
    acceptedQuantity: 316,
    rejectedQuantity: 4,
    scrapReported: 2,
    qualityStatus: 'PENDING_INSPECTION',
    inspectorName: 'Suresh Patil (QA Lead)',
    reconciliationVariance: 28,
    isReconciliationBalanced: false,
  },
];

export default function SubcontractingOverviewPage() {
  const [activeOrders] = useState<JobWorkOrderItem[]>(MOCK_ACTIVE_ORDERS);
  const [pendingReceipts] = useState<SubcontractorReceiptItem[]>(MOCK_PENDING_RECEIPTS);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Share2 className="h-6 w-6 text-teal-400" />
              Subcontracting &amp; Outsourced Manufacturing Operations Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-500/30">
              Active Vendors: 12
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            End-to-end Job Work Order (JWO) execution, returnable delivery challans, input-output material reconciliation, and vendor SLA turnarounds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/subcontracting/work-orders"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-lg shadow-teal-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Issue Job Work Order
          </Link>
          <Link
            href="/subcontracting/challans"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors"
          >
            <Truck className="h-4 w-4 text-teal-400" />
            Generate Challan
          </Link>
          <Link
            href="/subcontracting/billing"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors"
          >
            <Receipt className="h-4 w-4 text-teal-400" />
            Processing Bills
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a]/80 border border-teal-500/30 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-teal-400 uppercase tracking-wider">Active Outsourced JWOs</span>
            <div className="h-8 w-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <FileSpreadsheet className="h-4 w-4 text-teal-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">14 Orders</span>
            <span className="text-xs text-slate-400">across 6 vendors</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-teal-300">
            <span>Plating, Heat Treatment &amp; Casting</span>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dispatched WIP Valuation</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Truck className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">$148,200</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Covered under 18 active delivery challans</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">On-Time TAT Compliance</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">94.6%</span>
            <span className="text-xs text-emerald-400 font-medium">Avg: 3.4 Days</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Target turnaround &lt; 4.0 days maintained</span>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Material Reconciliation</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <PackageCheck className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400 font-mono">98.2%</span>
            <span className="text-xs text-slate-400">Balanced</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-300">
            1 open variance pending vendor explanation
          </div>
        </div>
      </div>

      {/* Main Grid: Active Outsourced Orders & Pending Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Job Work Orders in Process */}
        <div className="lg:col-span-2 bg-[#0f172a]/80 border border-slate-800 rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-teal-400" />
              <div>
                <h2 className="text-sm font-semibold text-white">Outsourced Job Work Pipeline</h2>
                <p className="text-xs text-slate-400">Specialized surface finishing, plating, and casting allocations</p>
              </div>
            </div>
            <Link
              href="/subcontracting/work-orders"
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium transition-colors"
            >
              All Orders <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeOrders.map((jwo) => {
              const progressPct = jwo.targetQuantity > 0 ? (jwo.receivedQuantity / jwo.targetQuantity) * 100 : 0;
              return (
                <div
                  key={jwo.id}
                  className="p-3 bg-[#0b0f19] border border-slate-800 hover:border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-400">{jwo.orderNumber}</span>
                      <span className="text-xs text-slate-400 font-mono">[{jwo.vendor?.vendorCode}]</span>
                      <span className="text-xs font-semibold text-white">{jwo.vendor?.companyName}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{jwo.processDescription}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Part: <strong className="text-slate-300">{jwo.targetProductPart}</strong></span>
                      <span>Target: <strong className="text-slate-300">{jwo.targetQuantity} pcs</strong></span>
                      <span>Rate: <strong className="text-teal-300">${jwo.unitProcessingRate}/pc</strong></span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        jwo.status === 'IN_PROGRESS'
                          ? 'bg-teal-950/80 text-teal-300 border border-teal-500/30'
                          : jwo.status === 'COMPLETED'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {jwo.status.replace('_', ' ')}
                    </span>
                    <div className="text-[11px] font-mono text-slate-400">
                      Progress: <strong className="text-white">{progressPct.toFixed(0)}%</strong> ({jwo.receivedQuantity}/{jwo.targetQuantity})
                    </div>
                    <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Inbound Receipts Awaiting QC & Material Balance */}
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-teal-400" />
              <div>
                <h2 className="text-sm font-semibold text-white">Inbound Receipts Pending QC</h2>
                <p className="text-xs text-slate-400">Material reconciliation handover</p>
              </div>
            </div>
            <Link
              href="/subcontracting/receipts"
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium transition-colors"
            >
              Verify <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingReceipts.map((rcp) => (
              <div
                key={rcp.id}
                className="p-3 bg-[#0b0f19] border border-amber-500/30 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">{rcp.receiptNumber}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/30">
                    QC Pending
                  </span>
                </div>
                <div className="text-xs font-medium text-white">{rcp.jobWorkOrder?.targetProductPart}</div>
                <div className="text-[11px] text-slate-400">
                  Vendor: <strong className="text-slate-300">{rcp.vendor?.companyName}</strong>
                </div>

                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500">Recv Qty:</span> <strong className="text-white">{rcp.receivedQuantity}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Challan Sent:</span> <strong className="text-white">{rcp.challan?.totalQuantitySent}</strong>
                  </div>
                </div>

                <div className="p-2 bg-amber-950/20 border border-amber-500/20 rounded text-[10px] text-amber-300 flex items-center justify-between">
                  <span>Balance Variance: <strong>{rcp.reconciliationVariance} pcs</strong> remaining</span>
                  <Link
                    href="/subcontracting/receipts"
                    className="text-teal-400 hover:underline font-semibold"
                  >
                    Reconcile &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Subcontractor SLA Snapshot */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
            <div className="font-semibold text-white flex items-center justify-between">
              <span>Top Vendor Quality SLA</span>
              <span className="text-emerald-400 font-mono">Tier 1</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Apex Electroplating: <strong className="text-emerald-400">98.2%</strong> (2.8d TAT)
            </div>
            <div className="text-[11px] text-slate-400">
              Bharat Heat Treaters: <strong className="text-emerald-400">96.5%</strong> (3.5d TAT)
            </div>
            <Link
              href="/subcontracting/analytics"
              className="text-teal-400 text-[11px] font-medium hover:underline inline-block pt-1"
            >
              View Full Vendor Scorecards &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

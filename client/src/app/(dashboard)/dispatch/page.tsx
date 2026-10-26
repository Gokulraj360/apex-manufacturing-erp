'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Truck,
  PackageSearch,
  Barcode,
  Grid,
  RotateCcw,
  CheckCircle2,
  Clock,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  Package,
  Layers,
  ChevronRight,
  Plus,
  Search,
} from 'lucide-react';
import { DispatchShipmentItem } from '@/types/dispatch';

const RECENT_SHIPMENTS: DispatchShipmentItem[] = [
  {
    id: 'shp-1',
    shipmentNumber: 'DSP-SHP-2026-042',
    deliveryChallanNumber: 'DC-2026-018',
    salesOrderNumber: 'SO-2026-104',
    customerName: 'Reliance Retail Digital Stores',
    carrierName: 'Vanguard Freight Logistics',
    vehicleNumber: 'MH-12-QW-9901',
    driverName: 'Harish Rawat',
    driverContact: '+91 98765 43210',
    gatePassNumber: 'GP-2026-0891',
    sealNumber: 'SEAL-SEC-99012',
    status: 'IN_TRANSIT',
    totalWeightKg: 4250.0,
    cartonsCount: 42,
    loadedBy: 'Rajesh Mehra',
    loadedAt: '2026-10-07 10:30',
    dispatchedAt: '2026-10-07 11:15',
    estimatedDelivery: '2026-10-09 18:00',
    createdAt: '2026-10-07 09:00',
  },
  {
    id: 'shp-2',
    shipmentNumber: 'DSP-SHP-2026-043',
    deliveryChallanNumber: 'DC-2026-019',
    salesOrderNumber: 'SO-2026-108',
    customerName: 'Vijay Sales Electronics Hub',
    carrierName: 'Express Blue Haulage',
    vehicleNumber: 'KA-04-TR-4421',
    driverName: 'Suresh Kumar',
    driverContact: '+91 91234 56789',
    gatePassNumber: 'GP-2026-0892',
    sealNumber: 'SEAL-SEC-99015',
    status: 'LOADING',
    totalWeightKg: 1840.0,
    cartonsCount: 20,
    loadedBy: 'Sunil Rao',
    loadedAt: '2026-10-07 12:00',
    createdAt: '2026-10-07 11:00',
  },
  {
    id: 'shp-3',
    shipmentNumber: 'DSP-SHP-2026-041',
    deliveryChallanNumber: 'DC-2026-017',
    salesOrderNumber: 'SO-2026-098',
    customerName: 'Croma Megastores Distribution',
    carrierName: 'National Freight Cargo',
    vehicleNumber: 'DL-01-AB-1122',
    driverName: 'Manish Singh',
    driverContact: '+91 99887 76655',
    gatePassNumber: 'GP-2026-0885',
    sealNumber: 'SEAL-SEC-98990',
    status: 'DELIVERED',
    totalWeightKg: 6500.0,
    cartonsCount: 65,
    loadedBy: 'Rajesh Mehra',
    loadedAt: '2026-10-06 08:30',
    dispatchedAt: '2026-10-06 09:30',
    deliveredAt: '2026-10-07 08:45',
    createdAt: '2026-10-06 08:00',
  },
];

export default function DispatchOverviewPage() {
  const [shipments] = useState<DispatchShipmentItem[]>(RECENT_SHIPMENTS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 dark:text-orange-400" />
              Finished Goods Packaging & Dispatch Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
              Active Dispatch Bay
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live tracking of packed master cartons, barcode labels, customer order fulfillment, and delivery truck loading.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dispatch/shipping"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition shadow-sm"
          >
            <Truck className="w-4 h-4" />
            Shipping & Delivery Portal
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">On-Time Dispatch Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">99.4%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +0.8%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">On-time departure SLA benchmark</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Packing & Barcode Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">99.8%</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Barcode scanned</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero barcode scan mismatches</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ready-to-Ship Value</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-mono">₹4.78 Cr</span>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">1,240 units staged</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across 18 finished goods bays</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trucks on Road & Loading</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">8 Trucks</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Loading & Transit</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gate pass security verified</p>
        </div>
      </div>

      {/* Operations Quick Jump Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link
          href="/dispatch/storage"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
              Bays <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm">Finished Goods Storage Bays</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Storage rack capacity & ready-to-ship inventory mapping.
          </p>
        </Link>

        <Link
          href="/dispatch/packaging"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Barcode className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
              Labels <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm">Box Packing & Barcode Labels</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            GS1-128 barcode generation and carton box labeling.
          </p>
        </Link>

        <Link
          href="/dispatch/picking"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <PackageSearch className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
              Queue <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm">Order Packing & Staging Area</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Approved customer orders packing & staging bay management.
          </p>
        </Link>

        <Link
          href="/dispatch/shipping"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              Loading <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm">Truck Loading & Gate Pass</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Security gate pass, truck seal check, and delivery slip verification.
          </p>
        </Link>

        <Link
          href="/dispatch/returns"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
              Returns <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm">Customer Returns & Repairs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customer returns check, damage claims & repair queue.
          </p>
        </Link>
      </div>

      {/* Live Outbound Shipments Board */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              Active Shipments & Truck Loading Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Truck loading queue linked with Delivery Slips
            </p>
          </div>
          <Link
            href="/dispatch/shipping"
            className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold flex items-center gap-1"
          >
            View All Shipments <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {shipments.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${
                    s.status === 'DELIVERED'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : s.status === 'IN_TRANSIT'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{s.shipmentNumber}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">[{s.deliveryChallanNumber}]</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        s.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : s.status === 'IN_TRANSIT'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {s.status === 'DELIVERED' ? 'Delivered' : s.status === 'IN_TRANSIT' ? 'On Road' : 'Loading at Dock'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
                    Customer: <strong className="text-slate-900 dark:text-white">{s.customerName}</strong>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Carrier: {s.carrierName} ({s.vehicleNumber}) • Seal: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{s.sealNumber}</strong> • Gate Pass: {s.gatePassNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono self-end md:self-center">
                <div className="text-right">
                  <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Weight / Cartons</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{s.totalWeightKg} kg • {s.cartonsCount} boxes</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Loaded By</span>
                  <span className="text-slate-700 dark:text-slate-300">{s.loadedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

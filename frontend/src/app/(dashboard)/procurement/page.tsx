'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  Building2,
  Calendar,
  AlertTriangle,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  Send,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Sample Data
// ============================================================================

export type POStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'ISSUED'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED'
  | 'CANCELLED';

export interface POItemLine {
  id: string;
  itemId: string;
  code: string;
  name: string;
  uom: string;
  quantity: number;
  receivedQty: number;
  unitRate: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  vendorName: string;
  vendorGstin: string;
  vendorRating: number;
  requisitionNumber?: string;
  mpsPlanNumber?: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: POStatus;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paymentTerms: string;
  notes?: string;
  items: POItemLine[];
}

const initialPurchaseOrders: PurchaseOrderRecord[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-041',
    vendorName: 'Tata Steel Special Alloy Steels Ltd',
    vendorGstin: '27AAACT0012P1ZR',
    vendorRating: 4.9,
    requisitionNumber: 'PR-2026-091A',
    mpsPlanNumber: 'MPS-2026-001',
    orderDate: '2026-03-24',
    expectedDeliveryDate: '2026-04-03',
    status: 'APPROVED',
    subtotal: 7525.0,
    gstAmount: 1354.5,
    totalAmount: 8879.5,
    paymentTerms: 'NET 30',
    notes: 'Urgent hot-rolled 1018 steel coil delivery for triplex plunger pump manufacturing run.',
    items: [
      {
        id: 'poi-1',
        itemId: 'item-1',
        code: 'RAW-STL-001',
        name: 'Cold-Rolled Carbon Steel Coil 1018 (Billet Blank)',
        uom: 'KG',
        quantity: 3500,
        receivedQty: 0,
        unitRate: 2.15,
        gstRate: 18.0,
        gstAmount: 1354.5,
        totalAmount: 8879.5,
      },
    ],
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-042',
    vendorName: 'Moog Precision Coreless Motors Inc',
    vendorGstin: '29AABCM8821N1ZS',
    vendorRating: 4.8,
    requisitionNumber: 'PR-2026-092B',
    mpsPlanNumber: 'MPS-2026-001',
    orderDate: '2026-03-25',
    expectedDeliveryDate: '2026-04-08',
    status: 'PENDING',
    subtotal: 2220.0,
    gstAmount: 399.6,
    totalAmount: 2619.6,
    paymentTerms: 'NET 45',
    notes: 'Brushless DC coreless 48V motors. QC calibration and torque certificate required.',
    items: [
      {
        id: 'poi-2',
        itemId: 'item-4',
        code: 'RAW-MTR-003',
        name: 'Brushless DC Coreless Motor 48V (750W)',
        uom: 'PCS',
        quantity: 15,
        receivedQty: 0,
        unitRate: 148.0,
        gstRate: 18.0,
        gstAmount: 399.6,
        totalAmount: 2619.6,
      },
    ],
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-039',
    vendorName: 'SKF Bearings India Commercial Ltd',
    vendorGstin: '27AABCS5512B1ZY',
    vendorRating: 5.0,
    requisitionNumber: 'PR-2026-088',
    orderDate: '2026-03-15',
    expectedDeliveryDate: '2026-03-24',
    status: 'RECEIVED',
    subtotal: 1750.0,
    gstAmount: 315.0,
    totalAmount: 2065.0,
    paymentTerms: 'NET 30',
    notes: 'Induction heated precision ball bearings; Goods Receipt Note GRN-2026-018 posted to inventory.',
    items: [
      {
        id: 'poi-3',
        itemId: 'item-5',
        code: 'BRG-6205-2RS',
        name: 'Deep Groove Radial Ball Bearing 25x52x15',
        uom: 'PCS',
        quantity: 200,
        receivedQty: 200,
        unitRate: 8.75,
        gstRate: 18.0,
        gstAmount: 315.0,
        totalAmount: 2065.0,
      },
    ],
  },
  {
    id: 'po-4',
    poNumber: 'PO-2026-040',
    vendorName: 'Unbrako Fasteners Global',
    vendorGstin: '07AAACU1289K1ZK',
    vendorRating: 4.7,
    orderDate: '2026-03-18',
    expectedDeliveryDate: '2026-03-26',
    status: 'RECEIVED',
    subtotal: 850.0,
    gstAmount: 153.0,
    totalAmount: 1003.0,
    paymentTerms: 'NET 15',
    notes: 'Grade 10.9 high tensile zinc flake flange screws.',
    items: [
      {
        id: 'poi-4',
        itemId: 'item-3',
        code: 'FAST-HEX-M12',
        name: 'Hex Flange Head Bolt M12x45 Grade 10.9',
        uom: 'PCS',
        quantity: 1000,
        receivedQty: 1000,
        unitRate: 0.85,
        gstRate: 18.0,
        gstAmount: 153.0,
        totalAmount: 1003.0,
      },
    ],
  },
  {
    id: 'po-5',
    poNumber: 'PO-2026-043',
    vendorName: 'Sandvik Hyperion Carbide Materials',
    vendorGstin: '29AAACH0098J1ZX',
    vendorRating: 4.9,
    requisitionNumber: 'PR-2026-093C',
    mpsPlanNumber: 'MPS-2026-001',
    orderDate: '2026-03-27',
    expectedDeliveryDate: '2026-04-14',
    status: 'PENDING',
    subtotal: 2100.0,
    gstAmount: 378.0,
    totalAmount: 2478.0,
    paymentTerms: 'ADVANCE 50%',
    notes: 'Precision tungsten carbide plunger blanks with Ra 0.08 mirror polish.',
    items: [
      {
        id: 'poi-5',
        itemId: 'item-7',
        code: 'PLN-CRB-18MM',
        name: 'Tungsten Carbide Plunger Piston 18mm OD',
        uom: 'PCS',
        quantity: 50,
        receivedQty: 0,
        unitRate: 42.0,
        gstRate: 18.0,
        gstAmount: 378.0,
        totalAmount: 2478.0,
      },
    ],
  },
];

export default function ProcurementDashboardPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(initialPurchaseOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'RECEIVED'>('ALL');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderRecord | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Top KPI Metrics
  const kpiData = useMemo(() => {
    // Active POs: PENDING, APPROVED, ISSUED
    const activePOs = purchaseOrders.filter(
      (po) => po.status === 'PENDING' || po.status === 'APPROVED' || po.status === 'ISSUED'
    ).length;

    // Pending Deliveries: not yet received
    const pendingDeliveries = purchaseOrders.filter(
      (po) => po.status !== 'RECEIVED' && po.status !== 'CANCELLED'
    ).length;

    // Total Spend (MTD)
    const totalSpendMTD = purchaseOrders
      .filter((po) => po.status !== 'CANCELLED')
      .reduce((sum, po) => sum + po.totalAmount, 0);

    // Vendor On-Time Delivery Rate
    const avgRating = 97.4;

    return {
      activePOs,
      pendingDeliveries,
      totalSpendMTD,
      vendorOnTimeRate: avgRating,
    };
  }, [purchaseOrders]);

  // Filtered POs
  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        po.poNumber.toLowerCase().includes(q) ||
        po.vendorName.toLowerCase().includes(q) ||
        (po.requisitionNumber && po.requisitionNumber.toLowerCase().includes(q));

      const matchesQuick = quickFilter === 'ALL' || po.status === quickFilter;

      return matchesSearch && matchesQuick;
    });
  }, [purchaseOrders, searchQuery, quickFilter]);

  // Status Change Workflow
  const handleUpdateStatus = (poId: string, nextStatus: POStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === poId ? { ...po, status: nextStatus } : po))
    );
    if (selectedPO && selectedPO.id === poId) {
      setSelectedPO((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
    showNotification(
      nextStatus === 'RECEIVED'
        ? `PO marked as RECEIVED! Component stock has been automatically posted to Inventory Master.`
        : `Purchase Order status updated to ${nextStatus}.`
    );
  };

  // Status Pill Renderer
  const renderStatusBadge = (status: POStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            PENDING APPROVAL
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            APPROVED & ISSUED
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            GOODS RECEIVED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Procurement & Vendor Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Supply Chain
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate supplier purchase orders, reconcile PPC shortage requisitions, calculate statutory GST, and track vendor on-time fulfillment.
          </p>
        </div>

        <Link
          href="/procurement/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Purchase Order
        </Link>
      </div>

      {/* Top KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active POs */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active POs
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
            {kpiData.activePOs} POs
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold">
            In negotiation & transit
          </div>
        </div>

        {/* Pending Deliveries */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Deliveries
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
            {kpiData.pendingDeliveries} Inbound
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
            Gate check & GRN inspection pending
          </div>
        </div>

        {/* Total Spend (MTD) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Spend (MTD)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
            ${kpiData.totalSpendMTD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Inclusive of 18% statutory GST</span>
          </div>
        </div>

        {/* Vendor On-Time Rate */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Vendor On-Time Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {kpiData.vendorOnTimeRate}%
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-semibold">
            Based on dock SLA compliance
          </div>
        </div>
      </div>

      {/* Filter and Quick Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search PO number, vendor name, or PR reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quick Filter Buttons: ALL, PENDING, APPROVED, RECEIVED */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setQuickFilter('ALL')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              quickFilter === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            All Orders ({purchaseOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter('PENDING')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              quickFilter === 'PENDING'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            Pending Approval
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter('APPROVED')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              quickFilter === 'APPROVED'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            Approved
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter('RECEIVED')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              quickFilter === 'RECEIVED'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            Goods Received
          </button>
        </div>
      </div>

      {/* Purchase Orders Data Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">PO Number</th>
                <th className="py-3.5 px-4">Vendor Supplier</th>
                <th className="py-3.5 px-4">Requisition Origin</th>
                <th className="py-3.5 px-4">Order Date</th>
                <th className="py-3.5 px-4">Expected Delivery</th>
                <th className="py-3.5 px-4 text-right">Subtotal</th>
                <th className="py-3.5 px-4 text-right">GST (18%)</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No purchase orders found matching your filter selection.
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => (
                  <tr
                    key={po.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedPO(po)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {po.poNumber}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {po.vendorName}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        GSTIN: {po.vendorGstin} &bull; Rating: {po.vendorRating}&#9733;
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {po.requisitionNumber ? (
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                          {po.requisitionNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400">Direct Purchase</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {po.orderDate}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {po.expectedDeliveryDate}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">
                      ${po.subtotal.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400">
                      ${po.gstAmount.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      ${po.totalAmount.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {renderStatusBadge(po.status)}
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedPO(po)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Purchase Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Modal / Drawer: Purchase Order Detail View & Status Transitions */}
      {/* ========================================================================= */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setSelectedPO(null)}
          />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {selectedPO.poNumber}
                  </span>
                  {renderStatusBadge(selectedPO.status)}
                </div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  Vendor: {selectedPO.vendorName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPO(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block font-medium">Vendor GSTIN</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">
                  {selectedPO.vendorGstin}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block font-medium">Requisition Source</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 mt-0.5 block font-mono">
                  {selectedPO.requisitionNumber || 'Direct Purchase'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block font-medium">Payment Terms</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                  {selectedPO.paymentTerms}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block font-medium">Expected Date</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                  {selectedPO.expectedDeliveryDate}
                </span>
              </div>
            </div>

            {selectedPO.notes && (
              <div className="p-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Supplier Terms & Instructions:
                </span>
                {selectedPO.notes}
              </div>
            )}

            {/* Line Items Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3 text-right">Order Qty</th>
                    <th className="py-2.5 px-3 text-right">Rate</th>
                    <th className="py-2.5 px-3 text-right">GST (18%)</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedPO.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {item.code}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate max-w-sm">
                          {item.name}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {item.quantity} {item.uom}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                        ${item.unitRate.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                        ${item.gstAmount.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        ${item.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t border-slate-200 dark:border-slate-800">
                  <tr>
                    <td colSpan={4} className="py-2.5 px-3 text-right uppercase text-[11px] text-slate-500">
                      Total Order Payable (Inc. GST)
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                      ${selectedPO.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Status Transition Workflow Controls */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Workflow Action:</span>
                {(['APPROVED', 'RECEIVED'] as POStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedPO.id, st)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                      selectedPO.status === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    )}
                  >
                    {st === 'RECEIVED' ? 'Mark Goods Received' : st}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPO(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

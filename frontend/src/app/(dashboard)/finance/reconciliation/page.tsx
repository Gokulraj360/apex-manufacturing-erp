'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Scale,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  FileCheck,
  TrendingDown,
  TrendingUp,
  Percent,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Building2,
  Calendar,
  Check,
  X,
  Printer,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
  Factory,
  Boxes,
  Send,
  Eye,
  RefreshCw,
  Coins,
  BadgeAlert,
  DollarSign,
  AlertCircle,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type ReconciliationTab = 'THREE_WAY_MATCH' | 'BOM_COST_VARIANCE';

export interface ThreeWayMatchRecord {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorCode: string;
  vendorGstin: string;
  invoiceDate: string;
  dueDate: string;
  purchaseOrderNumber: string;
  poDate: string;
  poTotalAmount: number;
  grnNumber: string;
  mirNumber: string;
  grnDate: string;
  status: 'PERFECT_MATCH' | 'VARIANCE_FLAGGED' | 'APPROVED' | 'DISPUTED';
  claimedTotalAmount: number;
  expectedTotalAmount: number;
  varianceAmount: number;
  variancePercentage: number;
  varianceReason: string;
  debitNoteRecommended: number;
  items: {
    id: string;
    itemCode: string;
    itemName: string;
    uom: string;
    // Invoice (Claimed)
    invoiceQty: number;
    invoiceRate: number;
    invoiceAmount: number;
    // Purchase Order (Agreed)
    poQty: number;
    poRate: number;
    poAmount: number;
    // GRN / MIR (Physically Passed)
    grnReceivedQty: number;
    grnPassedQty: number;
    grnRejectedQty: number;
    // Variances
    qtyVariance: number;
    priceVariance: number;
    netDiscrepancy: number;
    hasDiscrepancy: boolean;
  }[];
}

export interface CostVarianceRecord {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  jobCardNumber: string;
  productionLine: string;
  batchNumber: string;
  batchQuantity: number;
  uom: string;
  bomStandard: {
    materialCostPerUnit: number;
    laborMachineCostPerUnit: number;
    scrapAllowancePerUnit: number;
    totalStandardCostPerUnit: number;
    totalStandardBatchCost: number;
  };
  actualProduction: {
    materialCostPerUnit: number;
    laborMachineCostPerUnit: number;
    scrapCostPerUnit: number;
    totalActualCostPerUnit: number;
    totalActualBatchCost: number;
  };
  variance: {
    materialCostVariance: number;
    laborMachineVariance: number;
    scrapVariance: number;
    totalVarianceAmount: number;
    variancePercentage: number;
    disposition: 'UNFAVORABLE_OVERRUN' | 'FAVORABLE_SAVINGS' | 'WITHIN_TOLERANCE';
    rootCauses: string[];
  };
}

// ============================================================================
// Mock Data
// ============================================================================

const mockThreeWayMatches: ThreeWayMatchRecord[] = [
  {
    id: 'mat-01',
    invoiceNumber: 'INV-TATA-2026-901',
    vendorName: 'Tata Steel Special Alloy Steels Ltd',
    vendorCode: 'VEND-001',
    vendorGstin: '27AAACT1234F1Z1',
    invoiceDate: '2026-09-30',
    dueDate: '2026-10-30',
    purchaseOrderNumber: 'PO-2026-041',
    poDate: '2026-09-24',
    poTotalAmount: 1858500.0,
    grnNumber: 'GRN-2026-0129',
    mirNumber: 'MIR-2026-0129',
    grnDate: '2026-10-01',
    status: 'VARIANCE_FLAGGED',
    claimedTotalAmount: 1908060.0,
    expectedTotalAmount: 1816020.0,
    varianceAmount: 92040.0,
    variancePercentage: 5.07,
    varianceReason: 'Billed unit rate higher by ₹12/KG + 80 KG QC-rejected oxidation coil billed without debit deduction',
    debitNoteRecommended: 92040.0,
    items: [
      {
        id: 'itm-1',
        itemCode: 'RAW-STL-1018',
        itemName: 'Cold-Rolled Carbon Steel Coil 1018 (Grade A)',
        uom: 'KG',
        invoiceQty: 3500,
        invoiceRate: 462.0,
        invoiceAmount: 1617000.0,
        poQty: 3500,
        poRate: 450.0,
        poAmount: 1575000.0,
        grnReceivedQty: 3500,
        grnPassedQty: 3420,
        grnRejectedQty: 80,
        qtyVariance: 80,
        priceVariance: 12.0,
        netDiscrepancy: 78000.0,
        hasDiscrepancy: true,
      },
    ],
  },
  {
    id: 'mat-02',
    invoiceNumber: 'INV-MOOG-BLR-892',
    vendorName: 'Moog Precision Coreless Motors Inc',
    vendorCode: 'VEND-002',
    vendorGstin: '29AABCM8821B1Z2',
    invoiceDate: '2026-10-01',
    dueDate: '2026-10-31',
    purchaseOrderNumber: 'PO-2026-042',
    poDate: '2026-09-26',
    poTotalAmount: 442500.0,
    grnNumber: 'GRN-2026-0130',
    mirNumber: 'MIR-2026-0130',
    grnDate: '2026-10-01',
    status: 'PERFECT_MATCH',
    claimedTotalAmount: 442500.0,
    expectedTotalAmount: 442500.0,
    varianceAmount: 0.0,
    variancePercentage: 0.0,
    varianceReason: '100% 3-Way Match Verified. Unit rates and passed quantities match perfectly.',
    debitNoteRecommended: 0.0,
    items: [
      {
        id: 'itm-2',
        itemCode: 'RAW-MTR-003',
        itemName: 'Brushless DC Coreless Motor 48V (750W)',
        uom: 'PCS',
        invoiceQty: 15,
        invoiceRate: 25000.0,
        invoiceAmount: 375000.0,
        poQty: 15,
        poRate: 25000.0,
        poAmount: 375000.0,
        grnReceivedQty: 15,
        grnPassedQty: 15,
        grnRejectedQty: 0,
        qtyVariance: 0,
        priceVariance: 0,
        netDiscrepancy: 0,
        hasDiscrepancy: false,
      },
    ],
  },
  {
    id: 'mat-03',
    invoiceNumber: 'INV-UNB-DEL-1092',
    vendorName: 'Unbrako Fasteners Global',
    vendorCode: 'VEND-003',
    vendorGstin: '07AAACU9912U1Z5',
    invoiceDate: '2026-09-28',
    dueDate: '2026-10-28',
    purchaseOrderNumber: 'PO-2026-040',
    poDate: '2026-09-22',
    poTotalAmount: 212400.0,
    grnNumber: 'GRN-2026-0128',
    mirNumber: 'MIR-2026-0128',
    grnDate: '2026-09-29',
    status: 'VARIANCE_FLAGGED',
    claimedTotalAmount: 212400.0,
    expectedTotalAmount: 196470.0,
    varianceAmount: 15930.0,
    variancePercentage: 8.11,
    varianceReason: 'Short physical delivery: 1,500 PCS billed but never delivered at receiving dock',
    debitNoteRecommended: 15930.0,
    items: [
      {
        id: 'itm-3',
        itemCode: 'FAST-HEX-M12',
        itemName: 'Hex Flange Head Bolt M12x45 Grade 10.9',
        uom: 'PCS',
        invoiceQty: 20000,
        invoiceRate: 9.0,
        invoiceAmount: 180000.0,
        poQty: 20000,
        poRate: 9.0,
        poAmount: 180000.0,
        grnReceivedQty: 18500,
        grnPassedQty: 18500,
        grnRejectedQty: 0,
        qtyVariance: 1500,
        priceVariance: 0,
        netDiscrepancy: 13500.0,
        hasDiscrepancy: true,
      },
    ],
  },
];

const mockCostVariances: CostVarianceRecord[] = [
  {
    id: 'var-01',
    itemCode: 'PLN-CRB-18MM',
    itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
    category: 'FINISHED_GOOD',
    jobCardNumber: 'JC-2026-0881',
    productionLine: 'Line 3 - CNC Machining Cell',
    batchNumber: 'LOT-2026-TATA-881',
    batchQuantity: 200,
    uom: 'PCS',
    bomStandard: {
      materialCostPerUnit: 180.0,
      laborMachineCostPerUnit: 65.0,
      scrapAllowancePerUnit: 5.0,
      totalStandardCostPerUnit: 250.0,
      totalStandardBatchCost: 50000.0,
    },
    actualProduction: {
      materialCostPerUnit: 192.5,
      laborMachineCostPerUnit: 71.0,
      scrapCostPerUnit: 7.2,
      totalActualCostPerUnit: 270.7,
      totalActualBatchCost: 54140.0,
    },
    variance: {
      materialCostVariance: 2500.0,
      laborMachineVariance: 1200.0,
      scrapVariance: 440.0,
      totalVarianceAmount: 4140.0,
      variancePercentage: 8.28,
      disposition: 'UNFAVORABLE_OVERRUN',
      rootCauses: [
        'Raw Material Coil Price Variance (+6.9% market rate)',
        'CNC Lathe #03 Turret Jam (45 mins overtime operator recovery)',
        'Tool wear burr generation on 7 extra pieces',
      ],
    },
  },
  {
    id: 'var-02',
    itemCode: 'BUSH-BRZ-30MM',
    itemName: 'Phosphor Bronze Sleeve Blank 30mm',
    category: 'FINISHED_GOOD',
    jobCardNumber: 'JC-2026-0882',
    productionLine: 'Line 1 - Stamping & Press Line',
    batchNumber: 'LOT-2026-BRZ-9021',
    batchQuantity: 400,
    uom: 'PCS',
    bomStandard: {
      materialCostPerUnit: 110.0,
      laborMachineCostPerUnit: 35.0,
      scrapAllowancePerUnit: 3.0,
      totalStandardCostPerUnit: 148.0,
      totalStandardBatchCost: 59200.0,
    },
    actualProduction: {
      materialCostPerUnit: 104.5,
      laborMachineCostPerUnit: 32.0,
      scrapCostPerUnit: 2.1,
      totalActualCostPerUnit: 138.6,
      totalActualBatchCost: 55440.0,
    },
    variance: {
      materialCostVariance: -2200.0,
      laborMachineVariance: -1200.0,
      scrapVariance: -360.0,
      totalVarianceAmount: -3760.0,
      variancePercentage: -6.35,
      disposition: 'FAVORABLE_SAVINGS',
      rootCauses: [
        'Bulk Vendor Discount negotiated on Bronze Rods',
        'Progressive Die Tooling yielded 99.2% single-pass recovery',
      ],
    },
  },
  {
    id: 'var-03',
    itemCode: 'FAST-HEX-M12',
    itemName: 'Hex Flange Head Bolt M12x45 Grade 10.9',
    category: 'FINISHED_GOOD',
    jobCardNumber: 'JC-2026-0879',
    productionLine: 'Line 2 - Header & Cold Forging Cell',
    batchNumber: 'LOT-UNB-1092-A',
    batchQuantity: 1000,
    uom: 'PCS',
    bomStandard: {
      materialCostPerUnit: 8.5,
      laborMachineCostPerUnit: 3.0,
      scrapAllowancePerUnit: 0.3,
      totalStandardCostPerUnit: 11.8,
      totalStandardBatchCost: 11800.0,
    },
    actualProduction: {
      materialCostPerUnit: 8.5,
      laborMachineCostPerUnit: 3.1,
      scrapCostPerUnit: 0.35,
      totalActualCostPerUnit: 11.95,
      totalActualBatchCost: 11950.0,
    },
    variance: {
      materialCostVariance: 0.0,
      laborMachineVariance: 100.0,
      scrapVariance: 50.0,
      totalVarianceAmount: 150.0,
      variancePercentage: 1.27,
      disposition: 'WITHIN_TOLERANCE',
      rootCauses: ['Minor dielectric oil consumption increase during cold heading'],
    },
  },
];

export default function FinanceReconciliationPage() {
  const [activeTab, setActiveTab] = useState<ReconciliationTab>('THREE_WAY_MATCH');
  const [matches, setMatches] = useState<ThreeWayMatchRecord[]>(mockThreeWayMatches);
  const [selectedMatchId, setSelectedMatchId] = useState<string>(mockThreeWayMatches[0].id);
  const [costVariances, setCostVariances] = useState<CostVarianceRecord[]>(mockCostVariances);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Selected 3-Way Match
  const currentMatch = useMemo(() => {
    return matches.find((m) => m.id === selectedMatchId) || matches[0];
  }, [matches, selectedMatchId]);

  // Overall Financial KPIs
  const kpis = useMemo(() => {
    const totalAP = matches.reduce((acc, m) => acc + m.claimedTotalAmount, 0);
    const varianceAtRisk = matches
      .filter((m) => m.status === 'VARIANCE_FLAGGED')
      .reduce((acc, m) => acc + m.varianceAmount, 0);
    const flaggedCount = matches.filter((m) => m.status === 'VARIANCE_FLAGGED').length;
    const perfectCount = matches.filter((m) => m.status === 'PERFECT_MATCH').length;

    return { totalAP, varianceAtRisk, flaggedCount, perfectCount };
  }, [matches]);

  // Actions on Invoice
  const handleApproveInvoice = (id: string, issueDebitNote: boolean) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: 'APPROVED',
          };
        }
        return m;
      })
    );

    if (issueDebitNote && currentMatch.varianceAmount > 0) {
      showToast(
        `Invoice ${currentMatch.invoiceNumber} approved for net settlement. Debit Note DN-2026-${Math.floor(1000 + Math.random() * 9000)} auto-issued for ₹${currentMatch.varianceAmount.toLocaleString('en-IN')}.`
      );
    } else {
      showToast(`Invoice ${currentMatch.invoiceNumber} approved for payment release!`);
    }
  };

  const handleDisputeInvoice = (id: string) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'DISPUTED' } : m))
    );
    showToast(
      `Invoice ${currentMatch.invoiceNumber} placed ON HOLD. Dispute notification emailed to ${currentMatch.vendorName}.`,
      'alert'
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-150">
          {toast.type === 'alert' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
              Financial Reconciliation & Cost Variance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              3-Way Match & AP Audit
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Split-screen verification between Vendor Invoices, Purchase Orders, and QC Goods Receipt Notes (GRN), alongside standard BOM cost vs actual shop floor production variances.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('THREE_WAY_MATCH')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2',
              activeTab === 'THREE_WAY_MATCH'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            <Scale className="w-4 h-4" />
            <span>3-Way Match Validator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BOM_COST_VARIANCE')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2',
              activeTab === 'BOM_COST_VARIANCE'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            <TrendingUp className="w-4 h-4" />
            <span>BOM Cost Variance Tracker</span>
          </button>
        </div>
      </div>

      {/* Top Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Accounts Payable Liability */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total AP Liability
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mt-2 font-mono">
            ₹{(kpis.totalAP / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold">
            Across {matches.length} pending vendor invoices
          </div>
        </div>

        {/* KPI 2: Variance at Risk */}
        <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              3-Way Variance at Risk
            </span>
            <div className="relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center relative">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 dark:text-rose-300 mt-2 font-mono">
            ₹{kpis.varianceAtRisk.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-semibold flex items-center gap-1">
            <BadgeAlert className="w-3.5 h-3.5" />
            {kpis.flaggedCount} Invoices require Debit Note offsets
          </div>
        </div>

        {/* KPI 3: Reconciled Matches */}
        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Perfect Matches
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-2 font-mono">
            {kpis.perfectCount} Invoices
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-semibold">
            0.00% Price or Quantity tolerance discrepancy
          </div>
        </div>

        {/* KPI 4: BOM Cost Overrun Rate */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg BOM Cost Delta
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">
            +3.42%
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold">
            Standard Recipe vs Actual Shop Consumptions
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 3-WAY MATCH RECONCILER (SPLIT-SCREEN VALIDATOR)                    */}
      {/* ========================================================================= */}
      {activeTab === 'THREE_WAY_MATCH' && (
        <div className="space-y-6">
          {/* Invoice Picker Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Invoice for 3-Way Match Audit:
              </span>
              <span className="text-xs text-slate-500">
                {matches.length} invoices registered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {matches.map((item) => {
                const isSelected = item.id === selectedMatchId;
                const isFlagged = item.status === 'VARIANCE_FLAGGED';
                const isApproved = item.status === 'APPROVED';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMatchId(item.id)}
                    className={cn(
                      'p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2.5',
                      isSelected
                        ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                          {item.invoiceNumber}
                        </span>

                        {isApproved ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            APPROVED
                          </span>
                        ) : isFlagged ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 animate-pulse flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            VARIANCE FLAGGED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            100% MATCH
                          </span>
                        )}
                      </div>

                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2 truncate">
                        {item.vendorName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        PO: {item.purchaseOrderNumber} &bull; GRN: {item.grnNumber}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        ₹{item.claimedTotalAmount.toLocaleString('en-IN')}
                      </span>
                      {item.varianceAmount > 0 ? (
                        <span className="font-mono font-extrabold text-rose-600 dark:text-rose-400">
                          +₹{item.varianceAmount.toLocaleString('en-IN')} (Diff)
                        </span>
                      ) : (
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          Zero Variance
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SPLIT-SCREEN 3-WAY COMPARISON MATRICES                                */}
          {/* ===================================================================== */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            {/* Header Strip with Action Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">
                    3-Way Comparison: {currentMatch.invoiceNumber}
                  </h3>
                  {currentMatch.varianceAmount > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                      Discrepancy: ₹{currentMatch.varianceAmount.toLocaleString('en-IN')} ({currentMatch.variancePercentage}%)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Perfect 3-Way Match
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Vendor: <strong>{currentMatch.vendorName}</strong> ({currentMatch.vendorCode}) &bull; GSTIN: {currentMatch.vendorGstin}
                </div>
              </div>

              {/* Settlement Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {currentMatch.status !== 'APPROVED' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDisputeInvoice(currentMatch.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 inline mr-1" />
                      Hold & Dispute
                    </button>

                    {currentMatch.varianceAmount > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleApproveInvoice(currentMatch.id, true)}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-600 hover:bg-amber-700 active:scale-95 text-white shadow-md shadow-amber-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Approve with Auto Debit Note (₹{currentMatch.varianceAmount.toLocaleString('en-IN')})</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApproveInvoice(currentMatch.id, false)}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Approve Full Payment</span>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>APPROVED & RELEASED FOR AP PAYMENT</span>
                  </div>
                )}
              </div>
            </div>

            {/* Split Screen 3-Column Cards: Invoice vs PO vs GRN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Pillar 1: Vendor Invoice (Claimed) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    1. Vendor Invoice (Claimed)
                  </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {currentMatch.invoiceNumber}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Invoice Date:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{currentMatch.invoiceDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Payment Due:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{currentMatch.dueDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Billed Quantity:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {currentMatch.items[0].invoiceQty} {currentMatch.items[0].uom}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Billed Unit Rate:</span>
                    <span className="font-mono font-black text-slate-900 dark:text-slate-100">
                      ₹{currentMatch.items[0].invoiceRate.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Total Billed:</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                    ₹{currentMatch.claimedTotalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Pillar 2: Purchase Order (Agreed Contract) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-600" />
                    2. Purchase Order (Agreed)
                  </span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                    {currentMatch.purchaseOrderNumber}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>PO Date:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{currentMatch.poDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Contract Terms:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">NET 30 Days</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Ordered Quantity:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {currentMatch.items[0].poQty} {currentMatch.items[0].uom}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Agreed Contract Rate:</span>
                    <span className="font-mono font-black text-slate-900 dark:text-slate-100">
                      ₹{currentMatch.items[0].poRate.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Contract Total:</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                    ₹{currentMatch.poTotalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Pillar 3: Goods Receipt Note & QC Passed */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    3. Goods Receipt Note (GRN)
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {currentMatch.grnNumber}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Receipt Date:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{currentMatch.grnDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>MIR Report Ref:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{currentMatch.mirNumber}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Total Unloaded:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {currentMatch.items[0].grnReceivedQty} {currentMatch.items[0].uom}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>QC Accepted Qty:</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                      {currentMatch.items[0].grnPassedQty} {currentMatch.items[0].uom}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300">QC Rejected Qty:</span>
                  <span className="font-mono font-bold text-sm text-rose-600 dark:text-rose-400">
                    {currentMatch.items[0].grnRejectedQty} {currentMatch.items[0].uom}
                  </span>
                </div>
              </div>
            </div>

            {/* Line-Item Detailed Discrepancy Matrix */}
            <div className="space-y-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block">
                Item-Level Variance Breakdown & Red Discrepancy Badges
              </span>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3">SKU & Item Name</th>
                      <th className="p-3 text-center">Invoice Billed</th>
                      <th className="p-3 text-center">PO Contract</th>
                      <th className="p-3 text-center">GRN Accepted</th>
                      <th className="p-3 text-center">Rate Discrepancy</th>
                      <th className="p-3 text-center">Qty Discrepancy</th>
                      <th className="p-3 text-right">Net Financial Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentMatch.items.map((item) => (
                      <tr key={item.id} className="bg-white dark:bg-slate-900">
                        <td className="p-3">
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">
                            {item.itemCode}
                          </span>
                          <span className="text-[11px] text-slate-500">{item.itemName}</span>
                        </td>

                        {/* Invoice Billed */}
                        <td className="p-3 text-center font-mono">
                          <div>{item.invoiceQty} {item.uom}</div>
                          <div className="text-[11px] text-slate-500">@ ₹{item.invoiceRate.toFixed(2)}</div>
                        </td>

                        {/* PO Contract */}
                        <td className="p-3 text-center font-mono">
                          <div>{item.poQty} {item.uom}</div>
                          <div className="text-[11px] text-slate-500">@ ₹{item.poRate.toFixed(2)}</div>
                        </td>

                        {/* GRN Accepted */}
                        <td className="p-3 text-center font-mono">
                          <div className="font-bold text-emerald-600 dark:text-emerald-400">
                            {item.grnPassedQty} {item.uom}
                          </div>
                          {item.grnRejectedQty > 0 && (
                            <div className="text-[10px] text-rose-500">({item.grnRejectedQty} rejected)</div>
                          )}
                        </td>

                        {/* Rate Discrepancy */}
                        <td className="p-3 text-center font-mono">
                          {item.priceVariance > 0 ? (
                            <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200">
                              +₹{item.priceVariance.toFixed(2)} / {item.uom} Overcharge
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-bold">Match</span>
                          )}
                        </td>

                        {/* Qty Discrepancy */}
                        <td className="p-3 text-center font-mono">
                          {item.qtyVariance > 0 ? (
                            <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200">
                              +{item.qtyVariance} {item.uom} Unreceived/Rejected
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-bold">Match</span>
                          )}
                        </td>

                        {/* Net Financial Delta */}
                        <td className="p-3 text-right font-mono font-black">
                          {item.netDiscrepancy > 0 ? (
                            <span className="text-rose-600 dark:text-rose-400 text-sm">
                              +₹{item.netDiscrepancy.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              ₹0.00
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Variance Audit Findings Box */}
              {currentMatch.varianceAmount > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>3-Way Match Exception Details:</span>
                  </div>
                  <p className="text-rose-700 dark:text-rose-300">
                    {currentMatch.varianceReason}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Statutory Rule: In accordance with GST input tax credit provisions, payment must be withheld or adjusted via Debit Note before AP release.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BOM COST VARIANCE TRACKER (STANDARD ESTIMATED VS ACTUAL FLOOR)     */}
      {/* ========================================================================= */}
      {activeTab === 'BOM_COST_VARIANCE' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-50">
                Standard BOM Recipe Cost vs Actual Production Cost Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Variance analysis comparing standard bill-of-materials allowances against real-time shop floor consumptions, scrap logs, and machine overtime.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                Favorable: &lt; 0%
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200">
                Overrun: &gt; +2%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {costVariances.map((record) => {
              const isOverrun = record.variance.disposition === 'UNFAVORABLE_OVERRUN';
              const isSavings = record.variance.disposition === 'FAVORABLE_SAVINGS';

              return (
                <div
                  key={record.id}
                  className={cn(
                    'p-6 rounded-3xl border transition-all bg-white dark:bg-slate-900 shadow-sm space-y-5',
                    isOverrun
                      ? 'border-rose-200 dark:border-rose-900/60 ring-2 ring-rose-500/10'
                      : isSavings
                      ? 'border-emerald-200 dark:border-emerald-900/60'
                      : 'border-slate-200 dark:border-slate-800'
                  )}
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-base font-black text-slate-900 dark:text-slate-100">
                          {record.itemCode}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                          Job Card: {record.jobCardNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Batch: {record.batchNumber} ({record.batchQuantity} {record.uom})
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                        {record.itemName} &bull; {record.productionLine}
                      </div>
                    </div>

                    {/* Variance Pill */}
                    <div className="flex items-center gap-2">
                      {isOverrun ? (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                          +{record.variance.variancePercentage}% OVERRUN (+₹{record.variance.totalVarianceAmount.toLocaleString('en-IN')})
                        </span>
                      ) : isSavings ? (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                          {record.variance.variancePercentage}% SAVINGS (₹{Math.abs(record.variance.totalVarianceAmount).toLocaleString('en-IN')})
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300">
                          WITHIN TOLERANCE (+{record.variance.variancePercentage}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3 Cost Buckets Comparison: Standard BOM vs Actual */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                    {/* Material Cost */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block">
                        Raw Material Cost
                      </span>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Standard:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">₹{record.bomStandard.materialCostPerUnit}/unit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Actual Consumed:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">₹{record.actualProduction.materialCostPerUnit}/unit</span>
                      </div>
                      <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800 flex justify-between font-black">
                        <span>Batch Delta:</span>
                        <span className={record.variance.materialCostVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                          {record.variance.materialCostVariance > 0 ? '+' : ''}₹{record.variance.materialCostVariance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Labor & Machine Hours */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block">
                        Labor & Machine Hours
                      </span>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Standard:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">₹{record.bomStandard.laborMachineCostPerUnit}/unit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Actual Clocked:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">₹{record.actualProduction.laborMachineCostPerUnit}/unit</span>
                      </div>
                      <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800 flex justify-between font-black">
                        <span>Batch Delta:</span>
                        <span className={record.variance.laborMachineVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                          {record.variance.laborMachineVariance > 0 ? '+' : ''}₹{record.variance.laborMachineVariance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Scrap Tolerance Cost */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block">
                        Scrap / Defect Rate
                      </span>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Standard Allow.:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">₹{record.bomStandard.scrapAllowancePerUnit}/unit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Actual Scrap:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">₹{record.actualProduction.scrapCostPerUnit}/unit</span>
                      </div>
                      <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800 flex justify-between font-black">
                        <span>Batch Delta:</span>
                        <span className={record.variance.scrapVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                          {record.variance.scrapVariance > 0 ? '+' : ''}₹{record.variance.scrapVariance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Total Net Unit & Batch Cost */}
                    <div className="p-3.5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
                      <span className="text-[10px] font-sans font-bold text-blue-600 uppercase tracking-wider block">
                        Total Batch Cost
                      </span>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">BOM Estimate:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">₹{record.bomStandard.totalStandardBatchCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">Actual Cost:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">₹{record.actualProduction.totalActualBatchCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="pt-1 border-t border-blue-200 dark:border-blue-800 flex justify-between font-black text-sm">
                        <span className="font-sans">Variance:</span>
                        <span className={record.variance.totalVarianceAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                          {record.variance.totalVarianceAmount > 0 ? '+' : ''}₹{record.variance.totalVarianceAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Root Cause Variance Explanations */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                      Identified Variance Drivers & Shop Floor Root Causes:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {record.variance.rootCauses.map((cause, cIdx) => (
                        <li key={cIdx}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

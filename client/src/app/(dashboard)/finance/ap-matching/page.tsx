'use client';

import React, { useState } from 'react';
import {
  Scale,
  Receipt,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Download,
  Filter,
  Search,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Layers,
  Building2,
  FileText,
} from 'lucide-react';

interface ThreeWayMatchRecord {
  id: string;
  matchBatchId: string;
  vendorName: string;
  vendorCode: string;
  poNumber: string;
  poAmount: number;
  poUnitPrice: number;
  poOrderedQty: number;
  grnNumber: string;
  grnAcceptedQty: number;
  grnWeighbridgeTareDate: string;
  invoiceNumber: string;
  invoiceBilledQty: number;
  invoiceUnitPrice: number;
  invoiceAmount: number;
  qtyVariance: number; // invoiceQty - grnQty
  priceVariancePercent: number; // (invoicePrice - poPrice) / poPrice * 100
  totalVarianceAmount: number;
  matchStatus: 'PERFECT_MATCH' | 'TOLERANCE_WARNING' | 'PRICE_DISCREPANCY_HELD' | 'QUANTITY_SHORTAGE_HELD' | 'RESOLVED_DEBIT_NOTE';
  resolutionAction?: string;
}

const MOCK_MATCH_RECORDS: ThreeWayMatchRecord[] = [
  {
    id: 'match-1',
    matchBatchId: '3WM-2026-0411',
    vendorName: 'Apex Electroplating & Surface Coatings Ltd',
    vendorCode: 'VEN-SC-001',
    poNumber: 'PO-APEX-2026-0891',
    poAmount: 84500,
    poUnitPrice: 16.90,
    poOrderedQty: 5000,
    grnNumber: 'GRN-GATE-2026-0182',
    grnAcceptedQty: 5000,
    grnWeighbridgeTareDate: '2026-10-22 09:15',
    invoiceNumber: 'INV-VEN-2026-0941',
    invoiceBilledQty: 5000,
    invoiceUnitPrice: 16.90,
    invoiceAmount: 84500,
    qtyVariance: 0,
    priceVariancePercent: 0.0,
    totalVarianceAmount: 0,
    matchStatus: 'PERFECT_MATCH',
  },
  {
    id: 'match-2',
    matchBatchId: '3WM-2026-0412',
    vendorName: 'Precision Die Castings & Alloys Corp',
    vendorCode: 'VEN-SC-003',
    poNumber: 'PO-APEX-2026-0870',
    poAmount: 33600,
    poUnitPrice: 42.00,
    poOrderedQty: 800,
    grnNumber: 'GRN-GATE-2026-0155',
    grnAcceptedQty: 780, // 20 units rejected at gate
    grnWeighbridgeTareDate: '2026-10-21 14:30',
    invoiceNumber: 'INV-VEN-2026-0888',
    invoiceBilledQty: 800, // Invoiced for full 800 without crediting 20 rejected
    invoiceUnitPrice: 42.00,
    invoiceAmount: 33600,
    qtyVariance: 20,
    priceVariancePercent: 0.0,
    totalVarianceAmount: 840,
    matchStatus: 'QUANTITY_SHORTAGE_HELD',
    resolutionAction: 'Awaiting Automated Debit Note Issue',
  },
  {
    id: 'match-3',
    matchBatchId: '3WM-2026-0413',
    vendorName: 'Silicon Micro-Packaging International',
    vendorCode: 'VEN-SM-009',
    poNumber: 'PO-APEX-2026-0885',
    poAmount: 62000,
    poUnitPrice: 6.20,
    poOrderedQty: 10000,
    grnNumber: 'GRN-GATE-2026-0170',
    grnAcceptedQty: 10000,
    grnWeighbridgeTareDate: '2026-10-20 11:00',
    invoiceNumber: 'INV-VEN-2026-0874',
    invoiceBilledQty: 10000,
    invoiceUnitPrice: 6.55, // 5.6% higher price invoiced!
    invoiceAmount: 65500,
    qtyVariance: 0,
    priceVariancePercent: 5.64,
    totalVarianceAmount: 3500,
    matchStatus: 'PRICE_DISCREPANCY_HELD',
  },
  {
    id: 'match-4',
    matchBatchId: '3WM-2026-0414',
    vendorName: 'Continental Precision Fasteners LLP',
    vendorCode: 'VEN-CPF-014',
    poNumber: 'PO-APEX-2026-0862',
    poAmount: 14200,
    poUnitPrice: 0.71,
    poOrderedQty: 20000,
    grnNumber: 'GRN-GATE-2026-0140',
    grnAcceptedQty: 19950,
    grnWeighbridgeTareDate: '2026-10-18 16:45',
    invoiceNumber: 'INV-VEN-2026-0810',
    invoiceBilledQty: 20000,
    invoiceUnitPrice: 0.715,
    invoiceAmount: 14300,
    qtyVariance: 50,
    priceVariancePercent: 0.7,
    totalVarianceAmount: 100,
    matchStatus: 'TOLERANCE_WARNING',
  },
];

export default function APThreeWayMatchPage() {
  const [activeTab, setActiveTab] = useState<'workbench' | 'tolerance' | 'discrepancies' | 'audit'>('workbench');
  const [records, setRecords] = useState<ThreeWayMatchRecord[]>(MOCK_MATCH_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');

  // Tolerance config states
  const [maxPriceVariancePercent, setMaxPriceVariancePercent] = useState(1.5);
  const [maxQtyVariancePercent, setMaxQtyVariancePercent] = useState(0.5);
  const [hardBlockThresholdPercent, setHardBlockThresholdPercent] = useState(5.0);

  // Selected Resolution Modal
  const [selectedRecord, setSelectedRecord] = useState<ThreeWayMatchRecord | null>(null);

  const handleResolveDebitNote = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              matchStatus: 'RESOLVED_DEBIT_NOTE',
              resolutionAction: `Debit Note DN-2026-092 Issued for $${r.totalVarianceAmount.toLocaleString()}`,
            }
          : r
      )
    );
    setSelectedRecord(null);
  };

  const handleApproveUnderTolerance = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              matchStatus: 'PERFECT_MATCH',
              resolutionAction: 'Approved Under Tolerance Threshold Rules',
            }
          : r
      )
    );
    setSelectedRecord(null);
  };

  const filteredRecords = records.filter(
    (r) =>
      r.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.grnNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Scale className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Automated 3-Way Accounts Payable (AP) Matching Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              PO vs Inbound GRN vs Vendor Invoice
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Automated line-item reconciliation comparing contracted PO terms, physical weighbridge GRN quantities, and billed supplier invoices with algorithmic variance tolerance limits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('tolerance')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            <Settings className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Configure Tolerance Limits
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">3-Way Auto-Match Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">96.8%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Passed zero-variance check</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Held Invoices</span>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 tracking-tight">
            ${records.filter(r => r.matchStatus.includes('HELD')).reduce((acc, r) => acc + r.totalVarianceAmount, 0).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-red-600 dark:text-red-400">
            <span>2 Invoices held for audit review</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Debit Notes Generated</span>
            <TrendingDown className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">$14,820</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500">
            <span>Shortage recoveries for Q4</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Tolerance Envelope</span>
            <Scale className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">±{maxPriceVariancePercent}%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            <span>Strict Industrial Policy</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('workbench')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'workbench'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Scale className="h-4 w-4" /> 3-Way Reconciliation Workbench ({records.length})
        </button>
        <button
          onClick={() => setActiveTab('tolerance')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'tolerance'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="h-4 w-4" /> Tolerance Rules & Policy Configuration
        </button>
        <button
          onClick={() => setActiveTab('discrepancies')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'discrepancies'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="h-4 w-4" /> Discrepancy & Debit Note Resolution ({records.filter(r => r.matchStatus !== 'PERFECT_MATCH').length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'audit'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" /> Reconciled General Ledger Journal
        </button>
      </div>

      {/* TAB 1: WORKBENCH */}
      {activeTab === 'workbench' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PO, GRN, Invoice, or Vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 w-full sm:w-80"
              />
            </div>
            <div className="text-xs text-slate-500">
              Showing <strong>{filteredRecords.length}</strong> matching transactions
            </div>
          </div>

          <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Match ID & Vendor</th>
                    <th className="py-3 px-4">PO Contract</th>
                    <th className="py-3 px-4">Gate GRN Received</th>
                    <th className="py-3 px-4">Vendor Invoiced</th>
                    <th className="py-3 px-4">Variance Detected</th>
                    <th className="py-3 px-4">Match Verdict</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRecords.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{m.matchBatchId}</div>
                        <div className="text-slate-600 dark:text-slate-300 font-medium">{m.vendorName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono space-y-0.5">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{m.poNumber}</div>
                        <div className="text-[11px] text-slate-500">{m.poOrderedQty} pcs @ ${m.poUnitPrice.toFixed(2)}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono space-y-0.5">
                        <div className="text-blue-600 dark:text-blue-400 font-semibold">{m.grnNumber}</div>
                        <div className="text-[11px] text-slate-500">{m.grnAcceptedQty} pcs accepted</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono space-y-0.5">
                        <div className="text-purple-600 dark:text-purple-400 font-semibold">{m.invoiceNumber}</div>
                        <div className="text-[11px] text-slate-500">{m.invoiceBilledQty} pcs @ ${m.invoiceUnitPrice.toFixed(2)}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {m.totalVarianceAmount === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">0.00 (Zero Variance)</span>
                        ) : (
                          <div className="space-y-0.5 font-mono">
                            <span className="text-red-600 dark:text-red-400 font-bold">+${m.totalVarianceAmount.toLocaleString()}</span>
                            {m.priceVariancePercent > 0 && (
                              <div className="text-[10px] text-red-500">Price: +{m.priceVariancePercent.toFixed(2)}%</div>
                            )}
                            {m.qtyVariance > 0 && (
                              <div className="text-[10px] text-amber-500">Qty Shortage: {m.qtyVariance} pcs</div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {m.matchStatus === 'PERFECT_MATCH' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            ✓ 3-Way Perfect Match
                          </span>
                        )}
                        {m.matchStatus === 'TOLERANCE_WARNING' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                            Within Tolerance ({m.priceVariancePercent}%)
                          </span>
                        )}
                        {m.matchStatus === 'PRICE_DISCREPANCY_HELD' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20">
                            Held: Price Exceeds Cap
                          </span>
                        )}
                        {m.matchStatus === 'QUANTITY_SHORTAGE_HELD' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20">
                            Held: Qty Shortage
                          </span>
                        )}
                        {m.matchStatus === 'RESOLVED_DEBIT_NOTE' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                            Resolved: Debit Note
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecord(m)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-all"
                        >
                          Inspect Match &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOLERANCE RULES CONFIG */}
      {activeTab === 'tolerance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-emerald-500" /> Automated Threshold Rules
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure parameters under which invoices are automatically approved or quarantined for financial controller sign-off.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Maximum Unit Price Variance (%) [Auto-Pass]
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={maxPriceVariancePercent}
                    onChange={(e) => setMaxPriceVariancePercent(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="font-mono font-bold text-slate-900 dark:text-white w-12 text-right">
                    {maxPriceVariancePercent}%
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Invoices with price variance $\le$ {maxPriceVariancePercent}% auto-pass to payment queue.</span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Quantity Shortage Tolerance (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={maxQtyVariancePercent}
                    onChange={(e) => setMaxQtyVariancePercent(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="font-mono font-bold text-slate-900 dark:text-white w-12 text-right">
                    {maxQtyVariancePercent}%
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Differences due to weighbridge scale calibration variance.</span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Hard Stop / Immediate Quarantine Threshold (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={hardBlockThresholdPercent}
                    onChange={(e) => setHardBlockThresholdPercent(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="font-mono font-bold text-red-600 dark:text-red-400 w-12 text-right">
                    {hardBlockThresholdPercent}%
                  </span>
                </div>
                <span className="text-[11px] text-red-500">Variances exceeding {hardBlockThresholdPercent}% automatically lock vendor payment and alert Internal Audit.</span>
              </div>
            </div>

            <button
              onClick={() => alert('Tolerance configuration saved and applied across matching pipeline.')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              Save Active Policy
            </button>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="h-4 w-4 text-blue-500" /> Three-Way Matching Flow Architecture
            </h3>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px]">1</span>
                PO Baseline Binding
              </div>
              <p className="text-[11px]">Authorized procurement purchase order sets maximum unit rate and line item specs.</p>

              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white pt-2">
                <span className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px]">2</span>
                Weighbridge GRN Physical Ingestion
              </div>
              <p className="text-[11px]">Factory gate sensor and QA inspection establishes true physical receipt quantity.</p>

              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white pt-2">
                <span className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-[10px]">3</span>
                Tax Invoice Algorithmic Cross-Match
              </div>
              <p className="text-[11px]">OCR or EDI invoice rates are programmatically verified against GRN and PO with tolerance scoring.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISCREPANCIES */}
      {activeTab === 'discrepancies' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Discrepancy Exception Resolution Desk</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Issue automated debit memos or hold payments for non-compliant vendor invoices.</p>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {records.filter(r => r.matchStatus !== 'PERFECT_MATCH').map((r) => (
                <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{r.invoiceNumber}</span>
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                        (Variance: +${r.totalVarianceAmount.toLocaleString()})
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Vendor: <strong>{r.vendorName}</strong> • PO: <span className="font-mono">{r.poNumber}</span> • GRN: <span className="font-mono">{r.grnNumber}</span>
                    </div>
                    {r.resolutionAction && (
                      <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                        Action Taken: {r.resolutionAction}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResolveDebitNote(r.id)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                    >
                      Issue Debit Note (${r.totalVarianceAmount})
                    </button>
                    <button
                      onClick={() => handleApproveUnderTolerance(r.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all"
                    >
                      Approve Override
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT JOURNAL */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Reconciled General Ledger AP Batch Journal</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all">
              <Download className="h-3.5 w-3.5" /> Export Payment Batch (CSV / XML)
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All 3-way matched and approved invoices are synchronized with the Accounts Payable sub-ledger.
          </p>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-2">
            <div className="text-emerald-600 dark:text-emerald-400 font-bold">[POSTED] BATCH-AP-2026-1022: $213,500.00 Reconciled against PO and GRN balances.</div>
            <div className="text-slate-500">DR: Inventory Raw Material Control (GL-1400) $180,932.20</div>
            <div className="text-slate-500">DR: Input Tax Credit Recoverable (GL-1250) $32,567.80</div>
            <div className="text-slate-500">CR: Accounts Payable Subcontractor Vendor (GL-2100) $213,500.00</div>
          </div>
        </div>
      )}

      {/* MODAL: MATCH INSPECTOR */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Comparative 3-Way Match: {selectedRecord.matchBatchId}</h3>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                <div className="font-semibold text-emerald-800 dark:text-emerald-300">1. Purchase Order</div>
                <div className="font-mono mt-1">{selectedRecord.poNumber}</div>
                <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
                  Qty: <strong>{selectedRecord.poOrderedQty}</strong><br/>
                  Rate: <strong>${selectedRecord.poUnitPrice.toFixed(2)}</strong><br/>
                  Total: <strong>${selectedRecord.poAmount.toLocaleString()}</strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
                <div className="font-semibold text-blue-800 dark:text-blue-300">2. Gate GRN</div>
                <div className="font-mono mt-1">{selectedRecord.grnNumber}</div>
                <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
                  Accepted: <strong>{selectedRecord.grnAcceptedQty}</strong><br/>
                  Weighbridge Date:<br/>
                  <span className="font-mono text-[10px]">{selectedRecord.grnWeighbridgeTareDate}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40">
                <div className="font-semibold text-purple-800 dark:text-purple-300">3. Vendor Invoice</div>
                <div className="font-mono mt-1">{selectedRecord.invoiceNumber}</div>
                <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
                  Billed: <strong>{selectedRecord.invoiceBilledQty}</strong><br/>
                  Rate: <strong>${selectedRecord.invoiceUnitPrice.toFixed(2)}</strong><br/>
                  Total: <strong>${selectedRecord.invoiceAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Variance Analysis:</div>
              <div className="text-slate-600 dark:text-slate-400 space-y-1">
                <div>Quantity Delta: <strong className={selectedRecord.qtyVariance > 0 ? 'text-red-500' : 'text-emerald-500'}>{selectedRecord.qtyVariance} units</strong></div>
                <div>Price Variance: <strong className={selectedRecord.priceVariancePercent > 0 ? 'text-red-500' : 'text-emerald-500'}>{selectedRecord.priceVariancePercent}%</strong></div>
                <div>Net Financial Discrepancy: <strong className="text-red-600 dark:text-red-400 font-mono">${selectedRecord.totalVarianceAmount.toLocaleString()}</strong></div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
              >
                Close
              </button>
              {selectedRecord.totalVarianceAmount > 0 && (
                <button
                  onClick={() => handleResolveDebitNote(selectedRecord.id)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm"
                >
                  Generate Debit Note (${selectedRecord.totalVarianceAmount})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

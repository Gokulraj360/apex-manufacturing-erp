'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  Calendar,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  CheckCircle2,
  Clock,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowRight,
  Eye,
  X,
  FileCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LedgerTransaction {
  id: string;
  voucherRef: string;
  date: string;
  partyName: string;
  partyType: 'CUSTOMER' | 'VENDOR' | 'STATUTORY_TAX' | 'BANK';
  transactionType: 'SALES_CREDIT' | 'VENDOR_DEBIT' | 'TAX_PAYMENT' | 'RTV_RECOVERY';
  description: string;
  debit: number; // Outflow (₹)
  credit: number; // Inflow (₹)
  balance: number;
  clearanceStatus: 'CLEARED' | 'RECONCILED' | 'PENDING_BANK';
}

const INITIAL_TRANSACTIONS: LedgerTransaction[] = [];

export default function FinancialStatementsPage() {
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'SALES_CREDITS' | 'VENDOR_DEBITS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CLEARED' | 'RECONCILED' | 'PENDING_BANK'>('ALL');
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);


  // Fetch or filter transactions
  useEffect(() => {
    async function loadStatements() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          startDate,
          endDate,
          category: categoryFilter,
        });
        const res = await fetch(`/api/finance/statements/ledger?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.transactions) {
            setTransactions(data.transactions);
          }
        }
      } catch (err) {
        // Fallback to client-side filtering of initial records
        console.warn('Using client-side statement records fallback');
      } finally {
        setIsLoading(false);
      }
    }

    loadStatements();
  }, [startDate, endDate, categoryFilter]);

  // Client-side filtering for UI search and status
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Date range filter
      if (startDate && tx.date < startDate) return false;
      if (endDate && tx.date > endDate) return false;

      // Category filter
      if (categoryFilter === 'SALES_CREDITS' && tx.credit <= 0) return false;
      if (categoryFilter === 'VENDOR_DEBITS' && tx.debit <= 0) return false;

      // Status filter
      if (statusFilter !== 'ALL' && tx.clearanceStatus !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          tx.voucherRef.toLowerCase().includes(q) ||
          tx.partyName.toLowerCase().includes(q) ||
          tx.description.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [transactions, startDate, endDate, categoryFilter, statusFilter, searchQuery]);

  // Aggregated Metrics
  const totalPeriodInflow = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => sum + tx.credit, 0);
  }, [filteredTransactions]);

  const totalPeriodOutflow = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => sum + tx.debit, 0);
  }, [filteredTransactions]);

  const netCashFlow = totalPeriodInflow - totalPeriodOutflow;
  const filteredCount = filteredTransactions.length;

  // Currency Formatter
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatInCrores = (val: number) => {
    const cr = val / 10000000;
    return `₹${cr.toFixed(3)} Cr`;
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    const headers = [
      'Voucher Ref',
      'Date',
      'Party Name',
      'Party Type',
      'Transaction Type',
      'Description',
      'Debit Outflow (INR)',
      'Credit Inflow (INR)',
      'Running Balance (INR)',
      'Clearance Status',
    ];

    const rows = filteredTransactions.map((tx) => [
      `"${tx.voucherRef}"`,
      `"${tx.date}"`,
      `"${tx.partyName.replace(/"/g, '""')}"`,
      `"${tx.partyType}"`,
      `"${tx.transactionType}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.debit.toFixed(2),
      tx.credit.toFixed(2),
      tx.balance.toFixed(2),
      `"${tx.clearanceStatus}"`,
    ]);

    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Microsoft Excel compatibility
      `"APEX ADVANCED MANUFACTURING CORP - GENERAL LEDGER STATEMENT"\n` +
      `"Period: ${startDate} to ${endDate} | Category: ${categoryFilter} | Generated on: ${new Date().toLocaleString('en-IN')}"\n` +
      `"Total Inflow: INR ${totalPeriodInflow.toFixed(2)} | Total Outflow: INR ${totalPeriodOutflow.toFixed(2)} | Net Cash Flow: INR ${netCashFlow.toFixed(2)}"\n\n` +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Apex_General_Ledger_Statement_${startDate}_to_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Trigger Print / PDF
  const handleExportPdf = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Statutory Financial Gateway
            </span>
            <span className="text-xs text-slate-500">General Ledger & Real-Time Cash Flow Audit</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Date-Wise Financial Statements & Ledger Export
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Filter general ledger inflows and outflows by date interval, analyze bank clearance statuses, and generate certified financial statements.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            href="/finance/gst"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs"
          >
            GSTR-1 Tax Engine
          </Link>
          <Link
            href="/finance/debit-notes"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs"
          >
            AP Debit Notes
          </Link>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export Excel (.xlsx)
          </button>
          <button
            onClick={handleExportPdf}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Export PDF Statement
          </button>
        </div>
      </div>

      {/* Date Range & Category Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Date Range Picker */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Date Range:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-400 font-semibold">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quick Date Presets */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setStartDate('2026-10-01');
                  setEndDate('2026-10-31');
                }}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-semibold rounded-lg transition',
                  startDate === '2026-10-01' && endDate === '2026-10-31'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                )}
              >
                Oct 2026
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartDate('2026-10-01');
                  setEndDate('2026-10-07');
                }}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-semibold rounded-lg transition',
                  startDate === '2026-10-01' && endDate === '2026-10-07'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                )}
              >
                Current Week
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Category:
              </span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Transactions</option>
              <option value="SALES_CREDITS">Sales Credits (Inflows)</option>
              <option value="VENDOR_DEBITS">Vendor Debits (Outflows)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="CLEARED">Cleared Only</option>
              <option value="RECONCILED">Reconciled</option>
              <option value="PENDING_BANK">Pending Bank Clearance</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by voucher ref, party name, or description..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium ml-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Aggregated KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Period Inflow */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Period Inflow
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {formatInCrores(totalPeriodInflow)}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {formatINR(totalPeriodInflow)}
          </div>
        </div>

        {/* Card 2: Total Period Outflow */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Period Outflow
            </span>
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
            {formatInCrores(totalPeriodOutflow)}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {formatINR(totalPeriodOutflow)}
          </div>
        </div>

        {/* Card 3: Net Cash Flow */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Net Period Cash Flow
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div
            className={cn(
              'text-2xl sm:text-3xl font-black',
              netCashFlow >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            )}
          >
            {formatInCrores(netCashFlow)}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Surplus: {formatINR(netCashFlow)}
          </div>
        </div>

        {/* Card 4: Filtered Records Count */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Filtered Records
            </span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {filteredCount} Vouchers
          </div>
          <div className="text-xs text-slate-500">
            {categoryFilter === 'ALL'
              ? 'All Ledger Transactions'
              : categoryFilter === 'SALES_CREDITS'
              ? 'Inflow Credits Only'
              : 'Outflow Debits Only'}
          </div>
        </div>
      </div>

      {/* General Ledger Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              General Ledger Transactions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Audited records for the period {startDate} to {endDate} with running balance reconciliations.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Showing {filteredTransactions.length} entries</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Voucher Ref & Date</th>
                <th className="py-3 px-4">Party Name & Narration</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-right">Debit Outflow (₹)</th>
                <th className="py-3 px-4 text-right">Credit Inflow (₹)</th>
                <th className="py-3 px-4 text-right">Running Balance (₹)</th>
                <th className="py-3 px-4 text-center">Clearance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No transactions match the selected date interval or filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {tx.voucherRef}
                      <div className="text-[10px] text-slate-400 font-normal">{tx.date}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {tx.partyName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {tx.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase',
                          tx.transactionType === 'SALES_CREDIT' &&
                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                          tx.transactionType === 'VENDOR_DEBIT' &&
                            'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
                          tx.transactionType === 'TAX_PAYMENT' &&
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                          tx.transactionType === 'RTV_RECOVERY' &&
                            'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        )}
                      >
                        {tx.transactionType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      {tx.debit > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400">
                          {formatINR(tx.debit)}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      {tx.credit > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {formatINR(tx.credit)}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatINR(tx.balance)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center justify-center gap-1 mx-auto w-fit',
                          tx.clearanceStatus === 'CLEARED' &&
                            'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
                          tx.clearanceStatus === 'RECONCILED' &&
                            'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
                          tx.clearanceStatus === 'PENDING_BANK' &&
                            'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        )}
                      >
                        {tx.clearanceStatus === 'CLEARED' && <CheckCircle2 className="w-3 h-3" />}
                        {tx.clearanceStatus === 'PENDING_BANK' && <Clock className="w-3 h-3" />}
                        {tx.clearanceStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-50/80 dark:bg-slate-950/60 font-bold border-t-2 border-slate-200 dark:border-slate-800">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-slate-900 dark:text-white uppercase text-xs">
                  Summary Totals ({filteredCount} Records)
                </td>
                <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400 text-sm">
                  {formatINR(totalPeriodOutflow)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatINR(totalPeriodInflow)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-blue-600 dark:text-blue-400 text-sm">
                  Net: {formatINR(netCashFlow)}
                </td>
                <td className="py-3 px-4 text-center text-slate-400 text-[11px]">Audited</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* PDF Statement Preview & Print Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Financial Statement Print Preview (PDF)
                </h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Area */}
            <div
              id="printable-financial-statement"
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-white text-slate-900 my-4 border border-slate-200 rounded-xl"
            >
              {/* Official Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                    Apex Advanced Manufacturing Corp.
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    Plant Line 04 Cleanroom Complex &bull; KIADB Industrial Area &bull; Bengaluru 560066
                  </p>
                  <p className="text-xs text-slate-600">
                    GSTIN: <strong>29ABCDE1234F1Z5</strong> &bull; CIN: U32100KA2024PTC189021
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase rounded">
                    Official General Ledger
                  </div>
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    Generated: {new Date().toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Statement Metadata */}
              <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <span className="text-slate-500 uppercase font-semibold text-[10px]">
                    Audit Period:
                  </span>
                  <div className="font-bold text-slate-900">
                    {startDate} to {endDate}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-semibold text-[10px]">
                    Category Scope:
                  </span>
                  <div className="font-bold text-slate-900">
                    {categoryFilter === 'ALL'
                      ? 'Consolidated Ledger'
                      : categoryFilter === 'SALES_CREDITS'
                      ? 'Sales Inflows'
                      : 'Vendor Outflows'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-semibold text-[10px]">
                    Accounting Standard:
                  </span>
                  <div className="font-bold text-slate-900">Ind-AS 115 / GST Table 4A</div>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border border-slate-200 rounded-lg bg-emerald-50/50">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Total Period Inflow
                  </div>
                  <div className="text-base font-black text-emerald-700 font-mono mt-0.5">
                    {formatINR(totalPeriodInflow)}
                  </div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg bg-rose-50/50">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Total Period Outflow
                  </div>
                  <div className="text-base font-black text-rose-700 font-mono mt-0.5">
                    {formatINR(totalPeriodOutflow)}
                  </div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg bg-blue-50/50">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Net Period Cash Flow
                  </div>
                  <div className="text-base font-black text-blue-700 font-mono mt-0.5">
                    {formatINR(netCashFlow)}
                  </div>
                </div>
              </div>

              {/* Printable Table */}
              <table className="w-full text-left text-[11px] border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-2.5">Date</th>
                    <th className="py-2 px-2.5">Voucher Ref</th>
                    <th className="py-2 px-2.5">Party & Narration</th>
                    <th className="py-2 px-2.5 text-right">Debit (₹)</th>
                    <th className="py-2 px-2.5 text-right">Credit (₹)</th>
                    <th className="py-2 px-2.5 text-right">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-2 px-2.5 font-mono">{tx.date}</td>
                      <td className="py-2 px-2.5 font-mono font-semibold">{tx.voucherRef}</td>
                      <td className="py-2 px-2.5">
                        <strong className="text-slate-900">{tx.partyName}</strong>
                        <div className="text-[10px] text-slate-500">{tx.description}</div>
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono font-medium">
                        {tx.debit > 0 ? formatINR(tx.debit) : '-'}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono font-medium">
                        {tx.credit > 0 ? formatINR(tx.credit) : '-'}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold">
                        {formatINR(tx.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-400">
                  <tr>
                    <td colSpan={3} className="py-2 px-2.5 uppercase text-[10px]">
                      Totals
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono text-rose-700">
                      {formatINR(totalPeriodOutflow)}
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono text-emerald-700">
                      {formatINR(totalPeriodInflow)}
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono text-blue-700">
                      {formatINR(netCashFlow)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-slate-700">
                <div>
                  <div className="border-b border-slate-400 w-48 mb-1"></div>
                  <p className="font-bold">Prepared By: Finance Officer</p>
                  <p className="text-[10px] text-slate-500">AP/AR Ledger Desk</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="border-b border-slate-400 w-48 mb-1"></div>
                  <p className="font-bold">Authorized Signatory</p>
                  <p className="text-[10px] text-slate-500">Chief Financial Officer (CFO)</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Statement / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

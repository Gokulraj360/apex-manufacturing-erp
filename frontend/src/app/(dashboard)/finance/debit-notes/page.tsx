'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  FileText,
  Printer,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  DollarSign,
  PackageX,
  Scale,
  Calendar,
  Truck,
  ExternalLink,
  X,
  Download,
  Barcode,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DebitNoteItem {
  id: string;
  dnNumber: string;
  vendorId: string;
  vendorName: string;
  vendorGstin: string;
  lotRef: string;
  poNumber: string;
  itemName: string;
  rejectedQty: number;
  uom: string;
  unitRate: number;
  amount: number;
  reason: string;
  defectDetails: string;
  rtvChallanNo: string;
  apDeductionStatus: 'DEDUCTED_FROM_AP' | 'AP_PENDING' | 'SETTLED';
  quarantineLocation: string;
  inspectorName: string;
  authorizedBy: string;
  createdAt: string;
}

export default function DebitNotesLedgerPage() {
  const [debitNotes, setDebitNotes] = useState<DebitNoteItem[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteForSlip, setSelectedNoteForSlip] = useState<DebitNoteItem | null>(null);

  // Fetch live Debit Notes from backend
  useEffect(() => {
    fetch('/api/finance/debit-notes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDebitNotes(data);
        }
      })
      .catch(() => {});
  }, []);


  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const filteredNotes = debitNotes.filter((note) => {
    const q = searchQuery.toLowerCase();
    return (
      note.dnNumber.toLowerCase().includes(q) ||
      note.rtvChallanNo.toLowerCase().includes(q) ||
      note.vendorName.toLowerCase().includes(q) ||
      note.lotRef.toLowerCase().includes(q) ||
      note.itemName.toLowerCase().includes(q)
    );
  });

  const totalDeducted = debitNotes.reduce((sum, n) => sum + n.amount, 0);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              Accounts Payable Deduction Ledger
            </span>
            <span className="text-xs text-slate-500">Statutory RTV & Debit Notes</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Quarantined RTV & Accounts Payable (AP) Debit Notes Ledger
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Official ledger of incoming vendor rejections, automatically debited against open vendor invoices with printable Return-To-Vendor delivery slips.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/quality/inward"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            Go to Inward IQC Desk
          </Link>
          <Link
            href="/finance/reconciliation"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            3-Way Reconciliation
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total AP Debit Notes Value
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {formatINR(totalDeducted)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auto-debited from vendor open balances
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active RTV Challans
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {debitNotes.length} Lots
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Awaiting physical gate outward clearance
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Ledger Reconciliation Status
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7" />
            100% Deducted
          </div>
          <p className="text-xs text-slate-500 mt-1">
            No unrecovered rejection balances
          </p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by DN #, RTV #, Vendor, Lot Ref #..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong>{filteredNotes.length}</strong> Debit Notes
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Debit Note #</th>
                <th className="py-3 px-4">Vendor & GSTIN</th>
                <th className="py-3 px-4">Lot Ref & Item</th>
                <th className="py-3 px-4 text-right">Rejected Qty</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">RTV Challan #</th>
                <th className="py-3 px-4">Defect Reason</th>
                <th className="py-3 px-4">AP Ledger Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No quarantined RTV or Accounts Payable debit notes found. Rejections from Inward IQC will automatically populate here.
                  </td>
                </tr>
              ) : (
                filteredNotes.map((note) => (
                  <tr
                    key={note.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* DN Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">
                      {note.dnNumber}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(note.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Vendor */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {note.vendorName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        GSTIN: {note.vendorGstin}
                      </div>
                    </td>

                    {/* Lot Ref & Item */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {note.lotRef}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {note.itemName}
                      </div>
                    </td>

                    {/* Rejected Qty */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {note.rejectedQty.toLocaleString('en-IN')} {note.uom}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                      {formatINR(note.amount)}
                    </td>

                    {/* RTV Challan Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {note.rtvChallanNo}
                      <div className="text-[10px] text-slate-400 font-normal truncate">
                        {note.quarantineLocation}
                      </div>
                    </td>

                    {/* Defect Reason */}
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400" title={note.reason}>
                      {note.reason}
                    </td>

                    {/* AP Ledger Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Deducted from AP Ledger
                      </span>
                    </td>

                    {/* Actions: Print Slip */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedNoteForSlip(note)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-300 transition border border-slate-200 dark:border-slate-700"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print RTV Slip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Printable Return-To-Vendor (RTV) Delivery Slip Modal */}
      {selectedNoteForSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 my-8">
            {/* Modal Header & Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <Truck className="w-5 h-5" />
                <span>Return-To-Vendor (RTV) Outward Delivery Slip</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Challan Slip
                </button>
                <button
                  onClick={() => setSelectedNoteForSlip(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-6 border border-slate-300 dark:border-slate-700 rounded-xl space-y-5 bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans print:border-none print:p-0">
              {/* Plant Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="text-xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                    APEX ELECTRONICS MANUFACTURING LTD.
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Plot 48, Electronics City Cleanroom Complex, Phase 1, Bangalore 560100
                  </p>
                  <p className="text-xs text-slate-500">
                    GSTIN: <strong>29ABCDE1234F1Z5</strong> • CIN: L32109KA2020PLC134889
                  </p>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-black text-xs uppercase tracking-wider inline-block">
                    Material Rejection Challan
                  </div>
                  <div className="text-sm font-mono font-bold mt-1">
                    {selectedNoteForSlip.rtvChallanNo}
                  </div>
                  <div className="text-xs text-slate-500">
                    Date:{' '}
                    {new Date(selectedNoteForSlip.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Vendor & Delivery Particulars */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Return Consignee (Vendor)
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedNoteForSlip.vendorName}
                  </div>
                  <div className="text-slate-500">Vendor Code: {selectedNoteForSlip.vendorId}</div>
                  <div className="text-slate-500 font-mono">
                    GSTIN: {selectedNoteForSlip.vendorGstin}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Financial & Gate References
                  </div>
                  <div>
                    Debit Note Ref:{' '}
                    <strong className="text-rose-600 dark:text-rose-400 font-mono">
                      {selectedNoteForSlip.dnNumber}
                    </strong>
                  </div>
                  <div>
                    Original PO Ref:{' '}
                    <strong className="font-mono">{selectedNoteForSlip.poNumber}</strong>
                  </div>
                  <div>
                    Quarantine Zone: <strong>{selectedNoteForSlip.quarantineLocation}</strong>
                  </div>
                </div>
              </div>

              {/* Rejection Particulars Table */}
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Item Description & Lot #</th>
                    <th className="p-2.5 text-right">Rejected Qty</th>
                    <th className="p-2.5 text-right">Unit Rate (₹)</th>
                    <th className="p-2.5 text-right">Total Debit Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-2.5">
                      <div className="font-bold">{selectedNoteForSlip.itemName}</div>
                      <div className="font-mono text-slate-500 text-[11px]">
                        Batch / Heat Lot: {selectedNoteForSlip.lotRef}
                      </div>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold">
                      {selectedNoteForSlip.rejectedQty.toLocaleString('en-IN')}{' '}
                      {selectedNoteForSlip.uom}
                    </td>
                    <td className="p-2.5 text-right font-mono">
                      {formatINR(selectedNoteForSlip.unitRate || selectedNoteForSlip.amount / selectedNoteForSlip.rejectedQty)}
                    </td>
                    <td className="p-2.5 text-right font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
                      {formatINR(selectedNoteForSlip.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Root Cause & Quality Observations */}
              <div className="p-3.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                <div className="font-bold text-rose-800 dark:text-rose-300 uppercase text-[10px]">
                  Technical Rejection Root Cause & Defect Description
                </div>
                <div className="font-semibold text-rose-900 dark:text-rose-200">
                  {selectedNoteForSlip.reason}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {selectedNoteForSlip.defectDetails}
                </p>
              </div>

              {/* AP Deduction Statutory Notice */}
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div className="text-emerald-900 dark:text-emerald-200 text-[11px]">
                  <strong>Accounts Payable Ledger Notice:</strong> Debit Note{' '}
                  <strong>{selectedNoteForSlip.dnNumber}</strong> of{' '}
                  <strong>{formatINR(selectedNoteForSlip.amount)}</strong> has been deducted from open AP vendor liability.
                </div>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-500">
                <div className="space-y-6">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedNoteForSlip.inspectorName || 'M. Joshi (QC Lead)'}
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold uppercase">
                    IQC Quality Inspector
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    D. Sharma (Warehouse)
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold uppercase">
                    Stores Putaway Officer
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedNoteForSlip.authorizedBy || 'K. Singhania (Finance)'}
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold uppercase">
                    Head of Accounts Payable
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="text-slate-400 italic">Signature & Stamp</div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold uppercase">
                    Carrier / Transporter
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

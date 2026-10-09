'use client';

import React, { useState } from 'react';
import {
  Receipt,
  FileCheck2,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  Building,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { VendorBillItem } from '@/types/finance';

const initialBills: VendorBillItem[] = [
  {
    id: 'bill-1',
    billNumber: 'BILL-2026-081',
    vendorName: 'Apex Metallurgy Corp',
    vendorInvoiceNo: 'INV-AMC-9042',
    poNumber: 'PO-2026-9042',
    grnNumber: 'GRN-PLANT1-440',
    invoiceDate: '2026-10-04',
    dueDate: '2026-11-03',
    subtotal: 130000,
    taxAmount: 15000,
    totalAmount: 145000,
    paidAmount: 0,
    status: 'MATCHED',
    matchStatus: 'EXACT_MATCH',
    scheduledPaymentDate: '2026-10-25',
  },
  {
    id: 'bill-2',
    billNumber: 'BILL-2026-082',
    vendorName: 'Siemens Industrial Automation',
    vendorInvoiceNo: 'SIA-2026-88',
    poNumber: 'PO-2026-9045',
    grnNumber: 'GRN-PLANT1-442',
    invoiceDate: '2026-10-05',
    dueDate: '2026-11-04',
    subtotal: 82000,
    taxAmount: 6500,
    totalAmount: 88500,
    paidAmount: 0,
    status: 'PENDING_MATCHING',
    matchStatus: 'PENDING',
  },
  {
    id: 'bill-3',
    billNumber: 'BILL-2026-083',
    vendorName: 'Global Chemical Solutions',
    vendorInvoiceNo: 'GCS-2026-119',
    poNumber: 'PO-2026-8990',
    grnNumber: 'GRN-PLANT1-438-SHORTAGE',
    invoiceDate: '2026-09-28',
    dueDate: '2026-10-28',
    subtotal: 34000,
    taxAmount: 2800,
    totalAmount: 36800,
    paidAmount: 0,
    status: 'DISCREPANCY',
    matchStatus: 'QTY_DISCREPANCY',
    discrepancyNotes: 'Warehouse logged 12 Barrels received on GRN, but Vendor billed for 15 Barrels (Variance: 3 Barrels)',
  },
  {
    id: 'bill-4',
    billNumber: 'BILL-2026-080',
    vendorName: 'Parker Hannifin Pneumatics',
    vendorInvoiceNo: 'PH-4011-B',
    poNumber: 'PO-2026-8920',
    grnNumber: 'GRN-PLANT1-429',
    invoiceDate: '2026-09-20',
    dueDate: '2026-10-20',
    subtotal: 22000,
    taxAmount: 1800,
    totalAmount: 23800,
    paidAmount: 23800,
    status: 'PAID',
    matchStatus: 'EXACT_MATCH',
  },
];

export default function AccountsPayablePage() {
  const [bills, setBills] = useState<VendorBillItem[]>(initialBills);
  const [matchingModalBill, setMatchingModalBill] = useState<VendorBillItem | null>(null);
  const [paymentModalBill, setPaymentModalBill] = useState<VendorBillItem | null>(null);
  const [scheduledDate, setScheduledDate] = useState('2026-10-20');

  const handleExecute3WayMatch = (billId: string) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== billId) return b;
        return {
          ...b,
          status: 'MATCHED',
          matchStatus: 'EXACT_MATCH',
          discrepancyNotes: undefined,
        };
      }),
    );
    setMatchingModalBill(null);
  };

  const handleSchedulePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBill) return;

    setBills((prev) =>
      prev.map((b) =>
        b.id === paymentModalBill.id
          ? {
              ...b,
              scheduledPaymentDate: scheduledDate,
              status: 'SCHEDULED_FOR_PAYMENT',
            }
          : b,
      ),
    );
    setPaymentModalBill(null);
  };

  const handleInstantDisburse = (billId: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              status: 'PAID',
              paidAmount: b.totalAmount,
            }
          : b,
      ),
    );
  };

  const totalOutstandingAP = bills
    .filter((b) => b.status !== 'PAID')
    .reduce((acc, b) => acc + (b.totalAmount - b.paidAmount), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-400" />
            Accounts Payable & 3-Way Matching Queue
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Automated verification of Purchase Orders vs Goods Received Notes vs Vendor Invoices before release of funds.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Open AP Liability</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatCurrency(totalOutstandingAP)}
          </div>
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      {bills.some((b) => b.status === 'DISCREPANCY') && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-amber-100">
                3-Way Matching Discrepancy Flagged
              </div>
              <div className="text-xs text-amber-300 mt-0.5">
                BILL-2026-083 (Global Chemical Solutions): Quantity variance between GRN and Billed line items. Payment lock engaged.
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold bg-amber-900/60 text-amber-200 px-3 py-1 rounded">
            Payment On Hold
          </span>
        </div>
      )}

      {/* Bills Table */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Vendor Bills & Matching Verification Queue
          </span>
          <span className="text-xs text-slate-400">{bills.length} Total Bills</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Bill #</th>
                <th className="py-3 px-4">Vendor & Invoice</th>
                <th className="py-3 px-4">PO & GRN Ref</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">3-Way Match</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {bills.map((bill) => {
                const isExact = bill.matchStatus === 'EXACT_MATCH';
                const isDiscrepancy = bill.matchStatus === 'QTY_DISCREPANCY' || bill.matchStatus === 'PRICE_DISCREPANCY';
                const isPaid = bill.status === 'PAID';

                return (
                  <tr key={bill.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {bill.billNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{bill.vendorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Ref: {bill.vendorInvoiceNo}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      <div>{bill.poNumber || 'No PO'}</div>
                      <div className="text-slate-500">{bill.grnNumber || 'No GRN'}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {bill.dueDate}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {formatCurrency(bill.totalAmount)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isExact
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isDiscrepancy
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {isExact ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {bill.matchStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isPaid
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : bill.status === 'SCHEDULED_FOR_PAYMENT'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {bill.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isPaid ? (
                        <span className="text-[11px] text-emerald-400 font-mono">Paid in Full</span>
                      ) : bill.status === 'PENDING_MATCHING' || isDiscrepancy ? (
                        <button
                          type="button"
                          onClick={() => setMatchingModalBill(bill)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors"
                        >
                          Verify 3-Way
                        </button>
                      ) : bill.status === 'MATCHED' ? (
                        <button
                          type="button"
                          onClick={() => setPaymentModalBill(bill)}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors"
                        >
                          Schedule Pay
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleInstantDisburse(bill.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                        >
                          Disburse
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: 3-Way Match Verification Inspector */}
      {matchingModalBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-[#0f172a] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-blue-400" />
                3-Way Match Analysis: {matchingModalBill.billNumber}
              </h3>
              <button
                type="button"
                onClick={() => setMatchingModalBill(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 font-semibold mb-1">1. Purchase Order</div>
                <div className="text-white font-bold">{matchingModalBill.poNumber || 'N/A'}</div>
                <div className="text-emerald-400 font-mono mt-1">{formatCurrency(matchingModalBill.totalAmount)}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 font-semibold mb-1">2. Goods Received Note</div>
                <div className="text-white font-bold">{matchingModalBill.grnNumber || 'Pending'}</div>
                <div className="text-slate-300 font-mono mt-1">Warehouse Gate 01</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 font-semibold mb-1">3. Vendor Invoice</div>
                <div className="text-white font-bold">{matchingModalBill.vendorInvoiceNo}</div>
                <div className="text-emerald-400 font-mono mt-1">{formatCurrency(matchingModalBill.totalAmount)}</div>
              </div>
            </div>

            {matchingModalBill.discrepancyNotes && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
                <strong>Variance Note:</strong> {matchingModalBill.discrepancyNotes}
              </div>
            )}

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              Contract terms verify that pricing adheres to master enterprise supply agreement. Tolerances within 0.00% variance threshold.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMatchingModalBill(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleExecute3WayMatch(matchingModalBill.id)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Confirm Match & Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule Payment */}
      {paymentModalBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                Schedule AP Payment Disbursement
              </h3>
              <button
                type="button"
                onClick={() => setPaymentModalBill(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>Vendor: <strong className="text-white">{paymentModalBill.vendorName}</strong></div>
              <div>Invoice: <strong className="text-white">{paymentModalBill.vendorInvoiceNo}</strong></div>
              <div>Amount to Pay: <strong className="text-emerald-400 font-mono">{formatCurrency(paymentModalBill.totalAmount)}</strong></div>
            </div>

            <form onSubmit={handleSchedulePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Scheduled Payment Execution Date
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentModalBill(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Confirm Scheduled Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Send,
  Building,
  RotateCcw,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ClientInvoiceItem, CreditNoteItem } from '@/types/finance';

const initialInvoices: ClientInvoiceItem[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-091',
    clientName: 'Lockheed Martin Defense Systems',
    issueDate: '2026-09-15',
    dueDate: '2026-10-15',
    subtotal: 500000,
    taxRatePercentage: 18,
    taxAmount: 90000,
    totalAmount: 590000,
    paidAmount: 590000,
    status: 'PAID',
    paymentTerms: 'NET_30',
    lineItems: [{ description: 'Titanium Truss Assembly - Batch 01', quantity: 100, unitPrice: 5000, amount: 500000 }],
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-092',
    clientName: 'Tesla Gigafactory Texas',
    issueDate: '2026-09-25',
    dueDate: '2026-10-25',
    subtotal: 380000,
    taxRatePercentage: 18,
    taxAmount: 68400,
    totalAmount: 448400,
    paidAmount: 200000,
    status: 'PARTIALLY_PAID',
    paymentTerms: 'NET_30',
    lineItems: [{ description: 'Underbody Cast Frames - Schedule B', quantity: 200, unitPrice: 1900, amount: 380000 }],
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-093',
    clientName: 'Boeing Commercial Airplanes',
    issueDate: '2026-08-20',
    dueDate: '2026-09-20',
    subtotal: 210000,
    taxRatePercentage: 18,
    taxAmount: 37800,
    totalAmount: 247800,
    paidAmount: 0,
    status: 'OVERDUE',
    paymentTerms: 'NET_30',
    lineItems: [{ description: 'High-Torque Actuator Housings', quantity: 150, unitPrice: 1400, amount: 210000 }],
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-094',
    clientName: 'SpaceX Starbase Facilities',
    issueDate: '2026-10-02',
    dueDate: '2026-11-02',
    subtotal: 160000,
    taxRatePercentage: 18,
    taxAmount: 28800,
    totalAmount: 188800,
    paidAmount: 0,
    status: 'ISSUED',
    paymentTerms: 'NET_30',
    lineItems: [{ description: 'Cryogenic Valve Flanges', quantity: 80, unitPrice: 2000, amount: 160000 }],
  },
];

const initialCreditNotes: CreditNoteItem[] = [
  {
    id: 'cn-1',
    creditNoteNumber: 'CN-2026-015',
    clientInvoiceId: 'inv-2',
    invoiceNumber: 'INV-2026-092',
    clientName: 'Tesla Gigafactory Texas',
    issueDate: '2026-10-01',
    amount: 12000,
    reason: 'Freight volume discount adjustment per Q3 SLA amendment',
    status: 'APPLIED',
  },
];

export default function AccountsReceivablePage() {
  const [invoices, setInvoices] = useState<ClientInvoiceItem[]>(initialInvoices);
  const [creditNotes, setCreditNotes] = useState<CreditNoteItem[]>(initialCreditNotes);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<ClientInvoiceItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [creditModalInvoice, setCreditModalInvoice] = useState<ClientInvoiceItem | null>(null);
  const [creditForm, setCreditForm] = useState({ amount: 0, reason: '' });

  const aging = {
    current: 188800,
    days31to60: 248400,
    days61to90: 247800,
    over90: 0,
    totalOutstanding: 685000,
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== paymentModalInvoice.id) return inv;
        const newPaid = inv.paidAmount + paymentAmount;
        const isFull = newPaid >= inv.totalAmount - 0.01;
        return {
          ...inv,
          paidAmount: newPaid,
          status: isFull ? 'PAID' : 'PARTIALLY_PAID',
        };
      }),
    );
    setPaymentModalInvoice(null);
  };

  const handleIssueCreditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditModalInvoice) return;

    const newCN: CreditNoteItem = {
      id: `cn-${Date.now()}`,
      creditNoteNumber: `CN-2026-0${creditNotes.length + 16}`,
      clientInvoiceId: creditModalInvoice.id,
      invoiceNumber: creditModalInvoice.invoiceNumber,
      clientName: creditModalInvoice.clientName,
      issueDate: new Date().toISOString().split('T')[0],
      amount: creditForm.amount,
      reason: creditForm.reason,
      status: 'APPLIED',
    };

    setCreditNotes([newCN, ...creditNotes]);
    setCreditModalInvoice(null);
    setCreditForm({ amount: 0, reason: '' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-emerald-400" />
            Accounts Receivable & Client Invoicing
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time client invoice dispatching, payment reconciliation, aging alerts, and credit notes.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Outstanding Receivables</div>
          <div className="text-xl font-bold font-mono text-blue-400">
            {formatCurrency(aging.totalOutstanding)}
          </div>
        </div>
      </div>

      {/* Aging Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Current (0-30 Days)
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-2">
            {formatCurrency(aging.current)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Within standard credit terms</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            31 - 60 Days
          </div>
          <div className="text-xl font-bold font-mono text-blue-400 mt-2">
            {formatCurrency(aging.days31to60)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Due for automated statement reminder</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            61 - 90 Days (Overdue)
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-2">
            {formatCurrency(aging.days61to90)}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Executive collection action required</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            90+ Days (Critical)
          </div>
          <div className="text-xl font-bold font-mono text-slate-400 mt-2">
            {formatCurrency(aging.over90)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Zero bad debt write-offs</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Active Client Invoices
          </span>
          <span className="text-xs text-slate-400">{invoices.length} Client Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client Enterprise</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {invoices.map((inv) => {
                const isPaid = inv.status === 'PAID';
                const isOverdue = inv.status === 'OVERDUE';
                const isPartial = inv.status === 'PARTIALLY_PAID';

                return (
                  <tr key={inv.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-200">
                      {inv.clientName}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      {inv.issueDate}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {inv.dueDate}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {formatCurrency(inv.totalAmount)}
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-400">
                      {formatCurrency(inv.paidAmount)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isPaid
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isOverdue
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : isPartial
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {inv.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      {!isPaid && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentModalInvoice(inv);
                              setPaymentAmount(inv.totalAmount - inv.paidAmount);
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                          >
                            Receive $
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCreditModalInvoice(inv);
                              setCreditForm({ amount: 5000, reason: '' });
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-colors"
                          >
                            Credit Note
                          </button>
                        </>
                      )}
                      {isPaid && (
                        <span className="text-[11px] text-emerald-400 font-mono">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Notes Ledger */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-indigo-400" />
          Issued Credit Notes & Adjustments
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Credit Note #</th>
                <th className="py-3 px-4">Invoice Reference</th>
                <th className="py-3 px-4">Client Enterprise</th>
                <th className="py-3 px-4">Amount Credited</th>
                <th className="py-3 px-4">Reason / Authorization</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {creditNotes.map((cn) => (
                <tr key={cn.id} className="hover:bg-slate-800/20">
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {cn.creditNoteNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {cn.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    {cn.clientName}
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-400 font-bold">
                    {formatCurrency(cn.amount)}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {cn.reason}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      {cn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Client Payment */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                Record Incoming Client Remittance
              </h3>
              <button
                type="button"
                onClick={() => setPaymentModalInvoice(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div>Invoice: <strong className="text-white">{paymentModalInvoice.invoiceNumber}</strong></div>
              <div>Client: <strong className="text-white">{paymentModalInvoice.clientName}</strong></div>
              <div>Remaining Due: <strong className="text-blue-400 font-mono">{formatCurrency(paymentModalInvoice.totalAmount - paymentModalInvoice.paidAmount)}</strong></div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Amount Received ($)
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Confirm & Post Remittance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Credit Note */}
      {creditModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-amber-400" />
                Issue Credit Note
              </h3>
              <button
                type="button"
                onClick={() => setCreditModalInvoice(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleIssueCreditNote} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Credit Amount ($)
                </label>
                <input
                  type="number"
                  required
                  value={creditForm.amount}
                  onChange={(e) => setCreditForm({ ...creditForm, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Reason / Authorized Justification
                </label>
                <textarea
                  required
                  placeholder="e.g. Returned batch of 4 parts due to QC specification change"
                  value={creditForm.reason}
                  onChange={(e) => setCreditForm({ ...creditForm, reason: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreditModalInvoice(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white"
                >
                  Issue Credit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

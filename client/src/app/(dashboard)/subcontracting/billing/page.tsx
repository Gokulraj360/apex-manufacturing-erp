'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  FileSpreadsheet,
  Building2,
  Calendar,
  DollarSign,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  ExternalLink,
  CreditCard,
  Check,
  AlertCircle,
  RefreshCw,
  Landmark,
  FileText,
} from 'lucide-react';
import {
  SubcontractorBillItem,
  SubcontractBillStatus,
} from '@/types/subcontracting';

const INITIAL_BILLS: SubcontractorBillItem[] = [
  {
    id: 'scb-1',
    billNumber: 'SCB-2026-0031',
    vendorInvoiceRef: 'INV-PDC-9921',
    vendorId: 'ven-3',
    vendor: {
      id: 'ven-3',
      vendorCode: 'VEN-SC-003',
      companyName: 'Precision Die Castings & Alloys Corp',
      gstinTaxId: '27AAECP4410R1Z2',
    },
    jobWorkOrderId: 'jwo-3',
    jobWorkOrder: {
      id: 'jwo-3',
      orderNumber: 'JWO-2026-0040',
      processDescription: 'High Pressure Aluminium Die Casting ADC12',
      targetProductPart: 'Motor End Shield Flange MS-112',
    },
    billedQuantity: 800,
    processingRate: 42.0,
    subtotalAmount: 33600,
    taxAmount: 6048,
    totalAmount: 39648,
    status: 'APPROVED',
    approvedBy: 'Rajiv Sharma (Finance Controller)',
    approvedAt: '2026-10-06 15:20',
    syncedToFinance: true,
    paymentDueDate: '2026-11-05',
    createdAt: '2026-10-06',
  },
  {
    id: 'scb-2',
    billNumber: 'SCB-2026-0032',
    vendorInvoiceRef: 'INV-APX-4412',
    vendorId: 'ven-1',
    vendor: {
      id: 'ven-1',
      vendorCode: 'VEN-SC-001',
      companyName: 'Apex Electroplating & Surface Coatings Ltd',
      gstinTaxId: '27AABCA1234F1Z8',
    },
    jobWorkOrderId: 'jwo-1',
    jobWorkOrder: {
      id: 'jwo-1',
      orderNumber: 'JWO-2026-0042',
      processDescription: 'Hard Chrome Electroplating 25 Micron on Piston Rods',
      targetProductPart: 'Hydraulic Piston Rod PR-90',
    },
    billedQuantity: 320,
    processingRate: 18.5,
    subtotalAmount: 5920,
    taxAmount: 1065.6,
    totalAmount: 6985.6,
    status: 'PENDING_APPROVAL',
    syncedToFinance: false,
    paymentDueDate: '2026-11-07',
    createdAt: '2026-10-07',
  },
  {
    id: 'scb-3',
    billNumber: 'SCB-2026-0028',
    vendorInvoiceRef: 'INV-BHT-1082',
    vendorId: 'ven-2',
    vendor: {
      id: 'ven-2',
      vendorCode: 'VEN-SC-002',
      companyName: 'Bharat Thermal & Vacuum Heat Treaters',
      gstinTaxId: '27AAECB9981K1Z5',
    },
    jobWorkOrderId: 'jwo-prev',
    jobWorkOrder: {
      id: 'jwo-prev',
      orderNumber: 'JWO-2026-0035',
      processDescription: 'Vacuum Gas Quenching 60 HRC',
      targetProductPart: 'Shaft Spline SS-88',
    },
    billedQuantity: 300,
    processingRate: 32.0,
    subtotalAmount: 9600,
    taxAmount: 1728,
    totalAmount: 11328,
    status: 'PAID',
    approvedBy: 'Rajiv Sharma (Finance Controller)',
    approvedAt: '2026-09-30 11:00',
    syncedToFinance: true,
    paymentDueDate: '2026-10-30',
    createdAt: '2026-09-29',
  },
];

export default function SubcontractorBillingPage() {
  const [bills, setBills] = useState<SubcontractorBillItem[]>(INITIAL_BILLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [glSyncFilter, setGlSyncFilter] = useState<string>('ALL');

  // Modals
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<SubcontractorBillItem | null>(null);

  // New Bill Form
  const [newBillNumber, setNewBillNumber] = useState('');
  const [newVendorInvoice, setNewVendorInvoice] = useState('');
  const [newVendorName, setNewVendorName] = useState('Apex Electroplating & Surface Coatings Ltd');
  const [newGstin, setNewGstin] = useState('27AABCA1234F1Z8');
  const [newJwoRef, setNewJwoRef] = useState('JWO-2026-0042');
  const [newProcessDesc, setNewProcessDesc] = useState('Hard Chrome Electroplating 25 Micron');
  const [newTargetPart, setNewTargetPart] = useState('Hydraulic Piston Rod PR-90');
  const [newBilledQty, setNewBilledQty] = useState('180');
  const [newRate, setNewRate] = useState('18.5');
  const [newTaxRate, setNewTaxRate] = useState('18');
  const [newDueDate, setNewDueDate] = useState('2026-11-15');

  // Filtering
  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vendorInvoiceRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vendor?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.jobWorkOrder?.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.vendor?.gstinTaxId && b.vendor.gstinTaxId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesGl =
      glSyncFilter === 'ALL' ||
      (glSyncFilter === 'SYNCED' && b.syncedToFinance) ||
      (glSyncFilter === 'PENDING_SYNC' && !b.syncedToFinance);

    return matchesSearch && matchesStatus && matchesGl;
  });

  // KPI calculations
  const totalBilledValue = bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const pendingApprovalAmount = bills
    .filter((b) => b.status === 'PENDING_APPROVAL')
    .reduce((acc, b) => acc + b.totalAmount, 0);
  const approvedPayableAmount = bills
    .filter((b) => b.status === 'APPROVED')
    .reduce((acc, b) => acc + b.totalAmount, 0);
  const glSyncedAmount = bills
    .filter((b) => b.syncedToFinance)
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const handleOpenProcessModal = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setNewBillNumber(`SCB-2026-${randomSuffix}`);
    setNewVendorInvoice(`INV-EXT-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsProcessModalOpen(true);
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(newBilledQty) || 1;
    const rate = parseFloat(newRate) || 0;
    const taxPct = parseFloat(newTaxRate) || 18;
    const subtotal = qty * rate;
    const taxAmt = (subtotal * taxPct) / 100;
    const total = subtotal + taxAmt;

    const newBillItem: SubcontractorBillItem = {
      id: `scb-${Date.now()}`,
      billNumber: newBillNumber || `SCB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorInvoiceRef: newVendorInvoice,
      vendorId: 'ven-new',
      vendor: {
        id: 'ven-new',
        vendorCode: 'VEN-SC-001',
        companyName: newVendorName,
        gstinTaxId: newGstin,
      },
      jobWorkOrderId: 'jwo-new',
      jobWorkOrder: {
        id: 'jwo-new',
        orderNumber: newJwoRef,
        processDescription: newProcessDesc,
        targetProductPart: newTargetPart,
      },
      billedQuantity: qty,
      processingRate: rate,
      subtotalAmount: subtotal,
      taxAmount: taxAmt,
      totalAmount: total,
      status: 'PENDING_APPROVAL',
      syncedToFinance: false,
      paymentDueDate: newDueDate,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBills([newBillItem, ...bills]);
    setIsProcessModalOpen(false);
  };

  const handleApproveBill = (billId: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              status: 'APPROVED',
              approvedBy: 'Rajiv Sharma (Finance Controller)',
              approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : b
      )
    );
  };

  const handleDisputeBill = (billId: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              status: 'DISPUTED',
            }
          : b
      )
    );
  };

  const handleSyncToGl = (billId: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              syncedToFinance: true,
            }
          : b
      )
    );
  };

  const getStatusBadge = (status: SubcontractBillStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">DRAFT</span>;
      case 'PENDING_APPROVAL':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">PENDING APPROVAL</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">APPROVED</span>;
      case 'PAID':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">PAID</span>;
      case 'DISPUTED':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">DISPUTED</span>;
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/subcontracting"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Subcontracting Operations Hub
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Receipt className="h-6 w-6 text-teal-400" />
              Subcontracting Processing Charges &amp; Vendor Billing
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Verify processing charge invoices, audit against QC accepted quantities, approve disbursements, and sync to General Ledger (GL).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenProcessModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-lg shadow-teal-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Process Vendor Bill
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Subcontract Billing</span>
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Receipt className="h-4 w-4 text-teal-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              ${totalBilledValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-teal-400">Total job work processing fees</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-amber-500/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Pending Finance Approval</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              ${pendingApprovalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-300">Awaiting 3-way matching validation</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Approved Payable</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              ${approvedPayableAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400">Authorized for disbursement</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Synced to GL Ledger</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Landmark className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              ${glSyncedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-300">Posted into ERP General Ledger</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a]/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Bill #, Vendor Invoice, Vendor, GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="PAID">Paid</option>
              <option value="DISPUTED">Disputed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">GL Posting:</span>
            <select
              value={glSyncFilter}
              onChange={(e) => setGlSyncFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All GL States</option>
              <option value="SYNCED">Synced to Finance GL</option>
              <option value="PENDING_SYNC">Pending Sync</option>
            </select>
          </div>
        </div>
      </div>

      {/* Billing Ledger Table */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-white">Subcontractor Bills &amp; Chargeback Ledger</h2>
            <span className="text-xs text-slate-400">({filteredBills.length} records)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Automated 3-Way Match Verification (JWO + Challan + QC Receipt)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-medium border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ERP Bill # &amp; Inv Ref</th>
                <th className="py-3 px-4">Subcontractor Vendor</th>
                <th className="py-3 px-4">JWO Ref &amp; Process</th>
                <th className="py-3 px-4">Billed Qty &amp; Rate</th>
                <th className="py-3 px-4">Total Amount (Inc GST)</th>
                <th className="py-3 px-4">Payment Due Date</th>
                <th className="py-3 px-4">Approval &amp; GL Sync</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-normal">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white font-mono">
                      {bill.billNumber}
                    </div>
                    <div className="text-[11px] text-teal-400 font-mono mt-0.5">
                      Inv: {bill.vendorInvoiceRef}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Recorded: {bill.createdAt}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">
                      {bill.vendor?.companyName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      GSTIN: {bill.vendor?.gstinTaxId || 'N/A'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-teal-400 border border-slate-700 text-[11px]">
                      {bill.jobWorkOrder?.orderNumber}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1 truncate max-w-[160px]">
                      {bill.jobWorkOrder?.targetProductPart}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-white font-medium">
                      {bill.billedQuantity} Units
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      @ ${bill.processingRate.toFixed(2)}/unit
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-white text-sm text-emerald-400">
                      ${bill.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Sub: ${bill.subtotalAmount.toLocaleString()} | Tax: ${bill.taxAmount.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-slate-200">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{bill.paymentDueDate || 'Net 30'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {getStatusBadge(bill.status)}
                      <div>
                        {bill.syncedToFinance ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            GL SYNCED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 inline-flex items-center gap-1">
                            PENDING GL
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {bill.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => handleApproveBill(bill.id)}
                            title="Approve Processing Bill"
                            className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <Check className="h-3 w-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDisputeBill(bill.id)}
                            title="Dispute Discrepancy"
                            className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Dispute
                          </button>
                        </>
                      )}

                      {bill.status === 'APPROVED' && !bill.syncedToFinance && (
                        <button
                          onClick={() => handleSyncToGl(bill.id)}
                          title="Post to General Ledger"
                          className="px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <Landmark className="h-3 w-3" />
                          Sync GL
                        </button>
                      )}

                      {bill.syncedToFinance && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          GL Posted
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                    No subcontractor bills found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Process Vendor Bill */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-teal-400" />
                <h3 className="text-base font-semibold text-white">Record Subcontractor Processing Bill</h3>
              </div>
              <button
                onClick={() => setIsProcessModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    ERP Bill Number <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newBillNumber}
                    onChange={(e) => setNewBillNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Vendor Tax Invoice Number <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorInvoice}
                    onChange={(e) => setNewVendorInvoice(e.target.value)}
                    placeholder="e.g. INV-APX-9014"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Subcontractor Vendor <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Vendor GSTIN / Tax ID
                  </label>
                  <input
                    type="text"
                    value={newGstin}
                    onChange={(e) => setNewGstin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Job Work Order Ref <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newJwoRef}
                    onChange={(e) => setNewJwoRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Target Finished Product Part
                  </label>
                  <input
                    type="text"
                    value={newTargetPart}
                    onChange={(e) => setNewTargetPart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rate & Tax Computation */}
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  Processing Rate &amp; Statutory GST Computation
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Billed Quantity (Units)
                    </label>
                    <input
                      type="number"
                      required
                      value={newBilledQty}
                      onChange={(e) => setNewBilledQty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Processing Rate ($/Unit)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      GST / Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={newTaxRate}
                      onChange={(e) => setNewTaxRate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {(() => {
                  const qty = parseFloat(newBilledQty) || 0;
                  const rate = parseFloat(newRate) || 0;
                  const taxPct = parseFloat(newTaxRate) || 0;
                  const subtotal = qty * rate;
                  const taxVal = (subtotal * taxPct) / 100;
                  const grandTotal = subtotal + taxVal;

                  return (
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Subtotal (Net Processing Fee):</span>
                        <span className="font-mono text-white font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">GST / Tax Amount ({taxPct}%):</span>
                        <span className="font-mono text-slate-300">${taxVal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-semibold">
                        <span className="text-teal-400">Total Payable Amount:</span>
                        <span className="font-mono text-emerald-400 text-base">${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProcessModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit for Finance Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

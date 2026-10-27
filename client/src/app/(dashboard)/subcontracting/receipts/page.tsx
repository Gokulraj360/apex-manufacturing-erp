'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PackageCheck,
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
  Layers,
  ShieldCheck,
  Send,
  ExternalLink,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Scale,
} from 'lucide-react';
import {
  SubcontractorReceiptItem,
  SubcontractQualityStatus,
  SubcontractChallanStatus,
} from '@/types/subcontracting';

const INITIAL_RECEIPTS: SubcontractorReceiptItem[] = [
  {
    id: 'rcp-1',
    receiptNumber: 'SR-2026-0081',
    jobWorkOrderId: 'jwo-1',
    jobWorkOrder: {
      orderNumber: 'JWO-2026-0042',
      processDescription: 'Hard Chrome Electroplating 25 Micron on Piston Rods',
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
    inspectionRemarks: 'Micron coating thickness tests in progress on batch 1.',
    reconciliationVariance: 28,
    isReconciliationBalanced: false, // 350 sent vs 322 accounted, remainder 28 pending in subsequent tranche
  },
  {
    id: 'rcp-2',
    receiptNumber: 'SR-2026-0079',
    jobWorkOrderId: 'jwo-3',
    jobWorkOrder: {
      orderNumber: 'JWO-2026-0040',
      processDescription: 'High Pressure Aluminium Die Casting ADC12',
      targetProductPart: 'Motor End Shield Flange MS-112',
      targetQuantity: 800,
      receivedQuantity: 800,
      scrapAllowancePercent: 2.5,
    },
    challanId: 'ch-3',
    challan: {
      id: 'ch-3',
      challanNumber: 'DC-SC-2026-0088',
      totalQuantitySent: 800,
      status: 'FULLY_RETURNED',
    },
    vendorId: 'ven-3',
    vendor: {
      id: 'ven-3',
      vendorCode: 'VEN-SC-003',
      companyName: 'Precision Die Castings & Alloys Corp',
    },
    receiptDate: '2026-10-05 11:15',
    receivedQuantity: 800,
    acceptedQuantity: 788,
    rejectedQuantity: 12,
    scrapReported: 18,
    qualityStatus: 'QC_PASSED',
    inspectorName: 'Anil Deshmukh (Metrology)',
    inspectionRemarks: 'Porosity and hardness testing verified within ASTM B85 specs.',
    reconciliationVariance: 0,
    isReconciliationBalanced: true,
    billId: 'scb-1',
  },
  {
    id: 'rcp-3',
    receiptNumber: 'SR-2026-0075',
    jobWorkOrderId: 'jwo-old',
    jobWorkOrder: {
      orderNumber: 'JWO-2026-0038',
      processDescription: 'Black Anodizing Type II 15 Micron',
      targetProductPart: 'Control Panel Mounting Bracket MB-20',
      targetQuantity: 400,
      receivedQuantity: 400,
      scrapAllowancePercent: 1.0,
    },
    challanId: 'ch-old',
    challan: {
      id: 'ch-old',
      challanNumber: 'DC-SC-2026-0078',
      totalQuantitySent: 400,
      status: 'FULLY_RETURNED',
    },
    vendorId: 'ven-1',
    vendor: {
      id: 'ven-1',
      vendorCode: 'VEN-SC-001',
      companyName: 'Apex Electroplating & Surface Coatings Ltd',
    },
    receiptDate: '2026-10-02 16:45',
    receivedQuantity: 400,
    acceptedQuantity: 398,
    rejectedQuantity: 2,
    scrapReported: 3,
    qualityStatus: 'QC_PASSED',
    inspectorName: 'Suresh Patil (QA Lead)',
    inspectionRemarks: 'Surface finish uniform, corrosion resistance salt spray test 96h passed.',
    reconciliationVariance: 0,
    isReconciliationBalanced: true,
    billId: 'scb-old',
  },
];

export default function SubcontractorReceiptsPage() {
  const [receipts, setReceipts] = useState<SubcontractorReceiptItem[]>(INITIAL_RECEIPTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [qualityFilter, setQualityFilter] = useState<string>('ALL');
  const [balanceFilter, setBalanceFilter] = useState<string>('ALL');

  // Modals
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<SubcontractorReceiptItem | null>(null);

  // New Inbound Receive Form
  const [newReceiptNumber, setNewReceiptNumber] = useState('');
  const [newJwoRef, setNewJwoRef] = useState('JWO-2026-0043');
  const [newChallanRef, setNewChallanRef] = useState('DC-SC-2026-0092');
  const [newVendorName, setNewVendorName] = useState('Bharat Thermal & Vacuum Heat Treaters');
  const [newTargetPart, setNewTargetPart] = useState('Helical Drive Pinion Gear PG-44');
  const [newReceivedQty, setNewReceivedQty] = useState('250');
  const [newCarrierNotes, setNewCarrierNotes] = useState('SafeXpress delivery with test certificate attached.');

  // QC Inspection Form State
  const [inspectAcceptedQty, setInspectAcceptedQty] = useState('0');
  const [inspectRejectedQty, setInspectRejectedQty] = useState('0');
  const [inspectScrapReported, setInspectScrapReported] = useState('0');
  const [inspectStatus, setInspectStatus] = useState<SubcontractQualityStatus>('QC_PASSED');
  const [inspectorName, setInspectorName] = useState('Suresh Patil (QA Lead)');
  const [inspectRemarks, setInspectRemarks] = useState('');

  // Filtering
  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vendor?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.jobWorkOrder?.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.challan?.challanNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesQuality = qualityFilter === 'ALL' || r.qualityStatus === qualityFilter;
    const matchesBalance =
      balanceFilter === 'ALL' ||
      (balanceFilter === 'BALANCED' && r.isReconciliationBalanced) ||
      (balanceFilter === 'DISCREPANCY' && !r.isReconciliationBalanced);

    return matchesSearch && matchesQuality && matchesBalance;
  });

  // KPI Calculations
  const totalReceipts = receipts.length;
  const pendingQC = receipts.filter((r) => r.qualityStatus === 'PENDING_INSPECTION').length;
  const balancedCount = receipts.filter((r) => r.isReconciliationBalanced).length;
  const totalRejectedQty = receipts.reduce((acc, r) => acc + r.rejectedQuantity, 0);

  const handleOpenReceiveModal = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setNewReceiptNumber(`SR-2026-${randomSuffix}`);
    setIsReceiveModalOpen(true);
  };

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(newReceivedQty) || 0;

    const newReceiptItem: SubcontractorReceiptItem = {
      id: `rcp-${Date.now()}`,
      receiptNumber: newReceiptNumber || `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      jobWorkOrderId: 'jwo-new',
      jobWorkOrder: {
        orderNumber: newJwoRef,
        processDescription: 'Vacuum Gas Quenching & Case Hardening',
        targetProductPart: newTargetPart,
        targetQuantity: qty,
        receivedQuantity: qty,
        scrapAllowancePercent: 1.5,
      },
      challanId: 'ch-new',
      challan: {
        id: 'ch-new',
        challanNumber: newChallanRef,
        totalQuantitySent: qty,
        status: 'FULLY_RETURNED',
      },
      vendorId: 'ven-new',
      vendor: {
        id: 'ven-new',
        vendorCode: 'VEN-SC-002',
        companyName: newVendorName,
      },
      receiptDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      receivedQuantity: qty,
      acceptedQuantity: 0,
      rejectedQuantity: 0,
      scrapReported: 0,
      qualityStatus: 'PENDING_INSPECTION',
      inspectorName: 'Unassigned',
      inspectionRemarks: newCarrierNotes,
      reconciliationVariance: 0,
      isReconciliationBalanced: false,
    };

    setReceipts([newReceiptItem, ...receipts]);
    setIsReceiveModalOpen(false);
  };

  const handleOpenInspectionModal = (receipt: SubcontractorReceiptItem) => {
    setSelectedReceipt(receipt);
    setInspectAcceptedQty(receipt.acceptedQuantity > 0 ? receipt.acceptedQuantity.toString() : receipt.receivedQuantity.toString());
    setInspectRejectedQty(receipt.rejectedQuantity.toString());
    setInspectScrapReported(receipt.scrapReported.toString());
    setInspectStatus(receipt.qualityStatus === 'PENDING_INSPECTION' ? 'QC_PASSED' : receipt.qualityStatus);
    setInspectorName(receipt.inspectorName || 'Suresh Patil (QA Lead)');
    setInspectRemarks(receipt.inspectionRemarks || '');
    setIsInspectionModalOpen(true);
  };

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceipt) return;

    const accepted = parseFloat(inspectAcceptedQty) || 0;
    const rejected = parseFloat(inspectRejectedQty) || 0;
    const scrap = parseFloat(inspectScrapReported) || 0;
    const sent = selectedReceipt.challan?.totalQuantitySent || selectedReceipt.receivedQuantity;
    const scrapAllowancePercent = selectedReceipt.jobWorkOrder?.scrapAllowancePercent || 2.0;

    // Reconciliation Calculation
    const totalAccounted = accepted + rejected + scrap;
    const variance = sent - totalAccounted;
    const maxAllowedScrap = Math.ceil((sent * scrapAllowancePercent) / 100);
    const isBalanced = Math.abs(variance) <= maxAllowedScrap;

    setReceipts((prev) =>
      prev.map((r) =>
        r.id === selectedReceipt.id
          ? {
              ...r,
              acceptedQuantity: accepted,
              rejectedQuantity: rejected,
              scrapReported: scrap,
              qualityStatus: inspectStatus,
              inspectorName,
              inspectionRemarks: inspectRemarks,
              reconciliationVariance: variance,
              isReconciliationBalanced: isBalanced,
            }
          : r
      )
    );

    setIsInspectionModalOpen(false);
  };

  const getQualityBadge = (status: SubcontractQualityStatus) => {
    switch (status) {
      case 'PENDING_INSPECTION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center gap-1 w-fit">
            <Clock className="h-3 w-3" />
            PENDING QC
          </span>
        );
      case 'QC_PASSED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1 w-fit">
            <CheckCircle className="h-3 w-3" />
            QC PASSED
          </span>
        );
      case 'QC_REJECTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 flex items-center gap-1 w-fit">
            <XCircle className="h-3 w-3" />
            QC REJECTED
          </span>
        );
      case 'CONDITIONALLY_ACCEPTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center gap-1 w-fit">
            <AlertCircle className="h-3 w-3" />
            CONDITIONAL
          </span>
        );
      default:
        return <span className="text-xs text-slate-500 dark:text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/subcontracting"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Subcontracting Operations Hub
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <PackageCheck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              Inbound Subcontract Receipts &amp; Material Reconciliation
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Verify incoming processed batches, record quality inspection results, and reconcile input-output scrap allowances.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenReceiveModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-sm shadow-teal-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Receive Inbound Batch
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Inbound Receipts</span>
            <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
              <PackageCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{totalReceipts}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">batches inwarded</span>
          </div>
          <div className="mt-2 text-[11px] text-teal-600 dark:text-teal-400">Processed parts received</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-amber-300 dark:border-amber-500/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending QA Sign-Off</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{pendingQC}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">awaiting inspection</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300">Requires coating / hardness test</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balanced Reconciliations</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <Scale className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{balancedCount} / {totalReceipts}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Scrap within statutory allowance</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Rejections</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{totalRejectedQty}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">rejected units</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400">Debited to vendor chargeback ledger</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search Receipt #, Vendor, JWO, Challan #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Quality:</span>
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All QA States</option>
              <option value="PENDING_INSPECTION">Pending Inspection</option>
              <option value="QC_PASSED">QC Passed</option>
              <option value="QC_REJECTED">QC Rejected</option>
              <option value="CONDITIONALLY_ACCEPTED">Conditionally Accepted</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Reconciliation:</span>
            <select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="BALANCED">Balanced (Within Allowance)</option>
              <option value="DISCREPANCY">Discrepancy / Variance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Inbound Goods Receipts &amp; Inspection Audit</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">({filteredReceipts.length} records)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Real-time Input/Output mass balance verification
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Receipt # &amp; Date</th>
                <th className="py-3 px-4">JWO &amp; Challan Ref</th>
                <th className="py-3 px-4">Subcontractor Vendor</th>
                <th className="py-3 px-4">Quantities (Recv / Acc / Rej)</th>
                <th className="py-3 px-4">Scrap Reported</th>
                <th className="py-3 px-4">QA Status &amp; Inspector</th>
                <th className="py-3 px-4">Reconciliation Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60 font-normal">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                      {receipt.receiptNumber}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{receipt.receiptDate}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-700 text-[11px]">
                        {receipt.jobWorkOrder?.orderNumber}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                      DC: {receipt.challan?.challanNumber}
                    </div>
                    <div className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 truncate max-w-[150px]">
                      {receipt.jobWorkOrder?.targetProductPart}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 dark:text-slate-200">
                      {receipt.vendor?.companyName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {receipt.vendor?.vendorCode}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 font-mono">
                      <div className="text-slate-900 dark:text-white font-medium">Recv: {receipt.receivedQuantity}</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Acc: {receipt.acceptedQuantity}</div>
                      {receipt.rejectedQuantity > 0 ? (
                        <div className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">Rej: {receipt.rejectedQuantity}</div>
                      ) : (
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">Rej: 0</div>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-amber-600 dark:text-amber-400 font-medium">
                      {receipt.scrapReported} Units
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Allowance: {receipt.jobWorkOrder?.scrapAllowancePercent || 2.0}%
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {getQualityBadge(receipt.qualityStatus)}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {receipt.inspectorName || 'Pending Assignment'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {receipt.isReconciliationBalanced ? (
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" />
                          BALANCED
                        </span>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                          Variance: 0 pcs
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center gap-1 w-fit">
                          <AlertTriangle className="h-3 w-3" />
                          VARIANCE ({receipt.reconciliationVariance})
                        </span>
                        <div className="text-[10px] text-amber-600 dark:text-amber-400/90 mt-1">
                          Partial / Open Tranche
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenInspectionModal(receipt)}
                      className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-600/20 dark:hover:bg-teal-600/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 text-xs font-medium flex items-center gap-1 transition-colors ml-auto shadow-xs"
                    >
                      <ClipboardCheck className="h-3 w-3" />
                      QC Sign-Off
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReceipts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                    No subcontract receipts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Receive Inbound Batch */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Receive Inbound Processed Batch</h3>
              </div>
              <button
                onClick={() => setIsReceiveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReceipt} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Receipt Number <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newReceiptNumber}
                    onChange={(e) => setNewReceiptNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Job Work Order (JWO) Ref <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newJwoRef}
                    onChange={(e) => setNewJwoRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Originating Delivery Challan (DC) <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newChallanRef}
                    onChange={(e) => setNewChallanRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Subcontractor Vendor
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Part Description
                  </label>
                  <input
                    type="text"
                    value={newTargetPart}
                    onChange={(e) => setNewTargetPart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Quantity Inwarded (Units) <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={newReceivedQty}
                    onChange={(e) => setNewReceivedQty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Inward Carrier Remarks &amp; Accompanying Docs
                </label>
                <textarea
                  rows={2}
                  value={newCarrierNotes}
                  onChange={(e) => setNewCarrierNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-500/20 rounded-lg text-xs text-teal-800 dark:text-teal-300">
                <span className="font-semibold block mb-0.5">Gate Inward Notice:</span>
                Items will immediately transition to <strong>Pending QC Inspection</strong> and will be quarantined until quality release.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm shadow-teal-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Register Inward Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QC Inspection & Material Reconciliation Sign-Off */}
      {isInspectionModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  QC Inspection &amp; Material Reconciliation Sign-Off
                </h3>
              </div>
              <button
                onClick={() => setIsInspectionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInspection} className="p-6 space-y-4 overflow-y-auto">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">RECEIPT #</span>
                  {selectedReceipt.receiptNumber}
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">JWO #</span>
                  {selectedReceipt.jobWorkOrder?.orderNumber}
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SENT IN DC</span>
                  {selectedReceipt.challan?.totalQuantitySent || selectedReceipt.receivedQuantity} Units
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">INWARDED</span>
                  {selectedReceipt.receivedQuantity} Units
                </div>
              </div>

              {/* Quantity Breakdown */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5" />
                  Quality Disposition Quantities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      Accepted Quantity <span className="text-emerald-600 dark:text-emerald-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={inspectAcceptedQty}
                      onChange={(e) => setInspectAcceptedQty(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-emerald-600 dark:text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      Rejected Quantity <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={inspectRejectedQty}
                      onChange={(e) => setInspectRejectedQty(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-rose-600 dark:text-rose-400 font-mono font-bold focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      Scrap / Burning Loss Reported
                    </label>
                    <input
                      type="number"
                      value={inspectScrapReported}
                      onChange={(e) => setInspectScrapReported(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-amber-600 dark:text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Real-time Reconciliation Calculator */}
                {(() => {
                  const acc = parseFloat(inspectAcceptedQty) || 0;
                  const rej = parseFloat(inspectRejectedQty) || 0;
                  const scr = parseFloat(inspectScrapReported) || 0;
                  const sent = selectedReceipt.challan?.totalQuantitySent || selectedReceipt.receivedQuantity;
                  const scrapAllowance = selectedReceipt.jobWorkOrder?.scrapAllowancePercent || 2.0;
                  const totalAccounted = acc + rej + scr;
                  const variance = sent - totalAccounted;
                  const maxAllowedScrap = Math.ceil((sent * scrapAllowance) / 100);
                  const isBalanced = Math.abs(variance) <= maxAllowedScrap;

                  return (
                    <div className="p-3 bg-slate-100 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Material Accounted:</span>
                        <span className="font-mono text-slate-900 dark:text-white font-bold">{totalAccounted} / {sent} Units</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Scrap Allowance Limit ({scrapAllowance}%):</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">Max {maxAllowedScrap} Units</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-slate-600 dark:text-slate-400">Net Reconciliation Variance:</span>
                        <span className={`font-mono font-bold ${variance === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {variance > 0 ? `+${variance} Unreturned` : `${variance} Units`}
                        </span>
                      </div>
                      <div className="mt-2 pt-1">
                        {isBalanced ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            Material Reconciliation Balanced within statutory threshold.
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                            <AlertTriangle className="h-4 w-4" />
                            Material Discrepancy: Variance exceeds standard scrap allowance. Requires vendor debit adjustment or subsequent tranche return.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Quality Verdict <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <select
                    value={inspectStatus}
                    onChange={(e) => setInspectStatus(e.target.value as SubcontractQualityStatus)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="QC_PASSED">QC PASSED (Release to Production/Stores)</option>
                    <option value="CONDITIONALLY_ACCEPTED">CONDITIONALLY ACCEPTED (Concession)</option>
                    <option value="QC_REJECTED">QC REJECTED (Return / Chargeback)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Inspector Name <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Inspection Remarks / Laboratory Test Certificate
                </label>
                <textarea
                  rows={2}
                  value={inspectRemarks}
                  onChange={(e) => setInspectRemarks(e.target.value)}
                  placeholder="e.g. Surface hardness verified 60 HRC, micron plating thickness test passed..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInspectionModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm shadow-teal-600/20 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Sign-Off &amp; Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

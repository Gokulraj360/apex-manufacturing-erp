'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Search,
  Plus,
  Scale,
  Building2,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  ClipboardCheck,
  PackageCheck,
  Sparkles,
  ArrowDownLeft,
  Receipt,
  BadgeAlert,
  Printer,
  Truck,
  Flame,
  Check,
  Radio,
  Boxes,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type InspectionDisposition =
  | 'ACCEPTED'
  | 'PARTIALLY_ACCEPTED'
  | 'REJECTED'
  | 'QUARANTINED';

export type RejectionReason =
  | 'DIMENSIONAL_OUT_OF_TOLERANCE'
  | 'SURFACE_DEFECT'
  | 'WRONG_GRADE_CHEMISTRY'
  | 'CRACK_BURR'
  | 'CONTAMINATION'
  | 'DOCUMENTATION_MISSING'
  | 'TRANSIT_DAMAGE'
  | 'THERMAL_STRESS_FAILURE'
  | 'DEAD_PIXEL_DEFECT'
  | 'OTHER';

export interface SpecCheckItem {
  id: string;
  parameter: string;
  specTolerance: string;
  measuredValue: string;
  status: 'PASS' | 'FAIL';
  isMandatory?: boolean;
}

export interface InboundLotQueueItem {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  vendorGstin: string;
  itemCode: string;
  itemName: string;
  deliveredQty: number;
  sampleSize: number; // AQL Level II sample size
  uom: string;
  unitRate: number;
  gatePassNumber: string;
  batchNumber: string;
  heatNumber: string;
  mandatoryParameters: string[];
  specs: SpecCheckItem[];
}

export interface MIRRecord {
  id: string;
  mirNumber: string;
  poNumber: string;
  vendorName: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  heatNumber?: string;
  inspectedQty: number;
  passedQty: number;
  rejectedQty: number;
  uom: string;
  unitRate: number;
  disposition: InspectionDisposition;
  rejectionReason?: RejectionReason;
  defectDetails?: string;
  grnNumber?: string;
  rtvChallanNumber?: string;
  debitNoteNumber?: string;
  debitNoteAmount?: number;
  quarantineLocation?: string;
  inspectorName: string;
  inspectedAt: string;
  specs: SpecCheckItem[];
}

// ============================================================================
// Incoming Vendor Lots Queue (with AQL Sample Size & Mandatory Tests)
// ============================================================================

const initialInboundLots: InboundLotQueueItem[] = [];

const initialMIRRecords: MIRRecord[] = [];

export default function InwardQCInspectionPage() {
  const [inboundQueue, setInboundQueue] = useState<InboundLotQueueItem[]>(initialInboundLots);
  const [selectedLotId, setSelectedLotId] = useState<string>('');
  const [mirReports, setMIRReports] = useState<MIRRecord[]>(initialMIRRecords);
  const [selectedMIRForView, setSelectedMIRForView] = useState<MIRRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDisposition, setFilterDisposition] = useState<'ALL' | 'ACCEPTED' | 'PARTIALLY_ACCEPTED' | 'REJECTED'>('ALL');

  // Currently active lot
  const activeLot = useMemo(() => {
    return inboundQueue.find((l) => l.id === selectedLotId) || inboundQueue[0] || null;
  }, [inboundQueue, selectedLotId]);

  // Form State
  const [batchNumber, setBatchNumber] = useState(activeLot?.batchNumber || '');
  const [heatNumber, setHeatNumber] = useState(activeLot?.heatNumber || '');
  const [inspectedQty, setInspectedQty] = useState<number>(activeLot?.deliveredQty || 0);
  const [passedQty, setPassedQty] = useState<number>(activeLot?.deliveredQty || 0);
  const [rejectedQty, setRejectedQty] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState<RejectionReason>('THERMAL_STRESS_FAILURE');
  const [defectDetails, setDefectDetails] = useState<string>('');
  const [inspectorName, setInspectorName] = useState<string>('QC Inspector');
  const [specs, setSpecs] = useState<SpecCheckItem[]>(activeLot?.specs || []);

  // Fetch inbound lots queue from backend
  useEffect(() => {
    async function loadLots() {
      try {
        const res = await fetch('/api/quality/inward/queue');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.queue)) {
            setInboundQueue(data.queue);
            if (data.queue.length > 0) {
              setSelectedLotId(data.queue[0].id);
            }
          }
        }
      } catch (err) {
        // Graceful fallback
      }
    }
    loadLots();
  }, []);

  // Sync form when active lot changes
  useEffect(() => {
    if (activeLot) {
      setBatchNumber(activeLot.batchNumber);
      setHeatNumber(activeLot.heatNumber);
      setInspectedQty(activeLot.deliveredQty);
      setPassedQty(activeLot.deliveredQty);
      setRejectedQty(0);
      setSpecs(activeLot.specs || []);
    } else {
      setBatchNumber('');
      setHeatNumber('');
      setInspectedQty(0);
      setPassedQty(0);
      setRejectedQty(0);
      setSpecs([]);
    }
  }, [activeLot]);

  // Rejection Confirmation Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingLotData, setRejectingLotData] = useState<{
    lot: InboundLotQueueItem;
    rejectedQty: number;
    unitRate: number;
    totalDebitAmount: number;
    generatedRtvChallan: string;
    generatedDebitNote: string;
    rejectionReason: string;
    defectDetails: string;
    quarantineLocation: string;
  } | null>(null);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Sync active lot specs when active lot changes
  const handleSelectLot = (lot: InboundLotQueueItem) => {
    setSelectedLotId(lot.id);
    setBatchNumber(lot.batchNumber);
    setHeatNumber(lot.heatNumber);
    setInspectedQty(lot.deliveredQty);
    setPassedQty(lot.deliveredQty);
    setRejectedQty(0);
    setSpecs(lot.specs);
  };

  const handlePassedQtyChange = (val: number) => {
    const passed = Math.max(0, val);
    setPassedQty(passed);
    setRejectedQty(Math.max(0, inspectedQty - passed));
  };

  const handleRejectedQtyChange = (val: number) => {
    const rej = Math.max(0, val);
    setRejectedQty(rej);
    setPassedQty(Math.max(0, inspectedQty - rej));
  };

  const handleToggleSpec = (id: string) => {
    setSpecs((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === 'PASS' ? 'FAIL' : 'PASS';
        return {
          ...s,
          status: nextStatus,
          measuredValue: nextStatus === 'FAIL' ? 'Out of specification tolerance' : 'Verified conforming to PO schedule',
        };
      })
    );
  };

  // "Issue QC Pass & Release" Handler
  const handleIssueQCPassAndRelease = async (lot: InboundLotQueueItem) => {
    const year = new Date().getFullYear();
    const grnNumber = `GRN-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const mirNumber = `MIR-${year}-${String(mirReports.length + 131).padStart(4, '0')}`;

    const newMIR: MIRRecord = {
      id: `mir-${Date.now()}`,
      mirNumber,
      poNumber: lot.poNumber,
      vendorName: lot.vendorName,
      itemCode: lot.itemCode,
      itemName: lot.itemName,
      batchNumber: lot.batchNumber,
      heatNumber: lot.heatNumber,
      inspectedQty: lot.deliveredQty,
      passedQty: lot.deliveredQty,
      rejectedQty: 0,
      uom: lot.uom,
      unitRate: lot.unitRate,
      disposition: 'ACCEPTED',
      grnNumber,
      inspectorName,
      inspectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      specs: [...lot.specs],
    };

    setMIRReports((prev) => [newMIR, ...prev]);

    // Backend sync
    try {
      await fetch('/api/quality/inward/release-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lotRef: lot.batchNumber,
          passedQty: lot.deliveredQty,
          targetWarehouseBin: 'A-01-B1',
          inspectorName,
        }),
      });
    } catch {}

    showNotification(
      `QC Pass Issued! Batch [${lot.batchNumber}] moved to Warehouse stock. Auto-generated ${grnNumber}.`,
      'success'
    );
  };

  // Open "Reject & Trigger Debit Note" Modal
  const handleOpenRejectModal = (lot: InboundLotQueueItem, customRejQty?: number) => {
    const rejQty = customRejQty !== undefined ? customRejQty : (rejectedQty > 0 ? rejectedQty : lot.deliveredQty);
    const totalDebit = Number((rejQty * lot.unitRate).toFixed(2));
    const year = new Date().getFullYear();
    const suffix = Math.floor(1000 + Math.random() * 9000);

    setRejectingLotData({
      lot,
      rejectedQty: rejQty,
      unitRate: lot.unitRate,
      totalDebitAmount: totalDebit,
      generatedRtvChallan: `RTV-${year}-${suffix}`,
      generatedDebitNote: `DN-${year}-${suffix}`,
      rejectionReason: rejectionReason || 'Thermal Stress > 75°C failure under SMT reflow profile',
      defectDetails: defectDetails || 'Parameters violated cleanroom class standards during incoming lot evaluation.',
      quarantineLocation: 'Zone Q - Quarantine Bay Q-01',
    });

    setIsRejectModalOpen(true);
  };

  // Confirm Rejection & Commit Debit Note
  const handleConfirmRejectionAndDebitNote = async () => {
    if (!rejectingLotData) return;

    const {
      lot,
      rejectedQty,
      totalDebitAmount,
      generatedRtvChallan,
      generatedDebitNote,
      rejectionReason: reason,
      defectDetails: details,
      quarantineLocation: qLoc,
    } = rejectingLotData;

    const year = new Date().getFullYear();
    const mirNumber = `MIR-${year}-${String(mirReports.length + 132).padStart(4, '0')}`;
    const grnNumber = passedQty > 0 ? `GRN-${year}-${Math.floor(1000 + Math.random() * 9000)}` : undefined;

    const newMIR: MIRRecord = {
      id: `mir-${Date.now()}`,
      mirNumber,
      poNumber: lot.poNumber,
      vendorName: lot.vendorName,
      itemCode: lot.itemCode,
      itemName: lot.itemName,
      batchNumber: lot.batchNumber,
      heatNumber: lot.heatNumber,
      inspectedQty: lot.deliveredQty,
      passedQty: lot.deliveredQty - rejectedQty,
      rejectedQty,
      uom: lot.uom,
      unitRate: lot.unitRate,
      disposition: rejectedQty === lot.deliveredQty ? 'REJECTED' : 'PARTIALLY_ACCEPTED',
      rejectionReason: reason as RejectionReason,
      defectDetails: details,
      grnNumber,
      rtvChallanNumber: generatedRtvChallan,
      debitNoteNumber: generatedDebitNote,
      debitNoteAmount: totalDebitAmount,
      quarantineLocation: qLoc,
      inspectorName,
      inspectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      specs: [...specs],
    };

    setMIRReports((prev) => [newMIR, ...prev]);

    // Backend sync to AP ledger and Debit Note module
    try {
      await fetch('/api/finance/debit-notes/reject-lot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lotRef: lot.batchNumber,
          vendorId: lot.vendorId,
          vendorName: lot.vendorName,
          itemName: lot.itemName,
          rejectedQty,
          unitRate: lot.unitRate,
          rejectionReason: reason,
          defectDetails: details,
          quarantineLocation: qLoc,
          inspectorName,
        }),
      });
    } catch {}

    setIsRejectModalOpen(false);
    showNotification(
      `Lot [${lot.batchNumber}] rejected & quarantined in ${qLoc}. Generated RTV Challan [${generatedRtvChallan}] & Debit Note [${generatedDebitNote}] for ₹${totalDebitAmount.toLocaleString('en-IN')}. Deducted from AP Ledger.`,
      'warning'
    );
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-white shadow-xl border animate-in fade-in slide-in-from-bottom-5',
            notification.type === 'warning'
              ? 'bg-rose-900 border-rose-700'
              : 'bg-slate-900 dark:bg-white dark:text-slate-950 border-slate-800'
          )}
        >
          {notification.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Inward IQC Inspection & RTV Debit Note Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Cleanroom Quality Control
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Physical, metallurgical, and cleanroom test parameter inspection of arriving supplier lots. Certified acceptance auto-triggers GRN; rejections auto-generate Return-To-Vendor (RTV) challans and deduct Debit Notes from AP ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/finance/debit-notes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition shadow-sm"
          >
            <Receipt className="w-4 h-4" />
            AP Debit Notes Ledger &rarr;
          </Link>
          <Link
            href="/inventory/warehouse"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            <Layers className="w-4 h-4" />
            Warehouse Putaway
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUEUE OF INCOMING VENDOR LOTS (WITH SAMPLE SIZES & MANDATORY TESTS) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Incoming Vendor Lots Inspection Queue
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            AQL Level II Sample Sizing &bull; ISO-9001 Mandatory Gate Checks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {inboundQueue.length === 0 ? (
            <div className="col-span-full p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-center">
              <PackageCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No incoming vendor lots pending inspection
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Arriving purchase order lots cleared through the gate weighbridge OCR terminal will queue here for AQL sampling.
              </p>
            </div>
          ) : (
            inboundQueue.map((lot) => {
            const isSelected = selectedLotId === lot.id;
            return (
              <div
                key={lot.id}
                onClick={() => handleSelectLot(lot)}
                className={cn(
                  'p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 shadow-xs',
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 ring-2 ring-blue-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {lot.poNumber}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      Sample: {lot.sampleSize} {lot.uom}
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                      {lot.itemName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lot.vendorName}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Lot: <strong>{lot.batchNumber}</strong></span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {lot.deliveredQty.toLocaleString('en-IN')} {lot.uom}
                    </span>
                  </div>

                  {/* Mandatory Test Parameters Pills */}
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Mandatory Gate Checks:
                    </span>
                    <div className="space-y-0.5">
                      {lot.mandatoryParameters.slice(0, 2).map((p, idx) => (
                        <div key={idx} className="text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 truncate">
                          <Flame className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          <span className="truncate">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons on Card */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIssueQCPassAndRelease(lot);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                    QC Pass
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenRejectModal(lot);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-[11px] transition flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3 h-3" />
                    Reject/RTV
                  </button>
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DETAILED MATERIAL INSPECTION REPORT (MIR) SHEET */}
      {/* ========================================================================= */}
      {activeLot ? (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Material Inspection Report (MIR) Sheet: {activeLot.itemName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PO #{activeLot.poNumber} &bull; Delivered: {activeLot.deliveredQty} {activeLot.uom} &bull; Required Sample: {activeLot.sampleSize} {activeLot.uom} (AQL II)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Inspector:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {inspectorName}
            </span>
          </div>
        </div>

        {/* Quantities & Parameters Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Delivered Lot Volume ({activeLot.uom})
            </label>
            <input
              type="number"
              disabled
              value={activeLot.deliveredQty}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Passed Quantity ({activeLot.uom})
            </label>
            <input
              type="number"
              min={0}
              max={inspectedQty}
              value={passedQty}
              onChange={(e) => handlePassedQtyChange(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Rejected Quantity ({activeLot.uom})
            </label>
            <input
              type="number"
              min={0}
              max={inspectedQty}
              value={rejectedQty}
              onChange={(e) => handleRejectedQtyChange(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono font-bold text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Calculated Rejection Debit Value
            </label>
            <div className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-rose-50/40 dark:bg-rose-950/20 font-mono font-extrabold text-rose-600 dark:text-rose-400">
              {formatINR(rejectedQty * activeLot.unitRate)}
            </div>
          </div>
        </div>

        {/* Mandatory Specifications Matrix */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Mandatory Engineering & Cleanroom Parameters (AQL Test Schedule)
            </span>
            <span className="text-[11px] text-slate-400">Click row to toggle pass/fail</span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Inspection Parameter</th>
                  <th className="py-2.5 px-4">PO Specification / Tolerance</th>
                  <th className="py-2.5 px-4">Actual Measured Reading</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {specs.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => handleToggleSpec(s.id)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      {s.parameter}
                      {s.isMandatory && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Mandatory
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {s.specTolerance}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {s.measuredValue}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full font-bold text-[10px]',
                          s.status === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        )}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Primary Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleOpenRejectModal(activeLot, rejectedQty > 0 ? rejectedQty : activeLot.deliveredQty)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject & Trigger Debit Note
          </button>

          <button
            type="button"
            onClick={() => handleIssueQCPassAndRelease(activeLot)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Issue QC Pass & Release ({passedQty.toLocaleString('en-IN')} {activeLot.uom})
          </button>
        </div>
      </div>
      ) : (
        <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-center">
          <FileCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No Active Inbound Lot Selected
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Select an arriving vendor lot from the queue above to open the cleanroom AQL parameter inspection sheet.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HISTORICAL MIR RECORDS TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
              Filed Material Inspection Reports (MIR) & Debit Notes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical ledger of inspected vendor batches, GRN links, and issued RTV Challans.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Total MIR Records: <strong>{mirReports.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">MIR # & Date</th>
                <th className="py-3 px-4">Vendor & Item</th>
                <th className="py-3 px-4">Lot #</th>
                <th className="py-3 px-4 text-right">Passed Qty</th>
                <th className="py-3 px-4 text-right">Rejected Qty</th>
                <th className="py-3 px-4">Disposition</th>
                <th className="py-3 px-4">GRN / RTV Reference</th>
                <th className="py-3 px-4 text-right">Debit Note (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mirReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No Material Inspection Reports filed yet. Cleared or rejected inbound lots will generate inspection reports and debit note entries here.
                  </td>
                </tr>
              ) : (
                mirReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {r.mirNumber}
                      <div className="text-[10px] text-slate-400 font-normal">{r.inspectedAt}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{r.vendorName}</div>
                      <div className="text-[11px] text-slate-500">{r.itemName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {r.batchNumber}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {r.passedQty.toLocaleString('en-IN')} {r.uom}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-rose-600 dark:text-rose-400">
                      {r.rejectedQty.toLocaleString('en-IN')} {r.uom}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-extrabold',
                          r.disposition === 'ACCEPTED' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                          r.disposition === 'REJECTED' && 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
                          r.disposition === 'PARTIALLY_ACCEPTED' && 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        )}
                      >
                        {r.disposition}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {r.grnNumber && <div className="text-emerald-600 font-bold">{r.grnNumber}</div>}
                      {r.rtvChallanNumber && <div className="text-rose-600 font-bold">{r.rtvChallanNumber}</div>}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-rose-600 dark:text-rose-400">
                      {r.debitNoteAmount ? formatINR(r.debitNoteAmount) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REJECTION & DEBIT NOTE TRIGGER CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isRejectModalOpen && rejectingLotData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Lot Rejection & Trigger Debit Note
                </h3>
                <p className="text-xs text-slate-500">
                  Automatic Return-To-Vendor (RTV) Challan and Accounts Payable Deduction
                </p>
              </div>
            </div>

            {/* Calculated Values Summary */}
            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Rejected Lot:</span>
                <strong className="text-slate-900 dark:text-white font-mono">
                  {rejectingLotData.lot.batchNumber} ({rejectingLotData.lot.itemName})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Vendor:</span>
                <strong className="text-slate-900 dark:text-white">
                  {rejectingLotData.lot.vendorName}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Rejected Quantity:</span>
                <strong className="text-rose-600 dark:text-rose-400 font-bold font-mono">
                  {rejectingLotData.rejectedQty.toLocaleString('en-IN')} {rejectingLotData.lot.uom} @ {formatINR(rejectingLotData.unitRate)}/{rejectingLotData.lot.uom}
                </strong>
              </div>
              <div className="flex justify-between border-t border-rose-200 dark:border-rose-900 pt-2 text-sm">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Total Calculated Debit Note Value:
                </span>
                <strong className="font-mono font-black text-rose-600 dark:text-rose-400">
                  {formatINR(rejectingLotData.totalDebitAmount)}
                </strong>
              </div>
            </div>

            {/* Automated Artifacts Generated */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Generated RTV Challan #
                </div>
                <div className="text-sm font-mono font-black text-blue-600 dark:text-blue-400 mt-0.5">
                  {rejectingLotData.generatedRtvChallan}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">For gate dispatch outward</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Generated AP Debit Note #
                </div>
                <div className="text-sm font-mono font-black text-rose-600 dark:text-rose-400 mt-0.5">
                  {rejectingLotData.generatedDebitNote}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Deducted from open invoices</div>
              </div>
            </div>

            {/* Quarantine Destination & Reason */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Root Cause of Rejection *
                </label>
                <select
                  value={rejectingLotData.rejectionReason}
                  onChange={(e) =>
                    setRejectingLotData({ ...rejectingLotData, rejectionReason: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="Thermal Stress > 75°C under SMT reflow profile">
                    Thermal Stress &gt; 75°C under SMT reflow profile
                  </option>
                  <option value="Dead Pixel Array limit exceeded">
                    Dead Pixel Array limit exceeded (&gt; 2 pixels)
                  </option>
                  <option value="BGA Solder Coplanarity > 0.05 mm">
                    BGA Solder Coplanarity &gt; 0.05 mm
                  </option>
                  <option value="Internal AC resistance out of tolerance (> 45 mΩ)">
                    Internal AC resistance out of tolerance (&gt; 45 mΩ)
                  </option>
                  <option value="Hermetic seal chamber vacuum leak (< 98 kPa)">
                    Hermetic seal chamber vacuum leak (&lt; 98 kPa)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quarantine Isolation Bay *
                </label>
                <input
                  type="text"
                  value={rejectingLotData.quarantineLocation}
                  onChange={(e) =>
                    setRejectingLotData({ ...rejectingLotData, quarantineLocation: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectionAndDebitNote}
                className="px-5 py-2.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
              >
                Confirm Rejection & Deduct AP Debit Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

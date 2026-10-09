'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  FileCheck,
  Printer,
  Download,
  Search,
  Filter,
  ArrowRight,
  Boxes,
  Layers,
  Scale,
  Calendar,
  UserCheck,
  QrCode,
  Sparkles,
  Building2,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  PackageCheck,
  FileText,
  Warehouse,
  Flame,
  Gauge,
  Clock,
  Fingerprint,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface InspectionChecklistItem {
  id: string;
  category: string;
  parameter: string;
  specification: string;
  actualMeasured: string;
  toolingUsed: string;
  passed: boolean;
}

export interface FinishedGoodsBatch {
  id: string;
  jobCardNumber: string;
  itemCode: string;
  itemName: string;
  category: 'WIP' | 'FINISHED_GOOD';
  batchNumber: string;
  heatNumber: string;
  completedQty: number;
  uom: string;
  productionLine: string;
  completedAt: string;
  defaultBin: string;
  customerPo?: string;
}

export interface FinalQCCertificate {
  id: string;
  certificateNumber: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  heatNumber: string;
  inspectedQty: number;
  passedQty: number;
  rejectedQty: number;
  uom: string;
  status: 'PASSED' | 'REJECTED' | 'CONDITIONAL';
  targetWarehouseBin: string;
  stockUpdatedToFG: boolean;
  inspectorName: string;
  digitalSignatureHash: string;
  signedAt: string;
  notes: string;
}

// ============================================================================
// Sample Mock Data
// ============================================================================

const mockWIPBatches: FinishedGoodsBatch[] = [
  {
    id: 'batch-01',
    jobCardNumber: 'JC-2026-0881',
    itemCode: 'PLN-CRB-18MM',
    itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
    category: 'WIP',
    batchNumber: 'LOT-2026-TATA-881',
    heatNumber: 'HT-1018-992B',
    completedQty: 182,
    uom: 'PCS',
    productionLine: 'Line 3 - CNC Machining Cell',
    completedAt: '2026-10-02 11:30',
    defaultBin: 'C-01-B1',
    customerPo: 'PO-LT-2026-8812 (L&T Aerospace)',
  },
  {
    id: 'batch-02',
    jobCardNumber: 'JC-2026-0882',
    itemCode: 'BUSH-BRZ-30MM',
    itemName: 'Phosphor Bronze Sleeve Blank 30mm',
    category: 'WIP',
    batchNumber: 'LOT-2026-BRZ-9021',
    heatNumber: 'HT-BRZ-4411',
    completedQty: 410,
    uom: 'PCS',
    productionLine: 'Line 1 - Stamping & Press Line',
    completedAt: '2026-10-02 10:15',
    defaultBin: 'A-02-B2',
    customerPo: 'BF-PO-99120 (Bharat Forge)',
  },
  {
    id: 'batch-03',
    jobCardNumber: 'JC-2026-0879',
    itemCode: 'FAST-HEX-M12',
    itemName: 'Hex Flange Head Bolt M12x45 Grade 10.9',
    category: 'WIP',
    batchNumber: 'LOT-UNB-1092-A',
    heatNumber: 'HT-UNB-771',
    completedQty: 950,
    uom: 'PCS',
    productionLine: 'Line 2 - Header & Cold Forging Cell',
    completedAt: '2026-10-01 16:45',
    defaultBin: 'D-01-B1',
    customerPo: 'M&M-PO-4091 (Mahindra)',
  },
];

const initialChecklist: InspectionChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'Dimensional & CMM',
    parameter: 'Outer Diameter (OD)',
    specification: '18.000mm (+0.005 / -0.000)',
    actualMeasured: '18.003mm',
    toolingUsed: 'Mitutoyo Linear Height Gauge & CMM #CMM-02',
    passed: true,
  },
  {
    id: 'chk-2',
    category: 'Dimensional & CMM',
    parameter: 'Total Length (OAL)',
    specification: '120.00mm (+0.02 / -0.02)',
    actualMeasured: '120.01mm',
    toolingUsed: 'Digimatic Caliper #CAL-04',
    passed: true,
  },
  {
    id: 'chk-3',
    category: 'Surface Finish',
    parameter: 'Plunger Stem Roughness (Ra)',
    specification: 'Ra <= 0.20 um (Mirror Finish)',
    actualMeasured: 'Ra 0.16 um',
    toolingUsed: 'Taylor Hobson Surtronic Roughness Tester',
    passed: true,
  },
  {
    id: 'chk-4',
    category: 'Metallurgy & Hardness',
    parameter: 'Surface Case Hardness',
    specification: '58 - 62 HRC (Induction Hardened)',
    actualMeasured: '60.4 HRC',
    toolingUsed: 'Rockwell Hardness Tester #HR-01',
    passed: true,
  },
  {
    id: 'chk-5',
    category: 'Functional / Concentricity',
    parameter: 'Radial Runout (TIR)',
    specification: '<= 0.004mm on V-Blocks',
    actualMeasured: '0.002mm',
    toolingUsed: 'Millimess Dial Comparator (0.001mm)',
    passed: true,
  },
  {
    id: 'chk-6',
    category: 'Packaging & Preservation',
    parameter: 'Anti-Corrosion VCI Coating',
    specification: 'Rust preventive oil dipping + VCI barrier wrapping',
    actualMeasured: 'Verified 100% dip & sealed barrier',
    toolingUsed: 'Visual & Packing Spec SOP-PKG-08',
    passed: true,
  },
  {
    id: 'chk-7',
    category: 'Labeling & Traceability',
    parameter: 'GS1 2D Datamatrix Laser Etch',
    specification: 'Scannable SKU, Batch #, Heat # on component body',
    actualMeasured: 'Grade A verification on Keyence Handheld Barcode Reader',
    toolingUsed: 'Keyence SR-2000 Scanner',
    passed: true,
  },
];

const mockExistingCertificates: FinalQCCertificate[] = [
  {
    id: 'cert-prev-01',
    certificateNumber: 'COC-2026-0811',
    itemCode: 'RAW-MTR-003',
    itemName: 'Brushless DC Coreless Motor 48V (750W)',
    batchNumber: 'LOT-MOOG-48V-01',
    heatNumber: 'CAL-TQC-4011',
    inspectedQty: 15,
    passedQty: 15,
    rejectedQty: 0,
    uom: 'PCS',
    status: 'PASSED',
    targetWarehouseBin: 'C-01-B1',
    stockUpdatedToFG: true,
    inspectorName: 'QC Lead V. Sharma',
    digitalSignatureHash: 'SIG-SHA256-APX-48V-99A1',
    signedAt: '2026-10-01 15:40',
    notes: 'Dynamometer load test passed at 100% rated torque. Zero insulation leakage.',
  },
];

export default function FinishedGoodsQCPage() {
  const [wipBatches, setWipBatches] = useState<FinishedGoodsBatch[]>(mockWIPBatches);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(mockWIPBatches[0].id);
  const [checklist, setChecklist] = useState<InspectionChecklistItem[]>(initialChecklist);
  const [certificates, setCertificates] = useState<FinalQCCertificate[]>(mockExistingCertificates);

  // Inspector form states
  const [inspectorName, setInspectorName] = useState<string>('QC Lead V. Sharma');
  const [passedQtyInput, setPassedQtyInput] = useState<number>(mockWIPBatches[0].completedQty);
  const [rejectedQtyInput, setRejectedQtyInput] = useState<number>(0);
  const [targetBinInput, setTargetBinInput] = useState<string>(mockWIPBatches[0].defaultBin);
  const [inspectorNotes, setInspectorNotes] = useState<string>(
    '100% dimensional tolerance verified on CMM #CMM-02. Surface finish Ra 0.16um exceeds spec. Component lot cleared for final dispatch outward packaging.'
  );

  // Modal State for viewing certificate
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<FinalQCCertificate | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Selected Batch
  const currentBatch = useMemo(() => {
    return wipBatches.find((b) => b.id === selectedBatchId) || wipBatches[0];
  }, [wipBatches, selectedBatchId]);

  // Handle batch selection
  const handleSelectBatch = (id: string) => {
    setSelectedBatchId(id);
    const batch = wipBatches.find((b) => b.id === id);
    if (batch) {
      setPassedQtyInput(batch.completedQty);
      setRejectedQtyInput(0);
      setTargetBinInput(batch.defaultBin);
    }
  };

  // Toggle checklist item pass/fail
  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, passed: !item.passed } : item))
    );
  };

  // Execute Final QC Certification & Move WIP to Finished Goods
  const handleAuthorizeQCPass = (e: React.FormEvent) => {
    e.preventDefault();

    const certNumber = `COC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const sigHash = `SIG-SHA256-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newCert: FinalQCCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      itemCode: currentBatch.itemCode,
      itemName: currentBatch.itemName,
      batchNumber: currentBatch.batchNumber,
      heatNumber: currentBatch.heatNumber,
      inspectedQty: currentBatch.completedQty,
      passedQty: passedQtyInput,
      rejectedQty: rejectedQtyInput,
      uom: currentBatch.uom,
      status: rejectedQtyInput > 0 ? (passedQtyInput > 0 ? 'CONDITIONAL' : 'REJECTED') : 'PASSED',
      targetWarehouseBin: targetBinInput,
      stockUpdatedToFG: true,
      inspectorName,
      digitalSignatureHash: sigHash,
      signedAt: nowTime,
      notes: inspectorNotes,
    };

    // Update batch status to FINISHED_GOOD
    setWipBatches((prev) =>
      prev.map((b) =>
        b.id === selectedBatchId ? { ...b, category: 'FINISHED_GOOD' } : b
      )
    );

    // Append to certificates
    setCertificates([newCert, ...certificates]);
    setSelectedCertForPreview(newCert);

    showToast(
      `QC Certificate of Conformance ${certNumber} digitally signed! ${passedQtyInput} ${currentBatch.uom} moved from WIP to Finished Goods in Bin ${targetBinInput}.`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
              Finished Goods QC & Certificate of Conformance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Final Inspection & PDI
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pre-Dispatch Inspection (PDI) checklist, cryptographic digital sign-off, automated Certificate of Conformance (CoC) generation, and physical inventory stock conversion from WIP to Finished Goods.
          </p>
        </div>

        {/* Quick Nav to Dispatch */}
        <div className="flex items-center gap-2">
          <Link
            href="/logistics/dispatch"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shadow-sm transition-all"
          >
            <span>Proceed to Outward Dispatch</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Top Quality KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Batches Awaiting Final PDI
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-50 mt-2">
            {wipBatches.filter((b) => b.category === 'WIP').length} Batches
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold">
            Offloaded from shop floor Job Cards
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              PDI Acceptance Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-2">
            99.2%
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-semibold">
            Zero critical defects found (MTD)
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              CoC Certificates Issued
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-50 mt-2">
            {certificates.length} Lots
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold">
            Digitally hashed with ISO 9001 compliance
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lead Inspector
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-2 truncate">
            {inspectorName}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <Fingerprint className="w-3.5 h-3.5" />
            PKI Smart Card Authenticated
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Batch Selection Strip */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Completed Production Consignment for Final QC Audit:
          </span>
          <span className="text-xs text-slate-500">
            {wipBatches.length} production consignments available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {wipBatches.map((batch) => {
            const isSelected = batch.id === selectedBatchId;
            const isCertified = batch.category === 'FINISHED_GOOD';

            return (
              <div
                key={batch.id}
                onClick={() => handleSelectBatch(batch.id)}
                className={cn(
                  'p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-2.5',
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {batch.jobCardNumber}
                    </span>
                    {isCertified ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> FG CERTIFIED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                        WIP INSPECTION PENDING
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                      {batch.itemCode}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium">
                      {batch.itemName}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Batch: <strong>{batch.batchNumber}</strong></span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {batch.completedQty} {batch.uom}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN INSPECTION STATION: Checklist & Pass Certificate Generator */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Technical Checklist (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  Pre-Dispatch Quality Checklist (PDI)
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {checklist.filter((c) => c.passed).length} of {checklist.length} Passed
              </span>
            </div>

            {/* Checklist Table */}
            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={cn(
                    'p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                    item.passed
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20'
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      className={cn(
                        'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                        item.passed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      )}
                    >
                      {item.passed ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.parameter}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Spec: <strong className="text-slate-700 dark:text-slate-300">{item.specification}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Measured: <strong className={item.passed ? 'text-emerald-600' : 'text-rose-600'}>{item.actualMeasured}</strong>
                        {' '}&bull; Tool: {item.toolingUsed}
                      </div>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'text-xs font-extrabold px-2 py-1 rounded-lg flex-shrink-0',
                      item.passed
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    )}
                  >
                    {item.passed ? 'CONFORMING' : 'NON-CONFORMING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Digital Sign-off & Stock Transfer Action (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleAuthorizeQCPass}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs"
          >
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  Authorize CoC Certificate
                </h3>
              </div>
              <span className="text-slate-400">
                Certifies batch quality & converts inventory stock from WIP to Finished Goods
              </span>
            </div>

            {/* Batch Context Summary */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                Consignment Details
              </span>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {currentBatch.itemCode} &bull; {currentBatch.batchNumber}
              </div>
              <div className="text-slate-500 font-medium">
                Heat: {currentBatch.heatNumber} &bull; Linked to {currentBatch.customerPo}
              </div>
            </div>

            {/* Passed / Rejected Quantities */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Certified Passed Qty *
                </label>
                <input
                  type="number"
                  min="0"
                  max={currentBatch.completedQty}
                  value={passedQtyInput}
                  onChange={(e) => setPassedQtyInput(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 font-mono font-bold text-emerald-700 dark:text-emerald-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rejected / Scrap Qty
                </label>
                <input
                  type="number"
                  min="0"
                  max={currentBatch.completedQty}
                  value={rejectedQtyInput}
                  onChange={(e) => setRejectedQtyInput(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20 font-mono font-bold text-rose-700 dark:text-rose-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Target Finished Goods Warehouse Bin */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Destination Finished Goods Warehouse Bin *</span>
                <span className="text-[10px] text-blue-600 font-mono">Stock conversion WIP &rarr; FG</span>
              </label>
              <input
                type="text"
                value={targetBinInput}
                onChange={(e) => setTargetBinInput(e.target.value.toUpperCase())}
                placeholder="e.g. C-01-B1"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Batch will be physically staged in Cleanroom / FG storage bay ready for dispatch picking.
              </span>
            </div>

            {/* Inspector Credential Sign-off */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Certifying Lead Quality Inspector *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px]">
                  AS9100 / ISO
                </span>
              </div>
            </div>

            {/* Inspector Notes */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Conformity Remarks / MTR Test Statement
              </label>
              <textarea
                rows={3}
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={passedQtyInput <= 0}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-5 h-5" />
              Sign QC Pass & Transfer WIP &rarr; Finished Goods
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Historical Certificate of Conformance Log */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Digitally Signed Certificates of Conformance (CoC / CoA)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {certificates.length} certificates registered
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400">
                      {cert.certificateNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {cert.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Bin: {cert.targetWarehouseBin}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                    {cert.itemCode} &bull; Batch {cert.batchNumber} ({cert.passedQty} {cert.uom})
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Signed by {cert.inspectorName} &bull; {cert.signedAt} &bull; {cert.digitalSignatureHash}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCertForPreview(cert)}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / View Certificate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Printable Certificate of Conformance (CoC) */}
      {/* ========================================================================= */}
      {selectedCertForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setSelectedCertForPreview(null)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Formal Certificate Layout */}
            <div className="border-4 border-double border-slate-300 dark:border-slate-700 p-6 rounded-2xl space-y-4">
              {/* Certificate Header */}
              <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-black tracking-wider uppercase text-slate-900 dark:text-slate-50">
                    APEX PRECISION MANUFACTURING OS
                  </span>
                </div>
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                  CERTIFICATE OF CONFORMANCE & QUALITY RELEASE
                </h2>
                <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
                  Document ID: {selectedCertForPreview.certificateNumber}
                </div>
                <div className="text-[10px] text-slate-400">
                  ISO 9001:2015 &bull; AS9100D Certified Quality Management System
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">PART / SKU IDENTIFIER</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm block">
                    {selectedCertForPreview.itemCode}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">
                    {selectedCertForPreview.itemName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">HEAT & BATCH NUMBER</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm block">
                    {selectedCertForPreview.batchNumber}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">
                    Heat Trace: {selectedCertForPreview.heatNumber}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">CERTIFIED RELEASE QUANTITY</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">
                    {selectedCertForPreview.passedQty} {selectedCertForPreview.uom}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Total Inspected: {selectedCertForPreview.inspectedQty} {selectedCertForPreview.uom}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">STORAGE LOCATION ALLOCATED</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">
                    Bin {selectedCertForPreview.targetWarehouseBin}
                  </span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">
                    Stock Converted: WIP &rarr; Finished Goods
                  </span>
                </div>
              </div>

              {/* Statement of Quality Conformance */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block mb-0.5 text-slate-900 dark:text-slate-100">
                  Inspection Statement:
                </span>
                {selectedCertForPreview.notes}
              </div>

              {/* Digital Signature Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">CERTIFYING OFFICER</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    {selectedCertForPreview.inspectorName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Signed: {selectedCertForPreview.signedAt}
                  </span>
                </div>

                {/* Digital Verification Stamp */}
                <div className="text-right">
                  <div className="inline-block p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-center">
                    <span className="font-mono text-[9px] font-bold text-emerald-700 dark:text-emerald-400 block">
                      DIGITALLY VERIFIED
                    </span>
                    <span className="font-mono text-[8px] text-slate-400 block">
                      {selectedCertForPreview.digitalSignatureHash}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedCertForPreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700"
              >
                Close View
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

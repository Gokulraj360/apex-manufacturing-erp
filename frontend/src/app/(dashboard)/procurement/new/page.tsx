'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  ShieldCheck,
  Send,
  Save,
  BadgeAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface VendorOption {
  id: string;
  code: string;
  name: string;
  gstin: string;
  rating: number;
  paymentTerms: string;
  contactPerson: string;
  email: string;
  address: string;
}

export interface CatalogItem {
  id: string;
  code: string;
  name: string;
  category: 'RAW_MATERIAL' | 'CONSUMABLE' | 'WIP' | 'FINISHED_GOOD';
  uom: string;
  standardCost: number;
  currentStock: number;
}

export interface PPCShortageRequisition {
  id: string;
  prNumber: string;
  mpsPlanNumber: string;
  targetProduct: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  shortageQty: number;
  uom: string;
  suggestedVendorId: string;
  suggestedRate: number;
  requiredBy: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface POLineItem {
  id: string;
  itemId: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  quantity: number;
  unitRate: number;
  gstRate: number; // e.g. 18
  lineSubtotal: number;
  lineGst: number;
  lineTotal: number;
  notes?: string;
}

// ============================================================================
// Mock Data Catalog & PPC Shortages
// ============================================================================

const mockVendors: VendorOption[] = [
  {
    id: 'v-1',
    code: 'VEN-TATA-01',
    name: 'Tata Steel Special Alloy Steels Ltd',
    gstin: '27AAACT0012P1ZR',
    rating: 4.9,
    paymentTerms: 'NET 30',
    contactPerson: 'Rajesh Verma (VP Supply)',
    email: 'b2b.orders@tatasteel.com',
    address: 'Plot 42, Jamshedpur Industrial Zone, Jharkhand',
  },
  {
    id: 'v-2',
    code: 'VEN-MOOG-02',
    name: 'Moog Precision Coreless Motors Inc',
    gstin: '29AABCM8821N1ZS',
    rating: 4.8,
    paymentTerms: 'NET 45',
    contactPerson: 'David Vance (Accounts Director)',
    email: 'procurement@moog-motors.com',
    address: 'Electronics City Phase 1, Bengaluru, Karnataka',
  },
  {
    id: 'v-3',
    code: 'VEN-SKF-03',
    name: 'SKF Bearings India Commercial Ltd',
    gstin: '27AABCS5512B1ZY',
    rating: 5.0,
    paymentTerms: 'NET 30',
    contactPerson: 'Anjali Deshmukh (Key Accounts)',
    email: 'industrial.sales@skf.com',
    address: 'Chinchwad Industrial Area, Pune, Maharashtra',
  },
  {
    id: 'v-4',
    code: 'VEN-UNBR-04',
    name: 'Unbrako Fasteners Global',
    gstin: '07AAACU1289K1ZK',
    rating: 4.7,
    paymentTerms: 'NET 15',
    contactPerson: 'Sandeep Malhotra (Factory Logistics)',
    email: 'fasteners@unbrako-global.com',
    address: 'Okhla Phase 3 Industrial Area, New Delhi',
  },
  {
    id: 'v-5',
    code: 'VEN-SAND-05',
    name: 'Sandvik Hyperion Carbide Materials',
    gstin: '29AAACH0098J1ZX',
    rating: 4.9,
    paymentTerms: 'ADVANCE 50%',
    contactPerson: 'Karan Grover (Materials Engineer)',
    email: 'carbide.india@sandvik.com',
    address: 'Peenya Industrial Estate, Bengaluru, Karnataka',
  },
];

const mockCatalog: CatalogItem[] = [
  {
    id: 'item-1',
    code: 'RAW-STL-001',
    name: 'Cold-Rolled Carbon Steel Coil 1018 (Billet Blank)',
    category: 'RAW_MATERIAL',
    uom: 'KG',
    standardCost: 2.15,
    currentStock: 120,
  },
  {
    id: 'item-2',
    code: 'RAW-SEAL-002',
    name: 'Fluorosilicone High-Temp O-Ring Seal',
    category: 'CONSUMABLE',
    uom: 'PCS',
    standardCost: 4.5,
    currentStock: 450,
  },
  {
    id: 'item-3',
    code: 'FAST-HEX-M12',
    name: 'Hex Flange Head Bolt M12x45 Grade 10.9',
    category: 'CONSUMABLE',
    uom: 'PCS',
    standardCost: 0.85,
    currentStock: 1400,
  },
  {
    id: 'item-4',
    code: 'RAW-MTR-003',
    name: 'Brushless DC Coreless Motor 48V (750W)',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    standardCost: 148.0,
    currentStock: 6,
  },
  {
    id: 'item-5',
    code: 'BRG-6205-2RS',
    name: 'Deep Groove Radial Ball Bearing 25x52x15',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    standardCost: 8.75,
    currentStock: 320,
  },
  {
    id: 'item-7',
    code: 'PLN-CRB-18MM',
    name: 'Tungsten Carbide Plunger Piston 18mm OD',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    standardCost: 42.0,
    currentStock: 14,
  },
  {
    id: 'item-8',
    code: 'BUSH-BRZ-30MM',
    name: 'Phosphor Bronze Sleeve Bushing 30x38x25',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    standardCost: 14.2,
    currentStock: 25,
  },
];

const mockPPCRequisitions: PPCShortageRequisition[] = [
  {
    id: 'pr-1',
    prNumber: 'PR-2026-091A',
    mpsPlanNumber: 'MPS-2026-001',
    targetProduct: 'Triplex Plunger Pump 500 Bar',
    itemId: 'item-1',
    itemCode: 'RAW-STL-001',
    itemName: 'Cold-Rolled Carbon Steel Coil 1018 (Billet Blank)',
    shortageQty: 181.5,
    uom: 'KG',
    suggestedVendorId: 'v-1', // Tata Steel
    suggestedRate: 2.15,
    requiredBy: '2026-04-03',
    urgency: 'HIGH',
  },
  {
    id: 'pr-2',
    prNumber: 'PR-2026-092B',
    mpsPlanNumber: 'MPS-2026-001',
    targetProduct: 'Triplex Plunger Pump 500 Bar',
    itemId: 'item-4',
    itemCode: 'RAW-MTR-003',
    itemName: 'Brushless DC Coreless Motor 48V (750W)',
    shortageQty: 9,
    uom: 'PCS',
    suggestedVendorId: 'v-2', // Moog
    suggestedRate: 148.0,
    requiredBy: '2026-04-08',
    urgency: 'CRITICAL',
  },
  {
    id: 'pr-3',
    prNumber: 'PR-2026-093C',
    mpsPlanNumber: 'MPS-2026-001',
    targetProduct: 'Triplex Plunger Pump 500 Bar',
    itemId: 'item-7',
    itemCode: 'PLN-CRB-18MM',
    itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
    shortageQty: 30,
    uom: 'PCS',
    suggestedVendorId: 'v-5', // Sandvik Hyperion
    suggestedRate: 42.0,
    requiredBy: '2026-04-14',
    urgency: 'HIGH',
  },
  {
    id: 'pr-4',
    prNumber: 'PR-2026-094D',
    mpsPlanNumber: 'MPS-2026-002',
    targetProduct: 'Modular Energy Storage Battery Rack',
    itemId: 'item-8',
    itemCode: 'BUSH-BRZ-30MM',
    itemName: 'Phosphor Bronze Sleeve Bushing 30x38x25',
    shortageQty: 48,
    uom: 'PCS',
    suggestedVendorId: 'v-3', // SKF Bearings
    suggestedRate: 14.2,
    requiredBy: '2026-04-16',
    urgency: 'MEDIUM',
  },
];

export default function CreatePurchaseOrderPage() {
  const router = useRouter();

  // PO Header Form State
  const [poNumber, setPONumber] = useState('PO-2026-044');
  const [vendorId, setVendorId] = useState<string>('v-1');
  const [selectedRequisition, setSelectedRequisition] = useState<PPCShortageRequisition | null>(null);
  const [orderDate, setOrderDate] = useState<string>('2026-03-31');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>('2026-04-10');
  const [paymentTerms, setPaymentTerms] = useState<string>('NET 30');
  const [billingPlant, setBillingPlant] = useState<string>('Plant 1 - Main Fab & Assembly, Pune');
  const [notes, setNotes] = useState<string>(
    'Inspection certificate and mill test report (MTR) must accompany consignment upon delivery.'
  );

  // Line items state
  const [lineItems, setLineItems] = useState<POLineItem[]>([
    {
      id: 'line-1',
      itemId: 'item-1',
      code: 'RAW-STL-001',
      name: 'Cold-Rolled Carbon Steel Coil 1018 (Billet Blank)',
      category: 'RAW_MATERIAL',
      uom: 'KG',
      quantity: 500,
      unitRate: 2.15,
      gstRate: 18,
      lineSubtotal: 1075.0,
      lineGst: 193.5,
      lineTotal: 1268.5,
      notes: 'Hot-rolled pickled and oiled',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected Vendor object
  const selectedVendor = useMemo(() => {
    return mockVendors.find((v) => v.id === vendorId) || mockVendors[0];
  }, [vendorId]);

  // Handle vendor select change
  const handleVendorChange = (newVendorId: string) => {
    setVendorId(newVendorId);
    const v = mockVendors.find((item) => item.id === newVendorId);
    if (v) {
      setPaymentTerms(v.paymentTerms);
    }
  };

  // Auto-populate from a PPC Shortage Requisition
  const handleApplyRequisition = (pr: PPCShortageRequisition) => {
    setSelectedRequisition(pr);
    // 1. Preselect suggested vendor
    if (pr.suggestedVendorId) {
      setVendorId(pr.suggestedVendorId);
      const v = mockVendors.find((m) => m.id === pr.suggestedVendorId);
      if (v) setPaymentTerms(v.paymentTerms);
    }

    // 2. Set expected delivery date
    if (pr.requiredBy) {
      setExpectedDeliveryDate(pr.requiredBy);
    }

    // 3. Find catalog item info
    const catItem = mockCatalog.find((i) => i.id === pr.itemId);
    const unitRate = pr.suggestedRate || catItem?.standardCost || 10;
    const qty = pr.shortageQty;
    const gstRate = 18;
    const lineSub = Number((qty * unitRate).toFixed(2));
    const lineGst = Number(((lineSub * gstRate) / 100).toFixed(2));
    const lineTot = Number((lineSub + lineGst).toFixed(2));

    // 4. Overwrite line items with this prioritized shortage line item
    setLineItems([
      {
        id: `pr-line-${Date.now()}`,
        itemId: pr.itemId,
        code: pr.itemCode,
        name: pr.itemName,
        category: catItem?.category || 'RAW_MATERIAL',
        uom: pr.uom,
        quantity: qty,
        unitRate: unitRate,
        gstRate: gstRate,
        lineSubtotal: lineSub,
        lineGst: lineGst,
        lineTotal: lineTot,
        notes: `Shortage fulfillment for ${pr.targetProduct} (${pr.mpsPlanNumber})`,
      },
    ]);

    setNotes(
      `Expedited dispatch requested for PPC Requisition ${pr.prNumber} (Plan: ${pr.mpsPlanNumber}). Immediate delivery SLA required.`
    );
  };

  // Add line item
  const handleAddLineItem = () => {
    const defaultItem = mockCatalog[0];
    const unitRate = defaultItem.standardCost;
    const qty = 100;
    const gstRate = 18;
    const lineSub = Number((qty * unitRate).toFixed(2));
    const lineGst = Number(((lineSub * gstRate) / 100).toFixed(2));
    const lineTot = Number((lineSub + lineGst).toFixed(2));

    const newLine: POLineItem = {
      id: `line-${Date.now()}`,
      itemId: defaultItem.id,
      code: defaultItem.code,
      name: defaultItem.name,
      category: defaultItem.category,
      uom: defaultItem.uom,
      quantity: qty,
      unitRate: unitRate,
      gstRate: gstRate,
      lineSubtotal: lineSub,
      lineGst: lineGst,
      lineTotal: lineTot,
      notes: '',
    };
    setLineItems((prev) => [...prev, newLine]);
  };

  // Remove line item
  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length === 1) {
      setErrorMsg('A Purchase Order must contain at least one line item.');
      return;
    }
    setErrorMsg(null);
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update line item item selection
  const handleItemSelectChange = (lineId: string, selectedItemId: string) => {
    const targetItem = mockCatalog.find((i) => i.id === selectedItemId);
    if (!targetItem) return;

    setLineItems((prev) =>
      prev.map((line) => {
        if (line.id !== lineId) return line;
        const lineSub = Number((line.quantity * targetItem.standardCost).toFixed(2));
        const lineGst = Number(((lineSub * line.gstRate) / 100).toFixed(2));
        const lineTot = Number((lineSub + lineGst).toFixed(2));

        return {
          ...line,
          itemId: targetItem.id,
          code: targetItem.code,
          name: targetItem.name,
          category: targetItem.category,
          uom: targetItem.uom,
          unitRate: targetItem.standardCost,
          lineSubtotal: lineSub,
          lineGst: lineGst,
          lineTotal: lineTot,
        };
      })
    );
  };

  // Update line item fields (qty, unitRate, gstRate, notes)
  const handleLineFieldChange = (
    lineId: string,
    field: 'quantity' | 'unitRate' | 'gstRate' | 'notes',
    value: any
  ) => {
    setErrorMsg(null);
    setLineItems((prev) =>
      prev.map((line) => {
        if (line.id !== lineId) return line;

        const updated = { ...line, [field]: value };
        if (field === 'quantity' || field === 'unitRate' || field === 'gstRate') {
          const qty = Number(field === 'quantity' ? value : updated.quantity) || 0;
          const rate = Number(field === 'unitRate' ? value : updated.unitRate) || 0;
          const gst = Number(field === 'gstRate' ? value : updated.gstRate) || 0;

          const sub = Number((qty * rate).toFixed(2));
          const lineGst = Number(((sub * gst) / 100).toFixed(2));
          const lineTot = Number((sub + lineGst).toFixed(2));

          updated.lineSubtotal = sub;
          updated.lineGst = lineGst;
          updated.lineTotal = lineTot;
        }
        return updated;
      })
    );
  };

  // Financial summary aggregations
  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((acc, line) => acc + line.lineSubtotal, 0);
    const totalGst = lineItems.reduce((acc, line) => acc + line.lineGst, 0);
    const grandTotal = subtotal + totalGst;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      totalGst: Number(totalGst.toFixed(2)),
      cgst: Number((totalGst / 2).toFixed(2)),
      sgst: Number((totalGst / 2).toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
      totalItemsCount: lineItems.reduce((acc, line) => acc + Number(line.quantity), 0),
    };
  }, [lineItems]);

  // Form Submission
  const handleSubmit = (status: 'PENDING' | 'DRAFT') => {
    if (!poNumber.trim()) {
      setErrorMsg('Please enter a valid Purchase Order Number.');
      return;
    }
    if (lineItems.length === 0) {
      setErrorMsg('At least one item line is required.');
      return;
    }
    for (const item of lineItems) {
      if (item.quantity <= 0) {
        setErrorMsg(`Item ${item.code} must have a quantity greater than zero.`);
        return;
      }
      if (item.unitRate < 0) {
        setErrorMsg(`Item ${item.code} unit rate cannot be negative.`);
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/procurement');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/procurement"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                New Purchase Order
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Procurement
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Generate supplier purchase orders, reconcile PPC shortage requisitions, and calculate statutory GST.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/procurement"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('PENDING')}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Generating...' : 'Issue Purchase Order'}
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: PPC Shortage Requisition Auto-Populator Banner */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/50 dark:from-blue-950/30 dark:via-slate-900 dark:to-indigo-950/20 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-blue-100 dark:border-blue-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                PPC Shortage Requisitions Auto-Populator
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-200/70 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {mockPPCRequisitions.length} Pending Actions
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any pending production shortage to auto-fill the target vendor, item SKU, required batch quantity, and deadline.
              </p>
            </div>
          </div>
          {selectedRequisition && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Requisition: {selectedRequisition.prNumber}
              </span>
              <button
                type="button"
                onClick={() => setSelectedRequisition(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline text-xs"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Requisition Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3.5">
          {mockPPCRequisitions.map((pr) => {
            const isSelected = selectedRequisition?.id === pr.id;
            return (
              <div
                key={pr.id}
                onClick={() => handleApplyRequisition(pr)}
                className={cn(
                  'p-3 rounded-xl border text-xs cursor-pointer transition-all duration-150',
                  isSelected
                    ? 'border-blue-600 bg-blue-100/60 dark:bg-blue-900/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700'
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                    {pr.prNumber}
                  </span>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase',
                      pr.urgency === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : pr.urgency === 'HIGH'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    )}
                  >
                    {pr.urgency}
                  </span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {pr.itemName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Shortage: <span className="font-bold text-rose-600 dark:text-rose-400">{pr.shortageQty} {pr.uom}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                  <span>{pr.mpsPlanNumber}</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">Due: {pr.requiredBy}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: General PO Info & Vendor Details */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General PO Details */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Purchase Order Header
            </h2>
            <span className="text-xs text-slate-400">Status: DRAFT / PENDING APPROVAL</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* PO Number */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Purchase Order #
              </label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPONumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Vendor Selector */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Vendor / Supplier
              </label>
              <select
                value={vendorId}
                onChange={(e) => handleVendorChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mockVendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.rating}&#9733;)
                  </option>
                ))}
              </select>
            </div>

            {/* Order Date */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Order Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Delivery Date
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NET 15">NET 15 Days</option>
                <option value="NET 30">NET 30 Days</option>
                <option value="NET 45">NET 45 Days</option>
                <option value="ADVANCE 50%">50% Advance, 50% on Delivery</option>
                <option value="IMMEDIATE">Immediate on Delivery / COD</option>
              </select>
            </div>

            {/* Billing / Receiving Plant */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Delivery / Receiving Plant
              </label>
              <input
                type="text"
                value={billingPlant}
                onChange={(e) => setBillingPlant(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Supplier Instructions / Terms */}
          <div className="text-xs pt-1">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Supplier Instructions & Quality Inspection Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mill test report, packaging requirements, calibration certificates..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Right: Vendor Overview Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Vendor Profile
              </h2>
              <span className="font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded text-[11px]">
                {selectedVendor.code}
              </span>
            </div>

            <div className="mt-3.5 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Vendor Legal Entity</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedVendor.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[10px]">GSTIN</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedVendor.gstin}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[10px]">On-Time Rating</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    {selectedVendor.rating} / 5.0 &#9733;
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Primary Contact</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedVendor.contactPerson} ({selectedVendor.email})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Factory / Dispatch Address</span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {selectedVendor.address}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Verified ERP Vendor &bull; Statutory 18% GST Compliant
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: Multi-Item Line Table with Live GST Calculation */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Purchased Items & Statutory GST Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select catalog components, configure procurement volume, adjust agreed unit prices, and calculate line GST.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddLineItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item Line
          </button>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3 min-w-[220px]">Item Master Component</th>
                <th className="py-3 px-3 w-28 text-right">Order Qty</th>
                <th className="py-3 px-3 w-20 text-center">UOM</th>
                <th className="py-3 px-3 w-28 text-right">Unit Rate ($)</th>
                <th className="py-3 px-3 w-28 text-right">Subtotal ($)</th>
                <th className="py-3 px-3 w-24 text-center">GST %</th>
                <th className="py-3 px-3 w-28 text-right">GST ($)</th>
                <th className="py-3 px-3 w-32 text-right">Total ($)</th>
                <th className="py-3 px-3 w-12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {lineItems.map((line, index) => (
                <tr key={line.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  {/* Row Number */}
                  <td className="py-3 px-3 text-center font-bold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Item Selector */}
                  <td className="py-3 px-3">
                    <select
                      value={line.itemId}
                      onChange={(e) => handleItemSelectChange(line.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {mockCatalog.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.code} - {cat.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Optional line notes / specs..."
                      value={line.notes || ''}
                      onChange={(e) => handleLineFieldChange(line.id, 'notes', e.target.value)}
                      className="w-full mt-1.5 px-2 py-0.5 text-[11px] rounded border border-slate-100 dark:border-slate-800 bg-transparent text-slate-500 focus:outline-none"
                    />
                  </td>

                  {/* Quantity Input */}
                  <td className="py-3 px-3 text-right">
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={line.quantity}
                      onChange={(e) => handleLineFieldChange(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full text-right px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* UOM */}
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {line.uom}
                    </span>
                  </td>

                  {/* Unit Rate */}
                  <td className="py-3 px-3 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.unitRate}
                      onChange={(e) => handleLineFieldChange(line.id, 'unitRate', parseFloat(e.target.value) || 0)}
                      className="w-full text-right px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* Subtotal (Net) */}
                  <td className="py-3 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                    ${line.lineSubtotal.toFixed(2)}
                  </td>

                  {/* GST % */}
                  <td className="py-3 px-3 text-center">
                    <select
                      value={line.gstRate}
                      onChange={(e) => handleLineFieldChange(line.id, 'gstRate', parseFloat(e.target.value) || 0)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </td>

                  {/* GST Amount */}
                  <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                    ${line.lineGst.toFixed(2)}
                  </td>

                  {/* Line Total */}
                  <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                    ${line.lineTotal.toFixed(2)}
                  </td>

                  {/* Delete Action */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(line.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: Financial Summary & Authorizations */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Statutory Taxes & Legal Terms */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Commercial & Statutory Terms
          </h3>
          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span>
                <strong>Taxes:</strong> CGST 9% + SGST 9% applied on all standard manufacturing components as per Indian GST Schedule Chapter 72/84/85.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span>
                <strong>GRN Receipt:</strong> Delivery will be subject to QC Gate Inspection against purchase order tolerance standards before stock ledger increment.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span>
                <strong>Payment Schedule:</strong> {paymentTerms} from the date of physical receipt and verification of original tax invoice.
              </span>
            </p>
          </div>
        </div>

        {/* Right: Calculated Grand Total Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Purchase Order Financial Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Gross Material Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                ${totals.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span>Central GST (CGST @ 9%)</span>
              <span>${totals.cgst.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span>State GST (SGST @ 9%)</span>
              <span>${totals.sgst.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Total Statutory GST (18%)</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                ${totals.totalGst.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-base font-extrabold text-slate-900 dark:text-slate-50 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span>Grand Total Payable</span>
                <span className="block text-[11px] font-normal text-slate-400">
                  Includes all applicable taxes & shipping
                </span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 text-lg">
                ${totals.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => handleSubmit('PENDING')}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting Purchase Order...' : 'Submit & Issue Purchase Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

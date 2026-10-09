'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Calculator,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Send,
  Eye,
  History,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  Layers,
  Sparkles,
  Percent,
  Check,
} from 'lucide-react';
import {
  QuotationItem,
  QuotationStatus,
  ManufacturingCostBasisItem,
  QuotationLineItem,
  QuotationRevisionSnapshot,
} from '@/types/crm';
import { CostPriceField, SellingPriceField } from '@/components/pricing';

const INITIAL_QUOTATIONS: QuotationItem[] = [
  {
    id: 'qt-1',
    quotationNumber: 'QT-2026-0419',
    revisionNumber: 2,
    leadId: 'lead-2',
    clientName: 'Larsen & Toubro Heavy Equipment',
    clientEmail: 'anjali.m@larsentoubro.com',
    status: 'TRANSMITTED_TO_CLIENT',
    validUntilDate: '2026-11-15',
    paymentTerms: 'NET_60',
    incoterms: 'FOB Nhava Sheva Port',
    currency: 'USD',
    subtotal: 185000,
    discountAmount: 5000,
    taxAmount: 32400,
    totalAmount: 212400,
    manufacturingCostBasis: [
      {
        itemSku: 'HYD-ROD-EN8D-500',
        itemName: 'Hard Chrome Plated EN8D Cylinder Rods (500mm)',
        rawMaterialCost: 120,
        machineHours: 2.5,
        laborCost: 45,
        overheadCost: 25,
        marginPct: 28,
        unitPrice: 380,
        qty: 500,
        lineTotal: 190000,
      },
    ],
    lineItems: [
      {
        itemSku: 'HYD-ROD-EN8D-500',
        itemName: 'Hard Chrome Plated EN8D Cylinder Rods (500mm)',
        quantity: 500,
        uom: 'PCS',
        unitPrice: 380,
        lineTotal: 190000,
        technicalDrawingRef: 'DWG-LT-2026-881',
      },
    ],
    preparedBy: 'Ananya Sharma',
    approvedBy: 'Vikram Sethi',
    revisionsHistory: [
      {
        revisionNumber: 1,
        revisedAt: '2026-10-01 14:00',
        revisedBy: 'Ananya Sharma',
        reason: 'Client requested volume consideration; revised margin from 32% to 28%.',
        previousSubtotal: 198000,
        previousTotal: 228640,
        previousLineItems: [],
      },
    ],
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'qt-2',
    quotationNumber: 'QT-2026-0422',
    revisionNumber: 1,
    leadId: 'lead-1',
    clientName: 'Mahindra Heavy Electric Vehicles',
    clientEmail: 'sandeep.d@mahindrahev.com',
    status: 'ACCEPTED',
    validUntilDate: '2026-10-31',
    paymentTerms: 'NET_45',
    incoterms: 'DAP Chakan Plant Pune',
    currency: 'USD',
    subtotal: 240000,
    discountAmount: 10000,
    taxAmount: 41400,
    totalAmount: 271400,
    manufacturingCostBasis: [
      {
        itemSku: 'GEAR-TRANSMISSION-120',
        itemName: 'Hardened Alloy Steel Transmission Gearbox 120kW',
        rawMaterialCost: 75,
        machineHours: 3.0,
        laborCost: 35,
        overheadCost: 20,
        marginPct: 30,
        unitPrice: 200,
        qty: 1200,
        lineTotal: 240000,
      },
    ],
    lineItems: [
      {
        itemSku: 'GEAR-TRANSMISSION-120',
        itemName: 'Hardened Alloy Steel Transmission Gearbox 120kW',
        quantity: 1200,
        uom: 'SETS',
        unitPrice: 200,
        lineTotal: 240000,
        technicalDrawingRef: 'DWG-MHEV-GB-401',
      },
    ],
    preparedBy: 'Vikram Sethi',
    approvedBy: 'Rajiv Mehta (VP Ops)',
    revisionsHistory: [],
    createdAt: '2026-10-03T11:30:00Z',
  },
  {
    id: 'qt-3',
    quotationNumber: 'QT-2026-0425',
    revisionNumber: 1,
    leadId: 'lead-3',
    clientName: 'Schneider Electric Industrial India',
    clientEmail: 'praveen.k@schneider.in',
    status: 'PENDING_INTERNAL_REVIEW',
    validUntilDate: '2026-11-20',
    paymentTerms: 'NET_30',
    incoterms: 'Ex-Works Bangalore Plant',
    currency: 'USD',
    subtotal: 95000,
    discountAmount: 0,
    taxAmount: 17100,
    totalAmount: 112100,
    manufacturingCostBasis: [
      {
        itemSku: 'ENC-CRCA-IP66-4KW',
        itemName: 'Powder Coated CRCA Sheet Metal Enclosure IP66',
        rawMaterialCost: 110,
        machineHours: 1.8,
        laborCost: 25,
        overheadCost: 15,
        marginPct: 25,
        unitPrice: 190,
        qty: 500,
        lineTotal: 95000,
      },
    ],
    lineItems: [
      {
        itemSku: 'ENC-CRCA-IP66-4KW',
        itemName: 'Powder Coated CRCA Sheet Metal Enclosure IP66',
        quantity: 500,
        uom: 'UNITS',
        unitPrice: 190,
        lineTotal: 95000,
        technicalDrawingRef: 'DWG-SCH-IP66-09',
      },
    ],
    preparedBy: 'Rohan Mehra',
    revisionsHistory: [],
    createdAt: '2026-10-05T09:15:00Z',
  },
  {
    id: 'qt-4',
    quotationNumber: 'QT-2026-0428',
    revisionNumber: 1,
    leadId: 'lead-4',
    clientName: 'Tata Motors Commercial Vehicles',
    clientEmail: 'rajesh.v@tatamotors.com',
    status: 'DRAFT',
    validUntilDate: '2026-11-30',
    paymentTerms: 'NET_45',
    incoterms: 'DAP Pune Plant',
    currency: 'USD',
    subtotal: 310000,
    discountAmount: 12000,
    taxAmount: 53640,
    totalAmount: 351640,
    manufacturingCostBasis: [
      {
        itemSku: 'AXLE-BEAM-MICROALLOY',
        itemName: 'Forged Micro-Alloy Front Axle I-Beam',
        rawMaterialCost: 450,
        machineHours: 4.2,
        laborCost: 90,
        overheadCost: 40,
        marginPct: 26,
        unitPrice: 1033.33,
        qty: 300,
        lineTotal: 310000,
      },
    ],
    lineItems: [
      {
        itemSku: 'AXLE-BEAM-MICROALLOY',
        itemName: 'Forged Micro-Alloy Front Axle I-Beam',
        quantity: 300,
        uom: 'PCS',
        unitPrice: 1033.33,
        lineTotal: 310000,
        technicalDrawingRef: 'DWG-TAT-AXL-77',
      },
    ],
    preparedBy: 'Vikram Sethi',
    revisionsHistory: [],
    createdAt: '2026-10-06T15:20:00Z',
  },
];

export default function CRMQuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationItem[]>(INITIAL_QUOTATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [selectedQuotationForDetails, setSelectedQuotationForDetails] = useState<QuotationItem | null>(null);
  const [selectedQuotationForRevision, setSelectedQuotationForRevision] = useState<QuotationItem | null>(null);
  const [revisionReason, setRevisionReason] = useState('');

  // Draft Form State
  const [draftForm, setDraftForm] = useState({
    clientName: '',
    clientEmail: '',
    validUntilDate: '2026-11-30',
    paymentTerms: 'NET_30',
    incoterms: 'Ex-Works Plant',
    itemSku: '',
    itemName: '',
    qty: 100,
    rawMaterialCost: 50,
    machineHours: 2.0,
    machineHourRate: 40,
    laborCost: 30,
    overheadCost: 15,
    marginPct: 25,
    discountAmount: 0,
    drawingRef: '',
  });

  // Calculate Unit Cost and Price dynamically
  const calculatedMfgCostPerUnit =
    Number(draftForm.rawMaterialCost) +
    Number(draftForm.machineHours) * Number(draftForm.machineHourRate) +
    Number(draftForm.laborCost) +
    Number(draftForm.overheadCost);

  const calculatedUnitPrice =
    calculatedMfgCostPerUnit * (1 + Number(draftForm.marginPct) / 100);

  const calculatedSubtotal = calculatedUnitPrice * Number(draftForm.qty);
  const calculatedTax = (calculatedSubtotal - Number(draftForm.discountAmount)) * 0.18;
  const calculatedTotal = calculatedSubtotal - Number(draftForm.discountAmount) + calculatedTax;

  // Filtered List
  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.lineItems.some((l) => l.itemName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Metrics
  const totalValue = quotations.reduce((acc, q) => acc + q.totalAmount, 0);
  const acceptedValue = quotations
    .filter((q) => q.status === 'ACCEPTED')
    .reduce((acc, q) => acc + q.totalAmount, 0);
  const transmittedCount = quotations.filter((q) => q.status === 'TRANSMITTED_TO_CLIENT').length;

  // Transmit Action
  const handleTransmit = (id: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'TRANSMITTED_TO_CLIENT' } : q))
    );
  };

  // Accept Action
  const handleAccept = (id: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'ACCEPTED' } : q))
    );
  };

  // Submit Draft
  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();

    const newQuotation: QuotationItem = {
      id: `qt-${Date.now()}`,
      quotationNumber: `QT-2026-0${Math.floor(430 + Math.random() * 500)}`,
      revisionNumber: 1,
      clientName: draftForm.clientName,
      clientEmail: draftForm.clientEmail,
      status: 'DRAFT',
      validUntilDate: draftForm.validUntilDate,
      paymentTerms: draftForm.paymentTerms,
      incoterms: draftForm.incoterms,
      currency: 'USD',
      subtotal: Math.round(calculatedSubtotal),
      discountAmount: Number(draftForm.discountAmount) || 0,
      taxAmount: Math.round(calculatedTax),
      totalAmount: Math.round(calculatedTotal),
      manufacturingCostBasis: [
        {
          itemSku: draftForm.itemSku || 'CUSTOM-FAB-01',
          itemName: draftForm.itemName || 'Engineered Component',
          rawMaterialCost: Number(draftForm.rawMaterialCost),
          machineHours: Number(draftForm.machineHours),
          laborCost: Number(draftForm.laborCost),
          overheadCost: Number(draftForm.overheadCost),
          marginPct: Number(draftForm.marginPct),
          unitPrice: Math.round(calculatedUnitPrice * 100) / 100,
          qty: Number(draftForm.qty),
          lineTotal: Math.round(calculatedSubtotal),
        },
      ],
      lineItems: [
        {
          itemSku: draftForm.itemSku || 'CUSTOM-FAB-01',
          itemName: draftForm.itemName || 'Engineered Component',
          quantity: Number(draftForm.qty),
          uom: 'PCS',
          unitPrice: Math.round(calculatedUnitPrice * 100) / 100,
          lineTotal: Math.round(calculatedSubtotal),
          technicalDrawingRef: draftForm.drawingRef || 'DWG-REV-01',
        },
      ],
      preparedBy: 'Vikram Sethi',
      revisionsHistory: [],
      createdAt: new Date().toISOString(),
    };

    setQuotations([newQuotation, ...quotations]);
    setShowDraftModal(false);
  };

  // Submit Revision
  const handleExecuteRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuotationForRevision || !revisionReason.trim()) return;

    const current = selectedQuotationForRevision;
    const snapshot: QuotationRevisionSnapshot = {
      revisionNumber: current.revisionNumber,
      revisedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      revisedBy: 'Vikram Sethi',
      reason: revisionReason.trim(),
      previousSubtotal: current.subtotal,
      previousTotal: current.totalAmount,
      previousLineItems: current.lineItems,
    };

    const updated: QuotationItem = {
      ...current,
      revisionNumber: current.revisionNumber + 1,
      status: 'REVISED',
      revisionsHistory: [...(current.revisionsHistory || []), snapshot],
    };

    setQuotations((prev) => prev.map((q) => (q.id === current.id ? updated : q)));
    setSelectedQuotationForRevision(null);
    setRevisionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Commercial Estimations
            </span>
            <span className="text-xs text-slate-500">Shop Floor Cost-Basis Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Manufacturing Quotations & Cost Sheets
          </h1>
          <p className="text-sm text-slate-400">
            Formulate price quotations derived from direct raw materials, machine hour rates, labor, factory overhead, and revision audits.
          </p>
        </div>

        <button
          onClick={() => setShowDraftModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-pink-900/20"
        >
          <Plus className="w-4 h-4" />
          Draft Quotation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Quoted Portfolio</div>
            <div className="text-2xl font-bold text-white mt-1">${totalValue.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">{quotations.length} total proposals</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Client Accepted Revenue</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              ${acceptedValue.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400/90 mt-1">Converted to production orders</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Under Client Review</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{transmittedCount}</div>
            <div className="text-xs text-slate-400 mt-1">Transmitted to decision makers</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Average Profit Margin</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">27.2%</div>
            <div className="text-xs text-cyan-400/80 mt-1">Machine & overhead cushioned</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Percent className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Status Toolbar */}
      <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search quotation #, client, or component..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Quotations' },
            { id: 'DRAFT', label: 'Draft' },
            { id: 'PENDING_INTERNAL_REVIEW', label: 'In Review' },
            { id: 'TRANSMITTED_TO_CLIENT', label: 'Transmitted' },
            { id: 'ACCEPTED', label: 'Accepted' },
            { id: 'REVISED', label: 'Revised' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.id
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="p-3.5">Quotation # & Rev</th>
                <th className="p-3.5">Client & Email</th>
                <th className="p-3.5">Key Components</th>
                <th className="p-3.5">Total Amount (USD)</th>
                <th className="p-3.5">Terms & Incoterms</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredQuotations.map((q) => {
                const badgeColor =
                  q.status === 'ACCEPTED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : q.status === 'TRANSMITTED_TO_CLIENT'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : q.status === 'REVISED'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    : q.status === 'PENDING_INTERNAL_REVIEW'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-slate-700/30 text-slate-300 border-slate-700';

                return (
                  <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white text-sm">{q.quotationNumber}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300">
                          Rev {q.revisionNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Valid: {q.validUntilDate}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{q.clientName}</div>
                      <div className="text-slate-400 text-[11px] font-mono mt-0.5">{q.clientEmail}</div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      {q.lineItems.map((li, idx) => (
                        <div key={idx} className="line-clamp-1 text-slate-300 font-medium">
                          {li.quantity} {li.uom} - {li.itemName}
                        </div>
                      ))}
                      <div className="text-[11px] text-slate-500">
                        Prepared by {q.preparedBy}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-base text-white">
                        ${q.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Subtotal: ${q.subtotal.toLocaleString()} | Tax: ${q.taxAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-cyan-400 font-medium">{q.paymentTerms}</div>
                      <div className="text-slate-400 text-[11px]">{q.incoterms}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badgeColor}`}>
                        {q.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedQuotationForDetails(q)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                        title="View Detailed Cost Sheet & Versions"
                      >
                        Cost Sheet
                      </button>

                      {q.status === 'DRAFT' || q.status === 'PENDING_INTERNAL_REVIEW' ? (
                        <button
                          onClick={() => handleTransmit(q.id)}
                          className="px-2.5 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-medium transition-colors"
                          title="Transmit to Client"
                        >
                          Transmit
                        </button>
                      ) : null}

                      {q.status === 'TRANSMITTED_TO_CLIENT' ? (
                        <>
                          <button
                            onClick={() => setSelectedQuotationForRevision(q)}
                            className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs font-medium border border-purple-500/30 transition-colors"
                            title="Create Revision"
                          >
                            Revise
                          </button>
                          <button
                            onClick={() => handleAccept(q.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                            title="Accept Quotation"
                          >
                            Accept
                          </button>
                        </>
                      ) : null}

                      {q.status === 'ACCEPTED' ? (
                        <Link
                          href="/crm/orders"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30 transition-colors"
                        >
                          Convert to SO
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: DRAFT NEW QUOTATION (WITH COST BASIS CALCULATOR) */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-pink-400" />
                  Draft Manufacturing Quotation & Cost Sheet
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculate price quotes based on real machine rates, raw material, and target margins.
                </p>
              </div>
              <button
                onClick={() => setShowDraftModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
              {/* Client & Commercial Terms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#090d16] p-3.5 rounded-xl border border-slate-800/80">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Client / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bharat Forge Light Commercial"
                    value={draftForm.clientName}
                    onChange={(e) => setDraftForm({ ...draftForm, clientName: e.target.value })}
                    className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Client Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sourcing@bharatforge.com"
                    value={draftForm.clientEmail}
                    onChange={(e) => setDraftForm({ ...draftForm, clientEmail: e.target.value })}
                    className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Valid Until Date</label>
                  <input
                    type="date"
                    value={draftForm.validUntilDate}
                    onChange={(e) => setDraftForm({ ...draftForm, validUntilDate: e.target.value })}
                    className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Payment Terms</label>
                  <select
                    value={draftForm.paymentTerms}
                    onChange={(e) => setDraftForm({ ...draftForm, paymentTerms: e.target.value })}
                    className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="NET_30">Net 30 Days</option>
                    <option value="NET_45">Net 45 Days</option>
                    <option value="NET_60">Net 60 Days</option>
                    <option value="ADVANCE">100% Advance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Incoterms</label>
                  <input
                    type="text"
                    placeholder="e.g. FOB Mumbai Port / Ex-Works"
                    value={draftForm.incoterms}
                    onChange={(e) => setDraftForm({ ...draftForm, incoterms: e.target.value })}
                    className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Engineering Drawing Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. DWG-REV-2026-X"
                    value={draftForm.drawingRef}
                    onChange={(e) => setDraftForm({ ...draftForm, drawingRef: e.target.value })}
                    className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Manufacturing Cost Basis Breakdown */}
              <div className="bg-[#090d16] p-4 rounded-xl border border-pink-500/20 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-semibold text-pink-400 flex items-center gap-1.5 text-sm">
                    <Layers className="w-4 h-4" />
                    Manufacturing Unit Cost Breakdown Engine
                  </span>
                  <span className="text-[11px] text-slate-400">Currency: USD ($)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300">Item SKU & Code</label>
                    <input
                      type="text"
                      placeholder="e.g. FORGE-SHAFT-EN24"
                      value={draftForm.itemSku}
                      onChange={(e) => setDraftForm({ ...draftForm, itemSku: e.target.value })}
                      className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">Component Specification / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. High Tensile Forged Transmission Shaft"
                      value={draftForm.itemName}
                      onChange={(e) => setDraftForm({ ...draftForm, itemName: e.target.value })}
                      className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300">Order Quantity</label>
                    <input
                      type="number"
                      value={draftForm.qty}
                      onChange={(e) => setDraftForm({ ...draftForm, qty: Number(e.target.value) })}
                      className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <CostPriceField
                      value={draftForm.rawMaterialCost}
                      onChange={(val) => setDraftForm({ ...draftForm, rawMaterialCost: val })}
                      role="CRM_SALES_REP"
                      label="Raw Material Cost ($)"
                      currency="$"
                      itemSku={draftForm.itemSku || 'GEN-QUOTE-SKU'}
                      targetEntity="Quotation"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">Machine Hours / Pc</label>
                    <input
                      type="number"
                      step="0.1"
                      value={draftForm.machineHours}
                      onChange={(e) => setDraftForm({ ...draftForm, machineHours: Number(e.target.value) })}
                      className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">Machine Rate ($/hr)</label>
                    <input
                      type="number"
                      value={draftForm.machineHourRate}
                      onChange={(e) => setDraftForm({ ...draftForm, machineHourRate: Number(e.target.value) })}
                      className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">Direct Labor ($/pc)</label>
                    <input
                      type="number"
                      value={draftForm.laborCost}
                      onChange={(e) => setDraftForm({ ...draftForm, laborCost: Number(e.target.value) })}
                      className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">Plant Overhead ($/pc)</label>
                    <input
                      type="number"
                      value={draftForm.overheadCost}
                      onChange={(e) => setDraftForm({ ...draftForm, overheadCost: Number(e.target.value) })}
                      className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold text-pink-400">Target Margin (%)</label>
                    <input
                      type="number"
                      value={draftForm.marginPct}
                      onChange={(e) => setDraftForm({ ...draftForm, marginPct: Number(e.target.value) })}
                      className="w-full bg-[#0d1322] border border-pink-500/50 rounded-lg px-2.5 py-1.5 text-pink-300 font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">Discount ($)</label>
                    <input
                      type="number"
                      value={draftForm.discountAmount}
                      onChange={(e) => setDraftForm({ ...draftForm, discountAmount: Number(e.target.value) })}
                      className="w-full bg-[#0d1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                {/* Calculation Summary Preview */}
                <div className="bg-[#0d1322] p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-400">Mfg Cost/Unit: </span>
                    <span className="text-slate-200 font-bold">${calculatedMfgCostPerUnit.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Final Unit Price: </span>
                    <span className="text-pink-400 font-bold">${calculatedUnitPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Subtotal: </span>
                    <span className="text-white font-bold">${calculatedSubtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Total (Inc 18% Tax): </span>
                    <span className="text-emerald-400 font-bold text-sm">${calculatedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDraftModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium shadow-md shadow-pink-900/20"
                >
                  Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW DETAILED COST SHEET & REVISIONS */}
      {selectedQuotationForDetails && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-pink-400">
                    {selectedQuotationForDetails.quotationNumber}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-semibold">
                    Rev {selectedQuotationForDetails.revisionNumber}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedQuotationForDetails.clientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuotationForDetails(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cost Basis Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-pink-400" />
                Manufacturing Cost Sheet Analysis
              </h4>

              {selectedQuotationForDetails.manufacturingCostBasis.map((cb, idx) => (
                <div key={idx} className="bg-[#090d16] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold text-white">
                    <span>{cb.itemName}</span>
                    <span className="font-mono text-pink-400">SKU: {cb.itemSku}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-400">Raw Material:</span> ${cb.rawMaterialCost}
                    </div>
                    <div>
                      <span className="text-slate-400">Machining ({cb.machineHours}h):</span> ${(cb.machineHours * 40).toFixed(0)}
                    </div>
                    <div>
                      <span className="text-slate-400">Direct Labor:</span> ${cb.laborCost}
                    </div>
                    <div>
                      <span className="text-slate-400">Overhead:</span> ${cb.overheadCost}
                    </div>
                    <div>
                      <span className="text-slate-400">Target Margin:</span> {cb.marginPct}%
                    </div>
                    <div>
                      <span className="text-slate-400">Unit Price:</span> ${cb.unitPrice}
                    </div>
                    <div>
                      <span className="text-slate-400">Qty:</span> {cb.qty} PCS
                    </div>
                    <div className="font-bold text-emerald-400">
                      <span className="text-slate-400">Line Total:</span> ${cb.lineTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Revision History */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-400" />
                Audit Trail & Version Snapshots
              </h4>

              {selectedQuotationForDetails.revisionsHistory && selectedQuotationForDetails.revisionsHistory.length > 0 ? (
                <div className="space-y-2">
                  {selectedQuotationForDetails.revisionsHistory.map((rev, idx) => (
                    <div key={idx} className="bg-[#090d16] p-3 rounded-lg border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="font-bold text-purple-400">Snapshot Rev {rev.revisionNumber}</span>
                        <span>{rev.revisedAt} by {rev.revisedBy}</span>
                      </div>
                      <p className="text-slate-300">{rev.reason}</p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Prior Subtotal: ${rev.previousSubtotal.toLocaleString()} | Prior Total: ${rev.previousTotal.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic py-2">
                  Initial version (Rev 1). No previous revisions recorded.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedQuotationForDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REVISE QUOTATION */}
      {selectedQuotationForRevision && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400" />
                  Initiate Revision for {selectedQuotationForRevision.quotationNumber}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Creates Rev {selectedQuotationForRevision.revisionNumber + 1} and archives previous terms.
                </p>
              </div>
              <button
                onClick={() => setSelectedQuotationForRevision(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteRevision} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Revision Justification / Client Feedback *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Client requested 6% price concession against commitment to increase order batch from 500 to 1,000 units..."
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedQuotationForRevision(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md shadow-purple-900/20"
                >
                  Confirm & Generate Rev {selectedQuotationForRevision.revisionNumber + 1}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

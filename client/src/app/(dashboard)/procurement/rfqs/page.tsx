'use client';

import React, { useState } from 'react';
import {
  Scale,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  X,
  Building2,
  DollarSign,
  Award,
  Layers,
  ChevronRight,
  Star,
  FileText,
} from 'lucide-react';
import {
  RequestForQuotationItem,
  SupplierBidItem,
  RFQStatus,
  BidStatus,
} from '@/types/procurement';

const INITIAL_RFQS: RequestForQuotationItem[] = [
  {
    id: 'rfq-1',
    rfqNumber: 'RFQ-2026-0041',
    title: 'High-Tensile Fasteners & Grade 8.8 Hex Bolts (Q4 Demand)',
    status: 'EVALUATION',
    deadlineDate: '2026-10-10',
    targetDeliveryDate: '2026-10-25',
    paymentTerms: 'NET_30',
    deliveryTerms: 'FOB MIDC Chakan, Pune',
    items: [
      {
        itemSku: 'FAST-HEX-M16-88',
        itemName: 'High-Tensile Zinc Flake Hex Bolt M16x60mm Gr 8.8',
        requiredQty: 10000,
        uom: 'PCS',
        targetPrice: 0.42,
        technicalSpecs: 'DIN 933, Geomet 500B coating, 720hr salt spray test',
      },
    ],
    createdBy: 'Pooja Kulkarni (Procurement)',
    bids: [
      {
        id: 'bid-1',
        rfqId: 'rfq-1',
        vendorName: 'Apex Fasteners & Hardware Ltd',
        vendorEmail: 'sales@apexfasteners.com',
        vendorPhone: '+91 98201 55667',
        bidAmountTotal: 3950,
        quotedItems: [
          {
            itemSku: 'FAST-HEX-M16-88',
            itemName: 'High-Tensile Hex Bolt M16x60mm Gr 8.8',
            offeredQty: 10000,
            unitPrice: 0.395,
            lineTotal: 3950,
            leadTimeDays: 10,
            complianceNotes: 'Full Geomet 500B certified with mill test report',
          },
        ],
        paymentTermsOffered: 'NET_30',
        validUntilDate: '2026-10-31',
        status: 'UNDER_REVIEW',
        evaluationScore: 94.5,
        negotiationNotes: 'Lowest cost offered, exceeds salt spray test standard.',
      },
      {
        id: 'bid-2',
        rfqId: 'rfq-1',
        vendorName: 'Sundram Fasteners Automotive',
        vendorEmail: 'orders@sundram.com',
        vendorPhone: '+91 98400 12890',
        bidAmountTotal: 4100,
        quotedItems: [
          {
            itemSku: 'FAST-HEX-M16-88',
            itemName: 'High-Tensile Hex Bolt M16x60mm Gr 8.8',
            offeredQty: 10000,
            unitPrice: 0.41,
            lineTotal: 4100,
            leadTimeDays: 7,
            complianceNotes: 'OEM tier-1 certified, batch barcode traceability',
          },
        ],
        paymentTermsOffered: 'NET_45',
        validUntilDate: '2026-10-31',
        status: 'UNDER_REVIEW',
        evaluationScore: 96.0,
        negotiationNotes: 'Faster lead time (7 days) and favorable NET 45 terms.',
      },
      {
        id: 'bid-3',
        rfqId: 'rfq-1',
        vendorName: 'Sterling Precision Bolts Pvt',
        vendorEmail: 'quotes@sterlingbolts.in',
        vendorPhone: '+91 97110 44556',
        bidAmountTotal: 4400,
        quotedItems: [
          {
            itemSku: 'FAST-HEX-M16-88',
            itemName: 'High-Tensile Hex Bolt M16x60mm Gr 8.8',
            offeredQty: 10000,
            unitPrice: 0.44,
            lineTotal: 4400,
            leadTimeDays: 14,
            complianceNotes: 'Standard zinc electroplating',
          },
        ],
        paymentTermsOffered: 'NET_15',
        validUntilDate: '2026-10-25',
        status: 'REJECTED',
        evaluationScore: 78.0,
        negotiationNotes: 'Price above target and does not meet Geomet coating spec.',
      },
    ],
  },
  {
    id: 'rfq-2',
    rfqNumber: 'RFQ-2026-0044',
    title: 'Precision Seamless Hydraulic Tubes 60mm & 80mm',
    status: 'PUBLISHED',
    deadlineDate: '2026-10-12',
    targetDeliveryDate: '2026-10-28',
    paymentTerms: 'NET_30',
    deliveryTerms: 'FOB Plant Dock, Pune',
    items: [
      {
        itemSku: 'TUBE-HYD-SEAM-60',
        itemName: 'Seamless Cold Drawn Hydraulic Steel Tubes 60mm OD',
        requiredQty: 600,
        uom: 'MTRS',
        targetPrice: 28.5,
        technicalSpecs: 'EN 10305-4 E235+N, Eddy current tested, oiled & capped',
      },
    ],
    createdBy: 'Nitin Pawar (Senior Sourcing)',
    bids: [
      {
        id: 'bid-4',
        rfqId: 'rfq-2',
        vendorName: 'ISMT Steel Pipes Ltd',
        vendorEmail: 'sales@ismt.co.in',
        vendorPhone: '+91 98220 89123',
        bidAmountTotal: 16800,
        quotedItems: [
          {
            itemSku: 'TUBE-HYD-SEAM-60',
            itemName: 'Seamless Cold Drawn Hydraulic Tubes 60mm',
            offeredQty: 600,
            unitPrice: 28.0,
            lineTotal: 16800,
            leadTimeDays: 12,
            complianceNotes: 'EN 10305-4 certified with 3.1 inspection certificate',
          },
        ],
        paymentTermsOffered: 'NET_30',
        validUntilDate: '2026-10-31',
        status: 'SUBMITTED',
        evaluationScore: 92.0,
      },
    ],
  },
];

export default function RFQWorkspacePage() {
  const [rfqs, setRFQs] = useState<RequestForQuotationItem[]>(INITIAL_RFQS);
  const [selectedRFQ, setSelectedRFQ] = useState<RequestForQuotationItem>(INITIAL_RFQS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateRFQModalOpen, setIsCreateRFQModalOpen] = useState(false);
  const [isSubmitBidModalOpen, setIsSubmitBidModalOpen] = useState(false);
  const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<SupplierBidItem | null>(null);

  // Forms
  const [newRFQ, setNewRFQ] = useState({
    title: '',
    deadlineDate: '2026-10-15',
    targetDeliveryDate: '2026-10-30',
    paymentTerms: 'NET_30',
    deliveryTerms: 'FOB Plant MIDC Chakan',
    itemSku: '',
    itemName: '',
    requiredQty: 500,
    uom: 'PCS',
    targetPrice: 25,
    technicalSpecs: '',
    createdBy: 'Procurement Specialist',
  });

  const [newBid, setNewBid] = useState({
    vendorName: '',
    vendorEmail: '',
    vendorPhone: '',
    unitPrice: 24,
    offeredQty: 500,
    leadTimeDays: 10,
    paymentTermsOffered: 'NET_30',
    validUntilDate: '2026-11-15',
    complianceNotes: '',
  });

  const [evalScore, setEvalScore] = useState(95);
  const [negotiationNotes, setNegotiationNotes] = useState('');

  const handleCreateRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    const count = rfqs.length + 1;
    const rfqNumber = `RFQ-2026-00${count < 10 ? '0' + count : count}`;

    const created: RequestForQuotationItem = {
      id: `rfq-${Date.now()}`,
      rfqNumber,
      title: newRFQ.title,
      status: 'PUBLISHED',
      deadlineDate: newRFQ.deadlineDate,
      targetDeliveryDate: newRFQ.targetDeliveryDate,
      paymentTerms: newRFQ.paymentTerms,
      deliveryTerms: newRFQ.deliveryTerms,
      items: [
        {
          itemSku: newRFQ.itemSku,
          itemName: newRFQ.itemName,
          requiredQty: newRFQ.requiredQty,
          uom: newRFQ.uom,
          targetPrice: newRFQ.targetPrice,
          technicalSpecs: newRFQ.technicalSpecs,
        },
      ],
      createdBy: newRFQ.createdBy,
      bids: [],
    };

    setRFQs([created, ...rfqs]);
    setSelectedRFQ(created);
    setIsCreateRFQModalOpen(false);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRFQ) return;

    const lineTotal = newBid.offeredQty * newBid.unitPrice;
    const createdBid: SupplierBidItem = {
      id: `bid-${Date.now()}`,
      rfqId: selectedRFQ.id,
      vendorName: newBid.vendorName,
      vendorEmail: newBid.vendorEmail,
      vendorPhone: newBid.vendorPhone,
      bidAmountTotal: lineTotal,
      quotedItems: [
        {
          itemSku: selectedRFQ.items[0]?.itemSku || 'SKU-001',
          itemName: selectedRFQ.items[0]?.itemName || 'Material Item',
          offeredQty: newBid.offeredQty,
          unitPrice: newBid.unitPrice,
          lineTotal,
          leadTimeDays: newBid.leadTimeDays,
          complianceNotes: newBid.complianceNotes,
        },
      ],
      paymentTermsOffered: newBid.paymentTermsOffered,
      validUntilDate: newBid.validUntilDate,
      status: 'SUBMITTED',
      evaluationScore: 90,
      negotiationNotes: 'Newly submitted quote awaiting review.',
    };

    const updatedBids = [...(selectedRFQ.bids || []), createdBid];
    const updatedRFQ = { ...selectedRFQ, bids: updatedBids, status: 'EVALUATION' as RFQStatus };

    setSelectedRFQ(updatedRFQ);
    setRFQs((prev) => prev.map((r) => (r.id === selectedRFQ.id ? updatedRFQ : r)));
    setIsSubmitBidModalOpen(false);
  };

  const handleAwardBid = (bid: SupplierBidItem) => {
    const updatedBids = (selectedRFQ.bids || []).map((b) =>
      b.id === bid.id
        ? { ...b, status: 'ACCEPTED' as BidStatus }
        : { ...b, status: 'REJECTED' as BidStatus },
    );
    const updatedRFQ = {
      ...selectedRFQ,
      status: 'AWARDED' as RFQStatus,
      bids: updatedBids,
    };

    setSelectedRFQ(updatedRFQ);
    setRFQs((prev) => prev.map((r) => (r.id === selectedRFQ.id ? updatedRFQ : r)));
    alert(`RFQ ${selectedRFQ.rfqNumber} successfully awarded to ${bid.vendorName}! Generated PO in draft.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Scale className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              RFQ Workspace & Supplier Bid Comparison Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish competitive sourcing tenders, benchmark multi-supplier quotations, evaluate delivery lead times, and award purchase agreements.
          </p>
        </div>

        <button
          onClick={() => setIsCreateRFQModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Publish New RFQ
        </button>
      </div>

      {/* Main Grid: RFQ Selector & Bid Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: RFQs Directory */}
        <div className="rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Active Sourcing RFQs</h3>
            <span className="text-[11px] text-purple-600 dark:text-purple-400">{rfqs.length} Tenders</span>
          </div>

          <div className="space-y-2">
            {rfqs.map((rfq) => {
              const isSelected = selectedRFQ.id === rfq.id;
              return (
                <div
                  key={rfq.id}
                  onClick={() => setSelectedRFQ(rfq)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-400 dark:border-purple-500/50 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{rfq.rfqNumber}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                      {rfq.status}
                    </span>
                  </div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{rfq.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <span>{rfq.bids?.length || 0} Quotes Received</span>
                    <span className="text-rose-600 dark:text-rose-400 font-medium">Due: {rfq.deadlineDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Bid Comparison Matrix for Selected RFQ */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 p-5 space-y-5 shadow-sm">
          {/* RFQ Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white">{selectedRFQ.rfqNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                  {selectedRFQ.status}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedRFQ.title}</h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Target: {selectedRFQ.items[0]?.requiredQty} {selectedRFQ.items[0]?.uom} @ target ${selectedRFQ.items[0]?.targetPrice} | Terms: {selectedRFQ.paymentTerms}
              </div>
            </div>

            <button
              onClick={() => setIsSubmitBidModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" /> Log Supplier Quote
            </button>
          </div>

          {/* Supplier Quotes Comparison Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Supplier Pricing & Terms Evaluation Matrix ({selectedRFQ.bids?.length || 0} Bids)
            </h3>

            {(!selectedRFQ.bids || selectedRFQ.bids.length === 0) ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No supplier bids logged yet for this RFQ. Click "Log Supplier Quote" to register a quote.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Supplier Name</th>
                      <th className="py-2.5 px-3">Quoted Unit Price</th>
                      <th className="py-2.5 px-3">Total Bid Amount</th>
                      <th className="py-2.5 px-3">Lead Time</th>
                      <th className="py-2.5 px-3">Terms</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3 text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300 font-normal">
                    {selectedRFQ.bids.map((bid) => {
                      const isWinning = bid.status === 'ACCEPTED';
                      return (
                        <tr
                          key={bid.id}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                            isWinning ? 'bg-emerald-50/60 dark:bg-emerald-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900 dark:text-white">{bid.vendorName}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{bid.vendorEmail}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">
                            ${bid.quotedItems[0]?.unitPrice}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            ${bid.bidAmountTotal.toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-medium text-amber-600 dark:text-amber-400">
                              {bid.quotedItems[0]?.leadTimeDays} days
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                            {bid.paymentTermsOffered}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                              {bid.evaluationScore}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {selectedRFQ.status !== 'AWARDED' ? (
                              <button
                                onClick={() => handleAwardBid(bid)}
                                className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-semibold text-[11px] transition-all"
                              >
                                Award Contract
                              </button>
                            ) : isWinning ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1">
                                <Award className="h-4 w-4" /> Awarded
                              </span>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 italic">Not Selected</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Create RFQ */}
      {isCreateRFQModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Scale className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Create Request for Quotation (RFQ)</h3>
              </div>
              <button
                onClick={() => setIsCreateRFQModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRFQ} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1">RFQ Tender Title *</label>
                <input
                  type="text"
                  required
                  value={newRFQ.title}
                  onChange={(e) => setNewRFQ({ ...newRFQ, title: e.target.value })}
                  placeholder="e.g. Sourcing High-Tensile Grade 8.8 Hex Bolts"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Bid Closing Deadline *</label>
                  <input
                    type="date"
                    required
                    value={newRFQ.deadlineDate}
                    onChange={(e) => setNewRFQ({ ...newRFQ, deadlineDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Target Delivery Date *</label>
                  <input
                    type="date"
                    required
                    value={newRFQ.targetDeliveryDate}
                    onChange={(e) => setNewRFQ({ ...newRFQ, targetDeliveryDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Material SKU *</label>
                  <input
                    type="text"
                    required
                    value={newRFQ.itemSku}
                    onChange={(e) => setNewRFQ({ ...newRFQ, itemSku: e.target.value })}
                    placeholder="FAST-HEX-M16-88"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Material Description *</label>
                  <input
                    type="text"
                    required
                    value={newRFQ.itemName}
                    onChange={(e) => setNewRFQ({ ...newRFQ, itemName: e.target.value })}
                    placeholder="Hex Bolt M16x60mm Gr 8.8"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Required Qty *</label>
                  <input
                    type="number"
                    required
                    value={newRFQ.requiredQty}
                    onChange={(e) => setNewRFQ({ ...newRFQ, requiredQty: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">UOM</label>
                  <input
                    type="text"
                    value={newRFQ.uom}
                    onChange={(e) => setNewRFQ({ ...newRFQ, uom: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Target Price ($)</label>
                  <input
                    type="number"
                    value={newRFQ.targetPrice}
                    onChange={(e) => setNewRFQ({ ...newRFQ, targetPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1">Technical Specs & Testing Requirements</label>
                <textarea
                  rows={2}
                  value={newRFQ.technicalSpecs}
                  onChange={(e) => setNewRFQ({ ...newRFQ, technicalSpecs: e.target.value })}
                  placeholder="e.g. DIN 933, 720hr salt spray resistance, mill test certificate..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRFQModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Publish Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Supplier Quote */}
      {isSubmitBidModalOpen && selectedRFQ && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <DollarSign className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Log Supplier Bid Quote ({selectedRFQ.rfqNumber})</h3>
              </div>
              <button
                onClick={() => setIsSubmitBidModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Supplier Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newBid.vendorName}
                    onChange={(e) => setNewBid({ ...newBid, vendorName: e.target.value })}
                    placeholder="e.g. Precision Bolts Ltd"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Supplier Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={newBid.vendorEmail}
                    onChange={(e) => setNewBid({ ...newBid, vendorEmail: e.target.value })}
                    placeholder="sales@vendor.com"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Offered Unit Price ($) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={newBid.unitPrice}
                    onChange={(e) => setNewBid({ ...newBid, unitPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Offered Qty *</label>
                  <input
                    type="number"
                    required
                    value={newBid.offeredQty}
                    onChange={(e) => setNewBid({ ...newBid, offeredQty: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Lead Time (Days) *</label>
                  <input
                    type="number"
                    required
                    value={newBid.leadTimeDays}
                    onChange={(e) => setNewBid({ ...newBid, leadTimeDays: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Payment Terms Offered</label>
                  <input
                    type="text"
                    value={newBid.paymentTermsOffered}
                    onChange={(e) => setNewBid({ ...newBid, paymentTermsOffered: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Quote Valid Until *</label>
                  <input
                    type="date"
                    required
                    value={newBid.validUntilDate}
                    onChange={(e) => setNewBid({ ...newBid, validUntilDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1">Specification Compliance Notes</label>
                <textarea
                  rows={2}
                  value={newBid.complianceNotes}
                  onChange={(e) => setNewBid({ ...newBid, complianceNotes: e.target.value })}
                  placeholder="Detail test certificates, packaging specs..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitBidModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Log Bid Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

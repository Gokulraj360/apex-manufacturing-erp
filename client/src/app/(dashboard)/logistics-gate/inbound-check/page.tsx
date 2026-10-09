'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Truck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowLeft,
  X,
  Layers,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { InboundTransportCheckItem } from '@/types/logistics-gate';

const INITIAL_INBOUND_CHECKS: InboundTransportCheckItem[] = [
  {
    id: 'inb-1',
    vehicleNumber: 'MH-12-RN-8821',
    driverName: 'Vikram Rajput',
    transporterName: 'Vanguard Freight Logistics',
    purchaseOrderId: 'po-2026-089',
    lrNumber: 'LR-VAN-99201',
    invoiceOrDcNumber: 'INV-RAW-8812',
    sealIntact: true,
    sealNumber: 'SEAL-STEEL-4401',
    physicalDamageObserved: false,
    grossWeightKg: 28450,
    tareWeightKg: 10200,
    netWeightKg: 18250,
    entryTimestamp: '2026-10-07 09:15',
    exitTimestamp: '2026-10-07 10:45',
    verifiedByGuardId: 'usr-guard-01',
    weighbridgeOperatorId: 'usr-wb-02',
    createdAt: '2026-10-07 09:15',
    updatedAt: '2026-10-07 10:45',
    purchaseOrder: {
      id: 'po-2026-089',
      poNumber: 'PO-2026-089',
      vendorName: 'Apex Steel & Alloys Corp',
      totalAmount: 1450000,
    },
  },
  {
    id: 'inb-2',
    vehicleNumber: 'KA-04-TR-4421',
    driverName: 'Suresh Kumar',
    transporterName: 'Express Blue Haulage',
    purchaseOrderId: 'po-2026-092',
    lrNumber: 'LR-BLU-10294',
    invoiceOrDcNumber: 'DC-POLY-9923',
    sealIntact: true,
    sealNumber: 'SEAL-POLY-8891',
    physicalDamageObserved: false,
    grossWeightKg: 19800,
    tareWeightKg: undefined,
    netWeightKg: undefined,
    entryTimestamp: '2026-10-07 11:10',
    verifiedByGuardId: 'usr-guard-02',
    weighbridgeOperatorId: 'usr-wb-02',
    createdAt: '2026-10-07 11:10',
    updatedAt: '2026-10-07 11:10',
    purchaseOrder: {
      id: 'po-2026-092',
      poNumber: 'PO-2026-092',
      vendorName: 'Polymer Granules Pvt Ltd',
      totalAmount: 620000,
    },
  },
  {
    id: 'inb-3',
    vehicleNumber: 'GJ-06-XX-3341',
    driverName: 'Jatin Solanki',
    transporterName: 'Gujarat Fast Cargo',
    purchaseOrderId: 'po-2026-094',
    lrNumber: 'LR-GFC-55092',
    invoiceOrDcNumber: 'INV-CHEM-7731',
    sealIntact: false,
    sealNumber: 'SEAL-BROKEN-901',
    physicalDamageObserved: true,
    damageNotes: 'Container lock latch loosened in transit; outer barrel dented.',
    grossWeightKg: 14200,
    tareWeightKg: undefined,
    netWeightKg: undefined,
    entryTimestamp: '2026-10-07 11:45',
    verifiedByGuardId: 'usr-guard-01',
    createdAt: '2026-10-07 11:45',
    updatedAt: '2026-10-07 11:45',
    purchaseOrder: {
      id: 'po-2026-094',
      poNumber: 'PO-2026-094',
      vendorName: 'Chemical Specialties Ltd',
      totalAmount: 480000,
    },
  },
];

export default function InboundCheckPage() {
  const [inboundList, setInboundList] = useState<InboundTransportCheckItem[]>(INITIAL_INBOUND_CHECKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWeighModalOpen, setIsWeighModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<InboundTransportCheckItem | null>(null);

  // Weighbridge update form
  const [tareInput, setTareInput] = useState<number | ''>('');
  const [grossInput, setGrossInput] = useState<number | ''>('');

  const openWeighbridgeModal = (record: InboundTransportCheckItem) => {
    setSelectedRecord(record);
    setGrossInput(record.grossWeightKg || '');
    setTareInput(record.tareWeightKg || '');
    setIsWeighModalOpen(true);
  };

  const handleSaveWeighbridge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const gross = Number(grossInput) || 0;
    const tare = Number(tareInput) || 0;
    const net = tare > 0 && gross >= tare ? gross - tare : undefined;

    setInboundList((prev) =>
      prev.map((item) =>
        item.id === selectedRecord.id
          ? {
              ...item,
              grossWeightKg: gross,
              tareWeightKg: tare > 0 ? tare : undefined,
              netWeightKg: net,
              exitTimestamp: tare > 0 ? new Date().toISOString().replace('T', ' ').substring(0, 16) : item.exitTimestamp,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
    setIsWeighModalOpen(false);
  };

  const filteredList = inboundList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.vehicleNumber.toLowerCase().includes(q) ||
      item.lrNumber.toLowerCase().includes(q) ||
      item.invoiceOrDcNumber.toLowerCase().includes(q) ||
      (item.purchaseOrder?.poNumber && item.purchaseOrder.poNumber.toLowerCase().includes(q)) ||
      item.transporterName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/logistics-gate" className="hover:text-cyan-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Logistics
            </Link>
            <span>/</span>
            <span className="text-slate-200">Inbound Transport & Weighbridge</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Scale className="h-6 w-6 text-cyan-400" />
            Inbound PO Transport Verification & Weighbridge
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Cross-check transport documents with Purchase Orders, record calibrated weighbridge Gross/Tare, and verify tamper seals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
            <Scale className="h-4 w-4 text-blue-400" />
            <span>Weighbridge Pit #01: Calibrated (Zero-Balanced)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1322] border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1 sm:w-80">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search PO #, vehicle plate, LR #, or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Tare Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Gross Recorded (Awaiting Empty Tare)</span>
          </div>
        </div>
      </div>

      {/* Transport Records Grid / Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-3 font-semibold">Vehicle & Carrier</th>
                <th className="py-3 px-3 font-semibold">Matched Purchase Order</th>
                <th className="py-3 px-3 font-semibold">LR & Invoice / Challan</th>
                <th className="py-3 px-3 font-semibold">Seal Integrity</th>
                <th className="py-3 px-3 font-semibold">Gross Weight (kg)</th>
                <th className="py-3 px-3 font-semibold">Tare Weight (kg)</th>
                <th className="py-3 px-3 font-semibold">Net Weight (kg)</th>
                <th className="py-3 px-3 font-semibold">Status / Timestamps</th>
                <th className="py-3 px-3 font-semibold text-right">Weighbridge Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white tracking-wide">{item.vehicleNumber}</div>
                    <div className="text-[10px] text-slate-400">{item.transporterName}</div>
                    <div className="text-[10px] text-slate-500">Driver: {item.driverName}</div>
                  </td>
                  <td className="py-3 px-3">
                    {item.purchaseOrder ? (
                      <div>
                        <span className="font-mono text-cyan-300 font-semibold">{item.purchaseOrder.poNumber}</span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{item.purchaseOrder.vendorName}</div>
                        <div className="text-[9px] text-emerald-400">PO Total: ₹{item.purchaseOrder.totalAmount?.toLocaleString()}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">No PO Attached</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="text-slate-200">LR: {item.lrNumber}</div>
                    <div className="text-[10px] text-slate-400">Doc: {item.invoiceOrDcNumber}</div>
                  </td>
                  <td className="py-3 px-3">
                    {item.sealIntact ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                          <ShieldCheck className="h-3 w-3" />
                          Intact
                        </span>
                        {item.sealNumber && <div className="text-[9px] font-mono text-slate-400 mt-0.5">{item.sealNumber}</div>}
                      </div>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 font-semibold">
                          <ShieldAlert className="h-3 w-3" />
                          Broken / Missing
                        </span>
                        {item.damageNotes && (
                          <div className="text-[9px] text-red-400 mt-0.5 max-w-[140px] truncate" title={item.damageNotes}>
                            {item.damageNotes}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {item.grossWeightKg ? (
                      <span className="text-white font-medium">{item.grossWeightKg.toLocaleString()} kg</span>
                    ) : (
                      <span className="text-slate-500">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {item.tareWeightKg ? (
                      <span className="text-slate-300">{item.tareWeightKg.toLocaleString()} kg</span>
                    ) : (
                      <span className="text-amber-400 text-[10px]">Awaiting Exit Tare</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {item.netWeightKg ? (
                      <span className="text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {item.netWeightKg.toLocaleString()} kg
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">&mdash;</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[10px]">
                    <div className="text-slate-300">In: {item.entryTimestamp}</div>
                    {item.exitTimestamp ? (
                      <div className="text-emerald-400">Out: {item.exitTimestamp}</div>
                    ) : (
                      <div className="text-amber-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-2.5 w-2.5" /> Unloading in progress
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => openWeighbridgeModal(item)}
                      className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium inline-flex items-center gap-1"
                    >
                      <Scale className="h-3 w-3" />
                      {item.tareWeightKg ? 'Edit Weight' : 'Record Tare'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weighbridge Modal */}
      {isWeighModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">Weighbridge Scale Calibration Entry</h3>
              </div>
              <button
                onClick={() => setIsWeighModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="text-white font-bold">{selectedRecord.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PO Number:</span>
                <span className="text-cyan-300 font-mono">{selectedRecord.purchaseOrder?.poNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vendor:</span>
                <span className="text-slate-200">{selectedRecord.purchaseOrder?.vendorName || selectedRecord.transporterName}</span>
              </div>
            </div>

            <form onSubmit={handleSaveWeighbridge} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Gross Weight (kg) - Inbound Loaded *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 28000"
                    value={grossInput}
                    onChange={(e) => setGrossInput(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tare Weight (kg) - Outbound Empty
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 10200"
                    value={tareInput}
                    onChange={(e) => setTareInput(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Live Net Weight Display */}
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Computed Net Material Weight</span>
                  <span className="text-[10px] text-cyan-300">Net = Gross Weight &minus; Tare Weight</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-cyan-300">
                    {Number(grossInput) && Number(tareInput) && Number(grossInput) >= Number(tareInput)
                      ? `${(Number(grossInput) - Number(tareInput)).toLocaleString()} kg`
                      : '--- kg'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWeighModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-md shadow-cyan-600/30"
                >
                  Save Calibrated Readings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

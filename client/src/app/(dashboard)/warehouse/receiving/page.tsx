'use client';

import React, { useState } from 'react';
import {
  Truck,
  FileCheck2,
  CheckCircle,
  AlertOctagon,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { GrnItem } from '@/types/warehouse';

const initialGrns: GrnItem[] = [
  {
    id: 'grn-1',
    grnNumber: 'GRN-2026-0440',
    poNumber: 'PO-2026-9042',
    supplierName: 'Apex Metallurgy Corp',
    receivedDate: '2026-10-06 11:20:00',
    inspectedBy: 'QA Inspector Jenkins',
    inspectionPassed: true,
    storageBinCode: 'ZONE-A-RACK-01-S1',
    vendorDeliveryChallan: 'AMC-DC-8812',
    remarks: '40 Metric Tons of aerospace alloy ingots inspected. Mill test certificates verified.',
    itemsReceived: [
      { itemCode: 'PART-TI-TUBE-01', itemName: 'Extruded Seamless Titanium Tube', quantityOrdered: 500, quantityReceived: 500, quantityAccepted: 500, quantityRejected: 0, uom: 'EA' },
    ],
  },
  {
    id: 'grn-2',
    grnNumber: 'GRN-2026-0441',
    poNumber: 'PO-2026-9045',
    supplierName: 'Siemens Industrial Automation',
    receivedDate: '2026-10-07 09:15:00',
    inspectedBy: 'Lead Technician Diaz',
    inspectionPassed: true,
    storageBinCode: 'ZONE-C-RACK-02-A1',
    vendorDeliveryChallan: 'SIA-CHALLAN-901',
    remarks: 'Emergency CNC high-torque drive spindles for Line 4. Serial numbers checked.',
    itemsReceived: [
      { itemCode: 'PART-SPINDLE-HAAS-MOTOR', itemName: 'Simotics S-1FK7 Spindle Motor', quantityOrdered: 4, quantityReceived: 4, quantityAccepted: 4, quantityRejected: 0, uom: 'EA' },
    ],
  },
  {
    id: 'grn-3',
    grnNumber: 'GRN-2026-0438',
    poNumber: 'PO-2026-8990',
    supplierName: 'Global Chemical Solutions',
    receivedDate: '2026-09-28 14:05:00',
    inspectedBy: 'Chemical Safety Officer Rao',
    inspectionPassed: false,
    storageBinCode: 'ZONE-C-QUARANTINE-01',
    vendorDeliveryChallan: 'GCS-BOL-449',
    remarks: 'Quantity discrepancy: Ordered 15 Barrels, delivery truck only carried 12. Rejected 3 missing.',
    itemsReceived: [
      { itemCode: 'PART-COOLANT-SYNTH', itemName: 'Synthetic CNC Coolant', quantityOrdered: 15, quantityReceived: 12, quantityAccepted: 12, quantityRejected: 3, uom: 'DRUM', rejectionReason: 'Carrier Shortage at Dock' },
    ],
  },
];

export default function ReceivingDockPage() {
  const [grns, setGrns] = useState<GrnItem[]>(initialGrns);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [form, setForm] = useState({
    poNumber: 'PO-2026-9048',
    supplierName: 'Parker Hannifin Pneumatics',
    itemCode: 'PART-VALVE-PNEUMATIC-12',
    itemName: 'Industrial Solenoid Air Valve',
    quantityOrdered: 100,
    quantityReceived: 100,
    quantityAccepted: 98,
    quantityRejected: 2,
    rejectionReason: 'Minor thread galling on port B',
    storageBinCode: 'ZONE-A-RACK-02-B1',
    vendorDeliveryChallan: 'PH-BOL-771',
    remarks: 'Visual and pneumatic seal pressure testing completed at Receiving Dock #02.',
  });

  const handleCreateGrn = (e: React.FormEvent) => {
    e.preventDefault();

    const newGrn: GrnItem = {
      id: `grn-${Date.now()}`,
      grnNumber: `GRN-2026-0${grns.length + 442}`,
      poNumber: form.poNumber,
      supplierName: form.supplierName,
      receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      inspectedBy: 'QA Inspector Jenkins',
      inspectionPassed: form.quantityRejected === 0,
      storageBinCode: form.storageBinCode,
      vendorDeliveryChallan: form.vendorDeliveryChallan,
      remarks: form.remarks,
      itemsReceived: [
        {
          itemCode: form.itemCode,
          itemName: form.itemName,
          quantityOrdered: Number(form.quantityOrdered),
          quantityReceived: Number(form.quantityReceived),
          quantityAccepted: Number(form.quantityAccepted),
          quantityRejected: Number(form.quantityRejected),
          uom: 'EA',
          rejectionReason: form.rejectionReason,
        },
      ],
    };

    setGrns([newGrn, ...grns]);
    setShowInspectionModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Truck className="h-6 w-6 text-amber-400" />
            Receiving Dock Inspection & Goods Received Note (GRN)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Inspection portal for supplier delivery verification against Purchase Orders, quality acceptance, and bin putaway.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInspectionModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> Log Inbound Delivery Inspection
        </button>
      </div>

      {/* GRN Ledger Table */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Verified Goods Received Notes (GRN Ledger)
          </span>
          <span className="text-xs text-slate-400">{grns.length} Received Shipments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">GRN Number</th>
                <th className="py-3 px-4">PO Reference</th>
                <th className="py-3 px-4">Supplier Enterprise</th>
                <th className="py-3 px-4">Received Date</th>
                <th className="py-3 px-4">Inspected Items</th>
                <th className="py-3 px-4">Putaway Bin</th>
                <th className="py-3 px-4">QA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {grns.map((grn) => {
                const isPassed = grn.inspectionPassed;

                return (
                  <tr key={grn.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {grn.grnNumber}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-blue-400">
                      {grn.poNumber}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-200">
                      <div>{grn.supplierName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Challan: {grn.vendorDeliveryChallan}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {grn.receivedDate}
                    </td>

                    <td className="py-3 px-4">
                      {grn.itemsReceived.map((item, idx) => (
                        <div key={idx} className="font-mono text-[11px]">
                          <strong className="text-white">{item.quantityAccepted}</strong> of {item.quantityReceived} {item.uom} accepted
                          {item.quantityRejected > 0 && (
                            <span className="text-red-400 ml-1">({item.quantityRejected} rejected)</span>
                          )}
                        </div>
                      ))}
                    </td>

                    <td className="py-3 px-4 font-mono text-cyan-400 text-[11px]">
                      {grn.storageBinCode}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isPassed
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {isPassed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {isPassed ? 'Passed & Ingested' : 'Variance Hold'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Inbound Inspection */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-[#0f172a] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-amber-400" />
                Dock Receiving Inspection & GRN Putaway
              </h3>
              <button
                type="button"
                onClick={() => setShowInspectionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateGrn} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Purchase Order #</label>
                  <input
                    type="text"
                    required
                    value={form.poNumber}
                    onChange={(e) => setForm({ ...form, poNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Supplier Enterprise</label>
                  <input
                    type="text"
                    required
                    value={form.supplierName}
                    onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Item Code</label>
                  <input
                    type="text"
                    required
                    value={form.itemCode}
                    onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Item Description</label>
                  <input
                    type="text"
                    required
                    value={form.itemName}
                    onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Quantity Received</label>
                  <input
                    type="number"
                    required
                    value={form.quantityReceived}
                    onChange={(e) => setForm({ ...form, quantityReceived: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Quantity Accepted</label>
                  <input
                    type="number"
                    required
                    value={form.quantityAccepted}
                    onChange={(e) => setForm({ ...form, quantityAccepted: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Quantity Rejected</label>
                  <input
                    type="number"
                    value={form.quantityRejected}
                    onChange={(e) => setForm({ ...form, quantityRejected: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Putaway Bin</label>
                  <input
                    type="text"
                    required
                    value={form.storageBinCode}
                    onChange={(e) => setForm({ ...form, storageBinCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Vendor Delivery Challan #</label>
                  <input
                    type="text"
                    value={form.vendorDeliveryChallan}
                    onChange={(e) => setForm({ ...form, vendorDeliveryChallan: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Inspection Remarks</label>
                <textarea
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold bg-amber-600 hover:bg-amber-500 text-white"
                >
                  Generate GRN & Auto-Putaway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

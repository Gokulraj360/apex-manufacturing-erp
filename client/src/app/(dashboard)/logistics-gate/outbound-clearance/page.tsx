'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Lock,
  ArrowLeft,
  X,
  BadgeCheck,
  ClipboardList,
  Printer,
} from 'lucide-react';
import { OutboundGateClearanceItem } from '@/types/logistics-gate';

const INITIAL_CLEARANCES: OutboundGateClearanceItem[] = [
  {
    id: 'clr-1',
    clearanceNumber: 'OGC-2026-081',
    vehicleNumber: 'MH-12-QW-9901',
    driverName: 'Harish Rawat',
    deliveryChallanId: 'dc-2026-018',
    dispatchShipmentId: 'shp-1',
    physicalCheckPassed: true,
    tamperEvidentSealNumber: 'SEAL-SEC-99012',
    loadVerificationNotes: '42 export cartons inspected against DC-2026-018. All seals intact.',
    clearanceTimestamp: '2026-10-07 11:15',
    clearedByGuardId: 'usr-guard-01',
    createdAt: '2026-10-07 11:15',
    updatedAt: '2026-10-07 11:15',
    deliveryChallan: {
      id: 'dc-2026-018',
      challanNumber: 'DC-2026-018',
      receiverName: 'Bharat Heavy Dynamics Ltd',
    },
    dispatchShipment: {
      id: 'shp-1',
      shipmentNumber: 'DSP-SHP-2026-042',
      destinationCity: 'Mumbai Port (Nhava Sheva)',
      carrierName: 'Vanguard Freight Logistics',
    },
  },
  {
    id: 'clr-2',
    clearanceNumber: 'OGC-2026-082',
    vehicleNumber: 'KA-04-AK-5509',
    driverName: 'Ramesh Patel',
    deliveryChallanId: 'dc-2026-019',
    dispatchShipmentId: 'shp-2',
    physicalCheckPassed: true,
    tamperEvidentSealNumber: 'SEAL-SEC-99015',
    loadVerificationNotes: '20 high-torque actuators loaded. High-security steel cable seal locked.',
    clearanceTimestamp: '2026-10-07 12:40',
    clearedByGuardId: 'usr-guard-03',
    createdAt: '2026-10-07 12:40',
    updatedAt: '2026-10-07 12:40',
    deliveryChallan: {
      id: 'dc-2026-019',
      challanNumber: 'DC-2026-019',
      receiverName: 'Siemens Precision India',
    },
    dispatchShipment: {
      id: 'shp-2',
      shipmentNumber: 'DSP-SHP-2026-043',
      destinationCity: 'Bengaluru Tech Corridor',
      carrierName: 'Express Blue Haulage',
    },
  },
];

export default function OutboundClearancePage() {
  const [clearances, setClearances] = useState<OutboundGateClearanceItem[]>(INITIAL_CLEARANCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New clearance form state
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    driverName: '',
    deliveryChallanNumber: '',
    receiverName: '',
    shipmentNumber: '',
    tamperEvidentSealNumber: '',
    physicalCheckPassed: true,
    loadVerificationNotes: '',
  });

  const handleIssueClearance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleNumber || !formData.tamperEvidentSealNumber) return;

    const newRecord: OutboundGateClearanceItem = {
      id: `clr-${Date.now()}`,
      clearanceNumber: `OGC-2026-0${83 + clearances.length}`,
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      driverName: formData.driverName || 'Verified Driver',
      physicalCheckPassed: formData.physicalCheckPassed,
      tamperEvidentSealNumber: formData.tamperEvidentSealNumber,
      loadVerificationNotes: formData.loadVerificationNotes || 'Full physical inspection cleared without variance.',
      clearanceTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      clearedByGuardId: 'usr-guard-main',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryChallan: {
        id: `dc-${Date.now()}`,
        challanNumber: formData.deliveryChallanNumber || 'DC-2026-GEN',
        receiverName: formData.receiverName || 'Consignee',
      },
      dispatchShipment: {
        id: `shp-${Date.now()}`,
        shipmentNumber: formData.shipmentNumber || 'DSP-SHP-GEN',
        carrierName: 'Authorized Transporter',
      },
    };

    setClearances([newRecord, ...clearances]);
    setIsModalOpen(false);
    setFormData({
      vehicleNumber: '',
      driverName: '',
      deliveryChallanNumber: '',
      receiverName: '',
      shipmentNumber: '',
      tamperEvidentSealNumber: '',
      physicalCheckPassed: true,
      loadVerificationNotes: '',
    });
  };

  const filtered = clearances.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.clearanceNumber.toLowerCase().includes(q) ||
      c.vehicleNumber.toLowerCase().includes(q) ||
      c.driverName.toLowerCase().includes(q) ||
      c.tamperEvidentSealNumber.toLowerCase().includes(q) ||
      (c.deliveryChallan?.challanNumber && c.deliveryChallan.challanNumber.toLowerCase().includes(q))
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
            <span className="text-slate-200">Outbound Gate Clearance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            Outbound Gate Clearances & Security Seals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reconcile Delivery Challans against truck physical loading and record tamper-evident security seal serials before departure.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/20 transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          Issue Gate Exit Clearance
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1322] border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1 sm:w-80">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search clearance #, vehicle, seal #, challan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Security Barrier Sync: Online</span>
        </div>
      </div>

      {/* Clearances Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-3 font-semibold">Clearance Pass #</th>
                <th className="py-3 px-3 font-semibold">Vehicle & Driver</th>
                <th className="py-3 px-3 font-semibold">Delivery Challan & Client</th>
                <th className="py-3 px-3 font-semibold">Dispatch Shipment</th>
                <th className="py-3 px-3 font-semibold">Security Seal Tag</th>
                <th className="py-3 px-3 font-semibold">Physical Check</th>
                <th className="py-3 px-3 font-semibold">Departure Timestamp</th>
                <th className="py-3 px-3 font-semibold text-right">Gate Pass Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((clr) => (
                <tr key={clr.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 font-mono">
                    <div className="text-emerald-400 font-bold">{clr.clearanceNumber}</div>
                    <span className="text-[10px] text-slate-500">Officer ID: {clr.clearedByGuardId}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white tracking-wide">{clr.vehicleNumber}</div>
                    <div className="text-[10px] text-slate-400">{clr.driverName}</div>
                  </td>
                  <td className="py-3 px-3">
                    {clr.deliveryChallan ? (
                      <div>
                        <div className="font-mono text-cyan-300 font-semibold">{clr.deliveryChallan.challanNumber}</div>
                        <div className="text-[10px] text-slate-400">{clr.deliveryChallan.receiverName}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">None</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {clr.dispatchShipment ? (
                      <div>
                        <div className="font-mono text-slate-200">{clr.dispatchShipment.shipmentNumber}</div>
                        <div className="text-[10px] text-slate-400">{clr.dispatchShipment.destinationCity || clr.dispatchShipment.carrierName}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">None</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                      <Lock className="h-3 w-3 text-amber-400" />
                      {clr.tamperEvidentSealNumber}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {clr.physicalCheckPassed ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 font-semibold">
                        <AlertTriangle className="h-3 w-3" />
                        Variance Found
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                    {clr.clearanceTimestamp}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Printing Official Departure Clearance Pass for ${clr.clearanceNumber}`)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium inline-flex items-center gap-1"
                    >
                      <Printer className="h-3 w-3 text-slate-400" />
                      Print Exit Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clearance Generation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Authorize Outbound Gate Exit Clearance</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleIssueClearance} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-12-QW-9901"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white uppercase focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Driver Name</label>
                  <input
                    type="text"
                    placeholder="Driver name"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Challan #</label>
                  <input
                    type="text"
                    placeholder="e.g. DC-2026-020"
                    value={formData.deliveryChallanNumber}
                    onChange={(e) => setFormData({ ...formData, deliveryChallanNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Client / Receiver</label>
                  <input
                    type="text"
                    placeholder="Client Company Name"
                    value={formData.receiverName}
                    onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tamper-Evident Seal Barcode # *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SEAL-SEC-99020"
                    value={formData.tamperEvidentSealNumber}
                    onChange={(e) => setFormData({ ...formData, tamperEvidentSealNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Dispatch Shipment Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. DSP-SHP-2026-045"
                    value={formData.shipmentNumber}
                    onChange={(e) => setFormData({ ...formData, shipmentNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <input
                  type="checkbox"
                  id="chkPhysical"
                  checked={formData.physicalCheckPassed}
                  onChange={(e) => setFormData({ ...formData, physicalCheckPassed: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="chkPhysical" className="text-xs text-slate-200 cursor-pointer">
                  Physical cargo count, container latch lock, and vehicle underside inspection passed.
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Guard Load Verification Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Notes on cartons, straps, container integrity..."
                  value={formData.loadVerificationNotes}
                  onChange={(e) => setFormData({ ...formData, loadVerificationNotes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/30"
                >
                  Authorize Gate Departure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

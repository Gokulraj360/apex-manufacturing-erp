'use client';

import React, { useState } from 'react';
import {
  Send,
  Truck,
  CheckCircle,
  Clock,
  Package,
  Plus,
  ArrowRight,
  FileText,
  Search,
  ExternalLink,
} from 'lucide-react';
import { DeliveryChallanItem } from '@/types/warehouse';

const initialChallans: DeliveryChallanItem[] = [
  {
    id: 'dc-1',
    challanNumber: 'DC-2026-0018',
    clientName: 'Lockheed Martin Defense Systems',
    salesOrderRef: 'SO-LM-9901',
    dispatchDate: '2026-10-07 14:00:00',
    carrierName: 'FedEx Custom Critical Freight',
    vehicleNumber: 'TX-COMM-4491',
    trackingNumber: 'TRK-FX-9041128',
    driverContact: '+1 (512) 555-0199',
    status: 'DISPATCHED',
    totalWeightKg: 1450.0,
    preparedBy: 'Dispatch Lead Harris',
    verifiedBy: 'Security Gate Post #01',
    dispatchedItems: [
      { itemCode: 'SKU-TITAN-X1', itemName: 'Titanium Truss Spacecraft Strut', quantityDispatched: 100, uom: 'EA', serialLots: 'LOT-FIN-9901 (SN 001 - 100)' },
    ],
  },
  {
    id: 'dc-2',
    challanNumber: 'DC-2026-0019',
    clientName: 'Tesla Gigafactory Texas',
    salesOrderRef: 'SO-TSLA-4412',
    dispatchDate: '2026-10-07 16:30:00',
    carrierName: 'Schneider National Dedicated',
    vehicleNumber: 'TX-COMM-8902',
    trackingNumber: 'TRK-SN-772109',
    driverContact: '+1 (737) 555-0482',
    status: 'PACKED',
    totalWeightKg: 2800.0,
    preparedBy: 'Dispatch Lead Harris',
    dispatchedItems: [
      { itemCode: 'SKU-FRAME-W2', itemName: 'Cast Aluminum EV Subframe', quantityDispatched: 200, uom: 'EA', serialLots: 'LOT-FIN-8812 (SN 201 - 400)' },
    ],
  },
  {
    id: 'dc-3',
    challanNumber: 'DC-2026-0020',
    clientName: 'Boeing Commercial Airplanes',
    salesOrderRef: 'SO-BA-1208',
    dispatchDate: '2026-10-08 09:00:00',
    carrierName: 'Old Dominion Freight Line',
    trackingNumber: 'TRK-OD-110294',
    status: 'PICKING',
    totalWeightKg: 680.0,
    preparedBy: 'Warehouse Clerk Miller',
    dispatchedItems: [
      { itemCode: 'SKU-COAT-TH', itemName: 'Ceramic Thermal Heatshield Plate', quantityDispatched: 80, uom: 'EA' },
    ],
  },
];

export default function OutboundDispatchPage() {
  const [challans, setChallans] = useState<DeliveryChallanItem[]>(initialChallans);
  const [showNewChallanModal, setShowNewChallanModal] = useState(false);
  const [challanForm, setChallanForm] = useState({
    clientName: 'SpaceX Starbase Facilities',
    salesOrderRef: 'SO-SPX-3301',
    carrierName: 'R+L Carriers Dedicated',
    vehicleNumber: 'TX-COMM-1290',
    trackingNumber: 'TRK-RL-559102',
    itemCode: 'SKU-TITAN-X1',
    itemName: 'Titanium Truss Spacecraft Strut',
    quantity: 50,
    totalWeightKg: 725,
  });

  const handleAdvanceStatus = (challanNumber: string, nextStatus: 'PACKED' | 'DISPATCHED') => {
    setChallans((prev) =>
      prev.map((c) =>
        c.challanNumber === challanNumber
          ? {
              ...c,
              status: nextStatus,
              verifiedBy: nextStatus === 'DISPATCHED' ? 'Security Gate Officer Vance' : c.verifiedBy,
            }
          : c,
      ),
    );
  };

  const handleCreateChallan = (e: React.FormEvent) => {
    e.preventDefault();

    const newChallan: DeliveryChallanItem = {
      id: `dc-${Date.now()}`,
      challanNumber: `DC-2026-00${challans.length + 21}`,
      clientName: challanForm.clientName,
      salesOrderRef: challanForm.salesOrderRef,
      dispatchDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      carrierName: challanForm.carrierName,
      vehicleNumber: challanForm.vehicleNumber,
      trackingNumber: challanForm.trackingNumber,
      status: 'PICKING',
      totalWeightKg: Number(challanForm.totalWeightKg),
      preparedBy: 'Dispatch Lead Harris',
      dispatchedItems: [
        {
          itemCode: challanForm.itemCode,
          itemName: challanForm.itemName,
          quantityDispatched: Number(challanForm.quantity),
          uom: 'EA',
          serialLots: 'Generated on Packing',
        },
      ],
    };

    setChallans([newChallan, ...challans]);
    setShowNewChallanModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Send className="h-6 w-6 text-amber-400" />
            Outbound Shipping & Delivery Challan Dispatch Board
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Pick-list verification, carrier freight scheduling, barcode packaging validation, and delivery challans.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewChallanModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> Create Delivery Challan
        </button>
      </div>

      {/* Challans List */}
      <div className="space-y-4">
        {challans.map((challan) => {
          const isDispatched = challan.status === 'DISPATCHED';
          const isPacked = challan.status === 'PACKED';
          const isPicking = challan.status === 'PICKING';

          return (
            <div
              key={challan.id}
              className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-white">
                      {challan.challanNumber}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-semibold text-slate-200">
                      {challan.clientName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (Ref: {challan.salesOrderRef})
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Carrier: <strong className="text-white">{challan.carrierName}</strong></span>
                    <span>&bull;</span>
                    <span>Tracking: <strong className="text-cyan-400 font-mono">{challan.trackingNumber}</strong></span>
                    {challan.vehicleNumber && (
                      <>
                        <span>&bull;</span>
                        <span>Truck: <strong className="text-slate-700 dark:text-slate-300 font-mono">{challan.vehicleNumber}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                      isDispatched
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isPacked
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {challan.status}
                  </span>

                  {/* Advance Workflow Action */}
                  {isPicking && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(challan.challanNumber, 'PACKED')}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                    >
                      Confirm Packing
                    </button>
                  )}
                  {isPacked && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(challan.challanNumber, 'DISPATCHED')}
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Truck className="h-3.5 w-3.5" /> Authorize Gate Exit
                    </button>
                  )}
                </div>
              </div>

              {/* Items in Challan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Dispatched Freight Consignment:</div>
                  {challan.dispatchedItems.map((item, i) => (
                    <div key={i} className="flex justify-between font-mono">
                      <span className="text-white">{item.itemCode} - {item.itemName}</span>
                      <span className="text-amber-400 font-bold">{item.quantityDispatched} {item.uom}</span>
                    </div>
                  ))}
                  {challan.totalWeightKg && (
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      Total Gross Weight: <strong className="text-slate-900 dark:text-white font-mono">{challan.totalWeightKg} kg</strong>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 space-y-1">
                  <div>Dispatch Timestamp: <span className="font-mono text-slate-200">{challan.dispatchDate}</span></div>
                  <div>Prepared By: <strong className="text-slate-200">{challan.preparedBy}</strong></div>
                  {challan.verifiedBy && (
                    <div className="text-emerald-400">Security Gate Verified: <strong>{challan.verifiedBy}</strong></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Challan */}
      {showNewChallanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Send className="h-5 w-5 text-amber-400" />
                Prepare Delivery Challan
              </h3>
              <button
                type="button"
                onClick={() => setShowNewChallanModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateChallan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Client Enterprise</label>
                <input
                  type="text"
                  required
                  value={challanForm.clientName}
                  onChange={(e) => setChallanForm({ ...challanForm, clientName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Sales Order Ref</label>
                  <input
                    type="text"
                    required
                    value={challanForm.salesOrderRef}
                    onChange={(e) => setChallanForm({ ...challanForm, salesOrderRef: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Carrier Freight</label>
                  <input
                    type="text"
                    required
                    value={challanForm.carrierName}
                    onChange={(e) => setChallanForm({ ...challanForm, carrierName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Dispatched SKU</label>
                  <input
                    type="text"
                    required
                    value={challanForm.itemCode}
                    onChange={(e) => setChallanForm({ ...challanForm, itemCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={challanForm.quantity}
                    onChange={(e) => setChallanForm({ ...challanForm, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewChallanModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold bg-amber-600 hover:bg-amber-500 text-white"
                >
                  Generate Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

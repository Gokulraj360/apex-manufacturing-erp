'use client';

import React, { useState } from 'react';
import {
  PackageCheck,
  CheckCircle,
  Clock,
  Send,
  Boxes,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { MaterialIssuanceItem } from '@/types/warehouse';

const initialIssuances: MaterialIssuanceItem[] = [
  {
    id: 'iss-1',
    issuanceNumber: 'ISS-2026-0092',
    requisitionNumber: 'REQ-2026-088',
    workOrderNumber: 'WO-2026-049',
    issuedTo: 'Shift Lead Vance (Line 1)',
    issuedBy: 'Warehouse Officer Chen',
    issuedAt: '2026-10-06 08:35:00',
    items: [
      { itemCode: 'PART-TI-TUBE-01', quantityIssued: 250, sourceBinCode: 'ZONE-A-RACK-01-S1', lotNumber: 'LOT-TI-9041' },
      { itemCode: 'PART-CNC-ENDCAP-L', quantityIssued: 250, sourceBinCode: 'ZONE-A-RACK-02-B1', lotNumber: 'LOT-EC-2201' },
      { itemCode: 'PART-CNC-ENDCAP-R', quantityIssued: 250, sourceBinCode: 'ZONE-A-RACK-02-B1', lotNumber: 'LOT-EC-2202' },
    ],
  },
  {
    id: 'iss-2',
    issuanceNumber: 'ISS-2026-0091',
    requisitionNumber: 'REQ-2026-085',
    workOrderNumber: 'WO-2026-048',
    issuedTo: 'Shift Lead Diaz (Line 3)',
    issuedBy: 'Warehouse Officer Chen',
    issuedAt: '2026-10-05 13:20:00',
    items: [
      { itemCode: 'PART-COOLANT-SYNTH', quantityIssued: 5, sourceBinCode: 'ZONE-C-RACK-01-D1', lotNumber: 'LOT-CHEM-811' },
    ],
  },
];

interface PendingQueueItem {
  id: string;
  reqNumber: string;
  workOrderNumber: string;
  sku: string;
  productName: string;
  requestedBy: string;
  items: Array<{ itemCode: string; description: string; qty: number; uom: string; availableBin: string }>;
}

const initialPending: PendingQueueItem[] = [
  {
    id: 'p-1',
    reqNumber: 'REQ-2026-089',
    workOrderNumber: 'WO-2026-050',
    sku: 'SKU-FRAME-W2',
    productName: 'Cast Aluminum EV Subframe',
    requestedBy: 'Shift Supervisor Patel',
    items: [
      { itemCode: 'PART-AL-CASTING-RAW', description: 'Raw Subframe Die-Casting Blank', qty: 600, uom: 'EA', availableBin: 'ZONE-A-RACK-03-A1' },
      { itemCode: 'PART-BUSHING-URETHANE', description: 'Suspension Bushings', qty: 2400, uom: 'EA', availableBin: 'ZONE-A-RACK-04-B2' },
    ],
  },
];

export default function MaterialIssuancePage() {
  const [pendingQueue, setPendingQueue] = useState<PendingQueueItem[]>(initialPending);
  const [issuances, setIssuances] = useState<MaterialIssuanceItem[]>(initialIssuances);

  const handleFulfillRequisition = (item: PendingQueueItem) => {
    const newIssuance: MaterialIssuanceItem = {
      id: `iss-${Date.now()}`,
      issuanceNumber: `ISS-2026-00${issuances.length + 93}`,
      requisitionNumber: item.reqNumber,
      workOrderNumber: item.workOrderNumber,
      issuedTo: item.requestedBy,
      issuedBy: 'Warehouse Officer Chen',
      issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      items: item.items.map((i) => ({
        itemCode: i.itemCode,
        quantityIssued: i.qty,
        sourceBinCode: i.availableBin,
        lotNumber: `LOT-REL-${Math.floor(1000 + Math.random() * 9000)}`,
      })),
    };

    setIssuances([newIssuance, ...issuances]);
    setPendingQueue(pendingQueue.filter((p) => p.id !== item.id));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <PackageCheck className="h-6 w-6 text-amber-400" />
            Shop Floor Material Issuance & Fulfillment Queue
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Fulfill approved production requisitions, pick stock from designated warehouse bins, and log floor transfers.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Pending Fulfillments</span>
          <div className="text-lg font-bold font-mono text-amber-400">
            {pendingQueue.length} Work Orders Awaiting Stock
          </div>
        </div>
      </div>

      {/* Pending Fulfillment Queue */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Active Shop Floor Requisitions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Production line requisitions approved for warehouse pick and issuance.
            </p>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded font-medium">
            Immediate Action
          </span>
        </div>

        <div className="space-y-4">
          {pendingQueue.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-white">
                    {item.reqNumber}
                  </span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="font-mono text-xs font-semibold text-cyan-400">
                    {item.workOrderNumber}
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    ({item.productName})
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  Requested by: <strong className="text-slate-200">{item.requestedBy}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {item.items.map((part, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-black/40 border border-slate-800 flex justify-between items-center font-mono">
                    <div>
                      <div className="text-white font-bold">{part.itemCode}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{part.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-400 font-bold">{part.qty} {part.uom}</div>
                      <div className="text-[10px] text-cyan-400">Bin: {part.availableBin}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleFulfillRequisition(item)}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" /> Pick, Deduct & Issue to Production
                </button>
              </div>
            </div>
          ))}

          {pendingQueue.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400">
              <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-1.5" />
              All current production material requisitions have been fulfilled and dispatched!
            </div>
          )}
        </div>
      </div>

      {/* Issuance Ledger Table */}
      <div className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Completed Material Issuance History
          </span>
          <span className="text-xs text-slate-400">{issuances.length} Historical Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Issuance Ref</th>
                <th className="py-3 px-4">Work Order</th>
                <th className="py-3 px-4">Issued To</th>
                <th className="py-3 px-4">Issued By</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Transferred Items</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {issuances.map((iss) => (
                <tr key={iss.id} className="hover:bg-slate-800/20">
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {iss.issuanceNumber}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-blue-400">
                    {iss.workOrderNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    {iss.issuedTo}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {iss.issuedBy}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {iss.issuedAt}
                  </td>
                  <td className="py-3 px-4">
                    {iss.items.map((i, idx) => (
                      <div key={idx} className="font-mono text-[11px]">
                        <strong className="text-white">{i.quantityIssued}</strong> x {i.itemCode} (from {i.sourceBinCode})
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Dispatched
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

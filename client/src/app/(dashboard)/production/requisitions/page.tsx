'use client';

import React, { useState } from 'react';
import {
  PackageCheck,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldAlert,
  Send,
  Boxes,
} from 'lucide-react';
import { MaterialRequisitionItem, WipStockItem } from '@/types/production';

const initialRequisitions: MaterialRequisitionItem[] = [
  {
    id: 'req-1',
    requisitionNumber: 'REQ-2026-088',
    workOrderId: 'wo-1',
    orderNumber: 'WO-2026-049',
    sku: 'SKU-TITAN-X1',
    status: 'ISSUED',
    requestedBy: 'Shift Supervisor Vance',
    issuedBy: 'Warehouse Lead Rodriguez',
    issuedAt: '2026-10-06 08:30:00',
    createdAt: '2026-10-06 07:15:00',
    requestedItems: [
      { partNumber: 'PART-TI-TUBE-01', quantityRequested: 250, uom: 'EA' },
      { partNumber: 'PART-CNC-ENDCAP-L', quantityRequested: 250, uom: 'EA' },
      { partNumber: 'PART-CNC-ENDCAP-R', quantityRequested: 250, uom: 'EA' },
    ],
    issuedItems: [
      { partNumber: 'PART-TI-TUBE-01', quantityIssued: 250, batchLotNo: 'LOT-TI-9041' },
      { partNumber: 'PART-CNC-ENDCAP-L', quantityIssued: 250, batchLotNo: 'LOT-EC-2201' },
      { partNumber: 'PART-CNC-ENDCAP-R', quantityIssued: 250, batchLotNo: 'LOT-EC-2202' },
    ],
  },
  {
    id: 'req-2',
    requisitionNumber: 'REQ-2026-089',
    workOrderId: 'wo-2',
    orderNumber: 'WO-2026-050',
    sku: 'SKU-FRAME-W2',
    status: 'REQUESTED',
    requestedBy: 'Shift Supervisor Patel',
    createdAt: '2026-10-07 09:40:00',
    requestedItems: [
      { partNumber: 'PART-AL-CASTING-RAW', quantityRequested: 600, uom: 'EA' },
      { partNumber: 'PART-BUSHING-URETHANE', quantityRequested: 2400, uom: 'EA' },
    ],
  },
];

const initialWip: WipStockItem[] = [
  {
    id: 'wip-1',
    workOrderId: 'wo-1',
    orderNumber: 'WO-2026-049',
    sku: 'SKU-TITAN-X1',
    stationName: 'Station 01 - Material Ingest & Sawing',
    stageUnits: 0,
    holdingLocation: 'Floor Buffer A',
    hasQualityHold: false,
  },
  {
    id: 'wip-2',
    workOrderId: 'wo-1',
    orderNumber: 'WO-2026-049',
    sku: 'SKU-TITAN-X1',
    stationName: 'Station 02 - Robotic TIG Welding',
    stageUnits: 120,
    holdingLocation: 'Welding Jig Queue #02',
    hasQualityHold: false,
  },
  {
    id: 'wip-3',
    workOrderId: 'wo-1',
    orderNumber: 'WO-2026-049',
    sku: 'SKU-TITAN-X1',
    stationName: 'Station 04 - Final CMM Inspection',
    stageUnits: 250,
    holdingLocation: 'Inspection Staging Racks',
    hasQualityHold: false,
  },
  {
    id: 'wip-4',
    workOrderId: 'wo-3',
    orderNumber: 'WO-2026-051',
    sku: 'SKU-DRIVE-GEN3',
    stationName: 'Station 03 - Bearing Press',
    stageUnits: 80,
    holdingLocation: 'Quarantine Yellow Zone',
    hasQualityHold: true,
    qualityNotes: 'Press interference fit out of tolerance (0.012mm oversize)',
  },
];

export default function RequisitionsPage() {
  const [requisitions, setRequisitions] = useState<MaterialRequisitionItem[]>(initialRequisitions);
  const [wipStocks, setWipStocks] = useState<WipStockItem[]>(initialWip);
  const [activeTab, setActiveTab] = useState<'REQS' | 'WIP'>('REQS');

  const handleIssueStock = (id: string) => {
    setRequisitions((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'ISSUED',
              issuedBy: 'Warehouse Lead Rodriguez',
              issuedAt: new Date().toISOString(),
              issuedItems: r.requestedItems.map((item) => ({
                partNumber: item.partNumber,
                quantityIssued: item.quantityRequested,
                batchLotNo: `LOT-AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
              })),
            }
          : r,
      ),
    );
  };

  const handleToggleHold = (wipId: string) => {
    setWipStocks((prev) =>
      prev.map((w) =>
        w.id === wipId ? { ...w, hasQualityHold: !w.hasQualityHold } : w,
      ),
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <PackageCheck className="h-6 w-6 text-blue-500" />
            Material Requisitions & Work-in-Progress (WIP) Stock
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Raw component warehouse pick lists, shop floor issuance authorization, and intermediate stage inventory buffers.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('REQS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'REQS'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Material Requisitions ({requisitions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('WIP')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'WIP'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Work-in-Progress (WIP) Stages ({wipStocks.length})
        </button>
      </div>

      {/* Requisitions View */}
      {activeTab === 'REQS' && (
        <div className="space-y-4">
          {requisitions.map((req) => {
            const isIssued = req.status === 'ISSUED';

            return (
              <div
                key={req.id}
                className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white">
                      {req.requisitionNumber}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-mono text-xs font-semibold text-cyan-400">
                      {req.orderNumber} ({req.sku})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isIssued
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {req.status}
                    </span>
                    {!isIssued && (
                      <button
                        type="button"
                        onClick={() => handleIssueStock(req.id)}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                      >
                        Authorize & Issue Materials
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Requested Items */}
                  <div className="space-y-2">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">Requested Components:</div>
                    <div className="space-y-1.5">
                      {req.requestedItems.map((item, i) => (
                        <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between font-mono">
                          <span className="text-white">{item.partNumber}</span>
                          <span className="text-slate-400">Qty: {item.quantityRequested} {item.uom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Issuance Meta */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 text-slate-400">
                    <div>Requested By: <strong className="text-slate-200">{req.requestedBy}</strong></div>
                    <div>Requested Timestamp: <span className="font-mono">{req.createdAt}</span></div>
                    {isIssued && (
                      <>
                        <div className="pt-2 border-t border-slate-800">
                          Issued By: <strong className="text-emerald-400">{req.issuedBy}</strong>
                        </div>
                        <div>Issued Timestamp: <span className="font-mono">{req.issuedAt}</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WIP Stock View */}
      {activeTab === 'WIP' && (
        <div className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Floor Buffers & Stage Inventory
            </span>
            <span className="text-xs text-slate-400">{wipStocks.length} Active Stations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Station Stage</th>
                  <th className="py-3 px-4">Work Order & SKU</th>
                  <th className="py-3 px-4">Stage Units in Buffer</th>
                  <th className="py-3 px-4">Holding Location</th>
                  <th className="py-3 px-4">Quality Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {wipStocks.map((wip) => (
                  <tr key={wip.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-semibold text-white">
                      {wip.stationName}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="text-blue-400">{wip.orderNumber}</div>
                      <div className="text-[10px] text-slate-400">{wip.sku}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {wip.stageUnits} Units
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                      {wip.holdingLocation}
                    </td>

                    <td className="py-3 px-4">
                      {wip.hasQualityHold ? (
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                            Quality Hold
                          </span>
                          {wip.qualityNotes && (
                            <div className="text-[10px] text-red-300 mt-0.5">{wip.qualityNotes}</div>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Released
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleHold(wip.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          wip.hasQualityHold
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {wip.hasQualityHold ? 'Release Hold' : 'Place QA Hold'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

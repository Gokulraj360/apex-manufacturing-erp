'use client';

import React, { useState, useMemo } from 'react';
import { useActiveFranchise } from '@/lib/franchiseStore';
import {
  Boxes,
  Play,
  Pause,
  CheckCircle,
  Plus,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Wrench,
  Check,
  RotateCcw,
} from 'lucide-react';
import { WorkOrderItem, ProductionBatchItem } from '@/types/production';
import { enterpriseDataStore } from '@/lib/enterpriseDataStore';

const initialOrders: WorkOrderItem[] = [
  {
    id: 'wo-1',
    orderNumber: 'WO-2026-049',
    bomId: 'bom-1',
    sku: 'SKU-TITAN-X1',
    productName: 'Titanium Truss Spacecraft Strut',
    targetQuantity: 500,
    completedQuantity: 380,
    scrapQuantity: 6,
    status: 'IN_PROGRESS',
    dueDate: '2026-10-18',
    assignedLineNumber: 1,
    assignedSupervisor: 'M. Vance',
    milestones: [
      { milestoneName: 'Raw Material Kitting', targetDate: '2026-10-04', isCompleted: true, completionPercentage: 100 },
      { milestoneName: 'Primary CNC Milling', targetDate: '2026-10-08', isCompleted: true, completionPercentage: 100 },
      { milestoneName: 'Robotic Welding & Assembly', targetDate: '2026-10-14', isCompleted: false, completionPercentage: 75 },
      { milestoneName: 'Final CMM Inspection & Pack', targetDate: '2026-10-18', isCompleted: false, completionPercentage: 0 },
    ],
    batches: [
      {
        id: 'b-1',
        batchNumber: 'BATCH-WO049-A1',
        workOrderId: 'wo-1',
        plannedUnits: 250,
        producedUnits: 250,
        defectiveUnits: 2,
        status: 'COMPLETED',
        currentStation: 'Final Inspection Station',
        operatorId: 'OP-SMITH-01',
      },
      {
        id: 'b-2',
        batchNumber: 'BATCH-WO049-B1',
        workOrderId: 'wo-1',
        plannedUnits: 250,
        producedUnits: 130,
        defectiveUnits: 4,
        status: 'ACTIVE',
        currentStation: 'Robotic Weld Station #02',
        operatorId: 'OP-GARCIA-04',
      },
    ],
  },
  {
    id: 'wo-2',
    orderNumber: 'WO-2026-050',
    bomId: 'bom-2',
    sku: 'SKU-FRAME-W2',
    productName: 'Cast Aluminum EV Subframe',
    targetQuantity: 1200,
    completedQuantity: 720,
    scrapQuantity: 14,
    status: 'IN_PROGRESS',
    dueDate: '2026-10-14',
    assignedLineNumber: 2,
    assignedSupervisor: 'K. Patel',
    milestones: [
      { milestoneName: 'High-Pressure Casting Ingest', targetDate: '2026-10-05', isCompleted: true, completionPercentage: 100 },
      { milestoneName: 'Precision 5-Axis Machining', targetDate: '2026-10-10', isCompleted: false, completionPercentage: 60 },
      { milestoneName: 'Aqueous Ultrasonic Wash', targetDate: '2026-10-12', isCompleted: false, completionPercentage: 0 },
      { milestoneName: 'Helium Leak Quality Test', targetDate: '2026-10-14', isCompleted: false, completionPercentage: 0 },
    ],
    batches: [
      {
        id: 'b-3',
        batchNumber: 'BATCH-WO050-A1',
        workOrderId: 'wo-2',
        plannedUnits: 600,
        producedUnits: 600,
        defectiveUnits: 8,
        status: 'COMPLETED',
        currentStation: 'Cleaning Chamber',
        operatorId: 'OP-DAVIS-02',
      },
      {
        id: 'b-4',
        batchNumber: 'BATCH-WO050-B1',
        workOrderId: 'wo-2',
        plannedUnits: 600,
        producedUnits: 120,
        defectiveUnits: 6,
        status: 'ACTIVE',
        currentStation: '5-Axis Haas CNC #04',
        operatorId: 'OP-MARTINEZ-07',
      },
    ],
  },
];

export default function WorkOrderExecutionPage() {
  const [orders, setOrders] = useState<WorkOrderItem[]>(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>('wo-1');
  const [newBatchModalOrder, setNewBatchModalOrder] = useState<WorkOrderItem | null>(null);
  const [batchForm, setBatchForm] = useState({ plannedUnits: 200, station: 'Station 01' });
  const [backflushNotification, setBackflushNotification] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleBatchAction = (orderId: string, batchId: string, action: 'START' | 'PAUSE' | 'COMPLETE') => {
    if (action === 'COMPLETE') {
      const res = enterpriseDataStore.completeWorkOrder(orderId);
      setBackflushNotification(res.message);
      setTimeout(() => setBackflushNotification(null), 6000);
    }

    setOrders((prev) =>
      prev.map((wo) => {
        if (wo.id !== orderId) return wo;
        const updatedBatches = (wo.batches || []).map((b) => {
          if (b.id !== batchId) return b;
          if (action === 'START') return { ...b, status: 'ACTIVE' as const };
          if (action === 'PAUSE') return { ...b, status: 'INTERRUPTED' as const };
          if (action === 'COMPLETE') return { ...b, status: 'COMPLETED' as const, producedUnits: b.plannedUnits };
          return b;
        });

        // Recalculate completed quantity
        const completedTotal = updatedBatches.reduce((acc, b) => acc + (b.status === 'COMPLETED' ? b.plannedUnits : b.producedUnits), 0);
        return {
          ...wo,
          completedQuantity: completedTotal,
          batches: updatedBatches,
        };
      }),
    );
  };

  const handleToggleMilestone = (orderId: string, mIdx: number) => {
    setOrders((prev) =>
      prev.map((wo) => {
        if (wo.id !== orderId) return wo;
        const updatedMilestones = [...wo.milestones];
        const current = updatedMilestones[mIdx];
        const nextState = !current.isCompleted;
        updatedMilestones[mIdx] = {
          ...current,
          isCompleted: nextState,
          completionPercentage: nextState ? 100 : 0,
        };
        return { ...wo, milestones: updatedMilestones };
      }),
    );
  };

  const handleLaunchBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchModalOrder) return;

    const newBatch: ProductionBatchItem = {
      id: `b-${Date.now()}`,
      batchNumber: `BATCH-${newBatchModalOrder.orderNumber}-C${Date.now().toString().slice(-2)}`,
      workOrderId: newBatchModalOrder.id,
      plannedUnits: Number(batchForm.plannedUnits),
      producedUnits: 0,
      defectiveUnits: 0,
      status: 'ACTIVE',
      currentStation: batchForm.station,
      operatorId: 'OP-LEAD-VANCE',
    };

    setOrders((prev) =>
      prev.map((wo) => {
        if (wo.id !== newBatchModalOrder.id) return wo;
        return {
          ...wo,
          batches: [...(wo.batches || []), newBatch],
        };
      }),
    );

    setNewBatchModalOrder(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Boxes className="h-6 w-6 text-blue-500" />
            Interactive Work Order Execution Board
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time batch start/pause control, milestone checklists, and production line completion tracking.
          </p>
        </div>
      </div>

      {/* Reactive Backflush & Stock Update Notification */}
      {backflushNotification && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{backflushNotification}</span>
        </div>
      )}

      {/* Work Orders List */}
      <div className="space-y-6">
        {orders.map((wo) => {
          const isExpanded = expandedOrderId === wo.id;
          const progressPercent = Math.round((wo.completedQuantity / wo.targetQuantity) * 100);

          return (
            <div
              key={wo.id}
              className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
            >
              {/* Order Header Card */}
              <div
                onClick={() => toggleExpand(wo.id)}
                className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-blue-400">
                    L{wo.assignedLineNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-mono text-base font-bold text-white">
                        {wo.orderNumber}
                      </h3>
                      <span className="font-mono text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded">
                        {wo.sku}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium hidden sm:inline">
                        {wo.productName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>Supervisor: <strong className="text-slate-200">{wo.assignedSupervisor}</strong></span>
                      <span>&bull;</span>
                      <span>Target Due: <strong className="text-slate-200 font-mono">{wo.dueDate}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Progress</div>
                    <div className="text-base font-bold font-mono text-white">
                      {wo.completedQuantity.toLocaleString()} / {wo.targetQuantity.toLocaleString()}{' '}
                      <span className="text-blue-400 text-xs">({progressPercent}%)</span>
                    </div>
                  </div>

                  <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded font-bold uppercase">
                    {wo.status.replace(/_/g, ' ')}
                  </span>

                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details: Milestones & Batches */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-800 bg-slate-900/40 space-y-6">
                  {/* Milestones Tracker */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Manufacturing Milestones</span>
                      <span className="text-slate-400 font-normal">Click checkmark to update state</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {wo.milestones.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          onClick={() => handleToggleMilestone(wo.id, mIdx)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            m.isCompleted
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-900 border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{m.milestoneName}</span>
                            <div
                              className={`h-5 w-5 rounded flex items-center justify-center text-xs ${
                                m.isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'border border-slate-700'
                              }`}
                            >
                              {m.isCompleted && <Check className="h-3.5 w-3.5" />}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-2 font-mono">
                            Target: {m.targetDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Production Batches Queue */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Active Production Batches
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewBatchModalOrder(wo)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> Dispatch New Batch
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(wo.batches || []).map((batch) => {
                        const isActive = batch.status === 'ACTIVE';
                        const isCompleted = batch.status === 'COMPLETED';

                        return (
                          <div
                            key={batch.id}
                            className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-white">
                                  {batch.batchNumber}
                                </span>
                                <span className="text-slate-400">&bull;</span>
                                <span className="text-xs text-slate-700 dark:text-slate-300">
                                  Station: <strong className="text-white">{batch.currentStation}</strong>
                                </span>
                                <span className="text-slate-400">&bull;</span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  Op: {batch.operatorId}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                Planned Units: <strong className="text-slate-900 dark:text-white font-mono">{batch.plannedUnits}</strong> &bull; Completed: <strong className="text-emerald-400 font-mono">{batch.producedUnits}</strong> &bull; Defects: <strong className="text-red-400 font-mono">{batch.defectiveUnits}</strong>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  isCompleted
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : isActive
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}
                              >
                                {batch.status}
                              </span>

                              {/* Controls */}
                              {!isCompleted && (
                                <div className="flex items-center gap-1.5">
                                  {isActive ? (
                                    <button
                                      type="button"
                                      onClick={() => handleBatchAction(wo.id, batch.id, 'PAUSE')}
                                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                                      title="Pause Batch"
                                    >
                                      <Pause className="h-4 w-4" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleBatchAction(wo.id, batch.id, 'START')}
                                      className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                                      title="Start Batch"
                                    >
                                      <Play className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleBatchAction(wo.id, batch.id, 'COMPLETE')}
                                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                                  >
                                    Finish
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Dispatch New Batch */}
      {newBatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Boxes className="h-5 w-5 text-blue-400" />
                Dispatch New Production Batch
              </h3>
              <button
                type="button"
                onClick={() => setNewBatchModalOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300">
              Order: <strong className="text-slate-900 dark:text-white font-mono">{newBatchModalOrder.orderNumber}</strong> ({newBatchModalOrder.sku})
            </div>

            <form onSubmit={handleLaunchBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Batch Planned Units
                </label>
                <input
                  type="number"
                  required
                  value={batchForm.plannedUnits}
                  onChange={(e) => setBatchForm({ ...batchForm, plannedUnits: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ingest Station Name
                </label>
                <input
                  type="text"
                  required
                  value={batchForm.station}
                  onChange={(e) => setBatchForm({ ...batchForm, station: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNewBatchModalOrder(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Release to Shop Floor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  PackageSearch,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  UserCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SalesOrderFulfillmentItem, PickingStatus } from '@/types/dispatch';

const INITIAL_PICK_LISTS: SalesOrderFulfillmentItem[] = [
  {
    id: 'pick-1',
    pickListNumber: 'PICK-2026-0419',
    salesOrderNumber: 'SO-2026-104',
    customerName: 'Bharat Heavy Dynamics Ltd',
    assignedPicker: 'Arjun Das (Warehouse Specialist)',
    status: 'STAGED',
    stagingBay: 'BAY-OUT-01',
    targetDeliveryDate: '2026-10-08',
    pickedAt: '2026-10-07 10:15',
    verifiedBy: 'Rajesh Mehra',
    createdAt: '2026-10-07 08:30',
    itemsToPick: [
      {
        itemCode: 'FG-VALVE-5000',
        itemName: 'Industrial High-Pressure Cryogenic Valve',
        requestedQty: 10,
        pickedQty: 10,
        sourceBay: 'FG-BAY-A1-01',
        lotNumber: 'BATCH-2026-01-A',
      },
    ],
  },
  {
    id: 'pick-2',
    pickListNumber: 'PICK-2026-0420',
    salesOrderNumber: 'SO-2026-108',
    customerName: 'Siemens Precision India',
    assignedPicker: 'Vikram Sethi',
    status: 'PICKING',
    stagingBay: 'BAY-OUT-02',
    targetDeliveryDate: '2026-10-08',
    createdAt: '2026-10-07 09:00',
    itemsToPick: [
      {
        itemCode: 'FG-SENSOR-CTRL',
        itemName: 'Dual-Channel Temperature Control Module',
        requestedQty: 40,
        pickedQty: 25,
        sourceBay: 'FG-BAY-B2-01',
        lotNumber: 'BATCH-2026-05-A',
      },
    ],
  },
  {
    id: 'pick-3',
    pickListNumber: 'PICK-2026-0421',
    salesOrderNumber: 'SO-2026-112',
    customerName: 'Adani Infra Projects',
    assignedPicker: 'Kavita Patel',
    status: 'QUEUED',
    stagingBay: 'BAY-OUT-03',
    targetDeliveryDate: '2026-10-09',
    createdAt: '2026-10-07 11:30',
    itemsToPick: [
      {
        itemCode: 'FG-PUMP-H2',
        itemName: 'High-Throughput Hydraulic Pump Head',
        requestedQty: 4,
        pickedQty: 0,
        sourceBay: 'FG-BAY-C3-01',
        lotNumber: 'BATCH-2026-03-A',
      },
    ],
  },
];

export default function OrderPickingPage() {
  const [pickLists, setPickLists] = useState<SalesOrderFulfillmentItem[]>(INITIAL_PICK_LISTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('pick-2');

  // Modal
  const [isNewWaveModalOpen, setIsNewWaveModalOpen] = useState(false);

  // Form State
  const [newWaveForm, setNewWaveForm] = useState({
    salesOrderNumber: 'SO-2026-115',
    customerName: 'Tata Advanced Systems',
    assignedPicker: 'Arjun Das (Warehouse Specialist)',
    stagingBay: 'BAY-OUT-04',
    targetDeliveryDate: '2026-10-10',
    itemCode: 'FG-VALVE-5000',
    itemName: 'Industrial High-Pressure Cryogenic Valve',
    requestedQty: 15,
    sourceBay: 'FG-BAY-A1-02',
    lotNumber: 'BATCH-2026-01-B',
  });

  const handleCreateWave = (e: React.FormEvent) => {
    e.preventDefault();
    const count = pickLists.length + 422;
    const pickListNumber = `PICK-2026-0${count}`;

    const newWave: SalesOrderFulfillmentItem = {
      id: `pick-${Date.now()}`,
      pickListNumber,
      salesOrderNumber: newWaveForm.salesOrderNumber,
      customerName: newWaveForm.customerName,
      assignedPicker: newWaveForm.assignedPicker,
      status: 'QUEUED',
      stagingBay: newWaveForm.stagingBay,
      targetDeliveryDate: newWaveForm.targetDeliveryDate,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      itemsToPick: [
        {
          itemCode: newWaveForm.itemCode,
          itemName: newWaveForm.itemName,
          requestedQty: Number(newWaveForm.requestedQty),
          pickedQty: 0,
          sourceBay: newWaveForm.sourceBay,
          lotNumber: newWaveForm.lotNumber,
        },
      ],
    };

    setPickLists([newWave, ...pickLists]);
    setExpandedId(newWave.id);
    setIsNewWaveModalOpen(false);
  };

  const handleMarkStaged = (id: string) => {
    setPickLists((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: 'STAGED',
            pickedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            verifiedBy: 'Rajesh Mehra (Dispatch Supervisor)',
            itemsToPick: p.itemsToPick.map((item) => ({
              ...item,
              pickedQty: item.requestedQty,
            })),
          };
        }
        return p;
      })
    );
  };

  const filteredPicks = pickLists.filter((p) => {
    const matchesSearch =
      p.pickListNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.salesOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.assignedPicker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const queuedCount = pickLists.filter((p) => p.status === 'QUEUED').length;
  const pickingCount = pickLists.filter((p) => p.status === 'PICKING').length;
  const stagedCount = pickLists.filter((p) => p.status === 'STAGED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <PackageSearch className="w-7 h-7 text-amber-400" />
              Order Picking Waves & Staging Bays
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Approved Sales Orders
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Dispatch picking waves, direct picker routing to designated storage bays, and consolidate at shipping docks.
          </p>
        </div>

        <button
          onClick={() => setIsNewWaveModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition shadow-sm shadow-amber-900/30"
        >
          <Plus className="w-4 h-4" />
          Create Picking Wave
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Orders Queued</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{queuedCount}</span>
            <span className="text-xs text-blue-400 font-medium">ready to release</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Awaiting picker allocation</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Active Picking Waves</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <PackageSearch className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{pickingCount}</span>
            <span className="text-xs text-neutral-400 font-medium">pickers on aisles</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Scanning source bays</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Staged at Shipping Bays</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stagedCount}</span>
            <span className="text-xs text-emerald-400 font-medium">100% picked & verified</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Ready for truck loading</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Pick Accuracy Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">99.9%</span>
            <span className="text-xs text-purple-400 font-medium">barcode validated</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Zero mis-picked items</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search pick list #, SO #, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="QUEUED">Queued</option>
            <option value="PICKING">Picking</option>
            <option value="STAGED">Staged</option>
          </select>
        </div>
      </div>

      {/* Picking Waves List */}
      <div className="space-y-3">
        {filteredPicks.map((pick) => {
          const isExpanded = expandedId === pick.id;

          return (
            <div
              key={pick.id}
              className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden transition"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : pick.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border ${
                      pick.status === 'STAGED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : pick.status === 'PICKING'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    <PackageSearch className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{pick.pickListNumber}</span>
                      <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        {pick.salesOrderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          pick.status === 'STAGED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : pick.status === 'PICKING'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {pick.status}
                      </span>
                      <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        Staging: {pick.stagingBay}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1 font-medium">
                      Customer: <strong className="text-white">{pick.customerName}</strong>
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Assigned Picker: <strong className="text-neutral-300">{pick.assignedPicker}</strong> • Target Delivery: {pick.targetDeliveryDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  {pick.status !== 'STAGED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkStaged(pick.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Staged & Verified
                    </button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* Expanded Items Table */}
              {isExpanded && (
                <div className="border-t border-neutral-800 p-4 bg-neutral-950/40 space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                        <tr>
                          <th className="px-3 py-2">Item Code</th>
                          <th className="px-3 py-2">Description</th>
                          <th className="px-3 py-2">Source Bay</th>
                          <th className="px-3 py-2">Batch #</th>
                          <th className="px-3 py-2 text-right">Requested</th>
                          <th className="px-3 py-2 text-right">Picked</th>
                          <th className="px-3 py-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 text-neutral-300">
                        {pick.itemsToPick.map((item, idx) => (
                          <tr key={idx} className="hover:bg-neutral-800/40">
                            <td className="px-3 py-2.5 font-mono text-emerald-400 font-medium">{item.itemCode}</td>
                            <td className="px-3 py-2.5 text-white">{item.itemName}</td>
                            <td className="px-3 py-2.5 font-mono text-orange-300">{item.sourceBay}</td>
                            <td className="px-3 py-2.5 font-mono text-neutral-400">{item.lotNumber}</td>
                            <td className="px-3 py-2.5 text-right font-mono font-bold">{item.requestedQty}</td>
                            <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-400">
                              {item.pickedQty}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              {item.pickedQty === item.requestedQty ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                                  <CheckCircle2 className="w-3 h-3" /> FULFILLED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
                                  <Clock className="w-3 h-3" /> IN PROGRESS
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {pick.verifiedBy && (
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-800">
                      <span>Verified & Staged By: <strong className="text-neutral-300">{pick.verifiedBy}</strong></span>
                      <span>Staged timestamp: {pick.pickedAt}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: CREATE PICKING WAVE */}
      {isNewWaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PackageSearch className="w-5 h-5 text-amber-400" />
                Enqueue Sales Order Picking Wave
              </h3>
              <button
                onClick={() => setIsNewWaveModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Sales Order #</label>
                  <input
                    type="text"
                    value={newWaveForm.salesOrderNumber}
                    onChange={(e) => setNewWaveForm({ ...newWaveForm, salesOrderNumber: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Target Staging Bay</label>
                  <input
                    type="text"
                    value={newWaveForm.stagingBay}
                    onChange={(e) => setNewWaveForm({ ...newWaveForm, stagingBay: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newWaveForm.customerName}
                  onChange={(e) => setNewWaveForm({ ...newWaveForm, customerName: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Assigned Picker</label>
                  <input
                    type="text"
                    value={newWaveForm.assignedPicker}
                    onChange={(e) => setNewWaveForm({ ...newWaveForm, assignedPicker: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={newWaveForm.targetDeliveryDate}
                    onChange={(e) => setNewWaveForm({ ...newWaveForm, targetDeliveryDate: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-3">
                <span className="text-xs font-semibold text-neutral-300 block">Item Pick Allocation</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Item Code</label>
                    <input
                      type="text"
                      value={newWaveForm.itemCode}
                      onChange={(e) => setNewWaveForm({ ...newWaveForm, itemCode: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Source Bay</label>
                    <input
                      type="text"
                      value={newWaveForm.sourceBay}
                      onChange={(e) => setNewWaveForm({ ...newWaveForm, sourceBay: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Batch Number</label>
                    <input
                      type="text"
                      value={newWaveForm.lotNumber}
                      onChange={(e) => setNewWaveForm({ ...newWaveForm, lotNumber: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Requested Qty</label>
                    <input
                      type="number"
                      value={newWaveForm.requestedQty}
                      onChange={(e) => setNewWaveForm({ ...newWaveForm, requestedQty: Number(e.target.value) })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewWaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition flex items-center gap-2"
                >
                  <PackageSearch className="w-4 h-4" />
                  Release Pick Wave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

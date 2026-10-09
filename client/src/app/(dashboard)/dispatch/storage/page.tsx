'use client';

import React, { useState } from 'react';
import {
  Grid,
  Layers,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Package,
  Building2,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { FinishedGoodsBayItem } from '@/types/dispatch';

const INITIAL_BAYS: FinishedGoodsBayItem[] = [
  {
    id: 'bay-1',
    bayCode: 'FG-BAY-A1-01',
    zone: 'Zone A - Precision Assemblies',
    aisle: 'Aisle 01',
    rack: 'Rack 01',
    shelf: 'Tier 1',
    capacityUnits: 100,
    occupiedUnits: 85,
    itemCode: 'FG-VALVE-5000',
    itemName: 'Industrial High-Pressure Cryogenic Valve',
    lotBatchNumber: 'BATCH-2026-01-A',
    unitValuation: 1250.0,
    isReserved: false,
  },
  {
    id: 'bay-2',
    bayCode: 'FG-BAY-A1-02',
    zone: 'Zone A - Precision Assemblies',
    aisle: 'Aisle 01',
    rack: 'Rack 01',
    shelf: 'Tier 2',
    capacityUnits: 80,
    occupiedUnits: 75,
    itemCode: 'FG-VALVE-5000',
    itemName: 'Industrial High-Pressure Cryogenic Valve',
    lotBatchNumber: 'BATCH-2026-01-B',
    unitValuation: 1250.0,
    isReserved: true,
  },
  {
    id: 'bay-3',
    bayCode: 'FG-BAY-B2-01',
    zone: 'Zone B - Electronics & Subsystems',
    aisle: 'Aisle 02',
    rack: 'Rack 02',
    shelf: 'Tier 1',
    capacityUnits: 250,
    occupiedUnits: 210,
    itemCode: 'FG-SENSOR-CTRL',
    itemName: 'Dual-Channel Temperature Control Module',
    lotBatchNumber: 'BATCH-2026-05-A',
    unitValuation: 380.0,
    isReserved: false,
  },
  {
    id: 'bay-4',
    bayCode: 'FG-BAY-C3-01',
    zone: 'Zone C - Heavy Equipment',
    aisle: 'Aisle 03',
    rack: 'Rack 01',
    shelf: 'Ground Floor',
    capacityUnits: 50,
    occupiedUnits: 40,
    itemCode: 'FG-PUMP-H2',
    itemName: 'High-Throughput Hydraulic Pump Head',
    lotBatchNumber: 'BATCH-2026-03-A',
    unitValuation: 2950.0,
    isReserved: false,
  },
  {
    id: 'bay-5',
    bayCode: 'FG-BAY-D4-01',
    zone: 'Zone D - Packaged Spare Parts',
    aisle: 'Aisle 04',
    rack: 'Rack 03',
    shelf: 'Tier 3',
    capacityUnits: 300,
    occupiedUnits: 120,
    itemCode: 'SPARE-SEAL-KIT',
    itemName: 'Fluoroelastomer High-Temp Seal Kit',
    lotBatchNumber: 'LOT-SL-9011',
    unitValuation: 45.0,
    isReserved: false,
  },
];

export default function FinishedGoodsStoragePage() {
  const [bays, setBays] = useState<FinishedGoodsBayItem[]>(INITIAL_BAYS);
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isNewBayModalOpen, setIsNewBayModalOpen] = useState(false);
  const [isPutawayModalOpen, setIsPutawayModalOpen] = useState(false);

  // Forms
  const [newBayForm, setNewBayForm] = useState({
    bayCode: 'FG-BAY-A1-03',
    zone: 'Zone A - Precision Assemblies',
    aisle: 'Aisle 01',
    rack: 'Rack 01',
    shelf: 'Tier 3',
    capacityUnits: 100,
  });

  const [putawayForm, setPutawayForm] = useState({
    bayCode: 'FG-BAY-A1-01',
    itemCode: 'FG-VALVE-5000',
    itemName: 'Industrial High-Pressure Cryogenic Valve',
    lotBatchNumber: 'BATCH-2026-04-A',
    quantityUnits: 10,
    unitValuation: 1250.0,
  });

  const handleCreateBay = (e: React.FormEvent) => {
    e.preventDefault();
    const newBay: FinishedGoodsBayItem = {
      id: `bay-${Date.now()}`,
      bayCode: newBayForm.bayCode,
      zone: newBayForm.zone,
      aisle: newBayForm.aisle,
      rack: newBayForm.rack,
      shelf: newBayForm.shelf,
      capacityUnits: Number(newBayForm.capacityUnits),
      occupiedUnits: 0,
      unitValuation: 0,
      isReserved: false,
    };

    setBays([...bays, newBay]);
    setIsNewBayModalOpen(false);
  };

  const handlePutaway = (e: React.FormEvent) => {
    e.preventDefault();
    setBays((prev) =>
      prev.map((b) => {
        if (b.bayCode === putawayForm.bayCode) {
          return {
            ...b,
            itemCode: putawayForm.itemCode,
            itemName: putawayForm.itemName,
            lotBatchNumber: putawayForm.lotBatchNumber,
            occupiedUnits: b.occupiedUnits + Number(putawayForm.quantityUnits),
            unitValuation: Number(putawayForm.unitValuation),
          };
        }
        return b;
      })
    );
    setIsPutawayModalOpen(false);
  };

  const filteredBays = bays.filter((b) => {
    const matchesZone = selectedZone === 'ALL' || b.zone === selectedZone;
    const matchesSearch =
      b.bayCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.itemCode && b.itemCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.itemName && b.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesZone && matchesSearch;
  });

  // Metrics
  const totalCapacity = bays.reduce((acc, b) => acc + b.capacityUnits, 0);
  const totalOccupied = bays.reduce((acc, b) => acc + b.occupiedUnits, 0);
  const occupancyRate = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;
  const totalValuation = bays.reduce((acc, b) => acc + b.occupiedUnits * b.unitValuation, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Grid className="w-7 h-7 text-orange-400" />
              Finished Goods Bays & Storage Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Ready-to-Sell Inventory
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Optimize storage racking, allocate ready-for-dispatch finished goods, and prevent storage bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPutawayModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 text-sm font-medium border border-neutral-700 transition"
          >
            <Package className="w-4 h-4 text-emerald-400" />
            Putaway Stock
          </button>
          <button
            onClick={() => setIsNewBayModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition shadow-sm shadow-orange-900/30"
          >
            <Plus className="w-4 h-4" />
            Create Storage Bay
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Bay Utilization</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{occupancyRate.toFixed(1)}%</span>
            <span className="text-xs text-orange-400 font-medium">{totalOccupied} / {totalCapacity} units</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">High-velocity storage buffer</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Staged Valuation</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">${totalValuation.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium">certified ready</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Quality inspection cleared</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Available Space</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalCapacity - totalOccupied}</span>
            <span className="text-xs text-blue-400 font-medium">units buffer</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Room for incoming batches</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Active Bay Count</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{bays.length} Bays</span>
            <span className="text-xs text-purple-400 font-medium">4 active zones</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Aisle 01 through Aisle 04</p>
        </div>
      </div>

      {/* Zone Filters */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
        {[
          { id: 'ALL', label: 'All Zones' },
          { id: 'Zone A - Precision Assemblies', label: 'Zone A - Precision Assemblies' },
          { id: 'Zone B - Electronics & Subsystems', label: 'Zone B - Electronics' },
          { id: 'Zone C - Heavy Equipment', label: 'Zone C - Heavy Equipment' },
          { id: 'Zone D - Packaged Spare Parts', label: 'Zone D - Spare Parts' },
        ].map((z) => (
          <button
            key={z.id}
            onClick={() => setSelectedZone(z.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedZone === z.id
                ? 'bg-orange-600/20 text-orange-300 border border-orange-500/30 shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            {z.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search bay code, SKU, product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Bays Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-800/60 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
            <tr>
              <th className="px-4 py-3">Bay Coordinates</th>
              <th className="px-4 py-3">Stored SKU / Product</th>
              <th className="px-4 py-3">Batch Number</th>
              <th className="px-4 py-3 text-right">Unit Valuation</th>
              <th className="px-4 py-3">Occupancy Capacity</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-neutral-300">
            {filteredBays.map((bay) => {
              const occPercent = (bay.occupiedUnits / bay.capacityUnits) * 100;

              return (
                <tr key={bay.id} className="hover:bg-neutral-800/40">
                  <td className="px-4 py-3.5">
                    <div className="font-mono font-bold text-white">{bay.bayCode}</div>
                    <span className="text-[11px] text-neutral-400">
                      {bay.zone} • {bay.aisle} • {bay.shelf}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {bay.itemCode ? (
                      <div>
                        <div className="font-semibold text-neutral-200">{bay.itemName}</div>
                        <span className="font-mono text-emerald-400 text-[11px]">{bay.itemCode}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-500 italic">Empty Bay (Available)</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-neutral-300">
                    {bay.lotBatchNumber || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-white">
                    ${bay.unitValuation.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 w-60">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-mono text-neutral-300">
                        {bay.occupiedUnits} / {bay.capacityUnits} units
                      </span>
                      <span className="font-mono font-semibold text-orange-400">
                        {occPercent.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occPercent > 90
                            ? 'bg-rose-500'
                            : occPercent > 70
                            ? 'bg-orange-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occPercent}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {bay.isReserved ? (
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-semibold">
                        Reserved
                      </span>
                    ) : bay.occupiedUnits === 0 ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL: CREATE STORAGE BAY */}
      {isNewBayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Grid className="w-5 h-5 text-orange-400" />
                Register New Storage Bay
              </h3>
              <button
                onClick={() => setIsNewBayModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBay} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Bay Code</label>
                <input
                  type="text"
                  value={newBayForm.bayCode}
                  onChange={(e) => setNewBayForm({ ...newBayForm, bayCode: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-orange-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Zone Designation</label>
                <select
                  value={newBayForm.zone}
                  onChange={(e) => setNewBayForm({ ...newBayForm, zone: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="Zone A - Precision Assemblies">Zone A - Precision Assemblies</option>
                  <option value="Zone B - Electronics & Subsystems">Zone B - Electronics & Subsystems</option>
                  <option value="Zone C - Heavy Equipment">Zone C - Heavy Equipment</option>
                  <option value="Zone D - Packaged Spare Parts">Zone D - Packaged Spare Parts</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Aisle</label>
                  <input
                    type="text"
                    value={newBayForm.aisle}
                    onChange={(e) => setNewBayForm({ ...newBayForm, aisle: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Rack</label>
                  <input
                    type="text"
                    value={newBayForm.rack}
                    onChange={(e) => setNewBayForm({ ...newBayForm, rack: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Shelf</label>
                  <input
                    type="text"
                    value={newBayForm.shelf}
                    onChange={(e) => setNewBayForm({ ...newBayForm, shelf: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Capacity (Max Units)</label>
                <input
                  type="number"
                  value={newBayForm.capacityUnits}
                  onChange={(e) => setNewBayForm({ ...newBayForm, capacityUnits: Number(e.target.value) })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewBayModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition"
                >
                  Create Bay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PUTAWAY FINISHED GOODS */}
      {isPutawayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                Putaway Finished Goods Stock
              </h3>
              <button
                onClick={() => setIsPutawayModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePutaway} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Target Bay</label>
                <select
                  value={putawayForm.bayCode}
                  onChange={(e) => setPutawayForm({ ...putawayForm, bayCode: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  {bays.map((b) => (
                    <option key={b.id} value={b.bayCode}>
                      {b.bayCode} ({b.occupiedUnits}/{b.capacityUnits} occupied)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Item Code</label>
                  <input
                    type="text"
                    value={putawayForm.itemCode}
                    onChange={(e) => setPutawayForm({ ...putawayForm, itemCode: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={putawayForm.lotBatchNumber}
                    onChange={(e) => setPutawayForm({ ...putawayForm, lotBatchNumber: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Item Description</label>
                <input
                  type="text"
                  value={putawayForm.itemName}
                  onChange={(e) => setPutawayForm({ ...putawayForm, itemName: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Quantity Units</label>
                  <input
                    type="number"
                    value={putawayForm.quantityUnits}
                    onChange={(e) => setPutawayForm({ ...putawayForm, quantityUnits: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Unit Valuation ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={putawayForm.unitValuation}
                    onChange={(e) => setPutawayForm({ ...putawayForm, unitValuation: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPutawayModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition"
                >
                  Allocate to Bay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

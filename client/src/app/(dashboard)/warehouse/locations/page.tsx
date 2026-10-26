'use client';

import React, { useState } from 'react';
import {
  Grid,
  Plus,
  Box,
  Layers,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { BinLocationItem } from '@/types/warehouse';

const initialBins: BinLocationItem[] = [
  { id: 'b-1', binCode: 'ZONE-A-RACK-01-S1', zone: 'ZONE_A_RAW', aisle: 'Aisle 01', rack: 'Rack 01', shelf: 'Shelf 01', capacityMaxUnits: 800, currentOccupancyUnits: 420, isQuarantine: false },
  { id: 'b-2', binCode: 'ZONE-A-RACK-02-B1', zone: 'ZONE_A_RAW', aisle: 'Aisle 02', rack: 'Rack 02', shelf: 'Shelf 01', capacityMaxUnits: 500, currentOccupancyUnits: 85, isQuarantine: false },
  { id: 'b-3', binCode: 'ZONE-A-RACK-03-A1', zone: 'ZONE_A_RAW', aisle: 'Aisle 03', rack: 'Rack 03', shelf: 'Shelf 01', capacityMaxUnits: 1000, currentOccupancyUnits: 620, isQuarantine: false },
  { id: 'b-4', binCode: 'ZONE-B-RACK-01-A2', zone: 'ZONE_B_FINISHED', aisle: 'Aisle 04', rack: 'Rack 01', shelf: 'Shelf 02', capacityMaxUnits: 300, currentOccupancyUnits: 180, isQuarantine: false },
  { id: 'b-5', binCode: 'ZONE-C-RACK-01-D1', zone: 'ZONE_C_CONSUMABLES', aisle: 'Aisle 05', rack: 'Rack 01', shelf: 'Shelf 04', capacityMaxUnits: 50, currentOccupancyUnits: 18, isQuarantine: false },
  { id: 'b-6', binCode: 'ZONE-C-QUARANTINE-01', zone: 'ZONE_C_QUARANTINE', aisle: 'Aisle 06', rack: 'Rack 99', shelf: 'Floor Bay', capacityMaxUnits: 100, currentOccupancyUnits: 3, isQuarantine: true },
];

export default function BinLocationsPage() {
  const [bins, setBins] = useState<BinLocationItem[]>(initialBins);
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [showNewBinModal, setShowNewBinModal] = useState(false);
  const [newBinForm, setNewBinForm] = useState({
    binCode: '',
    zone: 'ZONE_A_RAW',
    aisle: 'Aisle 01',
    rack: 'Rack 04',
    shelf: 'Shelf 01',
    capacityMaxUnits: 600,
    isQuarantine: false,
  });

  const filteredBins = bins.filter(
    (b) => selectedZone === 'ALL' || b.zone === selectedZone,
  );

  const handleCreateBin = (e: React.FormEvent) => {
    e.preventDefault();

    const newBin: BinLocationItem = {
      id: `b-${Date.now()}`,
      binCode: newBinForm.binCode || `ZONE-${newBinForm.zone.split('_')[1]}-${newBinForm.rack}-${newBinForm.shelf}`,
      zone: newBinForm.zone,
      aisle: newBinForm.aisle,
      rack: newBinForm.rack,
      shelf: newBinForm.shelf,
      capacityMaxUnits: Number(newBinForm.capacityMaxUnits),
      currentOccupancyUnits: 0,
      isQuarantine: newBinForm.isQuarantine,
    };

    setBins([...bins, newBin]);
    setShowNewBinModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Grid className="h-6 w-6 text-amber-400" />
            Bin & Rack Layout Optimization Engine
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Storage capacity utilization, 3D rack addresses, and fast item picking path mapping.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewBinModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> Add New Bin Address
        </button>
      </div>

      {/* Zone Filters */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setSelectedZone('ALL')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedZone === 'ALL'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Warehouse Zones ({bins.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedZone('ZONE_A_RAW')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedZone === 'ZONE_A_RAW'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Zone A: Raw Metals
        </button>
        <button
          type="button"
          onClick={() => setSelectedZone('ZONE_B_FINISHED')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedZone === 'ZONE_B_FINISHED'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Zone B: Finished Goods
        </button>
        <button
          type="button"
          onClick={() => setSelectedZone('ZONE_C_QUARANTINE')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedZone === 'ZONE_C_QUARANTINE'
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Zone C: Quarantine Bay
        </button>
      </div>

      {/* Bin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBins.map((bin) => {
          const occupancyPercent = Math.round((bin.currentOccupancyUnits / bin.capacityMaxUnits) * 100);
          const isQuarantine = bin.isQuarantine;
          const isFull = occupancyPercent >= 85;

          return (
            <div
              key={bin.id}
              className={`p-5 rounded-xl border transition-all ${
                isQuarantine
                  ? 'bg-red-950/20 border-red-500/40 shadow-sm'
                  : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-sm font-bold text-white flex items-center gap-1.5">
                    <Box className="h-4 w-4 text-amber-400" />
                    {bin.binCode}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {bin.aisle} &bull; {bin.rack} &bull; {bin.shelf}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isQuarantine
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : isFull
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {isQuarantine ? 'Quarantine Bay' : `${occupancyPercent}% Utilized`}
                </span>
              </div>

              {/* Progress Utilization Meter */}
              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Occupancy:</span>
                  <span className="font-mono text-white">
                    {bin.currentOccupancyUnits} / {bin.capacityMaxUnits} Units
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isQuarantine
                        ? 'bg-red-500'
                        : isFull
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-amber-500 to-orange-400'
                    }`}
                    style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Domain: <strong className="text-slate-200">{bin.zone.replace(/_/g, ' ')}</strong></span>
                <span className="text-amber-400 hover:underline cursor-pointer">
                  Inspect Bin &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add New Bin */}
      {showNewBinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Grid className="h-5 w-5 text-amber-400" />
                Define Storage Bin Address
              </h3>
              <button
                type="button"
                onClick={() => setShowNewBinModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateBin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Bin Coordinate Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ZONE-A-RACK-04-S2"
                  value={newBinForm.binCode}
                  onChange={(e) => setNewBinForm({ ...newBinForm, binCode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Zone Domain</label>
                  <select
                    value={newBinForm.zone}
                    onChange={(e) => setNewBinForm({ ...newBinForm, zone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ZONE_A_RAW">Zone A: Raw Metals</option>
                    <option value="ZONE_B_FINISHED">Zone B: Finished Goods</option>
                    <option value="ZONE_C_CONSUMABLES">Zone C: Consumables</option>
                    <option value="ZONE_C_QUARANTINE">Zone C: Quarantine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Max Capacity Units</label>
                  <input
                    type="number"
                    required
                    value={newBinForm.capacityMaxUnits}
                    onChange={(e) => setNewBinForm({ ...newBinForm, capacityMaxUnits: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="quarantineCheck"
                  checked={newBinForm.isQuarantine}
                  onChange={(e) => setNewBinForm({ ...newBinForm, isQuarantine: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 accent-amber-500"
                />
                <label htmlFor="quarantineCheck" className="text-slate-700 dark:text-slate-300">
                  Quarantine / Defect Hold Storage Designation
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBinModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold bg-amber-600 hover:bg-amber-500 text-white"
                >
                  Register Bin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

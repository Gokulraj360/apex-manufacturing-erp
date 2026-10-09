'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Layers,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  PackagePlus,
  Building2,
  X,
  Gauge,
  Tag,
  Hash,
  ExternalLink,
  ChevronRight,
  ArrowDownLeft,
  Check,
  RefreshCw,
  Warehouse,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type WarehouseZoneType =
  | 'ZONE_A_RAW_METALS'
  | 'ZONE_B_TOOLING'
  | 'ZONE_C_CLEANROOM'
  | 'ZONE_D_FASTENERS'
  | 'ZONE_Q_QUARANTINE';

export interface WarehouseBinCell {
  id: string;
  binCode: string;
  zone: WarehouseZoneType;
  aisle: string;
  rack: string;
  shelf: string;
  binNumber: string;
  itemId?: string;
  itemCode?: string;
  itemName?: string;
  batchNumber?: string;
  heatNumber?: string;
  currentQty: number;
  maxCapacity: number;
  uom: string;
  minSafetyQty: number;
  isQuarantine: boolean;
  isOccupied: boolean;
  lastPutawayAt?: string;
  quarantineReason?: string;
}

export interface PendingGRNItem {
  id: string;
  grnNumber: string;
  mirNumber: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  heatNumber?: string;
  receivedQty: number;
  uom: string;
  recommendedZone: WarehouseZoneType;
  recommendedBin: string;
}

// ============================================================================
// Sample Mock Data
// ============================================================================

const mockBins: WarehouseBinCell[] = [
  // Zone A - Raw Metals
  {
    id: 'bin-a1',
    binCode: 'A-01-B1',
    zone: 'ZONE_A_RAW_METALS',
    aisle: 'A1',
    rack: 'R1',
    shelf: 'S1',
    binNumber: 'B1',
    itemId: 'item-1',
    itemCode: 'RAW-STL-001',
    itemName: 'Cold-Rolled Carbon Steel Coil 1018',
    batchNumber: 'LOT-2026-TATA-881',
    heatNumber: 'HT-1018-992B',
    currentQty: 3500,
    maxCapacity: 5000,
    uom: 'KG',
    minSafetyQty: 1000,
    isQuarantine: false,
    isOccupied: true,
    lastPutawayAt: '2026-10-01 11:45',
  },
  {
    id: 'bin-a2',
    binCode: 'A-01-B2',
    zone: 'ZONE_A_RAW_METALS',
    aisle: 'A1',
    rack: 'R1',
    shelf: 'S2',
    binNumber: 'B2',
    itemId: 'item-1',
    itemCode: 'RAW-STL-001',
    itemName: 'Cold-Rolled Carbon Steel Coil 1018',
    batchNumber: 'LOT-2026-TATA-870',
    heatNumber: 'HT-1018-980A',
    currentQty: 450,
    maxCapacity: 5000,
    uom: 'KG',
    minSafetyQty: 1000,
    isQuarantine: false,
    isOccupied: true,
    lastPutawayAt: '2026-09-28 14:10',
  },
  {
    id: 'bin-a3',
    binCode: 'A-02-B1',
    zone: 'ZONE_A_RAW_METALS',
    aisle: 'A2',
    rack: 'R2',
    shelf: 'S1',
    binNumber: 'B1',
    currentQty: 0,
    maxCapacity: 5000,
    uom: 'KG',
    minSafetyQty: 0,
    isQuarantine: false,
    isOccupied: false,
  },
  {
    id: 'bin-a4',
    binCode: 'A-02-B2',
    zone: 'ZONE_A_RAW_METALS',
    aisle: 'A2',
    rack: 'R2',
    shelf: 'S2',
    binNumber: 'B2',
    itemId: 'item-8',
    itemCode: 'BUSH-BRZ-30MM',
    itemName: 'Phosphor Bronze Sleeve Blank 30mm',
    batchNumber: 'LOT-BRZ-9021',
    currentQty: 25,
    maxCapacity: 200,
    uom: 'PCS',
    minSafetyQty: 50,
    isQuarantine: false,
    isOccupied: true,
    lastPutawayAt: '2026-09-29 09:30',
  },

  // Zone B - Tooling & Plungers
  {
    id: 'bin-b1',
    binCode: 'B-01-B1',
    zone: 'ZONE_B_TOOLING',
    aisle: 'B1',
    rack: 'R1',
    shelf: 'S1',
    binNumber: 'B1',
    itemId: 'item-7',
    itemCode: 'PLN-CRB-18MM',
    itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
    batchNumber: 'LOT-SAND-18MM-04',
    heatNumber: 'SND-WC-0881',
    currentQty: 50,
    maxCapacity: 100,
    uom: 'PCS',
    minSafetyQty: 20,
    isQuarantine: false,
    isOccupied: true,
    lastPutawayAt: '2026-10-01 12:15',
  },
  {
    id: 'bin-b2',
    binCode: 'B-01-B2',
    zone: 'ZONE_B_TOOLING',
    aisle: 'B1',
    rack: 'R1',
    shelf: 'S2',
    binNumber: 'B2',
    itemId: 'item-7',
    itemCode: 'PLN-CRB-18MM',
    itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
    batchNumber: 'LOT-SAND-18MM-02',
    currentQty: 12,
    maxCapacity: 100,
    uom: 'PCS',
    minSafetyQty: 20,
    isQuarantine: false,
    isOccupied: true,
    lastPutawayAt: '2026-09-25 15:40',
  },
  {
    id: 'bin-b3',
    binCode: 'B-02-B1',
    zone: 'ZONE_B_TOOLING',
    aisle: 'B2',
    rack: 'R2',
    shelf: 'S1',
    binNumber: 'B1',
    currentQty: 0,
    maxCapacity: 150,
    uom: 'PCS',
    minSafetyQty: 0,
    isQuarantine: false,
    isOccupied: false,
  },

  // Zone C - Cleanroom & Motors
  {
    id: 'bin-c1',
    binCode: 'C-01-B1',
    zone: 'ZONE_C_CLEANROOM',
    aisle: 'C1',
    rack: 'R1',
    shelf: 'S1',
    binNumber: 'B1',
    itemId: 'item-4',
    itemCode: 'RAW-MTR-003',
    itemName: 'Brushless DC Coreless Motor 48V (750W)',
    batchNumber: 'LOT-MOOG-48V-01',
    heatNumber: 'CAL-TQC-4011',
    currentQty: 15,
    maxCapacity: 30,
    uom: 'PCS',
    minSafetyQty: 10,
    isQuarantine: false,
    isOccupied: true,
    lastPutawayAt: '2026-10-01 14:20',
  },
  {
    id: 'bin-c2',
    binCode: 'C-01-B2',
    zone: 'ZONE_C_CLEANROOM',
    aisle: 'C1',
    rack: 'R1',
    shelf: 'S2',
    binNumber: 'B2',
    itemId: 'item-4',
    itemCode: 'RAW-MTR-003',
    itemName: 'Brushless DC Coreless Motor 48V (750W)',
    batchNumber: 'LOT-MOOG-48V-PREV',
    currentQty: 4,
    maxCapacity: 30,
    uom: 'PCS',
    minSafetyQty: 10,
    isQuarantine: false,
    isOccupied: true,
    lastPutawayAt: '2026-09-18 10:00',
  },
  {
    id: 'bin-c3',
    binCode: 'C-02-B1',
    zone: 'ZONE_C_CLEANROOM',
    aisle: 'C2',
    rack: 'R2',
    shelf: 'S1',
    binNumber: 'B1',
    currentQty: 0,
    maxCapacity: 50,
    uom: 'PCS',
    minSafetyQty: 0,
    isQuarantine: false,
    isOccupied: false,
  },

  // Zone D - Fasteners & Hardware
  {
    id: 'bin-d1',
    binCode: 'D-01-B1',
    zone: 'ZONE_D_FASTENERS',
    aisle: 'D1',
    rack: 'R1',
    shelf: 'S1',
    binNumber: 'B1',
    itemId: 'item-3',
    itemCode: 'FAST-HEX-M12',
    itemName: 'Hex Flange Head Bolt M12x45 Grade 10.9',
    batchNumber: 'LOT-UNB-1092-A',
    heatNumber: 'HT-UNB-771',
    currentQty: 950,
    maxCapacity: 2500,
    uom: 'PCS',
    minSafetyQty: 500,
    isQuarantine: false,
    isOccupied: true,
    lastPutawayAt: '2026-10-01 11:00',
  },
  {
    id: 'bin-d2',
    binCode: 'D-01-B2',
    zone: 'ZONE_D_FASTENERS',
    aisle: 'D1',
    rack: 'R1',
    shelf: 'S2',
    binNumber: 'B2',
    itemId: 'item-5',
    itemCode: 'BRG-6205-2RS',
    itemName: 'Deep Groove Radial Ball Bearing 25x52x15',
    batchNumber: 'LOT-SKF-6205-99',
    currentQty: 200,
    maxCapacity: 800,
    uom: 'PCS',
    minSafetyQty: 100,
    isQuarantine: false,
    isOccupied: true,
    lastPutawayAt: '2026-10-01 11:35',
  },

  // Zone Q - Quarantine & Hold Bay
  {
    id: 'bin-q1',
    binCode: 'Q-01-HLD',
    zone: 'ZONE_Q_QUARANTINE',
    aisle: 'Q1',
    rack: 'R1',
    shelf: 'S1',
    binNumber: 'B1',
    itemId: 'item-3',
    itemCode: 'FAST-HEX-M12',
    itemName: 'Hex Flange Head Bolt M12x45 Grade 10.9',
    batchNumber: 'LOT-UNB-1092-A',
    currentQty: 50,
    maxCapacity: 500,
    uom: 'PCS',
    minSafetyQty: 0,
    isQuarantine: true,
    isOccupied: true,
    quarantineReason: 'MIR-2026-0127: Zinc burrs and thread pitch gauge failure (DN-2026-0014)',
    lastPutawayAt: '2026-10-01 11:05',
  },
  {
    id: 'bin-q2',
    binCode: 'Q-02-HLD',
    zone: 'ZONE_Q_QUARANTINE',
    aisle: 'Q1',
    rack: 'R1',
    shelf: 'S2',
    binNumber: 'B2',
    itemId: 'item-2',
    itemCode: 'RAW-SEAL-002',
    itemName: 'Fluorosilicone High-Temp O-Ring Seal',
    batchNumber: 'LOT-SEAL-8891',
    currentQty: 500,
    maxCapacity: 1000,
    uom: 'PCS',
    minSafetyQty: 0,
    isQuarantine: true,
    isOccupied: true,
    quarantineReason: 'MIR-2026-0126: Cord thickness undersized by 0.4mm (DN-2026-0013)',
    lastPutawayAt: '2026-09-30 16:30',
  },
  {
    id: 'bin-q3',
    binCode: 'Q-03-HLD',
    zone: 'ZONE_Q_QUARANTINE',
    aisle: 'Q2',
    rack: 'R2',
    shelf: 'S1',
    binNumber: 'B1',
    currentQty: 0,
    maxCapacity: 500,
    uom: 'PCS',
    minSafetyQty: 0,
    isQuarantine: true,
    isOccupied: false,
  },
];

const mockPendingGRNs: PendingGRNItem[] = [
  {
    id: 'grn-1',
    grnNumber: 'GRN-2026-0044',
    mirNumber: 'MIR-2026-0129',
    itemCode: 'RAW-STL-001',
    itemName: 'Cold-Rolled Carbon Steel Coil 1018',
    batchNumber: 'LOT-2026-TATA-905',
    heatNumber: 'HT-1018-999C',
    receivedQty: 2500,
    uom: 'KG',
    recommendedZone: 'ZONE_A_RAW_METALS',
    recommendedBin: 'A-02-B1',
  },
  {
    id: 'grn-2',
    grnNumber: 'GRN-2026-0045',
    mirNumber: 'MIR-2026-0130',
    itemCode: 'PLN-CRB-18MM',
    itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
    batchNumber: 'LOT-SAND-18MM-05',
    heatNumber: 'SND-WC-0910',
    receivedQty: 40,
    uom: 'PCS',
    recommendedZone: 'ZONE_B_TOOLING',
    recommendedBin: 'B-02-B1',
  },
];

export default function WarehousePutawayMatrixPage() {
  const [bins, setBins] = useState<WarehouseBinCell[]>(mockBins);
  const [pendingGRNs, setPendingGRNs] = useState<PendingGRNItem[]>(mockPendingGRNs);
  const [activeZone, setActiveZone] = useState<WarehouseZoneType>('ZONE_A_RAW_METALS');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Selected bin for detail view
  const [selectedBin, setSelectedBin] = useState<WarehouseBinCell | null>(null);

  // Putaway Modal State
  const [isPutawayModalOpen, setIsPutawayModalOpen] = useState(false);
  const [selectedGRNId, setSelectedGRNId] = useState<string>(mockPendingGRNs[0]?.id || '');
  const [targetBinCode, setTargetBinCode] = useState<string>(mockPendingGRNs[0]?.recommendedBin || '');
  const [putawayQty, setPutawayQty] = useState<number>(mockPendingGRNs[0]?.receivedQty || 0);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Warehouse KPIs
  const warehouseKPIs = useMemo(() => {
    const totalBins = bins.length;
    const occupiedBins = bins.filter((b) => b.isOccupied).length;
    const occupancyRate = totalBins > 0 ? Math.round((occupiedBins / totalBins) * 100) : 0;
    const lowStockBins = bins.filter((b) => b.isOccupied && b.currentQty <= b.minSafetyQty).length;
    const quarantineLots = bins.filter((b) => b.isQuarantine && b.isOccupied).length;

    return {
      totalBins,
      occupiedBins,
      occupancyRate,
      lowStockBins,
      quarantineLots,
    };
  }, [bins]);

  // Filtered Bins in the selected Zone
  const zoneBins = useMemo(() => {
    return bins.filter((bin) => {
      const matchesZone = bin.zone === activeZone;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        bin.binCode.toLowerCase().includes(q) ||
        (bin.itemCode && bin.itemCode.toLowerCase().includes(q)) ||
        (bin.itemName && bin.itemName.toLowerCase().includes(q)) ||
        (bin.batchNumber && bin.batchNumber.toLowerCase().includes(q));

      const matchesLowStock = !filterLowStockOnly || (bin.isOccupied && bin.currentQty <= bin.minSafetyQty);

      return matchesZone && matchesSearch && matchesLowStock;
    });
  }, [bins, activeZone, searchQuery, filterLowStockOnly]);

  // Handle GRN selection in Putaway modal
  const handleGRNSelect = (grnId: string) => {
    setSelectedGRNId(grnId);
    const grn = pendingGRNs.find((g) => g.id === grnId);
    if (grn) {
      setTargetBinCode(grn.recommendedBin);
      setPutawayQty(grn.receivedQty);
    }
  };

  // Submit Putaway Allocation
  const handleExecutePutaway = (e: React.FormEvent) => {
    e.preventDefault();

    const grn = pendingGRNs.find((g) => g.id === selectedGRNId);
    if (!grn) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Update target bin
    setBins((prev) =>
      prev.map((bin) => {
        if (bin.binCode === targetBinCode) {
          return {
            ...bin,
            isOccupied: true,
            itemCode: grn.itemCode,
            itemName: grn.itemName,
            batchNumber: grn.batchNumber,
            heatNumber: grn.heatNumber,
            currentQty: bin.currentQty + putawayQty,
            uom: grn.uom,
            minSafetyQty: bin.minSafetyQty || Math.round(putawayQty * 0.25),
            lastPutawayAt: nowStr,
          };
        }
        return bin;
      })
    );

    // Remove from pending GRNs
    setPendingGRNs((prev) => prev.filter((g) => g.id !== selectedGRNId));
    setIsPutawayModalOpen(false);
    showNotification(
      `Putaway completed! Stock ${grn.itemCode} (${putawayQty} ${grn.uom}) successfully allocated to Bin ${targetBinCode}.`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Warehouse Putaway & Bin/Rack Matrix
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Inventory Staging
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual spatial mapping of inventory lots, physical bin & rack storage capacity, heat/batch lineage, and real-time re-order safety thresholds.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors',
              filterLowStockOnly
                ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            )}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            {filterLowStockOnly ? 'Showing Re-order Alerts' : 'Filter Re-order Alerts'}
          </button>

          <button
            type="button"
            onClick={() => setIsPutawayModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <PackagePlus className="w-4 h-4" />
            Allocate Putaway ({pendingGRNs.length} GRNs)
          </button>
        </div>
      </div>

      {/* Top Warehouse KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Warehouse Space Occupancy
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
            {warehouseKPIs.occupancyRate}%
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
            {warehouseKPIs.occupiedBins} of {warehouseKPIs.totalBins} Storage Bins Allocated
          </div>
        </div>

        {/* Low Stock Reorder Alerts */}
        <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Re-order Warning Bins
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-800 dark:text-rose-200 mt-2">
            {warehouseKPIs.lowStockBins} Bins
          </div>
          <div className="text-xs text-rose-700 dark:text-rose-300 mt-1 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Below safety buffer threshold
          </div>
        </div>

        {/* Quarantine Bins */}
        <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Quarantine Isolation
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-800 dark:text-amber-200 mt-2">
            {warehouseKPIs.quarantineLots} Lots
          </div>
          <div className="text-xs text-amber-700 dark:text-amber-300 mt-1 font-medium">
            Segregated in Zone Q Hold Bays
          </div>
        </div>

        {/* Pending GRNs Staging */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Putaway GRNs
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <PackagePlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {pendingGRNs.length} Lots
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Passed MIR &bull; Ready for rack assignment
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Zone Switcher Tabs & Search Filter */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Zone Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveZone('ZONE_A_RAW_METALS')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
              activeZone === 'ZONE_A_RAW_METALS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            Zone A &bull; Raw Metals
          </button>
          <button
            type="button"
            onClick={() => setActiveZone('ZONE_B_TOOLING')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
              activeZone === 'ZONE_B_TOOLING'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            Zone B &bull; Tooling & Plungers
          </button>
          <button
            type="button"
            onClick={() => setActiveZone('ZONE_C_CLEANROOM')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
              activeZone === 'ZONE_C_CLEANROOM'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            Zone C &bull; Cleanroom Motors
          </button>
          <button
            type="button"
            onClick={() => setActiveZone('ZONE_D_FASTENERS')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
              activeZone === 'ZONE_D_FASTENERS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            Zone D &bull; Fasteners
          </button>
          <button
            type="button"
            onClick={() => setActiveZone('ZONE_Q_QUARANTINE')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1',
              activeZone === 'ZONE_Q_QUARANTINE'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-600 dark:text-rose-400 hover:text-rose-800'
            )}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Zone Q &bull; Quarantine Bay
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Bin code, SKU, or Batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Visual Bin & Rack Matrix Grid */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Displaying <strong>{zoneBins.length} Storage Bins</strong> in {activeZone.replace('ZONE_', 'Zone ').replace('_', ' ')}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Normal Occupied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Re-order Warning (&lt; Buffer)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-700" /> Available Bin
            </span>
          </div>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {zoneBins.map((bin) => {
            const isLowStock = bin.isOccupied && bin.currentQty <= bin.minSafetyQty;
            const fillPercent = Math.min(100, Math.round((bin.currentQty / bin.maxCapacity) * 100));

            return (
              <div
                key={bin.id}
                onClick={() => setSelectedBin(bin)}
                className={cn(
                  'p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group hover:shadow-md',
                  bin.isQuarantine
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20'
                    : isLowStock
                    ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20'
                    : bin.isOccupied
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30'
                )}
              >
                {/* Bin Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                      {bin.binCode}
                    </span>

                    {/* Status Badge */}
                    {bin.isQuarantine ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> QUARANTINE
                      </span>
                    ) : isLowStock ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> REORDER ALERT
                      </span>
                    ) : bin.isOccupied ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        OCCUPIED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800">
                        EMPTY / READY
                      </span>
                    )}
                  </div>

                  {/* Bin Content */}
                  {bin.isOccupied ? (
                    <div className="mt-2.5 space-y-1.5 text-xs">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {bin.itemCode}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate font-medium">
                        {bin.itemName}
                      </div>

                      {/* Batch & Heat Tag */}
                      <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-slate-500">
                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {bin.batchNumber}
                        </span>
                        {bin.heatNumber && (
                          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                            {bin.heatNumber}
                          </span>
                        )}
                      </div>

                      {/* Stock Level & Capacity Bar */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                          <span className={cn(isLowStock ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300')}>
                            {bin.currentQty.toLocaleString()} {bin.uom}
                          </span>
                          <span className="text-slate-400 font-normal">
                            Max {bin.maxCapacity.toLocaleString()} {bin.uom} ({fillPercent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              bin.isQuarantine
                                ? 'bg-rose-500'
                                : isLowStock
                                ? 'bg-amber-500'
                                : fillPercent > 85
                                ? 'bg-blue-600'
                                : 'bg-emerald-500'
                            )}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Empty Slot &bull; Max Cap: {bin.maxCapacity.toLocaleString()} {bin.uom}
                    </div>
                  )}
                </div>

                {/* Footer Coordinates & Putaway Time */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Aisle {bin.aisle} &bull; Rack {bin.rack}</span>
                  {bin.lastPutawayAt ? (
                    <span>Putaway: {bin.lastPutawayAt.split(' ')[0]}</span>
                  ) : (
                    <span className="text-blue-600 group-hover:underline font-semibold">Allocate &rarr;</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Allocate Putaway from Incoming GRN */}
      {/* ========================================================================= */}
      {isPutawayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Warehouse Putaway Stock Allocation
                  </h3>
                  <span className="text-xs text-slate-400">
                    Assign certified incoming GRN lot to optimal physical warehouse bin
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPutawayModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecutePutaway} className="space-y-4 py-4 text-xs">
              {/* Select GRN */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Certified Incoming GRN Lot *
                </label>
                <select
                  value={selectedGRNId}
                  onChange={(e) => handleGRNSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {pendingGRNs.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.grnNumber} &bull; {g.itemCode} ({g.receivedQty} {g.uom})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Bin Code */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Destination Bin Code *
                </label>
                <input
                  type="text"
                  value={targetBinCode}
                  onChange={(e) => setTargetBinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. A-02-B1"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono font-bold text-blue-600 dark:text-blue-400"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  System recommendation based on category proximity and rack load limit.
                </span>
              </div>

              {/* Putaway Quantity */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Putaway Transfer Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={putawayQty}
                  onChange={(e) => setPutawayQty(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPutawayModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Confirm Stock Putaway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Bin Inspection & Batch Lot Detail View */}
      {/* ========================================================================= */}
      {selectedBin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                  {selectedBin.binCode}
                </span>
                <span className="text-xs text-slate-400">&bull; {selectedBin.zone.replace('ZONE_', 'Zone ').replace('_', ' ')}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBin(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              {selectedBin.isOccupied ? (
                <>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                    <span className="text-slate-400 text-[10px] block">STORED ITEM SKU</span>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100 block">
                      {selectedBin.itemCode}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 block">
                      {selectedBin.itemName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-slate-400 text-[10px] block">Batch Number</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {selectedBin.batchNumber || '-'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-slate-400 text-[10px] block">Heat / MTR Ref</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {selectedBin.heatNumber || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-slate-400 text-[10px] block">Current Stored Qty</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {selectedBin.currentQty.toLocaleString()} {selectedBin.uom}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-slate-400 text-[10px] block">Max Slot Capacity</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {selectedBin.maxCapacity.toLocaleString()} {selectedBin.uom}
                      </span>
                    </div>
                  </div>

                  {selectedBin.quarantineReason && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
                      <span className="font-bold block mb-0.5">Quarantine Isolation Reason:</span>
                      {selectedBin.quarantineReason}
                    </div>
                  )}

                  {selectedBin.currentQty <= selectedBin.minSafetyQty && !selectedBin.isQuarantine && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300">
                      <span className="font-bold block mb-0.5">Re-order Warning Triggered:</span>
                      Current stock ({selectedBin.currentQty} {selectedBin.uom}) is below the required safety threshold ({selectedBin.minSafetyQty} {selectedBin.uom}). Automated MRP replenishment requisition advised.
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  This storage bin is empty and ready for incoming putaway allocations.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedBin(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

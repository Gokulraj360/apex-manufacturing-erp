'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Layers,
  Cpu,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Send,
  Zap,
  Info,
  Clock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  X,
  BadgeAlert,
  Percent,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Sample Data for PPC & MRP
// ============================================================================

export type MPSStatusType = 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface MPSRecord {
  id: string;
  planNumber: string;
  salesOrderNumber?: string;
  customerName?: string;
  finishedItemCode: string;
  finishedItemName: string;
  bomNumber: string;
  bomVersion: string;
  plannedQty: number;
  producedQty: number;
  startDate: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: MPSStatusType;
}

export interface MRPMaterialRow {
  id: string;
  code: string;
  name: string;
  category: 'RAW_MATERIAL' | 'WIP' | 'CONSUMABLE';
  uom: string;
  level: number;
  netQtyPerUnit: number;
  scrapRate: number;
  grossRequiredQty: number;
  currentStock: number;
  minSafetyStock: number;
  shortageQty: number;
  isShortage: boolean;
  autoPRNumber?: string;
  prStatus?: 'AUTO_TRIGGERED' | 'PO_ISSUED';
  unitCost: number;
  leadTimeDays: number;
}

const mockMPSList: MPSRecord[] = [
  {
    id: 'mps-1',
    planNumber: 'MPS-2026-001',
    salesOrderNumber: 'SO-2026-081',
    customerName: 'Bharat Heavy Engineering Corp',
    finishedItemCode: 'FG-PMP-100',
    finishedItemName: 'Industrial Triplex Plunger Pump 500 Bar System',
    bomNumber: 'BOM-PMP-100-MAIN',
    bomVersion: '2.1',
    plannedQty: 10,
    producedQty: 2,
    startDate: '2026-03-30',
    dueDate: '2026-04-10',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
  },
  {
    id: 'mps-2',
    planNumber: 'MPS-2026-002',
    salesOrderNumber: 'SO-2026-082',
    customerName: 'Tata Power Renewable Microgrids',
    finishedItemCode: 'FG-BAT-15KWH',
    finishedItemName: '48V 15kWh Modular Energy Storage Battery Rack',
    bomNumber: 'BOM-EV-BATTPACK-01',
    bomVersion: '1.4',
    plannedQty: 6,
    producedQty: 0,
    startDate: '2026-04-02',
    dueDate: '2026-04-18',
    priority: 'HIGH',
    status: 'RELEASED',
  },
  {
    id: 'mps-3',
    planNumber: 'MPS-2026-003',
    salesOrderNumber: 'SO-2026-079',
    customerName: 'Larsen & Toubro Hydrocarbon Ltd',
    finishedItemCode: 'SA-PMP-HEAD',
    finishedItemName: 'Machined Pump Head & Manifold Sub-Assembly',
    bomNumber: 'BOM-SA-HEAD-01',
    bomVersion: '1.0',
    plannedQty: 40,
    producedQty: 38,
    startDate: '2026-03-15',
    dueDate: '2026-03-29',
    priority: 'MEDIUM',
    status: 'COMPLETED',
  },
  {
    id: 'mps-4',
    planNumber: 'MPS-2026-004',
    finishedItemCode: 'FG-PMP-100',
    finishedItemName: 'Industrial Triplex Plunger Pump 500 Bar System',
    bomNumber: 'BOM-PMP-100-MAIN',
    bomVersion: '2.1',
    plannedQty: 15,
    producedQty: 0,
    startDate: '2026-04-12',
    dueDate: '2026-04-28',
    priority: 'MEDIUM',
    status: 'PLANNED',
  },
];

const basePumpBOM = [
  {
    id: 'mat-1',
    code: 'RAW-STL-001',
    name: 'Cold-Rolled Carbon Steel Coil 1018 (Billet Blank)',
    category: 'RAW_MATERIAL' as const,
    uom: 'KG',
    level: 3,
    netQtyPerUnit: 14.5,
    scrapRate: 4.5,
    currentStock: 120,
    minSafetyStock: 50,
    unitCost: 2.15,
    leadTimeDays: 4,
  },
  {
    id: 'mat-2',
    code: 'RAW-SEAL-002',
    name: 'Fluorosilicone High-Temp O-Ring Seal',
    category: 'CONSUMABLE' as const,
    uom: 'PCS',
    level: 3,
    netQtyPerUnit: 6,
    scrapRate: 3.0,
    currentStock: 450,
    minSafetyStock: 100,
    unitCost: 4.5,
    leadTimeDays: 2,
  },
  {
    id: 'mat-3',
    code: 'FAST-HEX-M12',
    name: 'Hex Flange Head Bolt M12x45 Grade 10.9',
    category: 'CONSUMABLE' as const,
    uom: 'PCS',
    level: 3,
    netQtyPerUnit: 12,
    scrapRate: 1.0,
    currentStock: 1400,
    minSafetyStock: 300,
    unitCost: 0.85,
    leadTimeDays: 1,
  },
  {
    id: 'mat-4',
    code: 'RAW-MTR-003',
    name: 'Brushless DC Coreless Motor 48V (750W)',
    category: 'RAW_MATERIAL' as const,
    uom: 'PCS',
    level: 3,
    netQtyPerUnit: 1,
    scrapRate: 0.0,
    currentStock: 6,
    minSafetyStock: 5,
    unitCost: 148.0,
    leadTimeDays: 8,
  },
  {
    id: 'mat-5',
    code: 'BRG-6205-2RS',
    name: 'Deep Groove Radial Ball Bearing 25x52x15',
    category: 'RAW_MATERIAL' as const,
    uom: 'PCS',
    level: 3,
    netQtyPerUnit: 2,
    scrapRate: 1.5,
    currentStock: 80,
    minSafetyStock: 25,
    unitCost: 8.75,
    leadTimeDays: 3,
  },
  {
    id: 'mat-6',
    code: 'LUB-SYN-ISO220',
    name: 'Synthetic High-Load Gear Lubricant ISO VG 220',
    category: 'CONSUMABLE' as const,
    uom: 'LTR',
    level: 3,
    netQtyPerUnit: 0.75,
    scrapRate: 4.0,
    currentStock: 25.0,
    minSafetyStock: 10,
    unitCost: 18.2,
    leadTimeDays: 2,
  },
  {
    id: 'mat-7',
    code: 'PLN-CRB-18MM',
    name: 'Tungsten Carbide Plunger Piston 18mm OD',
    category: 'RAW_MATERIAL' as const,
    uom: 'PCS',
    level: 2,
    netQtyPerUnit: 3,
    scrapRate: 1.0,
    currentStock: 18,
    minSafetyStock: 12,
    unitCost: 42.0,
    leadTimeDays: 14,
  },
  {
    id: 'mat-8',
    code: 'VLV-CHK-SS316',
    name: 'Stainless Steel 316 High-Pressure Check Valve Cartridge',
    category: 'RAW_MATERIAL' as const,
    uom: 'PCS',
    level: 2,
    netQtyPerUnit: 6,
    scrapRate: 0.5,
    currentStock: 150,
    minSafetyStock: 40,
    unitCost: 26.5,
    leadTimeDays: 5,
  },
  {
    id: 'mat-9',
    code: 'GAU-PRS-001',
    name: 'Digital Glycerin Pressure Gauge 0-600 Bar G1/4',
    category: 'RAW_MATERIAL' as const,
    uom: 'PCS',
    level: 2,
    netQtyPerUnit: 1,
    scrapRate: 0.0,
    currentStock: 4,
    minSafetyStock: 5,
    unitCost: 75.0,
    leadTimeDays: 7,
  },
  {
    id: 'mat-10',
    code: 'PKG-CRATE-HD',
    name: 'ISPM-15 Certified Heavy Duty Wooden Export Crate',
    category: 'CONSUMABLE' as const,
    uom: 'BOX',
    level: 2,
    netQtyPerUnit: 1,
    scrapRate: 0.0,
    currentStock: 30,
    minSafetyStock: 10,
    unitCost: 35.0,
    leadTimeDays: 2,
  },
];

export default function PPCManagementPage() {
  const [mpsList, setMpsList] = useState<MPSRecord[]>(mockMPSList);
  const [selectedMpsId, setSelectedMpsId] = useState<string>('mps-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'SHORTAGE' | 'IN_STOCK'>('ALL');
  const [triggeredPRs, setTriggeredPRs] = useState<Record<string, string>>({
    'RAW-STL-001': 'PR-2026-091A',
    'RAW-MTR-003': 'PR-2026-092B',
  });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [isNewMpsModalOpen, setIsNewMpsModalOpen] = useState(false);
  const [newPlanNumber, setNewPlanNumber] = useState('');
  const [newFinishedItem, setNewFinishedItem] = useState('FG-PMP-100');
  const [newPlannedQty, setNewPlannedQty] = useState('12');
  const [newStartDate, setNewStartDate] = useState('2026-04-05');
  const [newDueDate, setNewDueDate] = useState('2026-04-20');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');

  const showNotification = (msg: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const activeMPS = useMemo(() => {
    return mpsList.find((m) => m.id === selectedMpsId) || mpsList[0];
  }, [mpsList, selectedMpsId]);

  const mrpMatrix = useMemo(() => {
    const batchQty = activeMPS.plannedQty;

    return basePumpBOM.map((mat) => {
      const grossDemand = Number(
        (batchQty * mat.netQtyPerUnit * (1 + mat.scrapRate / 100)).toFixed(2)
      );
      const isShortage = mat.currentStock < grossDemand;
      const shortageQty = isShortage ? Number((grossDemand - mat.currentStock).toFixed(2)) : 0;
      const autoPRNumber = triggeredPRs[mat.code];

      return {
        ...mat,
        grossRequiredQty: grossDemand,
        isShortage,
        shortageQty,
        autoPRNumber,
        prStatus: autoPRNumber ? ('AUTO_TRIGGERED' as const) : undefined,
      };
    });
  }, [activeMPS, triggeredPRs]);

  const mrpStats = useMemo(() => {
    const totalLines = mrpMatrix.length;
    const shortages = mrpMatrix.filter((m) => m.isShortage);
    const inStock = mrpMatrix.filter((m) => !m.isShortage);
    const totalShortageCost = shortages.reduce(
      (sum, m) => sum + m.shortageQty * m.unitCost,
      0
    );

    return {
      totalLines,
      shortageCount: shortages.length,
      inStockCount: inStock.length,
      totalShortageCost,
      allReady: shortages.length === 0,
    };
  }, [mrpMatrix]);

  const filteredMatrix = useMemo(() => {
    return mrpMatrix.filter((row) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        row.code.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q);

      const matchesAvailability =
        availabilityFilter === 'ALL' ||
        (availabilityFilter === 'SHORTAGE' && row.isShortage) ||
        (availabilityFilter === 'IN_STOCK' && !row.isShortage);

      return matchesSearch && matchesAvailability;
    });
  }, [mrpMatrix, searchQuery, availabilityFilter]);

  const handleTriggerAutoPRs = () => {
    const newPRs: Record<string, string> = { ...triggeredPRs };
    let createdCount = 0;

    for (const item of mrpMatrix) {
      if (item.isShortage && !newPRs[item.code]) {
        const prCode = `PR-2026-${Math.floor(100 + Math.random() * 900)}${item.code.substring(4, 6)}`;
        newPRs[item.code] = prCode;
        createdCount++;
      }
    }

    setTriggeredPRs(newPRs);
    showNotification(
      `Triggered ${createdCount} Auto Purchase Requisitions for Procurement Desk!`,
      'success'
    );
  };

  const handleCreateMPSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanNumber.trim()) return;

    const newMPS: MPSRecord = {
      id: `mps-${Date.now()}`,
      planNumber: newPlanNumber.trim().toUpperCase(),
      finishedItemCode: newFinishedItem,
      finishedItemName:
        newFinishedItem === 'FG-PMP-100'
          ? 'Industrial Triplex Plunger Pump 500 Bar System'
          : '48V 15kWh Modular Energy Storage Battery Rack',
      bomNumber: newFinishedItem === 'FG-PMP-100' ? 'BOM-PMP-100-MAIN' : 'BOM-EV-BATTPACK-01',
      bomVersion: '1.0',
      plannedQty: parseInt(newPlannedQty) || 10,
      producedQty: 0,
      startDate: newStartDate,
      dueDate: newDueDate,
      priority: newPriority,
      status: 'PLANNED',
    };

    setMpsList([newMPS, ...mpsList]);
    setSelectedMpsId(newMPS.id);
    setIsNewMpsModalOpen(false);
    setNewPlanNumber('');
    showNotification(`Master Production Schedule ${newMPS.planNumber} created successfully.`);
  };

  const renderPriorityBadge = (priority: MPSRecord['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            LOW
          </span>
        );
    }
  };

  const renderMPSStatus = (status: MPSStatusType) => {
    switch (status) {
      case 'PLANNED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            PLANNED
          </span>
        );
      case 'RELEASED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            RELEASED
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            IN_PROGRESS
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300">
            CANCELLED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              PPC & Master Production Scheduling (MPS)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              MRP Planning Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Evaluate production capacity, explode multi-level BOM recipes, verify inventory availability, and trigger automated purchase requisitions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewMpsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create MPS Schedule
        </button>
      </div>

      {/* MPS Registry */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Master Production Schedule (MPS) Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any schedule to load its active BOM explosion matrix and real-time inventory gap analysis below.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {mpsList.length} Active Production Schedules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
          {mpsList.map((mps) => {
            const isSelected = mps.id === selectedMpsId;
            const progress = Math.min(100, Math.round((mps.producedQty / mps.plannedQty) * 100));

            return (
              <div
                key={mps.id}
                onClick={() => setSelectedMpsId(mps.id)}
                className={cn(
                  'rounded-xl border p-4 transition-all duration-150 cursor-pointer text-left relative overflow-hidden',
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                )}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    {mps.planNumber}
                  </span>
                  {renderPriorityBadge(mps.priority)}
                </div>

                <div className="mt-2 space-y-1">
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {mps.finishedItemCode}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {mps.finishedItemName}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Batch Qty</span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">
                      {mps.plannedQty} PCS
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Due Date</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {mps.dueDate}
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Produced: {mps.producedQty}/{mps.plannedQty}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {renderMPSStatus(mps.status)}
                  {mps.salesOrderNumber && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {mps.salesOrderNumber}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOM Explosion Matrix & Stock Availability Section */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {activeMPS.planNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Recipe: {activeMPS.bomNumber} v{activeMPS.bomVersion}
                </span>
                {activeMPS.customerName && (
                  <span className="text-xs text-slate-500">
                    &bull; Client: {activeMPS.customerName}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                BOM Material Explosion for {activeMPS.plannedQty} Units of {activeMPS.finishedItemCode}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-medium">Availability:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {mrpStats.inStockCount} In-Stock
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span
                className={cn(
                  'font-bold',
                  mrpStats.shortageCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
                )}
              >
                {mrpStats.shortageCount} Shortages
              </span>
            </div>

            {mrpStats.shortageCount > 0 && (
              <button
                type="button"
                onClick={handleTriggerAutoPRs}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all animate-pulse"
              >
                <Zap className="w-3.5 h-3.5" />
                Trigger Auto PR ({mrpStats.shortageCount} Shortages)
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar for Matrix */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search components in explosion matrix..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setAvailabilityFilter('ALL')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                availabilityFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              All Components ({mrpMatrix.length})
            </button>
            <button
              type="button"
              onClick={() => setAvailabilityFilter('SHORTAGE')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1',
                availabilityFilter === 'SHORTAGE'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Shortages ({mrpStats.shortageCount})
            </button>
            <button
              type="button"
              onClick={() => setAvailabilityFilter('IN_STOCK')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1',
                availabilityFilter === 'IN_STOCK'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              In-Stock ({mrpStats.inStockCount})
            </button>
          </div>
        </div>

        {/* Matrix Data Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Component SKU</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Net Req.</th>
                  <th className="py-3 px-4 text-right">Scrap Tol.</th>
                  <th className="py-3 px-4 text-right">Gross Demand</th>
                  <th className="py-3 px-4 text-right">On-Hand Stock</th>
                  <th className="py-3 px-4 text-right">Shortage Gap</th>
                  <th className="py-3 px-4 text-center">Stock Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMatrix.map((item) => (
                  <tr
                    key={item.id}
                    className={cn(
                      'transition-colors',
                      item.isShortage
                        ? 'bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50/60 dark:hover:bg-rose-950/30'
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                    )}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      {'— '.repeat(item.level - 2)}L{item.level}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {item.code}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {item.name}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Lead Time: {item.leadTimeDays} days &bull; Unit Cost: ${item.unitCost}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                      {(item.netQtyPerUnit * activeMPS.plannedQty).toFixed(2)} {item.uom}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {item.scrapRate > 0 ? `${item.scrapRate}%` : '0%'}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-blue-600 dark:text-blue-400">
                      {item.grossRequiredQty} {item.uom}
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                      {item.currentStock} {item.uom}
                    </td>

                    <td className="py-3 px-4 text-right font-bold">
                      {item.isShortage ? (
                        <span className="text-rose-600 dark:text-rose-400">
                          -{item.shortageQty} {item.uom}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">OK</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.isShortage ? (
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                            Shortage - Auto PR Triggered
                          </span>
                          {item.autoPRNumber && (
                            <span className="text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-400">
                              Ref: {item.autoPRNumber}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          In-Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Create MPS Schedule */}
      {isNewMpsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setIsNewMpsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  New Master Production Schedule (MPS)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Plan batch production routing and schedule factory floor capacity.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewMpsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMPSSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Plan Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MPS-2026-005"
                    value={newPlanNumber}
                    onChange={(e) => setNewPlanNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Finished Product <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newFinishedItem}
                    onChange={(e) => setNewFinishedItem(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FG-PMP-100">FG-PMP-100 (Triplex Plunger Pump 500 Bar)</option>
                    <option value="FG-BAT-15KWH">FG-BAT-15KWH (48V 15kWh Battery Rack)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Planned Batch Qty (PCS) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newPlannedQty}
                    onChange={(e) => setNewPlannedQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Production Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Completion Due Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewMpsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Schedule Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

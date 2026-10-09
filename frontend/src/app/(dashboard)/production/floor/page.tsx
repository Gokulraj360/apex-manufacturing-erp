'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Factory,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wrench,
  Clock,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Play,
  Pause,
  Plus,
  Minus,
  Check,
  X,
  RefreshCw,
  Gauge,
  Sliders,
  ChevronRight,
  ClipboardList,
  Boxes,
  Zap,
  Tag,
  Hash,
  Activity,
  User,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type ScrapRootCauseType =
  | 'TOOL_WEAR'
  | 'MATERIAL_FLAW'
  | 'OPERATOR_ERROR'
  | 'THERMAL_DISTORTION'
  | 'CALIBRATION_DRIFT'
  | 'POWER_FLUCTUATION'
  | 'OTHER';

export type DowntimeReasonType =
  | 'MECHANICAL_BREAKDOWN'
  | 'TOOL_JAM_BREAKAGE'
  | 'ELECTRICAL_FAULT'
  | 'HYDRAULIC_FAILURE'
  | 'SENSOR_FAILURE'
  | 'PLANNED_CHANGEOVER'
  | 'RAW_MATERIAL_WAIT';

export interface OperationStep {
  id: string;
  sequence: number;
  operationName: string;
  workstation: string;
  operatorName: string;
  cycleTimeSeconds: number;
  completedQty: number;
  scrapQty: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface MaterialRow {
  id: string;
  itemCode: string;
  itemName: string;
  requiredQty: number;
  consumedQty: number;
  uom: string;
  batchNumber: string;
  heatNumber?: string;
  allocatedBin: string;
}

export interface ScrapEntry {
  id: string;
  defectQty: number;
  rootCause: ScrapRootCauseType;
  defectDetails: string;
  operationName?: string;
  loggedBy: string;
  loggedAt: string;
}

export interface JobCardData {
  id: string;
  jobCardNumber: string;
  productionLine: string;
  batchNumber: string;
  shift: string;
  status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';
  targetQty: number;
  completedQty: number;
  scrapQty: number;
  uom: string;
  cycleTimeSec: number;
  supervisorName: string;
  operatorName: string;
  notes: string;
  startedAt: string;
  item: {
    code: string;
    name: string;
    category: string;
    uom: string;
  };
  operations: OperationStep[];
  materials: MaterialRow[];
  scrapLogs: ScrapEntry[];
}

export interface ActiveDowntime {
  id: string;
  machineCode: string;
  machineName: string;
  productionLine: string;
  reason: DowntimeReasonType;
  rootCauseDetails: string;
  startedAt: string;
  elapsedMinutes: number;
  status: 'ACTIVE' | 'RESOLVED';
  autoDispatched: boolean;
  maintenanceTicketId: string;
  loggedBy: string;
  assignedTechnician: string;
}

// ============================================================================
// Initial Mock Data
// ============================================================================

const initialJobCards: JobCardData[] = [
  {
    id: 'jc-01',
    jobCardNumber: 'JC-2026-0881',
    productionLine: 'Line 3 - CNC Machining Cell',
    batchNumber: 'LOT-2026-TATA-881',
    shift: 'Shift A (Morning 06:00 - 14:00)',
    status: 'IN_PROGRESS',
    targetQty: 250,
    completedQty: 182,
    scrapQty: 6,
    uom: 'PCS',
    cycleTimeSec: 42,
    supervisorName: 'Supervisor R. Verma',
    operatorName: 'Operator K. Shinde',
    notes: 'Priority aerospace batch. Standard OD tolerance: +0.005mm / -0.000mm. Coolant concentration at 8.5%.',
    startedAt: '2026-10-02 06:30',
    item: {
      code: 'PLN-CRB-18MM',
      name: 'Tungsten Carbide Plunger Piston 18mm OD',
      category: 'FINISHED_GOOD',
      uom: 'PCS',
    },
    operations: [
      {
        id: 'op-10',
        sequence: 10,
        operationName: 'Facing & OD Rough Turning',
        workstation: 'CNC-01 Okuma Genos L3000',
        operatorName: 'K. Shinde',
        cycleTimeSeconds: 15,
        completedQty: 182,
        scrapQty: 2,
        status: 'COMPLETED',
      },
      {
        id: 'op-20',
        sequence: 20,
        operationName: 'Precision Finish Turning & Groove',
        workstation: 'CNC-03 Haas ST-20 Lathe',
        operatorName: 'P. Tawde',
        cycleTimeSeconds: 18,
        completedQty: 182,
        scrapQty: 3,
        status: 'IN_PROGRESS',
      },
      {
        id: 'op-30',
        sequence: 30,
        operationName: 'Induction Hardening & Quench',
        workstation: 'HEAT-02 Pillar Induction',
        operatorName: 'M. Gaikwad',
        cycleTimeSeconds: 25,
        completedQty: 150,
        scrapQty: 1,
        status: 'IN_PROGRESS',
      },
      {
        id: 'op-40',
        sequence: 40,
        operationName: 'Centerless OD Grinding',
        workstation: 'GRND-01 Studer S33',
        operatorName: 'S. Nambiar',
        cycleTimeSeconds: 22,
        completedQty: 0,
        scrapQty: 0,
        status: 'PENDING',
      },
    ],
    materials: [
      {
        id: 'mat-01',
        itemCode: 'RAW-STL-001',
        itemName: 'Cold-Rolled Carbon Steel Coil 1018',
        requiredQty: 250,
        consumedQty: 188,
        uom: 'KG',
        batchNumber: 'LOT-2026-TATA-881',
        heatNumber: 'HT-1018-992B',
        allocatedBin: 'A-01-B1',
      },
      {
        id: 'mat-02',
        itemCode: 'TOOL-INS-CNMG',
        itemName: 'Carbide Turning Insert CNMG 120408-PR',
        requiredQty: 5,
        consumedQty: 3,
        uom: 'PCS',
        batchNumber: 'LOT-SAND-2026',
        allocatedBin: 'B-01-B1',
      },
    ],
    scrapLogs: [
      {
        id: 'sl-01',
        defectQty: 2,
        rootCause: 'TOOL_WEAR',
        defectDetails: 'Flank wear on finishing insert caused taper on 18mm diameter exceeding +0.008mm.',
        operationName: 'Precision Finish Turning & Groove',
        loggedBy: 'Supervisor R. Verma',
        loggedAt: '09:15 AM',
      },
      {
        id: 'sl-02',
        defectQty: 3,
        rootCause: 'MATERIAL_FLAW',
        defectDetails: 'Internal seam inclusion visible after rough facing cut.',
        operationName: 'Facing & OD Rough Turning',
        loggedBy: 'Supervisor R. Verma',
        loggedAt: '10:40 AM',
      },
      {
        id: 'sl-03',
        defectQty: 1,
        rootCause: 'OPERATOR_ERROR',
        defectDetails: 'Incorrect tool offset programmed on X-axis after insert replacement.',
        operationName: 'Precision Finish Turning & Groove',
        loggedBy: 'Supervisor R. Verma',
        loggedAt: '11:10 AM',
      },
    ],
  },
  {
    id: 'jc-02',
    jobCardNumber: 'JC-2026-0882',
    productionLine: 'Line 1 - Stamping & Press Line',
    batchNumber: 'LOT-2026-BRZ-9021',
    shift: 'Shift A (Morning 06:00 - 14:00)',
    status: 'IN_PROGRESS',
    targetQty: 500,
    completedQty: 410,
    scrapQty: 8,
    uom: 'PCS',
    cycleTimeSec: 12,
    supervisorName: 'Supervisor R. Verma',
    operatorName: 'Operator D. Solanki',
    notes: 'High-speed blanking run. Monitor die temperature and oil lubrication pressure.',
    startedAt: '2026-10-02 07:00',
    item: {
      code: 'BUSH-BRZ-30MM',
      name: 'Phosphor Bronze Sleeve Blank 30mm',
      category: 'FINISHED_GOOD',
      uom: 'PCS',
    },
    operations: [
      {
        id: 'op-10',
        sequence: 10,
        operationName: 'Progressive Die Stamping',
        workstation: 'PRESS-100T Aida C2',
        operatorName: 'D. Solanki',
        cycleTimeSeconds: 6,
        completedQty: 410,
        scrapQty: 5,
        status: 'IN_PROGRESS',
      },
      {
        id: 'op-20',
        sequence: 20,
        operationName: 'Vibratory Deburring & Washing',
        workstation: 'WASH-01 Rösler Rotary',
        operatorName: 'M. Gaikwad',
        cycleTimeSeconds: 8,
        completedQty: 380,
        scrapQty: 3,
        status: 'IN_PROGRESS',
      },
    ],
    materials: [
      {
        id: 'mat-10',
        itemCode: 'RAW-BRZ-C510',
        itemName: 'Phosphor Bronze Strip C51000 (0.8mm)',
        requiredQty: 420,
        consumedQty: 345,
        uom: 'KG',
        batchNumber: 'LOT-BRZ-9021',
        allocatedBin: 'A-02-B2',
      },
    ],
    scrapLogs: [
      {
        id: 'sl-10',
        defectQty: 5,
        rootCause: 'MATERIAL_FLAW',
        defectDetails: 'Edge crack on bronze coil slit edge.',
        operationName: 'Progressive Die Stamping',
        loggedBy: 'Supervisor R. Verma',
        loggedAt: '08:30 AM',
      },
      {
        id: 'sl-11',
        defectQty: 3,
        rootCause: 'TOOL_WEAR',
        defectDetails: 'Punch burr height exceeded 0.05mm limit.',
        operationName: 'Progressive Die Stamping',
        loggedBy: 'Supervisor R. Verma',
        loggedAt: '11:05 AM',
      },
    ],
  },
];

const initialDowntimes: ActiveDowntime[] = [
  {
    id: 'dt-01',
    machineCode: 'CNC-03',
    machineName: 'Haas ST-20 CNC Turning Center',
    productionLine: 'Line 3 - CNC Machining Cell',
    reason: 'TOOL_JAM_BREAKAGE',
    rootCauseDetails: 'Carbide insert fractured during high-feed roughing pass; spindle load threshold tripped.',
    startedAt: '11:15 AM',
    elapsedMinutes: 38,
    status: 'ACTIVE',
    autoDispatched: true,
    maintenanceTicketId: 'MNT-2026-0814',
    loggedBy: 'Supervisor R. Verma',
    assignedTechnician: 'Senior Tech A. Kulkarni',
  },
];

export default function ProductionFloorPage() {
  const [jobCards, setJobCards] = useState<JobCardData[]>(initialJobCards);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobCards[0].id);
  const [activeTab, setActiveTab] = useState<'operations' | 'materials' | 'scrap'>('operations');
  const [activeDowntimes, setActiveDowntimes] = useState<ActiveDowntime[]>(initialDowntimes);
  const [lineFilter, setLineFilter] = useState<string>('ALL');

  // Flash highlight animation for counter
  const [counterFlash, setCounterFlash] = useState(false);

  // Modal states
  const [isScrapModalOpen, setIsScrapModalOpen] = useState(false);
  const [isDowntimeModalOpen, setIsDowntimeModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolvingDowntimeId, setResolvingDowntimeId] = useState<string | null>(null);

  // Scrap Form State
  const [scrapQtyInput, setScrapQtyInput] = useState<number>(1);
  const [scrapRootCause, setScrapRootCause] = useState<ScrapRootCauseType>('TOOL_WEAR');
  const [scrapOpId, setScrapOpId] = useState<string>('');
  const [scrapNotes, setScrapNotes] = useState<string>('');

  // Downtime Form State
  const [downMachineCode, setDownMachineCode] = useState<string>('CNC-03');
  const [downMachineName, setDownMachineName] = useState<string>('Haas ST-20 Lathe');
  const [downLine, setDownLine] = useState<string>('Line 3 - CNC Machining Cell');
  const [downReason, setDownReason] = useState<DowntimeReasonType>('MECHANICAL_BREAKDOWN');
  const [downDetails, setDownDetails] = useState<string>('');
  const [downTriggerDispatch, setDownTriggerDispatch] = useState<boolean>(true);
  const [downTech, setDownTech] = useState<string>('Senior Tech A. Kulkarni');

  // Resolve Downtime Form State
  const [resolveNotes, setResolveNotes] = useState<string>('');

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'alert' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Selected Job Card
  const currentJob = useMemo(() => {
    return jobCards.find((j) => j.id === selectedJobId) || jobCards[0];
  }, [jobCards, selectedJobId]);

  // Overall Floor Statistics
  const floorStats = useMemo(() => {
    const filtered = lineFilter === 'ALL'
      ? jobCards
      : jobCards.filter((j) => j.productionLine.includes(lineFilter));

    const totalTarget = filtered.reduce((acc, j) => acc + j.targetQty, 0);
    const totalCompleted = filtered.reduce((acc, j) => acc + j.completedQty, 0);
    const totalScrap = filtered.reduce((acc, j) => acc + j.scrapQty, 0);
    const goodOutput = Math.max(0, totalCompleted - totalScrap);
    const progressPercent = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;
    const scrapRate = totalCompleted > 0 ? ((totalScrap / totalCompleted) * 100).toFixed(1) : '0.0';
    const yieldEfficiency = totalCompleted > 0 ? (((totalCompleted - totalScrap) / totalCompleted) * 100).toFixed(1) : '100.0';

    return {
      totalTarget,
      totalCompleted,
      totalScrap,
      goodOutput,
      progressPercent,
      scrapRate,
      yieldEfficiency,
      activeJobsCount: filtered.length,
      activeStoppagesCount: activeDowntimes.filter((d) => d.status === 'ACTIVE').length,
    };
  }, [jobCards, lineFilter, activeDowntimes]);

  // Increment Good Output Counter
  const handleIncrementOutput = (amount: number) => {
    setJobCards((prev) =>
      prev.map((jc) => {
        if (jc.id === selectedJobId) {
          const newQty = Math.max(0, jc.completedQty + amount);
          const isDone = newQty >= jc.targetQty;
          return {
            ...jc,
            completedQty: newQty,
            status: isDone ? 'COMPLETED' : jc.status,
            // Proportionally increment the active operation
            operations: jc.operations.map((op) => {
              if (op.status === 'IN_PROGRESS') {
                return { ...op, completedQty: Math.max(0, op.completedQty + amount) };
              }
              return op;
            }),
            // Material auto-deduction proportional
            materials: jc.materials.map((m) => ({
              ...m,
              consumedQty: Number((m.consumedQty + amount * (m.requiredQty / jc.targetQty)).toFixed(1)),
            })),
          };
        }
        return jc;
      })
    );

    // Visual trigger feedback
    setCounterFlash(true);
    setTimeout(() => setCounterFlash(false), 250);

    const sign = amount > 0 ? `+${amount}` : `${amount}`;
    showToast(`Output updated: ${sign} ${currentJob.uom} on ${currentJob.jobCardNumber}`, amount > 0 ? 'success' : 'info');
  };

  // Submit Scrap Entry
  const handleSubmitScrap = (e: React.FormEvent) => {
    e.preventDefault();
    if (scrapQtyInput <= 0) return;

    const op = currentJob.operations.find((o) => o.id === scrapOpId);
    const opName = op ? op.operationName : 'General Cell Operation';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: ScrapEntry = {
      id: `sl-${Date.now()}`,
      defectQty: scrapQtyInput,
      rootCause: scrapRootCause,
      defectDetails: scrapNotes || `Defect recorded during ${opName}.`,
      operationName: opName,
      loggedBy: 'Supervisor R. Verma',
      loggedAt: nowTime,
    };

    setJobCards((prev) =>
      prev.map((jc) => {
        if (jc.id === selectedJobId) {
          return {
            ...jc,
            scrapQty: jc.scrapQty + scrapQtyInput,
            scrapLogs: [newLog, ...jc.scrapLogs],
            operations: jc.operations.map((o) => {
              if (o.id === scrapOpId) {
                return { ...o, scrapQty: o.scrapQty + scrapQtyInput };
              }
              return o;
            }),
          };
        }
        return jc;
      })
    );

    setIsScrapModalOpen(false);
    setScrapNotes('');
    setScrapQtyInput(1);
    showToast(
      `Logged ${scrapQtyInput} scrap units (${scrapRootCause.replace('_', ' ')}) on ${currentJob.jobCardNumber}`,
      'alert'
    );
  };

  // Submit Machine Downtime
  const handleSubmitDowntime = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketNo = `MNT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newDt: ActiveDowntime = {
      id: `dt-${Date.now()}`,
      machineCode: downMachineCode,
      machineName: downMachineName,
      productionLine: downLine,
      reason: downReason,
      rootCauseDetails: downDetails || 'Immediate operator emergency halt reported from line.',
      startedAt: nowTime,
      elapsedMinutes: 1,
      status: 'ACTIVE',
      autoDispatched: downTriggerDispatch,
      maintenanceTicketId: downTriggerDispatch ? ticketNo : 'NO-DISPATCH',
      loggedBy: 'Supervisor R. Verma',
      assignedTechnician: downTech,
    };

    setActiveDowntimes((prev) => [newDt, ...prev]);
    setIsDowntimeModalOpen(false);
    setDownDetails('');

    showToast(
      `Stoppage registered: ${downMachineCode} halted. Emergency dispatch ${ticketNo} sent to ${downTech}.`,
      'alert'
    );
  };

  // Resolve Downtime
  const handleExecuteResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingDowntimeId) return;

    setActiveDowntimes((prev) =>
      prev.filter((d) => d.id !== resolvingDowntimeId)
    );

    setIsResolveModalOpen(false);
    setResolvingDowntimeId(null);
    setResolveNotes('');
    showToast('Machine stoppage cleared! Line cleared to resume normal production cycle.', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white shadow-2xl border animate-in fade-in slide-in-from-bottom-5 duration-200',
            toast.type === 'alert'
              ? 'bg-rose-900 border-rose-700 shadow-rose-900/40'
              : toast.type === 'info'
              ? 'bg-slate-900 border-slate-700'
              : 'bg-emerald-900 border-emerald-700 shadow-emerald-900/40'
          )}
        >
          {toast.type === 'alert' ? (
            <AlertTriangle className="w-5 h-5 text-rose-300 flex-shrink-0 animate-pulse" />
          ) : toast.type === 'info' ? (
            <AlertCircle className="w-5 h-5 text-blue-300 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Header Bar */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2.5">
              Production Floor Execution
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              LIVE SHOP FLOOR
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Touch-optimized digital Job Card terminal for supervisors: line operation progression, tactile output increment counters, defect scrap categorization, and machine breakdown dispatches.
          </p>
        </div>

        {/* Supervisor & Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Shift Badge */}
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Shift A (06:00 - 14:00)</span>
          </div>

          {/* Log Scrap Button */}
          <button
            type="button"
            onClick={() => {
              setScrapOpId(currentJob.operations[0]?.id || '');
              setIsScrapModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            Log Defect / Scrap
          </button>

          {/* Report Breakdown Stoppage Button */}
          <button
            type="button"
            onClick={() => setIsDowntimeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-transform active:scale-95 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            Report Stoppage / Downtime
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Active Machine Stoppages Alert Banner (Visible when any line is halted) */}
      {/* ========================================================================= */}
      {activeDowntimes.length > 0 && (
        <div className="space-y-2">
          {activeDowntimes.map((dt) => (
            <div
              key={dt.id}
              className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/50 dark:border-rose-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md animate-in slide-in-from-top-3"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-black text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                      {dt.machineCode} &bull; {dt.machineName}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      on {dt.productionLine}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider animate-ping">
                      HALTED
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 dark:text-rose-300 mt-1 font-medium">
                    <strong>Cause:</strong> {dt.reason.replace(/_/g, ' ')} &mdash; {dt.rootCauseDetails}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>Breakdown started at <strong>{dt.startedAt}</strong> ({dt.elapsedMinutes} mins elapsed)</span>
                    {dt.autoDispatched && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Ticket {dt.maintenanceTicketId} assigned to {dt.assignedTechnician}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setResolvingDowntimeId(dt.id);
                  setIsResolveModalOpen(true);
                }}
                className="self-start md:self-auto px-4 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-2 transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Clear Stoppage & Resume
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Top Shift KPIs & Floor Gauge Summary */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Output Progress */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Shift Target Output
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mt-2">
            {floorStats.totalCompleted} <span className="text-sm font-semibold text-slate-400">/ {floorStats.totalTarget} PCS</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, floorStats.progressPercent)}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-1 block">
            {floorStats.progressPercent}% Shift Target Completed
          </span>
        </div>

        {/* Good Output */}
        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Certified Good Units
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-2">
            {floorStats.goodOutput} <span className="text-sm font-normal text-emerald-600">PCS</span>
          </div>
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            Yield Efficiency: {floorStats.yieldEfficiency}%
          </div>
        </div>

        {/* Defect Scrap */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Logged Scrap Defects
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 dark:text-amber-200 mt-2">
            {floorStats.totalScrap} <span className="text-sm font-normal text-amber-600">PCS</span>
          </div>
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 mt-1">
            Scrap Rate: {floorStats.scrapRate}% (Target &lt; 3.0%)
          </div>
        </div>

        {/* Line Stoppages */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Line Stoppages
            </span>
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                floorStats.activeStoppagesCount > 0
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              )}
            >
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mt-2">
            {floorStats.activeStoppagesCount}{' '}
            <span className="text-sm font-normal text-slate-400">Station(s)</span>
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            {floorStats.activeStoppagesCount > 0 ? (
              <span className="text-rose-600 font-bold">Emergency response dispatched</span>
            ) : (
              <span className="text-emerald-600 font-bold">&check; All lines running nominal</span>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Job Card Selection Tabs & Line Filter */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Active Job Cards:
          </span>
          {jobCards.map((jc) => {
            const isSelected = jc.id === selectedJobId;
            const progress = Math.round((jc.completedQty / jc.targetQty) * 100);

            return (
              <button
                key={jc.id}
                type="button"
                onClick={() => setSelectedJobId(jc.id)}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border',
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                )}
              >
                <span className="font-mono">{jc.jobCardNumber}</span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded', isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400')}>
                  {jc.item.code}
                </span>
                <span className="text-[11px] font-black">{progress}%</span>
              </button>
            );
          })}
        </div>

        {/* Shift Supervisor Info Tag */}
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 self-start sm:self-auto">
          <User className="w-3.5 h-3.5 text-blue-600" />
          Supervisor on Duty: <strong className="text-slate-800 dark:text-slate-200">{currentJob.supervisorName}</strong>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN VIEW: Touch-Friendly Digital Job Card View */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Massive Touch Counter & Job Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Job Card Header Info Box */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                {currentJob.jobCardNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Play className="w-3 h-3 fill-emerald-600" /> RUNNING
              </span>
            </div>

            <div>
              <div className="text-lg font-black text-slate-900 dark:text-slate-50">
                {currentJob.item.name}
              </div>
              <div className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                <span>SKU: {currentJob.item.code}</span>
                <span>&bull;</span>
                <span>Batch: {currentJob.batchNumber}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-semibold">PRODUCTION LINE</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentJob.productionLine}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-semibold">STANDARD CYCLE TIME</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentJob.cycleTimeSec}s / part</span>
              </div>
            </div>

            {currentJob.notes && (
              <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300">
                <span className="font-bold block mb-0.5">Engineering Quality Note:</span>
                {currentJob.notes}
              </div>
            )}
          </div>

          {/* Touch-Friendly Large Output Counter Component */}
          <div
            className={cn(
              'p-6 rounded-3xl border-2 transition-all duration-200 shadow-md flex flex-col items-center justify-between text-center relative overflow-hidden',
              counterFlash
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-8 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
            )}
          >
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Live Touch Output Keypad
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((currentJob.completedQty / currentJob.targetQty) * 100)}% of Target
              </span>
            </div>

            {/* Huge Numeric Display */}
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-slate-50 font-mono">
                {currentJob.completedQty}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                COMPLETED {currentJob.uom} (TARGET: {currentJob.targetQty} {currentJob.uom})
              </div>
            </div>

            {/* Yield Mini Metrics */}
            <div className="w-full grid grid-cols-2 gap-2 my-2 text-xs">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
                <span className="text-[10px] block font-semibold">GOOD PARTS</span>
                <span className="font-mono text-base font-black">
                  {Math.max(0, currentJob.completedQty - currentJob.scrapQty)} {currentJob.uom}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                <span className="text-[10px] block font-semibold">SCRAP DEFECTS</span>
                <span className="font-mono text-base font-black">
                  {currentJob.scrapQty} {currentJob.uom}
                </span>
              </div>
            </div>

            {/* Tactile Big Increment Touch Buttons */}
            <div className="w-full space-y-2.5 mt-2">
              {/* Primary +1 Button (Massive, High Target) */}
              <button
                type="button"
                onClick={() => handleIncrementOutput(1)}
                className="w-full h-16 sm:h-20 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xl sm:text-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all select-none cursor-pointer"
              >
                <Plus className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
                +1 {currentJob.uom} RECORD OUTPUT
              </button>

              {/* Batch Increment Stepper Row (+5, +10, +25, +50) */}
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 25, 50].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleIncrementOutput(step)}
                    className="h-12 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950 active:scale-95 text-slate-800 dark:text-slate-200 hover:text-blue-600 font-extrabold text-sm border border-slate-200 dark:border-slate-700 transition-all select-none cursor-pointer"
                  >
                    +{step}
                  </button>
                ))}
              </div>

              {/* Undo / Decrement Button (Prevents operator mistakes) */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => handleIncrementOutput(-1)}
                  disabled={currentJob.completedQty <= 0}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Mistake? Subtract -1 {currentJob.uom}
                </button>

                <span className="text-[10px] text-slate-400 font-mono">
                  Line Station: CNC-03 Haas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Line Operations, BOM Materials, and Scrap Audit (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tabs Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('operations')}
              className={cn(
                'flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                activeTab === 'operations'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              <Sliders className="w-4 h-4" />
              Line Operations ({currentJob.operations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={cn(
                'flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                activeTab === 'materials'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              <Boxes className="w-4 h-4" />
              BOM Material Consumption
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scrap')}
              className={cn(
                'flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                activeTab === 'scrap'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Scrap Log ({currentJob.scrapLogs.length})
            </button>
          </div>

          {/* TAB 1: Line Operations Sequence */}
          {activeTab === 'operations' && (
            <div className="space-y-3">
              {currentJob.operations.map((op, idx) => {
                const isOpDone = op.status === 'COMPLETED';
                const isOpActive = op.status === 'IN_PROGRESS';

                return (
                  <div
                    key={op.id}
                    className={cn(
                      'p-4 rounded-2xl border-2 transition-all relative overflow-hidden',
                      isOpActive
                        ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/30 shadow-xs'
                        : isOpDone
                        ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-90'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-75'
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono font-black text-xs flex items-center justify-center">
                          {op.sequence}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {op.operationName}
                            {isOpActive && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white animate-pulse">
                                CURRENT STEP
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Station: <strong>{op.workstation}</strong> &bull; Operator: {op.operatorName}
                          </span>
                        </div>
                      </div>

                      {/* Status & Quantities */}
                      <div className="flex items-center gap-3 sm:text-right">
                        <div>
                          <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                            {op.completedQty} / {currentJob.targetQty} {currentJob.uom}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Cycle: {op.cycleTimeSeconds}s &bull; Scrap: {op.scrapQty}
                          </span>
                        </div>

                        {isOpDone ? (
                          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </span>
                        ) : isOpActive ? (
                          <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
                            <Play className="w-4 h-4 fill-white" />
                          </span>
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0 text-xs font-mono">
                            ...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: BOM Material Consumption */}
          {activeTab === 'materials' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Allocated Recipe Materials & Live Consumption
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentJob.materials.map((mat) => {
                    const consumptionPct = Math.round((mat.consumedQty / mat.requiredQty) * 100);

                    return (
                      <div key={mat.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                            {mat.itemCode}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {mat.itemName}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              Lot: {mat.batchNumber}
                            </span>
                            {mat.heatNumber && (
                              <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                Heat: {mat.heatNumber}
                              </span>
                            )}
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              Bin: {mat.allocatedBin}
                            </span>
                          </div>
                        </div>

                        {/* Consumption Progress */}
                        <div className="sm:text-right min-w-[140px]">
                          <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                            {mat.consumedQty} / {mat.requiredQty} {mat.uom}
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all"
                              style={{ width: `${Math.min(100, consumptionPct)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                            {consumptionPct}% Issued Consumed
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Scrap & Defect Log */}
          {activeTab === 'scrap' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Logged Defect Audit Trail ({currentJob.scrapLogs.length} Events)
                </span>
                <button
                  type="button"
                  onClick={() => setIsScrapModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Defect Entry
                </button>
              </div>

              {currentJob.scrapLogs.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {entry.rootCause.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400">
                      {entry.defectQty} Defective {currentJob.uom}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {entry.defectDetails}
                  </p>

                  <div className="pt-2 border-t border-amber-100 dark:border-amber-900/40 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Operation: {entry.operationName}</span>
                    <span>Logged at {entry.loggedAt} by {entry.loggedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Scrap / Defect Logging */}
      {/* ========================================================================= */}
      {isScrapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Log Part Scrap / Defect
                  </h3>
                  <span className="text-xs text-slate-400">
                    Record out-of-tolerance units & assign root cause for quality auditing
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScrapModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitScrap} className="space-y-4 py-4 text-xs">
              {/* Defect Quantity Stepper */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Defective Quantity ({currentJob.uom}) *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScrapQtyInput((prev) => Math.max(1, prev - 1))}
                    className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-lg flex items-center justify-center hover:bg-slate-200"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={scrapQtyInput}
                    onChange={(e) => setScrapQtyInput(Number(e.target.value) || 1)}
                    className="flex-1 h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-mono font-black text-xl text-rose-600 dark:text-rose-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setScrapQtyInput((prev) => prev + 1)}
                    className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-lg flex items-center justify-center hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Defect Root Cause Dropdown */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Root Cause Category *
                </label>
                <select
                  value={scrapRootCause}
                  onChange={(e) => setScrapRootCause(e.target.value as ScrapRootCauseType)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="TOOL_WEAR">Tool Wear (Chipping, flank wear, tool dulling)</option>
                  <option value="MATERIAL_FLAW">Material Flaw (Seam, porosity, hardness inclusion)</option>
                  <option value="OPERATOR_ERROR">Operator Error (Misload, incorrect offset/program)</option>
                  <option value="THERMAL_DISTORTION">Thermal Distortion (Insufficient coolant, thermal drift)</option>
                  <option value="CALIBRATION_DRIFT">Calibration Drift (Axis backlash, gauge zero error)</option>
                  <option value="POWER_FLUCTUATION">Power Fluctuation (Voltage sag, mid-cycle interruption)</option>
                  <option value="OTHER">Other Root Cause</option>
                </select>
              </div>

              {/* Target Operation Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Line Operation Step Where Scrap Occurred
                </label>
                <select
                  value={scrapOpId}
                  onChange={(e) => setScrapOpId(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {currentJob.operations.map((op) => (
                    <option key={op.id} value={op.id}>
                      Op {op.sequence}: {op.operationName} ({op.workstation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Defect Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Defect Description & Specific Measurements
                </label>
                <textarea
                  rows={3}
                  value={scrapNotes}
                  onChange={(e) => setScrapNotes(e.target.value)}
                  placeholder="e.g. Diameter turned undersized by 0.012mm due to worn insert flank; verified with Vernier Micrometer #MIC-04."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScrapModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-black bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Commit Scrap Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Report Machine Downtime & Auto-Maintenance Dispatch */}
      {/* ========================================================================= */}
      {isDowntimeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Report Machine Stoppage & Dispatch
                  </h3>
                  <span className="text-xs text-slate-400">
                    Halt line station & automatically dispatch on-call maintenance technician
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDowntimeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDowntime} className="space-y-4 py-4 text-xs">
              {/* Machine Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Machine Station Code *
                </label>
                <select
                  value={downMachineCode}
                  onChange={(e) => {
                    setDownMachineCode(e.target.value);
                    if (e.target.value === 'CNC-03') setDownMachineName('Haas ST-20 Lathe');
                    if (e.target.value === 'CNC-01') setDownMachineName('Okuma Genos L3000');
                    if (e.target.value === 'HEAT-02') setDownMachineName('Pillar Induction Unit');
                    if (e.target.value === 'PRESS-100T') setDownMachineName('Aida 100T Press');
                    if (e.target.value === 'GRND-01') setDownMachineName('Studer S33 Centerless Grinder');
                  }}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
                >
                  <option value="CNC-03">CNC-03 &bull; Haas ST-20 Lathe</option>
                  <option value="CNC-01">CNC-01 &bull; Okuma Genos L3000</option>
                  <option value="HEAT-02">HEAT-02 &bull; Pillar Induction Hardening</option>
                  <option value="PRESS-100T">PRESS-100T &bull; Aida 100T Mechanical Press</option>
                  <option value="GRND-01">GRND-01 &bull; Studer S33 Centerless Grinder</option>
                </select>
              </div>

              {/* Downtime Reason */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Stoppage Category *
                </label>
                <select
                  value={downReason}
                  onChange={(e) => setDownReason(e.target.value as DowntimeReasonType)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="TOOL_JAM_BREAKAGE">Tool Jam / Insert Breakage</option>
                  <option value="MECHANICAL_BREAKDOWN">Mechanical Breakdown (Spindle, Chuck, Collet)</option>
                  <option value="ELECTRICAL_FAULT">Electrical / Servo Drive Fault</option>
                  <option value="HYDRAULIC_FAILURE">Hydraulic / Coolant Pressure Drop</option>
                  <option value="SENSOR_FAILURE">Sensor / Proximity Switch Failure</option>
                  <option value="PLANNED_CHANGEOVER">Tooling Changeover / Re-tooling</option>
                  <option value="RAW_MATERIAL_WAIT">Raw Material Starvation / Bin Empty</option>
                </select>
              </div>

              {/* Specific Fault Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Immediate Fault Symptoms
                </label>
                <textarea
                  rows={2}
                  value={downDetails}
                  onChange={(e) => setDownDetails(e.target.value)}
                  placeholder="e.g. Spindle load spiked to 140% then interlocked. High screeching vibration detected on main drive."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              {/* Automated Maintenance Dispatch Checkbox */}
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer font-bold text-rose-900 dark:text-rose-200">
                  <input
                    type="checkbox"
                    checked={downTriggerDispatch}
                    onChange={(e) => setDownTriggerDispatch(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Trigger Automated Maintenance Dispatch (Emergency MNT Ticket)</span>
                </label>
                <div className="text-[11px] text-rose-700 dark:text-rose-300 pl-6">
                  Assigns ticket directly to <strong>{downTech}</strong> with high priority notification badge.
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDowntimeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-black bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Halt Station & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Resolve Machine Downtime */}
      {/* ========================================================================= */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Clear Machine Stoppage
                  </h3>
                  <span className="text-xs text-slate-400">
                    Confirm technician repairs & resume active line production
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteResolve} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Resolution & Preventive Actions Done
                </label>
                <textarea
                  rows={3}
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="e.g. Carbide insert replaced, chuck cleaned of chips, dry run cycle verified without error."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Confirm & Resume Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

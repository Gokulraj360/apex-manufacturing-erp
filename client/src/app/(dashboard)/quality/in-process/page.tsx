'use client';

import React, { useState } from 'react';
import {
  TestTubes,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  Cpu,
  Wrench,
  Gauge,
  Sliders,
  ChevronDown,
  ChevronUp,
  X,
  ShieldAlert,
  Flame,
  Radio,
} from 'lucide-react';
import { InProcessInspectionItem, QCStatus } from '@/types/quality';

const INITIAL_IN_PROCESS_INSPECTIONS: InProcessInspectionItem[] = [
  {
    id: 'ip-1',
    inspectionNumber: 'QC-IP-2026-0082',
    workOrderNumber: 'WO-2026-001',
    batchNumber: 'BATCH-2026-01-A',
    productionLineId: 'LINE-01-SMT',
    stationName: 'Surface Mount High-Speed Pick & Place',
    stage: 'SMT Micro-Component Placement',
    toleranceDeviation: 0.008,
    status: 'PASSED',
    inspectorName: 'Kavita Patel (SMT QC)',
    notes: 'Optical AOI scanner confirmed zero component skew or missing bypass capacitors across 250 PCBAs.',
    createdAt: '2026-10-07 10:15',
    parameters: [
      {
        parameter: 'Placement Accuracy X/Y Axis',
        standard: '± 0.025 mm max',
        observed: '0.008 mm deviation',
        toleranceDeviation: 0.008,
        isPass: true,
      },
      {
        parameter: 'Solder Paste Volume (SPI)',
        standard: '100% ± 15%',
        observed: '102.4% avg volume',
        toleranceDeviation: 2.4,
        isPass: true,
      },
      {
        parameter: 'BGA Voiding Percentage',
        standard: '&lt; 15% area',
        observed: '4.2% X-ray inspection',
        toleranceDeviation: 0.0,
        isPass: true,
      },
    ],
  },
  {
    id: 'ip-2',
    inspectionNumber: 'QC-IP-2026-0081',
    workOrderNumber: 'WO-2026-002',
    batchNumber: 'BATCH-2026-02-B',
    productionLineId: 'LINE-02-CNC',
    stationName: '5-Axis CNC Machining Center #03',
    stage: 'Valve Body Core Boring & Facing',
    toleranceDeviation: 0.038,
    status: 'FAILED',
    inspectorName: 'Vikram Joshi (Senior Auditor)',
    notes: 'Bore diameter exceeded upper engineering tolerance by +0.038 mm. Cutter insert wear identified; machine halted for tool change.',
    createdAt: '2026-10-07 09:20',
    parameters: [
      {
        parameter: 'Internal Bore Diameter',
        standard: '50.000 ± 0.015 mm',
        observed: '50.038 mm (Exceeded)',
        toleranceDeviation: 0.038,
        isPass: false,
      },
      {
        parameter: 'Flange Flatness Runout',
        standard: '&lt; 0.020 mm',
        observed: '0.014 mm',
        toleranceDeviation: 0.014,
        isPass: true,
      },
      {
        parameter: 'Surface Roughness Ra',
        standard: 'Ra &lt;= 0.8 µm',
        observed: 'Ra 1.1 µm (Poor finish)',
        toleranceDeviation: 0.3,
        isPass: false,
      },
    ],
  },
  {
    id: 'ip-3',
    inspectionNumber: 'QC-IP-2026-0080',
    workOrderNumber: 'WO-2026-004',
    batchNumber: 'BATCH-2026-04-A',
    productionLineId: 'LINE-03-WELD',
    stationName: 'Robotic TIG Seam Welder #01',
    stage: 'Pressure Chamber Circumferential Seam',
    toleranceDeviation: 0.005,
    status: 'PASSED',
    inspectorName: 'Ramesh Sundaram (NDT Specialist)',
    notes: 'Ultrasonic flaw detection verified 100% weld penetration with zero slag inclusions or porosity.',
    createdAt: '2026-10-06 15:45',
    parameters: [
      {
        parameter: 'Weld Throat Thickness',
        standard: '6.0 ± 0.5 mm',
        observed: '6.2 mm',
        toleranceDeviation: 0.2,
        isPass: true,
      },
      {
        parameter: 'Ultrasonic Flaw Echo',
        standard: 'Zero indications &gt; Level 2',
        observed: 'Clean waveform',
        toleranceDeviation: 0.0,
        isPass: true,
      },
      {
        parameter: 'Heat Affected Zone (HAZ) Hardness',
        standard: '&lt; 280 HV10',
        observed: '242 HV10',
        toleranceDeviation: 0.0,
        isPass: true,
      },
    ],
  },
  {
    id: 'ip-4',
    inspectionNumber: 'QC-IP-2026-0079',
    workOrderNumber: 'WO-2026-003',
    batchNumber: 'BATCH-2026-03-A',
    productionLineId: 'LINE-04-CLEANROOM',
    stationName: 'Cleanroom ISO Class 6 Subassembly',
    stage: 'Hydraulic Seal Pressing & Lubrication',
    toleranceDeviation: 0.012,
    status: 'IN_PROGRESS',
    inspectorName: 'Priya Sharma (Lead QC)',
    notes: 'Seal insertion force profile monitored via dynamic load cell.',
    createdAt: '2026-10-06 11:30',
    parameters: [
      {
        parameter: 'Peak Insertion Force',
        standard: '850 ± 50 N',
        observed: '862 N',
        toleranceDeviation: 12.0,
        isPass: true,
      },
      {
        parameter: 'Particle Contamination Level',
        standard: '&lt; 100 particles / ft³',
        observed: 'Testing in progress',
        toleranceDeviation: 0.0,
        isPass: true,
      },
    ],
  },
];

export default function InProcessQualityPage() {
  const [inspections, setInspections] = useState<InProcessInspectionItem[]>(INITIAL_IN_PROCESS_INSPECTIONS);
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('ip-2');

  // Modals
  const [isNewSpotCheckModalOpen, setIsNewSpotCheckModalOpen] = useState(false);

  // New Spot Check Form State
  const [newCheckForm, setNewCheckForm] = useState({
    workOrderNumber: 'WO-2026-001',
    batchNumber: 'BATCH-2026-01-A',
    productionLineId: 'LINE-01-SMT',
    stationName: 'Surface Mount High-Speed Pick & Place',
    stage: 'SMT Micro-Component Placement',
    toleranceDeviation: 0.01,
    status: 'PASSED',
    inspectorName: 'Kavita Patel (SMT QC)',
    paramName: 'Reflow Soldering Peak Temperature',
    paramStandard: '245 ± 5 °C',
    paramObserved: '246.2 °C',
    notes: '',
  });

  const handleCreateSpotCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const newInspection: InProcessInspectionItem = {
      id: `ip-${Date.now()}`,
      inspectionNumber: `QC-IP-2026-00${inspections.length + 83}`,
      workOrderNumber: newCheckForm.workOrderNumber,
      batchNumber: newCheckForm.batchNumber,
      productionLineId: newCheckForm.productionLineId,
      stationName: newCheckForm.stationName,
      stage: newCheckForm.stage,
      toleranceDeviation: Number(newCheckForm.toleranceDeviation),
      status: newCheckForm.status as QCStatus,
      inspectorName: newCheckForm.inspectorName,
      notes: newCheckForm.notes || 'In-process station verification executed successfully.',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      parameters: [
        {
          parameter: newCheckForm.paramName,
          standard: newCheckForm.paramStandard,
          observed: newCheckForm.paramObserved,
          toleranceDeviation: Number(newCheckForm.toleranceDeviation),
          isPass: newCheckForm.status === 'PASSED',
        },
      ],
    };

    setInspections([newInspection, ...inspections]);
    setExpandedId(newInspection.id);
    setIsNewSpotCheckModalOpen(false);
  };

  const handleUpdateStatus = (id: string, newStatus: QCStatus) => {
    setInspections((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  const filteredInspections = inspections.filter((i) => {
    if (selectedLineFilter === 'ALL') return true;
    return i.productionLineId === selectedLineFilter;
  });

  // Metrics
  const totalChecks = inspections.length;
  const passedChecks = inspections.filter((i) => i.status === 'PASSED').length;
  const failedChecks = inspections.filter((i) => i.status === 'FAILED').length;
  const inProgressChecks = inspections.filter((i) => i.status === 'IN_PROGRESS').length;
  const complianceRate = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <TestTubes className="w-7 h-7 text-amber-500" />
              In-Process Quality & Critical Stage Checks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Live Shop Floor Telemetry
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Conduct periodic stage-gate spot checks, track precision tolerance deviations, and halt non-compliant lines.
          </p>
        </div>

        <button
          onClick={() => setIsNewSpotCheckModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition shadow-sm shadow-amber-900/30"
        >
          <Plus className="w-4 h-4" />
          Log Line Spot Check
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Line Compliance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{complianceRate.toFixed(1)}%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{passedChecks} stations in spec</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">First-pass process capability</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quality Halt / Failures</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 dark:text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-500 dark:text-rose-400">{failedChecks}</span>
            <span className="text-xs text-rose-500 dark:text-rose-400 font-medium">active tool offsets</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">CNC Line #02 paused</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Spot Checks</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 border border-blue-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{inProgressChecks}</span>
            <span className="text-xs text-blue-500 dark:text-blue-400 font-medium">sensors streaming</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cleanroom subassembly active</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Max Tolerance Deviation</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400 border border-amber-500/20">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">+0.038 mm</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">peak drift observed</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bore boring insert drift</p>
        </div>
      </div>

      {/* Production Line Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'ALL', label: 'All Active Lines' },
          { id: 'LINE-01-SMT', label: 'Line 01 - SMT Surface Mount' },
          { id: 'LINE-02-CNC', label: 'Line 02 - CNC Milling' },
          { id: 'LINE-03-WELD', label: 'Line 03 - Robotic Welding' },
          { id: 'LINE-04-CLEANROOM', label: 'Line 04 - Cleanroom Assembly' },
        ].map((line) => (
          <button
            key={line.id}
            onClick={() => setSelectedLineFilter(line.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedLineFilter === line.id
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {line.label}
          </button>
        ))}
      </div>

      {/* Spot Checks Feed */}
      <div className="space-y-3">
        {filteredInspections.map((item) => {
          const isExpanded = expandedId === item.id;
          const isFailed = item.status === 'FAILED';

          return (
            <div
              key={item.id}
              className={`rounded-xl bg-white dark:bg-slate-900 border transition overflow-hidden shadow-sm ${
                isFailed ? 'border-rose-500/40 shadow-rose-950/10' : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border ${
                      item.status === 'PASSED'
                        ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                        : item.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {item.status === 'PASSED' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : item.status === 'FAILED' ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.inspectionNumber}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">[{item.workOrderNumber}]</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Batch: {item.batchNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          item.status === 'PASSED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : item.status === 'FAILED'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                      {isFailed && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                          <ShieldAlert className="w-3 h-3" /> Machine Halt Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
                      Station: <strong className="text-slate-900 dark:text-white">{item.stationName}</strong> • Stage: {item.stage}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Line: <strong className="text-slate-700 dark:text-slate-300 font-mono">{item.productionLineId}</strong> • Inspector: {item.inspectorName} • Recorded: {item.createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Tolerance Drift</span>
                    <span
                      className={`text-sm font-mono font-bold ${
                        item.toleranceDeviation > 0.02 ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      ±{item.toleranceDeviation} mm
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                  {item.notes && (
                    <p className="text-xs text-slate-600 dark:text-neutral-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      Operator Observations: {item.notes}
                    </p>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-3 py-2">Stage Parameter</th>
                          <th className="px-3 py-2">Nominal Standard</th>
                          <th className="px-3 py-2">Observed Sensor Data</th>
                          <th className="px-3 py-2">Deviation</th>
                          <th className="px-3 py-2 text-center">Disposition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-neutral-800 text-slate-700 dark:text-neutral-300">
                        {item.parameters.map((param, idx) => (
                          <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-neutral-800/40">
                            <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-neutral-200">{param.parameter}</td>
                            <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-neutral-300">{param.standard}</td>
                            <td className="px-3 py-2.5 font-mono font-semibold text-slate-900 dark:text-white">{param.observed}</td>
                            <td className="px-3 py-2.5 font-mono text-amber-500 dark:text-amber-400">{param.toleranceDeviation} mm</td>
                            <td className="px-3 py-2.5 text-center">
                              {param.isPass ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                                  <CheckCircle2 className="w-3 h-3" /> IN SPEC
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-medium">
                                  <XCircle className="w-3 h-3" /> OUT OF TOLERANCE
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    {item.status !== 'PASSED' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'PASSED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold transition"
                      >
                        Override / Clear Hold
                      </button>
                    )}
                    {item.status !== 'FAILED' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'FAILED')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-semibold transition"
                      >
                        Flag Non-Conformance
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: LOG SPOT CHECK */}
      {isNewSpotCheckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TestTubes className="w-5 h-5 text-amber-500" />
                Record Shop Floor Spot Check
              </h3>
              <button
                onClick={() => setIsNewSpotCheckModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSpotCheck} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Work Order #</label>
                  <input
                    type="text"
                    value={newCheckForm.workOrderNumber}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, workOrderNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Batch #</label>
                  <input
                    type="text"
                    value={newCheckForm.batchNumber}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, batchNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Production Line</label>
                  <select
                    value={newCheckForm.productionLineId}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, productionLineId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="LINE-01-SMT">Line 01 - SMT Pick & Place</option>
                    <option value="LINE-02-CNC">Line 02 - CNC Milling</option>
                    <option value="LINE-03-WELD">Line 03 - Robotic Welding</option>
                    <option value="LINE-04-CLEANROOM">Line 04 - Cleanroom Assembly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Station Name</label>
                  <input
                    type="text"
                    value={newCheckForm.stationName}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, stationName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Critical Process Stage</label>
                <input
                  type="text"
                  value={newCheckForm.stage}
                  onChange={(e) => setNewCheckForm({ ...newCheckForm, stage: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Measured Parameter Details</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Parameter</label>
                    <input
                      type="text"
                      value={newCheckForm.paramName}
                      onChange={(e) => setNewCheckForm({ ...newCheckForm, paramName: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Nominal Standard</label>
                    <input
                      type="text"
                      value={newCheckForm.paramStandard}
                      onChange={(e) => setNewCheckForm({ ...newCheckForm, paramStandard: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Observed Value</label>
                    <input
                      type="text"
                      value={newCheckForm.paramObserved}
                      onChange={(e) => setNewCheckForm({ ...newCheckForm, paramObserved: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Tolerance Deviation (mm / unit)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={newCheckForm.toleranceDeviation}
                      onChange={(e) => setNewCheckForm({ ...newCheckForm, toleranceDeviation: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Result Status</label>
                  <select
                    value={newCheckForm.status}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="PASSED">PASSED (In Specification)</option>
                    <option value="FAILED">FAILED (Out of Tolerance)</option>
                    <option value="IN_PROGRESS">IN PROGRESS (Monitoring)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Inspector Name</label>
                  <input
                    type="text"
                    value={newCheckForm.inspectorName}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, inspectorName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Notes / Adjustments Made</label>
                <textarea
                  value={newCheckForm.notes}
                  onChange={(e) => setNewCheckForm({ ...newCheckForm, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSpotCheckModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Spot Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

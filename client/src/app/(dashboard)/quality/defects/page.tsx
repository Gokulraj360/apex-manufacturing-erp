'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Flame,
  RotateCcw,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  X,
  FileText,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DefectLogItem, DefectCategory, DefectSeverity, DefectAction } from '@/types/quality';

const INITIAL_DEFECT_LOGS: DefectLogItem[] = [
  {
    id: 'def-1',
    defectCode: 'DEF-2026-0081',
    sourceStage: 'IN_PROCESS',
    itemCode: 'RAW-STL-316L',
    itemName: 'Cold Rolled Steel Sheet 316L',
    lotBatchNumber: 'BATCH-2026-02-B',
    defectCategory: 'DIMENSIONAL',
    severity: 'CRITICAL',
    defectReason: 'Internal bore diameter bored +0.038 mm oversized due to carbide insert micro-fracture.',
    rootCause: '5-Why Analysis: Carbide tool reached 240 operating hours without preventive index offset check.',
    scrapQuantity: 12,
    financialLoss: 684.0,
    actionTaken: 'SCRAP',
    containmentMeasures: 'Tool magazine auto-lock triggered at 200 machining hours; all 12 oversized cores scrapped.',
    reportedBy: 'Vikram Joshi (Senior Auditor)',
    createdAt: '2026-10-07 09:40',
  },
  {
    id: 'def-2',
    defectCode: 'DEF-2026-0080',
    sourceStage: 'INCOMING',
    itemCode: 'CHEM-SEAL-EPOXY',
    itemName: 'Two-Part High Performance Epoxy Sealant',
    lotBatchNumber: 'EPX-9019-Z',
    defectCategory: 'CHEMICAL',
    severity: 'MAJOR',
    defectReason: 'Dynamic viscosity exceeded 1750 cP (spec 1200 ± 100 cP). Premature gel formation.',
    rootCause: 'Supplier shipping container temperature exceeded 35°C during overland transit.',
    scrapQuantity: 25,
    financialLoss: 510.0,
    actionTaken: 'RETURN_TO_VENDOR',
    containmentMeasures: 'Vendor Debit Note debited; refrigerated cold-chain transit required for future orders.',
    reportedBy: 'Dr. Sen (Chemical QC)',
    createdAt: '2026-10-06 14:15',
  },
  {
    id: 'def-3',
    defectCode: 'DEF-2026-0079',
    sourceStage: 'FINAL',
    itemCode: 'FG-SENSOR-CTRL',
    itemName: 'Dual-Channel Temperature Control Module',
    lotBatchNumber: 'BATCH-2026-05-C',
    defectCategory: 'ELECTRICAL',
    severity: 'MAJOR',
    defectReason: 'ADC reference voltage drifted +0.18% in high-temperature burn-in test chamber.',
    rootCause: 'Solder bridge defect under U4 decoupling capacitor on circuit board revision 2.1.',
    scrapQuantity: 12,
    financialLoss: 420.0,
    actionTaken: 'REWORK',
    containmentMeasures: 'Re-flow rework technician re-soldered bridge; PCB layout stencil aperture reduced by 10%.',
    reportedBy: 'Kavita Patel (Electronics QC)',
    createdAt: '2026-10-05 16:30',
  },
  {
    id: 'def-4',
    defectCode: 'DEF-2026-0078',
    sourceStage: 'IN_PROCESS',
    itemCode: 'RAW-ALUM-6061',
    itemName: 'Aluminum Alloy Billet 6061-T6',
    lotBatchNumber: 'BATCH-2026-01-A',
    defectCategory: 'VISUAL',
    severity: 'MINOR',
    defectReason: 'Minor surface clamping scratch on exterior non-critical mounting flange.',
    rootCause: 'Pneumatic clamp pad rubber buffer degraded.',
    scrapQuantity: 5,
    financialLoss: 226.5,
    actionTaken: 'USE_AS_IS',
    containmentMeasures: 'Polished scratch to Ra 0.6 µm; replaced urethane clamping jaws on station 04.',
    reportedBy: 'Priya Sharma (Lead QC)',
    createdAt: '2026-10-04 11:20',
  },
];

export default function DefectConsolePage() {
  const [defects, setDefects] = useState<DefectLogItem[]>(INITIAL_DEFECT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('def-1');

  // Modals
  const [isNewDefectModalOpen, setIsNewDefectModalOpen] = useState(false);
  const [isCapaModalOpen, setIsCapaModalOpen] = useState(false);
  const [selectedDefectForCapa, setSelectedDefectForCapa] = useState<DefectLogItem | null>(null);

  // New Defect Form
  const [newDefectForm, setNewDefectForm] = useState({
    sourceStage: 'IN_PROCESS',
    itemCode: 'RAW-ALUM-6061',
    itemName: 'Aluminum Alloy Billet 6061-T6',
    lotBatchNumber: 'BATCH-2026-04-A',
    defectCategory: 'DIMENSIONAL',
    severity: 'MAJOR',
    defectReason: '',
    rootCause: '',
    scrapQuantity: 4,
    financialLoss: 180.0,
    actionTaken: 'QUARANTINE',
    containmentMeasures: '',
    reportedBy: 'Vikram Joshi (Senior Auditor)',
  });

  // CAPA update form
  const [capaForm, setCapaForm] = useState({
    rootCause: '',
    actionTaken: 'SCRAP' as DefectAction,
    containmentMeasures: '',
  });

  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    const newDefect: DefectLogItem = {
      id: `def-${Date.now()}`,
      defectCode: `DEF-2026-00${defects.length + 82}`,
      sourceStage: newDefectForm.sourceStage,
      itemCode: newDefectForm.itemCode,
      itemName: newDefectForm.itemName,
      lotBatchNumber: newDefectForm.lotBatchNumber,
      defectCategory: newDefectForm.defectCategory as DefectCategory,
      severity: newDefectForm.severity as DefectSeverity,
      defectReason: newDefectForm.defectReason,
      rootCause: newDefectForm.rootCause || 'Root cause investigation underway (8D / 5-Why).',
      scrapQuantity: Number(newDefectForm.scrapQuantity),
      financialLoss: Number(newDefectForm.financialLoss),
      actionTaken: newDefectForm.actionTaken as DefectAction,
      containmentMeasures: newDefectForm.containmentMeasures || 'Immediate quarantine isolation applied.',
      reportedBy: newDefectForm.reportedBy,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setDefects([newDefect, ...defects]);
    setExpandedId(newDefect.id);
    setIsNewDefectModalOpen(false);
  };

  const handleSaveCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDefectForCapa) return;

    setDefects((prev) =>
      prev.map((d) => {
        if (d.id === selectedDefectForCapa.id) {
          return {
            ...d,
            rootCause: capaForm.rootCause,
            actionTaken: capaForm.actionTaken,
            containmentMeasures: capaForm.containmentMeasures,
          };
        }
        return d;
      })
    );

    setIsCapaModalOpen(false);
    setSelectedDefectForCapa(null);
  };

  const openCapaModal = (defect: DefectLogItem) => {
    setSelectedDefectForCapa(defect);
    setCapaForm({
      rootCause: defect.rootCause || '',
      actionTaken: defect.actionTaken,
      containmentMeasures: defect.containmentMeasures || '',
    });
    setIsCapaModalOpen(true);
  };

  const filteredDefects = defects.filter((d) => {
    const matchesSearch =
      d.defectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.defectReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || d.sourceStage === stageFilter;
    const matchesCategory = categoryFilter === 'ALL' || d.defectCategory === categoryFilter;
    const matchesSeverity = severityFilter === 'ALL' || d.severity === severityFilter;
    return matchesSearch && matchesStage && matchesCategory && matchesSeverity;
  });

  // Metrics
  const totalScrapUnits = defects.reduce((acc, d) => acc + d.scrapQuantity, 0);
  const totalLoss = defects.reduce((acc, d) => acc + d.financialLoss, 0);
  const criticalCount = defects.filter((d) => d.severity === 'CRITICAL').length;
  const openCapaCount = defects.filter((d) => d.actionTaken === 'QUARANTINE' || !d.rootCause).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <AlertOctagon className="w-7 h-7 text-rose-500" />
              Defect Logging & CAPA Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Root Cause & Scrap Ledger
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track failure modes, record scrap costs, execute 5-Why root cause investigations, and enforce containment actions.
          </p>
        </div>

        <button
          onClick={() => setIsNewDefectModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition shadow-sm shadow-rose-900/30"
        >
          <Plus className="w-4 h-4" />
          Log Non-Conformance / Defect
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Scrap Loss</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 dark:text-rose-400 border border-rose-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-500 dark:text-rose-400">${totalLoss.toFixed(2)}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{totalScrapUnits} units scrapped</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Direct material write-off</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Critical Severities</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">{criticalCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">high impact events</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automatic line pause triggered</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Open CAPA Actions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 border border-blue-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{openCapaCount}</span>
            <span className="text-xs text-blue-500 dark:text-blue-400 font-medium">actions pending</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Under 8D review</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Defect Incidents</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 dark:text-purple-400 border border-purple-500/20">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{defects.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">all manufacturing tiers</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Logged this month</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search defect code, reason, item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Stages</option>
            <option value="INCOMING">Incoming QC</option>
            <option value="IN_PROCESS">In-Process</option>
            <option value="FINAL">Final Test</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Categories</option>
            <option value="DIMENSIONAL">Dimensional</option>
            <option value="VISUAL">Visual</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="CHEMICAL">Chemical</option>
            <option value="METALLURGICAL">Metallurgical</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="MAJOR">Major</option>
            <option value="MINOR">Minor</option>
          </select>
        </div>
      </div>

      {/* Defect Cards List */}
      <div className="space-y-3">
        {filteredDefects.map((d) => {
          const isExpanded = expandedId === d.id;

          return (
            <div
              key={d.id}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : d.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border ${
                      d.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/40'
                        : d.severity === 'MAJOR'
                        ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20'
                    }`}
                  >
                    <AlertOctagon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white">{d.defectCode}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">[{d.sourceStage}]</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          d.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/40'
                            : d.severity === 'MAJOR'
                            ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {d.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700">
                        {d.defectCategory}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                        Disposition: {d.actionTaken}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-neutral-200 mt-1 font-medium">
                      {d.itemName} <span className="font-mono text-emerald-600 dark:text-emerald-400">({d.itemCode})</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xl">
                      Failure: <strong className="text-slate-700 dark:text-slate-300">{d.defectReason}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Financial Scrap</span>
                    <span className="text-sm font-mono font-bold text-rose-500 dark:text-rose-400">
                      -${d.financialLoss.toFixed(2)} ({d.scrapQuantity} pcs)
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCapaModal(d);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 text-xs font-semibold border border-slate-200 dark:border-neutral-700 transition"
                  >
                    CAPA Action
                  </button>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-1">
                      <span className="text-slate-500 dark:text-neutral-400 uppercase text-[10px] tracking-wider font-semibold block">
                        Root Cause Analysis (5-Why / Ishikawa)
                      </span>
                      <p className="text-slate-800 dark:text-neutral-200">{d.rootCause || 'Root cause investigation in progress.'}</p>
                    </div>

                    <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-1">
                      <span className="text-slate-500 dark:text-neutral-400 uppercase text-[10px] tracking-wider font-semibold block">
                        Immediate Containment & Prevention (CAPA)
                      </span>
                      <p className="text-emerald-600 dark:text-emerald-400">{d.containmentMeasures || 'Containment quarantine locked.'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Reported by: <strong className="text-slate-700 dark:text-slate-300">{d.reportedBy}</strong></span>
                    <span>Logged timestamp: {d.createdAt}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: LOG DEFECT */}
      {isNewDefectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-500" />
                Record Non-Conformance / Scrap Incident
              </h3>
              <button
                onClick={() => setIsNewDefectModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDefect} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Source Stage</label>
                  <select
                    value={newDefectForm.sourceStage}
                    onChange={(e) => setNewDefectForm({ ...newDefectForm, sourceStage: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="INCOMING">Incoming QC</option>
                    <option value="IN_PROCESS">In-Process</option>
                    <option value="FINAL">Final Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newDefectForm.defectCategory}
                    onChange={(e) => setNewDefectForm({ ...newDefectForm, defectCategory: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="DIMENSIONAL">Dimensional</option>
                    <option value="VISUAL">Visual</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="CHEMICAL">Chemical</option>
                    <option value="METALLURGICAL">Metallurgical</option>
                    <option value="PACKAGING">Packaging</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Severity</label>
                  <select
                    value={newDefectForm.severity}
                    onChange={(e) => setNewDefectForm({ ...newDefectForm, severity: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="MAJOR">Major</option>
                    <option value="MINOR">Minor</option>
                    <option value="COSMETIC">Cosmetic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Item Code</label>
                  <input
                    type="text"
                    value={newDefectForm.itemCode}
                    onChange={(e) => setNewDefectForm({ ...newDefectForm, itemCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Item Description</label>
                  <input
                    type="text"
                    value={newDefectForm.itemName}
                    onChange={(e) => setNewDefectForm({ ...newDefectForm, itemName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Scrap Quantity</label>
                  <input
                    type="number"
                    value={newDefectForm.scrapQuantity}
                    onChange={(e) => setNewDefectForm({ ...newDefectForm, scrapQuantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Financial Loss ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDefectForm.financialLoss}
                    onChange={(e) => setNewDefectForm({ ...newDefectForm, financialLoss: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Disposition Action</label>
                  <select
                    value={newDefectForm.actionTaken}
                    onChange={(e) => setNewDefectForm({ ...newDefectForm, actionTaken: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="SCRAP">SCRAP</option>
                    <option value="REWORK">REWORK</option>
                    <option value="RETURN_TO_VENDOR">RETURN TO VENDOR</option>
                    <option value="USE_AS_IS">USE AS IS</option>
                    <option value="QUARANTINE">QUARANTINE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Defect Description / Failure Mode</label>
                <textarea
                  value={newDefectForm.defectReason}
                  onChange={(e) => setNewDefectForm({ ...newDefectForm, defectReason: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Root Cause Analysis (5-Why)</label>
                <textarea
                  value={newDefectForm.rootCause}
                  onChange={(e) => setNewDefectForm({ ...newDefectForm, rootCause: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Containment & Prevention Action (CAPA)</label>
                <input
                  type="text"
                  value={newDefectForm.containmentMeasures}
                  onChange={(e) => setNewDefectForm({ ...newDefectForm, containmentMeasures: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewDefectModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition flex items-center gap-2"
                >
                  <AlertOctagon className="w-4 h-4" />
                  Save Defect Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE CAPA */}
      {isCapaModalOpen && selectedDefectForCapa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-500" />
                Update 8D / CAPA Resolution
              </h3>
              <button
                onClick={() => setIsCapaModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCapa} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Root Cause Analysis (RCA)</label>
                <textarea
                  value={capaForm.rootCause}
                  onChange={(e) => setCapaForm({ ...capaForm, rootCause: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Containment & Preventive Action</label>
                <textarea
                  value={capaForm.containmentMeasures}
                  onChange={(e) => setCapaForm({ ...capaForm, containmentMeasures: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Final Disposition</label>
                <select
                  value={capaForm.actionTaken}
                  onChange={(e) => setCapaForm({ ...capaForm, actionTaken: e.target.value as DefectAction })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="SCRAP">SCRAP</option>
                  <option value="REWORK">REWORK</option>
                  <option value="RETURN_TO_VENDOR">RETURN TO VENDOR</option>
                  <option value="USE_AS_IS">USE AS IS</option>
                  <option value="QUARANTINE">QUARANTINE</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCapaModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition"
                >
                  Update Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

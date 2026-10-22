'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scroll,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Download,
  Eye,
  ShieldCheck,
  Send,
  X,
  ChevronRight,
  Maximize2,
  FileCheck,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  TechnicalDrawingItem,
  DrawingSheetSize,
  BlueprintApprovalStatus,
} from '@/types/design';

const INITIAL_BLUEPRINTS: TechnicalDrawingItem[] = [
  {
    id: 'dwg-1',
    drawingNumber: 'DWG-SPN-0104',
    title: '5-Axis Spindle Head Finished Machining Blueprint',
    sheetSize: 'A1',
    revision: 'Rev 03',
    fileUrl: '/blueprints/dwg-spn-0104-rev3.pdf',
    isApprovedForProduction: true,
    releasedToProductionAt: '2026-02-28T14:30:00Z',
    releasedToQcAt: '2026-02-28T14:30:00Z',
    criticalDimensions: [
      {
        dimensionName: 'Bearing Seat Inner Diameter',
        nominalMm: 110.0,
        upperTolMm: 0.016,
        lowerTolMm: 0.0,
        isCpkMonitored: true,
      },
      {
        dimensionName: 'Mounting Flange Bolt Circle Dia',
        nominalMm: 220.0,
        upperTolMm: 0.025,
        lowerTolMm: -0.025,
        isCpkMonitored: true,
      },
      {
        dimensionName: 'Cooling Jacket Port Center Distance',
        nominalMm: 65.0,
        upperTolMm: 0.05,
        lowerTolMm: -0.05,
        isCpkMonitored: false,
      },
    ],
    geometricTolerances: 'ASME Y14.5M: Position 0.015 True Pos to Datum A-B-C, Flatness 0.008 on Face D',
    surfaceFinishRa: 0.4,
    status: 'APPROVED_FOR_PRODUCTION',
    drawnBy: 'D. Sen',
    checkedBy: 'Praveen Nair',
    approvedBy: 'H. Mehta (VP Eng)',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-28T14:30:00Z',
  },
  {
    id: 'dwg-2',
    drawingNumber: 'DWG-PLN-0112',
    title: 'Output Spline Hub Heat Treatment & Grinding Dimensions',
    sheetSize: 'A2',
    revision: 'Rev 02',
    fileUrl: '/blueprints/dwg-pln-0112-rev2.pdf',
    isApprovedForProduction: true,
    releasedToProductionAt: '2026-03-01T12:00:00Z',
    releasedToQcAt: '2026-03-01T12:00:00Z',
    criticalDimensions: [
      {
        dimensionName: 'Spline Major Diameter (36T)',
        nominalMm: 85.0,
        upperTolMm: 0.01,
        lowerTolMm: -0.005,
        isCpkMonitored: true,
      },
      {
        dimensionName: 'Bearing Journal Grinding Diameter',
        nominalMm: 60.0,
        upperTolMm: 0.008,
        lowerTolMm: 0.0,
        isCpkMonitored: true,
      },
    ],
    geometricTolerances: 'ISO 1101: Total Radial Runout 0.005 TIR on Bearing Journals',
    surfaceFinishRa: 0.2,
    status: 'APPROVED_FOR_PRODUCTION',
    drawnBy: 'Praveen Nair',
    checkedBy: 'D. Sen',
    approvedBy: 'H. Mehta (VP Eng)',
    createdAt: '2026-02-22T14:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'dwg-3',
    drawingNumber: 'DWG-AERO-0192',
    title: 'Aerospace Hydraulic Manifold Internal Bore Tolerances',
    sheetSize: 'A1',
    revision: 'Rev 01',
    fileUrl: '/blueprints/dwg-aero-0192-rev1.pdf',
    isApprovedForProduction: false,
    criticalDimensions: [
      {
        dimensionName: 'Cross-Drilled Valve Cavity Bore',
        nominalMm: 16.0,
        upperTolMm: 0.008,
        lowerTolMm: -0.002,
        isCpkMonitored: true,
      },
    ],
    geometricTolerances: 'AS9100D: Perpendicularity 0.010, Cylindricity 0.004',
    surfaceFinishRa: 0.1,
    status: 'PENDING_APPROVAL',
    drawnBy: 'Neha Deshmukh',
    checkedBy: 'D. Sen',
    createdAt: '2026-02-24T16:00:00Z',
    updatedAt: '2026-03-02T10:00:00Z',
  },
];

export default function BlueprintsPage() {
  const [blueprints, setBlueprints] = useState<TechnicalDrawingItem[]>(INITIAL_BLUEPRINTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sheetFilter, setSheetFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Release Modal
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [selectedDrawingForRelease, setSelectedDrawingForRelease] = useState<TechnicalDrawingItem | null>(null);
  const [releaseForm, setReleaseForm] = useState({
    releasedTo: 'BOTH',
    approvedBy: 'VP Engineering (H. Mehta)',
    surfaceFinishRa: 0.4,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchBlueprints = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/design/cad/drawings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBlueprints(data);
        }
      }
    } catch (err) {
      console.warn('API fallback', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlueprints();
  }, []);

  const handleReleaseBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrawingForRelease) return;

    try {
      await fetch('/api/v1/design/blueprints/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawingId: selectedDrawingForRelease.id,
          releasedTo: releaseForm.releasedTo,
          approvedBy: releaseForm.approvedBy,
          surfaceFinishRa: Number(releaseForm.surfaceFinishRa),
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setBlueprints((prev) =>
      prev.map((bp) =>
        bp.id === selectedDrawingForRelease.id
          ? {
              ...bp,
              isApprovedForProduction: true,
              status: 'APPROVED_FOR_PRODUCTION' as BlueprintApprovalStatus,
              releasedToProductionAt: new Date().toISOString(),
              releasedToQcAt: new Date().toISOString(),
              approvedBy: releaseForm.approvedBy,
              surfaceFinishRa: Number(releaseForm.surfaceFinishRa),
            }
          : bp,
      ),
    );

    setShowReleaseModal(false);
    setNotification(
      `Blueprint [${selectedDrawingForRelease.drawingNumber}] officially authorized & released to ${releaseForm.releasedTo}!`,
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredBlueprints = blueprints.filter((bp) => {
    const matchesSearch =
      bp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bp.drawingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bp.geometricTolerances && bp.geometricTolerances.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSheet = sheetFilter === 'ALL' || bp.sheetSize === sheetFilter;
    const matchesStatus = statusFilter === 'ALL' || bp.status === statusFilter;

    return matchesSearch && matchesSheet && matchesStatus;
  });

  const approvedCount = blueprints.filter((bp) => bp.isApprovedForProduction).length;
  const criticalDimsCount = blueprints.reduce(
    (sum, bp) =>
      sum + (bp.criticalDimensions?.filter((d) => d.isCpkMonitored).length || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/design" className="hover:text-violet-600 dark:hover:text-violet-400">
              Design Engineering
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Shop Floor Blueprints & GD&T</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-500/10">
              <Scroll className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Approved Blueprints & Quality Benchmarks
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  {approvedCount} Active in Shop Floor
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized manufacturing drawings, GD&T geometric tolerance frames, surface finish (Ra) & Cpk monitoring benchmarks
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBlueprints}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-violet-600 dark:text-violet-400' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Technical Blueprints</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{blueprints.length} Sheets</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Vector CAD drawing sheets</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-medium">Approved for Production</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{approvedCount} Active</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Live on machine control screens</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4">
          <span className="text-xs text-violet-600 dark:text-violet-400 block font-medium">Critical Cpk Dimensions</span>
          <span className="text-xl font-black text-violet-700 dark:text-violet-300 mt-1 block">{criticalDimsCount} Tolerances</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Real-time CMM statistical check</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4">
          <span className="text-xs text-amber-600 dark:text-amber-400 block font-medium">Surface Finish Benchmark</span>
          <span className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1 block">Ra 0.1 - 0.4 µm</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Super-precision ground quality</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search drawing number, GD&T spec..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Sheet Size:</span>
            <select
              value={sheetFilter}
              onChange={(e) => setSheetFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">All Sizes</option>
              <option value="A0">A0 Poster Sheet</option>
              <option value="A1">A1 Standard Shop Drawing</option>
              <option value="A2">A2 Sub-System Sheet</option>
              <option value="A3">A3 Component Sheet</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>Approval:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED_FOR_PRODUCTION">Approved for Production</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blueprints Grid */}
      <div className="space-y-4">
        {filteredBlueprints.map((bp) => (
          <div
            key={bp.id}
            className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-5 hover:border-violet-400 dark:hover:border-violet-500/30 transition space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-500/20 px-2 py-0.5 rounded">
                  {bp.drawingNumber}
                </span>
                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-bold">
                  {bp.revision}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{bp.title}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  {bp.sheetSize} Sheet
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    bp.isApprovedForProduction
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                  }`}
                >
                  <ShieldCheck className="h-3 w-3" />
                  {bp.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Geometric Tolerances & Surface Finish Banner */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                  GD&T Geometric Tolerance Feature Control Frame:
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">
                  {bp.geometricTolerances || 'Standard ISO 2768-mK Fine'}
                </span>
              </div>

              <div className="shrink-0 font-mono text-right bg-white dark:bg-slate-900 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-sans">
                  Target Surface Finish
                </span>
                <span className="text-violet-700 dark:text-violet-300 font-bold text-sm">
                  Ra {bp.surfaceFinishRa} µm
                </span>
              </div>
            </div>

            {/* Critical Dimensions Cpk Table */}
            {bp.criticalDimensions && bp.criticalDimensions.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                  Cpk Statistical Quality Dimensions (Shop Floor & CMM Inspection):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {bp.criticalDimensions.map((dim, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="text-slate-800 dark:text-slate-300 font-medium block">{dim.dimensionName}</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          {dim.nominalMm.toFixed(3)} mm
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] ml-1">
                          (+{dim.upperTolMm} / {dim.lowerTolMm})
                        </span>
                      </div>
                      {dim.isCpkMonitored && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20 font-bold font-mono">
                          CPK &gt; 1.67
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Authoring & Release Signatures */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span>Drawn: <strong className="text-slate-800 dark:text-slate-300">{bp.drawnBy}</strong></span>
                <span>Checked: <strong className="text-slate-800 dark:text-slate-300">{bp.checkedBy}</strong></span>
                {bp.approvedBy && (
                  <span>Approved: <strong className="text-emerald-600 dark:text-emerald-400">{bp.approvedBy}</strong></span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!bp.isApprovedForProduction && (
                  <button
                    onClick={() => {
                      setSelectedDrawingForRelease(bp);
                      setShowReleaseModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Authorize for Production
                  </button>
                )}
                <button
                  onClick={() => {
                    setNotification(`Downloading PDF Blueprint [${bp.drawingNumber}] ${bp.revision}`);
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  PDF Vector Sheet
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Authorize Release to Production */}
      {showReleaseModal && selectedDrawingForRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Authorize Blueprint for Production & QC
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  {selectedDrawingForRelease.drawingNumber} • {selectedDrawingForRelease.revision}
                </p>
              </div>
              <button
                onClick={() => setShowReleaseModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReleaseBlueprint} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Target Shop Departments *</label>
                <select
                  value={releaseForm.releasedTo}
                  onChange={(e) => setReleaseForm({ ...releaseForm, releasedTo: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="BOTH">Both Production Shop Floor & QC Lab</option>
                  <option value="PRODUCTION">Production Machining Only</option>
                  <option value="QC">Quality Control / CMM Room Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Approving Authority (Chief Engineer) *</label>
                <input
                  type="text"
                  required
                  value={releaseForm.approvedBy}
                  onChange={(e) => setReleaseForm({ ...releaseForm, approvedBy: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Surface Roughness Limit (Ra µm)</label>
                <input
                  type="number"
                  step="0.05"
                  value={releaseForm.surfaceFinishRa}
                  onChange={(e) =>
                    setReleaseForm({ ...releaseForm, surfaceFinishRa: Number(e.target.value) })
                  }
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReleaseModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="h-3.5 w-3.5" />
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

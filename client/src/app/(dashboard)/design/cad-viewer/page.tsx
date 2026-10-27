'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Download,
  Scroll,
  FileCode,
  CheckCircle2,
  X,
  ChevronRight,
  Layers,
  Maximize2,
  RotateCw,
  Box,
  Cpu,
} from 'lucide-react';
import {
  CadModelItem,
  CadFileFormat,
  CadStatus,
} from '@/types/design';

const INITIAL_CAD_MODELS: CadModelItem[] = [
  {
    id: 'cad-1',
    modelCode: 'CAD-2026-0084',
    name: '5-Axis Spindle Head Assembly & Mounting Flange',
    description: 'Precision dual-pivot spindle head casting with integrated labyrinth seal channels and internal cooling jacket.',
    fileFormat: 'STEP',
    fileUrl: '/cad/models/spindle-head-asm-v3.step',
    fileSizeBytes: 24500000,
    version: 'v3.2',
    category: 'MAIN_ASSEMBLY',
    materialSpec: 'Aluminum 7075-T6 (Hard Anodized)',
    massKg: 18.45,
    volumeMm3: 6589000,
    status: 'APPROVED',
    author: 'Chief Engineer (D. Sen)',
    approvedBy: 'VP Engineering (H. Mehta)',
    approvedAt: '2026-02-28T14:00:00Z',
    drawings: [
      {
        id: 'dwg-1',
        drawingNumber: 'DWG-SPN-0104',
        title: '5-Axis Spindle Machining Blueprint',
        revision: 'Rev 03',
        isApprovedForProduction: true,
      },
    ],
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-28T14:00:00Z',
  },
  {
    id: 'cad-2',
    modelCode: 'CAD-2026-0088',
    name: 'Planetary Gearbox Output Hub & Spline Shaft',
    description: 'High-torque involute spline transmission output shaft for heavy industrial servo drives with case-hardened tooth profiles.',
    fileFormat: 'SLDPRT',
    fileUrl: '/cad/models/planetary-output-hub.sldprt',
    fileSizeBytes: 14200000,
    version: 'v2.1',
    category: 'SUB_ASSEMBLY',
    materialSpec: 'AISI 4340 Nickel-Chromium Steel',
    massKg: 8.2,
    volumeMm3: 1045000,
    status: 'APPROVED',
    author: 'Praveen Nair',
    approvedBy: 'VP Engineering (H. Mehta)',
    approvedAt: '2026-03-01T11:30:00Z',
    drawings: [
      {
        id: 'dwg-2',
        drawingNumber: 'DWG-PLN-0112',
        title: 'Output Spline Hub Grinding Dimensions',
        revision: 'Rev 02',
        isApprovedForProduction: true,
      },
    ],
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-03-01T11:30:00Z',
  },
  {
    id: 'cad-3',
    modelCode: 'CAD-2026-0092',
    name: 'Aerospace Hydraulic Valve Manifold Block',
    description: 'Complex micro-bore internal flow cross-drilled manifold with zero leakage check valve seats for fly-by-wire flight actuators.',
    fileFormat: 'STEP',
    fileUrl: '/cad/models/aero-hydraulic-manifold.step',
    fileSizeBytes: 31000000,
    version: 'v1.4',
    category: 'PART',
    materialSpec: 'Titanium Ti-6Al-4V Grade 5',
    massKg: 4.65,
    volumeMm3: 1050000,
    status: 'IN_REVIEW',
    author: 'Neha Deshmukh',
    drawings: [
      {
        id: 'dwg-3',
        drawingNumber: 'DWG-AERO-0192',
        title: 'Hydraulic Manifold Cross-Bore Tolerances',
        revision: 'Rev 01',
        isApprovedForProduction: false,
      },
    ],
    createdAt: '2026-02-24T15:00:00Z',
    updatedAt: '2026-03-04T16:00:00Z',
  },
  {
    id: 'cad-4',
    modelCode: 'CAD-2026-0096',
    name: 'Modular Tombstone 4-Sided CNC Milling Fixture',
    description: 'Cast iron tombstone fixture base with precision ground M12 grid hole pattern and hydraulic pull-stud clamp interfaces.',
    fileFormat: 'IGES',
    fileUrl: '/cad/models/tombstone-fixture-400mm.iges',
    fileSizeBytes: 42000000,
    version: 'v1.0',
    category: 'FIXTURE',
    materialSpec: 'Class 40 Grey Cast Iron (Stress Relieved)',
    massKg: 64.0,
    volumeMm3: 8900000,
    status: 'APPROVED',
    author: 'Praveen Nair',
    approvedBy: 'Tooling Superintendent',
    approvedAt: '2026-02-18T10:00:00Z',
    createdAt: '2026-02-14T11:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
];

export default function CadViewerPage() {
  const [cadModels, setCadModels] = useState<CadModelItem[]>(INITIAL_CAD_MODELS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [formatFilter, setFormatFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Inspector Modal
  const [inspectingModel, setInspectingModel] = useState<CadModelItem | null>(null);
  const [renderMode, setRenderMode] = useState<'SHADED' | 'WIREFRAME' | 'SECTION'>('SHADED');
  const [viewportAngle, setViewportAngle] = useState<'ISO' | 'FRONT' | 'TOP' | 'RIGHT'>('ISO');

  // Register Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    fileFormat: 'STEP' as CadFileFormat,
    fileUrl: '',
    version: 'v1.0',
    category: 'PART',
    materialSpec: 'Aluminum 7075-T6',
    massKg: 5.5,
    volumeMm3: 2000000,
    author: 'Design Engineer',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchCadModels = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/design/cad/models');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCadModels(data);
        }
      }
    } catch (err) {
      console.warn('API fallback', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCadModels();
  }, []);

  const handleCreateCadModel = async (e: React.FormEvent) => {
    e.preventDefault();
    const newModel: CadModelItem = {
      id: `cad-${Date.now()}`,
      modelCode: `CAD-2026-0${cadModels.length + 95}`,
      name: createForm.name,
      description: createForm.description,
      fileFormat: createForm.fileFormat,
      fileUrl: createForm.fileUrl || '/cad/models/new-part.step',
      fileSizeBytes: 18500000,
      version: createForm.version,
      category: createForm.category,
      materialSpec: createForm.materialSpec,
      massKg: Number(createForm.massKg),
      volumeMm3: Number(createForm.volumeMm3),
      status: 'IN_REVIEW',
      author: createForm.author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/v1/design/cad/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createForm,
          massKg: Number(createForm.massKg),
          volumeMm3: Number(createForm.volumeMm3),
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setCadModels([newModel, ...cadModels]);
    setShowCreateModal(false);
    setNotification(`3D CAD Model [${newModel.modelCode}] registered into Vault!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredModels = cadModels.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.modelCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.materialSpec && m.materialSpec.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    const matchesFormat = formatFilter === 'ALL' || m.fileFormat === formatFilter;

    return matchesSearch && matchesCat && matchesFormat;
  });

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
            <span className="text-slate-700 dark:text-slate-200">3D CAD Model Repository</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-500/10">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                3D CAD Model Repository & Drawing Viewer
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 border border-violet-300 dark:border-violet-500/30">
                  STEP / IGES / SLDPRT
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Parametric CAD geometry, mass properties, technical blueprints & component revision control
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCadModels}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-violet-500 dark:text-violet-400' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-xs font-semibold shadow-lg shadow-violet-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Register 3D CAD Model
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search CAD models, alloy specs, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-violet-500/50"
            >
              <option value="ALL">All Categories</option>
              <option value="MAIN_ASSEMBLY">Main Assemblies</option>
              <option value="SUB_ASSEMBLY">Sub-Assemblies</option>
              <option value="PART">Fabricated Parts</option>
              <option value="FIXTURE">Tooling & Fixtures</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>Format:</span>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-violet-500/50"
            >
              <option value="ALL">All Formats</option>
              <option value="STEP">STEP (.step/.stp)</option>
              <option value="SLDPRT">SolidWorks (.sldprt)</option>
              <option value="IGES">IGES (.iges/.igs)</option>
              <option value="DWG">AutoCAD DWG</option>
            </select>
          </div>
        </div>
      </div>

      {/* CAD Models Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredModels.map((cad) => (
          <div
            key={cad.id}
            className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 hover:border-violet-400 dark:hover:border-violet-500/30 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-500/20 px-2 py-0.5 rounded">
                      {cad.modelCode}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">
                      {cad.version}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-violet-700 dark:text-violet-300 font-mono">
                      {cad.fileFormat}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cad.name}</h3>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    cad.status === 'APPROVED'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                  }`}
                >
                  {cad.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{cad.description}</p>

              {/* Physical Telemetry */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800/80 text-xs mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">Material Alloy</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold truncate block">{cad.materialSpec}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">Mass (Weight)</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{cad.massKg} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">Volume</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-semibold">
                    {((cad.volumeMm3 || 0) / 1000).toFixed(0)} cm³
                  </span>
                </div>
              </div>

              {/* Associated Technical Blueprints */}
              {cad.drawings && cad.drawings.length > 0 && (
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Associated Shop Floor Blueprints:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cad.drawings.map((dwg) => (
                      <span
                        key={dwg.id}
                        className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5"
                      >
                        <Scroll className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                        {dwg.drawingNumber} ({dwg.revision})
                        {dwg.isApprovedForProduction && (
                          <span className="text-[8px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1 rounded border border-emerald-300 dark:border-emerald-500/20">
                            PROD READY
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Author: <strong className="text-slate-700 dark:text-slate-400">{cad.author}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectingModel(cad)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 dark:bg-violet-500/10 dark:hover:bg-violet-500/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 text-xs font-semibold transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  3D View Inspector
                </button>
                <button
                  onClick={() => {
                    setNotification(`Downloading CAD Model [${cad.modelCode}] ${cad.name}`);
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
                  title="Download CAD file"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Interactive 3D CAD Inspector */}
      {inspectingModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 p-4 backdrop-blur-md">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <Box className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {inspectingModel.name}
                    <span className="text-xs font-mono text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.5 rounded border border-violet-200 dark:border-violet-500/20">
                      {inspectingModel.modelCode}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    File: {inspectingModel.fileFormat} • Version: {inspectingModel.version} • Material: {inspectingModel.materialSpec}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectingModel(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Simulated 3D Viewport Area */}
            <div className="relative h-80 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden group">
              {/* Grid backdrop */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.4) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Wireframe geometric graphic simulation */}
              <div className="relative flex flex-col items-center justify-center space-y-3 z-10 text-center">
                <div className="relative h-32 w-32 rounded-2xl border-2 border-dashed border-violet-500/60 bg-gradient-to-br from-violet-600/10 to-indigo-950/40 flex items-center justify-center shadow-xl shadow-violet-500/10 transform group-hover:rotate-6 transition duration-500">
                  <Cpu className="h-14 w-14 text-violet-400 opacity-90 animate-pulse" />
                  <div className="absolute -top-2 -right-2 text-[9px] font-mono bg-violet-600 text-white px-1.5 py-0.5 rounded font-bold">
                    3D SOLID
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Active Viewport Orientation: {viewportAngle}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Render Mode: <strong className="text-violet-400">{renderMode}</strong> • Coordinate System: WCS (World)
                  </p>
                </div>
              </div>

              {/* Viewport Control Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/90 dark:bg-[#0d1322]/90 border border-slate-800 p-1.5 rounded-lg backdrop-blur-sm text-xs">
                {(['ISO', 'FRONT', 'TOP', 'RIGHT'] as const).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setViewportAngle(angle)}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                      viewportAngle === angle
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {angle}
                  </button>
                ))}
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/90 dark:bg-[#0d1322]/90 border border-slate-800 p-1.5 rounded-lg backdrop-blur-sm text-xs">
                {(['SHADED', 'WIREFRAME', 'SECTION'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setRenderMode(mode)}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                      renderMode === mode
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-[#090d16] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Alloy Material</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold block">{inspectingModel.materialSpec}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Mass (Weight)</span>
                <span className="text-violet-700 dark:text-violet-400 font-mono font-bold block">{inspectingModel.massKg} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Volume</span>
                <span className="text-slate-800 dark:text-slate-200 font-mono font-semibold block">
                  {((inspectingModel.volumeMm3 || 0) / 1000).toFixed(0)} cm³
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block">{inspectingModel.status}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setInspectingModel(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
              >
                Close Inspector
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotification(`Initiated download of ${inspectingModel.fileFormat} geometry`);
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Export {inspectingModel.fileFormat} File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New CAD Model */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Register 3D CAD Assembly or Component
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCadModel} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Model / Assembly Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-Axis Spindle Head Assembly"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  placeholder="Functional purpose, interface mating surfaces, tolerances..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Geometry Format *</label>
                  <select
                    value={createForm.fileFormat}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        fileFormat: e.target.value as CadFileFormat,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="STEP">STEP (.step/.stp)</option>
                    <option value="SLDPRT">SolidWorks (.sldprt)</option>
                    <option value="IGES">IGES (.iges)</option>
                    <option value="PARASOLID">Parasolid (.x_t)</option>
                    <option value="DWG">AutoCAD DWG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Category *</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="PART">Fabricated Part</option>
                    <option value="SUB_ASSEMBLY">Sub-Assembly</option>
                    <option value="MAIN_ASSEMBLY">Main Assembly</option>
                    <option value="FIXTURE">Tooling / Fixture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Material Alloy Spec *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aluminum 7075-T6, SS316L"
                    value={createForm.materialSpec}
                    onChange={(e) => setCreateForm({ ...createForm, materialSpec: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Estimated Mass (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={createForm.massKg}
                    onChange={(e) => setCreateForm({ ...createForm, massKg: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">CAD File Storage URL / Path *</label>
                <input
                  type="text"
                  required
                  placeholder="/cad/models/part-v1.step"
                  value={createForm.fileUrl}
                  onChange={(e) => setCreateForm({ ...createForm, fileUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Initial Revision</label>
                  <input
                    type="text"
                    value={createForm.version}
                    onChange={(e) => setCreateForm({ ...createForm, version: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Author / Designer</label>
                  <input
                    type="text"
                    required
                    value={createForm.author}
                    onChange={(e) => setCreateForm({ ...createForm, author: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  Confirm & Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

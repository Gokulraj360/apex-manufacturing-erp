'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Boxes,
  Layers,
  GitCompare,
  Activity,
  Scroll,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  Zap,
  Target,
  ArrowUpRight,
  Check,
  Cpu,
  BarChart3,
} from 'lucide-react';
import {
  DesignEngineeringOverviewMetrics,
  CadModelItem,
  BillOfMaterialsMasterItem,
  EngineeringChangeNoticeItem,
  PrototypeTestLogItem,
  TechnicalDrawingItem,
} from '@/types/design';

const MOCK_METRICS: DesignEngineeringOverviewMetrics = {
  totalCadModels: 18,
  totalDrawings: 34,
  approvedDrawings: 31,
  blueprintAccuracyPct: 98.4,
  totalBOMs: 14,
  releasedBOMs: 11,
  totalECNs: 9,
  pendingECNs: 3,
  totalTests: 22,
  prototypePassRatePct: 95.4,
};

const MOCK_CAD_MODELS: CadModelItem[] = [
  {
    id: 'cad-1',
    modelCode: 'CAD-2026-0084',
    name: '5-Axis Spindle Head Assembly & Mounting Flange',
    description: 'Precision dual-pivot spindle head casting with integrated labyrinth seal channels.',
    fileFormat: 'STEP',
    fileUrl: '/cad/models/spindle-head-asm-v3.step',
    fileSizeBytes: 24500000,
    version: 'v3.2',
    category: 'MAIN_ASSEMBLY',
    materialSpec: 'Aluminum 7075-T6 (Anodized)',
    massKg: 18.45,
    volumeMm3: 6589000,
    status: 'APPROVED',
    author: 'Chief Engineer (D. Sen)',
    approvedBy: 'VP Engineering (H. Mehta)',
    approvedAt: '2026-02-28T14:00:00Z',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-28T14:00:00Z',
  },
  {
    id: 'cad-2',
    modelCode: 'CAD-2026-0088',
    name: 'Planetary Gearbox Output Hub & Spline Shaft',
    description: 'High-torque involute spline transmission output shaft for heavy industrial servo drives.',
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
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-03-01T11:30:00Z',
  },
  {
    id: 'cad-3',
    modelCode: 'CAD-2026-0092',
    name: 'Aerospace Hydraulic Valve Manifold Block',
    description: 'Complex micro-bore internal flow cross-drilled manifold with zero leakage check valve seats.',
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
    createdAt: '2026-02-24T15:00:00Z',
    updatedAt: '2026-03-04T16:00:00Z',
  },
];

const MOCK_ECNS: EngineeringChangeNoticeItem[] = [
  {
    id: 'ecn-1',
    ecnNumber: 'ECN-2026-0081',
    title: 'Spindle Housing Bearing Pocket Tolerance Tightening',
    reasonForChange: 'DEFECT_FIX',
    priority: 'CRITICAL',
    description: 'Tightened bearing seat diameter bore tolerance from H7 (+0.030mm) to H6 (+0.016mm) to mitigate thermal runout under 12,000 RPM operation.',
    changeScope: 'Machine Bed Casting (DWG-SPN-0104) and Assembly BOM (BOM-2026-0042)',
    status: 'UNDER_REVIEW',
    requestedBy: 'Quality Assurance Lead',
    implementationTargetDate: '2026-03-15T00:00:00Z',
    inventoryDisposition: 'REWORK_IN_SHOP',
    costImpactEstimate: 2400,
    createdAt: '2026-03-02T11:00:00Z',
    updatedAt: '2026-03-04T10:00:00Z',
  },
  {
    id: 'ecn-2',
    ecnNumber: 'ECN-2026-0084',
    title: 'Planetary Gear Pinion Material Substitution to 18CrNiMo7-6',
    reasonForChange: 'MATERIAL_SUBSTITUTION',
    priority: 'HIGH',
    description: 'Substituted core case-hardened alloy to enhance fatigue life beyond 50,000 continuous hours in mining gearboxes.',
    changeScope: 'Sub-Assembly Pinion Gears and Procurement Raw Stock Specs',
    status: 'APPROVED',
    requestedBy: 'Praveen Nair',
    reviewedBy: 'Chief Metallurgist (Dr. Roy)',
    approvedBy: 'VP Engineering (H. Mehta)',
    approvedAt: '2026-03-05T14:00:00Z',
    implementationTargetDate: '2026-03-20T00:00:00Z',
    inventoryDisposition: 'USE_EXISTING_STOCK_FIRST',
    costImpactEstimate: 1200,
    createdAt: '2026-02-26T16:00:00Z',
    updatedAt: '2026-03-05T14:00:00Z',
  },
];

const MOCK_PROTOTYPE_TESTS: PrototypeTestLogItem[] = [
  {
    id: 'ptl-1',
    testLogNumber: 'PTL-2026-0035',
    cadModelId: 'cad-1',
    prototypeSerial: 'PROTO-SPN-001',
    testType: 'STRESS_TEST',
    testParameters: {
      appliedLoadKn: 45.0,
      maxStressMpa: 285.4,
      testDurationHours: 120,
    },
    observedOutcome: 'Zero plastic deformation detected. von Mises stress remained well below 7075-T6 yield strength (503 MPa).',
    result: 'PASSED',
    maxDeformationMm: 0.012,
    yieldSafetyFactor: 2.65,
    engineerInCharge: 'R&D FEA Lab (K. Rao)',
    testedAt: '2026-03-03T16:00:00Z',
    nextIterationRequired: false,
    createdAt: '2026-03-03T16:00:00Z',
    updatedAt: '2026-03-03T16:00:00Z',
  },
  {
    id: 'ptl-2',
    testLogNumber: 'PTL-2026-0038',
    cadModelId: 'cad-2',
    prototypeSerial: 'PROTO-PLN-002',
    testType: 'TORQUE_LOAD_TEST',
    testParameters: {
      appliedLoadKn: 65.0,
      maxStressMpa: 420.0,
      testDurationHours: 72,
    },
    observedOutcome: 'Output spline teeth exhibited excellent load distribution with no micro-pitting or tooth root deflection.',
    result: 'PASSED',
    maxDeformationMm: 0.008,
    yieldSafetyFactor: 2.15,
    engineerInCharge: 'Transmission Test Bench Lead',
    testedAt: '2026-03-05T12:00:00Z',
    nextIterationRequired: false,
    createdAt: '2026-03-05T12:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
  },
];

const MOCK_BLUEPRINTS: TechnicalDrawingItem[] = [
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
    geometricTolerances: 'ASME Y14.5M: Position 0.015 True Pos, Flatness 0.008',
    surfaceFinishRa: 0.4,
    status: 'APPROVED_FOR_PRODUCTION',
    drawnBy: 'D. Sen',
    checkedBy: 'Praveen Nair',
    approvedBy: 'H. Mehta',
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
    geometricTolerances: 'ISO 1101: Runout 0.005 TIR on Bearing Journals',
    surfaceFinishRa: 0.2,
    status: 'APPROVED_FOR_PRODUCTION',
    drawnBy: 'Praveen Nair',
    checkedBy: 'D. Sen',
    approvedBy: 'H. Mehta',
    createdAt: '2026-02-22T14:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
];

export default function DesignEngineeringOverviewPage() {
  const [metrics, setMetrics] = useState<DesignEngineeringOverviewMetrics>(MOCK_METRICS);
  const [cadModels, setCadModels] = useState<CadModelItem[]>(MOCK_CAD_MODELS);
  const [ecns, setEcns] = useState<EngineeringChangeNoticeItem[]>(MOCK_ECNS);
  const [tests, setTests] = useState<PrototypeTestLogItem[]>(MOCK_PROTOTYPE_TESTS);
  const [blueprints, setBlueprints] = useState<TechnicalDrawingItem[]>(MOCK_BLUEPRINTS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [metricsRes, cadRes, ecnRes, testRes, bpRes] = await Promise.allSettled([
        fetch('/api/v1/design/blueprints/overview-metrics'),
        fetch('/api/v1/design/cad/models'),
        fetch('/api/v1/design/ecn'),
        fetch('/api/v1/design/prototype/tests'),
        fetch('/api/v1/design/blueprints/released'),
      ]);

      if (metricsRes.status === 'fulfilled' && metricsRes.value.ok) {
        const mData = await metricsRes.value.json();
        setMetrics(mData);
      }
      if (cadRes.status === 'fulfilled' && cadRes.value.ok) {
        const cData = await cadRes.value.json();
        if (Array.isArray(cData) && cData.length > 0) setCadModels(cData.slice(0, 5));
      }
    } catch (err) {
      console.warn('API fallback to rich default telemetry', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-lg shadow-violet-500/10">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Design Engineering Command Center
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  R&D & Lifecycle
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                3D CAD assemblies, multi-level BOM version control, ECN sign-offs, prototype FEA testing & shop floor blueprints
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-violet-400' : ''}`} />
            Sync Vault
          </button>
          <Link
            href="/design/cad-viewer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-xs font-semibold shadow-lg shadow-violet-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New CAD Model
          </Link>
          <Link
            href="/design/ecn"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition"
          >
            <GitCompare className="h-3.5 w-3.5 text-violet-400" />
            Submit ECN
          </Link>
        </div>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: 3D CAD Repository & Vault */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-violet-500/40 transition">
          <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              3D CAD Models in Vault
            </span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Boxes className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {metrics.totalCadModels}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              <strong className="text-emerald-400 font-semibold">{metrics.approvedDrawings}</strong> Approved Blueprints
            </span>
            <span className="text-emerald-400 flex items-center gap-0.5 text-[11px] font-medium">
              <ArrowUpRight className="h-3 w-3" /> {metrics.blueprintAccuracyPct}% Accuracy
            </span>
          </div>
        </div>

        {/* Card 2: Multi-Level BOM Publishing */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-violet-500/40 transition">
          <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Multi-Level BOM Structures
            </span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {metrics.totalBOMs} Master Assemblies
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Released to ERP: <strong className="text-emerald-400">{metrics.releasedBOMs}</strong>
            </span>
            <span className="text-violet-300 text-[11px]">
              {Math.round((metrics.releasedBOMs / metrics.totalBOMs) * 100)}% Production Live
            </span>
          </div>
        </div>

        {/* Card 3: Engineering Change Control (ECN) */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-violet-500/40 transition">
          <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Active Change Notices (ECN)
            </span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <GitCompare className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {metrics.totalECNs} Total
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Pending Sign-Off: <strong className="text-amber-400">{metrics.pendingECNs}</strong>
            </span>
            <span className="text-amber-400 flex items-center gap-0.5 text-[11px] font-medium">
              <Clock className="h-3 w-3" /> Under Review
            </span>
          </div>
        </div>

        {/* Card 4: Prototype Stress & FEA Verification */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-violet-500/40 transition">
          <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Prototype & FEA Validation
            </span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
            <span>{metrics.prototypePassRatePct}%</span>
            <span className="text-xs font-normal text-slate-400">Pass Rate</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Physical Runs: <strong className="text-white">{metrics.totalTests}</strong>
            </span>
            <span className="text-emerald-400 flex items-center gap-0.5 text-[11px]">
              <Check className="h-3 w-3" /> Safety Factor &gt; 2.0
            </span>
          </div>
        </div>
      </div>

      {/* Module Quick Access Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            title: '3D CAD & Drawings',
            desc: 'STEP, SLDPRT, DWG vault',
            href: '/design/cad-viewer',
            icon: Boxes,
            badge: `${cadModels.length} Models`,
          },
          {
            title: 'Multi-Level BOMs',
            desc: 'Cost rollup & part specs',
            href: '/design/bom-editor',
            icon: Layers,
            badge: `${metrics.totalBOMs} Structures`,
          },
          {
            title: 'Change Notices (ECN)',
            desc: 'Sign-offs & scrap disposition',
            href: '/design/ecn',
            icon: GitCompare,
            badge: `${metrics.pendingECNs} In Review`,
          },
          {
            title: 'Prototype Stress Testing',
            desc: 'FEA von Mises & fatigue logs',
            href: '/design/prototyping',
            icon: Activity,
            badge: `${tests.length} Logs`,
          },
          {
            title: 'Shop Floor Blueprints',
            desc: 'GD&T & surface Ra tolerances',
            href: '/design/blueprints',
            icon: Scroll,
            badge: `${blueprints.length} Released`,
          },
        ].map((module, i) => {
          const Icon = module.icon;
          return (
            <Link
              key={i}
              href={module.href}
              className="bg-[#0d1322] border border-slate-800 hover:border-violet-500/50 rounded-xl p-3.5 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-violet-300">
                  {module.badge}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition flex items-center justify-between">
                  {module.title}
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition" />
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{module.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active CAD Models & ECN Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active 3D CAD Models Spotlight */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-violet-400" />
                  Primary 3D Assemblies & Parametric CAD Models
                </h3>
                <p className="text-xs text-slate-400">
                  High-fidelity 3D models with material definitions, mass properties, and release status
                </p>
              </div>
              <Link
                href="/design/cad-viewer"
                className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                Open Vault <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {cadModels.map((cad) => (
                <div
                  key={cad.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2 py-0.5 rounded">
                        {cad.modelCode}
                      </span>
                      <h4 className="text-xs font-bold text-white">{cad.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {cad.version}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full self-start ${
                        cad.status === 'APPROVED'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {cad.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">{cad.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 px-3 rounded-lg bg-[#090d16] border border-slate-800/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Format</span>
                      <span className="text-violet-300 font-bold font-mono">{cad.fileFormat}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Material Spec</span>
                      <span className="text-slate-200 font-medium truncate block">{cad.materialSpec}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Mass / Volume</span>
                      <span className="text-slate-200 font-mono font-semibold">
                        {cad.massKg} kg ({((cad.volumeMm3 || 0) / 1000).toFixed(0)} cm³)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Author</span>
                      <span className="text-slate-300 truncate block">{cad.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Change Notice (ECN) Workflow Board */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-amber-400" />
                  Engineering Change Notices (ECN) Queue
                </h3>
                <p className="text-xs text-slate-400">
                  Critical design revisions, tolerance improvements & stock disposition tracking
                </p>
              </div>
              <Link
                href="/design/ecn"
                className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                ECN Desk <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {ecns.map((ecn) => (
                <div
                  key={ecn.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                        {ecn.ecnNumber}
                      </span>
                      <span className="font-bold text-white">{ecn.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          ecn.priority === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {ecn.priority}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          ecn.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {ecn.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300">{ecn.description}</p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>
                      Scope: <strong className="text-slate-300">{ecn.changeScope}</strong>
                    </span>
                    <span>
                      Stock Disposition: <strong className="text-violet-300">{ecn.inventoryDisposition}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Prototype Stress & Shop Blueprints */}
        <div className="space-y-6">
          {/* Prototype FEA Stress Testing */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  Prototype Testing & FEA
                </h3>
                <p className="text-xs text-slate-400">Physical load & von Mises validation</p>
              </div>
              <Link
                href="/design/prototyping"
                className="text-xs font-semibold text-violet-400 hover:text-violet-300"
              >
                Log Test
              </Link>
            </div>

            <div className="space-y-3">
              {tests.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-400 font-bold">{t.testLogNumber}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                      {t.result}
                    </span>
                  </div>

                  <div className="text-xs text-white font-medium">{t.observedOutcome}</div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono bg-[#090d16] p-2 rounded border border-slate-800">
                    <span>Load: {t.testParameters.appliedLoadKn} kN</span>
                    <span>Max: {t.testParameters.maxStressMpa} MPa</span>
                    <span className="text-emerald-400 font-bold">SF: {t.yieldSafetyFactor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production Released Blueprints & GD&T Tolerances */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scroll className="h-4 w-4 text-violet-400" />
                  Released Blueprints
                </h3>
                <p className="text-xs text-slate-400">Live on CNC machines & CMM QC stations</p>
              </div>
              <Link
                href="/design/blueprints"
                className="text-xs font-semibold text-violet-400 hover:text-violet-300"
              >
                All Blueprints
              </Link>
            </div>

            <div className="space-y-3">
              {blueprints.map((bp) => (
                <div
                  key={bp.id}
                  className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-violet-400 font-bold">{bp.drawingNumber}</span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      {bp.revision}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-white truncate">{bp.title}</h5>

                  <div className="text-[10px] text-slate-400">
                    <span>{bp.geometricTolerances}</span>
                    <span className="block mt-0.5 text-violet-300">
                      Surface Finish: Ra {bp.surfaceFinishRa} µm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* R&D Compliance & Standards Badges */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-violet-400" />
              R&D Standards Compliance
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              All engineering design outputs comply with aerospace & machine tool ISO/ASME specs:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'ASME Y14.5M (GD&T)',
                'ISO 2768-mK Tolerances',
                'AS9100D Aerospace Rev D',
                'DIN 7168 Fine Machining',
                'MIL-STD-810H Vibration',
              ].map((std, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-violet-300 font-medium"
                >
                  ✓ {std}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

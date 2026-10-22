'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Download,
  Share2,
  FileText,
  Boxes,
  Video,
  FileCheck,
  Shield,
  Tag,
  CheckCircle2,
  X,
  ChevronRight,
  ExternalLink,
  Lock,
  Globe,
} from 'lucide-react';
import {
  DigitalAssetItem,
  DigitalAssetType,
} from '@/types/marketing';

const INITIAL_ASSETS: DigitalAssetItem[] = [
  {
    id: 'ast-1',
    assetCode: 'MKT-AST-26002',
    title: '5-Axis CNC Milling Capabilities & Tolerance Spec Sheet',
    description: 'Detailed engineering tolerance bounds (+/- 2 microns), machine bed travel dimensions, and aerospace grade cutting speeds.',
    type: 'TECH_SPEC_SHEET',
    fileUrl: '/specs/cnc-5axis-spec-sheet-v2.pdf',
    fileSizeBytes: 3450000,
    mimeType: 'application/pdf',
    version: 'v2.2',
    isPublic: true,
    partnerAccessAllowed: true,
    downloadCount: 420,
    tags: ['CNC', 'Tolerance', '5-Axis', 'Aerospace'],
    uploadedBy: 'Technical Marketing Team',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'ast-2',
    assetCode: 'MKT-AST-26005',
    title: 'Enterprise Manufacturing Capabilities Comprehensive Brochure 2026',
    description: 'Corporate overview covering plant footprint, cleanroom facilities, robotic welding cells, and quality lab certifications.',
    type: 'PRODUCT_BROCHURE',
    fileUrl: '/brochures/corporate-manufacturing-2026.pdf',
    fileSizeBytes: 8200000,
    mimeType: 'application/pdf',
    version: 'v1.4',
    isPublic: true,
    partnerAccessAllowed: true,
    downloadCount: 560,
    tags: ['Corporate', 'Brochure', 'Plant Overview'],
    uploadedBy: 'Brand Communications',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'ast-3',
    assetCode: 'MKT-AST-26009',
    title: 'Standard Tooling & Fixture Components CAD Catalog (STEP & IGES)',
    description: 'Parametric CAD assemblies of quick-change zero-point clamps, tombstone fixtures, and modular hydraulic vise jaws.',
    type: 'CAD_CATALOG',
    fileUrl: '/cad/tooling-components-2026.zip',
    fileSizeBytes: 45000000,
    mimeType: 'application/zip',
    version: 'v3.0',
    isPublic: false,
    partnerAccessAllowed: true,
    downloadCount: 195,
    tags: ['CAD', 'STEP', 'Fixtures', 'OEM Partner'],
    uploadedBy: 'Design Engineering',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-03-03T00:00:00Z',
  },
  {
    id: 'ast-4',
    assetCode: 'MKT-AST-26014',
    title: 'AS9100D Titanium Machining Case Study: Lightweight Aero Bracket',
    description: 'Case analysis highlighting 38% mass reduction and zero fatigue failure over 5,000 thermal cycles.',
    type: 'CASE_STUDY',
    fileUrl: '/case-studies/titanium-bracket-as9100d.pdf',
    fileSizeBytes: 4100000,
    mimeType: 'application/pdf',
    version: 'v1.1',
    isPublic: true,
    partnerAccessAllowed: true,
    downloadCount: 280,
    tags: ['Case Study', 'Titanium', 'Aerospace', 'AS9100D'],
    uploadedBy: 'Solutions Consulting',
    createdAt: '2026-02-12T00:00:00Z',
    updatedAt: '2026-03-04T00:00:00Z',
  },
  {
    id: 'ast-5',
    assetCode: 'MKT-AST-26018',
    title: 'Official Corporate Brand Assets & Vector Identity Guidelines',
    description: 'Vector SVG logos, color palettes, typography specifications, and co-branding templates for channel distributor portals.',
    type: 'BRAND_ASSET',
    fileUrl: '/brand/apex-brand-kit-2026.zip',
    fileSizeBytes: 18500000,
    mimeType: 'application/zip',
    version: 'v2.0',
    isPublic: false,
    partnerAccessAllowed: true,
    downloadCount: 85,
    tags: ['Brand', 'Logos', 'Distributor', 'Graphics'],
    uploadedBy: 'Brand Communications',
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
];

export default function DigitalAssetRepositoryPage() {
  const [assets, setAssets] = useState<DigitalAssetItem[]>(INITIAL_ASSETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [accessFilter, setAccessFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'PRODUCT_BROCHURE' as DigitalAssetType,
    fileUrl: '',
    version: 'v1.0',
    isPublic: true,
    partnerAccessAllowed: true,
    tags: '',
    uploadedBy: 'Marketing Ops',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchAssets = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/marketing/assets');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAssets(data);
        }
      }
    } catch (err) {
      console.warn('API fetch fallback to sample assets', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = uploadForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newAsset: DigitalAssetItem = {
      id: `ast-${Date.now()}`,
      assetCode: `MKT-AST-260${assets.length + 20}`,
      title: uploadForm.title,
      description: uploadForm.description,
      type: uploadForm.type,
      fileUrl: uploadForm.fileUrl || '/docs/sample-spec.pdf',
      fileSizeBytes: 3200000,
      mimeType: 'application/pdf',
      version: uploadForm.version,
      isPublic: uploadForm.isPublic,
      partnerAccessAllowed: uploadForm.partnerAccessAllowed,
      downloadCount: 0,
      tags: tagArray.length > 0 ? tagArray : ['Marketing', 'Product'],
      uploadedBy: uploadForm.uploadedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/v1/marketing/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadForm,
          tags: tagArray,
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setAssets([newAsset, ...assets]);
    setShowUploadModal(false);
    setNotification(`Digital asset '${newAsset.title}' registered to repository!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDownload = async (asset: DigitalAssetItem) => {
    try {
      await fetch(`/api/v1/marketing/assets/${asset.id}/download`, {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Offline increment', err);
    }

    setAssets((prev) =>
      prev.map((a) =>
        a.id === asset.id ? { ...a, downloadCount: a.downloadCount + 1 } : a,
      ),
    );

    setNotification(`Simulating download of [${asset.assetCode}] ${asset.title}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredAssets = assets.filter((ast) => {
    const matchesSearch =
      ast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ast.description && ast.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || ast.type === typeFilter;
    const matchesAccess =
      accessFilter === 'ALL'
        ? true
        : accessFilter === 'PUBLIC'
        ? ast.isPublic
        : !ast.isPublic && ast.partnerAccessAllowed;

    return matchesSearch && matchesType && matchesAccess;
  });

  const totalDownloads = assets.reduce((sum, a) => sum + a.downloadCount, 0);
  const publicCount = assets.filter((a) => a.isPublic).length;
  const partnerCount = assets.filter((a) => !a.isPublic && a.partnerAccessAllowed).length;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/marketing" className="hover:text-amber-600 dark:hover:text-amber-400">
              Marketing
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-800 dark:text-slate-200">Digital Asset Repository</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Digital Asset Repository
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                  Version Controlled
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Centralized library for customer-facing product brochures, CAD STEP models, tolerance specs & brand collateral
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAssets}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Register New Asset
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Repository Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Documents</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{assets.length}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Active technical specs & collaterals</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Client Downloads</span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{totalDownloads.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Tracked distribution touchpoints</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Public Facing</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{publicCount}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Unrestricted website/inquiry downloads</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Partner Exclusive (Gated)</span>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">{partnerCount}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Requires NDA / OEM Portal access</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search assets, CAD files, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Category:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Categories</option>
              <option value="PRODUCT_BROCHURE">Product Brochures</option>
              <option value="TECH_SPEC_SHEET">Technical Spec Sheets</option>
              <option value="CAD_CATALOG">CAD 3D Catalogs</option>
              <option value="CASE_STUDY">Case Studies</option>
              <option value="BRAND_ASSET">Brand Guidelines</option>
              <option value="PROMOTIONAL_VIDEO">Promotional Videos</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>Access:</span>
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Access Levels</option>
              <option value="PUBLIC">Public Only</option>
              <option value="PARTNER">Partner NDA Gated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAssets.map((ast) => (
          <div
            key={ast.id}
            className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-amber-500/40 dark:hover:border-amber-500/30 transition flex flex-col justify-between shadow-sm"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 px-1.5 py-0.5 rounded">
                    {ast.assetCode}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                    {ast.version}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {ast.isPublic ? (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                      <Globe className="h-2.5 w-2.5" /> Public
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" /> Partner Gated
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-2">{ast.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">{ast.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {ast.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* File Details & Download Button */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="font-mono text-[11px]">
                  {(ast.fileSizeBytes / 1024 / 1024).toFixed(1)} MB • {ast.mimeType.split('/')[1]?.toUpperCase()}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold flex items-center gap-1">
                  <Download className="h-3 w-3" /> {ast.downloadCount} hits
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(ast)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-xs font-semibold transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download File
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.origin + ast.fileUrl);
                    setNotification(`Direct asset link copied to clipboard!`);
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                  title="Copy Direct Share URL"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Register Digital Asset */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Register New Marketing Digital Asset
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-Axis CNC Milling Specification Sheet"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Description & Purpose</label>
                <textarea
                  rows={2}
                  placeholder="Summary of engineering specs or brochure content..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Asset Category *</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, type: e.target.value as DigitalAssetType })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="PRODUCT_BROCHURE">Product Brochure</option>
                    <option value="TECH_SPEC_SHEET">Technical Spec Sheet</option>
                    <option value="CAD_CATALOG">CAD Catalog (STEP/IGES)</option>
                    <option value="CASE_STUDY">Case Study</option>
                    <option value="BRAND_ASSET">Brand Identity Asset</option>
                    <option value="PROMOTIONAL_VIDEO">Promotional Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Version</label>
                  <input
                    type="text"
                    value={uploadForm.version}
                    onChange={(e) => setUploadForm({ ...uploadForm, version: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">File Storage URL / Path *</label>
                <input
                  type="text"
                  required
                  placeholder="/assets/specs/sample-file.pdf"
                  value={uploadForm.fileUrl}
                  onChange={(e) => setUploadForm({ ...uploadForm, fileUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Search Tags (Comma-Separated)</label>
                <input
                  type="text"
                  placeholder="CNC, Aerospace, Tolerance, Milling"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800">
                  <input
                    type="checkbox"
                    checked={uploadForm.isPublic}
                    onChange={(e) => setUploadForm({ ...uploadForm, isPublic: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 text-xs">Public Access</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800">
                  <input
                    type="checkbox"
                    checked={uploadForm.partnerAccessAllowed}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, partnerAccessAllowed: e.target.checked })
                    }
                    className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 text-xs">Partner Portal Access</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-md shadow-amber-600/20 transition"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

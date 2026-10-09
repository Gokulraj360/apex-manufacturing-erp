'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Cog,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  FileText,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Wrench,
  AlertOctagon,
  ExternalLink,
} from 'lucide-react';
import {
  MachineAssetItem,
  AssetCategory,
  AssetStatus,
  AssetCriticality,
} from '@/types/asset-reliability';

const INITIAL_ASSETS: MachineAssetItem[] = [
  {
    id: 'ast-1',
    assetTag: 'AST-CNC-001',
    assetName: 'DMG Mori 5-Axis Machining Center DMU 50',
    category: 'CNC_MACHINING',
    serialNumber: 'DMG-2023-88192',
    modelNumber: 'DMU-50-GEN3',
    manufacturer: 'DMG Mori Seiki Co.',
    facilityLocation: 'Bay 3 - Machining Shop',
    powerRatingKw: 25.5,
    operatingVoltage: '415V 3-Phase',
    installationDate: '2023-04-15',
    warrantyExpiryDate: '2027-04-15',
    status: 'BREAKDOWN_STOPPAGE',
    criticality: 'CRITICAL_BOTTLENECK',
    totalOperatingHours: 7420,
    mtbfHours: 410.2,
    mttrHours: 2.1,
    manualDocumentUrl: 'https://docs.dmgmori.internal/manuals/dmu50.pdf',
    specifications: {
      spindleSpeedRpm: 15000,
      toolPocketCapacity: 60,
      coolantSystem: 'Internal Thru-Spindle 40 Bar',
      controller: 'Siemens Sinumerik 840D sl',
    },
    _count: { maintenanceSchedules: 8, breakdownTickets: 2, lifecycleLogs: 14 },
  },
  {
    id: 'ast-2',
    assetTag: 'AST-CNC-002',
    assetName: 'Haas VF-4SS Super-Speed Vertical Machining Center',
    category: 'CNC_MACHINING',
    serialNumber: 'HAA-2022-11093',
    modelNumber: 'VF-4SS',
    manufacturer: 'Haas Automation Inc.',
    facilityLocation: 'Bay 3 - Machining Shop',
    powerRatingKw: 22.4,
    operatingVoltage: '415V 3-Phase',
    installationDate: '2022-09-10',
    warrantyExpiryDate: '2025-09-10',
    status: 'OPERATIONAL',
    criticality: 'HIGH',
    totalOperatingHours: 11250,
    mtbfHours: 520.0,
    mttrHours: 1.4,
    manualDocumentUrl: 'https://docs.haas.internal/manuals/vf4ss.pdf',
    specifications: {
      spindleSpeedRpm: 12000,
      toolPocketCapacity: 30,
      tableSizeMm: '1270 x 457',
    },
    _count: { maintenanceSchedules: 12, breakdownTickets: 1, lifecycleLogs: 22 },
  },
  {
    id: 'ast-3',
    assetTag: 'AST-ROB-001',
    assetName: 'KUKA KR 210 R2700 Prime Articulated Robot',
    category: 'ASSEMBLY_ROBOT',
    serialNumber: 'KUK-2024-44102',
    modelNumber: 'KR-210-PRIME',
    manufacturer: 'KUKA Robotics GmbH',
    facilityLocation: 'Robotic Cell Alpha',
    powerRatingKw: 13.5,
    operatingVoltage: '400V 3-Phase',
    installationDate: '2024-01-20',
    warrantyExpiryDate: '2028-01-20',
    status: 'OPERATIONAL',
    criticality: 'HIGH',
    totalOperatingHours: 4180,
    mtbfHours: 850.5,
    mttrHours: 1.2,
    specifications: {
      payloadKg: 210,
      reachMm: 2700,
      controller: 'KR C4 Extended',
      repeatabilityMm: 0.06,
    },
    _count: { maintenanceSchedules: 6, breakdownTickets: 0, lifecycleLogs: 9 },
  },
  {
    id: 'ast-4',
    assetTag: 'AST-INJ-002',
    assetName: 'Engel Victory 300-Ton Hydraulic Injection Press',
    category: 'INJECTION_MOLDING',
    serialNumber: 'ENG-2021-99201',
    modelNumber: 'VICTORY-300T',
    manufacturer: 'ENGEL Austria GmbH',
    facilityLocation: 'Molding Bay 2',
    powerRatingKw: 45.0,
    operatingVoltage: '415V 3-Phase',
    installationDate: '2021-11-05',
    warrantyExpiryDate: '2024-11-05',
    status: 'DEGRADED',
    criticality: 'HIGH',
    totalOperatingHours: 18450,
    mtbfHours: 290.4,
    mttrHours: 3.2,
    specifications: {
      clampingForceKn: 3000,
      shotVolumeCm3: 850,
      hydraulicOilGrade: 'ISO VG 46',
    },
    _count: { maintenanceSchedules: 14, breakdownTickets: 4, lifecycleLogs: 31 },
  },
  {
    id: 'ast-5',
    assetTag: 'AST-PRS-001',
    assetName: 'Schuler 500-Ton Automated Stamping Line Press',
    category: 'HYDRAULIC_PRESS',
    serialNumber: 'SCH-2020-00412',
    modelNumber: 'SHP-500-AUTO',
    manufacturer: 'Schuler Group',
    facilityLocation: 'Stamping Hall A',
    powerRatingKw: 75.0,
    operatingVoltage: '415V 3-Phase',
    installationDate: '2020-06-18',
    warrantyExpiryDate: '2023-06-18',
    status: 'OPERATIONAL',
    criticality: 'CRITICAL_BOTTLENECK',
    totalOperatingHours: 22800,
    mtbfHours: 310.8,
    mttrHours: 2.8,
    specifications: {
      pressForceTons: 500,
      strokeRateSpmin: 60,
      bolsterAreaMm: '3100 x 1800',
    },
    _count: { maintenanceSchedules: 18, breakdownTickets: 3, lifecycleLogs: 40 },
  },
  {
    id: 'ast-6',
    assetTag: 'AST-UTL-001',
    assetName: 'Atlas Copco GA 75 VSD+ Variable Speed Compressor',
    category: 'UTILITY_COMPRESSOR',
    serialNumber: 'ATC-2023-55921',
    modelNumber: 'GA-75-VSD+',
    manufacturer: 'Atlas Copco Airpower',
    facilityLocation: 'Utility Plant Room',
    powerRatingKw: 75.0,
    operatingVoltage: '415V 3-Phase',
    installationDate: '2023-08-12',
    warrantyExpiryDate: '2028-08-12',
    status: 'OPERATIONAL',
    criticality: 'MEDIUM',
    totalOperatingHours: 9800,
    mtbfHours: 1200.0,
    mttrHours: 1.1,
    specifications: {
      flowRateCfm: 520,
      maxPressureBar: 13,
      coolingType: 'Air Cooled',
    },
    _count: { maintenanceSchedules: 8, breakdownTickets: 0, lifecycleLogs: 15 },
  },
];

export default function MachineAssetRegistryPage() {
  const [assets, setAssets] = useState<MachineAssetItem[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('ALL');

  // Modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedAssetForDetails, setSelectedAssetForDetails] = useState<MachineAssetItem | null>(null);

  // Form state
  const [newTag, setNewTag] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<AssetCategory>('CNC_MACHINING');
  const [newSerial, setNewSerial] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPowerKw, setNewPowerKw] = useState('22.0');
  const [newVoltage, setNewVoltage] = useState('415V 3-Phase');
  const [newInstallDate, setNewInstallDate] = useState('2026-10-07');
  const [newWarrantyExpiry, setNewWarrantyExpiry] = useState('2029-10-07');
  const [newCriticality, setNewCriticality] = useState<AssetCriticality>('HIGH');

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.facilityLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.modelNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesCriticality = criticalityFilter === 'ALL' || a.criticality === criticalityFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesCriticality;
  });

  const handleEnrollAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MachineAssetItem = {
      id: `ast-${Date.now()}`,
      assetTag: newTag,
      assetName: newName,
      category: newCategory,
      serialNumber: newSerial,
      modelNumber: newModel,
      manufacturer: newManufacturer,
      facilityLocation: newLocation,
      powerRatingKw: parseFloat(newPowerKw) || 15.0,
      operatingVoltage: newVoltage,
      installationDate: newInstallDate,
      warrantyExpiryDate: newWarrantyExpiry,
      status: 'OPERATIONAL',
      criticality: newCriticality,
      totalOperatingHours: 0,
      mtbfHours: 600.0,
      mttrHours: 1.5,
      specifications: { enrolledAt: new Date().toISOString() },
      _count: { maintenanceSchedules: 0, breakdownTickets: 0, lifecycleLogs: 1 },
    };

    setAssets([created, ...assets]);
    setIsEnrollModalOpen(false);
    setNewTag('');
    setNewName('');
    setNewSerial('');
    setNewModel('');
    setNewManufacturer('');
    setNewLocation('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/asset-reliability"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Reliability Command Center
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <Cog className="h-6 w-6 text-amber-400" />
            Industrial Machinery Register &amp; Asset Catalog
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Plant floor machinery registry, nameplate technical specifications, active warranty trackers, and shop bay location mapping.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Enroll New Machinery Asset
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Enrolled Assets</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Cog className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{assets.length} Units</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Spread across 5 plant bays</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Operational Availability</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 font-mono">
              {assets.filter((a) => a.status === 'OPERATIONAL').length} / {assets.length}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">1 Breakdown Stoppage, 1 Degraded</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Critical Bottlenecks</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertOctagon className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-400 font-mono">
              {assets.filter((a) => a.criticality === 'CRITICAL_BOTTLENECK').length} Units
            </span>
          </div>
          <div className="mt-2 text-[11px] text-rose-300">Requires 24/7 condition telemetry</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Under OEM Warranty</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              {assets.filter((a) => a.warrantyExpiryDate && new Date(a.warrantyExpiryDate) > new Date()).length} Units
            </span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-300">Free OEM parts &amp; service support</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by asset tag, machine model, manufacturer, or bay..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0b0f19] border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            <option value="CNC_MACHINING">CNC Machining</option>
            <option value="ASSEMBLY_ROBOT">Robotics</option>
            <option value="INJECTION_MOLDING">Injection Molding</option>
            <option value="HYDRAULIC_PRESS">Hydraulic Press</option>
            <option value="UTILITY_COMPRESSOR">Utility &amp; Air</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="DEGRADED">Degraded</option>
            <option value="BREAKDOWN_STOPPAGE">Breakdown Stoppage</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
          </select>

          <select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Criticalities</option>
            <option value="CRITICAL_BOTTLENECK">Critical Bottleneck</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Machinery Assets Table */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cog className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Registered Plant Assets</h2>
            <span className="text-xs text-slate-500 font-mono">({filteredAssets.length} machines)</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            PLC Telemetry Streaming Active
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0f19] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Asset Tag &amp; Machine</th>
                <th className="py-3 px-4">Manufacturer &amp; Model</th>
                <th className="py-3 px-4">Location / Bay</th>
                <th className="py-3 px-4">Criticality</th>
                <th className="py-3 px-4">Operating Hours &amp; MTBF</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Warranty</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white flex items-center gap-1.5">
                      <Cog className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      {asset.assetTag}
                    </div>
                    <div className="font-medium text-slate-300 text-[11px] mt-0.5">{asset.assetName}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200">{asset.manufacturer}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{asset.modelNumber}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-slate-300">
                      <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                      {asset.facilityLocation}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        asset.criticality === 'CRITICAL_BOTTLENECK'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          : asset.criticality === 'HIGH'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {asset.criticality.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono text-white font-medium">{asset.totalOperatingHours.toLocaleString()} hrs</div>
                    <div className="text-[11px] text-emerald-400 font-mono">MTBF: {asset.mtbfHours}h | MTTR: {asset.mttrHours}h</div>
                  </td>

                  <td className="py-3 px-4">
                    {asset.status === 'OPERATIONAL' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" /> Operational
                      </span>
                    )}
                    {asset.status === 'DEGRADED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <AlertTriangle className="h-3 w-3" /> Degraded
                      </span>
                    )}
                    {asset.status === 'BREAKDOWN_STOPPAGE' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit animate-pulse">
                        <AlertOctagon className="h-3 w-3" /> Stoppage
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px]">
                    {asset.warrantyExpiryDate ? (
                      new Date(asset.warrantyExpiryDate) > new Date() ? (
                        <span className="text-emerald-400">Valid to {asset.warrantyExpiryDate}</span>
                      ) : (
                        <span className="text-slate-500">Expired ({asset.warrantyExpiryDate})</span>
                      )
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedAssetForDetails(asset)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                    >
                      Specifications
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Specifications & Manual Drawer Modal */}
      {selectedAssetForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedAssetForDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Cog className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{selectedAssetForDetails.assetName}</h3>
                <p className="text-xs text-amber-400 font-mono">{selectedAssetForDetails.assetTag}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <div>
                  <span className="text-slate-400">Manufacturer:</span>
                  <div className="font-semibold text-white">{selectedAssetForDetails.manufacturer}</div>
                </div>
                <div>
                  <span className="text-slate-400">Serial Number:</span>
                  <div className="font-mono text-white">{selectedAssetForDetails.serialNumber}</div>
                </div>
                <div>
                  <span className="text-slate-400">Power Rating:</span>
                  <div className="font-mono text-white">{selectedAssetForDetails.powerRatingKw} kW ({selectedAssetForDetails.operatingVoltage})</div>
                </div>
                <div>
                  <span className="text-slate-400">Installation Date:</span>
                  <div className="font-mono text-white">{selectedAssetForDetails.installationDate}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-200 mb-2">Technical Specifications:</h4>
                <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1">
                  {selectedAssetForDetails.specifications &&
                    Object.entries(selectedAssetForDetails.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-500">{key}:</span>
                        <span className="text-white">{String(val)}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileText className="h-4 w-4 text-amber-400" />
                  <span>OEM Maintenance &amp; Wiring Diagram Manual</span>
                </div>
                <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1 cursor-pointer hover:underline">
                  View PDF <ExternalLink className="h-3 w-3" />
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedAssetForDetails(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Machine Asset Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsEnrollModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Plus className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Enroll New Machinery Asset</h3>
                <p className="text-xs text-slate-400">Register new equipment to the reliability telemetry catalog</p>
              </div>
            </div>

            <form onSubmit={handleEnrollAsset} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Asset Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AST-CNC-003"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Asset Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AssetCategory)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CNC_MACHINING">CNC Machining</option>
                    <option value="ASSEMBLY_ROBOT">Robotics</option>
                    <option value="INJECTION_MOLDING">Injection Molding</option>
                    <option value="HYDRAULIC_PRESS">Hydraulic Press</option>
                    <option value="CONVEYOR_SYSTEM">Conveyor System</option>
                    <option value="UTILITY_COMPRESSOR">Utility Compressor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Asset Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mazak Integrex Multi-Tasking Machining Center"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yamazaki Mazak"
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Model Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. i-200H S"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MZK-99014"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Plant Location / Bay</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bay 4 - Heavy Machining"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Power Rating (kW)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPowerKw}
                    onChange={(e) => setNewPowerKw(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Voltage</label>
                  <input
                    type="text"
                    value={newVoltage}
                    onChange={(e) => setNewVoltage(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Criticality</label>
                  <select
                    value={newCriticality}
                    onChange={(e) => setNewCriticality(e.target.value as AssetCriticality)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CRITICAL_BOTTLENECK">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
                >
                  Enroll Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

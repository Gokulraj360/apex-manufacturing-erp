'use client';

import React, { useState } from 'react';
import {
  Award,
  Search,
  Plus,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import {
  AMCContractItem,
  WarrantyRecordItem,
  AMCContractType,
  AMCContractStatus,
  WarrantyStatus,
} from '@/types/field-service';

const INITIAL_AMC_CONTRACTS: AMCContractItem[] = [
  {
    id: 'amc-1',
    contractNumber: 'AMC-2026-0041',
    customerName: 'Tata AutoComp Systems Ltd',
    customerContact: 'Rakesh Nair (+91 98210 11223)',
    machineModel: 'Automated Laser Cutting Cell 4kW (ALC-4000)',
    machineSerialNumber: 'ALC-4000-2023-018',
    contractType: 'COMPREHENSIVE',
    status: 'ACTIVE',
    startDate: '2025-11-01',
    endDate: '2026-10-31',
    contractValue: 12500,
    visitsAllowedTotal: 6,
    visitsConsumed: 5,
    termsAndConditions: 'All optical fiber collimators and servo drives covered under warranty replacement.',
  },
  {
    id: 'amc-2',
    contractNumber: 'AMC-2026-0044',
    customerName: 'Bajaj Electricals Ltd',
    customerContact: 'Deepak Joshi (+91 98330 44556)',
    machineModel: 'Hydraulic Sheet Metal Shear 3m (SMS-3000)',
    machineSerialNumber: 'SMS-3000-2022-094',
    contractType: 'NON_COMPREHENSIVE',
    status: 'ACTIVE',
    startDate: '2025-11-15',
    endDate: '2026-11-14',
    contractValue: 6800,
    visitsAllowedTotal: 4,
    visitsConsumed: 4,
    termsAndConditions: 'Labor and preventive maintenance only. Replacement hydraulic valves billed separately.',
  },
  {
    id: 'amc-3',
    contractNumber: 'AMC-2026-0048',
    customerName: 'Bharat Precision Gears',
    customerContact: 'Amit Verma (+91 97110 98234)',
    machineModel: '5-Axis CNC Machining Center (VMC-850)',
    machineSerialNumber: 'VMC850-2023-118',
    contractType: 'COMPREHENSIVE',
    status: 'ACTIVE',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    contractValue: 14800,
    visitsAllowedTotal: 8,
    visitsConsumed: 3,
    termsAndConditions: 'Comprehensive coverage of spindle motor, Fanuc/Siemens CNC controller, and linear guideways.',
  },
  {
    id: 'amc-4',
    contractNumber: 'AMC-2025-0012',
    customerName: 'Godrej Tooling Division',
    customerContact: 'Sunil Rao (+91 98201 33445)',
    machineModel: 'Wire Cut EDM Machine (WCE-400)',
    machineSerialNumber: 'WCE-400-2021-007',
    contractType: 'LABOR_ONLY',
    status: 'PENDING_RENEWAL',
    startDate: '2025-09-01',
    endDate: '2026-08-31',
    contractValue: 4500,
    visitsAllowedTotal: 4,
    visitsConsumed: 4,
    termsAndConditions: 'Routine dielectric fluid filtration and wire guide alignment checks.',
  },
];

const INITIAL_WARRANTIES: WarrantyRecordItem[] = [
  {
    id: 'war-1',
    warrantyCardNumber: 'WAR-OEM-2025-081',
    customerName: 'Kalyani Forgings Ltd',
    machineModel: 'CNC Hydraulic Press 500T (HP-500)',
    machineSerialNumber: 'HP500-2024-042',
    dispatchDate: '2025-03-15',
    installationDate: '2025-03-28',
    warrantyEndDate: '2027-03-27',
    status: 'ACTIVE',
    coverageScope: '24-Month OEM Full Structural, Cylinder Barrel, and Proportional Hydraulic Valve Warranty.',
  },
  {
    id: 'war-2',
    warrantyCardNumber: 'WAR-OEM-2025-094',
    customerName: 'Mahindra Die Castings Pvt',
    machineModel: 'Automatic Die Lubrication Robot (ADL-200)',
    machineSerialNumber: 'ADL200-2025-014',
    dispatchDate: '2025-06-10',
    installationDate: '2025-06-22',
    warrantyEndDate: '2026-06-21',
    status: 'ACTIVE',
    coverageScope: '12-Month Standard Coverage on Servo Motors, Planetary Gearboxes, and Nozzle Manifolds.',
  },
  {
    id: 'war-3',
    warrantyCardNumber: 'WAR-OEM-2024-019',
    customerName: 'Schneider Electric Switchgear',
    machineModel: 'Automated Busbar Bending Machine (BBM-120)',
    machineSerialNumber: 'BBM120-2024-031',
    dispatchDate: '2024-08-01',
    installationDate: '2024-08-14',
    warrantyEndDate: '2025-08-13',
    status: 'EXPIRED',
    coverageScope: 'Standard 12 Months. Expired. Recommended migration to Comprehensive AMC agreement.',
  },
];

export default function AMCAndWarrantyPage() {
  const [activeTab, setActiveTab] = useState<'amc' | 'warranty'>('amc');
  const [amcContracts, setAmcContracts] = useState<AMCContractItem[]>(INITIAL_AMC_CONTRACTS);
  const [warranties, setWarranties] = useState<WarrantyRecordItem[]>(INITIAL_WARRANTIES);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateAMCModalOpen, setIsCreateAMCModalOpen] = useState(false);
  const [isRegisterWarrantyModalOpen, setIsRegisterWarrantyModalOpen] = useState(false);

  // Forms
  const [newAMC, setNewAMC] = useState({
    customerName: '',
    customerContact: '',
    machineModel: '',
    machineSerialNumber: '',
    contractType: 'COMPREHENSIVE' as AMCContractType,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2027-10-07',
    contractValue: 10000,
    visitsAllowedTotal: 6,
    termsAndConditions: '',
  });

  const [newWarranty, setNewWarranty] = useState({
    customerName: '',
    machineModel: '',
    machineSerialNumber: '',
    dispatchDate: new Date().toISOString().split('T')[0],
    installationDate: new Date().toISOString().split('T')[0],
    warrantyEndDate: '2027-10-07',
    coverageScope: '12-Month OEM Standard Machine Warranty on all mechanical & electrical drive assemblies.',
  });

  const handleCreateAMC = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AMCContractItem = {
      id: `amc-${Date.now()}`,
      contractNumber: `AMC-2026-00${Math.floor(50 + Math.random() * 49)}`,
      ...newAMC,
      status: 'ACTIVE',
      visitsConsumed: 0,
      createdAt: new Date().toISOString(),
    };
    setAmcContracts([created, ...amcContracts]);
    setIsCreateAMCModalOpen(false);
    setNewAMC({
      customerName: '',
      customerContact: '',
      machineModel: '',
      machineSerialNumber: '',
      contractType: 'COMPREHENSIVE',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-10-07',
      contractValue: 10000,
      visitsAllowedTotal: 6,
      termsAndConditions: '',
    });
  };

  const handleRegisterWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    const created: WarrantyRecordItem = {
      id: `war-${Date.now()}`,
      warrantyCardNumber: `WAR-OEM-2026-0${Math.floor(100 + Math.random() * 900)}`,
      ...newWarranty,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    setWarranties([created, ...warranties]);
    setIsRegisterWarrantyModalOpen(false);
    setNewWarranty({
      customerName: '',
      machineModel: '',
      machineSerialNumber: '',
      dispatchDate: new Date().toISOString().split('T')[0],
      installationDate: new Date().toISOString().split('T')[0],
      warrantyEndDate: '2027-10-07',
      coverageScope: '12-Month OEM Standard Machine Warranty on all mechanical & electrical drive assemblies.',
    });
  };

  const filteredAMC = amcContracts.filter((c) => {
    return (
      c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.machineModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.machineSerialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredWarranties = warranties.filter((w) => {
    return (
      w.warrantyCardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.machineModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.machineSerialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getAmcStatusBadge = (s: AMCContractStatus) => {
    switch (s) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING_RENEWAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'EXPIRED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'SUSPENDED':
        return 'bg-slate-700/30 text-slate-400 border-slate-700/40';
    }
  };

  const getWarrantyStatusBadge = (s: WarrantyStatus) => {
    switch (s) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'EXTENDED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'EXPIRED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'VOID_MISUSE':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Award className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              AMC Contracts & Machine Warranty Desk
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Lifecycle monitoring for Annual Maintenance Contracts (AMC), preventive visit consumption, and OEM equipment warranties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'amc' ? (
            <button
              onClick={() => setIsCreateAMCModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-500/20 transition-all"
            >
              <Plus className="h-4 w-4" /> Create AMC Contract
            </button>
          ) : (
            <button
              onClick={() => setIsRegisterWarrantyModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-purple-500/20 transition-all"
            >
              <ShieldCheck className="h-4 w-4" /> Register Machine Warranty
            </button>
          )}
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('amc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'amc'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>AMC Contracts ({amcContracts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'warranty'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>OEM Warranties ({warranties.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contract, machine, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Tab Content: AMC Contracts */}
      {activeTab === 'amc' && (
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Contract # & Scope</th>
                  <th className="py-3 px-4">Customer & Contact</th>
                  <th className="py-3 px-4">Covered Machine</th>
                  <th className="py-3 px-4">Term Dates</th>
                  <th className="py-3 px-4">Visits Quota (Consumed / Max)</th>
                  <th className="py-3 px-4">Contract Value</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-normal">
                {filteredAMC.map((c) => {
                  const visitPct = Math.round((c.visitsConsumed / c.visitsAllowedTotal) * 100);
                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{c.contractNumber}</div>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20">
                          {c.contractType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{c.customerName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{c.customerContact}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{c.machineModel}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">SN: {c.machineSerialNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>{c.startDate}</div>
                        <div className="text-[11px] text-slate-500">to {c.endDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-white">{c.visitsConsumed} / {c.visitsAllowedTotal}</span>
                          <span className="text-slate-400">{visitPct}%</span>
                        </div>
                        <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              visitPct >= 100 ? 'bg-rose-500' : visitPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, visitPct)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        ${c.contractValue.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getAmcStatusBadge(
                            c.status,
                          )}`}
                        >
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: OEM Warranties */}
      {activeTab === 'warranty' && (
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Warranty Card #</th>
                  <th className="py-3 px-4">Customer & Plant</th>
                  <th className="py-3 px-4">Machine & Serial</th>
                  <th className="py-3 px-4">Commissioning Date</th>
                  <th className="py-3 px-4">Warranty Expiration</th>
                  <th className="py-3 px-4">OEM Coverage Scope</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-normal">
                {filteredWarranties.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white font-mono">{w.warrantyCardNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{w.customerName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{w.machineModel}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">SN: {w.machineSerialNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{w.installationDate}</div>
                      <div className="text-[10px] text-slate-500">Dispatched: {w.dispatchDate}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      {w.warrantyEndDate}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-300 text-[11px]">
                      {w.coverageScope}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getWarrantyStatusBadge(
                          w.status,
                        )}`}
                      >
                        {w.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create AMC Contract */}
      {isCreateAMCModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                  <Award className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">Create Annual Maintenance Contract (AMC)</h3>
              </div>
              <button
                onClick={() => setIsCreateAMCModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAMC} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newAMC.customerName}
                    onChange={(e) => setNewAMC({ ...newAMC, customerName: e.target.value })}
                    placeholder="e.g. Tata Motors Ltd"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contact Details *</label>
                  <input
                    type="text"
                    required
                    value={newAMC.customerContact}
                    onChange={(e) => setNewAMC({ ...newAMC, customerContact: e.target.value })}
                    placeholder="Name (+91 Phone)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Machine Model *</label>
                  <input
                    type="text"
                    required
                    value={newAMC.machineModel}
                    onChange={(e) => setNewAMC({ ...newAMC, machineModel: e.target.value })}
                    placeholder="e.g. CNC VMC-850"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Machine Serial Number *</label>
                  <input
                    type="text"
                    required
                    value={newAMC.machineSerialNumber}
                    onChange={(e) => setNewAMC({ ...newAMC, machineSerialNumber: e.target.value })}
                    placeholder="SN-2024-XXXX"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Contract Type</label>
                  <select
                    value={newAMC.contractType}
                    onChange={(e) =>
                      setNewAMC({ ...newAMC, contractType: e.target.value as AMCContractType })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="COMPREHENSIVE">Comprehensive (Parts+Labor)</option>
                    <option value="NON_COMPREHENSIVE">Non-Comprehensive</option>
                    <option value="LABOR_ONLY">Labor Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Visits Quota</label>
                  <input
                    type="number"
                    required
                    value={newAMC.visitsAllowedTotal}
                    onChange={(e) =>
                      setNewAMC({ ...newAMC, visitsAllowedTotal: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Value ($)</label>
                  <input
                    type="number"
                    required
                    value={newAMC.contractValue}
                    onChange={(e) =>
                      setNewAMC({ ...newAMC, contractValue: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newAMC.startDate}
                    onChange={(e) => setNewAMC({ ...newAMC, startDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newAMC.endDate}
                    onChange={(e) => setNewAMC({ ...newAMC, endDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Contract Terms & Specific Exclusions</label>
                <textarea
                  rows={2}
                  value={newAMC.termsAndConditions}
                  onChange={(e) => setNewAMC({ ...newAMC, termsAndConditions: e.target.value })}
                  placeholder="e.g. Includes quarterly oil analysis and 24-hr emergency response..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateAMCModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold"
                >
                  Generate Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Machine Warranty */}
      {isRegisterWarrantyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">Register OEM Equipment Warranty</h3>
              </div>
              <button
                onClick={() => setIsRegisterWarrantyModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterWarranty} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Customer / Facility Name *</label>
                <input
                  type="text"
                  required
                  value={newWarranty.customerName}
                  onChange={(e) => setNewWarranty({ ...newWarranty, customerName: e.target.value })}
                  placeholder="e.g. Kalyani Forgings Ltd"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Machine Model *</label>
                  <input
                    type="text"
                    required
                    value={newWarranty.machineModel}
                    onChange={(e) => setNewWarranty({ ...newWarranty, machineModel: e.target.value })}
                    placeholder="CNC Hydraulic Press 500T"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Machine Serial Number *</label>
                  <input
                    type="text"
                    required
                    value={newWarranty.machineSerialNumber}
                    onChange={(e) => setNewWarranty({ ...newWarranty, machineSerialNumber: e.target.value })}
                    placeholder="HP500-2024-042"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Factory Dispatch</label>
                  <input
                    type="date"
                    required
                    value={newWarranty.dispatchDate}
                    onChange={(e) => setNewWarranty({ ...newWarranty, dispatchDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Site Commissioning</label>
                  <input
                    type="date"
                    required
                    value={newWarranty.installationDate}
                    onChange={(e) => setNewWarranty({ ...newWarranty, installationDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Warranty Expiry</label>
                  <input
                    type="date"
                    required
                    value={newWarranty.warrantyEndDate}
                    onChange={(e) => setNewWarranty({ ...newWarranty, warrantyEndDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">OEM Coverage Scope *</label>
                <textarea
                  required
                  rows={2}
                  value={newWarranty.coverageScope}
                  onChange={(e) => setNewWarranty({ ...newWarranty, coverageScope: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterWarrantyModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold"
                >
                  Register Warranty Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  LogOut,
  LogIn,
  AlertTriangle,
  UserCheck,
  Printer,
  ShieldAlert,
  ArrowLeft,
  X,
  FileText,
} from 'lucide-react';
import { VehicleLogItem, VehicleType, GateMovementStatus } from '@/types/logistics-gate';

const INITIAL_VEHICLES: VehicleLogItem[] = [
  {
    id: 'veh-1',
    passNumber: 'GP-IN-2026-0104',
    vehicleNumber: 'MH-12-RN-8821',
    vehicleType: 'HEAVY_TRUCK',
    driverName: 'Vikram Rajput',
    driverPhone: '+91 98230 11223',
    driverLicenseNumber: 'MH12-2015-004921',
    purpose: 'Raw Sheet Metal Delivery for PO-2026-089',
    transporterName: 'Vanguard Freight Logistics',
    entryTimestamp: '2026-10-07 09:15',
    gateNumber: 'North Gate 01',
    visitorPassBadge: 'BADGE-V-401',
    accompanyingPersons: 1,
    status: 'INSIDE_PREMISES',
    securityGuardNotes: 'All safety gear verified. Directed to Inbound Weighbridge.',
    createdAt: '2026-10-07 09:15',
    updatedAt: '2026-10-07 09:15',
  },
  {
    id: 'veh-2',
    passNumber: 'GP-IN-2026-0105',
    vehicleNumber: 'KA-04-AK-5509',
    vehicleType: 'CONTAINER_CARRIER',
    driverName: 'Ramesh Patel',
    driverPhone: '+91 97412 88901',
    driverLicenseNumber: 'KA04-2018-099412',
    purpose: 'Finished Goods Dispatch Loading (DSP-SHP-042)',
    transporterName: 'Express Blue Haulage',
    entryTimestamp: '2026-10-07 10:05',
    gateNumber: 'South Gate 02',
    visitorPassBadge: 'BADGE-V-402',
    accompanyingPersons: 0,
    status: 'INSIDE_PREMISES',
    securityGuardNotes: 'Outbound staging dock 04. Clearance pending seal verification.',
    createdAt: '2026-10-07 10:05',
    updatedAt: '2026-10-07 10:05',
  },
  {
    id: 'veh-3',
    passNumber: 'GP-IN-2026-0106',
    vehicleNumber: 'DL-01-EE-7712',
    vehicleType: 'VISITOR_CAR',
    driverName: 'Dr. Anand Verma',
    driverPhone: '+91 99112 33445',
    purpose: 'ISO 9001 External Quality Audit',
    transporterName: 'Private Vehicle',
    entryTimestamp: '2026-10-07 10:45',
    gateNumber: 'Admin Gate 03',
    visitorPassBadge: 'BADGE-VIP-009',
    accompanyingPersons: 2,
    status: 'INSIDE_PREMISES',
    securityGuardNotes: 'Visitor escorts designated: Plant Manager Office.',
    createdAt: '2026-10-07 10:45',
    updatedAt: '2026-10-07 10:45',
  },
  {
    id: 'veh-4',
    passNumber: 'GP-IN-2026-0098',
    vehicleNumber: 'TN-09-CQ-2234',
    vehicleType: 'MEDIUM_TRUCK',
    driverName: 'K. Selvam',
    driverPhone: '+91 94441 55667',
    driverLicenseNumber: 'TN09-2016-118833',
    purpose: 'Scrap Metal Clearance under SP-2026-019',
    transporterName: 'Universal Scrap Recyclers',
    entryTimestamp: '2026-10-07 08:30',
    exitTimestamp: '2026-10-07 11:20',
    gateNumber: 'North Gate 01',
    visitorPassBadge: 'BADGE-V-399',
    accompanyingPersons: 1,
    status: 'CHECKED_OUT',
    securityGuardNotes: 'Tare and gross verified. Special gate pass signed out.',
    createdAt: '2026-10-07 08:30',
    updatedAt: '2026-10-07 11:20',
  },
  {
    id: 'veh-5',
    passNumber: 'GP-IN-2026-0095',
    vehicleNumber: 'MH-14-BT-1120',
    vehicleType: 'LIGHT_COMMERCIAL',
    driverName: 'Sunil Gokhale',
    driverPhone: '+91 98811 22334',
    purpose: 'Canteen food supply delivery',
    transporterName: 'Fresh Farms Logistics',
    entryTimestamp: '2026-10-07 07:15',
    exitTimestamp: '2026-10-07 08:05',
    gateNumber: 'South Gate 02',
    visitorPassBadge: 'BADGE-V-395',
    accompanyingPersons: 0,
    status: 'CHECKED_OUT',
    createdAt: '2026-10-07 07:15',
    updatedAt: '2026-10-07 08:05',
  },
];

export default function GateEntriesPage() {
  const [vehicles, setVehicles] = useState<VehicleLogItem[]>(INITIAL_VEHICLES);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New entry form state
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'HEAVY_TRUCK' as VehicleType,
    driverName: '',
    driverPhone: '',
    driverLicenseNumber: '',
    purpose: '',
    transporterName: '',
    gateNumber: 'North Gate 01',
    accompanyingPersons: 0,
    securityGuardNotes: '',
  });

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleNumber || !formData.driverName) return;

    const newPass: VehicleLogItem = {
      id: `veh-${Date.now()}`,
      passNumber: `GP-IN-2026-0${107 + vehicles.length}`,
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      vehicleType: formData.vehicleType,
      driverName: formData.driverName,
      driverPhone: formData.driverPhone || '+91 90000 00000',
      driverLicenseNumber: formData.driverLicenseNumber || undefined,
      purpose: formData.purpose || 'Material delivery / factory visit',
      transporterName: formData.transporterName || 'Self Managed',
      entryTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      gateNumber: formData.gateNumber,
      visitorPassBadge: `BADGE-V-${500 + vehicles.length}`,
      accompanyingPersons: Number(formData.accompanyingPersons),
      status: 'INSIDE_PREMISES',
      securityGuardNotes: formData.securityGuardNotes || 'Checked in with standard security checklist.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVehicles([newPass, ...vehicles]);
    setIsModalOpen(false);
    setFormData({
      vehicleNumber: '',
      vehicleType: 'HEAVY_TRUCK',
      driverName: '',
      driverPhone: '',
      driverLicenseNumber: '',
      purpose: '',
      transporterName: '',
      gateNumber: 'North Gate 01',
      accompanyingPersons: 0,
      securityGuardNotes: '',
    });
  };

  const handleCheckOut = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'CHECKED_OUT' as GateMovementStatus,
              exitTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : v,
      ),
    );
  };

  const handleHold = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: v.status === 'SECURITY_HOLD' ? 'INSIDE_PREMISES' : ('SECURITY_HOLD' as GateMovementStatus),
            }
          : v,
      ),
    );
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.passNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/logistics-gate" className="hover:text-cyan-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Logistics
            </Link>
            <span>/</span>
            <span className="text-slate-200">Gate Passes & Entries</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-cyan-400" />
            Live Gate Entry & Visitor Log
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Timestamped vehicle tracking, driver authorization badges, perimeter security access control.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          Register Gate Check-In
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1322] border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search plate, driver, pass #, badge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {['ALL', 'INSIDE_PREMISES', 'CHECKED_OUT', 'SECURITY_HOLD'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Live Perimeter Scanner Active</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-3 font-semibold">Pass / Badge</th>
                <th className="py-3 px-3 font-semibold">Vehicle & Class</th>
                <th className="py-3 px-3 font-semibold">Driver & Verification</th>
                <th className="py-3 px-3 font-semibold">Purpose & Transporter</th>
                <th className="py-3 px-3 font-semibold">Gate & Accompanying</th>
                <th className="py-3 px-3 font-semibold">Timestamps</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 font-mono">
                    <div className="text-cyan-300 font-bold">{v.passNumber}</div>
                    {v.visitorPassBadge && (
                      <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                        {v.visitorPassBadge}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white tracking-wide">{v.vehicleNumber}</div>
                    <div className="text-[10px] text-slate-400">{v.vehicleType.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-white font-medium">{v.driverName}</div>
                    <div className="text-[10px] text-slate-400">{v.driverPhone}</div>
                    {v.driverLicenseNumber && (
                      <div className="text-[9px] font-mono text-slate-500">DL: {v.driverLicenseNumber}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 max-w-[200px]">
                    <div className="text-slate-200 truncate" title={v.purpose}>
                      {v.purpose}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{v.transporterName || 'Self / Company'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-300 font-medium">{v.gateNumber}</div>
                    <div className="text-[10px] text-slate-500">+{v.accompanyingPersons} occupants</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <div className="text-emerald-400 flex items-center gap-1">
                      <LogIn className="h-3 w-3" />
                      {v.entryTimestamp}
                    </div>
                    {v.exitTimestamp && (
                      <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                        <LogOut className="h-3 w-3" />
                        {v.exitTimestamp}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        v.status === 'INSIDE_PREMISES'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : v.status === 'CHECKED_OUT'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {v.status === 'INSIDE_PREMISES' && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />}
                      {v.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {v.status === 'INSIDE_PREMISES' && (
                        <>
                          <button
                            onClick={() => handleCheckOut(v.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium flex items-center gap-1"
                            title="Stamp Outbound Departure"
                          >
                            <LogOut className="h-3 w-3" />
                            Check Out
                          </button>
                          <button
                            onClick={() => handleHold(v.id)}
                            className="p-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-[11px]"
                            title="Security Hold Flag"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      {v.status === 'SECURITY_HOLD' && (
                        <button
                          onClick={() => handleHold(v.id)}
                          className="px-2 py-1 rounded bg-amber-600/20 text-amber-300 border border-amber-500/30 text-[11px]"
                        >
                          Release Hold
                        </button>
                      )}
                      {v.status === 'CHECKED_OUT' && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-slate-500" />
                          Cleared
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check-In Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">Register Gate Entry & Issue Visitor Pass</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCheckIn} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vehicle Number / Plate *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-12-AB-1234"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle Classification</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as VehicleType })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="HEAVY_TRUCK">Heavy Truck</option>
                    <option value="MEDIUM_TRUCK">Medium Truck</option>
                    <option value="LIGHT_COMMERCIAL">Light Commercial (LCV)</option>
                    <option value="CONTAINER_CARRIER">Container Carrier</option>
                    <option value="VISITOR_CAR">Visitor / Executive Car</option>
                    <option value="EMPLOYEE_VEHICLE">Employee Vehicle</option>
                    <option value="SERVICE_VEHICLE">Service / Utility Vehicle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Driver / Visitor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Driver License / ID #</label>
                  <input
                    type="text"
                    placeholder="Govt issued DL or Aadhaar"
                    value={formData.driverLicenseNumber}
                    onChange={(e) => setFormData({ ...formData, driverLicenseNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Transporter / Agency</label>
                  <input
                    type="text"
                    placeholder="Logistics company name"
                    value={formData.transporterName}
                    onChange={(e) => setFormData({ ...formData, transporterName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Purpose of Visit / Delivery</label>
                <input
                  type="text"
                  placeholder="e.g. Raw material delivery for PO-2026-089"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Entry Gate</label>
                  <select
                    value={formData.gateNumber}
                    onChange={(e) => setFormData({ ...formData, gateNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="North Gate 01">North Gate 01 (Commercial Freight)</option>
                    <option value="South Gate 02">South Gate 02 (Dispatch Dock)</option>
                    <option value="Admin Gate 03">Admin Gate 03 (Visitors & Staff)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Accompanying Helpers</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.accompanyingPersons}
                    onChange={(e) => setFormData({ ...formData, accompanyingPersons: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Security Guard Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Inspection observations, helmet/vest compliance..."
                  value={formData.securityGuardNotes}
                  onChange={(e) => setFormData({ ...formData, securityGuardNotes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-md shadow-cyan-600/30"
                >
                  Generate Pass & Print Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

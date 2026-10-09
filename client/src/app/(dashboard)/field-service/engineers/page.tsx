'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  Clock,
  Zap,
  Navigation,
  FileText,
  X,
  Compass,
  AlertCircle,
  Truck,
  Wrench,
  Activity,
  Layers,
} from 'lucide-react';
import {
  FieldEngineerItem,
  EngineerStatus,
  ServiceLogType,
} from '@/types/field-service';

const INITIAL_ENGINEERS: FieldEngineerItem[] = [
  {
    id: 'eng-1',
    employeeCode: 'FSE-101',
    fullName: 'Vikram Jadhav',
    phone: '+91 98230 45671',
    email: 'vikram.j@apex-field.com',
    operatingTerritoryCity: 'Pune Industrial Belt',
    technicalSpecializations: ['Hydraulic Press', 'High-Tonnage Valves', 'Rexroth Drives'],
    currentStatus: 'IN_TRANSIT',
    currentLatitude: 18.6279,
    currentLongitude: 73.8131,
    lastLocationUpdate: '10 mins ago (Bhosari MIDC)',
    totalCompletedJobs: 184,
    avgResolutionHours: 3.2,
    ftfrRate: 95.1,
    customerRatingAvg: 4.9,
    isActive: true,
  },
  {
    id: 'eng-2',
    employeeCode: 'FSE-104',
    fullName: 'Rohit Sharma',
    phone: '+91 98112 34567',
    email: 'rohit.s@apex-field.com',
    operatingTerritoryCity: 'Delhi NCR & Manesar',
    technicalSpecializations: ['5-Axis VMC', 'Siemens 840D', 'Spindle Servo Boards'],
    currentStatus: 'ON_SITE',
    currentLatitude: 28.3615,
    currentLongitude: 76.9248,
    lastLocationUpdate: '5 mins ago (Manesar Sector 8)',
    totalCompletedJobs: 142,
    avgResolutionHours: 3.6,
    ftfrRate: 93.8,
    customerRatingAvg: 4.7,
    isActive: true,
  },
  {
    id: 'eng-3',
    employeeCode: 'FSE-108',
    fullName: 'Kiran Deshmukh',
    phone: '+91 99750 33441',
    email: 'kiran.d@apex-field.com',
    operatingTerritoryCity: 'Aurangabad & Jalna',
    technicalSpecializations: ['Robotic Arms', 'Servo Articulation', 'Pneumatics'],
    currentStatus: 'AVAILABLE',
    currentLatitude: 19.8762,
    currentLongitude: 75.3433,
    lastLocationUpdate: 'Just now (Waluj Service Center)',
    totalCompletedJobs: 98,
    avgResolutionHours: 2.9,
    ftfrRate: 96.0,
    customerRatingAvg: 4.9,
    isActive: true,
  },
  {
    id: 'eng-4',
    employeeCode: 'FSE-112',
    fullName: 'Ananya Verma',
    phone: '+91 99880 77665',
    email: 'ananya.v@apex-field.com',
    operatingTerritoryCity: 'Bengaluru Tech Corridor',
    technicalSpecializations: ['Optical Sorting', 'Vision Cognex', 'SMT Pick-Place'],
    currentStatus: 'AVAILABLE',
    currentLatitude: 12.8452,
    currentLongitude: 77.6602,
    lastLocationUpdate: '25 mins ago (Electronic City)',
    totalCompletedJobs: 119,
    avgResolutionHours: 2.7,
    ftfrRate: 97.2,
    customerRatingAvg: 5.0,
    isActive: true,
  },
  {
    id: 'eng-5',
    employeeCode: 'FSE-115',
    fullName: 'Suresh Pillai',
    phone: '+91 94470 12890',
    email: 'suresh.p@apex-field.com',
    operatingTerritoryCity: 'Chennai Automotive Corridor',
    technicalSpecializations: ['Induction Heating', 'Heavy Gearboxes', 'Vibration Analysis'],
    currentStatus: 'ON_SITE',
    currentLatitude: 13.0827,
    currentLongitude: 80.2707,
    lastLocationUpdate: '15 mins ago (Sriperumbudur)',
    totalCompletedJobs: 167,
    avgResolutionHours: 3.8,
    ftfrRate: 92.5,
    customerRatingAvg: 4.6,
    isActive: true,
  },
  {
    id: 'eng-6',
    employeeCode: 'FSE-119',
    fullName: 'Manish Rawat',
    phone: '+91 98970 88991',
    email: 'manish.r@apex-field.com',
    operatingTerritoryCity: 'Ahmedabad & Sanand',
    technicalSpecializations: ['Plastic Injection Molding', 'Extrusion Barrels', 'Hot Runner Heaters'],
    currentStatus: 'OFF_DUTY',
    currentLatitude: 22.9868,
    currentLongitude: 72.3812,
    lastLocationUpdate: '2 hrs ago (Sanand Hub)',
    totalCompletedJobs: 82,
    avgResolutionHours: 3.4,
    ftfrRate: 94.0,
    customerRatingAvg: 4.8,
    isActive: true,
  },
];

export default function FieldEngineersPage() {
  const [engineers, setEngineers] = useState<FieldEngineerItem[]>(INITIAL_ENGINEERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [territoryFilter, setTerritoryFilter] = useState<string>('ALL');

  // Modal states
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<FieldEngineerItem | null>(null);

  // Form: Enroll Engineer
  const [enrollForm, setEnrollForm] = useState({
    fullName: '',
    employeeCode: '',
    phone: '',
    email: '',
    operatingTerritoryCity: 'Pune Industrial Belt',
    specializations: '',
  });

  // Form: On-Site Diagnostic Log
  const [serviceLogForm, setServiceLogForm] = useState({
    ticketNumber: 'SR-2026-0891',
    logType: 'DIAGNOSTIC_NOTE' as ServiceLogType,
    coordinates: '18.6279 N, 73.8131 E',
    notes: '',
    partsReplacedSku: '',
    partsReplacedQty: 1,
  });

  const filteredEngineers = engineers.filter((eng) => {
    const matchesSearch =
      eng.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eng.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eng.operatingTerritoryCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eng.technicalSpecializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || eng.currentStatus === statusFilter;
    const matchesTerritory = territoryFilter === 'ALL' || eng.operatingTerritoryCity.includes(territoryFilter);
    return matchesSearch && matchesStatus && matchesTerritory;
  });

  const handleEnrollEngineer = (e: React.FormEvent) => {
    e.preventDefault();
    const specs = enrollForm.specializations
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newEng: FieldEngineerItem = {
      id: `eng-${Date.now()}`,
      employeeCode: enrollForm.employeeCode.toUpperCase(),
      fullName: enrollForm.fullName,
      phone: enrollForm.phone,
      email: enrollForm.email,
      operatingTerritoryCity: enrollForm.operatingTerritoryCity,
      technicalSpecializations: specs.length > 0 ? specs : ['General Diagnostics'],
      currentStatus: 'AVAILABLE',
      totalCompletedJobs: 0,
      avgResolutionHours: 0,
      ftfrRate: 100,
      customerRatingAvg: 5.0,
      isActive: true,
      lastLocationUpdate: 'Just now',
    };

    setEngineers([newEng, ...engineers]);
    setIsEnrollModalOpen(false);
    setEnrollForm({
      fullName: '',
      employeeCode: '',
      phone: '',
      email: '',
      operatingTerritoryCity: 'Pune Industrial Belt',
      specializations: '',
    });
  };

  const handleCreateServiceLog = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate log creation
    alert(`Service Log [${serviceLogForm.logType}] recorded for ${selectedEngineer?.fullName}!`);
    setIsLogModalOpen(false);
    setSelectedEngineer(null);
  };

  const getStatusBadge = (s: EngineerStatus) => {
    switch (s) {
      case 'AVAILABLE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ON_SITE':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'IN_TRANSIT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ON_LEAVE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'OFF_DUTY':
        return 'bg-slate-700/30 text-slate-400 border-slate-700/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Users className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Field Engineer Dispatch & Mobile Fleet Management
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time technician presence tracking, GPS corridor dispatching, specialization matching, and visit telemetry logging.
          </p>
        </div>

        <button
          onClick={() => setIsEnrollModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Enroll Field Engineer
        </button>
      </div>

      {/* Corridor Telemetry Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">Total Technicians</div>
            <div className="text-xl font-bold text-white mt-0.5">{engineers.length} Engineers</div>
          </div>
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
            <Users className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">Available for Dispatch</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {engineers.filter((e) => e.currentStatus === 'AVAILABLE').length} Standby
            </div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">Active On Site</div>
            <div className="text-xl font-bold text-purple-400 mt-0.5">
              {engineers.filter((e) => e.currentStatus === 'ON_SITE').length} Technicians
            </div>
          </div>
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Wrench className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">En Route / In Transit</div>
            <div className="text-xl font-bold text-blue-400 mt-0.5">
              {engineers.filter((e) => e.currentStatus === 'IN_TRANSIT').length} Vans
            </div>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Truck className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search technician name, code, skill, territory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-orange-500 text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_SITE">On Site</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>

          <select
            value={territoryFilter}
            onChange={(e) => setTerritoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-orange-500 text-xs"
          >
            <option value="ALL">All Territories</option>
            <option value="Pune">Pune Corridor</option>
            <option value="Delhi">Delhi NCR</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Chennai">Chennai</option>
            <option value="Aurangabad">Aurangabad</option>
            <option value="Ahmedabad">Ahmedabad</option>
          </select>
        </div>
      </div>

      {/* Engineer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEngineers.map((eng) => (
          <div
            key={eng.id}
            className="p-5 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header with Avatar & Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-orange-500/20">
                    {eng.fullName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">{eng.fullName}</h3>
                    <div className="text-[11px] font-mono text-orange-400 font-medium">
                      {eng.employeeCode}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                    eng.currentStatus,
                  )}`}
                >
                  {eng.currentStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Territory & Contact */}
              <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                  <span>{eng.operatingTerritoryCity}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>{eng.phone}</span>
                </div>
                {eng.lastLocationUpdate && (
                  <div className="flex items-center gap-2 text-[11px] text-blue-400">
                    <Navigation className="h-3 w-3 shrink-0" />
                    <span>GPS Telemetry: {eng.lastLocationUpdate}</span>
                  </div>
                )}
              </div>

              {/* Specializations Tags */}
              <div className="mt-3.5">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Core Skills & Equipment Mastery
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {eng.technicalSpecializations.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/60"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics Bar & Actions */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Jobs Done</div>
                  <div className="font-bold text-white mt-0.5">{eng.totalCompletedJobs}</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">FTFR</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{eng.ftfrRate}%</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">CSAT</div>
                  <div className="font-bold text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{eng.customerRatingAvg}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedEngineer(eng);
                    setIsLogModalOpen(true);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" /> Log On-Site Event
                </button>
                <a
                  href={`tel:${eng.phone}`}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  title="Call Technician"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Enroll Field Engineer */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                  <Users className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">Enroll New Field Engineer</h3>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollEngineer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.fullName}
                    onChange={(e) => setEnrollForm({ ...enrollForm, fullName: e.target.value })}
                    placeholder="e.g. Rahul Patil"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Employee Code *</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.employeeCode}
                    onChange={(e) => setEnrollForm({ ...enrollForm, employeeCode: e.target.value })}
                    placeholder="FSE-120"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.phone}
                    onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                    placeholder="+91 98230 00000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    placeholder="rahul.p@apex-field.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Operating Territory / Base City *</label>
                <input
                  type="text"
                  required
                  value={enrollForm.operatingTerritoryCity}
                  onChange={(e) => setEnrollForm({ ...enrollForm, operatingTerritoryCity: e.target.value })}
                  placeholder="e.g. Pune Industrial Belt"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Technical Specializations (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={enrollForm.specializations}
                  onChange={(e) => setEnrollForm({ ...enrollForm, specializations: e.target.value })}
                  placeholder="e.g. Hydraulics, PLC Siemens, Servo Drives"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold"
                >
                  Enroll Engineer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log On-Site Event */}
      {isLogModalOpen && selectedEngineer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                  <FileText className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">Log Field Event / Visit Telemetry</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-white">
                {selectedEngineer.fullName} ({selectedEngineer.employeeCode})
              </div>
              <div className="text-slate-400">{selectedEngineer.operatingTerritoryCity}</div>
            </div>

            <form onSubmit={handleCreateServiceLog} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Ticket Number *</label>
                  <input
                    type="text"
                    required
                    value={serviceLogForm.ticketNumber}
                    onChange={(e) => setServiceLogForm({ ...serviceLogForm, ticketNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Event Type *</label>
                  <select
                    value={serviceLogForm.logType}
                    onChange={(e) =>
                      setServiceLogForm({ ...serviceLogForm, logType: e.target.value as ServiceLogType })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="ARRIVAL_CHECKIN">Arrival Check-in</option>
                    <option value="DIAGNOSTIC_NOTE">Diagnostic Findings</option>
                    <option value="PARTS_REPLACED">Parts Replaced</option>
                    <option value="TESTING_COMPLETED">Testing & Dry Run</option>
                    <option value="CUSTOMER_SIGNOFF">Customer Sign-off</option>
                    <option value="DEPARTURE_CHECKOUT">Departure Check-out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">GPS Coordinates</label>
                <input
                  type="text"
                  value={serviceLogForm.coordinates}
                  onChange={(e) => setServiceLogForm({ ...serviceLogForm, coordinates: e.target.value })}
                  placeholder="18.6279 N, 73.8131 E"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Technical Notes & Observations *</label>
                <textarea
                  required
                  rows={3}
                  value={serviceLogForm.notes}
                  onChange={(e) => setServiceLogForm({ ...serviceLogForm, notes: e.target.value })}
                  placeholder="Observed hydraulic pressure oscillation in proportional valve..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
                >
                  Submit Telemetry Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

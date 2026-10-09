'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  ClipboardCheck,
  Users,
  Award,
  Truck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Plus,
  RefreshCw,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  FileText,
  Boxes,
  Zap,
} from 'lucide-react';
import {
  FieldServiceOverviewMetrics,
  ServiceRequestItem,
  FieldEngineerItem,
  AMCContractItem,
} from '@/types/field-service';

const MOCK_METRICS: FieldServiceOverviewMetrics = {
  totalTicketsCount: 142,
  openTicketsCount: 18,
  criticalDownCount: 3,
  activeEngineersCount: 14,
  activeAMCContractsCount: 68,
  activeWarrantiesCount: 112,
  pendingPartsRequisitionCount: 5,
  firstTimeFixRate: 94.2,
  averageResolutionHours: 3.4,
  customerSatisfactionRating: 4.8,
  totalServiceCost: 48920,
  vanStockReplenishmentHealth: 98.5,
};

const MOCK_CRITICAL_TICKETS: ServiceRequestItem[] = [
  {
    id: 'req-1',
    ticketNumber: 'SR-2026-0891',
    customerName: 'Kalyani Forgings Ltd',
    customerPhone: '+91 98450 12389',
    customerEmail: 'maintenance@kalyaniforgings.com',
    serviceLocation: 'Shop Floor 2, MIDC Bhosari, Pune',
    city: 'Pune',
    requestType: 'BREAKDOWN_REPAIR',
    priority: 'CRITICAL_DOWN',
    status: 'IN_TRANSIT',
    machineModel: 'CNC Hydraulic Press 500T (HP-500)',
    machineSerialNumber: 'HP500-2024-042',
    reportedFault: 'Main ram seal ruptured causing high pressure hydraulic fluid blowout. Line 1 completely stalled.',
    scheduledDate: '2026-10-07',
    firstTimeFix: false,
    totalServiceCost: 1450,
    assignedEngineerId: 'eng-1',
    assignedEngineer: {
      id: 'eng-1',
      employeeCode: 'FSE-101',
      fullName: 'Vikram Jadhav',
      phone: '+91 98230 45671',
      email: 'vikram.j@apex-field.com',
      operatingTerritoryCity: 'Pune',
      technicalSpecializations: ['Hydraulics', 'High-Tonnage Presses', 'PLC Diagnosing'],
      currentStatus: 'IN_TRANSIT',
      totalCompletedJobs: 184,
      avgResolutionHours: 3.2,
      ftfrRate: 95.1,
      customerRatingAvg: 4.9,
      isActive: true,
    },
    createdAt: '2026-10-07T08:15:00Z',
  },
  {
    id: 'req-2',
    ticketNumber: 'SR-2026-0892',
    customerName: 'Bharat Precision Gears',
    customerPhone: '+91 97110 98234',
    customerEmail: 'plant.ops@bharatprecision.in',
    serviceLocation: 'Sector 8 Industrial Area, Manesar',
    city: 'Gurugram',
    requestType: 'BREAKDOWN_REPAIR',
    priority: 'CRITICAL_DOWN',
    status: 'ON_SITE_DIAGNOSIS',
    machineModel: '5-Axis CNC Machining Center (VMC-850)',
    machineSerialNumber: 'VMC850-2023-118',
    reportedFault: 'Spindle encoder communication loss fault Code #E-409. Spindle will not engage in auto cycle.',
    scheduledDate: '2026-10-07',
    firstTimeFix: false,
    totalServiceCost: 890,
    assignedEngineerId: 'eng-2',
    assignedEngineer: {
      id: 'eng-2',
      employeeCode: 'FSE-104',
      fullName: 'Rohit Sharma',
      phone: '+91 98112 34567',
      email: 'rohit.s@apex-field.com',
      operatingTerritoryCity: 'Delhi NCR',
      technicalSpecializations: ['CNC Control Boards', 'Siemens 840D', 'Spindle Servo Drives'],
      currentStatus: 'ON_SITE',
      totalCompletedJobs: 142,
      avgResolutionHours: 3.6,
      ftfrRate: 93.8,
      customerRatingAvg: 4.7,
      isActive: true,
    },
    createdAt: '2026-10-07T09:30:00Z',
  },
  {
    id: 'req-3',
    ticketNumber: 'SR-2026-0893',
    customerName: 'Mahindra Die Castings Pvt',
    customerPhone: '+91 94220 89123',
    customerEmail: 'toolroom@mahindradie.com',
    serviceLocation: 'Plot 44, Waluj Industrial Area, Chhatrapati Sambhajinagar',
    city: 'Aurangabad',
    requestType: 'BREAKDOWN_REPAIR',
    priority: 'CRITICAL_DOWN',
    status: 'ASSIGNED',
    machineModel: 'Automatic Die Lubrication Robot (ADL-200)',
    machineSerialNumber: 'ADL200-2025-014',
    reportedFault: 'Robot arm Axis 3 servo drive overcurrent error. Die spraying halted, causing casting rejects.',
    scheduledDate: '2026-10-07',
    firstTimeFix: false,
    totalServiceCost: 650,
    assignedEngineerId: 'eng-3',
    assignedEngineer: {
      id: 'eng-3',
      employeeCode: 'FSE-108',
      fullName: 'Kiran Deshmukh',
      phone: '+91 99750 33441',
      email: 'kiran.d@apex-field.com',
      operatingTerritoryCity: 'Aurangabad',
      technicalSpecializations: ['Robotic Articulation', 'Servo Drives', 'Pneumatics'],
      currentStatus: 'AVAILABLE',
      totalCompletedJobs: 98,
      avgResolutionHours: 2.9,
      ftfrRate: 96.0,
      customerRatingAvg: 4.9,
      isActive: true,
    },
    createdAt: '2026-10-07T10:45:00Z',
  },
];

const MOCK_FIELD_ENGINEERS: FieldEngineerItem[] = [
  {
    id: 'eng-1',
    employeeCode: 'FSE-101',
    fullName: 'Vikram Jadhav',
    phone: '+91 98230 45671',
    email: 'vikram.j@apex-field.com',
    operatingTerritoryCity: 'Pune',
    technicalSpecializations: ['Hydraulics', 'High-Tonnage Presses', 'PLC Diagnosing'],
    currentStatus: 'IN_TRANSIT',
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
    operatingTerritoryCity: 'Delhi NCR',
    technicalSpecializations: ['CNC Controls', 'Siemens 840D', 'Spindle Servo Drives'],
    currentStatus: 'ON_SITE',
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
    operatingTerritoryCity: 'Aurangabad',
    technicalSpecializations: ['Robotic Articulation', 'Servo Drives', 'Pneumatics'],
    currentStatus: 'AVAILABLE',
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
    operatingTerritoryCity: 'Bengaluru',
    technicalSpecializations: ['Optical Sorting', 'Vision Systems', 'IoT Gateway Calibration'],
    currentStatus: 'AVAILABLE',
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
    operatingTerritoryCity: 'Chennai',
    technicalSpecializations: ['Induction Heating', 'Heavy Gearboxes', 'Vibration Analysis'],
    currentStatus: 'ON_SITE',
    totalCompletedJobs: 167,
    avgResolutionHours: 3.8,
    ftfrRate: 92.5,
    customerRatingAvg: 4.6,
    isActive: true,
  },
];

const MOCK_EXPIRING_AMC: AMCContractItem[] = [
  {
    id: 'amc-1',
    contractNumber: 'AMC-2025-0041',
    customerName: 'Tata AutoComp Systems',
    customerContact: 'Rakesh Nair (+91 98210 11223)',
    machineModel: 'Automated Laser Cutting Cell 4kW',
    machineSerialNumber: 'ALC-4000-2023',
    contractType: 'COMPREHENSIVE',
    status: 'ACTIVE',
    startDate: '2025-11-01',
    endDate: '2026-10-31',
    contractValue: 12500,
    visitsAllowedTotal: 6,
    visitsConsumed: 5,
  },
  {
    id: 'amc-2',
    contractNumber: 'AMC-2025-0044',
    customerName: 'Bajaj Electricals Ltd',
    customerContact: 'Deepak Joshi (+91 98330 44556)',
    machineModel: 'Hydraulic Sheet Metal Shear 3m',
    machineSerialNumber: 'SMS-3000-2022',
    contractType: 'NON_COMPREHENSIVE',
    status: 'ACTIVE',
    startDate: '2025-11-15',
    endDate: '2026-11-14',
    contractValue: 6800,
    visitsAllowedTotal: 4,
    visitsConsumed: 4,
  },
];

export default function FieldServiceHubPage() {
  const [metrics] = useState<FieldServiceOverviewMetrics>(MOCK_METRICS);
  const [criticalTickets] = useState<ServiceRequestItem[]>(MOCK_CRITICAL_TICKETS);
  const [engineers] = useState<FieldEngineerItem[]>(MOCK_FIELD_ENGINEERS);
  const [expiringAMC] = useState<AMCContractItem[]>(MOCK_EXPIRING_AMC);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ON_SITE_DIAGNOSIS':
      case 'ON_SITE':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'AVAILABLE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ASSIGNED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'RESOLVED':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-700/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Wrench className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Field Service Operations & Dispatch Center
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time technician fleet dispatching, rapid breakdown ticket resolution, AMC lifecycle management, and mobile van stock tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/field-service/requests"
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Log Service Request
          </Link>
          <Link
            href="/field-service/engineers"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            <Users className="h-4 w-4 text-orange-400" /> Dispatch Board
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg transition-all"
            title="Refresh Field Telemetry"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Tickets</span>
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
              <ClipboardCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{metrics.openTicketsCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-orange-400 font-semibold">{metrics.criticalDownCount} Critical</span>
            <span>/ {metrics.totalTicketsCount} Total</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">FTFR (First-Time Fix)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">{metrics.firstTimeFixRate}%</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-medium">Target: &gt;90%</span>
            <span>World-Class</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Avg Resolution Time</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{metrics.averageResolutionHours} hrs</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-medium">-24 mins</span>
            <span>vs Last Month</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Customer CSAT</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">{metrics.customerSatisfactionRating} / 5.0</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-amber-400 font-medium">96% Positive</span>
            <span>Feedback</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active AMC / Warranties</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{metrics.activeAMCContractsCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-purple-400 font-semibold">{metrics.activeWarrantiesCount}</span>
            <span>OEM Warranties</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 relative overflow-hidden group hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Van Stock Health</span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-teal-400 tracking-tight">{metrics.vanStockReplenishmentHealth}%</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-amber-400 font-semibold">{metrics.pendingPartsRequisitionCount}</span>
            <span>Spares Requisitions</span>
          </div>
        </div>
      </div>

      {/* Critical Machine Breakdowns Live Board */}
      <div className="rounded-xl bg-[#0d1322] border border-rose-900/40 shadow-sm overflow-hidden">
        <div className="p-4 bg-rose-950/20 border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-rose-200">
                Critical Line-Down Emergencies Requiring Urgent Attention
              </h2>
              <p className="text-[11px] text-rose-300/70">
                Prioritized field complaints with high manufacturing impact. Target SLA response: &lt; 2 Hours.
              </p>
            </div>
          </div>
          <Link
            href="/field-service/requests"
            className="flex items-center gap-1 text-xs text-rose-300 hover:text-white font-medium transition-colors"
          >
            <span>View All Tickets ({metrics.openTicketsCount})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket & Priority</th>
                <th className="py-3 px-4">Client & Facility</th>
                <th className="py-3 px-4">Machine & Fault Description</th>
                <th className="py-3 px-4">Assigned Engineer</th>
                <th className="py-3 px-4">Status & Telemetry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-normal">
              {criticalTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{t.ticketNumber}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                      LINE STOPPING
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-200">{t.customerName}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="h-3 w-3 text-orange-400" />
                      <span>{t.city} - {t.serviceLocation}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-medium text-slate-200 truncate">{t.machineModel}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{t.reportedFault}</div>
                  </td>
                  <td className="py-3 px-4">
                    {t.assignedEngineer ? (
                      <div>
                        <div className="font-semibold text-slate-200">{t.assignedEngineer.fullName}</div>
                        <div className="text-[11px] text-slate-400">{t.assignedEngineer.employeeCode} ({t.assignedEngineer.operatingTerritoryCity})</div>
                      </div>
                    ) : (
                      <span className="text-amber-400 font-medium italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border ${getStatusBadge(
                        t.status,
                      )}`}
                    >
                      <Clock className="h-3 w-3" />
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/field-service/requests?ticket=${t.ticketNumber}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 text-[11px] font-medium transition-all"
                    >
                      Manage
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Field Engineers Roster & AMC Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Field Engineers Live Roster */}
        <div className="lg:col-span-2 rounded-xl bg-[#0d1322] border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">Technician Fleet Readiness & GPS Dispatch</h3>
                <p className="text-[11px] text-slate-400">Live operational status across manufacturing corridors</p>
              </div>
            </div>
            <Link
              href="/field-service/engineers"
              className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1"
            >
              Dispatch Console <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {engineers.map((eng) => (
              <div
                key={eng.id}
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-orange-600 to-amber-600 flex items-center justify-center font-bold text-[10px] text-white">
                        {eng.fullName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white leading-none">{eng.fullName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{eng.employeeCode} • {eng.operatingTerritoryCity}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(
                        eng.currentStatus,
                      )}`}
                    >
                      {eng.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 my-2">
                    {eng.technicalSpecializations.map((spec, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{eng.customerRatingAvg}</span>
                    <span className="text-slate-500">({eng.totalCompletedJobs} jobs)</span>
                  </div>
                  <div className="text-emerald-400 font-semibold">{eng.ftfrRate}% FTFR</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AMC Expiration & Quick Operations */}
        <div className="space-y-4">
          {/* AMC Contracts Approaching Quota or Expiration */}
          <div className="rounded-xl bg-[#0d1322] border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Award className="h-4 w-4" />
                </span>
                <h3 className="text-xs font-semibold text-white">AMC Visit Quota Watchlist</h3>
              </div>
              <Link href="/field-service/amc" className="text-[11px] text-purple-400 hover:text-purple-300">
                All AMCs
              </Link>
            </div>

            <div className="space-y-2.5">
              {expiringAMC.map((amc) => (
                <div
                  key={amc.id}
                  className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{amc.contractNumber}</span>
                    <span className="px-1.5 py-0.2 bg-purple-900/40 text-purple-300 rounded text-[10px] font-bold">
                      {amc.contractType}
                    </span>
                  </div>
                  <div className="text-slate-300 font-medium">{amc.customerName}</div>
                  <div className="text-[11px] text-slate-400">{amc.machineModel}</div>

                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Visits: <strong className="text-orange-400">{amc.visitsConsumed}</strong> / {amc.visitsAllowedTotal}
                    </span>
                    <span className="text-rose-400 font-medium">1 Visit Remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rapid Field Ops Hub Shortcuts */}
          <div className="rounded-xl bg-gradient-to-br from-orange-950/30 to-[#0d1322] border border-orange-500/20 p-5 space-y-3">
            <h3 className="text-xs font-semibold text-orange-200 uppercase tracking-wider">
              Field Operations Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/field-service/requests"
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-all"
              >
                <ClipboardCheck className="h-4 w-4 text-orange-400" />
                <span>Ticket Desk</span>
              </Link>
              <Link
                href="/field-service/van-stock"
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-all"
              >
                <Boxes className="h-4 w-4 text-amber-400" />
                <span>Van Spares</span>
              </Link>
              <Link
                href="/field-service/amc"
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-all"
              >
                <Award className="h-4 w-4 text-purple-400" />
                <span>Warranty Desk</span>
              </Link>
              <Link
                href="/field-service/analytics"
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-all"
              >
                <Activity className="h-4 w-4 text-teal-400" />
                <span>CSAT & MTTR</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

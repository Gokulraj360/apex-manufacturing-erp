'use client';

import React, { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  MapPin,
  Phone,
  Mail,
  ShieldAlert,
  Calendar,
  X,
  Star,
  Zap,
  ArrowRight,
  FileText,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import {
  ServiceRequestItem,
  ServicePriority,
  ServiceRequestStatus,
  ServiceRequestType,
  FieldEngineerItem,
} from '@/types/field-service';

const INITIAL_REQUESTS: ServiceRequestItem[] = [
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
      technicalSpecializations: ['Hydraulics', 'High-Tonnage Presses'],
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
      technicalSpecializations: ['CNC Control Boards', 'Siemens 840D'],
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
    serviceLocation: 'Plot 44, Waluj Industrial Area',
    city: 'Aurangabad',
    requestType: 'BREAKDOWN_REPAIR',
    priority: 'HIGH',
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
      technicalSpecializations: ['Robotic Articulation', 'Servo Drives'],
      currentStatus: 'AVAILABLE',
      totalCompletedJobs: 98,
      avgResolutionHours: 2.9,
      ftfrRate: 96.0,
      customerRatingAvg: 4.9,
      isActive: true,
    },
    createdAt: '2026-10-07T10:45:00Z',
  },
  {
    id: 'req-4',
    ticketNumber: 'SR-2026-0894',
    customerName: 'Titan Micro Electronics',
    customerPhone: '+91 98401 22334',
    customerEmail: 'facilities@titanmicro.com',
    serviceLocation: 'Electronic City Phase 1',
    city: 'Bengaluru',
    requestType: 'PREVENTIVE_MAINTENANCE',
    priority: 'MEDIUM',
    status: 'LOGGED',
    machineModel: 'SMT Pick-and-Place Feeder Master (PPF-90)',
    machineSerialNumber: 'PPF90-2024-009',
    reportedFault: 'Quarterly PM Schedule 3: Vacuum nozzle calibration and high-speed feeder belt tension check.',
    scheduledDate: '2026-10-08',
    firstTimeFix: false,
    totalServiceCost: 350,
    createdAt: '2026-10-07T11:00:00Z',
  },
  {
    id: 'req-5',
    ticketNumber: 'SR-2026-0889',
    customerName: 'Schneider Electric Switchgear',
    customerPhone: '+91 98221 44556',
    customerEmail: 'quality@schneider-in.com',
    serviceLocation: 'Ambad Industrial Area, Nashik',
    city: 'Nashik',
    requestType: 'WARRANTY_INSPECTION',
    priority: 'HIGH',
    status: 'RESOLVED',
    machineModel: 'Automated Busbar Bending Machine (BBM-120)',
    machineSerialNumber: 'BBM120-2024-031',
    reportedFault: 'Angle sensor drift causing ±1.5 degree bend angle variation in 12mm copper flats.',
    resolutionSummary: 'Re-calibrated optical rotary encoder, tightened set screws, updated firmware to v2.1. Verified 50 consecutive bends with zero deviation.',
    scheduledDate: '2026-10-06',
    firstTimeFix: true,
    customerSatisfactionScore: 5,
    customerFeedback: 'Outstanding resolution speed and thorough training on zero-point calibration.',
    totalServiceCost: 480,
    completedAt: '2026-10-06T16:20:00Z',
    assignedEngineerId: 'eng-1',
    createdAt: '2026-10-06T09:00:00Z',
  },
];

const AVAILABLE_ENGINEERS: FieldEngineerItem[] = [
  {
    id: 'eng-1',
    employeeCode: 'FSE-101',
    fullName: 'Vikram Jadhav',
    phone: '+91 98230 45671',
    email: 'vikram.j@apex-field.com',
    operatingTerritoryCity: 'Pune',
    technicalSpecializations: ['Hydraulics', 'High-Tonnage Presses'],
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
    technicalSpecializations: ['CNC Control Boards', 'Siemens 840D'],
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
    technicalSpecializations: ['Robotic Articulation', 'Servo Drives'],
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
    technicalSpecializations: ['Optical Sorting', 'Vision Systems'],
    currentStatus: 'AVAILABLE',
    totalCompletedJobs: 119,
    avgResolutionHours: 2.7,
    ftfrRate: 97.2,
    customerRatingAvg: 5.0,
    isActive: true,
  },
];

export default function ServiceRequestsDeskPage() {
  const [requests, setRequests] = useState<ServiceRequestItem[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ServiceRequestItem | null>(null);

  // Form states
  const [newRequest, setNewRequest] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceLocation: '',
    city: 'Pune',
    requestType: 'BREAKDOWN_REPAIR' as ServiceRequestType,
    priority: 'HIGH' as ServicePriority,
    machineModel: '',
    machineSerialNumber: '',
    reportedFault: '',
    scheduledDate: new Date().toISOString().split('T')[0],
  });

  const [assignEngineerId, setAssignEngineerId] = useState('');
  const [assignScheduledDate, setAssignScheduledDate] = useState(new Date().toISOString().split('T')[0]);

  const [resolveForm, setResolveForm] = useState({
    resolutionSummary: '',
    firstTimeFix: true,
    customerSatisfactionScore: 5,
    customerFeedback: '',
    totalServiceCost: 450,
  });

  // Filtering
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.machineModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || r.requestType === typeFilter;
    return matchesSearch && matchesPriority && matchesStatus && matchesType;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketNum = `SR-2026-0${Math.floor(100 + Math.random() * 900)}`;
    const created: ServiceRequestItem = {
      id: `req-${Date.now()}`,
      ticketNumber: ticketNum,
      ...newRequest,
      status: 'LOGGED',
      firstTimeFix: false,
      totalServiceCost: 0,
      createdAt: new Date().toISOString(),
    };
    setRequests([created, ...requests]);
    setIsCreateModalOpen(false);
    // Reset form
    setNewRequest({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      serviceLocation: '',
      city: 'Pune',
      requestType: 'BREAKDOWN_REPAIR',
      priority: 'HIGH',
      machineModel: '',
      machineSerialNumber: '',
      reportedFault: '',
      scheduledDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleAssignEngineer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !assignEngineerId) return;

    const eng = AVAILABLE_ENGINEERS.find((e) => e.id === assignEngineerId);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedTicket.id
          ? {
              ...r,
              assignedEngineerId: assignEngineerId,
              assignedEngineer: eng,
              status: 'ASSIGNED',
              scheduledDate: assignScheduledDate,
            }
          : r,
      ),
    );
    setIsAssignModalOpen(false);
    setSelectedTicket(null);
  };

  const handleResolveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedTicket.id
          ? {
              ...r,
              status: 'RESOLVED',
              resolutionSummary: resolveForm.resolutionSummary,
              firstTimeFix: resolveForm.firstTimeFix,
              customerSatisfactionScore: resolveForm.customerSatisfactionScore,
              customerFeedback: resolveForm.customerFeedback,
              totalServiceCost: resolveForm.totalServiceCost,
              completedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsResolveModalOpen(false);
    setSelectedTicket(null);
  };

  const getPriorityBadge = (p: ServicePriority) => {
    switch (p) {
      case 'CRITICAL_DOWN':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'LOW':
        return 'bg-slate-700/30 text-slate-400 border-slate-700/40';
    }
  };

  const getStatusBadge = (s: ServiceRequestStatus) => {
    switch (s) {
      case 'LOGGED':
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
      case 'ASSIGNED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'IN_TRANSIT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ON_SITE_DIAGNOSIS':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'PARTS_AWAITING':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'RESOLVED':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'CLOSED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Service Request Desk & Complaint Resolution
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log breakdowns, assign dispatch technicians, monitor on-site diagnosis progress, and capture customer satisfaction sign-offs.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Log Service Ticket
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ticket #, client, machine model, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL_DOWN">Critical Down</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="LOGGED">Logged</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="ON_SITE_DIAGNOSIS">On Site Diagnosis</option>
            <option value="PARTS_AWAITING">Parts Awaiting</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Request Types</option>
            <option value="BREAKDOWN_REPAIR">Breakdown Repair</option>
            <option value="PREVENTIVE_MAINTENANCE">Preventive Maintenance</option>
            <option value="INSTALLATION_COMMISSIONING">Installation & Commissioning</option>
            <option value="WARRANTY_INSPECTION">Warranty Inspection</option>
            <option value="AMC_VISIT">AMC Routine Visit</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket & Priority</th>
                <th className="py-3 px-4">Customer & Facility</th>
                <th className="py-3 px-4">Machine & Serial</th>
                <th className="py-3 px-4">Reported Issue</th>
                <th className="py-3 px-4">Field Engineer</th>
                <th className="py-3 px-4">Status & Schedule</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-normal">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No service requests match the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{req.ticketNumber}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(
                            req.priority,
                          )}`}
                        >
                          {req.priority.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {req.requestType.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{req.customerName}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                        <span>{req.city}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{req.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{req.machineModel}</div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        SN: {req.machineSerialNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-700 dark:text-slate-300 line-clamp-2">{req.reportedFault}</p>
                      {req.resolutionSummary && (
                        <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 line-clamp-1">
                          Fix: {req.resolutionSummary}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {req.assignedEngineer ? (
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{req.assignedEngineer.fullName}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{req.assignedEngineer.employeeCode}</div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedTicket(req);
                            setIsAssignModalOpen(true);
                          }}
                          className="px-2 py-1 rounded bg-orange-600/10 hover:bg-orange-600/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-[11px] font-medium"
                        >
                          Assign Tech
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                          req.status,
                        )}`}
                      >
                        {req.status.replace(/_/g, ' ')}
                      </span>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{req.scheduledDate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status !== 'RESOLVED' && req.status !== 'CLOSED' ? (
                          <>
                            <button
                              onClick={() => {
                                setSelectedTicket(req);
                                setIsAssignModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
                              title="Reassign Tech"
                            >
                              <Users className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTicket(req);
                                setIsResolveModalOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-teal-600/10 hover:bg-teal-600/20 text-teal-600 dark:text-teal-300 border border-teal-500/30 text-[11px] font-semibold transition-all"
                            >
                              Resolve
                            </button>
                          </>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Closed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Service Request */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 dark:text-orange-400">
                  <ClipboardCheck className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Log New Field Service Complaint</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Customer / Plant Name *</label>
                  <input
                    type="text"
                    required
                    value={newRequest.customerName}
                    onChange={(e) => setNewRequest({ ...newRequest, customerName: e.target.value })}
                    placeholder="e.g. Bharat Forge Ltd"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Operating City *</label>
                  <input
                    type="text"
                    required
                    value={newRequest.city}
                    onChange={(e) => setNewRequest({ ...newRequest, city: e.target.value })}
                    placeholder="e.g. Pune, Delhi NCR, Chennai"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={newRequest.customerPhone}
                    onChange={(e) => setNewRequest({ ...newRequest, customerPhone: e.target.value })}
                    placeholder="+91 98230 00000"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={newRequest.customerEmail}
                    onChange={(e) => setNewRequest({ ...newRequest, customerEmail: e.target.value })}
                    placeholder="ops@client.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Plant / Site Detailed Address *</label>
                <input
                  type="text"
                  required
                  value={newRequest.serviceLocation}
                  onChange={(e) => setNewRequest({ ...newRequest, serviceLocation: e.target.value })}
                  placeholder="Plot 21, Phase II Industrial Zone..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Service Type *</label>
                  <select
                    value={newRequest.requestType}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, requestType: e.target.value as ServiceRequestType })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                  >
                    <option value="BREAKDOWN_REPAIR">Breakdown Repair</option>
                    <option value="PREVENTIVE_MAINTENANCE">Preventive Maintenance</option>
                    <option value="INSTALLATION_COMMISSIONING">Installation & Commissioning</option>
                    <option value="WARRANTY_INSPECTION">Warranty Inspection</option>
                    <option value="AMC_VISIT">AMC Routine Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Priority Severity *</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, priority: e.target.value as ServicePriority })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                  >
                    <option value="CRITICAL_DOWN">Critical Down (Line Stopped)</option>
                    <option value="HIGH">High (Degraded Performance)</option>
                    <option value="MEDIUM">Medium (Scheduled PM / Non-stopping)</option>
                    <option value="LOW">Low (Consultation / Routine)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Machine Model *</label>
                  <input
                    type="text"
                    required
                    value={newRequest.machineModel}
                    onChange={(e) => setNewRequest({ ...newRequest, machineModel: e.target.value })}
                    placeholder="e.g. CNC VMC-850, Press HP-500"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={newRequest.machineSerialNumber}
                    onChange={(e) => setNewRequest({ ...newRequest, machineSerialNumber: e.target.value })}
                    placeholder="SN-2024-XXXX"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Reported Fault / Failure Symptoms *</label>
                <textarea
                  required
                  rows={3}
                  value={newRequest.reportedFault}
                  onChange={(e) => setNewRequest({ ...newRequest, reportedFault: e.target.value })}
                  placeholder="Detail exact error codes, unusual noise, hydraulic leak, servo alarms..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Scheduled Date *</label>
                <input
                  type="date"
                  required
                  value={newRequest.scheduledDate}
                  onChange={(e) => setNewRequest({ ...newRequest, scheduledDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold shadow-md shadow-orange-500/20"
                >
                  Register Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Field Engineer */}
      {isAssignModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400">
                  <Users className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Assign Field Engineer</h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">{selectedTicket.ticketNumber} - {selectedTicket.customerName}</div>
              <div className="text-slate-500 dark:text-slate-400">{selectedTicket.machineModel} ({selectedTicket.city})</div>
              <div className="text-rose-500 dark:text-rose-400 font-medium">{selectedTicket.reportedFault}</div>
            </div>

            <form onSubmit={handleAssignEngineer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Select Qualified Field Engineer *</label>
                <select
                  required
                  value={assignEngineerId}
                  onChange={(e) => setAssignEngineerId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- Choose Field Engineer --</option>
                  {AVAILABLE_ENGINEERS.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.fullName} ({eng.employeeCode}) - {eng.operatingTerritoryCity} [{eng.currentStatus}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Target Dispatch Date *</label>
                <input
                  type="date"
                  required
                  value={assignScheduledDate}
                  onChange={(e) => setAssignScheduledDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Dispatch Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resolve & Customer Sign-Off */}
      {isResolveModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500 dark:text-teal-400">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Resolve Ticket & Customer Sign-off</h3>
              </div>
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">{selectedTicket.ticketNumber} - {selectedTicket.customerName}</div>
              <div className="text-slate-500 dark:text-slate-400">{selectedTicket.machineModel}</div>
            </div>

            <form onSubmit={handleResolveTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Corrective Action Taken & Technical Fix *</label>
                <textarea
                  required
                  rows={3}
                  value={resolveForm.resolutionSummary}
                  onChange={(e) => setResolveForm({ ...resolveForm, resolutionSummary: e.target.value })}
                  placeholder="Detail parts replaced, calibration steps, and test cycle results..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                <input
                  type="checkbox"
                  id="ftfrCheck"
                  checked={resolveForm.firstTimeFix}
                  onChange={(e) => setResolveForm({ ...resolveForm, firstTimeFix: e.target.checked })}
                  className="rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-0"
                />
                <label htmlFor="ftfrCheck" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  First-Time Fix (FTFR) Achieved (Resolved in initial visit with no rework)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Customer CSAT Score (1 - 5)</label>
                  <select
                    value={resolveForm.customerSatisfactionScore}
                    onChange={(e) =>
                      setResolveForm({ ...resolveForm, customerSatisfactionScore: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value={5}>5 Stars - Excellent / Highly Satisfied</option>
                    <option value={4}>4 Stars - Good / Meets Expectation</option>
                    <option value={3}>3 Stars - Average / Minor Delay</option>
                    <option value={2}>2 Stars - Below Expectation</option>
                    <option value={1}>1 Star - Unsatisfactory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Service & Parts Cost ($)</label>
                  <input
                    type="number"
                    value={resolveForm.totalServiceCost}
                    onChange={(e) =>
                      setResolveForm({ ...resolveForm, totalServiceCost: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Customer Sign-off Remarks</label>
                <input
                  type="text"
                  value={resolveForm.customerFeedback}
                  onChange={(e) => setResolveForm({ ...resolveForm, customerFeedback: e.target.value })}
                  placeholder="e.g. Line recommissioned successfully. Approved by Plant Incharge."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

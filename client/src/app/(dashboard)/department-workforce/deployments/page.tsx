'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building2,
  Calendar,
  X,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Cpu,
  RefreshCw,
  Users,
  Edit2,
} from 'lucide-react';
import {
  DepartmentWorkstationAssignmentItem,
  WorkstationRole,
  DeploymentStatus,
} from '@/types/department-workforce';

const INITIAL_DEPLOYMENTS: DepartmentWorkstationAssignmentItem[] = [
  {
    id: 'dwa-1',
    assignmentCode: 'DWA-2026-0081',
    employeeId: 'emp-1',
    employee: {
      id: 'emp-1',
      employeeCode: 'EMP-CNC-104',
      firstName: 'Ramesh',
      lastName: 'Chavan',
      designation: { title: 'Senior CNC Machinist' },
    },
    departmentId: 'dept-1',
    department: { id: 'dept-1', name: 'CNC Machining', code: 'DEPT-CNC' },
    stationIdentifier: 'WS-CNC-04',
    machineAssetId: 'ast-1',
    machineAsset: {
      id: 'ast-1',
      assetTag: 'AST-CNC-001',
      assetName: 'DMG MORI DMU 50 5-Axis Mill',
      category: 'CNC_MACHINING',
      modelNumber: 'DMU 50 3rd Gen',
    },
    shiftCode: 'SHIFT_A',
    assignmentDate: '2026-10-07',
    roleOnStation: 'PRIMARY_OPERATOR',
    status: 'ACTIVE',
    certificationVerified: true,
    supervisorRemarks: 'Aerospace Ti-6Al-4V impeller casing run. Tight ISO 1328 accuracy.',
  },
  {
    id: 'dwa-2',
    assignmentCode: 'DWA-2026-0082',
    employeeId: 'emp-2',
    employee: {
      id: 'emp-2',
      employeeCode: 'EMP-WLD-209',
      firstName: 'Ganesh',
      lastName: 'Shinde',
      designation: { title: 'Robotic Weld Specialist' },
    },
    departmentId: 'dept-2',
    department: { id: 'dept-2', name: 'Robotic Welding', code: 'DEPT-WELD' },
    stationIdentifier: 'WELD-CELL-02',
    machineAssetId: 'ast-2',
    machineAsset: {
      id: 'ast-2',
      assetTag: 'AST-WLD-004',
      assetName: 'KUKA 6-Axis Robotic Welding Station',
      category: 'ROBOTIC_AUTOMATION',
      modelNumber: 'KR CYBERTECH nano',
    },
    shiftCode: 'SHIFT_A',
    assignmentDate: '2026-10-07',
    roleOnStation: 'PRIMARY_OPERATOR',
    status: 'ACTIVE',
    certificationVerified: true,
    supervisorRemarks: 'Automotive subframe continuous MIG welding run.',
  },
  {
    id: 'dwa-3',
    assignmentCode: 'DWA-2026-0083',
    employeeId: 'emp-3',
    employee: {
      id: 'emp-3',
      employeeCode: 'EMP-FRG-312',
      firstName: 'Sunil',
      lastName: 'Pawar',
      designation: { title: 'Forging Line Lead' },
    },
    departmentId: 'dept-3',
    department: { id: 'dept-3', name: 'Heavy Forging', code: 'DEPT-FORGE' },
    stationIdentifier: 'LINE-FORGE-01',
    machineAssetId: 'ast-3',
    machineAsset: {
      id: 'ast-3',
      assetTag: 'AST-PRS-002',
      assetName: '500T Hydraulic Hot Forging Press',
      category: 'HYDRAULIC_PRESS',
      modelNumber: 'HP-500-HD',
    },
    shiftCode: 'SHIFT_A',
    assignmentDate: '2026-10-07',
    roleOnStation: 'LINE_LEAD',
    status: 'ACTIVE',
    certificationVerified: true,
    supervisorRemarks: 'Axle I-beam closed-die forging run. Temperature monitored at 1150°C.',
  },
  {
    id: 'dwa-4',
    assignmentCode: 'DWA-2026-0084',
    employeeId: 'emp-4',
    employee: {
      id: 'emp-4',
      employeeCode: 'EMP-ASY-418',
      firstName: 'Pooja',
      lastName: 'Deshmukh',
      designation: { title: 'Assembly Technician' },
    },
    departmentId: 'dept-4',
    department: { id: 'dept-4', name: 'Precision Assembly', code: 'DEPT-ASSY' },
    stationIdentifier: 'LINE-ASSEMBLY-03',
    shiftCode: 'SHIFT_A',
    assignmentDate: '2026-10-07',
    roleOnStation: 'PRIMARY_OPERATOR',
    status: 'ACTIVE',
    certificationVerified: true,
    supervisorRemarks: 'Electric transmission planetary gear carrier assembly cell.',
  },
  {
    id: 'dwa-5',
    assignmentCode: 'DWA-2026-0085',
    employeeId: 'emp-5',
    employee: {
      id: 'emp-5',
      employeeCode: 'EMP-QC-502',
      firstName: 'Siddharth',
      lastName: 'Joshi',
      designation: { title: 'CMM Metrology Inspector' },
    },
    departmentId: 'dept-5',
    department: { id: 'dept-5', name: 'Quality Metrology', code: 'DEPT-QC' },
    stationIdentifier: 'WS-METROLOGY-01',
    machineAssetId: 'ast-4',
    machineAsset: {
      id: 'ast-4',
      assetTag: 'AST-CMM-001',
      assetName: 'Zeiss Contura Coordinate Measuring Machine',
      category: 'METROLOGY',
      modelNumber: 'Contura G2 RDS',
    },
    shiftCode: 'SHIFT_A',
    assignmentDate: '2026-10-07',
    roleOnStation: 'QUALITY_CHECKER',
    status: 'ACTIVE',
    certificationVerified: true,
    supervisorRemarks: 'First article dimensional CMM certification for Lot #412.',
  },
];

export default function WorkstationDeploymentsPage() {
  const [deployments, setDeployments] = useState<DepartmentWorkstationAssignmentItem[]>(INITIAL_DEPLOYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modals
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedForReassign, setSelectedForReassign] = useState<DepartmentWorkstationAssignmentItem | null>(null);
  const [reassignStation, setReassignStation] = useState('');
  const [reassignRemarks, setReassignRemarks] = useState('');

  // Deploy Form State
  const [deployForm, setDeployForm] = useState({
    employeeName: '',
    employeeCode: '',
    designation: 'CNC Operator',
    departmentCode: 'DEPT-CNC',
    departmentName: 'CNC Machining & Milling Division',
    stationIdentifier: '',
    machineAssetTag: 'AST-CNC-001',
    machineAssetName: 'DMG MORI 5-Axis Mill DMU 50',
    shiftCode: 'SHIFT_A',
    roleOnStation: 'PRIMARY_OPERATOR' as WorkstationRole,
    certificationVerified: true,
    supervisorRemarks: '',
  });

  // Filtered List
  const filteredDeployments = deployments.filter((d) => {
    const matchesSearch =
      d.assignmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.stationIdentifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.employee.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.machineAsset?.assetTag && d.machineAsset.assetTag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = departmentFilter === 'ALL' || d.department.code === departmentFilter;
    const matchesShift = shiftFilter === 'ALL' || d.shiftCode === shiftFilter;
    const matchesRole = roleFilter === 'ALL' || d.roleOnStation === roleFilter;

    return matchesSearch && matchesDept && matchesShift && matchesRole;
  });

  // Metrics
  const activeCount = deployments.filter((d) => d.status === 'ACTIVE').length;
  const certifiedCount = deployments.filter((d) => d.certificationVerified).length;

  // Handle Deploy Submit
  const handleDeployWorker = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeployment: DepartmentWorkstationAssignmentItem = {
      id: `dwa-${Date.now()}`,
      assignmentCode: `DWA-2026-0${Math.floor(86 + Math.random() * 500)}`,
      employeeId: `emp-${Date.now()}`,
      employee: {
        id: `emp-${Date.now()}`,
        employeeCode: deployForm.employeeCode || `EMP-${deployForm.departmentCode.replace('DEPT-', '')}-${Math.floor(100 + Math.random() * 899)}`,
        firstName: deployForm.employeeName.split(' ')[0] || 'Operator',
        lastName: deployForm.employeeName.split(' ')[1] || 'Staff',
        designation: { title: deployForm.designation },
      },
      departmentId: `dept-${deployForm.departmentCode}`,
      department: {
        id: `dept-${deployForm.departmentCode}`,
        name: deployForm.departmentName,
        code: deployForm.departmentCode,
      },
      stationIdentifier: deployForm.stationIdentifier,
      machineAssetId: deployForm.machineAssetTag ? `ast-${Date.now()}` : undefined,
      machineAsset: deployForm.machineAssetTag
        ? {
            id: `ast-${Date.now()}`,
            assetTag: deployForm.machineAssetTag,
            assetName: deployForm.machineAssetName,
            category: 'CNC_MACHINING',
            modelNumber: 'Spec Model',
          }
        : undefined,
      shiftCode: deployForm.shiftCode,
      assignmentDate: new Date().toISOString().substring(0, 10),
      roleOnStation: deployForm.roleOnStation,
      status: 'ACTIVE',
      certificationVerified: deployForm.certificationVerified,
      supervisorRemarks: deployForm.supervisorRemarks,
      createdAt: new Date().toISOString(),
    };

    setDeployments([newDeployment, ...deployments]);
    setShowDeployModal(false);
    setDeployForm({
      employeeName: '',
      employeeCode: '',
      designation: 'CNC Operator',
      departmentCode: 'DEPT-CNC',
      departmentName: 'CNC Machining & Milling Division',
      stationIdentifier: '',
      machineAssetTag: 'AST-CNC-001',
      machineAssetName: 'DMG MORI 5-Axis Mill DMU 50',
      shiftCode: 'SHIFT_A',
      roleOnStation: 'PRIMARY_OPERATOR',
      certificationVerified: true,
      supervisorRemarks: '',
    });
  };

  // Handle Reassign Submit
  const handleReassignWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForReassign || !reassignStation.trim()) return;

    setDeployments((prev) =>
      prev.map((d) =>
        d.id === selectedForReassign.id
          ? {
              ...d,
              stationIdentifier: reassignStation.trim(),
              status: 'REASSIGNED',
              supervisorRemarks: reassignRemarks || `Reassigned from ${d.stationIdentifier} to ${reassignStation}`,
            }
          : d
      )
    );

    setSelectedForReassign(null);
    setReassignStation('');
    setReassignRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Workstation Deployments
            </span>
            <span className="text-xs text-slate-500">Live Station Allocation Matrix</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Workstation, Machine & Assembly Line Deployments
          </h1>
          <p className="text-sm text-slate-400">
            Allocate and track worker deployments across departmental CNC cells, welding booths, forging presses, and metrology stations.
          </p>
        </div>

        <button
          onClick={() => setShowDeployModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-teal-900/20"
        >
          <Plus className="w-4 h-4" />
          Deploy Worker to Station
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Active Deployed Stations</div>
            <div className="text-2xl font-bold text-white mt-1">{activeCount} Assigned</div>
            <div className="text-xs text-teal-400 flex items-center gap-1 mt-1">
              <Layers className="w-3.5 h-3.5" />
              100% Station Occupancy
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Safety Certification Verified</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{certifiedCount} / {deployments.length}</div>
            <div className="text-xs text-emerald-400/90 mt-1">Zero uncertified operators</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Shift A Active Roster</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">
              {deployments.filter((d) => d.shiftCode === 'SHIFT_A').length} Operators
            </div>
            <div className="text-xs text-slate-400 mt-1">06:00 - 14:30 Active Window</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Machine Linked Workstations</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">
              {deployments.filter((d) => d.machineAssetId).length}
            </div>
            <div className="text-xs text-purple-400/80 mt-1">Asset telemetry mapped</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search code, worker, station, or machine asset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Dept:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Departments</option>
              <option value="DEPT-CNC">CNC Machining</option>
              <option value="DEPT-WELD">Robotic Welding</option>
              <option value="DEPT-FORGE">Heavy Forging</option>
              <option value="DEPT-ASSY">Precision Assembly</option>
              <option value="DEPT-QC">Quality Metrology</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Shift:</span>
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Shifts</option>
              <option value="SHIFT_A">Shift A (Morning)</option>
              <option value="SHIFT_B">Shift B (Evening)</option>
              <option value="SHIFT_C">Shift C (Night)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Roles</option>
              <option value="PRIMARY_OPERATOR">Primary Operator</option>
              <option value="ASSISTANT_OPERATOR">Assistant Operator</option>
              <option value="LINE_LEAD">Line Lead</option>
              <option value="QUALITY_CHECKER">Quality Checker</option>
              <option value="TRAINEE">Trainee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deployments Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="p-3.5">Assignment # & Date</th>
                <th className="p-3.5">Operator & Designation</th>
                <th className="p-3.5">Department & Workstation</th>
                <th className="p-3.5">Machine Asset Tag</th>
                <th className="p-3.5">Role on Station</th>
                <th className="p-3.5">Safety Cert</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredDeployments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-white text-sm">{d.assignmentCode}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {d.assignmentDate} • {d.shiftCode}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">
                      {d.employee.firstName} {d.employee.lastName}
                    </div>
                    <div className="text-teal-400 font-mono text-[11px]">{d.employee.employeeCode}</div>
                    <div className="text-[11px] text-slate-400">{d.employee.designation?.title}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-cyan-300 font-mono">{d.stationIdentifier}</div>
                    <div className="text-slate-400 text-[11px]">{d.department.name}</div>
                  </td>
                  <td className="p-3.5">
                    {d.machineAsset ? (
                      <div>
                        <span className="font-mono text-purple-400 font-semibold">{d.machineAsset.assetTag}</span>
                        <div className="text-slate-300 text-[11px] line-clamp-1">{d.machineAsset.assetName}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Manual / Assembly Bench</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                      {d.roleOnStation.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {d.certificationVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        <ShieldAlert className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        d.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : d.status === 'REASSIGNED'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-slate-700/30 text-slate-300 border-slate-700'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => {
                        setSelectedForReassign(d);
                        setReassignStation(d.stationIdentifier);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      Reassign
                    </button>
                    <Link
                      href="/department-workforce/outputs"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-lg text-xs font-medium border border-teal-500/20 transition-colors"
                    >
                      Output
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: DEPLOY WORKER TO STATION */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-400" />
                  Deploy Worker to Department Workstation / Line
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Allocate operator to workstation with verified safety certs and shift parameters.
                </p>
              </div>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeployWorker} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Worker Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chavan"
                    value={deployForm.employeeName}
                    onChange={(e) => setDeployForm({ ...deployForm, employeeName: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Employee Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-CNC-104"
                    value={deployForm.employeeCode}
                    onChange={(e) => setDeployForm({ ...deployForm, employeeCode: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Designation / Role Title</label>
                  <input
                    type="text"
                    value={deployForm.designation}
                    onChange={(e) => setDeployForm({ ...deployForm, designation: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Department Vertical *</label>
                  <select
                    value={deployForm.departmentCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const names: Record<string, string> = {
                        'DEPT-CNC': 'CNC Machining & Milling Division',
                        'DEPT-WELD': 'Robotic Welding & Fabrication',
                        'DEPT-FORGE': 'Heavy Forging & Press Lines',
                        'DEPT-ASSY': 'Precision Final Assembly Line',
                        'DEPT-QC': 'Quality Inspection & Metrology',
                      };
                      setDeployForm({
                        ...deployForm,
                        departmentCode: code,
                        departmentName: names[code] || 'Shop Floor Department',
                      });
                    }}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="DEPT-CNC">CNC Machining & Milling Division</option>
                    <option value="DEPT-WELD">Robotic Welding & Fabrication</option>
                    <option value="DEPT-FORGE">Heavy Forging & Press Lines</option>
                    <option value="DEPT-ASSY">Precision Final Assembly Line</option>
                    <option value="DEPT-QC">Quality Inspection & Metrology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Station / Line Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WS-CNC-04 or LINE-ASSEMBLY-02"
                    value={deployForm.stationIdentifier}
                    onChange={(e) => setDeployForm({ ...deployForm, stationIdentifier: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Machine Asset Tag (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. AST-CNC-001"
                    value={deployForm.machineAssetTag}
                    onChange={(e) => setDeployForm({ ...deployForm, machineAssetTag: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Shift Code</label>
                  <select
                    value={deployForm.shiftCode}
                    onChange={(e) => setDeployForm({ ...deployForm, shiftCode: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="SHIFT_A">Shift A (06:00 - 14:30)</option>
                    <option value="SHIFT_B">Shift B (14:30 - 23:00)</option>
                    <option value="SHIFT_C">Shift C (23:00 - 06:30)</option>
                    <option value="GENERAL">General Shift (09:00 - 18:00)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Role on Station</label>
                  <select
                    value={deployForm.roleOnStation}
                    onChange={(e) => setDeployForm({ ...deployForm, roleOnStation: e.target.value as WorkstationRole })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="PRIMARY_OPERATOR">Primary Operator</option>
                    <option value="ASSISTANT_OPERATOR">Assistant Operator</option>
                    <option value="LINE_LEAD">Line Lead / Cell Master</option>
                    <option value="QUALITY_CHECKER">Quality Checker</option>
                    <option value="MAINTENANCE_TECH">Maintenance Technician</option>
                    <option value="TRAINEE">Apprentice / Trainee</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Supervisor Instructions & Quality Plan</label>
                  <textarea
                    rows={3}
                    placeholder="Enter special component tolerances, batch numbers, safety lockout steps..."
                    value={deployForm.supervisorRemarks}
                    onChange={(e) => setDeployForm({ ...deployForm, supervisorRemarks: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-between">
                <span className="text-teal-300 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Machine Safety & PPE Verification
                </span>
                <span className="text-xs text-emerald-400 font-semibold">Verified Compliant</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-md shadow-teal-900/20"
                >
                  Confirm Station Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REASSIGN STATION */}
      {selectedForReassign && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-teal-400">{selectedForReassign.assignmentCode}</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Reassign Operator: {selectedForReassign.employee.firstName} {selectedForReassign.employee.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedForReassign(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReassignWorker} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Current Station:</label>
                <div className="font-mono text-slate-400 bg-[#090d16] p-2 rounded-lg border border-slate-800">
                  {selectedForReassign.stationIdentifier} ({selectedForReassign.department.name})
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">New Target Station / Line *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WS-CNC-08 or LINE-FORGE-02"
                  value={reassignStation}
                  onChange={(e) => setReassignStation(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Reassignment Reason / Justification</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Workload balancing, bottleneck relief on Line 2, rush batch order..."
                  value={reassignRemarks}
                  onChange={(e) => setReassignRemarks(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedForReassign(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-md shadow-teal-900/20"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

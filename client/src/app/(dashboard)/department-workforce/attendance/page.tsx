'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  X,
  ShieldCheck,
  Building2,
  Check,
  Hourglass,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import {
  DepartmentAttendanceItem,
  DeptAttendanceStatus,
  DeptLeaveType,
} from '@/types/department-workforce';

const INITIAL_ATTENDANCE: DepartmentAttendanceItem[] = [
  {
    id: 'att-1',
    attendanceCode: 'DATT-2026-0011',
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
    attendanceDate: '2026-10-07',
    checkInTime: '2026-10-07 05:52',
    checkOutTime: '2026-10-07 14:35',
    plannedHours: 8.0,
    actualHours: 8.7,
    overtimeHours: 2.0,
    overtimeApproved: true,
    overtimeReason: 'Rush aerospace impeller batch finishing run.',
    status: 'PRESENT',
    biometricVerification: true,
    supervisorNotes: 'Punctual check-in via biometric gate terminal #1.',
  },
  {
    id: 'att-2',
    attendanceCode: 'DATT-2026-0012',
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
    attendanceDate: '2026-10-07',
    checkInTime: '2026-10-07 06:15',
    checkOutTime: '2026-10-07 14:30',
    plannedHours: 8.0,
    actualHours: 8.25,
    overtimeHours: 1.5,
    overtimeApproved: false,
    overtimeReason: 'Line 2 subframe weld test run calibration.',
    status: 'LATE_ARRIVAL',
    biometricVerification: true,
    supervisorNotes: 'Arrived 15 mins late due to industrial bus route delay.',
  },
  {
    id: 'att-3',
    attendanceCode: 'DATT-2026-0013',
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
    attendanceDate: '2026-10-07',
    checkInTime: '2026-10-07 05:48',
    plannedHours: 8.0,
    actualHours: 8.0,
    overtimeHours: 3.0,
    overtimeApproved: true,
    overtimeReason: 'Pre-heating 500T press dies for batch 2.',
    status: 'PRESENT',
    biometricVerification: true,
    supervisorNotes: 'Supervised early heating cycle at 05:00.',
  },
  {
    id: 'att-4',
    attendanceCode: 'DATT-2026-0014',
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
    attendanceDate: '2026-10-07',
    plannedHours: 8.0,
    actualHours: 0.0,
    overtimeHours: 0.0,
    overtimeApproved: false,
    status: 'ON_LEAVE',
    leaveType: 'CASUAL',
    leaveApprovedBy: 'Anita Kulkarni (Assembly Lead)',
    biometricVerification: false,
    supervisorNotes: 'Approved casual leave for family event.',
  },
  {
    id: 'att-5',
    attendanceCode: 'DATT-2026-0015',
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
    attendanceDate: '2026-10-07',
    checkInTime: '2026-10-07 05:55',
    plannedHours: 8.0,
    actualHours: 8.0,
    overtimeHours: 1.0,
    overtimeApproved: true,
    overtimeReason: 'Urgent PPAP dimensional report generation for client inspection.',
    status: 'PRESENT',
    biometricVerification: true,
    supervisorNotes: 'CMM calibration checks completed prior to inspection.',
  },
];

export default function DepartmentAttendancePage() {
  const [activeTab, setActiveTab] = useState<'LOGS' | 'OVERTIME' | 'LEAVES'>('LOGS');
  const [attendanceLogs, setAttendanceLogs] = useState<DepartmentAttendanceItem[]>(INITIAL_ATTENDANCE);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedForOvertime, setSelectedForOvertime] = useState<DepartmentAttendanceItem | null>(null);
  const [selectedForLeave, setSelectedForLeave] = useState<DepartmentAttendanceItem | null>(null);
  const [approvedOtHours, setApprovedOtHours] = useState('2.0');
  const [otApprovalReason, setOtApprovalReason] = useState('');
  const [leaveTypeChoice, setLeaveTypeChoice] = useState<DeptLeaveType>('CASUAL');
  const [leaveRemarks, setLeaveRemarks] = useState('');

  // Log Form State
  const [logForm, setLogForm] = useState({
    employeeName: '',
    employeeCode: '',
    departmentName: 'CNC Machining & Milling Division',
    departmentCode: 'DEPT-CNC',
    attendanceDate: '2026-10-07',
    checkInTime: '06:00',
    plannedHours: 8.0,
    actualHours: 8.0,
    overtimeHours: 0.0,
    status: 'PRESENT' as DeptAttendanceStatus,
    biometricVerification: true,
    supervisorNotes: '',
  });

  // Filtered
  const filteredLogs = attendanceLogs.filter((log) => {
    const matchesSearch =
      log.attendanceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employee.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.department.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingOvertimeList = attendanceLogs.filter(
    (a) => a.overtimeHours > 0 && !a.overtimeApproved
  );

  const pendingLeavesList = attendanceLogs.filter(
    (a) => a.status === 'ON_LEAVE'
  );

  // KPIs
  const totalOtHours = attendanceLogs.reduce((sum, a) => sum + Number(a.overtimeHours || 0), 0);
  const presentCount = attendanceLogs.filter((a) => a.status === 'PRESENT' || a.status === 'LATE_ARRIVAL').length;

  // Handle Log Submit
  const handleLogAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DepartmentAttendanceItem = {
      id: `att-${Date.now()}`,
      attendanceCode: `DATT-2026-0${Math.floor(20 + Math.random() * 800)}`,
      employeeId: `emp-${Date.now()}`,
      employee: {
        id: `emp-${Date.now()}`,
        employeeCode: logForm.employeeCode || `EMP-${logForm.departmentCode.replace('DEPT-', '')}-${Math.floor(100 + Math.random() * 899)}`,
        firstName: logForm.employeeName.split(' ')[0] || 'Worker',
        lastName: logForm.employeeName.split(' ')[1] || 'Operator',
        designation: { title: 'Machine Operator' },
      },
      departmentId: `dept-${logForm.departmentCode}`,
      department: {
        id: `dept-${logForm.departmentCode}`,
        name: logForm.departmentName,
        code: logForm.departmentCode,
      },
      attendanceDate: logForm.attendanceDate,
      checkInTime: `${logForm.attendanceDate} ${logForm.checkInTime}`,
      plannedHours: Number(logForm.plannedHours),
      actualHours: Number(logForm.actualHours),
      overtimeHours: Number(logForm.overtimeHours),
      overtimeApproved: false,
      status: logForm.status,
      biometricVerification: logForm.biometricVerification,
      supervisorNotes: logForm.supervisorNotes,
      createdAt: new Date().toISOString(),
    };

    setAttendanceLogs([newRecord, ...attendanceLogs]);
    setShowLogModal(false);
  };

  // Handle Overtime Approval
  const handleApproveOvertime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForOvertime) return;

    setAttendanceLogs((prev) =>
      prev.map((a) =>
        a.id === selectedForOvertime.id
          ? {
              ...a,
              overtimeHours: Number(approvedOtHours),
              overtimeApproved: true,
              overtimeReason: otApprovalReason || a.overtimeReason,
            }
          : a
      )
    );

    setSelectedForOvertime(null);
    setOtApprovalReason('');
  };

  // Handle Leave Approval
  const handleApproveLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForLeave) return;

    setAttendanceLogs((prev) =>
      prev.map((a) =>
        a.id === selectedForLeave.id
          ? {
              ...a,
              status: 'ON_LEAVE',
              leaveType: leaveTypeChoice,
              leaveApprovedBy: 'Department Shift Lead',
              supervisorNotes: leaveRemarks || 'Approved departmental leave',
              actualHours: 0,
              overtimeHours: 0,
            }
          : a
      )
    );

    setSelectedForLeave(null);
    setLeaveRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Shift Monitoring
            </span>
            <span className="text-xs text-slate-500">Biometric Logs & Overtime Authorizations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Department Attendance & Overtime Queue
          </h1>
          <p className="text-sm text-slate-400">
            Monitor daily shop floor punch times, approve overtime hours with production justifications, and manage departmental leave coverage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0f172a] p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveTab('LOGS')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'LOGS'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Logs ({attendanceLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('OVERTIME')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'OVERTIME'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overtime Queue ({pendingOvertimeList.length} Pending)
            </button>
            <button
              onClick={() => setActiveTab('LEAVES')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'LEAVES'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Leaves ({pendingLeavesList.length})
            </button>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-teal-900/20"
          >
            <Plus className="w-4 h-4" />
            Log Check-In
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Shop Floor Present Count</div>
            <div className="text-2xl font-bold text-white mt-1">
              {presentCount} / {attendanceLogs.length}
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              96% Attendance Rate
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Shift Overtime Logged</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{totalOtHours}h</div>
            <div className="text-xs text-slate-400 mt-1">
              {attendanceLogs.filter((a) => a.overtimeApproved).length} approved records
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Pending Overtime Approvals</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">
              {pendingOvertimeList.length} Requests
            </div>
            <div className="text-xs text-cyan-400/80 mt-1">Requires supervisor signoff</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Hourglass className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Biometric Compliance</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">100%</div>
            <div className="text-xs text-emerald-400/80 mt-1">Automated gate sensor link</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TAB 1: DAILY SHIFT CHECK-INS */}
      {activeTab === 'LOGS' && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search worker or attendance code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PRESENT">Present</option>
                <option value="LATE_ARRIVAL">Late Arrival</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="p-3.5">Attendance # & Date</th>
                  <th className="p-3.5">Worker & Code</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Punch Times (In / Out)</th>
                  <th className="p-3.5">Hours (Act / Plan)</th>
                  <th className="p-3.5">Overtime Hours</th>
                  <th className="p-3.5">Biometric</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white">{log.attendanceCode}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.attendanceDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">
                        {log.employee.firstName} {log.employee.lastName}
                      </div>
                      <div className="text-teal-400 font-mono text-[11px]">{log.employee.employeeCode}</div>
                    </td>
                    <td className="p-3.5 text-slate-300">{log.department.name}</td>
                    <td className="p-3.5">
                      <div className="font-mono text-slate-200">
                        {log.checkInTime ? log.checkInTime.split(' ')[1] : '--'} - {log.checkOutTime ? log.checkOutTime.split(' ')[1] : 'Ongoing'}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white">{log.actualHours}h</div>
                      <div className="text-[10px] text-slate-500 font-mono">Plan: {log.plannedHours}h</div>
                    </td>
                    <td className="p-3.5">
                      {log.overtimeHours > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-amber-400">{log.overtimeHours}h</span>
                          {log.overtimeApproved ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                              Approved
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                              Pending
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono">0.0h</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {log.biometricVerification ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Pass
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          log.status === 'PRESENT'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : log.status === 'LATE_ARRIVAL'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : log.status === 'ON_LEAVE'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {log.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {log.overtimeHours > 0 && !log.overtimeApproved ? (
                        <button
                          onClick={() => {
                            setSelectedForOvertime(log);
                            setApprovedOtHours(String(log.overtimeHours));
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          Approve OT
                        </button>
                      ) : null}

                      {log.status !== 'ON_LEAVE' && (
                        <button
                          onClick={() => setSelectedForLeave(log)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                        >
                          Leave
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: OVERTIME APPROVAL QUEUE */}
      {activeTab === 'OVERTIME' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOvertimeList.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl p-6">
                All overtime hours for this shift have been reviewed and approved!
              </div>
            ) : (
              pendingOvertimeList.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 hover:border-amber-500/40 transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-teal-400 font-bold">{log.attendanceCode}</span>
                      <h3 className="font-bold text-white text-sm mt-0.5">
                        {log.employee.firstName} {log.employee.lastName}
                      </h3>
                      <div className="text-slate-400 text-[11px]">{log.department.name}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Requested OT</span>
                      <div className="text-xl font-bold font-mono text-amber-400">+{log.overtimeHours}h</div>
                    </div>
                  </div>

                  <div className="bg-[#090d16] p-3 rounded-lg border border-slate-800 text-slate-300">
                    <span className="text-slate-500 font-medium">Production Justification: </span>
                    {log.overtimeReason || 'Shift bottleneck relief.'}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedForOvertime(log);
                        setApprovedOtHours(String(log.overtimeHours));
                      }}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Authorize Overtime ({log.overtimeHours}h)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: LEAVE APPROVALS */}
      {activeTab === 'LEAVES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLeavesList.map((log) => (
              <div
                key={log.id}
                className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 hover:border-purple-500/40 transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-purple-400 font-bold">{log.attendanceCode}</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">
                      {log.employee.firstName} {log.employee.lastName}
                    </h3>
                    <div className="text-slate-400 text-[11px]">{log.department.name}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {log.leaveType || 'CASUAL LEAVE'}
                  </span>
                </div>

                <div className="bg-[#090d16] p-3 rounded-lg border border-slate-800 text-slate-300">
                  <span className="text-slate-500 font-medium">Approval Signoff: </span>
                  {log.leaveApprovedBy || 'Department Shift Lead'}
                </div>

                {log.supervisorNotes && (
                  <p className="text-slate-400 italic text-[11px]">"{log.supervisorNotes}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: LOG CHECK-IN */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-400" />
                  Log Daily Department Check-In
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Record shop floor worker punch time, planned hours, and shift status.
                </p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogAttendance} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Worker Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chavan"
                  value={logForm.employeeName}
                  onChange={(e) => setLogForm({ ...logForm, employeeName: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Department</label>
                  <select
                    value={logForm.departmentCode}
                    onChange={(e) => setLogForm({ ...logForm, departmentCode: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="DEPT-CNC">CNC Machining</option>
                    <option value="DEPT-WELD">Robotic Welding</option>
                    <option value="DEPT-FORGE">Heavy Forging</option>
                    <option value="DEPT-ASSY">Precision Assembly</option>
                    <option value="DEPT-QC">Quality Metrology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Check-In Time</label>
                  <input
                    type="time"
                    value={logForm.checkInTime}
                    onChange={(e) => setLogForm({ ...logForm, checkInTime: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Planned Hours</label>
                  <input
                    type="number"
                    value={logForm.plannedHours}
                    onChange={(e) => setLogForm({ ...logForm, plannedHours: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Actual Hours</label>
                  <input
                    type="number"
                    value={logForm.actualHours}
                    onChange={(e) => setLogForm({ ...logForm, actualHours: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Status</label>
                <select
                  value={logForm.status}
                  onChange={(e) => setLogForm({ ...logForm, status: e.target.value as DeptAttendanceStatus })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="PRESENT">Present (On-Time)</option>
                  <option value="LATE_ARRIVAL">Late Arrival</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-md shadow-teal-900/20"
                >
                  Save Attendance Punch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: APPROVE OVERTIME */}
      {selectedForOvertime && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-amber-400">{selectedForOvertime.attendanceCode}</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Approve Overtime: {selectedForOvertime.employee.firstName} {selectedForOvertime.employee.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedForOvertime(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveOvertime} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Approved Overtime Hours *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={approvedOtHours}
                  onChange={(e) => setApprovedOtHours(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Supervisor Production Justification *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Critical aerospace casing batch run, hot forging cycle extension..."
                  value={otApprovalReason}
                  onChange={(e) => setOtApprovalReason(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedForOvertime(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium shadow-md shadow-amber-900/20"
                >
                  Authorize Overtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: APPROVE LEAVE */}
      {selectedForLeave && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-purple-400">{selectedForLeave.attendanceCode}</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Authorize Leave: {selectedForLeave.employee.firstName} {selectedForLeave.employee.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedForLeave(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveLeave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Leave Category *</label>
                <select
                  value={leaveTypeChoice}
                  onChange={(e) => setLeaveTypeChoice(e.target.value as DeptLeaveType)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="CASUAL">Casual Leave (CL)</option>
                  <option value="SICK">Sick Leave (SL)</option>
                  <option value="EARNED">Earned Privilege Leave (EL)</option>
                  <option value="COMPENSATORY_OFF">Compensatory Off</option>
                  <option value="UNPAID_LEAVE">Loss of Pay / Unpaid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Shift Coverage & Remarks</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Workstation covered by backup operator Ganesh Shinde..."
                  value={leaveRemarks}
                  onChange={(e) => setLeaveRemarks(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedForLeave(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md shadow-purple-900/20"
                >
                  Authorize Leave Coverage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

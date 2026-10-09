'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  ArrowLeft,
  X,
  UserCheck,
  Calendar,
  Layers,
  Check,
  RotateCcw,
  Building,
} from 'lucide-react';
import {
  AttendanceLogItem,
  ShiftRosterItem,
  LeaveRequestItem,
  OvertimeRecordItem,
  AttendanceStatus,
  LeaveStatus,
  LeaveType,
} from '@/types/hr';

const MOCK_ATTENDANCE_LOGS: AttendanceLogItem[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    employee: { id: 'emp-1', employeeCode: 'EMP-2026-001', firstName: 'Sunil', lastName: 'Rao', email: 'sunil.rao@apex-mfg.local', phone: '+91 98230 44551', departmentId: 'dept-1', designationId: 'des-1', employmentStatus: 'ACTIVE', employmentType: 'FULL_TIME', dateOfJoining: '2022-03-15', baseSalary: 125000, hourlyOvertimeRate: 650, createdAt: '', updatedAt: '', department: { id: 'dept-1', name: 'Production', code: 'PROD' } },
    date: '2026-10-07',
    clockIn: '08:52 AM',
    clockOut: '05:35 PM',
    totalHours: 8.7,
    status: 'PRESENT',
    biometricDeviceId: 'BIO-GATE-01',
    isRegularized: false,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'att-2',
    employeeId: 'emp-2',
    employee: { id: 'emp-2', employeeCode: 'EMP-2026-002', firstName: 'Rajesh', lastName: 'Mehra', email: 'rajesh.mehra@apex-mfg.local', phone: '+91 98900 12345', departmentId: 'dept-2', designationId: 'des-2', employmentStatus: 'ACTIVE', employmentType: 'FULL_TIME', dateOfJoining: '2023-01-10', baseSalary: 72000, hourlyOvertimeRate: 400, createdAt: '', updatedAt: '', department: { id: 'dept-2', name: 'Warehouse', code: 'WHS' } },
    date: '2026-10-07',
    clockIn: '05:50 AM',
    clockOut: '02:30 PM',
    totalHours: 8.6,
    status: 'PRESENT',
    biometricDeviceId: 'BIO-WHS-02',
    isRegularized: false,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'att-3',
    employeeId: 'emp-3',
    employee: { id: 'emp-3', employeeCode: 'EMP-2026-015', firstName: 'Amit', lastName: 'Kalyan', email: 'amit.k@apex-mfg.local', phone: '+91 97654 32109', departmentId: 'dept-1', designationId: 'des-3', employmentStatus: 'ACTIVE', employmentType: 'SHIFT_WORKER', dateOfJoining: '2024-06-01', baseSalary: 48000, hourlyOvertimeRate: 300, createdAt: '', updatedAt: '', department: { id: 'dept-1', name: 'Production', code: 'PROD' } },
    date: '2026-10-07',
    clockIn: '06:12 AM',
    totalHours: 7.2,
    status: 'LATE',
    biometricDeviceId: 'BIO-GATE-01',
    isRegularized: false,
    createdAt: '',
    updatedAt: '',
  },
];

const MOCK_SHIFTS: ShiftRosterItem[] = [
  {
    id: 'shf-1',
    employeeId: 'emp-3',
    employee: { id: 'emp-3', employeeCode: 'EMP-2026-015', firstName: 'Amit', lastName: 'Kalyan', email: 'amit.k@apex-mfg.local', phone: '', departmentId: '', designationId: '', employmentStatus: 'ACTIVE', employmentType: 'SHIFT_WORKER', dateOfJoining: '', baseSalary: 0, hourlyOvertimeRate: 0, createdAt: '', updatedAt: '', department: { id: '', name: 'Production', code: 'PROD' } },
    shiftName: 'Morning Shift (A)',
    shiftCode: 'S-MORN-A',
    startTime: '06:00',
    endTime: '14:30',
    effectiveStartDate: '2026-10-01',
    weekOffDay: 'SUNDAY',
    isRotational: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'shf-2',
    employeeId: 'emp-2',
    employee: { id: 'emp-2', employeeCode: 'EMP-2026-002', firstName: 'Rajesh', lastName: 'Mehra', email: 'rajesh.mehra@apex-mfg.local', phone: '', departmentId: '', designationId: '', employmentStatus: 'ACTIVE', employmentType: 'FULL_TIME', dateOfJoining: '', baseSalary: 0, hourlyOvertimeRate: 0, createdAt: '', updatedAt: '', department: { id: '', name: 'Warehouse', code: 'WHS' } },
    shiftName: 'General Day Shift (G)',
    shiftCode: 'S-GEN-DAY',
    startTime: '09:00',
    endTime: '17:30',
    effectiveStartDate: '2026-10-01',
    weekOffDay: 'SUNDAY',
    isRotational: false,
    createdAt: '',
    updatedAt: '',
  },
];

const MOCK_LEAVES: LeaveRequestItem[] = [
  {
    id: 'lv-1',
    employeeId: 'emp-4',
    employee: { id: 'emp-4', employeeCode: 'EMP-2026-042', firstName: 'Pooja', lastName: 'Sharma', email: '', phone: '', departmentId: '', designationId: '', employmentStatus: 'ACTIVE', employmentType: 'FULL_TIME', dateOfJoining: '', baseSalary: 0, hourlyOvertimeRate: 0, createdAt: '', updatedAt: '', department: { id: '', name: 'Quality Assurance', code: 'QA' } },
    leaveType: 'CASUAL',
    startDate: '2026-10-09',
    endDate: '2026-10-10',
    totalDays: 2,
    reason: 'Family function in hometown',
    status: 'PENDING',
    appliedAt: '2026-10-07 09:15',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'lv-2',
    employeeId: 'emp-3',
    employee: { id: 'emp-3', employeeCode: 'EMP-2026-015', firstName: 'Amit', lastName: 'Kalyan', email: '', phone: '', departmentId: '', designationId: '', employmentStatus: 'ACTIVE', employmentType: 'SHIFT_WORKER', dateOfJoining: '', baseSalary: 0, hourlyOvertimeRate: 0, createdAt: '', updatedAt: '', department: { id: '', name: 'Production', code: 'PROD' } },
    leaveType: 'SICK',
    startDate: '2026-10-02',
    endDate: '2026-10-03',
    totalDays: 2,
    reason: 'Viral fever, medical certificate attached',
    status: 'APPROVED',
    appliedAt: '2026-10-01 18:30',
    reviewedBy: 'Sunil Rao',
    reviewedAt: '2026-10-02 08:00',
    createdAt: '',
    updatedAt: '',
  },
];

const MOCK_OVERTIME: OvertimeRecordItem[] = [
  {
    id: 'ot-1',
    employeeId: 'emp-3',
    employee: { id: 'emp-3', employeeCode: 'EMP-2026-015', firstName: 'Amit', lastName: 'Kalyan', email: '', phone: '', departmentId: '', designationId: '', employmentStatus: 'ACTIVE', employmentType: 'SHIFT_WORKER', dateOfJoining: '', baseSalary: 0, hourlyOvertimeRate: 300, createdAt: '', updatedAt: '', department: { id: '', name: 'Production', code: 'PROD' } },
    date: '2026-10-06',
    overtimeHours: 3.5,
    hourlyRate: 300,
    calculatedAmount: 1050,
    reason: 'Urgent weekend batch completion for PO-2026-089',
    isApproved: false,
    dispatchedToPayroll: false,
    payrollMonth: 10,
    payrollYear: 2026,
    createdAt: '',
    updatedAt: '',
  },
];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'ATTENDANCE' | 'SHIFTS' | 'LEAVES' | 'OVERTIME'>('ATTENDANCE');
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLogItem[]>(MOCK_ATTENDANCE_LOGS);
  const [leaves, setLeaves] = useState<LeaveRequestItem[]>(MOCK_LEAVES);
  const [overtimeList, setOvertimeList] = useState<OvertimeRecordItem[]>(MOCK_OVERTIME);

  // Leave approval
  const handleReviewLeave = (id: string, status: LeaveStatus) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, reviewedAt: new Date().toISOString() } : l)),
    );
  };

  // Overtime approval
  const handleToggleOtApproval = (id: string) => {
    setOvertimeList((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, isApproved: !o.isApproved, approvedBySupervisor: 'Current Supervisor' } : o,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/hr" className="hover:text-indigo-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Workforce Hub
            </Link>
            <span>/</span>
            <span className="text-slate-200">Attendance & Shifts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-indigo-400" />
            Attendance, Shift Rosters & Overtime
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Biometric sync, daily clock-in exceptions, shift rotations (A/B/C), leave approvals, and overtime logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span>Biometric Gate 01: Online Sync</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { key: 'ATTENDANCE', label: 'Live Daily Attendance' },
          { key: 'SHIFTS', label: 'Shift Roster Schedules' },
          { key: 'LEAVES', label: 'Leave Requests & Approvals' },
          { key: 'OVERTIME', label: 'Overtime (OT) Verification' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Live Daily Attendance */}
      {activeTab === 'ATTENDANCE' && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Daily Biometric Log &mdash; Today</span>
            <span className="text-slate-400">Total Clocked: {attendanceLogs.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-3 font-semibold">Employee</th>
                  <th className="py-3 px-3 font-semibold">Department</th>
                  <th className="py-3 px-3 font-semibold">Clock In</th>
                  <th className="py-3 px-3 font-semibold">Clock Out</th>
                  <th className="py-3 px-3 font-semibold">Total Hours</th>
                  <th className="py-3 px-3 font-semibold">Biometric Device</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">
                        {log.employee?.firstName} {log.employee?.lastName}
                      </div>
                      <span className="font-mono text-[10px] text-indigo-300">{log.employee?.employeeCode}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{log.employee?.department?.name}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-medium">{log.clockIn || '--:--'}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{log.clockOut || 'Active on shift'}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">{log.totalHours ? `${log.totalHours} hrs` : '--'}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{log.biometricDeviceId || 'App GPS'}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          log.status === 'PRESENT'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Shift Roster Schedules */}
      {activeTab === 'SHIFTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-indigo-300 block uppercase">Shift A (Morning)</span>
              <div className="text-lg font-bold text-white font-mono">06:00 &mdash; 14:30</div>
              <p className="text-[11px] text-slate-400">Primary manufacturing production lines, CNC milling, assembly lines.</p>
              <div className="text-xs text-emerald-400 font-semibold pt-2 border-t border-slate-800">64 Operators assigned</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-300 block uppercase">Shift B (Evening)</span>
              <div className="text-lg font-bold text-white font-mono">14:00 &mdash; 22:30</div>
              <p className="text-[11px] text-slate-400">Finished goods packing, carton palletizing, dispatch bay loading.</p>
              <div className="text-xs text-amber-400 font-semibold pt-2 border-t border-slate-800">42 Operators assigned</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-blue-300 block uppercase">Shift C (Night Maintenance)</span>
              <div className="text-lg font-bold text-white font-mono">22:00 &mdash; 06:30</div>
              <p className="text-[11px] text-slate-400">Preventive maintenance, spindle recalibration, automated conveyor cleaning.</p>
              <div className="text-xs text-blue-400 font-semibold pt-2 border-t border-slate-800">14 Technicians assigned</div>
            </div>
          </div>

          <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-slate-800 font-semibold text-xs text-white">Active Rosters</div>
            <div className="divide-y divide-slate-800/60 text-xs">
              {MOCK_SHIFTS.map((s) => (
                <div key={s.id} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{s.employee?.firstName} {s.employee?.lastName}</span>
                    <span className="font-mono text-[10px] text-slate-400 ml-2">[{s.employee?.employeeCode}]</span>
                    <div className="text-[11px] text-slate-400">{s.shiftName} ({s.startTime} - {s.endTime})</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                      Week-Off: {s.weekOffDay}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">Effective from {s.effectiveStartDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leave Requests */}
      {activeTab === 'LEAVES' && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Submitted Leave Applications</span>
            <span className="text-slate-400">{leaves.length} Total Requests</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {leaves.map((lv) => (
              <div key={lv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{lv.employee?.firstName} {lv.employee?.lastName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {lv.leaveType} LEAVE
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        lv.status === 'APPROVED'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : lv.status === 'PENDING'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/15 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {lv.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 mt-1">
                    Duration: <span className="text-white font-mono">{lv.startDate}</span> to <span className="text-white font-mono">{lv.endDate}</span> ({lv.totalDays} days)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Reason: &ldquo;{lv.reason}&rdquo;</div>
                </div>

                <div className="flex items-center gap-2">
                  {lv.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleReviewLeave(lv.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleReviewLeave(lv.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-medium flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Reviewed by {lv.reviewedBy || 'HR Supervisor'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Overtime Verification */}
      {activeTab === 'OVERTIME' && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Overtime Hours Logged & Awaiting Approval</span>
            <span className="text-slate-400">Current Payroll Cycle: October 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-3 font-semibold">Employee</th>
                  <th className="py-3 px-3 font-semibold">Date</th>
                  <th className="py-3 px-3 font-semibold">OT Hours</th>
                  <th className="py-3 px-3 font-semibold">Hourly Rate</th>
                  <th className="py-3 px-3 font-semibold">Estimated Payout</th>
                  <th className="py-3 px-3 font-semibold">Reason / Work Order</th>
                  <th className="py-3 px-3 font-semibold">Approval Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {overtimeList.map((ot) => (
                  <tr key={ot.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{ot.employee?.firstName} {ot.employee?.lastName}</div>
                      <span className="font-mono text-[10px] text-indigo-300">{ot.employee?.employeeCode}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{ot.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">{ot.overtimeHours} hrs</td>
                    <td className="py-3 px-3 font-mono text-slate-300">₹{ot.hourlyRate}/hr</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">₹{ot.calculatedAmount.toLocaleString()}</td>
                    <td className="py-3 px-3 max-w-[200px] truncate text-slate-400" title={ot.reason}>{ot.reason}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ot.isApproved
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {ot.isApproved ? 'Approved for Payroll' : 'Pending Sign-off'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleOtApproval(ot.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border ${
                          ot.isApproved
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {ot.isApproved ? 'Revoke Approval' : 'Approve Hours'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

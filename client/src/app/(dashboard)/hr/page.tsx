'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  CalendarClock,
  Calculator,
  UserPlus,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Building,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  UserX,
  Briefcase,
  Eye,
} from 'lucide-react';
import { EmployeeItem, DepartmentItem } from '@/types/hr';
import { RoleActionAlerts } from '@/components/RoleActionAlerts';
import { useAuth } from '@/context/AuthContext';
import { SupervisoryBanner } from '@/components/SupervisoryBanner';
import { DepartmentAuditFeed } from '@/components/DepartmentAuditFeed';

const MOCK_DEPARTMENTS: DepartmentItem[] = [
  { id: 'dept-1', name: 'Precision Assembly Lines (Line 1-3)', code: 'PROD', headOfDepartment: 'Sunil Rao', _count: { employees: 64, jobOpenings: 3 } },
  { id: 'dept-2', name: 'Raw Materials & Parts Stock', code: 'WHS', headOfDepartment: 'Rajesh Mehra', _count: { employees: 28, jobOpenings: 2 } },
  { id: 'dept-3', name: 'Quality Assurance & Reliability Bench', code: 'QA', headOfDepartment: 'Dr. Anand Verma', _count: { employees: 18, jobOpenings: 1 } },
  { id: 'dept-4', name: 'Finance & Plant Accounts', code: 'FIN', headOfDepartment: 'Priya Nambiar', _count: { employees: 12, jobOpenings: 1 } },
  { id: 'dept-5', name: 'HR & Industrial Safety', code: 'HR', headOfDepartment: 'Kavita Menon', _count: { employees: 8, jobOpenings: 1 } },
  { id: 'dept-6', name: 'Robotics, Tooling & Machine Upkeep', code: 'ENG', headOfDepartment: 'Anil Kulkarni', _count: { employees: 14, jobOpenings: 2 } },
];

const MOCK_ATTENDANCE_SUMMARY = {
  totalRosterEmployees: 144,
  presentToday: 136,
  onLeave: 5,
  unexpectedAbsence: 3,
  shiftAttendanceRate: 94.4,
  overtimeHoursPending: 86.5,
};

const MOCK_TODAY_ALERTS = [
  {
    id: 'alt-1',
    severity: 'WARNING',
    message: 'High-precision assembly station running at 75% staffing due to 2 unplanned absences.',
    dept: 'Precision Assembly',
    time: '08:45 AM',
  },
  {
    id: 'alt-2',
    severity: 'INFO',
    message: 'Shift B (Evening: 14:00 - 22:30) roster locked with 42 operators assigned.',
    dept: 'Shift Roster',
    time: '11:15 AM',
  },
  {
    id: 'alt-3',
    severity: 'COMPLIANCE',
    message: 'Annual industrial worker safety certification ready for executive sign-off.',
    dept: 'Safety & Compliance',
    time: '09:30 AM',
  },
];

export default function HrWorkforceOverviewPage() {
  const { session } = useAuth();
  const isSuperAdmin = session?.roleId === 'super_admin';

  const [departments] = useState<DepartmentItem[]>(MOCK_DEPARTMENTS);
  const [alerts] = useState(MOCK_TODAY_ALERTS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Super Admin Supervisory Mode Banner */}
      {isSuperAdmin && (
        <SupervisoryBanner
          departmentName="Factory Workers & Shift Rosters"
          departmentCode="HR-001"
          staffRoleTitle="Factory Workers & Shift Rosters Lead"
          onViewAuditFeed={() => {
            const el = document.getElementById('dept-audit-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Factory Workers & Shift Rosters
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Shift A Active (Morning)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Daily worker attendance, shift schedules, department staffing, and monthly salary preparation.
          </p>
        </div>

        {isSuperAdmin ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Eye className="h-4 w-4" />
            <span>Workforce Supervisory Telemetry Active</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Link
              href="/hr/employees"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Employee
            </Link>
            <Link
              href="/hr/payroll-inputs"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-medium text-xs transition-colors shadow-xs"
            >
              <Calculator className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Monthly Salary Inputs
            </Link>
          </div>
        )}
      </div>

      {/* Action Alerts & Interconnected Workflow Notifications Inbox */}
      <RoleActionAlerts roleId="hr" />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Present on Shift</span>
            <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{MOCK_ATTENDANCE_SUMMARY.presentToday}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ {MOCK_ATTENDANCE_SUMMARY.totalRosterEmployees} rostered</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{MOCK_ATTENDANCE_SUMMARY.shiftAttendanceRate}% shift attendance rate</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unplanned Absences</span>
            <div className="h-8 w-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <UserX className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600 dark:text-rose-400 font-mono">{MOCK_ATTENDANCE_SUMMARY.unexpectedAbsence}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">workers absent</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>5 pre-approved leaves</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Overtime (OT)</span>
            <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400 font-mono">{MOCK_ATTENDANCE_SUMMARY.overtimeHoursPending}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">hours to verify</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Awaiting supervisor approval</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Labor & Safety Rules</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">100%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Factory compliant</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Worker safety & insurance verified</span>
          </div>
        </div>
      </div>

      {/* Quick Nav Modules */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Link
          href="/hr/employees"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white">Employee Directory</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Staff profiles & ID records</p>
          </div>
        </Link>

        <Link
          href="/hr/attendance"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CalendarClock className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white">Attendance & Shifts</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Biometric punch & rosters</p>
          </div>
        </Link>

        <Link
          href="/hr/payroll-inputs"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-sm transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calculator className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-white">Monthly Salaries</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Overtime & salary records</p>
          </div>
        </Link>

        <Link
          href="/hr/recruitment"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 shadow-sm transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <UserPlus className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-white">Hiring & Jobs</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Open factory job postings</p>
          </div>
        </Link>

        <Link
          href="/hr/compliance"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-white">Safety & Rules</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Safety & legal audits</p>
          </div>
        </Link>
      </div>

      {/* Main Content: Departmental Staffing Matrix + Real-time HR Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Departmental Staffing Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Department Staffing & Shift Counts</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {departments.length} Divisions Active
            </span>
          </div>

          <div className="p-4 space-y-3.5 flex-1">
            {departments.map((dept) => {
              const count = dept._count?.employees || 0;
              const maxScale = 70;
              const percent = Math.min(100, Math.round((count / maxScale) * 100));

              return (
                <div key={dept.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{dept.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 ml-2">[{dept.code}]</span>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Manager: {dept.headOfDepartment || 'Unassigned'}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">{count}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">staff</span>
                      {dept._count?.jobOpenings ? (
                        <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">{dept._count.jobOpenings} open positions</div>
                      ) : null}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Factory Headcount: 144 registered staff</span>
            <Link href="/hr/employees" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1">
              View employee records &rarr;
            </Link>
          </div>
        </div>

        {/* Live Labor & Safety Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Live Shift & Attendance Notices</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-medium">
              Live Feed
            </span>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full uppercase ${
                      alt.severity === 'WARNING'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        : alt.severity === 'COMPLIANCE'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    {alt.dept}
                  </span>
                  <span className="text-slate-400 font-mono">{alt.time}</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">{alt.message}</p>
              </div>
            ))}

            {/* Quick Shift Handover Status */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800 space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">Shift Schedule Today</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Next Shift: 14:00</span>
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Shift A (06:00 - 14:30):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active (94.4%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Shift B (14:00 - 22:30):</span>
                  <span className="text-slate-500 dark:text-slate-400">Ready & Staffed</span>
                </div>
                <div className="flex justify-between">
                  <span>Shift C (22:00 - 06:30):</span>
                  <span className="text-slate-500 dark:text-slate-400">Night Maintenance Crew</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
            <Link
              href="/leave"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center justify-center gap-1 w-full"
            >
              Open Leave Requests & Approvals &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Super Admin Read-Only Supervisory Audit Stream */}
      {isSuperAdmin && (
        <div id="dept-audit-feed" className="pt-2">
          <DepartmentAuditFeed
            department="hr"
            title="Shift Rosters, Turnstile Punches & Payroll Batch Submission Audit Trail"
          />
        </div>
      )}
    </div>
  );
}

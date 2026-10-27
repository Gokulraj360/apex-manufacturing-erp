'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  ArrowRight,
  Filter,
  Layers,
  Download,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  DepartmentLaborMetricItem,
  DeptPayrollHandoffStatus,
} from '@/types/department-workforce';

const INITIAL_METRICS: DepartmentLaborMetricItem[] = [
  {
    id: 'dlm-1',
    metricCode: 'DLM-2026-10-07-CNC',
    departmentId: 'dept-1',
    department: { id: 'dept-1', name: 'CNC Machining & Milling Division', code: 'DEPT-CNC', headOfDepartment: 'Rajiv Deshmukh' },
    metricDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    totalScheduledWorkers: 29,
    totalPresentWorkers: 28,
    attendanceRatePct: 96.6,
    totalTargetOutput: 500,
    totalActualOutput: 486,
    productionEfficiencyPct: 97.2,
    totalOvertimeHours: 12.0,
    laborUtilizationRatePct: 97.0,
    payrollStatus: 'VERIFIED',
    auditedBy: 'Deepak Varma (HR Director)',
    auditedAt: '2026-10-07 15:00',
  },
  {
    id: 'dlm-2',
    metricCode: 'DLM-2026-10-07-WELD',
    departmentId: 'dept-2',
    department: { id: 'dept-2', name: 'Robotic Welding & Fabrication', code: 'DEPT-WELD', headOfDepartment: 'Sanjay Patwardhan' },
    metricDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    totalScheduledWorkers: 23,
    totalPresentWorkers: 22,
    attendanceRatePct: 95.7,
    totalTargetOutput: 240,
    totalActualOutput: 228,
    productionEfficiencyPct: 95.0,
    totalOvertimeHours: 8.5,
    laborUtilizationRatePct: 95.3,
    payrollStatus: 'VERIFIED',
    auditedBy: 'Deepak Varma (HR Director)',
    auditedAt: '2026-10-07 15:10',
  },
  {
    id: 'dlm-3',
    metricCode: 'DLM-2026-10-07-FRG',
    departmentId: 'dept-3',
    department: { id: 'dept-3', name: 'Heavy Forging & Press Lines', code: 'DEPT-FORGE', headOfDepartment: 'Mahesh Kulkarni' },
    metricDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    totalScheduledWorkers: 32,
    totalPresentWorkers: 30,
    attendanceRatePct: 93.8,
    totalTargetOutput: 360,
    totalActualOutput: 334,
    productionEfficiencyPct: 92.8,
    totalOvertimeHours: 10.0,
    laborUtilizationRatePct: 93.2,
    payrollStatus: 'PENDING_AUDIT',
  },
  {
    id: 'dlm-4',
    metricCode: 'DLM-2026-10-07-ASY',
    departmentId: 'dept-4',
    department: { id: 'dept-4', name: 'Precision Final Assembly Line', code: 'DEPT-ASSY', headOfDepartment: 'Anita Kulkarni' },
    metricDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    totalScheduledWorkers: 26,
    totalPresentWorkers: 26,
    attendanceRatePct: 100.0,
    totalTargetOutput: 420,
    totalActualOutput: 416,
    productionEfficiencyPct: 99.0,
    totalOvertimeHours: 4.0,
    laborUtilizationRatePct: 99.4,
    payrollStatus: 'EXPORTED_TO_PAYROLL',
    auditedBy: 'Meera Iyer (Finance Lead)',
    auditedAt: '2026-10-07 15:30',
  },
  {
    id: 'dlm-5',
    metricCode: 'DLM-2026-10-07-QC',
    departmentId: 'dept-5',
    department: { id: 'dept-5', name: 'Quality Inspection & Metrology', code: 'DEPT-QC', headOfDepartment: 'Praveen Nair' },
    metricDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    totalScheduledWorkers: 14,
    totalPresentWorkers: 13,
    attendanceRatePct: 92.9,
    totalTargetOutput: 180,
    totalActualOutput: 172,
    productionEfficiencyPct: 95.6,
    totalOvertimeHours: 2.0,
    laborUtilizationRatePct: 94.5,
    payrollStatus: 'VERIFIED',
    auditedBy: 'Deepak Varma (HR Director)',
    auditedAt: '2026-10-07 15:15',
  },
];

const SHIFT_DISTRIBUTION = [
  { shift: 'Shift A (Morning 06:00 - 14:30)', workers: 119, attendancePct: 96.0, efficiencyPct: 95.9, color: 'from-teal-500 to-cyan-500' },
  { shift: 'Shift B (Evening 14:30 - 23:00)', workers: 94, attendancePct: 94.5, efficiencyPct: 94.1, color: 'from-cyan-500 to-blue-500' },
  { shift: 'Shift C (Night 23:00 - 06:30)', workers: 45, attendancePct: 91.8, efficiencyPct: 92.4, color: 'from-blue-500 to-indigo-500' },
];

export default function DepartmentLaborAnalyticsPage() {
  const [metrics, setMetrics] = useState<DepartmentLaborMetricItem[]>(INITIAL_METRICS);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedForAudit, setSelectedForAudit] = useState<DepartmentLaborMetricItem | null>(null);
  const [auditStatusChoice, setAuditStatusChoice] = useState<DeptPayrollHandoffStatus>('VERIFIED');
  const [auditorName, setAuditorName] = useState('Deepak Varma (HR Director)');
  const [auditNotes, setAuditNotes] = useState('');

  // Filtering
  const filteredMetrics = metrics.filter((m) => {
    return statusFilter === 'ALL' || m.payrollStatus === statusFilter;
  });

  // KPIs
  const totalOvertime = metrics.reduce((sum, m) => sum + Number(m.totalOvertimeHours), 0);
  const avgUtilization = (
    metrics.reduce((sum, m) => sum + Number(m.laborUtilizationRatePct), 0) / (metrics.length || 1)
  ).toFixed(1);
  const avgEfficiency = (
    metrics.reduce((sum, m) => sum + Number(m.productionEfficiencyPct), 0) / (metrics.length || 1)
  ).toFixed(1);

  // Handle Audit Submit
  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForAudit) return;

    setMetrics((prev) =>
      prev.map((m) =>
        m.id === selectedForAudit.id
          ? {
              ...m,
              payrollStatus: auditStatusChoice,
              auditedBy: auditorName,
              auditedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : m
      )
    );

    setSelectedForAudit(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Workforce Intelligence
            </span>
            <span className="text-xs text-slate-500">Labor Utilization & Payroll Integration Handoff</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Department Labor Analytics & Payroll Handoff
          </h1>
          <p className="text-sm text-slate-400">
            Audit departmental labor utilization rates, production efficiencies, overtime logs, and approve seamless data handoffs for HR and payroll processing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMetrics((prev) =>
                prev.map((m) => ({
                  ...m,
                  payrollStatus: 'EXPORTED_TO_PAYROLL',
                  auditedBy: 'Deepak Varma (HR Director)',
                  auditedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                }))
              );
            }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-teal-900/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export All to Payroll
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Labor Utilization Rate</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{avgUtilization}%</div>
            <div className="text-xs text-emerald-400/80 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Balanced staffing across cells
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Production Output Efficiency</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{avgEfficiency}%</div>
            <div className="text-xs text-slate-400 mt-1">Shift actual vs target quotas</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Audited Overtime Hours</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{totalOvertime}h OT</div>
            <div className="text-xs text-amber-400/80 mt-1">Ready for statutory payroll calculation</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Payroll Integration Status</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">Ready</div>
            <div className="text-xs text-emerald-400 mt-1">HR statutory schema synced</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SHIFT UTILIZATION DISTRIBUTION */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" />
              Shift-Wise Workforce Distribution & Attendance Velocity
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Attendance and production yield comparison across 24-hour plant operating windows.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {SHIFT_DISTRIBUTION.map((item, idx) => (
            <div key={idx} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{item.shift}</span>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-slate-400">{item.workers} Operators</span>
                  <span className="text-teal-400 font-semibold">{item.attendancePct}% Attendance</span>
                  <span className="text-cyan-400 font-bold">{item.efficiencyPct}% Yield</span>
                </div>
              </div>
              <div className="w-full bg-[#090d16] h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all`}
                  style={{ width: `${item.efficiencyPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN TABLE: DEPARTMENT LABOR METRICS & PAYROLL HANDOFF */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              Departmental Labor Metrics & Audit Signoff Queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Verification matrix for HR payroll input dispatch.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_AUDIT">Pending Audit</option>
              <option value="VERIFIED">Verified</option>
              <option value="EXPORTED_TO_PAYROLL">Exported to Payroll</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="p-3.5">Metric # & Date</th>
                <th className="p-3.5">Department & Lead</th>
                <th className="p-3.5">Staffing (Pres / Sched)</th>
                <th className="p-3.5">Attendance</th>
                <th className="p-3.5">Output (Act / Target)</th>
                <th className="p-3.5">Production Yield</th>
                <th className="p-3.5">Overtime (OT)</th>
                <th className="p-3.5">Labor Utilization</th>
                <th className="p-3.5">Payroll Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredMetrics.map((m) => {
                const statusColor =
                  m.payrollStatus === 'EXPORTED_TO_PAYROLL'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : m.payrollStatus === 'VERIFIED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                return (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white">{m.metricCode}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {m.metricDate} • {m.shiftCode}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{m.department.name}</div>
                      <div className="text-slate-400 text-[11px]">Head: {m.department.headOfDepartment}</div>
                    </td>
                    <td className="p-3.5 font-mono">
                      <span className="text-white font-bold">{m.totalPresentWorkers}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-slate-400">{m.totalScheduledWorkers} Staff</span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      {m.attendanceRatePct}%
                    </td>
                    <td className="p-3.5 font-mono">
                      <span className="text-white font-bold">{m.totalActualOutput}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-slate-400">{m.totalTargetOutput} PCS</span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-cyan-400">
                      {m.productionEfficiencyPct}%
                    </td>
                    <td className="p-3.5 font-mono font-bold text-amber-400">
                      {m.totalOvertimeHours}h
                    </td>
                    <td className="p-3.5 font-mono font-bold text-teal-300 text-sm">
                      {m.laborUtilizationRatePct}%
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor}`}>
                        {m.payrollStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedForAudit(m);
                          setAuditStatusChoice(m.payrollStatus);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                      >
                        Audit / Sign
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: AUDIT PAYROLL HANDOFF */}
      {selectedForAudit && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-teal-400">{selectedForAudit.metricCode}</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Audit Department Payroll Handoff
                </h3>
              </div>
              <button
                onClick={() => setSelectedForAudit(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuditSubmit} className="space-y-4 text-xs">
              <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono">
                <div className="text-white font-bold">{selectedForAudit.department.name}</div>
                <div className="text-slate-400 flex justify-between">
                  <span>Attendance: {selectedForAudit.attendanceRatePct}%</span>
                  <span>Yield: {selectedForAudit.productionEfficiencyPct}%</span>
                </div>
                <div className="text-slate-400 flex justify-between">
                  <span>Overtime: {selectedForAudit.totalOvertimeHours}h</span>
                  <span className="text-teal-300 font-bold">Utilization: {selectedForAudit.laborUtilizationRatePct}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Handoff Authorization Status *</label>
                <select
                  value={auditStatusChoice}
                  onChange={(e) => setAuditStatusChoice(e.target.value as DeptPayrollHandoffStatus)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="PENDING_AUDIT">Pending Audit</option>
                  <option value="VERIFIED">Verified & Approved for HR</option>
                  <option value="EXPORTED_TO_PAYROLL">Exported to Payroll Engine</option>
                  <option value="RECONCILED">Reconciled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Auditing Officer *</label>
                <input
                  type="text"
                  required
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Audit Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Overtime approved by department head; punch anomalies reconciled."
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedForAudit(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-md shadow-teal-900/20"
                >
                  Confirm Handoff Signoff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

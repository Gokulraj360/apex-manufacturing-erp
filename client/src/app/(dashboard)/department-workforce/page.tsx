'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Layers,
  Clock,
  Target,
  ShieldCheck,
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Factory,
  Building2,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  DepartmentWorkforceOverviewMetrics,
  DepartmentWorkstationAssignmentItem,
  DepartmentTargetOutputItem,
  DepartmentLaborMetricItem,
} from '@/types/department-workforce';

const MOCK_METRICS: DepartmentWorkforceOverviewMetrics = {
  activeDeployments: 48,
  totalActiveWorkers: 124,
  todayPresentWorkers: 119,
  todayAttendanceRate: 96.0,
  todayTotalOvertimeHours: 36.5,
  averageProductionEfficiencyPct: 94.8,
  payrollHandoffReady: true,
};

const MOCK_DEPARTMENT_SUMMARIES = [
  {
    code: 'DEPT-CNC',
    name: 'CNC Machining & Milling Division',
    head: 'Rajiv Deshmukh',
    activeOperators: 28,
    stationCount: 14,
    attendanceRate: 96.5,
    efficiencyRate: 95.2,
    overtimeHours: 12.0,
    topMachine: 'DMG MORI 5-Axis (AST-CNC-001)',
    status: 'OPTIMAL',
  },
  {
    code: 'DEPT-WELD',
    name: 'Robotic Welding & Fabrication',
    head: 'Sanjay Patwardhan',
    activeOperators: 22,
    stationCount: 10,
    attendanceRate: 95.5,
    efficiencyRate: 93.8,
    overtimeHours: 8.5,
    topMachine: 'KUKA Robotic MIG Cell (AST-WLD-004)',
    status: 'OPTIMAL',
  },
  {
    code: 'DEPT-FORGE',
    name: 'Heavy Forging & Press Lines',
    head: 'Mahesh Kulkarni',
    activeOperators: 30,
    stationCount: 8,
    attendanceRate: 93.3,
    efficiencyRate: 92.1,
    overtimeHours: 10.0,
    topMachine: 'Hydraulic Press 500T (AST-PRS-002)',
    status: 'ATTENTION',
  },
  {
    code: 'DEPT-ASSY',
    name: 'Precision Final Assembly Line',
    head: 'Anita Kulkarni',
    activeOperators: 26,
    stationCount: 12,
    attendanceRate: 100.0,
    efficiencyRate: 97.4,
    overtimeHours: 4.0,
    topMachine: 'Torque Assembly Cell 3 (AST-ASY-006)',
    status: 'OPTIMAL',
  },
  {
    code: 'DEPT-QC',
    name: 'Quality Inspection & Metrology',
    head: 'Praveen Nair',
    activeOperators: 13,
    stationCount: 4,
    attendanceRate: 92.3,
    efficiencyRate: 96.0,
    overtimeHours: 2.0,
    topMachine: 'Zeiss CMM Machine (AST-CMM-001)',
    status: 'OPTIMAL',
  },
];

const MOCK_RECENT_DEPLOYMENTS: DepartmentWorkstationAssignmentItem[] = [
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
    stationIdentifier: 'WS-CNC-04 (DMG MORI 5-Axis)',
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
    supervisorRemarks: 'Aerospace Ti-6Al-4V impeller casing run. Zero tolerance deviation.',
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
    stationIdentifier: 'WELD-CELL-02 (KUKA MIG)',
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
    supervisorRemarks: 'Automotive subframe continuous MIG welding setup.',
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
    stationIdentifier: 'LINE-FORGE-01 (500T Press)',
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
    supervisorRemarks: 'Axle I-beam closed-die forging run.',
  },
];

const MOCK_TARGET_OUTPUTS: DepartmentTargetOutputItem[] = [
  {
    id: 'dto-1',
    targetCode: 'DTO-2026-0391',
    departmentId: 'dept-1',
    department: { id: 'dept-1', name: 'CNC Machining', code: 'DEPT-CNC' },
    employeeId: 'emp-1',
    employee: {
      id: 'emp-1',
      employeeCode: 'EMP-CNC-104',
      firstName: 'Ramesh',
      lastName: 'Chavan',
    },
    workstationOrLine: 'WS-CNC-04',
    productSku: 'GEAR-TRANSMISSION-120',
    productName: 'Hardened Alloy Steel Transmission Gearbox',
    shiftDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    targetQuantity: 120,
    actualQuantity: 118,
    rejectedQuantity: 2,
    reworkQuantity: 1,
    efficiencyRatePct: 96.7,
    downtimeMinutes: 15,
    downtimeReason: 'Tool insert change & recalibration',
    supervisorSignoff: 'Rajiv Deshmukh',
  },
  {
    id: 'dto-2',
    targetCode: 'DTO-2026-0392',
    departmentId: 'dept-2',
    department: { id: 'dept-2', name: 'Robotic Welding', code: 'DEPT-WELD' },
    employeeId: 'emp-2',
    employee: {
      id: 'emp-2',
      employeeCode: 'EMP-WLD-209',
      firstName: 'Ganesh',
      lastName: 'Shinde',
    },
    workstationOrLine: 'WELD-CELL-02',
    productSku: 'SUBFRAME-EV-04',
    productName: 'Heavy EV Tubular Welded Chassis Subframe',
    shiftDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    targetQuantity: 40,
    actualQuantity: 39,
    rejectedQuantity: 1,
    reworkQuantity: 0,
    efficiencyRatePct: 95.0,
    downtimeMinutes: 0,
    supervisorSignoff: 'Sanjay Patwardhan',
  },
];

export default function DepartmentWorkforcePage() {
  const [metrics] = useState<DepartmentWorkforceOverviewMetrics>(MOCK_METRICS);
  const [departments] = useState(MOCK_DEPARTMENT_SUMMARIES);
  const [deployments] = useState(MOCK_RECENT_DEPLOYMENTS);
  const [outputs] = useState(MOCK_TARGET_OUTPUTS);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Department Operations
            </span>
            <span className="text-xs text-slate-500">Shop Floor Worker Deployment Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Department-Wise Worker Management Hub
          </h1>
          <p className="text-sm text-slate-400">
            Allocate workers to specific workstations, machines, and lines; track daily check-ins, overtime, target output yield, safety certs, and HR/payroll handoffs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/department-workforce/deployments"
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-teal-900/20"
          >
            <Plus className="w-4 h-4" />
            Deploy Worker
          </Link>
          <Link
            href="/department-workforce/attendance"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors border border-slate-700"
          >
            <Clock className="w-4 h-4 text-teal-400" />
            Shift Check-Ins
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Active Workstation Deployments</div>
            <div className="text-2xl font-bold text-white mt-1">{metrics.activeDeployments} Stations</div>
            <div className="text-xs text-teal-400 flex items-center gap-1 mt-1">
              <Layers className="w-3.5 h-3.5" />
              100% Machine Safety Certified
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Today's Present Attendance</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {metrics.todayAttendanceRate}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {metrics.todayPresentWorkers} / {metrics.totalActiveWorkers} Shop Floor Workers
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Target Production Efficiency</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">
              {metrics.averageProductionEfficiencyPct}%
            </div>
            <div className="text-xs text-cyan-400/80 mt-1">Daily shift output quota</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Logged Overtime & Payroll Handoff</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{metrics.todayTotalOvertimeHours}h OT</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              HR & Payroll Ready
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { title: 'Workstation Deployments', desc: 'Station, line & machine matrix', href: '/department-workforce/deployments', icon: Layers, color: 'text-teal-400' },
          { title: 'Attendance & Overtime', desc: 'Biometric logs & approvals', href: '/department-workforce/attendance', icon: Clock, color: 'text-emerald-400' },
          { title: 'Target vs Actual Yield', desc: 'Piece-rate & efficiency rates', href: '/department-workforce/outputs', icon: Target, color: 'text-cyan-400' },
          { title: 'Machine Safety Certs', desc: '5-Axis & press safety checks', href: '/department-workforce/certifications', icon: ShieldCheck, color: 'text-purple-400' },
          { title: 'Labor Metrics & Payroll', desc: 'Utilization & audit export', href: '/department-workforce/analytics', icon: BarChart3, color: 'text-pink-400' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="bg-[#0d1322] border border-slate-800 hover:border-teal-500/50 p-3.5 rounded-xl transition-all shadow-sm group space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${item.color}`} />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* DEPARTMENT PERFORMANCE SUMMARY CARDS */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              Department-Wise Workforce Efficiency & Output Indicators
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live shop floor staffing, attendance conformity, machine specialization, and overtime loads.
            </p>
          </div>
          <Link
            href="/department-workforce/analytics"
            className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
          >
            Audit Reports <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {departments.map((dept) => (
            <div
              key={dept.code}
              className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 space-y-3 hover:border-teal-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                    {dept.code}
                  </span>
                  <span
                    className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                      dept.status === 'OPTIMAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {dept.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-xs line-clamp-1">{dept.name}</h3>
                <div className="text-[11px] text-slate-400">Head: {dept.head}</div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Staffing:</span>
                  <span className="text-white font-mono font-medium">{dept.activeOperators} Workers ({dept.stationCount} Stns)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Attendance:</span>
                  <span className="text-emerald-400 font-mono font-bold">{dept.attendanceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Yield Eff.:</span>
                  <span className="text-cyan-400 font-mono font-bold">{dept.efficiencyRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Overtime:</span>
                  <span className="text-amber-400 font-mono font-medium">{dept.overtimeHours}h</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 bg-[#0d1322] p-2 rounded-lg border border-slate-800 line-clamp-1">
                Asset: {dept.topMachine}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMN SECTION: ACTIVE DEPLOYMENTS & TARGET OUTPUT PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Deployments */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                Live Workstation & Machine Deployments
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Assigned operators, machine models, and roles.</p>
            </div>
            <Link
              href="/department-workforce/deployments"
              className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {deployments.map((d) => (
              <div
                key={d.id}
                className="bg-[#090d16] border border-slate-800 p-3.5 rounded-xl space-y-2 hover:border-teal-500/30 transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-teal-400 font-bold">{d.assignmentCode}</span>
                    <span className="mx-1 text-slate-500">•</span>
                    <span className="text-slate-300 font-medium">{d.stationIdentifier}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {d.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">
                      {d.employee.firstName} {d.employee.lastName} ({d.employee.employeeCode})
                    </div>
                    <div className="text-slate-400 text-[11px]">{d.employee.designation?.title}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-semibold">
                      {d.roleOnStation.replace(/_/g, ' ')}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{d.shiftCode}</div>
                  </div>
                </div>

                {d.supervisorRemarks && (
                  <p className="text-slate-400 text-[11px] italic bg-[#0d1322] p-2 rounded-lg border border-slate-800">
                    "{d.supervisorRemarks}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Target vs Actual Outputs Progress */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Shift Target Output vs Actual Production
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time yields, piece counts, and scrap rates.</p>
            </div>
            <Link
              href="/department-workforce/outputs"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              Output Log <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {outputs.map((o) => (
              <div
                key={o.id}
                className="bg-[#090d16] border border-slate-800 p-3.5 rounded-xl space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white truncate max-w-[280px]">
                    {o.productName}
                  </div>
                  <span className="font-mono text-cyan-400 font-bold text-sm">
                    {o.efficiencyRatePct}% Yield
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>
                      Output: <strong className="text-white">{o.actualQuantity}</strong> / {o.targetQuantity} target PCS
                    </span>
                    <span>Rejects: <strong className="text-red-400">{o.rejectedQuantity}</strong></span>
                  </div>
                  <div className="w-full bg-[#0d1322] h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, o.efficiencyRatePct)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>
                    Operator: <strong className="text-slate-200">{o.employee.firstName} {o.employee.lastName}</strong> ({o.workstationOrLine})
                  </span>
                  <span>Signoff: <strong className="text-emerald-400">{o.supervisorSignoff}</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-xs text-teal-300 flex items-center justify-between">
            <span>Seamless HR & Payroll Integration Active</span>
            <Link
              href="/department-workforce/analytics"
              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium"
            >
              Export Payroll
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

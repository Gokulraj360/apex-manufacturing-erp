'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  X,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles,
  Check,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  DepartmentTargetOutputItem,
} from '@/types/department-workforce';

const INITIAL_OUTPUTS: DepartmentTargetOutputItem[] = [
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
    workstationOrLine: 'WS-CNC-04 (5-Axis Mill)',
    productSku: 'GEAR-TRANSMISSION-120',
    productName: 'Hardened Alloy Steel Transmission Gearbox 120kW',
    shiftDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    targetQuantity: 120,
    actualQuantity: 118,
    rejectedQuantity: 2,
    reworkQuantity: 1,
    efficiencyRatePct: 96.7,
    downtimeMinutes: 15,
    downtimeReason: 'Tool insert wear change & touch-probe recalibration',
    supervisorSignoff: 'Rajiv Deshmukh',
    createdAt: '2026-10-07T14:00:00Z',
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
    workstationOrLine: 'WELD-CELL-02 (KUKA MIG)',
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
    createdAt: '2026-10-07T14:15:00Z',
  },
  {
    id: 'dto-3',
    targetCode: 'DTO-2026-0393',
    departmentId: 'dept-3',
    department: { id: 'dept-3', name: 'Heavy Forging', code: 'DEPT-FORGE' },
    employeeId: 'emp-3',
    employee: {
      id: 'emp-3',
      employeeCode: 'EMP-FRG-312',
      firstName: 'Sunil',
      lastName: 'Pawar',
    },
    workstationOrLine: 'LINE-FORGE-01 (500T Press)',
    productSku: 'AXLE-BEAM-MICROALLOY',
    productName: 'Forged Micro-Alloy Front Axle I-Beam',
    shiftDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    targetQuantity: 60,
    actualQuantity: 58,
    rejectedQuantity: 2,
    reworkQuantity: 2,
    efficiencyRatePct: 93.3,
    downtimeMinutes: 20,
    downtimeReason: 'Hydraulic accumulator pressure top-up',
    supervisorSignoff: 'Mahesh Kulkarni',
    createdAt: '2026-10-07T14:20:00Z',
  },
  {
    id: 'dto-4',
    targetCode: 'DTO-2026-0394',
    departmentId: 'dept-4',
    department: { id: 'dept-4', name: 'Precision Assembly', code: 'DEPT-ASSY' },
    employeeId: 'emp-4',
    employee: {
      id: 'emp-4',
      employeeCode: 'EMP-ASY-418',
      firstName: 'Pooja',
      lastName: 'Deshmukh',
    },
    workstationOrLine: 'LINE-ASSEMBLY-03',
    productSku: 'PLANETARY-CARR-77',
    productName: 'Planetary Gear Carrier Sub-Assembly',
    shiftDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    targetQuantity: 80,
    actualQuantity: 82,
    rejectedQuantity: 0,
    reworkQuantity: 0,
    efficiencyRatePct: 102.5,
    downtimeMinutes: 0,
    supervisorSignoff: 'Anita Kulkarni',
    createdAt: '2026-10-07T14:25:00Z',
  },
  {
    id: 'dto-5',
    targetCode: 'DTO-2026-0395',
    departmentId: 'dept-5',
    department: { id: 'dept-5', name: 'Quality Metrology', code: 'DEPT-QC' },
    employeeId: 'emp-5',
    employee: {
      id: 'emp-5',
      employeeCode: 'EMP-QC-502',
      firstName: 'Siddharth',
      lastName: 'Joshi',
    },
    workstationOrLine: 'WS-METROLOGY-01',
    productSku: 'CMM-INSP-LOT412',
    productName: 'CMM Dimensional Inspection & Report Lot #412',
    shiftDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    targetQuantity: 30,
    actualQuantity: 29,
    rejectedQuantity: 1,
    reworkQuantity: 0,
    efficiencyRatePct: 93.3,
    downtimeMinutes: 10,
    downtimeReason: 'Laser probe recalibration with master sphere',
    supervisorSignoff: undefined,
    createdAt: '2026-10-07T14:30:00Z',
  },
];

export default function TargetVsActualOutputPage() {
  const [outputs, setOutputs] = useState<DepartmentTargetOutputItem[]>(INITIAL_OUTPUTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');

  // Modals
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedForSignoff, setSelectedForSignoff] = useState<DepartmentTargetOutputItem | null>(null);
  const [signoffSupervisor, setSignoffSupervisor] = useState('Praveen Nair (QC Lead)');

  // Form State
  const [outputForm, setOutputForm] = useState({
    employeeName: '',
    employeeCode: '',
    departmentName: 'CNC Machining & Milling Division',
    departmentCode: 'DEPT-CNC',
    workstationOrLine: 'WS-CNC-04',
    productSku: 'GEAR-TRANSMISSION-120',
    productName: 'Hardened Alloy Steel Transmission Gearbox',
    shiftDate: '2026-10-07',
    shiftCode: 'SHIFT_A',
    targetQuantity: 100,
    actualQuantity: 96,
    rejectedQuantity: 2,
    reworkQuantity: 1,
    downtimeMinutes: 0,
    downtimeReason: '',
    supervisorSignoff: 'Rajiv Deshmukh',
  });

  // Filtering
  const filteredOutputs = outputs.filter((o) => {
    const matchesSearch =
      o.targetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.workstationOrLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.employee.lastName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || o.department.code === departmentFilter;
    const matchesShift = shiftFilter === 'ALL' || o.shiftCode === shiftFilter;

    return matchesSearch && matchesDept && matchesShift;
  });

  // KPI Metrics
  const totalActual = outputs.reduce((sum, o) => sum + o.actualQuantity, 0);
  const totalTarget = outputs.reduce((sum, o) => sum + o.targetQuantity, 0);
  const totalRejects = outputs.reduce((sum, o) => sum + o.rejectedQuantity, 0);
  const totalDowntime = outputs.reduce((sum, o) => sum + o.downtimeMinutes, 0);
  const overallYield = totalTarget > 0 ? (((totalActual - totalRejects) / totalTarget) * 100).toFixed(1) : '95.0';

  // Handle Record Output Submit
  const handleRecordOutput = (e: React.FormEvent) => {
    e.preventDefault();
    const netGood = Math.max(0, outputForm.actualQuantity - outputForm.rejectedQuantity);
    const eff = outputForm.targetQuantity > 0
      ? Number(((netGood / outputForm.targetQuantity) * 100).toFixed(1))
      : 0;

    const newRecord: DepartmentTargetOutputItem = {
      id: `dto-${Date.now()}`,
      targetCode: `DTO-2026-0${Math.floor(400 + Math.random() * 500)}`,
      departmentId: `dept-${outputForm.departmentCode}`,
      department: {
        id: `dept-${outputForm.departmentCode}`,
        name: outputForm.departmentName,
        code: outputForm.departmentCode,
      },
      employeeId: `emp-${Date.now()}`,
      employee: {
        id: `emp-${Date.now()}`,
        employeeCode: outputForm.employeeCode || 'EMP-OP-01',
        firstName: outputForm.employeeName.split(' ')[0] || 'Operator',
        lastName: outputForm.employeeName.split(' ')[1] || 'Staff',
      },
      workstationOrLine: outputForm.workstationOrLine,
      productSku: outputForm.productSku,
      productName: outputForm.productName,
      shiftDate: outputForm.shiftDate,
      shiftCode: outputForm.shiftCode,
      targetQuantity: Number(outputForm.targetQuantity),
      actualQuantity: Number(outputForm.actualQuantity),
      rejectedQuantity: Number(outputForm.rejectedQuantity),
      reworkQuantity: Number(outputForm.reworkQuantity),
      efficiencyRatePct: eff,
      downtimeMinutes: Number(outputForm.downtimeMinutes),
      downtimeReason: outputForm.downtimeReason || undefined,
      supervisorSignoff: outputForm.supervisorSignoff || undefined,
      createdAt: new Date().toISOString(),
    };

    setOutputs([newRecord, ...outputs]);
    setShowRecordModal(false);
  };

  // Handle Signoff Submit
  const handleSignoff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForSignoff) return;

    setOutputs((prev) =>
      prev.map((o) =>
        o.id === selectedForSignoff.id
          ? {
              ...o,
              supervisorSignoff: signoffSupervisor,
            }
          : o
      )
    );

    setSelectedForSignoff(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Piece-Rate & Output Tracking
            </span>
            <span className="text-xs text-slate-500">Real-Time Shop Floor Yield Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Department Target vs. Actual Output Tracking
          </h1>
          <p className="text-sm text-slate-400">
            Compare shift target production quotas against net good output, scrap rejects, rework, and equipment downtime per worker station.
          </p>
        </div>

        <button
          onClick={() => setShowRecordModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-cyan-900/20"
        >
          <Plus className="w-4 h-4" />
          Record Station Output
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Actual Shift Units Produced</div>
            <div className="text-2xl font-bold text-white mt-1">{totalActual.toLocaleString()} PCS</div>
            <div className="text-xs text-slate-400 mt-1">Target: {totalTarget.toLocaleString()} PCS</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Net Output Efficiency Yield</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{overallYield}%</div>
            <div className="text-xs text-emerald-400/90 mt-1">Net good pieces produced</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Scrap / Rejected Units</div>
            <div className="text-2xl font-bold text-red-400 mt-1">{totalRejects} PCS</div>
            <div className="text-xs text-slate-400 mt-1">
              {((totalRejects / (totalActual || 1)) * 100).toFixed(1)}% Scrap Rate
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Logged Machine Downtime</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{totalDowntime} mins</div>
            <div className="text-xs text-slate-400 mt-1">Tooling changes & calibration</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search code, product SKU, worker, or station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Dept:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
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
              className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Shifts</option>
              <option value="SHIFT_A">Shift A</option>
              <option value="SHIFT_B">Shift B</option>
              <option value="SHIFT_C">Shift C</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outputs Comparison Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="p-3.5">Log # & Date</th>
                <th className="p-3.5">Worker & Station</th>
                <th className="p-3.5">Component / Product SKU</th>
                <th className="p-3.5">Target vs Actual</th>
                <th className="p-3.5">Scrap / Rework</th>
                <th className="p-3.5">Yield Efficiency</th>
                <th className="p-3.5">Downtime</th>
                <th className="p-3.5">Supervisor Signoff</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredOutputs.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-white">{o.targetCode}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {o.shiftDate} • {o.shiftCode}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">
                      {o.employee.firstName} {o.employee.lastName}
                    </div>
                    <div className="text-cyan-400 font-mono text-[11px] mt-0.5">{o.workstationOrLine}</div>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <div className="font-semibold text-slate-200 line-clamp-1">{o.productName}</div>
                    <div className="font-mono text-purple-400 text-[11px]">SKU: {o.productSku}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono">
                      <span className="text-white font-bold text-sm">{o.actualQuantity}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-slate-400">{o.targetQuantity} PCS</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="text-red-400 font-bold">{o.rejectedQuantity} Rej</span>
                    {o.reworkQuantity > 0 && (
                      <span className="text-amber-400 ml-1.5 font-normal">({o.reworkQuantity} Rew)</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-1 w-28">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="font-bold text-emerald-400">{o.efficiencyRatePct}%</span>
                      </div>
                      <div className="w-full bg-[#090d16] h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, o.efficiencyRatePct)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono">
                    {o.downtimeMinutes > 0 ? (
                      <div>
                        <span className="text-amber-400 font-bold">{o.downtimeMinutes}m</span>
                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{o.downtimeReason}</div>
                      </div>
                    ) : (
                      <span className="text-emerald-400 text-[11px]">0 min</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {o.supervisorSignoff ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Check className="w-3 h-3" />
                        {o.supervisorSignoff}
                      </span>
                    ) : (
                      <span className="text-amber-400 text-[10px] italic">Pending Signoff</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {!o.supervisorSignoff ? (
                      <button
                        onClick={() => setSelectedForSignoff(o)}
                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Sign Off
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: RECORD TARGET OUTPUT */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Record Daily Workstation Production Output
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Log piece-rate actual outputs, scrap, rework, and equipment downtime metrics.
                </p>
              </div>
              <button
                onClick={() => setShowRecordModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordOutput} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Worker Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chavan"
                    value={outputForm.employeeName}
                    onChange={(e) => setOutputForm({ ...outputForm, employeeName: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Workstation / Line *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WS-CNC-04"
                    value={outputForm.workstationOrLine}
                    onChange={(e) => setOutputForm({ ...outputForm, workstationOrLine: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Product / Component SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GEAR-TRANSMISSION-120"
                    value={outputForm.productSku}
                    onChange={(e) => setOutputForm({ ...outputForm, productSku: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Product Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Planetary Gearbox Housing"
                    value={outputForm.productName}
                    onChange={(e) => setOutputForm({ ...outputForm, productName: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Shift Target Quantity *</label>
                  <input
                    type="number"
                    required
                    value={outputForm.targetQuantity}
                    onChange={(e) => setOutputForm({ ...outputForm, targetQuantity: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Actual Produced Quantity *</label>
                  <input
                    type="number"
                    required
                    value={outputForm.actualQuantity}
                    onChange={(e) => setOutputForm({ ...outputForm, actualQuantity: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Rejected (Scrap) Qty</label>
                  <input
                    type="number"
                    value={outputForm.rejectedQuantity}
                    onChange={(e) => setOutputForm({ ...outputForm, rejectedQuantity: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-red-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Rework Qty</label>
                  <input
                    type="number"
                    value={outputForm.reworkQuantity}
                    onChange={(e) => setOutputForm({ ...outputForm, reworkQuantity: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Downtime Minutes</label>
                  <input
                    type="number"
                    value={outputForm.downtimeMinutes}
                    onChange={(e) => setOutputForm({ ...outputForm, downtimeMinutes: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Supervisor Signoff Name</label>
                  <input
                    type="text"
                    value={outputForm.supervisorSignoff}
                    onChange={(e) => setOutputForm({ ...outputForm, supervisorSignoff: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Downtime Reason / Cause Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. CNC tool wear, blank feed delay, hydraulic oil cooling pause..."
                    value={outputForm.downtimeReason}
                    onChange={(e) => setOutputForm({ ...outputForm, downtimeReason: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium shadow-md shadow-cyan-900/20"
                >
                  Save Output Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SUPERVISOR SIGNOFF */}
      {selectedForSignoff && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-cyan-400">{selectedForSignoff.targetCode}</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Supervisor Production Signoff
                </h3>
              </div>
              <button
                onClick={() => setSelectedForSignoff(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSignoff} className="space-y-3.5 text-xs">
              <div className="bg-[#090d16] p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="font-semibold text-white">{selectedForSignoff.productName}</div>
                <div className="text-slate-400">
                  Produced: {selectedForSignoff.actualQuantity} / {selectedForSignoff.targetQuantity} PCS ({selectedForSignoff.efficiencyRatePct}% Yield)
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Authorizing Supervisor Name *</label>
                <input
                  type="text"
                  required
                  value={signoffSupervisor}
                  onChange={(e) => setSignoffSupervisor(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedForSignoff(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-md shadow-emerald-900/20"
                >
                  Confirm Signoff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

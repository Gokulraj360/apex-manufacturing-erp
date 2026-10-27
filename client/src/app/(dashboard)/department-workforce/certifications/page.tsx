'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  X,
  Award,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldAlert,
  Clock,
  Check,
} from 'lucide-react';
import {
  MachineCertificationCheckItem,
} from '@/types/department-workforce';

const INITIAL_CERTIFICATIONS: MachineCertificationCheckItem[] = [
  {
    id: 'mcc-1',
    checkCode: 'MCC-2026-0511',
    employeeId: 'emp-1',
    employee: {
      id: 'emp-1',
      employeeCode: 'EMP-CNC-104',
      firstName: 'Ramesh',
      lastName: 'Chavan',
      department: { id: 'dept-1', name: 'CNC Machining', code: 'DEPT-CNC' },
      designation: { title: 'Senior CNC Machinist' },
    },
    machineAssetId: 'ast-1',
    machineAsset: {
      id: 'ast-1',
      assetTag: 'AST-CNC-001',
      assetName: 'DMG MORI DMU 50 5-Axis Mill',
      category: 'CNC_MACHINING',
      modelNumber: 'DMU 50 3rd Gen',
    },
    machineModel: 'DMG MORI 5-Axis Mill DMU 50',
    certificationType: '5-Axis High-Precision CNC Machining & Aerospace Protocols',
    certifyingBody: 'DMG MORI Academy / ISO 45001 Safety Cell',
    certificationNumber: 'CERT-DMG-2025-9912',
    issueDate: '2025-04-10',
    expiryDate: '2027-04-09',
    isValid: true,
    safetyScore: 98.5,
    verifiedBy: 'Sanjay Deshpande (Safety Director)',
    verifiedAt: '2026-10-01',
  },
  {
    id: 'mcc-2',
    checkCode: 'MCC-2026-0512',
    employeeId: 'emp-2',
    employee: {
      id: 'emp-2',
      employeeCode: 'EMP-WLD-209',
      firstName: 'Ganesh',
      lastName: 'Shinde',
      department: { id: 'dept-2', name: 'Robotic Welding', code: 'DEPT-WELD' },
      designation: { title: 'Robotic Weld Specialist' },
    },
    machineAssetId: 'ast-2',
    machineAsset: {
      id: 'ast-2',
      assetTag: 'AST-WLD-004',
      assetName: 'KUKA 6-Axis Robotic Welding Station',
      category: 'ROBOTIC_AUTOMATION',
      modelNumber: 'KR CYBERTECH nano',
    },
    machineModel: 'KUKA 6-Axis Robotic MIG Welding Station',
    certificationType: 'Robotic Arc Welding Operator & Automated Cell Safety Level 3',
    certifyingBody: 'Indian Institute of Welding (IIW) / KUKA Robotics',
    certificationNumber: 'CERT-IIW-2024-4410',
    issueDate: '2024-11-15',
    expiryDate: '2026-11-14',
    isValid: true,
    safetyScore: 96.0,
    verifiedBy: 'Sanjay Deshpande (Safety Director)',
    verifiedAt: '2026-09-20',
  },
  {
    id: 'mcc-3',
    checkCode: 'MCC-2026-0513',
    employeeId: 'emp-3',
    employee: {
      id: 'emp-3',
      employeeCode: 'EMP-FRG-312',
      firstName: 'Sunil',
      lastName: 'Pawar',
      department: { id: 'dept-3', name: 'Heavy Forging', code: 'DEPT-FORGE' },
      designation: { title: 'Forging Line Lead' },
    },
    machineAssetId: 'ast-3',
    machineAsset: {
      id: 'ast-3',
      assetTag: 'AST-PRS-002',
      assetName: '500T Hydraulic Hot Forging Press',
      category: 'HYDRAULIC_PRESS',
      modelNumber: 'HP-500-HD',
    },
    machineModel: '500T Heavy Hydraulic Hot Forging Press',
    certificationType: 'Heavy Tonnage Hydraulic Press Safety & Thermal Barrier Control',
    certifyingBody: 'National Safety Council of India (NSCI)',
    certificationNumber: 'CERT-NSC-2025-7721',
    issueDate: '2025-01-20',
    expiryDate: '2027-01-19',
    isValid: true,
    safetyScore: 99.0,
    verifiedBy: 'Mahesh Kulkarni (Forging Head)',
    verifiedAt: '2026-08-15',
  },
  {
    id: 'mcc-4',
    checkCode: 'MCC-2026-0514',
    employeeId: 'emp-5',
    employee: {
      id: 'emp-5',
      employeeCode: 'EMP-QC-502',
      firstName: 'Siddharth',
      lastName: 'Joshi',
      department: { id: 'dept-5', name: 'Quality Metrology', code: 'DEPT-QC' },
      designation: { title: 'CMM Metrology Inspector' },
    },
    machineAssetId: 'ast-4',
    machineAsset: {
      id: 'ast-4',
      assetTag: 'AST-CMM-001',
      assetName: 'Zeiss Contura Coordinate Measuring Machine',
      category: 'METROLOGY',
      modelNumber: 'Contura G2 RDS',
    },
    machineModel: 'Zeiss Contura CMM Metrology System',
    certificationType: 'Coordinate Metrology Machine Operator (ISO 10360 Standards)',
    certifyingBody: 'Zeiss Metrology Academy India',
    certificationNumber: 'CERT-ZEISS-2025-1104',
    issueDate: '2025-06-01',
    expiryDate: '2027-05-31',
    isValid: true,
    safetyScore: 97.5,
    verifiedBy: 'Praveen Nair (QC Head)',
    verifiedAt: '2026-09-01',
  },
];

export default function MachineCertificationsPage() {
  const [certifications, setCertifications] = useState<MachineCertificationCheckItem[]>(INITIAL_CERTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPreCheckModal, setShowPreCheckModal] = useState(false);

  // Pre-check State
  const [preCheckOperator, setPreCheckOperator] = useState('Ramesh Chavan');
  const [preCheckMachine, setPreCheckMachine] = useState('DMG MORI 5-Axis Mill DMU 50');
  const [preCheckResult, setPreCheckResult] = useState<{
    tested: boolean;
    compliant: boolean;
    details: string;
  } | null>(null);

  // Register Form State
  const [registerForm, setRegisterForm] = useState({
    employeeName: '',
    employeeCode: '',
    departmentName: 'CNC Machining',
    machineModel: 'DMG MORI 5-Axis Mill DMU 50',
    machineAssetTag: 'AST-CNC-001',
    certificationType: '5-Axis CNC Precision Machining Certification',
    certifyingBody: 'DMG MORI Academy / ISO 45001 Cell',
    certificationNumber: '',
    issueDate: '2026-10-01',
    expiryDate: '2028-09-30',
    safetyScore: '98',
    verifiedBy: 'Sanjay Deshpande (Safety Director)',
  });

  // Filtering
  const filteredCertifications = certifications.filter((c) => {
    const matchesSearch =
      c.checkCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.machineModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificationType.toLowerCase().includes(searchQuery.toLowerCase());

    const isExpiringSoon =
      new Date(c.expiryDate).getTime() - Date.now() <= 45 * 24 * 60 * 60 * 1000 &&
      new Date(c.expiryDate).getTime() >= Date.now();

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'VALID'
        ? c.isValid && !isExpiringSoon
        : statusFilter === 'EXPIRING_SOON'
        ? isExpiringSoon
        : !c.isValid;

    return matchesSearch && matchesStatus;
  });

  // KPIs
  const validCount = certifications.filter((c) => c.isValid).length;
  const expiringSoonCount = certifications.filter((c) => {
    const diff = new Date(c.expiryDate).getTime() - Date.now();
    return diff > 0 && diff <= 45 * 24 * 60 * 60 * 1000;
  }).length;
  const avgSafetyScore = (
    certifications.reduce((sum, c) => sum + (c.safetyScore || 95), 0) / (certifications.length || 1)
  ).toFixed(1);

  // Run Pre-check
  const handleRunPreCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = certifications.find(
      (c) =>
        (c.employee.firstName.toLowerCase().includes(preCheckOperator.toLowerCase()) ||
          c.employee.lastName.toLowerCase().includes(preCheckOperator.toLowerCase())) &&
        c.machineModel.toLowerCase().includes(preCheckMachine.toLowerCase()) &&
        c.isValid,
    );

    if (matched) {
      setPreCheckResult({
        tested: true,
        compliant: true,
        details: `Operator holds active credential: "${matched.certificationType}" (Lic: ${matched.certificationNumber}), valid until ${matched.expiryDate}. Safety score: ${matched.safetyScore}%. Authorized to operate high-precision cell.`,
      });
    } else {
      setPreCheckResult({
        tested: true,
        compliant: false,
        details: `Safety Warning: No active, valid certification found matching operator "${preCheckOperator}" on machine model "${preCheckMachine}". Deployment blocked under ISO 45001 safety mandates.`,
      });
    }
  };

  // Submit Registration
  const handleRegisterCert = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: MachineCertificationCheckItem = {
      id: `mcc-${Date.now()}`,
      checkCode: `MCC-2026-0${Math.floor(520 + Math.random() * 400)}`,
      employeeId: `emp-${Date.now()}`,
      employee: {
        id: `emp-${Date.now()}`,
        employeeCode: registerForm.employeeCode || `EMP-CNC-200`,
        firstName: registerForm.employeeName.split(' ')[0] || 'Operator',
        lastName: registerForm.employeeName.split(' ')[1] || 'Staff',
        department: { id: 'dept-1', name: registerForm.departmentName, code: 'DEPT-CNC' },
        designation: { title: 'Certified Specialist' },
      },
      machineModel: registerForm.machineModel,
      machineAssetId: `ast-${Date.now()}`,
      machineAsset: {
        id: `ast-${Date.now()}`,
        assetTag: registerForm.machineAssetTag,
        assetName: registerForm.machineModel,
        category: 'CNC_MACHINING',
        modelNumber: 'Spec',
      },
      certificationType: registerForm.certificationType,
      certifyingBody: registerForm.certifyingBody,
      certificationNumber: registerForm.certificationNumber || `CERT-AUTO-${Date.now().toString().slice(-4)}`,
      issueDate: registerForm.issueDate,
      expiryDate: registerForm.expiryDate,
      isValid: true,
      safetyScore: Number(registerForm.safetyScore),
      verifiedBy: registerForm.verifiedBy,
      verifiedAt: new Date().toISOString().substring(0, 10),
    };

    setCertifications([newCert, ...certifications]);
    setShowRegisterModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Safety & Compliance
            </span>
            <span className="text-xs text-slate-500">ISO 45001 & High-Precision Machine Governance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Machine Safety & Operational Certifications
          </h1>
          <p className="text-sm text-slate-400">
            Validate that operators assigned to 5-axis CNCs, robotic welding arms, high-tonnage hydraulic presses, and metrology labs hold verified, non-expired credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setPreCheckResult(null);
              setShowPreCheckModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors border border-slate-700"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Pre-Check Compliance
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
          >
            <Plus className="w-4 h-4" />
            Register Certification
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Valid Machine Certifications</div>
            <div className="text-2xl font-bold text-white mt-1">{validCount} Verified</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Active Operator Coverage
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Expiring in &lt; 45 Days</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{expiringSoonCount} Certs</div>
            <div className="text-xs text-slate-400 mt-1">Renewal notifications dispatched</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Average Safety Score</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{avgSafetyScore}%</div>
            <div className="text-xs text-cyan-400/80 mt-1">Written & practical audits</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Days Incident-Free</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">482 Days</div>
            <div className="text-xs text-emerald-400/80 mt-1">Zero major shop floor LTI</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search operator, machine model, cert #, or body..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Certifications</option>
            <option value="VALID">Active & Valid</option>
            <option value="EXPIRING_SOON">Expiring in &lt; 45 Days</option>
          </select>
        </div>
      </div>

      {/* Certifications Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="p-3.5">Check Code & License #</th>
                <th className="p-3.5">Operator & Department</th>
                <th className="p-3.5">Machine Model & Asset</th>
                <th className="p-3.5">Certification Protocol</th>
                <th className="p-3.5">Certifying Body</th>
                <th className="p-3.5">Valid Until Date</th>
                <th className="p-3.5">Safety Score</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredCertifications.map((c) => {
                const diffDays = Math.ceil(
                  (new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                );
                const isExpiring = diffDays > 0 && diffDays <= 45;

                return (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white">{c.checkCode}</div>
                      <div className="text-[11px] font-mono text-purple-400 mt-0.5">{c.certificationNumber}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">
                        {c.employee.firstName} {c.employee.lastName}
                      </div>
                      <div className="text-teal-400 font-mono text-[11px]">{c.employee.employeeCode}</div>
                      <div className="text-slate-400 text-[11px]">{c.employee.department?.name}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">{c.machineModel}</div>
                      {c.machineAsset && (
                        <div className="font-mono text-cyan-400 text-[11px] mt-0.5">{c.machineAsset.assetTag}</div>
                      )}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-medium text-slate-300 line-clamp-2">{c.certificationType}</div>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px] max-w-xs">
                      {c.certifyingBody}
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="text-white font-medium">{c.expiryDate}</div>
                      <div className={`text-[10px] ${isExpiring ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                        {diffDays > 0 ? `${diffDays} days remaining` : 'Expired'}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-emerald-400">{c.safetyScore}%</div>
                      <div className="text-[10px] text-slate-500">Verified by {c.verifiedBy}</div>
                    </td>
                    <td className="p-3.5">
                      {isExpiring ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Renew Soon
                        </span>
                      ) : c.isValid ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Valid
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                          Expired
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: PRE-CHECK COMPLIANCE */}
      {showPreCheckModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  Pre-Deployment Machine Safety Gate Check
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Validate operator credentials before dispatching to high-precision equipment.
                </p>
              </div>
              <button
                onClick={() => setShowPreCheckModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRunPreCheck} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Operator Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chavan"
                  value={preCheckOperator}
                  onChange={(e) => setPreCheckOperator(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Machine Model / Cell *</label>
                <select
                  value={preCheckMachine}
                  onChange={(e) => setPreCheckMachine(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="DMG MORI 5-Axis Mill DMU 50">DMG MORI 5-Axis Mill DMU 50</option>
                  <option value="KUKA 6-Axis Robotic MIG Welding Station">KUKA 6-Axis Robotic MIG Welding Station</option>
                  <option value="500T Heavy Hydraulic Hot Forging Press">500T Heavy Hydraulic Hot Forging Press</option>
                  <option value="Zeiss Contura CMM Metrology System">Zeiss Contura CMM Metrology System</option>
                </select>
              </div>

              {preCheckResult && (
                <div
                  className={`p-3.5 rounded-xl border ${
                    preCheckResult.compliant
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {preCheckResult.compliant ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                    )}
                    {preCheckResult.compliant ? 'COMPLIANCE AUTHORIZED' : 'SAFETY VIOLATION RISK'}
                  </div>
                  <p className="text-xs leading-relaxed">{preCheckResult.details}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPreCheckModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md shadow-purple-900/20"
                >
                  Test Operator Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER NEW CERTIFICATION */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  Register High-Precision Machine Operator Certification
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Record accredited skill certificate details, license number, and validity term.
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterCert} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Operator Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chavan"
                    value={registerForm.employeeName}
                    onChange={(e) => setRegisterForm({ ...registerForm, employeeName: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Employee Code</label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-CNC-104"
                    value={registerForm.employeeCode}
                    onChange={(e) => setRegisterForm({ ...registerForm, employeeCode: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Machine Model / Cell *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.machineModel}
                    onChange={(e) => setRegisterForm({ ...registerForm, machineModel: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Linked Asset Tag (Optional)</label>
                  <input
                    type="text"
                    value={registerForm.machineAssetTag}
                    onChange={(e) => setRegisterForm({ ...registerForm, machineAssetTag: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Certification Qualification Title *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.certificationType}
                    onChange={(e) => setRegisterForm({ ...registerForm, certificationType: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Certifying Body / Academy *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.certifyingBody}
                    onChange={(e) => setRegisterForm({ ...registerForm, certifyingBody: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Certification / License # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CERT-DMG-2026-9901"
                    value={registerForm.certificationNumber}
                    onChange={(e) => setRegisterForm({ ...registerForm, certificationNumber: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={registerForm.issueDate}
                    onChange={(e) => setRegisterForm({ ...registerForm, issueDate: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={registerForm.expiryDate}
                    onChange={(e) => setRegisterForm({ ...registerForm, expiryDate: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Safety Score (%)</label>
                  <input
                    type="number"
                    value={registerForm.safetyScore}
                    onChange={(e) => setRegisterForm({ ...registerForm, safetyScore: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Verifying Officer</label>
                  <input
                    type="text"
                    value={registerForm.verifiedBy}
                    onChange={(e) => setRegisterForm({ ...registerForm, verifiedBy: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md shadow-purple-900/20"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

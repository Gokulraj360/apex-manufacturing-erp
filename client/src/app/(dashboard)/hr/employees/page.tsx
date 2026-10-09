'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowLeft,
  X,
  FileText,
  Mail,
  Phone,
  Building,
  DollarSign,
  Upload,
  Calendar,
  BadgeAlert,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { EmployeeItem, EmploymentStatus, EmploymentType } from '@/types/hr';

const INITIAL_EMPLOYEES: EmployeeItem[] = [
  {
    id: 'emp-1',
    employeeCode: 'EMP-2026-001',
    firstName: 'Sunil',
    lastName: 'Rao',
    email: 'sunil.rao@apex-mfg.local',
    phone: '+91 98230 44551',
    departmentId: 'dept-1',
    department: { id: 'dept-1', name: 'Production & Shop Floor', code: 'PROD' },
    designationId: 'des-1',
    designation: { id: 'des-1', title: 'Plant Operations Manager', code: 'DES-OPS-MGR', level: 4 },
    employmentStatus: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2022-03-15',
    panOrTaxId: 'ABCDE1234F',
    aadhaarOrNationalId: 'XXXX-XXXX-9912',
    baseSalary: 125000,
    hourlyOvertimeRate: 650,
    onboardingDocuments: [
      { id: 'doc-1', employeeId: 'emp-1', documentName: 'Aadhaar Card Copy', documentType: 'KYC', documentUrl: 'docs/aadhaar-001.pdf', verificationStatus: 'VERIFIED', createdAt: '2022-03-15', updatedAt: '2022-03-15' },
      { id: 'doc-2', employeeId: 'emp-1', documentName: 'Relieving & Experience Letter', documentType: 'EXPERIENCE', documentUrl: 'docs/exp-001.pdf', verificationStatus: 'VERIFIED', createdAt: '2022-03-15', updatedAt: '2022-03-15' },
    ],
    createdAt: '2022-03-15',
    updatedAt: '2026-10-07',
  },
  {
    id: 'emp-2',
    employeeCode: 'EMP-2026-002',
    firstName: 'Rajesh',
    lastName: 'Mehra',
    email: 'rajesh.mehra@apex-mfg.local',
    phone: '+91 98900 12345',
    departmentId: 'dept-2',
    department: { id: 'dept-2', name: 'Warehouse & Logistics', code: 'WHS' },
    designationId: 'des-2',
    designation: { id: 'des-2', title: 'Warehouse Logistics Supervisor', code: 'DES-WHS-SUP', level: 3 },
    employmentStatus: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-01-10',
    panOrTaxId: 'BCDEF2345G',
    aadhaarOrNationalId: 'XXXX-XXXX-4421',
    baseSalary: 72000,
    hourlyOvertimeRate: 400,
    onboardingDocuments: [
      { id: 'doc-3', employeeId: 'emp-2', documentName: 'Forklift Driving License', documentType: 'CERTIFICATION', documentUrl: 'docs/forklift-lic.pdf', verificationStatus: 'VERIFIED', createdAt: '2023-01-10', updatedAt: '2023-01-10' },
    ],
    createdAt: '2023-01-10',
    updatedAt: '2026-10-07',
  },
  {
    id: 'emp-3',
    employeeCode: 'EMP-2026-015',
    firstName: 'Amit',
    lastName: 'Kalyan',
    email: 'amit.k@apex-mfg.local',
    phone: '+91 97654 32109',
    departmentId: 'dept-1',
    department: { id: 'dept-1', name: 'Production & Shop Floor', code: 'PROD' },
    designationId: 'des-3',
    designation: { id: 'des-3', title: 'CNC Machine Lead Operator', code: 'DES-CNC-LEAD', level: 2 },
    employmentStatus: 'ACTIVE',
    employmentType: 'SHIFT_WORKER',
    dateOfJoining: '2024-06-01',
    panOrTaxId: 'CDEFG3456H',
    aadhaarOrNationalId: 'XXXX-XXXX-1120',
    baseSalary: 48000,
    hourlyOvertimeRate: 300,
    onboardingDocuments: [
      { id: 'doc-4', employeeId: 'emp-3', documentName: 'ITI Machinist Trade Certificate', documentType: 'EDUCATION', documentUrl: 'docs/iti-trade.pdf', verificationStatus: 'VERIFIED', createdAt: '2024-06-01', updatedAt: '2024-06-01' },
    ],
    createdAt: '2024-06-01',
    updatedAt: '2026-10-07',
  },
  {
    id: 'emp-4',
    employeeCode: 'EMP-2026-042',
    firstName: 'Pooja',
    lastName: 'Sharma',
    email: 'pooja.s@apex-mfg.local',
    phone: '+91 99112 88440',
    departmentId: 'dept-3',
    department: { id: 'dept-3', name: 'Quality Assurance (QA/QC)', code: 'QA' },
    designationId: 'des-4',
    designation: { id: 'des-4', title: 'Quality Control Inspector', code: 'DES-QC-INSP', level: 2 },
    employmentStatus: 'PROBATION',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2026-08-18',
    panOrTaxId: 'DEFGH4567J',
    aadhaarOrNationalId: 'XXXX-XXXX-8833',
    baseSalary: 52000,
    hourlyOvertimeRate: 320,
    onboardingDocuments: [
      { id: 'doc-5', employeeId: 'emp-4', documentName: 'B.Tech Degree Certificate', documentType: 'EDUCATION', documentUrl: 'docs/degree.pdf', verificationStatus: 'VERIFIED', createdAt: '2026-08-18', updatedAt: '2026-08-18' },
    ],
    createdAt: '2026-08-18',
    updatedAt: '2026-10-07',
  },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeItem[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New Employee Form
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentName: 'Production & Shop Floor',
    designationTitle: 'CNC Machine Operator',
    employmentStatus: 'ACTIVE' as EmploymentStatus,
    employmentType: 'FULL_TIME' as EmploymentType,
    dateOfJoining: new Date().toISOString().split('T')[0],
    baseSalary: 45000,
    hourlyOvertimeRate: 280,
    panOrTaxId: '',
    aadhaarOrNationalId: '',
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.employeeCode) return;

    const newEmp: EmployeeItem = {
      id: `emp-${Date.now()}`,
      employeeCode: formData.employeeCode.toUpperCase(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      departmentId: 'dept-gen',
      department: { id: 'dept-gen', name: formData.departmentName, code: 'GEN' },
      designationId: 'des-gen',
      designation: { id: 'des-gen', title: formData.designationTitle, code: 'DES-GEN', level: 2 },
      employmentStatus: formData.employmentStatus,
      employmentType: formData.employmentType,
      dateOfJoining: formData.dateOfJoining,
      panOrTaxId: formData.panOrTaxId,
      aadhaarOrNationalId: formData.aadhaarOrNationalId,
      baseSalary: Number(formData.baseSalary),
      hourlyOvertimeRate: Number(formData.hourlyOvertimeRate),
      onboardingDocuments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEmployees([newEmp, ...employees]);
    setIsModalOpen(false);
    setFormData({
      employeeCode: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentName: 'Production & Shop Floor',
      designationTitle: 'CNC Machine Operator',
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      dateOfJoining: new Date().toISOString().split('T')[0],
      baseSalary: 45000,
      hourlyOvertimeRate: 280,
      panOrTaxId: '',
      aadhaarOrNationalId: '',
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesStatus = statusFilter === 'ALL' || emp.employmentStatus === statusFilter;
    const matchesDept = deptFilter === 'ALL' || emp.department?.name.includes(deptFilter);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      emp.employeeCode.toLowerCase().includes(q) ||
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.designation?.title && emp.designation.title.toLowerCase().includes(q));

    return matchesStatus && matchesDept && matchesSearch;
  });

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
            <span className="text-slate-200">Employee Directory</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-indigo-400" />
            Employee Directory & Digital Dossiers
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain complete personnel profiles, salary structures, department mappings, and statutory KYC documents.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          Onboard New Employee
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1322] border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search code, name, designation, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {['ALL', 'ACTIVE', 'PROBATION', 'ON_LEAVE'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-semibold">{filteredEmployees.length}</span> employee profiles
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-3 font-semibold">Code / ID</th>
                <th className="py-3 px-3 font-semibold">Employee Name & Contact</th>
                <th className="py-3 px-3 font-semibold">Department & Designation</th>
                <th className="py-3 px-3 font-semibold">Employment Status</th>
                <th className="py-3 px-3 font-semibold">Compensation (Base)</th>
                <th className="py-3 px-3 font-semibold">Joining Date</th>
                <th className="py-3 px-3 font-semibold">KYC Dossier</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredEmployees.map((emp) => (
                <React.Fragment key={emp.id}>
                  <tr className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-300">
                      {emp.employeeCode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white tracking-wide">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-slate-500" />
                        {emp.email}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-slate-500" />
                        {emp.phone}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-medium">{emp.designation?.title}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building className="h-3 w-3 text-slate-500" />
                        {emp.department?.name}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          emp.employmentStatus === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : emp.employmentStatus === 'PROBATION'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {emp.employmentStatus === 'ACTIVE' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <div className="text-white font-semibold">₹{emp.baseSalary.toLocaleString()}/mo</div>
                      <div className="text-[10px] text-amber-400">OT: ₹{emp.hourlyOvertimeRate}/hr</div>
                    </td>
                    <td className="py-3 px-3 text-[11px] font-mono text-slate-300">
                      {emp.dateOfJoining}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        <FileText className="h-3 w-3 text-indigo-400" />
                        {emp.onboardingDocuments?.length || 0} Docs Verified
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => toggleExpand(emp.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium inline-flex items-center gap-1"
                      >
                        {expandedId === emp.id ? 'Hide Dossier' : 'View Dossier'}
                        {expandedId === emp.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Dossier Row */}
                  {expandedId === emp.id && (
                    <tr>
                      <td colSpan={8} className="bg-slate-900/80 p-4 border-b border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Statutory KYC Details */}
                          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1.5">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Statutory Identity (KYC)</span>
                            <div className="flex justify-between">
                              <span className="text-slate-400">PAN / Tax ID:</span>
                              <span className="font-mono text-white font-bold">{emp.panOrTaxId || 'Not on file'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Aadhaar / National ID:</span>
                              <span className="font-mono text-slate-200">{emp.aadhaarOrNationalId || 'Not on file'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Employment Class:</span>
                              <span className="text-indigo-300 font-semibold">{emp.employmentType}</span>
                            </div>
                          </div>

                          {/* Digital Documents List */}
                          <div className="col-span-2 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-semibold text-slate-400">Digital Document Repository</span>
                              <button
                                onClick={() => alert(`Upload dialog for ${emp.employeeCode}`)}
                                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                              >
                                <Upload className="h-3 w-3" /> Upload Document
                              </button>
                            </div>

                            {emp.onboardingDocuments && emp.onboardingDocuments.length > 0 ? (
                              <div className="grid grid-cols-2 gap-2">
                                {emp.onboardingDocuments.map((doc) => (
                                  <div key={doc.id} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                                    <div className="truncate">
                                      <div className="text-white font-medium text-[11px] truncate">{doc.documentName}</div>
                                      <div className="text-[9px] text-slate-500">{doc.documentType}</div>
                                    </div>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                                      {doc.verificationStatus}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-slate-500 text-xs italic">No documents uploaded yet.</div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-white">Onboard New Employee</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Employee Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="EMP-2026-XXX"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white uppercase font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@apex-mfg.local"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.departmentName}
                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Production & Shop Floor">Production & Shop Floor</option>
                    <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                    <option value="Quality Assurance (QA/QC)">Quality Assurance (QA/QC)</option>
                    <option value="Plant Engineering & Maintenance">Plant Engineering & Maintenance</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Human Resources & Safety">Human Resources & Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. CNC Operator / Technician"
                    value={formData.designationTitle}
                    onChange={(e) => setFormData({ ...formData, designationTitle: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Base Salary (₹/mo) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">OT Rate (₹/hr)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hourlyOvertimeRate}
                    onChange={(e) => setFormData({ ...formData, hourlyOvertimeRate: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    value={formData.panOrTaxId}
                    onChange={(e) => setFormData({ ...formData, panOrTaxId: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white uppercase font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Aadhaar / National ID</label>
                  <input
                    type="text"
                    placeholder="XXXX-XXXX-XXXX"
                    value={formData.aadhaarOrNationalId}
                    onChange={(e) => setFormData({ ...formData, aadhaarOrNationalId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30"
                >
                  Save & Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  UserPlus,
  ShieldCheck,
  KeyRound,
  CreditCard,
  Building2,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Lock,
  Eye,
  RefreshCw,
  Coins,
  BadgeCheck,
  Smartphone,
  Check,
} from 'lucide-react';
import { ALL_ROLES } from '@/types/auth';
import { EmployeeCredentialItem } from '@/types/payroll-cred';

// Pre-seeded factory staff
const INITIAL_STAFF: EmployeeCredentialItem[] = [
  {
    id: 'cred-1',
    employeeId: 'EMP-2026-0101',
    name: 'Rameshwar Patil',
    email: 'rameshwar@apexcorp.com',
    phone: '+91 98451 22334',
    nationalId: 'XXXX-XXXX-8921',
    address: 'Austin Advanced Manufacturing Campus, TX',
    role: 'production',
    roleTitle: 'SMT Line 1 Precision Assembly Lead',
    department: 'Precision Assembly Lines',
    accessPermissions: ['READ_WORK_ORDERS', 'LOG_ASSEMBLY_OUTPUT', 'VIEW_PARTS_RECIPE'],
    username: 'rameshwar_patil',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-03-15',
    salaryStructure: {
      basicSalary: 18000,
      hraAllowance: 7200,
      conveyanceAllowance: 1600,
      specialAllowance: 2200,
      grossSalary: 29000,
      esiDeduction: 0,
      pfDeduction: 2160,
      professionalTax: 200,
      totalDeductions: 2360,
      netSalary: 26640,
      bankName: 'State Bank of India',
      accountNumber: '381920194821',
      ifscCode: 'SBIN0004120',
      panNumber: 'ABCDE1234F',
      uanNumber: '101928374651',
      esiNumber: '5519283746',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-03-15T09:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'cred-2',
    employeeId: 'EMP-2026-0102',
    name: 'Priya Sharma',
    email: 'priya.sharma@apexcorp.com',
    phone: '+91 91234 56789',
    nationalId: 'XXXX-XXXX-4412',
    address: 'Stuttgart EV Engineering Facility, Germany',
    role: 'quality',
    roleTitle: 'Precision Component Quality Inspector',
    department: 'Quality Assurance & Testing',
    accessPermissions: ['LOG_QC_INSPECTION', 'RAISE_DEFECT_REPORT', 'APPROVE_BATCH'],
    username: 'priya_sharma',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-06-01',
    salaryStructure: {
      basicSalary: 22000,
      hraAllowance: 8800,
      conveyanceAllowance: 2000,
      specialAllowance: 3200,
      grossSalary: 36000,
      esiDeduction: 0,
      pfDeduction: 2640,
      professionalTax: 200,
      totalDeductions: 2840,
      netSalary: 33160,
      bankName: 'HDFC Bank',
      accountNumber: '50100293847162',
      ifscCode: 'HDFC0001824',
      panNumber: 'FGHIJ5678K',
      uanNumber: '101928374652',
      esiNumber: '5519283747',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-06-01T09:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  },
  {
    id: 'cred-3',
    employeeId: 'EMP-2026-0103',
    name: 'Dilip Sawant',
    email: 'dilip.sawant@apexcorp.com',
    phone: '+91 99887 76655',
    nationalId: 'XXXX-XXXX-1109',
    address: 'Jurong Precision Robotics Hub, Singapore',
    role: 'fleet',
    roleTitle: 'Commercial Fleet & Delivery Logistics Driver',
    department: 'Fleet & Vehicle Logistics',
    accessPermissions: ['VIEW_ASSIGNED_TRIP', 'UPDATE_ODOMETER', 'LOG_FUEL_SLIP'],
    username: 'dilip_sawant',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-09-10',
    salaryStructure: {
      basicSalary: 14000,
      hraAllowance: 4000,
      conveyanceAllowance: 1000,
      specialAllowance: 1500,
      grossSalary: 20500,
      esiDeduction: 154,
      pfDeduction: 1680,
      professionalTax: 200,
      totalDeductions: 2034,
      netSalary: 18466,
      bankName: 'ICICI Bank',
      accountNumber: '001901582910',
      ifscCode: 'ICIC0000019',
      panNumber: 'KLMNO9012P',
      uanNumber: '101928374653',
      esiNumber: '5519283748',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-09-10T09:00:00.000Z',
    updatedAt: '2026-10-03T10:00:00.000Z',
  },
  {
    id: 'cred-4',
    employeeId: 'EMP-2026-0104',
    name: 'Kavita Menon',
    email: 'kavita.menon@apexcorp.com',
    phone: '+91 98765 12345',
    nationalId: 'XXXX-XXXX-6677',
    address: 'Corporate Global Headquarters, Austin, TX',
    role: 'hr',
    roleTitle: 'HR & Labor Compliance Officer',
    department: 'Human Resources & Safety',
    accessPermissions: ['ONBOARD_STAFF', 'SUBMIT_PAYROLL', 'APPROVE_LEAVES'],
    username: 'kavita_menon',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-11-01',
    salaryStructure: {
      basicSalary: 35000,
      hraAllowance: 14000,
      conveyanceAllowance: 3000,
      specialAllowance: 8000,
      grossSalary: 60000,
      esiDeduction: 0,
      pfDeduction: 4200,
      professionalTax: 200,
      totalDeductions: 4400,
      netSalary: 55600,
      bankName: 'Axis Bank',
      accountNumber: '91802019482716',
      ifscCode: 'UTIB0000214',
      panNumber: 'PQRST3456U',
      uanNumber: '101928374654',
      esiNumber: '5519283749',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-11-01T09:00:00.000Z',
    updatedAt: '2026-10-04T10:00:00.000Z',
  },
  {
    id: 'cred-5',
    employeeId: 'EMP-2026-0105',
    name: 'Amitabh Sen',
    email: 'amitabh.sen@apexcorp.com',
    phone: '+91 97654 32109',
    nationalId: 'XXXX-XXXX-3344',
    address: 'Midwest Operations Center, Chicago, IL',
    role: 'finance',
    roleTitle: 'Commercial Finance & Accounts Lead',
    department: 'Finance & Accounts',
    accessPermissions: ['VERIFY_PAYROLL', 'RELEASE_PAYOUT', 'APPROVE_OVERHEADS'],
    username: 'finance_manager',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-08-15',
    salaryStructure: {
      basicSalary: 50000,
      hraAllowance: 20000,
      conveyanceAllowance: 4000,
      specialAllowance: 16000,
      grossSalary: 90000,
      esiDeduction: 0,
      pfDeduction: 6000,
      professionalTax: 200,
      totalDeductions: 6200,
      netSalary: 83800,
      bankName: 'HDFC Bank',
      accountNumber: '50100492817291',
      ifscCode: 'HDFC0000120',
      panNumber: 'UVWXY7890Z',
      uanNumber: '101928374655',
      esiNumber: '5519283750',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-08-15T09:00:00.000Z',
    updatedAt: '2026-10-05T10:00:00.000Z',
  },
];

export default function EmployeeCredentialsPage() {
  const [staffList, setStaffList] = useState<EmployeeCredentialItem[]>(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<EmployeeCredentialItem | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State for Onboarding
  const [formData, setFormData] = useState({
    name: '',
    employeeId: `EMP-2026-0${106 + INITIAL_STAFF.length}`,
    email: '',
    phone: '',
    nationalId: '',
    address: '',
    roleId: 'production',
    roleTitle: 'Phone Assembly Line Technician',
    department: 'Phone Assembly Lines',
    username: '',
    password: '123',
    employmentType: 'FULL_TIME',
    // Salary inputs
    basicSalary: 20000,
    hraAllowance: 8000,
    conveyanceAllowance: 1600,
    specialAllowance: 2400,
    // Bank details
    bankName: 'HDFC Bank',
    accountNumber: '',
    ifscCode: 'HDFC0001000',
    panNumber: '',
    uanNumber: '',
    esiNumber: '',
    paymentMode: 'DIRECT_BANK_TRANSFER',
  });

  // Calculate salary in real time
  const salaryCalc = useMemo(() => {
    const basic = Number(formData.basicSalary) || 0;
    const hra = Number(formData.hraAllowance) || 0;
    const conveyance = Number(formData.conveyanceAllowance) || 0;
    const special = Number(formData.specialAllowance) || 0;
    const gross = basic + hra + conveyance + special;

    const pf = Math.round(basic * 0.12); // 12% PF
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0; // 0.75% ESI if Gross <= 21,000
    const pt = 200;
    const totalDeductions = pf + esi + pt;
    const net = Math.max(0, gross - totalDeductions);

    return {
      gross,
      pf,
      esi,
      pt,
      totalDeductions,
      net,
      isEsiCovered: gross <= 21000,
    };
  }, [formData.basicSalary, formData.hraAllowance, formData.conveyanceAllowance, formData.specialAllowance]);

  // Handle role change to auto-set department and default username
  const handleRoleSelection = (roleId: string) => {
    const roleDef = ALL_ROLES.find((r) => r.id === roleId);
    if (roleDef) {
      setFormData((prev) => ({
        ...prev,
        roleId,
        department: roleDef.department,
        roleTitle: `${roleDef.name} Specialist`,
        username: prev.email ? prev.email.split('@')[0] : `${roleId}_user`,
      }));
    }
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();

    const newStaff: EmployeeCredentialItem = {
      id: `cred-${Date.now()}`,
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      nationalId: formData.nationalId || 'XXXX-XXXX-9901',
      address: formData.address || 'Bengaluru Facility',
      role: formData.roleId,
      roleTitle: formData.roleTitle,
      department: formData.department,
      accessPermissions: ['STANDARD_WORKER_ACCESS'],
      username: formData.username || formData.email.split('@')[0] || `user_${Date.now()}`,
      isActive: true,
      employmentType: formData.employmentType,
      dateOfJoining: new Date().toISOString().split('T')[0],
      salaryStructure: {
        basicSalary: Number(formData.basicSalary),
        hraAllowance: Number(formData.hraAllowance),
        conveyanceAllowance: Number(formData.conveyanceAllowance),
        specialAllowance: Number(formData.specialAllowance),
        grossSalary: salaryCalc.gross,
        esiDeduction: salaryCalc.esi,
        pfDeduction: salaryCalc.pf,
        professionalTax: salaryCalc.pt,
        totalDeductions: salaryCalc.totalDeductions,
        netSalary: salaryCalc.net,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber || '000000000000',
        ifscCode: formData.ifscCode,
        panNumber: formData.panNumber || 'ABCDE1234F',
        uanNumber: formData.uanNumber || '101928374999',
        esiNumber: formData.esiNumber || null,
        paymentMode: formData.paymentMode,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setStaffList([newStaff, ...staffList]);
    setIsOnboardingModalOpen(false);
    setSuccessToast(`Staff [${newStaff.name} - ${newStaff.employeeId}] onboarded with Net Salary ₹${newStaff.salaryStructure.netSalary.toLocaleString()}/mo.`);
    setTimeout(() => setSuccessToast(null), 4000);

    // Reset form
    setFormData({
      name: '',
      employeeId: `EMP-2026-0${107 + staffList.length}`,
      email: '',
      phone: '',
      nationalId: '',
      address: '',
      roleId: 'production',
      roleTitle: 'Phone Assembly Line Technician',
      department: 'Phone Assembly Lines',
      username: '',
      password: '123',
      employmentType: 'FULL_TIME',
      basicSalary: 20000,
      hraAllowance: 8000,
      conveyanceAllowance: 1600,
      specialAllowance: 2400,
      bankName: 'HDFC Bank',
      accountNumber: '',
      ifscCode: 'HDFC0001000',
      panNumber: '',
      uanNumber: '',
      esiNumber: '',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    });
  };

  const handleToggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
    );
  };

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept =
        selectedDeptFilter === 'ALL' || staff.department === selectedDeptFilter;
      return matchesSearch && matchesDept;
    });
  }, [staffList, searchQuery, selectedDeptFilter]);

  const totalMonthlyGross = useMemo(() => {
    return staffList.reduce((acc, s) => acc + s.salaryStructure.grossSalary, 0);
  }, [staffList]);

  const totalMonthlyNet = useMemo(() => {
    return staffList.reduce((acc, s) => acc + s.salaryStructure.netSalary, 0);
  }, [staffList]);

  const totalMonthlyPf = useMemo(() => {
    return staffList.reduce((acc, s) => acc + s.salaryStructure.pfDeduction, 0);
  }, [staffList]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              Super Admin & HR Onboarding Console
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Employee Credentialing & Salary Setup
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Assign factory roles, system login permissions, bank accounts, and automated statutory ESI & PF salary structures.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/system-admin/users"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-colors shadow-xs"
            title="Open Tamper-Proof IT Admin Identity Vault & Password Governance Workbench"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            IT Admin Identity Vault
          </Link>

          <Link
            href="/payroll"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-xs"
          >
            <CreditCard className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            Monthly Payouts Desk
          </Link>

          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Onboard New Employee
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Registered Staff</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              {staffList.length} Technicians
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{staffList.filter((s) => s.isActive).length} Active credentials</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Monthly Gross Liability</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              ₹ {(totalMonthlyGross / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Basic + HRA + Special Allowances
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Statutory PF (12%) Pool</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              ₹ {totalMonthlyPf.toLocaleString()} / mo
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              EPFO monthly compliance contribution
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Net Monthly Disbursal</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-tight font-mono">
              ₹ {(totalMonthlyNet / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Bank take-home payout total
            </div>
          </div>
        </div>
      </div>

      {/* Main Staff Registry & Credential Table */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Factory Staff Credential & Salary Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified employees, assigned roles, statutory numbers, and monthly take-home payouts
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff, role, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-56 font-medium"
              />
            </div>

            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">All Departments</option>
              <option value="Phone Assembly Lines">Phone Assembly Lines</option>
              <option value="Phone Quality Checks">Phone Quality Checks</option>
              <option value="Fleet & Logistics">Fleet & Logistics</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
            </select>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-950/70">
                <th className="py-3 px-3.5">Employee Name & ID</th>
                <th className="py-3 px-3.5">Assigned Role & Department</th>
                <th className="py-3 px-3.5">System Username</th>
                <th className="py-3 px-3.5">Basic Salary</th>
                <th className="py-3 px-3.5">Statutory ESI / PF</th>
                <th className="py-3 px-3.5">Net Monthly Payout</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{staff.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {staff.employeeId} &bull; {staff.phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-3.5">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{staff.roleTitle}</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {staff.department}
                    </div>
                  </td>

                  <td className="py-3.5 px-3.5 font-mono text-slate-800 dark:text-slate-200">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]">
                      {staff.username}
                    </span>
                  </td>

                  <td className="py-3.5 px-3.5 font-mono">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      ₹ {staff.salaryStructure.basicSalary.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Gross: ₹{staff.salaryStructure.grossSalary.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-3.5 text-[11px] font-mono">
                    <div>
                      PF: <strong className="text-emerald-600 dark:text-emerald-400">₹{staff.salaryStructure.pfDeduction.toLocaleString()}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {staff.salaryStructure.esiDeduction > 0
                        ? `ESI: ₹${staff.salaryStructure.esiDeduction}`
                        : 'ESI: Exempt (>₹21k)'}
                    </div>
                  </td>

                  <td className="py-3.5 px-3.5 font-mono">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      ₹ {staff.salaryStructure.netSalary.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                      {staff.salaryStructure.bankName}
                    </div>
                  </td>

                  <td className="py-3.5 px-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(staff.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors ${
                        staff.isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {staff.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3.5 px-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStaff(staff);
                        setIsEditModalOpen(true);
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ONBOARD NEW EMPLOYEE & SALARY SETUP */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Onboard Employee & Configure Salary
                </h3>
              </div>
              <button
                onClick={() => setIsOnboardingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-5">
              {/* 1. Personal & Contact Information */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  1. Personal & Employment Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Kulkarni"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Staff ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="anand@apexmobile.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Factory Role Selection & Login Credentials */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  2. Role Selection & System Credentials
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Job Role (From 21 Roles) *
                    </label>
                    <select
                      value={formData.roleId}
                      onChange={(e) => handleRoleSelection(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} [{r.department}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Role Title / Designation *
                    </label>
                    <input
                      type="text"
                      value={formData.roleTitle}
                      onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Login Username *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. anand_kulkarni"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Default Password
                    </label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Salary Breakdown & Real-Time ESI / PF Calculation */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    3. Salary Structure & Statutory Calculator
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" /> Auto Statutory Engine
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Basic Salary (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.basicSalary}
                      onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      HRA (40%) (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.hraAllowance}
                      onChange={(e) => setFormData({ ...formData, hraAllowance: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Conveyance (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.conveyanceAllowance}
                      onChange={(e) => setFormData({ ...formData, conveyanceAllowance: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Special (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.specialAllowance}
                      onChange={(e) => setFormData({ ...formData, specialAllowance: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Live Real-Time Statutory Calculation Summary Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Monthly Gross</span>
                    <span className="text-slate-900 dark:text-white font-bold font-mono text-sm">
                      ₹ {salaryCalc.gross.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">PF Deduction (12%)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">
                      ₹ {salaryCalc.pf.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">ESI Deduction</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold font-mono text-sm">
                      {salaryCalc.esi > 0 ? `₹ ${salaryCalc.esi.toLocaleString()}` : '₹ 0 (Exempt)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Take-Home Net</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold font-mono text-base">
                      ₹ {salaryCalc.net.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Bank Information */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  4. Bank Account & Statutory Numbers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HDFC Bank"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 501004829104"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HDFC0001000"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono uppercase focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOnboardingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Save & Onboard Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW / EDIT SALARY MODAL */}
      {isEditModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingStaff.name} ({editingStaff.employeeId})
                </h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {editingStaff.roleTitle} &bull; {editingStaff.department}
                </span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                  Salary & Statutory Breakdown
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 font-mono">
                  <div>Basic Salary: ₹{editingStaff.salaryStructure.basicSalary.toLocaleString()}</div>
                  <div>HRA Allowance: ₹{editingStaff.salaryStructure.hraAllowance.toLocaleString()}</div>
                  <div>Conveyance: ₹{editingStaff.salaryStructure.conveyanceAllowance.toLocaleString()}</div>
                  <div>Special: ₹{editingStaff.salaryStructure.specialAllowance.toLocaleString()}</div>
                  <div className="col-span-2 pt-1 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                    Gross Monthly Salary: ₹{editingStaff.salaryStructure.grossSalary.toLocaleString()}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 font-mono">
                  <div>PF (12%): ₹{editingStaff.salaryStructure.pfDeduction.toLocaleString()}</div>
                  <div>ESI: ₹{editingStaff.salaryStructure.esiDeduction.toLocaleString()}</div>
                  <div>PT: ₹{editingStaff.salaryStructure.professionalTax.toLocaleString()}</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    Net Take-Home: ₹{editingStaff.salaryStructure.netSalary.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div>Bank: <strong className="text-slate-800 dark:text-slate-200">{editingStaff.salaryStructure.bankName}</strong></div>
                <div>Account No: <strong className="text-slate-800 dark:text-slate-200 font-mono">{editingStaff.salaryStructure.accountNumber}</strong> ({editingStaff.salaryStructure.ifscCode})</div>
                <div>UAN / PF No: <strong className="text-slate-800 dark:text-slate-200 font-mono">{editingStaff.salaryStructure.uanNumber || 'N/A'}</strong></div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

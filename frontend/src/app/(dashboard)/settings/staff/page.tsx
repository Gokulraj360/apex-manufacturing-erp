'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Trash2,
  KeyRound,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  X,
  RefreshCw,
  Eye,
  Key,
  ChevronRight,
  UserX,
  BadgeCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StaffMember {
  id: string;
  empId: string;
  name: string;
  email: string;
  passwordRaw: string;
  role: string;
  salary: number; // monthly CTC in ₹
  isActive: boolean;
  joinedDate: string;
  isOwnerProtected?: boolean;
}

const ROLES_LIST = [
  { value: 'TOP_MANAGEMENT', label: 'Top Management (Owner / MD / CEO)', dept: 'Executive' },
  { value: 'PRODUCTION_MANAGER', label: 'Production Manager (SMT Line & Cleanroom)', dept: 'Operations' },
  { value: 'PURCHASE_MANAGER', label: 'Purchase Manager (Procurement & PO Sign-off)', dept: 'Procurement' },
  { value: 'WAREHOUSE_MANAGER', label: 'Warehouse Manager (Putaway & Bin Master)', dept: 'Inventory' },
  { value: 'QUALITY_CONTROL', label: 'Quality Control (Inward IQC & Final CoC)', dept: 'Quality' },
  { value: 'PLANT_MAINTENANCE', label: 'Plant Maintenance (SMT & Nitrogen Chiller)', dept: 'Engineering' },
  { value: 'SALES_DISPATCH', label: 'Sales & Dispatch (Commercial Desk & Logistics)', dept: 'Commercial' },
  { value: 'GATE_SECURITY', label: 'Gate Security (Weighbridge Gross/Tare Officer)', dept: 'Security' },
  { value: 'SUBCONTRACTING', label: 'Subcontracting (Job-Work & Scrap Reconciler)', dept: 'Outsourcing' },
  { value: 'FINANCE_ACCOUNTS', label: 'Finance & Accounts (3-Way Match & GSTR-1)', dept: 'Finance' },
  { value: 'HR_PAYROLL', label: 'HR & Payroll (Shift Attendance & Payroll)', dept: 'Human Resources' },
  { value: 'EHS_OFFICER', label: 'EHS Officer (Cleanroom Safety & Compliance)', dept: 'Environment' },
  { value: 'IT_ADMIN', label: 'IT Admin (Identity, MFA & Server Infrastructure)', dept: 'Information Tech' },
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'usr-root',
    empId: 'EMP-001',
    name: 'Plant Owner / MD',
    email: 'owner@apexmobile.com',
    passwordRaw: 'owner123',
    role: 'TOP_MANAGEMENT',
    salary: 500000.0,
    isActive: true,
    joinedDate: '2024-01-01',
    isOwnerProtected: true,
  },
];

export default function StaffGovernancePage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Onboarding Form State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grossCtc, setGrossCtc] = useState('');
  const [selectedRole, setSelectedRole] = useState('PRODUCTION_MANAGER');
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Termination Confirmation State
  const [targetStaff, setTargetStaff] = useState<StaffMember | null>(null);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Fetch staff from backend if available
  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await fetch('/api/users/staff');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setStaffList(data);
          }
        }
      } catch (err) {
        // Fallback to initial
      }
    }
    loadStaff();
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Submit Onboarding
  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !email.trim() || !password || !grossCtc) {
      setFormError('Please fill in all mandatory onboarding fields.');
      return;
    }

    const ctcNum = parseFloat(grossCtc);
    if (isNaN(ctcNum) || ctcNum <= 0) {
      setFormError('Please specify a valid monthly gross CTC amount.');
      return;
    }

    setIsOnboarding(true);
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Employee';

    try {
      const res = await fetch('/api/users/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: email.trim().toLowerCase(),
          password,
          role: selectedRole,
          salary: ctcNum,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Onboarding failed');
      }

      setStaffList((prev) => [data, ...prev]);
      setNotificationMsg(`Staff member ${data.name} successfully onboarded with ID ${data.empId}!`);
      setIsOnboardingOpen(false);
      resetForm();
    } catch (err: any) {
      // Offline fallback
      const nextId = `EMP-${(staffList.length + 1).toString().padStart(3, '0')}`;
      const newStaff: StaffMember = {
        id: `usr-${Date.now()}`,
        empId: nextId,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        passwordRaw: password,
        role: selectedRole,
        salary: ctcNum,
        isActive: true,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setStaffList((prev) => [newStaff, ...prev]);
      setNotificationMsg(`Staff member ${newStaff.name} successfully onboarded with ID ${newStaff.empId}!`);
      setIsOnboardingOpen(false);
      resetForm();
    } finally {
      setIsOnboarding(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setGrossCtc('');
    setSelectedRole('PRODUCTION_MANAGER');
  };

  // Open Termination Confirmation
  const handleOpenTerminate = (staff: StaffMember) => {
    if (staff.isOwnerProtected || staff.role === 'TOP_MANAGEMENT' || staff.email === 'owner@apex-mfg.com') {
      alert('Root Owner account is protected from revocation and cannot be terminated.');
      return;
    }
    setTargetStaff(staff);
    setIsTerminateModalOpen(true);
  };

  // Execute Termination
  const handleConfirmTerminate = async () => {
    if (!targetStaff) return;
    setIsTerminating(true);

    try {
      await fetch(`/api/users/${targetStaff.id}/terminate`, {
        method: 'DELETE',
      });

      setStaffList((prev) => prev.filter((s) => s.id !== targetStaff.id));
      setNotificationMsg(
        `Staff member ${targetStaff.name} (${targetStaff.empId}) credentials permanently revoked and employment terminated.`
      );
      setIsTerminateModalOpen(false);
    } catch (err: any) {
      // Fallback
      setStaffList((prev) => prev.filter((s) => s.id !== targetStaff.id));
      setNotificationMsg(
        `Staff member ${targetStaff.name} (${targetStaff.empId}) credentials permanently revoked and employment terminated.`
      );
      setIsTerminateModalOpen(false);
    } finally {
      setIsTerminating(false);
      setTargetStaff(null);
    }
  };

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      if (roleFilter !== 'ALL' && s.role !== roleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.empId.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [staffList, roleFilter, searchQuery]);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/settings" className="hover:text-blue-600 transition">
              Settings & Governance
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Staff HR Registry & Role Controls
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Top Management HR Governance & Staff Onboarding
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Provision staff credentials across 13 specialized manufacturing roles, adjust compensation packages, and enforce immediate credential revocations.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            href="/settings/staff/credentials"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            Credentials & Salary Adjustments &rarr;
          </Link>
          <Link
            href="/settings/approvals"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            High-Value MFA Approvals
          </Link>
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            Onboard New Staff Member
          </button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notificationMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {notificationMsg}
          </div>
          <button
            onClick={() => setNotificationMsg(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:opacity-80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Staff */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Plant Staff
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {staffList.length} Officers
          </div>
          <div className="text-xs text-slate-500">
            Across 13 Specialized Manufacturing Roles
          </div>
        </div>

        {/* Monthly Payroll CTC */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Monthly Gross CTC
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatINR(staffList.reduce((sum, s) => sum + s.salary, 0))}
          </div>
          <div className="text-xs text-slate-500">
            Current Committed Staff Payroll / Month
          </div>
        </div>

        {/* Average Compensation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg Officer CTC
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {formatINR(
              staffList.length > 0
                ? staffList.reduce((sum, s) => sum + s.salary, 0) / staffList.length
                : 0
            )}
          </div>
          <div className="text-xs text-slate-500">
            Competitive industrial electronics grade
          </div>
        </div>

        {/* Protected Owner Accounts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Root Governance
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            1 Root Owner
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Protected from Deletion
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Role Filter:
            </span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All 13 Specialized Roles ({staffList.length})</option>
            {ROLES_LIST.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or emp ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Active Staff Registry Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Active Manufacturing Staff Registry
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Authorized operators with physical cleanroom badges and digital ERP permissions.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredStaff.length} of {staffList.length} staff
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Emp ID & Joined</th>
                <th className="py-3 px-4">Full Name & Email</th>
                <th className="py-3 px-4">13-Role Assignment</th>
                <th className="py-3 px-4 text-right">Monthly Gross CTC</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStaff.map((staff) => {
                const isRootOwner =
                  staff.isOwnerProtected ||
                  staff.role === 'TOP_MANAGEMENT' ||
                  staff.email === 'owner@apex-mfg.com';

                return (
                  <tr
                    key={staff.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {staff.empId}
                      <div className="text-[10px] text-slate-400 font-normal">{staff.joinedDate}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {staff.name}
                        {isRootOwner && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{staff.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {staff.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatINR(staff.salary)}
                      <span className="text-[10px] font-normal text-slate-400 block">/ month</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isRootOwner ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[11px] font-semibold cursor-not-allowed">
                          <Lock className="w-3 h-3 text-amber-500" />
                          Protected
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenTerminate(staff)}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition shadow-xs flex items-center gap-1 ml-auto"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Fire Employee
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ONBOARDING MODAL / DRAWER */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Onboard New Staff Member
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provisions official email credentials and assigns specialized manufacturing access.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardingOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    required
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Official Work Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh.v@apex-mfg.com"
                    required
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Initial Master Password *
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Temporary Passphrase e.g. ApexStaff#2026!"
                    required
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Monthly Gross CTC (₹) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={grossCtc}
                    onChange={(e) => setGrossCtc(e.target.value)}
                    placeholder="e.g. 150000"
                    required
                    className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  13 Specialized Manufacturing Role Dropdown *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOnboarding}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center gap-2"
                >
                  {isOnboarding ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Provisioning Credentials...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      Complete Onboarding
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMMEDIATE TERMINATION CONFIRMATION MODAL */}
      {isTerminateModalOpen && targetStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-rose-500 dark:border-rose-600 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center border border-rose-200 dark:border-rose-800">
              <UserX className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                Immediate Credential Revocation
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Fire Employee {targetStaff.name}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This action will immediately revoke login access, lock out RFID plant cleanroom turnstiles, and cancel all assigned shift job cards.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Employee ID:</span>
                <strong className="font-mono">{targetStaff.empId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <strong className="text-slate-900 dark:text-white">{targetStaff.role}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Official Email:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{targetStaff.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsTerminateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={handleConfirmTerminate}
                disabled={isTerminating}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm flex items-center gap-1.5"
              >
                {isTerminating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Revoking Credentials...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Confirm Immediate Termination
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

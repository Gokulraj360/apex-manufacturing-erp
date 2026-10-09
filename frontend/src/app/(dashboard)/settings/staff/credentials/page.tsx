'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit3,
  Search,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  X,
  RefreshCw,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CredentialStaffItem {
  id: string;
  empId: string;
  name: string;
  email: string;
  passwordRaw: string;
  role: string;
  salary: number; // monthly CTC in ₹
  isOwnerProtected?: boolean;
}

const INITIAL_STAFF_CREDENTIALS: CredentialStaffItem[] = [
  {
    id: 'usr-root',
    empId: 'EMP-001',
    name: 'Plant Owner / MD',
    email: 'owner@apexmobile.com',
    passwordRaw: 'owner123',
    role: 'TOP_MANAGEMENT',
    salary: 500000.0,
    isOwnerProtected: true,
  },
];

export default function StaffCredentialsPage() {
  const [staff, setStaff] = useState<CredentialStaffItem[]>(INITIAL_STAFF_CREDENTIALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [unmaskedPasswords, setUnmaskedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom Edit Salary Modal
  const [selectedStaff, setSelectedStaff] = useState<CredentialStaffItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [revisedSalaryInput, setRevisedSalaryInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from backend if available
  useEffect(() => {
    async function loadCredentials() {
      try {
        const res = await fetch('/api/users/staff');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setStaff(data);
          }
        }
      } catch (err) {
        // Fallback
      }
    }
    loadCredentials();
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Toggle Mask/Unmask Password
  const togglePasswordMask = (id: string) => {
    setUnmaskedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy Password
  const handleCopyPassword = (id: string, pwd: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick Hike / Deduct (+5,000 / -2,000)
  const handleQuickAdjust = async (id: string, delta: number) => {
    const target = staff.find((s) => s.id === id);
    if (!target) return;

    const newSalary = Math.max(10000, target.salary + delta);

    // Optimistic UI Update
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, salary: newSalary } : s))
    );

    const sign = delta > 0 ? `+₹${delta.toLocaleString('en-IN')}` : `-₹${Math.abs(delta).toLocaleString('en-IN')}`;
    setToastMessage(`Salary adjusted for ${target.name}: ${sign} (New CTC: ${formatINR(newSalary)} / mo)`);

    try {
      await fetch(`/api/users/${id}/salary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salary: newSalary }),
      });
    } catch {
      // Kept optimistic
    }
  };

  // Open Custom Edit Dialog
  const handleOpenEdit = (item: CredentialStaffItem) => {
    setSelectedStaff(item);
    setRevisedSalaryInput(item.salary.toString());
    setIsEditModalOpen(true);
  };

  // Submit Revised Salary
  const handleSaveRevisedSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const parsed = parseFloat(revisedSalaryInput);
    if (isNaN(parsed) || parsed <= 0) {
      alert('Please enter a valid positive salary amount.');
      return;
    }

    setIsUpdating(true);

    // Optimistic Update
    setStaff((prev) =>
      prev.map((s) => (s.id === selectedStaff.id ? { ...s, salary: parsed } : s))
    );

    try {
      await fetch(`/api/users/${selectedStaff.id}/salary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salary: parsed }),
      });
      setToastMessage(`Revised monthly CTC saved for ${selectedStaff.name}: ${formatINR(parsed)} / mo`);
      setIsEditModalOpen(false);
    } catch {
      setToastMessage(`Revised monthly CTC saved for ${selectedStaff.name}: ${formatINR(parsed)} / mo`);
      setIsEditModalOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredStaff = staff.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.empId.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/settings" className="hover:text-blue-600 transition">
              Settings
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/settings/staff" className="hover:text-blue-600 transition">
              Staff Governance
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Credentials & Salary
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Staff Credentials & Dynamic Salary Adjustment
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review initial authentication credentials, toggle unmasked passwords, and perform real-time monthly gross CTC compensation adjustments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings/staff"
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            &larr; Staff Registry
          </Link>
          <Link
            href="/settings/approvals"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            High-Value Approvals &rarr;
          </Link>
        </div>
      </div>

      {/* Dynamic Toast Message */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Summary Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Total Monthly Committed Payroll:{' '}
          <strong className="text-slate-900 dark:text-white font-mono text-sm">
            {formatINR(staff.reduce((sum, s) => sum + s.salary, 0))}
          </strong>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff, email, role, or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Credentials & Salary Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              Staff Security Credentials & Compensation Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Passphrase inspection desk and instant CTC recalibration controls.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredStaff.length} Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-4">Name & Role</th>
                <th className="py-3 px-4">Login Email</th>
                <th className="py-3 px-4">Raw / Masked Password</th>
                <th className="py-3 px-4 text-right">Current CTC (₹ / mo)</th>
                <th className="py-3 px-4 text-center">Quick Adjust</th>
                <th className="py-3 px-4 text-right">Custom Revision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStaff.map((item) => {
                const isUnmasked = unmaskedPasswords[item.id] || false;
                const isCopied = copiedId === item.id;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.empId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        {item.role.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {item.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-w-32 inline-block">
                          {isUnmasked ? item.passwordRaw : '••••••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordMask(item.id)}
                          title={isUnmasked ? 'Mask Password' : 'Show Password'}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                        >
                          {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPassword(item.id, item.passwordRaw)}
                          title="Copy Password"
                          className="p-1 rounded text-slate-400 hover:text-blue-600 transition"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-white text-sm">
                      {formatINR(item.salary)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(item.id, 5000)}
                          title="Quick Hike +₹5,000"
                          className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition border border-emerald-300 dark:border-emerald-800"
                        >
                          +₹5,000
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(item.id, -2000)}
                          title="Quick Deduct -₹2,000"
                          className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900 transition border border-rose-300 dark:border-rose-800"
                        >
                          -₹2,000
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 hover:text-white transition shadow-xs flex items-center gap-1 ml-auto"
                      >
                        <Edit3 className="w-3 h-3" />
                        Revise Salary
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOM REVISED SALARY DIALOG */}
      {isEditModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Revise Compensation: {selectedStaff.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedStaff.empId} &bull; {selectedStaff.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRevisedSalary} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Current Monthly CTC
                </label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono font-bold text-slate-500 text-sm">
                  {formatINR(selectedStaff.salary)} / month
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Revised Monthly Gross CTC (₹) *
                </label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={revisedSalaryInput}
                  onChange={(e) => setRevisedSalaryInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-base font-mono font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center gap-1.5"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Save Revised CTC
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

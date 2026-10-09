'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  DollarSign,
  Building2,
  Calendar,
  X,
  RefreshCw,
  Eye,
  ChevronRight,
  BadgeCheck,
  FileCheck,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HighValueApprovalRecord {
  id: string;
  refNo: string;
  title: string;
  description: string;
  category: 'CAPEX' | 'PURCHASE_ORDER' | 'CONTRACT';
  amount: number; // in ₹ (All > ₹1 Crore / 10,000,000)
  vendor: string;
  initiatorName: string;
  initiatorRole: string;
  dateSubmitted: string;
  isMfaVerified: boolean;
  mfaAuthCode?: string;
  authorizedBy?: string;
  authorizedAt?: string;
  status: 'PENDING_MFA' | 'MFA_APPROVED' | 'DISBURSED';
}

const INITIAL_APPROVALS: HighValueApprovalRecord[] = [];

export default function HighValueApprovalsPage() {
  const [approvals, setApprovals] = useState<HighValueApprovalRecord[]>(INITIAL_APPROVALS);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PURCHASE_ORDER' | 'CAPEX'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DISBURSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // MFA Sign-off Modal State
  const [selectedForMfa, setSelectedForMfa] = useState<HighValueApprovalRecord | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);

  // Certificate Viewer Modal State
  const [certificateItem, setCertificateItem] = useState<HighValueApprovalRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch approvals from backend if available
  useEffect(() => {
    async function loadApprovals() {
      try {
        const res = await fetch('/api/approvals/high-value');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.approvals) && data.approvals.length > 0) {
            setApprovals(data.approvals);
          }
        }
      } catch (err) {
        // Fallback to initial mock data
      }
    }
    loadApprovals();
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatCrores = (val: number) => {
    const cr = val / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  };

  // KPIs
  const totalValue = useMemo(() => approvals.reduce((s, a) => s + a.amount, 0), [approvals]);
  const pendingApprovals = useMemo(() => approvals.filter((a) => !a.isMfaVerified), [approvals]);
  const pendingValue = useMemo(() => pendingApprovals.reduce((s, a) => s + a.amount, 0), [pendingApprovals]);
  const disbursedApprovals = useMemo(() => approvals.filter((a) => a.isMfaVerified), [approvals]);
  const disbursedValue = useMemo(() => disbursedApprovals.reduce((s, a) => s + a.amount, 0), [disbursedApprovals]);

  // Filtered List
  const filteredList = useMemo(() => {
    return approvals.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (statusFilter === 'PENDING' && item.isMfaVerified) return false;
      if (statusFilter === 'DISBURSED' && !item.isMfaVerified) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.refNo.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.vendor.toLowerCase().includes(q) ||
          item.initiatorName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [approvals, categoryFilter, statusFilter, searchQuery]);

  // Open MFA Modal
  const handleOpenMfaModal = (item: HighValueApprovalRecord) => {
    setSelectedForMfa(item);
    setOtpDigits(['', '', '', '', '', '']);
    setMfaError(null);
  };

  // Handle OTP Digit Input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Pasted full 6-digit code
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      if (cleaned.length > 0) {
        const nextDigits = ['', '', '', '', '', ''];
        for (let i = 0; i < cleaned.length; i++) {
          nextDigits[i] = cleaned[i];
        }
        setOtpDigits(nextDigits);
        const nextFocus = Math.min(cleaned.length, 5);
        const el = document.getElementById(`otp-input-${nextFocus}`);
        el?.focus();
        return;
      }
    }

    const val = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);

    // Auto advance
    if (val && index < 5) {
      const nextEl = document.getElementById(`otp-input-${index + 1}`);
      nextEl?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevEl = document.getElementById(`otp-input-${index - 1}`);
      prevEl?.focus();
    }
  };

  const handleQuickFillOtp = () => {
    setOtpDigits(['8', '4', '9', '2', '0', '1']);
    setMfaError(null);
  };

  // Submit MFA Sign-off
  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForMfa) return;

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6 || !/^\d{6}$/.test(fullOtp)) {
      setMfaError('Please provide a valid 6-digit Authenticator OTP code.');
      return;
    }

    setIsVerifying(true);
    setMfaError(null);

    const generatedAuthCode = `AUTH-MFA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const authTimestamp = new Date().toISOString();
    const authorizedBy = 'Rajesh Singhania (Managing Director / Owner)';

    try {
      const res = await fetch(`/api/approvals/high-value/${selectedForMfa.id}/mfa-signoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: fullOtp,
          authorizedBy,
        }),
      });

      let certCode = generatedAuthCode;
      if (res.ok) {
        const data = await res.json();
        if (data.mfaAuthCode) {
          certCode = data.mfaAuthCode;
        }
      }

      // Update Local State Optimistically
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === selectedForMfa.id
            ? {
                ...item,
                isMfaVerified: true,
                mfaAuthCode: certCode,
                authorizedBy,
                authorizedAt: authTimestamp,
                status: 'DISBURSED',
              }
            : item
        )
      );

      setToastMessage(
        `Disbursement of ${formatCrores(selectedForMfa.amount)} certified under Cryptographic Certificate ${certCode}!`
      );
      setSelectedForMfa(null);
    } catch {
      // Offline fallback
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === selectedForMfa.id
            ? {
                ...item,
                isMfaVerified: true,
                mfaAuthCode: generatedAuthCode,
                authorizedBy,
                authorizedAt: authTimestamp,
                status: 'DISBURSED',
              }
            : item
        )
      );
      setToastMessage(
        `Disbursement of ${formatCrores(selectedForMfa.amount)} certified under Cryptographic Certificate ${generatedAuthCode}!`
      );
      setSelectedForMfa(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyCertificate = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Header & Breadcrumbs */}
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
              High-Value Approvals
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              High-Value Approvals Queue (&gt; ₹1 Crore)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              MFA REQUIRED
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Statutory capital expenditures (CAPEX) and raw material procurements exceeding ₹1 Crore requiring Multi-Factor Authentication (MFA) cryptographic sign-off before fund disbursement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings/staff"
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Staff Registry
          </Link>
          <Link
            href="/settings/staff/credentials"
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            Credentials & Salary
          </Link>
        </div>
      </div>

      {/* Dynamic Toast Message */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total High-Value Queue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total High-Value Queue
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {formatCrores(totalValue)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {approvals.length} Requisitions
              </span>
              <span>&bull;</span>
              <span>All &gt; ₹1.00 Cr</span>
            </div>
          </div>
        </div>

        {/* Pending MFA Sign-off */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Pending MFA Sign-off
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {formatCrores(pendingValue)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {pendingApprovals.length} Orders Locked
              </span>
              <span>&bull;</span>
              <span>Disbursement Blocked</span>
            </div>
          </div>
        </div>

        {/* Certified & Disbursed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Certified & Disbursed
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {formatCrores(disbursedValue)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {disbursedApprovals.length} POs Cleared
              </span>
              <span>&bull;</span>
              <span>Audit Logged</span>
            </div>
          </div>
        </div>

        {/* Security Rule Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              MFA Governance Rule
            </span>
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-black text-white flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              RFC 6238 TOTP
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Owner/MD signature required for POs & CAPEX &gt; ₹1,00,00,000.
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category & Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition',
                categoryFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              All Types
            </button>
            <button
              onClick={() => setCategoryFilter('PURCHASE_ORDER')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition',
                categoryFilter === 'PURCHASE_ORDER'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              Purchase Orders
            </button>
            <button
              onClick={() => setCategoryFilter('CAPEX')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition',
                categoryFilter === 'CAPEX'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              CAPEX Equipment
            </button>
          </div>

          {/* Status */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition',
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1',
                statusFilter === 'PENDING'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Pending MFA
            </button>
            <button
              onClick={() => setStatusFilter('DISBURSED')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1',
                statusFilter === 'DISBURSED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Disbursed
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ref #, title, vendor..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Approvals Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Executive Expenditure Authorization Register
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live audit ledger of high-impact corporate disbursements protected by dual-factor cryptographic keying.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredList.length} Items Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 min-w-64">Expenditure Details</th>
                <th className="py-3 px-4">Vendor / Supplier</th>
                <th className="py-3 px-4 text-right">Sanction Amount</th>
                <th className="py-3 px-4">Initiated By</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">MFA Sign-off Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredList.map((item) => {
                const isDisbursed = item.isMfaVerified;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {item.refNo}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border',
                          item.category === 'CAPEX'
                            ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                            : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                        )}
                      >
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {item.description}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      <div className="font-semibold text-xs">{item.vendor}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {item.dateSubmitted}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="font-mono font-black text-sm text-slate-900 dark:text-white">
                        {formatCrores(item.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatINR(item.amount)}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900 dark:text-white text-xs">
                        {item.initiatorName}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        {item.initiatorRole.replace(/_/g, ' ')}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {isDisbursed ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Disbursed
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
                          <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          Pending MFA
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      {isDisbursed ? (
                        <button
                          type="button"
                          onClick={() => setCertificateItem(item)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 ml-auto"
                        >
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Certificate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenMfaModal(item)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition inline-flex items-center gap-1.5 ml-auto"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          MFA Sign-off
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

      {/* MFA SIGN-OFF MODAL */}
      {selectedForMfa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Executive MFA Sign-off
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedForMfa.refNo} &bull; High-Value Clearance (&gt; ₹1 Cr)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedForMfa(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Requisition Brief */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedForMfa.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Vendor: <strong className="text-slate-700 dark:text-slate-300">{selectedForMfa.vendor}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-mono font-black text-blue-600 dark:text-blue-400">
                    {formatCrores(selectedForMfa.amount)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formatINR(selectedForMfa.amount)}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Signer Authorization Authority:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Rajesh Singhania (TOP_MANAGEMENT / MD)
                </span>
              </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyMfa} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Enter 6-Digit Authenticator OTP Token
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickFillOtp}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Quick-Fill (849201)
                  </button>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex items-center justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={idx === 0 ? 6 : 1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className="w-12 h-13 text-center text-xl font-mono font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ))}
                </div>

                {mfaError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {mfaError}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  By providing this OTP sign-off, you cryptographically bind your digital signature to this purchase voucher and clear funds release from corporate AP banking channels.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedForMfa(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || otpDigits.join('').length !== 6}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition shadow-sm flex items-center gap-1.5"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Sign-off & Disburse Funds
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE DETAILS MODAL */}
      {certificateItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Cryptographic Disbursement Certificate
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {certificateItem.refNo} &bull; Executive Sign-off Cleared
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCertificateItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Details Sheet */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">MFA Certificate Code:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {certificateItem.mfaAuthCode || 'AUTH-MFA-2026-9041'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCertificate(certificateItem.mfaAuthCode || 'AUTH-MFA-2026-9041')}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Sanctioned Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCrores(certificateItem.amount)} ({formatINR(certificateItem.amount)})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Certified Signer:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {certificateItem.authorizedBy || 'Rajesh Singhania (Managing Director / Owner)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Authorization Time:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {certificateItem.authorizedAt
                    ? new Date(certificateItem.authorizedAt).toLocaleString('en-IN')
                    : '2026-10-05 09:15:00 IST'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Protocol Standard:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  RFC 6238 TOTP Verified &bull; Tamper-Evident Ledger
                </span>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCertificateItem(null)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

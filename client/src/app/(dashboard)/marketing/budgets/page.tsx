'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Send,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
} from 'lucide-react';
import {
  AdvertisingBudgetItem,
  BudgetApprovalStatus,
} from '@/types/marketing';

const INITIAL_BUDGETS: AdvertisingBudgetItem[] = [
  {
    id: 'bgt-1',
    budgetId: 'ADV-BGT-26011',
    eventName: 'IMTEX 2026 Prime Island Pavilion Stall',
    category: 'EXPO_STALL',
    proposedAmount: 25000,
    approvedAmount: 25000,
    vendorOrPlatform: 'Bangalore International Exhibition Centre',
    approvalStatus: 'DISBURSED',
    submittedToFinanceAt: '2026-01-20T10:00:00Z',
    approvedByFinance: 'Finance Controller (R. Kulkarni)',
    approvedAt: '2026-01-22T14:00:00Z',
    journalEntryRef: 'JV-2026-0891',
    requestedBy: 'Vikram Sethi',
    justification: 'Flagship biennial exhibition generating >$500k in qualified plant OEM deals.',
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-22T14:00:00Z',
  },
  {
    id: 'bgt-2',
    budgetId: 'ADV-BGT-26018',
    eventName: 'Q2 Precision Tooling Catalog Print Run (2,000 Copies)',
    category: 'BROCHURE_PRINTING',
    proposedAmount: 4800,
    approvedAmount: 4500,
    vendorOrPlatform: 'Omega Fine Prints Ltd',
    approvalStatus: 'ACCOUNTS_APPROVED',
    submittedToFinanceAt: '2026-02-25T11:00:00Z',
    approvedByFinance: 'Finance Controller (R. Kulkarni)',
    approvedAt: '2026-02-28T09:30:00Z',
    journalEntryRef: 'JV-2026-0945',
    requestedBy: 'Ananya Roy',
    justification: 'Physical technical catalogs for distribution to plant visits and distributor networks.',
    createdAt: '2026-02-24T12:00:00Z',
    updatedAt: '2026-02-28T09:30:00Z',
  },
  {
    id: 'bgt-3',
    budgetId: 'ADV-BGT-26021',
    eventName: 'Google Search & LinkedIn Ads Q2 Budget',
    category: 'DIGITAL_MEDIA_BUY',
    proposedAmount: 18000,
    approvedAmount: null,
    vendorOrPlatform: 'Google Ads & LinkedIn Business',
    approvalStatus: 'SUBMITTED_TO_ACCOUNTS',
    submittedToFinanceAt: '2026-03-03T16:00:00Z',
    requestedBy: 'Vikram Sethi',
    justification: 'Targeted high-intent search terms: "AS9100 CNC machining", "custom gearbox tooling".',
    createdAt: '2026-03-03T15:30:00Z',
    updatedAt: '2026-03-03T16:00:00Z',
  },
  {
    id: 'bgt-4',
    budgetId: 'ADV-BGT-26025',
    eventName: 'National Aerospace Manufacturing Conclave Sponsorship',
    category: 'SPONSORSHIP',
    proposedAmount: 12000,
    approvedAmount: null,
    vendorOrPlatform: 'Aerospace Engineering Society of India',
    approvalStatus: 'DRAFT',
    requestedBy: 'Vikram Sethi',
    justification: 'Silver tier sponsorship with keynote speaking slot on lightweight aero alloys.',
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-05T10:00:00Z',
  },
];

export default function AdvertisingBudgetsPage() {
  const [budgets, setBudgets] = useState<AdvertisingBudgetItem[]>(INITIAL_BUDGETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [selectedBudgetForFinance, setSelectedBudgetForFinance] = useState<AdvertisingBudgetItem | null>(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    eventName: '',
    category: 'EXPO_STALL',
    proposedAmount: 10000,
    vendorOrPlatform: '',
    requestedBy: 'Marketing Lead',
    justification: '',
  });

  const [financeForm, setFinanceForm] = useState({
    approvalStatus: 'ACCOUNTS_APPROVED' as BudgetApprovalStatus,
    approvedAmount: 10000,
    approvedByFinance: 'Accounts Finance Controller',
    journalEntryRef: 'JV-2026-0992',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchBudgets = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/marketing/budgets');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBudgets(data);
        }
      }
    } catch (err) {
      console.warn('API fallback', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget: AdvertisingBudgetItem = {
      id: `bgt-${Date.now()}`,
      budgetId: `ADV-BGT-260${budgets.length + 30}`,
      eventName: createForm.eventName,
      category: createForm.category,
      proposedAmount: Number(createForm.proposedAmount),
      approvedAmount: null,
      vendorOrPlatform: createForm.vendorOrPlatform,
      approvalStatus: 'DRAFT',
      requestedBy: createForm.requestedBy,
      justification: createForm.justification,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/v1/marketing/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createForm,
          proposedAmount: Number(createForm.proposedAmount),
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setBudgets([newBudget, ...budgets]);
    setShowCreateModal(false);
    setNotification(`Budget proposal [${newBudget.budgetId}] created in DRAFT mode.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmitToFinance = async (budget: AdvertisingBudgetItem) => {
    try {
      await fetch(`/api/v1/marketing/budgets/${budget.id}/submit-to-finance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedBy: 'Marketing Lead' }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setBudgets((prev) =>
      prev.map((b) =>
        b.id === budget.id
          ? {
              ...b,
              approvalStatus: 'SUBMITTED_TO_ACCOUNTS',
              submittedToFinanceAt: new Date().toISOString(),
            }
          : b,
      ),
    );

    setNotification(`Budget [${budget.budgetId}] submitted to Accounts & Finance gateway!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFinanceSignOff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudgetForFinance) return;

    try {
      await fetch(`/api/v1/marketing/budgets/${selectedBudgetForFinance.id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalStatus: financeForm.approvalStatus,
          approvedAmount: Number(financeForm.approvedAmount),
          approvedByFinance: financeForm.approvedByFinance,
          journalEntryRef: financeForm.journalEntryRef,
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setBudgets((prev) =>
      prev.map((b) =>
        b.id === selectedBudgetForFinance.id
          ? {
              ...b,
              approvalStatus: financeForm.approvalStatus,
              approvedAmount: Number(financeForm.approvedAmount),
              approvedByFinance: financeForm.approvedByFinance,
              approvedAt: new Date().toISOString(),
              journalEntryRef: financeForm.journalEntryRef,
            }
          : b,
      ),
    );

    setShowFinanceModal(false);
    setNotification(
      `Budget [${selectedBudgetForFinance.budgetId}] updated by Accounts: ${financeForm.approvalStatus} ($${Number(financeForm.approvedAmount).toLocaleString()})`,
    );
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredBudgets = budgets.filter((b) => {
    const matchesSearch =
      b.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.budgetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vendorOrPlatform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.journalEntryRef && b.journalEntryRef.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || b.approvalStatus === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalProposed = budgets.reduce((acc, b) => acc + Number(b.proposedAmount), 0);
  const totalApproved = budgets.reduce((acc, b) => acc + Number(b.approvedAmount || 0), 0);
  const pendingCount = budgets.filter((b) => b.approvalStatus === 'SUBMITTED_TO_ACCOUNTS').length;
  const disbursedAmount = budgets
    .filter((b) => b.approvalStatus === 'DISBURSED')
    .reduce((acc, b) => acc + Number(b.approvedAmount || b.proposedAmount), 0);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/marketing" className="hover:text-amber-400">
              Marketing
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-200">Advertising & Event Budgets</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Advertising & Event Budget Approvals
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Accounts Reconciled
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Track promotional expenditures, trade show stall rentals, digital ad buys & finance GL voucher sign-offs
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBudgets}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New Expense Proposal
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Proposed Initiatives</span>
          <span className="text-xl font-black text-white mt-1 block">
            ${(totalProposed / 1000).toFixed(1)}k
          </span>
          <span className="text-[11px] text-slate-500">{budgets.length} total budget proposals</span>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-blue-400 block font-medium">Finance Approved</span>
          <span className="text-xl font-black text-blue-300 mt-1 block">
            ${(totalApproved / 1000).toFixed(1)}k
          </span>
          <span className="text-[11px] text-slate-500">Sign-off by accounts controller</span>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-amber-400 block font-medium">Pending Sign-Off</span>
          <span className="text-xl font-black text-amber-300 mt-1 block">
            {pendingCount} Item{pendingCount !== 1 ? 's' : ''}
          </span>
          <span className="text-[11px] text-slate-500">Submitted to finance gateway</span>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-emerald-400 block font-medium">Disbursed to Vendors</span>
          <span className="text-xl font-black text-emerald-400 mt-1 block">
            ${(disbursedAmount / 1000).toFixed(1)}k
          </span>
          <span className="text-[11px] text-slate-500">Voucher & payment executed</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search event, vendor, journal voucher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#090d16] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              <option value="ALL">All Categories</option>
              <option value="EXPO_STALL">Expo Stall Rental</option>
              <option value="DIGITAL_MEDIA_BUY">Digital Media Buy</option>
              <option value="BROCHURE_PRINTING">Brochure Printing</option>
              <option value="SPONSORSHIP">Event Sponsorship</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Finance Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED_TO_ACCOUNTS">Submitted to Accounts</option>
              <option value="ACCOUNTS_APPROVED">Accounts Approved</option>
              <option value="DISBURSED">Disbursed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Budgets List Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Budget ID / Event</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor / Platform</th>
                <th className="py-3 px-4">Proposed Amount</th>
                <th className="py-3 px-4">Approved Amount</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4">Finance Reconcile</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredBudgets.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-amber-400 font-bold text-[11px]">{b.budgetId}</div>
                    <div className="font-semibold text-white mt-0.5">{b.eventName}</div>
                    <div className="text-[10px] text-slate-500">By {b.requestedBy}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      {b.category.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    {b.vendorOrPlatform}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    ${b.proposedAmount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold">
                    {b.approvedAmount ? (
                      <span className="text-emerald-400">${b.approvedAmount.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        b.approvalStatus === 'DISBURSED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : b.approvalStatus === 'ACCOUNTS_APPROVED'
                          ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                          : b.approvalStatus === 'SUBMITTED_TO_ACCOUNTS'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : b.approvalStatus === 'REJECTED'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {b.approvalStatus.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {b.journalEntryRef ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        <span>{b.journalEntryRef}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">No Voucher Yet</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {b.approvalStatus === 'DRAFT' && (
                        <button
                          onClick={() => handleSubmitToFinance(b)}
                          className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold transition flex items-center gap-1"
                        >
                          <Send className="h-3 w-3" /> Submit
                        </button>
                      )}

                      {b.approvalStatus === 'SUBMITTED_TO_ACCOUNTS' && (
                        <button
                          onClick={() => {
                            setSelectedBudgetForFinance(b);
                            setFinanceForm({
                              approvalStatus: 'ACCOUNTS_APPROVED',
                              approvedAmount: b.proposedAmount,
                              approvedByFinance: 'Accounts Finance Controller',
                              journalEntryRef: `JV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                            });
                            setShowFinanceModal(true);
                          }}
                          className="px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-semibold transition flex items-center gap-1"
                        >
                          <ShieldCheck className="h-3 w-3" /> Finance Review
                        </button>
                      )}

                      {(b.approvalStatus === 'ACCOUNTS_APPROVED' || b.approvalStatus === 'DISBURSED') && (
                        <button
                          onClick={() => {
                            setSelectedBudgetForFinance(b);
                            setFinanceForm({
                              approvalStatus: 'DISBURSED',
                              approvedAmount: b.approvedAmount || b.proposedAmount,
                              approvedByFinance: b.approvedByFinance || 'Finance Controller',
                              journalEntryRef: b.journalEntryRef || `JV-2026-0992`,
                            });
                            setShowFinanceModal(true);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                        >
                          Voucher Details
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Expense Proposal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-400" />
                Draft Advertising & Promotional Budget Proposal
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Event / Initiative Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IMTEX 2026 Stall Rental, Q3 Google Search Ads"
                  value={createForm.eventName}
                  onChange={(e) => setCreateForm({ ...createForm, eventName: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Budget Category *</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="EXPO_STALL">Expo / Trade Show Stall</option>
                    <option value="DIGITAL_MEDIA_BUY">Digital Media Ad Buy</option>
                    <option value="BROCHURE_PRINTING">Brochure & Spec Sheet Printing</option>
                    <option value="SPONSORSHIP">Industrial Conclave Sponsorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Proposed Amount ($) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={createForm.proposedAmount}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, proposedAmount: Number(e.target.value) })
                    }
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Vendor / Media Platform *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore International Exhibition Centre, Google Ads"
                  value={createForm.vendorOrPlatform}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, vendorOrPlatform: e.target.value })
                  }
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Commercial Justification *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Expected ROI, lead volume targets, or distributor expansion rationale..."
                  value={createForm.justification}
                  onChange={(e) => setCreateForm({ ...createForm, justification: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                >
                  Save Draft Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Accounts Finance Sign-Off */}
      {showFinanceModal && selectedBudgetForFinance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  Accounts & Finance Approval Gateway
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Reviewing: {selectedBudgetForFinance.eventName} ({selectedBudgetForFinance.budgetId})
                </p>
              </div>
              <button onClick={() => setShowFinanceModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleFinanceSignOff} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Vendor:</span>
                  <span className="text-white font-medium">{selectedBudgetForFinance.vendorOrPlatform}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Proposed Amount:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    ${selectedBudgetForFinance.proposedAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Finance Decision *</label>
                  <select
                    value={financeForm.approvalStatus}
                    onChange={(e) =>
                      setFinanceForm({
                        ...financeForm,
                        approvalStatus: e.target.value as BudgetApprovalStatus,
                      })
                    }
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ACCOUNTS_APPROVED">Approve for Payment</option>
                    <option value="DISBURSED">Mark as Disbursed (Paid)</option>
                    <option value="REJECTED">Reject Proposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Approved Amount ($) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={financeForm.approvedAmount}
                    onChange={(e) =>
                      setFinanceForm({ ...financeForm, approvedAmount: Number(e.target.value) })
                    }
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">General Ledger Journal Voucher Ref *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JV-2026-0992"
                  value={financeForm.journalEntryRef}
                  onChange={(e) =>
                    setFinanceForm({ ...financeForm, journalEntryRef: e.target.value })
                  }
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Finance Sign-Off Authority</label>
                <input
                  type="text"
                  required
                  value={financeForm.approvedByFinance}
                  onChange={(e) =>
                    setFinanceForm({ ...financeForm, approvedByFinance: e.target.value })
                  }
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFinanceModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Commit Finance Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

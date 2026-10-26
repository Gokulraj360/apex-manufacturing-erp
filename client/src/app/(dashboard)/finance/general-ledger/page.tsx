'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Trash2,
  Send,
  Eye,
  Calendar,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ChartOfAccountItem, JournalEntryItem, AccountingPeriodItem } from '@/types/finance';

const initialAccounts: ChartOfAccountItem[] = [
  { id: 'acc-1', accountCode: '1010-CASH', accountName: 'Operating Checking - JPMorgan', accountType: 'ASSET', currency: 'USD', currentBalance: 3250000, isActive: true, isHeader: false },
  { id: 'acc-2', accountCode: '1020-AR', accountName: 'Accounts Receivable - Trade', accountType: 'ASSET', currency: 'USD', currentBalance: 1480000, isActive: true, isHeader: false },
  { id: 'acc-3', accountCode: '1030-INV', accountName: 'Raw Materials & Parts Inventory', accountType: 'ASSET', currency: 'USD', currentBalance: 2150000, isActive: true, isHeader: false },
  { id: 'acc-4', accountCode: '2010-AP', accountName: 'Accounts Payable - Trade Vendors', accountType: 'LIABILITY', currency: 'USD', currentBalance: 980000, isActive: true, isHeader: false },
  { id: 'acc-5', accountCode: '2020-TAX-PAYABLE', accountName: 'GST / Corporate Tax Withholdings', accountType: 'LIABILITY', currency: 'USD', currentBalance: 270000, isActive: true, isHeader: false },
  { id: 'acc-6', accountCode: '3010-EQUITY', accountName: 'Common Retained Earnings', accountType: 'EQUITY', currency: 'USD', currentBalance: 4290000, isActive: true, isHeader: false },
  { id: 'acc-7', accountCode: '4010-REVENUE', accountName: 'Titanium & Frame Fabrication Sales', accountType: 'REVENUE', currency: 'USD', currentBalance: 4850000, isActive: true, isHeader: false },
  { id: 'acc-8', accountCode: '5010-COGS', accountName: 'Direct Raw Materials & Ingot Scrappage', accountType: 'EXPENSE', currency: 'USD', currentBalance: 2620000, isActive: true, isHeader: false },
  { id: 'acc-9', accountCode: '5020-PAYROLL-EXP', accountName: 'Plant Shift Salaries & Wages Expense', accountType: 'EXPENSE', currency: 'USD', currentBalance: 890000, isActive: true, isHeader: false },
];

const initialPeriods: AccountingPeriodItem[] = [
  { id: 'p-1', periodName: '2026-OCT', startDate: '2026-10-01', endDate: '2026-10-31', isClosed: false },
  { id: 'p-2', periodName: '2026-SEP', startDate: '2026-09-01', endDate: '2026-09-30', isClosed: true, closedAt: '2026-10-02 23:59:59' },
  { id: 'p-3', periodName: '2026-AUG', startDate: '2026-08-01', endDate: '2026-08-31', isClosed: true, closedAt: '2026-09-03 23:59:59' },
];

const initialEntries: JournalEntryItem[] = [
  {
    id: 'je-1',
    entryNumber: 'JE-2026-0041',
    entryDate: '2026-10-07',
    memo: 'Weekly Plant Utility and Consumables Accrual',
    status: 'POSTED',
    totalDebit: 45000,
    totalCredit: 45000,
    sourceModule: 'MANUAL',
    postedAt: '2026-10-07 10:14:00',
    lines: [
      { accountId: 'acc-8', accountCode: '5010-COGS', debit: 45000, credit: 0, description: 'Power grid consumption' },
      { accountId: 'acc-4', accountCode: '2010-AP', debit: 0, credit: 45000, description: 'Payable to Energy Provider' },
    ],
  },
];

export default function GeneralLedgerPage() {
  const [accounts] = useState<ChartOfAccountItem[]>(initialAccounts);
  const [periods, setPeriods] = useState<AccountingPeriodItem[]>(initialPeriods);
  const [entries, setEntries] = useState<JournalEntryItem[]>(initialEntries);
  const [activeTab, setActiveTab] = useState<'ACCOUNTS' | 'ENTRIES' | 'PERIODS'>('ACCOUNTS');

  // New Journal Entry Modal State
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [entryMemo, setEntryMemo] = useState('');
  const [selectedPeriodId, setSelectedPeriodId] = useState(initialPeriods[0].id);
  const [lines, setLines] = useState([
    { accountId: 'acc-8', debit: 12500, credit: 0, description: 'Direct scrap loss adjustment' },
    { accountId: 'acc-3', debit: 0, credit: 12500, description: 'Reduction in raw parts stock' },
  ]);

  const totalDebit = lines.reduce((acc, l) => acc + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleAddLine = () => {
    setLines([...lines, { accountId: accounts[0].id, debit: 0, credit: 0, description: '' }]);
  };

  const handleRemoveLine = (idx: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    const newEntry: JournalEntryItem = {
      id: `je-${Date.now()}`,
      entryNumber: `JE-2026-00${entries.length + 42}`,
      entryDate: new Date().toISOString().split('T')[0],
      memo: entryMemo || 'Manual Double-Entry Adjustment',
      status: 'POSTED',
      totalDebit,
      totalCredit,
      sourceModule: 'MANUAL',
      postedAt: new Date().toISOString(),
      lines: lines.map((l) => {
        const acc = accounts.find((a) => a.id === l.accountId);
        return {
          ...l,
          accountCode: acc?.accountCode,
          accountName: acc?.accountName,
        };
      }),
    };

    setEntries([newEntry, ...entries]);
    setShowNewEntryModal(false);
    setEntryMemo('');
  };

  const handleToggleClosePeriod = (id: string) => {
    setPeriods((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isClosed: !p.isClosed, closedAt: !p.isClosed ? new Date().toISOString() : undefined } : p,
      ),
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-400" />
            General Ledger & Chart of Accounts
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Standard double-entry accounting engine, balanced journal entries, and period closing controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowNewEntryModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" /> New Journal Entry
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('ACCOUNTS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ACCOUNTS'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Chart of Accounts ({accounts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ENTRIES')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ENTRIES'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Journal Entries ({entries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PERIODS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'PERIODS'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Accounting Periods ({periods.length})
        </button>
      </div>

      {/* Tab Content: Chart of Accounts */}
      {activeTab === 'ACCOUNTS' && (
        <div className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Official Master Account Hierarchy
            </span>
            <span className="text-xs text-slate-400">Normal Balance Rules Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Title</th>
                  <th className="py-3 px-4">Category Type</th>
                  <th className="py-3 px-4">Currency</th>
                  <th className="py-3 px-4 text-right">Running Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {accounts.map((acc) => {
                  return (
                    <tr key={acc.id} className="hover:bg-slate-800/20">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {acc.accountCode}
                      </td>
                      <td className="py-3 px-4 text-slate-200">{acc.accountName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            acc.accountType === 'ASSET'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : acc.accountType === 'LIABILITY'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : acc.accountType === 'EQUITY'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : acc.accountType === 'REVENUE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {acc.accountType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{acc.currency}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        {formatCurrency(acc.currentBalance)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Journal Entries */}
      {activeTab === 'ENTRIES' && (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {entry.entryNumber}
                  </span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs font-semibold text-slate-200">
                    {entry.memo}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    {entry.entryDate}
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold uppercase">
                    {entry.status}
                  </span>
                </div>
              </div>

              {/* Lines Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Account</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Debit ($)</th>
                      <th className="py-2 px-3 text-right">Credit ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {entry.lines.map((line, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-mono font-medium text-white">
                          {line.accountCode}
                        </td>
                        <td className="py-2 px-3 text-slate-400">{line.description}</td>
                        <td className="py-2 px-3 text-right font-mono">
                          {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono">
                          {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-slate-700 font-semibold text-white">
                    <tr>
                      <td colSpan={2} className="py-2 px-3 text-right text-slate-400">
                        Balanced Total:
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-400">
                        {formatCurrency(entry.totalDebit)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-400">
                        {formatCurrency(entry.totalCredit)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Accounting Periods */}
      {activeTab === 'PERIODS' && (
        <div className="p-6 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                Accounting Periods & Fiscal Locks
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Closing a period locks all associated journal transactions and prevents retrospective tampering.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {periods.map((period) => (
              <div
                key={period.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    {period.periodName}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                        period.isClosed
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {period.isClosed ? 'Locked & Closed' : 'Open for Posting'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {period.startDate} &rarr; {period.endDate}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleClosePeriod(period.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    period.isClosed
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {period.isClosed ? (
                    <>
                      <Unlock className="h-3.5 w-3.5" /> Reopen Period
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" /> Finalize & Close Period
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Double-Entry Journal Entry */}
      {showNewEntryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Scale className="h-5 w-5 text-emerald-400" />
                Post Double-Entry Journal Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowNewEntryModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Memo / Transaction Purpose
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scrappage Revaluation"
                    value={entryMemo}
                    onChange={(e) => setEntryMemo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Accounting Period
                  </label>
                  <select
                    value={selectedPeriodId}
                    onChange={(e) => setSelectedPeriodId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {periods.filter((p) => !p.isClosed).map((p) => (
                      <option key={p.id} value={p.id}>{p.periodName} (Open)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Line Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Debits and Credits Allocation</span>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="h-3 w-3" /> Add Line
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {lines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <select
                        value={line.accountId}
                        onChange={(e) => {
                          const updated = [...lines];
                          updated[idx].accountId = e.target.value;
                          setLines(updated);
                        }}
                        className="w-48 bg-slate-800 text-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none border border-slate-700"
                      >
                        {accounts.map((a) => (
                          <option key={a.id} value={a.id}>{a.accountCode} - {a.accountName}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Line description"
                        value={line.description}
                        onChange={(e) => {
                          const updated = [...lines];
                          updated[idx].description = e.target.value;
                          setLines(updated);
                        }}
                        className="flex-1 bg-slate-800 text-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none border border-slate-700"
                      />

                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Debit"
                          value={line.debit || ''}
                          onChange={(e) => {
                            const updated = [...lines];
                            updated[idx].debit = parseFloat(e.target.value) || 0;
                            setLines(updated);
                          }}
                          className="w-full bg-slate-800 text-white text-xs rounded px-2 py-1.5 text-right font-mono focus:outline-none border border-slate-700"
                        />
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Credit"
                          value={line.credit || ''}
                          onChange={(e) => {
                            const updated = [...lines];
                            updated[idx].credit = parseFloat(e.target.value) || 0;
                            setLines(updated);
                          }}
                          className="w-full bg-slate-800 text-white text-xs rounded px-2 py-1.5 text-right font-mono focus:outline-none border border-slate-700"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveLine(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Balance Validation Status */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Total Debit: </span>
                  <strong className="text-slate-900 dark:text-white font-mono">{formatCurrency(totalDebit)}</strong>
                  <span className="text-slate-400 ml-4">Total Credit: </span>
                  <strong className="text-slate-900 dark:text-white font-mono">{formatCurrency(totalCredit)}</strong>
                </div>

                <div className="flex items-center gap-1.5 font-semibold">
                  {isBalanced ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Balanced & Valid
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" /> Imbalance: {formatCurrency(Math.abs(totalDebit - totalCredit))}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewEntryModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors"
                >
                  Commit & Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

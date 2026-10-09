'use client';

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Lock,
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  department: string;
  details: string;
  status: 'COMMITTED' | 'VERIFIED';
}

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const auditRecords: AuditEntry[] = [
    {
      id: 'AUD-001',
      timestamp: '2026-10-05 13:54:00',
      actor: 'Plant Owner / MD',
      role: 'TOP_MANAGEMENT',
      action: 'SYSTEM_CLEAN_SLATE_INITIALIZED',
      department: 'Executive Cleanroom Command',
      details: 'Clean slate initialization. Initial Super Admin / Root Seed verified (owner@apexmobile.com).',
      status: 'VERIFIED',
    },
    {
      id: 'AUD-002',
      timestamp: '2026-10-05 13:55:12',
      actor: 'Plant Owner / MD',
      role: 'TOP_MANAGEMENT',
      action: 'RBAC_SECURITY_ENFORCEMENT',
      department: 'IT & Infrastructure',
      details: 'Strict 13-role boundary isolation and Edge JWT middleware activated.',
      status: 'COMMITTED',
    },
  ];

  const filtered = auditRecords.filter((r) => {
    const matchesSearch =
      r.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || r.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Plant Audit Trail & Compliance Ledger
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Immutable system audit logs recording high-value approvals, CTC alterations, terminations, and security events.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting signed audit trail CSV...')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Export Signed Ledger
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search action code, actor, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Audit Log ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor & Role</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-bold text-blue-600">{rec.id}</td>
                  <td className="px-4 py-3 text-slate-500">{rec.timestamp}</td>
                  <td className="px-4 py-3 font-sans">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {rec.actor}
                    </div>
                    <div className="text-[10px] text-slate-400">{rec.role}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                      {rec.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-600 dark:text-slate-400">
                    {rec.department}
                  </td>
                  <td className="px-4 py-3 font-sans max-w-sm text-slate-700 dark:text-slate-300">
                    {rec.details}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

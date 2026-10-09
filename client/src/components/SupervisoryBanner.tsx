'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Eye,
  History,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface SupervisoryBannerProps {
  departmentName: string;
  departmentCode?: string;
  staffRoleTitle: string;
  onViewAuditFeed?: () => void;
}

export function SupervisoryBanner({
  departmentName,
  departmentCode,
  staffRoleTitle,
  onViewAuditFeed,
}: SupervisoryBannerProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-md relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute right-0 top-0 w-96 h-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              Super Admin Executive Oversight
            </span>
            {departmentCode && (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                {departmentCode}
              </span>
            )}
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
              <Eye className="h-3 w-3" /> Read-Only Supervisory View
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            Supervisory Read-Only Desk — {departmentName}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Direct operational data entry, manual stock movements, and technician transactions are executed by{' '}
            <strong className="text-indigo-200">{staffRoleTitle}</strong>. As Super Admin, you are granted full real-time telemetry, comprehensive read-only registers, live activity audit feeds, and high-value governance clearance authority.
          </p>
        </div>

        {/* Right Navigation & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
          {onViewAuditFeed && (
            <button
              type="button"
              onClick={onViewAuditFeed}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <History className="h-3.5 w-3.5" />
              <span>Department Audit Stream</span>
            </button>
          )}

          <Link
            href="/super-admin/audit-logs"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-300" />
            <span>Central Audit Trail</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

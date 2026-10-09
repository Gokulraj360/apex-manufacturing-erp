'use client';

import React from 'react';
import Link from 'next/link';
import {
  Factory,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  Cpu,
  UserCheck,
  Building2,
  DollarSign,
  Package,
  Wrench,
  Navigation,
  FileText,
  BarChart3,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ALL_ROLES } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { RoleActionAlerts } from '@/components/RoleActionAlerts';

export default function RoleDashboardPage({
  params,
}: {
  params: { role: string };
}) {
  const { session } = useAuth();

  const roleParam = params?.role;
  const roleDef = ALL_ROLES.find((r) => r.id === roleParam) || ALL_ROLES[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Role Header Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm relative overflow-hidden transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400">
                <Factory className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase font-mono">
                {roleDef.department}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                {roleDef.badge}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              {roleDef.name} Workspace
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              {roleDef.description}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <Link
              href={roleDef.dashboardRoute}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Open Main Work Desk</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Active Session Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Signed in as:</span>
            <strong className="text-slate-800 dark:text-slate-200 font-mono">
              {session?.username || roleDef.defaultUsername}
            </strong>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Machine Performance Active
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Work Area: <strong className="text-slate-700 dark:text-slate-300">Factory Hub 01</strong></span>
          </div>
        </div>
      </div>

      {/* Action Alerts & Interconnected Workflow Notifications Inbox */}
      <RoleActionAlerts roleId={roleDef.id} />

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium">
            <span>Team Work Queue</span>
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono mt-2">18 Tasks</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3 w-3" /> 98.4% On Time
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium">
            <span>Urgent Approvals Needed</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight font-mono mt-2">2 Pending</div>
          <div className="text-[11px] text-slate-400">Needs manager sign-off</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium">
            <span>Today&apos;s Phone Output Target</span>
            <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono mt-2">96.8%</div>
          <div className="text-[11px] text-slate-400">On track for shift goals</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium">
            <span>Machine Status</span>
            <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono mt-2">Optimal</div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-mono">0 Machine Errors</div>
        </div>
      </div>

      {/* Role Quick Launch Portals */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Quick Access Desks for {roleDef.name}
            </h3>
          </div>
          <span className="text-xs text-slate-400">Quick Links</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={roleDef.dashboardRoute}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-all group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {roleDef.name} Main Desk
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  Primary
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Main workplace with parts lists, live production charts, and everyday tools.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>Open Desk</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>

          <Link
            href="/super-admin/audit-logs"
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-slate-200 transition-colors">
                  Activity Logs & System Checks
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  Records
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Check user activity logs, login history, and system changes.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
              <span>View Activity Logs</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>

          <Link
            href="/pricing-control"
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition-all group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Product Parts Cost & Profit Margins
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Pricing
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                View product parts costs, factory overheads, and profit margins.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>View Cost & Profit Calculator</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

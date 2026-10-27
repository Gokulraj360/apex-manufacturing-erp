'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Server,
  Lock,
  Cpu,
  Database,
  Flame,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  HardDrive,
  Wifi,
  Terminal,
  Zap,
  RefreshCw,
  Sliders,
  Globe,
} from 'lucide-react';

const MOCK_SERVICES = [
  { name: 'Core NestJS ERP Gateway', port: 4000, status: 'HEALTHY', latency: '4ms', uptime: '99.99%', memory: '245 MB' },
  { name: 'PostgreSQL Database Engine', port: 5432, status: 'HEALTHY', latency: '2ms', uptime: '100%', memory: '2.4 GB' },
  { name: 'Web Route State Hydration Guard', port: 3000, status: 'HEALTHY', latency: '1ms', uptime: '100%', memory: '34 MB' },
  { name: 'MQTT Broker (Shop Floor IoT)', port: 1883, status: 'HEALTHY', latency: '6ms', uptime: '99.98%', memory: '110 MB' },
  { name: 'Redis Cache & Session Store', port: 6379, status: 'HEALTHY', latency: '1ms', uptime: '100%', memory: '85 MB' },
  { name: 'Nginx Reverse Proxy & SSL Vault', port: 443, status: 'HEALTHY', latency: '3ms', uptime: '100%', memory: '48 MB' },
  { name: 'Automated Backup Vault Daemon', port: 8089, status: 'IDLE', latency: '12ms', uptime: '99.95%', memory: '62 MB' },
];

const MOCK_HARDWARE_STATS = {
  barcodeScannersOnline: 18,
  barcodeScannersTotal: 18,
  scalesOnline: 6,
  scalesTotal: 6,
  iotVibrationSensorsOnline: 24,
  iotVibrationSensorsTotal: 25,
  touchTerminalsOnline: 12,
  touchTerminalsTotal: 12,
};

export default function SystemAdminOverviewPage() {
  const [services] = useState(MOCK_SERVICES);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="h-6 w-6 text-rose-500 dark:text-rose-400" />
              Technical Infrastructure & Systems Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              All Systems Operational
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            24/7 high-availability telemetry, PostgreSQL clustering, MQTT shop floor broker, automated backup vault, and cyber threat monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/system-admin/backups"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-colors"
          >
            <Database className="h-4 w-4" />
            Backup Vault
          </Link>
          <Link
            href="/system-admin/hardware-support"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 font-medium text-xs transition-colors"
          >
            <Headphones className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            Support Helpdesk
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-rose-200 dark:border-rose-500/30 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">Cluster Availability</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-500/20 flex items-center justify-center">
              <Server className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">99.99%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">30-day SLA</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>0 unhandled outages in 184 days</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">CPU & RAM Load</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Cpu className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">18%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">CPU &bull; 62% RAM</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400">
            <Activity className="h-3.5 w-3.5" />
            <span>16 vCPU &bull; 64 GB ECC Registered</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hardware & IoT Fleet</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Wifi className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">60/61</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">devices online</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>1 vibration sensor degraded (maint due)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cybersecurity Threat Def</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">0</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">active breaches</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>MFA enforced for 100% of staff</span>
          </div>
        </div>
      </div>

      {/* Quick Nav Modules */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          href="/system-admin/users"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-white">User Accounts & RBAC</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Permissions & MFA</p>
          </div>
        </Link>

        <Link
          href="/system-admin/integrations"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Cpu className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white">IoT Integrations</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Scales, scanners & MQTT</p>
          </div>
        </Link>

        <Link
          href="/system-admin/backups"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white">Backup Vault</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Disaster recovery & snapshots</p>
          </div>
        </Link>

        <Link
          href="/system-admin/backups"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Globe className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-white">Page Crash Recovery</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Instant rollback & self-heal</p>
          </div>
        </Link>

        <Link
          href="/system-admin/security"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-white">Cybersecurity & WAF</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Firewall & intrusion blocks</p>
          </div>
        </Link>

        <Link
          href="/system-admin/hardware-support"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Headphones className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-white">Hardware Helpdesk</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Touch terminals & printers</p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Server Node Health + Factory Floor Hardware Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Services Daemon Status Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-rose-500 dark:text-rose-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Cluster Microservices & Database Health</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Docker / Systemd Node 01
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3 font-semibold">Service Name</th>
                  <th className="py-2.5 px-3 font-semibold">Port</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Ping Latency</th>
                  <th className="py-2.5 px-3 font-semibold">Uptime</th>
                  <th className="py-2.5 px-3 font-semibold">Resident RAM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {services.map((svc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{svc.name}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">{svc.port}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {svc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-600 dark:text-cyan-300">{svc.latency}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{svc.uptime}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">{svc.memory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16]/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Primary Node: Host ID node-mfg-prod-01 &bull; Linux 6.8 LTS</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> All Daemons Synced
            </span>
          </div>
        </div>

        {/* Factory Floor Hardware Integration Telemetry */}
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Factory Floor Peripherals</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-medium">
              MQTT Active
            </span>
          </div>

          <div className="p-4 space-y-4 flex-1">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Barcode Scanners</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">GS1-128 / QR Handhelds</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {MOCK_HARDWARE_STATS.barcodeScannersOnline}/{MOCK_HARDWARE_STATS.barcodeScannersTotal}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">100% Online</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Weighbridge Scales</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Serial RS-232 / TCP Digitisers</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {MOCK_HARDWARE_STATS.scalesOnline}/{MOCK_HARDWARE_STATS.scalesTotal}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Calibrated</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Machine IoT Sensors</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Vibration, Temp & Current</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                    {MOCK_HARDWARE_STATS.iotVibrationSensorsOnline}/{MOCK_HARDWARE_STATS.iotVibrationSensorsTotal}
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 block">1 Offline (Bay 3)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Touch Terminals (Kiosks)</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Industrial IP65 Operator Consoles</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {MOCK_HARDWARE_STATS.touchTerminalsOnline}/{MOCK_HARDWARE_STATS.touchTerminalsTotal}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">100% Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16]/60">
            <Link
              href="/system-admin/integrations"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium flex items-center justify-center gap-1 w-full"
            >
              Configure Hardware Integrations &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

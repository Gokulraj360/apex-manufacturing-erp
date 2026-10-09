'use client';

import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  History,
  RefreshCw,
  Globe,
  Radio,
} from 'lucide-react';

export default function SecurityPage() {
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [sessionTimeoutMin, setSessionTimeoutMin] = useState(60);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const securityLogs = [
    {
      id: 'SEC-LOG-001',
      actor: 'owner@apexmobile.com',
      role: 'TOP_MANAGEMENT',
      ip: '192.168.10.45 (Local Plant WiFi)',
      event: 'Root Admin Authenticated via SHA-256 JWT',
      time: 'Just now',
      status: 'SUCCESS',
    },
    {
      id: 'SEC-LOG-002',
      actor: '10.0.4.12',
      role: 'UNKNOWN',
      ip: '10.0.4.12 (Subnet Scan)',
      event: 'Blocked Cross-Role Route Probe to /finance/gst',
      time: '12 mins ago',
      status: 'BLOCKED_403',
    },
  ];

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              System Security & User Access Control
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Role-Based Access Control (RBAC), MFA enforcement, and IT infrastructure event monitor.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Security governance policies updated and propagated across all plant nodes.
        </div>
      )}

      {/* Security Policies Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              Role Enforcement & Session Governance
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Configure perimeter isolation parameters and session invalidation timeouts.
            </p>

            <form onSubmit={handleSavePolicy} className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Mandatory MFA for High-Value Operations
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Require 6-digit Authenticator OTP for purchase orders &gt; ₹1 Crore and GSTR-1 filings.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={mfaEnforced}
                  onChange={(e) => setMfaEnforced(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  JWT Session Inactivity Timeout (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={480}
                  value={sessionTimeoutMin}
                  onChange={(e) => setSessionTimeoutMin(Number(e.target.value))}
                  className="w-full max-w-xs h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Save Security Policies
              </button>
            </form>
          </div>

          {/* Security Event Log */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <History className="h-4 w-4 text-slate-400" />
                Live IT Security Event Log
              </div>
              <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1">
                <Radio className="h-3 w-3 animate-pulse" /> Monitoring
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Event ID</th>
                    <th className="px-4 py-3">Actor / Principal</th>
                    <th className="px-4 py-3">Event Description</th>
                    <th className="px-4 py-3">IP Address</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {securityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-blue-600">{log.id}</td>
                      <td className="px-4 py-3 font-sans">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {log.actor}
                        </div>
                        <div className="text-[10px] text-slate-400">{log.role}</div>
                      </td>
                      <td className="px-4 py-3 font-sans max-w-xs truncate text-slate-700 dark:text-slate-300">
                        {log.event}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{log.ip}</td>
                      <td className="px-4 py-3 text-slate-500">{log.time}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Info Cards */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              <Smartphone className="h-4 w-4 text-blue-500" />
              MFA Hardware Key Vault
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Plant administrative roles (Top Management, Finance Head, IT Admin) utilize RFC 6238 TOTP algorithms with SHA-256 HMAC tokens.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Hardware Keystore Active
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              <Globe className="h-4 w-4 text-amber-500" />
              Geo-Fenced Biometric Range
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Industrial attendance scans enforce coordinate boundaries at 12.9716° N, 77.5946° E with a 50-meter cleanroom radius check.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

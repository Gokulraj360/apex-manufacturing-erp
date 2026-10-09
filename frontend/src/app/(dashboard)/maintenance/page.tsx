'use client';

import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Plus,
  Activity,
  ShieldCheck,
  Calendar,
  Tool,
} from 'lucide-react';

interface BreakdownTicket {
  id: string;
  machineId: string;
  machineName: string;
  line: string;
  issue: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  reportedAt: string;
  technician: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}

export default function MaintenancePage() {
  const [tickets, setTickets] = useState<BreakdownTicket[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    machineName: 'SMT Pick-and-Place Line 1',
    line: 'Cleanroom SMT Cell A',
    issue: '',
    priority: 'HIGH' as const,
    technician: 'Senior Electrical Technician',
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.issue.trim()) return;

    const newTicket: BreakdownTicket = {
      id: `BD-${Date.now().toString().slice(-4)}`,
      machineId: `MCH-${Math.floor(100 + Math.random() * 900)}`,
      machineName: form.machineName,
      line: form.line,
      issue: form.issue.trim(),
      priority: form.priority,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      technician: form.technician,
      status: 'OPEN',
    };

    setTickets([newTicket, ...tickets]);
    setForm({ ...form, issue: '' });
    setShowModal(false);
  };

  const handleResolve = (id: string) => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status: 'RESOLVED' } : t)));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Wrench className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Plant Maintenance & Breakdown Desk
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Preventive Maintenance (PM) schedules, MTTR tracking, and cleanroom machine breakdown logs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Log Machine Breakdown
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Active Breakdowns
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {tickets.filter((t) => t.status !== 'RESOLVED').length}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> All critical assets monitored
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Overall Plant OEE
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            94.6%
          </div>
          <div className="mt-1 text-[11px] text-blue-600 dark:text-blue-400">
            Target: 92.0% (+2.6%)
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Mean Time To Repair (MTTR)
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            18.4 min
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Average across last 30 days
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Upcoming PM Routines
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            4 Lines
          </div>
          <div className="mt-1 text-[11px] text-amber-500 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Next: Reflow Oven (Oct 10)
          </div>
        </div>
      </div>

      {/* Breakdown Tickets Register */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Live Breakdown & Service Ticket Register
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Total Logged: {tickets.length}
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No Active Breakdowns Logged
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              All plant machinery and cleanroom SMT lines are operating smoothly within normal thermal and calibration limits.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Machine & Line</th>
                  <th className="px-4 py-3">Reported Issue</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Technician</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-bold text-blue-600">{t.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">
                        {t.machineName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">{t.line}</div>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate font-sans">{t.issue}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : t.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-700 dark:text-slate-300">
                      {t.technician}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{t.reportedAt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {t.status !== 'RESOLVED' ? (
                        <button
                          onClick={() => handleResolve(t.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-sans font-semibold transition-colors"
                        >
                          Mark Cleared
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-sans">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal to Log Machine Breakdown */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
            <h2 className="text-base font-bold text-white mb-1">
              Log Machine Breakdown Ticket
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Dispatches an immediate maintenance work order to the plant toolroom.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Machine Asset
                </label>
                <select
                  value={form.machineName}
                  onChange={(e) => setForm({ ...form, machineName: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                >
                  <option>SMT Pick-and-Place Line 1</option>
                  <option>Nitrogen Reflow Oven (10-Zone)</option>
                  <option>Robotic Cleanroom Screwdriver Station</option>
                  <option>Display Optical Bonder Cell</option>
                  <option>RF Antenna Analyzer #03</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Shop Floor Location
                </label>
                <input
                  type="text"
                  value={form.line}
                  onChange={(e) => setForm({ ...form, line: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Breakdown Description / Failure Code
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.issue}
                  onChange={(e) => setForm({ ...form, issue: e.target.value })}
                  placeholder="e.g., Feeder jam on Component Reel #04, nozzle pressure drop..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Severity
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e: any) => setForm({ ...form, priority: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                  >
                    <option value="CRITICAL">CRITICAL (Line Stoppage)</option>
                    <option value="HIGH">HIGH (Degraded Output)</option>
                    <option value="NORMAL">NORMAL (Preventive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Assigned Technician
                  </label>
                  <input
                    type="text"
                    value={form.technician}
                    onChange={(e) => setForm({ ...form, technician: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

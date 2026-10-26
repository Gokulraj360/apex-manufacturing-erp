'use client';

import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Flame,
  Activity,
  Plus,
  ShieldAlert,
  Check,
  Server,
  RefreshCw,
} from 'lucide-react';
import { MachineItem, MaintenanceTicketItem } from '@/types/production';

const initialMachines: MachineItem[] = [
  {
    id: 'm-1',
    machineCode: 'CNC-HAAS-VF4',
    machineName: '5-Axis Vertical Machining Center #01',
    operatingHours: 1420.5,
    totalCycles: 28400,
    temperatureCelsius: 48.2,
    vibrationMmSec: 1.15,
    isOnline: true,
    lastTelemetricPing: 'Just Now',
  },
  {
    id: 'm-2',
    machineCode: 'ROBOT-KUKA-WELD-02',
    machineName: '6-Axis Orbital TIG Robotic Welder',
    operatingHours: 2150.0,
    totalCycles: 41200,
    temperatureCelsius: 52.0,
    vibrationMmSec: 0.85,
    isOnline: true,
    lastTelemetricPing: 'Just Now',
  },
  {
    id: 'm-3',
    machineCode: 'PRESS-KOMATSU-400T',
    machineName: 'Heavy Stamping Mechanical Press',
    operatingHours: 3410.2,
    totalCycles: 89000,
    temperatureCelsius: 61.4,
    vibrationMmSec: 2.45,
    isOnline: true,
    lastTelemetricPing: 'Just Now',
  },
  {
    id: 'm-4',
    machineCode: 'CNC-SPINDLE-DRIVE-04',
    machineName: 'Electro-Drive Sub-Station B Spindle',
    operatingHours: 980.1,
    totalCycles: 15400,
    temperatureCelsius: 89.5,
    vibrationMmSec: 4.82,
    isOnline: false,
    lastTelemetricPing: '12 mins ago',
  },
];

const initialTickets: MaintenanceTicketItem[] = [
  {
    id: 't-1',
    ticketNumber: 'MNT-2026-077',
    machineCode: 'CNC-SPINDLE-DRIVE-04',
    machineName: 'Electro-Drive Sub-Station B Spindle',
    priority: 'EMERGENCY',
    status: 'TECHNICIAN_ASSIGNED',
    issueDescription: 'Spindle motor thermal shutdown triggered by severe bearing friction and vibration spike (4.82 mm/s).',
    breakdownTime: '2026-10-07 12:45:00',
    assignedTechnician: 'Tech Lead Kowalski',
    rootCauseAnalysis: 'Lubricant delivery line blocked by metallic particulate buildup.',
  },
  {
    id: 't-2',
    ticketNumber: 'MNT-2026-076',
    machineCode: 'ROBOT-KUKA-WELD-02',
    machineName: '6-Axis Orbital TIG Robotic Welder',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    issueDescription: 'Argon shielding gas nozzle seal degradation causing micro arc fluctuations.',
    breakdownTime: '2026-10-06 14:10:00',
    assignedTechnician: 'Tech Diaz',
    rootCauseAnalysis: 'Scheduled ceramic cup and silicone O-ring replacement completed.',
  },
];

export default function MachineDowntimePage() {
  const [machines] = useState<MachineItem[]>(initialMachines);
  const [tickets, setTickets] = useState<MaintenanceTicketItem[]>(initialTickets);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [breakdownForm, setBreakdownForm] = useState({
    machineCode: 'CNC-HAAS-VF4',
    issueDescription: '',
    priority: 'HIGH' as const,
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();

    const newTicket: MaintenanceTicketItem = {
      id: `t-${Date.now()}`,
      ticketNumber: `MNT-2026-0${tickets.length + 78}`,
      machineCode: breakdownForm.machineCode,
      machineName: machines.find((m) => m.machineCode === breakdownForm.machineCode)?.machineName || breakdownForm.machineCode,
      priority: breakdownForm.priority,
      status: 'REPORTED',
      issueDescription: breakdownForm.issueDescription,
      breakdownTime: new Date().toISOString(),
    };

    setTickets([newTicket, ...tickets]);
    setShowBreakdownModal(false);
    setBreakdownForm({ machineCode: 'CNC-HAAS-VF4', issueDescription: '', priority: 'HIGH' });
  };

  const handleResolveTicket = (ticketNumber: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketNumber === ticketNumber
          ? { ...t, status: 'RESOLVED' as const }
          : t,
      ),
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wrench className="h-6 w-6 text-blue-500" />
            Machine Telemetry & Urgent Downtime Console
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time IoT spindle vibration analysis, thermal sensors, and emergency technician dispatch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBreakdownModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <AlertTriangle className="h-4 w-4" /> Report Machine Breakdown
        </button>
      </div>

      {/* Machine Fleet Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {machines.map((m) => {
          const isOverheating = m.temperatureCelsius > 75;
          const isVibrating = m.vibrationMmSec > 3.0;
          const isOffline = !m.isOnline;

          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-all ${
                isOffline
                  ? 'bg-red-950/20 border-red-500/40 shadow-sm'
                  : 'bg-[#0f172a] border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {m.machineCode}
                  </span>
                  <h4 className="text-xs font-semibold text-white mt-1 line-clamp-1">
                    {m.machineName}
                  </h4>
                </div>

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    m.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                  }`}
                  title={m.isOnline ? 'Online' : 'Offline Breakdown'}
                />
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-amber-400" /> Temp:
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      isOverheating ? 'text-red-400' : 'text-slate-200'
                    }`}
                  >
                    {m.temperatureCelsius}°C
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-cyan-400" /> Vibration:
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      isVibrating ? 'text-red-400' : 'text-slate-200'
                    }`}
                  >
                    {m.vibrationMmSec} mm/s
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" /> Run Hours:
                  </span>
                  <span className="font-mono text-slate-200">{m.operatingHours} hrs</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                <span>Ping: {m.lastTelemetricPing}</span>
                <span className={m.isOnline ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                  {m.isOnline ? 'OPERATIONAL' : 'DOWN'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Maintenance Request Tickets Board */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-400" />
              Maintenance Request Tickets & Root Cause Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Urgent breakdowns, technician dispatch, and preventative maintenance logs.
            </p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded font-medium">
            {tickets.length} Active Tickets
          </span>
        </div>

        <div className="space-y-3">
          {tickets.map((ticket) => {
            const isEmergency = ticket.priority === 'EMERGENCY';
            const isResolved = ticket.status === 'RESOLVED';

            return (
              <div
                key={ticket.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-white">
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-mono text-xs text-cyan-400">
                      {ticket.machineCode}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      ({ticket.machineName})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isEmergency
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isResolved
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {ticket.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200">
                  {ticket.issueDescription}
                </p>

                {ticket.rootCauseAnalysis && (
                  <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                    <strong className="text-cyan-400">Root Cause Analysis:</strong> {ticket.rootCauseAnalysis}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>Reported: <span className="font-mono">{ticket.breakdownTime}</span></span>
                    {ticket.assignedTechnician && (
                      <>
                        <span>&bull;</span>
                        <span>Assigned: <strong className="text-slate-200">{ticket.assignedTechnician}</strong></span>
                      </>
                    )}
                  </div>

                  {!isResolved && (
                    <button
                      type="button"
                      onClick={() => handleResolveTicket(ticket.ticketNumber)}
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Report Breakdown */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Report Machine Breakdown
              </h3>
              <button
                type="button"
                onClick={() => setShowBreakdownModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Machine Fleet Code
                </label>
                <select
                  value={breakdownForm.machineCode}
                  onChange={(e) => setBreakdownForm({ ...breakdownForm, machineCode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.machineCode}>{m.machineCode} - {m.machineName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Severity Priority
                </label>
                <select
                  value={breakdownForm.priority}
                  onChange={(e) => setBreakdownForm({ ...breakdownForm, priority: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="EMERGENCY">EMERGENCY (Line Halting)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Breakdown Description & Symptoms
                </label>
                <textarea
                  required
                  placeholder="e.g. Spindle motor over-temperature warning tripped. High acoustic squeal from drive bearing."
                  value={breakdownForm.issueDescription}
                  onChange={(e) => setBreakdownForm({ ...breakdownForm, issueDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBreakdownModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white"
                >
                  Dispatch Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

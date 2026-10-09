'use client';

import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  AlertTriangle,
  Wind,
  Zap,
  Plus,
  CheckCircle2,
  ThermometerSnowflake,
  ShieldAlert,
  BatteryWarning,
} from 'lucide-react';

interface LiPoIncident {
  id: string;
  batterySku: string;
  cellLot: string;
  anomalyType: 'THERMAL_RUNAWAY' | 'SWELLING_DEFECT' | 'PUNCTURE_LEAK' | 'VOLTAGE_SURGE';
  tempCelsius: number;
  quarantineChamber: string;
  loggedAt: string;
  status: 'QUARANTINED' | 'NEUTRALIZED';
}

export default function SafetyPage() {
  const [incidents, setIncidents] = useState<LiPoIncident[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    batterySku: 'BATT-LIPO-5000MAH',
    cellLot: 'LOT-BATT-2026-08',
    anomalyType: 'SWELLING_DEFECT' as const,
    tempCelsius: 42,
    quarantineChamber: 'Sand Vessel C-02',
  });

  const handleLogIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc: LiPoIncident = {
      id: `INC-EHS-${Date.now().toString().slice(-4)}`,
      batterySku: form.batterySku,
      cellLot: form.cellLot,
      anomalyType: form.anomalyType,
      tempCelsius: Number(form.tempCelsius),
      quarantineChamber: form.quarantineChamber,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'QUARANTINED',
    };

    setIncidents([newInc, ...incidents]);
    setShowModal(false);
  };

  const handleNeutralize = (id: string) => {
    setIncidents(incidents.map((inc) => (inc.id === id ? { ...inc, status: 'NEUTRALIZED' } : inc)));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Cleanroom Safety Audits & Li-Po Incident Logs
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            ISO 14644-1 Cleanroom environmental compliance, ESD resistance metrics, and Li-Po hazard mitigation.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Log Li-Po Thermal Incident
        </button>
      </div>

      {/* Environmental & ESD KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Air Cleanliness (ISO 5)
            </span>
            <Wind className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Class 100
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            0.5μm particles &lt; 3,520/m³ (Nominal)
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              ESD Floor Resistance
            </span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            2.4 × 10⁶ Ω
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            Static Dissipative Range (ANSI/ESD S20.20)
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Fire & FM-200 Suppression
            </span>
            <Flame className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            ARMED & OK
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Cleanroom Nitrogen gas purge online
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Quarantined Battery Cells
            </span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {incidents.filter((i) => i.status === 'QUARANTINED').length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Active in thermal explosion bunker
          </div>
        </div>
      </div>

      {/* Li-Po Hazard Quarantine Log */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Cleanroom Li-Po Battery Quarantine & Thermal Log
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Incidents: {incidents.length}
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Zero Hazardous Thermal Incidents
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Battery assembly cell temperatures and lithium pouch integrity are 100% compliant with cleanroom safety standards.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Incident #</th>
                  <th className="px-4 py-3">Battery SKU & Lot</th>
                  <th className="px-4 py-3">Hazard Type</th>
                  <th className="px-4 py-3">Recorded Temp</th>
                  <th className="px-4 py-3">Quarantine Vault</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Safety Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-bold text-rose-500">{inc.id}</td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {inc.batterySku}
                      </div>
                      <div className="text-[10px] text-slate-400">{inc.cellLot}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {inc.anomalyType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-500">
                      {inc.tempCelsius}°C
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-600 dark:text-slate-400">
                      {inc.quarantineChamber}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{inc.loggedAt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inc.status === 'NEUTRALIZED'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                        }`}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inc.status === 'QUARANTINED' ? (
                        <button
                          onClick={() => handleNeutralize(inc.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-sans font-semibold transition-colors"
                        >
                          Decommission Cell
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-sans">Safely Neutralized</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal to Log Incident */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
            <h2 className="text-base font-bold text-white mb-1">
              Log Battery Anomaly & Hazard Quarantine
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Records defective Li-Po pouch cell to immediate sand-submerged blast chamber.
            </p>

            <form onSubmit={handleLogIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Battery Component SKU
                </label>
                <input
                  type="text"
                  required
                  value={form.batterySku}
                  onChange={(e) => setForm({ ...form, batterySku: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cell Lot #
                </label>
                <input
                  type="text"
                  required
                  value={form.cellLot}
                  onChange={(e) => setForm({ ...form, cellLot: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Defect Category
                  </label>
                  <select
                    value={form.anomalyType}
                    onChange={(e: any) => setForm({ ...form, anomalyType: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                  >
                    <option value="SWELLING_DEFECT">Pouch Swelling</option>
                    <option value="THERMAL_RUNAWAY">Thermal Runaway (&gt;45°C)</option>
                    <option value="PUNCTURE_LEAK">Electrolyte Leak</option>
                    <option value="VOLTAGE_SURGE">Voltage Short / Surge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cell Temp (°C)
                  </label>
                  <input
                    type="number"
                    value={form.tempCelsius}
                    onChange={(e) => setForm({ ...form, tempCelsius: Number(e.target.value) })}
                    className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quarantine Sand Chamber #
                </label>
                <input
                  type="text"
                  value={form.quarantineChamber}
                  onChange={(e) => setForm({ ...form, quarantineChamber: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                />
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
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white"
                >
                  Confirm Quarantine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  X,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  enterpriseDataStore,
  AndonStoppageItem,
} from '@/lib/enterpriseDataStore';
import { workflowStore } from '@/lib/workflowStore';

interface AndonAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: string;
  currentRole?: string;
}

export function AndonAlertModal({
  isOpen,
  onClose,
  currentUser = 'Plant Floor Operator',
  currentRole = 'production',
}: AndonAlertModalProps) {
  const [lineId, setLineId] = useState('line-1');
  const [lineName, setLineName] = useState('Line 1: Surface Mount & Circuit Assembly');
  const [station, setStation] = useState('SMT Pick-and-Place Feeder 04');
  const [machineId, setMachineId] = useState('AST-SMT-001');
  const [reason, setReason] = useState('Component tape feeder mispick jam resulting in PCB optical alignment rejection.');
  const [severity, setSeverity] = useState<'CRITICAL' | 'WARNING'>('CRITICAL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLineChange = (val: string) => {
    setLineId(val);
    if (val === 'line-1') {
      setLineName('Line 1: Surface Mount & Circuit Assembly');
      setMachineId('AST-SMT-001');
      setStation('SMT Pick-and-Place Feeder 04');
    } else if (val === 'line-2') {
      setLineName('Line 2: Subassembly & Component Bonding');
      setMachineId('AST-INJ-002');
      setStation('Ultrasonic Component Bonding Press 02');
    } else {
      setLineName('Line 3: Sensor Calibration & Optical Tuning');
      setMachineId('AST-OPT-003');
      setStation('Laser Focal Collimator Test Station');
    }
  };

  const handlePullAndon = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Record in enterprise data store (halts work order)
    const stoppage = enterpriseDataStore.triggerAndon({
      lineId,
      lineName,
      station,
      machineId,
      reportedBy: currentUser,
      reason,
      severity,
    });

    // 2. Dispatch cross-role emergency alert in workflow store
    workflowStore.createRequest({
      category: 'MAINTENANCE_OVERHAUL',
      title: `ANDON EMERGENCY STOPPAGE: ${lineName} (${machineId})`,
      department: lineName,
      targetRole: 'asset_reliability',
      targetRoleName: 'Assembly Machines & Cooling Maintenance Lead',
      requester: {
        name: currentUser,
        role: currentRole,
        roleId: currentRole,
        avatar: 'AN',
      },
      valueOrImpact: `${severity} Line Stoppage - Immediate Dispatch Required`,
      deadlineHoursRemaining: 1,
      priority: 'CRITICAL',
      details: {
        justification: reason,
        affectedSystem: `${machineId} at ${station}`,
        metadata: { stoppageId: stoppage.id, stoppageNumber: stoppage.stoppageNumber },
      },
    });

    setToastMsg(`Andon Pull Registered [${stoppage.stoppageNumber}]! Line ${lineId.toUpperCase()} Halted. Emergency Maintenance Dispatched.`);
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden font-sans animate-scaleUp">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Pull Industrial Andon Cord</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 uppercase">
                  Emergency Line Halt
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                Immediately halts line work orders and broadcasts emergency telemetry to maintenance.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMsg ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Andon Cord Activated</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">{toastMsg}</p>
          </div>
        ) : (
          <form onSubmit={handlePullAndon} className="p-6 space-y-4 text-xs">
            {/* Line Selection */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Affected Assembly Line:
              </label>
              <select
                value={lineId}
                onChange={(e) => handleLineChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:border-rose-500"
              >
                <option value="line-1">Line 1: Surface Mount & Circuit Assembly (SMT)</option>
                <option value="line-2">Line 2: Subassembly & Component Bonding</option>
                <option value="line-3">Line 3: Sensor Calibration & Optical Tuning</option>
              </select>
            </div>

            {/* Station and Machine */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Station Location:
                </label>
                <input
                  type="text"
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:border-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Machine Asset Tag:
                </label>
                <input
                  type="text"
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-medium font-mono focus:outline-hidden focus:border-rose-500"
                  required
                />
              </div>
            </div>

            {/* Severity Radio */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Stoppage Severity:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSeverity('CRITICAL')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    severity === 'CRITICAL'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <div className="text-xs">CRITICAL HALT</div>
                    <div className="text-[10px] opacity-75 font-normal">Immediate line shutdown</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSeverity('WARNING')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    severity === 'WARNING'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-xs">WARNING / SLOW</div>
                    <div className="text-[10px] opacity-75 font-normal">Degraded yield advisory</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Reason Description */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Failure Symptom & Justification:
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:border-rose-500"
                placeholder="Describe jam, overheating, or calibration failure..."
                required
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                Trigger Emergency Andon
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Top-level active Andon alert banner displayed when any line is halted
 */
export function ActiveAndonBanner() {
  const [stoppages, setStoppages] = React.useState<AndonStoppageItem[]>([]);
  const [resolvingId, setResolvingId] = React.useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = React.useState('Part cleared from feeder, stencils cleaned, and optical recalibration executed.');

  const refresh = React.useCallback(() => {
    const list = enterpriseDataStore.getAndonStoppages().filter((s) => s.status === 'ACTIVE');
    setStoppages(list);
  }, []);

  React.useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('apex_enterprise_data_updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('apex_enterprise_data_updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, [refresh]);

  if (stoppages.length === 0) return null;

  const handleResolve = (id: string) => {
    enterpriseDataStore.resolveAndon(id, resolutionNote);
    setResolvingId(null);
    refresh();
  };

  return (
    <div className="space-y-2 mb-4 animate-slideDown">
      {stoppages.map((s) => (
        <div
          key={s.id}
          className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-start md:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300">
                  [{s.stoppageNumber}]
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {s.lineName} — {s.station}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white uppercase">
                  Line Halted
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{s.reason}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {resolvingId === s.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 w-60"
                  placeholder="Resolution notes..."
                />
                <button
                  onClick={() => handleResolve(s.id)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" /> Resume Line
                </button>
                <button
                  onClick={() => setResolvingId(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setResolvingId(s.id)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Stoppage &amp; Resume
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Building,
  Wrench,
  Activity,
  Layers,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductionLine {
  id: string;
  lineNumber: number;
  lineName: string;
  currentSKU: string;
  targetUnits: number;
  actualUnits: number;
  uptimeMinutes: number;
  downtimeMinutes: number;
  healthStatus: 'OPTIMAL' | 'OPERATIONAL_WITH_WARNINGS' | 'CRITICAL_DOWNTIME' | 'OFFLINE';
  defectRatePpm: number;
  activeOperators: number;
  downtimeReason?: string;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  totalAmount: number;
  isHighValue: boolean;
  status: 'PENDING_EXECUTIVE_APPROVAL' | 'APPROVED' | 'REJECTED';
  justification: string;
  requestedDate: string;
  parts: string;
}

interface ClientContract {
  id: string;
  contractNumber: string;
  clientName: string;
  totalValue: number;
  status: 'EXECUTED' | 'PENDING_REVIEW' | 'DRAFT';
  effectiveDate: string;
  deliverableSummary: string;
}

export default function OperationsPage() {
  const [lines, setLines] = useState<ProductionLine[]>([
    {
      id: 'l-1',
      lineNumber: 1,
      lineName: 'Chassis Heavy Stamping',
      currentSKU: 'SKU-STAMP-400',
      targetUnits: 12000,
      actualUnits: 11850,
      uptimeMinutes: 440,
      downtimeMinutes: 40,
      healthStatus: 'OPTIMAL',
      defectRatePpm: 12,
      activeOperators: 8,
    },
    {
      id: 'l-2',
      lineNumber: 2,
      lineName: 'Robotic Weld & Frame Integration',
      currentSKU: 'SKU-WELD-09',
      targetUnits: 8000,
      actualUnits: 7920,
      uptimeMinutes: 460,
      downtimeMinutes: 20,
      healthStatus: 'OPTIMAL',
      defectRatePpm: 18,
      activeOperators: 6,
    },
    {
      id: 'l-3',
      lineNumber: 3,
      lineName: 'Thermal Powder Coating Line',
      currentSKU: 'SKU-COAT-GLOSS',
      targetUnits: 9500,
      actualUnits: 8600,
      uptimeMinutes: 380,
      downtimeMinutes: 100,
      healthStatus: 'OPERATIONAL_WITH_WARNINGS',
      defectRatePpm: 45,
      activeOperators: 5,
      downtimeReason: 'Nozzle pressure fluctuations detected',
    },
    {
      id: 'l-4',
      lineNumber: 4,
      lineName: 'Electro-Drive Harness Insertion',
      currentSKU: 'SKU-DRIVE-GEN3',
      targetUnits: 10000,
      actualUnits: 4200,
      uptimeMinutes: 190,
      downtimeMinutes: 290,
      healthStatus: 'CRITICAL_DOWNTIME',
      defectRatePpm: 180,
      activeOperators: 7,
      downtimeReason: 'Spindle motor thermal shutdown on Sub-Station B',
    },
    {
      id: 'l-5',
      lineNumber: 5,
      lineName: 'End-Of-Line Automated Inspection',
      currentSKU: 'SKU-EOL-AUDIT',
      targetUnits: 10600,
      actualUnits: 10440,
      uptimeMinutes: 470,
      downtimeMinutes: 10,
      healthStatus: 'OPTIMAL',
      defectRatePpm: 8,
      activeOperators: 4,
    },
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'po-1',
      poNumber: 'PO-2026-9042',
      supplierName: 'Apex Metallurgy Corp',
      totalAmount: 145000,
      isHighValue: true,
      status: 'PENDING_EXECUTIVE_APPROVAL',
      justification: 'Critical raw material restock: 40 Metric Tons of aerospace-grade alloy',
      requestedDate: '2026-10-07',
      parts: 'Alloy Ingot 6061-T6 (x40 MT)',
    },
    {
      id: 'po-2',
      poNumber: 'PO-2026-9045',
      supplierName: 'Siemens Industrial Automation',
      totalAmount: 88500,
      isHighValue: true,
      status: 'PENDING_EXECUTIVE_APPROVAL',
      justification: 'Emergency replacement CNC high-torque drive spindles for Line 4',
      requestedDate: '2026-10-07',
      parts: 'Simotics S-1FK7 Motors (x4 Units)',
    },
  ]);

  const [contracts] = useState<ClientContract[]>([
    {
      id: 'c-101',
      contractNumber: 'CTR-2026-ALPHA',
      clientName: 'Lockheed Martin Defense Systems',
      totalValue: 12500000,
      status: 'EXECUTED',
      effectiveDate: '2026-08-01',
      deliverableSummary: 'Batch 1-4 Titanium Structural Struts (4,000 units delivered)',
    },
    {
      id: 'c-102',
      contractNumber: 'CTR-2026-TESLA',
      clientName: 'Tesla Gigafactory Texas',
      totalValue: 8400000,
      status: 'PENDING_REVIEW',
      effectiveDate: '2026-11-01',
      deliverableSummary: 'Cast aluminum subframe assemblies (25,000 units schedule)',
    },
  ]);

  const handlePOAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: action } : po)),
    );
  };

  const handleResolveDowntime = (lineNumber: number) => {
    setLines((prev) =>
      prev.map((line) =>
        line.lineNumber === lineNumber
          ? {
              ...line,
              healthStatus: 'OPTIMAL',
              downtimeReason: undefined,
            }
          : line,
      ),
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-blue-500" />
            Live Operations, Plant Telemetry & PO Sign-Offs
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time IoT line monitoring, urgent machine downtime alerts, and high-value procurement approvals.
          </p>
        </div>
      </div>

      {/* Critical Downtime Alert Feed */}
      {lines.some((l) => l.healthStatus === 'CRITICAL_DOWNTIME') && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 animate-bounce" />
            <div>
              <div className="text-sm font-bold text-red-100">
                CRITICAL DOWNTIME ALERT: Line #4 Electro-Drive Harness Insertion
              </div>
              <div className="text-xs text-red-300 mt-0.5">
                Cause: Spindle motor thermal shutdown on Sub-Station B. Line halted for 290 minutes.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleResolveDowntime(4)}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold whitespace-nowrap transition-colors"
          >
            Acknowledge & Mark Maintenance Complete
          </button>
        </div>
      )}

      {/* Production Lines Grid */}
      <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Real-Time Plant Floor Telemetry
          </h3>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded font-medium">
            Active Shift A - Supervisor: M. Vance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lines.map((line) => {
            const isCritical = line.healthStatus === 'CRITICAL_DOWNTIME';
            const isWarning = line.healthStatus === 'OPERATIONAL_WITH_WARNINGS';
            const outputPercent = Math.round((line.actualUnits / line.targetUnits) * 100);

            return (
              <div
                key={line.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-red-950/20 border-red-500/40 shadow-sm'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      LINE #{line.lineNumber}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-1">
                      {line.lineName}
                    </h4>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {line.healthStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="mt-3 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>SKU:</span>
                    <strong className="text-slate-200 font-mono">{line.currentSKU}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual vs Target:</span>
                    <strong className="text-white font-mono">
                      {line.actualUnits.toLocaleString()} / {line.targetUnits.toLocaleString()} ({outputPercent}%)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Defect Rate:</span>
                    <span className={line.defectRatePpm > 50 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                      {line.defectRatePpm} PPM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operators on Floor:</span>
                    <span className="text-slate-300">{line.activeOperators} Active</span>
                  </div>
                </div>

                {line.downtimeReason && (
                  <div className="mt-3 p-2 rounded bg-black/40 border border-slate-800 text-[11px] text-amber-300">
                    <strong>Incident:</strong> {line.downtimeReason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Value Purchase Orders Approvals (> $50,000 threshold) */}
      <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-amber-400" />
              High-Value Purchase Order Approvals (&ge; $50,000 Threshold)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Requires Super Admin executive digital sign-off under procurement policy.
            </p>
          </div>
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded font-medium">
            Procurement Tier 1
          </span>
        </div>

        <div className="space-y-3">
          {purchaseOrders.map((po) => {
            const isPending = po.status === 'PENDING_EXECUTIVE_APPROVAL';

            return (
              <div
                key={po.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">
                      {po.poNumber}
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs font-semibold text-slate-300">
                      {po.supplierName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Parts: <strong className="text-slate-200">{po.parts}</strong>
                  </div>
                  <div className="text-xs text-slate-400 italic">
                    &ldquo;{po.justification}&rdquo;
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-base font-mono font-bold text-white">
                      {formatCurrency(po.totalAmount)}
                    </div>
                    <div className="text-[10px] text-amber-400 font-semibold uppercase">
                      {po.status.replace(/_/g, ' ')}
                    </div>
                  </div>

                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePOAction(po.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" /> Sign & Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePOAction(po.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 text-xs font-semibold flex items-center gap-1 border border-red-500/30 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
                      Completed: {po.status}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Major Client Manufacturing Contracts */}
      <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Building className="h-5 w-5 text-indigo-400" />
          Enterprise Client Manufacturing Contracts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Contract #</th>
                <th className="py-3 px-4">Client Enterprise</th>
                <th className="py-3 px-4">Total Contract Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Deliverables & Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/20">
                  <td className="py-3 px-4 font-mono font-semibold text-white">
                    {c.contractNumber}
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{c.clientName}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                    {formatCurrency(c.totalValue)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-md truncate">
                    {c.deliverableSummary}
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

'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  ShieldCheck,
  Send,
  AlertOctagon,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  FileCheck2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { FinalInspectionItem, QCStatus } from '@/types/quality';

const INITIAL_FINAL_INSPECTIONS: FinalInspectionItem[] = [
  {
    id: 'fin-1',
    inspectionNumber: 'QC-FIN-2026-0108',
    workOrderNumber: 'WO-2026-001',
    batchNumber: 'BATCH-2026-01-A',
    productCode: 'FG-VALVE-5000',
    productName: 'Industrial High-Pressure Cryogenic Valve',
    quantityChecked: 50,
    quantityPassed: 50,
    quantityFailed: 0,
    status: 'PASSED',
    isApprovedForDispatch: true,
    dispatchApprovalRef: 'DSP-QC-OK-2026-8812',
    inspectorName: 'Dr. Sen (Chief QC Officer)',
    signedOffBy: 'Arun Nair (Executive Quality Director)',
    signedOffAt: '2026-10-06 17:30',
    createdAt: '2026-10-06 15:00',
    testingProtocols: [
      {
        testName: 'Hydrostatic Proof Pressure (225 bar)',
        specMin: 220,
        specMax: 230,
        actualValue: '225.4 bar held for 15 min',
        passed: true,
      },
      {
        testName: 'Helium Vacuum Leak Detection',
        specMin: '0',
        specMax: '1.0e-6 mbar·L/s',
        actualValue: '3.2e-8 mbar·L/s',
        passed: true,
      },
      {
        testName: 'Torque Actuator Cycle Test (100 cycles)',
        specMin: 45,
        specMax: 55,
        actualValue: '48.2 Nm smooth operation',
        passed: true,
      },
      {
        testName: 'Optical Surface & Cleanliness Inspection',
        specMin: 'Class 100',
        specMax: 'Class 100',
        actualValue: 'Cleaned, degreased, zero particle trace',
        passed: true,
      },
    ],
  },
  {
    id: 'fin-2',
    inspectionNumber: 'QC-FIN-2026-0109',
    workOrderNumber: 'WO-2026-003',
    batchNumber: 'BATCH-2026-03-A',
    productCode: 'FG-PUMP-H2',
    productName: 'High-Throughput Hydraulic Pump Head',
    quantityChecked: 25,
    quantityPassed: 25,
    quantityFailed: 0,
    status: 'PASSED',
    isApprovedForDispatch: false,
    inspectorName: 'Priya Sharma (Lead QC)',
    createdAt: '2026-10-07 09:15',
    testingProtocols: [
      {
        testName: 'Continuous Dynamic Flow Test (50 L/min)',
        specMin: 48.0,
        specMax: 52.0,
        actualValue: '50.4 L/min stable output',
        passed: true,
      },
      {
        testName: 'Bearing Vibration Analysis FFT',
        specMin: 0,
        specMax: 1.8,
        actualValue: '0.62 mm/s RMS (Superb balance)',
        passed: true,
      },
      {
        testName: 'Motor Dielectric Hi-Pot Insulation (1500V)',
        specMin: 100,
        specMax: 9999,
        actualValue: '&gt; 2000 MΩ insulation resistance',
        passed: true,
      },
    ],
  },
  {
    id: 'fin-3',
    inspectionNumber: 'QC-FIN-2026-0107',
    workOrderNumber: 'WO-2026-005',
    batchNumber: 'BATCH-2026-05-C',
    productCode: 'FG-SENSOR-CTRL',
    productName: 'Dual-Channel Temperature Control Module',
    quantityChecked: 100,
    quantityPassed: 88,
    quantityFailed: 12,
    status: 'FAILED',
    isApprovedForDispatch: false,
    inspectorName: 'Kavita Patel (Electronics QC)',
    createdAt: '2026-10-05 14:00',
    testingProtocols: [
      {
        testName: 'Burn-in Thermal Chamber (72 hrs @ 85°C)',
        specMin: 72,
        specMax: 72,
        actualValue: '12 units dropped communications during spike',
        passed: false,
      },
      {
        testName: 'Analog ADC Calibration Drift',
        specMin: -0.05,
        specMax: 0.05,
        actualValue: '+0.18% drift on 12 units',
        passed: false,
      },
      {
        testName: 'Laser Etched Barcode Verification',
        specMin: 'Grade A',
        specMax: 'Grade A',
        actualValue: 'Passed Grade A ISO 15415',
        passed: true,
      },
    ],
  },
];

export default function FinalInspectionPage() {
  const [inspections, setInspections] = useState<FinalInspectionItem[]>(INITIAL_FINAL_INSPECTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('fin-2');

  // Modals
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [selectedInspectionForSignOff, setSelectedInspectionForSignOff] = useState<FinalInspectionItem | null>(null);

  // New Inspection Form
  const [newTestForm, setNewTestForm] = useState({
    workOrderNumber: 'WO-2026-004',
    batchNumber: 'BATCH-2026-04-A',
    productCode: 'FG-VALVE-5000',
    productName: 'Industrial High-Pressure Cryogenic Valve',
    quantityChecked: 40,
    quantityPassed: 40,
    quantityFailed: 0,
    inspectorName: 'Dr. Sen (Chief QC Officer)',
    test1Name: 'Hydrostatic Proof Pressure',
    test1Result: 'Passed 225 bar proof testing',
    test2Name: 'Helium Leak Detection',
    test2Result: 'Pass - leak tight',
  });

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const isPassed = Number(newTestForm.quantityFailed) === 0;

    const newInspection: FinalInspectionItem = {
      id: `fin-${Date.now()}`,
      inspectionNumber: `QC-FIN-2026-0${inspections.length + 110}`,
      workOrderNumber: newTestForm.workOrderNumber,
      batchNumber: newTestForm.batchNumber,
      productCode: newTestForm.productCode,
      productName: newTestForm.productName,
      quantityChecked: Number(newTestForm.quantityChecked),
      quantityPassed: Number(newTestForm.quantityPassed),
      quantityFailed: Number(newTestForm.quantityFailed),
      status: isPassed ? 'PASSED' : 'FAILED',
      isApprovedForDispatch: false,
      inspectorName: newTestForm.inspectorName,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      testingProtocols: [
        {
          testName: newTestForm.test1Name,
          actualValue: newTestForm.test1Result,
          passed: true,
        },
        {
          testName: newTestForm.test2Name,
          actualValue: newTestForm.test2Result,
          passed: true,
        },
      ],
    };

    setInspections([newInspection, ...inspections]);
    setExpandedId(newInspection.id);
    setIsNewTestModalOpen(false);
  };

  const handleApproveDispatch = () => {
    if (!selectedInspectionForSignOff) return;
    const approvalRef = `DSP-QC-OK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setInspections((prev) =>
      prev.map((i) => {
        if (i.id === selectedInspectionForSignOff.id) {
          return {
            ...i,
            isApprovedForDispatch: true,
            dispatchApprovalRef: approvalRef,
            signedOffBy: 'Arun Nair (Executive Quality Director)',
            signedOffAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return i;
      })
    );

    setIsSignOffModalOpen(false);
    setSelectedInspectionForSignOff(null);
  };

  const filteredInspections = inspections.filter((i) => {
    const matchesSearch =
      i.inspectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalInspected = inspections.reduce((acc, i) => acc + i.quantityChecked, 0);
  const totalApprovedForDispatch = inspections.filter((i) => i.isApprovedForDispatch).length;
  const pendingDispatchSignOff = inspections.filter((i) => i.status === 'PASSED' && !i.isApprovedForDispatch).length;
  const failedBatches = inspections.filter((i) => i.status === 'FAILED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-7 h-7 text-emerald-500" />
              Final Product Testing & Dispatch Approvals
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Ready for Customer Handover
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Execute final compliance testing protocols, sign off dispatch certificates, and prevent defective stock release.
          </p>
        </div>

        <button
          onClick={() => setIsNewTestModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition shadow-sm shadow-emerald-900/30"
        >
          <Plus className="w-4 h-4" />
          Log Final Inspection
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Awaiting Dispatch OK</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">{pendingDispatchSignOff}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">batches passed test</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending executive sign-off</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Approved For Dispatch</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalApprovedForDispatch}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">unlocked in warehouse</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ready for Delivery Challan</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Failed / Quarantined</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 dark:text-rose-400 border border-rose-500/20">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-500 dark:text-rose-400">{failedBatches}</span>
            <span className="text-xs text-rose-500 dark:text-rose-400 font-medium">batches quarantined</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Halted before shipping</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Units Validated</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 border border-blue-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalInspected}</span>
            <span className="text-xs text-blue-500 dark:text-blue-400 font-medium">finished products</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero customer escapes</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search inspection #, WO #, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PASSED">Passed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Final Inspections List */}
      <div className="space-y-3">
        {filteredInspections.map((item) => {
          const isExpanded = expandedId === item.id;
          const isPassed = item.status === 'PASSED';

          return (
            <div
              key={item.id}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border ${
                      item.isApprovedForDispatch
                        ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30'
                        : isPassed
                        ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20'
                        : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {item.isApprovedForDispatch ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    ) : isPassed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.inspectionNumber}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">[{item.workOrderNumber}]</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Batch: {item.batchNumber}</span>
                      {item.isApprovedForDispatch ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> DISPATCH APPROVED
                        </span>
                      ) : isPassed ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          AWAITING DISPATCH SIGN-OFF
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          REJECTED / QUARANTINED
                        </span>
                      )}
                      {item.dispatchApprovalRef && (
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400/80 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                          Ref: {item.dispatchApprovalRef}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-800 dark:text-neutral-200 mt-1 font-medium">
                      {item.productName} <span className="font-mono text-purple-600 dark:text-purple-400">({item.productCode})</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Units: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{item.quantityPassed} Passed</strong> / {item.quantityChecked} Inspected • Lead Inspector: {item.inspectorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  {isPassed && !item.isApprovedForDispatch && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInspectionForSignOff(item);
                        setIsSignOffModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm shadow-emerald-900/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Sign-off Dispatch OK
                    </button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Protocols Table */}
              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                  {item.signedOffBy && (
                    <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400/90 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/20 font-mono">
                      <span>Executive Sign-Off: {item.signedOffBy}</span>
                      <span>Authorized At: {item.signedOffAt}</span>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-3 py-2">Test Protocol</th>
                          <th className="px-3 py-2">Laboratory Observed Measurement</th>
                          <th className="px-3 py-2 text-center">Protocol Clearance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-neutral-800 text-slate-700 dark:text-neutral-300">
                        {item.testingProtocols.map((proto, idx) => (
                          <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-neutral-800/40">
                            <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-neutral-200">{proto.testName}</td>
                            <td className="px-3 py-2.5 font-mono font-semibold text-slate-900 dark:text-white">{proto.actualValue}</td>
                            <td className="px-3 py-2.5 text-center">
                              {proto.passed ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-medium">
                                  <XCircle className="w-3 h-3" /> FAILED PROTOCOL
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: SIGN-OFF DISPATCH CLEARANCE */}
      {isSignOffModalOpen && selectedInspectionForSignOff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-emerald-500 dark:text-emerald-400">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Authorize Outbound Dispatch</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedInspectionForSignOff.inspectionNumber}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Product:</span>
                <span className="text-slate-900 dark:text-white font-medium">{selectedInspectionForSignOff.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Work Order:</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">{selectedInspectionForSignOff.workOrderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Approved Units:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{selectedInspectionForSignOff.quantityPassed} units</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              By authorizing this release, you confirm all safety, pressure, and operational tests meet ISO 9001 quality specifications. The inventory status in Central Warehouse Hub #01 will transition to <strong className="text-emerald-600 dark:text-emerald-400">Ready for Dispatch</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSignOffModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveDispatch}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Issue Dispatch OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOG FINAL INSPECTION */}
      {isNewTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                Record Final Finished Product Test
              </h3>
              <button
                onClick={() => setIsNewTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Work Order #</label>
                  <input
                    type="text"
                    value={newTestForm.workOrderNumber}
                    onChange={(e) => setNewTestForm({ ...newTestForm, workOrderNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newTestForm.batchNumber}
                    onChange={(e) => setNewTestForm({ ...newTestForm, batchNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Product Code</label>
                  <input
                    type="text"
                    value={newTestForm.productCode}
                    onChange={(e) => setNewTestForm({ ...newTestForm, productCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Product Description</label>
                  <input
                    type="text"
                    value={newTestForm.productName}
                    onChange={(e) => setNewTestForm({ ...newTestForm, productName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Units Checked</label>
                  <input
                    type="number"
                    value={newTestForm.quantityChecked}
                    onChange={(e) => setNewTestForm({ ...newTestForm, quantityChecked: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Units Passed</label>
                  <input
                    type="number"
                    value={newTestForm.quantityPassed}
                    onChange={(e) => setNewTestForm({ ...newTestForm, quantityPassed: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Units Failed</label>
                  <input
                    type="number"
                    value={newTestForm.quantityFailed}
                    onChange={(e) => setNewTestForm({ ...newTestForm, quantityFailed: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Inspector Name</label>
                <input
                  type="text"
                  value={newTestForm.inspectorName}
                  onChange={(e) => setNewTestForm({ ...newTestForm, inspectorName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTestModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition flex items-center gap-2"
                >
                  <CheckSquare className="w-4 h-4" />
                  Save Test Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

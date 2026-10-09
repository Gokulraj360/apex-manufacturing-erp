'use client';

import React, { useState } from 'react';
import {
  ClipboardCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Building2,
  Layers,
  FileText,
  UserCheck,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
} from 'lucide-react';
import { CycleCountItem, DamagedLogItem, CycleCountStatus } from '@/types/warehouse';

const INITIAL_CYCLE_COUNTS: CycleCountItem[] = [
  {
    id: 'cc-1',
    countNumber: 'CC-2026-W40',
    zone: 'Zone A - Raw Metals',
    countDate: '2026-10-06',
    countedBy: 'Vikram Joshi (Senior Auditor)',
    status: 'IN_PROGRESS',
    totalDiscrepancies: 2,
    notes: 'Weekly high-velocity raw steel audit across aisles 01-04.',
    itemsCounted: [
      {
        itemCode: 'RAW-ALUM-6061',
        itemName: 'Aluminum Alloy Billet 6061-T6',
        systemQuantity: 850,
        physicalCount: 842,
        variance: -8,
        isReconciled: false,
      },
      {
        itemCode: 'RAW-STL-316L',
        itemName: 'Cold Rolled Steel Sheet 316L',
        systemQuantity: 140,
        physicalCount: 140,
        variance: 0,
        isReconciled: true,
      },
      {
        itemCode: 'RAW-CU-110',
        itemName: 'High Conductivity Electrolytic Copper Rod',
        systemQuantity: 320,
        physicalCount: 315,
        variance: -5,
        isReconciled: false,
      },
    ],
  },
  {
    id: 'cc-2',
    countNumber: 'CC-2026-W39',
    zone: 'Zone B - Electronics & Subassemblies',
    countDate: '2026-09-30',
    countedBy: 'Priya Sharma (Quality Inspector)',
    status: 'RECONCILED',
    totalDiscrepancies: 1,
    reconciledAt: '2026-10-01 14:30',
    notes: 'Monthly precision sensor count. Discrepancy reconciled via ledger adjustment ADJ-9041.',
    itemsCounted: [
      {
        itemCode: 'ELEC-CTRL-MCU',
        itemName: 'Arm Cortex Microcontroller SoC',
        systemQuantity: 500,
        physicalCount: 500,
        variance: 0,
        isReconciled: true,
      },
      {
        itemCode: 'SENS-TEMP-PT100',
        itemName: 'Industrial PT100 RTD Temperature Sensor',
        systemQuantity: 210,
        physicalCount: 214,
        variance: 4,
        isReconciled: true,
      },
    ],
  },
  {
    id: 'cc-3',
    countNumber: 'CC-2026-W38',
    zone: 'Zone C - Finished Goods',
    countDate: '2026-09-24',
    countedBy: 'Arun Nair (Logistics Lead)',
    status: 'COMPLETED',
    totalDiscrepancies: 0,
    reconciledAt: '2026-09-25 11:00',
    notes: 'Q3 Outbound staging audit prior to bulk export container loading.',
    itemsCounted: [
      {
        itemCode: 'FG-VALVE-5000',
        itemName: 'Industrial High-Pressure Cryogenic Valve',
        systemQuantity: 180,
        physicalCount: 180,
        variance: 0,
        isReconciled: true,
      },
      {
        itemCode: 'FG-PUMP-H2',
        itemName: 'High-Throughput Hydraulic Pump Head',
        systemQuantity: 65,
        physicalCount: 65,
        variance: 0,
        isReconciled: true,
      },
    ],
  },
];

const INITIAL_DAMAGED_LOGS: DamagedLogItem[] = [
  {
    id: 'dmg-1',
    itemCode: 'RAW-ALUM-6061',
    itemName: 'Aluminum Alloy Billet 6061-T6',
    damagedQuantity: 4,
    damageReason: 'FORKLIFT_IMPACT (Structural dent during high-rack retrieval)',
    financialLoss: 480.0,
    reportedBy: 'Kavita Patel (Forklift Operator)',
    isWrittenOff: false,
    binLocation: 'A-01-R02-S3',
    createdAt: '2026-10-05 16:45',
  },
  {
    id: 'dmg-2',
    itemCode: 'PKG-CORR-BOX',
    itemName: 'Heavy-Duty Moisture Resistant Corrugated Carton',
    damagedQuantity: 45,
    damageReason: 'WATER_LEAKAGE (Roof drippage during torrential rain)',
    financialLoss: 157.5,
    reportedBy: 'Rajesh Mehra (Receiving Clerk)',
    isWrittenOff: true,
    binLocation: 'D-01-R01-S1',
    createdAt: '2026-10-02 09:15',
  },
  {
    id: 'dmg-3',
    itemCode: 'CHEM-SEAL-EPOXY',
    itemName: 'Two-Part High Performance Epoxy Sealant',
    damagedQuantity: 6,
    damageReason: 'EXPIRED_SHELF_LIFE (Exceeded 12-month manufacturer guarantee)',
    financialLoss: 510.0,
    reportedBy: 'Dr. Sen (Chemical QC)',
    isWrittenOff: true,
    binLocation: 'QUAR-01-R01',
    createdAt: '2026-09-28 11:20',
  },
];

export default function WarehouseAuditsPage() {
  const [cycleCounts, setCycleCounts] = useState<CycleCountItem[]>(INITIAL_CYCLE_COUNTS);
  const [damagedLogs, setDamagedLogs] = useState<DamagedLogItem[]>(INITIAL_DAMAGED_LOGS);
  const [activeTab, setActiveTab] = useState<'counts' | 'damaged' | 'adjustments'>('counts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedCountId, setExpandedCountId] = useState<string | null>('cc-1');

  // Modal States
  const [isCountModalOpen, setIsCountModalOpen] = useState(false);
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [selectedCountForReconcile, setSelectedCountForReconcile] = useState<CycleCountItem | null>(null);

  // New Cycle Count Form State
  const [newCountForm, setNewCountForm] = useState({
    zone: 'Zone A - Raw Metals',
    countedBy: 'Vikram Joshi (Senior Auditor)',
    notes: '',
  });

  // New Damaged Log Form State
  const [newDamageForm, setNewDamageForm] = useState({
    itemCode: 'RAW-ALUM-6061',
    itemName: 'Aluminum Alloy Billet 6061-T6',
    damagedQuantity: 1,
    damageReason: 'FORKLIFT_IMPACT',
    financialLoss: 120,
    reportedBy: 'Warehouse Inspector',
    binLocation: 'A-01-R02-S3',
  });

  // Metrics Calculations
  const activeCountCount = cycleCounts.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'SCHEDULED').length;
  const reconciledCountsCount = cycleCounts.filter((c) => c.status === 'RECONCILED' || c.status === 'COMPLETED').length;
  const totalDiscrepancies = cycleCounts.reduce((acc, c) => acc + c.totalDiscrepancies, 0);
  const totalDamageLoss = damagedLogs.reduce((acc, d) => acc + d.financialLoss, 0);
  const pendingWriteOffs = damagedLogs.filter((d) => !d.isWrittenOff).length;

  const handleStartCycleCount = (e: React.FormEvent) => {
    e.preventDefault();
    const countNumber = `CC-2026-W${Math.floor(Math.random() * 90) + 10}`;
    const newCount: CycleCountItem = {
      id: `cc-${Date.now()}`,
      countNumber,
      zone: newCountForm.zone,
      countDate: new Date().toISOString().split('T')[0],
      countedBy: newCountForm.countedBy,
      status: 'IN_PROGRESS',
      totalDiscrepancies: 0,
      notes: newCountForm.notes || 'Routine physical inventory cycle verification.',
      itemsCounted: [
        {
          itemCode: 'RAW-ALUM-6061',
          itemName: 'Aluminum Alloy Billet 6061-T6',
          systemQuantity: 842,
          physicalCount: 842,
          variance: 0,
          isReconciled: true,
        },
        {
          itemCode: 'RAW-STL-316L',
          itemName: 'Cold Rolled Steel Sheet 316L',
          systemQuantity: 140,
          physicalCount: 138,
          variance: -2,
          isReconciled: false,
        },
      ],
    };

    setCycleCounts([newCount, ...cycleCounts]);
    setExpandedCountId(newCount.id);
    setIsCountModalOpen(false);
  };

  const handleLogDamagedStock = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DamagedLogItem = {
      id: `dmg-${Date.now()}`,
      itemCode: newDamageForm.itemCode,
      itemName: newDamageForm.itemName,
      damagedQuantity: Number(newDamageForm.damagedQuantity),
      damageReason: newDamageForm.damageReason,
      financialLoss: Number(newDamageForm.financialLoss),
      reportedBy: newDamageForm.reportedBy,
      isWrittenOff: false,
      binLocation: newDamageForm.binLocation,
      createdAt: new Date().toLocaleString(),
    };

    setDamagedLogs([newLog, ...damagedLogs]);
    setIsDamageModalOpen(false);
  };

  const handleExecuteReconciliation = () => {
    if (!selectedCountForReconcile) return;

    setCycleCounts((prev) =>
      prev.map((c) => {
        if (c.id === selectedCountForReconcile.id) {
          return {
            ...c,
            status: 'RECONCILED',
            reconciledAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            itemsCounted: c.itemsCounted.map((item) => ({
              ...item,
              systemQuantity: item.physicalCount,
              variance: 0,
              isReconciled: true,
            })),
          };
        }
        return c;
      })
    );

    setIsReconcileModalOpen(false);
    setSelectedCountForReconcile(null);
  };

  const handleWriteOffDamagedStock = (id: string) => {
    setDamagedLogs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isWrittenOff: true } : item))
    );
  };

  const filteredCycleCounts = cycleCounts.filter((c) => {
    const matchesSearch =
      c.countNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.countedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ClipboardCheck className="w-7 h-7 text-emerald-400" />
              Inventory Audits & Cycle Counting
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Stock Balancing
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Conduct physical cycle counts, balance ledger variances, and account for damaged/expired assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDamageModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 text-sm font-medium border border-neutral-700 transition shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Log Damaged Stock
          </button>
          <button
            onClick={() => setIsCountModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition shadow-sm shadow-emerald-900/30"
          >
            <Plus className="w-4 h-4" />
            New Cycle Count
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Active Audits</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeCountCount}</span>
            <span className="text-xs text-blue-400 font-medium">batches scanning</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Zone A & Zone B active</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Reconciled Audits</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{reconciledCountsCount}</span>
            <span className="text-xs text-emerald-400 font-medium">99.1% accuracy rate</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Past 30 calendar days</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Pending Discrepancies</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{totalDiscrepancies}</span>
            <span className="text-xs text-amber-400 font-medium">unbalanced items</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Requires ledger adjustment</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Damaged Stock Loss</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">${totalDamageLoss.toFixed(2)}</span>
            <span className="text-xs text-rose-400 font-medium">{pendingWriteOffs} pending write-off</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Awaiting executive sign-off</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 gap-6">
        <button
          onClick={() => setActiveTab('counts')}
          className={`pb-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'counts'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Cycle Count Batches ({cycleCounts.length})
        </button>
        <button
          onClick={() => setActiveTab('damaged')}
          className={`pb-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'damaged'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Damaged & Expired Item Logs ({damagedLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('adjustments')}
          className={`pb-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'adjustments'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Audit Ledger History
        </button>
      </div>

      {/* TAB 1: CYCLE COUNT BATCHES */}
      {activeTab === 'counts' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search audit number, zone, auditor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="RECONCILED">Reconciled</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
          </div>

          {/* Batches List */}
          <div className="space-y-3">
            {filteredCycleCounts.map((count) => {
              const isExpanded = expandedCountId === count.id;
              const hasDiscrepancy = count.itemsCounted.some((i) => i.variance !== 0 && !i.isReconciled);

              return (
                <div
                  key={count.id}
                  className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden transition"
                >
                  {/* Batch Header Bar */}
                  <div
                    onClick={() => setExpandedCountId(isExpanded ? null : count.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-800/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border ${
                          count.status === 'RECONCILED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : count.status === 'IN_PROGRESS'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                        }`}
                      >
                        {count.countNumber.split('-')[2] || 'CC'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{count.countNumber}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              count.status === 'RECONCILED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : count.status === 'IN_PROGRESS'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                            }`}
                          >
                            {count.status}
                          </span>
                          {hasDiscrepancy && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Variance Alert
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {count.zone} • Auditor: {count.countedBy} • Date: {count.countDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      {count.status !== 'RECONCILED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCountForReconcile(count);
                            setIsReconcileModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reconcile Variances
                        </button>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Batch Items Table */}
                  {isExpanded && (
                    <div className="border-t border-neutral-800 p-4 bg-neutral-950/40 space-y-3">
                      {count.notes && (
                        <p className="text-xs text-neutral-400 italic bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800">
                          Auditor Notes: {count.notes}
                        </p>
                      )}

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                            <tr>
                              <th className="px-3 py-2">Item Code</th>
                              <th className="px-3 py-2">Description</th>
                              <th className="px-3 py-2 text-right">System Qty</th>
                              <th className="px-3 py-2 text-right">Physical Count</th>
                              <th className="px-3 py-2 text-right">Variance</th>
                              <th className="px-3 py-2 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800 text-neutral-300">
                            {count.itemsCounted.map((item, idx) => (
                              <tr key={idx} className="hover:bg-neutral-800/40">
                                <td className="px-3 py-2.5 font-mono text-emerald-400 font-medium">
                                  {item.itemCode}
                                </td>
                                <td className="px-3 py-2.5 text-neutral-200">{item.itemName}</td>
                                <td className="px-3 py-2.5 text-right font-mono">{item.systemQuantity}</td>
                                <td className="px-3 py-2.5 text-right font-mono font-bold text-white">
                                  {item.physicalCount}
                                </td>
                                <td
                                  className={`px-3 py-2.5 text-right font-mono font-bold ${
                                    item.variance === 0
                                      ? 'text-neutral-400'
                                      : item.variance < 0
                                      ? 'text-rose-400'
                                      : 'text-amber-400'
                                  }`}
                                >
                                  {item.variance > 0 ? `+${item.variance}` : item.variance}
                                </td>
                                <td className="px-3 py-2.5 text-center">
                                  {item.isReconciled ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                                      <CheckCircle2 className="w-3 h-3" /> Reconciled
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
                                      <AlertTriangle className="w-3 h-3" /> Pending Adj
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
        </div>
      )}

      {/* TAB 2: DAMAGED STOCK LOGS */}
      {activeTab === 'damaged' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Damaged, Expired & Scrapped Stock Logs
            </h2>
            <button
              onClick={() => setIsDamageModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Report Incident
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-800/60 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="px-4 py-3">Item Details</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">Damaged Qty</th>
                  <th className="px-4 py-3 text-right">Financial Loss</th>
                  <th className="px-4 py-3">Damage Reason & Root Cause</th>
                  <th className="px-4 py-3">Reported By</th>
                  <th className="px-4 py-3 text-center">Write-Off Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {damagedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-800/40">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{log.itemName}</div>
                      <span className="font-mono text-emerald-400 text-[11px]">{log.itemCode}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-neutral-300">{log.binLocation || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-rose-400">
                      {log.damagedQuantity} units
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-white">
                      ${log.financialLoss.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs text-neutral-300 text-xs truncate">
                      {log.damageReason}
                    </td>
                    <td className="px-4 py-3.5 text-neutral-400">
                      <div>{log.reportedBy}</div>
                      <span className="text-[10px] text-neutral-500">{log.createdAt}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {log.isWrittenOff ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Written Off
                        </span>
                      ) : (
                        <button
                          onClick={() => handleWriteOffDamagedStock(log.id)}
                          className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 text-[11px] font-medium transition"
                        >
                          Sign-Off Write-off
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LEDGER HISTORY */}
      {activeTab === 'adjustments' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Stock Adjustment Audit Log</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Immutable ledger entries generated from approved cycle counts and damage write-offs.
              </p>
            </div>
            <span className="text-xs text-neutral-400">Prisma Audit Trail Connected</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-emerald-400 font-bold">[ADJ-2026-9041]</span>
                <span className="text-neutral-300 ml-2">SENS-TEMP-PT100 +4 units (+ $128.00)</span>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Reason: CYCLE_COUNT_RECONCILIATION • Auditor: Priya Sharma • 2026-10-01 14:30
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
                POSTED
              </span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-rose-400 font-bold">[ADJ-2026-9039]</span>
                <span className="text-neutral-300 ml-2">PKG-CORR-BOX -45 units (- $157.50)</span>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Reason: DAMAGED_STOCK_WRITE_OFF • Clerk: Rajesh Mehra • 2026-10-02 10:15
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px]">
                WRITTEN_OFF
              </span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-rose-400 font-bold">[ADJ-2026-9022]</span>
                <span className="text-neutral-300 ml-2">CHEM-SEAL-EPOXY -6 units (- $510.00)</span>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Reason: EXPIRED_STOCK_SCRAP • Inspector: Dr. Sen • 2026-09-28 12:00
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px]">
                WRITTEN_OFF
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: START CYCLE COUNT */}
      {isCountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                Initiate New Cycle Count Batch
              </h3>
              <button
                onClick={() => setIsCountModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartCycleCount} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Target Zone / Aisle</label>
                <select
                  value={newCountForm.zone}
                  onChange={(e) => setNewCountForm({ ...newCountForm, zone: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Zone A - Raw Metals">Zone A - Raw Metals</option>
                  <option value="Zone B - Electronics & Subassemblies">Zone B - Electronics & Subassemblies</option>
                  <option value="Zone C - Finished Goods">Zone C - Finished Goods</option>
                  <option value="Zone D - Consumables & Spare Parts">Zone D - Consumables & Spare Parts</option>
                  <option value="Quarantine Inspection Staging">Quarantine Inspection Staging</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Assigned Lead Auditor</label>
                <input
                  type="text"
                  value={newCountForm.countedBy}
                  onChange={(e) => setNewCountForm({ ...newCountForm, countedBy: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Audit Objective / Notes</label>
                <textarea
                  value={newCountForm.notes}
                  onChange={(e) => setNewCountForm({ ...newCountForm, notes: e.target.value })}
                  placeholder="e.g. Weekly high-velocity cycle audit for raw aluminum inventory..."
                  rows={3}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCountModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition flex items-center gap-2"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Start Audit Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG DAMAGED STOCK */}
      {isDamageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Report Damaged or Expired Stock
              </h3>
              <button
                onClick={() => setIsDamageModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogDamagedStock} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Item Code</label>
                  <input
                    type="text"
                    value={newDamageForm.itemCode}
                    onChange={(e) => setNewDamageForm({ ...newDamageForm, itemCode: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-rose-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Bin Location</label>
                  <input
                    type="text"
                    value={newDamageForm.binLocation}
                    onChange={(e) => setNewDamageForm({ ...newDamageForm, binLocation: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-rose-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newDamageForm.itemName}
                  onChange={(e) => setNewDamageForm({ ...newDamageForm, itemName: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Damaged Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newDamageForm.damagedQuantity}
                    onChange={(e) => setNewDamageForm({ ...newDamageForm, damagedQuantity: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Est. Loss Value ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDamageForm.financialLoss}
                    onChange={(e) => setNewDamageForm({ ...newDamageForm, financialLoss: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Damage Cause / Incident Details</label>
                <textarea
                  value={newDamageForm.damageReason}
                  onChange={(e) => setNewDamageForm({ ...newDamageForm, damageReason: e.target.value })}
                  rows={2}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Reported By</label>
                <input
                  type="text"
                  value={newDamageForm.reportedBy}
                  onChange={(e) => setNewDamageForm({ ...newDamageForm, reportedBy: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDamageModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Submit Damage Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM RECONCILIATION */}
      {isReconcileModalOpen && selectedCountForReconcile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Commit Reconciliation?</h3>
                <p className="text-xs text-neutral-400">{selectedCountForReconcile.countNumber}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <p className="text-neutral-300">
                This operation will automatically adjust the perpetual inventory ledger to match the recorded physical counts:
              </p>
              <div className="space-y-1 font-mono text-[11px] text-neutral-400">
                {selectedCountForReconcile.itemsCounted.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.itemCode}:</span>
                    <span className={item.variance !== 0 ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                      {item.systemQuantity} → {item.physicalCount} ({item.variance > 0 ? `+${item.variance}` : item.variance})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-neutral-500 italic">
              Adjustments will be recorded with RBAC audit trail signatures and linked with General Ledger postings.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsReconcileModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReconciliation}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Post Adjustments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

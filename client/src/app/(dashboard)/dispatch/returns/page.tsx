'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  DollarSign,
  Truck,
  Package,
  Wrench,
  FileText,
  Building2,
  ChevronDown,
  ChevronUp,
  X,
  FileCheck,
} from 'lucide-react';
import { CustomerReturnItem, TransitDamageLogItem, ReturnDisposition } from '@/types/dispatch';

const INITIAL_RETURNS: CustomerReturnItem[] = [
  {
    id: 'rma-1',
    rmaNumber: 'RMA-2026-019',
    salesOrderRef: 'SO-2026-098',
    deliveryChallanRef: 'DC-2026-017',
    customerName: 'Larsen & Toubro Heavy Fab',
    itemCode: 'FG-PUMP-H2',
    itemName: 'High-Throughput Hydraulic Pump Head',
    returnedQuantity: 1,
    returnReason: 'Customer noticed minor exterior casing transit dent; requesting factory inspection & replacement.',
    disposition: 'UNDER_INSPECTION',
    replacementOrderRef: 'SO-2026-118-R',
    receivedAt: '2026-10-07 11:00',
    inspectedBy: 'Vikram Joshi (Senior Auditor)',
    resolutionNotes: 'Impeller integrity verified undamaged. Exterior mounting flange scheduled for surface re-facing.',
  },
  {
    id: 'rma-2',
    rmaNumber: 'RMA-2026-018',
    salesOrderRef: 'SO-2026-092',
    deliveryChallanRef: 'DC-2026-014',
    customerName: 'BHEL Power Systems',
    itemCode: 'FG-VALVE-5000',
    itemName: 'Industrial High-Pressure Cryogenic Valve',
    returnedQuantity: 2,
    returnReason: 'Ordering error - customer over-ordered by 2 units. Unopened factory seal intact.',
    disposition: 'RESTOCK',
    receivedAt: '2026-10-05 14:30',
    inspectedBy: 'Dr. Sen (Chief QC)',
    resolutionNotes: 'Packaging seal inspected intact. Hydrostatic seal verified. Restocked to Finished Goods Bay FG-BAY-A1-02.',
  },
  {
    id: 'rma-3',
    rmaNumber: 'RMA-2026-017',
    salesOrderRef: 'SO-2026-088',
    deliveryChallanRef: 'DC-2026-012',
    customerName: 'Reliance Petrochemical Hub',
    itemCode: 'FG-SENSOR-CTRL',
    itemName: 'Dual-Channel Temperature Control Module',
    returnedQuantity: 4,
    returnReason: 'Field thermal controller failure during initial plant commissioning.',
    disposition: 'REWORK',
    replacementOrderRef: 'SO-2026-109-R',
    receivedAt: '2026-10-03 09:15',
    inspectedBy: 'Kavita Patel (Electronics QC)',
    resolutionNotes: 'Solder joint thermal fatigue detected. Re-routed to Electronics Repair Cell for SMD component replacement.',
  },
];

const INITIAL_TRANSIT_DAMAGES: TransitDamageLogItem[] = [
  {
    id: 'tdmg-1',
    damageClaimNumber: 'TDMG-2026-008',
    shipmentNumber: 'DSP-SHP-2026-039',
    carrierName: 'National Freight Cargo',
    itemCode: 'FG-VALVE-5000',
    damagedQuantity: 1,
    lossAmount: 1250.0,
    carrierLiabilityAccepted: true,
    insuranceClaimNumber: 'INS-CLM-90412',
    damageDescription: 'Pallet tie-down strap snapped during sudden highway braking; wooden crate impacted container sidewall.',
    loggedBy: 'Rajesh Mehra',
    createdAt: '2026-10-06 16:45',
  },
  {
    id: 'tdmg-2',
    damageClaimNumber: 'TDMG-2026-007',
    shipmentNumber: 'DSP-SHP-2026-035',
    carrierName: 'Vanguard Freight Logistics',
    itemCode: 'SPARE-SEAL-KIT',
    damagedQuantity: 15,
    lossAmount: 675.0,
    carrierLiabilityAccepted: true,
    insuranceClaimNumber: 'INS-CLM-90388',
    damageDescription: 'Water ingress through truck canvas cover during severe monsoon downpour.',
    loggedBy: 'Sunil Rao',
    createdAt: '2026-10-02 11:20',
  },
];

export default function CustomerReturnsPage() {
  const [returns, setReturns] = useState<CustomerReturnItem[]>(INITIAL_RETURNS);
  const [damages, setDamages] = useState<TransitDamageLogItem[]>(INITIAL_TRANSIT_DAMAGES);
  const [activeTab, setActiveTab] = useState<'returns' | 'damages' | 'rework'>('returns');
  const [searchTerm, setSearchTerm] = useState('');
  const [dispositionFilter, setDispositionFilter] = useState<string>('ALL');

  // Modals
  const [isNewRmaModalOpen, setIsNewRmaModalOpen] = useState(false);
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [isDispositionModalOpen, setIsDispositionModalOpen] = useState(false);
  const [selectedRmaForDisposition, setSelectedRmaForDisposition] = useState<CustomerReturnItem | null>(null);

  // Forms
  const [newRmaForm, setNewRmaForm] = useState({
    salesOrderRef: 'SO-2026-104',
    deliveryChallanRef: 'DC-2026-018',
    customerName: 'Bharat Heavy Dynamics Ltd',
    itemCode: 'FG-VALVE-5000',
    itemName: 'Industrial High-Pressure Cryogenic Valve',
    returnedQuantity: 1,
    returnReason: 'Mounting flange scratch detected on client receiving dock.',
    inspectedBy: 'Vikram Joshi (Senior Auditor)',
  });

  const [damageForm, setDamageForm] = useState({
    shipmentNumber: 'DSP-SHP-2026-042',
    carrierName: 'Vanguard Freight Logistics',
    itemCode: 'FG-VALVE-5000',
    damagedQuantity: 1,
    lossAmount: 1250.0,
    carrierLiabilityAccepted: true,
    insuranceClaimNumber: 'INS-CLM-90455',
    damageDescription: 'Forklift fork puncture during unloading at regional transport hub.',
    loggedBy: 'Rajesh Mehra',
  });

  const [dispositionForm, setDispositionForm] = useState({
    disposition: 'RESTOCK' as ReturnDisposition,
    resolutionNotes: '',
    replacementOrderRef: '',
  });

  const handleCreateRma = (e: React.FormEvent) => {
    e.preventDefault();
    const count = returns.length + 20;
    const rmaNumber = `RMA-2026-0${count}`;

    const newRma: CustomerReturnItem = {
      id: `rma-${Date.now()}`,
      rmaNumber,
      salesOrderRef: newRmaForm.salesOrderRef,
      deliveryChallanRef: newRmaForm.deliveryChallanRef,
      customerName: newRmaForm.customerName,
      itemCode: newRmaForm.itemCode,
      itemName: newRmaForm.itemName,
      returnedQuantity: Number(newRmaForm.returnedQuantity),
      returnReason: newRmaForm.returnReason,
      disposition: 'UNDER_INSPECTION',
      receivedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      inspectedBy: newRmaForm.inspectedBy,
      resolutionNotes: 'Initial receiving quarantine inspection initiated.',
    };

    setReturns([newRma, ...returns]);
    setIsNewRmaModalOpen(false);
  };

  const handleCreateDamage = (e: React.FormEvent) => {
    e.preventDefault();
    const count = damages.length + 9;
    const damageClaimNumber = `TDMG-2026-00${count}`;

    const newDamage: TransitDamageLogItem = {
      id: `dmg-${Date.now()}`,
      damageClaimNumber,
      shipmentNumber: damageForm.shipmentNumber,
      carrierName: damageForm.carrierName,
      itemCode: damageForm.itemCode,
      damagedQuantity: Number(damageForm.damagedQuantity),
      lossAmount: Number(damageForm.lossAmount),
      carrierLiabilityAccepted: damageForm.carrierLiabilityAccepted,
      insuranceClaimNumber: damageForm.insuranceClaimNumber,
      damageDescription: damageForm.damageDescription,
      loggedBy: damageForm.loggedBy,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setDamages([newDamage, ...damages]);
    setIsDamageModalOpen(false);
  };

  const handleUpdateDisposition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRmaForDisposition) return;

    setReturns((prev) =>
      prev.map((r) => {
        if (r.id === selectedRmaForDisposition.id) {
          return {
            ...r,
            disposition: dispositionForm.disposition,
            resolutionNotes: dispositionForm.resolutionNotes,
            replacementOrderRef: dispositionForm.replacementOrderRef || r.replacementOrderRef,
          };
        }
        return r;
      })
    );

    setIsDispositionModalOpen(false);
    setSelectedRmaForDisposition(null);
  };

  const openDispositionModal = (rma: CustomerReturnItem) => {
    setSelectedRmaForDisposition(rma);
    setDispositionForm({
      disposition: rma.disposition,
      resolutionNotes: rma.resolutionNotes || '',
      replacementOrderRef: rma.replacementOrderRef || '',
    });
    setIsDispositionModalOpen(true);
  };

  const filteredReturns = returns.filter((r) => {
    const matchesSearch =
      r.rmaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.salesOrderRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDisp = dispositionFilter === 'ALL' || r.disposition === dispositionFilter;
    return matchesSearch && matchesDisp;
  });

  // Metrics
  const underInspectionCount = returns.filter((r) => r.disposition === 'UNDER_INSPECTION').length;
  const restockedCount = returns.filter((r) => r.disposition === 'RESTOCK').length;
  const reworkCount = returns.filter((r) => r.disposition === 'REWORK').length;
  const totalDamageLoss = damages.reduce((acc, d) => acc + d.lossAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-7 h-7 text-rose-500 dark:text-rose-400" />
              Customer Returns (RMA) & Transit Damage
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
              Reverse Logistics
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage Return Merchandise Authorizations (RMA), trace transit damage claims, and re-allocate rework/restock stock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDamageModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium border border-slate-200 dark:border-slate-700 transition"
          >
            <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Log Transit Damage
          </button>
          <button
            onClick={() => setIsNewRmaModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition shadow-sm shadow-rose-950/40"
          >
            <Plus className="w-4 h-4" />
            Log Customer Return (RMA)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Under QC Inspection</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{underInspectionCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">pending disposition</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Quarantined return holding</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Restocked & Salvaged</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{restockedCount} Lots</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">returned to bays</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Zero defect re-entries</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rework Order Queue</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">{reworkCount} Units</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">in refurbishment</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Refurbishment line linked</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transit Damage Claims</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">${totalDamageLoss.toFixed(2)}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{damages.length} claims filed</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Carrier insurance active</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('returns')}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'returns'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Customer Returns (RMA) Board ({returns.length})
        </button>
        <button
          onClick={() => setActiveTab('damages')}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'damages'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Transit Damage Claims ({damages.length})
        </button>
      </div>

      {/* TAB 1: CUSTOMER RETURNS */}
      {activeTab === 'returns' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search RMA #, SO #, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={dispositionFilter}
                onChange={(e) => setDispositionFilter(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 shadow-sm transition-colors"
              >
                <option value="ALL">All Dispositions</option>
                <option value="UNDER_INSPECTION">Under Inspection</option>
                <option value="RESTOCK">Restock</option>
                <option value="REWORK">Rework</option>
                <option value="SCRAP">Scrap</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredReturns.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-slate-900 dark:text-white">{r.rmaNumber}</span>
                      <span className="text-xs font-mono text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-500/20">
                        SO: {r.salesOrderRef}
                      </span>
                      {r.deliveryChallanRef && (
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                          DC: {r.deliveryChallanRef}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          r.disposition === 'RESTOCK'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                            : r.disposition === 'REWORK'
                            ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-500/20'
                            : r.disposition === 'SCRAP'
                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                        }`}
                      >
                        {r.disposition.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                      Customer: <strong className="text-slate-900 dark:text-white">{r.customerName}</strong> • {r.itemName} <span className="font-mono text-emerald-600 dark:text-emerald-400">({r.itemCode})</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      Returned: {r.returnedQuantity} units
                    </span>

                    <button
                      onClick={() => openDispositionModal(r)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
                    >
                      Update Disposition
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1 text-xs">
                  <div className="text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">Customer Reason:</strong> {r.returnReason}
                  </div>
                  {r.resolutionNotes && (
                    <div className="text-emerald-700 dark:text-emerald-400/90 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                      <strong>QC Disposition Resolution:</strong> {r.resolutionNotes}
                    </div>
                  )}
                  {r.replacementOrderRef && (
                    <div className="text-blue-600 dark:text-blue-400 pt-1 font-mono text-[11px]">
                      Replacement Order Assigned: <strong>{r.replacementOrderRef}</strong>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                  <span>Inspector: <strong className="text-slate-700 dark:text-slate-300">{r.inspectedBy}</strong></span>
                  <span>Received timestamp: {r.receivedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TRANSIT DAMAGES */}
      {activeTab === 'damages' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Claim Ref & Shipment</th>
                  <th className="px-4 py-3">Freight Carrier</th>
                  <th className="px-4 py-3">Item Damaged</th>
                  <th className="px-4 py-3 text-right">Units Damaged</th>
                  <th className="px-4 py-3 text-right">Financial Loss</th>
                  <th className="px-4 py-3">Liability & Insurance</th>
                  <th className="px-4 py-3">Damage Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {damages.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{d.damageClaimNumber}</div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{d.shipmentNumber}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">{d.carrierName}</td>
                    <td className="px-4 py-3.5 font-mono text-emerald-600 dark:text-emerald-400">{d.itemCode}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      {d.damagedQuantity} pcs
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ${d.lossAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5">
                      {d.carrierLiabilityAccepted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Carrier Liable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 font-medium">
                          Under Dispute
                        </span>
                      )}
                      {d.insuranceClaimNumber && (
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {d.insuranceClaimNumber}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {d.damageDescription}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: LOG CUSTOMER RETURN */}
      {isNewRmaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                Issue Return Merchandise Authorization (RMA)
              </h3>
              <button
                onClick={() => setIsNewRmaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRma} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Sales Order Ref</label>
                  <input
                    type="text"
                    value={newRmaForm.salesOrderRef}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, salesOrderRef: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Delivery Challan Ref</label>
                  <input
                    type="text"
                    value={newRmaForm.deliveryChallanRef}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, deliveryChallanRef: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newRmaForm.customerName}
                  onChange={(e) => setNewRmaForm({ ...newRmaForm, customerName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Item Code</label>
                  <input
                    type="text"
                    value={newRmaForm.itemCode}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, itemCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Returned Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newRmaForm.returnedQuantity}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, returnedQuantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Item Description</label>
                <input
                  type="text"
                  value={newRmaForm.itemName}
                  onChange={(e) => setNewRmaForm({ ...newRmaForm, itemName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Return Reason</label>
                <textarea
                  value={newRmaForm.returnReason}
                  onChange={(e) => setNewRmaForm({ ...newRmaForm, returnReason: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Receiving QC Inspector</label>
                <input
                  type="text"
                  value={newRmaForm.inspectedBy}
                  onChange={(e) => setNewRmaForm({ ...newRmaForm, inspectedBy: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewRmaModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Generate RMA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG TRANSIT DAMAGE */}
      {isDamageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                Record Transit Damage Claim
              </h3>
              <button
                onClick={() => setIsDamageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDamage} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Shipment #</label>
                  <input
                    type="text"
                    value={damageForm.shipmentNumber}
                    onChange={(e) => setDamageForm({ ...damageForm, shipmentNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Freight Carrier</label>
                  <input
                    type="text"
                    value={damageForm.carrierName}
                    onChange={(e) => setDamageForm({ ...damageForm, carrierName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Item Code</label>
                  <input
                    type="text"
                    value={damageForm.itemCode}
                    onChange={(e) => setDamageForm({ ...damageForm, itemCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Damaged Qty</label>
                  <input
                    type="number"
                    value={damageForm.damagedQuantity}
                    onChange={(e) => setDamageForm({ ...damageForm, damagedQuantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Loss Value ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={damageForm.lossAmount}
                    onChange={(e) => setDamageForm({ ...damageForm, lossAmount: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Insurance Claim Reference #</label>
                <input
                  type="text"
                  value={damageForm.insuranceClaimNumber}
                  onChange={(e) => setDamageForm({ ...damageForm, insuranceClaimNumber: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Damage Root Cause & Incident Details</label>
                <textarea
                  value={damageForm.damageDescription}
                  onChange={(e) => setDamageForm({ ...damageForm, damageDescription: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="carrierLiable"
                  checked={damageForm.carrierLiabilityAccepted}
                  onChange={(e) => setDamageForm({ ...damageForm, carrierLiabilityAccepted: e.target.checked })}
                  className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="carrierLiable" className="text-xs text-slate-700 dark:text-slate-300">
                  Carrier Liability Formally Acknowledged / Signed on Delivery Challan
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDamageModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition"
                >
                  Submit Damage Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE RMA DISPOSITION */}
      {isDispositionModalOpen && selectedRmaForDisposition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                Assign RMA Disposition
              </h3>
              <button
                onClick={() => setIsDispositionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDisposition} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Disposition Determination</label>
                <select
                  value={dispositionForm.disposition}
                  onChange={(e) => setDispositionForm({ ...dispositionForm, disposition: e.target.value as ReturnDisposition })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="RESTOCK">RESTOCK (Return to Storage Bay)</option>
                  <option value="REWORK">REWORK (Refurbishment & Re-test)</option>
                  <option value="SCRAP">SCRAP (Total Write-Off Loss)</option>
                  <option value="UNDER_INSPECTION">UNDER INSPECTION (Quarantine)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Replacement Order #</label>
                <input
                  type="text"
                  placeholder="e.g. SO-2026-118-R"
                  value={dispositionForm.replacementOrderRef}
                  onChange={(e) => setDispositionForm({ ...dispositionForm, replacementOrderRef: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Resolution Technical Notes</label>
                <textarea
                  value={dispositionForm.resolutionNotes}
                  onChange={(e) => setDispositionForm({ ...dispositionForm, resolutionNotes: e.target.value })}
                  rows={3}
                  placeholder="Detail test results, storage bay re-entry, or rework routing..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDispositionModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition"
                >
                  Commit Disposition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

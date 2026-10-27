'use client';

import React, { useState } from 'react';
import {
  Scan,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  FileCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  X,
  ShieldCheck,
  FileText,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { IncomingInspectionItem, QCStatus } from '@/types/quality';

const INITIAL_INCOMING_INSPECTIONS: IncomingInspectionItem[] = [
  {
    id: 'inc-1',
    inspectionNumber: 'QC-IN-2026-0041',
    poNumber: 'PO-2026-089',
    grnNumber: 'GRN-2026-0012',
    supplierName: 'Apex Precision Metallurgy Ltd',
    itemCode: 'RAW-ALUM-6061',
    itemName: 'Aluminum Alloy Billet 6061-T6',
    lotBatchNumber: 'LOT-AL-8891B',
    sampleSize: 15,
    quantityInspected: 150,
    quantityAccepted: 150,
    quantityRejected: 0,
    certificateOfAnalysisAttached: true,
    status: 'PASSED',
    inspectorName: 'Dr. Sen (Chief Metallurgist)',
    clearedAt: '2026-10-06 11:20',
    remarks: 'Spectrometry analysis matches ASTM B221 composition standard with zero inclusions.',
    createdAt: '2026-10-06 10:15',
    parameters: [
      {
        parameter: 'Hardness (Brinell HB)',
        specification: '95 ± 5 HB',
        measuredValue: '96.2 HB',
        tolerance: '90 - 100 HB',
        isPass: true,
      },
      {
        parameter: 'Tensile Yield Strength',
        specification: '276 MPa min',
        measuredValue: '284 MPa',
        tolerance: '&gt;= 276 MPa',
        isPass: true,
      },
      {
        parameter: 'Diameter Outer Tolerance',
        specification: '150.0 ± 0.05 mm',
        measuredValue: '150.02 mm',
        tolerance: '149.95 - 150.05 mm',
        isPass: true,
      },
      {
        parameter: 'Surface Porosity Defect',
        specification: 'Zero surface cracks',
        measuredValue: 'Clean / Flawless',
        tolerance: 'None allowed',
        isPass: true,
      },
    ],
  },
  {
    id: 'inc-2',
    inspectionNumber: 'QC-IN-2026-0042',
    poNumber: 'PO-2026-092',
    supplierName: 'Silicon Dynamics Technologies',
    itemCode: 'ELEC-CTRL-MCU',
    itemName: 'Arm Cortex Microcontroller SoC',
    lotBatchNumber: 'MCU-LOT-2026W38',
    sampleSize: 20,
    quantityInspected: 500,
    quantityAccepted: 0,
    quantityRejected: 0,
    certificateOfAnalysisAttached: true,
    status: 'IN_PROGRESS',
    inspectorName: 'Priya Sharma (Lead QC)',
    remarks: 'ESD safe testing underway on digital oscilloscope and logic analyzer.',
    createdAt: '2026-10-07 09:30',
    parameters: [
      {
        parameter: 'Supply Voltage VDD',
        specification: '3.3V ± 0.1V',
        measuredValue: '3.31V',
        tolerance: '3.20 - 3.40V',
        isPass: true,
      },
      {
        parameter: 'Clock Frequency Stability',
        specification: '160 MHz ± 0.01%',
        measuredValue: '159.99 MHz',
        tolerance: '± 0.01%',
        isPass: true,
      },
      {
        parameter: 'Package Solder Ball Coplanarity',
        specification: '&lt; 0.08 mm',
        measuredValue: 'Testing in progress',
        tolerance: '&lt; 0.08 mm',
        isPass: true,
      },
    ],
  },
  {
    id: 'inc-3',
    inspectionNumber: 'QC-IN-2026-0040',
    poNumber: 'PO-2026-085',
    supplierName: 'Titan Castings & Forgings Corp',
    itemCode: 'RAW-STL-316L',
    itemName: 'Cold Rolled Steel Sheet 316L',
    lotBatchNumber: 'LOT-TC-4401',
    sampleSize: 10,
    quantityInspected: 100,
    quantityAccepted: 70,
    quantityRejected: 30,
    certificateOfAnalysisAttached: false,
    status: 'CONDITIONALLY_ACCEPTED',
    inspectorName: 'Vikram Joshi (Senior Auditor)',
    clearedAt: '2026-10-05 16:40',
    remarks: 'Minor edge burrs detected on 30 sheets. 70 prime sheets cleared for production; 30 rejected to quarantine.',
    createdAt: '2026-10-05 14:10',
    parameters: [
      {
        parameter: 'Sheet Thickness',
        specification: '4.00 ± 0.02 mm',
        measuredValue: '4.01 mm',
        tolerance: '3.98 - 4.02 mm',
        isPass: true,
      },
      {
        parameter: 'Edge Burr Height',
        specification: '&lt; 0.05 mm',
        measuredValue: '0.12 mm (Excessive on 30 pcs)',
        tolerance: '&lt; 0.05 mm',
        isPass: false,
      },
      {
        parameter: 'Corrosion Resistance Salt Spray',
        specification: '96 hours without rust',
        measuredValue: 'Passed 96 hrs test',
        tolerance: '&gt;= 96 hrs',
        isPass: true,
      },
    ],
  },
  {
    id: 'inc-4',
    inspectionNumber: 'QC-IN-2026-0038',
    poNumber: 'PO-2026-079',
    supplierName: 'Global Polymers Ltd',
    itemCode: 'CHEM-SEAL-EPOXY',
    itemName: 'Two-Part High Performance Epoxy Sealant',
    lotBatchNumber: 'EPX-9019-Z',
    sampleSize: 5,
    quantityInspected: 25,
    quantityAccepted: 0,
    quantityRejected: 25,
    certificateOfAnalysisAttached: true,
    status: 'FAILED',
    inspectorName: 'Dr. Sen (Chemical QC)',
    remarks: 'Viscosity failed ASTM D445 specification. High curing crystallization. Full rejection back to vendor.',
    createdAt: '2026-10-03 11:00',
    parameters: [
      {
        parameter: 'Dynamic Viscosity',
        specification: '1200 ± 100 cP',
        measuredValue: '1750 cP (Exceeded)',
        tolerance: '1100 - 1300 cP',
        isPass: false,
      },
      {
        parameter: 'Pot Life at 25°C',
        specification: '45 ± 5 mins',
        measuredValue: '28 mins (Premature gel)',
        tolerance: '40 - 50 mins',
        isPass: false,
      },
    ],
  },
];

export default function IncomingQualityPage() {
  const [inspections, setInspections] = useState<IncomingInspectionItem[]>(INITIAL_INCOMING_INSPECTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('inc-2');

  // Modals
  const [isNewInspectionModalOpen, setIsNewInspectionModalOpen] = useState(false);
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);
  const [selectedInspectionForClearance, setSelectedInspectionForClearance] = useState<IncomingInspectionItem | null>(null);

  // New Inspection Form
  const [newForm, setNewForm] = useState({
    poNumber: 'PO-2026-095',
    supplierName: 'Apex Precision Metallurgy Ltd',
    itemCode: 'RAW-ALUM-6061',
    itemName: 'Aluminum Alloy Billet 6061-T6',
    lotBatchNumber: 'LOT-AL-9002',
    sampleSize: 10,
    quantityInspected: 100,
    certificateOfAnalysisAttached: true,
    inspectorName: 'Dr. Sen (Chief Metallurgist)',
    remarks: '',
  });

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const newInspection: IncomingInspectionItem = {
      id: `inc-${Date.now()}`,
      inspectionNumber: `QC-IN-2026-00${inspections.length + 42}`,
      poNumber: newForm.poNumber,
      supplierName: newForm.supplierName,
      itemCode: newForm.itemCode,
      itemName: newForm.itemName,
      lotBatchNumber: newForm.lotBatchNumber,
      sampleSize: Number(newForm.sampleSize),
      quantityInspected: Number(newForm.quantityInspected),
      quantityAccepted: 0,
      quantityRejected: 0,
      certificateOfAnalysisAttached: newForm.certificateOfAnalysisAttached,
      status: 'IN_PROGRESS',
      inspectorName: newForm.inspectorName,
      remarks: newForm.remarks || 'Verification in progress according to QC Sampling Plan.',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      parameters: [
        {
          parameter: 'Visual Surface Quality',
          specification: 'Free of pits, burrs, or oxidation',
          measuredValue: 'Pass - Visual clean',
          tolerance: 'Zero cosmetic defect',
          isPass: true,
        },
        {
          parameter: 'Dimensional Verification',
          specification: 'Per engineering drawing ± 0.05 mm',
          measuredValue: 'Pending micrometer check',
          tolerance: '± 0.05 mm',
          isPass: true,
        },
      ],
    };

    setInspections([newInspection, ...inspections]);
    setExpandedId(newInspection.id);
    setIsNewInspectionModalOpen(false);
  };

  const handleIssueClearance = (status: QCStatus) => {
    if (!selectedInspectionForClearance) return;

    setInspections((prev) =>
      prev.map((i) => {
        if (i.id === selectedInspectionForClearance.id) {
          const isPass = status === 'PASSED';
          return {
            ...i,
            status,
            quantityAccepted: isPass ? i.quantityInspected : 0,
            quantityRejected: isPass ? 0 : i.quantityInspected,
            clearedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            remarks: `${i.remarks || ''}\n[Clearance Sign-off]: QC release authorized by ${i.inspectorName}.`,
          };
        }
        return i;
      })
    );

    setIsClearanceModalOpen(false);
    setSelectedInspectionForClearance(null);
  };

  const filteredInspections = inspections.filter((i) => {
    const matchesSearch =
      i.inspectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const pendingCount = inspections.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'PENDING').length;
  const passedCount = inspections.filter((i) => i.status === 'PASSED').length;
  const rejectedCount = inspections.filter((i) => i.status === 'FAILED').length;
  const conditionalCount = inspections.filter((i) => i.status === 'CONDITIONALLY_ACCEPTED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Scan className="w-7 h-7 text-blue-500" />
              Incoming Raw Material QC Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Pre-GRN Release
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Conduct multi-parameter laboratory tests, verify Supplier CoAs, and issue pre-GRN clearance approvals.
          </p>
        </div>

        <button
          onClick={() => setIsNewInspectionModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-sm shadow-blue-900/30"
        >
          <Plus className="w-4 h-4" />
          New Inspection Ticket
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Awaiting QC Testing</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">{pendingCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">lots in staging</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quarantine holding area</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Passed & Cleared</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{passedCount}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">unlocked for GRN</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">100% parameter compliance</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conditional Passes</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 dark:text-purple-400 border border-purple-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">{conditionalCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">split disposition</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Concession waiver approved</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rejected Lots</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 dark:text-rose-400 border border-rose-500/20">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-500 dark:text-rose-400">{rejectedCount}</span>
            <span className="text-xs text-rose-500 dark:text-rose-400 font-medium">RTV initiated</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Return to vendor</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search ticket #, PO #, supplier, item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PASSED">Passed</option>
            <option value="CONDITIONALLY_ACCEPTED">Conditionally Accepted</option>
            <option value="FAILED">Failed / Rejected</option>
          </select>
        </div>
      </div>

      {/* Inspections List */}
      <div className="space-y-3">
        {filteredInspections.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition"
            >
              {/* Header Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border ${
                      item.status === 'PASSED'
                        ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                        : item.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                        : item.status === 'CONDITIONALLY_ACCEPTED'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30'
                        : 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {item.status === 'PASSED' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : item.status === 'FAILED' ? (
                      <XCircle className="w-5 h-5" />
                    ) : item.status === 'CONDITIONALLY_ACCEPTED' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.inspectionNumber}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">[{item.poNumber}]</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          item.status === 'PASSED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : item.status === 'FAILED'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            : item.status === 'CONDITIONALLY_ACCEPTED'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                      {item.certificateOfAnalysisAttached && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <FileCheck className="w-3 h-3" /> CoA Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
                      {item.itemName} <span className="font-mono text-emerald-600 dark:text-emerald-400">({item.itemCode})</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Supplier: <strong className="text-slate-700 dark:text-slate-300">{item.supplierName}</strong> • Sample Size: {item.sampleSize} / {item.quantityInspected} units
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  {item.status === 'IN_PROGRESS' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInspectionForClearance(item);
                        setIsClearanceModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Issue Clearance
                    </button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Parameter Matrix */}
              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div>
                      <span>Inspector: <strong className="text-slate-800 dark:text-neutral-200">{item.inspectorName}</strong></span>
                      {item.clearedAt && <span className="ml-3">Cleared: <strong className="text-slate-800 dark:text-neutral-200">{item.clearedAt}</strong></span>}
                    </div>
                    <div>
                      <span>Accepted: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{item.quantityAccepted}</strong></span>
                      <span className="ml-3">Rejected: <strong className="text-rose-600 dark:text-rose-400 font-mono">{item.quantityRejected}</strong></span>
                    </div>
                  </div>

                  {item.remarks && (
                    <p className="text-xs text-slate-600 dark:text-neutral-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      QC Notes: {item.remarks}
                    </p>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-3 py-2">Test Parameter</th>
                          <th className="px-3 py-2">Engineering Specification</th>
                          <th className="px-3 py-2">Observed Measured Value</th>
                          <th className="px-3 py-2">Tolerance Band</th>
                          <th className="px-3 py-2 text-center">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-neutral-800 text-slate-700 dark:text-neutral-300">
                        {item.parameters.map((param, idx) => (
                          <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-neutral-800/40">
                            <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-neutral-200">{param.parameter}</td>
                            <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-neutral-300">{param.specification}</td>
                            <td className="px-3 py-2.5 font-mono font-semibold text-slate-900 dark:text-white">{param.measuredValue}</td>
                            <td className="px-3 py-2.5 font-mono text-slate-500 dark:text-neutral-400">{param.tolerance}</td>
                            <td className="px-3 py-2.5 text-center">
                              {param.isPass ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                                  <CheckCircle2 className="w-3 h-3" /> PASS
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-medium">
                                  <XCircle className="w-3 h-3" /> FAIL
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

      {/* MODAL: NEW INSPECTION TICKET */}
      {isNewInspectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scan className="w-5 h-5 text-blue-500" />
                Initiate Incoming Material Inspection
              </h3>
              <button
                onClick={() => setIsNewInspectionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Purchase Order (PO #)</label>
                  <input
                    type="text"
                    value={newForm.poNumber}
                    onChange={(e) => setNewForm({ ...newForm, poNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Lot / Batch Number</label>
                  <input
                    type="text"
                    value={newForm.lotBatchNumber}
                    onChange={(e) => setNewForm({ ...newForm, lotBatchNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Supplier Name</label>
                <input
                  type="text"
                  value={newForm.supplierName}
                  onChange={(e) => setNewForm({ ...newForm, supplierName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Item Code</label>
                  <input
                    type="text"
                    value={newForm.itemCode}
                    onChange={(e) => setNewForm({ ...newForm, itemCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Item Description</label>
                  <input
                    type="text"
                    value={newForm.itemName}
                    onChange={(e) => setNewForm({ ...newForm, itemName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Lot Quantity</label>
                  <input
                    type="number"
                    value={newForm.quantityInspected}
                    onChange={(e) => setNewForm({ ...newForm, quantityInspected: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">QC Sample Size</label>
                  <input
                    type="number"
                    value={newForm.sampleSize}
                    onChange={(e) => setNewForm({ ...newForm, sampleSize: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="coa"
                  checked={newForm.certificateOfAnalysisAttached}
                  onChange={(e) => setNewForm({ ...newForm, certificateOfAnalysisAttached: e.target.checked })}
                  className="rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-0"
                />
                <label htmlFor="coa" className="text-xs text-slate-700 dark:text-slate-300">
                  Manufacturer Certificate of Analysis (CoA) Attached & Validated
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned QC Inspector</label>
                <input
                  type="text"
                  value={newForm.inspectorName}
                  onChange={(e) => setNewForm({ ...newForm, inspectorName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewInspectionModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition flex items-center gap-2"
                >
                  <Scan className="w-4 h-4" />
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ISSUE PRE-GRN CLEARANCE */}
      {isClearanceModalOpen && selectedInspectionForClearance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-blue-500">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pre-GRN Quality Clearance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedInspectionForClearance.inspectionNumber}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Material:</span>
                <span className="text-slate-900 dark:text-white font-medium">{selectedInspectionForClearance.itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">PO Ref:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedInspectionForClearance.poNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Lot Units:</span>
                <span className="text-slate-900 dark:text-white font-bold font-mono">{selectedInspectionForClearance.quantityInspected} units</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Authorize disposal clearance for warehouse dock receiving. Releasing as passed will unlock automated Goods Received Note (GRN) generation and putaway allocation.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => handleIssueClearance('FAILED')}
                className="px-3 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
              >
                Reject Lot
              </button>
              <button
                onClick={() => handleIssueClearance('CONDITIONALLY_ACCEPTED')}
                className="px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold transition"
              >
                Conditional Pass
              </button>
              <button
                onClick={() => handleIssueClearance('PASSED')}
                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm"
              >
                Clear Full Lot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

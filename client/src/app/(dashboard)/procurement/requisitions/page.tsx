'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  X,
  FileCheck,
  Building2,
  PackageCheck,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  PurchaseRequisitionItem,
  RequisitionPriority,
  RequisitionStatus,
} from '@/types/procurement';

const INITIAL_REQUISITIONS: PurchaseRequisitionItem[] = [
  {
    id: 'pr-1',
    requisitionNumber: 'PR-2026-0091',
    requestedBy: 'Amit Joshi (Plant 1 Machine Shop)',
    department: 'CNC Machining Division',
    requiredByDate: '2026-10-14',
    priority: 'CRITICAL',
    status: 'PENDING_APPROVAL',
    totalEstimatedCost: 28400,
    justification: 'Automotive cylinder head batch run starting next week. Low on SS316 raw billets.',
    items: [
      {
        itemSku: 'RAW-STL-316-BILLET',
        itemName: 'Stainless Steel 316 Square Billets 100mm',
        quantity: 250,
        uom: 'PCS',
        estimatedUnitPrice: 113.6,
      },
    ],
    createdAt: '2026-10-06T09:30:00Z',
  },
  {
    id: 'pr-2',
    requisitionNumber: 'PR-2026-0092',
    requestedBy: 'Sunil Rao (Toolroom Lead)',
    department: 'Tool & Die Maintenance',
    requiredByDate: '2026-10-18',
    priority: 'HIGH',
    status: 'APPROVED',
    totalEstimatedCost: 14200,
    justification: 'Replacement carbide end mills and coolant concentrates for quarterly overhaul.',
    items: [
      {
        itemSku: 'TOOL-EM-CARB-12MM',
        itemName: 'Solid Carbide 4-Flute End Mill 12mm TiAlN',
        quantity: 80,
        uom: 'PCS',
        estimatedUnitPrice: 177.5,
      },
    ],
    approvedBy: 'Ramesh Patil (Plant Director)',
    approvedAt: '2026-10-06T16:00:00Z',
    createdAt: '2026-10-06T14:15:00Z',
  },
  {
    id: 'pr-3',
    requisitionNumber: 'PR-2026-0093',
    requestedBy: 'Kavita Menon (Assembly Floor)',
    department: 'Final Assembly Line 3',
    requiredByDate: '2026-10-22',
    priority: 'MEDIUM',
    status: 'PENDING_APPROVAL',
    totalEstimatedCost: 8900,
    justification: 'High-tensile fasteners M12 and Belleville spring washers for motor brackets.',
    items: [
      {
        itemSku: 'FAST-HEX-M12-88',
        itemName: 'Zinc Flake Hex Bolt M12x45mm Grade 8.8',
        quantity: 5000,
        uom: 'PCS',
        estimatedUnitPrice: 0.38,
      },
      {
        itemSku: 'WSHR-BEL-M12',
        itemName: 'Belleville Disc Springs Heavy Duty M12',
        quantity: 5000,
        uom: 'PCS',
        estimatedUnitPrice: 1.4,
      },
    ],
    createdAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'pr-4',
    requisitionNumber: 'PR-2026-0088',
    requestedBy: 'Vikram Shinde (Central Stores)',
    department: 'Warehouse & Receiving Hub',
    requiredByDate: '2026-10-10',
    priority: 'HIGH',
    status: 'ORDERED',
    totalEstimatedCost: 58000,
    justification: 'Hydraulic steel tubes replenishing safety stock levels below threshold.',
    items: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        itemName: 'Hydraulic Seamless Steel Tubes 80mm OD',
        quantity: 500,
        uom: 'MTRS',
        estimatedUnitPrice: 116.0,
      },
    ],
    approvedBy: 'Ramesh Patil',
    approvedAt: '2026-10-03T11:00:00Z',
    createdAt: '2026-10-02T10:00:00Z',
  },
];

export default function RequisitionsQueuePage() {
  const [requisitions, setRequisitions] = useState<PurchaseRequisitionItem[]>(INITIAL_REQUISITIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PurchaseRequisitionItem | null>(null);

  // Forms
  const [newPR, setNewPR] = useState({
    requestedBy: '',
    department: 'CNC Machining Division',
    requiredByDate: new Date().toISOString().split('T')[0],
    priority: 'HIGH' as RequisitionPriority,
    justification: '',
    itemSku: '',
    itemName: '',
    quantity: 100,
    uom: 'PCS',
    estimatedUnitPrice: 45,
  });

  const [reviewForm, setReviewForm] = useState({
    action: 'APPROVED' as 'APPROVED' | 'REJECTED',
    reviewedBy: 'Executive Sourcing Manager',
    rejectionReason: '',
  });

  const [convertForm, setConvertForm] = useState({
    vendorName: 'Tata Steel Tubes & Pipes Division',
    vendorEmail: 'sales@tatasteel.com',
    vendorPhone: '+91 98200 44551',
    vendorAddress: 'Jamshedpur Works, Jharkhand',
    promisedDeliveryDate: '2026-10-18',
    paymentTerms: 'NET_30',
    deliveryAddress: 'Central Raw Material Stores, Plant #1, Pune',
    issuedBy: 'Pooja Kulkarni (Senior Buyer)',
  });

  const filteredRequisitions = requisitions.filter((pr) => {
    const matchesSearch =
      pr.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.justification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.items.some((item) => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || pr.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || pr.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    const count = requisitions.length + 1;
    const requisitionNumber = `PR-2026-00${count < 10 ? '0' + count : count}`;
    const totalCost = newPR.quantity * newPR.estimatedUnitPrice;

    const created: PurchaseRequisitionItem = {
      id: `pr-${Date.now()}`,
      requisitionNumber,
      requestedBy: newPR.requestedBy,
      department: newPR.department,
      requiredByDate: newPR.requiredByDate,
      priority: newPR.priority,
      status: 'PENDING_APPROVAL',
      totalEstimatedCost: totalCost,
      justification: newPR.justification,
      items: [
        {
          itemSku: newPR.itemSku,
          itemName: newPR.itemName,
          quantity: newPR.quantity,
          uom: newPR.uom,
          estimatedUnitPrice: newPR.estimatedUnitPrice,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setRequisitions([created, ...requisitions]);
    setIsCreateModalOpen(false);
    setNewPR({
      requestedBy: '',
      department: 'CNC Machining Division',
      requiredByDate: new Date().toISOString().split('T')[0],
      priority: 'HIGH',
      justification: '',
      itemSku: '',
      itemName: '',
      quantity: 100,
      uom: 'PCS',
      estimatedUnitPrice: 45,
    });
  };

  const handleReviewPR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPR) return;

    setRequisitions((prev) =>
      prev.map((pr) =>
        pr.id === selectedPR.id
          ? {
              ...pr,
              status: reviewForm.action === 'APPROVED' ? 'APPROVED' : 'REJECTED',
              approvedBy: reviewForm.reviewedBy,
              approvedAt: new Date().toISOString(),
              rejectionReason: reviewForm.action === 'REJECTED' ? reviewForm.rejectionReason : undefined,
            }
          : pr,
      ),
    );

    setIsReviewModalOpen(false);
    setSelectedPR(null);
  };

  const handleConvertPRToPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPR) return;

    setRequisitions((prev) =>
      prev.map((pr) =>
        pr.id === selectedPR.id
          ? {
              ...pr,
              status: 'ORDERED',
            }
          : pr,
      ),
    );

    alert(`Successfully generated Purchase Order from ${selectedPR.requisitionNumber} for ${convertForm.vendorName}!`);
    setIsConvertModalOpen(false);
    setSelectedPR(null);
  };

  const getPriorityBadge = (p: RequisitionPriority) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'LOW':
        return 'bg-slate-100 dark:bg-slate-700/30 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/40';
    }
  };

  const getStatusBadge = (s: RequisitionStatus) => {
    switch (s) {
      case 'PENDING_APPROVAL':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'ORDERED':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Material Requisition Review Queue (PR to PO)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Incoming internal purchase requisitions from shop floor machining, assembly lines, and warehouse safety stock buffers.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Raise Purchase Requisition
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search PR #, requester, department, material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_APPROVAL">Pending Review</option>
            <option value="APPROVED">Approved (Ready for PO)</option>
            <option value="ORDERED">PO Converted</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 text-xs"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical (Line-Stopping)</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Requisitions Table */}
      <div className="rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">PR # & Priority</th>
                <th className="py-3 px-4">Department & Requester</th>
                <th className="py-3 px-4">Requested Materials</th>
                <th className="py-3 px-4">Need Date</th>
                <th className="py-3 px-4">Estimated Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300 font-normal">
              {filteredRequisitions.map((pr) => (
                <tr key={pr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white font-mono">{pr.requisitionNumber}</div>
                    <span
                      className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(
                        pr.priority,
                      )}`}
                    >
                      {pr.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 dark:text-white">{pr.department}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{pr.requestedBy}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {pr.items[0]?.itemName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {pr.items[0]?.quantity} {pr.items[0]?.uom} @ ${pr.items[0]?.estimatedUnitPrice}
                      {pr.items.length > 1 && ` (+${pr.items.length - 1} more items)`}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 dark:text-white">{pr.requiredByDate}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">Raised: {pr.createdAt?.split('T')[0]}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    ${pr.totalEstimatedCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                        pr.status,
                      )}`}
                    >
                      {pr.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {pr.status === 'PENDING_APPROVAL' && (
                        <button
                          onClick={() => {
                            setSelectedPR(pr);
                            setIsReviewModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-[11px] font-semibold transition-all"
                        >
                          Review PR
                        </button>
                      )}
                      {pr.status === 'APPROVED' && (
                        <button
                          onClick={() => {
                            setSelectedPR(pr);
                            setIsConvertModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-semibold transition-all flex items-center gap-1"
                        >
                          <PackageCheck className="h-3.5 w-3.5" /> Convert to PO
                        </button>
                      )}
                      {pr.status === 'ORDERED' && (
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> PO Generated
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Purchase Requisition */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <FileSpreadsheet className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Raise Internal Purchase Requisition</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePR} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Requested By (Name & ID) *</label>
                  <input
                    type="text"
                    required
                    value={newPR.requestedBy}
                    onChange={(e) => setNewPR({ ...newPR, requestedBy: e.target.value })}
                    placeholder="e.g. Amit Joshi (Shop Floor)"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Department / Division *</label>
                  <select
                    value={newPR.department}
                    onChange={(e) => setNewPR({ ...newPR, department: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CNC Machining Division">CNC Machining Division</option>
                    <option value="Tool & Die Maintenance">Tool & Die Maintenance</option>
                    <option value="Final Assembly Line 3">Final Assembly Line 3</option>
                    <option value="Warehouse & Receiving Hub">Warehouse & Receiving Hub</option>
                    <option value="Quality Inspection Lab">Quality Inspection Lab</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Required Need Date *</label>
                  <input
                    type="date"
                    required
                    value={newPR.requiredByDate}
                    onChange={(e) => setNewPR({ ...newPR, requiredByDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Priority Urgency *</label>
                  <select
                    value={newPR.priority}
                    onChange={(e) =>
                      setNewPR({ ...newPR, priority: e.target.value as RequisitionPriority })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CRITICAL">Critical (Line-Stopping Risk)</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium (Scheduled Run)</option>
                    <option value="LOW">Low (Buffer Restock)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Material SKU *</label>
                  <input
                    type="text"
                    required
                    value={newPR.itemSku}
                    onChange={(e) => setNewPR({ ...newPR, itemSku: e.target.value })}
                    placeholder="RAW-STL-316-BILLET"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Material Name *</label>
                  <input
                    type="text"
                    required
                    value={newPR.itemName}
                    onChange={(e) => setNewPR({ ...newPR, itemName: e.target.value })}
                    placeholder="SS 316 Square Billets 100mm"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPR.quantity}
                    onChange={(e) => setNewPR({ ...newPR, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">UOM</label>
                  <input
                    type="text"
                    value={newPR.uom}
                    onChange={(e) => setNewPR({ ...newPR, uom: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Est. Unit Price ($)</label>
                  <input
                    type="number"
                    value={newPR.estimatedUnitPrice}
                    onChange={(e) => setNewPR({ ...newPR, estimatedUnitPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1">Business Justification *</label>
                <textarea
                  required
                  rows={2}
                  value={newPR.justification}
                  onChange={(e) => setNewPR({ ...newPR, justification: e.target.value })}
                  placeholder="Detail work order reference, production timeline, or safety buffer..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold"
                >
                  Submit PR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Review Requisition */}
      {isReviewModalOpen && selectedPR && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <FileCheck className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Review Purchase Requisition</h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white font-mono">{selectedPR.requisitionNumber}</div>
              <div className="text-slate-700 dark:text-slate-300">{selectedPR.department} - {selectedPR.requestedBy}</div>
              <div className="text-slate-500 dark:text-slate-400">Est. Total: <strong className="text-emerald-600 dark:text-emerald-400">${selectedPR.totalEstimatedCost.toLocaleString()}</strong></div>
              <div className="text-slate-600 dark:text-slate-300 italic mt-1">"{selectedPR.justification}"</div>
            </div>

            <form onSubmit={handleReviewPR} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1">Approval Decision *</label>
                <select
                  value={reviewForm.action}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, action: e.target.value as 'APPROVED' | 'REJECTED' })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="APPROVED">Approve Requisition (Authorize Sourcing)</option>
                  <option value="REJECTED">Reject Requisition</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1">Reviewing Authority *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.reviewedBy}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewedBy: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {reviewForm.action === 'REJECTED' && (
                <div>
                  <label className="block text-rose-600 dark:text-rose-400 mb-1">Rejection Reason *</label>
                  <textarea
                    required
                    rows={2}
                    value={reviewForm.rejectionReason}
                    onChange={(e) => setReviewForm({ ...reviewForm, rejectionReason: e.target.value })}
                    placeholder="Explain why requisition cannot be approved at this time..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg font-semibold text-white ${
                    reviewForm.action === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {reviewForm.action === 'APPROVED' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Convert Approved PR to PO */}
      {isConvertModalOpen && selectedPR && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <PackageCheck className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Convert PR to Purchase Order</h3>
              </div>
              <button
                onClick={() => setIsConvertModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white font-mono">{selectedPR.requisitionNumber}</div>
              <div className="text-slate-700 dark:text-slate-300">
                Item: {selectedPR.items[0]?.itemName} ({selectedPR.items[0]?.quantity} {selectedPR.items[0]?.uom})
              </div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                PO Subtotal: ${selectedPR.totalEstimatedCost.toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleConvertPRToPO} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Approved Vendor *</label>
                  <input
                    type="text"
                    required
                    value={convertForm.vendorName}
                    onChange={(e) => setConvertForm({ ...convertForm, vendorName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Vendor Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={convertForm.vendorEmail}
                    onChange={(e) => setConvertForm({ ...convertForm, vendorEmail: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Promised Delivery Date *</label>
                  <input
                    type="date"
                    required
                    value={convertForm.promisedDeliveryDate}
                    onChange={(e) =>
                      setConvertForm({ ...convertForm, promisedDeliveryDate: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={convertForm.paymentTerms}
                    onChange={(e) => setConvertForm({ ...convertForm, paymentTerms: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1">Factory Receiving Address</label>
                <input
                  type="text"
                  value={convertForm.deliveryAddress}
                  onChange={(e) => setConvertForm({ ...convertForm, deliveryAddress: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsConvertModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Generate Official PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

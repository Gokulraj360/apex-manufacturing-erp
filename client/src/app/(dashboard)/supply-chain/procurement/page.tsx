'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  FileSpreadsheet,
  Building2,
  Calendar,
  DollarSign,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  ExternalLink,
  Check,
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import {
  PurchaseRequisitionItem,
  PurchaseOrderSupplyItem,
  RequisitionPriority,
  RequisitionStatus,
  SupplyPOStatus,
} from '@/types/supply-chain';

const INITIAL_REQUISITIONS: PurchaseRequisitionItem[] = [
  {
    id: 'pr-1',
    requisitionNumber: 'PR-2026-0082',
    requestedBy: 'Prakash Shinde (Machine Shop Supv)',
    department: 'Production Machining',
    requiredByDate: '2026-10-22',
    priority: 'HIGH',
    status: 'SUBMITTED',
    totalEstimatedCost: 18400,
    justification: 'Replenishment of high-speed carbide milling inserts for CNC cell 4.',
    items: [
      {
        itemSku: 'TOOL-INS-CNMG12',
        itemName: 'Carbide Turning Inserts CNMG 120408 Grade PR1125',
        quantity: 200,
        uom: 'PCS',
        estimatedUnitPrice: 92,
      },
    ],
    createdAt: '2026-10-06',
  },
  {
    id: 'pr-2',
    requisitionNumber: 'PR-2026-0080',
    requestedBy: 'Vikram Joshi (Maintenance Engineer)',
    department: 'Plant Maintenance',
    requiredByDate: '2026-10-18',
    priority: 'CRITICAL',
    status: 'APPROVED',
    totalEstimatedCost: 9500,
    justification: 'Critical breakdown replacement hydraulic valves for 500T Stamping Press.',
    items: [
      {
        itemSku: 'SP-VLV-HYD-50',
        itemName: 'Proportional Directional Control Valve 24VDC',
        quantity: 2,
        uom: 'PCS',
        estimatedUnitPrice: 4750,
      },
    ],
    approvedBy: 'Rajiv Sharma (Plant Director)',
    approvedAt: '2026-10-06 14:15',
    createdAt: '2026-10-05',
  },
  {
    id: 'pr-3',
    requisitionNumber: 'PR-2026-0078',
    requestedBy: 'Anil Deshmukh (Production Planning)',
    department: 'SCM & Stores',
    requiredByDate: '2026-10-15',
    priority: 'MEDIUM',
    status: 'CONVERTED_TO_PO',
    totalEstimatedCost: 68440,
    justification: 'Master MRP planned order release for cold-drawn steel hydraulic tubes.',
    items: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        itemName: 'Seamless Cold Drawn Hydraulic Steel Tubes 80mm',
        quantity: 500,
        uom: 'PCS',
        estimatedUnitPrice: 116,
      },
    ],
    approvedBy: 'Rajiv Sharma (Plant Director)',
    approvedAt: '2026-10-04 10:00',
    createdAt: '2026-10-03',
  },
];

const INITIAL_PURCHASE_ORDERS: PurchaseOrderSupplyItem[] = [
  {
    id: 'po-1',
    poNumber: 'POS-2026-0112',
    vendorId: 'vnd-1',
    vendor: {
      id: 'vnd-1',
      vendorCode: 'VND-SUP-001',
      companyName: 'Tata Steel Tubes & Pipes Division',
      contactPerson: 'Anand Mehta',
      email: 'anand.m@tatasteel.internal',
      phone: '+91 98200 44551',
      address: 'Plot 18, Steel Complex',
      city: 'Jamshedpur',
      country: 'India',
      tierRating: 'TIER_1_STRATEGIC',
      categories: ['RAW_METALS', 'TUBES'],
      leadTimeDaysAvg: 7,
      onTimeDeliveryRate: 98.4,
      qualityScore: 99.1,
      costCompetitiveness: 94.0,
      overallScore: 97.4,
      paymentTerms: 'NET_30',
      isActive: true,
    },
    requisitionId: 'pr-3',
    orderDate: '2026-10-04',
    expectedDeliveryDate: '2026-10-11',
    paymentTerms: 'NET_30',
    incoterms: 'FOB',
    status: 'IN_TRANSIT',
    currency: 'USD',
    subtotal: 58000,
    taxAmount: 10440,
    totalAmount: 68440,
    shippingAddress: 'Plant 1 Main Stores, MIDC Chakan, Pune',
    items: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        itemName: 'Seamless Cold Drawn Hydraulic Steel Tubes 80mm',
        orderedQty: 500,
        receivedQty: 0,
        unitPrice: 116,
        lineTotal: 58000,
      },
    ],
    issuedBy: 'Pooja Kulkarni (Procurement Lead)',
    createdAt: '2026-10-04',
  },
  {
    id: 'po-2',
    poNumber: 'POS-2026-0114',
    vendorId: 'vnd-2',
    vendor: {
      id: 'vnd-2',
      vendorCode: 'VND-SUP-002',
      companyName: 'SKF Bearings Industrial Fleet',
      contactPerson: 'David Ross',
      email: 'david.ross@skf.internal',
      phone: '+91 97110 99882',
      address: 'Industrial Corridor Zone 4',
      city: 'Bengaluru',
      country: 'India',
      tierRating: 'TIER_1_STRATEGIC',
      categories: ['BEARINGS', 'ROTARY_COMPONENTS'],
      leadTimeDaysAvg: 5,
      onTimeDeliveryRate: 97.8,
      qualityScore: 99.5,
      costCompetitiveness: 91.2,
      overallScore: 96.6,
      paymentTerms: 'NET_45',
      isActive: true,
    },
    orderDate: '2026-10-05',
    expectedDeliveryDate: '2026-10-10',
    paymentTerms: 'NET_45',
    incoterms: 'CIF',
    status: 'ACKNOWLEDGED',
    currency: 'USD',
    subtotal: 32400,
    taxAmount: 5832,
    totalAmount: 38232,
    shippingAddress: 'Plant 1 Main Stores, MIDC Chakan, Pune',
    items: [
      {
        itemSku: 'CMP-BRG-6208',
        itemName: 'Deep Groove Radial Ball Bearings 6208-2RS',
        orderedQty: 1200,
        receivedQty: 0,
        unitPrice: 27,
        lineTotal: 32400,
      },
    ],
    issuedBy: 'Pooja Kulkarni (Procurement Lead)',
    createdAt: '2026-10-05',
  },
];

export default function ProcurementManagementPage() {
  const [activeTab, setActiveTab] = useState<'REQUISITIONS' | 'ORDERS'>('REQUISITIONS');
  const [requisitions, setRequisitions] = useState<PurchaseRequisitionItem[]>(INITIAL_REQUISITIONS);
  const [orders, setOrders] = useState<PurchaseOrderSupplyItem[]>(INITIAL_PURCHASE_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // New Requisition State
  const [newPrNumber, setNewPrNumber] = useState('');
  const [newDepartment, setNewDepartment] = useState('Production Machining');
  const [newRequiredByDate, setNewRequiredByDate] = useState('2026-10-25');
  const [newPriority, setNewPriority] = useState<RequisitionPriority>('MEDIUM');
  const [newJustification, setNewJustification] = useState('');
  const [prItemSku, setPrItemSku] = useState('TOOL-INS-CNMG12');
  const [prItemName, setPrItemName] = useState('Carbide Turning Inserts CNMG 120408');
  const [prItemQty, setPrItemQty] = useState('100');
  const [prItemUom, setPrItemUom] = useState('PCS');
  const [prItemRate, setPrItemRate] = useState('92');

  // New PO State
  const [newPoNumber, setNewPoNumber] = useState('');
  const [newPoVendor, setNewPoVendor] = useState('Tata Steel Tubes & Pipes Division');
  const [newPoDeliveryDate, setNewPoDeliveryDate] = useState('2026-10-20');
  const [newPoTerms, setNewPoTerms] = useState('NET_30');
  const [newPoIncoterms, setNewPoIncoterms] = useState('FOB');
  const [newPoAddress, setNewPoAddress] = useState('Plant 1 Main Stores, MIDC Chakan, Pune');
  const [poItemSku, setPoItemSku] = useState('RAW-STL-TUBE-80');
  const [poItemName, setPoItemName] = useState('Seamless Cold Drawn Steel Tubes');
  const [poItemQty, setPoItemQty] = useState('250');
  const [poItemRate, setPoItemRate] = useState('116');

  // Filtering
  const filteredRequisitions = requisitions.filter((pr) => {
    const matchesSearch =
      pr.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.justification.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || pr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendor?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendor?.vendorCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenRequisitionModal = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setNewPrNumber(`PR-2026-${randomSuffix}`);
    setIsRequisitionModalOpen(true);
  };

  const handleOpenOrderModal = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setNewPoNumber(`POS-2026-${randomSuffix}`);
    setIsOrderModalOpen(true);
  };

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(prItemQty) || 1;
    const rate = parseFloat(prItemRate) || 0;
    const totalCost = qty * rate;

    const newPr: PurchaseRequisitionItem = {
      id: `pr-${Date.now()}`,
      requisitionNumber: newPrNumber,
      requestedBy: 'Current Session User (Planning)',
      department: newDepartment,
      requiredByDate: newRequiredByDate,
      priority: newPriority,
      status: 'SUBMITTED',
      totalEstimatedCost: totalCost,
      justification: newJustification,
      items: [
        {
          itemSku: prItemSku,
          itemName: prItemName,
          quantity: qty,
          uom: prItemUom,
          estimatedUnitPrice: rate,
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRequisitions([newPr, ...requisitions]);
    setIsRequisitionModalOpen(false);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(poItemQty) || 1;
    const rate = parseFloat(poItemRate) || 0;
    const subtotal = qty * rate;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const newPo: PurchaseOrderSupplyItem = {
      id: `po-${Date.now()}`,
      poNumber: newPoNumber,
      vendorId: 'vnd-1',
      vendor: {
        id: 'vnd-1',
        vendorCode: 'VND-SUP-001',
        companyName: newPoVendor,
        contactPerson: 'Accounts Desk',
        email: 'sales@vendor.internal',
        phone: '+91 98000 11223',
        address: 'Industrial Zone',
        city: 'Jamshedpur',
        country: 'India',
        tierRating: 'TIER_1_STRATEGIC',
        categories: ['RAW_METALS'],
        leadTimeDaysAvg: 7,
        onTimeDeliveryRate: 98.4,
        qualityScore: 99.1,
        costCompetitiveness: 94.0,
        overallScore: 97.4,
        paymentTerms: newPoTerms,
        isActive: true,
      },
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: newPoDeliveryDate,
      paymentTerms: newPoTerms,
      incoterms: newPoIncoterms,
      status: 'ISSUED',
      currency: 'USD',
      subtotal,
      taxAmount: tax,
      totalAmount: total,
      shippingAddress: newPoAddress,
      items: [
        {
          itemSku: poItemSku,
          itemName: poItemName,
          orderedQty: qty,
          receivedQty: 0,
          unitPrice: rate,
          lineTotal: subtotal,
        },
      ],
      issuedBy: 'Pooja Kulkarni (Procurement Lead)',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrders([newPo, ...orders]);
    setIsOrderModalOpen(false);
  };

  const handleApproveRequisition = (prId: string) => {
    setRequisitions((prev) =>
      prev.map((pr) =>
        pr.id === prId
          ? {
              ...pr,
              status: 'APPROVED',
              approvedBy: 'Rajiv Sharma (Plant Director)',
              approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : pr
      )
    );
  };

  const handleUpdateOrderStatus = (poId: string, status: SupplyPOStatus) => {
    setOrders((prev) =>
      prev.map((po) => (po.id === poId ? { ...po, status } : po))
    );
  };

  const getPriorityBadge = (priority: RequisitionPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">LOW</span>;
      default:
        return <span className="text-xs text-slate-400">{priority}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/supply-chain"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Supply Chain Flow Command
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-cyan-400" />
              Procurement &amp; Purchase Order Issuance Console
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Cross-department purchase requisitions, approval matrix workflows, autonomous PO issuance, and fulfillment tracking.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenRequisitionModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors"
            >
              <Plus className="h-4 w-4 text-cyan-400" />
              Raise Requisition (PR)
            </button>
            <button
              onClick={handleOpenOrderModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Issue Purchase Order (PO)
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => {
            setActiveTab('REQUISITIONS');
            setStatusFilter('ALL');
          }}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'REQUISITIONS'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          Purchase Requisitions ({requisitions.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('ORDERS');
            setStatusFilter('ALL');
          }}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'ORDERS'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Purchase Orders ({orders.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a]/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'REQUISITIONS'
                ? 'Search PR #, Department, Justification...'
                : 'Search PO #, Supplier, Code...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            {activeTab === 'REQUISITIONS' ? (
              <>
                <option value="SUBMITTED">Submitted</option>
                <option value="APPROVED">Approved</option>
                <option value="CONVERTED_TO_PO">Converted to PO</option>
              </>
            ) : (
              <>
                <option value="ISSUED">Issued</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="PARTIALLY_DELIVERED">Partially Delivered</option>
                <option value="FULFILLED">Fulfilled</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* TAB 1: Purchase Requisitions Table */}
      {activeTab === 'REQUISITIONS' && (
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Purchase Requisitions (PR) Workflow</h2>
              <span className="text-xs text-slate-400">({filteredRequisitions.length} requisitions)</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Department Budget Allocation &amp; Verification Matrix
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-medium border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">PR # &amp; Requested By</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Required Date</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Estimated Spend</th>
                  <th className="py-3 px-4">Items / Justification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {filteredRequisitions.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white font-mono">{pr.requisitionNumber}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{pr.requestedBy}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200">{pr.department}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Calendar className="h-3 w-3 text-cyan-400" />
                        <span>{pr.requiredByDate}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getPriorityBadge(pr.priority)}</td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ${pr.totalEstimatedCost.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">
                        {pr.items[0]?.itemName} ({pr.items[0]?.quantity} {pr.items[0]?.uom})
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">
                        {pr.justification}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {pr.status === 'SUBMITTED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          SUBMITTED
                        </span>
                      )}
                      {pr.status === 'APPROVED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          APPROVED
                        </span>
                      )}
                      {pr.status === 'CONVERTED_TO_PO' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          CONVERTED TO PO
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {pr.status === 'SUBMITTED' && (
                        <button
                          onClick={() => handleApproveRequisition(pr.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors ml-auto"
                        >
                          <Check className="h-3 w-3" />
                          Approve PR
                        </button>
                      )}
                      {pr.status === 'APPROVED' && (
                        <span className="text-[10px] font-mono text-slate-500">
                          Ready for PO
                        </span>
                      )}
                      {pr.status === 'CONVERTED_TO_PO' && (
                        <span className="text-[10px] font-mono text-cyan-400">
                          PO Issued
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

      {/* TAB 2: Purchase Orders Table */}
      {activeTab === 'ORDERS' && (
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Purchase Orders (PO) Commitment Register</h2>
              <span className="text-xs text-slate-400">({filteredOrders.length} orders)</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Contractually Binding Supplier Commitments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-medium border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">PO # &amp; Date</th>
                  <th className="py-3 px-4">Supplier &amp; City</th>
                  <th className="py-3 px-4">Ordered SKUs</th>
                  <th className="py-3 px-4">Total Amount (Inc Tax)</th>
                  <th className="py-3 px-4">Expected Delivery</th>
                  <th className="py-3 px-4">Terms</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {filteredOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white font-mono">{po.poNumber}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{po.orderDate}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{po.vendor?.companyName}</div>
                      <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                        {po.vendor?.city} • {po.vendor?.vendorCode}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-white font-medium">{po.items[0]?.itemSku}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {po.items[0]?.itemName} ({po.items[0]?.orderedQty} units)
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ${po.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Clock className="h-3 w-3 text-cyan-400" />
                        <span>{po.expectedDeliveryDate}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                      {po.paymentTerms} / {po.incoterms}
                    </td>

                    <td className="py-3.5 px-4">
                      {po.status === 'ISSUED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          ISSUED
                        </span>
                      )}
                      {po.status === 'ACKNOWLEDGED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          ACKNOWLEDGED
                        </span>
                      )}
                      {po.status === 'IN_TRANSIT' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          IN TRANSIT
                        </span>
                      )}
                      {po.status === 'FULFILLED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          FULFILLED
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {po.status === 'ISSUED' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(po.id, 'ACKNOWLEDGED')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors ml-auto"
                        >
                          Acknowledge
                        </button>
                      )}
                      {po.status === 'ACKNOWLEDGED' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(po.id, 'IN_TRANSIT')}
                          className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1 transition-colors ml-auto"
                        >
                          <Truck className="h-3 w-3" />
                          In Transit
                        </button>
                      )}
                      {po.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(po.id, 'FULFILLED')}
                          className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors ml-auto"
                        >
                          <Check className="h-3 w-3" />
                          Mark Delivered
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

      {/* MODAL 1: Raise Purchase Requisition */}
      {isRequisitionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">Raise Purchase Requisition</h3>
              </div>
              <button
                onClick={() => setIsRequisitionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequisition} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Requisition Number <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPrNumber}
                    onChange={(e) => setNewPrNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Department <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Required By Date <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newRequiredByDate}
                    onChange={(e) => setNewRequiredByDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as RequisitionPriority)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL (Emergency)</option>
                  </select>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Item Requirements
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Item SKU</label>
                    <input
                      type="text"
                      value={prItemSku}
                      onChange={(e) => setPrItemSku(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={prItemName}
                      onChange={(e) => setPrItemName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={prItemQty}
                      onChange={(e) => setPrItemQty(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">UOM</label>
                    <input
                      type="text"
                      value={prItemUom}
                      onChange={(e) => setPrItemUom(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Est. Unit Price ($)</label>
                    <input
                      type="number"
                      value={prItemRate}
                      onChange={(e) => setPrItemRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Business Justification <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={newJustification}
                  onChange={(e) => setNewJustification(e.target.value)}
                  placeholder="e.g. Replenishment of critical cutting tools ahead of batch production..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRequisitionModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Issue Direct Purchase Order */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">Issue Direct Purchase Order (PO)</h3>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    PO Number <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPoNumber}
                    onChange={(e) => setNewPoNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Supplier Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPoVendor}
                    onChange={(e) => setNewPoVendor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Expected Delivery Date <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newPoDeliveryDate}
                    onChange={(e) => setNewPoDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={newPoTerms}
                    onChange={(e) => setNewPoTerms(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Incoterms
                  </label>
                  <input
                    type="text"
                    value={newPoIncoterms}
                    onChange={(e) => setNewPoIncoterms(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Line Item */}
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Primary Ordered Line Item
                </span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">SKU</label>
                    <input
                      type="text"
                      value={poItemSku}
                      onChange={(e) => setPoItemSku(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={poItemName}
                      onChange={(e) => setPoItemName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Qty</label>
                    <input
                      type="number"
                      value={poItemQty}
                      onChange={(e) => setPoItemQty(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Unit Price ($)</label>
                    <input
                      type="number"
                      value={poItemRate}
                      onChange={(e) => setPoItemRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Delivery Destination Plant Stores
                </label>
                <input
                  type="text"
                  value={newPoAddress}
                  onChange={(e) => setNewPoAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

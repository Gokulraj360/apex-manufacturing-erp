'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Truck,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  ExternalLink,
} from 'lucide-react';
import {
  JobWorkOrderItem,
  SubcontractorVendorItem,
  SubcontractProcessType,
  JobWorkStatus,
} from '@/types/subcontracting';

const INITIAL_VENDORS: SubcontractorVendorItem[] = [
  {
    id: 'ven-1',
    vendorCode: 'VEN-SC-001',
    companyName: 'Apex Electroplating & Surface Coatings Ltd',
    contactPerson: 'Ramesh Sundaram',
    email: 'ramesh@apexcoatings.internal',
    phone: '+91 98201 12345',
    address: 'Plot 42, Industrial Area Phase II',
    city: 'Pune',
    specializedProcesses: ['ELECTROPLATING', 'ANODIZING'],
    qualityRating: 98.2,
    avgTurnaroundDays: 2.8,
    isActive: true,
  },
  {
    id: 'ven-2',
    vendorCode: 'VEN-SC-002',
    companyName: 'Bharat Thermal & Vacuum Heat Treaters',
    contactPerson: 'Sanjay Deshmukh',
    email: 'sanjay@bharatheat.internal',
    phone: '+91 98450 67890',
    address: 'Sector 8, Auto Cluster',
    city: 'Aurangabad',
    specializedProcesses: ['HEAT_TREATMENT'],
    qualityRating: 96.5,
    avgTurnaroundDays: 3.5,
    isActive: true,
  },
  {
    id: 'ven-3',
    vendorCode: 'VEN-SC-003',
    companyName: 'Precision Die Castings & Alloys Corp',
    contactPerson: 'Arun Kulkarni',
    email: 'arun@precisiondie.internal',
    phone: '+91 94220 54321',
    address: 'MIDC Chakan Block C',
    city: 'Chakan',
    specializedProcesses: ['DIE_CASTING'],
    qualityRating: 94.8,
    avgTurnaroundDays: 4.2,
    isActive: true,
  },
];

const INITIAL_ORDERS: JobWorkOrderItem[] = [
  {
    id: 'jwo-1',
    orderNumber: 'JWO-2026-0042',
    vendorId: 'ven-1',
    vendor: INITIAL_VENDORS[0],
    processType: 'ELECTROPLATING',
    processDescription: 'Hard Chrome Electroplating 25 Micron on Piston Rods',
    targetProductPart: 'Hydraulic Piston Rod PR-90',
    inputItemSku: 'RAW-ROD-90',
    outputItemSku: 'FIN-ROD-90-PLATED',
    targetQuantity: 500,
    receivedQuantity: 320,
    rejectedQuantity: 4,
    scrapAllowancePercent: 2.0,
    unitProcessingRate: 18.5,
    totalOrderValue: 9250,
    status: 'IN_PROGRESS',
    issuedDate: '2026-10-04',
    expectedDeliveryDate: '2026-10-10',
  },
  {
    id: 'jwo-2',
    orderNumber: 'JWO-2026-0043',
    vendorId: 'ven-2',
    vendor: INITIAL_VENDORS[1],
    processType: 'HEAT_TREATMENT',
    processDescription: 'Vacuum Gas Quenching & Case Hardening 58-62 HRC',
    targetProductPart: 'Helical Drive Pinion Gear PG-44',
    inputItemSku: 'RAW-GEAR-44',
    outputItemSku: 'HT-GEAR-44-HARDENED',
    targetQuantity: 250,
    receivedQuantity: 0,
    rejectedQuantity: 0,
    scrapAllowancePercent: 1.5,
    unitProcessingRate: 34.0,
    totalOrderValue: 8500,
    status: 'ISSUED',
    issuedDate: '2026-10-06',
    expectedDeliveryDate: '2026-10-12',
  },
  {
    id: 'jwo-3',
    orderNumber: 'JWO-2026-0040',
    vendorId: 'ven-3',
    vendor: INITIAL_VENDORS[2],
    processType: 'DIE_CASTING',
    processDescription: 'High Pressure Aluminium Die Casting ADC12',
    targetProductPart: 'Motor End Shield Flange MS-112',
    inputItemSku: 'INGOT-AL-ADC12',
    outputItemSku: 'CAST-FLANGE-112',
    targetQuantity: 800,
    receivedQuantity: 800,
    rejectedQuantity: 12,
    scrapAllowancePercent: 2.5,
    unitProcessingRate: 42.0,
    totalOrderValue: 33600,
    status: 'COMPLETED',
    issuedDate: '2026-09-28',
    expectedDeliveryDate: '2026-10-05',
    completedDate: '2026-10-05',
  },
];

export default function JobWorkOrdersPage() {
  const [orders, setOrders] = useState<JobWorkOrderItem[]>(INITIAL_ORDERS);
  const [vendors, setVendors] = useState<SubcontractorVendorItem[]>(INITIAL_VENDORS);

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'VENDORS'>('ORDERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [processFilter, setProcessFilter] = useState('ALL');

  // Modals
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [isEnrollVendorModalOpen, setIsEnrollVendorModalOpen] = useState(false);

  // New Order Form
  const [newOrderNumber, setNewOrderNumber] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState(INITIAL_VENDORS[0]?.id || '');
  const [newProcessType, setNewProcessType] = useState<SubcontractProcessType>('ELECTROPLATING');
  const [newDescription, setNewDescription] = useState('');
  const [newPart, setNewPart] = useState('');
  const [newInputSku, setNewInputSku] = useState('');
  const [newOutputSku, setNewOutputSku] = useState('');
  const [newTargetQty, setNewTargetQty] = useState('500');
  const [newScrapPct, setNewScrapPct] = useState('2.0');
  const [newRate, setNewRate] = useState('20.0');
  const [newDueDate, setNewDueDate] = useState('2026-10-15');

  // New Vendor Form
  const [newVenCode, setNewVenCode] = useState('');
  const [newVenName, setNewVenName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newProcesses, setNewProcesses] = useState('POWDER_COATING, ELECTROPLATING');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.targetProductPart.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.vendor?.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesProcess = processFilter === 'ALL' || o.processType === processFilter;
    return matchesSearch && matchesStatus && matchesProcess;
  });

  const filteredVendors = vendors.filter((v) =>
    v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vendorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
    const qty = parseInt(newTargetQty) || 100;
    const rate = parseFloat(newRate) || 10;
    const orderNumber = newOrderNumber || `JWO-${Date.now().toString().slice(-6)}`;

    const created: JobWorkOrderItem = {
      id: `jwo-${Date.now()}`,
      orderNumber,
      vendorId: vendor.id,
      vendor,
      processType: newProcessType,
      processDescription: newDescription,
      targetProductPart: newPart,
      inputItemSku: newInputSku,
      outputItemSku: newOutputSku,
      targetQuantity: qty,
      receivedQuantity: 0,
      rejectedQuantity: 0,
      scrapAllowancePercent: parseFloat(newScrapPct) || 2.0,
      unitProcessingRate: rate,
      totalOrderValue: qty * rate,
      status: 'ISSUED',
      issuedDate: new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: newDueDate,
    };

    setOrders([created, ...orders]);
    setIsCreateOrderModalOpen(false);
    setNewDescription('');
    setNewPart('');
    setNewInputSku('');
    setNewOutputSku('');
  };

  const handleEnrollVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SubcontractorVendorItem = {
      id: `ven-${Date.now()}`,
      vendorCode: newVenCode || `VEN-SC-00${vendors.length + 1}`,
      companyName: newVenName,
      contactPerson: newContact,
      email: newEmail,
      phone: newPhone,
      address: 'Industrial Zone',
      city: newCity,
      specializedProcesses: newProcesses.split(',').map((p) => p.trim()),
      qualityRating: 95.0,
      avgTurnaroundDays: 3.5,
      isActive: true,
    };

    setVendors([created, ...vendors]);
    setIsEnrollVendorModalOpen(false);
    setNewVenCode('');
    setNewVenName('');
    setNewContact('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/subcontracting"
              className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Subcontracting Hub
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5 mt-1">
            <FileSpreadsheet className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            Job Work Orders (JWO) &amp; Vendor Allocation Board
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Issuance of external manufacturing contracts for heat treatment, plating, and casting processes with unit processing rate verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'ORDERS' ? (
            <button
              onClick={() => setIsCreateOrderModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-sm shadow-teal-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Issue Job Work Order
            </button>
          ) : (
            <button
              onClick={() => setIsEnrollVendorModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-sm shadow-teal-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Enroll Subcontractor
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total JWOs Issued</span>
            <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
              <FileSpreadsheet className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{orders.length} Orders</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Total job work contracts</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active In-Process</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-300 font-mono">
              {orders.filter((o) => o.status === 'IN_PROGRESS' || o.status === 'ISSUED').length} Orders
            </span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-300">Materials currently at vendor sites</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contracted Value</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">
              ${orders.reduce((sum, o) => sum + o.totalOrderValue, 0).toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">Processing charge commitments</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Approved Vendors</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{vendors.length} Partners</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300">Audited quality ISO suppliers</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'ORDERS'
              ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Job Work Orders Console
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('VENDORS')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'VENDORS'
              ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Subcontractor Vendor Directory
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {vendors.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={
              activeTab === 'ORDERS'
                ? 'Search orders by JWO #, part name, or vendor...'
                : 'Search vendors by code, company name, or city...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        {activeTab === 'ORDERS' && (
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ISSUED">Issued</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={processFilter}
              onChange={(e) => setProcessFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Processes</option>
              <option value="ELECTROPLATING">Electroplating</option>
              <option value="HEAT_TREATMENT">Heat Treatment</option>
              <option value="DIE_CASTING">Die Casting</option>
              <option value="ANODIZING">Anodizing</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: WORK ORDERS TABLE */}
      {activeTab === 'ORDERS' && (
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Job Work Orders Queue</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0b0f19] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order # &amp; Process</th>
                  <th className="py-3 px-4">Subcontractor Vendor</th>
                  <th className="py-3 px-4">Component &amp; SKUs</th>
                  <th className="py-3 px-4">Quantity Progress</th>
                  <th className="py-3 px-4">Rate &amp; Valuation</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                {filteredOrders.map((order) => {
                  const pct = order.targetQuantity > 0 ? (order.receivedQuantity / order.targetQuantity) * 100 : 0;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <FileSpreadsheet className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                          {order.orderNumber}
                        </div>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {order.processType}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{order.vendor?.companyName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{order.vendor?.vendorCode} ({order.vendor?.city})</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{order.targetProductPart}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          In: {order.inputItemSku} &rarr; Out: {order.outputItemSku}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-900 dark:text-white font-medium">
                          {order.receivedQuantity} / {order.targetQuantity} pcs
                        </div>
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div className="bg-teal-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="font-semibold text-slate-900 dark:text-white">${order.totalOrderValue.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">${order.unitProcessingRate}/unit</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {order.expectedDeliveryDate}
                      </td>

                      <td className="py-3 px-4">
                        {order.status === 'IN_PROGRESS' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 flex items-center gap-1 w-fit">
                            <Layers className="h-3 w-3" /> In Progress
                          </span>
                        )}
                        {order.status === 'ISSUED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 flex items-center gap-1 w-fit">
                            <Clock className="h-3 w-3" /> Issued
                          </span>
                        )}
                        {order.status === 'COMPLETED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3" /> Completed
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/subcontracting/challans`}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Truck className="h-3 w-3" /> Dispatch DC
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: VENDORS DIRECTORY */}
      {activeTab === 'VENDORS' && (
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Subcontractor Vendor Partners</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0b0f19] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Vendor Code &amp; Company</th>
                  <th className="py-3 px-4">Contact Person &amp; Phone</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Specialized Capabilities</th>
                  <th className="py-3 px-4">Quality Score</th>
                  <th className="py-3 px-4">Avg Turnaround</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                {filteredVendors.map((ven) => (
                  <tr key={ven.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        {ven.vendorCode}
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{ven.companyName}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-900 dark:text-white font-medium">{ven.contactPerson}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{ven.phone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 dark:text-slate-300 font-medium">{ven.city}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">{ven.address}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {ven.specializedProcesses.map((p, idx) => (
                          <span key={idx} className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {ven.qualityRating}%
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">
                      {ven.avgTurnaroundDays} Days
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issue Job Work Order Modal */}
      {isCreateOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsCreateOrderModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-500/20 flex items-center justify-center">
                <FileSpreadsheet className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Issue Job Work Order (JWO)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Allocate parts to external subcontractor for specialized processing</p>
              </div>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Select Subcontractor Vendor</label>
                  <select
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.companyName} ({v.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Specialized Process Type</label>
                  <select
                    value={newProcessType}
                    onChange={(e) => setNewProcessType(e.target.value as SubcontractProcessType)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="ELECTROPLATING">ELECTROPLATING</option>
                    <option value="HEAT_TREATMENT">HEAT_TREATMENT</option>
                    <option value="DIE_CASTING">DIE_CASTING</option>
                    <option value="POWDER_COATING">POWDER_COATING</option>
                    <option value="ANODIZING">ANODIZING</option>
                    <option value="CNC_JOB_WORK">CNC_JOB_WORK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Process Detailed Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zinc Nickel Plating with Black Passivation 12 Micron"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target Component</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flange Bushing FB-12"
                    value={newPart}
                    onChange={(e) => setNewPart(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Input Item SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAW-FB-12"
                    value={newInputSku}
                    onChange={(e) => setNewInputSku(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 font-mono placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Output Item SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FIN-FB-12-PLT"
                    value={newOutputSku}
                    onChange={(e) => setNewOutputSku(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 font-mono placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target Qty (Pcs)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTargetQty}
                    onChange={(e) => setNewTargetQty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Processing Rate ($/Unit)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Delivery Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOrderModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors shadow-sm"
                >
                  Issue Order Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Vendor Modal */}
      {isEnrollVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsEnrollVendorModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-500/20 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Enroll Subcontractor Vendor</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Register qualified processing supplier</p>
              </div>
            </div>

            <form onSubmit={handleEnrollVendor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Micro Finishers Pvt Ltd"
                  value={newVenName}
                  onChange={(e) => setNewVenName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 font-mono placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="vendor@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollVendorModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors shadow-sm"
                >
                  Enroll Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

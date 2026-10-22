'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
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
  Printer,
  FileText,
  Clock,
  Navigation,
} from 'lucide-react';
import {
  SubcontractorChallanItem,
  SubcontractChallanType,
  SubcontractChallanStatus,
  ChallanItemData,
} from '@/types/subcontracting';

const INITIAL_CHALLANS: SubcontractorChallanItem[] = [
  {
    id: 'ch-1',
    challanNumber: 'DC-SC-2026-0091',
    challanType: 'RETURNABLE',
    jobWorkOrderId: 'jwo-1',
    jobWorkOrder: {
      id: 'jwo-1',
      orderNumber: 'JWO-2026-0042',
      processDescription: 'Hard Chrome Electroplating 25 Micron on Piston Rods',
      targetProductPart: 'Hydraulic Piston Rod PR-90',
    },
    vendorId: 'ven-1',
    vendor: {
      id: 'ven-1',
      vendorCode: 'VEN-SC-001',
      companyName: 'Apex Electroplating & Surface Coatings Ltd',
      city: 'Pune',
    },
    dispatchDate: '2026-10-04',
    expectedReturnDate: '2026-10-10',
    vehicleNumber: 'MH-12-RN-4821',
    transporterName: 'VRL Logistics Hub',
    driverContact: '+91 98220 11988',
    eWayBillNumber: 'EWB-2918-4920-1102',
    status: 'PARTIALLY_RETURNED',
    items: [
      {
        itemSku: 'RAW-ROD-90',
        description: 'Hardened Steel Rods 90mm dia for electroplating',
        quantity: 350,
        uom: 'PCS',
        unitRate: 110,
        totalValue: 38500,
      },
    ],
    totalQuantitySent: 350,
    totalValuation: 38500,
    notes: 'Returnable Job Work under GST Section 143. Return finished plating batches along with unworked material scrap.',
  },
  {
    id: 'ch-2',
    challanNumber: 'DC-SC-2026-0092',
    challanType: 'RETURNABLE',
    jobWorkOrderId: 'jwo-2',
    jobWorkOrder: {
      id: 'jwo-2',
      orderNumber: 'JWO-2026-0043',
      processDescription: 'Vacuum Gas Quenching & Case Hardening 58-62 HRC',
      targetProductPart: 'Helical Drive Pinion Gear PG-44',
    },
    vendorId: 'ven-2',
    vendor: {
      id: 'ven-2',
      vendorCode: 'VEN-SC-002',
      companyName: 'Bharat Thermal & Vacuum Heat Treaters',
      city: 'Aurangabad',
    },
    dispatchDate: '2026-10-06',
    expectedReturnDate: '2026-10-12',
    vehicleNumber: 'MH-20-DE-7714',
    transporterName: 'SafeXpress Surface Fleet',
    driverContact: '+91 97631 88402',
    eWayBillNumber: 'EWB-2918-5011-8843',
    status: 'IN_TRANSIT',
    items: [
      {
        itemSku: 'RAW-GEAR-44',
        description: 'Machined Alloy Steel Helical Pinion Gears',
        quantity: 250,
        uom: 'PCS',
        unitRate: 180,
        totalValue: 45000,
      },
    ],
    totalQuantitySent: 250,
    totalValuation: 45000,
    notes: 'Fragile gear teeth surface. Store in anti-corrosive VCI packing upon arrival at heat treatment facility.',
  },
  {
    id: 'ch-3',
    challanNumber: 'DC-SC-2026-0088',
    challanType: 'NON_RETURNABLE',
    jobWorkOrderId: 'jwo-3',
    jobWorkOrder: {
      id: 'jwo-3',
      orderNumber: 'JWO-2026-0040',
      processDescription: 'High Pressure Aluminium Die Casting ADC12',
      targetProductPart: 'Motor End Shield Flange MS-112',
    },
    vendorId: 'ven-3',
    vendor: {
      id: 'ven-3',
      vendorCode: 'VEN-SC-003',
      companyName: 'Precision Die Castings & Alloys Corp',
      city: 'Chakan',
    },
    dispatchDate: '2026-09-28',
    expectedReturnDate: '2026-10-05',
    vehicleNumber: 'MH-14-BT-9102',
    transporterName: 'Express Cargo Lines',
    driverContact: '+91 99231 44556',
    eWayBillNumber: 'EWB-2918-3810-7741',
    status: 'FULLY_RETURNED',
    items: [
      {
        itemSku: 'INGOT-AL-ADC12',
        description: 'Virgin Aluminium Alloy Ingots ADC12 Grade',
        quantity: 800,
        uom: 'KG',
        unitRate: 80,
        totalValue: 64700,
      },
    ],
    totalQuantitySent: 800,
    totalValuation: 64700,
    notes: 'Consumable raw ingot issuance for outsourced conversion into die cast end shields.',
  },
  {
    id: 'ch-4',
    challanNumber: 'DC-SC-2026-0095',
    challanType: 'RETURNABLE',
    jobWorkOrderId: 'jwo-1',
    jobWorkOrder: {
      id: 'jwo-1',
      orderNumber: 'JWO-2026-0042',
      processDescription: 'Hard Chrome Electroplating 25 Micron on Piston Rods',
      targetProductPart: 'Hydraulic Piston Rod PR-90',
    },
    vendorId: 'ven-1',
    vendor: {
      id: 'ven-1',
      vendorCode: 'VEN-SC-001',
      companyName: 'Apex Electroplating & Surface Coatings Ltd',
      city: 'Pune',
    },
    dispatchDate: '2026-10-07',
    expectedReturnDate: '2026-10-14',
    vehicleNumber: 'MH-12-QW-3301',
    transporterName: 'VRL Logistics Hub',
    driverContact: '+91 98220 11988',
    eWayBillNumber: 'EWB-2918-5190-2219',
    status: 'DISPATCHED',
    items: [
      {
        itemSku: 'RAW-ROD-90',
        description: 'Hardened Steel Rods 90mm dia for electroplating (Batch 2)',
        quantity: 150,
        uom: 'PCS',
        unitRate: 110,
        totalValue: 16500,
      },
    ],
    totalQuantitySent: 150,
    totalValuation: 16500,
    notes: 'Second tranche dispatch completing the 500 pcs target for JWO-2026-0042.',
  },
];

export default function SubcontractorChallansPage() {
  const [challans, setChallans] = useState<SubcontractorChallanItem[]>(INITIAL_CHALLANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState<SubcontractorChallanItem | null>(null);

  // New Challan Form
  const [newChallanNumber, setNewChallanNumber] = useState('');
  const [newType, setNewType] = useState<SubcontractChallanType>('RETURNABLE');
  const [newJwoRef, setNewJwoRef] = useState('JWO-2026-0042');
  const [newVendorName, setNewVendorName] = useState('Apex Electroplating & Surface Coatings Ltd');
  const [newVendorCity, setNewVendorCity] = useState('Pune');
  const [newDispatchDate, setNewDispatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [newReturnDate, setNewReturnDate] = useState('2026-10-15');
  const [newTransporter, setNewTransporter] = useState('VRL Logistics Hub');
  const [newVehicle, setNewVehicle] = useState('MH-12-RN-9920');
  const [newDriverContact, setNewDriverContact] = useState('+91 98220 11988');
  const [newEWayBill, setNewEWayBill] = useState('EWB-2918-5520-3301');
  const [newNotes, setNewNotes] = useState('Returnable Delivery Challan under GST Section 143 for job work operations.');
  
  // Item line state
  const [itemSku, setItemSku] = useState('RAW-ROD-90');
  const [itemDesc, setItemDesc] = useState('Hardened Steel Rods 90mm dia');
  const [itemQty, setItemQty] = useState('100');
  const [itemUom, setItemUom] = useState('PCS');
  const [itemRate, setItemRate] = useState('110');

  // Status update modal state
  const [statusUpdateVal, setStatusUpdateVal] = useState<SubcontractChallanStatus>('IN_TRANSIT');
  const [statusUpdateRemarks, setStatusUpdateRemarks] = useState('');

  // Filtering
  const filteredChallans = challans.filter((ch) => {
    const matchesSearch =
      ch.challanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.vendor?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.jobWorkOrder?.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ch.vehicleNumber && ch.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ch.eWayBillNumber && ch.eWayBillNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || ch.challanType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || ch.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate Metrics
  const totalDispatched = challans.length;
  const inTransitCount = challans.filter(
    (c) => c.status === 'DISPATCHED' || c.status === 'IN_TRANSIT' || c.status === 'DELIVERED_TO_VENDOR'
  ).length;
  const totalValuationMovement = challans.reduce((acc, c) => acc + c.totalValuation, 0);
  const pendingReturnCount = challans.filter(
    (c) => c.challanType === 'RETURNABLE' && c.status !== 'FULLY_RETURNED'
  ).length;

  const handleOpenGenerateModal = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setNewChallanNumber(`DC-SC-2026-${randomSuffix}`);
    setIsGenerateModalOpen(true);
  };

  const handleCreateChallan = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(itemQty) || 1;
    const rate = parseFloat(itemRate) || 0;
    const totalVal = qty * rate;

    const newChallanItem: SubcontractorChallanItem = {
      id: `ch-${Date.now()}`,
      challanNumber: newChallanNumber || `DC-SC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      challanType: newType,
      jobWorkOrderId: 'jwo-custom',
      jobWorkOrder: {
        id: 'jwo-custom',
        orderNumber: newJwoRef,
        processDescription: 'Outsourced surface finishing and processing',
        targetProductPart: itemDesc,
      },
      vendorId: 'ven-custom',
      vendor: {
        id: 'ven-custom',
        vendorCode: 'VEN-SC-001',
        companyName: newVendorName,
        city: newVendorCity,
      },
      dispatchDate: newDispatchDate,
      expectedReturnDate: newType === 'RETURNABLE' ? newReturnDate : undefined,
      vehicleNumber: newVehicle,
      transporterName: newTransporter,
      driverContact: newDriverContact,
      eWayBillNumber: newEWayBill,
      status: 'DISPATCHED',
      items: [
        {
          itemSku: itemSku,
          description: itemDesc,
          quantity: qty,
          uom: itemUom,
          unitRate: rate,
          totalValue: totalVal,
        },
      ],
      totalQuantitySent: qty,
      totalValuation: totalVal,
      notes: newNotes,
    };

    setChallans([newChallanItem, ...challans]);
    setIsGenerateModalOpen(false);
  };

  const handleOpenStatusModal = (challan: SubcontractorChallanItem) => {
    setSelectedChallan(challan);
    setStatusUpdateVal(challan.status);
    setStatusUpdateRemarks('');
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallan) return;

    setChallans((prev) =>
      prev.map((c) =>
        c.id === selectedChallan.id
          ? {
              ...c,
              status: statusUpdateVal,
              notes: statusUpdateRemarks ? `${c.notes || ''} [Update: ${statusUpdateRemarks}]` : c.notes,
            }
          : c
      )
    );
    setIsStatusModalOpen(false);
  };

  const handleOpenManifestModal = (challan: SubcontractorChallanItem) => {
    setSelectedChallan(challan);
    setIsManifestModalOpen(true);
  };

  const getStatusBadge = (status: SubcontractChallanStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">DRAFT</span>;
      case 'DISPATCHED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">DISPATCHED</span>;
      case 'IN_TRANSIT':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 animate-pulse">IN TRANSIT</span>;
      case 'DELIVERED_TO_VENDOR':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20">AT VENDOR</span>;
      case 'PARTIALLY_RETURNED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">PARTIAL RETURN</span>;
      case 'FULLY_RETURNED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">FULLY RETURNED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/subcontracting"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Subcontracting Operations Hub
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              Subcontracting Delivery Challans
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Issue, monitor, and audit Returnable & Non-Returnable outward material challans under GST Section 143.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenGenerateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-sm shadow-teal-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Generate Delivery Challan
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Challans</span>
            <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
              <FileSpreadsheet className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{totalDispatched}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">issued records</span>
          </div>
          <div className="mt-2 text-[11px] text-teal-600 dark:text-teal-400">Formal outward manifests</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-amber-300 dark:border-amber-500/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Transit / Vendor WIP</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center">
              <Truck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{inTransitCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">active consignments</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300">Materials currently outside premises</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">WIP Consignment Value</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">
              ${totalValuationMovement.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Covered under transit e-Way bills</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Returnable Pending</span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{pendingReturnCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">pending return</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-700 dark:text-purple-300">Mandated return within 180 days</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search Challan #, Vendor, Vehicle, e-Way bill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Types</option>
              <option value="RETURNABLE">Returnable (Sec 143)</option>
              <option value="NON_RETURNABLE">Non-Returnable</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED_TO_VENDOR">At Vendor</option>
              <option value="PARTIALLY_RETURNED">Partially Returned</option>
              <option value="FULLY_RETURNED">Fully Returned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challans Table */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Outward Delivery Consignments</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">({filteredChallans.length} records)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Compliant with GST Section 143 Job Work Framework
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Challan # &amp; Type</th>
                <th className="py-3 px-4">JWO Ref</th>
                <th className="py-3 px-4">Subcontractor Vendor</th>
                <th className="py-3 px-4">Dispatch / Return Date</th>
                <th className="py-3 px-4">Transporter &amp; Vehicle</th>
                <th className="py-3 px-4">Qty &amp; Valuation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60 font-normal">
              {filteredChallans.map((challan) => (
                <tr key={challan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                      {challan.challanNumber}
                    </div>
                    <div className="mt-1">
                      {challan.challanType === 'RETURNABLE' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/20">
                          RETURNABLE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          NON-RETURNABLE
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-700">
                      {challan.jobWorkOrder?.orderNumber || challan.jobWorkOrderId}
                    </span>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[160px]">
                      {challan.jobWorkOrder?.targetProductPart}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 dark:text-slate-200">
                      {challan.vendor?.companyName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{challan.vendor?.city}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{challan.vendor?.vendorCode}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <Calendar className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                      <span>{challan.dispatchDate}</span>
                    </div>
                    {challan.expectedReturnDate && (
                      <div className="text-[11px] text-amber-600 dark:text-amber-400/90 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due: {challan.expectedReturnDate}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                      {challan.vehicleNumber || 'Unassigned'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {challan.transporterName}
                    </div>
                    {challan.eWayBillNumber && (
                      <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[150px]">
                        {challan.eWayBillNumber}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-medium text-slate-900 dark:text-white">
                      {challan.totalQuantitySent} Units
                    </div>
                    <div className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">
                      ${challan.totalValuation.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(challan.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenManifestModal(challan)}
                        title="View Manifest & Print Challan"
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <FileText className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                        Manifest
                      </button>
                      <button
                        onClick={() => handleOpenStatusModal(challan)}
                        title="Update Transit State"
                        className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-600/20 dark:hover:bg-teal-600/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Navigation className="h-3 w-3" />
                        Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredChallans.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                    No subcontracting delivery challans found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Generate Delivery Challan */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Generate Subcontract Delivery Challan</h3>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChallan} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Challan Number <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newChallanNumber}
                    onChange={(e) => setNewChallanNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Challan Type <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as SubcontractChallanType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="RETURNABLE">RETURNABLE (Under GST Sec 143)</option>
                    <option value="NON_RETURNABLE">NON-RETURNABLE (Consumable Issuance)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Job Work Order Reference <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newJwoRef}
                    onChange={(e) => setNewJwoRef(e.target.value)}
                    placeholder="e.g. JWO-2026-0042"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Subcontractor Vendor Name <span className="text-teal-600 dark:text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Dispatch Date
                  </label>
                  <input
                    type="date"
                    value={newDispatchDate}
                    onChange={(e) => setNewDispatchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Expected Return Date
                  </label>
                  <input
                    type="date"
                    disabled={newType === 'NON_RETURNABLE'}
                    value={newReturnDate}
                    onChange={(e) => setNewReturnDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 disabled:opacity-50 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Destination City
                  </label>
                  <input
                    type="text"
                    value={newVendorCity}
                    onChange={(e) => setNewVendorCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Logistics & Transporter Details */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  Carrier &amp; E-Way Bill Details
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Transporter Name</label>
                    <input
                      type="text"
                      value={newTransporter}
                      onChange={(e) => setNewTransporter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Vehicle Number</label>
                    <input
                      type="text"
                      value={newVehicle}
                      onChange={(e) => setNewVehicle(e.target.value)}
                      placeholder="MH-12-XX-0000"
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">E-Way Bill Number</label>
                    <input
                      type="text"
                      value={newEWayBill}
                      onChange={(e) => setNewEWayBill(e.target.value)}
                      placeholder="EWB-XXXX-XXXX-XXXX"
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Material Lines Form */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Material Line Item &amp; Valuation
                </span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Input SKU Code</label>
                    <input
                      type="text"
                      value={itemSku}
                      onChange={(e) => setItemSku(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-200 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Item Description</label>
                    <input
                      type="text"
                      value={itemDesc}
                      onChange={(e) => setItemDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Quantity Sent ({itemUom})</label>
                    <input
                      type="number"
                      value={itemQty}
                      onChange={(e) => setItemQty(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Estimated Unit Rate ($)</label>
                    <input
                      type="number"
                      value={itemRate}
                      onChange={(e) => setItemRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 px-1 text-slate-700 dark:text-slate-300">
                  <span>Computed Consignment Valuation:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ${((parseFloat(itemQty) || 0) * (parseFloat(itemRate) || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Dispatch Notes &amp; Statutory Declaration
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm shadow-teal-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Dispatch &amp; Issue Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Update Transit Status */}
      {isStatusModalOpen && selectedChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Update Challan Transit State</h3>
              </div>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-6 space-y-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div>Challan: <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedChallan.challanNumber}</span></div>
                <div>Vendor: <span className="text-slate-700 dark:text-slate-200">{selectedChallan.vendor?.companyName}</span></div>
                <div>Vehicle: <span className="font-mono text-slate-700 dark:text-slate-200">{selectedChallan.vehicleNumber}</span></div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Consignment Status
                </label>
                <select
                  value={statusUpdateVal}
                  onChange={(e) => setStatusUpdateVal(e.target.value as SubcontractChallanStatus)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="IN_TRANSIT">IN TRANSIT</option>
                  <option value="DELIVERED_TO_VENDOR">DELIVERED TO VENDOR</option>
                  <option value="PARTIALLY_RETURNED">PARTIALLY RETURNED</option>
                  <option value="FULLY_RETURNED">FULLY RETURNED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Log Remarks / Transporter Checkpoint
                </label>
                <textarea
                  rows={3}
                  value={statusUpdateRemarks}
                  onChange={(e) => setStatusUpdateRemarks(e.target.value)}
                  placeholder="e.g., Gate entry acknowledged by subcontractor store supervisor..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm shadow-teal-600/20 transition-colors"
                >
                  Update State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Challan Manifest & Statutory Preview */}
      {isManifestModalOpen && selectedChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Challan Manifest Preview — {selectedChallan.challanNumber}
                </h3>
              </div>
              <button
                onClick={() => setIsManifestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Document Header */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
                    CONSIGNOR (PRINCIPAL MANUFACTURER)
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">Apex Industrial Works Ltd</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Plant 1, Chakan Industrial Area, Pune 410501</div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">GSTIN: 27AABCA1234F1Z8</div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
                    JOB WORK MANIFEST DETAILS
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 font-mono">{selectedChallan.challanNumber}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Dispatch: {selectedChallan.dispatchDate}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400">Due: {selectedChallan.expectedReturnDate || 'N/A'}</div>
                </div>
              </div>

              {/* Vendor & Transporter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">CONSIGNEE (SUBCONTRACTOR)</span>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 mt-1">{selectedChallan.vendor?.companyName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedChallan.vendor?.city}</div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">Ref JWO: {selectedChallan.jobWorkOrder?.orderNumber}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">TRANSPORTER / FLEET INFO</span>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 mt-1 font-mono">{selectedChallan.vehicleNumber || 'Pending'}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedChallan.transporterName}</div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">e-Way Bill: {selectedChallan.eWayBillNumber || 'Not generated'}</div>
                </div>
              </div>

              {/* Items Manifest */}
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  Consigned Goods &amp; Material Description
                </span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase font-medium border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">SKU Code</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3 text-right">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Value</th>
                        <th className="py-2.5 px-3 text-right">Total ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono text-slate-800 dark:text-slate-200">
                      {selectedChallan.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 text-teal-600 dark:text-teal-400 font-semibold">{item.itemSku}</td>
                          <td className="py-2 px-3 font-sans text-slate-700 dark:text-slate-300">{item.description}</td>
                          <td className="py-2 px-3 text-right">{item.quantity} {item.uom}</td>
                          <td className="py-2 px-3 text-right">${item.unitRate}</td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            ${item.totalValue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td colSpan={2} className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300 text-right">
                          Grand Total:
                        </td>
                        <td className="py-2.5 px-3 font-bold font-mono text-right text-slate-900 dark:text-white">
                          {selectedChallan.totalQuantitySent} Units
                        </td>
                        <td></td>
                        <td className="py-2.5 px-3 font-bold font-mono text-right text-emerald-600 dark:text-emerald-400">
                          ${selectedChallan.totalValuation.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Statutory Note */}
              <div className="p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/20 rounded-lg text-[11px] text-teal-800 dark:text-teal-300">
                <span className="font-semibold block mb-0.5">Statutory Declaration:</span>
                Goods sent for job work operations under Section 143 of CGST/SGST Act, 2017. Not for sale. 
                Materials to be returned or accounted for within the stipulated period of 180 days.
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500">
                  Authorized Signatory: Plant Logistics &amp; Security Desk
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsManifestModalOpen(false)}
                    className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      alert('Delivery Challan manifest sent to print queue.');
                      setIsManifestModalOpen(false);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Manifest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

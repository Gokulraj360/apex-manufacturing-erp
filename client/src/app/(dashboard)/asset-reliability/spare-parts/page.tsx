'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  PackagePlus,
  Layers,
  MapPin,
  Clock,
  DollarSign,
  Send,
  Zap,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';
import {
  SparePartItem,
  ToolCribRequisitionItem,
  ToolCribRequisitionStatus,
} from '@/types/asset-reliability';

const INITIAL_SPARE_PARTS: SparePartItem[] = [
  {
    id: 'sp-1',
    partCode: 'SPR-BRG-6208',
    partName: 'SKF Deep Groove Ball Bearing 6208-2RS1/C3',
    category: 'BEARINGS',
    compatibleMachineModels: 'DMG Mori DMU 50, Haas VF-4SS',
    currentStock: 3,
    minimumThreshold: 8,
    unitOfMeasure: 'PCS',
    unitCost: 45.0,
    cribBinLocation: 'Rack B, Shelf 3, Bin 12',
    supplierName: 'SKF Industrial Bearings',
    leadTimeDays: 4,
  },
  {
    id: 'sp-2',
    partCode: 'SPR-SEAL-HNBR-90',
    partName: 'Parker Piston Hydraulic Seal Set 90mm HNBR',
    category: 'HYDRAULICS',
    compatibleMachineModels: 'Engel Victory 300T, Schuler 500T',
    currentStock: 2,
    minimumThreshold: 6,
    unitOfMeasure: 'SET',
    unitCost: 120.0,
    cribBinLocation: 'Rack A, Shelf 1, Bin 04',
    supplierName: 'Parker Hannifin Corp',
    leadTimeDays: 7,
  },
  {
    id: 'sp-3',
    partCode: 'SPR-FLT-HYD-05M',
    partName: 'Hydac 5-Micron High-Pressure Return Line Filter Cartridge',
    category: 'FILTERS',
    compatibleMachineModels: 'Schuler 500T Press, DMG Mori DMU 50',
    currentStock: 12,
    minimumThreshold: 5,
    unitOfMeasure: 'PCS',
    unitCost: 85.0,
    cribBinLocation: 'Rack C, Shelf 2, Bin 18',
    supplierName: 'Hydac Technology',
    leadTimeDays: 3,
  },
  {
    id: 'sp-4',
    partCode: 'SPR-ROB-BELT-24M',
    partName: 'Gates Carbon Drive Synchronous Timing Belt 24M',
    category: 'BELTS',
    compatibleMachineModels: 'KUKA KR 210 Prime Robot',
    currentStock: 4,
    minimumThreshold: 3,
    unitOfMeasure: 'PCS',
    unitCost: 210.0,
    cribBinLocation: 'Rack D, Shelf 4, Bin 08',
    supplierName: 'Gates Power Transmission',
    leadTimeDays: 10,
  },
  {
    id: 'sp-5',
    partCode: 'SPR-VIB-SENS-IEPE',
    partName: 'IFM Electronic IEPE Industrial Vibration Sensor VSA001',
    category: 'ELECTRICAL_SENSORS',
    compatibleMachineModels: 'All CNC Spindles & Compressors',
    currentStock: 1,
    minimumThreshold: 4,
    unitOfMeasure: 'PCS',
    unitCost: 340.0,
    cribBinLocation: 'Vault Cabinet E, Drawer 2',
    supplierName: 'IFM Electronic',
    leadTimeDays: 14,
  },
  {
    id: 'sp-6',
    partCode: 'SPR-OIL-TELLUS-46',
    partName: 'Shell Tellus S2 MX 46 Anti-Wear Hydraulic Fluid (20L Pail)',
    category: 'LUBRICANTS',
    compatibleMachineModels: 'All Hydraulic Power Units',
    currentStock: 18,
    minimumThreshold: 8,
    unitOfMeasure: 'PAIL',
    unitCost: 95.0,
    cribBinLocation: 'Oil Storage Bay 1, Rack 01',
    supplierName: 'Shell Lubricants Ltd',
    leadTimeDays: 2,
  },
];

const INITIAL_REQUISITIONS: ToolCribRequisitionItem[] = [
  {
    id: 'req-1',
    requisitionNumber: 'REQ-SP-2026-0042',
    sparePartId: 'sp-2',
    sparePart: INITIAL_SPARE_PARTS[1],
    breakdownTicketId: 'bdk-2',
    breakdownTicket: {
      ticketNumber: 'BDK-2026-0103',
      asset: { assetTag: 'AST-INJ-002', assetName: 'Engel 300T Injection Press' },
    },
    quantity: 1,
    status: 'REQUESTED',
    requestedBy: 'Vikram Singh (Hydraulics Tech)',
    purposeNotes: 'Emergency cylinder rod seal repair for breakdown ticket BDK-2026-0103',
    createdAt: '2026-10-07 12:45',
  },
  {
    id: 'req-2',
    requisitionNumber: 'REQ-SP-2026-0041',
    sparePartId: 'sp-1',
    sparePart: INITIAL_SPARE_PARTS[0],
    breakdownTicketId: 'bdk-1',
    breakdownTicket: {
      ticketNumber: 'BDK-2026-0104',
      asset: { assetTag: 'AST-CNC-001', assetName: 'DMG Mori 5-Axis Center' },
    },
    quantity: 2,
    status: 'APPROVED',
    requestedBy: 'Anand Kumar (Sr. Mechatronics Eng)',
    approvedBy: 'Gopal Nair (Tool Crib Storekeeper)',
    purposeNotes: 'Spindle bearing replacement for DMG Mori thermal interlock restoration',
    createdAt: '2026-10-07 14:30',
  },
  {
    id: 'req-3',
    requisitionNumber: 'REQ-SP-2026-0040',
    sparePartId: 'sp-3',
    sparePart: INITIAL_SPARE_PARTS[2],
    maintenanceScheduleId: 'pm-2',
    maintenanceSchedule: {
      scheduleCode: 'PMS-PRESS-M03',
      title: 'Hydraulic Proportional Valve Calibration',
      asset: { assetTag: 'AST-PRS-001', assetName: 'Schuler 500T Stamping Press' },
    },
    quantity: 1,
    status: 'ISSUED',
    requestedBy: 'Vikram Singh (Hydraulics Tech)',
    approvedBy: 'Gopal Nair',
    issuedAt: '2026-10-06 10:15',
    purposeNotes: 'Routine 5-micron filter swap for monthly preventive schedule',
    createdAt: '2026-10-06 09:30',
  },
];

export default function SparePartsToolCribPage() {
  const [activeTab, setActiveTab] = useState<'PARTS' | 'REQUISITIONS'>('PARTS');
  const [parts, setParts] = useState<SparePartItem[]>(INITIAL_SPARE_PARTS);
  const [requisitions, setRequisitions] = useState<ToolCribRequisitionItem[]>(INITIAL_REQUISITIONS);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);
  const [isNewRequisitionModalOpen, setIsNewRequisitionModalOpen] = useState(false);
  const [adjustingPart, setAdjustingPart] = useState<SparePartItem | null>(null);

  // Add Part Form
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('BEARINGS');
  const [newModels, setNewModels] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newThreshold, setNewThreshold] = useState('5');
  const [newUnit, setNewUnit] = useState('PCS');
  const [newCost, setNewCost] = useState('75.0');
  const [newBin, setNewBin] = useState('');
  const [newSupplier, setNewSupplier] = useState('');

  // Adjust Form
  const [adjustmentQty, setAdjustmentQty] = useState('5');
  const [adjustmentReason, setAdjustmentReason] = useState('Stock Replenishment PO #4092');

  // New Requisition Form
  const [reqPartId, setReqPartId] = useState(INITIAL_SPARE_PARTS[0]?.id || '');
  const [reqQty, setReqQty] = useState('1');
  const [reqBy, setReqBy] = useState('Field Technician');
  const [reqNotes, setReqNotes] = useState('');

  const filteredParts = parts.filter((p) => {
    const matchesSearch =
      p.partCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cribBinLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredRequisitions = requisitions.filter((r) =>
    r.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.sparePart?.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.requestedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SparePartItem = {
      id: `sp-${Date.now()}`,
      partCode: newCode,
      partName: newName,
      category: newCategory,
      compatibleMachineModels: newModels,
      currentStock: parseInt(newStock) || 0,
      minimumThreshold: parseInt(newThreshold) || 5,
      unitOfMeasure: newUnit,
      unitCost: parseFloat(newCost) || 0,
      cribBinLocation: newBin,
      supplierName: newSupplier,
      leadTimeDays: 5,
    };
    setParts([created, ...parts]);
    setIsAddPartModalOpen(false);
    setNewCode('');
    setNewName('');
    setNewBin('');
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingPart) return;
    const delta = parseInt(adjustmentQty) || 0;
    setParts(
      parts.map((p) =>
        p.id === adjustingPart.id
          ? { ...p, currentStock: Math.max(0, p.currentStock + delta) }
          : p
      )
    );
    setAdjustingPart(null);
  };

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const part = parts.find((p) => p.id === reqPartId) || parts[0];
    const created: ToolCribRequisitionItem = {
      id: `req-${Date.now()}`,
      requisitionNumber: `REQ-SP-${Date.now().toString().slice(-6)}`,
      sparePartId: part.id,
      sparePart: part,
      quantity: parseInt(reqQty) || 1,
      status: 'REQUESTED',
      requestedBy: reqBy,
      purposeNotes: reqNotes,
      createdAt: 'Just now',
    };
    setRequisitions([created, ...requisitions]);
    setIsNewRequisitionModalOpen(false);
    setReqNotes('');
  };

  const handleApproveRequisition = (reqId: string) => {
    setRequisitions(
      requisitions.map((r) =>
        r.id === reqId
          ? { ...r, status: 'APPROVED', approvedBy: 'Gopal Nair (Storekeeper)' }
          : r
      )
    );
  };

  const handleIssueRequisition = (reqId: string) => {
    const target = requisitions.find((r) => r.id === reqId);
    if (!target) return;

    // Decrement stock
    setParts(
      parts.map((p) =>
        p.id === target.sparePartId
          ? { ...p, currentStock: Math.max(0, p.currentStock - target.quantity) }
          : p
      )
    );

    setRequisitions(
      requisitions.map((r) =>
        r.id === reqId
          ? { ...r, status: 'ISSUED', issuedAt: 'Just now' }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/asset-reliability"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Reliability Command Center
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <Boxes className="h-6 w-6 text-amber-400" />
            Maintenance Spare Parts Inventory &amp; Tool Crib
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Plant floor maintenance tool crib storage, critical component inventory thresholds, automated replenishment orders, and technician issuance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'PARTS' ? (
            <button
              onClick={() => setIsAddPartModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Register Spare Part
            </button>
          ) : (
            <button
              onClick={() => setIsNewRequisitionModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Raise Requisition
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Catalogued SKUs</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Boxes className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{parts.length} SKUs</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Across 6 maintenance categories</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Low Stock Threshold</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-400 font-mono">
              {parts.filter((p) => p.currentStock <= p.minimumThreshold).length} SKUs
            </span>
          </div>
          <div className="mt-2 text-[11px] text-rose-300">Below minimum safety threshold</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Crib Inventory Value</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">$24,650</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400">Audited inventory value</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Requisitions</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-300 font-mono">
              {requisitions.filter((r) => r.status === 'REQUESTED' || r.status === 'APPROVED').length}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-300">Awaiting storekeeper issuance</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('PARTS')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'PARTS'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-300'
          }`}
        >
          <Boxes className="h-4 w-4" />
          Tool Crib Spare Parts Catalog
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-700 dark:text-slate-300">
            {parts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('REQUISITIONS')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'REQUISITIONS'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-300'
          }`}
        >
          <Send className="h-4 w-4" />
          Component Requisitions Desk
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-700 dark:text-slate-300">
            {requisitions.length}
          </span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder={
              activeTab === 'PARTS'
                ? 'Search by part code, description, bin location, or supplier...'
                : 'Search requisitions by requisition #, part name, or technician...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {activeTab === 'PARTS' && (
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Categories</option>
              <option value="BEARINGS">Bearings</option>
              <option value="HYDRAULICS">Hydraulics</option>
              <option value="FILTERS">Filters</option>
              <option value="BELTS">Belts &amp; Drives</option>
              <option value="ELECTRICAL_SENSORS">Sensors</option>
              <option value="LUBRICANTS">Lubricants</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: SPARE PARTS */}
      {activeTab === 'PARTS' && (
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Tool Crib Inventory Stock</h2>
            </div>
            <div className="text-xs text-slate-400">Automatic PO replenishment triggers active</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Part Code &amp; Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Crib Bin Location</th>
                  <th className="py-3 px-4">Stock Level vs Threshold</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4">Compatible Machines</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredParts.map((part) => {
                  const isLow = part.currentStock <= part.minimumThreshold;
                  return (
                    <tr key={part.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-white flex items-center gap-1.5">
                          <Boxes className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          {part.partCode}
                        </div>
                        <div className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5">{part.partName}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700">
                          {part.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                          {part.cribBinLocation}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-sm ${
                              isLow ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {part.currentStock} {part.unitOfMeasure}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            (Min: {part.minimumThreshold})
                          </span>
                        </div>
                        {isLow && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/30">
                            Low Stock Alert
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-white font-medium">
                        ${part.unitCost.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate" title={part.compatibleMachineModels}>
                        {part.compatibleMachineModels || 'Universal'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setAdjustingPart(part)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REQUISITIONS */}
      {activeTab === 'REQUISITIONS' && (
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Maintenance Requisition Queue</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Requisition #</th>
                  <th className="py-3 px-4">Component Requested</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Linked Incident / Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Requested By</th>
                  <th className="py-3 px-4 text-right">Storekeeper Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredRequisitions.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {req.requisitionNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{req.sparePart?.partName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{req.sparePart?.partCode}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {req.quantity} {req.sparePart?.unitOfMeasure}
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {req.breakdownTicket && (
                        <div className="text-[11px]">
                          <strong className="text-rose-400">{req.breakdownTicket.ticketNumber}</strong> ({req.breakdownTicket.asset?.assetTag})
                        </div>
                      )}
                      {req.maintenanceSchedule && (
                        <div className="text-[11px]">
                          <strong className="text-amber-400">{req.maintenanceSchedule.scheduleCode}</strong> ({req.maintenanceSchedule.asset?.assetTag})
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 mt-0.5">{req.purposeNotes}</div>
                    </td>

                    <td className="py-3 px-4">
                      {req.status === 'REQUESTED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-fit">
                          <Clock className="h-3 w-3" /> Requested
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </span>
                      )}
                      {req.status === 'ISSUED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" /> Issued
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-200">{req.requestedBy}</div>
                      {req.approvedBy && (
                        <div className="text-[10px] text-slate-500">Appr: {req.approvedBy}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status === 'REQUESTED' && (
                          <button
                            onClick={() => handleApproveRequisition(req.id)}
                            className="px-2 py-1 rounded bg-amber-950/50 hover:bg-amber-900/60 text-amber-400 border border-amber-600/30 text-[10px] font-medium"
                          >
                            Approve
                          </button>
                        )}
                        {req.status === 'APPROVED' && (
                          <button
                            onClick={() => handleIssueRequisition(req.id)}
                            className="px-2 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-600/30 text-[10px] font-medium"
                          >
                            Issue Part
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setAdjustingPart(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Boxes className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Adjust Stock Level</h3>
                <p className="text-xs text-amber-400 font-mono">{adjustingPart.partCode}</p>
              </div>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                <div className="font-semibold text-white">{adjustingPart.partName}</div>
                <div className="text-[11px] text-slate-400 mt-1">Current Stock: {adjustingPart.currentStock} {adjustingPart.unitOfMeasure}</div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Adjustment Quantity (+ to add, - to reduce)</label>
                <input
                  type="number"
                  required
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Adjustment Reason / Purchase Order Reference</label>
                <input
                  type="text"
                  required
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustingPart(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Part Modal */}
      {isAddPartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsAddPartModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Plus className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Register Spare Part in Tool Crib</h3>
                <p className="text-xs text-slate-400">Add critical component to inventory control</p>
              </div>
            </div>

            <form onSubmit={handleAddPart} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Part Code / SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SPR-VIB-01"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="BEARINGS">BEARINGS</option>
                    <option value="HYDRAULICS">HYDRAULICS</option>
                    <option value="FILTERS">FILTERS</option>
                    <option value="BELTS">BELTS</option>
                    <option value="ELECTRICAL_SENSORS">ELECTRICAL_SENSORS</option>
                    <option value="LUBRICANTS">LUBRICANTS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Part Description / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SKF Spherical Roller Bearing 22216 EK"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Crib Bin Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rack B, Shelf 2, Bin 10"
                    value={newBin}
                    onChange={(e) => setNewBin(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Supplier / OEM</label>
                  <input
                    type="text"
                    placeholder="e.g. SKF Industrial Ltd"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPartModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
                >
                  Enroll Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Requisition Modal */}
      {isNewRequisitionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsNewRequisitionModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Send className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Raise Component Requisition</h3>
                <p className="text-xs text-slate-400">Request part issuance from tool crib</p>
              </div>
            </div>

            <form onSubmit={handleCreateRequisition} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Select Spare Part</label>
                <select
                  value={reqPartId}
                  onChange={(e) => setReqPartId(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {parts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.partCode} - {p.partName} ({p.currentStock} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Quantity Needed</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Requested By</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={reqBy}
                    onChange={(e) => setReqBy(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Purpose / Work Order Ref</label>
                <textarea
                  required
                  rows={2}
                  placeholder="State reason for replacement or target machine..."
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRequisitionModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

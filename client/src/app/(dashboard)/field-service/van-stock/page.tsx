'use client';

import React, { useState } from 'react';
import {
  Truck,
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  Wrench,
  X,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  FileText,
  DollarSign,
  Layers,
} from 'lucide-react';
import {
  VanStockItem,
  FieldPartRequisitionItem,
  FieldPartRequisitionStatus,
} from '@/types/field-service';

const INITIAL_VAN_STOCKS: VanStockItem[] = [
  {
    id: 'vs-1',
    engineerId: 'eng-1',
    engineer: {
      id: 'eng-1',
      employeeCode: 'FSE-101',
      fullName: 'Vikram Jadhav',
      operatingTerritoryCity: 'Pune Industrial Belt',
    },
    itemSku: 'SEAL-HYD-500-VITON',
    itemName: 'High-Temp Viton Hydraulic Ram Seal 120mm',
    quantityOnHand: 1,
    minimumThreshold: 2,
    unitValue: 240,
    binOrCrateLocation: 'Van #01 - Drawer B2',
    lastReplenishedAt: '2026-10-02',
  },
  {
    id: 'vs-2',
    engineerId: 'eng-1',
    engineer: {
      id: 'eng-1',
      employeeCode: 'FSE-101',
      fullName: 'Vikram Jadhav',
      operatingTerritoryCity: 'Pune Industrial Belt',
    },
    itemSku: 'VALVE-PROP-4WE6',
    itemName: 'Rexroth Proportional Directional Valve 24VDC',
    quantityOnHand: 2,
    minimumThreshold: 1,
    unitValue: 850,
    binOrCrateLocation: 'Van #01 - Rack A1',
    lastReplenishedAt: '2026-10-04',
  },
  {
    id: 'vs-3',
    engineerId: 'eng-2',
    engineer: {
      id: 'eng-2',
      employeeCode: 'FSE-104',
      fullName: 'Rohit Sharma',
      operatingTerritoryCity: 'Delhi NCR & Manesar',
    },
    itemSku: 'ENC-OPT-5000PPR',
    itemName: 'Siemens Sinamics Optical Rotary Encoder 5000 PPR',
    quantityOnHand: 2,
    minimumThreshold: 1,
    unitValue: 480,
    binOrCrateLocation: 'Van #04 - ESD Bin C1',
    lastReplenishedAt: '2026-10-05',
  },
  {
    id: 'vs-4',
    engineerId: 'eng-2',
    engineer: {
      id: 'eng-2',
      employeeCode: 'FSE-104',
      fullName: 'Rohit Sharma',
      operatingTerritoryCity: 'Delhi NCR & Manesar',
    },
    itemSku: 'REL-SFT-PILZ-24V',
    itemName: 'Pilz PNOZ Emergency Safety Relay 24VDC',
    quantityOnHand: 0,
    minimumThreshold: 2,
    unitValue: 310,
    binOrCrateLocation: 'Van #04 - Drawer B1',
    lastReplenishedAt: '2026-09-28',
  },
  {
    id: 'vs-5',
    engineerId: 'eng-3',
    engineer: {
      id: 'eng-3',
      employeeCode: 'FSE-108',
      fullName: 'Kiran Deshmukh',
      operatingTerritoryCity: 'Aurangabad & Jalna',
    },
    itemSku: 'SRV-DRV-YASK-750W',
    itemName: 'Yaskawa Sigma-7 Servo Amplifier 750W',
    quantityOnHand: 1,
    minimumThreshold: 1,
    unitValue: 1200,
    binOrCrateLocation: 'Van #08 - Padded Case P1',
    lastReplenishedAt: '2026-10-01',
  },
  {
    id: 'vs-6',
    engineerId: 'eng-4',
    engineer: {
      id: 'eng-4',
      employeeCode: 'FSE-112',
      fullName: 'Ananya Verma',
      operatingTerritoryCity: 'Bengaluru Tech Corridor',
    },
    itemSku: 'SMT-NOZ-YAM-72A',
    itemName: 'Yamaha High-Speed SMT Vacuum Pick Nozzle 72A',
    quantityOnHand: 8,
    minimumThreshold: 4,
    unitValue: 95,
    binOrCrateLocation: 'Van #12 - Micro Tool Box',
    lastReplenishedAt: '2026-10-06',
  },
];

const INITIAL_REQUISITIONS: FieldPartRequisitionItem[] = [
  {
    id: 'req-part-1',
    requisitionNumber: 'FPR-2026-0311',
    requestId: 'req-1',
    request: {
      ticketNumber: 'SR-2026-0891',
      customerName: 'Kalyani Forgings Ltd',
      machineModel: 'CNC Hydraulic Press 500T',
    },
    engineerId: 'eng-1',
    engineer: {
      employeeCode: 'FSE-101',
      fullName: 'Vikram Jadhav',
    },
    itemSku: 'SEAL-HYD-500-VITON',
    itemName: 'High-Temp Viton Hydraulic Ram Seal 120mm',
    quantityRequested: 1,
    isDefectiveReturned: false,
    status: 'DISPATCHED_TO_VAN',
    approvedBy: 'Central Stores Manager',
    createdAt: '2026-10-07T08:45:00Z',
  },
  {
    id: 'req-part-2',
    requisitionNumber: 'FPR-2026-0312',
    requestId: 'req-2',
    request: {
      ticketNumber: 'SR-2026-0892',
      customerName: 'Bharat Precision Gears',
      machineModel: '5-Axis CNC Machining Center',
    },
    engineerId: 'eng-2',
    engineer: {
      employeeCode: 'FSE-104',
      fullName: 'Rohit Sharma',
    },
    itemSku: 'ENC-OPT-5000PPR',
    itemName: 'Siemens Sinamics Optical Rotary Encoder 5000 PPR',
    quantityRequested: 1,
    isDefectiveReturned: true,
    defectivePartSerialNumber: 'DEF-ENC-2023-991',
    status: 'INSTALLED_ON_MACHINE',
    approvedBy: 'Service Director',
    createdAt: '2026-10-07T10:15:00Z',
  },
  {
    id: 'req-part-3',
    requisitionNumber: 'FPR-2026-0315',
    requestId: 'req-4',
    request: {
      ticketNumber: 'SR-2026-0894',
      customerName: 'Titan Micro Electronics',
      machineModel: 'SMT Pick-and-Place Feeder Master',
    },
    engineerId: 'eng-4',
    engineer: {
      employeeCode: 'FSE-112',
      fullName: 'Ananya Verma',
    },
    itemSku: 'BELT-FDR-TIMING-3M',
    itemName: 'Precision Timing Feeder Belt HTD-3M 450T',
    quantityRequested: 2,
    isDefectiveReturned: false,
    status: 'PENDING_APPROVAL',
    createdAt: '2026-10-07T11:30:00Z',
  },
];

export default function VanStockInventoryPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'requisitions'>('inventory');
  const [vanStocks, setVanStocks] = useState<VanStockItem[]>(INITIAL_VAN_STOCKS);
  const [requisitions, setRequisitions] = useState<FieldPartRequisitionItem[]>(INITIAL_REQUISITIONS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<VanStockItem | null>(null);

  // Forms
  const [newRequisition, setNewRequisition] = useState({
    ticketNumber: 'SR-2026-0893',
    engineerCode: 'FSE-108 (Kiran Deshmukh)',
    itemSku: '',
    itemName: '',
    quantityRequested: 1,
    defectivePartSerialNumber: '',
  });

  const [adjustQty, setAdjustQty] = useState(1);

  const lowStockCount = vanStocks.filter((s) => s.quantityOnHand < s.minimumThreshold).length;

  const filteredStocks = vanStocks.filter((s) => {
    return (
      s.itemSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.engineer?.fullName.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (s.engineer?.operatingTerritoryCity.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  });

  const filteredRequisitions = requisitions.filter((r) => {
    return (
      r.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.itemSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.engineer?.fullName.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (r.request?.customerName.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FieldPartRequisitionItem = {
      id: `fpr-${Date.now()}`,
      requisitionNumber: `FPR-2026-0${Math.floor(320 + Math.random() * 80)}`,
      requestId: 'req-sim',
      request: {
        ticketNumber: newRequisition.ticketNumber,
        customerName: 'Client Requisition',
        machineModel: 'Field Machine',
      },
      engineerId: 'eng-sim',
      engineer: {
        employeeCode: newRequisition.engineerCode.split(' ')[0],
        fullName: newRequisition.engineerCode,
      },
      itemSku: newRequisition.itemSku,
      itemName: newRequisition.itemName,
      quantityRequested: newRequisition.quantityRequested,
      isDefectiveReturned: !!newRequisition.defectivePartSerialNumber,
      defectivePartSerialNumber: newRequisition.defectivePartSerialNumber || undefined,
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString(),
    };

    setRequisitions([created, ...requisitions]);
    setIsRequisitionModalOpen(false);
    setNewRequisition({
      ticketNumber: 'SR-2026-0893',
      engineerCode: 'FSE-108 (Kiran Deshmukh)',
      itemSku: '',
      itemName: '',
      quantityRequested: 1,
      defectivePartSerialNumber: '',
    });
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem) return;

    setVanStocks((prev) =>
      prev.map((item) =>
        item.id === selectedStockItem.id
          ? {
              ...item,
              quantityOnHand: item.quantityOnHand + adjustQty,
              lastReplenishedAt: new Date().toISOString().split('T')[0],
            }
          : item,
      ),
    );
    setIsStockAdjustModalOpen(false);
    setSelectedStockItem(null);
  };

  const getRequisitionStatusBadge = (s: FieldPartRequisitionStatus) => {
    switch (s) {
      case 'PENDING_APPROVAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DISPATCHED_TO_VAN':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'INSTALLED_ON_MACHINE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'RETURNED_TO_CENTRAL_STORE':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Truck className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Mobile Van Stock & Emergency Spares Requisitions
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Control vehicle stock replenishment, monitor threshold alerts, dispatch critical replacement spares, and log defective part core returns.
          </p>
        </div>

        <button
          onClick={() => setIsRequisitionModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Requisition Replacement Part
        </button>
      </div>

      {/* Low Stock Threshold Warning Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-200">
                {lowStockCount} Van Stock Item(s) Below Minimum Replenishment Threshold
              </div>
              <div className="text-[11px] text-amber-300/70">
                Technicians running low on critical spares risk impacting First-Time Fix Rates (FTFR). Replenish van boot stock immediately.
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="text-xs font-medium text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-all"
          >
            Review Depleted Spares
          </button>
        </div>
      )}

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="h-4 w-4" />
            <span>Mobile Van Inventory ({vanStocks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('requisitions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'requisitions'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Part Requisitions & Defect Returns ({requisitions.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU, spare name, technician..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Tab Content: Van Stock Inventory */}
      {activeTab === 'inventory' && (
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Part SKU & Name</th>
                  <th className="py-3 px-4">Engineer / Van Unit</th>
                  <th className="py-3 px-4">Storage Crate Location</th>
                  <th className="py-3 px-4">On Hand / Min Threshold</th>
                  <th className="py-3 px-4">Unit Value</th>
                  <th className="py-3 px-4">Inventory Health</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-normal">
                {filteredStocks.map((item) => {
                  const isDepleted = item.quantityOnHand < item.minimumThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white font-mono">{item.itemSku}</div>
                        <div className="text-slate-300 mt-0.5">{item.itemName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.engineer ? (
                          <div>
                            <div className="font-medium text-white">{item.engineer.fullName}</div>
                            <div className="text-[11px] text-slate-400">
                              {item.engineer.employeeCode} ({item.engineer.operatingTerritoryCity})
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Unassigned Fleet</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {item.binOrCrateLocation || 'Default Boot Rack'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          <span className={isDepleted ? 'text-rose-400 font-extrabold' : 'text-emerald-400'}>
                            {item.quantityOnHand}
                          </span>{' '}
                          <span className="text-slate-400 font-normal">/ {item.minimumThreshold} min</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        ${item.unitValue}
                      </td>
                      <td className="py-3.5 px-4">
                        {isDepleted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-max">
                            <AlertTriangle className="h-3 w-3" /> RESTOCK NEEDED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                            <CheckCircle2 className="h-3 w-3" /> OPTIMAL
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedStockItem(item);
                            setIsStockAdjustModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 text-[11px] font-medium transition-all"
                        >
                          Replenish / Adjust
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

      {/* Tab Content: Part Requisitions */}
      {activeTab === 'requisitions' && (
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Requisition #</th>
                  <th className="py-3 px-4">Service Ticket & Client</th>
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Item SKU & Name</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Defective Return Core</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-normal">
                {filteredRequisitions.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      {req.requisitionNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      {req.request ? (
                        <div>
                          <div className="font-semibold text-white">{req.request.ticketNumber}</div>
                          <div className="text-[11px] text-slate-400">{req.request.customerName}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Stock Reorder</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {req.engineer ? (
                        <div>
                          <div className="font-medium text-white">{req.engineer.fullName}</div>
                          <div className="text-[11px] text-slate-400">{req.engineer.employeeCode}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Central Dispatch</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-orange-400">{req.itemSku}</div>
                      <div className="text-slate-300 mt-0.5">{req.itemName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {req.quantityRequested} units
                    </td>
                    <td className="py-3.5 px-4">
                      {req.isDefectiveReturned ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Returned ({req.defectivePartSerialNumber})</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Pending core handover</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getRequisitionStatusBadge(
                          req.status,
                        )}`}
                      >
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Requisition Replacement Part */}
      {isRequisitionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                  <Package className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">Requisition Replacement Part</h3>
              </div>
              <button
                onClick={() => setIsRequisitionModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequisition} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Ticket Number *</label>
                  <input
                    type="text"
                    required
                    value={newRequisition.ticketNumber}
                    onChange={(e) => setNewRequisition({ ...newRequisition, ticketNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Requesting Field Engineer *</label>
                  <input
                    type="text"
                    required
                    value={newRequisition.engineerCode}
                    onChange={(e) => setNewRequisition({ ...newRequisition, engineerCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1">Part SKU *</label>
                  <input
                    type="text"
                    required
                    value={newRequisition.itemSku}
                    onChange={(e) => setNewRequisition({ ...newRequisition, itemSku: e.target.value })}
                    placeholder="e.g. SEAL-HYD-500-VITON"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newRequisition.quantityRequested}
                    onChange={(e) =>
                      setNewRequisition({ ...newRequisition, quantityRequested: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Part Description / Component Name *</label>
                <input
                  type="text"
                  required
                  value={newRequisition.itemName}
                  onChange={(e) => setNewRequisition({ ...newRequisition, itemName: e.target.value })}
                  placeholder="e.g. High-Temp Viton Hydraulic Ram Seal 120mm"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Defective Part Serial # (Core Return Tracking)</label>
                <input
                  type="text"
                  value={newRequisition.defectivePartSerialNumber}
                  onChange={(e) =>
                    setNewRequisition({ ...newRequisition, defectivePartSerialNumber: e.target.value })
                  }
                  placeholder="e.g. DEF-VALVE-2023-118 (Leave blank if unavailable)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequisitionModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Replenish / Adjust Van Stock */}
      {isStockAdjustModalOpen && selectedStockItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                  <Boxes className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">Replenish Van Boot Stock</h3>
              </div>
              <button
                onClick={() => setIsStockAdjustModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-white">{selectedStockItem.itemName}</div>
              <div className="text-slate-400 font-mono">{selectedStockItem.itemSku}</div>
              <div className="text-orange-400">
                Current On Hand: <strong>{selectedStockItem.quantityOnHand}</strong> units (Min Threshold: {selectedStockItem.minimumThreshold})
              </div>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Units to Add to Van Stock *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStockAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
                >
                  Confirm Replenishment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

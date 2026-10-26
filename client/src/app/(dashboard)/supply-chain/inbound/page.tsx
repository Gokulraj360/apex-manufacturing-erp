'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Ship,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Truck,
  Plane,
  Train,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  ExternalLink,
  Navigation,
  MapPin,
  AlertOctagon,
  FileText,
  Boxes,
} from 'lucide-react';
import {
  InboundShipmentItem,
  ShipmentMilestone,
  TransportMode,
  RiskSeverity,
} from '@/types/supply-chain';

const INITIAL_SHIPMENTS: InboundShipmentItem[] = [
  {
    id: 'shp-1',
    shipmentTrackingNumber: 'INB-SHP-2026-041',
    poId: 'po-1',
    po: {
      id: 'po-1',
      poNumber: 'POS-2026-0112',
      totalAmount: 68440,
    },
    vendorId: 'vnd-1',
    vendor: {
      id: 'vnd-1',
      vendorCode: 'VND-SUP-001',
      companyName: 'Tata Steel Tubes & Pipes Division',
      city: 'Jamshedpur',
    },
    carrierName: 'VRL Surface Express Logistics',
    freightForwarder: 'Global Freight Networks Ltd',
    transportMode: 'ROAD',
    originPortCity: 'Jamshedpur Works',
    destinationPlantCity: 'Plant 1, Chakan, Pune',
    dispatchDate: '2026-10-04',
    estimatedArrivalDate: '2026-10-11',
    currentMilestone: 'IN_FINAL_TRANSIT',
    containerOrWaybillNumber: 'WB-9918-2041',
    driverOrVesselInfo: 'Driver: Santosh Yadav (MH-12-DE-9102)',
    totalWeightKg: 14500,
    estimatedFreightCost: 2200,
    delayRisk: 'LOW',
    trackingMilestonesJson: [
      {
        milestone: 'BOOKED',
        timestamp: '2026-10-04 09:00',
        location: 'Jamshedpur Logistics Hub',
        remarks: 'Freight manifest issued, loaded on trailer.',
      },
      {
        milestone: 'DEPARTED_ORIGIN',
        timestamp: '2026-10-04 18:30',
        location: 'Jamshedpur Toll Plaza',
        remarks: 'Cleared origin security gate.',
      },
      {
        milestone: 'IN_FINAL_TRANSIT',
        timestamp: '2026-10-07 11:45',
        location: 'Nagpur Transshipment Checkpoint',
        remarks: 'On schedule, 480km remaining to Chakan.',
      },
    ],
    routeNotes: 'National Highway 53 route via Nagpur. No adverse weather reported.',
    createdAt: '2026-10-04',
  },
  {
    id: 'shp-2',
    shipmentTrackingNumber: 'INB-SHP-2026-042',
    poId: 'po-2',
    po: {
      id: 'po-2',
      poNumber: 'POS-2026-0114',
      totalAmount: 38232,
    },
    vendorId: 'vnd-2',
    vendor: {
      id: 'vnd-2',
      vendorCode: 'VND-SUP-002',
      companyName: 'SKF Bearings Industrial Fleet',
      city: 'Bengaluru',
    },
    carrierName: 'BlueDart Aviation Cargo',
    transportMode: 'AIR',
    originPortCity: 'BLR Airport Cargo Terminal',
    destinationPlantCity: 'PNQ Airport / Chakan Stores',
    dispatchDate: '2026-10-06',
    estimatedArrivalDate: '2026-10-08',
    currentMilestone: 'PORT_CLEARANCE',
    containerOrWaybillNumber: 'AWB-501-8821-9921',
    driverOrVesselInfo: 'Flight BDA-412 Cargo',
    totalWeightKg: 850,
    estimatedFreightCost: 950,
    delayRisk: 'LOW',
    trackingMilestonesJson: [
      {
        milestone: 'BOOKED',
        timestamp: '2026-10-06 14:00',
        location: 'BLR Cargo Terminal',
        remarks: 'Priority air cargo booked.',
      },
      {
        milestone: 'PORT_CLEARANCE',
        timestamp: '2026-10-07 15:30',
        location: 'Pune Airport Air Cargo Complex',
        remarks: 'Customs and security inspection clearance granted.',
      },
    ],
    routeNotes: 'Direct air transit, expected local feeder truck to dock tomorrow morning.',
    createdAt: '2026-10-06',
  },
  {
    id: 'shp-3',
    shipmentTrackingNumber: 'INB-SHP-2026-039',
    poId: 'po-3',
    po: {
      id: 'po-3',
      poNumber: 'POS-2026-0109',
      totalAmount: 23364,
    },
    vendorId: 'vnd-3',
    vendor: {
      id: 'vnd-3',
      vendorCode: 'VND-SUP-003',
      companyName: 'Wacker Silicones & Polymers',
      city: 'Dahej',
    },
    carrierName: 'Gujarat Road Lines Fleet',
    transportMode: 'ROAD',
    originPortCity: 'Dahej Chemical Hub',
    destinationPlantCity: 'Plant 1 Chemical Stores, Chakan',
    dispatchDate: '2026-10-02',
    estimatedArrivalDate: '2026-10-06',
    actualArrivalDate: '2026-10-06 16:30',
    currentMilestone: 'DELIVERED_AT_DOCK',
    containerOrWaybillNumber: 'LR-8812-4402',
    driverOrVesselInfo: 'GJ-16-AX-4411',
    totalWeightKg: 1200,
    estimatedFreightCost: 650,
    delayRisk: 'LOW',
    trackingMilestonesJson: [
      {
        milestone: 'BOOKED',
        timestamp: '2026-10-02 10:00',
        location: 'Dahej',
        remarks: 'Hazardous chemical class label verified.',
      },
      {
        milestone: 'DELIVERED_AT_DOCK',
        timestamp: '2026-10-06 16:30',
        location: 'Plant 1 Inward Dock #2',
        remarks: 'Unloaded and handed over to Chemical QC.',
      },
    ],
    createdAt: '2026-10-02',
  },
];

export default function InboundShippingPage() {
  const [shipments, setShipments] = useState<InboundShipmentItem[]>(INITIAL_SHIPMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [milestoneFilter, setMilestoneFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<InboundShipmentItem | null>(null);

  // New Shipment Form
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [newPoNumber, setNewPoNumber] = useState('POS-2026-0115');
  const [newVendorName, setNewVendorName] = useState('Tata Steel Tubes & Pipes Division');
  const [newCarrier, setNewCarrier] = useState('SafeXpress Surface Fleet');
  const [newMode, setNewMode] = useState<TransportMode>('ROAD');
  const [newOrigin, setNewOrigin] = useState('Jamshedpur Works');
  const [newDestination, setNewDestination] = useState('Plant 1, Chakan, Pune');
  const [newDispatchDate, setNewDispatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEta, setNewEta] = useState('2026-10-14');
  const [newWaybill, setNewWaybill] = useState('WB-9918-5520');
  const [newWeight, setNewWeight] = useState('8500');

  // Milestone Update Form
  const [newMilestoneVal, setNewMilestoneVal] = useState<ShipmentMilestone>('IN_FINAL_TRANSIT');
  const [newMilestoneLocation, setNewMilestoneLocation] = useState('Pune Toll Gate');
  const [newMilestoneRemarks, setNewMilestoneRemarks] = useState('');

  // Filtering
  const filteredShipments = shipments.filter((shp) => {
    const matchesSearch =
      shp.shipmentTrackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shp.carrierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shp.vendor?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shp.containerOrWaybillNumber &&
        shp.containerOrWaybillNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMilestone = milestoneFilter === 'ALL' || shp.currentMilestone === milestoneFilter;
    const matchesMode = modeFilter === 'ALL' || shp.transportMode === modeFilter;

    return matchesSearch && matchesMilestone && matchesMode;
  });

  // KPI Calculations
  const inTransitCount = shipments.filter((s) => s.currentMilestone !== 'DELIVERED_AT_DOCK').length;
  const deliveredCount = shipments.filter((s) => s.currentMilestone === 'DELIVERED_AT_DOCK').length;
  const totalWeight = shipments.reduce((s, sh) => s + Number(sh.totalWeightKg || 0), 0);

  const handleOpenRegisterModal = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setNewTrackingNumber(`INB-SHP-2026-${randomSuffix}`);
    setIsRegisterModalOpen(true);
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const newShp: InboundShipmentItem = {
      id: `shp-${Date.now()}`,
      shipmentTrackingNumber: newTrackingNumber,
      poId: 'po-custom',
      po: {
        id: 'po-custom',
        poNumber: newPoNumber,
        totalAmount: 42000,
      },
      vendorId: 'vnd-1',
      vendor: {
        id: 'vnd-1',
        vendorCode: 'VND-SUP-001',
        companyName: newVendorName,
        city: newOrigin,
      },
      carrierName: newCarrier,
      transportMode: newMode,
      originPortCity: newOrigin,
      destinationPlantCity: newDestination,
      dispatchDate: newDispatchDate,
      estimatedArrivalDate: newEta,
      currentMilestone: 'BOOKED',
      containerOrWaybillNumber: newWaybill,
      totalWeightKg: parseFloat(newWeight) || 1000,
      delayRisk: 'LOW',
      trackingMilestonesJson: [
        {
          milestone: 'BOOKED',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          location: newOrigin,
          remarks: 'Shipment manifest logged into ERP tracking.',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setShipments([newShp, ...shipments]);
    setIsRegisterModalOpen(false);
  };

  const handleOpenMilestoneModal = (shp: InboundShipmentItem) => {
    setSelectedShipment(shp);
    setNewMilestoneVal(shp.currentMilestone);
    setNewMilestoneLocation(shp.originPortCity);
    setNewMilestoneRemarks('');
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    const newMilestoneEntry = {
      milestone: newMilestoneVal,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      location: newMilestoneLocation,
      remarks: newMilestoneRemarks || 'Milestone updated.',
    };

    setShipments((prev) =>
      prev.map((s) =>
        s.id === selectedShipment.id
          ? {
              ...s,
              currentMilestone: newMilestoneVal,
              trackingMilestonesJson: [...s.trackingMilestonesJson, newMilestoneEntry],
              actualArrivalDate:
                newMilestoneVal === 'DELIVERED_AT_DOCK'
                  ? new Date().toISOString().split('T')[0]
                  : s.actualArrivalDate,
            }
          : s
      )
    );

    setIsMilestoneModalOpen(false);
  };

  const handleOpenTimelineModal = (shp: InboundShipmentItem) => {
    setSelectedShipment(shp);
    setIsTimelineModalOpen(true);
  };

  const getTransportIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'ROAD':
        return <Truck className="h-4 w-4 text-cyan-400" />;
      case 'AIR':
        return <Plane className="h-4 w-4 text-blue-400" />;
      case 'OCEAN':
        return <Ship className="h-4 w-4 text-indigo-400" />;
      case 'RAIL':
        return <Train className="h-4 w-4 text-amber-400" />;
      default:
        return <Truck className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getMilestoneBadge = (milestone: ShipmentMilestone) => {
    switch (milestone) {
      case 'BOOKED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700">BOOKED</span>;
      case 'DEPARTED_ORIGIN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">DEPARTED</span>;
      case 'IN_CUSTOMS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">IN CUSTOMS</span>;
      case 'PORT_CLEARANCE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">PORT CLEARANCE</span>;
      case 'IN_FINAL_TRANSIT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">IN TRANSIT</span>;
      case 'DELIVERED_AT_DOCK':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">DELIVERED</span>;
      case 'EXCEPTION_DELAY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">DELAYED</span>;
      default:
        return <span className="text-xs text-slate-400">{milestone}</span>;
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
              <Ship className="h-6 w-6 text-cyan-400" />
              Inbound Shipping Coordination &amp; Freight Tracking
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Multi-modal inbound transit monitoring from suppliers to plant receiving docks, waypoint checkpoints, and delivery route optimization.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenRegisterModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Register Inbound Shipment
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">In-Transit Shipments</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Ship className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{inTransitCount}</span>
            <span className="text-xs text-slate-400">active consignments</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-400">Road, Air &amp; Ocean freight</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Delivered at Dock</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{deliveredCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">Received</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Transferred to quarantine inspection</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Consigned Weight</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Boxes className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{(totalWeight / 1000).toFixed(1)} T</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Total freight tonnage in transit</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transit Reliability</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">98.5%</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-300">Zero critical logistics delays</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Tracking #, Carrier, Supplier, Waybill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Milestone:</span>
            <select
              value={milestoneFilter}
              onChange={(e) => setMilestoneFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Milestones</option>
              <option value="BOOKED">Booked</option>
              <option value="IN_FINAL_TRANSIT">In Final Transit</option>
              <option value="PORT_CLEARANCE">Port Clearance</option>
              <option value="DELIVERED_AT_DOCK">Delivered at Dock</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Mode:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Modes</option>
              <option value="ROAD">Road Freight</option>
              <option value="AIR">Air Cargo</option>
              <option value="OCEAN">Ocean Container</option>
              <option value="RAIL">Rail Freight</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ship className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Inbound Consignments Fleet</h2>
            <span className="text-xs text-slate-400">({filteredShipments.length} consignments)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Real-Time Waypoint GPS &amp; e-Waybill Verification
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-medium border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tracking # &amp; PO</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Supplier &amp; Carrier</th>
                <th className="py-3 px-4">Origin &rarr; Destination</th>
                <th className="py-3 px-4">Dispatch &amp; ETA</th>
                <th className="py-3 px-4">Milestone</th>
                <th className="py-3 px-4">Weight / Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-normal">
              {filteredShipments.map((shp) => (
                <tr key={shp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white font-mono">{shp.shipmentTrackingNumber}</div>
                    <div className="text-[11px] text-cyan-400 font-mono mt-0.5">PO: {shp.po?.poNumber}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{shp.containerOrWaybillNumber}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                      {getTransportIcon(shp.transportMode)}
                      <span>{shp.transportMode}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{shp.vendor?.companyName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{shp.carrierName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-700 dark:text-slate-300 font-medium">{shp.originPortCity}</div>
                    <div className="text-[11px] text-cyan-400 flex items-center gap-1 mt-0.5">
                      <span>&rarr;</span>
                      <span>{shp.destinationPlantCity}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-400 text-[11px]">Dep: {shp.dispatchDate}</div>
                    <div className="flex items-center gap-1 text-slate-200 font-medium mt-0.5">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      <span>ETA: {shp.estimatedArrivalDate}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {getMilestoneBadge(shp.currentMilestone)}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-white font-medium">{shp.totalWeightKg} kg</div>
                    <div className="text-[11px] text-emerald-400 mt-0.5">
                      ${shp.estimatedFreightCost?.toLocaleString()} freight
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenTimelineModal(shp)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Navigation className="h-3 w-3 text-cyan-400" />
                        Timeline
                      </button>
                      <button
                        onClick={() => handleOpenMilestoneModal(shp)}
                        className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <MapPin className="h-3 w-3" />
                        Milestone
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Register Inbound Shipment */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">Register Inbound Consignment</h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Shipment Tracking # <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTrackingNumber}
                    onChange={(e) => setNewTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Linked PO Number <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPoNumber}
                    onChange={(e) => setNewPoNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Supplier Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Transport Mode
                  </label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as TransportMode)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="ROAD">ROAD (Trailer / Fleet)</option>
                    <option value="AIR">AIR (Air Cargo Priority)</option>
                    <option value="OCEAN">OCEAN (Sea Container)</option>
                    <option value="RAIL">RAIL (Dedicated Freight)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Carrier Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCarrier}
                    onChange={(e) => setNewCarrier(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Waybill / Container #
                  </label>
                  <input
                    type="text"
                    value={newWaybill}
                    onChange={(e) => setNewWaybill(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Origin Hub
                  </label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Destination Plant
                  </label>
                  <input
                    type="text"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Dispatch Date
                  </label>
                  <input
                    type="date"
                    value={newDispatchDate}
                    onChange={(e) => setNewDispatchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Estimated Arrival Date (ETA)
                  </label>
                  <input
                    type="date"
                    value={newEta}
                    onChange={(e) => setNewEta(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Initiate Shipment Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Update Transit Milestone */}
      {isMilestoneModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">
                  Update Transit Milestone — {selectedShipment.shipmentTrackingNumber}
                </h3>
              </div>
              <button
                onClick={() => setIsMilestoneModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  New Waypoint Milestone
                </label>
                <select
                  value={newMilestoneVal}
                  onChange={(e) => setNewMilestoneVal(e.target.value as ShipmentMilestone)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="BOOKED">BOOKED</option>
                  <option value="DEPARTED_ORIGIN">DEPARTED ORIGIN</option>
                  <option value="IN_CUSTOMS">IN CUSTOMS</option>
                  <option value="PORT_CLEARANCE">PORT CLEARANCE</option>
                  <option value="IN_FINAL_TRANSIT">IN FINAL TRANSIT</option>
                  <option value="DELIVERED_AT_DOCK">DELIVERED AT PLANT DOCK</option>
                  <option value="EXCEPTION_DELAY">EXCEPTION DELAY</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Current Checkpoint Location
                </label>
                <input
                  type="text"
                  required
                  value={newMilestoneLocation}
                  onChange={(e) => setNewMilestoneLocation(e.target.value)}
                  placeholder="e.g. Pune Highway Toll, Dock #1..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Remarks / Inspector Notes
                </label>
                <textarea
                  rows={2}
                  value={newMilestoneRemarks}
                  onChange={(e) => setNewMilestoneRemarks(e.target.value)}
                  placeholder="e.g. Security seal intact, gate entry logged..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors"
                >
                  Record Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Shipment Timeline & Route Details */}
      {isTimelineModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">
                  Shipment Journey Timeline — {selectedShipment.shipmentTrackingNumber}
                </h3>
              </div>
              <button
                onClick={() => setIsTimelineModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs flex justify-between items-center font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">ORIGIN</span>
                  {selectedShipment.originPortCity}
                </div>
                <div className="text-cyan-400 text-base">&rarr;</div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">DESTINATION</span>
                  {selectedShipment.destinationPlantCity}
                </div>
              </div>

              {/* Milestones Flow */}
              <div className="space-y-4">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                  Transit Waypoints History
                </span>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {selectedShipment.trackingMilestonesJson.map((ms, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-cyan-500 border-2 border-slate-900" />
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{ms.milestone}</span>
                          <span className="text-[10px] font-mono text-slate-400">{ms.timestamp}</span>
                        </div>
                        <div className="text-xs text-cyan-300 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{ms.location}</span>
                        </div>
                        {ms.remarks && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{ms.remarks}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end border-t border-slate-800">
                <button
                  onClick={() => setIsTimelineModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

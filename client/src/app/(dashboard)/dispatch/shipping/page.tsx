'use client';

import React, { useState } from 'react';
import {
  Truck,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  FileCheck,
  AlertTriangle,
  Building2,
  Phone,
  Scale,
  Lock,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
} from 'lucide-react';
import { DispatchShipmentItem, CarrierDetailItem, ShipmentStatus } from '@/types/dispatch';

const INITIAL_SHIPMENTS: DispatchShipmentItem[] = [
  {
    id: 'shp-1',
    shipmentNumber: 'DSP-SHP-2026-042',
    deliveryChallanNumber: 'DC-2026-018',
    salesOrderNumber: 'SO-2026-104',
    customerName: 'Bharat Heavy Dynamics Ltd',
    carrierName: 'Vanguard Freight Logistics',
    vehicleNumber: 'MH-12-QW-9901',
    driverName: 'Harish Rawat',
    driverContact: '+91 98765 43210',
    gatePassNumber: 'GP-2026-0891',
    sealNumber: 'SEAL-SEC-99012',
    status: 'IN_TRANSIT',
    totalWeightKg: 4250.0,
    cartonsCount: 42,
    loadedBy: 'Rajesh Mehra',
    loadedAt: '2026-10-07 10:30',
    dispatchedAt: '2026-10-07 11:15',
    estimatedDelivery: '2026-10-09 18:00',
    createdAt: '2026-10-07 09:00',
  },
  {
    id: 'shp-2',
    shipmentNumber: 'DSP-SHP-2026-043',
    deliveryChallanNumber: 'DC-2026-019',
    salesOrderNumber: 'SO-2026-108',
    customerName: 'Siemens Precision India',
    carrierName: 'Express Blue Haulage',
    vehicleNumber: 'KA-04-TR-4421',
    driverName: 'Suresh Kumar',
    driverContact: '+91 91234 56789',
    gatePassNumber: 'GP-2026-0892',
    sealNumber: 'SEAL-SEC-99015',
    status: 'LOADING',
    totalWeightKg: 1840.0,
    cartonsCount: 20,
    loadedBy: 'Sunil Rao',
    loadedAt: '2026-10-07 12:00',
    createdAt: '2026-10-07 11:00',
  },
  {
    id: 'shp-3',
    shipmentNumber: 'DSP-SHP-2026-044',
    deliveryChallanNumber: 'DC-2026-020',
    salesOrderNumber: 'SO-2026-112',
    customerName: 'Adani Infra Projects',
    carrierName: 'National Freight Cargo',
    vehicleNumber: 'GJ-06-XX-3301',
    driverName: 'Kishore Patel',
    driverContact: '+91 97766 55443',
    gatePassNumber: 'GP-2026-0895',
    sealNumber: 'SEAL-SEC-99020',
    status: 'STAGED',
    totalWeightKg: 3100.0,
    cartonsCount: 30,
    loadedBy: 'Sunil Rao',
    createdAt: '2026-10-07 12:30',
  },
];

const INITIAL_CARRIERS: CarrierDetailItem[] = [
  {
    id: 'crr-1',
    carrierCode: 'CRR-VANGUARD',
    companyName: 'Vanguard Freight Logistics',
    contactPerson: 'Anil Desai',
    phone: '+91 22 2840 9900',
    email: 'dispatch@vanguardfreight.com',
    fleetType: 'Heavy Multi-Axle Low-Bed Trailers',
    ratingScore: 4.9,
    isActive: true,
  },
  {
    id: 'crr-2',
    carrierCode: 'CRR-BLUE-HAUL',
    companyName: 'Express Blue Haulage',
    contactPerson: 'Mahesh Reddy',
    phone: '+91 80 4120 7700',
    email: 'ops@expressblue.in',
    fleetType: 'Dedicated Air-Suspension Closed Containers',
    ratingScore: 4.8,
    isActive: true,
  },
  {
    id: 'crr-3',
    carrierCode: 'CRR-NAT-CARGO',
    companyName: 'National Freight Cargo',
    contactPerson: 'Ramanathan Iyer',
    phone: '+91 44 2250 8811',
    email: 'logistics@nationalcargo.org',
    fleetType: 'Inter-State Multi-Wheel Express',
    ratingScore: 4.7,
    isActive: true,
  },
];

export default function ShippingControlPage() {
  const [shipments, setShipments] = useState<DispatchShipmentItem[]>(INITIAL_SHIPMENTS);
  const [carriers, setCarriers] = useState<CarrierDetailItem[]>(INITIAL_CARRIERS);
  const [activeTab, setActiveTab] = useState<'shipments' | 'carriers'>('shipments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState(false);
  const [isVerifyLoadingModalOpen, setIsVerifyLoadingModalOpen] = useState(false);
  const [selectedShipmentForVerify, setSelectedShipmentForVerify] = useState<DispatchShipmentItem | null>(null);

  // Verification Form State
  const [verifyForm, setVerifyForm] = useState({
    sealNumber: '',
    gatePassNumber: '',
  });

  // New Shipment Form State
  const [newShipmentForm, setNewShipmentForm] = useState({
    deliveryChallanNumber: 'DC-2026-021',
    salesOrderNumber: 'SO-2026-115',
    customerName: 'Tata Advanced Systems',
    carrierName: 'Vanguard Freight Logistics',
    vehicleNumber: 'MH-12-QW-8811',
    driverName: 'Vikram Singh',
    driverContact: '+91 98112 23344',
    gatePassNumber: 'GP-2026-0899',
    sealNumber: 'SEAL-SEC-99028',
    totalWeightKg: 2500,
    cartonsCount: 25,
    loadedBy: 'Rajesh Mehra',
  });

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const count = shipments.length + 45;
    const shipmentNumber = `DSP-SHP-2026-0${count}`;

    const newShipment: DispatchShipmentItem = {
      id: `shp-${Date.now()}`,
      shipmentNumber,
      deliveryChallanNumber: newShipmentForm.deliveryChallanNumber,
      salesOrderNumber: newShipmentForm.salesOrderNumber,
      customerName: newShipmentForm.customerName,
      carrierName: newShipmentForm.carrierName,
      vehicleNumber: newShipmentForm.vehicleNumber,
      driverName: newShipmentForm.driverName,
      driverContact: newShipmentForm.driverContact,
      gatePassNumber: newShipmentForm.gatePassNumber,
      sealNumber: newShipmentForm.sealNumber,
      status: 'STAGED',
      totalWeightKg: Number(newShipmentForm.totalWeightKg),
      cartonsCount: Number(newShipmentForm.cartonsCount),
      loadedBy: newShipmentForm.loadedBy,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setShipments([newShipment, ...shipments]);
    setIsNewShipmentModalOpen(false);
  };

  const handleAuthorizeDispatch = () => {
    if (!selectedShipmentForVerify) return;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === selectedShipmentForVerify.id) {
          return {
            ...s,
            status: 'IN_TRANSIT',
            sealNumber: verifyForm.sealNumber || s.sealNumber,
            gatePassNumber: verifyForm.gatePassNumber || s.gatePassNumber,
            dispatchedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return s;
      })
    );

    setIsVerifyLoadingModalOpen(false);
    setSelectedShipmentForVerify(null);
  };

  const openVerifyModal = (shipment: DispatchShipmentItem) => {
    setSelectedShipmentForVerify(shipment);
    setVerifyForm({
      sealNumber: shipment.sealNumber,
      gatePassNumber: shipment.gatePassNumber,
    });
    setIsVerifyLoadingModalOpen(true);
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.deliveryChallanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const inTransitCount = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const loadingCount = shipments.filter((s) => s.status === 'LOADING').length;
  const stagedCount = shipments.filter((s) => s.status === 'STAGED').length;
  const totalDispatchedWeightTons =
    shipments.reduce((acc, s) => acc + s.totalWeightKg, 0) / 1000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Truck className="w-7 h-7 text-emerald-400" />
              Outbound Shipping & Loading Verification
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Terminal Gate Control
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Cross-verify physical truck loading against Delivery Challans, verify security seal numbers, and issue gate exit passes.
          </p>
        </div>

        <button
          onClick={() => setIsNewShipmentModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition shadow-sm shadow-emerald-950/40"
        >
          <Plus className="w-4 h-4" />
          Schedule Outbound Vehicle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">In-Transit Shipments</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{inTransitCount}</span>
            <span className="text-xs text-blue-400 font-medium">GPS tracked</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Highway freight en route</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">At Loading Docks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{loadingCount}</span>
            <span className="text-xs text-neutral-400 font-medium">dock bays active</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Forklifts loading freight</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Dispatched Tonnage</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalDispatchedWeightTons.toFixed(1)} MT</span>
            <span className="text-xs text-emerald-400 font-medium">total cargo</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Past 24 operating hours</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Carrier Reliability</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">4.8 / 5.0</span>
            <span className="text-xs text-purple-400 font-medium">3 partner fleets</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Zero transit security breaches</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 gap-6">
        <button
          onClick={() => setActiveTab('shipments')}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'shipments'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Outbound Freight Shipments ({shipments.length})
        </button>
        <button
          onClick={() => setActiveTab('carriers')}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'carriers'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Approved Freight Carriers ({carriers.length})
        </button>
      </div>

      {/* TAB 1: OUTBOUND SHIPMENTS */}
      {activeTab === 'shipments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search shipment #, DC #, vehicle..."
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
                <option value="STAGED">Staged</option>
                <option value="LOADING">Loading</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredShipments.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs border ${
                      s.status === 'DELIVERED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : s.status === 'IN_TRANSIT'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    <Truck className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-white">{s.shipmentNumber}</span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Challan: {s.deliveryChallanNumber}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">SO: {s.salesOrderNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          s.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : s.status === 'IN_TRANSIT'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {s.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-200 mt-1 font-medium">
                      Recipient: <strong className="text-white">{s.customerName}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1">
                      <span>Carrier: <strong className="text-neutral-300">{s.carrierName}</strong></span>
                      <span>Vehicle: <strong className="text-neutral-200 font-mono">{s.vehicleNumber}</strong></span>
                      <span>Driver: {s.driverName} ({s.driverContact})</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1 font-mono">
                      <span>Gate Pass: <strong className="text-orange-400">{s.gatePassNumber}</strong></span>
                      <span>Security Seal: <strong className="text-emerald-400">{s.sealNumber}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-white block">{s.totalWeightKg} kg</span>
                    <span className="text-xs text-neutral-400">{s.cartonsCount} Cartons</span>
                  </div>

                  {s.status !== 'IN_TRANSIT' && s.status !== 'DELIVERED' && (
                    <button
                      onClick={() => openVerifyModal(s)}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm shadow-emerald-950/40"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Verify & Release Gate Pass
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CARRIER NETWORK */}
      {activeTab === 'carriers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {carriers.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{c.companyName}</h3>
                  <span className="text-xs font-mono text-emerald-400">{c.carrierCode}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 font-mono inline-flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {c.ratingScore}
                  </span>
                  <span className="text-[10px] text-neutral-500 block uppercase">SLA Rating</span>
                </div>
              </div>

              <div className="text-xs text-neutral-300 space-y-1">
                <div>Fleet: <strong className="text-neutral-200">{c.fleetType}</strong></div>
                <div>Contact: {c.contactPerson}</div>
                <div className="text-neutral-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-neutral-500" /> {c.phone}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved Carrier
                </span>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: VERIFY VEHICLE LOADING & AUTHORIZE DISPATCH */}
      {isVerifyLoadingModalOpen && selectedShipmentForVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Authorize Vehicle Gate Exit</h3>
                <p className="text-xs text-neutral-400">{selectedShipmentForVerify.shipmentNumber}</p>
              </div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Delivery Challan:</span>
                <span className="text-emerald-400 font-mono font-bold">{selectedShipmentForVerify.deliveryChallanNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Vehicle / Truck:</span>
                <span className="text-white font-mono">{selectedShipmentForVerify.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Payload:</span>
                <span className="text-white font-mono">{selectedShipmentForVerify.totalWeightKg} kg ({selectedShipmentForVerify.cartonsCount} cartons)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Applied Tamper Seal Number</label>
                <input
                  type="text"
                  value={verifyForm.sealNumber}
                  onChange={(e) => setVerifyForm({ ...verifyForm, sealNumber: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Terminal Gate Exit Pass #</label>
                <input
                  type="text"
                  value={verifyForm.gatePassNumber}
                  onChange={(e) => setVerifyForm({ ...verifyForm, gatePassNumber: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>
            </div>

            <p className="text-xs text-neutral-400">
              Confirming this release sets the shipment to <strong className="text-blue-400">IN TRANSIT</strong>, locks the physical inventory out of warehouse stock, and logs terminal gate clearance into the audit log.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsVerifyLoadingModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAuthorizeDispatch}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Authorize Gate Departure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW SHIPMENT */}
      {isNewShipmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                Schedule Outbound Freight Vehicle
              </h3>
              <button
                onClick={() => setIsNewShipmentModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Delivery Challan (DC #)</label>
                  <input
                    type="text"
                    value={newShipmentForm.deliveryChallanNumber}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, deliveryChallanNumber: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Sales Order #</label>
                  <input
                    type="text"
                    value={newShipmentForm.salesOrderNumber}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, salesOrderNumber: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newShipmentForm.customerName}
                  onChange={(e) => setNewShipmentForm({ ...newShipmentForm, customerName: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Carrier Name</label>
                  <select
                    value={newShipmentForm.carrierName}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, carrierName: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Vanguard Freight Logistics">Vanguard Freight Logistics</option>
                    <option value="Express Blue Haulage">Express Blue Haulage</option>
                    <option value="National Freight Cargo">National Freight Cargo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Vehicle Plate #</label>
                  <input
                    type="text"
                    value={newShipmentForm.vehicleNumber}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, vehicleNumber: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={newShipmentForm.driverName}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, driverName: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Driver Contact #</label>
                  <input
                    type="text"
                    value={newShipmentForm.driverContact}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, driverContact: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Total Weight (kg)</label>
                  <input
                    type="number"
                    value={newShipmentForm.totalWeightKg}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, totalWeightKg: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Cartons Count</label>
                  <input
                    type="number"
                    value={newShipmentForm.cartonsCount}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, cartonsCount: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewShipmentModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

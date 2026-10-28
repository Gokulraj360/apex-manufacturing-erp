'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Truck,
  Scale,
  ShieldCheck,
  Navigation,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter,
  Plus,
  LogIn,
  LogOut,
  MapPin,
  FileText,
  BadgeAlert,
  Activity,
  Layers,
} from 'lucide-react';
import { VehicleLogItem, DeliveryTripItem, SpecialGatePassItem } from '@/types/logistics-gate';
import { enterpriseDataStore, GatePassItem } from '@/lib/enterpriseDataStore';

const MOCK_ACTIVE_VEHICLES: VehicleLogItem[] = [
  {
    id: 'veh-1',
    passNumber: 'GP-IN-2026-0104',
    vehicleNumber: 'MH-12-RN-8821',
    vehicleType: 'HEAVY_TRUCK',
    driverName: 'Vikram Rajput',
    driverPhone: '+91 98230 11223',
    purpose: 'Raw Sheet Metal Delivery for PO-2026-089',
    transporterName: 'Vanguard Freight Logistics',
    entryTimestamp: '2026-10-07 09:15',
    gateNumber: 'North Gate 01',
    visitorPassBadge: 'BADGE-V-401',
    accompanyingPersons: 1,
    status: 'INSIDE_PREMISES',
    securityGuardNotes: 'Documents verified. Directed to Inbound Weighbridge.',
    createdAt: '2026-10-07 09:15',
    updatedAt: '2026-10-07 09:15',
  },
  {
    id: 'veh-2',
    passNumber: 'GP-IN-2026-0105',
    vehicleNumber: 'KA-04-AK-5509',
    vehicleType: 'CONTAINER_CARRIER',
    driverName: 'Ramesh Patel',
    driverPhone: '+91 97412 88901',
    purpose: 'Finished Goods Dispatch Loading (DSP-SHP-042)',
    transporterName: 'Express Blue Haulage',
    entryTimestamp: '2026-10-07 10:05',
    gateNumber: 'South Gate 02',
    visitorPassBadge: 'BADGE-V-402',
    accompanyingPersons: 0,
    status: 'INSIDE_PREMISES',
    securityGuardNotes: 'Outbound staging dock 04. Clearance pending seal verification.',
    createdAt: '2026-10-07 10:05',
    updatedAt: '2026-10-07 10:05',
  },
  {
    id: 'veh-3',
    passNumber: 'GP-IN-2026-0106',
    vehicleNumber: 'DL-01-EE-7712',
    vehicleType: 'VISITOR_CAR',
    driverName: 'Dr. Anand Verma',
    driverPhone: '+91 99112 33445',
    purpose: 'ISO 9001 External Quality Audit',
    transporterName: 'Private Vehicle',
    entryTimestamp: '2026-10-07 10:45',
    gateNumber: 'Admin Gate 03',
    visitorPassBadge: 'BADGE-VIP-009',
    accompanyingPersons: 2,
    status: 'INSIDE_PREMISES',
    securityGuardNotes: 'Visitor escorts designated: Plant Manager Office.',
    createdAt: '2026-10-07 10:45',
    updatedAt: '2026-10-07 10:45',
  },
  {
    id: 'veh-4',
    passNumber: 'GP-IN-2026-0098',
    vehicleNumber: 'TN-09-CQ-2234',
    vehicleType: 'MEDIUM_TRUCK',
    driverName: 'K. Selvam',
    driverPhone: '+91 94441 55667',
    purpose: 'Scrap Metal Clearance under SP-2026-019',
    transporterName: 'Universal Scrap Recyclers',
    entryTimestamp: '2026-10-07 08:30',
    exitTimestamp: '2026-10-07 11:20',
    gateNumber: 'North Gate 01',
    visitorPassBadge: 'BADGE-V-399',
    accompanyingPersons: 1,
    status: 'CHECKED_OUT',
    securityGuardNotes: 'Tare and gross verified. Special gate pass signed out.',
    createdAt: '2026-10-07 08:30',
    updatedAt: '2026-10-07 11:20',
  },
];

const MOCK_ACTIVE_TRIPS: DeliveryTripItem[] = [
  {
    id: 'trip-1',
    tripTrackingNumber: 'TRP-2026-0051',
    vehicleNumber: 'MH-12-QW-9901',
    driverName: 'Harish Rawat',
    driverPhone: '+91 98765 43210',
    carrierName: 'Vanguard Freight Logistics',
    routePlan: 'Pune Plant -> Mumbai Port Nhava Sheva (Terminal 3)',
    plannedDeparture: '2026-10-07 11:00',
    actualDeparture: '2026-10-07 11:15',
    estimatedArrival: '2026-10-07 17:30',
    currentLocationGps: '18.9894° N, 73.1175° E (Panvel Expressway Toll)',
    currentCheckpoint: 'Toll Plaza 02',
    status: 'DISPATCHED',
    transitRemarks: 'Speed telemetry steady. Ambient container temp normal.',
    createdAt: '2026-10-07 10:00',
    updatedAt: '2026-10-07 12:30',
  },
  {
    id: 'trip-2',
    tripTrackingNumber: 'TRP-2026-0050',
    vehicleNumber: 'DL-01-AB-1122',
    driverName: 'Manish Singh',
    driverPhone: '+91 99887 76655',
    carrierName: 'National Freight Cargo',
    routePlan: 'Pune Plant -> Bengaluru Industrial Corridor (Peenya Hub)',
    plannedDeparture: '2026-10-06 09:00',
    actualDeparture: '2026-10-06 09:30',
    estimatedArrival: '2026-10-07 16:00',
    actualArrival: '2026-10-07 15:10',
    currentLocationGps: '13.0285° N, 77.5197° E (Peenya Unloading Bay 1)',
    currentCheckpoint: 'Destination Peenya Depot',
    status: 'DELIVERED',
    proofOfDeliveryUrl: 'https://docs.erp.local/pod/POD-2026-0988.pdf',
    podSignedBy: 'V. Sundaram (Logistics Head)',
    podTimestamp: '2026-10-07 15:30',
    transitRemarks: 'All cartons inspected. 0 damage noted. POD uploaded.',
    createdAt: '2026-10-06 08:30',
    updatedAt: '2026-10-07 15:30',
  },
];

export default function LogisticsCommandCenterPage() {
  const [vehicles] = useState<VehicleLogItem[]>(MOCK_ACTIVE_VEHICLES);
  const [trips] = useState<DeliveryTripItem[]>(MOCK_ACTIVE_TRIPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [gatePasses, setGatePasses] = useState<GatePassItem[]>(() => enterpriseDataStore.getGatePasses());

  React.useEffect(() => {
    const refresh = () => setGatePasses(enterpriseDataStore.getGatePasses());
    window.addEventListener('apex_enterprise_data_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('apex_enterprise_data_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const handleClearPass = (id: string) => {
    enterpriseDataStore.clearGatePass(id);
    setGatePasses(enterpriseDataStore.getGatePasses());
  };

  const onPremisesCount = vehicles.filter((v) => v.status === 'INSIDE_PREMISES').length;

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.passNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-cyan-500 dark:text-cyan-400" />
              Logistics & Gate Entry Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
              Perimeter Security Active
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time vehicle access tracking, weighbridge gross/tare automation, outbound seal verification, and GPS fleet trip telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/logistics-gate/gate-entries"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Check-In Vehicle / Visitor
          </Link>
          <Link
            href="/logistics-gate/inbound-check"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-xs shadow-sm transition-colors"
          >
            <Scale className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
            Weighbridge Station
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-cyan-200 dark:border-cyan-500/30 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Vehicles On-Premises</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/20 flex items-center justify-center">
              <Truck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{onPremisesCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">vehicles inside</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-300">
            <Activity className="h-3.5 w-3.5" />
            <span>2 heavy trucks, 1 visitor vehicle</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weighbridge Inbound Queue</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Scale className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">4</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">trucks queued</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Avg tare turnaround: 11 mins</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Fleet in Transit</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Navigation className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">6</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">GPS trips live</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>100% On-schedule delivery</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Security & Zero Leakage</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">100%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">tamper-free rate</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>0 unauthorized removals today</span>
          </div>
        </div>
      </div>

      {/* Quick Nav Module Hub */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Link
          href="/logistics-gate/gate-entries"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <LogIn className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Gate Passes</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Live check-in & badges</p>
          </div>
        </Link>

        <Link
          href="/logistics-gate/inbound-check"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Scale className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Inbound Weighbridge</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">PO & Gross/Tare check</p>
          </div>
        </Link>

        <Link
          href="/logistics-gate/outbound-clearance"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Outbound Clearance</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Seals & Challan audit</p>
          </div>
        </Link>

        <Link
          href="/logistics-gate/trips"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Navigation className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Fleet GPS & POD</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Waypoints & delivery proof</p>
          </div>
        </Link>

        <Link
          href="/logistics-gate/special-passes"
          className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileCheck className="h-3.5 w-3.5" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Special Gate Passes</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Repairs, scrap & returns</p>
          </div>
        </Link>
      </div>

      {/* Live Outbound Security & Tamper Seal Clearances (Synced with Dispatch Hub) */}
      <div className="p-4 bg-white dark:bg-[#0d1322] border border-cyan-500/30 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Outbound Factory Clearance & Tamper-Seal Verification Queue</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-100 dark:bg-cyan-950/60 font-mono">
              Live Dispatch Sync
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            {gatePasses.filter(p => p.status === 'PENDING_CLEARANCE').length} Trucks Awaiting Gate Exit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gatePasses.map((pass) => (
            <div
              key={pass.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{pass.gatePassNumber}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{pass.vehicleNumber}</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Driver: <strong className="text-slate-900 dark:text-white">{pass.driverName}</strong> ({pass.carrierName})
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Seal: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{pass.sealNumber}</span> &bull; {pass.cartonsCount} Cartons ({pass.totalWeightKg} kg)
                </div>
              </div>

              <div>
                {pass.status === 'PENDING_CLEARANCE' ? (
                  <button
                    onClick={() => handleClearPass(pass.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify &amp; Exit Gate
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Gate Cleared ({pass.clearedAt})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Active Vehicles Inside Premises + Live In-Transit Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles Live Stream */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Live Gate Movement & Perimeter Vehicles</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-medium border border-cyan-200 dark:border-cyan-500/30">
                Live Sensor Sync
              </span>
            </div>

            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search plate, driver, pass #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-60"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3 font-semibold">Pass / Gate</th>
                  <th className="py-2.5 px-3 font-semibold">Vehicle Plate & Type</th>
                  <th className="py-2.5 px-3 font-semibold">Driver & Contact</th>
                  <th className="py-2.5 px-3 font-semibold">Purpose & Transporter</th>
                  <th className="py-2.5 px-3 font-semibold">Entry Time</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono text-cyan-700 dark:text-cyan-300 font-medium">{v.passNumber}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                        {v.gateNumber}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white tracking-wide">{v.vehicleNumber}</div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mt-0.5 inline-block">
                        {v.vehicleType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-900 dark:text-white font-medium">{v.driverName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{v.driverPhone}</div>
                    </td>
                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="truncate text-slate-800 dark:text-slate-200 font-medium" title={v.purpose}>
                        {v.purpose}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{v.transporterName || 'Self / Company'}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      <div>{v.entryTimestamp}</div>
                      {v.exitTimestamp && <div className="text-slate-500 dark:text-slate-500 text-[10px]">Out: {v.exitTimestamp}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          v.status === 'INSIDE_PREMISES'
                            ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                            : v.status === 'CHECKED_OUT'
                            ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                            : 'bg-rose-50 dark:bg-red-500/15 text-rose-700 dark:text-red-300 border border-rose-200 dark:border-red-500/30'
                        }`}
                      >
                        {v.status === 'INSIDE_PREMISES' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />}
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16]/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Showing {filteredVehicles.length} records</span>
            <Link href="/logistics-gate/gate-entries" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium flex items-center gap-1">
              View all vehicle history logs &rarr;
            </Link>
          </div>
        </div>

        {/* Live Delivery Fleet Radar */}
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Live Dispatched Fleet (GPS)</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Active Radar
            </span>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{trip.tripTrackingNumber}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      trip.status === 'DISPATCHED'
                        ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                        : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>

                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white">{trip.vehicleNumber} ({trip.carrierName})</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Driver: {trip.driverName} &bull; {trip.driverPhone}</div>
                </div>

                <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800/80">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Route & Waypoint:</div>
                  <div className="text-slate-800 dark:text-slate-200 mt-0.5">{trip.routePlan}</div>
                  <div className="text-amber-600 dark:text-amber-400/90 text-[10px] font-mono mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                    {trip.currentLocationGps}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                  <span>ETA: {trip.estimatedArrival}</span>
                  {trip.proofOfDeliveryUrl && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      POD Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16]/60">
            <Link
              href="/logistics-gate/trips"
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium flex items-center justify-center gap-1 w-full"
            >
              Open Fleet Trip Dispatcher &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

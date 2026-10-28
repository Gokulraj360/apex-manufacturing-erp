'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  Gauge,
  Wrench,
  Navigation,
  Fuel,
  FileCheck,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Calendar,
  Layers,
  Zap,
  Activity,
  MapPin,
  Check,
  X,
} from 'lucide-react';
import {
  FleetOverviewMetrics,
  FleetVehicleItem,
  VehicleAssignmentItem,
  VehicleServiceLogItem,
  VehicleComplianceDocumentItem,
} from '@/types/fleet';
import { PlainEnglishBanner } from '@/components/PlainEnglishBanner';
import { useActiveFranchise } from '@/lib/franchiseStore';
import { formatCurrency } from '@/lib/utils';

const MOCK_OVERVIEW_METRICS: FleetOverviewMetrics = {
  fleetSize: 16,
  statusBreakdown: {
    available: 7,
    onTrip: 5,
    inMaintenance: 2,
    outOfService: 1,
    decommissioned: 1,
  },
  activeTrips: 5,
  totalMileageKm: 384650,
  expiringComplianceAlerts: 3,
  recentFuelAnalytics: {
    totalSpend: 142850,
    litersConsumed: 1540,
    tollExpenditure: 12400,
  },
};

const MOCK_RECENT_VEHICLES: FleetVehicleItem[] = [
  {
    id: 'flt-1',
    vehicleNumber: 'KA-04-ME-4821',
    fleetCode: 'FLT-TRK-0001',
    modelName: 'Prima 4028.S 40T Trailer',
    make: 'Tata Motors',
    year: 2024,
    vehicleType: 'HEAVY_TRUCK',
    status: 'ON_TRIP',
    fuelType: 'DIESEL',
    payloadCapacityKg: 28000,
    totalOdometerKm: 64200,
    assignedDriver: 'Rameshwar Patil',
    fastagTagId: 'FTG-8829-KA',
    fuelCardNumber: 'FC-99120-001',
    gpsTelematicsId: 'GPS-86392019482',
    insurancePolicyExpiry: '2026-12-15T00:00:00.000Z',
    pucExpiry: '2026-11-20T00:00:00.000Z',
    fitnessExpiry: '2027-04-10T00:00:00.000Z',
    roadTaxExpiry: '2027-01-31T00:00:00.000Z',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'flt-2',
    vehicleNumber: 'MH-12-RN-7714',
    fleetCode: 'FLT-TRK-0002',
    modelName: 'Eicher Pro 3019 Container',
    make: 'Eicher Motors',
    year: 2023,
    vehicleType: 'MEDIUM_TRUCK',
    status: 'AVAILABLE',
    fuelType: 'DIESEL',
    payloadCapacityKg: 12500,
    totalOdometerKm: 89450,
    assignedDriver: 'Dilip Sawant',
    fastagTagId: 'FTG-5519-MH',
    fuelCardNumber: 'FC-99120-002',
    gpsTelematicsId: 'GPS-86392019483',
    insurancePolicyExpiry: '2026-11-05T00:00:00.000Z',
    pucExpiry: '2026-10-25T00:00:00.000Z',
    fitnessExpiry: '2027-02-18T00:00:00.000Z',
    roadTaxExpiry: '2026-12-31T00:00:00.000Z',
    createdAt: '2024-06-15T00:00:00.000Z',
    updatedAt: '2026-10-02T00:00:00.000Z',
  },
  {
    id: 'flt-3',
    vehicleNumber: 'KA-01-AB-3091',
    fleetCode: 'FLT-VAN-0003',
    modelName: 'Bolero Maxi Truck Plus',
    make: 'Mahindra',
    year: 2024,
    vehicleType: 'PICKUP_UTILITY',
    status: 'IN_MAINTENANCE',
    fuelType: 'DIESEL',
    payloadCapacityKg: 1200,
    totalOdometerKm: 42100,
    assignedDriver: 'Anand Kumar',
    fastagTagId: 'FTG-3129-KA',
    fuelCardNumber: 'FC-99120-003',
    gpsTelematicsId: 'GPS-86392019484',
    insurancePolicyExpiry: '2026-10-18T00:00:00.000Z',
    pucExpiry: '2026-10-30T00:00:00.000Z',
    fitnessExpiry: '2026-11-12T00:00:00.000Z',
    roadTaxExpiry: '2027-03-31T00:00:00.000Z',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2026-10-03T00:00:00.000Z',
  },
  {
    id: 'flt-4',
    vehicleNumber: 'KA-05-EV-1022',
    fleetCode: 'FLT-FORK-0004',
    modelName: 'Toyota 8FB25 Electric 2.5T',
    make: 'Toyota Material Handling',
    year: 2025,
    vehicleType: 'ELECTRIC_FORKLIFT',
    status: 'AVAILABLE',
    fuelType: 'ELECTRIC',
    payloadCapacityKg: 2500,
    totalOdometerKm: 12800,
    assignedDriver: 'Suresh Rao (Yard)',
    fastagTagId: null,
    fuelCardNumber: null,
    gpsTelematicsId: 'GPS-86392019485',
    insurancePolicyExpiry: '2027-01-20T00:00:00.000Z',
    pucExpiry: null,
    fitnessExpiry: '2027-05-15T00:00:00.000Z',
    roadTaxExpiry: null,
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
];

const MOCK_ACTIVE_TRIPS: VehicleAssignmentItem[] = [
  {
    id: 'trp-1',
    assignmentNumber: 'TRP-2026-8910',
    vehicleId: 'flt-1',
    driverName: 'Rameshwar Patil',
    driverContact: '+91 98451 22334',
    routeTitle: 'Factory Hub -> Reliance Retail Pune Depot',
    originLocation: 'Apex Manufacturing Hub 01',
    destinationLocation: 'Reliance Retail Mega Hub Gate 3',
    purpose: 'FINISHED_GOODS_DELIVERY',
    status: 'IN_TRANSIT',
    scheduledStart: '2026-10-07T06:00:00.000Z',
    actualStart: '2026-10-07T06:30:00.000Z',
    cargoWeightKg: 18500,
    linkedDispatchOrderRef: 'DSP-SHP-2026-042',
    dispatchedBy: 'Logistics Supervisor Verma',
    createdAt: '2026-10-07T05:00:00.000Z',
    updatedAt: '2026-10-07T06:30:00.000Z',
  },
];

const MOCK_COMPLIANCE_ALERTS: VehicleComplianceDocumentItem[] = [
  {
    id: 'doc-1',
    documentNumber: 'DOC-INS-2026-0042',
    vehicleId: 'flt-3',
    docType: 'INSURANCE_POLICY',
    policyOrCertificateNumber: 'NIC-COMM-88392019-25',
    issuingAuthority: 'National Insurance Co.',
    issueDate: '2025-10-19T00:00:00.000Z',
    expiryDate: '2026-10-18T00:00:00.000Z',
    premiumOrFeeAmount: 24500,
    status: 'EXPIRING_SOON',
    renewalAlertDays: 30,
    notes: 'Comprehensive commercial vehicle insurance policy.',
    managedBy: 'Compliance Officer Sharma',
    createdAt: '2025-10-19T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'doc-2',
    documentNumber: 'DOC-PUC-2026-0089',
    vehicleId: 'flt-2',
    docType: 'PUC_CERTIFICATE',
    policyOrCertificateNumber: 'KA01-PUC-992104-E',
    issuingAuthority: 'RTO Electronic City',
    issueDate: '2026-04-26T00:00:00.000Z',
    expiryDate: '2026-10-25T00:00:00.000Z',
    premiumOrFeeAmount: 450,
    status: 'EXPIRING_SOON',
    renewalAlertDays: 30,
    notes: 'Smoke emission test clearance - 6 months validity.',
    managedBy: 'Fleet Inspector Varma',
    createdAt: '2026-04-26T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
];

export default function FleetDashboardOverviewPage() {
  const activeFranchise = useActiveFranchise();
  const [metrics, setMetrics] = useState<FleetOverviewMetrics>(MOCK_OVERVIEW_METRICS);
  const [vehicles, setVehicles] = useState<FleetVehicleItem[]>(MOCK_RECENT_VEHICLES);
  const [activeTrips, setActiveTrips] = useState<VehicleAssignmentItem[]>(MOCK_ACTIVE_TRIPS);
  const [complianceAlerts, setComplianceAlerts] = useState<VehicleComplianceDocumentItem[]>(MOCK_COMPLIANCE_ALERTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick Dispatch Modal State
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(MOCK_RECENT_VEHICLES[1].id);
  const [newTripDestination, setNewTripDestination] = useState('');
  const [newTripDriver, setNewTripDriver] = useState('');
  const [newTripCargoKg, setNewTripCargoKg] = useState('5000');
  const [isSubmittingDispatch, setIsSubmittingDispatch] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState('');

  // Fetch live metrics
  const fetchOverviewData = async () => {
    setIsLoading(true);
    try {
      const [metricsRes, vehiclesRes, tripsRes, complianceRes] = await Promise.allSettled([
        fetch('/api/v1/fleet/vehicles/overview/metrics'),
        fetch('/api/v1/fleet/vehicles'),
        fetch('/api/v1/fleet/assignments?status=IN_TRANSIT'),
        fetch('/api/v1/fleet/compliance?status=EXPIRING_SOON'),
      ]);

      if (metricsRes.status === 'fulfilled' && metricsRes.value.ok) {
        const data = await metricsRes.value.json();
        setMetrics(data);
      }
      if (vehiclesRes.status === 'fulfilled' && vehiclesRes.value.ok) {
        const data = await vehiclesRes.value.json();
        if (Array.isArray(data) && data.length > 0) setVehicles(data);
      }
      if (tripsRes.status === 'fulfilled' && tripsRes.value.ok) {
        const data = await tripsRes.value.json();
        if (Array.isArray(data) && data.length > 0) setActiveTrips(data);
      }
      if (complianceRes.status === 'fulfilled' && complianceRes.value.ok) {
        const data = await complianceRes.value.json();
        if (Array.isArray(data) && data.length > 0) setComplianceAlerts(data);
      }
    } catch {
      // Graceful fallback to initial mock data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const handleQuickDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripDestination || !newTripDriver) return;

    setIsSubmittingDispatch(true);
    try {
      const res = await fetch('/api/v1/fleet/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selectedVehicleId,
          driverName: newTripDriver,
          routeTitle: `Factory -> ${newTripDestination}`,
          originLocation: 'Apex Manufacturing Hub 01',
          destinationLocation: newTripDestination,
          purpose: 'FINISHED_GOODS_DELIVERY',
          cargoWeightKg: Number(newTripCargoKg) || 0,
        }),
      });

      if (res.ok) {
        const createdTrip = await res.json();
        setActiveTrips((prev) => [createdTrip, ...prev]);
        setDispatchSuccessMsg(`Trip [${createdTrip.assignmentNumber || 'New Trip'}] sent successfully!`);
        setTimeout(() => {
          setShowDispatchModal(false);
          setDispatchSuccessMsg('');
          setNewTripDestination('');
          setNewTripDriver('');
        }, 1500);
      } else {
        // Fallback local update
        const fakeTrip: VehicleAssignmentItem = {
          id: `trp-${Date.now()}`,
          assignmentNumber: `TRP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          vehicleId: selectedVehicleId,
          driverName: newTripDriver,
          driverContact: '+91 98000 00000',
          routeTitle: `Factory -> ${newTripDestination}`,
          originLocation: 'Apex Manufacturing Hub 01',
          destinationLocation: newTripDestination,
          purpose: 'FINISHED_GOODS_DELIVERY',
          status: 'DISPATCHED',
          scheduledStart: new Date().toISOString(),
          actualStart: new Date().toISOString(),
          cargoWeightKg: Number(newTripCargoKg) || 0,
          dispatchedBy: 'Fleet Dispatcher',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setActiveTrips((prev) => [fakeTrip, ...prev]);
        setDispatchSuccessMsg(`Trip [${fakeTrip.assignmentNumber}] recorded locally.`);
        setTimeout(() => {
          setShowDispatchModal(false);
          setDispatchSuccessMsg('');
          setNewTripDestination('');
          setNewTripDriver('');
        }, 1500);
      }
    } catch {
      setShowDispatchModal(false);
    } finally {
      setIsSubmittingDispatch(false);
    }
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.fleetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.assignedDriver && v.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Banner & Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
              <Truck className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
              Delivery Trucks & Logistics
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Delivery Trucks & Vehicles Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Live truck tracking, delivery trips, toll costs, diesel usage, and vehicle fitness & insurance papers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchOverviewData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Live Status
          </button>

          <button
            onClick={() => setShowDispatchModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-colors"
          >
            <Navigation className="h-3.5 w-3.5" />
            Send Vehicle on Trip
          </button>

          <Link
            href="/fleet/registry"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Add New Vehicle
          </Link>
        </div>
      </div>

      {/* Unified Fleet Hub Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Link
          href="/fleet"
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-xs"
        >
          Fleet Overview & Live Trips
        </Link>
        <Link
          href="/fleet/registry"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Vehicle Registry & Trucks
        </Link>
        <Link
          href="/fleet/assignments"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Driver & Route Assignments
        </Link>
        <Link
          href="/fleet/maintenance"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Garage Servicing & Repairs
        </Link>
        <Link
          href="/fleet/expenses"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Fuel Cards & FASTag Tolls
        </Link>
        <Link
          href="/fleet/compliance"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Insurance, PUC & Permits
        </Link>
      </div>

      {/* Plain-English Explainer Guide for Fleet */}
      <PlainEnglishBanner
        moduleName="Delivery Fleet & Vehicle Logistics"
        whatItDoes="Monitors company delivery trucks, live shipment runs, driver route assignments, fuel consumption, and statutory fitness/insurance paperwork."
        whyItMatters="Prevents delivery delays, cuts fuel/toll wastage, avoids government road fines, and ensures vehicles are serviced before breakdowns happen."
        metrics={[
          {
            acronym: 'Odometer (KM)',
            plainName: 'Total Mileage Driven',
            explanation: 'The running distance clock used to schedule regular tire, oil, and brake maintenance intervals.',
          },
          {
            acronym: 'PUC & Fitness',
            plainName: 'Government Road Clearances',
            explanation: 'Pollution Under Control and vehicle roadworthiness certifications required to prevent police seizure or transit fines.',
          },
          {
            acronym: 'FASTag & Fuel',
            plainName: 'Toll & Diesel Expense Cards',
            explanation: 'Automated highway toll debits and company prepaid diesel cards assigned to drivers for route accountability.',
          },
        ]}
        quickSteps={[
          '1. View trucks in yard vs active on road with live driver details',
          '2. Assign pending customer shipments and drivers to available vehicles',
          '3. Track maintenance alerts and renew expiring insurance or PUC papers',
        ]}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span>Total Vehicles</span>
            <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
            {metrics.fleetSize}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{metrics.statusBreakdown.available}</span> in Yard
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span>Vehicles on Trip</span>
            <Navigation className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight font-mono">
            {metrics.activeTrips}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{metrics.statusBreakdown.onTrip}</span> On Road
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span>In Repair</span>
            <Wrench className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
            {metrics.statusBreakdown.inMaintenance}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">{metrics.statusBreakdown.outOfService}</span> Out of Service
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span>Total Kilometers</span>
            <Gauge className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
            {(metrics.totalMileageKm / 1000).toFixed(1)}k
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>Km driven total</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span>Diesel & Tolls</span>
            <Fuel className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
            {formatCurrency(metrics.recentFuelAnalytics.totalSpend, activeFranchise?.currency || 'USD')}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>{metrics.recentFuelAnalytics.litersConsumed} L diesel</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span>Expiring Papers</span>
            <FileCheck className="h-4 w-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight font-mono">
            {metrics.expiringComplianceAlerts}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-rose-600 dark:text-rose-400 font-semibold">30-day</span> renewal window
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Active Dispatches & Vehicle Inventory Console */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Trips Radar */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Live Delivery Trips on the Road</h3>
              </div>
              <Link
                href="/fleet/assignments"
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
              >
                View All Trips <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {activeTrips.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No trips currently dispatched or in transit.
                </div>
              ) : (
                activeTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          {trip.assignmentNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {trip.routeTitle}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
                        {trip.status === 'IN_TRANSIT' ? 'On Road' : trip.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Driver</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{trip.driverName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Destination</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium truncate block">{trip.destinationLocation}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Cargo Load</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{trip.cargoWeightKg ? `${trip.cargoWeightKg.toLocaleString()} kg` : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Dispatch Slip</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">{trip.linkedDispatchOrderRef || 'DIRECT'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Vehicle Inventory Table */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Company Trucks & Delivery Vans</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search vehicle number or driver..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <Link
                  href="/fleet/registry"
                  className="px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Full Details
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="pb-2.5 pl-2">Vehicle / Code</th>
                    <th className="pb-2.5">Model / Make</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Odometer</th>
                    <th className="pb-2.5">Assigned Driver</th>
                    <th className="pb-2.5 pr-2 text-right">Capacity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-2.5 pl-2 font-medium">
                        <div className="text-slate-900 dark:text-white font-mono font-semibold">{vehicle.vehicleNumber}</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">{vehicle.fleetCode}</div>
                      </td>
                      <td className="py-2.5">
                        <div className="text-slate-800 dark:text-slate-200">{vehicle.modelName}</div>
                        <div className="text-[10px] text-slate-500">{vehicle.make} ({vehicle.year})</div>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            vehicle.status === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                              : vehicle.status === 'ON_TRIP'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                              : vehicle.status === 'IN_MAINTENANCE'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                          }`}
                        >
                          {vehicle.status === 'AVAILABLE'
                            ? 'Available in Yard'
                            : vehicle.status === 'ON_TRIP'
                            ? 'On Road'
                            : vehicle.status === 'IN_MAINTENANCE'
                            ? 'In Workshop'
                            : vehicle.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-slate-700 dark:text-slate-300">
                        {vehicle.totalOdometerKm.toLocaleString()} km
                      </td>
                      <td className="py-2.5 text-slate-700 dark:text-slate-300">
                        {vehicle.assignedDriver || <span className="text-slate-400">Unassigned</span>}
                      </td>
                      <td className="py-2.5 pr-2 text-right font-medium text-slate-700 dark:text-slate-300">
                        {(vehicle.payloadCapacityKg / 1000).toFixed(1)} T
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Links, Compliance Expiry Radar */}
        <div className="space-y-6">
          {/* Quick Hub Navigation Cards */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-2.5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Truck & Transport Tasks</h3>

            <Link
              href="/fleet/registry"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Gauge className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-white">Vehicle List & Details</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Technical specs, Fastag IDs, GPS units</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
            </Link>

            <Link
              href="/fleet/maintenance"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-white">Repairs & Service Logs</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Servicing logs, parts replaced, repair costs</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            </Link>

            <Link
              href="/fleet/assignments"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Navigation className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white">Driver & Route Trips</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Trip schedules, km run, gate slips</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </Link>

            <Link
              href="/fleet/expenses"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Fuel className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-white">Diesel & Toll Expenses</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Fuel card slips, km/L mileage, toll receipts</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </Link>

            <Link
              href="/fleet/compliance"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <FileCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-white">Insurance, PUC & Fitness</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Vehicle insurance, pollution certificate, road tax</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
            </Link>
          </div>

          {/* Statutory Expiry Watchlist */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Expiring Vehicle Papers (30 Days)</h3>
              </div>
              <Link href="/fleet/compliance" className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold">
                Manage
              </Link>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Vehicle certificates needing renewal within 30 days to avoid road fines.
            </p>

            <div className="space-y-2.5">
              {complianceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 bg-amber-50/60 dark:bg-slate-950/80 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      {alert.docType === 'INSURANCE_POLICY'
                        ? 'Vehicle Insurance Policy'
                        : alert.docType === 'PUC_CERTIFICATE'
                        ? 'Pollution Test (PUC)'
                        : alert.docType.replace('_', ' ')}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Doc: {alert.policyOrCertificateNumber}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Authority: {alert.issuingAuthority}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                      Exp: {new Date(alert.expiryDate).toLocaleDateString()}
                    </span>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                      ₹{alert.premiumOrFeeAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Vehicle on Trip</h3>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {dispatchSuccessMsg ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                {dispatchSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleQuickDispatch} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Select Available Vehicle</label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNumber} ({v.modelName} - {v.status === 'AVAILABLE' ? 'Available' : v.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Destination Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune Distribution Hub Gate 2"
                    value={newTripDestination}
                    onChange={(e) => setNewTripDestination(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Assigned Driver Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dilip Sawant"
                    value={newTripDriver}
                    onChange={(e) => setNewTripDriver(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Cargo Weight (kg)</label>
                  <input
                    type="number"
                    value={newTripCargoKg}
                    onChange={(e) => setNewTripCargoKg(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowDispatchModal(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDispatch}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {isSubmittingDispatch ? 'Dispatching...' : 'Confirm Dispatch'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

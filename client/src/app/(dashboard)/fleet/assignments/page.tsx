'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Navigation,
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  MapPin,
  RefreshCw,
  Check,
  X,
  Phone,
  User,
  ArrowRight,
  Package,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  VehicleAssignmentItem,
  AssignmentStatus,
  AssignmentStatistics,
} from '@/types/fleet';

const INITIAL_ASSIGNMENTS: VehicleAssignmentItem[] = [
  {
    id: 'trp-1',
    assignmentNumber: 'TRP-2026-0118',
    vehicleId: 'flt-1',
    vehicle: {
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
      createdAt: '2025-01-10T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    },
    driverName: 'Rameshwar Patil',
    driverContact: '+91 98451 22891',
    routeTitle: 'Bengaluru Plant Hub -> Chennai Port CFS Terminal 4',
    originLocation: 'Plant Hub 01, Bengaluru',
    destinationLocation: 'Chennai Port CFS Terminal Bay 4',
    purpose: 'FINISHED_GOODS_DELIVERY',
    status: 'IN_TRANSIT',
    startOdometerKm: 63850,
    endOdometerKm: null,
    scheduledStart: '2026-10-07T06:00:00.000Z',
    actualStart: '2026-10-07T06:25:00.000Z',
    cargoWeightKg: 24500,
    linkedDispatchOrderRef: 'DSP-2026-0842',
    notes: 'Heavy structural valves for export. Fastag auto-debit active.',
    dispatchedBy: 'Logistics Supervisor Kumar',
    createdAt: '2026-10-06T18:00:00.000Z',
    updatedAt: '2026-10-07T06:25:00.000Z',
  },
  {
    id: 'trp-2',
    assignmentNumber: 'TRP-2026-0119',
    vehicleId: 'flt-2',
    vehicle: {
      id: 'flt-2',
      vehicleNumber: 'MH-12-RN-7714',
      fleetCode: 'FLT-TRK-0002',
      modelName: 'Eicher Pro 3019 Container',
      make: 'Eicher Motors',
      year: 2023,
      vehicleType: 'MEDIUM_TRUCK',
      status: 'ON_TRIP',
      fuelType: 'DIESEL',
      payloadCapacityKg: 12500,
      totalOdometerKm: 89450,
      createdAt: '2024-06-15T00:00:00.000Z',
      updatedAt: '2026-10-02T00:00:00.000Z',
    },
    driverName: 'Dilip Sawant',
    driverContact: '+91 97312 44901',
    routeTitle: 'Hosur Forging Foundry -> Central Plant Raw Dock',
    originLocation: 'Apex Foundry Plant, Hosur',
    destinationLocation: 'Raw Material Dock, Hub 01',
    purpose: 'RAW_MATERIAL_PICKUP',
    status: 'DISPATCHED',
    startOdometerKm: 89450,
    endOdometerKm: null,
    scheduledStart: '2026-10-07T09:30:00.000Z',
    actualStart: '2026-10-07T09:40:00.000Z',
    cargoWeightKg: 9800,
    linkedDispatchOrderRef: 'DSP-2026-0845',
    notes: 'Forged crankshaft blanks for CNC Line 3.',
    dispatchedBy: 'Logistics Supervisor Kumar',
    createdAt: '2026-10-07T08:00:00.000Z',
    updatedAt: '2026-10-07T09:40:00.000Z',
  },
  {
    id: 'trp-3',
    assignmentNumber: 'TRP-2026-0117',
    vehicleId: 'flt-3',
    vehicle: {
      id: 'flt-3',
      vehicleNumber: 'KA-01-AB-3091',
      fleetCode: 'FLT-VAN-0003',
      modelName: 'Bolero Maxi Truck Plus',
      make: 'Mahindra',
      year: 2024,
      vehicleType: 'PICKUP_UTILITY',
      status: 'AVAILABLE',
      fuelType: 'DIESEL',
      payloadCapacityKg: 1200,
      totalOdometerKm: 42100,
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2026-10-03T00:00:00.000Z',
    },
    driverName: 'Anand Kumar',
    driverContact: '+91 96118 73204',
    routeTitle: 'Peenya Precision Toolroom -> Plant Main Tool Crib',
    originLocation: 'Vendor Toolroom, Peenya',
    destinationLocation: 'Tool Crib Bay 2, Plant Hub 01',
    purpose: 'EMERGENCY_TOOLING_TRANSFER',
    status: 'COMPLETED',
    startOdometerKm: 41920,
    endOdometerKm: 42100,
    scheduledStart: '2026-10-05T08:00:00.000Z',
    actualStart: '2026-10-05T08:15:00.000Z',
    scheduledEnd: '2026-10-05T14:00:00.000Z',
    actualEnd: '2026-10-05T13:40:00.000Z',
    cargoWeightKg: 450,
    linkedDispatchOrderRef: 'TOOL-REQ-2026-019',
    notes: 'Urgent carbide milling inserts & reamers delivery for EDM line.',
    dispatchedBy: 'Tooling Supv Murthy',
    createdAt: '2026-10-05T07:30:00.000Z',
    updatedAt: '2026-10-05T13:40:00.000Z',
  },
];

export default function FleetAssignmentsPage() {
  const [assignments, setAssignments] = useState<VehicleAssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Modal: Dispatch New Trip
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    vehicleId: 'flt-1',
    driverName: '',
    driverContact: '',
    routeTitle: '',
    originLocation: 'Plant Hub 01, Bengaluru',
    destinationLocation: '',
    purpose: 'FINISHED_GOODS_DELIVERY',
    status: 'DISPATCHED',
    startOdometerKm: '64200',
    scheduledStart: new Date().toISOString().slice(0, 16),
    cargoWeightKg: '10000',
    linkedDispatchOrderRef: '',
    notes: '',
    dispatchedBy: 'Fleet Dispatch Desk',
  });
  const [isSubmittingDispatch, setIsSubmittingDispatch] = useState(false);

  // Modal: Complete Trip
  const [completingTrip, setCompletingTrip] = useState<VehicleAssignmentItem | null>(null);
  const [completionOdometer, setCompletionOdometer] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/fleet/assignments');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAssignments(data);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreateDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDispatch(true);
    try {
      const payload = {
        vehicleId: dispatchForm.vehicleId,
        driverName: dispatchForm.driverName,
        driverContact: dispatchForm.driverContact,
        routeTitle: dispatchForm.routeTitle || `${dispatchForm.originLocation} -> ${dispatchForm.destinationLocation}`,
        originLocation: dispatchForm.originLocation,
        destinationLocation: dispatchForm.destinationLocation,
        purpose: dispatchForm.purpose,
        status: dispatchForm.status,
        startOdometerKm: Number(dispatchForm.startOdometerKm) || 0,
        scheduledStart: new Date(dispatchForm.scheduledStart).toISOString(),
        cargoWeightKg: Number(dispatchForm.cargoWeightKg) || 0,
        linkedDispatchOrderRef: dispatchForm.linkedDispatchOrderRef || null,
        notes: dispatchForm.notes || null,
        dispatchedBy: dispatchForm.dispatchedBy,
      };

      const res = await fetch('/api/v1/fleet/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setAssignments((prev) => [created, ...prev]);
        setShowDispatchModal(false);
      } else {
        // Fallback local update
        const fakeCreated: VehicleAssignmentItem = {
          id: `trp-${Date.now()}`,
          assignmentNumber: `TRP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          vehicleId: payload.vehicleId,
          vehicle: {
            id: payload.vehicleId,
            vehicleNumber: 'KA-04-ME-4821',
            fleetCode: 'FLT-TRK-0001',
            modelName: 'Prima 4028.S',
            make: 'Tata',
            year: 2024,
            vehicleType: 'HEAVY_TRUCK',
            status: 'ON_TRIP',
            fuelType: 'DIESEL',
            payloadCapacityKg: 28000,
            totalOdometerKm: payload.startOdometerKm,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          driverName: payload.driverName,
          driverContact: payload.driverContact,
          routeTitle: payload.routeTitle,
          originLocation: payload.originLocation,
          destinationLocation: payload.destinationLocation,
          purpose: payload.purpose,
          status: payload.status as AssignmentStatus,
          startOdometerKm: payload.startOdometerKm,
          scheduledStart: payload.scheduledStart,
          cargoWeightKg: payload.cargoWeightKg,
          linkedDispatchOrderRef: payload.linkedDispatchOrderRef,
          notes: payload.notes,
          dispatchedBy: payload.dispatchedBy,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setAssignments((prev) => [fakeCreated, ...prev]);
        setShowDispatchModal(false);
      }
    } catch {
      setShowDispatchModal(false);
    } finally {
      setIsSubmittingDispatch(false);
    }
  };

  const handleCompleteTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingTrip) return;
    setIsSubmittingCompletion(true);
    try {
      const endOdometer = Number(completionOdometer) || completingTrip.startOdometerKm || 0;
      const res = await fetch(`/api/v1/fleet/assignments/${completingTrip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          endOdometerKm: endOdometer,
          actualEnd: new Date().toISOString(),
          notes: completionNotes ? `${completingTrip.notes || ''} | ${completionNotes}` : completingTrip.notes,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setAssignments((prev) =>
          prev.map((a) => (a.id === completingTrip.id ? updated : a)),
        );
      } else {
        // Fallback local update
        setAssignments((prev) =>
          prev.map((a) =>
            a.id === completingTrip.id
              ? {
                  ...a,
                  status: 'COMPLETED' as AssignmentStatus,
                  endOdometerKm: endOdometer,
                  actualEnd: new Date().toISOString(),
                }
              : a,
          ),
        );
      }
      setCompletingTrip(null);
    } catch {
      setCompletingTrip(null);
    } finally {
      setIsSubmittingCompletion(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.assignmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.routeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.destinationLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.linkedDispatchOrderRef && a.linkedDispatchOrderRef.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = assignments.filter((a) => a.status === 'DISPATCHED' || a.status === 'IN_TRANSIT').length;
  const completedCount = assignments.filter((a) => a.status === 'COMPLETED').length;
  const totalCargoTransported = assignments.reduce((acc, a) => acc + (a.cargoWeightKg || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Navigation className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              Route & Dispatch Operations
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Driver & Trip Dispatch Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch driver routes, track in-transit cargo consignments, record starting/ending odometer mileage, and connect to plant dispatch gates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAssignments}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowDispatchModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Dispatch Trip
          </button>
        </div>
      </div>

      {/* KPI Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Active In-Transit Trips</span>
            <Navigation className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {activeCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Vehicles currently on highway</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Completed Trips</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Safely delivered to dock</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Cargo Moved</span>
            <Package className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-1">
            {(totalCargoTransported / 1000).toFixed(1)} MT
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{totalCargoTransported.toLocaleString()} kg consignment weight</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Trip Assignments Total</span>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {assignments.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Historical route logs</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search trip #, driver, route, dock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Trips</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Assignments List Cards */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-500 text-xs">
            No route trip dispatches match your search filters.
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const isCompleted = assignment.status === 'COMPLETED';
            const distanceCovered =
              assignment.endOdometerKm && assignment.startOdometerKm
                ? assignment.endOdometerKm - assignment.startOdometerKm
                : null;

            return (
              <div
                key={assignment.id}
                className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Navigation className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-white">
                          {assignment.assignmentNumber}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-blue-500/20">
                          {assignment.purpose.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {assignment.vehicle?.vehicleNumber || 'Unassigned'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-0.5">
                        {assignment.routeTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        assignment.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : assignment.status === 'IN_TRANSIT'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : assignment.status === 'DISPATCHED'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {assignment.status}
                    </span>

                    {!isCompleted && assignment.status !== 'CANCELLED' && (
                      <button
                        onClick={() => {
                          setCompletingTrip(assignment);
                          setCompletionOdometer(String((assignment.startOdometerKm || 0) + 150));
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      >
                        Complete Trip
                      </button>
                    )}
                  </div>
                </div>

                {/* Journey & Telemetry Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Driver & Contact</span>
                    <span className="text-slate-200 font-medium">{assignment.driverName}</span>
                    <span className="text-slate-400 text-[10px] block">{assignment.driverContact}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Destination Drop</span>
                    <span className="text-slate-200 font-medium truncate block">{assignment.destinationLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Payload Cargo</span>
                    <span className="text-slate-200 font-medium">
                      {assignment.cargoWeightKg ? `${assignment.cargoWeightKg.toLocaleString()} kg` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Odometer Log</span>
                    <span className="text-slate-200 font-mono text-xs">
                      {assignment.startOdometerKm ? `${assignment.startOdometerKm.toLocaleString()} km` : '—'}
                      {' -> '}
                      {assignment.endOdometerKm ? `${assignment.endOdometerKm.toLocaleString()} km` : 'Active'}
                    </span>
                    {distanceCovered && (
                      <span className="text-emerald-400 text-[10px] block font-semibold">
                        +{distanceCovered.toLocaleString()} km covered
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer notes & Dispatch ID */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                  <div>
                    {assignment.notes && (
                      <span>Instruction: <strong className="text-slate-400 font-normal">{assignment.notes}</strong></span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {assignment.linkedDispatchOrderRef && (
                      <span className="text-slate-400 font-mono">
                        Gate Ref: <strong className="text-blue-400">{assignment.linkedDispatchOrderRef}</strong>
                      </span>
                    )}
                    <span>Dispatched by: {assignment.dispatchedBy}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dispatch New Trip Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Dispatch New Route Trip</h3>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Driver Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Patil"
                    value={dispatchForm.driverName}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, driverName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Driver Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 98451 22891"
                    value={dispatchForm.driverContact}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, driverContact: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Origin Location</label>
                  <input
                    type="text"
                    required
                    value={dispatchForm.originLocation}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, originLocation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Destination Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai Port CFS Terminal 4"
                    value={dispatchForm.destinationLocation}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, destinationLocation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Trip Purpose</label>
                  <select
                    value={dispatchForm.purpose}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, purpose: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="FINISHED_GOODS_DELIVERY">Finished Goods Delivery</option>
                    <option value="RAW_MATERIAL_PICKUP">Raw Material Pickup</option>
                    <option value="EMERGENCY_TOOLING_TRANSFER">Emergency Tooling Transfer</option>
                    <option value="CLIENT_DISPATCH">Client Direct Dispatch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Initial Odometer (km)</label>
                  <input
                    type="number"
                    value={dispatchForm.startOdometerKm}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, startOdometerKm: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Cargo Consignment (kg)</label>
                  <input
                    type="number"
                    value={dispatchForm.cargoWeightKg}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, cargoWeightKg: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Dispatch Order Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. DSP-2026-0842"
                    value={dispatchForm.linkedDispatchOrderRef}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, linkedDispatchOrderRef: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Route & Delivery Notes</label>
                <textarea
                  rows={2}
                  placeholder="Special instructions, e-way bill numbers, or toll pass requirements..."
                  value={dispatchForm.notes}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDispatch}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
                >
                  {isSubmittingDispatch ? 'Dispatching...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Trip Modal */}
      {completingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Complete Trip [{completingTrip.assignmentNumber}]</h3>
              </div>
              <button
                onClick={() => setCompletingTrip(null)}
                className="text-slate-400 hover:text-white p-1 rounded bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCompleteTrip} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400">Driver: <strong className="text-white">{completingTrip.driverName}</strong></div>
                <div className="text-slate-400">Destination: <strong className="text-white">{completingTrip.destinationLocation}</strong></div>
                <div className="text-slate-400 font-mono">Start Odometer: <strong className="text-emerald-400">{completingTrip.startOdometerKm?.toLocaleString()} km</strong></div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ending Return Odometer (km)</label>
                <input
                  type="number"
                  required
                  value={completionOdometer}
                  onChange={(e) => setCompletionOdometer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Trip Completion Remarks (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Cargo handover sign-off, gate inward receipt ref, or trip condition..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingTrip(null)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCompletion}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  {isSubmittingCompletion ? 'Finalizing...' : 'Finalize & Free Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

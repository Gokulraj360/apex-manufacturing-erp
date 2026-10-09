'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Navigation,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  ArrowLeft,
  X,
  FileCheck,
  FileText,
  Compass,
  Upload,
  Calendar,
} from 'lucide-react';
import { DeliveryTripItem, TripStatus } from '@/types/logistics-gate';

const INITIAL_TRIPS: DeliveryTripItem[] = [
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
  {
    id: 'trip-3',
    tripTrackingNumber: 'TRP-2026-0052',
    vehicleNumber: 'KA-04-AK-5509',
    driverName: 'Ramesh Patel',
    driverPhone: '+91 97412 88901',
    carrierName: 'Express Blue Haulage',
    routePlan: 'Pune Plant -> Chennai Automobile Cluster (Sriperumbudur)',
    plannedDeparture: '2026-10-07 15:00',
    estimatedArrival: '2026-10-09 10:00',
    currentLocationGps: '18.5204° N, 73.8567° E (Pune Plant Staging Bay)',
    currentCheckpoint: 'Main Dispatch Yard',
    status: 'SCHEDULED',
    transitRemarks: 'Scheduled for afternoon departure post QA final sign-off.',
    createdAt: '2026-10-07 11:30',
    updatedAt: '2026-10-07 11:30',
  },
];

export default function FleetTripsPage() {
  const [trips, setTrips] = useState<DeliveryTripItem[]>(INITIAL_TRIPS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<DeliveryTripItem | null>(null);

  // New trip schedule form
  const [newTripForm, setNewTripForm] = useState({
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    carrierName: '',
    routePlan: '',
    plannedDeparture: '',
    estimatedArrival: '',
  });

  // POD form
  const [podSigner, setPodSigner] = useState('');
  const [podRemarks, setPodRemarks] = useState('');

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripForm.vehicleNumber || !newTripForm.routePlan) return;

    const newTrip: DeliveryTripItem = {
      id: `trip-${Date.now()}`,
      tripTrackingNumber: `TRP-2026-0${53 + trips.length}`,
      vehicleNumber: newTripForm.vehicleNumber.toUpperCase(),
      driverName: newTripForm.driverName || 'Designated Driver',
      driverPhone: newTripForm.driverPhone || '+91 90000 00000',
      carrierName: newTripForm.carrierName || 'Fleet Operator',
      routePlan: newTripForm.routePlan,
      plannedDeparture: newTripForm.plannedDeparture || new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedArrival: newTripForm.estimatedArrival || new Date().toISOString().replace('T', ' ').substring(0, 16),
      currentLocationGps: 'Plant Dispatch Staging Yard',
      currentCheckpoint: 'Dock Gate 01',
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTrips([newTrip, ...trips]);
    setIsScheduleModalOpen(false);
    setNewTripForm({
      vehicleNumber: '',
      driverName: '',
      driverPhone: '',
      carrierName: '',
      routePlan: '',
      plannedDeparture: '',
      estimatedArrival: '',
    });
  };

  const openPodModal = (trip: DeliveryTripItem) => {
    setSelectedTrip(trip);
    setPodSigner(trip.podSignedBy || '');
    setPodRemarks(trip.transitRemarks || '');
    setIsPodModalOpen(true);
  };

  const handleConfirmPod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !podSigner) return;

    setTrips((prev) =>
      prev.map((t) =>
        t.id === selectedTrip.id
          ? {
              ...t,
              status: 'DELIVERED' as TripStatus,
              actualArrival: new Date().toISOString().replace('T', ' ').substring(0, 16),
              podSignedBy: podSigner,
              podTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              proofOfDeliveryUrl: `https://docs.erp.local/pod/POD-${selectedTrip.tripTrackingNumber}.pdf`,
              transitRemarks: podRemarks || 'Customer signature confirmed upon carton count check.',
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
    setIsPodModalOpen(false);
  };

  const handleUpdateStatus = (tripId: string, nextStatus: TripStatus) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              status: nextStatus,
              actualDeparture: nextStatus === 'DISPATCHED' && !t.actualDeparture
                ? new Date().toISOString().replace('T', ' ').substring(0, 16)
                : t.actualDeparture,
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
  };

  const filteredTrips = trips.filter((t) => {
    const matchesFilter = statusFilter === 'ALL' || t.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.tripTrackingNumber.toLowerCase().includes(q) ||
      t.vehicleNumber.toLowerCase().includes(q) ||
      t.driverName.toLowerCase().includes(q) ||
      t.carrierName.toLowerCase().includes(q) ||
      t.routePlan.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/logistics-gate" className="hover:text-cyan-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Logistics
            </Link>
            <span>/</span>
            <span className="text-slate-200">Fleet Trips & Transit Tracking</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Navigation className="h-6 w-6 text-amber-400" />
            Fleet Delivery Trips & GPS Telemetry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            End-to-end shipment transit monitoring, real-time waypoint checkpoints, and digital Proof of Delivery (POD) reconciliation.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/20 transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          Schedule New Transit Trip
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1322] border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tracking #, route, driver, plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {['ALL', 'SCHEDULED', 'DISPATCHED', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span>GPS Cellular Telemetry Feed: Connected</span>
        </div>
      </div>

      {/* Trips Cards & Table */}
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-all rounded-xl p-5 shadow-sm space-y-4"
          >
            {/* Header row of trip card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-white">{trip.tripTrackingNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        trip.status === 'DELIVERED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : trip.status === 'DISPATCHED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Carrier: <span className="text-slate-200 font-medium">{trip.carrierName}</span> &bull; Vehicle: <span className="font-bold text-white">{trip.vehicleNumber}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {trip.status === 'SCHEDULED' && (
                  <button
                    onClick={() => handleUpdateStatus(trip.id, 'DISPATCHED')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium flex items-center gap-1.5"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Dispatch Trip
                  </button>
                )}

                {trip.status === 'DISPATCHED' && (
                  <button
                    onClick={() => openPodModal(trip)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5"
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    Upload POD & Complete
                  </button>
                )}

                {trip.status === 'DELIVERED' && (
                  <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    POD Confirmed by {trip.podSignedBy}
                  </span>
                )}
              </div>
            </div>

            {/* Trip details grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Planned Transit Route</div>
                <div className="text-slate-200 font-medium">{trip.routePlan}</div>
                <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                  Driver: <span className="text-white">{trip.driverName}</span> ({trip.driverPhone})
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Live GPS Telemetry & Waypoint</div>
                <div className="text-amber-400 font-mono text-[11px] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>{trip.currentLocationGps}</span>
                </div>
                <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                  Checkpoint: <span className="text-slate-200">{trip.currentCheckpoint || 'In transit'}</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Schedule & Timestamps</div>
                <div className="text-slate-300 text-[11px]">
                  Dep: {trip.actualDeparture || trip.plannedDeparture}
                </div>
                <div className="text-slate-300 text-[11px]">
                  ETA: <span className="text-cyan-300 font-mono">{trip.actualArrival || trip.estimatedArrival}</span>
                </div>
                {trip.transitRemarks && (
                  <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800 truncate" title={trip.transitRemarks}>
                    &ldquo;{trip.transitRemarks}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trip Scheduling Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-semibold text-white">Schedule New Delivery Trip</h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle License Plate *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-12-QW-9901"
                    value={newTripForm.vehicleNumber}
                    onChange={(e) => setNewTripForm({ ...newTripForm, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white uppercase focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Carrier / Transporter Name</label>
                  <input
                    type="text"
                    placeholder="Logistics company"
                    value={newTripForm.carrierName}
                    onChange={(e) => setNewTripForm({ ...newTripForm, carrierName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Driver Name</label>
                  <input
                    type="text"
                    placeholder="Driver name"
                    value={newTripForm.driverName}
                    onChange={(e) => setNewTripForm({ ...newTripForm, driverName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Driver Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 XXXXX XXXXX"
                    value={newTripForm.driverPhone}
                    onChange={(e) => setNewTripForm({ ...newTripForm, driverPhone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Planned Route & Transit Corridors *</label>
                <input
                  type="text"
                  required
                  placeholder="Origin -> Highway Waypoints -> Destination Depot"
                  value={newTripForm.routePlan}
                  onChange={(e) => setNewTripForm({ ...newTripForm, routePlan: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Planned Departure Time</label>
                  <input
                    type="datetime-local"
                    value={newTripForm.plannedDeparture}
                    onChange={(e) => setNewTripForm({ ...newTripForm, plannedDeparture: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Arrival (ETA)</label>
                  <input
                    type="datetime-local"
                    value={newTripForm.estimatedArrival}
                    onChange={(e) => setNewTripForm({ ...newTripForm, estimatedArrival: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium shadow-md shadow-amber-600/30"
                >
                  Save & Initialize GPS Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof of Delivery (POD) Modal */}
      {isPodModalOpen && selectedTrip && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Upload & Confirm Proof of Delivery (POD)</h3>
              </div>
              <button
                onClick={() => setIsPodModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Trip Tracking #:</span>
                <span className="text-amber-400 font-mono font-bold">{selectedTrip.tripTrackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle / Driver:</span>
                <span className="text-white">{selectedTrip.vehicleNumber} ({selectedTrip.driverName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route:</span>
                <span className="text-slate-300 truncate max-w-[280px]">{selectedTrip.routePlan}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmPod} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recipient Signatory Name & Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. V. Sundaram (Logistics Head, Peenya Depot)"
                  value={podSigner}
                  onChange={(e) => setPodSigner(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Digital Scanned Copy / POD Receipt Reference
                </label>
                <div className="p-3 border border-dashed border-slate-700 rounded-lg text-center cursor-pointer hover:border-emerald-500/60 bg-slate-900/50">
                  <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-300">Click to attach signed delivery acknowledgement</span>
                  <span className="text-[10px] text-slate-500 block">PDF, PNG, or JPG up to 15MB</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Receiving Remarks & Condition</label>
                <textarea
                  rows={2}
                  placeholder="Cartons received intact, seal verified, zero damage..."
                  value={podRemarks}
                  onChange={(e) => setPodRemarks(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPodModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/30"
                >
                  Verify POD & Complete Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

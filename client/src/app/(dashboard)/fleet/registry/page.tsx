'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  Gauge,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Fuel,
  Wrench,
  Navigation,
  FileCheck,
  Calendar,
  Layers,
  MapPin,
  RefreshCw,
  Check,
  X,
  CreditCard,
  Radio,
} from 'lucide-react';
import { FleetVehicleItem, VehicleType, VehicleStatus, FuelType } from '@/types/fleet';

const INITIAL_VEHICLES: FleetVehicleItem[] = [
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
    gpsImei: 'IMEI-86392019482',
    purchaseDate: '2024-03-15T00:00:00.000Z',
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
    gpsImei: 'IMEI-86392019483',
    purchaseDate: '2023-08-20T00:00:00.000Z',
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
    gpsImei: 'IMEI-86392019484',
    purchaseDate: '2024-02-10T00:00:00.000Z',
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
    gpsImei: 'IMEI-86392019485',
    purchaseDate: '2025-01-05T00:00:00.000Z',
    insurancePolicyExpiry: '2027-01-20T00:00:00.000Z',
    pucExpiry: null,
    fitnessExpiry: '2027-05-15T00:00:00.000Z',
    roadTaxExpiry: null,
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'flt-5',
    vehicleNumber: 'KA-03-MM-9104',
    fleetCode: 'FLT-CAR-0005',
    modelName: 'Innova Crysta 2.4 VX',
    make: 'Toyota',
    year: 2023,
    vehicleType: 'PASSENGER_CAR',
    status: 'AVAILABLE',
    fuelType: 'DIESEL',
    payloadCapacityKg: 650,
    totalOdometerKm: 58900,
    assignedDriver: 'Vinod Hegde',
    fastagTagId: 'FTG-9012-KA',
    fuelCardNumber: 'FC-99120-005',
    gpsImei: 'IMEI-86392019486',
    purchaseDate: '2023-04-12T00:00:00.000Z',
    insurancePolicyExpiry: '2027-04-10T00:00:00.000Z',
    pucExpiry: '2027-01-15T00:00:00.000Z',
    fitnessExpiry: '2028-04-11T00:00:00.000Z',
    roadTaxExpiry: '2028-04-11T00:00:00.000Z',
    createdAt: '2023-05-01T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
];

export default function FleetRegistryPage() {
  const [vehicles, setVehicles] = useState<FleetVehicleItem[]>(INITIAL_VEHICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicleItem | null>(INITIAL_VEHICLES[0]);
  const [isLoading, setIsLoading] = useState(false);

  // New Vehicle Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    fleetCode: '',
    modelName: '',
    make: 'Tata Motors',
    year: '2025',
    vehicleType: 'HEAVY_TRUCK',
    status: 'AVAILABLE',
    fuelType: 'DIESEL',
    payloadCapacityKg: '16000',
    totalOdometerKm: '0',
    assignedDriver: '',
    fastagTagId: '',
    fuelCardNumber: '',
    gpsImei: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/fleet/vehicles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setVehicles(data);
          setSelectedVehicle(data[0]);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        fleetCode: formData.fleetCode || undefined,
        modelName: formData.modelName,
        make: formData.make,
        year: Number(formData.year) || 2025,
        vehicleType: formData.vehicleType,
        status: formData.status,
        fuelType: formData.fuelType,
        payloadCapacityKg: Number(formData.payloadCapacityKg) || 0,
        totalOdometerKm: Number(formData.totalOdometerKm) || 0,
        assignedDriver: formData.assignedDriver || null,
        fastagTagId: formData.fastagTagId || null,
        fuelCardNumber: formData.fuelCardNumber || null,
        gpsImei: formData.gpsImei || null,
      };

      const res = await fetch('/api/v1/fleet/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setVehicles((prev) => [created, ...prev]);
        setSelectedVehicle(created);
        setShowAddModal(false);
      } else {
        // Fallback local update
        const fakeCreated: FleetVehicleItem = {
          id: `flt-${Date.now()}`,
          ...payload,
          vehicleType: payload.vehicleType as VehicleType,
          status: payload.status as VehicleStatus,
          fuelType: payload.fuelType as FuelType,
          fleetCode: payload.fleetCode || `FLT-${payload.vehicleType.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setVehicles((prev) => [fakeCreated, ...prev]);
        setSelectedVehicle(fakeCreated);
        setShowAddModal(false);
      }
    } catch {
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (vehicleId: string, newStatus: VehicleStatus) => {
    try {
      await fetch(`/api/v1/fleet/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v)),
      );
      if (selectedVehicle?.id === vehicleId) {
        setSelectedVehicle((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch {
      // Local update
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v)),
      );
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.fleetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.assignedDriver && v.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'ALL' || v.vehicleType === filterType;
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Gauge className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              Asset Registry & Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Commercial Fleet Inventory Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain technical engine specs, Fastag credentials, GPS IMEI tags, and driver trip allocations for company assets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchVehicles}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-600/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Register Vehicle
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search registration, fleet code, driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Types</option>
              <option value="HEAVY_TRUCK">Heavy Trucks</option>
              <option value="MEDIUM_TRUCK">Medium Trucks</option>
              <option value="DELIVERY_VAN">Delivery Vans</option>
              <option value="PICKUP_UTILITY">Pickup Utility</option>
              <option value="PASSENGER_CAR">Passenger Cars</option>
              <option value="ELECTRIC_FORKLIFT">Electric Forklifts</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_TRIP">On Trip</option>
              <option value="IN_MAINTENANCE">In Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area: Split List and Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles Table / Card List (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          {filteredVehicles.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-500 text-xs">
              No commercial vehicles match the selected criteria.
            </div>
          ) : (
            filteredVehicles.map((vehicle) => {
              const isSelected = selectedVehicle?.id === vehicle.id;
              return (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-md shadow-emerald-950/40'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-800/80 text-emerald-400 border border-slate-700/60">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white font-mono">
                            {vehicle.vehicleNumber}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                            {vehicle.fleetCode}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          {vehicle.make} {vehicle.modelName} ({vehicle.year})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          vehicle.status === 'AVAILABLE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : vehicle.status === 'ON_TRIP'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : vehicle.status === 'IN_MAINTENANCE'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {vehicle.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Payload Capacity</span>
                      <span className="text-slate-200 font-medium">
                        {(vehicle.payloadCapacityKg / 1000).toFixed(1)} MT ({vehicle.payloadCapacityKg.toLocaleString()} kg)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Odometer Log</span>
                      <span className="text-slate-200 font-mono font-medium">
                        {vehicle.totalOdometerKm.toLocaleString()} km
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Driver Assigned</span>
                      <span className="text-slate-200 font-medium truncate block">
                        {vehicle.assignedDriver || 'None Assigned'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Fuel Type</span>
                      <span className="text-slate-200 font-medium">{vehicle.fuelType}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Vehicle Detail Drawer (1 col) */}
        <div className="space-y-4">
          {selectedVehicle ? (
            <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Vehicle Telemetry Dossier
                  </span>
                  <h3 className="text-base font-bold text-white font-mono mt-0.5">
                    {selectedVehicle.vehicleNumber}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400">{selectedVehicle.fleetCode}</span>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Operational State Transition</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['AVAILABLE', 'ON_TRIP', 'IN_MAINTENANCE', 'OUT_OF_SERVICE'] as VehicleStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedVehicle.id, st)}
                      className={`px-2 py-1.5 text-[10px] font-semibold rounded-lg border transition-all ${
                        selectedVehicle.status === st
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardware & Statutory Credentials */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Radio className="h-3.5 w-3.5 text-emerald-400" />
                    <span>GPS Telematics IMEI:</span>
                  </div>
                  <span className="font-mono text-slate-200 text-[11px]">
                    {selectedVehicle.gpsImei || 'Not Installed'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                    <span>Fastag RFID Tag:</span>
                  </div>
                  <span className="font-mono text-slate-200 text-[11px]">
                    {selectedVehicle.fastagTagId || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Fuel className="h-3.5 w-3.5 text-purple-400" />
                    <span>Fuel Fleet Card:</span>
                  </div>
                  <span className="font-mono text-slate-200 text-[11px]">
                    {selectedVehicle.fuelCardNumber || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Expiry Deadlines */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                <div className="text-[11px] font-semibold text-slate-300 mb-1">Statutory Expirations</div>
                <div className="flex justify-between text-slate-400">
                  <span>Insurance Policy:</span>
                  <span className="text-slate-200 font-mono">
                    {selectedVehicle.insurancePolicyExpiry ? new Date(selectedVehicle.insurancePolicyExpiry).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>PUC Certificate:</span>
                  <span className="text-slate-200 font-mono">
                    {selectedVehicle.pucExpiry ? new Date(selectedVehicle.pucExpiry).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fitness Certificate:</span>
                  <span className="text-slate-200 font-mono">
                    {selectedVehicle.fitnessExpiry ? new Date(selectedVehicle.fitnessExpiry).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Road Tax Clearance:</span>
                  <span className="text-slate-200 font-mono">
                    {selectedVehicle.roadTaxExpiry ? new Date(selectedVehicle.roadTaxExpiry).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <Link
                  href="/fleet/maintenance"
                  className="px-2.5 py-2 text-center text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Log Service
                </Link>
                <Link
                  href="/fleet/assignments"
                  className="px-2.5 py-2 text-center text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  Dispatch Route
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-500 text-xs">
              Select a vehicle to inspect technical specs and operational status.
            </div>
          )}
        </div>
      </div>

      {/* Register Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Register Commercial Vehicle</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Registration Plate (Required)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KA-04-ME-9022"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Fleet Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={formData.fleetCode}
                    onChange={(e) => setFormData({ ...formData, fleetCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Make / Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Signa 2823.K Tipper"
                    value={formData.modelName}
                    onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Vehicle Classification</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="HEAVY_TRUCK">Heavy Truck</option>
                    <option value="MEDIUM_TRUCK">Medium Truck</option>
                    <option value="DELIVERY_VAN">Delivery Van</option>
                    <option value="PICKUP_UTILITY">Pickup Utility</option>
                    <option value="PASSENGER_CAR">Passenger Car</option>
                    <option value="ELECTRIC_FORKLIFT">Electric Forklift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DIESEL">Diesel</option>
                    <option value="PETROL">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Payload Capacity (kg)</label>
                  <input
                    type="number"
                    value={formData.payloadCapacityKg}
                    onChange={(e) => setFormData({ ...formData, payloadCapacityKg: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Initial Odometer (km)</label>
                  <input
                    type="number"
                    value={formData.totalOdometerKm}
                    onChange={(e) => setFormData({ ...formData, totalOdometerKm: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Assigned Driver (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Rameshwar Patil"
                    value={formData.assignedDriver}
                    onChange={(e) => setFormData({ ...formData, assignedDriver: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Fastag Tag ID</label>
                  <input
                    type="text"
                    placeholder="e.g. FTG-9988-KA"
                    value={formData.fastagTagId}
                    onChange={(e) => setFormData({ ...formData, fastagTagId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Fuel Card Number</label>
                  <input
                    type="text"
                    placeholder="e.g. FC-8841-001"
                    value={formData.fuelCardNumber}
                    onChange={(e) => setFormData({ ...formData, fuelCardNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">GPS Telematics IMEI</label>
                  <input
                    type="text"
                    placeholder="e.g. IMEI-86392019489"
                    value={formData.gpsImei}
                    onChange={(e) => setFormData({ ...formData, gpsImei: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Registering...' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

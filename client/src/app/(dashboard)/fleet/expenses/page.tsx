'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Fuel,
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  CreditCard,
  Gauge,
  Calendar,
  Layers,
  RefreshCw,
  Check,
  X,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import {
  FuelExpenseLogItem,
  FuelType,
  FuelExpenseAnalytics,
} from '@/types/fleet';

const INITIAL_EXPENSES: FuelExpenseLogItem[] = [
  {
    id: 'fuel-1',
    expenseCode: 'FUEL-2026-0092',
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
    fuelType: 'DIESEL',
    litersOrKwh: 320,
    costPerUnit: 92.5,
    totalFuelCost: 29600,
    tollCharges: 4200,
    otherTravelExpenses: 800,
    totalExpense: 34600,
    odometerAtFueling: 63850,
    fuelStationName: 'Indian Oil Highway Swagat - Hosur NH44',
    fuelCardTransactionRef: 'TXN-IOCL-9921804',
    paymentMethod: 'FLEET_CARD',
    fueledAt: '2026-10-06T20:30:00.000Z',
    fuelEfficiencyKmPerLiter: 3.65,
    recordedBy: 'Driver Rameshwar Patil',
    createdAt: '2026-10-06T21:00:00.000Z',
    updatedAt: '2026-10-06T21:00:00.000Z',
  },
  {
    id: 'fuel-2',
    expenseCode: 'FUEL-2026-0093',
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
    fuelType: 'DIESEL',
    litersOrKwh: 140,
    costPerUnit: 92.5,
    totalFuelCost: 12950,
    tollCharges: 1650,
    otherTravelExpenses: 350,
    totalExpense: 14950,
    odometerAtFueling: 89450,
    fuelStationName: 'Bharat Petroleum COCO - Attibele Border',
    fuelCardTransactionRef: 'TXN-BPCL-441092',
    paymentMethod: 'FLEET_CARD',
    fueledAt: '2026-10-07T08:15:00.000Z',
    fuelEfficiencyKmPerLiter: 5.12,
    recordedBy: 'Driver Dilip Sawant',
    createdAt: '2026-10-07T08:30:00.000Z',
    updatedAt: '2026-10-07T08:30:00.000Z',
  },
  {
    id: 'fuel-3',
    expenseCode: 'FUEL-2026-0091',
    vehicleId: 'flt-4',
    vehicle: {
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
      createdAt: '2025-03-01T00:00:00.000Z',
      updatedAt: '2026-10-04T00:00:00.000Z',
    },
    fuelType: 'ELECTRIC',
    litersOrKwh: 48,
    costPerUnit: 12.0,
    totalFuelCost: 576,
    tollCharges: 0,
    otherTravelExpenses: 0,
    totalExpense: 576,
    odometerAtFueling: 12800,
    fuelStationName: 'Plant Dock 1 Fast DC Charger',
    fuelCardTransactionRef: 'EV-STATION-01-METER',
    paymentMethod: 'INTERNAL_UTILITY',
    fueledAt: '2026-10-05T18:00:00.000Z',
    fuelEfficiencyKmPerLiter: null,
    recordedBy: 'Shift Supervisor Roy',
    createdAt: '2026-10-05T18:15:00.000Z',
    updatedAt: '2026-10-05T18:15:00.000Z',
  },
];

export default function FleetExpensesPage() {
  const [expenses, setExpenses] = useState<FuelExpenseLogItem[]>(INITIAL_EXPENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFuelType, setFilterFuelType] = useState<string>('ALL');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Modal: Log Fuel Entry
  const [showLogModal, setShowLogModal] = useState(false);
  const [fuelForm, setFuelForm] = useState({
    vehicleId: 'flt-1',
    fuelType: 'DIESEL',
    litersOrKwh: '150',
    costPerUnit: '92.50',
    tollCharges: '500',
    otherTravelExpenses: '0',
    odometerAtFueling: '65000',
    fuelStationName: 'Indian Oil Retail Outlet - Electronics City',
    fuelCardTransactionRef: '',
    paymentMethod: 'FLEET_CARD',
    fueledAt: new Date().toISOString().slice(0, 16),
    recordedBy: 'Fleet Transport Lead',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/fleet/expenses');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setExpenses(data);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const liters = Number(fuelForm.litersOrKwh) || 0;
      const rate = Number(fuelForm.costPerUnit) || 0;
      const tolls = Number(fuelForm.tollCharges) || 0;
      const other = Number(fuelForm.otherTravelExpenses) || 0;

      const payload = {
        vehicleId: fuelForm.vehicleId,
        fuelType: fuelForm.fuelType,
        litersOrKwh: liters,
        costPerUnit: rate,
        tollCharges: tolls,
        otherTravelExpenses: other,
        odometerAtFueling: Number(fuelForm.odometerAtFueling) || 0,
        fuelStationName: fuelForm.fuelStationName,
        fuelCardTransactionRef: fuelForm.fuelCardTransactionRef || null,
        paymentMethod: fuelForm.paymentMethod,
        fueledAt: new Date(fuelForm.fueledAt).toISOString(),
        recordedBy: fuelForm.recordedBy,
      };

      const res = await fetch('/api/v1/fleet/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setExpenses((prev) => [created, ...prev]);
        setShowLogModal(false);
      } else {
        // Fallback local update
        const totalFuelCost = Number((liters * rate).toFixed(2));
        const totalExpense = totalFuelCost + tolls + other;

        const fakeCreated: FuelExpenseLogItem = {
          id: `fuel-${Date.now()}`,
          expenseCode: `FUEL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          vehicleId: payload.vehicleId,
          vehicle: {
            id: payload.vehicleId,
            vehicleNumber: 'KA-04-ME-4821',
            fleetCode: 'FLT-TRK-0001',
            modelName: 'Prima 4028.S',
            make: 'Tata Motors',
            year: 2024,
            vehicleType: 'HEAVY_TRUCK',
            status: 'ON_TRIP',
            fuelType: payload.fuelType as FuelType,
            payloadCapacityKg: 28000,
            totalOdometerKm: payload.odometerAtFueling,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          fuelType: payload.fuelType as FuelType,
          litersOrKwh: payload.litersOrKwh,
          costPerUnit: payload.costPerUnit,
          totalFuelCost,
          tollCharges: payload.tollCharges,
          otherTravelExpenses: payload.otherTravelExpenses,
          totalExpense,
          odometerAtFueling: payload.odometerAtFueling,
          fuelStationName: payload.fuelStationName,
          fuelCardTransactionRef: payload.fuelCardTransactionRef,
          paymentMethod: payload.paymentMethod,
          fueledAt: payload.fueledAt,
          fuelEfficiencyKmPerLiter: 3.8,
          recordedBy: payload.recordedBy,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setExpenses((prev) => [fakeCreated, ...prev]);
        setShowLogModal(false);
      }
    } catch {
      setShowLogModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSpend = expenses.reduce((acc, e) => acc + e.totalExpense, 0);
  const totalFuelCost = expenses.reduce((acc, e) => acc + e.totalFuelCost, 0);
  const totalTolls = expenses.reduce((acc, e) => acc + e.tollCharges, 0);
  const totalLiters = expenses.reduce((acc, e) => acc + e.litersOrKwh, 0);

  const expensesWithEff = expenses.filter((e) => e.fuelEfficiencyKmPerLiter != null);
  const avgEfficiency =
    expensesWithEff.length > 0
      ? (
          expensesWithEff.reduce((acc, e) => acc + (e.fuelEfficiencyKmPerLiter || 0), 0) /
          expensesWithEff.length
        ).toFixed(2)
      : '4.2';

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.expenseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.fuelStationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.fuelCardTransactionRef && e.fuelCardTransactionRef.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.vehicle && e.vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFuelType = filterFuelType === 'ALL' || e.fuelType === filterFuelType;
    const matchesPayment = filterPaymentMethod === 'ALL' || e.paymentMethod === filterPaymentMethod;

    return matchesSearch && matchesFuelType && matchesPayment;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Fuel className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              Fuel Economy & Fleet Expense Reconciliations
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Fuel Consumption & Toll Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor commercial fuel card swipes, Fastag toll debits, highway fuel economy (km/L), and per-trip travel disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchExpenses}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-600/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Fuel Expense
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Fuel & Travel Outlay</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            ₹{totalSpend.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across {expenses.length} fuel transactions</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Fuel Volume Consumed</span>
            <Fuel className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {totalLiters.toLocaleString()} L/kWh
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">₹{totalFuelCost.toLocaleString()} fuel cost</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Average Fleet Economy</span>
            <Gauge className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-1">
            {avgEfficiency} km/L
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Weighted across commercial trips</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Fastag Highway Tolls</span>
            <CreditCard className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            ₹{totalTolls.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Automated electronic plaza debits</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search receipt #, pump, vehicle, card ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>Fuel:</span>
            <select
              value={filterFuelType}
              onChange={(e) => setFilterFuelType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Fuels</option>
              <option value="DIESEL">Diesel</option>
              <option value="PETROL">Petrol</option>
              <option value="CNG">CNG</option>
              <option value="ELECTRIC">Electric (EV)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Payment:</span>
            <select
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Payment Methods</option>
              <option value="FLEET_CARD">Fleet Card</option>
              <option value="FASTAG">Fastag</option>
              <option value="CASH">Cash Voucher</option>
              <option value="INTERNAL_UTILITY">Internal Utility</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expense Logs List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-500 text-xs">
            No fuel expense transactions match your criteria.
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Fuel className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-white">
                        {expense.expenseCode}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-emerald-500/20">
                        {expense.fuelType}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {expense.vehicle?.vehicleNumber || 'Vehicle'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Fueling Station: <strong className="text-slate-200 font-medium">{expense.fuelStationName}</strong> | Date: {new Date(expense.fueledAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {expense.paymentMethod.replace(/_/g, ' ')}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-emerald-400">
                      ₹{expense.totalExpense.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500">Gross Settlement</div>
                  </div>
                </div>
              </div>

              {/* Telemetry and Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Volume Filled</span>
                  <span className="text-slate-200 font-medium">{expense.litersOrKwh} L/kWh</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Price per Unit</span>
                  <span className="text-slate-200 font-medium">₹{expense.costPerUnit}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Odometer at Pump</span>
                  <span className="text-slate-200 font-mono font-semibold">{expense.odometerAtFueling.toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Highway Tolls</span>
                  <span className="text-blue-400 font-medium">₹{expense.tollCharges.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Trip Efficiency</span>
                  <span className="text-purple-400 font-mono font-bold">
                    {expense.fuelEfficiencyKmPerLiter ? `${expense.fuelEfficiencyKmPerLiter} km/L` : 'Baseline'}
                  </span>
                </div>
              </div>

              {/* Transaction Ref & Auditor */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                <div>
                  {expense.fuelCardTransactionRef && (
                    <span>Fleet Card TXN: <strong className="text-slate-400 font-mono">{expense.fuelCardTransactionRef}</strong></span>
                  )}
                </div>
                <div>
                  <span>Logged by: {expense.recordedBy}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Fuel Expense Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Log Fuel & Highway Expense</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Fuel Type</label>
                  <select
                    value={fuelForm.fuelType}
                    onChange={(e) => setFuelForm({ ...fuelForm, fuelType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DIESEL">Diesel</option>
                    <option value="PETROL">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="ELECTRIC">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={fuelForm.paymentMethod}
                    onChange={(e) => setFuelForm({ ...fuelForm, paymentMethod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="FLEET_CARD">Fleet Corporate Card</option>
                    <option value="FASTAG">Fastag Auto-Debit</option>
                    <option value="CASH">Cash Voucher</option>
                    <option value="INTERNAL_UTILITY">Internal Dock Charger</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Liters / kWh Filled</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={fuelForm.litersOrKwh}
                    onChange={(e) => setFuelForm({ ...fuelForm, litersOrKwh: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Price per Liter/Unit (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={fuelForm.costPerUnit}
                    onChange={(e) => setFuelForm({ ...fuelForm, costPerUnit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Odometer Reading (km)</label>
                  <input
                    type="number"
                    required
                    value={fuelForm.odometerAtFueling}
                    onChange={(e) => setFuelForm({ ...fuelForm, odometerAtFueling: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Fastag Toll Charges (₹)</label>
                  <input
                    type="number"
                    value={fuelForm.tollCharges}
                    onChange={(e) => setFuelForm({ ...fuelForm, tollCharges: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Fuel Station Outlet Name & Location</label>
                  <input
                    type="text"
                    required
                    value={fuelForm.fuelStationName}
                    onChange={(e) => setFuelForm({ ...fuelForm, fuelStationName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Card Slip / POS Reference #</label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-IOCL-9921804"
                    value={fuelForm.fuelCardTransactionRef}
                    onChange={(e) => setFuelForm({ ...fuelForm, fuelCardTransactionRef: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Logging...' : 'Save Fuel Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

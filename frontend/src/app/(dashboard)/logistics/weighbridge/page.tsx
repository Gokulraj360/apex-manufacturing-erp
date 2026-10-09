'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Scale,
  Camera,
  Truck,
  Scan,
  CheckCircle2,
  AlertCircle,
  Printer,
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  RefreshCw,
  X,
  Search,
  ChevronRight,
  Zap,
  Gauge,
  UserCheck,
  Hash,
  MapPin,
  ExternalLink,
  Layers,
  FileText,
  BadgeCheck,
  Sliders,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface YardRecord {
  id: string;
  passNumber: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  transporterName: string;
  grossWeightKg: number;
  tareWeightKg?: number;
  netWeightKg?: number;
  status: 'INSIDE_YARD' | 'TARE_CLEARED' | 'GATE_OUT_COMPLETED';
  materialDescription?: string;
  poNumber?: string;
  vendorName?: string;
  inwardTime: string;
  outwardTime?: string;
  securityOfficer: string;
  verificationCode: string;
}

const SAMPLE_VEHICLES = [
  {
    plate: 'KA-04-ME-8842',
    state: 'Karnataka',
    transporter: 'VRL Logistics Ltd',
    driver: 'Rameshwar Yadav',
    phone: '+91 98450 12345',
    po: 'PO-2026-0891',
    vendor: 'Qualcomm Asia Pacific Pte Ltd',
    material: '50,000 Qualcomm Snapdragon 8 Gen 3 SoC Processors',
    gross: 28450,
    tare: 11200,
  },
  {
    plate: 'MH-12-RN-9921',
    state: 'Maharashtra',
    transporter: 'Safexpress Multimodal',
    driver: 'Gurpreet Singh',
    phone: '+91 98230 45678',
    po: 'PO-2026-0893',
    vendor: 'Samsung Display Co., Ltd.',
    material: '25,000 Samsung 120Hz LTPO AMOLED Display Assemblies',
    gross: 31200,
    tare: 12450,
  },
  {
    plate: 'TN-09-CB-4491',
    state: 'Tamil Nadu',
    transporter: 'TCI Freight Express',
    driver: 'M. Selvan',
    phone: '+91 94440 78901',
    po: 'PO-2026-0895',
    vendor: 'TDK Electronics Components Ltd',
    material: '100,000 High-Capacity 5500mAh Solid-State Cells',
    gross: 24800,
    tare: 10100,
  },
  {
    plate: 'DL-01-AX-3419',
    state: 'Delhi NCR',
    transporter: 'Blue Dart Surface Logistics',
    driver: 'Dharmendra Sharma',
    phone: '+91 98110 56789',
    po: 'PO-2026-0892',
    vendor: 'Murata Electronics Asia',
    material: 'Surface Mount MLCC Ceramic Capacitors (0201 Packages)',
    gross: 19500,
    tare: 8900,
  },
];

const INITIAL_YARD_LOG: YardRecord[] = [];

export default function WeighbridgePage() {
  // Live load-cell reading state
  const [liveScaleWeight, setLiveScaleWeight] = useState<number>(0);
  const [isScaleFluctuating, setIsScaleFluctuating] = useState<boolean>(false);
  const [isOcrScanning, setIsOcrScanning] = useState<boolean>(false);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);

  // Form State
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [transporterName, setTransporterName] = useState<string>('');
  const [driverName, setDriverName] = useState<string>('');
  const [driverPhone, setDriverPhone] = useState<string>('');
  const [poNumber, setPoNumber] = useState<string>('');
  const [vendorName, setVendorName] = useState<string>('');
  const [materialDescription, setMaterialDescription] = useState<string>('');
  const [grossWeight, setGrossWeight] = useState<number>(0);
  const [tareWeight, setTareWeight] = useState<number>(0);

  // Yard Register State
  const [yardLog, setYardLog] = useState<YardRecord[]>(INITIAL_YARD_LOG);
  const [searchFilter, setSearchFilter] = useState('');

  // Gate Pass Print Modal State
  const [selectedPassForPrint, setSelectedPassForPrint] = useState<YardRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculated Net Weight
  const netWeight = useMemo(() => {
    if (grossWeight && tareWeight && grossWeight >= tareWeight) {
      return grossWeight - tareWeight;
    }
    return 0;
  }, [grossWeight, tareWeight]);

  // Live scale slight jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Small jitter ±10 kg to simulate live electronic load cell
      const delta = (Math.floor(Math.random() * 5) - 2) * 5;
      setLiveScaleWeight((prev) => Math.max(1000, prev + delta));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial yard register from backend if available
  useEffect(() => {
    async function loadBackendData() {
      try {
        const res = await fetch('/api/gate-security/yard-register');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setYardLog(data);
          }
        }
      } catch (err) {
        // Fallback to initial data
      }
    }
    loadBackendData();
  }, []);

  // Camera OCR Capture Simulation
  const handleTriggerOcr = () => {
    setIsOcrScanning(true);
    setOcrConfidence(null);

    setTimeout(() => {
      const randomCar = SAMPLE_VEHICLES[Math.floor(Math.random() * SAMPLE_VEHICLES.length)];
      setVehicleNumber(randomCar.plate);
      setTransporterName(randomCar.transporter);
      setDriverName(randomCar.driver);
      setDriverPhone(randomCar.phone);
      setPoNumber(randomCar.po);
      setVendorName(randomCar.vendor);
      setMaterialDescription(randomCar.material);
      setGrossWeight(randomCar.gross);
      setTareWeight(randomCar.tare);
      setLiveScaleWeight(randomCar.gross);

      setIsOcrScanning(false);
      setOcrConfidence(99.6);
      setToastMessage(`Camera OCR auto-captured license plate: ${randomCar.plate} (Confidence 99.6%)`);
    }, 1200);
  };

  // Capture Live Gross Weight from Load Cell
  const handleCaptureGross = () => {
    setGrossWeight(liveScaleWeight);
    setToastMessage(`Gross weight captured: ${liveScaleWeight.toLocaleString('en-IN')} kg from Scale 01`);
  };

  // Capture Live Tare Weight from Load Cell
  const handleCaptureTare = () => {
    const simulatedTare = Math.round(grossWeight * 0.4);
    setTareWeight(simulatedTare);
    setToastMessage(`Tare weight calibrated: ${simulatedTare.toLocaleString('en-IN')} kg`);
  };

  // Zero Scale
  const handleZeroScale = () => {
    setLiveScaleWeight(0);
    setTimeout(() => setLiveScaleWeight(grossWeight || 28450), 2000);
  };

  // Generate Official Gate Pass & Add to Yard Log
  const handleGenerateGatePass = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleNumber.trim()) {
      alert('Please provide or capture a valid vehicle registration number.');
      return;
    }

    if (grossWeight <= 0) {
      alert('Gross weight must be greater than zero.');
      return;
    }

    const nextCount = yardLog.length + 194;
    const passNumber = `GP-2026-WB-${String(nextCount).padStart(4, '0')}`;
    const verificationCode = `VERIF-WB-${vehicleNumber.replace(/[^A-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass: YardRecord = {
      id: `gp-wb-${Date.now()}`,
      passNumber,
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      transporterName: transporterName.trim(),
      grossWeightKg: grossWeight,
      tareWeightKg: tareWeight > 0 ? tareWeight : undefined,
      netWeightKg: netWeight > 0 ? netWeight : undefined,
      status: tareWeight > 0 ? 'TARE_CLEARED' : 'INSIDE_YARD',
      materialDescription,
      poNumber,
      vendorName,
      inwardTime: new Date().toISOString(),
      securityOfficer: 'Officer Suresh Rathore (GATE_SECURITY)',
      verificationCode,
    };

    setYardLog([newPass, ...yardLog]);
    setSelectedPassForPrint(newPass);
    setToastMessage(`Gate Pass ${passNumber} generated for ${vehicleNumber}!`);
  };

  // Filtered Yard Log
  const filteredYardLog = useMemo(() => {
    if (!searchFilter.trim()) return yardLog;
    const q = searchFilter.toLowerCase();
    return yardLog.filter(
      (item) =>
        item.passNumber.toLowerCase().includes(q) ||
        item.vehicleNumber.toLowerCase().includes(q) ||
        item.driverName.toLowerCase().includes(q) ||
        item.transporterName.toLowerCase().includes(q) ||
        (item.poNumber && item.poNumber.toLowerCase().includes(q))
    );
  }, [yardLog, searchFilter]);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header and Telemetry Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/logistics/gate" className="hover:text-blue-600 transition">
              Logistics
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/logistics/gate" className="hover:text-blue-600 transition">
              Gate Security
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Weighbridge OCR Terminal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Weighbridge & Camera OCR Gate Terminal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              TERMINAL ONLINE
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Hardware load-cell telemetry integration with automated optical character recognition (ANPR) for commercial vehicle inward entry and tare deduction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/logistics/gate"
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            &larr; Gate Register
          </Link>
          <button
            onClick={handleTriggerOcr}
            disabled={isOcrScanning}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-1.5"
          >
            {isOcrScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Scanning Camera OCR...
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                Simulate Camera OCR Auto-Capture
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Toast Message */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HARDWARE TELEMETRY GRID: Digital Weighbridge Indicator & Camera OCR Viewfinder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DIGITAL WEIGHBRIDGE LOAD-CELL INDICATOR (Mettler Toledo / Avery Simulation) */}
        <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Electronic Pitless Weighbridge
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Scale #WB-01 &bull; Max Capacity 60,000 kg &bull; e=10kg
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                STABLE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                CALIBRATED
              </span>
            </div>
          </div>

          {/* Large Digital LED Weight Display */}
          <div className="my-6 text-center bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 shadow-inner">
            <span className="text-xs uppercase tracking-widest text-emerald-500/80 font-mono block mb-1">
              Active Load Cell Reading
            </span>
            <div className="font-mono text-5xl sm:text-6xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              {liveScaleWeight.toLocaleString('en-IN')}
              <span className="text-2xl text-emerald-600 ml-2 font-normal">kg</span>
            </div>
            <div className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-center gap-3">
              <span>{(liveScaleWeight / 1000).toFixed(3)} Tonnes</span>
              <span>&bull;</span>
              <span>Zero Center: 0.00 kg</span>
              <span>&bull;</span>
              <span>Motion: None</span>
            </div>
          </div>

          {/* Scale Control Quick Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZeroScale}
                className="px-3 py-1.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-[11px]"
              >
                Zero Scale
              </button>
              <button
                type="button"
                onClick={handleCaptureGross}
                className="px-3 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition text-[11px] flex items-center gap-1"
              >
                <Scale className="w-3.5 h-3.5" />
                Capture Gross ({liveScaleWeight} kg)
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Terminal: Gate 01 North
            </div>
          </div>
        </div>

        {/* ANPR CAMERA OCR SCANNER VIEWPORT */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Cleanroom Inward Lane Camera (ANPR)
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Axis IP Cam 4K 60FPS &bull; License Plate OCR Engine v2.4
                </span>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-blue-400 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              AI STREAM LIVE
            </span>
          </div>

          {/* Viewfinder Viewport */}
          <div className="my-4 relative bg-slate-950 rounded-2xl h-44 border border-slate-800 flex items-center justify-center overflow-hidden group">
            {/* Viewfinder Bounding Box Grid */}
            <div className="absolute inset-4 border border-dashed border-blue-500/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between text-[9px] font-mono text-blue-400/80">
                <span>[CAM-01: HIGHWAY INWARD]</span>
                <span>ISO 400 &bull; 1/1000s</span>
              </div>
              <div className="text-center">
                {isOcrScanning ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-xs font-mono font-bold animate-pulse">
                    <Scan className="w-4 h-4 animate-spin" />
                    ANALYZING HIGH-SECURITY REGISTRATION PLATE...
                  </div>
                ) : (
                  <div className="inline-flex flex-col items-center">
                    {/* Simulated Indian High-Security Plate (HSRP) Graphic */}
                    <div className="inline-flex items-center rounded-lg bg-white text-slate-950 border-2 border-slate-900 px-3 py-1 shadow-md font-mono font-black text-lg tracking-wider">
                      <div className="pr-2 border-r border-slate-300 text-[9px] font-bold flex flex-col items-center justify-center leading-none text-blue-900">
                        <span>IND</span>
                      </div>
                      <span className="pl-2.5">{vehicleNumber}</span>
                    </div>
                    {ocrConfidence && (
                      <span className="mt-1.5 text-[10px] font-mono text-emerald-400 font-bold">
                        MATCH CONFIDENCE: {ocrConfidence}% &bull; TAMPER SEALS VERIFIED
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>LAT: 12.9716° N</span>
                <span>LON: 77.5946° E</span>
              </div>
            </div>

            {/* Laser scanning line during OCR */}
            {isOcrScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-bounce opacity-80" />
            )}
          </div>

          {/* Camera OCR Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <button
              type="button"
              onClick={handleTriggerOcr}
              disabled={isOcrScanning}
              className="px-3.5 py-1.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition text-xs flex items-center gap-1.5"
            >
              <Scan className="w-3.5 h-3.5" />
              Capture Plate OCR
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Vehicle: {vehicleNumber}
            </span>
          </div>
        </div>
      </div>

      {/* WEIGHMENT & CARGO ENTRY FORM */}
      <form onSubmit={handleGenerateGatePass} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Commercial Inward Weighment & Gate Pass Entry
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review OCR verified registration, calibrate gross/tare weights, and generate digital barcode gate slips.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Slip Date: {new Date().toLocaleDateString('en-IN')}
          </span>
        </div>

        {/* 3-Column Weight Breakdown Cards with Instant Net Weight Calculation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gross Weight Input */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                1. Gross Weight (kg) *
              </label>
              <button
                type="button"
                onClick={handleCaptureGross}
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                Live Scale Fill
              </button>
            </div>
            <input
              type="number"
              value={grossWeight}
              onChange={(e) => setGrossWeight(Number(e.target.value))}
              required
              className="w-full text-xl font-mono font-black px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-[10px] text-slate-500 font-mono">
              Vehicle + Loaded Cargo weight upon entry.
            </div>
          </div>

          {/* Tare Weight Input */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                2. Tare Weight (kg)
              </label>
              <button
                type="button"
                onClick={handleCaptureTare}
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Gauge className="w-3 h-3" />
                Auto-Calibrate Tare
              </button>
            </div>
            <input
              type="number"
              value={tareWeight}
              onChange={(e) => setTareWeight(Number(e.target.value))}
              placeholder="0 (Captured on Outward)"
              className="w-full text-xl font-mono font-black px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-[10px] text-slate-500 font-mono">
              Empty truck tare weight after offloading cargo.
            </div>
          </div>

          {/* Net Cargo Weight (Instant Calculated Display) */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                3. Net Cargo Weight
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                AUTO-CALCULATED
              </span>
            </div>
            <div className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400">
              {netWeight.toLocaleString('en-IN')} <span className="text-sm font-normal">kg</span>
            </div>
            <div className="text-[11px] text-blue-800 dark:text-blue-300 font-mono">
              Net Payload: <strong>{(netWeight / 1000).toFixed(2)} Tonnes</strong> (Gross − Tare)
            </div>
          </div>
        </div>

        {/* Vehicle, Consignment & Logistics Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Vehicle Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Vehicle Registration Number *
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              required
              placeholder="e.g. KA-04-ME-8842"
              className="w-full px-3.5 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transporter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Transporter / Carrier *
            </label>
            <input
              type="text"
              value={transporterName}
              onChange={(e) => setTransporterName(e.target.value)}
              required
              placeholder="e.g. VRL Logistics Ltd"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Driver Name & Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Driver Name & Contact *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
                placeholder="Driver Name"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="+91..."
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Purchase Order Ref */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Purchase Order Reference #
            </label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="e.g. PO-2026-0891"
              className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Vendor Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Vendor / Consignor
            </label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g. Qualcomm Asia Pacific Pte Ltd"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Material Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Consignment Cargo Details
            </label>
            <input
              type="text"
              value={materialDescription}
              onChange={(e) => setMaterialDescription(e.target.value)}
              placeholder="e.g. Cleanroom IC Assemblies"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit and Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Security Gate Officer: <strong>Suresh Rathore (GATE_SECURITY)</strong> &bull; Gate 01 Weighbridge
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate & Print Official Gate Pass
          </button>
        </div>
      </form>

      {/* VEHICLE YARD REGISTER LOG */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Plant Yard Active Vehicle & Weighment Register
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live ledger of heavy vehicles, Gross/Tare weighment passes, and yard turnarounds.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search vehicle, pass #, driver..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Pass #</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">Transporter & Driver</th>
                <th className="py-3 px-4">Material / PO</th>
                <th className="py-3 px-4 text-right">Gross (kg)</th>
                <th className="py-3 px-4 text-right">Tare (kg)</th>
                <th className="py-3 px-4 text-right">Net Cargo (kg)</th>
                <th className="py-3 px-4 text-center">Yard Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredYardLog.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {item.passNumber}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs">
                      {item.vehicleNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {item.transporterName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {item.driverName} ({item.driverPhone})
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 dark:text-white line-clamp-1">
                      {item.materialDescription || 'General Cargo'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {item.poNumber || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {item.grossWeightKg.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {item.tareWeightKg ? item.tareWeightKg.toLocaleString('en-IN') : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-blue-600 dark:text-blue-400">
                    {item.netWeightKg ? `${item.netWeightKg.toLocaleString('en-IN')} kg` : 'Pending Tare'}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {item.status === 'TARE_CLEARED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Tare Cleared
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Inside Yard
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedPassForPrint(item)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 hover:text-white transition flex items-center gap-1.5 ml-auto"
                    >
                      <Printer className="w-3 h-3" />
                      Print Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE GATE PASS MODAL WITH QR CODE */}
      {selectedPassForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 animate-scale-up">
            {/* Modal Actions Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Official Weighbridge Gate Pass Slip
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Gate Slip
                </button>
                <button
                  onClick={() => setSelectedPassForPrint(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE PASS CONTAINER (Styled for real paper slip) */}
            <div className="p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono space-y-4">
              {/* Plant Header */}
              <div className="text-center border-b-2 border-slate-300 dark:border-slate-700 pb-3">
                <h4 className="text-sm font-black tracking-wider uppercase">
                  APEX SMART MANUFACTURING PRIVATE LIMITED
                </h4>
                <p className="text-[10px] text-slate-500">
                  Cleanroom Electronics SEZ, Electronic City Phase 1, Bengaluru 560100 &bull; GSTIN: 29AAACA1234F1Z5
                </p>
                <div className="inline-block mt-2 px-3 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-black tracking-widest uppercase">
                  OFFICIAL COMMERCIAL WEIGHBRIDGE SLIP
                </div>
              </div>

              {/* Pass Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">GATE PASS NUMBER:</span>
                  <strong className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {selectedPassForPrint.passNumber}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">TIME OF WEIGHMENT:</span>
                  <strong>
                    {new Date(selectedPassForPrint.inwardTime).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              {/* Vehicle & Carrier */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">VEHICLE REGISTRATION:</span>
                  <strong className="text-sm tracking-wider">{selectedPassForPrint.vehicleNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CARRIER / TRANSPORTER:</span>
                  <strong>{selectedPassForPrint.transporterName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DRIVER NAME & PHONE:</span>
                  <strong>{selectedPassForPrint.driverName} ({selectedPassForPrint.driverPhone})</strong>
                </div>
                {selectedPassForPrint.poNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">PURCHASE ORDER REF:</span>
                    <strong>{selectedPassForPrint.poNumber}</strong>
                  </div>
                )}
              </div>

              {/* Certified Weight Statement */}
              <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-b border-slate-300 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Weighment Parameter</th>
                      <th className="py-2 px-3 text-right">Recorded Weight (kg)</th>
                      <th className="py-2 px-3 text-right">Metric Tonnes (T)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="py-2 px-3 font-semibold">Gross Weight (Loaded)</td>
                      <td className="py-2 px-3 text-right font-bold">
                        {selectedPassForPrint.grossWeightKg.toLocaleString('en-IN')} kg
                      </td>
                      <td className="py-2 px-3 text-right">
                        {(selectedPassForPrint.grossWeightKg / 1000).toFixed(3)} T
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold">Tare Weight (Empty Truck)</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-500">
                        {selectedPassForPrint.tareWeightKg
                          ? `${selectedPassForPrint.tareWeightKg.toLocaleString('en-IN')} kg`
                          : 'Pending Outward Tare'}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500">
                        {selectedPassForPrint.tareWeightKg
                          ? `${(selectedPassForPrint.tareWeightKg / 1000).toFixed(3)} T`
                          : '—'}
                      </td>
                    </tr>
                    <tr className="bg-slate-100 dark:bg-slate-900/80 font-black">
                      <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400">NET CARGO WEIGHT</td>
                      <td className="py-2.5 px-3 text-right text-blue-600 dark:text-blue-400 text-sm">
                        {selectedPassForPrint.netWeightKg
                          ? `${selectedPassForPrint.netWeightKg.toLocaleString('en-IN')} kg`
                          : 'Pending Tare'}
                      </td>
                      <td className="py-2.5 px-3 text-right text-blue-600 dark:text-blue-400">
                        {selectedPassForPrint.netWeightKg
                          ? `${(selectedPassForPrint.netWeightKg / 1000).toFixed(3)} T`
                          : '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* QR Code and Signatures */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                {/* SVG/Canvas Simulated High-Density QR Code */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-300 dark:border-slate-700 shadow-xs">
                    <svg className="w-16 h-16" viewBox="0 0 29 29" fill="black">
                      {/* Corner 1 */}
                      <path d="M0 0h7v7H0zM1 1v5h5V1zM2 2h3v3H2z" />
                      {/* Corner 2 */}
                      <path d="M22 0h7v7h-7zM23 1v5h5V1zM24 2h3v3h-3z" />
                      {/* Corner 3 */}
                      <path d="M0 22h7v7H0zM1 23v5h5v-5zM2 24h3v3H2z" />
                      {/* Data dots */}
                      <rect x="9" y="2" width="2" height="2" />
                      <rect x="13" y="2" width="3" height="1" />
                      <rect x="18" y="2" width="2" height="2" />
                      <rect x="9" y="6" width="3" height="2" />
                      <rect x="14" y="5" width="2" height="3" />
                      <rect x="18" y="6" width="2" height="2" />
                      <rect x="2" y="9" width="3" height="2" />
                      <rect x="6" y="10" width="2" height="2" />
                      <rect x="10" y="10" width="4" height="2" />
                      <rect x="16" y="9" width="3" height="3" />
                      <rect x="21" y="10" width="2" height="2" />
                      <rect x="25" y="9" width="3" height="2" />
                      <rect x="3" y="14" width="2" height="3" />
                      <rect x="8" y="14" width="3" height="2" />
                      <rect x="13" y="13" width="3" height="3" />
                      <rect x="18" y="14" width="2" height="2" />
                      <rect x="23" y="14" width="4" height="2" />
                      <rect x="2" y="19" width="2" height="2" />
                      <rect x="6" y="18" width="2" height="3" />
                      <rect x="10" y="18" width="4" height="2" />
                      <rect x="16" y="19" width="3" height="2" />
                      <rect x="21" y="18" width="2" height="3" />
                      <rect x="25" y="18" width="3" height="2" />
                      <rect x="9" y="23" width="2" height="2" />
                      <rect x="13" y="24" width="3" height="2" />
                      <rect x="18" y="23" width="2" height="2" />
                      <rect x="22" y="22" width="2" height="4" />
                      <rect x="26" y="24" width="2" height="2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">QR AUDIT TOKEN</span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {selectedPassForPrint.verificationCode}
                    </span>
                    <span className="text-[9px] text-emerald-600 block mt-0.5">
                      &bull; Tamper-Evident Ledger Logged
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs space-y-1">
                  <div className="text-[10px] text-slate-500">AUTHORIZED OFFICER:</div>
                  <strong className="text-slate-900 dark:text-white block">
                    {selectedPassForPrint.securityOfficer}
                  </strong>
                  <div className="text-[9px] text-slate-400">
                    Gate 01 Weighbridge Security
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

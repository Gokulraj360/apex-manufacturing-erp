'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Truck,
  Plus,
  Search,
  Scale,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  X,
  ExternalLink,
  ChevronRight,
  Zap,
  Gauge,
  UserCheck,
  Hash,
  MapPin,
  Barcode,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type GatePassStatus = 'INSIDE_PLANT' | 'COMPLETED' | 'CANCELLED';

export interface GatePassRecord {
  id: string;
  passNumber: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  driverLicense?: string;
  transporterName: string;
  grossWeightKg: number;
  tareWeightKg?: number;
  netWeightKg?: number;
  poNumber?: string;
  vendorName?: string;
  materialDescription?: string;
  invoiceNumber?: string;
  ewayBillNumber?: string;
  gateNumber: string;
  securityOfficer: string;
  securityRemarks?: string;
  verificationCode: string;
  inwardTime: string;
  outwardTime?: string;
  status: GatePassStatus;
  bayLocation?: string;
}

export interface LinkedPurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  material: string;
  expectedWeightKg?: number;
}

// ============================================================================
// Initial Mock Data
// ============================================================================

const mockAvailablePOs: LinkedPurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-041',
    vendorName: 'Tata Steel Special Alloy Steels Ltd',
    material: 'Cold-Rolled Carbon Steel Coil 1018 (3,500 KG)',
    expectedWeightKg: 3500,
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-042',
    vendorName: 'Moog Precision Coreless Motors Inc',
    material: 'Brushless DC Coreless Motor 48V (15 PCS)',
    expectedWeightKg: 420,
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-040',
    vendorName: 'Unbrako Fasteners Global',
    material: 'Hex Flange Head Bolt M12x45 (1,000 PCS)',
    expectedWeightKg: 850,
  },
  {
    id: 'po-4',
    poNumber: 'PO-2026-043',
    vendorName: 'Sandvik Hyperion Carbide Materials',
    material: 'Tungsten Carbide Plunger Piston 18mm OD (50 PCS)',
    expectedWeightKg: 680,
  },
];

const initialGatePasses: GatePassRecord[] = [
  {
    id: 'gp-1',
    passNumber: 'GP-2026-0089',
    vehicleNumber: 'MH-12-RN-4821',
    driverName: 'Ramesh Gurung',
    driverPhone: '+91 98230 44102',
    driverLicense: 'MH12 20180029311',
    transporterName: 'VRL Logistics Express Ltd',
    grossWeightKg: 28450,
    poNumber: 'PO-2026-041',
    vendorName: 'Tata Steel Special Alloy Steels Ltd',
    materialDescription: 'Cold-Rolled Carbon Steel Coil 1018 (Billet Blanks)',
    invoiceNumber: 'INV-TATA-2026-901',
    ewayBillNumber: '2819 0041 8829',
    gateNumber: 'Gate 1 (North Heavy Scale)',
    securityOfficer: 'Officer S. Rathore',
    securityRemarks: 'Seal intact #TS-8841. Material unloaded at Bay 4.',
    verificationCode: '8E4A-91FC-029A-7B51',
    inwardTime: '2026-10-01 13:15',
    status: 'INSIDE_PLANT',
    bayLocation: 'Dock 4 (Heavy Raw Coils)',
  },
  {
    id: 'gp-2',
    passNumber: 'GP-2026-0090',
    vehicleNumber: 'KA-04-E-9032',
    driverName: 'Sunil Yadav',
    driverPhone: '+91 94481 29401',
    driverLicense: 'KA04 20190019284',
    transporterName: 'SafeXpress Supply Chain Ltd',
    grossWeightKg: 14200,
    poNumber: 'PO-2026-042',
    vendorName: 'Moog Precision Coreless Motors Inc',
    materialDescription: 'Brushless DC Coreless Motor 48V (750W)',
    invoiceNumber: 'MOOG-BLR-892',
    ewayBillNumber: '2910 8823 4401',
    gateNumber: 'Gate 1 (North Heavy Scale)',
    securityOfficer: 'Officer S. Rathore',
    securityRemarks: 'Precision electronic motors. Escorted to Bay 2.',
    verificationCode: '4C91-00EF-33A8-112B',
    inwardTime: '2026-10-01 14:05',
    status: 'INSIDE_PLANT',
    bayLocation: 'Dock 2 (Cleanroom Electronics)',
  },
  {
    id: 'gp-3',
    passNumber: 'GP-2026-0091',
    vehicleNumber: 'GJ-06-AX-1144',
    driverName: 'Vikram Solanki',
    driverPhone: '+91 98795 33019',
    transporterName: 'TCI Freight Logistics',
    grossWeightKg: 11850,
    poNumber: 'PO-2026-043',
    vendorName: 'Sandvik Hyperion Carbide Materials',
    materialDescription: 'Tungsten Carbide Plunger Blanks 18mm OD',
    invoiceNumber: 'SNVK-2026-190',
    ewayBillNumber: '2418 9031 7720',
    gateNumber: 'Gate 2 (South Scale)',
    securityOfficer: 'Officer D. Shinde',
    securityRemarks: 'Security seal inspected. Awaiting QC sampling.',
    verificationCode: 'F921-77BC-01AA-4589',
    inwardTime: '2026-10-01 12:40',
    status: 'INSIDE_PLANT',
    bayLocation: 'Dock 1 (Tooling & Precision)',
  },
  {
    id: 'gp-out-881',
    passNumber: 'GP-2026-0092',
    vehicleNumber: 'MH-12-PQ-4029',
    driverName: 'Sanjay Deshmukh',
    driverPhone: '+91 98220 89891',
    transporterName: 'Safechem Express Cargo Lines',
    grossWeightKg: 7820,
    materialDescription: 'Outward Dispatch: 6 Cartons Phosphor Bronze Sleeves (DSP-2026-0888)',
    invoiceNumber: 'DC-2026-0888',
    ewayBillNumber: '2819 4018 7721',
    gateNumber: 'Gate 2 (Outward Weighbridge)',
    securityOfficer: 'Officer D. Shinde',
    securityRemarks: 'Outward consignment DSP-2026-0888. On scale for Tare capture.',
    verificationCode: '7A22-881B-00CD-4112',
    inwardTime: '2026-10-02 11:15',
    status: 'INSIDE_PLANT',
    bayLocation: 'Outward Weighbridge Scale #2',
  },
  {
    id: 'gp-4',
    passNumber: 'GP-2026-0087',
    vehicleNumber: 'MH-14-BT-5522',
    driverName: 'Anil Patil',
    driverPhone: '+91 98221 00982',
    transporterName: 'Patil Roadways Logistics',
    grossWeightKg: 24500,
    tareWeightKg: 9800,
    netWeightKg: 14700,
    poNumber: 'PO-2026-039',
    vendorName: 'SKF Bearings India Commercial Ltd',
    materialDescription: 'Radial Ball Bearings 25x52x15',
    invoiceNumber: 'SKF-PN-0044',
    ewayBillNumber: '2719 3390 1192',
    gateNumber: 'Gate 1 (North Heavy Scale)',
    securityOfficer: 'Officer S. Rathore',
    securityRemarks: 'Material delivered and accepted at QC dock. Tare completed.',
    verificationCode: '1A98-88DC-4422-9900',
    inwardTime: '2026-10-01 10:20',
    outwardTime: '2026-10-01 11:45',
    status: 'COMPLETED',
  },
  {
    id: 'gp-5',
    passNumber: 'GP-2026-0086',
    vehicleNumber: 'DL-01-AB-3390',
    driverName: 'Harpreet Singh',
    driverPhone: '+91 99110 55431',
    transporterName: 'Delhi-Gujarat Transport Corp',
    grossWeightKg: 18200,
    tareWeightKg: 8400,
    netWeightKg: 9800,
    poNumber: 'PO-2026-040',
    vendorName: 'Unbrako Fasteners Global',
    materialDescription: 'Hex Flange Head Bolts M12x45 Grade 10.9',
    invoiceNumber: 'UNB-DEL-1092',
    ewayBillNumber: '0718 2291 0084',
    gateNumber: 'Gate 1 (North Heavy Scale)',
    securityOfficer: 'Officer S. Rathore',
    securityRemarks: 'Weight reconciled with packing slip. Clean exit.',
    verificationCode: '3B88-1299-FFA0-7811',
    inwardTime: '2026-10-01 08:50',
    outwardTime: '2026-10-01 10:10',
    status: 'COMPLETED',
  },
];

export default function GateSecurityLogisticsPage() {
  const [gatePasses, setGatePasses] = useState<GatePassRecord[]>(initialGatePasses);
  const [activeTab, setActiveTab] = useState<'INWARD_ENTRY' | 'ACTIVE_DOCK' | 'COMPLETED_LOG'>('INWARD_ENTRY');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Pass for Tare Capture Modal
  const [tareTargetPass, setTareTargetPass] = useState<GatePassRecord | null>(null);
  const [tareInputWeight, setTareInputWeight] = useState<number>(0);
  const [tareRemarks, setTareRemarks] = useState<string>('');

  // Selected Pass for Digital Gate Pass Print View
  const [printPass, setPrintPass] = useState<GatePassRecord | null>(null);

  // Inward Form States (Touch-optimized)
  const [inwardForm, setInwardForm] = useState({
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    transporterName: '',
    grossWeightKg: 24850,
    selectedPOId: 'po-1',
    invoiceNumber: '',
    ewayBillNumber: '',
    gateNumber: 'Gate 1 (North Heavy Scale)',
    securityOfficer: 'Officer S. Rathore',
    bayLocation: 'Dock 4 (Heavy Raw Coils)',
    securityRemarks: '',
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Live Logistics KPI Summary
  const kpiData = useMemo(() => {
    const insidePlantCount = gatePasses.filter((gp) => gp.status === 'INSIDE_PLANT').length;
    const completedToday = gatePasses.filter((gp) => gp.status === 'COMPLETED');
    const totalNetWeightKg = completedToday.reduce((sum, gp) => sum + (gp.netWeightKg || 0), 0);
    const totalTonnageMT = (totalNetWeightKg / 1000).toFixed(2);

    return {
      insidePlantCount,
      completedTodayCount: completedToday.length,
      totalTonnageMT,
      avgTurnaround: '52 mins',
    };
  }, [gatePasses]);

  // Active trucks inside premises
  const activeInsideTrucks = useMemo(() => {
    return gatePasses.filter((gp) => gp.status === 'INSIDE_PLANT');
  }, [gatePasses]);

  // Filtered passes for Search / Logs
  const filteredPasses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return gatePasses.filter((gp) => {
      if (!q) return true;
      return (
        gp.passNumber.toLowerCase().includes(q) ||
        gp.vehicleNumber.toLowerCase().includes(q) ||
        gp.driverName.toLowerCase().includes(q) ||
        (gp.vendorName && gp.vendorName.toLowerCase().includes(q)) ||
        (gp.poNumber && gp.poNumber.toLowerCase().includes(q)) ||
        (gp.transporterName && gp.transporterName.toLowerCase().includes(q))
      );
    });
  }, [gatePasses, searchQuery]);

  // Handle Inward Entry Submission
  const handleCreateInwardPass = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inwardForm.vehicleNumber.trim()) {
      showNotification('Vehicle Number is required!', 'info');
      return;
    }
    if (!inwardForm.driverName.trim()) {
      showNotification('Driver Name is required!', 'info');
      return;
    }
    if (inwardForm.grossWeightKg <= 0) {
      showNotification('Valid Gross Weight input is required!', 'info');
      return;
    }

    const linkedPO = mockAvailablePOs.find((p) => p.id === inwardForm.selectedPOId);
    const newPassNumber = `GP-2026-00${gatePasses.length + 88}`;
    const verificationCode = `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}-VERIFIED`;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newPass: GatePassRecord = {
      id: `gp-${Date.now()}`,
      passNumber: newPassNumber,
      vehicleNumber: inwardForm.vehicleNumber.toUpperCase().trim(),
      driverName: inwardForm.driverName.trim(),
      driverPhone: inwardForm.driverPhone.trim() || '+91 98000 00000',
      driverLicense: inwardForm.driverLicense.trim() || 'DL-APEX-VERIFIED',
      transporterName: inwardForm.transporterName.trim() || 'Express Fleet Logistics',
      grossWeightKg: Number(inwardForm.grossWeightKg),
      poNumber: linkedPO?.poNumber,
      vendorName: linkedPO?.vendorName,
      materialDescription: linkedPO?.material,
      invoiceNumber: inwardForm.invoiceNumber.trim() || `INV-${Date.now().toString().slice(-4)}`,
      ewayBillNumber: inwardForm.ewayBillNumber.trim() || '2819 4402 1198',
      gateNumber: inwardForm.gateNumber,
      securityOfficer: inwardForm.securityOfficer,
      securityRemarks: inwardForm.securityRemarks || 'Inward visual inspection clear. Cargo seal verified.',
      verificationCode,
      inwardTime: nowStr,
      status: 'INSIDE_PLANT',
      bayLocation: inwardForm.bayLocation,
    };

    setGatePasses((prev) => [newPass, ...prev]);

    // Reset Form
    setInwardForm({
      vehicleNumber: '',
      driverName: '',
      driverPhone: '',
      driverLicense: '',
      transporterName: '',
      grossWeightKg: 22500,
      selectedPOId: 'po-1',
      invoiceNumber: '',
      ewayBillNumber: '',
      gateNumber: 'Gate 1 (North Heavy Scale)',
      securityOfficer: 'Officer S. Rathore',
      bayLocation: 'Dock 4 (Heavy Raw Coils)',
      securityRemarks: '',
    });

    showNotification(`Inward Gate Pass ${newPassNumber} generated! Vehicle dispatched to unloading dock.`);
    setPrintPass(newPass);
  };

  // Open Tare Weight Modal for a truck
  const handleInitiateOutward = (pass: GatePassRecord) => {
    setTareTargetPass(pass);
    // Typical empty vehicle tare is ~30-40% of gross
    const estimatedTare = Math.round(pass.grossWeightKg * 0.38);
    setTareInputWeight(estimatedTare);
    setTareRemarks('Empty vehicle weighed on scale #1. Gate check verified.');
  };

  // Submit Tare & Finalize Outward Departure
  const handleConfirmTareOutward = () => {
    if (!tareTargetPass) return;

    if (tareInputWeight <= 0) {
      showNotification('Tare weight must be greater than zero kg!', 'info');
      return;
    }
    if (tareInputWeight >= tareTargetPass.grossWeightKg) {
      showNotification('Tare weight cannot exceed gross entry weight!', 'info');
      return;
    }

    const netWeight = tareTargetPass.grossWeightKg - tareInputWeight;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedPass: GatePassRecord = {
      ...tareTargetPass,
      tareWeightKg: tareInputWeight,
      netWeightKg: netWeight,
      outwardTime: nowStr,
      status: 'COMPLETED',
      securityRemarks: tareRemarks
        ? `${tareTargetPass.securityRemarks || ''} [Outward: ${tareRemarks}]`.trim()
        : tareTargetPass.securityRemarks,
    };

    setGatePasses((prev) => prev.map((gp) => (gp.id === tareTargetPass.id ? updatedPass : gp)));
    setTareTargetPass(null);
    showNotification(
      `Vehicle ${updatedPass.vehicleNumber} cleared for departure! Net cargo: ${(netWeight / 1000).toFixed(
        2
      )} MT.`
    );
    setPrintPass(updatedPass);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Gate Security & Weighbridge Logistics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Scale COM1 Online
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Touch-optimized weighbridge scale capture, inward vehicle passes, tare weight outward reconciliation, and live yard tracking.
          </p>
        </div>

        {/* Quick Mode Switches */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('INWARD_ENTRY')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5',
              activeTab === 'INWARD_ENTRY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Fast Inward Entry
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE_DOCK')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5',
              activeTab === 'ACTIVE_DOCK'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            <Truck className="w-4 h-4" />
            Inside Plant ({activeInsideTrucks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('COMPLETED_LOG')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5',
              activeTab === 'COMPLETED_LOG'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            <FileText className="w-4 h-4" />
            Gate Pass Registry
          </button>
        </div>
      </div>

      {/* Top Weighbridge & Yard KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Inside Plant */}
        <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Trucks Inside Plant
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-900 dark:text-amber-100 mt-2">
            {kpiData.insidePlantCount}
          </div>
          <div className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Unloading at designated factory bays
          </div>
        </div>

        {/* Departed / Completed Today */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed Departures
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
            {kpiData.completedTodayCount} Passes
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
            Tare weight reconciled & departed
          </div>
        </div>

        {/* Net Cargo Tonnage Today */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cargo Received (Today)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
            {kpiData.totalTonnageMT} MT
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Net material weight recorded
          </div>
        </div>

        {/* Average Turnaround Time */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Turnaround Time
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
            {kpiData.avgTurnaround}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Inward gate check to departure
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: Touch-Optimized Fast Inward Entry Form */}
      {/* ========================================================================= */}
      {activeTab === 'INWARD_ENTRY' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Inward Form */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Fast Inward Gate Pass Entry
                  </h2>
                  <span className="text-xs text-slate-400">
                    Capture vehicle details, driver credentials, loaded gross weight, and dispatch to dock.
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Gate Security Terminal
              </span>
            </div>

            <form onSubmit={handleCreateInwardPass} className="space-y-4">
              {/* Row 1: Vehicle Number & Linked Purchase Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Number Input (High-contrast bold font) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Vehicle Registration # *
                  </label>
                  <div className="relative">
                    <Truck className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. MH-12-RN-4821"
                      value={inwardForm.vehicleNumber}
                      onChange={(e) =>
                        setInwardForm({ ...inwardForm, vehicleNumber: e.target.value.toUpperCase() })
                      }
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-mono text-lg font-extrabold text-blue-600 dark:text-blue-400 tracking-wider placeholder:font-normal placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Linked Purchase Order Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Linked Purchase Order *
                  </label>
                  <select
                    value={inwardForm.selectedPOId}
                    onChange={(e) => setInwardForm({ ...inwardForm, selectedPOId: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {mockAvailablePOs.map((po) => (
                      <option key={po.id} value={po.id}>
                        {po.poNumber} &bull; {po.vendorName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Driver Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Driver Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={inwardForm.driverName}
                    onChange={(e) => setInwardForm({ ...inwardForm, driverName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Driver Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98XXX XXXXX"
                    value={inwardForm.driverPhone}
                    onChange={(e) => setInwardForm({ ...inwardForm, driverPhone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: Transporter & Inbound Invoice Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transporter Carrier Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VRL Logistics / TCI Freight"
                    value={inwardForm.transporterName}
                    onChange={(e) => setInwardForm({ ...inwardForm, transporterName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Supplier Tax Invoice / Delivery Challan #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INV-2026-9021"
                    value={inwardForm.invoiceNumber}
                    onChange={(e) => setInwardForm({ ...inwardForm, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 4: Weighbridge Gross Weight (Highlighted Terminal Block) */}
              <div className="p-4 rounded-xl border-2 border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 block">
                        Weighbridge Gross Weight Capture (Loaded Vehicle) *
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Electronic pitless weighbridge scale indicator (COM1 port)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // Simulates taking reading from digital scale
                      const simulatedReading = 24000 + Math.floor(Math.random() * 6000);
                      setInwardForm({ ...inwardForm, grossWeightKg: simulatedReading });
                      showNotification(`Scale synchronized! Captured ${simulatedReading.toLocaleString()} KG.`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors self-start sm:self-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Read Live Scale
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={inwardForm.grossWeightKg}
                    onChange={(e) =>
                      setInwardForm({ ...inwardForm, grossWeightKg: Number(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-2xl font-black text-slate-900 dark:text-slate-50 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-extrabold text-lg text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800">
                    KG
                  </span>
                </div>

                {/* Quick weight adjustment pill buttons */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-blue-100 dark:border-blue-900/40 text-xs">
                  <span className="text-slate-400 font-medium">Quick presets:</span>
                  {[12500, 18400, 24850, 28450, 32000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInwardForm({ ...inwardForm, grossWeightKg: preset })}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400"
                    >
                      {preset.toLocaleString()} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 5: Destination Dock Bay & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designated Unloading Bay
                  </label>
                  <select
                    value={inwardForm.bayLocation}
                    onChange={(e) => setInwardForm({ ...inwardForm, bayLocation: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Dock 1 (Tooling & Precision)">Dock 1 (Tooling & Precision)</option>
                    <option value="Dock 2 (Cleanroom Electronics)">Dock 2 (Cleanroom Electronics)</option>
                    <option value="Dock 3 (Fasteners & Bulk Consumables)">Dock 3 (Fasteners & Consumables)</option>
                    <option value="Dock 4 (Heavy Raw Coils)">Dock 4 (Heavy Raw Coils)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Security Gate & Officer On-Duty
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      disabled
                      value={`${inwardForm.gateNumber} - ${inwardForm.securityOfficer}`}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-2 transition-colors active:scale-98"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Generate Inward Gate Pass & Dispatch to Bay
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Dock Information & Active Vehicles Preview */}
          <div className="space-y-4">
            {/* Live Weighbridge Status Box */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Weighbridge Sensor COM1
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CALIBRATED
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-center border border-slate-800">
                <span className="text-[11px] text-slate-400 block uppercase">Real-Time Reading</span>
                <span className="text-3xl font-black text-emerald-400 tracking-wider">
                  {inwardForm.grossWeightKg.toLocaleString()} KG
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Tolerance: &plusmn; 5 KG &bull; Class III Scale</span>
              </div>
              <p className="text-xs text-slate-400">
                Automatic optical character recognition (OCR) and high-speed weighbridge synchronization enabled.
              </p>
            </div>

            {/* Quick List of Active Trucks Waiting for Tare Outward */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-500" />
                  Active Unloading ({activeInsideTrucks.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('ACTIVE_DOCK')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {activeInsideTrucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-1.5 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100">
                        {truck.vehicleNumber}
                      </span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {truck.passNumber}
                      </span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 truncate">
                      {truck.vendorName}
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                      <span>Inward: {truck.inwardTime.split(' ')[1]}</span>
                      <button
                        type="button"
                        onClick={() => handleInitiateOutward(truck)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                      >
                        Tare & Outward
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: Active Trucks Inside Plant Premises */}
      {/* ========================================================================= */}
      {activeTab === 'ACTIVE_DOCK' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <span>
                <strong>{activeInsideTrucks.length} Trucks Currently Inside Factory Premises:</strong> Ensure all vehicles complete material discharge, collect GRN inspection stamp, and record Tare Weight at the exit scale before departure.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeInsideTrucks.map((truck) => (
              <div
                key={truck.id}
                className="p-5 rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-mono text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {truck.vehicleNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      INSIDE PLANT
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Gate Pass #</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {truck.passNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Driver</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {truck.driverName} ({truck.driverPhone})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Supplier</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                        {truck.vendorName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Linked PO</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {truck.poNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Gross Entry Weight</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {truck.grossWeightKg.toLocaleString()} KG
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Inward Timestamp</span>
                      <span className="font-medium text-slate-600 dark:text-slate-400">
                        {truck.inwardTime}
                      </span>
                    </div>
                    {truck.bayLocation && (
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{truck.bayLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleInitiateOutward(truck)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Capture Tare & Outward
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintPass(truck)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Print Gate Pass"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: Gate Pass Registry & Historical Weighing Log */}
      {/* ========================================================================= */}
      {activeTab === 'COMPLETED_LOG' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicle number, pass #, driver or PO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Pass #</th>
                    <th className="py-3 px-4">Vehicle Number</th>
                    <th className="py-3 px-4">Driver & Carrier</th>
                    <th className="py-3 px-4">PO / Supplier</th>
                    <th className="py-3 px-4 text-right">Gross (KG)</th>
                    <th className="py-3 px-4 text-right">Tare (KG)</th>
                    <th className="py-3 px-4 text-right">Net Cargo (KG)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPasses.map((pass) => (
                    <tr
                      key={pass.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {pass.passNumber}
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-slate-900 dark:text-slate-100">
                        {pass.vehicleNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {pass.driverName}
                        </div>
                        <div className="text-[11px] text-slate-400">{pass.transporterName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {pass.vendorName || 'Direct'}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">{pass.poNumber}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        {pass.grossWeightKg.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        {pass.tareWeightKg ? pass.tareWeightKg.toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {pass.netWeightKg ? pass.netWeightKg.toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {pass.status === 'INSIDE_PLANT' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            INSIDE PLANT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            COMPLETED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setPrintPass(pass)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Print Digital Gate Pass"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Tare Weight Outward Capture */}
      {/* ========================================================================= */}
      {tareTargetPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs"
            onClick={() => setTareTargetPass(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Capture Outward Tare Weight
                  </h3>
                  <span className="text-xs text-slate-400">
                    Vehicle: {tareTargetPass.vehicleNumber} &bull; Pass: {tareTargetPass.passNumber}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTareTargetPass(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              {/* Inward Gross vs Outward Tare comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block font-medium">Inward Gross Weight</span>
                  <span className="text-xl font-mono font-extrabold text-slate-900 dark:text-slate-100 block mt-0.5">
                    {tareTargetPass.grossWeightKg.toLocaleString()} KG
                  </span>
                  <span className="text-[10px] text-slate-400">Loaded Truck Entry</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-emerald-700 dark:text-emerald-300 block font-medium">
                    Calculated Net Cargo
                  </span>
                  <span className="text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    {Math.max(0, tareTargetPass.grossWeightKg - tareInputWeight).toLocaleString()} KG
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    ({((tareTargetPass.grossWeightKg - tareInputWeight) / 1000).toFixed(2)} Metric Tons)
                  </span>
                </div>
              </div>

              {/* Tare Input */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Weighbridge Tare Reading (Empty Truck) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={tareInputWeight}
                    onChange={(e) => setTareInputWeight(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xl font-extrabold text-slate-900 dark:text-slate-50 text-right focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="font-extrabold text-sm text-slate-600 dark:text-slate-300 px-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                    KG
                  </span>
                </div>
              </div>

              {/* Security Remarks */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Departure Gate Remarks & Seal Verification
                </label>
                <input
                  type="text"
                  value={tareRemarks}
                  onChange={(e) => setTareRemarks(e.target.value)}
                  placeholder="e.g. Empty trailer inspected. No unbilled cargo."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTareTargetPass(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTareOutward}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Departure & Print Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Official Digital Gate Pass (Printable Component with QR Code) */}
      {/* ========================================================================= */}
      {printPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-blue-600" /> Digital Gate Pass Document
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Physical Slip
                </button>
                <button
                  type="button"
                  onClick={() => setPrintPass(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Pass Paper Sheet Container */}
            <div className="mt-4 p-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-white text-slate-900 print:border-none print:p-0">
              {/* Document Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase block">
                      APEX MANUFACTURING CORP
                    </span>
                    <span className="text-lg font-black tracking-tight text-slate-900 block">
                      WEIGHBRIDGE GATE PASS
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Plant 1: Chakan Industrial Area, Pune &bull; GSTIN: 27AABCS1429B1Z0
                    </span>
                  </div>

                  {/* Verification Badge */}
                  <div className="p-2 rounded-lg border-2 border-emerald-600 text-emerald-700 font-bold text-[10px] uppercase text-center leading-tight">
                    <ShieldCheck className="w-4 h-4 mx-auto mb-0.5 text-emerald-600" />
                    SECURITY
                    <br />
                    VERIFIED
                  </div>
                </div>
              </div>

              {/* Pass Number, Status & QR Representation */}
              <div className="grid grid-cols-3 gap-3 py-3 border-b border-slate-200 text-xs items-center">
                <div className="col-span-2 space-y-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Gate Pass Reference</span>
                    <span className="font-mono text-base font-black text-blue-700">
                      {printPass.passNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Verification Code</span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {printPass.verificationCode}
                    </span>
                  </div>
                </div>

                {/* SVG QR Code Simulation */}
                <div className="flex flex-col items-center justify-center p-2 rounded border border-slate-200 bg-slate-50">
                  <QrCode className="w-12 h-12 text-slate-900" />
                  <span className="text-[9px] font-mono font-semibold text-slate-500 mt-1">
                    SCAN TO VERIFY
                  </span>
                </div>
              </div>

              {/* Logistics & Vehicle Information */}
              <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Vehicle Registration #</span>
                  <span className="font-mono text-sm font-extrabold text-slate-900">
                    {printPass.vehicleNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Driver Name & Phone</span>
                  <span className="font-bold text-slate-900">
                    {printPass.driverName} ({printPass.driverPhone})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Carrier / Transporter</span>
                  <span className="font-medium text-slate-800">
                    {printPass.transporterName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Linked Purchase Order</span>
                  <span className="font-mono font-bold text-slate-900">
                    {printPass.poNumber || 'Direct Consignment'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Vendor / Supplier Entity</span>
                  <span className="font-medium text-slate-800">
                    {printPass.vendorName || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Supplier Invoice / Challan</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {printPass.invoiceNumber || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Weighbridge Measurements Table */}
              <div className="py-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Official Weighbridge Scale Certification (Pitless 60 MT Scale)
                </span>
                <table className="w-full text-xs text-left border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                    <tr>
                      <th className="py-1.5 px-3">Weighment Phase</th>
                      <th className="py-1.5 px-3">Timestamp</th>
                      <th className="py-1.5 px-3 text-right">Weight (KG)</th>
                      <th className="py-1.5 px-3 text-right">Metric Tons (MT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    <tr>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800">
                        Inward Gross Weight (Loaded)
                      </td>
                      <td className="py-2 px-3 text-slate-600">{printPass.inwardTime}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {printPass.grossWeightKg.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        {(printPass.grossWeightKg / 1000).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800">
                        Outward Tare Weight (Empty)
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {printPass.outwardTime || 'Pending Discharge'}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {printPass.tareWeightKg ? printPass.tareWeightKg.toLocaleString() : '-'}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        {printPass.tareWeightKg ? (printPass.tareWeightKg / 1000).toFixed(2) : '-'}
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/70 font-bold">
                      <td className="py-2 px-3 font-sans text-emerald-900 uppercase">
                        Net Material Cargo Received
                      </td>
                      <td className="py-2 px-3 text-emerald-800 font-sans text-[11px]">
                        Certified by Weighbridge Operator
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-800 text-sm">
                        {printPass.netWeightKg ? printPass.netWeightKg.toLocaleString() : '-'}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-800 text-sm">
                        {printPass.netWeightKg ? (printPass.netWeightKg / 1000).toFixed(2) : '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures & Authorizations */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-xs border-t border-slate-200 mt-4">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-mono text-[11px]">
                    {printPass.driverName}
                  </div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">
                    Driver / Transporter Signature
                  </span>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-mono text-[11px]">
                    {printPass.securityOfficer} (Gate Security)
                  </div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">
                    Authorized Weighbridge Officer Stamp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

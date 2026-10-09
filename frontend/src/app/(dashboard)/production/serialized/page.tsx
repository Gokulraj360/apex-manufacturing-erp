'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  QrCode,
  ScanLine,
  Activity,
  Cpu,
  Thermometer,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  User,
  ShieldCheck,
  Zap,
  Gauge,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle,
  Radio,
  Layers,
  Sparkles,
  Sliders,
  ChevronRight,
  Maximize2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Station Progression Definitions
export type ProductionStationType =
  | 'SMT_LINE'
  | 'OPTICAL_AOI'
  | 'SCREWDRIVING'
  | 'RF_ANTENNA'
  | 'BATTERY_SEAL'
  | 'PACKAGING';

export interface StationConfig {
  key: ProductionStationType;
  label: string;
  stepNumber: number;
  shortDesc: string;
  nominalSpecs: string;
}

export const STATION_SEQUENCE: StationConfig[] = [
  {
    key: 'SMT_LINE',
    label: 'SMT Line & Reflow',
    stepNumber: 1,
    shortDesc: 'Solder paste stencil & N2 reflow',
    nominalSpecs: '249.5°C peak, <45 PPM O2',
  },
  {
    key: 'OPTICAL_AOI',
    label: '3D Optical AOI',
    stepNumber: 2,
    shortDesc: 'Automated 3D vision solder inspection',
    nominalSpecs: '0.00% bridging, 1480 BGA pads',
  },
  {
    key: 'SCREWDRIVING',
    label: 'Robotic Screwdriving',
    stepNumber: 3,
    shortDesc: 'M1.4 aviation chassis torque fastening',
    nominalSpecs: '0.350 Nm ±0.020 Nm',
  },
  {
    key: 'RF_ANTENNA',
    label: 'RF Antenna Check',
    stepNumber: 4,
    shortDesc: '5G Sub-6 & mmWave phased array VSWR',
    nominalSpecs: 'VSWR < 1.25, 24.2 dBm',
  },
  {
    key: 'BATTERY_SEAL',
    label: 'Battery Seal Inspection',
    stepNumber: 5,
    shortDesc: 'Dual-cell hermetic vacuum seal test',
    nominalSpecs: '98.5 kPa vacuum hold',
  },
  {
    key: 'PACKAGING',
    label: 'Cleanroom Packaging',
    stepNumber: 6,
    shortDesc: 'IMEI laser barcoding & tamper seal',
    nominalSpecs: 'Dual 15-digit IMEI verification',
  },
];

export interface StationCheckpoint {
  checkpointId: string;
  station: ProductionStationType;
  status: 'PASSED' | 'REJECTED';
  operatorId: string;
  operatorName: string;
  timestamp: string;
  testMetrics?: Record<string, any>;
  defectReason?: string;
  remarks?: string;
}

export interface SerializedUnit {
  id: string;
  serialNumber: string;
  productId: string;
  productName: string;
  currentStation: ProductionStationType;
  status: 'IN_PROCESS' | 'PASSED' | 'REJECTED';
  historyLogs: StationCheckpoint[];
  createdAt: string;
  updatedAt: string;
}

export interface TelemetryData {
  machineId: string;
  lineId: string;
  reflowTemp: number; // °C (Target 249.5, Tol 246-252)
  oxygenPpm: number; // Nitrogen chamber O2 (Target < 45, Alert > 48)
  torqueNm: number; // Calibrated 0.350 Nm (Tol ±0.020 Nm)
  oeeAvailability: number;
  oeePerformance: number;
  oeeQuality: number;
  oeeComposite: number;
  hasTemperatureSpike: boolean;
  hasTorqueVariance: boolean;
  hasOxygenPpmAlert: boolean;
  activeAlerts: string[];
  timestamp: string;
}

export default function SerializedTrackingPage() {
  // State: Active Scan Inputs
  const [scannedSerial, setScannedSerial] = useState<string>('864902061234567');
  const [selectedStation, setSelectedStation] = useState<ProductionStationType>('PACKAGING');
  const [operatorId, setOperatorId] = useState<string>('OP-CLEAN-402');
  const [operatorName, setOperatorName] = useState<string>('Rajesh K.');
  const [qcDisposition, setQcDisposition] = useState<'PASSED' | 'REJECTED'>('PASSED');
  const [defectReason, setDefectReason] = useState<string>('');
  const [scanRemarks, setScanRemarks] = useState<string>('');

  // Notifications / Interlock Alerts
  const [interlockAlert, setInterlockAlert] = useState<{
    type: 'SUCCESS' | 'ERROR' | 'WARNING';
    title: string;
    message: string;
  } | null>({
    type: 'SUCCESS',
    title: 'Cleanroom Interlock System Active',
    message: 'All 6 station quality gates enforce prior step certification before advancing.',
  });

  // Telemetry Live State
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    machineId: 'CLEANROOM-CELL-01',
    lineId: 'LINE-01-CLEANROOM',
    reflowTemp: 249.4,
    oxygenPpm: 34.2,
    torqueNm: 0.351,
    oeeAvailability: 96.5,
    oeePerformance: 94.8,
    oeeQuality: 99.2,
    oeeComposite: 90.7,
    hasTemperatureSpike: false,
    hasTorqueVariance: false,
    hasOxygenPpmAlert: false,
    activeAlerts: [],
    timestamp: new Date().toISOString(),
  });

  // Serialized Units Inventory State
  const [units, setUnits] = useState<SerializedUnit[]>([
    {
      id: 'ser-001',
      serialNumber: '864902061234567',
      productId: 'prod-phone-001',
      productName: 'Apex Pro 5G - Ceramic Black (12GB/256GB)',
      currentStation: 'BATTERY_SEAL',
      status: 'PASSED',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 300000).toISOString(),
      historyLogs: [
        {
          checkpointId: 'chk-01',
          station: 'SMT_LINE',
          status: 'PASSED',
          operatorId: 'OP-SMT-101',
          operatorName: 'Sunil Verma',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          testMetrics: { solderPasteThicknessUm: 122.4, reflowPeakTemp: 249.1, nitrogenO2Ppm: 32 },
          remarks: 'SMT stencil print within ±3μm tolerance.',
        },
        {
          checkpointId: 'chk-02',
          station: 'OPTICAL_AOI',
          status: 'PASSED',
          operatorId: 'OP-AOI-204',
          operatorName: 'Priya Sharma',
          timestamp: new Date(Date.now() - 5400000).toISOString(),
          testMetrics: { falseNegativeRate: 0.0, solderBridgeDetected: false, tombstoning: false },
          remarks: '3D Optical AOI pass. All 1,480 solder balls uniform.',
        },
        {
          checkpointId: 'chk-03',
          station: 'SCREWDRIVING',
          status: 'PASSED',
          operatorId: 'OP-ROBO-302',
          operatorName: 'Aakash Patel',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          testMetrics: { torqueNm: 0.351, targetTorqueNm: 0.35, angleDegrees: 720 },
          remarks: '6x M1.4 aviation chassis screws fastened to spec.',
        },
        {
          checkpointId: 'chk-04',
          station: 'RF_ANTENNA',
          status: 'PASSED',
          operatorId: 'OP-RF-410',
          operatorName: 'Deepak Rao',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          testMetrics: { vswr: 1.15, gainDbi: 3.4, bleSnrDb: 42.1 },
          remarks: '5G Sub-6 & mmWave phased array VSWR within spec.',
        },
        {
          checkpointId: 'chk-05',
          station: 'BATTERY_SEAL',
          status: 'PASSED',
          operatorId: 'OP-BAT-505',
          operatorName: 'Meera Nair',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          testMetrics: { vacuumSealKpa: 98.6, thermalConductivityWmk: 14.2 },
          remarks: 'Battery chamber hermetic pressure test passed.',
        },
      ],
    },
    {
      id: 'ser-002',
      serialNumber: '864902061234568',
      productId: 'prod-phone-001',
      productName: 'Apex Pro 5G - Titanium Grey (16GB/512GB)',
      currentStation: 'SCREWDRIVING',
      status: 'PASSED',
      createdAt: new Date(Date.now() - 5000000).toISOString(),
      updatedAt: new Date(Date.now() - 900000).toISOString(),
      historyLogs: [
        {
          checkpointId: 'chk-11',
          station: 'SMT_LINE',
          status: 'PASSED',
          operatorId: 'OP-SMT-101',
          operatorName: 'Sunil Verma',
          timestamp: new Date(Date.now() - 5000000).toISOString(),
          testMetrics: { reflowPeakTemp: 249.8 },
        },
        {
          checkpointId: 'chk-12',
          station: 'OPTICAL_AOI',
          status: 'PASSED',
          operatorId: 'OP-AOI-204',
          operatorName: 'Priya Sharma',
          timestamp: new Date(Date.now() - 2800000).toISOString(),
          testMetrics: { defectCount: 0 },
        },
        {
          checkpointId: 'chk-13',
          station: 'SCREWDRIVING',
          status: 'PASSED',
          operatorId: 'OP-ROBO-302',
          operatorName: 'Aakash Patel',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          testMetrics: { torqueNm: 0.349, targetTorqueNm: 0.35 },
          remarks: 'Fastening verified.',
        },
      ],
    },
    {
      id: 'ser-003',
      serialNumber: '864902061234569',
      productId: 'prod-phone-001',
      productName: 'Apex Pro 5G - Glacier White (12GB/256GB)',
      currentStation: 'SCREWDRIVING',
      status: 'REJECTED',
      createdAt: new Date(Date.now() - 4200000).toISOString(),
      updatedAt: new Date(Date.now() - 1200000).toISOString(),
      historyLogs: [
        {
          checkpointId: 'chk-21',
          station: 'SMT_LINE',
          status: 'PASSED',
          operatorId: 'OP-SMT-102',
          operatorName: 'Vikram Singh',
          timestamp: new Date(Date.now() - 4200000).toISOString(),
          testMetrics: { reflowPeakTemp: 248.9 },
        },
        {
          checkpointId: 'chk-22',
          station: 'OPTICAL_AOI',
          status: 'PASSED',
          operatorId: 'OP-AOI-204',
          operatorName: 'Priya Sharma',
          timestamp: new Date(Date.now() - 2500000).toISOString(),
          testMetrics: { defectCount: 0 },
        },
        {
          checkpointId: 'chk-23',
          station: 'SCREWDRIVING',
          status: 'REJECTED',
          operatorId: 'OP-ROBO-302',
          operatorName: 'Aakash Patel',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          testMetrics: { torqueNm: 0.392, targetTorqueNm: 0.35, variance: 0.042 },
          defectReason: 'Stripped thread error: Torque exceeded allowable ±0.02 Nm threshold (0.392 Nm).',
          remarks: 'Diverted to cleanroom rework quarantine bin Q-04.',
        },
      ],
    },
  ]);

  // Selected Unit for Detailed Stepper View
  const activeUnit = useMemo(() => {
    return units.find((u) => u.serialNumber === scannedSerial.trim()) || units[0];
  }, [units, scannedSerial]);

  // Flattened Audit Trail Feed (Chronological descending)
  const auditTrailFeed = useMemo(() => {
    const list: Array<{
      serialNumber: string;
      productName: string;
      checkpoint: StationCheckpoint;
    }> = [];

    units.forEach((u) => {
      u.historyLogs.forEach((chk) => {
        list.push({
          serialNumber: u.serialNumber,
          productName: u.productName,
          checkpoint: chk,
        });
      });
    });

    return list.sort(
      (a, b) =>
        new Date(b.checkpoint.timestamp).getTime() -
        new Date(a.checkpoint.timestamp).getTime()
    );
  }, [units]);

  // Live IoT Telemetry Stream (SSE with Client Fallback)
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/production/serialized/telemetry/stream');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          setTelemetry(payload);
        } catch (err) {}
      };
      eventSource.onerror = () => {
        // SSE disconnected / not served yet; fail gracefully to in-browser micro-jitter
      };
    } catch (err) {}

    // Simulated micro-variance ticker
    const intervalId = setInterval(() => {
      setTelemetry((prev) => {
        const tempVariation = (Math.random() - 0.48) * 0.4;
        const reflowTemp = Number((249.4 + tempVariation).toFixed(1));

        const torqueVariation = (Math.random() - 0.49) * 0.008;
        const torqueNm = Number((0.35 + torqueVariation).toFixed(3));

        const oxygenVariation = (Math.random() - 0.5) * 2;
        const oxygenPpm = Number(Math.max(18, 34 + oxygenVariation).toFixed(1));

        const alerts: string[] = [];
        const hasTemperatureSpike = reflowTemp > 252.0 || reflowTemp < 246.0;
        if (hasTemperatureSpike) {
          alerts.push(`Reflow peak temp warning: ${reflowTemp}°C out of thermal window!`);
        }

        const hasTorqueVariance = Math.abs(torqueNm - 0.35) > 0.02;
        if (hasTorqueVariance) {
          alerts.push(`Screwdriver torque alert: ${torqueNm} Nm exceeds ±0.02 Nm tolerance!`);
        }

        const hasOxygenPpmAlert = oxygenPpm > 48;
        if (hasOxygenPpmAlert) {
          alerts.push(`Nitrogen chamber O2 alert: ${oxygenPpm} PPM exceeds 48 PPM!`);
        }

        return {
          ...prev,
          reflowTemp,
          oxygenPpm,
          torqueNm,
          hasTemperatureSpike,
          hasTorqueVariance,
          hasOxygenPpmAlert,
          activeAlerts: alerts,
          timestamp: new Date().toISOString(),
        };
      });
    }, 2500);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(intervalId);
    };
  }, []);

  // Station Transit Validation Handler
  const handleScanAndTransit = async () => {
    const cleanSerial = scannedSerial.trim().toUpperCase();

    if (cleanSerial.length < 15 || cleanSerial.length > 20) {
      setInterlockAlert({
        type: 'ERROR',
        title: 'Invalid IMEI / Serial Format',
        message: `IMEI [${cleanSerial}] is invalid. Cleanroom units must have a 15-20 digit UID.`,
      });
      return;
    }

    const targetIdx = STATION_SEQUENCE.findIndex((s) => s.key === selectedStation);
    const existingUnit = units.find((u) => u.serialNumber === cleanSerial);

    // 1. Genesis Station Check
    if (!existingUnit) {
      if (targetIdx !== 0) {
        setInterlockAlert({
          type: 'ERROR',
          title: 'Genesis Station Interlock Denied',
          message: `Unit [${cleanSerial}] is not registered in the cleanroom registry. New units must enter at Step 1 [${STATION_SEQUENCE[0].label}].`,
        });
        return;
      }
    } else {
      // 2. Prior Station Status & Sequential Check
      const currentIdx = STATION_SEQUENCE.findIndex((s) => s.key === existingUnit.currentStation);

      if (existingUnit.status === 'REJECTED' && qcDisposition !== 'PASSED') {
        setInterlockAlert({
          type: 'ERROR',
          title: 'Quarantine Lock Active',
          message: `Unit [${cleanSerial}] failed QC at station [${existingUnit.currentStation}] and is currently locked in quarantine. It cannot advance without rework inspection clearance.`,
        });
        return;
      }

      if (targetIdx > currentIdx + 1) {
        const skippedStation = STATION_SEQUENCE[currentIdx + 1];
        setInterlockAlert({
          type: 'ERROR',
          title: 'Station Skipping Interlock Denied',
          message: `Unit [${cleanSerial}] skipped required station Step ${skippedStation.stepNumber} [${skippedStation.label}]. Sequential pass certification is required.`,
        });
        return;
      }
    }

    // 3. Generate Checkpoint Metrics
    const newCheckpoint: StationCheckpoint = {
      checkpointId: `chk-${Date.now()}`,
      station: selectedStation,
      status: qcDisposition,
      operatorId,
      operatorName,
      timestamp: new Date().toISOString(),
      testMetrics: {
        reflowPeakTemp: telemetry.reflowTemp,
        torqueNm: telemetry.torqueNm,
        oxygenPpm: telemetry.oxygenPpm,
      },
      defectReason: qcDisposition === 'REJECTED' ? defectReason || 'Operator flagged deviation' : undefined,
      remarks: scanRemarks || (qcDisposition === 'PASSED' ? 'Cleanroom sign-off cleared.' : 'Diverted to rework bin.'),
    };

    // 4. Update or Add Unit
    if (!existingUnit) {
      const newUnit: SerializedUnit = {
        id: `ser-${Date.now()}`,
        serialNumber: cleanSerial,
        productId: 'prod-phone-001',
        productName: 'Apex Pro 5G - Cleanroom Board',
        currentStation: selectedStation,
        status: qcDisposition,
        historyLogs: [newCheckpoint],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUnits((prev) => [newUnit, ...prev]);
    } else {
      setUnits((prev) =>
        prev.map((u) =>
          u.serialNumber === cleanSerial
            ? {
                ...u,
                currentStation: selectedStation,
                status: qcDisposition,
                historyLogs: [...u.historyLogs, newCheckpoint],
                updatedAt: new Date().toISOString(),
              }
            : u
        )
      );
    }

    // Attempt backend sync
    try {
      await fetch('/api/production/serialized/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: cleanSerial,
          targetStation: selectedStation,
          operatorId,
          operatorName,
          qcDisposition,
          defectReason: qcDisposition === 'REJECTED' ? defectReason : undefined,
          remarks: scanRemarks,
        }),
      });
    } catch (err) {}

    // Success Alert
    if (qcDisposition === 'PASSED') {
      setInterlockAlert({
        type: 'SUCCESS',
        title: `Station Gate Cleared: ${selectedStation}`,
        message: `IMEI [${cleanSerial}] verified and passed to Step ${targetIdx + 1} [${STATION_SEQUENCE[targetIdx].label}]. Digital audit log recorded.`,
      });
    } else {
      setInterlockAlert({
        type: 'WARNING',
        title: `Defect Recorded: ${selectedStation}`,
        message: `IMEI [${cleanSerial}] flagged REJECTED. Diverted to cleanroom rework zone. Reason: ${defectReason || 'Deviation detected'}.`,
      });
    }

    setDefectReason('');
    setScanRemarks('');
  };

  // Quick preset helper
  const handleSelectPreset = (serial: string, station: ProductionStationType) => {
    setScannedSerial(serial);
    setSelectedStation(station);
  };

  // Telemetry variance simulation
  const handleSimulateVariance = (type: 'TEMP_SPIKE' | 'TORQUE_OUT_OF_BOUNDS' | 'O2_PPM_HIGH' | 'NORMAL') => {
    if (type === 'TEMP_SPIKE') {
      setTelemetry((prev) => ({
        ...prev,
        reflowTemp: 254.8,
        hasTemperatureSpike: true,
        activeAlerts: ['CRITICAL: Reflow peak temperature spiked to 254.8°C! Component degradation risk.'],
      }));
    } else if (type === 'TORQUE_OUT_OF_BOUNDS') {
      setTelemetry((prev) => ({
        ...prev,
        torqueNm: 0.384,
        hasTorqueVariance: true,
        activeAlerts: ['CRITICAL: Robotic screwdriver torque reached 0.384 Nm (> 0.370 Nm limit)!'],
      }));
    } else if (type === 'O2_PPM_HIGH') {
      setTelemetry((prev) => ({
        ...prev,
        oxygenPpm: 64.0,
        hasOxygenPpmAlert: true,
        activeAlerts: ['WARNING: Nitrogen reflow oxygen level at 64.0 PPM. Solder oxidation risk.'],
      }));
    } else {
      setTelemetry((prev) => ({
        ...prev,
        reflowTemp: 249.4,
        torqueNm: 0.351,
        oxygenPpm: 34.2,
        hasTemperatureSpike: false,
        hasTorqueVariance: false,
        hasOxygenPpmAlert: false,
        activeAlerts: [],
      }));
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Cleanroom Class-1000 Live
            </span>
            <span className="text-xs text-slate-500">Shop Floor Line 01</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Serialized Unit (IMEI/Serial) Cleanroom Tracking & IoT Telemetry
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Sub-assembly station transit validation, 15-digit IMEI lifecycle audit trail, and continuous sensor streaming.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/production/floor"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition"
          >
            Digital Job Cards
          </Link>
          <Link
            href="/inventory/capacity"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            Assembly Capacity Matrix
          </Link>
        </div>
      </div>

      {/* Live Telemetry KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1: Overall Cleanroom Line OEE */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Line OEE Performance
            </span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Gauge className="w-5 h-5" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {telemetry.oeeComposite}%
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Optimal (&gt;85%)
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <div>
              <div className="text-slate-400">Availability</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {telemetry.oeeAvailability}%
              </div>
            </div>
            <div>
              <div className="text-slate-400">Performance</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {telemetry.oeePerformance}%
              </div>
            </div>
            <div>
              <div className="text-slate-400">Quality</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {telemetry.oeeQuality}%
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: Nitrogen Reflow Peak Zone Temp (°C) & Oxygen PPM */}
        <div
          className={cn(
            'p-5 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm relative overflow-hidden transition-colors',
            telemetry.hasTemperatureSpike || telemetry.hasOxygenPpmAlert
              ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20'
              : 'border-slate-200 dark:border-slate-800'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nitrogen Reflow Oven (Peak Zone)
            </span>
            <span
              className={cn(
                'p-2 rounded-xl',
                telemetry.hasTemperatureSpike
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 animate-pulse'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
              )}
            >
              <Thermometer className="w-5 h-5" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={cn(
                'text-3xl font-black',
                telemetry.hasTemperatureSpike ? 'text-rose-600' : 'text-slate-900 dark:text-white'
              )}
            >
              {telemetry.reflowTemp}°C
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Window: 246.0 - 252.0°C
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500">Chamber Oxygen:</span>
            <span
              className={cn(
                'font-extrabold px-2 py-0.5 rounded-full text-[11px]',
                telemetry.hasOxygenPpmAlert
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
              )}
            >
              {telemetry.oxygenPpm} PPM {telemetry.hasOxygenPpmAlert ? '(ALERT > 48)' : '(Nominal)'}
            </span>
          </div>
        </div>

        {/* KPI 3: Robotic Screwdriver Torque Calibration (Nm) */}
        <div
          className={cn(
            'p-5 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm relative overflow-hidden transition-colors',
            telemetry.hasTorqueVariance
              ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20'
              : 'border-slate-200 dark:border-slate-800'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Robotic Screwdriver Calibration
            </span>
            <span
              className={cn(
                'p-2 rounded-xl',
                telemetry.hasTorqueVariance
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 animate-pulse'
                  : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
              )}
            >
              <Wrench className="w-5 h-5" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={cn(
                'text-3xl font-black',
                telemetry.hasTorqueVariance ? 'text-rose-600' : 'text-slate-900 dark:text-white'
              )}
            >
              {telemetry.torqueNm} Nm
            </span>
            <span className="text-xs font-medium text-slate-500">
              Target: 0.350 Nm (±0.02)
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500">Variance Delta:</span>
            <span
              className={cn(
                'font-extrabold px-2 py-0.5 rounded-full text-[11px]',
                telemetry.hasTorqueVariance
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
              )}
            >
              {(telemetry.torqueNm - 0.35).toFixed(3)} Nm{' '}
              {telemetry.hasTorqueVariance ? '(OUT OF TOLERANCE)' : '(In Spec)'}
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Trigger Bar (Interactive Testing) */}
      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold">
          <Activity className="w-4 h-4 text-blue-500" />
          <span>IoT Machine Sensor Variance Simulation:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSimulateVariance('TEMP_SPIKE')}
            className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 font-medium transition"
          >
            Thermal Spike (254.8°C)
          </button>
          <button
            onClick={() => handleSimulateVariance('TORQUE_OUT_OF_BOUNDS')}
            className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 font-medium transition"
          >
            Torque Variance (0.384 Nm)
          </button>
          <button
            onClick={() => handleSimulateVariance('O2_PPM_HIGH')}
            className="px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900 hover:bg-orange-100 font-medium transition"
          >
            High O2 PPM (64 PPM)
          </button>
          <button
            onClick={() => handleSimulateVariance('NORMAL')}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 font-medium transition"
          >
            Reset to Nominal
          </button>
        </div>
      </div>

      {/* Active Interlock Notification Banner */}
      {interlockAlert && (
        <div
          className={cn(
            'p-4 rounded-xl border flex items-start justify-between gap-4 animate-fade-in',
            interlockAlert.type === 'SUCCESS' &&
              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
            interlockAlert.type === 'ERROR' &&
              'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200',
            interlockAlert.type === 'WARNING' &&
              'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          )}
        >
          <div className="flex items-start gap-3">
            {interlockAlert.type === 'SUCCESS' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            )}
            {interlockAlert.type === 'ERROR' && (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0 animate-bounce" />
            )}
            {interlockAlert.type === 'WARNING' && (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="text-sm font-bold">{interlockAlert.title}</div>
              <div className="text-xs opacity-90 mt-0.5">{interlockAlert.message}</div>
            </div>
          </div>
          <button
            onClick={() => setInterlockAlert(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Cleanroom Transit Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Barcode/IMEI Scanner & Station Transit Console */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cleanroom Station Transit Scanner
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Interlock Enforced
            </span>
          </div>

          {/* Barcode / IMEI Scan Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              15-Digit IMEI or Cleanroom Sub-Assembly UID
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                <QrCode className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={scannedSerial}
                onChange={(e) => setScannedSerial(e.target.value.toUpperCase())}
                placeholder="e.g. 864902061234567"
                maxLength={20}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-lg font-bold tracking-wider focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
              />
            </div>

            {/* Quick-Scan Preset Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400">Quick-Scan Presets:</span>
              <button
                onClick={() => handleSelectPreset('864902061234567', 'PACKAGING')}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                ...567 (Step 5 Done)
              </button>
              <button
                onClick={() => handleSelectPreset('864902061234568', 'RF_ANTENNA')}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                ...568 (Step 3 Done)
              </button>
              <button
                onClick={() => handleSelectPreset('864902061234569', 'SCREWDRIVING')}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition"
              >
                ...569 (Quarantine)
              </button>
              <button
                onClick={() => {
                  const newSerial = `86490206${Math.floor(1000000 + Math.random() * 9000000)}`;
                  handleSelectPreset(newSerial, 'SMT_LINE');
                }}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
              >
                + New Cleanroom Board
              </button>
            </div>
          </div>

          {/* Touch-Friendly Station Transit Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Select Destination Station Checkpoint
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STATION_SEQUENCE.map((station) => {
                const isSelected = selectedStation === station.key;
                return (
                  <button
                    key={station.key}
                    type="button"
                    onClick={() => setSelectedStation(station.key)}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[90px]',
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'text-[10px] font-black px-1.5 py-0.5 rounded',
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        )}
                      >
                        Step {station.stepNumber}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-tight">
                        {station.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {station.shortDesc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operator and QC Decision Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operator ID & Name
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  className="w-1/2 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-slate-900 dark:text-white"
                  placeholder="OP-CLEAN-402"
                />
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-1/2 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  placeholder="Rajesh K."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                QC Gate Sign-Off Disposition
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQcDisposition('PASSED')}
                  className={cn(
                    'flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition',
                    qcDisposition === 'PASSED'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Pass Checkpoint
                </button>
                <button
                  type="button"
                  onClick={() => setQcDisposition('REJECTED')}
                  className={cn(
                    'flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition',
                    qcDisposition === 'REJECTED'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                  )}
                >
                  <XCircle className="w-4 h-4" />
                  Flag Defect
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Defect Cause Input */}
          {qcDisposition === 'REJECTED' && (
            <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2">
              <label className="block text-xs font-bold text-rose-800 dark:text-rose-300">
                Root Cause & Quarantine Defect Description
              </label>
              <select
                value={defectReason}
                onChange={(e) => setDefectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="">Select Root Cause...</option>
                <option value="Solder bridging detected on BGA pins">
                  SMT: Solder bridging detected on BGA pins
                </option>
                <option value="Torque exceeded ±0.02 Nm calibration threshold">
                  Screwdriving: Torque exceeded ±0.02 Nm calibration
                </option>
                <option value="VSWR high (1.45 > 1.25 limit)">
                  RF: Phased array VSWR high (1.45 &gt; 1.25 limit)
                </option>
                <option value="Vacuum chamber pressure loss (< 95 kPa)">
                  Battery: Vacuum chamber pressure loss (&lt; 95 kPa)
                </option>
                <option value="IMEI laser barcode verify mismatch">
                  Packaging: IMEI laser barcode verify mismatch
                </option>
              </select>
            </div>
          )}

          {/* Action Button: Commit Station Transit */}
          <button
            onClick={handleScanAndTransit}
            className={cn(
              'w-full py-3.5 rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 transform active:scale-[0.99]',
              qcDisposition === 'PASSED'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
            )}
          >
            <ScanLine className="w-5 h-5" />
            Commit Station Scan & Advance Unit
          </button>
        </div>

        {/* Right Column: Active Unit Stepper Progress & Specification Matrix */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Cleanroom Unit
                </span>
                <div className="text-base font-mono font-black text-slate-900 dark:text-white">
                  {activeUnit?.serialNumber || scannedSerial}
                </div>
              </div>
              <span
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-extrabold',
                  activeUnit?.status === 'PASSED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : activeUnit?.status === 'REJECTED'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                )}
              >
                {activeUnit?.status || 'NEW_BOARD'}
              </span>
            </div>

            <div className="text-xs text-slate-500">
              Model:{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                {activeUnit?.productName || 'Apex Pro 5G Cleanroom Board'}
              </strong>
            </div>

            {/* Linear Cleanroom Stepper Progress */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                6-Stage Cleanroom Station Pipeline
              </span>

              <div className="space-y-2.5">
                {STATION_SEQUENCE.map((st, idx) => {
                  const checkpoint = activeUnit?.historyLogs.find((h) => h.station === st.key);
                  const isPassed = checkpoint?.status === 'PASSED';
                  const isRejected = checkpoint?.status === 'REJECTED';
                  const isCurrent = activeUnit?.currentStation === st.key;

                  return (
                    <div
                      key={st.key}
                      className={cn(
                        'flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-colors',
                        isPassed && 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900',
                        isRejected && 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900',
                        !checkpoint && isCurrent && 'border-blue-400 bg-blue-50/40 dark:bg-blue-950/30',
                        !checkpoint && !isCurrent && 'border-slate-100 dark:border-slate-800 opacity-60'
                      )}
                    >
                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {isPassed && (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        {isRejected && (
                          <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center animate-pulse">
                            <XCircle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {!checkpoint && (
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-[10px]',
                              isCurrent
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400 animate-spin'
                                : 'border-slate-300 text-slate-400'
                            )}
                          >
                            {st.stepNumber}
                          </div>
                        )}
                      </div>

                      {/* Station Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {st.label}
                          </span>
                          {checkpoint && (
                            <span className="text-[10px] text-slate-400">
                              {new Date(checkpoint.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {checkpoint?.defectReason ? (
                            <span className="text-rose-600 font-semibold truncate block">
                              {checkpoint.defectReason}
                            </span>
                          ) : (
                            st.nominalSpecs
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Automated Checkpoint Verification
            </div>
            <p>
              Each station scans physical laser-etched 2D Datamatrix and validates live telemetry from industrial controllers before permitting outward transit.
            </p>
          </div>
        </div>
      </div>

      {/* Live Audit Trail Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Live Serialized Unit Audit Trail Feed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chronological log of station transitions, operator sign-offs, and calibrated sensor readings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              Total Logged Checkpoints: <strong>{auditTrailFeed.length}</strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">IMEI / Serial #</th>
                <th className="py-3 px-4">Station Checkpoint</th>
                <th className="py-3 px-4">Disposition</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Test Metrics & Tolerances</th>
                <th className="py-3 px-4">Inspection Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditTrailFeed.map((entry, i) => {
                const isPass = entry.checkpoint.status === 'PASSED';
                return (
                  <tr
                    key={`${entry.serialNumber}-${i}`}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(entry.checkpoint.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    {/* Serial */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setScannedSerial(entry.serialNumber)}
                        className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {entry.serialNumber}
                      </button>
                    </td>

                    {/* Station */}
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {entry.checkpoint.station}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px]',
                          isPass
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        )}
                      >
                        {isPass ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {entry.checkpoint.status}
                      </span>
                    </td>

                    {/* Operator */}
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      <div className="font-semibold">{entry.checkpoint.operatorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {entry.checkpoint.operatorId}
                      </div>
                    </td>

                    {/* Test Metrics */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {entry.checkpoint.testMetrics ? (
                        <div className="space-y-0.5">
                          {Object.entries(entry.checkpoint.testMetrics)
                            .slice(0, 2)
                            .map(([k, v]) => (
                              <div key={k} className="truncate">
                                <span className="text-slate-400">{k}:</span>{' '}
                                <strong className="text-slate-800 dark:text-slate-200">
                                  {typeof v === 'number' ? v : String(v)}
                                </strong>
                              </div>
                            ))}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Remarks / Defect */}
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                      {entry.checkpoint.defectReason ? (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          {entry.checkpoint.defectReason}
                        </span>
                      ) : (
                        entry.checkpoint.remarks || 'Standard sign-off.'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

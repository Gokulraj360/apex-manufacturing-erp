'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Radio,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Server,
  Layers,
  Thermometer,
  Gauge,
  Barcode,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import { generateAndDownloadWordDoc } from '@/lib/wordDocumentGenerator';

interface DiagnosticStep {
  id: number;
  name: string;
  category: string;
  expectedRange: string;
  measuredValue: string;
  status: 'PENDING' | 'TESTING' | 'PASS' | 'FAIL';
  metricUnit: string;
}

const INITIAL_STEPS: DiagnosticStep[] = [
  {
    id: 1,
    name: 'Power Rail VDD_MAIN Voltage & Quiescent Current',
    category: 'Power Management',
    expectedRange: '3.25V - 3.35V / < 250mA',
    measuredValue: '3.312 V / 218 mA',
    status: 'PASS',
    metricUnit: 'Volts / mA',
  },
  {
    id: 2,
    name: 'Sub-6GHz RF 5G NR Tx Power & RSSI Attenuation',
    category: 'RF Telemetry',
    expectedRange: '+23.0 dBm ± 1.5 dBm',
    measuredValue: '+23.4 dBm (RSSI -42 dBm)',
    status: 'PASS',
    metricUnit: 'dBm',
  },
  {
    id: 3,
    name: 'OLED Display Sub-Pixel Drive & Optical Color Delta-E',
    category: 'Display & Optoelectronics',
    expectedRange: 'ΔE < 1.5 / 0 Dead Pixels',
    measuredValue: 'ΔE 0.82 / 0 Defects Detected',
    status: 'PASS',
    metricUnit: 'Color Delta-E',
  },
  {
    id: 4,
    name: 'Battery Internal AC Impedance (1kHz ESR) & Thermals',
    category: 'Energy Storage',
    expectedRange: '< 45 mΩ / Temp < 38.0°C',
    measuredValue: '38.4 mΩ / 31.8°C',
    status: 'PASS',
    metricUnit: 'milli-Ohms / °C',
  },
  {
    id: 5,
    name: 'Hardware Security Module (HSM) Root-of-Trust Key Injection',
    category: 'Cryptographic Security',
    expectedRange: 'ECDSA P-384 Key Verified',
    measuredValue: 'Key Injected & Provisioned',
    status: 'PASS',
    metricUnit: 'Cert Hash Verified',
  },
];

interface QuarantineItem {
  serialNumber: string;
  productModel: string;
  failureCode: string;
  failureStage: string;
  measuredValue: string;
  quarantineTimestamp: string;
  assignedBay: string;
  status: 'PENDING_TRIAGE' | 'IN_REWORK' | 'SCRAP_AUTHORIZATION';
}

const SAMPLE_QUARANTINE: QuarantineItem[] = [
  {
    serialNumber: 'APX-GW-2026-90412',
    productModel: 'Apex Industrial Edge Gateway Gen 3',
    failureCode: 'ERR-RF-TX-ATTEN',
    failureStage: 'Sub-6GHz RF Tx Power Check',
    measuredValue: '+18.2 dBm (Expected > +21.5 dBm)',
    quarantineTimestamp: '2026-10-22 09:34 AM',
    assignedBay: 'RF Rework Bay 2',
    status: 'IN_REWORK',
  },
  {
    serialNumber: 'APX-GW-2026-90488',
    productModel: 'Apex Industrial Edge Gateway Gen 3',
    failureCode: 'ERR-BATT-HIGH-ESR',
    failureStage: 'Battery Internal AC Impedance',
    measuredValue: '58.2 mΩ (Expected < 45 mΩ)',
    quarantineTimestamp: '2026-10-22 08:15 AM',
    assignedBay: 'Battery Pack Quarantine Cell',
    status: 'PENDING_TRIAGE',
  },
];

export default function HardwareDiagnosticsPage() {
  const [activeTab, setActiveTab] = useState<'BENCH' | 'TELEMETRY' | 'QUARANTINE' | 'YIELD'>('BENCH');
  const [scannedSerial, setScannedSerial] = useState('APX-GW-2026-90510');
  const [steps, setSteps] = useState<DiagnosticStep[]>(INITIAL_STEPS);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<'PASS' | 'FAIL' | 'RUNNING' | null>('PASS');

  const startAutomatedSequence = () => {
    setIsRunning(true);
    setTestResult('RUNNING');

    // Reset steps to pending
    setSteps((prev) => prev.map((s) => ({ ...s, status: 'PENDING' })));

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setSteps((prev) =>
          prev.map((s, idx) => (idx === current ? { ...s, status: 'PASS' } : s))
        );
        current++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setTestResult('PASS');
      }
    }, 700);
  };

  const handleExportTestBenchDoc = () => {
    generateAndDownloadWordDoc(`Apex_Hardware_Diagnostics_Dossier_${scannedSerial}`, {
      title: 'AUTOMATED HARDWARE DIAGNOSTICS & STATION CALIBRATION DOSSIER',
      documentRef: `ATE-DIAG-2026-ST4-${scannedSerial.slice(-5)}`,
      classification: 'OFFICIAL QUALITY RECORD // IATF 16949 & ISO 9001 COMPLIANT',
      department: 'Advanced Manufacturing Quality Engineering & ATE Operations',
      author: 'Elena Rostova, VP Quality & Reliability',
      summary: `Automated Test Equipment (ATE) diagnostic telemetry, RF Sub-6GHz wireless calibration verification, BGA micro-solder continuity testing, and automated defect sorting record for Device Under Test (DUT) Serial: ${scannedSerial}.`,
      sections: [
        {
          heading: '1. Device Under Test (DUT) & Test Bench Station Configuration',
          content: [
            `The unit serial ${scannedSerial} was evaluated on Automated Test Station ST-04 (Cleanroom Bay 4) running automated firmware flash build APX-OS-v4.1.2-RC3.`,
            `All RF test parameters were measured utilizing high-precision Rohde & Schwarz / Keysight vector network analyzers with active temperature compensation.`
          ],
          table: {
            headers: ['Test Station Parameter', 'Measured Telemetry / Configuration', 'Calibration Reference', 'Result Status'],
            rows: [
              ['Target Device Under Test', `${scannedSerial} (Apex Industrial IoT Gateway)`, 'Laser Etched 2D Datamatrix', 'VERIFIED'],
              ['Motherboard PCB Revision', 'Rev 4.2B (Lead-Free ENIG Gold Finish)', 'BOM Hash #8921a', 'MATCHED'],
              ['Station Calibration Expiry', '2027-03-31 (Keysight Metrology Lab)', 'CAL-CERT-2026-991', 'ACTIVE VALID'],
              ['First Pass Yield (FPY)', '98.4% across 10,000 Station Cycles', 'Benchmark ≥ 98.0%', 'EXCEEDS TARGET'],
              ['Conveyor Robotic Routing', 'Automated Diverter Arm 1 -> Clean Packing', 'Zero Operator Touch', 'ROUTED TO PACK']
            ]
          }
        },
        {
          heading: '2. Multi-Vector Diagnostic Step Execution Ledger',
          content: [
            'All diagnostic steps were executed sequentially via automated JTAG / SWD test fixtures with milliamp-level power rails monitoring.'
          ],
          table: {
            headers: ['Diagnostic Step', 'Domain / Category', 'Nominal Range', 'Measured Value', 'Verification Status'],
            rows: [
              ['SoC BIST Logic Self-Test', 'Core Processor', '100% Logic Vectors Pass', '100% Vector Pass (0 Err)', 'PASSED'],
              ['DDR5 Memory Bus Stress', 'RAM Subsystem', 'Zero Bit Flips (> 100M Cycles)', '0 Bit Flips / Error-Free', 'PASSED'],
              ['RF Sub-6GHz Output Power', 'Wireless / 5G', '21.5 dBm - 23.5 dBm', '22.8 dBm (Calibrated)', 'PASSED'],
              ['Battery Internal Impedance', 'Power / BMS', '< 45.0 mΩ', '31.4 mΩ (Optimal)', 'PASSED'],
              ['OLED Display Optical Uniformity', 'Display / Optics', 'Delta E < 1.50', 'Delta E = 0.82', 'PASSED'],
              ['Thermal Chamber Soak Run', 'Environmental', 'Core Temp < 78.0°C at 100% Load', '64.2°C Stabilized', 'PASSED']
            ]
          },
          callout: {
            title: 'Quality Concession Notice',
            text: 'This unit has fulfilled all IATF 16949 automotive / industrial tier-1 burn-in benchmarks and is certified for immediate commercial shipment.',
            type: 'success'
          }
        },
        {
          heading: '3. Motherboard PCB CAD Blueprint & Coordinate Metrology Verification',
          subheading: 'IPC-6012 Class 3 / ASME Y14.5M Geometric Dimensioning & Test Pad Grid',
          cadBlueprint: {
            drawingNumber: `DWG-PCB-${scannedSerial.slice(-6)}`,
            revision: 'D',
            partName: `Apex IoT Motherboard Assembly (${scannedSerial})`,
            material: 'FR-4 High-Tg (Tg 170°C) with Lead-Free ENIG Gold Finish',
            surfaceFinish: 'Electroless Nickel Immersion Gold (ENIG 0.05 µm Au)',
            units: 'MILLIMETERS [mm]',
            scale: '1:1',
            gdtCallouts: [
              {
                symbol: '⌖',
                tolerance: '⌀ 0.03 Ⓜ',
                datumRefs: 'A | B | C',
                description: 'BGA 1156-pin solder ball land grid array true position',
              },
              {
                symbol: '⌓',
                tolerance: '0.02 mm',
                datumRefs: 'A | B',
                description: 'PCB substrates surface coplanarity across SMT mounting plane',
              },
              {
                symbol: '⟂',
                tolerance: '0.025 mm',
                datumRefs: 'A',
                description: 'Board edge routing perpendicularity to primary datum surface',
              },
            ],
            dimensions: [
              {
                featureId: 'PCB-DIM-01',
                featureDescription: 'Substrate Length Outline (Router Edge)',
                nominalMm: 146.50,
                toleranceMm: '±0.05 mm',
                uslMm: 146.55,
                lslMm: 146.45,
                measuredMm: 146.50,
                deviationMm: '0.00',
                inspectionMethod: 'Automated Optical Inspection (AOI)',
                status: 'CONFORMING',
              },
              {
                featureId: 'PCB-DIM-02',
                featureDescription: 'Substrate Width Outline (Router Edge)',
                nominalMm: 72.80,
                toleranceMm: '±0.03 mm',
                uslMm: 72.83,
                lslMm: 72.77,
                measuredMm: 72.81,
                deviationMm: '+0.01',
                inspectionMethod: 'Automated Optical Inspection (AOI)',
                status: 'CONFORMING',
              },
              {
                featureId: 'PCB-DIM-03',
                featureDescription: 'Overall Multi-Layer Thickness (12-Layer Stackup)',
                nominalMm: 1.60,
                toleranceMm: '±0.04 mm',
                uslMm: 1.64,
                lslMm: 1.56,
                measuredMm: 1.61,
                deviationMm: '+0.01',
                inspectionMethod: 'Micrometer Laser Interferometer',
                status: 'CONFORMING',
              },
              {
                featureId: 'PCB-DIM-04',
                featureDescription: 'BGA Ball Array Coplanarity (Max Warpage)',
                nominalMm: 0.00,
                toleranceMm: '≤ 0.05 mm',
                uslMm: 0.05,
                lslMm: 0.00,
                measuredMm: 0.02,
                deviationMm: '+0.02',
                inspectionMethod: 'Koh Young 3D Solder Paste / BGA Scanner',
                status: 'CRITICAL_PASS',
              },
            ],
          },
        }
      ],
      signatories: [
        {
          name: 'Elena Rostova',
          role: 'VP Quality & Product Reliability',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'Vikram Sundaram',
          role: 'Chief ATE Diagnostics Systems Engineer',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'Alexander Vance',
          role: 'Plant Director & General Manager',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        }
      ]
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Automated Station Hardware Diagnostics Suite
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Activity className="w-3.5 h-3.5 mr-1" />
              Automated Test Equipment (ATE) Online
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time shopfloor hardware diagnostic verification, RF telemetry testing, and automated defect conveyor routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card border border-border rounded-lg px-3 py-1.5 shadow-sm">
            <Barcode className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              value={scannedSerial}
              onChange={(e) => setScannedSerial(e.target.value)}
              placeholder="Scan DUT Serial / IMEI..."
              className="bg-transparent text-xs text-foreground font-mono focus:outline-none w-48"
            />
          </div>
          <button
            onClick={handleExportTestBenchDoc}
            title="Download Official ATE Hardware Diagnostics Dossier in Word Format"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Export Test Dossier (.doc)
          </button>
          <button
            onClick={startAutomatedSequence}
            disabled={isRunning}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Executing Test Suite...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Diagnostics
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">First Pass Yield (FPY)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">98.42%</span>
            <span className="text-xs text-muted-foreground ml-2">Cleanroom Station 4</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">+0.3% vs target 98.1%</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diagnostic Takt Time</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">18.6s</span>
            <span className="text-xs text-muted-foreground ml-2">per device unit</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">194 units tested / hr</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quarantine Rework Queue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600">2 Units</span>
            <span className="text-xs text-muted-foreground ml-2">in rework bay</span>
          </div>
          <div className="mt-2 text-xs text-amber-600 font-medium">Auto-diverter functional</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Chamber Thermal Temp</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">+24.2 °C</span>
            <span className="text-xs text-muted-foreground ml-2">45.0% RH</span>
          </div>
          <div className="mt-2 text-xs text-purple-600 font-medium">Within ISO Class 5 limits</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('BENCH')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'BENCH'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cpu className="w-4 h-4" />
            DUT Automated Test Bench
          </button>
          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'TELEMETRY'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Gauge className="w-4 h-4" />
            Environmental Chamber Telemetry
          </button>
          <button
            onClick={() => setActiveTab('QUARANTINE')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'QUARANTINE'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Automated Quarantine & Rework Routing
          </button>
          <button
            onClick={() => setActiveTab('YIELD')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'YIELD'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Yield Pareto & Error Breakdown
          </button>
        </nav>
      </div>

      {/* TAB 1: TEST BENCH */}
      {activeTab === 'BENCH' && (
        <div className="space-y-4">
          {/* Active DUT Banner */}
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-foreground font-mono">{scannedSerial}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      testResult === 'PASS'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : testResult === 'FAIL'
                        ? 'bg-rose-500/10 text-rose-600'
                        : 'bg-blue-500/10 text-blue-600 animate-pulse'
                    }`}
                  >
                    {testResult === 'PASS' ? 'ALL CHECKS PASSED' : testResult === 'RUNNING' ? 'TESTING IN PROGRESS' : 'VERIFICATION FAILED'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Model: Apex Industrial Edge Gateway Gen 3 (SoC: Quad ARM Cortex-A72 @ 1.8GHz, 8GB ECC DDR4)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <div className="text-muted-foreground">Test Station Fixture:</div>
                <div className="font-semibold text-foreground">ATE-JIG-AUSTIN-04</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">Operator:</div>
                <div className="font-semibold text-foreground">Alex Jordan (Lead Tech)</div>
              </div>
            </div>
          </div>

          {/* Test Steps Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3 w-12">Seq</th>
                  <th className="p-3">Diagnostic Subsystem Routine</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Engineering Spec Limits</th>
                  <th className="p-3">Measured Telemetry</th>
                  <th className="p-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {steps.map((step) => (
                  <tr key={step.id} className="hover:bg-accent/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-muted-foreground">#{step.id}</td>
                    <td className="p-3 font-semibold text-foreground text-sm">{step.name}</td>
                    <td className="p-3 text-muted-foreground">{step.category}</td>
                    <td className="p-3 font-mono text-muted-foreground">{step.expectedRange}</td>
                    <td className="p-3 font-mono font-semibold text-foreground">{step.measuredValue}</td>
                    <td className="p-3 text-right">
                      {step.status === 'PASS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          PASS
                        </span>
                      ) : step.status === 'FAIL' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600">
                          <XCircle className="w-3.5 h-3.5" />
                          FAIL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                          QUEUED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SENSOR TELEMETRY */}
      {activeTab === 'TELEMETRY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border rounded-xl p-5 bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Thermal Chamber</span>
                <Thermometer className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">24.2 °C</div>
              <div className="text-xs text-muted-foreground mt-1">Set Point: 24.0°C ± 0.5°C</div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-3">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>

            <div className="border border-border rounded-xl p-5 bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Chamber Humidity</span>
                <Gauge className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">45.0 % RH</div>
              <div className="text-xs text-muted-foreground mt-1">ESD Safe Standard (40-60%)</div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-3">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div className="border border-border rounded-xl p-5 bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Nitrogen Purge Purity</span>
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">99.999%</div>
              <div className="text-xs text-muted-foreground mt-1">Grade 5.0 High Purity N2</div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-3">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '99%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUARANTINE ROUTING */}
      {activeTab === 'QUARANTINE' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground mb-1">Automated Conveyor Defect Diverter & Quarantine Desk</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Units failing any ATE diagnostic sequence are automatically diverted via pneumatic gate to isolation bays.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Device Serial Number</th>
                    <th className="p-3">Failure Diagnostic Code</th>
                    <th className="p-3">Failing Routine & Measurement</th>
                    <th className="p-3">Quarantine Timestamp</th>
                    <th className="p-3">Assigned Rework Bay</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SAMPLE_QUARANTINE.map((q) => (
                    <tr key={q.serialNumber} className="hover:bg-accent/40">
                      <td className="p-3 font-mono font-bold text-foreground">{q.serialNumber}</td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded text-[11px]">
                          {q.failureCode}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-foreground">{q.failureStage}</div>
                        <div className="text-[11px] text-muted-foreground">{q.measuredValue}</div>
                      </td>
                      <td className="p-3 text-muted-foreground">{q.quarantineTimestamp}</td>
                      <td className="p-3 font-medium text-foreground">{q.assignedBay}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            q.status === 'IN_REWORK'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {q.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => alert(`Opening diagnostic debug schematic for ${q.serialNumber}`)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Open Rework Ticket
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

      {/* TAB 4: YIELD PARETO */}
      {activeTab === 'YIELD' && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Defect Pareto Analysis & Root-Cause Distribution</h2>
          <p className="text-xs text-muted-foreground">Top defect contributors across the last 10,000 units tested on Cleanroom Bay 4.</p>

          <div className="space-y-3">
            {[
              { code: 'ERR-RF-TX-ATTEN', desc: 'RF Sub-6GHz Output Power Low (< 21.5 dBm)', count: 42, pct: 44.2, color: 'bg-rose-500' },
              { code: 'ERR-BATT-HIGH-ESR', desc: 'Battery Internal Impedance Exceeds 45 mΩ', count: 28, pct: 29.5, color: 'bg-amber-500' },
              { code: 'ERR-BGA-BRIDGING', desc: 'Solder Micro-Bridging on SoC Pinouts', count: 15, pct: 15.8, color: 'bg-blue-500' },
              { code: 'ERR-OLED-DELTA-E', desc: 'Display Optical Calibration Out-of-Spec', count: 10, pct: 10.5, color: 'bg-purple-500' },
            ].map((p) => (
              <div key={p.code} className="border border-border rounded-lg p-3 bg-muted/10">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">{p.code}</span>
                    <span className="text-muted-foreground">• {p.desc}</span>
                  </div>
                  <span className="font-bold text-foreground">{p.count} units ({p.pct}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`${p.color} h-2 rounded-full`} style={{ width: `${p.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

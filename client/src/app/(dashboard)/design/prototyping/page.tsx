'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  Flame,
  Zap,
  ShieldCheck,
  Cpu,
  BarChart2,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  PrototypeTestLogItem,
  PrototypeTestType,
  PrototypeTestResult,
} from '@/types/design';

const INITIAL_TESTS: PrototypeTestLogItem[] = [
  {
    id: 'ptl-1',
    testLogNumber: 'PTL-2026-0035',
    cadModelId: 'cad-1',
    cadModel: {
      id: 'cad-1',
      modelCode: 'CAD-2026-0084',
      name: '5-Axis Spindle Head Assembly',
      version: 'v3.2',
    },
    prototypeSerial: 'PROTO-SPN-001',
    testType: 'STRESS_TEST',
    testParameters: {
      appliedLoadKn: 45.0,
      maxStressMpa: 285.4,
      testDurationHours: 120,
    },
    observedOutcome: 'Zero plastic deformation detected under continuous dynamic loading. Peak von Mises stress remained well below 7075-T6 yield limit.',
    result: 'PASSED',
    maxDeformationMm: 0.012,
    yieldSafetyFactor: 2.65,
    engineerInCharge: 'R&D FEA Lab (K. Rao)',
    testedAt: '2026-03-03T16:00:00Z',
    nextIterationRequired: false,
    createdAt: '2026-03-03T16:00:00Z',
    updatedAt: '2026-03-03T16:00:00Z',
  },
  {
    id: 'ptl-2',
    testLogNumber: 'PTL-2026-0038',
    cadModelId: 'cad-2',
    cadModel: {
      id: 'cad-2',
      modelCode: 'CAD-2026-0088',
      name: 'Planetary Gearbox Output Hub',
      version: 'v2.1',
    },
    prototypeSerial: 'PROTO-PLN-002',
    testType: 'TORQUE_LOAD_TEST',
    testParameters: {
      appliedLoadKn: 65.0,
      maxStressMpa: 420.0,
      testDurationHours: 72,
    },
    observedOutcome: 'Output spline teeth exhibited optimal contact mesh pattern with zero tooth root deflection or micro-pitting under 150% rated torque.',
    result: 'PASSED',
    maxDeformationMm: 0.008,
    yieldSafetyFactor: 2.15,
    engineerInCharge: 'Transmission Test Bench Lead',
    testedAt: '2026-03-05T12:00:00Z',
    nextIterationRequired: false,
    createdAt: '2026-03-05T12:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 'ptl-3',
    testLogNumber: 'PTL-2026-0041',
    cadModelId: 'cad-3',
    cadModel: {
      id: 'cad-3',
      modelCode: 'CAD-2026-0092',
      name: 'Hydraulic Manifold Block',
      version: 'v1.4',
    },
    prototypeSerial: 'PROTO-HYD-003',
    testType: 'THERMAL_CYCLING',
    testParameters: {
      minTempC: -40,
      maxTempC: 135,
      cycleCount: 500,
      testDurationHours: 96,
    },
    observedOutcome: 'Minor micro-channel pressure drop observed at -40°C due to viscosity gradient, but manifold structural sealing remained 100% intact.',
    result: 'CONDITIONAL_PASS',
    maxDeformationMm: 0.003,
    yieldSafetyFactor: 3.1,
    engineerInCharge: 'Aerospace Hydraulics Specialist',
    testedAt: '2026-02-27T10:00:00Z',
    nextIterationRequired: true,
    createdAt: '2026-02-27T10:00:00Z',
    updatedAt: '2026-02-27T10:00:00Z',
  },
];

export default function PrototypingPage() {
  const [tests, setTests] = useState<PrototypeTestLogItem[]>(INITIAL_TESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [testForm, setTestForm] = useState({
    cadModelId: 'cad-1',
    prototypeSerial: '',
    testType: 'STRESS_TEST' as PrototypeTestType,
    appliedLoadKn: 50.0,
    maxStressMpa: 310.0,
    testDurationHours: 48,
    observedOutcome: '',
    result: 'PASSED' as PrototypeTestResult,
    maxDeformationMm: 0.015,
    yieldSafetyFactor: 2.4,
    engineerInCharge: 'FEA Test Engineer',
    nextIterationRequired: false,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchTests = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/design/prototype/tests');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTests(data);
        }
      }
    } catch (err) {
      console.warn('API fallback', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: PrototypeTestLogItem = {
      id: `ptl-${Date.now()}`,
      testLogNumber: `PTL-2026-00${tests.length + 45}`,
      cadModelId: testForm.cadModelId,
      cadModel: {
        id: testForm.cadModelId,
        modelCode: 'CAD-2026-0084',
        name: 'Prototype Physical Specimen',
        version: 'v1.0',
      },
      prototypeSerial: testForm.prototypeSerial,
      testType: testForm.testType,
      testParameters: {
        appliedLoadKn: Number(testForm.appliedLoadKn),
        maxStressMpa: Number(testForm.maxStressMpa),
        testDurationHours: Number(testForm.testDurationHours),
      },
      observedOutcome: testForm.observedOutcome,
      result: testForm.result,
      maxDeformationMm: Number(testForm.maxDeformationMm),
      yieldSafetyFactor: Number(testForm.yieldSafetyFactor),
      engineerInCharge: testForm.engineerInCharge,
      testedAt: new Date().toISOString(),
      nextIterationRequired: testForm.nextIterationRequired,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/v1/design/prototype/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cadModelId: testForm.cadModelId,
          prototypeSerial: testForm.prototypeSerial,
          testType: testForm.testType,
          testParameters: {
            appliedLoadKn: Number(testForm.appliedLoadKn),
            maxStressMpa: Number(testForm.maxStressMpa),
            testDurationHours: Number(testForm.testDurationHours),
          },
          observedOutcome: testForm.observedOutcome,
          result: testForm.result,
          maxDeformationMm: Number(testForm.maxDeformationMm),
          yieldSafetyFactor: Number(testForm.yieldSafetyFactor),
          engineerInCharge: testForm.engineerInCharge,
          nextIterationRequired: testForm.nextIterationRequired,
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setTests([newTest, ...tests]);
    setShowLogModal(false);
    setNotification(`Prototype Test Log [${newTest.testLogNumber}] committed successfully!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.testLogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.prototypeSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.observedOutcome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.engineerInCharge.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || t.testType === typeFilter;
    const matchesResult = resultFilter === 'ALL' || t.result === resultFilter;

    return matchesSearch && matchesType && matchesResult;
  });

  const passedCount = tests.filter((t) => t.result === 'PASSED').length;
  const passRate = tests.length > 0 ? Math.round((passedCount / tests.length) * 100) : 100;
  const avgSafetyFactor =
    tests.length > 0
      ? (
          tests.reduce((acc, t) => acc + Number(t.yieldSafetyFactor || 0), 0) / tests.length
        ).toFixed(2)
      : '2.65';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/design" className="hover:text-violet-600 dark:hover:text-violet-400">
              Design Engineering
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Prototype Testing Console</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-500/10">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Prototype Stress Testing & FEA Validation
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  {passRate}% Pass Rate
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log mechanical load trials, thermal chamber runs, von Mises stress levels & yield safety factors
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTests}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-violet-600 dark:text-violet-400' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-xs font-semibold shadow-lg shadow-violet-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Test Run
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Test Trials</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{tests.length} Runs</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Physical & FEA simulation logs</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-medium">Passed Validation</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{passedCount} Specimens</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Met all yield deflection limits</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4">
          <span className="text-xs text-violet-600 dark:text-violet-400 block font-medium">Avg Yield Safety Factor</span>
          <span className="text-xl font-black text-violet-700 dark:text-violet-300 mt-1 block">{avgSafetyFactor} SF</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Robust design margin &gt; 2.0</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4">
          <span className="text-xs text-amber-600 dark:text-amber-400 block font-medium">Iterations Required</span>
          <span className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1 block">
            {tests.filter((t) => t.nextIterationRequired).length} Active
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Scheduled for revision loop</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search test log, specimen serial, engineer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Test Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">All Types</option>
              <option value="STRESS_TEST">Mechanical Stress Test</option>
              <option value="TORQUE_LOAD_TEST">Torque Load Trial</option>
              <option value="THERMAL_CYCLING">Thermal Cycling</option>
              <option value="FATIGUE_TEST">Fatigue Vibration</option>
              <option value="DIMENSIONAL_VERIFICATION">CMM Inspection</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>Result:</span>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">All Outcomes</option>
              <option value="PASSED">Passed</option>
              <option value="CONDITIONAL_PASS">Conditional Pass</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl p-5 hover:border-violet-400 dark:hover:border-violet-500/30 transition space-y-3"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-500/20 px-2 py-0.5 rounded">
                  {test.testLogNumber}
                </span>
                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-bold">
                  {test.prototypeSerial}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {test.cadModel?.name || 'Specimen Part'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {test.testType.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    test.result === 'PASSED'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                      : test.result === 'CONDITIONAL_PASS'
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                      : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                  }`}
                >
                  <Check className="h-3 w-3" /> {test.result}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{test.observedOutcome}</p>

            {/* Parameters Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-medium block">
                  Applied Load
                </span>
                <span className="text-slate-900 dark:text-white font-bold">{test.testParameters.appliedLoadKn || '—'} kN</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-medium block">
                  Peak von Mises Stress
                </span>
                <span className="text-violet-700 dark:text-violet-300 font-bold">{test.testParameters.maxStressMpa || '—'} MPa</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-medium block">
                  Max Elastic Deflection
                </span>
                <span className="text-slate-900 dark:text-white font-bold">{test.maxDeformationMm || 0} mm</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-medium block">
                  Yield Safety Factor
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {test.yieldSafetyFactor} SF
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
              <span>
                Test Engineer: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{test.engineerInCharge}</strong>
              </span>
              <span>
                Conducted: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{new Date(test.testedAt).toLocaleDateString()}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Log New Prototype Test */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Log Physical Test Outcome or FEA Simulation
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Prototype Serial / Batch *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PROTO-SPN-005"
                    value={testForm.prototypeSerial}
                    onChange={(e) =>
                      setTestForm({ ...testForm, prototypeSerial: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Test Type *</label>
                  <select
                    value={testForm.testType}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        testType: e.target.value as PrototypeTestType,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="STRESS_TEST">Mechanical Stress Load</option>
                    <option value="TORQUE_LOAD_TEST">Torque Load Trial</option>
                    <option value="THERMAL_CYCLING">Thermal Cycling Chamber</option>
                    <option value="FATIGUE_TEST">Fatigue Vibration</option>
                    <option value="DIMENSIONAL_VERIFICATION">CMM Dimensional Audit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Applied Load (kN)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={testForm.appliedLoadKn}
                    onChange={(e) =>
                      setTestForm({ ...testForm, appliedLoadKn: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Max Stress (MPa)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={testForm.maxStressMpa}
                    onChange={(e) =>
                      setTestForm({ ...testForm, maxStressMpa: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Yield Safety Factor</label>
                  <input
                    type="number"
                    step="0.05"
                    value={testForm.yieldSafetyFactor}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        yieldSafetyFactor: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Max Elastic Deflection (mm)</label>
                <input
                  type="number"
                  step="0.001"
                  value={testForm.maxDeformationMm}
                  onChange={(e) =>
                    setTestForm({
                      ...testForm,
                      maxDeformationMm: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Test Outcome & Observations *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Deflection limits, crack detection, micro-structure notes..."
                  value={testForm.observedOutcome}
                  onChange={(e) =>
                    setTestForm({ ...testForm, observedOutcome: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Result Classification *</label>
                  <select
                    value={testForm.result}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        result: e.target.value as PrototypeTestResult,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="PASSED">Passed (Approved)</option>
                    <option value="CONDITIONAL_PASS">Conditional Pass</option>
                    <option value="FAILED">Failed (Rework Required)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Engineer in Charge</label>
                  <input
                    type="text"
                    required
                    value={testForm.engineerInCharge}
                    onChange={(e) =>
                      setTestForm({ ...testForm, engineerInCharge: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
                >
                  Save Test Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

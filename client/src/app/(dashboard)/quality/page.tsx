'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BadgeCheck,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  ShieldCheck,
  Percent,
  DollarSign,
  Scan,
  TestTubes,
  CheckSquare,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Building2,
  Plus,
  Clock,
  X,
} from 'lucide-react';
import { SupplierQualityScoreItem, QualityAuditLogItem } from '@/types/quality';

const INITIAL_SUPPLIER_SCORES: SupplierQualityScoreItem[] = [
  {
    id: 'sq-1',
    supplierName: 'Qualcomm Enterprise Direct',
    periodMonth: '2026-10',
    totalLotsReceived: 32,
    lotsAccepted: 32,
    lotsRejected: 0,
    acceptanceRate: 100.0,
    defectPPM: 12,
    onTimeDeliveryRate: 99.2,
    qualityScore: 99.4,
    certificationStatus: 'Top Tier Chipset Partner',
    evaluatedBy: 'Dr. Anand Verma (Lead Quality)',
    createdAt: '2026-10-06',
  },
  {
    id: 'sq-2',
    supplierName: 'BOE Display Technologies Corp',
    periodMonth: '2026-10',
    totalLotsReceived: 45,
    lotsAccepted: 44,
    lotsRejected: 1,
    acceptanceRate: 97.8,
    defectPPM: 45,
    onTimeDeliveryRate: 96.0,
    qualityScore: 97.2,
    certificationStatus: 'Class 100 Cleanroom Certified',
    evaluatedBy: 'Priya Sharma (Screen QC)',
    createdAt: '2026-10-05',
  },
  {
    id: 'sq-3',
    supplierName: 'Sony Semiconductor Optical',
    periodMonth: '2026-10',
    totalLotsReceived: 38,
    lotsAccepted: 38,
    lotsRejected: 0,
    acceptanceRate: 100.0,
    defectPPM: 28,
    onTimeDeliveryRate: 98.5,
    qualityScore: 98.6,
    certificationStatus: 'Precision Optical Grade',
    evaluatedBy: 'Vikram Joshi (Optics QC)',
    createdAt: '2026-10-04',
  },
  {
    id: 'sq-4',
    supplierName: 'Sunwoda Electronic Battery Co.',
    periodMonth: '2026-10',
    totalLotsReceived: 24,
    lotsAccepted: 23,
    lotsRejected: 1,
    acceptanceRate: 95.8,
    defectPPM: 85,
    onTimeDeliveryRate: 94.0,
    qualityScore: 95.2,
    certificationStatus: 'BIS & UN38.3 Safety Certified',
    evaluatedBy: 'Dr. Anand Verma (Lead Quality)',
    createdAt: '2026-10-02',
  },
];

const INITIAL_AUDITS: QualityAuditLogItem[] = [
  {
    id: 'aud-1',
    auditNumber: 'Q-AUD-2026-04',
    standard: 'ISO_9001',
    auditType: 'INTERNAL_SURVEILLANCE',
    department: 'Line 1: Circuit Board Assembly Work',
    auditorName: 'Kavita Patel (Quality Lead)',
    scorePercentage: 98.5,
    findingsCount: 1,
    criticalNonConformances: 0,
    correctiveActionStatus: 'COMPLIANT - Minor Observation Closed',
    auditDate: '2026-10-04',
    nextAuditDate: '2027-04-04',
    summary: 'Circuit board solder paste thickness verified within safe micro-tolerances.',
  },
  {
    id: 'aud-2',
    auditNumber: 'Q-AUD-2026-03',
    standard: 'ISO_9001',
    auditType: 'SYSTEM_COMPLIANCE',
    department: 'Receiving Dock & Screen Testing Staging',
    auditorName: 'Vikram Joshi (Senior Inspector)',
    scorePercentage: 99.0,
    findingsCount: 0,
    criticalNonConformances: 0,
    correctiveActionStatus: 'COMPLIANT - ZERO DEFECTS',
    auditDate: '2026-09-28',
    nextAuditDate: '2027-09-28',
    summary: 'Supplier parts quality reports and batch certificate verification completed with zero errors.',
  },
  {
    id: 'aud-3',
    auditNumber: 'Q-AUD-2026-02',
    standard: 'SIX_SIGMA',
    auditType: 'INTERNAL_SURVEILLANCE',
    department: 'Line 3: Camera Lens Focus & Tuning',
    auditorName: 'Priya Sharma (Optics QC)',
    scorePercentage: 97.2,
    findingsCount: 2,
    criticalNonConformances: 0,
    correctiveActionStatus: 'ACTION_PLAN_SUBMITTED',
    auditDate: '2026-09-15',
    nextAuditDate: '2027-03-15',
    summary: 'Camera laser focusing calibration frequency adjusted to hourly checks for ultra-sharp photos.',
  },
];

export default function QualityAnalyticsDashboard() {
  const [supplierScores] = useState<SupplierQualityScoreItem[]>(INITIAL_SUPPLIER_SCORES);
  const [audits, setAudits] = useState<QualityAuditLogItem[]>(INITIAL_AUDITS);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // New Quality Check Form
  const [auditForm, setAuditForm] = useState({
    standard: 'ISO_9001',
    auditType: 'Routine Quality Check',
    department: 'Line 2: Dust-Free Screen Fitting',
    auditorName: 'Vikram Joshi (Senior Inspector)',
    scorePercentage: 98.0,
    findingsCount: 1,
    criticalNonConformances: 0,
    summary: 'Routine verification of cleanroom dust levels and AMOLED screen touch response.',
  });

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAudit: QualityAuditLogItem = {
      id: `aud-${Date.now()}`,
      auditNumber: `Q-AUD-2026-0${audits.length + 2}`,
      standard: auditForm.standard as any,
      auditType: auditForm.auditType,
      department: auditForm.department,
      auditorName: auditForm.auditorName,
      scorePercentage: Number(auditForm.scorePercentage),
      findingsCount: Number(auditForm.findingsCount),
      criticalNonConformances: Number(auditForm.criticalNonConformances),
      correctiveActionStatus: auditForm.criticalNonConformances > 0 ? 'ACTION_REQUIRED' : 'COMPLIANT',
      auditDate: new Date().toISOString().split('T')[0],
      nextAuditDate: '2027-04-01',
      summary: auditForm.summary,
    };

    setAudits([newAudit, ...audits]);
    setIsAuditModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <BadgeCheck className="w-6 sm:w-7 h-6 sm:h-7 text-purple-600 dark:text-purple-400" />
              Phone Quality Checks & Testing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Zero Defect Standard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live inspection results, first-time quality pass rates, supplier ratings, and quality check records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/quality/defects"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium border border-slate-200 dark:border-slate-800 shadow-sm transition"
          >
            <AlertOctagon className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            Defect Reports & Fixes
          </Link>
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Record Quality Check
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: FPY */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              First-Time Quality Pass Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">98.2%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +0.6%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target benchmark: &gt; 97.5%</p>
        </div>

        {/* KPI 2: Incoming QC */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Incoming Parts Pass Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Scan className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">99.1%</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">151 parts lots passed</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tested before accepting received goods</p>
        </div>

        {/* KPI 3: Dispatch OK */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Ready to Pack & Ship Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">99.6%</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Ready for retail boxes</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero defective phones sent</p>
        </div>

        {/* KPI 4: Scrap Cost */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Wasted Parts Cost
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono">₹1,48,200</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">54 defective units</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Only 0.14% of factory production</p>
        </div>
      </div>

      {/* Module Navigation Quick Jump Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          href="/quality/incoming"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Scan className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
              Check <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm">Incoming Parts Inspection</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check screen, battery, and chip shipments before moving to factory floor.
          </p>
        </Link>

        <Link
          href="/quality/in-process"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <TestTubes className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
              Inspect <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm">Live Assembly Line Checks</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Circuit board assembly, screen fit, and camera tuning station checks.
          </p>
        </Link>

        <Link
          href="/quality/final"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              Approve <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm">Final Phone Testing & Packaging</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test phone audio, screen touch, 5G signal, and approve for boxed packing.
          </p>
        </Link>

        <Link
          href="/quality/defects"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
              Solve <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm">Defects & Problem Solving</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Find why defects happened, reduce wasted parts, and fix assembly errors.
          </p>
        </Link>
      </div>

      {/* Main Section: Supplier Quality Scorecards & Quality Checks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Scorecards */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Parts Supplier Quality Scorecards
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Vendor ratings based on defect-free parts and on-time shipments
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              October 2026
            </span>
          </div>

          <div className="space-y-3">
            {supplierScores.map((score) => (
              <div
                key={score.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{score.supplierName}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{score.certificationStatus}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-bold font-mono ${
                        score.qualityScore >= 98
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : score.qualityScore >= 95
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {score.qualityScore.toFixed(1)} / 100
                    </span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Quality Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Acceptance Rate</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {score.acceptanceRate.toFixed(1)}% ({score.lotsAccepted}/{score.totalLotsReceived})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Defect Rate</span>
                    <span
                      className={`font-semibold font-mono ${
                        score.defectPPM === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {score.defectPPM} PPM
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">On-Time Delivery</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {score.onTimeDeliveryRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Audit Logs */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Factory Quality Check History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official internal checks and assembly station quality verification history
              </p>
            </div>
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold"
            >
              + Add Quality Check
            </button>
          </div>

          <div className="space-y-3">
            {audits.map((audit) => (
              <div
                key={audit.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800">
                      {audit.standard.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white font-mono">{audit.auditNumber}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {audit.scorePercentage}% Score
                  </span>
                </div>

                <div className="text-xs text-slate-800 dark:text-slate-200 font-medium">{audit.department}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  {audit.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span>Inspector: {audit.auditorName}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Passed Check</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Defect Causes Breakdown */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Top Defect Causes by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { label: 'Screen Dust & Scratches', count: 18, color: 'text-amber-600 dark:text-amber-400', bar: 'w-[85%] bg-amber-500' },
            { label: 'Circuit Solder Bridges', count: 12, color: 'text-blue-600 dark:text-blue-400', bar: 'w-[60%] bg-blue-500' },
            { label: 'Camera Alignment', count: 7, color: 'text-purple-600 dark:text-purple-400', bar: 'w-[35%] bg-purple-500' },
            { label: 'Battery Connector Fit', count: 5, color: 'text-emerald-600 dark:text-emerald-400', bar: 'w-[25%] bg-emerald-500' },
            { label: '5G Signal & Antenna', count: 3, color: 'text-rose-600 dark:text-rose-400', bar: 'w-[15%] bg-rose-500' },
            { label: 'Casing Surface Marks', count: 2, color: 'text-cyan-600 dark:text-cyan-400', bar: 'w-[10%] bg-cyan-500' },
            { label: 'Box Packing & Barcodes', count: 7, color: 'text-indigo-600 dark:text-indigo-400', bar: 'w-[35%] bg-indigo-500' },
          ].map((cat, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">{cat.label}</span>
              <span className={`text-xl font-bold font-mono mt-1 block ${cat.color}`}>{cat.count}</span>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${cat.bar} rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: RECORD QUALITY CHECK */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Record Factory Quality Check
              </h3>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAudit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Check Standard</label>
                  <select
                    value={auditForm.standard}
                    onChange={(e) => setAuditForm({ ...auditForm, standard: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="ISO_9001">ISO 9001 Quality Standard</option>
                    <option value="SIX_SIGMA">Six Sigma Review</option>
                    <option value="INTERNAL_GMP">Cleanroom Process Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Check Type</label>
                  <input
                    type="text"
                    value={auditForm.auditType}
                    onChange={(e) => setAuditForm({ ...auditForm, auditType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Assembly Line / Section</label>
                <input
                  type="text"
                  value={auditForm.department}
                  onChange={(e) => setAuditForm({ ...auditForm, department: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Score (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={auditForm.scorePercentage}
                    onChange={(e) => setAuditForm({ ...auditForm, scorePercentage: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Findings Count</label>
                  <input
                    type="number"
                    value={auditForm.findingsCount}
                    onChange={(e) => setAuditForm({ ...auditForm, findingsCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Critical Defects</label>
                  <input
                    type="number"
                    value={auditForm.criticalNonConformances}
                    onChange={(e) => setAuditForm({ ...auditForm, criticalNonConformances: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Inspector / Auditor Name</label>
                <input
                  type="text"
                  value={auditForm.auditorName}
                  onChange={(e) => setAuditForm({ ...auditForm, auditorName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Inspection Notes & Results</label>
                <textarea
                  value={auditForm.summary}
                  onChange={(e) => setAuditForm({ ...auditForm, summary: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Quality Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

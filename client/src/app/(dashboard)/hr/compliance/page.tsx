'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  ArrowLeft,
  X,
  Clock,
  Layers,
  Building,
  Upload,
  Calendar,
  AlertOctagon,
  BookOpen,
} from 'lucide-react';
import {
  LaborComplianceDocumentItem,
  SafetyTrainingRecordItem,
  ComplianceDocumentType,
} from '@/types/hr';

const INITIAL_COMPLIANCE_DOCS: LaborComplianceDocumentItem[] = [
  {
    id: 'comp-1',
    complianceTitle: 'Factories Act Annual Statutory Return (Form 21)',
    documentCategory: 'FACTORIES_ACT',
    statutoryAuthority: 'Directorate of Industrial Safety & Health (DISH)',
    filingPeriod: 'FY 2025-26',
    filingDate: '2026-08-31',
    nextRenewalDate: '2027-08-31',
    acknowledgementNumber: 'DISH-MUM-2026-9901',
    documentUrl: 'docs/compliance/form21-annual.pdf',
    complianceStatus: 'COMPLIANT',
    auditedBy: 'Chief Inspector of Factories (State Govt)',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'comp-2',
    complianceTitle: 'Employees Provident Fund (EPF) Monthly Electronic Return (ECR)',
    documentCategory: 'PF_ESI_COMPLIANCE',
    statutoryAuthority: 'Employees Provident Fund Organisation (EPFO)',
    filingPeriod: 'September 2026',
    filingDate: '2026-10-05',
    nextRenewalDate: '2026-11-15',
    acknowledgementNumber: 'TRRN-10294820193',
    documentUrl: 'docs/compliance/epf-ecr-sep26.pdf',
    complianceStatus: 'COMPLIANT',
    auditedBy: 'EPFO Regional Office',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'comp-3',
    complianceTitle: 'Employees State Insurance (ESI) Contribution Filing',
    documentCategory: 'PF_ESI_COMPLIANCE',
    statutoryAuthority: 'ESIC Regional Corporation',
    filingPeriod: 'September 2026',
    filingDate: '2026-10-06',
    nextRenewalDate: '2026-11-15',
    acknowledgementNumber: 'ESI-CHL-998811',
    documentUrl: 'docs/compliance/esi-challan-sep26.pdf',
    complianceStatus: 'COMPLIANT',
    auditedBy: 'ESIC Compliance Officer',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'comp-4',
    complianceTitle: 'Hazardous Waste & Effluent Treatment Consent to Operate (CTO)',
    documentCategory: 'OSHA_SAFETY',
    statutoryAuthority: 'State Pollution Control Board (SPCB)',
    filingPeriod: 'Triennial 2024-2027',
    filingDate: '2024-04-10',
    nextRenewalDate: '2027-04-10',
    acknowledgementNumber: 'SPCB-CTO-RED-4421',
    documentUrl: 'docs/compliance/spcb-cto.pdf',
    complianceStatus: 'COMPLIANT',
    auditedBy: 'Pollution Control Inspector',
    createdAt: '',
    updatedAt: '',
  },
];

const INITIAL_TRAININGS: SafetyTrainingRecordItem[] = [
  {
    id: 'trn-1',
    employeeId: 'emp-3',
    employee: { id: 'emp-3', employeeCode: 'EMP-2026-015', firstName: 'Amit', lastName: 'Kalyan', email: '', phone: '', departmentId: '', designationId: '', employmentStatus: 'ACTIVE', employmentType: 'SHIFT_WORKER', dateOfJoining: '', baseSalary: 0, hourlyOvertimeRate: 0, createdAt: '', updatedAt: '', department: { id: '', name: 'Production', code: 'PROD' } },
    trainingProgramName: 'OSHA Machinery Safeguarding & Emergency E-Stop Protocols',
    trainerAgency: 'Apex Safety Council Institute',
    trainingDate: '2026-09-12',
    validityExpiryDate: '2027-09-12',
    certificateNumber: 'CERT-OSHA-2026-091',
    passedAssessment: true,
    assessmentScore: 94.0,
    notes: 'Practical machine interlocking verification cleared with distinction.',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'trn-2',
    employeeId: 'emp-2',
    employee: { id: 'emp-2', employeeCode: 'EMP-2026-002', firstName: 'Rajesh', lastName: 'Mehra', email: '', phone: '', departmentId: '', designationId: '', employmentStatus: 'ACTIVE', employmentType: 'FULL_TIME', dateOfJoining: '', baseSalary: 0, hourlyOvertimeRate: 0, createdAt: '', updatedAt: '', department: { id: '', name: 'Warehouse', code: 'WHS' } },
    trainingProgramName: 'High-Reach Electric Forklift Operator Safety Certification',
    trainerAgency: 'National Industrial Logistics Academy',
    trainingDate: '2026-08-20',
    validityExpiryDate: '2027-08-20',
    certificateNumber: 'CERT-FL-2026-042',
    passedAssessment: true,
    assessmentScore: 98.5,
    notes: 'Certified for 3-ton counterbalanced trucks in narrow aisle racking.',
    createdAt: '',
    updatedAt: '',
  },
];

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'STATUTORY' | 'SAFETY_TRAINING'>('STATUTORY');
  const [complianceDocs, setComplianceDocs] = useState<LaborComplianceDocumentItem[]>(INITIAL_COMPLIANCE_DOCS);
  const [trainings, setTrainings] = useState<SafetyTrainingRecordItem[]>(INITIAL_TRAININGS);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  // New Compliance Doc Form
  const [docForm, setDocForm] = useState({
    complianceTitle: '',
    documentCategory: 'FACTORIES_ACT' as ComplianceDocumentType,
    statutoryAuthority: '',
    filingPeriod: '',
    filingDate: new Date().toISOString().split('T')[0],
    nextRenewalDate: '',
    acknowledgementNumber: '',
  });

  // New Training Form
  const [trainingForm, setTrainingForm] = useState({
    employeeName: 'Pooja Sharma',
    trainingProgramName: '',
    trainerAgency: 'Apex Safety Council',
    trainingDate: new Date().toISOString().split('T')[0],
    certificateNumber: '',
    assessmentScore: 90,
  });

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.complianceTitle || !docForm.statutoryAuthority) return;

    const newDoc: LaborComplianceDocumentItem = {
      id: `comp-${Date.now()}`,
      complianceTitle: docForm.complianceTitle,
      documentCategory: docForm.documentCategory,
      statutoryAuthority: docForm.statutoryAuthority,
      filingPeriod: docForm.filingPeriod || 'Current Period',
      filingDate: docForm.filingDate,
      nextRenewalDate: docForm.nextRenewalDate || undefined,
      acknowledgementNumber: docForm.acknowledgementNumber || `ACK-${Date.now()}`,
      complianceStatus: 'COMPLIANT',
      auditedBy: 'Internal Legal Compliance Auditor',
      createdAt: '',
      updatedAt: '',
    };

    setComplianceDocs([newDoc, ...complianceDocs]);
    setIsDocModalOpen(false);
    setDocForm({
      complianceTitle: '',
      documentCategory: 'FACTORIES_ACT',
      statutoryAuthority: '',
      filingPeriod: '',
      filingDate: new Date().toISOString().split('T')[0],
      nextRenewalDate: '',
      acknowledgementNumber: '',
    });
  };

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingForm.trainingProgramName) return;

    const newTrn: SafetyTrainingRecordItem = {
      id: `trn-${Date.now()}`,
      employeeId: 'emp-4',
      employee: { id: 'emp-4', employeeCode: 'EMP-2026-042', firstName: 'Pooja', lastName: 'Sharma', email: '', phone: '', departmentId: '', designationId: '', employmentStatus: 'ACTIVE', employmentType: 'FULL_TIME', dateOfJoining: '', baseSalary: 0, hourlyOvertimeRate: 0, createdAt: '', updatedAt: '', department: { id: '', name: 'Quality Assurance', code: 'QA' } },
      trainingProgramName: trainingForm.trainingProgramName,
      trainerAgency: trainingForm.trainerAgency,
      trainingDate: trainingForm.trainingDate,
      certificateNumber: trainingForm.certificateNumber || `CERT-SAF-${Date.now()}`,
      passedAssessment: true,
      assessmentScore: Number(trainingForm.assessmentScore),
      createdAt: '',
      updatedAt: '',
    };

    setTrainings([newTrn, ...trainings]);
    setIsTrainingModalOpen(false);
    setTrainingForm({
      employeeName: 'Pooja Sharma',
      trainingProgramName: '',
      trainerAgency: 'Apex Safety Council',
      trainingDate: new Date().toISOString().split('T')[0],
      certificateNumber: '',
      assessmentScore: 90,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/hr" className="hover:text-indigo-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Workforce Hub
            </Link>
            <span>/</span>
            <span className="text-slate-200">Compliance & Safety</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-400" />
            Statutory Labor Law Compliance & Safety Training
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain mandatory factory labor registers, EPFO/ESIC filings, OSHA hazard training certifications, and pollution board consents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDocModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            File Statutory Return
          </button>

          <button
            onClick={() => setIsTrainingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium"
          >
            <Plus className="h-4 w-4" />
            Log Safety Training
          </button>
        </div>
      </div>

      {/* Compliance Health Score Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Statutory Compliance Index</span>
            <div className="text-xl font-bold text-emerald-400 font-mono">100% Compliant</div>
            <div className="text-[10px] text-slate-300">0 overdue government notices</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">OSHA Safety Training Rate</span>
            <div className="text-xl font-bold text-indigo-300 font-mono">98.2% Certified</div>
            <div className="text-[10px] text-slate-300">All shop floor leads verified</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Next Regulatory Renewal</span>
            <div className="text-xl font-bold text-white font-mono">15 Nov 2026</div>
            <div className="text-[10px] text-blue-300">PF/ESI October monthly ECR</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('STATUTORY')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'STATUTORY'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Statutory Labor Filings ({complianceDocs.length})
        </button>

        <button
          onClick={() => setActiveTab('SAFETY_TRAINING')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'SAFETY_TRAINING'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          OSHA Safety Certifications ({trainings.length})
        </button>
      </div>

      {/* Tab 1: Statutory Labor Documents */}
      {activeTab === 'STATUTORY' && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-3 font-semibold">Statutory Filing Title</th>
                  <th className="py-3 px-3 font-semibold">Government Authority</th>
                  <th className="py-3 px-3 font-semibold">Filing Period</th>
                  <th className="py-3 px-3 font-semibold">Acknowledgement Ref</th>
                  <th className="py-3 px-3 font-semibold">Filing Date</th>
                  <th className="py-3 px-3 font-semibold">Next Renewal</th>
                  <th className="py-3 px-3 font-semibold">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {complianceDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{doc.complianceTitle}</div>
                      <span className="text-[10px] font-mono text-slate-500">{doc.documentCategory}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{doc.statutoryAuthority}</td>
                    <td className="py-3 px-3 font-medium text-amber-300">{doc.filingPeriod}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{doc.acknowledgementNumber}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{doc.filingDate}</td>
                    <td className="py-3 px-3 font-mono text-cyan-300">{doc.nextRenewalDate || 'Annual Cycle'}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        {doc.complianceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: OSHA Safety Training Logs */}
      {activeTab === 'SAFETY_TRAINING' && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-3 font-semibold">Employee</th>
                  <th className="py-3 px-3 font-semibold">Safety Course Program</th>
                  <th className="py-3 px-3 font-semibold">Accredited Trainer</th>
                  <th className="py-3 px-3 font-semibold">Training Date</th>
                  <th className="py-3 px-3 font-semibold">Certificate Number</th>
                  <th className="py-3 px-3 font-semibold">Score (%)</th>
                  <th className="py-3 px-3 font-semibold">Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {trainings.map((trn) => (
                  <tr key={trn.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{trn.employee?.firstName} {trn.employee?.lastName}</div>
                      <span className="font-mono text-[10px] text-indigo-300">{trn.employee?.employeeCode}</span>
                    </td>
                    <td className="py-3 px-3 text-white font-medium">{trn.trainingProgramName}</td>
                    <td className="py-3 px-3 text-slate-400">{trn.trainerAgency}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{trn.trainingDate}</td>
                    <td className="py-3 px-3 font-mono text-amber-300">{trn.certificateNumber}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">{trn.assessmentScore}%</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        Certified Passed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Statutory Document Modal */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-semibold text-white">Record Statutory Labor Compliance Filing</h3>
              </div>
              <button
                onClick={() => setIsDocModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Compliance Form / Return Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Factories Act Annual Return (Form 21)"
                  value={docForm.complianceTitle}
                  onChange={(e) => setDocForm({ ...docForm, complianceTitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Statutory Category</label>
                  <select
                    value={docForm.documentCategory}
                    onChange={(e) => setDocForm({ ...docForm, documentCategory: e.target.value as ComplianceDocumentType })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="FACTORIES_ACT">Factories Act 1948</option>
                    <option value="PF_ESI_COMPLIANCE">EPFO & ESIC Compliance</option>
                    <option value="OSHA_SAFETY">OSHA & Environmental Safety</option>
                    <option value="MINIMUM_WAGES">Minimum Wages Act</option>
                    <option value="GRATUITY">Payment of Gratuity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Government Authority *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DISH, EPFO, ESIC"
                    value={docForm.statutoryAuthority}
                    onChange={(e) => setDocForm({ ...docForm, statutoryAuthority: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Filing Period</label>
                  <input
                    type="text"
                    placeholder="e.g. September 2026 / FY2026"
                    value={docForm.filingPeriod}
                    onChange={(e) => setDocForm({ ...docForm, filingPeriod: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Government Ack #</label>
                  <input
                    type="text"
                    placeholder="Acknowledgement number"
                    value={docForm.acknowledgementNumber}
                    onChange={(e) => setDocForm({ ...docForm, acknowledgementNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Filing Date</label>
                  <input
                    type="date"
                    value={docForm.filingDate}
                    onChange={(e) => setDocForm({ ...docForm, filingDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Next Renewal Date</label>
                  <input
                    type="date"
                    value={docForm.nextRenewalDate}
                    onChange={(e) => setDocForm({ ...docForm, nextRenewalDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium shadow-md shadow-amber-600/30"
                >
                  Save Statutory Filing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Safety Training Modal */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-white">Log OSHA Safety Training Certification</h3>
              </div>
              <button
                onClick={() => setIsTrainingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTraining} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Training Course / Program *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hazardous Materials & Lockout-Tagout (LOTO)"
                  value={trainingForm.trainingProgramName}
                  onChange={(e) => setTrainingForm({ ...trainingForm, trainingProgramName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Accredited Safety Agency</label>
                  <input
                    type="text"
                    value={trainingForm.trainerAgency}
                    onChange={(e) => setTrainingForm({ ...trainingForm, trainerAgency: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Certificate #</label>
                  <input
                    type="text"
                    placeholder="CERT-SAF-2026-XXX"
                    value={trainingForm.certificateNumber}
                    onChange={(e) => setTrainingForm({ ...trainingForm, certificateNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Training Date</label>
                  <input
                    type="date"
                    value={trainingForm.trainingDate}
                    onChange={(e) => setTrainingForm({ ...trainingForm, trainingDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assessment Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={trainingForm.assessmentScore}
                    onChange={(e) => setTrainingForm({ ...trainingForm, assessmentScore: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTrainingModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30"
                >
                  Save Training Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

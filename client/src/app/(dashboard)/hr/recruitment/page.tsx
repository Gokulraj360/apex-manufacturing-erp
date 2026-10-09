'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Briefcase,
  Search,
  Plus,
  ArrowLeft,
  X,
  CheckCircle2,
  Clock,
  Building,
  Mail,
  Phone,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  Award,
} from 'lucide-react';
import {
  JobOpeningItem,
  CandidateInterviewItem,
  CandidateInterviewStage,
  JobOpeningStatus,
} from '@/types/hr';

const INITIAL_JOBS: JobOpeningItem[] = [
  {
    id: 'job-1',
    requisitionNumber: 'JOB-2026-012',
    title: 'Senior CNC Lathe Programmer & Operator',
    departmentId: 'dept-1',
    department: { id: 'dept-1', name: 'Production & Shop Floor', code: 'PROD' },
    designationId: 'des-3',
    designation: { id: 'des-3', title: 'CNC Specialist', code: 'DES-CNC', level: 3 },
    openingsCount: 2,
    hiredCount: 1,
    jobDescription: 'Mastercam / Fanuc G-code programming, 5-axis DMG Mori operation with 0.005mm tolerance.',
    requiredExperienceYears: 4,
    status: 'OPEN',
    postedDate: '2026-09-20',
    targetClosingDate: '2026-10-15',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'job-2',
    requisitionNumber: 'JOB-2026-014',
    title: 'Metrology & CMM Quality Inspector',
    departmentId: 'dept-3',
    department: { id: 'dept-3', name: 'Quality Assurance (QA/QC)', code: 'QA' },
    designationId: 'des-4',
    designation: { id: 'des-4', title: 'QC Lead', code: 'DES-QC', level: 3 },
    openingsCount: 1,
    hiredCount: 0,
    jobDescription: 'Zeiss Coordinate Measuring Machine operation, Calypso software, GD&T blueprint verification.',
    requiredExperienceYears: 3,
    status: 'OPEN',
    postedDate: '2026-09-28',
    targetClosingDate: '2026-10-20',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'job-3',
    requisitionNumber: 'JOB-2026-015',
    title: 'Warehouse Fleet & Inventory Controller',
    departmentId: 'dept-2',
    department: { id: 'dept-2', name: 'Warehouse & Logistics', code: 'WHS' },
    designationId: 'des-2',
    designation: { id: 'des-2', title: 'Inventory Lead', code: 'DES-INV', level: 2 },
    openingsCount: 1,
    hiredCount: 0,
    jobDescription: 'RFID gate scanners, SAP/ERP stock variance reconciliation, daily cycle counting.',
    requiredExperienceYears: 2,
    status: 'OPEN',
    postedDate: '2026-10-02',
    targetClosingDate: '2026-10-25',
    createdAt: '',
    updatedAt: '',
  },
];

const INITIAL_CANDIDATES: CandidateInterviewItem[] = [
  {
    id: 'cand-1',
    jobOpeningId: 'job-1',
    candidateName: 'Rohan Deshmukh',
    candidateEmail: 'rohan.deshmukh@email.com',
    candidatePhone: '+91 98450 11223',
    currentEmployer: 'Bharat Forge Precision Division',
    experienceYears: 5.0,
    currentStage: 'TECHNICAL',
    interviewScore: 88,
    interviewerNotes: 'Excellent G-code drafting skills; cleared shop floor practical test on 5-axis milling machine.',
    interviewScheduledAt: '2026-10-08 14:00',
    createdAt: '2026-09-25',
    updatedAt: '2026-10-05',
  },
  {
    id: 'cand-2',
    jobOpeningId: 'job-1',
    candidateName: 'Nitin Kamat',
    candidateEmail: 'nitin.k@email.com',
    candidatePhone: '+91 98221 44001',
    currentEmployer: 'Kalyani Maxion Wheels',
    experienceYears: 4.2,
    currentStage: 'OFFER_EXTENDED',
    interviewScore: 92,
    offeredCtc: 540000,
    offerAccepted: true,
    interviewerNotes: 'Offer letter signed. Expected date of joining: 2026-10-16.',
    createdAt: '2026-09-22',
    updatedAt: '2026-10-04',
  },
  {
    id: 'cand-3',
    jobOpeningId: 'job-2',
    candidateName: 'Swati Kulkarni',
    candidateEmail: 'swati.k@email.com',
    candidatePhone: '+91 97650 99881',
    currentEmployer: 'Tata Autocomp Systems',
    experienceYears: 3.5,
    currentStage: 'SCREENING',
    interviewScore: 78,
    interviewerNotes: 'Strong GD&T background. Scheduled for round 2 Zeiss CMM live calibration demo.',
    createdAt: '2026-10-03',
    updatedAt: '2026-10-03',
  },
];

const STAGES: CandidateInterviewStage[] = [
  'APPLIED',
  'SCREENING',
  'TECHNICAL',
  'HR_INTERVIEW',
  'OFFER_EXTENDED',
  'HIRED',
];

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState<JobOpeningItem[]>(INITIAL_JOBS);
  const [candidates, setCandidates] = useState<CandidateInterviewItem[]>(INITIAL_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);

  // New Job Form
  const [jobForm, setJobForm] = useState({
    requisitionNumber: '',
    title: '',
    departmentName: 'Production & Shop Floor',
    openingsCount: 1,
    requiredExperienceYears: 2,
    jobDescription: '',
    targetClosingDate: '',
  });

  // New Candidate Form
  const [candForm, setCandForm] = useState({
    jobOpeningId: INITIAL_JOBS[0].id,
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    currentEmployer: '',
    experienceYears: 3,
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.requisitionNumber) return;

    const newJob: JobOpeningItem = {
      id: `job-${Date.now()}`,
      requisitionNumber: jobForm.requisitionNumber.toUpperCase(),
      title: jobForm.title,
      departmentId: 'dept-gen',
      department: { id: 'dept-gen', name: jobForm.departmentName, code: 'GEN' },
      designationId: 'des-gen',
      openingsCount: Number(jobForm.openingsCount),
      hiredCount: 0,
      jobDescription: jobForm.jobDescription,
      requiredExperienceYears: Number(jobForm.requiredExperienceYears),
      status: 'OPEN',
      postedDate: new Date().toISOString().split('T')[0],
      targetClosingDate: jobForm.targetClosingDate || undefined,
      createdAt: '',
      updatedAt: '',
    };

    setJobs([newJob, ...jobs]);
    setIsJobModalOpen(false);
    setJobForm({
      requisitionNumber: '',
      title: '',
      departmentName: 'Production & Shop Floor',
      openingsCount: 1,
      requiredExperienceYears: 2,
      jobDescription: '',
      targetClosingDate: '',
    });
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candForm.candidateName || !candForm.candidateEmail) return;

    const newCand: CandidateInterviewItem = {
      id: `cand-${Date.now()}`,
      jobOpeningId: candForm.jobOpeningId,
      candidateName: candForm.candidateName,
      candidateEmail: candForm.candidateEmail,
      candidatePhone: candForm.candidatePhone,
      currentEmployer: candForm.currentEmployer,
      experienceYears: Number(candForm.experienceYears),
      currentStage: 'APPLIED',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: '',
    };

    setCandidates([newCand, ...candidates]);
    setIsCandidateModalOpen(false);
    setCandForm({
      jobOpeningId: jobs[0]?.id || '',
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      currentEmployer: '',
      experienceYears: 3,
    });
  };

  const advanceCandidateStage = (candId: string, nextStage: CandidateInterviewStage) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, currentStage: nextStage } : c)),
    );
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
            <span className="text-slate-200">Recruitment & Hiring</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-purple-400" />
            Recruitment Requisitions & Interview Pipeline
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish plant job requisitions, track candidate interview evaluations, and coordinate onboarding offers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsJobModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium"
          >
            <Plus className="h-4 w-4" />
            New Job Requisition
          </button>

          <button
            onClick={() => setIsCandidateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/20 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Register Candidate
          </button>
        </div>
      </div>

      {/* Active Job Openings Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Briefcase className="h-4 w-4 text-purple-400" />
          Active Requisitions ({jobs.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-all rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-300">{job.requisitionNumber}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {job.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">{job.title}</h3>
                <div className="text-[11px] text-slate-400 mt-0.5">{job.department?.name}</div>
              </div>

              <p className="text-[11px] text-slate-300 line-clamp-2">{job.jobDescription}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  Openings: <strong className="text-white">{job.openingsCount - job.hiredCount}</strong> left ({job.hiredCount} hired)
                </span>
                <span className="text-purple-400 font-mono">Min {job.requiredExperienceYears} yrs exp</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Pipeline Kanban / Stage Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-indigo-400" />
          Candidate Hiring Pipeline (Active Applications)
        </h2>

        <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-800/60 text-xs">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{cand.candidateName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {cand.currentStage.replace('_', ' ')}
                    </span>
                    {cand.interviewScore && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                        Score: {cand.interviewScore}/100
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {cand.candidateEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {cand.candidatePhone}
                    </span>
                    <span>Exp: {cand.experienceYears} yrs</span>
                  </div>

                  {cand.interviewerNotes && (
                    <div className="text-[11px] text-slate-300 italic mt-1">
                      &ldquo;{cand.interviewerNotes}&rdquo;
                    </div>
                  )}

                  {cand.offeredCtc && (
                    <div className="text-[11px] text-emerald-400 font-mono font-medium mt-0.5">
                      Offered CTC: ₹{cand.offeredCtc.toLocaleString()} &bull; {cand.offerAccepted ? 'Accepted' : 'Pending'}
                    </div>
                  )}
                </div>

                {/* Move Stage Actions */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Advance to:</span>
                  <div className="flex flex-wrap gap-1">
                    {STAGES.map((st) => (
                      <button
                        key={st}
                        onClick={() => advanceCandidateStage(cand.id, st)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                          cand.currentStage === st
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Requisition Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-semibold text-white">Create Job Requisition</h3>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Requisition Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="JOB-2026-XXX"
                    value={jobForm.requisitionNumber}
                    onChange={(e) => setJobForm({ ...jobForm, requisitionNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white uppercase font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Openings Count *</label>
                  <input
                    type="number"
                    min="1"
                    value={jobForm.openingsCount}
                    onChange={(e) => setJobForm({ ...jobForm, openingsCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior CNC Milling Specialist"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={jobForm.departmentName}
                    onChange={(e) => setJobForm({ ...jobForm, departmentName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Production & Shop Floor">Production & Shop Floor</option>
                    <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                    <option value="Quality Assurance (QA/QC)">Quality Assurance (QA/QC)</option>
                    <option value="Plant Engineering & Maintenance">Plant Engineering & Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Min Experience (Yrs)</label>
                  <input
                    type="number"
                    min="0"
                    value={jobForm.requiredExperienceYears}
                    onChange={(e) => setJobForm({ ...jobForm, requiredExperienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Description & Technical Skills</label>
                <textarea
                  rows={2}
                  placeholder="Required machine certifications, tool calibration, GD&T..."
                  value={jobForm.jobDescription}
                  onChange={(e) => setJobForm({ ...jobForm, jobDescription: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-md shadow-purple-600/30"
                >
                  Publish Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Candidate Modal */}
      {isCandidateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-semibold text-white">Register Candidate Application</h3>
              </div>
              <button
                onClick={() => setIsCandidateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Job Requisition *</label>
                <select
                  value={candForm.jobOpeningId}
                  onChange={(e) => setCandForm({ ...candForm, jobOpeningId: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.requisitionNumber} - {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={candForm.candidateName}
                  onChange={(e) => setCandForm({ ...candForm, candidateName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="candidate@email.com"
                    value={candForm.candidateEmail}
                    onChange={(e) => setCandForm({ ...candForm, candidateEmail: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 XXXXX XXXXX"
                    value={candForm.candidatePhone}
                    onChange={(e) => setCandForm({ ...candForm, candidatePhone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Employer</label>
                  <input
                    type="text"
                    placeholder="Previous company"
                    value={candForm.currentEmployer}
                    onChange={(e) => setCandForm({ ...candForm, currentEmployer: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={candForm.experienceYears}
                    onChange={(e) => setCandForm({ ...candForm, experienceYears: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCandidateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-md shadow-purple-600/30"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

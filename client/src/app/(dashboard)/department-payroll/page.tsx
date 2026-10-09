'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Trash2,
  Check,
  X,
  Eye,
  RefreshCw,
  Coins,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Warehouse,
  Printer,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';
import {
  DepartmentPayrollSheet,
  WorkerAttendanceSalaryRecord,
  DepartmentTemplate,
} from '@/types/department-payroll';
import { useAuth } from '@/context/AuthContext';

// Pre-seeded Department Templates
const INITIAL_TEMPLATES: DepartmentTemplate[] = [
  {
    department: 'Line 1: Circuit Board Assembly Work',
    departmentCode: 'SMT-001',
    managerName: 'Suresh Raina (Line 1 Production Manager)',
    managerId: 'mgr-prod-01',
    workers: [
      { workerId: 'EMP-2026-0101', workerName: 'Rameshwar Patil', role: 'SMT Surface Mount Technician', baseSalaryRate: 22000, daysPresent: 26, overtimeHours: 14, allowances: 2000 },
      { workerId: 'EMP-2026-0102', workerName: 'Gopal Krishnan', role: 'Optical Solder Inspector (AOI)', baseSalaryRate: 19500, daysPresent: 25, overtimeHours: 10, allowances: 1500 },
      { workerId: 'EMP-2026-0103', workerName: 'Anil Jadhav', role: 'SMT Feeder Operator', baseSalaryRate: 18000, daysPresent: 26, overtimeHours: 16, allowances: 1200 },
      { workerId: 'EMP-2026-0104', workerName: 'Priya Sundaram', role: 'PCB Stencil Printer Specialist', baseSalaryRate: 20500, daysPresent: 24, overtimeHours: 8, allowances: 1800 },
      { workerId: 'EMP-2026-0105', workerName: 'Mahesh Vernekar', role: 'Reflow Oven Thermal Controller', baseSalaryRate: 23000, daysPresent: 26, overtimeHours: 12, allowances: 2000 },
    ],
  },
  {
    department: 'Line 2: Dust-Free Screen Fitting',
    departmentCode: 'DISP-002',
    managerName: 'Ananya Deshmukh (Cleanroom Line Manager)',
    managerId: 'mgr-disp-02',
    workers: [
      { workerId: 'EMP-2026-0201', workerName: 'Sunita Rao', role: 'Vacuum Screen Laminator', baseSalaryRate: 21000, daysPresent: 26, overtimeHours: 12, allowances: 2200 },
      { workerId: 'EMP-2026-0202', workerName: 'Manoj Kumar', role: 'Dust Particle Inspection Tech', baseSalaryRate: 18500, daysPresent: 26, overtimeHours: 8, allowances: 1400 },
      { workerId: 'EMP-2026-0203', workerName: 'Deepa Varma', role: 'AMOLED Display Bonding Lead', baseSalaryRate: 24000, daysPresent: 25, overtimeHours: 6, allowances: 2500 },
      { workerId: 'EMP-2026-0204', workerName: 'Kishore Hegde', role: 'Screen Bezel Pressure Tester', baseSalaryRate: 19000, daysPresent: 26, overtimeHours: 10, allowances: 1200 },
    ],
  },
  {
    department: 'Warehouse & Parts Stock',
    departmentCode: 'WH-001',
    managerName: 'Vikram Malhotra (Warehouse Store Head)',
    managerId: 'mgr-wh-01',
    workers: [
      { workerId: 'EMP-2026-0301', workerName: 'Prakash Rao', role: 'Chipset Storage Bin Handler', baseSalaryRate: 17500, daysPresent: 26, overtimeHours: 10, allowances: 1000 },
      { workerId: 'EMP-2026-0302', workerName: 'Santosh Gowda', role: 'Barcode & QR Scanner Staff', baseSalaryRate: 16500, daysPresent: 24, overtimeHours: 4, allowances: 1000 },
      { workerId: 'EMP-2026-0303', workerName: 'Mohd. Imran', role: 'Forklift & Pallet Operator', baseSalaryRate: 19000, daysPresent: 26, overtimeHours: 18, allowances: 1500 },
    ],
  },
  {
    department: 'Phone Quality Checks',
    departmentCode: 'QA-005',
    managerName: 'Dr. Meenakshi Sundaram (Quality Head)',
    managerId: 'mgr-qa-01',
    workers: [
      { workerId: 'EMP-2026-0401', workerName: 'Devendra Joshi', role: 'Battery Drop & Stress Tester', baseSalaryRate: 23000, daysPresent: 26, overtimeHours: 6, allowances: 2000 },
      { workerId: 'EMP-2026-0402', workerName: 'Kavita Shinde', role: 'Display Color Calibrator', baseSalaryRate: 21500, daysPresent: 25, overtimeHours: 12, allowances: 1800 },
      { workerId: 'EMP-2026-0403', workerName: 'Tariq Ansari', role: '5G Antenna RF Chamber Tester', baseSalaryRate: 24000, daysPresent: 26, overtimeHours: 8, allowances: 2200 },
    ],
  },
];

// Helper: Calculate worker line item
function calculateWorkerItem(
  workerId: string,
  workerName: string,
  role: string,
  department: string,
  baseSalaryRate: number,
  daysPresent: number,
  overtimeHours: number,
  allowances: number,
  totalWorkingDays = 26,
  existingId?: string
): WorkerAttendanceSalaryRecord {
  const dailyRate = baseSalaryRate / totalWorkingDays;
  const basicPay = Math.round(dailyRate * Math.min(daysPresent, totalWorkingDays));
  const hourlyRate = dailyRate / 8;
  const overtimePay = Math.round(hourlyRate * 1.5 * overtimeHours);
  const grossPay = basicPay + overtimePay + allowances;

  const pfDeduction = Math.round(basicPay * 0.12);
  const esiDeduction = grossPay <= 21000 ? Math.round(grossPay * 0.0075) : 0;
  const professionalTax = grossPay >= 15000 ? 200 : 0;
  const totalDeductions = pfDeduction + esiDeduction + professionalTax;
  const netPayable = Math.max(0, grossPay - totalDeductions);

  return {
    id: existingId || `wrec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    sheetId: '',
    workerId,
    workerName,
    role,
    department,
    totalWorkingDays,
    daysPresent,
    daysAbsent: Math.max(0, totalWorkingDays - daysPresent),
    overtimeHours,
    baseSalaryRate,
    basicPay,
    overtimePay,
    allowances,
    grossPay,
    esiDeduction,
    pfDeduction,
    professionalTax,
    totalDeductions,
    netPayable,
    remarks: overtimeHours > 0 ? `${overtimeHours} hrs overtime logged` : 'Regular attendance',
    isTurnstileVerified: true,
  };
}

// Initial Sheets
const INITIAL_SHEETS: DepartmentPayrollSheet[] = [
  {
    id: 'sheet-smt-2026-10',
    department: 'Line 1: Circuit Board Assembly Work',
    departmentCode: 'SMT-001',
    managerId: 'mgr-prod-01',
    managerName: 'Suresh Raina (Line 1 Production Manager)',
    monthYear: 'October 2026',
    month: 'October',
    year: 2026,
    workingDaysInMonth: 26,
    totalWorkers: 5,
    totalGrossAmount: 122850,
    totalEsiAmount: 135,
    totalPfAmount: 12620,
    totalAmount: 109095,
    status: 'SUBMITTED_TO_REVIEW',
    managerNotes: 'Full 3-shift rotation completed. All overtime authorized for Snapdragon 8 Gen 3 motherboard sprint.',
    submittedAt: '2026-10-04T09:30:00.000Z',
    hrReviewerId: 'hr-lead-01',
    hrReviewerName: 'Kavita Menon (HR Lead)',
    hrNotes: 'Biometric turnstile punches cross-verified against factory entry gates. Zero discrepancies.',
    hrStatus: 'APPROVED',
    hrReviewedAt: '2026-10-05T11:00:00.000Z',
    financeReviewerId: null,
    financeReviewerName: null,
    financeNotes: null,
    financeStatus: 'PENDING',
    financeReviewedAt: null,
    superAdminReviewerId: 'super-admin-01',
    superAdminReviewerName: 'Dr. Rajesh (Owner/MD)',
    superAdminNotes: 'Solid motherboard assembly yield this month. Approved for finance bank release.',
    superAdminStatus: 'APPROVED',
    superAdminReviewedAt: '2026-10-05T14:15:00.000Z',
    clearanceReference: null,
    records: [
      calculateWorkerItem('EMP-2026-0101', 'Rameshwar Patil', 'SMT Surface Mount Technician', 'Line 1', 22000, 26, 14, 2000, 26, 'r1'),
      calculateWorkerItem('EMP-2026-0102', 'Gopal Krishnan', 'Optical Solder Inspector (AOI)', 'Line 1', 19500, 25, 10, 1500, 26, 'r2'),
      calculateWorkerItem('EMP-2026-0103', 'Anil Jadhav', 'SMT Feeder Operator', 'Line 1', 18000, 26, 16, 1200, 26, 'r3'),
      calculateWorkerItem('EMP-2026-0104', 'Priya Sundaram', 'PCB Stencil Printer Specialist', 'Line 1', 20500, 24, 8, 1800, 26, 'r4'),
      calculateWorkerItem('EMP-2026-0105', 'Mahesh Vernekar', 'Reflow Oven Thermal Controller', 'Line 1', 23000, 26, 12, 2000, 26, 'r5'),
    ],
    createdAt: '2026-10-03T18:00:00.000Z',
    updatedAt: '2026-10-05T14:15:00.000Z',
  },
  {
    id: 'sheet-disp-2026-09',
    department: 'Line 2: Dust-Free Screen Fitting',
    departmentCode: 'DISP-002',
    managerId: 'mgr-disp-02',
    managerName: 'Ananya Deshmukh (Cleanroom Line Manager)',
    monthYear: 'September 2026',
    month: 'September',
    year: 2026,
    workingDaysInMonth: 26,
    totalWorkers: 4,
    totalGrossAmount: 97800,
    totalEsiAmount: 140,
    totalPfAmount: 10250,
    totalAmount: 86610,
    status: 'APPROVED_BY_FINANCE',
    managerNotes: 'Class-1000 cleanroom shift rosters verified. Clean OLED yield achieved.',
    submittedAt: '2026-09-28T10:00:00.000Z',
    hrReviewerId: 'hr-lead-01',
    hrReviewerName: 'Kavita Menon (HR Lead)',
    hrNotes: 'All cleanroom entry logs verified.',
    hrStatus: 'APPROVED',
    hrReviewedAt: '2026-09-28T16:00:00.000Z',
    financeReviewerId: 'fin-lead-01',
    financeReviewerName: 'Amitabh Sen (Finance Lead)',
    financeNotes: 'Statutory ESI and PF accounts confirmed. Bank payment released via HDFC Corp portal.',
    financeStatus: 'APPROVED',
    financeReviewedAt: '2026-09-29T11:30:00.000Z',
    superAdminReviewerId: 'super-admin-01',
    superAdminReviewerName: 'Dr. Rajesh (Owner/MD)',
    superAdminNotes: 'Confirmed and finalized.',
    superAdminStatus: 'APPROVED',
    superAdminReviewedAt: '2026-09-29T12:00:00.000Z',
    clearanceReference: 'DEPT-CLR-DISP-2026-SEP-8812',
    records: [
      calculateWorkerItem('EMP-2026-0201', 'Sunita Rao', 'Vacuum Screen Laminator', 'Line 2', 21000, 26, 12, 2200, 26, 'r6'),
      calculateWorkerItem('EMP-2026-0202', 'Manoj Kumar', 'Dust Particle Inspection Tech', 'Line 2', 18500, 26, 8, 1400, 26, 'r7'),
      calculateWorkerItem('EMP-2026-0203', 'Deepa Varma', 'AMOLED Display Bonding Lead', 'Line 2', 24000, 25, 6, 2500, 26, 'r8'),
      calculateWorkerItem('EMP-2026-0204', 'Kishore Hegde', 'Screen Bezel Pressure Tester', 'Line 2', 19000, 26, 10, 1200, 26, 'r9'),
    ],
    createdAt: '2026-09-27T14:00:00.000Z',
    updatedAt: '2026-09-29T12:00:00.000Z',
  },
  {
    id: 'sheet-wh-2026-10',
    department: 'Warehouse & Parts Stock',
    departmentCode: 'WH-001',
    managerId: 'mgr-wh-01',
    managerName: 'Vikram Malhotra (Warehouse Store Head)',
    monthYear: 'October 2026',
    month: 'October',
    year: 2026,
    workingDaysInMonth: 26,
    totalWorkers: 3,
    totalGrossAmount: 61400,
    totalEsiAmount: 380,
    totalPfAmount: 6180,
    totalAmount: 54240,
    status: 'DRAFT',
    managerNotes: 'Compiling remaining overtime hours from weekend night shift inbound container unloading.',
    submittedAt: null,
    hrStatus: 'PENDING',
    financeStatus: 'PENDING',
    superAdminStatus: 'PENDING',
    records: [
      calculateWorkerItem('EMP-2026-0301', 'Prakash Rao', 'Chipset Storage Bin Handler', 'Warehouse', 17500, 26, 10, 1000, 26, 'r10'),
      calculateWorkerItem('EMP-2026-0302', 'Santosh Gowda', 'Barcode & QR Scanner Staff', 'Warehouse', 16500, 24, 4, 1000, 26, 'r11'),
      calculateWorkerItem('EMP-2026-0303', 'Mohd. Imran', 'Forklift & Pallet Operator', 'Warehouse', 19000, 26, 18, 1500, 26, 'r12'),
    ],
    createdAt: '2026-10-06T08:00:00.000Z',
    updatedAt: '2026-10-06T08:00:00.000Z',
  },
];

export default function DepartmentPayrollPage() {
  const { session } = useAuth();

  // Active top tab
  const [activeTab, setActiveTab] = useState<'manager_desk' | 'review_inboxes' | 'approved_register'>('manager_desk');

  // Sheet records state
  const [sheets, setSheets] = useState<DepartmentPayrollSheet[]>(INITIAL_SHEETS);

  // Manager Desk state
  const [selectedDeptIndex, setSelectedDeptIndex] = useState(0);
  const selectedTemplate = INITIAL_TEMPLATES[selectedDeptIndex];
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [workingDays, setWorkingDays] = useState(26);
  const [managerNotesInput, setManagerNotesInput] = useState(
    'Biometric attendance synced with turnstiles. Overtime authorized for urgent production backlog.'
  );

  // Active editable workers in Manager Desk
  const [workerRows, setWorkerRows] = useState<WorkerAttendanceSalaryRecord[]>(() => {
    return selectedTemplate.workers.map((w) =>
      calculateWorkerItem(w.workerId, w.workerName, w.role, selectedTemplate.department, w.baseSalaryRate, w.daysPresent, w.overtimeHours, w.allowances, 26)
    );
  });

  // When changing department template
  const handleDepartmentChange = (index: number) => {
    setSelectedDeptIndex(index);
    const tmpl = INITIAL_TEMPLATES[index];
    setWorkerRows(
      tmpl.workers.map((w) =>
        calculateWorkerItem(w.workerId, w.workerName, w.role, tmpl.department, w.baseSalaryRate, w.daysPresent, w.overtimeHours, w.allowances, workingDays)
      )
    );
  };

  // Update a worker's editable days or overtime
  const handleUpdateWorker = (
    index: number,
    field: 'daysPresent' | 'overtimeHours' | 'baseSalaryRate' | 'allowances',
    val: number
  ) => {
    const updated = [...workerRows];
    const current = updated[index];
    const newDays = field === 'daysPresent' ? val : current.daysPresent;
    const newOT = field === 'overtimeHours' ? val : current.overtimeHours;
    const newBase = field === 'baseSalaryRate' ? val : current.baseSalaryRate;
    const newAllow = field === 'allowances' ? val : current.allowances;

    updated[index] = calculateWorkerItem(
      current.workerId,
      current.workerName,
      current.role,
      selectedTemplate.department,
      newBase,
      newDays,
      newOT,
      newAllow,
      workingDays,
      current.id
    );
    setWorkerRows(updated);
  };

  // Add new worker row modal state
  const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState(false);
  const [newWorkerId, setNewWorkerId] = useState(`EMP-2026-0${Math.floor(100 + Math.random() * 900)}`);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('Assembly Line Technician');
  const [newWorkerBase, setNewWorkerBase] = useState(19000);
  const [newWorkerDays, setNewWorkerDays] = useState(26);
  const [newWorkerOT, setNewWorkerOT] = useState(0);

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName) return;
    const newRec = calculateWorkerItem(
      newWorkerId,
      newWorkerName,
      newWorkerRole,
      selectedTemplate.department,
      newWorkerBase,
      newWorkerDays,
      newWorkerOT,
      1200,
      workingDays
    );
    setWorkerRows((prev) => [...prev, newRec]);
    setIsAddWorkerModalOpen(false);
    setNewWorkerName('');
    setNewWorkerId(`EMP-2026-0${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleRemoveWorker = (index: number) => {
    setWorkerRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Manager Desk Totals
  const managerTotals = useMemo(() => {
    const totalWorkers = workerRows.length;
    const totalGross = workerRows.reduce((a, b) => a + b.grossPay, 0);
    const totalPf = workerRows.reduce((a, b) => a + b.pfDeduction, 0);
    const totalEsi = workerRows.reduce((a, b) => a + b.esiDeduction, 0);
    const totalPt = workerRows.reduce((a, b) => a + b.professionalTax, 0);
    const totalNet = workerRows.reduce((a, b) => a + b.netPayable, 0);
    return { totalWorkers, totalGross, totalPf, totalEsi, totalPt, totalNet };
  }, [workerRows]);

  // Submission Modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Submit Department Payout Handler
  const handleSubmitDepartmentPayout = () => {
    const newSheetId = `dept-sheet-${Date.now()}`;
    const newSheet: DepartmentPayrollSheet = {
      id: newSheetId,
      department: selectedTemplate.department,
      departmentCode: selectedTemplate.departmentCode,
      managerId: selectedTemplate.managerId,
      managerName: selectedTemplate.managerName,
      monthYear: selectedMonth,
      month: selectedMonth.split(' ')[0],
      year: parseInt(selectedMonth.split(' ')[1], 10) || 2026,
      workingDaysInMonth: workingDays,
      totalWorkers: managerTotals.totalWorkers,
      totalGrossAmount: managerTotals.totalGross,
      totalEsiAmount: managerTotals.totalEsi,
      totalPfAmount: managerTotals.totalPf,
      totalAmount: managerTotals.totalNet,
      status: 'SUBMITTED_TO_REVIEW',
      managerNotes: managerNotesInput,
      submittedAt: new Date().toISOString(),
      hrReviewerId: null,
      hrReviewerName: null,
      hrNotes: null,
      hrStatus: 'PENDING',
      hrReviewedAt: null,
      financeReviewerId: null,
      financeReviewerName: null,
      financeNotes: null,
      financeStatus: 'PENDING',
      financeReviewedAt: null,
      superAdminReviewerId: null,
      superAdminReviewerName: null,
      superAdminNotes: null,
      superAdminStatus: 'PENDING',
      superAdminReviewedAt: null,
      clearanceReference: null,
      records: [...workerRows],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSheets((prev) => [newSheet, ...prev]);
    setIsSubmitModalOpen(false);
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 5000);
  };

  // Review Inboxes State
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'SUBMITTED' | 'APPROVED' | 'DRAFT'>('ALL');
  const [reviewerRoleView, setReviewerRoleView] = useState<'HR' | 'FINANCE' | 'SUPER_ADMIN'>('FINANCE');
  const [inspectingSheet, setInspectingSheet] = useState<DepartmentPayrollSheet | null>(null);
  const [reviewNotesInput, setReviewNotesInput] = useState('');

  // Handle Review Action (HR / Super Admin / Finance)
  const handleReviewDecision = (decision: 'APPROVE' | 'FLAG' | 'REVISE') => {
    if (!inspectingSheet) return;

    setSheets((prev) =>
      prev.map((s) => {
        if (s.id !== inspectingSheet.id) return s;

        const updated = { ...s };
        const now = new Date().toISOString();
        const reviewerName =
          reviewerRoleView === 'HR'
            ? 'Kavita Menon (HR Lead)'
            : reviewerRoleView === 'SUPER_ADMIN'
            ? 'Dr. Rajesh (Owner/MD)'
            : 'Amitabh Sen (Finance Lead)';

        if (reviewerRoleView === 'HR') {
          updated.hrReviewerName = reviewerName;
          updated.hrStatus = decision === 'APPROVE' ? 'APPROVED' : 'FLAGGED';
          updated.hrNotes = reviewNotesInput || 'Attendance records verified against biometric turnstiles.';
          updated.hrReviewedAt = now;
        } else if (reviewerRoleView === 'SUPER_ADMIN') {
          updated.superAdminReviewerName = reviewerName;
          updated.superAdminStatus = decision === 'APPROVE' ? 'APPROVED' : 'FLAGGED';
          updated.superAdminNotes = reviewNotesInput || 'Department factory operations verified.';
          updated.superAdminReviewedAt = now;
        } else if (reviewerRoleView === 'FINANCE') {
          if (decision === 'APPROVE') {
            updated.status = 'APPROVED_BY_FINANCE';
            updated.financeStatus = 'APPROVED';
            updated.financeReviewerName = reviewerName;
            updated.financeNotes = reviewNotesInput || 'Statutory PF and ESI records cleared for bank disbursement.';
            updated.financeReviewedAt = now;
            const shortDept = (s.departmentCode || 'DEPT').toUpperCase().replace(/[^A-Z0-9]/g, '');
            const rand = Math.floor(1000 + Math.random() * 9000);
            updated.clearanceReference = `DEPT-CLR-${shortDept}-${s.year}-${s.month.substr(0, 3).toUpperCase()}-${rand}`;
          } else {
            updated.financeStatus = 'FLAGGED';
            updated.financeNotes = reviewNotesInput || 'Queried for deduction clarification.';
            if (decision === 'REVISE') updated.status = 'REJECTED';
          }
        }

        updated.updatedAt = now;
        setInspectingSheet(updated);
        return updated;
      })
    );
    setReviewNotesInput('');
  };

  // Filtered sheets for review queue
  const filteredReviewSheets = useMemo(() => {
    return sheets.filter((s) => {
      if (reviewFilter === 'SUBMITTED') return s.status === 'SUBMITTED_TO_REVIEW';
      if (reviewFilter === 'APPROVED') return s.status === 'APPROVED_BY_FINANCE';
      if (reviewFilter === 'DRAFT') return s.status === 'DRAFT';
      return true;
    });
  }, [sheets, reviewFilter]);

  // Approved sheets for register
  const approvedSheetsList = useMemo(() => {
    return sheets.filter((s) => s.status === 'APPROVED_BY_FINANCE');
  }, [sheets]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800">
              <Building2 className="h-3.5 w-3.5" />
              Department Attendance & Wage Hub
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              SEC-PAYROLL-004
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Department Head Salary & Attendance Desk
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Department managers compute worker attendance & wages with statutory ESI/PF, routing directly to HR, Finance, and Super Admin inboxes.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('manager_desk')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'manager_desk'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Manager Attendance Desk
          </button>
          <button
            onClick={() => setActiveTab('review_inboxes')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'review_inboxes'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            Cross-Department Review Inboxes
            {sheets.filter((s) => s.status === 'SUBMITTED_TO_REVIEW').length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {sheets.filter((s) => s.status === 'SUBMITTED_TO_REVIEW').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('approved_register')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'approved_register'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Approved Payout Register
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {submissionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Department Payroll Sheet Dispatched!</span> The compiled monthly attendance and statutory salary sheet has been securely submitted simultaneously to the inboxes of HR, Finance, and Super Admin.
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: DEPARTMENT MANAGER ATTENDANCE & SALARY DESK            */}
      {/* ============================================================== */}
      {activeTab === 'manager_desk' && (
        <div className="space-y-6">
          {/* Manager Workspace Selector Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department & Phone Line
                </label>
                <select
                  value={selectedDeptIndex}
                  onChange={(e) => handleDepartmentChange(Number(e.target.value))}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {INITIAL_TEMPLATES.map((tmpl, idx) => (
                    <option key={tmpl.departmentCode} value={idx}>
                      {tmpl.department} ({tmpl.departmentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Salary Month / Period
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="October 2026">October 2026 (Active Factory Period)</option>
                  <option value="November 2026">November 2026</option>
                  <option value="September 2026">September 2026 (Closed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Factory Shift Working Days
                </label>
                <input
                  type="number"
                  min="20"
                  max="31"
                  value={workingDays}
                  onChange={(e) => {
                    const days = Number(e.target.value) || 26;
                    setWorkingDays(days);
                    setWorkerRows((prev) =>
                      prev.map((w) =>
                        calculateWorkerItem(
                          w.workerId,
                          w.workerName,
                          w.role,
                          selectedTemplate.department,
                          w.baseSalaryRate,
                          w.daysPresent,
                          w.overtimeHours,
                          w.allowances,
                          days,
                          w.id
                        )
                      )
                    );
                  }}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department Head / Manager
                </label>
                <div className="w-full text-xs font-semibold rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 px-3 py-2 text-slate-700 dark:text-slate-300 truncate">
                  {selectedTemplate.managerName}
                </div>
              </div>
            </div>

            {/* Shift notes and quick actions */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={managerNotesInput}
                  onChange={(e) => setManagerNotesInput(e.target.value)}
                  placeholder="Manager notes: shift overtime reason, turnstile verification remark..."
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerModalOpen(true)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Worker Row
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Payout Sheet to HR, Finance & Super Admin
                </button>
              </div>
            </div>
          </div>

          {/* Stat KPI Cards for manager */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Department Staff</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 flex items-baseline gap-1">
                {managerTotals.totalWorkers}
                <span className="text-[11px] text-slate-400 font-normal">technicians</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Gross Monthly Wages</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                ₹{managerTotals.totalGross.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Statutory PF (12%)</div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                ₹{managerTotals.totalPf.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Statutory ESI (0.75%)</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{managerTotals.totalEsi.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 col-span-2 md:col-span-1">
              <div className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-200">Net Take-Home Payout</div>
              <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">
                ₹{managerTotals.totalNet.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Interactive Attendance & Salary Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Worker Attendance Roster & Statutory Salary Calculations
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Adjust days present or overtime hours; prorated basic, overtime pay, statutory PF (12%) and ESI (0.75%) calculate automatically.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Turnstiles Live Connected
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Worker / Role</th>
                    <th className="py-3 px-3 text-center">Days Present ({workingDays})</th>
                    <th className="py-3 px-3 text-center">Overtime (Hrs)</th>
                    <th className="py-3 px-3 text-right">Base Wage (₹)</th>
                    <th className="py-3 px-3 text-right">Prorated Basic (₹)</th>
                    <th className="py-3 px-3 text-right">OT Pay (₹)</th>
                    <th className="py-3 px-3 text-right">Gross (₹)</th>
                    <th className="py-3 px-3 text-right">PF 12% (₹)</th>
                    <th className="py-3 px-3 text-right">ESI 0.75% (₹)</th>
                    <th className="py-3 px-3 text-right font-bold text-indigo-600 dark:text-indigo-400">Net Take-Home</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {workerRows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{row.workerName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono">{row.workerId}</span> • <span>{row.role}</span>
                        </div>
                      </td>

                      {/* Editable Days Present */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max={workingDays}
                          value={row.daysPresent}
                          onChange={(e) => handleUpdateWorker(idx, 'daysPresent', Number(e.target.value))}
                          className="w-14 text-center font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-1 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Editable Overtime Hours */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="80"
                          value={row.overtimeHours}
                          onChange={(e) => handleUpdateWorker(idx, 'overtimeHours', Number(e.target.value))}
                          className="w-14 text-center font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-1 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                        ₹{row.baseSalaryRate.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-white">
                        ₹{row.basicPay.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        +₹{row.overtimePay.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                        ₹{row.grossPay.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-indigo-600 dark:text-indigo-400">
                        -₹{row.pfDeduction.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        {row.esiDeduction > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400">-₹{row.esiDeduction}</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Exempt</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        ₹{row.netPayable.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveWorker(idx)}
                          className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded transition"
                          title="Remove Worker Row"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* ============================================================== */}
      {/* TAB 2: CROSS-DEPARTMENT REVIEW INBOXES                         */}
      {/* ============================================================== */}
      {activeTab === 'review_inboxes' && (
        <div className="space-y-6">
          {/* Multi-Recipient Role Selector Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Multi-Recipient Cross-Audit Console
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simultaneous inbox for HR (attendance check), Finance (statutory & payment clearance), and Super Admin (factory executive oversight).
              </p>
            </div>

            {/* Acting Reviewer Role Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Viewing As:</span>
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setReviewerRoleView('HR')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    reviewerRoleView === 'HR'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  HR Department
                </button>
                <button
                  type="button"
                  onClick={() => setReviewerRoleView('FINANCE')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    reviewerRoleView === 'FINANCE'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Finance Department
                </button>
                <button
                  type="button"
                  onClick={() => setReviewerRoleView('SUPER_ADMIN')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    reviewerRoleView === 'SUPER_ADMIN'
                      ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Super Admin (Owner)
                </button>
              </div>
            </div>
          </div>

          {/* Review Filter Pills */}
          <div className="flex items-center gap-2">
            {(['ALL', 'SUBMITTED', 'APPROVED', 'DRAFT'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setReviewFilter(filterKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  reviewFilter === filterKey
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {filterKey === 'ALL' && 'All Departments'}
                {filterKey === 'SUBMITTED' && 'Awaiting Review & Clearance'}
                {filterKey === 'APPROVED' && 'Approved & Cleared'}
                {filterKey === 'DRAFT' && 'Draft Sheets'}
              </button>
            ))}
          </div>

          {/* Department Sheet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviewSheets.map((sheet) => (
              <div
                key={sheet.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                          {sheet.departmentCode}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {sheet.monthYear}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {sheet.department}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Manager: <strong className="text-slate-700 dark:text-slate-300">{sheet.managerName}</strong>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        sheet.status === 'APPROVED_BY_FINANCE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : sheet.status === 'SUBMITTED_TO_REVIEW'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {sheet.status === 'APPROVED_BY_FINANCE'
                        ? 'Approved & Cleared'
                        : sheet.status === 'SUBMITTED_TO_REVIEW'
                        ? 'Under Multi-Review'
                        : 'Draft'}
                    </span>
                  </div>

                  {/* Manager Notes */}
                  {sheet.managerNotes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 italic">
                      "{sheet.managerNotes}"
                    </div>
                  )}

                  {/* Financial breakdown overview */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Technicians</div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{sheet.totalWorkers}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Statutory ESI/PF</div>
                      <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        ₹{(sheet.totalPfAmount + sheet.totalEsiAmount).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Net Disbursement</div>
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{sheet.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Party Sign-Off Status Matrix */}
                  <div className="mt-4 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">HR Attendance Audit:</span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          sheet.hrStatus === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {sheet.hrStatus === 'APPROVED' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {sheet.hrStatus === 'APPROVED' ? 'Verified by HR' : 'Pending Verification'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Super Admin Oversight:</span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          sheet.superAdminStatus === 'APPROVED' ? 'text-purple-600' : 'text-amber-600'
                        }`}
                      >
                        {sheet.superAdminStatus === 'APPROVED' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {sheet.superAdminStatus === 'APPROVED' ? 'Executive Approved' : 'Pending Review'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Finance Clearance:</span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          sheet.financeStatus === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {sheet.financeStatus === 'APPROVED' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {sheet.financeStatus === 'APPROVED' ? 'Disbursement Cleared' : 'Pending Clearance'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inspect Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {sheet.clearanceReference ? (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                      Ref: {sheet.clearanceReference}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      Submitted: {sheet.submittedAt ? new Date(sheet.submittedAt).toLocaleDateString() : 'Draft'}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setInspectingSheet(sheet)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Inspect & Audit Sheet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: APPROVED DEPARTMENT PAYOUTS REGISTER                    */}
      {/* ============================================================== */}
      {activeTab === 'approved_register' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Official Department Clearance & Settlement Archive
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Audited register of department payroll sheets that have received full clearance from HR, Super Admin, and Finance.
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Settled Department Funds</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{approvedSheetsList.reduce((a, b) => a + b.totalAmount, 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Clearance Ref / Dept</th>
                    <th className="py-3.5 px-4">Period</th>
                    <th className="py-3.5 px-4">Department Manager</th>
                    <th className="py-3.5 px-4 text-center">Workers</th>
                    <th className="py-3.5 px-4 text-right">Gross Total (₹)</th>
                    <th className="py-3.5 px-4 text-right">Statutory ESI/PF (₹)</th>
                    <th className="py-3.5 px-4 text-right font-bold text-emerald-600">Net Disbursed (₹)</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {approvedSheetsList.map((sheet) => (
                    <tr key={sheet.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {sheet.clearanceReference || 'DEPT-CLR-CLEARED'}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          {sheet.department}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {sheet.monthYear}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        {sheet.managerName}
                      </td>

                      <td className="py-3.5 px-4 text-center text-slate-800 dark:text-slate-200">
                        {sheet.totalWorkers}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        ₹{sheet.totalGrossAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-indigo-600 dark:text-indigo-400">
                        ₹{(sheet.totalPfAmount + sheet.totalEsiAmount).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{sheet.totalAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" /> Bank Released
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: SUBMIT DEPARTMENT PAYOUT CONFIRMATION MODAL           */}
      {/* ============================================================== */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Department Payout Submission
                </h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You are about to submit the attendance & salary calculations for <strong>{selectedTemplate.department}</strong> ({selectedMonth}). This will immediately route to the review queues of:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                <span><strong>HR Department Inbox:</strong> For biometric turnstile attendance cross-verification.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>Finance Department Inbox:</strong> For statutory ESI/PF pools & bank clearance.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-600 shrink-0" />
                <span><strong>Super Admin (Owner / MD):</strong> For cross-department factory executive oversight.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex justify-between font-medium">
              <span>Total Workers: <strong>{managerTotals.totalWorkers}</strong></span>
              <span>Net Take-Home: <strong>₹{managerTotals.totalNet.toLocaleString('en-IN')}</strong></span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitDepartmentPayout}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                Confirm & Route Payout Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ADD WORKER ROW MODAL                                  */}
      {/* ============================================================== */}
      {isAddWorkerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddWorker}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Worker to {selectedTemplate.departmentCode}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddWorkerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Worker ID
                </label>
                <input
                  type="text"
                  value={newWorkerId}
                  onChange={(e) => setNewWorkerId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Worker Full Name
                </label>
                <input
                  type="text"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  placeholder="e.g. Anand Shinde"
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assembly Line Role
                </label>
                <input
                  type="text"
                  value={newWorkerRole}
                  onChange={(e) => setNewWorkerRole(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Base (₹)
                  </label>
                  <input
                    type="number"
                    value={newWorkerBase}
                    onChange={(e) => setNewWorkerBase(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Days Present
                  </label>
                  <input
                    type="number"
                    value={newWorkerDays}
                    max={workingDays}
                    onChange={(e) => setNewWorkerDays(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Overtime (Hrs)
                  </label>
                  <input
                    type="number"
                    value={newWorkerOT}
                    onChange={(e) => setNewWorkerOT(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddWorkerModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Add Worker Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: CROSS-DEPARTMENT INSPECTION & AUDIT MODAL             */}
      {/* ============================================================== */}
      {inspectingSheet && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                    {inspectingSheet.departmentCode}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{inspectingSheet.monthYear}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Audit Inspection: {inspectingSheet.department}
                </h3>
              </div>
              <button
                onClick={() => setInspectingSheet(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Manager submission details */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Submitted By: <strong>{inspectingSheet.managerName}</strong></span>
                <span>Status: <strong>{inspectingSheet.status}</strong></span>
              </div>
              {inspectingSheet.managerNotes && (
                <div className="text-slate-500 italic">Notes: "{inspectingSheet.managerNotes}"</div>
              )}
            </div>

            {/* Workers Table inside Inspection */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Worker</th>
                    <th className="py-2.5 px-2 text-center">Days</th>
                    <th className="py-2.5 px-2 text-center">OT Hrs</th>
                    <th className="py-2.5 px-2 text-right">Gross (₹)</th>
                    <th className="py-2.5 px-2 text-right">PF 12% (₹)</th>
                    <th className="py-2.5 px-2 text-right">ESI (₹)</th>
                    <th className="py-2.5 px-2 text-right font-bold text-indigo-600">Net Pay (₹)</th>
                    <th className="py-2.5 px-2 text-center">Turnstile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {inspectingSheet.records.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 px-3 font-medium">
                        <div>{r.workerName}</div>
                        <div className="text-[10px] text-slate-500">{r.workerId} • {r.role}</div>
                      </td>
                      <td className="py-2 px-2 text-center font-bold">{r.daysPresent}</td>
                      <td className="py-2 px-2 text-center">{r.overtimeHours}</td>
                      <td className="py-2 px-2 text-right font-mono">₹{r.grossPay.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-2 text-right font-mono text-indigo-600">-₹{r.pfDeduction.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-2 text-right font-mono text-slate-500">
                        {r.esiDeduction > 0 ? `-₹${r.esiDeduction}` : 'Exempt'}
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-emerald-600">
                        ₹{r.netPayable.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Matched
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Multi-Review Sign-off Form */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                Record Audit Decision as {reviewerRoleView === 'HR' ? 'HR Department' : reviewerRoleView === 'FINANCE' ? 'Finance Department' : 'Super Admin / Owner'}
              </div>

              <input
                type="text"
                value={reviewNotesInput}
                onChange={(e) => setReviewNotesInput(e.target.value)}
                placeholder="Audit observation notes (e.g. turnstile checked, statutory funds verified)..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleReviewDecision('REVISE')}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 transition"
                >
                  Request Manager Revision
                </button>

                <button
                  type="button"
                  onClick={() => handleReviewDecision('APPROVE')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="h-3.5 w-3.5" />
                  {reviewerRoleView === 'FINANCE'
                    ? 'Clear & Release Department Payout'
                    : `Approve as ${reviewerRoleView}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

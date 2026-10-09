'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Receipt,
  Download,
  Printer,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Building2,
  Check,
  X,
  Plus,
  Coins,
  DollarSign,
  UserCheck,
  Briefcase,
  Layers,
  ChevronRight,
  Fingerprint,
  Moon,
  Sun,
  Flame,
  Wrench,
  Percent,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type WorkforceTab = 'ATTENDANCE_ROSTER' | 'PAYROLL_REGISTER';

export interface ShiftInfo {
  id: string;
  code: string;
  name: string;
  timing: string;
  duration: number; // hours
  headcount: number;
  supervisor: string;
  nightAllowance: number;
  lines: string[];
}

export interface AttendanceRecord {
  id: string;
  employeeCode: string;
  name: string;
  department: string;
  designation: string;
  shiftCode: string;
  shiftName: string;
  scheduledHours: number;
  clockIn: string;
  clockOut: string;
  actualHours: number;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimePay: number;
  status: 'PRESENT' | 'LATE' | 'OVERTIME_ONLY' | 'ABSENT' | 'ON_LEAVE';
  biometricVerified: boolean;
  linkedJobCard?: string;
}

export interface PayrollRecord {
  id: string;
  employeeCode: string;
  name: string;
  department: string;
  designation: string;
  bankAccount: string;
  panNumber: string;
  baseSalaryMonthly: number;
  hourlyRate: number;
  regularHoursTotal: number;
  overtimeHoursTotal: number;
  overtimePay: number;
  shiftAllowances: number;
  grossEarnings: number;
  pfDeduction: number; // 12% statutory
  esiDeduction: number; // 0.75% statutory
  profTax: number; // 200 standard
  totalDeductions: number;
  netPayable: number;
  status: 'DRAFT' | 'CALCULATED' | 'APPROVED' | 'DISBURSED';
}

// ============================================================================
// Sample Mock Data
// ============================================================================

const mockShifts: ShiftInfo[] = [
  {
    id: 's-1',
    code: 'SHIFT_A',
    name: 'Shift A (Morning)',
    timing: '06:00 - 14:30',
    duration: 8.0,
    headcount: 58,
    supervisor: 'Supervisor R. Verma',
    nightAllowance: 0,
    lines: ['Line 1 (Stamping)', 'Line 2 (Header)', 'Line 3 (CNC Lathes)'],
  },
  {
    id: 's-2',
    code: 'SHIFT_B',
    name: 'Shift B (Evening)',
    timing: '14:30 - 23:00',
    duration: 8.0,
    headcount: 52,
    supervisor: 'Supervisor K. Nambiar',
    nightAllowance: 100,
    lines: ['Line 1 (Stamping)', 'Line 3 (CNC Lathes)'],
  },
  {
    id: 's-3',
    code: 'SHIFT_C',
    name: 'Shift C (Night)',
    timing: '23:00 - 06:30',
    duration: 7.5,
    headcount: 22,
    supervisor: 'Night Supervisor S. Gokhale',
    nightAllowance: 250,
    lines: ['Line 3 (CNC Automated Machining)'],
  },
  {
    id: 's-gen',
    code: 'GENERAL',
    name: 'General Shift (Support / QC)',
    timing: '09:00 - 17:30',
    duration: 8.0,
    headcount: 10,
    supervisor: 'Manager V. Sharma',
    nightAllowance: 0,
    lines: ['QA Cleanroom', 'Toolroom & Maintenance', 'Warehouse Putaway'],
  },
];

const mockAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeCode: 'EMP-101',
    name: 'Rajesh Sharma',
    department: 'CNC Machining Cell',
    designation: 'Lead CNC Machinist (5-Axis)',
    shiftCode: 'SHIFT_A',
    shiftName: 'Shift A (06:00 - 14:30)',
    scheduledHours: 8.0,
    clockIn: '05:52',
    clockOut: '17:30',
    actualHours: 11.5,
    regularHours: 8.0,
    overtimeHours: 3.0,
    hourlyRate: 185.0,
    overtimePay: 832.5,
    status: 'PRESENT',
    biometricVerified: true,
    linkedJobCard: 'JC-2026-0881',
  },
  {
    id: 'att-2',
    employeeCode: 'EMP-102',
    name: 'Amitabh Sen',
    department: 'CNC Machining Cell',
    designation: 'CNC Turning Operator Grade I',
    shiftCode: 'SHIFT_A',
    shiftName: 'Shift A (06:00 - 14:30)',
    scheduledHours: 8.0,
    clockIn: '06:04',
    clockOut: '16:34',
    actualHours: 10.5,
    regularHours: 8.0,
    overtimeHours: 2.0,
    hourlyRate: 145.0,
    overtimePay: 435.0,
    status: 'PRESENT',
    biometricVerified: true,
    linkedJobCard: 'JC-2026-0881',
  },
  {
    id: 'att-3',
    employeeCode: 'EMP-103',
    name: 'Kavita Deshmukh',
    department: 'Quality Assurance',
    designation: 'Senior QC Inspector (CMM & PDI)',
    shiftCode: 'GENERAL',
    shiftName: 'General (09:00 - 17:30)',
    scheduledHours: 8.0,
    clockIn: '08:55',
    clockOut: '17:35',
    actualHours: 8.6,
    regularHours: 8.0,
    overtimeHours: 0.0,
    hourlyRate: 210.0,
    overtimePay: 0.0,
    status: 'PRESENT',
    biometricVerified: true,
    linkedJobCard: 'CoC Audit Bay #01',
  },
  {
    id: 'att-4',
    employeeCode: 'EMP-104',
    name: 'Manoj Kumar Gowda',
    department: 'Stamping & Press Shop',
    designation: 'Hydraulic Press Operator',
    shiftCode: 'SHIFT_A',
    shiftName: 'Shift A (06:00 - 14:30)',
    scheduledHours: 8.0,
    clockIn: '06:18',
    clockOut: '14:30',
    actualHours: 8.2,
    regularHours: 7.7,
    overtimeHours: 0.0,
    hourlyRate: 140.0,
    overtimePay: 0.0,
    status: 'LATE',
    biometricVerified: true,
    linkedJobCard: 'JC-2026-0882',
  },
  {
    id: 'att-5',
    employeeCode: 'EMP-105',
    name: 'Suresh Patil',
    department: 'Maintenance & Toolroom',
    designation: 'Senior Electrical Technician',
    shiftCode: 'SHIFT_B',
    shiftName: 'Shift B (14:30 - 23:00)',
    scheduledHours: 8.0,
    clockIn: '14:20',
    clockOut: '23:30',
    actualHours: 9.1,
    regularHours: 8.0,
    overtimeHours: 0.5,
    hourlyRate: 175.0,
    overtimePay: 131.25,
    status: 'PRESENT',
    biometricVerified: true,
    linkedJobCard: 'MNT-2026-0042',
  },
  {
    id: 'att-6',
    employeeCode: 'EMP-106',
    name: 'Deepak Chauhan',
    department: 'Header & Cold Forging',
    designation: 'Cold Header Specialist',
    shiftCode: 'SHIFT_C',
    shiftName: 'Shift C (23:00 - 06:30)',
    scheduledHours: 7.5,
    clockIn: '22:50',
    clockOut: '08:00',
    actualHours: 9.1,
    regularHours: 7.5,
    overtimeHours: 1.5,
    hourlyRate: 155.0,
    overtimePay: 348.75,
    status: 'PRESENT',
    biometricVerified: true,
    linkedJobCard: 'JC-2026-0879',
  },
];

const mockPayroll: PayrollRecord[] = [
  {
    id: 'pr-1',
    employeeCode: 'EMP-101',
    name: 'Rajesh Sharma',
    department: 'CNC Machining Cell',
    designation: 'Lead CNC Machinist (5-Axis)',
    bankAccount: 'HDFC - 50100481239912',
    panNumber: 'AAAPS1234F',
    baseSalaryMonthly: 38000.0,
    hourlyRate: 185.0,
    regularHoursTotal: 184.0,
    overtimeHoursTotal: 26.5,
    overtimePay: 7353.75,
    shiftAllowances: 1500.0,
    grossEarnings: 46853.75,
    pfDeduction: 4560.0,
    esiDeduction: 351.4,
    profTax: 200.0,
    totalDeductions: 5111.4,
    netPayable: 41742.35,
    status: 'CALCULATED',
  },
  {
    id: 'pr-2',
    employeeCode: 'EMP-102',
    name: 'Amitabh Sen',
    department: 'CNC Machining Cell',
    designation: 'CNC Operator Grade I',
    bankAccount: 'ICICI - 002901589123',
    panNumber: 'ABCPS9912K',
    baseSalaryMonthly: 29000.0,
    hourlyRate: 145.0,
    regularHoursTotal: 184.0,
    overtimeHoursTotal: 18.0,
    overtimePay: 3915.0,
    shiftAllowances: 1200.0,
    grossEarnings: 34115.0,
    pfDeduction: 3480.0,
    esiDeduction: 255.86,
    profTax: 200.0,
    totalDeductions: 3935.86,
    netPayable: 30179.14,
    status: 'CALCULATED',
  },
  {
    id: 'pr-3',
    employeeCode: 'EMP-103',
    name: 'Kavita Deshmukh',
    department: 'Quality Assurance',
    designation: 'Senior QC Inspector (CMM)',
    bankAccount: 'SBI - 20491029411',
    panNumber: 'BKSPD4410A',
    baseSalaryMonthly: 42000.0,
    hourlyRate: 210.0,
    regularHoursTotal: 184.0,
    overtimeHoursTotal: 4.0,
    overtimePay: 1260.0,
    shiftAllowances: 0.0,
    grossEarnings: 43260.0,
    pfDeduction: 5040.0,
    esiDeduction: 324.45,
    profTax: 200.0,
    totalDeductions: 5564.45,
    netPayable: 37695.55,
    status: 'CALCULATED',
  },
  {
    id: 'pr-4',
    employeeCode: 'EMP-104',
    name: 'Manoj Kumar Gowda',
    department: 'Stamping & Press Shop',
    designation: 'Hydraulic Press Operator',
    bankAccount: 'Canara - 1100294819',
    panNumber: 'CMKPG7712M',
    baseSalaryMonthly: 28000.0,
    hourlyRate: 140.0,
    regularHoursTotal: 178.5,
    overtimeHoursTotal: 6.0,
    overtimePay: 1260.0,
    shiftAllowances: 800.0,
    grossEarnings: 30060.0,
    pfDeduction: 3360.0,
    esiDeduction: 225.45,
    profTax: 200.0,
    totalDeductions: 3785.45,
    netPayable: 26274.55,
    status: 'CALCULATED',
  },
  {
    id: 'pr-5',
    employeeCode: 'EMP-105',
    name: 'Suresh Patil',
    department: 'Maintenance & Toolroom',
    designation: 'Senior Electrical Technician',
    bankAccount: 'Axis - 9180200491823',
    panNumber: 'ASPSP0011C',
    baseSalaryMonthly: 35000.0,
    hourlyRate: 175.0,
    regularHoursTotal: 184.0,
    overtimeHoursTotal: 14.0,
    overtimePay: 3675.0,
    shiftAllowances: 2000.0,
    grossEarnings: 40675.0,
    pfDeduction: 4200.0,
    esiDeduction: 305.06,
    profTax: 200.0,
    totalDeductions: 4705.06,
    netPayable: 35969.94,
    status: 'CALCULATED',
  },
  {
    id: 'pr-6',
    employeeCode: 'EMP-106',
    name: 'Deepak Chauhan',
    department: 'Header & Cold Forging',
    designation: 'Cold Header Technician',
    bankAccount: 'Kotak - 4018291039',
    panNumber: 'CDKPC8810P',
    baseSalaryMonthly: 31000.0,
    hourlyRate: 155.0,
    regularHoursTotal: 184.0,
    overtimeHoursTotal: 22.0,
    overtimePay: 5115.0,
    shiftAllowances: 3500.0,
    grossEarnings: 39615.0,
    pfDeduction: 3720.0,
    esiDeduction: 297.11,
    profTax: 200.0,
    totalDeductions: 4217.11,
    netPayable: 35397.89,
    status: 'CALCULATED',
  },
];

export default function WorkforceManagementPage() {
  const [activeTab, setActiveTab] = useState<WorkforceTab>('ATTENDANCE_ROSTER');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(mockPayroll);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Filtered Attendance List
  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesShift =
        selectedShiftFilter === 'ALL' || item.shiftCode === selectedShiftFilter;

      return matchesSearch && matchesShift;
    });
  }, [attendance, searchQuery, selectedShiftFilter]);

  // Overall Workforce Metrics
  const stats = useMemo(() => {
    const totalPresent = attendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
    const totalOTHours = attendance.reduce((sum, a) => sum + a.overtimeHours, 0);
    const totalOTCost = attendance.reduce((sum, a) => sum + a.overtimePay, 0);
    const totalNetPayroll = payroll.reduce((sum, p) => sum + p.netPayable, 0);
    const totalDeductions = payroll.reduce((sum, p) => sum + p.totalDeductions, 0);

    return { totalPresent, totalOTHours, totalOTCost, totalNetPayroll, totalDeductions };
  }, [attendance, payroll]);

  // Batch Approval Action
  const handleApproveAllPayroll = () => {
    setPayroll((prev) =>
      prev.map((item) => ({ ...item, status: 'APPROVED' }))
    );
    showToast(
      `October 2026 Payroll approved! Net disbursement of ₹${stats.totalNetPayroll.toLocaleString('en-IN')} queued for direct bank transfer.`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
              Workforce Operations & Shift Payroll
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <Fingerprint className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Biometric Roster
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              1.5x Overtime Calculation
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Plant shift attendance roster, automated 1.5x/2.0x overtime computations, statutory deductions (PF 12% &bull; ESI 0.75%), and executive payroll register.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('ATTENDANCE_ROSTER')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2',
              activeTab === 'ATTENDANCE_ROSTER'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            <Clock className="w-4 h-4" />
            <span>Shift Attendance & OT</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PAYROLL_REGISTER')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2',
              activeTab === 'PAYROLL_REGISTER'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            <Receipt className="w-4 h-4" />
            <span>Monthly Payroll Table</span>
          </button>
        </div>
      </div>

      {/* Top HR KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Present On Floor */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Present Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-50 mt-2 font-mono">
            {stats.totalPresent} / {attendance.length} Staff
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            100% biometric verified punches
          </div>
        </div>

        {/* KPI 2: Overtime Clocked */}
        <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Overtime Clocked Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-800 dark:text-amber-300 mt-2 font-mono">
            +{stats.totalOTHours.toFixed(1)} Hours
          </div>
          <div className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-semibold font-mono">
            Accrued OT Pay: ₹{stats.totalOTCost.toLocaleString('en-IN')}
          </div>
        </div>

        {/* KPI 3: Net Payroll Liability */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Net Payroll Batch
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-50 mt-2 font-mono">
            ₹{stats.totalNetPayroll.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold">
            Across {payroll.length} production specialists
          </div>
        </div>

        {/* KPI 4: Statutory Deductions */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Statutory PF & ESI
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">
            ₹{stats.totalDeductions.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold">
            12% PF + 0.75% ESI + PT Compliant
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SHIFT ATTENDANCE ROSTER & OVERTIME CALCULATOR                      */}
      {/* ========================================================================= */}
      {activeTab === 'ATTENDANCE_ROSTER' && (
        <div className="space-y-6">
          {/* Shift Master Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {mockShifts.map((shift) => (
              <div
                key={shift.id}
                onClick={() => setSelectedShiftFilter(selectedShiftFilter === shift.code ? 'ALL' : shift.code)}
                className={cn(
                  'p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2',
                  selectedShiftFilter === shift.code
                    ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {shift.name}
                    </span>
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {shift.timing}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    Supervisor: {shift.supervisor}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{shift.headcount} Operatives</span>
                  {shift.nightAllowance > 0 && (
                    <span className="font-mono text-amber-600 font-bold">
                      +₹{shift.nightAllowance} Allowance
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filter Strip */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Employee, Code, or Department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
              <span className="text-slate-400">Showing {filteredAttendance.length} records</span>
              <button
                type="button"
                onClick={() => setSelectedShiftFilter('ALL')}
                className="px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Shift Attendance & Overtime Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm text-xs">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department & Role</th>
                  <th className="p-4">Shift & Timings</th>
                  <th className="p-4 text-center">Clock-In & Out</th>
                  <th className="p-4 text-center">Regular Hours</th>
                  <th className="p-4 text-center">Overtime Hours</th>
                  <th className="p-4 text-right">Overtime Pay (1.5x)</th>
                  <th className="p-4 text-center">Floor Job Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                {filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    {/* Employee Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">
                          {rec.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {rec.name}
                          </span>
                          <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                            {rec.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {rec.department}
                      </span>
                      <span className="text-[11px] text-slate-500">{rec.designation}</span>
                    </td>

                    {/* Shift & Timings */}
                    <td className="p-4">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {rec.shiftName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Base: {rec.scheduledHours} hrs
                      </span>
                    </td>

                    {/* Clock In / Out */}
                    <td className="p-4 text-center font-mono font-bold">
                      <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                        {rec.clockIn} &rarr; {rec.clockOut}
                      </div>
                      {rec.status === 'LATE' && (
                        <span className="block text-[9px] text-rose-500 font-extrabold mt-0.5">
                          LATE ARRIVAL
                        </span>
                      )}
                    </td>

                    {/* Regular Hours */}
                    <td className="p-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {rec.regularHours.toFixed(1)} hrs
                    </td>

                    {/* Overtime Hours */}
                    <td className="p-4 text-center font-mono">
                      {rec.overtimeHours > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                          +{rec.overtimeHours.toFixed(1)} hrs OT
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">0.0 hrs</span>
                      )}
                    </td>

                    {/* Overtime Pay */}
                    <td className="p-4 text-right font-mono font-bold">
                      {rec.overtimePay > 0 ? (
                        <span className="text-amber-700 dark:text-amber-400 text-sm">
                          ₹{rec.overtimePay.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400">₹0.00</span>
                      )}
                    </td>

                    {/* Linked Job Card */}
                    <td className="p-4 text-center font-mono text-[11px]">
                      {rec.linkedJobCard ? (
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900">
                          {rec.linkedJobCard}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MONTHLY PAYROLL BREAKDOWN REGISTER                                */}
      {/* ========================================================================= */}
      {activeTab === 'PAYROLL_REGISTER' && (
        <div className="space-y-6">
          {/* Top Actions & Summary Banner */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white dark:bg-slate-800/90 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black">
                  Monthly Payroll Register: October 2026 Batch
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Statutory Wage Code: Basic Rate + 1.5x OT + Night Shift Differential. Deductions: PF (12%) + ESI (0.75%) + Professional Tax (₹200).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Register</span>
              </button>

              <button
                type="button"
                onClick={handleApproveAllPayroll}
                className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Authorize & Approve Payroll Batch</span>
              </button>
            </div>
          </div>

          {/* Comprehensive Payroll Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm text-xs">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-3.5">Employee & Account</th>
                  <th className="p-3.5 text-right">Base Salary</th>
                  <th className="p-3.5 text-center">Hours (Reg / OT)</th>
                  <th className="p-3.5 text-right">OT Pay</th>
                  <th className="p-3.5 text-right">Shift Allow.</th>
                  <th className="p-3.5 text-right font-black text-slate-700 dark:text-slate-300">Gross Earnings</th>
                  <th className="p-3.5 text-right">PF (12%)</th>
                  <th className="p-3.5 text-right">ESI (0.75%)</th>
                  <th className="p-3.5 text-right">Total Deduct.</th>
                  <th className="p-3.5 text-right font-black text-emerald-600">Net Payable</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {payroll.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    {/* Employee Info */}
                    <td className="p-3.5 font-sans">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {p.employeeCode} &bull; {p.bankAccount}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        PAN: {p.panNumber}
                      </span>
                    </td>

                    {/* Base Salary */}
                    <td className="p-3.5 text-right font-bold text-slate-800 dark:text-slate-200">
                      ₹{p.baseSalaryMonthly.toLocaleString('en-IN')}
                    </td>

                    {/* Hours (Regular / OT) */}
                    <td className="p-3.5 text-center">
                      <span>{p.regularHoursTotal}h</span>
                      {p.overtimeHoursTotal > 0 && (
                        <span className="text-amber-600 font-bold block text-[10px]">
                          +{p.overtimeHoursTotal}h OT
                        </span>
                      )}
                    </td>

                    {/* OT Pay */}
                    <td className="p-3.5 text-right font-bold text-amber-600 dark:text-amber-400">
                      ₹{p.overtimePay.toLocaleString('en-IN')}
                    </td>

                    {/* Shift Allowances */}
                    <td className="p-3.5 text-right text-slate-600 dark:text-slate-400">
                      ₹{p.shiftAllowances.toLocaleString('en-IN')}
                    </td>

                    {/* Gross Earnings */}
                    <td className="p-3.5 text-right font-black text-slate-900 dark:text-slate-100 text-xs">
                      ₹{p.grossEarnings.toLocaleString('en-IN')}
                    </td>

                    {/* PF Deduction (12%) */}
                    <td className="p-3.5 text-right text-rose-600 dark:text-rose-400">
                      -₹{p.pfDeduction.toLocaleString('en-IN')}
                    </td>

                    {/* ESI Deduction (0.75%) */}
                    <td className="p-3.5 text-right text-rose-600 dark:text-rose-400">
                      -₹{p.esiDeduction.toFixed(2)}
                    </td>

                    {/* Total Deductions */}
                    <td className="p-3.5 text-right font-bold text-rose-700 dark:text-rose-300">
                      -₹{p.totalDeductions.toLocaleString('en-IN')}
                    </td>

                    {/* Net Payable */}
                    <td className="p-3.5 text-right font-black text-sm text-emerald-600 dark:text-emerald-400">
                      ₹{p.netPayable.toLocaleString('en-IN')}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center font-sans">
                      {p.status === 'APPROVED' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          APPROVED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          CALCULATED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-950 font-mono font-bold text-xs border-t-2 border-slate-200 dark:border-slate-800">
                <tr>
                  <td className="p-3.5 uppercase font-sans font-bold">Total Batch Sum:</td>
                  <td className="p-3.5 text-right">
                    ₹{payroll.reduce((s, p) => s + p.baseSalaryMonthly, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    {payroll.reduce((s, p) => s + p.overtimeHoursTotal, 0)} hrs OT
                  </td>
                  <td className="p-3.5 text-right text-amber-600">
                    ₹{payroll.reduce((s, p) => s + p.overtimePay, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right">
                    ₹{payroll.reduce((s, p) => s + p.shiftAllowances, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right font-black text-slate-900 dark:text-slate-100">
                    ₹{payroll.reduce((s, p) => s + p.grossEarnings, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right text-rose-600" colSpan={3}>
                    Total Deductions: -₹{stats.totalDeductions.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right font-black text-sm text-emerald-600 dark:text-emerald-400">
                    ₹{stats.totalNetPayroll.toLocaleString('en-IN')}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

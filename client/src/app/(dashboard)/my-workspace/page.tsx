'use client';

import React, { useState } from 'react';
import {
  User,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Shield,
  Plus,
  Download,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ChevronRight,
  HardHat,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Send,
  Sparkles,
} from 'lucide-react';

interface LeaveRecord {
  id: string;
  type: 'ANNUAL_PTO' | 'SICK_LEAVE' | 'COMP_OFF' | 'CASUAL';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

const INITIAL_LEAVES: LeaveRecord[] = [
  {
    id: 'LV-2026-081',
    type: 'ANNUAL_PTO',
    startDate: '2026-11-24',
    endDate: '2026-11-27',
    days: 4,
    reason: 'Family Thanksgiving holiday travel',
    status: 'APPROVED',
  },
  {
    id: 'LV-2026-054',
    type: 'SICK_LEAVE',
    startDate: '2026-09-12',
    endDate: '2026-09-13',
    days: 2,
    reason: 'Seasonal viral flu and fever recovery',
    status: 'APPROVED',
  },
];

interface ExpenseClaim {
  id: string;
  category: 'TRAVEL' | 'TOOLING' | 'SAFETY_PPE' | 'CERTIFICATION';
  description: string;
  amount: string;
  date: string;
  status: 'REIMBURSED' | 'PENDING_APPROVAL' | 'PROCESSING';
}

const INITIAL_EXPENSES: ExpenseClaim[] = [
  {
    id: 'EXP-2026-201',
    category: 'SAFETY_PPE',
    description: 'Custom Orthotic Composite-Toe ESD Safety Boots (OSHA Compliant)',
    amount: '$185.00',
    date: '2026-10-14',
    status: 'REIMBURSED',
  },
  {
    id: 'EXP-2026-218',
    category: 'CERTIFICATION',
    description: 'IPC-A-610 Specialist Recertification Examination Fee',
    amount: '$350.00',
    date: '2026-10-18',
    status: 'PENDING_APPROVAL',
  },
];

interface IssuedAsset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  assignedDate: string;
  calibrationDue?: string;
  condition: 'EXCELLENT' | 'GOOD' | 'CALIBRATION_PENDING';
}

const SAMPLE_ASSETS: IssuedAsset[] = [
  {
    id: 'AST-8921',
    name: 'Zebra TC57x Ultra-Rugged Industrial Barcode Scanner',
    category: 'Mobile Handheld Terminal',
    serialNumber: 'ZBR-57X-99410',
    assignedDate: '2025-02-10',
    condition: 'EXCELLENT',
  },
  {
    id: 'AST-7740',
    name: 'Mitutoyo Digimatic High-Precision Outside Micrometer (0-25mm)',
    category: 'Calibrated Metrology Tool',
    serialNumber: 'MIT-293-821',
    assignedDate: '2025-05-18',
    calibrationDue: '2026-11-20 (Expiring in 29 days)',
    condition: 'CALIBRATION_PENDING',
  },
  {
    id: 'AST-5512',
    name: 'ESD-Safe Dissipative Cleanroom Smock & Dual-Lead Grounding Harness',
    category: 'Personal Safety Gear',
    serialNumber: 'ESD-CL-4412',
    assignedDate: '2026-01-08',
    condition: 'GOOD',
  },
];

export default function MyWorkspacePage() {
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'LEAVE' | 'EXPENSES' | 'PAYSLIP' | 'ASSETS'>('SCHEDULE');
  const [leaves, setLeaves] = useState<LeaveRecord[]>(INITIAL_LEAVES);
  const [expenses, setExpenses] = useState<ExpenseClaim[]>(INITIAL_EXPENSES);

  // Leave Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'ANNUAL_PTO' | 'SICK_LEAVE' | 'COMP_OFF'>('ANNUAL_PTO');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // Overtime Modal State
  const [isOtModalOpen, setIsOtModalOpen] = useState(false);
  const [otHours, setOtHours] = useState('2.5');
  const [otReason, setOtReason] = useState('Line 3 Late SMT Run Completion');

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd || !leaveReason) return;

    const newReq: LeaveRecord = {
      id: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: leaveType,
      startDate: leaveStart,
      endDate: leaveEnd,
      days: 2,
      reason: leaveReason,
      status: 'PENDING',
    };

    setLeaves([newReq, ...leaves]);
    setIsLeaveModalOpen(false);
    setLeaveReason('');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Employee Profile Header */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary shadow-inner">
              AJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Alex Jordan</h1>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Active (Shift A)
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Senior Assembly Lead & IPC-A-610 Specialist • ID: <span className="font-mono text-foreground">EMP-88204</span> • Plant Austin Bay 3
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                <span>Supervisor: <strong className="text-foreground">Sarah Jenkins</strong></span>
                <span>•</span>
                <span>Direct Reports: <strong className="text-foreground">8 Line Techs</strong></span>
                <span>•</span>
                <span>Tenure: <strong className="text-foreground">3 Yrs 4 Mos</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOtModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors shadow-sm"
            >
              <Clock className="w-4 h-4 text-primary" />
              Log Overtime (OT)
            </button>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Apply Leave
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Available PTO Balance</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">16.5</span>
            <span className="text-xs text-muted-foreground ml-2">days remaining</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">+1.66 days accrued this month</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Month Overtime</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">14.0</span>
            <span className="text-xs text-muted-foreground ml-2">hours logged</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">Earned OT premium: $546.00</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned Equipment</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">3 Assets</span>
            <span className="text-xs text-muted-foreground ml-2">in custody</span>
          </div>
          <div className="mt-2 text-xs text-amber-500 font-medium">1 Metrology tool calibration due</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Payday</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">Oct 31, 2026</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground font-medium">Direct Deposit: Chase ****4092</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('SCHEDULE')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'SCHEDULE'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Shift Schedule & Rostering
          </button>
          <button
            onClick={() => setActiveTab('LEAVE')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'LEAVE'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" />
            Leave Management & Balances
          </button>
          <button
            onClick={() => setActiveTab('EXPENSES')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'EXPENSES'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Expense Reimbursements
          </button>
          <button
            onClick={() => setActiveTab('PAYSLIP')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'PAYSLIP'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Payslips & Tax Withholdings
          </button>
          <button
            onClick={() => setActiveTab('ASSETS')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'ASSETS'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <HardHat className="w-4 h-4" />
            Assigned Tools & PPE Assets
          </button>
        </nav>
      </div>

      {/* TAB 1: SHIFT SCHEDULE */}
      {activeTab === 'SCHEDULE' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Current Week 43 Production Roster</h2>
                <p className="text-xs text-muted-foreground">Assigned: Shift A (Morning 06:00 - 14:30) • Cleanroom Bay 3</p>
              </div>
              <button
                onClick={() => alert('Opening Shift Swap Request workflow...')}
                className="text-xs font-medium border border-border px-3 py-1.5 rounded-lg hover:bg-accent text-foreground"
              >
                Request Shift Swap
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
              {[
                { day: 'Mon', date: 'Oct 19', shift: 'Shift A', hours: '06:00 - 14:30', status: 'Completed (8h + 2h OT)' },
                { day: 'Tue', date: 'Oct 20', shift: 'Shift A', hours: '06:00 - 14:30', status: 'Completed (8h)' },
                { day: 'Wed', date: 'Oct 21', shift: 'Shift A', hours: '06:00 - 14:30', status: 'Completed (8h)' },
                { day: 'Thu', date: 'Oct 22', shift: 'Shift A', hours: '06:00 - 14:30', status: 'In Progress (Active Now)', active: true },
                { day: 'Fri', date: 'Oct 23', shift: 'Shift A', hours: '06:00 - 14:30', status: 'Scheduled' },
                { day: 'Sat', date: 'Oct 24', shift: 'Off', hours: 'Roster Rest', status: 'Weekend Rest' },
                { day: 'Sun', date: 'Oct 25', shift: 'Off', hours: 'Roster Rest', status: 'Weekend Rest' },
              ].map((d) => (
                <div
                  key={d.day}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    d.active
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : d.shift === 'Off'
                      ? 'border-border bg-muted/20 opacity-60'
                      : 'border-border bg-card'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-foreground">{d.day}</span>
                      <span className="text-muted-foreground">{d.date}</span>
                    </div>
                    <div className="font-semibold text-sm text-foreground">{d.shift}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{d.hours}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/50 text-[10px] font-semibold text-primary">
                    {d.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEAVE MANAGEMENT */}
      {activeTab === 'LEAVE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="border border-border rounded-xl p-4 bg-card">
              <span className="text-xs text-muted-foreground font-medium">Paid Time Off (PTO)</span>
              <div className="text-2xl font-bold text-foreground mt-1">16.5 Days</div>
              <div className="text-[11px] text-emerald-600 mt-1">Available to use</div>
            </div>
            <div className="border border-border rounded-xl p-4 bg-card">
              <span className="text-xs text-muted-foreground font-medium">Medical / Sick Leave</span>
              <div className="text-2xl font-bold text-foreground mt-1">8.0 Days</div>
              <div className="text-[11px] text-blue-600 mt-1">Annual entitlement</div>
            </div>
            <div className="border border-border rounded-xl p-4 bg-card">
              <span className="text-xs text-muted-foreground font-medium">Compensatory Off</span>
              <div className="text-2xl font-bold text-foreground mt-1">2.0 Days</div>
              <div className="text-[11px] text-purple-600 mt-1">From weekend deployment</div>
            </div>
            <div className="border border-border rounded-xl p-4 bg-card">
              <span className="text-xs text-muted-foreground font-medium">Floating / Casual</span>
              <div className="text-2xl font-bold text-foreground mt-1">3.0 Days</div>
              <div className="text-[11px] text-amber-600 mt-1">Expires Dec 31, 2026</div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Leave History & Pending Requests</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3">Leave Ref</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leaves.map((l) => (
                    <tr key={l.id} className="hover:bg-accent/40">
                      <td className="p-3 font-mono font-bold text-foreground">{l.id}</td>
                      <td className="p-3 font-medium text-foreground">{l.type.replace('_', ' ')}</td>
                      <td className="p-3 text-muted-foreground">{l.startDate} to {l.endDate}</td>
                      <td className="p-3 font-semibold text-foreground">{l.days} Business Days</td>
                      <td className="p-3 text-muted-foreground">{l.reason}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            l.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {l.status}
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

      {/* TAB 3: EXPENSE REIMBURSEMENTS */}
      {activeTab === 'EXPENSES' && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Out-of-Pocket Expense Claims</h2>
              <p className="text-xs text-muted-foreground">Direct ACH deposit upon supervisor & finance sign-off.</p>
            </div>
            <button
              onClick={() => alert('New expense voucher creator modal')}
              className="text-xs font-semibold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/90"
            >
              + Submit Expense Claim
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-3">Claim ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-accent/40">
                    <td className="p-3 font-mono font-bold text-foreground">{e.id}</td>
                    <td className="p-3 font-medium text-foreground">{e.category.replace('_', ' ')}</td>
                    <td className="p-3 text-muted-foreground">{e.description}</td>
                    <td className="p-3 text-muted-foreground">{e.date}</td>
                    <td className="p-3 font-bold text-foreground">{e.amount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          e.status === 'REIMBURSED'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {e.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PAYSLIP */}
      {activeTab === 'PAYSLIP' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Latest Payslip: September 2026</h2>
                <p className="text-xs text-muted-foreground">Disbursed on Sept 30, 2026 • Direct Deposit Ref: #ACH-994120</p>
              </div>
              <button
                onClick={() => alert('Downloading official stamped payslip PDF...')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold border border-border px-3 py-1.5 rounded-lg hover:bg-accent text-foreground"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-4 rounded-xl border border-border">
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-emerald-600 mb-2">
                  Earnings Breakdown
                </h4>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span className="font-semibold text-foreground">$5,200.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Housing & Utility Allowance (HRA)</span>
                  <span className="font-semibold text-foreground">$1,400.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Overtime Compensation (16.5 hrs)</span>
                  <span className="font-semibold text-foreground">$643.50</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Cleanroom Technical Specialist Premium</span>
                  <span className="font-semibold text-foreground">$300.00</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-sm text-foreground">
                  <span>Gross Pay</span>
                  <span className="text-emerald-600">$7,543.50</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-rose-600 mb-2">
                  Statutory Deductions & Taxes
                </h4>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Federal Income Tax Withholding</span>
                  <span className="font-semibold text-foreground">$1,130.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">State Tax (TX)</span>
                  <span className="font-semibold text-foreground">$0.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Social Security & Medicare (FICA)</span>
                  <span className="font-semibold text-foreground">$577.08</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">401(k) Voluntary Retirement Plan</span>
                  <span className="font-semibold text-foreground">$450.00</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-sm text-foreground">
                  <span>Total Deductions</span>
                  <span className="text-rose-600">-$2,157.08</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-primary uppercase">Net Disbursed Take-Home</span>
                <div className="text-2xl font-bold text-foreground">$5,386.42</div>
              </div>
              <span className="text-xs text-muted-foreground">Account: Chase National Bank (Checking ending in 4092)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ASSIGNED ASSETS */}
      {activeTab === 'ASSETS' && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Assigned Precision Hardware, Handhelds & PPE</h2>
              <p className="text-xs text-muted-foreground">Custody of factory serialized assets tied to badge EMP-88204.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_ASSETS.map((a) => (
              <div key={a.id} className="border border-border rounded-xl p-4 bg-muted/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-primary">{a.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.condition === 'EXCELLENT'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : a.condition === 'CALIBRATION_PENDING'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-blue-500/10 text-blue-600'
                      }`}
                    >
                      {a.condition.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1">{a.name}</h3>
                  <div className="text-xs text-muted-foreground space-y-1 mt-2">
                    <div>Type: <span className="font-medium text-foreground">{a.category}</span></div>
                    <div>Serial: <span className="font-mono text-foreground">{a.serialNumber}</span></div>
                    <div>Assigned: <span className="text-foreground">{a.assignedDate}</span></div>
                    {a.calibrationDue && (
                      <div className="text-amber-600 font-semibold mt-1">Calibration: {a.calibrationDue}</div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <button
                    onClick={() => alert(`Submitting calibration recalibration ticket for ${a.name}`)}
                    className="text-primary hover:underline font-semibold"
                  >
                    Request Recalibration
                  </button>
                  <button
                    onClick={() => alert(`Reporting damage/issue for ${a.name}`)}
                    className="text-muted-foreground hover:text-rose-500"
                  >
                    Report Issue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave Application Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Apply for Paid Time Off</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e: any) => setLeaveType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-foreground"
                >
                  <option value="ANNUAL_PTO">Annual Paid Time Off (PTO) - 16.5 Days Avail</option>
                  <option value="SICK_LEAVE">Medical / Sick Leave - 8.0 Days Avail</option>
                  <option value="COMP_OFF">Compensatory Off - 2.0 Days Avail</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2 text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Reason for Absence</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide justification or emergency contact details..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90"
                >
                  Submit to Supervisor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overtime Modal */}
      {isOtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Log Overtime Hours</h3>
              <button onClick={() => setIsOtModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Overtime Duration (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={otHours}
                  onChange={(e) => setOtHours(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Overtime Production Justification</label>
                <input
                  type="text"
                  value={otReason}
                  onChange={(e) => setOtReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-foreground"
                />
              </div>

              <p className="text-[11px] text-muted-foreground">
                Calculated at standard 1.5x hourly rate ($39.00/hr) with automated plant turnstile badge swipe cross-verification.
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOtModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Logged ${otHours} hours overtime. Routed to Supervisor Sarah Jenkins.`);
                    setIsOtModalOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90"
                >
                  Log OT Hours
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

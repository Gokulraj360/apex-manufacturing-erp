'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Building2,
  FileText,
  Search,
  Plus,
  ShieldCheck,
  Send,
  Users,
  Award,
  Sliders,
  X,
  XCircle,
  HelpCircle,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// Types
export type LeaveTypeEnum = 'CASUAL' | 'MEDICAL' | 'SICK' | 'EARNED' | 'MATERNITY_PATERNITY';
export type LeaveRecipientTypeEnum = 'DEPARTMENT_MANAGER' | 'HR';
export type LeaveStatusEnum = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveItem {
  id: string;
  leaveCode: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  departmentLabel: string;
  recipientType: LeaveRecipientTypeEnum;
  targetApproverId: string;
  targetApproverName: string;
  leaveType: LeaveTypeEnum;
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  status: LeaveStatusEnum;
  approverComments?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewedRole?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Department list and managers
const DEPARTMENTS = [
  { key: 'SMT_PRODUCTION', label: 'Precision Assembly Lines', managerName: 'Rajesh Sharma', managerRole: 'Assembly Line Lead' },
  { key: 'WAREHOUSE_STOCK', label: 'Warehouse & Raw Materials Inventory', managerName: 'Kavita Patel', managerRole: 'Warehouse Head' },
  { key: 'QUALITY_ASSURANCE', label: 'Quality Assurance & Testing Bench', managerName: 'Arun Verma', managerRole: 'Quality Check Head' },
  { key: 'SUPPLY_CHAIN', label: 'Supply Chain & Sourcing', managerName: 'Pooja Deshmukh', managerRole: 'SCM Director' },
  { key: 'COMMERCIAL_FINANCE', label: 'Finance & Accounts', managerName: 'Amitabh Sen', managerRole: 'Commercial Finance Lead' },
  { key: 'INDUSTRIAL_ENGINEERING', label: 'Design & Tooling Engineering', managerName: 'Siddharth Roy', managerRole: 'Hardware Engineering Lead' },
  { key: 'FLEET_LOGISTICS', label: 'Fleet & Logistics', managerName: 'Girish Rao', managerRole: 'Fleet Transport Lead' },
  { key: 'FIELD_SERVICE', label: 'Field & Client Care', managerName: 'Dr. Sunita Kulkarni', managerRole: 'Field Service Lead' },
  { key: 'HUMAN_RESOURCES', label: 'Human Resources', managerName: 'Deepak Chawla', managerRole: 'HR Lead' },
  { key: 'ASSET_RELIABILITY', label: 'Machine Repair & Upkeep', managerName: 'Praveen Hegde', managerRole: 'Reliability Lead' },
];

const INITIAL_LEAVES: LeaveItem[] = [
  {
    id: 'leave-101',
    leaveCode: 'LV-2026-0041',
    employeeId: 'plant_operator',
    employeeName: 'Sunil Joshi',
    employeeRole: 'Cleanroom Display Bonding Operator',
    department: 'SMT_PRODUCTION',
    departmentLabel: 'SMT & PCB Production',
    recipientType: 'DEPARTMENT_MANAGER',
    targetApproverId: 'production',
    targetApproverName: 'Rajesh Sharma',
    leaveType: 'MEDICAL',
    startDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    durationDays: 2,
    reason: 'Scheduled ophthalmology eye strain examination following 120-hour cleanroom optical alignment shift cycle.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'leave-102',
    leaveCode: 'LV-2026-0042',
    employeeId: 'maintenance_tech',
    employeeName: 'Kiran Rao',
    employeeRole: 'SMT Nozzle Maintenance Tech',
    department: 'ASSET_RELIABILITY',
    departmentLabel: 'SMT Feeder & HVAC Reliability',
    recipientType: 'DEPARTMENT_MANAGER',
    targetApproverId: 'asset_reliability',
    targetApproverName: 'Praveen Hegde',
    leaveType: 'CASUAL',
    startDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    durationDays: 2,
    reason: 'Personal family commitment in hometown. Replacement tech roster coordinated with Shift Lead.',
    status: 'APPROVED',
    approverComments: 'Roster coverage verified with Dinesh Pandey. Approved.',
    reviewedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    reviewedBy: 'Praveen Hegde',
    reviewedRole: 'Reliability Lead',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'leave-103',
    leaveCode: 'LV-2026-0043',
    employeeId: 'production',
    employeeName: 'Rajesh Sharma',
    employeeRole: 'SMT Floor Lead',
    department: 'SMT_PRODUCTION',
    departmentLabel: 'SMT & PCB Production',
    recipientType: 'HR',
    targetApproverId: 'hr',
    targetApproverName: 'Deepak Chawla',
    leaveType: 'EARNED',
    startDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    durationDays: 4,
    reason: 'Annual earned leave after successful pilot ramp of Apex Pro Line 1. Assistant Manager Vikram Joshi designated as acting SMT lead.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'leave-104',
    leaveCode: 'LV-2026-0044',
    employeeId: 'ast-wh-01',
    employeeName: 'Suresh Nair',
    employeeRole: 'Assistant Bins & Putaway Officer',
    department: 'WAREHOUSE_IMEI',
    departmentLabel: 'Warehouse & IMEI Stock',
    recipientType: 'DEPARTMENT_MANAGER',
    targetApproverId: 'warehouse',
    targetApproverName: 'Kavita Patel',
    leaveType: 'SICK',
    startDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    durationDays: 2,
    reason: 'Acute viral fever. Doctor prescription attached to HR portal.',
    status: 'APPROVED',
    approverComments: 'Get well soon. Putaway handover temporarily delegated to Bin Supervisor.',
    reviewedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    reviewedBy: 'Kavita Patel',
    reviewedRole: 'Warehouse Master Lead',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'leave-105',
    leaveCode: 'LV-2026-0045',
    employeeId: 'design',
    employeeName: 'Siddharth Roy',
    employeeRole: 'Hardware Engineering Lead',
    department: 'MOBILE_ENGINEERING',
    departmentLabel: 'Design & Engineering',
    recipientType: 'HR',
    targetApproverId: 'hr',
    targetApproverName: 'Deepak Chawla',
    leaveType: 'CASUAL',
    startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 6).toISOString(),
    durationDays: 2,
    reason: 'Attending IEEE International Semiconductor Device Research Symposium (Online Presentation).',
    status: 'APPROVED',
    approverComments: 'Approved under executive professional development policy.',
    reviewedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    reviewedBy: 'Deepak Chawla',
    reviewedRole: 'HR Lead',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'leave-106',
    leaveCode: 'LV-2026-0046',
    employeeId: 'warehouse',
    employeeName: 'Kavita Patel',
    employeeRole: 'Warehouse Master Lead',
    department: 'WAREHOUSE_IMEI',
    departmentLabel: 'Warehouse & IMEI Stock',
    recipientType: 'HR',
    targetApproverId: 'hr',
    targetApproverName: 'Deepak Chawla',
    leaveType: 'MEDICAL',
    startDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    durationDays: 2,
    reason: 'Scheduled diagnostic scan and post-op consultation.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'leave-107',
    leaveCode: 'LV-2026-0047',
    employeeId: 'ast-qa-01',
    employeeName: 'Divya Sundaram',
    employeeRole: 'Assistant Optical & Testing Lead',
    department: 'QUALITY_RF',
    departmentLabel: 'Quality Assurance & 5G RF',
    recipientType: 'DEPARTMENT_MANAGER',
    targetApproverId: 'quality',
    targetApproverName: 'Arun Verma',
    leaveType: 'CASUAL',
    startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    durationDays: 1,
    reason: 'Urgent municipal document registry appointment.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export default function LeaveManagementPage() {
  const { session } = useAuth();

  // Perspective Mode: Employee Self-Service, Department Manager Inbox, or HR Central Console
  const [activePerspective, setActivePerspective] = useState<'employee' | 'manager' | 'hr'>('employee');
  const [leaves, setLeaves] = useState<LeaveItem[]>(INITIAL_LEAVES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // New Leave Application Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantRoleType, setApplicantRoleType] = useState<'worker' | 'manager'>('worker');
  const [appEmployeeName, setAppEmployeeName] = useState('Sunil Joshi');
  const [appEmployeeRole, setAppEmployeeRole] = useState('Cleanroom Display Bonding Operator');
  const [appDeptKey, setAppDeptKey] = useState('SMT_PRODUCTION');
  const [appLeaveType, setAppLeaveType] = useState<LeaveTypeEnum>('CASUAL');
  const [appStartDate, setAppStartDate] = useState('');
  const [appEndDate, setAppEndDate] = useState('');
  const [appReason, setAppReason] = useState('');

  // Review & Approval Modal
  const [selectedReviewLeave, setSelectedReviewLeave] = useState<LeaveItem | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Sync role perspective with logged in session
  useEffect(() => {
    if (session?.roleId) {
      if (session.roleId === 'hr') {
        setActivePerspective('hr');
      } else if (
        session.roleId.includes('lead') ||
        session.roleId.includes('mgr') ||
        session.roleId.includes('manager') ||
        session.roleId === 'super_admin'
      ) {
        setActivePerspective('manager');
      } else {
        setActivePerspective('employee');
      }
    }
  }, [session]);

  // Fetch from backend API if running
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch('/api/leave');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setLeaves(json.data);
          }
        }
      } catch {
        // Fallback to initial seed
      }
    };
    fetchLeaves();
  }, []);

  // Compute recipient & target approver based on applicant role
  const resolvedTarget = useMemo(() => {
    const deptObj = DEPARTMENTS.find((d) => d.key === appDeptKey) || DEPARTMENTS[0];
    if (applicantRoleType === 'worker') {
      return {
        recipientType: 'DEPARTMENT_MANAGER' as LeaveRecipientTypeEnum,
        approverName: deptObj.managerName,
        approverRole: deptObj.managerRole,
        label: deptObj.label,
        routingExplanation: `Routes directly to Department Floor Manager (${deptObj.managerName}) for shift relief approval.`,
      };
    }
    return {
      recipientType: 'HR' as LeaveRecipientTypeEnum,
      approverName: 'Deepak Chawla',
      approverRole: 'HR Lead',
      label: deptObj.label,
      routingExplanation: 'Routes directly to HR Department (Deepak Chawla) for administrative sign-off.',
    };
  }, [applicantRoleType, appDeptKey]);

  // Duration in days calculation
  const calculatedDays = useMemo(() => {
    if (!appStartDate || !appEndDate) return 1;
    const start = new Date(appStartDate).getTime();
    const end = new Date(appEndDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  }, [appStartDate, appEndDate]);

  // Filtered leaves based on active perspective
  const filteredLeaves = useMemo(() => {
    return leaves.filter((item) => {
      // Perspective specific filter
      if (activePerspective === 'manager') {
        // Manager inbox: Worker requests directed to Department Managers
        if (item.recipientType !== 'DEPARTMENT_MANAGER') return false;
      } else if (activePerspective === 'hr') {
        // HR Console: Manager / Specialist requests directed to HR
        if (item.recipientType !== 'HR') return false;
      }

      // Department filter
      if (selectedDeptFilter !== 'ALL' && item.department !== selectedDeptFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.employeeName.toLowerCase().includes(q);
        const matchesCode = item.leaveCode.toLowerCase().includes(q);
        const matchesReason = item.reason.toLowerCase().includes(q);
        const matchesDept = item.departmentLabel.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesReason && !matchesDept) return false;
      }

      return true;
    });
  }, [leaves, activePerspective, selectedDeptFilter, statusFilter, searchQuery]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = leaves.length;
    const pendingManager = leaves.filter((r) => r.recipientType === 'DEPARTMENT_MANAGER' && r.status === 'PENDING').length;
    const pendingHr = leaves.filter((r) => r.recipientType === 'HR' && r.status === 'PENDING').length;
    const approved = leaves.filter((r) => r.status === 'APPROVED').length;
    const rejected = leaves.filter((r) => r.status === 'REJECTED').length;
    return { total, pendingManager, pendingHr, approved, rejected };
  }, [leaves]);

  // Handler: Submit Leave Application
  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appReason.trim()) return;

    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const leaveCode = `LV-2026-${randomSeq}`;
    const start = appStartDate || new Date().toISOString();
    const end = appEndDate || new Date(Date.now() + 86400000).toISOString();

    const newLeave: LeaveItem = {
      id: `leave-${Date.now()}`,
      leaveCode,
      employeeId: applicantRoleType === 'worker' ? 'plant_operator' : 'production',
      employeeName: appEmployeeName,
      employeeRole: appEmployeeRole,
      department: appDeptKey,
      departmentLabel: resolvedTarget.label,
      recipientType: resolvedTarget.recipientType,
      targetApproverId: applicantRoleType === 'worker' ? 'production' : 'hr',
      targetApproverName: resolvedTarget.approverName,
      leaveType: appLeaveType,
      startDate: new Date(start).toISOString(),
      endDate: new Date(end).toISOString(),
      durationDays: calculatedDays,
      reason: appReason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLeaves((prev) => [newLeave, ...prev]);
    setIsApplyModalOpen(false);
    setAppReason('');
    setAppStartDate('');
    setAppEndDate('');

    // Backend call
    try {
      await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: newLeave.employeeId,
          employeeName: newLeave.employeeName,
          employeeRole: newLeave.employeeRole,
          department: newLeave.department,
          departmentLabel: newLeave.departmentLabel,
          leaveType: newLeave.leaveType,
          startDate: newLeave.startDate,
          endDate: newLeave.endDate,
          durationDays: newLeave.durationDays,
          reason: newLeave.reason,
          recipientType: newLeave.recipientType,
          targetApproverName: newLeave.targetApproverName,
        }),
      });
    } catch {
      // Local state is already updated
    }
  };

  // Handler: Open Review Modal
  const openReviewModal = (item: LeaveItem) => {
    setSelectedReviewLeave(item);
    setReviewComments('');
    setIsReviewModalOpen(true);
  };

  // Handler: Approve or Reject
  const handleReviewDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!selectedReviewLeave) return;

    const reviewerName = activePerspective === 'hr' ? 'Deepak Chawla' : selectedReviewLeave.targetApproverName;
    const reviewerRole = activePerspective === 'hr' ? 'HR Lead' : 'Department Manager';

    const updatedList = leaves.map((r) => {
      if (r.id === selectedReviewLeave.id) {
        return {
          ...r,
          status: decision as LeaveStatusEnum,
          approverComments: reviewComments || (decision === 'APPROVED' ? 'Approved.' : 'Request declined.'),
          reviewedBy: reviewerName,
          reviewedRole: reviewerRole,
          reviewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    setLeaves(updatedList);
    setIsReviewModalOpen(false);

    try {
      await fetch(`/api/leave/${selectedReviewLeave.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decision,
          approverComments: reviewComments,
          reviewedBy: reviewerName,
          reviewedRole: reviewerRole,
        }),
      });
    } catch {
      // Local state preserved
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Hierarchical Perspective Switcher */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Employee Leave Requests & Approvals
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Simple 2-Step Approval Path
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Floor workers and operators send requests to their Department Manager; Managers and office staff send requests to HR.
              </p>
            </div>
          </div>

          {/* Perspective View Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 self-start lg:self-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 hidden sm:inline">
              Switch View:
            </span>
            <button
              type="button"
              onClick={() => setActivePerspective('employee')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                activePerspective === 'employee'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Employee Leave Desk</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePerspective('manager')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                activePerspective === 'manager'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Dept Manager Inbox ({stats.pendingManager})</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePerspective('hr')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                activePerspective === 'hr'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>HR Approval Console ({stats.pendingHr})</span>
            </button>
          </div>
        </div>

        {/* Action Bar & Apply CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {activePerspective === 'employee' && 'Viewing: Employee Self-Service Desk (Apply for Leave & Track Status)'}
              {activePerspective === 'manager' && 'Viewing: Department Manager Inbox (Review Team Leaves & Staff Coverage)'}
              {activePerspective === 'hr' && 'Viewing: HR Central Console (Manager Leaves & Plant Attendance Records)'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shadow-blue-500/20 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {/* 2. Leave Balance Counters & Telemetry Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Casual Leave */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Casual Leave (CL)</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            8 <span className="text-xs font-normal text-slate-400">/ 12 remaining</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Short-notice personal days</div>
        </div>

        {/* Sick / Medical Leave */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Medical / Sick (SL)</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            7 <span className="text-xs font-normal text-slate-400">/ 10 remaining</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Health & recovery allocation</div>
        </div>

        {/* Earned / Privilege Leave */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Earned Leave (EL)</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            14 <span className="text-xs font-normal text-slate-400">/ 18 remaining</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Accrued annual vacation</div>
        </div>

        {/* Pending Approval Inbox */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Actions</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {stats.pendingManager + stats.pendingHr}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
            {stats.pendingManager} Mgr / {stats.pendingHr} HR
          </div>
        </div>

        {/* Plant Staffing Availability */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm col-span-2 md:col-span-1">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Plant Attendance</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            96.4%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            SMT line coverage optimal
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by employee, leave code, reason, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* 4. Leave Records Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {activePerspective === 'employee' && `All Leave Records & Approvals (${filteredLeaves.length})`}
              {activePerspective === 'manager' && `Department Manager Pending Queue (${filteredLeaves.length})`}
              {activePerspective === 'hr' && `HR Executive Leave Applications (${filteredLeaves.length})`}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Request automatically sent to right approver
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold select-none">
                <th className="py-3 px-4">Leave ID</th>
                <th className="py-3 px-4">Employee & Role</th>
                <th className="py-3 px-4">Department & Approver</th>
                <th className="py-3 px-4">Type & Duration</th>
                <th className="py-3 px-4">Dates Requested</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No leave requests found for this filter.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => {
                  return (
                    <tr
                      key={leave.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {leave.leaveCode}
                      </td>

                      {/* Employee & Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {leave.employeeName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {leave.employeeRole}
                        </div>
                      </td>

                      {/* Department & Recipient Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {leave.departmentLabel}
                        </div>
                        <div className="text-[11px] mt-0.5 flex items-center gap-1">
                          <span
                            className={cn(
                              'px-1.5 py-0.2 rounded text-[10px] font-semibold border',
                              leave.recipientType === 'DEPARTMENT_MANAGER'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800'
                                : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-800',
                            )}
                          >
                            {leave.recipientType === 'DEPARTMENT_MANAGER' ? 'Dept Mgr' : 'HR Dept'}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                            ➔ {leave.targetApproverName}
                          </span>
                        </div>
                      </td>

                      {/* Type & Days */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {leave.leaveType}
                        </span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                          {leave.durationDays} {leave.durationDays === 1 ? 'day' : 'days'}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-600 dark:text-slate-400">
                        <div>From: {new Date(leave.startDate).toLocaleDateString()}</div>
                        <div>To: {new Date(leave.endDate).toLocaleDateString()}</div>
                      </td>

                      {/* Reason & Comments */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-slate-800 dark:text-slate-200 line-clamp-2">
                          {leave.reason}
                        </div>
                        {leave.approverComments && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 italic mt-1 bg-emerald-50/60 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50">
                            Remarks: {leave.approverComments} ({leave.reviewedBy})
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-semibold border inline-flex items-center gap-1',
                            leave.status === 'APPROVED' &&
                              'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800',
                            leave.status === 'PENDING' &&
                              'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800',
                            leave.status === 'REJECTED' &&
                              'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800',
                          )}
                        >
                          {leave.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                          {leave.status === 'PENDING' && <Clock className="w-3 h-3" />}
                          {leave.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                          {leave.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {leave.status === 'PENDING' ? (
                          <button
                            type="button"
                            onClick={() => openReviewModal(leave)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                          >
                            Review & Decide
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Decided
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Apply for Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Apply for Leave
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose if you are a factory worker or manager so your request goes to the right person.
                </p>
              </div>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              {/* Applicant Tier Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Who is Applying?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setApplicantRoleType('worker');
                      setAppEmployeeName('Sunil Joshi');
                      setAppEmployeeRole('Cleanroom Display Bonding Operator');
                    }}
                    className={cn(
                      'p-2.5 rounded-xl border text-left transition-all',
                      applicantRoleType === 'worker'
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 font-semibold text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400',
                    )}
                  >
                    <div className="text-xs">Factory Worker / Operator</div>
                    <div className="text-[10px] text-slate-400 font-normal">Goes to your Department Manager</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setApplicantRoleType('manager');
                      setAppEmployeeName('Rajesh Sharma');
                      setAppEmployeeRole('SMT Floor Lead / Manager');
                    }}
                    className={cn(
                      'p-2.5 rounded-xl border text-left transition-all',
                      applicantRoleType === 'manager'
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 font-semibold text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400',
                    )}
                  >
                    <div className="text-xs">Department Manager</div>
                    <div className="text-[10px] text-slate-400 font-normal">Goes to the HR Department</div>
                  </button>
                </div>
              </div>

              {/* Department Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={appDeptKey}
                  onChange={(e) => setAppDeptKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Automatic Routing Target Banner */}
              <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-[11px] flex items-start gap-2 text-blue-700 dark:text-blue-300">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Request will be sent to: {resolvedTarget.approverName} ({resolvedTarget.approverRole})</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">{resolvedTarget.routingExplanation}</span>
                </div>
              </div>

              {/* Leave Type & Dates */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Leave Type
                  </label>
                  <select
                    value={appLeaveType}
                    onChange={(e) => setAppLeaveType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="CASUAL">Casual (CL)</option>
                    <option value="MEDICAL">Medical (ML)</option>
                    <option value="SICK">Sick (SL)</option>
                    <option value="EARNED">Earned (EL)</option>
                    <option value="MATERNITY_PATERNITY">Maternity/Paternity</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={appStartDate}
                    onChange={(e) => setAppStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date ({calculatedDays}d)
                  </label>
                  <input
                    type="date"
                    value={appEndDate}
                    onChange={(e) => setAppEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Leave & Handover Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Write why you need leave and who will cover your shift..."
                  value={appReason}
                  onChange={(e) => setAppReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
                >
                  Send Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Review & Approval Decision Modal */}
      {isReviewModalOpen && selectedReviewLeave && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedReviewLeave.recipientType === 'DEPARTMENT_MANAGER'
                    ? 'Department Manager Review'
                    : 'HR Department Review'}
                </h3>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                  {selectedReviewLeave.leaveCode}
                </span>
              </div>
            </div>

            {/* Leave Details Box */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs space-y-2 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedReviewLeave.employeeName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {selectedReviewLeave.employeeRole} ({selectedReviewLeave.departmentLabel})
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {selectedReviewLeave.leaveType} ({selectedReviewLeave.durationDays}d)
                </span>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Period: </span>
                {new Date(selectedReviewLeave.startDate).toLocaleDateString()} to {new Date(selectedReviewLeave.endDate).toLocaleDateString()}
              </div>

              <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/80">
                <span className="text-slate-400 block text-[10px]">Reason:</span>
                {selectedReviewLeave.reason}
              </div>
            </div>

            {/* Approver Comments */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Manager Comments / Feedback
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Approved. Shift cover arranged on Assembly Line 1."
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleReviewDecision('REJECTED')}
                  className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors"
                >
                  Decline Leave
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewDecision('APPROVED')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Leave</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

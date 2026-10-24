'use client';

import React, { useState, useEffect } from 'react';
import { generateAndDownloadWordDoc } from '@/lib/wordDocumentGenerator';
import { workflowStore, WorkflowItem } from '@/lib/workflowStore';
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
  const [routingNotification, setRoutingNotification] = useState<string | null>(null);

  // Sync with cross-role workflow store
  useEffect(() => {
    const syncWorkflow = () => {
      const items = workflowStore.getAll();
      const hrLeaves = items.filter((it) => it.category === 'HR_LEAVE' && it.requester.name === 'Alex Jordan');
      if (hrLeaves.length > 0) {
        const mappedLeaves: LeaveRecord[] = hrLeaves.map((it) => ({
          id: it.id,
          type: (it.details.metadata?.leaveType as any) || 'ANNUAL_PTO',
          startDate: it.details.metadata?.startDate || '2026-11-01',
          endDate: it.details.metadata?.endDate || '2026-11-03',
          days: it.details.metadata?.days || 2,
          reason: it.details.justification,
          status: it.status === 'APPROVED' ? 'APPROVED' : it.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
        }));
        
        // Merge with existing seeded ones without duplicates
        setLeaves((prev) => {
          const ids = new Set(mappedLeaves.map((m) => m.id));
          const rest = prev.filter((p) => !ids.has(p.id));
          return [...mappedLeaves, ...rest];
        });
      }
    };

    syncWorkflow();
    window.addEventListener('apex_workflow_updated', syncWorkflow);
    window.addEventListener('storage', syncWorkflow);
    return () => {
      window.removeEventListener('apex_workflow_updated', syncWorkflow);
      window.removeEventListener('storage', syncWorkflow);
    };
  }, []);

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

    const reqId = `LV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: LeaveRecord = {
      id: reqId,
      type: leaveType,
      startDate: leaveStart,
      endDate: leaveEnd,
      days: 2,
      reason: leaveReason,
      status: 'PENDING',
    };

    // Dispatch directly to Cross-Role Workflow Store
    workflowStore.createRequest({
      id: reqId,
      category: 'HR_LEAVE',
      title: `${leaveType.replace('_', ' ')}: Alex Jordan (${leaveStart} to ${leaveEnd})`,
      department: 'Cleanroom Assembly Shift A',
      targetRole: 'production_supervisor',
      requester: {
        name: 'Alex Jordan',
        role: 'Precision Assembly Technician',
        roleId: 'operator',
        avatar: 'AJ',
        email: 'alex.jordan@apex-mfg.internal',
      },
      valueOrImpact: '16 Standard Hours (Shift Cover Requested)',
      deadlineHoursRemaining: 24,
      priority: 'NORMAL',
      details: {
        justification: leaveReason,
        affectedSystem: 'Cleanroom Bay 3 (SMT Lines)',
        metadata: {
          leaveType,
          startDate: leaveStart,
          endDate: leaveEnd,
          days: 2,
        },
      },
    });

    setLeaves([newReq, ...leaves]);
    setIsLeaveModalOpen(false);
    setLeaveReason('');
    setRoutingNotification(`Leave request ${reqId} successfully routed to Supervisor Sarah Jenkins and Management Approvals Inbox.`);
    setTimeout(() => setRoutingNotification(null), 5000);
  };

  const handleApplyOvertime = () => {
    const otReqId = `OT-2026-${Math.floor(100 + Math.random() * 900)}`;
    workflowStore.createRequest({
      id: otReqId,
      category: 'HR_OVERTIME',
      title: `Overtime Authorization: Alex Jordan (${otHours} Hours)`,
      department: 'Cleanroom Assembly Shift A',
      targetRole: 'production_supervisor',
      requester: {
        name: 'Alex Jordan',
        role: 'Precision Assembly Technician',
        roleId: 'operator',
        avatar: 'AJ',
      },
      valueOrImpact: `$${(parseFloat(otHours || '0') * 39).toFixed(2)} USD (1.5x Multiplier)`,
      deadlineHoursRemaining: 12,
      priority: 'HIGH',
      details: {
        justification: otReason,
        affectedSystem: 'Cleanroom SMT Bay 3',
        glAccount: 'GL-52100 (Direct Labor Overtime Expense)',
        metadata: {
          hours: otHours,
        },
      },
    });

    setIsOtModalOpen(false);
    setRoutingNotification(`Overtime request ${otReqId} (${otHours} hrs) dispatched to Supervisor for sign-off.`);
    setTimeout(() => setRoutingNotification(null), 5000);
  };

  const handleDownloadPayslipDoc = () => {
    generateAndDownloadWordDoc('Apex_Employee_Compensation_Statement_Alex_Jordan_Sept2026', {
      title: 'OFFICIAL EMPLOYEE MONTHLY EARNINGS & STATUTORY TAX WITHHOLDING STATEMENT',
      documentRef: 'STMT-PAY-2026-09-88204',
      classification: 'PRIVATE & CONFIDENTIAL — STRICTLY FOR EMPLOYEE & PAYROLL AUDIT',
      department: 'Corporate Payroll & Human Resources Directorate',
      author: 'Corporate Payroll Services & Treasury',
      summary:
        'Official certified compensation statement, earnings breakdown, overtime multiplier reconciliation, statutory federal and state tax withholdings, retirement plan contributions, and ACH direct deposit disbursement record for Alex Jordan (Badge ID: EMP-88204) for the monthly pay period ending September 30, 2026.',
      sections: [
        {
          heading: 'Employee Position & Manufacturing Profile',
          table: {
            headers: ['Employee Attribute', 'Verified Record Details', 'Department & Cleanroom Cell', 'Security Clearance'],
            rows: [
              ['Employee Legal Name', 'Alex Jordan', 'Precision Assembly Operations', 'Level 1 Operational'],
              ['Employee Identification', 'EMP-88204 (Active Full-Time)', 'Cleanroom Bay 3 (SMT Lines)', 'IPC-A-610 Specialist'],
              ['Designated Work Shift', 'Shift A (06:00 - 14:30 EST)', 'Direct Supervisor: Sarah Jenkins', 'Austin Flagship Campus'],
              ['Pay Period / Cycle', 'September 1, 2026 to September 30, 2026', 'Disbursement Date: Sept 30, 2026', 'ACH Ref: #ACH-994120'],
            ],
          },
        },
        {
          heading: 'Itemized Earnings & Cleanroom Incentive Premiums',
          content: [
            'Earnings represent base contracted compensation along with authorized overtime hours calculated at time-and-a-half (1.5x regular base rate of $39.00/hour) verified via turnstile badge swipes and MES production logging.',
          ],
          table: {
            headers: ['Earnings Component', 'Basis / Rate of Pay', 'Hours / Units Logged', 'Gross Disbursed Amount (USD)'],
            rows: [
              ['Regular Basic Salary', 'Salaried Contracted Base', '160 Standard Hours', '$5,200.00'],
              ['Housing & Utility Allowance (HRA)', 'Fixed Monthly Corporate Benefit', 'Standard Tier', '$1,400.00'],
              ['Overtime Premium Compensation', '1.5x Premium Rate ($39.00/hr)', '16.5 Verified OT Hours', '$643.50'],
              ['Cleanroom Metrology Specialist Premium', 'IPC-A-610 Class 3 Certified', 'Monthly Skill Stipend', '$300.00'],
              ['Total Gross Compensation', 'Pre-Tax Aggregate Earnings', '176.5 Total Hours', '$7,543.50'],
            ],
          },
        },
        {
          heading: 'Statutory Taxes, Deductions & Voluntary Contributions',
          content: [
            'All deductions comply with Title 26 of the United States Internal Revenue Code (IRC) and applicable state labor standards.',
          ],
          table: {
            headers: ['Deduction Category', 'Statutory Authority', 'Calculation Basis / Rate', 'Deducted Amount (USD)'],
            rows: [
              ['Federal Income Tax (FITW)', 'Internal Revenue Service (IRS)', 'W-4 Standard Withholding', '-$1,130.00'],
              ['State Income Tax (SITW)', 'State of Texas Comptroller', 'Texas Zero State Tax Rate', '$0.00'],
              ['Social Security (OASDI)', 'Federal Insurance Contributions (FICA)', '6.20% of Eligible Gross', '-$467.70'],
              ['Medicare Hospitalization (HI)', 'Federal Insurance Contributions (FICA)', '1.45% of Eligible Gross', '-$109.38'],
              ['401(k) Pre-Tax Retirement Plan', 'Fidelity Corporate Trust (Apex Match 4%)', 'Voluntary Employee Deferral', '-$450.00'],
              ['Total Statutory & Plan Deductions', 'Cumulative Withholdings', 'Aggregate Reductions', '-$2,157.08'],
            ],
          },
        },
        {
          heading: 'Net Compensation Disbursement Proof & Bank Routing',
          callout: {
            title: 'Direct Deposit Electronic Funds Transfer (EFT) Confirmed',
            text: 'Net Take-Home Pay of $5,386.42 was successfully credited via NACHA ACH protocol to Chase National Bank Account (Ending in ****4092) on September 30, 2026 at 02:15:08 EST.',
            type: 'success',
          },
          table: {
            headers: ['Financial Institution', 'Routing Transit (ABA)', 'Account Type & Last 4', 'Net Remittance'],
            rows: [
              ['JPMorgan Chase Bank, N.A.', '111000614 (Austin Financial Center)', 'Checking Account (****4092)', '$5,386.42 USD'],
            ],
          },
        },
        {
          heading: 'Year-to-Date (YTD) Cumulative Tax & Earnings Summary',
          table: {
            headers: ['Metric Description', 'Q1-Q3 Cumulative Total', 'Projected Annual Total', 'Tax Filing Proof Status'],
            rows: [
              ['YTD Gross Compensation', '$67,891.50', '$90,522.00', 'Verified on W-2 Record Ledger'],
              ['YTD Federal Income Tax Withheld', '$10,170.00', '$13,560.00', 'Remitted to IRS Treasury'],
              ['YTD FICA & Medicare Contribution', '$5,193.72', '$6,924.96', 'Social Security Administration'],
              ['YTD 401(k) Retirement Contributions', '$4,050.00', '$5,400.00', 'Fidelity Institutional Trust'],
            ],
          },
        },
      ],
      signatories: [
        {
          name: 'Marcus Brody',
          role: 'Head of Corporate Payroll Operations',
          organization: 'Apex Manufacturing Technologies Corporation',
          signatureDate: 'September 30, 2026',
        },
        {
          name: 'Sarah Jenkins',
          role: 'VP Operations & Plant Floor Supervisor',
          organization: 'Apex Manufacturing Technologies Corporation',
          signatureDate: 'September 30, 2026',
        },
      ],
    });
  };

  const handleDownloadCalibrationDoc = (asset: IssuedAsset) => {
    generateAndDownloadWordDoc(`Apex_Metrology_Calibration_Certificate_${asset.id}`, {
      title: 'CERTIFICATE OF CALIBRATION & METROLOGY TOLERANCE SPECIFICATION',
      documentRef: `CERT-MET-2026-${asset.id}`,
      classification: 'QUALITY CRITICAL RECORD // NIST TRACEABLE CALIBRATION',
      department: 'Central Metrology Laboratory & Quality Standards',
      author: 'Marcus Vance, Lead Calibration Specialist (ASQ CCT)',
      summary: `Official certified calibration protocol, dimensional tolerance verification, and precision CAD schematic for ${asset.name} (Serial: ${asset.serialNumber}) assigned to cleanroom operator Alex Jordan. Validated pursuant to ISO/IEC 17025:2017, ANSI/NCSL Z540-1, and ASME B89.1.13.`,
      sections: [
        {
          heading: '1. Asset Custody & Calibration Standards Traceability',
          table: {
            headers: ['Tool Attribute', 'Certified Parameter', 'Environmental Condition', 'Metrology Baseline'],
            rows: [
              ['Tool Description', asset.name, 'Ambient Temperature', '20.0°C ± 0.4°C (ISO Standard)'],
              ['Serial Number', asset.serialNumber, 'Relative Humidity', '42.5% RH (Non-Condensing)'],
              ['Assigned Custodian', 'Alex Jordan (EMP-88204)', 'Calibration Standard', 'NIST Test No. 681/280419-21'],
              ['Traceability Reference', 'Master Gauge Block Set Grade 0 (SN: MGB-8841)', 'Next Calibration Due', asset.calibrationDue || '2027-04-15'],
            ],
          },
        },
        {
          heading: '2. Precision CAD Blueprint Schematic & Orthographic Geometry',
          subheading: 'ASME Y14.5M Geometric Tolerancing and Spindle Concentricity Bounding Box',
          cadBlueprint: {
            drawingNumber: `DWG-CAL-${asset.id}`,
            revision: 'E',
            partName: asset.name,
            material: 'Tungsten Carbide Faces & Chrome Plated Frame',
            surfaceFinish: 'Optical Polish Ra ≤ 0.05 µm',
            units: 'MILLIMETERS [mm]',
            scale: '1:1',
            gdtCallouts: [
              {
                symbol: '⌖',
                tolerance: '⌀ 0.001 Ⓜ',
                datumRefs: 'A | B',
                description: 'Spindle axial alignment and rotational true position',
              },
              {
                symbol: '⌓',
                tolerance: '0.0003 mm',
                datumRefs: 'A',
                description: 'Anvil and spindle measuring face optical flatness',
              },
              {
                symbol: '⟂',
                tolerance: '0.0008 mm',
                datumRefs: 'A',
                description: 'Perpendicularity of spindle face to centerline axis',
              },
            ],
            dimensions: [
              {
                featureId: 'DIM-01',
                featureDescription: 'Measuring Face Flatness (Optical Flat)',
                nominalMm: 0.0000,
                toleranceMm: '±0.0003 mm',
                uslMm: 0.0003,
                lslMm: 0.0000,
                measuredMm: 0.0001,
                deviationMm: '+0.0001',
                inspectionMethod: 'Monochromatic He-Ne Light Interference',
                status: 'CONFORMING',
              },
              {
                featureId: 'DIM-02',
                featureDescription: 'Parallelism Between Anvil and Spindle',
                nominalMm: 0.0000,
                toleranceMm: '±0.0010 mm',
                uslMm: 0.0010,
                lslMm: 0.0000,
                measuredMm: 0.0004,
                deviationMm: '+0.0004',
                inspectionMethod: 'Precision Parallel Optical Blocks',
                status: 'CONFORMING',
              },
              {
                featureId: 'DIM-03',
                featureDescription: 'Micrometer Screw Lead Pitch Accuracy (5.00mm Step)',
                nominalMm: 5.0000,
                toleranceMm: '±0.0010 mm',
                uslMm: 5.0010,
                lslMm: 4.9990,
                measuredMm: 5.0002,
                deviationMm: '+0.0002',
                inspectionMethod: 'Mitutoyo Linear CMM Gage Probe',
                status: 'CONFORMING',
              },
              {
                featureId: 'DIM-04',
                featureDescription: 'Lead Screw Pitch Accuracy (15.00mm Step)',
                nominalMm: 15.0000,
                toleranceMm: '±0.0015 mm',
                uslMm: 15.0015,
                lslMm: 14.9985,
                measuredMm: 15.0005,
                deviationMm: '+0.0005',
                inspectionMethod: 'Mitutoyo Linear CMM Gage Probe',
                status: 'CONFORMING',
              },
              {
                featureId: 'DIM-05',
                featureDescription: 'Lead Screw Pitch Accuracy (25.00mm Full Range)',
                nominalMm: 25.0000,
                toleranceMm: '±0.0020 mm',
                uslMm: 25.0020,
                lslMm: 24.9980,
                measuredMm: 25.0008,
                deviationMm: '+0.0008',
                inspectionMethod: 'Mitutoyo Linear CMM Gage Probe',
                status: 'CRITICAL_PASS',
              },
            ],
          },
        },
        {
          heading: '3. Quality Conformance & Metrology Certification Verdict',
          callout: {
            title: 'NIST & ISO/IEC 17025 Calibrated Pass',
            text: `This instrument has been calibrated using reference standards whose accuracies are traceable to the National Institute of Standards and Technology (NIST). Measurement uncertainty: U = 0.0006 mm (k = 2, 95% confidence).`,
            type: 'success',
          },
        },
      ],
      signatories: [
        {
          name: 'Marcus Vance, ASQ CCT',
          role: 'Lead Metrology Calibration Engineer',
          organization: 'Apex Industrial Standards & Metrology Directorate',
          signatureDate: '2026-10-22',
        },
        {
          name: 'David O\'Connor',
          role: 'Plant Quality Assurance Director',
          organization: 'Apex Manufacturing Technologies Inc.',
          signatureDate: '2026-10-22',
        },
      ],
    });
  };

  const handleDownloadLeaveDoc = (leave: LeaveRecord) => {
    generateAndDownloadWordDoc(`Apex_Authorized_Leave_Pass_${leave.id}`, {
      title: 'CERTIFIED EMPLOYEE LEAVE AUTHORIZATION & SHIFT ROSTER PASS',
      documentRef: `LEAVE-AUTH-${leave.id}`,
      classification: 'OFFICIAL HR RECORD // OPERATIONAL COVERAGE PASS',
      department: 'Cleanroom Assembly Operations & HR Workforce Management',
      author: 'Sarah Jenkins, Operations VP & Shift Director',
      summary: `Official management leave pass, shift cover dispatch, and payroll attendance adjustment for Alex Jordan (Badge EMP-88204) covering ${leave.days} business days from ${leave.startDate} to ${leave.endDate}.`,
      sections: [
        {
          heading: '1. Employee Leave Authorization Ledger',
          table: {
            headers: ['Parameter', 'Record Detail', 'Administrative Verification', 'Status'],
            rows: [
              ['Employee Name', 'Alex Jordan', 'Badge ID: EMP-88204', 'VERIFIED'],
              ['Leave Classification', leave.type.replace('_', ' '), 'Paid Time Off Account', 'DEDUCTED'],
              ['Effective Dates', `${leave.startDate} through ${leave.endDate}`, `${leave.days} Scheduled Work Days`, 'AUTHORIZED'],
              ['Operational Justification', leave.reason, 'Shift Relief: Aaron Miller assigned', 'CONFIRMED'],
            ],
          },
        },
        {
          heading: '2. Cleanroom Production Roster Impact & Handover Protocol',
          content: [
            'All cleanroom station handover procedures, ESD smock custody transfer, and station calibration logs have been officially executed prior to leave commencement.',
          ],
          callout: {
            title: 'Supervisor Approval Granted',
            text: 'Authorized by Shift Supervisor. Zero cleanroom line disruption verified on SMT Line 3.',
            type: 'success',
          },
        },
      ],
      signatories: [
        {
          name: 'Sarah Jenkins',
          role: 'Operations VP & Shift Supervisor',
          organization: 'Apex Manufacturing Technologies Inc.',
          signatureDate: '2026-10-22',
        },
        {
          name: 'Alex Jordan',
          role: 'Cleanroom Operator (EMP-88204)',
          organization: 'Apex Manufacturing Technologies Inc.',
          signatureDate: '2026-10-22',
        },
      ],
    });
  };

  return (
    <div className="space-y-6 p-6">
      {routingNotification && (
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{routingNotification}</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider bg-purple-500/20 px-2 py-0.5 rounded">
            Live Cross-Role Synced
          </span>
        </div>
      )}

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
                    <th className="p-3 text-right">Official Document</th>
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
                              : l.status === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDownloadLeaveDoc(l)}
                          title="Download Official Leave Authorization & Shift Roster Pass in Word Format"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted/60 hover:bg-muted text-foreground border border-border rounded text-[11px] font-medium cursor-pointer"
                        >
                          <Download className="w-3 h-3 text-primary" /> Leave Pass (.doc)
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
                onClick={handleDownloadPayslipDoc}
                className="inline-flex items-center gap-1.5 text-xs font-semibold border border-border px-3 py-1.5 rounded-lg hover:bg-accent text-foreground transition-colors"
                title="Download Official Compensation Statement in Word Format"
              >
                <Download className="w-3.5 h-3.5" />
                Download Statement (.doc)
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

                <div className="mt-4 pt-3 border-t border-border flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between">
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
                  <button
                    onClick={() => handleDownloadCalibrationDoc(a)}
                    className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Download Metrology CAD Calibration (.doc)
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
                  onClick={handleApplyOvertime}
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 cursor-pointer"
                >
                  Submit for Supervisor Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

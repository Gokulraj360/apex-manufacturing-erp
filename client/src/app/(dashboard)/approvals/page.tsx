'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Filter,
  Search,
  CheckCheck,
  Calendar,
  Building,
  History,
  Send,
  SlidersHorizontal,
  ChevronDown,
  Download,
  AlertCircle,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { generateAndDownloadWordDoc } from '@/lib/wordDocumentGenerator';

interface ApprovalItem {
  id: string;
  category: 'CAPEX' | 'PURCHASE_ORDER' | 'HR_LEAVE' | 'ECN_ECO' | 'QUALITY_SCRAP';
  title: string;
  department: string;
  requester: {
    name: string;
    role: string;
    avatar: string;
  };
  valueOrImpact: string;
  submittedAt: string;
  deadlineHoursRemaining: number;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  details: {
    justification: string;
    affectedSystem: string;
    lineItemsCount?: number;
    glAccount?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'APP-2026-0891',
    category: 'CAPEX',
    title: 'SMT Line #4 Automated Optical Inspection (AOI) Upgrade',
    department: 'Manufacturing Engineering',
    requester: {
      name: 'Dr. Evelyn Vance',
      role: 'Principal Process Engineer',
      avatar: 'EV',
    },
    valueOrImpact: '$185,000.00',
    submittedAt: '2026-10-22 08:30 AM',
    deadlineHoursRemaining: 6,
    priority: 'CRITICAL',
    details: {
      justification: 'Replacement of end-of-life 2D AOI system with 3D high-speed laser interferometer to reduce false call rates from 4.2% to <0.3%.',
      affectedSystem: 'SMT Cleanroom Bay 4',
      glAccount: 'GL-15200 (Machinery & Capital Equipment)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0892',
    category: 'PURCHASE_ORDER',
    title: 'Bulk Silicon Wafer Raw Substrates (Quarterly Blanket PO)',
    department: 'Procurement & Sourcing',
    requester: {
      name: 'Marcus Brody',
      role: 'Senior Sourcing Manager',
      avatar: 'MB',
    },
    valueOrImpact: '$412,500.00',
    submittedAt: '2026-10-22 07:15 AM',
    deadlineHoursRemaining: 14,
    priority: 'HIGH',
    details: {
      justification: 'Quarterly supply agreement with SilicTech Global for 300mm ultra-pure polished prime wafers. Tier 1 volume discount of 8.5% locked.',
      affectedSystem: 'Substrate Inventory Silo 1',
      lineItemsCount: 8,
      glAccount: 'GL-50100 (Direct Materials Inventory)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0893',
    category: 'ECN_ECO',
    title: 'ECN-7804: Thermal Heat-Sink Fin Geometry Refinement',
    department: 'Hardware R&D',
    requester: {
      name: 'Claire Chen',
      role: 'Lead Thermal Architect',
      avatar: 'CC',
    },
    valueOrImpact: 'BOM Cost Neutral / +8.2°C Thermal Margin',
    submittedAt: '2026-10-21 16:45 PM',
    deadlineHoursRemaining: 28,
    priority: 'HIGH',
    details: {
      justification: 'Modifies copper extruded fin density from 14 FPI to 18 FPI to prevent throttling at 45°C ambient. Fully tested in wind tunnel rig.',
      affectedSystem: 'Apex Industrial Gateway Gen 3',
      lineItemsCount: 3,
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0894',
    category: 'QUALITY_SCRAP',
    title: 'Disposal Scrap Authorization: Batch #PCB-9821 Soldering Bridging',
    department: 'Quality Assurance',
    requester: {
      name: 'David O\'Connor',
      role: 'Plant QA Lead',
      avatar: 'DO',
    },
    valueOrImpact: '$18,450.00 (620 Motherboard Units)',
    submittedAt: '2026-10-22 09:10 AM',
    deadlineHoursRemaining: 4,
    priority: 'CRITICAL',
    details: {
      justification: 'Irreparable micro-bridging beneath 1156-pin BGA processor package caused by nitrogen wave solder temperature excursion.',
      affectedSystem: 'Assembly Line B',
      glAccount: 'GL-64200 (Scrap & Spoilage Expense)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0895',
    category: 'HR_LEAVE',
    title: 'Extended Medical & Paternity Leave Request (4 Weeks)',
    department: 'Plant Operations',
    requester: {
      name: 'Rajesh Patel',
      role: 'Senior CNC Machinist',
      avatar: 'RP',
    },
    valueOrImpact: '160 Production Hours (Relief Staff Assigned)',
    submittedAt: '2026-10-20 11:00 AM',
    deadlineHoursRemaining: 42,
    priority: 'NORMAL',
    details: {
      justification: 'Statutory family leave. Cross-trained relief machinist (Aaron Miller) scheduled for CNC Cell 3 with zero line disruption.',
      affectedSystem: 'Machining Hall Shift A',
    },
    status: 'PENDING',
  },
];

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<'INBOX' | 'RULES' | 'DELEGATION' | 'AUDIT'>('INBOX');
  const [items, setItems] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Decision Modal State
  const [modalItem, setModalItem] = useState<ApprovalItem | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVE' | 'REJECT' | 'REQUEST_INFO' | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');

  // Delegation State
  const [isDelegationActive, setIsDelegationActive] = useState(false);
  const [delegatePerson, setDelegatePerson] = useState('Sarah Jenkins (VP of Operations)');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(items.filter((i) => i.status === 'PENDING').map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const executeDecision = () => {
    if (!modalItem || !decisionType) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === modalItem.id) {
          return {
            ...item,
            status: decisionType === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          };
        }
        return item;
      })
    );
    setModalItem(null);
    setDecisionType(null);
    setDecisionNotes('');
  };

  const executeBatchApprove = () => {
    setItems((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return { ...item, status: 'APPROVED' };
        }
        return item;
      })
    );
    setSelectedIds([]);
  };

  const handleExportAuditTrailDoc = () => {
    generateAndDownloadWordDoc('Apex_SOX_Executive_Approval_Audit_Ledger', {
      title: 'EXECUTIVE APPROVAL & DELEGATION AUDIT LEDGER',
      documentRef: 'AUD-SOX-2026-Q3-099',
      classification: 'CONFIDENTIAL // REGULATORY COMPLIANCE RECORD',
      department: 'Corporate Governance & Internal Audit',
      author: 'Alexander Vance, Plant Director & Controller',
      summary: 'Official immutable transaction ledger of cross-departmental financial delegations, CapEx authorizations, ECN engineering sign-offs, and proxy handover controls recorded pursuant to Sarbanes-Oxley (SOX) Section 404, ISO 9001:2015 Clause 5.3, and IATF 16949.',
      sections: [
        {
          heading: '1. Executive Authorization Summary & Cryptographic Validation',
          content: [
            'This document provides an unalterable audit trail of all executive approvals, line-item budget releases, engineering concessions, and temporary proxy delegations executed within the Apex ERP Governance Framework during the current operating period.',
            'All records contained herein have been verified against hardware cryptographic keys (FIPS 140-2 Level 3 HSM) and timestamped via RFC 3161 compliant trusted time authorities.'
          ],
          table: {
            headers: ['Audit Token', 'Document Ref / Item', 'Action / Decision', 'Authorized Signatory', 'Timestamp (UTC/EST)', 'Cryptographic Hash (SHA-256)'],
            rows: [
              ['#AUD-9912', 'PO-2026-9012 (CNC Tooling Inserts)', 'APPROVED', 'Alexander Vance (Plant Director)', '2026-10-21 17:22:04 EST', 'sha256:8f9a3c21e78a4b010cde456'],
              ['#AUD-9911', 'CAPEX-2026-0889 (Additive 3D Titanium Printer)', 'APPROVED', 'Sarah Chen (Chief Financial Officer)', '2026-10-21 16:05:11 EST', 'sha256:d41d8cd98f00b204e980099'],
              ['#AUD-9910', 'ECO-2026-0412 (Titanium Alloy Spec Refinement)', 'APPROVED', 'Dr. Marcus Reyes (Chief Engineer)', '2026-10-21 14:12:49 EST', 'sha256:e3b0c44298fc1c149afbf4c'],
              ['#AUD-9909', 'SCRAP-2026-0184 (Defective Casting Lot Discard)', 'APPROVED', 'Elena Rostova (VP Quality & Reliability)', '2026-10-21 11:30:20 EST', 'sha256:7b521fa9822a10bced4561a'],
              ['#AUD-9908', 'LEAVE-2026-0523 (Medical Leave - Senior Tech)', 'APPROVED', 'Sarah Jenkins (Ops Supervisor)', '2026-10-21 09:15:33 EST', 'sha256:9f83c2e64b882a12fedc301']
            ]
          }
        },
        {
          heading: '2. Multi-Level Financial Hierarchy & Delegation Matrix',
          content: [
            'Operational delegations enforce strict approval limits according to the Corporate Governance Delegations Policy (CGD-Rev-4). Any item exceeding $100,000 mandates dual sign-off including the CFO.'
          ],
          table: {
            headers: ['Approval Level', 'Role / Title', 'Single Transaction Cap', 'Mandatory Escrows', 'Current Signatory Status'],
            rows: [
              ['Level 1', 'Frontline Shopfloor Supervisor', '$5,000.00 USD', 'None', 'Active (Shift A & B)'],
              ['Level 2', 'Department Operations Manager', '$25,000.00 USD', 'Variance Audit', 'Active'],
              ['Level 3', 'Plant General Manager / Director', '$100,000.00 USD', 'Corporate Budget Match', 'Active (Alexander Vance)'],
              ['Level 4', 'Chief Financial Officer (CFO)', '$500,000.00 USD', 'Board Committee Audit', 'Active (Sarah Chen)'],
              ['Level 5', 'Chief Executive Officer / Board', 'Unlimited / >$500K USD', 'Board Minute Resolution', 'Active']
            ]
          }
        },
        {
          heading: '3. Temporary Proxy Delegations & Segregation of Duties (SoD) Review',
          content: [
            'During executive travel and off-site customer audits, administrative authority is delegated under strict financial caps and pre-assigned duration limits.',
            'No delegation policy violates Separation of Duties (SoD) principles; delegators cannot assign approval authority to the originators of purchase requisitions.'
          ],
          table: {
            headers: ['Original Principal', 'Appointed Proxy', 'Role / Department', 'Approval Limit Cap', 'Valid From', 'Valid To', 'Status'],
            rows: [
              ['Alexander Vance', 'Marcus Reyes', 'VP Engineering', '$100,000.00 USD', '2026-10-20', '2026-10-28', 'ACTIVE DELEGATION'],
              ['Sarah Chen', 'Rachel Green', 'Corporate Financial Controller', '$250,000.00 USD', '2026-10-15', '2026-10-18', 'EXPIRED / REVERTED']
            ]
          },
          callout: {
            title: 'Audit Compliance Certification Notice',
            text: 'Independent audit confirmed 0 unapproved financial bypasses. All items exceeding $50,000 required dual-authorization with hardware Multi-Factor Authentication.',
            type: 'success'
          }
        }
      ],
      signatories: [
        {
          name: 'Alexander Vance',
          role: 'Plant Director & General Manager',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'Sarah Chen, CPA',
          role: 'Chief Financial Officer',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'David K. Rosenthal',
          role: 'Head of Corporate Internal Audit & Compliance',
          organization: 'Deloitte Risk & Regulatory Advisory (Independent SOX Auditor)',
          signatureDate: '2026-10-22'
        }
      ]
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    const matchesPriority = filterPriority === 'ALL' || item.priority === filterPriority;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const pendingCount = items.filter((i) => i.status === 'PENDING').length;
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;
  const criticalCount = items.filter((i) => i.status === 'PENDING' && i.priority === 'CRITICAL').length;

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Universal Approvals & Governance Inbox
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              SLA Engine Live
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Single multi-department authorization terminal for CapEx, PO commitments, ECN engineering releases, scrap mandates, and HR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={executeBatchApprove}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Batch Authorize ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('DELEGATION')}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              isDelegationActive
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-border bg-card text-foreground hover:bg-accent'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            {isDelegationActive ? 'Delegation Active' : 'Configure Proxy'}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Awaiting Decision</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">{pendingCount}</span>
            <span className="text-xs text-muted-foreground ml-2">items in your queue</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
            Avg turn-around: 2.4 hours
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Critical SLA &lt;8h</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{criticalCount}</span>
            <span className="text-xs text-muted-foreground ml-2">at risk of breach</span>
          </div>
          <div className="mt-2 text-xs text-rose-500 flex items-center gap-1 font-medium">
            Auto-escalation to VP in 4h
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Authorized Today</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{approvedCount}</span>
            <span className="text-xs text-muted-foreground ml-2">commitments sealed</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            $615.9k cumulative value
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Governance Compliance</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">100.0%</span>
            <span className="text-xs text-muted-foreground ml-2">SoD checked</span>
          </div>
          <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 font-medium">
            0 toxic segregation conflicts
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('INBOX')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'INBOX'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" />
            Actionable Pending Queue ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('RULES')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'RULES'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Escalation Matrix & Thresholds
          </button>
          <button
            onClick={() => setActiveTab('DELEGATION')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'DELEGATION'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Proxy & Out-of-Office Rules
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'AUDIT'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4" />
            Historical Decision Log
          </button>
        </nav>
      </div>

      {/* TAB 1: ACTIONABLE INBOX */}
      {activeTab === 'INBOX' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-3 rounded-lg border border-border">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search request, ID, submitter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-md border border-input bg-background text-foreground w-64 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Categories</option>
                <option value="CAPEX">CapEx Requisitions</option>
                <option value="PURCHASE_ORDER">Purchase Orders</option>
                <option value="ECN_ECO">ECN / ECO Engineering</option>
                <option value="QUALITY_SCRAP">Quality Scrap Mandate</option>
                <option value="HR_LEAVE">HR & Staffing</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical &lt;8h SLA</option>
                <option value="HIGH">High Priority</option>
                <option value="NORMAL">Normal Priority</option>
              </select>
            </div>

            <div className="text-xs text-muted-foreground">
              Showing {filteredItems.length} of {items.length} total tasks
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3 w-10">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedIds.length > 0 && selectedIds.length === items.filter((i) => i.status === 'PENDING').length}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="p-3">Reference & Department</th>
                    <th className="p-3">Title & Detailed Scope</th>
                    <th className="p-3">Submitter</th>
                    <th className="p-3">Value / Exposure</th>
                    <th className="p-3">SLA Countdown</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredItems.map((item) => {
                    const isPending = item.status === 'PENDING';
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-accent/40 transition-colors ${
                          !isPending ? 'opacity-50 bg-muted/20' : isSelected ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="p-3">
                          {isPending && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(item.id)}
                              className="rounded border-input text-primary focus:ring-primary"
                            />
                          )}
                        </td>
                        <td className="p-3">
                          <div className="font-mono font-bold text-foreground">{item.id}</div>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-1 ${
                              item.category === 'CAPEX'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                : item.category === 'PURCHASE_ORDER'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : item.category === 'ECN_ECO'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : item.category === 'QUALITY_SCRAP'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {item.category.replace('_', ' ')}
                          </span>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{item.department}</div>
                        </td>
                        <td className="p-3 max-w-sm">
                          <div className="font-semibold text-foreground text-sm leading-snug">{item.title}</div>
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{item.details.justification}</p>
                          {item.details.glAccount && (
                            <div className="text-[10px] text-muted-foreground font-mono mt-1">
                              Allocation: {item.details.glAccount}
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                              {item.requester.avatar}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{item.requester.name}</div>
                              <div className="text-[10px] text-muted-foreground">{item.requester.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-foreground text-sm">{item.valueOrImpact}</div>
                          <div className="text-[10px] text-muted-foreground">Submitted {item.submittedAt.split(' ')[0]}</div>
                        </td>
                        <td className="p-3">
                          {isPending ? (
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  item.deadlineHoursRemaining <= 6
                                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 animate-pulse'
                                    : item.deadlineHoursRemaining <= 16
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                {item.deadlineHoursRemaining}h left
                              </span>
                            </div>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                item.status === 'APPROVED'
                                  ? 'bg-emerald-500/10 text-emerald-600'
                                  : 'bg-rose-500/10 text-rose-600'
                              }`}
                            >
                              {item.status}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isPending ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setModalItem(item);
                                  setDecisionType('APPROVE');
                                }}
                                className="p-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
                                title="Approve Request"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setModalItem(item);
                                  setDecisionType('REJECT');
                                }}
                                className="p-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-sm"
                                title="Reject Request"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs italic">Closed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ESCALATION MATRIX */}
      {activeTab === 'RULES' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground mb-1">Corporate Authorization Limits & Multi-Tier Matrix</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Enforces statutory Sarbanes-Oxley (SOX 404) financial limits and engineering sign-off hierarchies across corporate plants.
            </p>

            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-sm text-foreground">Tier 1: Plant Departmental Requisitions (&lt; $25,000)</div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-xs font-bold">1 Sign-off</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Requires Plant Supervisor or Department Manager approval within 24 hours. Auto-approval enabled for cataloged consumables with valid PO matching.
                </p>
              </div>

              <div className="border border-border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-sm text-foreground">Tier 2: Major Operational Commitments ($25,000 - $100,000)</div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-xs font-bold">Dual Sign-off</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Requires Plant Director AND Procurement Controller. If unreviewed within 12 hours, high-priority SMS escalation triggered.
                </p>
              </div>

              <div className="border border-border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-sm text-foreground">Tier 3: Executive Capital Expenditure (&gt; $100,000)</div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 text-xs font-bold">C-Suite Tri-Sign</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mandatory sign-off from Chief Financial Officer (CFO), VP of Manufacturing, and Chief Operating Officer (COO). Requires verified ROI model attachment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DELEGATION */}
      {activeTab === 'DELEGATION' && (
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Out-of-Office & Proxy Authority Configuration</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Delegate pending decision rights during travel or leave without violating segregation-of-duties boundaries.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDelegationActive}
                onChange={(e) => setIsDelegationActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Designated Proxy Approver</label>
              <select
                value={delegatePerson}
                onChange={(e) => setDelegatePerson(e.target.value)}
                className="w-full text-xs rounded-md border border-input bg-background p-2.5 text-foreground focus:ring-1 focus:ring-primary"
              >
                <option>Sarah Jenkins (VP of Operations)</option>
                <option>Michael Chang (Finance Controller)</option>
                <option>David Ross (Lead Production Director)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Effective Start Date</label>
                <input
                  type="date"
                  defaultValue="2026-10-23"
                  className="w-full text-xs rounded-md border border-input bg-background p-2 text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Effective End Date</label>
                <input
                  type="date"
                  defaultValue="2026-10-30"
                  className="w-full text-xs rounded-md border border-input bg-background p-2 text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Scope of Delegated Authority</label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-input text-primary" />
                  <span>CapEx & Equipment Requisitions (up to $50,000)</span>
                </label>
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-input text-primary" />
                  <span>Standard Purchase Orders & Sourcing Contracts</span>
                </label>
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-input text-primary" />
                  <span>Quality Scrap Approvals (&lt; 2,000 units)</span>
                </label>
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-input text-primary" />
                  <span>Engineering Change Orders (Non-safety critical)</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => {
                setIsDelegationActive(true);
                alert(`Proxy successfully delegated to ${delegatePerson}. Audit record logged.`);
              }}
              className="w-full py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              Save Proxy Delegation Policy
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'AUDIT' && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Immutable Authorization Audit Log</h2>
              <p className="text-xs text-muted-foreground">
                Cryptographically hashed audit ledger for external SOX, ISO 9001, and IATF 16949 regulatory examinations.
              </p>
            </div>
            <button
              onClick={handleExportAuditTrailDoc}
              title="Download Official SOX Compliance Audit Dossier in Word Format"
              className="inline-flex items-center gap-2 text-xs border border-border px-3 py-1.5 rounded-md hover:bg-accent text-foreground transition-all cursor-pointer shadow-sm hover:border-primary/50"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Export Audit Trail (.doc)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-3">Audit Token</th>
                  <th className="p-3">Document Reference</th>
                  <th className="p-3">Decision</th>
                  <th className="p-3">Authorized By</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Digital Fingerprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-accent/40">
                  <td className="p-3 font-mono text-[11px] text-muted-foreground">#AUD-9912</td>
                  <td className="p-3 font-semibold text-foreground">PO-2026-9012 (CNC Tooling Inserts)</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-emerald-600 bg-emerald-500/10 font-bold">APPROVED</span>
                  </td>
                  <td className="p-3 text-foreground">Alexander Vance (Plant Director)</td>
                  <td className="p-3 text-muted-foreground">2026-10-21 17:22:04 EST</td>
                  <td className="p-3 font-mono text-[10px] text-muted-foreground">sha256:8f9a...3c21</td>
                </tr>
                <tr className="hover:bg-accent/40">
                  <td className="p-3 font-mono text-[11px] text-muted-foreground">#AUD-9911</td>
                  <td className="p-3 font-semibold text-foreground">CAPEX-2026-0889 (Additive 3D Titanium Printer)</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-rose-600 bg-rose-500/10 font-bold">REJECTED</span>
                  </td>
                  <td className="p-3 text-foreground">Samantha Sterling (CFO)</td>
                  <td className="p-3 text-muted-foreground">2026-10-21 14:15:30 EST</td>
                  <td className="p-3 font-mono text-[10px] text-muted-foreground">sha256:7b41...e90a</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {modalItem && decisionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                {decisionType === 'APPROVE' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                {decisionType === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}
              </h3>
              <button
                onClick={() => {
                  setModalItem(null);
                  setDecisionType(null);
                }}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-muted/40 p-3 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-foreground">{modalItem.title}</div>
              <div className="text-muted-foreground">Reference: <span className="font-mono text-foreground">{modalItem.id}</span></div>
              <div className="text-muted-foreground">Department: {modalItem.department} | Exposure: <span className="font-bold text-foreground">{modalItem.valueOrImpact}</span></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Decision Notes & Compliance Justification {decisionType === 'REJECT' && <span className="text-rose-500">*</span>}
              </label>
              <textarea
                rows={3}
                placeholder={
                  decisionType === 'APPROVE'
                    ? 'Enter optional approval remarks or budgetary reference...'
                    : 'Explain the reason for rejection (required for audit trail)...'
                }
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="w-full text-xs rounded-md border border-input bg-background p-2.5 text-foreground focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setModalItem(null);
                  setDecisionType(null);
                }}
                className="px-4 py-2 text-xs font-medium border border-border rounded-lg text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={executeDecision}
                disabled={decisionType === 'REJECT' && !decisionNotes.trim()}
                className={`px-4 py-2 text-xs font-semibold rounded-lg text-white transition-colors ${
                  decisionType === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500 disabled:opacity-50'
                }`}
              >
                Sign & Finalize Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

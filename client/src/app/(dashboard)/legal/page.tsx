'use client';

import React, { useState } from 'react';
import {
  Scale,
  FileText,
  ShieldCheck,
  Award,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Download,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Building,
  Gavel,
  BookOpen,
  Lock,
  ChevronRight,
  Filter,
  DollarSign,
  Briefcase,
} from 'lucide-react';

interface ContractRecord {
  id: string;
  title: string;
  counterparty: string;
  type: 'MSA' | 'SLA' | 'SUPPLY_AGREEMENT' | 'EQUIPMENT_LEASE' | 'DISTRIBUTION';
  value: string;
  effectiveDate: string;
  expiryDate: string;
  status: 'EXECUTED' | 'IN_LEGAL_REVIEW' | 'DRAFT' | 'EXPIRING_SOON' | 'EXPIRED';
  jurisdiction: string;
  indemnityCap: string;
  autoRenew: boolean;
  leadCounsel: string;
}

const SAMPLE_CONTRACTS: ContractRecord[] = [
  {
    id: 'CTR-2024-019',
    title: 'Master Component Supply & Consignment Agreement',
    counterparty: 'Apex Microelectronics Global Ltd',
    type: 'SUPPLY_AGREEMENT',
    value: '$2,400,000 / yr',
    effectiveDate: '2024-01-15',
    expiryDate: '2026-12-31',
    status: 'EXECUTED',
    jurisdiction: 'Delaware, USA',
    indemnityCap: '$5,000,000',
    autoRenew: true,
    leadCounsel: 'Eleanor Vance, Esq.',
  },
  {
    id: 'CTR-2025-082',
    title: 'High-Precision Pick-and-Place Capital Equipment Lease',
    counterparty: 'Yamaha Robotics Precision AG',
    type: 'EQUIPMENT_LEASE',
    value: '$780,000 / yr',
    effectiveDate: '2025-06-01',
    expiryDate: '2026-11-15',
    status: 'EXPIRING_SOON',
    jurisdiction: 'Frankfurt, Germany',
    indemnityCap: '$1,000,000',
    autoRenew: false,
    leadCounsel: 'Marcus Thorne, LL.M',
  },
  {
    id: 'CTR-2026-004',
    title: 'OEM Client Enterprise Delivery & SLA Master Contract',
    counterparty: 'AeroDynamics Defense & Space LLC',
    type: 'MSA',
    value: '$14,500,000',
    effectiveDate: '2026-03-01',
    expiryDate: '2029-02-28',
    status: 'EXECUTED',
    jurisdiction: 'District of Columbia, USA',
    indemnityCap: 'Unlimited Gross Negligence',
    autoRenew: true,
    leadCounsel: 'Eleanor Vance, Esq.',
  },
  {
    id: 'CTR-2026-112',
    title: 'Nitrogen Cryogenic Bulk Storage & Supply SLA',
    counterparty: 'Air Liquide Industrial Gases',
    type: 'SLA',
    value: '$195,000 / yr',
    effectiveDate: '2026-10-15',
    expiryDate: '2027-10-14',
    status: 'IN_LEGAL_REVIEW',
    jurisdiction: 'Texas, USA',
    indemnityCap: '$500,000',
    autoRenew: true,
    leadCounsel: 'Jonathan Price, Esq.',
  },
];

interface NDARecord {
  id: string;
  counterparty: string;
  scope: string;
  direction: 'MUTUAL_BILATERAL' | 'UNILATERAL_OUTBOUND' | 'UNILATERAL_INBOUND';
  executedDate: string;
  expiresInDays: number;
  confidentialityTier: 'TOP_SECRET_PROPRIETARY' | 'STANDARD_COMMERCIAL' | 'RESTRICTED_DEFENSE';
  signedBy: string;
}

const SAMPLE_NDAS: NDARecord[] = [
  {
    id: 'NDA-2025-441',
    counterparty: 'Quantum Photonics Foundry Inc.',
    scope: 'Sub-nanometer optical transceiver packaging designs',
    direction: 'MUTUAL_BILATERAL',
    executedDate: '2025-04-10',
    expiresInDays: 142,
    confidentialityTier: 'TOP_SECRET_PROPRIETARY',
    signedBy: 'Dr. Evelyn Vance (CTO)',
  },
  {
    id: 'NDA-2026-018',
    counterparty: 'Lockheed Martin Space Systems',
    scope: 'Radiation-hardened satellite telemetry controllers',
    direction: 'MUTUAL_BILATERAL',
    executedDate: '2026-01-12',
    expiresInDays: 480,
    confidentialityTier: 'RESTRICTED_DEFENSE',
    signedBy: 'Arthur Pendelton (CEO)',
  },
  {
    id: 'NDA-2026-092',
    counterparty: 'Nvidia Corporation OEM Partnering',
    scope: 'Next-generation Jetson industrial robotics carrier boards',
    direction: 'MUTUAL_BILATERAL',
    executedDate: '2026-08-01',
    expiresInDays: 680,
    confidentialityTier: 'TOP_SECRET_PROPRIETARY',
    signedBy: 'Arthur Pendelton (CEO)',
  },
];

interface PatentRecord {
  id: string;
  applicationNumber: string;
  title: string;
  category: 'PATENT_UTILITY' | 'TRADE_SECRET' | 'DESIGN_PATENT';
  jurisdiction: 'USPTO' | 'EPO' | 'WIPO' | 'JPO';
  filingDate: string;
  status: 'GRANTED' | 'UNDER_EXAMINATION' | 'PROVISIONAL_FILED';
  inventors: string[];
  maintenanceFeeDue: string;
}

const SAMPLE_PATENTS: PatentRecord[] = [
  {
    id: 'PAT-US-089',
    applicationNumber: 'US 11,842,910 B2',
    title: 'High-Velocity Solder Wave Inert Gas Shroud with Vortex Stabilization',
    category: 'PATENT_UTILITY',
    jurisdiction: 'USPTO',
    filingDate: '2023-05-18',
    status: 'GRANTED',
    inventors: ['Dr. Evelyn Vance', 'Heng Wei'],
    maintenanceFeeDue: '2027-05-18 (4-Yr Window)',
  },
  {
    id: 'PAT-EP-014',
    applicationNumber: 'EP 3 940 128 A1',
    title: 'Closed-Loop Real-Time Optical Metrology with Interferometric Defect Triangulation',
    category: 'PATENT_UTILITY',
    jurisdiction: 'EPO',
    filingDate: '2024-08-20',
    status: 'UNDER_EXAMINATION',
    inventors: ['Dr. Evelyn Vance', 'Sarah Jenkins'],
    maintenanceFeeDue: '2027-08-20',
  },
  {
    id: 'TS-2026-003',
    applicationNumber: 'INTERNAL-TS-409',
    title: 'Ultra-Low Outgassing Polymer Encapsulant Formulation for Harsh Industrial IoT',
    category: 'TRADE_SECRET',
    jurisdiction: 'WIPO',
    filingDate: '2026-02-14',
    status: 'GRANTED',
    inventors: ['Claire Chen', 'Rajesh Patel'],
    maintenanceFeeDue: 'Continuous Vault Review',
  },
];

interface ComplianceStandard {
  standard: string;
  title: string;
  authority: string;
  lastAuditDate: string;
  nextAuditDate: string;
  status: 'FULLY_COMPLIANT' | 'MINOR_FINDINGS_IN_PROGRESS' | 'AUDIT_SCHEDULED';
  complianceLead: string;
  scopeSummary: string;
}

const SAMPLE_COMPLIANCE: ComplianceStandard[] = [
  {
    standard: 'ISO 9001:2015',
    title: 'Quality Management Systems (QMS)',
    authority: 'TÜV SÜD America',
    lastAuditDate: '2026-04-12',
    nextAuditDate: '2027-04-10',
    status: 'FULLY_COMPLIANT',
    complianceLead: 'David O\'Connor (VP Quality)',
    scopeSummary: 'Comprehensive plant-wide manufacturing, inspection, and traceability compliance.',
  },
  {
    standard: 'IATF 16949:2016',
    title: 'Automotive Quality Management Standard',
    authority: 'DNV GL Business Assurance',
    lastAuditDate: '2026-06-20',
    nextAuditDate: '2026-12-15',
    status: 'AUDIT_SCHEDULED',
    complianceLead: 'David O\'Connor (VP Quality)',
    scopeSummary: 'Rigorous automotive electronics sub-assembly and PPAP Level 3 readiness.',
  },
  {
    standard: 'RoHS 3 & REACH SVHC',
    title: 'EU Hazardous Substances & Chemical Safety Directive',
    authority: 'SGS Environmental Testing',
    lastAuditDate: '2026-08-01',
    nextAuditDate: '2027-02-01',
    status: 'FULLY_COMPLIANT',
    complianceLead: 'Claire Chen (EHS Lead)',
    scopeSummary: 'Lead-free solder verification, 235 SVHC screening on all raw resin and wire batches.',
  },
  {
    standard: 'OSHA 1910 Subpart I',
    title: 'Personal Protective Equipment & Industrial Safety',
    authority: 'US Department of Labor',
    lastAuditDate: '2026-09-14',
    nextAuditDate: '2027-03-14',
    status: 'MINOR_FINDINGS_IN_PROGRESS',
    complianceLead: 'Aaron Miller (EHS Safety Officer)',
    scopeSummary: 'Chemical fume extraction hood velocity in solder bay currently undergoing airflow sensor re-zeroing.',
  },
];

export default function LegalCompliancePage() {
  const [activeTab, setActiveTab] = useState<'CLM' | 'NDA' | 'PATENTS' | 'COMPLIANCE' | 'DISPUTES'>('CLM');
  const [contracts, setContracts] = useState<ContractRecord[]>(SAMPLE_CONTRACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // New Contract Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCounterparty, setNewCounterparty] = useState('');
  const [newType, setNewType] = useState<'MSA' | 'SLA' | 'SUPPLY_AGREEMENT'>('SUPPLY_AGREEMENT');
  const [newValue, setNewValue] = useState('');

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCounterparty) return;

    const newRecord: ContractRecord = {
      id: `CTR-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      counterparty: newCounterparty,
      type: newType,
      value: newValue || '$150,000',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-12-31',
      status: 'IN_LEGAL_REVIEW',
      jurisdiction: 'Delaware, USA',
      indemnityCap: '$1,000,000',
      autoRenew: true,
      leadCounsel: 'Eleanor Vance, Esq.',
    };

    setContracts([newRecord, ...contracts]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewCounterparty('');
    setNewValue('');
  };

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Legal, Contracts & Regulatory Compliance
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Scale className="w-3.5 h-3.5 mr-1" />
              General Counsel Workspace
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise contract lifecycle management (CLM), non-disclosure covenants, patent registry, and statutory EHS compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Contract Request
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active MSAs & Leases</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">42</span>
            <span className="text-xs text-muted-foreground ml-2">legally executed</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">$28.4M committed value</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">NDA Vault Coverage</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">118</span>
            <span className="text-xs text-muted-foreground ml-2">covenants active</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">100% counterparty vetted</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Patents & Trade Secrets</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">17</span>
            <span className="text-xs text-muted-foreground ml-2">global filings</span>
          </div>
          <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium">9 Granted, 8 Pending</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Statutory Audit Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">99.2%</span>
            <span className="text-xs text-muted-foreground ml-2">audit compliance</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">ISO 9001 / IATF 16949 pass</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('CLM')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'CLM'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" />
            Contract Lifecycle Management (CLM)
          </button>
          <button
            onClick={() => setActiveTab('NDA')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'NDA'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Lock className="w-4 h-4" />
            Mutual NDA Vault
          </button>
          <button
            onClick={() => setActiveTab('PATENTS')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'PATENTS'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Award className="w-4 h-4" />
            IP & Patent Register
          </button>
          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'COMPLIANCE'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Statutory & EHS Standards
          </button>
          <button
            onClick={() => setActiveTab('DISPUTES')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'DISPUTES'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Gavel className="w-4 h-4" />
            Dispute & Arbitration Desk
          </button>
        </nav>
      </div>

      {/* TAB 1: CONTRACT LIFECYCLE MANAGEMENT */}
      {activeTab === 'CLM' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-3 rounded-lg border border-border">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search contract, counterparty, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-md border border-input bg-background text-foreground w-64 focus:ring-1 focus:ring-primary"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-md border border-input bg-background text-foreground focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Contract Types</option>
                <option value="MSA">Master Services Agreement (MSA)</option>
                <option value="SUPPLY_AGREEMENT">Supply Agreement</option>
                <option value="EQUIPMENT_LEASE">Equipment Lease</option>
                <option value="SLA">Service Level Agreement (SLA)</option>
              </select>
            </div>
            <div className="text-xs text-muted-foreground">Showing {filteredContracts.length} contracts</div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Contract Ref & Type</th>
                    <th className="p-3">Title & Primary Counterparty</th>
                    <th className="p-3">Contract Value</th>
                    <th className="p-3">Tenure & Expiry</th>
                    <th className="p-3">Jurisdiction & Liability</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-accent/40 transition-colors">
                      <td className="p-3">
                        <div className="font-mono font-bold text-foreground">{c.id}</div>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary mt-1">
                          {c.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 max-w-sm">
                        <div className="font-semibold text-foreground text-sm">{c.title}</div>
                        <div className="text-muted-foreground flex items-center gap-1.5 mt-0.5 text-xs">
                          <Building className="w-3.5 h-3.5" />
                          {c.counterparty}
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-foreground text-sm">{c.value}</td>
                      <td className="p-3">
                        <div className="text-foreground">{c.expiryDate}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {c.autoRenew ? 'Auto-renews annually' : 'Fixed term expiration'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-foreground">{c.jurisdiction}</div>
                        <div className="text-[10px] text-muted-foreground">Cap: {c.indemnityCap}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            c.status === 'EXECUTED'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : c.status === 'EXPIRING_SOON'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => alert(`Downloading signed legal PDF for ${c.id}`)}
                            className="p-1.5 rounded-md hover:bg-accent text-foreground"
                            title="Download Signed PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert(`Lead Counsel: ${c.leadCounsel}\nJurisdiction: ${c.jurisdiction}\nIndemnity: ${c.indemnityCap}`)}
                            className="p-1.5 rounded-md hover:bg-accent text-foreground"
                            title="View Legal Synopsis"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NDA VAULT */}
      {activeTab === 'NDA' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground mb-1">Corporate Non-Disclosure Agreement (NDA) Vault</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Cryptographically archived bilateral and multilateral non-disclosure covenants governing proprietary engineering schematics.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">NDA Token</th>
                    <th className="p-3">Counterparty & Scope</th>
                    <th className="p-3">Direction</th>
                    <th className="p-3">Confidentiality Tier</th>
                    <th className="p-3">Expiration Window</th>
                    <th className="p-3">Signatory</th>
                    <th className="p-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SAMPLE_NDAS.map((n) => (
                    <tr key={n.id} className="hover:bg-accent/40">
                      <td className="p-3 font-mono font-bold text-foreground">{n.id}</td>
                      <td className="p-3 max-w-sm">
                        <div className="font-semibold text-foreground text-sm">{n.counterparty}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{n.scope}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-muted text-foreground">
                          {n.direction.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                          <Lock className="w-3 h-3" />
                          {n.confidentialityTier.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-foreground">{n.expiresInDays} days</span>
                        <div className="text-[10px] text-muted-foreground">Executed {n.executedDate}</div>
                      </td>
                      <td className="p-3 text-foreground">{n.signedBy}</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Valid
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

      {/* TAB 3: PATENTS & IP */}
      {activeTab === 'PATENTS' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground mb-1">Intellectual Property, Utility Patents & Trade Secrets</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Registered patents and protected trade secret formulations registered across USPTO, EPO, and WIPO treaties.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_PATENTS.map((p) => (
                <div key={p.id} className="border border-border rounded-xl p-4 bg-muted/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-primary">{p.applicationNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        {p.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground mb-2">{p.title}</h3>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Jurisdiction: <span className="font-medium text-foreground">{p.jurisdiction}</span></div>
                      <div>Filing Date: <span className="font-medium text-foreground">{p.filingDate}</span></div>
                      <div>Inventors: <span className="font-medium text-foreground">{p.inventors.join(', ')}</span></div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Maintenance:</span>
                    <span className="font-semibold text-foreground">{p.maintenanceFeeDue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLIANCE */}
      {activeTab === 'COMPLIANCE' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground mb-1">Statutory Standards, EHS & Quality Accreditations</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Continuous monitoring of ISO certifications, environmental hazardous materials limits, and OSHA workplace safety standards.
            </p>

            <div className="space-y-4">
              {SAMPLE_COMPLIANCE.map((std) => (
                <div key={std.standard} className="border border-border rounded-lg p-4 bg-muted/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="font-bold text-sm text-foreground mr-2">{std.standard}:</span>
                      <span className="text-sm text-muted-foreground">{std.title}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold w-fit ${
                        std.status === 'FULLY_COMPLIANT'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : std.status === 'AUDIT_SCHEDULED'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {std.status === 'FULLY_COMPLIANT' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {std.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{std.scopeSummary}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
                    <div>Auditing Body: <span className="font-semibold text-foreground">{std.authority}</span></div>
                    <div>Last Audit: <span className="font-semibold text-foreground">{std.lastAuditDate}</span></div>
                    <div>Next Review: <span className="font-semibold text-foreground">{std.nextAuditDate}</span></div>
                    <div>Lead: <span className="font-semibold text-foreground">{std.complianceLead}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DISPUTES & ARBITRATION */}
      {activeTab === 'DISPUTES' && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Dispute, Warranty Indemnity & Arbitration Workbench</h2>
              <p className="text-xs text-muted-foreground">
                Track formal commercial claims, vendor defect liability notices, and breach of warranty representations.
              </p>
            </div>
          </div>

          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-rose-600">DISP-2026-03</span>
                <span className="font-bold text-sm text-foreground">Silicon Substrate Delamination Warranty Claim</span>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-600">In Mediation</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Notice of commercial defect served to vendor SilicTech Global regarding thermal expansion coefficient (CTE) mismatch in Lot #ST-9912. Total direct exposure: $128,400.
            </p>
            <div className="text-xs flex items-center gap-4 text-muted-foreground">
              <span>Counsel: Jonathan Price, Esq.</span>
              <span>Arbitration Forum: AAA Commercial Rules (Dallas)</span>
              <span>Target Settlement: 2026-11-30</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Initiate New Contract Lifecycle Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Contract Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Raw Materials Consignment Agreement"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Primary Counterparty Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Industrial Sourcing Corp"
                  value={newCounterparty}
                  onChange={(e) => setNewCounterparty(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Contract Classification</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2 text-foreground"
                  >
                    <option value="SUPPLY_AGREEMENT">Supply Agreement</option>
                    <option value="MSA">Master Services Agreement (MSA)</option>
                    <option value="SLA">Service Level Agreement (SLA)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Estimated Annual Value</label>
                  <input
                    type="text"
                    placeholder="e.g. $450,000 / yr"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2 text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90"
                >
                  Submit for Legal Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

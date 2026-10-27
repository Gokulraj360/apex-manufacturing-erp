'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Shield,
  Layers,
  ArrowRight,
  RotateCcw,
  Search,
  CheckCircle2,
  Crown,
  Factory,
  Cpu,
  Truck,
  DollarSign,
  Scale,
  Briefcase,
  HardHat,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface EnterprisePersona {
  id: string;
  name: string;
  title: string;
  category: 'EXECUTIVE' | 'OPERATIONS' | 'SUPPLY_CHAIN' | 'GOVERNANCE' | 'EXTERNAL_B2B';
  clearanceLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5_ROOT';
  accentColor: string;
  avatarInitials: string;
  tagline: string;
  keyResponsibilities: string[];
  kpis: { label: string; value: string }[];
  primaryPath: string;
  authorizedModules: string[];
}

const ENTERPRISE_PERSONAS: EnterprisePersona[] = [
  // 1. Executive & Strategy
  {
    id: 'TOP_MGMT',
    name: 'Arthur Pendelton',
    title: 'Chief Executive Officer (CEO)',
    category: 'EXECUTIVE',
    clearanceLevel: 'LEVEL_5_ROOT',
    accentColor: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-500',
    avatarInitials: 'AP',
    tagline: 'Strategic corporate capital allocation, global plant EBITDA waterfalls, and Cash Conversion Cycle governance.',
    keyResponsibilities: [
      'Multi-plant EBITDA & DuPont ROE margin optimization',
      'Board-level CapEx investments and M&A integration',
      'Global corporate risk and shareholder value stewardship',
    ],
    kpis: [
      { label: 'EBITDA Margin', value: '24.2%' },
      { label: 'Cash Conv Cycle', value: '36.7 Days' },
      { label: 'Global FPY', value: '98.6%' },
    ],
    primaryPath: '/top-management',
    authorizedModules: ['Top Management Cockpit', 'Executive Approvals', 'Global Finance', 'Legal & Compliance'],
  },
  {
    id: 'PLANT_DIR',
    name: 'Alexander Vance',
    title: 'Austin Plant Operations Director',
    category: 'EXECUTIVE',
    clearanceLevel: 'LEVEL_4',
    accentColor: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-500',
    avatarInitials: 'AV',
    tagline: 'Operational cadence, multi-line throughput, OEE stabilization, and factory safety leadership.',
    keyResponsibilities: [
      'Plant capacity utilization and labor roster balance',
      'Continuous improvement (Kaizen) and scrap minimization',
      'Environmental health and safety (OSHA 1910) compliance',
    ],
    kpis: [
      { label: 'Plant OEE', value: '88.5%' },
      { label: 'On-Time In-Full', value: '99.1%' },
      { label: 'Safety Record', value: '412 Days Zero Incident' },
    ],
    primaryPath: '/dashboard',
    authorizedModules: ['Plant Overview', 'Production Lines', 'Approvals Inbox', 'Quality Bench'],
  },
  {
    id: 'FINANCE_CFO',
    name: 'Samantha Sterling',
    title: 'Chief Financial Officer (CFO)',
    category: 'GOVERNANCE',
    clearanceLevel: 'LEVEL_5_ROOT',
    accentColor: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-500',
    avatarInitials: 'SS',
    tagline: 'Working capital discipline, automated 3-way AP reconciliation, and SOX 404 statutory internal controls.',
    keyResponsibilities: [
      'Automated 3-way matching between POs, GRNs, and Supplier Invoices',
      'Treasury cash flow forecasting and foreign exchange hedging',
      'Capital budget disbursements and supplier debit notes',
    ],
    kpis: [
      { label: 'AP Match Rate', value: '96.8%' },
      { label: 'DPO Days', value: '61.8 Days' },
      { label: 'Audit Findings', value: '0 Deficiencies' },
    ],
    primaryPath: '/finance/ap-matching',
    authorizedModules: ['Automated AP Matching', 'CapEx Approvals', 'Treasury Ledger', 'Top Management'],
  },
  {
    id: 'GENERAL_COUNSEL',
    name: 'Eleanor Vance, Esq.',
    title: 'General Counsel & VP Regulatory Affairs',
    category: 'GOVERNANCE',
    clearanceLevel: 'LEVEL_4',
    accentColor: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-500',
    avatarInitials: 'EV',
    tagline: 'Master supplier agreements, patent portfolio stewardship, NDA vaults, and trade secret protection.',
    keyResponsibilities: [
      'CLM contract authoring and indemnity cap negotiations',
      'Bilateral and unilateral non-disclosure agreement lifecycle',
      'Statutory compliance (ISO 9001, RoHS, REACH, Conflict Minerals)',
    ],
    kpis: [
      { label: 'Active MSAs', value: '42 Contracts' },
      { label: 'Patents Filed', value: '17 Global' },
      { label: 'Statutory Score', value: '99.2%' },
    ],
    primaryPath: '/legal',
    authorizedModules: ['Legal & CLM Workspace', 'NDA Vault', 'Patents Register', 'Approvals Desk'],
  },
  {
    id: 'SUPER_ADMIN',
    name: 'Marcus Thorne',
    title: 'Enterprise Super Administrator',
    category: 'GOVERNANCE',
    clearanceLevel: 'LEVEL_5_ROOT',
    accentColor: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-500',
    avatarInitials: 'MT',
    tagline: '2D RBAC security matrix, Segregation of Duties (SoD) enforcement, and immutable audit trailing.',
    keyResponsibilities: [
      '18-Role 2D RBAC permission grid configuration',
      'Toxic SoD pair detection and automated access revocation',
      'Granular data scoping hierarchy (OWN, DEPT, PLANT, ALL)',
    ],
    kpis: [
      { label: 'Active Users', value: '1,420 Enrolled' },
      { label: 'SoD Violations', value: '0 Conflicts' },
      { label: 'Auth Uptime', value: '99.99%' },
    ],
    primaryPath: '/super-admin/rbac-matrix',
    authorizedModules: ['2D RBAC Matrix', 'SoD Auditor', 'Data Scoping Hierarchy', 'System Logs'],
  },
  {
    id: 'QA_LEAD',
    name: 'David O\'Connor',
    title: 'VP Quality & Metrology Engineering',
    category: 'OPERATIONS',
    clearanceLevel: 'LEVEL_3',
    accentColor: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-500',
    avatarInitials: 'DO',
    tagline: 'Station hardware diagnostics, automated ATE test fixtures, and defect quarantine diversion.',
    keyResponsibilities: [
      'Automated Station Hardware Diagnostics suite operations',
      'First-Pass Yield (FPY) Pareto analysis and rework disposition',
      'IATF 16949 automotive PPAP Level 3 compliance',
    ],
    kpis: [
      { label: 'Station FPY', value: '98.42%' },
      { label: 'Takt Time', value: '18.6s' },
      { label: 'Scrap Rate', value: '0.41%' },
    ],
    primaryPath: '/quality/hardware-diagnostics',
    authorizedModules: ['Hardware Diagnostics', 'ATE Bench', 'Defect Quarantine', 'Yield Pareto'],
  },
  {
    id: 'ASSEMBLY_TECH',
    name: 'Alex Jordan',
    title: 'Senior Cleanroom Assembly Technician',
    category: 'OPERATIONS',
    clearanceLevel: 'LEVEL_1',
    accentColor: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-500',
    avatarInitials: 'AJ',
    tagline: 'Precision micro-soldering, DUT testing, shift overtime tracking, and personal PPE asset custody.',
    keyResponsibilities: [
      'IPC-A-610 Class 3 precision electronics assembly',
      'Real-time shift schedule and overtime logging',
      'Assigned calibrated metrology tool custody and maintenance',
    ],
    kpis: [
      { label: 'Daily Units', value: '142 Tested' },
      { label: 'Zero Rework', value: '99.4%' },
      { label: 'Safety Badge', value: '100% ESD Pass' },
    ],
    primaryPath: '/my-workspace',
    authorizedModules: ['Employee Self-Service', 'Shift Schedule', 'Leave Balance', 'Hardware Diagnostics'],
  },
  {
    id: 'B2B_SUPPLIER',
    name: 'SilicTech Global Inc.',
    title: 'Tier 1 Wafer Foundry Supplier Partner',
    category: 'EXTERNAL_B2B',
    clearanceLevel: 'LEVEL_2',
    accentColor: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-500',
    avatarInitials: 'ST',
    tagline: 'Autonomous RFQ bidding, PO schedule acknowledgments, ASN dispatch, and PPM quality scorecard.',
    keyResponsibilities: [
      'B2B RFQ quotation submission and volume tier locking',
      'Advance Shipping Notice (ASN) generation with barcode manifests',
      'Self-service digital invoice upload with automated 3-way match',
    ],
    kpis: [
      { label: 'On-Time Delivery', value: '99.4%' },
      { label: 'Defect PPM', value: '12 PPM' },
      { label: 'Partner Tier', value: 'Platinum Gold' },
    ],
    primaryPath: '/supplier-portal',
    authorizedModules: ['Supplier Self-Service Portal', 'ASN Builder', 'RFQ Bids', 'Quality Scorecard'],
  },
  {
    id: 'B2B_CUSTOMER',
    name: 'AeroDynamics Defense LLC',
    title: 'Enterprise Commercial Client',
    category: 'EXTERNAL_B2B',
    clearanceLevel: 'LEVEL_2',
    accentColor: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-500',
    avatarInitials: 'AD',
    tagline: 'Live assembly line WIP tracking, automated Certificates of Conformance (CoC), and RMA portal.',
    keyResponsibilities: [
      'Multi-stage live assembly work-in-progress telemetry inspection',
      'Cryptographically signed Certificate of Conformance downloads',
      'RMA warranty claims and customer account statement downloads',
    ],
    kpis: [
      { label: 'Contract Units', value: '25,000 Pcs' },
      { label: 'CoC Validated', value: '100%' },
      { label: 'SLA Uptime', value: '99.98%' },
    ],
    primaryPath: '/customer-portal',
    authorizedModules: ['Commercial Client Portal', 'Live WIP Tracker', 'CoC Vault', 'RMA Warranty Desk'],
  },
];

export default function PortalsGalleryPage() {
  const { session } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [simulatedRole, setSimulatedRole] = useState<EnterprisePersona | null>(null);

  const filteredPersonas = ENTERPRISE_PERSONAS.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authorizedModules.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Strict Super Admin Access Guard
  if (session && session.roleId !== 'super_admin') {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Executive Privilege Required
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto leading-relaxed">
          The Multi-Persona Portal Gallery and cross-role cockpit launchers are restricted exclusively to <span className="font-semibold text-slate-800 dark:text-slate-200">Top Management (Owner / MD)</span>.
        </p>
        <Link
          href="/top-management"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
        >
          Return to Authorized Station
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Enterprise Multi-Persona Portal Gallery
            </h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Users className="w-3.5 h-3.5 mr-1" />
              21 Enterprise Roles
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Crown className="w-3.5 h-3.5 mr-1" />
              Top Admin Exclusive
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Explore dedicated operational cockpits tailored for every persona across the manufacturing, supply chain, and executive lifecycle.
          </p>
        </div>

        {simulatedRole && (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg text-xs text-foreground">
            <span className="text-primary font-bold">Simulating:</span>
            <span>{simulatedRole.title}</span>
            <button
              onClick={() => setSimulatedRole(null)}
              className="text-muted-foreground hover:text-foreground ml-2 font-bold inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-3 rounded-lg border border-border">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search persona, role, capability..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-md border border-input bg-background text-foreground w-64 focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            All Personas
          </button>
          <button
            onClick={() => setSelectedCategory('EXECUTIVE')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === 'EXECUTIVE'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            Executive & Strategy
          </button>
          <button
            onClick={() => setSelectedCategory('OPERATIONS')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === 'OPERATIONS'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            Operations & Quality
          </button>
          <button
            onClick={() => setSelectedCategory('GOVERNANCE')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === 'GOVERNANCE'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            Governance & Finance
          </button>
          <button
            onClick={() => setSelectedCategory('EXTERNAL_B2B')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === 'EXTERNAL_B2B'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            External B2B Portals
          </button>
        </div>

        <div className="text-xs text-muted-foreground">Showing {filteredPersonas.length} enterprise personas</div>
      </div>

      {/* Persona Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPersonas.map((persona) => (
          <div
            key={persona.id}
            className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition-all duration-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm shadow-inner">
                    {persona.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {persona.name}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground">{persona.title}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground">
                  {persona.clearanceLevel.replace('_', ' ')}
                </span>
              </div>

              {/* Tagline */}
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {persona.tagline}
              </p>

              {/* Key KPIs */}
              <div className="grid grid-cols-3 gap-2 bg-muted/20 p-2.5 rounded-xl border border-border/50 mb-4 text-center">
                {persona.kpis.map((kpi) => (
                  <div key={kpi.label}>
                    <div className="text-[10px] text-muted-foreground">{kpi.label}</div>
                    <div className="font-bold text-xs text-foreground mt-0.5">{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Key Capabilities */}
              <div className="space-y-1.5 mb-4 text-xs">
                {persona.keyResponsibilities.map((resp, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-[11px] leading-snug">{resp}</span>
                  </div>
                ))}
              </div>

              {/* Module Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {persona.authorizedModules.map((mod) => (
                  <span
                    key={mod}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/5 border border-primary/10 text-primary"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <button
                onClick={() => setSimulatedRole(persona)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground py-1.5 px-2.5 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                Simulate View
              </button>

              <Link
                href={persona.primaryPath}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground py-1.5 px-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                Launch Cockpit
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

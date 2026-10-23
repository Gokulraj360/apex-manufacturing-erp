'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { generateAndDownloadWordDoc } from '@/lib/wordDocumentGenerator';
import { workflowStore, WorkflowItem } from '@/lib/workflowStore';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  Building2,
  Calendar,
  Sparkles,
  Download,
  ShieldCheck,
  Zap,
  Globe,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react';

interface PlantPerformance {
  plantName: string;
  location: string;
  revenue: string;
  ebitda: string;
  ebitdaMargin: number;
  oee: number;
  fpy: number;
  status: 'EXCEEDING_TARGET' | 'ON_TRACK' | 'ATTENTION_REQUIRED';
}

const PLANT_METRICS: PlantPerformance[] = [
  {
    plantName: 'Plant 1: Austin Flagship Advanced Electronics',
    location: 'Austin, Texas, USA',
    revenue: '$68.4M',
    ebitda: '$18.2M',
    ebitdaMargin: 26.6,
    oee: 89.2,
    fpy: 98.8,
    status: 'EXCEEDING_TARGET',
  },
  {
    plantName: 'Plant 2: Stuttgart Automotive Sensor Hub',
    location: 'Stuttgart, Germany',
    revenue: '$49.1M',
    ebitda: '$11.8M',
    ebitdaMargin: 24.0,
    oee: 87.5,
    fpy: 98.4,
    status: 'ON_TRACK',
  },
  {
    plantName: 'Plant 3: Singapore High-Density Microelectronics',
    location: 'Jurong Innovation District, Singapore',
    revenue: '$31.0M',
    ebitda: '$5.9M',
    ebitdaMargin: 19.0,
    oee: 82.1,
    fpy: 96.9,
    status: 'ATTENTION_REQUIRED',
  },
];

interface CapexProject {
  id: string;
  name: string;
  plant: string;
  budget: number;
  committed: number;
  spent: number;
  projectedIRR: number;
  paybackYears: number;
  status: 'ON_SCHEDULE' | 'FINAL_COMMISSIONING' | 'BOARD_APPROVED';
}

const CAPEX_PROJECTS: CapexProject[] = [
  {
    id: 'CPX-2026-01',
    name: 'SMT Line 4 High-Speed Dual-Gantry Placement Upgrade',
    plant: 'Austin Plant 1',
    budget: 1850000,
    committed: 1720000,
    spent: 1450000,
    projectedIRR: 28.4,
    paybackYears: 2.1,
    status: 'FINAL_COMMISSIONING',
  },
  {
    id: 'CPX-2026-02',
    name: 'Cleanroom Autonomous Guided Vehicles (AGV) Logistics Fleet',
    plant: 'Stuttgart Plant 2',
    budget: 850000,
    committed: 820000,
    spent: 610000,
    projectedIRR: 34.2,
    paybackYears: 1.4,
    status: 'ON_SCHEDULE',
  },
  {
    id: 'CPX-2026-03',
    name: 'Rooftop 2.4MW Solar PV & Tesla Megapack Microgrid',
    plant: 'Austin Plant 1',
    budget: 1200000,
    committed: 1100000,
    spent: 350000,
    projectedIRR: 18.5,
    paybackYears: 4.2,
    status: 'ON_SCHEDULE',
  },
  {
    id: 'CPX-2026-04',
    name: 'High-Temperature Nitrogen Wave Solder Induction Bay',
    plant: 'Singapore Plant 3',
    budget: 650000,
    committed: 650000,
    spent: 120000,
    projectedIRR: 22.1,
    paybackYears: 2.8,
    status: 'BOARD_APPROVED',
  },
];

export default function TopManagementPage() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<'CCC' | 'WATERFALL' | 'DUPONT' | 'CAPEX' | 'APPROVALS'>('CCC');
  const [executiveApprovals, setExecutiveApprovals] = useState<WorkflowItem[]>([]);

  // Strict Top Admin Access Guard
  if (session && session.roleId !== 'super_admin' && !session.originalAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Executive Privilege Required
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto leading-relaxed">
          The Executive Boardroom C-Suite Cockpit is restricted exclusively to <span className="font-semibold text-slate-800 dark:text-slate-200">Top Management (Owner / MD)</span>.
        </p>
        <Link
          href={session.dashboardRoute || '/my-workspace'}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
        >
          Return to My Workspace
        </Link>
      </div>
    );
  }

  useEffect(() => {
    const syncApprovals = () => {
      const items = workflowStore.getAll();
      setExecutiveApprovals(items);
    };
    syncApprovals();
    window.addEventListener('apex_workflow_updated', syncApprovals);
    window.addEventListener('storage', syncApprovals);
    return () => {
      window.removeEventListener('apex_workflow_updated', syncApprovals);
      window.removeEventListener('storage', syncApprovals);
    };
  }, []);

  const handleDecision = (id: string, status: 'APPROVED' | 'REJECTED') => {
    workflowStore.updateStatus(id, status, 'Authorized by Board Executive (Owner/MD)', 'Dr. Rajesh (Owner / MD)');
  };

  // Working Capital Simulator Sliders
  const [targetDsoReduction, setTargetDsoReduction] = useState(3.5); // days
  const [targetDioReduction, setTargetDioReduction] = useState(5.0); // days
  const [targetDpoExtension, setTargetDpoExtension] = useState(4.0); // days

  // Baseline metrics
  const baseDso = 42.1;
  const baseDio = 56.4;
  const baseDpo = 61.8;
  const baseCcc = baseDso + baseDio - baseDpo; // 36.7 days

  const simulatedDso = Math.max(10, baseDso - targetDsoReduction);
  const simulatedDio = Math.max(10, baseDio - targetDioReduction);
  const simulatedDpo = baseDpo + targetDpoExtension;
  const simulatedCcc = simulatedDso + simulatedDio - simulatedDpo;

  // Formula: $148.5M annual revenue -> ~$406.8k revenue per day
  const dailyTurnover = 406849;
  const cashFreedUp = ((baseCcc - simulatedCcc) * dailyTurnover) / 1000000;

  const handleExportBoardBriefing = () => {
    generateAndDownloadWordDoc('Apex_Board_of_Directors_Strategic_Briefing_FY2026_Q3', {
      title: 'BOARD OF DIRECTORS EXECUTIVE BRIEFING & STRATEGIC OPERATIONS DOSSIER',
      documentRef: 'DOC-BOD-2026-Q3-STRAT',
      classification: 'HIGHLY CONFIDENTIAL — BOARD OF DIRECTORS & EXECUTIVE COMMITTEE ONLY',
      department: 'Executive Office of the CEO & CFO',
      author: 'Arthur Pendelton (CEO) & Samantha Sterling (CFO)',
      summary:
        'Comprehensive Q3 fiscal year operational review, working capital liquidity analysis, multi-plant manufacturing EBITDA waterfall reconciliation, DuPont ROE decomposition, and strategic capital expenditure (CapEx) commitments across Austin, Stuttgart, and Singapore manufacturing campuses.',
      sections: [
        {
          heading: 'Executive Financial Summary & Consolidated Performance',
          content: [
            'For the nine-month period ending FY2026 Q3, Apex Manufacturing Technologies consolidated revenue reached $148,500,000, representing an annualized year-over-year expansion of +14.2% driven by robust delivery fulfillment of high-density telecommunication gateway contracts and defense-grade IoT assemblies.',
            'Consolidated Operating EBITDA expanded to $35,900,000, achieving a blended operating margin of 24.17% (+180 basis points ahead of the board-approved target of 22.37%). Gross margins benefited from automated 3-way accounts payable matching and strict scrap minimization programs implemented in Cleanroom Bay 4.',
          ],
          callout: {
            title: 'Q3 Board Milestone Achieved',
            text: 'Working capital optimization initiatives across raw silicon inventory and dynamic supplier payment terms successfully released $3.46M in operational liquidity, maintaining total liquidity reserves above $48.2M.',
            type: 'success',
          },
        },
        {
          heading: 'Working Capital & Cash Conversion Cycle (CCC) Breakdown',
          content: [
            'The Cash Conversion Cycle represents the velocity at which cash invested in direct raw materials transitions through manufacturing work-in-progress into customer cash collections. Formula: CCC = Days Sales Outstanding (DSO) + Days Inventory Outstanding (DIO) - Days Payables Outstanding (DPO).',
          ],
          table: {
            headers: ['Working Capital Metric', 'Q2 Baseline', 'Q3 Current', 'Simulated Target', 'Variance Impact'],
            rows: [
              ['Days Sales Outstanding (DSO)', '45.6 Days', '42.1 Days', '38.6 Days', '-3.5 Days (Frees +$1.42M Cash)'],
              ['Days Inventory Outstanding (DIO)', '61.4 Days', '56.4 Days', '51.4 Days', '-5.0 Days (Frees +$2.03M Cash)'],
              ['Days Payables Outstanding (DPO)', '57.8 Days', '61.8 Days', '65.8 Days', '+4.0 Days (Retains +$1.62M Cash)'],
              ['Net Cash Conversion Cycle (CCC)', '49.2 Days', '36.7 Days', '24.2 Days', '-12.5 Days (-$5.08M Total Working Capital Released)'],
            ],
          },
        },
        {
          heading: 'Consolidated Manufacturing EBITDA Waterfall Bridge',
          content: [
            'The following waterfall bridges Gross Topline Revenue down to Operating EBITDA, isolating direct material absorption, cleanroom factory labor, and facility overhead costs.',
          ],
          table: {
            headers: ['P&L Cost Component', 'Nominal Value (USD)', '% of Gross Revenue', 'Status & Operational Commentary'],
            rows: [
              ['Gross Topline Revenue', '$148,500,000', '100.00%', 'Contracted commercial deliveries across 3 plants'],
              ['Direct Materials COGS (Substrates/ICs)', '-$78,200,000', '52.66%', 'Raw silicon wafers, BGAs, solder paste, passive passives'],
              ['Direct Cleanroom Factory Labor', '-$18,400,000', '12.39%', '1,420 full-time floor technicians across Shifts A/B/C'],
              ['Factory Overhead, Electricity & Nitrogen', '-$8,900,000', '5.99%', 'Ultra-pure N2 purge, high-vacuum pumps, HVAC cleanroom'],
              ['SG&A, Commercial Logistics & Legal', '-$7,100,000', '4.78%', 'Enterprise software, patent filings, global logistics'],
              ['Consolidated Operating EBITDA', '$35,900,000', '24.17%', 'Exceeds EMS global industry median of 18.2%'],
            ],
          },
        },
        {
          heading: 'Multi-Plant Manufacturing Campus Benchmarking',
          content: [
            'Operational benchmarking across our three primary international manufacturing facilities reveals sustained throughput leadership in Austin, solid sensor scaling in Stuttgart, and targeted yield improvement initiatives in Singapore.',
          ],
          table: {
            headers: ['Manufacturing Facility', 'Location', 'Q3 Revenue', 'EBITDA Margin', 'Plant OEE', 'First-Pass Yield (FPY)'],
            rows: [
              ['Austin Flagship Campus', 'Austin, Texas, USA', '$68,400,000', '26.61%', '89.2%', '98.8% (Target Exceeded)'],
              ['Stuttgart Automotive Sensor Hub', 'Stuttgart, Germany', '$49,100,000', '24.03%', '87.5%', '98.4% (IATF 16949 Pass)'],
              ['Singapore Microelectronics Plant', 'Jurong District, Singapore', '$31,000,000', '19.03%', '82.1%', '96.9% (Continuous Kaizen)'],
            ],
          },
        },
        {
          heading: 'DuPont 3-Tier Return on Equity (ROE) Model',
          content: [
            'The DuPont model demonstrates that shareholder value is driven through balanced profitability, asset efficiency, and prudent financial leverage.',
            'Formula: ROE = Net Profit Margin (16.20%) × Asset Turnover Ratio (1.42x) × Financial Leverage Equity Multiplier (1.35x) = 31.05% Return on Equity.',
          ],
          table: {
            headers: ['DuPont Tier', 'Measured Metric', 'Industry Benchmark', 'Performance Assessment'],
            rows: [
              ['Tier 1: Net Profit Margin', '16.20%', '11.40%', 'Top decile operating margin efficiency'],
              ['Tier 2: Asset Turnover Ratio', '1.42x', '1.18x', 'High capital utilization across SMT lines'],
              ['Tier 3: Equity Multiplier', '1.35x', '1.65x', 'Conservative low-debt capital structure'],
              ['Synthesized ROE', '31.05%', '22.20%', 'Significant outperformance vs Peer Group'],
            ],
          },
        },
        {
          heading: 'Strategic Capital Expenditure (CapEx) Commitments',
          content: [
            'The Board has authorized the following high-return capital allocations to maintain technical superiority in high-speed automated electronics placement.',
          ],
          table: {
            headers: ['Project Code & Name', 'Plant Assignment', 'Approved Budget', 'Committed', 'Projected IRR', 'Payback Period'],
            rows: [
              ['CPX-2026-01: SMT Line 4 High-Speed Upgrade', 'Austin Campus', '$1,850,000', '$1,720,000', '28.4%', '2.1 Years'],
              ['CPX-2026-02: Cleanroom AGV Fleet Logistics', 'Stuttgart Hub', '$850,000', '$820,000', '34.2%', '1.4 Years'],
              ['CPX-2026-03: 2.4MW Rooftop Solar PV Microgrid', 'Austin Campus', '$1,200,000', '$1,100,000', '18.5%', '4.2 Years'],
              ['CPX-2026-04: High-Temp Nitrogen Induction Wave', 'Singapore Plant', '$650,000', '$650,000', '22.1%', '2.8 Years'],
            ],
          },
        },
      ],
      signatories: [
        {
          name: 'Arthur Pendelton',
          role: 'Chief Executive Officer (CEO)',
          organization: 'Apex Manufacturing Technologies Corporation',
          signatureDate: 'October 22, 2026',
        },
        {
          name: 'Samantha Sterling',
          role: 'Chief Financial Officer (CFO)',
          organization: 'Apex Manufacturing Technologies Corporation',
          signatureDate: 'October 22, 2026',
        },
        {
          name: 'Alexander Vance',
          role: 'VP Global Operations & Plant Director',
          organization: 'Apex Manufacturing Technologies Corporation',
          signatureDate: 'October 22, 2026',
        },
      ],
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Executive Boardroom & C-Suite Cockpit
            </h1>
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Strategic Cockpit
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Cash Conversion Cycle decomposition, multi-plant EBITDA bridges, DuPont ROE models, and global CapEx allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-lg">
            Fiscal Year: <strong className="text-foreground">FY2026 Q3 YTD</strong>
          </div>
          <button
            onClick={handleExportBoardBriefing}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export Board Briefing (.doc)
          </button>
        </div>
      </div>

      {/* C-Suite Core KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Annualized Net Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">$148.5M</span>
            <span className="text-xs text-emerald-600 ml-2 font-semibold">↑ +14.2% YoY</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">3 global manufacturing plants</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Consolidated EBITDA</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-blue-600">$35.9M</span>
            <span className="text-xs text-muted-foreground ml-2">(24.17% Margin)</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">+180 bps vs target 22.3%</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cash Conversion Cycle</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">{baseCcc.toFixed(1)} Days</span>
            <span className="text-xs text-emerald-600 ml-2 font-semibold">↓ -4.8d faster</span>
          </div>
          <div className="mt-2 text-xs text-purple-600 font-medium">Industry Benchmark: 48.2 Days</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">DuPont ROE Metric</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground">31.0%</span>
            <span className="text-xs text-emerald-600 ml-2 font-semibold">Tier 1 Elite</span>
          </div>
          <div className="mt-2 text-xs text-amber-600 font-medium">Net Margin × Turnover × Leverage</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('CCC')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'CCC'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="w-4 h-4" />
            Cash Conversion Cycle (CCC) Simulator
          </button>
          <button
            onClick={() => setActiveTab('WATERFALL')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'WATERFALL'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Multi-Plant EBITDA Waterfall
          </button>
          <button
            onClick={() => setActiveTab('DUPONT')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'DUPONT'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <PieChart className="w-4 h-4" />
            DuPont ROE Decomposition
          </button>
          <button
            onClick={() => setActiveTab('CAPEX')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'CAPEX'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Global CapEx & ROI Portfolio
          </button>
          <button
            onClick={() => setActiveTab('APPROVALS')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'APPROVALS'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Live Enterprise Approvals ({executiveApprovals.filter(i => i.status === 'PENDING').length})
          </button>
        </nav>
      </div>

      {/* TAB 1: CASH CONVERSION CYCLE */}
      {activeTab === 'CCC' && (
        <div className="space-y-6">
          {/* Formula Breakdown Banner */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground mb-1">Working Capital Engine & Formula Decomposition</h2>
            <p className="text-xs text-muted-foreground mb-6">
              Formula: <span className="font-mono font-bold text-foreground">Cash Conversion Cycle (CCC) = DSO + DIO - DPO</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="border border-border rounded-xl p-4 bg-muted/20 text-center">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Days Sales Outstanding (DSO)</span>
                <div className="text-3xl font-bold text-foreground mt-2">{baseDso.toFixed(1)} Days</div>
                <div className="text-[11px] text-muted-foreground mt-1">Average receivable collection</div>
              </div>

              <div className="text-2xl font-bold text-muted-foreground text-center">+</div>

              <div className="border border-border rounded-xl p-4 bg-muted/20 text-center">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Days Inventory Outstanding (DIO)</span>
                <div className="text-3xl font-bold text-foreground mt-2">{baseDio.toFixed(1)} Days</div>
                <div className="text-[11px] text-muted-foreground mt-1">Raw + WIP + FG turnover</div>
              </div>

              <div className="border border-border rounded-xl p-4 bg-muted/20 text-center">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Days Payables Outstanding (DPO)</span>
                <div className="text-3xl font-bold text-emerald-600 mt-2">-{baseDpo.toFixed(1)} Days</div>
                <div className="text-[11px] text-muted-foreground mt-1">Vendor payment terms leverage</div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase">Net Baseline Cash Conversion Cycle</span>
                <div className="text-2xl font-bold text-foreground">{baseCcc.toFixed(1)} Days to Cash Liquidity</div>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                Every 1.0 day CCC reduction yields <strong className="text-foreground">~$406,850</strong> in operational free cash flow.
              </div>
            </div>
          </div>

          {/* Interactive What-If Simulator */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  Interactive Working Capital "What-If" Sensitivity Simulator
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Adjust target operational optimization levers to see projected free cash release in real-time.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground uppercase">Projected Cash Released</span>
                <div className="text-2xl font-bold text-emerald-600">
                  +${cashFreedUp.toFixed(2)} Million
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">Accelerate DSO Collection</span>
                  <span className="font-bold text-primary">-{targetDsoReduction} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={targetDsoReduction}
                  onChange={(e) => setTargetDsoReduction(parseFloat(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Current: 42.1d</span>
                  <span>Simulated: {simulatedDso.toFixed(1)}d</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">Lean JIT Inventory (DIO)</span>
                  <span className="font-bold text-primary">-{targetDioReduction} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={targetDioReduction}
                  onChange={(e) => setTargetDioReduction(parseFloat(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Current: 56.4d</span>
                  <span>Simulated: {simulatedDio.toFixed(1)}d</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">Extend Vendor DPO Terms</span>
                  <span className="font-bold text-primary">+{targetDpoExtension} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={targetDpoExtension}
                  onChange={(e) => setTargetDpoExtension(parseFloat(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Current: 61.8d</span>
                  <span>Simulated: {simulatedDpo.toFixed(1)}d</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-muted/20 border border-border flex items-center justify-between text-xs">
              <span className="text-foreground font-semibold">
                Simulated Net CCC: <strong className="text-emerald-600 text-sm font-bold">{simulatedCcc.toFixed(1)} Days</strong> ({(baseCcc - simulatedCcc).toFixed(1)} days faster)
              </span>
              <button
                onClick={() => alert(`Saved working capital scenario: Frees up $${cashFreedUp.toFixed(2)}M cash.`)}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
              >
                Commit Plan to Treasury
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WATERFALL */}
      {activeTab === 'WATERFALL' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground mb-1">Corporate EBITDA Waterfall Bridge</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Step-by-step margin reconciliation from Gross Topline Revenue to Net Operating EBITDA.
            </p>

            <div className="space-y-3">
              {[
                { stage: 'Gross Topline Revenue', amount: '+$148,500,000', pct: '100.0%', color: 'bg-emerald-600', isPositive: true },
                { stage: 'Direct Material Raw COGS', amount: '-$78,200,000', pct: '52.65%', color: 'bg-rose-500', isPositive: false },
                { stage: 'Direct Factory Assembly Labor', amount: '-$18,400,000', pct: '12.39%', color: 'bg-rose-500', isPositive: false },
                { stage: 'Plant Overhead, Energy & Nitrogen', amount: '-$8,900,000', pct: '5.99%', color: 'bg-rose-500', isPositive: false },
                { stage: 'SG&A, Logistics & Legal Governance', amount: '-$7,100,000', pct: '4.78%', color: 'bg-rose-500', isPositive: false },
                { stage: 'Consolidated Operating EBITDA', amount: '+$35,900,000', pct: '24.17%', color: 'bg-blue-600', isPositive: true },
              ].map((step, idx) => (
                <div key={idx} className="border border-border rounded-xl p-3 bg-muted/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${step.color}`}></span>
                    <span className="font-semibold text-foreground text-sm">{step.stage}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{step.pct} of Revenue</span>
                    <span className={`font-mono font-bold text-sm ${step.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {step.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plant Performance Table */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Plant-by-Plant Operational EBITDA Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3">Manufacturing Plant</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Revenue</th>
                    <th className="p-3">Operating EBITDA</th>
                    <th className="p-3">Margin %</th>
                    <th className="p-3">Plant OEE</th>
                    <th className="p-3">First Pass Yield</th>
                    <th className="p-3">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PLANT_METRICS.map((plant) => (
                    <tr key={plant.plantName} className="hover:bg-accent/40">
                      <td className="p-3 font-semibold text-foreground">{plant.plantName}</td>
                      <td className="p-3 text-muted-foreground">{plant.location}</td>
                      <td className="p-3 font-bold text-foreground">{plant.revenue}</td>
                      <td className="p-3 font-bold text-emerald-600">{plant.ebitda}</td>
                      <td className="p-3 font-semibold text-foreground">{plant.ebitdaMargin}%</td>
                      <td className="p-3 text-foreground">{plant.oee}%</td>
                      <td className="p-3 text-foreground">{plant.fpy}%</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            plant.status === 'EXCEEDING_TARGET'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : plant.status === 'ON_TRACK'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {plant.status.replace('_', ' ')}
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

      {/* TAB 3: DUPONT */}
      {activeTab === 'DUPONT' && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-1">DuPont 3-Tier Return on Equity (ROE) Model</h2>
            <p className="text-xs text-muted-foreground">
              Decomposes ROE into Profitability, Operational Efficiency, and Financial Leverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border rounded-xl p-5 bg-muted/20 text-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Tier 1: Net Profit Margin</span>
              <div className="text-3xl font-bold text-emerald-600 mt-2">16.2%</div>
              <p className="text-[11px] text-muted-foreground mt-1">Net Income / Total Revenue</p>
              <div className="mt-3 text-xs text-emerald-600 font-medium">Industry Benchmark: 11.4%</div>
            </div>

            <div className="border border-border rounded-xl p-5 bg-muted/20 text-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Tier 2: Asset Turnover Ratio</span>
              <div className="text-3xl font-bold text-blue-600 mt-2">1.42x</div>
              <p className="text-[11px] text-muted-foreground mt-1">Revenue / Average Total Assets</p>
              <div className="mt-3 text-xs text-blue-600 font-medium">Capital intensity optimized</div>
            </div>

            <div className="border border-border rounded-xl p-5 bg-muted/20 text-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Tier 3: Equity Multiplier</span>
              <div className="text-3xl font-bold text-purple-600 mt-2">1.35x</div>
              <p className="text-[11px] text-muted-foreground mt-1">Average Assets / Total Equity</p>
              <div className="mt-3 text-xs text-purple-600 font-medium">Conservative debt leverage</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-blue-500/10 border border-primary/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-primary uppercase">Synthesized Return on Equity</span>
              <div className="text-3xl font-black text-foreground mt-1">31.05% ROE</div>
              <p className="text-xs text-muted-foreground mt-0.5">Top 5th percentile among global Electronics Manufacturing Services (EMS)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 font-bold text-xs">
              Board Approved Target Exceeded
            </span>
          </div>
        </div>
      )}

      {/* TAB 4: CAPEX */}
      {activeTab === 'CAPEX' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Global Capital Expenditure (CapEx) & ROI Portfolio</h2>
                <p className="text-xs text-muted-foreground">Strategic investments in factory robotics, SMT lines, and clean energy.</p>
              </div>
              <button
                onClick={() => alert('Opening new CapEx investment requisition workflow...')}
                className="text-xs font-semibold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/90"
              >
                + New CapEx Requisition
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3">Project Ref & Name</th>
                    <th className="p-3">Target Plant</th>
                    <th className="p-3">Approved Budget</th>
                    <th className="p-3">Committed / Spent</th>
                    <th className="p-3">Projected IRR</th>
                    <th className="p-3">Payback Period</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CAPEX_PROJECTS.map((cp) => (
                    <tr key={cp.id} className="hover:bg-accent/40">
                      <td className="p-3">
                        <div className="font-mono font-bold text-foreground">{cp.id}</div>
                        <div className="font-semibold text-foreground text-sm mt-0.5">{cp.name}</div>
                      </td>
                      <td className="p-3 text-muted-foreground">{cp.plant}</td>
                      <td className="p-3 font-bold text-foreground">${(cp.budget / 1000).toFixed(0)}k</td>
                      <td className="p-3">
                        <div className="text-foreground">${(cp.spent / 1000).toFixed(0)}k spent</div>
                        <div className="text-[10px] text-muted-foreground">
                          ${(cp.committed / 1000).toFixed(0)}k committed
                        </div>
                      </td>
                      <td className="p-3 font-bold text-emerald-600">{cp.projectedIRR}%</td>
                      <td className="p-3 font-medium text-foreground">{cp.paybackYears} Years</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            cp.status === 'FINAL_COMMISSIONING'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-blue-500/10 text-blue-600'
                          }`}
                        >
                          {cp.status.replace('_', ' ')}
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

      {/* TAB 5: ENTERPRISE HIERARCHICAL APPROVALS */}
      {activeTab === 'APPROVALS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-700 dark:text-purple-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>
                <strong>Executive Multi-Signatory Escrow Active:</strong> High-value CapEx requisitions, scrap authorizations, wholesale pricing overrides, and procurement contracts submitted by department leads route here for Board / Owner sign-off.
              </span>
            </div>
            <span className="font-mono text-[10px] bg-purple-500/20 px-2.5 py-1 rounded-full font-bold">
              SOX 404 & ISO 9001 Compliant
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Reference & Category</th>
                    <th className="p-3">Title & Operational Scope</th>
                    <th className="p-3">Submitter / Department</th>
                    <th className="p-3">Exposure / Impact</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Executive Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {executiveApprovals.map((item) => (
                    <tr key={item.id} className="hover:bg-accent/40">
                      <td className="p-3 font-mono font-bold text-foreground">
                        <div>{item.id}</div>
                        <span className="text-[10px] text-purple-600 font-sans font-semibold">
                          {item.category.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 max-w-sm">
                        <div className="font-semibold text-foreground text-sm">{item.title}</div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{item.details.justification}</p>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-foreground">{item.requester.name}</div>
                        <div className="text-[10px] text-muted-foreground">{item.department}</div>
                      </td>
                      <td className="p-3 font-semibold text-foreground">{item.valueOrImpact}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : item.status === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {item.status === 'PENDING' ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleDecision(item.id, 'APPROVED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold shadow-sm cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecision(item.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-semibold shadow-sm cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">
                            Signed by {item.decidedBy || 'Executive'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

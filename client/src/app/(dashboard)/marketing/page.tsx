'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Target,
  BookOpen,
  TrendingUp,
  DollarSign,
  Award,
  Users,
  Eye,
  MousePointerClick,
  Sparkles,
  ArrowUpRight,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  FileText,
  Download,
  Star,
  CheckCircle2,
} from 'lucide-react';
import {
  MarketingOverviewMetrics,
  MarketingCampaignItem,
  CompetitorMarketTrendItem,
  AdvertisingBudgetItem,
  CustomerFeedbackSurveyItem,
  DigitalAssetItem,
} from '@/types/marketing';

const MOCK_METRICS: MarketingOverviewMetrics = {
  totalCampaigns: 12,
  activeCampaigns: 5,
  totalBudgetAllocated: 185000,
  totalActualSpent: 124500,
  totalLeadsGenerated: 94,
  totalPipelineValue: 1450000,
  averageRoiPct: 412.5,
  totalAssetsCount: 28,
  totalAssetDownloads: 1420,
  avgMarketDemandIndex: 82,
  avgCsatScore: 4.8,
  avgBrandPerception: 91.4,
};

const MOCK_ACTIVE_CAMPAIGNS: MarketingCampaignItem[] = [
  {
    id: 'mc-1',
    campaignCode: 'MC-2026-0042',
    name: 'IMTEX 2026 Precision Engineering Expo',
    description: 'Flagship stall exhibition showcasing multi-axis CNC turn-mill capabilities',
    type: 'TRADE_SHOW',
    status: 'ACTIVE',
    startDate: '2026-03-01T00:00:00Z',
    targetAudience: 'Automotive & Aerospace Tier 1 OEMs',
    allocatedBudget: 45000,
    actualSpent: 38200,
    impressions: 18500,
    clicks: 1940,
    leadsGenerated: 34,
    pipelineValueGenerated: 620000,
    roiPercentage: 520,
    channel: 'IMTEX Bangalore Hall 4 Stall B-12',
    leadManager: 'Vikram Sethi',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-05T14:30:00Z',
  },
  {
    id: 'mc-2',
    campaignCode: 'MC-2026-0045',
    name: 'LinkedIn High-Precision Die & Mold B2B Ads',
    description: 'Targeted account-based ad campaign aimed at Plant Directors in Western India',
    type: 'DIGITAL_ADS',
    status: 'ACTIVE',
    startDate: '2026-02-10T00:00:00Z',
    targetAudience: 'Foundry, Forging & Tooling Procurement Heads',
    allocatedBudget: 22000,
    actualSpent: 16800,
    impressions: 48000,
    clicks: 2350,
    leadsGenerated: 26,
    pipelineValueGenerated: 380000,
    roiPercentage: 450,
    channel: 'LinkedIn Sponsored InMail & Sponsored Content',
    leadManager: 'Ananya Roy',
    createdAt: '2026-02-05T11:00:00Z',
    updatedAt: '2026-03-06T09:15:00Z',
  },
  {
    id: 'mc-3',
    campaignCode: 'MC-2026-0048',
    name: 'Aerospace Turbine Machining Technical Webinar',
    description: 'Live interactive technical deep-dive on AS9100D compliant machining tolerances',
    type: 'WEBINAR',
    status: 'ACTIVE',
    startDate: '2026-03-12T00:00:00Z',
    targetAudience: 'Aerospace Components Design & Quality Engineers',
    allocatedBudget: 12000,
    actualSpent: 7500,
    impressions: 12400,
    clicks: 860,
    leadsGenerated: 18,
    pipelineValueGenerated: 250000,
    roiPercentage: 380,
    channel: 'Zoom Webinar + Industry Association Email Blast',
    leadManager: 'Vikram Sethi',
    createdAt: '2026-02-20T16:00:00Z',
    updatedAt: '2026-03-04T12:00:00Z',
  },
];

const MOCK_COMPETITOR_ALERTS: CompetitorMarketTrendItem[] = [
  {
    id: 'trd-1',
    trendCode: 'TRD-260012',
    competitorName: 'Precision Dynamics Corp',
    marketSegment: 'CNC Aluminum Aerospace Housings',
    observedPricePerUnit: 420,
    ourComparablePrice: 460,
    priceVariancePct: -8.7,
    demandIndex: 88,
    impactLevel: 'HIGH',
    marketObservations: 'Competitor undercut by 8.7% utilizing batch import of Korean billet stock. Quality report indicates slight roughness.',
    recommendedStrategy: 'Highlight our NADCAP certification and zero-defect 5-axis single-setup machining.',
    recordedBy: 'Ananya Roy',
    observedAt: '2026-03-04T10:00:00Z',
    createdAt: '2026-03-04T10:00:00Z',
    updatedAt: '2026-03-04T10:00:00Z',
  },
  {
    id: 'trd-2',
    trendCode: 'TRD-260015',
    competitorName: 'Bharat Toolcraft Ltd',
    marketSegment: 'Hardened Steel Injection Molds',
    observedPricePerUnit: 18500,
    ourComparablePrice: 17200,
    priceVariancePct: 7.56,
    demandIndex: 92,
    impactLevel: 'CRITICAL',
    marketObservations: 'Competitor facing 4-week lead time delays. Clients actively seeking fast turnaround alternatives.',
    recommendedStrategy: 'Launch expedited 10-day prototype machining campaign with 5% premium.',
    recordedBy: 'Vikram Sethi',
    observedAt: '2026-03-05T15:20:00Z',
    createdAt: '2026-03-05T15:20:00Z',
    updatedAt: '2026-03-05T15:20:00Z',
  },
];

const MOCK_BUDGETS: AdvertisingBudgetItem[] = [
  {
    id: 'bgt-1',
    budgetId: 'ADV-BGT-26011',
    eventName: 'IMTEX 2026 Prime Island Pavilion Stall',
    category: 'EXPO_STALL',
    proposedAmount: 25000,
    approvedAmount: 25000,
    vendorOrPlatform: 'Bangalore International Exhibition Centre',
    approvalStatus: 'DISBURSED',
    submittedToFinanceAt: '2026-01-20T10:00:00Z',
    approvedByFinance: 'Finance Controller (R. Kulkarni)',
    approvedAt: '2026-01-22T14:00:00Z',
    journalEntryRef: 'JV-2026-0891',
    requestedBy: 'Vikram Sethi',
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-22T14:00:00Z',
  },
  {
    id: 'bgt-2',
    budgetId: 'ADV-BGT-26018',
    eventName: 'Q2 Precision Tooling Catalog Print Run (2,000 Copies)',
    category: 'BROCHURE_PRINTING',
    proposedAmount: 4800,
    approvedAmount: 4500,
    vendorOrPlatform: 'Omega Fine Prints Ltd',
    approvalStatus: 'ACCOUNTS_APPROVED',
    submittedToFinanceAt: '2026-02-25T11:00:00Z',
    approvedByFinance: 'Finance Controller (R. Kulkarni)',
    approvedAt: '2026-02-28T09:30:00Z',
    journalEntryRef: 'JV-2026-0945',
    requestedBy: 'Ananya Roy',
    createdAt: '2026-02-24T12:00:00Z',
    updatedAt: '2026-02-28T09:30:00Z',
  },
  {
    id: 'bgt-3',
    budgetId: 'ADV-BGT-26021',
    eventName: 'Google Search & LinkedIn Ads Q2 Budget',
    category: 'DIGITAL_MEDIA_BUY',
    proposedAmount: 18000,
    approvedAmount: null,
    vendorOrPlatform: 'Google Ads & LinkedIn Business',
    approvalStatus: 'SUBMITTED_TO_ACCOUNTS',
    submittedToFinanceAt: '2026-03-03T16:00:00Z',
    requestedBy: 'Vikram Sethi',
    createdAt: '2026-03-03T15:30:00Z',
    updatedAt: '2026-03-03T16:00:00Z',
  },
];

const MOCK_TOP_ASSETS: DigitalAssetItem[] = [
  {
    id: 'ast-1',
    assetCode: 'MKT-AST-26002',
    title: '5-Axis CNC Milling Capabilities & Tolerance Spec Sheet',
    type: 'TECH_SPEC_SHEET',
    fileUrl: '/specs/cnc-5axis-spec-sheet-v2.pdf',
    fileSizeBytes: 3450000,
    mimeType: 'application/pdf',
    version: 'v2.2',
    isPublic: true,
    partnerAccessAllowed: true,
    downloadCount: 420,
    tags: ['CNC', 'Tolerance', '5-Axis', 'Aerospace'],
    uploadedBy: 'Technical Marketing Team',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'ast-2',
    assetCode: 'MKT-AST-26005',
    title: 'Enterprise Manufacturing Capabilities Comprehensive Brochure 2026',
    type: 'PRODUCT_BROCHURE',
    fileUrl: '/brochures/corporate-manufacturing-2026.pdf',
    fileSizeBytes: 8200000,
    mimeType: 'application/pdf',
    version: 'v1.4',
    isPublic: true,
    partnerAccessAllowed: true,
    downloadCount: 560,
    tags: ['Corporate', 'Brochure', 'Plant Overview'],
    uploadedBy: 'Brand Communications',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'ast-3',
    assetCode: 'MKT-AST-26009',
    title: 'Standard Tooling & Fixture Components CAD Catalog (STEP & IGES)',
    type: 'CAD_CATALOG',
    fileUrl: '/cad/tooling-components-2026.zip',
    fileSizeBytes: 45000000,
    mimeType: 'application/zip',
    version: 'v3.0',
    isPublic: false,
    partnerAccessAllowed: true,
    downloadCount: 195,
    tags: ['CAD', 'STEP', 'Fixtures', 'OEM Partner'],
    uploadedBy: 'Design Engineering',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-03-03T00:00:00Z',
  },
];

export default function MarketingOverviewPage() {
  const [metrics, setMetrics] = useState<MarketingOverviewMetrics>(MOCK_METRICS);
  const [campaigns, setCampaigns] = useState<MarketingCampaignItem[]>(MOCK_ACTIVE_CAMPAIGNS);
  const [trends, setTrends] = useState<CompetitorMarketTrendItem[]>(MOCK_COMPETITOR_ALERTS);
  const [budgets, setBudgets] = useState<AdvertisingBudgetItem[]>(MOCK_BUDGETS);
  const [assets, setAssets] = useState<DigitalAssetItem[]>(MOCK_TOP_ASSETS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [campRes, assetRes, trendRes, budgetRes, feedbackRes] = await Promise.allSettled([
        fetch('/api/v1/marketing/campaigns'),
        fetch('/api/v1/marketing/assets/statistics'),
        fetch('/api/v1/marketing/intelligence/summary'),
        fetch('/api/v1/marketing/budgets/summary'),
        fetch('/api/v1/marketing/feedback/summary'),
      ]);

      if (campRes.status === 'fulfilled' && campRes.value.ok) {
        const campData = await campRes.value.json();
        if (Array.isArray(campData) && campData.length > 0) {
          setCampaigns(campData.slice(0, 5));
        }
      }
    } catch (err) {
      console.warn('Backend API offline, keeping rich sample data', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Marketing Command Center
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Growth Engine
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Demand generation campaigns, B2B lead attribution, competitor pricing intelligence & brand equity
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            Sync Telemetry
          </button>
          <Link
            href="/marketing/campaigns"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New Campaign
          </Link>
          <Link
            href="/marketing/assets"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            Digital Assets
          </Link>
        </div>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Pipeline Value & Lead Generation */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Pipeline Value Generated
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ${(metrics.totalPipelineValue / 1000).toFixed(0)}k
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              <strong className="text-emerald-400 font-semibold">{metrics.totalLeadsGenerated}</strong> Qualified Deals
            </span>
            <span className="text-emerald-400 flex items-center gap-0.5 text-[11px] font-medium">
              <ArrowUpRight className="h-3 w-3" /> +24% QoQ
            </span>
          </div>
        </div>

        {/* Card 2: Marketing ROI & Spend */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Blended Campaign ROI
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {metrics.averageRoiPct}%
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Spent: <strong className="text-white">${(metrics.totalActualSpent / 1000).toFixed(1)}k</strong> / ${(metrics.totalBudgetAllocated / 1000).toFixed(1)}k
            </span>
            <span className="text-slate-400 text-[11px]">
              {Math.round((metrics.totalActualSpent / metrics.totalBudgetAllocated) * 100)}% budget burn
            </span>
          </div>
        </div>

        {/* Card 3: Digital Asset Reach & Engagement */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Digital Specs & Brochures
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {metrics.totalAssetDownloads.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              <strong className="text-white">{metrics.totalAssetsCount}</strong> Active Documents
            </span>
            <span className="text-amber-400 flex items-center gap-0.5 text-[11px] font-medium">
              <Download className="h-3 w-3" /> Downloads
            </span>
          </div>
        </div>

        {/* Card 4: Customer Satisfaction & Brand Equity */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Brand Perception & CSAT
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 flex items-center gap-2">
            <span>{metrics.avgCsatScore}</span>
            <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded ml-auto">
              {metrics.avgBrandPerception}% Equity
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Demand Heat Index: <strong className="text-white">{metrics.avgMarketDemandIndex}/100</strong>
            </span>
            <span className="text-amber-400 flex items-center gap-0.5 text-[11px]">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Top Tier
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Modules Quick Access Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            title: 'Campaigns & Lead Gen',
            desc: 'Multi-channel ads & CRM leads',
            href: '/marketing/campaigns',
            icon: Target,
            badge: `${campaigns.length} Active`,
          },
          {
            title: 'Digital Asset Repo',
            desc: 'Product specs & CAD catalogs',
            href: '/marketing/assets',
            icon: BookOpen,
            badge: `${assets.length} Docs`,
          },
          {
            title: 'Market Intelligence',
            desc: 'Competitor pricing & threats',
            href: '/marketing/intelligence',
            icon: TrendingUp,
            badge: `${trends.length} Alerts`,
          },
          {
            title: 'Advertising Budgets',
            desc: 'Expo stalls & finance sign-off',
            href: '/marketing/budgets',
            icon: DollarSign,
            badge: `${budgets.filter((b) => b.approvalStatus === 'SUBMITTED_TO_ACCOUNTS').length} Pending`,
          },
          {
            title: 'Brand CSAT & Feedback',
            desc: 'OEM satisfaction surveys',
            href: '/marketing/feedback',
            icon: Award,
            badge: '4.8 CSAT',
          },
        ].map((module, i) => {
          const Icon = module.icon;
          return (
            <Link
              key={i}
              href={module.href}
              className="bg-[#0d1322] border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                  {module.badge}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition flex items-center justify-between">
                  {module.title}
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{module.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Two-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active Demand Generation Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Campaigns Panel */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-amber-400" />
                  Active Demand Generation Campaigns
                </h3>
                <p className="text-xs text-slate-400">
                  Performance tracking across trade shows, digital ads, and engineering webinars
                </p>
              </div>
              <Link
                href="/marketing/campaigns"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                View All Campaigns <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded">
                        {camp.campaignCode}
                      </span>
                      <h4 className="text-xs font-bold text-white">{camp.name}</h4>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 self-start">
                      {camp.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3">{camp.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 px-3 rounded-lg bg-[#090d16] border border-slate-800/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Channel</span>
                      <span className="text-slate-200 font-semibold truncate block">{camp.channel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Budget Burn</span>
                      <span className="text-slate-200 font-semibold">
                        ${camp.actualSpent.toLocaleString()} / ${camp.allocatedBudget.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Leads Fed to CRM</span>
                      <span className="text-amber-400 font-bold">
                        {camp.leadsGenerated} Leads (${(camp.pipelineValueGenerated / 1000).toFixed(0)}k val)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Estimated ROI</span>
                      <span className="text-emerald-400 font-bold">+{camp.roiPercentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Pricing Variance Radar */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-rose-400" />
                  Competitor Pricing Variance Radar
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time market price differences & strategic counter-measures
                </p>
              </div>
              <Link
                href="/marketing/intelligence"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Intelligence Desk <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {trends.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{t.competitorName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {t.marketSegment}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          t.impactLevel === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {t.impactLevel} Threat
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">"{t.marketObservations}"</p>
                    {t.recommendedStrategy && (
                      <p className="text-[11px] text-amber-300/90 font-medium">
                        <strong>Counter-Tactic:</strong> {t.recommendedStrategy}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono shrink-0 bg-[#090d16] p-2.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Their Price</span>
                      <span className="text-slate-300 font-bold">${t.observedPricePerUnit}</span>
                    </div>
                    <div className="border-l border-slate-800 pl-3">
                      <span className="text-[9px] text-slate-500 block uppercase">Our Price</span>
                      <span className="text-slate-300 font-bold">${t.ourComparablePrice}</span>
                    </div>
                    <div className="border-l border-slate-800 pl-3">
                      <span className="text-[9px] text-slate-500 block uppercase">Variance</span>
                      <span
                        className={`font-bold ${
                          (t.priceVariancePct || 0) < 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {t.priceVariancePct}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Budgets & Digital Asset Activity */}
        <div className="space-y-6">
          {/* Advertising Budget Approval Gateway */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  Budgets & Finance Approval
                </h3>
                <p className="text-xs text-slate-400">Accounts reconciliation & journal ledger links</p>
              </div>
              <Link
                href="/marketing/budgets"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                Ledger
              </Link>
            </div>

            <div className="space-y-3">
              {budgets.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[160px]">{b.eventName}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        b.approvalStatus === 'DISBURSED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : b.approvalStatus === 'ACCOUNTS_APPROVED'
                          ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {b.approvalStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{b.category.replace(/_/g, ' ')}</span>
                    <span className="font-mono text-white font-bold">
                      ${(b.approvedAmount || b.proposedAmount).toLocaleString()}
                    </span>
                  </div>
                  {b.journalEntryRef && (
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 pt-1 border-t border-slate-800/60">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      GL Linked: <strong className="text-slate-300">{b.journalEntryRef}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Downloaded Digital Assets */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  Top Distributed Assets
                </h3>
                <p className="text-xs text-slate-400">Client brochures, CAD files & spec sheets</p>
              </div>
              <Link
                href="/marketing/assets"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                Browse All
              </Link>
            </div>

            <div className="space-y-3">
              {assets.map((ast) => (
                <div
                  key={ast.id}
                  className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <h5 className="text-xs font-semibold text-white truncate">{ast.title}</h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="text-amber-400 font-mono">{ast.version}</span>
                      <span>•</span>
                      <span>{ast.type.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-white flex items-center gap-1 justify-end">
                      <Download className="h-3 w-3 text-amber-400" /> {ast.downloadCount}
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase">Hits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Sentiment Strengths */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-amber-400" />
              Verified Brand Strengths
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Top attributes recognized by OEM partners in post-delivery satisfaction audits:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Sub-Micron Machining Tolerances',
                'Zero-Defect AS9100D Compliance',
                '99.2% On-Time Dispatch SLA',
                'Responsive Design Engineering Support',
                'Transparent Batch Material Test Reports (MTR)',
              ].map((strength, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-amber-300 font-medium"
                >
                  ✓ {strength}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

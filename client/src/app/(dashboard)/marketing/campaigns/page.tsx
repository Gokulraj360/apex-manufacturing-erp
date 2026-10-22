'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Target,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  MarketingCampaignItem,
  CampaignType,
  CampaignStatus,
} from '@/types/marketing';

const INITIAL_CAMPAIGNS: MarketingCampaignItem[] = [
  {
    id: 'mc-1',
    campaignCode: 'MC-2026-0042',
    name: 'IMTEX 2026 Precision Engineering Expo',
    description: 'Flagship stall exhibition showcasing multi-axis CNC turn-mill capabilities',
    type: 'TRADE_SHOW',
    status: 'ACTIVE',
    startDate: '2026-03-01T00:00:00Z',
    endDate: '2026-03-06T00:00:00Z',
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
    endDate: '2026-04-10T00:00:00Z',
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
    endDate: '2026-03-12T00:00:00Z',
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
  {
    id: 'mc-4',
    campaignCode: 'MC-2026-0051',
    name: 'Heavy Engineering Quarterly Email Nurture',
    description: 'Direct email showcase of heavy CNC gantry capabilities to 450 verified purchase managers',
    type: 'EMAIL_NURTURE',
    status: 'COMPLETED',
    startDate: '2026-01-15T00:00:00Z',
    endDate: '2026-02-28T00:00:00Z',
    targetAudience: 'Heavy Engineering & Energy Sector Clients',
    allocatedBudget: 8000,
    actualSpent: 6200,
    impressions: 22000,
    clicks: 1450,
    leadsGenerated: 16,
    pipelineValueGenerated: 200000,
    roiPercentage: 310,
    channel: 'HubSpot Industrial Automation Sequence',
    leadManager: 'Ananya Roy',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-03-01T15:00:00Z',
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<MarketingCampaignItem[]>(INITIAL_CAMPAIGNS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [selectedCampaignForLead, setSelectedCampaignForLead] = useState<MarketingCampaignItem | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    type: 'DIGITAL_ADS' as CampaignType,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    targetAudience: '',
    allocatedBudget: 15000,
    channel: '',
    leadManager: 'Vikram Sethi',
  });

  const [feedForm, setFeedForm] = useState({
    title: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    estimatedValue: 50000,
    priority: 'HIGH',
    notes: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/marketing/campaigns');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCampaigns(data);
        }
      }
    } catch (err) {
      console.warn('API fetch fallback to sample campaigns', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: MarketingCampaignItem = {
      id: `mc-${Date.now()}`,
      campaignCode: `MC-2026-00${campaigns.length + 50}`,
      name: createForm.name,
      description: createForm.description,
      type: createForm.type,
      status: 'PLANNING',
      startDate: new Date(createForm.startDate).toISOString(),
      endDate: createForm.endDate ? new Date(createForm.endDate).toISOString() : null,
      targetAudience: createForm.targetAudience,
      allocatedBudget: Number(createForm.allocatedBudget),
      actualSpent: 0,
      impressions: 0,
      clicks: 0,
      leadsGenerated: 0,
      pipelineValueGenerated: 0,
      roiPercentage: null,
      channel: createForm.channel,
      leadManager: createForm.leadManager,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/v1/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createForm,
          startDate: new Date(createForm.startDate).toISOString(),
          endDate: createForm.endDate ? new Date(createForm.endDate).toISOString() : undefined,
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setCampaigns([newCamp, ...campaigns]);
    setShowCreateModal(false);
    setNotification(`Campaign '${newCamp.name}' created successfully!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFeedLeadToCrm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignForLead) return;

    try {
      await fetch(`/api/v1/marketing/campaigns/${selectedCampaignForLead.id}/feed-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feedForm,
          estimatedValue: Number(feedForm.estimatedValue),
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    // Update local campaign stats
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === selectedCampaignForLead.id
          ? {
              ...c,
              leadsGenerated: c.leadsGenerated + 1,
              pipelineValueGenerated: c.pipelineValueGenerated + Number(feedForm.estimatedValue),
            }
          : c,
      ),
    );

    setShowFeedModal(false);
    setNotification(
      `Lead '${feedForm.companyName}' ($${Number(feedForm.estimatedValue).toLocaleString()}) successfully routed into CRM pipeline!`,
    );
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.campaignCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/marketing" className="hover:text-amber-600 dark:hover:text-amber-400">
              Marketing
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-800 dark:text-slate-200">Campaigns & Lead Gen</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Demand Generation Campaigns
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  CRM Connected
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track ad reach, event stalls, engineering webinars, and feed qualified leads directly into CRM
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCampaigns}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Launch Campaign
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search campaigns, code, channel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Channel Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Types</option>
              <option value="DIGITAL_ADS">Digital Ads</option>
              <option value="TRADE_SHOW">Trade Show / Expo</option>
              <option value="WEBINAR">Technical Webinar</option>
              <option value="EMAIL_NURTURE">Email Nurture</option>
              <option value="PARTNER_EXPO">Partner Expo</option>
              <option value="DIRECT_MAIL">Direct Mail</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PLANNING">Planning</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredCampaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-amber-500/40 dark:hover:border-amber-500/30 transition flex flex-col justify-between shadow-sm"
          >
            <div>
              {/* Header line */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded">
                      {camp.campaignCode}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {camp.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{camp.name}</h3>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    camp.status === 'ACTIVE'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                      : camp.status === 'COMPLETED'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                  }`}
                >
                  {camp.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{camp.description}</p>

              {/* Target & Channel */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Channel / Venue</span>
                  <span className="text-slate-800 dark:text-slate-300 font-medium truncate block">{camp.channel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Target Audience</span>
                  <span className="text-slate-800 dark:text-slate-300 font-medium truncate block">{camp.targetAudience}</span>
                </div>
              </div>

              {/* Metrics Matrix */}
              <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                    <Eye className="h-3 w-3 text-slate-400" /> Impressions
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block mt-0.5">
                    {camp.impressions.toLocaleString()}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                    <MousePointerClick className="h-3 w-3 text-slate-400" /> Clicks
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block mt-0.5">
                    {camp.clicks.toLocaleString()}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1 font-semibold">
                    <Users className="h-3 w-3" /> CRM Leads
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 block mt-0.5">
                    {camp.leadsGenerated}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1 font-semibold">
                    <DollarSign className="h-3 w-3" /> Pipeline Val
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                    ${(camp.pipelineValueGenerated / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              {/* Budget Progress Bar */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>
                    Spent: <strong className="text-slate-900 dark:text-white">${camp.actualSpent.toLocaleString()}</strong> of $
                    {camp.allocatedBudget.toLocaleString()}
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {Math.round((camp.actualSpent / camp.allocatedBudget) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                    style={{
                      width: `${Math.min(100, (camp.actualSpent / camp.allocatedBudget) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Lead Manager: <strong className="text-slate-700 dark:text-slate-300">{camp.leadManager}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedCampaignForLead(camp);
                    setShowFeedModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-xs font-semibold transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Feed Lead to CRM
                </button>
                <Link
                  href="/crm/leads"
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1.5 rounded transition flex items-center gap-1"
                >
                  CRM Pipeline <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Launch New Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Launch New Demand Generation Campaign
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IMTEX 2026 Machine Tool Expo, LinkedIn Aerospace Campaign"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Objective & Description</label>
                <textarea
                  rows={2}
                  placeholder="Key value proposition and targeted OEMs..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Campaign Type *</label>
                  <select
                    value={createForm.type}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, type: e.target.value as CampaignType })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="DIGITAL_ADS">Digital Ads (LinkedIn/Google)</option>
                    <option value="TRADE_SHOW">Trade Show / Expo Stall</option>
                    <option value="WEBINAR">Technical Engineering Webinar</option>
                    <option value="EMAIL_NURTURE">Email Nurture Sequence</option>
                    <option value="PARTNER_EXPO">Partner Expo</option>
                    <option value="DIRECT_MAIL">Direct Mail Spec Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Allocated Budget ($) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={createForm.allocatedBudget}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, allocatedBudget: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Channel / Venue Specifics *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore BIEC Stall #42, LinkedIn InMail Western India"
                  value={createForm.channel}
                  onChange={(e) => setCreateForm({ ...createForm, channel: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Target Audience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tier-1 Automotive Sourcing Heads"
                    value={createForm.targetAudience}
                    onChange={(e) => setCreateForm({ ...createForm, targetAudience: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Campaign Manager</label>
                  <input
                    type="text"
                    required
                    value={createForm.leadManager}
                    onChange={(e) => setCreateForm({ ...createForm, leadManager: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">End Date (Optional)</label>
                  <input
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-md shadow-amber-600/20 transition"
                >
                  Confirm & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Feed Lead directly to CRM Pipeline */}
      {showFeedModal && selectedCampaignForLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Feed Qualified Lead to CRM Pipeline
                </h3>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-mono mt-0.5">
                  Attributed to: {selectedCampaignForLead.name} ({selectedCampaignForLead.campaignCode})
                </p>
              </div>
              <button onClick={() => setShowFeedModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleFeedLeadToCrm} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Requirement / Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 Sets Precision Machined Titanium Shafts"
                  value={feedForm.title}
                  onChange={(e) => setFeedForm({ ...feedForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bharat Heavy Aerospace Corp"
                    value={feedForm.companyName}
                    onChange={(e) => setFeedForm({ ...feedForm, companyName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Estimated Deal Value ($) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={feedForm.estimatedValue}
                    onChange={(e) =>
                      setFeedForm({ ...feedForm, estimatedValue: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma (Sourcing Mgr)"
                    value={feedForm.contactPerson}
                    onChange={(e) => setFeedForm({ ...feedForm, contactPerson: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. r.sharma@bhacorp.in"
                    value={feedForm.email}
                    onChange={(e) => setFeedForm({ ...feedForm, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={feedForm.phone}
                    onChange={(e) => setFeedForm({ ...feedForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Initial Priority</label>
                  <select
                    value={feedForm.priority}
                    onChange={(e) => setFeedForm({ ...feedForm, priority: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="URGENT">Urgent (Hot Deal)</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Discussion Notes / Inquiry Context</label>
                <textarea
                  rows={2}
                  placeholder="Met at expo booth / interacted during Q&A session..."
                  value={feedForm.notes}
                  onChange={(e) => setFeedForm({ ...feedForm, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFeedModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Route into CRM Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

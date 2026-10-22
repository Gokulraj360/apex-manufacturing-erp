'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Plus,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  X,
  ChevronRight,
  Target,
  Activity,
  Flame,
  Zap,
} from 'lucide-react';
import {
  CompetitorMarketTrendItem,
  TrendImpactLevel,
} from '@/types/marketing';

const INITIAL_TRENDS: CompetitorMarketTrendItem[] = [
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
    marketObservations: 'Competitor undercut our quotation by 8.7% by importing bulk raw material billets from South Korea. Customer reports minor surface roughness variance.',
    recommendedStrategy: 'Emphasize our AS9100D certified single-setup 5-axis machining with Ra 0.4 micron surface finish guarantee and zero setup defect rate.',
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
    marketObservations: 'Competitor facing 4-week delivery delays due to EDM machine downtime. Tier-1 automotive clients actively seeking expedited backup tooling suppliers.',
    recommendedStrategy: 'Launch expedited 10-day mold manufacturing guarantee with 5% priority surcharge to capture high-urgency OEM orders.',
    recordedBy: 'Vikram Sethi',
    observedAt: '2026-03-05T15:20:00Z',
    createdAt: '2026-03-05T15:20:00Z',
    updatedAt: '2026-03-05T15:20:00Z',
  },
  {
    id: 'trd-3',
    trendCode: 'TRD-260018',
    competitorName: 'Apex Machinery Systems (Global)',
    marketSegment: 'Heavy Industrial Reduction Gearboxes',
    observedPricePerUnit: 24500,
    ourComparablePrice: 24000,
    priceVariancePct: 2.08,
    demandIndex: 78,
    impactLevel: 'MEDIUM',
    marketObservations: 'Competitor offering free 1-year annual maintenance contracts (AMC). Client procurement comparing total lifecycle ownership cost.',
    recommendedStrategy: 'Bundle standard 2-year warranty with telemetric vibration sensor monitoring included at parity pricing.',
    recordedBy: 'Vikram Sethi',
    observedAt: '2026-02-26T11:00:00Z',
    createdAt: '2026-02-26T11:00:00Z',
    updatedAt: '2026-02-26T11:00:00Z',
  },
  {
    id: 'trd-4',
    trendCode: 'TRD-260022',
    competitorName: 'TechnoForge India',
    marketSegment: 'Drop-Forged Connecting Rods',
    observedPricePerUnit: 85,
    ourComparablePrice: 92,
    priceVariancePct: -7.61,
    demandIndex: 65,
    impactLevel: 'LOW',
    marketObservations: 'Heavy volume bidding at thin operating margins. High customer scrap rejection rate reported in subsequent induction hardening stage.',
    recommendedStrategy: 'Retain pricing and provide ultrasonic flaw test compliance certificates with 100% metallurgical traceability.',
    recordedBy: 'Ananya Roy',
    observedAt: '2026-02-18T14:30:00Z',
    createdAt: '2026-02-18T14:30:00Z',
    updatedAt: '2026-02-18T14:30:00Z',
  },
];

export default function MarketIntelligencePage() {
  const [trends, setTrends] = useState<CompetitorMarketTrendItem[]>(INITIAL_TRENDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [impactFilter, setImpactFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    competitorName: '',
    marketSegment: '',
    observedPricePerUnit: 500,
    ourComparablePrice: 520,
    demandIndex: 80,
    impactLevel: 'MEDIUM' as TrendImpactLevel,
    marketObservations: '',
    recommendedStrategy: '',
    recordedBy: 'Market Intelligence Unit',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchTrends = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/marketing/intelligence');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTrends(data);
        }
      }
    } catch (err) {
      console.warn('API fallback', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleCreateTrend = async (e: React.FormEvent) => {
    e.preventDefault();

    let variance = 0;
    if (logForm.ourComparablePrice > 0) {
      variance = Number(
        (
          ((logForm.observedPricePerUnit - logForm.ourComparablePrice) / logForm.ourComparablePrice) *
          100
        ).toFixed(2),
      );
    }

    const newTrend: CompetitorMarketTrendItem = {
      id: `trd-${Date.now()}`,
      trendCode: `TRD-2600${trends.length + 30}`,
      competitorName: logForm.competitorName,
      marketSegment: logForm.marketSegment,
      observedPricePerUnit: Number(logForm.observedPricePerUnit),
      ourComparablePrice: Number(logForm.ourComparablePrice),
      priceVariancePct: variance,
      demandIndex: Number(logForm.demandIndex),
      impactLevel: logForm.impactLevel,
      marketObservations: logForm.marketObservations,
      recommendedStrategy: logForm.recommendedStrategy,
      recordedBy: logForm.recordedBy,
      observedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/v1/marketing/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logForm),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setTrends([newTrend, ...trends]);
    setShowLogModal(false);
    setNotification(`Market intelligence alert [${newTrend.trendCode}] logged successfully!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredTrends = trends.filter((t) => {
    const matchesSearch =
      t.competitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.marketSegment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.trendCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.marketObservations.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesImpact = impactFilter === 'ALL' || t.impactLevel === impactFilter;

    return matchesSearch && matchesImpact;
  });

  const criticalCount = trends.filter((t) => t.impactLevel === 'CRITICAL').length;
  const highCount = trends.filter((t) => t.impactLevel === 'HIGH').length;
  const avgDemand =
    trends.length > 0
      ? Math.round(trends.reduce((sum, t) => sum + t.demandIndex, 0) / trends.length)
      : 80;

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
            <span className="text-slate-800 dark:text-slate-200">Competitor & Market Trends</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Competitor & Market Intelligence Center
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                  {criticalCount + highCount} Active Threats
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track competitor bidding tactics, raw material undercutting, demand heat index & counter-strategies
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTrends}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
            Sync Intelligence
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Market Observation
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Monitored Trends</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{trends.length} Records</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Live competitor price points</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-rose-600 dark:text-rose-400 block font-medium">Critical / High Threats</span>
          <span className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
            {criticalCount + highCount} Alerts
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Immediate counter-measures needed</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-amber-600 dark:text-amber-400 block font-medium">Market Demand Index</span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-300 mt-1 block">{avgDemand} / 100</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Strong industrial order demand</span>
        </div>

        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-medium">Avg Price Competitiveness</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">±3.8% Band</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Within optimal win-margin buffer</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search competitor, segment, tactics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Threat Severity:</span>
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Threat Levels</option>
              <option value="CRITICAL">Critical Threat</option>
              <option value="HIGH">High Threat</option>
              <option value="MEDIUM">Medium Threat</option>
              <option value="LOW">Low Threat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Trends List */}
      <div className="space-y-4">
        {filteredTrends.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-amber-500/40 dark:hover:border-amber-500/30 transition space-y-4 shadow-sm"
          >
            {/* Top row: Competitor, segment, threat badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded">
                  {t.trendCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.competitorName}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {t.marketSegment}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    t.impactLevel === 'CRITICAL'
                      ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                      : t.impactLevel === 'HIGH'
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <ShieldAlert className="h-3 w-3" /> {t.impactLevel} Threat
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Observed: {new Date(t.observedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Pricing Comparison Bar & Demand Index */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Competitor Quote</span>
                <span className="text-base font-mono font-bold text-slate-800 dark:text-slate-200">
                  ${t.observedPricePerUnit?.toLocaleString()} / unit
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Our Benchmark Price</span>
                <span className="text-base font-mono font-bold text-slate-900 dark:text-white">
                  ${t.ourComparablePrice?.toLocaleString()} / unit
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Price Variance</span>
                <span
                  className={`text-base font-mono font-bold flex items-center gap-1 ${
                    (t.priceVariancePct || 0) < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {(t.priceVariancePct || 0) < 0 ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                  {t.priceVariancePct}%
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                    {(t.priceVariancePct || 0) < 0 ? '(Undercut)' : '(Our Premium)'}
                  </span>
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium mb-1">
                  <span>Segment Demand</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{t.demandIndex}/100</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                    style={{ width: `${t.demandIndex}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Field Observations & Counter-Strategy */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                  Field Observations & Intelligence:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{t.marketObservations}</p>
              </div>

              {t.recommendedStrategy && (
                <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block mb-0.5 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Recommended Counter-Strategy:
                  </span>
                  <p className="text-amber-900 dark:text-amber-200/90 font-medium leading-relaxed">
                    {t.recommendedStrategy}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/60">
              <span>
                Intelligence Analyst: <strong className="text-slate-700 dark:text-slate-400">{t.recordedBy}</strong>
              </span>
              <span className="font-mono text-[10px]">
                System Log ID: {t.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Log Market Trend */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Log Competitor Market Observation
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrend} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Competitor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Precision Dynamics Corp"
                    value={logForm.competitorName}
                    onChange={(e) => setLogForm({ ...logForm, competitorName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Market Segment *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5-Axis Aerospace Housings"
                    value={logForm.marketSegment}
                    onChange={(e) => setLogForm({ ...logForm, marketSegment: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Competitor Unit Price ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={logForm.observedPricePerUnit}
                    onChange={(e) =>
                      setLogForm({ ...logForm, observedPricePerUnit: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Our Comparable Price ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={logForm.ourComparablePrice}
                    onChange={(e) =>
                      setLogForm({ ...logForm, ourComparablePrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">
                    Segment Demand Index: {logForm.demandIndex}/100
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={logForm.demandIndex}
                    onChange={(e) => setLogForm({ ...logForm, demandIndex: Number(e.target.value) })}
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Threat Level *</label>
                  <select
                    value={logForm.impactLevel}
                    onChange={(e) =>
                      setLogForm({ ...logForm, impactLevel: e.target.value as TrendImpactLevel })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="CRITICAL">Critical Threat (Action Required)</option>
                    <option value="HIGH">High Threat</option>
                    <option value="MEDIUM">Medium Threat</option>
                    <option value="LOW">Low Threat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Field Observations *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detailed pricing notes, delivery lead time insights, client feedback..."
                  value={logForm.marketObservations}
                  onChange={(e) => setLogForm({ ...logForm, marketObservations: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Recommended Counter-Strategy</label>
                <textarea
                  rows={2}
                  placeholder="Action items for sales team or marketing positioning..."
                  value={logForm.recommendedStrategy}
                  onChange={(e) => setLogForm({ ...logForm, recommendedStrategy: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-md shadow-amber-600/20 transition"
                >
                  Log Market Intelligence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  Target,
  Award,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  ChevronRight,
  Filter,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

const FUNNEL_STAGES = [
  { stage: 'Discovery & Feasibility', count: 32, value: 1420000, conversionPct: 100, barWidth: 'w-full', color: 'from-blue-500 to-indigo-500' },
  { stage: 'Technical & Drawing Evaluation', count: 26, value: 1160000, conversionPct: 81.2, barWidth: 'w-[81%]', color: 'from-indigo-500 to-purple-500' },
  { stage: 'Quotation Submitted (Cost Basis)', count: 21, value: 965000, conversionPct: 65.6, barWidth: 'w-[66%]', color: 'from-purple-500 to-pink-500' },
  { stage: 'Commercial Negotiation', count: 16, value: 760000, conversionPct: 50.0, barWidth: 'w-[50%]', color: 'from-pink-500 to-rose-500' },
  { stage: 'Contract & Legal Review', count: 13, value: 590000, conversionPct: 40.6, barWidth: 'w-[41%]', color: 'from-rose-500 to-orange-500' },
  { stage: 'Closed Won (In Production)', count: 11, value: 480000, conversionPct: 34.4, barWidth: 'w-[34%]', color: 'from-emerald-500 to-teal-500' },
];

const SALES_REPS_LEADERBOARD = [
  {
    name: 'Vikram Sethi',
    role: 'Senior Enterprise Account Director',
    activeDeals: 12,
    wonDeals: 10,
    totalBookings: 1090000,
    winRatePct: 76.9,
    avgCycleDays: 19,
    quotaAttainmentPct: 128,
  },
  {
    name: 'Ananya Sharma',
    role: 'Aerospace & Heavy Engineering Specialist',
    activeDeals: 9,
    wonDeals: 7,
    totalBookings: 745000,
    winRatePct: 70.0,
    avgCycleDays: 24,
    quotaAttainmentPct: 112,
  },
  {
    name: 'Rohan Mehra',
    role: 'Industrial Enclosures & Sheet Metal Rep',
    activeDeals: 11,
    wonDeals: 7,
    totalBookings: 465000,
    winRatePct: 63.6,
    avgCycleDays: 16,
    quotaAttainmentPct: 98,
  },
];

const INDUSTRY_REVENUE_SHARE = [
  { industry: 'Automotive & Heavy Electric Vehicles', revenue: 980000, sharePct: 42, color: 'bg-pink-500' },
  { industry: 'Heavy Engineering & Defense Equipment', revenue: 720000, sharePct: 31, color: 'bg-purple-500' },
  { industry: 'Electrical Enclosures & Power Automation', revenue: 350000, sharePct: 15, color: 'bg-cyan-500' },
  { industry: 'Commercial Transport & Freight Axles', revenue: 280000, sharePct: 12, color: 'bg-amber-500' },
];

const QUARTERLY_FORECAST = [
  { quarter: 'Q3 2026 (Actual)', committedRev: 980000, weightedPipeline: 980000, accuracyPct: 98 },
  { quarter: 'Q4 2026 (Forecast)', committedRev: 850000, weightedPipeline: 1120000, accuracyPct: 94 },
  { quarter: 'Q1 2027 (Forecast)', committedRev: 620000, weightedPipeline: 950000, accuracyPct: 89 },
  { quarter: 'Q2 2027 (Forecast)', committedRev: 450000, weightedPipeline: 780000, accuracyPct: 85 },
];

export default function CRMAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'FY26' | 'H2_2026' | 'Q3_2026'>('FY26');

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Commercial Intelligence
            </span>
            <span className="text-xs text-slate-500">Pipeline Velocity & Forecasting Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            CRM Analytics, Forecasting & Rep Leaderboard
          </h1>
          <p className="text-sm text-slate-400">
            Analyze stage-by-stage sales funnel velocity, quota attainment, multi-quarter production forecasts, and client lifetime revenue.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0d1322] p-1 rounded-xl border border-slate-800">
          {(['FY26', 'H2_2026', 'Q3_2026'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {period.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Sales Win Rate</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">72.4%</div>
            <div className="text-xs text-emerald-400/80 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +5.8% above manufacturing benchmark
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Avg Deal Velocity (Cycle)</div>
            <div className="text-2xl font-bold text-white mt-1">19.5 Days</div>
            <div className="text-xs text-cyan-400 mt-1">From initial RFQ to signed PO</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Annualized Revenue Run Rate</div>
            <div className="text-2xl font-bold text-white mt-1">$3,850,000</div>
            <div className="text-xs text-purple-400 mt-1">Committed contracts + spot batches</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Client Retention (LTV)</div>
            <div className="text-2xl font-bold text-pink-400 mt-1">94.8%</div>
            <div className="text-xs text-slate-400 mt-1">High reorder repeat rate</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SECTION 1: SALES FUNNEL CONVERSION */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-pink-400" />
              End-to-End Pipeline Conversion Funnel
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Attrition & velocity analysis across technical qualification, cost estimation, and commercial contracts.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            34.4% Overall Win Conversion
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {FUNNEL_STAGES.map((stg, idx) => (
            <div key={idx} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{stg.stage}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400">{stg.count} deals</span>
                  <span className="text-white font-bold">${stg.value.toLocaleString()}</span>
                  <span className="text-pink-400 font-semibold w-12 text-right">
                    {stg.conversionPct}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#090d16] h-3 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className={`bg-gradient-to-r ${stg.color} h-full rounded-full transition-all duration-700`}
                  style={{ width: `${stg.conversionPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: LEADERBOARD & INDUSTRY REVENUE SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Rep Leaderboard (2 Cols) */}
        <div className="lg:col-span-2 bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-pink-400" />
                  Sales Representative Performance Leaderboard
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Quota attainment, win rates, and booking totals.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="p-3">Representative</th>
                    <th className="p-3">Active Deals</th>
                    <th className="p-3">Won Bookings</th>
                    <th className="p-3">Win Rate</th>
                    <th className="p-3">Avg Cycle</th>
                    <th className="p-3 text-right">Quota Met</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {SALES_REPS_LEADERBOARD.map((rep, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-white">{rep.name}</div>
                        <div className="text-[11px] text-slate-400">{rep.role}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-300">{rep.activeDeals} deals</td>
                      <td className="p-3 font-mono font-bold text-white">
                        ${rep.totalBookings.toLocaleString()}
                        <div className="text-[10px] text-emerald-400 font-normal">
                          {rep.wonDeals} deals closed
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-emerald-400">{rep.winRatePct}%</span>
                      </td>
                      <td className="p-3 font-mono text-cyan-400">{rep.avgCycleDays} days</td>
                      <td className="p-3 text-right">
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                            rep.quotaAttainmentPct >= 100
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {rep.quotaAttainmentPct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-[#090d16] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Commission incentive threshold: 100% quota attainment</span>
            <Link href="/crm/leads" className="text-pink-400 hover:underline flex items-center gap-1 font-medium">
              View Deal Assignments <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Industry Revenue Share (1 Col) */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-pink-400" />
              Revenue by Industry Sector
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Manufacturing vertical breakdown.</p>
          </div>

          <div className="space-y-3 pt-1">
            {INDUSTRY_REVENUE_SHARE.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium truncate max-w-[200px]">
                    {item.industry}
                  </span>
                  <span className="font-mono text-white font-bold">{item.sharePct}%</span>
                </div>
                <div className="w-full bg-[#090d16] h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`${item.color} h-full rounded-full`}
                    style={{ width: `${item.sharePct}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  ${item.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: MULTI-QUARTER REVENUE & CAPACITY FORECAST */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              Multi-Quarter Sales Forecasting & Production Capacity Load
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison of legally committed contract baselines versus probability-weighted pipeline opportunities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          {QUARTERLY_FORECAST.map((q, idx) => (
            <div
              key={idx}
              className="bg-[#090d16] border border-slate-800 p-4 rounded-xl space-y-3 hover:border-pink-500/30 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{q.quarter}</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  {q.accuracyPct}% Conf.
                </span>
              </div>

              <div className="space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Committed Baseline:</span>
                  <span className="text-white font-bold">${q.committedRev.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Weighted Pipeline:</span>
                  <span className="text-pink-400 font-bold">${q.weightedPipeline.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                Machine capacity reservation: <span className="text-emerald-400 font-semibold">Healthy</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

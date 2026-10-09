'use client';

import React, { useState } from 'react';
import {
  Activity,
  Zap,
  Clock,
  Star,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  ShieldCheck,
  MapPin,
  Flame,
  Layers,
  PieChart,
} from 'lucide-react';
import { FieldServiceOverviewMetrics } from '@/types/field-service';

interface TerritoryMetric {
  territory: string;
  jobsCompleted: number;
  avgResolutionHours: number;
  ftfrRate: number;
  csatScore: number;
  costPerJob: number;
}

interface EquipmentFailureMetric {
  machineModel: string;
  totalFailures: number;
  primaryRootCause: string;
  avgDowntimeHours: number;
  warrantyVsAmc: string;
}

interface TechnicianLeaderboardItem {
  name: string;
  code: string;
  territory: string;
  jobsCompleted: number;
  ftfrRate: number;
  csatScore: number;
  rank: number;
}

const MOCK_METRICS: FieldServiceOverviewMetrics = {
  totalTicketsCount: 142,
  openTicketsCount: 18,
  criticalDownCount: 3,
  activeEngineersCount: 14,
  activeAMCContractsCount: 68,
  activeWarrantiesCount: 112,
  pendingPartsRequisitionCount: 5,
  firstTimeFixRate: 94.2,
  averageResolutionHours: 3.4,
  customerSatisfactionRating: 4.8,
  totalServiceCost: 48920,
  vanStockReplenishmentHealth: 98.5,
};

const MOCK_TERRITORIES: TerritoryMetric[] = [
  {
    territory: 'Bengaluru Tech Corridor',
    jobsCompleted: 34,
    avgResolutionHours: 2.7,
    ftfrRate: 97.2,
    csatScore: 5.0,
    costPerJob: 280,
  },
  {
    territory: 'Aurangabad & Jalna',
    jobsCompleted: 26,
    avgResolutionHours: 2.9,
    ftfrRate: 96.0,
    csatScore: 4.9,
    costPerJob: 310,
  },
  {
    territory: 'Pune Industrial Belt',
    jobsCompleted: 48,
    avgResolutionHours: 3.2,
    ftfrRate: 95.1,
    csatScore: 4.9,
    costPerJob: 345,
  },
  {
    territory: 'Delhi NCR & Manesar',
    jobsCompleted: 38,
    avgResolutionHours: 3.6,
    ftfrRate: 93.8,
    csatScore: 4.7,
    costPerJob: 390,
  },
  {
    territory: 'Chennai Automotive Corridor',
    jobsCompleted: 31,
    avgResolutionHours: 3.8,
    ftfrRate: 92.5,
    csatScore: 4.6,
    costPerJob: 410,
  },
];

const MOCK_EQUIPMENT_FAILURES: EquipmentFailureMetric[] = [
  {
    machineModel: 'CNC Hydraulic Press 500T (HP-500)',
    totalFailures: 14,
    primaryRootCause: 'Main cylinder ram seal extrusion due to contaminated ISO 46 hydraulic fluid',
    avgDowntimeHours: 4.1,
    warrantyVsAmc: 'Warranty (OEM 24M)',
  },
  {
    machineModel: '5-Axis CNC Machining Center (VMC-850)',
    totalFailures: 11,
    primaryRootCause: 'Optical rotary encoder communication loss & vibration harmonic drift',
    avgDowntimeHours: 3.5,
    warrantyVsAmc: 'AMC Comprehensive',
  },
  {
    machineModel: 'Automated Laser Cutting Cell 4kW (ALC-4000)',
    totalFailures: 8,
    primaryRootCause: 'Fiber optic collimator thermal defocusing & assist gas pressure drop',
    avgDowntimeHours: 2.9,
    warrantyVsAmc: 'AMC Comprehensive',
  },
  {
    machineModel: 'Automatic Die Lubrication Robot (ADL-200)',
    totalFailures: 7,
    primaryRootCause: 'Axis 3 servo motor cable harness flex fatigue',
    avgDowntimeHours: 3.1,
    warrantyVsAmc: 'Warranty (OEM 12M)',
  },
  {
    machineModel: 'SMT Pick-and-Place Feeder Master (PPF-90)',
    totalFailures: 5,
    primaryRootCause: 'Vacuum nozzle micro-orifice clogging & timing belt tension loss',
    avgDowntimeHours: 2.2,
    warrantyVsAmc: 'AMC Routine PM',
  },
];

const MOCK_LEADERBOARD: TechnicianLeaderboardItem[] = [
  {
    rank: 1,
    name: 'Ananya Verma',
    code: 'FSE-112',
    territory: 'Bengaluru Tech Corridor',
    jobsCompleted: 119,
    ftfrRate: 97.2,
    csatScore: 5.0,
  },
  {
    rank: 2,
    name: 'Kiran Deshmukh',
    code: 'FSE-108',
    territory: 'Aurangabad & Jalna',
    jobsCompleted: 98,
    ftfrRate: 96.0,
    csatScore: 4.9,
  },
  {
    rank: 3,
    name: 'Vikram Jadhav',
    code: 'FSE-101',
    territory: 'Pune Industrial Belt',
    jobsCompleted: 184,
    ftfrRate: 95.1,
    csatScore: 4.9,
  },
  {
    rank: 4,
    name: 'Rohit Sharma',
    code: 'FSE-104',
    territory: 'Delhi NCR & Manesar',
    jobsCompleted: 142,
    ftfrRate: 93.8,
    csatScore: 4.7,
  },
  {
    rank: 5,
    name: 'Suresh Pillai',
    code: 'FSE-115',
    territory: 'Chennai Automotive Corridor',
    jobsCompleted: 167,
    ftfrRate: 92.5,
    csatScore: 4.6,
  },
];

export default function FieldAnalyticsPage() {
  const [metrics] = useState<FieldServiceOverviewMetrics>(MOCK_METRICS);
  const [territories] = useState<TerritoryMetric[]>(MOCK_TERRITORIES);
  const [equipmentFailures] = useState<EquipmentFailureMetric[]>(MOCK_EQUIPMENT_FAILURES);
  const [leaderboard] = useState<TechnicianLeaderboardItem[]>(MOCK_LEADERBOARD);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Activity className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Field Service Analytics, FTFR & Quality Scorecards
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            First-Time Fix Rates (FTFR), Mean Time to Resolution (MTTR), client CSAT indices, and component failure root-cause analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            SLA Compliance: 97.4%
          </span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: FTFR */}
        <div className="p-5 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              First-Time Fix Rate (FTFR)
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-400">{metrics.firstTimeFixRate}%</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5" /> +2.8%
            </span>
            <span>vs Industry Benchmark (90%)</span>
          </div>
        </div>

        {/* Card 2: MTTR */}
        <div className="p-5 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Mean Time to Resolution (MTTR)
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{metrics.averageResolutionHours} hrs</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center">
              <ArrowDownRight className="h-3.5 w-3.5" /> -32 mins
            </span>
            <span>faster resolution speed</span>
          </div>
        </div>

        {/* Card 3: CSAT */}
        <div className="p-5 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Customer Satisfaction (CSAT)
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-400">{metrics.customerSatisfactionRating} / 5.0</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">96.4%</span>
            <span>5-star feedback rating</span>
          </div>
        </div>

        {/* Card 4: Service Costs */}
        <div className="p-5 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Service & Spares Cost
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">${metrics.totalServiceCost.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-purple-400 font-semibold">72%</span>
            <span>recovered via AMC/Paid jobs</span>
          </div>
        </div>
      </div>

      {/* Grid: Territory Efficiency & Cost Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Territory Matrix */}
        <div className="lg:col-span-2 rounded-xl bg-[#0d1322] border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">Territory Resolution Performance</h3>
                <p className="text-[11px] text-slate-400">Comparing regional dispatch hubs by speed, FTFR, and unit costs</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Industrial Corridor</th>
                  <th className="py-2.5 px-3">Jobs Done</th>
                  <th className="py-2.5 px-3">Avg Resolution</th>
                  <th className="py-2.5 px-3">FTFR %</th>
                  <th className="py-2.5 px-3">CSAT Rating</th>
                  <th className="py-2.5 px-3 text-right">Cost / Job</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-normal">
                {territories.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-medium text-white flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                      {t.territory}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{t.jobsCompleted}</td>
                    <td className="py-3 px-3">{t.avgResolutionHours} hrs</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">{t.ftfrRate}%</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-amber-400 font-medium">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>{t.csatScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-200">
                      ${t.costPerJob}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Service Cost Breakdown */}
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <PieChart className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Cost Distribution</h3>
              <p className="text-[11px] text-slate-400">Total expenditure allocation ($48,920)</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-medium">Replacement Spares & Components</span>
                <span className="font-bold text-white">$27,395 (56%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '56%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-medium">Technician Labor & Overtime</span>
                <span className="font-bold text-white">$14,676 (30%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-medium">Van Fleet Fuel & Highway Tolls</span>
                <span className="font-bold text-white">$6,849 (14%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-200">Cost Recovery Insight:</div>
            <p>
              Comprehensive AMC contracts absorbed $35,200 in expenses. Zero bill disputes registered this quarter.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Failure Root Cause Analysis & Technician Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Failure Root Cause Analysis */}
        <div className="lg:col-span-2 rounded-xl bg-[#0d1322] border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">Equipment Breakdown & Failure Root Cause Analysis</h3>
                <p className="text-[11px] text-slate-400">High-frequency machine issues driving customer line-stops</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {equipmentFailures.map((eq, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">{eq.machineModel}</div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {eq.totalFailures} Breakdowns
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      {eq.warrantyVsAmc}
                    </span>
                  </div>
                </div>

                <div className="text-slate-300 text-[11px] flex items-start gap-1.5">
                  <span className="text-rose-400 font-semibold shrink-0">Root Cause:</span>
                  <span>{eq.primaryRootCause}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Avg Site Downtime: <strong className="text-amber-400">{eq.avgDowntimeHours} hours</strong></span>
                  <span className="text-emerald-400 font-medium">Preventive redesign advisory sent to R&D</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technician Leaderboard */}
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Technician Leaderboard</h3>
              <p className="text-[11px] text-slate-400">Top performers in FTFR & CSAT</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((tech) => (
              <div
                key={tech.code}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      tech.rank === 1
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                        : tech.rank === 2
                        ? 'bg-slate-300 text-black'
                        : tech.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    #{tech.rank}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{tech.name}</div>
                    <div className="text-[10px] text-slate-400">{tech.territory}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-emerald-400">{tech.ftfrRate}% FTFR</div>
                  <div className="text-[10px] text-amber-400 flex items-center justify-end gap-1 mt-0.5">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span>{tech.csatScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

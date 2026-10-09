'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Calculator,
  BadgeCheck,
  Headphones,
  Activity,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowUpRight,
  FileText,
  PackageCheck,
  Target,
  BarChart3,
} from 'lucide-react';
import {
  CRMOverviewMetrics,
  LeadItem,
  QuotationItem,
  SalesOrderCRMItem,
  CustomerInquiryItem,
} from '@/types/crm';

const MOCK_METRICS: CRMOverviewMetrics = {
  activeLeadsCount: 32,
  totalPipelineValue: 1420000,
  wonDealsCount: 24,
  totalWonRevenue: 980000,
  conversionRatePct: 72.4,
  averageDealSize: 40800,
  clientRetentionRatePct: 94.8,
  averageNPS: 9.2,
  totalClientsCount: 46,
};

const MOCK_HIGH_VALUE_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    leadNumber: 'LEAD-2026-0182',
    title: 'High-Precision Transmission Gearboxes (1,200 Units/Quarter)',
    companyName: 'Mahindra Heavy Electric Vehicles',
    contactPerson: 'Sandeep Deshmukh (VP Sourcing)',
    email: 'sandeep.d@mahindrahev.com',
    phone: '+91 98220 44551',
    source: 'REFERRAL',
    priority: 'URGENT',
    stage: 'COMMERCIAL_NEGOTIATION',
    estimatedValue: 240000,
    expectedCloseDate: '2026-10-15',
    assignedSalesRep: 'Vikram Sethi',
    technicalRequirementSummary: 'Hardened forged alloy steel gears with ISO 1328 Grade 5 accuracy.',
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'lead-2',
    leadNumber: 'LEAD-2026-0185',
    title: 'Hydraulic Cylinder Rods & Ram Assemblies (Batch 500)',
    companyName: 'Larsen & Toubro Heavy Equipment',
    contactPerson: 'Anjali Menon (Commercial Procurement)',
    email: 'anjali.m@larsentoubro.com',
    phone: '+91 98401 22334',
    source: 'TRADE_SHOW',
    priority: 'HIGH',
    stage: 'QUOTATION_SUBMITTED',
    estimatedValue: 185000,
    expectedCloseDate: '2026-10-22',
    assignedSalesRep: 'Ananya Sharma',
    technicalRequirementSummary: 'Hard chrome plated EN8D rods with micro-crack corrosion barrier.',
    createdAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'lead-3',
    leadNumber: 'LEAD-2026-0189',
    title: 'Laser Cut Sheet Metal Electrical Enclosures 4kW',
    companyName: 'Schneider Electric Industrial India',
    contactPerson: 'Praveen Kulkarni',
    email: 'praveen.k@schneider.in',
    phone: '+91 98112 55667',
    source: 'INBOUND_WEB',
    priority: 'MEDIUM',
    stage: 'TECHNICAL_EVALUATION',
    estimatedValue: 95000,
    expectedCloseDate: '2026-10-28',
    assignedSalesRep: 'Rohan Mehra',
    technicalRequirementSummary: 'IP66 rated outdoor enclosures with powder coated CRCA sheet 2.5mm.',
    createdAt: '2026-10-02T11:15:00Z',
  },
];

const MOCK_RECENT_WON_ORDERS: SalesOrderCRMItem[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-CRM-2026-0142',
    clientId: 'cli-1',
    client: {
      id: 'cli-1',
      clientCode: 'CLI-IND-0012',
      companyName: 'Bharat Forge Precision Division',
      industry: 'Automotive & Heavy Forging',
      primaryContactName: 'Rajesh Varma',
      email: 'rajesh.v@bharatforge.com',
      phone: '+91 98200 11223',
      billingAddress: 'Mundhwa Industrial Area, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      creditLimit: 150000,
      paymentTerms: 'NET_30',
      totalLifetimeSpend: 420000,
      accountManager: 'Vikram Sethi',
      isActive: true,
    },
    clientPoNumber: 'BF-PO-2026-8812',
    orderDate: '2026-10-04',
    targetDeliveryDate: '2026-10-31',
    status: 'SCHEDULED_FOR_PRODUCTION',
    currency: 'USD',
    totalAmount: 118000,
    productionScheduleLinked: true,
    productionWorkOrderRef: 'WO-2026-0941',
    shippingAddress: 'Plant #2 Gate 4, Mundhwa, Pune',
    salesRep: 'Vikram Sethi',
    lineItems: [
      {
        itemSku: 'FORG-SHAFT-CNC-80',
        itemName: 'Precision Crankshaft Blanks 80mm',
        orderedQty: 500,
        unitPrice: 236,
        lineTotal: 118000,
      },
    ],
  },
  {
    id: 'so-2',
    orderNumber: 'SO-CRM-2026-0144',
    clientId: 'cli-2',
    client: {
      id: 'cli-2',
      clientCode: 'CLI-IND-0019',
      companyName: 'Tata AutoComp Systems Ltd',
      industry: 'Automotive Components',
      primaryContactName: 'Kishore Nair',
      email: 'k.nair@tataautocomp.com',
      phone: '+91 98210 33445',
      billingAddress: 'Hinjawadi Phase 2, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      creditLimit: 100000,
      paymentTerms: 'NET_45',
      totalLifetimeSpend: 290000,
      accountManager: 'Ananya Sharma',
      isActive: true,
    },
    clientPoNumber: 'TAC-PO-4419',
    orderDate: '2026-10-05',
    targetDeliveryDate: '2026-11-08',
    status: 'CONFIRMED',
    currency: 'USD',
    totalAmount: 84000,
    productionScheduleLinked: true,
    productionWorkOrderRef: 'WO-2026-0945',
    shippingAddress: 'Chakan Assembly Plant, Pune',
    salesRep: 'Ananya Sharma',
    lineItems: [
      {
        itemSku: 'BRKT-AUTO-STEEL-4',
        itemName: 'Chassis Mounting Brackets 4mm High Tensile',
        orderedQty: 2000,
        unitPrice: 42,
        lineTotal: 84000,
      },
    ],
  },
];

const MOCK_STAGE_DISTRIBUTION = [
  { stage: 'Discovery', count: 12, value: '$340k', pct: 24, color: 'bg-slate-700' },
  { stage: 'Tech Evaluation', count: 8, value: '$285k', pct: 20, color: 'bg-blue-600' },
  { stage: 'Quote Submitted', count: 6, value: '$390k', pct: 27, color: 'bg-purple-600' },
  { stage: 'Negotiation', count: 4, value: '$265k', pct: 19, color: 'bg-pink-600' },
  { stage: 'Contract Review', count: 2, value: '$140k', pct: 10, color: 'bg-emerald-600' },
];

export default function CRMOverviewPage() {
  const [metrics] = useState<CRMOverviewMetrics>(MOCK_METRICS);
  const [highValueLeads] = useState<LeadItem[]>(MOCK_HIGH_VALUE_LEADS);
  const [recentOrders] = useState<SalesOrderCRMItem[]>(MOCK_RECENT_WON_ORDERS);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Building2 className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Customer Relationship Management (CRM) Command Hub
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Pipeline growth tracking, manufacturing cost quote conversions, won order-to-production schedule linkage, and client retention scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/crm/leads"
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-pink-500/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Capture New Lead
          </Link>
          <Link
            href="/crm/quotations"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            <Calculator className="h-4 w-4 text-pink-400" /> Cost Quotation Desk
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg transition-all"
            title="Refresh CRM Telemetry"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Pipeline</span>
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">${(metrics.totalPipelineValue / 1000000).toFixed(2)}M</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            <span className="text-pink-400 font-semibold">{metrics.activeLeadsCount} Leads</span>
            <span>in progression</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Won Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">${(metrics.totalWonRevenue / 1000).toFixed(0)}k</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">{metrics.wonDealsCount} Orders</span>
            <span>Booked Year-To-Date</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Win Conversion</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{metrics.conversionRatePct}%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +4.2%
            </span>
            <span>vs target (68%)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Average Deal Size</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Calculator className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">${metrics.averageDealSize.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            <span className="text-purple-400 font-semibold">Tier-1</span>
            <span>Industrial Clients</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Client Retention</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">{metrics.clientRetentionRatePct}%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            <span className="text-amber-400 font-semibold">{metrics.totalClientsCount}</span>
            <span>Active Enterprise Accounts</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Client NPS Rating</span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Star className="h-4 w-4 fill-teal-400 text-teal-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-teal-400 tracking-tight">{metrics.averageNPS} / 10</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">96.2%</span>
            <span>Positive CSAT Index</span>
          </div>
        </div>
      </div>

      {/* Pipeline Funnel Stage Distribution Banner */}
      <div className="p-5 rounded-xl bg-[#0d1322] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <BarChart3 className="h-4 w-4" />
            </span>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Sales Pipeline Velocity & Stage Distribution ($1.42M Total Pipeline)
            </h3>
          </div>
          <Link href="/crm/leads" className="text-xs text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1">
            Kanban Board <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {MOCK_STAGE_DISTRIBUTION.map((st, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{st.stage}</span>
                <span className="font-mono font-bold text-white">{st.value}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${st.color}`} style={{ width: `${st.pct}%` }} />
              </div>
              <div className="text-[10px] text-slate-400">{st.count} Qualified Opportunities</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: High-Value Closing Deals & Won Orders Linked to Production */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: High-Value Deals Closing Soon */}
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Users className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">Priority Opportunities in Negotiation</h3>
                <p className="text-[11px] text-slate-400">Deals expected to close within the current billing cycle</p>
              </div>
            </div>
            <Link
              href="/crm/leads"
              className="text-xs text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1"
            >
              All Leads <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {highValueLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white font-mono text-xs">{lead.leadNumber}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    {lead.stage.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200">{lead.title}</div>
                <div className="text-[11px] text-slate-300">{lead.companyName} • Contact: {lead.contactPerson}</div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Est. Value: <strong className="text-emerald-400 font-bold">${lead.estimatedValue.toLocaleString()}</strong>
                  </span>
                  <span className="text-amber-400 font-medium">Rep: {lead.assignedSalesRep} (Close: {lead.expectedCloseDate})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Won Deals Linked to Production */}
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BadgeCheck className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">Won Orders Linked to Production Schedule</h3>
                <p className="text-[11px] text-slate-400">Live work orders created from signed manufacturing contracts</p>
              </div>
            </div>
            <Link
              href="/crm/orders"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              All Orders <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((so) => (
              <div
                key={so.id}
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white font-mono text-xs">{so.orderNumber}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {so.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200">{so.client.companyName}</div>
                <div className="text-[11px] text-slate-300">
                  Client PO: <span className="font-mono text-pink-400">{so.clientPoNumber}</span> | Work Order: <span className="font-mono text-blue-400">{so.productionWorkOrderRef}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Total Order: <strong className="text-white font-bold">${so.totalAmount.toLocaleString()}</strong>
                  </span>
                  <span className="text-emerald-400 font-medium">Delivery: {so.targetDeliveryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

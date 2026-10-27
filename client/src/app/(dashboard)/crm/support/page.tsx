'use client';

import React, { useState } from 'react';
import {
  Headphones,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Star,
  PackageCheck,
  Truck,
  Building2,
  Calendar,
  MessageSquare,
  ShieldAlert,
  X,
  ChevronRight,
  TrendingUp,
  Check,
  Send,
  Eye,
  Activity,
  Layers,
} from 'lucide-react';
import {
  CustomerInquiryItem,
  CustomerFeedbackItem,
  InquiryCategory,
  InquiryStatus,
  LeadPriority,
  FeedbackSentiment,
} from '@/types/crm';

const INITIAL_INQUIRIES: CustomerInquiryItem[] = [
  {
    id: 'inq-1',
    ticketNumber: 'INQ-2026-0312',
    clientId: 'cli-1',
    client: {
      id: 'cli-1',
      clientCode: 'CLI-MAH-01',
      companyName: 'Mahindra Heavy Electric Vehicles',
      industry: 'Automotive & Heavy EV',
      primaryContactName: 'Sandeep Deshmukh (VP Sourcing)',
      email: 'sandeep.d@mahindrahev.com',
      phone: '+91 98220 44551',
      billingAddress: 'Plot 45, Chakan Industrial Area Phase II, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      creditLimit: 500000,
      paymentTerms: 'NET_45',
      totalLifetimeSpend: 420000,
      accountManager: 'Vikram Sethi',
      isActive: true,
    },
    salesOrderId: 'so-1',
    category: 'EXPEDITED_DELIVERY',
    subject: 'Request to advance Batch 1 delivery by 5 days for assembly trial run',
    description: 'Mahindra assembly line requires 200 gearboxes for early validation before festive production ramp-up.',
    priority: 'HIGH',
    status: 'UNDER_INVESTIGATION',
    assignedAgent: 'Vikram Sethi',
    createdAt: '2026-10-05T11:00:00Z',
  },
  {
    id: 'inq-2',
    ticketNumber: 'INQ-2026-0315',
    clientId: 'cli-2',
    client: {
      id: 'cli-2',
      clientCode: 'CLI-LT-02',
      companyName: 'Larsen & Toubro Heavy Equipment',
      industry: 'Heavy Engineering & Defense',
      primaryContactName: 'Anjali Menon',
      email: 'anjali.m@larsentoubro.com',
      phone: '+91 98401 22334',
      billingAddress: 'Gate 7, Powai Works, Saki Vihar Road, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      creditLimit: 750000,
      paymentTerms: 'NET_60',
      totalLifetimeSpend: 680000,
      accountManager: 'Ananya Sharma',
      isActive: true,
    },
    category: 'DRAWING_REVISION',
    subject: 'Clarification on chamfer angle tolerance on drawing DWG-LT-2026-881',
    description: 'Engineering drawing section B-B specifies 45 deg +/- 0.5 deg chamfer. Confirm CNC program setup compatibility.',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    assignedAgent: 'Ananya Sharma',
    resolutionNotes: 'Confirmed with Quality Engineering team; CNC program parameters adjusted to nominal 45.1 degrees.',
    resolvedAt: '2026-10-06 14:30',
    createdAt: '2026-10-04T09:30:00Z',
  },
  {
    id: 'inq-3',
    ticketNumber: 'INQ-2026-0318',
    clientId: 'cli-3',
    client: {
      id: 'cli-3',
      clientCode: 'CLI-SCH-03',
      companyName: 'Schneider Electric Industrial India',
      industry: 'Electrical & Automation',
      primaryContactName: 'Praveen Kulkarni',
      email: 'praveen.k@schneider.in',
      phone: '+91 98112 55667',
      billingAddress: 'Attibele Industrial Area, Bangalore',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      creditLimit: 300000,
      paymentTerms: 'NET_30',
      totalLifetimeSpend: 215000,
      accountManager: 'Rohan Mehra',
      isActive: true,
    },
    category: 'ORDER_STATUS',
    subject: 'Status inquiry for IP66 Enclosure batch dispatch tracking',
    description: 'Need confirmed dispatch docket number and carrier ETA for Bengaluru warehouse unloading.',
    priority: 'MEDIUM',
    status: 'OPEN',
    assignedAgent: 'Rohan Mehra',
    createdAt: '2026-10-07T08:15:00Z',
  },
];

const INITIAL_FEEDBACK: CustomerFeedbackItem[] = [
  {
    id: 'fb-1',
    feedbackNumber: 'NPS-2026-0091',
    clientId: 'cli-1',
    client: INITIAL_INQUIRIES[0].client,
    sentiment: 'EXCELLENT',
    npsScore: 10,
    deliveryRating: 5,
    qualityRating: 5,
    communicationRating: 5,
    feedbackComments: 'Exceptional gearbox surface finish and hardness consistency. Delivered 2 days ahead of committed timeline.',
    orderReference: 'SO-2026-0775',
    actionTaken: 'Shared commendation letter with Production CNC team.',
    createdAt: '2026-09-28T16:00:00Z',
  },
  {
    id: 'fb-2',
    feedbackNumber: 'NPS-2026-0094',
    clientId: 'cli-4',
    client: {
      id: 'cli-4',
      clientCode: 'CLI-TAT-04',
      companyName: 'Tata Motors Commercial Vehicles',
      industry: 'Commercial Transport',
      primaryContactName: 'Rajesh Varma',
      email: 'rajesh.v@tatamotors.com',
      phone: '+91 98200 99881',
      billingAddress: 'Pimpri Industrial Corridor, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      creditLimit: 600000,
      paymentTerms: 'NET_45',
      totalLifetimeSpend: 540000,
      accountManager: 'Vikram Sethi',
      isActive: true,
    },
    sentiment: 'SATISFIED',
    npsScore: 9,
    deliveryRating: 4,
    qualityRating: 5,
    communicationRating: 4,
    feedbackComments: 'Axle forgings met tight ultrasonic specifications without any inclusions. Packaging could be slightly sturdier for long transit.',
    orderReference: 'SO-2026-0798',
    actionTaken: 'Upgraded pallet strap gauge and anti-rust VCI film thickness for future shipments.',
    createdAt: '2026-10-02T11:45:00Z',
  },
];

// Mock Order Tracking Data
const ORDER_TRACKING_SAMPLES = [
  {
    orderNumber: 'SO-2026-0811',
    clientPo: 'PO-MHEV-8821',
    clientName: 'Mahindra Heavy Electric Vehicles',
    component: 'Hardened Alloy Steel Transmission Gearbox 120kW (1,200 Sets)',
    currentStage: 'Machining & Gear Hobbing',
    overallProgressPct: 65,
    estimatedDispatch: '2026-11-20',
    milestones: [
      { name: 'PO Confirmed & Engineering Signoff', done: true, timestamp: '2026-10-04 14:00' },
      { name: 'Raw Material (42CrMo4 Forgings) Inspected', done: true, timestamp: '2026-10-05 10:30' },
      { name: 'CNC Gear Hobbing & Shaping', done: true, timestamp: '2026-10-07 09:00' },
      { name: 'Vacuum Carburizing & Case Hardening', done: false, timestamp: 'Est. 2026-10-14' },
      { name: 'CMM Dimensional Inspection & Balancing', done: false, timestamp: 'Est. 2026-10-18' },
      { name: 'Packaging & Dispatch Challan Generated', done: false, timestamp: 'Est. 2026-11-20' },
    ],
  },
  {
    orderNumber: 'SO-2026-0814',
    clientPo: 'PO-LT-9941-DEF',
    clientName: 'Larsen & Toubro Heavy Equipment',
    component: 'Hard Chrome Plated EN8D Cylinder Rods (500 PCS)',
    currentStage: 'Precision Hard Chrome Plating',
    overallProgressPct: 40,
    estimatedDispatch: '2026-10-25',
    milestones: [
      { name: 'PO Confirmed & Engineering Signoff', done: true, timestamp: '2026-09-28 16:00' },
      { name: 'Centerless Grinding & Superfinishing', done: true, timestamp: '2026-10-03 11:20' },
      { name: 'Hard Chrome Plating Bath (35 Microns)', done: false, timestamp: 'Est. 2026-10-12' },
      { name: 'Micro-crack & Salt Spray Corrosion Test', done: false, timestamp: 'Est. 2026-10-17' },
      { name: 'Protective Sleeving & Dispatch Ready', done: false, timestamp: 'Est. 2026-10-25' },
    ],
  },
];

export default function CRMSupportPage() {
  const [activeTab, setActiveTab] = useState<'INQUIRIES' | 'TRACKING' | 'FEEDBACK'>('INQUIRIES');
  const [inquiries, setInquiries] = useState<CustomerInquiryItem[]>(INITIAL_INQUIRIES);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedbackItem[]>(INITIAL_FEEDBACK);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInquiryForResolve, setSelectedInquiryForResolve] = useState<CustomerInquiryItem | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // New Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({
    companyName: 'Mahindra Heavy Electric Vehicles',
    salesOrderNumber: 'SO-2026-0811',
    category: 'EXPEDITED_DELIVERY' as InquiryCategory,
    priority: 'HIGH' as LeadPriority,
    subject: '',
    description: '',
    assignedAgent: 'Vikram Sethi',
  });

  // New Feedback Form
  const [feedbackForm, setFeedbackForm] = useState({
    companyName: 'Larsen & Toubro Heavy Equipment',
    orderReference: 'SO-2026-0814',
    npsScore: 10,
    qualityRating: 5,
    deliveryRating: 5,
    communicationRating: 5,
    sentiment: 'EXCELLENT' as FeedbackSentiment,
    feedbackComments: '',
  });

  // Inquiries Filtering
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || inq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate NPS average
  const avgNps = (
    feedbacks.reduce((sum, f) => sum + f.npsScore, 0) / (feedbacks.length || 1)
  ).toFixed(1);

  // Submit Inquiry
  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const newInq: CustomerInquiryItem = {
      id: `inq-${Date.now()}`,
      ticketNumber: `INQ-2026-0${Math.floor(320 + Math.random() * 500)}`,
      clientId: 'cli-1',
      client: {
        id: 'cli-1',
        clientCode: 'CLI-MAH-01',
        companyName: inquiryForm.companyName,
        industry: 'Heavy Engineering',
        primaryContactName: 'Authorized Client Rep',
        email: 'rep@client.com',
        phone: '+91 98220 00000',
        billingAddress: 'Client Plant Area',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        creditLimit: 500000,
        paymentTerms: 'NET_45',
        totalLifetimeSpend: 420000,
        accountManager: inquiryForm.assignedAgent,
        isActive: true,
      },
      category: inquiryForm.category,
      subject: inquiryForm.subject,
      description: inquiryForm.description,
      priority: inquiryForm.priority,
      status: 'OPEN',
      assignedAgent: inquiryForm.assignedAgent,
      createdAt: new Date().toISOString(),
    };

    setInquiries([newInq, ...inquiries]);
    setShowInquiryModal(false);
    setInquiryForm({
      companyName: 'Mahindra Heavy Electric Vehicles',
      salesOrderNumber: 'SO-2026-0811',
      category: 'EXPEDITED_DELIVERY',
      priority: 'HIGH',
      subject: '',
      description: '',
      assignedAgent: 'Vikram Sethi',
    });
  };

  // Submit Feedback
  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const newFb: CustomerFeedbackItem = {
      id: `fb-${Date.now()}`,
      feedbackNumber: `NPS-2026-0${Math.floor(100 + Math.random() * 800)}`,
      clientId: 'cli-2',
      client: {
        id: 'cli-2',
        clientCode: 'CLI-LT-02',
        companyName: feedbackForm.companyName,
        industry: 'Heavy Engineering',
        primaryContactName: 'Procurement Specialist',
        email: 'procurement@client.com',
        phone: '+91 98401 00000',
        billingAddress: 'Plant Campus',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        creditLimit: 750000,
        paymentTerms: 'NET_60',
        totalLifetimeSpend: 680000,
        accountManager: 'Ananya Sharma',
        isActive: true,
      },
      sentiment: feedbackForm.sentiment,
      npsScore: Number(feedbackForm.npsScore),
      qualityRating: Number(feedbackForm.qualityRating),
      deliveryRating: Number(feedbackForm.deliveryRating),
      communicationRating: Number(feedbackForm.communicationRating),
      feedbackComments: feedbackForm.feedbackComments,
      orderReference: feedbackForm.orderReference,
      createdAt: new Date().toISOString(),
    };

    setFeedbacks([newFb, ...feedbacks]);
    setShowFeedbackModal(false);
  };

  // Handle Resolve
  const handleResolveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiryForResolve || !resolutionText.trim()) return;

    setInquiries((prev) =>
      prev.map((i) =>
        i.id === selectedInquiryForResolve.id
          ? {
              ...i,
              status: 'RESOLVED',
              resolutionNotes: resolutionText.trim(),
              resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : i
      )
    );

    setSelectedInquiryForResolve(null);
    setResolutionText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Customer Experience
            </span>
            <span className="text-xs text-slate-500">Post-Order Support & SLA Resolution</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Customer Inquiries, Order Tracking & Feedback
          </h1>
          <p className="text-sm text-slate-400">
            Address commercial inquiries, deliver real-time manufacturing milestone transparency, and measure client satisfaction (NPS).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0f172a] p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveTab('INQUIRIES')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'INQUIRIES'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Support Tickets ({inquiries.filter((i) => i.status !== 'RESOLVED').length} Open)
            </button>
            <button
              onClick={() => setActiveTab('TRACKING')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'TRACKING'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Order Telemetry
            </button>
            <button
              onClick={() => setActiveTab('FEEDBACK')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'FEEDBACK'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NPS & Reviews ({feedbacks.length})
            </button>
          </div>

          {activeTab === 'FEEDBACK' ? (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-pink-900/20"
            >
              <Star className="w-4 h-4" />
              Log NPS Review
            </button>
          ) : (
            <button
              onClick={() => setShowInquiryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-pink-900/20"
            >
              <Plus className="w-4 h-4" />
              Log Support Ticket
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Open Tickets</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {inquiries.filter((i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length}
            </div>
            <div className="text-xs text-slate-400 mt-1">1 under engineering review</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Net Promoter Score (NPS)</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{avgNps} / 10</div>
            <div className="text-xs text-emerald-400/90 mt-1">Top-tier industrial promoter rank</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Star className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Avg First Response Time</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">1.8 hrs</div>
            <div className="text-xs text-cyan-400/80 mt-1">Target SLA: under 4.0 hrs</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Resolved Ticket Ratio</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">94.2%</div>
            <div className="text-xs text-purple-400/80 mt-1">Zero unresolved disputes</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* VIEW 1: CLIENT INQUIRIES & SUPPORT TICKETS */}
      {activeTab === 'INQUIRIES' && (
        <div className="space-y-4">
          <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search ticket #, company, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-pink-500"
              >
                <option value="ALL">All Categories</option>
                <option value="ORDER_STATUS">Order Status</option>
                <option value="EXPEDITED_DELIVERY">Expedited Delivery</option>
                <option value="DRAWING_REVISION">Drawing Revision</option>
                <option value="TECHNICAL_SPECIFICATION">Technical Specification</option>
                <option value="BILLING_QUERY">Billing Query</option>
                <option value="QUALITY_CONCERN">Quality Concern</option>
              </select>
            </div>
          </div>

          <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="p-3.5">Ticket # & Priority</th>
                    <th className="p-3.5">Client & Contact</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Subject & Description</th>
                    <th className="p-3.5">Assigned Agent</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredInquiries.map((inq) => {
                    const statusColor =
                      inq.status === 'RESOLVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : inq.status === 'UNDER_INVESTIGATION'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30';

                    return (
                      <tr key={inq.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5">
                          <div className="font-mono font-bold text-white text-sm">{inq.ticketNumber}</div>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              inq.priority === 'URGENT' || inq.priority === 'HIGH'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {inq.priority}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{inq.client.companyName}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{inq.client.primaryContactName}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-1 rounded bg-slate-800 text-cyan-400 font-semibold text-[10px] border border-slate-700">
                            {inq.category.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 max-w-sm">
                          <div className="font-semibold text-slate-200 line-clamp-1">{inq.subject}</div>
                          <div className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">{inq.description}</div>
                          {inq.resolutionNotes && (
                            <div className="text-emerald-400 text-[11px] mt-1 bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20">
                              Resolved: {inq.resolutionNotes}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-300">{inq.assignedAgent}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusColor}`}>
                            {inq.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {inq.status !== 'RESOLVED' ? (
                            <button
                              onClick={() => setSelectedInquiryForResolve(inq)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">Closed</span>
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

      {/* VIEW 2: LIVE ORDER TRACKING TELEMETRY */}
      {activeTab === 'TRACKING' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ORDER_TRACKING_SAMPLES.map((ot, idx) => (
              <div
                key={idx}
                className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 hover:border-pink-500/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-pink-400">{ot.orderNumber}</span>
                      <span className="font-mono text-xs text-slate-400">PO: {ot.clientPo}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{ot.clientName}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{ot.component}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Target Dispatch</span>
                    <div className="font-mono text-emerald-400 font-bold text-sm mt-0.5">{ot.estimatedDispatch}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Stage: {ot.currentStage}</span>
                    <span className="font-bold text-white font-mono">{ot.overallProgressPct}% Complete</span>
                  </div>
                  <div className="w-full bg-[#090d16] h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${ot.overallProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Manufacturing Milestone Timeline
                  </span>
                  <div className="space-y-2">
                    {ot.milestones.map((ms, mIdx) => (
                      <div key={mIdx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {ms.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900 flex-shrink-0" />
                          )}
                          <span className={ms.done ? 'text-slate-200' : 'text-slate-500'}>{ms.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{ms.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CUSTOMER FEEDBACK & NPS RATINGS */}
      {activeTab === 'FEEDBACK' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-xs text-slate-400">Quality Satisfaction Rating</div>
              <div className="text-2xl font-bold text-white">4.9 / 5.0</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-emerald-400" />
                98% dimensional tolerance conformity
              </div>
            </div>

            <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-xs text-slate-400">On-Time Delivery Rating</div>
              <div className="text-2xl font-bold text-white">4.8 / 5.0</div>
              <div className="text-xs text-cyan-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                Zero unnotified plant line stoppages
              </div>
            </div>

            <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-xs text-slate-400">Technical Communication</div>
              <div className="text-2xl font-bold text-white">4.7 / 5.0</div>
              <div className="text-xs text-purple-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Dedicated engineering sales managers
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-[#0d1322] border border-slate-800 rounded-xl p-4 shadow-lg space-y-2 hover:border-pink-500/30 transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-pink-400 font-bold">{fb.feedbackNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {fb.sentiment}
                    </span>
                    {fb.orderReference && (
                      <span className="font-mono text-slate-400 text-[11px]">Ref: {fb.orderReference}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-pink-500/10 px-2.5 py-1 rounded-full text-pink-300 font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-pink-400" />
                    NPS {fb.npsScore}/10
                  </div>
                </div>

                <div className="font-semibold text-white text-sm">{fb.client.companyName}</div>

                <p className="text-slate-300 italic bg-[#090d16] p-3 rounded-lg border border-slate-800/80">
                  "{fb.feedbackComments}"
                </p>

                {fb.actionTaken && (
                  <div className="text-cyan-400 bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 text-[11px]">
                    <span className="font-bold">Corrective / Preventive Action: </span>
                    {fb.actionTaken}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: LOG CUSTOMER INQUIRY TICKET */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-pink-400" />
                  Log Client Inquiry or Issue Ticket
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Route client question directly to assigned account manager or engineering.
                </p>
              </div>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Client / Company Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryForm.companyName}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, companyName: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Inquiry Category</label>
                  <select
                    value={inquiryForm.category}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, category: e.target.value as InquiryCategory })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="ORDER_STATUS">Order Status</option>
                    <option value="EXPEDITED_DELIVERY">Expedited Delivery</option>
                    <option value="DRAWING_REVISION">Drawing Revision</option>
                    <option value="TECHNICAL_SPECIFICATION">Technical Specification</option>
                    <option value="BILLING_QUERY">Billing Query</option>
                    <option value="QUALITY_CONCERN">Quality Concern</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Priority</label>
                  <select
                    value={inquiryForm.priority}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, priority: e.target.value as LeadPriority })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent (Line Down Risk)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of inquiry or issue..."
                  value={inquiryForm.subject}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail client constraints, dates, drawing revisions, or requirements..."
                  value={inquiryForm.description}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, description: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium shadow-md shadow-pink-900/20"
                >
                  Log Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESOLVE TICKET */}
      {selectedInquiryForResolve && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-pink-400">{selectedInquiryForResolve.ticketNumber}</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Resolve Inquiry: {selectedInquiryForResolve.client.companyName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiryForResolve(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveTicket} className="space-y-4 text-xs">
              <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-200">{selectedInquiryForResolve.subject}</div>
                <p className="text-slate-400">{selectedInquiryForResolve.description}</p>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Resolution Notes / Action Executed *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record solution communicated to client, engineering changes, or expedited dispatch ETA..."
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedInquiryForResolve(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-md shadow-emerald-900/20"
                >
                  Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG NPS FEEDBACK */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-pink-400" />
                  Log Client Feedback & NPS Score
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Record satisfaction scores and quality observations following batch dispatch.
                </p>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFeedback} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Client / Company Name *</label>
                <input
                  type="text"
                  required
                  value={feedbackForm.companyName}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, companyName: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Order Reference #</label>
                  <input
                    type="text"
                    value={feedbackForm.orderReference}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, orderReference: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">NPS Score (0 - 10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={feedbackForm.npsScore}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, npsScore: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Feedback Comments *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Observations on dimensional accuracy, dispatch timeliness, communication..."
                  value={feedbackForm.feedbackComments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedbackComments: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium shadow-md shadow-pink-900/20"
                >
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

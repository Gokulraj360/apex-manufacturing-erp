'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  Filter,
  DollarSign,
  TrendingUp,
  Building2,
  Phone,
  Mail,
  Calendar,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Send,
} from 'lucide-react';
import {
  LeadItem,
  ClientDirectoryItem,
  PipelineStage,
  LeadPriority,
  LeadSource,
  LeadNote,
} from '@/types/crm';

const PIPELINE_STAGES: { stage: PipelineStage; label: string; color: string; border: string }[] = [
  { stage: 'DISCOVERY', label: 'Discovery & Feasibility', color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/30' },
  { stage: 'TECHNICAL_EVALUATION', label: 'Technical Evaluation', color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/30' },
  { stage: 'QUOTATION_SUBMITTED', label: 'Quotation Submitted', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/30' },
  { stage: 'COMMERCIAL_NEGOTIATION', label: 'Commercial Negotiation', color: 'bg-orange-500/10 text-orange-400', border: 'border-orange-500/30' },
  { stage: 'CONTRACT_REVIEW', label: 'Contract Review', color: 'bg-cyan-500/10 text-cyan-400', border: 'border-cyan-500/30' },
  { stage: 'CLOSED_WON', label: 'Closed Won (Production)', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' },
  { stage: 'CLOSED_LOST', label: 'Closed Lost', color: 'bg-red-500/10 text-red-400', border: 'border-red-500/30' },
];

const INITIAL_CLIENTS: ClientDirectoryItem[] = [
  {
    id: 'cli-1',
    clientCode: 'CLI-MAH-01',
    companyName: 'Mahindra Heavy Electric Vehicles',
    industry: 'Automotive & Heavy EV',
    primaryContactName: 'Sandeep Deshmukh (VP Sourcing)',
    email: 'sandeep.d@mahindrahev.com',
    phone: '+91 98220 44551',
    billingAddress: 'Plot 45, Chakan Industrial Area Phase II',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    taxGstin: '27AAACM4589E1ZM',
    creditLimit: 500000,
    paymentTerms: 'NET_45',
    totalLifetimeSpend: 420000,
    accountManager: 'Vikram Sethi',
    isActive: true,
    _count: { salesOrders: 8, quotations: 12, inquiries: 2 },
  },
  {
    id: 'cli-2',
    clientCode: 'CLI-LT-02',
    companyName: 'Larsen & Toubro Heavy Equipment',
    industry: 'Heavy Engineering & Defense',
    primaryContactName: 'Anjali Menon',
    email: 'anjali.m@larsentoubro.com',
    phone: '+91 98401 22334',
    billingAddress: 'Gate 7, Powai Works, Saki Vihar Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    taxGstin: '27AAACL1290K1ZX',
    creditLimit: 750000,
    paymentTerms: 'NET_60',
    totalLifetimeSpend: 680000,
    accountManager: 'Ananya Sharma',
    isActive: true,
    _count: { salesOrders: 14, quotations: 19, inquiries: 5 },
  },
  {
    id: 'cli-3',
    clientCode: 'CLI-SCH-03',
    companyName: 'Schneider Electric Industrial India',
    industry: 'Electrical & Automation',
    primaryContactName: 'Praveen Kulkarni',
    email: 'praveen.k@schneider.in',
    phone: '+91 98112 55667',
    billingAddress: 'Attibele Industrial Area, Anekal Taluk',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    taxGstin: '29AAACS8831P1ZV',
    creditLimit: 300000,
    paymentTerms: 'NET_30',
    totalLifetimeSpend: 215000,
    accountManager: 'Rohan Mehra',
    isActive: true,
    _count: { salesOrders: 5, quotations: 7, inquiries: 1 },
  },
  {
    id: 'cli-4',
    clientCode: 'CLI-TAT-04',
    companyName: 'Tata Motors Commercial Vehicles',
    industry: 'Commercial Transport',
    primaryContactName: 'Rajesh Varma',
    email: 'rajesh.v@tatamotors.com',
    phone: '+91 98200 99881',
    billingAddress: 'Pimpri Industrial Corridor',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    taxGstin: '27AAACT0081Q1ZF',
    creditLimit: 600000,
    paymentTerms: 'NET_45',
    totalLifetimeSpend: 540000,
    accountManager: 'Vikram Sethi',
    isActive: true,
    _count: { salesOrders: 11, quotations: 15, inquiries: 3 },
  },
];

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    leadNumber: 'LEAD-2026-0182',
    title: 'High-Precision Transmission Gearboxes (1,200 Units/Quarter)',
    companyName: 'Mahindra Heavy Electric Vehicles',
    clientId: 'cli-1',
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
    notes: [
      { timestamp: '2026-09-20 10:30', author: 'Vikram Sethi', noteText: 'Client submitted STEP CAD files and hardness test specs.' },
      { timestamp: '2026-10-01 15:00', author: 'Vikram Sethi', noteText: 'Offered 4.5% volume rebate for annual commit of 4,800 units.' },
    ],
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'lead-2',
    leadNumber: 'LEAD-2026-0185',
    title: 'Hydraulic Cylinder Rods & Ram Assemblies (Batch 500)',
    companyName: 'Larsen & Toubro Heavy Equipment',
    clientId: 'cli-2',
    contactPerson: 'Anjali Menon',
    email: 'anjali.m@larsentoubro.com',
    phone: '+91 98401 22334',
    source: 'TRADE_SHOW',
    priority: 'HIGH',
    stage: 'QUOTATION_SUBMITTED',
    estimatedValue: 185000,
    expectedCloseDate: '2026-10-22',
    assignedSalesRep: 'Ananya Sharma',
    technicalRequirementSummary: 'Hard chrome plated EN8D rods with micro-crack corrosion barrier.',
    notes: [
      { timestamp: '2026-09-28 14:30', author: 'Ananya Sharma', noteText: 'Quotation QT-2026-0419 transmitted. Client reviewing lead times.' },
    ],
    createdAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'lead-3',
    leadNumber: 'LEAD-2026-0189',
    title: 'Laser Cut Sheet Metal Electrical Enclosures 4kW',
    companyName: 'Schneider Electric Industrial India',
    clientId: 'cli-3',
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
    notes: [
      { timestamp: '2026-10-02 11:20', author: 'Rohan Mehra', noteText: 'Tooling feasibility verified with CNC punch press cell.' },
    ],
    createdAt: '2026-10-02T11:15:00Z',
  },
  {
    id: 'lead-4',
    leadNumber: 'LEAD-2026-0191',
    title: 'Commercial Bus Front Axle Beam Forgings (Batch 300)',
    companyName: 'Tata Motors Commercial Vehicles',
    clientId: 'cli-4',
    contactPerson: 'Rajesh Varma',
    email: 'rajesh.v@tatamotors.com',
    phone: '+91 98200 99881',
    source: 'EXISTING_CLIENT',
    priority: 'HIGH',
    stage: 'CONTRACT_REVIEW',
    estimatedValue: 310000,
    expectedCloseDate: '2026-10-18',
    assignedSalesRep: 'Vikram Sethi',
    technicalRequirementSummary: 'Micro-alloyed steel forged I-beam with ultrasonic testing compliance.',
    notes: [
      { timestamp: '2026-10-04 16:45', author: 'Vikram Sethi', noteText: 'Commercial terms agreed. Legal reviewing warranty terms clause 14.' },
    ],
    createdAt: '2026-10-04T09:00:00Z',
  },
  {
    id: 'lead-5',
    leadNumber: 'LEAD-2026-0194',
    title: 'Titanium Aerospace Heat Exchanger Manifolds (Proto 20)',
    companyName: 'Dynamatic Technologies Aerospace',
    contactPerson: 'Karan Malhotra',
    email: 'karan.m@dynamatic.com',
    phone: '+91 98800 12345',
    source: 'PARTNER',
    priority: 'URGENT',
    stage: 'DISCOVERY',
    estimatedValue: 140000,
    expectedCloseDate: '2026-11-05',
    assignedSalesRep: 'Ananya Sharma',
    technicalRequirementSummary: '5-Axis CNC milling of Ti-6Al-4V block with AS9100 standard inspection.',
    notes: [
      { timestamp: '2026-10-06 10:10', author: 'Ananya Sharma', noteText: 'Initial RFQ received via aerospace partner network. Tooling feasibility review in progress.' },
    ],
    createdAt: '2026-10-06T10:00:00Z',
  },
  {
    id: 'lead-6',
    leadNumber: 'LEAD-2026-0178',
    title: 'Automotive Subframe Tubular Welded Assemblies',
    companyName: 'Bharat Forge Light Commercial',
    contactPerson: 'Mahesh Kulkarni',
    email: 'm.kulkarni@bharatforge.com',
    phone: '+91 98233 44556',
    source: 'TRADE_SHOW',
    priority: 'HIGH',
    stage: 'CLOSED_WON',
    estimatedValue: 450000,
    expectedCloseDate: '2026-09-30',
    assignedSalesRep: 'Vikram Sethi',
    technicalRequirementSummary: 'Robotic MIG welded subframes with CMM dimensional certification.',
    notes: [
      { timestamp: '2026-09-30 17:00', author: 'Vikram Sethi', noteText: 'Client issued official PO # PO-BFL-9021. Transferred to Production Scheduling.' },
    ],
    createdAt: '2026-09-10T08:30:00Z',
  },
];

export default function CRMLeadsPage() {
  const [activeView, setActiveView] = useState<'KANBAN' | 'CLIENTS'>('KANBAN');
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [clients, setClients] = useState<ClientDirectoryItem[]>(INITIAL_CLIENTS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [repFilter, setRepFilter] = useState<string>('ALL');

  // Modals
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [activeLeadForNotes, setActiveLeadForNotes] = useState<LeadItem | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    title: '',
    companyName: '',
    clientId: '',
    contactPerson: '',
    email: '',
    phone: '',
    source: 'INBOUND_WEB' as LeadSource,
    priority: 'MEDIUM' as LeadPriority,
    estimatedValue: '',
    expectedCloseDate: '',
    assignedSalesRep: 'Vikram Sethi',
    technicalRequirementSummary: '',
  });

  // New Client Form State
  const [newClientForm, setNewClientForm] = useState({
    companyName: '',
    clientCode: '',
    industry: '',
    primaryContactName: '',
    email: '',
    phone: '',
    billingAddress: '',
    city: '',
    state: '',
    creditLimit: '250000',
    paymentTerms: 'NET_30',
    accountManager: 'Vikram Sethi',
  });

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.leadNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || lead.priority === priorityFilter;
    const matchesRep = repFilter === 'ALL' || lead.assignedSalesRep === repFilter;
    return matchesSearch && matchesPriority && matchesRep;
  });

  const filteredClients = clients.filter((c) => {
    return (
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pipeline Metrics
  const totalPipelineValue = leads
    .filter((l) => l.stage !== 'CLOSED_LOST' && l.stage !== 'CLOSED_WON')
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  const totalWonValue = leads
    .filter((l) => l.stage === 'CLOSED_WON')
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  // Stage Advancement
  const advanceStage = (leadId: string, forward: boolean) => {
    const order: PipelineStage[] = [
      'DISCOVERY',
      'TECHNICAL_EVALUATION',
      'QUOTATION_SUBMITTED',
      'COMMERCIAL_NEGOTIATION',
      'CONTRACT_REVIEW',
      'CLOSED_WON',
    ];

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const curIdx = order.indexOf(l.stage);
        if (curIdx === -1) return l;
        const nextIdx = forward ? curIdx + 1 : curIdx - 1;
        if (nextIdx >= 0 && nextIdx < order.length) {
          const newStage = order[nextIdx];
          const newNotes: LeadNote[] = [
            ...(l.notes || []),
            {
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              author: 'Current User',
              noteText: `Moved stage from ${l.stage.replace(/_/g, ' ')} to ${newStage.replace(/_/g, ' ')}`,
            },
          ];
          return { ...l, stage: newStage, notes: newNotes };
        }
        return l;
      })
    );
  };

  // Add Note handler
  const handleAddNote = () => {
    if (!activeLeadForNotes || !newNoteText.trim()) return;
    const note: LeadNote = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: 'Vikram Sethi',
      noteText: newNoteText.trim(),
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === activeLeadForNotes.id) {
          return {
            ...l,
            notes: [...(l.notes || []), note],
          };
        }
        return l;
      })
    );

    setActiveLeadForNotes((prev) => (prev ? { ...prev, notes: [...(prev.notes || []), note] } : null));
    setNewNoteText('');
  };

  // Submit New Lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LeadItem = {
      id: `lead-${Date.now()}`,
      leadNumber: `LEAD-2026-0${Math.floor(200 + Math.random() * 800)}`,
      title: newLeadForm.title,
      companyName: newLeadForm.companyName,
      clientId: newLeadForm.clientId || undefined,
      contactPerson: newLeadForm.contactPerson,
      email: newLeadForm.email,
      phone: newLeadForm.phone,
      source: newLeadForm.source,
      priority: newLeadForm.priority,
      stage: 'DISCOVERY',
      estimatedValue: parseFloat(newLeadForm.estimatedValue) || 50000,
      expectedCloseDate: newLeadForm.expectedCloseDate || '2026-11-15',
      assignedSalesRep: newLeadForm.assignedSalesRep,
      technicalRequirementSummary: newLeadForm.technicalRequirementSummary,
      notes: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: newLeadForm.assignedSalesRep,
          noteText: 'Inbound lead qualified and logged into pipeline.',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setLeads([created, ...leads]);
    setShowCaptureModal(false);
    setNewLeadForm({
      title: '',
      companyName: '',
      clientId: '',
      contactPerson: '',
      email: '',
      phone: '',
      source: 'INBOUND_WEB',
      priority: 'MEDIUM',
      estimatedValue: '',
      expectedCloseDate: '',
      assignedSalesRep: 'Vikram Sethi',
      technicalRequirementSummary: '',
    });
  };

  // Submit New Client
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ClientDirectoryItem = {
      id: `cli-${Date.now()}`,
      clientCode: newClientForm.clientCode || `CLI-${newClientForm.companyName.substring(0, 3).toUpperCase()}-0${clients.length + 1}`,
      companyName: newClientForm.companyName,
      industry: newClientForm.industry,
      primaryContactName: newClientForm.primaryContactName,
      email: newClientForm.email,
      phone: newClientForm.phone,
      billingAddress: newClientForm.billingAddress,
      city: newClientForm.city,
      state: newClientForm.state,
      country: 'India',
      creditLimit: parseFloat(newClientForm.creditLimit) || 200000,
      paymentTerms: newClientForm.paymentTerms,
      totalLifetimeSpend: 0,
      accountManager: newClientForm.accountManager,
      isActive: true,
      _count: { salesOrders: 0, quotations: 0, inquiries: 0 },
    };

    setClients([...clients, created]);
    setShowAddClientModal(false);
    setNewClientForm({
      companyName: '',
      clientCode: '',
      industry: '',
      primaryContactName: '',
      email: '',
      phone: '',
      billingAddress: '',
      city: '',
      state: '',
      creditLimit: '250000',
      paymentTerms: 'NET_30',
      accountManager: 'Vikram Sethi',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Pipeline & Accounts
            </span>
            <span className="text-xs text-slate-500">Real-time CRM Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Leads Pipeline & Client Accounts
          </h1>
          <p className="text-sm text-slate-400">
            Track multi-stage manufacturing sales opportunities, technical qualifications, and enterprise client relationships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0f172a] p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveView('KANBAN')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeView === 'KANBAN'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pipeline Kanban
            </button>
            <button
              onClick={() => setActiveView('CLIENTS')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeView === 'CLIENTS'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Client Directory ({clients.length})
            </button>
          </div>

          {activeView === 'KANBAN' ? (
            <button
              onClick={() => setShowCaptureModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-pink-900/20"
            >
              <Plus className="w-4 h-4" />
              Capture Lead
            </button>
          ) : (
            <button
              onClick={() => setShowAddClientModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-pink-900/20"
            >
              <Plus className="w-4 h-4" />
              Add Client Account
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Active Pipeline Value</div>
            <div className="text-2xl font-bold text-white mt-1">
              ${totalPipelineValue.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {leads.filter((l) => l.stage !== 'CLOSED_LOST' && l.stage !== 'CLOSED_WON').length} active deals
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Closed Won (In Production)</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              ${totalWonValue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {leads.filter((l) => l.stage === 'CLOSED_WON').length} converted orders
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Registered Enterprise Clients</div>
            <div className="text-2xl font-bold text-white mt-1">{clients.length}</div>
            <div className="text-xs text-cyan-400 mt-1">100% KYC & Credit Verified</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Average Deal Size</div>
            <div className="text-2xl font-bold text-white mt-1">
              ${Math.round(totalPipelineValue / (leads.length || 1)).toLocaleString()}
            </div>
            <div className="text-xs text-purple-400 mt-1">Engineered precision contracts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={
              activeView === 'KANBAN'
                ? 'Search lead title, company, contact, or ID...'
                : 'Search client code, company name, industry, city...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
          />
        </div>

        {activeView === 'KANBAN' && (
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-pink-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Rep:</span>
              <select
                value={repFilter}
                onChange={(e) => setRepFilter(e.target.value)}
                className="bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-pink-500"
              >
                <option value="ALL">All Reps</option>
                <option value="Vikram Sethi">Vikram Sethi</option>
                <option value="Ananya Sharma">Ananya Sharma</option>
                <option value="Rohan Mehra">Rohan Mehra</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* MAIN VIEW: KANBAN BOARD */}
      {activeView === 'KANBAN' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((col) => {
            const columnLeads = filteredLeads.filter((l) => l.stage === col.stage);
            const columnValue = columnLeads.reduce((acc, l) => acc + l.estimatedValue, 0);

            return (
              <div
                key={col.stage}
                className="flex-shrink-0 w-80 bg-[#0d1322] border border-slate-800 rounded-xl flex flex-col max-h-[750px]"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b border-slate-800/80 flex items-center justify-between`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${col.color}`}>
                        {col.label}
                      </span>
                      <span className="text-xs font-medium text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded-full">
                        {columnLeads.length}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      ${columnValue.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
                  {columnLeads.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800/60 rounded-xl p-4">
                      No deals currently in this stage
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-[#090d16] border border-slate-800/90 hover:border-pink-500/50 rounded-xl p-3.5 transition-all shadow-sm space-y-2.5"
                      >
                        {/* Top Line */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-mono text-slate-400">
                            {lead.leadNumber}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              lead.priority === 'URGENT'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : lead.priority === 'HIGH'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-slate-700/40 text-slate-300'
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </div>

                        {/* Title & Company */}
                        <div>
                          <div className="font-semibold text-sm text-white line-clamp-2 leading-tight">
                            {lead.title}
                          </div>
                          <div className="text-xs text-pink-400/90 font-medium flex items-center gap-1 mt-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {lead.companyName}
                          </div>
                        </div>

                        {/* Technical Scope */}
                        <div className="text-xs text-slate-400 bg-[#0d1322] p-2 rounded-lg border border-slate-800/60 line-clamp-2">
                          {lead.technicalRequirementSummary}
                        </div>

                        {/* Details */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                          <div>
                            <div className="text-[10px] text-slate-500">Value</div>
                            <div className="font-bold text-white text-sm">
                              ${lead.estimatedValue.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-slate-500">Target Close</div>
                            <div className="text-xs text-slate-300 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              {lead.expectedCloseDate}
                            </div>
                          </div>
                        </div>

                        {/* Rep & Notes Button */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-pink-400" />
                            {lead.assignedSalesRep}
                          </div>

                          <button
                            onClick={() => setActiveLeadForNotes(lead)}
                            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-pink-400 transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>{lead.notes?.length || 0} notes</span>
                          </button>
                        </div>

                        {/* Stage Mover Controls */}
                        <div className="flex items-center justify-between pt-1 gap-1">
                          <button
                            onClick={() => advanceStage(lead.id, false)}
                            disabled={lead.stage === 'DISCOVERY'}
                            className="p-1 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 text-[11px] flex items-center gap-0.5"
                            title="Regress Stage"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[10px] text-slate-500 font-medium">Stage Action</span>

                          <button
                            onClick={() => advanceStage(lead.id, true)}
                            disabled={lead.stage === 'CLOSED_WON' || lead.stage === 'CLOSED_LOST'}
                            className="p-1 rounded bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 hover:text-white disabled:opacity-20 text-[11px] flex items-center gap-0.5"
                            title="Advance Stage"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CLIENTS VIEW: TABLE */}
      {activeView === 'CLIENTS' && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Registered B2B Client Accounts</h2>
            <div className="text-xs text-slate-400">Total: {clients.length} Corporate Accounts</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="p-3">Client Code / Name</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3">Primary Contact</th>
                  <th className="p-3">Credit Limit & Terms</th>
                  <th className="p-3">Lifetime Spend</th>
                  <th className="p-3">Account Mgr</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-white">{c.companyName}</div>
                      <div className="font-mono text-[11px] text-pink-400">{c.clientCode}</div>
                      <div className="text-[11px] text-slate-400">{c.city}, {c.state}</div>
                    </td>
                    <td className="p-3 text-slate-300">{c.industry}</td>
                    <td className="p-3">
                      <div className="text-white font-medium">{c.primaryContactName}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" /> {c.email}
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {c.phone}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-200 font-mono font-medium">
                        Limit: ${c.creditLimit.toLocaleString()}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-400 font-semibold border border-slate-700">
                        {c.paymentTerms}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-400 font-mono">
                      ${c.totalLifetimeSpend.toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-300">{c.accountManager}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ACTIVE
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/crm/quotations`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 rounded-lg text-xs font-medium border border-pink-500/20 transition-colors"
                      >
                        Create Quote
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CAPTURE INBOUND LEAD */}
      {showCaptureModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  Capture New Manufacturing Inbound Lead
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Register deal specifications and technical requirements into the sales pipeline.
                </p>
              </div>
              <button
                onClick={() => setShowCaptureModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Opportunity Title / Component Scope *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Precision CNC Machined Planetary Gears (Batch 2,000)"
                    value={newLeadForm.title}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, title: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cummins India Heavy Engines"
                    value={newLeadForm.companyName}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, companyName: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Kothari (Head of Sourcing)"
                    value={newLeadForm.contactPerson}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, contactPerson: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sunil.k@cummins.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98221 00000"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Lead Source</label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value as LeadSource })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="INBOUND_WEB">Inbound Web Portal</option>
                    <option value="TRADE_SHOW">Trade Show / IMTEX</option>
                    <option value="REFERRAL">Customer Referral</option>
                    <option value="COLD_OUTREACH">Cold Outreach</option>
                    <option value="PARTNER">Aerospace/Auto Partner</option>
                    <option value="EXISTING_CLIENT">Existing Enterprise Client</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Priority</label>
                  <select
                    value={newLeadForm.priority}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, priority: e.target.value as LeadPriority })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="URGENT">Urgent (Immediate RFQ)</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Estimated Value ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150000"
                    value={newLeadForm.estimatedValue}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, estimatedValue: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Expected Close Date</label>
                  <input
                    type="date"
                    value={newLeadForm.expectedCloseDate}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, expectedCloseDate: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Technical Requirements & Drawing Specs</label>
                  <textarea
                    rows={3}
                    placeholder="Specify material grade (e.g., 42CrMo4 alloy, SS316L), tolerances, surface finishing, batch size, and testing certifications required..."
                    value={newLeadForm.technicalRequirementSummary}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, technicalRequirementSummary: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCaptureModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-medium shadow-md shadow-pink-900/20"
                >
                  Save Lead into Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CLIENT ACCOUNT */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-pink-400" />
                  Add Enterprise Client Account
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Register corporate profile, billing address, and credit sanction limits.
                </p>
              </div>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bharat Heavy Electricals Ltd"
                    value={newClientForm.companyName}
                    onChange={(e) => setNewClientForm({ ...newClientForm, companyName: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Industry Vertical</label>
                  <input
                    type="text"
                    placeholder="e.g. Power Transmission / Heavy Machinery"
                    value={newClientForm.industry}
                    onChange={(e) => setNewClientForm({ ...newClientForm, industry: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Primary Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anil Kumar (Procurement Manager)"
                    value={newClientForm.primaryContactName}
                    onChange={(e) => setNewClientForm({ ...newClientForm, primaryContactName: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="anil.k@bhel.in"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Corporate Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98110 33445"
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Approved Credit Limit ($)</label>
                  <input
                    type="number"
                    value={newClientForm.creditLimit}
                    onChange={(e) => setNewClientForm({ ...newClientForm, creditLimit: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Payment Terms</label>
                  <select
                    value={newClientForm.paymentTerms}
                    onChange={(e) => setNewClientForm({ ...newClientForm, paymentTerms: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="ADVANCE">100% Advance Against Dispatch</option>
                    <option value="NET_30">Net 30 Days</option>
                    <option value="NET_45">Net 45 Days</option>
                    <option value="NET_60">Net 60 Days</option>
                    <option value="LC_SIGHT">Letter of Credit at Sight</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">City & State</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City (e.g. Pune)"
                      value={newClientForm.city}
                      onChange={(e) => setNewClientForm({ ...newClientForm, city: e.target.value })}
                      className="bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="State (e.g. Maharashtra)"
                      value={newClientForm.state}
                      onChange={(e) => setNewClientForm({ ...newClientForm, state: e.target.value })}
                      className="bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Billing Address & Plant Location</label>
                  <input
                    type="text"
                    placeholder="Complete industrial address..."
                    value={newClientForm.billingAddress}
                    onChange={(e) => setNewClientForm({ ...newClientForm, billingAddress: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-medium shadow-md shadow-pink-900/20"
                >
                  Create Client Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NOTES & ACTIVITY TIMELINE */}
      {activeLeadForNotes && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-pink-400">{activeLeadForNotes.leadNumber}</span>
                <h3 className="text-base font-bold text-white line-clamp-1">
                  {activeLeadForNotes.title}
                </h3>
                <div className="text-xs text-slate-400">{activeLeadForNotes.companyName}</div>
              </div>
              <button
                onClick={() => setActiveLeadForNotes(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note History List */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
              {activeLeadForNotes.notes && activeLeadForNotes.notes.length > 0 ? (
                activeLeadForNotes.notes.map((note, idx) => (
                  <div key={idx} className="bg-[#090d16] border border-slate-800/80 p-3 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-300">{note.author}</span>
                      <span className="font-mono">{note.timestamp}</span>
                    </div>
                    <p className="text-slate-200">{note.noteText}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">No notes recorded yet.</div>
              )}
            </div>

            {/* Append Note Input */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                Add Follow-up Note / Client Feedback
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Record call summary, pricing feedback, engineering notes..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  className="flex-1 bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-medium flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

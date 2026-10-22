'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  FileSpreadsheet,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  ExternalLink,
  Award,
  Clock,
  TrendingUp,
  Percent,
  Sliders,
  DollarSign,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import {
  VendorDirectoryItem,
  VendorTierRating,
} from '@/types/supply-chain';

const INITIAL_VENDORS: VendorDirectoryItem[] = [
  {
    id: 'vnd-1',
    vendorCode: 'VND-SUP-001',
    companyName: 'Tata Steel Tubes & Pipes Division',
    contactPerson: 'Anand Mehta',
    email: 'anand.m@tatasteel.internal',
    phone: '+91 98200 44551',
    address: 'Plot 18, Steel Complex',
    city: 'Jamshedpur',
    country: 'India',
    taxIdGstin: '20AAACT2727Q1ZT',
    tierRating: 'TIER_1_STRATEGIC',
    categories: ['RAW_METALS', 'TUBES'],
    leadTimeDaysAvg: 7,
    onTimeDeliveryRate: 98.4,
    qualityScore: 99.1,
    costCompetitiveness: 94.0,
    overallScore: 97.4,
    paymentTerms: 'NET_30',
    isActive: true,
  },
  {
    id: 'vnd-2',
    vendorCode: 'VND-SUP-002',
    companyName: 'SKF Bearings Industrial Fleet',
    contactPerson: 'David Ross',
    email: 'david.ross@skf.internal',
    phone: '+91 97110 99882',
    address: 'Industrial Corridor Zone 4',
    city: 'Bengaluru',
    country: 'India',
    taxIdGstin: '29AABCS8810K1ZP',
    tierRating: 'TIER_1_STRATEGIC',
    categories: ['BEARINGS', 'ROTARY_COMPONENTS'],
    leadTimeDaysAvg: 5,
    onTimeDeliveryRate: 97.8,
    qualityScore: 99.5,
    costCompetitiveness: 91.2,
    overallScore: 96.6,
    paymentTerms: 'NET_45',
    isActive: true,
  },
  {
    id: 'vnd-3',
    vendorCode: 'VND-SUP-003',
    companyName: 'Wacker Silicones & Polymers',
    contactPerson: 'Kavita Nair',
    email: 'kavita@wacker.internal',
    phone: '+91 94220 33119',
    address: 'Chemical Hub Sector 12',
    city: 'Dahej',
    country: 'India',
    taxIdGstin: '24AAACW1190R1ZF',
    tierRating: 'TIER_2_PREFERRED',
    categories: ['SEALS', 'POLYMERS'],
    leadTimeDaysAvg: 10,
    onTimeDeliveryRate: 93.5,
    qualityScore: 96.0,
    costCompetitiveness: 93.0,
    overallScore: 94.2,
    paymentTerms: 'NET_30',
    isActive: true,
  },
  {
    id: 'vnd-4',
    vendorCode: 'VND-SUP-004',
    companyName: 'Hindalco Metal Alloys Corp',
    contactPerson: 'Suresh Singhania',
    email: 'suresh@hindalco.internal',
    phone: '+91 98330 22001',
    address: 'Belgaum Smelter Complex',
    city: 'Belgaum',
    country: 'India',
    taxIdGstin: '29AAACH4401L1Z9',
    tierRating: 'TIER_1_STRATEGIC',
    categories: ['RAW_METALS', 'INGOTS'],
    leadTimeDaysAvg: 4,
    onTimeDeliveryRate: 99.0,
    qualityScore: 98.8,
    costCompetitiveness: 96.0,
    overallScore: 98.2,
    paymentTerms: 'NET_30',
    isActive: true,
  },
  {
    id: 'vnd-5',
    vendorCode: 'VND-SUP-005',
    companyName: 'FastenTech Precision Hardware Ltd',
    contactPerson: 'Nitin Gadkari',
    email: 'nitin@fastentech.internal',
    phone: '+91 94200 66772',
    address: 'Bhosari Industrial Area Block B',
    city: 'Pune',
    country: 'India',
    taxIdGstin: '27AAECF5510M1Z3',
    tierRating: 'TIER_3_TRANSACTIONAL',
    categories: ['FASTENERS', 'HARDWARE'],
    leadTimeDaysAvg: 6,
    onTimeDeliveryRate: 85.0,
    qualityScore: 91.0,
    costCompetitiveness: 88.0,
    overallScore: 87.8,
    paymentTerms: 'NET_15',
    isActive: true,
  },
];

export default function SupplierDirectoryPage() {
  const [vendors, setVendors] = useState<VendorDirectoryItem[]>(INITIAL_VENDORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  // Modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorDirectoryItem | null>(null);

  // New Vendor Form State
  const [newVendorCode, setNewVendorCode] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newTaxGstin, setNewTaxGstin] = useState('');
  const [newCategory, setNewCategory] = useState('RAW_METALS');
  const [newLeadTime, setNewLeadTime] = useState('7');
  const [newTerms, setNewTerms] = useState('NET_30');

  // Evaluation Form State
  const [evalOnTime, setEvalOnTime] = useState('98.0');
  const [evalQuality, setEvalQuality] = useState('99.0');
  const [evalCost, setEvalCost] = useState('95.0');
  const [evalLeadTime, setEvalLeadTime] = useState('7');

  // Filtering
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.vendorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = tierFilter === 'ALL' || v.tierRating === tierFilter;
    return matchesSearch && matchesTier;
  });

  // KPI Calculations
  const activeCount = vendors.filter((v) => v.isActive).length;
  const strategicCount = vendors.filter((v) => v.tierRating === 'TIER_1_STRATEGIC').length;
  const avgLeadTime = (vendors.reduce((s, v) => s + v.leadTimeDaysAvg, 0) / (vendors.length || 1)).toFixed(1);
  const avgScore = (vendors.reduce((s, v) => s + v.overallScore, 0) / (vendors.length || 1)).toFixed(1);

  const handleOpenEnrollModal = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setNewVendorCode(`VND-SUP-${randomSuffix}`);
    setIsEnrollModalOpen(true);
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const newVen: VendorDirectoryItem = {
      id: `vnd-${Date.now()}`,
      vendorCode: newVendorCode,
      companyName: newCompanyName,
      contactPerson: newContactPerson,
      email: newEmail,
      phone: newPhone,
      address: 'Industrial Sector 5',
      city: newCity,
      country: 'India',
      taxIdGstin: newTaxGstin,
      tierRating: 'TIER_2_PREFERRED',
      categories: [newCategory],
      leadTimeDaysAvg: parseInt(newLeadTime, 10) || 7,
      onTimeDeliveryRate: 95.0,
      qualityScore: 96.0,
      costCompetitiveness: 90.0,
      overallScore: 94.1,
      paymentTerms: newTerms,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setVendors([newVen, ...vendors]);
    setIsEnrollModalOpen(false);
  };

  const handleOpenEvaluationModal = (vendor: VendorDirectoryItem) => {
    setSelectedVendor(vendor);
    setEvalOnTime(vendor.onTimeDeliveryRate.toString());
    setEvalQuality(vendor.qualityScore.toString());
    setEvalCost(vendor.costCompetitiveness.toString());
    setEvalLeadTime(vendor.leadTimeDaysAvg.toString());
    setIsEvaluationModalOpen(true);
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    const onTime = parseFloat(evalOnTime) || 90;
    const quality = parseFloat(evalQuality) || 90;
    const cost = parseFloat(evalCost) || 90;
    const leadTime = parseInt(evalLeadTime, 10) || 7;

    const overall = parseFloat((onTime * 0.4 + quality * 0.35 + cost * 0.25).toFixed(1));

    let tier: VendorTierRating = 'TIER_2_PREFERRED';
    if (overall >= 96) tier = 'TIER_1_STRATEGIC';
    else if (overall >= 85) tier = 'TIER_2_PREFERRED';
    else if (overall >= 70) tier = 'TIER_3_TRANSACTIONAL';
    else tier = 'PROBATION';

    setVendors((prev) =>
      prev.map((v) =>
        v.id === selectedVendor.id
          ? {
              ...v,
              onTimeDeliveryRate: onTime,
              qualityScore: quality,
              costCompetitiveness: cost,
              leadTimeDaysAvg: leadTime,
              overallScore: overall,
              tierRating: tier,
            }
          : v
      )
    );

    setIsEvaluationModalOpen(false);
  };

  const getTierBadge = (tier: VendorTierRating) => {
    switch (tier) {
      case 'TIER_1_STRATEGIC':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" />
            TIER 1 STRATEGIC
          </span>
        );
      case 'TIER_2_PREFERRED':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            TIER 2 PREFERRED
          </span>
        );
      case 'TIER_3_TRANSACTIONAL':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
            TIER 3 TRANSACTIONAL
          </span>
        );
      case 'PROBATION':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
            <AlertOctagon className="h-3.5 w-3.5" />
            PROBATION
          </span>
        );
      default:
        return <span className="text-xs text-slate-500 dark:text-slate-400">{tier}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/supply-chain"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Supply Chain Flow Command
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              Supplier Directory &amp; Vendor Performance Scorecards
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Multi-dimensional supplier tiering, contract pricing agreements, lead-time tracking, and automated SLA scorecards.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenEnrollModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Enroll New Supplier
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Suppliers</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{activeCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">approved vendors</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-600 dark:text-cyan-400">Contractually vetted</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tier 1 Strategic Partners</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{strategicCount}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">&gt; 96% SLA</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Critical raw materials &amp; components</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Lead Time</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{avgLeadTime}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">calendar days</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">From PO release to dock arrival</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fleet Composite SLA</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{avgScore}</span>
            <span className="text-xs text-purple-600 dark:text-purple-300">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-600 dark:text-purple-300">Composite Quality + OTIF + Cost</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Supplier, Code, City, Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Tier Rating:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="TIER_1_STRATEGIC">Tier 1 Strategic (&gt; 96%)</option>
            <option value="TIER_2_PREFERRED">Tier 2 Preferred (85-95%)</option>
            <option value="TIER_3_TRANSACTIONAL">Tier 3 Transactional</option>
            <option value="PROBATION">Probation</option>
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white dark:bg-[#0f172a]/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{vendor.companyName}</h3>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">({vendor.vendorCode})</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <span>{vendor.contactPerson}</span>
                  <span>•</span>
                  <span>{vendor.city}, {vendor.country}</span>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400">{vendor.paymentTerms}</span>
                </div>
              </div>

              {getTierBadge(vendor.tierRating)}
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-1.5">
              {vendor.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-mono"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Performance Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Lead Time</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {vendor.leadTimeDaysAvg}d
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400">Order to Dock</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">On-Time OTIF</span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {vendor.onTimeDeliveryRate}%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">SLA 95% Target</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Quality Score</span>
                <span className="text-base font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-0.5 block">
                  {vendor.qualityScore}%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Defect Free</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Cost Competence</span>
                <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5 block">
                  {vendor.costCompetitiveness}%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Index vs Market</span>
              </div>
            </div>

            {/* Scorecard Bar & Composite Score */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Composite Supplier Score:</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{vendor.overallScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      vendor.overallScore >= 96
                        ? 'bg-emerald-500'
                        : vendor.overallScore >= 85
                        ? 'bg-cyan-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, vendor.overallScore)}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleOpenEvaluationModal(vendor)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <Sliders className="h-3 w-3" />
                Audit SLA
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Enroll New Supplier */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Enroll New Strategic Supplier</h3>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vendor Code <span className="text-cyan-600 dark:text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorCode}
                    onChange={(e) => setNewVendorCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Company Name <span className="text-cyan-600 dark:text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    City &amp; Hub
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    GSTIN / Tax ID
                  </label>
                  <input
                    type="text"
                    value={newTaxGstin}
                    onChange={(e) => setNewTaxGstin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="RAW_METALS">RAW_METALS</option>
                    <option value="BEARINGS">BEARINGS</option>
                    <option value="SEALS">SEALS &amp; POLYMERS</option>
                    <option value="FASTENERS">FASTENERS</option>
                    <option value="CHEMICALS">CHEMICALS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    value={newLeadTime}
                    onChange={(e) => setNewLeadTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={newTerms}
                    onChange={(e) => setNewTerms(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Enroll Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Audit Supplier SLA */}
      {isEvaluationModalOpen && selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Audit SLA Performance — {selectedVendor.vendorCode}
                </h3>
              </div>
              <button
                onClick={() => setIsEvaluationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="p-6 space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Supplier: <span className="font-semibold text-slate-900 dark:text-white">{selectedVendor.companyName}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    On-Time Delivery Rate (OTIF %) (40% Weight)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={evalOnTime}
                    onChange={(e) => setEvalOnTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Quality Compliance Score (%) (35% Weight)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={evalQuality}
                    onChange={(e) => setEvalQuality(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Cost Competitiveness Index (%) (25% Weight)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={evalCost}
                    onChange={(e) => setEvalCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Average Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    value={evalLeadTime}
                    onChange={(e) => setEvalLeadTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Preview */}
              {(() => {
                const onTime = parseFloat(evalOnTime) || 0;
                const qual = parseFloat(evalQuality) || 0;
                const cost = parseFloat(evalCost) || 0;
                const score = (onTime * 0.4 + qual * 0.35 + cost * 0.25).toFixed(1);
                return (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Projected Composite Score:</span>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold text-sm">{score} / 100</span>
                  </div>
                );
              })()}

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

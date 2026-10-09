'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  ShieldCheck,
  Calendar,
  Layers,
  Building2,
  DollarSign,
  TrendingDown,
  Clock,
  X,
  FileCheck,
  Sparkles,
  Award,
  Boxes,
} from 'lucide-react';
import {
  MaterialCatalogItem,
  VendorContractTermsItem,
  ContractTermStatus,
} from '@/types/procurement';
import { CostPriceField } from '@/components/pricing';

const INITIAL_CATALOG: MaterialCatalogItem[] = [
  {
    id: 'mat-1',
    itemSku: 'RAW-STL-316-BILLET',
    itemName: 'Stainless Steel 316 Square Billets 100mm',
    category: 'Raw Metals & Alloys',
    description: 'Austenitic chromium-nickel stainless steel billets with molybdenum for corrosion resistance.',
    uom: 'PCS',
    basePrice: 113.6,
    currency: 'USD',
    standardLeadTimeDays: 7,
    minimumOrderQty: 50,
    volumeDiscountTiers: [
      { minQty: 100, maxQty: 249, discountPct: 5, effectiveUnitPrice: 107.92 },
      { minQty: 250, maxQty: 499, discountPct: 8, effectiveUnitPrice: 104.51 },
      { minQty: 500, discountPct: 12, effectiveUnitPrice: 99.97 },
    ],
    approvedVendorsJson: [
      { vendorId: 'vnd-1', vendorName: 'Tata Steel Tubes & Pipes', rank: 1, preferredTier: 'Strategic Tier 1' },
      { vendorId: 'vnd-2', vendorName: 'Kalyani Steels Ltd', rank: 2, preferredTier: 'Preferred Tier 2' },
    ],
    isActive: true,
  },
  {
    id: 'mat-2',
    itemSku: 'RAW-STL-TUBE-80',
    itemName: 'Hydraulic Seamless Steel Tubes 80mm OD',
    category: 'Tubing & Piping',
    description: 'Cold drawn seamless precision steel tubes EN 10305-4 for hydraulic fluid pressure lines.',
    uom: 'MTRS',
    basePrice: 116.0,
    currency: 'USD',
    standardLeadTimeDays: 10,
    minimumOrderQty: 100,
    volumeDiscountTiers: [
      { minQty: 200, maxQty: 499, discountPct: 6, effectiveUnitPrice: 109.04 },
      { minQty: 500, discountPct: 10, effectiveUnitPrice: 104.4 },
    ],
    approvedVendorsJson: [
      { vendorId: 'vnd-1', vendorName: 'Tata Steel Tubes & Pipes', rank: 1, preferredTier: 'Strategic Tier 1' },
      { vendorId: 'vnd-3', vendorName: 'ISMT Steel Pipes Ltd', rank: 2, preferredTier: 'Preferred Tier 2' },
    ],
    isActive: true,
  },
  {
    id: 'mat-3',
    itemSku: 'TOOL-INSRT-CNMG-432',
    itemName: 'CNMG 432 Carbide Turning Inserts TiCN',
    category: 'Cutting Tools & Inserts',
    description: '80-degree rhombic carbide insert with multi-layer PVD coating for medium-to-rough steel turning.',
    uom: 'PCS',
    basePrice: 65.0,
    currency: 'USD',
    standardLeadTimeDays: 5,
    minimumOrderQty: 50,
    volumeDiscountTiers: [
      { minQty: 100, maxQty: 299, discountPct: 5, effectiveUnitPrice: 61.75 },
      { minQty: 300, discountPct: 10, effectiveUnitPrice: 58.5 },
    ],
    approvedVendorsJson: [
      { vendorId: 'vnd-4', vendorName: 'Sandvik Coromant Cutting Tools', rank: 1, preferredTier: 'Strategic Tier 1' },
      { vendorId: 'vnd-5', vendorName: 'Kennametal India Ltd', rank: 2, preferredTier: 'Preferred Tier 2' },
    ],
    isActive: true,
  },
  {
    id: 'mat-4',
    itemSku: 'FAST-HEX-M16-88',
    itemName: 'High-Tensile Zinc Flake Hex Bolt M16x60mm Gr 8.8',
    category: 'Fasteners & Hardware',
    description: 'DIN 933 metric hex head bolts with Geomet anti-corrosion coating.',
    uom: 'PCS',
    basePrice: 0.45,
    currency: 'USD',
    standardLeadTimeDays: 8,
    minimumOrderQty: 2000,
    volumeDiscountTiers: [
      { minQty: 5000, maxQty: 9999, discountPct: 7, effectiveUnitPrice: 0.418 },
      { minQty: 10000, discountPct: 12, effectiveUnitPrice: 0.396 },
    ],
    approvedVendorsJson: [
      { vendorId: 'vnd-6', vendorName: 'Sundram Fasteners Automotive', rank: 1, preferredTier: 'Strategic Tier 1' },
      { vendorId: 'vnd-7', vendorName: 'Apex Fasteners Ltd', rank: 2, preferredTier: 'Preferred Tier 2' },
    ],
    isActive: true,
  },
];

const INITIAL_CONTRACTS: VendorContractTermsItem[] = [
  {
    id: 'vcon-1',
    contractRefNumber: 'VCON-2026-0034',
    vendorId: 'vnd-1',
    vendorName: 'Tata Steel Tubes & Pipes Division',
    contractTitle: 'Annual Seamless Hydraulic Tube Blanket Supply Agreement',
    fixedPeriodStart: '2026-01-01',
    fixedPeriodEnd: '2026-12-31',
    agreedUnitPrice: 104.4,
    priceLockValidUntil: '2026-12-31',
    rebateTerms: '3% annual volume rebate if cumulative orders exceed $150,000.',
    minimumAnnualCommitment: 120000,
    paymentTerms: 'NET_30',
    penaltyClauses: '0.5% per week penalty for unexcused factory dispatch delays exceeding 5 days.',
    status: 'ACTIVE',
    signedByVendor: true,
  },
  {
    id: 'vcon-2',
    contractRefNumber: 'VCON-2026-0038',
    vendorId: 'vnd-4',
    vendorName: 'Sandvik Coromant Cutting Tools',
    contractTitle: 'CNC Carbide Tooling Price Lock & Consignment Stock',
    fixedPeriodStart: '2026-03-01',
    fixedPeriodEnd: '2027-02-28',
    agreedUnitPrice: 58.5,
    priceLockValidUntil: '2027-02-28',
    rebateTerms: 'Consignment inventory maintained on plant site at zero upfront carrying fee.',
    minimumAnnualCommitment: 60000,
    paymentTerms: 'NET_45',
    penaltyClauses: 'Free tool replacement for defective batches verified under microscope.',
    status: 'ACTIVE',
    signedByVendor: true,
  },
  {
    id: 'vcon-3',
    contractRefNumber: 'VCON-2025-0019',
    vendorId: 'vnd-6',
    vendorName: 'Sundram Fasteners Automotive',
    contractTitle: 'Automotive Grade Fasteners Master Supply Terms',
    fixedPeriodStart: '2025-11-01',
    fixedPeriodEnd: '2026-10-31',
    agreedUnitPrice: 0.395,
    priceLockValidUntil: '2026-10-31',
    rebateTerms: 'Quarterly price index adjustments tied to raw wire rod commodity indices.',
    minimumAnnualCommitment: 45000,
    paymentTerms: 'NET_30',
    status: 'EXPIRING_SOON',
    signedByVendor: true,
  },
];

export default function MaterialCatalogPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'contracts'>('catalog');
  const [catalogItems, setCatalogItems] = useState<MaterialCatalogItem[]>(INITIAL_CATALOG);
  const [contractTerms, setContractTerms] = useState<VendorContractTermsItem[]>(INITIAL_CONTRACTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddCatalogModalOpen, setIsAddCatalogModalOpen] = useState(false);
  const [isAddContractModalOpen, setIsAddContractModalOpen] = useState(false);

  // Forms
  const [newCatalog, setNewCatalog] = useState({
    itemSku: '',
    itemName: '',
    category: 'Raw Metals & Alloys',
    description: '',
    uom: 'PCS',
    basePrice: 100,
    standardLeadTimeDays: 7,
    minimumOrderQty: 50,
  });

  const [newContract, setNewContract] = useState({
    vendorName: '',
    contractTitle: '',
    fixedPeriodStart: new Date().toISOString().split('T')[0],
    fixedPeriodEnd: '2027-10-07',
    agreedUnitPrice: 95,
    priceLockValidUntil: '2027-10-07',
    rebateTerms: '2% rebate on annual volume > $100,000',
    minimumAnnualCommitment: 80000,
    paymentTerms: 'NET_30',
  });

  const handleAddCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MaterialCatalogItem = {
      id: `mat-${Date.now()}`,
      itemSku: newCatalog.itemSku,
      itemName: newCatalog.itemName,
      category: newCatalog.category,
      description: newCatalog.description,
      uom: newCatalog.uom,
      basePrice: newCatalog.basePrice,
      currency: 'USD',
      standardLeadTimeDays: newCatalog.standardLeadTimeDays,
      minimumOrderQty: newCatalog.minimumOrderQty,
      volumeDiscountTiers: [
        { minQty: 100, discountPct: 5, effectiveUnitPrice: newCatalog.basePrice * 0.95 },
      ],
      approvedVendorsJson: [
        { vendorId: 'vnd-new', vendorName: 'Direct Approved Supplier', rank: 1, preferredTier: 'Primary Tier' },
      ],
      isActive: true,
    };

    setCatalogItems([created, ...catalogItems]);
    setIsAddCatalogModalOpen(false);
  };

  const handleAddContract = (e: React.FormEvent) => {
    e.preventDefault();
    const count = contractTerms.length + 1;
    const contractRefNumber = `VCON-2026-00${count < 10 ? '0' + count : count}`;

    const created: VendorContractTermsItem = {
      id: `vcon-${Date.now()}`,
      contractRefNumber,
      vendorId: 'vnd-cust',
      vendorName: newContract.vendorName,
      contractTitle: newContract.contractTitle,
      fixedPeriodStart: newContract.fixedPeriodStart,
      fixedPeriodEnd: newContract.fixedPeriodEnd,
      agreedUnitPrice: newContract.agreedUnitPrice,
      priceLockValidUntil: newContract.priceLockValidUntil,
      rebateTerms: newContract.rebateTerms,
      minimumAnnualCommitment: newContract.minimumAnnualCommitment,
      paymentTerms: newContract.paymentTerms,
      status: 'ACTIVE',
      signedByVendor: true,
    };

    setContractTerms([created, ...contractTerms]);
    setIsAddContractModalOpen(false);
  };

  const filteredCatalog = catalogItems.filter((m) => {
    return (
      m.itemSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredContracts = contractTerms.filter((c) => {
    return (
      c.contractRefNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getContractStatusBadge = (s: ContractTermStatus) => {
    switch (s) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'EXPIRING_SOON':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'EXPIRED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'TERMINATED':
        return 'bg-slate-700/30 text-slate-400 border-slate-700/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Material Catalog & Vendor Contract Terms Repository
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Maintain material base prices, volume discount tiers, approved supplier directories, and locked fixed-price supply agreements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'catalog' ? (
            <button
              onClick={() => setIsAddCatalogModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
            >
              <Plus className="h-4 w-4" /> Add Material SKU
            </button>
          ) : (
            <button
              onClick={() => setIsAddContractModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
            >
              <ShieldCheck className="h-4 w-4" /> Register Price Lock Contract
            </button>
          )}
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="h-4 w-4" />
            <span>Material Catalog & Volume Tiers ({catalogItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'contracts'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Vendor Price Lock Agreements ({contractTerms.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search material SKU, category, supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tab Content: Material Catalog */}
      {activeTab === 'catalog' && (
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Material SKU & Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Base Unit Price</th>
                  <th className="py-3 px-4">MOQ & Lead Time</th>
                  <th className="py-3 px-4">Volume Discount Tiers</th>
                  <th className="py-3 px-4">Preferred Suppliers</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-normal">
                {filteredCatalog.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white font-mono">{item.itemSku}</div>
                      <div className="text-slate-200 font-medium mt-0.5">{item.itemName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      ${item.basePrice} <span className="text-xs text-slate-400 font-normal">/ {item.uom}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">MOQ: {item.minimumOrderQty} {item.uom}</div>
                      <div className="text-[11px] text-amber-400">{item.standardLeadTimeDays} days lead time</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.volumeDiscountTiers.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold"
                          >
                            &ge;{t.minQty}: ${t.effectiveUnitPrice} (-{t.discountPct}%)
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-slate-200 font-medium">
                        {item.approvedVendorsJson[0]?.vendorName}
                      </div>
                      <div className="text-[10px] text-emerald-400">
                        {item.approvedVendorsJson[0]?.preferredTier}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active Catalog
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Vendor Price Lock Contracts */}
      {activeTab === 'contracts' && (
        <div className="rounded-xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Contract Ref #</th>
                  <th className="py-3 px-4">Vendor & Agreement Title</th>
                  <th className="py-3 px-4">Locked Unit Rate</th>
                  <th className="py-3 px-4">Price Lock Validity</th>
                  <th className="py-3 px-4">Annual Commitment & Rebate</th>
                  <th className="py-3 px-4">Payment Terms</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-normal">
                {filteredContracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      {c.contractRefNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{c.vendorName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{c.contractTitle}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">
                      ${c.agreedUnitPrice}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{c.priceLockValidUntil}</div>
                      <div className="text-[10px] text-slate-500">From: {c.fixedPeriodStart}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-[11px]">
                      <div className="text-slate-200">
                        Min Spend: ${c.minimumAnnualCommitment?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="text-slate-400 line-clamp-1">{c.rebateTerms}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {c.paymentTerms}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getContractStatusBadge(
                          c.status,
                        )}`}
                      >
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Material Catalog Item */}
      {isAddCatalogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">Add Material to Sourcing Catalog</h3>
              </div>
              <button
                onClick={() => setIsAddCatalogModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCatalog} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Material SKU *</label>
                  <input
                    type="text"
                    required
                    value={newCatalog.itemSku}
                    onChange={(e) => setNewCatalog({ ...newCatalog, itemSku: e.target.value })}
                    placeholder="RAW-STL-304-BAR"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category *</label>
                  <select
                    value={newCatalog.category}
                    onChange={(e) => setNewCatalog({ ...newCatalog, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Raw Metals & Alloys">Raw Metals & Alloys</option>
                    <option value="Tubing & Piping">Tubing & Piping</option>
                    <option value="Cutting Tools & Inserts">Cutting Tools & Inserts</option>
                    <option value="Fasteners & Hardware">Fasteners & Hardware</option>
                    <option value="Chemicals & Lubricants">Chemicals & Lubricants</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Material Name & Grade *</label>
                <input
                  type="text"
                  required
                  value={newCatalog.itemName}
                  onChange={(e) => setNewCatalog({ ...newCatalog, itemName: e.target.value })}
                  placeholder="e.g. Stainless Steel 304 Round Bars 50mm"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <CostPriceField
                    value={newCatalog.basePrice}
                    onChange={(val) => setNewCatalog({ ...newCatalog, basePrice: val })}
                    role="PROCUREMENT_OFFICER"
                    label="Base Price ($) *"
                    currency="$"
                    itemSku={newCatalog.itemSku || 'NEW-CATALOG-SKU'}
                    targetEntity="MaterialCatalog"
                    showBadge={false}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">MOQ</label>
                  <input
                    type="number"
                    value={newCatalog.minimumOrderQty}
                    onChange={(e) =>
                      setNewCatalog({ ...newCatalog, minimumOrderQty: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={newCatalog.standardLeadTimeDays}
                    onChange={(e) =>
                      setNewCatalog({ ...newCatalog, standardLeadTimeDays: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Material Specification Description</label>
                <textarea
                  rows={2}
                  value={newCatalog.description}
                  onChange={(e) => setNewCatalog({ ...newCatalog, description: e.target.value })}
                  placeholder="ASTM A276 standard, cold drawn annealed..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCatalogModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Material to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Price Lock Contract */}
      {isAddContractModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">Register Fixed-Price Supply Agreement</h3>
              </div>
              <button
                onClick={() => setIsAddContractModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddContract} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Contracting Vendor *</label>
                  <input
                    type="text"
                    required
                    value={newContract.vendorName}
                    onChange={(e) => setNewContract({ ...newContract, vendorName: e.target.value })}
                    placeholder="e.g. Tata Steel Division"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Agreed Locked Unit Rate ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newContract.agreedUnitPrice}
                    onChange={(e) =>
                      setNewContract({ ...newContract, agreedUnitPrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Agreement Title *</label>
                <input
                  type="text"
                  required
                  value={newContract.contractTitle}
                  onChange={(e) => setNewContract({ ...newContract, contractTitle: e.target.value })}
                  placeholder="e.g. Annual Hydraulic Tube Price Lock Blanket PO"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Effective Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newContract.fixedPeriodStart}
                    onChange={(e) => setNewContract({ ...newContract, fixedPeriodStart: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Price Lock Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={newContract.priceLockValidUntil}
                    onChange={(e) =>
                      setNewContract({ ...newContract, priceLockValidUntil: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Min Annual Commitment ($)</label>
                  <input
                    type="number"
                    value={newContract.minimumAnnualCommitment}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        minimumAnnualCommitment: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={newContract.paymentTerms}
                    onChange={(e) => setNewContract({ ...newContract, paymentTerms: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Rebate & Volume Discount Conditions</label>
                <input
                  type="text"
                  value={newContract.rebateTerms}
                  onChange={(e) => setNewContract({ ...newContract, rebateTerms: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddContractModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Execute Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

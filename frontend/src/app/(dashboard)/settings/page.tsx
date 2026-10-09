'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sliders,
  MapPin,
  FileSpreadsheet,
  Globe,
  Hash,
  AlertCircle,
  History,
} from 'lucide-react';

interface BranchLocation {
  id: string;
  code: string;
  name: string;
  city: string;
  address: string;
  isPrimary: boolean;
}

interface DynamicAttrKey {
  id: string;
  key: string;
  label: string;
  dataType: 'text' | 'number' | 'boolean' | 'select';
  required: boolean;
  categoryApplicable: string;
}

export default function OwnerSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'branches' | 'attributes'>('general');
  const [isSaved, setIsSaved] = useState(false);

  // 1. Company General Details State
  const [companyName, setCompanyName] = useState('Apex Manufacturing Technologies Ltd.');
  const [gstin, setGstin] = useState('27AAACA1234A1Z5');
  const [pan, setPan] = useState('AAACA1234A');
  const [fiscalYearStart, setFiscalYearStart] = useState('April 1');
  const [currency, setCurrency] = useState('USD ($)');
  const [supportEmail, setSupportEmail] = useState('operations@apex-mfg.com');

  // 2. Plant Branches State
  const [branches, setBranches] = useState<BranchLocation[]>([
    {
      id: 'br-1',
      code: 'PLANT-01',
      name: 'Central Machining & Casting Facility',
      city: 'Pune',
      address: 'Plot 42, MIDC Industrial Area, Chakan',
      isPrimary: true,
    },
    {
      id: 'br-2',
      code: 'PLANT-02',
      name: 'Advanced Hydraulic Assembly & QA Cell',
      city: 'Bengaluru',
      address: 'Phase 2, Peenya Industrial Complex',
      isPrimary: false,
    },
  ]);

  // 3. Dynamic Product Attribute Schema Keys
  const [dynamicAttrs, setDynamicAttrs] = useState<DynamicAttrKey[]>([
    {
      id: 'attr-1',
      key: 'grade',
      label: 'Material / Alloy Grade',
      dataType: 'text',
      required: true,
      categoryApplicable: 'RAW_MATERIAL',
    },
    {
      id: 'attr-2',
      key: 'thickness_mm',
      label: 'Material Thickness (mm)',
      dataType: 'number',
      required: false,
      categoryApplicable: 'RAW_MATERIAL',
    },
    {
      id: 'attr-3',
      key: 'heat_number',
      label: 'Batch Heat Treatment Number',
      dataType: 'text',
      required: false,
      categoryApplicable: 'RAW_MATERIAL',
    },
    {
      id: 'attr-4',
      key: 'operating_pressure_psi',
      label: 'Max Operating Pressure (PSI)',
      dataType: 'number',
      required: true,
      categoryApplicable: 'FINISHED_GOOD',
    },
    {
      id: 'attr-5',
      key: 'durometer_shore_a',
      label: 'Hardness (Shore A)',
      dataType: 'number',
      required: false,
      categoryApplicable: 'CONSUMABLE',
    },
    {
      id: 'attr-6',
      key: 'color',
      label: 'Surface Finish / Color',
      dataType: 'text',
      required: false,
      categoryApplicable: 'FINISHED_GOOD',
    },
  ]);

  // Handler to add new branch
  const addBranch = () => {
    const newBranch: BranchLocation = {
      id: `br-${Date.now()}`,
      code: `PLANT-0${branches.length + 1}`,
      name: 'New Manufacturing Unit',
      city: 'Industrial Zone',
      address: 'Plot #, Sector Area',
      isPrimary: false,
    };
    setBranches([...branches, newBranch]);
  };

  const removeBranch = (id: string) => {
    if (branches.length <= 1) return;
    setBranches(branches.filter((b) => b.id !== id));
  };

  // Handler to add dynamic attribute key
  const addAttribute = () => {
    const newAttr: DynamicAttrKey = {
      id: `attr-${Date.now()}`,
      key: `custom_attr_${dynamicAttrs.length + 1}`,
      label: 'Custom Specification Field',
      dataType: 'text',
      required: false,
      categoryApplicable: 'ALL',
    };
    setDynamicAttrs([...dynamicAttrs, newAttr]);
  };

  const removeAttribute = (id: string) => {
    setDynamicAttrs(dynamicAttrs.filter((a) => a.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Enterprise Configuration & Settings
            </h1>
            <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold uppercase">
              Owner Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage legal statutory details, multi-plant physical infrastructure, and dynamic JSONB product attribute definitions.
          </p>
        </div>

        {/* Global Save Button */}
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-4 py-2.5 shadow-sm transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Global Settings
        </button>
      </div>

      {/* Success Notification Alert */}
      {isSaved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 p-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          Company settings, branch metadata, and dynamic attribute schemas successfully synchronized to database.
        </div>
      )}

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'general'
              ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Building2 className="h-4 w-4" />
          General & Statutory
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'branches'
              ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <MapPin className="h-4 w-4" />
          Plant Branches ({branches.length})
        </button>
        <button
          onClick={() => setActiveTab('attributes')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'attributes'
              ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Sliders className="h-4 w-4" />
          Dynamic Product Attribute Keys ({dynamicAttrs.length})
        </button>
        <Link
          href="/settings/audit"
          className="flex items-center gap-2 border-b-2 border-transparent px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
        >
          <History className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          Audit Trail & Security Ledger
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: General & Statutory Configuration */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#2563EB]" /> Legal Entity Profile
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Registered Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                GSTIN / Tax ID
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-8 pr-3 text-xs font-mono text-slate-900 dark:text-slate-100 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Corporate PAN
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs font-mono text-slate-900 dark:text-slate-100 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#2563EB]" /> Fiscal & Operational Defaults
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Accounting Fiscal Year Start
              </label>
              <input
                type="text"
                value={fiscalYearStart}
                onChange={(e) => setFiscalYearStart(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Standard ERP Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="INR (₹)">INR (₹)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Corporate Inward Operations Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Plant Branches & Locations */}
      {/* ========================================================================= */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure manufacturing sites, machine clusters, and central logistics yards.
            </p>
            <button
              onClick={addBranch}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Plant Site
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branches.map((branch, index) => (
              <div
                key={branch.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#2563EB] dark:text-blue-400">
                      {branch.code}
                    </span>
                    {branch.isPrimary && (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-bold">
                        Primary HQ
                      </span>
                    )}
                  </div>
                  {branches.length > 1 && (
                    <button
                      onClick={() => removeBranch(branch.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove branch"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Facility Name
                  </label>
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) => {
                      const updated = [...branches];
                      updated[index].name = e.target.value;
                      setBranches(updated);
                    }}
                    className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      City
                    </label>
                    <input
                      type="text"
                      value={branch.city}
                      onChange={(e) => {
                        const updated = [...branches];
                        updated[index].city = e.target.value;
                        setBranches(updated);
                      }}
                      className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Address Details
                    </label>
                    <input
                      type="text"
                      value={branch.address}
                      onChange={(e) => {
                        const updated = [...branches];
                        updated[index].address = e.target.value;
                        setBranches(updated);
                      }}
                      className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: Dynamic Product Attribute Key Definitions */}
      {/* ========================================================================= */}
      {activeTab === 'attributes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define dynamic schema keys stored inside the PostgreSQL <span className="font-mono text-[#2563EB]">JSONB customAttrs</span> column of <span className="font-mono font-semibold">ItemMaster</span>.
              </p>
            </div>
            <button
              onClick={addAttribute}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] text-white px-3 py-1.5 text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Attribute Key
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">JSON Key Identifier</th>
                    <th className="py-3 px-4">Display Label</th>
                    <th className="py-3 px-4">Data Type</th>
                    <th className="py-3 px-4">Target Category</th>
                    <th className="py-3 px-4 text-center">Required</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {dynamicAttrs.map((attr, index) => (
                    <tr key={attr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={attr.key}
                          onChange={(e) => {
                            const updated = [...dynamicAttrs];
                            updated[index].key = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                            setDynamicAttrs(updated);
                          }}
                          className="h-8 w-44 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 font-mono text-xs text-[#2563EB] dark:text-blue-400 focus:outline-none focus:border-[#2563EB]"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={attr.label}
                          onChange={(e) => {
                            const updated = [...dynamicAttrs];
                            updated[index].label = e.target.value;
                            setDynamicAttrs(updated);
                          }}
                          className="h-8 w-56 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2563EB]"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={attr.dataType}
                          onChange={(e) => {
                            const updated = [...dynamicAttrs];
                            updated[index].dataType = e.target.value as any;
                            setDynamicAttrs(updated);
                          }}
                          className="h-8 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2563EB]"
                        >
                          <option value="text">String / Text</option>
                          <option value="number">Number (Decimal/Int)</option>
                          <option value="boolean">Boolean (Yes/No)</option>
                          <option value="select">Dropdown Select</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={attr.categoryApplicable}
                          onChange={(e) => {
                            const updated = [...dynamicAttrs];
                            updated[index].categoryApplicable = e.target.value;
                            setDynamicAttrs(updated);
                          }}
                          className="h-8 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2563EB]"
                        >
                          <option value="ALL">All Categories</option>
                          <option value="RAW_MATERIAL">Raw Material</option>
                          <option value="WIP">Work in Progress</option>
                          <option value="FINISHED_GOOD">Finished Good</option>
                          <option value="CONSUMABLE">Consumable</option>
                          <option value="SCRAP">Scrap</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={attr.required}
                          onChange={(e) => {
                            const updated = [...dynamicAttrs];
                            updated[index].required = e.target.checked;
                            setDynamicAttrs(updated);
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => removeAttribute(attr.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Delete attribute"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

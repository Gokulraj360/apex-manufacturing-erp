'use client';

import React, { useState, useMemo } from 'react';
import {
  Scale,
  Search,
  X,
  CheckCircle2,
  Building2,
  Boxes,
  Layers,
  ArrowRightLeft,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Tag,
  Factory,
  Beaker,
  Cpu,
  ShoppingBag,
  HeartPulse,
} from 'lucide-react';
import {
  INDUSTRY_SECTORS,
  INDUSTRY_CATEGORIES,
  MASTER_UOM_LIST,
  IndustrySector,
  convertMeasurement,
  formatQuantityWithUom,
} from '@/lib/industryUomRegistry';
import { franchiseStore, useActiveFranchise } from '@/lib/franchiseStore';

export function UniversalUomModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const activeFranchise = useActiveFranchise();

  const [activeTab, setActiveTab] = useState<'SECTORS' | 'CONVERTER' | 'GUIDE'>('SECTORS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activationFeedback, setActivationFeedback] = useState<string | null>(null);

  // Converter State
  const [calcQty, setCalcQty] = useState<number>(100);
  const [fromUom, setFromUom] = useState<string>('MT');
  const [toUom, setToUom] = useState<string>('kg');
  const [density, setDensity] = useState<number>(1.0);

  const filteredSectors = useMemo(() => {
    return INDUSTRY_SECTORS.filter((s) => {
      const matchesCat = selectedCategory === 'ALL' || s.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const matchesText =
        s.name.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q) ||
        s.primaryUom.toLowerCase().includes(q) ||
        s.supportedUoms.some((u) => u.toLowerCase().includes(q)) ||
        s.sampleRawMaterials.some((m) => m.toLowerCase().includes(q)) ||
        s.sampleFinishedProducts.some((p) => p.toLowerCase().includes(q));

      return matchesCat && matchesText;
    });
  }, [selectedCategory, searchQuery]);

  const conversionResult = useMemo(() => {
    return convertMeasurement(calcQty, fromUom, toUom, density);
  }, [calcQty, fromUom, toUom, density]);

  const handleActivateSector = (sector: IndustrySector) => {
    franchiseStore.activateSector(sector.id);
    setActivationFeedback(`Active industry updated to [${sector.name}]! Primary measurement unit: ${sector.primaryUom}`);
    setTimeout(() => {
      setActivationFeedback(null);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Universal Multi-Franchise Industry &amp; Measurement Units (UOM)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  5 Sectors · 24 Industries
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Standard units of measure (MT, kg, gm, ltr, m³, m, cm, m², Pcs, Unit, sets) dynamically adapted per manufacturing facility.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Feedback Banner */}
        {activationFeedback && (
          <div className="bg-emerald-500 text-white px-5 py-2.5 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-2">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {activationFeedback}
            </span>
            <button onClick={() => setActivationFeedback(null)} className="text-emerald-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('SECTORS')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'SECTORS'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Factory className="w-4 h-4" />
            24 Manufacturing Industries &amp; Units
          </button>
          <button
            onClick={() => setActiveTab('CONVERTER')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'CONVERTER'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Interactive UOM Measurement Converter
          </button>
          <button
            onClick={() => setActiveTab('GUIDE')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'GUIDE'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Universal Measurement Standards Guide
          </button>
        </div>

        {/* TAB 1: 24 MANUFACTURING INDUSTRIES & UOM DIRECTORY */}
        {activeTab === 'SECTORS' && (
          <div className="flex-1 flex flex-col min-h-0 p-5 space-y-4 overflow-y-auto">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search industry or unit (e.g. Steel, MT, m3, Chemical, Textile, Jewellery, Dairy, Cable)..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Showing <strong>{filteredSectors.length}</strong> of 24 Industries
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition ${
                  selectedCategory === 'ALL'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All 5 Sectors (24)
              </button>
              {INDUSTRY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.number}. {cat.name} ({cat.sectors.length})
                </button>
              ))}
            </div>

            {/* Industry Sector Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSectors.map((sector) => {
                const isCurrentActive = activeFranchise.industrySectorId === sector.id;

                return (
                  <div
                    key={sector.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isCurrentActive
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-600/50 shadow-xs ring-1 ring-emerald-500/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {sector.categoryName.split('.')[1]?.trim() || sector.categoryName}
                        </span>
                        {isCurrentActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            Active Plant
                          </span>
                        )}
                      </div>

                      {/* Industry Name */}
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{sector.name}</span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {sector.primaryUom}
                        </span>
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {sector.description}
                      </p>

                      {/* Measurements Matrix */}
                      <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Standard Measurement Units:</span>
                          <div className="flex items-center gap-1">
                            {sector.supportedUoms.map((uom) => (
                              <span
                                key={uom}
                                className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  uom === sector.primaryUom
                                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {uom}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Typical Products: </span>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {sector.sampleFinishedProducts.slice(0, 2).join(' · ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Batch: {sector.typicalBatchSize}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleActivateSector(sector)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isCurrentActive
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        }`}
                      >
                        {isCurrentActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Current Plant
                          </>
                        ) : (
                          <>
                            Activate Industry
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE UOM MEASUREMENT CONVERTER */}
        {activeTab === 'CONVERTER' && (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                Cross-Unit Operational Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Converts material quantities between bulk metric mass (MT, kg, gm), fluid/bulk volume (ltr, m³), linear dimensions (m, cm), and area (m²).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Input Value & Unit */}
              <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    1. Input Quantity
                  </label>
                  <input
                    type="number"
                    value={calcQty}
                    onChange={(e) => setCalcQty(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl font-mono text-base font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Source Unit (From)
                  </label>
                  <select
                    value={fromUom}
                    onChange={(e) => setFromUom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {Object.values(MASTER_UOM_LIST).map((u) => (
                      <option key={u.code} value={u.code}>
                        {u.code} - {u.name} ({u.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Unit & Density */}
              <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    2. Target Unit (To)
                  </label>
                  <select
                    value={toUom}
                    onChange={(e) => setToUom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {Object.values(MASTER_UOM_LIST).map((u) => (
                      <option key={u.code} value={u.code}>
                        {u.code} - {u.name} ({u.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Material Specific Gravity / Density
                    </label>
                    <span className="font-mono text-xs font-bold text-emerald-600">{density} kg/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.05"
                    value={density}
                    onChange={(e) => setDensity(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-slate-400">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setDensity(1.0)}
                      className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                    >
                      Water/Dairy (1.0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDensity(1.25)}
                      className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                    >
                      Paint (1.25)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDensity(2.4)}
                      className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                    >
                      Concrete (2.4)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDensity(7.85)}
                      className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                    >
                      Steel (7.85)
                    </button>
                  </div>
                </div>
              </div>

              {/* Conversion Result Output */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-1">
                    3. Converted Enterprise Quantity
                  </span>
                  <div className="mt-2 font-mono text-3xl font-extrabold text-emerald-900 dark:text-emerald-100">
                    {conversionResult.convertedQty.toLocaleString(undefined, { maximumFractionDigits: 3 })}
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 ml-2">
                      {toUom}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    From: <strong>{calcQty.toLocaleString()} {fromUom}</strong>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div><strong>Formula:</strong> {conversionResult.formula}</div>
                  <div><strong>Note:</strong> {conversionResult.note}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UNIVERSAL MEASUREMENT STANDARDS GUIDE */}
        {activeTab === 'GUIDE' && (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" />
                  Dual-UOM Inventory Tracking (Purchasing vs Shop Floor)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Enterprise manufacturing often purchases raw materials in bulk weight (e.g. <strong>Metric Tons of Steel</strong> or <strong>Kilograms of Polymer</strong>) but dispenses them on the assembly line in linear or discrete measurements (e.g. <strong>Meters of rod</strong> or <strong>Pieces of stamped brackets</strong>). Apex ERP automatically converts procurement units into assembly line bill-of-materials consumption units without rounding loss.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-emerald-600" />
                  Liquid Volume to Mass Conversions
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  In process industries (chemicals, paints, dairy, solvents), materials expand or contract based on ambient facility temperatures. Our dynamic specific gravity multiplier allows weighing inbound road tankers in <strong>Metric Tons (MT)</strong> at the weighbridge while charging reactor vessels in <strong>Liters (ltr)</strong> with automated density calibration.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-600" />
                  High-Precision Electronics &amp; Micro-Measurements
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Discrete semiconductor plants count components in <strong>Pieces (Pcs)</strong> mounted on carrier tape reels, while wire harnesses and flexible circuits are measured in <strong>Centimeters (cm)</strong> and <strong>Meters (m)</strong>. Apex eliminates unit mismatch errors during automated pick-and-place feeder setup.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  Precious Metals &amp; Luxury Consumer Goods
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Jewellery and watchmaking industries require micro-gram precision (<strong>Grams / gm</strong>) for gold and platinum casting grains, while leather goods are tracked in surface area (<strong>Square Meters / m²</strong>). Apex enforces tolerance limits on scrap and swarf recovery down to 0.01 gm.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Active Facility:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{activeFranchise.plantName}</span>
            <span>·</span>
            <span>Primary Unit: <strong className="font-mono text-slate-900 dark:text-white">{activeFranchise.primaryUom}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

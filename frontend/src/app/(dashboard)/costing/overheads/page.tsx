'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Building,
  Wrench,
  ShieldCheck,
  Truck,
  Wind,
  Plus,
  ArrowLeft,
  Edit2,
  Trash2,
  Sliders,
  DollarSign,
  PieChart,
  CheckCircle2,
  Info,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverheadItem {
  id: string;
  title: string;
  category: 'UTILITIES' | 'ENVIRONMENT' | 'INFRASTRUCTURE' | 'MAINTENANCE' | 'COMPLIANCE' | 'LOGISTICS';
  monthlyAmount: number;
  iconKey?: string;
}

export default function PlantOverheadsPage() {
  const [targetVolume, setTargetVolume] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<OverheadItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<OverheadItem['category']>('UTILITIES');
  const [formAmount, setFormAmount] = useState<number>(100000);

  // Initial Expenses List - clean slate empty
  const [overheads, setOverheads] = useState<OverheadItem[]>([]);

  // Load from API
  useEffect(() => {
    async function loadData() {
      try {
        const [ovRes, paramRes] = await Promise.all([
          fetch('/api/plant-overheads'),
          fetch('/api/costing/parameters'),
        ]);

        if (ovRes.ok) {
          const data = await ovRes.json();
          if (Array.isArray(data?.items)) {
            setOverheads(data.items);
          } else if (Array.isArray(data)) {
            setOverheads(data);
          }
        }

        if (paramRes.ok) {
          const pData = await paramRes.json();
          if (pData?.monthlyProductionTargetVolume) {
            setTargetVolume(Number(pData.monthlyProductionTargetVolume));
          }
        }
      } catch {
        // Clean slate fallback
      }
    }
    loadData();
  }, []);

  // Calculations
  const totalMonthlyOverhead = useMemo(() => {
    return overheads.reduce((sum, item) => sum + item.monthlyAmount, 0);
  }, [overheads]);

  const absorbedPerUnit = useMemo(() => {
    if (targetVolume <= 0) return 0;
    return Number((totalMonthlyOverhead / targetVolume).toFixed(2));
  }, [totalMonthlyOverhead, targetVolume]);

  const topExpense = useMemo(() => {
    if (!overheads || overheads.length === 0) return null;
    return [...overheads].sort((a, b) => b.monthlyAmount - a.monthlyAmount)[0];
  }, [overheads]);

  const filteredOverheads = useMemo(() => {
    return overheads.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [overheads, selectedCategory, searchQuery]);

  // Formatters
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-IN').format(val);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('UTILITIES');
    setFormAmount(100000);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: OverheadItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormAmount(item.monthlyAmount);
    setIsModalOpen(true);
  };

  const handleSaveExpense = async () => {
    if (!formTitle.trim()) return;

    if (editingItem) {
      setOverheads((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title: formTitle,
                category: formCategory,
                monthlyAmount: formAmount,
              }
            : item
        )
      );

      try {
        await fetch(`/api/plant-overheads/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle,
            category: formCategory,
            monthlyAmount: formAmount,
          }),
        });
      } catch {
        // Optimistic UI
      }
    } else {
      const tempId = `exp-${Date.now()}`;
      const newItem: OverheadItem = {
        id: tempId,
        title: formTitle,
        category: formCategory,
        monthlyAmount: formAmount,
      };
      setOverheads((prev) => [newItem, ...prev]);

      try {
        const res = await fetch('/api/plant-overheads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle,
            category: formCategory,
            monthlyAmount: formAmount,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          if (created?.id) {
            setOverheads((prev) =>
              prev.map((item) => (item.id === tempId ? { ...item, id: created.id } : item))
            );
          }
        }
      } catch {
        // Optimistic UI
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteExpense = async (id: string) => {
    setOverheads((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/plant-overheads/${id}`, { method: 'DELETE' });
    } catch {
      // Optimistic UI
    }
  };

  const getCategoryBadgeClass = (category: OverheadItem['category']) => {
    switch (category) {
      case 'UTILITIES':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'ENVIRONMENT':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'INFRASTRUCTURE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'MAINTENANCE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'COMPLIANCE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'LOGISTICS':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Navigation Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <Link
            href="/costing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Costing Engine
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Active Plant Operating Overheads
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Configure monthly electricity, nitrogen, cleanroom filtration, and facility leases to calculate unit cost absorption.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Plant Overhead
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Overhead */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Monthly Overheads
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ₹ {(totalMonthlyOverhead / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Exact: {formatINR(totalMonthlyOverhead)} / month
          </div>
        </div>

        {/* Target Production Volume */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Amortization Volume Base
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(targetVolume)} units
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Monthly planned finished devices
          </div>
        </div>

        {/* Absorbed Overhead Per Unit */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Overhead Per Phone (Absorbed)
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatINR(absorbedPerUnit)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Added to direct BOM to establish CP
          </div>
        </div>

        {/* Top Expense Driver */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Top Expense Driver
            </span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {topExpense?.title || 'None Recorded'}
          </div>
          <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
            {topExpense ? formatINR(topExpense.monthlyAmount) : '₹0'} ({topExpense && totalMonthlyOverhead > 0 ? ((topExpense.monthlyAmount / totalMonthlyOverhead) * 100).toFixed(1) : 0}%)
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'UTILITIES', 'ENVIRONMENT', 'INFRASTRUCTURE', 'MAINTENANCE', 'COMPLIANCE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap',
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search overhead expense..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Active Overheads Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Expense Title</th>
                <th className="py-3 px-4">Cost Category</th>
                <th className="py-3 px-4 text-right">Monthly Amount</th>
                <th className="py-3 px-4 text-right">Overhead Share (%)</th>
                <th className="py-3 px-4 text-right">Per-Phone Absorption</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredOverheads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No active plant operating overheads recorded. Click "Add Plant Overhead" to register fixed plant expenses.
                  </td>
                </tr>
              ) : (
                filteredOverheads.map((item) => {
                  const perUnit = targetVolume > 0 ? item.monthlyAmount / targetVolume : 0;
                  const sharePercent = totalMonthlyOverhead > 0
                    ? ((item.monthlyAmount / totalMonthlyOverhead) * 100).toFixed(1)
                    : '0';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                            getCategoryBadgeClass(item.category)
                          )}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                        {formatINR(item.monthlyAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-slate-600 dark:text-slate-400 font-mono">
                        {sharePercent}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-amber-600 dark:text-amber-400">
                        {formatINR(perUnit)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            title="Edit Overhead"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(item.id)}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition"
                            title="Delete Overhead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="bg-slate-50/70 dark:bg-slate-950/50 font-bold border-t-2 border-slate-300 dark:border-slate-700">
              <tr>
                <td colSpan={2} className="py-3 px-4 text-slate-900 dark:text-white">
                  Total Active Monthly Operating Overheads
                </td>
                <td className="py-3 px-4 text-right text-amber-600 dark:text-amber-400 text-base">
                  {formatINR(totalMonthlyOverhead)}
                </td>
                <td className="py-3 px-4 text-right text-xs text-slate-500">100.0%</td>
                <td className="py-3 px-4 text-right text-indigo-600 dark:text-indigo-400 text-base">
                  {formatINR(absorbedPerUnit)} / unit
                </td>
                <td className="py-3 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Plant Overhead */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                {editingItem ? 'Edit Plant Overhead' : 'Add New Plant Overhead'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Expense Description / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cleanroom HEPA HVAC & Recirculation"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Cost Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as OverheadItem['category'])}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="UTILITIES">UTILITIES (Power, Gas, Compressed Air)</option>
                  <option value="ENVIRONMENT">ENVIRONMENT (Cleanroom, HVAC, HEPA)</option>
                  <option value="INFRASTRUCTURE">INFRASTRUCTURE (Plant Lease, ESD Floor)</option>
                  <option value="MAINTENANCE">MAINTENANCE (SMT Tooling, Feeder Calibration)</option>
                  <option value="COMPLIANCE">COMPLIANCE (RoHS, BIS Labs, EHS Audits)</option>
                  <option value="LOGISTICS">LOGISTICS (Intra-Plant Transport, Packaging)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Monthly Budget / Expense Amount (₹)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={50000}
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  At target volume of {formatNumber(targetVolume)} units, this adds {targetVolume > 0 ? formatINR(formAmount / targetVolume) : '₹0'} to per-unit cost.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExpense}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
              >
                {editingItem ? 'Save Changes' : 'Add Overhead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

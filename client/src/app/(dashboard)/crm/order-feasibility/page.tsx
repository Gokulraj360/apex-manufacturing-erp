'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardCheck, ArrowLeft } from 'lucide-react';
import { OrderFeasibilityChecker } from '@/components/OrderFeasibilityChecker';

export default function OrderFeasibilityPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Order Stock Check &amp; Auto-Restock
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Check if you have enough raw materials before accepting a customer order, and order missing items in one click.
          </p>
        </div>

        <Link
          href="/crm"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customer Orders
        </Link>
      </div>

      <OrderFeasibilityChecker />
    </div>
  );
}

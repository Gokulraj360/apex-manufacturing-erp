'use client';

import React from 'react';
import Link from 'next/link';
import { Factory, AlertTriangle, ArrowLeft, LayoutDashboard, LogIn } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 font-sans transition-colors">
      <div className="max-w-md w-full p-8 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            HTTP 404 • ROUTE UNMAPPED
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Workspace Route Not Found
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The requested module route is either undergoing scheduled maintenance or has been relocated to another department cluster.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/pricing-control"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Commercial Hub</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700"
          >
            <LogIn className="h-4 w-4" />
            <span>Login Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

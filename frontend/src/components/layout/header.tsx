'use client';

import { Bell, Search, Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search work orders, SKUs, machines..."
            className="h-9 w-80 rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-4 text-xs focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Plant Status Indicator */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Plant Floor Online
        </div>

        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        {/* Security badge */}
        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 text-xs text-slate-500">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>RBAC Enforced</span>
        </div>
      </div>
    </header>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Factory,
  Boxes,
  Truck,
  Navigation,
  CheckCircle2,
  Wrench,
  Receipt,
  Users,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  Layers,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../theme-provider';

interface ShellProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Sales', href: '/sales', icon: ShoppingBag },
  { name: 'Production', href: '/work-orders', icon: Factory },
  { name: 'Inventory', href: '/inventory', icon: Boxes },
  { name: 'Procurement', href: '/procurement', icon: Truck },
  { name: 'Logistics', href: '/logistics', icon: Navigation },
  { name: 'Quality', href: '/quality', icon: CheckCircle2 },
  { name: 'Maintenance', href: '/machines', icon: Wrench },
  { name: 'Finance', href: '/finance', icon: Receipt },
  { name: 'Workforce', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const plantFilterOptions = [
  { id: 'all', label: 'All Plants' },
  { id: 'plant-1', label: 'Plant 1 (Main Machining)' },
  { id: 'plant-2', label: 'Plant 2 (Assembly & Paint)' },
  { id: 'line-a', label: 'Line A (Hydraulics)' },
  { id: 'line-b', label: 'Line B (Robotics)' },
];

export function Shell({ children }: ShellProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* ========================================================================= */}
      {/* 1. Left Sidebar Navigation */}
      {/* ========================================================================= */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
            <Factory className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
              APEX ERP
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
              Manufacturing OS
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Operations & Modules
          </div>
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200',
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive
                      ? 'text-primary dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500',
                  )}
                />
                <span className="truncate">{item.name}</span>
                {item.name === 'Production' && (
                  <span className="ml-auto rounded-full bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                    Live
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Plant Status */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-950/70 p-2.5 border border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                SCADA / MES Sync
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              99.98%
            </span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. Main Workspace Layout */}
      {/* ========================================================================= */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-6 backdrop-blur-md transition-colors">
          {/* Global Search Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search orders, SKUs, batches, machines (Ctrl+K)..."
                className="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-14 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-400">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Plant / Line Filter Pills */}
          <div className="hidden lg:flex items-center gap-1.5 mx-4 overflow-x-auto py-1">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium mr-1 shrink-0">
              <Building2 className="h-3.5 w-3.5" />
              <span>Scope:</span>
            </div>
            {plantFilterOptions.map((plant) => (
              <button
                key={plant.id}
                onClick={() => setSelectedPlant(plant.id)}
                className={cn(
                  'h-7 rounded-full px-3 text-[11px] font-medium transition-all shrink-0',
                  selectedPlant === plant.id
                    ? 'bg-primary text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/80',
                )}
              >
                {plant.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Notifications, Theme Toggle, Profile */}
          <div className="flex items-center gap-3">
            {/* Notifications Indicator */}
            <button
              onClick={() => setHasNotifications(false)}
              className="relative rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {hasNotifications && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              )}
            </button>

            {/* Theme Toggle (Light / Dark Mode) */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

            {/* User Profile Avatar Badge */}
            <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-sm">
                  SA
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                  Surya Admin
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <span className="rounded bg-blue-100 dark:bg-blue-950/80 px-1.5 py-0.2 text-[9px] font-bold text-blue-700 dark:text-blue-300">
                    OWNER
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Plant #1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Building2,
  ChevronDown,
  Check,
  Shield,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from '../theme-provider';
import { getStoredUser, clearAuthSession, AuthUser, ROLE_LABELS } from '@/lib/auth';

export interface PlantOption {
  id: string;
  name: string;
  type: 'Plant' | 'Line';
  code: string;
}

const plantOptions: PlantOption[] = [
  { id: 'all', name: 'All Plants & Lines', type: 'Plant', code: 'ALL' },
  { id: 'plant-01', name: 'Plant 1 - Main Machining', type: 'Plant', code: 'PL-01' },
  { id: 'plant-02', name: 'Plant 2 - Final Assembly', type: 'Plant', code: 'PL-02' },
  { id: 'line-a', name: 'Line A - Precision Hydraulics', type: 'Line', code: 'LN-HYD-A' },
  { id: 'line-b', name: 'Line B - Robotic Welding Cell', type: 'Line', code: 'LN-WLD-B' },
  { id: 'line-c', name: 'Line C - Electronics & SMT', type: 'Line', code: 'LN-SMT-C' },
];

export function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [selectedPlant, setSelectedPlant] = useState<PlantOption>(plantOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-6 backdrop-blur-md transition-colors">
      {/* 1. Global Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search orders, SKUs, batches, machines (Ctrl+K)..."
            className="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-14 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#2563EB] focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 select-none">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* 2. Center: Plant / Line Filter Pill Dropdown */}
      <div className="relative mx-4" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all shadow-xs',
            isDropdownOpen
              ? 'border-[#2563EB] bg-blue-50/80 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300'
              : 'border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80',
          )}
        >
          <Building2 className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
          <span className="font-semibold">{selectedPlant.name}</span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-slate-400 transition-transform duration-150',
              isDropdownOpen && 'rotate-180 text-[#2563EB]',
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Production Scope
            </div>
            <div className="space-y-0.5">
              {plantOptions.map((plant) => {
                const isSelected = selectedPlant.id === plant.id;
                return (
                  <button
                    key={plant.id}
                    onClick={() => {
                      setSelectedPlant(plant);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left transition-colors',
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                    )}
                  >
                    <div className="flex flex-col">
                      <span>{plant.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {plant.code} · {plant.type}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Right: Notifications, Theme Toggle, Admin Avatar */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={() => setHasUnreadNotifications(false)}
          className="relative rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {hasUnreadNotifications && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]" />
            </span>
          )}
        </button>

        {/* Theme Toggle Button (Sun / Moon) */}
        <button
          type="button"
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

        {/* Authenticated User Profile Avatar Badge */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-sm shadow-blue-500/20">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'MD'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
              {user?.name || 'Plant Owner / MD'}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="rounded bg-blue-100 dark:bg-blue-950/80 px-1.5 py-0.2 text-[9px] font-bold text-[#2563EB] dark:text-blue-300">
                {user?.role || 'TOP_MANAGEMENT'}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Cleanroom OS
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

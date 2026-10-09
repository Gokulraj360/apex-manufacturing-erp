'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Smartphone,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { ALL_ROLES } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [selectedRoleId, setSelectedRoleId] = useState<string>('super_admin');
  const [username, setUsername] = useState<string>('super_admin');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(true);

  const selectedRole = ALL_ROLES.find((r) => r.id === selectedRoleId) || ALL_ROLES[0];

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoleId = e.target.value;
    setSelectedRoleId(newRoleId);
    const roleDef = ALL_ROLES.find((r) => r.id === newRoleId);
    if (roleDef) {
      setUsername(roleDef.defaultUsername);
    }
    setPassword('');
    setErrorMsg('');
  };

  const handleQuickCredentialFill = (roleId: string, user: string, pass: string) => {
    setSelectedRoleId(roleId);
    setUsername(user);
    setPassword(pass);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = await login(selectedRoleId, username, password);
      if (result.success) {
        router.push(selectedRole.dashboardRoute || '/pricing-control');
      } else {
        setErrorMsg(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans transition-colors duration-200">
      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-5 right-5">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/40 shadow-sm text-blue-600 dark:text-blue-400">
            <Smartphone className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              ApexMobile <span className="text-blue-600">ERP</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Easy Smartphone Factory Management & Work System
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Select Your Role & Sign In</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-mono font-semibold">
              Live System
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Role Selection Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your Job Role (Choose from 21 Roles)
              </label>
              <div className="relative">
                <select
                  value={selectedRoleId}
                  onChange={handleRoleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r.id} value={r.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                      {r.name} — [{r.department}]
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {selectedRole.description}
              </p>
            </div>

            {/* 2. Username / ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Username or Staff ID
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter your username or staff ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* 3. Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedRoleId === 'super_admin' ? 'Default: "123"' : 'Default: "1234"'}
                </span>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMsg}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Credential Test Helper Chips */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <HelpCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                Quick-Fill Role Credentials:
              </span>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                {showHint ? 'Hide' : 'Show'}
              </button>
            </div>

            {showHint && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickCredentialFill('super_admin', 'super_admin', '123')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors text-[10px]"
                >
                  <div className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Top Management (MD)
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono mt-0.5">super_admin / 123</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickCredentialFill('finance', 'finance_manager', '1234')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors text-[10px]"
                >
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400">Finance Manager</div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono mt-0.5">finance_mgr / 1234</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickCredentialFill('production', 'production_lead', '1234')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors text-[10px]"
                >
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400">Production Lead</div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono mt-0.5">prod_lead / 1234</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickCredentialFill('warehouse', 'warehouse_mgr', '1234')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors text-[10px]"
                >
                  <div className="font-semibold text-amber-600 dark:text-amber-400">Warehouse Lead</div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono mt-0.5">wh_lead / 1234</div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
          <div>Protected by ApexMobile Enterprise Zero-Trust & RBAC Policy Engine</div>
        </div>
      </div>
    </div>
  );
}

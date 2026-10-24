'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { userCredentialVault, VaultUser } from '@/lib/userCredentialVault';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [emailOrUser, setEmailOrUser] = useState<string>('owner@apexcorp.com');
  const [password, setPassword] = useState<string>('123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDemoDirectory, setShowDemoDirectory] = useState<boolean>(false);

  // Quick auto-fill helper for demo presentation
  const handleQuickFill = (user: VaultUser) => {
    setEmailOrUser(user.email);
    setPassword(user.passwordHash);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = await login(emailOrUser, password);
      if (result.success && result.targetRoute) {
        router.push(result.targetRoute);
      } else {
        setErrorMsg(result.error || 'Authentication failed. Please verify your corporate email and password.');
      }
    } catch {
      setErrorMsg('An unexpected security verification error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allVaultUsers = userCredentialVault.getAllUsers();
  const executiveUsers = allVaultUsers.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans transition-colors duration-200">
      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-5 right-5">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-md space-y-5">
        {/* Universal Enterprise Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Layers className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Apex <span className="text-blue-600">Enterprise OS</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Universal Multi-Franchise Industrial Operating System & ERP
            </p>
          </div>
        </div>

        {/* Corporate Login Card */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Corporate Identity Sign-In</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
              Live Vault
            </span>
          </div>

          {/* Form: Email & Password */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Corporate Email Address / Staff ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Corporate Email Address or Staff ID
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. owner@apexcorp.com, finance@apexcorp.com"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* 2. Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Corporate Password</label>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter corporate account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
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
              <span>{isSubmitting ? 'Authenticating with Vault...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick-Reference Demo Credentials Accordion */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => setShowDemoDirectory(!showDemoDirectory)}
              className="w-full flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Demo Presentation Quick-Fill Directory</span>
              </span>
              {showDemoDirectory ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showDemoDirectory && (
              <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
                <p className="text-[10px] text-slate-400">Click any corporate account below to automatically fill credentials:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {allVaultUsers.slice(0, 8).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickFill(u)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-colors text-[10px] flex flex-col justify-between"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {u.name}
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 font-mono text-[9px] truncate">
                        {u.email}
                      </div>
                      <div className="text-slate-400 text-[9px] flex items-center justify-between mt-0.5">
                        <span className="truncate">{u.badge}</span>
                        <span className="font-mono">pw: {u.passwordHash}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Zero-Trust Enterprise Directory · Role-Based Auto-Routing Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}

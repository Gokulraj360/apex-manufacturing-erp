'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ArrowLeft,
  Lock,
  LogOut,
  AlertTriangle,
  Factory,
} from 'lucide-react';
import {
  getStoredUser,
  clearAuthSession,
  ROLE_LANDING_PAGES,
  ROLE_LABELS,
  AuthUser,
} from '@/lib/auth';

export default function UnauthorizedPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [attemptedUrl, setAttemptedUrl] = useState('');

  useEffect(() => {
    const active = getStoredUser();
    setUser(active);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setAttemptedUrl(params.get('from') || 'Restricted Module');
    }
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  const authorizedHome = user ? (ROLE_LANDING_PAGES[user.role] || '/dashboard') : '/login';
  const roleInfo = user ? ROLE_LABELS[user.role] : null;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
            <Factory className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-white">APEX MANUFACTURING ERP</span>
            <span className="block text-[10px] text-slate-400 font-mono">Cleanroom Boundary Controller</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </header>

      {/* Main 403 Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-rose-500/20 bg-slate-900/95 p-8 shadow-2xl shadow-rose-950/30 backdrop-blur-xl text-center">
            {/* Shield Icon */}
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-5">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div className="inline-block px-3 py-1 mb-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-[11px] font-bold">
              HTTP 403 FORBIDDEN • ISO 9001 COMPLIANCE
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Access Denied: Unauthorized Department
            </h1>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Your role privileges do not grant clearance to access this module. Apex ERP enforces strict shop floor and departmental isolation to guarantee cleanroom compliance and financial segregation.
            </p>

            {/* Role & Boundary Details Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-left space-y-2.5 mb-6 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                <span className="text-slate-400">Current User:</span>
                <span className="font-semibold text-white">{user?.name || 'Unauthenticated'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                <span className="text-slate-400">Assigned Role:</span>
                <span className="font-bold text-blue-400">{user?.role || 'NONE'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                <span className="text-slate-400">Department:</span>
                <span className="text-slate-300">{roleInfo?.dept || 'Unassigned'}</span>
              </div>
              {attemptedUrl && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Attempted Route:</span>
                  <span className="text-rose-400 truncate max-w-[200px]">{attemptedUrl}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={authorizedHome}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white shadow-lg shadow-blue-600/30 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Authorized Department Terminal ({roleInfo?.title || 'Home'})
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
              >
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Switch Account / Sign In with Different Credentials
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Security incident logged with Plant IT Systems Administration.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        Apex Industrial Manufacturing ERP • Role Boundary Isolation Engine
      </footer>
    </div>
  );
}

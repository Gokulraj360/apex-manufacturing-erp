'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { getStoredUser, isRouteAllowed } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isRouteAllowed(user.role, pathname)) {
      router.push(`/unauthorized?from=${encodeURIComponent(pathname)}`);
      return;
    }

    setAuthorized(true);
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Verifying Cleanroom Role Privileges...</span>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-150">
        {/* Fixed Left Sidebar */}
        <Sidebar />

        {/* Main Content Workspace */}
        <div className="flex-1 pl-64 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

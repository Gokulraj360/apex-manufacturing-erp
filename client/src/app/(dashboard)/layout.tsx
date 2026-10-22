'use client';

import React, { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sun, Moon, ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ALL_ROLES } from '@/types/auth';
import { isPathAuthorizedForRole } from '@/config/roleNavigation';

// Route to Title mapping for mobile manufacturing facility
const ROUTE_TITLE_MAP: Record<string, { title: string; badge: string }> = {
  '/credentials': {
    title: 'Staff Onboarding & Security Credentials',
    badge: 'HR-001',
  },
  '/payroll': {
    title: 'Staff Monthly Salaries & Payout Settlement',
    badge: 'FIN-007',
  },
  '/department-payroll': {
    title: 'Department Head Salary & Attendance Desk',
    badge: 'DEPT-009',
  },
  '/leave': {
    title: 'Employee Leave Requests & Approvals',
    badge: 'HR-008',
  },
  '/task-delegation': {
    title: 'Task Assignments & Team Work',
    badge: 'DEL-001',
  },
  '/pricing-control': {
    title: 'Product Cost & Selling Prices',
    badge: 'EMP-001',
  },
  '/super-admin': {
    title: 'Factory Production & Machine Overview',
    badge: 'EMP-001',
  },
  '/production': {
    title: 'Line 1: Circuit Board Assembly Work',
    badge: 'SMT-001',
  },
  '/production/work-orders': {
    title: 'Line 2: Dust-Free Screen Fitting',
    badge: 'DISP-002',
  },
  '/production/batches': {
    title: 'Line 3: Camera Lens Focus & Tuning',
    badge: 'CAM-003',
  },
  '/asset-reliability': {
    title: 'Line 4: Software Loading & 5G Signal Test',
    badge: 'RF-004',
  },
  '/quality': {
    title: 'Line 5: Battery Aging & Drop Resistance Test',
    badge: 'QA-005',
  },
  '/dispatch': {
    title: 'Line 6: Box Packing & Serial Number Sticker',
    badge: 'BOX-006',
  },
  '/warehouse': {
    title: 'Raw Materials & Screen Parts Stock',
    badge: 'WH-001',
  },
  '/warehouse/inventory': {
    title: 'Small Parts Storage Bins & Safety Stock',
    badge: 'BIN-002',
  },
  '/warehouse/locations': {
    title: 'Phone Serial Numbers & SIM Registry',
    badge: 'IMEI-003',
  },
  '/finance': {
    title: 'Factory Accounts & Money Overview',
    badge: 'FIN-006',
  },
  '/hr': {
    title: 'Factory Workers & Shift Rosters',
    badge: 'HR-007',
  },
  '/supply-chain': {
    title: 'Material Planning & Chip Shortage Alerts',
    badge: 'SCM-008',
  },
  '/procurement': {
    title: 'Parts Purchasing & Supplier Orders',
    badge: 'PROC-009',
  },
  '/subcontracting': {
    title: 'External Board Assembly Job-Work',
    badge: 'SUB-010',
  },
  '/design': {
    title: 'Phone Body 3D Designs & Blueprints',
    badge: 'ENG-011',
  },
  '/fleet': {
    title: 'Delivery Trucks & Vehicle Tracker',
    badge: 'FLT-012',
  },
  '/field-service': {
    title: 'Repairs & Customer Warranty Care',
    badge: 'FLD-013',
  },
  '/crm': {
    title: 'Customer Orders & Delivery Planning',
    badge: 'CRM-014',
  },
  '/marketing': {
    title: 'New Phone Launches & Promotions',
    badge: 'MKT-015',
  },
  '/supplier-portal': {
    title: 'B2B Supplier Self-Service Portal & ASN Desk',
    badge: 'SUP-016',
  },
  '/customer-portal': {
    title: 'B2B Commercial Client Portal & Live WIP',
    badge: 'CLI-017',
  },
  '/finance/ap-matching': {
    title: 'Automated 3-Way AP Matching Engine & Tolerance Workbench',
    badge: 'AP-018',
  },
  '/super-admin/rbac-matrix': {
    title: '2D RBAC Permission Matrix & SoD Auditor',
    badge: 'SEC-019',
  },
  '/approvals': {
    title: 'Universal Approvals & Governance Inbox',
    badge: 'APP-020',
  },
  '/legal': {
    title: 'Legal, Contracts & Regulatory Compliance CLM',
    badge: 'LGL-021',
  },
  '/my-workspace': {
    title: 'Employee Self-Service (ESS) Personal Workspace',
    badge: 'ESS-022',
  },
  '/quality/hardware-diagnostics': {
    title: 'Automated Station Hardware Diagnostics Suite',
    badge: 'ATE-023',
  },
  '/portals': {
    title: 'Enterprise Multi-Persona Portal Gallery',
    badge: 'GAL-024',
  },
  '/top-management': {
    title: 'Executive Boardroom C-Suite Cockpit & Working Capital Engine',
    badge: 'EXEC-025',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Determine current page title and badge
  const activeHeader = ROUTE_TITLE_MAP[pathname] || {
    title: 'Factory Work Desk',
    badge: 'EMP-001',
  };

  // User profile display name & email
  const displayName = session?.roleId === 'super_admin'
    ? 'Dr. Rajesh (Owner/MD)'
    : (session?.username || 'Dr. Rajesh (Owner/MD)');

  const displayEmail = session?.roleId === 'super_admin'
    ? 'owner@apexmobile.com'
    : `${(session?.username || 'user').toLowerCase().replace(/\s+/g, '')}@apexmobile.com`;

  const userInitial = displayName.charAt(0).toUpperCase() || 'D';

  // Dynamic authorization verification
  const isAuthorized = useMemo(() => {
    return isPathAuthorizedForRole(pathname, session?.roleId);
  }, [pathname, session?.roleId]);

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header matching reference benchmark */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800 px-6 lg:px-8 flex items-center justify-between z-10 transition-colors duration-200">
          {/* Header Left: Page Title + EMP Badge */}
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {activeHeader.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 flex-shrink-0">
              {activeHeader.badge}
            </span>
          </div>

          {/* Header Right: Role Switcher, Theme Toggle & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick 21-Role Switcher for testing and role navigation scoping */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                Role:
              </span>
              <select
                value={session?.roleId || 'super_admin'}
                onChange={(e) => {
                  const newId = e.target.value;
                  switchRole(newId);
                  const roleObj = ALL_ROLES.find((r) => r.id === newId);
                  if (roleObj?.dashboardRoute) {
                    router.push(roleObj.dashboardRoute);
                  }
                }}
                className="text-xs font-semibold rounded-lg bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r.id} value={r.id} className="bg-white dark:bg-slate-900">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-700/60"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* User Profile matching reference benchmark */}
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {displayName}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {displayEmail}
                </div>
              </div>

              {/* Navy Avatar with white Initial */}
              <div className="w-8 h-8 rounded-full bg-[#1e293b] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc] dark:bg-[#0b0f17] transition-colors duration-200">
          {!isAuthorized ? (
            <div className="max-w-xl mx-auto mt-12 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Operational Module Restricted
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto leading-relaxed">
                Your current role (<span className="font-semibold text-slate-800 dark:text-slate-200">{session?.roleName || 'Operator'}</span>) is not permitted to access <span className="font-semibold text-slate-800 dark:text-slate-200">{activeHeader.title}</span> ({pathname}).
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 text-left">
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-[11px]">
                    Cross-departmental navigation is controlled by the Super Admin Dynamic RBAC Matrix. If this function is required for your station, request an authorization privilege update from Top Management.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const roleObj = ALL_ROLES.find((r) => r.id === session?.roleId);
                  router.push(roleObj?.dashboardRoute || '/pricing-control');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Authorized Department Workspace</span>
              </button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

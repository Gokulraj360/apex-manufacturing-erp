'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sun, Moon, ShieldAlert, ArrowLeft, Lock, Building2, BookOpen, Scale } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { GlobalWorkflowOrchestrator } from '@/components/GlobalWorkflowOrchestrator';
import { ErpDictionaryModal } from '@/components/ErpDictionaryModal';
import { UniversalUomModal } from '@/components/UniversalUomModal';
import { ActiveAndonBanner } from '@/components/AndonAlertModal';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ALL_ROLES } from '@/types/auth';
import { isPathAuthorizedForRole } from '@/config/roleNavigation';
import { franchiseStore, FRANCHISE_PROFILES, FranchiseProfile } from '@/lib/franchiseStore';

// Route to Title mapping for multi-franchise enterprise manufacturing facility
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
    title: 'Plant & Machine Summary',
    badge: 'ADMIN',
  },
  '/production': {
    title: 'Production Floor Overview',
    badge: 'PROD-01',
  },
  '/production/work-orders': {
    title: 'Daily Work Orders',
    badge: 'PROD-02',
  },
  '/production/batches': {
    title: 'Batch Progress & Output',
    badge: 'PROD-03',
  },
  '/asset-reliability': {
    title: 'Machine Servicing & Breakdowns',
    badge: 'MAINT',
  },
  '/quality': {
    title: 'Quality Overview & Pass Rate',
    badge: 'QUAL',
  },
  '/dispatch': {
    title: 'Packing & Shipping Desk',
    badge: 'SHIP',
  },
  '/warehouse': {
    title: 'Raw Materials & Finished Stock',
    badge: 'STOCK',
  },
  '/warehouse/inventory': {
    title: 'Storage Racks & Safety Stock',
    badge: 'RACKS',
  },
  '/warehouse/locations': {
    title: 'Batch Numbers & Tracking',
    badge: 'TRACK',
  },
  '/finance': {
    title: 'Company Accounts & Cash Flow',
    badge: 'ACCTS',
  },
  '/hr': {
    title: 'Staff Shifts & Attendance',
    badge: 'STAFF',
  },
  '/supply-chain': {
    title: 'Material Planning & Low Stock Alerts',
    badge: 'PLAN',
  },
  '/procurement': {
    title: 'Purchase Orders & Buying',
    badge: 'BUY',
  },
  '/subcontracting': {
    title: 'Outside Contractor Job-Work',
    badge: 'JOB',
  },
  '/design': {
    title: 'Product Designs & Recipes',
    badge: 'DESIGN',
  },
  '/fleet': {
    title: 'Delivery Trucks & Live Tracking',
    badge: 'FLEET',
  },
  '/field-service': {
    title: 'Customer Repairs & Warranty',
    badge: 'CARE',
  },
  '/crm': {
    title: 'Customer Orders & Sales',
    badge: 'ORDERS',
  },
  '/crm/order-feasibility': {
    title: 'Order Stock Check & Auto-Restock',
    badge: 'CHECK',
  },
  '/marketing': {
    title: 'New Product Launches & Promotions',
    badge: 'SALES',
  },
  '/supplier-portal': {
    title: 'Supplier Portal & Deliveries',
    badge: 'SUPP',
  },
  '/customer-portal': {
    title: 'Customer Self-Service Portal',
    badge: 'CLIENT',
  },
  '/finance/ap-matching': {
    title: 'Bill vs Delivery Matching',
    badge: 'BILLS',
  },
  '/super-admin/rbac-matrix': {
    title: 'User Permissions & Safety Rules',
    badge: 'ACCESS',
  },
  '/approvals': {
    title: 'Pending Approvals Inbox',
    badge: 'APPROVE',
  },
  '/legal': {
    title: 'Contracts & Safety Compliance',
    badge: 'LEGAL',
  },
  '/my-workspace': {
    title: 'My Personal Desk',
    badge: 'DESK',
  },
  '/quality/hardware-diagnostics': {
    title: 'Equipment Test Checks',
    badge: 'TEST',
  },
  '/portals': {
    title: 'Role Portals View',
    badge: 'PORTALS',
  },
  '/top-management': {
    title: 'Business Overview & Profit',
    badge: 'OWNER',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, switchRole, isLoading } = useAuth();
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
    ? 'owner@apexcorp.com'
    : `${(session?.username || 'user').toLowerCase().replace(/\s+/g, '')}@apexcorp.com`;

  const userInitial = displayName.charAt(0).toUpperCase() || 'D';

  // Dynamic authorization verification
  const isAuthorized = useMemo(() => {
    return isPathAuthorizedForRole(pathname, session?.roleId);
  }, [pathname, session?.roleId]);

  // Active Multi-Franchise Operating Profile
  const [activeFranchise, setActiveFranchise] = useState<FranchiseProfile>(() => franchiseStore.getActiveProfile());
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isUomModalOpen, setIsUomModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    const handleFranchiseChange = () => {
      setActiveFranchise(franchiseStore.getActiveProfile());
    };
    window.addEventListener('apex_franchise_changed', handleFranchiseChange);
    return () => {
      window.removeEventListener('apex_franchise_changed', handleFranchiseChange);
    };
  }, []);

  if (isLoading || !session) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-800 dark:text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Verifying Enterprise Session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header matching reference benchmark */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800 px-6 lg:px-8 flex items-center justify-between z-10 transition-colors duration-200">
          {/* Header Left: Page Title + EMP Badge */}
          <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {activeHeader.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
              {activeHeader.badge}
            </span>
          </div>

          {/* Header Right: Workflow Orchestrator, Franchise Switcher, Role Switcher, Theme Toggle & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Universal Cross-Role Workflow Orchestrator (Available on Every Page) */}
            <GlobalWorkflowOrchestrator />

            {/* Universal Plain-English ERP Dictionary & Cheatsheet */}
            <button
              onClick={() => setIsDictionaryOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/40 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="Open Plain-English ERP Dictionary & Cheatsheet"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline">ERP Cheatsheet</span>
            </button>

            {/* Universal Multi-Franchise Industry & UOM Measurements Hub */}
            <button
              onClick={() => setIsUomModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/40 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="Universal Multi-Franchise Industry & Measurement Units (UOM) Registry"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline">Units ({activeFranchise.primaryUom || 'UOM'})</span>
            </button>

            {/* Universal Multi-Franchise Plant Switcher */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
              title="Active Multi-Franchise Operating Plant"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                Plant:
              </span>
              <select
                value={activeFranchise.id}
                onChange={(e) => {
                  franchiseStore.setActiveProfile(e.target.value);
                  setActiveFranchise(franchiseStore.getActiveProfile());
                }}
                className="text-xs font-semibold rounded-lg bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                {FRANCHISE_PROFILES.map((f) => (
                  <option key={f.id} value={f.id} className="bg-white dark:bg-slate-900">
                    [{f.flag}] {f.name.replace(' Franchise', '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher: Strictly Reserved for Top Admin (Owner/MD) */}
            {session?.roleId === 'super_admin' ? (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Role View:
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
            ) : null}
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
          <ActiveAndonBanner />
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

      {/* Global Searchable ERP Dictionary & Cheatsheet Modal */}
      <ErpDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
      />

      {/* Universal Multi-Franchise Industry & Measurement Units (UOM) Modal */}
      <UniversalUomModal
        isOpen={isUomModalOpen}
        onClose={() => setIsUomModalOpen(false)}
      />
    </div>
  );
}

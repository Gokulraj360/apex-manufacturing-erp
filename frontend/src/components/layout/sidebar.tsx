'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Factory,
  Boxes,
  Truck,
  Scale,
  CheckCircle2,
  Wrench,
  Receipt,
  Users,
  Settings,
  ShieldCheck,
  Activity,
  Cpu,
  Warehouse,
  PackageCheck,
  DollarSign,
  Layers,
  QrCode,
  FileCheck,
  FileSpreadsheet,
  ShieldAlert,
  Coins,
  LogOut,
  Camera,
  Shield,
  FileText,
  Flame,
  KeyRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  UserRole,
  AuthUser,
  getStoredUser,
  clearAuthSession,
  ROLE_LABELS,
} from '@/lib/auth';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

// Strict role menu definitions matching user specification
const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  TOP_MANAGEMENT: [
    { name: 'Executive & Cost Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: 'MD' },
    { name: 'Costing & Overheads', href: '/costing', icon: DollarSign, badge: 'CP/SP' },
    { name: 'Staff Directory & Governance', href: '/settings/staff', icon: Users, badge: 'Staff' },
    { name: 'Dynamic CTC & Credentials', href: '/settings/staff/credentials', icon: KeyRound, badge: 'CTC' },
    { name: 'High-Value Approvals', href: '/settings/approvals', icon: ShieldAlert, badge: '>₹1Cr' },
    { name: 'Plant Audit Trail', href: '/settings/audit', icon: FileText, badge: 'Audit' },
    { name: 'Biometric Attendance & Payroll', href: '/workforce/attendance', icon: Coins, badge: 'Pay' },
  ],
  PRODUCTION_MANAGER: [
    { name: 'Shop Floor Execution', href: '/production/floor', icon: Activity, badge: 'Floor' },
    { name: 'Assembly Capacity Matrix', href: '/inventory/capacity', icon: Layers, badge: 'Cap' },
    { name: 'Serialized IMEI & Telemetry', href: '/production/serialized', icon: QrCode, badge: 'IMEI' },
    { name: 'BOM & Routing Master', href: '/production/bom', icon: Factory, badge: 'Live' },
    { name: 'Shift Attendance & Roster', href: '/workforce/attendance', icon: Coins, badge: 'Shifts' },
  ],
  PURCHASE_MANAGER: [
    { name: 'Procurement & Purchase Orders', href: '/procurement', icon: Truck, badge: 'PO' },
    { name: '3-Way Inward Invoice Matching', href: '/finance/reconciliation', icon: Receipt, badge: '3-Way' },
    { name: 'Department Attendance', href: '/workforce/attendance', icon: Coins },
  ],
  WAREHOUSE_MANAGER: [
    { name: 'Warehouse Bins & Putaway', href: '/inventory/warehouse', icon: Warehouse, badge: 'Bins' },
    { name: 'Component Stock & Capacity', href: '/inventory/capacity', icon: Layers, badge: 'Stock' },
    { name: 'GRN Verification & Rec', href: '/finance/reconciliation', icon: Receipt, badge: 'GRN' },
    { name: 'Department Attendance', href: '/workforce/attendance', icon: Coins },
  ],
  QUALITY_CONTROL: [
    { name: 'Inward IQC Inspection Desk', href: '/quality/inward', icon: CheckCircle2, badge: 'IQC' },
    { name: 'Final CoC Inspection', href: '/quality/final', icon: ShieldCheck, badge: 'CoC' },
    { name: 'Quarantine & RTV Ledger', href: '/finance/debit-notes', icon: Receipt, badge: 'RTV' },
    { name: 'Department Attendance', href: '/workforce/attendance', icon: Coins },
  ],
  PLANT_MAINTENANCE: [
    { name: 'Breakdown & PM Desk', href: '/maintenance', icon: Wrench, badge: 'MNT' },
    { name: 'Machine Master & Health', href: '/machines', icon: Cpu, badge: 'OEE' },
    { name: 'Tooling & Spares Overheads', href: '/costing', icon: DollarSign, badge: 'Tooling' },
    { name: 'Department Attendance', href: '/workforce/attendance', icon: Coins },
  ],
  SALES_DISPATCH: [
    { name: 'Sales Orders & Credit Lock', href: '/sales', icon: ShoppingBag, badge: 'Sales' },
    { name: 'Outward Dispatch & Packing', href: '/logistics/dispatch', icon: PackageCheck, badge: 'Dispatch' },
    { name: 'Department Attendance', href: '/workforce/attendance', icon: Coins },
  ],
  GATE_SECURITY: [
    { name: 'Inward/Outward Gate Register', href: '/logistics/gate', icon: Scale, badge: 'Gate' },
    { name: 'Weighbridge & Camera OCR', href: '/logistics/weighbridge', icon: Camera, badge: 'OCR' },
    { name: 'Department Attendance', href: '/workforce/attendance', icon: Coins },
  ],
  SUBCONTRACTING: [
    { name: 'Job-Work Challans & Scrap', href: '/subcontracting', icon: Boxes, badge: 'Scrap' },
    { name: 'Department Attendance', href: '/workforce/attendance', icon: Coins },
  ],
  FINANCE_ACCOUNTS: [
    { name: 'Financial Statements & Ledger', href: '/finance/statements', icon: FileSpreadsheet, badge: 'GL' },
    { name: 'AP Debit Notes & RTV Ledger', href: '/finance/debit-notes', icon: Receipt, badge: 'AP' },
    { name: 'Statutory GSTR-1 Tax Engine', href: '/finance/gst', icon: FileCheck, badge: 'MFA' },
    { name: 'Department Attendance', href: '/workforce/attendance', icon: Coins },
  ],
  HR_PAYROLL: [
    { name: 'Workforce Directory & Shifts', href: '/workforce', icon: Users, badge: 'HR' },
    { name: 'Biometric Attendance & Payroll', href: '/workforce/attendance', icon: Coins, badge: 'Pay' },
  ],
  EHS_OFFICER: [
    { name: 'Cleanroom Safety & Li-Po Logs', href: '/safety', icon: Flame, badge: 'EHS' },
    { name: 'Department Attendance', href: '/workforce/attendance', icon: Coins },
  ],
  IT_ADMIN: [
    { name: 'System Security & Access Control', href: '/settings/security', icon: Shield, badge: 'IT' },
    { name: 'Workforce Registry', href: '/workforce/attendance', icon: Users, badge: 'Staff' },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const active = getStoredUser();
    setUser(active);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  const activeRole: UserRole = user?.role || 'TOP_MANAGEMENT';
  const navItems = ROLE_NAV_ITEMS[activeRole] || ROLE_NAV_ITEMS.TOP_MANAGEMENT;
  const roleMeta = ROLE_LABELS[activeRole] || { title: activeRole, dept: 'Manufacturing' };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-md shadow-blue-500/20">
          <Factory className="h-5 w-5" />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
            APEX ERP
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Cleanroom OS
          </span>
        </div>
      </div>

      {/* Role Banner Badge */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Authorized Role
        </div>
        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate mt-0.5">
          {mounted ? roleMeta.title : 'Loading...'}
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
          {mounted ? roleMeta.dept : 'Industrial Terminal'}
        </div>
      </div>

      {/* Navigation Items List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Department Modules
        </div>
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200',
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive
                      ? 'text-[#2563EB] dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300',
                  )}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge ? (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide shrink-0',
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-blue-300',
                  )}
                >
                  {item.badge}
                </span>
              ) : isActive ? (
                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400 shrink-0" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer with Active User & Logout */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-950/60 p-2 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user?.name || 'Authorized User'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'Active Session'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out of plant session"
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

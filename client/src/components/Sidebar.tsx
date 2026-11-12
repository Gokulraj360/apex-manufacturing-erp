'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Zap,
  LayoutGrid,
  Layers,
  ClipboardCheck,
  UserCheck,
  CreditCard,
  Warehouse,
  Boxes,
  Barcode,
  Send,
  Grid,
  Truck,
  RotateCcw,
  ShieldAlert,
  Factory,
  Activity,
  ShieldCheck,
  Wrench,
  DollarSign,
  Receipt,
  FileSpreadsheet,
  Users,
  PackageCheck,
  Scale,
  Share2,
  Compass,
  Megaphone,
  LogOut,
  Search,
  Coins,
  Cpu,
  Radio,
  Box,
  ListTodo,
  Calendar,
  Briefcase,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  isPathAuthorizedForRole,
  isCategoryAuthorizedForRole,
  normalizeRoleId,
  ROLE_NAVIGATION_RULES,
} from '@/config/roleNavigation';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavCategory {
  title: string;
  displayTitle: string;
  defaultOpen?: boolean;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { session, activeRole, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [rbacVersion, setRbacVersion] = useState(0);

  // Re-sync navigation state on dynamic RBAC matrix updates
  useEffect(() => {
    const handleRbacUpdate = () => {
      setRbacVersion((v) => v + 1);
    };

    window.addEventListener('storage', handleRbacUpdate);
    window.addEventListener('apex_rbac_updated', handleRbacUpdate);

    return () => {
      window.removeEventListener('storage', handleRbacUpdate);
      window.removeEventListener('apex_rbac_updated', handleRbacUpdate);
    };
  }, []);

  // Active Role determination
  const currentRoleId = session?.roleId || activeRole?.id || 'super_admin';
  const normalizedId = normalizeRoleId(currentRoleId);
  const activeRule = ROLE_NAVIGATION_RULES[normalizedId];

  // Clean, Plain-English Master Categories across all industries
  const masterCategories: NavCategory[] = useMemo(
    () => [
      {
        title: 'TOP MANAGEMENT (OWNER / MD)',
        displayTitle: 'ADMIN & OWNER PANEL',
        defaultOpen: true,
        items: [
          { name: 'Business Overview & Profit', href: '/top-management', icon: Briefcase },
          { name: 'Pending Approvals', href: '/approvals', icon: ClipboardCheck },
          { name: 'Order Stock Check (Can We Fulfill?)', href: '/crm/order-feasibility', icon: PackageCheck },
          { name: 'User Permissions & Safety Rules', href: '/super-admin/rbac-matrix', icon: ShieldCheck },
          { name: 'Product Pricing & Costs', href: '/pricing-control', icon: Coins },
          { name: 'Plant & Machine Summary', href: '/super-admin', icon: LayoutGrid },
          { name: 'Staff Accounts & Logins', href: '/credentials', icon: UserCheck },
          { name: 'Role Portals View', href: '/portals', icon: Users },
        ],
      },
      {
        title: 'FINANCE & ACCOUNTS DESK',
        displayTitle: 'ACCOUNTS & BILLING',
        defaultOpen: true,
        items: [
          { name: 'Company Accounts & Cash Flow', href: '/finance', icon: DollarSign },
          { name: 'Bill vs Delivery Matching', href: '/finance/ap-matching', icon: Receipt },
          { name: 'Supplier Bills', href: '/finance/vendor-bills', icon: Receipt },
          { name: 'Customer Invoices', href: '/finance/invoices', icon: FileSpreadsheet },
          { name: 'Tax & GST Reports', href: '/finance/tax-reports', icon: CreditCard },
          { name: 'Staff Salaries & Payouts', href: '/payroll', icon: CreditCard },
        ],
      },
      {
        title: 'PRECISION ASSEMBLY LINES',
        displayTitle: 'PRODUCTION & FACTORY FLOOR',
        defaultOpen: true,
        items: [
          { name: 'Production Floor Overview', href: '/production', icon: Factory },
          { name: 'Daily Work Orders', href: '/production/work-orders', icon: Layers },
          { name: 'Batch Progress & Output', href: '/production/batches', icon: Activity },
        ],
      },
      {
        title: 'WAREHOUSE & INVENTORY STOCK',
        displayTitle: 'STOCK & WAREHOUSE',
        defaultOpen: true,
        items: [
          { name: 'Raw Materials & Finished Stock', href: '/warehouse', icon: Warehouse },
          { name: 'Storage Racks & Safety Stock', href: '/warehouse/inventory', icon: Boxes },
          { name: 'Batch Numbers & Tracking', href: '/warehouse/locations', icon: Barcode },
        ],
      },
      {
        title: 'QUALITY ASSURANCE & TESTING BENCH',
        displayTitle: 'QUALITY CHECKS',
        defaultOpen: true,
        items: [
          { name: 'Quality Overview & Pass Rate', href: '/quality', icon: ShieldCheck },
          { name: 'Incoming Material Check', href: '/quality/incoming', icon: ShieldCheck },
          { name: 'During-Production Check', href: '/quality/in-process', icon: Activity },
          { name: 'Final Check Before Shipping', href: '/quality/final', icon: ShieldCheck },
          { name: 'Damaged Goods Reports', href: '/quality/ncr', icon: RotateCcw },
        ],
      },
      {
        title: 'BOX PACKING & DISPATCH',
        displayTitle: 'PACKING & SHIPPING',
        defaultOpen: true,
        items: [
          { name: 'Shipping & Dispatch Desk', href: '/dispatch', icon: Send },
          { name: 'Ready-to-Ship Storage Bays', href: '/dispatch/storage', icon: Grid },
          { name: 'Packing Labels & Barcodes', href: '/dispatch/packaging', icon: Barcode },
        ],
      },
      {
        title: 'GATE SECURITY & LOGISTICS',
        displayTitle: 'GATE ENTRY & SECURITY',
        defaultOpen: true,
        items: [
          { name: 'Gate Entry & Truck Check-In', href: '/logistics-gate', icon: ShieldAlert },
        ],
      },
      {
        title: 'HUMAN RESOURCES & STAFF',
        displayTitle: 'STAFF & PAYROLL',
        defaultOpen: true,
        items: [
          { name: 'Staff Shifts & Attendance', href: '/hr', icon: Users },
          { name: 'Staff Accounts & Logins', href: '/credentials', icon: UserCheck },
          { name: 'Monthly Staff Salaries', href: '/payroll', icon: CreditCard },
          { name: 'Department Shift Wages', href: '/department-payroll', icon: Users },
          { name: 'Leave Requests & Balances', href: '/leave', icon: Calendar },
        ],
      },
      {
        title: 'CUSTOMER CARE & ORDERS',
        displayTitle: 'CUSTOMER ORDERS',
        defaultOpen: true,
        items: [
          { name: 'Customer Orders & Sales', href: '/crm', icon: ClipboardCheck },
          { name: 'Order Stock Check (Can We Fulfill?)', href: '/crm/order-feasibility', icon: PackageCheck },
          { name: 'Customer Self-Service Portal', href: '/customer-portal', icon: Share2 },
        ],
      },
      {
        title: 'SUPPLY CHAIN & SOURCING',
        displayTitle: 'MATERIAL PLANNING & SUPPLIERS',
        defaultOpen: true,
        items: [
          { name: 'Material Planning Hub', href: '/supply-chain', icon: PackageCheck },
          { name: 'Supplier Portal', href: '/supplier-portal', icon: Factory },
          { name: 'Low Stock & Shortage Alerts', href: '/supply-chain/mrp', icon: Activity },
          { name: 'Supplier Directory', href: '/supply-chain/vendors', icon: Factory },
        ],
      },
      {
        title: 'DESIGN & CAD R&D',
        displayTitle: 'PRODUCT RECIPES & DESIGN',
        defaultOpen: true,
        items: [
          { name: 'Product Designs & Specs', href: '/design', icon: Compass },
          { name: 'Product Recipe & Materials List', href: '/design/bom-editor', icon: Layers },
        ],
      },
      {
        title: 'FLEET & DELIVERY VEHICLES',
        displayTitle: 'DELIVERY VEHICLES',
        defaultOpen: true,
        items: [
          { name: 'Delivery Trucks & Live Tracking', href: '/fleet', icon: Truck },
        ],
      },
      {
        title: 'MACHINE MAINTENANCE & RELIABILITY',
        displayTitle: 'MACHINE REPAIRS & SERVICE',
        defaultOpen: true,
        items: [
          { name: 'Machine Servicing & Breakdowns', href: '/asset-reliability', icon: Radio },
        ],
      },
      {
        title: 'EXTERNAL SUBCONTRACTORS',
        displayTitle: 'OUTSIDE JOB WORK',
        defaultOpen: true,
        items: [
          { name: 'Outside Contractor Job-Work', href: '/subcontracting', icon: Share2 },
        ],
      },
      {
        title: 'REPAIRS & WARRANTY CARE',
        displayTitle: 'CUSTOMER REPAIRS & WARRANTY',
        defaultOpen: true,
        items: [
          { name: 'Customer Repairs & Warranty', href: '/field-service', icon: Wrench },
        ],
      },
      {
        title: 'PARTS PURCHASING & SOURCING',
        displayTitle: 'PURCHASING & ORDERS',
        defaultOpen: true,
        items: [
          { name: 'Purchase Orders & Buying', href: '/procurement', icon: PackageCheck },
          { name: 'Supplier Portal', href: '/supplier-portal', icon: Factory },
          { name: 'Supplier Price Quotes', href: '/procurement/rfqs', icon: Scale },
          { name: 'Supplier Directory', href: '/supply-chain/vendors', icon: Factory },
        ],
      },
      {
        title: 'MARKETING & PROMOTIONS',
        displayTitle: 'SALES PROMOTIONS',
        defaultOpen: true,
        items: [
          { name: 'New Product Launches', href: '/marketing', icon: Megaphone },
        ],
      },
      {
        title: 'ASSEMBLY FLOOR OPERATIONS',
        displayTitle: 'FLOOR STAFF ALLOCATION',
        defaultOpen: true,
        items: [
          { name: 'Daily Floor Staff Assignment', href: '/department-workforce', icon: Users },
        ],
      },
      {
        title: 'MY ASSEMBLY LINE',
        displayTitle: 'MY WORK STATION',
        defaultOpen: true,
        items: [
          { name: 'Production Floor Overview', href: '/production', icon: Factory },
          { name: 'Daily Work Orders', href: '/production/work-orders', icon: Layers },
        ],
      },
      {
        title: 'FACTORY IT & SYSTEMS',
        displayTitle: 'SYSTEM SETTINGS & USERS',
        defaultOpen: true,
        items: [
          { name: 'System Setup & Settings', href: '/system-admin', icon: ShieldCheck },
          { name: 'System Backups & Restore', href: '/system-admin/backups', icon: Globe },
          { name: 'Staff Accounts & Logins', href: '/credentials', icon: UserCheck },
          { name: 'Role Permissions Setup', href: '/admin/role-permissions', icon: ShieldCheck },
        ],
      },
      {
        title: 'LEGAL, CONTRACTS & COMPLIANCE',
        displayTitle: 'CONTRACTS & COMPLIANCE',
        defaultOpen: true,
        items: [
          { name: 'Contracts & Safety Rules', href: '/legal', icon: Scale },
        ],
      },
      {
        title: 'MY WORKSPACE',
        displayTitle: 'MY PERSONAL DESK',
        defaultOpen: true,
        items: [
          { name: 'My Personal Desk', href: '/my-workspace', icon: UserCheck },
          { name: 'Department Shift Wages', href: '/department-payroll', icon: Users },
          { name: 'My Tasks & Assignments', href: '/task-delegation', icon: ListTodo },
          { name: 'Leave Requests & Approvals', href: '/leave', icon: Calendar },
        ],
      },
    ],
    [],
  );

  // 1. Strictly filter categories by Category Permission AND Item Permission
  // Updates reactively when Super Admin toggles dynamic RBAC permissions
  const roleFilteredCategories = useMemo(() => {
    return masterCategories
      .filter((cat) => isCategoryAuthorizedForRole(cat.title, currentRoleId))
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => isPathAuthorizedForRole(item.href, currentRoleId)),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [masterCategories, currentRoleId, rbacVersion]);

  // 2. Filter items further based on active search query
  const displayedCategories = useMemo(() => {
    if (!searchQuery.trim()) return roleFilteredCategories;
    const q = searchQuery.toLowerCase().trim();
    return roleFilteredCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            cat.displayTitle.toLowerCase().includes(q) ||
            cat.title.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [roleFilteredCategories, searchQuery]);

  const toggleCategory = (title: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className="w-72 flex-shrink-0 bg-white dark:bg-[#0f172a] border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-screen overflow-hidden text-slate-700 dark:text-slate-300 transition-colors duration-200 select-none">
      {/* Brand Header */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0">
          <Link href="/pricing-control" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                Apex Enterprise OS
              </span>
              <span className="text-[10px] text-slate-400">
                Universal Multi-Franchise ERP
              </span>
            </div>
          </Link>
        </div>

        {/* Active Role Scoped Permission Banner */}
        <div className="mx-4 mt-3 mb-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              Department Scoped View
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {session?.roleName || activeRule?.roleTitle || 'Top Management'}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800 shrink-0">
            {normalizedId.toUpperCase().replace(/_/g, ' ')}
          </span>
        </div>

        {/* Quick Search */}
        <div className="px-4 pt-2 pb-1 flex-shrink-0">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search authorized menus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filtered Navigation Categories List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {displayedCategories.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No authorized menus match your search.
            </div>
          ) : (
            displayedCategories.map((cat) => {
              const isCollapsed = collapsedCategories[cat.title] || false;

              return (
                <div key={cat.title} className="space-y-1">
                  {/* Uppercase Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.title)}
                    className="w-full text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 py-1.5 flex items-center justify-between hover:text-slate-600 dark:hover:text-slate-700 dark:text-slate-300 transition-colors text-left"
                  >
                    <span className="truncate">{cat.displayTitle}</span>
                    {isCollapsed ? (
                      <ChevronRight className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Category Items */}
                  {!isCollapsed && (
                    <div className="space-y-0.5">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                          pathname === item.href ||
                          (item.href === '/pricing-control' && (pathname === '/' || pathname === '/pricing-control'));

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all relative font-medium group',
                              isActive
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-semibold shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60',
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-4 w-4 flex-shrink-0 transition-colors',
                                isActive
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-700 dark:text-slate-300',
                              )}
                            />
                            <span className="truncate leading-snug">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Sign Out Action */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] flex-shrink-0">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

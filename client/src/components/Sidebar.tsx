'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Smartphone,
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
  Sparkles,
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

  // Clean, Deduplicated Master Categories across ApexMobile ERP
  const masterCategories: NavCategory[] = useMemo(
    () => [
      {
        title: 'TOP MANAGEMENT (OWNER / MD)',
        defaultOpen: true,
        items: [
          { name: 'Executive Boardroom C-Suite Cockpit', href: '/top-management', icon: Sparkles },
          { name: 'Universal Approvals & Governance Inbox', href: '/approvals', icon: ClipboardCheck },
          { name: 'Multi-Persona Portal Gallery', href: '/portals', icon: Users },
          { name: '2D RBAC Matrix & SoD Auditor', href: '/super-admin/rbac-matrix', icon: ShieldCheck },
          { name: 'Product Cost & Selling Prices', href: '/pricing-control', icon: Coins },
          { name: 'Factory Electricity & Running Costs', href: '/pricing-control?tab=overheads', icon: Zap },
          { name: 'Machine Performance & Plant Uptime', href: '/super-admin', icon: LayoutGrid },
          { name: 'Product Parts List & Recipe Stock', href: '/design/bom-editor', icon: Layers },
          { name: 'Customer Order Feasibility Check', href: '/crm', icon: ClipboardCheck },
          { name: 'Staff Onboarding & Credentials', href: '/credentials', icon: UserCheck },
          { name: 'Staff Monthly Salaries & Payouts', href: '/payroll', icon: CreditCard },
          { name: 'Department Wages & Attendance Desk', href: '/department-payroll', icon: Users },
          { name: 'Dynamic Role Permissions & Matrix', href: '/admin/role-permissions', icon: ShieldCheck },
          { name: 'Salary Credit & Discrepancy Audit', href: '/admin/salary-audit', icon: CreditCard },
        ],
      },
      {
        title: 'FINANCE & ACCOUNTS DESK',
        defaultOpen: true,
        items: [
          { name: 'Factory Accounts & Money Overview', href: '/finance', icon: DollarSign },
          { name: 'Automated 3-Way AP Matching Engine', href: '/finance/ap-matching', icon: Receipt },
          { name: 'Supplier Bills & Invoice Match', href: '/finance/vendor-bills', icon: Receipt },
          { name: 'Customer Bills & Delivery Slips', href: '/finance/invoices', icon: FileSpreadsheet },
          { name: 'Tax & GST Filing Reports', href: '/finance/tax-reports', icon: CreditCard },
          { name: 'Staff Monthly Salaries & Payouts', href: '/payroll', icon: CreditCard },
        ],
      },
      {
        title: 'PRECISION ASSEMBLY LINES',
        defaultOpen: true,
        items: [
          { name: 'Line 1: Precision SMT & Circuit Assembly', href: '/production', icon: Cpu },
          { name: 'Line 2: Subassembly & Component Bonding', href: '/production/work-orders', icon: Layers },
          { name: 'Line 3: Sensor Calibration & Optical Tuning', href: '/production/batches', icon: Activity },
        ],
      },
      {
        title: 'WAREHOUSE & INVENTORY STOCK',
        defaultOpen: true,
        items: [
          { name: 'Raw Materials & Components Stock', href: '/warehouse', icon: Warehouse },
          { name: 'Small Parts Storage Bins & Safety Stock', href: '/warehouse/inventory', icon: Boxes },
          { name: 'Product Serial Numbers & Unit Tracking', href: '/warehouse/locations', icon: Barcode },
        ],
      },
      {
        title: 'QUALITY ASSURANCE & TESTING BENCH',
        defaultOpen: true,
        items: [
          { name: 'Station Hardware Diagnostics Suite', href: '/quality/hardware-diagnostics', icon: Activity },
          { name: 'First-Time Quality Pass Rate', href: '/quality', icon: ShieldCheck },
          { name: 'Incoming Parts Quality Check', href: '/quality/incoming', icon: ShieldCheck },
          { name: 'In-Process Sensor & Optical Tuning', href: '/quality/in-process', icon: Activity },
          { name: 'Pre-Dispatch Quality Stamp & Seals', href: '/quality/final', icon: ShieldCheck },
          { name: 'Quality Issue & Damage Reports', href: '/quality/ncr', icon: RotateCcw },
        ],
      },
      {
        title: 'BOX PACKING & DISPATCH',
        defaultOpen: true,
        items: [
          { name: 'Dispatch Control Center', href: '/dispatch', icon: Send },
          { name: 'Finished Goods & Batch Storage Bays', href: '/dispatch/storage', icon: Grid },
          { name: 'Shipping Box Labels & Stickers', href: '/dispatch/packaging', icon: Barcode },
        ],
      },
      {
        title: 'GATE SECURITY & LOGISTICS',
        defaultOpen: true,
        items: [
          { name: 'Factory Gate Security & Inbound Dock', href: '/logistics-gate', icon: ShieldAlert },
        ],
      },
      {
        title: 'HUMAN RESOURCES & STAFF',
        defaultOpen: true,
        items: [
          { name: 'Factory Shift Rosters & Attendance', href: '/hr', icon: Users },
          { name: 'Staff Onboarding & Credentials', href: '/credentials', icon: UserCheck },
          { name: 'Staff Monthly Salaries & Payouts', href: '/payroll', icon: CreditCard },
          { name: 'Department Worker Wages & Attendance', href: '/department-payroll', icon: Users },
          { name: 'Employee Leave Requests & Approvals', href: '/leave', icon: Calendar },
        ],
      },
      {
        title: 'CUSTOMER CARE & ORDERS',
        defaultOpen: true,
        items: [
          { name: 'Customer Orders & Delivery Planning', href: '/crm', icon: ClipboardCheck },
          { name: 'B2B Commercial Client Portal', href: '/customer-portal', icon: Share2 },
        ],
      },
      {
        title: 'SUPPLY CHAIN & SOURCING',
        defaultOpen: true,
        items: [
          { name: 'Material Planning & Sourcing Hub', href: '/supply-chain', icon: PackageCheck },
          { name: 'B2B Supplier Self-Service Portal', href: '/supplier-portal', icon: Factory },
          { name: 'Chip Stock & Shortage Alerts', href: '/supply-chain/mrp', icon: Activity },
          { name: 'Supplier & Vendor Directory', href: '/supply-chain/vendors', icon: Factory },
        ],
      },
      {
        title: 'DESIGN & CAD R&D',
        defaultOpen: true,
        items: [
          { name: 'Product 3D CAD Designs & Blueprints', href: '/design', icon: Compass },
          { name: 'Product Parts List & Recipe Stock', href: '/design/bom-editor', icon: Layers },
        ],
      },
      {
        title: 'FLEET & DELIVERY VEHICLES',
        defaultOpen: true,
        items: [
          { name: 'Delivery Trucks & Vehicle Tracker', href: '/fleet', icon: Truck },
        ],
      },
      {
        title: 'MACHINE MAINTENANCE & RELIABILITY',
        defaultOpen: true,
        items: [
          { name: 'Machine Maintenance & Servicing', href: '/asset-reliability', icon: Radio },
        ],
      },
      {
        title: 'EXTERNAL SUBCONTRACTORS',
        defaultOpen: true,
        items: [
          { name: 'External Board Assembly Job-Work', href: '/subcontracting', icon: Share2 },
        ],
      },
      {
        title: 'REPAIRS & WARRANTY CARE',
        defaultOpen: true,
        items: [
          { name: 'Repairs & Customer Warranty Care', href: '/field-service', icon: Wrench },
        ],
      },
      {
        title: 'PARTS PURCHASING & SOURCING',
        defaultOpen: true,
        items: [
          { name: 'Parts Purchasing & Ordering', href: '/procurement', icon: PackageCheck },
          { name: 'B2B Supplier Self-Service Portal', href: '/supplier-portal', icon: Factory },
          { name: 'Supplier Price Quotes & Bids', href: '/procurement/rfqs', icon: Scale },
          { name: 'Supplier & Vendor Directory', href: '/supply-chain/vendors', icon: Factory },
        ],
      },
      {
        title: 'MARKETING & PROMOTIONS',
        defaultOpen: true,
        items: [
          { name: 'New Product Launches & Commercial Campaigns', href: '/marketing', icon: Megaphone },
        ],
      },
      {
        title: 'ASSEMBLY FLOOR OPERATIONS',
        defaultOpen: true,
        items: [
          { name: 'Assembly Floor Staff Allocation', href: '/department-workforce', icon: Users },
        ],
      },
      {
        title: 'MY ASSEMBLY LINE',
        defaultOpen: true,
        items: [
          { name: 'Line 1: Circuit Board Assembly Work', href: '/production', icon: Cpu },
          { name: 'Line 2: Dust-Free Screen Fitting', href: '/production/work-orders', icon: Layers },
        ],
      },
      {
        title: 'FACTORY IT & SYSTEMS',
        defaultOpen: true,
        items: [
          { name: 'Serial Number Setup & Factory IT Admin', href: '/system-admin', icon: ShieldCheck },
          { name: 'Web Page Crash Recovery & Rollback', href: '/system-admin/backups', icon: Globe },
          { name: 'Staff Onboarding & Security Credentials', href: '/credentials', icon: UserCheck },
          { name: 'Dynamic Role Permissions & Matrix', href: '/admin/role-permissions', icon: ShieldCheck },
        ],
      },
      {
        title: 'LEGAL, CONTRACTS & COMPLIANCE',
        defaultOpen: true,
        items: [
          { name: 'Legal CLM & Statutory Standards', href: '/legal', icon: Scale },
        ],
      },
      {
        title: 'MY WORKSPACE',
        defaultOpen: true,
        items: [
          { name: 'Employee Self-Service (ESS) Personal Desk', href: '/my-workspace', icon: UserCheck },
          { name: 'Department Worker Wages & Attendance', href: '/department-payroll', icon: Users },
          { name: 'Task Assignments & Team Work', href: '/task-delegation', icon: ListTodo },
          { name: 'Employee Leave Requests & Approvals', href: '/leave', icon: Calendar },
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
          (item) => item.name.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q),
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
                    className="w-full text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 py-1.5 flex items-center justify-between hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-left"
                  >
                    <span className="truncate">{cat.title}</span>
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
                                  : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300',
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

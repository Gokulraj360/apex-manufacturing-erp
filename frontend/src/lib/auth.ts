export type UserRole =
  | 'TOP_MANAGEMENT'
  | 'PRODUCTION_MANAGER'
  | 'PURCHASE_MANAGER'
  | 'WAREHOUSE_MANAGER'
  | 'QUALITY_CONTROL'
  | 'PLANT_MAINTENANCE'
  | 'SALES_DISPATCH'
  | 'GATE_SECURITY'
  | 'SUBCONTRACTING'
  | 'FINANCE_ACCOUNTS'
  | 'HR_PAYROLL'
  | 'EHS_OFFICER'
  | 'IT_ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  salary?: number;
}

export const ROLE_LABELS: Record<UserRole, { title: string; dept: string }> = {
  TOP_MANAGEMENT: { title: 'Plant Owner / MD', dept: 'Executive Command' },
  PRODUCTION_MANAGER: { title: 'Production Manager', dept: 'Manufacturing Operations' },
  PURCHASE_MANAGER: { title: 'Purchase Manager', dept: 'Procurement & Supply Chain' },
  WAREHOUSE_MANAGER: { title: 'Warehouse Manager', dept: 'Stores & Putaway' },
  QUALITY_CONTROL: { title: 'Quality Control Lead', dept: 'QA / QC Cleanroom' },
  PLANT_MAINTENANCE: { title: 'Plant Maintenance Engineer', dept: 'Tooling & Breakdown' },
  SALES_DISPATCH: { title: 'Sales & Dispatch Lead', dept: 'Commercial & Outward' },
  GATE_SECURITY: { title: 'Gate & Weighbridge Officer', dept: 'Security & Weighbridge' },
  SUBCONTRACTING: { title: 'Subcontracting Coordinator', dept: 'Job-Work & Reconciliation' },
  FINANCE_ACCOUNTS: { title: 'Finance & Accounts Head', dept: 'Accounts & Taxation' },
  HR_PAYROLL: { title: 'HR & Payroll Lead', dept: 'Workforce & Compliance' },
  EHS_OFFICER: { title: 'EHS & Safety Officer', dept: 'Environment, Health & Safety' },
  IT_ADMIN: { title: 'IT & Systems Admin', dept: 'IT Infrastructure & Security' },
};

export const ROLE_LANDING_PAGES: Record<UserRole, string> = {
  TOP_MANAGEMENT: '/dashboard',
  PRODUCTION_MANAGER: '/production/floor',
  PURCHASE_MANAGER: '/procurement',
  WAREHOUSE_MANAGER: '/inventory/warehouse',
  QUALITY_CONTROL: '/quality/inward',
  PLANT_MAINTENANCE: '/maintenance',
  SALES_DISPATCH: '/sales',
  GATE_SECURITY: '/logistics/gate',
  SUBCONTRACTING: '/subcontracting',
  FINANCE_ACCOUNTS: '/finance/statements',
  HR_PAYROLL: '/workforce',
  EHS_OFFICER: '/safety',
  IT_ADMIN: '/settings/security',
};

export const ROLE_ALLOWED_ROUTES: Record<UserRole, string[]> = {
  TOP_MANAGEMENT: [
    '/dashboard',
    '/',
    '/costing',
    '/settings/staff',
    '/settings/staff/credentials',
    '/settings/approvals',
    '/settings/audit',
    '/workforce/attendance',
  ],
  PRODUCTION_MANAGER: [
    '/production/floor',
    '/inventory/capacity',
    '/production/serialized',
    '/production/bom',
    '/workforce/attendance',
  ],
  PURCHASE_MANAGER: [
    '/procurement',
    '/finance/reconciliation',
    '/workforce/attendance',
  ],
  WAREHOUSE_MANAGER: [
    '/inventory/warehouse',
    '/inventory/capacity',
    '/finance/reconciliation',
    '/workforce/attendance',
  ],
  QUALITY_CONTROL: [
    '/quality/inward',
    '/quality/final',
    '/finance/debit-notes',
    '/workforce/attendance',
  ],
  PLANT_MAINTENANCE: [
    '/maintenance',
    '/machines',
    '/costing',
    '/workforce/attendance',
  ],
  SALES_DISPATCH: [
    '/sales',
    '/logistics/dispatch',
    '/workforce/attendance',
  ],
  GATE_SECURITY: [
    '/logistics/gate',
    '/logistics/weighbridge',
    '/workforce/attendance',
  ],
  SUBCONTRACTING: [
    '/subcontracting',
    '/workforce/attendance',
  ],
  FINANCE_ACCOUNTS: [
    '/finance/statements',
    '/finance/debit-notes',
    '/finance/gst',
    '/workforce/attendance',
  ],
  HR_PAYROLL: [
    '/workforce',
    '/workforce/attendance',
  ],
  EHS_OFFICER: [
    '/safety',
    '/workforce/attendance',
  ],
  IT_ADMIN: [
    '/settings/security',
    '/workforce/attendance',
  ],
};

/**
 * Checks if a given pathname is allowed for a user role
 */
export function isRouteAllowed(role: UserRole | undefined, pathname: string): boolean {
  if (!role) return false;
  const allowed = ROLE_ALLOWED_ROUTES[role];
  if (!allowed) return false;

  // Exact match or prefix match (e.g. /settings/staff/credentials matches /settings/staff)
  return allowed.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Client-side session helpers
 */
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('apex_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('apex_token');
}

export function setAuthSession(token: string, user: AuthUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('apex_token', token);
  localStorage.setItem('apex_user', JSON.stringify(user));

  // Set cookies for Next.js middleware and SSR
  document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `user_role=${encodeURIComponent(user.role)}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `user_name=${encodeURIComponent(user.name)}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `user_email=${encodeURIComponent(user.email)}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('apex_token');
  localStorage.removeItem('apex_user');

  document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'user_name=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'user_email=; path=/; max-age=0; SameSite=Lax';
}

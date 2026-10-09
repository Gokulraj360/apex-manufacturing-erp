import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

// Role route mappings for Edge runtime
const ROLE_ALLOWED_ROUTES: Record<string, string[]> = {
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

const ROLE_LANDING_PAGES: Record<string, string> = {
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static files, internal Next.js requests, API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Allow public access to login page
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // 3. Extract authentication token and role from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // If unauthenticated: redirect to /login
  if (!authToken || !userRole) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If visiting root '/', redirect to designated role landing page
  if (pathname === '/') {
    const landing = ROLE_LANDING_PAGES[userRole] || '/dashboard';
    return NextResponse.redirect(new URL(landing, request.url));
  }

  // Allow /unauthorized page without infinite loop
  if (pathname === '/unauthorized') {
    return NextResponse.next();
  }

  // 4. Role Authorization check
  const allowedRoutes = ROLE_ALLOWED_ROUTES[userRole];
  if (!allowedRoutes) {
    const unauthUrl = new URL('/unauthorized', request.url);
    unauthUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(unauthUrl);
  }

  const isAllowed = allowedRoutes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isAllowed) {
    const unauthUrl = new URL('/unauthorized', request.url);
    unauthUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(unauthUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

/**
 * ApexMobile ERP - Clean & Deduplicated Role-Based Navigation Configuration
 * 
 * Architecture & Governance Principles:
 * 1. Strict Departmental Scoping: Each of the 21 roles is strictly confined to its core operational domain.
 *    No hardcoded cross-departmental access exists by default.
 * 2. Hierarchical Floor Workflows: Preserves Manager -> Assistant Manager -> Worker task delegation
 *    (/task-delegation), leave requests (/leave), and department wage/attendance submissions (/department-payroll).
 * 3. Dynamic RBAC Matrix Driven: Super Admin can dynamically grant or restrict any operational function
 *    via the Dynamic Role Permissions Matrix (apex_erp_dynamic_rbac_v2). Dynamic grants immediately reveal
 *    the corresponding category and routes; dynamic restrictions immediately hide and block them.
 * 4. Executive Isolation: "TOP MANAGEMENT (OWNER / MD)" is exclusively reserved for Super Admin.
 */

export interface RoleNavigationRule {
  roleId: string;
  roleTitle: string;
  department: string;
  allowedCategoryTitles: string[]; // Allowed category headers for this exact role
  allowedPaths: string[];          // Allowed routes for this exact role
  description: string;
}

export function normalizeRoleId(roleId?: string): string {
  if (!roleId) return 'super_admin';
  const r = roleId.toLowerCase().trim();
  if (r === 'fleet_manager') return 'fleet';
  if (r === 'design_engineer') return 'design';
  if (r === 'marketing_manager') return 'marketing';
  if (r === 'workforce') return 'department_workforce';
  if (r === 'equipment_reliability') return 'asset_reliability';
  return r;
}

export const DYNAMIC_RBAC_STORAGE_KEY = 'apex_erp_dynamic_rbac_v2';

/**
 * Route-to-ERP Function Key mapping for dynamic permission checks.
 */
export const PATH_TO_FUNCTION_KEY: Record<string, string> = {
  '/pricing-control': 'FUNC_PRICING_CONTROL',
  '/super-admin': 'FUNC_EXECUTIVE_COMMAND',
  '/admin/role-permissions': 'FUNC_RBAC_MANAGEMENT',
  '/admin/salary-audit': 'FUNC_PAYROLL_FINAL_SIGNOFF',
  '/finance': 'FUNC_FINANCE_OVERVIEW',
  '/finance/vendor-bills': 'FUNC_VENDOR_BILL_MATCH',
  '/finance/invoices': 'FUNC_CLIENT_INVOICE_GENERATE',
  '/finance/tax-reports': 'FUNC_TAX_GST_FILING',
  '/payroll': 'FUNC_HR_PAYROLL_BATCH_COMPILE',
  '/department-payroll': 'FUNC_PROD_OVERTIME_SUBMIT',
  '/production': 'FUNC_PROD_WORK_ORDER_EXECUTE',
  '/production/work-orders': 'FUNC_PROD_SCREEN_FITTING',
  '/production/batches': 'FUNC_PROD_SMT_CALIBRATION',
  '/warehouse': 'FUNC_WHS_STOCK_MONITOR',
  '/warehouse/inventory': 'FUNC_WHS_BUFFER_RESERVE',
  '/warehouse/locations': 'FUNC_WHS_IMEI_REGISTRATION',
  '/quality': 'FUNC_PROD_LINE_YIELD_REPORT',
  '/quality/incoming': 'FUNC_QA_INCOMING_INSPECTION',
  '/quality/in-process': 'FUNC_QA_OPTICAL_SCAN',
  '/quality/final': 'FUNC_QA_RF_5G_TEST',
  '/quality/ncr': 'FUNC_QA_QUARANTINE_NCR',
  '/dispatch': 'FUNC_WHS_DISPATCH_BOXING',
  '/dispatch/storage': 'FUNC_WHS_BUFFER_RESERVE',
  '/dispatch/packaging': 'FUNC_WHS_DISPATCH_BOXING',
  '/logistics-gate': 'FUNC_GATE_SECURITY_INBOUND',
  '/hr': 'FUNC_HR_SHIFT_ROSTER_LOCK',
  '/credentials': 'FUNC_HR_EMPLOYEE_DIRECTORY',
  '/leave': 'FUNC_HR_LEAVE_APPROVAL',
  '/crm': 'FUNC_CRM_CARRIER_CONTRACTS',
  '/supply-chain': 'FUNC_SCM_PURCHASE_REQUISITION',
  '/supply-chain/mrp': 'FUNC_SCM_MRP_SHORTAGE',
  '/supply-chain/vendors': 'FUNC_SCM_VENDOR_PORTAL',
  '/design': 'FUNC_ENG_CAD_BLUEPRINTS',
  '/design/bom-editor': 'FUNC_ENG_ECN_DESIGN_CHANGE',
  '/fleet': 'FUNC_FLEET_VEHICLE_TRACK',
  '/asset-reliability': 'FUNC_MAINT_ROBOTIC_SERVICING',
  '/subcontracting': 'FUNC_SCM_SUBCONTRACT_JOBWORK',
  '/field-service': 'FUNC_WARRANTY_SERVICE_CARE',
  '/procurement': 'FUNC_SCM_PURCHASE_REQUISITION',
  '/procurement/rfqs': 'FUNC_SCM_PURCHASE_REQUISITION',
  '/marketing': 'FUNC_MKT_LAUNCH_CAMPAIGNS',
  '/department-workforce': 'FUNC_HR_SHIFT_ROSTER_LOCK',
  '/system-admin': 'FUNC_RBAC_MANAGEMENT',
  '/task-delegation': 'FUNC_HR_EMPLOYEE_DIRECTORY',
};

/**
 * Maps category titles to their contained paths for dynamic authorization resolution.
 */
export const CATEGORY_TO_PATHS_MAP: Record<string, string[]> = {
  'TOP MANAGEMENT (OWNER / MD)': [
    '/pricing-control',
    '/super-admin',
    '/admin/role-permissions',
    '/admin/salary-audit',
  ],
  'FINANCE & ACCOUNTS DESK': [
    '/finance',
    '/finance/vendor-bills',
    '/finance/invoices',
    '/finance/tax-reports',
    '/payroll',
  ],
  'PHONE ASSEMBLY LINES': [
    '/production',
    '/production/work-orders',
    '/production/batches',
  ],
  'WAREHOUSE & PARTS STOCK': [
    '/warehouse',
    '/warehouse/inventory',
    '/warehouse/locations',
  ],
  'PHONE QUALITY CHECKS': [
    '/quality',
    '/quality/incoming',
    '/quality/in-process',
    '/quality/final',
    '/quality/ncr',
  ],
  'BOX PACKING & DISPATCH': [
    '/dispatch',
    '/dispatch/storage',
    '/dispatch/packaging',
  ],
  'GATE SECURITY & LOGISTICS': [
    '/logistics-gate',
  ],
  'HUMAN RESOURCES & STAFF': [
    '/hr',
    '/credentials',
    '/payroll',
    '/leave',
  ],
  'CUSTOMER CARE & ORDERS': [
    '/crm',
  ],
  'SUPPLY CHAIN & SOURCING': [
    '/supply-chain',
    '/supply-chain/mrp',
    '/supply-chain/vendors',
  ],
  'DESIGN & CAD R&D': [
    '/design',
    '/design/bom-editor',
  ],
  'FLEET & DELIVERY VEHICLES': [
    '/fleet',
  ],
  'MACHINE MAINTENANCE & RELIABILITY': [
    '/asset-reliability',
  ],
  'EXTERNAL SUBCONTRACTORS': [
    '/subcontracting',
  ],
  'REPAIRS & WARRANTY CARE': [
    '/field-service',
  ],
  'PARTS PURCHASING & SOURCING': [
    '/procurement',
    '/procurement/rfqs',
    '/supply-chain/vendors',
  ],
  'MARKETING & PROMOTIONS': [
    '/marketing',
  ],
  'ASSEMBLY FLOOR OPERATIONS': [
    '/department-workforce',
  ],
  'MY ASSEMBLY LINE': [
    '/production',
    '/production/work-orders',
  ],
  'FACTORY IT & SYSTEMS': [
    '/system-admin',
    '/credentials',
    '/admin/role-permissions',
  ],
  'MY WORKSPACE': [
    '/department-payroll',
    '/task-delegation',
    '/leave',
  ],
};

/**
 * Deduplicated, strictly isolated navigation rules for all 21 manufacturing roles.
 */
export const ROLE_NAVIGATION_RULES: Record<string, RoleNavigationRule> = {
  // 1. Super Admin / Owner / MD - Global Executive Command
  super_admin: {
    roleId: 'super_admin',
    roleTitle: 'Top Management (Owner / MD)',
    department: 'Executive MD Office',
    allowedCategoryTitles: ['*'], // Wildcard: Full unrestricted access
    allowedPaths: ['*'],
    description: 'Executive Command Center, Global Financials, RBAC Matrix, All-Employee Credentials & Salary Setup, and Global Audit Logs.',
  },

  // 2. Factory Accounts & Finance Lead
  finance: {
    roleId: 'finance',
    roleTitle: 'Factory Accounts & Finance Lead',
    department: 'Finance & Accounts',
    allowedCategoryTitles: ['FINANCE & ACCOUNTS DESK', 'MY WORKSPACE'],
    allowedPaths: [
      '/finance',
      '/finance/vendor-bills',
      '/finance/invoices',
      '/finance/tax-reports',
      '/payroll',
      '/task-delegation',
      '/leave',
    ],
    description: 'P&L, Accounts Payable/Receivable, Tax Mapping, Payout Settlement, and Payroll Verification.',
  },

  // 3. Phone Assembly & Screen Fitting Lead
  production: {
    roleId: 'production',
    roleTitle: 'Phone Assembly & Screen Fitting Lead',
    department: 'Phone Assembly Lines',
    allowedCategoryTitles: ['PHONE ASSEMBLY LINES', 'MY WORKSPACE'],
    allowedPaths: [
      '/production',
      '/production/work-orders',
      '/production/batches',
      '/department-payroll',
      '/task-delegation',
      '/leave',
    ],
    description: 'Circuit Board SMT/PCB Assembly Lines, Screen Fitting, Daily Attendance & Wages Calculation, and Leave Requests.',
  },

  // 4. Parts & Phone Inventory Lead (Warehouse Manager)
  warehouse: {
    roleId: 'warehouse',
    roleTitle: 'Parts & Phone Inventory Lead',
    department: 'Warehouse & Inventory',
    allowedCategoryTitles: ['WAREHOUSE & PARTS STOCK', 'MY WORKSPACE'],
    allowedPaths: [
      '/warehouse',
      '/warehouse/inventory',
      '/warehouse/locations',
      '/department-payroll',
      '/task-delegation',
      '/leave',
    ],
    description: 'Raw Materials & Screen Stock, Small Parts Storage Bins, Phone Serial Numbers & SIM Registry, and Department Wages.',
  },

  // 5. Phone Quality & Signal Testing Lead
  quality: {
    roleId: 'quality',
    roleTitle: 'Phone Quality & Signal Testing Lead',
    department: 'Quality Checks',
    allowedCategoryTitles: ['PHONE QUALITY CHECKS', 'MY WORKSPACE'],
    allowedPaths: [
      '/quality',
      '/quality/incoming',
      '/quality/in-process',
      '/quality/final',
      '/quality/ncr',
      '/department-payroll',
      '/task-delegation',
      '/leave',
    ],
    description: 'First-Pass Yield, Screen Optical Check, RF Chamber 5G Test, Battery Drop Tests, and Quality NCR Reports.',
  },

  // 6. Retail Box Packing & Serial Sticker Lead
  dispatch: {
    roleId: 'dispatch',
    roleTitle: 'Retail Box Packing & Serial Sticker Lead',
    department: 'Packing & Dispatch',
    allowedCategoryTitles: ['BOX PACKING & DISPATCH', 'MY WORKSPACE'],
    allowedPaths: [
      '/dispatch',
      '/dispatch/storage',
      '/dispatch/packaging',
      '/department-payroll',
      '/task-delegation',
      '/leave',
    ],
    description: 'Retail Box Packaging Lines, Ready Phones Storage Bays, Shipping Box Labels, and Department Wages.',
  },

  // 7. Factory Gate Security & Receiving Officer
  logistics: {
    roleId: 'logistics',
    roleTitle: 'Factory Gate Security & Receiving Officer',
    department: 'Logistics & Security',
    allowedCategoryTitles: ['GATE SECURITY & LOGISTICS', 'MY WORKSPACE'],
    allowedPaths: [
      '/logistics-gate',
      '/department-payroll',
      '/task-delegation',
      '/leave',
    ],
    description: 'Inbound Dock Verification, Carrier Truck Check, Gate Turnstiles, and Shift Leave Requests.',
  },

  // 8. Factory Workers & Shift Rosters Lead (HR)
  hr: {
    roleId: 'hr',
    roleTitle: 'Factory Workers & Shift Rosters Lead',
    department: 'Human Resources',
    allowedCategoryTitles: ['HUMAN RESOURCES & STAFF', 'MY WORKSPACE'],
    allowedPaths: [
      '/hr',
      '/credentials',
      '/payroll',
      '/department-payroll',
      '/leave',
      '/task-delegation',
    ],
    description: 'Factory Shift Rosters, Staff Onboarding & Credentials, Monthly Payroll Batches, and Leave Approvals.',
  },

  // 9. Phone Brand & Customer Orders Lead (CRM / Sales)
  crm: {
    roleId: 'crm',
    roleTitle: 'Phone Brand & Customer Orders Lead',
    department: 'Sales & Customer Care',
    allowedCategoryTitles: ['CUSTOMER CARE & ORDERS', 'MY WORKSPACE'],
    allowedPaths: [
      '/crm',
      '/task-delegation',
      '/leave',
    ],
    description: 'Telecom Carrier Contracts, Customer Orders, Delivery Planning, and Team Leave Requests.',
  },

  // 10. Material Planning & Sourcing Lead (SCM)
  supply_chain: {
    roleId: 'supply_chain',
    roleTitle: 'Material Planning & Sourcing Lead',
    department: 'Supply Chain & Sourcing',
    allowedCategoryTitles: ['SUPPLY CHAIN & SOURCING', 'MY WORKSPACE'],
    allowedPaths: [
      '/supply-chain',
      '/supply-chain/mrp',
      '/supply-chain/vendors',
      '/task-delegation',
      '/leave',
    ],
    description: 'Material Planning Hub, Chip Stock & MRP Shortages, and Supplier Directory.',
  },

  // 11. Phone Body 3D Design & CAD Engineer
  design: {
    roleId: 'design',
    roleTitle: 'Phone Body 3D Design & CAD Engineer',
    department: 'Design & Engineering',
    allowedCategoryTitles: ['DESIGN & CAD R&D', 'MY WORKSPACE'],
    allowedPaths: [
      '/design',
      '/design/bom-editor',
      '/task-delegation',
      '/leave',
    ],
    description: 'Phone Body 3D Blueprints, BOM Parts List Editor, and Engineering Change Requests (ECN).',
  },

  // 12. Delivery Trucks & Vehicle Tracker Lead (Fleet Manager)
  fleet: {
    roleId: 'fleet',
    roleTitle: 'Delivery Trucks & Vehicle Tracker Lead',
    department: 'Fleet & Delivery',
    allowedCategoryTitles: ['FLEET & DELIVERY VEHICLES', 'MY WORKSPACE'],
    allowedPaths: [
      '/fleet',
      '/department-payroll',
      '/task-delegation',
      '/leave',
    ],
    description: 'Phone Delivery Trucks, GPS Live Tracker, Fuel Expense Management, and Driver Attendance.',
  },

  // 13. Assembly Machines & Cooling Maintenance Lead
  asset_reliability: {
    roleId: 'asset_reliability',
    roleTitle: 'Assembly Machines & Cooling Maintenance Lead',
    department: 'Machine Maintenance',
    allowedCategoryTitles: ['MACHINE MAINTENANCE & RELIABILITY', 'MY WORKSPACE'],
    allowedPaths: [
      '/asset-reliability',
      '/department-payroll',
      '/task-delegation',
      '/leave',
    ],
    description: 'Robotic Pick-and-Place Servicing, Oven Thermal Calibration, and Preventive Maintenance Schedules.',
  },

  // 14. External Board Assembly Job-Work Lead
  subcontracting: {
    roleId: 'subcontracting',
    roleTitle: 'External Board Assembly Job-Work Lead',
    department: 'External Contractors',
    allowedCategoryTitles: ['EXTERNAL SUBCONTRACTORS', 'MY WORKSPACE'],
    allowedPaths: [
      '/subcontracting',
      '/task-delegation',
      '/leave',
    ],
    description: 'External Job-Work Dispatch, Sent Material Delivery Slips, and Subcontractor Yield Tracking.',
  },

  // 15. Repairs & Customer Warranty Care Lead
  field_service: {
    roleId: 'field_service',
    roleTitle: 'Repairs & Customer Warranty Care Lead',
    department: 'Repair & Client Care',
    allowedCategoryTitles: ['REPAIRS & WARRANTY CARE', 'MY WORKSPACE'],
    allowedPaths: [
      '/field-service',
      '/task-delegation',
      '/leave',
    ],
    description: 'Customer Warranty Claims, Screen & Battery Repairs, Service Spare Parts, and Device Return Tracking.',
  },

  // 16. Parts Purchasing & Supplier Orders Lead (Procurement)
  procurement: {
    roleId: 'procurement',
    roleTitle: 'Parts Purchasing & Supplier Orders Lead',
    department: 'Purchasing & Sourcing',
    allowedCategoryTitles: ['PARTS PURCHASING & SOURCING', 'MY WORKSPACE'],
    allowedPaths: [
      '/procurement',
      '/procurement/rfqs',
      '/supply-chain/vendors',
      '/task-delegation',
      '/leave',
    ],
    description: 'Parts Purchase Orders, Supplier RFQ Comparisons, and Vendor Directory.',
  },

  // 17. New Phone Launches & Promotions Manager
  marketing: {
    roleId: 'marketing',
    roleTitle: 'New Phone Launches & Promotions Manager',
    department: 'Marketing & Brand',
    allowedCategoryTitles: ['MARKETING & PROMOTIONS', 'MY WORKSPACE'],
    allowedPaths: [
      '/marketing',
      '/task-delegation',
      '/leave',
    ],
    description: 'Product Launch Campaigns, Retail Promotions, Ad Budget Spend, and Campaign Results.',
  },

  // 18. Assembly Floor Staff Allocation Specialist
  department_workforce: {
    roleId: 'department_workforce',
    roleTitle: 'Assembly Floor Staff Allocation Specialist',
    department: 'Assembly Operations',
    allowedCategoryTitles: ['ASSEMBLY FLOOR OPERATIONS', 'MY WORKSPACE'],
    allowedPaths: [
      '/department-workforce',
      '/department-payroll',
      '/task-delegation',
      '/leave',
    ],
    description: 'Daily Floor Allocation, Worker Placement Across Lines, Attendance Records, and Department Wages.',
  },

  // 19. Robotic Machine & Heating Oven Technician
  maintenance_tech: {
    roleId: 'maintenance_tech',
    roleTitle: 'Robotic Machine & Heating Oven Technician',
    department: 'Machine Maintenance',
    allowedCategoryTitles: ['MACHINE MAINTENANCE & RELIABILITY', 'MY WORKSPACE'],
    allowedPaths: [
      '/asset-reliability',
      '/task-delegation',
      '/leave',
    ],
    description: 'Robotic Feeder Maintenance, Oven Thermal Sensors, Preventive Checklists, and Leave Submissions.',
  },

  // 20. Dust-Free Screen Assembly & Bonding Operator
  plant_operator: {
    roleId: 'plant_operator',
    roleTitle: 'Dust-Free Screen Assembly & Bonding Operator',
    department: 'Shop Floor Assembly',
    allowedCategoryTitles: ['MY ASSEMBLY LINE', 'MY WORKSPACE'],
    allowedPaths: [
      '/production',
      '/production/work-orders',
      '/task-delegation',
      '/leave',
    ],
    description: 'Cleanroom Screen Laminating, Battery Connector Assembly, Personal Leave Requests, and Shift Tasks.',
  },

  // 21. Serial Number Setup & Factory IT Admin
  system_admin: {
    roleId: 'system_admin',
    roleTitle: 'Serial Number Setup & Factory IT Admin',
    department: 'IT & Factory Systems',
    allowedCategoryTitles: ['FACTORY IT & SYSTEMS', 'MY WORKSPACE'],
    allowedPaths: [
      '/system-admin',
      '/credentials',
      '/admin/role-permissions',
      '/task-delegation',
      '/leave',
    ],
    description: 'Factory IT Servers, Software Flashing Setup, Dynamic Role Permissions, and Credentials Management.',
  },
};

/**
 * Reads dynamic overrides from localStorage (configured by Super Admin).
 */
export function getDynamicOverridesForRole(roleId?: string): Record<string, boolean> {
  const normalized = normalizeRoleId(roleId);
  if (normalized === 'super_admin') return {};

  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(DYNAMIC_RBAC_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed[normalized] || {};
  } catch {
    return {};
  }
}

/**
 * Checks if a specific path or URL is authorized for the given role,
 * taking into account baseline role boundaries and Super Admin dynamic overrides.
 */
export function isPathAuthorizedForRole(targetHref: string, roleId?: string): boolean {
  const normalized = normalizeRoleId(roleId);

  // Super admin always has unrestricted wildcard access
  if (normalized === 'super_admin') {
    return true;
  }

  // Strip query params and hashes for route evaluation
  const cleanTarget = targetHref.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';

  // Hard barrier: Top management executive routes are strictly forbidden for non-super_admin roles
  // (unless system_admin explicitly accesses /admin/role-permissions)
  const isTopMgmtRoute = cleanTarget === '/pricing-control' || cleanTarget === '/super-admin' || cleanTarget === '/admin/salary-audit';
  if (isTopMgmtRoute) {
    return false;
  }

  // System admin can access /admin/role-permissions
  if (cleanTarget === '/admin/role-permissions' && normalized === 'system_admin') {
    return true;
  }

  // Look up mapped function key for this route
  const functionKey = PATH_TO_FUNCTION_KEY[cleanTarget] ||
    Object.keys(PATH_TO_FUNCTION_KEY).find((path) => cleanTarget.startsWith(path + '/'))
      ? PATH_TO_FUNCTION_KEY[Object.keys(PATH_TO_FUNCTION_KEY).find((path) => cleanTarget.startsWith(path + '/'))!]
      : undefined;

  // Check dynamic overrides configured by Super Admin in the RBAC matrix
  const overrides = getDynamicOverridesForRole(normalized);
  if (functionKey && overrides[functionKey] !== undefined) {
    // Explicit dynamic override takes absolute precedence
    return overrides[functionKey];
  }

  // Check baseline role navigation rule
  const rule = ROLE_NAVIGATION_RULES[normalized];
  if (!rule) {
    return false;
  }

  if (rule.allowedPaths.includes('*')) {
    return true;
  }

  // Always permit universal employee hierarchical workflow routes: task delegation and leave
  if (cleanTarget === '/task-delegation' || cleanTarget === '/leave') {
    return true;
  }

  return rule.allowedPaths.some((allowed) => {
    const cleanAllowed = allowed.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
    return cleanTarget === cleanAllowed || cleanTarget.startsWith(cleanAllowed + '/');
  });
}

/**
 * Checks if a specific category title is authorized for the given role.
 * Considers both baseline categories and dynamic cross-departmental grants.
 */
export function isCategoryAuthorizedForRole(categoryTitle: string, roleId?: string): boolean {
  const normalized = normalizeRoleId(roleId);

  // Super Admin sees all categories
  if (normalized === 'super_admin') {
    return true;
  }

  // Top Management category is strictly forbidden for any non-super_admin role
  if (categoryTitle === 'TOP MANAGEMENT (OWNER / MD)') {
    return false;
  }

  // Universal workspace category is always visible to all active roles
  if (categoryTitle === 'MY WORKSPACE') {
    return true;
  }

  const rule = ROLE_NAVIGATION_RULES[normalized];
  if (!rule) {
    return false;
  }

  if (rule.allowedCategoryTitles.includes('*')) {
    return true;
  }

  // Check if any route inside this category is authorized for this role (handles baseline + dynamic grants)
  const categoryPaths = CATEGORY_TO_PATHS_MAP[categoryTitle];
  if (categoryPaths && categoryPaths.length > 0) {
    const hasAuthorizedItem = categoryPaths.some((path) => isPathAuthorizedForRole(path, normalized));
    if (hasAuthorizedItem) {
      return true;
    }
  }

  return rule.allowedCategoryTitles.includes(categoryTitle);
}

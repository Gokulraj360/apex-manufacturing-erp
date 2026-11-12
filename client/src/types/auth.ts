export type DepartmentGroupKey =
  | 'executive'
  | 'warehouse'
  | 'production'
  | 'finance'
  | 'supply_chain'
  | 'engineering';

export interface RoleDefinition {
  id: string;
  name: string;
  badge: string;
  department: string;
  defaultUsername: string;
  description: string;
  dashboardRoute: string;
  accentColor: string;
  primaryDepartmentKey: DepartmentGroupKey;
}

export interface UserSession {
  username: string;
  roleId: string;
  roleName: string;
  department: string;
  dashboardRoute: string;
  loginTimestamp: string;
  originalAdmin?: boolean;
}

export const ALL_ROLES: RoleDefinition[] = [
  {
    id: 'super_admin',
    name: 'Business Owner / Admin',
    badge: 'Owner / Admin',
    department: 'Management & Admin',
    defaultUsername: 'super_admin',
    description: 'View overall company profit, cash flow, pending approvals, user permissions, and plant performance.',
    dashboardRoute: '/top-management',
    accentColor: 'blue',
    primaryDepartmentKey: 'executive',
  },
  {
    id: 'finance',
    name: 'Accounts & Finance Manager',
    badge: 'Accounts',
    department: 'Accounts & Billing',
    defaultUsername: 'finance_manager',
    description: 'Manage company accounts, customer invoices, supplier bills, and tax reports.',
    dashboardRoute: '/finance',
    accentColor: 'emerald',
    primaryDepartmentKey: 'finance',
  },
  {
    id: 'production',
    name: 'Production Manager',
    badge: 'Production',
    department: 'Production Floor',
    defaultUsername: 'production_lead',
    description: 'Manage daily production lines, work orders, batch targets, and output across the factory.',
    dashboardRoute: '/production',
    accentColor: 'indigo',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'warehouse',
    name: 'Warehouse & Stock Manager',
    badge: 'Warehouse',
    department: 'Stock & Warehouse',
    defaultUsername: 'warehouse_mgr',
    description: 'Track raw materials, finished goods stock, storage racks, and low-stock alerts.',
    dashboardRoute: '/warehouse',
    accentColor: 'amber',
    primaryDepartmentKey: 'warehouse',
  },
  {
    id: 'quality',
    name: 'Quality Check Manager',
    badge: 'Quality',
    department: 'Quality Checks',
    defaultUsername: 'quality_lead',
    description: 'Inspect incoming raw materials, check production batches, and approve finished goods.',
    dashboardRoute: '/quality',
    accentColor: 'emerald',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'dispatch',
    name: 'Packing & Shipping Manager',
    badge: 'Shipping',
    department: 'Packing & Shipping',
    defaultUsername: 'dispatch_lead',
    description: 'Manage product packing, shipping labels, and customer deliveries.',
    dashboardRoute: '/dispatch',
    accentColor: 'cyan',
    primaryDepartmentKey: 'warehouse',
  },
  {
    id: 'logistics',
    name: 'Gate Security & Receiving',
    badge: 'Gate Entry',
    department: 'Gate Security',
    defaultUsername: 'logistics_officer',
    description: 'Check incoming delivery trucks, weigh shipments, and log gate entries.',
    dashboardRoute: '/logistics-gate',
    accentColor: 'amber',
    primaryDepartmentKey: 'warehouse',
  },
  {
    id: 'hr',
    name: 'HR & Staff Manager',
    badge: 'HR & Staff',
    department: 'HR & Staff',
    defaultUsername: 'hr_lead',
    description: 'Manage employee attendance, shift schedules, leave requests, and monthly salaries.',
    dashboardRoute: '/hr',
    accentColor: 'blue',
    primaryDepartmentKey: 'finance',
  },
  {
    id: 'crm',
    name: 'Customer Orders & Sales',
    badge: 'Sales & Orders',
    department: 'Customer Orders',
    defaultUsername: 'crm_lead',
    description: 'Handle customer orders, check raw material stock before accepting orders, and track deliveries.',
    dashboardRoute: '/crm',
    accentColor: 'rose',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'supply_chain',
    name: 'Material Planner',
    badge: 'Planning',
    department: 'Material Planning',
    defaultUsername: 'scm_manager',
    description: 'Plan raw material needs, track low-stock warnings, and coordinate supplier deliveries.',
    dashboardRoute: '/supply-chain',
    accentColor: 'violet',
    primaryDepartmentKey: 'supply_chain',
  },
  {
    id: 'design',
    name: 'Product Design & Recipes',
    badge: 'Recipes & Design',
    department: 'Product Recipes',
    defaultUsername: 'design_engineer',
    description: 'Manage product recipes (ingredients & parts lists), designs, and product updates.',
    dashboardRoute: '/design',
    accentColor: 'indigo',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'fleet',
    name: 'Delivery Fleet Manager',
    badge: 'Vehicles',
    department: 'Delivery Vehicles',
    defaultUsername: 'fleet_manager',
    description: 'Track delivery trucks, driver trips, fuel costs, and vehicle servicing.',
    dashboardRoute: '/fleet',
    accentColor: 'emerald',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'asset_reliability',
    name: 'Machine Maintenance Lead',
    badge: 'Maintenance',
    department: 'Machine Repairs',
    defaultUsername: 'reliability_lead',
    description: 'Keep factory machines running smoothly, schedule servicing, and fix breakdowns.',
    dashboardRoute: '/asset-reliability',
    accentColor: 'rose',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'subcontracting',
    name: 'Outside Job-Work Manager',
    badge: 'Job Work',
    department: 'Outside Job Work',
    defaultUsername: 'subcontract_mgr',
    description: 'Manage work sent to outside contractors, delivery slips, and returned goods.',
    dashboardRoute: '/subcontracting',
    accentColor: 'amber',
    primaryDepartmentKey: 'supply_chain',
  },
  {
    id: 'field_service',
    name: 'Customer Repairs & Support',
    badge: 'Repairs Care',
    department: 'Customer Support',
    defaultUsername: 'field_service_mgr',
    description: 'Handle customer repair requests, warranty claims, and service spare parts.',
    dashboardRoute: '/field-service',
    accentColor: 'blue',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'procurement',
    name: 'Purchasing Manager',
    badge: 'Purchasing',
    department: 'Purchasing',
    defaultUsername: 'procurement_lead',
    description: 'Buy raw materials from suppliers, compare price quotes, and issue purchase orders.',
    dashboardRoute: '/procurement',
    accentColor: 'violet',
    primaryDepartmentKey: 'supply_chain',
  },
  {
    id: 'marketing',
    name: 'Sales & Marketing Manager',
    badge: 'Marketing',
    department: 'Sales & Promotions',
    defaultUsername: 'marketing_mgr',
    description: 'Plan new product launches, customer promotions, and sales campaigns.',
    dashboardRoute: '/marketing',
    accentColor: 'rose',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'department_workforce',
    name: 'Floor Staff Supervisor',
    badge: 'Floor Staff',
    department: 'Floor Operations',
    defaultUsername: 'workforce_lead',
    description: 'Assign workers to daily production lines and track shift attendance and output.',
    dashboardRoute: '/department-workforce',
    accentColor: 'indigo',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'maintenance_tech',
    name: 'Machine Technician',
    badge: 'Technician',
    department: 'Machine Repairs',
    defaultUsername: 'maint_tech',
    description: 'Repair factory machines, handle breakdown tickets, and check out spare parts.',
    dashboardRoute: '/asset-reliability/breakdowns',
    accentColor: 'amber',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'plant_operator',
    name: 'Factory Floor Worker',
    badge: 'Operator',
    department: 'Production Floor',
    defaultUsername: 'plant_operator',
    description: 'Complete assigned work orders, log finished batches, and mark daily attendance.',
    dashboardRoute: '/production/work-orders',
    accentColor: 'cyan',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'system_admin',
    name: 'Serial Number Setup & Factory IT Admin',
    badge: 'Factory IT',
    department: 'IT & Factory Systems',
    defaultUsername: 'system_admin',
    description: 'Factory computer servers, automated software loading setup, and safe serial number records.',
    dashboardRoute: '/system-admin',
    accentColor: 'blue',
    primaryDepartmentKey: 'executive',
  },
];

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
    name: 'Top Management (Owner / MD)',
    badge: 'Executive MD',
    department: 'Top Management (Owner / MD)',
    defaultUsername: 'super_admin',
    description: 'Multi-plant enterprise EBITDA waterfalls, Cash Conversion Cycle, global approvals, and strategic governance.',
    dashboardRoute: '/top-management',
    accentColor: 'blue',
    primaryDepartmentKey: 'executive',
  },
  {
    id: 'finance',
    name: 'Factory Accounts & Finance Lead',
    badge: 'Finance',
    department: 'Finance & Accounts',
    defaultUsername: 'finance_manager',
    description: 'Working capital discipline, automated 3-way AP reconciliation, invoice tolerances, and tax compliance.',
    dashboardRoute: '/finance',
    accentColor: 'emerald',
    primaryDepartmentKey: 'finance',
  },
  {
    id: 'production',
    name: 'Precision Assembly & Production Lead',
    badge: 'Assembly Lead',
    department: 'Precision Assembly Operations',
    defaultUsername: 'production_lead',
    description: 'Precision SMT circuit placement, subassembly bonding, sensor calibration, and production telemetry.',
    dashboardRoute: '/production',
    accentColor: 'indigo',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'warehouse',
    name: 'Raw Materials & Inventory Lead',
    badge: 'Inventory Lead',
    department: 'Warehouse & Inventory',
    defaultUsername: 'warehouse_mgr',
    description: 'Raw materials inventory, components buffer stock, safety stock bins, and unit serial tracking.',
    dashboardRoute: '/warehouse',
    accentColor: 'amber',
    primaryDepartmentKey: 'warehouse',
  },
  {
    id: 'quality',
    name: 'Quality Assurance & Testing Lead',
    badge: 'QA & Diagnostics',
    department: 'Quality & Diagnostics Hub',
    defaultUsername: 'quality_lead',
    description: 'First-time yield (FPY), optical sensor checks, RF chamber diagnostics, environmental aging, and NCRs.',
    dashboardRoute: '/quality',
    accentColor: 'emerald',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'dispatch',
    name: 'Packaging & Outbound Dispatch Lead',
    badge: 'Dispatch Lead',
    department: 'Packing & Dispatch',
    defaultUsername: 'dispatch_lead',
    description: 'Protective packaging lines, serialized barcode labelling, shipping manifest validation, and outbound logistics.',
    dashboardRoute: '/dispatch',
    accentColor: 'cyan',
    primaryDepartmentKey: 'warehouse',
  },
  {
    id: 'logistics',
    name: 'Factory Gate Security & Receiving Officer',
    badge: 'Gate Hub',
    department: 'Logistics & Security',
    defaultUsername: 'logistics_officer',
    description: 'Incoming shipment checks, truck weighing scales, and secure dock verification.',
    dashboardRoute: '/logistics-gate',
    accentColor: 'amber',
    primaryDepartmentKey: 'warehouse',
  },
  {
    id: 'hr',
    name: 'Factory Workers & Shift Rosters Lead',
    badge: 'Workforce',
    department: 'Human Resources',
    defaultUsername: 'hr_lead',
    description: 'Assembly worker shift rosters, safety gear check-ins, employee attendance, and salaries.',
    dashboardRoute: '/hr',
    accentColor: 'blue',
    primaryDepartmentKey: 'finance',
  },
  {
    id: 'crm',
    name: 'Commercial Brand & Client Orders Lead',
    badge: 'Client Orders',
    department: 'Sales & Customer Care',
    defaultUsername: 'crm_lead',
    description: 'Enterprise commercial client contracts, bulk work orders, wholesale pricing, and fulfillment tracking.',
    dashboardRoute: '/crm',
    accentColor: 'rose',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'supply_chain',
    name: 'Material Planning & Sourcing Lead',
    badge: 'Material Planning',
    department: 'Supply Chain & Sourcing',
    defaultUsername: 'scm_manager',
    description: 'Component delivery timelines, material purchase requests, air-cargo logistics, and shortage warnings.',
    dashboardRoute: '/supply-chain',
    accentColor: 'violet',
    primaryDepartmentKey: 'supply_chain',
  },
  {
    id: 'design',
    name: 'Product 3D CAD & Tooling Engineer',
    badge: 'Hardware R&D',
    department: 'Design & Engineering',
    defaultUsername: 'design_engineer',
    description: 'Product 3D CAD blueprints, BOM parts recipe management, tooling tolerances, and Engineering Change Notices (ECN).',
    dashboardRoute: '/design',
    accentColor: 'indigo',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'fleet',
    name: 'Delivery Fleet & Vehicle Logistics Lead',
    badge: 'Fleet Transit',
    department: 'Fleet & Delivery',
    defaultUsername: 'fleet_manager',
    description: 'Finished goods transport trucks, GPS vehicle tracking, driver travel logs, and logistics fuel expense cards.',
    dashboardRoute: '/fleet',
    accentColor: 'emerald',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'asset_reliability',
    name: 'Assembly Machines & Cooling Maintenance Lead',
    badge: 'Maintenance',
    department: 'Machine Maintenance',
    defaultUsername: 'reliability_lead',
    description: 'Machine performance and uptime, robotic parts placer servicing, and clean air filter checks.',
    dashboardRoute: '/asset-reliability',
    accentColor: 'rose',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'subcontracting',
    name: 'External Board Assembly Job-Work Lead',
    badge: 'Job Work',
    department: 'External Contractors',
    defaultUsername: 'subcontract_mgr',
    description: 'Outside supplier circuit cable assembly, sent material delivery slips, and parts loss checks.',
    dashboardRoute: '/subcontracting',
    accentColor: 'amber',
    primaryDepartmentKey: 'supply_chain',
  },
  {
    id: 'field_service',
    name: 'Repairs & Customer Warranty Care Lead',
    badge: 'Repairs Care',
    department: 'Repair & Client Care',
    defaultUsername: 'field_service_mgr',
    description: 'Service center spare parts, warranty claim serial number verification, and screen repair logs.',
    dashboardRoute: '/field-service',
    accentColor: 'blue',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'procurement',
    name: 'Parts Purchasing & Supplier Orders Lead',
    badge: 'Purchasing',
    department: 'Purchasing & Sourcing',
    defaultUsername: 'procurement_lead',
    description: 'Component supplier contracts, price quote comparisons, and bulk material purchase orders.',
    dashboardRoute: '/procurement',
    accentColor: 'violet',
    primaryDepartmentKey: 'supply_chain',
  },
  {
    id: 'marketing',
    name: 'New Product Launches & Commercial Manager',
    badge: 'Commercial',
    department: 'Marketing & Brand Strategy',
    defaultUsername: 'marketing_mgr',
    description: 'New product launch campaigns, retail promotions, commercial partnerships, and marketing spend results.',
    dashboardRoute: '/marketing',
    accentColor: 'rose',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'department_workforce',
    name: 'Assembly Floor Staff Allocation Specialist',
    badge: 'Floor Staff',
    department: 'Assembly Operations',
    defaultUsername: 'workforce_lead',
    description: 'Daily worker placement across Board Assembly, Screen Fitting, Camera Tuning, and Box Packing.',
    dashboardRoute: '/department-workforce',
    accentColor: 'indigo',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'maintenance_tech',
    name: 'Robotic Machine & Heating Oven Technician',
    badge: 'Machine Tech',
    department: 'Machine Maintenance',
    defaultUsername: 'maint_tech',
    description: 'Cleaning circuit board stencils, heating oven temperature checks, and robotic nozzle servicing.',
    dashboardRoute: '/asset-reliability',
    accentColor: 'amber',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'plant_operator',
    name: 'Dust-Free Screen Assembly & Bonding Operator',
    badge: 'Operator',
    department: 'Shop Floor Assembly',
    defaultUsername: 'plant_operator',
    description: 'Dust-free screen fitting, manual battery connector plugging, and camera lens alignment work.',
    dashboardRoute: '/production',
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

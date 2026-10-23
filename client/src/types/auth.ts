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
    description: 'Overall factory profits, phone production overview, major approvals, and company decisions.',
    dashboardRoute: '/pricing-control',
    accentColor: 'blue',
    primaryDepartmentKey: 'executive',
  },
  {
    id: 'finance',
    name: 'Factory Accounts & Finance Lead',
    badge: 'Finance',
    department: 'Finance & Accounts',
    defaultUsername: 'finance_manager',
    description: 'Product parts profit calculation, supplier bills, invoice matching, and tax filing records.',
    dashboardRoute: '/finance',
    accentColor: 'emerald',
    primaryDepartmentKey: 'finance',
  },
  {
    id: 'production',
    name: 'Phone Assembly & Screen Fitting Lead',
    badge: 'Assembly Floor',
    department: 'Phone Assembly Lines',
    defaultUsername: 'production_lead',
    description: 'Circuit board assembly work, dust-free screen fitting, camera tuning, and serial number checks.',
    dashboardRoute: '/production',
    accentColor: 'indigo',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'warehouse',
    name: 'Parts & Phone Inventory Lead',
    badge: 'Parts Stock',
    department: 'Warehouse & Inventory',
    defaultUsername: 'warehouse_mgr',
    description: 'Small parts storage bins, screen stock, battery shelves, and phone serial numbers registry.',
    dashboardRoute: '/warehouse',
    accentColor: 'amber',
    primaryDepartmentKey: 'warehouse',
  },
  {
    id: 'quality',
    name: 'Phone Quality & Signal Testing Lead',
    badge: 'Quality & Test',
    department: 'Quality Checks',
    defaultUsername: 'quality_lead',
    description: 'First-time quality pass rate, screen color check, 5G signal test chamber, and drop test records.',
    dashboardRoute: '/quality',
    accentColor: 'emerald',
    primaryDepartmentKey: 'production',
  },
  {
    id: 'dispatch',
    name: 'Retail Box Packing & Serial Sticker Lead',
    badge: 'Box Packing',
    department: 'Packing & Dispatch',
    defaultUsername: 'dispatch_lead',
    description: 'Retail box packaging, charger bundling, barcode sticker verification, and shipping dispatch.',
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
    name: 'Phone Brand & Customer Orders Lead',
    badge: 'Customer Orders',
    department: 'Sales & Customer Care',
    defaultUsername: 'crm_lead',
    description: 'Carrier contract delivery planning, bulk customer orders, wholesale pricing, and stock delivery.',
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
    description: 'Chip delivery timelines, material purchase requests, air-cargo logistics, and shortage warnings.',
    dashboardRoute: '/supply-chain',
    accentColor: 'violet',
    primaryDepartmentKey: 'supply_chain',
  },
  {
    id: 'design',
    name: 'Phone Body 3D Design & CAD Engineer',
    badge: 'Hardware R&D',
    department: 'Design & Engineering',
    defaultUsername: 'design_engineer',
    description: 'Aluminum unibody 3D drawings, internal wiring layout, cooling heat pipes, and Design Change Requests.',
    dashboardRoute: '/design',
    accentColor: 'indigo',
    primaryDepartmentKey: 'engineering',
  },
  {
    id: 'fleet',
    name: 'Delivery Trucks & Vehicle Tracker Lead',
    badge: 'Truck Transit',
    department: 'Fleet & Delivery',
    defaultUsername: 'fleet_manager',
    description: 'Finished phones transport trucks, GPS vehicle tracking, driver travel logs, and fuel expense cards.',
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
    name: 'New Phone Launches & Promotions Manager',
    badge: 'Marketing',
    department: 'Marketing & Brand',
    defaultUsername: 'marketing_mgr',
    description: 'New phone launch campaigns, retail offers, online ads, and marketing spend results.',
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

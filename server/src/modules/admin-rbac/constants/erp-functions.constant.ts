/**
 * Comprehensive System Operational Functions Catalog
 * Across all 10 ERP Operational Modules in ApexMobile ERP
 */

export interface ErpFunctionDefinition {
  key: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const ERP_FUNCTION_CATEGORIES = [
  { key: 'EXECUTIVE', label: 'Top Management & Governance' },
  { key: 'FINANCE', label: 'Finance, Banking & Accounts' },
  { key: 'PRODUCTION', label: 'Phone Assembly & SMT Operations' },
  { key: 'WAREHOUSE', label: 'Warehouse, Parts & IMEI Tracking' },
  { key: 'QUALITY', label: 'Phone Quality & Testing' },
  { key: 'HR_WORKFORCE', label: 'Human Resources & Payroll' },
  { key: 'LOGISTICS_FLEET', label: 'Logistics, Gate & Vehicle Fleet' },
  { key: 'SUPPLY_CHAIN', label: 'Supply Chain, Sourcing & Subcontracting' },
  { key: 'ENGINEERING', label: 'Hardware CAD & Machine Reliability' },
  { key: 'SALES_MARKETING', label: 'Customer Orders, CRM & Marketing' },
];

export const ALL_ERP_FUNCTIONS: ErpFunctionDefinition[] = [
  // 1. EXECUTIVE & GOVERNANCE
  {
    key: 'FUNC_EXECUTIVE_COMMAND',
    name: 'Executive Command Center & Factory Telemetry',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'High-level factory overview, financial runway, plant yield metrics, and top-tier operations summaries.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_PRICING_CONTROL',
    name: 'Product Costing & Selling Price Control',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'Set target profit margins, bill-of-materials overhead markups, and customer sale price limits.',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_HIGH_VALUE_PO_APPROVAL',
    name: 'High-Value Purchase Order Sign-Off (₹50L+)',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'Final sign-off authority for high-value component purchase orders (Qualcomm SoCs, BOE displays).',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_PAYROLL_FINAL_SIGNOFF',
    name: 'Factory Monthly Payroll Executive Sign-Off',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'Executive clearance for monthly technician attendance salary batches and bank release approvals.',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_RBAC_MANAGEMENT',
    name: 'Dynamic Role Permission & Function Mapping',
    category: 'EXECUTIVE',
    categoryLabel: 'Top Management & Governance',
    description: 'Control panel to toggle, assign, or restrict operational functions across all 21 manufacturing roles.',
    riskLevel: 'CRITICAL',
  },

  // 2. FINANCE, BANKING & ACCOUNTS
  {
    key: 'FUNC_FINANCE_OVERVIEW',
    name: 'Factory Accounts & Live Money Overview',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Live bank balances, cash reserves, daily money movement tracking, and financial health ratios.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_VENDOR_BILL_MATCH',
    name: 'Supplier Bills & 3-Way Invoice Match',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Match inbound supplier invoices against purchase orders and warehouse GRNs with zero variance.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_CLIENT_INVOICE_GENERATE',
    name: 'Customer Billing & Tax Delivery Slips',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Generate client sale invoices, export delivery slips, and track accounts receivable collections.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_DISBURSE_PAYOUTS',
    name: 'Bank RTGS & Direct Payout Disbursement',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Execute bank RTGS and NEFT transfers for approved supplier vendor bills and staff wage batches.',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_TAX_GST_FILING',
    name: 'GSTR-3B Tax Reports & Statutory TDS',
    category: 'FINANCE',
    categoryLabel: 'Finance, Banking & Accounts',
    description: 'Reconcile input tax credits (ITC), GST liability reports, and statutory deductions.',
    riskLevel: 'HIGH',
  },

  // 3. PHONE ASSEMBLY & SMT OPERATIONS
  {
    key: 'FUNC_PROD_WORK_ORDER_EXECUTE',
    name: 'Daily Assembly Job & Station Execution',
    category: 'PRODUCTION',
    categoryLabel: 'Phone Assembly & SMT Operations',
    description: 'Start, advance, and log completed units across active work order batches and station queues.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_PROD_SMT_CALIBRATION',
    name: 'Circuit Board SMT & Stencil Optical Check',
    category: 'PRODUCTION',
    categoryLabel: 'Phone Assembly & SMT Operations',
    description: 'Log solder paste printer thickness, pick-and-place nozzle optical checks, and oven profiles.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_PROD_SCREEN_FITTING',
    name: 'Dust-Free Cleanroom Screen Bonding',
    category: 'PRODUCTION',
    categoryLabel: 'Phone Assembly & SMT Operations',
    description: 'Record cleanroom AMOLED screen fittings, battery connections, and camera lens alignments.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_PROD_LINE_YIELD_REPORT',
    name: 'First-Pass Yield (FPY) & Scrap Logging',
    category: 'PRODUCTION',
    categoryLabel: 'Phone Assembly & SMT Operations',
    description: 'Log station pass rates, scrap component quantities, and assembly bottleneck reasons.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_PROD_OVERTIME_SUBMIT',
    name: 'Shift Overtime & Department Wage Sheet Submission',
    category: 'PRODUCTION',
    categoryLabel: 'Phone Assembly & SMT Operations',
    description: 'Compile department shift worker hours and submit computed wages to HR and Finance.',
    riskLevel: 'HIGH',
  },

  // 4. WAREHOUSE, PARTS & IMEI TRACKING
  {
    key: 'FUNC_WHS_STOCK_MONITOR',
    name: 'Raw Materials & Storage Shelf Monitor',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & IMEI Tracking',
    description: 'Monitor storage racks, small parts trays, stock valuations, and low-part reorder alerts.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_WHS_INBOUND_GRN',
    name: 'Inbound Goods Receipt Note (GRN) Verification',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & IMEI Tracking',
    description: 'Acknowledge deliveries, scan component barcodes, and verify delivered count against PO.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_WHS_BUFFER_RESERVE',
    name: 'Component Buffer Reservation for Assembly',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & IMEI Tracking',
    description: 'Reserve processor chips, screens, and batteries for planned manufacturing shifts.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_WHS_IMEI_REGISTRATION',
    name: 'IMEI Serial Numbers & Factory SIM Registry',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & IMEI Tracking',
    description: 'Register unique 15-digit IMEI serial numbers, ICCID SIM IDs, and MAC addresses on completed devices.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_WHS_DISPATCH_BOXING',
    name: 'Retail Phone Box Packing & Shipping Dispatch',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse, Parts & IMEI Tracking',
    description: 'Final retail phone packaging, warranty sticker sealing, carton labeling, and courier release.',
    riskLevel: 'MEDIUM',
  },

  // 5. PHONE QUALITY & TESTING
  {
    key: 'FUNC_QA_INCOMING_INSPECTION',
    name: 'Incoming Raw Component Quality Inspection',
    category: 'QUALITY',
    categoryLabel: 'Phone Quality & Testing',
    description: 'Test incoming batches of processor chips, display panels, and lithium batteries before stock entry.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_QA_OPTICAL_SCAN',
    name: 'Screen Optical Inspection & Color Calibration',
    category: 'QUALITY',
    categoryLabel: 'Phone Quality & Testing',
    description: 'Inspect AMOLED screens for dead sub-pixels, color uniformity, and touch response speed.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_QA_RF_5G_TEST',
    name: 'RF Chamber 5G Signal & Antenna Certification',
    category: 'QUALITY',
    categoryLabel: 'Phone Quality & Testing',
    description: 'Perform RF anechoic chamber 5G beamforming, Wi-Fi 7, and carrier frequency certification.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_QA_BATTERY_AGING_DROP',
    name: 'Battery Thermal Aging & Drop Durability Testing',
    category: 'QUALITY',
    categoryLabel: 'Phone Quality & Testing',
    description: 'Test battery thermal degradation cycles and chassis corner drop impact tests.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_QA_QUARANTINE_NCR',
    name: 'Defect Logging & Material Quarantine (NCR)',
    category: 'QUALITY',
    categoryLabel: 'Phone Quality & Testing',
    description: 'Issue Non-Conformance Reports (NCR) and lock defective component lots into quarantine bins.',
    riskLevel: 'HIGH',
  },

  // 6. HUMAN RESOURCES & PAYROLL
  {
    key: 'FUNC_HR_EMPLOYEE_DIRECTORY',
    name: 'Employee Directory & Staff Records',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Manage staff profiles, government IDs, bank details, job roles, and factory departments.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_HR_SHIFT_ROSTER_LOCK',
    name: 'Shift Schedules & Biometric Turnstile Reconciliation',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Schedule Morning/Evening/Night shifts, reconcile gate turnstile punches, and lock daily rosters.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_HR_PAYROLL_BATCH_COMPILE',
    name: 'Monthly Payroll Batch & Statutory Pool Preparation',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Compile monthly attendance earnings, calculate statutory PF/ESI pools, and submit to Finance.',
    riskLevel: 'CRITICAL',
  },
  {
    key: 'FUNC_HR_LEAVE_APPROVAL',
    name: 'Staff Leave Requests & Approvals',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Review and approve/reject employee medical, casual, and earned leave requests with backup planning.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_HR_LABOR_SAFETY_AUDIT',
    name: 'Worker Safety Gear & Labor Law Audits',
    category: 'HR_WORKFORCE',
    categoryLabel: 'Human Resources & Payroll',
    description: 'Monitor cleanroom anti-static gowns, ESD wrist straps, eye protection, and factory legal compliance.',
    riskLevel: 'MEDIUM',
  },

  // 7. LOGISTICS, GATE & VEHICLE FLEET
  {
    key: 'FUNC_FLEET_VEHICLE_TRACK',
    name: 'Delivery Trucks & GPS Live Tracker',
    category: 'LOGISTICS_FLEET',
    categoryLabel: 'Logistics, Gate & Vehicle Fleet',
    description: 'Live GPS map tracking for phone delivery convoys, trip distance logs, and transit milestones.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_GATE_SECURITY_INBOUND',
    name: 'Factory Gate Security & Inbound Dock Check',
    category: 'LOGISTICS_FLEET',
    categoryLabel: 'Logistics, Gate & Vehicle Fleet',
    description: 'Inspect incoming carrier trucks, check driver identity passes, weigh container loads, and clear gates.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_CONVOY_ESCORT_DISPATCH',
    name: 'Finished Phone Air-Cargo Convoy Dispatch',
    category: 'LOGISTICS_FLEET',
    categoryLabel: 'Logistics, Gate & Vehicle Fleet',
    description: 'Issue convoy gate clearance for high-value smartphone shipments en route to distribution hubs.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_FLEET_FUEL_EXPENSE',
    name: 'Fleet Fuel Card & Vehicle Maintenance Management',
    category: 'LOGISTICS_FLEET',
    categoryLabel: 'Logistics, Gate & Vehicle Fleet',
    description: 'Log diesel consumption, highway toll passes, and vehicle fitness certifications.',
    riskLevel: 'LOW',
  },

  // 8. SUPPLY CHAIN, SOURCING & SUBCONTRACTING
  {
    key: 'FUNC_SCM_MRP_SHORTAGE',
    name: 'Chipset Stock & Material Shortage Alerts (MRP)',
    category: 'SUPPLY_CHAIN',
    categoryLabel: 'Supply Chain, Sourcing & Subcontracting',
    description: 'Run automated material requirements planning and identify component shortages ahead of production.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_SCM_PURCHASE_REQUISITION',
    name: 'Component Purchase Requests & Supplier Orders',
    category: 'SUPPLY_CHAIN',
    categoryLabel: 'Supply Chain, Sourcing & Subcontracting',
    description: 'Raise purchase requisitions for processors, screens, and cameras; compare vendor quotes.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_SCM_VENDOR_PORTAL',
    name: 'Supplier & Vendor Relationship Directory',
    category: 'SUPPLY_CHAIN',
    categoryLabel: 'Supply Chain, Sourcing & Subcontracting',
    description: 'Maintain Tier-1 vendor contracts, quality delivery ratings, and lead time metrics.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_SCM_SUBCONTRACT_JOBWORK',
    name: 'External Board Assembly Job-Work Dispatch',
    category: 'SUPPLY_CHAIN',
    categoryLabel: 'Supply Chain, Sourcing & Subcontracting',
    description: 'Manage specialized job-work sent to external PCB assembly partners; verify return delivery slips.',
    riskLevel: 'MEDIUM',
  },

  // 9. HARDWARE CAD & MACHINE RELIABILITY
  {
    key: 'FUNC_ENG_CAD_BLUEPRINTS',
    name: 'Phone Body 3D CAD & Thermal Schematics',
    category: 'ENGINEERING',
    categoryLabel: 'Hardware CAD & Machine Reliability',
    description: 'Store phone enclosure 3D CAD files, internal heat pipe drawings, and antenna placement blueprints.',
    riskLevel: 'MEDIUM',
  },
  {
    key: 'FUNC_ENG_ECN_DESIGN_CHANGE',
    name: 'Engineering Design Change Requests (ECN)',
    category: 'ENGINEERING',
    categoryLabel: 'Hardware CAD & Machine Reliability',
    description: 'Initiate and review engineering design changes to phone frames, connectors, and parts recipes.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_MAINT_ROBOTIC_SERVICING',
    name: 'Robotic Machine & Heating Oven Servicing',
    category: 'ENGINEERING',
    categoryLabel: 'Hardware CAD & Machine Reliability',
    description: 'Log preventive maintenance on surface-mount machines, solder ovens, and pneumatic arms.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_MAINT_DOWNTIME_LOG',
    name: 'Machine Breakdown & Plant Uptime Incident Logs',
    category: 'ENGINEERING',
    categoryLabel: 'Hardware CAD & Machine Reliability',
    description: 'Record machine breakdown incidents, spindle heating alerts, and track Overall Plant Uptime.',
    riskLevel: 'MEDIUM',
  },

  // 10. CUSTOMER ORDERS, CRM & MARKETING
  {
    key: 'FUNC_CRM_CARRIER_CONTRACTS',
    name: 'Carrier Bulk Smartphone Contracts & Orders',
    category: 'SALES_MARKETING',
    categoryLabel: 'Customer Orders, CRM & Marketing',
    description: 'Manage telecom carrier orders, wholesale commitments, and dispatch schedule commitments.',
    riskLevel: 'HIGH',
  },
  {
    key: 'FUNC_MKT_LAUNCH_CAMPAIGNS',
    name: 'New Phone Launches & Promotions Management',
    category: 'SALES_MARKETING',
    categoryLabel: 'Customer Orders, CRM & Marketing',
    description: 'Track flagship product launch campaigns, distributor promotions, and marketing budget ROI.',
    riskLevel: 'LOW',
  },
  {
    key: 'FUNC_WARRANTY_SERVICE_CARE',
    name: 'Customer Warranty & Service Center Repairs',
    category: 'SALES_MARKETING',
    categoryLabel: 'Customer Orders, CRM & Marketing',
    description: 'Verify phone warranty claims by IMEI serial number, log screen replacements, and dispatch spare parts.',
    riskLevel: 'MEDIUM',
  },
];

/**
 * Standard baseline permissions for all 21 manufacturing roles.
 * Super Admin can dynamically toggle any of these on or off!
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  // 1. Super Admin: All functions enabled by default
  super_admin: ALL_ERP_FUNCTIONS.map((f) => f.key),

  // 2. Finance
  finance: [
    'FUNC_FINANCE_OVERVIEW',
    'FUNC_VENDOR_BILL_MATCH',
    'FUNC_CLIENT_INVOICE_GENERATE',
    'FUNC_DISBURSE_PAYOUTS',
    'FUNC_TAX_GST_FILING',
    'FUNC_HR_PAYROLL_BATCH_COMPILE',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 3. Production Lead
  production: [
    'FUNC_PROD_WORK_ORDER_EXECUTE',
    'FUNC_PROD_SMT_CALIBRATION',
    'FUNC_PROD_SCREEN_FITTING',
    'FUNC_PROD_LINE_YIELD_REPORT',
    'FUNC_PROD_OVERTIME_SUBMIT',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 4. Warehouse Manager
  warehouse: [
    'FUNC_WHS_STOCK_MONITOR',
    'FUNC_WHS_INBOUND_GRN',
    'FUNC_WHS_BUFFER_RESERVE',
    'FUNC_WHS_IMEI_REGISTRATION',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 5. Quality Lead
  quality: [
    'FUNC_QA_INCOMING_INSPECTION',
    'FUNC_QA_OPTICAL_SCAN',
    'FUNC_QA_RF_5G_TEST',
    'FUNC_QA_BATTERY_AGING_DROP',
    'FUNC_QA_QUARANTINE_NCR',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 6. Dispatch Lead
  dispatch: [
    'FUNC_WHS_DISPATCH_BOXING',
    'FUNC_CONVOY_ESCORT_DISPATCH',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 7. Gate Security & Logistics
  logistics: [
    'FUNC_GATE_SECURITY_INBOUND',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 8. Human Resources
  hr: [
    'FUNC_HR_EMPLOYEE_DIRECTORY',
    'FUNC_HR_SHIFT_ROSTER_LOCK',
    'FUNC_HR_PAYROLL_BATCH_COMPILE',
    'FUNC_HR_LEAVE_APPROVAL',
    'FUNC_HR_LABOR_SAFETY_AUDIT',
  ],

  // 9. Customer Orders & CRM
  crm: [
    'FUNC_CRM_CARRIER_CONTRACTS',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 10. Supply Chain & SCM
  supply_chain: [
    'FUNC_SCM_MRP_SHORTAGE',
    'FUNC_SCM_PURCHASE_REQUISITION',
    'FUNC_SCM_VENDOR_PORTAL',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 11. Hardware CAD & Design
  design: [
    'FUNC_ENG_CAD_BLUEPRINTS',
    'FUNC_ENG_ECN_DESIGN_CHANGE',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 12. Fleet & Delivery
  fleet: [
    'FUNC_FLEET_VEHICLE_TRACK',
    'FUNC_CONVOY_ESCORT_DISPATCH',
    'FUNC_FLEET_FUEL_EXPENSE',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 13. Equipment Reliability Lead
  asset_reliability: [
    'FUNC_MAINT_ROBOTIC_SERVICING',
    'FUNC_MAINT_DOWNTIME_LOG',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 14. Subcontracting
  subcontracting: [
    'FUNC_SCM_SUBCONTRACT_JOBWORK',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 15. Repairs & Warranty Service
  field_service: [
    'FUNC_WARRANTY_SERVICE_CARE',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 16. Procurement & Purchasing
  procurement: [
    'FUNC_SCM_PURCHASE_REQUISITION',
    'FUNC_SCM_VENDOR_PORTAL',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 17. Marketing & Brand
  marketing: [
    'FUNC_MKT_LAUNCH_CAMPAIGNS',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 18. Department Workforce Specialist
  department_workforce: [
    'FUNC_HR_SHIFT_ROSTER_LOCK',
    'FUNC_PROD_OVERTIME_SUBMIT',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 19. Maintenance Technician
  maintenance_tech: [
    'FUNC_MAINT_ROBOTIC_SERVICING',
    'FUNC_MAINT_DOWNTIME_LOG',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 20. Cleanroom Shop Floor Operator
  plant_operator: [
    'FUNC_PROD_SCREEN_FITTING',
    'FUNC_PROD_LINE_YIELD_REPORT',
    'FUNC_HR_LEAVE_APPROVAL',
  ],

  // 21. Factory IT & System Admin
  system_admin: [
    'FUNC_RBAC_MANAGEMENT',
    'FUNC_HR_EMPLOYEE_DIRECTORY',
    'FUNC_HR_LEAVE_APPROVAL',
  ],
};

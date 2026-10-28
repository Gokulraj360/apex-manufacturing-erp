/**
 * Apex Enterprise Cross-Role Workflow & Approval Orchestration Engine
 * 
 * Provides reactive, synchronized cross-role request routing across ALL 21 roles and operational modules:
 * - Shopfloor / Operators: Leave, Overtime, Machine Jam Alerts -> Production Lead / Machine Maintenance
 * - Purchasing / Procurement: High-Value POs, Supplier Advances -> Finance Lead / Top Management
 * - Engineering / Design: ECNs, CAD Revisions, Prototyping -> Quality Lead / Executive MD
 * - Quality & Diagnostics: Batch Scrap, Concessions, Waivers -> Top Management / Design Lead
 * - Warehouse & Inventory: Cycle Count Write-Offs, Stock Transfers -> Finance Lead / SCM Lead
 * - Finance & Accounts: CapEx Requisitions, AP 3-Way Match Exceptions -> Top Management (MD)
 * - Sales & CRM: Wholesale Volume Discount Overrides -> Top Management / Finance Lead
 * - Maintenance: High-Speed Spindle Replacement, Machine Overhaul -> Production Lead / Finance
 * - Field Service & RMA: Out-of-Warranty Customer Replacements -> Quality Lead / Finance
 * - Subcontracting: Job-Work Scrappage & Variance Write-Offs -> Quality Lead / SCM Lead
 * - Logistics & Gate: Inbound Weight Exceptions & Gate Clearances -> Operations VP
 * - IT Admin: Break-Glass Root Elevation -> Top Management / CISO
 * 
 * Synchronizes across browser tabs and role changes via localStorage and CustomEvents.
 */

export type WorkflowCategory = 
  | 'HR_LEAVE' 
  | 'HR_OVERTIME' 
  | 'PURCHASE_ORDER' 
  | 'CAPEX' 
  | 'ECN_ECO' 
  | 'QUALITY_SCRAP'
  | 'INVENTORY_WRITEOFF'
  | 'DISCOUNT_EXCEPTION'
  | 'MAINTENANCE_OVERHAUL'
  | 'WARRANTY_CLAIM'
  | 'SUBCONTRACT_VARIANCE'
  | 'LOGISTICS_CLEARANCE'
  | 'FLEET_EXPENSE'
  | 'MARKETING_BUDGET'
  | 'BREAK_GLASS_ACCESS';

export type WorkflowPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type WorkflowStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';

export interface WorkflowItem {
  id: string;
  category: WorkflowCategory;
  title: string;
  department: string;
  targetRole: string; // Target approver role ID (e.g. 'super_admin', 'finance', 'production', 'quality')
  targetRoleName?: string;
  requester: {
    name: string;
    role: string;
    roleId: string;
    avatar: string;
    email?: string;
  };
  valueOrImpact: string;
  submittedAt: string;
  deadlineHoursRemaining: number;
  priority: WorkflowPriority;
  details: {
    justification: string;
    affectedSystem: string;
    lineItemsCount?: number;
    glAccount?: string;
    metadata?: Record<string, any>;
  };
  status: WorkflowStatus;
  decisionNotes?: string;
  decidedBy?: string;
  decidedAt?: string;
}

export interface RoleActionPreset {
  id: string;
  category: WorkflowCategory;
  title: string;
  department: string;
  targetRole: string;
  targetRoleName: string;
  valueOrImpact: string;
  defaultJustification: string;
  affectedSystem: string;
  priority: WorkflowPriority;
  glAccount?: string;
}

const STORAGE_KEY = 'apex_enterprise_workflow_items';
const EVENT_NAME = 'apex_workflow_updated';

// Contextual operational action presets for every role
export const ROLE_WORKFLOW_PRESETS: Record<string, RoleActionPreset[]> = {
  // 1. Precision Assembly & Operator
  production: [
    {
      id: 'PRESET-PROD-01',
      category: 'HR_LEAVE',
      title: 'Annual Paid Time Off (PTO) Pass: Assembly Technician',
      department: 'Cleanroom Assembly Shift A',
      targetRole: 'hr',
      targetRoleName: 'Factory Workers & Shift Rosters Lead',
      valueOrImpact: '16 Standard Hours (Shift Cover Assigned)',
      defaultJustification: 'Statutory family leave. Relief cross-trained operator assigned to SMT Line 3.',
      affectedSystem: 'Cleanroom Bay 3 (SMT Lines)',
      priority: 'NORMAL',
    },
    {
      id: 'PRESET-PROD-02',
      category: 'HR_OVERTIME',
      title: 'Overtime Production Run (2.5 Hours): SMT Batch Catch-Up',
      department: 'Precision Assembly Operations',
      targetRole: 'super_admin',
      targetRoleName: 'Top Management (Owner / MD)',
      valueOrImpact: '$97.50 USD (1.5x Premium Multiplier)',
      defaultJustification: 'High-volume carrier batch completion to meet weekend air-cargo shipping window.',
      affectedSystem: 'Assembly Line 1',
      priority: 'HIGH',
      glAccount: 'GL-52100 (Direct Labor Overtime)',
    },
    {
      id: 'PRESET-PROD-03',
      category: 'MAINTENANCE_OVERHAUL',
      title: 'Emergency SMT Nozzle Vacuum Failure & Line 2 Jam',
      department: 'Precision Assembly Lines',
      targetRole: 'asset_reliability',
      targetRoleName: 'Assembly Machines & Cooling Maintenance Lead',
      valueOrImpact: 'High Line Stoppage Risk (0.8h Downtime)',
      defaultJustification: 'Component pickup error rate spiked to 12.4% on SMT Mounter Head #3. Immediate sensor calibration required.',
      affectedSystem: 'Panasonic NPM-W2 High-Speed Placer',
      priority: 'CRITICAL',
    },
  ],
  plant_operator: [
    {
      id: 'PRESET-OP-01',
      category: 'HR_LEAVE',
      title: 'Medical Sick Leave Request (2 Business Days)',
      department: 'Dust-Free Interface Assembly',
      targetRole: 'production',
      targetRoleName: 'Precision Assembly Floor Lead',
      valueOrImpact: '16 Hours Scheduled Coverage',
      defaultJustification: 'Acute viral fever and clinical observation. Station handover completed.',
      affectedSystem: 'Optical Bonding Station 4',
      priority: 'NORMAL',
    },
    {
      id: 'PRESET-OP-02',
      category: 'HR_OVERTIME',
      title: 'Late Shift Cleanroom Overtime (3.0 Hours)',
      department: 'Cleanroom Bonding Station',
      targetRole: 'production',
      targetRoleName: 'Precision Assembly Floor Lead',
      valueOrImpact: '$117.00 USD (1.5x Multiplier)',
      defaultJustification: 'Extended optical interface bonding run to clear queue for morning testing.',
      affectedSystem: 'Dust-Free Cleanroom Bay 2',
      priority: 'NORMAL',
    },
  ],

  // 2. Purchasing & Procurement
  procurement: [
    {
      id: 'PRESET-PROC-01',
      category: 'PURCHASE_ORDER',
      title: 'Quarterly Blanket PO: 300mm Prime Silicon Substrates',
      department: 'Purchasing & Strategic Sourcing',
      targetRole: 'finance',
      targetRoleName: 'Factory Accounts & Finance Lead',
      valueOrImpact: '$412,500.00 USD (Tier 1 Volume Discount)',
      defaultJustification: 'Quarterly supply agreement with SilicTech Global for ultra-pure polished wafers with locked 8.5% volume discount.',
      affectedSystem: 'Substrate Inventory Silo 1',
      priority: 'HIGH',
      glAccount: 'GL-50100 (Direct Materials Inventory)',
    },
    {
      id: 'PRESET-PROC-02',
      category: 'PURCHASE_ORDER',
      title: 'Expedited Air Freight Microcontroller ICs (Shortage Mitigation)',
      department: 'Purchasing & Sourcing',
      targetRole: 'super_admin',
      targetRoleName: 'Top Management (Owner / MD)',
      valueOrImpact: '$68,400.00 USD',
      defaultJustification: 'Expedited air delivery for 40,000 power management ICs to prevent line shutdown on Industrial Gateway Gen 3.',
      affectedSystem: 'SMT Cleanroom Sourcing',
      priority: 'CRITICAL',
      glAccount: 'GL-50120 (Expedited Raw Materials)',
    },
  ],

  // 3. Design & Hardware Engineering
  design: [
    {
      id: 'PRESET-ENG-01',
      category: 'ECN_ECO',
      title: 'ECN-7804: Thermal Heat-Sink Fin Geometry Refinement',
      department: 'Design & Engineering (Hardware R&D)',
      targetRole: 'quality',
      targetRoleName: 'Quality Assurance & Testing Lead',
      valueOrImpact: 'BOM Cost Neutral / +8.2°C Thermal Margin',
      defaultJustification: 'Modifies copper extruded fin density from 14 FPI to 18 FPI to prevent throttling at 45°C ambient. Tested in wind tunnel.',
      affectedSystem: 'Apex Industrial Gateway Gen 3',
      priority: 'HIGH',
    },
    {
      id: 'PRESET-ENG-02',
      category: 'CAPEX',
      title: 'High-Resolution 3D Stereolithography Resin Prototype Printer',
      department: 'Design & Engineering',
      targetRole: 'finance',
      targetRoleName: 'Factory Accounts & Finance Lead',
      valueOrImpact: '$34,500.00 USD (Payback in 7 Months)',
      defaultJustification: 'Eliminates third-party prototyping lead times (reduced from 12 days to 6 hours) for rapid chassis ergonomics validation.',
      affectedSystem: 'R&D Prototyping Laboratory',
      priority: 'NORMAL',
      glAccount: 'GL-15300 (R&D Lab Equipment)',
    },
  ],

  // 4. Quality & Testing
  quality: [
    {
      id: 'PRESET-QA-01',
      category: 'QUALITY_SCRAP',
      title: 'Batch Scrap Authorization: PCB-9821 BGA Solder Micro-Bridging',
      department: 'Quality Checks & ATE Diagnostics',
      targetRole: 'super_admin',
      targetRoleName: 'Top Management (Owner / MD)',
      valueOrImpact: '$18,450.00 USD (620 Motherboard Units)',
      defaultJustification: 'Irreparable micro-bridging beneath 1156-pin processor caused by nitrogen wave solder temperature excursion. Lot quarantined.',
      affectedSystem: 'Assembly Line B',
      priority: 'CRITICAL',
      glAccount: 'GL-64200 (Scrap & Spoilage Expense)',
    },
    {
      id: 'PRESET-QA-02',
      category: 'ECN_ECO',
      title: 'Temporary Deviation Concession: Display Bezel Anodize Color Tint',
      department: 'Quality Assurance',
      targetRole: 'design',
      targetRoleName: 'Product 3D CAD & Tooling Engineer',
      valueOrImpact: 'Zero Functional Impact / Delta E = 1.2',
      defaultJustification: 'Incoming batch of 4,000 bezels exhibits minor matte black color shift within consumer acceptable variance. Concession requested.',
      affectedSystem: 'Final Casing Assembly Line 4',
      priority: 'NORMAL',
    },
  ],

  // 5. Warehouse & Inventory
  warehouse: [
    {
      id: 'PRESET-WH-01',
      category: 'INVENTORY_WRITEOFF',
      title: 'Quarterly Cycle Count Variance Write-Off: Passive SMD Capacitors',
      department: 'Warehouse & Inventory',
      targetRole: 'finance',
      targetRoleName: 'Factory Accounts & Finance Lead',
      valueOrImpact: '$2,840.00 USD (0.04% Inventory Variance)',
      defaultJustification: 'High-speed automated reel feeder tape leader loss over 2.4 million pick-and-place cycles. Well within 0.1% tolerance threshold.',
      affectedSystem: 'Small Parts Storage Silo 2',
      priority: 'NORMAL',
      glAccount: 'GL-50400 (Inventory Shrinkage Expense)',
    },
    {
      id: 'PRESET-WH-02',
      category: 'INVENTORY_WRITEOFF',
      title: 'Emergency Inter-Plant Stock Transfer: Austin to Stuttgart Bay',
      department: 'Warehouse & Stock',
      targetRole: 'supply_chain',
      targetRoleName: 'Material Planning & Sourcing Lead',
      valueOrImpact: '5,000 Transceiver ICs ($45,000 USD)',
      defaultJustification: 'Transfers buffer inventory to cover Stuttgart plant supplier delay. Prevents automotive sensor line shutdown.',
      affectedSystem: 'Central Finished Goods Dock',
      priority: 'HIGH',
    },
  ],

  // 6. Finance & Accounts
  finance: [
    {
      id: 'PRESET-FIN-01',
      category: 'CAPEX',
      title: 'SMT Line #4 3D Automated Optical Inspection (AOI) Upgrade',
      department: 'Finance & Capital Planning',
      targetRole: 'super_admin',
      targetRoleName: 'Top Management (Owner / MD)',
      valueOrImpact: '$185,000.00 USD (Annual Savings $72K)',
      defaultJustification: 'Replacement of end-of-life 2D AOI system with 3D laser interferometer to reduce false call rate from 4.2% to <0.3%.',
      affectedSystem: 'SMT Cleanroom Bay 4',
      priority: 'CRITICAL',
      glAccount: 'GL-15200 (Machinery & Capital Equipment)',
    },
    {
      id: 'PRESET-FIN-02',
      category: 'PURCHASE_ORDER',
      title: '3-Way AP Tolerance Exception: SilicTech Silicon Inbound Invoice',
      department: 'Finance & Accounts',
      targetRole: 'super_admin',
      targetRoleName: 'Top Management (Owner / MD)',
      valueOrImpact: '$1,240.00 USD Freight Fuel Surcharge Variance',
      defaultJustification: 'PO matched within 0.3% of contract. Ocean carrier bunker fuel surcharge billed per clause 14.1. Approver sign-off required.',
      affectedSystem: 'Automated 3-Way Match AP Engine',
      priority: 'NORMAL',
      glAccount: 'GL-20100 (Accounts Payable)',
    },
  ],

  // 7. Sales & CRM
  crm: [
    {
      id: 'PRESET-CRM-01',
      category: 'DISCOUNT_EXCEPTION',
      title: 'Tier-1 Telecom Carrier Wholesale Volume Rebate Exception (18.5%)',
      department: 'Sales & Customer Care',
      targetRole: 'super_admin',
      targetRoleName: 'Top Management (Owner / MD)',
      valueOrImpact: '$1.42M Contract Value (Gross Margin 28.4%)',
      defaultJustification: 'Bulk annual commitment of 250,000 enterprise units with Nordic Telco. Standard discount cap is 15%. Extra 3.5% yields $400K profit.',
      affectedSystem: 'Enterprise Commercial Contracts',
      priority: 'HIGH',
    },
  ],

  // 8. Asset Reliability & Machine Maintenance
  asset_reliability: [
    {
      id: 'PRESET-MAINT-01',
      category: 'MAINTENANCE_OVERHAUL',
      title: 'Emergency CNC Milling High-Speed Spindle Core Replacement',
      department: 'Machine Maintenance',
      targetRole: 'production',
      targetRoleName: 'Precision Assembly Floor Lead',
      valueOrImpact: '$14,500.00 USD (IBAG High-Speed Spindle)',
      defaultJustification: 'Vibration accelerometer telemetry detected bearing race spalling on CNC Machine 3. Must replace before tool crash.',
      affectedSystem: 'Chassis Milling Center Cell 3',
      priority: 'CRITICAL',
      glAccount: 'GL-15250 (Machinery Maintenance)',
    },
  ],

  // 9. Field Service & Repairs
  field_service: [
    {
      id: 'PRESET-FLD-01',
      category: 'WARRANTY_CLAIM',
      title: 'Customer Goodwill Out-of-Warranty Chassis Replacement RMA',
      department: 'Repair & Client Care',
      targetRole: 'finance',
      targetRoleName: 'Factory Accounts & Finance Lead',
      valueOrImpact: '$3,200.00 USD (Batch of 8 Enterprise Gateways)',
      defaultJustification: 'Major hospital network client experienced power surge damage. Commercial goodwill authorized to protect renewal.',
      affectedSystem: 'Service Center Repair Lab',
      priority: 'NORMAL',
    },
  ],

  // 10. Subcontracting
  subcontracting: [
    {
      id: 'PRESET-SUB-01',
      category: 'SUBCONTRACT_VARIANCE',
      title: 'External SMT Job-Work Scrap Variance Settlement: Alpha Electronics',
      department: 'External Contractors',
      targetRole: 'quality',
      targetRoleName: 'Quality Assurance & Testing Lead',
      valueOrImpact: '$4,800.00 USD (1.2% Component Scrap Allowance)',
      defaultJustification: 'Contractor reconciled component reel scrap from flexible ribbon cable assembly run. Conforms with master job-work annexure.',
      affectedSystem: 'Subcontracting Receiving Bay',
      priority: 'NORMAL',
    },
  ],

  // 11. Logistics & Gate
  logistics: [
    {
      id: 'PRESET-LOG-01',
      category: 'LOGISTICS_CLEARANCE',
      title: 'Factory Gate Emergency Overweight Truck Receiving Clearance',
      department: 'Logistics & Security Gate',
      targetRole: 'super_admin',
      targetRoleName: 'Top Management (Owner / MD)',
      valueOrImpact: '42.5 Metric Ton Raw Ingot Delivery',
      defaultJustification: 'Heavy aluminum extrusion billet delivery exceeded axle limit by 1.8%. Dock 4 reinforced weighbridge verified.',
      affectedSystem: 'North Cargo Gate Scale #2',
      priority: 'HIGH',
    },
  ],

  // 12. Fleet & Delivery
  fleet: [
    {
      id: 'PRESET-FLT-01',
      category: 'FLEET_EXPENSE',
      title: 'Interstate Delivery Semi-Truck Emergency Diesel Fleet Card Override',
      department: 'Fleet & Delivery',
      targetRole: 'finance',
      targetRoleName: 'Factory Accounts & Finance Lead',
      valueOrImpact: '$1,650.00 USD (Emergency Roadside Fuel)',
      defaultJustification: 'Severe winter detour on I-35 corridor requiring 450 extra transit miles for cross-dock delivery to Dallas carrier hub.',
      affectedSystem: 'Apex Transport Fleet Vehicle TRK-08',
      priority: 'HIGH',
    },
  ],

  // 13. Marketing & Brand
  marketing: [
    {
      id: 'PRESET-MKT-01',
      category: 'MARKETING_BUDGET',
      title: 'Flagship Enterprise Product Launch Global Media Showcase Supplement',
      department: 'Marketing & Brand',
      targetRole: 'finance',
      targetRoleName: 'Factory Accounts & Finance Lead',
      valueOrImpact: '$45,000.00 USD',
      defaultJustification: 'Tier-1 technology keynote press conference live broadcast and digital live-stream production.',
      affectedSystem: 'Brand Launch Campaign FY26',
      priority: 'HIGH',
      glAccount: 'GL-61000 (Commercial Marketing)',
    },
  ],

  // 14. Factory IT & System Admin
  system_admin: [
    {
      id: 'PRESET-IT-01',
      category: 'BREAK_GLASS_ACCESS',
      title: 'Ephemeral Break-Glass Root Database Elevation (120 Minutes)',
      department: 'IT & Factory Systems',
      targetRole: 'super_admin',
      targetRoleName: 'Top Management (Owner / MD)',
      valueOrImpact: 'Zero-Trust Audited Elevation',
      defaultJustification: 'Disaster recovery failover database replica resynchronization following cleanroom power fluctuation.',
      affectedSystem: 'Primary Enterprise PostgreSQL Cluster',
      priority: 'CRITICAL',
    },
  ],
};

export const INITIAL_SEEDED_REQUESTS: WorkflowItem[] = [
  {
    id: 'APP-2026-0891',
    category: 'CAPEX',
    title: 'SMT Line #4 Automated Optical Inspection (AOI) Upgrade',
    department: 'Manufacturing Engineering',
    targetRole: 'super_admin',
    targetRoleName: 'Top Management (Owner / MD)',
    requester: {
      name: 'Dr. Evelyn Vance',
      role: 'Principal Process Engineer',
      roleId: 'production',
      avatar: 'EV',
    },
    valueOrImpact: '$185,000.00',
    submittedAt: '2026-10-23 08:30 AM',
    deadlineHoursRemaining: 6,
    priority: 'CRITICAL',
    details: {
      justification: 'Replacement of end-of-life 2D AOI system with 3D high-speed laser interferometer to reduce false call rates from 4.2% to <0.3%.',
      affectedSystem: 'SMT Cleanroom Bay 4',
      glAccount: 'GL-15200 (Machinery & Capital Equipment)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0892',
    category: 'PURCHASE_ORDER',
    title: 'Bulk Silicon Wafer Raw Substrates (Quarterly Blanket PO)',
    department: 'Procurement & Sourcing',
    targetRole: 'finance',
    targetRoleName: 'Factory Accounts & Finance Lead',
    requester: {
      name: 'Marcus Brody',
      role: 'Senior Sourcing Manager',
      roleId: 'procurement',
      avatar: 'MB',
    },
    valueOrImpact: '$412,500.00',
    submittedAt: '2026-10-23 07:15 AM',
    deadlineHoursRemaining: 14,
    priority: 'HIGH',
    details: {
      justification: 'Quarterly supply agreement with SilicTech Global for 300mm ultra-pure polished prime wafers. Tier 1 volume discount of 8.5% locked.',
      affectedSystem: 'Substrate Inventory Silo 1',
      lineItemsCount: 8,
      glAccount: 'GL-50100 (Direct Materials Inventory)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0893',
    category: 'ECN_ECO',
    title: 'ECN-7804: Thermal Heat-Sink Fin Geometry Refinement',
    department: 'Hardware R&D',
    targetRole: 'quality',
    targetRoleName: 'Quality Assurance & Testing Lead',
    requester: {
      name: 'Claire Chen',
      role: 'Lead Thermal Architect',
      roleId: 'design',
      avatar: 'CC',
    },
    valueOrImpact: 'BOM Cost Neutral / +8.2°C Thermal Margin',
    submittedAt: '2026-10-22 16:45 PM',
    deadlineHoursRemaining: 28,
    priority: 'HIGH',
    details: {
      justification: 'Modifies copper extruded fin density from 14 FPI to 18 FPI to prevent throttling at 45°C ambient. Fully tested in wind tunnel rig.',
      affectedSystem: 'Apex Industrial Gateway Gen 3',
      lineItemsCount: 3,
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0894',
    category: 'QUALITY_SCRAP',
    title: 'Disposal Scrap Authorization: Batch #PCB-9821 Soldering Bridging',
    department: 'Quality Assurance',
    targetRole: 'super_admin',
    targetRoleName: 'Top Management (Owner / MD)',
    requester: {
      name: 'David O\'Connor',
      role: 'Plant QA Lead',
      roleId: 'quality',
      avatar: 'DO',
    },
    valueOrImpact: '$18,450.00 (620 Motherboard Units)',
    submittedAt: '2026-10-23 09:10 AM',
    deadlineHoursRemaining: 4,
    priority: 'CRITICAL',
    details: {
      justification: 'Irreparable micro-bridging beneath 1156-pin BGA processor package caused by nitrogen wave solder temperature excursion.',
      affectedSystem: 'Assembly Line B',
      glAccount: 'GL-64200 (Scrap & Spoilage Expense)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0895',
    category: 'HR_LEAVE',
    title: 'Extended Medical & Paternity Leave Request (4 Weeks)',
    department: 'Plant Operations',
    targetRole: 'production',
    targetRoleName: 'Precision Assembly Floor Lead',
    requester: {
      name: 'Rajesh Patel',
      role: 'Senior CNC Machinist',
      roleId: 'plant_operator',
      avatar: 'RP',
    },
    valueOrImpact: '160 Production Hours (Relief Staff Assigned)',
    submittedAt: '2026-10-22 11:00 AM',
    deadlineHoursRemaining: 42,
    priority: 'NORMAL',
    details: {
      justification: 'Statutory family leave. Cross-trained relief machinist (Aaron Miller) scheduled for CNC Cell 3 with zero line disruption.',
      affectedSystem: 'Machining Hall Shift A',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0896',
    category: 'INVENTORY_WRITEOFF',
    title: 'Quarterly Inventory Reconciliation: Reel Feeder Solder Paste Spoilage',
    department: 'Parts Stock & Warehouse',
    targetRole: 'finance',
    targetRoleName: 'Factory Accounts & Finance Lead',
    requester: {
      name: 'Vikram Rajput',
      role: 'Warehouse Operations Manager',
      roleId: 'warehouse',
      avatar: 'VR',
    },
    valueOrImpact: '$9,200.00 USD (Cleanroom Storage)',
    submittedAt: '2026-10-23 06:40 AM',
    deadlineHoursRemaining: 18,
    priority: 'HIGH',
    details: {
      justification: 'SAC305 lead-free solder paste jars exceeded 6-month shelf life refrigeration protocol pursuant to IPC-J-STD-005 standards.',
      affectedSystem: 'Refrigerated Parts Vault #4',
      glAccount: 'GL-50400 (Inventory Shrinkage)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0897',
    category: 'DISCOUNT_EXCEPTION',
    title: 'Wholesale Volume Pricing Rebate: Nordic Telco Contract (18.5%)',
    department: 'Sales & Customer Care',
    targetRole: 'super_admin',
    targetRoleName: 'Top Management (Owner / MD)',
    requester: {
      name: 'Sarah Chen',
      role: 'Enterprise Accounts Director',
      roleId: 'crm',
      avatar: 'SC',
    },
    valueOrImpact: '$1,420,000.00 USD Contract Value',
    submittedAt: '2026-10-23 07:30 AM',
    deadlineHoursRemaining: 10,
    priority: 'HIGH',
    details: {
      justification: 'Customer committed to 250,000 units. Standard pricing ceiling is 15%. Extra 3.5% discount delivers $403,000 net operating profit.',
      affectedSystem: 'Enterprise Commercial Contracts',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0898',
    category: 'MAINTENANCE_OVERHAUL',
    title: 'High-Speed Milling Spindle Bearing Race Replacement (Cell 3)',
    department: 'Machine Maintenance',
    targetRole: 'production',
    targetRoleName: 'Precision Assembly Floor Lead',
    requester: {
      name: 'Marcus Vance',
      role: 'Principal Reliability Engineer',
      roleId: 'asset_reliability',
      avatar: 'MV',
    },
    valueOrImpact: '$14,500.00 USD Replacement Core',
    submittedAt: '2026-10-23 08:05 AM',
    deadlineHoursRemaining: 5,
    priority: 'CRITICAL',
    details: {
      justification: 'Vibration monitoring accelerometer flagged high-frequency harmonics on spindle bearing. Replacement needed before catastrophic seizure.',
      affectedSystem: 'Chassis Milling Center Cell 3',
      glAccount: 'GL-15250 (Machinery Maintenance)',
    },
    status: 'PENDING',
  },
];

class WorkflowService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public getAll(): WorkflowItem[] {
    if (!this.isBrowser()) return INITIAL_SEEDED_REQUESTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_REQUESTS));
        return INITIAL_SEEDED_REQUESTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SEEDED_REQUESTS;
    }
  }

  public getByRequester(roleIdOrName: string): WorkflowItem[] {
    const all = this.getAll();
    return all.filter(
      (item) =>
        item.requester.roleId === roleIdOrName ||
        item.requester.name.toLowerCase() === roleIdOrName.toLowerCase()
    );
  }

  /**
   * Returns items pending approval by a given role.
   * If super_admin, returns all pending items across the whole company.
   * Otherwise matches targetRole or department supervisor mappings.
   */
  public getPendingForApprover(roleId?: string): WorkflowItem[] {
    const all = this.getAll().filter((item) => item.status === 'PENDING');
    if (!roleId || roleId === 'super_admin') {
      return all;
    }

    return all.filter((item) => {
      if (item.targetRole === roleId) return true;
      if (roleId === 'finance' && (item.category === 'PURCHASE_ORDER' || item.category === 'CAPEX' || item.category === 'INVENTORY_WRITEOFF' || item.category === 'FLEET_EXPENSE' || item.category === 'MARKETING_BUDGET')) return true;
      if (roleId === 'production' && (item.category === 'HR_LEAVE' || item.category === 'HR_OVERTIME' || item.category === 'MAINTENANCE_OVERHAUL')) return true;
      if (roleId === 'quality' && (item.category === 'ECN_ECO' || item.category === 'QUALITY_SCRAP' || item.category === 'SUBCONTRACT_VARIANCE')) return true;
      if (roleId === 'supply_chain' && (item.category === 'PURCHASE_ORDER' || item.category === 'INVENTORY_WRITEOFF' || item.category === 'LOGISTICS_CLEARANCE')) return true;
      if (roleId === 'hr' && (item.category === 'HR_LEAVE' || item.category === 'HR_OVERTIME')) return true;
      return false;
    });
  }

  public getPresetsForRole(roleId: string): RoleActionPreset[] {
    if (ROLE_WORKFLOW_PRESETS[roleId]) {
      return ROLE_WORKFLOW_PRESETS[roleId];
    }
    // Generic fallback presets
    return [
      {
        id: `PRESET-${roleId.toUpperCase()}-01`,
        category: 'HR_LEAVE',
        title: `Standard Leave & Absence Pass: ${roleId.replace(/_/g, ' ')}`,
        department: 'Operational Staff',
        targetRole: 'super_admin',
        targetRoleName: 'Top Management (Owner / MD)',
        valueOrImpact: '16 Standard Hours',
        defaultJustification: 'Operational absence with assigned coverage.',
        affectedSystem: 'Operational Station',
        priority: 'NORMAL',
      },
      {
        id: `PRESET-${roleId.toUpperCase()}-02`,
        category: 'CAPEX',
        title: `Operational Resource Requisition: ${roleId.replace(/_/g, ' ')}`,
        department: 'Operational Unit',
        targetRole: 'finance',
        targetRoleName: 'Factory Accounts & Finance Lead',
        valueOrImpact: '$15,000.00 USD Budget Allocation',
        defaultJustification: 'Equipment calibration and operational tool maintenance.',
        affectedSystem: 'Factory Station',
        priority: 'HIGH',
      },
    ];
  }

  public createRequest(item: Omit<WorkflowItem, 'id' | 'submittedAt' | 'status'> & { id?: string }): WorkflowItem {
    const all = this.getAll();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newItem: WorkflowItem = {
      ...item,
      id: item.id || `REQ-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: formattedDate,
      status: 'PENDING',
    };

    const updated = [newItem, ...all];
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newItem }));
      } catch (e) {
        console.error('Failed to persist workflow request to localStorage', e);
      }
    }
    return newItem;
  }

  public updateStatus(
    id: string,
    status: WorkflowStatus,
    notes?: string,
    decidedBy: string = 'Supervisory Authority'
  ): WorkflowItem | null {
    const all = this.getAll();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    let updatedItem: WorkflowItem | null = null;
    const updated = all.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          status,
          decisionNotes: notes || item.decisionNotes,
          decidedBy,
          decidedAt: formattedDate,
        };
        return updatedItem;
      }
      return item;
    });

    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { id, status, updatedItem } }));
      } catch (e) {
        console.error('Failed to update workflow item status in localStorage', e);
      }
    }
    return updatedItem;
  }

  public resetToDefault(): WorkflowItem[] {
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_REQUESTS));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: INITIAL_SEEDED_REQUESTS }));
      } catch (e) {
        console.error('Failed to reset workflow items', e);
      }
    }
    return INITIAL_SEEDED_REQUESTS;
  }
}

export const workflowStore = new WorkflowService();

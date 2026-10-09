// ============================================================================
// Apex Manufacturing ERP - Industrial Schema & 13 Roles Type Definitions
// ============================================================================

/**
 * 13 Specialized Manufacturing Roles & Reference Industrial Roles
 */
export enum UserRole {
  TOP_MANAGEMENT = 'TOP_MANAGEMENT',         // Owner / Managing Director
  PRODUCTION_MANAGER = 'PRODUCTION_MANAGER', // Shop floor & line orchestration
  PURCHASE_MANAGER = 'PURCHASE_MANAGER',     // Vendor sourcing & PO issuance
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',   // Inventory bins, putaway & batch control
  QUALITY_CONTROL = 'QUALITY_CONTROL',       // MIR inspection & final QC CoC
  PLANT_MAINTENANCE = 'PLANT_MAINTENANCE',   // Machine telemetry, MTTR/MTBF & work tickets
  SALES_DISPATCH = 'SALES_DISPATCH',         // Sales orders, packing lists & e-Way bills
  GATE_SECURITY = 'GATE_SECURITY',           // Weighbridge gross/tare & QR gate passes
  SUBCONTRACTING = 'SUBCONTRACTING',         // Outward job work challans & scrap reconciliation
  FINANCE_ACCOUNTS = 'FINANCE_ACCOUNTS',     // 3-way match, costing & debit notes
  HR_PAYROLL = 'HR_PAYROLL',                 // Shifts, biometric check-in & payroll
  EHS_OFFICER = 'EHS_OFFICER',               // Environmental health, safety & compliance
  IT_ADMIN = 'IT_ADMIN',                     // RBAC permissions, audit trails & MFA
}

export enum Role {
  // 13 Specialized Manufacturing Roles
  TOP_MANAGEMENT = 'TOP_MANAGEMENT',
  PRODUCTION_MANAGER = 'PRODUCTION_MANAGER',
  PURCHASE_MANAGER = 'PURCHASE_MANAGER',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  QUALITY_CONTROL = 'QUALITY_CONTROL',
  PLANT_MAINTENANCE = 'PLANT_MAINTENANCE',
  SALES_DISPATCH = 'SALES_DISPATCH',
  GATE_SECURITY = 'GATE_SECURITY',
  SUBCONTRACTING = 'SUBCONTRACTING',
  FINANCE_ACCOUNTS = 'FINANCE_ACCOUNTS',
  HR_PAYROLL = 'HR_PAYROLL',
  EHS_OFFICER = 'EHS_OFFICER',
  IT_ADMIN = 'IT_ADMIN',

  // Legacy mappings for backward compatibility
  OWNER = 'OWNER',
  PPC = 'PPC',
  PURCHASE = 'PURCHASE',
  INVENTORY = 'INVENTORY',
  PRODUCTION_SUPERVISOR = 'PRODUCTION_SUPERVISOR',
  QC_MANAGER = 'QC_MANAGER',
  DISPATCH = 'DISPATCH',
  FINANCE = 'FINANCE',
  HR = 'HR',
  ADMIN = 'ADMIN',
}

export enum ItemType {
  // Industrial Electronics / Reference Architecture Components
  IC = 'IC',
  DISPLAY = 'DISPLAY',
  OPTICS = 'OPTICS',
  BATTERY = 'BATTERY',
  SHELL = 'SHELL',
  CONNECTORS = 'CONNECTORS',
  CONSUMABLE = 'CONSUMABLE',
  // ERP Standard Lifecycle Categories
  RAW_MATERIAL = 'RAW_MATERIAL',
  WIP = 'WIP',
  FINISHED_GOOD = 'FINISHED_GOOD',
  SCRAP = 'SCRAP',
}

export enum ExpenseCategory {
  UTILITIES = 'UTILITIES',
  ENVIRONMENT = 'ENVIRONMENT',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  MAINTENANCE = 'MAINTENANCE',
  COMPLIANCE = 'COMPLIANCE',
  LOGISTICS = 'LOGISTICS',
}

export enum ProductionStation {
  SMT_LINE = 'SMT_LINE',
  OPTICAL_AOI = 'OPTICAL_AOI',
  SCREWDRIVING = 'SCREWDRIVING',
  RF_ANTENNA = 'RF_ANTENNA',
  BATTERY_SEAL = 'BATTERY_SEAL',
  PACKAGING = 'PACKAGING',
}

export enum SerializedUnitStatus {
  IN_PROCESS = 'IN_PROCESS',
  PASSED = 'PASSED',
  REJECTED = 'REJECTED',
}

export enum SubcontractStatus {
  TOLERANCE_APPROVED = 'TOLERANCE_APPROVED',
  SHORTAGE_PENALTY = 'SHORTAGE_PENALTY',
  SETTLED = 'SETTLED',
}

export enum ApprovalCategory {
  CAPEX = 'CAPEX',
  PO = 'PO',
  CONTRACT = 'CONTRACT',
}

// ----------------------------------------------------------------------------
// Core User & Authentication Models
// ----------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  password?: string;
  role: UserRole | Role;
  userRole?: UserRole | null;
  salary?: number | string | null;       // CTC (Cost to Company)
  geoTag?: string | null;               // GPS Coordinates / Geo-fence
  shiftCheckIn?: Date | string | null;  // Biometric check-in timestamp
  isActive: boolean;
  mfaSecret?: string | null;            // TOTP MFA Secret for GST / High Value
  firstName?: string | null;
  lastName?: string | null;
  lastLoginAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ----------------------------------------------------------------------------
// Costing & Plant Overhead Models
// ----------------------------------------------------------------------------

export interface PlantExpense {
  id: string;
  title: string;
  category: ExpenseCategory;
  monthlyAmount: number | string;
  iconKey?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CostingParameter {
  id: string;
  targetSellingPrice: number | string;
  monthlyProductionTargetVolume: number | string;
  rawCostPerUnitCache: number | string;
  overheadPerUnitCache: number | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CPtoSPProfitabilityCalculation {
  rawMaterialCost: number;
  plantOverheadCost: number;
  totalCostPrice: number;       // CP = Raw Material + Plant Overhead
  targetSellingPrice: number;   // SP
  grossMarginAmount: number;    // SP - CP
  grossMarginPercentage: number;// ((SP - CP) / SP) * 100
}

// ----------------------------------------------------------------------------
// Item Master & BOM Models
// ----------------------------------------------------------------------------

export interface ItemMaster {
  id: string;
  sku?: string | null;          // 15-digit SKU / Industrial Part Number
  code: string;                 // Unique item code / SKU
  name: string;
  category: ItemType;
  uom: string;                  // Unit of Measure (PCS, KG, etc.)
  unit?: string | null;
  customAttrs: Record<string, any>; // Dynamic JSONB attributes (grade, specs, tolerances)
  currentStock: number | string;
  stockQty?: number | string | null;
  minStockQty: number | string;
  minReorderLevel?: number | string | null;
  unitCost: number | string;
  costPerPiece?: number | string | null; // Live feedable rate
  sellingPrice: number | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BOMItem {
  id: string;
  bomId?: string | null;
  parentItemId?: string | null;
  componentItemId: string;
  subBomId?: string | null;
  quantity: number | string;
  requiredPerUnit?: number | string | null; // Required per finished unit
  scrapRate: number | string;              // Scrap rate %
  scrapTolerancePct?: number | string | null; // Scrap tolerance %
  uom: string;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ----------------------------------------------------------------------------
// Shop Floor & Serialized IMEI Tracking
// ----------------------------------------------------------------------------

export interface SerializedUnitHistoryEntry {
  station: ProductionStation;
  status: SerializedUnitStatus;
  operatorId?: string;
  operatorName?: string;
  notes?: string;
  timestamp: string;
  measurements?: Record<string, number | string>;
}

export interface SerializedUnit {
  id: string;
  serialNumber: string;         // 15-digit IMEI or UID
  productId: string;
  currentStation: ProductionStation;
  status: SerializedUnitStatus;
  historyLogs: SerializedUnitHistoryEntry[] | Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
  product?: ItemMaster;
}

export interface TelemetryLog {
  id: string;
  machineId: string;
  lineId: string;
  reflowTemp?: number | null;      // Celsius
  torqueNm?: number | null;        // Newton-meters
  oeeAvailability?: number | null; // % (0-100)
  oeePerformance?: number | null;  // % (0-100)
  oeeQuality?: number | null;      // % (0-100)
  timestamp: Date | string;
}

// ----------------------------------------------------------------------------
// Financial, Subcontracting & Credit Models
// ----------------------------------------------------------------------------

export interface CustomerCredit {
  id: string;
  customerName: string;
  creditLimit: number | string;
  outstandingAmount: number | string;
  isLocked: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SubcontractChallan {
  id: string;
  challanNo: string;
  vendorName: string;
  sentQty: number | string;
  returnedQty: number | string;
  allowedScrapQty: number | string;
  actualScrapQty: number | string;
  status: SubcontractStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DebitNote {
  id: string;
  dnNumber: string;             // e.g. DN-2026-0001
  vendorId: string;
  lotRef: string;
  amount: number | string;
  reason: string;
  rtvChallanNo?: string | null; // Return To Vendor Challan Number
  apDeductionStatus: string;    // AP_PENDING, DEDUCTED, SETTLED
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface HighValueApproval {
  id: string;
  refNo: string;
  category: ApprovalCategory;
  amount: number | string;
  isMfaVerified: boolean;
  authorizedByUserId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorizedBy?: User;
}

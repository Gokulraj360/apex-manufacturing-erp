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

/**
 * Standard Role Enum (backward-compatible with legacy roles)
 */
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

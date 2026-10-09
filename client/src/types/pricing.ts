export type PriceType = 'RAW_MATERIAL_COST' | 'PRODUCT_SELLING_PRICE';

export type PriceOverrideStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export type PriceFieldTarget =
  | 'MATERIAL_COST'
  | 'BOM_COMPONENT_COST'
  | 'PURCHASE_ORDER_RATE'
  | 'QUOTATION_SELLING_RATE'
  | 'INVOICE_ITEM_PRICE'
  | 'DELIVERY_CHALLAN_RATE';

export interface RolePriceAccess {
  role: string;
  costPrice: {
    canView: boolean;
    canEdit: boolean;
  };
  sellingPrice: {
    canView: boolean;
    canEdit: boolean;
    maxDiscountPct?: number;
    minMarginPct?: number;
  };
}

export interface PriceOverrideRequestItem {
  id: string;
  requestNumber: string;
  targetEntity: string;
  entityId: string;
  itemSku: string;
  itemName?: string | null;
  priceType: PriceType;
  currentPrice: number;
  requestedPrice: number;
  deltaPercentage: number;
  justification: string;
  requestedBy: string;
  requesterRole: string;
  status: PriceOverrideStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewRemarks?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PriceAuditRecordItem {
  id: string;
  auditCode: string;
  targetEntity: string;
  entityId: string;
  itemSku: string;
  priceType: PriceType;
  targetField: PriceFieldTarget;
  oldPrice: number;
  newPrice: number;
  currency: string;
  modifiedBy: string;
  userRole: string;
  justification: string;
  isOverrideApproved: boolean;
  overrideRequestId?: string | null;
  approvedBy?: string | null;
  timestamp: string;
}

export interface PricingPermissionCheckResult {
  allowed: boolean;
  reason: string;
  canView: boolean;
  canEdit: boolean;
  requiresOverride: boolean;
  maxDiscountPct?: number;
  minMarginPct?: number;
}

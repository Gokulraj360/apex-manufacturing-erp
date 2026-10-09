'use client';

import { useState, useCallback, useMemo } from 'react';
import { RolePriceAccess, PriceType } from '@/types/pricing';

export const SYSTEM_ROLE_MATRIX: Record<
  string,
  {
    costPrice: { canView: boolean; canEdit: boolean };
    sellingPrice: {
      canView: boolean;
      canEdit: boolean;
      maxDiscountPct?: number;
      minMarginPct?: number;
    };
  }
> = {
  SUPER_ADMIN: {
    costPrice: { canView: true, canEdit: true },
    sellingPrice: { canView: true, canEdit: true },
  },
  OWNER: {
    costPrice: { canView: true, canEdit: true },
    sellingPrice: { canView: true, canEdit: true },
  },
  PROCUREMENT_OFFICER: {
    costPrice: { canView: true, canEdit: true },
    sellingPrice: { canView: false, canEdit: false },
  },
  SUPPLY_CHAIN_MANAGER: {
    costPrice: { canView: true, canEdit: true },
    sellingPrice: { canView: false, canEdit: false },
  },
  FINANCE_MANAGER: {
    costPrice: { canView: true, canEdit: true },
    sellingPrice: { canView: true, canEdit: true },
  },
  ACCOUNTS_EXECUTIVE: {
    costPrice: { canView: true, canEdit: true },
    sellingPrice: { canView: true, canEdit: true },
  },
  DESIGN_ENGINEER: {
    costPrice: { canView: true, canEdit: false },
    sellingPrice: { canView: false, canEdit: false },
  },
  PRODUCTION_MANAGER: {
    costPrice: { canView: true, canEdit: false },
    sellingPrice: { canView: false, canEdit: false },
  },
  WAREHOUSE_MANAGER: {
    costPrice: { canView: true, canEdit: false },
    sellingPrice: { canView: true, canEdit: false },
  },
  CRM_SALES_REP: {
    costPrice: { canView: false, canEdit: false },
    sellingPrice: { canView: true, canEdit: true, maxDiscountPct: 10, minMarginPct: 15 },
  },
  MARKETING_MANAGER: {
    costPrice: { canView: false, canEdit: false },
    sellingPrice: { canView: true, canEdit: false },
  },
  DISPATCH_EXECUTIVE: {
    costPrice: { canView: false, canEdit: false },
    sellingPrice: { canView: true, canEdit: false },
  },
  SHOP_FLOOR_WORKER: {
    costPrice: { canView: false, canEdit: false },
    sellingPrice: { canView: false, canEdit: false },
  },
};

export function usePricingPermission(initialRole = 'PROCUREMENT_OFFICER') {
  const [role, setRole] = useState<string>(initialRole);

  const normalizedRole = useMemo(() => {
    return role.toUpperCase().replace(/\s+/g, '_');
  }, [role]);

  const permissions = useMemo<RolePriceAccess>(() => {
    const config = SYSTEM_ROLE_MATRIX[normalizedRole] || {
      costPrice: { canView: false, canEdit: false },
      sellingPrice: { canView: false, canEdit: false },
    };
    return {
      role: normalizedRole,
      costPrice: config.costPrice,
      sellingPrice: config.sellingPrice,
    };
  }, [normalizedRole]);

  const canViewCostPrice = useCallback(
    (checkRole?: string) => {
      const r = checkRole ? checkRole.toUpperCase().replace(/\s+/g, '_') : normalizedRole;
      return SYSTEM_ROLE_MATRIX[r]?.costPrice.canView ?? false;
    },
    [normalizedRole],
  );

  const canEditCostPrice = useCallback(
    (checkRole?: string) => {
      const r = checkRole ? checkRole.toUpperCase().replace(/\s+/g, '_') : normalizedRole;
      return SYSTEM_ROLE_MATRIX[r]?.costPrice.canEdit ?? false;
    },
    [normalizedRole],
  );

  const canViewSellingPrice = useCallback(
    (checkRole?: string) => {
      const r = checkRole ? checkRole.toUpperCase().replace(/\s+/g, '_') : normalizedRole;
      return SYSTEM_ROLE_MATRIX[r]?.sellingPrice.canView ?? false;
    },
    [normalizedRole],
  );

  const canEditSellingPrice = useCallback(
    (checkRole?: string) => {
      const r = checkRole ? checkRole.toUpperCase().replace(/\s+/g, '_') : normalizedRole;
      return SYSTEM_ROLE_MATRIX[r]?.sellingPrice.canEdit ?? false;
    },
    [normalizedRole],
  );

  const checkDiscountAllowed = useCallback(
    (proposedPrice: number, currentPrice: number, checkRole?: string) => {
      const r = checkRole ? checkRole.toUpperCase().replace(/\s+/g, '_') : normalizedRole;
      const config = SYSTEM_ROLE_MATRIX[r]?.sellingPrice;
      if (!config || !config.canEdit) return false;
      if (!config.maxDiscountPct) return true; // Super Admin or Finance with no limit

      if (currentPrice <= 0) return true;
      const discountPct = ((currentPrice - proposedPrice) / currentPrice) * 100;
      return discountPct <= config.maxDiscountPct;
    },
    [normalizedRole],
  );

  return {
    role,
    setRole,
    normalizedRole,
    permissions,
    canViewCostPrice,
    canEditCostPrice,
    canViewSellingPrice,
    canEditSellingPrice,
    checkDiscountAllowed,
  };
}

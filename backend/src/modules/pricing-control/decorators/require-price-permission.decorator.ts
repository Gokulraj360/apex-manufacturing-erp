import { SetMetadata } from '@nestjs/common';
import { PriceType, PriceFieldTarget } from '@prisma/client';

export const PRICE_PERMISSION_KEY = 'price_permission';

export interface PricePermissionRequirement {
  action: 'VIEW' | 'EDIT';
  type: PriceType;
  targetField?: PriceFieldTarget;
}

/**
 * Decorator to enforce field-level pricing RBAC on controller endpoints
 */
export const RequirePricePermission = (
  action: 'VIEW' | 'EDIT',
  type: PriceType,
  targetField?: PriceFieldTarget,
) =>
  SetMetadata(PRICE_PERMISSION_KEY, {
    action,
    type,
    targetField,
  } as PricePermissionRequirement);

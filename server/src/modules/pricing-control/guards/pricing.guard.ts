import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PRICE_PERMISSION_KEY,
  PricePermissionRequirement,
} from '../decorators/require-price-permission.decorator';
import { PricingPolicyService } from '../services/pricing-policy.service';

@Injectable()
export class PricingGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly pricingPolicyService: PricingPolicyService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requirement = this.reflector.getAllAndOverride<PricePermissionRequirement>(
      PRICE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();

    // Extract role from auth token or simulation header
    const userRole =
      request.user?.role?.name ||
      request.user?.role ||
      request.headers['x-user-role'] ||
      'SHOP_FLOOR_WORKER';

    // If endpoint has explicit @RequirePricePermission decorator
    if (requirement) {
      const check = this.pricingPolicyService.checkPermission({
        roleName: String(userRole),
        priceType: requirement.type,
        action: requirement.action,
        targetField: requirement.targetField,
      });

      if (!check.allowed) {
        throw new ForbiddenException(
          `Pricing RBAC Restriction: ${check.reason}`,
        );
      }
    }

    // On data mutation methods (POST, PATCH, PUT), inspect request body for unauthorized field tampering
    const method = request.method;
    if (['POST', 'PATCH', 'PUT'].includes(method) && request.body) {
      this.pricingPolicyService.validatePayloadEdits(request.body, String(userRole));
    }

    return true;
  }
}

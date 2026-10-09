import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRbacService } from '../admin-rbac.service';

export const REQUIRED_FUNCTION_KEY = 'required_function_key';
export const RequireErpFunction = (functionKey: string) =>
  SetMetadata(REQUIRED_FUNCTION_KEY, functionKey);

@Injectable()
export class DynamicFunctionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: AdminRbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFunction = this.reflector.getAllAndOverride<string>(
      REQUIRED_FUNCTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no specific ERP function is required, allow through
    if (!requiredFunction) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole =
      request.headers['x-user-role'] ||
      request.user?.role?.name ||
      request.user?.roleId ||
      request.query?.role ||
      'super_admin';

    const check = await this.rbacService.checkFunctionAccess({
      roleName: String(userRole),
      functionKey: requiredFunction,
    });

    if (!check.isAllowed) {
      throw new ForbiddenException({
        statusCode: 403,
        error: 'Forbidden Function Access',
        message: `Role "${userRole}" is restricted from executing operational function: "${requiredFunction}". Contact Super Admin to enable this privilege in the Dynamic RBAC Matrix.`,
        functionKey: requiredFunction,
        role: userRole,
        reason: check.reason,
      });
    }

    return true;
  }
}

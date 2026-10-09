import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { ErrorCode } from '../enums/error-code.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified on handler or class, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException({
        message: 'Access denied: user role could not be verified.',
        errorCode: ErrorCode.INSUFFICIENT_PERMISSIONS,
      });
    }

    // TOP_MANAGEMENT, ADMIN, and OWNER have executive privileges across all modules
    if (
      user.role === Role.TOP_MANAGEMENT ||
      user.role === 'TOP_MANAGEMENT' ||
      user.role === Role.ADMIN ||
      user.role === Role.OWNER
    ) {
      return true;
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException({
        message: `Forbidden: role '${user.role}' lacks permissions for this operation. Required roles: [${requiredRoles.join(', ')}].`,
        errorCode: ErrorCode.INSUFFICIENT_PERMISSIONS,
      });
    }

    return true;
  }
}

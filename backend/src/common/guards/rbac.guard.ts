import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, RequiredPermission } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<RequiredPermission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by Auth middleware / token validation

    if (!user || !user.roleId) {
      throw new ForbiddenException('Access denied: Authentication context missing.');
    }

    // Load role with attached permissions
    const userRole = await this.prisma.role.findUnique({
      where: { id: user.roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!userRole) {
      throw new ForbiddenException('Access denied: Role not recognized.');
    }

    // Super Admin (Hierarchy level 0) bypasses all permission checks
    if (userRole.hierarchyLevel === 0) {
      return true;
    }

    const grantedPermissions = new Set(
      userRole.permissions.map(
        (rp) => `${rp.permission.action}:${rp.permission.resource}`.toUpperCase(),
      ),
    );

    const hasAllPermissions = requiredPermissions.every((req) =>
      grantedPermissions.has(`${req.action}:${req.resource}`.toUpperCase()),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        'Access denied: Insufficient privileges to execute this executive operation.',
      );
    }

    return true;
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from './audit-log.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  AssignPermissionsDto,
  RevokePermissionsDto,
  AssignUserRoleDto,
} from '../dto/rbac.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';

@Injectable()
export class RBACService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all roles with attached permissions and user counts
   */
  async getAllRoles() {
    return this.prisma.role.findMany({
      orderBy: { hierarchyLevel: 'asc' },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
    });
  }

  /**
   * List all system permissions
   */
  async getAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });
  }

  /**
   * Create a new role (e.g. Plant Manager, Line Supervisor, Quality Operator)
   */
  async createRole(dto: CreateRoleDto, adminUserId?: string) {
    const existing = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(`Role "${dto.name}" already exists.`);
    }

    const role = await this.prisma.role.create({
      data: {
        name: dto.name,
        description: dto.description,
        hierarchyLevel: dto.hierarchyLevel,
        permissions: dto.permissionIds && dto.permissionIds.length > 0 ? {
          create: dto.permissionIds.map((pId) => ({
            permissionId: pId,
            grantedBy: adminUserId,
          })),
        } : undefined,
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.CREATE,
      entity: 'ROLE',
      entityId: role.id,
      details: `Created new RBAC role: ${role.name} with hierarchy level ${role.hierarchyLevel}`,
      changes: { created: role },
      severity: AuditSeverity.WARNING,
    });

    return role;
  }

  /**
   * Update role metadata
   */
  async updateRole(id: string, dto: UpdateRoleDto, adminUserId?: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }

    if (role.isSystemRole && dto.hierarchyLevel !== undefined && dto.hierarchyLevel !== role.hierarchyLevel) {
      throw new BadRequestException('Cannot alter hierarchy level of protected system roles.');
    }

    const updated = await this.prisma.role.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        hierarchyLevel: dto.hierarchyLevel,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.UPDATE,
      entity: 'ROLE',
      entityId: id,
      details: `Updated role configuration for: ${updated.name}`,
      changes: { before: role, after: updated },
      severity: AuditSeverity.WARNING,
    });

    return updated;
  }

  /**
   * Delete a role (only if non-system and has no assigned users)
   */
  async deleteRole(id: string, adminUserId?: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }
    if (role.isSystemRole) {
      throw new BadRequestException('System roles cannot be deleted.');
    }
    if (role._count.users > 0) {
      throw new BadRequestException(`Cannot delete role with ${role._count.users} active assigned users.`);
    }

    await this.prisma.role.delete({ where: { id } });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.DELETE,
      entity: 'ROLE',
      entityId: id,
      details: `Deleted role ${role.name}`,
      severity: AuditSeverity.CRITICAL,
    });

    return { success: true, message: `Role ${role.name} deleted successfully.` };
  }

  /**
   * Create a new granular permission in catalog
   */
  async createPermission(dto: CreatePermissionDto, adminUserId?: string) {
    const permission = await this.prisma.permission.create({
      data: {
        action: dto.action.toUpperCase(),
        resource: dto.resource.toUpperCase(),
        description: dto.description,
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.CREATE,
      entity: 'PERMISSION',
      entityId: permission.id,
      details: `Registered new system permission: ${permission.action}:${permission.resource}`,
      changes: { permission },
      severity: AuditSeverity.INFO,
    });

    return permission;
  }

  /**
   * Dynamically assign permissions to a role
   */
  async assignPermissions(dto: AssignPermissionsDto, adminUserId?: string) {
    const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Role not found.');

    const operations = dto.permissionIds.map((pId) =>
      this.prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: dto.roleId, permissionId: pId },
        },
        create: {
          roleId: dto.roleId,
          permissionId: pId,
          grantedBy: adminUserId,
        },
        update: {},
      }),
    );

    await this.prisma.$transaction(operations);

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.PERMISSION_GRANT,
      entity: 'ROLE_PERMISSION',
      entityId: dto.roleId,
      details: `Granted ${dto.permissionIds.length} permissions to role: ${role.name}`,
      changes: { permissionIds: dto.permissionIds },
      severity: AuditSeverity.WARNING,
    });

    return this.prisma.role.findUnique({
      where: { id: dto.roleId },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  /**
   * Dynamically revoke permissions from a role
   */
  async revokePermissions(dto: RevokePermissionsDto, adminUserId?: string) {
    const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Role not found.');

    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId: dto.roleId,
        permissionId: { in: dto.permissionIds },
      },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.PERMISSION_REVOKE,
      entity: 'ROLE_PERMISSION',
      entityId: dto.roleId,
      details: `Revoked ${dto.permissionIds.length} permissions from role: ${role.name}`,
      changes: { revokedPermissionIds: dto.permissionIds },
      severity: AuditSeverity.WARNING,
    });

    return this.prisma.role.findUnique({
      where: { id: dto.roleId },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  /**
   * Reassign a user's role
   */
  async assignUserRole(dto: AssignUserRoleDto, adminUserId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId }, include: { role: true } });
    if (!user) throw new NotFoundException('User not found.');

    const newRole = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
    if (!newRole) throw new NotFoundException('Target role not found.');

    const updatedUser = await this.prisma.user.update({
      where: { id: dto.userId },
      data: { roleId: dto.roleId },
      include: { role: true },
    });

    await this.auditLogService.log({
      userId: adminUserId,
      action: AuditAction.UPDATE,
      entity: 'USER_ROLE',
      entityId: user.id,
      details: `Changed role for user ${user.email} from ${user.role.name} to ${newRole.name}`,
      changes: { oldRoleId: user.roleId, newRoleId: newRole.id },
      severity: AuditSeverity.WARNING,
    });

    return updatedUser;
  }
}

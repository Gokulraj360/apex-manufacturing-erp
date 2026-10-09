import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CreateUserAccountDto,
  UpdateUserAccountDto,
  ResetPasswordDto,
  RevokeAccessDto,
  AssignPermissionDto,
} from '../dto/user-access.dto';
import { AuditAction, AuditSeverity } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserAccessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all user accounts with roles and security telemetry
   */
  async getUserAccounts(search?: string, roleId?: string) {
    const where: any = {};
    if (roleId) where.roleId = roleId;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      include: {
        role: true,
        userAccount: true,
        employeeProfile: {
          select: { employeeCode: true, department: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single user account security dossier
   */
  async getUserAccountById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
        userAccount: true,
        employeeProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Create new user and provision security account
   */
  async createUserAccount(dto: CreateUserAccountDto, adminUserId?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException(`User with email ${dto.email} already exists`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleId: dto.roleId,
        passwordHash,
        isActive: true,
        userAccount: {
          create: {
            mfaEnabled: dto.mfaEnabled ?? false,
            allowedIpRanges: dto.allowedIpRanges,
            sessionTimeoutMinutes: dto.sessionTimeoutMinutes || 60,
          },
        },
      },
      include: {
        role: true,
        userAccount: true,
      },
    });

    await this.auditLogService.logAction({
      userId: adminUserId || null,
      action: AuditAction.CREATE,
      entity: 'UserAccount',
      entityId: user.id,
      details: `Created user account for ${user.email} with role ${user.role.name}`,
      severity: AuditSeverity.INFO,
    });

    return user;
  }

  /**
   * Update user details and access parameters
   */
  async updateUserAccount(id: string, dto: UpdateUserAccountDto, adminUserId?: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleId: dto.roleId,
        isActive: dto.isActive,
        userAccount: {
          upsert: {
            create: {
              mfaEnabled: dto.mfaEnabled ?? false,
              allowedIpRanges: dto.allowedIpRanges,
              sessionTimeoutMinutes: dto.sessionTimeoutMinutes || 60,
            },
            update: {
              mfaEnabled: dto.mfaEnabled,
              allowedIpRanges: dto.allowedIpRanges,
              sessionTimeoutMinutes: dto.sessionTimeoutMinutes,
            },
          },
        },
      },
      include: {
        role: true,
        userAccount: true,
      },
    });

    await this.auditLogService.logAction({
      userId: adminUserId || null,
      action: AuditAction.UPDATE,
      entity: 'UserAccount',
      entityId: id,
      details: `Updated security parameters for user ${updated.email}`,
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Reset user password
   */
  async resetPassword(dto: ResetPasswordDto, adminUserId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`User ${dto.userId} not found`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        passwordHash,
        userAccount: {
          upsert: {
            create: {
              forcePasswordChange: dto.forceChangeOnNextLogin ?? true,
              passwordLastChangedAt: new Date(),
              failedLoginAttempts: 0,
              isLocked: false,
            },
            update: {
              forcePasswordChange: dto.forceChangeOnNextLogin ?? true,
              passwordLastChangedAt: new Date(),
              failedLoginAttempts: 0,
              isLocked: false,
              lockedUntil: null,
            },
          },
        },
      },
    });

    await this.auditLogService.logAction({
      userId: adminUserId || null,
      action: AuditAction.UPDATE,
      entity: 'UserAccount',
      entityId: dto.userId,
      details: `Administrative password reset executed for ${user.email}`,
      severity: AuditSeverity.WARNING,
    });

    return { success: true, message: `Password reset successfully for ${user.email}` };
  }

  /**
   * Revoke access immediately (Lock account and disable active flag)
   */
  async revokeAccess(dto: RevokeAccessDto, adminUserId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`User ${dto.userId} not found`);
    }

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        isActive: false,
        userAccount: {
          upsert: {
            create: {
              isLocked: true,
              lockedUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            },
            update: {
              isLocked: true,
              lockedUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    await this.auditLogService.logAction({
      userId: adminUserId || null,
      action: AuditAction.USER_ACCESS_REVOKED,
      entity: 'UserAccount',
      entityId: dto.userId,
      details: `Immediate access revocation for ${user.email}. Reason: ${dto.reason}`,
      severity: AuditSeverity.CRITICAL,
    });

    return { success: true, message: `Access revoked for user ${user.email}` };
  }

  /**
   * Assign or update granular system permissions in SystemRolePermission matrix
   */
  async assignSystemPermission(dto: AssignPermissionDto, adminUserId?: string) {
    const perm = await this.prisma.systemRolePermission.upsert({
      where: {
        roleName_resource_action: {
          roleName: dto.roleName,
          resource: dto.resource,
          action: dto.action,
        },
      },
      create: {
        roleName: dto.roleName,
        resource: dto.resource,
        action: dto.action,
        isAllowed: dto.isAllowed,
        scope: dto.scope || 'ALL',
        grantedBy: adminUserId || 'SYSTEM_ADMIN',
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
      update: {
        isAllowed: dto.isAllowed,
        scope: dto.scope || 'ALL',
        grantedBy: adminUserId || 'SYSTEM_ADMIN',
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    return perm;
  }

  /**
   * List system permission matrix
   */
  async getSystemPermissions(roleName?: string) {
    const where: any = {};
    if (roleName) where.roleName = roleName;

    return this.prisma.systemRolePermission.findMany({
      where,
      orderBy: [{ roleName: 'asc' }, { resource: 'asc' }],
    });
  }
}

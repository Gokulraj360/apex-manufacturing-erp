import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ALL_ERP_FUNCTIONS,
  ERP_FUNCTION_CATEGORIES,
  DEFAULT_ROLE_PERMISSIONS,
  ErpFunctionDefinition,
} from './constants/erp-functions.constant';
import {
  UpdateRolePermissionDto,
  CheckFunctionAccessDto,
  BulkSyncPermissionsDto,
} from './dto/admin-rbac.dto';

export interface EnrichedFunctionPermission {
  key: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isAllowed: boolean;
  configuredBy?: string;
  updatedAt?: string;
  notes?: string;
}

export interface RolePermissionsResponse {
  roleName: string;
  isCustomized: boolean;
  totalFunctions: number;
  allowedCount: number;
  restrictedCount: number;
  lastUpdated?: string;
  configuredBy?: string;
  permissions: EnrichedFunctionPermission[];
}

@Injectable()
export class AdminRbacService {
  private readonly logger = new Logger(AdminRbacService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper to normalize role names
   */
  private normalizeRole(roleName: string): string {
    if (!roleName) return 'super_admin';
    return roleName.toLowerCase().trim();
  }

  /**
   * Returns complete catalog of ERP operational functions & modules
   */
  getFunctionsCatalog() {
    return {
      categories: ERP_FUNCTION_CATEGORIES,
      totalFunctions: ALL_ERP_FUNCTIONS.length,
      functions: ALL_ERP_FUNCTIONS,
    };
  }

  /**
   * Get dynamic function permissions for a specific role
   */
  async getRolePermissions(rawRoleName: string): Promise<RolePermissionsResponse> {
    const roleName = this.normalizeRole(rawRoleName);

    // Fetch any saved overrides in database
    let customDbRecords: any[] = [];
    try {
      customDbRecords = await (this.prisma as any).roleFunctionPermission.findMany({
        where: { roleName },
      });
    } catch (err) {
      this.logger.warn(`Could not query roleFunctionPermission: ${err.message}. Using defaults.`);
    }

    const customMap = new Map<string, { isAllowed: boolean; configuredBy?: string; updatedAt?: Date; notes?: string }>();
    customDbRecords.forEach((rec) => {
      customMap.set(rec.functionKey, {
        isAllowed: rec.isAllowed,
        configuredBy: rec.configuredBy,
        updatedAt: rec.updatedAt,
        notes: rec.notes,
      });
    });

    const isCustomized = customDbRecords.length > 0;
    const defaultAllowedKeys = new Set(DEFAULT_ROLE_PERMISSIONS[roleName] || []);

    let latestUpdated: string | undefined;
    let primaryConfiguredBy: string | undefined;

    const permissions: EnrichedFunctionPermission[] = ALL_ERP_FUNCTIONS.map((fn) => {
      const custom = customMap.get(fn.key);

      let isAllowed: boolean;
      let configuredBy = 'System Default';
      let updatedAt: string | undefined;
      let notes: string | undefined;

      if (custom !== undefined) {
        isAllowed = custom.isAllowed;
        configuredBy = custom.configuredBy || 'Super Admin';
        updatedAt = custom.updatedAt ? custom.updatedAt.toISOString() : undefined;
        notes = custom.notes;

        if (!latestUpdated || (updatedAt && updatedAt > latestUpdated)) {
          latestUpdated = updatedAt;
          primaryConfiguredBy = configuredBy;
        }
      } else {
        isAllowed = defaultAllowedKeys.has(fn.key);
      }

      return {
        key: fn.key,
        name: fn.name,
        category: fn.category,
        categoryLabel: fn.categoryLabel,
        description: fn.description,
        riskLevel: fn.riskLevel,
        isAllowed,
        configuredBy,
        updatedAt,
        notes,
      };
    });

    const allowedCount = permissions.filter((p) => p.isAllowed).length;

    return {
      roleName,
      isCustomized,
      totalFunctions: permissions.length,
      allowedCount,
      restrictedCount: permissions.length - allowedCount,
      lastUpdated: latestUpdated || new Date().toISOString(),
      configuredBy: primaryConfiguredBy || (isCustomized ? 'Super Admin' : 'System Baseline'),
      permissions,
    };
  }

  /**
   * Summarizes all 21 manufacturing roles and their dynamic permission status
   */
  async getAllRolesSummary() {
    const roleKeys = Object.keys(DEFAULT_ROLE_PERMISSIONS);

    const summaries = await Promise.all(
      roleKeys.map(async (role) => {
        const perms = await this.getRolePermissions(role);
        return {
          roleName: role,
          isCustomized: perms.isCustomized,
          allowedCount: perms.allowedCount,
          restrictedCount: perms.restrictedCount,
          totalCount: perms.totalFunctions,
          configuredBy: perms.configuredBy,
          lastUpdated: perms.lastUpdated,
        };
      }),
    );

    return {
      totalRoles: summaries.length,
      summaries,
    };
  }

  /**
   * Save and sync customized function permissions for a role
   */
  async updateRolePermissions(dto: UpdateRolePermissionDto): Promise<RolePermissionsResponse> {
    const roleName = this.normalizeRole(dto.roleName);
    const configuredBy = dto.configuredBy || 'Super Admin';
    const funcMap = new Map(ALL_ERP_FUNCTIONS.map((f) => [f.key, f]));

    this.logger.log(
      `Super Admin updating dynamic permissions for role "${roleName}": ${dto.permissions.length} toggles by "${configuredBy}".`,
    );

    // Persist to database
    for (const toggle of dto.permissions) {
      const def = funcMap.get(toggle.functionKey);
      const category = def ? def.category : 'GENERAL';
      const functionName = def ? def.name : toggle.functionKey;

      try {
        await (this.prisma as any).roleFunctionPermission.upsert({
          where: {
            roleName_functionKey: {
              roleName,
              functionKey: toggle.functionKey,
            },
          },
          update: {
            isAllowed: toggle.isAllowed,
            configuredBy,
            notes: toggle.notes || dto.notes,
            category,
            functionName,
            updatedAt: new Date(),
          },
          create: {
            roleName,
            functionKey: toggle.functionKey,
            category,
            functionName,
            isAllowed: toggle.isAllowed,
            configuredBy,
            notes: toggle.notes || dto.notes,
          },
        });
      } catch (err) {
        this.logger.error(`Failed to upsert RoleFunctionPermission for ${roleName}:${toggle.functionKey}: ${err.message}`);
      }
    }

    return this.getRolePermissions(roleName);
  }

  /**
   * Reset a role's dynamic permissions back to system baseline defaults
   */
  async resetRoleToDefaults(rawRoleName: string, configuredBy: string = 'Super Admin'): Promise<RolePermissionsResponse> {
    const roleName = this.normalizeRole(rawRoleName);

    try {
      await (this.prisma as any).roleFunctionPermission.deleteMany({
        where: { roleName },
      });
      this.logger.log(`Role "${roleName}" permissions reset to factory defaults by ${configuredBy}.`);
    } catch (err) {
      this.logger.warn(`Could not delete custom permissions for ${roleName}: ${err.message}`);
    }

    return this.getRolePermissions(roleName);
  }

  /**
   * Real-time Guard Check: Verifies whether an operational function is allowed for a given role
   */
  async checkFunctionAccess(dto: CheckFunctionAccessDto): Promise<{ isAllowed: boolean; roleName: string; functionKey: string; reason?: string }> {
    const roleName = this.normalizeRole(dto.roleName);
    const functionKey = dto.functionKey;

    // Super Admin is granted overarching executive clearance
    if (roleName === 'super_admin') {
      return {
        isAllowed: true,
        roleName,
        functionKey,
        reason: 'Super Admin master bypass active',
      };
    }

    // 1. Check custom database entry
    try {
      const custom = await (this.prisma as any).roleFunctionPermission.findUnique({
        where: {
          roleName_functionKey: {
            roleName,
            functionKey,
          },
        },
      });

      if (custom) {
        return {
          isAllowed: custom.isAllowed,
          roleName,
          functionKey,
          reason: custom.isAllowed
            ? 'Allowed by Super Admin custom configuration'
            : 'Explicitly restricted by Super Admin governance policy',
        };
      }
    } catch (err) {
      // Fallback to default
    }

    // 2. Fallback to system baseline
    const defaults = DEFAULT_ROLE_PERMISSIONS[roleName] || [];
    const isAllowedByDefault = defaults.includes(functionKey);

    return {
      isAllowed: isAllowedByDefault,
      roleName,
      functionKey,
      reason: isAllowedByDefault
        ? 'Allowed by system baseline role definition'
        : 'Restricted by system baseline role policy',
    };
  }

  /**
   * Bulk update across multiple roles
   */
  async bulkSyncPermissions(dto: BulkSyncPermissionsDto) {
    const results = [];
    for (const roleSync of dto.roles) {
      const updated = await this.updateRolePermissions({
        roleName: roleSync.roleName,
        permissions: roleSync.permissions,
        configuredBy: dto.configuredBy,
      });
      results.push(updated);
    }
    return {
      syncedRolesCount: results.length,
      results,
    };
  }
}

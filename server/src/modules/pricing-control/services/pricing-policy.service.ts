import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  CheckPricePermissionDto,
  CreatePricingPolicyDto,
  CreatePriceOverrideRequestDto,
  ReviewOverrideRequestDto,
  LogPriceModificationDto,
  QueryPriceAuditsDto,
} from '../dto/pricing-policy.dto';
import {
  PriceType,
  PriceOverrideStatus,
  PriceFieldTarget,
  AuditAction,
  AuditSeverity,
} from '@prisma/client';

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

@Injectable()
export class PricingPolicyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * System-defined Role Access Matrix for Pricing & Cost
   */
  private readonly DEFAULT_MATRIX: Record<
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
    // Owner / Executive Leadership
    SUPER_ADMIN: {
      costPrice: { canView: true, canEdit: true },
      sellingPrice: { canView: true, canEdit: true },
    },
    OWNER: {
      costPrice: { canView: true, canEdit: true },
      sellingPrice: { canView: true, canEdit: true },
    },

    // Procurement & SCM
    PROCUREMENT_OFFICER: {
      costPrice: { canView: true, canEdit: true },
      sellingPrice: { canView: false, canEdit: false },
    },
    PROCUREMENT_MANAGER: {
      costPrice: { canView: true, canEdit: true },
      sellingPrice: { canView: false, canEdit: false },
    },
    SUPPLY_CHAIN_MANAGER: {
      costPrice: { canView: true, canEdit: true },
      sellingPrice: { canView: false, canEdit: false },
    },

    // Finance & Accounts
    FINANCE_MANAGER: {
      costPrice: { canView: true, canEdit: true },
      sellingPrice: { canView: true, canEdit: true },
    },
    ACCOUNTS_EXECUTIVE: {
      costPrice: { canView: true, canEdit: true },
      sellingPrice: { canView: true, canEdit: true },
    },
    CFO: {
      costPrice: { canView: true, canEdit: true },
      sellingPrice: { canView: true, canEdit: true },
    },

    // Design & Engineering
    DESIGN_ENGINEER: {
      costPrice: { canView: true, canEdit: false },
      sellingPrice: { canView: false, canEdit: false },
    },
    R_AND_D_LEAD: {
      costPrice: { canView: true, canEdit: false },
      sellingPrice: { canView: false, canEdit: false },
    },

    // Production & Shop Floor
    PRODUCTION_MANAGER: {
      costPrice: { canView: true, canEdit: false },
      sellingPrice: { canView: false, canEdit: false },
    },
    LINE_SUPERVISOR: {
      costPrice: { canView: true, canEdit: false },
      sellingPrice: { canView: false, canEdit: false },
    },
    PLANT_OPERATOR: {
      costPrice: { canView: true, canEdit: false },
      sellingPrice: { canView: false, canEdit: false },
    },

    // Warehouse & Logistics
    WAREHOUSE_MANAGER: {
      costPrice: { canView: true, canEdit: false },
      sellingPrice: { canView: true, canEdit: false },
    },
    INVENTORY_CLERK: {
      costPrice: { canView: true, canEdit: false },
      sellingPrice: { canView: false, canEdit: false },
    },
    DISPATCH_EXECUTIVE: {
      costPrice: { canView: false, canEdit: false },
      sellingPrice: { canView: true, canEdit: false },
    },

    // CRM & Sales
    CRM_SALES_REP: {
      costPrice: { canView: false, canEdit: false },
      sellingPrice: { canView: true, canEdit: true, maxDiscountPct: 10, minMarginPct: 15 },
    },
    SALES_MANAGER: {
      costPrice: { canView: false, canEdit: false },
      sellingPrice: { canView: true, canEdit: true, maxDiscountPct: 20, minMarginPct: 12 },
    },

    // Marketing
    MARKETING_MANAGER: {
      costPrice: { canView: false, canEdit: false },
      sellingPrice: { canView: true, canEdit: false },
    },
    GROWTH_LEAD: {
      costPrice: { canView: false, canEdit: false },
      sellingPrice: { canView: true, canEdit: false },
    },

    // Default / Floor Workers
    SHOP_FLOOR_WORKER: {
      costPrice: { canView: false, canEdit: false },
      sellingPrice: { canView: false, canEdit: false },
    },
  };

  /**
   * Normalize user role name
   */
  private normalizeRole(role?: string): string {
    if (!role) return 'SHOP_FLOOR_WORKER';
    const clean = role.toUpperCase().replace(/\s+/g, '_');
    return clean;
  }

  /**
   * Get permissions for a specific role
   */
  getRolePricingPermissions(role: string): RolePriceAccess {
    const normalized = this.normalizeRole(role);
    const config = this.DEFAULT_MATRIX[normalized] || {
      costPrice: { canView: false, canEdit: false },
      sellingPrice: { canView: false, canEdit: false },
    };

    return {
      role: normalized,
      costPrice: config.costPrice,
      sellingPrice: config.sellingPrice,
    };
  }

  /**
   * Get the entire matrix across all recognized roles
   */
  getFullPermissionMatrix(): RolePriceAccess[] {
    return Object.keys(this.DEFAULT_MATRIX).map((role) =>
      this.getRolePricingPermissions(role),
    );
  }

  /**
   * Validate if a user role can perform an action on a price type
   */
  checkPermission(dto: CheckPricePermissionDto): {
    allowed: boolean;
    reason: string;
    canView: boolean;
    canEdit: boolean;
    requiresOverride: boolean;
    maxDiscountPct?: number;
    minMarginPct?: number;
  } {
    const perms = this.getRolePricingPermissions(dto.roleName);
    const isCostPrice = dto.priceType === PriceType.RAW_MATERIAL_COST;
    const targetConfig = isCostPrice ? perms.costPrice : perms.sellingPrice;

    if (dto.action === 'VIEW') {
      if (!targetConfig.canView) {
        return {
          allowed: false,
          reason: `Role '${perms.role}' is restricted from viewing ${dto.priceType}.`,
          canView: false,
          canEdit: targetConfig.canEdit,
          requiresOverride: false,
        };
      }
      return {
        allowed: true,
        reason: `Role '${perms.role}' has view authorization for ${dto.priceType}.`,
        canView: true,
        canEdit: targetConfig.canEdit,
        requiresOverride: false,
      };
    }

    if (dto.action === 'EDIT') {
      if (!targetConfig.canEdit) {
        return {
          allowed: false,
          reason: `Role '${perms.role}' does not possess edit rights for ${dto.priceType}. Requires Super Admin / Finance sign-off.`,
          canView: targetConfig.canView,
          canEdit: false,
          requiresOverride: true,
        };
      }

      // Check discount limits for sales roles if proposing selling price
      if (!isCostPrice && dto.proposedPrice != null && dto.currentPrice != null && dto.currentPrice > 0) {
        const discountPct = ((dto.currentPrice - dto.proposedPrice) / dto.currentPrice) * 100;
        const maxDiscount = perms.sellingPrice.maxDiscountPct;

        if (maxDiscount != null && discountPct > maxDiscount) {
          return {
            allowed: false,
            reason: `Proposed discount of ${discountPct.toFixed(1)}% exceeds role limit of ${maxDiscount}%. Supervisor override required.`,
            canView: targetConfig.canView,
            canEdit: true,
            requiresOverride: true,
            maxDiscountPct: maxDiscount,
            minMarginPct: perms.sellingPrice.minMarginPct,
          };
        }
      }

      return {
        allowed: true,
        reason: `Role '${perms.role}' possesses validated edit rights for ${dto.priceType}.`,
        canView: targetConfig.canView,
        canEdit: true,
        requiresOverride: false,
        maxDiscountPct: perms.sellingPrice.maxDiscountPct,
        minMarginPct: perms.sellingPrice.minMarginPct,
      };
    }

    return {
      allowed: false,
      reason: 'Unknown action specified.',
      canView: false,
      canEdit: false,
      requiresOverride: false,
    };
  }

  /**
   * Intercept and validate field updates in controller payloads
   */
  validatePayloadEdits(body: any, role: string) {
    if (!body || typeof body !== 'object') return;

    const perms = this.getRolePricingPermissions(role);

    // Cost price field names
    const costPriceFields = [
      'costPrice',
      'basePrice',
      'rawMaterialCost',
      'unitCost',
      'laborCost',
      'processingRate',
    ];

    // Selling price field names
    const sellingPriceFields = [
      'sellingPrice',
      'unitPrice',
      'quotedPrice',
      'salesRate',
      'lineTotal',
      'totalAmount',
    ];

    for (const field of costPriceFields) {
      if (body[field] !== undefined && !perms.costPrice.canEdit) {
        throw new ForbiddenException(
          `Security Violation: Role '${perms.role}' is not authorized to edit Raw Material Cost Price field '${field}'.`,
        );
      }
    }

    for (const field of sellingPriceFields) {
      if (body[field] !== undefined && !perms.sellingPrice.canEdit) {
        throw new ForbiddenException(
          `Security Violation: Role '${perms.role}' is not authorized to edit Product Selling Price field '${field}'.`,
        );
      }
    }
  }

  /**
   * Field-level data masking & sanitization utility
   */
  sanitizeEntity(data: any, role: string): any {
    if (!data) return data;
    const perms = this.getRolePricingPermissions(role);

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeEntity(item, role));
    }

    if (typeof data !== 'object') return data;

    const cloned = { ...data };

    // If role cannot view Cost Price, mask/redact cost price fields
    if (!perms.costPrice.canView) {
      if ('basePrice' in cloned) cloned.basePrice = '*** CONFIDENTIAL ***';
      if ('costPrice' in cloned) cloned.costPrice = '*** CONFIDENTIAL ***';
      if ('rawMaterialCost' in cloned) cloned.rawMaterialCost = '*** CONFIDENTIAL ***';
      if ('manufacturingCostBasis' in cloned) {
        cloned.manufacturingCostBasis = '[CONFIDENTIAL COST DATA REDACTED]';
      }
    }

    // If role cannot view Selling Price, mask/redact selling price fields
    if (!perms.sellingPrice.canView) {
      if ('unitPrice' in cloned) cloned.unitPrice = '*** CONFIDENTIAL ***';
      if ('sellingPrice' in cloned) cloned.sellingPrice = '*** CONFIDENTIAL ***';
      if ('totalAmount' in cloned) cloned.totalAmount = '*** CONFIDENTIAL ***';
      if ('subtotal' in cloned) cloned.subtotal = '*** CONFIDENTIAL ***';
    }

    return cloned;
  }

  /**
   * Submit a Price Override Request
   */
  async createOverrideRequest(dto: CreatePriceOverrideRequestDto) {
    const count = await this.prisma.priceOverrideRequest.count();
    const requestNumber = `OVR-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const deltaPct =
      dto.currentPrice > 0
        ? Number((((dto.requestedPrice - dto.currentPrice) / dto.currentPrice) * 100).toFixed(2))
        : 0;

    const created = await this.prisma.priceOverrideRequest.create({
      data: {
        requestNumber,
        targetEntity: dto.targetEntity,
        entityId: dto.entityId,
        itemSku: dto.itemSku,
        itemName: dto.itemName || null,
        priceType: dto.priceType,
        currentPrice: dto.currentPrice,
        requestedPrice: dto.requestedPrice,
        deltaPercentage: deltaPct,
        justification: dto.justification,
        requestedBy: dto.requestedBy,
        requesterRole: dto.requesterRole,
        status: PriceOverrideStatus.PENDING,
      },
    });

    await this.auditLogService.logAction({
      action: AuditAction.PRICE_OVERRIDE_REQUESTED,
      severity: AuditSeverity.WARNING,
      entityType: 'PriceOverrideRequest',
      entityId: created.id,
      description: `Price override [${requestNumber}] requested by ${dto.requestedBy} (${dto.requesterRole}) for ${dto.itemSku}: ₹${dto.currentPrice} -> ₹${dto.requestedPrice} (${deltaPct}%)`,
      userId: dto.requestedBy,
    });

    return created;
  }

  /**
   * Review (Approve or Reject) Price Override Request
   */
  async reviewOverrideRequest(id: string, dto: ReviewOverrideRequestDto) {
    const existing = await this.prisma.priceOverrideRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Price override request with ID '${id}' not found`);
    }

    const updated = await this.prisma.priceOverrideRequest.update({
      where: { id },
      data: {
        status: dto.status,
        reviewedBy: dto.reviewedBy,
        reviewedAt: new Date(),
        reviewRemarks: dto.reviewRemarks || null,
      },
    });

    const isApproved = dto.status === PriceOverrideStatus.APPROVED;

    // Log the approval/rejection audit trail
    await this.auditLogService.logAction({
      action: isApproved
        ? AuditAction.PRICE_OVERRIDE_APPROVED
        : AuditAction.PRICE_OVERRIDE_REJECTED,
      severity: isApproved ? AuditSeverity.CRITICAL : AuditSeverity.MEDIUM,
      entityType: 'PriceOverrideRequest',
      entityId: updated.id,
      description: `Price override [${updated.requestNumber}] was ${dto.status} by ${dto.reviewedBy}. SKU: ${updated.itemSku}, Requested Price: ₹${updated.requestedPrice}`,
      userId: dto.reviewedBy,
    });

    // If approved, create a formal PriceAuditRecord
    if (isApproved) {
      await this.logPriceModification({
        targetEntity: updated.targetEntity,
        entityId: updated.entityId,
        itemSku: updated.itemSku,
        priceType: updated.priceType,
        oldPrice: Number(updated.currentPrice),
        newPrice: Number(updated.requestedPrice),
        currency: 'USD',
        modifiedBy: updated.requestedBy,
        userRole: updated.requesterRole,
        justification: `Approved via Override [${updated.requestNumber}]: ${dto.reviewRemarks || updated.justification}`,
        isOverrideApproved: true,
        overrideRequestId: updated.id,
        approvedBy: dto.reviewedBy,
      });
    }

    return updated;
  }

  /**
   * List override requests with optional status filtering
   */
  async getOverrideRequests(status?: PriceOverrideStatus) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.priceOverrideRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Record a Price Audit Entry
   */
  async logPriceModification(dto: LogPriceModificationDto) {
    const count = await this.prisma.priceAuditRecord.count();
    const auditCode = `PAUD-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const created = await this.prisma.priceAuditRecord.create({
      data: {
        auditCode,
        targetEntity: dto.targetEntity,
        entityId: dto.entityId,
        itemSku: dto.itemSku,
        priceType: dto.priceType,
        targetField: dto.targetField || (dto.priceType === PriceType.RAW_MATERIAL_COST ? PriceFieldTarget.MATERIAL_COST : PriceFieldTarget.QUOTATION_SELLING_RATE),
        oldPrice: dto.oldPrice,
        newPrice: dto.newPrice,
        currency: dto.currency || 'USD',
        modifiedBy: dto.modifiedBy,
        userRole: dto.userRole,
        justification: dto.justification,
        isOverrideApproved: dto.isOverrideApproved || false,
        overrideRequestId: dto.overrideRequestId || null,
        approvedBy: dto.approvedBy || null,
      },
    });

    const isCost = dto.priceType === PriceType.RAW_MATERIAL_COST;
    await this.auditLogService.logAction({
      action: isCost
        ? AuditAction.COST_PRICE_MODIFIED
        : AuditAction.SELLING_PRICE_MODIFIED,
      severity: AuditSeverity.WARNING,
      entityType: 'PriceAuditRecord',
      entityId: created.id,
      description: `Rate Modified [${auditCode}] for ${dto.itemSku} (${dto.priceType}): ${dto.oldPrice} -> ${dto.newPrice} by ${dto.modifiedBy} (${dto.userRole})`,
      userId: dto.modifiedBy,
    });

    return created;
  }

  /**
   * Query price modification audit records
   */
  async getPriceAuditHistory(query?: QueryPriceAuditsDto) {
    const where: any = {};

    if (query?.targetEntity) where.targetEntity = query.targetEntity;
    if (query?.itemSku) where.itemSku = query.itemSku;
    if (query?.priceType) where.priceType = query.priceType;
    if (query?.userRole) where.userRole = query.userRole;
    if (query?.search) {
      where.OR = [
        { auditCode: { contains: query.search, mode: 'insensitive' } },
        { itemSku: { contains: query.search, mode: 'insensitive' } },
        { modifiedBy: { contains: query.search, mode: 'insensitive' } },
        { justification: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.priceAuditRecord.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }

  /**
   * Get overall pricing governance telemetry
   */
  async getGovernanceMetrics() {
    const [pendingOverrides, totalAudits, overrideRequests] = await Promise.all([
      this.prisma.priceOverrideRequest.count({
        where: { status: PriceOverrideStatus.PENDING },
      }),
      this.prisma.priceAuditRecord.count(),
      this.prisma.priceOverrideRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const approvedOverrides = await this.prisma.priceOverrideRequest.count({
      where: { status: PriceOverrideStatus.APPROVED },
    });

    const recentAudits = await this.prisma.priceAuditRecord.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' },
    });

    return {
      pendingOverrides,
      approvedOverrides,
      totalAudits,
      recentOverrides: overrideRequests,
      recentAudits,
    };
  }
}

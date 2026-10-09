import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import {
  UpdatePODeliveryScheduleDto,
  ModifyPOItemsDto,
  SendDeliveryReminderDto,
  UpdatePOStatusDto,
} from '../dto/po-tracking.dto';
import {
  AuditAction,
  AuditSeverity,
  ProcurementPOStatus,
} from '@prisma/client';

@Injectable()
export class POTrackingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Delivery schedule board monitoring open orders
   */
  async getDeliveryScheduleBoard() {
    const allOpenPOs = await this.prisma.purchaseOrderProcurement.findMany({
      where: {
        status: {
          in: [
            ProcurementPOStatus.ISSUED,
            ProcurementPOStatus.ACKNOWLEDGED,
            ProcurementPOStatus.IN_TRANSIT,
            ProcurementPOStatus.PARTIALLY_DELIVERED,
          ],
        },
      },
      orderBy: { promisedDeliveryDate: 'asc' },
    });

    const now = new Date();
    const overduePOs = allOpenPOs.filter(
      (po) => new Date(po.promisedDeliveryDate) < now,
    );
    const upcomingThisWeek = allOpenPOs.filter((po) => {
      const d = new Date(po.promisedDeliveryDate);
      const diffDays = (d.getTime() - now.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    });

    return {
      totalOpenCount: allOpenPOs.length,
      overdueCount: overduePOs.length,
      dueThisWeekCount: upcomingThisWeek.length,
      orders: allOpenPOs,
      overdueOrders: overduePOs,
    };
  }

  /**
   * Update delivery schedule with modification audit history
   */
  async updatePODeliverySchedule(id: string, dto: UpdatePODeliveryScheduleDto) {
    const po = await this.prisma.purchaseOrderProcurement.findUnique({
      where: { id },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order ${id} not found`);
    }

    const currentHistory = (po.modificationsHistory as any[]) || [];
    const newEntry = {
      modifiedAt: new Date().toISOString(),
      modifiedBy: dto.modifiedBy,
      type: 'SCHEDULE_CHANGE',
      reason: dto.reasonForAdjustment,
      previousDeliveryDate: po.promisedDeliveryDate,
      newDeliveryDate: dto.newPromisedDeliveryDate,
    };

    const updated = await this.prisma.purchaseOrderProcurement.update({
      where: { id },
      data: {
        promisedDeliveryDate: new Date(dto.newPromisedDeliveryDate),
        modificationsHistory: [...currentHistory, newEntry],
      },
    });

    await this.auditLogService.logAction(
      AuditAction.UPDATE,
      AuditSeverity.INFO,
      `Delivery date for PO ${po.poNumber} adjusted to ${dto.newPromisedDeliveryDate} (${dto.reasonForAdjustment})`,
      dto.modifiedBy,
      'POTrackingService',
      { poId: id, reason: dto.reasonForAdjustment },
    );

    return updated;
  }

  /**
   * Modify PO items and quantities
   */
  async modifyPOItems(id: string, dto: ModifyPOItemsDto) {
    const po = await this.prisma.purchaseOrderProcurement.findUnique({
      where: { id },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order ${id} not found`);
    }

    let subtotal = 0;
    dto.items.forEach((item) => {
      subtotal += Number(item.lineTotal || 0);
    });
    const taxAmount = subtotal * 0.18;
    const totalAmount = subtotal + taxAmount - Number(po.discountAmount || 0);

    const currentHistory = (po.modificationsHistory as any[]) || [];
    const newEntry = {
      modifiedAt: new Date().toISOString(),
      modifiedBy: dto.modifiedBy,
      type: 'ITEMS_MODIFICATION',
      reason: dto.reasonForModification,
      previousItems: po.items,
      previousTotal: po.totalAmount,
    };

    const updated = await this.prisma.purchaseOrderProcurement.update({
      where: { id },
      data: {
        items: dto.items,
        subtotal,
        taxAmount,
        totalAmount,
        modificationsHistory: [...currentHistory, newEntry],
      },
    });

    await this.auditLogService.logAction(
      AuditAction.UPDATE,
      AuditSeverity.INFO,
      `Items modified on PO ${po.poNumber} by ${dto.modifiedBy}. New Total: $${totalAmount}`,
      dto.modifiedBy,
      'POTrackingService',
      { poId: id, totalAmount },
    );

    return updated;
  }

  /**
   * Send automated delivery schedule reminder to vendor
   */
  async sendDeliveryReminder(id: string, dto: SendDeliveryReminderDto) {
    const po = await this.prisma.purchaseOrderProcurement.findUnique({
      where: { id },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order ${id} not found`);
    }

    const updated = await this.prisma.purchaseOrderProcurement.update({
      where: { id },
      data: {
        remindersSentCount: { increment: 1 },
        lastReminderSentAt: new Date(),
      },
    });

    await this.auditLogService.logAction(
      AuditAction.PO_DELIVERY_REMINDER_SENT,
      AuditSeverity.INFO,
      `Delivery reminder #${updated.remindersSentCount} dispatched to vendor ${po.vendorName} (${po.vendorEmail}) for PO ${po.poNumber}`,
      dto.senderName,
      'POTrackingService',
      { poId: id, vendorEmail: po.vendorEmail, reminderCount: updated.remindersSentCount },
    );

    return {
      success: true,
      remindersSentCount: updated.remindersSentCount,
      lastReminderSentAt: updated.lastReminderSentAt,
      poNumber: po.poNumber,
      vendorEmail: po.vendorEmail,
    };
  }

  /**
   * Update PO operational lifecycle status
   */
  async updatePOStatus(id: string, dto: UpdatePOStatusDto) {
    const po = await this.prisma.purchaseOrderProcurement.findUnique({
      where: { id },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order ${id} not found`);
    }

    const updateData: any = {
      status: dto.status as any,
    };

    if (dto.actualDeliveryDate) {
      updateData.actualDeliveryDate = new Date(dto.actualDeliveryDate);
    } else if (dto.status === ProcurementPOStatusEnum.FULFILLED && !po.actualDeliveryDate) {
      updateData.actualDeliveryDate = new Date();
    }

    return this.prisma.purchaseOrderProcurement.update({
      where: { id },
      data: updateData,
    });
  }
}

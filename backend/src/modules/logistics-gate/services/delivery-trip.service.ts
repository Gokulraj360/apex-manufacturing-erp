import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CreateDeliveryTripDto, UpdateDeliveryTripStatusDto } from '../dto/delivery-trip.dto';
import { AuditAction, AuditSeverity, TripStatus } from '@prisma/client';

@Injectable()
export class DeliveryTripService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all delivery trips with optional status filter
   */
  async getTrips(status?: TripStatus) {
    const where = status ? { status } : {};
    return this.prisma.deliveryTrip.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single delivery trip by ID
   */
  async getTripById(id: string) {
    const trip = await this.prisma.deliveryTrip.findUnique({
      where: { id },
    });
    if (!trip) {
      throw new NotFoundException(`Delivery trip ${id} not found`);
    }
    return trip;
  }

  /**
   * Schedule a new outbound transport trip
   */
  async createTrip(dto: CreateDeliveryTripDto, userId?: string) {
    const count = await this.prisma.deliveryTrip.count();
    const tripNumber = `TRIP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const trip = await this.prisma.deliveryTrip.create({
      data: {
        tripNumber,
        carrierName: dto.carrierName,
        vehicleNumber: dto.vehicleNumber,
        driverName: dto.driverName,
        driverContact: dto.driverContact,
        routeOrigin: dto.routeOrigin,
        routeDestination: dto.routeDestination,
        challanReferences: dto.challanReferences as any,
        status: TripStatus.SCHEDULED,
        estimatedArrival: dto.estimatedArrival ? new Date(dto.estimatedArrival) : null,
      },
    });

    return trip;
  }

  /**
   * Update transit progress, GPS waypoint, or confirm delivery (POD)
   */
  async updateTripStatus(id: string, dto: UpdateDeliveryTripStatusDto, userId?: string) {
    const existing = await this.getTripById(id);

    const isDelivered = dto.status === TripStatus.DELIVERED;

    const updated = await this.prisma.deliveryTrip.update({
      where: { id },
      data: {
        status: dto.status,
        gpsCoordinates: dto.gpsCoordinates || existing.gpsCoordinates,
        receiverName: dto.receiverName || existing.receiverName,
        proofOfDeliveryRef: dto.proofOfDeliveryRef || existing.proofOfDeliveryRef,
        deliveryNotes: dto.deliveryNotes ? `${existing.deliveryNotes || ''}\n${dto.deliveryNotes}` : existing.deliveryNotes,
        completedTime: isDelivered ? new Date() : existing.completedTime,
        startTime: dto.status === TripStatus.DISPATCHED ? new Date() : existing.startTime,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.DELIVERY_TRIP_UPDATED,
      entityName: 'DeliveryTrip',
      entityId: updated.id,
      details: {
        tripNumber: updated.tripNumber,
        vehicleNumber: updated.vehicleNumber,
        newStatus: updated.status,
        proofOfDeliveryRef: updated.proofOfDeliveryRef,
      },
      severity: AuditSeverity.INFO,
    });

    return updated;
  }
}

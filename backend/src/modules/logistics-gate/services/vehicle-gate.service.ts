import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../super-admin/services/audit-log.service';
import { CheckInVehicleDto, CheckOutVehicleDto } from '../dto/vehicle-gate.dto';
import { AuditAction, AuditSeverity, GateMovementStatus, VehicleType } from '@prisma/client';

@Injectable()
export class VehicleGateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List all vehicle gate movements
   */
  async getVehicleLogs(status?: GateMovementStatus) {
    const where = status ? { status } : {};
    return this.prisma.vehicleLog.findMany({
      where,
      orderBy: { entryTime: 'desc' },
    });
  }

  /**
   * Get vehicle entry log by ID
   */
  async getVehicleLogById(id: string) {
    const log = await this.prisma.vehicleLog.findUnique({
      where: { id },
    });
    if (!log) {
      throw new NotFoundException(`Vehicle log ${id} not found`);
    }
    return log;
  }

  /**
   * Check in a vehicle/visitor at the security gate
   */
  async checkInVehicle(dto: CheckInVehicleDto, userId?: string) {
    const count = await this.prisma.vehicleLog.count();
    const entryPassNumber = `GATE-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const log = await this.prisma.vehicleLog.create({
      data: {
        entryPassNumber,
        vehicleNumber: dto.vehicleNumber,
        vehicleType: dto.vehicleType as VehicleType,
        driverName: dto.driverName,
        driverPhone: dto.driverPhone,
        driverLicense: dto.driverLicense,
        purpose: dto.purpose,
        destinationBay: dto.destinationBay,
        gateNumber: dto.gateNumber,
        badgeNumber: dto.badgeNumber,
        status: GateMovementStatus.ON_PREMISES,
        entryTime: new Date(),
        securityOfficer: dto.securityOfficer,
        remarks: dto.remarks,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.VEHICLE_GATE_ENTRY,
      entityName: 'VehicleLog',
      entityId: log.id,
      details: {
        entryPassNumber,
        vehicleNumber: dto.vehicleNumber,
        driverName: dto.driverName,
        gateNumber: dto.gateNumber,
        vehicleType: dto.vehicleType,
      },
      severity: AuditSeverity.INFO,
    });

    return log;
  }

  /**
   * Authorize vehicle exit and record gate clearance timestamp
   */
  async checkOutVehicle(id: string, dto: CheckOutVehicleDto, userId?: string) {
    const log = await this.getVehicleLogById(id);

    if (log.status === GateMovementStatus.EXITED) {
      throw new BadRequestException('Vehicle has already departed the premises');
    }

    const updated = await this.prisma.vehicleLog.update({
      where: { id },
      data: {
        status: GateMovementStatus.EXITED,
        exitTime: dto.exitTime ? new Date(dto.exitTime) : new Date(),
        remarks: dto.remarks ? `${log.remarks || ''}\n[Exit]: ${dto.remarks}` : log.remarks,
      },
    });

    await this.auditLogService.logAction({
      userId: userId || 'SYSTEM',
      action: AuditAction.VEHICLE_GATE_EXIT,
      entityName: 'VehicleLog',
      entityId: updated.id,
      details: {
        entryPassNumber: updated.entryPassNumber,
        vehicleNumber: updated.vehicleNumber,
        exitTime: updated.exitTime,
      },
      severity: AuditSeverity.INFO,
    });

    return updated;
  }

  /**
   * Telemetry metrics for perimeter security and traffic flow
   */
  async getPerimeterMetrics() {
    const logs = await this.prisma.vehicleLog.findMany();

    const onPremises = logs.filter((l) => l.status === GateMovementStatus.ON_PREMISES).length;
    const commercialTrucks = logs.filter(
      (l) => l.status === GateMovementStatus.ON_PREMISES && l.vehicleType === VehicleType.DELIVERY_TRUCK,
    ).length;
    const exitedToday = logs.filter((l) => l.status === GateMovementStatus.EXITED).length;

    return {
      totalVehiclesToday: logs.length,
      currentlyOnPremises: onPremises,
      commercialTrucksOnPremises: commercialTrucks,
      exitedToday,
    };
  }
}

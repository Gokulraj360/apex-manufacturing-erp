import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateInwardGatePassDto,
  CaptureOutwardTareDto,
  QueryGatePassDto,
  GatePassStatus,
  GatePassType,
} from './dto/gate-security.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';
import * as crypto from 'crypto';

@Injectable()
export class GateSecurityService {
  constructor(private readonly prisma: PrismaService) {}

  async getLogisticsKPI() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [activeInsideCount, todayInwardCount, completedToday] =
      await Promise.all([
        this.prisma.gatePass.count({
          where: { status: GatePassStatus.INSIDE_PLANT },
        }),
        this.prisma.gatePass.count({
          where: { inwardTime: { gte: todayStart } },
        }),
        this.prisma.gatePass.findMany({
          where: {
            status: GatePassStatus.COMPLETED,
            outwardTime: { gte: todayStart },
          },
          select: {
            grossWeightKg: true,
            tareWeightKg: true,
            netWeightKg: true,
            inwardTime: true,
            outwardTime: true,
          },
        }),
      ]);

    const totalNetWeightKg = completedToday.reduce(
      (sum, p) => sum + Number(p.netWeightKg || 0),
      0,
    );
    const totalCargoTonnageToday = Number((totalNetWeightKg / 1000).toFixed(2));

    let avgTurnaroundMinutes = 48; // default benchmark
    if (completedToday.length > 0) {
      const totalMinutes = completedToday.reduce((sum, p) => {
        if (p.inwardTime && p.outwardTime) {
          const diffMs = p.outwardTime.getTime() - p.inwardTime.getTime();
          return sum + Math.max(0, Math.round(diffMs / 60000));
        }
        return sum;
      }, 0);
      avgTurnaroundMinutes = Math.round(totalMinutes / completedToday.length);
    }

    return {
      activeInsideCount,
      todayInwardCount,
      todayCompletedCount: completedToday.length,
      totalCargoTonnageToday,
      avgTurnaroundMinutes,
    };
  }

  async getActiveInsideTrucks() {
    const passes = await this.prisma.gatePass.findMany({
      where: { status: GatePassStatus.INSIDE_PLANT },
      orderBy: { inwardTime: 'asc' },
      include: {
        purchaseOrder: {
          select: {
            id: true,
            poNumber: true,
            vendor: {
              select: { id: true, name: true, code: true },
            },
            items: {
              select: {
                quantity: true,
                item: { select: { code: true, name: true, uom: true } },
              },
            },
          },
        },
      },
    });

    const now = new Date();
    return passes.map((pass) => {
      const elapsedMs = now.getTime() - pass.inwardTime.getTime();
      const elapsedMinutes = Math.floor(elapsedMs / 60000);
      const hours = Math.floor(elapsedMinutes / 60);
      const mins = elapsedMinutes % 60;
      const durationFormatted =
        hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

      return {
        ...pass,
        elapsedMinutes,
        durationFormatted,
      };
    });
  }

  async findAllPasses(query: QueryGatePassDto) {
    const { skip, limit = 20, page = 1, search, status, passType } = query;

    const where: any = {};
    if (status) where.status = status;
    if (passType) where.passType = passType;

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { passNumber: { contains: term, mode: 'insensitive' } },
        { vehicleNumber: { contains: term, mode: 'insensitive' } },
        { driverName: { contains: term, mode: 'insensitive' } },
        { transporterName: { contains: term, mode: 'insensitive' } },
        { invoiceNumber: { contains: term, mode: 'insensitive' } },
        { ewayBillNumber: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.gatePass.findMany({
        where,
        skip,
        take: limit,
        orderBy: { inwardTime: 'desc' },
        include: {
          purchaseOrder: {
            select: {
              poNumber: true,
              vendor: { select: { name: true, code: true } },
            },
          },
        },
      }),
      this.prisma.gatePass.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOnePass(id: string) {
    const pass = await this.prisma.gatePass.findUnique({
      where: { id },
      include: {
        purchaseOrder: {
          include: {
            vendor: true,
            items: {
              include: { item: true },
            },
          },
        },
      },
    });

    if (!pass) {
      throw new NotFoundException({
        message: `Gate Pass with ID '${id}' not found.`,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return pass;
  }

  async verifyPass(verificationCode: string) {
    const pass = await this.prisma.gatePass.findUnique({
      where: { verificationCode },
      include: {
        purchaseOrder: {
          include: {
            vendor: true,
            items: { include: { item: true } },
          },
        },
      },
    });

    if (!pass) {
      throw new NotFoundException({
        message: 'Invalid or forged verification QR code.',
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      });
    }

    return {
      isValid: true,
      pass,
    };
  }

  async createInwardPass(dto: CreateInwardGatePassDto) {
    const normalizedVehicle = dto.vehicleNumber.trim().toUpperCase();

    // Check if truck is already flagged as inside the plant
    const activeInside = await this.prisma.gatePass.findFirst({
      where: {
        vehicleNumber: normalizedVehicle,
        status: GatePassStatus.INSIDE_PLANT,
      },
    });

    if (activeInside) {
      throw new ConflictException({
        message: `Vehicle '${normalizedVehicle}' is already marked as INSIDE PLANT on Pass '${activeInside.passNumber}'. Capture tare outward first.`,
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    // Generate unique Pass Number: GP-YYYY-XXXX
    let passNumber = dto.passNumber?.trim().toUpperCase();
    if (!passNumber) {
      const year = new Date().getFullYear();
      const count = await this.prisma.gatePass.count();
      passNumber = `GP-${year}-${String(count + 1).padStart(4, '0')}`;
    }

    // Generate verification code
    const verificationCode = crypto
      .randomBytes(16)
      .toString('hex')
      .toUpperCase();

    return this.prisma.gatePass.create({
      data: {
        passNumber,
        passType: dto.passType || GatePassType.INWARD_PURCHASE,
        status: GatePassStatus.INSIDE_PLANT,
        vehicleNumber: normalizedVehicle,
        driverName: dto.driverName.trim(),
        driverPhone: dto.driverPhone?.trim() || null,
        driverLicense: dto.driverLicense?.trim() || null,
        transporterName: dto.transporterName?.trim() || null,
        grossWeightKg: dto.grossWeightKg,
        purchaseOrderId: dto.purchaseOrderId || null,
        invoiceNumber: dto.invoiceNumber?.trim() || null,
        ewayBillNumber: dto.ewayBillNumber?.trim() || null,
        gateNumber: dto.gateNumber?.trim() || 'Gate 1 (North)',
        securityOfficer: dto.securityOfficer?.trim() || 'Officer S. Rathore',
        securityRemarks: dto.securityRemarks?.trim() || null,
        verificationCode,
        inwardTime: new Date(),
      },
      include: {
        purchaseOrder: {
          include: {
            vendor: true,
            items: { include: { item: true } },
          },
        },
      },
    });
  }

  async captureOutwardTare(id: string, dto: CaptureOutwardTareDto) {
    const pass = await this.findOnePass(id);

    if (pass.status !== GatePassStatus.INSIDE_PLANT) {
      throw new BadRequestException({
        message: `Gate Pass '${pass.passNumber}' has already departed or was cancelled.`,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const gross = Number(pass.grossWeightKg);
    const tare = Number(dto.tareWeightKg);

    if (tare > gross) {
      throw new BadRequestException({
        message: `Tare weight (${tare} kg) cannot exceed gross entry weight (${gross} kg). Please recalibrate weighbridge scale.`,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const netWeightKg = Number((gross - tare).toFixed(2));
    const outwardTime = new Date();

    return this.prisma.gatePass.update({
      where: { id },
      data: {
        status: GatePassStatus.COMPLETED,
        tareWeightKg: tare,
        netWeightKg,
        outwardTime,
        securityOfficer: dto.securityOfficer || pass.securityOfficer,
        securityRemarks: dto.securityRemarks
          ? `${pass.securityRemarks || ''} [Outward: ${dto.securityRemarks}]`.trim()
          : pass.securityRemarks,
      },
      include: {
        purchaseOrder: {
          include: {
            vendor: true,
            items: { include: { item: true } },
          },
        },
      },
    });
  }

  simulateCameraOCR() {
    const samplePlates = [
      { plate: 'KA-04-ME-8842', state: 'Karnataka', transporter: 'VRL Logistics Ltd', driver: 'Rameshwar Yadav', gross: 28450, tare: 11200 },
      { plate: 'MH-12-RN-9921', state: 'Maharashtra', transporter: 'Safexpress Multimodal', driver: 'Gurpreet Singh', gross: 31200, tare: 12450 },
      { plate: 'TN-09-CB-4491', state: 'Tamil Nadu', transporter: 'TCI Freight Express', driver: 'M. Selvan', gross: 24800, tare: 10100 },
      { plate: 'DL-01-AX-3419', state: 'Delhi NCR', transporter: 'Blue Dart Surface', driver: 'Dharmendra Sharma', gross: 19500, tare: 8900 },
      { plate: 'GJ-06-BQ-7712', state: 'Gujarat', transporter: 'Gati KWE Logistics', driver: 'Pravin Solanki', gross: 34100, tare: 13500 },
    ];
    const picked = samplePlates[Math.floor(Math.random() * samplePlates.length)];
    const net = picked.gross - picked.tare;

    return {
      detectedVehicleNumber: picked.plate,
      state: picked.state,
      transporter: picked.transporter,
      driverName: picked.driver,
      confidenceScore: 0.994,
      cameraAngle: 'FRONT_AXIS_CAM_01 (Cleanroom Bay 1)',
      ocrTimestamp: new Date().toISOString(),
      recognizedPlateText: picked.plate.replace(/-/g, ' '),
      simulatedGrossWeightKg: picked.gross,
      simulatedTareWeightKg: picked.tare,
      simulatedNetWeightKg: net,
    };
  }

  getYardRegister() {
    return [];
  }
}

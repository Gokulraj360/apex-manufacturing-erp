import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMachineDto } from './dto/machine.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResourceNotFoundException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class MachinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { skip, limit } = pagination;

    const [items, total] = await Promise.all([
      this.prisma.machineStation.findMany({
        skip,
        take: limit,
        orderBy: { code: 'asc' },
      }),
      this.prisma.machineStation.count(),
    ]);

    const page = pagination.page ?? 1;
    const takeLimit = limit ?? 20;

    return {
      items,
      pagination: {
        page,
        limit: takeLimit,
        totalItems: total,
        totalPages: Math.ceil(total / takeLimit),
        hasNextPage: page * takeLimit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const machine = await this.prisma.machineStation.findUnique({
      where: { id },
      include: {
        operations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            workOrder: { select: { orderNumber: true, status: true } },
          },
        },
      },
    });

    if (!machine) {
      throw new ResourceNotFoundException('MachineStation', id);
    }

    return machine;
  }

  async create(dto: CreateMachineDto) {
    const existing = await this.prisma.machineStation.findUnique({
      where: { code: dto.code.toUpperCase() },
    });

    if (existing) {
      throw new ConflictException({
        message: `Machine with code '${dto.code}' already exists.`,
        errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      });
    }

    return this.prisma.machineStation.create({
      data: {
        code: dto.code.toUpperCase(),
        name: dto.name,
        department: dto.department,
        status: dto.status,
        location: dto.location,
        capacityPerHour: dto.capacityPerHour,
        hourlyRate: dto.hourlyRate,
      },
    });
  }
}

import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResourceNotFoundException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

export interface StaffRecord {
  id: string;
  empId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  passwordRaw: string; // for credential management viewer
  role: string;
  salary: number; // monthly CTC in ₹
  isActive: boolean;
  joinedDate: string;
  isOwnerProtected?: boolean;
}

@Injectable()
export class UsersService {
  // In-memory staff master registry covering all 13 specialized manufacturing roles
  private staffRegistry: StaffRecord[] = [
    {
      id: 'usr-root',
      empId: 'EMP-001',
      firstName: 'Plant Owner',
      lastName: 'MD',
      name: 'Plant Owner / MD',
      email: 'owner@apexmobile.com',
      passwordRaw: 'owner123',
      role: 'TOP_MANAGEMENT',
      salary: 500000.0,
      isActive: true,
      joinedDate: '2026-10-01',
      isOwnerProtected: true,
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getStaffRegistry(): Promise<StaffRecord[]> {
    return this.staffRegistry;
  }

  async onboardStaff(dto: CreateUserDto): Promise<StaffRecord> {
    const existing = this.staffRegistry.find(
      (s) => s.email.toLowerCase() === dto.email.toLowerCase()
    );
    if (existing) {
      throw new ConflictException('A staff member with this email already exists.');
    }

    const nextIdNum = this.staffRegistry.length + 1;
    const empId = `EMP-${nextIdNum.toString().padStart(3, '0')}`;
    const newStaff: StaffRecord = {
      id: `usr-${Date.now()}`,
      empId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      name: `${dto.firstName} ${dto.lastName}`.trim(),
      email: dto.email.toLowerCase(),
      passwordRaw: dto.password,
      role: (dto.role as string) || 'PRODUCTION_MANAGER',
      salary: dto.salary ? Number(dto.salary) : 120000.0,
      isActive: true,
      joinedDate: new Date().toISOString().split('T')[0],
      isOwnerProtected: false,
    };

    this.staffRegistry.unshift(newStaff);

    try {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      await (this.prisma as any).user.create({
        data: {
          email: dto.email.toLowerCase(),
          password: passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: dto.role as any,
          salary: dto.salary,
          isActive: true,
        },
      });
    } catch {
      // In-memory fallback
    }

    return newStaff;
  }

  async terminateStaff(id: string) {
    const target = this.staffRegistry.find((s) => s.id === id || s.empId === id);
    if (!target) {
      throw new NotFoundException(`Staff member with ID '${id}' not found.`);
    }

    // Owner Root Account Protection
    if (target.isOwnerProtected || target.role === 'TOP_MANAGEMENT' || target.email === 'owner@apex-mfg.com') {
      throw new BadRequestException('Root Owner account is protected from revocation and cannot be terminated.');
    }

    target.isActive = false;
    this.staffRegistry = this.staffRegistry.filter((s) => s.id !== target.id);

    try {
      await (this.prisma as any).user.update({
        where: { id: target.id },
        data: { isActive: false },
      });
    } catch {
      // In-memory fallback
    }

    return {
      message: `Staff member ${target.name} (${target.empId}) credentials permanently revoked and employment terminated.`,
      terminatedEmpId: target.empId,
      name: target.name,
    };
  }

  async updateSalary(id: string, salary: number) {
    const target = this.staffRegistry.find((s) => s.id === id || s.empId === id);
    if (!target) {
      throw new NotFoundException(`Staff member with ID '${id}' not found.`);
    }

    if (salary <= 0) {
      throw new BadRequestException('Monthly Gross CTC must be a positive amount.');
    }

    const oldSalary = target.salary;
    target.salary = salary;

    try {
      await (this.prisma as any).user.update({
        where: { id: target.id },
        data: { salary },
      });
    } catch {
      // In-memory fallback
    }

    return {
      message: `Salary for ${target.name} adjusted from ₹${oldSalary.toLocaleString('en-IN')} to ₹${salary.toLocaleString('en-IN')} / month.`,
      id: target.id,
      empId: target.empId,
      name: target.name,
      previousSalary: oldSalary,
      newSalary: salary,
    };
  }

  async findAll(pagination: PaginationDto) {
    const { skip, limit } = pagination;
    try {
      const [items, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
          },
        }),
        this.prisma.user.count(),
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
    } catch {
      return {
        items: this.staffRegistry,
        pagination: {
          page: 1,
          limit: 20,
          totalItems: this.staffRegistry.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
  }

  async findOne(id: string) {
    const staff = this.staffRegistry.find((s) => s.id === id || s.empId === id);
    if (staff) return staff;

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (user) return user;
    } catch {
      // Fallback
    }

    throw new ResourceNotFoundException('User', id);
  }

  async create(dto: CreateUserDto) {
    return this.onboardStaff(dto);
  }

  async update(id: string, dto: UpdateUserDto) {
    const target = this.staffRegistry.find((s) => s.id === id || s.empId === id);
    if (target) {
      if (dto.firstName) target.firstName = dto.firstName;
      if (dto.lastName) target.lastName = dto.lastName;
      if (dto.role) target.role = dto.role as string;
      if (dto.isActive !== undefined) target.isActive = dto.isActive;
      target.name = `${target.firstName} ${target.lastName}`.trim();
      return target;
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.role && { role: dto.role as any }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }
}

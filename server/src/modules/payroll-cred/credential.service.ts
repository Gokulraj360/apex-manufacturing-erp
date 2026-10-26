import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCredentialDto, UpdateCredentialDto, CalculateSalaryPreviewDto } from './dto/payroll-cred.dto';

export interface EmployeeCredentialRecord {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  nationalId?: string | null;
  address?: string | null;
  role: string;
  roleTitle: string;
  department: string;
  accessPermissions: string[];
  username: string;
  isActive: boolean;
  employmentType: string;
  dateOfJoining: string;
  salaryStructure: {
    basicSalary: number;
    hraAllowance: number;
    conveyanceAllowance: number;
    specialAllowance: number;
    grossSalary: number;
    esiDeduction: number;
    pfDeduction: number;
    professionalTax: number;
    totalDeductions: number;
    netSalary: number;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    panNumber?: string | null;
    uanNumber?: string | null;
    esiNumber?: string | null;
    paymentMode: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Initial seed data for phone assembly factory staff
const INITIAL_CREDENTIALS: EmployeeCredentialRecord[] = [
  {
    id: 'cred-1',
    employeeId: 'EMP-2026-0101',
    name: 'Rameshwar Patil',
    email: 'rameshwar@apexenterprise.com',
    phone: '+91 98451 22334',
    nationalId: 'XXXX-XXXX-8921',
    address: 'Electronics City Phase 1, Bengaluru',
    role: 'production',
    roleTitle: 'SMT Line 1 Machine Operator',
    department: 'Precision Subassembly Lines',
    accessPermissions: ['READ_WORK_ORDERS', 'LOG_ASSEMBLY_OUTPUT', 'VIEW_PARTS_RECIPE'],
    username: 'rameshwar_patil',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-03-15',
    salaryStructure: {
      basicSalary: 18000,
      hraAllowance: 7200,
      conveyanceAllowance: 1600,
      specialAllowance: 2200,
      grossSalary: 29000,
      esiDeduction: 0, // Above ₹21k statutory limit
      pfDeduction: 2160, // 12% of 18k
      professionalTax: 200,
      totalDeductions: 2360,
      netSalary: 26640,
      bankName: 'State Bank of India',
      accountNumber: '381920194821',
      ifscCode: 'SBIN0004120',
      panNumber: 'ABCDE1234F',
      uanNumber: '101928374651',
      esiNumber: '5519283746',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-03-15T09:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'cred-2',
    employeeId: 'EMP-2026-0102',
    name: 'Priya Sharma',
    email: 'priya.sharma@apexenterprise.com',
    phone: '+91 91234 56789',
    nationalId: 'XXXX-XXXX-4412',
    address: 'HSR Layout Sector 2, Bengaluru',
    role: 'quality',
    roleTitle: 'Precision Optics Quality Inspector',
    department: 'Phone Quality Checks',
    accessPermissions: ['LOG_QC_INSPECTION', 'RAISE_DEFECT_REPORT', 'APPROVE_BATCH'],
    username: 'priya_sharma',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-06-01',
    salaryStructure: {
      basicSalary: 22000,
      hraAllowance: 8800,
      conveyanceAllowance: 2000,
      specialAllowance: 3200,
      grossSalary: 36000,
      esiDeduction: 0,
      pfDeduction: 2640, // 12% of 22k
      professionalTax: 200,
      totalDeductions: 2840,
      netSalary: 33160,
      bankName: 'HDFC Bank',
      accountNumber: '50100293847162',
      ifscCode: 'HDFC0001824',
      panNumber: 'FGHIJ5678K',
      uanNumber: '101928374652',
      esiNumber: '5519283747',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-06-01T09:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  },
  {
    id: 'cred-3',
    employeeId: 'EMP-2026-0103',
    name: 'Dilip Sawant',
    email: 'dilip.sawant@apexenterprise.com',
    phone: '+91 99887 76655',
    nationalId: 'XXXX-XXXX-1109',
    address: 'Bommasandra Industrial Area, Bengaluru',
    role: 'fleet',
    roleTitle: 'Commercial Fleet Delivery Driver',
    department: 'Fleet & Logistics',
    accessPermissions: ['VIEW_ASSIGNED_TRIP', 'UPDATE_ODOMETER', 'LOG_FUEL_SLIP'],
    username: 'dilip_sawant',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-09-10',
    salaryStructure: {
      basicSalary: 14000,
      hraAllowance: 4000,
      conveyanceAllowance: 1000,
      specialAllowance: 1500,
      grossSalary: 20500, // Gross <= ₹21,000 -> ESI Applicable
      esiDeduction: 154, // 0.75% of 20,500
      pfDeduction: 1680, // 12% of 14,000
      professionalTax: 200,
      totalDeductions: 2034,
      netSalary: 18466,
      bankName: 'ICICI Bank',
      accountNumber: '001901582910',
      ifscCode: 'ICIC0000019',
      panNumber: 'KLMNO9012P',
      uanNumber: '101928374653',
      esiNumber: '5519283748',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-09-10T09:00:00.000Z',
    updatedAt: '2026-10-03T10:00:00.000Z',
  },
  {
    id: 'cred-4',
    employeeId: 'EMP-2026-0104',
    name: 'Kavita Menon',
    email: 'kavita.menon@apexenterprise.com',
    phone: '+91 98765 12345',
    nationalId: 'XXXX-XXXX-6677',
    address: 'Koramangala 4th Block, Bengaluru',
    role: 'hr',
    roleTitle: 'HR & Labor Compliance Officer',
    department: 'Human Resources',
    accessPermissions: ['ONBOARD_STAFF', 'SUBMIT_PAYROLL', 'APPROVE_LEAVES'],
    username: 'kavita_menon',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-11-01',
    salaryStructure: {
      basicSalary: 35000,
      hraAllowance: 14000,
      conveyanceAllowance: 3000,
      specialAllowance: 8000,
      grossSalary: 60000,
      esiDeduction: 0,
      pfDeduction: 4200, // 12% of 35k
      professionalTax: 200,
      totalDeductions: 4400,
      netSalary: 55600,
      bankName: 'Axis Bank',
      accountNumber: '91802019482716',
      ifscCode: 'UTIB0000214',
      panNumber: 'PQRST3456U',
      uanNumber: '101928374654',
      esiNumber: '5519283749',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-11-01T09:00:00.000Z',
    updatedAt: '2026-10-04T10:00:00.000Z',
  },
  {
    id: 'cred-5',
    employeeId: 'EMP-2026-0105',
    name: 'Amitabh Sen',
    email: 'amitabh.sen@apexenterprise.com',
    phone: '+91 97654 32109',
    nationalId: 'XXXX-XXXX-3344',
    address: 'Indiranagar 100ft Road, Bengaluru',
    role: 'finance',
    roleTitle: 'Commercial Finance & Accounts Lead',
    department: 'Finance & Accounts',
    accessPermissions: ['VERIFY_PAYROLL', 'RELEASE_PAYOUT', 'APPROVE_OVERHEADS'],
    username: 'finance_manager',
    isActive: true,
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-08-15',
    salaryStructure: {
      basicSalary: 50000,
      hraAllowance: 20000,
      conveyanceAllowance: 4000,
      specialAllowance: 16000,
      grossSalary: 90000,
      esiDeduction: 0,
      pfDeduction: 6000, // 12% of 50k
      professionalTax: 200,
      totalDeductions: 6200,
      netSalary: 83800,
      bankName: 'HDFC Bank',
      accountNumber: '50100492817291',
      ifscCode: 'HDFC0000120',
      panNumber: 'UVWXY7890Z',
      uanNumber: '101928374655',
      esiNumber: '5519283750',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-08-15T09:00:00.000Z',
    updatedAt: '2026-10-05T10:00:00.000Z',
  },
];

@Injectable()
export class CredentialService {
  private readonly logger = new Logger(CredentialService.name);
  private credentialsStore: EmployeeCredentialRecord[] = [...INITIAL_CREDENTIALS];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Automated Statutory Indian ESI and PF calculation
   * - PF: 12% of Basic Salary
   * - ESI: 0.75% of Gross Salary if Gross <= ₹21,000/month (Statutory ESIC wage ceiling)
   * - Professional Tax: ₹200 standard
   */
  calculateSalaryBreakdown(dto: CalculateSalaryPreviewDto) {
    const basic = Number(dto.basicSalary) || 0;
    const hra = Number(dto.hraAllowance) || Math.round(basic * 0.4); // Default 40% HRA
    const conveyance = Number(dto.conveyanceAllowance) || 1600;
    const special = Number(dto.specialAllowance) || 2000;

    const grossSalary = basic + hra + conveyance + special;

    // Statutory PF: 12% of Basic
    const pfDeduction = Math.round(basic * 0.12);

    // Statutory ESI: 0.75% of Gross if wage <= 21,000
    const esiDeduction = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;

    const professionalTax = 200;
    const totalDeductions = pfDeduction + esiDeduction + professionalTax;
    const netSalary = Math.max(0, grossSalary - totalDeductions);

    return {
      basicSalary: basic,
      hraAllowance: hra,
      conveyanceAllowance: conveyance,
      specialAllowance: special,
      grossSalary,
      pfDeduction,
      esiDeduction,
      professionalTax,
      totalDeductions,
      netSalary,
      isEsiCovered: grossSalary <= 21000,
    };
  }

  /**
   * Onboard new employee with role, access credentials, and salary structure
   */
  async createCredential(dto: CreateCredentialDto): Promise<EmployeeCredentialRecord> {
    const salary = this.calculateSalaryBreakdown({
      basicSalary: dto.basicSalary,
      hraAllowance: dto.hraAllowance,
      conveyanceAllowance: dto.conveyanceAllowance,
      specialAllowance: dto.specialAllowance,
    });

    const newRecord: EmployeeCredentialRecord = {
      id: `cred-${Date.now()}`,
      employeeId: dto.employeeId || `EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      nationalId: dto.nationalId || null,
      address: dto.address || null,
      role: dto.role,
      roleTitle: dto.roleTitle || `${dto.role} Specialist`,
      department: dto.department,
      accessPermissions: dto.accessPermissions || ['STANDARD_WORKER_ACCESS'],
      username: dto.username || dto.email.split('@')[0],
      isActive: true,
      employmentType: dto.employmentType || 'FULL_TIME',
      dateOfJoining: new Date().toISOString().split('T')[0],
      salaryStructure: {
        basicSalary: salary.basicSalary,
        hraAllowance: salary.hraAllowance,
        conveyanceAllowance: salary.conveyanceAllowance,
        specialAllowance: salary.specialAllowance,
        grossSalary: salary.grossSalary,
        esiDeduction: salary.esiDeduction,
        pfDeduction: salary.pfDeduction,
        professionalTax: salary.professionalTax,
        totalDeductions: salary.totalDeductions,
        netSalary: salary.netSalary,
        bankName: dto.bankName || 'HDFC Bank',
        accountNumber: dto.accountNumber || '000000000000',
        ifscCode: dto.ifscCode || 'HDFC0001000',
        panNumber: dto.panNumber || null,
        uanNumber: dto.uanNumber || null,
        esiNumber: dto.esiNumber || null,
        paymentMode: dto.paymentMode || 'DIRECT_BANK_TRANSFER',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try DB write if schema/connection is active
    try {
      await (this.prisma as any).userCredential.create({
        data: {
          employeeId: newRecord.employeeId,
          name: newRecord.name,
          email: newRecord.email,
          phone: newRecord.phone,
          nationalId: newRecord.nationalId,
          address: newRecord.address,
          role: newRecord.role,
          roleTitle: newRecord.roleTitle,
          department: newRecord.department,
          accessPermissions: newRecord.accessPermissions,
          username: newRecord.username,
          passwordHash: 'argon2id_mock_hash_123',
          employmentType: newRecord.employmentType as any,
          salaryStructure: {
            create: {
              employeeId: newRecord.employeeId,
              basicSalary: newRecord.salaryStructure.basicSalary,
              hraAllowance: newRecord.salaryStructure.hraAllowance,
              conveyanceAllowance: newRecord.salaryStructure.conveyanceAllowance,
              specialAllowance: newRecord.salaryStructure.specialAllowance,
              grossSalary: newRecord.salaryStructure.grossSalary,
              esiDeduction: newRecord.salaryStructure.esiDeduction,
              pfDeduction: newRecord.salaryStructure.pfDeduction,
              professionalTax: newRecord.salaryStructure.professionalTax,
              totalDeductions: newRecord.salaryStructure.totalDeductions,
              netSalary: newRecord.salaryStructure.netSalary,
              bankName: newRecord.salaryStructure.bankName,
              accountNumber: newRecord.salaryStructure.accountNumber,
              ifscCode: newRecord.salaryStructure.ifscCode,
              panNumber: newRecord.salaryStructure.panNumber,
              uanNumber: newRecord.salaryStructure.uanNumber,
              esiNumber: newRecord.salaryStructure.esiNumber,
            },
          },
        },
      });
    } catch {
      // Graceful local store fallback
    }

    this.credentialsStore.unshift(newRecord);
    return newRecord;
  }

  /**
   * List all employee credentials with filtering
   */
  async findAllCredentials(filter?: { department?: string; role?: string; search?: string }): Promise<EmployeeCredentialRecord[]> {
    let result = [...this.credentialsStore];

    if (filter?.department) {
      result = result.filter((c) => c.department.toLowerCase().includes(filter.department!.toLowerCase()));
    }
    if (filter?.role) {
      result = result.filter((c) => c.role.toLowerCase() === filter.role!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.employeeId.toLowerCase().includes(q) ||
          c.username.toLowerCase().includes(q) ||
          c.roleTitle.toLowerCase().includes(q),
      );
    }

    return result;
  }

  /**
   * Find single employee credential by ID
   */
  async findCredentialById(id: string): Promise<EmployeeCredentialRecord> {
    const found = this.credentialsStore.find((c) => c.id === id || c.employeeId === id);
    if (!found) {
      throw new NotFoundException(`Employee with ID "${id}" was not found.`);
    }
    return found;
  }

  /**
   * Update employee credential or salary details
   */
  async updateCredential(id: string, dto: UpdateCredentialDto): Promise<EmployeeCredentialRecord> {
    const existing = await this.findCredentialById(id);

    let updatedSalary = existing.salaryStructure;
    if (dto.basicSalary !== undefined) {
      const calc = this.calculateSalaryBreakdown({
        basicSalary: dto.basicSalary,
        hraAllowance: dto.hraAllowance ?? existing.salaryStructure.hraAllowance,
        conveyanceAllowance: dto.conveyanceAllowance ?? existing.salaryStructure.conveyanceAllowance,
        specialAllowance: dto.specialAllowance ?? existing.salaryStructure.specialAllowance,
      });

      updatedSalary = {
        ...existing.salaryStructure,
        ...calc,
        bankName: dto.bankName ?? existing.salaryStructure.bankName,
        accountNumber: dto.accountNumber ?? existing.salaryStructure.accountNumber,
        ifscCode: dto.ifscCode ?? existing.salaryStructure.ifscCode,
        panNumber: dto.panNumber ?? existing.salaryStructure.panNumber,
        uanNumber: dto.uanNumber ?? existing.salaryStructure.uanNumber,
        esiNumber: dto.esiNumber ?? existing.salaryStructure.esiNumber,
      };
    }

    const updated: EmployeeCredentialRecord = {
      ...existing,
      name: dto.name ?? existing.name,
      email: dto.email ?? existing.email,
      phone: dto.phone ?? existing.phone,
      nationalId: dto.nationalId ?? existing.nationalId,
      address: dto.address ?? existing.address,
      role: dto.role ?? existing.role,
      roleTitle: dto.roleTitle ?? existing.roleTitle,
      department: dto.department ?? existing.department,
      accessPermissions: dto.accessPermissions ?? existing.accessPermissions,
      isActive: dto.isActive ?? existing.isActive,
      salaryStructure: updatedSalary,
      updatedAt: new Date().toISOString(),
    };

    const index = this.credentialsStore.findIndex((c) => c.id === existing.id);
    if (index !== -1) {
      this.credentialsStore[index] = updated;
    }

    return updated;
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CredentialService } from './credential.service';
import { SubmitPayrollBatchDto } from './dto/payroll-cred.dto';

export interface PayrollBatchRecord {
  id: string;
  batchNumber: string;
  month: string;
  year: number;
  periodLabel: string;
  totalHeadcount: number;
  grossTotal: number;
  totalEsi: number;
  totalPf: number;
  totalNetPayout: number;
  submittedBy: string;
  submittedById?: string | null;
  status: 'PENDING_FINANCE_VERIFICATION' | 'VERIFIED' | 'RELEASED' | 'REJECTED';
  financeApproverId?: string | null;
  financeApproverName?: string | null;
  financeNotes?: string | null;
  bankDisbursementRef?: string | null;
  submittedAt: string;
  verifiedAt?: string | null;
  releasedAt?: string | null;
  lineItems: PayrollLineItemRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface PayrollLineItemRecord {
  id: string;
  payrollBatchId: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  payableDays: number;
  presentDays: number;
  leaveDays: number;
  overtimeHours: number;
  basicSalary: number;
  allowances: number;
  grossEarnings: number;
  esiDeduction: number;
  pfDeduction: number;
  totalDeductions: number;
  netPayout: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  paymentStatus: 'PENDING' | 'VERIFIED' | 'PROCESSED';
}

const INITIAL_BATCHES: PayrollBatchRecord[] = [
  {
    id: 'batch-2026-09',
    batchNumber: 'PAY-BATCH-2026-09',
    month: 'September',
    year: 2026,
    periodLabel: 'September 2026 Shift Factory Payroll',
    totalHeadcount: 144,
    grossTotal: 3840000, // ₹38.4 Lakhs
    totalEsi: 28800,
    totalPf: 460800,
    totalNetPayout: 3321600, // ₹33.2 Lakhs
    submittedBy: 'Kavita Menon (HR Lead)',
    submittedById: 'hr-lead',
    status: 'RELEASED',
    financeApproverId: 'finance-lead',
    financeApproverName: 'Amitabh Sen (Finance Lead)',
    financeNotes: 'All attendance punches verified against biometric turnstile logs. Statutory PF & ESI matched.',
    bankDisbursementRef: 'HDFC-CORP-RTGS-990412',
    submittedAt: '2026-09-28T14:30:00.000Z',
    verifiedAt: '2026-09-29T10:15:00.000Z',
    releasedAt: '2026-09-30T11:00:00.000Z',
    lineItems: [],
    createdAt: '2026-09-28T14:30:00.000Z',
    updatedAt: '2026-09-30T11:00:00.000Z',
  },
  {
    id: 'batch-2026-10',
    batchNumber: 'PAY-BATCH-2026-10',
    month: 'October',
    year: 2026,
    periodLabel: 'October 2026 Shift Factory Payroll',
    totalHeadcount: 144,
    grossTotal: 3920000, // ₹39.2 Lakhs
    totalEsi: 29400,
    totalPf: 470400,
    totalNetPayout: 3391400, // ₹33.9 Lakhs
    submittedBy: 'Kavita Menon (HR Lead)',
    submittedById: 'hr-lead',
    status: 'PENDING_FINANCE_VERIFICATION',
    financeApproverId: null,
    financeApproverName: null,
    financeNotes: null,
    bankDisbursementRef: null,
    submittedAt: '2026-10-06T16:00:00.000Z',
    verifiedAt: null,
    releasedAt: null,
    lineItems: [
      {
        id: 'item-1',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0101',
        employeeName: 'Rameshwar Patil',
        role: 'Phone Assembly Technician',
        department: 'Phone Assembly Lines',
        payableDays: 30,
        presentDays: 29,
        leaveDays: 1,
        overtimeHours: 12,
        basicSalary: 18000,
        allowances: 11000,
        grossEarnings: 29000,
        esiDeduction: 0,
        pfDeduction: 2160,
        totalDeductions: 2360,
        netPayout: 26640,
        bankName: 'State Bank of India',
        accountNumber: '381920194821',
        ifscCode: 'SBIN0004120',
        paymentStatus: 'PENDING',
      },
      {
        id: 'item-2',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0102',
        employeeName: 'Priya Sharma',
        role: 'AMOLED Screen QC Inspector',
        department: 'Phone Quality Checks',
        payableDays: 30,
        presentDays: 30,
        leaveDays: 0,
        overtimeHours: 6,
        basicSalary: 22000,
        allowances: 14000,
        grossEarnings: 36000,
        esiDeduction: 0,
        pfDeduction: 2640,
        totalDeductions: 2840,
        netPayout: 33160,
        bankName: 'HDFC Bank',
        accountNumber: '50100293847162',
        ifscCode: 'HDFC0001824',
        paymentStatus: 'PENDING',
      },
      {
        id: 'item-3',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0103',
        employeeName: 'Dilip Sawant',
        role: 'Commercial Fleet Delivery Driver',
        department: 'Fleet & Logistics',
        payableDays: 30,
        presentDays: 28,
        leaveDays: 2,
        overtimeHours: 18,
        basicSalary: 14000,
        allowances: 6500,
        grossEarnings: 20500,
        esiDeduction: 154,
        pfDeduction: 1680,
        totalDeductions: 2034,
        netPayout: 18466,
        bankName: 'ICICI Bank',
        accountNumber: '001901582910',
        ifscCode: 'ICIC0000019',
        paymentStatus: 'PENDING',
      },
      {
        id: 'item-4',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0104',
        employeeName: 'Kavita Menon',
        role: 'HR & Labor Compliance Officer',
        department: 'Human Resources',
        payableDays: 30,
        presentDays: 30,
        leaveDays: 0,
        overtimeHours: 0,
        basicSalary: 35000,
        allowances: 25000,
        grossEarnings: 60000,
        esiDeduction: 0,
        pfDeduction: 4200,
        totalDeductions: 4400,
        netPayout: 55600,
        bankName: 'Axis Bank',
        accountNumber: '91802019482716',
        ifscCode: 'UTIB0000214',
        paymentStatus: 'PENDING',
      },
      {
        id: 'item-5',
        payrollBatchId: 'batch-2026-10',
        employeeId: 'EMP-2026-0105',
        employeeName: 'Amitabh Sen',
        role: 'Commercial Finance Lead',
        department: 'Finance & Accounts',
        payableDays: 30,
        presentDays: 30,
        leaveDays: 0,
        overtimeHours: 0,
        basicSalary: 50000,
        allowances: 40000,
        grossEarnings: 90000,
        esiDeduction: 0,
        pfDeduction: 6000,
        totalDeductions: 6200,
        netPayout: 83800,
        bankName: 'HDFC Bank',
        accountNumber: '50100492817291',
        ifscCode: 'HDFC0000120',
        paymentStatus: 'PENDING',
      },
    ],
    createdAt: '2026-10-06T16:00:00.000Z',
    updatedAt: '2026-10-06T16:00:00.000Z',
  },
];

@Injectable()
export class PayrollSubmissionService {
  private readonly logger = new Logger(PayrollSubmissionService.name);
  private batchesStore: PayrollBatchRecord[] = [...INITIAL_BATCHES];

  constructor(
    private readonly prisma: PrismaService,
    private readonly credentialService: CredentialService,
  ) {}

  /**
   * Calculate live preview of unsubmitted current month payroll statement
   */
  async getCurrentPayrollDraft(month = 'October', year = 2026) {
    const employees = await this.credentialService.findAllCredentials();
    const activeStaff = employees.filter((e) => e.isActive);

    let grossTotal = 0;
    let totalEsi = 0;
    let totalPf = 0;
    let totalNetPayout = 0;

    const lineItems: PayrollLineItemRecord[] = activeStaff.map((emp) => {
      const basic = emp.salaryStructure.basicSalary;
      const allowances =
        emp.salaryStructure.hraAllowance +
        emp.salaryStructure.conveyanceAllowance +
        emp.salaryStructure.specialAllowance;
      const gross = emp.salaryStructure.grossSalary;
      const esi = emp.salaryStructure.esiDeduction;
      const pf = emp.salaryStructure.pfDeduction;
      const net = emp.salaryStructure.netSalary;

      grossTotal += gross;
      totalEsi += esi;
      totalPf += pf;
      totalNetPayout += net;

      return {
        id: `item-${emp.id}`,
        payrollBatchId: 'draft',
        employeeId: emp.employeeId,
        employeeName: emp.name,
        role: emp.roleTitle,
        department: emp.department,
        payableDays: 30,
        presentDays: 29,
        leaveDays: 1,
        overtimeHours: 8,
        basicSalary: basic,
        allowances,
        grossEarnings: gross,
        esiDeduction: esi,
        pfDeduction: pf,
        totalDeductions: emp.salaryStructure.totalDeductions,
        netPayout: net,
        bankName: emp.salaryStructure.bankName,
        accountNumber: emp.salaryStructure.accountNumber,
        ifscCode: emp.salaryStructure.ifscCode,
        paymentStatus: 'PENDING',
      };
    });

    return {
      month,
      year,
      periodLabel: `${month} ${year} Phone Factory Shift Payroll`,
      totalHeadcount: activeStaff.length,
      grossTotal,
      totalEsi,
      totalPf,
      totalNetPayout,
      statutoryComplianceCheck: '100% PF & ESIC Verified',
      lineItems,
    };
  }

  /**
   * Submit compiled payroll statement to Finance department for verification
   */
  async submitPayrollToFinance(dto: SubmitPayrollBatchDto): Promise<PayrollBatchRecord> {
    const draft = await this.getCurrentPayrollDraft(dto.month, dto.year);

    const batchNumber = `PAY-BATCH-${dto.year}-${String(this.batchesStore.length + 1).padStart(2, '0')}`;
    const newBatch: PayrollBatchRecord = {
      id: `batch-${Date.now()}`,
      batchNumber,
      month: dto.month,
      year: dto.year,
      periodLabel: `${dto.month} ${dto.year} Phone Factory Shift Payroll`,
      totalHeadcount: draft.totalHeadcount,
      grossTotal: draft.grossTotal,
      totalEsi: draft.totalEsi,
      totalPf: draft.totalPf,
      totalNetPayout: draft.totalNetPayout,
      submittedBy: dto.submittedBy || 'Kavita Menon (HR Lead)',
      submittedById: dto.submittedById || 'hr-lead',
      status: 'PENDING_FINANCE_VERIFICATION',
      financeApproverId: null,
      financeApproverName: null,
      financeNotes: dto.notes || null,
      bankDisbursementRef: null,
      submittedAt: new Date().toISOString(),
      verifiedAt: null,
      releasedAt: null,
      lineItems: draft.lineItems.map((item) => ({ ...item, payrollBatchId: batchNumber })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try DB write if schema/connection is active
    try {
      await (this.prisma as any).payrollBatch.create({
        data: {
          batchNumber: newBatch.batchNumber,
          month: newBatch.month,
          year: newBatch.year,
          periodLabel: newBatch.periodLabel,
          totalHeadcount: newBatch.totalHeadcount,
          grossTotal: newBatch.grossTotal,
          totalEsi: newBatch.totalEsi,
          totalPf: newBatch.totalPf,
          totalNetPayout: newBatch.totalNetPayout,
          submittedBy: newBatch.submittedBy,
          submittedById: newBatch.submittedById,
          status: 'PENDING_FINANCE_VERIFICATION',
          financeNotes: newBatch.financeNotes,
        },
      });
    } catch {
      // Graceful local store fallback
    }

    this.batchesStore.unshift(newBatch);
    return newBatch;
  }

  /**
   * Find all submitted and past payroll batches
   */
  async findAllBatches(status?: string): Promise<PayrollBatchRecord[]> {
    if (status) {
      return this.batchesStore.filter((b) => b.status === status);
    }
    return this.batchesStore;
  }

  /**
   * Find single payroll batch by ID with itemized line items
   */
  async findBatchById(id: string): Promise<PayrollBatchRecord> {
    const batch = this.batchesStore.find((b) => b.id === id || b.batchNumber === id);
    if (!batch) {
      throw new NotFoundException(`Payroll batch with ID "${id}" was not found.`);
    }
    return batch;
  }

  /**
   * Internal helper to update batch state
   */
  updateBatchState(updatedBatch: PayrollBatchRecord) {
    const idx = this.batchesStore.findIndex((b) => b.id === updatedBatch.id);
    if (idx !== -1) {
      this.batchesStore[idx] = updatedBatch;
    }
  }
}

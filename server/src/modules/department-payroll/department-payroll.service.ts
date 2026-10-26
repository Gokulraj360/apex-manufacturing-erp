import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  WorkerAttendanceInputDto,
  CalculateSalaryPreviewDto,
  CreateDepartmentPayrollSheetDto,
  ReviewDepartmentPayrollDto,
  FinalApproveAndClearDto,
} from './dto/department-payroll.dto';

export interface WorkerCalculatedRecord {
  id: string;
  sheetId: string;
  workerId: string;
  workerName: string;
  role: string;
  department: string;
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  overtimeHours: number;
  baseSalaryRate: number;
  basicPay: number;
  overtimePay: number;
  allowances: number;
  grossPay: number;
  esiDeduction: number;
  pfDeduction: number;
  professionalTax: number;
  totalDeductions: number;
  netPayable: number;
  remarks?: string;
  isTurnstileVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentPayrollSheetRecord {
  id: string;
  department: string;
  departmentCode: string;
  managerId: string;
  managerName: string;
  monthYear: string;
  month: string;
  year: number;
  workingDaysInMonth: number;
  totalWorkers: number;
  totalGrossAmount: number;
  totalEsiAmount: number;
  totalPfAmount: number;
  totalAmount: number; // Net disbursement total
  status: 'DRAFT' | 'SUBMITTED_TO_REVIEW' | 'APPROVED_BY_FINANCE' | 'REJECTED';
  managerNotes?: string;
  submittedAt?: string | null;

  // Review status
  hrReviewerId?: string | null;
  hrReviewerName?: string | null;
  hrNotes?: string | null;
  hrStatus: 'PENDING' | 'APPROVED' | 'FLAGGED';
  hrReviewedAt?: string | null;

  financeReviewerId?: string | null;
  financeReviewerName?: string | null;
  financeNotes?: string | null;
  financeStatus: 'PENDING' | 'APPROVED' | 'FLAGGED';
  financeReviewedAt?: string | null;

  superAdminReviewerId?: string | null;
  superAdminReviewerName?: string | null;
  superAdminNotes?: string | null;
  superAdminStatus: 'PENDING' | 'APPROVED' | 'FLAGGED';
  superAdminReviewedAt?: string | null;

  clearanceReference?: string | null;
  records: WorkerCalculatedRecord[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class DepartmentPayrollService {
  private readonly logger = new Logger(DepartmentPayrollService.name);

  // In-memory data store seeded with authentic industrial manufacturing facility records
  private sheets: DepartmentPayrollSheetRecord[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedInitialData();
  }

  /**
   * Statutory payroll calculation rule compliant with Indian labor standards:
   * - Daily Rate = baseSalaryRate / totalWorkingDays (Standard factory 26 days)
   * - Prorated Basic = dailyRate * daysPresent
   * - Hourly Rate = dailyRate / 8 hours
   * - Overtime Pay = hourlyRate * 1.5 * overtimeHours
   * - Gross Pay = proratedBasic + overtimePay + allowances
   * - Provident Fund (PF) = 12% of proratedBasic
   * - ESI = 0.75% of grossPay IF grossPay <= 21,000; 0 otherwise (statutory cap)
   * - Professional Tax = 200 flat (if grossPay >= 15,000), else 0
   * - Net Take-Home = Gross - (PF + ESI + PT)
   */
  public computeWorkerSalary(
    input: WorkerAttendanceInputDto,
    sheetId: string,
    defaultWorkingDays = 26
  ): WorkerCalculatedRecord {
    const totalWorkingDays = input.totalWorkingDays || defaultWorkingDays;
    const daysPresent = Math.min(input.daysPresent, totalWorkingDays);
    const daysAbsent = Math.max(0, totalWorkingDays - daysPresent);
    const overtimeHours = Math.max(0, input.overtimeHours || 0);
    const baseSalaryRate = input.baseSalaryRate || 18000;
    const allowances = input.allowances || 0;

    const dailyRate = baseSalaryRate / totalWorkingDays;
    const basicPay = Math.round(dailyRate * daysPresent);

    const hourlyRate = dailyRate / 8;
    const overtimePay = Math.round(hourlyRate * 1.5 * overtimeHours);

    const grossPay = basicPay + overtimePay + allowances;

    // Statutory deductions
    const pfDeduction = Math.round(basicPay * 0.12);
    const esiDeduction = grossPay <= 21000 ? Math.round(grossPay * 0.0075) : 0;
    const professionalTax = grossPay >= 15000 ? 200 : 0;
    const totalDeductions = pfDeduction + esiDeduction + professionalTax;
    const netPayable = Math.max(0, grossPay - totalDeductions);

    return {
      id: `wrec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sheetId,
      workerId: input.workerId,
      workerName: input.workerName,
      role: input.role,
      department: input.department || 'Precision Subassembly Lines',
      totalWorkingDays,
      daysPresent,
      daysAbsent,
      overtimeHours,
      baseSalaryRate,
      basicPay,
      overtimePay,
      allowances,
      grossPay,
      esiDeduction,
      pfDeduction,
      professionalTax,
      totalDeductions,
      netPayable,
      remarks: input.remarks || (overtimeHours > 0 ? `${overtimeHours} hrs overtime logged` : 'Standard attendance'),
      isTurnstileVerified: input.isTurnstileVerified !== undefined ? input.isTurnstileVerified : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  public calculateSalaryPreview(dto: CalculateSalaryPreviewDto) {
    const totalWorkingDays = dto.totalWorkingDays || 26;
    const daysPresent = Math.min(dto.daysPresent, totalWorkingDays);
    const overtimeHours = Math.max(0, dto.overtimeHours || 0);
    const baseSalaryRate = dto.baseSalaryRate || 18000;
    const allowances = dto.allowances || 0;

    const dailyRate = baseSalaryRate / totalWorkingDays;
    const basicPay = Math.round(dailyRate * daysPresent);
    const hourlyRate = dailyRate / 8;
    const overtimePay = Math.round(hourlyRate * 1.5 * overtimeHours);
    const grossPay = basicPay + overtimePay + allowances;

    const pfDeduction = Math.round(basicPay * 0.12);
    const esiDeduction = grossPay <= 21000 ? Math.round(grossPay * 0.0075) : 0;
    const professionalTax = grossPay >= 15000 ? 200 : 0;
    const totalDeductions = pfDeduction + esiDeduction + professionalTax;
    const netPayable = Math.max(0, grossPay - totalDeductions);

    return {
      totalWorkingDays,
      daysPresent,
      overtimeHours,
      dailyRate: Math.round(dailyRate),
      basicPay,
      overtimePay,
      allowances,
      grossPay,
      pfDeduction,
      esiDeduction,
      professionalTax,
      totalDeductions,
      netPayable,
    };
  }

  public getAllSheets(filters?: { department?: string; status?: string; monthYear?: string }): DepartmentPayrollSheetRecord[] {
    let result = [...this.sheets];

    if (filters?.department) {
      result = result.filter(s => s.department.toLowerCase().includes(filters.department!.toLowerCase()));
    }
    if (filters?.status) {
      result = result.filter(s => s.status === filters.status);
    }
    if (filters?.monthYear) {
      result = result.filter(s => s.monthYear.toLowerCase().includes(filters.monthYear!.toLowerCase()));
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getSheetById(id: string): DepartmentPayrollSheetRecord {
    const sheet = this.sheets.find(s => s.id === id);
    if (!sheet) {
      throw new NotFoundException(`Department payroll sheet with ID ${id} not found.`);
    }
    return sheet;
  }

  public createSheet(dto: CreateDepartmentPayrollSheetDto): DepartmentPayrollSheetRecord {
    const sheetId = `dept-sheet-${Date.now()}`;
    const workingDays = dto.workingDaysInMonth || 26;

    const calculatedRecords = dto.records.map(rec => this.computeWorkerSalary(rec, sheetId, workingDays));

    const totalGross = calculatedRecords.reduce((acc, r) => acc + r.grossPay, 0);
    const totalEsi = calculatedRecords.reduce((acc, r) => acc + r.esiDeduction, 0);
    const totalPf = calculatedRecords.reduce((acc, r) => acc + r.pfDeduction, 0);
    const totalNet = calculatedRecords.reduce((acc, r) => acc + r.netPayable, 0);

    const newSheet: DepartmentPayrollSheetRecord = {
      id: sheetId,
      department: dto.department,
      departmentCode: dto.departmentCode || this.deriveDepartmentCode(dto.department),
      managerId: dto.managerId,
      managerName: dto.managerName,
      monthYear: dto.monthYear,
      month: dto.month,
      year: dto.year,
      workingDaysInMonth: workingDays,
      totalWorkers: calculatedRecords.length,
      totalGrossAmount: totalGross,
      totalEsiAmount: totalEsi,
      totalPfAmount: totalPf,
      totalAmount: totalNet,
      status: 'DRAFT',
      managerNotes: dto.managerNotes || 'Shift attendance compiled from biometric turnstiles.',
      submittedAt: null,
      hrStatus: 'PENDING',
      financeStatus: 'PENDING',
      superAdminStatus: 'PENDING',
      records: calculatedRecords,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.sheets.unshift(newSheet);
    this.logger.log(`Created departmental payroll sheet ${sheetId} for ${dto.department}`);
    return newSheet;
  }

  public updateSheet(id: string, dto: Partial<CreateDepartmentPayrollSheetDto>): DepartmentPayrollSheetRecord {
    const sheet = this.getSheetById(id);
    if (sheet.status === 'APPROVED_BY_FINANCE') {
      throw new BadRequestException('Cannot modify a payroll sheet that has already been approved by Finance.');
    }

    if (dto.records) {
      const workingDays = dto.workingDaysInMonth || sheet.workingDaysInMonth || 26;
      sheet.records = dto.records.map(rec => this.computeWorkerSalary(rec, sheet.id, workingDays));
      sheet.totalWorkers = sheet.records.length;
      sheet.totalGrossAmount = sheet.records.reduce((acc, r) => acc + r.grossPay, 0);
      sheet.totalEsiAmount = sheet.records.reduce((acc, r) => acc + r.esiDeduction, 0);
      sheet.totalPfAmount = sheet.records.reduce((acc, r) => acc + r.pfDeduction, 0);
      sheet.totalAmount = sheet.records.reduce((acc, r) => acc + r.netPayable, 0);
    }

    if (dto.managerNotes) sheet.managerNotes = dto.managerNotes;
    if (dto.workingDaysInMonth) sheet.workingDaysInMonth = dto.workingDaysInMonth;
    sheet.updatedAt = new Date().toISOString();

    return sheet;
  }

  public submitSheetToReview(id: string, managerNotes?: string): DepartmentPayrollSheetRecord {
    const sheet = this.getSheetById(id);
    if (sheet.status === 'APPROVED_BY_FINANCE') {
      throw new BadRequestException('This sheet has already been approved and settled by Finance.');
    }

    sheet.status = 'SUBMITTED_TO_REVIEW';
    sheet.submittedAt = new Date().toISOString();
    if (managerNotes) {
      sheet.managerNotes = managerNotes;
    }
    sheet.hrStatus = 'PENDING';
    sheet.financeStatus = 'PENDING';
    sheet.superAdminStatus = 'PENDING';
    sheet.updatedAt = new Date().toISOString();

    this.logger.log(
      `Department Payroll Sheet ${id} submitted to review for HR, Finance & Super Admin by ${sheet.managerName}`
    );
    return sheet;
  }

  public reviewSheet(dto: ReviewDepartmentPayrollDto): DepartmentPayrollSheetRecord {
    const sheet = this.getSheetById(dto.sheetId);

    const statusValue = dto.decision === 'APPROVE' ? 'APPROVED' : dto.decision === 'FLAG' ? 'FLAGGED' : 'PENDING';

    if (dto.reviewerRole === 'HR') {
      sheet.hrReviewerId = dto.reviewerId;
      sheet.hrReviewerName = dto.reviewerName;
      sheet.hrNotes = dto.notes || 'Attendance records verified against biometric turnstile logs.';
      sheet.hrStatus = statusValue;
      sheet.hrReviewedAt = new Date().toISOString();
    } else if (dto.reviewerRole === 'FINANCE') {
      sheet.financeReviewerId = dto.reviewerId;
      sheet.financeReviewerName = dto.reviewerName;
      sheet.financeNotes = dto.notes || 'Statutory PF and ESI contributions validated.';
      sheet.financeStatus = statusValue;
      sheet.financeReviewedAt = new Date().toISOString();
    } else if (dto.reviewerRole === 'SUPER_ADMIN') {
      sheet.superAdminReviewerId = dto.reviewerId;
      sheet.superAdminReviewerName = dto.reviewerName;
      sheet.superAdminNotes = dto.notes || 'Plant oversight and departmental wage clearance approved.';
      sheet.superAdminStatus = statusValue;
      sheet.superAdminReviewedAt = new Date().toISOString();
    }

    if (dto.decision === 'REVISE') {
      sheet.status = 'REJECTED';
    }

    sheet.updatedAt = new Date().toISOString();
    return sheet;
  }

  public approveByFinance(dto: FinalApproveAndClearDto): DepartmentPayrollSheetRecord {
    const sheet = this.getSheetById(dto.sheetId);

    sheet.status = 'APPROVED_BY_FINANCE';
    sheet.financeReviewerId = dto.financeOfficerId;
    sheet.financeReviewerName = dto.financeOfficerName;
    sheet.financeNotes = dto.notes || 'All statutory deductions and attendance days cross-verified. Clearance granted.';
    sheet.financeStatus = 'APPROVED';
    sheet.financeReviewedAt = new Date().toISOString();

    // Generate formal audit clearance code
    const shortDept = (sheet.departmentCode || 'DEPT').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    sheet.clearanceReference = `DEPT-CLR-${shortDept}-${sheet.year}-${sheet.month.substr(0, 3).toUpperCase()}-${randNum}`;

    sheet.updatedAt = new Date().toISOString();
    this.logger.log(`Payroll Sheet ${sheet.id} officially APPROVED BY FINANCE. Ref: ${sheet.clearanceReference}`);
    return sheet;
  }

  public rejectSheet(id: string, reason: string, reviewerName: string): DepartmentPayrollSheetRecord {
    const sheet = this.getSheetById(id);
    sheet.status = 'REJECTED';
    sheet.financeNotes = `Rejected / returned for revision by ${reviewerName}: ${reason}`;
    sheet.updatedAt = new Date().toISOString();
    return sheet;
  }

  public getSummaryMetrics() {
    const totalSheets = this.sheets.length;
    const submittedSheets = this.sheets.filter(s => s.status === 'SUBMITTED_TO_REVIEW').length;
    const approvedSheets = this.sheets.filter(s => s.status === 'APPROVED_BY_FINANCE').length;
    const draftSheets = this.sheets.filter(s => s.status === 'DRAFT').length;

    const totalDisbursementApproved = this.sheets
      .filter(s => s.status === 'APPROVED_BY_FINANCE')
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const totalDisbursementUnderReview = this.sheets
      .filter(s => s.status === 'SUBMITTED_TO_REVIEW')
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const totalWorkersManaged = this.sheets.reduce((acc, s) => acc + s.totalWorkers, 0);

    return {
      totalSheets,
      submittedSheets,
      approvedSheets,
      draftSheets,
      totalDisbursementApproved,
      totalDisbursementUnderReview,
      totalWorkersManaged,
    };
  }

  public getDepartmentTemplates() {
    return [
      {
        department: 'Line 1: Circuit Board Assembly Work',
        departmentCode: 'SMT-001',
        managerName: 'Suresh Raina (Line 1 Production Manager)',
        managerId: 'mgr-prod-01',
        workers: [
          { workerId: 'EMP-2026-0101', workerName: 'Rameshwar Patil', role: 'SMT Surface Mount Technician', baseSalaryRate: 22000, daysPresent: 26, overtimeHours: 14, allowances: 2000 },
          { workerId: 'EMP-2026-0102', workerName: 'Gopal Krishnan', role: 'Optical Solder Inspector (AOI)', baseSalaryRate: 19500, daysPresent: 25, overtimeHours: 10, allowances: 1500 },
          { workerId: 'EMP-2026-0103', workerName: 'Anil Jadhav', role: 'SMT Feeder Operator', baseSalaryRate: 18000, daysPresent: 26, overtimeHours: 16, allowances: 1200 },
          { workerId: 'EMP-2026-0104', workerName: 'Priya Sundaram', role: 'PCB Stencil Printer Specialist', baseSalaryRate: 20500, daysPresent: 24, overtimeHours: 8, allowances: 1800 },
        ],
      },
      {
        department: 'Line 2: Precision Component Subassembly',
        departmentCode: 'DISP-002',
        managerName: 'Ananya Deshmukh (Cleanroom Line Manager)',
        managerId: 'mgr-disp-02',
        workers: [
          { workerId: 'EMP-2026-0201', workerName: 'Sunita Rao', role: 'Vacuum Screen Laminator', baseSalaryRate: 21000, daysPresent: 26, overtimeHours: 12, allowances: 2200 },
          { workerId: 'EMP-2026-0202', workerName: 'Manoj Kumar', role: 'Dust Particle Inspection Tech', baseSalaryRate: 18500, daysPresent: 26, overtimeHours: 8, allowances: 1400 },
          { workerId: 'EMP-2026-0203', workerName: 'Deepa Varma', role: 'Precision Optical Subassembly Lead', baseSalaryRate: 24000, daysPresent: 25, overtimeHours: 6, allowances: 2500 },
        ],
      },
      {
        department: 'Warehouse & Parts Stock',
        departmentCode: 'WH-001',
        managerName: 'Vikram Malhotra (Warehouse Store Head)',
        managerId: 'mgr-wh-01',
        workers: [
          { workerId: 'EMP-2026-0301', workerName: 'Prakash Rao', role: 'Chipset Storage Bin Handler', baseSalaryRate: 17500, daysPresent: 26, overtimeHours: 10, allowances: 1000 },
          { workerId: 'EMP-2026-0302', workerName: 'Santosh Gowda', role: 'Barcode & QR Scanner Staff', baseSalaryRate: 16500, daysPresent: 24, overtimeHours: 4, allowances: 1000 },
          { workerId: 'EMP-2026-0303', workerName: 'Mohd. Imran', role: 'Forklift & Pallet Operator', baseSalaryRate: 19000, daysPresent: 26, overtimeHours: 18, allowances: 1500 },
        ],
      },
      {
        department: 'Phone Quality Checks',
        departmentCode: 'QA-005',
        managerName: 'Dr. Meenakshi Sundaram (Quality Head)',
        managerId: 'mgr-qa-01',
        workers: [
          { workerId: 'EMP-2026-0401', workerName: 'Devendra Joshi', role: 'Battery Drop & Stress Tester', baseSalaryRate: 23000, daysPresent: 26, overtimeHours: 6, allowances: 2000 },
          { workerId: 'EMP-2026-0402', workerName: 'Kavita Shinde', role: 'Display Color Calibrator', baseSalaryRate: 21500, daysPresent: 25, overtimeHours: 12, allowances: 1800 },
        ],
      },
    ];
  }

  private deriveDepartmentCode(dept: string): string {
    if (dept.includes('Line 1')) return 'SMT-001';
    if (dept.includes('Line 2')) return 'DISP-002';
    if (dept.includes('Line 3')) return 'CAM-003';
    if (dept.includes('Line 4')) return 'RF-004';
    if (dept.includes('Line 5')) return 'QA-005';
    if (dept.includes('Line 6')) return 'BOX-006';
    if (dept.includes('Warehouse')) return 'WH-001';
    if (dept.includes('Quality')) return 'QA-005';
    if (dept.includes('Logistics')) return 'LOG-001';
    return 'DEPT-GEN';
  }

  private seedInitialData() {
    // Seed 1: Line 1 SMT Assembly - Submitted to Review (October 2026)
    const smtSheetId = 'dept-sheet-smt-2026-10';
    const smtWorkers: WorkerAttendanceInputDto[] = [
      { workerId: 'EMP-2026-0101', workerName: 'Rameshwar Patil', role: 'SMT Surface Mount Technician', department: 'Line 1: Circuit Board Assembly Work', baseSalaryRate: 22000, daysPresent: 26, overtimeHours: 14, allowances: 2000 },
      { workerId: 'EMP-2026-0102', workerName: 'Gopal Krishnan', role: 'Optical Solder Inspector (AOI)', department: 'Line 1: Circuit Board Assembly Work', baseSalaryRate: 19500, daysPresent: 25, overtimeHours: 10, allowances: 1500 },
      { workerId: 'EMP-2026-0103', workerName: 'Anil Jadhav', role: 'SMT Feeder Operator', department: 'Line 1: Circuit Board Assembly Work', baseSalaryRate: 18000, daysPresent: 26, overtimeHours: 16, allowances: 1200 },
      { workerId: 'EMP-2026-0104', workerName: 'Priya Sundaram', role: 'PCB Stencil Printer Specialist', department: 'Line 1: Circuit Board Assembly Work', baseSalaryRate: 20500, daysPresent: 24, overtimeHours: 8, allowances: 1800 },
      { workerId: 'EMP-2026-0105', workerName: 'Mahesh Vernekar', role: 'Reflow Oven Thermal Controller', department: 'Line 1: Circuit Board Assembly Work', baseSalaryRate: 23000, daysPresent: 26, overtimeHours: 12, allowances: 2000 },
    ];
    const smtCalculated = smtWorkers.map(w => this.computeWorkerSalary(w, smtSheetId, 26));

    const smtSheet: DepartmentPayrollSheetRecord = {
      id: smtSheetId,
      department: 'Line 1: Circuit Board Assembly Work',
      departmentCode: 'SMT-001',
      managerId: 'mgr-prod-01',
      managerName: 'Suresh Raina (Line 1 Production Manager)',
      monthYear: 'October 2026',
      month: 'October',
      year: 2026,
      workingDaysInMonth: 26,
      totalWorkers: smtCalculated.length,
      totalGrossAmount: smtCalculated.reduce((a, b) => a + b.grossPay, 0),
      totalEsiAmount: smtCalculated.reduce((a, b) => a + b.esiDeduction, 0),
      totalPfAmount: smtCalculated.reduce((a, b) => a + b.pfDeduction, 0),
      totalAmount: smtCalculated.reduce((a, b) => a + b.netPayable, 0),
      status: 'SUBMITTED_TO_REVIEW',
      managerNotes: 'Full 3-shift rotation completed. All overtime authorized for Precision Core Controller & Logic Board Sprint.',
      submittedAt: '2026-10-04T09:30:00.000Z',
      hrReviewerId: 'hr-lead-01',
      hrReviewerName: 'Kavita Menon (HR Lead)',
      hrNotes: 'Biometric turnstile punches cross-verified. 0 discrepancies.',
      hrStatus: 'APPROVED',
      hrReviewedAt: '2026-10-05T11:00:00.000Z',
      financeReviewerId: null,
      financeReviewerName: null,
      financeNotes: null,
      financeStatus: 'PENDING',
      financeReviewedAt: null,
      superAdminReviewerId: 'super-admin-01',
      superAdminReviewerName: 'Dr. Rajesh (Owner/MD)',
      superAdminNotes: 'Good yield on SMT line this month. Approved for finance disbursement.',
      superAdminStatus: 'APPROVED',
      superAdminReviewedAt: '2026-10-05T14:15:00.000Z',
      clearanceReference: null,
      records: smtCalculated,
      createdAt: '2026-10-03T18:00:00.000Z',
      updatedAt: '2026-10-05T14:15:00.000Z',
    };

    // Seed 2: Line 2 Precision Component Subassembly - Approved By Finance (September 2026)
    const dispSheetId = 'dept-sheet-disp-2026-09';
    const dispWorkers: WorkerAttendanceInputDto[] = [
      { workerId: 'EMP-2026-0201', workerName: 'Sunita Rao', role: 'Vacuum Screen Laminator', department: 'Line 2: Precision Component Subassembly', baseSalaryRate: 21000, daysPresent: 26, overtimeHours: 12, allowances: 2200 },
      { workerId: 'EMP-2026-0202', workerName: 'Manoj Kumar', role: 'Dust Particle Inspection Tech', department: 'Line 2: Precision Component Subassembly', baseSalaryRate: 18500, daysPresent: 26, overtimeHours: 8, allowances: 1400 },
      { workerId: 'EMP-2026-0203', workerName: 'Deepa Varma', role: 'Precision Optical Subassembly Lead', department: 'Line 2: Precision Component Subassembly', baseSalaryRate: 24000, daysPresent: 25, overtimeHours: 6, allowances: 2500 },
    ];
    const dispCalculated = dispWorkers.map(w => this.computeWorkerSalary(w, dispSheetId, 26));

    const dispSheet: DepartmentPayrollSheetRecord = {
      id: dispSheetId,
      department: 'Line 2: Precision Component Subassembly',
      departmentCode: 'DISP-002',
      managerId: 'mgr-disp-02',
      managerName: 'Ananya Deshmukh (Cleanroom Line Manager)',
      monthYear: 'September 2026',
      month: 'September',
      year: 2026,
      workingDaysInMonth: 26,
      totalWorkers: dispCalculated.length,
      totalGrossAmount: dispCalculated.reduce((a, b) => a + b.grossPay, 0),
      totalEsiAmount: dispCalculated.reduce((a, b) => a + b.esiDeduction, 0),
      totalPfAmount: dispCalculated.reduce((a, b) => a + b.pfDeduction, 0),
      totalAmount: dispCalculated.reduce((a, b) => a + b.netPayable, 0),
      status: 'APPROVED_BY_FINANCE',
      managerNotes: 'Class-1000 cleanroom shift rosters verified.',
      submittedAt: '2026-09-28T10:00:00.000Z',
      hrReviewerId: 'hr-lead-01',
      hrReviewerName: 'Kavita Menon (HR Lead)',
      hrNotes: 'All attendance records verified.',
      hrStatus: 'APPROVED',
      hrReviewedAt: '2026-09-28T16:00:00.000Z',
      financeReviewerId: 'fin-lead-01',
      financeReviewerName: 'Amitabh Sen (Finance Lead)',
      financeNotes: 'Statutory ESI and PF accounts confirmed. Bank payment released.',
      financeStatus: 'APPROVED',
      financeReviewedAt: '2026-09-29T11:30:00.000Z',
      superAdminReviewerId: 'super-admin-01',
      superAdminReviewerName: 'Dr. Rajesh (Owner/MD)',
      superAdminNotes: 'Confirmed.',
      superAdminStatus: 'APPROVED',
      superAdminReviewedAt: '2026-09-29T12:00:00.000Z',
      clearanceReference: 'DEPT-CLR-DISP-2026-SEP-8812',
      records: dispCalculated,
      createdAt: '2026-09-27T14:00:00.000Z',
      updatedAt: '2026-09-29T12:00:00.000Z',
    };

    // Seed 3: Warehouse & Parts Stock - Draft (October 2026)
    const whSheetId = 'dept-sheet-wh-2026-10';
    const whWorkers: WorkerAttendanceInputDto[] = [
      { workerId: 'EMP-2026-0301', workerName: 'Prakash Rao', role: 'Chipset Storage Bin Handler', department: 'Warehouse & Parts Stock', baseSalaryRate: 17500, daysPresent: 26, overtimeHours: 10, allowances: 1000 },
      { workerId: 'EMP-2026-0302', workerName: 'Santosh Gowda', role: 'Barcode & QR Scanner Staff', department: 'Warehouse & Parts Stock', baseSalaryRate: 16500, daysPresent: 24, overtimeHours: 4, allowances: 1000 },
      { workerId: 'EMP-2026-0303', workerName: 'Mohd. Imran', role: 'Forklift & Pallet Operator', department: 'Warehouse & Parts Stock', baseSalaryRate: 19000, daysPresent: 26, overtimeHours: 18, allowances: 1500 },
    ];
    const whCalculated = whWorkers.map(w => this.computeWorkerSalary(w, whSheetId, 26));

    const whSheet: DepartmentPayrollSheetRecord = {
      id: whSheetId,
      department: 'Warehouse & Parts Stock',
      departmentCode: 'WH-001',
      managerId: 'mgr-wh-01',
      managerName: 'Vikram Malhotra (Warehouse Store Head)',
      monthYear: 'October 2026',
      month: 'October',
      year: 2026,
      workingDaysInMonth: 26,
      totalWorkers: whCalculated.length,
      totalGrossAmount: whCalculated.reduce((a, b) => a + b.grossPay, 0),
      totalEsiAmount: whCalculated.reduce((a, b) => a + b.esiDeduction, 0),
      totalPfAmount: whCalculated.reduce((a, b) => a + b.pfDeduction, 0),
      totalAmount: whCalculated.reduce((a, b) => a + b.netPayable, 0),
      status: 'DRAFT',
      managerNotes: 'Compiling remaining overtime hours from night shift inbound unloading.',
      submittedAt: null,
      hrStatus: 'PENDING',
      financeStatus: 'PENDING',
      superAdminStatus: 'PENDING',
      records: whCalculated,
      createdAt: '2026-10-06T08:00:00.000Z',
      updatedAt: '2026-10-06T08:00:00.000Z',
    };

    this.sheets.push(smtSheet, dispSheet, whSheet);
    this.logger.log(`Pre-seeded ${this.sheets.length} departmental payroll sheets.`);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateLeaveRequestDto,
  ReviewLeaveRequestDto,
  LeaveFilterDto,
  LeaveTypeEnum,
  LeaveRecipientTypeEnum,
  LeaveStatusEnum,
} from './leave.dto';

export interface LeaveRecord {
  id: string;
  leaveCode: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  departmentLabel: string;
  recipientType: LeaveRecipientTypeEnum;
  targetApproverId: string;
  targetApproverName: string;
  leaveType: LeaveTypeEnum;
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  status: LeaveStatusEnum;
  approverComments?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewedRole?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Department Manager Directory for automatic hierarchy routing
const DEPARTMENT_MANAGERS: Record<string, { id: string; name: string; role: string; label: string }> = {
  SMT_PRODUCTION: { id: 'production', name: 'Rajesh Sharma', role: 'SMT Floor Lead', label: 'SMT & PCB Production' },
  WAREHOUSE_IMEI: { id: 'warehouse', name: 'Kavita Patel', role: 'Warehouse Master Lead', label: 'Warehouse & IMEI Stock' },
  QUALITY_RF: { id: 'quality', name: 'Arun Verma', role: 'Quality & RF Lead', label: 'Quality Assurance & 5G RF' },
  SUPPLY_CHAIN: { id: 'supply_chain', name: 'Pooja Deshmukh', role: 'SCM Director', label: 'Supply Chain & Sourcing' },
  COMMERCIAL_FINANCE: { id: 'finance', name: 'Amitabh Sen', role: 'Commercial Finance Lead', label: 'Finance & Accounts' },
  MOBILE_ENGINEERING: { id: 'design', name: 'Siddharth Roy', role: 'Hardware Engineering Lead', label: 'Design & Engineering' },
  FLEET_LOGISTICS: { id: 'fleet', name: 'Girish Rao', role: 'Fleet Transport Lead', label: 'Fleet & Logistics' },
  FIELD_SERVICE: { id: 'field_service', name: 'Dr. Sunita Kulkarni', role: 'Field Service Lead', label: 'Field & Client Care' },
  HUMAN_RESOURCES: { id: 'hr', name: 'Deepak Chawla', role: 'HR Lead', label: 'Human Resources' },
  PROCUREMENT: { id: 'procurement', name: 'Naveen Singhal', role: 'Procurement Lead', label: 'Procurement Specialist' },
  MARKETING_LAUNCH: { id: 'marketing', name: 'Ayesha Khan', role: 'Marketing Director', label: 'Marketing & Brand Launch' },
  RETAIL_DISPATCH: { id: 'dispatch', name: 'Ramesh Yadav', role: 'Retail Dispatch Lead', label: 'Packaging & Dispatch' },
  ASSET_RELIABILITY: { id: 'asset_reliability', name: 'Praveen Hegde', role: 'Reliability Lead', label: 'SMT Feeder & HVAC Reliability' },
  SUBCONTRACTING: { id: 'subcontracting', name: 'Alok Dixit', role: 'Subcontracting Lead', label: 'Subcontracting & Flex Assembly' },
  OEM_CRM: { id: 'crm', name: 'Meera Nambiar', role: 'OEM Accounts Lead', label: 'Sales & OEM CRM' },
  LOGISTICS_SECURITY: { id: 'logistics', name: 'Balram Singh', role: 'Logistics Security Lead', label: 'Logistics Gate & Security' },
  SHOP_FLOOR_ASSEMBLY: { id: 'production', name: 'Rajesh Sharma', role: 'SMT Floor Lead', label: 'Shop Floor Assembly' },
  WORKFORCE_ALLOCATION: { id: 'hr', name: 'Deepak Chawla', role: 'HR Lead', label: 'Workforce Deployment' },
  EQUIPMENT_MAINTENANCE: { id: 'asset_reliability', name: 'Praveen Hegde', role: 'Reliability Lead', label: 'Plant Maintenance' },
  FACTORY_IT: { id: 'system_admin', name: 'Kunal Sen', role: 'Factory IT Lead', label: 'IT & Industrial Systems' },
};

const HR_HEAD = {
  id: 'hr',
  name: 'Deepak Chawla',
  role: 'HR Lead',
  department: 'HUMAN_RESOURCES',
  label: 'Human Resources Department',
};

@Injectable()
export class LeaveService {
  private readonly logger = new Logger(LeaveService.name);

  // In-memory fallback and seed cache with realistic mobile plant leave records
  private inMemoryLeaves: LeaveRecord[] = [
    {
      id: 'leave-101',
      leaveCode: 'LV-2026-0041',
      employeeId: 'plant_operator',
      employeeName: 'Sunil Joshi',
      employeeRole: 'Cleanroom Display Bonding Operator',
      department: 'SMT_PRODUCTION',
      departmentLabel: 'SMT & PCB Production',
      recipientType: 'DEPARTMENT_MANAGER',
      targetApproverId: 'production',
      targetApproverName: 'Rajesh Sharma',
      leaveType: 'MEDICAL',
      startDate: new Date(Date.now() + 86400000 * 1).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      durationDays: 2,
      reason: 'Scheduled ophthalmology eye strain examination following 120-hour cleanroom optical alignment shift cycle.',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 'leave-102',
      leaveCode: 'LV-2026-0042',
      employeeId: 'maintenance_tech',
      employeeName: 'Kiran Rao',
      employeeRole: 'SMT Nozzle Maintenance Tech',
      department: 'ASSET_RELIABILITY',
      departmentLabel: 'SMT Feeder & HVAC Reliability',
      recipientType: 'DEPARTMENT_MANAGER',
      targetApproverId: 'asset_reliability',
      targetApproverName: 'Praveen Hegde',
      leaveType: 'CASUAL',
      startDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      durationDays: 2,
      reason: 'Personal family commitment in hometown. Replacement tech roster coordinated with Shift Lead.',
      status: 'APPROVED',
      approverComments: 'Roster coverage verified with Dinesh Pandey. Approved.',
      reviewedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      reviewedBy: 'Praveen Hegde',
      reviewedRole: 'Reliability Lead',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'leave-103',
      leaveCode: 'LV-2026-0043',
      employeeId: 'production',
      employeeName: 'Rajesh Sharma',
      employeeRole: 'SMT Floor Lead',
      department: 'SMT_PRODUCTION',
      departmentLabel: 'SMT & PCB Production',
      recipientType: 'HR',
      targetApproverId: 'hr',
      targetApproverName: 'Deepak Chawla',
      leaveType: 'EARNED',
      startDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      durationDays: 4,
      reason: 'Annual earned leave after successful pilot ramp of Apex Pro Line 1. Assistant Manager Vikram Joshi designated as acting SMT lead.',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 'leave-104',
      leaveCode: 'LV-2026-0044',
      employeeId: 'ast-wh-01',
      employeeName: 'Suresh Nair',
      employeeRole: 'Assistant Bins & Putaway Officer',
      department: 'WAREHOUSE_IMEI',
      departmentLabel: 'Warehouse & IMEI Stock',
      recipientType: 'DEPARTMENT_MANAGER',
      targetApproverId: 'warehouse',
      targetApproverName: 'Kavita Patel',
      leaveType: 'SICK',
      startDate: new Date(Date.now() - 86400000 * 1).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 1).toISOString(),
      durationDays: 2,
      reason: 'Acute viral fever. Doctor prescription attached to HR portal.',
      status: 'APPROVED',
      approverComments: 'Get well soon. Putaway handover temporarily delegated to Bin Supervisor.',
      reviewedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      reviewedBy: 'Kavita Patel',
      reviewedRole: 'Warehouse Master Lead',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
    {
      id: 'leave-105',
      leaveCode: 'LV-2026-0045',
      employeeId: 'design',
      employeeName: 'Siddharth Roy',
      employeeRole: 'Hardware Engineering Lead',
      department: 'MOBILE_ENGINEERING',
      departmentLabel: 'Design & Engineering',
      recipientType: 'HR',
      targetApproverId: 'hr',
      targetApproverName: 'Deepak Chawla',
      leaveType: 'CASUAL',
      startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 6).toISOString(),
      durationDays: 2,
      reason: 'Attending IEEE International Semiconductor Device Research Symposium (Online Presentation).',
      status: 'APPROVED',
      approverComments: 'Approved under executive professional development policy.',
      reviewedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      reviewedBy: 'Deepak Chawla',
      reviewedRole: 'HR Lead',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'leave-106',
      leaveCode: 'LV-2026-0046',
      employeeId: 'warehouse',
      employeeName: 'Kavita Patel',
      employeeRole: 'Warehouse Master Lead',
      department: 'WAREHOUSE_IMEI',
      departmentLabel: 'Warehouse & IMEI Stock',
      recipientType: 'HR',
      targetApproverId: 'hr',
      targetApproverName: 'Deepak Chawla',
      leaveType: 'MEDICAL',
      startDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      durationDays: 2,
      reason: 'Scheduled diagnostic scan and post-op consultation.',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'leave-107',
      leaveCode: 'LV-2026-0047',
      employeeId: 'ast-qa-01',
      employeeName: 'Divya Sundaram',
      employeeRole: 'Assistant Optical & Testing Lead',
      department: 'QUALITY_RF',
      departmentLabel: 'Quality Assurance & 5G RF',
      recipientType: 'DEPARTMENT_MANAGER',
      targetApproverId: 'quality',
      targetApproverName: 'Arun Verma',
      leaveType: 'CASUAL',
      startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      durationDays: 1,
      reason: 'Urgent municipal document registry appointment.',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];

  constructor(private readonly prisma?: PrismaService) {}

  /**
   * Determine automatic routing recipient and approver based on organizational hierarchy:
   * 1. Basic workers/operators/technicians -> Department Manager
   * 2. Department Managers and General Specialists -> HR Department
   */
  resolveRouting(employeeRole: string, department: string) {
    const roleLower = employeeRole.toLowerCase();

    // Check if employee is a basic worker / operator / technician
    const isWorker =
      roleLower.includes('operator') ||
      roleLower.includes('tech') ||
      roleLower.includes('worker') ||
      roleLower.includes('assembler') ||
      roleLower.includes('picker') ||
      roleLower.includes('feeder') ||
      roleLower.includes('trainee');

    if (isWorker) {
      const deptManager = DEPARTMENT_MANAGERS[department] || {
        id: 'production',
        name: 'Rajesh Sharma',
        role: 'Department Floor Lead',
        label: department,
      };

      return {
        recipientType: 'DEPARTMENT_MANAGER' as LeaveRecipientTypeEnum,
        targetApproverId: deptManager.id,
        targetApproverName: deptManager.name,
        targetApproverRole: deptManager.role,
        departmentLabel: deptManager.label,
      };
    }

    // Otherwise, department managers, assistant managers, engineers & specialists route to HR
    return {
      recipientType: 'HR' as LeaveRecipientTypeEnum,
      targetApproverId: HR_HEAD.id,
      targetApproverName: HR_HEAD.name,
      targetApproverRole: HR_HEAD.role,
      departmentLabel: DEPARTMENT_MANAGERS[department]?.label || department,
    };
  }

  /**
   * Submit new leave request with automatic hierarchical routing
   */
  async createLeaveRequest(dto: CreateLeaveRequestDto): Promise<LeaveRecord> {
    const routing = this.resolveRouting(dto.employeeRole, dto.department);

    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const leaveCode = `LV-2026-${randomSeq}`;

    // Compute duration in days if not provided
    let duration = dto.durationDays || 1;
    if (dto.startDate && dto.endDate) {
      const start = new Date(dto.startDate).getTime();
      const end = new Date(dto.endDate).getTime();
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > 0) duration = diff;
    }

    const newRecord: LeaveRecord = {
      id: `leave-${Date.now()}`,
      leaveCode,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeRole: dto.employeeRole,
      department: dto.department,
      departmentLabel: dto.departmentLabel || routing.departmentLabel,
      recipientType: dto.recipientType || routing.recipientType,
      targetApproverId: dto.targetApproverId || routing.targetApproverId,
      targetApproverName: dto.targetApproverName || routing.targetApproverName,
      leaveType: dto.leaveType || 'CASUAL',
      startDate: dto.startDate,
      endDate: dto.endDate,
      durationDays: duration,
      reason: dto.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try Prisma database write
    if (this.prisma?.leaveRequest) {
      try {
        const created = await this.prisma.leaveRequest.create({
          data: {
            leaveCode: newRecord.leaveCode,
            employeeId: newRecord.employeeId,
            employeeName: newRecord.employeeName,
            employeeRole: newRecord.employeeRole,
            department: newRecord.department,
            departmentLabel: newRecord.departmentLabel,
            recipientType: newRecord.recipientType as any,
            targetApproverId: newRecord.targetApproverId,
            targetApproverName: newRecord.targetApproverName,
            leaveType: newRecord.leaveType as any,
            startDate: new Date(newRecord.startDate),
            endDate: new Date(newRecord.endDate),
            durationDays: newRecord.durationDays,
            reason: newRecord.reason,
            status: 'PENDING',
          },
        });
        newRecord.id = created.id;
      } catch (err) {
        this.logger.warn(`Prisma Leave persist failed; stored in memory: ${err?.message}`);
      }
    }

    this.inMemoryLeaves.unshift(newRecord);
    return newRecord;
  }

  /**
   * Filter leave requests by various attributes
   */
  async getLeaveRequests(filter?: LeaveFilterDto): Promise<LeaveRecord[]> {
    let list = [...this.inMemoryLeaves];

    if (filter?.employeeId) {
      list = list.filter((r) => r.employeeId === filter.employeeId);
    }
    if (filter?.department) {
      list = list.filter((r) => r.department.toLowerCase() === filter.department.toLowerCase());
    }
    if (filter?.recipientType) {
      list = list.filter((r) => r.recipientType === filter.recipientType);
    }
    if (filter?.targetApproverId) {
      list = list.filter((r) => r.targetApproverId === filter.targetApproverId);
    }
    if (filter?.status) {
      list = list.filter((r) => r.status === filter.status);
    }
    if (filter?.leaveType) {
      list = list.filter((r) => r.leaveType === filter.leaveType);
    }

    return list;
  }

  /**
   * Dedicated inbox for Department Managers (fetches pending requests from workers under their department)
   */
  async getPendingForManager(managerId?: string, department?: string): Promise<LeaveRecord[]> {
    return this.inMemoryLeaves.filter((r) => {
      const matchesRecipient = r.recipientType === 'DEPARTMENT_MANAGER';
      const isPending = r.status === 'PENDING';
      const matchesManager = !managerId || r.targetApproverId === managerId;
      const matchesDept = !department || r.department.toLowerCase() === department.toLowerCase();
      return matchesRecipient && isPending && (matchesManager || matchesDept);
    });
  }

  /**
   * Dedicated inbox for HR Department (fetches pending requests from Department Managers & Specialists)
   */
  async getPendingForHr(): Promise<LeaveRecord[]> {
    return this.inMemoryLeaves.filter(
      (r) => r.recipientType === 'HR' && r.status === 'PENDING',
    );
  }

  /**
   * Approve or reject a leave request with manager/HR audit trail
   */
  async reviewLeaveRequest(id: string, dto: ReviewLeaveRequestDto): Promise<LeaveRecord> {
    const record = this.inMemoryLeaves.find((r) => r.id === id || r.leaveCode === id);
    if (!record) {
      throw new Error(`Leave request '${id}' not found`);
    }

    record.status = dto.status;
    record.approverComments = dto.approverComments || null;
    record.reviewedBy = dto.reviewedBy;
    record.reviewedRole = dto.reviewedRole;
    record.reviewedAt = new Date().toISOString();
    record.updatedAt = new Date().toISOString();

    // Prisma update
    if (this.prisma?.leaveRequest) {
      try {
        await this.prisma.leaveRequest.update({
          where: { id: record.id },
          data: {
            status: record.status as any,
            approverComments: record.approverComments,
            reviewedBy: record.reviewedBy,
            reviewedRole: record.reviewedRole,
            reviewedAt: new Date(record.reviewedAt),
          },
        });
      } catch (err) {
        this.logger.warn(`Prisma Leave update failed: ${err?.message}`);
      }
    }

    return record;
  }

  /**
   * Summary metrics for HR & Executive monitoring
   */
  async getLeaveSummaryMetrics() {
    const total = this.inMemoryLeaves.length;
    const pendingManager = this.inMemoryLeaves.filter(
      (r) => r.recipientType === 'DEPARTMENT_MANAGER' && r.status === 'PENDING',
    ).length;
    const pendingHr = this.inMemoryLeaves.filter(
      (r) => r.recipientType === 'HR' && r.status === 'PENDING',
    ).length;
    const approved = this.inMemoryLeaves.filter((r) => r.status === 'APPROVED').length;
    const rejected = this.inMemoryLeaves.filter((r) => r.status === 'REJECTED').length;

    // Type distribution
    const typeDistribution = {
      CASUAL: this.inMemoryLeaves.filter((r) => r.leaveType === 'CASUAL').length,
      MEDICAL: this.inMemoryLeaves.filter((r) => r.leaveType === 'MEDICAL').length,
      SICK: this.inMemoryLeaves.filter((r) => r.leaveType === 'SICK').length,
      EARNED: this.inMemoryLeaves.filter((r) => r.leaveType === 'EARNED').length,
      MATERNITY_PATERNITY: this.inMemoryLeaves.filter((r) => r.leaveType === 'MATERNITY_PATERNITY').length,
    };

    // Plant Attendance & Absenteeism Impact
    const currentOnLeave = this.inMemoryLeaves.filter((r) => {
      if (r.status !== 'APPROVED') return false;
      const now = new Date().getTime();
      return new Date(r.startDate).getTime() <= now && now <= new Date(r.endDate).getTime();
    }).length;

    return {
      kpis: {
        totalRequests: total,
        pendingManagerInbox: pendingManager,
        pendingHrInbox: pendingHr,
        totalApproved: approved,
        totalRejected: rejected,
        currentlyOnLeave: currentOnLeave,
        approvalRate: total > 0 ? `${Math.round((approved / total) * 100)}%` : '0%',
      },
      typeDistribution,
      departmentDirectory: Object.entries(DEPARTMENT_MANAGERS).map(([key, val]) => ({
        key,
        name: val.name,
        role: val.role,
        label: val.label,
        pendingCount: this.inMemoryLeaves.filter(
          (r) => r.department === key && r.status === 'PENDING',
        ).length,
      })),
    };
  }

  /**
   * Get employee leave quota balances
   */
  getLeaveBalances(employeeId: string) {
    return {
      casual: { total: 12, used: 4, remaining: 8 },
      sick: { total: 10, used: 3, remaining: 7 },
      earned: { total: 18, used: 4, remaining: 14 },
      maternityPaternity: { total: 90, used: 0, remaining: 90 },
    };
  }
}

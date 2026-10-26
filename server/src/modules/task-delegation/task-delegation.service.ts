import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTaskDelegationDto,
  UpdateTaskProgressDto,
  TaskFilterDto,
} from './task-delegation.dto';

export interface TaskDelegationRecord {
  id: string;
  taskCode: string;
  department: string;
  departmentLabel: string;
  managerId: string;
  managerName: string;
  managerRole: string;
  assistantId: string;
  assistantName: string;
  assistantRole: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'REJECTED';
  progressPercentage: number;
  dueDate: string;
  completedAt?: string | null;
  completionNotes?: string | null;
  reviewRemarks?: string | null;
  createdAt: string;
  updatedAt: string;
  progressLogs: {
    id: string;
    taskDelegationId: string;
    updatedBy: string;
    userRole: string;
    previousStatus: string;
    newStatus: string;
    previousProgress: number;
    newProgress: number;
    notes: string;
    timestamp: string;
  }[];
}

@Injectable()
export class TaskDelegationService {
  private readonly logger = new Logger(TaskDelegationService.name);

  // In-memory fallback and seed cache for real-time mobile manufacturing workflows
  private inMemoryTasks: TaskDelegationRecord[] = [
    {
      id: 'task-del-101',
      taskCode: 'DEL-2026-0101',
      department: 'SMT_PRODUCTION',
      departmentLabel: 'SMT & PCB Production',
      managerId: 'production',
      managerName: 'Rajesh Sharma',
      managerRole: 'SMT Floor Lead',
      assistantId: 'ast-prod-01',
      assistantName: 'Vikram Joshi',
      assistantRole: 'Assistant SMT Line Supervisor',
      title: 'Optimize Line 1 Solder Paste Stencil Alignment for Apex Precision Microprocessor',
      description: 'Perform optical AOI calibration on Line 1 solder paste deposition. Ensure zero solder bridging on micro-BGA pitch 0.35mm before starting 20k motherboard batch.',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      progressPercentage: 65,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      progressLogs: [
        {
          id: 'log-01',
          taskDelegationId: 'task-del-101',
          updatedBy: 'Rajesh Sharma',
          userRole: 'SMT Floor Lead',
          previousStatus: 'PENDING',
          newStatus: 'IN_PROGRESS',
          previousProgress: 0,
          newProgress: 20,
          notes: 'Task assigned and kickoff verified with calibration kit.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'log-02',
          taskDelegationId: 'task-del-101',
          updatedBy: 'Vikram Joshi',
          userRole: 'Assistant SMT Line Supervisor',
          previousStatus: 'IN_PROGRESS',
          newStatus: 'IN_PROGRESS',
          previousProgress: 20,
          newProgress: 65,
          notes: 'AOI vision cameras recalibrated. First 50 test coupons passed zero-defect solder thickness measurement.',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ],
    },
    {
      id: 'task-del-102',
      taskCode: 'DEL-2026-0102',
      department: 'WAREHOUSE_Serial UID',
      departmentLabel: 'Warehouse & Serial Registry',
      managerId: 'warehouse',
      managerName: 'Kavita Patel',
      managerRole: 'Warehouse Master Lead',
      assistantId: 'ast-wh-01',
      assistantName: 'Suresh Nair',
      assistantRole: 'Assistant Bins & Putaway Officer',
      title: 'Audit Dual-SIM TAC & Serial Allocations for Apex Pro Batch #48',
      description: 'Verify 15,000 dual-channel serial records matching GS1 Type Allocation Codes (TAC: 86420106 & 86420107). Reconcile laser barcode reel counts against secure vault inventory.',
      priority: 'HIGH',
      status: 'UNDER_REVIEW',
      progressPercentage: 90,
      dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      completionNotes: 'All 15,000 primary and secondary Serial UIDs matched in cryptographically signed ledger. Awaiting Manager sign-off.',
      progressLogs: [
        {
          id: 'log-03',
          taskDelegationId: 'task-del-102',
          updatedBy: 'Suresh Nair',
          userRole: 'Assistant Bins & Putaway Officer',
          previousStatus: 'IN_PROGRESS',
          newStatus: 'UNDER_REVIEW',
          previousProgress: 45,
          newProgress: 90,
          notes: 'Reconciliation finished. Serial sequences validated without duplicate check digit.',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
    },
    {
      id: 'task-del-103',
      taskCode: 'DEL-2026-0103',
      department: 'QUALITY_RF',
      departmentLabel: 'Quality Assurance & 5G RF',
      managerId: 'quality',
      managerName: 'Arun Verma',
      managerRole: 'Quality & RF Lead',
      assistantId: 'ast-qa-01',
      assistantName: 'Divya Sundaram',
      assistantRole: 'Assistant Optical & Testing Lead',
      title: 'Execute 5G mmWave Anechoic Chamber EIRP Radiation Certification',
      description: 'Run automated RF sweep test across 28GHz and 39GHz bands on 25 Apex Pro pilot units. Generate TRP/TIS EIRP polar antenna radiation patterns for FCC & CE conformance.',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      progressPercentage: 50,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      progressLogs: [
        {
          id: 'log-04',
          taskDelegationId: 'task-del-103',
          updatedBy: 'Divya Sundaram',
          userRole: 'Assistant Optical & Testing Lead',
          previousStatus: 'PENDING',
          newStatus: 'IN_PROGRESS',
          previousProgress: 0,
          newProgress: 50,
          notes: 'Sub-6GHz bands passed. Chamber configured for 28GHz mmWave dipole calibration.',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
      ],
    },
    {
      id: 'task-del-104',
      taskCode: 'DEL-2026-0104',
      department: 'SUPPLY_CHAIN',
      departmentLabel: 'Supply Chain & Sourcing',
      managerId: 'supply_chain',
      managerName: 'Pooja Deshmukh',
      managerRole: 'SCM Director',
      assistantId: 'ast-scm-01',
      assistantName: 'Rohan Mehta',
      assistantRole: 'Assistant Silicon Sourcing Specialist',
      title: 'Secure 45-Day Buffer for Sony IMX989 1-Inch Sensor Modules',
      description: 'Mitigate lead time surge from 4 to 8 weeks. Finalize air-cargo charter slot for 12,000 optical image stabilized sensor sub-assemblies with customs expedite.',
      priority: 'HIGH',
      status: 'COMPLETED',
      progressPercentage: 100,
      dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      completionNotes: 'Direct purchase contract and cargo booking confirmed via Tokyo Narita Express airfreight. Delivery scheduled into Dock Bay 2.',
      reviewRemarks: 'Excellent execution. Buffer secured well within Q4 production launch window.',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      progressLogs: [
        {
          id: 'log-05',
          taskDelegationId: 'task-del-104',
          updatedBy: 'Rohan Mehta',
          userRole: 'Assistant Silicon Sourcing Specialist',
          previousStatus: 'UNDER_REVIEW',
          newStatus: 'COMPLETED',
          previousProgress: 85,
          newProgress: 100,
          notes: 'Cargo airway bill #AWB-9042 received and verified.',
          timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        },
      ],
    },
    {
      id: 'task-del-105',
      taskCode: 'DEL-2026-0105',
      department: 'COMMERCIAL_FINANCE',
      departmentLabel: 'Finance & Accounts',
      managerId: 'finance',
      managerName: 'Amitabh Sen',
      managerRole: 'Commercial Finance Lead',
      assistantId: 'ast-fin-01',
      assistantName: 'Neha Kapoor',
      assistantRole: 'Assistant Cost Accountant',
      title: 'Recalculate Apex Lite BOM Landed Cost with Updated Precision Optics Tariffs',
      description: 'Incorporate new 2.5% customs duty surcharge on 6.67" 120Hz FHD+ flexible Precision Optics panels. Update target wholesale margin model to maintain 22.4% EBITDA.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      progressPercentage: 40,
      dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      progressLogs: [
        {
          id: 'log-06',
          taskDelegationId: 'task-del-105',
          updatedBy: 'Neha Kapoor',
          userRole: 'Assistant Cost Accountant',
          previousStatus: 'PENDING',
          newStatus: 'IN_PROGRESS',
          previousProgress: 0,
          newProgress: 40,
          notes: 'Duty schedule drafted and integrated into variance worksheet.',
          timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        },
      ],
    },
    {
      id: 'task-del-106',
      taskCode: 'DEL-2026-0106',
      department: 'MOBILE_ENGINEERING',
      departmentLabel: 'Design & Engineering',
      managerId: 'design',
      managerName: 'Siddharth Roy',
      managerRole: 'Hardware Engineering Lead',
      assistantId: 'ast-eng-01',
      assistantName: 'Ananya Iyer',
      assistantRole: 'Assistant CAD Drafter & Thermal Tech',
      title: 'ECN-892: Vapor Chamber Thickness Reduction & Graphite Sheet Fitment',
      description: 'Release 3D STEP and Gerber mechanical drawings adjusting vapor chamber clearance from 0.45mm to 0.38mm to accommodate 5,500mAh silicon-carbon battery pack.',
      priority: 'HIGH',
      status: 'PENDING',
      progressPercentage: 10,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      progressLogs: [
        {
          id: 'log-07',
          taskDelegationId: 'task-del-106',
          updatedBy: 'Siddharth Roy',
          userRole: 'Hardware Engineering Lead',
          previousStatus: 'PENDING',
          newStatus: 'PENDING',
          previousProgress: 0,
          newProgress: 10,
          notes: 'Initial CAD revision folder created in unibody enclosure vault.',
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
      ],
    },
    {
      id: 'task-del-107',
      taskCode: 'DEL-2026-0107',
      department: 'FLEET_LOGISTICS',
      departmentLabel: 'Fleet & Logistics',
      managerId: 'fleet',
      managerName: 'Girish Rao',
      managerRole: 'Fleet Transport Lead',
      assistantId: 'ast-flt-01',
      assistantName: 'Manish Tiwari',
      assistantRole: 'Assistant Dispatch Coordinator',
      title: 'GPS Geofence & Escort Route Planning for 50,000 Unit Metro Distribution',
      description: 'Assign 8 armored freight carriers with dual-SIM GPS trackers and RFID seal locks for inter-state retail shipment to 12 regional hub warehouses.',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      progressPercentage: 100,
      dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      completionNotes: 'All 8 trucks provisioned with panic beacons and highway highway clearance permits.',
      reviewRemarks: 'Route verified with zero deviation incidents.',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      progressLogs: [],
    },
    {
      id: 'task-del-108',
      taskCode: 'DEL-2026-0108',
      department: 'FIELD_SERVICE',
      departmentLabel: 'Field & Client Care',
      managerId: 'field_service',
      managerName: 'Dr. Sunita Kulkarni',
      managerRole: 'Field Service Lead',
      assistantId: 'ast-fld-01',
      assistantName: 'Harish Pillai',
      assistantRole: 'Assistant Warranty Claims Specialist',
      title: 'Dispatch 1,200 Precision Optics Screen Replacement Modules to Tier-1 Service Centers',
      description: 'Reconcile weekly RMA warranty claims. Package polarized anti-static display service kits with original optical adhesive for Mumbai and Bengaluru centers.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      progressPercentage: 55,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
      progressLogs: [],
    },
    {
      id: 'task-del-109',
      taskCode: 'DEL-2026-0109',
      department: 'HUMAN_RESOURCES',
      departmentLabel: 'Human Resources',
      managerId: 'hr',
      managerName: 'Deepak Chawla',
      managerRole: 'HR Lead',
      assistantId: 'ast-hr-01',
      assistantName: 'Priya Malhotra',
      assistantRole: 'Assistant Shift Rostering Officer',
      title: 'Conduct ESD & Cleanroom Class-100 Recertification for Shift B Technicians',
      description: 'Verify 84 assembly technicians pass static dissipation test (<10V body voltage) and particulate contamination hygiene protocols before Q4 overtime ramp-up.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      progressPercentage: 75,
      dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      progressLogs: [],
    },
  ];

  constructor(private readonly prisma?: PrismaService) {}

  /**
   * Universal Department Manager-to-Assistant Directory for all 21 ERP Roles
   */
  getDepartmentPairings() {
    return [
      {
        department: 'SMT_PRODUCTION',
        label: 'SMT & PCB Production',
        roleKey: 'production',
        manager: { id: 'production', name: 'Rajesh Sharma', role: 'SMT Floor Lead' },
        assistant: { id: 'ast-prod-01', name: 'Vikram Joshi', role: 'Assistant SMT Line Supervisor' },
      },
      {
        department: 'WAREHOUSE_Serial UID',
        label: 'Warehouse & Serial Registry',
        roleKey: 'warehouse',
        manager: { id: 'warehouse', name: 'Kavita Patel', role: 'Warehouse Master Lead' },
        assistant: { id: 'ast-wh-01', name: 'Suresh Nair', role: 'Assistant Bins & Putaway Officer' },
      },
      {
        department: 'QUALITY_RF',
        label: 'Quality Assurance & 5G RF',
        roleKey: 'quality',
        manager: { id: 'quality', name: 'Arun Verma', role: 'Quality & RF Lead' },
        assistant: { id: 'ast-qa-01', name: 'Divya Sundaram', role: 'Assistant Optical & Testing Lead' },
      },
      {
        department: 'SUPPLY_CHAIN',
        label: 'Supply Chain & Sourcing',
        roleKey: 'supply_chain',
        manager: { id: 'supply_chain', name: 'Pooja Deshmukh', role: 'SCM Director' },
        assistant: { id: 'ast-scm-01', name: 'Rohan Mehta', role: 'Assistant Silicon Sourcing Specialist' },
      },
      {
        department: 'COMMERCIAL_FINANCE',
        label: 'Finance & Accounts',
        roleKey: 'finance',
        manager: { id: 'finance', name: 'Amitabh Sen', role: 'Commercial Finance Lead' },
        assistant: { id: 'ast-fin-01', name: 'Neha Kapoor', role: 'Assistant Cost Accountant' },
      },
      {
        department: 'MOBILE_ENGINEERING',
        label: 'Design & Engineering',
        roleKey: 'design',
        manager: { id: 'design', name: 'Siddharth Roy', role: 'Hardware Engineering Lead' },
        assistant: { id: 'ast-eng-01', name: 'Ananya Iyer', role: 'Assistant CAD Drafter & Thermal Tech' },
      },
      {
        department: 'FLEET_LOGISTICS',
        label: 'Fleet & Logistics',
        roleKey: 'fleet',
        manager: { id: 'fleet', name: 'Girish Rao', role: 'Fleet Transport Lead' },
        assistant: { id: 'ast-flt-01', name: 'Manish Tiwari', role: 'Assistant Dispatch Coordinator' },
      },
      {
        department: 'FIELD_SERVICE',
        label: 'Field & Client Care',
        roleKey: 'field_service',
        manager: { id: 'field_service', name: 'Dr. Sunita Kulkarni', role: 'Field Service Lead' },
        assistant: { id: 'ast-fld-01', name: 'Harish Pillai', role: 'Assistant Warranty Claims Specialist' },
      },
      {
        department: 'HUMAN_RESOURCES',
        label: 'Human Resources',
        roleKey: 'hr',
        manager: { id: 'hr', name: 'Deepak Chawla', role: 'HR Lead' },
        assistant: { id: 'ast-hr-01', name: 'Priya Malhotra', role: 'Assistant Shift Rostering Officer' },
      },
      {
        department: 'PROCUREMENT',
        label: 'Procurement Specialist',
        roleKey: 'procurement',
        manager: { id: 'procurement', name: 'Naveen Singhal', role: 'Procurement Lead' },
        assistant: { id: 'ast-proc-01', name: 'Tarun Grover', role: 'Assistant Vendor Negotiator' },
      },
      {
        department: 'MARKETING_LAUNCH',
        label: 'Marketing & Brand Launch',
        roleKey: 'marketing',
        manager: { id: 'marketing', name: 'Ayesha Khan', role: 'Marketing Director' },
        assistant: { id: 'ast-mkt-01', name: 'Zeeshan Ali', role: 'Assistant Campaign Coordinator' },
      },
      {
        department: 'RETAIL_DISPATCH',
        label: 'Packaging & Dispatch',
        roleKey: 'dispatch',
        manager: { id: 'dispatch', name: 'Ramesh Yadav', role: 'Retail Dispatch Lead' },
        assistant: { id: 'ast-disp-01', name: 'Gaurav Chauhan', role: 'Assistant GS1 Barcode Supervisor' },
      },
      {
        department: 'ASSET_RELIABILITY',
        label: 'SMT Feeder & HVAC Reliability',
        roleKey: 'asset_reliability',
        manager: { id: 'asset_reliability', name: 'Praveen Hegde', role: 'Reliability Lead' },
        assistant: { id: 'ast-rel-01', name: 'Kiran Rao', role: 'Assistant Preventative Tech' },
      },
      {
        department: 'SUBCONTRACTING',
        label: 'Subcontracting & Flex Assembly',
        roleKey: 'subcontracting',
        manager: { id: 'subcontracting', name: 'Alok Dixit', role: 'Subcontracting Lead' },
        assistant: { id: 'ast-sub-01', name: 'Sachin Bansal', role: 'Assistant Job-Work Inspector' },
      },
      {
        department: 'OEM_CRM',
        label: 'Sales & OEM CRM',
        roleKey: 'crm',
        manager: { id: 'crm', name: 'Meera Nambiar', role: 'OEM Accounts Lead' },
        assistant: { id: 'ast-crm-01', name: 'Raghav Bhat', role: 'Assistant OEM Account Executive' },
      },
      {
        department: 'LOGISTICS_SECURITY',
        label: 'Logistics Gate & Security',
        roleKey: 'logistics',
        manager: { id: 'logistics', name: 'Balram Singh', role: 'Logistics Security Lead' },
        assistant: { id: 'ast-gate-01', name: 'Kuldeep Yadav', role: 'Assistant Dock Clearance Officer' },
      },
      {
        department: 'SHOP_FLOOR_ASSEMBLY',
        label: 'Cleanroom Bonding Operations',
        roleKey: 'plant_operator',
        manager: { id: 'plant_operator', name: 'Santosh Shinde', role: 'Assembly Floor Lead' },
        assistant: { id: 'ast-op-01', name: 'Karthik V', role: 'Assistant Line Trainer' },
      },
      {
        department: 'WORKFORCE_ALLOCATION',
        label: 'Line 1-6 Workforce Deployment',
        roleKey: 'department_workforce',
        manager: { id: 'department_workforce', name: 'Bhavna Saxena', role: 'Workforce Lead' },
        assistant: { id: 'ast-wf-01', name: 'Nitin Agarwal', role: 'Assistant Shift Allocator' },
      },
      {
        department: 'EQUIPMENT_MAINTENANCE',
        label: 'Robotic Nozzle Calibration',
        roleKey: 'maintenance_tech',
        manager: { id: 'maintenance_tech', name: 'Dinesh Pandey', role: 'Maintenance Master' },
        assistant: { id: 'ast-mt-01', name: 'Suraj Patil', role: 'Assistant Calibration Tech' },
      },
      {
        department: 'FACTORY_IT',
        label: 'Unit Serial Telemetry & Factory Cloud',
        roleKey: 'system_admin',
        manager: { id: 'system_admin', name: 'Kunal Sen', role: 'Factory IT Lead' },
        assistant: { id: 'ast-it-01', name: 'Devendra Rao', role: 'Assistant Edge Cluster Admin' },
      },
      {
        department: 'EXECUTIVE_MD',
        label: 'Top Management (Owner / MD)',
        roleKey: 'super_admin',
        manager: { id: 'super_admin', name: 'Dr. Rajesh (Owner / MD)', role: 'Chief Executive MD' },
        assistant: { id: 'ast-md-01', name: 'Chief Operating Officer (COO)', role: 'VP Operations & Delegation Officer' },
      },
    ];
  }

  /**
   * Create a new task delegation from Department Manager to Assistant Manager
   */
  async createTask(dto: CreateTaskDelegationDto): Promise<TaskDelegationRecord> {
    const taskSequence = Math.floor(1000 + Math.random() * 9000);
    const taskCode = `DEL-2026-${taskSequence}`;

    const newTask: TaskDelegationRecord = {
      id: `task-del-${Date.now()}`,
      taskCode,
      department: dto.department,
      departmentLabel: dto.departmentLabel || dto.department,
      managerId: dto.managerId,
      managerName: dto.managerName,
      managerRole: dto.managerRole,
      assistantId: dto.assistantId,
      assistantName: dto.assistantName,
      assistantRole: dto.assistantRole,
      title: dto.title,
      description: dto.description,
      priority: dto.priority || 'MEDIUM',
      status: 'PENDING',
      progressPercentage: 0,
      dueDate: dto.dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progressLogs: [
        {
          id: `log-${Date.now()}`,
          taskDelegationId: `task-del-${Date.now()}`,
          updatedBy: dto.managerName,
          userRole: dto.managerRole,
          previousStatus: 'PENDING',
          newStatus: 'PENDING',
          previousProgress: 0,
          newProgress: 0,
          notes: `Task created and assigned to ${dto.assistantName} (${dto.assistantRole}).`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // If Prisma is available, attempt database write
    if (this.prisma?.departmentTaskDelegation) {
      try {
        const created = await this.prisma.departmentTaskDelegation.create({
          data: {
            taskCode: newTask.taskCode,
            department: newTask.department,
            departmentLabel: newTask.departmentLabel,
            managerId: newTask.managerId,
            managerName: newTask.managerName,
            managerRole: newTask.managerRole,
            assistantId: newTask.assistantId,
            assistantName: newTask.assistantName,
            assistantRole: newTask.assistantRole,
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority as any,
            status: newTask.status as any,
            progressPercentage: 0,
            dueDate: new Date(newTask.dueDate),
            progressLogs: {
              create: {
                updatedBy: dto.managerName,
                userRole: dto.managerRole,
                previousStatus: 'PENDING',
                newStatus: 'PENDING',
                previousProgress: 0,
                newProgress: 0,
                notes: `Task created and assigned to ${dto.assistantName}.`,
              },
            },
          },
          include: {
            progressLogs: true,
          },
        });
        newTask.id = created.id;
      } catch (err) {
        this.logger.warn(`Prisma persist failed; stored in active cache: ${err?.message}`);
      }
    }

    this.inMemoryTasks.unshift(newTask);
    return newTask;
  }

  /**
   * Update task progress, status, completion notes, or review remarks
   */
  async updateProgress(id: string, dto: UpdateTaskProgressDto): Promise<TaskDelegationRecord> {
    const task = this.inMemoryTasks.find((t) => t.id === id || t.taskCode === id);
    if (!task) {
      throw new Error(`Delegation task with ID/Code '${id}' not found`);
    }

    const prevStatus = task.status;
    const prevProgress = task.progressPercentage;

    if (dto.status) task.status = dto.status;
    if (typeof dto.progressPercentage === 'number') {
      task.progressPercentage = Math.min(100, Math.max(0, dto.progressPercentage));
    }
    if (dto.completionNotes) task.completionNotes = dto.completionNotes;
    if (dto.reviewRemarks) task.reviewRemarks = dto.reviewRemarks;

    if (dto.status === 'COMPLETED' && !task.completedAt) {
      task.completedAt = new Date().toISOString();
      task.progressPercentage = 100;
    }

    task.updatedAt = new Date().toISOString();

    const logEntry = {
      id: `log-${Date.now()}`,
      taskDelegationId: task.id,
      updatedBy: dto.updatedBy || 'System Auditor',
      userRole: dto.userRole || 'Assistant Officer',
      previousStatus: prevStatus,
      newStatus: task.status,
      previousProgress: prevProgress,
      newProgress: task.progressPercentage,
      notes: dto.notes || `Progress updated to ${task.progressPercentage}% (${task.status}).`,
      timestamp: new Date().toISOString(),
    };

    task.progressLogs.push(logEntry);

    // Optional Prisma sync
    if (this.prisma?.departmentTaskDelegation) {
      try {
        await this.prisma.departmentTaskDelegation.update({
          where: { id: task.id },
          data: {
            status: task.status as any,
            progressPercentage: task.progressPercentage,
            completionNotes: task.completionNotes,
            reviewRemarks: task.reviewRemarks,
            completedAt: task.completedAt ? new Date(task.completedAt) : null,
          },
        });
        await this.prisma.departmentTaskProgressLog.create({
          data: {
            taskDelegationId: task.id,
            updatedBy: logEntry.updatedBy,
            userRole: logEntry.userRole,
            previousStatus: logEntry.previousStatus as any,
            newStatus: logEntry.newStatus as any,
            previousProgress: logEntry.previousProgress,
            newProgress: logEntry.newProgress,
            notes: logEntry.notes,
          },
        });
      } catch (err) {
        this.logger.warn(`Prisma update failed: ${err?.message}`);
      }
    }

    return task;
  }

  /**
   * Filter tasks by department, role, status, etc.
   */
  async getTasks(filters?: TaskFilterDto): Promise<TaskDelegationRecord[]> {
    let result = [...this.inMemoryTasks];

    if (filters?.department) {
      result = result.filter(
        (t) => t.department.toLowerCase() === filters.department.toLowerCase(),
      );
    }
    if (filters?.status) {
      result = result.filter((t) => t.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters?.priority) {
      result = result.filter((t) => t.priority.toLowerCase() === filters.priority.toLowerCase());
    }
    if (filters?.assistantId) {
      result = result.filter((t) => t.assistantId === filters.assistantId);
    }
    if (filters?.managerId) {
      result = result.filter((t) => t.managerId === filters.managerId);
    }

    return result;
  }

  /**
   * Get global oversight telemetry for Super Admin / Owner MD
   */
  async getGlobalSummary() {
    const total = this.inMemoryTasks.length;
    const completed = this.inMemoryTasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = this.inMemoryTasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const underReview = this.inMemoryTasks.filter((t) => t.status === 'UNDER_REVIEW').length;
    const pending = this.inMemoryTasks.filter((t) => t.status === 'PENDING').length;

    const now = new Date();
    const overdue = this.inMemoryTasks.filter(
      (t) => t.status !== 'COMPLETED' && new Date(t.dueDate) < now,
    ).length;

    // Cross-department breakdown
    const departmentMap: Record<
      string,
      {
        department: string;
        label: string;
        manager: string;
        assistant: string;
        total: number;
        completed: number;
        active: number;
        overdue: number;
        avgProgress: number;
        bottleneckRisk: 'LOW' | 'MEDIUM' | 'HIGH';
      }
    > = {};

    for (const t of this.inMemoryTasks) {
      if (!departmentMap[t.department]) {
        departmentMap[t.department] = {
          department: t.department,
          label: t.departmentLabel,
          manager: t.managerName,
          assistant: t.assistantName,
          total: 0,
          completed: 0,
          active: 0,
          overdue: 0,
          avgProgress: 0,
          bottleneckRisk: 'LOW',
        };
      }

      const dept = departmentMap[t.department];
      dept.total += 1;
      if (t.status === 'COMPLETED') dept.completed += 1;
      else dept.active += 1;

      if (t.status !== 'COMPLETED' && new Date(t.dueDate) < now) {
        dept.overdue += 1;
      }
    }

    // Calculate averages & bottleneck risk
    const departmentBreakdown = Object.values(departmentMap).map((dept) => {
      const deptTasks = this.inMemoryTasks.filter((t) => t.department === dept.department);
      const totalProg = deptTasks.reduce((acc, curr) => acc + curr.progressPercentage, 0);
      const avg = deptTasks.length ? Math.round(totalProg / deptTasks.length) : 0;
      dept.avgProgress = avg;

      if (dept.overdue > 0 || (dept.active > 2 && avg < 40)) {
        dept.bottleneckRisk = 'HIGH';
      } else if (dept.active > 0 && avg < 60) {
        dept.bottleneckRisk = 'MEDIUM';
      } else {
        dept.bottleneckRisk = 'LOW';
      }

      return dept;
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      kpis: {
        totalTasks: total,
        activeTasks: inProgress + underReview + pending,
        underReviewTasks: underReview,
        completedTasks: completed,
        overdueTasks: overdue,
        globalCompletionRate: `${completionRate}%`,
        activeDepartmentsCount: Object.keys(departmentMap).length,
      },
      priorityCounts: {
        critical: this.inMemoryTasks.filter((t) => t.priority === 'CRITICAL').length,
        high: this.inMemoryTasks.filter((t) => t.priority === 'HIGH').length,
        medium: this.inMemoryTasks.filter((t) => t.priority === 'MEDIUM').length,
        low: this.inMemoryTasks.filter((t) => t.priority === 'LOW').length,
      },
      departmentBreakdown,
      recentAuditLogs: this.inMemoryTasks
        .flatMap((t) =>
          t.progressLogs.map((l) => ({
            ...l,
            taskCode: t.taskCode,
            taskTitle: t.title,
            department: t.departmentLabel,
          })),
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8),
    };
  }
}

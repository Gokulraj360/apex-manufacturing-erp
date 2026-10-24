'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Plus,
  Sliders,
  Filter,
  UserCheck,
  Building2,
  Calendar,
  FileText,
  Search,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  ArrowUpRight,
  Sparkles,
  Layers,
  CheckSquare,
  MessageSquare,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// Types
export interface ProgressLog {
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
}

export interface TaskDelegationItem {
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
  progressLogs: ProgressLog[];
}

export interface DepartmentPairing {
  department: string;
  label: string;
  roleKey: string;
  manager: { id: string; name: string; role: string };
  assistant: { id: string; name: string; role: string };
}

// 21 Preconfigured Department Pairings matching all roles in Apex Enterprise ERP
const ALL_DEPARTMENT_PAIRINGS: DepartmentPairing[] = [
  {
    department: 'SMT_PRODUCTION',
    label: 'Precision SMT & PCB Assembly',
    roleKey: 'production',
    manager: { id: 'production', name: 'Rajesh Sharma', role: 'SMT Floor Lead' },
    assistant: { id: 'ast-prod-01', name: 'Vikram Joshi', role: 'Assistant SMT Line Supervisor' },
  },
  {
    department: 'WAREHOUSE_STOCK',
    label: 'Warehouse & Inventory Stock',
    roleKey: 'warehouse',
    manager: { id: 'warehouse', name: 'Kavita Patel', role: 'Warehouse Master Lead' },
    assistant: { id: 'ast-wh-01', name: 'Suresh Nair', role: 'Assistant Bins & Putaway Officer' },
  },
  {
    department: 'QUALITY_RF',
    label: 'Quality Assurance & Testing Bench',
    roleKey: 'quality',
    manager: { id: 'quality', name: 'Arun Verma', role: 'Quality & Diagnostics Lead' },
    assistant: { id: 'ast-qa-01', name: 'Divya Sundaram', role: 'Assistant Optical & Testing Lead' },
  },
  {
    department: 'SUPPLY_CHAIN',
    label: 'Supply Chain & Sourcing',
    roleKey: 'supply_chain',
    manager: { id: 'supply_chain', name: 'Pooja Deshmukh', role: 'SCM Director' },
    assistant: { id: 'ast-scm-01', name: 'Rohan Mehta', role: 'Assistant Sourcing Specialist' },
  },
  {
    department: 'COMMERCIAL_FINANCE',
    label: 'Finance & Accounts',
    roleKey: 'finance',
    manager: { id: 'finance', name: 'Amitabh Sen', role: 'Commercial Finance Lead' },
    assistant: { id: 'ast-fin-01', name: 'Neha Kapoor', role: 'Assistant Cost Accountant' },
  },
  {
    department: 'DESIGN_ENGINEERING',
    label: 'Design & Tooling Engineering',
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
    label: 'Factory Systems & IT Infrastructure',
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

// Initial realistic dataset
const INITIAL_TASKS: TaskDelegationItem[] = [
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
    title: 'Optimize Line 1 Solder Paste Stencil Alignment for Main System SoC',
    description: 'Perform optical AOI calibration on Line 1 solder paste deposition. Ensure zero solder bridging on micro-BGA pitch 0.35mm before starting 20k controller batch.',
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
    department: 'WAREHOUSE_STOCK',
    departmentLabel: 'Warehouse & Inventory Stock',
    managerId: 'warehouse',
    managerName: 'Kavita Patel',
    managerRole: 'Warehouse Master Lead',
    assistantId: 'ast-wh-01',
    assistantName: 'Suresh Nair',
    assistantRole: 'Assistant Bins & Putaway Officer',
    title: 'Audit Unit Serial & UID Tracking Allocations for Apex Batch #48',
    description: 'Verify 15,000 unit serial records matching GS1 Type Allocation Codes. Reconcile laser barcode reel counts against secure vault inventory.',
    priority: 'HIGH',
    status: 'UNDER_REVIEW',
    progressPercentage: 90,
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    completionNotes: 'All 15,000 primary and secondary IMEIs matched in cryptographically signed ledger. Awaiting Manager sign-off.',
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
    progressLogs: [],
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
    title: 'Recalculate Apex BOM Landed Cost with Updated Display Interface Tariffs',
    description: 'Incorporate new 2.5% customs duty surcharge on flexible optical display panels. Update target wholesale margin model to maintain 22.4% EBITDA.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    progressPercentage: 40,
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    progressLogs: [],
  },
  {
    id: 'task-del-106',
    taskCode: 'DEL-2026-0106',
    department: 'DESIGN_ENGINEERING',
    departmentLabel: 'Design & Tooling Engineering',
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
    progressLogs: [],
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
    title: 'Dispatch 1,200 OLED Screen Replacement Modules to Tier-1 Service Centers',
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

export default function TaskDelegationPage() {
  const { session } = useAuth();

  // Perspective View Selector: Super Admin (Owner/MD), Department Manager, or Assistant Manager
  const [activeRoleView, setActiveRoleView] = useState<'super_admin' | 'manager' | 'assistant'>('super_admin');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [tasks, setTasks] = useState<TaskDelegationItem[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDelegationItem | null>(null);

  // New Task Form State
  const [newTaskDept, setNewTaskDept] = useState(ALL_DEPARTMENT_PAIRINGS[0].department);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [newTaskDays, setNewTaskDays] = useState(3);

  // Progress Update Form State
  const [updateProgressVal, setUpdateProgressVal] = useState(50);
  const [updateStatusVal, setUpdateStatusVal] = useState<'PENDING' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'REJECTED'>('IN_PROGRESS');
  const [updateNotes, setUpdateNotes] = useState('');

  // Review & Sign-Off Form State
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Sync role view with authenticated session if non-super_admin
  useEffect(() => {
    if (session?.roleId && session.roleId !== 'super_admin') {
      const isAst = session.roleId.includes('ast') || session.roleId.includes('operator') || session.roleId.includes('tech');
      setActiveRoleView(isAst ? 'assistant' : 'manager');
      // Set department if matched
      const found = ALL_DEPARTMENT_PAIRINGS.find((p) => p.roleKey === session.roleId);
      if (found) {
        setSelectedDepartment(found.department);
      }
    }
  }, [session]);

  // Fetch live tasks from backend API if available
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/task-delegation');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setTasks(json.data);
          }
        }
      } catch {
        // Fallback to initial seed
      }
    };
    fetchTasks();
  }, []);

  // Filter tasks based on filters and search
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Department filter
      if (selectedDepartment !== 'ALL' && t.department !== selectedDepartment) {
        return false;
      }
      // Priority filter
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'ALL' && t.status !== statusFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesCode = t.taskCode.toLowerCase().includes(q);
        const matchesDept = t.departmentLabel.toLowerCase().includes(q);
        const matchesAssignee = t.assistantName.toLowerCase().includes(q) || t.managerName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesDept && !matchesAssignee) return false;
      }
      return true;
    });
  }, [tasks, selectedDepartment, priorityFilter, statusFilter, searchQuery]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const underReview = tasks.filter((t) => t.status === 'UNDER_REVIEW').length;
    const pending = tasks.filter((t) => t.status === 'PENDING').length;

    const now = new Date();
    const overdue = tasks.filter((t) => t.status !== 'COMPLETED' && new Date(t.dueDate) < now).length;
    const critical = tasks.filter((t) => t.priority === 'CRITICAL' && t.status !== 'COMPLETED').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, underReview, pending, overdue, critical, completionRate };
  }, [tasks]);

  // Active pairing info for creation modal
  const activeCreationPairing = useMemo(() => {
    return (
      ALL_DEPARTMENT_PAIRINGS.find((p) => p.department === newTaskDept) ||
      ALL_DEPARTMENT_PAIRINGS[0]
    );
  }, [newTaskDept]);

  // Handler: Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const pairing = activeCreationPairing;
    const dueDate = new Date(Date.now() + 86400000 * newTaskDays).toISOString();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newTaskCode = `DEL-2026-${randomSeq}`;

    const newTaskItem: TaskDelegationItem = {
      id: `task-del-${Date.now()}`,
      taskCode: newTaskCode,
      department: pairing.department,
      departmentLabel: pairing.label,
      managerId: pairing.manager.id,
      managerName: pairing.manager.name,
      managerRole: pairing.manager.role,
      assistantId: pairing.assistant.id,
      assistantName: pairing.assistant.name,
      assistantRole: pairing.assistant.role,
      title: newTaskTitle,
      description: newTaskDesc,
      priority: newTaskPriority,
      status: 'PENDING',
      progressPercentage: 0,
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progressLogs: [
        {
          id: `log-${Date.now()}`,
          taskDelegationId: `task-del-${Date.now()}`,
          updatedBy: pairing.manager.name,
          userRole: pairing.manager.role,
          previousStatus: 'PENDING',
          newStatus: 'PENDING',
          previousProgress: 0,
          newProgress: 0,
          notes: `Task created and assigned to ${pairing.assistant.name} (${pairing.assistant.role}).`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setTasks((prev) => [newTaskItem, ...prev]);
    setIsCreateModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');

    // Attempt API persistence
    try {
      await fetch('/api/task-delegation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: pairing.department,
          departmentLabel: pairing.label,
          managerId: pairing.manager.id,
          managerName: pairing.manager.name,
          managerRole: pairing.manager.role,
          assistantId: pairing.assistant.id,
          assistantName: pairing.assistant.name,
          assistantRole: pairing.assistant.role,
          title: newTaskItem.title,
          description: newTaskItem.description,
          priority: newTaskPriority,
          dueDate,
        }),
      });
    } catch {
      // Local state is already updated
    }
  };

  // Handler: Open Update Progress Modal
  const openProgressModal = (task: TaskDelegationItem) => {
    setSelectedTask(task);
    setUpdateProgressVal(task.progressPercentage);
    setUpdateStatusVal(task.status);
    setUpdateNotes('');
    setIsUpdateModalOpen(true);
  };

  // Handler: Save Progress Update
  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    const prevProg = selectedTask.progressPercentage;
    const prevStat = selectedTask.status;
    const isCompleted = updateStatusVal === 'COMPLETED';

    const logEntry: ProgressLog = {
      id: `log-${Date.now()}`,
      taskDelegationId: selectedTask.id,
      updatedBy: selectedTask.assistantName,
      userRole: selectedTask.assistantRole,
      previousStatus: prevStat,
      newStatus: updateStatusVal,
      previousProgress: prevProg,
      newProgress: updateProgressVal,
      notes: updateNotes || `Milestone adjusted to ${updateProgressVal}% (${updateStatusVal}).`,
      timestamp: new Date().toISOString(),
    };

    const updatedList = tasks.map((t) => {
      if (t.id === selectedTask.id) {
        return {
          ...t,
          status: updateStatusVal,
          progressPercentage: updateProgressVal,
          completedAt: isCompleted ? new Date().toISOString() : t.completedAt,
          completionNotes: updateNotes ? updateNotes : t.completionNotes,
          updatedAt: new Date().toISOString(),
          progressLogs: [logEntry, ...(t.progressLogs || [])],
        };
      }
      return t;
    });

    setTasks(updatedList);
    setIsUpdateModalOpen(false);

    // Call API
    try {
      await fetch(`/api/task-delegation/${selectedTask.id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateStatusVal,
          progressPercentage: updateProgressVal,
          notes: updateNotes,
          updatedBy: selectedTask.assistantName,
          userRole: selectedTask.assistantRole,
          completionNotes: updateNotes,
        }),
      });
    } catch {
      // State already maintained
    }
  };

  // Handler: Open Review Modal
  const openReviewModal = (task: TaskDelegationItem) => {
    setSelectedTask(task);
    setReviewRemarks('');
    setIsReviewModalOpen(true);
  };

  // Handler: Sign Off Task (Manager or Super Admin)
  const handleSignOffTask = async (decision: 'COMPLETED' | 'REJECTED') => {
    if (!selectedTask) return;

    const logEntry: ProgressLog = {
      id: `log-${Date.now()}`,
      taskDelegationId: selectedTask.id,
      updatedBy: selectedTask.managerName,
      userRole: selectedTask.managerRole,
      previousStatus: selectedTask.status,
      newStatus: decision,
      previousProgress: selectedTask.progressPercentage,
      newProgress: decision === 'COMPLETED' ? 100 : selectedTask.progressPercentage,
      notes: reviewRemarks || (decision === 'COMPLETED' ? 'Manager verified and approved completion.' : 'Returned for rework.'),
      timestamp: new Date().toISOString(),
    };

    const updatedList = tasks.map((t) => {
      if (t.id === selectedTask.id) {
        return {
          ...t,
          status: decision,
          progressPercentage: decision === 'COMPLETED' ? 100 : t.progressPercentage,
          completedAt: decision === 'COMPLETED' ? new Date().toISOString() : null,
          reviewRemarks: reviewRemarks || (decision === 'COMPLETED' ? 'Approved by Department Manager' : 'Rework requested'),
          updatedAt: new Date().toISOString(),
          progressLogs: [logEntry, ...(t.progressLogs || [])],
        };
      }
      return t;
    });

    setTasks(updatedList);
    setIsReviewModalOpen(false);

    try {
      await fetch(`/api/task-delegation/${selectedTask.id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decision,
          progressPercentage: decision === 'COMPLETED' ? 100 : selectedTask.progressPercentage,
          reviewRemarks: reviewRemarks,
          updatedBy: selectedTask.managerName,
          userRole: selectedTask.managerRole,
        }),
      });
    } catch {
      // State maintained
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner & Perspective Switcher */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm flex-shrink-0">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Task Assignments & Team Work Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  All 21 Teams Supported
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Department Managers can assign daily tasks to Assistant Managers, track progress from 0% to 100%, and help the Owner monitor all factory departments.
              </p>
            </div>
          </div>

          {/* Perspective View Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 self-start lg:self-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 hidden sm:inline">
              Active Mode:
            </span>
            <button
              type="button"
              onClick={() => setActiveRoleView('super_admin')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                activeRoleView === 'super_admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Plant Work Overview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleView('manager')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                activeRoleView === 'manager'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Department Manager</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleView('assistant')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                activeRoleView === 'assistant'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Assistant Manager Desk</span>
            </button>
          </div>
        </div>

        {/* Action Bar & Quick Delegate CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {activeRoleView === 'super_admin' && 'Viewing: Full Factory Work Overview (All 21 Departments)'}
              {activeRoleView === 'manager' && 'Viewing: Manager Workspace (Assign Tasks & Sign Off Completed Work)'}
              {activeRoleView === 'assistant' && 'Viewing: Assistant Manager Desk (Update Progress & Submit for Review)'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shadow-blue-500/20 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task to Assistant</span>
          </button>
        </div>
      </div>

      {/* 2. Global KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1: Total Tasks */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Total Tasks Assigned</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across 21 Departments</div>
        </div>

        {/* KPI 2: Active / In Progress */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {stats.inProgress}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active assembly floor jobs</div>
        </div>

        {/* KPI 3: Under Review (Awaiting Sign-Off) */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Awaiting Manager Approval</span>
            <AlertTriangle className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            {stats.underReview}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Needs Manager sign-off</div>
        </div>

        {/* KPI 4: Completed */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {stats.completed}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            {stats.completionRate}% completed
          </div>
        </div>

        {/* KPI 5: Critical Priority */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">High Urgency Tasks</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
            {stats.critical}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Needs quick action</div>
        </div>

        {/* KPI 6: Overdue Bottlenecks */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Delayed Tasks</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
            {stats.overdue}
          </div>
          <div className="text-[11px] text-rose-500 mt-0.5">Work delay warning</div>
        </div>
      </div>

      {/* 3. Super Admin Executive Overview (Cross-Department Health Matrix) */}
      {activeRoleView === 'super_admin' && (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                Department Work Health & Delay Checker
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live check across all 21 departments. Click any department to filter and see its assigned tasks.
              </p>
            </div>
            {selectedDepartment !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('ALL')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 self-start"
              >
                <span>Clear Department Filter</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ALL_DEPARTMENT_PAIRINGS.slice(0, 9).map((pair) => {
              const deptTasks = tasks.filter((t) => t.department === pair.department);
              const deptCompleted = deptTasks.filter((t) => t.status === 'COMPLETED').length;
              const deptTotal = deptTasks.length;
              const avgProg = deptTotal > 0
                ? Math.round(deptTasks.reduce((acc, c) => acc + c.progressPercentage, 0) / deptTotal)
                : 0;
              const hasCritical = deptTasks.some((t) => t.priority === 'CRITICAL' && t.status !== 'COMPLETED');
              const isSelected = selectedDepartment === pair.department;

              return (
                <div
                  key={pair.department}
                  onClick={() => setSelectedDepartment(isSelected ? 'ALL' : pair.department)}
                  className={cn(
                    'p-3.5 rounded-xl border transition-all cursor-pointer select-none',
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {pair.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{pair.manager.name}</span>
                        {' ➔ '}
                        <span>{pair.assistant.name}</span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-semibold border',
                        hasCritical
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800'
                          : avgProg >= 70
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                      )}
                    >
                      {hasCritical ? 'CRITICAL RISK' : avgProg >= 70 ? 'HEALTHY' : 'IN WORK'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>{deptCompleted} / {deptTotal} Jobs Done</span>
                      <span className="font-semibold">{avgProg}% Avg</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          avgProg === 100
                            ? 'bg-emerald-500'
                            : avgProg >= 50
                            ? 'bg-blue-500'
                            : 'bg-amber-500',
                        )}
                        style={{ width: `${avgProg}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Filter Toolbar & Search */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, task code, manager, or assistant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Department Filter dropdown */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">All Departments (21 Total)</option>
            {ALL_DEPARTMENT_PAIRINGS.map((p) => (
              <option key={p.department} value={p.department}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="UNDER_REVIEW">Awaiting Review</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* 5. Delegated Tasks Table / Workspace */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Delegated Operational Directives ({filteredTasks.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Real-time synchronization active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold select-none">
                <th className="py-3 px-4">Task Code</th>
                <th className="py-3 px-4">Task & Description</th>
                <th className="py-3 px-4">Department & Assigned Team</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Progress & Status</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No tasks match the selected search or filter.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isOverdue =
                    task.status !== 'COMPLETED' && new Date(task.dueDate) < new Date();

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {task.taskCode}
                      </td>

                      {/* Title & Desc */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 dark:text-white leading-snug">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {task.description}
                        </div>
                        {task.completionNotes && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 italic mt-1 bg-emerald-50/60 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50">
                            Notes: {task.completionNotes}
                          </div>
                        )}
                        {task.reviewRemarks && (
                          <div className="text-[10px] text-blue-600 dark:text-blue-400 italic mt-1 bg-blue-50/60 dark:bg-blue-950/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50">
                            Sign-Off: {task.reviewRemarks}
                          </div>
                        )}
                      </td>

                      {/* Department & Chain of Command */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {task.departmentLabel}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Mgr: <span className="text-slate-700 dark:text-slate-300 font-medium">{task.managerName}</span>
                        </div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400">
                          Ast: <span>{task.assistantName}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold border inline-flex items-center gap-1',
                            task.priority === 'CRITICAL' &&
                              'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800',
                            task.priority === 'HIGH' &&
                              'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800',
                            task.priority === 'MEDIUM' &&
                              'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800',
                            task.priority === 'LOW' &&
                              'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                          )}
                        >
                          {task.priority === 'CRITICAL' && <Flame className="w-3 h-3 text-red-500" />}
                          {task.priority}
                        </span>
                      </td>

                      {/* Status & Progress Slider/Pill */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                              task.status === 'COMPLETED' &&
                                'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800',
                              task.status === 'UNDER_REVIEW' &&
                                'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800',
                              task.status === 'IN_PROGRESS' &&
                                'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800',
                              task.status === 'PENDING' &&
                                'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                            )}
                          >
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {task.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-28 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              task.progressPercentage === 100
                                ? 'bg-emerald-500'
                                : task.progressPercentage >= 50
                                ? 'bg-blue-500'
                                : 'bg-amber-500',
                            )}
                            style={{ width: `${task.progressPercentage}%` }}
                          />
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div
                          className={cn(
                            'text-[11px] font-medium flex items-center gap-1',
                            isOverdue
                              ? 'text-red-600 dark:text-red-400 font-semibold'
                              : 'text-slate-600 dark:text-slate-400',
                          )}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        {isOverdue && (
                          <span className="text-[10px] text-red-500 font-bold block">
                            OVERDUE
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Assistant Manager progress adjuster button */}
                          <button
                            type="button"
                            onClick={() => openProgressModal(task)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors"
                            title="Update progress percentage or submit notes"
                          >
                            Update Progress
                          </button>

                          {/* Department Manager Review / Sign-off button */}
                          {task.status === 'UNDER_REVIEW' && (
                            <button
                              type="button"
                              onClick={() => openReviewModal(task)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                            >
                              Sign Off
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Recent Delegation Milestone Audit Feed */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Activity Logs & System Checks (Approved Sign-Offs)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Live Activity Log
          </span>
        </div>

        <div className="space-y-3">
          {tasks
            .flatMap((t) =>
              (t.progressLogs || []).map((l) => ({
                ...l,
                taskCode: t.taskCode,
                taskTitle: t.title,
                departmentLabel: t.departmentLabel,
              })),
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5)
            .map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-50/75 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {log.updatedBy}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({log.userRole})
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {log.taskCode}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      {log.notes}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {log.previousProgress}% ➔ <span className="font-semibold text-emerald-600 dark:text-emerald-400">{log.newProgress}%</span> | Status: {log.newStatus}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 whitespace-nowrap pl-4">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* MODAL 1: Delegate New Task Form */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Assign Task to Assistant Manager
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select department team and write clear task instructions.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              {/* Department Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department & Team
                </label>
                <select
                  value={newTaskDept}
                  onChange={(e) => setNewTaskDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  {ALL_DEPARTMENT_PAIRINGS.map((p) => (
                    <option key={p.department} value={p.department}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Automatic Chain-of-Command Display */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200/60 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Assigning Manager:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activeCreationPairing.manager.name}
                  </span>
                  <span className="text-slate-500 block text-[10px]">
                    {activeCreationPairing.manager.role}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Assigned Assistant:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {activeCreationPairing.assistant.name}
                  </span>
                  <span className="text-slate-500 block text-[10px]">
                    {activeCreationPairing.assistant.role}
                  </span>
                </div>
              </div>

              {/* Task Title */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clean & calibrate robotic assembly nozzle for batch release"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Details & Work Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain what needs to be done, safety requirements, and expected results..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Priority & Due Date Days */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate)</option>
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                    <option value="LOW">LOW Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Timeline (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newTaskDays}
                    onChange={(e) => setNewTaskDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Assistant Progress Update Form */}
      {isUpdateModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Update Task Progress
                </h3>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                  {selectedTask.taskCode}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs mb-4">
              <div className="font-semibold text-slate-900 dark:text-white">
                {selectedTask.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Assignee: <span className="text-blue-600 font-medium">{selectedTask.assistantName}</span>
              </div>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-4 text-xs">
              {/* Progress Slider (0-100%) */}
              <div>
                <div className="flex justify-between items-center mb-1 font-semibold text-slate-700 dark:text-slate-300">
                  <span>Progress Completion</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {updateProgressVal}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={updateProgressVal}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setUpdateProgressVal(val);
                    if (val === 100) setUpdateStatusVal('UNDER_REVIEW');
                    else if (val > 0) setUpdateStatusVal('IN_PROGRESS');
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Status Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={updateStatusVal}
                  onChange={(e) => setUpdateStatusVal(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="UNDER_REVIEW">Submit For Review (Awaiting Sign-Off)</option>
                  <option value="COMPLETED">Completed Directly</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Progress Notes & Work Update
                </label>
                <textarea
                  rows={3}
                  placeholder="Record completed milestones, inspection readings, or issues..."
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
                >
                  Save Progress Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Manager Sign-Off / Review */}
      {isReviewModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Manager Review & Approval
                </h3>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                  {selectedTask.taskCode}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs mb-4 space-y-1.5">
              <div className="font-semibold text-slate-900 dark:text-white">
                {selectedTask.title}
              </div>
              <div className="text-slate-500">
                Submitted by: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedTask.assistantName}</span>
              </div>
              {selectedTask.completionNotes && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded border border-emerald-100 dark:border-emerald-900/40">
                  Assistant Notes: {selectedTask.completionNotes}
                </div>
              )}
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Manager Comments / Feedback
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Checked work quality. Approved for today's batch."
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSignOffTask('REJECTED')}
                  className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors"
                >
                  Send Back for Changes
                </button>
                <button
                  type="button"
                  onClick={() => handleSignOffTask('COMPLETED')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Task</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

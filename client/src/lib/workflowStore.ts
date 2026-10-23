/**
 * Apex Enterprise Cross-Role Workflow & Approval Orchestration Engine
 * 
 * Provides reactive, synchronized cross-role request routing:
 * - Employee Leave / Overtime (My Workspace) -> Route to Manager / Approvals
 * - Purchase Order Requisitions (Procurement) -> Route to Finance / Top Management
 * - Engineering Change Orders (Hardware R&D) -> Route to Chief Engineer / Quality Lead
 * - Scrap & Discrepancy Authorizations (Quality) -> Route to Plant Operations VP
 * - Capital Expenditure Approvals (Manufacturing) -> Route to Top Management / Board
 * 
 * Synchronizes across browser tabs and role changes via localStorage and CustomEvents.
 */

export type WorkflowCategory = 
  | 'HR_LEAVE' 
  | 'HR_OVERTIME' 
  | 'PURCHASE_ORDER' 
  | 'CAPEX' 
  | 'ECN_ECO' 
  | 'QUALITY_SCRAP'
  | 'BREAK_GLASS_ACCESS';

export type WorkflowPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type WorkflowStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';

export interface WorkflowItem {
  id: string;
  category: WorkflowCategory;
  title: string;
  department: string;
  targetRole: string; // e.g., 'plant_manager', 'super_admin', 'finance_manager', 'quality_lead'
  requester: {
    name: string;
    role: string;
    roleId: string;
    avatar: string;
    email?: string;
  };
  valueOrImpact: string;
  submittedAt: string;
  deadlineHoursRemaining: number;
  priority: WorkflowPriority;
  details: {
    justification: string;
    affectedSystem: string;
    lineItemsCount?: number;
    glAccount?: string;
    metadata?: Record<string, any>;
  };
  status: WorkflowStatus;
  decisionNotes?: string;
  decidedBy?: string;
  decidedAt?: string;
}

const STORAGE_KEY = 'apex_enterprise_workflow_items';
const EVENT_NAME = 'apex_workflow_updated';

export const INITIAL_SEEDED_REQUESTS: WorkflowItem[] = [
  {
    id: 'APP-2026-0891',
    category: 'CAPEX',
    title: 'SMT Line #4 Automated Optical Inspection (AOI) Upgrade',
    department: 'Manufacturing Engineering',
    targetRole: 'super_admin',
    requester: {
      name: 'Dr. Evelyn Vance',
      role: 'Principal Process Engineer',
      roleId: 'production_supervisor',
      avatar: 'EV',
    },
    valueOrImpact: '$185,000.00',
    submittedAt: '2026-10-22 08:30 AM',
    deadlineHoursRemaining: 6,
    priority: 'CRITICAL',
    details: {
      justification: 'Replacement of end-of-life 2D AOI system with 3D high-speed laser interferometer to reduce false call rates from 4.2% to <0.3%.',
      affectedSystem: 'SMT Cleanroom Bay 4',
      glAccount: 'GL-15200 (Machinery & Capital Equipment)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0892',
    category: 'PURCHASE_ORDER',
    title: 'Bulk Silicon Wafer Raw Substrates (Quarterly Blanket PO)',
    department: 'Procurement & Sourcing',
    targetRole: 'finance_manager',
    requester: {
      name: 'Marcus Brody',
      role: 'Senior Sourcing Manager',
      roleId: 'procurement_officer',
      avatar: 'MB',
    },
    valueOrImpact: '$412,500.00',
    submittedAt: '2026-10-22 07:15 AM',
    deadlineHoursRemaining: 14,
    priority: 'HIGH',
    details: {
      justification: 'Quarterly supply agreement with SilicTech Global for 300mm ultra-pure polished prime wafers. Tier 1 volume discount of 8.5% locked.',
      affectedSystem: 'Substrate Inventory Silo 1',
      lineItemsCount: 8,
      glAccount: 'GL-50100 (Direct Materials Inventory)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0893',
    category: 'ECN_ECO',
    title: 'ECN-7804: Thermal Heat-Sink Fin Geometry Refinement',
    department: 'Hardware R&D',
    targetRole: 'quality_lead',
    requester: {
      name: 'Claire Chen',
      role: 'Lead Thermal Architect',
      roleId: 'engineer',
      avatar: 'CC',
    },
    valueOrImpact: 'BOM Cost Neutral / +8.2°C Thermal Margin',
    submittedAt: '2026-10-21 16:45 PM',
    deadlineHoursRemaining: 28,
    priority: 'HIGH',
    details: {
      justification: 'Modifies copper extruded fin density from 14 FPI to 18 FPI to prevent throttling at 45°C ambient. Fully tested in wind tunnel rig.',
      affectedSystem: 'Apex Industrial Gateway Gen 3',
      lineItemsCount: 3,
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0894',
    category: 'QUALITY_SCRAP',
    title: 'Disposal Scrap Authorization: Batch #PCB-9821 Soldering Bridging',
    department: 'Quality Assurance',
    targetRole: 'super_admin',
    requester: {
      name: 'David O\'Connor',
      role: 'Plant QA Lead',
      roleId: 'quality_lead',
      avatar: 'DO',
    },
    valueOrImpact: '$18,450.00 (620 Motherboard Units)',
    submittedAt: '2026-10-22 09:10 AM',
    deadlineHoursRemaining: 4,
    priority: 'CRITICAL',
    details: {
      justification: 'Irreparable micro-bridging beneath 1156-pin BGA processor package caused by nitrogen wave solder temperature excursion.',
      affectedSystem: 'Assembly Line B',
      glAccount: 'GL-64200 (Scrap & Spoilage Expense)',
    },
    status: 'PENDING',
  },
  {
    id: 'APP-2026-0895',
    category: 'HR_LEAVE',
    title: 'Extended Medical & Paternity Leave Request (4 Weeks)',
    department: 'Plant Operations',
    targetRole: 'production_supervisor',
    requester: {
      name: 'Rajesh Patel',
      role: 'Senior CNC Machinist',
      roleId: 'operator',
      avatar: 'RP',
    },
    valueOrImpact: '160 Production Hours (Relief Staff Assigned)',
    submittedAt: '2026-10-20 11:00 AM',
    deadlineHoursRemaining: 42,
    priority: 'NORMAL',
    details: {
      justification: 'Statutory family leave. Cross-trained relief machinist (Aaron Miller) scheduled for CNC Cell 3 with zero line disruption.',
      affectedSystem: 'Machining Hall Shift A',
    },
    status: 'PENDING',
  },
];

class WorkflowService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public getAll(): WorkflowItem[] {
    if (!this.isBrowser()) return INITIAL_SEEDED_REQUESTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_REQUESTS));
        return INITIAL_SEEDED_REQUESTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SEEDED_REQUESTS;
    }
  }

  public getByRequester(roleIdOrName: string): WorkflowItem[] {
    const all = this.getAll();
    return all.filter(
      (item) =>
        item.requester.roleId === roleIdOrName ||
        item.requester.name.toLowerCase() === roleIdOrName.toLowerCase()
    );
  }

  public getPendingForApprover(roleId?: string): WorkflowItem[] {
    const all = this.getAll();
    if (!roleId || roleId === 'super_admin' || roleId === 'top_management') {
      return all;
    }
    // Filter items where targetRole matches or generic for this department
    return all.filter((item) => {
      if (item.targetRole === roleId) return true;
      if (roleId === 'finance_manager' && (item.category === 'PURCHASE_ORDER' || item.category === 'CAPEX')) return true;
      if (roleId === 'production_supervisor' && (item.category === 'HR_LEAVE' || item.category === 'HR_OVERTIME')) return true;
      if (roleId === 'quality_lead' && (item.category === 'ECN_ECO' || item.category === 'QUALITY_SCRAP')) return true;
      return false;
    });
  }

  public createRequest(item: Omit<WorkflowItem, 'id' | 'submittedAt' | 'status'> & { id?: string }): WorkflowItem {
    const all = this.getAll();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newItem: WorkflowItem = {
      ...item,
      id: item.id || `REQ-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: formattedDate,
      status: 'PENDING',
    };

    const updated = [newItem, ...all];
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newItem }));
      } catch (e) {
        console.error('Failed to persist workflow request to localStorage', e);
      }
    }
    return newItem;
  }

  public updateStatus(
    id: string,
    status: WorkflowStatus,
    notes?: string,
    decidedBy: string = 'Supervisory Authority'
  ): WorkflowItem | null {
    const all = this.getAll();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    let updatedItem: WorkflowItem | null = null;
    const updated = all.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          status,
          decisionNotes: notes || item.decisionNotes,
          decidedBy,
          decidedAt: formattedDate,
        };
        return updatedItem;
      }
      return item;
    });

    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { id, status, updatedItem } }));
      } catch (e) {
        console.error('Failed to update workflow item status in localStorage', e);
      }
    }
    return updatedItem;
  }

  public resetToDefault(): WorkflowItem[] {
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_REQUESTS));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: INITIAL_SEEDED_REQUESTS }));
      } catch (e) {
        console.error('Failed to reset workflow items', e);
      }
    }
    return INITIAL_SEEDED_REQUESTS;
  }
}

export const workflowStore = new WorkflowService();

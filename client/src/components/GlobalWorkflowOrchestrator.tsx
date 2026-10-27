'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Download,
  SlidersHorizontal,
  ChevronDown,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  workflowStore,
  WorkflowItem,
  WorkflowPriority,
  WorkflowCategory,
  RoleActionPreset,
} from '@/lib/workflowStore';
import { generateAndDownloadWordDoc } from '@/lib/wordDocumentGenerator';

export function GlobalWorkflowOrchestrator() {
  const router = useRouter();
  const { session } = useAuth();
  const activeRoleId = session?.roleId || 'super_admin';

  // Live Workflow State
  const [pendingApprovals, setPendingApprovals] = useState<WorkflowItem[]>([]);
  const [myRequests, setMyRequests] = useState<WorkflowItem[]>([]);
  const [rolePresets, setRolePresets] = useState<RoleActionPreset[]>([]);

  // Modals & Flyouts
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isApprovalsDrawerOpen, setIsApprovalsDrawerOpen] = useState(false);
  const [isMyRequestsDrawerOpen, setIsMyRequestsDrawerOpen] = useState(false);
  const [requestTab, setRequestTab] = useState<'PRESETS' | 'CUSTOM'>('PRESETS');

  // Custom Request Form State
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<WorkflowCategory>('CAPEX');
  const [customTargetRole, setCustomTargetRole] = useState('super_admin');
  const [customImpact, setCustomImpact] = useState('$25,000.00 USD');
  const [customJustification, setCustomJustification] = useState('');
  const [customPriority, setCustomPriority] = useState<WorkflowPriority>('HIGH');
  const [customSystem, setCustomSystem] = useState('Central Factory Operations');

  // Decision Modal State inside Drawer
  const [actionItem, setActionItem] = useState<WorkflowItem | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize with WorkflowStore
  useEffect(() => {
    const syncState = () => {
      const pending = workflowStore.getPendingForApprover(activeRoleId);
      const mine = workflowStore.getByRequester(activeRoleId);
      const presets = workflowStore.getPresetsForRole(activeRoleId);

      setPendingApprovals(pending);
      setMyRequests(mine);
      setRolePresets(presets);
    };

    syncState();
    window.addEventListener('apex_workflow_updated', syncState);
    window.addEventListener('storage', syncState);
    return () => {
      window.removeEventListener('apex_workflow_updated', syncState);
      window.removeEventListener('storage', syncState);
    };
  }, [activeRoleId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleLaunchPreset = (preset: RoleActionPreset) => {
    const newItem = workflowStore.createRequest({
      category: preset.category,
      title: preset.title,
      department: preset.department,
      targetRole: preset.targetRole,
      targetRoleName: preset.targetRoleName,
      requester: {
        name: session?.username || 'Authorized Role Operator',
        role: session?.roleName || activeRoleId,
        roleId: activeRoleId,
        avatar: (session?.username || 'OP').slice(0, 2).toUpperCase(),
        email: `${activeRoleId}@apex-mfg.internal`,
      },
      valueOrImpact: preset.valueOrImpact,
      deadlineHoursRemaining: preset.priority === 'CRITICAL' ? 8 : 24,
      priority: preset.priority,
      details: {
        justification: preset.defaultJustification,
        affectedSystem: preset.affectedSystem,
        glAccount: preset.glAccount,
      },
    });

    setIsRequestModalOpen(false);
    showToast(`Request ${newItem.id} created! Routed to ${preset.targetRoleName} for hierarchical approval.`);
  };

  const handleCreateCustomRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customJustification) return;

    const newItem = workflowStore.createRequest({
      category: customCategory,
      title: customTitle,
      department: session?.department || 'Operations',
      targetRole: customTargetRole,
      requester: {
        name: session?.username || 'Authorized Operator',
        role: session?.roleName || activeRoleId,
        roleId: activeRoleId,
        avatar: (session?.username || 'OP').slice(0, 2).toUpperCase(),
      },
      valueOrImpact: customImpact,
      deadlineHoursRemaining: customPriority === 'CRITICAL' ? 6 : 24,
      priority: customPriority,
      details: {
        justification: customJustification,
        affectedSystem: customSystem,
      },
    });

    setIsRequestModalOpen(false);
    setCustomTitle('');
    setCustomJustification('');
    showToast(`Custom Action ${newItem.id} submitted! Routed to supervisor inbox.`);
  };

  const handleExecuteDecision = (id: string, status: 'APPROVED' | 'REJECTED') => {
    const approverName = session?.roleId === 'super_admin' ? 'Dr. Rajesh (Owner / MD)' : session?.roleName || 'Supervisory Authority';
    workflowStore.updateStatus(id, status, decisionNotes || `Sign-off granted by ${approverName}`, approverName);
    setActionItem(null);
    setDecisionNotes('');
    showToast(`Request ${id} marked ${status} by ${approverName}. Originating role notified.`);
  };

  const handleDownloadDossier = (item: WorkflowItem) => {
    generateAndDownloadWordDoc(`Apex_Hierarchical_Dossier_${item.id}`, {
      title: `OFFICIAL HIERARCHICAL REQUISITION & EXECUTIVE APPROVAL DOSSIER: ${item.id}`,
      documentRef: `EXEC-WF-${item.id}`,
      classification: item.priority === 'CRITICAL' ? 'RESTRICTED // BOARD LEVEL AUDIT RECORD' : 'ENTERPRISE OPERATIONAL RECORD',
      department: item.department,
      author: `${item.requester.name} (${item.requester.role})`,
      summary: `Hierarchical operational action ${item.title}. Requisitioned under ${item.category} with financial / resource exposure of ${item.valueOrImpact}. Justification: ${item.details.justification}`,
      sections: [
        {
          heading: '1. Requisition Scope & Governance Profile',
          table: {
            headers: ['Attribute', 'Verified Parameter', 'Governance Code', 'Status'],
            rows: [
              ['Requisition Identifier', item.id, item.category, item.status],
              ['Requesting Party', `${item.requester.name} (${item.requester.role})`, item.requester.roleId, 'VERIFIED'],
              ['Target Approving Authority', item.targetRoleName || item.targetRole, 'Level 2 Authorization', 'ROUTED'],
              ['Resource / Financial Exposure', item.valueOrImpact, item.details.glAccount || 'GL-77200', 'AUDITED'],
              ['Operational Plant System', item.details.affectedSystem, 'Active Production Line', 'COMMITTED'],
            ],
          },
          callout: {
            title: 'Hierarchical Operational Mandate',
            text: item.details.justification,
            type: item.priority === 'CRITICAL' ? 'warning' : 'info',
          },
        },
        {
          heading: '2. Multi-Signatory Execution & Decision Audit Trail',
          content: [
            `This transaction was routed through the Apex Cross-Role Hierarchical Engine pursuant to Sarbanes-Oxley (SOX) Section 404 and ISO 9001:2015 Clause 5.3.`,
            item.status === 'APPROVED'
              ? `Decision: Fully Approved and Signed by ${item.decidedBy || 'Supervisory Authority'} at ${item.decidedAt || 'Verified Timestamp'}. Notes: ${item.decisionNotes || 'Conforms with operational budget.'}`
              : item.status === 'REJECTED'
              ? `Decision: Rejected by ${item.decidedBy || 'Supervisory Authority'} at ${item.decidedAt || 'Verified Timestamp'}. Notes: ${item.decisionNotes || 'Insufficient operational justification.'}`
              : 'Decision: Currently Pending in Supervisory Approver Queue.',
          ],
        },
      ],
      signatories: [
        {
          name: item.requester.name,
          role: item.requester.role,
          organization: 'Apex Manufacturing Technologies Inc.',
          signatureDate: item.submittedAt.split(' ')[0],
        },
        {
          name: item.decidedBy || 'Pending Supervisory Authority',
          role: item.targetRoleName || 'Target Approver',
          organization: 'Apex Manufacturing Technologies Inc.',
          signatureDate: item.decidedAt ? item.decidedAt.split(' ')[0] : 'Pending',
        },
      ],
    });
  };

  const isSupervisorOrAdmin =
    activeRoleId === 'super_admin' ||
    activeRoleId === 'finance' ||
    activeRoleId === 'production' ||
    activeRoleId === 'quality' ||
    activeRoleId === 'supply_chain' ||
    activeRoleId === 'hr';

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl border border-purple-500/40 text-xs font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md">
          <div className="p-1 rounded-full bg-purple-500/20 text-purple-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1">{toastMessage}</div>
        </div>
      )}

      {/* Header Quick Action Triggers */}
      <div className="flex items-center">
        {/* Approvals Bell (Supervisor / Top Management) */}
        {isSupervisorOrAdmin && (
          <button
            onClick={() => setIsApprovalsDrawerOpen(true)}
            className={`relative p-2 rounded-xl transition-all border ${
              pendingApprovals.length > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={`Approvals Inbox: ${pendingApprovals.length} pending items`}
          >
            <Bell className="w-4 h-4" />
            {pendingApprovals.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                {pendingApprovals.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* MODAL: SUBMIT CROSS-ROLE ACTION */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Submit Operational Request for Hierarchical Approval
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active Submitter: <strong className="text-purple-600">{session?.roleName || activeRoleId}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <button
                onClick={() => setRequestTab('PRESETS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  requestTab === 'PRESETS'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Role Presets ({rolePresets.length})
              </button>
              <button
                onClick={() => setRequestTab('CUSTOM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  requestTab === 'CUSTOM'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Custom Requisition
              </button>
            </div>

            {/* TAB 1: ROLE PRESETS */}
            {requestTab === 'PRESETS' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Select a pre-configured operational action for your role. It will automatically dispatch to your designated supervisor and top management:
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {rolePresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:border-purple-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900 dark:text-white">
                            {preset.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              preset.priority === 'CRITICAL'
                                ? 'bg-rose-500/10 text-rose-600'
                                : preset.priority === 'HIGH'
                                ? 'bg-amber-500/10 text-amber-600'
                                : 'bg-blue-500/10 text-blue-600'
                            }`}
                          >
                            {preset.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {preset.defaultJustification}
                        </div>
                        <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                          Routes to: <strong>{preset.targetRoleName}</strong> • Impact: <strong>{preset.valueOrImpact}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLaunchPreset(preset)}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        Submit <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOM FORM */}
            {requestTab === 'CUSTOM' && (
              <form onSubmit={handleCreateCustomRequest} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Action / Requisition Title
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g., Emergency Spare Part Purchase Order or Overtime Authorization"
                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e: any) => setCustomCategory(e.target.value)}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                    >
                      <option value="PURCHASE_ORDER">Purchase Order (PO)</option>
                      <option value="CAPEX">Capital Expenditure (CapEx)</option>
                      <option value="ECN_ECO">Engineering Change Order (ECN)</option>
                      <option value="QUALITY_SCRAP">Quality Scrap Mandate</option>
                      <option value="HR_LEAVE">Leave & Absence Pass</option>
                      <option value="HR_OVERTIME">Overtime Hours Authorization</option>
                      <option value="INVENTORY_WRITEOFF">Inventory Variance Write-Off</option>
                      <option value="MAINTENANCE_OVERHAUL">Machine Breakdown Overhaul</option>
                      <option value="DISCOUNT_EXCEPTION">Wholesale Discount Override</option>
                      <option value="WARRANTY_CLAIM">Warranty Replacement Claim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Designated Approver (Supervisor)
                    </label>
                    <select
                      value={customTargetRole}
                      onChange={(e) => setCustomTargetRole(e.target.value)}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                    >
                      <option value="super_admin">Top Management (Owner / MD)</option>
                      <option value="finance">Factory Accounts & Finance Lead</option>
                      <option value="production">Precision Assembly & Production Lead</option>
                      <option value="quality">Quality Assurance & Testing Lead</option>
                      <option value="supply_chain">Material Planning & Sourcing Lead</option>
                      <option value="asset_reliability">Machine Maintenance Lead</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Financial / Operational Impact
                    </label>
                    <input
                      type="text"
                      value={customImpact}
                      onChange={(e) => setCustomImpact(e.target.value)}
                      placeholder="e.g. $45,000.00 USD or 16 Production Hours"
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={customPriority}
                      onChange={(e: any) => setCustomPriority(e.target.value)}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                    >
                      <option value="CRITICAL">Critical (&lt; 8h SLA)</option>
                      <option value="HIGH">High Priority (24h SLA)</option>
                      <option value="NORMAL">Normal Priority (48h SLA)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operational Justification & Context
                  </label>
                  <textarea
                    value={customJustification}
                    onChange={(e) => setCustomJustification(e.target.value)}
                    rows={3}
                    placeholder="Provide full technical or commercial justification for supervisor sign-off..."
                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 cursor-pointer"
                  >
                    Dispatch for Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FLYOUT DRAWER: PENDING APPROVALS (SUPERVISOR / TOP MANAGEMENT) */}
      {isApprovalsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0d1322] w-full max-w-lg h-full border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Executive Approvals & Governance Inbox
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pending sign-offs assigned to: <strong className="text-purple-600">{session?.roleName || activeRoleId}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsApprovalsDrawerOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    All clear! Zero pending approvals.
                  </div>
                  <p className="text-xs">
                    When subordinate roles submit leave, POs, or ECNs, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                          {item.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.priority === 'CRITICAL'
                              ? 'bg-rose-500/10 text-rose-600 animate-pulse'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {item.category.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {item.details.justification}
                      </p>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                        <span>By: <strong>{item.requester.name}</strong> ({item.requester.role})</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.valueOrImpact}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => handleDownloadDossier(item)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                        >
                          <Download className="w-3 h-3" /> Dossier (.doc)
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleExecuteDecision(item.id, 'REJECTED')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold shadow-sm cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleExecuteDecision(item.id, 'APPROVED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold shadow-sm cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsApprovalsDrawerOpen(false);
                  router.push('/approvals');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <span>Go to Dedicated Approvals Hub (/approvals)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLYOUT DRAWER: MY REQUESTS TRACKER */}
      {isMyRequestsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0d1322] w-full max-w-md h-full border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      My Outgoing Requisitions
                    </h2>
                    <p className="text-xs text-slate-500">Live Status Tracking for {session?.roleName || activeRoleId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMyRequestsDrawerOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {myRequests.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No active requests submitted by your role yet. Click "+ Request Approval" to initiate one.
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {req.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : req.status === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {req.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Target Approver: <strong>{req.targetRoleName || req.targetRole}</strong>
                      </div>
                      {req.decisionNotes && (
                        <div className="p-2 rounded bg-white dark:bg-slate-900 text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                          <strong>Note from Approver:</strong> {req.decisionNotes} ({req.decidedBy})
                        </div>
                      )}
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => handleDownloadDossier(req)}
                          className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                        >
                          <Download className="w-3 h-3" /> Download Signed Dossier (.doc)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsMyRequestsDrawerOpen(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

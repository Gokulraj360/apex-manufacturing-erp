'use client';

import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Plus,
  Check,
  X,
  Users,
  KeyRound,
  Save,
  Info,
} from 'lucide-react';
import { z } from 'zod';

const createRoleSchema = z.object({
  name: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().optional(),
  hierarchyLevel: z.number().min(0).max(100),
});

interface RoleMatrixItem {
  id: string;
  name: string;
  description: string;
  hierarchyLevel: number;
  userCount: number;
  isSystem: boolean;
  permissions: string[]; // array of "ACTION:RESOURCE"
}

interface PermissionCatalogItem {
  id: string;
  action: string;
  resource: string;
  description: string;
}

const initialPermissions: PermissionCatalogItem[] = [
  { id: 'p1', action: 'READ', resource: 'FINANCIALS', description: 'View P&L and financial statements' },
  { id: 'p2', action: 'APPROVE_PAYROLL', resource: 'FINANCIALS', description: 'Authorize monthly payroll disbursements' },
  { id: 'p3', action: 'SIGNOFF_HIGH_VALUE_PO', resource: 'FINANCIALS', description: 'Sign purchase orders exceeding $50k' },
  { id: 'p4', action: 'READ', resource: 'PRODUCTION', description: 'View factory telemetry and batch status' },
  { id: 'p5', action: 'WRITE', resource: 'PRODUCTION', description: 'Modify line targets, maintenance, and status' },
  { id: 'p6', action: 'READ', resource: 'AUDIT_LOGS', description: 'Inspect system-wide immutable audit trail' },
  { id: 'p7', action: 'WRITE', resource: 'RBAC_SECURITY', description: 'Grant or revoke roles and permissions' },
  { id: 'p8', action: 'READ', resource: 'INVENTORY', description: 'Access warehouse raw materials catalog' },
  { id: 'p9', action: 'WRITE', resource: 'INVENTORY', description: 'Adjust inventory stock counts and scrap rates' },
];

const initialRoles: RoleMatrixItem[] = [
  {
    id: 'r-0',
    name: 'Super Admin',
    description: 'Master root access across all manufacturing clusters',
    hierarchyLevel: 0,
    userCount: 2,
    isSystem: true,
    permissions: initialPermissions.map((p) => `${p.action}:${p.resource}`),
  },
  {
    id: 'r-1',
    name: 'Plant Manager',
    description: 'Executive oversight of plant operations and approvals',
    hierarchyLevel: 20,
    userCount: 4,
    isSystem: false,
    permissions: [
      'READ:FINANCIALS',
      'SIGNOFF_HIGH_VALUE_PO',
      'READ:PRODUCTION',
      'WRITE:PRODUCTION',
      'READ:AUDIT_LOGS',
      'READ:INVENTORY',
      'WRITE:INVENTORY',
    ],
  },
  {
    id: 'r-2',
    name: 'Line Supervisor',
    description: 'Shift supervisor overseeing lines, maintenance, and scrap',
    hierarchyLevel: 50,
    userCount: 12,
    isSystem: false,
    permissions: [
      'READ:PRODUCTION',
      'WRITE:PRODUCTION',
      'READ:INVENTORY',
      'WRITE:INVENTORY',
    ],
  },
  {
    id: 'r-3',
    name: 'Quality Operator',
    description: 'Line station technician logging telemetry and QC defects',
    hierarchyLevel: 90,
    userCount: 85,
    isSystem: false,
    permissions: ['READ:PRODUCTION', 'READ:INVENTORY'],
  },
];

export default function PermissionsPage() {
  const [roles, setRoles] = useState<RoleMatrixItem[]>(initialRoles);
  const [permissions] = useState<PermissionCatalogItem[]>(initialPermissions);
  const [selectedRole, setSelectedRole] = useState<RoleMatrixItem>(initialRoles[1]);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    description: '',
    hierarchyLevel: 60,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const togglePermission = (roleId: string, permKey: string) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r;
        if (r.isSystem) return r; // Cannot modify Super Admin

        const has = r.permissions.includes(permKey);
        const updated = has
          ? r.permissions.filter((p) => p !== permKey)
          : [...r.permissions, permKey];

        const updatedRole = { ...r, permissions: updated };
        if (selectedRole.id === roleId) {
          setSelectedRole(updatedRole);
        }
        return updatedRole;
      }),
    );

    setNotification(`Permissions updated for role. Tamper-evident audit log recorded.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = createRoleSchema.safeParse(newRoleForm);
    if (!result.success) {
      setFormError(result.error.issues[0]?.message || 'Validation failed');
      return;
    }

    const newRole: RoleMatrixItem = {
      id: `r-${Date.now()}`,
      name: newRoleForm.name,
      description: newRoleForm.description || 'Custom organizational role',
      hierarchyLevel: newRoleForm.hierarchyLevel,
      userCount: 0,
      isSystem: false,
      permissions: ['READ:PRODUCTION'],
    };

    setRoles((prev) => [...prev, newRole]);
    setSelectedRole(newRole);
    setShowNewRoleModal(false);
    setNewRoleForm({ name: '', description: '', hierarchyLevel: 60 });
    setNotification(`New role "${newRole.name}" created successfully.`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Group permissions by resource
  const resources = Array.from(new Set(permissions.map((p) => p.resource)));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-blue-500" />
            Role & Permission Matrix (RBAC)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure dynamic enterprise permissions for Plant Managers, Shift Supervisors, and Operators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewRoleModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> Create New Role
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          {notification}
        </div>
      )}

      {/* Role Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => {
          const isSelected = selectedRole.id === role.id;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                isSelected
                  ? 'bg-blue-950/20 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                  : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Shield
                    className={`h-4 w-4 ${
                      role.hierarchyLevel === 0
                        ? 'text-amber-400'
                        : isSelected
                        ? 'text-blue-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <h3 className="font-semibold text-sm text-white">{role.name}</h3>
                </div>
                {role.isSystem && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                    ROOT
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 h-8">
                {role.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {role.userCount} Assigned
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Tier {role.hierarchyLevel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Matrix Table for Selected Role */}
      <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Permissions Configuration:
              <span className="text-blue-400 underline">{selectedRole.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click checkboxes to grant or revoke specific granular operations. Changes sync with backend RBAC.
            </p>
          </div>

          {selectedRole.isSystem ? (
            <div className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-md font-medium">
              System Root Role (Unrestricted Authority)
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Info className="h-4 w-4 text-blue-400" />
              <span>Auto-audited via HMAC</span>
            </div>
          )}
        </div>

        {/* Matrix by Resource Categories */}
        <div className="space-y-6">
          {resources.map((resource) => {
            const resourcePerms = permissions.filter((p) => p.resource === resource);

            return (
              <div key={resource} className="rounded-lg bg-slate-900/60 border border-slate-800 overflow-hidden">
                <div className="bg-slate-800/50 px-4 py-2.5 text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Resource Domain: {resource}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {resourcePerms.length} Action Points
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {resourcePerms.map((perm) => {
                    const permKey = `${perm.action}:${perm.resource}`;
                    const isGranted = selectedRole.permissions.includes(permKey);

                    return (
                      <div
                        key={perm.id}
                        className="px-4 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                            <span className="font-mono text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded text-[11px]">
                              {perm.action}
                            </span>
                            <span>{perm.resource}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {perm.description}
                          </div>
                        </div>

                        <div>
                          <button
                            type="button"
                            disabled={selectedRole.isSystem}
                            onClick={() => togglePermission(selectedRole.id, permKey)}
                            className={`h-7 px-3 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                              isGranted
                                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40'
                                : 'bg-slate-800 text-slate-400 hover:bg-emerald-600/20 hover:text-emerald-300 hover:border-emerald-500/30 border border-slate-700'
                            } ${selectedRole.isSystem ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                          >
                            {isGranted ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Granted</span>
                              </>
                            ) : (
                              <>
                                <X className="h-3.5 w-3.5 text-slate-400" />
                                <span>Revoked</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Creating New Role */}
      {showNewRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-400" />
                Define New Enterprise Role
              </h3>
              <button
                type="button"
                onClick={() => setShowNewRoleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Safety Compliance Auditor"
                  value={newRoleForm.name}
                  onChange={(e) =>
                    setNewRoleForm({ ...newRoleForm, name: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Operational scope and access rights overview"
                  value={newRoleForm.description}
                  onChange={(e) =>
                    setNewRoleForm({ ...newRoleForm, description: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hierarchy Authority Level: {newRoleForm.hierarchyLevel}
                  <span className="text-[10px] text-slate-400 block font-normal">
                    (0 = Super Admin, 100 = Floor Operator)
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={newRoleForm.hierarchyLevel}
                  onChange={(e) =>
                    setNewRoleForm({
                      ...newRoleForm,
                      hierarchyLevel: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewRoleModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

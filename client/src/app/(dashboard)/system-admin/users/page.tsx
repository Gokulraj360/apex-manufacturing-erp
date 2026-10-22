'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  UserCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Key,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Check,
  RotateCcw,
} from 'lucide-react';
import { SystemUserItem, SystemRolePermissionItem } from '@/types/system-admin';

const INITIAL_USERS: SystemUserItem[] = [
  {
    id: 'usr-1',
    email: 'admin@apex-mfg.local',
    firstName: 'System',
    lastName: 'Administrator',
    isActive: true,
    roleId: 'role-superadmin',
    role: { id: 'role-superadmin', name: 'SUPER_ADMIN', description: 'Unrestricted System Authority', hierarchyLevel: 0 },
    userAccount: {
      id: 'ua-1',
      userId: 'usr-1',
      mfaEnabled: true,
      lastLoginAt: '2026-10-07 16:45',
      lastLoginIp: '192.168.1.10',
      failedLoginAttempts: 0,
      isLocked: false,
      forcePasswordChange: false,
      sessionTimeoutMinutes: 60,
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '2026-01-01',
    updatedAt: '',
  },
  {
    id: 'usr-2',
    email: 'plant.mgr@apex-mfg.local',
    firstName: 'Sunil',
    lastName: 'Rao',
    isActive: true,
    roleId: 'role-plant-mgr',
    role: { id: 'role-plant-mgr', name: 'PRODUCTION_MANAGER', description: 'Shop floor, work orders, BOM recipes', hierarchyLevel: 10 },
    userAccount: {
      id: 'ua-2',
      userId: 'usr-2',
      mfaEnabled: true,
      lastLoginAt: '2026-10-07 14:20',
      lastLoginIp: '192.168.1.45',
      failedLoginAttempts: 0,
      isLocked: false,
      forcePasswordChange: false,
      sessionTimeoutMinutes: 120,
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '2026-02-15',
    updatedAt: '',
  },
  {
    id: 'usr-3',
    email: 'finance.lead@apex-mfg.local',
    firstName: 'Priya',
    lastName: 'Nambiar',
    isActive: true,
    roleId: 'role-fin-mgr',
    role: { id: 'role-fin-mgr', name: 'FINANCE_MANAGER', description: 'Dual-ledger, 3-way match, payables/receivables', hierarchyLevel: 10 },
    userAccount: {
      id: 'ua-3',
      userId: 'usr-3',
      mfaEnabled: true,
      lastLoginAt: '2026-10-07 11:15',
      lastLoginIp: '192.168.1.80',
      failedLoginAttempts: 0,
      isLocked: false,
      forcePasswordChange: false,
      sessionTimeoutMinutes: 45,
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '2026-02-20',
    updatedAt: '',
  },
  {
    id: 'usr-4',
    email: 'security.gate@apex-mfg.local',
    firstName: 'Harish',
    lastName: 'Guard',
    isActive: true,
    roleId: 'role-security',
    role: { id: 'role-security', name: 'SECURITY_OFFICER', description: 'Gate access, weighbridge, outbound seals', hierarchyLevel: 50 },
    userAccount: {
      id: 'ua-4',
      userId: 'usr-4',
      mfaEnabled: false,
      lastLoginAt: '2026-10-07 08:30',
      lastLoginIp: '10.0.10.4',
      failedLoginAttempts: 2,
      isLocked: false,
      forcePasswordChange: true,
      sessionTimeoutMinutes: 480,
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '2026-05-10',
    updatedAt: '',
  },
];

const INITIAL_PERMISSIONS: SystemRolePermissionItem[] = [
  { id: 'perm-1', roleName: 'PRODUCTION_MANAGER', resource: 'PRODUCTION', action: 'CREATE', isAllowed: true, scope: 'ALL', createdAt: '', updatedAt: '' },
  { id: 'perm-2', roleName: 'PRODUCTION_MANAGER', resource: 'PRODUCTION', action: 'APPROVE', isAllowed: true, scope: 'ALL', createdAt: '', updatedAt: '' },
  { id: 'perm-3', roleName: 'PRODUCTION_MANAGER', resource: 'FINANCE', action: 'WRITE', isAllowed: false, scope: 'NONE', createdAt: '', updatedAt: '' },
  { id: 'perm-4', roleName: 'FINANCE_MANAGER', resource: 'FINANCE', action: 'APPROVE', isAllowed: true, scope: 'ALL', createdAt: '', updatedAt: '' },
  { id: 'perm-5', roleName: 'FINANCE_MANAGER', resource: 'PRODUCTION', action: 'EXECUTE', isAllowed: false, scope: 'NONE', createdAt: '', updatedAt: '' },
  { id: 'perm-6', roleName: 'SECURITY_OFFICER', resource: 'LOGISTICS', action: 'CREATE', isAllowed: true, scope: 'ASSIGNED_GATE', createdAt: '', updatedAt: '' },
];

export default function UserAccountsPage() {
  const [activeTab, setActiveTab] = useState<'USERS' | 'MATRIX'>('USERS');
  const [users, setUsers] = useState<SystemUserItem[]>(INITIAL_USERS);
  const [permissions, setPermissions] = useState<SystemRolePermissionItem[]>(INITIAL_PERMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUserItem | null>(null);

  // New user form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    roleName: 'PRODUCTION_MANAGER',
    password: '',
    mfaEnabled: true,
    sessionTimeoutMinutes: 60,
  });

  // Reset password form state
  const [newPassword, setNewPassword] = useState('');
  const [forceChange, setForceChange] = useState(true);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    const newUser: SystemUserItem = {
      id: `usr-${Date.now()}`,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      isActive: true,
      roleId: `role-${formData.roleName.toLowerCase()}`,
      role: {
        id: `role-${formData.roleName.toLowerCase()}`,
        name: formData.roleName,
        hierarchyLevel: 20,
      },
      userAccount: {
        id: `ua-${Date.now()}`,
        userId: `usr-${Date.now()}`,
        mfaEnabled: formData.mfaEnabled,
        failedLoginAttempts: 0,
        isLocked: false,
        forcePasswordChange: true,
        sessionTimeoutMinutes: Number(formData.sessionTimeoutMinutes),
        createdAt: '',
        updatedAt: '',
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: '',
    };

    setUsers([newUser, ...users]);
    setIsCreateModalOpen(false);
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      roleName: 'PRODUCTION_MANAGER',
      password: '',
      mfaEnabled: true,
      sessionTimeoutMinutes: 60,
    });
  };

  const handleToggleLock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              isActive: !u.isActive,
              userAccount: u.userAccount
                ? { ...u.userAccount, isLocked: !u.userAccount.isLocked }
                : undefined,
            }
          : u,
      ),
    );
  };

  const handleTogglePermission = (permId: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === permId ? { ...p, isAllowed: !p.isAllowed } : p)),
    );
  };

  const openResetModal = (user: SystemUserItem) => {
    setSelectedUser(user);
    setNewPassword('TempPass#2026!');
    setIsResetModalOpen(true);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    alert(`Password successfully updated for ${selectedUser.email}. Forced change on next login: ${forceChange}`);
    setIsResetModalOpen(false);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      (u.role?.name && u.role.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/system-admin" className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Infrastructure Command
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">User Access & Security</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            User Account Management & Granular RBAC Console
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage system logins, enforce Multi-Factor Authentication (MFA), configure permission matrix, and revoke access instantly.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          Provision User Account
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'USERS'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          Active User Directory ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'MATRIX'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          Granular Permission Matrix ({permissions.length})
        </button>
      </div>

      {/* Tab 1: Users Table */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm">
            <div className="relative flex-1 sm:w-80">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search user email, name, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 w-full transition"
              />
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Identity Provider: Local OAuth & JWT Synced</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-3 font-semibold">User & Identity</th>
                    <th className="py-3 px-3 font-semibold">Assigned System Role</th>
                    <th className="py-3 px-3 font-semibold">MFA Security</th>
                    <th className="py-3 px-3 font-semibold">Account Status</th>
                    <th className="py-3 px-3 font-semibold">Last Login Telemetry</th>
                    <th className="py-3 px-3 font-semibold">Session TTL</th>
                    <th className="py-3 px-3 font-semibold text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white tracking-wide">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-slate-900 border border-rose-200 dark:border-slate-700 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                          {u.role?.name}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {u.userAccount?.mfaEnabled ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-medium">
                            <ShieldCheck className="h-3 w-3" />
                            MFA Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                            MFA Disabled
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {u.isActive && !u.userAccount?.isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30 font-bold">
                            <ShieldAlert className="h-3 w-3" />
                            Revoked / Locked
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div>{u.userAccount?.lastLoginAt || 'Never'}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">IP: {u.userAccount?.lastLoginIp || '---'}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {u.userAccount?.sessionTimeoutMinutes} mins
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openResetModal(u)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium inline-flex items-center gap-1 transition"
                            title="Reset Password"
                          >
                            <Key className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                            Reset Key
                          </button>

                          <button
                            onClick={() => handleToggleLock(u.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition ${
                              u.isActive && !u.userAccount?.isLocked
                                ? 'bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30'
                                : 'bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                            }`}
                          >
                            {u.isActive && !u.userAccount?.isLocked ? 'Revoke Access' : 'Reactivate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Granular RBAC Matrix */}
      {activeTab === 'MATRIX' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">Granular System Capability & Resource Access Matrix</span>
            <span className="text-slate-500 dark:text-slate-400">Enforced by RBACGuard Middleware</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3 font-semibold">System Role</th>
                  <th className="py-3 px-3 font-semibold">Target Domain Resource</th>
                  <th className="py-3 px-3 font-semibold">Action Capability</th>
                  <th className="py-3 px-3 font-semibold">Enforced Scope</th>
                  <th className="py-3 px-3 font-semibold">Authorization Policy</th>
                  <th className="py-3 px-3 font-semibold text-right">Toggle Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {permissions.map((perm) => (
                  <tr key={perm.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{perm.roleName}</td>
                    <td className="py-3 px-3 font-mono text-cyan-700 dark:text-cyan-300">{perm.resource}</td>
                    <td className="py-3 px-3 font-mono text-amber-700 dark:text-amber-300">{perm.action}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{perm.scope}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          perm.isAllowed
                            ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                            : 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30'
                        }`}
                      >
                        {perm.isAllowed ? 'ALLOWED' : 'DENIED'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleTogglePermission(perm.id)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition"
                      >
                        {perm.isAllowed ? 'Revoke Rule' : 'Grant Rule'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provision User Account Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Provision User Account & RBAC Role</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="user@apex-mfg.local"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned Role</label>
                  <select
                    value={formData.roleName}
                    onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full Root)</option>
                    <option value="PRODUCTION_MANAGER">PRODUCTION_MANAGER</option>
                    <option value="WAREHOUSE_SUPERVISOR">WAREHOUSE_SUPERVISOR</option>
                    <option value="QUALITY_INSPECTOR">QUALITY_INSPECTOR</option>
                    <option value="FINANCE_MANAGER">FINANCE_MANAGER</option>
                    <option value="SECURITY_OFFICER">SECURITY_OFFICER</option>
                    <option value="HR_GENERALIST">HR_GENERALIST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Temporary Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Initial password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chkMfa"
                    checked={formData.mfaEnabled}
                    onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 text-rose-600 focus:ring-0"
                  />
                  <label htmlFor="chkMfa" className="text-xs text-slate-700 dark:text-slate-200 cursor-pointer">
                    Enforce Multi-Factor Authentication (MFA / Authenticator App)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium shadow-md shadow-rose-600/30 transition"
                >
                  Create & Issue Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Reset Password for {selectedUser.email}</h3>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">New Temporary Password *</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkForce"
                  checked={forceChange}
                  onChange={(e) => setForceChange(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-rose-600 focus:ring-0"
                />
                <label htmlFor="chkForce" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  Force password reset on first user login
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium shadow-md shadow-rose-600/30 transition"
                >
                  Apply Password Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

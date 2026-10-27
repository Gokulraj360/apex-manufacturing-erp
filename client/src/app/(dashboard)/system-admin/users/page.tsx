'use client';

import React, { useState, useEffect } from 'react';
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
  Mail,
  Fingerprint,
  FileText,
  Download,
  KeyRound,
  RefreshCw,
  Building2,
  Crown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userCredentialVault, VaultUser, CredentialAuditEntry } from '@/lib/userCredentialVault';
import { generateAndDownloadWordDoc } from '@/lib/wordDocumentGenerator';

export default function UserAccessManagementPage() {
  const { session } = useAuth();
  const currentAdminRole = session?.roleId || 'super_admin';

  // Access Shield: Only super_admin or system_admin can access
  const isAuthorizedAdmin = currentAdminRole === 'super_admin' || currentAdminRole === 'system_admin';

  // Vault State
  const [users, setUsers] = useState<VaultUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<CredentialAuditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'USERS' | 'AUDIT'>('USERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Reset Modal State
  const [selectedUser, setSelectedUser] = useState<VaultUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editMfa, setEditMfa] = useState(false);
  const [forceReset, setForceReset] = useState(false);
  const [editError, setEditError] = useState('');

  // Reload data from vault
  const reloadData = () => {
    setUsers(userCredentialVault.getAllUsers());
    setAuditLogs(userCredentialVault.getAuditLogs());
  };

  useEffect(() => {
    reloadData();
    const handleVaultUpdate = () => reloadData();
    window.addEventListener('apex_credential_vault_updated', handleVaultUpdate);
    window.addEventListener('storage', handleVaultUpdate);
    return () => {
      window.removeEventListener('apex_credential_vault_updated', handleVaultUpdate);
      window.removeEventListener('storage', handleVaultUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openEditModal = (u: VaultUser) => {
    setSelectedUser(u);
    setEditEmail(u.email);
    setEditPassword(u.passwordHash);
    setEditIsActive(u.isActive);
    setEditMfa(u.mfaEnabled);
    setForceReset(u.forcePasswordReset);
    setEditError('');
    setIsEditModalOpen(true);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEditPassword(pass);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEditError('');

    // 1. Update email if changed
    if (editEmail.trim().toLowerCase() !== selectedUser.email.toLowerCase()) {
      const emailRes = userCredentialVault.updateUserEmail(selectedUser.id, editEmail, currentAdminRole);
      if (!emailRes.success) {
        setEditError(emailRes.error || 'Failed to update email address.');
        return;
      }
    }

    // 2. Update password if changed
    if (editPassword.trim() !== selectedUser.passwordHash) {
      const passRes = userCredentialVault.updateUserPassword(selectedUser.id, editPassword, currentAdminRole, forceReset);
      if (!passRes.success) {
        setEditError(passRes.error || 'Failed to update password.');
        return;
      }
    }

    // 3. Update status if changed
    if (editIsActive !== selectedUser.isActive) {
      userCredentialVault.toggleAccountStatus(selectedUser.id, editIsActive, currentAdminRole);
    }

    // 4. Update MFA if changed
    if (editMfa !== selectedUser.mfaEnabled) {
      userCredentialVault.toggleMFA(selectedUser.id, editMfa, currentAdminRole);
    }

    reloadData();
    setIsEditModalOpen(false);
    showToast(`Credentials and access policies for "${selectedUser.name}" successfully updated.`);
  };

  const handleToggleLock = (u: VaultUser) => {
    const res = userCredentialVault.toggleAccountStatus(u.id, !u.isActive, currentAdminRole);
    if (res.success) {
      reloadData();
      showToast(`Account for ${u.name} is now ${!u.isActive ? 'ACTIVE / UNLOCKED' : 'LOCKED / DISABLED'}.`);
    } else {
      showToast(res.error || 'Could not change account status.');
    }
  };

  // Export formal Word document of user directory and security audit
  const handleExportWordReport = () => {
    const tableData = users.map((u) => [
      u.employeeId,
      u.name,
      u.email,
      u.roleName,
      u.franchiseLocation,
      u.isActive ? 'ACTIVE' : 'LOCKED',
      u.mfaEnabled ? 'ENFORCED' : 'OFF',
      u.passwordHash,
    ]);

    generateAndDownloadWordDoc('Apex_User_Credential_Vault_Audit_Report.doc', {
      title: 'APEX MULTI-FRANCHISE ENTERPRISE USER DIRECTORY & CREDENTIAL AUDIT',
      documentRef: 'SEC-VAULT-2026-v2',
      classification: 'CONFIDENTIAL // IT SYSTEMS ROOT ACCESS ONLY',
      department: 'Corporate IT & Information Security Governance',
      author: session?.username || 'Top Management / IT Admin',
      summary: `This document certifies the official enterprise identity directory and authentication policies across all 21 corporate roles. All credential modifications are recorded in the tamper-proof cryptographic audit trail. Access is governed under zero-trust enterprise identity policies.`,
      sections: [
        {
          heading: '1. Registered Corporate Roles & Current Vault Credentials',
          content: ['The following matrix contains official corporate emails, assigned franchise plants, security status, and authorized portal routing endpoints.'],
          table: {
            headers: ['Employee ID', 'Staff Name', 'Official Corporate Email', 'Role Title', 'Franchise Plant', 'Status', 'MFA', 'Passphrase'],
            rows: tableData,
          },
        },
        {
          heading: '2. Immutable Security Audit Trail & Credential Modification Log',
          content: ['Every change to passwords, email IDs, and account locks is permanently appended to this audit register with cryptographic integrity verification.'],
          table: {
            headers: ['Event ID', 'Timestamp', 'Action Code', 'Target Email', 'Admin Actor', 'Details & Notes'],
            rows: auditLogs.slice(0, 15).map((a) => [
              a.id,
              new Date(a.timestamp).toLocaleString(),
              a.action,
              a.targetUserEmail,
              a.performedByAdmin,
              a.details,
            ]),
          },
        },
      ],
      signatories: [
        { name: 'Dr. Arthur Rajesh', role: 'Managing Director & CEO', organization: 'Apex Global Enterprises', signatureDate: '2026-10-24' },
        { name: 'David Zhao', role: 'Factory IT & Systems Administrator', organization: 'Information Security & Infrastructure', signatureDate: '2026-10-24' },
      ],
    });
  };

  if (!isAuthorizedAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Administrator Privilege Required
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto leading-relaxed">
          The User Credential Vault & Password Governance Workbench is restricted exclusively to <span className="font-semibold text-slate-800 dark:text-slate-200">Top Management (Owner / MD)</span> and <span className="font-semibold text-slate-800 dark:text-slate-200">Factory IT Administrator</span>.
        </p>
        <Link
          href="/pricing-control"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
        >
          Return to Authorized Station
        </Link>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.employeeId.toLowerCase().includes(q) ||
      u.roleName.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'ALL' || u.roleId === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/system-admin" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              IT & Systems Command
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">Corporate Identity & Vault</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Universal Credential Vault & Tamper-Proof User Security
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Centrally manage corporate email IDs, update passwords per role, toggle MFA enforcement, and audit immutable access trails across all 21 franchise roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportWordReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Download formal corporate Word document report"
          >
            <Download className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Export Security Dossier (.doc)</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'USERS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Active Role Identities ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'AUDIT'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Tamper-Proof Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: USER IDENTITIES & CREDENTIAL MANAGER */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm">
            <div className="relative flex-1 w-full sm:w-80">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search staff name, corporate email, role ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Vault State: Synced Across 21 Roles</span>
              </span>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-3 font-semibold">Employee & Identity</th>
                    <th className="py-3 px-3 font-semibold">Corporate Email Address</th>
                    <th className="py-3 px-3 font-semibold">Assigned Enterprise Role</th>
                    <th className="py-3 px-3 font-semibold">Franchise Plant Location</th>
                    <th className="py-3 px-3 font-semibold">MFA Security</th>
                    <th className="py-3 px-3 font-semibold">Account State</th>
                    <th className="py-3 px-3 font-semibold text-right">Vault Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white tracking-wide">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                          <span>{u.employeeId}</span>
                          <span>·</span>
                          <span>ID: {u.username}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        {u.email}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                          {u.roleName}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                        {u.franchiseLocation}
                      </td>

                      <td className="py-3 px-3">
                        {u.mfaEnabled ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-medium">
                            <ShieldCheck className="h-3 w-3" />
                            Enforced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            Optional
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30 font-bold">
                            <ShieldAlert className="h-3 w-3" />
                            Locked
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold inline-flex items-center gap-1 transition cursor-pointer"
                            title="Edit corporate email ID & update password"
                          >
                            <Key className="h-3 w-3" />
                            <span>Edit Credentials</span>
                          </button>

                          <button
                            onClick={() => handleToggleLock(u)}
                            disabled={u.roleId === 'super_admin'}
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition cursor-pointer ${
                              u.roleId === 'super_admin'
                                ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200'
                                : u.isActive
                                ? 'bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                                : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            }`}
                          >
                            {u.isActive ? 'Lock' : 'Unlock'}
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

      {/* TAB 2: IMMUTABLE AUDIT TRAIL */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Immutable Identity & Security Audit Trail (Tamper-Proof Register)</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">{auditLogs.length} Logged Events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3 font-semibold">Timestamp</th>
                  <th className="py-3 px-3 font-semibold">Action Classification</th>
                  <th className="py-3 px-3 font-semibold">Target User Account</th>
                  <th className="py-3 px-3 font-semibold">Authorized Admin</th>
                  <th className="py-3 px-3 font-semibold">Audit Specification & Details</th>
                  <th className="py-3 px-3 font-semibold text-right">Terminal Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-sans text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'PASSWORD_CHANGED'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                          : log.action === 'EMAIL_UPDATED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300'
                          : log.action === 'ACCOUNT_LOCKED'
                          ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                      {log.targetUserEmail}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-sans text-xs">
                      {log.performedByAdmin}
                    </td>
                    <td className="py-3 px-3 font-sans text-xs text-slate-600 dark:text-slate-400">
                      {log.details}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 text-[10px]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT CREDENTIALS MODAL */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Key className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Update Corporate Credentials & Security Policy
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Target Role: <strong className="text-blue-600">{selectedUser.roleName}</strong> ({selectedUser.name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-4">
              {/* Field 1: Corporate Email */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Corporate Email Address *
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                    placeholder="user@apexcorp.com"
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  User will use this email address to log into their dashboard.
                </p>
              </div>

              {/* Field 2: Corporate Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Account Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[10px] text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="h-3 w-3" />
                    <span>Generate Secure Password</span>
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 font-bold tracking-wide"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              {/* Security Toggles */}
              <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    disabled={selectedUser.roleId === 'super_admin'}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Account Active & Unlocked (Permit Workspace Logins)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editMfa}
                    onChange={(e) => setEditMfa(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    Enforce Multi-Factor Authentication (MFA Hardware Token)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceReset}
                    onChange={(e) => setForceReset(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    Force employee to change password upon next login
                  </span>
                </label>
              </div>

              {editError && (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save & Apply Vault Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

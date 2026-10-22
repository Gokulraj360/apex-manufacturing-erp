'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Database,
  HardDrive,
  ShieldCheck,
  RotateCcw,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  FileCode,
  Download,
  Clock,
  Activity,
  Server,
  Zap,
  Lock,
  Archive,
  RefreshCw,
} from 'lucide-react';
import { BackupLogItem, BackupType, BackupStatus } from '@/types/system-admin';

const INITIAL_BACKUPS: BackupLogItem[] = [
  {
    id: 'bk-1',
    backupId: 'BKP-20261007-0300-FULL',
    backupType: 'FULL_DATABASE',
    storageDestination: 'AWS S3 (s3://mfg-erp-vault-prod/daily-full/)',
    fileSizeBytes: 14763950080,
    fileSizeMb: '14,080.00',
    durationSeconds: 142,
    checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'VERIFIED',
    initiatedBy: 'SYSTEM_CRON_SCHEDULER',
    restorationVerifiedAt: '2026-10-07 03:15 UTC',
    createdAt: '2026-10-07 03:00 UTC',
  },
  {
    id: 'bk-2',
    backupId: 'BKP-20261007-0700-INC',
    backupType: 'INCREMENTAL',
    storageDestination: 'Local Industrial NAS (/mnt/san01/backups/hourly/)',
    fileSizeBytes: 184549376,
    fileSizeMb: '176.00',
    durationSeconds: 12,
    checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'SUCCESSFUL',
    initiatedBy: 'SYSTEM_CRON_SCHEDULER',
    createdAt: '2026-10-07 07:00 UTC',
  },
  {
    id: 'bk-3',
    backupId: 'BKP-20261007-1100-INC',
    backupType: 'INCREMENTAL',
    storageDestination: 'Local Industrial NAS (/mnt/san01/backups/hourly/)',
    fileSizeBytes: 212860928,
    fileSizeMb: '203.00',
    durationSeconds: 14,
    checksumSha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    status: 'SUCCESSFUL',
    initiatedBy: 'SYSTEM_CRON_SCHEDULER',
    createdAt: '2026-10-07 11:00 UTC',
  },
  {
    id: 'bk-4',
    backupId: 'BKP-20261007-1500-INC',
    backupType: 'INCREMENTAL',
    storageDestination: 'Local Industrial NAS (/mnt/san01/backups/hourly/)',
    fileSizeBytes: 245366784,
    fileSizeMb: '234.00',
    durationSeconds: 15,
    checksumSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    status: 'SUCCESSFUL',
    initiatedBy: 'SYSTEM_CRON_SCHEDULER',
    createdAt: '2026-10-07 15:00 UTC',
  },
  {
    id: 'bk-5',
    backupId: 'BKP-20261006-2300-DR-SNAP',
    backupType: 'DISASTER_RECOVERY_SNAPSHOT',
    storageDestination: 'Azure Blob Immutable Vault (dr-primary-zone)',
    fileSizeBytes: 15852503040,
    fileSizeMb: '15,118.00',
    durationSeconds: 188,
    checksumSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    status: 'VERIFIED',
    initiatedBy: 'admin@plantcorp.internal',
    restorationVerifiedAt: '2026-10-06 23:30 UTC',
    createdAt: '2026-10-06 23:00 UTC',
  },
  {
    id: 'bk-6',
    backupId: 'BKP-20261006-0300-FULL',
    backupType: 'FULL_DATABASE',
    storageDestination: 'AWS S3 (s3://mfg-erp-vault-prod/daily-full/)',
    fileSizeBytes: 14512291840,
    fileSizeMb: '13,840.00',
    durationSeconds: 139,
    checksumSha256: 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    status: 'VERIFIED',
    initiatedBy: 'SYSTEM_CRON_SCHEDULER',
    restorationVerifiedAt: '2026-10-06 03:14 UTC',
    createdAt: '2026-10-06 03:00 UTC',
  },
];


export interface PageRouteSnapshot {
  id: string;
  routePath: string;
  pageName: string;
  department: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'CRASHED';
  lastCrashReason?: string;
  lastSnapshotTime: string;
  snapshotId: string;
  snapshotHash: string;
  cacheSizeBytes: string;
  recoveryHistoryCount: number;
}

const INITIAL_PAGE_SNAPSHOTS: PageRouteSnapshot[] = [
  {
    id: 'pg-1',
    routePath: '/finance/ap-matching',
    pageName: 'Automated 3-Way AP Matching Engine',
    department: 'Corporate Finance & Accounts Payable',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-APM-902',
    snapshotHash: 'sha256:7a813c990a42',
    cacheSizeBytes: '1.24 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-2',
    routePath: '/customer-portal',
    pageName: 'B2B Customer Portal & CoC Engine',
    department: 'Client Relations & Fulfillment',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-CUST-881',
    snapshotHash: 'sha256:3cd2e8412b11',
    cacheSizeBytes: '1.45 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-3',
    routePath: '/supplier-portal',
    pageName: 'B2B Supplier Self-Service Gateway',
    department: 'Supply Chain Sourcing',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-SUPP-772',
    snapshotHash: 'sha256:91bc7721a450',
    cacheSizeBytes: '1.62 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-4',
    routePath: '/approvals',
    pageName: 'Central Multi-Department Approval Inbox',
    department: 'Executive Governance & Controls',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-APPR-603',
    snapshotHash: 'sha256:88ad554109fe',
    cacheSizeBytes: '1.18 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-5',
    routePath: '/top-management',
    pageName: 'Executive Boardroom C-Suite Cockpit',
    department: 'C-Suite Strategy & Governance',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-TOP-550',
    snapshotHash: 'sha256:12ba9942ff01',
    cacheSizeBytes: '2.05 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-6',
    routePath: '/quality/hardware-diagnostics',
    pageName: 'Automated Station Hardware Diagnostics Suite',
    department: 'Quality Assurance & Cleanroom ATE',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-ATE-419',
    snapshotHash: 'sha256:77da310899bb',
    cacheSizeBytes: '1.38 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-7',
    routePath: '/legal',
    pageName: 'Contract Lifecycle Management (CLM)',
    department: 'Legal Counsel & Compliance',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-LEG-332',
    snapshotHash: 'sha256:99f01124cc45',
    cacheSizeBytes: '1.82 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-8',
    routePath: '/my-workspace',
    pageName: 'Employee Self-Service (ESS) Personal Workspace',
    department: 'Workforce Operations & HR',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-ESS-219',
    snapshotHash: 'sha256:44ef8821bb33',
    cacheSizeBytes: '1.15 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-9',
    routePath: '/super-admin/rbac-matrix',
    pageName: '2D RBAC Permission Matrix & SoD Auditor',
    department: 'Enterprise Cybersecurity & IAM',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-RBAC-101',
    snapshotHash: 'sha256:05ef3399aa19',
    cacheSizeBytes: '1.74 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-10',
    routePath: '/production/work-orders',
    pageName: 'Shop Floor MES Work Orders Tracking',
    department: 'Plant Operations & Assembly',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-PROD-998',
    snapshotHash: 'sha256:22bc4412ef88',
    cacheSizeBytes: '1.92 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-11',
    routePath: '/design/blueprints',
    pageName: 'CAD Drawing & Blueprints Vault',
    department: 'Design & Hardware Engineering',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-DSG-840',
    snapshotHash: 'sha256:66fd22998833',
    cacheSizeBytes: '2.40 MB',
    recoveryHistoryCount: 0,
  },
  {
    id: 'pg-12',
    routePath: '/warehouse/receiving',
    pageName: 'Inbound Gate Receiving & Electronic GRN',
    department: 'Warehouse & Weighbridge Logistics',
    status: 'OPERATIONAL',
    lastSnapshotTime: 'Today 04:15 UTC (Golden Master)',
    snapshotId: 'SNAP-PAGE-WHS-710',
    snapshotHash: 'sha256:33ee1199cb12',
    cacheSizeBytes: '1.30 MB',
    recoveryHistoryCount: 0,
  },
];

export default function BackupManagementPage() {
  const [backups, setBackups] = useState<BackupLogItem[]>(INITIAL_BACKUPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<BackupLogItem | null>(null);

  // Trigger form state
  const [newBackupType, setNewBackupType] = useState<BackupType>('FULL_DATABASE');
  const [newDestination, setNewDestination] = useState('AWS S3 (s3://mfg-erp-vault-prod/daily-full/)');
  const [compressionType, setCompressionType] = useState('zstd');
  const [includeAuditLogs, setIncludeAuditLogs] = useState(true);
  const [isSubmittingBackup, setIsSubmittingBackup] = useState(false);

  // Restore form state
  const [restoreTargetEnvironment, setRestoreTargetEnvironment] = useState<'SANDBOX_DR' | 'PRODUCTION_OVERWRITE'>('SANDBOX_DR');
  const [restoreVerificationCode, setRestoreVerificationCode] = useState('');
  const [restoreError, setRestoreError] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState('');

  // Filtering
  const filteredBackups = backups.filter((b) => {
    const matchesSearch =
      b.backupId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.storageDestination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.initiatedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || b.backupType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Trigger Backup Handler
  const handleTriggerBackup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBackup(true);

    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().replace(/[-:T]/g, '').slice(0, 12);
      const randomHex = Math.random().toString(16).substring(2, 10);
      const sizeMb = newBackupType === 'FULL_DATABASE' ? '14,210.00' : '198.50';

      const newRecord: BackupLogItem = {
        id: `bk-${Date.now()}`,
        backupId: `BKP-${dateStr}-${newBackupType.replace('_', '').slice(0, 4)}`,
        backupType: newBackupType,
        storageDestination: newDestination,
        fileSizeBytes: newBackupType === 'FULL_DATABASE' ? 14900000000 : 208141824,
        fileSizeMb: sizeMb,
        durationSeconds: newBackupType === 'FULL_DATABASE' ? 148 : 16,
        checksumSha256: `${randomHex}e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
        status: 'VERIFIED',
        initiatedBy: 'admin@plantcorp.internal (Manual Trigger)',
        restorationVerifiedAt: `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString()}`,
        createdAt: `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString()}`,
      };

      setBackups([newRecord, ...backups]);
      setIsSubmittingBackup(false);
      setIsTriggerModalOpen(false);
    }, 700);
  };

  // Restore Handler
  const handleRestoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRestoreError('');
    setRestoreSuccessMsg('');

    if (restoreVerificationCode.trim() !== 'RESTORE_CONFIRM_SAFE') {
      setRestoreError('Invalid security verification phrase. You must type RESTORE_CONFIRM_SAFE exactly.');
      return;
    }

    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      setRestoreSuccessMsg(
        `Disaster Recovery Sandbox successfully restored from archive ${selectedBackupForRestore?.backupId}. Hot standby database instance is healthy on port 5433.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/system-admin"
              className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Infrastructure Hub
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5 mt-1">
            <Database className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            Automated Backup Vault & Disaster Recovery
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Zero-data-loss PostgreSQL replication snapshots, SHA-256 integrity verification, multi-cloud cold vaults, and sandbox recovery testing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTriggerModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Trigger Backup Now
          </button>
        </div>
      </div>

      {/* KPI & Storage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vault Storage Usage</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
              <HardDrive className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">84.6 GB</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ 500 GB Quota</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '16.9%' }}></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>16.9% Allocated</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Healthy Headroom</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Full Backup</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-slate-900 dark:text-white">Today 03:00 UTC</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
            <ShieldCheck className="h-3.5 w-3.5" />
            SHA-256 Verified (14.08 GB)
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Duration: 2m 22s</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">RPO & RTO SLA</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">&lt; 15 min RPO</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-300">
            <span>Target RTO: 8 Minutes</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Continuous WAL archiving active</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Retention Policy</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Archive className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">30 Days Hot S3</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-300">
            <span>365 Days Glacier Cold Vault</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Zero-touch auto pruning enabled</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by Backup ID, S3 bucket path, or initiator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Snapshot Types</option>
            <option value="FULL_DATABASE">Full Database</option>
            <option value="INCREMENTAL">Incremental</option>
            <option value="DISASTER_RECOVERY_SNAPSHOT">Disaster Recovery Snapshot</option>
            <option value="SCHEMA_ONLY">Schema Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified Checksum</option>
            <option value="SUCCESSFUL">Successful</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Snapshot Log Table */}
      <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Immutable Backup Logs & Archives</h2>
            <span className="text-xs text-slate-500 font-mono">({filteredBackups.length} snapshots)</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Automated Replication Daemon: Idle
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Backup ID & Type</th>
                <th className="py-3 px-4">Storage Destination</th>
                <th className="py-3 px-4">Size & Duration</th>
                <th className="py-3 px-4">Integrity Checksum (SHA-256)</th>
                <th className="py-3 px-4">Status & Verification</th>
                <th className="py-3 px-4">Initiated By / Timestamp</th>
                <th className="py-3 px-4 text-right">Disaster Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredBackups.map((bk) => (
                <tr key={bk.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                      {bk.backupId}
                    </div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        bk.backupType === 'FULL_DATABASE'
                          ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'
                          : bk.backupType === 'DISASTER_RECOVERY_SNAPSHOT'
                          ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                          : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
                      }`}
                    >
                      {bk.backupType.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate block text-[11px]" title={bk.storageDestination}>
                      {bk.storageDestination}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono font-medium text-slate-900 dark:text-white">{bk.fileSizeMb} MB</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{bk.durationSeconds}s elapsed</div>
                  </td>

                  <td className="py-3 px-4">
                    <div
                      className="font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[140px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800"
                      title={bk.checksumSha256}
                    >
                      {bk.checksumSha256?.substring(0, 16)}...
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {bk.status === 'VERIFIED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> VERIFIED
                        </span>
                      )}
                      {bk.status === 'SUCCESSFUL' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> SUCCESS
                        </span>
                      )}
                      {bk.status === 'IN_PROGRESS' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                          <RefreshCw className="h-3 w-3 animate-spin" /> IN PROGRESS
                        </span>
                      )}
                      {bk.status === 'FAILED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> FAILED
                        </span>
                      )}
                    </div>
                    {bk.restorationVerifiedAt && (
                      <div className="text-[10px] text-slate-500 mt-1">Verified: {bk.restorationVerifiedAt}</div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-800 dark:text-slate-300 font-medium truncate max-w-[150px]">{bk.initiatedBy}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{bk.createdAt}</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedBackupForRestore(bk);
                          setIsRestoreModalOpen(true);
                        }}
                        className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-700/30 transition-colors flex items-center gap-1 text-[11px] px-2"
                        title="Simulate disaster restore to sandbox"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore Sandbox
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trigger Backup Modal */}
      {isTriggerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsTriggerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-500/20 flex items-center justify-center">
                <Database className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Trigger Database Backup</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Initiate an immediate immutable database snapshot archive</p>
              </div>
            </div>

            <form onSubmit={handleTriggerBackup} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Backup Snapshot Mode</label>
                <select
                  value={newBackupType}
                  onChange={(e) => setNewBackupType(e.target.value as BackupType)}
                  className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="FULL_DATABASE">FULL_DATABASE - Complete PostgreSQL Cluster Dump + WAL</option>
                  <option value="INCREMENTAL">INCREMENTAL - Delta Transaction Changes Since Last Full Dump</option>
                  <option value="DISASTER_RECOVERY_SNAPSHOT">DISASTER_RECOVERY_SNAPSHOT - Multi-Region Encrypted Standby</option>
                  <option value="SCHEMA_ONLY">SCHEMA_ONLY - DDL Definitions, Views, &amp; Indices</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target Storage Destination</label>
                <select
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-[11px]"
                >
                  <option value="AWS S3 (s3://mfg-erp-vault-prod/daily-full/)">AWS S3 (s3://mfg-erp-vault-prod/daily-full/) - Us-East-1</option>
                  <option value="Local Industrial NAS (/mnt/san01/backups/hourly/)">Local Industrial NAS (/mnt/san01/backups/hourly/) - 192.168.10.200</option>
                  <option value="Azure Blob Immutable Vault (dr-primary-zone)">Azure Blob Immutable Vault (dr-primary-zone) - West Europe</option>
                  <option value="Cold Storage Glacier Vault (glacier://erp-archive-deep/)">Cold Storage Glacier Vault (glacier://erp-archive-deep/)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Compression Engine</label>
                  <select
                    value={compressionType}
                    onChange={(e) => setCompressionType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="zstd">Zstandard (zstd - Level 9, Recommended)</option>
                    <option value="pigz">Gzip (pigz parallel - Level 6)</option>
                    <option value="lz4">LZ4 Fast Streaming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Encryption Mode</label>
                  <div className="bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-emerald-500" /> AES-256-GCM (Hardware HSM)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAuditLogs}
                    onChange={(e) => setIncludeAuditLogs(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-rose-600 focus:ring-0"
                  />
                  <span className="text-slate-800 dark:text-slate-200 font-medium">Include Historical Audit Trail &amp; Document Blobs</span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-6">
                  Includes full user action audit logs and attachments table. Recommended for statutory compliance.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTriggerModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBackup}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-rose-600/20"
                >
                  {isSubmittingBackup ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Archiving...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5" /> Start Dump &amp; Checksum
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disaster Recovery Restoration Modal */}
      {isRestoreModalOpen && selectedBackupForRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-rose-300 dark:border-rose-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => {
                setIsRestoreModalOpen(false);
                setRestoreError('');
                setRestoreSuccessMsg('');
                setRestoreVerificationCode('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-500/20 flex items-center justify-center">
                <RotateCcw className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Disaster Recovery Restoration</h3>
                <p className="text-xs text-rose-600 dark:text-rose-400">Sandbox Verification &amp; Standby Cluster Restore</p>
              </div>
            </div>

            {restoreSuccessMsg ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Restoration Successful</div>
                    <div className="mt-1">{restoreSuccessMsg}</div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setIsRestoreModalOpen(false);
                      setRestoreSuccessMsg('');
                      setRestoreVerificationCode('');
                    }}
                    className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRestoreSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
                  <div className="text-slate-500 dark:text-slate-400">Selected Snapshot Archive:</div>
                  <div className="font-mono font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                    {selectedBackupForRestore.backupId}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Size: {selectedBackupForRestore.fileSizeMb} MB | SHA-256: {selectedBackupForRestore.checksumSha256?.substring(0, 20)}...
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Restoration Target Mode</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 cursor-pointer">
                      <input
                        type="radio"
                        name="targetEnv"
                        checked={restoreTargetEnvironment === 'SANDBOX_DR'}
                        onChange={() => setRestoreTargetEnvironment('SANDBOX_DR')}
                        className="text-indigo-600 focus:ring-0"
                      />
                      <div>
                        <div className="font-semibold text-indigo-700 dark:text-indigo-300">Isolated Disaster Recovery Sandbox (Recommended)</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Restores to sandbox port 5433 for automated health verification without disrupting production.</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-rose-200 dark:border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20 cursor-pointer">
                      <input
                        type="radio"
                        name="targetEnv"
                        checked={restoreTargetEnvironment === 'PRODUCTION_OVERWRITE'}
                        onChange={() => setRestoreTargetEnvironment('PRODUCTION_OVERWRITE')}
                        className="text-rose-600 focus:ring-0"
                      />
                      <div>
                        <div className="font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Active Production Live Cluster Overwrite (HIGH RISK)
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Will replace current live tables and disconnect active manufacturing sessions.</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Security Confirmation Phrase <span className="text-rose-600 dark:text-rose-400">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                    Type <code className="bg-slate-100 dark:bg-slate-900 text-rose-700 dark:text-rose-300 px-1 py-0.5 rounded font-mono">RESTORE_CONFIRM_SAFE</code> below to unlock:
                  </p>
                  <input
                    type="text"
                    value={restoreVerificationCode}
                    onChange={(e) => setRestoreVerificationCode(e.target.value)}
                    placeholder="RESTORE_CONFIRM_SAFE"
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 font-mono tracking-wider focus:outline-none focus:border-rose-500"
                  />
                </div>

                {restoreError && (
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 rounded-lg text-rose-700 dark:text-rose-300 text-[11px]">
                    {restoreError}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRestoreModalOpen(false);
                      setRestoreError('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRestoring}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-rose-600/20"
                  >
                    {isRestoring ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Restoring Cluster...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" /> Execute Restoration Simulation
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Flame,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Radio,
  Activity,
  Terminal,
  Globe,
  Zap,
  RotateCcw,
  Layers,
  Key,
  Eye,
  FileCheck2,
} from 'lucide-react';
import {
  SecurityAuditLogItem,
  SecurityIncidentSeverity,
} from '@/types/system-admin';

interface FirewallRule {
  id: string;
  name: string;
  cidrBlock: string;
  portRange: string;
  protocol: 'TCP' | 'UDP' | 'ALL';
  action: 'ALLOW' | 'DENY';
  description: string;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
}

const INITIAL_INCIDENTS: SecurityAuditLogItem[] = [
  {
    id: 'inc-1',
    eventType: 'BRUTE_FORCE_LOGIN_BLOCKED',
    sourceIp: '185.220.101.45',
    userAgent: 'Mozilla/5.0 (Hydra-Bruteforce-Engine v9.1)',
    severity: 'HIGH',
    details: '14 consecutive failed login attempts on endpoint /api/v1/auth/login targeting admin@plantcorp.internal. IP auto-jailed for 24 hours.',
    isResolved: true,
    resolvedBy: 'system-firewall-daemon',
    mitigationActionTaken: 'IP added to iptables jail and DROP rule propagated across load balancers.',
    createdAt: '2026-10-07 16:40 UTC',
  },
  {
    id: 'inc-2',
    eventType: 'SQLI_PAYLOAD_NEUTRALIZED',
    sourceIp: '198.51.100.89',
    userAgent: 'sqlmap/1.7#stable',
    severity: 'CRITICAL',
    details: 'Malicious SQL injection signature pattern detected in query param ?filter=UNION SELECT... on /api/v1/finance/ledger. Blocked by Nginx WAF rule #4002.',
    isResolved: true,
    resolvedBy: 'waf-edge-controller',
    mitigationActionTaken: 'WAF rejected connection with HTTP 403 Forbidden; edge rate limit enforced.',
    createdAt: '2026-10-07 14:15 UTC',
  },
  {
    id: 'inc-3',
    eventType: 'UNAUTHORIZED_ROLE_ESCALATION_ATTEMPT',
    sourceIp: '192.168.10.42',
    userAgent: 'PostmanRuntime/7.32.3',
    severity: 'HIGH',
    details: 'Operator token attempting direct POST to /api/v1/super-admin/rbac/permissions without required SUPER_ADMIN scope.',
    isResolved: false,
    details_extended: 'Investigating workstation assigned to Floor Supervisor Terminal 4.',
    createdAt: '2026-10-07 13:02 UTC',
  } as any,
  {
    id: 'inc-4',
    eventType: 'EXPIRED_JWT_REPLAY_ATTACK',
    sourceIp: '10.0.12.8',
    userAgent: 'Mobile-RF-Terminal-Client/1.2',
    severity: 'MEDIUM',
    details: 'Replay of an expired token from 3 hours prior; rejected with 401 Unauthorized by JWT Strategy Guard.',
    isResolved: true,
    resolvedBy: 'auth-guard',
    mitigationActionTaken: 'Token invalidated and client forced to re-authenticate with TOTP challenge.',
    createdAt: '2026-10-07 11:20 UTC',
  },
  {
    id: 'inc-5',
    eventType: 'ANOMALOUS_GEO_LOGIN',
    sourceIp: '45.154.255.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'MEDIUM',
    details: 'Login attempt from unexpected country (Netherlands datacenter VPN) for user finance.manager@plantcorp.internal while active session existed in Domestic Plant IP.',
    isResolved: true,
    resolvedBy: 'security-operations',
    mitigationActionTaken: 'Step-up MFA prompted, foreign attempt dropped, session revoked.',
    createdAt: '2026-10-07 09:44 UTC',
  },
];

const INITIAL_FIREWALL_RULES: FirewallRule[] = [
  {
    id: 'fw-1',
    name: 'Shop Floor OT Industrial Network Subnet',
    cidrBlock: '10.0.4.0/22',
    portRange: '1883, 502, 9100',
    protocol: 'TCP',
    action: 'ALLOW',
    description: 'Permits internal CNC, Modbus PLC, and IoT vibration sensor telemetry brokers.',
    status: 'ACTIVE',
    createdAt: '2026-09-01',
  },
  {
    id: 'fw-2',
    name: 'Office LAN Workstations ERP Access',
    cidrBlock: '192.168.10.0/24',
    portRange: '443, 80',
    protocol: 'TCP',
    action: 'ALLOW',
    description: 'Enables plant office desktop access to ERP frontend web interface.',
    status: 'ACTIVE',
    createdAt: '2026-09-01',
  },
  {
    id: 'fw-3',
    name: 'Block Known Tor & Anonymous VPN Exit Nodes',
    cidrBlock: '185.220.100.0/22',
    portRange: 'ALL',
    protocol: 'ALL',
    action: 'DENY',
    description: 'Zero-tolerance drop of automated proxy scanners and scraping bots.',
    status: 'ACTIVE',
    createdAt: '2026-09-15',
  },
  {
    id: 'fw-4',
    name: 'External Weighbridge REST Webhook Ingress',
    cidrBlock: '203.0.113.50/32',
    portRange: '443',
    protocol: 'TCP',
    action: 'ALLOW',
    description: 'Dedicated IP tunnel for North Gate weighbridge telemetry cloud gateway.',
    status: 'ACTIVE',
    createdAt: '2026-09-20',
  },
  {
    id: 'fw-5',
    name: 'PostgreSQL Direct External Port Block',
    cidrBlock: '0.0.0.0/0',
    portRange: '5432',
    protocol: 'TCP',
    action: 'DENY',
    description: 'Absolute isolation: Postgres port 5432 only reachable via internal Docker overlay network.',
    status: 'ACTIVE',
    createdAt: '2026-09-01',
  },
];

export default function CybersecurityPage() {
  const [activeTab, setActiveTab] = useState<'INCIDENTS' | 'FIREWALL'>('INCIDENTS');
  const [incidents, setIncidents] = useState<SecurityAuditLogItem[]>(INITIAL_INCIDENTS);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>(INITIAL_FIREWALL_RULES);

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  // Modals
  const [isLogIncidentModalOpen, setIsLogIncidentModalOpen] = useState(false);
  const [isAddFirewallModalOpen, setIsAddFirewallModalOpen] = useState(false);
  const [resolvingIncident, setResolvingIncident] = useState<SecurityAuditLogItem | null>(null);
  const [mitigationText, setMitigationText] = useState('');

  // Form states
  const [newEventType, setNewEventType] = useState('BRUTE_FORCE_LOGIN_BLOCKED');
  const [newSourceIp, setNewSourceIp] = useState('');
  const [newSeverity, setNewSeverity] = useState<SecurityIncidentSeverity>('HIGH');
  const [newDetails, setNewDetails] = useState('');

  const [newRuleName, setNewRuleName] = useState('');
  const [newCidr, setNewCidr] = useState('');
  const [newPortRange, setNewPortRange] = useState('443');
  const [newProtocol, setNewProtocol] = useState<'TCP' | 'UDP' | 'ALL'>('TCP');
  const [newAction, setNewAction] = useState<'ALLOW' | 'DENY'>('DENY');
  const [newRuleDesc, setNewRuleDesc] = useState('');

  // Filter incidents
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.sourceIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  // Filter firewall rules
  const filteredRules = firewallRules.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cidrBlock.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SecurityAuditLogItem = {
      id: `inc-${Date.now()}`,
      eventType: newEventType,
      sourceIp: newSourceIp || '127.0.0.1',
      userAgent: 'SecOps-Operator-Console',
      severity: newSeverity,
      details: newDetails,
      isResolved: false,
      createdAt: 'Just now',
    };
    setIncidents([created, ...incidents]);
    setIsLogIncidentModalOpen(false);
    setNewDetails('');
    setNewSourceIp('');
  };

  const handleResolveIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingIncident) return;
    setIncidents(
      incidents.map((i) =>
        i.id === resolvingIncident.id
          ? {
              ...i,
              isResolved: true,
              resolvedBy: 'admin@plantcorp.internal',
              mitigationActionTaken: mitigationText || 'Threat neutralized and IP blacklisted in edge firewall.',
            }
          : i
      )
    );
    setResolvingIncident(null);
    setMitigationText('');
  };

  const handleCreateFirewallRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: FirewallRule = {
      id: `fw-${Date.now()}`,
      name: newRuleName,
      cidrBlock: newCidr,
      portRange: newPortRange,
      protocol: newProtocol,
      action: newAction,
      description: newRuleDesc,
      status: 'ACTIVE',
      createdAt: 'Today',
    };
    setFirewallRules([newRule, ...firewallRules]);
    setIsAddFirewallModalOpen(false);
    setNewRuleName('');
    setNewCidr('');
    setNewRuleDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/system-admin"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Infrastructure Hub
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <Flame className="h-6 w-6 text-rose-400" />
            Cybersecurity, Intrusion Detection &amp; Perimeter Firewall
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Zero-Trust network architecture, WAF attack mitigation, CIDR access control, brute-force jail, and SOC-2 Type II audit telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'INCIDENTS' ? (
            <button
              onClick={() => setIsLogIncidentModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Log Security Incident
            </button>
          ) : (
            <button
              onClick={() => setIsAddFirewallModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Firewall Rule
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Threat Defense Score</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">98.4%</span>
            <span className="text-xs text-emerald-400 font-medium">Optimal</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">SOC-2 Type II benchmark compliant</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Breaches</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 font-mono">0</span>
            <span className="text-xs text-slate-400">Zero Uncontained</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">1 ongoing Supervisor investigation</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">MFA Mandate Adoption</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Key className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">100%</span>
            <span className="text-xs text-slate-400">(18 / 18 Admins)</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-300">TOTP Hardware Authenticator active</div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Firewall Probes Dropped</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Flame className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">1,429</span>
            <span className="text-xs text-slate-400">Past 24h</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-300">Automatic IP jail enforced</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('INCIDENTS')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'INCIDENTS'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Intrusion Detection &amp; Security Incident Log
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {incidents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('FIREWALL')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'FIREWALL'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <Flame className="h-4 w-4" />
          Perimeter Firewall &amp; CIDR Ingress Rules
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {firewallRules.length}
          </span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder={
              activeTab === 'INCIDENTS'
                ? 'Search by event type, IP address, or payload details...'
                : 'Search rules by CIDR block, name, or description...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0b0f19] border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {activeTab === 'INCIDENTS' && (
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB CONTENT: INCIDENTS */}
      {activeTab === 'INCIDENTS' && (
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <h2 className="text-sm font-semibold text-white">Security Audit &amp; Threat Telemetry</h2>
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              Realtime WAF Honeypot Active
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Threat Event</th>
                  <th className="py-3 px-4">Source IP &amp; Client</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Incident Details &amp; Mitigation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Detected At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        {inc.eventType}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-200">{inc.sourceIp}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]" title={inc.userAgent}>
                        {inc.userAgent}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                            : inc.severity === 'HIGH'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                            : inc.severity === 'MEDIUM'
                            ? 'bg-yellow-950/80 text-yellow-300 border border-yellow-500/30'
                            : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <p className="text-slate-300 text-[11px]">{inc.details}</p>
                      {inc.mitigationActionTaken && (
                        <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 shrink-0" /> {inc.mitigationActionTaken}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {inc.isResolved ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" /> Neutralized
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                          <AlertTriangle className="h-3 w-3" /> Investigating
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {inc.createdAt}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {!inc.isResolved && (
                        <button
                          onClick={() => setResolvingIncident(inc)}
                          className="px-2.5 py-1 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 border border-rose-600/30 text-[11px] font-medium transition-colors"
                        >
                          Mitigate Threat
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FIREWALL */}
      {activeTab === 'FIREWALL' && (
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-400" />
              <h2 className="text-sm font-semibold text-white">Active Perimeter Ingress &amp; Egress Rules</h2>
            </div>
            <div className="text-xs text-slate-400">
              iptables / Nginx Reverse Proxy Enforcement
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">CIDR / Source Range</th>
                  <th className="py-3 px-4">Port / Protocol</th>
                  <th className="py-3 px-4">Policy Action</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {r.name}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-200">
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {r.cidrBlock}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {r.protocol} : {r.portRange}
                    </td>

                    <td className="py-3 px-4">
                      {r.action === 'ALLOW' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          ALLOW
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/30">
                          DENY (DROP)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-400 max-w-sm">
                      {r.description}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" /> ACTIVE
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setFirewallRules(
                            firewallRules.map((item) =>
                              item.id === r.id
                                ? { ...item, status: item.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' }
                                : item
                            )
                          );
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors"
                      >
                        {r.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Security Incident Modal */}
      {isLogIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsLogIncidentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Flag Security Incident</h3>
                <p className="text-xs text-slate-400">Record anomalous activity or intrusion attempt</p>
              </div>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Threat Event Type</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                >
                  <option value="BRUTE_FORCE_LOGIN_BLOCKED">BRUTE_FORCE_LOGIN_BLOCKED</option>
                  <option value="SQLI_PAYLOAD_NEUTRALIZED">SQLI_PAYLOAD_NEUTRALIZED</option>
                  <option value="UNAUTHORIZED_ROLE_ESCALATION">UNAUTHORIZED_ROLE_ESCALATION</option>
                  <option value="EXPIRED_JWT_REPLAY_ATTACK">EXPIRED_JWT_REPLAY_ATTACK</option>
                  <option value="ANOMALOUS_GEO_LOGIN">ANOMALOUS_GEO_LOGIN</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Source IP Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 192.168.10.99"
                    value={newSourceIp}
                    onChange={(e) => setNewSourceIp(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as SecurityIncidentSeverity)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Incident Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe detected telemetry, offending payload, or affected subsystem..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogIncidentModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
                >
                  Log Threat Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Incident Modal */}
      {resolvingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setResolvingIncident(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Mitigate Security Incident</h3>
                <p className="text-xs text-slate-400 font-mono">{resolvingIncident.eventType}</p>
              </div>
            </div>

            <form onSubmit={handleResolveIncident} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                <span className="font-semibold text-white">Offending IP:</span> {resolvingIncident.sourceIp}
                <div className="text-[11px] text-slate-400 mt-1">{resolvingIncident.details}</div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Mitigation Action Taken</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Added IP to iptables DROP rule, rotated operator credentials, and flushed token cache..."
                  value={mitigationText}
                  onChange={(e) => setMitigationText(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResolvingIncident(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                >
                  Mark Neutralized
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Firewall Rule Modal */}
      {isAddFirewallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsAddFirewallModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <Flame className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Add Firewall Access Rule</h3>
                <p className="text-xs text-slate-400">Define ingress CIDR filter and protocol restrictions</p>
              </div>
            </div>

            <form onSubmit={handleCreateFirewallRule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block Foreign Subnet Range"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">CIDR Block / Subnet</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 192.168.1.0/24"
                    value={newCidr}
                    onChange={(e) => setNewCidr(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Port Range</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 443 or 1883"
                    value={newPortRange}
                    onChange={(e) => setNewPortRange(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Protocol</label>
                  <select
                    value={newProtocol}
                    onChange={(e) => setNewProtocol(e.target.value as any)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ALL">ALL PROTOCOLS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Policy Action</label>
                  <select
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value as any)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="ALLOW">ALLOW (Accept)</option>
                    <option value="DENY">DENY (Drop)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description / Business Justification</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Reason for rule creation and traffic scope..."
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddFirewallModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
                >
                  Deploy Firewall Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

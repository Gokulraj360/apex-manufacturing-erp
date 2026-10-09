import { SecurityIncidentSeverity } from '@prisma/client';

export class LogSecurityIncidentDto {
  eventType!: string; // 'FAILED_LOGIN', 'BRUTE_FORCE_BLOCK', 'UNAUTHORIZED_API_ACCESS', 'FIREWALL_RULE_TRIGGER', 'PRIVILEGE_ESCALATION'
  sourceIp!: string;
  userAgent?: string;
  severity!: SecurityIncidentSeverity;
  details!: string;
}

export class ResolveSecurityIncidentDto {
  incidentId!: string;
  resolvedBy!: string;
  mitigationActionTaken!: string;
}

export class UpdateFirewallRuleDto {
  ruleName!: string;
  direction!: 'INBOUND' | 'OUTBOUND';
  action!: 'ALLOW' | 'BLOCK' | 'RATE_LIMIT';
  cidrBlock!: string;
  portRange?: string;
  description?: string;
}

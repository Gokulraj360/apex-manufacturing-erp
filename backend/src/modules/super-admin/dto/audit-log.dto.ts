import { AuditAction, AuditSeverity } from '@prisma/client';

export interface CreateAuditLogDto {
  userId?: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  details: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity?: AuditSeverity;
}

export interface QueryAuditLogsDto {
  userId?: string;
  action?: AuditAction;
  entity?: string;
  severity?: AuditSeverity;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

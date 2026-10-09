import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from '../services/audit-log.service';
import { QueryAuditLogsDto } from '../dto/audit-log.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/super-admin/audit-logs')
@UseGuards(RBACGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'AUDIT_LOGS' })
  async getAuditLogs(@Query() query: QueryAuditLogsDto) {
    return this.auditLogService.getAuditLogs(query);
  }

  @Get('verify-integrity')
  @RequirePermissions({ action: 'READ', resource: 'AUDIT_LOGS' })
  async verifyIntegrity(@Query('count') count?: number) {
    return this.auditLogService.verifyIntegrity(count ? Number(count) : 100);
  }

  @Get('department-feed')
  @RequirePermissions({ action: 'READ', resource: 'AUDIT_LOGS' })
  async getDepartmentFeed(
    @Query('department') department?: string,
    @Query('severity') severity?: string,
    @Query('limit') limit?: number
  ) {
    const data = await this.auditLogService.getAggregatedDepartmentActivity({
      department,
      severity,
      limit: limit ? Number(limit) : 50,
    });
    return {
      success: true,
      data,
    };
  }

  @Get('summary')
  @RequirePermissions({ action: 'READ', resource: 'AUDIT_LOGS' })
  async getAuditSummary() {
    const data = await this.auditLogService.getDepartmentAuditSummary();
    return {
      success: true,
      data,
    };
  }
}

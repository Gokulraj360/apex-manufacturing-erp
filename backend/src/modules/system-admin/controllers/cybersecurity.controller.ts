import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CybersecurityService } from '../services/cybersecurity.service';
import {
  LogSecurityIncidentDto,
  ResolveSecurityIncidentDto,
  UpdateFirewallRuleDto,
} from '../dto/cybersecurity.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { SecurityIncidentSeverity } from '@prisma/client';

@Controller('api/v1/system-admin/security')
@UseGuards(RBACGuard)
export class CybersecurityController {
  constructor(private readonly securityService: CybersecurityService) {}

  @Get('incidents')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getIncidents(
    @Query('severity') severity?: SecurityIncidentSeverity,
    @Query('isResolved') isResolved?: string,
    @Query('search') search?: string,
  ) {
    const resolvedBool = isResolved !== undefined ? isResolved === 'true' : undefined;
    return this.securityService.getSecurityIncidents({ severity, isResolved: resolvedBool, search });
  }

  @Get('metrics')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getMetrics() {
    return this.securityService.getCybersecurityMetrics();
  }

  @Post('incidents')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async logIncident(@Body() dto: LogSecurityIncidentDto) {
    return this.securityService.logSecurityIncident(dto);
  }

  @Put('incidents/resolve')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async resolveIncident(@Body() dto: ResolveSecurityIncidentDto) {
    return this.securityService.resolveIncident(dto);
  }

  @Post('firewall/rules')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async updateFirewallRule(
    @Body() dto: UpdateFirewallRuleDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.securityService.updateFirewallRule(dto, adminUserId);
  }
}

import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { QueryAuditLogDto, CreateAuditLogDto } from './dto/audit.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  async getAuditLogs(@Query() query: QueryAuditLogDto) {
    return this.auditService.getAuditLogs(query);
  }

  @Get('logs/:id')
  async getAuditLogById(@Param('id') id: string) {
    return this.auditService.getAuditLogById(id);
  }

  @Get('stats')
  async getAuditStats() {
    return this.auditService.getAuditStats();
  }

  @Post('logs')
  async logEvent(@Body() dto: CreateAuditLogDto) {
    return this.auditService.logEvent(dto);
  }
}

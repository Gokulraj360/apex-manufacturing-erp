import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InfrastructureBackupService } from '../services/infrastructure-backup.service';
import {
  TriggerBackupDto,
  RestoreBackupDto,
} from '../dto/backup-infra.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { BackupStatus, BackupType } from '@prisma/client';

@Controller('api/v1/system-admin/backups')
@UseGuards(RBACGuard)
export class InfrastructureBackupController {
  constructor(private readonly backupService: InfrastructureBackupService) {}

  @Get('logs')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getBackupLogs(
    @Query('type') type?: BackupType,
    @Query('status') status?: BackupStatus,
  ) {
    return this.backupService.getBackupLogs(type, status);
  }

  @Get('metrics')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getMetrics() {
    return this.backupService.getStorageAndHealthMetrics();
  }

  @Post('trigger')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async triggerBackup(@Body() dto: TriggerBackupDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.backupService.triggerBackup(dto, adminUserId);
  }

  @Post('restore')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async restoreBackup(@Body() dto: RestoreBackupDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.backupService.restoreBackup(dto, adminUserId);
  }
}

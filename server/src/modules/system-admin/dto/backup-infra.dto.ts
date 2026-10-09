import { BackupType } from '@prisma/client';

export class TriggerBackupDto {
  backupType?: BackupType;
  storageDestination?: string;
  notes?: string;
}

export class RestoreBackupDto {
  backupId!: string;
  targetEnvironment!: 'STAGING' | 'PRODUCTION_RECOVERY';
  confirmationCode!: string;
}

export class ScheduleBackupCronDto {
  cronSchedule!: string; // e.g. '0 2 * * *' (Every night at 2:00 AM)
  backupType!: BackupType;
  retentionDays!: number;
}

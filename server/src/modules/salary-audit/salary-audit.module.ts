import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SalaryAuditService } from './salary-audit.service';
import { SalaryAuditController } from './salary-audit.controller';

@Module({
  controllers: [SalaryAuditController],
  providers: [
    PrismaService,
    SalaryAuditService,
  ],
  exports: [
    SalaryAuditService,
  ],
})
export class SalaryAuditModule {}

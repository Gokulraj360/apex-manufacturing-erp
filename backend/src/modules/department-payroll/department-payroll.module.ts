import { Module } from '@nestjs/common';
import { DepartmentPayrollController } from './department-payroll.controller';
import { DepartmentPayrollService } from './department-payroll.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DepartmentPayrollController],
  providers: [DepartmentPayrollService],
  exports: [DepartmentPayrollService],
})
export class DepartmentPayrollModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';

@Module({
  controllers: [LeaveController],
  providers: [PrismaService, LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}

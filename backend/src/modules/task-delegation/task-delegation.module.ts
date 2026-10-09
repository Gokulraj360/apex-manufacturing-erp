import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TaskDelegationService } from './task-delegation.service';
import { TaskDelegationController } from './task-delegation.controller';

@Module({
  controllers: [TaskDelegationController],
  providers: [PrismaService, TaskDelegationService],
  exports: [TaskDelegationService],
})
export class TaskDelegationModule {}

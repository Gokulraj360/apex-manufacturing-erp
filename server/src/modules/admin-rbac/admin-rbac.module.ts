import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminRbacService } from './admin-rbac.service';
import { AdminRbacController } from './admin-rbac.controller';
import { DynamicFunctionGuard } from './guards/admin-rbac.guard';

@Module({
  controllers: [AdminRbacController],
  providers: [
    PrismaService,
    AdminRbacService,
    DynamicFunctionGuard,
  ],
  exports: [
    AdminRbacService,
    DynamicFunctionGuard,
  ],
})
export class AdminRbacModule {}

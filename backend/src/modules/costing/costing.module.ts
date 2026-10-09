import { Module } from '@nestjs/common';
import { CostingController } from './costing.controller';
import { CostingService } from './costing.service';
import { PrismaModule } from '../../database/prisma.module';
import { OverheadsModule } from '../overheads/overheads.module';

@Module({
  imports: [PrismaModule, OverheadsModule],
  controllers: [CostingController],
  providers: [CostingService],
  exports: [CostingService],
})
export class CostingModule {}

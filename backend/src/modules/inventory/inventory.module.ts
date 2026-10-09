import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { CapacityController } from './capacity.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InventoryController, CapacityController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}

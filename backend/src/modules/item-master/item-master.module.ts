import { Module } from '@nestjs/common';
import { ItemMasterService } from './item-master.service';
import { ItemMasterController } from './item-master.controller';

@Module({
  controllers: [ItemMasterController],
  providers: [ItemMasterService],
  exports: [ItemMasterService],
})
export class ItemMasterModule {}

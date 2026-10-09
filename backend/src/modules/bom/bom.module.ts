import { Module } from '@nestjs/common';
import { BOMService } from './bom.service';
import { BOMController } from './bom.controller';

@Module({
  controllers: [BOMController],
  providers: [BOMService],
  exports: [BOMService],
})
export class BOMModule {}

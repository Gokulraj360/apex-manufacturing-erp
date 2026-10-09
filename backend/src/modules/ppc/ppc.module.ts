import { Module } from '@nestjs/common';
import { PPCService } from './ppc.service';
import { PPCController } from './ppc.controller';

@Module({
  controllers: [PPCController],
  providers: [PPCService],
  exports: [PPCService],
})
export class PPCModule {}

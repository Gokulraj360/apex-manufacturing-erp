import { Module } from '@nestjs/common';
import { OverheadsController } from './overheads.controller';
import { OverheadsService } from './overheads.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OverheadsController],
  providers: [OverheadsService],
  exports: [OverheadsService],
})
export class OverheadsModule {}

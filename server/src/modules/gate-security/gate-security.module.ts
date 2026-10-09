import { Module } from '@nestjs/common';
import { GateSecurityController } from './gate-security.controller';
import { GateSecurityService } from './gate-security.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GateSecurityController],
  providers: [GateSecurityService],
  exports: [GateSecurityService],
})
export class GateSecurityModule {}

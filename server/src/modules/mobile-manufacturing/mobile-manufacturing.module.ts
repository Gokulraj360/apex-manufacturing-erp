import { Module } from '@nestjs/common';
import { ImeiTrackingService } from './imei-tracking.service';
import { MobileAssemblyService } from './mobile-assembly.service';
import { MobileManufacturingController } from './mobile-manufacturing.controller';

@Module({
  controllers: [MobileManufacturingController],
  providers: [ImeiTrackingService, MobileAssemblyService],
  exports: [ImeiTrackingService, MobileAssemblyService],
})
export class MobileManufacturingModule {}

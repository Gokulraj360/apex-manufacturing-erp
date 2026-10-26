import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ImeiTrackingService } from './serialNumber-tracking.service';
import { MobileAssemblyService } from './mobile-assembly.service';

@Controller('api/mobile')
export class MobileManufacturingController {
  constructor(
    private readonly serialNumberService: ImeiTrackingService,
    private readonly assemblyService: MobileAssemblyService,
  ) {}

  @Get('lines')
  getAssemblyLines() {
    return {
      success: true,
      lines: this.assemblyService.getAssemblyLines(),
    };
  }

  @Get('telemetry/executive')
  getExecutiveShiftKpis() {
    return {
      success: true,
      data: this.assemblyService.getShiftExecutiveKpis(),
    };
  }

  @Get('serialNumber/telemetry')
  getImeiTelemetry() {
    return {
      success: true,
      data: this.serialNumberService.getImeiTelemetrySummary(),
    };
  }

  @Post('serialNumber/generate-pair')
  generateDualImei(
    @Body('model') model: 'PRO' | 'LITE' = 'PRO',
    @Body('sequenceNumber') sequenceNumber = 4812,
  ) {
    return {
      success: true,
      pair: this.serialNumberService.generateDualImeiPair(model, sequenceNumber),
    };
  }

  @Post('serialNumber/validate')
  validateImei(@Body('serialNumber') serialNumber: string) {
    return {
      success: true,
      result: this.serialNumberService.validateImei(serialNumber),
    };
  }

  @Get('shortages')
  getComponentShortages() {
    return {
      success: true,
      alerts: this.assemblyService.getComponentShortageAlerts(),
    };
  }
}

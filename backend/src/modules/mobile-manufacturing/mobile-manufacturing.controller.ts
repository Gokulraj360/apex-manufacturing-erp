import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ImeiTrackingService } from './imei-tracking.service';
import { MobileAssemblyService } from './mobile-assembly.service';

@Controller('api/mobile')
export class MobileManufacturingController {
  constructor(
    private readonly imeiService: ImeiTrackingService,
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

  @Get('imei/telemetry')
  getImeiTelemetry() {
    return {
      success: true,
      data: this.imeiService.getImeiTelemetrySummary(),
    };
  }

  @Post('imei/generate-pair')
  generateDualImei(
    @Body('model') model: 'PRO' | 'LITE' = 'PRO',
    @Body('sequenceNumber') sequenceNumber = 4812,
  ) {
    return {
      success: true,
      pair: this.imeiService.generateDualImeiPair(model, sequenceNumber),
    };
  }

  @Post('imei/validate')
  validateImei(@Body('imei') imei: string) {
    return {
      success: true,
      result: this.imeiService.validateImei(imei),
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

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Sse,
  MessageEvent,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SerializedService, TelemetryPayload, SerializedUnitRecord } from './serialized.service';
import { ScanSerializedUnitDto, QuerySerializedUnitsDto } from './dto/serialized.dto';
import { Observable, map } from 'rxjs';

@Controller(['production/serialized', 'api/production/serialized'])
export class SerializedController {
  constructor(private readonly serializedService: SerializedService) {}

  /**
   * Scan Serial UID / UID barcode and validate cleanroom station transition
   * Enforces prior station clearance and records checkpoint into JSONB audit trail
   */
  @Post('scan')
  @HttpCode(HttpStatus.OK)
  async scanSerializedUnit(@Body() dto: ScanSerializedUnitDto) {
    return this.serializedService.scanSerializedUnit(dto);
  }

  /**
   * Get all active serialized units on the shop floor
   */
  @Get('units')
  async findAllUnits(@Query() query: QuerySerializedUnitsDto): Promise<SerializedUnitRecord[]> {
    return this.serializedService.findAllUnits(query);
  }

  /**
   * Get single serialized unit with complete history logs
   */
  @Get('units/:serialNumber')
  async findUnitBySerial(@Param('serialNumber') serialNumber: string): Promise<SerializedUnitRecord> {
    return this.serializedService.findUnitBySerial(serialNumber);
  }

  /**
   * Get latest live machine telemetry metrics (OEE, Nitrogen Oven Temp, Screwdriver Torque)
   */
  @Get('telemetry/latest')
  getLatestTelemetry(): TelemetryPayload {
    return this.serializedService.getLatestTelemetry();
  }

  /**
   * Server-Sent Events (SSE) gateway for real-time machine telemetry streaming
   * Streams reflow temperature spikes and torque variances exceeding ±0.02 Nm
   */
  @Sse('telemetry/stream')
  streamTelemetry(): Observable<MessageEvent> {
    return this.serializedService.getTelemetryStream().pipe(
      map((telemetry) => ({
        data: telemetry,
      } as MessageEvent))
    );
  }

  /**
   * Simulator endpoint to trigger thermal spikes or torque out-of-tolerance alarms
   */
  @Post('telemetry/simulate')
  @HttpCode(HttpStatus.OK)
  simulateTelemetry(
    @Body() body: { type: 'TEMP_SPIKE' | 'TORQUE_OUT_OF_BOUNDS' | 'O2_PPM_HIGH' | 'NORMAL' }
  ): TelemetryPayload {
    return this.serializedService.simulateTelemetryVariance(body.type || 'NORMAL');
  }
}

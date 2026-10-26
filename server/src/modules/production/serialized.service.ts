import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  ScanSerializedUnitDto,
  ProductionStationEnum,
  SerializedUnitStatusEnum,
  QuerySerializedUnitsDto,
} from './dto/serialized.dto';
import { Observable, Subject, interval, map, merge } from 'rxjs';

export interface StationCheckpoint {
  checkpointId: string;
  station: ProductionStationEnum;
  status: SerializedUnitStatusEnum;
  operatorId: string;
  operatorName: string;
  timestamp: string;
  testMetrics?: Record<string, any>;
  defectReason?: string;
  remarks?: string;
}

export interface SerializedUnitRecord {
  id: string;
  serialNumber: string;
  productId: string;
  productName: string;
  currentStation: ProductionStationEnum;
  status: SerializedUnitStatusEnum;
  historyLogs: StationCheckpoint[];
  createdAt: string;
  updatedAt: string;
}

export interface TelemetryPayload {
  machineId: string;
  lineId: string;
  reflowTemp: number; // Peak Zone Temp °C (Target 249.5, Tol 245-253)
  oxygenPpm: number; // Nitrogen chamber oxygen (Target < 45, Alert > 50)
  torqueNm: number; // Robotic screwdriver (Calibrated 0.35, Tol ±0.02)
  oeeAvailability: number;
  oeePerformance: number;
  oeeQuality: number;
  oeeComposite: number;
  hasTemperatureSpike: boolean;
  hasTorqueVariance: boolean;
  hasOxygenPpmAlert: boolean;
  activeAlerts: string[];
  timestamp: string;
}

@Injectable()
export class SerializedService {
  private readonly logger = new Logger(SerializedService.name);

  // Station Progression Order
  public readonly STATION_SEQUENCE: ProductionStationEnum[] = [
    ProductionStationEnum.SMT_LINE,
    ProductionStationEnum.OPTICAL_AOI,
    ProductionStationEnum.SCREWDRIVING,
    ProductionStationEnum.RF_ANTENNA,
    ProductionStationEnum.BATTERY_SEAL,
    ProductionStationEnum.PACKAGING,
  ];

  // In-memory telemetry stream Subject for real-time SSE push
  private telemetrySubject$ = new Subject<TelemetryPayload>();

  // In-memory active units buffer with comprehensive cleanroom history
  private activeUnits: Map<string, SerializedUnitRecord> = new Map();

  // Latest Telemetry Cache
  private latestTelemetry: TelemetryPayload = {
    machineId: 'CLEANROOM-CELL-01',
    lineId: 'LINE-01-CLEANROOM',
    reflowTemp: 249.4,
    oxygenPpm: 34.2,
    torqueNm: 0.351,
    oeeAvailability: 96.5,
    oeePerformance: 94.8,
    oeeQuality: 99.2,
    oeeComposite: 90.7,
    hasTemperatureSpike: false,
    hasTorqueVariance: false,
    hasOxygenPpmAlert: false,
    activeAlerts: [],
    timestamp: new Date().toISOString(),
  };

  constructor(private readonly prisma: PrismaService) {
    this.seedBaselineUnits();
  }

  /**
   * Seed realistic cleanroom units for immediate operational audit trail
   */
  private seedBaselineUnits() {
    const defaultProduct = 'Apex Pro 5G - Ceramic Black (12GB/256GB)';
    const defaultProductId = 'prod-phone-001';

    const units: SerializedUnitRecord[] = [
      {
        id: 'ser-001',
        serialNumber: '864902061234567',
        productId: defaultProductId,
        productName: defaultProduct,
        currentStation: ProductionStationEnum.BATTERY_SEAL,
        status: SerializedUnitStatusEnum.PASSED,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 300000).toISOString(),
        historyLogs: [
          {
            checkpointId: 'chk-01',
            station: ProductionStationEnum.SMT_LINE,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-SMT-101',
            operatorName: 'Sunil Verma',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            testMetrics: { solderPasteThicknessUm: 122.4, reflowPeakTemp: 249.1, nitrogenPpm: 32 },
            remarks: 'SMT stencil print within ±3μm tolerance.',
          },
          {
            checkpointId: 'chk-02',
            station: ProductionStationEnum.OPTICAL_AOI,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-AOI-204',
            operatorName: 'Priya Sharma',
            timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
            testMetrics: { falseNegativeRate: 0.0, solderBridgeDetected: false, tombstoning: false },
            remarks: '3D Optical AOI pass. All 1,480 solder balls uniform.',
          },
          {
            checkpointId: 'chk-03',
            station: ProductionStationEnum.SCREWDRIVING,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-ROBO-302',
            operatorName: 'Aakash Patel',
            timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
            testMetrics: { torqueNm: 0.351, targetTorqueNm: 0.35, angleDegrees: 720 },
            remarks: '6x M1.4 aviation chassis screws fastened to spec.',
          },
          {
            checkpointId: 'chk-04',
            station: ProductionStationEnum.RF_ANTENNA,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-RF-410',
            operatorName: 'Deepak Rao',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            testMetrics: { vswr: 1.15, gainDbi: 3.4, bleSnrDb: 42.1 },
            remarks: '5G Sub-6 & mmWave phased array VSWR within spec.',
          },
          {
            checkpointId: 'chk-05',
            station: ProductionStationEnum.BATTERY_SEAL,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-BAT-505',
            operatorName: 'Meera Nair',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            testMetrics: { vacuumSealKpa: 98.6, thermalConductivityWmk: 14.2 },
            remarks: 'Battery chamber hermetic pressure test passed.',
          },
        ],
      },
      {
        id: 'ser-002',
        serialNumber: '864902061234568',
        productId: defaultProductId,
        productName: defaultProduct,
        currentStation: ProductionStationEnum.SCREWDRIVING,
        status: SerializedUnitStatusEnum.PASSED,
        createdAt: new Date(Date.now() - 2400000).toISOString(),
        updatedAt: new Date(Date.now() - 600000).toISOString(),
        historyLogs: [
          {
            checkpointId: 'chk-11',
            station: ProductionStationEnum.SMT_LINE,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-SMT-101',
            operatorName: 'Sunil Verma',
            timestamp: new Date(Date.now() - 2400000).toISOString(),
            testMetrics: { reflowPeakTemp: 249.8 },
          },
          {
            checkpointId: 'chk-12',
            station: ProductionStationEnum.OPTICAL_AOI,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-AOI-204',
            operatorName: 'Priya Sharma',
            timestamp: new Date(Date.now() - 1500000).toISOString(),
            testMetrics: { defectCount: 0 },
          },
          {
            checkpointId: 'chk-13',
            station: ProductionStationEnum.SCREWDRIVING,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-ROBO-302',
            operatorName: 'Aakash Patel',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            testMetrics: { torqueNm: 0.349, targetTorqueNm: 0.35 },
            remarks: 'Fastening verified.',
          },
        ],
      },
      {
        id: 'ser-003',
        serialNumber: '864902061234569',
        productId: defaultProductId,
        productName: defaultProduct,
        currentStation: ProductionStationEnum.SCREWDRIVING,
        status: SerializedUnitStatusEnum.REJECTED,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 400000).toISOString(),
        historyLogs: [
          {
            checkpointId: 'chk-21',
            station: ProductionStationEnum.SMT_LINE,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-SMT-102',
            operatorName: 'Vikram Singh',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            testMetrics: { reflowPeakTemp: 248.9 },
          },
          {
            checkpointId: 'chk-22',
            station: ProductionStationEnum.OPTICAL_AOI,
            status: SerializedUnitStatusEnum.PASSED,
            operatorId: 'OP-AOI-204',
            operatorName: 'Priya Sharma',
            timestamp: new Date(Date.now() - 1100000).toISOString(),
            testMetrics: { defectCount: 0 },
          },
          {
            checkpointId: 'chk-23',
            station: ProductionStationEnum.SCREWDRIVING,
            status: SerializedUnitStatusEnum.REJECTED,
            operatorId: 'OP-ROBO-302',
            operatorName: 'Aakash Patel',
            timestamp: new Date(Date.now() - 400000).toISOString(),
            testMetrics: { torqueNm: 0.392, targetTorqueNm: 0.35, variance: 0.042 },
            defectReason: 'Stripped thread error: Torque exceeded allowable ±0.02 Nm threshold (0.392 Nm).',
            remarks: 'Diverted to cleanroom rework quarantine bin Q-04.',
          },
        ],
      },
    ];

    for (const unit of units) {
      this.activeUnits.set(unit.serialNumber, unit);
    }
  }

  /**
   * Scan Serialized Serial UID / UID and execute station transit validation
   */
  async scanSerializedUnit(dto: ScanSerializedUnitDto): Promise<{
    unit: SerializedUnitRecord;
    message: string;
    priorStationCleared: boolean;
  }> {
    const { serialNumber, targetStation, operatorId, operatorName, qcDisposition, defectReason, testMetrics, remarks } = dto;

    // 1. Validate 15-digit format
    const cleanSerial = serialNumber.trim().toUpperCase();
    if (cleanSerial.length < 15 || cleanSerial.length > 20) {
      throw new BadRequestException(
        `Invalid Serial UID/Serial format: ${cleanSerial}. Cleanroom units must have a 15-20 digit UID/Serial UID.`
      );
    }

    const targetStationIndex = this.STATION_SEQUENCE.indexOf(targetStation);
    if (targetStationIndex === -1) {
      throw new BadRequestException(`Unrecognized station: ${targetStation}`);
    }

    // 2. Fetch existing unit from in-memory or database
    let unit = this.activeUnits.get(cleanSerial);

    if (!unit) {
      try {
        const dbUnit = await this.prisma.serializedUnit.findUnique({
          where: { serialNumber: cleanSerial },
          include: { product: true },
        });

        if (dbUnit) {
          unit = {
            id: dbUnit.id,
            serialNumber: dbUnit.serialNumber,
            productId: dbUnit.productId,
            productName: dbUnit.product?.name || 'Apex Industrial Precision Unit',
            currentStation: dbUnit.currentStation as unknown as ProductionStationEnum,
            status: dbUnit.status as unknown as SerializedUnitStatusEnum,
            historyLogs: (dbUnit.historyLogs as any) || [],
            createdAt: dbUnit.createdAt.toISOString(),
            updatedAt: dbUnit.updatedAt.toISOString(),
          };
          this.activeUnits.set(cleanSerial, unit);
        }
      } catch (err) {
        this.logger.warn(`Prisma lookup failed, continuing with in-memory buffer: ${err}`);
      }
    }

    // 3. Station Check & Sequence Enforcement
    if (!unit) {
      // Genesis station check: Only SMT_LINE can originate a new serialized board
      if (targetStationIndex !== 0) {
        const firstStation = this.STATION_SEQUENCE[0];
        throw new BadRequestException(
          `Unit ${cleanSerial} is not yet registered. New serialized units must originate at genesis station [${firstStation}]. Transit to [${targetStation}] was denied.`
        );
      }

      // Initialize new unit
      unit = {
        id: `ser-${Date.now()}`,
        serialNumber: cleanSerial,
        productId: 'prod-phone-001',
        productName: 'Apex Pro 5G - Cleanroom Board',
        currentStation: targetStation,
        status: qcDisposition || SerializedUnitStatusEnum.PASSED,
        historyLogs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Unit already exists: Check prior station clearance
      const currentStationIndex = this.STATION_SEQUENCE.indexOf(unit.currentStation);

      // Check if unit is in REJECTED state from prior step
      if (unit.status === SerializedUnitStatusEnum.REJECTED && qcDisposition !== SerializedUnitStatusEnum.PASSED) {
        throw new BadRequestException(
          `Station transit rejected: Unit ${cleanSerial} failed QC at station [${unit.currentStation}] and is currently locked in Quarantine/Rework. Must clear rework inspection before proceeding.`
        );
      }

      // Check for skipping stations: targetStation must be <= currentStationIndex + 1
      if (targetStationIndex > currentStationIndex + 1) {
        const expectedNext = this.STATION_SEQUENCE[currentStationIndex + 1];
        throw new BadRequestException(
          `Station transit rejected: Unit ${cleanSerial} skipped mandatory station [${expectedNext}]. Cleanroom quality protocol requires strict sequential sign-off.`
        );
      }

      // Check if previous step was cleared with PASSED
      const lastCheckpoint = unit.historyLogs[unit.historyLogs.length - 1];
      if (lastCheckpoint && lastCheckpoint.status === SerializedUnitStatusEnum.REJECTED && targetStationIndex > currentStationIndex) {
        throw new BadRequestException(
          `Station transit rejected: Prior station [${lastCheckpoint.station}] did not clear QC (Defect: ${lastCheckpoint.defectReason || 'Unresolved'}). Unit cannot advance to [${targetStation}].`
        );
      }
    }

    // 4. Record new Checkpoint in Audit Trail
    const newCheckpoint: StationCheckpoint = {
      checkpointId: `chk-${Date.now()}`,
      station: targetStation,
      status: qcDisposition || SerializedUnitStatusEnum.PASSED,
      operatorId,
      operatorName: operatorName || `Cleanroom Op (${operatorId})`,
      timestamp: new Date().toISOString(),
      testMetrics: testMetrics || this.generateStationMetrics(targetStation),
      defectReason: qcDisposition === SerializedUnitStatusEnum.REJECTED ? defectReason || 'QC Rejection recorded' : undefined,
      remarks: remarks || (qcDisposition === SerializedUnitStatusEnum.PASSED ? 'Checkpoint passed standard cleanroom inspection.' : 'Defect flagged for rework.'),
    };

    unit.currentStation = targetStation;
    unit.status = qcDisposition || SerializedUnitStatusEnum.PASSED;
    unit.historyLogs.push(newCheckpoint);
    unit.updatedAt = new Date().toISOString();

    // 5. Persist to in-memory map & database if available
    this.activeUnits.set(cleanSerial, unit);

    try {
      await this.prisma.serializedUnit.upsert({
        where: { serialNumber: cleanSerial },
        create: {
          serialNumber: cleanSerial,
          productId: unit.productId,
          currentStation: targetStation as any,
          status: unit.status as any,
          historyLogs: unit.historyLogs as any,
        },
        update: {
          currentStation: targetStation as any,
          status: unit.status as any,
          historyLogs: unit.historyLogs as any,
        },
      });
    } catch (err) {
      this.logger.warn(`Could not persist serialized unit to database: ${err}`);
    }

    return {
      unit,
      message: `Station transit confirmed: Unit ${cleanSerial} scanned at [${targetStation}] with status [${unit.status}].`,
      priorStationCleared: true,
    };
  }

  /**
   * Helper to generate realistic station test metrics
   */
  private generateStationMetrics(station: ProductionStationEnum): Record<string, any> {
    switch (station) {
      case ProductionStationEnum.SMT_LINE:
        return {
          reflowPeakTemp: 249.2,
          nitrogenO2Ppm: 34.5,
          solderJointVoidPct: 1.2,
          solderThicknessUm: 124.0,
        };
      case ProductionStationEnum.OPTICAL_AOI:
        return {
          visionScore: 99.8,
          componentSkewMm: 0.01,
          solderBridges: 0,
          tombstoneDefects: 0,
        };
      case ProductionStationEnum.SCREWDRIVING:
        return {
          torqueNm: 0.351,
          calibratedTargetNm: 0.35,
          tighteningAngleDeg: 720,
          fastenerStatus: 'CALIBRATED_PASS',
        };
      case ProductionStationEnum.RF_ANTENNA:
        return {
          vswr: 1.14,
          radiatedPowerDbm: 24.2,
          wifiThroughputMbps: 920,
          gnssFixSec: 1.8,
        };
      case ProductionStationEnum.BATTERY_SEAL:
        return {
          vacuumSealPressureKPa: 98.8,
          laserWeldDepthMm: 0.45,
          heliumLeakRateAtmCcSec: 1.2e-8,
        };
      case ProductionStationEnum.PACKAGING:
        return {
          serialNumberLabelMatch: true,
          antiTamperSealAffixed: true,
          boxWeightGrams: 485.2,
        };
      default:
        return {};
    }
  }

  /**
   * Query all serialized units with filtering
   */
  async findAllUnits(query: QuerySerializedUnitsDto): Promise<SerializedUnitRecord[]> {
    let results = Array.from(this.activeUnits.values());

    if (query.serialNumber) {
      results = results.filter((u) => u.serialNumber.includes(query.serialNumber!.trim()));
    }
    if (query.station) {
      results = results.filter((u) => u.currentStation === query.station);
    }
    if (query.status) {
      results = results.filter((u) => u.status === query.status);
    }

    return results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Get single unit with complete history
   */
  async findUnitBySerial(serialNumber: string): Promise<SerializedUnitRecord> {
    const clean = serialNumber.trim().toUpperCase();
    const unit = this.activeUnits.get(clean);
    if (!unit) {
      throw new NotFoundException(`Serialized unit with Serial UID/Serial [${clean}] not found in cleanroom registry.`);
    }
    return unit;
  }

  /**
   * Get latest IoT Machine Telemetry snapshot
   */
  getLatestTelemetry(): TelemetryPayload {
    return this.latestTelemetry;
  }

  /**
   * Telemetry streaming Observable (for SSE endpoint)
   * Dispatches live simulated cleanroom telemetry every 2 seconds,
   * injecting subtle real-world variances and spike detection
   */
  getTelemetryStream(): Observable<TelemetryPayload> {
    const ticker$ = interval(2000).pipe(
      map(() => {
        // Random micro-variance
        const tempVariation = (Math.random() - 0.48) * 0.8;
        const reflowTemp = Number((249.4 + tempVariation).toFixed(1));

        const torqueVariation = (Math.random() - 0.49) * 0.015;
        const torqueNm = Number((0.35 + torqueVariation).toFixed(3));

        const oxygenVariation = (Math.random() - 0.5) * 4;
        const oxygenPpm = Number(Math.max(15, 34 + oxygenVariation).toFixed(1));

        // Detect alerts
        const alerts: string[] = [];
        const hasTemperatureSpike = reflowTemp > 252.0 || reflowTemp < 246.0;
        if (hasTemperatureSpike) {
          alerts.push(`Reflow peak temp warning: ${reflowTemp}°C out of thermal window (246.0-252.0°C)`);
        }

        const hasTorqueVariance = Math.abs(torqueNm - 0.35) > 0.02;
        if (hasTorqueVariance) {
          alerts.push(`Screwdriver torque alert: ${torqueNm} Nm exceeds ±0.02 Nm calibration threshold!`);
        }

        const hasOxygenPpmAlert = oxygenPpm > 48;
        if (hasOxygenPpmAlert) {
          alerts.push(`Nitrogen chamber O2 alert: ${oxygenPpm} PPM exceeds 48 PPM limit!`);
        }

        this.latestTelemetry = {
          machineId: 'CLEANROOM-CELL-01',
          lineId: 'LINE-01-CLEANROOM',
          reflowTemp,
          oxygenPpm,
          torqueNm,
          oeeAvailability: 96.5,
          oeePerformance: 94.8,
          oeeQuality: 99.2,
          oeeComposite: 90.7,
          hasTemperatureSpike,
          hasTorqueVariance,
          hasOxygenPpmAlert,
          activeAlerts: alerts,
          timestamp: new Date().toISOString(),
        };

        return this.latestTelemetry;
      })
    );

    return merge(ticker$, this.telemetrySubject$);
  }

  /**
   * Manual trigger to test spikes & alerts
   */
  simulateTelemetryVariance(type: 'TEMP_SPIKE' | 'TORQUE_OUT_OF_BOUNDS' | 'O2_PPM_HIGH' | 'NORMAL'): TelemetryPayload {
    const alerts: string[] = [];
    let reflowTemp = 249.4;
    let torqueNm = 0.35;
    let oxygenPpm = 32.5;

    let hasTemperatureSpike = false;
    let hasTorqueVariance = false;
    let hasOxygenPpmAlert = false;

    if (type === 'TEMP_SPIKE') {
      reflowTemp = 254.8; // Exceeds 252°C
      hasTemperatureSpike = true;
      alerts.push('CRITICAL: Reflow peak temperature spiked to 254.8°C! Component degradation risk.');
    } else if (type === 'TORQUE_OUT_OF_BOUNDS') {
      torqueNm = 0.384; // Exceeds 0.35 + 0.02
      hasTorqueVariance = true;
      alerts.push('CRITICAL: Robotic screwdriver torque reached 0.384 Nm (> 0.370 Nm limit)!');
    } else if (type === 'O2_PPM_HIGH') {
      oxygenPpm = 64.0; // Exceeds 48 ppm
      hasOxygenPpmAlert = true;
      alerts.push('WARNING: Nitrogen reflow oxygen level at 64.0 PPM. Solder oxidation risk.');
    }

    this.latestTelemetry = {
      machineId: 'CLEANROOM-CELL-01',
      lineId: 'LINE-01-CLEANROOM',
      reflowTemp,
      oxygenPpm,
      torqueNm,
      oeeAvailability: 95.8,
      oeePerformance: 93.6,
      oeeQuality: 98.4,
      oeeComposite: 89.2,
      hasTemperatureSpike,
      hasTorqueVariance,
      hasOxygenPpmAlert,
      activeAlerts: alerts,
      timestamp: new Date().toISOString(),
    };

    this.telemetrySubject$.next(this.latestTelemetry);
    return this.latestTelemetry;
  }
}

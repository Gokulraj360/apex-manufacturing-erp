import { Injectable } from '@nestjs/common';

export interface MobileAssemblyLineDto {
  lineNumber: number;
  lineName: string;
  stageCode: string;
  stageDescription: string;
  targetUnits: number;
  actualUnits: number;
  firstPassYieldPct: number;
  defectPpm: number;
  cycleTimeSeconds: number;
  operatorCount: number;
  cleanroomLevel: string;
  status: 'OPTIMAL' | 'OPERATIONAL_WITH_WARNINGS' | 'CRITICAL_DOWNTIME';
  keyEquipment: string;
}

export interface MobileComponentShortageAlert {
  sku: string;
  componentName: string;
  category: string;
  currentStockUnits: number;
  dailyConsumptionRate: number;
  stockCoverDays: number;
  severity: 'NORMAL' | 'WARNING' | 'CRITICAL';
  supplier: string;
}

@Injectable()
export class MobileAssemblyService {
  /**
   * Return real-time status of all 6 smartphone assembly lines
   */
  public getAssemblyLines(): MobileAssemblyLineDto[] {
    return [
      {
        lineNumber: 1,
        lineName: 'Line 1: SMT (Surface Mount Technology) & PCB Placement',
        stageCode: 'STAGE_1_SMT_PCB',
        stageDescription: 'High-speed robotic chip pick-and-place, solder paste inspection (SPI), reflow oven.',
        targetUnits: 7600,
        actualUnits: 7420,
        firstPassYieldPct: 99.4,
        defectPpm: 24,
        cycleTimeSeconds: 12,
        operatorCount: 18,
        cleanroomLevel: 'Class 10,000 (ISO 7)',
        status: 'OPTIMAL',
        keyEquipment: 'ASM Pacific High-Speed Modular Mounter, Koh Young 3D SPI',
      },
      {
        lineNumber: 2,
        lineName: 'Line 2: Cleanroom Display Lamination & Touch Bonding',
        stageCode: 'STAGE_2_DISPLAY_LAMINATION',
        stageDescription: 'Optical clear adhesive (OCA) lamination, vacuum touch panel bonding, bubble autoclave.',
        targetUnits: 7600,
        actualUnits: 7350,
        firstPassYieldPct: 98.8,
        defectPpm: 45,
        cycleTimeSeconds: 15,
        operatorCount: 22,
        cleanroomLevel: 'Class 100 (ISO 5 Cleanroom)',
        status: 'OPTIMAL',
        keyEquipment: 'Automated Vacuum OCA Laminator, High-Pressure Autoclave Chamber',
      },
      {
        lineNumber: 3,
        lineName: 'Line 3: Camera Module & Optical Sensor Calibration',
        stageCode: 'STAGE_3_CAMERA_CALIBRATION',
        stageDescription: 'Multi-axis active alignment (AA), OIS gyroscope calibration, spectral chart tuning.',
        targetUnits: 7600,
        actualUnits: 7290,
        firstPassYieldPct: 98.2,
        defectPpm: 72,
        cycleTimeSeconds: 18,
        operatorCount: 26,
        cleanroomLevel: 'Class 1,000 (ISO 6)',
        status: 'OPTIMAL',
        keyEquipment: 'Active Alignment Optical Collimator, Tri-Axis Chart Test Station',
      },
      {
        lineNumber: 4,
        lineName: 'Line 4: OS Flashing, IMEI Burn-in, & RF 5G Calibration',
        stageCode: 'STAGE_4_OS_FLASH_RF_TEST',
        stageDescription: 'High-speed USB-C firmware burn, Dual SIM IMEI write, 5G Sub-6GHz/LTE anechoic chamber test.',
        targetUnits: 7600,
        actualUnits: 7210,
        firstPassYieldPct: 99.1,
        defectPpm: 38,
        cycleTimeSeconds: 22,
        operatorCount: 20,
        cleanroomLevel: 'ESD Static Controlled',
        status: 'OPTIMAL',
        keyEquipment: 'Multi-DUT OS Flashing Dock, Rohde & Schwarz CMX500 5G Radio Tester',
      },
      {
        lineNumber: 5,
        lineName: 'Line 5: Final Aging Stress Test & Laser Engraving',
        stageCode: 'STAGE_5_AGING_DROP_TEST',
        stageDescription: '4-hour 45°C thermal thermal bake, 1.5m tumble drop check, rear chassis laser CE/IMEI mark.',
        targetUnits: 7600,
        actualUnits: 7150,
        firstPassYieldPct: 97.9,
        defectPpm: 88,
        cycleTimeSeconds: 24,
        operatorCount: 16,
        cleanroomLevel: 'Industrial Production',
        status: 'OPERATIONAL_WITH_WARNINGS',
        keyEquipment: 'Constant Temperature Burn-in Chamber, Trumpf Fiber Laser Engraver',
      },
      {
        lineNumber: 6,
        lineName: 'Line 6: Retail Box Packing, Accessories & IMEI Barcode',
        stageCode: 'STAGE_6_BOX_PACKING_IMEI_SCAN',
        stageDescription: '67W GaN charger insertion, retail seal application, box GS1-128 barcode match verification.',
        targetUnits: 7600,
        actualUnits: 7080,
        firstPassYieldPct: 99.8,
        defectPpm: 12,
        cycleTimeSeconds: 14,
        operatorCount: 30,
        cleanroomLevel: 'Packaging Bay',
        status: 'OPTIMAL',
        keyEquipment: 'Automated Box Carton Former, Zebra GS1-128 Laser Inspection Scanner',
      },
    ];
  }

  /**
   * Component shortage risk alerts for mobile manufacturing (SoC, Display, Memory)
   */
  public getComponentShortageAlerts(): MobileComponentShortageAlert[] {
    return [
      {
        sku: 'SOC-QCOM-8GEN3-01',
        componentName: 'Qualcomm Snapdragon 8 Gen-3 Octa-Core SoC',
        category: 'Semiconductor / Chipset',
        currentStockUnits: 31920,
        dailyConsumptionRate: 7600,
        stockCoverDays: 4.2,
        severity: 'WARNING',
        supplier: 'Qualcomm Enterprise Direct',
      },
      {
        sku: 'DISP-AMOLED-144-02',
        componentName: '6.78" 1.5K 144Hz LTPO AMOLED Panel Assembly',
        category: 'Display / Optoelectronics',
        currentStockUnits: 48640,
        dailyConsumptionRate: 7600,
        stockCoverDays: 6.4,
        severity: 'NORMAL',
        supplier: 'BOE Display Technologies',
      },
      {
        sku: 'CAM-SONY-IMX989-03',
        componentName: 'Sony IMX989 50MP 1-inch Optical Camera Module',
        category: 'Optics & Sensors',
        currentStockUnits: 25840,
        dailyConsumptionRate: 7600,
        stockCoverDays: 3.4,
        severity: 'CRITICAL',
        supplier: 'Sony Semiconductor Solutions',
      },
      {
        sku: 'BAT-LION-5400MAH-04',
        componentName: '5400mAh High-Density Dual-Cell Li-ion Battery',
        category: 'Power & Storage',
        currentStockUnits: 62320,
        dailyConsumptionRate: 7600,
        stockCoverDays: 8.2,
        severity: 'NORMAL',
        supplier: 'Sunwoda Electronic Co.',
      },
    ];
  }

  /**
   * Executive shift KPI summary for Owner / MD
   */
  public getShiftExecutiveKpis() {
    const lines = this.getAssemblyLines();
    const totalTarget = lines.reduce((acc, l) => acc + l.targetUnits, 0);
    const totalActual = lines.reduce((acc, l) => acc + l.actualUnits, 0);
    const avgFpy = lines.reduce((acc, l) => acc + l.firstPassYieldPct, 0) / lines.length;
    const avgPpm = Math.round(lines.reduce((acc, l) => acc + l.defectPpm, 0) / lines.length);

    return {
      facilityName: 'ApexMobile Plant #01 (Advanced Terminal Assembly)',
      currentShift: 'Shift A (06:00 - 14:00)',
      targetPhoneUnits: 7600,
      assembledPhoneUnits: 7080,
      shiftProgressPct: 93.15,
      overallFirstPassYield: Number(avgFpy.toFixed(2)),
      averageDefectPpm: avgPpm,
      linesActive: 6,
      linesOptimal: 5,
      linesWarning: 1,
      linesCritical: 0,
      cleanroomAirQuality: 'Class 100 Maintained (21.5°C / 48% RH)',
    };
  }
}

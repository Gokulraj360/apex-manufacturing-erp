'use client';

import { useState, useEffect } from 'react';

/**
 * Apex Multi-Franchise Industrial Operating System Profile Store
 * 
 * Supports dynamic switching between multi-plant franchise profiles:
 * - High-Tech Electronics & Smart Hardware Franchise (Austin, TX)
 * - Automotive EV Powertrain & Battery Packs Franchise (Stuttgart, Germany)
 * - Industrial Automation & Robotics Franchise (Singapore Innovation District)
 * - Consumer Goods & High-Speed Process Packaging Franchise (Chicago, IL)
 * - Precision Medical Devices & Diagnostics Franchise (Basel, Switzerland)
 */

export interface FranchiseProductionLine {
  number: number;
  name: string;
  stageDesc: string;
  sku: string;
  actual: number;
  target: number;
  fpy: number;
  defectPpm: number;
  health: 'OPTIMAL' | 'OPERATIONAL_WITH_WARNINGS' | 'CRITICAL';
}

export interface FranchiseProfile {
  id: string;
  name: string;
  plantName: string;
  city: string;
  country: string;
  flag: string;
  primaryIndustry: string;
  currency: string;
  currencySymbol: string;
  annualCapacity: string;
  operatingLines: number;
  totalWorkforce: number;
  isoStandard: string;
  accentColor: string;
  flagshipProduct: string;
  productSeries: string[];
  productionLines: FranchiseProductionLine[];
}

export const FRANCHISE_PROFILES: FranchiseProfile[] = [
  {
    id: 'franchise-electronics',
    name: 'Electronics & Smart Devices Franchise',
    plantName: 'Plant 1: Austin Advanced Electronics Facility',
    city: 'Austin, Texas',
    country: 'USA',
    flag: '🇺🇸',
    primaryIndustry: 'Discrete Electronics & Smart Hardware',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '1,200,000 Units',
    operatingLines: 6,
    totalWorkforce: 420,
    isoStandard: 'ISO 9001 / ISO 14001',
    accentColor: 'blue',
    flagshipProduct: 'Apex Industrial Module Pro',
    productSeries: [
      'Apex Industrial Module Pro (Titanium Series)',
      'Apex Core Automation Unit (Enterprise Series)',
      'Apex Precision Controller Ultra (Modular Series)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Precision SMT & Board Assembly',
        stageDesc: 'Robotic chip placement, optical board inspection, and reflow ovens',
        sku: 'SMT-PCB-CORE-MOD',
        actual: 7420,
        target: 7600,
        fpy: 99.4,
        defectPpm: 24,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Core Subassembly & Component Bonding',
        stageDesc: 'Cleanroom component bonding and precision pressure sealing',
        sku: 'SUBASM-CORE-BOND',
        actual: 7350,
        target: 7600,
        fpy: 98.8,
        defectPpm: 45,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: Sensor Calibration & Optical Alignment',
        stageDesc: 'Optical alignment, precision telemetry calibration, and response tuning',
        sku: 'CALIB-OPTICAL-SENSOR',
        actual: 7290,
        target: 7600,
        fpy: 98.2,
        defectPpm: 72,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Firmware Flashing & Telemetry Diagnostics',
        stageDesc: 'Install system firmware, register serial numbers, and test wireless telemetry',
        sku: 'SYS-RF-SERIAL-PROG',
        actual: 7210,
        target: 7600,
        fpy: 99.1,
        defectPpm: 38,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Thermal Stress & Impact Durability Chamber',
        stageDesc: 'Thermal stress cycles, structural drop resistance, and laser serial marking',
        sku: 'AGING-DROP-TEST',
        actual: 7150,
        target: 7600,
        fpy: 97.9,
        defectPpm: 88,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: Automated Packaging & Outbound Palletization',
        stageDesc: 'Seal retail packaging, add accessories, and verify master carton barcodes',
        sku: 'BOX-PACK-DISPATCH',
        actual: 7080,
        target: 7600,
        fpy: 99.8,
        defectPpm: 12,
        health: 'OPTIMAL',
      },
    ],
  },
  {
    id: 'franchise-ev',
    name: 'Automotive EV Powertrain Franchise',
    plantName: 'Plant 2: Stuttgart EV Battery & Inverter Hub',
    city: 'Stuttgart',
    country: 'Germany',
    flag: '🇩🇪',
    primaryIndustry: 'Automotive E-Mobility & Battery Systems',
    currency: 'EUR',
    currencySymbol: '€',
    annualCapacity: '450,000 Packs',
    operatingLines: 6,
    totalWorkforce: 580,
    isoStandard: 'IATF 16949 / ISO 26262',
    accentColor: 'emerald',
    flagshipProduct: 'Apex EV High-Voltage Inverter 800V',
    productSeries: [
      'Apex EV High-Voltage Inverter 800V (Silicon Carbide)',
      'Apex Modular Lithium Battery Block (100 kWh)',
      'Apex Dual-Motor Integrated Drive Unit (350 kW)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Stator Precision Winding & Rotor Balancing',
        stageDesc: 'Automated copper hairpin insertion and dynamic high-speed balance testing',
        sku: 'EV-MOT-STATOR-800V',
        actual: 2840,
        target: 3000,
        fpy: 99.6,
        defectPpm: 18,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Silicon Carbide Inverter Core Subassembly',
        stageDesc: 'Heavy-duty busbar laser welding and dielectric gel encapsulation',
        sku: 'EV-INV-SIC-MODULE',
        actual: 2790,
        target: 3000,
        fpy: 99.1,
        defectPpm: 32,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: Cell Stacking & Ultrasonic Tab Bonding',
        stageDesc: 'Robotic prismatic cell stacking, compression testing, and tab bonding',
        sku: 'EV-BAT-CELL-STACK',
        actual: 2750,
        target: 3000,
        fpy: 98.7,
        defectPpm: 54,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: High-Voltage BMS Flashing & Telemetry',
        stageDesc: 'Flash ISO 26262 ASIL-D battery management firmware and sensor calibration',
        sku: 'EV-BMS-TELEMETRY',
        actual: 2710,
        target: 3000,
        fpy: 99.5,
        defectPpm: 21,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Thermal Runaway & Dyno Load Simulation',
        stageDesc: 'Simulate extreme current discharge, thermal chamber stress, and safety isolation',
        sku: 'EV-DYNO-TEST-CELL',
        actual: 2680,
        target: 3000,
        fpy: 98.2,
        defectPpm: 65,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: IP67 Pack Enclosure Sealing & Palletization',
        stageDesc: 'Helium leak testing, structural lid torque verification, and shipping palletizing',
        sku: 'EV-PACK-PALLET-DISP',
        actual: 2650,
        target: 3000,
        fpy: 99.9,
        defectPpm: 8,
        health: 'OPTIMAL',
      },
    ],
  },
  {
    id: 'franchise-robotics',
    name: 'Industrial Robotics & Automation Franchise',
    plantName: 'Plant 3: Jurong Precision Machinery Complex',
    city: 'Jurong',
    country: 'Singapore',
    flag: '🇸🇬',
    primaryIndustry: 'Precision Robotics & Motion Controls',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '85,000 Robotic Arms',
    operatingLines: 6,
    totalWorkforce: 290,
    isoStandard: 'ISO 13849 / CE Machinery',
    accentColor: 'indigo',
    flagshipProduct: 'Apex 6-Axis Articulated Robot Arm R-600',
    productSeries: [
      'Apex 6-Axis Articulated Robot Arm R-600 (Heavy Payload)',
      'Apex Delta High-Speed Pick & Place Robot D-120',
      'Apex Collaborative Autonomous Mobile Robot AMR-1000',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Precision CNC Machining & Housing Casting',
        stageDesc: 'High-speed 5-axis milling of aerospace aluminum structural housings',
        sku: 'ROB-CNC-HOUSING-M5',
        actual: 540,
        target: 580,
        fpy: 99.5,
        defectPpm: 15,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Harmonic Gearbox & Servo Subassembly',
        stageDesc: 'Zero-backlash harmonic drive integration and planetary gear mesh check',
        sku: 'ROB-GEAR-SERVO-SUB',
        actual: 535,
        target: 580,
        fpy: 99.0,
        defectPpm: 35,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: 24-Bit Optical Encoder Alignment & Balancing',
        stageDesc: 'Sub-micron encoder calibration and real-time axis backlash tuning',
        sku: 'ROB-ENC-ALIGN-OPT',
        actual: 528,
        target: 580,
        fpy: 98.4,
        defectPpm: 58,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Kinematic Firmware & EtherCAT Bus Diagnostics',
        stageDesc: 'Real-time deterministic EtherCAT fieldbus programming and safety zones',
        sku: 'ROB-ETHCAT-FIRMWARE',
        actual: 520,
        target: 580,
        fpy: 99.3,
        defectPpm: 25,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Continuous 72-Hour Payload Burn-In Chamber',
        stageDesc: 'Full payload trajectory repetition, thermal dissipation, and vibration analysis',
        sku: 'ROB-BURNIN-72HR',
        actual: 512,
        target: 580,
        fpy: 97.8,
        defectPpm: 75,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: Heavy Crating, CE Safety Certification & Dispatch',
        stageDesc: 'Shock-isolated shipping crate packaging, ISO 10218 safety sign-off',
        sku: 'ROB-CRATE-DISPATCH',
        actual: 505,
        target: 580,
        fpy: 99.9,
        defectPpm: 5,
        health: 'OPTIMAL',
      },
    ],
  },
  {
    id: 'franchise-fmcg',
    name: 'Process Packaging & FMCG Franchise',
    plantName: 'Plant 4: Midwest Automated Bottling & Packaging',
    city: 'Chicago, Illinois',
    country: 'USA',
    flag: '🇺🇸',
    primaryIndustry: 'Consumer Goods & Process Manufacturing',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '12,500,000 Units',
    operatingLines: 6,
    totalWorkforce: 350,
    isoStandard: 'ISO 22000 / HACCP / GMP',
    accentColor: 'amber',
    flagshipProduct: 'Apex High-Throughput Consumer Beverage Lines',
    productSeries: [
      'Apex Clean-Fill 500ml Bottled Nutrition Series',
      'Apex Eco-Can 330ml Aluminum Aseptic Series',
      'Apex Multi-Pack High-Speed Distribution Bundle',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: High-Speed Sterile Filling & Liquid Dosing',
        stageDesc: 'Aseptic micro-filtration, sterile liquid filling, and nitrogen head-space dosing',
        sku: 'FMCG-FILL-STERILE-500',
        actual: 48500,
        target: 50000,
        fpy: 99.8,
        defectPpm: 12,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Rotary Capping & Induction Foil Sealing',
        stageDesc: 'High-torque capper chucks and airtight induction hermetic foil seal',
        sku: 'FMCG-CAP-INDUCTION',
        actual: 48100,
        target: 50000,
        fpy: 99.3,
        defectPpm: 28,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: High-Speed Machine Vision & Fill Level Scan',
        stageDesc: '360-degree optical label inspection, fill height check, and foreign particle rejection',
        sku: 'FMCG-VIS-FILL-SCAN',
        actual: 47800,
        target: 50000,
        fpy: 98.9,
        defectPpm: 45,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Laser Batch Coding & Barcode Serialization',
        stageDesc: 'High-speed CO2 laser expiration date coding and GS1 2D DataMatrix printing',
        sku: 'FMCG-LASER-EXP-CODE',
        actual: 47500,
        target: 50000,
        fpy: 99.7,
        defectPpm: 15,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Vacuum Pressure & In-Line Integrity Chamber',
        stageDesc: 'Acoustic pulse leak detection and pressurized can crush resistance test',
        sku: 'FMCG-LEAK-TEST-VAC',
        actual: 47200,
        target: 50000,
        fpy: 98.4,
        defectPpm: 60,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: Robotic Case Packing & Automated Shrink Palletizing',
        stageDesc: '24-pack corrugated carton formation, robotic pallet stacking, and stretch wrapping',
        sku: 'FMCG-CASE-PALLET-WRAP',
        actual: 47000,
        target: 50000,
        fpy: 99.9,
        defectPpm: 8,
        health: 'OPTIMAL',
      },
    ],
  },
  {
    id: 'franchise-medtech',
    name: 'Medical Devices & Diagnostics Franchise',
    plantName: 'Plant 5: Basel Bio-Medical Micro-Assembly',
    city: 'Basel',
    country: 'Switzerland',
    flag: '🇨🇭',
    primaryIndustry: 'Class III Medical Devices & Sensor Implants',
    currency: 'CHF',
    currencySymbol: 'CHF',
    annualCapacity: '250,000 Sterile Kits',
    operatingLines: 6,
    totalWorkforce: 180,
    isoStandard: 'ISO 13485 / FDA 21 CFR 820',
    accentColor: 'cyan',
    flagshipProduct: 'Apex Bio-Sensor Diagnostic Micro-Implant',
    productSeries: [
      'Apex Bio-Sensor Diagnostic Micro-Implant Series 4',
      'Apex Sterile Continuous Infusion Controller (Class III)',
      'Apex Optical Hemodynamic Monitoring Module',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Class 100 Cleanroom Micro-Machining',
        stageDesc: 'Sub-micron laser cutting of bio-compatible titanium and platinum electrodes',
        sku: 'MED-LASER-TITANIUM-M1',
        actual: 1420,
        target: 1500,
        fpy: 99.7,
        defectPpm: 10,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Ultrasonic Bio-Compatible Polymer Sealing',
        stageDesc: 'Hermetic micro-welding of implantable PEEK housings without adhesive toxins',
        sku: 'MED-SEAL-PEEK-HERM',
        actual: 1405,
        target: 1500,
        fpy: 99.2,
        defectPpm: 25,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: Microfluidic Flow Calibration & Spectrometry',
        stageDesc: 'Picoliter liquid flow rate validation and spectroscopic sensor response check',
        sku: 'MED-FLOW-SPECTRO-CAL',
        actual: 1390,
        target: 1500,
        fpy: 98.8,
        defectPpm: 40,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Cryptographic Key Injection & Medical Firmware',
        stageDesc: 'FDA cybersecurity key injection and real-time medical telemetry firmware flashing',
        sku: 'MED-CYBER-KEY-FLASH',
        actual: 1380,
        target: 1500,
        fpy: 99.8,
        defectPpm: 8,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Ethylene Oxide Sterilization & Biocompatibility',
        stageDesc: 'Controlled temperature EtO sterilization chamber and bioburden validation',
        sku: 'MED-ETO-STERILIZE-VAL',
        actual: 1365,
        target: 1500,
        fpy: 99.1,
        defectPpm: 30,
        health: 'OPTIMAL',
      },
      {
        number: 6,
        name: 'Line 6: Sterile Tyvek Pouching & Cold-Chain Shipping',
        stageDesc: 'Tamper-evident heat-seal barrier pouching and cryogenic temperature datalogger integration',
        sku: 'MED-TYVEK-COLDCHAIN',
        actual: 1350,
        target: 1500,
        fpy: 99.9,
        defectPpm: 3,
        health: 'OPTIMAL',
      },
    ],
  },
];

const STORAGE_KEY = 'apex_active_franchise_profile_v1';
export const EVENT_KEY = 'apex_franchise_changed';

class FranchiseStoreService {
  private activeProfileId: string = 'franchise-electronics';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && FRANCHISE_PROFILES.some((f) => f.id === stored)) {
        this.activeProfileId = stored;
      }
    } catch {
      this.activeProfileId = 'franchise-electronics';
    }
  }

  public getActiveProfile(): FranchiseProfile {
    this.loadFromStorage();
    return (
      FRANCHISE_PROFILES.find((f) => f.id === this.activeProfileId) ||
      FRANCHISE_PROFILES[0]
    );
  }

  public getAllProfiles(): FranchiseProfile[] {
    return [...FRANCHISE_PROFILES];
  }

  public setActiveProfile(profileId: string) {
    if (!FRANCHISE_PROFILES.some((f) => f.id === profileId)) return;
    this.activeProfileId = profileId;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, profileId);
        window.dispatchEvent(new Event(EVENT_KEY));
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export const franchiseStore = new FranchiseStoreService();

/**
 * Reactive React hook to access active franchise profile anywhere in components
 */
export function useActiveFranchise(): FranchiseProfile {
  const [profile, setProfile] = useState<FranchiseProfile>(() => franchiseStore.getActiveProfile());

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(franchiseStore.getActiveProfile());
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return profile;
}

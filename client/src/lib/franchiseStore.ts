'use client';

import { useState, useEffect } from 'react';
import { INDUSTRY_SECTORS, IndustrySector } from './industryUomRegistry';

/**
 * Apex Multi-Franchise Industrial Operating System Profile Store
 * 
 * Supports dynamic switching between multi-plant franchise profiles across
 * all 5 PM Industry Categories & 24 Manufacturing Sectors:
 * 
 * 1. Heavy & Raw Materials: Steel, Cement, Mining, Glass
 * 2. Process & Chemical: Chemicals, Paint, Rubber/Tyres, Fertilizer, Plastics
 * 3. Engineering & Electronics: Automobile, Electronics, Heavy Machinery, Solar, Electric Eqpt, Cables
 * 4. Consumer Goods: Textiles, Jewellery, Leather, Sports, Furniture, Handloom
 * 5. Food & Healthcare: Medical Devices, Biomedical, Dairy & Foods
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
  industryCategoryId: 'heavy-raw-materials' | 'process-chemical' | 'engineering-electronics' | 'consumer-goods' | 'food-healthcare';
  industrySectorId: string;
  primaryUom: string;
  supportedUoms: string[];
  uomLabel: string;
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
  // 1. High-Tech Electronics & Smart Hardware (Category 3)
  {
    id: 'franchise-electronics',
    name: 'Electronics & Smart Devices Franchise',
    plantName: 'Plant 1: Austin Advanced Electronics Facility',
    city: 'Austin, Texas',
    country: 'USA',
    flag: 'US',
    primaryIndustry: 'Electrical & Electronics',
    industryCategoryId: 'engineering-electronics',
    industrySectorId: 'electrical-electronics',
    primaryUom: 'Pcs',
    supportedUoms: ['Pcs', 'm', 'cm'],
    uomLabel: 'Pieces (Pcs), Meters (m), Centimeters (cm)',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '1,200,000 Units',
    operatingLines: 6,
    totalWorkforce: 420,
    isoStandard: 'IPC-A-610 Class 3 / ISO 9001',
    accentColor: 'blue',
    flagshipProduct: 'Apex Industrial IoT Gateway Module Pro',
    productSeries: [
      'Apex Industrial IoT Gateway Pro (Titanium Series)',
      'Apex Core Automation Controller (Enterprise Series)',
      'Apex Precision Sensor Interface Ultra (Modular Series)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Precision SMT & Board Assembly',
        stageDesc: 'Robotic chip placement, optical board inspection, and reflow soldering',
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

  // 2. Automotive EV Powertrain & Vehicles (Category 3)
  {
    id: 'franchise-ev',
    name: 'Automobile & EV Powertrain Franchise',
    plantName: 'Plant 2: Stuttgart EV Battery & Vehicle Hub',
    city: 'Stuttgart',
    country: 'Germany',
    flag: 'DE',
    primaryIndustry: 'Automobile & Vehicles',
    industryCategoryId: 'engineering-electronics',
    industrySectorId: 'automobile-vehicles',
    primaryUom: 'Unit',
    supportedUoms: ['Unit', 'kg'],
    uomLabel: 'Finished Units (Unit), Kilograms (kg)',
    currency: 'EUR',
    currencySymbol: '€',
    annualCapacity: '450,000 Packs / Vehicles',
    operatingLines: 6,
    totalWorkforce: 580,
    isoStandard: 'IATF 16949 / ISO 26262 ASIL-D',
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

  // 3. Steel & Heavy Metallurgy (Category 1)
  {
    id: 'franchise-steel',
    name: 'Steel & Heavy Metallurgy Franchise',
    plantName: 'Plant 3: Pittsburgh Integrated Steel & Heavy Billet Works',
    city: 'Pittsburgh, PA',
    country: 'USA',
    flag: 'US',
    primaryIndustry: 'Steel & Heavy Metals',
    industryCategoryId: 'heavy-raw-materials',
    industrySectorId: 'steel-heavy-metals',
    primaryUom: 'MT',
    supportedUoms: ['MT', 'kg', 'm'],
    uomLabel: 'Metric Tons (MT), Kilograms (kg), Meters (m)',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '2,800,000 MT',
    operatingLines: 6,
    totalWorkforce: 740,
    isoStandard: 'ISO 9001 / EN 10025 / ASTM A36',
    accentColor: 'slate',
    flagshipProduct: 'High-Tensile Structural Heavy Steel Coils & Beams',
    productSeries: [
      'High-Tensile Hot-Rolled Steel Coils (Grade S355)',
      'Heavy Structural Wide-Flange I-Beams (W24x68)',
      'High-Alloy Quenched Tool Steel Billets (AISI 4140)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Blast Furnace Ironmaking & Oxygen Converter',
        stageDesc: 'Molten pig iron refining, de-slagging, and high-purity argon rinsing',
        sku: 'STL-MOLTEN-PIG-BF',
        actual: 4850,
        target: 5000,
        fpy: 99.2,
        defectPpm: 22,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Ladle Furnace Secondary Refining & Degassing',
        stageDesc: 'Vacuum degassing, micro-alloy ferro-chrome trimming, and thermal homogenizing',
        sku: 'STL-LADLE-ALLOY-REF',
        actual: 4790,
        target: 5000,
        fpy: 98.9,
        defectPpm: 38,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: Continuous Billet & Slab Casting Bay',
        stageDesc: 'Water-cooled copper mold oscillation, slab solidification, and automated torch cutting',
        sku: 'STL-SLAB-CAST-CONT',
        actual: 4720,
        target: 5000,
        fpy: 98.6,
        defectPpm: 46,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Reheating Furnace & Reversing Roughing Mill',
        stageDesc: 'Gas reheating to 1250°C and 4-high heavy reversing rougher reduction',
        sku: 'STL-ROUGH-REV-MILL',
        actual: 4680,
        target: 5000,
        fpy: 99.1,
        defectPpm: 28,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Continuous Tandem Hot Strip Finishing Train',
        stageDesc: '7-stand high-speed hot rolling, laminar run-out table water cooling',
        sku: 'STL-TANDEM-HOT-STRIP',
        actual: 4610,
        target: 5000,
        fpy: 98.1,
        defectPpm: 68,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: Downcoiling, Laser Strapping & Coil Yard Dispatch',
        stageDesc: 'Automated mandrel downcoiler, ultrasonic thickness gauge, and crane dispatch',
        sku: 'STL-COIL-DOWNCOIL-DISP',
        actual: 4560,
        target: 5000,
        fpy: 99.7,
        defectPpm: 10,
        health: 'OPTIMAL',
      },
    ],
  },

  // 4. Cement & Building Materials (Category 1)
  {
    id: 'franchise-cement',
    name: 'Cement & Building Materials Franchise',
    plantName: 'Plant 4: Monterrey Dry-Process Cement & Concrete Complex',
    city: 'Monterrey',
    country: 'Mexico',
    flag: 'MX',
    primaryIndustry: 'Cement & Building Materials',
    industryCategoryId: 'heavy-raw-materials',
    industrySectorId: 'cement-building',
    primaryUom: 'MT',
    supportedUoms: ['MT', 'm3'],
    uomLabel: 'Metric Tons (MT), Cubic Meters (m³)',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '4,500,000 MT',
    operatingLines: 6,
    totalWorkforce: 410,
    isoStandard: 'ISO 14001 / ASTM C150 / EN 197-1',
    accentColor: 'amber',
    flagshipProduct: 'Apex High-Strength Portland Clinker & Ready-Mix',
    productSeries: [
      'Type I/II Portland High-Early Strength Cement (MT)',
      'Ready-Mix High-Performance Slump Concrete (m³)',
      'Fiber-Reinforced Pre-Cast Concrete Structural Slabs (m³)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Limestone Quarry Crushing & Pre-Blending',
        stageDesc: 'Heavy jaw crushers, stacker-reclaimer circular stockpiles, and XRF raw mix control',
        sku: 'CEM-LIME-CRUSH-01',
        actual: 8900,
        target: 9200,
        fpy: 99.4,
        defectPpm: 14,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Vertical Roller Raw Mill & Cyclone Preheater',
        stageDesc: 'Raw meal grinding, hot gas drying, and 5-stage suspension cyclone preheating',
        sku: 'CEM-RAW-MEAL-GRIND',
        actual: 8820,
        target: 9200,
        fpy: 99.0,
        defectPpm: 28,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: 1450°C Rotary Kiln Clinker Calcination',
        stageDesc: 'Calcination in 60m rotary kiln, alite crystal formation, and grate cooler quench',
        sku: 'CEM-ROTARY-KILN-CALC',
        actual: 8750,
        target: 9200,
        fpy: 98.7,
        defectPpm: 42,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Clinker Storage Silo & Gypsum Proportioning',
        stageDesc: 'Deep silo storage, multi-feeder gypsum retarding additive measurement',
        sku: 'CEM-SILO-GYPSUM-FEED',
        actual: 8710,
        target: 9200,
        fpy: 99.5,
        defectPpm: 16,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Ball Mill Finish Grinding & Dynamic Separator',
        stageDesc: 'Closed-circuit ball mill pulverization and high-efficiency dynamic air separator',
        sku: 'CEM-BALL-MILL-FINISH',
        actual: 8650,
        target: 9200,
        fpy: 98.2,
        defectPpm: 55,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: Rotary Valve Bulk Tanker & 50kg Bag Palletizer',
        stageDesc: 'Automated 8-spout rotary packing, ultrasonic bag seal, and bulk tanker rail dispatch',
        sku: 'CEM-BULK-PACK-DISP',
        actual: 8600,
        target: 9200,
        fpy: 99.8,
        defectPpm: 9,
        health: 'OPTIMAL',
      },
    ],
  },

  // 5. Process Chemical & Industrial Polymers (Category 2)
  {
    id: 'franchise-chemical',
    name: 'Chemical & Industrial Polymers Franchise',
    plantName: 'Plant 5: Antwerp Continuous Petrochemical Complex',
    city: 'Antwerp',
    country: 'Belgium',
    flag: 'BE',
    primaryIndustry: 'Chemical & Petrochemical',
    industryCategoryId: 'process-chemical',
    industrySectorId: 'chemical',
    primaryUom: 'ltr',
    supportedUoms: ['ltr', 'kg', 'MT'],
    uomLabel: 'Liters (ltr), Kilograms (kg), Metric Tons (MT)',
    currency: 'EUR',
    currencySymbol: '€',
    annualCapacity: '65,000,000 Liters / 120,000 MT',
    operatingLines: 6,
    totalWorkforce: 460,
    isoStandard: 'ISO 9001 / OSHA PSM / REACH Certified',
    accentColor: 'indigo',
    flagshipProduct: 'High-Purity Specialty Industrial Solvents & Resins',
    productSeries: [
      'High-Purity Anhydrous Solvent Solution (ltr)',
      'Polyester Polyol Coating Polymer Resin (MT)',
      'Specialty Bio-Surfactant Liquid Concentrate (ltr)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Catalytic Fixed-Bed Reaction Chamber',
        stageDesc: 'Continuous catalytic hydrogenation, temperature-jacketed reactor loop',
        sku: 'CHM-FIXED-BED-REACT',
        actual: 38200,
        target: 40000,
        fpy: 99.4,
        defectPpm: 15,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Multi-Stage Fractional Distillation Column',
        stageDesc: 'High-efficiency sieve tray distillation, azeotropic separation, reflux control',
        sku: 'CHM-FRACT-DISTILL-COL',
        actual: 37900,
        target: 40000,
        fpy: 99.1,
        defectPpm: 28,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: Continuous Polymerization & Twin-Screw Extrusion',
        stageDesc: 'Viscous polymer condensation, devolatilization vent, underwater pelletizing',
        sku: 'CHM-POLYMER-EXTRUDE',
        actual: 37400,
        target: 40000,
        fpy: 98.6,
        defectPpm: 48,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Gas Chromatography Purity & Trace Moisture Lab',
        stageDesc: 'In-line FTIR spectrometry, Karl Fischer moisture titration < 10 ppm',
        sku: 'CHM-GC-FTIR-PURITY',
        actual: 37100,
        target: 40000,
        fpy: 99.7,
        defectPpm: 10,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Nitrogen-Blanketed Storage Farm & Drum Filling',
        stageDesc: 'Closed-loop 200L steel drum nitrogen purge filling, vapor recovery recovery',
        sku: 'CHM-DRUM-N2-FILL',
        actual: 36800,
        target: 40000,
        fpy: 98.3,
        defectPpm: 58,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: ISO Tank Container Loading & Gantry Intermodal',
        stageDesc: 'High-speed ISO tank container filling, mass-flow coriolis metering, ADR sign-off',
        sku: 'CHM-ISOTANK-CONTAINER',
        actual: 36500,
        target: 40000,
        fpy: 99.9,
        defectPpm: 4,
        health: 'OPTIMAL',
      },
    ],
  },

  // 6. Solar Power & Photovoltaics (Category 3)
  {
    id: 'franchise-solar',
    name: 'Solar Power & Photovoltaics Franchise',
    plantName: 'Plant 6: Phoenix Silicon Wafer & Solar Gigafactory',
    city: 'Phoenix, Arizona',
    country: 'USA',
    flag: 'US',
    primaryIndustry: 'Solar Power & Photovoltaics',
    industryCategoryId: 'engineering-electronics',
    industrySectorId: 'solar-power',
    primaryUom: 'Pcs',
    supportedUoms: ['Pcs', 'm2'],
    uomLabel: 'Pieces (Pcs), Square Meters (m²)',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '3,500,000 Solar Panels / 8.5 GW',
    operatingLines: 6,
    totalWorkforce: 520,
    isoStandard: 'IEC 61215 / IEC 61730 / UL 1703',
    accentColor: 'amber',
    flagshipProduct: 'Apex 580W Bifacial TOPCon High-Efficiency Solar Panel',
    productSeries: [
      'Apex 580W Bifacial TOPCon Commercial PV Panel (Pcs)',
      'Apex All-Black High-Aesthetic Residential Panel (Pcs)',
      'Apex Building-Integrated Photovoltaic Glass Facade (m²)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: High-Speed Multi-Wire Diamond Wafer Slicing',
        stageDesc: 'Diamond wire slicing of N-type monocrystalline ingots at 130 micron thickness',
        sku: 'SLR-DIAMOND-SLICE-M1',
        actual: 6850,
        target: 7000,
        fpy: 99.5,
        defectPpm: 16,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Chemical Texturization & PECVD Passivation',
        stageDesc: 'KOH pyramidal texturization, tube furnace POCl3 diffusion, silicon nitride coating',
        sku: 'SLR-CHEM-TEXT-PECVD',
        actual: 6790,
        target: 7000,
        fpy: 99.0,
        defectPpm: 32,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: Multi-Busbar Automated High-Speed Stringing',
        stageDesc: 'Robotic 16-busbar micro-ribbon soldering of half-cut solar cells',
        sku: 'SLR-CELL-STRINGER-16BB',
        actual: 6740,
        target: 7000,
        fpy: 98.7,
        defectPpm: 45,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Double-Glass Vacuum Heat Lamination',
        stageDesc: 'Dual-chamber vacuum evacuation, thermal cross-linking of POE encapsulant sheets',
        sku: 'SLR-GLASS-VAC-LAMINATE',
        actual: 6700,
        target: 7000,
        fpy: 99.4,
        defectPpm: 21,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Automated Anodized Aluminum Framing & J-Box',
        stageDesc: 'Hydraulic frame corner pressing, silicone sealant curing, IP68 junction box potting',
        sku: 'SLR-FRAME-JBOX-SEAL',
        actual: 6640,
        target: 7000,
        fpy: 98.2,
        defectPpm: 64,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: Class AAA Solar Simulator Flash & EL Inspection',
        stageDesc: 'Electroluminescence micro-crack scan, STC flash testing, automated carton boxing',
        sku: 'SLR-FLASH-EL-DISPATCH',
        actual: 6600,
        target: 7000,
        fpy: 99.8,
        defectPpm: 7,
        health: 'OPTIMAL',
      },
    ],
  },

  // 7. Cable & Industrial Wire (Category 3)
  {
    id: 'franchise-cable',
    name: 'Cable & Wire Manufacturing Franchise',
    plantName: 'Plant 7: Nagoya High-Tension Cable & Precision Wire Works',
    city: 'Nagoya',
    country: 'Japan',
    flag: 'JP',
    primaryIndustry: 'Cable & Wire',
    industryCategoryId: 'engineering-electronics',
    industrySectorId: 'cable-wire',
    primaryUom: 'm',
    supportedUoms: ['m', 'cm', 'kg'],
    uomLabel: 'Meters (m), Centimeters (cm), Kilograms (kg)',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '45,000,000 Meters',
    operatingLines: 6,
    totalWorkforce: 380,
    isoStandard: 'IEC 60502 / UL 44 / RoHS Compliant',
    accentColor: 'rose',
    flagshipProduct: 'Medium-Voltage Armored Underground Power Cables',
    productSeries: [
      '33kV Cross-Linked XLPE Armored Substation Cable (m)',
      'Industrial Cat-7 Double-Shielded Ethernet Drag Chain Cable (m)',
      'High-Temperature Enameled Copper Magnet Wire (kg)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: High-Speed Rod Breakdown & Wire Drawing',
        stageDesc: 'Continuous drawing of 8mm copper rod through tungsten carbide dies to 1.2mm',
        sku: 'CBL-ROD-DRAW-COPPER',
        actual: 88500,
        target: 90000,
        fpy: 99.6,
        defectPpm: 14,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: In-Line Induction Annealing & Tin Electroplating',
        stageDesc: 'Resistance electric annealing to soften copper, pure tin immersion tank',
        sku: 'CBL-INDUCT-ANNEAL-TIN',
        actual: 87900,
        target: 90000,
        fpy: 99.1,
        defectPpm: 26,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: Rigid Planetary Stranding & Conductor Compaction',
        stageDesc: 'Concentric stranding of 61 copper wires, smooth roller compaction to reduce diameter',
        sku: 'CBL-STRAND-PLANET-61W',
        actual: 87200,
        target: 90000,
        fpy: 98.8,
        defectPpm: 42,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Triple Cross-Head XLPE Extrusion Line',
        stageDesc: 'Co-extrusion of inner semi-con, XLPE primary insulation, and outer semi-con layers',
        sku: 'CBL-XLPE-TRIPLE-EXTRUDE',
        actual: 86800,
        target: 90000,
        fpy: 99.4,
        defectPpm: 19,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Continuous Helical Steel Tape Armoring',
        stageDesc: 'Double steel tape armoring, moisture swellable water-blocking tape wrap',
        sku: 'CBL-ARMOR-STEEL-TAPE',
        actual: 86200,
        target: 90000,
        fpy: 98.1,
        defectPpm: 62,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: Spark Testing, Drum Spooling & Wooden Reel Dispatch',
        stageDesc: '25kV spark tester, laser meter-marking print, heavy wooden shipping drum coiling',
        sku: 'CBL-SPARK-DRUM-DISPATCH',
        actual: 85800,
        target: 90000,
        fpy: 99.9,
        defectPpm: 5,
        health: 'OPTIMAL',
      },
    ],
  },

  // 8. Textile & High-Speed Weaving (Category 4)
  {
    id: 'franchise-textile',
    name: 'Textile & Apparel Manufacturing Franchise',
    plantName: 'Plant 8: Coimbatore High-Speed Spinning & Weaving Mills',
    city: 'Coimbatore',
    country: 'India',
    flag: 'IN',
    primaryIndustry: 'Textile & Apparel',
    industryCategoryId: 'consumer-goods',
    industrySectorId: 'textile-apparel',
    primaryUom: 'm',
    supportedUoms: ['m', 'kg', 'Pcs'],
    uomLabel: 'Meters (m), Kilograms (kg), Pieces (Pcs)',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '35,000,000 Woven Meters',
    operatingLines: 6,
    totalWorkforce: 650,
    isoStandard: 'OEKO-TEX Standard 100 / GOTS / ISO 9001',
    accentColor: 'violet',
    flagshipProduct: 'High-Thread Egyptian Cotton Woven Fabrics & Apparel',
    productSeries: [
      'High-Thread Egyptian Cotton Woven Fabric Bolts (m)',
      'Combed Ring-Spun Organic Cotton Yarn Cones (kg)',
      'Tailored Industrial Protective Workwear Garments (Pcs)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Automated Blowroom & High-Production Carding',
        stageDesc: 'Raw cotton bale opening, contaminant camera sorting, and sliver formation',
        sku: 'TXT-BLOWROOM-CARD-01',
        actual: 24200,
        target: 25000,
        fpy: 99.4,
        defectPpm: 18,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Ring Spinning & Automated Cone Winding',
        stageDesc: 'Drawing, roving, high-speed ring spinning frames, electronic yarn clearers',
        sku: 'TXT-RING-SPIN-CONE',
        actual: 23900,
        target: 25000,
        fpy: 99.1,
        defectPpm: 32,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: High-Speed Sectional Warping & Sizing Range',
        stageDesc: 'Precision beam warping, starch sizing box, steam-heated drying cylinders',
        sku: 'TXT-WARP-SIZING-RANGE',
        actual: 23500,
        target: 25000,
        fpy: 98.7,
        defectPpm: 46,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Air-Jet Continuous Weaving Shed',
        stageDesc: '1,200 RPM Toyota air-jet looms, electronic dobby pattern shed formation',
        sku: 'TXT-AIRJET-LOOM-SHED',
        actual: 23100,
        target: 25000,
        fpy: 99.3,
        defectPpm: 24,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Continuous Open-Width Dyeing & Stenter Finishing',
        stageDesc: 'Cold pad-batch reactive dyeing, hot flue drying, and pin stenter heat setting',
        sku: 'TXT-DYE-STENTER-FINISH',
        actual: 22800,
        target: 25000,
        fpy: 98.2,
        defectPpm: 60,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: 4-Point System Fabric Inspection & Rolling Bay',
        stageDesc: 'Automated camera flaw inspection, 100m roll winding, shrink-wrap dispatch',
        sku: 'TXT-4POINT-INSPECT-DISP',
        actual: 22500,
        target: 25000,
        fpy: 99.8,
        defectPpm: 8,
        health: 'OPTIMAL',
      },
    ],
  },

  // 9. Jewellery & Precious Metals (Category 4)
  {
    id: 'franchise-jewellery',
    name: 'Jewellery & Precious Metals Atelier',
    plantName: 'Plant 9: Zurich High-Precision Watch & Jewellery Atelier',
    city: 'Zurich',
    country: 'Switzerland',
    flag: 'CH',
    primaryIndustry: 'Jewellery & Precious Metals',
    industryCategoryId: 'consumer-goods',
    industrySectorId: 'jewellery-precious-metals',
    primaryUom: 'gm',
    supportedUoms: ['gm', 'kg', 'Pcs'],
    uomLabel: 'Grams (gm), Kilograms (kg), Pieces (Pcs)',
    currency: 'CHF',
    currencySymbol: 'CHF',
    annualCapacity: '150,000 Grams Fine Gold & Platinum',
    operatingLines: 6,
    totalWorkforce: 140,
    isoStandard: 'RJC Code of Practices / Swiss Hallmarking',
    accentColor: 'amber',
    flagshipProduct: 'Handcrafted Platinum & 18K Gold Solitaire Jewellery',
    productSeries: [
      '18-Karat Pure Diamond Solitaire Ring (Pcs/gm)',
      'Platinum 950 Hand-Linked Artisan Bracelet (gm)',
      'Certified Investment Gold Bullion Grain 99.99% (gm/kg)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Precious Alloy Smelting & Continuous Casting',
        stageDesc: 'Induction vacuum furnace melting of 24K gold and grain alloy formulation',
        sku: 'JWL-SMELT-ALLOY-VAC',
        actual: 2450,
        target: 2500,
        fpy: 99.8,
        defectPpm: 6,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: High-Resolution 3D Wax Printing & Tree Assembly',
        stageDesc: 'Sub-micron DLP wax printing of intricate rings and tree investment spruing',
        sku: 'JWL-3DWAX-PRINT-TREE',
        actual: 2420,
        target: 2500,
        fpy: 99.4,
        defectPpm: 18,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: Centrifugal Vacuum Lost-Wax Chamber Casting',
        stageDesc: 'Ceramic flask burnout, centrifugal pressure gold casting, ultrasonic divestment',
        sku: 'JWL-LOSTWAX-CAST-CENT',
        actual: 2390,
        target: 2500,
        fpy: 99.0,
        defectPpm: 25,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Micro-Pave Diamond Setting & Laser Welding',
        stageDesc: 'Microscopic optical alignment and hand prong setting of VVS1 solitaires',
        sku: 'JWL-DIAMOND-MICROPVE',
        actual: 2360,
        target: 2500,
        fpy: 99.5,
        defectPpm: 12,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Hand Lapping & Multi-Stage Magnetic Pin Polish',
        stageDesc: 'Ceramic lap pre-finishing, magnetic pin tumbler, and high-shine rouge polishing',
        sku: 'JWL-HAND-LAP-POLISH',
        actual: 2320,
        target: 2500,
        fpy: 98.6,
        defectPpm: 45,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: Swiss Hallmarking, X-Ray Assay & Security Vault Box',
        stageDesc: 'XRF precious metal assay verification, laser hallmark stamp, velvet vault boxing',
        sku: 'JWL-ASSAY-HALLMARK-BOX',
        actual: 2300,
        target: 2500,
        fpy: 99.9,
        defectPpm: 2,
        health: 'OPTIMAL',
      },
    ],
  },

  // 10. Dairy & Processed Food (Category 5)
  {
    id: 'franchise-dairy',
    name: 'Dairy & Processed Food Franchise',
    plantName: 'Plant 10: Waikato Aseptic Dairy & Infant Nutrition Facility',
    city: 'Waikato',
    country: 'New Zealand',
    flag: 'NZ',
    primaryIndustry: 'Dairy & Processed Food',
    industryCategoryId: 'food-healthcare',
    industrySectorId: 'dairy-food-products',
    primaryUom: 'ltr',
    supportedUoms: ['ltr', 'kg', 'gm'],
    uomLabel: 'Liters (ltr), Kilograms (kg), Grams (gm)',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '85,000,000 Liters / 30,000 MT Powder',
    operatingLines: 6,
    totalWorkforce: 360,
    isoStandard: 'FSSC 22000 / ISO 22000 / HACCP / FDA',
    accentColor: 'cyan',
    flagshipProduct: 'Apex Pure-Source Organic Milk & Infant Formula',
    productSeries: [
      'Ultra-Pasteurized Organic Whole Milk 1L Aseptic (ltr)',
      'Spray-Dried Demineralized Infant Milk Formula (kg/gm)',
      'Cultured Probiotic Greek Yogurt High-Protein (gm/kg)',
    ],
    productionLines: [
      {
        number: 1,
        name: 'Line 1: Raw Milk Receiving, Chilling & Deaeration',
        stageDesc: 'Automated road tanker connection, in-line bacterial screening, 4°C silo storage',
        sku: 'DRY-RECEIVE-CHILL-01',
        actual: 145000,
        target: 150000,
        fpy: 99.8,
        defectPpm: 8,
        health: 'OPTIMAL',
      },
      {
        number: 2,
        name: 'Line 2: Centrifugal Clarification & Fat Standardization',
        stageDesc: 'High-speed disc bowl clarifier, cream fat separation, dual-stage homogenizer',
        sku: 'DRY-CENTRIFUGE-STAND',
        actual: 143500,
        target: 150000,
        fpy: 99.3,
        defectPpm: 22,
        health: 'OPTIMAL',
      },
      {
        number: 3,
        name: 'Line 3: 137°C UHT Flash Sterilization & Aseptic Holding',
        stageDesc: 'Direct steam injection UHT treatment, aseptic surge tank holding under sterility',
        sku: 'DRY-UHT-FLASH-STERIL',
        actual: 142000,
        target: 150000,
        fpy: 99.1,
        defectPpm: 34,
        health: 'OPTIMAL',
      },
      {
        number: 4,
        name: 'Line 4: Aseptic Liquid Carton Forming & Sterile Filling',
        stageDesc: 'Hydrogen peroxide vapor web sterilization, ultrasonic bottom and top seal',
        sku: 'DRY-ASEPTIC-CARTON-FILL',
        actual: 140800,
        target: 150000,
        fpy: 99.6,
        defectPpm: 15,
        health: 'OPTIMAL',
      },
      {
        number: 5,
        name: 'Line 5: Multi-Stage Falling Film Evaporator & Spray Drying',
        stageDesc: 'Vacuum concentration to 50% solids, high-pressure rotary spray atomizer tower',
        sku: 'DRY-SPRAY-DRYER-TOWER',
        actual: 139500,
        target: 150000,
        fpy: 98.4,
        defectPpm: 52,
        health: 'OPERATIONAL_WITH_WARNINGS',
      },
      {
        number: 6,
        name: 'Line 6: Nitrogen Modified Atmosphere Vacuum Packaging',
        stageDesc: 'Residual oxygen < 0.5% nitrogen flushing, hermetic can seaming, shipping palletizing',
        sku: 'DRY-MAP-NITRO-CAN-DISP',
        actual: 138000,
        target: 150000,
        fpy: 99.9,
        defectPpm: 3,
        health: 'OPTIMAL',
      },
    ],
  },

  // 11. Medical Devices & Diagnostics (Category 5)
  {
    id: 'franchise-medtech',
    name: 'Medical Devices & Diagnostics Franchise',
    plantName: 'Plant 11: Basel Bio-Medical Micro-Assembly & Implants',
    city: 'Basel',
    country: 'Switzerland',
    flag: 'CH',
    primaryIndustry: 'Medical Device Manufacturing',
    industryCategoryId: 'food-healthcare',
    industrySectorId: 'medical-device',
    primaryUom: 'Pcs',
    supportedUoms: ['Pcs', 'sets'],
    uomLabel: 'Pieces (Pcs), Sets (sets)',
    currency: 'CHF',
    currencySymbol: 'CHF',
    annualCapacity: '250,000 Sterile Kits',
    operatingLines: 6,
    totalWorkforce: 180,
    isoStandard: 'ISO 13485 / FDA 21 CFR 820 / CE MDR',
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

  // 12. Industrial Robotics & Automation (Category 3)
  {
    id: 'franchise-robotics',
    name: 'Industrial Robotics & Automation Franchise',
    plantName: 'Plant 12: Jurong Precision Machinery Complex',
    city: 'Jurong',
    country: 'Singapore',
    flag: 'SG',
    primaryIndustry: 'Heavy Industrial Machine',
    industryCategoryId: 'engineering-electronics',
    industrySectorId: 'heavy-machine',
    primaryUom: 'Unit',
    supportedUoms: ['Unit', 'Pcs', 'sets'],
    uomLabel: 'Units (Unit), Pieces (Pcs), Sets (sets)',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '85,000 Robotic Arms',
    operatingLines: 6,
    totalWorkforce: 290,
    isoStandard: 'ISO 13849 / CE Machinery Directive',
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
];

const STORAGE_KEY = 'apex_active_franchise_profile_v2';
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

  /**
   * Switch the active enterprise to match any of the 24 PM Industry Sectors!
   */
  public activateSector(sectorId: string) {
    // 1. Check if a profile directly exists for this sector
    const directMatch = FRANCHISE_PROFILES.find((f) => f.industrySectorId === sectorId);
    if (directMatch) {
      this.setActiveProfile(directMatch.id);
      return;
    }

    // 2. Otherwise find sector metadata from registry and match best category
    const sector = INDUSTRY_SECTORS.find((s) => s.id === sectorId);
    if (!sector) return;

    const categoryMatch = FRANCHISE_PROFILES.find(
      (f) => f.industryCategoryId === sector.categoryId
    );

    if (categoryMatch) {
      this.setActiveProfile(categoryMatch.id);
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

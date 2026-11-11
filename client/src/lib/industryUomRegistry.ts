/**
 * Universal ERP Multi-Franchise Industry & Measurement Units (UOM) Registry
 * 
 * Based on Product Management Universal Manufacturing Specification:
 * 5 Major Industrial Categories & 24 Manufacturing Sectors:
 * 
 * 1. Heavy & Raw Materials:
 *    - Steel & Heavy Metals (MT, kg, m)
 *    - Cement & Building (MT, m³)
 *    - Mining & Minerals (MT, kg, m³)
 *    - Glass & Ceramic (m², kg, Pcs)
 * 
 * 2. Process & Chemical Industries:
 *    - Chemical (ltr, kg, MT)
 *    - Paint & Coatings (ltr, kg)
 *    - Rubber & Tyre (kg, Pcs)
 *    - Fertilizer & Agrochem (kg, MT)
 *    - Plastic & Polymers (kg, MT)
 * 
 * 3. Engineering, Machinery & Electronics:
 *    - Automobile & Vehicles (Unit, kg)
 *    - Electrical & Electronics (Pcs, m, cm)
 *    - Heavy Industrial Machinery (Unit/Pcs, sets)
 *    - Solar Power & Photovoltaics (Pcs, m²)
 *    - Electric Equipment (Pcs, sets)
 *    - Cable & Wire (m, cm, kg)
 * 
 * 4. Consumer Goods:
 *    - Textile & Apparel (m, kg, Pcs)
 *    - Jewellery & Precious Metals (gm, kg, Pcs)
 *    - Leather Goods (m², kg)
 *    - Sports Goods & Gear (Pcs, kg, m)
 *    - Furniture & Woodwork (Pcs, Set, m)
 *    - Handloom & Traditional Weaving (m, Pcs)
 * 
 * 5. Food & Healthcare:
 *    - Medical Devices (Pcs, sets)
 *    - Biomedical & Biotech (gm, ltr, Pcs)
 *    - Dairy & Processed Food (ltr, kg, gm)
 */

export type UomCategoryType = 'WEIGHT' | 'VOLUME' | 'LENGTH' | 'AREA' | 'DISCRETE';

export interface UnitOfMeasure {
  code: string;
  name: string;
  symbol: string;
  type: UomCategoryType;
  description: string;
  baseRatio: number; // Ratio relative to SI base unit (kg, m, ltr, m², pcs)
  siBaseUnit: string;
}

export const MASTER_UOM_LIST: Record<string, UnitOfMeasure> = {
  // Weight Units
  MT: {
    code: 'MT',
    name: 'Metric Ton',
    symbol: 'MT',
    type: 'WEIGHT',
    description: 'Bulk industrial metric ton (1,000 kg)',
    baseRatio: 1000,
    siBaseUnit: 'kg',
  },
  kg: {
    code: 'kg',
    name: 'Kilogram',
    symbol: 'kg',
    type: 'WEIGHT',
    description: 'Standard SI mass unit',
    baseRatio: 1,
    siBaseUnit: 'kg',
  },
  gm: {
    code: 'gm',
    name: 'Gram',
    symbol: 'gm',
    type: 'WEIGHT',
    description: 'Precision metric mass unit (1/1000 kg)',
    baseRatio: 0.001,
    siBaseUnit: 'kg',
  },

  // Volume Units
  ltr: {
    code: 'ltr',
    name: 'Liter',
    symbol: 'L',
    type: 'VOLUME',
    description: 'Metric liquid volume unit',
    baseRatio: 1,
    siBaseUnit: 'ltr',
  },
  m3: {
    code: 'm3',
    name: 'Cubic Meter',
    symbol: 'm³',
    type: 'VOLUME',
    description: 'Bulk dry/fluid volume (1,000 liters)',
    baseRatio: 1000,
    siBaseUnit: 'ltr',
  },

  // Length Units
  m: {
    code: 'm',
    name: 'Meter',
    symbol: 'm',
    type: 'LENGTH',
    description: 'Standard linear metric distance',
    baseRatio: 1,
    siBaseUnit: 'm',
  },
  cm: {
    code: 'cm',
    name: 'Centimeter',
    symbol: 'cm',
    type: 'LENGTH',
    description: 'Precision linear sub-unit (1/100 m)',
    baseRatio: 0.01,
    siBaseUnit: 'm',
  },

  // Area Units
  m2: {
    code: 'm2',
    name: 'Square Meter',
    symbol: 'm²',
    type: 'AREA',
    description: 'Surface area measurement',
    baseRatio: 1,
    siBaseUnit: 'm2',
  },

  // Discrete / Count Units
  Pcs: {
    code: 'Pcs',
    name: 'Pieces',
    symbol: 'Pcs',
    type: 'DISCRETE',
    description: 'Individual manufactured component pieces',
    baseRatio: 1,
    siBaseUnit: 'Pcs',
  },
  Unit: {
    code: 'Unit',
    name: 'Finished Unit',
    symbol: 'Unit',
    type: 'DISCRETE',
    description: 'Complete assembled unit or machinery product',
    baseRatio: 1,
    siBaseUnit: 'Unit',
  },
  Set: {
    code: 'Set',
    name: 'Set / Kit',
    symbol: 'Set',
    type: 'DISCRETE',
    description: 'Complete matched kit or assembly set',
    baseRatio: 1,
    siBaseUnit: 'Set',
  },
  sets: {
    code: 'sets',
    name: 'Sets',
    symbol: 'sets',
    type: 'DISCRETE',
    description: 'Multi-part equipment kit or tooling set',
    baseRatio: 1,
    siBaseUnit: 'Set',
  },
};

export interface IndustrySector {
  id: string;
  name: string;
  categoryId: 'heavy-raw-materials' | 'process-chemical' | 'engineering-electronics' | 'consumer-goods' | 'food-healthcare';
  categoryName: string;
  primaryUom: string;
  supportedUoms: string[];
  description: string;
  sampleRawMaterials: string[];
  sampleFinishedProducts: string[];
  typicalBatchSize: string;
  isoStandard: string;
  typicalDensityKgPerLtr?: number; // for volume-to-weight conversions
}

export interface IndustryCategory {
  id: 'heavy-raw-materials' | 'process-chemical' | 'engineering-electronics' | 'consumer-goods' | 'food-healthcare';
  name: string;
  number: number;
  badge: string;
  color: string;
  description: string;
  sectors: IndustrySector[];
}

export const INDUSTRY_SECTORS: IndustrySector[] = [
  // 1. Heavy & Raw Materials
  {
    id: 'steel-heavy-metals',
    name: 'Steel & Heavy Metals',
    categoryId: 'heavy-raw-materials',
    categoryName: '1. Heavy & Raw Materials',
    primaryUom: 'MT',
    supportedUoms: ['MT', 'kg', 'm'],
    description: 'Primary metallurgy, hot-rolled steel coils, structural beams, extruded billet fabrication, and heavy alloys.',
    sampleRawMaterials: ['Iron Ore Pellets (MT)', 'Metallurgical Coke (MT)', 'Scrap Metal Bales (kg/MT)', 'Ferro-Chrome Alloys (kg)'],
    sampleFinishedProducts: ['Hot-Rolled Structural Beams (m)', 'Galvanized Coil Sheets (MT)', 'Automotive High-Tensile Bars (MT)'],
    typicalBatchSize: '5,000 MT',
    isoStandard: 'ISO 9001 / EN 10025 / ASTM A36',
    typicalDensityKgPerLtr: 7.85,
  },
  {
    id: 'cement-building',
    name: 'Cement & Building Materials',
    categoryId: 'heavy-raw-materials',
    categoryName: '1. Heavy & Raw Materials',
    primaryUom: 'MT',
    supportedUoms: ['MT', 'm3'],
    description: 'Clinker calcination, Portland cement grinding, premix concrete batching plants, and structural aggregates.',
    sampleRawMaterials: ['Limestone Rock (MT)', 'Gypsum Retarder (MT)', 'River Sand Aggregates (m³)', 'Pozzolana Fly Ash (MT)'],
    sampleFinishedProducts: ['High-Strength Portland Cement (MT)', 'Ready-Mix Slump Concrete (m³)', 'Fiber-Reinforced Concrete Slabs (m³)'],
    typicalBatchSize: '12,000 MT',
    isoStandard: 'ISO 14001 / ASTM C150 / EN 197-1',
    typicalDensityKgPerLtr: 2.4,
  },
  {
    id: 'mining-minerals',
    name: 'Mining & Minerals',
    categoryId: 'heavy-raw-materials',
    categoryName: '1. Heavy & Raw Materials',
    primaryUom: 'MT',
    supportedUoms: ['MT', 'kg', 'm3'],
    description: 'Open-pit extraction, heavy ore beneficiation, mineral crushing, froth flotation, and bulk slurry logistics.',
    sampleRawMaterials: ['Run-of-Mine Crushed Rock (m³)', 'Chemical Flotation Frothers (kg)', 'Grinding Mill Steel Balls (MT)'],
    sampleFinishedProducts: ['Enriched Copper Concentrate (MT)', 'Bauxite Alumina Feedstock (MT)', 'Rare-Earth Mineral Oxides (kg)'],
    typicalBatchSize: '25,000 MT',
    isoStandard: 'ISO 45001 / ICMM Mining Principles',
    typicalDensityKgPerLtr: 2.8,
  },
  {
    id: 'glass-ceramic',
    name: 'Glass & Ceramic',
    categoryId: 'heavy-raw-materials',
    categoryName: '1. Heavy & Raw Materials',
    primaryUom: 'm2',
    supportedUoms: ['m2', 'kg', 'Pcs'],
    description: 'Float glass melting, architectural tempered glazing, ceramic porcelain tiles, and refractory kiln bricks.',
    sampleRawMaterials: ['Silica Sand 99% Pure (kg/MT)', 'Soda Ash & Dolomite (kg)', 'Feldspar Mineral Powder (kg)', 'Refractory Bind (kg)'],
    sampleFinishedProducts: ['Low-E Tempered Architectural Glass (m²)', 'Vitrified Porcelain Floor Tiles (m²)', 'High-Temp Refractory Bricks (Pcs)'],
    typicalBatchSize: '15,000 m²',
    isoStandard: 'ISO 9001 / EN 12150 / ASTM C1036',
    typicalDensityKgPerLtr: 2.5,
  },

  // 2. Process & Chemical Industries
  {
    id: 'chemical',
    name: 'Chemical & Petrochemical',
    categoryId: 'process-chemical',
    categoryName: '2. Process & Chemical Industries',
    primaryUom: 'ltr',
    supportedUoms: ['ltr', 'kg', 'MT'],
    description: 'Continuous chemical synthesis, batch reactor distillation, industrial solvents, acid purification, and specialty polymers.',
    sampleRawMaterials: ['Ethylene / Propylene Monomers (MT)', 'Hydrochloric Acid Solution (ltr)', 'Precious Metal Catalyst Powder (kg)'],
    sampleFinishedProducts: ['High-Purity Industrial Solvents (ltr)', 'Polyester Polyol Resin (MT)', 'Specialty Surfactants (ltr/kg)'],
    typicalBatchSize: '50,000 ltr',
    isoStandard: 'ISO 9001 / OSHA PSM / REACH Compliant',
    typicalDensityKgPerLtr: 0.95,
  },
  {
    id: 'paint-coatings',
    name: 'Paint & Surface Coatings',
    categoryId: 'process-chemical',
    categoryName: '2. Process & Chemical Industries',
    primaryUom: 'ltr',
    supportedUoms: ['ltr', 'kg'],
    description: 'High-speed pigment dispersion, bead mill grinding, acrylic emulsion blending, and automotive protective coatings.',
    sampleRawMaterials: ['Titanium Dioxide White Pigment (kg)', 'Acrylic Copolymer Emulsion (ltr)', 'Glycol Coalescent Solvents (ltr)'],
    sampleFinishedProducts: ['Automotive Polyurethane Topcoat (ltr)', 'Antimicrobial Interior Wall Emulsion (ltr)', 'Industrial Anti-Corrosion Primer (ltr)'],
    typicalBatchSize: '20,000 ltr',
    isoStandard: 'ISO 9001 / ISO 12944 / Low-VOC Certified',
    typicalDensityKgPerLtr: 1.25,
  },
  {
    id: 'rubber-tyre',
    name: 'Rubber & Tyre',
    categoryId: 'process-chemical',
    categoryName: '2. Process & Chemical Industries',
    primaryUom: 'kg',
    supportedUoms: ['kg', 'Pcs'],
    description: 'Elastomer compounding, Banbury mixing, tyre calendering, tread extrusion, and automated curing press vulcanization.',
    sampleRawMaterials: ['Natural Ribbed Smoked Sheet Rubber (kg)', 'Synthetic Polybutadiene (kg)', 'Carbon Black Reinforcing Agent (kg)', 'Steel Cord Wire (kg)'],
    sampleFinishedProducts: ['High-Performance Radial Passenger Tyres (Pcs)', 'Heavy Truck Commercial Tyres (Pcs)', 'Industrial Conveyor Belting (kg)'],
    typicalBatchSize: '8,000 Pcs',
    isoStandard: 'IATF 16949 / DOT / ECE R30',
    typicalDensityKgPerLtr: 1.15,
  },
  {
    id: 'fertilizer-agrochem',
    name: 'Fertilizer & Agrochem',
    categoryId: 'process-chemical',
    categoryName: '2. Process & Chemical Industries',
    primaryUom: 'MT',
    supportedUoms: ['kg', 'MT'],
    description: 'Ammonia synthesis, prilling tower granulation, urea production, complex NPK blending, and crop protection formulations.',
    sampleRawMaterials: ['Anhydrous Liquid Ammonia (MT)', 'Phosphoric Acid 54% (MT)', 'Granular Potassium Chloride (kg/MT)'],
    sampleFinishedProducts: ['Prilled Urea Nitrogen Fertilizer (MT)', 'Diammonium Phosphate (DAP) (MT)', 'Water-Soluble NPK Macro-Nutrient (kg/MT)'],
    typicalBatchSize: '10,000 MT',
    isoStandard: 'ISO 9001 / IFA Protect & Sustain',
    typicalDensityKgPerLtr: 1.33,
  },
  {
    id: 'plastic-polymers',
    name: 'Plastic & Polymers',
    categoryId: 'process-chemical',
    categoryName: '2. Process & Chemical Industries',
    primaryUom: 'MT',
    supportedUoms: ['kg', 'MT'],
    description: 'Polymerization reactors, high-output twin-screw compounding, masterbatch coloration, and plastic pellet extrusion.',
    sampleRawMaterials: ['Virgin HDPE / PP Reactor Powder (MT)', 'Organic Color Pigment Masterbatch (kg)', 'UV Stabilizer Additive (kg)'],
    sampleFinishedProducts: ['Injection-Grade Polypropylene Pellets (MT)', 'Blow-Molding High-Density Polyethylene (MT)', 'Engineering Polyamide Compounds (kg/MT)'],
    typicalBatchSize: '3,000 MT',
    isoStandard: 'ISO 9001 / FDA Food Contact Safe',
    typicalDensityKgPerLtr: 0.92,
  },

  // 3. Engineering, Machinery & Electronics
  {
    id: 'automobile-vehicles',
    name: 'Automobile & Vehicles',
    categoryId: 'engineering-electronics',
    categoryName: '3. Engineering, Machinery & Electronics',
    primaryUom: 'Unit',
    supportedUoms: ['Unit', 'kg'],
    description: 'Body-in-White robotic welding, automated electro-coating paint shops, high-voltage EV battery marriage, and final roll-off assembly.',
    sampleRawMaterials: ['Stamped Stamped Steel Body Panels (kg)', 'Aluminum Die-Cast Suspension Arms (kg)', 'EV Battery Pack Enclosure (Unit)', 'Instrument Cockpit Harness (Unit)'],
    sampleFinishedProducts: ['All-Electric Long-Range SUV (Unit)', 'Commercial Electric Light Delivery Van (Unit)', 'Hybrid High-Efficiency Sedan (Unit)'],
    typicalBatchSize: '450 Units',
    isoStandard: 'IATF 16949 / ISO 26262 ASIL-D',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'electrical-electronics',
    name: 'Electrical & Electronics',
    categoryId: 'engineering-electronics',
    categoryName: '3. Engineering, Machinery & Electronics',
    primaryUom: 'Pcs',
    supportedUoms: ['Pcs', 'm', 'cm'],
    description: 'High-speed surface mount technology (SMT), pick-and-place microchip placement, selective solder waving, and in-circuit testing.',
    sampleRawMaterials: ['Multi-Layer FR-4 Motherboard PCBs (Pcs)', 'Microprocessor Silicon ICs (Pcs)', 'Flexible Flat FFC Interconnect Cable (m/cm)', 'Passive Capacitors (Pcs)'],
    sampleFinishedProducts: ['Industrial IoT Sensor Gateway Module (Pcs)', '5G Cellular Telemetry Controller (Pcs)', 'Multi-Channel Power Distribution Board (Pcs)'],
    typicalBatchSize: '15,000 Pcs',
    isoStandard: 'IPC-A-610 Class 3 / ISO 9001',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'heavy-machine',
    name: 'Heavy Industrial Machine',
    categoryId: 'engineering-electronics',
    categoryName: '3. Engineering, Machinery & Electronics',
    primaryUom: 'Unit',
    supportedUoms: ['Unit', 'Pcs', 'sets'],
    description: 'Heavy structural bed casting, 5-axis gantry milling, high-precision spindle balance, hydraulic circuit routing, and CNC integration.',
    sampleRawMaterials: ['Cast Iron Meehanite Bed Casting (Unit)', 'Precision Linear Roller Guideways (sets)', 'High-Speed CNC Spindle Cartridge (Pcs)', 'Hardened Planetary Gears (Pcs)'],
    sampleFinishedProducts: ['5-Axis Universal Machining Center (Unit)', '800-Ton Hydraulic Stamping Press (Unit)', 'Robotic Gantry Pick-and-Place System (sets)'],
    typicalBatchSize: '25 Units',
    isoStandard: 'CE Machinery Directive / ISO 12100 / ISO 13849',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'solar-power',
    name: 'Solar Power & Photovoltaics',
    categoryId: 'engineering-electronics',
    categoryName: '3. Engineering, Machinery & Electronics',
    primaryUom: 'Pcs',
    supportedUoms: ['Pcs', 'm2'],
    description: 'Crystalline silicon ingot slicing, photovoltaic wafer chemical texturing, automated cell stringing, and vacuum lamination.',
    sampleRawMaterials: ['Monocrystalline Silicon Solar Cells (Pcs)', 'Photovoltaic Front Glass Sheet 3.2mm (m²)', 'EVA Encapsulant Copolymer Film (m²)', 'Anodized Aluminum Frame (m)'],
    sampleFinishedProducts: ['580W Bifacial High-Efficiency Solar Panel (Pcs)', 'Commercial Rooftop PV Module Array (m²)', 'Micro-Inverter Integrated Solar Kit (Pcs)'],
    typicalBatchSize: '5,000 Pcs',
    isoStandard: 'IEC 61215 / IEC 61730 / UL 1703',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'electric-equipment',
    name: 'Electric Equipment',
    categoryId: 'engineering-electronics',
    categoryName: '3. Engineering, Machinery & Electronics',
    primaryUom: 'Pcs',
    supportedUoms: ['Pcs', 'sets'],
    description: 'High-voltage copper transformer winding, vacuum pressure impregnation (VPI), circuit breaker testing, and power switchgear assembly.',
    sampleRawMaterials: ['Electrolytic Copper Busbar Strip (kg)', 'Silicon Core Steel Laminations (kg)', 'Vacuum Circuit Interrupter Bottle (Pcs)', 'Protection Relay Sensor Kit (sets)'],
    sampleFinishedProducts: ['Medium-Voltage Gas-Insulated Switchgear (sets)', '2,500 kVA Step-Down Dry Transformer (Pcs)', 'Intelligent Motor Control Center (sets)'],
    typicalBatchSize: '250 Sets',
    isoStandard: 'IEC 62271 / IEEE C37 / ISO 9001',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'cable-wire',
    name: 'Cable & Wire',
    categoryId: 'engineering-electronics',
    categoryName: '3. Engineering, Machinery & Electronics',
    primaryUom: 'm',
    supportedUoms: ['m', 'cm', 'kg'],
    description: 'High-speed continuous copper wire drawing, multi-strand twisting, cross-linked polyethylene (XLPE) extrusion, and cable braiding.',
    sampleRawMaterials: ['8mm Electrolytic Copper Rod (kg)', 'Cross-Linked Polyethylene Insulation Granules (kg)', 'Galvanized Steel Armor Wire (kg)'],
    sampleFinishedProducts: ['Medium-Voltage Underground Power Cable (m)', 'Industrial Ethernet Cat-7 Shielded Cable (m)', 'Precision Instrumentation Sensor Harness (cm/m)'],
    typicalBatchSize: '100,000 m',
    isoStandard: 'IEC 60502 / UL 44 / RoHS / REACH',
    typicalDensityKgPerLtr: 1.0,
  },

  // 4. Consumer Goods
  {
    id: 'textile-apparel',
    name: 'Textile & Apparel',
    categoryId: 'consumer-goods',
    categoryName: '4. Consumer Goods',
    primaryUom: 'm',
    supportedUoms: ['m', 'kg', 'Pcs'],
    description: 'Ring and rotor cotton spinning, high-speed air-jet weaving, continuous dyeing ranges, computer-aided laser cutting, and garment stitching.',
    sampleRawMaterials: ['Carded Combed Cotton Bales (kg)', 'Synthetic Spun Filament Yarn (kg)', 'Reactive Textile Dyes (kg)', 'Woven Interlining Rolls (m)'],
    sampleFinishedProducts: ['High-Thread Egyptian Cotton Woven Fabric (m)', 'Finished Performance Sportswear Garments (Pcs)', 'Industrial Antimicrobial Uniform Fabrics (m)'],
    typicalBatchSize: '25,000 m',
    isoStandard: 'OEKO-TEX Standard 100 / ISO 9001 / GOTS',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'jewellery-precious-metals',
    name: 'Jewellery & Precious Metals',
    categoryId: 'consumer-goods',
    categoryName: '4. Consumer Goods',
    primaryUom: 'gm',
    supportedUoms: ['gm', 'kg', 'Pcs'],
    description: 'Fine gold/platinum alloy smelting, 3D wax micro-casting, precision diamond setting, laser engraving, and ultrasonic micro-polishing.',
    sampleRawMaterials: ['24-Karat Fine Gold Bullion Granules (gm/kg)', 'Platinum 950 Casting Grain (gm)', 'Certified Natural Diamond Solitaires (Pcs)', 'Rhodium Plating Salt (gm)'],
    sampleFinishedProducts: ['18K Diamond Solitaire Engagement Ring (Pcs/gm)', 'Handmade Platinum Tennis Necklace (gm)', 'Hallmarked Gold Investment Bullion Bars (gm/kg)'],
    typicalBatchSize: '2,500 gm',
    isoStandard: 'Responsible Jewellery Council (RJC) / Hallmarking BIS/LBMA',
    typicalDensityKgPerLtr: 19.3,
  },
  {
    id: 'leather-goods',
    name: 'Leather Goods',
    categoryId: 'consumer-goods',
    categoryName: '4. Consumer Goods',
    primaryUom: 'm2',
    supportedUoms: ['m2', 'kg'],
    description: 'Raw hide tanning, chromium-free vegetable soaking, computer-controlled hide nesting, edge beveling, and saddle-stitching.',
    sampleRawMaterials: ['Salted Raw Bovine Hides (kg)', 'Vegetable Quebracho Tanning Tannins (kg)', 'Polyester Waxed Saddlery Thread (m)', 'Solid Brass Buckles & Hardware (Pcs)'],
    sampleFinishedProducts: ['Full-Grain Calfskin Leather Upholstery Hides (m²)', 'Handcrafted Executive Leather Briefcases (Pcs)', 'Aniline Leather Automotive Seat Trim (m²)'],
    typicalBatchSize: '3,500 m²',
    isoStandard: 'Leather Working Group (LWG) Gold / ISO 9001',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'sports-goods',
    name: 'Sports Goods & Gear',
    categoryId: 'consumer-goods',
    categoryName: '4. Consumer Goods',
    primaryUom: 'Pcs',
    supportedUoms: ['Pcs', 'kg', 'm'],
    description: 'High-modulus carbon-fiber prepreg molding, thermal PU ball bonding, vulcanized foam padding, and automated aerodynamic testing.',
    sampleRawMaterials: ['Toray 3K Carbon Fiber Prepreg Fabric (m)', 'Thermoset Epoxy Matrix Resin (kg)', 'Microcellular EVA Shock Absorption Foam (m/kg)', 'Synthetic PU Skin (m)'],
    sampleFinishedProducts: ['FIFA-Approved Match Thermally Bonded Ball (Pcs)', 'Ultralight Carbon-Fiber Composite Bicycle Frame (Pcs)', 'Weightlifting Steel Barbell Plates (kg)'],
    typicalBatchSize: '6,000 Pcs',
    isoStandard: 'ISO 9001 / FIFA Quality Pro / CE Certified',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'furniture-woodwork',
    name: 'Furniture & Woodwork',
    categoryId: 'consumer-goods',
    categoryName: '4. Consumer Goods',
    primaryUom: 'Pcs',
    supportedUoms: ['Pcs', 'Set', 'm'],
    description: 'Kiln timber drying, 5-axis CNC wood routing, polyurethane automated edge-banding, veneer vacuum pressing, and flat-pack assembly.',
    sampleRawMaterials: ['Kiln-Dried FSC Certified Oak Timber (m)', 'High-Density Fiberboard Substrate Panels (m²)', 'High-Pressure Laminate Sheets (m²)', 'Concealed Soft-Close Hinges (Pcs)'],
    sampleFinishedProducts: ['Ergonomic Motorized Height-Adjustable Desk (Pcs)', 'Solid Oak 8-Seater Dining Suite (Set)', 'Modular Acoustic Workstation Pods (Set/Pcs)'],
    typicalBatchSize: '800 Pcs',
    isoStandard: 'FSC Certified / BIFMA X5.5 / ISO 9001',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'handloom-weaving',
    name: 'Handloom & Traditional Weaving',
    categoryId: 'consumer-goods',
    categoryName: '4. Consumer Goods',
    primaryUom: 'm',
    supportedUoms: ['m', 'Pcs'],
    description: 'Artisan warp beam winding, traditional jacquard shuttle loom weaving, natural botanical dyeing, and hand-embroidered border finish.',
    sampleRawMaterials: ['Raw Mulberry Silk Reeled Yarn (kg)', 'Organic Hand-Spun Khadi Cotton Hanks (m/kg)', 'Natural Madder & Indigo Botanical Dyes (kg)'],
    sampleFinishedProducts: ['Handcrafted Pure Zari Silk Sari (Pcs/m)', 'Artisan Woven Jacquard Cotton Tapestry (m)', 'Hand-Spun Khadi Fabric Bolts (m)'],
    typicalBatchSize: '1,500 m',
    isoStandard: 'Geographical Indication (GI) / Handloom Mark / Fair Trade',
    typicalDensityKgPerLtr: 1.0,
  },

  // 5. Food, Healthcare
  {
    id: 'medical-device',
    name: 'Medical Device Manufacturing',
    categoryId: 'food-healthcare',
    categoryName: '5. Food, Healthcare',
    primaryUom: 'Pcs',
    supportedUoms: ['Pcs', 'sets'],
    description: 'ISO Class 7 cleanroom injection molding, ultrasonic catheter welding, laser ablation, sterile barrier packaging, and EtO sterilization.',
    sampleRawMaterials: ['Medical-Grade PEEK Biopolymer Pellets (kg)', 'Medical Titanium Grade 5 Wire (m/kg)', 'Micro-Sterile Tyvek Barrier Pouches (Pcs)'],
    sampleFinishedProducts: ['Class III Implantable Micro-Stimulator Unit (Pcs)', 'Sterile Orthopedic Titanium Trauma Screw Set (sets)', 'Single-Use Cardiac Angioplasty Balloon Catheter (Pcs)'],
    typicalBatchSize: '2,500 Pcs',
    isoStandard: 'ISO 13485 / FDA 21 CFR 820 / CE MDR',
    typicalDensityKgPerLtr: 1.0,
  },
  {
    id: 'biomedical-biotech',
    name: 'Biomedical & Biotech',
    categoryId: 'food-healthcare',
    categoryName: '5. Food, Healthcare',
    primaryUom: 'gm',
    supportedUoms: ['gm', 'ltr', 'Pcs'],
    description: 'Mammalian bioreactor cell culture, protein purification chromatography, microfiltration, lyophilization, and cold-chain vial filling.',
    sampleRawMaterials: ['Chemically Defined Cell Culture Media Powder (kg)', 'High-Purity Chromatography Resin (ltr)', 'Sterile Depyrogenated Glass Vials (Pcs)'],
    sampleFinishedProducts: ['Lyophilized Active Pharmaceutical Peptide (gm)', 'Monoclonal Antibody Recombinant Solution (ltr)', 'Microfluidic Diagnostic Antigen Test Cartridges (Pcs)'],
    typicalBatchSize: '1,200 gm',
    isoStandard: 'cGMP / FDA 21 CFR Part 11 / ISO 17025',
    typicalDensityKgPerLtr: 1.02,
  },
  {
    id: 'dairy-food-products',
    name: 'Dairy & Processed Food',
    categoryId: 'food-healthcare',
    categoryName: '5. Food, Healthcare',
    primaryUom: 'ltr',
    supportedUoms: ['ltr', 'kg', 'gm'],
    description: 'Raw milk reception chilling, high-temperature short-time (HTST) pasteurization, centrifugal fat separation, aseptic tetra-packing, and spray-drying.',
    sampleRawMaterials: ['Chilled Farm Raw Whole Milk (ltr)', 'Thermophilic Lactic Culture Strains (gm)', 'Vitamin A & D Nutritional Premix (gm/kg)', 'Food-Grade Aseptic Barrier Board (m²)'],
    sampleFinishedProducts: ['Pasteurized Ultra-Filtered Whole Milk (ltr)', 'Spray-Dried Infant Nutrition Powder (kg/gm)', 'Cultured Probiotic Greek Yogurt Cups (gm/kg)'],
    typicalBatchSize: '150,000 ltr',
    isoStandard: 'ISO 22000 / HACCP / FSSC 22000 / FDA',
    typicalDensityKgPerLtr: 1.03,
  },
];

export const INDUSTRY_CATEGORIES: IndustryCategory[] = [
  {
    id: 'heavy-raw-materials',
    name: 'Heavy & Raw Materials',
    number: 1,
    badge: 'HEAVY-RAW',
    color: 'slate',
    description: 'Mining, metallurgy, structural building materials, steel, cement, and architectural glass.',
    sectors: INDUSTRY_SECTORS.filter((s) => s.categoryId === 'heavy-raw-materials'),
  },
  {
    id: 'process-chemical',
    name: 'Process & Chemical Industries',
    number: 2,
    badge: 'PROCESS-CHEM',
    color: 'emerald',
    description: 'Liquid and bulk continuous processing: petrochemicals, paints, elastomeric tyres, fertilizers, and polymers.',
    sectors: INDUSTRY_SECTORS.filter((s) => s.categoryId === 'process-chemical'),
  },
  {
    id: 'engineering-electronics',
    name: 'Engineering, Machinery & Electronics',
    number: 3,
    badge: 'ENG-ELEC',
    color: 'blue',
    description: 'High-precision discrete assembly: automobiles, robotics, solar arrays, cables, and circuit electronics.',
    sectors: INDUSTRY_SECTORS.filter((s) => s.categoryId === 'engineering-electronics'),
  },
  {
    id: 'consumer-goods',
    name: 'Consumer Goods',
    number: 4,
    badge: 'CONSUMER',
    color: 'amber',
    description: 'Textiles, fine gold & platinum jewellery, tanned leather, athletic equipment, and artisan furniture.',
    sectors: INDUSTRY_SECTORS.filter((s) => s.categoryId === 'consumer-goods'),
  },
  {
    id: 'food-healthcare',
    name: 'Food, Healthcare',
    number: 5,
    badge: 'HEALTH-FOOD',
    color: 'rose',
    description: 'Regulated health sciences: certified medical implants, biotechnology peptides, and commercial dairy processing.',
    sectors: INDUSTRY_SECTORS.filter((s) => s.categoryId === 'food-healthcare'),
  },
];

/**
 * Format quantity with industry unit of measure nicely
 */
export function formatQuantityWithUom(qty: number, uomCode: string): string {
  const formatted = qty.toLocaleString(undefined, {
    maximumFractionDigits: uomCode === 'MT' || uomCode === 'm3' ? 2 : 0,
  });
  return `${formatted} ${uomCode}`;
}

/**
 * Perform realistic unit conversion with optional material density support
 */
export function convertMeasurement(
  qty: number,
  fromUom: string,
  toUom: string,
  densityKgPerLtr: number = 1.0
): { convertedQty: number; formula: string; note: string } {
  if (fromUom === toUom) {
    return { convertedQty: qty, formula: 'Direct 1:1 match', note: 'No conversion needed.' };
  }

  // Weight conversions
  if (fromUom === 'MT' && toUom === 'kg') return { convertedQty: qty * 1000, formula: '1 MT = 1,000 kg', note: 'Mass multiplication' };
  if (fromUom === 'kg' && toUom === 'MT') return { convertedQty: qty / 1000, formula: '1,000 kg = 1 MT', note: 'Mass division' };
  if (fromUom === 'kg' && toUom === 'gm') return { convertedQty: qty * 1000, formula: '1 kg = 1,000 gm', note: 'Metric precision' };
  if (fromUom === 'gm' && toUom === 'kg') return { convertedQty: qty / 1000, formula: '1,000 gm = 1 kg', note: 'Metric scale' };
  if (fromUom === 'MT' && toUom === 'gm') return { convertedQty: qty * 1000000, formula: '1 MT = 1,000,000 gm', note: 'Full mass scale' };

  // Volume conversions
  if (fromUom === 'm3' && toUom === 'ltr') return { convertedQty: qty * 1000, formula: '1 m³ = 1,000 ltr', note: 'Metric volume scale' };
  if (fromUom === 'ltr' && toUom === 'm3') return { convertedQty: qty / 1000, formula: '1,000 ltr = 1 m³', note: 'Bulk dry volume' };

  // Length conversions
  if (fromUom === 'm' && toUom === 'cm') return { convertedQty: qty * 100, formula: '1 m = 100 cm', note: 'Linear scale' };
  if (fromUom === 'cm' && toUom === 'm') return { convertedQty: qty / 100, formula: '100 cm = 1 m', note: 'Linear scale' };

  // Volume <-> Weight conversions via density
  if (fromUom === 'ltr' && toUom === 'kg') {
    const converted = qty * densityKgPerLtr;
    return {
      convertedQty: converted,
      formula: `Mass = Volume (${qty} ltr) × Density (${densityKgPerLtr} kg/L)`,
      note: `Adjusted for industry material specific gravity (${densityKgPerLtr} kg/L).`,
    };
  }
  if (fromUom === 'kg' && toUom === 'ltr') {
    const converted = qty / densityKgPerLtr;
    return {
      convertedQty: converted,
      formula: `Volume = Mass (${qty} kg) ÷ Density (${densityKgPerLtr} kg/L)`,
      note: `Adjusted for industry material specific gravity (${densityKgPerLtr} kg/L).`,
    };
  }
  if (fromUom === 'm3' && toUom === 'MT') {
    const converted = qty * densityKgPerLtr; // 1 m3 water = 1 MT; for steel density 7.85 -> 7.85 MT
    return {
      convertedQty: converted,
      formula: `Mass = Bulk Vol (${qty} m³) × Density (${densityKgPerLtr} MT/m³)`,
      note: `Bulk material density conversion.`,
    };
  }

  return {
    convertedQty: qty,
    formula: `Standard direct enterprise unit mapping (${fromUom} to ${toUom})`,
    note: 'Discrete or composite conversion.',
  };
}

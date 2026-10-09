import {
  PrismaClient,
  Role,
  UserStatus,
  ItemCategory,
  BomStatus,
  WorkOrderStatus,
  Priority,
  MovementType,
  QualityStatus,
  MachineStatus,
  GateDirection,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 [Apex ERP] Seeding Database with 11 RBAC Roles, Dynamic ItemMaster (JSONB), and Multi-Level BOM...');

  // 1. Hash default password
  const defaultPassword = 'Admin@ERP2026!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 2. Clean up existing records in dependency order
  await prisma.gateLog.deleteMany();
  await prisma.qualityInspection.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.workOrderOperation.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.bomItem.deleteMany();
  await prisma.billOfMaterial.deleteMany();
  await prisma.machineStation.deleteMany();
  await prisma.itemMaster.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 3. Seed Users for all 11 Roles
  console.log('👤 Seeding 11 Enterprise Role Users...');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@mfg-erp.local',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      role: Role.ADMIN,
      department: 'Information Technology',
      customAttrs: { isSuperUser: true, securityClearance: 'LEVEL_5' },
    },
  });

  const owner = await prisma.user.create({
    data: {
      email: 'owner@mfg-erp.local',
      passwordHash,
      firstName: 'Rajesh',
      lastName: 'Singhania',
      role: Role.OWNER,
      department: 'Executive Board',
      customAttrs: { title: 'Managing Director & Founder', plantAccess: ['ALL'] },
    },
  });

  const ppcLead = await prisma.user.create({
    data: {
      email: 'ppc@mfg-erp.local',
      passwordHash,
      firstName: 'Vikram',
      lastName: 'Deshmukh',
      role: Role.PPC,
      department: 'Production Planning & Control',
      customAttrs: { shift: 'GENERAL', certification: 'APICS CPIM' },
    },
  });

  const purchaseLead = await prisma.user.create({
    data: {
      email: 'purchase@mfg-erp.local',
      passwordHash,
      firstName: 'Ananya',
      lastName: 'Sharma',
      role: Role.PURCHASE,
      department: 'Procurement & Vendor Management',
      customAttrs: { approvalLimitUSD: 100000 },
    },
  });

  const inventoryLead = await prisma.user.create({
    data: {
      email: 'inventory@mfg-erp.local',
      passwordHash,
      firstName: 'Ramesh',
      lastName: 'Patel',
      role: Role.INVENTORY,
      department: 'Stores & Central Warehouse',
      customAttrs: { primaryWarehouse: 'WH-MAIN-01' },
    },
  });

  const productionSupervisor = await prisma.user.create({
    data: {
      email: 'supervisor@mfg-erp.local',
      passwordHash,
      firstName: 'Marcus',
      lastName: 'Vance',
      role: Role.PRODUCTION_SUPERVISOR,
      department: 'Shop Floor Assembly',
      customAttrs: { lineAssigned: 'LINE-HYDRAULIC-A' },
    },
  });

  const qcManager = await prisma.user.create({
    data: {
      email: 'qc@mfg-erp.local',
      passwordHash,
      firstName: 'Elena',
      lastName: 'Rostova',
      role: Role.QC_MANAGER,
      department: 'Quality Assurance & Metrology',
      customAttrs: { isoAuditCertified: true },
    },
  });

  const gateSecurity = await prisma.user.create({
    data: {
      email: 'gate@mfg-erp.local',
      passwordHash,
      firstName: 'Balwinder',
      lastName: 'Singh',
      role: Role.GATE_SECURITY,
      department: 'Plant Physical Security',
      customAttrs: { gateNumber: 'MAIN_INWARD_GATE_01' },
    },
  });

  const dispatchLead = await prisma.user.create({
    data: {
      email: 'dispatch@mfg-erp.local',
      passwordHash,
      firstName: 'Siddharth',
      lastName: 'Verma',
      role: Role.DISPATCH,
      department: 'Outbound Logistics & Dispatch',
      customAttrs: { dockAssigned: 'OUTBOUND_BAY_03' },
    },
  });

  const financeLead = await prisma.user.create({
    data: {
      email: 'finance@mfg-erp.local',
      passwordHash,
      firstName: 'Meera',
      lastName: 'Iyer',
      role: Role.FINANCE,
      department: 'Cost Accounting & Finance',
      customAttrs: { costCenterCode: 'CC-MFG-200' },
    },
  });

  const hrLead = await prisma.user.create({
    data: {
      email: 'hr@mfg-erp.local',
      passwordHash,
      firstName: 'Kavita',
      lastName: 'Nair',
      role: Role.HR,
      department: 'Human Resources & Plant Safety',
      customAttrs: { workforceLead: true },
    },
  });

  console.log('✅ Created 11 Standard Role Accounts.');

  // 4. Seed Dynamic ItemMaster (with JSONB customAttrs)
  console.log('📦 Seeding Dynamic ItemMaster with JSONB customAttrs...');

  const steelCoil = await prisma.itemMaster.create({
    data: {
      itemCode: 'RAW-STL-001',
      name: 'Cold-Rolled Carbon Steel Coil 1018',
      description: 'High-formability precision cold-rolled strip steel',
      category: ItemCategory.RAW_MATERIAL,
      uom: 'KG',
      standardCost: 1.85,
      hsnCode: '7209.16',
      safetyStock: 1000,
      reorderPoint: 2500,
      currentStock: 6400,
      warehouseLocation: 'WH-A/Bay-01/Rack-04',
      customAttrs: {
        grade: 'AISI 1018',
        thickness_mm: 2.5,
        width_mm: 1250,
        yield_strength_mpa: 370,
        tensile_strength_mpa: 440,
        heat_number: 'HT-2026-9921',
        mill_certificate: 'CERT-JSW-2026-081',
      },
    },
  });

  const oRing = await prisma.itemMaster.create({
    data: {
      itemCode: 'RAW-SEAL-002',
      name: 'High-Temp Fluorosilicone O-Ring Seal',
      description: 'Aerospace-grade oil and hydraulic fluid resistant seal',
      category: ItemCategory.RAW_MATERIAL,
      uom: 'PCS',
      standardCost: 4.20,
      hsnCode: '4016.93',
      safetyStock: 100,
      reorderPoint: 300,
      currentStock: 1200,
      warehouseLocation: 'WH-A/Bin-08',
      customAttrs: {
        durometer_shore_a: 75,
        temp_range_celsius: '-60 to +230',
        mil_spec: 'MIL-R-25988',
        color: 'Fluorescent Blue',
        batch_cure_date: '2026-Q1',
      },
    },
  });

  const bldcMotor = await prisma.itemMaster.create({
    data: {
      itemCode: 'RAW-MTR-003',
      name: 'Brushless DC Coreless Motor 48V',
      description: 'High torque-to-inertia ratio coreless drive motor',
      category: ItemCategory.RAW_MATERIAL,
      uom: 'PCS',
      standardCost: 145.00,
      hsnCode: '8501.31',
      safetyStock: 25,
      reorderPoint: 60,
      currentStock: 95,
      warehouseLocation: 'WH-B/Shelf-02',
      customAttrs: {
        rated_voltage_vdc: 48,
        rated_power_watts: 750,
        max_rpm: 6200,
        continuous_torque_nm: 2.4,
        ip_rating: 'IP67',
        hall_sensor_integrated: true,
      },
    },
  });

  // Level 2 Sub-Assembly Item
  const pumpHeadSubAssembly = await prisma.itemMaster.create({
    data: {
      itemCode: 'SA-PMP-HEAD',
      name: 'Machined Pump Head & Manifold Sub-Assembly',
      description: 'Precision CNC-machined pressure manifold and valve block',
      category: ItemCategory.WORK_IN_PROGRESS,
      uom: 'PCS',
      standardCost: 110.00,
      safetyStock: 15,
      reorderPoint: 35,
      currentStock: 40,
      warehouseLocation: 'WIP-LINE-A/Buffer-01',
      customAttrs: {
        sub_assembly_level: 2,
        assembly_tolerance_microns: 12,
        leak_tested: true,
        test_pressure_bar: 250,
        cad_model_ref: 'CAD-SUB-041B',
      },
    },
  });

  // Level 1 Finished Good Product
  const hydraulicPump = await prisma.itemMaster.create({
    data: {
      itemCode: 'FG-PMP-100',
      name: 'Apex Precision Hydraulic Pump Unit 3000-PSI',
      description: 'Complete industrial power unit with integrated BLDC drive',
      category: ItemCategory.FINISHED_GOOD,
      uom: 'PCS',
      standardCost: 480.00,
      sellingPrice: 950.00,
      hsnCode: '8413.50',
      safetyStock: 10,
      reorderPoint: 25,
      currentStock: 28,
      warehouseLocation: 'WH-OUTBOUND/Bay-01',
      customAttrs: {
        operating_pressure_psi: 3000,
        displacement_cc: 45.0,
        warranty_months: 24,
        compliance: ['CE', 'ISO-9001', 'ATEX'],
        serial_tracking: true,
        dry_weight_kg: 18.5,
      },
    },
  });

  console.log('✅ Created 5 Dynamic ItemMaster records with JSONB attributes.');

  // 5. Seed Multi-Level Bill of Materials (BOM)
  console.log('📑 Seeding Multi-Level Bill of Materials (Level 2 Sub-BOM and Level 1 Top-BOM)...');

  // Level 2 BOM: Pump Head Sub-Assembly
  const subBom = await prisma.billOfMaterial.create({
    data: {
      bomNumber: 'BOM-SUB-HEAD-01',
      name: 'Pump Head & Manifold Sub-Assembly Recipe',
      version: '1.0',
      finishedItemId: pumpHeadSubAssembly.id,
      description: 'Sub-assembly recipe for precision machined manifold',
      status: BomStatus.ACTIVE,
      level: 2,
      isDefault: true,
      routingOps: [
        { seq: 10, operation: 'CNC 5-Axis Block Roughing', machineCode: 'MC-CNC-01', setupMin: 30, runMin: 45 },
        { seq: 20, operation: 'Precision Bore Micro-Honing', machineCode: 'MC-HONE-02', setupMin: 15, runMin: 20 },
        { seq: 30, operation: 'Ultrasonic Degreasing & Seal Insertion', machineCode: 'MC-CLN-03', setupMin: 10, runMin: 15 },
      ],
      components: {
        create: [
          {
            componentItemId: steelCoil.id,
            quantityRequired: 4.5, // 4.5 KG
            scrapPercentage: 3.0,
            uom: 'KG',
            notes: 'Machined from certified billet',
            customAttrs: { hardness_target: '32-36 HRC' },
          },
          {
            componentItemId: oRing.id,
            quantityRequired: 2.0, // 2 PCS
            scrapPercentage: 0,
            uom: 'PCS',
            notes: 'Internal manifold seal channels',
            customAttrs: { torque_spec_nm: 18.5 },
          },
        ],
      },
    },
  });

  // Level 1 BOM: Final Hydraulic Pump Assembly (linking to Level 2 subBOM)
  const topBom = await prisma.billOfMaterial.create({
    data: {
      bomNumber: 'BOM-PMP-100-MAIN',
      name: 'Apex Precision Hydraulic Pump Top Assembly Recipe',
      version: '2.0',
      finishedItemId: hydraulicPump.id,
      description: 'Master assembly BOM incorporating Level 2 sub-assemblies and electric powertrain',
      status: BomStatus.ACTIVE,
      level: 1,
      isDefault: true,
      routingOps: [
        { seq: 10, operation: 'Powertrain & Manifold Marriage', machineCode: 'MC-ASM-01', setupMin: 20, runMin: 50 },
        { seq: 20, operation: 'Dynamic Pressure Testing & Calibration', machineCode: 'MC-TST-02', setupMin: 15, runMin: 30 },
        { seq: 30, operation: 'Electrostatic Powder Coating', machineCode: 'MC-PNT-03', setupMin: 45, runMin: 40 },
      ],
      components: {
        create: [
          {
            componentItemId: pumpHeadSubAssembly.id,
            subBomId: subBom.id, // MULTI-LEVEL LINK TO CHILD SUB-BOM!
            quantityRequired: 1.0,
            scrapPercentage: 0.5,
            uom: 'PCS',
            notes: 'Level 2 Sub-Assembly component',
            customAttrs: { sub_assembly_verified: true },
          },
          {
            componentItemId: bldcMotor.id,
            quantityRequired: 1.0,
            scrapPercentage: 0,
            uom: 'PCS',
            notes: '48V Powertrain integration',
            customAttrs: { encoder_type: 'Optical 1024-CPR' },
          },
          {
            componentItemId: oRing.id,
            quantityRequired: 4.0,
            scrapPercentage: 1.0,
            uom: 'PCS',
            notes: 'Outer housing environmental seals',
            customAttrs: { lubrication: 'Krytox GPL 205' },
          },
        ],
      },
    },
  });

  console.log('✅ Created Multi-Level BOMs (BOM-SUB-HEAD-01 Level 2 and BOM-PMP-100-MAIN Level 1).');

  // 6. Seed Machine Workstations
  const cncStation = await prisma.machineStation.create({
    data: {
      code: 'MC-CNC-01',
      name: 'Mazak 5-Axis High-Precision CNC Center',
      department: 'Machining Bay A',
      status: MachineStatus.OPERATIONAL,
      location: 'Plant 1 - Grid A4',
      capacityPerHour: 3.5,
      hourlyRate: 95.00,
      customAttrs: { controller: 'Fanuc 31i-B5', spindleMaxRpm: 18000, iotGatewayId: 'IOT-GW-091' },
    },
  });

  const assemblyCell = await prisma.machineStation.create({
    data: {
      code: 'MC-ASM-01',
      name: 'Hydraulic Robotic Assembly Cell',
      department: 'Assembly Bay B',
      status: MachineStatus.OPERATIONAL,
      location: 'Plant 1 - Grid B2',
      capacityPerHour: 6.0,
      hourlyRate: 75.00,
      customAttrs: { robotBrand: 'KUKA KR-10', payloadKg: 10 },
    },
  });

  console.log('✅ Created Machine Stations.');

  // 7. Seed Production Work Order
  const workOrder = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-2026-0001',
      description: 'Replenishment Batch for Precision Hydraulic Pump Units',
      productId: hydraulicPump.id,
      bomId: topBom.id,
      quantityToProduce: 50,
      quantityProduced: 20,
      quantityScrapped: 1,
      status: WorkOrderStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      plannedStartDate: new Date('2026-10-05T08:00:00Z'),
      plannedEndDate: new Date('2026-10-12T17:00:00Z'),
      actualStartDate: new Date('2026-10-05T08:30:00Z'),
      supervisorId: productionSupervisor.id,
      customAttrs: { customerOrderRef: 'SO-2026-7781', rushOrder: false },
      operations: {
        create: [
          {
            sequence: 10,
            operationName: 'Powertrain & Manifold Marriage',
            machineId: assemblyCell.id,
            setupTimeMinutes: 20,
            runTimeMinutes: 250,
            status: WorkOrderStatus.IN_PROGRESS,
            operatorNotes: '20 units finished, zero tolerance drift detected.',
          },
        ],
      },
    },
  });

  console.log('✅ Created Active Work Order (WO-2026-0001).');

  // 8. Seed Gate Security Log (Inward Vehicle Tracking)
  await prisma.gateLog.create({
    data: {
      passNumber: 'GP-2026-0001',
      direction: GateDirection.INBOUND,
      vehicleNumber: 'MH-12-PQ-9082',
      driverName: 'Sukhwinder Dhillon',
      driverPhone: '+91 98220 12345',
      transporter: 'TCI Freight Logistics',
      purpose: 'MATERIAL_INWARD',
      materialDocRef: 'PO-2026-4401',
      loggedById: gateSecurity.id,
      notes: 'Carrying 6.4 MT Cold Rolled Steel Coil. Gate weighbridge check passed (Gross: 14.8 MT).',
    },
  });

  console.log('✅ Created Gate Security Inward Log.');

  console.log('\n========================================================================');
  console.log('🎉 APEX MANUFACTURING ERP SEEDING COMPLETE!');
  console.log('========================================================================');
  console.log('Standard Admin Credentials:');
  console.log('  Admin User  : admin@mfg-erp.local / Admin@ERP2026! (Role: ADMIN)');
  console.log('  Owner User  : owner@mfg-erp.local / Admin@ERP2026! (Role: OWNER)');
  console.log('  PPC Planner : ppc@mfg-erp.local   / Admin@ERP2026! (Role: PPC)');
  console.log('  Purchase    : purchase@mfg-erp.local / Admin@ERP2026! (Role: PURCHASE)');
  console.log('  Inventory   : inventory@mfg-erp.local / Admin@ERP2026! (Role: INVENTORY)');
  console.log('  Supervisor  : supervisor@mfg-erp.local / Admin@ERP2026! (Role: PRODUCTION_SUPERVISOR)');
  console.log('  Quality     : qc@mfg-erp.local / Admin@ERP2026! (Role: QC_MANAGER)');
  console.log('  Gatekeeper  : gate@mfg-erp.local / Admin@ERP2026! (Role: GATE_SECURITY)');
  console.log('  Dispatch    : dispatch@mfg-erp.local / Admin@ERP2026! (Role: DISPATCH)');
  console.log('  Finance     : finance@mfg-erp.local / Admin@ERP2026! (Role: FINANCE)');
  console.log('  HR          : hr@mfg-erp.local / Admin@ERP2026! (Role: HR)');
  console.log('========================================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

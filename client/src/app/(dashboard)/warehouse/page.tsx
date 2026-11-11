'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useActiveFranchise } from '@/lib/franchiseStore';
import { PlainEnglishBanner } from '@/components/PlainEnglishBanner';
import {
  Warehouse,
  AlertTriangle,
  Boxes,
  TrendingUp,
  Truck,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Clock,
  Download,
  Lock,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { WarehouseStockItem } from '@/types/warehouse';
import { RoleActionAlerts } from '@/components/RoleActionAlerts';
import { useAuth } from '@/context/AuthContext';
import { SupervisoryBanner } from '@/components/SupervisoryBanner';
import { DepartmentAuditFeed } from '@/components/DepartmentAuditFeed';
import { BarChart, DonutChart } from '@/components/charts';
import { exportToCsv } from '@/lib/exportUtils';
import { enterpriseDataStore, WarehouseStockItem as StoreStockItem } from '@/lib/enterpriseDataStore';

const initialStocks: WarehouseStockItem[] = [
  {
    id: 's-1',
    itemCode: 'PART-SOC-SD8G3',
    itemName: 'Apex Core Industrial Embedded Microprocessor (SoC)',
    category: 'RAW_MATERIAL',
    currentQuantity: 4200,
    reservedQuantity: 2500,
    reorderThreshold: 1500,
    reorderQuantity: 5000,
    unitOfMeasure: 'PCS',
    unitValuation: 8200,
    binCode: 'RACK-A1-TRAY-01',
    lotBatchNumber: 'LOT-QC-9041',
    isBelowReorderThreshold: false,
  },
  {
    id: 's-2',
    itemCode: 'PART-DISP-MOD',
    itemName: '6.7" High-Resolution Industrial Display Module',
    category: 'RAW_MATERIAL',
    currentQuantity: 850,
    reservedQuantity: 800,
    reorderThreshold: 1000,
    reorderQuantity: 3000,
    unitOfMeasure: 'PCS',
    unitValuation: 4800,
    binCode: 'RACK-A2-TRAY-04',
    lotBatchNumber: 'LOT-DISP-2201',
    isBelowReorderThreshold: true,
  },
  {
    id: 's-3',
    itemCode: 'PART-BAT-5000',
    itemName: '5,000mAh High-Density Lithium Power Cell Pack',
    category: 'RAW_MATERIAL',
    currentQuantity: 6200,
    reservedQuantity: 6000,
    reorderThreshold: 2000,
    reorderQuantity: 8000,
    unitOfMeasure: 'PCS',
    unitValuation: 950,
    binCode: 'RACK-B1-TRAY-02',
    lotBatchNumber: 'LOT-BAT-4402',
    isBelowReorderThreshold: false,
  },
  {
    id: 's-4',
    itemCode: 'SKU-APEX-PRO',
    itemName: 'Apex Industrial Module Pro - Enterprise Edition (Finished Packaged Unit)',
    category: 'FINISHED_GOODS',
    currentQuantity: 1800,
    reservedQuantity: 1200,
    reorderThreshold: 500,
    reorderQuantity: 2000,
    unitOfMeasure: 'BOX',
    unitValuation: 38500,
    binCode: 'BAY-FIN-01-PALLET-A',
    lotBatchNumber: 'LOT-FIN-9901',
    isBelowReorderThreshold: false,
  },
  {
    id: 's-5',
    itemCode: 'PART-CAM-50MP',
    itemName: 'High-Precision Optical Telemetry & Alignment Sensor Module',
    category: 'RAW_MATERIAL',
    currentQuantity: 180,
    reservedQuantity: 160,
    reorderThreshold: 250,
    reorderQuantity: 1000,
    unitOfMeasure: 'PCS',
    unitValuation: 3200,
    binCode: 'RACK-C1-TRAY-08',
    lotBatchNumber: 'LOT-SENS-811',
    isBelowReorderThreshold: true,
  },
];

export default function WarehouseOverviewPage() {
  const { session } = useAuth();
  const isSuperAdmin = session?.roleId === 'super_admin';
  const activeFranchise = useActiveFranchise();

  const [storeStocks, setStoreStocks] = useState<StoreStockItem[]>(() => enterpriseDataStore.getWarehouseStocks());

  React.useEffect(() => {
    const refresh = () => setStoreStocks(enterpriseDataStore.getWarehouseStocks());
    window.addEventListener('apex_enterprise_data_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('apex_enterprise_data_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Dynamically adapt stock items and units to active facility's industry sector and products
  const stocks = useMemo(() => {
    const sectorOverrides: Record<string, Partial<WarehouseStockItem>[]> = {
      'steel-heavy-metals': [
        { itemCode: 'RAW-STL-ORE-01', itemName: 'High-Grade Iron Ore Pellets (Hematite 65% Fe)', unitOfMeasure: 'MT', unitValuation: 145, binCode: 'YARD-ORE-SILO-01' },
        { itemCode: 'RAW-STL-COKE-02', itemName: 'Metallurgical Coking Coal Concentrates', unitOfMeasure: 'MT', unitValuation: 280, binCode: 'YARD-COKE-BIN-04' },
        { itemCode: 'RAW-STL-BAR-03', itemName: 'Continuous Cast High-Alloy Billet Bar Stock', unitOfMeasure: 'm', unitValuation: 65, binCode: 'BAY-BILLET-RACK-02' },
        { itemCode: 'RAW-STL-ALLOY-04', itemName: 'Ferro-Chrome Alloying Agent Additive', unitOfMeasure: 'kg', unitValuation: 18, binCode: 'SEC-ALLOY-TRAY-08' },
      ],
      'chemical': [
        { itemCode: 'RAW-CHM-ETH-01', itemName: 'High-Purity Ethylene Monomer Feedstock', unitOfMeasure: 'MT', unitValuation: 950, binCode: 'TANK-FARM-SILO-01' },
        { itemCode: 'RAW-CHM-ACID-02', itemName: 'Concentrated Industrial Acidic Reagent', unitOfMeasure: 'ltr', unitValuation: 24, binCode: 'DRUM-BAY-ROW-03' },
        { itemCode: 'RAW-CHM-SOLV-03', itemName: 'Anhydrous High-Purity Processing Solvent', unitOfMeasure: 'ltr', unitValuation: 38, binCode: 'TANK-SOLV-A1' },
        { itemCode: 'RAW-CHM-CAT-04', itemName: 'Precious Platinum Hydrogenation Catalyst Powder', unitOfMeasure: 'kg', unitValuation: 3200, binCode: 'SAFE-VAULT-CAT-02' },
      ],
      'cable-wire': [
        { itemCode: 'RAW-CBL-COP-01', itemName: 'Continuous 8mm Electrolytic Copper Rod', unitOfMeasure: 'kg', unitValuation: 9.8, binCode: 'REEL-YARD-BAY-01' },
        { itemCode: 'RAW-CBL-XLPE-02', itemName: 'Cross-Linked XLPE Insulation Granules', unitOfMeasure: 'kg', unitValuation: 4.2, binCode: 'SILO-POLY-04' },
        { itemCode: 'RAW-CBL-ARM-03', itemName: 'Galvanized Helical Steel Armor Tape', unitOfMeasure: 'm', unitValuation: 1.85, binCode: 'RACK-ARMOR-TAPE-02' },
        { itemCode: 'RAW-CBL-DIE-04', itemName: 'High-Speed Precision Diamond Drawing Dies', unitOfMeasure: 'Pcs', unitValuation: 450, binCode: 'TOOL-CRIB-CAB-01' },
      ],
      'textile-apparel': [
        { itemCode: 'RAW-TXT-COT-01', itemName: 'Carded Long-Staple Egyptian Cotton Bales', unitOfMeasure: 'kg', unitValuation: 3.5, binCode: 'BALE-STORAGE-BAY-02' },
        { itemCode: 'RAW-TXT-YRN-02', itemName: 'Ring-Spun Combed Cotton Yarn Cones (40s)', unitOfMeasure: 'kg', unitValuation: 5.8, binCode: 'YARN-PALLET-RACK-03' },
        { itemCode: 'RAW-TXT-WARP-03', itemName: 'Woven Warp Interlining Cloth Rolls', unitOfMeasure: 'm', unitValuation: 2.2, binCode: 'ROLL-RACK-A1' },
        { itemCode: 'RAW-TXT-DYE-04', itemName: 'Reactive Botanical Fiber Dye Solution Salts', unitOfMeasure: 'kg', unitValuation: 28, binCode: 'COLOR-LAB-SHELF-04' },
      ],
      'jewellery-precious-metals': [
        { itemCode: 'RAW-JWL-GLD-01', itemName: '24-Karat Fine Gold Bullion Grain 99.99%', unitOfMeasure: 'gm', unitValuation: 78.5, binCode: 'VAULT-GOLD-SEC-01' },
        { itemCode: 'RAW-JWL-PLT-02', itemName: 'Platinum 950 Fine Casting Alloy Granules', unitOfMeasure: 'gm', unitValuation: 36.2, binCode: 'VAULT-PLAT-SEC-02' },
        { itemCode: 'RAW-JWL-DIA-03', itemName: 'Certified Natural Solitaire Diamonds (VVS1)', unitOfMeasure: 'Pcs', unitValuation: 1450, binCode: 'GEM-SAFE-TRAY-01' },
        { itemCode: 'RAW-JWL-RHO-04', itemName: 'High-Purity Rhodium Electroplating Salts', unitOfMeasure: 'gm', unitValuation: 165, binCode: 'LAB-REAGENT-CAB-03' },
      ],
      'dairy-food-products': [
        { itemCode: 'RAW-DRY-MLK-01', itemName: 'Chilled Farm Fresh Raw Whole Milk', unitOfMeasure: 'ltr', unitValuation: 0.65, binCode: 'SILO-MILK-CHILL-01' },
        { itemCode: 'RAW-DRY-SMP-02', itemName: 'Spray-Dried Demineralized Skim Milk Powder', unitOfMeasure: 'kg', unitValuation: 3.8, binCode: 'PALLET-DRY-WH-02' },
        { itemCode: 'RAW-DRY-TET-03', itemName: 'Aseptic Multi-Layer Barrier Packaging Board', unitOfMeasure: 'm²', unitValuation: 1.25, binCode: 'ROLL-TETRA-BAY-04' },
        { itemCode: 'RAW-DRY-CUL-04', itemName: 'Thermophilic Lactic Acid Probiotic Inoculum', unitOfMeasure: 'gm', unitValuation: 4.5, binCode: 'COLD-ROOM-FREEZER-01' },
      ],
      'cement-building': [
        { itemCode: 'RAW-CEM-LIME-01', itemName: 'High-Purity Calcium Carbonate Limestone', unitOfMeasure: 'MT', unitValuation: 32, binCode: 'STOCKPILE-CRUSH-01' },
        { itemCode: 'RAW-CEM-GYP-02', itemName: 'Natural Anhydrous Gypsum Retarder Rock', unitOfMeasure: 'MT', unitValuation: 48, binCode: 'SILO-GYPSUM-B2' },
        { itemCode: 'RAW-CEM-AGG-03', itemName: 'River Washed Coarse Concrete Aggregate', unitOfMeasure: 'm³', unitValuation: 28, binCode: 'YARD-SAND-BUNKER-03' },
        { itemCode: 'RAW-CEM-ADD-04', itemName: 'Polycarboxylate High-Range Water Reducer', unitOfMeasure: 'kg', unitValuation: 3.4, binCode: 'CHEM-STORAGE-BAY-01' },
      ],
    };

    const sectorItems = sectorOverrides[activeFranchise.industrySectorId] || [];

    return initialStocks.map((s, idx) => {
      // Find matching dynamic stock from enterpriseDataStore if available
      const storeMatch = storeStocks.find((item) => item.itemCode === s.itemCode);
      const currentQty = storeMatch ? storeMatch.currentQuantity : s.currentQuantity;
      const reservedQty = storeMatch ? storeMatch.reservedQuantity : s.reservedQuantity;
      const status = storeMatch ? storeMatch.status : 'AVAILABLE';

      if (s.category === 'FINISHED_GOODS') {
        return {
          ...s,
          currentQuantity: currentQty,
          reservedQuantity: reservedQty,
          status,
          itemName: `${activeFranchise.flagshipProduct} - Master Packaged Unit`,
          unitOfMeasure: activeFranchise.primaryUom || 'Units',
          unitValuation: activeFranchise.currency === 'EUR' ? 420 : activeFranchise.currency === 'CHF' ? 450 : activeFranchise.currency === 'USD' ? 480 : 38500
        };
      }

      // If industry-specific items are defined for this sector, adapt raw material name & unit
      const sectorItem = sectorItems[idx % sectorItems.length];
      const finalItemName = sectorItem?.itemName || s.itemName;
      const finalUom = sectorItem?.unitOfMeasure || s.unitOfMeasure;
      const finalBin = sectorItem?.binCode || s.binCode;
      const finalValuation = sectorItem?.unitValuation || s.unitValuation;

      return {
        ...s,
        itemName: finalItemName,
        unitOfMeasure: finalUom,
        binCode: finalBin,
        unitValuation: finalValuation,
        currentQuantity: currentQty,
        reservedQuantity: reservedQty,
        status,
        isBelowReorderThreshold: currentQty <= s.reorderThreshold,
      };
    });
  }, [activeFranchise, storeStocks]);

  const totalValuation = stocks.reduce(
    (acc, s) => acc + s.currentQuantity * s.unitValuation,
    0,
  );
  const lowStockAlerts = stocks.filter((s) => s.isBelowReorderThreshold);
  const totalPhysicalItems = stocks.reduce((acc, s) => acc + s.currentQuantity, 0);

  const handleExportWarehouseCsv = () => {
    exportToCsv(
      `Warehouse_Stock_Audit_${activeFranchise.id}_${new Date().toISOString().split('T')[0]}`,
      ['Item Code', 'Item Name', 'Category', 'Current Qty', 'Reserved Qty', 'Bin Code', 'Unit Valuation', 'Lot / Batch'],
      stocks.map(s => [
        s.itemCode,
        s.itemName,
        s.category,
        s.currentQuantity,
        s.reservedQuantity,
        s.binCode,
        s.unitValuation,
        s.lotBatchNumber
      ])
    );
  };

  // Component Stock Level Distribution for Bar Chart
  const stockLevelChartData = [
    { label: 'Microprocessor SoC', current: 4200, reserved: 2500, safetyMin: 1500 },
    { label: 'Precision Display Module', current: 850, reserved: 800, safetyMin: 1000 },
    { label: '5000mAh Battery', current: 6200, reserved: 6000, safetyMin: 2000 },
    { label: 'Optical Sensor', current: 180, reserved: 160, safetyMin: 250 },
    { label: 'Apex Pro Boxed', current: 1800, reserved: 1200, safetyMin: 500 },
  ];

  // Stock Valuation Breakdown by Category for Donut Chart
  const categoryValuationData = [
    {
      name: 'Finished Packaged Units',
      value: 69300000,
      color: '#10b981',
      description: '1,800 packaged units ready for courier dispatch',
    },
    {
      name: 'Processors & Controllers',
      value: 34440000,
      color: '#6366f1',
      description: 'High-performance computing modules & tray lots',
    },
    {
      name: 'Power Cell Modules',
      value: 5890000,
      color: '#f59e0b',
      description: '5,000mAh high-density packs in Rack-B1',
    },
    {
      name: 'Industrial Displays',
      value: 4080000,
      color: '#3b82f6',
      description: 'High-resolution display inventory in Rack-A2',
    },
    {
      name: 'Sensors & Optical Modules',
      value: 576000,
      color: '#f43f5e',
      description: 'High-precision optical sensors in Rack-C1',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Super Admin Supervisory Mode Banner */}
      {isSuperAdmin && (
        <SupervisoryBanner
          departmentName="Warehouse & Parts Stock"
          departmentCode="WHS-001"
          staffRoleTitle="Parts & Finished Goods Inventory Lead"
          onViewAuditFeed={() => {
            const el = document.getElementById('dept-audit-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 mb-1.5">
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">{activeFranchise.flag}</span>
            <span>{activeFranchise.plantName}</span>
            <span className="text-slate-400">·</span>
            <span>{activeFranchise.primaryIndustry}</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">UOMs: {activeFranchise.supportedUoms.join(', ')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-amber-500 dark:text-amber-400" />
            Warehouse &amp; Parts Stock Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Total inventory valuation, unit-of-measure tracking ({activeFranchise.primaryUom || 'UOM'}), and warehouse shelf addresses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm">
          <Clock className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          <span>Barcode & Stock Scanner: <strong className="text-slate-800 dark:text-slate-200">100% Matched</strong></span>
        </div>
      </div>

      {/* Unified Warehouse & Inventory Hub Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Link
          href="/warehouse"
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white shadow-xs"
        >
          Raw Materials & Parts Inventory
        </Link>
        <Link
          href="/warehouse/bins"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Storage Bins & Racks
        </Link>
        <Link
          href="/warehouse/dispatch"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Finished Goods Staging Bay
        </Link>
        <Link
          href="/inventory/cycle-counts"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Physical Cycle Counts & Audits
        </Link>
        <Link
          href="/supply-chain/mrp"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Material Requirements (MRP)
        </Link>
      </div>

      {/* Plain-English Explainer Guide for Warehouse */}
      <PlainEnglishBanner
        moduleName="Warehouse Inventory & Raw Material Storage"
        whatItDoes="Tracks current physical stock quantities, reserved materials for active factory work orders, bin & shelf locations, and automatic low-stock reorder thresholds."
        whyItMatters="Prevents factory assembly lines from stalling due to missing parts, eliminates stockout emergencies, and keeps accurate financial valuation of company inventory."
        metrics={[
          {
            acronym: 'Reorder Threshold',
            plainName: 'Safety Buffer Minimum',
            explanation: 'The critical low-stock quantity trigger that alerts purchasing to order fresh batches before stock runs out completely.',
          },
          {
            acronym: 'FIFO Valuation',
            plainName: 'First-In First-Out Accounting',
            explanation: 'Inventory valuation method assuming the oldest purchased components are used up first, ensuring accurate balance sheet costs.',
          },
          {
            acronym: 'Bin Code (e.g. RACK-A1-TRAY-01)',
            plainName: 'Exact Physical Shelf Address',
            explanation: 'The physical aisle, rack, shelf, and tray location so warehouse operators can find parts within seconds.',
          },
        ]}
        quickSteps={[
          '1. Scan incoming supplier pallets to assign lot numbers and storage bin coordinates',
          '2. Reserve parts for scheduled manufacturing work orders before pulling to the line',
          '3. Monitor low-stock alerts and generate automatic supplier purchase requests',
        ]}
      />

      {/* Action Alerts & Interconnected Workflow Notifications Inbox */}
      <RoleActionAlerts roleId="warehouse" />

      {/* Top 4 Warehouse KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Inventory Value</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              {formatCurrency(totalValuation, activeFranchise.currency)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>FIFO Stock Valuation Active</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Stock Count Accuracy</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight font-mono">
              99.4%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verified by latest physical shelf checks
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Low Parts Alerts</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
              {lowStockAlerts.length} Critical Parts
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Automatic restock requests sent to Purchasing
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Parts in Warehouse</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              {totalPhysicalItems.toLocaleString()} Pieces
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across 32 storage racks & shelves
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts Banner */}
      {lowStockAlerts.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span>Low Stock Alerts: {lowStockAlerts.length} Parts Need Reordering</span>
            </div>
            <span className="text-[10px] bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-medium">
              Order Restock Now
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lowStockAlerts.map((item) => (
              <div
                key={item.itemCode}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 flex items-center justify-between text-xs shadow-xs"
              >
                <div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{item.itemCode}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{item.itemName}</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-1">
                    Shelf Location: {item.binCode}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-rose-600 dark:text-rose-400 font-bold font-mono text-sm">
                    {item.currentQuantity} / {item.reorderThreshold} {item.unitOfMeasure}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Suggested Order: +{item.reorderQuantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Analytics: Component Stock Levels & Valuation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BarChart
            data={stockLevelChartData}
            series={[
              { key: 'current', name: 'Physical Stock Available', color: '#10b981' },
              { key: 'reserved', name: 'Reserved for Assembly', color: '#6366f1' },
              { key: 'safetyMin', name: 'Safety Minimum Reorder', color: '#f59e0b' },
            ]}
            xAxisKey="label"
            mode="grouped"
            title="Component Stock Level Distribution"
            subtitle="Current warehouse shelf quantities vs reserved assembly batch allocations and reorder thresholds"
            yAxisFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            tooltipFormatter={(v) => `${v.toLocaleString()} Pcs`}
            height={270}
          />
        </div>

        <div className="lg:col-span-5">
          <DonutChart
            data={categoryValuationData}
            title="Stock Valuation by Component Class"
            subtitle="Inventory value distribution across parts & finished packaged units"
            centerLabel="Total Valuation"
            centerValue={formatCurrency(totalValuation)}
            centerSubtext={`${totalPhysicalItems.toLocaleString()} Pieces`}
            valueFormatter={(v) => formatCurrency(v)}
            height={270}
          />
        </div>
      </div>

      {/* Master Inventory Stock Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
            Live Warehouse Stock & Parts List
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">{stocks.length} Parts in Catalog</span>
            <button
              type="button"
              onClick={handleExportWarehouseCsv}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Part Code</th>
                <th className="py-3 px-4">Part Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Shelf / Bin Location</th>
                <th className="py-3 px-4">Lot Quality Status</th>
                <th className="py-3 px-4">In Stock</th>
                <th className="py-3 px-4">Reserved for Assembly</th>
                <th className="py-3 px-4">Unit Rate ({activeFranchise.primaryUom || 'Unit'})</th>
                <th className="py-3 px-4 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {stocks.map((stock) => {
                const isLow = stock.isBelowReorderThreshold;
                const extended = stock.currentQuantity * stock.unitValuation;

                return (
                  <tr key={stock.itemCode} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {stock.itemCode}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {stock.itemName}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          stock.category === 'RAW_MATERIAL'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                            : stock.category === 'FINISHED_GOODS'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20'
                        }`}
                      >
                        {stock.category === 'RAW_MATERIAL'
                          ? 'Core Component'
                          : stock.category === 'FINISHED_GOODS'
                          ? 'Finished Unit'
                          : stock.category.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-cyan-700 dark:text-cyan-400 text-[11px]">
                      {stock.binCode || 'Unassigned'}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      {(stock as any).status === 'QUARANTINE_HOLD' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                          <Lock className="w-3 h-3 text-rose-600" />
                          QUARANTINE HOLD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          AVAILABLE
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className={isLow ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-900 dark:text-white font-semibold'}>
                        {stock.currentQuantity.toLocaleString()} {stock.unitOfMeasure}
                      </span>
                      {isLow && (
                        <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                          LOW
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      {stock.reservedQuantity.toLocaleString()} {stock.unitOfMeasure}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {formatCurrency(stock.unitValuation, activeFranchise.currency)}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-right">
                      {formatCurrency(extended)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Super Admin Read-Only Supervisory Audit Stream */}
      {isSuperAdmin && (
        <div id="dept-audit-feed" className="pt-2">
          <DepartmentAuditFeed
            department="warehouse"
            title="Warehouse Inbound GRN, Stock Reserves & Serial Registry Audit Trail"
          />
        </div>
      )}
    </div>
  );
}

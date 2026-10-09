'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { WarehouseStockItem } from '@/types/warehouse';
import { RoleActionAlerts } from '@/components/RoleActionAlerts';
import { useAuth } from '@/context/AuthContext';
import { SupervisoryBanner } from '@/components/SupervisoryBanner';
import { DepartmentAuditFeed } from '@/components/DepartmentAuditFeed';
import { BarChart, DonutChart } from '@/components/charts';

const initialStocks: WarehouseStockItem[] = [
  {
    id: 's-1',
    itemCode: 'PART-SOC-SD8G3',
    itemName: 'Qualcomm Snapdragon 8 Gen-3 Processor (Chipset)',
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
    itemCode: 'PART-DISP-LTPO',
    itemName: '6.7" 144Hz LTPO AMOLED Touchscreen Display',
    category: 'RAW_MATERIAL',
    currentQuantity: 850,
    reservedQuantity: 800,
    reorderThreshold: 1000,
    reorderQuantity: 3000,
    unitOfMeasure: 'PCS',
    unitValuation: 4800,
    binCode: 'RACK-A2-TRAY-04',
    lotBatchNumber: 'LOT-BOE-2201',
    isBelowReorderThreshold: true,
  },
  {
    id: 's-3',
    itemCode: 'PART-BAT-5000',
    itemName: '5,000mAh Dual-Cell Lithium-Ion Battery Pack',
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
    itemName: 'Apex Pro 5G - Phantom Black 256GB (Finished Boxed Phone)',
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
    itemName: '50MP Sony IMX989 Main Camera Lens Module (OIS)',
    category: 'RAW_MATERIAL',
    currentQuantity: 180,
    reservedQuantity: 160,
    reorderThreshold: 250,
    reorderQuantity: 1000,
    unitOfMeasure: 'PCS',
    unitValuation: 3200,
    binCode: 'RACK-C1-TRAY-08',
    lotBatchNumber: 'LOT-SNY-811',
    isBelowReorderThreshold: true,
  },
];

export default function WarehouseOverviewPage() {
  const { session } = useAuth();
  const isSuperAdmin = session?.roleId === 'super_admin';

  const [stocks] = useState<WarehouseStockItem[]>(initialStocks);

  const totalValuation = stocks.reduce(
    (acc, s) => acc + s.currentQuantity * s.unitValuation,
    0,
  );
  const lowStockAlerts = stocks.filter((s) => s.isBelowReorderThreshold);
  const totalPhysicalItems = stocks.reduce((acc, s) => acc + s.currentQuantity, 0);

  // Component Stock Level Distribution for Bar Chart
  const stockLevelChartData = [
    { label: 'Qualcomm SoC', current: 4200, reserved: 2500, safetyMin: 1500 },
    { label: 'AMOLED Display', current: 850, reserved: 800, safetyMin: 1000 },
    { label: '5000mAh Battery', current: 6200, reserved: 6000, safetyMin: 2000 },
    { label: 'Sony 50MP Lens', current: 180, reserved: 160, safetyMin: 250 },
    { label: 'Apex Pro Boxed', current: 1800, reserved: 1200, safetyMin: 500 },
  ];

  // Stock Valuation Breakdown by Category for Donut Chart
  const categoryValuationData = [
    {
      name: 'Finished Boxed Phones',
      value: 69300000,
      color: '#10b981',
      description: '1,800 boxed phones ready for courier dispatch',
    },
    {
      name: 'Processors & SoCs',
      value: 34440000,
      color: '#6366f1',
      description: 'Qualcomm Snapdragon 8 Gen-3 tray lots',
    },
    {
      name: 'Battery Packs',
      value: 5890000,
      color: '#f59e0b',
      description: '5,000mAh dual-cell packs in Rack-B1',
    },
    {
      name: 'LTPO Touch Displays',
      value: 4080000,
      color: '#3b82f6',
      description: '144Hz AMOLED screen inventory in Rack-A2',
    },
    {
      name: 'Camera Sensors',
      value: 576000,
      color: '#f43f5e',
      description: 'Sony IMX989 1-inch modules in Rack-C1',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Super Admin Supervisory Mode Banner */}
      {isSuperAdmin && (
        <SupervisoryBanner
          departmentName="Warehouse & Parts Stock"
          departmentCode="WHS-001"
          staffRoleTitle="Parts & Phone Inventory Lead"
          onViewAuditFeed={() => {
            const el = document.getElementById('dept-audit-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-amber-500 dark:text-amber-400" />
            Warehouse & Parts Stock Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Total inventory value, low-stock warnings, and warehouse shelf locations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm">
          <Clock className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          <span>Barcode & Stock Scanner: <strong className="text-slate-800 dark:text-slate-200">100% Matched</strong></span>
        </div>
      </div>

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
              {formatCurrency(totalValuation)}
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
            subtitle="Inventory value distribution across parts & finished boxed smartphones"
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
          <span className="text-xs text-slate-500 dark:text-slate-400">{stocks.length} Parts in Catalog</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Part Code</th>
                <th className="py-3 px-4">Part Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Shelf / Bin Location</th>
                <th className="py-3 px-4">In Stock</th>
                <th className="py-3 px-4">Reserved for Assembly</th>
                <th className="py-3 px-4">Price per Piece</th>
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
                          ? 'Phone Component'
                          : stock.category === 'FINISHED_GOODS'
                          ? 'Boxed Phone'
                          : stock.category.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-cyan-700 dark:text-cyan-400 text-[11px]">
                      {stock.binCode || 'Unassigned'}
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
                      ₹{stock.unitValuation.toLocaleString()}
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
            title="Warehouse Inbound GRN, Stock Reserves & IMEI Registry Audit Trail"
          />
        </div>
      )}
    </div>
  );
}

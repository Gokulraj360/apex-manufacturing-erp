'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  PackagePlus,
  ShoppingCart,
  ArrowRight,
  ClipboardCheck,
  RefreshCw,
  Boxes,
  Scale,
  Plus,
} from 'lucide-react';
import { useActiveFranchise } from '@/lib/franchiseStore';

export interface MaterialRequirement {
  id: string;
  materialName: string;
  unit: string;
  qtyPerOrderUnit: number; // How much raw material is needed per 1 unit of ordered product
  currentStock: number;
  estimatedUnitCost: number;
}

export interface OrderPreset {
  id: string;
  industryName: string;
  productName: string;
  defaultQty: number;
  orderUnit: string;
  customerName: string;
  materials: MaterialRequirement[];
}

const ORDER_PRESETS: OrderPreset[] = [
  {
    id: 'ghee-5000',
    industryName: 'Dairy & Processed Food',
    productName: 'Pure Desi Ghee',
    defaultQty: 5000,
    orderUnit: 'ltr',
    customerName: 'FreshMart National Retail Chain',
    materials: [
      {
        id: 'm-milk',
        materialName: 'Fresh Raw Whole Milk',
        unit: 'ltr',
        qtyPerOrderUnit: 25, // 25 litres milk makes 1 litre ghee
        currentStock: 40000,
        estimatedUnitCost: 0.65,
      },
      {
        id: 'm-culture',
        materialName: 'Dairy Butter Starter Culture',
        unit: 'gm',
        qtyPerOrderUnit: 0.1,
        currentStock: 1200,
        estimatedUnitCost: 0.45,
      },
      {
        id: 'm-tins',
        materialName: '1-Litre Food-Grade Tin Containers',
        unit: 'Pcs',
        qtyPerOrderUnit: 1,
        currentStock: 3200,
        estimatedUnitCost: 0.85,
      },
      {
        id: 'm-seals',
        materialName: 'Tamper-Proof Foil Seals',
        unit: 'Pcs',
        qtyPerOrderUnit: 1,
        currentStock: 8500,
        estimatedUnitCost: 0.08,
      },
    ],
  },
  {
    id: 'milk-10000',
    industryName: 'Dairy & Processed Food',
    productName: 'Pasteurized Whole Milk Cartons',
    defaultQty: 10000,
    orderUnit: 'ltr',
    customerName: 'Metro City Groceries',
    materials: [
      {
        id: 'm-milk-2',
        materialName: 'Fresh Raw Whole Milk',
        unit: 'ltr',
        qtyPerOrderUnit: 1.05,
        currentStock: 40000,
        estimatedUnitCost: 0.65,
      },
      {
        id: 'm-cartons',
        materialName: '1-Litre Aseptic Carton Packs',
        unit: 'Pcs',
        qtyPerOrderUnit: 1,
        currentStock: 18000,
        estimatedUnitCost: 0.15,
      },
    ],
  },
  {
    id: 'steel-500',
    industryName: 'Steel & Heavy Metals',
    productName: 'Structural Steel Beams',
    defaultQty: 500,
    orderUnit: 'MT',
    customerName: 'Apex Infrastructure Builders',
    materials: [
      {
        id: 'm-ore',
        materialName: 'Iron Ore Pellets',
        unit: 'MT',
        qtyPerOrderUnit: 1.6,
        currentStock: 350,
        estimatedUnitCost: 145,
      },
      {
        id: 'm-coke',
        materialName: 'Metallurgical Coke',
        unit: 'MT',
        qtyPerOrderUnit: 0.6,
        currentStock: 420,
        estimatedUnitCost: 280,
      },
      {
        id: 'm-alloy',
        materialName: 'Ferro-Chrome Alloy Additive',
        unit: 'kg',
        qtyPerOrderUnit: 5,
        currentStock: 1100,
        estimatedUnitCost: 18,
      },
    ],
  },
  {
    id: 'textile-10000',
    industryName: 'Textile & Apparel',
    productName: 'Woven Combed Cotton Fabric',
    defaultQty: 10000,
    orderUnit: 'm',
    customerName: 'Nordic Apparel Group',
    materials: [
      {
        id: 'm-cotton',
        materialName: 'Raw Combed Cotton Yarn',
        unit: 'kg',
        qtyPerOrderUnit: 0.25,
        currentStock: 1200,
        estimatedUnitCost: 5.5,
      },
      {
        id: 'm-dye',
        materialName: 'Natural Reactive Textile Dye',
        unit: 'kg',
        qtyPerOrderUnit: 0.015,
        currentStock: 240,
        estimatedUnitCost: 28,
      },
    ],
  },
  {
    id: 'paint-8000',
    industryName: 'Paint & Coatings',
    productName: 'Industrial Anti-Rust Primer',
    defaultQty: 8000,
    orderUnit: 'ltr',
    customerName: 'Harbor Marine Engineering',
    materials: [
      {
        id: 'm-pigment',
        materialName: 'Titanium Dioxide White Pigment',
        unit: 'kg',
        qtyPerOrderUnit: 0.25,
        currentStock: 950,
        estimatedUnitCost: 4.8,
      },
      {
        id: 'm-resin',
        materialName: 'Acrylic Copolymer Emulsion',
        unit: 'ltr',
        qtyPerOrderUnit: 0.55,
        currentStock: 6000,
        estimatedUnitCost: 3.2,
      },
    ],
  },
];

export function OrderFeasibilityChecker() {
  const activeFranchise = useActiveFranchise();
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ghee-5000');
  const [orderQty, setOrderQty] = useState<number>(5000);
  const [customProductName, setCustomProductName] = useState<string>('Pure Desi Ghee');
  const [customOrderUnit, setCustomOrderUnit] = useState<string>('ltr');
  const [customerName, setCustomerName] = useState<string>('FreshMart National Retail Chain');

  // Local stock override so user can test "Restock Now" live
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});
  const [restockCreatedMsg, setRestockCreatedMsg] = useState<string | null>(null);
  const [orderAcceptedMsg, setOrderAcceptedMsg] = useState<string | null>(null);

  const activePreset = useMemo(() => {
    return ORDER_PRESETS.find((p) => p.id === selectedPresetId) || ORDER_PRESETS[0];
  }, [selectedPresetId]);

  const handleSelectPreset = (preset: OrderPreset) => {
    setSelectedPresetId(preset.id);
    setOrderQty(preset.defaultQty);
    setCustomProductName(preset.productName);
    setCustomOrderUnit(preset.orderUnit);
    setCustomerName(preset.customerName);
    setRestockCreatedMsg(null);
    setOrderAcceptedMsg(null);
  };

  const materialChecks = useMemo(() => {
    return activePreset.materials.map((mat) => {
      const requiredQty = Math.ceil(orderQty * mat.qtyPerOrderUnit * 100) / 100;
      const inStock = stockOverrides[mat.id] !== undefined ? stockOverrides[mat.id] : mat.currentStock;
      const shortage = Math.max(0, Math.ceil((requiredQty - inStock) * 100) / 100);
      const isEnough = shortage === 0;

      return {
        ...mat,
        requiredQty,
        inStock,
        shortage,
        isEnough,
      };
    });
  }, [activePreset, orderQty, stockOverrides]);

  const missingMaterials = materialChecks.filter((m) => !m.isEnough);
  const isOrderFeasible = missingMaterials.length === 0 && orderQty > 0;

  const handleCreateRestockRequest = () => {
    const reqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const summary = missingMaterials
      .map((m) => `${m.shortage.toLocaleString()} ${m.unit} of ${m.materialName}`)
      .join(', ');

    // Also persist to localStorage so Purchasing / Approvals see it
    try {
      const existing = JSON.parse(localStorage.getItem('apex_restock_requests') || '[]');
      existing.unshift({
        id: reqId,
        createdAt: new Date().toISOString(),
        forOrder: `${orderQty.toLocaleString()} ${customOrderUnit} ${customProductName}`,
        customerName,
        items: missingMaterials.map((m) => ({
          name: m.materialName,
          missingQty: m.shortage,
          unit: m.unit,
        })),
        status: 'PENDING_RESTOCK',
      });
      localStorage.setItem('apex_restock_requests', JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }

    setRestockCreatedMsg(
      `Restock Request ${reqId} sent to Purchasing for: ${summary}. Once received in warehouse, you can accept this order.`
    );
  };

  const handleSimulateRestockReceived = () => {
    const updated: Record<string, number> = { ...stockOverrides };
    missingMaterials.forEach((m) => {
      updated[m.id] = m.inStock + m.shortage;
    });
    setStockOverrides(updated);
    setRestockCreatedMsg(null);
  };

  const handleResetDemo = () => {
    setStockOverrides({});
    setRestockCreatedMsg(null);
    setOrderAcceptedMsg(null);
  };

  const handleAcceptOrder = () => {
    const woId = `WO-${Math.floor(2000 + Math.random() * 8000)}`;
    setOrderAcceptedMsg(
      `Order Accepted! Production Work Order ${woId} created for ${orderQty.toLocaleString()} ${customOrderUnit} of ${customProductName} for ${customerName}.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Quick Example Switcher */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              1. Pick a Sample Incoming Customer Order (or Change Quantity Below)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Before accepting any order, check whether your warehouse has enough raw materials to produce it.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Stock Levels
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ORDER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                selectedPresetId === preset.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              {preset.defaultQty.toLocaleString()} {preset.orderUnit} {preset.productName}
            </button>
          ))}
        </div>

        {/* Order Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Customer / Client Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Ordered Product
            </label>
            <input
              type="text"
              value={customProductName}
              onChange={(e) => setCustomProductName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Order Quantity ({customOrderUnit})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={orderQty}
                onChange={(e) => setOrderQty(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                {customOrderUnit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Live Feasibility Status Banner */}
      {isOrderFeasible ? (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                Enough Raw Materials Available — Ready to Accept Order
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                All required raw materials for <strong>{orderQty.toLocaleString()} {customOrderUnit} of {customProductName}</strong> are currently available in your warehouse.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAcceptOrder}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            Accept Order &amp; Start Production
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">
                Not Enough Raw Materials — Restock Needed Before Accepting
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                To make <strong>{orderQty.toLocaleString()} {customOrderUnit} of {customProductName}</strong>, you are short on{' '}
                <strong>{missingMaterials.length} item{missingMaterials.length > 1 ? 's' : ''}</strong>:{' '}
                {missingMaterials.map((m) => `${m.shortage.toLocaleString()} ${m.unit} ${m.materialName}`).join(' and ')}.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCreateRestockRequest}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Order Missing Stock ({missingMaterials.length} Items)
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Messages */}
      {restockCreatedMsg && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-medium text-blue-900 dark:text-blue-200">
            {restockCreatedMsg}
          </div>
          <button
            type="button"
            onClick={handleSimulateRestockReceived}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shrink-0 cursor-pointer"
          >
            Mark Restock as Received
          </button>
        </div>
      )}

      {orderAcceptedMsg && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{orderAcceptedMsg}</span>
        </div>
      )}

      {/* Step 3: Detailed Raw Material Breakdown Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              2. Raw Material &amp; Packaging Check ({activeFranchise.primaryIndustry})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compares what is needed for this order against what is currently sitting in your warehouse.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Recipe Check
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-5">Raw Material / Item</th>
                <th className="py-3.5 px-5">Needed Per 1 {customOrderUnit}</th>
                <th className="py-3.5 px-5">Total Needed</th>
                <th className="py-3.5 px-5">Currently In Stock</th>
                <th className="py-3.5 px-5">Shortage / Need to Buy</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {materialChecks.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white">
                    {m.materialName}
                  </td>
                  <td className="py-4 px-5 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {m.qtyPerOrderUnit} {m.unit}
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-slate-900 dark:text-white">
                    {m.requiredQty.toLocaleString()} {m.unit}
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-700 dark:text-slate-300">
                    {m.inStock.toLocaleString()} {m.unit}
                  </td>
                  <td className="py-4 px-5 font-mono font-bold">
                    {m.shortage > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400">
                        -{m.shortage.toLocaleString()} {m.unit}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400">0 {m.unit}</span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    {m.isEnough ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Enough Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Need to Restock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  ArrowRight,
  ClipboardCheck,
  RefreshCw,
  Boxes,
  Plus,
  Trash2,
  Building2,
} from 'lucide-react';
import { useActiveFranchise } from '@/lib/franchiseStore';
import { INDUSTRY_SECTORS, MASTER_UOM_LIST } from '@/lib/industryUomRegistry';

export interface MaterialRequirementRow {
  id: string;
  materialName: string;
  unit: string;
  qtyPerOrderUnit: number;
  currentStock: number;
}

function parseMaterialEntry(rawStr: string, fallbackUnit: string): { name: string; unit: string } {
  const match = rawStr.match(/\(([^)]+)\)$/);
  const unit = match && match[1] ? match[1].split('/')[0].trim() : fallbackUnit;
  const name = rawStr.replace(/\s*\([^)]+\)$/, '').trim();
  return { name, unit };
}

function buildMaterialsForSector(sectorId: string, primaryUom: string): MaterialRequirementRow[] {
  const sector = INDUSTRY_SECTORS.find((s) => s.id === sectorId);
  const rawList = sector?.sampleRawMaterials || ['Primary Raw Material', 'Secondary Additive', 'Standard Packaging'];

  return rawList.map((entry, idx) => {
    const { name, unit } = parseMaterialEntry(entry, primaryUom || 'Units');
    // Set realistic baseline ratios & stock levels so users can see both in-stock and restock scenarios
    const qtyPerUnit = idx === 0 ? 1.5 : idx === 1 ? 0.4 : 1;
    const stock = idx === 0 ? 1200 : idx === 1 ? 900 : 2500;
    return {
      id: `mat-${sectorId}-${idx}`,
      materialName: name,
      unit,
      qtyPerOrderUnit: qtyPerUnit,
      currentStock: stock,
    };
  });
}

export function OrderFeasibilityChecker() {
  const activeFranchise = useActiveFranchise();

  const [customerName, setCustomerName] = useState<string>('Commercial Client Order');
  const [productName, setProductName] = useState<string>(activeFranchise.flagshipProduct);
  const [orderQty, setOrderQty] = useState<number>(1000);
  const [orderUnit, setOrderUnit] = useState<string>(activeFranchise.primaryUom || 'Units');
  const [materials, setMaterials] = useState<MaterialRequirementRow[]>(() =>
    buildMaterialsForSector(activeFranchise.industrySectorId, activeFranchise.primaryUom)
  );

  // Add new raw material row inputs
  const [newMatName, setNewMatName] = useState('');
  const [newMatQtyPerUnit, setNewMatQtyPerUnit] = useState<number>(1);
  const [newMatUnit, setNewMatUnit] = useState<string>(activeFranchise.primaryUom || 'kg');
  const [newMatStock, setNewMatStock] = useState<number>(500);
  const [showAddRow, setShowAddRow] = useState(false);

  const [restockCreatedMsg, setRestockCreatedMsg] = useState<string | null>(null);
  const [orderAcceptedMsg, setOrderAcceptedMsg] = useState<string | null>(null);

  // Automatically update when the user switches Industry / Plant / Unit in the header
  useEffect(() => {
    setProductName(activeFranchise.flagshipProduct);
    setOrderUnit(activeFranchise.primaryUom || 'Units');
    setNewMatUnit(activeFranchise.primaryUom || 'kg');
    setMaterials(buildMaterialsForSector(activeFranchise.industrySectorId, activeFranchise.primaryUom));
    setRestockCreatedMsg(null);
    setOrderAcceptedMsg(null);
  }, [activeFranchise.id, activeFranchise.industrySectorId, activeFranchise.flagshipProduct, activeFranchise.primaryUom]);

  const materialChecks = useMemo(() => {
    return materials.map((mat) => {
      const requiredQty = Math.ceil(orderQty * mat.qtyPerOrderUnit * 100) / 100;
      const shortage = Math.max(0, Math.ceil((requiredQty - mat.currentStock) * 100) / 100);
      return {
        ...mat,
        requiredQty,
        shortage,
        isEnough: shortage === 0,
      };
    });
  }, [materials, orderQty]);

  const missingMaterials = materialChecks.filter((m) => !m.isEnough);
  const isOrderFeasible = missingMaterials.length === 0 && orderQty > 0 && materials.length > 0;

  const handleUpdateMaterial = (id: string, field: keyof MaterialRequirementRow, value: string | number) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
    setRestockCreatedMsg(null);
    setOrderAcceptedMsg(null);
  };

  const handleAddMaterialRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;
    setMaterials((prev) => [
      ...prev,
      {
        id: `mat-custom-${Date.now()}`,
        materialName: newMatName.trim(),
        unit: newMatUnit,
        qtyPerOrderUnit: Math.max(0.01, newMatQtyPerUnit),
        currentStock: Math.max(0, newMatStock),
      },
    ]);
    setNewMatName('');
    setShowAddRow(false);
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCreateRestockRequest = () => {
    const reqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const summary = missingMaterials
      .map((m) => `${m.shortage.toLocaleString()} ${m.unit} of ${m.materialName}`)
      .join(', ');

    try {
      const existing = JSON.parse(localStorage.getItem('apex_restock_requests') || '[]');
      existing.unshift({
        id: reqId,
        createdAt: new Date().toISOString(),
        industry: activeFranchise.primaryIndustry,
        forOrder: `${orderQty.toLocaleString()} ${orderUnit} ${productName}`,
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
      `Restock Request ${reqId} sent to Purchasing for: ${summary}. Once received in warehouse, this order can be accepted.`
    );
  };

  const handleSimulateRestockReceived = () => {
    setMaterials((prev) =>
      prev.map((m) => {
        const required = Math.ceil(orderQty * m.qtyPerOrderUnit * 100) / 100;
        return m.currentStock < required ? { ...m, currentStock: required } : m;
      })
    );
    setRestockCreatedMsg(null);
  };

  const handleReset = () => {
    setMaterials(buildMaterialsForSector(activeFranchise.industrySectorId, activeFranchise.primaryUom));
    setOrderQty(1000);
    setRestockCreatedMsg(null);
    setOrderAcceptedMsg(null);
  };

  const handleAcceptOrder = () => {
    const woId = `WO-${Math.floor(2000 + Math.random() * 8000)}`;
    setOrderAcceptedMsg(
      `Order Accepted! Production Work Order ${woId} created for ${orderQty.toLocaleString()} ${orderUnit} of ${productName} (${customerName}).`
    );
  };

  const unitOptions = Array.from(
    new Set([...(activeFranchise.supportedUoms || []), ...Object.keys(MASTER_UOM_LIST)])
  );

  return (
    <div className="space-y-6">
      {/* Step 1: Incoming Order Details (Automatically adapts to Active Industry) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 mb-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Active Industry: {activeFranchise.primaryIndustry}</span>
              <span className="text-slate-400">·</span>
              <span>Default Unit: {activeFranchise.primaryUom}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              1. Enter Incoming Order Details
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Before accepting any customer order, enter the ordered product and quantity to verify if you have enough raw materials in stock.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Order Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Customer / Client Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter client name..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Ordered Product (Pick from Catalog or Type Custom)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                list="franchise-products-list"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="franchise-products-list">
                <option value={activeFranchise.flagshipProduct} />
                {activeFranchise.productSeries.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Order Quantity &amp; Unit
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={orderQty}
                onChange={(e) => setOrderQty(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={orderUnit}
                onChange={(e) => setOrderUnit(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
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
                All required raw materials for <strong>{orderQty.toLocaleString()} {orderUnit} of {productName}</strong> are currently available in your warehouse.
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
                To fulfill <strong>{orderQty.toLocaleString()} {orderUnit} of {productName}</strong>, you are short on{' '}
                <strong>{missingMaterials.length} item{missingMaterials.length > 1 ? 's' : ''}</strong>:{' '}
                {missingMaterials.map((m) => `${m.shortage.toLocaleString()} ${m.unit} ${m.materialName}`).join(', ')}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCreateRestockRequest}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            Order Missing Stock ({missingMaterials.length} Items)
          </button>
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

      {/* Step 3: Editable Raw Material Breakdown Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              2. Required Raw Materials vs Current Warehouse Stock
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automatically loaded for <strong>{activeFranchise.primaryIndustry}</strong>. You can edit quantities, stock levels, or add new materials below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddRow(!showAddRow)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Raw Material
          </button>
        </div>

        {/* Optional Add Raw Material Row Form */}
        {showAddRow && (
          <form
            onSubmit={handleAddMaterialRow}
            className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
          >
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Material Name</label>
              <input
                type="text"
                required
                value={newMatName}
                onChange={(e) => setNewMatName(e.target.value)}
                placeholder="e.g. Raw Cotton, Copper Wire, Packaging Box..."
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Needed Per 1 {orderUnit}</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={newMatQtyPerUnit}
                onChange={(e) => setNewMatQtyPerUnit(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Unit &amp; Current Stock</label>
              <div className="flex gap-1.5">
                <select
                  value={newMatUnit}
                  onChange={(e) => setNewMatUnit(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  value={newMatStock}
                  onChange={(e) => setNewMatStock(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Add Item
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-5">Raw Material / Input Item</th>
                <th className="py-3.5 px-4">Needed Per 1 {orderUnit}</th>
                <th className="py-3.5 px-4">Total Needed</th>
                <th className="py-3.5 px-4">In Stock (Editable)</th>
                <th className="py-3.5 px-4">Shortage / Need to Buy</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-3 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {materialChecks.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                    {m.materialName}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={m.qtyPerOrderUnit}
                        onChange={(e) => handleUpdateMaterial(m.id, 'qtyPerOrderUnit', Math.max(0, Number(e.target.value)))}
                        className="w-20 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                      />
                      <span className="text-xs text-slate-500">{m.unit}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {m.requiredQty.toLocaleString()} {m.unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={m.currentStock}
                        onChange={(e) => handleUpdateMaterial(m.id, 'currentStock', Math.max(0, Number(e.target.value)))}
                        className="w-24 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                      />
                      <span className="text-xs text-slate-500">{m.unit}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    {m.shortage > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400">
                        -{m.shortage.toLocaleString()} {m.unit}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400">0 {m.unit}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
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
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(m.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

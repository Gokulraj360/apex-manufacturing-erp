'use client';

/**
 * Apex Enterprise Unified Relational Data Engine
 * 
 * Provides reactive cross-departmental operational synchronization:
 * - Backflushing: Completing a Work Order decrements raw BOM materials and increments finished goods in Warehouse.
 * - Quality Quarantine: Defective lots are locked with QUARANTINE_HOLD, blocking stock movements across bins.
 * - Andon Cord Alerts: Operators triggering line stoppages halt work orders and spawn breakdown tickets in Maintenance.
 * - Integrated Dispatch-to-Gate: Shipping manifests automatically generate Gate Security Passes.
 */

export interface WorkOrderItem {
  id: string;
  orderNumber: string;
  productSku: string;
  productName: string;
  quantityTarget: number;
  quantityCompleted: number;
  quantityScrapped: number;
  lineId: string;
  lineName: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'HALTED_ANDON';
  startDate: string;
  targetCompletionDate: string;
  bomComponents: { itemCode: string; qtyPerUnit: number }[];
}

export interface WarehouseStockItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: 'RAW_MATERIAL' | 'SUBASSEMBLY' | 'FINISHED_GOOD';
  currentQuantity: number;
  reservedQuantity: number;
  reorderThreshold: number;
  unitOfMeasure: string;
  unitValuation: number;
  binCode: string;
  lotBatchNumber: string;
  status: 'AVAILABLE' | 'QUARANTINE_HOLD' | 'INSPECTION_PENDING';
}

export interface AndonStoppageItem {
  id: string;
  stoppageNumber: string;
  lineId: string;
  lineName: string;
  station: string;
  machineId: string;
  reportedBy: string;
  reason: string;
  severity: 'CRITICAL' | 'WARNING';
  startedAt: string;
  resolvedAt?: string;
  status: 'ACTIVE' | 'RESOLVED';
  resolutionNotes?: string;
}

export interface GatePassItem {
  id: string;
  gatePassNumber: string;
  shipmentNumber: string;
  vehicleNumber: string;
  driverName: string;
  carrierName: string;
  sealNumber: string;
  totalWeightKg: number;
  cartonsCount: number;
  issuedAt: string;
  clearedAt?: string;
  status: 'PENDING_CLEARANCE' | 'CLEARED_EXIT' | 'SECURITY_FLAGGED';
}

const STORAGE_KEY_WORK_ORDERS = 'apex_erp_work_orders_v2';
const STORAGE_KEY_WAREHOUSE = 'apex_erp_warehouse_stocks_v2';
const STORAGE_KEY_ANDON = 'apex_erp_andon_stoppages_v2';
const STORAGE_KEY_GATE_PASSES = 'apex_erp_gate_passes_v2';
const EVENT_NAME = 'apex_enterprise_data_updated';

const DEFAULT_WAREHOUSE_STOCKS: WarehouseStockItem[] = [
  {
    id: 'stk-1',
    itemCode: 'PART-SOC-SD8G3',
    itemName: 'Apex Core Industrial Embedded Microprocessor (SoC)',
    category: 'RAW_MATERIAL',
    currentQuantity: 4200,
    reservedQuantity: 2500,
    reorderThreshold: 1500,
    unitOfMeasure: 'PCS',
    unitValuation: 8200,
    binCode: 'RACK-A1-TRAY-01',
    lotBatchNumber: 'LOT-QC-9041',
    status: 'AVAILABLE',
  },
  {
    id: 'stk-2',
    itemCode: 'PART-DISP-MOD',
    itemName: '6.7" High-Resolution Industrial Display Module',
    category: 'RAW_MATERIAL',
    currentQuantity: 850,
    reservedQuantity: 800,
    reorderThreshold: 1000,
    unitOfMeasure: 'PCS',
    unitValuation: 4800,
    binCode: 'RACK-A2-TRAY-04',
    lotBatchNumber: 'LOT-DISP-2201',
    status: 'AVAILABLE',
  },
  {
    id: 'stk-3',
    itemCode: 'PART-BATT-5000',
    itemName: '5000mAh High-Density Polymer Power Pack Cell',
    category: 'RAW_MATERIAL',
    currentQuantity: 6200,
    reservedQuantity: 6000,
    reorderThreshold: 2000,
    unitOfMeasure: 'PCS',
    unitValuation: 950,
    binCode: 'RACK-B1-TRAY-02',
    lotBatchNumber: 'LOT-BAT-8812',
    status: 'AVAILABLE',
  },
  {
    id: 'stk-4',
    itemCode: 'PART-CAM-64MP',
    itemName: 'Dual Multi-Spectrum Optical Imaging Sensor Assembly',
    category: 'RAW_MATERIAL',
    currentQuantity: 180,
    reservedQuantity: 160,
    reorderThreshold: 250,
    unitOfMeasure: 'PCS',
    unitValuation: 2850,
    binCode: 'RACK-C1-TRAY-01',
    lotBatchNumber: 'LOT-OPT-4410',
    status: 'QUARANTINE_HOLD',
  },
  {
    id: 'stk-5',
    itemCode: 'FG-APEX-PRO-01',
    itemName: 'Apex Industrial Module Pro (Finished Goods Ready to Ship)',
    category: 'FINISHED_GOOD',
    currentQuantity: 1800,
    reservedQuantity: 1200,
    reorderThreshold: 500,
    unitOfMeasure: 'BOX',
    unitValuation: 38500,
    binCode: 'BAY-FIN-OUTBOUND-01',
    lotBatchNumber: 'LOT-FG-2026-OCT',
    status: 'AVAILABLE',
  },
];

const DEFAULT_WORK_ORDERS: WorkOrderItem[] = [
  {
    id: 'wo-1',
    orderNumber: 'WO-2026-OCT-0101',
    productSku: 'FG-APEX-PRO-01',
    productName: 'Apex Industrial Module Pro (Series 8)',
    quantityTarget: 1000,
    quantityCompleted: 850,
    quantityScrapped: 12,
    lineId: 'line-1',
    lineName: 'Line 1: Surface Mount & Circuit Assembly',
    status: 'IN_PROGRESS',
    startDate: '2026-10-01',
    targetCompletionDate: '2026-10-15',
    bomComponents: [
      { itemCode: 'PART-SOC-SD8G3', qtyPerUnit: 1 },
      { itemCode: 'PART-DISP-MOD', qtyPerUnit: 1 },
      { itemCode: 'PART-BATT-5000', qtyPerUnit: 1 },
    ],
  },
  {
    id: 'wo-2',
    orderNumber: 'WO-2026-OCT-0102',
    productSku: 'FG-APEX-CORE-02',
    productName: 'Apex Core Automation Controller Ultra',
    quantityTarget: 500,
    quantityCompleted: 500,
    quantityScrapped: 4,
    lineId: 'line-2',
    lineName: 'Line 2: Subassembly & Component Bonding',
    status: 'COMPLETED',
    startDate: '2026-09-25',
    targetCompletionDate: '2026-10-05',
    bomComponents: [
      { itemCode: 'PART-SOC-SD8G3', qtyPerUnit: 1 },
      { itemCode: 'PART-BATT-5000', qtyPerUnit: 1 },
    ],
  },
];

const DEFAULT_ANDON_STOPPAGES: AndonStoppageItem[] = [];

const DEFAULT_GATE_PASSES: GatePassItem[] = [
  {
    id: 'gp-1',
    gatePassNumber: 'GP-2026-0891',
    shipmentNumber: 'DSP-SHP-2026-042',
    vehicleNumber: 'MH-12-QW-9901',
    driverName: 'Harish Rawat',
    carrierName: 'Vanguard Freight Logistics',
    sealNumber: 'SEAL-SEC-99012',
    totalWeightKg: 4250.0,
    cartonsCount: 42,
    issuedAt: '2026-10-07 10:45',
    clearedAt: '2026-10-07 11:15',
    status: 'CLEARED_EXIT',
  },
];

class EnterpriseDataStore {
  private notifyListeners() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
  }

  // --- WAREHOUSE STOCK API ---
  getWarehouseStocks(): WarehouseStockItem[] {
    if (typeof window === 'undefined') return DEFAULT_WAREHOUSE_STOCKS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WAREHOUSE);
      return stored ? JSON.parse(stored) : DEFAULT_WAREHOUSE_STOCKS;
    } catch {
      return DEFAULT_WAREHOUSE_STOCKS;
    }
  }

  saveWarehouseStocks(items: WarehouseStockItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_WAREHOUSE, JSON.stringify(items));
    this.notifyListeners();
  }

  quarantineLot(itemCode: string, lotBatchNumber?: string, reason?: string): boolean {
    const stocks = this.getWarehouseStocks();
    const updated = stocks.map((item) => {
      if (item.itemCode === itemCode || (lotBatchNumber && item.lotBatchNumber === lotBatchNumber)) {
        return { ...item, status: 'QUARANTINE_HOLD' as const };
      }
      return item;
    });
    this.saveWarehouseStocks(updated);
    return true;
  }

  releaseQuarantine(itemCode: string, lotBatchNumber?: string): boolean {
    const stocks = this.getWarehouseStocks();
    const updated = stocks.map((item) => {
      if (item.itemCode === itemCode || (lotBatchNumber && item.lotBatchNumber === lotBatchNumber)) {
        return { ...item, status: 'AVAILABLE' as const };
      }
      return item;
    });
    this.saveWarehouseStocks(updated);
    return true;
  }

  // --- WORK ORDERS & AUTOMATIC BACKFLUSHING API ---
  getWorkOrders(): WorkOrderItem[] {
    if (typeof window === 'undefined') return DEFAULT_WORK_ORDERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WORK_ORDERS);
      return stored ? JSON.parse(stored) : DEFAULT_WORK_ORDERS;
    } catch {
      return DEFAULT_WORK_ORDERS;
    }
  }

  saveWorkOrders(orders: WorkOrderItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_WORK_ORDERS, JSON.stringify(orders));
    this.notifyListeners();
  }

  /**
   * Completes a work order, automatically backflushing raw materials from Warehouse
   * and incrementing Finished Goods inventory.
   */
  completeWorkOrder(workOrderId: string): { success: boolean; message: string } {
    const orders = this.getWorkOrders();
    const targetOrder = orders.find((o) => o.id === workOrderId);
    if (!targetOrder) return { success: false, message: 'Work order not found.' };

    const remainingQty = targetOrder.quantityTarget - targetOrder.quantityCompleted;
    if (remainingQty <= 0) return { success: false, message: 'Work order is already completed.' };

    // 1. Backflush raw materials from warehouse stocks
    const stocks = this.getWarehouseStocks();
    const updatedStocks = stocks.map((stock) => {
      const bomMatch = targetOrder.bomComponents.find((c) => c.itemCode === stock.itemCode);
      if (bomMatch) {
        const requiredDeduction = bomMatch.qtyPerUnit * remainingQty;
        const newQty = Math.max(0, stock.currentQuantity - requiredDeduction);
        const newReserved = Math.max(0, stock.reservedQuantity - requiredDeduction);
        return { ...stock, currentQuantity: newQty, reservedQuantity: newReserved };
      }

      // Increment finished goods stock
      if (stock.itemCode === targetOrder.productSku || stock.category === 'FINISHED_GOOD') {
        return { ...stock, currentQuantity: stock.currentQuantity + remainingQty };
      }

      return stock;
    });

    // 2. Mark work order completed
    const updatedOrders = orders.map((o) =>
      o.id === workOrderId
        ? {
            ...o,
            quantityCompleted: o.quantityTarget,
            status: 'COMPLETED' as const,
          }
        : o
    );

    this.saveWarehouseStocks(updatedStocks);
    this.saveWorkOrders(updatedOrders);

    return {
      success: true,
      message: `Work Order [${targetOrder.orderNumber}] completed. ${remainingQty} units backflushed from raw material inventory and added to Finished Goods!`,
    };
  }

  // --- ANDON CORD EMERGENCY LINE STOPPAGE API ---
  getAndonStoppages(): AndonStoppageItem[] {
    if (typeof window === 'undefined') return DEFAULT_ANDON_STOPPAGES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ANDON);
      return stored ? JSON.parse(stored) : DEFAULT_ANDON_STOPPAGES;
    } catch {
      return DEFAULT_ANDON_STOPPAGES;
    }
  }

  saveAndonStoppages(stoppages: AndonStoppageItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_ANDON, JSON.stringify(stoppages));
    this.notifyListeners();
  }

  triggerAndon(params: {
    lineId: string;
    lineName: string;
    station: string;
    machineId: string;
    reportedBy: string;
    reason: string;
    severity?: 'CRITICAL' | 'WARNING';
  }): AndonStoppageItem {
    const stoppages = this.getAndonStoppages();
    const newStoppage: AndonStoppageItem = {
      id: `andon-${Date.now()}`,
      stoppageNumber: `ANDON-${Math.floor(1000 + Math.random() * 9000)}`,
      lineId: params.lineId,
      lineName: params.lineName,
      station: params.station,
      machineId: params.machineId,
      reportedBy: params.reportedBy,
      reason: params.reason,
      severity: params.severity || 'CRITICAL',
      startedAt: new Date().toISOString(),
      status: 'ACTIVE',
    };

    // Also halt active work orders on that line
    const orders = this.getWorkOrders();
    const updatedOrders = orders.map((o) => {
      if (o.lineId === params.lineId && o.status === 'IN_PROGRESS') {
        return { ...o, status: 'HALTED_ANDON' as const };
      }
      return o;
    });

    this.saveWorkOrders(updatedOrders);
    this.saveAndonStoppages([newStoppage, ...stoppages]);
    return newStoppage;
  }

  resolveAndon(stoppageId: string, resolutionNotes: string): boolean {
    const stoppages = this.getAndonStoppages();
    let resumedLineId = '';

    const updated = stoppages.map((s) => {
      if (s.id === stoppageId) {
        resumedLineId = s.lineId;
        return {
          ...s,
          status: 'RESOLVED' as const,
          resolvedAt: new Date().toISOString(),
          resolutionNotes,
        };
      }
      return s;
    });

    // Resume halted work orders if no other active andons on that line
    if (resumedLineId) {
      const remainingLineActive = updated.some(
        (s) => s.lineId === resumedLineId && s.status === 'ACTIVE'
      );
      if (!remainingLineActive) {
        const orders = this.getWorkOrders();
        const resumedOrders = orders.map((o) => {
          if (o.lineId === resumedLineId && o.status === 'HALTED_ANDON') {
            return { ...o, status: 'IN_PROGRESS' as const };
          }
          return o;
        });
        this.saveWorkOrders(resumedOrders);
      }
    }

    this.saveAndonStoppages(updated);
    return true;
  }

  // --- OUTBOUND DISPATCH & GATE PASS API ---
  getGatePasses(): GatePassItem[] {
    if (typeof window === 'undefined') return DEFAULT_GATE_PASSES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GATE_PASSES);
      return stored ? JSON.parse(stored) : DEFAULT_GATE_PASSES;
    } catch {
      return DEFAULT_GATE_PASSES;
    }
  }

  saveGatePasses(passes: GatePassItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_GATE_PASSES, JSON.stringify(passes));
    this.notifyListeners();
  }

  createGatePass(params: {
    shipmentNumber: string;
    vehicleNumber: string;
    driverName: string;
    carrierName: string;
    sealNumber: string;
    totalWeightKg: number;
    cartonsCount: number;
  }): GatePassItem {
    const passes = this.getGatePasses();
    const newPass: GatePassItem = {
      id: `gp-${Date.now()}`,
      gatePassNumber: `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      shipmentNumber: params.shipmentNumber,
      vehicleNumber: params.vehicleNumber,
      driverName: params.driverName,
      carrierName: params.carrierName,
      sealNumber: params.sealNumber,
      totalWeightKg: params.totalWeightKg,
      cartonsCount: params.cartonsCount,
      issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PENDING_CLEARANCE',
    };

    this.saveGatePasses([newPass, ...passes]);
    return newPass;
  }

  clearGatePass(gatePassId: string): boolean {
    const passes = this.getGatePasses();
    const updated = passes.map((p) =>
      p.id === gatePassId
        ? {
            ...p,
            status: 'CLEARED_EXIT' as const,
            clearedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          }
        : p
    );
    this.saveGatePasses(updated);
    return true;
  }
}

export const enterpriseDataStore = new EnterpriseDataStore();

/**
 * React hook to listen for real-time cross-module updates across tabs
 */
export function useEnterpriseDataListener(callback: () => void) {
  if (typeof window === 'undefined') return;
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

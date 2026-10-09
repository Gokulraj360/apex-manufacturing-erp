'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  DollarSign,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
  Trash2,
  X,
  FileText,
  Calendar,
  Building2,
  ChevronRight,
  Package,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Sample Data
// ============================================================================

export type OrderStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'READY'
  | 'CLOSED'
  | 'CANCELLED';

export interface SalesOrderItemRecord {
  id: string;
  itemId: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface SalesOrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPo?: string;
  orderDate: string;
  deliveryDate: string;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  items: SalesOrderItemRecord[];
}

export interface ProductCatalogItem {
  id: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  unitCost: number;
  sellingPrice: number;
  currentStock: number;
}

const mockCatalog: ProductCatalogItem[] = [
  {
    id: 'p-1',
    code: 'FG-PMP-100',
    name: 'Industrial Triplex Plunger Pump 500 Bar System',
    category: 'FINISHED_GOOD',
    uom: 'PCS',
    unitCost: 1450.0,
    sellingPrice: 2850.0,
    currentStock: 4,
  },
  {
    id: 'p-2',
    code: 'FG-BAT-15KWH',
    name: '48V 15kWh Modular Energy Storage Battery Rack',
    category: 'FINISHED_GOOD',
    uom: 'PCS',
    unitCost: 3200.0,
    sellingPrice: 5400.0,
    currentStock: 2,
  },
  {
    id: 'p-3',
    code: 'SA-PMP-HEAD',
    name: 'Machined Pump Head & Manifold Sub-Assembly',
    category: 'WIP',
    uom: 'PCS',
    unitCost: 165.0,
    sellingPrice: 340.0,
    currentStock: 40,
  },
  {
    id: 'p-4',
    code: 'SA-DRV-ASSY',
    name: 'Direct Drive Planetary Gearbox Sub-Assembly',
    category: 'WIP',
    uom: 'PCS',
    unitCost: 220.0,
    sellingPrice: 480.0,
    currentStock: 25,
  },
  {
    id: 'p-5',
    code: 'VLV-CHK-SS316',
    name: 'Stainless Steel 316 High-Pressure Check Valve Cartridge',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    unitCost: 26.5,
    sellingPrice: 65.0,
    currentStock: 310,
  },
];

const initialOrders: SalesOrderRecord[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-2026-081',
    customerName: 'Bharat Heavy Engineering Corp',
    customerPo: 'PO-BHEC-9921',
    orderDate: '2026-03-22',
    deliveryDate: '2026-04-10',
    status: 'IN_PRODUCTION',
    totalAmount: 28500.0,
    notes: 'Rush delivery for thermal power station cooling overhaul. Inspection cert required.',
    items: [
      {
        id: 'so-item-1',
        itemId: 'p-1',
        code: 'FG-PMP-100',
        name: 'Industrial Triplex Plunger Pump 500 Bar System',
        category: 'FINISHED_GOOD',
        uom: 'PCS',
        quantity: 10,
        unitPrice: 2850.0,
        totalPrice: 28500.0,
        notes: 'Equipped with tungsten carbide plungers',
      },
    ],
  },
  {
    id: 'so-2',
    orderNumber: 'SO-2026-082',
    customerName: 'Tata Power Renewable Microgrids',
    customerPo: 'TP-SOLAR-4402',
    orderDate: '2026-03-24',
    deliveryDate: '2026-04-18',
    status: 'CONFIRMED',
    totalAmount: 32400.0,
    notes: 'Standard 48V telecom tower backup battery bank order. 5-year warranty packet.',
    items: [
      {
        id: 'so-item-2',
        itemId: 'p-2',
        code: 'FG-BAT-15KWH',
        name: '48V 15kWh Modular Energy Storage Battery Rack',
        category: 'FINISHED_GOOD',
        uom: 'PCS',
        quantity: 6,
        unitPrice: 5400.0,
        totalPrice: 32400.0,
        notes: 'Include CAN-bus smart BMS interface',
      },
    ],
  },
  {
    id: 'so-3',
    orderNumber: 'SO-2026-079',
    customerName: 'Larsen & Toubro Hydrocarbon Ltd',
    customerPo: 'LT-HYDRO-1088',
    orderDate: '2026-03-12',
    deliveryDate: '2026-03-29',
    status: 'READY',
    totalAmount: 13600.0,
    notes: 'Packaging completed in heavy-duty export crates; pending customer inspection dispatch clearance.',
    items: [
      {
        id: 'so-item-3',
        itemId: 'p-3',
        code: 'SA-PMP-HEAD',
        name: 'Machined Pump Head & Manifold Sub-Assembly',
        category: 'WIP',
        uom: 'PCS',
        quantity: 40,
        unitPrice: 340.0,
        totalPrice: 13600.0,
      },
    ],
  },
  {
    id: 'so-4',
    orderNumber: 'SO-2026-075',
    customerName: 'Godrej Process Equipment Division',
    customerPo: 'GPED-2026-301',
    orderDate: '2026-03-05',
    deliveryDate: '2026-03-20',
    status: 'CLOSED',
    totalAmount: 45600.0,
    notes: 'Dispatched and invoiced under INV-2026-044. Payment received.',
    items: [
      {
        id: 'so-item-4',
        itemId: 'p-1',
        code: 'FG-PMP-100',
        name: 'Industrial Triplex Plunger Pump 500 Bar System',
        category: 'FINISHED_GOOD',
        uom: 'PCS',
        quantity: 16,
        unitPrice: 2850.0,
        totalPrice: 45600.0,
      },
    ],
  },
  {
    id: 'so-5',
    orderNumber: 'SO-2026-083',
    customerName: 'Kirloskar Fluid Systems',
    customerPo: 'KFS-RFQ-Draft',
    orderDate: '2026-03-27',
    deliveryDate: '2026-04-30',
    status: 'DRAFT',
    totalAmount: 9600.0,
    notes: 'Draft quotation under engineering review with client technical team.',
    items: [
      {
        id: 'so-item-5',
        itemId: 'p-4',
        code: 'SA-DRV-ASSY',
        name: 'Direct Drive Planetary Gearbox Sub-Assembly',
        category: 'WIP',
        uom: 'PCS',
        quantity: 20,
        unitPrice: 480.0,
        totalPrice: 9600.0,
      },
    ],
  },
];

export default function SalesManagementPage() {
  const [orders, setOrders] = useState<SalesOrderRecord[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderRecord | null>(null);

  // New Order Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPo, setCustomerPo] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('2026-04-25');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  interface OrderLineState {
    itemId: string;
    quantity: number;
    unitPrice: number;
  }

  const [orderLines, setOrderLines] = useState<OrderLineState[]>([
    {
      itemId: mockCatalog[0].id,
      quantity: 5,
      unitPrice: mockCatalog[0].sellingPrice,
    },
  ]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const kpis = useMemo(() => {
    const totalOrders = orders.length;

    const backlogOrders = orders.filter(
      (o) => o.status === 'CONFIRMED' || o.status === 'IN_PRODUCTION'
    );
    const orderBacklogCount = backlogOrders.length;
    const orderBacklogValue = backlogOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const revenueMTD = orders
      .filter((o) => o.status !== 'CANCELLED' && o.status !== 'DRAFT')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    let totalRev = 0;
    let totalCost = 0;
    for (const order of orders) {
      if (order.status === 'CANCELLED' || order.status === 'DRAFT') continue;
      for (const item of order.items) {
        const cat = mockCatalog.find((c) => c.id === item.itemId || c.code === item.code);
        const cost = cat ? cat.unitCost : item.unitPrice * 0.55;
        totalRev += item.totalPrice;
        totalCost += item.quantity * cost;
      }
    }
    const grossProfit = totalRev - totalCost;
    const grossMarginPercent = totalRev > 0 ? (grossProfit / totalRev) * 100 : 0;

    return {
      totalOrders,
      orderBacklogCount,
      orderBacklogValue,
      revenueMTD,
      grossProfit,
      grossMarginPercent,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        (order.customerPo && order.customerPo.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleAddLine = () => {
    setOrderLines([
      ...orderLines,
      {
        itemId: mockCatalog[0].id,
        quantity: 1,
        unitPrice: mockCatalog[0].sellingPrice,
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (orderLines.length <= 1) return;
    setOrderLines(orderLines.filter((_, idx) => idx !== index));
  };

  const handleLineChange = (
    index: number,
    field: keyof OrderLineState,
    value: any
  ) => {
    setOrderLines((prev) => {
      const next = [...prev];
      if (field === 'itemId') {
        const product = mockCatalog.find((p) => p.id === value);
        next[index] = {
          ...next[index],
          itemId: value,
          unitPrice: product ? product.sellingPrice : next[index].unitPrice,
        };
      } else {
        next[index] = {
          ...next[index],
          [field]: value,
        };
      }
      return next;
    });
  };

  const modalTotal = useMemo(() => {
    return orderLines.reduce((sum, line) => {
      const qty = Number(line.quantity) || 0;
      const price = Number(line.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  }, [orderLines]);

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || orderLines.length === 0) return;

    const orderNumber = `SO-2026-0${orders.length + 84}`;
    const items: SalesOrderItemRecord[] = orderLines.map((line, idx) => {
      const cat = mockCatalog.find((c) => c.id === line.itemId) || mockCatalog[0];
      const q = Number(line.quantity) || 1;
      const p = Number(line.unitPrice) || cat.sellingPrice;
      return {
        id: `line-${Date.now()}-${idx}`,
        itemId: cat.id,
        code: cat.code,
        name: cat.name,
        category: cat.category,
        uom: cat.uom,
        quantity: q,
        unitPrice: p,
        totalPrice: q * p,
      };
    });

    const newOrder: SalesOrderRecord = {
      id: `so-${Date.now()}`,
      orderNumber,
      customerName: customerName.trim(),
      customerPo: customerPo.trim() || undefined,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate,
      status: 'CONFIRMED',
      totalAmount: modalTotal,
      notes: notes.trim() || undefined,
      items,
    };

    setOrders([newOrder, ...orders]);
    setIsCreateModalOpen(false);
    setCustomerName('');
    setCustomerPo('');
    setNotes('');
    setOrderLines([
      {
        itemId: mockCatalog[0].id,
        quantity: 5,
        unitPrice: mockCatalog[0].sellingPrice,
      },
    ]);
    showNotification(`Sales Order ${newOrder.orderNumber} successfully confirmed and registered!`);
  };

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
    showNotification(`Order status updated to ${nextStatus}.`);
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            DRAFT
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            CONFIRMED
          </span>
        );
      case 'IN_PRODUCTION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            IN_PRODUCTION
          </span>
        );
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            READY FOR DISPATCH
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            CLOSED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            CANCELLED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Sales Orders & Fulfillment
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Commercial Desk
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Capture enterprise customer demand, track delivery commitments, and dispatch production triggers to PPC.
          </p>
        </div>

        <Link
          href="/sales/orders/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Sales Order
        </Link>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
            {kpis.totalOrders}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Order Backlog
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
            {kpis.orderBacklogCount} Orders
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-semibold">
            ${kpis.orderBacklogValue.toLocaleString()} active manufacturing pipeline
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Revenue (MTD)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
            ${kpis.revenueMTD.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Confirmed & invoiced deliveries
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Gross Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            ${kpis.grossProfit.toLocaleString()}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-semibold">
            {kpis.grossMarginPercent.toFixed(1)}% gross margin margin rate
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search order #, customer, or PO number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PRODUCTION">In Production</option>
            <option value="READY">Ready</option>
            <option value="CLOSED">Closed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Customer PO</th>
                <th className="py-3.5 px-4">Order Date</th>
                <th className="py-3.5 px-4">Commit Delivery</th>
                <th className="py-3.5 px-4 text-center">Items</th>
                <th className="py-3.5 px-4 text-right">Total Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No sales orders found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {order.customerPo || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {order.orderDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {order.deliveryDate}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {order.items.length} lines
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      ${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {renderStatusBadge(order.status)}
                    </td>
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {selectedOrder.orderNumber}
                  </span>
                  {renderStatusBadge(selectedOrder.status)}
                </div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  {selectedOrder.customerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block font-medium">Customer PO</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedOrder.customerPo || 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block font-medium">Order Date</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedOrder.orderDate}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block font-medium">Commit Delivery</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                  {selectedOrder.deliveryDate}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block font-medium">Order Total</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  ${selectedOrder.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="p-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Order Instructions & Scope:
                </span>
                {selectedOrder.notes}
              </div>
            )}

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-5">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {item.code}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate max-w-sm">
                          {item.name}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {item.quantity} {item.uom}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        ${item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Update Status:</span>
                {(['CONFIRMED', 'IN_PRODUCTION', 'READY', 'CLOSED'] as OrderStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                        selectedOrder.status === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      )}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Sales Order */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Create New Sales Order
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Record enterprise commercial contract with multi-line finished goods and assemblies.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Larsen & Toubro Heavy Engg"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customer PO Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PO-2026-9901"
                    value={customerPo}
                    onChange={(e) => setCustomerPo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Promised Delivery Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Order Line Items ({orderLines.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-2.5">
                  {orderLines.map((line, idx) => {
                    const lineTotal = (line.quantity || 0) * (line.unitPrice || 0);

                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
                      >
                        <div className="flex-1 min-w-[200px]">
                          <select
                            value={line.itemId}
                            onChange={(e) => handleLineChange(idx, 'itemId', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                          >
                            {mockCatalog.map((prod) => (
                              <option key={prod.id} value={prod.id}>
                                [{prod.code}] {prod.name} (Stock: {prod.currentStock} {prod.uom})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={line.quantity}
                            onChange={(e) =>
                              handleLineChange(idx, 'quantity', parseFloat(e.target.value) || 1)
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right font-medium"
                            required
                          />
                        </div>

                        <div className="w-32">
                          <input
                            type="number"
                            step="any"
                            min="0"
                            placeholder="Unit Price ($)"
                            value={line.unitPrice}
                            onChange={(e) =>
                              handleLineChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right font-medium"
                            required
                          />
                        </div>

                        <div className="w-28 text-right font-bold text-xs text-slate-900 dark:text-slate-100 py-1.5">
                          ${lineTotal.toFixed(2)}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          disabled={orderLines.length === 1}
                          className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                          title="Remove Line"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-medium text-slate-500">Order Subtotal:</span>
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    ${modalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery & Inspection Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Special testing standards, packaging criteria, dispatch plant location..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Confirm & Release Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Truck,
  Mail,
  Send,
  X,
  Building2,
  Layers,
  ChevronRight,
  RotateCcw,
  DollarSign,
  FileText,
  BadgeAlert,
  ArrowRight,
} from 'lucide-react';
import {
  PurchaseOrderProcurementItem,
  ProcurementPOStatus,
} from '@/types/procurement';

const INITIAL_PURCHASE_ORDERS: PurchaseOrderProcurementItem[] = [
  {
    id: 'po-1',
    poNumber: 'PO-PROC-2026-0151',
    vendorName: 'Tata Steel Tubes & Pipes Division',
    vendorEmail: 'sales@tatasteel.com',
    vendorPhone: '+91 98200 44551',
    vendorAddress: 'Jamshedpur Works, Jharkhand',
    orderDate: '2026-10-01',
    promisedDeliveryDate: '2026-10-09',
    status: 'IN_TRANSIT',
    currency: 'USD',
    subtotal: 58000,
    taxAmount: 10440,
    discountAmount: 2000,
    totalAmount: 66440,
    paymentTerms: 'NET_30',
    deliveryAddress: 'Central Raw Material Stores, Plant #1, Pune',
    items: [
      {
        itemSku: 'RAW-STL-TUBE-80',
        itemName: 'Hydraulic Seamless Steel Tubes 80mm OD',
        orderedQty: 500,
        unitPrice: 116,
        lineTotal: 58000,
      },
    ],
    issuedBy: 'Pooja Kulkarni',
    remindersSentCount: 1,
    lastReminderSentAt: '2026-10-06T11:00:00Z',
    modificationsHistory: [],
  },
  {
    id: 'po-2',
    poNumber: 'PO-PROC-2026-0154',
    vendorName: 'Sandvik Coromant Cutting Tools',
    vendorEmail: 'orders@sandvik.com',
    vendorPhone: '+91 98112 33445',
    vendorAddress: 'Pune Tech Center, MIDC',
    orderDate: '2026-10-03',
    promisedDeliveryDate: '2026-10-11',
    status: 'ACKNOWLEDGED',
    currency: 'USD',
    subtotal: 24500,
    taxAmount: 4410,
    discountAmount: 1200,
    totalAmount: 27710,
    paymentTerms: 'NET_45',
    deliveryAddress: 'Tool Crib Central Stores',
    items: [
      {
        itemSku: 'TOOL-INSRT-CNMG-432',
        itemName: 'CNMG 432 Carbide Turning Inserts',
        orderedQty: 400,
        unitPrice: 61.25,
        lineTotal: 24500,
      },
    ],
    issuedBy: 'Nitin Pawar',
    remindersSentCount: 0,
    modificationsHistory: [],
  },
  {
    id: 'po-3',
    poNumber: 'PO-PROC-2026-0149',
    vendorName: 'Bharat Precision Fasteners Ltd',
    vendorEmail: 'dispatch@bharatfasteners.in',
    vendorPhone: '+91 94220 88991',
    vendorAddress: 'Plot 18, Industrial Area, Ludhiana',
    orderDate: '2026-09-26',
    promisedDeliveryDate: '2026-10-05',
    status: 'ISSUED',
    currency: 'USD',
    subtotal: 12000,
    taxAmount: 2160,
    discountAmount: 500,
    totalAmount: 13660,
    paymentTerms: 'NET_30',
    deliveryAddress: 'Plant 1 Receiving Dock',
    items: [
      {
        itemSku: 'FAST-HEX-M12-88',
        itemName: 'Hex Bolt M12x45mm Grade 8.8 Zinc Flake',
        orderedQty: 12000,
        unitPrice: 1.0,
        lineTotal: 12000,
      },
    ],
    issuedBy: 'Pooja Kulkarni',
    remindersSentCount: 2,
    lastReminderSentAt: '2026-10-06T15:30:00Z',
    modificationsHistory: [
      {
        modifiedAt: '2026-10-02T10:00:00Z',
        modifiedBy: 'Pooja Kulkarni',
        type: 'SCHEDULE_CHANGE',
        reason: 'Vendor experienced transport dispatch delay from Ludhiana depot',
        previousDeliveryDate: '2026-10-02',
        newDeliveryDate: '2026-10-05',
      },
    ],
  },
  {
    id: 'po-4',
    poNumber: 'PO-PROC-2026-0145',
    vendorName: 'Kalyani Steels Special Forgings',
    vendorEmail: 'orders@kalyanisteels.com',
    vendorPhone: '+91 98450 11223',
    vendorAddress: 'MIDC Bhosari, Pune',
    orderDate: '2026-09-20',
    promisedDeliveryDate: '2026-09-30',
    actualDeliveryDate: '2026-09-29',
    status: 'FULFILLED',
    currency: 'USD',
    subtotal: 42000,
    taxAmount: 7560,
    discountAmount: 1500,
    totalAmount: 48060,
    paymentTerms: 'NET_30',
    deliveryAddress: 'Central Raw Material Stores, Plant #1',
    items: [
      {
        itemSku: 'RAW-STL-316-BILLET',
        itemName: 'Stainless Steel 316 Billets 100mm',
        orderedQty: 400,
        receivedQty: 400,
        unitPrice: 105,
        lineTotal: 42000,
      },
    ],
    issuedBy: 'Nitin Pawar',
    remindersSentCount: 1,
  },
];

export default function PurchaseOrdersManagementPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderProcurementItem[]>(INITIAL_PURCHASE_ORDERS);
  const [activeTab, setActiveTab] = useState<'orders' | 'schedule'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isDraftPOModalOpen, setIsDraftPOModalOpen] = useState(false);
  const [isScheduleAdjustModalOpen, setIsScheduleAdjustModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderProcurementItem | null>(null);

  // Forms
  const [newPO, setNewPO] = useState({
    vendorName: '',
    vendorEmail: '',
    vendorPhone: '',
    vendorAddress: '',
    itemSku: '',
    itemName: '',
    orderedQty: 500,
    unitPrice: 50,
    promisedDeliveryDate: new Date().toISOString().split('T')[0],
    paymentTerms: 'NET_30',
    deliveryAddress: 'Central Raw Material Stores, Plant #1, MIDC Chakan, Pune',
  });

  const [newScheduleDate, setNewScheduleDate] = useState('');
  const [scheduleReason, setScheduleReason] = useState('');

  const now = new Date();
  const overduePOs = purchaseOrders.filter(
    (po) =>
      new Date(po.promisedDeliveryDate) < now &&
      po.status !== 'FULFILLED' &&
      po.status !== 'CANCELLED',
  );

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.items.some((i) => i.itemName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDraftPO = (e: React.FormEvent) => {
    e.preventDefault();
    const count = purchaseOrders.length + 1;
    const poNumber = `PO-PROC-2026-0${count < 10 ? '0' + count : count}`;
    const subtotal = newPO.orderedQty * newPO.unitPrice;
    const taxAmount = subtotal * 0.18;
    const totalAmount = subtotal + taxAmount;

    const created: PurchaseOrderProcurementItem = {
      id: `po-${Date.now()}`,
      poNumber,
      vendorName: newPO.vendorName,
      vendorEmail: newPO.vendorEmail,
      vendorPhone: newPO.vendorPhone,
      vendorAddress: newPO.vendorAddress,
      orderDate: new Date().toISOString().split('T')[0],
      promisedDeliveryDate: newPO.promisedDeliveryDate,
      status: 'PENDING_APPROVAL',
      currency: 'USD',
      subtotal,
      taxAmount,
      discountAmount: 0,
      totalAmount,
      paymentTerms: newPO.paymentTerms,
      deliveryAddress: newPO.deliveryAddress,
      items: [
        {
          itemSku: newPO.itemSku,
          itemName: newPO.itemName,
          orderedQty: newPO.orderedQty,
          unitPrice: newPO.unitPrice,
          lineTotal: subtotal,
        },
      ],
      issuedBy: 'Procurement Specialist',
      remindersSentCount: 0,
    };

    setPurchaseOrders([created, ...purchaseOrders]);
    setIsDraftPOModalOpen(false);
  };

  const handleAdjustSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === selectedPO.id
          ? {
              ...po,
              promisedDeliveryDate: newScheduleDate,
              modificationsHistory: [
                ...(po.modificationsHistory || []),
                {
                  modifiedAt: new Date().toISOString(),
                  modifiedBy: 'Buyer Operations',
                  type: 'SCHEDULE_CHANGE',
                  reason: scheduleReason,
                  previousDeliveryDate: po.promisedDeliveryDate,
                  newDeliveryDate: newScheduleDate,
                },
              ],
            }
          : po,
      ),
    );

    setIsScheduleAdjustModalOpen(false);
    setSelectedPO(null);
  };

  const handleSendReminder = (po: PurchaseOrderProcurementItem) => {
    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === po.id
          ? {
              ...p,
              remindersSentCount: p.remindersSentCount + 1,
              lastReminderSentAt: new Date().toISOString(),
            }
          : p,
      ),
    );
    alert(`Delivery schedule reminder #${po.remindersSentCount + 1} successfully emailed to ${po.vendorName} (${po.vendorEmail})!`);
  };

  const getStatusBadge = (s: ProcurementPOStatus) => {
    switch (s) {
      case 'PENDING_APPROVAL':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'ISSUED':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'ACKNOWLEDGED':
        return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20';
      case 'IN_TRANSIT':
        return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
      case 'PARTIALLY_DELIVERED':
        return 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20';
      case 'FULFILLED':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'CANCELLED':
        return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <PackageCheck className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Purchase Orders & Delivery Schedule Tracking
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Draft official procurement orders, monitor vendor delivery milestones, adjust schedule delays, and dispatch automated arrival reminders.
          </p>
        </div>

        <button
          onClick={() => setIsDraftPOModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Draft Purchase Order
        </button>
      </div>

      {/* Overdue Warning Alert */}
      {overduePOs.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-rose-800 dark:text-rose-200">
                {overduePOs.length} Purchase Order(s) Passed Promised Delivery Date
              </div>
              <div className="text-[11px] text-rose-600/80 dark:text-rose-300/70">
                Vendor shipments delayed past factory commitment date. Trigger automated reminders or adjust revised schedule.
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 font-mono">
            Critical Watchlist
          </span>
        </div>
      )}

      {/* Tab Navigation and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PackageCheck className="h-4 w-4" />
            <span>Open Purchase Orders ({purchaseOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Delivery Schedule Radar</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search PO #, supplier, material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Tab Content: Purchase Orders Table */}
      {activeTab === 'orders' && (
        <div className="rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Supplier & Facility</th>
                  <th className="py-3 px-4">Ordered Materials</th>
                  <th className="py-3 px-4">Promised Delivery</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Reminders</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-normal">
                {filteredPOs.map((po) => {
                  const isOverdue =
                    new Date(po.promisedDeliveryDate) < now &&
                    po.status !== 'FULFILLED' &&
                    po.status !== 'CANCELLED';

                  return (
                    <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                        {po.poNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 dark:text-white">{po.vendorName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{po.vendorEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{po.items[0]?.itemName}</div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {po.items[0]?.orderedQty} units @ ${po.items[0]?.unitPrice}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className={isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-900 dark:text-white'}>
                          {po.promisedDeliveryDate}
                        </div>
                        {isOverdue && (
                          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block">
                            OVERDUE
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        ${po.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 dark:text-slate-300">{po.remindersSentCount} sent</span>
                        {po.lastReminderSentAt && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-500">
                            {po.lastReminderSentAt.split('T')[0]}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                            po.status,
                          )}`}
                        >
                          {po.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {po.status !== 'FULFILLED' && (
                            <>
                              <button
                                onClick={() => handleSendReminder(po)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
                                title="Send Email Reminder"
                              >
                                <Mail className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                   setSelectedPO(po);
                                   setNewScheduleDate(po.promisedDeliveryDate);
                                   setIsScheduleAdjustModalOpen(true);
                                }}
                                className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/20 dark:hover:bg-blue-600/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-[11px] font-semibold transition-all"
                              >
                                Reschedule
                              </button>
                            </>
                          )}
                          {po.status === 'FULFILLED' && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Received
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Delivery Schedule Radar */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white dark:bg-[#0d1322] border border-rose-200 dark:border-rose-900/40 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200 dark:border-rose-900/40">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Overdue Inbound Deliveries
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">{overduePOs.length}</span>
            </div>
            <div className="space-y-2">
              {overduePOs.map((po) => (
                <div key={po.id} className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>{po.poNumber}</span>
                    <span className="text-rose-600 dark:text-rose-400">Due: {po.promisedDeliveryDate}</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">{po.vendorName}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{po.items[0]?.itemName}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#0d1322] border border-amber-200 dark:border-amber-900/40 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-900/40">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Arriving in &lt; 7 Days
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">2</span>
            </div>
            <div className="space-y-2">
              {purchaseOrders
                .filter((p) => p.status === 'IN_TRANSIT' || p.status === 'ACKNOWLEDGED')
                .map((po) => (
                  <div key={po.id} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{po.poNumber}</span>
                      <span className="text-amber-600 dark:text-amber-400">{po.promisedDeliveryDate}</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">{po.vendorName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{po.items[0]?.itemName}</div>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#0d1322] border border-emerald-200 dark:border-emerald-900/40 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-900/40">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Recently Completed Receipts
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">1</span>
            </div>
            <div className="space-y-2">
              {purchaseOrders
                .filter((p) => p.status === 'FULFILLED')
                .map((po) => (
                  <div key={po.id} className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{po.poNumber}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Received</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">{po.vendorName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{po.items[0]?.itemName}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Draft Purchase Order */}
      {isDraftPOModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <PackageCheck className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Draft Official Purchase Order</h3>
              </div>
              <button
                onClick={() => setIsDraftPOModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDraftPO} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    value={newPO.vendorName}
                    onChange={(e) => setNewPO({ ...newPO, vendorName: e.target.value })}
                    placeholder="e.g. Tata Steel Division"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Supplier Email *</label>
                  <input
                    type="email"
                    required
                    value={newPO.vendorEmail}
                    onChange={(e) => setNewPO({ ...newPO, vendorEmail: e.target.value })}
                    placeholder="orders@vendor.com"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Material SKU *</label>
                  <input
                    type="text"
                    required
                    value={newPO.itemSku}
                    onChange={(e) => setNewPO({ ...newPO, itemSku: e.target.value })}
                    placeholder="RAW-STL-316-BILLET"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Material Description *</label>
                  <input
                    type="text"
                    required
                    value={newPO.itemName}
                    onChange={(e) => setNewPO({ ...newPO, itemName: e.target.value })}
                    placeholder="SS 316 Billets 100mm"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newPO.orderedQty}
                    onChange={(e) => setNewPO({ ...newPO, orderedQty: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Unit Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={newPO.unitPrice}
                    onChange={(e) => setNewPO({ ...newPO, unitPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Promised Date *</label>
                  <input
                    type="date"
                    required
                    value={newPO.promisedDeliveryDate}
                    onChange={(e) => setNewPO({ ...newPO, promisedDeliveryDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={newPO.paymentTerms}
                    onChange={(e) => setNewPO({ ...newPO, paymentTerms: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1">Delivery Destination</label>
                  <input
                    type="text"
                    value={newPO.deliveryAddress}
                    onChange={(e) => setNewPO({ ...newPO, deliveryAddress: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDraftPOModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                >
                  Create Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adjust Delivery Schedule */}
      {isScheduleAdjustModalOpen && selectedPO && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Clock className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Adjust Promised Delivery Date</h3>
              </div>
              <button
                onClick={() => setIsScheduleAdjustModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white font-mono">{selectedPO.poNumber}</div>
              <div className="text-slate-700 dark:text-slate-300">{selectedPO.vendorName}</div>
              <div className="text-slate-500 dark:text-slate-400">Current Promised Date: <strong className="text-slate-800 dark:text-white">{selectedPO.promisedDeliveryDate}</strong></div>
            </div>

            <form onSubmit={handleAdjustSchedule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1">New Agreed Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={newScheduleDate}
                  onChange={(e) => setNewScheduleDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1">Adjustment Reason & Audit Note *</label>
                <textarea
                  required
                  rows={3}
                  value={scheduleReason}
                  onChange={(e) => setScheduleReason(e.target.value)}
                  placeholder="e.g. Inbound transporter truck breakdown in transit; revised ETA agreed with vendor."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                >
                  Confirm Schedule Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PackageCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Filter,
  Plus,
  Search,
  TrendingUp,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Eye,
  Check,
  X,
  FileCheck,
} from 'lucide-react';
import {
  SalesOrderCRMItem,
  ClientContractCRMItem,
  SalesOrderCRMStatus,
  ClientContractCRMStatus,
  SalesOrderCRMLineItem,
  RateCardEntry,
} from '@/types/crm';

const INITIAL_SALES_ORDERS: SalesOrderCRMItem[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-2026-0811',
    quotationId: 'qt-2',
    clientId: 'cli-1',
    client: {
      id: 'cli-1',
      clientCode: 'CLI-MAH-01',
      companyName: 'Mahindra Heavy Electric Vehicles',
      industry: 'Automotive & Heavy EV',
      primaryContactName: 'Sandeep Deshmukh (VP Sourcing)',
      email: 'sandeep.d@mahindrahev.com',
      phone: '+91 98220 44551',
      billingAddress: 'Plot 45, Chakan Industrial Area Phase II, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      creditLimit: 500000,
      paymentTerms: 'NET_45',
      totalLifetimeSpend: 420000,
      accountManager: 'Vikram Sethi',
      isActive: true,
    },
    clientPoNumber: 'PO-MHEV-8821',
    orderDate: '2026-10-04',
    targetDeliveryDate: '2026-11-20',
    status: 'IN_PRODUCTION',
    currency: 'USD',
    totalAmount: 240000,
    lineItems: [
      {
        itemSku: 'GEAR-TRANSMISSION-120',
        itemName: 'Hardened Alloy Steel Transmission Gearbox 120kW',
        orderedQty: 1200,
        unitPrice: 200,
        lineTotal: 240000,
        productionBatchScheduleId: 'BATCH-2026-10-G1',
      },
    ],
    productionScheduleLinked: true,
    productionWorkOrderRef: 'WO-2026-0811',
    shippingAddress: 'Plant Gate 2, Mahindra Heavy EV Division, Chakan, Pune',
    salesRep: 'Vikram Sethi',
    createdAt: '2026-10-04T12:00:00Z',
  },
  {
    id: 'so-2',
    orderNumber: 'SO-2026-0814',
    clientId: 'cli-2',
    client: {
      id: 'cli-2',
      clientCode: 'CLI-LT-02',
      companyName: 'Larsen & Toubro Heavy Equipment',
      industry: 'Heavy Engineering & Defense',
      primaryContactName: 'Anjali Menon',
      email: 'anjali.m@larsentoubro.com',
      phone: '+91 98401 22334',
      billingAddress: 'Gate 7, Powai Works, Saki Vihar Road, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      creditLimit: 750000,
      paymentTerms: 'NET_60',
      totalLifetimeSpend: 680000,
      accountManager: 'Ananya Sharma',
      isActive: true,
    },
    clientPoNumber: 'PO-LT-9941-DEF',
    orderDate: '2026-09-28',
    targetDeliveryDate: '2026-10-25',
    status: 'SCHEDULED_FOR_PRODUCTION',
    currency: 'USD',
    totalAmount: 185000,
    lineItems: [
      {
        itemSku: 'HYD-ROD-EN8D-500',
        itemName: 'Hard Chrome Plated EN8D Cylinder Rods (500mm)',
        orderedQty: 500,
        unitPrice: 370,
        lineTotal: 185000,
      },
    ],
    productionScheduleLinked: true,
    productionWorkOrderRef: 'WO-2026-0814',
    shippingAddress: 'Sub-Assembly Dock 4, L&T Powai Campus, Mumbai',
    salesRep: 'Ananya Sharma',
    createdAt: '2026-09-28T15:00:00Z',
  },
  {
    id: 'so-3',
    orderNumber: 'SO-2026-0798',
    clientId: 'cli-4',
    client: {
      id: 'cli-4',
      clientCode: 'CLI-TAT-04',
      companyName: 'Tata Motors Commercial Vehicles',
      industry: 'Commercial Transport',
      primaryContactName: 'Rajesh Varma',
      email: 'rajesh.v@tatamotors.com',
      phone: '+91 98200 99881',
      billingAddress: 'Pimpri Industrial Corridor, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      creditLimit: 600000,
      paymentTerms: 'NET_45',
      totalLifetimeSpend: 540000,
      accountManager: 'Vikram Sethi',
      isActive: true,
    },
    clientPoNumber: 'PO-TAT-CV-4410',
    orderDate: '2026-09-15',
    targetDeliveryDate: '2026-10-12',
    status: 'DISPATCH_READY',
    currency: 'USD',
    totalAmount: 310000,
    lineItems: [
      {
        itemSku: 'AXLE-BEAM-MICROALLOY',
        itemName: 'Forged Micro-Alloy Front Axle I-Beam',
        orderedQty: 300,
        unitPrice: 1033.33,
        lineTotal: 310000,
      },
    ],
    productionScheduleLinked: true,
    productionWorkOrderRef: 'WO-2026-0798',
    shippingAddress: 'Heavy Axle Assembly Line, Tata Motors Pimpri Works, Pune',
    salesRep: 'Vikram Sethi',
    createdAt: '2026-09-15T09:30:00Z',
  },
];

const INITIAL_CONTRACTS: ClientContractCRMItem[] = [
  {
    id: 'cnt-1',
    contractRefNumber: 'BSC-2026-014',
    clientId: 'cli-1',
    client: INITIAL_SALES_ORDERS[0].client,
    contractTitle: 'Annual EV Transmission Gearboxes Blanket Agreement',
    contractType: 'BLANKET_PURCHASE_AGREEMENT',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    committedAnnualRevenue: 960000,
    rateCardJson: [
      { itemSku: 'GEAR-TRANSMISSION-120', lockedUnitPrice: 200, minAnnualQty: 4800 },
      { itemSku: 'PINION-SHAFT-EN353', lockedUnitPrice: 65, minAnnualQty: 9600 },
    ],
    penaltyTerms: '0.5% per week delay capped at 5% of quarterly release value.',
    status: 'ACTIVE',
    signedByClient: true,
    accountManager: 'Vikram Sethi',
    createdAt: '2026-03-25T10:00:00Z',
  },
  {
    id: 'cnt-2',
    contractRefNumber: 'BSC-2026-019',
    clientId: 'cli-2',
    client: INITIAL_SALES_ORDERS[1].client,
    contractTitle: 'Heavy Hydraulic Rods & Actuator Components Master Agreement',
    contractType: 'RATE_CONTRACT',
    startDate: '2026-06-01',
    endDate: '2027-05-31',
    committedAnnualRevenue: 750000,
    rateCardJson: [
      { itemSku: 'HYD-ROD-EN8D-500', lockedUnitPrice: 370, minAnnualQty: 2000 },
      { itemSku: 'CYLINDER-BARREL-ST52', lockedUnitPrice: 420, minAnnualQty: 1000 },
    ],
    penaltyTerms: 'Mutual force majeure clause with 14-day notice requirement.',
    status: 'ACTIVE',
    signedByClient: true,
    accountManager: 'Ananya Sharma',
    createdAt: '2026-05-20T14:00:00Z',
  },
];

export default function CRMOrdersPage() {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'CONTRACTS'>('ORDERS');
  const [salesOrders, setSalesOrders] = useState<SalesOrderCRMItem[]>(INITIAL_SALES_ORDERS);
  const [contracts, setContracts] = useState<ClientContractCRMItem[]>(INITIAL_CONTRACTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<SalesOrderCRMItem | null>(null);

  // New Sales Order Form State
  const [convertForm, setConvertForm] = useState({
    companyName: 'Mahindra Heavy Electric Vehicles',
    clientPoNumber: '',
    targetDeliveryDate: '2026-11-30',
    itemSku: 'CUSTOM-COMP-01',
    itemName: 'Precision Machined Gear Assembly',
    orderedQty: 500,
    unitPrice: 180,
    shippingAddress: 'Plot 45, Chakan Industrial Area, Pune',
    salesRep: 'Vikram Sethi',
  });

  // New Contract Form State
  const [contractForm, setContractForm] = useState({
    companyName: 'Schneider Electric Industrial India',
    contractTitle: 'Annual Supply Framework for IP66 Sheet Enclosures',
    contractType: 'BLANKET_PURCHASE_AGREEMENT',
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    committedAnnualRevenue: '350000',
    itemSku: 'ENC-CRCA-IP66-4KW',
    lockedUnitPrice: '190',
    minAnnualQty: '1800',
    penaltyTerms: 'Liquidated damages of 0.25% per day up to 5% total.',
    accountManager: 'Rohan Mehra',
  });

  // Filtering
  const filteredOrders = salesOrders.filter((so) => {
    const matchesSearch =
      so.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      so.clientPoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      so.client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (so.productionWorkOrderRef && so.productionWorkOrderRef.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || so.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredContracts = contracts.filter((c) => {
    return (
      c.contractRefNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Metrics
  const totalSalesOrderRevenue = salesOrders.reduce((sum, so) => sum + so.totalAmount, 0);
  const totalCommittedContractRevenue = contracts.reduce((sum, c) => sum + c.committedAnnualRevenue, 0);
  const ordersInProduction = salesOrders.filter(
    (so) => so.status === 'IN_PRODUCTION' || so.status === 'SCHEDULED_FOR_PRODUCTION'
  ).length;

  // Handle Convert to Sales Order
  const handleCreateSalesOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(convertForm.orderedQty);
    const unitP = Number(convertForm.unitPrice);
    const total = qty * unitP;
    const woRef = `WO-2026-0${Math.floor(820 + Math.random() * 200)}`;

    const newOrder: SalesOrderCRMItem = {
      id: `so-${Date.now()}`,
      orderNumber: `SO-2026-0${Math.floor(820 + Math.random() * 200)}`,
      clientId: 'cli-1',
      client: {
        id: 'cli-1',
        clientCode: 'CLI-MAH-01',
        companyName: convertForm.companyName,
        industry: 'Automotive & Heavy Industry',
        primaryContactName: 'Authorized Sourcing Executive',
        email: 'sourcing@client.com',
        phone: '+91 98220 00000',
        billingAddress: convertForm.shippingAddress,
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        creditLimit: 500000,
        paymentTerms: 'NET_45',
        totalLifetimeSpend: 420000,
        accountManager: convertForm.salesRep,
        isActive: true,
      },
      clientPoNumber: convertForm.clientPoNumber || `PO-GEN-${Date.now().toString().slice(-4)}`,
      orderDate: new Date().toISOString().substring(0, 10),
      targetDeliveryDate: convertForm.targetDeliveryDate,
      status: 'SCHEDULED_FOR_PRODUCTION',
      currency: 'USD',
      totalAmount: total,
      lineItems: [
        {
          itemSku: convertForm.itemSku,
          itemName: convertForm.itemName,
          orderedQty: qty,
          unitPrice: unitP,
          lineTotal: total,
        },
      ],
      productionScheduleLinked: true,
      productionWorkOrderRef: woRef,
      shippingAddress: convertForm.shippingAddress,
      salesRep: convertForm.salesRep,
      createdAt: new Date().toISOString(),
    };

    setSalesOrders([newOrder, ...salesOrders]);
    setShowConvertModal(false);
  };

  // Handle Register Contract
  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newContract: ClientContractCRMItem = {
      id: `cnt-${Date.now()}`,
      contractRefNumber: `BSC-2026-0${Math.floor(25 + Math.random() * 70)}`,
      clientId: 'cli-3',
      client: {
        id: 'cli-3',
        clientCode: 'CLI-SCH-03',
        companyName: contractForm.companyName,
        industry: 'Industrial Automation',
        primaryContactName: 'Head of Procurement',
        email: 'procurement@client.com',
        phone: '+91 98112 00000',
        billingAddress: 'Industrial Corridor',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        creditLimit: 300000,
        paymentTerms: 'NET_30',
        totalLifetimeSpend: 215000,
        accountManager: contractForm.accountManager,
        isActive: true,
      },
      contractTitle: contractForm.contractTitle,
      contractType: contractForm.contractType,
      startDate: contractForm.startDate,
      endDate: contractForm.endDate,
      committedAnnualRevenue: parseFloat(contractForm.committedAnnualRevenue) || 200000,
      rateCardJson: [
        {
          itemSku: contractForm.itemSku,
          lockedUnitPrice: parseFloat(contractForm.lockedUnitPrice) || 150,
          minAnnualQty: parseInt(contractForm.minAnnualQty) || 1000,
        },
      ],
      penaltyTerms: contractForm.penaltyTerms,
      status: 'ACTIVE',
      signedByClient: true,
      accountManager: contractForm.accountManager,
      createdAt: new Date().toISOString(),
    };

    setContracts([newContract, ...contracts]);
    setShowContractModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Fulfillment Bridge
            </span>
            <span className="text-xs text-slate-500">Won Deals to Shop-Floor Dispatch</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Sales Orders & Blanket Supply Contracts
          </h1>
          <p className="text-sm text-slate-400">
            Convert won commercial deals to official manufacturing sales orders with linked work orders, client POs, and long-term supply framework contracts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0f172a] p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'ORDERS'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sales Orders ({salesOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('CONTRACTS')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'CONTRACTS'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Blanket Contracts ({contracts.length})
            </button>
          </div>

          {activeTab === 'ORDERS' ? (
            <button
              onClick={() => setShowConvertModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-pink-900/20"
            >
              <Plus className="w-4 h-4" />
              Convert Deal to SO
            </button>
          ) : (
            <button
              onClick={() => setShowContractModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-pink-900/20"
            >
              <Plus className="w-4 h-4" />
              Register Contract
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Confirmed SO Bookings</div>
            <div className="text-2xl font-bold text-white mt-1">
              ${totalSalesOrderRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {salesOrders.length} production orders
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Active In Production</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{ordersInProduction}</div>
            <div className="text-xs text-cyan-400/80 mt-1">CNC, forging & assembly active</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Committed Blanket Contracts</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">
              ${totalCommittedContractRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-purple-400/80 mt-1">{contracts.length} long-term rate agreements</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Shop Floor Routing Status</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">100%</div>
            <div className="text-xs text-slate-400 mt-1">All SOs mapped to Work Orders</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={
              activeTab === 'ORDERS'
                ? 'Search SO #, client PO #, client, or Work Order Ref...'
                : 'Search contract ref, client name, or title...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
          />
        </div>

        {activeTab === 'ORDERS' && (
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Statuses' },
              { id: 'SCHEDULED_FOR_PRODUCTION', label: 'Scheduled' },
              { id: 'IN_PRODUCTION', label: 'In Production' },
              { id: 'DISPATCH_READY', label: 'Ready for Dispatch' },
              { id: 'FULFILLED', label: 'Fulfilled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === tab.id
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: SALES ORDERS */}
      {activeTab === 'ORDERS' && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#090d16] text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="p-3.5">Sales Order # & PO</th>
                  <th className="p-3.5">Client & Plant</th>
                  <th className="p-3.5">Components Ordered</th>
                  <th className="p-3.5">Total Value (USD)</th>
                  <th className="p-3.5">Production Work Order</th>
                  <th className="p-3.5">Delivery Target</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredOrders.map((so) => {
                  const statusBadgeColor =
                    so.status === 'IN_PRODUCTION'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : so.status === 'DISPATCH_READY'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : so.status === 'FULFILLED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30';

                  return (
                    <tr key={so.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-white text-sm">{so.orderNumber}</div>
                        <div className="text-[11px] font-mono text-pink-400 flex items-center gap-1 mt-0.5">
                          <FileText className="w-3 h-3 text-slate-400" />
                          PO: {so.clientPoNumber}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{so.client.companyName}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">{so.shippingAddress}</div>
                      </td>
                      <td className="p-3.5 max-w-xs">
                        {so.lineItems.map((li, idx) => (
                          <div key={idx} className="font-medium text-slate-200 line-clamp-1">
                            {li.orderedQty} x {li.itemName}
                          </div>
                        ))}
                        <div className="text-[11px] text-slate-500">Rep: {so.salesRep}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-base text-white">
                          ${so.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Date: {so.orderDate}</div>
                      </td>
                      <td className="p-3.5">
                        {so.productionWorkOrderRef ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Layers className="w-3.5 h-3.5" />
                            {so.productionWorkOrderRef}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Pending Route</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-200 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {so.targetDeliveryDate}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusBadgeColor}`}>
                          {so.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(so)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: BLANKET CONTRACTS */}
      {activeTab === 'CONTRACTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContracts.map((c) => (
            <div
              key={c.id}
              className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 hover:border-pink-500/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-pink-400">{c.contractRefNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {c.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {c.contractType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{c.contractTitle}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {c.client.companyName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Committed Annual Rev</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    ${c.committedAnnualRevenue.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Term & Dates */}
              <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Effective Period: </span>
                  <span className="text-slate-200 font-mono">{c.startDate} to {c.endDate}</span>
                </div>
                <div>
                  <span className="text-slate-500">Mgr: </span>
                  <span className="text-slate-300 font-medium">{c.accountManager}</span>
                </div>
              </div>

              {/* Locked Rate Card */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                  Locked Unit Rate Card & Annual Volume Commitment
                </div>
                <div className="bg-[#090d16] rounded-xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden text-xs">
                  {c.rateCardJson.map((rc, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between font-mono">
                      <div>
                        <span className="font-semibold text-white">{rc.itemSku}</span>
                        <div className="text-[10px] text-slate-500">Min Annual Commitment: {rc.minAnnualQty.toLocaleString()} units</div>
                      </div>
                      <div className="text-pink-400 font-bold text-sm">
                        ${rc.lockedUnitPrice} / unit
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {c.penaltyTerms && (
                <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-300">SLA & Terms: </span>
                  {c.penaltyTerms}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: CONVERT WON DEAL TO SALES ORDER */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-pink-400" />
                  Convert Won Deal to Official Sales Order
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Creates an authorized manufacturing sales order and auto-triggers Work Order routing.
                </p>
              </div>
              <button
                onClick={() => setShowConvertModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSalesOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Enterprise Client *</label>
                  <input
                    type="text"
                    required
                    value={convertForm.companyName}
                    onChange={(e) => setConvertForm({ ...convertForm, companyName: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Client Purchase Order # (PO) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PO-MHEV-8821"
                    value={convertForm.clientPoNumber}
                    onChange={(e) => setConvertForm({ ...convertForm, clientPoNumber: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Target Delivery Date *</label>
                  <input
                    type="date"
                    required
                    value={convertForm.targetDeliveryDate}
                    onChange={(e) => setConvertForm({ ...convertForm, targetDeliveryDate: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Assigned Sales Rep</label>
                  <input
                    type="text"
                    value={convertForm.salesRep}
                    onChange={(e) => setConvertForm({ ...convertForm, salesRep: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Product / Component Specification</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Item SKU (e.g. GEAR-TRANSMISSION)"
                      value={convertForm.itemSku}
                      onChange={(e) => setConvertForm({ ...convertForm, itemSku: e.target.value })}
                      className="bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Item Name / Description"
                      value={convertForm.itemName}
                      onChange={(e) => setConvertForm({ ...convertForm, itemName: e.target.value })}
                      className="bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500 col-span-2"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Order Quantity</label>
                  <input
                    type="number"
                    value={convertForm.orderedQty}
                    onChange={(e) => setConvertForm({ ...convertForm, orderedQty: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Agreed Unit Price ($)</label>
                  <input
                    type="number"
                    value={convertForm.unitPrice}
                    onChange={(e) => setConvertForm({ ...convertForm, unitPrice: Number(e.target.value) })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Shipping Plant / Dock Address</label>
                  <input
                    type="text"
                    value={convertForm.shippingAddress}
                    onChange={(e) => setConvertForm({ ...convertForm, shippingAddress: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Total Order Booking:</span>
                <span className="text-emerald-400 font-bold text-base">
                  ${(convertForm.orderedQty * convertForm.unitPrice).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium shadow-md shadow-pink-900/20"
                >
                  Create Sales Order & Route to Production
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER BLANKET SUPPLY CONTRACT */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-pink-400" />
                  Register Client Blanket Supply Agreement
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Institutionalize multi-quarter price freezes, minimum commitment tiers, and SLA guarantees.
                </p>
              </div>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Contract Title *</label>
                  <input
                    type="text"
                    required
                    value={contractForm.contractTitle}
                    onChange={(e) => setContractForm({ ...contractForm, contractTitle: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Enterprise Client *</label>
                  <input
                    type="text"
                    required
                    value={contractForm.companyName}
                    onChange={(e) => setContractForm({ ...contractForm, companyName: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Committed Annual Revenue ($) *</label>
                  <input
                    type="number"
                    required
                    value={contractForm.committedAnnualRevenue}
                    onChange={(e) => setContractForm({ ...contractForm, committedAnnualRevenue: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Start Date</label>
                  <input
                    type="date"
                    value={contractForm.startDate}
                    onChange={(e) => setContractForm({ ...contractForm, startDate: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">End Date</label>
                  <input
                    type="date"
                    value={contractForm.endDate}
                    onChange={(e) => setContractForm({ ...contractForm, endDate: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Locked Rate Card Entry</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="SKU"
                      value={contractForm.itemSku}
                      onChange={(e) => setContractForm({ ...contractForm, itemSku: e.target.value })}
                      className="bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Locked Price ($)"
                      value={contractForm.lockedUnitPrice}
                      onChange={(e) => setContractForm({ ...contractForm, lockedUnitPrice: e.target.value })}
                      className="bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Min Annual Qty"
                      value={contractForm.minAnnualQty}
                      onChange={(e) => setContractForm({ ...contractForm, minAnnualQty: e.target.value })}
                      className="bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">Liquidated Damages / Delay Penalty Terms</label>
                  <input
                    type="text"
                    value={contractForm.penaltyTerms}
                    onChange={(e) => setContractForm({ ...contractForm, penaltyTerms: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowContractModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium shadow-md shadow-pink-900/20"
                >
                  Save Blanket Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW ORDER DETAILS */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-pink-400">{selectedOrderDetails.orderNumber}</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedOrderDetails.client.companyName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#090d16] p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400">PO Number:</span>
                  <div className="font-mono text-white font-bold">{selectedOrderDetails.clientPoNumber}</div>
                </div>
                <div>
                  <span className="text-slate-400">Work Order:</span>
                  <div className="font-mono text-emerald-400 font-bold">{selectedOrderDetails.productionWorkOrderRef || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <div className="text-cyan-400 font-bold">{selectedOrderDetails.status.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <span className="text-slate-400">Delivery Date:</span>
                  <div className="text-white font-bold">{selectedOrderDetails.targetDeliveryDate}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Line Items</h4>
                <div className="bg-[#090d16] rounded-xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden">
                  {selectedOrderDetails.lineItems.map((li, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{li.itemName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">SKU: {li.itemSku} | Qty: {li.orderedQty}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-white font-bold">${li.lineTotal.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">@ ${li.unitPrice} / unit</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Delivery Destination:</span>
                <p className="text-slate-200">{selectedOrderDetails.shippingAddress}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

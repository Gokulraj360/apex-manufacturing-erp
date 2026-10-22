'use client';

import React, { useState } from 'react';
import {
  Factory,
  FileText,
  Truck,
  Receipt,
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  Download,
  Calendar,
  Building2,
  ShieldCheck,
  Package,
  TrendingUp,
  XCircle,
  QrCode,
  DollarSign,
  ChevronRight,
  Send,
} from 'lucide-react';

interface RFQItem {
  id: string;
  rfqNumber: string;
  partName: string;
  partNumber: string;
  targetQuantity: number;
  deliveryDueDate: string;
  targetPriceRange: string;
  technicalSpecsUrl: string;
  status: 'OPEN_FOR_BID' | 'BID_SUBMITTED' | 'CLOSED_AWARDED';
  submittedBid?: {
    unitRate: number;
    leadTimeDays: number;
    toolingNre: number;
    validityDate: string;
  };
}

interface SupplierPOItem {
  id: string;
  poNumber: string;
  orderDate: string;
  promisedDate: string;
  lineItemsCount: number;
  totalValue: number;
  currency: string;
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'DISPATCH_IN_PROGRESS' | 'FULFILLED';
  specificationDoc: string;
}

interface ASNItem {
  id: string;
  asnNumber: string;
  poReference: string;
  vehicleNumber: string;
  transporterName: string;
  driverName: string;
  driverPhone: string;
  dispatchTimestamp: string;
  estimatedArrival: string;
  totalCartons: number;
  grossWeightKg: number;
  containerSealNumber: string;
  status: 'IN_TRANSIT' | 'ARRIVED_WEIGHBRIDGE' | 'UNLOADED_ACCEPTED' | 'QC_QUARANTINE';
}

interface SupplierInvoiceItem {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  asnNumber: string;
  invoiceDate: string;
  amount: number;
  taxAmount: number;
  currency: string;
  matchingStatus: 'MATCHED_APPROVED' | 'HELD_PRICE_VARIANCE' | 'PENDING_GRN_VERIFICATION' | 'PAID';
  varianceAmount?: number;
}

const MOCK_RFQS: RFQItem[] = [
  {
    id: 'rfq-1',
    rfqNumber: 'RFQ-SCM-2026-0044',
    partName: 'CNC Aerospace Titanium Camera Bezel Ring',
    partNumber: 'APX-CAM-BZ-902',
    targetQuantity: 25000,
    deliveryDueDate: '2026-11-15',
    targetPriceRange: '$3.80 - $4.10 / pc',
    technicalSpecsUrl: '/docs/spec-cam-902.pdf',
    status: 'OPEN_FOR_BID',
  },
  {
    id: 'rfq-2',
    rfqNumber: 'RFQ-SCM-2026-0042',
    partName: 'Ultra-Thin Flexible OLED Display FPC Cable',
    partNumber: 'FPC-DISP-FLX-011',
    targetQuantity: 50000,
    deliveryDueDate: '2026-11-01',
    targetPriceRange: '$1.45 - $1.60 / pc',
    technicalSpecsUrl: '/docs/spec-fpc-011.pdf',
    status: 'BID_SUBMITTED',
    submittedBid: {
      unitRate: 1.48,
      leadTimeDays: 14,
      toolingNre: 1200,
      validityDate: '2026-11-30',
    },
  },
  {
    id: 'rfq-3',
    rfqNumber: 'RFQ-SCM-2026-0039',
    partName: 'Shielded Ceramic Capacitor Array 0402',
    partNumber: 'CAP-ARRAY-0402-K',
    targetQuantity: 100000,
    deliveryDueDate: '2026-10-28',
    targetPriceRange: '$0.042 / pc',
    technicalSpecsUrl: '/docs/spec-cap-0402.pdf',
    status: 'CLOSED_AWARDED',
  },
];

const MOCK_POS: SupplierPOItem[] = [
  {
    id: 'po-1',
    poNumber: 'PO-APEX-2026-0891',
    orderDate: '2026-10-18',
    promisedDate: '2026-10-27',
    lineItemsCount: 4,
    totalValue: 84500,
    currency: 'USD',
    status: 'CONFIRMED',
    specificationDoc: 'PO-0891-Spec-Rev3.pdf',
  },
  {
    id: 'po-2',
    poNumber: 'PO-APEX-2026-0899',
    orderDate: '2026-10-20',
    promisedDate: '2026-11-04',
    lineItemsCount: 2,
    totalValue: 42300,
    currency: 'USD',
    status: 'PENDING_CONFIRMATION',
    specificationDoc: 'PO-0899-Spec-Rev1.pdf',
  },
  {
    id: 'po-3',
    poNumber: 'PO-APEX-2026-0870',
    orderDate: '2026-10-05',
    promisedDate: '2026-10-15',
    lineItemsCount: 6,
    totalValue: 129000,
    currency: 'USD',
    status: 'FULFILLED',
    specificationDoc: 'PO-0870-Spec-Final.pdf',
  },
];

const MOCK_ASNS: ASNItem[] = [
  {
    id: 'asn-1',
    asnNumber: 'ASN-VEN-2026-0182',
    poReference: 'PO-APEX-2026-0891',
    vehicleNumber: 'MH-12-RN-8821',
    transporterName: 'Vanguard Freight Logistics',
    driverName: 'Vikram Rajput',
    driverPhone: '+91 98230 11223',
    dispatchTimestamp: '2026-10-22 06:30',
    estimatedArrival: '2026-10-22 14:00',
    totalCartons: 85,
    grossWeightKg: 1420.5,
    containerSealNumber: 'SEAL-SEC-99014',
    status: 'IN_TRANSIT',
  },
  {
    id: 'asn-2',
    asnNumber: 'ASN-VEN-2026-0178',
    poReference: 'PO-APEX-2026-0870',
    vehicleNumber: 'KA-04-AK-5509',
    transporterName: 'Express Blue Haulage',
    driverName: 'Ramesh Patel',
    driverPhone: '+91 97412 88901',
    dispatchTimestamp: '2026-10-14 09:00',
    estimatedArrival: '2026-10-15 11:30',
    totalCartons: 120,
    grossWeightKg: 2150.0,
    containerSealNumber: 'SEAL-SEC-98441',
    status: 'UNLOADED_ACCEPTED',
  },
];

const MOCK_INVOICES: SupplierInvoiceItem[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-VEN-2026-0941',
    poNumber: 'PO-APEX-2026-0891',
    asnNumber: 'ASN-VEN-2026-0182',
    invoiceDate: '2026-10-22',
    amount: 84500,
    taxAmount: 15210,
    currency: 'USD',
    matchingStatus: 'PENDING_GRN_VERIFICATION',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-VEN-2026-0888',
    poNumber: 'PO-APEX-2026-0870',
    asnNumber: 'ASN-VEN-2026-0178',
    invoiceDate: '2026-10-15',
    amount: 129000,
    taxAmount: 23220,
    currency: 'USD',
    matchingStatus: 'MATCHED_APPROVED',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-VEN-2026-0812',
    poNumber: 'PO-APEX-2026-0850',
    asnNumber: 'ASN-VEN-2026-0155',
    invoiceDate: '2026-09-28',
    amount: 34200,
    taxAmount: 6156,
    currency: 'USD',
    matchingStatus: 'PAID',
  },
];

export default function SupplierPortalPage() {
  const [activeTab, setActiveTab] = useState<'rfqs' | 'orders' | 'asn' | 'invoices' | 'scorecard'>('orders');
  const [rfqs, setRfqs] = useState<RFQItem[]>(MOCK_RFQS);
  const [pos, setPos] = useState<SupplierPOItem[]>(MOCK_POS);
  const [asns, setAsns] = useState<ASNItem[]>(MOCK_ASNS);
  const [invoices] = useState<SupplierInvoiceItem[]>(MOCK_INVOICES);

  // New Bid Modal state
  const [selectedRfq, setSelectedRfq] = useState<RFQItem | null>(null);
  const [bidRate, setBidRate] = useState('');
  const [bidLeadTime, setBidLeadTime] = useState('14');
  const [bidNre, setBidNre] = useState('0');

  // New ASN Modal state
  const [isAsnModalOpen, setIsAsnModalOpen] = useState(false);
  const [newAsnPo, setNewAsnPo] = useState('PO-APEX-2026-0891');
  const [newAsnTruck, setNewAsnTruck] = useState('');
  const [newAsnTransporter, setNewAsnTransporter] = useState('Vanguard Freight Logistics');
  const [newAsnDriver, setNewAsnDriver] = useState('');
  const [newAsnPhone, setNewAsnPhone] = useState('');
  const [newAsnCartons, setNewAsnCartons] = useState('50');
  const [newAsnWeight, setNewAsnWeight] = useState('850');
  const [newAsnEta, setNewAsnEta] = useState('2026-10-23 15:00');

  const handleConfirmPo = (id: string) => {
    setPos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'CONFIRMED' } : item))
    );
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;
    setRfqs((prev) =>
      prev.map((r) =>
        r.id === selectedRfq.id
          ? {
              ...r,
              status: 'BID_SUBMITTED',
              submittedBid: {
                unitRate: parseFloat(bidRate) || 3.95,
                leadTimeDays: parseInt(bidLeadTime) || 14,
                toolingNre: parseFloat(bidNre) || 0,
                validityDate: '2026-11-30',
              },
            }
          : r
      )
    );
    setSelectedRfq(null);
  };

  const handleCreateAsn = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ASNItem = {
      id: `asn-${Date.now()}`,
      asnNumber: `ASN-VEN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      poReference: newAsnPo,
      vehicleNumber: newAsnTruck || 'MH-14-EA-9912',
      transporterName: newAsnTransporter,
      driverName: newAsnDriver || 'Anand Shinde',
      driverPhone: newAsnPhone || '+91 98810 54321',
      dispatchTimestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      estimatedArrival: newAsnEta,
      totalCartons: parseInt(newAsnCartons) || 40,
      grossWeightKg: parseFloat(newAsnWeight) || 620,
      containerSealNumber: `SEAL-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'IN_TRANSIT',
    };
    setAsns([newEntry, ...asns]);
    setIsAsnModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Factory className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              B2B Supplier Self-Service Gateway
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              Authorized Partner: Precision Component Technologies Ltd (VEN-SC-001)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Submit formal price bids on open RFQs, acknowledge purchase order releases, build Advance Shipping Notices (ASN), and track 3-way invoice payment clearance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAsnModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Create Advance Shipping Notice (ASN)
          </button>
        </div>
      </div>

      {/* KPI Telemetry Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active PO Backlog</span>
            <Package className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">$126.8K</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">2 Active POs</span>
            <span>in production dispatch</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Consignments In-Transit</span>
            <Truck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{asns.filter(a => a.status === 'IN_TRANSIT').length} Shipments</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            <span>En route to North Weighbridge</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quality Scorecard</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">98.4%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Tier-1 Preferred Supplier Status</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoices Approved</span>
            <DollarSign className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">$163.2K</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Next remittance: Oct 28, 2026</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="h-4 w-4" /> Purchase Orders & Delivery Schedules ({pos.length})
        </button>
        <button
          onClick={() => setActiveTab('asn')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'asn'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Truck className="h-4 w-4" /> Advance Shipping Notices (ASN) ({asns.length})
        </button>
        <button
          onClick={() => setActiveTab('rfqs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'rfqs'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" /> Open RFQs & Competitive Bids ({rfqs.length})
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'invoices'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" /> Submitted Invoices & 3-Way Match ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('scorecard')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'scorecard'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="h-4 w-4" /> Quality & Performance Scorecard
        </button>
      </div>

      {/* TAB 1: PURCHASE ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Purchase Orders Released by Apex</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Review contractual quantities, promised delivery windows, and download technical manufacturing prints.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Release Date</th>
                  <th className="py-3 px-4">Promised Delivery</th>
                  <th className="py-3 px-4">Line Items</th>
                  <th className="py-3 px-4">Total Contract Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-500" />
                      {po.poNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{po.orderDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{po.promisedDate}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{po.lineItemsCount} Components</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">${po.totalValue.toLocaleString()} {po.currency}</td>
                    <td className="py-3.5 px-4">
                      {po.status === 'CONFIRMED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          Confirmed by Supplier
                        </span>
                      )}
                      {po.status === 'PENDING_CONFIRMATION' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          Awaiting Confirmation
                        </span>
                      )}
                      {po.status === 'FULFILLED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
                          Completed & Fulfilled
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {po.status === 'PENDING_CONFIRMATION' && (
                        <button
                          onClick={() => handleConfirmPo(po.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold transition-all"
                        >
                          Confirm Schedule
                        </button>
                      )}
                      <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-all inline-flex items-center gap-1">
                        <Download className="h-3 w-3" /> Specs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADVANCE SHIPPING NOTICES (ASN) */}
      {activeTab === 'asn' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Inbound Advance Shipping Notices (ASN)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generate digital gate passes for factory weighbridge fast-track clearance.</p>
            </div>
            <button
              onClick={() => setIsAsnModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Dispatch Consignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {asns.map((asn) => (
              <div key={asn.id} className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-sm text-slate-900 dark:text-white">
                    <QrCode className="h-4 w-4 text-emerald-500" />
                    {asn.asnNumber}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    asn.status === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {asn.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div><strong>PO Reference:</strong> <span className="font-mono text-emerald-600 dark:text-emerald-400">{asn.poReference}</span></div>
                  <div><strong>Vehicle / Truck:</strong> <span className="font-mono">{asn.vehicleNumber}</span> ({asn.transporterName})</div>
                  <div><strong>Driver Contact:</strong> {asn.driverName} • {asn.driverPhone}</div>
                  <div><strong>Container Security Seal:</strong> <span className="font-mono text-pink-600 dark:text-pink-400">{asn.containerSealNumber}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Cartons: <strong>{asn.totalCartons}</strong> ({asn.grossWeightKg} kg)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ETA: {asn.estimatedArrival}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OPEN RFQS */}
      {activeTab === 'rfqs' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Competitive Sourcing & SCM Requests for Quotation</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Submit competitive bids on engineering releases to secure upcoming production allocations.</p>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{rfq.rfqNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rfq.status === 'BID_SUBMITTED' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {rfq.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{rfq.partName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Part No: <span className="font-mono">{rfq.partNumber}</span> • Target Quantity: <strong>{rfq.targetQuantity.toLocaleString()} pcs</strong> • Due: {rfq.deliveryDueDate}
                  </div>
                  {rfq.submittedBid && (
                    <div className="mt-2 text-xs bg-slate-100 dark:bg-slate-800/60 p-2 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <strong>Your Submitted Bid:</strong> ${rfq.submittedBid.unitRate.toFixed(2)}/pc • Lead Time: {rfq.submittedBid.leadTimeDays} days • Tooling NRE: ${rfq.submittedBid.toolingNre}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rfq.status === 'OPEN_FOR_BID' && (
                    <button
                      onClick={() => {
                        setSelectedRfq(rfq);
                        setBidRate('3.95');
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                    >
                      Submit Formal Bid
                    </button>
                  )}
                  <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" /> Technical Drawings
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUBMITTED INVOICES */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tax Invoices & 3-Way Reconciliation Ledger</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monitor status against warehouse Goods Receipt Notes (GRN) and automated finance matching.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Linked PO</th>
                  <th className="py-3 px-4">Linked ASN</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Billed Amount</th>
                  <th className="py-3 px-4">Tax (GST/VAT)</th>
                  <th className="py-3 px-4">Reconciliation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400">{inv.poNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-600 dark:text-blue-400">{inv.asnNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{inv.invoiceDate}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">${inv.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-500">${inv.taxAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      {inv.matchingStatus === 'MATCHED_APPROVED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          3-Way Matched & Approved
                        </span>
                      )}
                      {inv.matchingStatus === 'PENDING_GRN_VERIFICATION' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                          Awaiting Weighbridge GRN
                        </span>
                      )}
                      {inv.matchingStatus === 'PAID' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
                          Payment Disbursed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SCORECARD */}
      {activeTab === 'scorecard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-500" /> Quality & PPM Score
            </h3>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">18 PPM</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Parts Per Million defect threshold target is &lt; 50 PPM. Your facility is currently in the top 5% of certified vendors.</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[96%]" />
            </div>
            <div className="text-[11px] text-slate-500">Quality Audit Passed: ISO 9001:2015 & IATF 16949 Certified</div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" /> On-Time In-Full (OTIF)
            </h3>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">99.1%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Shipment delivery punctuality against agreed PO target schedule over the rolling 90 days.</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[99%]" />
            </div>
            <div className="text-[11px] text-slate-500">Zero line-stoppage penalties assessed</div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-500" /> Commercial Compliance
            </h3>
            <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">100%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Zero debit note disputes or tax invoice discrepancies on record for Q3-Q4.</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-full" />
            </div>
            <div className="text-[11px] text-slate-500">Eligible for Priority Early Remittance Discounting</div>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT FORMAL BID */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Submit Binding Quote: {selectedRfq.rfqNumber}</h3>
              <button onClick={() => setSelectedRfq(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Component: <strong>{selectedRfq.partName}</strong> (Qty: {selectedRfq.targetQuantity.toLocaleString()})
            </div>
            <form onSubmit={handleSubmitBid} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Unit Quoted Rate ($ / pc)</label>
                <input
                  type="number"
                  step="0.01"
                  value={bidRate}
                  onChange={(e) => setBidRate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Production Lead Time (Days)</label>
                  <input
                    type="number"
                    value={bidLeadTime}
                    onChange={(e) => setBidLeadTime(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tooling / NRE Fee ($)</label>
                  <input
                    type="number"
                    value={bidNre}
                    onChange={(e) => setBidNre(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRfq(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Submit Binding Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ASN */}
      {isAsnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Advance Shipping Notice (ASN)</h3>
              <button onClick={() => setIsAsnModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateAsn} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Purchase Order Reference</label>
                <select
                  value={newAsnPo}
                  onChange={(e) => setNewAsnPo(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                >
                  {pos.map((p) => (
                    <option key={p.id} value={p.poNumber}>{p.poNumber} (${p.totalValue.toLocaleString()})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Vehicle License Plate</label>
                  <input
                    type="text"
                    placeholder="MH-12-RN-8821"
                    value={newAsnTruck}
                    onChange={(e) => setNewAsnTruck(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Freight Carrier</label>
                  <input
                    type="text"
                    value={newAsnTransporter}
                    onChange={(e) => setNewAsnTransporter(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Driver Name & Mobile</label>
                  <input
                    type="text"
                    placeholder="Driver Name"
                    value={newAsnDriver}
                    onChange={(e) => setNewAsnDriver(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Estimated Weighbridge Arrival</label>
                  <input
                    type="text"
                    value={newAsnEta}
                    onChange={(e) => setNewAsnEta(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAsnModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Generate ASN & Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Truck,
  Plus,
  Search,
  Scale,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  X,
  ExternalLink,
  ChevronRight,
  Zap,
  Gauge,
  UserCheck,
  Hash,
  MapPin,
  Barcode,
  Package,
  Boxes,
  FileCheck,
  Check,
  AlertTriangle,
  BadgeCheck,
  Layers,
  Send,
  Eye,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type DispatchStatus =
  | 'DRAFT'
  | 'PACKING'
  | 'READY_FOR_DISPATCH'
  | 'GATE_NOTIFIED'
  | 'TARE_PENDING'
  | 'DISPATCHED'
  | 'CANCELLED';

export interface DispatchCartonItem {
  id: string;
  cartonNumber: string; // e.g. "CTN-2026-0891-01"
  itemCode: string;
  itemName: string;
  batchNumber: string;
  cocNumber: string;
  quantity: number;
  uom: string;
  netWeightKg: number;
  grossWeightKg: number;
  barcode: string;
}

export interface DispatchOrderRecord {
  id: string;
  dispatchNumber: string; // e.g. "DSP-2026-0891"
  salesOrderNumber: string; // e.g. "SO-2026-001"
  customerName: string;
  customerPo: string;
  destinationAddress: string;
  destinationCity: string;
  customerGstin: string;
  transporterName: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  ewayBillNumber: string; // 12-digit Indian GST e-Way Bill
  ewayBillStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED';
  status: DispatchStatus;
  totalCartons: number;
  totalGrossWeightKg: number;
  totalNetWeightKg: number;
  gatePassId?: string;
  gatePassNumber?: string;
  signedOffBy?: string;
  signedOffAt?: string;
  gateNotifiedAt?: string;
  cartons: DispatchCartonItem[];
  notes?: string;
  createdAt: string;
}

export interface ReadySalesOrder {
  id: string;
  soNumber: string;
  customerName: string;
  customerGstin: string;
  customerPo: string;
  shippingAddress: string;
  city: string;
  defaultTransporter: string;
  fgBatches: {
    itemCode: string;
    itemName: string;
    batchNumber: string;
    cocNumber: string;
    availableQty: number;
    uom: string;
    unitNetWeightKg: number;
    unitGrossWeightKg: number;
  }[];
}

// ============================================================================
// Mock Data
// ============================================================================

const mockReadySalesOrders: ReadySalesOrder[] = [
  {
    id: 'so-1',
    soNumber: 'SO-2026-001',
    customerName: 'Larsen & Toubro Ltd - Aerospace Division',
    customerGstin: '29AABCL1234F1Z8',
    customerPo: 'PO-LT-2026-8812',
    shippingAddress: 'Aerospace Systems Park, Plot 14-B, KIADB Industrial Area',
    city: 'Bengaluru, Karnataka - 560100',
    defaultTransporter: 'VRL Logistics Fleet Services',
    fgBatches: [
      {
        itemCode: 'PLN-CRB-18MM',
        itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
        batchNumber: 'LOT-2026-TATA-881',
        cocNumber: 'COC-2026-0811',
        availableQty: 180,
        uom: 'PCS',
        unitNetWeightKg: 3.5,
        unitGrossWeightKg: 3.9,
      },
      {
        itemCode: 'FAST-HEX-M12',
        itemName: 'Hex Flange Head Bolt M12x45 Grade 10.9',
        batchNumber: 'LOT-UNB-1092-A',
        cocNumber: 'COC-2026-0814',
        availableQty: 500,
        uom: 'PCS',
        unitNetWeightKg: 0.15,
        unitGrossWeightKg: 0.17,
      },
    ],
  },
  {
    id: 'so-2',
    soNumber: 'SO-2026-002',
    customerName: 'Bharat Forge Precision Powertrain Ltd',
    customerGstin: '27AAACB2211C1ZX',
    customerPo: 'BF-PO-99120',
    shippingAddress: 'Mundhwa Forging Complex, Gate 4',
    city: 'Pune, Maharashtra - 411036',
    defaultTransporter: 'Safechem Express Cargo Lines',
    fgBatches: [
      {
        itemCode: 'BUSH-BRZ-30MM',
        itemName: 'Phosphor Bronze Sleeve Blank 30mm',
        batchNumber: 'LOT-2026-BRZ-9021',
        cocNumber: 'COC-2026-0820',
        availableQty: 400,
        uom: 'PCS',
        unitNetWeightKg: 1.8,
        unitGrossWeightKg: 2.05,
      },
    ],
  },
  {
    id: 'so-3',
    soNumber: 'SO-2026-003',
    customerName: 'Mahindra & Mahindra Auto Plant',
    customerGstin: '27AAACM3344M1ZV',
    customerPo: 'M&M-PO-4091',
    shippingAddress: 'Mahindra Auto Valley, Chakan Phase II',
    city: 'Pune, Maharashtra - 410501',
    defaultTransporter: 'TCI Freight Logistics',
    fgBatches: [
      {
        itemCode: 'FAST-HEX-M12',
        itemName: 'Hex Flange Head Bolt M12x45 Grade 10.9',
        batchNumber: 'LOT-UNB-1092-A',
        cocNumber: 'COC-2026-0814',
        availableQty: 450,
        uom: 'PCS',
        unitNetWeightKg: 0.15,
        unitGrossWeightKg: 0.17,
      },
    ],
  },
];

const initialDispatchOrders: DispatchOrderRecord[] = [
  {
    id: 'dsp-01',
    dispatchNumber: 'DSP-2026-0891',
    salesOrderNumber: 'SO-2026-001',
    customerName: 'Larsen & Toubro Ltd - Aerospace Division',
    customerPo: 'PO-LT-2026-8812',
    destinationAddress: 'Aerospace Systems Park, Plot 14-B, KIADB Industrial Area',
    destinationCity: 'Bengaluru, Karnataka - 560100',
    customerGstin: '29AABCL1234F1Z8',
    transporterName: 'VRL Logistics Fleet Services',
    vehicleNumber: 'KA-04-MB-8812',
    driverName: 'Ramesh Gowda',
    driverPhone: '+91 98450 11234',
    ewayBillNumber: '2418 9012 3456',
    ewayBillStatus: 'VERIFIED',
    status: 'READY_FOR_DISPATCH',
    totalCartons: 4,
    totalNetWeightKg: 350.0,
    totalGrossWeightKg: 390.0,
    notes: 'Aero-grade components with nitrogen purged vapor barrier wrap. CoC attached.',
    createdAt: '2026-10-02 09:30',
    cartons: [
      {
        id: 'c-1',
        cartonNumber: 'CTN-2026-0891-01',
        itemCode: 'PLN-CRB-18MM',
        itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
        batchNumber: 'LOT-2026-TATA-881',
        cocNumber: 'COC-2026-0811',
        quantity: 25,
        uom: 'PCS',
        netWeightKg: 87.5,
        grossWeightKg: 97.5,
        barcode: '(00)089012345678901001',
      },
      {
        id: 'c-2',
        cartonNumber: 'CTN-2026-0891-02',
        itemCode: 'PLN-CRB-18MM',
        itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
        batchNumber: 'LOT-2026-TATA-881',
        cocNumber: 'COC-2026-0811',
        quantity: 25,
        uom: 'PCS',
        netWeightKg: 87.5,
        grossWeightKg: 97.5,
        barcode: '(00)089012345678901002',
      },
      {
        id: 'c-3',
        cartonNumber: 'CTN-2026-0891-03',
        itemCode: 'PLN-CRB-18MM',
        itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
        batchNumber: 'LOT-2026-TATA-881',
        cocNumber: 'COC-2026-0811',
        quantity: 25,
        uom: 'PCS',
        netWeightKg: 87.5,
        grossWeightKg: 97.5,
        barcode: '(00)089012345678901003',
      },
      {
        id: 'c-4',
        cartonNumber: 'CTN-2026-0891-04',
        itemCode: 'PLN-CRB-18MM',
        itemName: 'Tungsten Carbide Plunger Piston 18mm OD',
        batchNumber: 'LOT-2026-TATA-881',
        cocNumber: 'COC-2026-0811',
        quantity: 25,
        uom: 'PCS',
        netWeightKg: 87.5,
        grossWeightKg: 97.5,
        barcode: '(00)089012345678901004',
      },
    ],
  },
  {
    id: 'dsp-02',
    dispatchNumber: 'DSP-2026-0888',
    salesOrderNumber: 'SO-2026-002',
    customerName: 'Bharat Forge Precision Powertrain Ltd',
    customerPo: 'BF-PO-99120',
    destinationAddress: 'Mundhwa Forging Complex, Gate 4',
    destinationCity: 'Pune, Maharashtra - 411036',
    customerGstin: '27AAACB2211C1ZX',
    transporterName: 'Safechem Express Cargo Lines',
    vehicleNumber: 'MH-12-PQ-4029',
    driverName: 'Sanjay Deshmukh',
    driverPhone: '+91 98220 89891',
    ewayBillNumber: '2819 4018 7721',
    ewayBillStatus: 'VERIFIED',
    status: 'GATE_NOTIFIED',
    gatePassId: 'gp-out-881',
    gatePassNumber: 'GP-2026-0092',
    signedOffBy: 'Dispatch Supervisor Ankit Roy',
    signedOffAt: '2026-10-02 11:15',
    gateNotifiedAt: '2026-10-02 11:15',
    totalCartons: 6,
    totalNetWeightKg: 720.0,
    totalGrossWeightKg: 820.0,
    notes: 'Outward truck docked at Outward Weighbridge Bay for Tare Weight capture.',
    createdAt: '2026-10-02 08:45',
    cartons: [
      {
        id: 'c-201',
        cartonNumber: 'CTN-2026-0888-01',
        itemCode: 'BUSH-BRZ-30MM',
        itemName: 'Phosphor Bronze Sleeve Blank 30mm',
        batchNumber: 'LOT-2026-BRZ-9021',
        cocNumber: 'COC-2026-0820',
        quantity: 65,
        uom: 'PCS',
        netWeightKg: 117.0,
        grossWeightKg: 133.0,
        barcode: '(00)089012345678902001',
      },
      {
        id: 'c-202',
        cartonNumber: 'CTN-2026-0888-02',
        itemCode: 'BUSH-BRZ-30MM',
        itemName: 'Phosphor Bronze Sleeve Blank 30mm',
        batchNumber: 'LOT-2026-BRZ-9021',
        cocNumber: 'COC-2026-0820',
        quantity: 65,
        uom: 'PCS',
        netWeightKg: 117.0,
        grossWeightKg: 133.0,
        barcode: '(00)089012345678902002',
      },
    ],
  },
  {
    id: 'dsp-03',
    dispatchNumber: 'DSP-2026-0875',
    salesOrderNumber: 'SO-2026-003',
    customerName: 'Mahindra & Mahindra Auto Plant',
    customerPo: 'M&M-PO-4091',
    destinationAddress: 'Mahindra Auto Valley, Chakan Phase II',
    destinationCity: 'Pune, Maharashtra - 410501',
    customerGstin: '27AAACM3344M1ZV',
    transporterName: 'TCI Freight Logistics',
    vehicleNumber: 'MH-14-BT-9102',
    driverName: 'Vikram Singh',
    driverPhone: '+91 97654 32109',
    ewayBillNumber: '2910 8821 9904',
    ewayBillStatus: 'VERIFIED',
    status: 'DISPATCHED',
    gatePassId: 'gp-out-875',
    gatePassNumber: 'GP-2026-0085',
    signedOffBy: 'Dispatch Supervisor Ankit Roy',
    signedOffAt: '2026-10-01 16:30',
    gateNotifiedAt: '2026-10-01 16:30',
    totalCartons: 5,
    totalNetWeightKg: 450.0,
    totalGrossWeightKg: 510.0,
    notes: 'Outward weighbridge Tare verified at 6,240 kg. Net cargo 510 kg cleared plant gate.',
    createdAt: '2026-10-01 14:00',
    cartons: [
      {
        id: 'c-301',
        cartonNumber: 'CTN-2026-0875-01',
        itemCode: 'FAST-HEX-M12',
        itemName: 'Hex Flange Head Bolt M12x45 Grade 10.9',
        batchNumber: 'LOT-UNB-1092-A',
        cocNumber: 'COC-2026-0814',
        quantity: 100,
        uom: 'PCS',
        netWeightKg: 15.0,
        grossWeightKg: 17.0,
        barcode: '(00)089012345678903001',
      },
    ],
  },
];

export default function OutwardDispatchPage() {
  const [dispatchOrders, setDispatchOrders] = useState<DispatchOrderRecord[]>(initialDispatchOrders);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Drawer / New Dispatch Form State
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [selectedSoId, setSelectedSoId] = useState<string>(mockReadySalesOrders[0].id);

  // Form Fields
  const [customerName, setCustomerName] = useState<string>(mockReadySalesOrders[0].customerName);
  const [customerGstin, setCustomerGstin] = useState<string>(mockReadySalesOrders[0].customerGstin);
  const [customerPo, setCustomerPo] = useState<string>(mockReadySalesOrders[0].customerPo);
  const [destAddress, setDestAddress] = useState<string>(mockReadySalesOrders[0].shippingAddress);
  const [destCity, setDestCity] = useState<string>(mockReadySalesOrders[0].city);
  const [transporterName, setTransporterName] = useState<string>(mockReadySalesOrders[0].defaultTransporter);
  const [vehicleNumber, setVehicleNumber] = useState<string>('KA-04-MB-8812');
  const [driverName, setDriverName] = useState<string>('Ramesh Gowda');
  const [driverPhone, setDriverPhone] = useState<string>('+91 98450 11234');
  const [ewayBillNumber, setEwayBillNumber] = useState<string>('2418 9012 3456');
  const [formNotes, setFormNotes] = useState<string>('Pre-cleared with Certificate of Conformance. Pallet wrapped.');

  // Dynamic Carton Packaging list in Form
  const [draftCartons, setDraftCartons] = useState<DispatchCartonItem[]>([
    {
      id: 'dc-1',
      cartonNumber: 'CTN-2026-0892-01',
      itemCode: mockReadySalesOrders[0].fgBatches[0].itemCode,
      itemName: mockReadySalesOrders[0].fgBatches[0].itemName,
      batchNumber: mockReadySalesOrders[0].fgBatches[0].batchNumber,
      cocNumber: mockReadySalesOrders[0].fgBatches[0].cocNumber,
      quantity: 30,
      uom: 'PCS',
      netWeightKg: 105.0,
      grossWeightKg: 117.0,
      barcode: '(00)089012345678904001',
    },
    {
      id: 'dc-2',
      cartonNumber: 'CTN-2026-0892-02',
      itemCode: mockReadySalesOrders[0].fgBatches[0].itemCode,
      itemName: mockReadySalesOrders[0].fgBatches[0].itemName,
      batchNumber: mockReadySalesOrders[0].fgBatches[0].batchNumber,
      cocNumber: mockReadySalesOrders[0].fgBatches[0].cocNumber,
      quantity: 30,
      uom: 'PCS',
      netWeightKg: 105.0,
      grossWeightKg: 117.0,
      barcode: '(00)089012345678904002',
    },
  ]);

  // Modal State for Delivery Challan / Packing Slip View
  const [viewingDispatchChallan, setViewingDispatchChallan] = useState<DispatchOrderRecord | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle SO Change
  const handleSelectSo = (soId: string) => {
    setSelectedSoId(soId);
    const so = mockReadySalesOrders.find((s) => s.id === soId);
    if (so) {
      setCustomerName(so.customerName);
      setCustomerGstin(so.customerGstin);
      setCustomerPo(so.customerPo);
      setDestAddress(so.shippingAddress);
      setDestCity(so.city);
      setTransporterName(so.defaultTransporter);

      // Auto populate first carton
      if (so.fgBatches.length > 0) {
        const b = so.fgBatches[0];
        setDraftCartons([
          {
            id: `dc-${Date.now()}-1`,
            cartonNumber: 'CTN-2026-0892-01',
            itemCode: b.itemCode,
            itemName: b.itemName,
            batchNumber: b.batchNumber,
            cocNumber: b.cocNumber,
            quantity: Math.min(b.availableQty, 25),
            uom: b.uom,
            netWeightKg: Number((Math.min(b.availableQty, 25) * b.unitNetWeightKg).toFixed(2)),
            grossWeightKg: Number((Math.min(b.availableQty, 25) * b.unitGrossWeightKg).toFixed(2)),
            barcode: `(00)089012345678904001`,
          },
        ]);
      }
    }
  };

  // Add Carton to draft
  const handleAddCarton = () => {
    const selectedSo = mockReadySalesOrders.find((s) => s.id === selectedSoId) || mockReadySalesOrders[0];
    const defaultBatch = selectedSo.fgBatches[0];
    const nextIndex = draftCartons.length + 1;
    const formattedIndex = nextIndex < 10 ? `0${nextIndex}` : `${nextIndex}`;
    const nextCartonNo = `CTN-2026-0892-${formattedIndex}`;

    const newCarton: DispatchCartonItem = {
      id: `dc-${Date.now()}-${nextIndex}`,
      cartonNumber: nextCartonNo,
      itemCode: defaultBatch?.itemCode || 'PLN-CRB-18MM',
      itemName: defaultBatch?.itemName || 'Tungsten Carbide Plunger Piston 18mm OD',
      batchNumber: defaultBatch?.batchNumber || 'LOT-2026-TATA-881',
      cocNumber: defaultBatch?.cocNumber || 'COC-2026-0811',
      quantity: 25,
      uom: defaultBatch?.uom || 'PCS',
      netWeightKg: Number((25 * (defaultBatch?.unitNetWeightKg || 3.5)).toFixed(2)),
      grossWeightKg: Number((25 * (defaultBatch?.unitGrossWeightKg || 3.9)).toFixed(2)),
      barcode: `(00)0890123456789040${formattedIndex}`,
    };

    setDraftCartons([...draftCartons, newCarton]);
  };

  // Remove Carton
  const handleRemoveCarton = (id: string) => {
    if (draftCartons.length <= 1) {
      showToast('A dispatch consignment must have at least one serialized carton', 'alert');
      return;
    }
    setDraftCartons(draftCartons.filter((c) => c.id !== id));
  };

  // Update Carton Field
  const handleUpdateCarton = (id: string, field: keyof DispatchCartonItem, value: any) => {
    setDraftCartons((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, [field]: value };
        // If quantity changed, recalculate weights approximately
        if (field === 'quantity') {
          const qty = Number(value) || 0;
          updated.netWeightKg = Number((qty * 3.5).toFixed(2));
          updated.grossWeightKg = Number((qty * 3.9).toFixed(2));
        }
        return updated;
      })
    );
  };

  // Draft Totals
  const draftTotals = useMemo(() => {
    const totalCartons = draftCartons.length;
    const totalNetWeight = draftCartons.reduce((sum, c) => sum + (Number(c.netWeightKg) || 0), 0);
    const totalGrossWeight = draftCartons.reduce((sum, c) => sum + (Number(c.grossWeightKg) || 0), 0);
    return {
      totalCartons,
      totalNetWeight: Number(totalNetWeight.toFixed(2)),
      totalGrossWeight: Number(totalGrossWeight.toFixed(2)),
      packagingTare: Number((totalGrossWeight - totalNetWeight).toFixed(2)),
    };
  }, [draftCartons]);

  // Create Dispatch Order
  const handleCreateDispatchOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleNumber.trim()) {
      showToast('Vehicle registration number is required', 'alert');
      return;
    }

    const cleanEway = ewayBillNumber.replace(/\s+/g, '');
    if (cleanEway.length !== 12) {
      showToast('Indian GST e-Way Bill must be a valid 12-digit number', 'alert');
      return;
    }

    const selectedSo = mockReadySalesOrders.find((s) => s.id === selectedSoId);
    const dispatchNo = `DSP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: DispatchOrderRecord = {
      id: `dsp-${Date.now()}`,
      dispatchNumber: dispatchNo,
      salesOrderNumber: selectedSo?.soNumber || 'SO-2026-001',
      customerName,
      customerPo,
      destinationAddress: destAddress,
      destinationCity: destCity,
      customerGstin,
      transporterName,
      vehicleNumber: vehicleNumber.toUpperCase(),
      driverName,
      driverPhone,
      ewayBillNumber,
      ewayBillStatus: 'VERIFIED',
      status: 'READY_FOR_DISPATCH',
      totalCartons: draftTotals.totalCartons,
      totalNetWeightKg: draftTotals.totalNetWeight,
      totalGrossWeightKg: draftTotals.totalGrossWeight,
      cartons: draftCartons,
      notes: formNotes,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setDispatchOrders([newOrder, ...dispatchOrders]);
    setIsCreateOpen(false);
    showToast(`Dispatch Consignment ${dispatchNo} successfully created with ${draftTotals.totalCartons} serialized cartons!`);
  };

  // Sign-Off & Notify Gate Security
  const handleSignOffAndNotifyGate = (order: DispatchOrderRecord) => {
    const generatedGatePassNumber = `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setDispatchOrders((prev) =>
      prev.map((o) => {
        if (o.id === order.id) {
          return {
            ...o,
            status: 'GATE_NOTIFIED',
            gatePassId: `gp-${Date.now()}`,
            gatePassNumber: generatedGatePassNumber,
            signedOffBy: 'Dispatch Supervisor Ankit Roy',
            signedOffAt: nowTime,
            gateNotifiedAt: nowTime,
          };
        }
        return o;
      })
    );

    showToast(
      `Gate Pass ${generatedGatePassNumber} issued! Gate Security Weighbridge notified to measure outward tare weight for vehicle ${order.vehicleNumber}.`
    );
  };

  // Filtered List
  const filteredOrders = useMemo(() => {
    return dispatchOrders.filter((order) => {
      const matchesSearch =
        order.dispatchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.ewayBillNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.salesOrderNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'READY' && order.status === 'READY_FOR_DISPATCH') ||
        (statusFilter === 'GATE_NOTIFIED' && (order.status === 'GATE_NOTIFIED' || order.status === 'TARE_PENDING')) ||
        (statusFilter === 'DISPATCHED' && order.status === 'DISPATCHED');

      return matchesSearch && matchesStatus;
    });
  }, [dispatchOrders, searchQuery, statusFilter]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = dispatchOrders.length;
    const ready = dispatchOrders.filter((o) => o.status === 'READY_FOR_DISPATCH').length;
    const gatePending = dispatchOrders.filter((o) => o.status === 'GATE_NOTIFIED' || o.status === 'TARE_PENDING').length;
    const dispatched = dispatchOrders.filter((o) => o.status === 'DISPATCHED').length;
    const totalGrossWeight = dispatchOrders.reduce((acc, o) => acc + o.totalGrossWeightKg, 0);

    return { total, ready, gatePending, dispatched, totalGrossWeight };
  }, [dispatchOrders]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-150">
          {toast.type === 'alert' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
              Outward Dispatch & Logistics Clearance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              GST Rule 55 Compliant
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              Weighbridge Tare Integrated
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic packing list generator with GS1 serial numbering, 12-digit Indian GST e-Way Bill linkage, and real-time gate pass triggers for outward tare weight clearance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/logistics/gate"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
          >
            <Scale className="w-4 h-4 text-slate-500" />
            <span>Gate & Weighbridge Station</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Packing List & Dispatch</span>
          </button>
        </div>
      </div>

      {/* Top Logistics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ready for Dispatch */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ready for Sign-Off
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-50 mt-2">
            {stats.ready} Consignments
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            FG QC & CoC attached
          </div>
        </div>

        {/* KPI 2: Gate Tare Pending */}
        <div className="p-5 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/30 dark:bg-purple-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Awaiting Gate Tare
            </span>
            <div className="relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center relative">
                <Scale className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="text-3xl font-black text-purple-900 dark:text-purple-200 mt-2">
            {stats.gatePending} Trucks
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-400 mt-1 font-semibold">
            Gate Pass issued &bull; Weighbridge armed
          </div>
        </div>

        {/* KPI 3: Total Dispatched */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dispatched (MTD)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-50 mt-2">
            {stats.dispatched} Consignments
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            Zero delivery rejections
          </div>
        </div>

        {/* KPI 4: Net Cargo Tonnage */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Gross Tonnage
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {(stats.totalGrossWeight / 1000).toFixed(2)} MT
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold">
            Across {dispatchOrders.reduce((sum, o) => sum + o.totalCartons, 0)} serialized cartons
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Dispatch #, Customer, Vehicle, e-Way..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Consignments' },
            { id: 'READY', label: 'Ready for Gate Sign-off' },
            { id: 'GATE_NOTIFIED', label: 'Tare Pending at Gate' },
            { id: 'DISPATCHED', label: 'Dispatched & Cleared' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                statusFilter === pill.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dispatch Consignments Card List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Truck className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No dispatch consignments match the selected criteria
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Create a new outward consignment from pending Finished Goods batches.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isReady = order.status === 'READY_FOR_DISPATCH' || order.status === 'PACKING';
            const isGateNotified = order.status === 'GATE_NOTIFIED' || order.status === 'TARE_PENDING';
            const isDispatched = order.status === 'DISPATCHED';

            return (
              <div
                key={order.id}
                className={cn(
                  'p-5 rounded-2xl border transition-all bg-white dark:bg-slate-900 shadow-sm space-y-4',
                  isGateNotified
                    ? 'border-purple-300 dark:border-purple-800/80 ring-2 ring-purple-500/10'
                    : 'border-slate-200 dark:border-slate-800'
                )}
              >
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-3 flex-wrap">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-mono font-black text-sm">
                      <Truck className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-base font-black text-slate-900 dark:text-slate-50">
                          {order.dispatchNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Linked {order.salesOrderNumber}
                        </span>

                        {/* Status Badges */}
                        {isReady && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            READY FOR DISPATCH
                          </span>
                        )}

                        {isGateNotified && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 flex items-center gap-1.5 animate-pulse">
                            <Scale className="w-3.5 h-3.5" />
                            GATE NOTIFIED &bull; TARE PENDING
                          </span>
                        )}

                        {isDispatched && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            DISPATCHED & TARE CLEARED
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        Consignee: <strong className="text-slate-800 dark:text-slate-200">{order.customerName}</strong>
                        {' '}&bull; PO: {order.customerPo}
                      </div>
                    </div>
                  </div>

                  {/* Top Right Quick Actions */}
                  <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
                    {/* Sign-Off & Notify Gate Button (Primary Action) */}
                    {isReady && (
                      <button
                        type="button"
                        onClick={() => handleSignOffAndNotifyGate(order)}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-700 active:scale-95 text-white shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Sign-Off & Alert Gate Security</span>
                      </button>
                    )}

                    {isGateNotified && (
                      <Link
                        href="/logistics/gate"
                        className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-purple-50 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 flex items-center gap-1.5"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Gate Pass: {order.gatePassNumber} (In Yard)</span>
                      </Link>
                    )}

                    {/* Delivery Challan & Packing Slip Button */}
                    <button
                      type="button"
                      onClick={() => setViewingDispatchChallan(order)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Print Delivery Challan</span>
                    </button>
                  </div>
                </div>

                {/* Dispatch Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Column 1: Logistics & Transporter */}
                  <div className="space-y-1 bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Transporter & Vehicle
                    </span>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {order.transporterName}
                    </div>
                    <div className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                      {order.vehicleNumber}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Driver: {order.driverName} ({order.driverPhone})
                    </div>
                  </div>

                  {/* Column 2: Indian GST e-Way Bill */}
                  <div className="space-y-1 bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      GST e-Way Bill (Rule 138)
                    </span>
                    <div className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                      <Barcode className="w-4 h-4 text-slate-400" />
                      {order.ewayBillNumber}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      NIC Portal Verified
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Customer GSTIN: {order.customerGstin}
                    </div>
                  </div>

                  {/* Column 3: Cartons & Weights */}
                  <div className="space-y-1 bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Packaging & Weights
                    </span>
                    <div className="text-slate-900 dark:text-slate-100 font-bold">
                      {order.totalCartons} Serialized Cartons / Pallets
                    </div>
                    <div className="font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between text-[11px]">
                      <span>Net Cargo Wt:</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-black">{order.totalNetWeightKg} kg</strong>
                    </div>
                    <div className="font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between text-[11px]">
                      <span>Gross Consignment:</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-black">{order.totalGrossWeightKg} kg</strong>
                    </div>
                  </div>

                  {/* Column 4: Gate Clearance / Timeline */}
                  <div className="space-y-1 bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Gate Weighbridge Status
                    </span>
                    {order.gatePassNumber ? (
                      <div>
                        <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-sm block">
                          {order.gatePassNumber}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          Notified: {order.gateNotifiedAt}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Authorized: {order.signedOffBy}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-slate-400 text-xs italic block">
                          No Gate Pass Generated
                        </span>
                        <span className="text-[11px] text-blue-600 font-semibold block mt-1">
                          Click &quot;Sign-Off & Alert Gate&quot; when loading finishes.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Carton Breakdown Drawer Strip */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold uppercase tracking-wider text-[10px]">
                      Carton Packing List Breakup ({order.cartons.length} cartons):
                    </span>
                    <span className="font-mono text-[11px]">
                      Shipping to: {order.destinationCity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {order.cartons.map((carton) => (
                      <div
                        key={carton.id}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            {carton.cartonNumber}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {carton.cocNumber}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {carton.itemCode}
                        </div>
                        <div className="text-slate-500 flex items-center justify-between text-[10px] font-mono">
                          <span>{carton.quantity} {carton.uom}</span>
                          <span>Net: {carton.netWeightKg}kg &bull; Gr: {carton.grossWeightKg}kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Create New Outward Consignment & Serialized Packing List */}
      {/* ========================================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    Generate Outward Consignment & Packing List
                  </h2>
                  <p className="text-xs text-slate-500">
                    Indian GST e-Way Bill validation, serial carton numbering, and tare-ready gate preparation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateDispatchOrder} className="flex-1 overflow-y-auto py-5 space-y-6 text-xs">
              {/* Step 1: Sales Order Selection */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  1. Select Ready Sales Order (Finished Goods Cleared by QC) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {mockReadySalesOrders.map((so) => {
                    const isSelected = so.id === selectedSoId;
                    return (
                      <div
                        key={so.id}
                        onClick={() => handleSelectSo(so.id)}
                        className={cn(
                          'p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2',
                          isSelected
                            ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-xs">
                            {so.soNumber}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            QC PASSED
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {so.customerName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          PO: {so.customerPo} &bull; {so.city}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Customer & Shipping Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  2. Consignee & Shipping Destination
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Customer GSTIN (State Coded)
                    </label>
                    <input
                      type="text"
                      value={customerGstin}
                      onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono font-bold text-blue-600 dark:text-blue-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Customer Purchase Order No
                    </label>
                    <input
                      type="text"
                      value={customerPo}
                      onChange={(e) => setCustomerPo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={destAddress}
                      onChange={(e) => setDestAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Destination City & Pincode
                    </label>
                    <input
                      type="text"
                      value={destCity}
                      onChange={(e) => setDestCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Transporter & 12-Digit Indian GST e-Way Bill */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  3. Transporter & Indian GST e-Way Bill (Mandatory for Transit)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Transporter Name
                    </label>
                    <input
                      type="text"
                      value={transporterName}
                      onChange={(e) => setTransporterName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Vehicle Registration No *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. KA-04-MB-8812"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Driver Name & Contact
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      <input
                        type="text"
                        placeholder="Name"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Mobile"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center justify-between">
                      <span>12-Digit e-Way Bill *</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Rule 138</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="12-digit e.g. 2418 9012 3456"
                        value={ewayBillNumber}
                        onChange={(e) => setEwayBillNumber(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 font-mono font-bold text-emerald-700 dark:text-emerald-300"
                        required
                      />
                      {ewayBillNumber.replace(/\s+/g, '').length === 12 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-2.5 top-2.5" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Dynamic Serialized Carton Packing List Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                      4. Serialized Cartons / Packaging Manifest ({draftCartons.length} cartons)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Sequential carton identification (CTN-XXXX) and individual tare weight tracking.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCarton}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Next Carton</span>
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2.5 grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="col-span-2">Carton #</div>
                    <div className="col-span-3">Item / SKU</div>
                    <div className="col-span-2">Batch & CoC</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2 text-right">Net / Gross (Kg)</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>

                  {draftCartons.map((carton, idx) => (
                    <div
                      key={carton.id}
                      className="px-4 py-3 grid grid-cols-12 gap-2 items-center bg-white dark:bg-slate-900 text-xs"
                    >
                      {/* Carton Number */}
                      <div className="col-span-2">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
                          {carton.cartonNumber}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          Seq #{idx + 1}
                        </span>
                      </div>

                      {/* Item SKU */}
                      <div className="col-span-3">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block truncate">
                          {carton.itemCode}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {carton.itemName}
                        </span>
                      </div>

                      {/* Batch & CoC */}
                      <div className="col-span-2">
                        <span className="font-mono text-slate-700 dark:text-slate-300 block text-[11px]">
                          {carton.batchNumber}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-block mt-0.5">
                          {carton.cocNumber}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            value={carton.quantity}
                            onChange={(e) => handleUpdateCarton(carton.id, 'quantity', e.target.value)}
                            className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 font-mono font-bold text-slate-900 dark:text-slate-100 text-center"
                          />
                          <span className="text-slate-500 font-semibold">{carton.uom}</span>
                        </div>
                      </div>

                      {/* Net & Gross Weights */}
                      <div className="col-span-2 text-right">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {carton.grossWeightKg} kg Gr.
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {carton.netWeightKg} kg Net
                        </div>
                      </div>

                      {/* Delete Action */}
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCarton(carton.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove carton"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carton Totals Aggregation Bar */}
                <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Consignment Total: {draftTotals.totalCartons} Cartons
                    </span>
                  </div>

                  <div className="flex items-center gap-4 font-mono font-bold">
                    <span className="text-slate-600 dark:text-slate-400">
                      Net Cargo Wt: <strong className="text-slate-900 dark:text-slate-100">{draftTotals.totalNetWeight} kg</strong>
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Packaging Tare: <strong className="text-slate-500">{draftTotals.packagingTare} kg</strong>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 text-sm">
                      Total Gross: {draftTotals.totalGrossWeight} kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Instructions & Notes */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Handling Instructions / Challan Notes
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Create Outward Consignment & Serialized Cartons
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Printable Indian GST Delivery Challan & Packing Slip (Rule 55) */}
      {/* ========================================================================= */}
      {viewingDispatchChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[95vh] flex flex-col">
            <button
              type="button"
              onClick={() => setViewingDispatchChallan(null)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Printable Document Container */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="border-2 border-slate-300 dark:border-slate-700 p-6 rounded-2xl space-y-4 text-xs font-sans">
                {/* Formal Header */}
                <div className="text-center border-b-2 border-slate-300 dark:border-slate-700 pb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <span className="text-base font-black tracking-wider uppercase text-slate-900 dark:text-slate-100">
                      APEX PRECISION MANUFACTURING PRIVATE LIMITED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Plot 48, Phase II, Peenya Industrial Area, Bengaluru, Karnataka - 560058
                  </div>
                  <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-bold mt-0.5">
                    GSTIN: 29AAACA1234F1Z5 &bull; CIN: U28112KA2020PTC139012
                  </div>
                  <div className="mt-2 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-serif font-black tracking-wider text-sm text-slate-900 dark:text-slate-100">
                    DELIVERY CHALLAN & SERIALIZED PACKING LIST
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 italic">
                    (Issued in Accordance with Rule 55 of the CGST / SGST Rules, 2017)
                  </div>
                </div>

                {/* Metadata Row: Challan No, e-Way Bill, Gate Pass */}
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">CHALLAN / DISPATCH REF</span>
                      <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                        {viewingDispatchChallan.dispatchNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">CUSTOMER SALES ORDER</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {viewingDispatchChallan.salesOrderNumber} &bull; PO: {viewingDispatchChallan.customerPo}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">ISSUE DATE & TIME</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {viewingDispatchChallan.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">INDIAN GST e-WAY BILL NO</span>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {viewingDispatchChallan.ewayBillNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">OUTWARD GATE PASS NO</span>
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                        {viewingDispatchChallan.gatePassNumber || 'GP-PENDING (At Weighbridge)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">VEHICLE REGISTRATION</span>
                      <span className="font-mono font-black text-slate-900 dark:text-slate-100">
                        {viewingDispatchChallan.vehicleNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Consignee & Transporter Block */}
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      CONSIGNEE / DELIVER TO:
                    </span>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {viewingDispatchChallan.customerName}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      {viewingDispatchChallan.destinationAddress}, {viewingDispatchChallan.destinationCity}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 pt-1">
                      GSTIN: {viewingDispatchChallan.customerGstin}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      TRANSPORTER / CARRIER DETAILS:
                    </span>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {viewingDispatchChallan.transporterName}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      Driver: {viewingDispatchChallan.driverName} ({viewingDispatchChallan.driverPhone})
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-900 dark:text-slate-100 pt-1">
                      Truck Reg: {viewingDispatchChallan.vehicleNumber}
                    </div>
                  </div>
                </div>

                {/* Itemized Serialized Carton Table */}
                <div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2">
                    SERIALIZED CARTON & LOT BREAKDOWN
                  </span>

                  <table className="w-full border-collapse border border-slate-200 dark:border-slate-800 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-left">
                        <th className="p-2 border border-slate-200 dark:border-slate-800">Carton #</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-800">Part SKU & Description</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-800">Batch & CoC</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-800 text-center">Qty</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-800 text-right">Net Wt</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-800 text-right">Gross Wt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingDispatchChallan.cartons.map((c) => (
                        <tr key={c.id} className="border-b border-slate-200 dark:border-slate-800">
                          <td className="p-2 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {c.cartonNumber}
                          </td>
                          <td className="p-2">
                            <span className="font-mono font-bold block">{c.itemCode}</span>
                            <span className="text-[10px] text-slate-500">{c.itemName}</span>
                          </td>
                          <td className="p-2 font-mono text-[10px]">
                            <div>{c.batchNumber}</div>
                            <div className="text-emerald-600 font-bold">{c.cocNumber}</div>
                          </td>
                          <td className="p-2 text-center font-mono font-bold">
                            {c.quantity} {c.uom}
                          </td>
                          <td className="p-2 text-right font-mono">
                            {c.netWeightKg} kg
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {c.grossWeightKg} kg
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold">
                        <td colSpan={3} className="p-2 text-right uppercase">
                          Consignment Totals:
                        </td>
                        <td className="p-2 text-center font-mono font-bold text-slate-900 dark:text-slate-100">
                          {viewingDispatchChallan.cartons.reduce((s, c) => s + c.quantity, 0)} PCS
                        </td>
                        <td className="p-2 text-right font-mono text-slate-900 dark:text-slate-100">
                          {viewingDispatchChallan.totalNetWeightKg} kg
                        </td>
                        <td className="p-2 text-right font-mono font-black text-blue-600 dark:text-blue-400">
                          {viewingDispatchChallan.totalGrossWeightKg} kg
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Statutory CGST Rule 55 Declaration */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>STATUTORY DECLARATION (RULE 55 CGST RULES 2017):</strong> This Delivery Challan is issued for movement of goods for Supply on Approval / Line Dispatch. All components are certified with Certificate of Conformance. Applicable GST will be invoiced upon final receipt acknowledgment.
                </div>

                {/* Signatures & Gate Clearance Stamp Box */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-slate-300 dark:border-slate-700 text-[11px]">
                  {/* Dispatch Signatory */}
                  <div className="space-y-6">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      1. PREPARED & CHECKED BY:
                    </span>
                    <div className="border-b border-slate-300 dark:border-slate-700 pb-1 font-bold text-slate-800 dark:text-slate-200">
                      {viewingDispatchChallan.signedOffBy || 'Dispatch Supervisor'}
                    </div>
                    <span className="text-[9px] text-slate-400 block">
                      Signed & Stamp &bull; {viewingDispatchChallan.signedOffAt || 'Pending Sign-Off'}
                    </span>
                  </div>

                  {/* Transporter Acknowledgment */}
                  <div className="space-y-6">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      2. DRIVER / CARRIER RECEIPT:
                    </span>
                    <div className="border-b border-slate-300 dark:border-slate-700 pb-1 font-bold text-slate-800 dark:text-slate-200">
                      {viewingDispatchChallan.driverName}
                    </div>
                    <span className="text-[9px] text-slate-400 block">
                      Received {viewingDispatchChallan.totalCartons} cartons intact in vehicle {viewingDispatchChallan.vehicleNumber}
                    </span>
                  </div>

                  {/* Gate Security Weighbridge Stamp */}
                  <div className="p-2.5 rounded-xl border border-dashed border-purple-400 dark:border-purple-600 bg-purple-50/30 dark:bg-purple-950/20 text-center space-y-1">
                    <span className="font-mono text-[9px] font-black text-purple-700 dark:text-purple-300 uppercase block">
                      3. WEIGHBRIDGE SECURITY CLEARANCE
                    </span>
                    <div className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Gate Pass: {viewingDispatchChallan.gatePassNumber || 'GP-NOT-ISSUED'}
                    </div>
                    <div className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold">
                      {viewingDispatchChallan.status === 'DISPATCHED'
                        ? 'TARE VERIFIED & CLEARED FOR EXIT'
                        : 'PENDING WEIGHBRIDGE TARE ENTRY'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
              <span className="text-xs text-slate-400">
                Official 3-copy manifest: Consignee / Carrier / Consignor
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingDispatchChallan(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Delivery Challan (3 Copies)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

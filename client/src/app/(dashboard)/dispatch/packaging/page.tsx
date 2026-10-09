'use client';

import React, { useState } from 'react';
import {
  Barcode,
  Package,
  Printer,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  QrCode,
  Layers,
  Scale,
  Maximize2,
  UserCheck,
  X,
  Sparkles,
  Tag,
} from 'lucide-react';
import { PackedCartonItem, BarcodeType } from '@/types/dispatch';

const INITIAL_CARTONS: PackedCartonItem[] = [
  {
    id: 'ctn-1',
    cartonNumber: 'CTN-2026-0812',
    salesOrderRef: 'SO-2026-104',
    itemCode: 'FG-VALVE-5000',
    itemName: 'Industrial High-Pressure Cryogenic Valve',
    lotBatchNumber: 'BATCH-2026-01-A',
    quantityUnits: 5,
    grossWeightKg: 125.0,
    dimensions: '60x40x45 cm',
    isSealed: true,
    sealedBy: 'Rajesh Mehra (Packer Lead)',
    packedAt: '2026-10-07 09:30',
    stagingBay: 'STAGING-BAY-01',
    barcodeLabel: {
      id: 'bar-1',
      barcodeString: '(01)00890123456789(21)SN202690412(10)BATCH-2026-01-A',
      symbology: 'GS1_128',
      serialNumber: 'SN202690412',
      skuCode: 'FG-VALVE-5000',
      batchNumber: 'BATCH-2026-01-A',
      printedAt: '2026-10-07 09:28',
      isApplied: true,
    },
  },
  {
    id: 'ctn-2',
    cartonNumber: 'CTN-2026-0813',
    salesOrderRef: 'SO-2026-104',
    itemCode: 'FG-VALVE-5000',
    itemName: 'Industrial High-Pressure Cryogenic Valve',
    lotBatchNumber: 'BATCH-2026-01-A',
    quantityUnits: 5,
    grossWeightKg: 125.0,
    dimensions: '60x40x45 cm',
    isSealed: true,
    sealedBy: 'Rajesh Mehra (Packer Lead)',
    packedAt: '2026-10-07 09:50',
    stagingBay: 'STAGING-BAY-01',
    barcodeLabel: {
      id: 'bar-2',
      barcodeString: '(01)00890123456789(21)SN202690413(10)BATCH-2026-01-A',
      symbology: 'GS1_128',
      serialNumber: 'SN202690413',
      skuCode: 'FG-VALVE-5000',
      batchNumber: 'BATCH-2026-01-A',
      printedAt: '2026-10-07 09:48',
      isApplied: true,
    },
  },
  {
    id: 'ctn-3',
    cartonNumber: 'CTN-2026-0814',
    salesOrderRef: 'SO-2026-108',
    itemCode: 'FG-SENSOR-CTRL',
    itemName: 'Dual-Channel Temperature Control Module',
    lotBatchNumber: 'BATCH-2026-05-A',
    quantityUnits: 20,
    grossWeightKg: 18.5,
    dimensions: '35x25x20 cm',
    isSealed: true,
    sealedBy: 'Sunil Rao (Packer)',
    packedAt: '2026-10-07 10:45',
    stagingBay: 'STAGING-BAY-02',
    barcodeLabel: {
      id: 'bar-3',
      barcodeString: '(01)00890123456789(21)SN202690414(10)BATCH-2026-05-A',
      symbology: 'GS1_128',
      serialNumber: 'SN202690414',
      skuCode: 'FG-SENSOR-CTRL',
      batchNumber: 'BATCH-2026-05-A',
      printedAt: '2026-10-07 10:40',
      isApplied: true,
    },
  },
  {
    id: 'ctn-4',
    cartonNumber: 'CTN-2026-0810',
    salesOrderRef: 'SO-2026-098',
    itemCode: 'FG-PUMP-H2',
    itemName: 'High-Throughput Hydraulic Pump Head',
    lotBatchNumber: 'BATCH-2026-03-A',
    quantityUnits: 2,
    grossWeightKg: 210.0,
    dimensions: '80x60x60 cm Reinforced Crate',
    isSealed: true,
    sealedBy: 'Sunil Rao (Packer)',
    packedAt: '2026-10-06 14:20',
    stagingBay: 'STAGING-BAY-04',
    barcodeLabel: {
      id: 'bar-4',
      barcodeString: '(01)00890123456789(21)SN202690410(10)BATCH-2026-03-A',
      symbology: 'GS1_128',
      serialNumber: 'SN202690410',
      skuCode: 'FG-PUMP-H2',
      batchNumber: 'BATCH-2026-03-A',
      printedAt: '2026-10-06 14:15',
      isApplied: true,
    },
  },
];

export default function CartonPackagingPage() {
  const [cartons, setCartons] = useState<PackedCartonItem[]>(INITIAL_CARTONS);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isBulkPrintModalOpen, setIsBulkPrintModalOpen] = useState(false);

  // Pack Carton Form
  const [packForm, setPackForm] = useState({
    salesOrderRef: 'SO-2026-104',
    itemCode: 'FG-VALVE-5000',
    itemName: 'Industrial High-Pressure Cryogenic Valve',
    lotBatchNumber: 'BATCH-2026-01-A',
    quantityUnits: 5,
    grossWeightKg: 125.0,
    dimensions: '60x40x45 cm',
    sealedBy: 'Rajesh Mehra (Packer Lead)',
    stagingBay: 'STAGING-BAY-01',
    symbology: 'GS1_128' as BarcodeType,
  });

  const handlePackCarton = (e: React.FormEvent) => {
    e.preventDefault();
    const ctnCount = cartons.length + 815;
    const cartonNumber = `CTN-2026-0${ctnCount}`;
    const serial = `SN2026${Math.floor(10000 + Math.random() * 90000)}`;
    const barcodeStr = `(01)00890123456789(21)${serial}(10)${packForm.lotBatchNumber}`;

    const newCarton: PackedCartonItem = {
      id: `ctn-${Date.now()}`,
      cartonNumber,
      salesOrderRef: packForm.salesOrderRef,
      itemCode: packForm.itemCode,
      itemName: packForm.itemName,
      lotBatchNumber: packForm.lotBatchNumber,
      quantityUnits: Number(packForm.quantityUnits),
      grossWeightKg: Number(packForm.grossWeightKg),
      dimensions: packForm.dimensions,
      isSealed: true,
      sealedBy: packForm.sealedBy,
      packedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      stagingBay: packForm.stagingBay,
      barcodeLabel: {
        id: `bar-${Date.now()}`,
        barcodeString: barcodeStr,
        symbology: packForm.symbology,
        serialNumber: serial,
        skuCode: packForm.itemCode,
        batchNumber: packForm.lotBatchNumber,
        printedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isApplied: true,
      },
    };

    setCartons([newCarton, ...cartons]);
    setIsPackModalOpen(false);
  };

  const filteredCartons = cartons.filter((c) => {
    const matchesSearch =
      c.cartonNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.salesOrderRef && c.salesOrderRef.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Metrics
  const totalCartons = cartons.length;
  const totalWeight = cartons.reduce((acc, c) => acc + c.grossWeightKg, 0);
  const totalUnits = cartons.reduce((acc, c) => acc + c.quantityUnits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Barcode className="w-7 h-7 text-blue-400" />
              Carton Packaging & Barcode Station
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              GS1-128 & QR Code
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Pack verified finished items into tamper-evident shipping cartons and auto-generate serialized GS1-128 barcode labels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkPrintModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 text-sm font-medium border border-neutral-700 transition"
          >
            <Printer className="w-4 h-4 text-neutral-300" />
            Bulk Print Labels
          </button>
          <button
            onClick={() => setIsPackModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-sm shadow-blue-900/30"
          >
            <Plus className="w-4 h-4" />
            Pack New Carton
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Cartons Packed</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalCartons}</span>
            <span className="text-xs text-blue-400 font-medium">{totalUnits} items sealed</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Today&apos;s packing output</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Gross Shipping Weight</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalWeight.toFixed(1)} kg</span>
            <span className="text-xs text-orange-400 font-medium">calibrated scales</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Payload ready for freight</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">GS1 Barcode Compliance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">100%</span>
            <span className="text-xs text-emerald-400 font-medium">zero un-scannables</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Verified with laser verifier</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Active Staging Bays</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">3 Bays</span>
            <span className="text-xs text-purple-400 font-medium">allocated for loading</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Staging Bay 01, 02, 04</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search carton #, SO #, SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Cartons Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCartons.map((ctn) => (
          <div
            key={ctn.id}
            className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white font-mono">{ctn.cartonNumber}</span>
                  {ctn.salesOrderRef && (
                    <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      {ctn.salesOrderRef}
                    </span>
                  )}
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {ctn.stagingBay}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 font-medium">{ctn.itemName}</p>
                <p className="text-xs text-neutral-400 font-mono">
                  SKU: {ctn.itemCode} • Batch: {ctn.lotBatchNumber}
                </p>
              </div>

              <div className="text-right">
                <span className="text-lg font-bold text-white font-mono">{ctn.quantityUnits} Units</span>
                <p className="text-xs text-neutral-400 font-mono">{ctn.grossWeightKg} kg</p>
              </div>
            </div>

            {/* Simulated Barcode Container */}
            {ctn.barcodeLabel && (
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GS1-128 Verified
                  </span>
                  <span className="font-mono text-neutral-500">{ctn.dimensions}</span>
                </div>

                {/* Barcode Graphic Stripes */}
                <div className="h-10 bg-white rounded flex items-center justify-around px-3 py-1 overflow-hidden">
                  <div className="w-1 bg-black h-full" />
                  <div className="w-2 bg-black h-full" />
                  <div className="w-0.5 bg-black h-full" />
                  <div className="w-1.5 bg-black h-full" />
                  <div className="w-1 bg-black h-full" />
                  <div className="w-3 bg-black h-full" />
                  <div className="w-0.5 bg-black h-full" />
                  <div className="w-2 bg-black h-full" />
                  <div className="w-1 bg-black h-full" />
                  <div className="w-1.5 bg-black h-full" />
                  <div className="w-2 bg-black h-full" />
                  <div className="w-0.5 bg-black h-full" />
                  <div className="w-1 bg-black h-full" />
                  <div className="w-2.5 bg-black h-full" />
                  <div className="w-1 bg-black h-full" />
                </div>

                <div className="font-mono text-[10px] text-center text-neutral-400 truncate">
                  {ctn.barcodeLabel.barcodeString}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-800">
              <span>Sealed by: <strong className="text-neutral-300">{ctn.sealedBy}</strong></span>
              <span>Packed at: {ctn.packedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: PACK NEW CARTON */}
      {isPackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Barcode className="w-5 h-5 text-blue-400" />
                Pack Shipping Carton & Issue Barcode
              </h3>
              <button
                onClick={() => setIsPackModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePackCarton} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Sales Order Ref</label>
                  <input
                    type="text"
                    value={packForm.salesOrderRef}
                    onChange={(e) => setPackForm({ ...packForm, salesOrderRef: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Staging Bay</label>
                  <input
                    type="text"
                    value={packForm.stagingBay}
                    onChange={(e) => setPackForm({ ...packForm, stagingBay: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Item Code</label>
                  <input
                    type="text"
                    value={packForm.itemCode}
                    onChange={(e) => setPackForm({ ...packForm, itemCode: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={packForm.lotBatchNumber}
                    onChange={(e) => setPackForm({ ...packForm, lotBatchNumber: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Item Description</label>
                <input
                  type="text"
                  value={packForm.itemName}
                  onChange={(e) => setPackForm({ ...packForm, itemName: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Units In Carton</label>
                  <input
                    type="number"
                    value={packForm.quantityUnits}
                    onChange={(e) => setPackForm({ ...packForm, quantityUnits: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Gross Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={packForm.grossWeightKg}
                    onChange={(e) => setPackForm({ ...packForm, grossWeightKg: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={packForm.dimensions}
                    onChange={(e) => setPackForm({ ...packForm, dimensions: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Sealed By (Lead Packer)</label>
                <input
                  type="text"
                  value={packForm.sealedBy}
                  onChange={(e) => setPackForm({ ...packForm, sealedBy: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPackModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition flex items-center gap-2"
                >
                  <Barcode className="w-4 h-4" />
                  Seal & Print Label
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BULK PRINT BARCODES */}
      {isBulkPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Zebra Thermal Printer Linked</h3>
            <p className="text-xs text-neutral-400">
              Ready to spool {cartons.length} GS1-128 shipping carton barcode labels (4x6 inch standard format) to Warehouse Dispatch Station Thermal Printer #02.
            </p>

            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-xs text-left font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Printer Model:</span>
                <span className="text-white">Zebra ZT411 Industrial 300DPI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Symbology:</span>
                <span className="text-emerald-400">GS1-128 UCC/EAN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Labels:</span>
                <span className="text-white">{cartons.length} Units</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsBulkPrintModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition"
              >
                Close
              </button>
              <button
                onClick={() => setIsBulkPrintModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
              >
                Spool Print Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Boxes,
  Scroll,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Tag,
} from 'lucide-react';
import {
  BillOfMaterialsMasterItem,
  BOMNodeItem,
  BOMStatus,
} from '@/types/design';

const INITIAL_BOM_TREE: BOMNodeItem[] = [
  {
    level: 0,
    partNumber: 'ASM-SPN-5X-001',
    partName: '5-Axis Precision Spindle Head Final Assembly',
    category: 'SUB_ASSEMBLY',
    qty: 1,
    uom: 'EA',
    unitCost: 12450.0,
    material: 'Multi-Alloy Sub-System',
    supplier: 'In-House Precision Assembly Bay 3',
    drawingRef: 'DWG-SPN-0104',
    children: [
      {
        level: 1,
        partNumber: 'PRT-SPN-CS-002',
        partName: 'Spindle Housing Main Casting',
        category: 'FABRICATED_PART',
        qty: 1,
        uom: 'EA',
        unitCost: 3200.0,
        material: 'Aluminum 7075-T6',
        supplier: 'In-House 5-Axis CNC Cell 01',
        drawingRef: 'DWG-SPN-0105',
      },
      {
        level: 1,
        partNumber: 'SUB-ROT-BRG-003',
        partName: 'Super-Precision Angular Contact Bearing Set (Pack of 4)',
        category: 'SUB_ASSEMBLY',
        qty: 1,
        uom: 'SET',
        unitCost: 4800.0,
        material: 'Hybrid Silicon Nitride Ceramic (Si3N4)',
        supplier: 'SKF Aerospace High-Speed Div',
        drawingRef: 'DWG-BRG-SPEC-08',
        children: [
          {
            level: 2,
            partNumber: 'HDW-O-RING-224',
            partName: 'Fluoroelastomer High-Temp O-Ring Seal',
            category: 'HARDWARE_FASTENER',
            qty: 4,
            uom: 'PCS',
            unitCost: 18.5,
            material: 'Viton FKM 75 Durometer',
            supplier: 'Parker Hannifin Sealing Corp',
          },
        ],
      },
      {
        level: 1,
        partNumber: 'PRT-SHF-ROT-004',
        partName: 'Main Drive Rotor Core & Motor Shaft',
        category: 'FABRICATED_PART',
        qty: 1,
        uom: 'EA',
        unitCost: 2650.0,
        material: 'AISI 4340 Quenched & Tempered',
        supplier: 'In-House Turn-Mill Bay',
        drawingRef: 'DWG-SHF-0108',
      },
      {
        level: 1,
        partNumber: 'HDW-FAS-M08-025',
        partName: 'Socket Head Cap Screw M8 x 25mm Class 12.9',
        category: 'HARDWARE_FASTENER',
        qty: 24,
        uom: 'PCS',
        unitCost: 3.2,
        material: 'High-Tensile Alloy Steel (Zinc-Nickel)',
        supplier: 'Unbrako Precision Fasteners Ltd',
      },
      {
        level: 1,
        partNumber: 'RAW-ALUM-BILLET-7075',
        partName: 'Aluminum 7075 Extruded Raw Stock Blank',
        category: 'RAW_MATERIAL',
        qty: 28.5,
        uom: 'KG',
        unitCost: 14.8,
        material: 'Al 7075-T651 Mill Plate',
        supplier: 'Hindalco Industrial Aerospace Stock',
      },
    ],
  },
];

const INITIAL_BOMS: BillOfMaterialsMasterItem[] = [
  {
    id: 'bom-1',
    bomNumber: 'BOM-2026-0042',
    title: '5-Axis Spindle Head Assembly Master BOM',
    revision: 'Rev C',
    status: 'RELEASED',
    totalPartsCount: 32,
    estimatedTotalCost: 12450.0,
    currency: 'USD',
    structureJson: INITIAL_BOM_TREE,
    releasedBy: 'Lead Design Engineer (D. Sen)',
    releasedAt: '2026-02-28T14:00:00Z',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-28T14:00:00Z',
  },
  {
    id: 'bom-2',
    bomNumber: 'BOM-2026-0048',
    title: 'Planetary Gearbox Reducer 10:1 Ratio BOM',
    revision: 'Rev A',
    status: 'IN_REVIEW',
    totalPartsCount: 46,
    estimatedTotalCost: 8950.0,
    currency: 'USD',
    structureJson: [
      {
        level: 0,
        partNumber: 'ASM-PLN-10-001',
        partName: 'Planetary Reducer Complete Unit',
        category: 'SUB_ASSEMBLY',
        qty: 1,
        uom: 'EA',
        unitCost: 8950.0,
        material: 'Case-Hardened Gear Steel',
        children: [
          {
            level: 1,
            partNumber: 'PRT-PLN-SUN-002',
            partName: 'Sun Pinion Gear 24T Mod 2.5',
            category: 'FABRICATED_PART',
            qty: 1,
            uom: 'EA',
            unitCost: 1420.0,
          },
          {
            level: 1,
            partNumber: 'PRT-PLN-CAR-003',
            partName: 'Planet Carrier Cage Machined Forging',
            category: 'FABRICATED_PART',
            qty: 1,
            uom: 'EA',
            unitCost: 2850.0,
          },
          {
            level: 1,
            partNumber: 'PRT-PLN-GEAR-004',
            partName: 'Planet Pinion Gear 36T (Set of 3)',
            category: 'FABRICATED_PART',
            qty: 3,
            uom: 'PCS',
            unitCost: 850.0,
          },
        ],
      },
    ],
    createdAt: '2026-02-22T11:00:00Z',
    updatedAt: '2026-03-02T15:00:00Z',
  },
];

export default function BomEditorPage() {
  const [boms, setBoms] = useState<BillOfMaterialsMasterItem[]>(INITIAL_BOMS);
  const [activeBom, setActiveBom] = useState<BillOfMaterialsMasterItem>(INITIAL_BOMS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add Part Modal
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [partForm, setPartForm] = useState({
    partNumber: '',
    partName: '',
    category: 'FABRICATED_PART' as const,
    qty: 1,
    uom: 'PCS',
    unitCost: 120.0,
    material: '',
    supplier: '',
    drawingRef: '',
  });

  // Create BOM Modal
  const [showCreateBomModal, setShowCreateBomModal] = useState(false);
  const [newBomForm, setNewBomForm] = useState({
    bomNumber: '',
    title: '',
    revision: 'Rev A',
    currency: 'USD',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchBoms = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/design/bom');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBoms(data);
          setActiveBom(data[0]);
        }
      }
    } catch (err) {
      console.warn('API fallback', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBoms();
  }, []);

  const handleAddPartToTree = (e: React.FormEvent) => {
    e.preventDefault();
    const newPartNode: BOMNodeItem = {
      level: 1,
      partNumber: partForm.partNumber,
      partName: partForm.partName,
      category: partForm.category,
      qty: Number(partForm.qty),
      uom: partForm.uom,
      unitCost: Number(partForm.unitCost),
      material: partForm.material,
      supplier: partForm.supplier,
      drawingRef: partForm.drawingRef,
    };

    const updatedTree = [...activeBom.structureJson];
    if (updatedTree.length > 0 && updatedTree[0].children) {
      updatedTree[0].children.push(newPartNode);
    } else {
      updatedTree.push(newPartNode);
    }

    const updatedTotalParts = activeBom.totalPartsCount + Number(partForm.qty);
    const updatedTotalCost =
      Number(activeBom.estimatedTotalCost) +
      Number(partForm.unitCost) * Number(partForm.qty);

    const updatedBom: BillOfMaterialsMasterItem = {
      ...activeBom,
      totalPartsCount: updatedTotalParts,
      estimatedTotalCost: Number(updatedTotalCost.toFixed(2)),
      structureJson: updatedTree,
    };

    setActiveBom(updatedBom);
    setBoms(boms.map((b) => (b.id === updatedBom.id ? updatedBom : b)));
    setShowAddPartModal(false);
    setNotification(`Added [${partForm.partNumber}] to BOM structure!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateNewBom = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBom: BillOfMaterialsMasterItem = {
      id: `bom-${Date.now()}`,
      bomNumber: newBomForm.bomNumber || `BOM-2026-00${boms.length + 50}`,
      title: newBomForm.title,
      revision: newBomForm.revision,
      status: 'DRAFT',
      totalPartsCount: 1,
      estimatedTotalCost: 0,
      currency: newBomForm.currency,
      structureJson: [
        {
          level: 0,
          partNumber: `ASM-${Date.now().toString().slice(-4)}`,
          partName: newBomForm.title,
          category: 'SUB_ASSEMBLY',
          qty: 1,
          uom: 'EA',
          unitCost: 0,
          children: [],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/v1/design/bom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBom),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setBoms([newBom, ...boms]);
    setActiveBom(newBom);
    setShowCreateBomModal(false);
    setNotification(`BOM Master [${newBom.bomNumber}] created in DRAFT mode!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReleaseBOM = async () => {
    try {
      await fetch(`/api/v1/design/bom/${activeBom.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'RELEASED',
          releasedBy: 'Lead Design Engineer',
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    const updated = {
      ...activeBom,
      status: 'RELEASED' as BOMStatus,
      releasedAt: new Date().toISOString(),
    };
    setActiveBom(updated);
    setBoms(boms.map((b) => (b.id === updated.id ? updated : b)));
    setNotification(`BOM [${activeBom.bomNumber}] officially released to Production ERP!`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Flatten BOM tree for searching and tabular display
  const flattenTree = (nodes: BOMNodeItem[], depth = 0): (BOMNodeItem & { depth: number })[] => {
    let result: (BOMNodeItem & { depth: number })[] = [];
    for (const node of nodes) {
      result.push({ ...node, depth });
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, depth + 1));
      }
    }
    return result;
  };

  const flattenedParts = flattenTree(activeBom.structureJson).filter((p) => {
    return (
      p.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/design" className="hover:text-violet-600 dark:hover:text-violet-400">
              Design Engineering
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 dark:text-slate-200">Multi-Level BOM Builder</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-500/10">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Multi-Level Bill of Materials (BOM) Builder
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                  Cost Rollup Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hierarchical sub-assembly breakdown, raw material part specs, cost estimation & ERP release gateway
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBoms}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-violet-500 dark:text-violet-400' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateBomModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-xs font-semibold shadow-lg shadow-violet-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New BOM Master
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* BOM Selector & Metrics Bar */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 w-full lg:w-auto">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Select Active BOM Master:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {boms.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBom(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border flex items-center gap-2 ${
                  activeBom.id === b.id
                    ? 'bg-violet-50 dark:bg-violet-600/20 border-violet-400 dark:border-violet-500/50 text-violet-700 dark:text-violet-300'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="font-mono">{b.bomNumber}</span>
                <span>• {b.title}</span>
                <span className="text-[10px] font-mono px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {b.revision}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono bg-slate-50 dark:bg-[#090d16] p-3 rounded-xl border border-slate-200 dark:border-slate-800 w-full lg:w-auto justify-between lg:justify-end">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Components</span>
            <span className="text-slate-900 dark:text-white font-bold">{activeBom.totalPartsCount} Parts</span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Est. Unit Cost</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ${activeBom.estimatedTotalCost.toLocaleString()} {activeBom.currency}
            </span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Release Status</span>
            <span
              className={`font-bold uppercase text-[10px] px-1.5 py-0.5 rounded ${
                activeBom.status === 'RELEASED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
              }`}
            >
              {activeBom.status}
            </span>
          </div>
          {activeBom.status !== 'RELEASED' && (
            <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
              <button
                onClick={handleReleaseBOM}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 font-sans transition"
              >
                Release to ERP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search parts, alloys, drawing refs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowAddPartModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-50 hover:bg-violet-100 dark:bg-violet-500/10 dark:hover:bg-violet-500/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 text-xs font-semibold transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Part to Hierarchy
          </button>
        </div>
      </div>

      {/* Multi-Level Hierarchical Part Table */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Level & Part Number</th>
                <th className="py-3 px-4">Description / Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Qty & UOM</th>
                <th className="py-3 px-4">Unit Cost ($)</th>
                <th className="py-3 px-4">Ext. Cost ($)</th>
                <th className="py-3 px-4">Material / Alloy</th>
                <th className="py-3 px-4">Drawing Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {flattenedParts.map((item, idx) => {
                const extCost = item.unitCost * item.qty;
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition ${
                      item.depth === 0 ? 'bg-slate-100/50 dark:bg-slate-900/40 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div
                        className="flex items-center gap-2 font-mono"
                        style={{ paddingLeft: `${item.depth * 20}px` }}
                      >
                        {item.depth > 0 && (
                          <span className="text-slate-400 dark:text-slate-500 font-normal">└─</span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-violet-700 dark:text-violet-400 font-bold">
                          L{item.depth}
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold">{item.partNumber}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {item.partName}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          item.category === 'SUB_ASSEMBLY'
                            ? 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30'
                            : item.category === 'FABRICATED_PART'
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
                            : item.category === 'RAW_MATERIAL'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.category.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-slate-900 dark:text-white">{item.qty}</span>{' '}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.uom}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      ${item.unitCost.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      ${extCost.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px]">
                      {item.material || '—'}
                    </td>

                    <td className="py-3 px-4">
                      {item.drawingRef ? (
                        <span className="font-mono text-violet-700 dark:text-violet-400 flex items-center gap-1 text-[11px]">
                          <Scroll className="h-3 w-3 shrink-0" /> {item.drawingRef}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Part to Tree */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Add Component or Part Specification to BOM
              </h3>
              <button onClick={() => setShowAddPartModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddPartToTree} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Part Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PRT-SPN-BRG-012"
                    value={partForm.partNumber}
                    onChange={(e) => setPartForm({ ...partForm, partNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Classification *</label>
                  <select
                    value={partForm.category}
                    onChange={(e) =>
                      setPartForm({ ...partForm, category: e.target.value as any })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="FABRICATED_PART">Fabricated Part</option>
                    <option value="RAW_MATERIAL">Raw Material Stock</option>
                    <option value="HARDWARE_FASTENER">Hardware / Fastener</option>
                    <option value="SUB_ASSEMBLY">Sub-Assembly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Component Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Precision Angular Contact Bearing Set"
                  value={partForm.partName}
                  onChange={(e) => setPartForm({ ...partForm, partName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Quantity *</label>
                  <input
                    type="number"
                    min={0.1}
                    step="any"
                    required
                    value={partForm.qty}
                    onChange={(e) => setPartForm({ ...partForm, qty: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">UOM</label>
                  <input
                    type="text"
                    required
                    value={partForm.uom}
                    onChange={(e) => setPartForm({ ...partForm, uom: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Unit Cost ($)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    value={partForm.unitCost}
                    onChange={(e) =>
                      setPartForm({ ...partForm, unitCost: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Material Alloy Spec</label>
                  <input
                    type="text"
                    placeholder="e.g. Titanium Ti-6Al-4V"
                    value={partForm.material}
                    onChange={(e) => setPartForm({ ...partForm, material: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Drawing Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. DWG-SPN-0104"
                    value={partForm.drawingRef}
                    onChange={(e) => setPartForm({ ...partForm, drawingRef: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Supplier / Work Center</label>
                <input
                  type="text"
                  placeholder="e.g. In-House 5-Axis CNC Bay / Vendor"
                  value={partForm.supplier}
                  onChange={(e) => setPartForm({ ...partForm, supplier: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPartModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  Insert Part into Tree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create BOM Master */}
      {showCreateBomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Initialize New Bill of Materials (BOM) Master
              </h3>
              <button
                onClick={() => setShowCreateBomModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBom} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">BOM Number</label>
                <input
                  type="text"
                  placeholder="e.g. BOM-2026-0092"
                  value={newBomForm.bomNumber}
                  onChange={(e) =>
                    setNewBomForm({ ...newBomForm, bomNumber: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Assembly Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Gantry X-Axis Carriage Assembly"
                  value={newBomForm.title}
                  onChange={(e) => setNewBomForm({ ...newBomForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Initial Revision</label>
                  <input
                    type="text"
                    value={newBomForm.revision}
                    onChange={(e) =>
                      setNewBomForm({ ...newBomForm, revision: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Currency</label>
                  <input
                    type="text"
                    value={newBomForm.currency}
                    onChange={(e) =>
                      setNewBomForm({ ...newBomForm, currency: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateBomModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  Create Master BOM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

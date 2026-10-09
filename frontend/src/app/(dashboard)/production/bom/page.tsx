'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  GitBranch,
  Plus,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit3,
  Box,
  Cpu,
  Package,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Percent,
  Hash,
  Scale,
  DollarSign,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ItemCategory = 'RAW_MATERIAL' | 'WIP' | 'FINISHED_GOOD' | 'CONSUMABLE' | 'SCRAP';

export interface BOMNode {
  id: string;
  itemId: string;
  code: string;
  name: string;
  category: ItemCategory;
  uom: string;
  quantity: number;
  scrapRate: number; // scrap tolerance %
  unitCost: number;
  notes?: string;
  customAttrs?: Record<string, any>;
  subBomId?: string | null;
  children?: BOMNode[];
}

export interface BOMHeader {
  id: string;
  bomNumber: string;
  name: string;
  version: string;
  finishedItemCode: string;
  finishedItemName: string;
  level: number;
  description: string;
  isActive: boolean;
  updatedAt: string;
  rootNodes: BOMNode[];
}

// Available item master catalog for adding components
export interface CatalogItem {
  id: string;
  code: string;
  name: string;
  category: ItemCategory;
  uom: string;
  currentStock: number;
  unitCost: number;
  customAttrs: Record<string, any>;
}

const itemMasterCatalog: CatalogItem[] = [
  {
    id: 'cat-1',
    code: 'RAW-STL-001',
    name: 'Cold-Rolled Carbon Steel Coil 1018',
    category: 'RAW_MATERIAL',
    uom: 'KG',
    currentStock: 6400,
    unitCost: 2.15,
    customAttrs: { grade: 'AISI 1018', thickness_mm: 2.5 },
  },
  {
    id: 'cat-2',
    code: 'RAW-SEAL-002',
    name: 'Fluorosilicone High-Temp O-Ring Seal',
    category: 'CONSUMABLE',
    uom: 'PCS',
    currentStock: 1200,
    unitCost: 4.5,
    customAttrs: { durometer: '75 Shore A', temp_range: '-60C to +230C' },
  },
  {
    id: 'cat-3',
    code: 'RAW-MTR-003',
    name: 'Brushless DC Coreless Motor 48V',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    currentStock: 95,
    unitCost: 148.0,
    customAttrs: { voltage: '48V DC', power: '750W' },
  },
  {
    id: 'cat-4',
    code: 'SA-PMP-HEAD',
    name: 'Machined Pump Head & Manifold Sub-Assembly',
    category: 'WIP',
    uom: 'PCS',
    currentStock: 40,
    unitCost: 165.0,
    customAttrs: { sub_level: 2, tolerance_microns: 12 },
  },
  {
    id: 'cat-5',
    code: 'SA-DRV-ASSY',
    name: 'Direct Drive Planetary Gearbox Sub-Assembly',
    category: 'WIP',
    uom: 'PCS',
    currentStock: 25,
    unitCost: 220.0,
    customAttrs: { gear_ratio: '5:1', torque_nm: 45 },
  },
  {
    id: 'cat-6',
    code: 'FAST-HEX-M12',
    name: 'Hex Flange Head Bolt M12x45 Grade 10.9',
    category: 'CONSUMABLE',
    uom: 'PCS',
    currentStock: 5000,
    unitCost: 0.85,
    customAttrs: { coating: 'Zinc Flake', grade: '10.9' },
  },
  {
    id: 'cat-7',
    code: 'BRG-6205-2RS',
    name: 'Deep Groove Radial Ball Bearing 25x52x15',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    currentStock: 450,
    unitCost: 8.75,
    customAttrs: { clearance: 'C3', seal_type: '2RS NBR' },
  },
  {
    id: 'cat-8',
    code: 'LUB-SYN-ISO220',
    name: 'Synthetic High-Load Gear Lubricant ISO VG 220',
    category: 'CONSUMABLE',
    uom: 'LTR',
    currentStock: 80,
    unitCost: 18.2,
    customAttrs: { viscosity: '220 cSt @ 40C' },
  },
  {
    id: 'cat-9',
    code: 'PLN-CRB-18MM',
    name: 'Tungsten Carbide Plunger Piston 18mm OD',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    currentStock: 120,
    unitCost: 42.0,
    customAttrs: { surface_finish: 'Ra 0.1', hardness_hra: 92 },
  },
  {
    id: 'cat-10',
    code: 'VLV-CHK-SS316',
    name: 'Stainless Steel 316 High-Pressure Check Valve Cartridge',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    currentStock: 310,
    unitCost: 26.5,
    customAttrs: { cracking_pressure_bar: 0.5, rating_bar: 600 },
  },
  {
    id: 'cat-11',
    code: 'GAU-PRS-001',
    name: 'Digital Glycerin Pressure Gauge 0-600 Bar G1/4',
    category: 'RAW_MATERIAL',
    uom: 'PCS',
    currentStock: 65,
    unitCost: 75.0,
    customAttrs: { accuracy: '0.25% FS', output: '4-20mA' },
  },
  {
    id: 'cat-12',
    code: 'PKG-CRATE-HD',
    name: 'ISPM-15 Certified Heavy Duty Wooden Export Crate',
    category: 'CONSUMABLE',
    uom: 'BOX',
    currentStock: 45,
    unitCost: 35.0,
    customAttrs: { dims_mm: '600x400x450', max_payload_kg: 150 },
  },
];

// Initial mock BOM recipes
const initialBOMs: BOMHeader[] = [
  {
    id: 'bom-1',
    bomNumber: 'BOM-PMP-100-MAIN',
    name: 'Industrial Triplex Plunger Pump 500 Bar System',
    version: '2.1',
    finishedItemCode: 'FG-PMP-100',
    finishedItemName: 'High Pressure Triplex Plunger Pump 500 Bar',
    level: 1,
    description: 'Heavy duty high pressure triplex plunger water jetting pump assembly with direct drive and unloader valve system.',
    isActive: true,
    updatedAt: '2026-03-28T09:40:00Z',
    rootNodes: [
      {
        id: 'node-sub-1',
        itemId: 'cat-4',
        code: 'SA-PMP-HEAD',
        name: 'Machined Pump Head & Manifold Sub-Assembly',
        category: 'WIP',
        uom: 'PCS',
        quantity: 1,
        scrapRate: 2.0,
        unitCost: 165.0,
        subBomId: 'bom-sub-head',
        notes: 'Pre-assembled in Clean Bay 2; pneumatic pressure test at 650 Bar required before main line feed.',
        customAttrs: { test_protocol: 'QC-MANIFOLD-650B', lead_time_days: 2 },
        children: [
          {
            id: 'node-child-1-1',
            itemId: 'cat-1',
            code: 'RAW-STL-001',
            name: 'Cold-Rolled Carbon Steel Coil 1018 (Billet Blank)',
            category: 'RAW_MATERIAL',
            uom: 'KG',
            quantity: 14.5,
            scrapRate: 4.5,
            unitCost: 2.15,
            notes: 'Machined from solid billet; shavings collected for recycling scrap credit.',
            customAttrs: { billet_cut_len_mm: 220, heat_spec: 'HT-2026' },
          },
          {
            id: 'node-child-1-2',
            itemId: 'cat-2',
            code: 'RAW-SEAL-002',
            name: 'Fluorosilicone High-Temp O-Ring Seal',
            category: 'CONSUMABLE',
            uom: 'PCS',
            quantity: 6,
            scrapRate: 3.0,
            unitCost: 4.5,
            notes: 'Install with fluorosilicone lubricant grease; do not nick sealing edges.',
            customAttrs: { cavity_id: 'C-01/C-06' },
          },
          {
            id: 'node-child-1-3',
            itemId: 'cat-6',
            code: 'FAST-HEX-M12',
            name: 'Hex Flange Head Bolt M12x45 Grade 10.9',
            category: 'CONSUMABLE',
            uom: 'PCS',
            quantity: 12,
            scrapRate: 1.0,
            unitCost: 0.85,
            notes: 'Torque to 85 Nm in criss-cross pattern using calibrated digital wrench.',
            customAttrs: { torque_nm: 85 },
          },
        ],
      },
      {
        id: 'node-sub-2',
        itemId: 'cat-5',
        code: 'SA-DRV-ASSY',
        name: 'Direct Drive Planetary Gearbox Sub-Assembly',
        category: 'WIP',
        uom: 'PCS',
        quantity: 1,
        scrapRate: 1.5,
        unitCost: 220.0,
        subBomId: 'bom-sub-gearbox',
        notes: 'Balanced to ISO G1.0 at 3000 RPM; fill with synthetic lubricant prior to sealing.',
        customAttrs: { balance_spec: 'ISO G1.0', oil_fill_ml: 750 },
        children: [
          {
            id: 'node-child-2-1',
            itemId: 'cat-3',
            code: 'RAW-MTR-003',
            name: 'Brushless DC Coreless Motor 48V',
            category: 'RAW_MATERIAL',
            uom: 'PCS',
            quantity: 1,
            scrapRate: 0.0,
            unitCost: 148.0,
            notes: 'Serial tracked component; verify Hall sensor phase alignment.',
            customAttrs: { serial_tracking: true },
          },
          {
            id: 'node-child-2-2',
            itemId: 'cat-7',
            code: 'BRG-6205-2RS',
            name: 'Deep Groove Radial Ball Bearing 25x52x15',
            category: 'RAW_MATERIAL',
            uom: 'PCS',
            quantity: 2,
            scrapRate: 1.5,
            unitCost: 8.75,
            notes: 'Induction heated press fit onto drive arbor at 110 deg C.',
            customAttrs: { press_temp_c: 110 },
          },
          {
            id: 'node-child-2-3',
            itemId: 'cat-8',
            code: 'LUB-SYN-ISO220',
            name: 'Synthetic High-Load Gear Lubricant ISO VG 220',
            category: 'CONSUMABLE',
            uom: 'LTR',
            quantity: 0.75,
            scrapRate: 4.0,
            unitCost: 18.2,
            notes: 'Automated metered syringe dispensing via robot cell #3.',
            customAttrs: { dispenser_id: 'ROB-DISP-03' },
          },
        ],
      },
      {
        id: 'node-direct-3',
        itemId: 'cat-9',
        code: 'PLN-CRB-18MM',
        name: 'Tungsten Carbide Plunger Piston 18mm OD',
        category: 'RAW_MATERIAL',
        uom: 'PCS',
        quantity: 3,
        scrapRate: 1.0,
        unitCost: 42.0,
        notes: 'Micro-polished surface; inspect under 50x optical scope for hairline micro-cracks.',
        customAttrs: { roughness_ra: 0.08 },
      },
      {
        id: 'node-direct-4',
        itemId: 'cat-10',
        code: 'VLV-CHK-SS316',
        name: 'Stainless Steel 316 High-Pressure Check Valve Cartridge',
        category: 'RAW_MATERIAL',
        uom: 'PCS',
        quantity: 6,
        scrapRate: 0.5,
        unitCost: 26.5,
        notes: '3 inlet suction valves, 3 outlet delivery valves; directional flow arrow.',
        customAttrs: { flow_direction_verified: true },
      },
      {
        id: 'node-direct-5',
        itemId: 'cat-11',
        code: 'GAU-PRS-001',
        name: 'Digital Glycerin Pressure Gauge 0-600 Bar G1/4',
        category: 'RAW_MATERIAL',
        uom: 'PCS',
        quantity: 1,
        scrapRate: 0.0,
        unitCost: 75.0,
        notes: 'Calibration certificate must be attached in final documentation packet.',
        customAttrs: { cal_cert_required: true },
      },
      {
        id: 'node-direct-6',
        itemId: 'cat-12',
        code: 'PKG-CRATE-HD',
        name: 'ISPM-15 Certified Heavy Duty Wooden Export Crate',
        category: 'CONSUMABLE',
        uom: 'BOX',
        quantity: 1,
        scrapRate: 0.0,
        unitCost: 35.0,
        notes: 'Include desiccant pack 500g and heat-sealed VCI anti-corrosion barrier film.',
        customAttrs: { ispm_stamp: 'IN-044-DB' },
      },
    ],
  },
  {
    id: 'bom-2',
    bomNumber: 'BOM-EV-BATTPACK-01',
    name: '48V 15kWh LiFePO4 Energy Storage Pack',
    version: '1.4',
    finishedItemCode: 'FG-BAT-15KWH',
    finishedItemName: '48V 15kWh Modular Energy Storage Battery Rack',
    level: 1,
    description: '16S LiFePO4 commercial energy storage unit with integrated active balance BMS and liquid cooling plate.',
    isActive: true,
    updatedAt: '2026-03-24T16:15:00Z',
    rootNodes: [
      {
        id: 'node-batt-sub-1',
        itemId: 'cat-3',
        code: 'RAW-MTR-003',
        name: 'LiFePO4 3.2V 300Ah Prismatic Battery Cell Set',
        category: 'RAW_MATERIAL',
        uom: 'PCS',
        quantity: 16,
        scrapRate: 0.5,
        unitCost: 78.0,
        notes: 'Matched IR < 0.25 mOhm, capacity variance < 0.5% across serial batch.',
      },
      {
        id: 'node-batt-sub-2',
        itemId: 'cat-6',
        code: 'FAST-HEX-M12',
        name: 'Tinned Copper Flexible Interconnect Busbars & Nuts',
        category: 'CONSUMABLE',
        uom: 'PCS',
        quantity: 15,
        scrapRate: 1.0,
        unitCost: 5.2,
        notes: 'Torque M6 cell terminal nuts to 6 Nm; apply anti-oxidation paste.',
      },
    ],
  },
];

// Helper to calculate total components, depth, and costs
function analyzeBOMTree(nodes: BOMNode[]) {
  let count = 0;
  let maxDepth = 1;
  let totalGrossCost = 0;
  let totalNetCost = 0;

  function traverse(list: BOMNode[], currentDepth: number, parentMultiplier: number) {
    if (currentDepth > maxDepth) maxDepth = currentDepth;
    for (const node of list) {
      count++;
      const netQty = node.quantity * parentMultiplier;
      const grossQty = netQty * (1 + node.scrapRate / 100);
      const cost = node.unitCost || 0;
      totalNetCost += netQty * cost;
      totalGrossCost += grossQty * cost;

      if (node.children && node.children.length > 0) {
        traverse(node.children, currentDepth + 1, netQty);
      }
    }
  }

  traverse(nodes, 1, 1);
  return {
    componentCount: count,
    maxDepth,
    totalNetCost,
    totalGrossCost,
    scrapCostDelta: totalGrossCost - totalNetCost,
  };
}

// Flatten tree for tabular summary
interface FlatBOMItem {
  id: string;
  level: number;
  code: string;
  name: string;
  category: ItemCategory;
  uom: string;
  netQty: number;
  scrapRate: number;
  grossQty: number;
  unitCost: number;
  totalCost: number;
  hasChildren: boolean;
  notes?: string;
}

function flattenBOMTree(nodes: BOMNode[]): FlatBOMItem[] {
  const result: FlatBOMItem[] = [];

  function traverse(list: BOMNode[], depth: number, parentScale: number) {
    for (const item of list) {
      const netQty = item.quantity * parentScale;
      const grossQty = Number((netQty * (1 + item.scrapRate / 100)).toFixed(3));
      const totalCost = Number((grossQty * item.unitCost).toFixed(2));
      result.push({
        id: item.id,
        level: depth,
        code: item.code,
        name: item.name,
        category: item.category,
        uom: item.uom,
        netQty,
        scrapRate: item.scrapRate,
        grossQty,
        unitCost: item.unitCost,
        totalCost,
        hasChildren: Boolean(item.children && item.children.length > 0),
        notes: item.notes,
      });

      if (item.children && item.children.length > 0) {
        traverse(item.children, depth + 1, netQty);
      }
    }
  }

  traverse(nodes, 1, 1);
  return result;
}

export default function BOMBuilderPage() {
  const [boms, setBoms] = useState<BOMHeader[]>(initialBOMs);
  const [selectedBomId, setSelectedBomId] = useState<string>('bom-1');
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TREE' | 'TABLE'>('TREE');

  // Modals & Drawers state
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [targetParentNodeId, setTargetParentNodeId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<BOMNode | null>(null);
  const [isCreateBOMModalOpen, setIsCreateBOMModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Form states for Add Component Drawer
  const [selectedCatalogItemId, setSelectedCatalogItemId] = useState(itemMasterCatalog[0].id);
  const [addQty, setAddQty] = useState('1');
  const [addScrapRate, setAddScrapRate] = useState('2.0');
  const [addNotes, setAddNotes] = useState('');

  // Form states for Create BOM Modal
  const [newBomNumber, setNewBomNumber] = useState('');
  const [newBomName, setNewBomName] = useState('');
  const [newBomVersion, setNewBomVersion] = useState('1.0');
  const [newBomDesc, setNewBomDesc] = useState('');
  const [newBomFinishedItem, setNewBomFinishedItem] = useState(itemMasterCatalog[3].id);

  // Active BOM
  const currentBOM = useMemo(() => {
    return boms.find((b) => b.id === selectedBomId) || boms[0];
  }, [boms, selectedBomId]);

  // Statistics
  const stats = useMemo(() => {
    return analyzeBOMTree(currentBOM.rootNodes);
  }, [currentBOM]);

  const flatList = useMemo(() => {
    return flattenBOMTree(currentBOM.rootNodes);
  }, [currentBOM]);

  const showNotification = (msg: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const toggleCollapse = (nodeId: string) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const expandAll = () => {
    setCollapsedNodes({});
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    const traverse = (list: BOMNode[]) => {
      for (const item of list) {
        if (item.children && item.children.length > 0) {
          next[item.id] = true;
          traverse(item.children);
        }
      }
    };
    traverse(currentBOM.rootNodes);
    setCollapsedNodes(next);
  };

  // Open Add Component Drawer targeting root or a specific parent
  const openAddDrawer = (parentNodeId: string | null = null) => {
    setTargetParentNodeId(parentNodeId);
    setSelectedCatalogItemId(itemMasterCatalog[0].id);
    setAddQty('1');
    setAddScrapRate('2.0');
    setAddNotes('');
    setIsAddDrawerOpen(true);
  };

  // Handle Submit Add Component
  const handleAddComponentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogItem = itemMasterCatalog.find((c) => c.id === selectedCatalogItemId);
    if (!catalogItem) return;

    const qty = parseFloat(addQty) || 1;
    const scrap = parseFloat(addScrapRate) || 0;

    const newNode: BOMNode = {
      id: `node-${Date.now()}`,
      itemId: catalogItem.id,
      code: catalogItem.code,
      name: catalogItem.name,
      category: catalogItem.category,
      uom: catalogItem.uom,
      quantity: qty,
      scrapRate: scrap,
      unitCost: catalogItem.unitCost,
      notes: addNotes.trim() || undefined,
      customAttrs: catalogItem.customAttrs,
      children: catalogItem.category === 'WIP' ? [] : undefined,
    };

    setBoms((prevBoms) => {
      return prevBoms.map((bom) => {
        if (bom.id !== currentBOM.id) return bom;

        if (!targetParentNodeId) {
          return {
            ...bom,
            rootNodes: [...bom.rootNodes, newNode],
          };
        }

        const appendRecursively = (nodes: BOMNode[]): BOMNode[] => {
          return nodes.map((node) => {
            if (node.id === targetParentNodeId) {
              return {
                ...node,
                children: [...(node.children || []), newNode],
              };
            }
            if (node.children && node.children.length > 0) {
              return {
                ...node,
                children: appendRecursively(node.children),
              };
            }
            return node;
          });
        };

        return {
          ...bom,
          rootNodes: appendRecursively(bom.rootNodes),
        };
      });
    });

    setIsAddDrawerOpen(false);
    showNotification(`Component '${catalogItem.code}' added to ${targetParentNodeId ? 'sub-assembly' : 'BOM recipe'}.`);
  };

  // Open Edit Node
  const openEditModal = (node: BOMNode) => {
    setEditingNode({ ...node });
    setIsEditModalOpen(true);
  };

  // Submit Edit Node
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNode) return;

    setBoms((prevBoms) => {
      return prevBoms.map((bom) => {
        if (bom.id !== currentBOM.id) return bom;

        const updateRecursively = (nodes: BOMNode[]): BOMNode[] => {
          return nodes.map((node) => {
            if (node.id === editingNode.id) {
              return {
                ...node,
                quantity: editingNode.quantity,
                scrapRate: editingNode.scrapRate,
                notes: editingNode.notes,
              };
            }
            if (node.children && node.children.length > 0) {
              return {
                ...node,
                children: updateRecursively(node.children),
              };
            }
            return node;
          });
        };

        return {
          ...bom,
          rootNodes: updateRecursively(bom.rootNodes),
        };
      });
    });

    setIsEditModalOpen(false);
    showNotification(`Updated item '${editingNode.code}' (Qty: ${editingNode.quantity}, Scrap: ${editingNode.scrapRate}%).`);
    setEditingNode(null);
  };

  // Delete Node
  const handleDeleteNode = (nodeId: string, nodeCode: string) => {
    if (!confirm(`Are you sure you want to remove '${nodeCode}' from this BOM recipe?`)) return;

    setBoms((prevBoms) => {
      return prevBoms.map((bom) => {
        if (bom.id !== currentBOM.id) return bom;

        const deleteRecursively = (nodes: BOMNode[]): BOMNode[] => {
          return nodes
            .filter((node) => node.id !== nodeId)
            .map((node) => ({
              ...node,
              children: node.children ? deleteRecursively(node.children) : undefined,
            }));
        };

        return {
          ...bom,
          rootNodes: deleteRecursively(bom.rootNodes),
        };
      });
    });

    showNotification(`Removed component '${nodeCode}' from BOM.`);
  };

  // Create new BOM
  const handleCreateBOMSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBomNumber.trim() || !newBomName.trim()) return;

    const item = itemMasterCatalog.find((i) => i.id === newBomFinishedItem) || itemMasterCatalog[0];

    const newHeader: BOMHeader = {
      id: `bom-${Date.now()}`,
      bomNumber: newBomNumber.trim().toUpperCase(),
      name: newBomName.trim(),
      version: newBomVersion.trim() || '1.0',
      finishedItemCode: item.code,
      finishedItemName: item.name,
      level: 1,
      description: newBomDesc.trim() || 'Custom manufacturing recipe',
      isActive: true,
      updatedAt: new Date().toISOString(),
      rootNodes: [],
    };

    setBoms((prev) => [newHeader, ...prev]);
    setSelectedBomId(newHeader.id);
    setIsCreateBOMModalOpen(false);
    setNewBomNumber('');
    setNewBomName('');
    showNotification(`Created new BOM recipe '${newHeader.bomNumber}'.`);
  };

  // Category Badge Renderer
  const renderCategoryBadge = (category: ItemCategory) => {
    switch (category) {
      case 'RAW_MATERIAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Raw Material
          </span>
        );
      case 'WIP':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Sub-Assembly (WIP)
          </span>
        );
      case 'CONSUMABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Consumable / Hardware
          </span>
        );
      case 'FINISHED_GOOD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Finished Good
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {category}
          </span>
        );
    }
  };

  // Filter check helper
  const matchesFilter = (node: BOMNode): boolean => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      node.code.toLowerCase().includes(q) ||
      node.name.toLowerCase().includes(q) ||
      (node.notes && node.notes.toLowerCase().includes(q));

    const matchesCat = categoryFilter === 'ALL' || node.category === categoryFilter;

    if (matchesSearch && matchesCat) return true;

    // Check children
    if (node.children && node.children.length > 0) {
      return node.children.some((c) => matchesFilter(c));
    }
    return false;
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: BOMNode, level: number = 1, isLast: boolean = false) => {
    if (!matchesFilter(node)) return null;

    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isCollapsed = Boolean(collapsedNodes[node.id]);
    const grossQty = Number((node.quantity * (1 + node.scrapRate / 100)).toFixed(3));
    const totalLineCost = Number((grossQty * node.unitCost).toFixed(2));

    return (
      <div key={node.id} className="relative group">
        {/* Connector line for nested levels */}
        {level > 1 && (
          <div
            className={cn(
              'absolute -left-6 top-6 w-5 border-b-2 border-slate-200 dark:border-slate-800',
              'group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors'
            )}
          />
        )}

        {/* Tree Node Card */}
        <div
          className={cn(
            'relative rounded-xl border p-4 mb-3 transition-all duration-150',
            hasChildren
              ? 'bg-slate-50/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-blue-300 dark:hover:border-blue-700/60'
          )}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Expand Caret + Code + Badges */}
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleCollapse(node.id)}
                  className="mt-0.5 sm:mt-0 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  title={isCollapsed ? 'Expand sub-components' : 'Collapse sub-components'}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ) : (
                <div className="w-6 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
              )}

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {node.code}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {node.name}
                  </h4>
                  {renderCategoryBadge(node.category)}

                  {hasChildren && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      {node.children?.length} child components
                    </span>
                  )}
                </div>

                {node.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{node.notes}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quantity, Scrap Tolerance %, Cost & Actions */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 ml-9 lg:ml-0">
              {/* Quantity Required */}
              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-400 font-medium">Net Required</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {node.quantity}{' '}
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {node.uom}
                  </span>
                </div>
              </div>

              {/* Scrap Tolerance % */}
              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-400 font-medium flex items-center sm:justify-end gap-1">
                  <span>Scrap Tol.</span>
                  {node.scrapRate > 0 && (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      node.scrapRate > 2
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-700 dark:text-slate-300'
                    )}
                  >
                    {node.scrapRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Gross Demand (Qty + Scrap) */}
              <div className="text-left sm:text-right bg-slate-100/70 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  Gross Demand
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {grossQty}{' '}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    {node.uom}
                  </span>
                </div>
              </div>

              {/* Unit & Rolled-up Cost */}
              <div className="hidden md:block text-right">
                <div className="text-xs text-slate-400 font-medium">Gross Cost</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  ${totalLineCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Add Sub-component (allowed for WIP / Sub-assembly) */}
                {node.category === 'WIP' && (
                  <button
                    type="button"
                    onClick={() => openAddDrawer(node.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/50 transition-colors"
                    title="Add child component to this sub-assembly"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}

                {/* Edit component */}
                <button
                  type="button"
                  onClick={() => openEditModal(node)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/50 transition-colors"
                  title="Edit quantity and scrap tolerance"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete component */}
                <button
                  type="button"
                  onClick={() => handleDeleteNode(node.id, node.code)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
                  title="Remove component"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nested Child Nodes */}
        {hasChildren && !isCollapsed && (
          <div className="pl-6 ml-3 sm:ml-5 border-l-2 border-slate-200 dark:border-slate-800">
            {node.children!.map((child, idx) =>
              renderTreeNode(child, level + 1, idx === node.children!.length - 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Bill of Materials (BOM)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Interactive Recipe Builder
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Construct multi-level production engineering trees, quantify component consumption, and set scrap tolerances.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const exportData = JSON.stringify(currentBOM, null, 2);
              navigator.clipboard?.writeText(exportData);
              showNotification(`Copied '${currentBOM.bomNumber}' JSON recipe to clipboard!`);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Spec
          </button>

          <button
            type="button"
            onClick={() => setIsCreateBOMModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            New Recipe
          </button>

          <button
            type="button"
            onClick={() => openAddDrawer(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Component
          </button>
        </div>
      </div>

      {/* BOM Selector & Metadata Banner */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Active Recipe
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Release
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {currentBOM.name}
              </h2>
            </div>
          </div>

          {/* BOM Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Select Recipe:</span>
            <select
              value={selectedBomId}
              onChange={(e) => setSelectedBomId(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {boms.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bomNumber} (v{b.version}) - {b.finishedItemCode}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Finished Product Specs & Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Finished Product</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {currentBOM.finishedItemCode}
            </div>
            <div className="text-xs text-slate-500 truncate mt-0.5">
              {currentBOM.finishedItemName}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Engineering Revision</div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              Revision {currentBOM.version}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Updated {new Date(currentBOM.updatedAt).toLocaleDateString()}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Assembly Complexity</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {stats.componentCount} Components Across {stats.maxDepth} Levels
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Multi-Level Sub-Assembly Routing
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Rolled-Up Gross Cost</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              ${stats.totalGrossCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-amber-500 mt-0.5">
              +${stats.scrapCostDelta.toFixed(2)} scrap tolerance buffer
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & View Modes */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search components by SKU, name, or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="RAW_MATERIAL">Raw Materials</option>
            <option value="WIP">Sub-Assemblies (WIP)</option>
            <option value="CONSUMABLE">Consumables / Fasteners</option>
          </select>
        </div>

        {/* Tree Actions: Expand/Collapse & View Toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {viewMode === 'TREE' && (
            <>
              <button
                type="button"
                onClick={expandAll}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              >
                Collapse All
              </button>
            </>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('TREE')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'TREE'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              <GitBranch className="w-3.5 h-3.5" />
              Tree View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'TABLE'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Exploded Roll-up
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Tree View or Exploded Table View */}
      {viewMode === 'TREE' ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
          {/* Root Finished Product Node Banner */}
          <div className="mb-6 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                L1
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                    {currentBOM.finishedItemCode}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200">
                    Finished Assembly
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {currentBOM.finishedItemName}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAddDrawer(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Direct Component
            </button>
          </div>

          {/* Tree Structure */}
          {currentBOM.rootNodes.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-medium">This BOM currently has no components defined.</p>
              <p className="text-xs text-slate-400 mt-1">
                Click &ldquo;Add Component&rdquo; to start assembling materials and child sub-assemblies.
              </p>
              <button
                type="button"
                onClick={() => openAddDrawer(null)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add First Component
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {currentBOM.rootNodes.map((node, idx) =>
                renderTreeNode(node, 1, idx === currentBOM.rootNodes.length - 1)
              )}
            </div>
          )}
        </div>
      ) : (
        /* Exploded Roll-Up Table View */
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Item Code</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Net Qty</th>
                  <th className="py-3 px-4 text-right">Scrap %</th>
                  <th className="py-3 px-4 text-right">Gross Qty</th>
                  <th className="py-3 px-4 text-right">Unit Cost</th>
                  <th className="py-3 px-4 text-right">Gross Total Cost</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {flatList.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      {'— '.repeat(row.level - 1)}L{row.level}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {row.code}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {row.name}
                    </td>
                    <td className="py-3 px-4">{renderCategoryBadge(row.category)}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                      {row.netQty} {row.uom}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={cn(
                          'font-semibold',
                          row.scrapRate > 0
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-400'
                        )}
                      >
                        {row.scrapRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-600 dark:text-blue-400">
                      {row.grossQty} {row.uom}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      ${row.unitCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      ${row.totalCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const target = currentBOM.rootNodes.find((n) => n.id === row.id);
                          if (target) openEditModal(target);
                        }}
                        className="p-1 text-slate-500 hover:text-blue-600"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100">
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-right uppercase text-xs text-slate-500">
                    Grand Total Recipe Roll-Up
                  </td>
                  <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">
                    {stats.componentCount} Items
                  </td>
                  <td className="py-3 px-4 text-right">—</td>
                  <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">
                    ${stats.totalGrossCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Slide-Over Drawer: Add Component */}
      {/* ========================================================================= */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Add Component to Recipe
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {targetParentNodeId
                      ? 'Attaching as sub-component under selected assembly'
                      : 'Attaching as primary level-1 component'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form */}
              <form onSubmit={handleAddComponentSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Component Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Item from Catalog <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedCatalogItemId}
                    onChange={(e) => setSelectedCatalogItemId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {itemMasterCatalog.map((item) => (
                      <option key={item.id} value={item.id}>
                        [{item.category}] {item.code} - {item.name} (${item.unitCost} / {item.uom})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Net Required Quantity & UOM */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Required Quantity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.001"
                      value={addQty}
                      onChange={(e) => setAddQty(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Scrap Tolerance % <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={addScrapRate}
                      onChange={(e) => setAddScrapRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Real-time Calculation Preview Card */}
                {(() => {
                  const q = parseFloat(addQty) || 0;
                  const s = parseFloat(addScrapRate) || 0;
                  const gross = (q * (1 + s / 100)).toFixed(3);
                  const selected = itemMasterCatalog.find((c) => c.id === selectedCatalogItemId);
                  const cost = selected ? (parseFloat(gross) * selected.unitCost).toFixed(2) : '0.00';

                  return (
                    <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2">
                      <div className="text-xs font-semibold text-blue-900 dark:text-blue-300 flex items-center justify-between">
                        <span>Gross Material Demand Preview</span>
                        <Percent className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {gross} {selected?.uom}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Calculated as {q} net + {s}% scrap allowance. Est. Gross Cost: ${cost}
                      </p>
                    </div>
                  );
                })()}

                {/* Engineering Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Assembly & Quality Inspection Notes
                  </label>
                  <textarea
                    rows={3}
                    value={addNotes}
                    onChange={(e) => setAddNotes(e.target.value)}
                    placeholder="e.g. Torque specs, clean bay requirements, sealant type..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Drawer Footer Actions */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddDrawerOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                  >
                    Insert Component
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: Edit Component */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Edit BOM Item
                </h3>
                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                  {editingNode.code} — {editingNode.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Required Quantity ({editingNode.uom})
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.001"
                    value={editingNode.quantity}
                    onChange={(e) =>
                      setEditingNode({ ...editingNode, quantity: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Scrap Tolerance %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editingNode.scrapRate}
                    onChange={(e) =>
                      setEditingNode({ ...editingNode, scrapRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assembly & Quality Notes
                </label>
                <textarea
                  rows={3}
                  value={editingNode.notes || ''}
                  onChange={(e) => setEditingNode({ ...editingNode, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: Create New BOM Recipe */}
      {/* ========================================================================= */}
      {isCreateBOMModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setIsCreateBOMModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Create New Bill of Materials Recipe
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Define parent finished item SKU, version, and engineering notes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateBOMModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBOMSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    BOM Number / Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BOM-CNC-001"
                    value={newBomNumber}
                    onChange={(e) => setNewBomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Revision / Version
                  </label>
                  <input
                    type="text"
                    value={newBomVersion}
                    onChange={(e) => setNewBomVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipe Title / Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5-Axis High Precision CNC Spindle Assembly"
                  value={newBomName}
                  onChange={(e) => setNewBomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Finished Parent Item SKU <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newBomFinishedItem}
                  onChange={(e) => setNewBomFinishedItem(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {itemMasterCatalog.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.code} — {i.name} ({i.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Engineering Scope Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Scope of work, standard routing reference, clean bay requirements..."
                  value={newBomDesc}
                  onChange={(e) => setNewBomDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateBOMModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

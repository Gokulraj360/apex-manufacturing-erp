'use client';

import React, { useState } from 'react';
import {
  Scroll,
  FileCode,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  Search,
  ExternalLink,
  Cpu,
  Compass,
} from 'lucide-react';
import { RecipeItem } from '@/types/production';

const mockRecipes: RecipeItem[] = [
  {
    id: 'bom-1',
    sku: 'SKU-TITAN-X1',
    name: 'Titanium Truss Spacecraft Strut',
    version: '2.4',
    description: 'High-tensile Grade 5 Titanium hollow strut assembly engineered for low-Earth orbit satellites.',
    blueprintUrl: 'https://cad.apexerp.internal/drawings/TITAN-X1-REV4.pdf',
    blueprintSpecifications: {
      alloyGrade: 'Titanium Ti-6Al-4V Grade 5',
      toleranceMm: '±0.005mm',
      tensileStrengthMpa: 950,
      surfaceFinishRa: '0.4 μm',
      cadRevision: 'CAD-REV-D',
    },
    components: [
      { partNumber: 'PART-TI-TUBE-01', description: 'Extruded Seamless Titanium Tube 45mm x 1200mm', quantityRequired: 1, uom: 'EA', unitCost: 450 },
      { partNumber: 'PART-CNC-ENDCAP-L', description: 'Left Billet CNC Threaded Fitting Endcap', quantityRequired: 1, uom: 'EA', unitCost: 180 },
      { partNumber: 'PART-CNC-ENDCAP-R', description: 'Right Billet CNC Threaded Fitting Endcap', quantityRequired: 1, uom: 'EA', unitCost: 180 },
      { partNumber: 'PART-ROD-INSERT', description: 'Internal Damping Polymer Honeycomb Core', quantityRequired: 1, uom: 'EA', unitCost: 65 },
    ],
    routings: [
      {
        id: 'r-1',
        stepNumber: 1,
        stationName: 'CNC Saw Cut & Chamfer',
        instruction: 'Cut extruded tube to 1198.5mm length and turn 30-degree chamfers on both internal lips.',
        cycleTimeMinutes: 8,
        toolingRequired: 'Carbide Cold Saw & Lathe Collet Chuck',
        qualityCheckpoints: [{ checkpoint: 'Length verification with Vernier Gauge', specTolerance: '1198.5mm ±0.1mm', isMandatory: true }],
      },
      {
        id: 'r-2',
        stepNumber: 2,
        stationName: 'TIG Robotic Electron Beam Welding',
        instruction: 'Insert left/right endcaps. Purge interior with Argon gas. Execute 360-degree orbital circumferential weld.',
        cycleTimeMinutes: 16,
        toolingRequired: 'Orbital TIG Torch & Rotary Positioner',
        qualityCheckpoints: [{ checkpoint: 'X-Ray weld porosity penetration check', specTolerance: 'Zero internal micro-fissures', isMandatory: true }],
      },
      {
        id: 'r-3',
        stepNumber: 3,
        stationName: 'Vacuum Heat Treatment & Stress Relief',
        instruction: 'Load into Vacuum Furnace. Ramp up to 600°C for 2 hours. Controlled argon quench.',
        cycleTimeMinutes: 120,
        toolingRequired: 'Furnace Chamber 03',
        qualityCheckpoints: [{ checkpoint: 'Hardness Rockwell C Test', specTolerance: '36 HRC ±2', isMandatory: true }],
      },
      {
        id: 'r-4',
        stepNumber: 4,
        stationName: 'CMM Coordinate Inspection & Packaging',
        instruction: 'Mount on Zeiss CMM Granite Table. Probe 18 coordinate datums and package in nitrogen sealed bag.',
        cycleTimeMinutes: 12,
        toolingRequired: 'Zeiss Prismo CMM Touch Probe',
        qualityCheckpoints: [{ checkpoint: 'True position of mounting holes', specTolerance: '0.005mm concentricity', isMandatory: true }],
      },
    ],
  },
  {
    id: 'bom-2',
    sku: 'SKU-FRAME-W2',
    name: 'Cast Aluminum EV Subframe',
    version: '1.8',
    description: 'Integral cast aluminum rear cradle for electric vehicle battery pack and drive axle integration.',
    blueprintUrl: 'https://cad.apexerp.internal/drawings/FRAME-W2-PROD.pdf',
    blueprintSpecifications: {
      alloyGrade: 'A356.0-T6 Die-Cast Aluminum',
      toleranceMm: '±0.020mm',
      tensileStrengthMpa: 280,
      surfaceFinishRa: '1.6 μm',
      cadRevision: 'CAD-REV-C2',
    },
    components: [
      { partNumber: 'PART-AL-CASTING-RAW', description: 'Raw Subframe Die-Casting Blank', quantityRequired: 1, uom: 'EA', unitCost: 320 },
      { partNumber: 'PART-BUSHING-URETHANE', description: 'Suspension Isolation Bushings', quantityRequired: 4, uom: 'SET', unitCost: 45 },
      { partNumber: 'PART-BOLT-M12-10.9', description: 'High-Torque Flange Fasteners', quantityRequired: 8, uom: 'EA', unitCost: 4 },
    ],
    routings: [
      {
        id: 'r-5',
        stepNumber: 1,
        stationName: '5-Axis Haas CNC Gantry Milling',
        instruction: 'Probe raw casting datums. Mill 6 motor mounting bosses and drill precision bushing bores.',
        cycleTimeMinutes: 28,
        toolingRequired: 'Face Mill & Solid Carbide Reamers',
        qualityCheckpoints: [{ checkpoint: 'Bore diameter dimensional check', specTolerance: '60.00mm +0.01/-0.00', isMandatory: true }],
      },
      {
        id: 'r-6',
        stepNumber: 2,
        stationName: 'Ultrasonic De-Burr & Aqueous Wash',
        instruction: 'Submerge in heated chemical wash at 65°C to flush all swarf and coolant chips.',
        cycleTimeMinutes: 14,
        toolingRequired: 'Wash Tank 02',
        qualityCheckpoints: [{ checkpoint: 'Residual particulate gravimetric test', specTolerance: '< 5mg total contamination', isMandatory: true }],
      },
    ],
  },
];

export default function RecipesPage() {
  const [recipes] = useState<RecipeItem[]>(mockRecipes);
  const [selectedSku, setSelectedSku] = useState<string>(mockRecipes[0].sku);

  const selectedRecipe = recipes.find((r) => r.sku === selectedSku) || recipes[0];
  const totalBOMCost = selectedRecipe.components.reduce((acc, c) => acc + (c.quantityRequired * c.unitCost), 0);
  const totalCycleTime = selectedRecipe.routings.reduce((acc, r) => acc + r.cycleTimeMinutes, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Scroll className="h-6 w-6 text-blue-500" />
            Engineering Recipes, Blueprints & Assembly Routings (BOM)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Certified technical specifications, component bill of materials, and step-by-step station routing instructions.
          </p>
        </div>

        {/* SKU Selector */}
        <div className="flex items-center gap-2">
          {recipes.map((r) => (
            <button
              key={r.sku}
              type="button"
              onClick={() => setSelectedSku(r.sku)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                selectedSku === r.sku
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r.sku}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Recipe Header Overview Card */}
      <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-white">
                {selectedRecipe.sku}
              </span>
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                v{selectedRecipe.version} RELEASED
              </span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                Approved by Chief Engineer
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-200 mt-1">
              {selectedRecipe.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {selectedRecipe.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-right">
              <div className="text-slate-400">Total Component Cost</div>
              <div className="text-base font-bold text-emerald-400">${totalBOMCost.toFixed(2)}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-right">
              <div className="text-slate-400">Cycle Time</div>
              <div className="text-base font-bold text-cyan-400">{totalCycleTime} mins</div>
            </div>
          </div>
        </div>

        {/* Blueprint Specifications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Alloy Grade</span>
            <strong className="text-slate-200 font-medium">{selectedRecipe.blueprintSpecifications.alloyGrade}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Machining Tolerance</span>
            <strong className="text-cyan-400 font-mono font-medium">{selectedRecipe.blueprintSpecifications.toleranceMm}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Tensile Strength</span>
            <strong className="text-slate-200 font-mono font-medium">{selectedRecipe.blueprintSpecifications.tensileStrengthMpa} MPa</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Surface Finish (Ra)</span>
            <strong className="text-slate-200 font-mono font-medium">{selectedRecipe.blueprintSpecifications.surfaceFinishRa}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">CAD Blueprint</span>
            <span className="text-blue-400 font-mono flex items-center gap-1 cursor-pointer hover:underline">
              {selectedRecipe.blueprintSpecifications.cadRevision} <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Bill of Materials vs Assembly Routing Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bill of Materials (Components) */}
        <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              Bill of Materials (Raw Components)
            </h4>
            <span className="text-xs text-slate-400 font-mono">{selectedRecipe.components.length} Line Items</span>
          </div>

          <div className="space-y-2.5">
            {selectedRecipe.components.map((comp) => (
              <div
                key={comp.partNumber}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-mono font-semibold text-white">
                    {comp.partNumber}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {comp.description}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-slate-200">
                    Qty: <strong>{comp.quantityRequired} {comp.uom}</strong>
                  </div>
                  <div className="font-mono text-emerald-400 text-[11px]">
                    ${comp.unitCost.toFixed(2)}/unit
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Assembly Routing Instructions */}
        <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-blue-400" />
              Assembly Routing & Quality Gates
            </h4>
            <span className="text-xs text-slate-400 font-mono">{selectedRecipe.routings.length} Stages</span>
          </div>

          <div className="space-y-4">
            {selectedRecipe.routings.map((step) => (
              <div
                key={step.id}
                className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    <span className="h-5 w-5 rounded bg-blue-600/30 text-blue-400 flex items-center justify-center font-mono text-[11px]">
                      {step.stepNumber}
                    </span>
                    <span>{step.stationName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {step.cycleTimeMinutes} mins
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] pl-7">
                  {step.instruction}
                </p>

                {step.toolingRequired && (
                  <div className="text-[11px] text-slate-400 pl-7">
                    Tooling: <strong className="text-slate-300">{step.toolingRequired}</strong>
                  </div>
                )}

                {step.qualityCheckpoints && step.qualityCheckpoints.length > 0 && (
                  <div className="pl-7 pt-1">
                    {step.qualityCheckpoints.map((qc, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle className="h-3 w-3 flex-shrink-0" />
                        <span>Quality Gate: {qc.checkpoint} &bull; Spec: {qc.specTolerance}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

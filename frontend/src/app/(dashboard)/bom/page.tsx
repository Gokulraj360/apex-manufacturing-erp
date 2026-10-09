'use client';

import React from 'react';
import { FileSpreadsheet, Plus, ArrowRight, Layers, Cpu, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function BomPage() {
  const boms = [
    {
      bomNumber: 'BOM-CHASSIS-001',
      version: 'v1.0',
      finishedGood: 'Industrial Chassis Sub-Assembly v4',
      sku: 'FG-CHASSIS-MOD4',
      componentsCount: 2,
      routingOperationsCount: 4,
      status: 'ACTIVE',
      components: [
        { name: 'Aerospace Grade Aluminum 6061 Sheet', sku: 'RAW-ALUM-6061', qty: '18.50 KG', scrap: '2.0%' },
        { name: 'High-Tensile Hex Bolt M8x30', sku: 'RAW-HEX-M8', qty: '16.00 PCS', scrap: '1.0%' },
      ],
      routing: ['CNC Laser Cutting (45m)', 'CNC Bending (30m)', 'TIG Robotic Welding (60m)', 'CMM Inspection (20m)'],
    },
    {
      bomNumber: 'BOM-POWER-MODULE-02',
      version: 'v2.1',
      finishedGood: 'Servo Drive Inverter Module 400V',
      sku: 'FG-INVERT-400V',
      componentsCount: 6,
      routingOperationsCount: 3,
      status: 'ACTIVE',
      components: [
        { name: 'IGBT High Power Module 1200V', sku: 'RAW-IGBT-1200', qty: '3.00 PCS', scrap: '0.5%' },
        { name: 'Extruded Heatsink Alloy 6063', sku: 'RAW-HSINK-AL', qty: '1.00 PCS', scrap: '0%' },
      ],
      routing: ['SMT Component Placement', 'Reflow Soldering', 'Automated Optical Inspection (AOI)'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bill of Materials (BOM) & Routing</h1>
          <p className="text-sm text-muted-foreground">
            Multi-level manufacturing recipes, component explosion, scrap tolerances, and shop floor routings.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create BOM
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {boms.map((bom) => (
          <Card key={bom.bomNumber} className="overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                  <CardTitle className="font-mono text-base">{bom.bomNumber}</CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">{bom.version}</Badge>
                  <Badge variant="success" className="text-[10px]">{bom.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Finished Item: <span className="text-foreground">{bom.finishedGood}</span> ({bom.sku})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Revise Engineering Version
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Components Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Component Materials ({bom.componentsCount})
                </h4>
                <div className="divide-y divide-border border border-border rounded-md">
                  {bom.components.map((comp, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-foreground">{comp.name}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">{comp.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{comp.qty}</p>
                        <p className="text-[10px] text-muted-foreground">Scrap: {comp.scrap}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manufacturing Routing Steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Routing Sequence ({bom.routingOperationsCount} Operations)
                </h4>
                <div className="space-y-1.5">
                  {bom.routing.map((op, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs bg-muted/30 border border-border rounded-md px-3 py-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-foreground">{op}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
